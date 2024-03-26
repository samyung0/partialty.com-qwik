/** @jsxImportSource react */
import { Info, Lightbulb, XCircle } from 'lucide-react';
import type { RenderElementProps } from 'slate-react';
import { EmbedElement } from '~/components/_ContentEditor/Embed';
import { ImageBlock } from '~/components/_ContentEditor/Images';
import { LinkElement } from '~/components/_ContentEditor/Link';
import { CodeBlock, CodeLine } from '~/components/_ContentEditor/codeBlock';
import { QuizBlock, QuizOption } from '~/components/_ContentEditor/quiz';
import { QuizCodeBlock, QuizCodeInput, QuizCodeParagraph } from '~/components/_ContentEditor/quizCode';

export const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style = {
    textAlign: element.align || 'left',
    backgroundColor: 'inherit',
    color: 'inherit',
  } as const;
  switch (element.type) {
    case 'paragraph':
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
    case 'line-break':
      return (
        <div {...attributes} contentEditable={false}>
          <hr />
          <div className="hidden">{children}</div>
        </div>
      );
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case 'infoBlock':
      return (
        <>
          {/* <style dangerouslySetInnerHTML={{ __html: `
          .dark .infoBlock, .dark .infoBlock > div:first-child {
            background-color: #2f3e52 !important;
            border-color: #141a23 !important;
            color: #f7f7f7 !important;
          }
        `}}>
        </style> */}
          <blockquote
            style={{
              ...style,
              // borderColor: "#72cada",
              // backgroundColor: "#e3f4f8",
              paddingTop: '1em',
              paddingBottom: '1em',
              borderRadius: '6px',
            }}
            className="infoBlock !border-blue-700 !bg-blue-50 dark:!border-blue-400 dark:!bg-blue-400/10"
            {...attributes}
          >
            <div style={{ paddingBottom: '1em' }} className="!text-blue-700 dark:!text-blue-400">
              <Lightbulb size={24} />
            </div>
            {children}
          </blockquote>
        </>
      );
    case 'cautionBlock':
      return (
        <blockquote
          style={{
            ...style,
            // borderColor: "#fcd34d",
            // backgroundColor: "#fef6db",
            paddingTop: '1em',
            paddingBottom: '1em',
            borderRadius: '6px',
          }}
          {...attributes}
          className="!border-yellow-800 !bg-yellow-50 dark:!border-yellow-500 dark:!bg-yellow-400/10"
        >
          <div style={{ paddingBottom: '1em' }} className="!text-yellow-800 dark:!text-yellow-500">
            <Info size={24} />
          </div>
          {children}
        </blockquote>
      );
    case 'warningBlock':
      return (
        <blockquote
          style={{
            ...style,
            // borderColor: "#ff6347",
            // backgroundColor: "#ffe0da",
            paddingTop: '1em',
            paddingBottom: '1em',
            borderRadius: '6px',
          }}
          {...attributes}
          className="!border-pink-700 !bg-pink-50 dark:!border-pink-400 dark:!bg-pink-400/10"
        >
          <div style={{ paddingBottom: '1em' }} className="!text-pink-700 dark:!text-pink-400">
            <XCircle size={24} />
          </div>
          {children}
        </blockquote>
      );
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case 'heading-three':
      return (
        <h3 style={style} {...attributes}>
          {children}
        </h3>
      );
    case 'heading-four':
      return (
        <h4 style={style} {...attributes}>
          {children}
        </h4>
      );
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case 'list-item-text':
      return (
        <span style={style} {...attributes}>
          {children}
        </span>
      );
    case 'numbered-list':
      return (
        <ol className="list-inside" style={style} {...attributes}>
          {children}
        </ol>
      );
    case 'bulleted-list':
      return (
        <ul className="list-inside" style={style} {...attributes}>
          {children}
        </ul>
      );
    case 'embed':
      return <EmbedElement attributes={attributes} element={element} children={children} />;
    case 'link':
      return <LinkElement attributes={attributes} element={element} children={children} />;
    case 'image':
      return <ImageBlock attributes={attributes} element={element} children={children} />;
    case 'codeBlock':
      return <CodeBlock attributes={attributes} element={element} children={children} />;
    case 'codeLine':
      return <CodeLine attributes={attributes} element={element} children={children} />;
    case 'quizBlock':
      return <QuizBlock attributes={attributes} element={element} children={children} />;
    case 'quizOption':
      return <QuizOption attributes={attributes} element={element} children={children} />;
    case 'quizCodeBlock':
      return <QuizCodeBlock attributes={attributes} element={element} children={children} />;
    case 'quizCodeInput':
      return <QuizCodeInput attributes={attributes} element={element} children={children} />;
    case 'quizCodeParagraph':
      return <QuizCodeParagraph attributes={attributes} element={element} children={children} />;
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};
