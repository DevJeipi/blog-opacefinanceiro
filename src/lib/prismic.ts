import { TOPICS } from "@/config/topics";
import { createClient } from "@/prismicio";
import { asText } from "@prismicio/helpers";
import * as prismic from "@prismicio/client";

export async function getTopicsWithArticles() {
  const client = createClient();

  const topics = await Promise.all(
    TOPICS.map(async (topic) => {
      try {
        // Buscar artigos do Prismic onde o campo 'category' = topic.slug
        const articles = await client.getByType("post", {
          filters: [prismic.filter.at("my.post.category", topic.slug)],
          pageSize: 100,
        });

        // Mapear para o formato esperado
        const formatted = articles.results.map((article) => ({
          id: article.id,
          title: asText(article.data.titulo) || "",
          slug: article.uid || "",
        }));

        return {
          id: topic.id,
          title: topic.title,
          articles: formatted,
        };
      } catch (error) {
        console.error(`Erro ao buscar artigos para o tópico ${topic.slug}:`, error);
        return {
          id: topic.id,
          title: topic.title,
          articles: [],
        };
      }
    })
  );

  return topics;
}
