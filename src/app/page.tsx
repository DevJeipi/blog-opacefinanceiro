import { Metadata } from "next";
import { createClient } from "@/prismicio";
import Hero from "@/components/hero";
import { PostsSection } from "@/components/posts-section";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Blog | Otávio Daudt",
  description: "Artigos sobre o mercado financeiro.",
};

export default async function HomePage() {
  // 1. Conecta ao Prismic
  const client = createClient();

  // 2. Busca todos os documentos do tipo 'post'
  const posts = await client.getAllByType("post", {
    orderings: [
      { field: "document.first_publication_date", direction: "desc" },
    ],
  });

  // 3. Mapear posts para o formato esperado
  const postsData = posts.map((post) => ({
    id: post.id,
    uid: post.uid,
    data: {
      titulo: post.data.titulo,
      descricao: post.data.descricao,
      category: post.data.category,
      data_da_publicacao: post.data.data_da_publicacao,
    },
  }));

  return (
    <main className="min-h-screen bg-primary flex flex-col">
      <Hero />
      <PostsSection posts={postsData} />
      <Footer />
    </main>
  );
}
