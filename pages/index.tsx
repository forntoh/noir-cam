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
import Card from "../components/card";
import { EarningSummary, TopModels } from "../components/earnings";
import { PageWrapper } from "../components/PageWrapper";
import { PerMonthEarnings } from "../components/PerMonthEarnings";
import WelcomeBar from "../components/welcome_bar";
import { useEarnings, useEarningsForPeriod } from "../hooks/earnings";

const now = new Date();

export default function Home({ isAdmin }: { isAdmin: boolean }) {
  const [refDate, setRefDate] = useState(now);

  const [, earnings, loadEarnings] = useEarnings();
  const [, earningsForMonth, loadEarningsForMonth] = useEarningsForPeriod();
  const [, earningsForWeek, loadEarningsForWeek] = useEarningsForPeriod();
  const [, allEarnings, loadAllEarnings] = useEarningsForPeriod();

  useEffect(() => {
    loadEarnings(undefined, startOfMonth(refDate), endOfMonth(refDate));
    loadEarningsForMonth(startOfMonth(refDate), endOfMonth(refDate));
    loadEarningsForWeek(
      startOfWeek(now, { weekStartsOn: 1 }),
      endOfWeek(now, { weekStartsOn: 1 })
    );
    loadAllEarnings(subYears(now, 5), now);
  }, [refDate]);

  const earningsPerModel = _(earnings).groupBy((x) => x.username);

  return (
    <PageWrapper>
      <div className="container space-y-8 pb-8">
        <WelcomeBar />
        <div
          className={`grid grid-cols-2 ${
            isAdmin ? "xl:grid-cols-4" : "xl:grid-cols-3"
          } gap-3`}
        >
          <Card className="p-3">
            <EarningSummary
              label="Earnings • this week"
              value={earningsForWeek}
            />
          </Card>
          <Card className="p-3">
            <EarningSummary
              label={`Earnings • ${format(refDate, "MMM yyyy")}`}
              value={earningsForMonth}
            />
          </Card>
          <Card className={`p-3 ${isAdmin ? "" : "col-span-2"}`}>
            <EarningSummary label="Total earnings" value={allEarnings} />
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
