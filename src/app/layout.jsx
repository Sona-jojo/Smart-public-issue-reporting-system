import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { getServerLang } from "@/lib/language";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata = {
  title: "Smart Public Issue Reporting System",
  description: "Role-based issue reporting workflow for Panchayath governance",
};

export default async function RootLayout({ children }) {
  const lang = await getServerLang();

  return (
    <html lang={lang}>
      <body className={`${spaceGrotesk.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
