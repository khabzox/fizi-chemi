import * as React from "react";
import { cn } from "@/libs/utils";

const Input = React.forwardRef(
  ({ className, placeholder, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-black bg-primary px-3 py-2 text-sm file:border-0 file:bg-transparent focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      placeholder={placeholder}
      {...props}
    />
  )
);
Input.displayName = "Input";

const SearchInput = React.forwardRef(
  ({ className, placeholder, type, icon: Icon, onSearch, ...props }, ref) => {
    const handleKeyDown = (event) => {
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

export { Input, SearchInput };
