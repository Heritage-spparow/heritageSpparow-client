import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;

    // 1️⃣ store token
    localStorage.setItem("token", token);

    // 2️⃣ decide redirect
    const redirectTo =
      localStorage.getItem("redirectAfterLogin") || "/payment";
    localStorage.removeItem("redirectAfterLogin");

    // 3️⃣ IMPORTANT: hard reload so AuthContext runs cleanly
    window.location.replace(redirectTo);
  }, []);

  return null;
}
