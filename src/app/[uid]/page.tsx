// app/[uid]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SliceZone, PrismicRichText } from "@prismicio/react";
import { asText } from "@prismicio/helpers";
import { ChevronRight, Instagram } from "lucide-react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { GridContainer } from "@/components/GridContainer";
import { Footer } from "@/components/footer";
import { TOPICS } from "@/config/topics";

// 1. Defina o tipo dos parâmetros
type Params = {
  uid: string;
};

// --- Gerar Metadados (SEO) ---
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const client = createClient();

  if (!resolvedParams?.uid || typeof resolvedParams.uid !== "string") {
    console.error("generateMetadata: params.uid inválido:", resolvedParams);
    notFound();
  }

  try {
    const post = await client.getByUID("post", resolvedParams.uid);
    if (!post) {
      console.error("Post não encontrado para uid:", resolvedParams.uid);
      notFound();
    }

    return {
      title: `${asText(post.data.titulo) || "Post"} | Blog`,
      description: asText(post.data.descricao) || "Leia este post...",
      openGraph: {
        title: asText(post.data.titulo) || "",
        description: asText(post.data.descricao) || "",
      },
    };
  } catch (error) {
    console.error("Erro ao buscar post para metadata:", error);
    notFound();
  }
}

// --- Renderizar a Página ---
export default async function PostPage({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params;
  const client = createClient();

  if (!resolvedParams?.uid || typeof resolvedParams.uid !== "string") {
    console.error("PostPage: params.uid inválido:", resolvedParams);
    notFound();
  }

  try {
    const post = await client.getByUID("post", resolvedParams.uid);

    if (!post) {
      console.error("Post não encontrado para uid:", resolvedParams.uid);
      notFound();
    }

    // Formatar data de publicação (mês e ano)
    const dataPublicacao = post.data.data_da_publicacao
      ? new Date(post.data.data_da_publicacao).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      })
      : null;

    // Buscar informações da categoria
    const categoria = post.data.category
      ? TOPICS.find((topic) => topic.slug === post.data.category)
      : null;

    // Formatar título para o breadcrumb (limitar tamanho)
    const tituloBreadcrumb = asText(post.data.titulo) || "Post";
    const tituloBreadcrumbTruncado =
      tituloBreadcrumb.length > 50
        ? `${tituloBreadcrumb.substring(0, 50)}...`
        : tituloBreadcrumb;

    return (
      <>
        <article className="min-h-screen bg-primary">
          <GridContainer className="py-8 md:py-16">
            {/* Breadcrumb */}
            <nav className="mb-6 md:mb-8" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm md:text-base text-primary-foreground/70">
                <li>
                  <Link
                    href="/"
                    className="hover:text-primary-foreground transition-colors duration-200"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <ChevronRight className="w-4 h-4" />
                </li>
                <li className="text-primary-foreground truncate max-w-md">
                  {tituloBreadcrumbTruncado}
                </li>
              </ol>
            </nav>

            {/* Header do Post */}
            <header className="mb-12 md:mb-16 space-y-6">
              {/* Categoria */}
              {categoria && (
                <div className="inline-block">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs md:text-sm font-medium border border-primary-foreground/20 text-primary-foreground/90 bg-primary-foreground/5">
                    {categoria.title}
                  </span>
                </div>
              )}

              {/* Título */}
              <div className="space-y-4">
                <PrismicRichText
                  field={post.data.titulo}
                  components={{
                    heading1: ({ children }) => (
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight tracking-tight">
                        {children}
                      </h1>
                    ),
                    heading2: ({ children }) => (
                      <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground leading-tight">
                        {children}
                      </h2>
                    ),
                    heading3: ({ children }) => (
                      <h3 className="text-xl md:text-2xl font-semibold text-primary-foreground leading-tight">
                        {children}
                      </h3>
                    ),
                    paragraph: ({ children }) => (
                      <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight tracking-tight">
                        {children}
                      </p>
                    ),
                  }}
                />
              </div>

              {/* Data de Publicação e Instagram */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-primary-foreground/10">
                {dataPublicacao && (
                  <time
                    className="text-sm md:text-base text-primary-foreground/60 font-medium"
                    dateTime={post.data.data_da_publicacao || undefined}
                  >
                    Publicado em {dataPublicacao}
                  </time>
                )}

                {/* Instagram Link */}
                <a
                  href="https://www.instagram.com/opacefinanceiro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm md:text-base text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200 group"
                  aria-label="Siga-nos no Instagram"
                >
                  <Instagram className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span>@opacefinanceiro</span>
                </a>
              </div>
            </header>

            {/* Conteúdo do Post */}
            <div className="max-w-4xl mx-auto">
              <SliceZone slices={post.data.slices} components={components} />
            </div>
          </GridContainer>
        </article>
        <Footer />
      </>
    );
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    console.error("UID tentado:", resolvedParams.uid);
    notFound();
  }
}

// --- Gerar Rotas Estáticas ---
export async function generateStaticParams() {
  try {
    const client = createClient();
    const posts = await client.getAllByType("post");

    const params = posts
      .filter((p) => p.uid) // garante que só rotas com uid sejam criadas
      .map((post) => ({
        uid: String(post.uid),
      }));

    console.log("generateStaticParams: Gerando", params.length, "rotas");
    console.log("UIDs:", params.map((p) => p.uid));

    return params;
  } catch (error) {
    console.error("Erro ao gerar rotas estáticas:", error);
    return [];
  }
}

