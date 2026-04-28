import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-black flex flex-col items-center justify-between px-6 py-10 overflow-hidden">
      {/* 배경 그리드 */}
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      {/* 상단 아이덴티티 */}
      <div className="relative z-10 text-center pt-2">
        <p className="text-[10px] tracking-[0.35em] text-hv-cyan opacity-70 uppercase">
          HIP · VOID · 創造者 COMMUNITY
        </p>
        <p className="text-[11px] text-hv-muted mt-1 tracking-[0.2em]">
          저자 김영한의 창조자 커뮤니티
        </p>
      </div>

      {/* 중앙 ORB */}
      <div className="relative z-10 flex items-center justify-center my-6">
        {/* 외곽 글로우 링 */}
        <div
          className="absolute rounded-full border border-hv-cyan animate-orb"
          style={{ width: 320, height: 320, opacity: 0.15 }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 300,
            height: 300,
            background: "radial-gradient(circle, rgba(45,225,255,0.12) 0%, transparent 70%)",
          }}
        />
        {/* 메인 원 */}
        <div
          className="relative rounded-full border-2 border-hv-cyan flex flex-col items-center justify-center animate-glow-pulse"
          style={{ width: 280, height: 280 }}
        >
          {/* HIP */}
          <h1
            className="text-[90px] font-bold italic text-hv-yellow leading-none"
            style={{
              fontFamily: "Georgia, serif",
              textShadow: "0 0 40px rgba(248,231,28,0.85)",
            }}
          >
            HIP
          </h1>
          {/* VOID */}
          <p
            className="text-2xl text-white tracking-[0.25em] mt-1"
            style={{ textShadow: "0 0 20px rgba(255,255,255,0.5)" }}
          >
            VOID
          </p>
          {/* 원 내부 카피 */}
          <div className="mt-4 text-center px-6">
            <p className="text-[13px] text-[#E6E8EE] leading-relaxed">
              허무에 갇히셨습니까.
            </p>
            <p className="text-[13px] leading-relaxed">
              <span className="text-[#E6E8EE]">창조의 </span>
              <span className="text-hv-cyan" style={{ textShadow: "0 0 10px rgba(45,225,255,0.7)" }}>
                대열
              </span>
              <span className="text-[#E6E8EE]">에 합류하십시오.</span>
            </p>
          </div>
        </div>
      </div>

      {/* 메인 카피 */}
      <div className="relative z-10 text-center mb-4">
        <p className="text-[19px] text-white font-light tracking-wide">
          허무는 병이 아니다.
        </p>
        <p className="text-[19px] text-white font-light tracking-wide mt-1">
          창조의 시작이다.
        </p>
      </div>

      {/* 버튼 */}
      <div className="relative z-10 w-full max-w-sm space-y-3">
        <Link
          href="/register"
          className="block w-full py-4 bg-hv-cyan text-black text-center font-bold text-[16px] tracking-wide rounded-sm hover:opacity-90 transition-opacity"
        >
          창조자로 합류하기
        </Link>
        <Link
          href="/enter"
          className="block w-full py-4 border border-hv-yellow text-hv-yellow text-center font-medium text-[14px] tracking-wide rounded-sm hover:bg-hv-yellow hover:text-black transition-all"
        >
          이미 초대받으셨나요?
        </Link>
      </div>

      {/* 하단 콜로폰 */}
      <p className="relative z-10 text-[11px] text-[#E6E8EE] tracking-[0.18em] mt-4 opacity-80">
        김영한 著 ·『힙 허무는 창조다』
      </p>
    </main>
  );
}
