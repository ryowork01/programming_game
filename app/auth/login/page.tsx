'use client'

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { RPGWindow, RPGButton } from "@/components/rpg-window"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const router = useRouter()

  // =====================
  // 初期ロード時の処理
  // =====================
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        router.push("/home")
        return
      }
      setInitialLoading(false)
    }

    checkSession()
  }, [router])

  // =====================
  // ログイン処理
  // =====================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      setTimeout(() => {
        router.push("/home")
        router.refresh()
      }, 1000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        読み込み中…
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/backgrounds/login.jpg')",
      }}
    >
      {/* 暗幕オーバーレイ */}
      <div className="absolute inset-0 bg-black/60" />

      {/* コンテンツ */}
      <div className="relative z-10 w-full max-w-md px-4">
        <RPGWindow>
          <h1 className="text-2xl text-center text-yellow-300 mb-4 font-bold tracking-widest">
            🔐 ログイン
          </h1>

          {error && (
            <div className="bg-red-900/70 border border-red-500 text-red-200 px-3 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-cyan-200">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-black/60 border border-cyan-400 text-white"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-cyan-200">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-black/60 border border-cyan-400 text-white"
              />
            </div>

            <RPGButton
              type="submit"
              disabled={loading}
              className="w-full rpg-menu-item"
            >
              {loading ? "ログイン中…" : "▶ ログイン"}
            </RPGButton>

            <RPGButton
              type="button"
              onClick={() => router.push("/")}
              className="w-full rpg-menu-item"
            >
              ▶ タイトルへ戻る
            </RPGButton>
          </form>

          <p className="mt-4 text-center text-sm text-cyan-200">
            アカウントをお持ちでない方は
            <Link
              href="/auth/signup"
              className="text-yellow-300 hover:underline ml-1"
            >
              新規登録
            </Link>
          </p>
        </RPGWindow>
      </div>
    </div>
  )
}
