import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../config/supabase";
import { Session, User } from "@supabase/supabase-js";
import { STORAGE_KEYS } from "../app_constants";
import { useAtom } from "jotai";
import { sessionAtom, userAtom } from "../store/user";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithDiscord: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useAtom(sessionAtom);
  const [user, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useState<boolean>(true);

  const getSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (data.session) {
        setUser(data.session.user);
        setSession(data.session);
        localStorage.setItem(
          STORAGE_KEYS.LOCAL_STORAGE_USER,
          JSON.stringify(data.session.user),
        );
        localStorage.setItem(
          STORAGE_KEYS.LOCAL_STORAGE_SESSION,
          JSON.stringify(data.session),
        );
      }
    } catch (error) {
      console.error("Error getting session:", error);
    }
  };

  useEffect(() => {
    getSession();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth event:", event);
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        localStorage.setItem(
          STORAGE_KEYS.LOCAL_STORAGE_USER,
          JSON.stringify(currentSession.user),
        );
        localStorage.setItem(
          STORAGE_KEYS.LOCAL_STORAGE_SESSION,
          JSON.stringify(currentSession),
        );
      } else {
        localStorage.removeItem(STORAGE_KEYS.LOCAL_STORAGE_USER);
        localStorage.removeItem(STORAGE_KEYS.LOCAL_STORAGE_SESSION);
      }
    });

    setLoading(false);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Google:", error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGithub = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Github:", error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithDiscord = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Discord:", error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithApple = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Apple:", error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null)
      setSession(null)

      localStorage.removeItem(STORAGE_KEYS.LOCAL_STORAGE_USER);
      localStorage.removeItem(STORAGE_KEYS.LOCAL_STORAGE_SESSION);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signInWithGoogle,
        signInWithGithub,
        signInWithDiscord,
        signInWithApple,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
