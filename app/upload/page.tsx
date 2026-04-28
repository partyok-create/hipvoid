"use client";
import { useState, useRef } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
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

export default function UploadPage() {
  const [type, setType] = useState<ContentType>("sentence");
  const [sentence, setSentence] = useState("");
  const [caption, setCaption] = useState("");
  const [stickyText, setStickyText] = useState("");
  const [stickyColor, setStickyColor] = useState(STICKY_COLORS[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const creatorNo =
    typeof window !== "undefined"
      ? localStorage.getItem("creatorNo") || "CREATOR"
      : "CREATOR";

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
    setError("");
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
      setError("업로드 실패. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
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

      {/* 메인 */}
      <div
        style={{
          flex: 1,
          padding: "24px 20px",
          maxWidth: 480,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {done ? (
          /* 완료 화면 */
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: `1.5px solid ${C.cyan}`,
                boxShadow: `0 0 30px rgba(45,225,255,0.5)`,
                margin: "0 auto 24px",
              }}
            />
            <p style={{ fontSize: 10, letterSpacing: "0.3em", color: C.cyan, marginBottom: 12 }}>
              UPLOADED
            </p>
            <p style={{ fontSize: 20, color: C.white, fontWeight: 300, marginBottom: 8 }}>
              업로드되었습니다.
            </p>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 40 }}>
              당신의 흔적이 남았습니다.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={() => setDone(false)}
                style={{
                  padding: "14px 32px",
                  backgroundColor: C.cyan,
                  color: "#000",
                  fontWeight: 700,
                  fontSize: 14,
                  border: "none",
                  borderRadius: 2,
                  cursor: "pointer",
                }}
              >
                또 올리기
              </button>
              <a
                href="/feed"
                style={{
                  padding: "14px 32px",
                  border: `1px solid ${C.border}`,
                  color: C.muted,
                  textAlign: "center",
                  fontSize: 13,
                  borderRadius: 2,
                  textDecoration: "none",
                }}
              >
                피드 보기 →
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* 타입 탭 */}
            <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
              {(["sentence", "photo", "sticky"] as ContentType[]).map((t) => {
                const labels: Record<ContentType, string> = {
                  sentence: "문장",
                  photo: "사진",
                  sticky: "스티커",
                };
                const active = type === t;
                return (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    style={{
                      flex: 1,
                      padding: "10px 0",
                      fontSize: 12,
                      letterSpacing: "0.1em",
                      backgroundColor: active ? C.cyan : C.surface,
                      color: active ? "#000" : C.muted,
                      border: `1px solid ${active ? C.cyan : C.border}`,
                      borderRadius: 2,
                      cursor: "pointer",
                      fontWeight: active ? 700 : 400,
                    }}
                  >
                    {labels[t]}
                  </button>
                );
              })}
            </div>

            {/* 문장 폼 */}
            {type === "sentence" && (
              <div>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.3em",
                    color: C.cyan,
                    marginBottom: 16,
                    textAlign: "center",
                  }}
                >
                  SENTENCE
                </p>
                <h2
                  style={{
                    fontSize: 18,
                    color: C.white,
                    fontWeight: 300,
                    textAlign: "center",
                    lineHeight: 1.6,
                    marginBottom: 24,
                  }}
                >
                  오늘 당신을 멈춰 세운<br />문장은 무엇입니까?
                </h2>
                <textarea
                  value={sentence}
                  onChange={(e) => setSentence(e.target.value)}
                  placeholder="책 속 문장을 입력하세요..."
                  maxLength={300}
                  rows={5}
                  style={{
                    width: "100%",
                    backgroundColor: C.surface,
                    border: `1px solid ${sentence.length > 0 ? C.cyan : C.border}`,
                    color: C.white,
                    fontSize: 16,
                    lineHeight: 1.8,
                    padding: "16px",
                    borderRadius: 4,
                    outline: "none",
                    resize: "none",
                    fontFamily: "Georgia, serif",
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <span style={{ fontSize: 11, color: C.muted }}>{sentence.length}/300</span>
                </div>
              </div>
            )}

            {/* 사진 폼 */}
            {type === "photo" && (
              <div>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.3em",
                    color: C.cyan,
                    marginBottom: 16,
                    textAlign: "center",
                  }}
                >
                  PHOTO
                </p>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    backgroundColor: C.surface,
                    border: `2px dashed ${imagePreview ? C.cyan : C.border}`,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    overflow: "hidden",
                    marginBottom: 16,
                    position: "relative",
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: 32, marginBottom: 10 }}>📷</p>
                      <p style={{ fontSize: 12, color: C.muted, letterSpacing: "0.1em" }}>
                        탭해서 사진 선택
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="한 줄 캡션 (선택사항)"
                  maxLength={100}
                  style={{
                    width: "100%",
                    backgroundColor: C.surface,
                    border: `1px solid ${C.border}`,
                    color: C.white,
                    fontSize: 14,
                    padding: "12px 16px",
                    borderRadius: 4,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            )}

            {/* 스티커 노트 폼 */}
            {type === "sticky" && (
              <div>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.3em",
                    color: C.cyan,
                    marginBottom: 16,
                    textAlign: "center",
                  }}
                >
                  STICKY NOTE
                </p>

                {/* 컬러 선택 */}
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 20,
                    justifyContent: "center",
                  }}
                >
                  {STICKY_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setStickyColor(c)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        backgroundColor: c,
                        border: stickyColor === c ? `2px solid ${C.cyan}` : `2px solid ${C.border}`,
                        cursor: "pointer",
                        boxShadow: stickyColor === c ? `0 0 10px ${C.cyan}` : "none",
                      }}
                    />
                  ))}
                </div>

                {/* 미리보기 */}
                <div
                  style={{
                    backgroundColor: stickyColor,
                    borderRadius: 4,
                    padding: "32px 24px",
                    marginBottom: 20,
                    minHeight: 120,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid rgba(255,255,255,0.08)`,
                    transition: "background-color 0.3s",
                  }}
                >
                  <p
                    style={{
                      fontSize: 16,
                      color: stickyText ? C.white : C.muted,
                      textAlign: "center",
                      lineHeight: 1.8,
                      fontFamily: "Georgia, serif",
                      whiteSpace: "pre-wrap",
                      margin: 0,
                    }}
                  >
                    {stickyText || "스티커 노트 미리보기"}
                  </p>
                </div>

                <textarea
                  value={stickyText}
                  onChange={(e) => setStickyText(e.target.value)}
                  placeholder="짧은 생각이나 인상적인 문구..."
                  maxLength={150}
                  rows={3}
                  style={{
                    width: "100%",
                    backgroundColor: C.surface,
                    border: `1px solid ${stickyText.length > 0 ? C.cyan : C.border}`,
                    color: C.white,
                    fontSize: 14,
                    lineHeight: 1.7,
                    padding: "14px 16px",
                    borderRadius: 4,
                    outline: "none",
                    resize: "none",
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <span style={{ fontSize: 11, color: C.muted }}>{stickyText.length}/150</span>
                </div>
              </div>
            )}

            {error && (
              <p style={{ fontSize: 12, color: "#FF6B6B", textAlign: "center", marginTop: 12 }}>
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !isValid()}
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: isValid() ? C.cyan : C.border,
                color: isValid() ? "#000" : C.muted,
                fontWeight: 700,
                fontSize: 15,
                border: "none",
                borderRadius: 2,
                cursor: isValid() ? "pointer" : "default",
                marginTop: 20,
              }}
            >
              {loading ? "올리는 중…" : "올리기"}
            </button>
          </>
        )}
      </div>

      {/* 하단 네비 */}
      <nav style={{ display: "flex", borderTop: `1px solid ${C.border}` }}>
        {NAV.map(({ label, href }) => {
          const active = href === "/upload";
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
