"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface GoogleJwtPayload {
  sub: string; // Google ID
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
}

interface GoogleSignInButtonProps {
  role?: "buyer" | "problem_solver";
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function GoogleSignInButton({ 
  role = "problem_solver", 
  onSuccess, 
  onError 
}: GoogleSignInButtonProps) {
  const { googleAuth } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      const errorMsg = "No credential received from Google";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      onError?.(errorMsg);
      return;
    }

    setIsLoading(true);

    try {
      // Decode the JWT to get user info
      const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);

      const result = await googleAuth({
        googleId: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        profileImage: decoded.picture,
        role: role,
      });

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Successfully signed in with Google",
        });
        onSuccess?.();
        router.push("/dashboard");
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
        onError?.(result.message);
      }
    } catch (error) {
      const errorMsg = "Failed to process Google sign-in";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    const errorMsg = "Google sign-in was cancelled or failed";
    toast({
      title: "Error",
      description: errorMsg,
      variant: "destructive",
    });
    onError?.(errorMsg);
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap={false}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        width="100%"
      />
    </div>
  );
}
