import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { BriefcaseIcon, HardHatIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";

import { DashboardHeader } from "../-components/header";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/dashboard/job-search/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-4">
      <DashboardHeader icon={BriefcaseIcon} title={t`Job Search`} />

      <Separator />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex max-w-xl flex-col items-center gap-y-6 py-20 text-center"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
          <HardHatIcon className="relative size-16 text-primary" weight="duotone" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            <Trans>🚧 功能开发中</Trans>
          </h2>
          <p className="text-muted-foreground">
            <Trans>工作搜索功能正在紧锣密鼓地开发中，敬请期待上线！</Trans>
          </p>
        </div>

        <div className="rounded-lg border bg-muted/50 px-6 py-3">
          <p className="text-sm text-muted-foreground">
            <Trans>预计上线时间：即将推出</Trans>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
