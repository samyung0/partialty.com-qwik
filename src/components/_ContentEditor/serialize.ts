import escapeHtml from "escape-html";
import { Node, Text } from "slate";

import urlParser from "js-video-url-parser";
import { isUrl } from "~/utils/isUrl";

import { v4 as uuidv4 } from "uuid";

const YOUTUBE_PREFIX = "https://www.youtube.com/embed/";
const VIMEO_PREFIX = "https://player.vimeo.com/video/";
const DAILYMOTION_PREFIX = "https://www.dailymotion.com/embed/video/";
const YOUKU_PREFIX = "https://player.youku.com/embed/";
const COUB_PREFIX = "https://coub.com/embed/";

import highlightSVGString from "~/components/_ContentEditor/highlightSVGString";
import { CLOUDINARY_NAME } from "~/const/cloudinary";
import { highlightShikiji } from "~/utils/shikiji/renderIndexCodeBlock";

const combinedHighlightSVGString = highlightSVGString;

const plainTextSerialize = (nodes: any) => {
  return nodes.map((n: any) => Node.string(n)).join("\n");
};

const serialize = async (node: any, initial: boolean = false): Promise<string> => {
  if (!node) return "";
  if (initial)
    return `${node ? (await Promise.all(node.map((n: any) => serialize(n)))).join("") : "&nbsp;"}`;

  if (Text.isText(node)) {
    let string = escapeHtml(node.text);
    const style = "background-color:inherit;color:inherit";
    if (node.bold) {
      string = `<strong style="${style}">${string}</strong>`;
    }

    if (node.code) {
      string = `<code style="${style}">${string}</code>`;
    }

    if (node.italic) {
      string = `<em style="${style}">${string}</em>`;
    }

    if (node.underline) {
      let str = "";
      const uuid = "a" + uuidv4();
      if (node.animate) {
        str += `
       <style>
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
          height:6px;
          width:100%;
          display:block;
          background:${node.underline};
          z-index: 0;
      }
    #${uuid}upper {
        position: absolute;
          display: block;
          top:100%;
          right:0;
          height: 6px;
          width: 100%;
          background: inherit;
          z-index: 1;
          ${!node.sync && `animation: ${uuid} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) both;`}
      }
       </style>
       `;
        str += `<span style="position:relative;background:inherit;color:inherit;">
           ${string}
           <span id="${uuid}lower"></span>
           <span ${
             node.sync &&
             `data-sync="1" data-synctimestamp="${node.timeStamp}" data-syncenter='{"animation": "${uuid} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) both"}' data-syncleave='{"animation": "${uuid}2 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) both"}'`
           } id="${uuid}upper"></span>
         </span>`;
      } else if (node.sync) {
        str += `
       <style>
      #${uuid}lower {
        position: absolute;
          top:100%;
          left:0;
          height:6px;
          width:100%;
          display:block;
          background:${node.underline};
          z-index: 0;
      }
    #${uuid}upper {
        position: absolute;
          display: block;
          top:100%;
          right:0;
          height: 6px;
          width: 100%;
          background: inherit;
          z-index: 1;
      }
       </style>
       `;
        str += `<span style="position:relative;background:inherit;color:inherit;">
           ${string}
           <span id="${uuid}lower"></span>
           <span data-sync="1" data-synctimestamp="${node.timeStamp}" data-syncenter='{"width": "0"}' data-syncleave='{"width": "100%"}' id="${uuid}upper"></span>
         </span>`;
      } else {
        str += `
       <style>
      #${uuid}lower {
        position: absolute;
          top:100%;
          left:0;
          height:6px;
          width:100%;
          display:block;
          background:${node.underline};
          z-index: 0;
      }
       </style>
       `;
        str += `<span style="position:relative;background:inherit;color:inherit;">
           ${string}
           <span id="${uuid}lower"></span>
         </span>`;
      }
      string = str;
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

    if (node.background) {
      let str = "";
      const uuid = "a" + uuidv4();
      if (node.animate) {
        str += `
       <style>
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
      #${uuid}upper {
      position: absolute;
      display: block;
      top:-2px;
      right:-4px;
      height: calc(100% + 4px);
      width: calc(100% + 8px);
      background: inherit;
      z-index: 1;
        ${!node.sync && `animation: ${uuid} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) both;`}
      }
       </style>
       `;
        str += `<span style="position:relative;background:inherit;color:inherit;padding: 0 4px 0 4px;display:inline-flex;justify-content:center;white-space:nowrap;">
          <span style="position:relative;background:transparent;color:inherit;z-index:2;white-space:nowrap;">${string}</span>
          <span id="${uuid}lower">${combinedHighlightSVGString}</span>
          <span ${
            node.sync &&
            `data-sync="1" data-synctimestamp="${node.timeStamp}" data-syncenter='{"animation": "${uuid} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) both"}' data-syncleave='{"animation": "${uuid}2 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) both"}'`
          } id="${uuid}upper"></span>
         </span>
         </span>`;
      } else if (node.sync) {
        str += `
        <style>
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
       </style>
       `;
        str += `<span style="position:relative;background:inherit;color:inherit;padding: 0 4px 0 4px;display:inline-flex;justify-content:center">
          <span style="position:relative;background:transparent;color:inherit;z-index:2">${string}</span>
          <span id="${uuid}lower">${combinedHighlightSVGString}</span>
          <span
            data-sync="1" data-synctimestamp="${node.timeStamp}" data-syncenter='{"width": "0"}' data-syncleave='{"width": "calc(100% + 8px)"}'
          id="${uuid}upper"></span>
         </span>
         </span>
        `;
      } else {
        str += `
        <style>
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
        </style>
        `;
        str += `<span style="position:relative;background:inherit;color:inherit;padding: 0 4px 0 4px;display:inline-flex;justify-content:center;">
          <span style="background:transparent;color:inherit;position:relative;z-index:2">${string}</span>
          <span id="${uuid}lower">${combinedHighlightSVGString}</span>
          </span>
          </span>`;
      }
      string = str;
    }

    if (node.color) {
      string = `<span style="background:inherit;color: ${node.color};">${string}</span>`;
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

  let children = node.children
    ? (await Promise.all(node.children.map((n: any) => serialize(n)))).join("")
    : "";

  if (children.trim() === "") children = "&nbsp;";

  const style = `text-align: ${
    node.align || "left"
  };background-color:inherit;color:inherit;` as const;
  switch (node.type) {
    case "paragraph":
      return `<p style="${style}">${children}</p>`;
    case "line-break": return `<hr />`;
    case "block-quote":
      return `<blockquote style="${style}">
          ${children}
        </blockquote>`;
    case "infoBlock":
      return `<blockquote
          style="

            border-color: #72cada;
            background-color: #e3f4f8;
            font-style: normal;
            padding-top: 1em;
            padding-bottom: 1em;
            border-radius: 6px;
          "
        >
          <div style="padding-bottom: 1em;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#72cada" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
          </div>
          ${children}
        </blockquote>`;

    case "cautionBlock":
      return `<blockquote
              style="
                border-color: #fcd34d;
                background-color: #fef6db;
                font-style: normal;
                padding-top: 1em;
                padding-bottom: 1em;
                border-radius: 6px;
              "
            >
              <div style="padding-bottom: 1em;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fcd34d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
              </div>
              ${children}
            </blockquote>`;

    case "warningBlock":
      return `<blockquote
                  style="
                    border-color: #ff6347;
                    background-color: #ffe0da;
                    font-style: normal;
                    padding-top: 1em;
                    padding-bottom: 1em;
                    border-radius: 6px;
                  "
                >
                  <div style="padding-bottom: 1em;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6347" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                  </div>
                  ${children}
                </blockquote>`;

    case "heading-one":
      return `<h1 style="${style}">
          ${children}
        </h1>`;
    case "heading-two":
      return `<h2 style="${style}">
          ${children}
        </h2>`;
    case "heading-three":
      return `<h3 style="${style}">
          ${children}
        </h3>`;
    case "heading-four":
      return `<h4 style="${style}">
          ${children}
        </h4>`;
    case "list-item":
      return `<li style="${style}">
          ${children}
        </li>`;
    case "list-item-text":
      return `<span style="${style}">
          ${children}
        </span>`;
    case "numbered-list":
      return `<ol style="${style} listStylePosition: inside;">
          ${children}
        </ol>`;
    case "bulleted-list":
      return `<ul style="${style} listStylePosition: inside;">
          ${children}
        </ul>`;
    case "embed": {
      const height = node.embedHeight;
      const { url } = node;
      const caption = node.caption || "";
      let embedType = url ? (url.trim() === "" ? "Blank" : "Embed") : "Blank";
      const parse = urlParser.parse(url || "");
      let parsedUrl = url;

      if (parse && parse.provider && parse.id) {
        embedType = parse.provider
          .split(" ")
          .map((seg) => seg.slice(0, 1).toUpperCase() + seg.slice(1))
          .join(" ");
        switch (parse.provider) {
          case "youtube":
            parsedUrl = YOUTUBE_PREFIX + parse.id;
            break;
          case "vimeo":
            parsedUrl = VIMEO_PREFIX + parse.id;
            break;
          case "dailymotion":
            parsedUrl = DAILYMOTION_PREFIX + parse.id;
            break;
          case "youku":
            parsedUrl = YOUKU_PREFIX + parse.id;
            break;
          case "coub":
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
      }</style>
        <div class="embedContainer" style="
        width: 100%;
        
        object-fit: contain;
        ">
          <div style="
          ${height ? "" : "aspect-ratio: 16 / 9;"}
          width: 100%;
          ${height ? `height: ${height}px` : ""}
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
                : ""
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
            : ""
        }
      </div>
    </div>`;
    }
    case "link": {
      return `<a target="_blank" href=${node.url} style="
      ${style}
      ">${children}</a>`;
    }
    case "image": {
      const caption = node.caption || "";
      return `<div style="${style}">
      <figure style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem
      ">
        <img width={400} height={400} src="https://res.cloudinary.com/${CLOUDINARY_NAME}/image/upload/${node.public_id!}" style="
        max-height: 400px;
        object-fit: contain;
        "/>
        <p
          style="
            width: 100%;
            padding: 0.25rem;
            text-align: center;
            font-size: 0.875rem;
            line-height: 1.25rem;
            white-space: pre-line;
          "
        >${escapeHtml(caption)}</p>
      </figure>
    </div>`;
    }
    case "codeBlock": {
      const plainText = plainTextSerialize(node.children);
      let highlighted = await highlightShikiji({
        code: plainText,
        lang: node.language || "plainText",
      });
      if (node.filename) {
        const endoftag = highlighted.indexOf(">") + 1;
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
    case "quizBlock": {
      return `<div style="
      ${style}
      letter-spacing: 0.025em;
      margin-top: 1.25em;
      margin-bottom: 1.25em;
      background-color: inherit;
    color: inherit;
      ">
      <h3 style="margin-bottom: 0.75rem; margin-top: 0px; background-color: inherit;
      color: inherit;">
        ${node.quizTitle}
      </h3>
      <form
        data-ans="${node.ans}"
        data-formname="${node.formName}"
        style="
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
        background-color: inherit;
    color: inherit;
        "
        class="quizBlock"
      >
        ${children}
        <style>
        .dark .formCheck {
          background-color: #2f3e52 !important;
        }
        </style>
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
      </form>
    </div>`;
    }
    case "quizOption": {
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
      <div
        style="
        display: flex;
        height: 1rem;
        width: 1rem;
        align-items: center;
        justify-content: center;
        border-radius: 9999px;
        background-color: rgb(31 41 55);
        "
      >
        <div style="height: 0.75rem;width: 0.75rem;border-radius: 9999px;background-color: rgb(247 247 247);" class="quizOption"></div>
      </div>
      <span class="optionText">${children}</span>
    </button>`;
    }
    case "quizCodeBlock": {
      const width = node.inputWidth;
      const formName = node.formName;
      const combinedText = node.combinedText;
      const astLang = node.astLang;
      const isCode = node.isCode;
      return `<div style="
    margin-bottom: 1.25rem;
    margin-top: 1.25rem;
    background-color: inherit;
    color: inherit;
    ">
      <h3 style="
      margin-bottom: 0.75rem
      margin-top: 0;
      background-color: inherit;
      color: inherit;
      ">
        ${node.quizTitle}
      </h3>
      <form
        data-ans="${encodeURIComponent(JSON.stringify(node.ans))}"
        data-formname="${formName}"
        data-combinedtext="${combinedText}"
        data-astlang="${astLang}"
        data-isCode="${isCode ? "1" : "0"}"
        class="quizCodeBlock"
        style="
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
        background-color: inherit;
        color: inherit;
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
              </style>
              <div style="
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
        .dark .formCheck {
          background-color: #2f3e52 !important;
        }
        </style>
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
      </form>
    </div>`;
    }
    case "quizCodeParagraph": {
      return `<div style="
      border-color: inherit;
      background-color: inherit;
      color: inherit;
      margin-bottom:8px;
      ">${children}</div>`;
    }
    case "quizCodeInput": {
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
