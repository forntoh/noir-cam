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
    query: { username, start_date },
    method,
  } = req;

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
            earnings.push(
              await fetchStrip(
                username as string,
                item ?? date,
                nextMonday(date)
              )
            );
            item = nextMonday(date);
          }

          // Save earnings data to Supabase
          const { data, error } = await supbaseAdmin
            .from("earnings")
            .upsert(earnings);

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

          // Save earnings data to Supabase
          const { data, error } = await supbaseAdmin
            .from("earnings")
            .upsert(earning);

          res.status(200).json({});
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
  delete data["groupShows"];
  delete data["refunds"];
  delete data["modelsReferralProgram"];
  delete data["otherIncome"];
  delete data["massMessages"];
  delete data["photoSalesPM"];
  delete data["publicShowRecordings"];
  delete data["spyOnPrivatesVR"];
  delete data["publicTipsVR"];
  delete data["usersReferralProgram"];
  delete data["fanClubPrinces"];
  delete data["fanClubLords"];
  delete data["fanClubSoldiers"];
  delete data["anonymousTipsVR"];
  delete data["anonymousTips"];
  delete data["privateChatTipsVR"];
  delete data["userTipsVR"];
  delete data["exclusivePrivateNoVideo"];
  delete data["contestWin"];
  delete data["spyOnPrivates"];
  delete data["videoSales"];
  delete data["albumSales"];
  delete data["unlockChat"];
  delete data["offlineTips"];
  delete data["localRefund"];
  delete data["tips"];
  delete data["publicChatTips"];
  delete data["privateChatTips"];
  delete data["privateShows"];
  delete data["exclusivePrivates"];

  data["tokens"] = data["totalEarnings"];
  data["periodStart"] = (data["periodStart"] as string).slice(0, 10);
  data["periodEnd"] = (data["periodEnd"] as string).slice(0, 10);

  delete data["totalEarnings"];
}
