import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-8 text-center overflow-hidden">
      {/* 글로우 배경 */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(45,225,255,0.08) 0%, transparent 70%)",
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        }}
      />

      {/* 링 */}
      <div
        className="absolute rounded-full border border-hv-cyan animate-orb pointer-events-none"
        style={{ width: 280, height: 280, opacity: 0.3 }}
      />

      <div className="relative z-10">
        <p className="text-[10px] tracking-[0.4em] text-hv-cyan mb-8 uppercase">
          Creator Registered
        </p>

        <h2 className="text-[28px] font-light text-white leading-snug mb-3">
          창조자 번호가<br />발급되었습니다
        </h2>

        <p className="text-[14px] text-hv-muted leading-relaxed mb-2">
          메일과 문자로 고유 번호를<br />확인해 주세요.
        </p>
        <p className="text-[13px] text-hv-muted mb-12">
          번호를 입력하고 커뮤니티에 입장하세요.
        </p>

        <Link
          href="/enter"
          className="inline-block px-10 py-4 bg-hv-cyan text-black font-bold text-[15px] tracking-wide rounded-sm hover:opacity-90 transition-opacity"
        >
          번호로 입장하기 →
        </Link>

        <div className="mt-6">
          <Link href="/" className="text-[12px] text-hv-muted hover:text-white transition-colors">
            처음으로 돌아가기
          </Link>
        </div>
      </div>

      <p className="absolute bottom-8 text-[11px] text-[#E6E8EE] tracking-[0.18em] opacity-70">
        김영한 著 ·『힙 허무는 창조다』
      </p>
    </main>
  );
}
