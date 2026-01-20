import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Header() {
  return (
    <nav className="w-full bg-gray-300 px-6 py-4 text-black">
      <div className="mx-auto grid max-w-7xl grid-cols-3 items-center">
        
        {/* LEFT: Navigation links */}
        <ul className="flex gap-6 justify-start">
          <li>
            <Link href="/" className="hover:text-gray-700">
              About
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-gray-700">
              Portfolio
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-gray-700">
              Testimonials
            </Link>
          </li>
        </ul>

        {/* CENTER: Text */}
        <div className="text-center text-xl font-bold">
          3Deez_Achives
        </div>

        {/* RIGHT: Social media icons + Login */}
        <div className="flex items-center gap-4 justify-end">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-700 transition"
          >
            <FaFacebookF />
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-700 transition"
          >
            <FaInstagram />
          </a>

          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-700 transition"
          >
            <FaTwitter />
          </a>

          {/* Login Button */}
          <Link
            href="/login"
            className="ml-2 rounded-md border border-black bg-transparent px-4 py-1.5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
          >
            Login
          </Link>
        </div>

      </div>
    </nav>
  );
}
