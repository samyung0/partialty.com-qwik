/** @jsxImportSource react */

const Prose = ({ children, innerHTML }: { children: React.ReactNode; innerHTML?: string }) => {
  return innerHTML ? (
    <section
      // SHOULD add a background
      id="sectionProse"
      className="prose mx-auto w-full overflow-auto bg-background-light-gray py-12 text-lg
    prose-a:no-underline
    prose-blockquote:not-italic
    prose-strong:tracking-wider
    prose-code:text-[unset]
    prose-pre:bg-code-editor-one-dark-pro prose-pre:text-base prose-pre:font-bold
    prose-img:m-0
    "
      dangerouslySetInnerHTML={{ __html: innerHTML }}
    ></section>
  ) : (
    <section
      // SHOULD add a background
      className="prose mx-auto h-[80vh] 
  max-h-[80vh] w-full max-w-[unset] overflow-auto bg-background-light-gray text-lg
  prose-a:no-underline
  prose-strong:tracking-wider
  prose-code:text-[unset]
  prose-pre:bg-code-editor-one-dark-pro prose-pre:text-base prose-pre:font-bold
  prose-img:m-0
  "
    >
      {children}
    </section>
  );
};

export default Prose;
