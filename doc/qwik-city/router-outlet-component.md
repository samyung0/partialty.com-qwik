```ts
import {
  component$,
  jsx,
  type JSXNode,
  SkipRender,
  useContext,
  _IMMUTABLE,
  _jsxBranch,
  _jsxQ,
  useServerData,
} from "@builder.io/qwik";

import { ContentInternalContext } from "./contexts";
import shim from "./spa-shim";

/** @public */
export const RouterOutlet = component$(({ layout = "default" }: { layout?: string }) => {
  const forbiddenValues = ["head", "headings", "onStaticGenerate"];
  if (layout in forbiddenValues) {
    console.warn("head, headings and onStaticGenerate are not valid layout names !!!");
  }

  // TODO Option to remove this shim, especially for MFEs.
  const shimScript = shim();

  _jsxBranch();

  const nonce = useServerData<string | undefined>("nonce");
  const { value } = useContext(ContentInternalContext);
  if (value && value.length > 0) {
    const contentsLen = value.length;
    let cmp: JSXNode | null = null;
    for (let i = contentsLen - 1; i >= 0; i--) {
      if (!(layout in forbiddenValues) && value[i][layout]) {
        cmp = jsx(value[i][layout], {
          children: cmp,
        });
      } else if (value[i].default) {
        cmp = jsx(value[i].default as any, {
          children: cmp,
        });
      }
    }
    return (
      <>
        {cmp}
        <script dangerouslySetInnerHTML={shimScript} nonce={nonce}></script>
      </>
    );
  }
  return SkipRender;
});
```
