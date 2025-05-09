
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { LogIn, LogOut, User } from 'lucide-react';

const UserProfile = () => {
  const { user, login, logout, isLoggedIn } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    if (email && password.length >= 6) {
      setIsLoginOpen(false);
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="flex items-center">
      {isLoggedIn ? (
        <div className="flex items-center">
          <img 
            src={user?.avatar || "https://i.pravatar.cc/150?img=68"} 
            alt={user?.name || "User"} 
            className="w-10 h-10 rounded-full mr-3" 
          />
          <div className="flex flex-col">
            <span className="font-semibold">{user?.name}</span>
            <span className="text-xs text-gray-500">{user?.email}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-2" 
            onClick={logout}
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => setIsLoginOpen(true)}
        >
          <User className="w-5 h-5" />
          <span>Login</span>
        </Button>
      )}

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">Demo: Any email and password with 6+ characters will work</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsLoginOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfile;
