"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection, query, orderBy, limit,
  onSnapshot, doc, updateDoc, increment,
} from "firebase/firestore";

const C = {
  bg: "#000000", cyan: "#2DE1FF", yellow: "#F8E71C",
  white: "#F5F5F7", muted: "#9AA0B2", surface: "#0E1016", border: "#161922",
};

type Post = {
  id: string;
  sentence: string;
  creatorNo: string;
  resonances: number;
  createdAt: { seconds: number } | null;
};

export default function FeedPage() {
  const [posts, setPosts]         = useState<Post[]>([]);
  const [loading, setLoading]     = useState(true);
  const [resonated, setResonated] = useState<Set<string>>(new Set());

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Post)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleResonate = async (postId: string) => {
    if (resonated.has(postId)) return;
    setResonated((prev) => new Set(prev).add(postId));
    await updateDoc(doc(db, "posts", postId), {
      resonances: increment(1),
    });
  };

  const formatDate = (ts: Post["createdAt"]) => {
    if (!ts) return "";
    const d = new Date(ts.seconds * 1000);
    return `${d.getMonth() + 1}.${d.getDate()}`;
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: C.bg, display: "flex", flexDirection: "column" }}>

      {/* 헤더 */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px", borderBottom: `1px solid ${C.border}`,
      }}>
        <span style={{ fontSize: 10, letterSpacing: "0.3em", color: C.cyan, opacity: 0.8 }}>HIP VOID</span>
        <span style={{ fontSize: 11, color: C.muted, letterSpacing: "0.1em" }}>공명 피드</span>
      </div>

      {/* 피드 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              border: `1px solid ${C.cyan}`, margin: "0 auto 16px",
              opacity: 0.5,
            }} />
            <p style={{ fontSize: 12, color: C.muted, letterSpacing: "0.2em" }}>LOADING…</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 2 }}>
              아직 기록된 문장이 없습니다.<br />
              첫 번째 흔적을 남겨보세요.
            </p>
            <a href="/home" style={{
              display: "inline-block", marginTop: 24,
              padding: "12px 28px", backgroundColor: C.cyan,
              color: "#000", fontWeight: 700, fontSize: 13,
              borderRadius: 2, textDecoration: "none",
            }}>
              문장 남기기
            </a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {posts.map((post) => (
              <div key={post.id} style={{
                backgroundColor: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                padding: "20px",
                position: "relative",
              }}>
                {/* Creator No. + 날짜 */}
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: 14,
                }}>
                  <span style={{
                    fontSize: 10, color: C.cyan,
                    letterSpacing: "0.25em", fontWeight: 600,
                  }}>
                    Creator No. {post.creatorNo}
                  </span>
                  <span style={{ fontSize: 10, color: C.muted }}>
                    {formatDate(post.createdAt)}
                  </span>
                </div>

                {/* 문장 */}
                <p style={{
                  fontSize: 16, color: C.white,
                  lineHeight: 1.8, fontFamily: "Georgia, serif",
                  margin: "0 0 16px",
                }}>
                  "{post.sentence}"
                </p>

                {/* 공명 버튼 */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => handleResonate(post.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "7px 14px",
                      backgroundColor: resonated.has(post.id)
                        ? "rgba(45,225,255,0.15)" : "transparent",
                      border: `1px solid ${resonated.has(post.id) ? C.cyan : C.border}`,
                      color: resonated.has(post.id) ? C.cyan : C.muted,
                      fontSize: 11, borderRadius: 999, cursor: "pointer",
                      letterSpacing: "0.1em", transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: 14 }}>◎</span>
                    공명했다 {post.resonances > 0 && (
                      <span style={{ opacity: 0.8 }}>{post.resonances}</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 하단 네비 */}
      <nav style={{ display: "flex", borderTop: `1px solid ${C.border}` }}>
        {[
          { label: "문장 남기기", href: "/home" },
          { label: "공명 피드",   href: "/feed" },
          { label: "내 기록",     href: "/archive" },
        ].map(({ label, href }) => (
          <a key={href} href={href} style={{
            flex: 1, padding: "14px 0", textAlign: "center",
            fontSize: 11, textDecoration: "none",
            letterSpacing: "0.1em",
            borderBottom: href === "/feed" ? `2px solid ${C.cyan}` : "none",
            color: href === "/feed" ? C.cyan : C.muted,
          }}>
            {label}
          </a>
        ))}
      </nav>
    </main>
  );
}
