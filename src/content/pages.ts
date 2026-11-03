import source from "./source-copy.json";
import revisions from "./client-email-revisions.json";
export function between(start: string, end: string) {
  return source.slice(source.indexOf(start) + 1, source.indexOf(end));
}
export const about = {
  opening: between("ABOUT PAGE", "A Simple Quest"),
  mission: source[source.indexOf("A Simple Quest") + 1],
  team: Array.from({ length: 4 }, (_, i) => {
    const start = source.indexOf("Esther Uzoamaka Okoloeze") + i * 3;
    return {
      name: source[start].replace(
        "Seun Mary-Ann Biyi",
        "Seun Mary-Ann Olabiyi",
      ),
      role: source[start + 1],
      description: source[start + 2],
    };
  }),
};
export const submissionLines = between(
  "SUBMISSION PAGE",
  "PRIVACY POLICY PAGE",
).flatMap((line) => line.startsWith("Formatting:") ? [
  "FORMATTING",
  "•Format: Submit all work as a Word document (.docx). PDFs will not be accepted.",
  "•Font: Crimson Text or Times New Roman, 12 pt",
  "•Line spacing: 1.5 (set with the line spacing tool, not extra line breaks)",
  "•Indentation: None, including first-line indents",
  "•Alignment: Left-aligned (not justified)",
  "GRAMMAR AND MECHANICS",
  "•Spelling: Use American English (for example, ‘organize,’ not ‘organise;’ ‘color,’ not ‘colour’).",
  "•Style guide: Follow The Chicago Manual of Style for grammar, editorial mechanics, and citations.",
  "•Other style matters: Follow the guidelines on this submission page.",
] : [line]).map((line) =>
  line
    .replace("Creative Submission", "Submissions")
    .replace(
      /^Creative Ambassador Award:.*$/,
      "Features and portfolio building: Get featured in our year ‘wrapped’ series and have a credible portfolio of your work for references.",
    ),
);
export const policyLines = between(
  "ONEGOODJUNE · Effective Oct 19, 2026",
  "Second Sales Page (I indicated it in the document – This one is minimalist)",
);
export function getSections(
  lines: string[],
  isHeading: (s: string) => boolean,
) {
  const sections: { title: string; paragraphs: string[] }[] = [];
  for (const line of lines) {
    if (isHeading(line)) sections.push({ title: line.trim(), paragraphs: [] });
    else if (sections.length)
      sections[sections.length - 1].paragraphs.push(line);
  }
  return sections;
}
export const policySections = getSections(policyLines, (s) =>
  /^\d+\. /.test(s),
);
export const course = {
  title: revisions[45],
  description: revisions[46],
  introduction: revisions.slice(48, 51),
  modules: revisions.slice(52, 69),
  results: revisions.slice(71, 75),
  outcomes: revisions.slice(76, 80),
  delivery: revisions[81],
  duration: revisions[83],
  audience: revisions[89],
  instructor: revisions[91],
  deadline: revisions[93],
  perks: revisions.slice(95, 98),
  access: revisions[99],
  launchDate: revisions[101],
};
