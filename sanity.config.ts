import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { sanityProjectId, sanityDataset } from "./src/sanity/env";
export default defineConfig({
  name: "onegoodjune",
  title: "OneGoodJune Editorial",
  projectId: sanityProjectId || "unconfigured",
  dataset: sanityDataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("OneGoodJune")
          .items([
            S.listItem()
              .title("Editorial selections")
              .child(
                S.document()
                  .schemaType("editorialSettings")
                  .documentId("editorial-settings"),
              ),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== "editorialSettings",
            ),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
  document: {
    newDocumentOptions: (options) =>
      options.filter((option) => option.templateId !== "editorialSettings"),
  },
});
