/**
 * 3D Globe — exported from Spline (remix of community file)
 * https://community.spline.design/file/dc934dad-135e-42bd-ad4d-8234b6cfd7bc
 */
export const SPLINE_ABOUT_SCENE =
  process.env.NEXT_PUBLIC_SPLINE_ABOUT_SCENE ??
  "https://prod.spline.design/SSetFCSvbUjF2Jn1/scene.splinecode";

export const SPLINE_COMMUNITY_FILE_URL =
  "https://community.spline.design/file/dc934dad-135e-42bd-ad4d-8234b6cfd7bc";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ikhang.com";

export const SITE = {
  name: "Khang Nguyen",
  email: "khang.ngtoan@gmail.com",
  linkedin: "https://www.linkedin.com/in/khangtoannguyen",
  twitter: "https://x.com/khangtoannguyen",
  spotify: "https://open.spotify.com/user/31voyhbenhsvmq653jrvc5wwgcuq",
  resume: "/Khang_Nguyen_Resume.pdf",
  logo: "/logo.png",
} as const;

export const NAV_ITEMS = [
  { id: "hero", label: "Top", icon: "logo" as const },
  { id: "about", label: "About", icon: "user" as const },
  { id: "experience", label: "Experience", icon: "briefcase" as const },
  { id: "interests", label: "Interests", icon: "star" as const },
  { id: "contact", label: "Contact", icon: "mail" as const },
] as const;

export const SOCIAL_ITEMS = [
  { id: "email", label: "Email", href: `mailto:${SITE.email}`, icon: "mail" as const },
  { id: "linkedin", label: "LinkedIn", href: SITE.linkedin, icon: "linkedin" as const },
  { id: "twitter", label: "X", href: SITE.twitter, icon: "twitter" as const },
  { id: "resume", label: "Resume", href: SITE.resume, icon: "file" as const },
] as const;
