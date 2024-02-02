/** @jsxImportSource react */
import { Info, Lightbulb, XCircle } from "lucide-react";
import type { RenderElementProps } from "slate-react";
import { EmbedElement } from "~/components/ContentEditor/Embed";
import { ImageBlock } from "~/components/ContentEditor/Images";
import { LinkElement } from "~/components/ContentEditor/Link";
import { CodeBlock, CodeLine } from "~/components/ContentEditor/codeBlock";
import { QuizBlock, QuizOption } from "~/components/ContentEditor/quiz";

export const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style = { textAlign: element.align || "left" } as const;
  switch (element.type) {
    case "paragraph":
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case "infoBlock":
      return (
        <blockquote
          style={{
            ...style,
            borderColor: "#72cada",
            backgroundColor: "#e3f4f8",
            fontStyle: "normal",
            paddingTop: "1em",
            paddingBottom: "1em",
            borderRadius: "6px",
          }}
          {...attributes}
        >
          <div style={{ paddingBottom: "1em" }}>
            <Lightbulb color={"#72cada"} size={24} />
          </div>
          {children}
        </blockquote>
      );
    case "cautionBlock":
      return (
        <blockquote
          style={{
            ...style,
            borderColor: "#fcd34d",
            backgroundColor: "#fef6db",
            fontStyle: "normal",
            paddingTop: "1em",
            paddingBottom: "1em",
            borderRadius: "6px",
          }}
          {...attributes}
        >
          <div style={{ paddingBottom: "1em" }}>
            <Info color={"#fcd34d"} size={24} />
          </div>
          {children}
        </blockquote>
      );
    case "warningBlock":
      return (
        <blockquote
          style={{
            ...style,
            borderColor: "#ff6347",
            backgroundColor: "#ffe0da",
            fontStyle: "normal",
            paddingTop: "1em",
            paddingBottom: "1em",
            borderRadius: "6px",
          }}
          {...attributes}
        >
          <div style={{ paddingBottom: "1em" }}>
            <XCircle color={"#ff6347"} size={24} />
          </div>
          {children}
        </blockquote>
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
    case "quizBlock":
      return <QuizBlock attributes={attributes} element={element} children={children} />;
    case "quizOption":
      return <QuizOption attributes={attributes} element={element} children={children} />;
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};
