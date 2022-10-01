import {
  getUser,
  supabaseServerClient,
  withPageAuth,
} from "@supabase/auth-helpers-nextjs";
import {
  endOfMonth,
  endOfWeek,
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import _ from "lodash";
import { useEffect, useState } from "react";
import Card from "../components/card";
import { EarningSummary } from "../components/earnings";
import MyLink from "../components/link";
import { MonthStepper } from "../components/MonthStepper";
import { PageWrapper } from "../components/PageWrapper";
import { converter, rounder } from "../helpers/helpers";
import { useDebt, useDebtForPeriod } from "../hooks/debt";
import { useEarlyPaymentForPeriod } from "../hooks/debt/useDebt";
import {
  useEarnings,
  useEarningsForPeriod,
  useEarningsMultiplier,
} from "../hooks/earnings";
import useSubscribeToCanges from "../hooks/useSubsribeToCanges";

const now = new Date();

export default function Report() {
  const [refDate, setRefDate] = useState(startOfWeek(now, { weekStartsOn: 1 }));
  const [, earnings, loadEarnings] = useEarnings();
  const [, earningsForMonth, loadEarningsForMonth] = useEarningsForPeriod();
  const [, debtForMonth, loadDebtForMonth] = useDebtForPeriod();
  const [, earlyPayment, loadEarlyPaymentForMonth] = useEarlyPaymentForPeriod();
  const [, eMultiplier, loadEarningsMultiplier] = useEarningsMultiplier();
  const [, debt, loadDebt] = useDebt();

  const onChange = useSubscribeToCanges("earnings");

  useEffect(() => {
    const monthStart = startOfMonth(refDate);
    const monthEnd = endOfWeek(endOfMonth(refDate), { weekStartsOn: 1 });
    loadDebt(monthStart, monthEnd);
    loadEarningsForMonth(monthStart, monthEnd);
    loadDebtForMonth(monthStart, monthEnd);
    loadEarlyPaymentForMonth(monthStart, monthEnd);
    loadEarnings(undefined, monthStart, monthEnd);
    loadEarningsMultiplier(format(refDate, "yyyy-MM-01"));
  }, [refDate, onChange]);

  const total = () => (earningsForMonth ?? 0) * (eMultiplier?.rate ?? 0);
  const profit = () =>
    rounder(total(), 500) -
    converter(earningsForMonth, "Ksh", eMultiplier?.model_rate) -
    (debtForMonth ?? 0);
  const balance = () =>
    rounder(total(), 500) - (earlyPayment ?? 0) - (debtForMonth ?? 0);

  const actualRate = () => rounder(total(), 500) / (earningsForMonth ?? 0);

  const earningsPerModel = _(earnings).groupBy((x) => x.username);

  const debts = _(debt).groupBy((x) => x.reason == "Early payment");

  return (
    <PageWrapper title={`Report ${format(refDate, "MM-yyyy")}`}>
      <div className="container space-y-6 xl:space-y-10 pb-8">
        <div className="space-y-3">
          <h5 className="flex items-center justify-between">
            Report for
            <MonthStepper
              onNext={() => setRefDate(subMonths(refDate, -1))}
              onPrevious={() => setRefDate(subMonths(refDate, 1))}
              refDate={refDate}
            />
          </h5>
          <div className="grid grid-cols-2 gap-3 xl:gap-6">
            <Card className="p-3">
              <EarningSummary
                label={`Total • ${format(refDate, "MMM yyyy")}`}
                value={total()}
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
                label={`Balance • ${format(refDate, "MMM yyyy")}`}
                value={balance()}
                mCurrency="Ksh"
                color="text-indigo-600"
              />
            </Card>
          </div>
        </div>
        <div className="gap-6 xl:gap-y-9 grid xl:grid-cols-3">
          <div className="space-y-3 xl:space-y-5 flex flex-col">
            <h6>Payout summary</h6>
            <Card className="grow">
              <ul>
                <li className="flex justify-between border-b-2 p-3 xl:py-4 font-bold">
                  <span>Model ({earningsForMonth?.toLocaleString()} tk)</span>
                  <span>Amount</span>
                </li>
                {earningsPerModel
                  ?.map((value, key) => (
                    <li
                      className="flex justify-between px-3 py-2 xl:py-3"
                      key={key}
                    >
                      <MyLink href={`/model/${key}`} className="cursor-pointer">
                        {key}
                      </MyLink>
                      <span className="font-semibold">
                        {converter(
                          value.reduce((a, e) => a + e.tokens, 0),
                          "Ksh",
                          eMultiplier?.model_rate
                        ).toLocaleString()}{" "}
                        Ksh
                      </span>
                    </li>
                  ))
                  .value()}
              </ul>
            </Card>
          </div>
          <div className="space-y-3 xl:space-y-5 flex flex-col">
            <h6>Widthdrawals</h6>
            <Card className="grow">
              <ul>
                <li className="flex justify-between border-b-2 p-3 xl:py-4 font-bold">
                  <span>Date</span>
                  <span>Amount</span>
                </li>
                {debts?.get("true")?.map((it, key) => (
                  <li
                    className="flex justify-between items-center px-3 py-2 xl:py-3"
                    key={key}
                  >
                    <div className=" text-sm">
                      <span>{format(parseISO(it.created_at), "iii d")}</span>
                    </div>
                    <span className="font-semibold">
                      {it.amount.toLocaleString()} Ksh
                    </span>
                  </li>
                ))}
                {(debts?.get("true")?.length ?? 0) <= 0 ? (
                  <li className="p-3 text-center my-auto">
                    No widthdrawals for {format(refDate, "MMM yyyy")}
                  </li>
                ) : undefined}
              </ul>
            </Card>
          </div>
          <div className="space-y-3 xl:space-y-5 flex flex-col">
            <h6>Debt summary</h6>
            <Card className="grow">
              <ul className="h-full">
                <li className="flex justify-between border-b-2 p-3 xl:py-4 font-bold">
                  <span>Date — reason</span>
                  <span>Amount</span>
                </li>
                {debts?.get("false")?.map((it, key) => (
                  <li
                    className="flex justify-between items-center px-3 py-2 xl:py-3"
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
                {(debts?.get("false")?.length ?? 0) <= 0 ? (
                  <li className="p-3 text-center my-auto">
                    No debt for {format(refDate, "MMM yyyy")}
                  </li>
                ) : undefined}
              </ul>
            </Card>
          </div>
        </div>
        <div className="text-sm text-center">
          Base rate: <b>{eMultiplier?.rate.toFixed(2) ?? 0}x</b> — Actual rate:{" "}
          <b>{actualRate().toFixed(2)}x</b>
          <br />
          Model payout multiplier: <b>{eMultiplier?.model_rate.toFixed(2)}x</b>
          <br />
          <br />
          <span>
            Profit:{" "}
            <b className="text-teal-600">
              {Math.round((profit() / total()) * 100)}%
            </b>
          </span>
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
