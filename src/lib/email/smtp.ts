import "server-only";
import nodemailer from "nodemailer";
import { z } from "zod";

export function smtpSettings() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM_EMAIL;
  const replyTo = process.env.SMTP_REPLY_TO || "sayhi@onegoodjune.com";
  const port = Number(process.env.SMTP_PORT || "587");
  if (
    !host ||
    !user ||
    !pass ||
    !z.email().safeParse(from).success ||
    !z.email().safeParse(replyTo).success ||
    ![465, 587].includes(port)
  )
    throw new Error(
      "SMTP is not configured. Set the server-only SMTP environment variables.",
    );
  return {
    host,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user, pass },
    from: from!,
    replyTo,
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    disableFileAccess: true,
    disableUrlAccess: true,
  };
}
export async function sendWelcomeMail(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
  messageId: string;
}) {
  if (!z.email().safeParse(input.to).success)
    throw new Error("Invalid recipient");
  const { from, replyTo, ...options } = smtpSettings();
  const transport = nodemailer.createTransport(options);
  const result = await transport.sendMail({
    ...input,
    from: { name: "OneGoodJune", address: from },
    replyTo,
  });
  if (!result.accepted?.length || result.rejected?.length)
    throw new Error("SMTP did not accept the recipient");
  return result.messageId;
}
