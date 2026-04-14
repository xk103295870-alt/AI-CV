import { Trans } from "@lingui/react/macro";
import { WechatLogoIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

import { SectionBase } from "../shared/section-base";

export function InformationSectionBuilder() {
  return (
    <SectionBase type="information" className="space-y-4">
      <div className="space-y-2 rounded-md border bg-sky-600 p-5 text-white dark:bg-sky-700">
        <h4 className="font-medium tracking-tight">
          <Trans>Thank you for using and supporting this app!</Trans>
        </h4>

        <div className="space-y-2 text-xs leading-normal">
          <Trans>
            <p>
              The current version is a trial version, the first work of Studio Tanmo AI.
              We also thank the open source community and peers for their support.
            </p>
            <p>
              If you encounter any problems during use, you can contact the developer at any time to solve them.
            </p>
          </Trans>
        </div>

        <Button
          size="sm"
          variant="default"
          nativeButton={false}
          className="mt-2 px-4! text-xs whitespace-normal bg-white text-sky-600 hover:bg-white/90"
          render={
            <a href="https://work.weixin.qq.com/ca/cawcde3ad5b17ce10c" target="_blank" rel="noopener noreferrer">
              <WechatLogoIcon />
              <span className="truncate">
                <Trans>Contact Developer</Trans>
              </span>
            </a>
          }
        />
      </div>
    </SectionBase>
  );
}
