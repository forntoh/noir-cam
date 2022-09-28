// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { format, parse } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import { modelEarningsSummary } from "../../../lib/pdf/docs/modelEarningsSummary";
import { modelsPayoutSummary } from "../../../lib/pdf/docs/modelsPayoutSummary";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body,
    method,
    query: { date, username, to, cc },
  } = req;

  console.log(req.headers["secret"]);

  try {
    const title = username ? "Earnings Summary" : "Model Payout Summary";
    const month = date
      ? parse(date as string, "yyyy-MM-dd", new Date())
      : new Date();
    const subject = `${title} ${format(month, "MM-yyyy")}`;

    let path;

    if (username) {
      path = await modelEarningsSummary(title, username as string, month);
    } else {
      path = await modelsPayoutSummary(title, month);
    }

    // await sendMail({
    //   to: to as string,
    //   cc: cc as string | undefined,
    //   subject,
    //   attachments: [path],
    // });

    // fs.unlinkSync(filePath);

    res.status(200).json([path, req.headers["secret"]]);
  } catch (error) {
    res.status(200).end(error);
  }
};
