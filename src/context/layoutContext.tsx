import { createContextId } from "@builder.io/qwik";

export const layoutContext = createContextId<{ value: string }>("layout");
