import Link from "next/link";

const C = {
  bg:     "#000000",
  cyan:   "#2DE1FF",
  yellow: "#F8E71C",
  white:  "#F5F5F7",
  muted:  "#9AA0B2",
};

export default function LandingPage() {
  return (
    <main style={{
      minHeight: "100vh",
      backgroundColor: C.bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "40px 24px",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* 배경 그리드 */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(45,225,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(45,225,255,0.04) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />

      {/* 상단: 저자 한 줄만 */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={{
          fontSize: 11, color: C.muted,
          letterSpacing: "0.2em", margin: 0,
        }}>
          저자 김영한의 창조자 커뮤니티
        </p>
      </div>

      {/* 중앙 ORB */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
        {/* 외곽 글로우 링 */}
        <div style={{
          position: "absolute",
          width: 320, height: 320,
          borderRadius: "50%",
          border: `1px solid ${C.cyan}`,
          opacity: 0.15,
        }} />
        {/* 배경 글로우 */}
        <div style={{
          position: "absolute",
          width: 300, height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(45,225,255,0.13) 0%, transparent 70%)`,
        }} />
        {/* 메인 원 */}
        <div style={{
          width: 280, height: 280,
          borderRadius: "50%",
          border: `2px solid ${C.cyan}`,
          boxShadow: `0 0 60px rgba(45,225,255,0.45), 0 0 120px rgba(45,225,255,0.15), inset 0 0 60px rgba(0,0,0,0.85)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {/* HIP */}
          <h1 style={{
            fontSize: 90,
            fontWeight: 700,
            fontStyle: "italic",
            color: C.yellow,
            fontFamily: "Georgia, serif",
            lineHeight: 1,
            margin: 0,
            textShadow: `0 0 40px rgba(248,231,28,0.9)`,
          }}>
            HIP
          </h1>
          {/* VOID — 크고 꽉 차게 */}
          <p style={{
            fontSize: 48,
            fontWeight: 700,
            color: C.white,
            letterSpacing: "0.18em",
            marginTop: 2,
            lineHeight: 1,
            textShadow: `0 0 30px rgba(255,255,255,0.6)`,
          }}>
            VOID
          </p>
        </div>
      </div>

      {/* 메인 카피 — 한 번만 */}
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <p style={{ fontSize: 20, color: C.white, fontWeight: 300, letterSpacing: "0.04em", margin: "0 0 6px" }}>
          허무는 병이 아니다.
        </p>
        <p style={{ fontSize: 20, color: C.white, fontWeight: 300, letterSpacing: "0.04em", margin: 0 }}>
          창조의 시작이다.
        </p>
      </div>

      {/* 버튼 */}
      <div style={{ width: "100%", maxWidth: 360, zIndex: 1 }}>
        <Link href="/register" style={{
          display: "block",
          width: "100%",
          padding: "16px 0",
          backgroundColor: C.cyan,
          color: "#000",
          textAlign: "center",
          fontWeight: 700,
          fontSize: 16,
          letterSpacing: "0.05em",
          borderRadius: 2,
          textDecoration: "none",
          boxShadow: `0 0 20px rgba(45,225,255,0.4)`,
          marginBottom: 12,
        }}>
          창조자로 합류하기
        </Link>
        <Link href="/enter" style={{
          display: "block",
          width: "100%",
          padding: "16px 0",
          backgroundColor: "transparent",
          border: `1px solid ${C.yellow}`,
          color: C.yellow,
          textAlign: "center",
          fontWeight: 500,
          fontSize: 14,
          letterSpacing: "0.05em",
          borderRadius: 2,
          textDecoration: "none",
        }}>
          이미 초대받으셨나요?
        </Link>
      </div>
    </main>
  );
}
