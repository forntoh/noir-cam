import {
  getUser,
  supabaseServerClient,
  withPageAuth,
} from "@supabase/auth-helpers-nextjs";
import {
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
  subYears,
} from "date-fns";
import _, { Dictionary, Object } from "lodash";
import { useEffect, useState } from "react";
import { useEffectOnce } from "usehooks-ts";
import Card from "../../components/card";
import { EarningSummary } from "../../components/earnings";
import { PageWrapper } from "../../components/PageWrapper";
import { PerMonthEarnings } from "../../components/PerMonthEarnings";
import WelcomeBar from "../../components/welcome_bar";
import { useEarnings, useEarningsForPeriod } from "../../hooks/earnings";
import { useModel } from "../../hooks/model";
import { Earning } from "../../typings";
import { formatStringDate } from "../../utils/constants";

const now = new Date();

type Props = {
  username: string;
};

export default function ModelDetails({ username }: Props) {
  const [refDate, setRefDate] = useState(now);

  const [, monthEarnings, loadMonthEarnings] = useEarningsForPeriod();
  const [, monthSelectEarnings, loadSelectMonthEarnings] = useEarnings();
  const [, allEarnings, loadAllEarnings] = useEarningsForPeriod();

  const [, model, loadModel] = useModel();
  const [earningsGrouped, setEarningsGrouped] =
    useState<Object<Dictionary<Earning[]>>>();

  useEffectOnce(() => {
    loadModel(username);
    loadMonthEarnings(startOfMonth(now), endOfMonth(now), username);
    loadAllEarnings(subYears(now, 5), now, username);
  });

  useEffect(() => {
    loadSelectMonthEarnings(
      username,
      startOfMonth(refDate),
      endOfMonth(refDate)
    );
  }, [refDate]);

  useEffect(() => {
    setEarningsGrouped(
      _(monthSelectEarnings).groupBy((x) =>
        formatStringDate(x.periodStart, "MMM yyyy")
      )
    );
  }, [monthSelectEarnings]);

  return (
    <PageWrapper title={`Earnings for ${username}`}>
      <div className="container space-y-8 pb-8">
        <WelcomeBar />
        <Card>
          <div className="gap-2 flex flex-col">
            <h6 className="border-b-2 p-3 flex justify-between items-center font-bold">
              {username}
              <span className="text-xs lg:text-base opacity-30 text-right">
                Started on {model?.start_date}
              </span>
            </h6>
            <div className="p-3 flex justify-between">
              <EarningSummary
                label={`To pay • ${format(now, "MMM yyyy")}`}
                value={monthEarnings}
              />
              <EarningSummary label="Total Earnings" value={allEarnings} />
            </div>
          </div>
        </Card>
        <PerMonthEarnings
          refDate={refDate}
          earnings={earningsGrouped}
          title="Earnings"
          onNext={() => setRefDate(subMonths(refDate, -1))}
          onPrevious={() => setRefDate(subMonths(refDate, 1))}
          showMonth
        />
      </div>
    </PageWrapper>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: "/login",
  async getServerSideProps(ctx) {
    const { user } = await getUser(ctx);

    const { data: isAdmin } = await supabaseServerClient(ctx).rpc("is_admin", {
      email: user.email,
    });

    if (!isAdmin) {
      ctx.res?.writeHead(302, { Location: "/" });
      ctx.res?.end();
    }

    return { props: { username: ctx.params?.username } };
  },
});
