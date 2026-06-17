import { ALL_PRODUCTS, CART, HOME, LOGIN, REGISTER } from "@/api/clientURL";
import type React from "react";
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { NavLink } from "react-router";

const SHOP_LINKS = [
  { label: "Home", to: HOME },
  { label: "All Products", to: ALL_PRODUCTS },
  { label: "Cart", to: CART },
];

const ACCOUNT_LINKS = [
  { label: "Sign In", to: LOGIN },
  { label: "Register", to: REGISTER },
];

const SOCIAL_LINKS = [
  { icon: <FaFacebookF />, href: "https://facebook.com", label: "Facebook" },
  { icon: <FaTwitter />, href: "https://twitter.com", label: "Twitter" },
  { icon: <FaInstagram />, href: "https://instagram.com", label: "Instagram" },
  { icon: <FaYoutube />, href: "https://youtube.com", label: "YouTube" },
  { icon: <FaGithub />, href: "https://github.com", label: "GitHub" },
];

const CONTACT_INFO = [
  {
    icon: <MdLocationOn className="shrink-0 mt-0.5" />,
    text: "123 Commerce St, Dhaka, Bangladesh",
  },
  { icon: <MdPhone className="shrink-0" />, text: "+880 1234-567890" },
  { icon: <MdEmail className="shrink-0" />, text: "support@nexvolt.com" },
];

const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => (
  <NavLink
    to={to}
    className="text-gray-400 hover:text-primary transition-colors text-sm leading-relaxed"
  >
    {children}
  </NavLink>
);

const Footer: React.FC<{ className?: string }> = ({ className }) => {
  const year = new Date().getFullYear();

  return (
    <footer className={`bg-gray-950 text-white ${className ?? ""}`}>
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand column */}
        <div className="flex flex-col gap-4">
          <NavLink
            to={HOME}
            className="text-2xl font-black tracking-tight w-fit"
          >
            <span className="text-white">NEX</span>
            <span className="text-primary">VOLT</span>
          </NavLink>
          <p className="text-gray-400 text-sm leading-relaxed max-w-56">
            Your one-stop destination for the latest electronics and gadgets —
            fast shipping, secure payments.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-2 mt-1">
            {SOCIAL_LINKS.map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:bg-primary hover:text-white transition-all text-sm"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Shop links */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">
            Shop
          </h3>
          {SHOP_LINKS.map(({ label, to }) => (
            <FooterLink key={to} to={to}>
              {label}
            </FooterLink>
          ))}
        </div>

        {/* Account links */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">
            Account
          </h3>
          {ACCOUNT_LINKS.map(({ label, to }) => (
            <FooterLink key={to} to={to}>
              {label}
            </FooterLink>
          ))}
          <a
            href="mailto:support@nexvolt.com"
            className="text-gray-400 hover:text-primary transition-colors text-sm leading-relaxed"
          >
            Help & Support
          </a>
          <span className="text-gray-400 text-sm leading-relaxed cursor-default">
            Return Policy
          </span>
          <span className="text-gray-400 text-sm leading-relaxed cursor-default">
            Privacy Policy
          </span>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">
            Contact Us
          </h3>
          {CONTACT_INFO.map(({ icon, text }) => (
            <div
              key={text}
              className="flex items-start gap-2 text-gray-400 text-sm"
            >
              <span className="text-primary text-base">{icon}</span>
              <span className="leading-relaxed">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/8" />

      {/* Copyright bar */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
        <span>
          &copy; {year} <span className="text-white font-semibold">NEX</span>
          <span className="text-primary font-semibold">VOLT</span>. All rights
          reserved.
        </span>
        <span>Made with ♥ in Bangladesh</span>
      </div>
    </footer>
  );
};

export default Footer;
