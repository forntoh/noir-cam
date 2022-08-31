import React, { useState } from "react";

type Props = JSX.IntrinsicElements["input"] & {
  label?: string;
};

export function Input(props: Props) {
  const [hasFocus, setFocus] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        onFocus={(e) => {
          props.onFocus?.(e);
          setFocus(true);
        }}
        onBlur={(e) => {
          props.onBlur?.(e);
          setFocus(false);
        }}
        className={`${props.className} border-0 px-0 bg-tranparent outline-none focus:ring-0 border-b-2 border-gray-300 focus:border-black w-full`}
      />
      <label
        className={`transition-all font-semibold absolute left-0 top-0 ${
          hasFocus || props.value
            ? "translate-x-0 -translate-y-2.5 text-sm"
            : "translate-x-1 translate-y-2 text-gray-500"
        }`}
      >
        {props.label}
      </label>
    </div>
  );
}
