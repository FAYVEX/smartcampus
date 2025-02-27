
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#0c1335] via-[#dfdfdf] to-[#093d5f]">
      {/* Glassmorphic Effect */}
      <div className="relative z-10 p-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl">
        <LoginForm />
      </div>
    </div>
  );
};

export default Index;
