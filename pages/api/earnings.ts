import {
  addDays,
  endOfWeek,
  format,
  nextMonday,
  parse,
  startOfWeek,
} from "date-fns";
import eachWeekOfInterval from "date-fns/eachWeekOfInterval";
import type { NextApiRequest, NextApiResponse } from "next";
import { stripchatApi } from "../../utils/stripchatApi";
import supbaseAdmin from "../../utils/supabaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { username, start_date },
    method,
    headers: { secret },
  } = req;
  if (secret != process.env.NEXT_PUBLIC_API_SECRET) {
    res.status(401).json("Unauthorized");
  } else
    try {
      switch (method) {
        case "GET":
          if (start_date) {
            const result = eachWeekOfInterval(
              {
                start: parse(start_date as string, "yyyy-MM-dd", new Date()),
                end: new Date(),
              },
              { weekStartsOn: 1 }
            );

            const earnings = [];

            let item;

            for (const date of result) {
              const earning = await fetchStrip(
                username as string,
                item ?? date,
                nextMonday(date)
              );
              if (earning.tokens != 0 || earning.tokens != undefined)
                earnings.push(earning);
              item = nextMonday(date);
            }

            if (earnings.length >= 0)
              // Save earnings data to Supabase
              await supbaseAdmin.from("earnings").upsert(earnings);

            res.status(200).json({});
          } else {
            const today = new Date();
            const start = startOfWeek(today, { weekStartsOn: 1 });
            const end = endOfWeek(today, { weekStartsOn: 1 });
            const earning = await fetchStrip(
              username as string,
              start,
              addDays(end, 1)
            );

            if (earning.tokens != 0)
              // Save earnings data to Supabase
              await supbaseAdmin.from("earnings").upsert(earning);

            res.status(200).json(earning);
          }
          break;
        default:
          res.setHeader("Allow", ["GET"]);
          res.status(405).end(`Method ${method} Not Allowed`);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json("Internal Server Error");
    }
};

const fetchStrip = async (username: string, start: Date, end: Date) => {
  const { data } = await stripchatApi.get(`/${username}`, {
    params: {
      periodStart: format(start, "yyyy-MM-dd"),
      periodEnd: format(end, "yyyy-MM-dd"),
    },
  });
  sanitize(data);
  data["username"] = username;
  return data;
};

function sanitize(data: any) {
  data["tokens"] = data["totalEarnings"];
  data["periodStart"] = (data["periodStart"] as string).slice(0, 10);
  data["periodEnd"] = (data["periodEnd"] as string).slice(0, 10);

  Object.keys(data).forEach((key) => {
    if (!["tokens", "periodStart", "periodEnd"].includes(key)) {
      delete data[key];
    }
  });
}
