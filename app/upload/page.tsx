"use client";
import { useState, useRef, useEffect } from "react";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

const STICKY_COLORS = ["#1A1A2E", "#16213E", "#0F3460", "#1B1B2F", "#2C2C54"];

type ContentType = "sentence" | "photo" | "sticky";

type Post = {
  id: string;
  type?: string;
  sentence?: string;
  photoURL?: string;
  caption?: string;
  stickyText?: string;
  stickyColor?: string;
  creatorNo: string;
  resonances: number;
  createdAt: { seconds: number } | null;
};

export default function UploadPage() {
  // ── 창조자 번호 ──────────────────────────────────────────
  const [creatorNo, setCreatorNo] = useState("");
  const [numberInput, setNumberInput] = useState("");
  const [numberError, setNumberError] = useState("");
  const [numberConfirmed, setNumberConfirmed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("creatorNo");
    if (saved) {
      setCreatorNo(saved);
      setNumberConfirmed(true);
    }
  }, []);

  const handleNumberSubmit = () => {
    if (!numberInput.trim()) {
      setNumberError("번호를 입력해 주세요.");
      return;
    }
    localStorage.setItem("creatorNo", numberInput.trim());
    setCreatorNo(numberInput.trim());
    setNumberConfirmed(true);
    setNumberError("");
  };

  // ── 업로드 폼 ─────────────────────────────────────────────
  const [type, setType] = useState<ContentType>("sentence");
  const [sentence, setSentence] = useState("");
  const [caption, setCaption] = useState("");
  const [stickyText, setStickyText] = useState("");
  const [stickyColor, setStickyColor] = useState(STICKY_COLORS[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── 피드 ─────────────────────────────────────────────────
  const [posts, setPosts] = useState<Post[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [resonated, setResonated] = useState<Set<string>>(new Set());

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(30)
    );
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Post)));
      setFeedLoading(false);
    });
    return () => unsub();
  }, []);

  const handleResonate = async (postId: string) => {
    if (resonated.has(postId)) return;
    setResonated((prev) => new Set(prev).add(postId));
    await updateDoc(doc(db, "posts", postId), { resonances: increment(1) });
  };

  const formatDate = (ts: Post["createdAt"]) => {
    if (!ts) return "";
    const d = new Date(ts.seconds * 1000);
    return `${d.getMonth() + 1}.${d.getDate()}`;
  };

  // ── 업로드 핸들러 ─────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const isValid = () => {
    if (type === "sentence") return sentence.trim().length >= 5;
    if (type === "photo") return imageFile !== null;
    if (type === "sticky") return stickyText.trim().length >= 3;
    return false;
  };

  const handleSubmit = async () => {
    if (!isValid()) return;
    setLoading(true);
    setUploadError("");
    try {
      if (type === "sentence") {
        await addDoc(collection(db, "posts"), {
          type: "sentence",
          sentence: sentence.trim(),
          creatorNo,
          resonances: 0,
          createdAt: serverTimestamp(),
        });
      } else if (type === "photo" && imageFile) {
        const storageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const photoURL = await getDownloadURL(snapshot.ref);
        await addDoc(collection(db, "posts"), {
          type: "photo",
          photoURL,
          caption: caption.trim(),
          creatorNo,
          resonances: 0,
          createdAt: serverTimestamp(),
        });
      } else if (type === "sticky") {
        await addDoc(collection(db, "posts"), {
          type: "sticky",
          stickyText: stickyText.trim(),
          stickyColor,
          creatorNo,
          resonances: 0,
          createdAt: serverTimestamp(),
        });
      }
      setDone(true);
      setSentence("");
      setCaption("");
      setStickyText("");
      setImageFile(null);
      setImagePreview(null);
    } catch (e) {
      console.error(e);
      setUploadError("업로드 실패. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: C.bg, display: "flex", flexDirection: "column" }}>

      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
        <span style={{ fontSize: 10, letterSpacing: "0.3em", color: C.cyan, opacity: 0.8 }}>HIP VOID</span>
        {numberConfirmed
          ? <span style={{ fontSize: 11, color: C.muted }}>Creator No. {creatorNo}</span>
          : <span style={{ fontSize: 11, color: C.muted, letterSpacing: "0.1em" }}>업로드</span>
        }
      </div>

      {/* 메인 */}
      <div style={{ flex: 1, padding: "24px 20px", maxWidth: 480, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>

        {/* ── 번호 미입력 상태 ── */}
        {!numberConfirmed ? (
          <div style={{ paddingTop: 40 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.35em", color: C.cyan, marginBottom: 16, textAlign: "center" }}>
              CREATOR ACCESS
            </p>
            <h2 style={{ fontSize: 20, color: C.white, fontWeight: 300, textAlign: "center", lineHeight: 1.6, marginBottom: 8 }}>
              창조자 번호를 입력하면<br />컨텐츠를 올릴 수 있습니다
            </h2>
            <p style={{ fontSize: 12, color: C.muted, textAlign: "center", marginBottom: 32 }}>
              메일 또는 문자로 받은 번호를 입력하세요
            </p>

            <input
              type="text"
              value={numberInput}
              onChange={(e) => setNumberInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNumberSubmit()}
              placeholder="0001"
              maxLength={8}
              autoFocus
              style={{
                width: "100%",
                backgroundColor: C.surface,
                border: `1px solid ${numberInput ? C.cyan : C.border}`,
                color: C.white,
                fontSize: 32,
                textAlign: "center",
                letterSpacing: "0.5em",
                padding: "16px",
                borderRadius: 4,
                outline: "none",
                fontFamily: "Georgia, serif",
                boxSizing: "border-box",
                marginBottom: 8,
              }}
            />
            {numberError && (
              <p style={{ fontSize: 12, color: "#FF6B6B", textAlign: "center", marginBottom: 12 }}>{numberError}</p>
            )}

            <button
              onClick={handleNumberSubmit}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: numberInput.trim() ? C.cyan : C.border,
                color: numberInput.trim() ? "#000" : C.muted,
                fontWeight: 700,
                fontSize: 15,
                border: "none",
                borderRadius: 2,
                cursor: numberInput.trim() ? "pointer" : "default",
                marginBottom: 20,
              }}
            >
              확인하고 업로드하기 →
            </button>

            <p style={{ fontSize: 12, color: C.muted, textAlign: "center" }}>
              번호가 없으신가요?{" "}
              <a href="/register" style={{ color: C.cyan, textDecoration: "none" }}>창조자 등록</a>
            </p>
          </div>

        ) : done ? (
          /* ── 업로드 완료 화면 ── */
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", border: `1.5px solid ${C.cyan}`, boxShadow: `0 0 30px rgba(45,225,255,0.5)`, margin: "0 auto 24px" }} />
            <p style={{ fontSize: 10, letterSpacing: "0.3em", color: C.cyan, marginBottom: 12 }}>UPLOADED</p>
            <p style={{ fontSize: 20, color: C.white, fontWeight: 300, marginBottom: 8 }}>업로드되었습니다.</p>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 32 }}>당신의 흔적이 남았습니다.</p>
            <button
              onClick={() => setDone(false)}
              style={{ padding: "14px 32px", backgroundColor: C.cyan, color: "#000", fontWeight: 700, fontSize: 14, border: "none", borderRadius: 2, cursor: "pointer" }}
            >
              또 올리기
            </button>
          </div>

        ) : (
          /* ── 업로드 폼 ── */
          <>
            {/* 타입 탭 */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {(["sentence", "photo", "sticky"] as ContentType[]).map((t) => {
                const labels: Record<ContentType, string> = { sentence: "문장", photo: "사진", sticky: "스티커" };
                const active = type === t;
                return (
                  <button key={t} onClick={() => setType(t)} style={{
                    flex: 1, padding: "10px 0", fontSize: 12, letterSpacing: "0.1em",
                    backgroundColor: active ? C.cyan : C.surface,
                    color: active ? "#000" : C.muted,
                    border: `1px solid ${active ? C.cyan : C.border}`,
                    borderRadius: 2, cursor: "pointer", fontWeight: active ? 700 : 400,
                  }}>
                    {labels[t]}
                  </button>
                );
              })}
            </div>

            {/* 문장 */}
            {type === "sentence" && (
              <div>
                <p style={{ fontSize: 10, letterSpacing: "0.3em", color: C.cyan, marginBottom: 14, textAlign: "center" }}>SENTENCE</p>
                <h2 style={{ fontSize: 17, color: C.white, fontWeight: 300, textAlign: "center", lineHeight: 1.6, marginBottom: 20 }}>
                  오늘 당신을 멈춰 세운<br />문장은 무엇입니까?
                </h2>
                <textarea
                  value={sentence}
                  onChange={(e) => setSentence(e.target.value)}
                  placeholder="책 속 문장을 입력하세요..."
                  maxLength={300}
                  rows={5}
                  style={{ width: "100%", backgroundColor: C.surface, border: `1px solid ${sentence.length > 0 ? C.cyan : C.border}`, color: C.white, fontSize: 16, lineHeight: 1.8, padding: "16px", borderRadius: 4, outline: "none", resize: "none", fontFamily: "Georgia, serif", boxSizing: "border-box" }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: C.muted }}>{sentence.length}/300</span>
                </div>
              </div>
            )}

            {/* 사진 */}
            {type === "photo" && (
              <div>
                <p style={{ fontSize: 10, letterSpacing: "0.3em", color: C.cyan, marginBottom: 14, textAlign: "center" }}>PHOTO</p>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{ width: "100%", aspectRatio: "1", backgroundColor: C.surface, border: `2px dashed ${imagePreview ? C.cyan : C.border}`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", marginBottom: 12 }}
                >
                  {imagePreview
                    ? <img src={imagePreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: 32, marginBottom: 8 }}>📷</p>
                        <p style={{ fontSize: 12, color: C.muted }}>탭해서 사진 선택</p>
                      </div>
                  }
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="한 줄 캡션 (선택사항)" maxLength={100}
                  style={{ width: "100%", backgroundColor: C.surface, border: `1px solid ${C.border}`, color: C.white, fontSize: 14, padding: "12px 16px", borderRadius: 4, outline: "none", boxSizing: "border-box" }} />
              </div>
            )}

            {/* 스티커 */}
            {type === "sticky" && (
              <div>
                <p style={{ fontSize: 10, letterSpacing: "0.3em", color: C.cyan, marginBottom: 14, textAlign: "center" }}>STICKY NOTE</p>
                <div style={{ display: "flex", gap: 10, marginBottom: 16, justifyContent: "center" }}>
                  {STICKY_COLORS.map((c) => (
                    <button key={c} onClick={() => setStickyColor(c)} style={{
                      width: 32, height: 32, borderRadius: "50%", backgroundColor: c,
                      border: stickyColor === c ? `2px solid ${C.cyan}` : `2px solid ${C.border}`,
                      cursor: "pointer", boxShadow: stickyColor === c ? `0 0 10px ${C.cyan}` : "none",
                    }} />
                  ))}
                </div>
                <div style={{ backgroundColor: stickyColor, borderRadius: 4, padding: "28px 20px", marginBottom: 16, minHeight: 100, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid rgba(255,255,255,0.08)` }}>
                  <p style={{ fontSize: 15, color: stickyText ? C.white : C.muted, textAlign: "center", lineHeight: 1.8, fontFamily: "Georgia, serif", whiteSpace: "pre-wrap", margin: 0 }}>
                    {stickyText || "스티커 노트 미리보기"}
                  </p>
                </div>
                <textarea value={stickyText} onChange={(e) => setStickyText(e.target.value)} placeholder="짧은 생각이나 인상적인 문구..." maxLength={150} rows={3}
                  style={{ width: "100%", backgroundColor: C.surface, border: `1px solid ${stickyText.length > 0 ? C.cyan : C.border}`, color: C.white, fontSize: 14, lineHeight: 1.7, padding: "14px 16px", borderRadius: 4, outline: "none", resize: "none", boxSizing: "border-box" }} />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: C.muted }}>{stickyText.length}/150</span>
                </div>
              </div>
            )}

            {uploadError && <p style={{ fontSize: 12, color: "#FF6B6B", textAlign: "center", marginTop: 8 }}>{uploadError}</p>}

            <button onClick={handleSubmit} disabled={loading || !isValid()} style={{
              width: "100%", padding: "15px",
              backgroundColor: isValid() ? C.cyan : C.border,
              color: isValid() ? "#000" : C.muted,
              fontWeight: 700, fontSize: 15, border: "none", borderRadius: 2,
              cursor: isValid() ? "pointer" : "default", marginTop: 16,
            }}>
              {loading ? "올리는 중…" : "올리기"}
            </button>
          </>
        )}

        {/* ── 구분선 ── */}
        <div style={{ borderTop: `1px solid ${C.border}`, margin: "36px 0 24px" }} />

        {/* ── 하단 피드 ── */}
        <div>
          <p style={{ fontSize: 10, letterSpacing: "0.3em", color: C.cyan, marginBottom: 20, textAlign: "center" }}>
            CREATORS&apos; FEED
          </p>

          {feedLoading ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p style={{ fontSize: 12, color: C.muted, letterSpacing: "0.2em" }}>LOADING…</p>
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 2 }}>
                아직 올라온 컨텐츠가 없습니다.<br />첫 번째 흔적을 남겨보세요.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {posts.map((post) => (
                <div key={post.id} style={{
                  backgroundColor: post.type === "sticky" ? (post.stickyColor || C.surface) : C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 4,
                  padding: "18px",
                }}>
                  {/* 헤더 */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 9, letterSpacing: "0.2em", color: C.cyan, backgroundColor: "rgba(45,225,255,0.1)", padding: "2px 8px", borderRadius: 999 }}>
                        {post.type === "photo" ? "PHOTO" : post.type === "sticky" ? "STICKY" : "SENTENCE"}
                      </span>
                      <span style={{ fontSize: 10, color: C.cyan, letterSpacing: "0.2em", fontWeight: 600 }}>
                        No.{post.creatorNo}
                      </span>
                    </div>
                    <span style={{ fontSize: 10, color: C.muted }}>{formatDate(post.createdAt)}</span>
                  </div>

                  {/* 내용 */}
                  {(!post.type || post.type === "sentence") && (
                    <p style={{ fontSize: 15, color: C.white, lineHeight: 1.8, fontFamily: "Georgia, serif", margin: "0 0 12px" }}>
                      &ldquo;{post.sentence}&rdquo;
                    </p>
                  )}
                  {post.type === "photo" && (
                    <div style={{ marginBottom: 10 }}>
                      <img src={post.photoURL} alt="" style={{ width: "100%", borderRadius: 2, display: "block", marginBottom: post.caption ? 8 : 0 }} />
                      {post.caption && <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{post.caption}</p>}
                    </div>
                  )}
                  {post.type === "sticky" && (
                    <p style={{ fontSize: 15, color: C.white, lineHeight: 1.8, fontFamily: "Georgia, serif", textAlign: "center", margin: "0 0 12px" }}>
                      {post.stickyText}
                    </p>
                  )}

                  {/* 공명 버튼 */}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={() => handleResonate(post.id)} style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "6px 14px",
                      backgroundColor: resonated.has(post.id) ? "rgba(45,225,255,0.15)" : "transparent",
                      border: `1px solid ${resonated.has(post.id) ? C.cyan : C.border}`,
                      color: resonated.has(post.id) ? C.cyan : C.muted,
                      fontSize: 11, borderRadius: 999, cursor: "pointer", letterSpacing: "0.1em",
                    }}>
                      <span style={{ fontSize: 13 }}>◎</span>
                      공명했다
                      {post.resonances > 0 && <span style={{ opacity: 0.8 }}>{post.resonances}</span>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 여백 */}
        <div style={{ height: 40 }} />
      </div>

      {/* 하단 네비 */}
      <nav style={{ display: "flex", borderTop: `1px solid ${C.border}`, position: "sticky", bottom: 0, backgroundColor: C.bg }}>
        {NAV.map(({ label, href }) => {
          const active = href === "/upload";
          return (
            <a key={href} href={href} style={{
              flex: 1, padding: "14px 0", textAlign: "center", fontSize: 11,
              textDecoration: "none", letterSpacing: "0.1em",
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
