import EarningWrapper from "./earning_wrapper";

type Props = {
  label: string;
  value?: number;
};

function EarningSummary({ label, value }: Props) {
  return (
    <EarningWrapper label={label}>
      <h3>
        {value ?? 0}
        <span className="text-lg"> tk</span>
      </h3>
    </EarningWrapper>
  );
}

export default EarningSummary;
