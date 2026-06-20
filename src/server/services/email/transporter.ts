import config from "@shared/config/config.js";
import { Resend } from "resend";

const resend = new Resend(config.RESEND_API_KEY);

type MailOptions = {
  to: string;
  subject: string;
  html: string;
  // Optional override; defaults to the verified sender from config.
  from?: string;
};

// Drop-in replacement for the previous nodemailer transporter. Sends over
// Resend's HTTPS API (port 443) instead of SMTP, which hosts like Render block.
export const transporter = {
  async sendMail({ from, to, subject, html }: MailOptions) {
    const { data, error } = await resend.emails.send({
      from: from ?? config.EMAIL_FROM,
      to,
      subject,
      html,
    });

    if (error) {
      throw new Error(`Resend failed to send email: ${error.message}`);
    }

    return data;
  },
};
