/** @jsxImportSource react */
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Baseline,
  Bold,
  Code,
  FileCode,
  Film,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Image,
  Info,
  Italic,
  Lightbulb,
  Link2,
  List,
  ListOrdered,
  PaintBucket,
  Pilcrow,
  Rows3,
  Strikethrough,
  Subscript,
  Superscript,
  Type,
  Underline,
  XCircle,
} from "lucide-react";
import {
  BlockButton,
  CodeBlockButton,
  EmbedButton,
  ImageButton,
  LinkButton,
  QuizBlockButton,
} from "~/components/_ContentEditor/blockFn";
import {
  BackgroundMarkButton,
  ColorMarkButton,
  MarkButton,
  TextMarkButton,
  UnderlineMarkButton,
} from "~/components/_ContentEditor/markFn";

const Toolbar = ({
  setShowImageChooser,
  audioTimeStamp,
}: {
  setShowImageChooser: React.Dispatch<React.SetStateAction<boolean>>;
  audioTimeStamp: React.MutableRefObject<number>;
}) => {
  return (
    <div className="absolute left-0 top-0 z-[100] flex h-[10vh] max-h-[10vh] w-full items-start justify-center rounded-lg border-2 border-mint bg-light-mint p-4">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <MarkButton format="bold" children={<Bold size={20} />} />
        <MarkButton format="italic" children={<Italic size={20} />} />
        <MarkButton format="strikethrough" children={<Strikethrough size={20} />} />
        <UnderlineMarkButton
          audioTimeStamp={audioTimeStamp}
          format="underline"
          children={<Underline size={20} />}
        />
        <BackgroundMarkButton
          audioTimeStamp={audioTimeStamp}
          format="background"
          children={<PaintBucket size={20} />}
        />
        <ColorMarkButton
          audioTimeStamp={audioTimeStamp}
          format="color"
          children={<Baseline size={20} />}
        />
        <TextMarkButton children={<Type size={20} />} />
        <MarkButton format="code" children={<Code size={20} />} />
        <MarkButton format="superscript" children={<Superscript size={20} />} />
        <MarkButton format="subscript" children={<Subscript size={20} />} />
        <BlockButton format="paragraph" children={<Pilcrow size={20} />} />
        <BlockButton format="heading-one" children={<Heading1 size={20} />} />
        <BlockButton format="heading-two" children={<Heading2 size={20} />} />
        <BlockButton format="heading-three" children={<Heading3 size={20} />} />
        <BlockButton format="heading-four" children={<Heading4 size={20} />} />
        <BlockButton format="numbered-list" children={<ListOrdered size={20} />} />
        <BlockButton format="bulleted-list" children={<List size={20} />} />
        <BlockButton format="left" children={<AlignLeft size={20} />} />
        <BlockButton format="center" children={<AlignCenter size={20} />} />
        <BlockButton format="right" children={<AlignRight size={20} />} />
        <LinkButton format="link" children={<Link2 size={20} />} />
        <ImageButton
          setShowImageChooser={setShowImageChooser}
          format="image"
          children={<Image size={20} />}
        />
        <EmbedButton format="embed" children={<Film size={20} />} />
        <CodeBlockButton format="codeBlock" children={<FileCode size={20} />} />
        <br />
        <BlockButton format="infoBlock" children={<Lightbulb size={20} />} />
        <BlockButton format="cautionBlock" children={<Info size={20} />} />
        <BlockButton format="warningBlock" children={<XCircle size={20} />} />
        <br />
        <QuizBlockButton children={<Rows3 size={20} />} />
      </div>
    </div>
  );
};

export default Toolbar;
