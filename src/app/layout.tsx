import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShiftFlow | Simplifying Workforce Management",
  description: "ShiftFlow is a powerful workforce management platform that connects clients, admins, and student workers seamlessly. Manage shift assignments, track hours, adjust earnings, and streamline the approval process, all in one place. With flexible shift creation, real-time tracking, and tailored project assignment, ShiftFlow makes it easy to meet workforce demands while ensuring transparency and efficiency. Perfect for factories, agencies, and admins coordinating student workers. Enhance productivity and simplify operations with ShiftFlow's intuitive and scalable SaaS solution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="relative">
      <body className={twMerge(dmSans.className, "antialiased bg-[#EAEEFE]")}>{children}</body>
    </html>
  );
}
