import React from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.HTMLProps<HTMLInputElement>
>((props: React.HTMLProps<HTMLInputElement>, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      className={`${props.className} rounded border-2 border-gray-300 focus:border-gray-400 focus:ring-0`}
    />
  );
});
