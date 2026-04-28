"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Tally postMessage 감지 (모든 형태 대응)
    const handleMessage = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (
          data?.type === "tally-form-submitted" ||
          data?.event === "form_submitted" ||
          (typeof e.data === "string" && e.data.includes("tally"))
        ) {
          setSubmitted(true);
          setTimeout(() => router.push("/welcome"), 800);
        }
      } catch {}
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  const C = {
    bg: "#000000",
    cyan: "#2DE1FF",
    white: "#F5F5F7",
    muted: "#9AA0B2",
    border: "#161922",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: C.bg }}>
      {/* 헤더 */}
      <div style={{
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        borderBottom: `1px solid ${C.border}`,
        backgroundColor: C.bg,
        flexShrink: 0,
      }}>
        <a href="/" style={{
          width: 40, height: 36,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 999,
          backgroundColor: "rgba(45,225,255,0.08)",
          border: "1px solid rgba(45,225,255,0.3)",
          color: C.cyan, fontSize: 24, textDecoration: "none",
        }}>‹</a>
        <span style={{ fontSize: 14, fontWeight: 500, color: C.white, letterSpacing: "0.06em" }}>
          창조자 등록
        </span>
        <div style={{ width: 40 }} />
      </div>

      {/* Tally 폼 iframe */}
      <iframe
        src="https://tally.so/embed/441PbY?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
        style={{
          flex: 1,
          width: "100%",
          border: "none",
          backgroundColor: C.bg,
        }}
        title="창조자 등록 폼"
        allow="camera; microphone; autoplay; encrypted-media;"
      />

      {/* 완료 후 수동 이동 버튼 (폼 아래 항상 표시) */}
      <div style={{
        padding: "12px 16px 24px",
        borderTop: `1px solid ${C.border}`,
        backgroundColor: C.bg,
        flexShrink: 0,
      }}>
        {submitted ? (
          <div style={{
            textAlign: "center",
            padding: "12px",
            color: C.cyan,
            fontSize: 14,
          }}>
            ✓ 등록 완료! 이동 중...
          </div>
        ) : (
          <button
            onClick={() => router.push("/welcome")}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "transparent",
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              color: C.muted,
              fontSize: 13,
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            폼 제출 후 여기를 누르세요 →
          </button>
        )}
      </div>
    </div>
  );
}
