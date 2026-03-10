"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Top dropdown panel */}
      <div
        className={`fixed top-0 right-0 left-0 z-50 bg-white lg:hidden
          overflow-hidden transition-all duration-300 ease-out
          ${isOpen ? "max-h-[80vh] shadow-xl opacity-100" : "max-h-0 shadow-none opacity-0"}`}
        style={{ willChange: "max-height, opacity" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-sand-100">
          <img src="/images/logo.png" alt={SITE_NAME} className="h-9" />
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-sand-500 hover:bg-sand-100"
            aria-label="סגירה"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation grid */}
        <nav className="grid grid-cols-2 gap-1 p-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`px-4 py-3 rounded-xl text-center text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "text-primary-700 bg-primary-50"
                  : "text-sand-700 hover:bg-sand-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Login button */}
        <div className="px-4 pb-4 pt-1">
          <Link href="/login" onClick={onClose}>
            <Button className="w-full">כניסה</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
