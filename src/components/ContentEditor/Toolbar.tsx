/** @jsxImportSource react */
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Baseline,
  Bold,
  Code,
  Film,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Italic,
  Link2,
  List,
  ListOrdered,
  PaintBucket,
  Pilcrow,
  Quote,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from "lucide-react";
import { BlockButton, EmbedButton, LinkButton } from "~/components/ContentEditor/blockFn";
import {
  BackgroundMarkButton,
  ColorMarkButton,
  MarkButton,
} from "~/components/ContentEditor/markFn";

const Toolbar = () => {
  return (
    <div className="flex flex-wrap gap-2 pb-12">
      <MarkButton format="bold" children={<Bold size={20} />} />
      <MarkButton format="italic" children={<Italic size={20} />} />
      <MarkButton format="underline" children={<Underline size={20} />} />
      <MarkButton format="strikethrough" children={<Strikethrough size={20} />} />
      <BackgroundMarkButton format="background" children={<PaintBucket size={20} />} />
      <ColorMarkButton format="color" children={<Baseline size={20} />} />
      <MarkButton format="code" children={<Code size={20} />} />
      <MarkButton format="superscript" children={<Superscript size={20} />} />
      <MarkButton format="subscript" children={<Subscript size={20} />} />
      <LinkButton format="link" children={<Link2 size={20} />} />
      <BlockButton format="paragraph" children={<Pilcrow size={20} />} />
      <BlockButton format="heading-one" children={<Heading1 size={20} />} />
      <BlockButton format="heading-two" children={<Heading2 size={20} />} />
      <BlockButton format="heading-three" children={<Heading3 size={20} />} />
      <BlockButton format="heading-four" children={<Heading4 size={20} />} />
      <BlockButton format="block-quote" children={<Quote size={18} />} />
      <BlockButton format="numbered-list" children={<ListOrdered size={20} />} />
      <BlockButton format="bulleted-list" children={<List size={20} />} />
      <BlockButton format="left" children={<AlignLeft size={20} />} />
      <BlockButton format="center" children={<AlignCenter size={20} />} />
      <BlockButton format="right" children={<AlignRight size={20} />} />
      <EmbedButton format="embed" children={<Film size={20} />} />
    </div>
  );
};

export default Toolbar;
