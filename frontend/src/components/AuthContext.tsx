import React, { createContext, useEffect, useState } from "react";
import { socketClient } from "@lib/utils.ts";
import { useLocation, useNavigate } from "react-router-dom";

export interface IUser {
  email: string;
  id: number;
  googleId?: string;
}
export interface IAuthContext {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void> | null;
  logout: () => Promise<void> | null;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const AuthContext = createContext<IAuthContext>({
  user: null,
  setUser: () => null,
  login: () => null,
  logout: () => null,
});

export function AuthProvider({ children }: { children: React.JSX.Element }) {
  const [user, setUser] = useState<IUser | null>(
    localStorage.getItem("feathers-jwt")
      ? { email: "", id: 0, googleId: "" }
      : null
  );
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && location.pathname.includes("login")) {
      navigate("/", { replace: true });
    }
  }, [location, navigate, user]);

  useEffect(() => {
    socketClient.on("login", ({ user }: { user: IUser }) => setUser(user));
    socketClient.on("logout", () => setUser(null));

    const reAuthenticate = async () => {
      try {
        await socketClient.reAuthenticate();
      } catch (error) {
        setUser(null);
      }
    };

    reAuthenticate().then(() => console.log(`authenticated`));

    return () => {
      socketClient.removeListener("login", () => setUser(user));
      socketClient.removeListener("logout", () => setUser(null));
    };
  }, [user]);

  async function login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const response = await socketClient.authenticate({
      strategy: "local",
      email,
      password,
    });
    setUser(response.user);
  }

  async function logout() {
    await socketClient.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
