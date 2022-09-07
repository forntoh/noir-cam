type Props = JSX.IntrinsicElements["button"];

export function Button(props: Props) {
  return (
    <button
      {...props}
      className={`${props.className} rounded-md uppercase font-semibold hover:bg-opacity-90 px-6 py-4 flex items-center justify-center gap-2`}
    />
  );
}
