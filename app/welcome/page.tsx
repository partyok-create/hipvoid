import Link from "next/link";

export default function WelcomePage() {
  return (
    <main style={{
      minHeight: "100vh",
      backgroundColor: "#000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 32px",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* 배경 글로우 */}
      <div style={{
        position: "absolute",
        width: 360, height: 360,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(45,225,255,0.07) 0%, transparent 70%)",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }} />

      {/* ── 원 (텍스트만, 버튼 없음) ── */}
      <div style={{
        position: "relative",
        width: 300, height: 300,
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.15)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "32px",
        marginBottom: 40,
      }}>
        {/* CREATOR REGISTERED 레이블 */}
        <p style={{
          fontSize: 9,
          letterSpacing: "0.35em",
          color: "#2DE1FF",
          marginBottom: 14,
          textTransform: "uppercase",
        }}>
          Creator Registered
        </p>

        {/* 메인 타이틀 */}
        <h2 style={{
          fontSize: 22,
          fontWeight: 300,
          color: "#F5F5F7",
          lineHeight: 1.4,
          marginBottom: 16,
        }}>
          창조자 번호가<br />발급되었습니다
        </h2>

        {/* 안내 텍스트 */}
        <p style={{
          fontSize: 12,
          color: "#9AA0B2",
          lineHeight: 1.7,
          textAlign: "center",
        }}>
          메일과 문자로<br />창조자 번호를 확인해 주세요.<br />
          <br />
          번호를 입력하고<br />커뮤니티에 입장하세요.
        </p>
      </div>

      {/* ── 버튼 영역 (원 밖, 컬러) ── */}
      <div style={{
        width: "100%",
        maxWidth: 300,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}>
        {/* 번호로 입장하기 — 시안 배경 */}
        <Link
          href="/enter"
          style={{
            display: "block",
            width: "100%",
            padding: "16px 0",
            backgroundColor: "#2DE1FF",
            color: "#000",
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: "0.05em",
            textAlign: "center",
            textDecoration: "none",
            borderRadius: 6,
          }}
        >
          번호로 입장하기 →
        </Link>

        {/* 처음으로 돌아가기 — 테두리 버튼 */}
        <Link
          href="/"
          style={{
            display: "block",
            width: "100%",
            padding: "14px 0",
            backgroundColor: "transparent",
            color: "#9AA0B2",
            fontSize: 13,
            letterSpacing: "0.04em",
            textAlign: "center",
            textDecoration: "none",
            borderRadius: 6,
            border: "1px solid #1E2230",
          }}
        >
          처음으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
