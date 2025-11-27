import Link from "next/link";
import { Instagram, ExternalLink } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-primary border-t border-primary-foreground/10">
            <div className="max-w-container mx-auto w-full px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {/* Sobre */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-primary-foreground">
                            Blog O Pace Financeiro
                        </h3>
                        <p className="text-sm text-primary-foreground/70 leading-relaxed">
                            Conteúdo sobre investimentos, planejamento financeiro e economia
                            por Otávio Daudt.
                        </p>
                    </div>

                    {/* Links Rápidos */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-primary-foreground">
                            Links Rápidos
                        </h3>
                        <nav className="flex flex-col gap-2">
                            <Link
                                href="/"
                                className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200"
                            >
                                Início
                            </Link>
                            <a
                                href="https://opacefinanceiro.com.br"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200"
                            >
                                O Pace Financeiro
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </nav>
                    </div>

                    {/* Redes Sociais */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-primary-foreground">
                            Redes Sociais
                        </h3>
                        <div className="flex flex-col gap-2">
                            <a
                                href="https://www.instagram.com/opacefinanceiro"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200"
                            >
                                <Instagram className="w-4 h-4" />
                                @opacefinanceiro
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 md:mt-12 pt-8 border-t border-primary-foreground/10">
                    <p className="text-center text-sm text-primary-foreground/60">
                        © {currentYear} Blog O Pace Financeiro. Todos os direitos
                        reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}

