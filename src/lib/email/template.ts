import copy from "@/content/client-email-revisions.json";
import { getProgram } from "@/lib/programs";

export const bookingUrl = "https://calendly.com/euo/abc";
export const spotlightFormUrl = copy[38].match(/https:\/\/[^)]+/)![0];
const definitions = {
  "school-of-growth": {
    subject: 2,
    start: 4,
    end: 11,
    title: "School of Growth",
    fallback: "Writer",
  },
  "fiction-writing": {
    subject: 12,
    start: 14,
    end: 22,
    title: "Write Fiction Like Great Movies",
    fallback: "Writer",
  },
  consultation: {
    subject: 26,
    start: 28,
    end: 34,
    title: "Author Business Consulting",
    fallback: "Author",
  },
  "launch-spotlight": {
    subject: 35,
    start: 37,
    end: 43,
    title: "Launch Spotlight",
    fallback: "Author",
  },
} as const;
export function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
}
export function welcomeEmail(programId: string, name: string) {
  const program = getProgram(programId);
  if (!program) throw new Error("Unknown welcome email program");
  const d = definitions[program.group];
  const subject = copy[d.subject].replace(/^Subject(?: Line)?:\s*/, "").trim();
  const greeting = `Dear ${name.trim() || d.fallback},`;
  const paragraphs = copy.slice(d.start, d.end);
  const action =
    program.group === "consultation"
      ? { label: "Choose your session time", url: bookingUrl }
      : program.group === "launch-spotlight"
        ? { label: "Open the Launch Spotlight form", url: spotlightFormUrl }
        : null;
  const actionHeading = program.group === "consultation"
    ? "In case you haven't scheduled your session, use the button below to do so now."
    : null;
  // Only literal, client-supplied URLs become links. All personalized text is escaped.
  const paragraph = (value: string) =>
    escapeHtml(value)
      .replace(
        `this form (${escapeHtml(spotlightFormUrl)})`,
        `<a href="${escapeHtml(spotlightFormUrl)}" style="color:#2d6e0b;text-decoration:underline">this form</a>`,
      )
      .replace(
        /(hionegj@gmail\.com|sayhi@onegoodjune\.com)/g,
        '<a href="mailto:$1" style="color:#2d6e0b;text-decoration:underline">$1</a>',
      );
  const html = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#f2f2f0;color:#181b14">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all">${escapeHtml(paragraphs[0])}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f2f2f0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;background:#ffffff">
<tr><td style="padding:28px 28px;background:#000000;color:#ffffff;font:700 24px Georgia,serif;letter-spacing:-1px">ONEGOODJUNE</td></tr>
<tr><td height="5" style="background:#b6e266;font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td style="padding:30px 28px 12px"><p style="margin:0 0 14px;font:14px Arial,sans-serif;color:#2d6e0b">${escapeHtml(d.title)}</p><h1 style="margin:0;font:normal 28px/1.3 Georgia,serif">${escapeHtml(subject.replace(/^Special: /, ""))}</h1></td></tr>
<tr><td style="padding:12px 28px 28px;font:17px/1.75 Georgia,serif"><p style="margin:0 0 20px">${escapeHtml(greeting)}</p>${paragraphs.map((p) => `<p style="margin:0 0 20px">${paragraph(p)}</p>`).join("")}
${actionHeading ? `<h2 style="margin:24px 0 16px;font:600 18px/1.5 Georgia,serif">${escapeHtml(actionHeading)}</h2>` : ""}
${action ? `<table role="presentation" cellspacing="0" cellpadding="0"><tr><td bgcolor="#2d6e0b" style="padding:15px 20px"><a href="${escapeHtml(action.url)}" style="display:inline-block;color:#ffffff;font:14px/1.5 Arial,sans-serif;text-decoration:none">${action.label}</a></td></tr></table><p style="margin:16px 0 0;font:13px/1.6 Arial,sans-serif;word-break:break-word">Or open: <a href="${escapeHtml(action.url)}" style="color:#2d6e0b">${escapeHtml(action.url)}</a></p>` : ""}</td></tr>
<tr><td style="padding:24px 28px;background:#000000;color:#ffffff"><p style="margin:0 0 12px;font:bold 16px Georgia,serif">ONEGOODJUNE</p><p style="margin:0 0 14px;font:14px/1.6 Georgia,serif">Raising the bar in faith-based African storytelling. Helping creative minds flourish.</p><a href="mailto:sayhi@onegoodjune.com" style="font:13px Arial,sans-serif;color:#b6e266">sayhi@onegoodjune.com</a><p style="margin:14px 0 0;font:12px/1.6 Arial,sans-serif">Sent in response to your ${escapeHtml(program.name)} registration.</p></td></tr>
</table></td></tr></table></body></html>`;
  return {
    subject,
    html,
    text: [
      greeting,
      ...paragraphs,
      ...(actionHeading ? [actionHeading] : []),
      ...(action ? [`${action.label}: ${action.url}`] : []),
    ].join("\n\n"),
  };
}
