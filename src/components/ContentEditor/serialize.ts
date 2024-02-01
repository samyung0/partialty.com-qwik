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

import highlightSVGString from "~/components/ContentEditor/highlightSVGString";
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
    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }

    if (node.code) {
      string = `<code>${string}</code>`;
    }

    if (node.italic) {
      string = `<em>${string}</em>`;
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
          width: 10%;
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
          z-index: -2;
      }
    #${uuid}upper {
        position: absolute;
          display: block;
          top:100%;
          right:0;
          height: 6px;
          width: 100%;
          background: inherit;
          z-index: -1;
          ${!node.sync && `animation: ${uuid} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) both;`}
      }
       </style>
       `;
        str += `<span style="position:relative;background:inherit;">
           ${string}
           <span id="${uuid}lower"></span>
           <span ${
             node.sync &&
             `data-sync="1" data-synctimestamp="${node.timeStamp}" data-syncenter='{"animation": "${uuid} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) both"}' data-syncleave='{"animation": "${uuid}2 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) both"}'`
           } id="${uuid}upper"></span>
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
          z-index: -2;
      }
       </style>
       `;
        str += `<span style="position:relative;">
           ${string}
           <span id="${uuid}lower"></span>
         </span>`;
      }
      string = str;
    }

    if (node.strikethrough) {
      string = `<del>${string}</del>`;
    }

    if (node.superscript) {
      string = `<sup>${string}</sup>`;
    }

    if (node.subscript) {
      string = `<sub>${string}</sub>`;
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
        str += `<span style="position:relative;background:inherit;padding: 0 4px 0 4px;display:inline-flex;justify-content:center">
          <span style="position:relative;z-index:2">${string}</span>
          <span id="${uuid}lower">${combinedHighlightSVGString}</span>
          <span ${
            node.sync &&
            `data-sync="1" data-synctimestamp="${node.timeStamp}" data-syncenter='{"animation": "${uuid} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) both"}' data-syncleave='{"animation": "${uuid}2 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) both"}'`
          } id="${uuid}upper"></span>
         </span>
         </span>`;
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
        str += `<span style="position:relative;background:inherit;padding: 0 4px 0 4px;display:inline-flex;justify-content:center;">
          <span style="position:relative;z-index:2">${string}</span>
          <span id="${uuid}lower">${combinedHighlightSVGString}</span>
          </span>
          </span>`;
      }
      string = str;
    }

    if (node.color) {
      string = `<span style="color: ${node.color};">${string}</span>`;
    }

    if (node.fontSize) {
      string = `<span style="font-size: ${node.fontSize}px;">${string}</span>`;
    }

    if (node.fontFamily) {
      string = `<span style="font-family: ${node.fontFamily};">${string}</span>`;
    }

    if (node.fontSpacing) {
      string = `<span style="letter-spacing: ${node.fontSpacing}px;">${string}</span>`;
    }
    return string;
  }

  let children = node.children
    ? (await Promise.all(node.children.map((n: any) => serialize(n)))).join("")
    : "";

  if (children.trim() === "") children = "&nbsp;";

  const style = `text-align: ${node.align || "left"};background-color:inherit;` as const;
  switch (node.type) {
    case "paragraph":
      return `<p style="${style}">
          ${children}
        </p>`;
    case "block-quote":
      return `<blockquote style="${style}">
          ${children}
        </blockquote>`;
    case "infoBlock":
      return `<blockquote
          style="
            ${style}
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
                ${style}
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
                    ${style}
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
        <div style="
        width: 100%;
        border-width: 2px;
        border-color: rgb(114 202 218);
        object-fit: contain;
        ">
          <div style="
          background-color: rgb(227 244 248);
          padding: 0.5rem;
          font-family: mosk, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
          font-size: 0.875rem;
          line-height: 1.25rem;
          font-weight: 700;
          letter-spacing: 0.025em;
          ">
            ${embedType}
          </div>
          <div style="
          aspect-ratio: 16 / 9;
          width: 100%;
          ">
            ${
              shouldDisplay &&
              `
              <iframe style="
              aspect-ratio: 16 / 9;
              width: 100%;
              "
                src="${parsedUrl}?title=0&byline=0&portrait=0"
                frameBorder="0"
              ></iframe>
            `
            }
          </div>
        </div>

        ${
          caption &&
          `<div
        style="
            width: 100%;
            padding: 0.25rem;
            text-align: center;
            font-size: 0.875rem;
            line-height: 1.25rem;
            white-space: pre-line;
        "
        >${escapeHtml(caption)}</div>`
        }
      </div>
      ${children}
    </div>`;
    }
    case "link": {
      return `<a target="_blank" href=${node.url} style="
      ${style}
      "><span style="font-size: 0;">
    ${String.fromCodePoint(160)}
  </span>${children}<span style="font-size: 0;">
    ${String.fromCodePoint(160)}
  </span></a>`;
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
        <img src="https://res.cloudinary.com/${CLOUDINARY_NAME}/image/upload/${node.public_id!}" style="
        max-height: 400px;
        border-width: 2px;
        border-color: rgb(111 220 191);
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
      return `<div">
    ${highlighted}
  </div>`;
    }
    default:
      return `<p style="${style}">
          ${children}
        </p>`;
  }
};

export default serialize;
