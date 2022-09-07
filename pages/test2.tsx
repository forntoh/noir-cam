import Card from "../components/card";
import { EarningSummary } from "../components/earnings";
import Header from "../components/header";
import WelcomeBar from "../components/welcome_bar";

export default function Test() {
  return (
    <>
      <Header />
      {/* Body */}
      <div className="container space-y-8">
        <WelcomeBar />
        {/* Grid */}
        <div className="">
          {/* Grid Item */}
          <Card>
            <div className="gap-2 flex flex-col">
              <h5 className="border-b-2 p-3 flex justify-between items-center font-bold">
                creamy_baby
                <span className="text-sm opacity-30">
                  Started on 10/11/2022
                </span>
              </h5>
              <div className="p-3 flex justify-between">
                <EarningSummary label="To pay • Aug 2022" value={12573} />
                <EarningSummary label="Total Earnings" value={48970} />
              </div>
            </div>
          </Card>
        </div>
        <div className="space-y-5">
          {/* Per model */}
          <h6>Earnings</h6>
          <Card>
            <b className="flex justify-between border-b-2 p-3">
              sweetbooty_one<span>2,893 tk</span>
            </b>
            {/* Table */}
            <ul className="p-3 space-y-4">
              <li className="flex justify-between">
                <div>Aug 01 - Aug 07</div>
                <div>156 tk</div>
              </li>
              <li className="flex justify-between">
                <div>Aug 08 - Aug 14</div>
                <div>681 tk</div>
              </li>
              <li className="flex justify-between">
                <div>Aug 15 - Aug 21</div>
                <div>681 tk</div>
              </li>
              <li className="flex justify-between">
                <div>Aug 22 - Aug 28</div>
                <div>1375 tk</div>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
