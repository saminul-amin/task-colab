"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReactNode } from "react";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

interface GoogleOAuthWrapperProps {
  children: ReactNode;
}

export function GoogleOAuthWrapper({ children }: GoogleOAuthWrapperProps) {
  if (!googleClientId) {
    console.warn("Google Client ID is not set. Google OAuth will not work.");
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
