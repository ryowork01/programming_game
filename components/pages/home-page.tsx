"use client"

import { useEffect, useState } from "react"
import { useGame } from "@/components/game-state"
import { RPGWindow, RPGBar } from "@/components/rpg-window"
import { RPGButton } from "@/components/rpg-window"
import { LearnPage } from "./learn-page"
import { BattlePage } from "./battle-page"
import { StatusPage } from "./status-page"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import SkillBoardPage from "@/components/pages/skillboard-page"


export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/"); // ← トップへ戻る
  };

  return <RPGButton className="w-full text-left rpg-menu-item" onClick={logout}>▶ ログアウト</RPGButton>;
}


export function HomePage() {
  const router = useRouter();
  const { gameState, setPage, setMessage } = useGame();

  // ★ 現在のログイン中ユーザー（匿名かどうか判別用）
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    load();
  }, []);

  const isGuest = user?.is_anonymous === true;

  // ページ切り替え
  if (gameState.currentPage === "learn") return <LearnPage />;
  if (gameState.currentPage === "battle") return <BattlePage />;
  if (gameState.currentPage === "status") return <StatusPage />;
  if (gameState.currentPage === "skillboard") return <SkillBoardPage />;

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4 bg-[#1b1d2b] min-h-screen text-cyan-100">

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl text-cyan-300 mb-2 retro-title">
          ＲＰＧがくしゅうアプリ
        </h1>
        <p className="text-cyan-400 text-xs">▼ しれんに たちむかおう ▼</p>
      </div>

      {/* Character Status */}
      <RPGWindow title={gameState.character.name} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <RPGBar label="ＨＰ" current={gameState.character.hp} max={gameState.character.maxHp} color="cyan" />
            <RPGBar label="ＭＰ" current={gameState.character.mp} max={gameState.character.maxMp} color="pink" />
          </div>

          <div className="text-sm text-cyan-300 space-y-2">
            <div>ＬＶ：{gameState.character.level}</div>
            <div>ＥＸＰ：{gameState.character.exp}/{gameState.character.nextLevelExp}</div>
            <div>スキル：{gameState.character.skills.length}</div>
          </div>
        </div>
      </RPGWindow>

      {/* Message */}
      <RPGWindow title="メッセージ">
        <p className="text-sm text-yellow-300 min-h-12 leading-relaxed">
          {gameState.message}
        </p>
      </RPGWindow>

      {/* Command */}
      <RPGWindow title="コマンド">
        <div className="space-y-2">
          <RPGButton
            onClick={() => {
              setPage("learn")
              setMessage("しつもんが あらわれた！")
            }}
            className="w-full text-left rpg-menu-item"
          >
            ▶ まなぶ
          </RPGButton>

          <RPGButton
            onClick={() => {
              setPage("battle")
              setMessage("モンスターが あらわれた！")
            }}
            className="w-full text-left rpg-menu-item"
          >
            ▶ たたかう
          </RPGButton>

          <RPGButton
            onClick={() => {
              setPage("status")
              setMessage("ステータスを ひらいた。")
            }}
            className="w-full text-left rpg-menu-item"
          >
            ▶ ステータス
          </RPGButton>

          <RPGButton
            onClick={() => {
              setPage("skillboard")
              setMessage("スキルボードを ひらいた。")
            }}
            className="w-full text-left rpg-menu-item"
          >
            ▶ スキルボードへ
          </RPGButton>

          {/* 🔥 ゲストユーザーだけ本登録を表示 */}
          {isGuest && (
            <RPGButton
              className="w-full text-left rpg-menu-item "
              onClick={() => router.push("/upgrade")}
            >
              ▶ 本登録する（データを引き継ぎ）
            </RPGButton>
          )}

          {/* ログアウト */}
          <LogoutButton />
        </div>
      </RPGWindow>

      <style jsx>{`
        .retro-title {
          animation: flicker 1.8s infinite alternate;
        }

        @keyframes flicker {
          0% { opacity: 0.95; }
          100% { opacity: 1; }
        }

        .rpg-menu-item:hover {
          filter: brightness(1.3);
          transform: translateX(4px);
          transition: 0.1s;
        }
      `}</style>
    </div>
  )
}
