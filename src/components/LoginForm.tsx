
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from './ui/use-toast';
import { ChevronRight, User, UserPlus, Shield } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
  role: 'student' | 'admin' | null;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    role: null,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleSelect = (role: 'student' | 'admin') => {
    setFormData({
      ...formData,
      role,
    });
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password || !formData.role) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields and select a role.",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // This is just a mock login - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful login
      const route = formData.role === 'admin' ? '/admin-dashboard' : '/student-dashboard';
      navigate(route);
      
      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${formData.role}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 glass-card rounded-2xl animate-fade-in">
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-2xl font-semibold">Welcome Back</h1>
        <p className="text-gray-500">Sign in to continue to your dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-center gap-4 mb-6">
            <button
              type="button"
              onClick={() => handleRoleSelect('student')}
              className={`role-btn flex items-center gap-2 ${
                formData.role === 'student' ? 'active' : ''
              }`}
            >
              <User size={18} />
              Student
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`role-btn flex items-center gap-2 ${
                formData.role === 'admin' ? 'active' : ''
              }`}
            >
              <Shield size={18} />
              Admin
            </button>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              className="input-field"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              className="input-field"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Signing in...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Sign In
              <ChevronRight size={18} />
            </div>
          )}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
