
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail, Shield } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const EmailVerification = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [loading, setLoading] = useState(false);

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationCode = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const code = generateCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      const placeholderUserId = crypto.randomUUID(); // Generate a placeholder user ID

      // Store verification code in database
      const { error: dbError } = await supabase
        .from('email_verification_codes')
        .insert({
          email,
          code,
          expires_at: expiresAt.toISOString(),
          user_id: placeholderUserId,
        });

      if (dbError) throw dbError;

      // Send email with verification code
      const { error: emailError } = await supabase.functions.invoke('send-notification-email', {
        body: {
          type: 'verification',
          email,
          data: { code }
        }
      });

      if (emailError) throw emailError;

      setStep('code');
      toast({
        title: "Verification Code Sent",
        description: "Please check your email for the verification code.",
      });
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode) {
      toast({
        title: "Error",
        description: "Please enter the verification code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_verification_codes')
        .select('*')
        .eq('email', email)
        .eq('code', verificationCode)
        .eq('verified', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        toast({
          title: "Invalid Code",
          description: "The verification code is invalid or has expired.",
          variant: "destructive",
        });
        return;
      }

      // Mark code as verified
      const { error: updateError } = await supabase
        .from('email_verification_codes')
        .update({ verified: true })
        .eq('id', data.id);

      if (updateError) throw updateError;

      toast({
        title: "Email Verified",
        description: "Your email has been verified successfully! Notifications are now enabled.",
      });

      setOpen(false);
      setStep('email');
      setEmail('');
      setVerificationCode('');
    } catch (error: any) {
      console.error('Error verifying code:', error);
      toast({
        title: "Error",
        description: "Failed to verify code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
        >
          <Mail className="w-4 h-4 mr-2" />
          Verify Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-lg border border-white/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-blue-600 text-xl">
            <div className="p-2 rounded-full bg-blue-100 mr-3">
              <Shield className="w-5 h-5" />
            </div>
            Email Verification
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {step === 'email' 
              ? 'Enter your email to receive notifications about exams and marks.'
              : 'Enter the 6-digit code sent to your email.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {step === 'email' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/50"
                />
              </div>
              <Button 
                onClick={sendVerificationCode}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="bg-white/50 text-center text-lg tracking-widest"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('email')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={verifyCode}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailVerification;
