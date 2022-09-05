import Link from "next/link";
import React from "react";

type Props = React.HTMLProps<HTMLAnchorElement>;

const MyLink = ({ href = "/", children, ...props }: Props) => {
  return (
    <Link href={href}>
      <a {...props} className={`${props.className} relative group`}>
        {children}
      </a>
    </Link>
  );
};

export default MyLink;
