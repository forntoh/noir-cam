import {
  getUser,
  supabaseServerClient,
  withPageAuth,
} from "@supabase/auth-helpers-nextjs";
import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
  subYears,
} from "date-fns";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Card from "../components/card";
import { EarningSummary, TopModels } from "../components/earnings";
import { PageWrapper } from "../components/PageWrapper";
import { PerMonthEarnings } from "../components/PerMonthEarnings";
import WelcomeBar from "../components/welcome_bar";
import { currencyAtom } from "../helpers/helpers";
import {
  useEarnings,
  useEarningsForPeriod,
  useEarningsMultiplier,
} from "../hooks/earnings";
import useSubscribeToCanges from "../hooks/useSubsribeToCanges";

const now = new Date();

export default function Home({ isAdmin }: { isAdmin: boolean }) {
  const [refDate, setRefDate] = useState(now);
  const [currency] = useRecoilState(currencyAtom);

  const [, earnings, loadEarnings] = useEarnings();
  const [, earningsForMonth, loadEarningsForMonth] = useEarningsForPeriod();
  const [, earningsForWeek, loadEarningsForWeek] = useEarningsForPeriod();
  const [, allEarnings, loadAllEarnings] = useEarningsForPeriod();
  const [, eMultiplier, loadEarningsMultiplier] = useEarningsMultiplier();

  const onChange = useSubscribeToCanges("earnings");

  useEffect(() => {
    loadEarnings(undefined, startOfMonth(refDate), endOfMonth(refDate));
    loadEarningsMultiplier(format(refDate, "yyyy-MM-01"));
  }, [refDate, onChange]);

  useEffect(() => {
    loadEarningsForMonth(
      startOfMonth(refDate),
      endOfMonth(refDate),
      currency == "Ksh"
    );
    loadEarningsForWeek(
      startOfWeek(now, { weekStartsOn: 1 }),
      endOfWeek(now, { weekStartsOn: 1 }),
      currency == "Ksh"
    );
    loadAllEarnings(subYears(now, 1), now, currency == "Ksh");
  }, [refDate, currency, onChange]);

  const earningsPerModel = _(earnings).groupBy((x) => x.username);

  return (
    <PageWrapper title="Home">
      <div className="container space-y-8 pb-8">
        <WelcomeBar />
        <div
          className={`grid grid-cols-2 ${
            isAdmin ? "xl:grid-cols-4" : "xl:grid-cols-2"
          } gap-3`}
        >
          <Card className="p-3">
            <EarningSummary
              label="Earnings • this week"
              value={earningsForWeek}
              mCurrency={currency}
            />
          </Card>
          <Card className="p-3">
            <EarningSummary
              label={`Earnings • ${format(refDate, "MMM yyyy")}`}
              value={earningsForMonth}
              mCurrency={currency}
            />
          </Card>
          <Card className={`p-3 ${isAdmin ? "" : "col-span-2"}`}>
            <EarningSummary
              label="Total earnings"
              value={allEarnings}
              mCurrency={currency}
            />
          </Card>
          {isAdmin ? (
            <Card className="p-3">
              <TopModels month={refDate} />
            </Card>
          ) : undefined}
        </div>
        <PerMonthEarnings
          refDate={refDate}
          earnings={earningsPerModel}
          title={isAdmin ? "Earnings per model" : "Earnings"}
          onNext={() => setRefDate(subMonths(refDate, -1))}
          onPrevious={() => setRefDate(subMonths(refDate, 1))}
          modelRate={eMultiplier?.model_rate}
          showMonth={!isAdmin}
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

    return { props: { isAdmin } };
  },
});
