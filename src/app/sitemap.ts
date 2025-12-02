
import { MetadataRoute } from 'next';
import { createClient } from '@/prismicio';

// Troque pela URL do seu site
const SITE_URL = 'https://blog.opacefinanceiro.com.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    try {
        const client = createClient();

        // 1. Buscar todos os artigos do Prismic
        const articles = await client.getAllByType('post', {
            // Garantir que apenas posts publicados sejam incluídos
            filters: [],
        });

        // 2. Mapear artigos para o sitemap, filtrando UIDs inválidos
        const articleEntries: MetadataRoute.Sitemap = articles
            .filter((post) => post.uid) // Garantir que só posts com UID válido sejam incluídos
            .map((post) => {
                // Usar data_da_publicacao se disponível, senão usar last_publication_date
                const lastModified = post.data.data_da_publicacao
                    ? new Date(post.data.data_da_publicacao)
                    : new Date(post.last_publication_date);

                return {
                    url: `${SITE_URL}/${post.uid}`,
                    lastModified,
                    changeFrequency: 'yearly' as const,
                    priority: 0.7, // Posts individuais têm prioridade menor que a home
                };
            });

        // 3. Adicionar páginas estáticas (como a Home)
        const staticEntries: MetadataRoute.Sitemap = [
            {
                url: SITE_URL,
                lastModified: new Date(),
                changeFrequency: 'monthly' as const,
                priority: 1.0,
            },
        ];

        // 4. Combinar tudo
        return [...staticEntries, ...articleEntries];
    } catch (error) {
        console.error('Erro ao gerar sitemap:', error);
        // Retornar pelo menos a página inicial em caso de erro
        return [
            {
                url: SITE_URL,
                lastModified: new Date(),
                changeFrequency: 'monthly' as const,
                priority: 1.0,
            },
        ];
    }
}