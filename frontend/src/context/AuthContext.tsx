import { createContext, useContext, useState, ReactNode } from "react";
import { api } from "../lib/api";

type User = { id: string; name: string; email: string; role: "customer" | "admin" };
type AuthValue = { user: User | null; login: (email: string, password: string) => Promise<void>; logout: () => void };
const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("sn_user");
    return saved ? JSON.parse(saved) as User : null;
  });
  async function login(email: string, password: string) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("sn_token", data.token);
    localStorage.setItem("sn_user", JSON.stringify(data.user));
    setUser(data.user);
  }
  function logout() {
    localStorage.removeItem("sn_token"); localStorage.removeItem("sn_user"); setUser(null);
  }
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
