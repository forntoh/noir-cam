type Props = {
  label: string;
  children: React.ReactNode;
};

function EarningWrapper({ label, children }: Props) {
  return (
    <div className="space-y-2 truncate">
      <b className="text-xs">{label}</b>
      {children}
    </div>
  );
}

export default EarningWrapper;
