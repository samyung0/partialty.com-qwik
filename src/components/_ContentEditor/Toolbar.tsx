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
  GanttChartSquare,
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
  Minus,
  PaintBucket,
  Pilcrow,
  Rows3,
  Strikethrough,
  Subscript,
  Superscript,
  Type,
  Underline,
  XCircle,
} from 'lucide-react';
import {
  BlockButton,
  CodeBlockButton,
  EmbedButton,
  ImageButton,
  LineBreakButton,
  LinkButton,
  QuizBlockButton,
  QuizCodeBlockButton,
} from '~/components/_ContentEditor/blockFn';
import {
  BackgroundMarkButton,
  ColorMarkButton,
  MarkButton,
  TextMarkButton,
  UnderlineMarkButton,
} from '~/components/_ContentEditor/markFn';

const Toolbar = ({
  setShowImageChooser,
  audioTimeStamp,
}: {
  setShowImageChooser: React.Dispatch<React.SetStateAction<boolean>>;
  audioTimeStamp: React.MutableRefObject<number>;
}) => {
  return (
    <div className="absolute left-0 top-0 z-[100] flex h-[10vh] max-h-[10vh] w-full items-center justify-center rounded-lg border-2 border-primary-dark-gray bg-background-light-gray p-4 dark:border-disabled-dark dark:bg-primary-dark-gray dark:text-background-light-gray ">
      <div className="flex max-w-full items-center justify-center gap-4 pb-4 md:flex-wrap md:pb-0 ">
        <MarkButton title={'Bold'} format="bold" children={<Bold size={20} />} />
        <MarkButton title={'Italic'} format="italic" children={<Italic size={20} />} />
        <MarkButton title={'Strikethrough'} format="strikethrough" children={<Strikethrough size={20} />} />
        <UnderlineMarkButton audioTimeStamp={audioTimeStamp} children={<Underline size={20} />} />
        <BackgroundMarkButton audioTimeStamp={audioTimeStamp} children={<PaintBucket size={20} />} />
        <ColorMarkButton audioTimeStamp={audioTimeStamp} children={<Baseline size={20} />} />
        <TextMarkButton children={<Type size={20} />} />
        <MarkButton title={'Code'} format="code" children={<Code size={20} />} />
        <MarkButton title={'Superscript'} format="superscript" children={<Superscript size={20} />} />
        <MarkButton title={'Subscript'} format="subscript" children={<Subscript size={20} />} />
        <BlockButton title={'Paragraph'} format="paragraph" children={<Pilcrow size={20} />} />
        <BlockButton title={'Heading 1'} format="heading-one" children={<Heading1 size={20} />} />
        <BlockButton title={'Heading 2'} format="heading-two" children={<Heading2 size={20} />} />
        <BlockButton title={'Heading 3'} format="heading-three" children={<Heading3 size={20} />} />
        <BlockButton title={'Heading 4'} format="heading-four" children={<Heading4 size={20} />} />
        <BlockButton title={'Numbered List'} format="numbered-list" children={<ListOrdered size={20} />} />
        <BlockButton title={'Bulleted List'} format="bulleted-list" children={<List size={20} />} />
        <BlockButton title={'Align Left'} format="left" children={<AlignLeft size={20} />} />
        <BlockButton title={'Align Center'} format="center" children={<AlignCenter size={20} />} />
        <BlockButton title={'Align Right'} format="right" children={<AlignRight size={20} />} />
        <LineBreakButton title={'Line Break'} format="line-break" children={<Minus size={20} />} />
        <LinkButton format="link" children={<Link2 size={20} />} />
        <ImageButton setShowImageChooser={setShowImageChooser} format="image" children={<Image size={20} />} />
        <EmbedButton format="embed" children={<Film size={20} />} />
        <CodeBlockButton format="codeBlock" children={<FileCode size={20} />} />
        <br />
        <BlockButton title={'Information'} format="infoBlock" children={<Lightbulb size={20} />} />
        <BlockButton title={'Caution'} format="cautionBlock" children={<Info size={20} />} />
        <BlockButton title={'Warning'} format="warningBlock" children={<XCircle size={20} />} />
        <br />
        <QuizBlockButton children={<Rows3 size={20} />} />
        <QuizCodeBlockButton children={<GanttChartSquare size={20} />} />
      </div>
    </div>
  );
};

export default Toolbar;
