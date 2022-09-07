type Props = JSX.IntrinsicElements["input"] & {
  label?: string;
};

export function Input(props: Props) {
  return (
    <input
      {...props}
      placeholder={props.label}
      className={`${props.className} rounded border-2 border-gray-300 focus:border-gray-400 focus:ring-0`}
    />
  );
}
