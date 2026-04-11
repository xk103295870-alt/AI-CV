import { i18n, type MessageDescriptor, type Messages } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { createIsomorphicFn, createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import Cookies from "js-cookie";
import z from "zod";

// 只保留4种语言：中文简体、中文繁体、英语、越南语
const localeSchema = z.union([
  z.literal("zh-CN"),
  z.literal("zh-TW"),
  z.literal("en-US"),
  z.literal("vi-VN"),
]);

export type Locale = z.infer<typeof localeSchema>;

const storageKey = "locale";
const defaultLocale: Locale = "zh-CN";

export const localeMap = {
  "zh-CN": msg`Chinese (Simplified)`,
  "zh-TW": msg`Chinese (Traditional)`,
  "en-US": msg`English`,
  "vi-VN": msg`Vietnamese`,
} satisfies Record<Locale, MessageDescriptor>;

export function isLocale(locale: string): locale is Locale {
  return localeSchema.safeParse(locale).success;
}

// RTL 语言集合（当前保留的语言中没有RTL语言，但保留此函数以备将来）
const RTL_LANGUAGES = new Set<string>([]);

export function isRTL(locale: string): boolean {
  const language = locale.split("-")[0].toLowerCase();
  return RTL_LANGUAGES.has(language);
}

export const getLocale = createIsomorphicFn()
  .client(() => {
    const locale = Cookies.get(storageKey);
    if (!locale || !isLocale(locale)) return defaultLocale;
    return locale;
  })
  .server(async () => {
    const cookieLocale = getCookie(storageKey);
    if (!cookieLocale || !isLocale(cookieLocale)) return defaultLocale;
    return cookieLocale;
  });

export const setLocaleServerFn = createServerFn({ method: "POST" })
  .inputValidator(localeSchema)
  .handler(async ({ data }) => {
    setCookie(storageKey, data);
  });

export const loadLocale = async (locale: string) => {
  if (!isLocale(locale)) locale = defaultLocale;
  const { messages } = await (import(`../../locales/${locale}.po`) as Promise<{ messages: Messages }>);
  i18n.loadAndActivate({ locale, messages });
};
