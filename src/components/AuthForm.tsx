
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Mail, Lock, User, Zap } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isMagicLink, setIsMagicLink] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithMagicLink } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log(`Attempting ${isMagicLink ? 'magic link' : (isLogin ? 'login' : 'signup')} with email:`, email);

    try {
      if (isMagicLink) {
        console.log('Calling signInWithMagicLink function...');
        const { error } = await signInWithMagicLink(email);
        console.log('Magic link response:', { error });
        
        if (error) {
          console.error('Magic link error:', error);
          toast({
            title: "Magic Link Error",
            description: error.message || "Failed to send magic link. Please try again.",
            variant: "destructive",
          });
        } else {
          console.log('Magic link sent successfully');
          toast({
            title: "Magic Link Sent!",
            description: "Check your email for a magic link to sign in.",
          });
        }
      } else if (isLogin) {
        console.log('Calling signIn function...');
        const { error } = await signIn(email, password);
        console.log('SignIn response:', { error });
        
        if (error) {
          console.error('Login error:', error);
          toast({
            title: "Login Error",
            description: error.message || "Failed to sign in. Please check your credentials.",
            variant: "destructive",
          });
        } else {
          console.log('Login successful');
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
        }
      } else {
        console.log('Calling signUp function...');
        const { error } = await signUp(email, password, fullName);
        console.log('SignUp response:', { error });
        
        if (error) {
          console.error('Registration error:', error);
          toast({
            title: "Registration Error",
            description: error.message || "Failed to create account. Please try again.",
            variant: "destructive",
          });
        } else {
          console.log('Registration successful');
          toast({
            title: "Registration Successful!",
            description: "Please check your email to confirm your account.",
          });
        }
      }
    } catch (error) {
      console.error('Unexpected error during authentication:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFormTitle = () => {
    if (isMagicLink) return 'Magic Link Sign In';
    return isLogin ? 'Welcome Back' : 'Join ExamAlly';
  };

  const getFormDescription = () => {
    if (isMagicLink) return 'Enter your email to receive a magic link';
    return isLogin ? 'Sign in to your account' : 'Create your account to get started';
  };

  const getButtonText = () => {
    if (loading) return 'Processing...';
    if (isMagicLink) return 'Send Magic Link';
    return isLogin ? 'Sign In' : 'Sign Up';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-gradient-to-r from-indigo-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-gradient-to-r from-emerald-300/20 to-blue-300/20 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl border border-white/20 relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {getFormTitle()}
          </CardTitle>
          <p className="text-gray-600">
            {getFormDescription()}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={!isMagicLink ? "default" : "outline"}
              onClick={() => setIsMagicLink(false)}
              className="flex-1"
            >
              Password
            </Button>
            <Button
              type="button"
              variant={isMagicLink ? "default" : "outline"}
              onClick={() => setIsMagicLink(true)}
              className="flex-1 gap-2"
            >
              <Zap className="w-4 h-4" />
              Magic Link
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !isMagicLink && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  className="bg-white/50"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/50"
              />
            </div>
            
            {!isMagicLink && (
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/50"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {getButtonText()}
            </Button>
          </form>

          {!isMagicLink && (
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
