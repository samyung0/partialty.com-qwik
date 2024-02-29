/** @jsxImportSource react */

const Prose = ({ children, innerHTML }: { children: React.ReactNode; innerHTML?: string }) => {
  return innerHTML ? (
    // for preview
    <section
      // SHOULD add a background
      id="sectionProse"
      className="prose mx-auto w-full bg-background-light-gray py-12 text-lg
    prose-a:decoration-wavy prose-a:underline-offset-4
    prose-blockquote:pr-[1em]
    prose-strong:tracking-wider
    prose-code:text-[unset] prose-pre:bg-code-editor-one-dark-pro prose-pre:text-base
    prose-pre:font-bold
    prose-img:m-0
    dark:bg-primary-dark-gray dark:text-background-light-gray
    "
      dangerouslySetInnerHTML={{ __html: innerHTML }}
    ></section>
  ) : (
    <section
      // SHOULD add a background
      className="prose mx-auto h-[80vh] 
  max-h-[80vh] w-full max-w-[unset] overflow-auto bg-background-light-gray py-12 text-lg
  prose-a:decoration-wavy prose-a:underline-offset-4
  prose-blockquote:pr-[1em]
  prose-strong:tracking-wider
  prose-code:text-[unset] prose-pre:bg-code-editor-one-dark-pro prose-pre:text-base
  prose-pre:font-bold
  prose-img:m-0
  dark:bg-primary-dark-gray dark:text-background-light-gray
  "
    >
      {children}
    </section>
  );
};

export default Prose;
