/** @jsxImportSource react */
import { codeInput } from "@sanity/code-input";
import { table } from "@sanity/table";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { media } from "sanity-plugin-media";
import { structureTool } from "sanity/structure";
import { schema } from "./sanity/schemas";

export default defineConfig({
  name: "default",
  title: "partialty.com",

  projectId: "4psl6aio",
  dataset: "production",

  plugins: [
    codeInput(),
    structureTool({
      structure: (S, context) => {
        console.log(context);
        return S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Author")
              .child(
                S.editor().schemaType("author").documentId("8a4e550a-1566-4871-89a2-12e4aa2ecc39")
              ),
            // Add a visual divider (optional)
            S.divider(),
            // List out the rest of the document types, but filter out the config type
            ...S.documentTypeListItems().filter(
              (listItem) => !["author"].includes(listItem.getId())
            ),
          ]);
      },
    }),
    visionTool(),
    table(undefined),
    media(),
  ],
  // document: {
  //   actions: (prev, context) =>{
  //     return prev.map((originalAction) => (originalAction.action === 'publish' ? SetAndPublishAction : originalAction)) as any}
  // },
  schema,
});
