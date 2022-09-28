import nodemailer from "nodemailer";

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
  attachments?: string[];
};

export const sendMail = async ({
  to,
  cc,
  subject,
  body,
  attachments,
}: MailOptions) => {
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from,
    to,
    subject,
    cc,
    text: body,
    attachments: attachments?.map((it) => {
      return {
        path: it,
      };
    }),
  });

  return info;
};
