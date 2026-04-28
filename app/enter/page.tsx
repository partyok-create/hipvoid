"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const C = {
  bg: "#000000", cyan: "#2DE1FF", yellow: "#F8E71C",
  white: "#F5F5F7", muted: "#9AA0B2", surface: "#0E1016", border: "#161922",
};

export default function EnterPage() {
  const [number, setNumber]   = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim()) { setError("번호를 입력해 주세요."); return; }
    setLoading(true);
    setError("");

    // 창조자 번호 저장 후 홈으로 이동
    localStorage.setItem("creatorNo", number.trim());
    setTimeout(() => router.push("/home"), 600);
  };

  return (
    <main style={{
      minHeight: "100vh", backgroundColor: C.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "0 24px",
      position: "relative",
    }}>
      <div style={{
        position: "absolute", width: 360, height: 360, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(45,225,255,0.06) 0%, transparent 70%)",
        top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none",
      }} />

      <div style={{ position: "relative", width: "100%", maxWidth: 360 }}>
        <a href="/" style={{ display: "block", color: C.muted, fontSize: 13, marginBottom: 40, textDecoration: "none" }}>
          ← 돌아가기
        </a>

        <p style={{ fontSize: 10, letterSpacing: "0.4em", color: C.cyan, marginBottom: 12 }}>
          CREATOR ACCESS
        </p>
        <h2 style={{ fontSize: 26, color: C.white, fontWeight: 300, lineHeight: 1.4, marginBottom: 8 }}>
          창조자 번호로<br />입장하세요
        </h2>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 40 }}>
          메일 또는 문자로 받은 번호를 입력해 주세요.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, color: C.muted, letterSpacing: "0.2em", marginBottom: 8 }}>
              CREATOR No.
            </label>
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="0001"
              maxLength={8}
              autoFocus
              style={{
                width: "100%", backgroundColor: C.surface,
                border: `1px solid ${number ? C.cyan : C.border}`,
                color: C.white, fontSize: 28, textAlign: "center",
                letterSpacing: "0.5em", padding: "16px",
                borderRadius: 4, outline: "none",
                fontFamily: "Georgia, serif",
              }}
            />
            {error && <p style={{ color: "#ff6b6b", fontSize: 12, marginTop: 6, textAlign: "center" }}>{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "16px", backgroundColor: C.cyan,
              color: "#000", fontWeight: 700, fontSize: 15,
              border: "none", borderRadius: 2, cursor: "pointer",
              letterSpacing: "0.05em", opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "확인 중…" : "입장하기 →"}
          </button>
        </form>

        <div style={{ marginTop: 32, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: C.muted }}>
            아직 번호가 없으신가요?{" "}
            <a href="/register" style={{ color: C.cyan, textDecoration: "none" }}>창조자 등록</a>
          </p>
        </div>
      </div>

      <p style={{ position: "absolute", bottom: 32, fontSize: 11, color: "#E6E8EE", letterSpacing: "0.18em", opacity: 0.7 }}>
        김영한 著 ·『힙 허무는 창조다』
      </p>
    </main>
  );
}
