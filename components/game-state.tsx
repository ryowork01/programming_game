"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export interface Character {
  id: string
  name: string
  level: number
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  exp: number
  nextLevelExp: number
  gold: number
  skills: Skill[]
  items?: { id: string; quantity: number }[]
}

export interface Skill {
  id: string
  name: string
  description: string
  mpCost: number
}

export interface GameState {
  character: Character
  currentPage: "home" | "learn" | "battle" | "status" | "skillboard" | "shop"
  message: string
  isAnimating: boolean
}

interface GameContextType {
  gameState: GameState
  setCharacter: (character: Character) => void
  setPage: (page: GameState["currentPage"]) => void
  setMessage: (message: string) => void
  gainExp: (amount: number) => void
  learnSkill: (skill: Skill) => void
  takeDamage: (amount: number) => void
  heal: (amount: number) => void
  gainGold: (amount: number) => Promise<void>
  addItem: (itemId: string) => void
  loadPlayerData: () => Promise<void>
  
  
}

const GameContext = createContext<GameContextType | undefined>(undefined)

const defaultCharacter: Character = {
  id: "",
  name: "勇者",
  level: 1,
  hp: 30,
  maxHp: 30,
  mp: 10,
  maxMp: 10,
  exp: 0,
  nextLevelExp: 100,
  gold: 0,
  skills: [{ id: "slash", name: "なぎはらい", description: "通常攻撃", mpCost: 0 }],
  items: [],
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    character: defaultCharacter,
    currentPage: "home",
    message: "ようこそ、勇者よ！",
    isAnimating: false,
  })

  /** 🎯 Supabase から最新のプレイヤー情報を取得 */
  const loadPlayerData = useCallback(async () => {
    const { data: auth } = await supabase.auth.getUser()
    if (!auth?.user) return

    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("user_id", auth.user.id)  //修正箇所はここ
      .single()

    if (!error && data) {
      setGameState((prev) => ({
        ...prev,
        character: { ...prev.character, ...data },
      }))
    }
  }, [])

  /** 🏁 初回ロード時に自動で Supabase と同期 */
  useEffect(() => {
    loadPlayerData()
  }, [loadPlayerData])

  const setCharacter = useCallback((character: Character) => {
    setGameState((prev) => ({ ...prev, character }))
  }, [])

  const setPage = useCallback((page: GameState["currentPage"]) => {
    setGameState((prev) => ({ ...prev, currentPage: page }))
  }, [])

  const setMessage = useCallback((message: string) => {
    setGameState((prev) => ({ ...prev, message }))
  }, [])

  const gainExp = useCallback((amount: number) => {
    setGameState((prev) => {
      const newExp = prev.character.exp + amount
      if (newExp >= prev.character.nextLevelExp) {
        return {
          ...prev,
          character: {
            ...prev.character,
            level: prev.character.level + 1,
            exp: 0,
            nextLevelExp: Math.floor(prev.character.nextLevelExp * 1.5),
          },
        }
      }
      return { ...prev, character: { ...prev.character, exp: newExp } }
    })
  }, [])

  const learnSkill = useCallback((skill: Skill) => {
    setGameState((prev) => {
      if (prev.character.skills.some((s) => s.id === skill.id)) return prev
      return {
        ...prev,
        character: {
          ...prev.character,
          skills: [...prev.character.skills, skill],
        },
      }
    })
  }, [])

  const takeDamage = useCallback((amount: number) => {
    setGameState((prev) => ({
      ...prev,
      character: { ...prev.character, hp: Math.max(0, prev.character.hp - amount) },
    }))
  }, [])

  const heal = useCallback((amount: number) => {
    setGameState((prev) => ({
      ...prev,
      character: {
        ...prev.character,
        hp: Math.min(prev.character.maxHp, prev.character.hp + amount),
      },
    }))
  }, [])


  /** 💰 ゴールド獲得（Supabase 永続化） */
  const gainGold = useCallback(async (amount: number) => {
    const { data: auth } = await supabase.auth.getUser()
    if (!auth?.user) return

    const newGold = gameState.character.gold + amount

    const { error } = await supabase
      .from("players")
      .update({ gold: newGold })
      .eq("user_id", auth.user.id)

    if (error) {
      console.error("💰 Gold update failed:", error)
      return
    }

    // UI反映
    setGameState(prev => ({
      ...prev,
      character: { ...prev.character, gold: newGold }
    }))

    // ★ Supabaseから再取得（完全同期）
    await loadPlayerData()
  }, [gameState.character.gold, loadPlayerData])




  /** 🎒 アイテム所持追加 */
  const addItem = useCallback((itemId: string) => {
    setGameState((prev) => {
      const exists = prev.character.items?.find((x) => x.id === itemId)
      if (exists) {
        return {
          ...prev,
          character: {
            ...prev.character,
            items: prev.character.items!.map((it) =>
              it.id === itemId ? { ...it, quantity: it.quantity + 1 } : it
            ),
          },
        }
      }
      return {
        ...prev,
        character: {
          ...prev.character,
          items: [...(prev.character.items ?? []), { id: itemId, quantity: 1 }],
        },
      }
    })
  }, [])

  return (
    <GameContext.Provider
      value={{
        gameState,
        setCharacter,
        setPage,
        setMessage,
        gainExp,
        learnSkill,
        takeDamage,
        heal,
        gainGold,
        addItem,
        loadPlayerData,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) throw new Error("useGame must be used within GameProvider")
  return context
}
