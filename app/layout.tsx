import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HIP VOID — 창조자 커뮤니티",
  description: "저자 김영한의 창조자 커뮤니티. 힙철학 창조자 베이스캠프 합류하기",
  openGraph: {
    title: "HIP VOID",
    description: "힙철학 창조자 베이스캠프 합류하기",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-black min-h-screen">{children}</body>
    </html>
  );
}
