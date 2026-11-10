import axios from "axios";

export interface SearchResult {
    title: string;
    snippet: string;
}

export async function searchFashionWeb(query: string): Promise<SearchResult[]> {
    try {
        const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            timeout: 5000
        });

        const html = response.data as string;
        const results: SearchResult[] = [];


        const snippetMatches = html.matchAll(/<a class="result__snippet[^>]*>([\s\S]*?)<\/a>/g);
        const titleMatches = html.matchAll(/<a class="result__url[^>]*>([\s\S]*?)<\/a>/g);

        const titles = [...titleMatches].map(m => m[1].replace(/<[^>]+>/g, "").trim());
        const snippets = [...snippetMatches].map(m => m[1].replace(/<[^>]+>/g, "").trim());

        for (let i = 0; i < Math.min(titles.length, 3); i++) {
            results.push({
                title: titles[i] || "",
                snippet: snippets[i] || ""
            });
        }

        return results;
    } catch (err: any) {
        console.warn(`[Web Search] Search for "${query}" failed, fallback to visual description.`);
        return [];
    }
}