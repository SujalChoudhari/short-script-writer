import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Shorts Script Generator",
  description: "Courtesy of Sujal Choudhari",
  author: "Sujal Choudhari",
  keywords: "shorts, shorts script, shorts script generator, shorts script generator, shorts script generator, shorts script generator, groq",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
