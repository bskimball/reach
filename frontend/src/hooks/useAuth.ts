import { useContext } from "react";
import { AuthContext, IAuthContext } from "@components/AuthContext.tsx";

export function useAuth(): IAuthContext {
  return useContext(AuthContext);
}
