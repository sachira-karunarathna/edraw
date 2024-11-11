import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import { useAtom } from "jotai";
import { sessionAtom, userAtom } from "../store/user";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [user, setUser] = useAtom(userAtom);
  const [session, setSession] = useAtom(sessionAtom);

  useEffect(() => {
    // Handle the OAuth callback
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Successful login, redirect to home or dashboard
        console.log("New Session: ", session);
        setSession(session);
        setUser(session.user);
        navigate("/");
      } else {
        // No session, redirect to login
        navigate("/login");
      }
    });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Completing login...</h2>
        <p>Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
