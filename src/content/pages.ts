import source from "./source-copy.json";
export function between(start: string, end: string) {
  return source.slice(source.indexOf(start) + 1, source.indexOf(end));
}
export const about = {
  opening: between("ABOUT PAGE", "A Simple Quest"),
  mission: source[source.indexOf("A Simple Quest") + 1],
  team: Array.from({ length: 4 }, (_, i) => {
    const start = source.indexOf("Esther Uzoamaka Okoloeze") + i * 3;
    return {
      name: source[start],
      role: source[start + 1],
      description: source[start + 2],
    };
  }),
};
export const submissionLines = between(
  "SUBMISSION PAGE",
  "PRIVACY POLICY PAGE",
);
export const policyLines = between(
  "OneGoodJune · Effective Oct 19, 2026",
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
const courseStart = source.indexOf("*Write Fiction Like Great Movies*");
const courseLines = source.slice(courseStart);
export const course = {
  title: "Write Fiction Like Great Movies",
  description: courseLines[1],
  modules: between("Course Modules", "Guaranteed Results"),
  results: between("Guaranteed Results", "Delivery Mode"),
  delivery: source[source.indexOf("Delivery Mode") + 1],
  duration: source[source.indexOf("Duration") + 1],
  audience: source[source.indexOf("Who Is It For?") + 1],
  instructor: source[source.indexOf("Writing Instructor") + 1],
  deadline: source[source.indexOf("Waitlist Price Deadline") + 1],
  perks: between(
    "Perks of Joining the Waitlist",
    "How You'll Access the Course",
  ),
  access: source[source.indexOf("How You'll Access the Course") + 1],
};
