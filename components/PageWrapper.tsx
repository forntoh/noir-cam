import Head from "next/head";
import React from "react";
import Header from "./header";

type Props = { children: React.ReactNode; title: string };

export const PageWrapper = ({ children, title }: Props) => {
  return (
    <div className="flex flex-col h-full">
      <Head>
        <title>{title} — NoirCam</title>
      </Head>
      <Header />
      {children}
    </div>
  );
};
