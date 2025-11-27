import "./globals.css";
import BlogHeader from "@/components/header";
import { getTopicsWithArticles } from "@/lib/prismic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const topics = await getTopicsWithArticles();

  return (
    <html lang="pt-br">
      <body className={`antialiased bg-primary`}>
        <BlogHeader topics={topics} />
        {children}
      </body>
    </html>
  );
}
