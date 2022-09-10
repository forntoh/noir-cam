import {
  getUser,
  supabaseServerClient,
  withPageAuth,
} from "@supabase/auth-helpers-nextjs";
import {
  endOfMonth,
  format,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";
import _ from "lodash";
import { useEffect, useState } from "react";
import Card from "../components/card";
import { EarningSummary } from "../components/earnings";
import { MonthStepper } from "../components/MonthStepper";
import { PageWrapper } from "../components/PageWrapper";
import { converter } from "../helpers/helpers";
import { useDebt, useDebtForPeriod } from "../hooks/debt";
import {
  useEarnings,
  useEarningsForPeriod,
  useEarningsMultiplier,
} from "../hooks/earnings";

const now = new Date();

export default function Report() {
  const [refDate, setRefDate] = useState(now);
  const [, earnings, loadEarnings] = useEarnings();
  const [, earningsForMonth, loadEarningsForMonth] = useEarningsForPeriod();
  const [, debtForMonth, loadDebtForMonth] = useDebtForPeriod();
  const [, eMultiplier, loadEarningsMultiplier] = useEarningsMultiplier();
  const [, debt, loadDebt] = useDebt();

  useEffect(() => {
    loadDebt(startOfMonth(refDate), endOfMonth(refDate));
    loadEarningsForMonth(startOfMonth(refDate), endOfMonth(refDate));
    loadDebtForMonth(startOfMonth(refDate), endOfMonth(refDate));
    loadEarnings(undefined, startOfMonth(refDate), endOfMonth(refDate));
    loadEarningsMultiplier(format(refDate, "yyyy-MM-01"));
  }, [refDate]);

  const balance = () => (earningsForMonth ?? 0) * (eMultiplier?.rate ?? 0);
  const profit = () => received() - converter(earningsForMonth, "Ksh");
  const received = () => balance() - (debtForMonth ?? 0);

  const earningsPerModel = _(earnings).groupBy((x) => x.username);

  return (
    <PageWrapper title={`Report ${format(refDate, "MM/yyyy")}`}>
      <div className="container space-y-6 pb-8">
        <div className="space-y-3">
          <h5 className="flex items-center justify-between">
            Report for
            <MonthStepper
              onNext={() => setRefDate(subMonths(refDate, -1))}
              onPrevious={() => setRefDate(subMonths(refDate, 1))}
              refDate={refDate}
            />
          </h5>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3">
              <EarningSummary
                label={`Balance • ${format(refDate, "MMM yyyy")}`}
                value={balance()}
                mCurrency="Ksh"
              />
            </Card>
            <Card className="p-3">
              <EarningSummary
                label={`Debt • ${format(refDate, "MMM yyyy")}`}
                value={debtForMonth ?? 0}
                mCurrency="Ksh"
              />
            </Card>
            <Card className="px-5 py-3  col-span-2 flex justify-between">
              <EarningSummary
                label={`Profit • ${format(refDate, "MMM yyyy")}`}
                value={profit()}
                mCurrency="Ksh"
                color="text-teal-600"
              />
              <EarningSummary
                label={`To receive • ${format(refDate, "MMM yyyy")}`}
                value={received()}
                mCurrency="Ksh"
                color="text-indigo-600"
              />
            </Card>
          </div>
        </div>
        <div className="space-y-3">
          <h6>Payout summary</h6>
          <Card>
            <ul>
              <li className="flex justify-between border-b-2 p-3 font-bold">
                <span>Model</span>
                <span>Amount</span>
              </li>
              {earningsPerModel
                ?.map((value, key) => (
                  <li className="flex justify-between px-3 py-2" key={key}>
                    <span>{key}</span>
                    <span className="font-semibold">
                      {converter(
                        value.reduce((a, e) => a + e.tokens, 0),
                        "Ksh"
                      ).toLocaleString()}{" "}
                      Ksh
                    </span>
                  </li>
                ))
                .value()}
            </ul>
          </Card>
        </div>
        <div className="space-y-3">
          <h6>Debt summary</h6>
          <Card>
            <ul>
              <li className="flex justify-between border-b-2 p-3 font-bold">
                <span>Date - reason</span>
                <span>Amount</span>
              </li>
              {debt?.map((it, key) => (
                <li
                  className="flex justify-between items-center px-3 py-2"
                  key={key}
                >
                  <div className=" text-sm">
                    <span>{format(parseISO(it.created_at), "iii d")} — </span>
                    <span>{it.reason}</span>
                  </div>
                  <span className="font-semibold">
                    {it.amount.toLocaleString()} Ksh
                  </span>
                </li>
              ))}
              {(debt?.length ?? 0) <= 0 ? (
                <div className="p-3 text-center">
                  No debt for {format(refDate, "MMM yyyy")}
                </div>
              ) : undefined}
            </ul>
          </Card>
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

    if (!isAdmin) {
      ctx.res?.writeHead(302, { Location: "/" });
      ctx.res?.end();
    }

    return { props: {} };
  },
});
