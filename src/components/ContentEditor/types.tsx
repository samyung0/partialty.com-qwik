export const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];
export const LIST_TYPES = ["numbered-list", "bulleted-list"];

export type Align = "left" | "center" | "right" | "justify";
export type List = "numbered-list" | "bulleted-list";

export type ParagraphElement = {
  type: "paragraph";
  align?: Align;
  url?: string;
  caption?: string;
  public_id?: string;
  content?: string;
  filename?: string;
  language?: string;
  children: (CustomText | CustomElement)[];
};

export type CodeElement = {
  type: "code";
  align?: Align;
  url?: string;
  caption?: string;
  public_id?: string;
  content?: string;
  filename?: string;
  language?: string;
  children: (CustomText | CustomElement)[];
};

export type CodeBlockElement = {
  type: "codeBlock";
  align?: Align;
  url?: string;
  caption?: string;
  public_id?: string;
  content?: string;
  filename?: string;
  language?: string;
  children: (CustomText | CustomElement)[];
};

export type CodeLineElement = {
  type: "codeLine";
  align?: Align;
  url?: string;
  caption?: string;
  public_id?: string;
  content?: string;
  filename?: string;
  language?: string;
  children: (CustomText | CustomElement)[];
};

export type BlockQuote = {
  type: "block-quote";
  align?: Align;
  url?: string;
  caption?: string;
  public_id?: string;
  content?: string;
  filename?: string;
  language?: string;
  children: (CustomText | CustomElement)[];
};
export type HeadingOne = {
  type: "heading-one";
  align?: Align;
  url?: string;
  caption?: string;
  public_id?: string;
  content?: string;
  filename?: string;
  language?: string;
  children: (CustomText | CustomElement)[];
};
export type HeadingTwo = {
  type: "heading-two";
  align?: Align;
  url?: string;
  caption?: string;
  public_id?: string;
  content?: string;
  filename?: string;
  language?: string;
  children: (CustomText | CustomElement)[];
};
export type HeadingThree = {
  type: "heading-three";
  align?: Align;
  url?: string;
  caption?: string;
  public_id?: string;
  content?: string;
  filename?: string;
  language?: string;
  children: (CustomText | CustomElement)[];
};
export type HeadingFour = {
  type: "heading-four";
  align?: Align;
  url?: string;
  caption?: string;
  public_id?: string;
  content?: string;
  filename?: string;
  language?: string;
  children: (CustomText | CustomElement)[];
};
export type ListItem = {
  type: "list-item";
  align?: Align;
  url?: string;
  caption?: string;
  public_id?: string;
  content?: string;
  filename?: string;
  language?: string;
  children: (CustomText | CustomElement)[];
};
export type NumberedList = {
  type: "numbered-list";
  align?: Align;
  url?: string;
  caption?: string;
  public_id?: string;
  content?: string;
  filename?: string;
  language?: string;
  children: (CustomText | CustomElement)[];
};
export type BulletedList = {
  type: "bulleted-list";
  align?: Align;
  url?: string;
  caption?: string;
  public_id?: string;
  content?: string;
  filename?: string;
  language?: string;
  children: (CustomText | CustomElement)[];
};

export type VideoEmbed = {
  type: "embed";
  align?: Align;
  url?: string;
  caption?: string;
  public_id?: string;
  content?: string;
  filename?: string;
  language?: string;
  children: (CustomText | CustomElement)[];
};

export type UrlLink = {
  type: "link";
  align?: Align;
  url?: string;
  caption?: string;
  public_id?: string;
  content?: string;
  filename?: string;
  language?: string;
  children: (CustomText | CustomElement)[];
};

export type ImageElement = {
  type: "image";
  align?: Align;
  url?: string;
  caption?: string;
  public_id?: string;
  content?: string;
  filename?: string;
  language?: string;
  children: (CustomText | CustomElement)[];
};

export type CustomText = {
  text: string;
  bold?: true;
  code?: true;
  italic?: true;
  underline?: true;
  strikethrough?: true;
  superscript?: true;
  subscript?: true;
  background?: string;
  color?: string;
};
export type CustomElement =
  | ParagraphElement
  | CodeBlockElement
  | CodeLineElement
  | CodeElement
  | BlockQuote
  | BulletedList
  | HeadingOne
  | HeadingTwo
  | HeadingThree
  | HeadingFour
  | ListItem
  | NumberedList
  | VideoEmbed
  | UrlLink
  | ImageElement;

export type BlockFormat = Align | List | CustomElement["type"];
export type CustomElementType = CustomElement["type"];
export type MarkFormat = keyof CustomText;
export type CustomMarkFormat = keyof Omit<CustomText, "text">;
