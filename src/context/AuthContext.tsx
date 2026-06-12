import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase'; 
import { Profile } from '../types';
import { mapAuthError } from '../utils/errorMapper';

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (identifier: string, pass: string) => Promise<{ error: string | null }>;
  signUp: (email: string, pass: string, username: string) => Promise<{ error: string | null }>;
  updatePassword: (newPass: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  sendResetEmail: (email: string) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Boshlang'ich sessiyani olish
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(prof);
      }
      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session) {
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setProfile(prof);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (identifier: string, pass: string) => {
    let email = identifier;
    if (!identifier.includes('@')) {
      const { data } = await supabase.from('profiles').select('email').eq('username', identifier).maybeSingle();
      if (data) email = data.email;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    return { error: error ? mapAuthError(error) : null };
  };

  const signUp = async (email: string, pass: string, username: string) => {
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data: { username } }
    });

    if (authError) return { error: mapAuthError(authError) };

    if (data.user) {
      const { error: profError } = await supabase.from('profiles').insert([
        { id: data.user.id, username, email }
      ]);
      if (profError) return { error: mapAuthError(profError) };
    }

    return { error: null };
  };

  const updatePassword = async (newPass: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPass });
    return { error: error ? mapAuthError(error) : null };
  };

  const sendResetEmail = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#type=recovery`,
    });
    return { error: error ? mapAuthError(error) : null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    if (user?.id) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(prof);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      isAuthenticated: !!user,
      signIn,
      signUp,
      signOut,
      updatePassword,
      sendResetEmail,
      refreshProfile
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
