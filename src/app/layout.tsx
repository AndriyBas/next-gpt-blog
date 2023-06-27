import { UserProvider } from "@auth0/nextjs-auth0/client";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
});
const dmSerifDisplay = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
});

export const metadata = {
  title: "Blog Standard",
  description: "Generate Blog articles with ChatGPT & OpenAI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className} ${dmSans.variable} ${dmSerifDisplay.variable}`}
      >
        <main>
          <UserProvider>{children}</UserProvider>
        </main>
      </body>
    </html>
  );
}
