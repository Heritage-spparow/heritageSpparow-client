import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      // No token — don't leave the user on a blank page
      navigate("/login?error=google_auth_failed", { replace: true });
      return;
    }

    // 1️⃣ store token
    localStorage.setItem("token", token);

    // 2️⃣ decide redirect
    const saved = localStorage.getItem("redirectAfterLogin");
    const redirectTo =
      saved && !["/login", "/signup"].includes(saved) ? saved : "/";
    localStorage.removeItem("redirectAfterLogin");
    // fresh session → let AuthContext merge the guest cart
    localStorage.removeItem("cart_merged");
    localStorage.removeItem("guest_token");
    localStorage.removeItem("guest_info");

    // 3️⃣ IMPORTANT: hard reload so AuthContext runs cleanly
    window.location.replace(redirectTo);
  }, []);

  return null;
}
