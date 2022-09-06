import { IconType } from "react-icons";

export type ButtonProps = JSX.IntrinsicElements["button"] & {
  icon: IconType;
};

function IconButton(props: ButtonProps) {
  const { icon: Icon, onClick } = props;
  return (
    <button
      className={`flex gap-2 ${props.className} relative flex items-center group bg-opacity-0 hover:bg-opacity-10 p-2 rounded-md`}
      onClick={onClick}
    >
      <Icon className="w-4 h-4 text-current group-hover:text-current" />
    </button>
  );
}

export default IconButton;
