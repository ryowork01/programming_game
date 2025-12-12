"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { RPGWindow, RPGButton } from "@/components/rpg-window";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const signup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setMsg(error ? "アカウント作成に失敗…" : "確認メールを送信しました！");
  };

  return (
    <div className="max-w-sm mx-auto mt-16">
      <RPGWindow title="アカウント作成">
        <div className="flex flex-col space-y-4 text-white">
          <input
            className="rpg-input"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="rpg-input"
            type="password"
            placeholder="パスワード（6文字以上）"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <RPGButton className="rpg-menu-item" onClick={signup}>アカウント作成</RPGButton>

          <RPGButton className="rpg-menu-item" onClick={() =>
            router.push("/")}>トップページに戻る</RPGButton>

          {msg && <p>{msg}</p>}
        </div>
      </RPGWindow>
    </div>
  );
}
