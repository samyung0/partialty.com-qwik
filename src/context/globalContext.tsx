import { createContextId } from "@builder.io/qwik";
import type { GlobalContextType } from "~/types/GlobalContext";

export const globalContext = createContextId<GlobalContextType>("global");
