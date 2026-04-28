"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EnterPage() {
  const [number, setNumber] = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim()) { setError("번호를 입력해 주세요."); return; }
    setLoading(true);
    setError("");

    // TODO: Firebase에서 창조자 번호 검증
    // 현재는 번호가 있으면 입장 처리 (추후 연동)
    setTimeout(() => {
      if (number.trim().length > 0) {
        router.push("/home");
      } else {
        setError("유효하지 않은 번호입니다.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      {/* 배경 글로우 */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 360, height: 360,
          background: "radial-gradient(circle, rgba(45,225,255,0.06) 0%, transparent 70%)",
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        <a href="/" className="block text-hv-muted text-sm mb-10 hover:text-white transition-colors">
          ← 돌아가기
        </a>

        <p className="text-[10px] tracking-[0.4em] text-hv-cyan mb-4 uppercase">
          Creator Access
        </p>
        <h2 className="text-[26px] font-light text-white mb-2">
          창조자 번호로<br />입장하세요
        </h2>
        <p className="text-[13px] text-hv-muted mb-10">
          메일 또는 문자로 받은 번호를 입력해 주세요.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] text-hv-muted tracking-widest mb-2 uppercase">
              Creator No.
            </label>
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="0001"
              maxLength={8}
              className="w-full bg-hv-surface border border-hv-border text-white text-center text-2xl tracking-[0.5em] py-4 rounded-sm outline-none focus:border-hv-cyan transition-colors placeholder-hv-border"
              style={{ fontFamily: "Georgia, serif" }}
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-xs mt-2 text-center">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-hv-cyan text-black font-bold text-[15px] tracking-wide rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "확인 중…" : "입장하기 →"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[12px] text-hv-muted">
            아직 번호가 없으신가요?{" "}
            <a href="/register" className="text-hv-cyan hover:underline">
              창조자 등록
            </a>
          </p>
        </div>
      </div>

      <p className="absolute bottom-8 text-[11px] text-[#E6E8EE] tracking-[0.18em] opacity-70">
        김영한 著 ·『힙 허무는 창조다』
      </p>
    </main>
  );
}
