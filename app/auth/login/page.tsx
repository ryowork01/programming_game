"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { RPGWindow, RPGButton } from "@/components/rpg-window";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setMsg("ログイン失敗...");
    } else {
      setMsg("ログイン成功！");
      router.push("/home");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16">
      <RPGWindow title="ログイン">
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
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <RPGButton className="rpg-menu-item" onClick={login}>ログインする</RPGButton>

          <RPGButton className="rpg-menu-item" onClick={() => 
            router.push("/")}>トップページに戻る</RPGButton>

          {msg && <p>{msg}</p>}
        </div>
      </RPGWindow>
    </div>
  );
}
