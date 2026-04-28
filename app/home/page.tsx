"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";

const C = {
  bg: "#000000", cyan: "#2DE1FF", yellow: "#F8E71C",
  white: "#F5F5F7", muted: "#9AA0B2", surface: "#0E1016", border: "#161922",
};

const NAV = [
  { label: "문장 남기기", href: "/home" },
  { label: "공명 피드",   href: "/feed" },
  { label: "내 기록",     href: "/archive" },
];

export default function HomePage() {
  const [sentence, setSentence] = useState("");
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);

  const creatorNo =
    typeof window !== "undefined"
      ? localStorage.getItem("creatorNo") || "CREATOR"
      : "CREATOR";

  const handleSubmit = async () => {
    if (!sentence.trim() || sentence.trim().length < 5) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        sentence:   sentence.trim(),
        creatorNo:  creatorNo,
        resonances: 0,
        createdAt:  serverTimestamp(),
      });
      setDone(true);
      setSentence("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: C.bg, display: "flex", flexDirection: "column" }}>

      {/* 헤더 */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px", borderBottom: `1px solid ${C.border}`,
      }}>
        <span style={{ fontSize: 10, letterSpacing: "0.3em", color: C.cyan, opacity: 0.8 }}>HIP VOID</span>
        <span style={{ fontSize: 11, color: C.muted }}>Creator No. {creatorNo}</span>
      </div>

      {/* 메인 */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "32px 24px",
      }}>
        {done ? (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              border: `1.5px solid ${C.cyan}`,
              boxShadow: `0 0 30px rgba(45,225,255,0.5)`,
              margin: "0 auto 24px",
            }} />
            <p style={{ fontSize: 10, letterSpacing: "0.3em", color: C.cyan, marginBottom: 12 }}>RESONANCE RECORDED</p>
            <p style={{ fontSize: 20, color: C.white, fontWeight: 300, marginBottom: 8 }}>문장이 기록되었습니다.</p>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 40 }}>당신의 흔적이 남았습니다.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button onClick={() => setDone(false)} style={{
                padding: "14px 32px", backgroundColor: C.cyan,
                color: "#000", fontWeight: 700, fontSize: 14,
                border: "none", borderRadius: 2, cursor: "pointer",
              }}>
                또 다른 문장 남기기
              </button>
              <Link href="/feed" style={{
                padding: "14px 32px", border: `1px solid ${C.border}`,
                color: C.muted, textAlign: "center", fontSize: 13,
                borderRadius: 2, textDecoration: "none",
              }}>
                피드 보기 →
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ width: "100%", maxWidth: 480 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.35em", color: C.cyan, marginBottom: 16, textAlign: "center" }}>
              TODAY&apos;S RESONANCE
            </p>
            <h2 style={{
              fontSize: 22, color: C.white, fontWeight: 300,
              textAlign: "center", lineHeight: 1.5, marginBottom: 32,
            }}>
              오늘 당신을 멈춰 세운<br />문장은 무엇입니까?
            </h2>
            <textarea
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              placeholder="책 속 문장을 입력하세요..."
              maxLength={300}
              rows={5}
              style={{
                width: "100%", backgroundColor: C.surface,
                border: `1px solid ${sentence.length > 0 ? C.cyan : C.border}`,
                color: C.white, fontSize: 16, lineHeight: 1.8,
                padding: "16px", borderRadius: 4, outline: "none",
                resize: "none", fontFamily: "Georgia, serif",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              <span style={{ fontSize: 11, color: C.muted }}>{sentence.length}/300</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || sentence.trim().length < 5}
              style={{
                width: "100%", padding: "16px",
                backgroundColor: sentence.trim().length >= 5 ? C.cyan : C.border,
                color: sentence.trim().length >= 5 ? "#000" : C.muted,
                fontWeight: 700, fontSize: 15, border: "none",
                borderRadius: 2, cursor: sentence.trim().length >= 5 ? "pointer" : "default",
              }}
            >
              {loading ? "기록 중…" : "문장 남기기"}
            </button>
          </div>
        )}
      </div>

      {/* 하단 네비 */}
      <nav style={{ display: "flex", borderTop: `1px solid ${C.border}` }}>
        {NAV.map(({ label, href }) => {
          const active = href === "/home";
          return (
            <a key={href} href={href} style={{
              flex: 1, padding: "14px 0", textAlign: "center",
              fontSize: 11, textDecoration: "none", letterSpacing: "0.1em",
              borderBottom: active ? `2px solid ${C.cyan}` : "none",
              color: active ? C.cyan : C.muted,
            }}>
              {label}
            </a>
          );
        })}
      </nav>
    </main>
  );
}
