"use client";

import { Button } from "@fenamnow/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@fenamnow/ui/components/ui/form";
import { PasswordInput } from "@fenamnow/ui/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import useSupabaseBrowser from "@web/lib/helpers/supabase/browser-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  new_password: z
    .string({ required_error: "Password can't be empty" })
    .min(2, { message: "Password is too short" })
    .max(50, { message: "Password is too long" }),
  confirm_new_password: z
    .string({ required_error: "Password can't be empty" })
    .min(2, { message: "Password is too short" })
    .max(50, { message: "Password is too long" })
});
export default function ResetPasswordForm() {
  const router = useRouter();
  const supabase = useSupabaseBrowser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new_password: "",
      confirm_new_password: ""
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.new_password
      });

      if (error) {
        throw error;
      }

      toast("Password changed successfully");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-h-max space-y-4"
      >
        {/* Password input */}
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm password input */}
        <FormField
          control={form.control}
          name="confirm_new_password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="new-password"
                  placeholder="Confirm your new password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Reset Password
        </Button>
      </form>
    </Form>
  );
}
