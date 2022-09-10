import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import Card from "../card";

interface Props {
  renderButton: (open?: boolean) => React.ReactNode;
  children: React.ReactNode;
}

function PopUpMenu({ children, renderButton }: Props) {
  return (
    <Menu as="div" className="space-y-2 relative">
      {({ open }) => (
        <>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-y-50"
            enterTo="transform opacity-100 scale-y-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-y-100"
            leaveTo="transform opacity-0 scale-y-50"
          >
            <Menu.Items
              as={Card}
              className={`absolute top-5 right-2 z-10 origin-top min-w-full divide-y divide-gray-100`}
            >
              {children}
            </Menu.Items>
          </Transition>
          <Menu.Button as="div" className="z-0 !my-auto">
            {renderButton(open)}
          </Menu.Button>
        </>
      )}
    </Menu>
  );
}

export default PopUpMenu;
