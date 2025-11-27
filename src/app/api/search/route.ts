import { createClient } from "@/prismicio";
import { asText } from "@prismicio/helpers";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
        return Response.json([]);
    }

    try {
        const client = createClient();

        // Buscar todos os posts
        const articles = await client.getAllByType("post", {
            pageSize: 100, // Ajuste conforme necessário
        });

        // Filtrar localmente pelos termos de busca
        const searchTerm = query.toLowerCase().trim();
        const filtered = articles.filter((article) => {
            const title = asText(article.data.titulo)?.toLowerCase() || "";
            const description = asText(article.data.descricao)?.toLowerCase() || "";

            return title.includes(searchTerm) || description.includes(searchTerm);
        });

        // Limitar a 10 resultados
        const limited = filtered.slice(0, 10);

        // Mapear para o formato esperado
        const formatted = limited.map((article) => ({
            id: article.id,
            title: asText(article.data.titulo) || "",
            slug: article.uid || "",
            description: asText(article.data.descricao) || "",
        }));

        return Response.json(formatted);
    } catch (error) {
        console.error("Erro ao buscar artigos:", error);
        return Response.json([], { status: 500 });
    }
}
