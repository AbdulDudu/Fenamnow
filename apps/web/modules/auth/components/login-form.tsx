"use client";

import { Button } from "@fenamnow/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger
} from "@fenamnow/ui/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@fenamnow/ui/components/ui/form";
import { Input, PasswordInput } from "@fenamnow/ui/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import useSupabaseBrowser from "@web/lib/helpers/supabase/browser-client";
import { useRouter, useSearchParams } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  email: z
    .string({ required_error: "Email can't be empty" })
    .email({ message: "Email isn't valid" })
    .min(2, { message: "Email is too short" })
    .max(50, { message: "Email is too long" }),
  password: z
    .string({ required_error: "Password can't be empty" })
    .min(2, { message: "Password is too short" })
    .max(50, { message: "Password is too long" })
});
export default function LoginForm() {
  const router = useRouter();
  const supabase = useSupabaseBrowser();
  const dialogRef = useRef<ElementRef<"button">>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const searchParams = useSearchParams();

  const redirectAfterLogin = searchParams.get("redirectTo")
    ? searchParams.get("redirectTo")
    : null;
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password
      });

      if (error) {
        throw error;
      }

      if (redirectAfterLogin) {
        router.replace(`${redirectAfterLogin}`);
      }
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
      form.setError("email", {
        message: "Email or password is incorrect"
      });
    }
  }

  async function sendForgotPasswordLink() {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        form.watch("email"),
        { redirectTo: `${location?.origin}/api/auth/callback?recovery=true` }
      );
      if (error) throw error;
      toast("Password reset link sent to " + form.watch("email"));
    } catch (error: any) {
      toast.error(error.message);
      // console.log(error);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-h-max space-y-4"
      >
        {/* Email input */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Password input */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Dialog>
          <DialogTrigger ref={dialogRef} asChild>
            <Button variant="link" className="p-0">
              Forgot Password?
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <h4>Forgot Password?</h4>
              <DialogDescription>
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </DialogDescription>
            </DialogHeader>
            {/* Email input */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={
                form.getFieldState("email").error !== undefined ||
                !form.watch("email") ||
                form.getFieldState("email").invalid
              }
              type="button"
              onClick={async () => {
                await sendForgotPasswordLink();
                dialogRef.current?.click();
              }}
            >
              Send Link
            </Button>
          </DialogContent>
        </Dialog>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </Form>
  );
}
