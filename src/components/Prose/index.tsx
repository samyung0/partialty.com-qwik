/** @jsxImportSource react */

const Prose = ({ children }: { children: React.ReactNode }) => (
  <div
    className="prose
  prose-a:no-underline
  prose-strong:tracking-wider
  prose-code:text-[unset]
  "
  >
    {children}
  </div>
);

export default Prose;
