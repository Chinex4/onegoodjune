export const site = {
  name: "OneGoodJune",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://onegoodjune.com",
  links: {
    newsletter: "https://onegoodjune.substack.com",
    newsletterEmbed: "https://onegoodjune.substack.com/embed?transparent=1",
    submissions: "mailto:submissions@onegoodjune.com",
    email: "mailto:sayhi@onegoodjune.com",
    waitlist: process.env.NEXT_PUBLIC_WAITLIST_URL || null,
    enrollment:
      process.env.NEXT_PUBLIC_ENROLLMENT_URL ||
      "https://checkout.mainstack.com/onegj/sog",
    instagram:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
      "https://www.instagram.com/onegoodjune",
    linkedin:
      process.env.NEXT_PUBLIC_LINKEDIN_URL ||
      "https://www.linkedin.com/company/onegoodjune/",
    youtube:
      process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://youtube.com/@onegoodjune",
  },
  assets: {
    writing: "/images/writing.jpg",
    sogVideo: "/media/sog-introduction.mp4",
    sogPoster: "/images/sog-video-poster.jpg",
    sogCoach: "/images/sog-coach.jpg",
    growth: "/images/creative-desk.jpg",
    team: [
      "/images/team/esther.jpg",
      "/images/team/dinma.jpg",
      "/images/team/seun.jpg",
      "/images/team/akunna.jpg",
    ] as (string | null)[],
  },
} as const;
export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Read Pubs", href: "/read-pubs" },
  { label: "Submissions", href: "/submissions" },
  { label: "School of Growth", href: "/school-of-growth" },
  { label: "Fiction Writing", href: "/fiction-writing" },
];
