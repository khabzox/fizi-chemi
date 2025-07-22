import Link from "next/link";

import { LogIn } from "lucide-react";
import { ArrowRight, Loader2Icon } from "lucide-react";

import { cn } from "@/libs/utils";

export function LoginBtn({ text, href, className }) {
  return (
    <Link
      href={href}
      className={cn(
        `flex px-4 py-2 border-2 border-primary rounded-lg gap-2 font-semibold hover:bg-btn hover:transition`
      )}
    >
      <LogIn />
      {text}
    </Link>
  );
}

export function HeroBtn({ text, href, className }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex justify-center gap-2 items-center max-w-xs bg-primary text-white text-lg py-3 px-6 rounded-lg hover:bg-primary-hover transition duration-300",
        className
      )}
    >
      {text} <ArrowRight />
    </Link>
  );
}
