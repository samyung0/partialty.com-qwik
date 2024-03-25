/// <reference types="vite/client">
/// <reference types="vitest"/>
import * as integration from "./setup/factory";

declare module "vitest" {
  export interface TestContext {
    integration: typeof integration;
    request: Request;
  }
}
