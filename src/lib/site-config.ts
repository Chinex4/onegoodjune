export const site = {
  name: "OneGoodJune",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://onegoodjune.com",
  links: {
    newsletter: "https://onegoodjune.substack.com",
    newsletterEmbed: "https://onegoodjune.substack.com/embed?transparent=1",
    submissions: "mailto:submissions@onegoodjune.com",
    email: "mailto:admin@onegoodjune.com",
    waitlist: process.env.NEXT_PUBLIC_WAITLIST_URL || null,
    enrollment:
      process.env.NEXT_PUBLIC_ENROLLMENT_URL ||
      "https://checkout.mainstack.com/onegj/sog",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || null,
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || null,
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || null,
  },
  assets: {
    writing: "/images/writing.jpg",
    sogVideo: "/media/sog-introduction.mp4",
    sogPoster: "/images/sog-video-poster.jpg",
    sogCoach: "/images/sog-coach.jpg",
    growth: "/images/creative-desk.jpg",
    team: [null, null, null, null] as (string | null)[],
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
