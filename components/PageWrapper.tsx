import React from "react";
import Header from "./header";

export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-full">
      <Header />
      {children}
    </div>
  );
};
