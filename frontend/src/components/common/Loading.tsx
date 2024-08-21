import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

function Loading({ children }: Props) {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen flex justify-center items-center bg-black opacity-20 z-10">
      {children}
    </div>
  );
}

export default Loading;
