import React from "react";

const Card = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  (props: React.HTMLProps<HTMLDivElement>, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className={`rounded border-2 ${props.className}`}
      />
    );
  }
);

export default Card;
