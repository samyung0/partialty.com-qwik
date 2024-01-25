/** @jsxImportSource react */

const Prose = ({ children }: { children: React.ReactNode }) => (
  <div
    className="prose mx-auto w-[80vw] max-w-[unset]
  prose-a:no-underline
  prose-blockquote:border-lilac prose-blockquote:bg-light-lilac prose-blockquote:not-italic
  prose-strong:tracking-wider
  prose-code:text-[unset]
  prose-pre:bg-code-editor-one-dark-pro prose-pre:text-base
  prose-img:m-0
  "
  >
    {children}
  </div>
);

export default Prose;
