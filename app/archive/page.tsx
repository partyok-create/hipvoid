"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";

const C = {
  bg: "#000000",
  cyan: "#2DE1FF",
  yellow: "#F8E71C",
  white: "#F5F5F7",
  muted: "#9AA0B2",
  surface: "#0E1016",
  border: "#161922",
};

const NAV = [
  { label: "문장", href: "/home" },
  { label: "업로드", href: "/upload" },
  { label: "피드", href: "/feed" },
  { label: "기록", href: "/archive" },
];

type Post = {
  id: string;
  type?: string;
  sentence?: string;
  photoURL?: string;
  caption?: string;
  stickyText?: string;
  stickyColor?: string;
  resonances: number;
  createdAt: { seconds: number } | null;
};

export default function ArchivePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatorNo, setCreatorNo] = useState("CREATOR");

  useEffect(() => {
    const no = localStorage.getItem("creatorNo") || "CREATOR";
    setCreatorNo(no);

    const q = query(
      collection(db, "posts"),
      where("creatorNo", "==", no),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Post)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const formatDate = (ts: Post["createdAt"]) => {
    if (!ts) return "";
    const d = new Date(ts.seconds * 1000);
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("이 기록을 삭제하시겠습니까?")) return;
    await deleteDoc(doc(db, "posts", postId));
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: C.bg,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <span style={{ fontSize: 10, letterSpacing: "0.3em", color: C.cyan, opacity: 0.8 }}>
          HIP VOID
        </span>
        <span style={{ fontSize: 11, color: C.muted }}>Creator No. {creatorNo}</span>
      </div>

      {/* 타이틀 */}
      <div style={{ padding: "24px 20px 8px" }}>
        <p style={{ fontSize: 10, letterSpacing: "0.3em", color: C.cyan, marginBottom: 6 }}>
          MY ARCHIVE
        </p>
        <h1 style={{ fontSize: 18, color: C.white, fontWeight: 300 }}>내 기록</h1>
      </div>

      {/* 리스트 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 12, color: C.muted, letterSpacing: "0.2em" }}>LOADING…</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 2 }}>
              아직 남긴 기록이 없습니다.<br />첫 번째 흔적을 남겨보세요.
            </p>
            <a
              href="/home"
              style={{
                display: "inline-block",
                marginTop: 24,
                padding: "12px 28px",
                backgroundColor: C.cyan,
                color: "#000",
                fontWeight: 700,
                fontSize: 13,
                borderRadius: 2,
                textDecoration: "none",
              }}
            >
              문장 남기기
            </a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* 통계 */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 8,
              }}
            >
              {[
                { label: "전체", count: posts.length },
                {
                  label: "문장",
                  count: posts.filter((p) => !p.type || p.type === "sentence").length,
                },
                { label: "사진", count: posts.filter((p) => p.type === "photo").length },
                { label: "스티커", count: posts.filter((p) => p.type === "sticky").length },
              ].map(({ label, count }) => (
                <div
                  key={label}
                  style={{
                    flex: 1,
                    backgroundColor: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 4,
                    padding: "10px 0",
                    textAlign: "center",
                  }}
                >
                  <p style={{ fontSize: 18, color: C.cyan, fontWeight: 700, margin: 0 }}>
                    {count}
                  </p>
                  <p style={{ fontSize: 10, color: C.muted, margin: "4px 0 0", letterSpacing: "0.1em" }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  backgroundColor: post.type === "sticky" ? post.stickyColor || C.surface : C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 4,
                  padding: "16px",
                  position: "relative",
                }}
              >
                {/* 날짜 + 타입 + 삭제 */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.2em",
                        color: C.cyan,
                        backgroundColor: "rgba(45,225,255,0.1)",
                        padding: "2px 8px",
                        borderRadius: 999,
                      }}
                    >
                      {post.type === "photo"
                        ? "PHOTO"
                        : post.type === "sticky"
                        ? "STICKY"
                        : "SENTENCE"}
                    </span>
                    <span style={{ fontSize: 10, color: C.muted }}>
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(post.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: C.muted,
                      fontSize: 16,
                      cursor: "pointer",
                      opacity: 0.5,
                      padding: "0 4px",
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* 내용 */}
                {(!post.type || post.type === "sentence") && (
                  <p
                    style={{
                      fontSize: 15,
                      color: C.white,
                      lineHeight: 1.8,
                      fontFamily: "Georgia, serif",
                      margin: 0,
                    }}
                  >
                    &ldquo;{post.sentence}&rdquo;
                  </p>
                )}
                {post.type === "photo" && (
                  <div>
                    <img
                      src={post.photoURL}
                      alt="photo"
                      style={{
                        width: "100%",
                        borderRadius: 2,
                        marginBottom: post.caption ? 10 : 0,
                        display: "block",
                      }}
                    />
                    {post.caption && (
                      <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{post.caption}</p>
                    )}
                  </div>
                )}
                {post.type === "sticky" && (
                  <p
                    style={{
                      fontSize: 15,
                      color: C.white,
                      lineHeight: 1.8,
                      fontFamily: "Georgia, serif",
                      margin: 0,
                      textAlign: "center",
                    }}
                  >
                    {post.stickyText}
                  </p>
                )}

                {/* 공명 수 */}
                {post.resonances > 0 && (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                    <span style={{ fontSize: 11, color: C.cyan, opacity: 0.7 }}>
                      ◎ 공명 {post.resonances}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 하단 네비 */}
      <nav style={{ display: "flex", borderTop: `1px solid ${C.border}` }}>
        {NAV.map(({ label, href }) => {
          const active = href === "/archive";
          return (
            <a
              key={href}
              href={href}
              style={{
                flex: 1,
                padding: "14px 0",
                textAlign: "center",
                fontSize: 11,
                textDecoration: "none",
                letterSpacing: "0.1em",
                borderBottom: active ? `2px solid ${C.cyan}` : "none",
                color: active ? C.cyan : C.muted,
              }}
            >
              {label}
            </a>
          );
        })}
      </nav>
    </main>
  );
}
