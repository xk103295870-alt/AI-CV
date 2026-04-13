import { t } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { GithubLogoIcon, GoogleLogoIcon, LinkedinLogoIcon, VaultIcon, WechatLogoIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import type { RouterOutput } from "@/integrations/orpc/client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/integrations/auth/client";
import { orpc } from "@/integrations/orpc/client";
import { cn } from "@/utils/style";

const DEVELOPER_WE_COM_LINK = "https://work.weixin.qq.com/ca/cawcde3ad5b17ce10c";

export function SocialAuth() {
  const { i18n } = useLingui();
  const { data: providers = {}, isLoading } = useQuery(orpc.auth.providers.list.queryOptions());
  const isChinese = i18n.locale.toLowerCase().startsWith("zh");

  const contactTitle = isChinese
    ? "通过以下方式可以联系到开发者"
    : "You can contact the developer through the following method";
  const wecomButtonLabel = isChinese ? "添加企业微信客服" : "Add WeCom Contact";
  const wecomHint = isChinese
    ? "点击上方图标即可通过企业微信添加开发者"
    : "Click the button above to add the developer on WeCom";

  return (
    <>
      <div className="flex items-center gap-x-2">
        <hr className="flex-1" />
        <span className="text-xs font-medium tracking-wide">{contactTitle}</span>
        <hr className="flex-1" />
      </div>

      <Button
        variant="outline"
        nativeButton={false}
        className="mx-auto inline-flex h-10 gap-2 border-[#07C160]/40 text-[#22c55e] hover:bg-[#07C160]/10 hover:text-[#34d399]"
        render={
          <a href={DEVELOPER_WE_COM_LINK} target="_blank" rel="noopener noreferrer">
            <WechatLogoIcon weight="fill" />
            {wecomButtonLabel}
          </a>
        }
      />

      <p className="text-center text-xs text-muted-foreground">{wecomHint}</p>

      {isLoading ? <SocialAuthSkeleton /> : <SocialAuthButtons providers={providers} />}
    </>
  );
}

function SocialAuthSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

type SocialAuthButtonsProps = {
  providers: RouterOutput["auth"]["providers"]["list"];
};

function SocialAuthButtons({ providers }: SocialAuthButtonsProps) {
  const router = useRouter();

  const handleSocialLogin = async (provider: string) => {
    const toastId = toast.loading(t`Signing in...`);

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: "/dashboard",
    });

    if (error) {
      toast.error(error.message, { id: toastId });
      return;
    }

    toast.dismiss(toastId);
    await router.invalidate();
  };

  const handleOAuthLogin = async () => {
    const toastId = toast.loading(t`Signing in...`);

    const { error } = await authClient.signIn.oauth2({
      providerId: "custom",
      callbackURL: "/dashboard",
    });

    if (error) {
      toast.error(error.message, { id: toastId });
      return;
    }

    toast.dismiss(toastId);
    await router.invalidate();
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="secondary"
        onClick={handleOAuthLogin}
        className={cn("hidden", "custom" in providers && "inline-flex")}
      >
        <VaultIcon />
        {providers.custom}
      </Button>

      <Button
        onClick={() => handleSocialLogin("google")}
        className={cn(
          "hidden flex-1 bg-[#4285F4] text-white hover:bg-[#4285F4]/80",
          "google" in providers && "inline-flex",
        )}
      >
        <GoogleLogoIcon />
        Google
      </Button>

      <Button
        onClick={() => handleSocialLogin("github")}
        className={cn(
          "hidden flex-1 bg-[#2b3137] text-white hover:bg-[#2b3137]/80",
          "github" in providers && "inline-flex",
        )}
      >
        <GithubLogoIcon />
        GitHub
      </Button>

      <Button
        onClick={() => handleSocialLogin("linkedin")}
        className={cn(
          "hidden flex-1 bg-[#0A66C2] text-white hover:bg-[#0A66C2]/80",
          "linkedin" in providers && "inline-flex",
        )}
      >
        <LinkedinLogoIcon />
        LinkedIn
      </Button>
    </div>
  );
}
