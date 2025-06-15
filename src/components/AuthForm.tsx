import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { GraduationCap, Mail, Lock, User, Shield } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isMagicCode, setIsMagicCode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [magicCode, setMagicCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendMagicCode = async () => {
    setLoading(true);
    
    try {
      const code = generateCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Send email with magic code
      const { error: emailError } = await supabase.functions.invoke('send-notification-email', {
        body: {
          type: 'verification',
          email,
          data: { code }
        }
      });

      if (emailError) throw emailError;

      // Store the code in session storage temporarily for verification
      sessionStorage.setItem('magic_code', code);
      sessionStorage.setItem('magic_code_email', email);
      sessionStorage.setItem('magic_code_expires', expiresAt.toISOString());

      setCodeSent(true);
      toast({
        title: "Secret Code Sent!",
        description: "Check your email for a 6-digit secret code.",
      });
    } catch (error: any) {
      console.error('Error sending secret code:', error);
      toast({
        title: "Error",
        description: "Failed to send secret code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyMagicCode = async () => {
    setLoading(true);

    try {
      const storedCode = sessionStorage.getItem('magic_code');
      const storedEmail = sessionStorage.getItem('magic_code_email');
      const storedExpiry = sessionStorage.getItem('magic_code_expires');

      if (!storedCode || !storedEmail || !storedExpiry) {
        toast({
          title: "Error",
          description: "No secret code found. Please request a new one.",
          variant: "destructive",
        });
        return;
      }

      if (new Date() > new Date(storedExpiry)) {
        toast({
          title: "Code Expired",
          description: "The secret code has expired. Please request a new one.",
          variant: "destructive",
        });
        // Clear expired code
        sessionStorage.removeItem('magic_code');
        sessionStorage.removeItem('magic_code_email');
        sessionStorage.removeItem('magic_code_expires');
        setCodeSent(false);
        setMagicCode('');
        return;
      }

      if (storedEmail !== email || storedCode !== magicCode) {
        toast({
          title: "Invalid Code",
          description: "The secret code is invalid.",
          variant: "destructive",
        });
        return;
      }

      // Try to sign in with magic link (passwordless)
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
          data: {
            full_name: fullName || 'Secret Code User',
          }
        }
      });

      if (error) {
        console.error('Magic code sign in error:', error);
        toast({
          title: "Error",
          description: "Failed to sign in with secret code. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Clear stored code after successful verification
      sessionStorage.removeItem('magic_code');
      sessionStorage.removeItem('magic_code_email');
      sessionStorage.removeItem('magic_code_expires');

      toast({
        title: "Success!",
        description: "You have been signed in with the secret code.",
      });

      // Reset form
      setCodeSent(false);
      setMagicCode('');
      setEmail('');
    } catch (error: any) {
      console.error('Error verifying secret code:', error);
      toast({
        title: "Error",
        description: "Failed to verify secret code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log(`Attempting ${isMagicCode ? 'secret code' : (isLogin ? 'login' : 'signup')} with email:`, email);

    try {
      if (isMagicCode) {
        if (!codeSent) {
          await sendMagicCode();
          return;
        } else {
          await verifyMagicCode();
          return;
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
    if (isMagicCode) return codeSent ? 'Enter Secret Code' : 'Secret Code Sign In';
    return isLogin ? 'Welcome Back' : 'Join ExamAlly';
  };

  const getFormDescription = () => {
    if (isMagicCode) return codeSent ? 'Enter the 6-digit code sent to your email' : 'Enter your email to receive a secret code';
    return isLogin ? 'Sign in to your account' : 'Create your account to get started';
  };

  const getButtonText = () => {
    if (loading) return 'Processing...';
    if (isMagicCode) return codeSent ? 'Verify Code' : 'Send Secret Code';
    return isLogin ? 'Sign In' : 'Sign Up';
  };

  const handleMagicCodeToggle = () => {
    setIsMagicCode(true);
    setCodeSent(false);
    setMagicCode('');
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
              variant={!isMagicCode ? "default" : "outline"}
              onClick={() => {
                setIsMagicCode(false);
                setCodeSent(false);
                setMagicCode('');
              }}
              className="flex-1"
            >
              Password
            </Button>
            <Button
              type="button"
              variant={isMagicCode ? "default" : "outline"}
              onClick={handleMagicCodeToggle}
              className="flex-1 gap-2"
            >
              <Shield className="w-4 h-4" />
              Secret Code
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !isMagicCode && (
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
            
            {(!isMagicCode || !codeSent) && (
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
                  disabled={codeSent}
                />
              </div>
            )}
            
            {!isMagicCode && (
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

            {isMagicCode && codeSent && (
              <div className="space-y-2">
                <Label htmlFor="magicCode" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Secret Code
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    value={magicCode}
                    onChange={setMagicCode}
                    maxLength={6}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || (isMagicCode && codeSent && magicCode.length !== 6)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {getButtonText()}
            </Button>

            {isMagicCode && codeSent && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCodeSent(false);
                  setMagicCode('');
                }}
                className="w-full"
              >
                Back to Email
              </Button>
            )}
          </form>

          {!isMagicCode && (
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
