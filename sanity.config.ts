/** @jsxImportSource react */
import { codeInput } from "@sanity/code-input";
import { DashboardIcon } from "@sanity/icons";
import { table } from "@sanity/table";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { media } from "sanity-plugin-media";
import { structureTool } from "sanity/structure";
import { CardTool } from "./sanity/components/Card";
import { schema } from "./sanity/schemas";

const myCustomTool = () => {
  return {
    title: "My Custom Tool",
    name: "my-custom-tool", // localhost:3333/my-custom-tool
    icon: DashboardIcon,
    component: CardTool,
  };
};

export default defineConfig({
  name: "default",
  title: "partialty.com",

  projectId: "4psl6aio",
  dataset: "production",

  plugins: [codeInput(), structureTool(), visionTool(), table(undefined), media()],
  // document: {
  //   actions: (prev, context) =>{
  //     return prev.map((originalAction) => (originalAction.action === 'publish' ? SetAndPublishAction : originalAction)) as any}
  // },
  tools: [myCustomTool()],
  schema,
});
