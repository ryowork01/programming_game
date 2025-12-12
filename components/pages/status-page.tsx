"use client"

import { useGame } from "@/components/game-state"
import { RPGWindow, RPGButton, RPGBar } from "@/components/rpg-window"



export function StatusPage() {
  const { gameState, setPage, setMessage } = useGame()
  const { character } = gameState

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4 text-cyan-100">

      <RPGWindow title={`${character.name} の ステータス`} className="mb-4">
        <div className="space-y-4 dq-font">

          {/* LEVEL / EXP */}
          <div className="pb-3 border-b border-white/30">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-cyan-300">レベル</div>
                <div className="text-yellow-300 text-lg">{character.level}</div>
              </div>
              <div>
                <div className="text-cyan-300">けいけんち</div>
                <div className="text-yellow-300">
                  {character.exp}/{character.nextLevelExp}
                </div>
              </div>
            </div>
          </div>

          {/* HP/MP */}
          <div>
            <RPGBar label="ＨＰ" current={character.hp} max={character.maxHp} color="cyan" />
            <RPGBar label="ＭＰ" current={character.mp} max={character.maxMp} color="pink" />
          </div>

          {/* 基本ステータス */}
          <div className="pb-3 border-b border-white/30">
            <div className="text-sm text-cyan-300 mb-2">ステータス</div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-300">
                さいだいＨＰ: <span className="text-yellow-300">{character.maxHp}</span>
              </div>
              <div className="text-gray-300">
                さいだいＭＰ: <span className="text-yellow-300">{character.maxMp}</span>
              </div>
              <div className="text-gray-300">
                こうげき力: <span className="text-yellow-300">{character.level * 3}</span>
              </div>
              <div className="text-gray-300">
                ぼうぎょ力: <span className="text-yellow-300">{character.level}</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <div className="text-sm text-cyan-300 mb-2">おぼえた とくぎ</div>

            <div className="space-y-2">
              {character.skills.length === 0 && (
                <div className="text-gray-500 text-xs dq-font">まだ なにも おぼえていない…</div>
              )}

              {character.skills.map((skill) => (
                <div key={skill.id} className="dq-skill-box">
                  <div className="text-yellow-300">{skill.name}</div>
                  <div className="text-gray-400 text-xs mt-1">{skill.description}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </RPGWindow>

      <RPGButton
        onClick={() => {
          setPage("skillboard")
          setMessage("スキルボードを ひらいた。")
        }}
        className="dq-button rpg-menu-item"
      >
        ▶ スキルボードへ
      </RPGButton>

      <RPGButton
        onClick={() => {
          setPage("home")
          setMessage("ステータスを かくにんした。")
        }}
        className="dq-button rpg-menu-item"
      >
        ▶ もどる
      </RPGButton>
    </div>
  )
}
