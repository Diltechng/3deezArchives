import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Header() {
  return ( 
      <nav className="fixed w-full h-20 shadow-xl">
        <div className="flex justify-between items-center h-full w-full">
          <div className="flex ml-5">
            <a href="http://" target="_blank" rel="noopener noreferrer" className="px-2">About</a>
            <a href="http://" target="_blank" rel="noopener noreferrer"className="px-2">Portfolio</a>
            <a href="http://" target="_blank" rel="noopener noreferrer"className="px-2">Testimonials</a>
          </div>
          <div className="flex mr-5">
             <FaFacebookF className="text-black hover:text-blue-600 transition-colors mr-7" size={24} />
             <FaInstagram className="text-black hover:text-blue-600 transition-colors mr-7" size={24} />
             <FaTwitter className="text-black hover:text-blue-600 transition-colors mr-7" size={24} />
            <a href="http://" target="_blank" rel="noopener noreferrer"className="px-2 text-xl rounded-full decoration-solid bg-gray-100 ">Login</a>
          </div>
        </div>
      </nav>
  );
}
