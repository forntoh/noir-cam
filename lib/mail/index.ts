import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const from = `"NoirCam Studio" <${process.env.NODEMAILER_USER}>`;

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

type MailOptions = {
  to: string;
  cc?: string;
  subject: string;
  body?: string;
  attachments?: Mail.Attachment[];
};

export const sendMail = async ({ body, ...props }: MailOptions) => {
  let info = await transporter.sendMail({
    ...props,
    text: body ?? "NoirCam Studio",
    from,
  });
  return info;
};
