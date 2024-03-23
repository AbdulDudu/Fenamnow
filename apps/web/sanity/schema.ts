import { type SchemaTypeDefinition } from "sanity";
import author from "./schemaTypes/author";
import blockContent from "./schemaTypes/blockContent";
import category from "./schemaTypes/category";
import legalDocument from "./schemaTypes/legalDocument";
import post from "./schemaTypes/post";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, author, category, legalDocument, blockContent]
};
