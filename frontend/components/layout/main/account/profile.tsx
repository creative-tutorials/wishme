import { UserProfile } from "@clerk/nextjs";
import { X } from "lucide-react";

/**
 * Renders the user profile component.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.setIsModal - A function to set the modal state.
 * @return {JSX.Element} The rendered user profile component.
 */
export function Profile(props: {
  setIsModal: (arg0: boolean) => void;
}): JSX.Element {
  return (
    <div
      id="user-profile"
      className="fixed w-full h-full overflow-y-auto top-0 left-0 bg-black/80 backdrop-blur-md p-10 z-10"
    >
      <div className="p-40">
        <X
          className="cursor-pointer fixed top-6 right-10 z-10"
          onClick={() => props.setIsModal(false)}
        />
      </div>
      <div className="flex items-center justify-center h-full">
        <UserProfile />
      </div>
    </div>
  );
}
