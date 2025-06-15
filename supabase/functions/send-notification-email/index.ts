
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationEmailRequest {
  type: 'verification' | 'exam_reminder' | 'mark_update';
  email: string;
  data: {
    code?: string;
    examSubject?: string;
    examDate?: string;
    examTime?: string;
    examLocation?: string;
    markSubject?: string;
    marks?: number;
    totalMarks?: number;
    grade?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Notification email function called');
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { type, email, data }: NotificationEmailRequest = await req.json();
    console.log('Email request:', { type, email, data });

    let subject = '';
    let html = '';

    switch (type) {
      case 'verification':
        subject = 'ExamAlly - Email Verification Code';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">ExamAlly</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333;">Email Verification</h2>
              <p style="color: #666; font-size: 16px;">Please use the following verification code to verify your email address:</p>
              <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">${data.code}</span>
              </div>
              <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
              <p style="color: #666; font-size: 14px;">If you didn't request this verification, please ignore this email.</p>
            </div>
          </div>
        `;
        break;

      case 'exam_reminder':
        subject = `ExamAlly - Exam Reminder: ${data.examSubject}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">ExamAlly</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333;">📚 Exam Reminder</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #667eea; margin-top: 0;">${data.examSubject}</h3>
                <p style="margin: 10px 0;"><strong>Date:</strong> ${data.examDate}</p>
                <p style="margin: 10px 0;"><strong>Time:</strong> ${data.examTime}</p>
                <p style="margin: 10px 0;"><strong>Location:</strong> ${data.examLocation}</p>
              </div>
              <p style="color: #666;">Don't forget to prepare for your upcoming exam. Good luck! 🍀</p>
            </div>
          </div>
        `;
        break;

      case 'mark_update':
        subject = `ExamAlly - New Mark Added: ${data.markSubject}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">ExamAlly</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333;">📊 New Mark Added</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #667eea; margin-top: 0;">${data.markSubject}</h3>
                <p style="margin: 10px 0;"><strong>Score:</strong> ${data.marks}/${data.totalMarks}</p>
                <p style="margin: 10px 0;"><strong>Grade:</strong> ${data.grade}</p>
                <p style="margin: 10px 0;"><strong>Percentage:</strong> ${((data.marks! / data.totalMarks!) * 100).toFixed(1)}%</p>
              </div>
              <p style="color: #666;">Keep up the great work! 🎉</p>
            </div>
          </div>
        `;
        break;
    }

    const emailResponse = await resend.emails.send({
      from: "ExamAlly <onboarding@resend.dev>",
      to: [email],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
