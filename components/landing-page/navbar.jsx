"use client";

import { useState, useEffect, useRef } from "react";
import { useDropMenu } from "@/hooks/useDropMenu";
import { useNav } from "@/hooks/useNav";

import Link from "next/link";
import Image from "next/image";

import { UserButton, useAuth } from "@clerk/nextjs";

import { SearchInput } from "@/components/ui/input";

import { Search, Menu, ChevronDown } from "lucide-react";

import { LoginBtn } from "../shared/customs-btns";

import { UbuntuFont } from "@/config/fonts";

const Navbar = () => {
  const { userId } = useAuth();

  const [toggleDropdown, closeDropdown, isOpen, dropdownRef] = useDropMenu();
  const [open, MenuOpen] = useNav();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="flex justify-between items-center py-5 max-w-[95rem] mx-auto px-5 md:px-10">
      <div className="flex items-center space-x-6">
        <Link href="/">
          <Image
            src="/logo.svg"
            width={190}
            height={100}
            alt={"FiziChemi Logo"}
            className="hover:opacity-85 active:scale-[0.99]"
          />
        </Link>
        <div className="hidden xl:block">
          <ul className={`${UbuntuFont.className} flex gap-4 font-semibold`}>
            <li className="relative">
              <button className="flex items-center" onClick={toggleDropdown}>
                Tutoriels
                <ChevronDown size={20} />
              </button>
              {isOpen && (
                <div
                  ref={dropdownRef}
                  className="dropdown-content w-44 p-5 rounded-lg bg-primary border-2 border-accent absolute z-50"
                >
                  <ul className="space-y-3">
                    <li>
                      <Link href={"/exams/toefl"} onClick={closeDropdown}>
                        TOEFL Exam
                      </Link>
                    </li>
                    <li>
                      <Link href={"/exams/sat"} onClick={closeDropdown}>
                        SAT Exam
                      </Link>
                    </li>
                    <li>
                      <Link href={"/exams/ielts"} onClick={closeDropdown}>
                        IELTS Exam
                      </Link>
                    </li>
                    <li>
                      <Link href={"/exams/toeic"} onClick={closeDropdown}>
                        TOEIC Exam
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
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
            className="max-w-56 rounded-3xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
          />
        </div>
        <span className="hidden sm:block">
          {userId ? (
            <div className="flex gap-4 items-center border-2 border-accent rounded-full p-[2px]">
              <UserButton />
            </div>
          ) : (
            <LoginBtn text={"Se connecter"} href={"/sign-in"} />
          )}
        </span>
        <div className="block md:hidden">
          <Menu size={32} className="cursor-pointer" />
        </div>
        {open && (
          <div className="absolute right-[25px] mt-56 sm:mt-48 z-30 w-[50%] bg-primary border-2 border-accent rounded-lg block md:hidden">
            <ul className="flex flex-col justify-center gap-3 font-semibold p-4">
              <li>
                <Link href={"/#prep"}>1 AC</Link>
              </li>
              <li>
                <Link href={"/"}>2 AC</Link>
              </li>
              <li>
                <Link href={"/blog"}>3 AC</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
