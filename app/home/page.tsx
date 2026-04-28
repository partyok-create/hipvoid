"use client";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-hv-border">
        <span className="text-[10px] tracking-[0.3em] text-hv-cyan opacity-70">HIP VOID</span>
        <span className="text-xs text-hv-muted">Creator No. —</span>
      </div>

      {/* 메인 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div
          className="w-20 h-20 rounded-full border border-hv-cyan mb-8 animate-orb"
          style={{ boxShadow: "0 0 30px rgba(45,225,255,0.3)" }}
        />
        <p className="text-[11px] tracking-[0.3em] text-hv-cyan mb-4 uppercase">
          오늘의 공명
        </p>
        <h2 className="text-[22px] font-light text-white leading-snug mb-6">
          오늘 당신을 멈춰 세운<br />문장은 무엇입니까?
        </h2>

        <button
          className="px-8 py-3 bg-hv-cyan text-black font-bold text-[14px] tracking-wide rounded-sm hover:opacity-90 transition-opacity"
          onClick={() => alert("문장 업로드 기능 — 준비 중입니다.")}
        >
          문장 남기기
        </button>
      </div>

      {/* 하단 네비 */}
      <div className="flex border-t border-hv-border">
        {["홈", "피드", "내 기록", "설정"].map((tab) => (
          <button
            key={tab}
            className="flex-1 py-4 text-[11px] text-hv-muted hover:text-white transition-colors tracking-widest"
          >
            {tab}
          </button>
        ))}
      </div>
    </main>
  );
}
