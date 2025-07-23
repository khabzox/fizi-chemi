import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

interface SearchInputProps extends React.ComponentProps<"input"> {
  icon?: React.ElementType;
  onSearch: () => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, placeholder, type, icon: Icon, onSearch, ...props }, ref) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onSearch();
      }
    };

    return (
      <div className="relative flex items-center">
        {Icon && (
          <button
            type="button"
            className="absolute left-3 flex items-center"
            onClick={onSearch}
          >
            <Icon className="text-primary" />
          </button>
        )}
        <Input
          type={type}
          className={cn(
            "flex h-10 w-full pl-10 pr-4 rounded-md border-2 bg-transparent border-primary px-10 py-2 text-sm ring-primary placeholder:text-primary-hover file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { Input, SearchInput  }
