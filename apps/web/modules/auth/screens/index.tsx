"use client";

import { Button } from "@fenamnow/ui/components/ui/button";
import { Separator } from "@fenamnow/ui/components/ui/separator";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import useSupabaseBrowser from "@web/lib/helpers/supabase/browser-client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import LoginForm from "../components/login-form";
import RegisterForm from "../components/register-form";
import ResetPasswordForm from "../components/reset-password-form";

type Props = {
  path: string;
};

export default function AuthScreen({ path }: Props) {
  const supabase = useSupabaseBrowser();

  const searchParams = useSearchParams();
  const forms: Record<string, any> = {
    "/login": {
      heading: "Welcome back",
      subheading: "Sign in with your email and password",
      form: <LoginForm />,
      redirectPath: "/register",
      redirectText: "Don't have an account?",
      redirectName: "Register"
    },

    "/register": {
      heading: "Welcome to Fenamnow",
      subheading: "Fill in the fields below to create an account",
      form: <RegisterForm />,
      redirectPath: "/login",
      redirectText: "Already have an account?",
      redirectName: "Login"
    },

    "/reset-password": {
      heading: "Password Reset",
      subheading: "Type in your new password to change it",
      form: <ResetPasswordForm />,
      redirectPath: "/login",
      redirectText: "Already have an account?",
      redirectName: "Login"
    }
  };

  const redirectAfterLogin = searchParams.get("redirectTo")
    ? `redirectTo=${searchParams.get("redirectTo")}`
    : "";
  async function socialAuth(provider: "google" | "apple") {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?${redirectAfterLogin}`
        }
      });

      if (error) throw error;
    } catch (error) {
      // console.log(error);
    }
  }
  return (
    <div className="flex h-screen w-full items-center">
      <div className="container flex size-full flex-col justify-center space-y-4 sm:w-1/2 md:w-1/3 md:max-w-[360px]">
        <Button className="max-w-max px-0" variant="link" asChild>
          <Link href="/" title="Fenamnow home">
            <ChevronLeftIcon /> Go home
          </Link>
        </Button>
        {/* Heading and subheading */}
        <div>
          <h4>{forms[path].heading}</h4>
          <p>{forms[path].subheading}</p>
        </div>
        {/* Form */}
        {forms[path].form}
        {path !== "/reset-password" && (
          <>
            {/* Auth methods seperator */}
            <div className="flex w-full items-center justify-between">
              <Separator className="w-1/3" />
              <p>or</p>
              <Separator className="w-1/3" />
            </div>
            {/* Social auth methods */}
            <div className="flex w-full flex-col space-y-4">
              <Button
                className="bg-[#db4437] font-semibold text-white hover:bg-[#c73d31]"
                onClick={() => socialAuth("google")}
              >
                <FcGoogle className="mr-2" />
                Continue with Google
              </Button>
              {/* <Button className="bg-black font-semibold text-white hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-[#e5e5e5]">
                <FaApple className="mr-2" /> Continue with Apple
              </Button> */}
            </div>
            {/* Redirect */}
            <p className="text-center">
              {forms[path].redirectText}
              <Button variant="link" className="px-1 py-0 text-base" asChild>
                <Link
                  href={forms[path].redirectPath}
                  title={forms[path].redirectName}
                >
                  {forms[path].redirectName}
                </Link>
              </Button>
            </p>
          </>
        )}
      </div>
      <div className="hidden h-full w-2/3 border-l bg-[url('https://images.unsplash.com/photo-1565402170291-8491f14678db?q=80&w=3434&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover md:flex"></div>
    </div>
  );
}
