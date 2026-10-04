import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/lib/authContext";
import { ThemeProvider } from "@/lib/themeContext";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Skills2Job | Turn Your Skills Into Your Next Opportunity",
  description: "AI-Powered Career Matchmaking & Explainable Recruitment Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
