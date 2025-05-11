import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rhizome",
  description: "Rhizome은 유기적으로 연결된 지식과 사람을 위한 플랫폼입니다.",
  keywords: "rhizome, 리좀, 네트워크, 지식, 커뮤니티",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className={inter.className}>
        {children}
        {modal}
      </body>
    </html>
  );
}
