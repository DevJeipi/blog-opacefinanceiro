import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface GridContainerProps {
  children: ReactNode;
  className?: string;
}

export function GridContainer({ children, className }: GridContainerProps) {
  return (
    <div
      className={twMerge(
        "max-w-container mx-auto w-full px-4 py-12",
        className
      )}
    >
      {children}
    </div>
  );
}
