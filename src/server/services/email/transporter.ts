import config from "@shared/config/config.js";
import { google } from "googleapis";

// OAuth2 client authenticated with a long-lived refresh token. The googleapis
// client transparently exchanges it for short-lived access tokens as needed.
const oauth2Client = new google.auth.OAuth2(
  config.GMAIL_CLIENT_ID,
  config.GMAIL_CLIENT_SECRET,
);
oauth2Client.setCredentials({ refresh_token: config.GMAIL_REFRESH_TOKEN });

const gmail = google.gmail({ version: "v1", auth: oauth2Client });

type MailOptions = {
  to: string;
  subject: string;
  html: string;
  // Optional override; defaults to the sender configured via EMAIL_FROM.
  from?: string;
};

// RFC 2047 encode the subject so non-ASCII characters survive transit.
const encodeSubject = (subject: string) =>
  `=?UTF-8?B?${Buffer.from(subject, "utf-8").toString("base64")}?=`;

// Base64url with no padding, as required by the Gmail API `raw` field.
const toBase64Url = (input: string) =>
  Buffer.from(input, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

// Drop-in replacement for the previous nodemailer transporter. Sends via the
// Gmail API over HTTPS (port 443) instead of SMTP, which hosts like Render block.
export const transporter = {
  async sendMail({ from, to, subject, html }: MailOptions) {
    const mime = [
      `From: ${from ?? config.EMAIL_FROM}`,
      `To: ${to}`,
      `Subject: ${encodeSubject(subject)}`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=utf-8",
      "Content-Transfer-Encoding: 7bit",
      "",
      html,
    ].join("\r\n");

    const { data } = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: toBase64Url(mime) },
    });

    return data;
  },
};
