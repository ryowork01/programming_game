"use client";

import { useEffect, useState } from "react";
import { RPGWindow, RPGButton } from "@/components/rpg-window";
import { supabase } from "@/lib/supabaseClient";
import { useGame } from "@/components/game-state";
import { useRouter } from "next/navigation";

export default function ShopPage() {
	const { gameState, setMessage } = useGame();
	const router = useRouter();
	const [shopItems, setShopItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			const { data, error } = await supabase
				.from("shop_items")
				.select(`
          id,
          stock,
          items (
            id,
            name,
            description,
            price,
            heal_value,
            item_type
          )
        `);

			if (!error) setShopItems(data);
			setLoading(false);
		};

		load();
	}, []);

	async function buyItem(shopItemId: string, item: any) {
		const price = item.price;
		const char = gameState.character;

		if (char.gold < price) {
			setMessage("ゴールドがたりない！");
			return;
		}

		// ゴールド減少 + 所持アイテム追加（仮実装）
		setMessage(`${item.name} を てにいれた！`);

		// TODO: DBに保存（所持アイテム追加処理）
	}

	return (
		<div
			className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
			style={{ backgroundImage: "url('/backgrounds/home.jpg')" }}
		>
			<div className="max-w-md w-full">
				<RPGWindow title="🏪 道具屋">
					{loading && <p className="text-yellow-300">商品のじゅんびちゅう…</p>}

					{!loading && (
						<div className="space-y-3">
							{shopItems.map((row) => (
								<div
									key={row.id}
									className="p-2 bg-black/30 rounded border border-cyan-700"
								>
									<div className="font-bold text-cyan-300 text-lg">
										{row.items.name}
									</div>
									<div className="text-cyan-100 text-sm">{row.items.description}</div>
									<div className="text-yellow-300 text-sm">
										🪙 {row.items.price} G
									</div>

									<RPGButton
										className="mt-2 rpg-menu-item"
										onClick={() => buyItem(row.id, row.items)}
									>
										▶ かう
									</RPGButton>
								</div>
							))}
						</div>
					)}
				</RPGWindow>

				<RPGButton onClick={() => router.push("/home")} className="w-full mt-4">
					▶ もどる
				</RPGButton>
			</div>
		</div>
	);
}
