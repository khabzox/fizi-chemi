"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Search, Menu, DoorClosedIcon, CircleX } from "lucide-react";
import { SearchInput } from "@/components/ui/input";
import { LoginBtn } from "@/components/shared/customs-btns";
import { UbuntuFont } from "@/config/fonts";
import { CustomDropdown } from "./custom-dropdown";

const Navbar = () => {
  const { userId } = useAuth();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const dropdownItems = [
    { href: "/exams/college", label: "Collège" },
    { href: "/exams/lycee", label: "Lycée" },
  ];

  return (
    <header className="sticky top-0 z-40 py-4 px-6 md:px-10 bg-white">
      <div className="flex justify-between items-center max-w-[95rem] mx-auto">
        <div className="flex items-center space-x-6">
          <Link href="/">
            <Image
              src="/logo.svg"
              width={150}
              height={80}
              alt="FiziChemi Logo"
              className="active:scale-[0.99] hover:opacity-85 transition-opacity duration-200"
            />
          </Link>
          <div className="hidden xl:flex items-center space-x-6">
            <ul className={`${UbuntuFont.className} flex gap-6 font-semibold`}>
              <li className="relative">
                <CustomDropdown items={dropdownItems} />
              </li>
              <li>
                <Link href="/about-us">À-Propos</Link>
              </li>
              <li>
                <Link href="/contact-us">Contact</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <SearchInput
              icon={Search}
              placeholder="Recherche..."
              className="max-w-xs rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={handleSearch}
            />
          </div>
          <div className="hidden sm:block">
            {userId ? (
              <div className="flex gap-2 items-center border-2 border-accent rounded-full p-1">
                <UserButton />
              </div>
            ) : (
              <LoginBtn text="Se connecter" href="/sign-in" />
            )}
          </div>
          <div className="block md:hidden">
            <Menu
              size={32}
              className="cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 bg-white z-30 overflow-auto">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300">
            <Link href="/">
            <Image
              src="/logo.svg"
              width={150}
              height={80}
              alt="FiziChemi Logo"
              className="active:scale-[0.99] hover:opacity-85 transition-opacity duration-200"
            />
            </Link>
            <CircleX
              size={32}
              className="cursor-pointer"
              onClick={() => setOpen(false)}
            />
          </div>
          <ul className="flex flex-col items-center p-6 space-y-4 font-semibold">
            <li>
              <Link href="/tutorials" className="text-lg">
              Tutoriels
              </Link>
            </li>

            <li>
              <Link href="/about-us" className="text-lg">
                À-Propos
              </Link>
            </li>
            <li>
              <Link href="/contact-us" className="text-lg">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-lg">
                Blog
              </Link>
            </li>
            <li className="mt-4">
              {userId ? (
                <UserButton />
              ) : (
                <LoginBtn text="Se connecter" href="/sign-in" />
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
