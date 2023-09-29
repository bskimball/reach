import { useAuth } from "@hooks/useAuth.ts";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

function Protected({ children }: { children: React.JSX.Element }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return navigate("/login", { replace: true });
    }
  }, [user]);

  return children;
}

export default Protected;
