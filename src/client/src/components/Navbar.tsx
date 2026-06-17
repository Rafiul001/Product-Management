import {
  ALL_PRODUCTS,
  CART,
  DASHBOARD,
  HOME,
  LOGIN,
  REGISTER,
} from "@/api/clientURL";
import CartIcon from "@/components/Icons/CartIcon";
import { useCartStore } from "@/store/cartStore";
import useUserAuthStore from "@/store/userAuthStore";
import type React from "react";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link, NavLink } from "react-router";

const navLinks = [
  { label: "Home", to: HOME },
  { label: "All Products", to: ALL_PRODUCTS },
];

const Navbar: React.FC = () => {
  const cart = useCartStore((s) => s.cart);
  const cartCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
  const { isLoggedIn, user, logout } = useUserAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="sticky top-0 z-999 h-fit">
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <NavLink to={HOME} className="text-2xl font-black tracking-tight">
            <span className="text-gray-900">NEX</span>
            <span className="text-primary">VOLT</span>
          </NavLink>

          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  isActive
                    ? "text-primary transition-colors"
                    : "hover:text-primary transition-colors"
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <NavLink
              to={CART}
              className="relative p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 flex items-center justify-center bg-danger-500 text-white text-[10px] font-bold rounded-full leading-none">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </NavLink>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 hover:border-primary hover:text-primary transition-all"
                >
                  <FaUser className="text-xs" />
                  <span className="hidden md:inline max-w-24 truncate">
                    {user.userName}
                  </span>
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-xs font-medium text-gray-800 truncate">
                          {user.userName}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.userEmail}
                        </p>
                      </div>
                      <Link
                        to={DASHBOARD}
                        onClick={() => setDropdownOpen(false)}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        My Dashboard
                      </Link>
                      <button
                        onClick={async () => {
                          setDropdownOpen(false);
                          await logout();
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink
                  to={LOGIN}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                >
                  Sign in
                </NavLink>
                <NavLink
                  to={REGISTER}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
