import binaryExtensions from "binary-extensions";
const extensions = new Set(binaryExtensions);

export interface Tree {
  [x: string]:
    | {
        file: {
          contents: any;
        };
      }
    | {
        directory: Tree;
      };
}

export interface FileStore extends Entry {}

export interface Entry {
  name: string;
  path: string; // always start with a slash
  data: string | number[]; // convert Uint8Array to array since qwik does not serialize Uint8Array
  isBinary: boolean;
  isFolder: boolean;
  entries: Entry[];
  discrepancy: boolean;
}

export const isBinary = (path: string) => extensions.has(getFileExtension(path));

export const getFileExtension = (path: string) => (path.split(".").pop() ?? "").toLowerCase();

export const getEntriesFromPath = (entries: Entry[], path: string): Entry[] => {
  if (path === "") return entries;
  const nextIndex = path.indexOf("/", 1);
  const name = path.slice(1, nextIndex);
  const remain = nextIndex > 0 ? path.slice(nextIndex) : "";
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].name === name) {
      if (remain === "") return entries;
      else return getEntriesFromPath(entries[i].entries, remain);
    }
  }
  return entries;
};

export const removeFileTree = (entries: Entry[], path: string): Entry[] => {
  const lastIndex = path.lastIndexOf("/");
  const name = path.slice(lastIndex + 1);
  const parentEntries = getEntriesFromPath(entries, path.slice(0, lastIndex));
  for (let i = 0; i < parentEntries.length; i++) {
    if (parentEntries[i].name === name) {
      parentEntries.splice(i, 1);
      return parentEntries;
    }
  }
  return entries;
};

export const removeFolderTree = (entries: Entry[], path: string): Entry[] => {
  if (path === "") return entries;
  const nextIndex = path.indexOf("/", 1);
  const name = path.slice(1, nextIndex > 0 ? nextIndex : path.length);
  const remain = nextIndex > 0 ? path.slice(nextIndex) : "";
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].name === name && entries[i].isFolder) {
      if (remain !== "") return removeFolderTree(entries[i].entries, remain);
      else {
        entries.splice(i, 1);
        return entries;
      }
    }
  }
  return entries;
};

export const addFolderTree = (entries: Entry[], path: string, prevPath: string = ""): Entry[] => {
  if (path === "") return entries;
  const nextIndex = path.indexOf("/", 1);
  const name = path.slice(1, nextIndex > 0 ? nextIndex : path.length);
  if (name === "") return entries;
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].name === name)
      return nextIndex > 0
        ? addFolderTree(entries[i].entries, path.slice(nextIndex), prevPath + "/" + name)
        : entries[i].entries;
  }

  const entry: Entry = {
    data: "",
    entries: [],
    isBinary: false,
    isFolder: true,
    name: name,
    discrepancy: false,
    path: prevPath + "/" + name,
  };
  entries.push(entry);

  return nextIndex > 0
    ? addFolderTree(entry.entries, path.slice(nextIndex), prevPath + "/" + name)
    : entries;
};

export const addFileTree = (entries: Entry[], path: string): Entry[] => {
  const lastIndex = path.lastIndexOf("/");
  const name = path.slice(lastIndex + 1);
  if (name === "") return entries;
  const retEntries = addFolderTree(entries, path.slice(0, lastIndex));
  for (let i = 0; i < retEntries.length; i++) if (retEntries[i].name === name) return entries;
  const entry: Entry = {
    data: "",
    entries: [],
    isBinary: isBinary(name),
    isFolder: false,
    discrepancy: false,
    name: name,
    path: path,
  };
  retEntries.push(entry);

  return entries;
};

export const base64ToArrayBuffer = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const validateFilePath = (path: string) => {
  // check for both windows and unix
  // Reference: https://github.com/microsoft/vscode/blob/61a18c284feebe3c6ba98b134c2e30c1baa869fb/src/vs/base/common/extpath.ts
  const WINDOWS_INVALID_FILE_CHARS = /[\\/:*?"<>|]/g;
  const UNIX_INVALID_FILE_CHARS = /[\\/]/g;
  const WINDOWS_FORBIDDEN_NAMES = /^(con|prn|aux|clock\$|nul|lpt[0-9]|com[0-9])(\.(.*?))?$/i;
  // const invalidFileChars = isWindowsOS ? WINDOWS_INVALID_FILE_CHARS : UNIX_INVALID_FILE_CHARS;

  if (!path || path.length === 0 || /^\s+$/.test(path)) {
    return [false, "Gimme a name would you?"]; // require a path that is not just whitespace
  }

  WINDOWS_INVALID_FILE_CHARS.lastIndex = 0; // the holy grail of software development
  if (WINDOWS_INVALID_FILE_CHARS.test(path)) {
    return [false, "The name contains invalid characters!"]; // check for certain invalid file characters
  }

  UNIX_INVALID_FILE_CHARS.lastIndex = 0;
  if (UNIX_INVALID_FILE_CHARS.test(path)) {
    return [false, "The name contains invalid characters!"];
  }

  if (WINDOWS_FORBIDDEN_NAMES.test(path)) {
    return [false, "Please choose another name!"]; // check for certain invalid file paths
  }

  // unnecessary test, file ending with a dot is already tested
  // if (path === "." || path === "..") {
  //   return [false, "The file name cannot be . or .. !"]; // check for reserved values
  // }

  if (path[path.length - 1] === ".") {
    return [false, "The name cannot end with a dot!"]; // Windows: file cannot end with a "."
  }

  if (path.length !== path.trim().length) {
    return [false, "The name cannot start or end with spaces!"]; // Windows: file cannot end with a whitespace
  }

  if (path.length > 255) {
    return [false, "The name is too long!"]; // most file systems do not allow files > 255 length
  }

  return [true, ""];
};
