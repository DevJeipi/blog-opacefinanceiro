import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";

/**
 * Props for `TextBlock`.
 */
export type TextBlockProps = SliceComponentProps<Content.TextBlockSlice>;

/**
 * Component for "TextBlock" Slices.
 */
const TextBlock: FC<TextBlockProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="text-primary-foreground"
    >
      <PrismicRichText
        field={slice.primary.content}
        components={{
          // Títulos
          heading1: ({ children }) => (
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground leading-tight mt-12 mb-6 first:mt-0">
              {children}
            </h1>
          ),
          heading2: ({ children }) => (
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground leading-tight mt-10 mb-5 first:mt-0">
              {children}
            </h2>
          ),
          heading3: ({ children }) => (
            <h3 className="text-xl md:text-2xl font-semibold text-primary-foreground leading-tight mt-8 mb-4 first:mt-0">
              {children}
            </h3>
          ),
          heading4: ({ children }) => (
            <h4 className="text-lg md:text-xl font-semibold text-primary-foreground leading-tight mt-6 mb-3 first:mt-0">
              {children}
            </h4>
          ),
          heading5: ({ children }) => (
            <h5 className="text-base md:text-lg font-semibold text-primary-foreground leading-tight mt-5 mb-2 first:mt-0">
              {children}
            </h5>
          ),
          heading6: ({ children }) => (
            <h6 className="text-sm md:text-base font-semibold text-primary-foreground leading-tight mt-4 mb-2 first:mt-0">
              {children}
            </h6>
          ),

          // Parágrafos
          paragraph: ({ children }) => (
            <p className="text-base md:text-lg text-primary-foreground/90 leading-relaxed mb-6">
              {children}
            </p>
          ),

          // Listas
          list: ({ children }) => (
            <ul className="list-disc list-outside ml-6 md:ml-8 mb-6 space-y-2 text-primary-foreground/90">
              {children}
            </ul>
          ),
          listItem: ({ children }) => (
            <li className="text-base md:text-lg leading-relaxed pl-2">
              {children}
            </li>
          ),
          oList: ({ children }) => (
            <ol className="list-decimal list-outside ml-6 md:ml-8 mb-6 space-y-2 text-primary-foreground/90">
              {children}
            </ol>
          ),
          oListItem: ({ children }) => (
            <li className="text-base md:text-lg leading-relaxed pl-2">
              {children}
            </li>
          ),

          // Links
          hyperlink: ({ node, children }) => {
            const url = node.data.url;
            return (
              <a
                href={url}
                target={node.data.target || undefined}
                rel={node.data.target === "_blank" ? "noopener noreferrer" : undefined}
                className="text-terciary hover:text-terciary-foreground underline underline-offset-4 transition-colors duration-200 font-medium"
              >
                {children}
              </a>
            );
          },

          // Ênfase
          strong: ({ children }) => (
            <strong className="font-bold text-primary-foreground">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-primary-foreground/95">
              {children}
            </em>
          ),

          // Código
          preformatted: ({ children }) => (
            <pre className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-lg p-4 md:p-6 mb-6 overflow-x-auto">
              <code className="text-sm md:text-base text-primary-foreground/90 font-mono">
                {children}
              </code>
            </pre>
          ),

          // Imagens
          image: ({ node }) => {
            const url = node.url;
            const alt = node.alt || "";
            return (
              <figure className="my-8 md:my-12">
                <img
                  src={url}
                  alt={alt}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                {node.copyright && (
                  <figcaption className="text-sm text-primary-foreground/60 mt-2 text-center">
                    {node.copyright}
                  </figcaption>
                )}
              </figure>
            );
          },
        }}
      />
    </section>
  );
};

export default TextBlock;
