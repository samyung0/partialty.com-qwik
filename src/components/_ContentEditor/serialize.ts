import escapeHtml from 'escape-html';
import { Node, Text } from 'slate';

import urlParser from 'js-video-url-parser';
import { isUrl } from '~/utils/isUrl';

import { v4 as uuidv4 } from 'uuid';

const YOUTUBE_PREFIX = 'https://www.youtube.com/embed/';
const VIMEO_PREFIX = 'https://player.vimeo.com/video/';
const DAILYMOTION_PREFIX = 'https://www.dailymotion.com/embed/video/';
const YOUKU_PREFIX = 'https://player.youku.com/embed/';
const COUB_PREFIX = 'https://coub.com/embed/';

import highlightSVGString from '~/components/_ContentEditor/highlightSVGString';
import { CLOUDINARY_NAME } from '~/const/cloudinary';
import { highlightShikiji } from '~/utils/shikiji/renderIndexCodeBlock';

const combinedHighlightSVGString = highlightSVGString;

const plainTextSerialize = (nodes: any) => {
  return nodes.map((n: any) => Node.string(n)).join('\n');
};

const serialize = async (node: any, initial: boolean = false): Promise<string> => {
  if (!node) return '';
  if (initial) return `${node ? (await Promise.all(node.map((n: any) => serialize(n)))).join('') : '&nbsp;'}`;

  if (Text.isText(node)) {
    let string = escapeHtml(node.text);
    const style = 'background-color:inherit;color:inherit';
    if (node.bold) {
      string = `<strong style="${style}">${string}</strong>`;
    }

    if (node.code) {
      string = `<code style="color:inherit">${string}</code>`;
    }

    if (node.italic) {
      string = `<em style="${style}">${string}</em>`;
    }

    if (node.strikethrough) {
      string = `<del style="${style}">${string}</del>`;
    }

    if (node.superscript) {
      string = `<sup style="${style}">${string}</sup>`;
    }

    if (node.subscript) {
      string = `<sub style="${style}">${string}</sub>`;
    }

    if (node.fontSize) {
      string = `<span style="background:inherit;color:inherit;font-size: ${node.fontSize}px;">${string}</span>`;
    }

    if (node.fontFamily) {
      string = `<span style="background:inherit;color:inherit;font-family: ${node.fontFamily};">${string}</span>`;
    }

    if (node.fontSpacing) {
      string = `<span style="background:inherit;color:inherit;letter-spacing: ${node.fontSpacing}px;">${string}</span>`;
    }
    return string;
  }

  let children = node.children ? (await Promise.all(node.children.map((n: any) => serialize(n)))).join('') : '';

  if (children.trim() === '') children = '&nbsp;';

  const style = `text-align: ${node.align || 'left'};background-color:inherit;color:inherit;` as const;
  switch (node.type) {
    case 'paragraph':
      return `<p style="${style}">${children}</p>`;
    case 'markerUnderline': {
      let str = '';
      const uuid = 'a' + uuidv4();
      if (node.animate) {
        str += `<style>
        @keyframes ${uuid} {
          0% {
            width: 100%;	
          }
          100% {
            width: 0%;
          }
        }
        @keyframes ${uuid}2 {
          0% {
            width: 0%;	
          }
          100% {
            width: 100%;
          }
        }
        #${uuid}lower {
          position: absolute;
            top:100%;
            left:0;
            height:4px;
            width:100%;
            display:block;
            background:${node.underline};
            z-index: 0;
        }
        ${
          node.underlineDarkMode
            ? `.dark #${uuid}lower {
          background: ${node.underlineDarkMode} !important;
        }`
            : ''
        }
      #${uuid}upper {
          position: absolute;
            display: block;
            top:100%;
            right:0;
            height: 4px;
            width: 100%;
            background: inherit;
            z-index: 1;
            ${!node.sync && `animation: ${uuid} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) both 1s;`}
        }
         </style>`;
        str += `<span style="position:relative;background:inherit;color:inherit; white-space: nowrap;">${children}<span id="${uuid}lower"></span><span ${
          node.sync &&
          `data-sync="1" data-synctimestamp="${node.timeStamp}" data-syncenter='{"animation": "${uuid} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) both"}' data-syncleave='{"animation": "${uuid}2 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) both"}'`
        } id="${uuid}upper"></span></span>`;
      } else if (node.sync) {
        str += `<style>
        #${uuid}lower {
          position: absolute;
            top:100%;
            left:0;
            height:4px;
            width:100%;
            display:block;
            background:${node.underline};
            z-index: 0;
        }
        ${
          node.underlineDarkMode
            ? `.dark #${uuid}lower {
          background: ${node.underlineDarkMode}
        }`
            : ''
        }
      #${uuid}upper {
          position: absolute;
            display: block;
            top:100%;
            right:0;
            height:4px;
            width: 100%;
            background: inherit;
            z-index: 1;
        }
         </style>`;
        str += `<span style="position:relative;background:inherit;color:inherit;white-space: nowrap;">${children}<span id="${uuid}lower"></span><span data-sync="1" data-synctimestamp="${node.timeStamp}" data-syncenter='{"width": "0"}' data-syncleave='{"width": "100%"}' id="${uuid}upper"></span>/span>`;
      } else {
        str += `<style>
        #${uuid} {
          border-bottom: 4px solid ${node.underline};
        }
        ${
          node.underlineDarkMode
            ? `.dark #${uuid} {
              border-bottom: 4px solid ${node.underlineDarkMode};
        }`
            : ''
        }
         </style>`;
        str += `<span id="${uuid}" style="position:relative;background:inherit;color:inherit;">${children}</span>`;
      }
      return str;
    }
    case 'markerBackground': {
      let str = '';
      const uuid = 'a' + uuidv4();
      if (node.animate) {
        str += `<style>
        @keyframes ${uuid} {
          0% {
            width: calc(100% + 8px);	
          }
          100% {
            width: 0%;
          }
        }
        @keyframes ${uuid}2 {
          0% {
            width: 0%;	
          }
          100% {
            width: calc(100% + 8px);
          }
        }
        #${uuid}lower {
          position: absolute;
          top:-2px;
          height:calc(100% + 4px);
          left:-4px;
          width:calc(100% + 8px);
          display:block;
          z-index: 0;
          fill:${node.background};
        }
        ${
          node.backgroundDarkMode
            ? `.dark #${uuid}lower {
          fill: ${node.backgroundDarkMode} !important;
        }`
            : ''
        }
        #${uuid}upper {
        position: absolute;
        display: block;
        top:-2px;
        right:-4px;
        height: calc(100% + 4px);
        width: calc(100% + 8px);
        background: inherit;
        z-index: 1;
          ${!node.sync && `animation: ${uuid} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) both 1s;`}
        }
         </style>`;
        str += `<span style="position:relative;background:inherit;color:inherit;padding: 0 4px 0 4px;display:inline-flex;justify-content:center;white-space:nowrap;"><span style="position:relative;background:transparent;color:inherit;z-index:2;white-space:nowrap;">${children}</span><span id="${uuid}lower">${combinedHighlightSVGString}</span><span ${
          node.sync &&
          `data-sync="1" data-synctimestamp="${node.timeStamp}" data-syncenter='{"animation": "${uuid} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) both"}' data-syncleave='{"animation": "${uuid}2 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) both"}'`
        } id="${uuid}upper"></span></span></span>`;
      } else if (node.sync) {
        str += `<style>
        #${uuid}lower {
          position: absolute;
          top:-2px;
          height:calc(100% + 4px);
          left:-4px;
          width:calc(100% + 8px);
          display:block;
          z-index: 0;
          fill:${node.background};
        }
        ${
          node.backgroundDarkMode
            ? `.dark #${uuid}lower {
          fill: ${node.backgroundDarkMode}
        }`
            : ''
        }
        #${uuid}upper {
        position: absolute;
        display: block;
        top:-2px;
        right:-4px;
        height: calc(100% + 4px);
        width: calc(100% + 8px);
        background: inherit;
        z-index: 1;
        }
         </style>`;
        str += `<span style="position:relative;background:inherit;color:inherit;padding: 0 4px 0 4px;display:inline-flex;justify-content:center;white-space:nowrap;"><span style="position:relative;background:transparent;color:inherit;z-index:2;white-space: nowrap;">${children}</span><span id="${uuid}lower">${combinedHighlightSVGString}</span><span
              data-sync="1" data-synctimestamp="${node.timeStamp}" data-syncenter='{"width": "0"}' data-syncleave='{"width": "calc(100% + 8px)"}'
            id="${uuid}upper"></span></span></span>`;
      } else {
        str += `<style>
         #${uuid}lower {
           position: absolute;
           top:-2px;
           height:calc(100% + 4px);
           left:-4px;
           width:calc(100% + 8px);
           display:block;
           z-index: 0;
           fill:${node.background};
         }
         ${
           node.backgroundDarkMode
             ? `.dark #${uuid}lower {
          fill: ${node.backgroundDarkMode}
        }`
             : ''
         }
          </style>`;
        str += `<span style="position:relative;background:inherit;color:inherit;padding: 0 4px 0 4px;display:inline-flex;justify-content:center;white-space: nowrap;"><span style="background:transparent;color:inherit;position:relative;z-index:2;white-space: nowrap;">${children}</span><span id="${uuid}lower">${combinedHighlightSVGString}</span></span></span>`;
      }
      return str;
    }
    case 'markerColor': {
      const uuid = 'a' + uuidv4();
      return `<style>${
        node.colorDarkMode
          ? `.dark #${uuid} {
          color: ${node.colorDarkMode} !important;
        }`
          : ''
      }</style><span id="${uuid}" style="background:inherit;color: ${node.color};">${children}</span>`;
    }
    case 'line-break':
      return `<hr />`;
    case 'block-quote':
      return `<blockquote style="${style}">${children}</blockquote>`;
    case 'infoBlock':
      return `<style>.dark .infoBlock {
        border-color: rgb(96 165 250) !important;
        background-color: rgb(37 54 75) !important;
      }.dark .infoBlockSVG {
        stroke: rgb(96 165 250) !important;
      }</style><blockquote
          style="
            ${style}
            border-color: rgb(29 78 216);
            background-color: rgb(239 246 255);
            font-style: normal;
            padding-top: 1em;
            padding-bottom: 1em;
            border-radius: 6px;
          "
          class="infoBlock"
        >
          <div style="padding-bottom: 1em;">
          <svg class="infoBlockSVG" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(29 78 216)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
          </div>${children}</blockquote>`;

    case 'cautionBlock':
      return `<style>.dark .cautionBlock {
        border-color: rgb(234 179 8) !important;
        background-color: rgb(54 58 55) !important;
      }.dark .cautionBlockSVG {
        stroke: rgb(234 179 8) !important;
      }</style><blockquote
              style="
              ${style}
                border-color: rgb(133 77 14);
                background-color: rgb(254 252 232);
                font-style: normal;
                padding-top: 1em;
                padding-bottom: 1em;
                border-radius: 6px;
              "
              class="cautionBlock"
            >
              <div style="padding-bottom: 1em;">
              <svg class="cautionBlockSVG" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(133 77 14)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
              </div>${children}</blockquote>`;

    case 'warningBlock':
      return `<style>.dark .warningBlock {
        border-color: rgb(244 114 182) !important;
        background: rgb(54 49 67) !important
      }.dark .warningBlockSVG {
        stroke: rgb(244 114 182) !important;
      }</style><blockquote
                  style="
                  ${style}
                    border-color: rgb(190 24 93);
                    background-color: rgb(253 242 248);
                    font-style: normal;
                    padding-top: 1em;
                    padding-bottom: 1em;
                    border-radius: 6px;
                  "
                  class="warningBlock"
                >
                  <div style="padding-bottom: 1em;">
                  <svg class="warningBlockSVG" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(190 24 93)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                  </div>${children}</blockquote>`;
    // id="${plainTextSerialize(node.children).toLowerCase().replace(/\s+/g, '-')}
    case 'heading-one':
      return `<h1 style="${style}">${children}</h1>`;
    case 'heading-two':
      return `<h2 style="${style}">${children}</h2>`;
    case 'heading-three':
      return `<h3 style="${style}">${children}</h3>`;
    case 'heading-four':
      return `<h4 style="${style}">${children}</h4>`;
    case 'list-item':
      return `<li style="${style}"">${children}</li>`;
    case 'list-item-text':
      return `<span style="${style}">${children}/span>`;
    case 'numbered-list':
      return `<ol style="${style} listStylePosition: inside;">${children}</ol>`;
    case 'bulleted-list':
      return `<ul style="${style} listStylePosition: inside;">${children}</ul>`;
    case 'embed': {
      const height = node.embedHeight;
      const { url } = node;
      const caption = node.caption || '';
      let embedType = url ? (url.trim() === '' ? 'Blank' : 'Embed') : 'Blank';
      const parse = urlParser.parse(url || '');
      let parsedUrl = url;

      if (parse && parse.provider && parse.id) {
        embedType = parse.provider
          .split(' ')
          .map((seg) => seg.slice(0, 1).toUpperCase() + seg.slice(1))
          .join(' ');
        switch (parse.provider) {
          case 'youtube':
            parsedUrl = YOUTUBE_PREFIX + parse.id;
            break;
          case 'vimeo':
            parsedUrl = VIMEO_PREFIX + parse.id;
            break;
          case 'dailymotion':
            parsedUrl = DAILYMOTION_PREFIX + parse.id;
            break;
          case 'youku':
            parsedUrl = YOUKU_PREFIX + parse.id;
            break;
          case 'coub':
            parsedUrl = COUB_PREFIX + parse.id;
            break;
          default:
        }
      }

      const shouldDisplay = isUrl(parsedUrl);
      return `<div>
      <div
      style="
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem
      "
      >
      <style>.dark .embedContainer{
        border-color: #141a23 !important; 
      }</style><div class="embedContainer" style="
        width: 100%;
        
        object-fit: contain;
        ">
          <div style="
          ${height ? '' : 'aspect-ratio: 16 / 9;'}
          width: 100%;
          ${height ? `height: ${height}px` : ''}
          ">
            ${
              shouldDisplay
                ? `
              <iframe style="
              height: 100%;
              width: 100%;
              "
              class="iframeEmbed"
              allowTransparency
                allowFullScreen
                src="${parsedUrl}?title=0&byline=0&portrait=0"
                frameBorder="0"
              ></iframe>
            `
                : ''
            }
          </div>
        </div>

        ${
          caption
            ? `<div
        style="
            width: 100%;
            padding: 0.25rem;
            text-align: center;
            font-size: 0.875rem;
            line-height: 1.25rem;
            white-space: pre-line;
        "
        >${escapeHtml(caption)}</div>`
            : ''
        }
      </div>
    </div>`;
    }
    case 'link': {
      return `<a target="_blank" href=${node.url} style="
      ${style}
      word-break: break-all;
      ">${children}</a>`;
    }
    case 'image': {
      const height = node.imageHeight;
      const width = node.imageWidth;
      const caption = node.caption || '';
      return `<div style="${style}">
      <figure style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem
      ">
      <style>
      @media (max-width: 768px){
        .imageContainer {
          max-height: 50dvh !important;
        }
      }
      </style><img class="imageContainer" src="https://res.cloudinary.com/${CLOUDINARY_NAME}/image/upload/${node.public_id!}" 
      height="${height ? height : 400}"
      width="${width ? width : 400}"
      style="
      max-height: 100%;
      max-width: 100%;
      object-fit: contain;
      "/><figcaption style="
            width: 100%;
            text-align: center;
            white-space: pre-line;">${escapeHtml(caption)}</figcaption>
      </figure>
    </div>`;
    }
    case 'codeBlock': {
      const plainText = plainTextSerialize(node.children);
      let highlighted = await highlightShikiji({
        code: plainText,
        lang: node.language || 'plainText',
      });
      if (node.filename) {
        const endoftag = highlighted.indexOf('>') + 1;
        highlighted =
          highlighted.slice(0, endoftag) +
          `<div><p style="margin: 0px;">${escapeHtml(
            node.filename
          )}</p><hr style="margin: 0.5rem;border-color: rgb(156 163 175);"/></div>` +
          highlighted.slice(endoftag);
      }
      return `<div>
    ${highlighted}
  </div>`;
    }
    case 'quizBlock': {
      return `<div style="
      ${style}
      letter-spacing: 0.025em;
      margin-top: 1.25em;
      margin-bottom: 1.25em;
      background-color: inherit;
    color: inherit;
      "><form
        data-ans="${node.ans}"
        data-formname="${node.formName}"
        style="
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
        background-color: inherit;
    color: inherit;
    overflow: auto;
        padding-bottom: 8px;
        "
        class="quizBlock"
      >
        ${children}
        <style>
        .dark .formCheck {
          background-color: #2f3e52 !important;
        }
        </style><button
          style="
          border-radius: 0.5rem;
          background-color: rgb(31 41 55);
          padding-left: 1.5rem;
          padding-right: 1.5rem;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          color: rgb(247 247 247);
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          "
          class="formCheck"
        >
          Check
        </button>
        <div
        style="
          border-radius: 0.5rem;
          background-color: rgb(85 175 150);
          padding-left: 1.5rem;
          padding-right: 1.5rem;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          color: rgb(247 247 247);
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          display: none;
          "
          class="formCorrect"
        >
          Correct
        </div>
        <div style="display: none" class="formWrong">
          <div style="
          border-radius: 0.5rem;
          background-color: rgb(255 99 71);
          padding-left: 1.5rem;
          padding-right: 1.5rem;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          color: rgb(247 247 247);
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          display: inline-block;
          ">
            Wrong
          </div>
          <p style="
          margin: 0;
          padding-top: 0.25rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
          color: rgb(255 99 71);
          "></p>
        </div>
      </form>
    </div>`;
    }
    case 'quizOption': {
      const name = node.formName;
      const optionValue = node.optionValue;
      return `<button
      type="button"
      data-formname="${name}"
      style="
      ${style}
      display: flex;
      align-items: center;
      gap: 1rem;
      "
      class="quizOptionButton"
    >
      <input hidden style="display: none;" type="radio" name="${name}" value="${optionValue}" />
      <style>
      .dark .quizOptionContainer {
        background-color: rgb(247 247 247) !important;
      }
      .dark .quizOption {
        background-color: rgb(31 41 55) !important;
      }
      </style><div
        style="
        display: flex;
        height: 1rem;
        width: 1rem;
        align-items: center;
        justify-content: center;
        border-radius: 9999px;
        background-color: rgb(31 41 55);
        "
        class="quizOptionContainer"
      >
        <div style="height: 0.75rem;width: 0.75rem;border-radius: 9999px;background-color: rgb(247 247 247);" class="quizOption"></div>
      </div>
      <span class="optionText">${children}</span>
    </button>`;
    }
    case 'quizCodeBlock': {
      const width = node.inputWidth;
      const formName = node.formName;
      const combinedText = node.combinedText;
      const astLang = node.astLang;
      const isCode = node.isCode;
      const codeAns = encodeURIComponent(node.codeInput);
      return `<div style="
    margin-bottom: 1.25rem;
    margin-top: 1.25rem;
    background-color: inherit;
    color: inherit;
    "><form
        data-ans="${encodeURIComponent(JSON.stringify(node.ans))}"
        data-formname="${formName}"
        data-combinedtext="${combinedText}"
        data-astlang="${astLang}"
        data-iscode="${isCode ? '1' : '0'}"
        data-codeans="${codeAns}"
        class="quizCodeBlock"
        style="
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
        background-color: inherit;
        color: inherit;
        overflow: auto;
        padding-bottom: 8px;
        "
      >
        <div
          style="
          width: ${width}px;
          white-space: nowrap;
          background-color: inherit;
          vertical-align: middle;
          color: inherit;
          "
        >${
          isCode
            ? `<style>
            pre .quizCodeInput {
              background-color: rgb(247 247 247) !important;
              color: rgb(31 41 55) !important;
            }
            pre > code > div {
              padding-bottom: 0.5rem !important;
              margin-bottom: 0 !important;
            }
            pre > code > div:last-child {
              padding-bottom: 0 !important;
            }
          </style><pre style="
            margin: 0;
            width: 100%;
            overflow: auto;
            border-color: rgb(247 247 247);
            "><code style="border-color: inherit;">${children}</code></pre>`
            : `
              <style>
              .dark .formBody {
                background-color: #1f2937 !important;
                border-color: #2f3e52 !important;
              }
              </style><div style="
            margin: 0;
            width: 100%;
            overflow: auto;
            border-color: rgb(31 41 55);
            background-color: rgb(247 247 247);
            " class="formBody">
              ${children}
            </div>`
        }</div>
        <style>
        .dark .formCheck, .dark .formShow {
          background-color: #2f3e52 !important;
        }
        </style><div class="
        display: flex;
        align-items: center;
        gap: 0.75rem;
        ">
        <button
        style="
        border-radius: 0.5rem;
        background-color: rgb(31 41 55);
        padding-left: 1.5rem;
        padding-right: 1.5rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        color: rgb(247 247 247);
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        "
        class="formCheck"
        >
          Check
        </button>
        <div
        style="
        border-radius: 0.5rem;
        background-color: rgb(85 175 150);
        padding-left: 1.5rem;
        padding-right: 1.5rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        color: rgb(247 247 247);
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        display: none;
        "
        class="formCorrect"
        >
          Correct
        </div>
        <div style="display: none" class="formWrong">
          <div style="
          border-radius: 0.5rem;
          background-color: rgb(255 99 71);
          padding-left: 1.5rem;
          padding-right: 1.5rem;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          color: rgb(247 247 247);
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          display: inline-block;
          ">
            Wrong
          </div>
          <p style="
          margin: 0;
          padding-top: 0.25rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
          color: rgb(255 99 71);
          "></p>
        </div>
        <button
        style="
        border-radius: 0.5rem;
        background-color: rgb(31 41 55);
        padding-left: 1.5rem;
        padding-right: 1.5rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        color: rgb(247 247 247);
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        "
        class="formShow"
        type="button"
        >
          Show Ans
        </button>
        <p style="
          margin: 0;
          padding-top: 0.25rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
          color: rgb(255 99 71);
          display: none;
          white-space: break-spaces;
          " class="answerContainer"></p>
        </div>
      </form>
    </div>`;
    }
    case 'quizCodeParagraph': {
      return `<div style="
      border-color: inherit;
      background-color: inherit;
      color: inherit;
      margin-bottom:8px;
      white-space: break-spaces;
      ">${children}</div>`;
    }
    case 'quizCodeInput': {
      const width = node.inputWidth;
      const name = node.formName;
      const number = node.inputNumber;
      const id = node.inputId; // should use data-id to store since inputId may start with a number and an id that starts with a number is not a valid id
      return `<div
      data-formname="${name}"
      data-inputnumber="${number}"
      data-id="${id}"
      style="
      display: inline-block;
      border-color: inherit;
      background-color: inherit;
      padding-left: 0.5rem;
  padding-right: 0.5rem;
  vertical-align: middle;
  color: inherit;
      "
    ><div
      class="quizCodeInput"
        style="
        width: ${width}px;
        display: inline-block;
        border-radius: 0.375rem;
        border-width: 2px;
        border-color: inherit;
        background-color: inherit;
        vertical-align: middle;
        color: inherit;
        overflow: hidden;
        "
      ><input
          name="${id}"
          type="text"
          style="
          display: inline-block;
          width: 100%;
          border-style: none;
          border-color: inherit;
          background-color: inherit;
          padding-left: 0.5rem;
  padding-right: 0.5rem;
  color: inherit;
  outline: 2px solid transparent;
  outline-offset: 2px;
          "
        /></div></div>`;
    }
    default:
      return `<p style="${style}">${children}</p>`;
  }
};

export default serialize;
