/** @jsxImportSource react */
'use client';

import { Plate } from '@udecode/plate-common';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Editor } from '~/components/_ContentEditor/plate-ui/editor';
import { FixedToolbar } from '~/components/_ContentEditor/plate-ui/fixed-toolbar';
import { FixedToolbarButtons } from '~/components/_ContentEditor/plate-ui/fixed-toolbar-buttons';
import { FloatingToolbar } from '~/components/_ContentEditor/plate-ui/floating-toolbar';
import { FloatingToolbarButtons } from '~/components/_ContentEditor/plate-ui/floating-toolbar-buttons';
import { plugins } from './plugins';

import { TooltipProvider } from '~/components/_ContentEditor/plate-ui/tooltip';

export default function PlateEditor() {
  const initialValue = [
    {
      id: '1',
      type: ELEMENT_PARAGRAPH,
      children: [{ text: '' }],
    },
  ];

  return (
    <TooltipProvider disableHoverableContent delayDuration={500} skipDelayDuration={0}>
      <DndProvider backend={HTML5Backend}>
        <Plate plugins={plugins} initialValue={initialValue}>
          <FixedToolbar>
            <FixedToolbarButtons />
          </FixedToolbar>

          <Editor
            className="min-h-full px-8 py-8 2xl:px-[96px]"
            autoFocus
            focusRing={false}
            variant="ghost"
            size="md"
          />

          <FloatingToolbar>
            <FloatingToolbarButtons />
          </FloatingToolbar>
        </Plate>
      </DndProvider>
    </TooltipProvider>
  );
}
