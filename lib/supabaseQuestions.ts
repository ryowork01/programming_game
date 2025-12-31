import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getRandomQuestion() {
	const { data, error } = await supabase.rpc("get_random_question");

	if (error) {
		console.error("Error fetching random question:", error.message || error);
		return null;
	}

	return data?.[0] || null;
}
