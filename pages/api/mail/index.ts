// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { sendMail } from "../../../lib/mail";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body,
    headers: { secret },
  } = req;

  if (secret != process.env.NEXT_PUBLIC_API_SECRET) {
    res.status(401).end("Unauthorized");
    return;
  }

  try {
    const info = await sendMail({ ...body });
    res.status(200).json({ id: info.messageId, accepted: info.accepted });
  } catch (error) {
    res.status(500).send(error);
  }
};
