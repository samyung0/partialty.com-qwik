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

export type LineBreakElement = {
  type: "line-break";
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
export type InfoBlock = {
  type: "infoBlock";
  align?: Align;
  url?: string;
  caption?: string;
  public_id?: string;
  content?: string;
  filename?: string;
  language?: string;
  children: (CustomText | CustomElement)[];
};
export type CautionBlock = {
  type: "cautionBlock";
  align?: Align;
  url?: string;
  caption?: string;
  public_id?: string;
  content?: string;
  filename?: string;
  language?: string;
  children: (CustomText | CustomElement)[];
};
export type WarningBlock = {
  type: "warningBlock";
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
export type ListItemText = {
  type: "list-item-text";
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
  embedHeight?: number;
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
  imageHeight?: number;
};

export type QuizBlockElement = {
  type: "quizBlock";
  formName?: string;
  quizTitle?: string;
  ans?: string;
  align?: Align;
  url?: string;
  caption?: string;
  public_id?: string;
  content?: string;
  filename?: string;
  language?: string;
  children: (CustomText | CustomElement)[];
};

export type QuizOptionElement = {
  type: "quizOption";
  formName?: string;
  optionValue?: string;
  align?: Align;
  url?: string;
  caption?: string;
  public_id?: string;
  content?: string;
  filename?: string;
  language?: string;
  children: (CustomText | CustomElement)[];
};

export type QuizCodeBlockElement = {
  type: "quizCodeBlock";
  quizTitle: string;
  ans: {
    type: "matchInput" | "ast";
    matchInput: Record<string, string>;
    ast: string;
  };
  astLang: string;
  combinedText: string;
  displayAst: string;
  codeInput: string;
  removeTrailingSpaces: boolean;
  isCode: boolean;
  inputCount: number;
  inputWidth: number;
  formName: string;
  align?: Align;
  url?: string;
  caption?: string;
  public_id?: string;
  content?: string;
  filename?: string;
  language?: string;
  children: (CustomText | CustomElement)[];
};

export type QuizCodeInputElement = {
  type: "quizCodeInput";
  formName: string;
  inputId: string;
  inputWidth: number;
  inputNumber: number;
  align?: Align;
  url?: string;
  caption?: string;
  public_id?: string;
  content?: string;
  filename?: string;
  language?: string;
  children: (CustomText | CustomElement)[];
};

export type QuizCodePragraphElement = {
  type: "quizCodeParagraph";
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
  underline?: string;
  strikethrough?: true;
  superscript?: true;
  subscript?: true;
  background?: string;
  color?: string;
  colorDarkMode?: string;
  backgroundDarkMode?: string;
  underlineDarkMode?: string;
  timeStamp?: number;
  sync?: true;
  animate?: true;
  fontSize?: number;
  fontFamily?: string;
  fontSpacing?: number;
  isCodeQuizInput?: string;
};
export type CustomElement =
  | ParagraphElement
  | CodeBlockElement
  | CodeLineElement
  | CodeElement
  | BlockQuote
  | InfoBlock
  | CautionBlock
  | WarningBlock
  | BulletedList
  | HeadingOne
  | HeadingTwo
  | HeadingThree
  | HeadingFour
  | ListItem
  | ListItemText
  | NumberedList
  | VideoEmbed
  | UrlLink
  | ImageElement
  | QuizBlockElement
  | QuizOptionElement
  | QuizCodeBlockElement
  | QuizCodeInputElement
  | QuizCodePragraphElement
  | LineBreakElement;

export type BlockFormat = Align | List | CustomElement["type"];
export type CustomElementType = CustomElement["type"];
export type MarkFormat = keyof CustomText;
export type CustomMarkFormat = keyof Omit<CustomText, "text">;
