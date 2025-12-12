"use client"

import { useState } from "react"
import { useGame } from "@/components/game-state"
import { RPGWindow, RPGButton } from "@/components/rpg-window"

// ○×クイズ用の問題データ（例）
const QUESTIONS = [
  {
    id: "1",
    statement: "JavaScriptの let は block scope である。",
    correct: true,
    exp: 20,
    explanation: "let は {} のブロック内で有効なスコープを持ちます。",
  },
  {
    id: "2",
    statement: "React Hooks はクラスコンポーネント専用の機能である。",
    correct: false,
    exp: 25,
    explanation: "Hooks は関数コンポーネントで状態や副作用を扱うための仕組みです。",
  },
  {
    id: "3",
    statement: "tailwind CSS は utility-first の CSS フレームワークである。",
    correct: true,
    exp: 20,
    explanation: "Tailwind はユーティリティクラスを中心に構成されるフレームワークです。",
  },
]

export function LearnPage() {
  const { setPage, setMessage, gainExp, learnSkill } = useGame()

  // question index
  const [index, setIndex] = useState(0)
  const current = QUESTIONS[index]

  // 回答済みフラグと判定結果
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // 回答ハンドラ
  const handleAnswer = (userAnswer: boolean) => {
    if (answered) return // 二重回答防止

    const correct = userAnswer === current.correct
    setAnswered(true)
    setIsCorrect(correct)

    if (correct) {
      // 正解時の処理
      gainExp(current.exp)
      setMessage(`正解！${current.exp} の経験値を獲得した！`)
      
    } else {
      // 不正解時のフィードバック
      setMessage("不正解です。解説を確認して次に進みましょう。")
    }
  }

  // 次へボタンハンドラ（ユーザー操作で進む）
  const handleNext = () => {
    // 未回答で Next が押されたら何もしない
    if (!answered) return

    const next = index + 1
    if (next >= QUESTIONS.length) {
      // 全問終了
      setMessage("全ての問題が終了しました。お疲れさま！")
      setTimeout(() => setPage("home"), 800) // 少しだけ余韻を残す
      return
    }

    // 次の問題へ
    setIndex(next)
    setAnswered(false)
    setIsCorrect(null)
  }

  // ユーザーが途中で学習をやめる（ホームへ）
  const handleAbort = () => {
    setPage("home")
    setMessage("学習を中断しました。")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <RPGWindow title={`○×クイズ (${index + 1}/${QUESTIONS.length})`} className="mb-4">
        <p
          style={{ fontFamily: '"Courier New", monospace', letterSpacing: "0.03em", fontWeight: 700 }}
          className="text-sm text-cyan-400 mb-3"
        >
          問題に答えて経験値を獲得しよう。正誤はすぐに判定されます。
        </p>

        <div className="mb-4">
          <p
            style={{ fontFamily: '"Courier New", monospace', letterSpacing: "0.02em", fontWeight: 700 }}
            className="text-sm text-yellow-300 mb-2"
          >
            Q: {current.statement}
          </p>

          {/* 判定済みなら解説を先に表示（視認性向上） */}
          {answered && (
            <div className="mb-3">
              <div className={`p-3 rounded ${isCorrect ? "bg-green-900/50" : "bg-red-900/40"}`}>
                <div className="text-sm font-bold">
                  {isCorrect ? "正解！" : "不正解"}
                </div>
                <div className="text-xs mt-1 text-gray-200">{current.explanation}</div>
              </div>
            </div>
          )}

          {/* 回答ボタン群（回答済みなら disabled） */}
          <div className="grid grid-cols-2 gap-3">
            <RPGButton
              onClick={() => handleAnswer(true)}
              className="w-full rpg-menu-item"
              // @ts-ignore - className prop pass-through assumed
              disabled={answered}
            >
              ○ そうだ
            </RPGButton>

            <RPGButton
              onClick={() => handleAnswer(false)}
              className="w-full rpg-menu-item"
              // @ts-ignore
              disabled={answered}
            >
              ✗ ちがう
            </RPGButton>
          </div>
        </div>

        {/* 回答済みなら次へボタンを表示 */}
        <div className="flex gap-2">
          <RPGButton onClick={handleNext} className="flex-1 rpg-menu-item" disabled={!answered}>
            {index + 1 >= QUESTIONS.length ? "終了してホームへ" : "次の問題へ"}
          </RPGButton>

          <RPGButton onClick={handleAbort} className="flex-1 rpg-menu-item" disabled={false}>
            中断して戻る
          </RPGButton>
        </div>
      </RPGWindow>
    
    <style jsx>{`
    /* メニューのホバー効果 */
      .rpg-menu-item:hover {
        filter: brightness(1.3);
        transform: translateX(6px);
        transition: 0.15s;
      }
    `}</style>

    </div>
  )
}
