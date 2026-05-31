export type LogoItem = {
  id: string;
  name: string;
  /** Optional path under /public — e.g. /logos/stripe.png */
  src?: string;
  /** Visual scale inside the fixed container — defaults to 1 */
  scale?: number;
};

export type ExperienceRowItem = {
  id: string;
  company: string;
  role: string;
  location?: string;
  duration: string;
  description: string;
  logo: string;
};

export type ExperienceColumnData = {
  id: string;
  label: string;
  rows: ExperienceRowItem[];
};

/** Logo icons in /public/logos/icons/ */
export const logoIcon = (slug: string) => `/logos/icons/${slug}-logo-1.png`;

/** Logo strip assets in /public/logos/strips/ */
export const logoStrip = (slug: string) => `/logos/strips/${slug}-logo-2.png`;

/** Top strip — scrolls left → right */
export const TOP_STRIP_LOGOS: LogoItem[] = [
  { id: "amazon", name: "Amazon", src: logoStrip("amazon") },
  { id: "aura", name: "Aura Intelligence", src: logoStrip("aura"), scale: 1.2 },
  { id: "bereal", name: "BeReal", src: logoStrip("bereal") },
  { id: "stripe", name: "Stripe", src: logoStrip("stripe") },
  { id: "sandisk", name: "SanDisk", src: logoStrip("sandisk"), scale: 1.4 },
  { id: "nasa", name: "NASA", src: logoStrip("nasa") },
];

/** Bottom strip — scrolls right → left */
export const BOTTOM_STRIP_LOGOS: LogoItem[] = [
  { id: "atlas", name: "Atlas", src: logoStrip("atlas") },
  { id: "drf", name: "Dorm Room Fund", src: logoStrip("drf"), scale: 1.65 },
  { id: "icg", name: "Irvine Consulting Group", src: logoStrip("icg") },
  { id: "riot", name: "Riot Games", src: logoStrip("riot"), scale: 1.1 },
  { id: "nasa", name: "NASA", src: logoStrip("nasa") },
  { id: "stripe", name: "Stripe", src: logoStrip("stripe") },
];

export const EXPERIENCE_COLUMNS: ExperienceColumnData[] = [
  {
    id: "internships",
    label: "Internships",
    rows: [
      {
        id: "stripe",
        company: "Stripe",
        role: "Finance & Strategy",
        location: "San Francisco, CA",
        duration: "Summer 2026",
        logo: logoIcon("stripe"),
        description: "learning how great companies scale.",
      },
      {
        id: "springer",
        company: "Springer Capital",
        role: "Investment Banking",
        location: "Chicago, IL",
        duration: "Summer 2025",
        logo: logoIcon("springer"),
        description: "b2b ai saas.",
      },
      {
        id: "summit-crest",
        company: "Summit Crest Capital",
        role: "Equity Research",
        location: "Minneapolis, MN",
        duration: "Spring 2025",
        logo: logoIcon("summit-crest"),
        description: "technology, media & telecommunications.",
      },
      {
        id: "eqty-lyfe",
        company: "Eqty Lyfe",
        role: "Business Analyst",
        location: "San Francisco, CA",
        duration: "Winter 2025",
        logo: logoIcon("eqty-lyfe"),
        description: "high-growth fintech startup.",
      },
      {
        id: "project-destined",
        company: "Project Destined",
        role: "Private Equity",
        location: "Washington, DC",
        duration: "Fall 2024",
        logo: logoIcon("project-destined"),
        description: "industrial & retail real estate.",
      },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    rows: [
      {
        id: "sandisk",
        company: "SanDisk",
        role: "Consultant",
        location: "Irvine, CA",
        duration: "Spring 2026",
        logo: logoIcon("sandisk"),
        description: "storage is riding the ai wave.",
      },
      {
        id: "riot-games",
        company: "Riot Games",
        role: "Ambassador",
        location: "Irvine, CA",
        duration: "Winter 2026",
        logo: logoIcon("riot-games"),
        description: "riftbound.",
      },
      {
        id: "aura",
        company: "Aura Intelligence",
        role: "Consultant",
        location: "New York, NY",
        duration: "Fall 2025",
        logo: logoIcon("aura"),
        description: "coached by bainies.",
      },
      {
        id: "bereal",
        company: "BeReal",
        role: "Consultant",
        location: "Los Angeles, CA",
        duration: "Fall 2025",
        logo: logoIcon("bereal"),
        description: "bringing 2021 back.",
      },
      {
        id: "amazon",
        company: "Amazon",
        role: "Fellow",
        location: "Seattle, WA",
        duration: "Fall 2025",
        logo: logoIcon("amazon"),
        description: "human capital.",
      },
    ],
  },
  {
    id: "involvements",
    label: "Involvements",
    rows: [
      {
        id: "dorm-room-fund",
        company: "Dorm Room Fund",
        role: "Frontier Track",
        location: "New York, NY",
        duration: "Summer 2026",
        logo: logoIcon("drf"),
        description: "the most ambitious people.",
      },
      {
        id: "icg",
        company: "Irvine Consulting Group",
        role: "Founder & President",
        location: "Irvine, CA",
        duration: "Present",
        logo: logoIcon("icg"),
        description: "a super duper passion project.",
      },
      {
        id: "atlas",
        company: "Atlas",
        role: "Co-Founder",
        location: "Irvine, CA",
        duration: "Present",
        logo: logoIcon("atlas"),
        description: "the best of the best.",
      },
      {
        id: "iitg",
        company: "Irvine Investment & Trading Group",
        role: "Head of Investments",
        location: "Irvine, CA",
        duration: "Present",
        logo: logoIcon("itg"),
        description: "built a lot of models.",
      },
      {
        id: "nasa-lspace",
        company: "NASA",
        role: "Principal Investigator",
        location: "Temple, AZ",
        duration: "Winter 2026",
        logo: logoIcon("nasa"),
        description: "living the dream.",
      },
    ],
  },
];
