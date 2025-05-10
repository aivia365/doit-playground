import { Request, Response } from "express";
import { loginSchema, signupSchema } from "../validators/auth.js";
import bcryptjs from "bcryptjs";
import prisma from "../db/prisma.js";
import generateToken from "../utils/generateToken.js";
import cloudinary from "../utils/cloudinary.js";

export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ error: result.error.flatten().fieldErrors });
    }

    const { username, email, password, fullName, profilePic } = result.data;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      const isEmail = existingUser.email === email;
      const isUsername = existingUser.username === username;
      return res.status(400).json({
        error: {
          ...(isEmail && { email: ["Email already in use"] }),
          ...(isUsername && { username: ["Username already taken"] }),
        },
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    let uploadedPicUrl: string | null = null;
    if (profilePic) {
      try {
        const uploadRes = await cloudinary.uploader.upload(profilePic, {
          folder: "profile_pics",
          resource_type: "image",
          transformation: [{ width: 300, height: 300, crop: "fill" }],
        });
        uploadedPicUrl = uploadRes.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary Upload Failed:", uploadErr);
        return res.status(400).json({
          error: { profilePic: ["Failed to upload image. Try again."] },
        });
      }
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        fullName,
        profilePic: uploadedPicUrl,
      },
    });

    generateToken(user.id, res);

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
    });
  } catch (error: any) {
    console.log("Error in Signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ error: result.error.flatten().fieldErrors });
    }
    const { username, password } = result.data;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res
        .status(400)
        .json({ error: { username: ["Invalid credentials"] } });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ error: { password: ["Invalid credentials"] } });
    }

    generateToken(user.id, res);

    res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error: any) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
