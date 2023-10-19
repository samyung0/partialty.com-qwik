import * as T from "@babel/types";
export default T;
// @babel\types\lib\validators\generated\index.js

export function $(
  type: (typeof T.STANDARDIZED_TYPES)[number],
  fields?: Record<string, any>,
  errorFn?: Function
) {
  const b: any = {};
  b.type = type;
  if (fields) Object.assign(b, fields);
  if (errorFn) Object.assign(b, { $_$errorFn: errorFn });
  return b;
}
