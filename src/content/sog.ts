import source from "./sog-source.json";

// SOG sales copy. The original page was transcribed from the client's SOG Sales
// Copy.docx (sog-source.json); the November 23, 2026 revision (Google Doc
// "Blog content, etc", Tab 18, plus review videos) replaced the opening,
// audience, pathways, plan details, results, SOG is/is not, two FAQs and the
// closing line. Unchanged sections still read from the original transcription.
export const sog = {
  title: "School of Growth",
  welcome: "Welcome to",
  introduction:
    "The career advancement program for faith-based writers, editors, and authors serious about moving forward and building intentionally",
  access: source[150],
  choosePath: source[56],
  embrace: {
    question:
      "What would you EMBRACE to set your career on the right path that guarantees progress and incremental growth?",
    options: [
      "Procrastination and unending excuses on why you need more time before you start?",
      "Borrowed creative identity that doesn’t feel like you, yet you struggle to fit into?",
      "Borrowed strategy and advice that frustrates you and leads nowhere?",
      "Inconsistent commitment to your career goals and creative life that leaves a lot on the table?",
      "Fear of leaving what is familiar for the unknown and unpredictable journey of being a creative?",
    ],
    answer:
      "No. You must realign your roadmap, redefine your principles and focus on the commitments that can move your career forward.",
    commitments: [
      "Stop procrastinating, instead work with a clear vision, an aligned roadmap, and a team that keeps you accountable",
      "Stop trying to copy other creatives, instead discover yourself and focus on becoming the best version of that creative",
      "Stop copying strategy, instead lead with a personalized strategy that supports your career goals and current level",
      "Stop chasing multiple ambitions, instead lock in and give this vision all it takes to hit your breakeven threshold",
      "Stop fantasizing about the destination, instead pour your heart and soul into the process that will make your dreams a reality someday",
    ],
  },
  destinationsTitle: "Here in School of Growth, we help you GO where you want to GO:",
  destinations: [
    {
      name: "Riser",
      audience: "Newbies",
      support: "Career Mentorship and Growth Support",
    },
    {
      name: "Builder",
      audience: "Writers & Editors",
      support:
        "Mentorship, Accountability, Professional Training, Creative Projects",
    },
    {
      name: "Visionary",
      audience: "Authors",
      support: "Brand Building and Strategy Execution Support",
    },
  ],
  thisIs: source[39],
  programName: source[40],
  positioning: source[41],
  definition: source[42],
  foundations: source.slice(43, 46),
  audienceTitle: source[46],
  audience: ["Writers", "Authors", "Editors"],
  experienceTitle: "Your experience inside School of Growth includes:",
  experience: [
    {
      title: "Career mentorship",
      text: "Inside School of Growth, you get direct mentorship from Coach Esther to navigate career curves as a beginner or intermediate so you can become a solid professional ready to take on any creative task or project.",
    },
    {
      title: "Accountability support",
      text: "Using the SOG method of goal execution, you will receive ongoing accountability check-ins and support from our community managers to help you do what you need to do to grow.",
    },
    {
      title: "Exclusive professional training",
      text: "You will receive professional training that will help you learn how to communicate and use creative tools, lead and manage creative projects, build your portfolio and offers, market and sell your creative services and ideas, land creative roles or start your freelance business.",
    },
    {
      title: "Career-forward projects",
      text: "From being part of quarterly mastermind collaborative projects that help you work with other creatives in the program to executing your own creative leadership project, you will have the opportunity to become a more efficient creative professional.",
    },
    {
      title: "Brand building",
      note: "Only for Visionaries",
      text: "You will get self-paced video tutorials (mini courses) to help you understand brand building, value and content marketing, and set up your conversion system, plus receive execution support to stay consistent in your content creation journey.",
    },
  ],
  coach: {
    title: "What qualifies me to be your coach, mentor, or strategist",
    credentials: [
      "A creative for almost a decade working multiple roles that gave me the hard knocks, field experience and insights to guide you",
      "Author of three books with resounding recommendations from readers, and knows the process of building an author brand",
      "A former blogger, ghostwriter, and editor who has worked with independent authors, professionals, and stellar publishers and organizations like SW Advantages, SBMEN, Narrative Landscape Press, and BudgIT Foundation",
      "A trained brand experience manager and practicing strategist who understands culture, communication, brand building and the ins and outs of content marketing",
      "A former freelancer and a practicing creative studio owner who understands the rigors of building a creative career or business",
      "An award-winning career and life mentor to Christian changemakers",
    ],
    closing:
      "The truth is I have learned everything through blood, sweat, and tears, but what truly sets me apart is that I come with empathy and am passionate about helping others overcome the limitations that I struggled with to come this far.",
  },
  pathwaysTitle: "3 Pathways",
  pathways: [
    {
      name: "Career formation",
      text: "This is for you if you are new and need mentorship to learn the ropes and figure out your career focus.",
    },
    {
      name: "Career advancement",
      text: "You are tired of being nonchalant about your creative career or want to stay committed and need mentorship, accountability and professional training to get ahead.",
    },
    {
      name: "Author brand building",
      text: "You want to invest in building your author platform or brand and need a strategist in your corner plus the right support to keep showing up the right way.",
    },
  ],
  plansTitle: "Choose your pathway",
  whatYouGet: source[61],
  plans: [
    {
      name: source[57],
      strapline: source[58],
      price: source[59],
      description:
        "You want career mentorship and feedback to start your creative journey on the right foot.",
      benefits: [
        "Get ongoing career mentorship without feeling overwhelmed by the journey",
        "Get guidelines on what to focus on as a beginner",
        "Review your progress with Coach Esther and get expert insight on how to stay on track",
        "Share your career struggles and receive suggestions on your next best step",
      ],
    },
    {
      name: source[66],
      strapline: source[67],
      price: source[68],
      description:
        "You want mentorship and more—goal accountability, professional growth, and leadership skills.",
      benefits: [
        "1-on-1 mentorship and career advisory session with Coach Esther every month",
        "Ongoing accountability support and quarterly review and alignment session",
        "Quarterly professional training to gain solid skills for work and personal growth",
        "Professional efficiency building through quarterly collaborative creative projects and a one-time personal creative project",
      ],
    },
    {
      name: source[80],
      strapline: source[81],
      price: source[82],
      description:
        "You want to build a recognizable and consistent author brand to increase your reader base and industry relevance.",
      benefits: source.slice(85, 89),
    },
  ],
  testimonialsTitle: source[89],
  testimonials: [90, 93, 96, 99].map((i) => ({
    title: source[i],
    quote: source[i + 1],
    author: source[i + 2],
  })),
  frameworkLabel: source[102],
  framework: source[103],
  steps: source.slice(104, 107),
  resultsTitle: source[110],
  resultsCondition: source[111],
  results: [
    {
      name: "Riser",
      items: [
        "Stop feeling alone, clueless, and overwhelmed",
        "See at least 30% change in your career consistency and commitment",
        "Check off your next-level career goals for the quarter",
      ],
    },
    {
      name: "Builder",
      items: [
        "Become better at showing up professionally",
        "Become confident in communicating and marketing your creative services or works",
        "Tick off your next-level career goals for the quarter",
      ],
    },
    {
      name: "Visionary",
      items: [
        "Set up your author marketing system to start building your audience conversion journey",
        "Post consistently and connect with aligned audience who want to know more about your works",
        "Get 3K to 10K monthly impressions and visibility on your social media accounts",
      ],
    },
  ],
  explanation: [
    {
      title: "What SOG is",
      text: "A program that supports you and helps you turn your career or brand building goals into measurable results you’ll be proud of.",
    },
    {
      title: "What SOG is not",
      text: "A chat group run on vibes and meaningless conversations and passive commitment. Please don’t sign up if you are not ready to be held accountable to your goals.",
    },
  ],
  faqTitle: source[128],
  faqs: [
    ...[129, 131, 133, 135].map((i) => ({
      question: source[i],
      answer: source[i + 1],
    })),
    {
      question: "What is the professional training about?",
      answer:
        "The professional training is skills training we hold quarterly to help those on the Builder Plan learn skills that will help them advance in their creative career.",
    },
    {
      question: "Is the training free?",
      answer:
        "Yes. Once you are subscribed to the Builder Plan, you automatically get access to past training and future sessions.",
    },
    ...[145, 147].map((i) => ({ question: source[i], answer: source[i + 1] })),
  ],
  closing:
    "Someday you will look back at today and remember you had a chance to bet on your creative dreams. Will it be filled with sighs and regrets or pride and fulfillment because you gave yourself the chance to grow and build with intention?",
};
