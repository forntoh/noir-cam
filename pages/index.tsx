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
import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";
import Card from "../components/card";
import {
  EarningSummary,
  ModelSummary,
  TopModels,
} from "../components/earnings";
import IconButton from "../components/IconButton";
import { PageWrapper } from "../components/PageWrapper";
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
        <div className="space-y-5">
          <h6 className="flex justify-between items-center select-none">
            {isAdmin ? "Earnings per model" : "Earnings"}
            <div className="flex items-center space-x-1">
              <IconButton
                icon={AiOutlineCaretLeft}
                onClick={() => setRefDate(subMonths(refDate, 1))}
              />
              <span>{format(refDate, "MMM yyyy")}</span>
              {refDate.getMonth() == new Date().getMonth() ? undefined : (
                <IconButton
                  icon={AiOutlineCaretRight}
                  onClick={() => setRefDate(subMonths(refDate, -1))}
                />
              )}
            </div>
          </h6>
          <div
            className={`flex flex-col xl:grid ${
              earningsPerModel.size() <= 0
                ? "xl:grid-cols-1"
                : earningsPerModel.size() % 2 == 0
                ? "xl:grid-cols-2"
                : "xl:grid-cols-3"
            } gap-5`}
          >
            {earningsPerModel
              .map((value, key) => <ModelSummary key={key} earnings={value} />)
              .value()}
            {earningsPerModel.size() <= 0 ? (
              <Card className="text-center py-14 text-gray-400">
                No earnings for {format(refDate, "MMM yyyy")}
              </Card>
            ) : undefined}
          </div>
        </div>
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
