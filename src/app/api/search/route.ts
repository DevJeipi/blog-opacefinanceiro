import { createClient } from "@/prismicio";
import { asText } from "@prismicio/helpers";
import * as prismic from "@prismicio/client";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
        return Response.json([]);
    }

    try {
        const client = createClient();

        // Buscar posts que contenham o termo no título ou descrição
        // Usando OR para buscar em ambos os campos
        const articles = await client.getByType("post", {
            filters: [
                prismic.filter.or(
                    prismic.filter.fulltext("my.post.titulo", query),
                    prismic.filter.fulltext("my.post.descricao", query)
                ),
            ],
            pageSize: 10,
        });

        // Mapear para o formato esperado
        const formatted = articles.results.map((article: any) => ({
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

