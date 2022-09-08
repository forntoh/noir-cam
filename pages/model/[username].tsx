import {
  getUser,
  supabaseServerClient,
  withPageAuth,
} from "@supabase/auth-helpers-nextjs";
import { endOfMonth, format, startOfMonth, subYears } from "date-fns";
import { useEffectOnce } from "usehooks-ts";
import Card from "../../components/card";
import { EarningSummary } from "../../components/earnings";
import { PageWrapper } from "../../components/PageWrapper";
import WelcomeBar from "../../components/welcome_bar";
import { useEarnings } from "../../hooks/earnings";
import { useModel } from "../../hooks/model";

const now = new Date();

type Props = {
  username: string;
};

export default function ModelDetails({ username }: Props) {
  const [, monthEarnings, loadMonthEarnings] = useEarnings();
  const [, allEarnings, loadAllEarnings] = useEarnings();
  const [, model, loadModel] = useModel();

  useEffectOnce(() => {
    loadModel(username);
    loadMonthEarnings(username, startOfMonth(now), endOfMonth(now));
    loadAllEarnings(username, subYears(now, 5), now);
  });

  return (
    <PageWrapper>
      <div className="container space-y-8 pb-8">
        <WelcomeBar />
        <Card>
          <div className="gap-2 flex flex-col">
            <h6 className="border-b-2 p-3 flex justify-between items-center font-bold">
              {username}
              <span className="text-xs opacity-30 text-right">
                Started on {model?.start_date}
              </span>
            </h6>
            <div className="p-3 flex justify-between">
              <EarningSummary
                label={`To pay • ${format(now, "MMM yyyy")}`}
                value={monthEarnings?.reduce(
                  (partialSum, a) => partialSum + a.tokens,
                  0
                )}
              />
              <EarningSummary
                label="Total Earnings"
                value={allEarnings?.reduce(
                  (partialSum, a) => partialSum + a.tokens,
                  0
                )}
              />
            </div>
          </div>
        </Card>
        <div></div>
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
