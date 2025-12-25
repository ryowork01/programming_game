'use client'

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { RPGWindow, RPGButton } from "@/components/rpg-window"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // =====================
  // バリデーション
  // =====================
  const validate = () => {
    if (!email) {
      setError("メールアドレスを入力してください")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("メールアドレスの形式が正しくありません")
      return false
    }
    if (!password) {
      setError("パスワードを入力してください")
      return false
    }
    if (password.length < 8) {
      setError("パスワードは8文字以上にしてください")
      return false
    }
    return true
  }

  // =====================
  // サインアップ処理
  // =====================
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!validate()) {
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      setError("確認メールを送信しました")
    } catch (error: any) {
      console.error("サインアップエラー:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ 
        backgroundImage: "url(/backgrounds/login.jpg)" 
      }}
    >

      {/* 暗幕オーバーレイ */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-md px-4">
        <RPGWindow>
          <h1 className="text-2xl text-center text-yellow-300 mb-4 font-bold tracking-widest">
            新規登録
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1 text-sm text-cyan-200">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-black/60 border border-cyan-400 text-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-sm text-cyan-200">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-black/60 border border-cyan-400 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rpg-menu-item"
            >
              {loading ? "登録中..." : "アカウント作成"}
            </button>

            <RPGButton
              type="button"
              onClick={() => router.push("/")}
              className="w-full rpg-menu-item"
            >
              トップページに戻る
            </RPGButton>
          </form>
        </RPGWindow>
      </div>
    </div>
  )
}


