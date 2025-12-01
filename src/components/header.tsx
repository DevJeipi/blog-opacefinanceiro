"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GridContainer } from "@/components/GridContainer";
import { ShimmerButton } from "@/components/ui/shimmer-button";

// Tipo para os dados do Prismic
// Ajuste conforme sua estrutura real
interface Article {
  id: string;
  title: string;
  slug: string;
  description?: string;
}

interface Topic {
  id: string;
  title: string;
  articles: Article[];
}

interface BlogHeaderProps {
  topics: Topic[];
}

export default function Header({ topics = [] }: BlogHeaderProps) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        isMenuOpen &&
        !target.closest(".mega-menu") &&
        !target.closest(".menu-button")
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Previne scroll quando menu mobile está aberto
  useEffect(() => {
    if (isMenuOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, isMobile]);

  // Fechar resultados ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchResults([]);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  // Buscar posts enquanto digita
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}`
        );
        const results = await response.json();
        setSearchResults(results);
      } catch (error) {
        console.error("Erro ao buscar:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // Debounce de 300ms

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      // Se houver resultados, ir para o primeiro
      if (searchResults.length > 0) {
        router.push(`/${searchResults[0].slug}`);
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    }
  };

  const handleResultClick = (slug: string) => {
    router.push(`/${slug}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <header className="sticky top-0 z-50 bg-primary border-b border-gray-600 shadow-sm">
      <GridContainer className="py-0">
        <div className="flex items-center justify-between h-16 md:h-20 relative">
          {/* Logo */}
          <div
            className={`shrink-0 transition-all duration-500 ${isSearchOpen
                ? "opacity-0 -translate-x-8"
                : "opacity-100 translate-x-0"
              }`}
          >
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-branco-opacefinanceiro.webp"
                alt="Blog O Pace Financeiro"
                width={160}
                height={40}
                priority
                className="w-32 h-8 md:w-40 md:h-10"
              />
            </Link>
          </div>

          {/* Botão Externo - Desktop */}
          {!isMobile && (
            <Link
              href="https://beacons.ai/opacefinanceiro"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex justify-center px-4 transition-all duration-500 ${isSearchOpen
                  ? "opacity-0 scale-95 pointer-events-none"
                  : "opacity-100 scale-100"
                }`}
            >
              <ShimmerButton
                background="var(--color-terciary)"
                className="shadow-2xl"
              >
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                  Acessar oportunidades
                </span>
              </ShimmerButton>
            </Link>
          )}

          {/* Ícones - Direita */}
          <div
            className={`flex items-center gap-2 md:gap-4 transition-all duration-500 ${isSearchOpen
                ? "opacity-0 translate-x-8"
                : "opacity-100 translate-x-0"
              }`}
          >
            {/* Botão Externo - Mobile */}
            {isMobile && (
              <a
                href="https://beacons.ai/opacefinanceiro"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-all hover:scale-110"
                title="Visite nosso site"
              >
                <ExternalLink className="w-5 h-5 text-primary-foreground" />
              </a>
            )}

            {/* Botão Pesquisa */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-all hover:scale-110"
              aria-label="Abrir pesquisa"
            >
              <Search className="w-5 cursor-pointer h-5 md:w-6 md:h-6 text-primary-foreground" />
            </button>

            {/* Botão Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="menu-button p-2 hover:bg-primary-foreground/10 rounded-lg transition-all hover:scale-110"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 cursor-pointer h-5 md:w-6 md:h-6 text-primary-foreground" />
            </button>
          </div>

          {/* Barra de Pesquisa Expandida */}
          <div
            ref={searchContainerRef}
            className={`absolute inset-0 flex items-center transition-all duration-500 ${isSearchOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-4 pointer-events-none"
              }`}
          >
            <div className="flex-1 flex flex-col relative">
              <div className="flex items-center gap-4">
                {isSearching ? (
                  <Loader2 className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground/60 animate-spin" />
                ) : (
                  <Search className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground/60" />
                )}
                <input
                  type="text"
                  placeholder="Pesquisar artigos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchResults.length > 0) {
                      handleResultClick(searchResults[0].slug);
                    } else if (e.key === "Enter") {
                      handleSearch(e);
                    }
                    if (e.key === "Escape") {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                      setSearchResults([]);
                    }
                  }}
                  autoFocus
                  className="flex-1 bg-transparent border-none outline-none text-base md:text-lg text-primary-foreground placeholder-primary-foreground/60"
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="p-2 cursor-pointer hover:bg-primary-foreground/10 rounded-lg transition-all hover:scale-110 hover:rotate-90"
                  aria-label="Fechar pesquisa"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                </button>
              </div>

              {/* Resultados da Busca */}
              {isSearchOpen && searchQuery.trim().length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-primary border border-primary-foreground/10 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-primary-foreground/60">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                      <p className="text-sm">Buscando...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(result.slug)}
                          className="w-full text-left px-4 py-3 hover:bg-primary-foreground/10 transition-colors duration-200 border-b border-primary-foreground/5 last:border-b-0 group"
                        >
                          <div className="flex items-start gap-3">
                            <Search className="w-4 h-4 text-primary-foreground/40 mt-1 group-hover:text-terciary transition-colors" />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm md:text-base font-medium text-primary-foreground group-hover:text-terciary transition-colors line-clamp-1">
                                {result.title}
                              </h3>
                              {result.description && (
                                <p className="text-xs md:text-sm text-primary-foreground/60 mt-1 line-clamp-2">
                                  {result.description}
                                </p>
                              )}
                            </div>
                            <ChevronRight className="w-4 h-4 text-primary-foreground/40 group-hover:text-terciary transition-colors shrink-0" />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-primary-foreground/60">
                      <p className="text-sm">Nenhum resultado encontrado</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </GridContainer>

      {/* Mega Menu Desktop */}
      <div
        className={`absolute left-0 right-0 top-full bg-primary border-t border-primary-foreground/10 shadow-lg overflow-hidden transition-all duration-500 ${isMenuOpen && !isMobile
            ? "max-h-[600px] opacity-100"
            : "max-h-0 opacity-0"
          }`}
      >
        <GridContainer
          className={`transition-all duration-500 delay-100 ${isMenuOpen && !isMobile
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
            }`}
        >
          <div className="grid grid-cols-3 gap-8">
            {topics.map((topic, topicIndex) => (
              <div
                key={topic.id}
                className={`space-y-4 transition-all duration-500 ${isMenuOpen && !isMobile
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                  }`}
                style={{
                  transitionDelay: isMenuOpen
                    ? `${150 + topicIndex * 100}ms`
                    : "0ms",
                }}
              >
                <h3 className="text-lg font-bold text-primary-foreground border-b border-gray-200 pb-2">
                  {topic.title}
                </h3>
                <ul className="space-y-2">
                  {topic.articles.map((article, articleIndex) => (
                    <li
                      key={article.id}
                      className={`transition-all duration-300 ${isMenuOpen && !isMobile
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-4 opacity-0"
                        }`}
                      style={{
                        transitionDelay: isMenuOpen
                          ? `${200 + topicIndex * 100 + articleIndex * 50}ms`
                          : "0ms",
                      }}
                    >
                      <a
                        href={`/${article.slug}`}
                        className="group flex items-center gap-2 text-primary-foreground hover:text-terciary transition-all py-1 duration-500 hover:translate-x-2"
                      >
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -ml-6 group-hover:ml-0" />
                        <span className="text-sm">{article.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </GridContainer>
      </div>

      {/* Menu Mobile - Sidebar */}
      {isMobile && (
        <>
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black z-40 transition-opacity duration-500 ${isMenuOpen ? "opacity-50" : "opacity-0 pointer-events-none"
              }`}
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Sidebar */}
          <div
            className={`mega-menu fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-primary shadow-2xl z-50 overflow-y-auto transition-transform duration-500 ease-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"
              }`}
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-primary z-10">
              <h2
                className={`text-xl font-bold text-primary-foreground transition-all duration-500 ${isMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-8 opacity-0"
                  }`}
                style={{ transitionDelay: isMenuOpen ? "200ms" : "0ms" }}
              >
                Menu
              </h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-all hover:scale-110 hover:rotate-90"
                aria-label="Fechar menu"
              >
                <X className="w-6 h-6 text-primary-foreground/60" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {topics.map((topic, topicIndex) => (
                <div
                  key={topic.id}
                  className={`space-y-3 transition-all duration-500 ${isMenuOpen
                      ? "translate-x-0 opacity-100"
                      : "translate-x-8 opacity-0"
                    }`}
                  style={{
                    transitionDelay: isMenuOpen
                      ? `${250 + topicIndex * 100}ms`
                      : "0ms",
                  }}
                >
                  <h3 className="text-base font-bold text-primary-foreground border-b border-gray-200 pb-2">
                    {topic.title}
                  </h3>
                  <ul className="space-y-2 pl-2">
                    {topic.articles.map((article, articleIndex) => (
                      <li
                        key={article.id}
                        className={`transition-all duration-300 ${isMenuOpen
                            ? "translate-x-0 opacity-100"
                            : "translate-x-8 opacity-0"
                          }`}
                        style={{
                          transitionDelay: isMenuOpen
                            ? `${300 + topicIndex * 100 + articleIndex * 50}ms`
                            : "0ms",
                        }}
                      >
                        <a
                          href={`/${article.slug}`}
                          className="block text-sm text-primary-foreground hover:text-terciary hover:bg-primary-foreground/10 py-2 px-2 rounded transition-all hover:translate-x-2 hover:shadow-sm"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {article.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
