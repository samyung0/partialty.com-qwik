import { type SchemaTypeDefinition } from "sanity";
import author from "./author";
import embed from "./embed";
import post from "./post";
import tag from "./tag";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, embed, author, tag],
};
