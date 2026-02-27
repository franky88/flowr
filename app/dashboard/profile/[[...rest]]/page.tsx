"use client";
import { UserProfile } from "@clerk/nextjs";
import { dark, shadcn } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function ProfilePage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex justify-start p-4 lg:p-6">
      <UserProfile
        routing="hash"
        appearance={{
          theme: shadcn,
          variables: {
            colorShadow: "none",
            colorForeground: "inherit",
          },
        }}
      />
    </div>
  );
}
