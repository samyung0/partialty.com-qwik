import { parse } from "@babel/parser";
import { component$, useComputed$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { JS, _JS } from "~/utils/instructions/instructions-v1";

export const removeASTLocation = (ast: any) => {
  if (Array.isArray(ast)) {
    ast.forEach((a) => removeASTLocation(a));
  } else if (typeof ast === "object" && ast !== null) {
    delete ast["loc"];
    delete ast["start"];
    delete ast["end"];
    const values = Object.values(ast).filter((v) => Array.isArray(v) || typeof v === "object");
    removeASTLocation(values);
  }
};

export default component$(() => {
  const code = useSignal("const x = 10;");
  const removeLocation = useSignal(true);
  // const a = JS("VariableDeclaration", {
  //   declarations: [
  //     JS("VariableDeclarator", {
  //       id: JS("Identifier", { name: "x" }),
  //       init: JS("NumericLiteral", { value: 10 }),
  //     }),
  //   ],
  // });
  const ast = useComputed$(() => {
    try {
      const parsed = parse(code.value, {
        plugins: ["jsx", "typescript"],
        sourceType: "module",
      });
      // parsed.
      if (removeLocation.value) removeASTLocation(parsed);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return "";
    }
  });
  useVisibleTask$(async () => {
    const a = JS("VariableDeclaration", {
      declarations: [
        JS("VariableDeclarator", {
          id: JS("Identifier", { name: "x" }),
          init: JS("NumericLiteral", { value: 10 }),
        }),
      ],
    });
    console.log(_JS.SCOPABLE_TYPES);
    // console.log(a);
    // JS.
  });
  return (
    <div>
      <span>Type the code in JS/TS</span>
      <br />
      <textarea
        class="h-[100px] w-[400px] resize-none border-2 border-gray-400"
        bind:value={code}
      />
      <br />
      <div class="pt-12"></div>
      <button
        class=" border-2 border-gray-400"
        onClick$={() => (removeLocation.value = !removeLocation.value)}
      >
        Turn on/off location info
      </button>
      <div>
        AST TREE:
        <pre>{ast.value}</pre>
      </div>
    </div>
  );
});
