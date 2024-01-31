# About this content editor

nah this component library is unmaintainable but I will briefly talk about how it works

## KNOWN BUG

Qwik fails to bundle when a string that is REALLY large (>~100kb) gets exported, <del>hence highlightSVGString is split into 4 smaller files. highlightSVGString has a combined of over 90000 chars, with 2 bytes per char in JS, its size is 175 kB (I know its absurd and I should probably find another svg)</del>
