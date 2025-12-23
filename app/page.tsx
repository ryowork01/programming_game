"use client";

import { useRouter } from "next/navigation";
import { RPGWindow, RPGButton } from "@/components/rpg-window";
import { supabase } from "@/lib/supabaseClient";

export default function TitlePage() {
  const router = useRouter();

  const startAsGuest = async () => {
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      console.error(error);
      return;
    }

    console.log("ゲストでログイン:", data);
    router.push("/home");
  };

  return (
    // ===== 背景 =====
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url(/backgrounds/title.jpg)",
      }}
    >
      {/* ===== 暗めオーバーレイ ===== */}
      <div className="bg-black/70 min-h-screen w-full flex items-center justify-center">
        <div className="max-w-sm w-full p-4">
          {/* タイトルウィンドウ */}
          <RPGWindow className="mb-6">
            <div
              style={{
                fontFamily: '"Courier New", monospace',
                letterSpacing: "0.12em",
                fontWeight: "bold",
              }}
              className="text-center text-yellow-300 text-2xl mb-1"
            >
              ⚔️ CODE QUESTIA ⚔️
            </div>

            <div className="text-center text-cyan-100 text-xs">
              ～ 初めてのエンジニア学習クエスト ～
            </div>
          </RPGWindow>

          {/* メニュー */}
          <RPGWindow>
            <div className="space-y-3">
              <RPGButton
                className="rpg-menu-item"
                onClick={() => router.push("/auth/signup")}
              >
                🎉 はじめから（新規登録）
              </RPGButton>

              <RPGButton
                className="rpg-menu-item"
                onClick={() => router.push("/auth/login")}
              >
                🔐 つづきから（ログイン）
              </RPGButton>

              {/* ゲストログイン（必要になったら復活）
              <RPGButton className="rpg-menu-item" onClick={startAsGuest}>
                👤 ゲストとして冒険を始める
              </RPGButton>
              */}
            </div>
          </RPGWindow>
        </div>
      </div>
    </div>
  );
}

