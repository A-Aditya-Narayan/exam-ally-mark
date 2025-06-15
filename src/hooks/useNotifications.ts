
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Exam, Mark } from '@/pages/Index';

export const useNotifications = () => {
  const { user } = useAuth();

  const sendExamReminderEmail = async (exam: Exam, email: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-notification-email', {
        body: {
          type: 'exam_reminder',
          email,
          data: {
            examSubject: exam.subject,
            examDate: exam.date,
            examTime: exam.time,
            examLocation: exam.location,
          }
        }
      });

      if (error) throw error;
      console.log('Exam reminder email sent successfully');
    } catch (error) {
      console.error('Error sending exam reminder email:', error);
    }
  };

  const sendMarkUpdateEmail = async (mark: Mark, email: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-notification-email', {
        body: {
          type: 'mark_update',
          email,
          data: {
            markSubject: mark.subject,
            marks: mark.marks,
            totalMarks: mark.totalMarks,
            grade: mark.grade,
          }
        }
      });

      if (error) throw error;
      console.log('Mark update email sent successfully');
    } catch (error) {
      console.error('Error sending mark update email:', error);
    }
  };

  const checkNotificationSettings = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error checking notification settings:', error);
      return null;
    }
  };

  const getVerifiedEmail = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('email_verification_codes')
        .select('email')
        .eq('user_id', user.id)
        .eq('verified', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data?.email || null;
    } catch (error) {
      console.error('Error getting verified email:', error);
      return null;
    }
  };

  return {
    sendExamReminderEmail,
    sendMarkUpdateEmail,
    checkNotificationSettings,
    getVerifiedEmail,
  };
};
