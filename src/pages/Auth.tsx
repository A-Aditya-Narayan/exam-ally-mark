
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from '@/hooks/use-toast';
import { GraduationCap, KeyRound } from 'lucide-react';

const Auth = () => {
  const [secretCode, setSecretCode] = useState('');

  const handleLogin = () => {
    if (secretCode === '4532') {
      localStorage.setItem('isAuthenticated', 'true');
      toast({
        title: "Access Granted",
        description: "Welcome to ExamAlly!",
      });
      window.location.href = '/';
    } else {
      toast({
        title: "Access Denied",
        description: "The secret code is incorrect.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-gradient-to-r from-indigo-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-gradient-to-r from-emerald-300/20 to-blue-300/20 rounded-full blur-3xl"></div>
      </div>
      <Card className="w-full max-w-md z-10 bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                ExamAlly
              </h1>
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold">Welcome</CardTitle>
          <CardDescription>Enter the secret code to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="secret-code"
                type="password"
                placeholder="Secret Code"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button onClick={handleLogin} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              Unlock
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
