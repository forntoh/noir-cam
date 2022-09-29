// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Model } from "../../typings";
import { nextApi } from "../../utils/nextApi";
import supbaseAdmin from "../../utils/supabaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: model,
    method,
    headers: { secret },
  } = req;

  if (secret != process.env.NEXT_PUBLIC_API_SECRET) {
    res.status(401).end("Unauthorized");
    return;
  }

  model as Model;

  try {
    switch (method) {
      case "POST":
        // Create the User
        const { data: user, error } = await supbaseAdmin.auth.api.createUser({
          email: model.email,
          password: model.username,
        });

        // Create the Model
        if (!error && user) {
          delete model.email;
          model.user_id = user.id;

          const { error } = await supbaseAdmin.from("models").upsert(model);

          if (!error) {
            delete model.user_id;
            delete model.momo_number;
            await nextApi.get("/earnings", {
              params: { ...model },
              headers: { secret: secret as string },
            });
          }

          res.status(200).json(error ? false : true);
        } else {
          res.status(200).json(false);
        }
        break;
      default:
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(200).json(true);
  }
};
