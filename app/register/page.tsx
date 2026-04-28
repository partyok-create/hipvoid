"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Tally 폼 제출 이벤트 감지 → /welcome 으로 이동
    const handleMessage = (e: MessageEvent) => {
      if (
        e.data?.type === "tally-form-submitted" ||
        (typeof e.data === "string" && e.data.includes("tally-form-submitted"))
      ) {
        router.push("/welcome");
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#000" }}>
      {/* 헤더 */}
      <div style={{
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        borderBottom: "1px solid #161922",
        backgroundColor: "#000",
        flexShrink: 0,
      }}>
        <a
          href="/"
          style={{
            width: 40, height: 36,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 999,
            backgroundColor: "rgba(45,225,255,0.08)",
            border: "1px solid rgba(45,225,255,0.3)",
            color: "#2DE1FF",
            fontSize: 24,
            textDecoration: "none",
          }}
        >
          ‹
        </a>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#E6E8EE", letterSpacing: "0.06em" }}>
          창조자 등록
        </span>
        <div style={{ width: 40 }} />
      </div>

      {/* Tally 폼 */}
      <iframe
        src="https://tally.so/r/441PbY"
        style={{
          flex: 1,
          border: "none",
          width: "100%",
          height: "calc(100vh - 56px)",
          backgroundColor: "#000",
        }}
        title="창조자 등록 폼"
        allow="camera; microphone"
      />
    </div>
  );
}
