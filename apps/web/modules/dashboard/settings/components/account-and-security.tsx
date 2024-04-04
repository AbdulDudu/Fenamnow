"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@fenamnow/ui/components/ui/alert-dialog";
import { Button } from "@fenamnow/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@fenamnow/ui/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@fenamnow/ui/components/ui/form";
import { Input } from "@fenamnow/ui/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@fenamnow/ui/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Provider, UserIdentity } from "@supabase/supabase-js";
import { cn } from "@ui/lib/utils";
import useSupabaseBrowser from "@web/lib/helpers/supabase/browser-client";
import { useSession } from "@web/modules/common/shared/providers/session";
import { CheckIcon, Loader2Icon, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().min(2).max(50),
  password: z
    .string()
    // .regex(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-=_+{};':"\\|,.<>/?]).{8,}$/,
    //   {
    //     message:
    //       "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    //   }
    // )
    .min(8)
    .max(50)
    .optional()
});
export default function AccountAndSecuritySettings() {
  const { session, logOut } = useSession();
  const supabase = useSupabaseBrowser();
  const [editEmail, setEditEmail] = useState(false);
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    },
    values: {
      email: session?.user?.email || ""
    }
  });

  const socialIcons: Record<string, JSX.Element> = {
    google: <FcGoogle size={36} className="mr-2" />,
    apple: <FaApple size={36} className="mr-2" />
  };

  const disconnectSocialAccount = async (identity: UserIdentity) => {
    const { error } = await supabase.auth.unlinkIdentity(identity);
    if (error) {
      toast.error(error.message);
    }
  };

  const connectSocialAccount = async (provider: Provider) => {
    const { error } = await supabase.auth.linkIdentity({
      provider
    });
    if (error) {
      toast.error(error.message);
    }
  };

  const deleteAccount = async () => {
    try {
      setDeletingAccount(true);
      const { error } = await supabase.functions.invoke("delete_user_account");
      if (error) {
        throw error;
      }
      toast("Account sucessfully deleted");
      await logOut();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeletingAccount(false);
    }
  };

  const checkCurrentPassword = async () => {
    try {
      setCheckingPassword(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: session?.user?.email!,
        password: form.watch("password")!
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast.error(
        error.message == "Invalid login credentials"
          ? "Incorrect password"
          : error.message
      );
    } finally {
      setCheckingPassword(false);
    }
  };

  return (
    <Card className="w-[540px]">
      <CardHeader>
        <CardTitle>Account and Security</CardTitle>
        <CardDescription>Update your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-4">
            {/* Email input */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <TooltipProvider>
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <div className="flex items-center space-x-4">
                      <FormControl>
                        <Input
                          disabled={!editEmail}
                          placeholder="Enter new email"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex">
                        {!editEmail ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                  field.onChange("");
                                  setEditEmail(true);
                                }}
                              >
                                <Pencil1Icon />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-foreground">
                              <p>Edit email</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => {
                                    field.onChange(session.user.email);
                                    setEditEmail(false);
                                  }}
                                >
                                  <X className="text-destructive" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-foreground">
                                <p>Cancel</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditEmail(false);
                                  }}
                                >
                                  <CheckIcon className="text-primary" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-foreground">
                                <p>Save Email</p>
                              </TooltipContent>
                            </Tooltip>
                          </>
                        )}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                </TooltipProvider>
              )}
            />

            {/* Password input */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="flex items-center space-x-4">
                    <FormControl>
                      <Input placeholder="Your current password" {...field} />
                    </FormControl>
                    <Button
                      disabled={
                        field.value === undefined || field.value.length < 8
                      }
                      className={cn(
                        "invisible",
                        form.getFieldState("password").isDirty && "visible"
                      )}
                      variant="outline"
                      onClick={() => {
                        checkCurrentPassword();
                      }}
                    >
                      {checkingPassword && (
                        <Loader2Icon className="mr-2 animate-spin" />
                      )}
                      Check Password
                    </Button>
                  </div>
                  <FormDescription>
                    Type in current password to change it
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Connected Accounts</FormLabel>
                  <div className="flex h-20 w-full space-x-4">
                    {session?.user?.identities?.length! > 1 ? (
                      session?.user?.identities?.map(
                        identity =>
                          identity.provider !== "email" && (
                            <div
                              key={identity.identity_id}
                              className="flex h-full items-center space-x-2"
                            >
                              {socialIcons[identity.provider]}
                              <p className="capitalize">{identity.provider}</p>
                              <Button
                                variant="ghost"
                                className="text-destructive"
                                onClick={() =>
                                  disconnectSocialAccount(identity)
                                }
                              >
                                Disconnect
                              </Button>
                            </div>
                          )
                      )
                    ) : (
                      <div className="flex h-20 w-full space-x-4">
                        <div className="flex h-full items-center space-x-2">
                          {socialIcons["google"]}
                          <p className="capitalize">Google</p>
                          <Button
                            variant="outline"
                            onClick={() => connectSocialAccount("google")}
                          >
                            Connect
                          </Button>
                        </div>

                        <div className="flex h-full items-center space-x-2">
                          {socialIcons["apple"]}
                          <p className="capitalize">Apple</p>
                          <Button
                            variant="outline"
                            onClick={() => connectSocialAccount("apple")}
                          >
                            Connect
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <FormDescription>
                    These are the social accounts you&apos;ve logged in with
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-destructive hover:bg-destructive hover:text-white"
                >
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button variant="destructive" asChild>
                    <AlertDialogAction onClick={deleteAccount}>
                      Proceed
                    </AlertDialogAction>
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
