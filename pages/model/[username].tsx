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
import { useRecoilState } from "recoil";
import Card from "../../components/card";
import { EarningSummary } from "../../components/earnings";
import { PageWrapper } from "../../components/PageWrapper";
import { PerMonthEarnings } from "../../components/PerMonthEarnings";
import WelcomeBar from "../../components/welcome_bar";
import { currencyAtom } from "../../helpers/helpers";
import {
  useEarnings,
  useEarningsForPeriod,
  useEarningsMultiplier,
} from "../../hooks/earnings";
import { useModel } from "../../hooks/model";
import { Earning } from "../../typings";
import { formatStringDate } from "../../utils/constants";

const now = new Date();

type Props = {
  username: string;
};

export default function ModelDetails({ username }: Props) {
  const [refDate, setRefDate] = useState(now);
  const [currency] = useRecoilState(currencyAtom);

  const [, monthEarnings, loadMonthEarnings] = useEarningsForPeriod();
  const [, monthSelectEarnings, loadSelectMonthEarnings] = useEarnings();
  const [, allEarnings, loadAllEarnings] = useEarningsForPeriod();
  const [, eMultiplier, loadEarningsMultiplier] = useEarningsMultiplier();

  const [, model, loadModel] = useModel();
  const [earningsGrouped, setEarningsGrouped] =
    useState<Object<Dictionary<Earning[]>>>();

  useEffect(() => {
    loadModel(username);
    loadMonthEarnings(
      startOfMonth(now),
      endOfMonth(now),
      currency == "Ksh",
      username
    );
    loadAllEarnings(subYears(now, 5), now, currency == "Ksh", username);
  }, [currency]);

  useEffect(() => {
    loadSelectMonthEarnings(
      username,
      startOfMonth(refDate),
      endOfMonth(refDate)
    );
    loadEarningsMultiplier(format(refDate, "yyyy-MM-01"));
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
                modelRate={eMultiplier?.model_rate}
              />
              <EarningSummary
                label="Total Earnings"
                value={allEarnings}
                mCurrency={currency}
              />
            </div>
          </div>
        </Card>
        <PerMonthEarnings
          refDate={refDate}
          earnings={earningsGrouped}
          title="Earnings"
          onNext={() => setRefDate(subMonths(refDate, -1))}
          onPrevious={() => setRefDate(subMonths(refDate, 1))}
          modelRate={eMultiplier?.model_rate}
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
