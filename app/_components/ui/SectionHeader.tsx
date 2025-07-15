import { ReactNode } from "react";
import { FaPagelines } from "react-icons/fa";

function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-4xl font-bold text-white sm:text-5xl flex items-center gap-x-1.5">
      <FaPagelines size={20} className="rotate-y-180" color="#d7ccc8 " />{" "}
      {children} <FaPagelines size={20} color={"#d7ccc8 "} />
    </h2>
  );
}

export default SectionHeader;
