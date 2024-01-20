export const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];
export const LIST_TYPES = ["numbered-list", "bulleted-list"];

export type Align = "left" | "center" | "right" | "justify";
export type List = "numbered-list" | "bulleted-list";

export type ParagraphElement = {
  type: "paragraph";
  align?: Align;
  children: CustomText[];
};

export type CodeElement = {
  type: "code";
  align?: Align;
  children: CustomText[];
};
export type BlockQuote = {
  type: "block-quote";
  align?: Align;
  children: CustomText[];
};
export type HeadingOne = {
  type: "heading-one";
  align?: Align;
  children: CustomText[];
};
export type HeadingTwo = {
  type: "heading-two";
  align?: Align;
  children: CustomText[];
};
export type HeadingThree = {
  type: "heading-three";
  align?: Align;
  children: CustomText[];
};
export type HeadingFour = {
  type: "heading-four";
  align?: Align;
  children: CustomText[];
};
export type ListItem = {
  type: "list-item";
  align?: Align;
  children: CustomText[];
};
export type NumberedList = {
  type: "numbered-list";
  align?: Align;
  children: CustomText[];
};
export type BulletedList = {
  type: "bulleted-list";
  align?: Align;
  children: CustomText[];
};

export type CustomText = {
  text: string;
  bold?: true;
  code?: true;
  italic?: true;
  underline?: true;
};
export type CustomElement =
  | ParagraphElement
  | CodeElement
  | BlockQuote
  | BulletedList
  | HeadingOne
  | HeadingTwo
  | HeadingThree
  | HeadingFour
  | ListItem
  | NumberedList;

export type BlockFormat = Align | List | CustomElement["type"];
export type CustomElementType = CustomElement["type"];
export type MarkFormat = keyof CustomText;
export type CustomMarkFormat = keyof Omit<CustomText, "text">;
