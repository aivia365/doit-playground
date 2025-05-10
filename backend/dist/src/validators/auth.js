import { z } from "zod";
const MAX_IMAGE_SIZE_BYTES = 1 * 1024 * 1024; // 1MB
export const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});
export const signupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    profilePic: z
        .string()
        .optional()
        .refine((val) => !val || val.startsWith("data:image/") || /^https?:\/\//.test(val), { message: "Profile picture must be a base64 image or a valid URL" })
        .refine((val) => {
        if (!val || !val.startsWith("data:image/"))
            return true;
        const base64Str = val.split(",")[1];
        const byteLength = (base64Str.length * 3) / 4 -
            (base64Str.endsWith("==") ? 2 : base64Str.endsWith("=") ? 1 : 0);
        return byteLength <= MAX_IMAGE_SIZE_BYTES;
    }, { message: "Profile picture must be less than 1MB" }),
});
