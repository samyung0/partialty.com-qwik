import { parse as parseJS } from "@babel/parser";
import { parse as parseVue3 } from "@vue/compiler-dom";
import * as parseCSS from "css-tree";
import { parser as parseHTML } from "posthtml-parser";
import { parse as parseSQL } from "sql-parser-cst";
import { parse as parseSvelte } from "svelte-parse-markup";

export default {
  js: (code: string) => {
    const removeASTLocationAndExtra = (ast: any) => {
      if (Array.isArray(ast)) {
        ast.forEach((a) => removeASTLocationAndExtra(a));
      } else if (typeof ast === "object" && ast !== null) {
        delete ast["loc"];
        delete ast["start"];
        delete ast["end"];
        delete ast["extra"];
        const values = Object.values(ast).filter((v) => Array.isArray(v) || typeof v === "object");
        removeASTLocationAndExtra(values);
      }
    };
    try {
      const parsed = parseJS(code, { sourceType: "module", plugins: ["jsx", "typescript"] });
      removeASTLocationAndExtra(parsed);
      return parsed;
    } catch (e) {
      console.error(e);
    }
  },
  css: (code: string) => {
    const removeLoc = (ast: any) => {
      if (Array.isArray(ast)) {
        ast.forEach((a) => removeLoc(a));
      } else if (typeof ast === "object" && ast !== null) {
        delete ast["loc"];
        const values = Object.values(ast).filter((v) => Array.isArray(v) || typeof v === "object");
        removeLoc(values);
      }
    };
    try {
      const parsed = parseCSS.parse(code);
      const temp = JSON.parse(JSON.stringify(parsed));
      removeLoc(temp);
      return temp;
    } catch (e) {
      console.error(e);
    }
  },
  html: (code: string) => {
    try {
      return parseHTML(code);
    } catch (e) {
      console.error(e);
    }
  },
  svelte: (code: string) => {
    const removeASTLocationAndRaw = (ast: any) => {
      if (Array.isArray(ast)) {
        ast.forEach((a) => removeASTLocationAndRaw(a));
      } else if (typeof ast === "object" && ast !== null) {
        delete ast["loc"];
        delete ast["start"];
        delete ast["end"];
        delete ast["raw"];
        const values = Object.values(ast).filter((v) => Array.isArray(v) || typeof v === "object");
        removeASTLocationAndRaw(values);
      }
    };
    try {
      return removeASTLocationAndRaw(parseSvelte(code));
    } catch (e) {
      console.error(e);
    }
  },
  vue3: (code: string) => {
    const remove = (ast: any) => {
      if (Array.isArray(ast)) {
        ast.forEach((a) => remove(a));
      } else if (typeof ast === "object" && ast !== null) {
        delete ast["loc"];
        delete ast["start"];
        delete ast["end"];
        delete ast["type"];
        delete ast["codegenNode"];
        delete ast["tagType"];
        delete ast["ns"];

        const values = Object.values(ast).filter((v) => Array.isArray(v) || typeof v === "object");
        remove(values);
      }
    };
    try {
      return remove(parseVue3(code));
    } catch (e) {
      console.error(e);
    }
  },
  mysql: (code: string) => {
    try {
      return parseSQL(code, {
        dialect: "mysql",
      });
    } catch (e) {
      console.error(e);
    }
  },
} as Record<string, (code: string) => any>;
