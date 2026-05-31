import { SITE } from "@/lib/constants";

export type ContactChannel = {
  id: string;
  label: string;
  value: string;
  href: string;
  external?: boolean;
};

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: "email",
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/khangtoannguyen",
    href: SITE.linkedin,
    external: true,
  },
  {
    id: "twitter",
    label: "X",
    value: "x.com/khangtoannguyen",
    href: SITE.twitter,
    external: true,
  },
  {
    id: "resume",
    label: "Resume",
    value: "Khang_Nguyen_Resume.pdf",
    href: SITE.resume,
    external: true,
  },
];

export const CHANNEL_COUNT = CONTACT_CHANNELS.length;
