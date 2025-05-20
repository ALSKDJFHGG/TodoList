import * as React from "react";
import * as RadixAvatar from "@radix-ui/react-avatar";

interface AvatarProps {
  src: string;
  fallback?: React.ReactNode;
  className?: string;
}

const Avatar = ({ src, fallback, className }: AvatarProps) => {
  return (
      <RadixAvatar.Root
          className={`relative flex shrink-0 overflow-hidden rounded-full ${className || ""}`}
      >
        <RadixAvatar.Image
            className="h-full w-full object-cover"
            src={src}
            alt="Avatar"
        />
        <RadixAvatar.Fallback className="flex h-full w-full items-center justify-center bg-gray-200">
          {fallback}
        </RadixAvatar.Fallback>
      </RadixAvatar.Root>
  );
};

export { Avatar };
