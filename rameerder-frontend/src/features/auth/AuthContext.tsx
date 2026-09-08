import  { createContext, useContext, useState, useEffect,type  ReactNode } from "react";
import {type  User,type  AuthState } from "./types";

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // On mount, check if token exists to re-hydrate state
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("rpg_token");
        const storedUser = localStorage.getItem("rpg_user");
        
        if (token && storedUser) {
          // In a real app, you would validate the token with the backend here.
          setState({
            user: JSON.parse(storedUser),
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (err) {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };
    
    initAuth();
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem("rpg_token", token);
    localStorage.setItem("rpg_user", JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false, error: null });
  };

  const logout = () => {
    localStorage.removeItem("rpg_token");
    localStorage.removeItem("rpg_user");
    setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}