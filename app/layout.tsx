import { ClerkProvider } from "@clerk/nextjs";

import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { HomePage } from "@/config/metadata";

const PlusJakartaSans = Plus_Jakarta_Sans({
  weight: ["300", "400", "500", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = HomePage;

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className={`${PlusJakartaSans.className}`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
