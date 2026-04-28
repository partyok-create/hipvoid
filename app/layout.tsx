import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HIP VOID — 창조자 커뮤니티",
  description: "저자 김영한의 창조자 커뮤니티. 허무는 병이 아니다. 창조의 시작이다.",
  openGraph: {
    title: "HIP VOID",
    description: "허무는 병이 아니다. 창조의 시작이다.",
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
