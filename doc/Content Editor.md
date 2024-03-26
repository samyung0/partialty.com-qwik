# About this content editor

nah this component library is unmaintainable but I will briefly talk about how it works

Firstly, we create the editor that stores all the state:

```ts
const [editor] = useState(() =>
  withLists(schema)(
    withTrailingNewLine(withQuiz(withImages(withLink(withEmbeds(withReact(withHistory(createEditor())))))))
  )
);
```

All the `withXXX` are plugins that taps into editor's event listeners: `insertBreak`, `insertText`, `insertData` (on paste), etc.

Then it is rendered as

```ts
<Slate
  onValueChange={() => {
    setHasChanged();
  }}
  editor={editor}
  initialValue={normalizedInitialValue}
>
  // ...
  <Editable
    className="outline-none"
    placeholder="Enter some rich text…"
    spellCheck
    autoFocus
    decorate={decorate}
    onKeyDown={(event: React.KeyboardEvent) => onKeyDown(editor, event)}
    renderElement={renderElement}
    renderLeaf={renderLeaf}
  />
  // ...
</Slate>
```

There are two types of elements in Slate: `Element` and `Leaf`. You can imagine an Element is equivalent to "block element" in css and Leaf as "inline". An element can have its own properties and a Leaf can have its `marks`. An Element can contain other elements and the text inside the Element is then the Leaf, and it can have multiple marks, but a Leaf will never contain an Element. The Object looks something like this:

```json
{
  "type": "<type>", // Element
  // ...other properties of Element
  "children": [
    {
      "text": "", // Leaf
      "strong": true // example mark of Leaf
      // ... other marks of Leaf
    }
  ]
}
```

The types are defined in `types.ts` and declared globally as

```ts
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor &
      ReactEditor &
      HistoryEditor & {
        nodeToDecorations?: Map<CustomElement, BaseRange[]>;
      };
    Element: CustomElement;
    Text: CustomText;
  }
}
```

You need to individually define how each Element and Leaf will render, once in TSX, and once in string for serialization.

## KNOWN BUG

Qwik fails to bundle when a string that is REALLY large (>~100kb) gets exported, <del>hence highlightSVGString is split into 4 smaller files. highlightSVGString has a combined of over 90000 chars, with 2 bytes per char in JS, its size is 175 kB (I know its absurd and I should probably find another svg)</del>
