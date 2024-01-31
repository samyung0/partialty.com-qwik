/** @jsxImportSource react */
import type { RenderElementProps } from "slate-react";
import { EmbedElement } from "~/components/ContentEditor/Embed";
import { ImageBlock } from "~/components/ContentEditor/Images";
import { LinkElement } from "~/components/ContentEditor/Link";
import { CodeBlock, CodeLine } from "~/components/ContentEditor/codeBlock";

export const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style = { textAlign: element.align || "left" } as const;
  switch (element.type) {
    case "paragraph":
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case "heading-three":
      return (
        <h3 style={style} {...attributes}>
          {children}
        </h3>
      );
    case "heading-four":
      return (
        <h4 style={style} {...attributes}>
          {children}
        </h4>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "list-item-text":
      return (
        <span style={style} {...attributes}>
          {children}
        </span>
      );
    case "numbered-list":
      return (
        <ol className="list-inside" style={style} {...attributes}>
          {children}
        </ol>
      );
    case "bulleted-list":
      return (
        <ul className="list-inside" style={style} {...attributes}>
          {children}
        </ul>
      );
    case "embed":
      return <EmbedElement attributes={attributes} element={element} children={children} />;
    case "link":
      return <LinkElement attributes={attributes} element={element} children={children} />;
    case "image":
      return <ImageBlock attributes={attributes} element={element} children={children} />;
    case "codeBlock":
      return <CodeBlock attributes={attributes} element={element} children={children} />;
    case "codeLine":
      return <CodeLine attributes={attributes} element={element} children={children} />;
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};
