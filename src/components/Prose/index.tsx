/** @jsxImportSource react */

const Prose = ({ children }: { children: React.ReactNode }) => (
  <div
    className="prose mx-auto h-[80vh] max-h-[80vh] w-full max-w-[unset] overflow-auto
  prose-a:no-underline
  prose-strong:tracking-wider
  prose-code:text-[unset]
  prose-pre:bg-code-editor-one-dark-pro prose-pre:text-base prose-pre:font-bold
  prose-img:m-0
  "
  >
    {children}
  </div>
);

export default Prose;
