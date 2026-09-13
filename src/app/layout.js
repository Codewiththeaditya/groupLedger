import "./globals.css";
import ThemeProvider from "@/providers/theme-provider";
import QueryProvider from "@/providers/query-provider";
import { Toaster } from "sonner";

export const metadata = {
  title: "GroupLedger",
  description: "Track and split group expenses easily",

  manifest: "/manifest.webmanifest",

  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GroupLedger",
  },
};

export const viewport = {
  themeColor: "#3b82f6",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <QueryProvider>
            {children}
            <Toaster richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}