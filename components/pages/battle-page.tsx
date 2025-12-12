"use client"

import { useState } from "react"
import { useGame } from "@/components/game-state"
import { RPGWindow, RPGButton, RPGBar } from "@/components/rpg-window"

interface Enemy {
  name: string
  hp: number
  maxHp: number
  attack: number
  defense: number
}

const ENEMIES: Enemy[] = [
  { name: "スライム", hp: 15, maxHp: 15, attack: 3, defense: 1 },
  { name: "オーク", hp: 25, maxHp: 25, attack: 5, defense: 2 },
  { name: "ドラゴン", hp: 50, maxHp: 50, attack: 8, defense: 4 },
]

export function BattlePage() {
  const { gameState, setPage, setMessage, gainExp, takeDamage } = useGame()
  const [enemy, setEnemy] = useState<Enemy>(ENEMIES[0])
  const [battleLog, setBattleLog] = useState<string[]>([`${enemy.name}が あらわれた！`])
  const [battleActive, setBattleActive] = useState(true)

  const handleAttack = () => {
    const damage = Math.floor(Math.random() * 12) + 5
    const newHp = Math.max(0, enemy.hp - damage)

    setBattleLog((prev) => [...prev, `ゆうしゃの こうげき！ ${damage} の ダメージ！`])

    // 倒した場合
    if (newHp <= 0) {
      const exp = Math.floor(enemy.maxHp * 1.5)
      gainExp(exp)

      setBattleLog((prev) => [
        ...prev,
        `${enemy.name}を たおした！`,
        `${exp} のけいけんち を えた！`
      ])

      setMessage(`${enemy.name}を たおし ${exp} のけいけんち を えた！`)
      setBattleActive(false)
      return
    }

    // まだ敵が生きてる
    setEnemy((prev) => ({ ...prev, hp: newHp }))

    // ▼ 安全な反撃処理
    setTimeout(() => {
      const enemyDamage = Math.floor(Math.random() * 8) + 2

      // takeDamage を先に呼ぶ
      takeDamage(enemyDamage)

      const afterHp = gameState.character.hp - enemyDamage

      setBattleLog((prev) => [
        ...prev,
        `${enemy.name} の こうげき！ ${enemyDamage} の ダメージ！`,
      ])

      // HPが0以下になったらゲームオーバー
      if (afterHp <= 0) {
        setMessage("ゆうしゃは ちからつきた…")
        setBattleActive(false)
      }
    }, 500)
  }

  const handleFlee = () => {
    setBattleLog((prev) => [...prev, "ゆうしゃは にげだした！"])
    setMessage("たたかいから にげだした。")
    setBattleActive(false)

    setTimeout(() => setPage("home"), 1500)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4 bg-[#1a1b29] min-h-screen text-cyan-100">

      {/* Enemy display */}
      <div className="text-center mt-4 enemy-appear">
        <p
          className="text-xl text-cyan-300"
          style={{
            fontFamily: '"Courier New", monospace',
            letterSpacing: "0.08em",
            fontWeight: "bold",
          }}
        >
          ■ {enemy.name} ■
        </p>
      </div>

      {/* Battle Status */}
      <div className="grid grid-cols-2 gap-4">
        <RPGWindow title="ゆうしゃ">
          <RPGBar label="ＨＰ" current={gameState.character.hp} max={gameState.character.maxHp} color="cyan" />
        </RPGWindow>
        <RPGWindow title={enemy.name}>
          <RPGBar label="ＨＰ" current={enemy.hp} max={enemy.maxHp} color="pink" />
        </RPGWindow>
      </div>

      {/* Battle Log */}
      <RPGWindow title="たたかいのきろく">
        <div className="h-40 overflow-y-auto space-y-1 px-1">
          {battleLog.map((log, i) => (
            <p
              key={i}
              className="text-xs text-cyan-400"
              style={{
                fontFamily: '"Courier New", monospace',
                letterSpacing: "0.05em",
                fontWeight: "bold",
              }}
            >
              ▶ {log}
            </p>
          ))}
        </div>
      </RPGWindow>

      {/* Commands */}
      {battleActive ? (
        <RPGWindow title="コマンド">
          <div className="space-y-2">
            <RPGButton onClick={handleAttack} className="w-full text-left rpg-menu-item">
              ▶ こうげき
            </RPGButton>

            <RPGButton onClick={handleFlee} className="w-full text-left rpg-menu-item">
              ▶ にげる
            </RPGButton>
          </div>
        </RPGWindow>
      ) : (
        <RPGButton
          onClick={() => setPage("home")}
          className="w-full mt-4 rpg-menu-item"
        >
          ▶ ホームに もどる
        </RPGButton>
      )}

      <style jsx>{`
        .enemy-appear {
          animation: fadeIn 1.2s ease-out;
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-5px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .rpg-menu-item:hover {
          filter: brightness(1.3);
          transform: translateX(6px);
          transition: 0.15s;
        }
      `}</style>
    </div>
  )
}
