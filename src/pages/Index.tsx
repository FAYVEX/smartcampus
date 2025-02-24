
import LoginForm from "@/components/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('department')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          navigate(profile.department === 'admin' ? '/admin-dashboard' : '/student-dashboard');
        }
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <LoginForm />
    </div>
  );
};

export default Index;
