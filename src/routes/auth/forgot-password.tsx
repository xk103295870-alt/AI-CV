import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { ArrowRightIcon, GlobeIcon, WechatLogoIcon } from "@phosphor-icons/react";
import { LocaleCombobox } from "@/components/locale/combobox";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/integrations/auth/client";

export const Route = createFileRoute("/auth/forgot-password")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.flags.disableEmailAuth) throw redirect({ to: "/auth/login", replace: true });
  },
});

const formSchema = z.object({
  email: z.email(),
});

type FormValues = z.infer<typeof formSchema>;

function RouteComponent() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    const toastId = toast.loading(t`Sending password reset email...`);

    const { error } = await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: "/auth/reset-password",
    });

    if (error) {
      toast.error(error.message, { id: toastId });
      return;
    }

    setSubmitted(true);
    toast.dismiss(toastId);
  };

  if (submitted) return <PostForgotPasswordScreen />;

  return (
    <>
      {/* Language Switcher - Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <div className="flex items-center gap-2 rounded-lg bg-background/80 backdrop-blur-sm p-2 shadow-sm">
          <GlobeIcon className="h-4 w-4 text-muted-foreground" />
          <LocaleCombobox />
        </div>
      </div>

      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          <Trans>Forgot your password?</Trans>
        </h1>

        <div className="text-muted-foreground">
          <Trans>
            Remember your password?{" "}
            <Button
              variant="link"
              className="h-auto gap-1.5 px-1! py-0"
              nativeButton={false}
              render={
                <Link to="/auth/login">
                  Sign in now <ArrowRightIcon />
                </Link>
              }
            />
          </Trans>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Trans>Email Address</Trans>
                </FormLabel>
                <FormControl
                  render={<Input type="email" autoComplete="email" placeholder="john.doe@example.com" {...field} />}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            <Trans>Send Password Reset Email</Trans>
          </Button>
        </form>
      </Form>

      {/* 联系开发者板块 */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-muted-foreground">
            <Trans>This is a trial version. To change your password, please contact the developer.</Trans>
          </span>
        </div>
      </div>

      <div className="text-center">
        <Button
          variant="outline"
          className="w-full gap-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
          nativeButton={false}
          render={
            <a href="https://work.weixin.qq.com/ca/cawcde3ad5b17ce10c" target="_blank" rel="noopener noreferrer">
              <WechatLogoIcon className="size-5" />
              <Trans>Add Customer Service on WeChat Work</Trans>
            </a>
          }
        />
      </div>
    </>
  );
}

function PostForgotPasswordScreen() {
  return (
    <>
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          <Trans>You've got mail!</Trans>
        </h1>
        <p className="text-muted-foreground">
          <Trans>Check your email for a link to reset your password.</Trans>
        </p>
      </div>

      <Button
        nativeButton={false}
        render={
          <a href="mailto:">
            <Trans>Open Email Client</Trans>
          </a>
        }
      />
    </>
  );
}
