import Image from "next/image";
import logo from "@/public/3deez-logo.svg";

const Topbar = () => (
  <header className="px-6 py-4 border-b border-border-primary">
    <div className="w-30">
      <Image
        src={logo}
        alt="Company Logo"
        className="w-full"
      />
    </div>
  </header>
);

export default Topbar;