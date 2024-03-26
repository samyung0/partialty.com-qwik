/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

import db from 'mime-db';
const extname = (path: string) => path.split('.').pop() ?? '';

/**
 * Module variables.
 * @private
 */

const EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
const TEXT_TYPE_REGEXP = /^text\//i;

const extensions = Object.create(null);
const types = Object.create(null);

// Populate the extensions/types maps
populateMaps(extensions, types);

/**
 * Get the default charset for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function charset(type: string) {
  // TODO: use media-typer
  const match = EXTRACT_TYPE_REGEXP.exec(type);
  const mime = match && db[match[1].toLowerCase()];

  if (mime && mime.charset) {
    return mime.charset;
  }

  // default text/* to utf-8
  if (match && TEXT_TYPE_REGEXP.test(match[1])) {
    return 'UTF-8';
  }

  return false;
}

/**
 * Create a full Content-Type header given a MIME type or extension.
 *
 * @param {string} str
 * @return {boolean|string}
 */

export function contentType(str: string) {
  let mime = str.indexOf('/') === -1 ? lookup(str) : str;

  if (!mime) {
    return false;
  }

  // TODO: use content-type or other module
  if (mime.indexOf('charset') === -1) {
    const _charset = charset(mime);
    if (_charset) mime += '; charset=' + _charset.toLowerCase();
  }

  return mime;
}

/**
 * Get the default extension for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function extension(type: string) {
  // TODO: use media-typer
  const match = EXTRACT_TYPE_REGEXP.exec(type);

  // get extensions
  const exts = match && extensions[match[1].toLowerCase()];

  if (!exts || !exts.length) {
    return false;
  }

  return exts[0];
}

/**
 * Lookup the MIME type for a file path/extension.
 *
 * @param {string} path
 * @return {boolean|string}
 */

function lookup(path: string) {
  // get the extension ("ext" or ".ext" or full path)
  const extension = extname('x.' + path).toLowerCase();

  if (!extension) {
    return false;
  }

  return types[extension] || false;
}

/**
 * Populate the extensions and types maps.
 * @private
 */

function populateMaps(extensions: any, types: any) {
  // source preference (least -> most)
  const preference = ['nginx', 'apache', undefined, 'iana'];

  Object.keys(db).forEach(function forEachMimeType(type) {
    const mime = db[type];
    const exts = mime.extensions;

    if (!exts || !exts.length) {
      return;
    }

    // mime -> extensions
    extensions[type] = exts;

    // extension -> mime
    for (let i = 0; i < exts.length; i++) {
      const extension = exts[i];

      if (types[extension]) {
        const from = preference.indexOf(db[types[extension]].source);
        const to = preference.indexOf(mime.source);

        if (
          types[extension] !== 'application/octet-stream' &&
          (from > to || (from === to && types[extension].substr(0, 12) === 'application/'))
        ) {
          // skip the remapping
          continue;
        }
      }

      // set the extension -> mime
      types[extension] = type;
    }
  });
}
