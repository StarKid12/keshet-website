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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 start-0 h-full w-80 max-w-[85vw] bg-white z-50
          transition-transform duration-300 ease-out lg:hidden shadow-2xl
          ${isOpen ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sand-200">
            <img src="/images/logo.png" alt={SITE_NAME} className="h-10" />
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

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-6 py-3 text-base font-medium transition-colors ${
                  pathname === item.href
                    ? "text-primary-700 bg-primary-50 border-e-4 border-primary-500"
                    : "text-sand-700 hover:text-primary-700 hover:bg-sand-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sand-200">
            <Link href="/login" onClick={onClose}>
              <Button className="w-full">כניסה</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
