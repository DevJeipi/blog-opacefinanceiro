import { createClient } from "@prismicio/client";
import { asText } from "@prismicio/helpers";
import * as prismic from "@prismicio/client";

const client = createClient(process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || "", {
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic");

  try {
    // Buscar artigos do Prismic onde o campo 'category' = topic
    const articles = await client.getByType("post", {
      filters: [prismic.filter.at("my.post.category", topic || "")],
      pageSize: 100,
    });

    // Mapear para o formato esperado
    const formatted = articles.results.map((article: any) => ({
      id: article.id,
      title: asText(article.data.titulo) || "",
      slug: article.uid,
    }));

    return Response.json(formatted);
  } catch (error) {
    console.error("Erro ao buscar artigos:", error);
    return Response.json([], { status: 500 });
  }
}
