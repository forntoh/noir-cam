import { useEffect } from "react";
import { useEarnings } from "../hooks/earnings";

export default function Home() {
  const { loading, data, loadData } = useEarnings();

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container p-20">
      {data?.map((earning) => (
        <>
          <div>{earning.username}</div>
          <div>{earning.tokens}</div>
          <div>{earning.paidOut}</div>
        </>
      ))}
    </div>
  );
}
