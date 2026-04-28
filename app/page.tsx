import Link from "next/link";

const C = {
  bg:      "#000000",
  cyan:    "#2DE1FF",
  yellow:  "#F8E71C",
  white:   "#F5F5F7",
  muted:   "#9AA0B2",
  border:  "#161922",
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

      {/* 상단 아이덴티티 */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={{
          fontSize: 10, letterSpacing: "0.35em", color: C.cyan,
          opacity: 0.75, textTransform: "uppercase", margin: 0,
        }}>
          HIP · VOID · 創造者 COMMUNITY
        </p>
        <p style={{ fontSize: 11, color: C.muted, marginTop: 4, letterSpacing: "0.2em" }}>
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
          position: "relative",
        }}>
          {/* HIP */}
          <h1 style={{
            fontSize: 88,
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
          {/* VOID */}
          <p style={{
            fontSize: 22,
            color: C.white,
            letterSpacing: "0.25em",
            marginTop: 4,
            textShadow: `0 0 20px rgba(255,255,255,0.5)`,
          }}>
            VOID
          </p>
          {/* 원 내부 카피 */}
          <div style={{ marginTop: 16, textAlign: "center", padding: "0 20px" }}>
            <p style={{ fontSize: 13, color: "#E6E8EE", lineHeight: 1.6, margin: 0 }}>
              허무는 병이 아니다.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              창조의 시작이다.
            </p>
          </div>
        </div>
      </div>

      {/* 메인 카피 */}
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

      {/* 콜로폰 */}
      <p style={{
        fontSize: 11, color: "#E6E8EE", letterSpacing: "0.18em",
        zIndex: 1, opacity: 0.85, margin: 0,
      }}>
        김영한 著 ·『힙 허무는 창조다』
      </p>
    </main>
  );
}
