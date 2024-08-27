import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export const CustomDropdown = ({ items }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center cursor-pointer">
        Tutoriels
        <ChevronDown size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44 p-5 rounded-lg bg-white border-2 border-primary">
        {items.map((item) => (
          <DropdownMenuItem key={item.href}>
            <Link
              href={item.href}
              className="text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
