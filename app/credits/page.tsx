// ライセンス表記ページ
export default function CreditsPage() {
	return (
		<main className="p-6 max-w-3xl mx-auto">
			<h2 className="text-2xl font-bold mb-4">クレジット / ライセンス表記</h2>

			<section className="mb-6">
				<h3 className="text-xl font-semibold mb-2">利用素材</h3>
				<ul className="list-disc ml-6 space-y-1">
					<li>背景画像：◯◯（サイト名）</li>
					<li>敵キャラクター：△△（サイト名）</li>
					<li>UI素材：□□（サイト名）</li>
					<li>BGM / SE：××（サイト名）</li>
				</ul>
			</section>

			<section>
				<h3 className="text-xl font-semibold mb-2">注意事項</h3>
				<p>本アプリは素材提供者とは一切関係ありません。</p>
			</section>
		</main>
	);
}
