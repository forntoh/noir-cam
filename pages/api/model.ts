// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import supbaseAdmin from "../../utils/supabaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { email, password },
    method,
  } = req;

  try {
    switch (method) {
      case "POST":
        const { data, error } = await supbaseAdmin.auth.api.createUser({
          email: email,
          password: password,
        });
        res.status(200).json({ data, error });
        break;
      default:
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};
