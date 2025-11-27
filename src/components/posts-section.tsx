"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PrismicRichText } from "@prismicio/react";
import { asText } from "@prismicio/helpers";
import { ChevronDown } from "lucide-react";
import { TOPICS } from "@/config/topics";

interface Post {
    id: string;
    uid: string | null;
    data: {
        titulo: any;
        descricao: any;
        category: string | null;
        data_da_publicacao: string | null | undefined;
    };
}

interface PostsSectionProps {
    posts: Post[];
}

type SortOption = "recent" | "oldest" | "alphabetical";

export function PostsSection({ posts }: PostsSectionProps) {
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [sortBy, setSortBy] = useState<SortOption>("recent");
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Função de ordenação
    const sortPosts = (postsArray: Post[], sortType: SortOption): Post[] => {
        const sorted = [...postsArray];

        switch (sortType) {
            case "recent":
                return sorted.sort((a, b) => {
                    const dateA = a.data.data_da_publicacao
                        ? new Date(a.data.data_da_publicacao).getTime()
                        : 0;
                    const dateB = b.data.data_da_publicacao
                        ? new Date(b.data.data_da_publicacao).getTime()
                        : 0;
                    return dateB - dateA; // Mais recente primeiro
                });

            case "oldest":
                return sorted.sort((a, b) => {
                    const dateA = a.data.data_da_publicacao
                        ? new Date(a.data.data_da_publicacao).getTime()
                        : Number.MAX_SAFE_INTEGER; // Posts sem data vão para o final
                    const dateB = b.data.data_da_publicacao
                        ? new Date(b.data.data_da_publicacao).getTime()
                        : Number.MAX_SAFE_INTEGER;
                    return dateA - dateB; // Mais antigo primeiro
                });

            case "alphabetical":
                return sorted.sort((a, b) => {
                    const titleA = asText(a.data.titulo) || "";
                    const titleB = asText(b.data.titulo) || "";
                    return titleA.localeCompare(titleB, "pt-BR", { sensitivity: "base" });
                });

            default:
                return sorted;
        }
    };

    // Agrupar posts por categoria
    const postsByCategory = useMemo(() => {
        return posts.reduce((acc, post) => {
            const category = post.data.category || "sem-categoria";
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(post);
            return acc;
        }, {} as Record<string, Post[]>);
    }, [posts]);

    // Posts a exibir baseado na categoria ativa e ordenação
    const postsToShow = useMemo(() => {
        const filtered = activeCategory === "all"
            ? posts
            : postsByCategory[activeCategory] || [];
        return sortPosts(filtered, sortBy);
    }, [activeCategory, sortBy, posts, postsByCategory]);

    // Formatar data (mês e ano)
    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
        });
    };

    return (
        <section className="py-12 md:py-16 bg-primary">
            <div className="max-w-container mx-auto w-full px-4">
                {/* Navegação de Categorias e Filtro */}
                <div className="mb-8 md:mb-12 space-y-4">
                    {/* Layout Mobile: Coluna | Desktop: Linha */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Categorias */}
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 overflow-x-auto w-full md:flex-1">
                            <button
                                onClick={() => setActiveCategory("all")}
                                className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-200 whitespace-nowrap ${activeCategory === "all"
                                    ? "bg-terciary text-white shadow-lg scale-105"
                                    : "bg-primary-foreground/5 text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                                    }`}
                            >
                                Todos
                            </button>
                            {TOPICS.map((topic) => {
                                const postCount = postsByCategory[topic.slug]?.length || 0;
                                return (
                                    <button
                                        key={topic.id}
                                        onClick={() => setActiveCategory(topic.slug)}
                                        className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-200 whitespace-nowrap ${activeCategory === topic.slug
                                            ? "bg-terciary text-white shadow-lg scale-105"
                                            : "bg-primary-foreground/5 text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                                            }`}
                                    >
                                        {topic.title}
                                        {postCount > 0 && (
                                            <span className="ml-2 opacity-70">({postCount})</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Filtro de Ordenação */}
                        <div className="relative w-full md:w-auto">
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center justify-between md:justify-center gap-2 w-full md:w-auto px-4 py-2 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground/90 hover:bg-primary-foreground/10 transition-all duration-200 text-sm md:text-base font-medium"
                            >
                                <span>
                                    {sortBy === "recent" && "Mais recente"}
                                    {sortBy === "oldest" && "Mais antigo"}
                                    {sortBy === "alphabetical" && "Ordem alfabética"}
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {/* Dropdown */}
                            {isSortOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsSortOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-48 bg-primary border border-primary-foreground/10 rounded-lg shadow-xl z-20 overflow-hidden">
                                        <button
                                            onClick={() => {
                                                setSortBy("recent");
                                                setIsSortOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm hover:bg-primary-foreground/10 transition-colors duration-200 ${sortBy === "recent"
                                                ? "bg-terciary/20 text-terciary font-medium"
                                                : "text-primary-foreground/90"
                                                }`}
                                        >
                                            Mais recente
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortBy("oldest");
                                                setIsSortOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm hover:bg-primary-foreground/10 transition-colors duration-200 ${sortBy === "oldest"
                                                ? "bg-terciary/20 text-terciary font-medium"
                                                : "text-primary-foreground/90"
                                                }`}
                                        >
                                            Mais antigo
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSortBy("alphabetical");
                                                setIsSortOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm hover:bg-primary-foreground/10 transition-colors duration-200 ${sortBy === "alphabetical"
                                                ? "bg-terciary/20 text-terciary font-medium"
                                                : "text-primary-foreground/90"
                                                }`}
                                        >
                                            Ordem alfabética
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Grid de Posts */}
                {postsToShow.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {postsToShow.map((post) => {
                            const dataPublicacao = formatDate(post.data.data_da_publicacao);
                            const categoria = post.data.category
                                ? TOPICS.find((topic) => topic.slug === post.data.category)
                                : null;
                            const tituloTexto = asText(post.data.titulo) || "Sem título";

                            return (
                                <Link
                                    key={post.id}
                                    href={`/${post.uid || ""}`}
                                    className="group"
                                >
                                    <article className="h-full bg-primary-foreground/5 border border-primary-foreground/10 rounded-lg p-6 hover:border-terciary/50 hover:bg-primary-foreground/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                        {/* Categoria */}
                                        {categoria && (
                                            <div className="mb-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-primary-foreground/20 text-primary-foreground/80 bg-primary-foreground/5">
                                                    {categoria.title}
                                                </span>
                                            </div>
                                        )}

                                        {/* Título */}
                                        <h2 className="text-xl md:text-2xl font-bold text-primary-foreground mb-3 line-clamp-2 group-hover:text-terciary transition-colors duration-200 leading-tight">
                                            {tituloTexto}
                                        </h2>

                                        {/* Descrição */}
                                        <div className="text-primary-foreground/70 text-sm md:text-base mb-4 line-clamp-3">
                                            <PrismicRichText
                                                field={post.data.descricao}
                                                components={{
                                                    paragraph: ({ children }) => (
                                                        <p className="mb-2 last:mb-0">{children}</p>
                                                    ),
                                                }}
                                            />
                                        </div>

                                        {/* Data */}
                                        {dataPublicacao && (
                                            <div className="flex items-center gap-2 pt-4 border-t border-primary-foreground/10">
                                                <time className="text-xs md:text-sm text-primary-foreground/60 font-medium">
                                                    {dataPublicacao}
                                                </time>
                                            </div>
                                        )}
                                    </article>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-primary-foreground/60 text-lg">
                            Nenhum post encontrado nesta categoria.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

