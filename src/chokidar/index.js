(() => {
  var __webpack_modules__ = {
    575: (t, e, s) => {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: true });
      const r = s(569);
      const i = s(388);
      const n = "!";
      const o = { returnIndex: false };
      const arrify = (t) => (Array.isArray(t) ? t : [t]);
      const createPattern = (t, e) => {
        if (typeof t === "function") {
          return t;
        }
        if (typeof t === "string") {
          const s = r(t, e);
          return (e) => t === e || s(e);
        }
        if (t instanceof RegExp) {
          return (e) => t.test(e);
        }
        return (t) => false;
      };
      const matchPatterns = (t, e, s, r) => {
        const n = Array.isArray(s);
        const o = n ? s[0] : s;
        if (!n && typeof o !== "string") {
          throw new TypeError(
            "anymatch: second argument must be a string: got " + Object.prototype.toString.call(o)
          );
        }
        const a = i(o, false);
        for (let t = 0; t < e.length; t++) {
          const s = e[t];
          if (s(a)) {
            return r ? -1 : false;
          }
        }
        const l = n && [a].concat(s.slice(1));
        for (let e = 0; e < t.length; e++) {
          const s = t[e];
          if (n ? s(...l) : s(a)) {
            return r ? e : true;
          }
        }
        return r ? -1 : false;
      };
      const anymatch = (t, e, s = o) => {
        if (t == null) {
          throw new TypeError("anymatch: specify first argument");
        }
        const i = typeof s === "boolean" ? { returnIndex: s } : s;
        const a = i.returnIndex || false;
        const l = arrify(t);
        const u = l
          .filter((t) => typeof t === "string" && t.charAt(0) === n)
          .map((t) => t.slice(1))
          .map((t) => r(t, i));
        const c = l
          .filter((t) => typeof t !== "string" || (typeof t === "string" && t.charAt(0) !== n))
          .map((t) => createPattern(t, i));
        if (e == null) {
          return (t, e = false) => {
            const s = typeof e === "boolean" ? e : false;
            return matchPatterns(c, u, t, s);
          };
        }
        return matchPatterns(c, u, e, a);
      };
      anymatch.default = anymatch;
      t.exports = anymatch;
    },
    329: (t, e, s) => {
      t.exports = s(133);
    },
    610: (t, e, s) => {
      "use strict";
      const r = s(750);
      const i = s(434);
      const n = s(873);
      const o = s(477);
      const braces = (t, e = {}) => {
        let s = [];
        if (Array.isArray(t)) {
          for (let r of t) {
            let t = braces.create(r, e);
            if (Array.isArray(t)) {
              s.push(...t);
            } else {
              s.push(t);
            }
          }
        } else {
          s = [].concat(braces.create(t, e));
        }
        if (e && e.expand === true && e.nodupes === true) {
          s = [...new Set(s)];
        }
        return s;
      };
      braces.parse = (t, e = {}) => o(t, e);
      braces.stringify = (t, e = {}) => {
        if (typeof t === "string") {
          return r(braces.parse(t, e), e);
        }
        return r(t, e);
      };
      braces.compile = (t, e = {}) => {
        if (typeof t === "string") {
          t = braces.parse(t, e);
        }
        return i(t, e);
      };
      braces.expand = (t, e = {}) => {
        if (typeof t === "string") {
          t = braces.parse(t, e);
        }
        let s = n(t, e);
        if (e.noempty === true) {
          s = s.filter(Boolean);
        }
        if (e.nodupes === true) {
          s = [...new Set(s)];
        }
        return s;
      };
      braces.create = (t, e = {}) => {
        if (t === "" || t.length < 3) {
          return [t];
        }
        return e.expand !== true ? braces.compile(t, e) : braces.expand(t, e);
      };
      t.exports = braces;
    },
    434: (t, e, s) => {
      "use strict";
      const r = s(330);
      const i = s(207);
      const compile = (t, e = {}) => {
        let walk = (t, s = {}) => {
          let n = i.isInvalidBrace(s);
          let o = t.invalid === true && e.escapeInvalid === true;
          let a = n === true || o === true;
          let l = e.escapeInvalid === true ? "\\" : "";
          let u = "";
          if (t.isOpen === true) {
            return l + t.value;
          }
          if (t.isClose === true) {
            return l + t.value;
          }
          if (t.type === "open") {
            return a ? l + t.value : "(";
          }
          if (t.type === "close") {
            return a ? l + t.value : ")";
          }
          if (t.type === "comma") {
            return t.prev.type === "comma" ? "" : a ? t.value : "|";
          }
          if (t.value) {
            return t.value;
          }
          if (t.nodes && t.ranges > 0) {
            let s = i.reduce(t.nodes);
            let n = r(...s, { ...e, wrap: false, toRegex: true });
            if (n.length !== 0) {
              return s.length > 1 && n.length > 1 ? `(${n})` : n;
            }
          }
          if (t.nodes) {
            for (let e of t.nodes) {
              u += walk(e, t);
            }
          }
          return u;
        };
        return walk(t);
      };
      t.exports = compile;
    },
    774: (t) => {
      "use strict";
      t.exports = {
        MAX_LENGTH: 1024 * 64,
        CHAR_0: "0",
        CHAR_9: "9",
        CHAR_UPPERCASE_A: "A",
        CHAR_LOWERCASE_A: "a",
        CHAR_UPPERCASE_Z: "Z",
        CHAR_LOWERCASE_Z: "z",
        CHAR_LEFT_PARENTHESES: "(",
        CHAR_RIGHT_PARENTHESES: ")",
        CHAR_ASTERISK: "*",
        CHAR_AMPERSAND: "&",
        CHAR_AT: "@",
        CHAR_BACKSLASH: "\\",
        CHAR_BACKTICK: "`",
        CHAR_CARRIAGE_RETURN: "\r",
        CHAR_CIRCUMFLEX_ACCENT: "^",
        CHAR_COLON: ":",
        CHAR_COMMA: ",",
        CHAR_DOLLAR: "$",
        CHAR_DOT: ".",
        CHAR_DOUBLE_QUOTE: '"',
        CHAR_EQUAL: "=",
        CHAR_EXCLAMATION_MARK: "!",
        CHAR_FORM_FEED: "\f",
        CHAR_FORWARD_SLASH: "/",
        CHAR_HASH: "#",
        CHAR_HYPHEN_MINUS: "-",
        CHAR_LEFT_ANGLE_BRACKET: "<",
        CHAR_LEFT_CURLY_BRACE: "{",
        CHAR_LEFT_SQUARE_BRACKET: "[",
        CHAR_LINE_FEED: "\n",
        CHAR_NO_BREAK_SPACE: " ",
        CHAR_PERCENT: "%",
        CHAR_PLUS: "+",
        CHAR_QUESTION_MARK: "?",
        CHAR_RIGHT_ANGLE_BRACKET: ">",
        CHAR_RIGHT_CURLY_BRACE: "}",
        CHAR_RIGHT_SQUARE_BRACKET: "]",
        CHAR_SEMICOLON: ";",
        CHAR_SINGLE_QUOTE: "'",
        CHAR_SPACE: " ",
        CHAR_TAB: "\t",
        CHAR_UNDERSCORE: "_",
        CHAR_VERTICAL_LINE: "|",
        CHAR_ZERO_WIDTH_NOBREAK_SPACE: "\ufeff",
      };
    },
    873: (t, e, s) => {
      "use strict";
      const r = s(330);
      const i = s(750);
      const n = s(207);
      const append = (t = "", e = "", s = false) => {
        let r = [];
        t = [].concat(t);
        e = [].concat(e);
        if (!e.length) return t;
        if (!t.length) {
          return s ? n.flatten(e).map((t) => `{${t}}`) : e;
        }
        for (let i of t) {
          if (Array.isArray(i)) {
            for (let t of i) {
              r.push(append(t, e, s));
            }
          } else {
            for (let t of e) {
              if (s === true && typeof t === "string") t = `{${t}}`;
              r.push(Array.isArray(t) ? append(i, t, s) : i + t);
            }
          }
        }
        return n.flatten(r);
      };
      const expand = (t, e = {}) => {
        let s = e.rangeLimit === void 0 ? 1e3 : e.rangeLimit;
        let walk = (t, o = {}) => {
          t.queue = [];
          let a = o;
          let l = o.queue;
          while (a.type !== "brace" && a.type !== "root" && a.parent) {
            a = a.parent;
            l = a.queue;
          }
          if (t.invalid || t.dollar) {
            l.push(append(l.pop(), i(t, e)));
            return;
          }
          if (t.type === "brace" && t.invalid !== true && t.nodes.length === 2) {
            l.push(append(l.pop(), ["{}"]));
            return;
          }
          if (t.nodes && t.ranges > 0) {
            let o = n.reduce(t.nodes);
            if (n.exceedsLimit(...o, e.step, s)) {
              throw new RangeError(
                "expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit."
              );
            }
            let a = r(...o, e);
            if (a.length === 0) {
              a = i(t, e);
            }
            l.push(append(l.pop(), a));
            t.nodes = [];
            return;
          }
          let u = n.encloseBrace(t);
          let c = t.queue;
          let f = t;
          while (f.type !== "brace" && f.type !== "root" && f.parent) {
            f = f.parent;
            c = f.queue;
          }
          for (let e = 0; e < t.nodes.length; e++) {
            let s = t.nodes[e];
            if (s.type === "comma" && t.type === "brace") {
              if (e === 1) c.push("");
              c.push("");
              continue;
            }
            if (s.type === "close") {
              l.push(append(l.pop(), c, u));
              continue;
            }
            if (s.value && s.type !== "open") {
              c.push(append(c.pop(), s.value));
              continue;
            }
            if (s.nodes) {
              walk(s, t);
            }
          }
          return c;
        };
        return n.flatten(walk(t));
      };
      t.exports = expand;
    },
    477: (t, e, s) => {
      "use strict";
      const r = s(750);
      const {
        MAX_LENGTH: i,
        CHAR_BACKSLASH: n,
        CHAR_BACKTICK: o,
        CHAR_COMMA: a,
        CHAR_DOT: l,
        CHAR_LEFT_PARENTHESES: u,
        CHAR_RIGHT_PARENTHESES: c,
        CHAR_LEFT_CURLY_BRACE: f,
        CHAR_RIGHT_CURLY_BRACE: h,
        CHAR_LEFT_SQUARE_BRACKET: p,
        CHAR_RIGHT_SQUARE_BRACKET: d,
        CHAR_DOUBLE_QUOTE: _,
        CHAR_SINGLE_QUOTE: E,
        CHAR_NO_BREAK_SPACE: g,
        CHAR_ZERO_WIDTH_NOBREAK_SPACE: m,
      } = s(774);
      const parse = (t, e = {}) => {
        if (typeof t !== "string") {
          throw new TypeError("Expected a string");
        }
        let s = e || {};
        let R = typeof s.maxLength === "number" ? Math.min(i, s.maxLength) : i;
        if (t.length > R) {
          throw new SyntaxError(`Input length (${t.length}), exceeds max characters (${R})`);
        }
        let y = { type: "root", input: t, nodes: [] };
        let A = [y];
        let w = y;
        let b = y;
        let S = 0;
        let v = t.length;
        let C = 0;
        let x = 0;
        let T;
        let H = {};
        const advance = () => t[C++];
        const push = (t) => {
          if (t.type === "text" && b.type === "dot") {
            b.type = "text";
          }
          if (b && b.type === "text" && t.type === "text") {
            b.value += t.value;
            return;
          }
          w.nodes.push(t);
          t.parent = w;
          t.prev = b;
          b = t;
          return t;
        };
        push({ type: "bos" });
        while (C < v) {
          w = A[A.length - 1];
          T = advance();
          if (T === m || T === g) {
            continue;
          }
          if (T === n) {
            push({ type: "text", value: (e.keepEscaping ? T : "") + advance() });
            continue;
          }
          if (T === d) {
            push({ type: "text", value: "\\" + T });
            continue;
          }
          if (T === p) {
            S++;
            let t = true;
            let e;
            while (C < v && (e = advance())) {
              T += e;
              if (e === p) {
                S++;
                continue;
              }
              if (e === n) {
                T += advance();
                continue;
              }
              if (e === d) {
                S--;
                if (S === 0) {
                  break;
                }
              }
            }
            push({ type: "text", value: T });
            continue;
          }
          if (T === u) {
            w = push({ type: "paren", nodes: [] });
            A.push(w);
            push({ type: "text", value: T });
            continue;
          }
          if (T === c) {
            if (w.type !== "paren") {
              push({ type: "text", value: T });
              continue;
            }
            w = A.pop();
            push({ type: "text", value: T });
            w = A[A.length - 1];
            continue;
          }
          if (T === _ || T === E || T === o) {
            let t = T;
            let s;
            if (e.keepQuotes !== true) {
              T = "";
            }
            while (C < v && (s = advance())) {
              if (s === n) {
                T += s + advance();
                continue;
              }
              if (s === t) {
                if (e.keepQuotes === true) T += s;
                break;
              }
              T += s;
            }
            push({ type: "text", value: T });
            continue;
          }
          if (T === f) {
            x++;
            let t = (b.value && b.value.slice(-1) === "$") || w.dollar === true;
            let e = {
              type: "brace",
              open: true,
              close: false,
              dollar: t,
              depth: x,
              commas: 0,
              ranges: 0,
              nodes: [],
            };
            w = push(e);
            A.push(w);
            push({ type: "open", value: T });
            continue;
          }
          if (T === h) {
            if (w.type !== "brace") {
              push({ type: "text", value: T });
              continue;
            }
            let t = "close";
            w = A.pop();
            w.close = true;
            push({ type: t, value: T });
            x--;
            w = A[A.length - 1];
            continue;
          }
          if (T === a && x > 0) {
            if (w.ranges > 0) {
              w.ranges = 0;
              let t = w.nodes.shift();
              w.nodes = [t, { type: "text", value: r(w) }];
            }
            push({ type: "comma", value: T });
            w.commas++;
            continue;
          }
          if (T === l && x > 0 && w.commas === 0) {
            let t = w.nodes;
            if (x === 0 || t.length === 0) {
              push({ type: "text", value: T });
              continue;
            }
            if (b.type === "dot") {
              w.range = [];
              b.value += T;
              b.type = "range";
              if (w.nodes.length !== 3 && w.nodes.length !== 5) {
                w.invalid = true;
                w.ranges = 0;
                b.type = "text";
                continue;
              }
              w.ranges++;
              w.args = [];
              continue;
            }
            if (b.type === "range") {
              t.pop();
              let e = t[t.length - 1];
              e.value += b.value + T;
              b = e;
              w.ranges--;
              continue;
            }
            push({ type: "dot", value: T });
            continue;
          }
          push({ type: "text", value: T });
        }
        do {
          w = A.pop();
          if (w.type !== "root") {
            w.nodes.forEach((t) => {
              if (!t.nodes) {
                if (t.type === "open") t.isOpen = true;
                if (t.type === "close") t.isClose = true;
                if (!t.nodes) t.type = "text";
                t.invalid = true;
              }
            });
            let t = A[A.length - 1];
            let e = t.nodes.indexOf(w);
            t.nodes.splice(e, 1, ...w.nodes);
          }
        } while (A.length > 0);
        push({ type: "eos" });
        return y;
      };
      t.exports = parse;
    },
    750: (t, e, s) => {
      "use strict";
      const r = s(207);
      t.exports = (t, e = {}) => {
        let stringify = (t, s = {}) => {
          let i = e.escapeInvalid && r.isInvalidBrace(s);
          let n = t.invalid === true && e.escapeInvalid === true;
          let o = "";
          if (t.value) {
            if ((i || n) && r.isOpenOrClose(t)) {
              return "\\" + t.value;
            }
            return t.value;
          }
          if (t.value) {
            return t.value;
          }
          if (t.nodes) {
            for (let e of t.nodes) {
              o += stringify(e);
            }
          }
          return o;
        };
        return stringify(t);
      };
    },
    207: (t, e) => {
      "use strict";
      e.isInteger = (t) => {
        if (typeof t === "number") {
          return Number.isInteger(t);
        }
        if (typeof t === "string" && t.trim() !== "") {
          return Number.isInteger(Number(t));
        }
        return false;
      };
      e.find = (t, e) => t.nodes.find((t) => t.type === e);
      e.exceedsLimit = (t, s, r = 1, i) => {
        if (i === false) return false;
        if (!e.isInteger(t) || !e.isInteger(s)) return false;
        return (Number(s) - Number(t)) / Number(r) >= i;
      };
      e.escapeNode = (t, e = 0, s) => {
        let r = t.nodes[e];
        if (!r) return;
        if ((s && r.type === s) || r.type === "open" || r.type === "close") {
          if (r.escaped !== true) {
            r.value = "\\" + r.value;
            r.escaped = true;
          }
        }
      };
      e.encloseBrace = (t) => {
        if (t.type !== "brace") return false;
        if ((t.commas >> (0 + t.ranges)) >> 0 === 0) {
          t.invalid = true;
          return true;
        }
        return false;
      };
      e.isInvalidBrace = (t) => {
        if (t.type !== "brace") return false;
        if (t.invalid === true || t.dollar) return true;
        if ((t.commas >> (0 + t.ranges)) >> 0 === 0) {
          t.invalid = true;
          return true;
        }
        if (t.open !== true || t.close !== true) {
          t.invalid = true;
          return true;
        }
        return false;
      };
      e.isOpenOrClose = (t) => {
        if (t.type === "open" || t.type === "close") {
          return true;
        }
        return t.open === true || t.close === true;
      };
      e.reduce = (t) =>
        t.reduce((t, e) => {
          if (e.type === "text") t.push(e.value);
          if (e.type === "range") e.type = "text";
          return t;
        }, []);
      e.flatten = (...t) => {
        const e = [];
        const flat = (t) => {
          for (let s = 0; s < t.length; s++) {
            let r = t[s];
            Array.isArray(r) ? flat(r, e) : r !== void 0 && e.push(r);
          }
          return e;
        };
        flat(t);
        return e;
      };
    },
    677: (t, e, s) => {
      "use strict";
      const { EventEmitter: r } = s(361);
      const i = s(147);
      const n = s(17);
      const { promisify: o } = s(837);
      const a = s(556);
      const l = s(575)["default"];
      const u = s(547);
      const c = s(466);
      const f = s(610);
      const h = s(388);
      const p = s(335);
      const d = s(771);
      const {
        EV_ALL: _,
        EV_READY: E,
        EV_ADD: g,
        EV_CHANGE: m,
        EV_UNLINK: R,
        EV_ADD_DIR: y,
        EV_UNLINK_DIR: A,
        EV_RAW: w,
        EV_ERROR: b,
        STR_CLOSE: S,
        STR_END: v,
        BACK_SLASH_RE: C,
        DOUBLE_SLASH_RE: x,
        SLASH_OR_BACK_SLASH_RE: T,
        DOT_RE: H,
        REPLACER_RE: O,
        SLASH: P,
        SLASH_SLASH: L,
        BRACE_START: N,
        BANG: I,
        ONE_DOT: k,
        TWO_DOTS: $,
        GLOBSTAR: D,
        SLASH_GLOBSTAR: F,
        ANYMATCH_OPTS: M,
        STRING_TYPE: W,
        FUNCTION_TYPE: G,
        EMPTY_STR: B,
        EMPTY_FN: U,
        isWindows: K,
        isMacos: V,
        isIBMi: j,
      } = s(494);
      const Y = o(i.stat);
      const z = o(i.readdir);
      const arrify = (t = []) => (Array.isArray(t) ? t : [t]);
      const flatten = (t, e = []) => {
        t.forEach((t) => {
          if (Array.isArray(t)) {
            flatten(t, e);
          } else {
            e.push(t);
          }
        });
        return e;
      };
      const unifyPaths = (t) => {
        const e = flatten(arrify(t));
        if (!e.every((t) => typeof t === W)) {
          throw new TypeError(`Non-string provided as watch path: ${e}`);
        }
        return e.map(normalizePathToUnix);
      };
      const toUnix = (t) => {
        let e = t.replace(C, P);
        let s = false;
        if (e.startsWith(L)) {
          s = true;
        }
        while (e.match(x)) {
          e = e.replace(x, P);
        }
        if (s) {
          e = P + e;
        }
        return e;
      };
      const normalizePathToUnix = (t) => toUnix(n.normalize(toUnix(t)));
      const normalizeIgnored =
        (t = B) =>
        (e) => {
          if (typeof e !== W) return e;
          return normalizePathToUnix(n.isAbsolute(e) ? e : n.join(t, e));
        };
      const getAbsolutePath = (t, e) => {
        if (n.isAbsolute(t)) {
          return t;
        }
        if (t.startsWith(I)) {
          return I + n.join(e, t.slice(1));
        }
        return n.join(e, t);
      };
      const undef = (t, e) => t[e] === undefined;
      class DirEntry {
        constructor(t, e) {
          this.path = t;
          this._removeWatcher = e;
          this.items = new Set();
        }
        add(t) {
          const { items: e } = this;
          if (!e) return;
          if (t !== k && t !== $) e.add(t);
        }
        async remove(t) {
          const { items: e } = this;
          if (!e) return;
          e.delete(t);
          if (e.size > 0) return;
          const s = this.path;
          try {
            await z(s);
          } catch (t) {
            if (this._removeWatcher) {
              this._removeWatcher(n.dirname(s), n.basename(s));
            }
          }
        }
        has(t) {
          const { items: e } = this;
          if (!e) return;
          return e.has(t);
        }
        getChildren() {
          const { items: t } = this;
          if (!t) return;
          return [...t.values()];
        }
        dispose() {
          this.items.clear();
          delete this.path;
          delete this._removeWatcher;
          delete this.items;
          Object.freeze(this);
        }
      }
      const Q = "stat";
      const q = "lstat";
      class WatchHelper {
        constructor(t, e, s, r) {
          this.fsw = r;
          this.path = t = t.replace(O, B);
          this.watchPath = e;
          this.fullWatchPath = n.resolve(e);
          this.hasGlob = e !== t;
          if (t === B) this.hasGlob = false;
          this.globSymlink = this.hasGlob && s ? undefined : false;
          this.globFilter = this.hasGlob ? l(t, undefined, M) : false;
          this.dirParts = this.getDirParts(t);
          this.dirParts.forEach((t) => {
            if (t.length > 1) t.pop();
          });
          this.followSymlinks = s;
          this.statMethod = s ? Q : q;
        }
        checkGlobSymlink(t) {
          if (this.globSymlink === undefined) {
            this.globSymlink =
              t.fullParentDir === this.fullWatchPath
                ? false
                : { realPath: t.fullParentDir, linkPath: this.fullWatchPath };
          }
          if (this.globSymlink) {
            return t.fullPath.replace(this.globSymlink.realPath, this.globSymlink.linkPath);
          }
          return t.fullPath;
        }
        entryPath(t) {
          return n.join(this.watchPath, n.relative(this.watchPath, this.checkGlobSymlink(t)));
        }
        filterPath(t) {
          const { stats: e } = t;
          if (e && e.isSymbolicLink()) return this.filterDir(t);
          const s = this.entryPath(t);
          const r = this.hasGlob && typeof this.globFilter === G ? this.globFilter(s) : true;
          return r && this.fsw._isntIgnored(s, e) && this.fsw._hasReadPermissions(e);
        }
        getDirParts(t) {
          if (!this.hasGlob) return [];
          const e = [];
          const s = t.includes(N) ? f.expand(t) : [t];
          s.forEach((t) => {
            e.push(n.relative(this.watchPath, t).split(T));
          });
          return e;
        }
        filterDir(t) {
          if (this.hasGlob) {
            const e = this.getDirParts(this.checkGlobSymlink(t));
            let s = false;
            this.unmatchedGlob = !this.dirParts.some((t) =>
              t.every((t, r) => {
                if (t === D) s = true;
                return s || !e[0][r] || l(t, e[0][r], M);
              })
            );
          }
          return !this.unmatchedGlob && this.fsw._isntIgnored(this.entryPath(t), t.stats);
        }
      }
      class FSWatcher extends r {
        constructor(t) {
          super();
          const e = {};
          if (t) Object.assign(e, t);
          this._watched = new Map();
          this._closers = new Map();
          this._ignoredPaths = new Set();
          this._throttled = new Map();
          this._symlinkPaths = new Map();
          this._streams = new Set();
          this.closed = false;
          if (undef(e, "persistent")) e.persistent = true;
          if (undef(e, "ignoreInitial")) e.ignoreInitial = false;
          if (undef(e, "ignorePermissionErrors")) e.ignorePermissionErrors = false;
          if (undef(e, "interval")) e.interval = 100;
          if (undef(e, "binaryInterval")) e.binaryInterval = 300;
          if (undef(e, "disableGlobbing")) e.disableGlobbing = false;
          e.enableBinaryInterval = e.binaryInterval !== e.interval;
          if (undef(e, "useFsEvents")) e.useFsEvents = !e.usePolling;
          const s = d.canUse();
          if (!s) e.useFsEvents = false;
          if (undef(e, "usePolling") && !e.useFsEvents) {
            e.usePolling = V;
          }
          if (j) {
            e.usePolling = true;
          }
          const r = process.env.CHOKIDAR_USEPOLLING;
          if (r !== undefined) {
            const t = r.toLowerCase();
            if (t === "false" || t === "0") {
              e.usePolling = false;
            } else if (t === "true" || t === "1") {
              e.usePolling = true;
            } else {
              e.usePolling = !!t;
            }
          }
          const i = process.env.CHOKIDAR_INTERVAL;
          if (i) {
            e.interval = Number.parseInt(i, 10);
          }
          if (undef(e, "atomic")) e.atomic = !e.usePolling && !e.useFsEvents;
          if (e.atomic) this._pendingUnlinks = new Map();
          if (undef(e, "followSymlinks")) e.followSymlinks = true;
          if (undef(e, "awaitWriteFinish")) e.awaitWriteFinish = false;
          if (e.awaitWriteFinish === true) e.awaitWriteFinish = {};
          const n = e.awaitWriteFinish;
          if (n) {
            if (!n.stabilityThreshold) n.stabilityThreshold = 2e3;
            if (!n.pollInterval) n.pollInterval = 100;
            this._pendingWrites = new Map();
          }
          if (e.ignored) e.ignored = arrify(e.ignored);
          let o = 0;
          this._emitReady = () => {
            o++;
            if (o >= this._readyCount) {
              this._emitReady = U;
              this._readyEmitted = true;
              process.nextTick(() => this.emit(E));
            }
          };
          this._emitRaw = (...t) => this.emit(w, ...t);
          this._readyEmitted = false;
          this.options = e;
          if (e.useFsEvents) {
            this._fsEventsHandler = new d(this);
          } else {
            this._nodeFsHandler = new p(this);
          }
          Object.freeze(e);
        }
        add(t, e, s) {
          const { cwd: r, disableGlobbing: i } = this.options;
          this.closed = false;
          let o = unifyPaths(t);
          if (r) {
            o = o.map((t) => {
              const e = getAbsolutePath(t, r);
              if (i || !c(t)) {
                return e;
              }
              return h(e);
            });
          }
          o = o.filter((t) => {
            if (t.startsWith(I)) {
              this._ignoredPaths.add(t.slice(1));
              return false;
            }
            this._ignoredPaths.delete(t);
            this._ignoredPaths.delete(t + F);
            this._userIgnored = undefined;
            return true;
          });
          if (this.options.useFsEvents && this._fsEventsHandler) {
            if (!this._readyCount) this._readyCount = o.length;
            if (this.options.persistent) this._readyCount *= 2;
            o.forEach((t) => this._fsEventsHandler._addToFsEvents(t));
          } else {
            if (!this._readyCount) this._readyCount = 0;
            this._readyCount += o.length;
            Promise.all(
              o.map(async (t) => {
                const r = await this._nodeFsHandler._addToNodeFs(t, !s, 0, 0, e);
                if (r) this._emitReady();
                return r;
              })
            ).then((t) => {
              if (this.closed) return;
              t.filter((t) => t).forEach((t) => {
                this.add(n.dirname(t), n.basename(e || t));
              });
            });
          }
          return this;
        }
        unwatch(t) {
          if (this.closed) return this;
          const e = unifyPaths(t);
          const { cwd: s } = this.options;
          e.forEach((t) => {
            if (!n.isAbsolute(t) && !this._closers.has(t)) {
              if (s) t = n.join(s, t);
              t = n.resolve(t);
            }
            this._closePath(t);
            this._ignoredPaths.add(t);
            if (this._watched.has(t)) {
              this._ignoredPaths.add(t + F);
            }
            this._userIgnored = undefined;
          });
          return this;
        }
        close() {
          if (this.closed) return this._closePromise;
          this.closed = true;
          this.removeAllListeners();
          const t = [];
          this._closers.forEach((e) =>
            e.forEach((e) => {
              const s = e();
              if (s instanceof Promise) t.push(s);
            })
          );
          this._streams.forEach((t) => t.destroy());
          this._userIgnored = undefined;
          this._readyCount = 0;
          this._readyEmitted = false;
          this._watched.forEach((t) => t.dispose());
          ["closers", "watched", "streams", "symlinkPaths", "throttled"].forEach((t) => {
            this[`_${t}`].clear();
          });
          this._closePromise = t.length ? Promise.all(t).then(() => undefined) : Promise.resolve();
          return this._closePromise;
        }
        getWatched() {
          const t = {};
          this._watched.forEach((e, s) => {
            const r = this.options.cwd ? n.relative(this.options.cwd, s) : s;
            t[r || k] = e.getChildren().sort();
          });
          return t;
        }
        emitWithAll(t, e) {
          this.emit(...e);
          if (t !== b) this.emit(_, ...e);
        }
        async _emit(t, e, s, r, i) {
          if (this.closed) return;
          const o = this.options;
          if (K) e = n.normalize(e);
          if (o.cwd) e = n.relative(o.cwd, e);
          const a = [t, e];
          if (i !== undefined) a.push(s, r, i);
          else if (r !== undefined) a.push(s, r);
          else if (s !== undefined) a.push(s);
          const l = o.awaitWriteFinish;
          let u;
          if (l && (u = this._pendingWrites.get(e))) {
            u.lastChange = new Date();
            return this;
          }
          if (o.atomic) {
            if (t === R) {
              this._pendingUnlinks.set(e, a);
              setTimeout(
                () => {
                  this._pendingUnlinks.forEach((t, e) => {
                    this.emit(...t);
                    this.emit(_, ...t);
                    this._pendingUnlinks.delete(e);
                  });
                },
                typeof o.atomic === "number" ? o.atomic : 100
              );
              return this;
            }
            if (t === g && this._pendingUnlinks.has(e)) {
              t = a[0] = m;
              this._pendingUnlinks.delete(e);
            }
          }
          if (l && (t === g || t === m) && this._readyEmitted) {
            const awfEmit = (e, s) => {
              if (e) {
                t = a[0] = b;
                a[1] = e;
                this.emitWithAll(t, a);
              } else if (s) {
                if (a.length > 2) {
                  a[2] = s;
                } else {
                  a.push(s);
                }
                this.emitWithAll(t, a);
              }
            };
            this._awaitWriteFinish(e, l.stabilityThreshold, t, awfEmit);
            return this;
          }
          if (t === m) {
            const t = !this._throttle(m, e, 50);
            if (t) return this;
          }
          if (o.alwaysStat && s === undefined && (t === g || t === y || t === m)) {
            const t = o.cwd ? n.join(o.cwd, e) : e;
            let s;
            try {
              s = await Y(t);
            } catch (t) {}
            if (!s || this.closed) return;
            a.push(s);
          }
          this.emitWithAll(t, a);
          return this;
        }
        _handleError(t) {
          const e = t && t.code;
          if (
            t &&
            e !== "ENOENT" &&
            e !== "ENOTDIR" &&
            (!this.options.ignorePermissionErrors || (e !== "EPERM" && e !== "EACCES"))
          ) {
            this.emit(b, t);
          }
          return t || this.closed;
        }
        _throttle(t, e, s) {
          if (!this._throttled.has(t)) {
            this._throttled.set(t, new Map());
          }
          const r = this._throttled.get(t);
          const i = r.get(e);
          if (i) {
            i.count++;
            return false;
          }
          let n;
          const clear = () => {
            const t = r.get(e);
            const s = t ? t.count : 0;
            r.delete(e);
            clearTimeout(n);
            if (t) clearTimeout(t.timeoutObject);
            return s;
          };
          n = setTimeout(clear, s);
          const o = { timeoutObject: n, clear: clear, count: 0 };
          r.set(e, o);
          return o;
        }
        _incrReadyCount() {
          return this._readyCount++;
        }
        _awaitWriteFinish(t, e, s, r) {
          let o;
          let a = t;
          if (this.options.cwd && !n.isAbsolute(t)) {
            a = n.join(this.options.cwd, t);
          }
          const l = new Date();
          const awaitWriteFinish = (s) => {
            i.stat(a, (i, n) => {
              if (i || !this._pendingWrites.has(t)) {
                if (i && i.code !== "ENOENT") r(i);
                return;
              }
              const a = Number(new Date());
              if (s && n.size !== s.size) {
                this._pendingWrites.get(t).lastChange = a;
              }
              const l = this._pendingWrites.get(t);
              const u = a - l.lastChange;
              if (u >= e) {
                this._pendingWrites.delete(t);
                r(undefined, n);
              } else {
                o = setTimeout(awaitWriteFinish, this.options.awaitWriteFinish.pollInterval, n);
              }
            });
          };
          if (!this._pendingWrites.has(t)) {
            this._pendingWrites.set(t, {
              lastChange: l,
              cancelWait: () => {
                this._pendingWrites.delete(t);
                clearTimeout(o);
                return s;
              },
            });
            o = setTimeout(awaitWriteFinish, this.options.awaitWriteFinish.pollInterval);
          }
        }
        _getGlobIgnored() {
          return [...this._ignoredPaths.values()];
        }
        _isIgnored(t, e) {
          if (this.options.atomic && H.test(t)) return true;
          if (!this._userIgnored) {
            const { cwd: t } = this.options;
            const e = this.options.ignored;
            const s = e && e.map(normalizeIgnored(t));
            const r = arrify(s)
              .filter((t) => typeof t === W && !c(t))
              .map((t) => t + F);
            const i = this._getGlobIgnored().map(normalizeIgnored(t)).concat(s, r);
            this._userIgnored = l(i, undefined, M);
          }
          return this._userIgnored([t, e]);
        }
        _isntIgnored(t, e) {
          return !this._isIgnored(t, e);
        }
        _getWatchHelpers(t, e) {
          const s = e || this.options.disableGlobbing || !c(t) ? t : u(t);
          const r = this.options.followSymlinks;
          return new WatchHelper(t, s, r, this);
        }
        _getWatchedDir(t) {
          if (!this._boundRemove) this._boundRemove = this._remove.bind(this);
          const e = n.resolve(t);
          if (!this._watched.has(e)) this._watched.set(e, new DirEntry(e, this._boundRemove));
          return this._watched.get(e);
        }
        _hasReadPermissions(t) {
          if (this.options.ignorePermissionErrors) return true;
          const e = t && Number.parseInt(t.mode, 10);
          const s = e & 511;
          const r = Number.parseInt(s.toString(8)[0], 10);
          return Boolean(4 & r);
        }
        _remove(t, e, s) {
          const r = n.join(t, e);
          const i = n.resolve(r);
          s = s != null ? s : this._watched.has(r) || this._watched.has(i);
          if (!this._throttle("remove", r, 100)) return;
          if (!s && !this.options.useFsEvents && this._watched.size === 1) {
            this.add(t, e, true);
          }
          const o = this._getWatchedDir(r);
          const a = o.getChildren();
          a.forEach((t) => this._remove(r, t));
          const l = this._getWatchedDir(t);
          const u = l.has(e);
          l.remove(e);
          if (this._symlinkPaths.has(i)) {
            this._symlinkPaths.delete(i);
          }
          let c = r;
          if (this.options.cwd) c = n.relative(this.options.cwd, r);
          if (this.options.awaitWriteFinish && this._pendingWrites.has(c)) {
            const t = this._pendingWrites.get(c).cancelWait();
            if (t === g) return;
          }
          this._watched.delete(r);
          this._watched.delete(i);
          const f = s ? A : R;
          if (u && !this._isIgnored(r)) this._emit(f, r);
          if (!this.options.useFsEvents) {
            this._closePath(r);
          }
        }
        _closePath(t) {
          this._closeFile(t);
          const e = n.dirname(t);
          this._getWatchedDir(e).remove(n.basename(t));
        }
        _closeFile(t) {
          const e = this._closers.get(t);
          if (!e) return;
          e.forEach((t) => t());
          this._closers.delete(t);
        }
        _addPathCloser(t, e) {
          if (!e) return;
          let s = this._closers.get(t);
          if (!s) {
            s = [];
            this._closers.set(t, s);
          }
          s.push(e);
        }
        _readdirp(t, e) {
          if (this.closed) return;
          const s = { type: _, alwaysStat: true, lstat: true, ...e };
          let r = a(t, s);
          this._streams.add(r);
          r.once(S, () => {
            r = undefined;
          });
          r.once(v, () => {
            if (r) {
              this._streams.delete(r);
              r = undefined;
            }
          });
          return r;
        }
      }
      e.FSWatcher = FSWatcher;
      const watch = (t, e) => {
        const s = new FSWatcher(e);
        s.add(t);
        return s;
      };
      e.watch = watch;
    },
    494: (t, e, s) => {
      "use strict";
      const { sep: r } = s(17);
      const { platform: i } = process;
      const n = s(37);
      e.EV_ALL = "all";
      e.EV_READY = "ready";
      e.EV_ADD = "add";
      e.EV_CHANGE = "change";
      e.EV_ADD_DIR = "addDir";
      e.EV_UNLINK = "unlink";
      e.EV_UNLINK_DIR = "unlinkDir";
      e.EV_RAW = "raw";
      e.EV_ERROR = "error";
      e.STR_DATA = "data";
      e.STR_END = "end";
      e.STR_CLOSE = "close";
      e.FSEVENT_CREATED = "created";
      e.FSEVENT_MODIFIED = "modified";
      e.FSEVENT_DELETED = "deleted";
      e.FSEVENT_MOVED = "moved";
      e.FSEVENT_CLONED = "cloned";
      e.FSEVENT_UNKNOWN = "unknown";
      e.FSEVENT_TYPE_FILE = "file";
      e.FSEVENT_TYPE_DIRECTORY = "directory";
      e.FSEVENT_TYPE_SYMLINK = "symlink";
      e.KEY_LISTENERS = "listeners";
      e.KEY_ERR = "errHandlers";
      e.KEY_RAW = "rawEmitters";
      e.HANDLER_KEYS = [e.KEY_LISTENERS, e.KEY_ERR, e.KEY_RAW];
      e.DOT_SLASH = `.${r}`;
      e.BACK_SLASH_RE = /\\/g;
      e.DOUBLE_SLASH_RE = /\/\//;
      e.SLASH_OR_BACK_SLASH_RE = /[/\\]/;
      e.DOT_RE = /\..*\.(sw[px])$|~$|\.subl.*\.tmp/;
      e.REPLACER_RE = /^\.[/\\]/;
      e.SLASH = "/";
      e.SLASH_SLASH = "//";
      e.BRACE_START = "{";
      e.BANG = "!";
      e.ONE_DOT = ".";
      e.TWO_DOTS = "..";
      e.STAR = "*";
      e.GLOBSTAR = "**";
      e.ROOT_GLOBSTAR = "/**/*";
      e.SLASH_GLOBSTAR = "/**";
      e.DIR_SUFFIX = "Dir";
      e.ANYMATCH_OPTS = { dot: true };
      e.STRING_TYPE = "string";
      e.FUNCTION_TYPE = "function";
      e.EMPTY_STR = "";
      e.EMPTY_FN = () => {};
      e.IDENTITY_FN = (t) => t;
      e.isWindows = i === "win32";
      e.isMacos = i === "darwin";
      e.isLinux = i === "linux";
      e.isIBMi = n.type() === "OS400";
    },
    771: (t, e, s) => {
      "use strict";
      const r = s(147);
      const i = s(17);
      const { promisify: n } = s(837);
      let o;
      try {
        o = s(149);
      } catch (t) {
        if (process.env.CHOKIDAR_PRINT_FSEVENTS_REQUIRE_ERROR) console.error(t);
      }
      if (o) {
        const t = process.version.match(/v(\d+)\.(\d+)/);
        if (t && t[1] && t[2]) {
          const e = Number.parseInt(t[1], 10);
          const s = Number.parseInt(t[2], 10);
          if (e === 8 && s < 16) {
            o = undefined;
          }
        }
      }
      const {
        EV_ADD: a,
        EV_CHANGE: l,
        EV_ADD_DIR: u,
        EV_UNLINK: c,
        EV_ERROR: f,
        STR_DATA: h,
        STR_END: p,
        FSEVENT_CREATED: d,
        FSEVENT_MODIFIED: _,
        FSEVENT_DELETED: E,
        FSEVENT_MOVED: g,
        FSEVENT_UNKNOWN: m,
        FSEVENT_TYPE_FILE: R,
        FSEVENT_TYPE_DIRECTORY: y,
        FSEVENT_TYPE_SYMLINK: A,
        ROOT_GLOBSTAR: w,
        DIR_SUFFIX: b,
        DOT_SLASH: S,
        FUNCTION_TYPE: v,
        EMPTY_FN: C,
        IDENTITY_FN: x,
      } = s(494);
      const Depth = (t) => (isNaN(t) ? {} : { depth: t });
      const T = n(r.stat);
      const H = n(r.lstat);
      const O = n(r.realpath);
      const P = { stat: T, lstat: H };
      const L = new Map();
      const N = 10;
      const I = new Set([69888, 70400, 71424, 72704, 73472, 131328, 131840, 262912]);
      const createFSEventsInstance = (t, e) => {
        const s = o.watch(t, e);
        return { stop: s };
      };
      function setFSEventsListener(t, e, s, r) {
        let n = i.extname(e) ? i.dirname(e) : e;
        const a = i.dirname(n);
        let l = L.get(n);
        if (couldConsolidate(a)) {
          n = a;
        }
        const u = i.resolve(t);
        const c = u !== e;
        const filteredListener = (t, r, n) => {
          if (c) t = t.replace(e, u);
          if (t === u || !t.indexOf(u + i.sep)) s(t, r, n);
        };
        let f = false;
        for (const t of L.keys()) {
          if (e.indexOf(i.resolve(t) + i.sep) === 0) {
            n = t;
            l = L.get(n);
            f = true;
            break;
          }
        }
        if (l || f) {
          l.listeners.add(filteredListener);
        } else {
          l = {
            listeners: new Set([filteredListener]),
            rawEmitter: r,
            watcher: createFSEventsInstance(n, (t, e) => {
              if (!l.listeners.size) return;
              const s = o.getInfo(t, e);
              l.listeners.forEach((r) => {
                r(t, e, s);
              });
              l.rawEmitter(s.event, t, s);
            }),
          };
          L.set(n, l);
        }
        return () => {
          const t = l.listeners;
          t.delete(filteredListener);
          if (!t.size) {
            L.delete(n);
            if (l.watcher)
              return l.watcher.stop().then(() => {
                l.rawEmitter = l.watcher = undefined;
                Object.freeze(l);
              });
          }
        };
      }
      const couldConsolidate = (t) => {
        let e = 0;
        for (const s of L.keys()) {
          if (s.indexOf(t) === 0) {
            e++;
            if (e >= N) {
              return true;
            }
          }
        }
        return false;
      };
      const canUse = () => o && L.size < 128;
      const calcDepth = (t, e) => {
        let s = 0;
        while (!t.indexOf(e) && (t = i.dirname(t)) !== e) s++;
        return s;
      };
      const sameTypes = (t, e) =>
        (t.type === y && e.isDirectory()) ||
        (t.type === A && e.isSymbolicLink()) ||
        (t.type === R && e.isFile());
      class FsEventsHandler {
        constructor(t) {
          this.fsw = t;
        }
        checkIgnored(t, e) {
          const s = this.fsw._ignoredPaths;
          if (this.fsw._isIgnored(t, e)) {
            s.add(t);
            if (e && e.isDirectory()) {
              s.add(t + w);
            }
            return true;
          }
          s.delete(t);
          s.delete(t + w);
        }
        addOrChange(t, e, s, r, i, n, o, u) {
          const c = i.has(n) ? l : a;
          this.handleEvent(c, t, e, s, r, i, n, o, u);
        }
        async checkExists(t, e, s, r, i, n, o, a) {
          try {
            const l = await T(t);
            if (this.fsw.closed) return;
            if (sameTypes(o, l)) {
              this.addOrChange(t, e, s, r, i, n, o, a);
            } else {
              this.handleEvent(c, t, e, s, r, i, n, o, a);
            }
          } catch (l) {
            if (l.code === "EACCES") {
              this.addOrChange(t, e, s, r, i, n, o, a);
            } else {
              this.handleEvent(c, t, e, s, r, i, n, o, a);
            }
          }
        }
        handleEvent(t, e, s, r, i, n, o, l, f) {
          if (this.fsw.closed || this.checkIgnored(e)) return;
          if (t === c) {
            const t = l.type === y;
            if (t || n.has(o)) {
              this.fsw._remove(i, o, t);
            }
          } else {
            if (t === a) {
              if (l.type === y) this.fsw._getWatchedDir(e);
              if (l.type === A && f.followSymlinks) {
                const t = f.depth === undefined ? undefined : calcDepth(s, r) + 1;
                return this._addToFsEvents(e, false, true, t);
              }
              this.fsw._getWatchedDir(i).add(o);
            }
            const n = l.type === y ? t + b : t;
            this.fsw._emit(n, e);
            if (n === u) this._addToFsEvents(e, false, true);
          }
        }
        _watchWithFsEvents(t, e, s, r) {
          if (this.fsw.closed || this.fsw._isIgnored(t)) return;
          const n = this.fsw.options;
          const watchCallback = async (o, a, l) => {
            if (this.fsw.closed) return;
            if (n.depth !== undefined && calcDepth(o, e) > n.depth) return;
            const u = s(i.join(t, i.relative(t, o)));
            if (r && !r(u)) return;
            const f = i.dirname(u);
            const h = i.basename(u);
            const p = this.fsw._getWatchedDir(l.type === y ? u : f);
            if (I.has(a) || l.event === m) {
              if (typeof n.ignored === v) {
                let t;
                try {
                  t = await T(u);
                } catch (t) {}
                if (this.fsw.closed) return;
                if (this.checkIgnored(u, t)) return;
                if (sameTypes(l, t)) {
                  this.addOrChange(u, o, e, f, p, h, l, n);
                } else {
                  this.handleEvent(c, u, o, e, f, p, h, l, n);
                }
              } else {
                this.checkExists(u, o, e, f, p, h, l, n);
              }
            } else {
              switch (l.event) {
                case d:
                case _:
                  return this.addOrChange(u, o, e, f, p, h, l, n);
                case E:
                case g:
                  return this.checkExists(u, o, e, f, p, h, l, n);
              }
            }
          };
          const o = setFSEventsListener(t, e, watchCallback, this.fsw._emitRaw);
          this.fsw._emitReady();
          return o;
        }
        async _handleFsEventsSymlink(t, e, s, r) {
          if (this.fsw.closed || this.fsw._symlinkPaths.has(e)) return;
          this.fsw._symlinkPaths.set(e, true);
          this.fsw._incrReadyCount();
          try {
            const e = await O(t);
            if (this.fsw.closed) return;
            if (this.fsw._isIgnored(e)) {
              return this.fsw._emitReady();
            }
            this.fsw._incrReadyCount();
            this._addToFsEvents(
              e || t,
              (r) => {
                let n = t;
                if (e && e !== S) {
                  n = r.replace(e, t);
                } else if (r !== S) {
                  n = i.join(t, r);
                }
                return s(n);
              },
              false,
              r
            );
          } catch (t) {
            if (this.fsw._handleError(t)) {
              return this.fsw._emitReady();
            }
          }
        }
        emitAdd(t, e, s, r, n) {
          const o = s(t);
          const l = e.isDirectory();
          const c = this.fsw._getWatchedDir(i.dirname(o));
          const f = i.basename(o);
          if (l) this.fsw._getWatchedDir(o);
          if (c.has(f)) return;
          c.add(f);
          if (!r.ignoreInitial || n === true) {
            this.fsw._emit(l ? u : a, o, e);
          }
        }
        initWatch(t, e, s, r) {
          if (this.fsw.closed) return;
          const n = this._watchWithFsEvents(
            s.watchPath,
            i.resolve(t || s.watchPath),
            r,
            s.globFilter
          );
          this.fsw._addPathCloser(e, n);
        }
        async _addToFsEvents(t, e, s, r) {
          if (this.fsw.closed) {
            return;
          }
          const n = this.fsw.options;
          const o = typeof e === v ? e : x;
          const a = this.fsw._getWatchHelpers(t);
          try {
            const e = await P[a.statMethod](a.watchPath);
            if (this.fsw.closed) return;
            if (this.fsw._isIgnored(a.watchPath, e)) {
              throw null;
            }
            if (e.isDirectory()) {
              if (!a.globFilter) this.emitAdd(o(t), e, o, n, s);
              if (r && r > n.depth) return;
              this.fsw
                ._readdirp(a.watchPath, {
                  fileFilter: (t) => a.filterPath(t),
                  directoryFilter: (t) => a.filterDir(t),
                  ...Depth(n.depth - (r || 0)),
                })
                .on(h, (t) => {
                  if (this.fsw.closed) {
                    return;
                  }
                  if (t.stats.isDirectory() && !a.filterPath(t)) return;
                  const e = i.join(a.watchPath, t.path);
                  const { fullPath: r } = t;
                  if (a.followSymlinks && t.stats.isSymbolicLink()) {
                    const t =
                      n.depth === undefined ? undefined : calcDepth(e, i.resolve(a.watchPath)) + 1;
                    this._handleFsEventsSymlink(e, r, o, t);
                  } else {
                    this.emitAdd(e, t.stats, o, n, s);
                  }
                })
                .on(f, C)
                .on(p, () => {
                  this.fsw._emitReady();
                });
            } else {
              this.emitAdd(a.watchPath, e, o, n, s);
              this.fsw._emitReady();
            }
          } catch (t) {
            if (!t || this.fsw._handleError(t)) {
              this.fsw._emitReady();
              this.fsw._emitReady();
            }
          }
          if (n.persistent && s !== true) {
            if (typeof e === v) {
              this.initWatch(undefined, t, a, o);
            } else {
              let e;
              try {
                e = await O(a.watchPath);
              } catch (t) {}
              this.initWatch(e, t, a, o);
            }
          }
        }
      }
      t.exports = FsEventsHandler;
      t.exports.canUse = canUse;
    },
    335: (t, e, s) => {
      "use strict";
      const r = s(147);
      const i = s(17);
      const { promisify: n } = s(837);
      const o = s(436);
      const {
        isWindows: a,
        isLinux: l,
        EMPTY_FN: u,
        EMPTY_STR: c,
        KEY_LISTENERS: f,
        KEY_ERR: h,
        KEY_RAW: p,
        HANDLER_KEYS: d,
        EV_CHANGE: _,
        EV_ADD: E,
        EV_ADD_DIR: g,
        EV_ERROR: m,
        STR_DATA: R,
        STR_END: y,
        BRACE_START: A,
        STAR: w,
      } = s(494);
      const b = "watch";
      const S = n(r.open);
      const v = n(r.stat);
      const C = n(r.lstat);
      const x = n(r.close);
      const T = n(r.realpath);
      const H = { lstat: C, stat: v };
      const foreach = (t, e) => {
        if (t instanceof Set) {
          t.forEach(e);
        } else {
          e(t);
        }
      };
      const addAndConvert = (t, e, s) => {
        let r = t[e];
        if (!(r instanceof Set)) {
          t[e] = r = new Set([r]);
        }
        r.add(s);
      };
      const clearItem = (t) => (e) => {
        const s = t[e];
        if (s instanceof Set) {
          s.clear();
        } else {
          delete t[e];
        }
      };
      const delFromSet = (t, e, s) => {
        const r = t[e];
        if (r instanceof Set) {
          r.delete(s);
        } else if (r === s) {
          delete t[e];
        }
      };
      const isEmptySet = (t) => (t instanceof Set ? t.size === 0 : !t);
      const O = new Map();
      function createFsWatchInstance(t, e, s, n, o) {
        const handleEvent = (e, r) => {
          s(t);
          o(e, r, { watchedPath: t });
          if (r && t !== r) {
            fsWatchBroadcast(i.resolve(t, r), f, i.join(t, r));
          }
        };
        try {
          return r.watch(t, e, handleEvent);
        } catch (t) {
          n(t);
        }
      }
      const fsWatchBroadcast = (t, e, s, r, i) => {
        const n = O.get(t);
        if (!n) return;
        foreach(n[e], (t) => {
          t(s, r, i);
        });
      };
      const setFsWatchListener = (t, e, s, r) => {
        const { listener: i, errHandler: n, rawEmitter: o } = r;
        let l = O.get(e);
        let u;
        if (!s.persistent) {
          u = createFsWatchInstance(t, s, i, n, o);
          return u.close.bind(u);
        }
        if (l) {
          addAndConvert(l, f, i);
          addAndConvert(l, h, n);
          addAndConvert(l, p, o);
        } else {
          u = createFsWatchInstance(
            t,
            s,
            fsWatchBroadcast.bind(null, e, f),
            n,
            fsWatchBroadcast.bind(null, e, p)
          );
          if (!u) return;
          u.on(m, async (s) => {
            const r = fsWatchBroadcast.bind(null, e, h);
            l.watcherUnusable = true;
            if (a && s.code === "EPERM") {
              try {
                const e = await S(t, "r");
                await x(e);
                r(s);
              } catch (t) {}
            } else {
              r(s);
            }
          });
          l = { listeners: i, errHandlers: n, rawEmitters: o, watcher: u };
          O.set(e, l);
        }
        return () => {
          delFromSet(l, f, i);
          delFromSet(l, h, n);
          delFromSet(l, p, o);
          if (isEmptySet(l.listeners)) {
            l.watcher.close();
            O.delete(e);
            d.forEach(clearItem(l));
            l.watcher = undefined;
            Object.freeze(l);
          }
        };
      };
      const P = new Map();
      const setFsWatchFileListener = (t, e, s, i) => {
        const { listener: n, rawEmitter: o } = i;
        let a = P.get(e);
        let l = new Set();
        let u = new Set();
        const c = a && a.options;
        if (c && (c.persistent < s.persistent || c.interval > s.interval)) {
          l = a.listeners;
          u = a.rawEmitters;
          r.unwatchFile(e);
          a = undefined;
        }
        if (a) {
          addAndConvert(a, f, n);
          addAndConvert(a, p, o);
        } else {
          a = {
            listeners: n,
            rawEmitters: o,
            options: s,
            watcher: r.watchFile(e, s, (s, r) => {
              foreach(a.rawEmitters, (t) => {
                t(_, e, { curr: s, prev: r });
              });
              const i = s.mtimeMs;
              if (s.size !== r.size || i > r.mtimeMs || i === 0) {
                foreach(a.listeners, (e) => e(t, s));
              }
            }),
          };
          P.set(e, a);
        }
        return () => {
          delFromSet(a, f, n);
          delFromSet(a, p, o);
          if (isEmptySet(a.listeners)) {
            P.delete(e);
            r.unwatchFile(e);
            a.options = a.watcher = undefined;
            Object.freeze(a);
          }
        };
      };
      class NodeFsHandler {
        constructor(t) {
          this.fsw = t;
          this._boundHandleError = (e) => t._handleError(e);
        }
        _watchWithNodeFs(t, e) {
          const s = this.fsw.options;
          const r = i.dirname(t);
          const n = i.basename(t);
          const a = this.fsw._getWatchedDir(r);
          a.add(n);
          const l = i.resolve(t);
          const c = { persistent: s.persistent };
          if (!e) e = u;
          let f;
          if (s.usePolling) {
            c.interval = s.enableBinaryInterval && o(n) ? s.binaryInterval : s.interval;
            f = setFsWatchFileListener(t, l, c, { listener: e, rawEmitter: this.fsw._emitRaw });
          } else {
            f = setFsWatchListener(t, l, c, {
              listener: e,
              errHandler: this._boundHandleError,
              rawEmitter: this.fsw._emitRaw,
            });
          }
          return f;
        }
        _handleFile(t, e, s) {
          if (this.fsw.closed) {
            return;
          }
          const r = i.dirname(t);
          const n = i.basename(t);
          const o = this.fsw._getWatchedDir(r);
          let a = e;
          if (o.has(n)) return;
          const listener = async (e, s) => {
            if (!this.fsw._throttle(b, t, 5)) return;
            if (!s || s.mtimeMs === 0) {
              try {
                const s = await v(t);
                if (this.fsw.closed) return;
                const r = s.atimeMs;
                const i = s.mtimeMs;
                if (!r || r <= i || i !== a.mtimeMs) {
                  this.fsw._emit(_, t, s);
                }
                if (l && a.ino !== s.ino) {
                  this.fsw._closeFile(e);
                  a = s;
                  this.fsw._addPathCloser(e, this._watchWithNodeFs(t, listener));
                } else {
                  a = s;
                }
              } catch (t) {
                this.fsw._remove(r, n);
              }
            } else if (o.has(n)) {
              const e = s.atimeMs;
              const r = s.mtimeMs;
              if (!e || e <= r || r !== a.mtimeMs) {
                this.fsw._emit(_, t, s);
              }
              a = s;
            }
          };
          const u = this._watchWithNodeFs(t, listener);
          if (!(s && this.fsw.options.ignoreInitial) && this.fsw._isntIgnored(t)) {
            if (!this.fsw._throttle(E, t, 0)) return;
            this.fsw._emit(E, t, e);
          }
          return u;
        }
        async _handleSymlink(t, e, s, r) {
          if (this.fsw.closed) {
            return;
          }
          const i = t.fullPath;
          const n = this.fsw._getWatchedDir(e);
          if (!this.fsw.options.followSymlinks) {
            this.fsw._incrReadyCount();
            let e;
            try {
              e = await T(s);
            } catch (t) {
              this.fsw._emitReady();
              return true;
            }
            if (this.fsw.closed) return;
            if (n.has(r)) {
              if (this.fsw._symlinkPaths.get(i) !== e) {
                this.fsw._symlinkPaths.set(i, e);
                this.fsw._emit(_, s, t.stats);
              }
            } else {
              n.add(r);
              this.fsw._symlinkPaths.set(i, e);
              this.fsw._emit(E, s, t.stats);
            }
            this.fsw._emitReady();
            return true;
          }
          if (this.fsw._symlinkPaths.has(i)) {
            return true;
          }
          this.fsw._symlinkPaths.set(i, true);
        }
        _handleRead(t, e, s, r, n, o, a) {
          t = i.join(t, c);
          if (!s.hasGlob) {
            a = this.fsw._throttle("readdir", t, 1e3);
            if (!a) return;
          }
          const l = this.fsw._getWatchedDir(s.path);
          const u = new Set();
          let f = this.fsw
            ._readdirp(t, {
              fileFilter: (t) => s.filterPath(t),
              directoryFilter: (t) => s.filterDir(t),
              depth: 0,
            })
            .on(R, async (a) => {
              if (this.fsw.closed) {
                f = undefined;
                return;
              }
              const c = a.path;
              let h = i.join(t, c);
              u.add(c);
              if (a.stats.isSymbolicLink() && (await this._handleSymlink(a, t, h, c))) {
                return;
              }
              if (this.fsw.closed) {
                f = undefined;
                return;
              }
              if (c === r || (!r && !l.has(c))) {
                this.fsw._incrReadyCount();
                h = i.join(n, i.relative(n, h));
                this._addToNodeFs(h, e, s, o + 1);
              }
            })
            .on(m, this._boundHandleError);
          return new Promise((e) =>
            f.once(y, () => {
              if (this.fsw.closed) {
                f = undefined;
                return;
              }
              const c = a ? a.clear() : false;
              e();
              l.getChildren()
                .filter(
                  (e) =>
                    e !== t &&
                    !u.has(e) &&
                    (!s.hasGlob || s.filterPath({ fullPath: i.resolve(t, e) }))
                )
                .forEach((e) => {
                  this.fsw._remove(t, e);
                });
              f = undefined;
              if (c) this._handleRead(t, false, s, r, n, o, a);
            })
          );
        }
        async _handleDir(t, e, s, r, n, o, a) {
          const l = this.fsw._getWatchedDir(i.dirname(t));
          const u = l.has(i.basename(t));
          if (!(s && this.fsw.options.ignoreInitial) && !n && !u) {
            if (!o.hasGlob || o.globFilter(t)) this.fsw._emit(g, t, e);
          }
          l.add(i.basename(t));
          this.fsw._getWatchedDir(t);
          let c;
          let f;
          const h = this.fsw.options.depth;
          if ((h == null || r <= h) && !this.fsw._symlinkPaths.has(a)) {
            if (!n) {
              await this._handleRead(t, s, o, n, t, r, c);
              if (this.fsw.closed) return;
            }
            f = this._watchWithNodeFs(t, (e, s) => {
              if (s && s.mtimeMs === 0) return;
              this._handleRead(e, false, o, n, t, r, c);
            });
          }
          return f;
        }
        async _addToNodeFs(t, e, s, r, n) {
          const o = this.fsw._emitReady;
          if (this.fsw._isIgnored(t) || this.fsw.closed) {
            o();
            return false;
          }
          const a = this.fsw._getWatchHelpers(t, r);
          if (!a.hasGlob && s) {
            a.hasGlob = s.hasGlob;
            a.globFilter = s.globFilter;
            a.filterPath = (t) => s.filterPath(t);
            a.filterDir = (t) => s.filterDir(t);
          }
          try {
            const s = await H[a.statMethod](a.watchPath);
            if (this.fsw.closed) return;
            if (this.fsw._isIgnored(a.watchPath, s)) {
              o();
              return false;
            }
            const l = this.fsw.options.followSymlinks && !t.includes(w) && !t.includes(A);
            let u;
            if (s.isDirectory()) {
              const o = i.resolve(t);
              const c = l ? await T(t) : t;
              if (this.fsw.closed) return;
              u = await this._handleDir(a.watchPath, s, e, r, n, a, c);
              if (this.fsw.closed) return;
              if (o !== c && c !== undefined) {
                this.fsw._symlinkPaths.set(o, c);
              }
            } else if (s.isSymbolicLink()) {
              const n = l ? await T(t) : t;
              if (this.fsw.closed) return;
              const o = i.dirname(a.watchPath);
              this.fsw._getWatchedDir(o).add(a.watchPath);
              this.fsw._emit(E, a.watchPath, s);
              u = await this._handleDir(o, s, e, r, t, a, n);
              if (this.fsw.closed) return;
              if (n !== undefined) {
                this.fsw._symlinkPaths.set(i.resolve(t), n);
              }
            } else {
              u = this._handleFile(a.watchPath, s, e);
            }
            o();
            this.fsw._addPathCloser(t, u);
            return false;
          } catch (e) {
            if (this.fsw._handleError(e)) {
              o();
              return t;
            }
          }
        }
      }
      t.exports = NodeFsHandler;
    },
    547: (t, e, s) => {
      "use strict";
      var r = s(466);
      var i = s(17).posix.dirname;
      var n = s(37).platform() === "win32";
      var o = "/";
      var a = /\\/g;
      var l = /[\{\[].*[\}\]]$/;
      var u = /(^|[^\\])([\{\[]|\([^\)]+$)/;
      var c = /\\([\!\*\?\|\[\]\(\)\{\}])/g;
      t.exports = function globParent(t, e) {
        var s = Object.assign({ flipBackslashes: true }, e);
        if (s.flipBackslashes && n && t.indexOf(o) < 0) {
          t = t.replace(a, o);
        }
        if (l.test(t)) {
          t += o;
        }
        t += "a";
        do {
          t = i(t);
        } while (r(t) || u.test(t));
        return t.replace(c, "$1");
      };
    },
    330: (t, e, s) => {
      "use strict";
      /*!
       * fill-range <https://github.com/jonschlinkert/fill-range>
       *
       * Copyright (c) 2014-present, Jon Schlinkert.
       * Licensed under the MIT License.
       */ const r = s(837);
      const i = s(861);
      const isObject = (t) => t !== null && typeof t === "object" && !Array.isArray(t);
      const transform = (t) => (e) => (t === true ? Number(e) : String(e));
      const isValidValue = (t) => typeof t === "number" || (typeof t === "string" && t !== "");
      const isNumber = (t) => Number.isInteger(+t);
      const zeros = (t) => {
        let e = `${t}`;
        let s = -1;
        if (e[0] === "-") e = e.slice(1);
        if (e === "0") return false;
        while (e[++s] === "0");
        return s > 0;
      };
      const stringify = (t, e, s) => {
        if (typeof t === "string" || typeof e === "string") {
          return true;
        }
        return s.stringify === true;
      };
      const pad = (t, e, s) => {
        if (e > 0) {
          let s = t[0] === "-" ? "-" : "";
          if (s) t = t.slice(1);
          t = s + t.padStart(s ? e - 1 : e, "0");
        }
        if (s === false) {
          return String(t);
        }
        return t;
      };
      const toMaxLen = (t, e) => {
        let s = t[0] === "-" ? "-" : "";
        if (s) {
          t = t.slice(1);
          e--;
        }
        while (t.length < e) t = "0" + t;
        return s ? "-" + t : t;
      };
      const toSequence = (t, e) => {
        t.negatives.sort((t, e) => (t < e ? -1 : t > e ? 1 : 0));
        t.positives.sort((t, e) => (t < e ? -1 : t > e ? 1 : 0));
        let s = e.capture ? "" : "?:";
        let r = "";
        let i = "";
        let n;
        if (t.positives.length) {
          r = t.positives.join("|");
        }
        if (t.negatives.length) {
          i = `-(${s}${t.negatives.join("|")})`;
        }
        if (r && i) {
          n = `${r}|${i}`;
        } else {
          n = r || i;
        }
        if (e.wrap) {
          return `(${s}${n})`;
        }
        return n;
      };
      const toRange = (t, e, s, r) => {
        if (s) {
          return i(t, e, { wrap: false, ...r });
        }
        let n = String.fromCharCode(t);
        if (t === e) return n;
        let o = String.fromCharCode(e);
        return `[${n}-${o}]`;
      };
      const toRegex = (t, e, s) => {
        if (Array.isArray(t)) {
          let e = s.wrap === true;
          let r = s.capture ? "" : "?:";
          return e ? `(${r}${t.join("|")})` : t.join("|");
        }
        return i(t, e, s);
      };
      const rangeError = (...t) => new RangeError("Invalid range arguments: " + r.inspect(...t));
      const invalidRange = (t, e, s) => {
        if (s.strictRanges === true) throw rangeError([t, e]);
        return [];
      };
      const invalidStep = (t, e) => {
        if (e.strictRanges === true) {
          throw new TypeError(`Expected step "${t}" to be a number`);
        }
        return [];
      };
      const fillNumbers = (t, e, s = 1, r = {}) => {
        let i = Number(t);
        let n = Number(e);
        if (!Number.isInteger(i) || !Number.isInteger(n)) {
          if (r.strictRanges === true) throw rangeError([t, e]);
          return [];
        }
        if (i === 0) i = 0;
        if (n === 0) n = 0;
        let o = i > n;
        let a = String(t);
        let l = String(e);
        let u = String(s);
        s = Math.max(Math.abs(s), 1);
        let c = zeros(a) || zeros(l) || zeros(u);
        let f = c ? Math.max(a.length, l.length, u.length) : 0;
        let h = c === false && stringify(t, e, r) === false;
        let p = r.transform || transform(h);
        if (r.toRegex && s === 1) {
          return toRange(toMaxLen(t, f), toMaxLen(e, f), true, r);
        }
        let d = { negatives: [], positives: [] };
        let push = (t) => d[t < 0 ? "negatives" : "positives"].push(Math.abs(t));
        let _ = [];
        let E = 0;
        while (o ? i >= n : i <= n) {
          if (r.toRegex === true && s > 1) {
            push(i);
          } else {
            _.push(pad(p(i, E), f, h));
          }
          i = o ? i - s : i + s;
          E++;
        }
        if (r.toRegex === true) {
          return s > 1 ? toSequence(d, r) : toRegex(_, null, { wrap: false, ...r });
        }
        return _;
      };
      const fillLetters = (t, e, s = 1, r = {}) => {
        if ((!isNumber(t) && t.length > 1) || (!isNumber(e) && e.length > 1)) {
          return invalidRange(t, e, r);
        }
        let i = r.transform || ((t) => String.fromCharCode(t));
        let n = `${t}`.charCodeAt(0);
        let o = `${e}`.charCodeAt(0);
        let a = n > o;
        let l = Math.min(n, o);
        let u = Math.max(n, o);
        if (r.toRegex && s === 1) {
          return toRange(l, u, false, r);
        }
        let c = [];
        let f = 0;
        while (a ? n >= o : n <= o) {
          c.push(i(n, f));
          n = a ? n - s : n + s;
          f++;
        }
        if (r.toRegex === true) {
          return toRegex(c, null, { wrap: false, options: r });
        }
        return c;
      };
      const fill = (t, e, s, r = {}) => {
        if (e == null && isValidValue(t)) {
          return [t];
        }
        if (!isValidValue(t) || !isValidValue(e)) {
          return invalidRange(t, e, r);
        }
        if (typeof s === "function") {
          return fill(t, e, 1, { transform: s });
        }
        if (isObject(s)) {
          return fill(t, e, 0, s);
        }
        let i = { ...r };
        if (i.capture === true) i.wrap = true;
        s = s || i.step || 1;
        if (!isNumber(s)) {
          if (s != null && !isObject(s)) return invalidStep(s, i);
          return fill(t, e, 1, s);
        }
        if (isNumber(t) && isNumber(e)) {
          return fillNumbers(t, e, s, i);
        }
        return fillLetters(t, e, Math.max(Math.abs(s), 1), i);
      };
      t.exports = fill;
    },
    436: (t, e, s) => {
      "use strict";
      const r = s(17);
      const i = s(329);
      const n = new Set(i);
      t.exports = (t) => n.has(r.extname(t).slice(1).toLowerCase());
    },
    435: (t) => {
      /*!
       * is-extglob <https://github.com/jonschlinkert/is-extglob>
       *
       * Copyright (c) 2014-2016, Jon Schlinkert.
       * Licensed under the MIT License.
       */
      t.exports = function isExtglob(t) {
        if (typeof t !== "string" || t === "") {
          return false;
        }
        var e;
        while ((e = /(\\).|([@?!+*]\(.*\))/g.exec(t))) {
          if (e[2]) return true;
          t = t.slice(e.index + e[0].length);
        }
        return false;
      };
    },
    466: (t, e, s) => {
      /*!
       * is-glob <https://github.com/jonschlinkert/is-glob>
       *
       * Copyright (c) 2014-2017, Jon Schlinkert.
       * Released under the MIT License.
       */
      var r = s(435);
      var i = { "{": "}", "(": ")", "[": "]" };
      var strictCheck = function (t) {
        if (t[0] === "!") {
          return true;
        }
        var e = 0;
        var s = -2;
        var r = -2;
        var n = -2;
        var o = -2;
        var a = -2;
        while (e < t.length) {
          if (t[e] === "*") {
            return true;
          }
          if (t[e + 1] === "?" && /[\].+)]/.test(t[e])) {
            return true;
          }
          if (r !== -1 && t[e] === "[" && t[e + 1] !== "]") {
            if (r < e) {
              r = t.indexOf("]", e);
            }
            if (r > e) {
              if (a === -1 || a > r) {
                return true;
              }
              a = t.indexOf("\\", e);
              if (a === -1 || a > r) {
                return true;
              }
            }
          }
          if (n !== -1 && t[e] === "{" && t[e + 1] !== "}") {
            n = t.indexOf("}", e);
            if (n > e) {
              a = t.indexOf("\\", e);
              if (a === -1 || a > n) {
                return true;
              }
            }
          }
          if (
            o !== -1 &&
            t[e] === "(" &&
            t[e + 1] === "?" &&
            /[:!=]/.test(t[e + 2]) &&
            t[e + 3] !== ")"
          ) {
            o = t.indexOf(")", e);
            if (o > e) {
              a = t.indexOf("\\", e);
              if (a === -1 || a > o) {
                return true;
              }
            }
          }
          if (s !== -1 && t[e] === "(" && t[e + 1] !== "|") {
            if (s < e) {
              s = t.indexOf("|", e);
            }
            if (s !== -1 && t[s + 1] !== ")") {
              o = t.indexOf(")", s);
              if (o > s) {
                a = t.indexOf("\\", s);
                if (a === -1 || a > o) {
                  return true;
                }
              }
            }
          }
          if (t[e] === "\\") {
            var l = t[e + 1];
            e += 2;
            var u = i[l];
            if (u) {
              var c = t.indexOf(u, e);
              if (c !== -1) {
                e = c + 1;
              }
            }
            if (t[e] === "!") {
              return true;
            }
          } else {
            e++;
          }
        }
        return false;
      };
      var relaxedCheck = function (t) {
        if (t[0] === "!") {
          return true;
        }
        var e = 0;
        while (e < t.length) {
          if (/[*?{}()[\]]/.test(t[e])) {
            return true;
          }
          if (t[e] === "\\") {
            var s = t[e + 1];
            e += 2;
            var r = i[s];
            if (r) {
              var n = t.indexOf(r, e);
              if (n !== -1) {
                e = n + 1;
              }
            }
            if (t[e] === "!") {
              return true;
            }
          } else {
            e++;
          }
        }
        return false;
      };
      t.exports = function isGlob(t, e) {
        if (typeof t !== "string" || t === "") {
          return false;
        }
        if (r(t)) {
          return true;
        }
        var s = strictCheck;
        if (e && e.strict === false) {
          s = relaxedCheck;
        }
        return s(t);
      };
    },
    680: (t) => {
      "use strict";
      /*!
       * is-number <https://github.com/jonschlinkert/is-number>
       *
       * Copyright (c) 2014-present, Jon Schlinkert.
       * Released under the MIT License.
       */ t.exports = function (t) {
        if (typeof t === "number") {
          return t - t === 0;
        }
        if (typeof t === "string" && t.trim() !== "") {
          return Number.isFinite ? Number.isFinite(+t) : isFinite(+t);
        }
        return false;
      };
    },
    388: (t) => {
      /*!
       * normalize-path <https://github.com/jonschlinkert/normalize-path>
       *
       * Copyright (c) 2014-2018, Jon Schlinkert.
       * Released under the MIT License.
       */
      t.exports = function (t, e) {
        if (typeof t !== "string") {
          throw new TypeError("expected path to be a string");
        }
        if (t === "\\" || t === "/") return "/";
        var s = t.length;
        if (s <= 1) return t;
        var r = "";
        if (s > 4 && t[3] === "\\") {
          var i = t[2];
          if ((i === "?" || i === ".") && t.slice(0, 2) === "\\\\") {
            t = t.slice(2);
            r = "//";
          }
        }
        var n = t.split(/[/\\]+/);
        if (e !== false && n[n.length - 1] === "") {
          n.pop();
        }
        return r + n.join("/");
      };
    },
    569: (t, e, s) => {
      "use strict";
      t.exports = s(322);
    },
    99: (t, e, s) => {
      "use strict";
      const r = s(17);
      const i = "\\\\/";
      const n = `[^${i}]`;
      const o = "\\.";
      const a = "\\+";
      const l = "\\?";
      const u = "\\/";
      const c = "(?=.)";
      const f = "[^/]";
      const h = `(?:${u}|$)`;
      const p = `(?:^|${u})`;
      const d = `${o}{1,2}${h}`;
      const _ = `(?!${o})`;
      const E = `(?!${p}${d})`;
      const g = `(?!${o}{0,1}${h})`;
      const m = `(?!${d})`;
      const R = `[^.${u}]`;
      const y = `${f}*?`;
      const A = {
        DOT_LITERAL: o,
        PLUS_LITERAL: a,
        QMARK_LITERAL: l,
        SLASH_LITERAL: u,
        ONE_CHAR: c,
        QMARK: f,
        END_ANCHOR: h,
        DOTS_SLASH: d,
        NO_DOT: _,
        NO_DOTS: E,
        NO_DOT_SLASH: g,
        NO_DOTS_SLASH: m,
        QMARK_NO_DOT: R,
        STAR: y,
        START_ANCHOR: p,
      };
      const w = {
        ...A,
        SLASH_LITERAL: `[${i}]`,
        QMARK: n,
        STAR: `${n}*?`,
        DOTS_SLASH: `${o}{1,2}(?:[${i}]|$)`,
        NO_DOT: `(?!${o})`,
        NO_DOTS: `(?!(?:^|[${i}])${o}{1,2}(?:[${i}]|$))`,
        NO_DOT_SLASH: `(?!${o}{0,1}(?:[${i}]|$))`,
        NO_DOTS_SLASH: `(?!${o}{1,2}(?:[${i}]|$))`,
        QMARK_NO_DOT: `[^.${i}]`,
        START_ANCHOR: `(?:^|[${i}])`,
        END_ANCHOR: `(?:[${i}]|$)`,
      };
      const b = {
        alnum: "a-zA-Z0-9",
        alpha: "a-zA-Z",
        ascii: "\\x00-\\x7F",
        blank: " \\t",
        cntrl: "\\x00-\\x1F\\x7F",
        digit: "0-9",
        graph: "\\x21-\\x7E",
        lower: "a-z",
        print: "\\x20-\\x7E ",
        punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
        space: " \\t\\r\\n\\v\\f",
        upper: "A-Z",
        word: "A-Za-z0-9_",
        xdigit: "A-Fa-f0-9",
      };
      t.exports = {
        MAX_LENGTH: 1024 * 64,
        POSIX_REGEX_SOURCE: b,
        REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
        REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
        REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
        REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
        REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
        REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
        REPLACEMENTS: { "***": "*", "**/**": "**", "**/**/**": "**" },
        CHAR_0: 48,
        CHAR_9: 57,
        CHAR_UPPERCASE_A: 65,
        CHAR_LOWERCASE_A: 97,
        CHAR_UPPERCASE_Z: 90,
        CHAR_LOWERCASE_Z: 122,
        CHAR_LEFT_PARENTHESES: 40,
        CHAR_RIGHT_PARENTHESES: 41,
        CHAR_ASTERISK: 42,
        CHAR_AMPERSAND: 38,
        CHAR_AT: 64,
        CHAR_BACKWARD_SLASH: 92,
        CHAR_CARRIAGE_RETURN: 13,
        CHAR_CIRCUMFLEX_ACCENT: 94,
        CHAR_COLON: 58,
        CHAR_COMMA: 44,
        CHAR_DOT: 46,
        CHAR_DOUBLE_QUOTE: 34,
        CHAR_EQUAL: 61,
        CHAR_EXCLAMATION_MARK: 33,
        CHAR_FORM_FEED: 12,
        CHAR_FORWARD_SLASH: 47,
        CHAR_GRAVE_ACCENT: 96,
        CHAR_HASH: 35,
        CHAR_HYPHEN_MINUS: 45,
        CHAR_LEFT_ANGLE_BRACKET: 60,
        CHAR_LEFT_CURLY_BRACE: 123,
        CHAR_LEFT_SQUARE_BRACKET: 91,
        CHAR_LINE_FEED: 10,
        CHAR_NO_BREAK_SPACE: 160,
        CHAR_PERCENT: 37,
        CHAR_PLUS: 43,
        CHAR_QUESTION_MARK: 63,
        CHAR_RIGHT_ANGLE_BRACKET: 62,
        CHAR_RIGHT_CURLY_BRACE: 125,
        CHAR_RIGHT_SQUARE_BRACKET: 93,
        CHAR_SEMICOLON: 59,
        CHAR_SINGLE_QUOTE: 39,
        CHAR_SPACE: 32,
        CHAR_TAB: 9,
        CHAR_UNDERSCORE: 95,
        CHAR_VERTICAL_LINE: 124,
        CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
        SEP: r.sep,
        extglobChars(t) {
          return {
            "!": { type: "negate", open: "(?:(?!(?:", close: `))${t.STAR})` },
            "?": { type: "qmark", open: "(?:", close: ")?" },
            "+": { type: "plus", open: "(?:", close: ")+" },
            "*": { type: "star", open: "(?:", close: ")*" },
            "@": { type: "at", open: "(?:", close: ")" },
          };
        },
        globChars(t) {
          return t === true ? w : A;
        },
      };
    },
    139: (t, e, s) => {
      "use strict";
      const r = s(99);
      const i = s(479);
      const {
        MAX_LENGTH: n,
        POSIX_REGEX_SOURCE: o,
        REGEX_NON_SPECIAL_CHARS: a,
        REGEX_SPECIAL_CHARS_BACKREF: l,
        REPLACEMENTS: u,
      } = r;
      const expandRange = (t, e) => {
        if (typeof e.expandRange === "function") {
          return e.expandRange(...t, e);
        }
        t.sort();
        const s = `[${t.join("-")}]`;
        try {
          new RegExp(s);
        } catch (e) {
          return t.map((t) => i.escapeRegex(t)).join("..");
        }
        return s;
      };
      const syntaxError = (t, e) =>
        `Missing ${t}: "${e}" - use "\\\\${e}" to match literal characters`;
      const parse = (t, e) => {
        if (typeof t !== "string") {
          throw new TypeError("Expected a string");
        }
        t = u[t] || t;
        const s = { ...e };
        const c = typeof s.maxLength === "number" ? Math.min(n, s.maxLength) : n;
        let f = t.length;
        if (f > c) {
          throw new SyntaxError(`Input length: ${f}, exceeds maximum allowed length: ${c}`);
        }
        const h = { type: "bos", value: "", output: s.prepend || "" };
        const p = [h];
        const d = s.capture ? "" : "?:";
        const _ = i.isWindows(e);
        const E = r.globChars(_);
        const g = r.extglobChars(E);
        const {
          DOT_LITERAL: m,
          PLUS_LITERAL: R,
          SLASH_LITERAL: y,
          ONE_CHAR: A,
          DOTS_SLASH: w,
          NO_DOT: b,
          NO_DOT_SLASH: S,
          NO_DOTS_SLASH: v,
          QMARK: C,
          QMARK_NO_DOT: x,
          STAR: T,
          START_ANCHOR: H,
        } = E;
        const globstar = (t) => `(${d}(?:(?!${H}${t.dot ? w : m}).)*?)`;
        const O = s.dot ? "" : b;
        const P = s.dot ? C : x;
        let L = s.bash === true ? globstar(s) : T;
        if (s.capture) {
          L = `(${L})`;
        }
        if (typeof s.noext === "boolean") {
          s.noextglob = s.noext;
        }
        const N = {
          input: t,
          index: -1,
          start: 0,
          dot: s.dot === true,
          consumed: "",
          output: "",
          prefix: "",
          backtrack: false,
          negated: false,
          brackets: 0,
          braces: 0,
          parens: 0,
          quotes: 0,
          globstar: false,
          tokens: p,
        };
        t = i.removePrefix(t, N);
        f = t.length;
        const I = [];
        const k = [];
        const $ = [];
        let D = h;
        let F;
        const eos = () => N.index === f - 1;
        const M = (N.peek = (e = 1) => t[N.index + e]);
        const W = (N.advance = () => t[++N.index] || "");
        const remaining = () => t.slice(N.index + 1);
        const consume = (t = "", e = 0) => {
          N.consumed += t;
          N.index += e;
        };
        const append = (t) => {
          N.output += t.output != null ? t.output : t.value;
          consume(t.value);
        };
        const negate = () => {
          let t = 1;
          while (M() === "!" && (M(2) !== "(" || M(3) === "?")) {
            W();
            N.start++;
            t++;
          }
          if (t % 2 === 0) {
            return false;
          }
          N.negated = true;
          N.start++;
          return true;
        };
        const increment = (t) => {
          N[t]++;
          $.push(t);
        };
        const decrement = (t) => {
          N[t]--;
          $.pop();
        };
        const push = (t) => {
          if (D.type === "globstar") {
            const e = N.braces > 0 && (t.type === "comma" || t.type === "brace");
            const s = t.extglob === true || (I.length && (t.type === "pipe" || t.type === "paren"));
            if (t.type !== "slash" && t.type !== "paren" && !e && !s) {
              N.output = N.output.slice(0, -D.output.length);
              D.type = "star";
              D.value = "*";
              D.output = L;
              N.output += D.output;
            }
          }
          if (I.length && t.type !== "paren") {
            I[I.length - 1].inner += t.value;
          }
          if (t.value || t.output) append(t);
          if (D && D.type === "text" && t.type === "text") {
            D.value += t.value;
            D.output = (D.output || "") + t.value;
            return;
          }
          t.prev = D;
          p.push(t);
          D = t;
        };
        const extglobOpen = (t, e) => {
          const r = { ...g[e], conditions: 1, inner: "" };
          r.prev = D;
          r.parens = N.parens;
          r.output = N.output;
          const i = (s.capture ? "(" : "") + r.open;
          increment("parens");
          push({ type: t, value: e, output: N.output ? "" : A });
          push({ type: "paren", extglob: true, value: W(), output: i });
          I.push(r);
        };
        const extglobClose = (t) => {
          let r = t.close + (s.capture ? ")" : "");
          let i;
          if (t.type === "negate") {
            let n = L;
            if (t.inner && t.inner.length > 1 && t.inner.includes("/")) {
              n = globstar(s);
            }
            if (n !== L || eos() || /^\)+$/.test(remaining())) {
              r = t.close = `)$))${n}`;
            }
            if (t.inner.includes("*") && (i = remaining()) && /^\.[^\\/.]+$/.test(i)) {
              const s = parse(i, { ...e, fastpaths: false }).output;
              r = t.close = `)${s})${n})`;
            }
            if (t.prev.type === "bos") {
              N.negatedExtglob = true;
            }
          }
          push({ type: "paren", extglob: true, value: F, output: r });
          decrement("parens");
        };
        if (s.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(t)) {
          let r = false;
          let n = t.replace(l, (t, e, s, i, n, o) => {
            if (i === "\\") {
              r = true;
              return t;
            }
            if (i === "?") {
              if (e) {
                return e + i + (n ? C.repeat(n.length) : "");
              }
              if (o === 0) {
                return P + (n ? C.repeat(n.length) : "");
              }
              return C.repeat(s.length);
            }
            if (i === ".") {
              return m.repeat(s.length);
            }
            if (i === "*") {
              if (e) {
                return e + i + (n ? L : "");
              }
              return L;
            }
            return e ? t : `\\${t}`;
          });
          if (r === true) {
            if (s.unescape === true) {
              n = n.replace(/\\/g, "");
            } else {
              n = n.replace(/\\+/g, (t) => (t.length % 2 === 0 ? "\\\\" : t ? "\\" : ""));
            }
          }
          if (n === t && s.contains === true) {
            N.output = t;
            return N;
          }
          N.output = i.wrapOutput(n, N, e);
          return N;
        }
        while (!eos()) {
          F = W();
          if (F === "\0") {
            continue;
          }
          if (F === "\\") {
            const t = M();
            if (t === "/" && s.bash !== true) {
              continue;
            }
            if (t === "." || t === ";") {
              continue;
            }
            if (!t) {
              F += "\\";
              push({ type: "text", value: F });
              continue;
            }
            const e = /^\\+/.exec(remaining());
            let r = 0;
            if (e && e[0].length > 2) {
              r = e[0].length;
              N.index += r;
              if (r % 2 !== 0) {
                F += "\\";
              }
            }
            if (s.unescape === true) {
              F = W();
            } else {
              F += W();
            }
            if (N.brackets === 0) {
              push({ type: "text", value: F });
              continue;
            }
          }
          if (N.brackets > 0 && (F !== "]" || D.value === "[" || D.value === "[^")) {
            if (s.posix !== false && F === ":") {
              const t = D.value.slice(1);
              if (t.includes("[")) {
                D.posix = true;
                if (t.includes(":")) {
                  const t = D.value.lastIndexOf("[");
                  const e = D.value.slice(0, t);
                  const s = D.value.slice(t + 2);
                  const r = o[s];
                  if (r) {
                    D.value = e + r;
                    N.backtrack = true;
                    W();
                    if (!h.output && p.indexOf(D) === 1) {
                      h.output = A;
                    }
                    continue;
                  }
                }
              }
            }
            if ((F === "[" && M() !== ":") || (F === "-" && M() === "]")) {
              F = `\\${F}`;
            }
            if (F === "]" && (D.value === "[" || D.value === "[^")) {
              F = `\\${F}`;
            }
            if (s.posix === true && F === "!" && D.value === "[") {
              F = "^";
            }
            D.value += F;
            append({ value: F });
            continue;
          }
          if (N.quotes === 1 && F !== '"') {
            F = i.escapeRegex(F);
            D.value += F;
            append({ value: F });
            continue;
          }
          if (F === '"') {
            N.quotes = N.quotes === 1 ? 0 : 1;
            if (s.keepQuotes === true) {
              push({ type: "text", value: F });
            }
            continue;
          }
          if (F === "(") {
            increment("parens");
            push({ type: "paren", value: F });
            continue;
          }
          if (F === ")") {
            if (N.parens === 0 && s.strictBrackets === true) {
              throw new SyntaxError(syntaxError("opening", "("));
            }
            const t = I[I.length - 1];
            if (t && N.parens === t.parens + 1) {
              extglobClose(I.pop());
              continue;
            }
            push({ type: "paren", value: F, output: N.parens ? ")" : "\\)" });
            decrement("parens");
            continue;
          }
          if (F === "[") {
            if (s.nobracket === true || !remaining().includes("]")) {
              if (s.nobracket !== true && s.strictBrackets === true) {
                throw new SyntaxError(syntaxError("closing", "]"));
              }
              F = `\\${F}`;
            } else {
              increment("brackets");
            }
            push({ type: "bracket", value: F });
            continue;
          }
          if (F === "]") {
            if (s.nobracket === true || (D && D.type === "bracket" && D.value.length === 1)) {
              push({ type: "text", value: F, output: `\\${F}` });
              continue;
            }
            if (N.brackets === 0) {
              if (s.strictBrackets === true) {
                throw new SyntaxError(syntaxError("opening", "["));
              }
              push({ type: "text", value: F, output: `\\${F}` });
              continue;
            }
            decrement("brackets");
            const t = D.value.slice(1);
            if (D.posix !== true && t[0] === "^" && !t.includes("/")) {
              F = `/${F}`;
            }
            D.value += F;
            append({ value: F });
            if (s.literalBrackets === false || i.hasRegexChars(t)) {
              continue;
            }
            const e = i.escapeRegex(D.value);
            N.output = N.output.slice(0, -D.value.length);
            if (s.literalBrackets === true) {
              N.output += e;
              D.value = e;
              continue;
            }
            D.value = `(${d}${e}|${D.value})`;
            N.output += D.value;
            continue;
          }
          if (F === "{" && s.nobrace !== true) {
            increment("braces");
            const t = {
              type: "brace",
              value: F,
              output: "(",
              outputIndex: N.output.length,
              tokensIndex: N.tokens.length,
            };
            k.push(t);
            push(t);
            continue;
          }
          if (F === "}") {
            const t = k[k.length - 1];
            if (s.nobrace === true || !t) {
              push({ type: "text", value: F, output: F });
              continue;
            }
            let e = ")";
            if (t.dots === true) {
              const t = p.slice();
              const r = [];
              for (let e = t.length - 1; e >= 0; e--) {
                p.pop();
                if (t[e].type === "brace") {
                  break;
                }
                if (t[e].type !== "dots") {
                  r.unshift(t[e].value);
                }
              }
              e = expandRange(r, s);
              N.backtrack = true;
            }
            if (t.comma !== true && t.dots !== true) {
              const s = N.output.slice(0, t.outputIndex);
              const r = N.tokens.slice(t.tokensIndex);
              t.value = t.output = "\\{";
              F = e = "\\}";
              N.output = s;
              for (const t of r) {
                N.output += t.output || t.value;
              }
            }
            push({ type: "brace", value: F, output: e });
            decrement("braces");
            k.pop();
            continue;
          }
          if (F === "|") {
            if (I.length > 0) {
              I[I.length - 1].conditions++;
            }
            push({ type: "text", value: F });
            continue;
          }
          if (F === ",") {
            let t = F;
            const e = k[k.length - 1];
            if (e && $[$.length - 1] === "braces") {
              e.comma = true;
              t = "|";
            }
            push({ type: "comma", value: F, output: t });
            continue;
          }
          if (F === "/") {
            if (D.type === "dot" && N.index === N.start + 1) {
              N.start = N.index + 1;
              N.consumed = "";
              N.output = "";
              p.pop();
              D = h;
              continue;
            }
            push({ type: "slash", value: F, output: y });
            continue;
          }
          if (F === ".") {
            if (N.braces > 0 && D.type === "dot") {
              if (D.value === ".") D.output = m;
              const t = k[k.length - 1];
              D.type = "dots";
              D.output += F;
              D.value += F;
              t.dots = true;
              continue;
            }
            if (N.braces + N.parens === 0 && D.type !== "bos" && D.type !== "slash") {
              push({ type: "text", value: F, output: m });
              continue;
            }
            push({ type: "dot", value: F, output: m });
            continue;
          }
          if (F === "?") {
            const t = D && D.value === "(";
            if (!t && s.noextglob !== true && M() === "(" && M(2) !== "?") {
              extglobOpen("qmark", F);
              continue;
            }
            if (D && D.type === "paren") {
              const t = M();
              let e = F;
              if (t === "<" && !i.supportsLookbehinds()) {
                throw new Error("Node.js v10 or higher is required for regex lookbehinds");
              }
              if (
                (D.value === "(" && !/[!=<:]/.test(t)) ||
                (t === "<" && !/<([!=]|\w+>)/.test(remaining()))
              ) {
                e = `\\${F}`;
              }
              push({ type: "text", value: F, output: e });
              continue;
            }
            if (s.dot !== true && (D.type === "slash" || D.type === "bos")) {
              push({ type: "qmark", value: F, output: x });
              continue;
            }
            push({ type: "qmark", value: F, output: C });
            continue;
          }
          if (F === "!") {
            if (s.noextglob !== true && M() === "(") {
              if (M(2) !== "?" || !/[!=<:]/.test(M(3))) {
                extglobOpen("negate", F);
                continue;
              }
            }
            if (s.nonegate !== true && N.index === 0) {
              negate();
              continue;
            }
          }
          if (F === "+") {
            if (s.noextglob !== true && M() === "(" && M(2) !== "?") {
              extglobOpen("plus", F);
              continue;
            }
            if ((D && D.value === "(") || s.regex === false) {
              push({ type: "plus", value: F, output: R });
              continue;
            }
            if (
              (D && (D.type === "bracket" || D.type === "paren" || D.type === "brace")) ||
              N.parens > 0
            ) {
              push({ type: "plus", value: F });
              continue;
            }
            push({ type: "plus", value: R });
            continue;
          }
          if (F === "@") {
            if (s.noextglob !== true && M() === "(" && M(2) !== "?") {
              push({ type: "at", extglob: true, value: F, output: "" });
              continue;
            }
            push({ type: "text", value: F });
            continue;
          }
          if (F !== "*") {
            if (F === "$" || F === "^") {
              F = `\\${F}`;
            }
            const t = a.exec(remaining());
            if (t) {
              F += t[0];
              N.index += t[0].length;
            }
            push({ type: "text", value: F });
            continue;
          }
          if (D && (D.type === "globstar" || D.star === true)) {
            D.type = "star";
            D.star = true;
            D.value += F;
            D.output = L;
            N.backtrack = true;
            N.globstar = true;
            consume(F);
            continue;
          }
          let e = remaining();
          if (s.noextglob !== true && /^\([^?]/.test(e)) {
            extglobOpen("star", F);
            continue;
          }
          if (D.type === "star") {
            if (s.noglobstar === true) {
              consume(F);
              continue;
            }
            const r = D.prev;
            const i = r.prev;
            const n = r.type === "slash" || r.type === "bos";
            const o = i && (i.type === "star" || i.type === "globstar");
            if (s.bash === true && (!n || (e[0] && e[0] !== "/"))) {
              push({ type: "star", value: F, output: "" });
              continue;
            }
            const a = N.braces > 0 && (r.type === "comma" || r.type === "brace");
            const l = I.length && (r.type === "pipe" || r.type === "paren");
            if (!n && r.type !== "paren" && !a && !l) {
              push({ type: "star", value: F, output: "" });
              continue;
            }
            while (e.slice(0, 3) === "/**") {
              const s = t[N.index + 4];
              if (s && s !== "/") {
                break;
              }
              e = e.slice(3);
              consume("/**", 3);
            }
            if (r.type === "bos" && eos()) {
              D.type = "globstar";
              D.value += F;
              D.output = globstar(s);
              N.output = D.output;
              N.globstar = true;
              consume(F);
              continue;
            }
            if (r.type === "slash" && r.prev.type !== "bos" && !o && eos()) {
              N.output = N.output.slice(0, -(r.output + D.output).length);
              r.output = `(?:${r.output}`;
              D.type = "globstar";
              D.output = globstar(s) + (s.strictSlashes ? ")" : "|$)");
              D.value += F;
              N.globstar = true;
              N.output += r.output + D.output;
              consume(F);
              continue;
            }
            if (r.type === "slash" && r.prev.type !== "bos" && e[0] === "/") {
              const t = e[1] !== void 0 ? "|$" : "";
              N.output = N.output.slice(0, -(r.output + D.output).length);
              r.output = `(?:${r.output}`;
              D.type = "globstar";
              D.output = `${globstar(s)}${y}|${y}${t})`;
              D.value += F;
              N.output += r.output + D.output;
              N.globstar = true;
              consume(F + W());
              push({ type: "slash", value: "/", output: "" });
              continue;
            }
            if (r.type === "bos" && e[0] === "/") {
              D.type = "globstar";
              D.value += F;
              D.output = `(?:^|${y}|${globstar(s)}${y})`;
              N.output = D.output;
              N.globstar = true;
              consume(F + W());
              push({ type: "slash", value: "/", output: "" });
              continue;
            }
            N.output = N.output.slice(0, -D.output.length);
            D.type = "globstar";
            D.output = globstar(s);
            D.value += F;
            N.output += D.output;
            N.globstar = true;
            consume(F);
            continue;
          }
          const r = { type: "star", value: F, output: L };
          if (s.bash === true) {
            r.output = ".*?";
            if (D.type === "bos" || D.type === "slash") {
              r.output = O + r.output;
            }
            push(r);
            continue;
          }
          if (D && (D.type === "bracket" || D.type === "paren") && s.regex === true) {
            r.output = F;
            push(r);
            continue;
          }
          if (N.index === N.start || D.type === "slash" || D.type === "dot") {
            if (D.type === "dot") {
              N.output += S;
              D.output += S;
            } else if (s.dot === true) {
              N.output += v;
              D.output += v;
            } else {
              N.output += O;
              D.output += O;
            }
            if (M() !== "*") {
              N.output += A;
              D.output += A;
            }
          }
          push(r);
        }
        while (N.brackets > 0) {
          if (s.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
          N.output = i.escapeLast(N.output, "[");
          decrement("brackets");
        }
        while (N.parens > 0) {
          if (s.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
          N.output = i.escapeLast(N.output, "(");
          decrement("parens");
        }
        while (N.braces > 0) {
          if (s.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
          N.output = i.escapeLast(N.output, "{");
          decrement("braces");
        }
        if (s.strictSlashes !== true && (D.type === "star" || D.type === "bracket")) {
          push({ type: "maybe_slash", value: "", output: `${y}?` });
        }
        if (N.backtrack === true) {
          N.output = "";
          for (const t of N.tokens) {
            N.output += t.output != null ? t.output : t.value;
            if (t.suffix) {
              N.output += t.suffix;
            }
          }
        }
        return N;
      };
      parse.fastpaths = (t, e) => {
        const s = { ...e };
        const o = typeof s.maxLength === "number" ? Math.min(n, s.maxLength) : n;
        const a = t.length;
        if (a > o) {
          throw new SyntaxError(`Input length: ${a}, exceeds maximum allowed length: ${o}`);
        }
        t = u[t] || t;
        const l = i.isWindows(e);
        const {
          DOT_LITERAL: c,
          SLASH_LITERAL: f,
          ONE_CHAR: h,
          DOTS_SLASH: p,
          NO_DOT: d,
          NO_DOTS: _,
          NO_DOTS_SLASH: E,
          STAR: g,
          START_ANCHOR: m,
        } = r.globChars(l);
        const R = s.dot ? _ : d;
        const y = s.dot ? E : d;
        const A = s.capture ? "" : "?:";
        const w = { negated: false, prefix: "" };
        let b = s.bash === true ? ".*?" : g;
        if (s.capture) {
          b = `(${b})`;
        }
        const globstar = (t) => {
          if (t.noglobstar === true) return b;
          return `(${A}(?:(?!${m}${t.dot ? p : c}).)*?)`;
        };
        const create = (t) => {
          switch (t) {
            case "*":
              return `${R}${h}${b}`;
            case ".*":
              return `${c}${h}${b}`;
            case "*.*":
              return `${R}${b}${c}${h}${b}`;
            case "*/*":
              return `${R}${b}${f}${h}${y}${b}`;
            case "**":
              return R + globstar(s);
            case "**/*":
              return `(?:${R}${globstar(s)}${f})?${y}${h}${b}`;
            case "**/*.*":
              return `(?:${R}${globstar(s)}${f})?${y}${b}${c}${h}${b}`;
            case "**/.*":
              return `(?:${R}${globstar(s)}${f})?${c}${h}${b}`;
            default: {
              const e = /^(.*?)\.(\w+)$/.exec(t);
              if (!e) return;
              const s = create(e[1]);
              if (!s) return;
              return s + c + e[2];
            }
          }
        };
        const S = i.removePrefix(t, w);
        let v = create(S);
        if (v && s.strictSlashes !== true) {
          v += `${f}?`;
        }
        return v;
      };
      t.exports = parse;
    },
    322: (t, e, s) => {
      "use strict";
      const r = s(17);
      const i = s(429);
      const n = s(139);
      const o = s(479);
      const a = s(99);
      const isObject = (t) => t && typeof t === "object" && !Array.isArray(t);
      const picomatch = (t, e, s = false) => {
        if (Array.isArray(t)) {
          const r = t.map((t) => picomatch(t, e, s));
          const arrayMatcher = (t) => {
            for (const e of r) {
              const s = e(t);
              if (s) return s;
            }
            return false;
          };
          return arrayMatcher;
        }
        const r = isObject(t) && t.tokens && t.input;
        if (t === "" || (typeof t !== "string" && !r)) {
          throw new TypeError("Expected pattern to be a non-empty string");
        }
        const i = e || {};
        const n = o.isWindows(e);
        const a = r ? picomatch.compileRe(t, e) : picomatch.makeRe(t, e, false, true);
        const l = a.state;
        delete a.state;
        let isIgnored = () => false;
        if (i.ignore) {
          const t = { ...e, ignore: null, onMatch: null, onResult: null };
          isIgnored = picomatch(i.ignore, t, s);
        }
        const matcher = (s, r = false) => {
          const {
            isMatch: o,
            match: u,
            output: c,
          } = picomatch.test(s, a, e, { glob: t, posix: n });
          const f = {
            glob: t,
            state: l,
            regex: a,
            posix: n,
            input: s,
            output: c,
            match: u,
            isMatch: o,
          };
          if (typeof i.onResult === "function") {
            i.onResult(f);
          }
          if (o === false) {
            f.isMatch = false;
            return r ? f : false;
          }
          if (isIgnored(s)) {
            if (typeof i.onIgnore === "function") {
              i.onIgnore(f);
            }
            f.isMatch = false;
            return r ? f : false;
          }
          if (typeof i.onMatch === "function") {
            i.onMatch(f);
          }
          return r ? f : true;
        };
        if (s) {
          matcher.state = l;
        }
        return matcher;
      };
      picomatch.test = (t, e, s, { glob: r, posix: i } = {}) => {
        if (typeof t !== "string") {
          throw new TypeError("Expected input to be a string");
        }
        if (t === "") {
          return { isMatch: false, output: "" };
        }
        const n = s || {};
        const a = n.format || (i ? o.toPosixSlashes : null);
        let l = t === r;
        let u = l && a ? a(t) : t;
        if (l === false) {
          u = a ? a(t) : t;
          l = u === r;
        }
        if (l === false || n.capture === true) {
          if (n.matchBase === true || n.basename === true) {
            l = picomatch.matchBase(t, e, s, i);
          } else {
            l = e.exec(u);
          }
        }
        return { isMatch: Boolean(l), match: l, output: u };
      };
      picomatch.matchBase = (t, e, s, i = o.isWindows(s)) => {
        const n = e instanceof RegExp ? e : picomatch.makeRe(e, s);
        return n.test(r.basename(t));
      };
      picomatch.isMatch = (t, e, s) => picomatch(e, s)(t);
      picomatch.parse = (t, e) => {
        if (Array.isArray(t)) return t.map((t) => picomatch.parse(t, e));
        return n(t, { ...e, fastpaths: false });
      };
      picomatch.scan = (t, e) => i(t, e);
      picomatch.compileRe = (t, e, s = false, r = false) => {
        if (s === true) {
          return t.output;
        }
        const i = e || {};
        const n = i.contains ? "" : "^";
        const o = i.contains ? "" : "$";
        let a = `${n}(?:${t.output})${o}`;
        if (t && t.negated === true) {
          a = `^(?!${a}).*$`;
        }
        const l = picomatch.toRegex(a, e);
        if (r === true) {
          l.state = t;
        }
        return l;
      };
      picomatch.makeRe = (t, e = {}, s = false, r = false) => {
        if (!t || typeof t !== "string") {
          throw new TypeError("Expected a non-empty string");
        }
        let i = { negated: false, fastpaths: true };
        if (e.fastpaths !== false && (t[0] === "." || t[0] === "*")) {
          i.output = n.fastpaths(t, e);
        }
        if (!i.output) {
          i = n(t, e);
        }
        return picomatch.compileRe(i, e, s, r);
      };
      picomatch.toRegex = (t, e) => {
        try {
          const s = e || {};
          return new RegExp(t, s.flags || (s.nocase ? "i" : ""));
        } catch (t) {
          if (e && e.debug === true) throw t;
          return /$^/;
        }
      };
      picomatch.constants = a;
      t.exports = picomatch;
    },
    429: (t, e, s) => {
      "use strict";
      const r = s(479);
      const {
        CHAR_ASTERISK: i,
        CHAR_AT: n,
        CHAR_BACKWARD_SLASH: o,
        CHAR_COMMA: a,
        CHAR_DOT: l,
        CHAR_EXCLAMATION_MARK: u,
        CHAR_FORWARD_SLASH: c,
        CHAR_LEFT_CURLY_BRACE: f,
        CHAR_LEFT_PARENTHESES: h,
        CHAR_LEFT_SQUARE_BRACKET: p,
        CHAR_PLUS: d,
        CHAR_QUESTION_MARK: _,
        CHAR_RIGHT_CURLY_BRACE: E,
        CHAR_RIGHT_PARENTHESES: g,
        CHAR_RIGHT_SQUARE_BRACKET: m,
      } = s(99);
      const isPathSeparator = (t) => t === c || t === o;
      const depth = (t) => {
        if (t.isPrefix !== true) {
          t.depth = t.isGlobstar ? Infinity : 1;
        }
      };
      const scan = (t, e) => {
        const s = e || {};
        const R = t.length - 1;
        const y = s.parts === true || s.scanToEnd === true;
        const A = [];
        const w = [];
        const b = [];
        let S = t;
        let v = -1;
        let C = 0;
        let x = 0;
        let T = false;
        let H = false;
        let O = false;
        let P = false;
        let L = false;
        let N = false;
        let I = false;
        let k = false;
        let $ = false;
        let D = false;
        let F = 0;
        let M;
        let W;
        let G = { value: "", depth: 0, isGlob: false };
        const eos = () => v >= R;
        const peek = () => S.charCodeAt(v + 1);
        const advance = () => {
          M = W;
          return S.charCodeAt(++v);
        };
        while (v < R) {
          W = advance();
          let t;
          if (W === o) {
            I = G.backslashes = true;
            W = advance();
            if (W === f) {
              N = true;
            }
            continue;
          }
          if (N === true || W === f) {
            F++;
            while (eos() !== true && (W = advance())) {
              if (W === o) {
                I = G.backslashes = true;
                advance();
                continue;
              }
              if (W === f) {
                F++;
                continue;
              }
              if (N !== true && W === l && (W = advance()) === l) {
                T = G.isBrace = true;
                O = G.isGlob = true;
                D = true;
                if (y === true) {
                  continue;
                }
                break;
              }
              if (N !== true && W === a) {
                T = G.isBrace = true;
                O = G.isGlob = true;
                D = true;
                if (y === true) {
                  continue;
                }
                break;
              }
              if (W === E) {
                F--;
                if (F === 0) {
                  N = false;
                  T = G.isBrace = true;
                  D = true;
                  break;
                }
              }
            }
            if (y === true) {
              continue;
            }
            break;
          }
          if (W === c) {
            A.push(v);
            w.push(G);
            G = { value: "", depth: 0, isGlob: false };
            if (D === true) continue;
            if (M === l && v === C + 1) {
              C += 2;
              continue;
            }
            x = v + 1;
            continue;
          }
          if (s.noext !== true) {
            const t = W === d || W === n || W === i || W === _ || W === u;
            if (t === true && peek() === h) {
              O = G.isGlob = true;
              P = G.isExtglob = true;
              D = true;
              if (W === u && v === C) {
                $ = true;
              }
              if (y === true) {
                while (eos() !== true && (W = advance())) {
                  if (W === o) {
                    I = G.backslashes = true;
                    W = advance();
                    continue;
                  }
                  if (W === g) {
                    O = G.isGlob = true;
                    D = true;
                    break;
                  }
                }
                continue;
              }
              break;
            }
          }
          if (W === i) {
            if (M === i) L = G.isGlobstar = true;
            O = G.isGlob = true;
            D = true;
            if (y === true) {
              continue;
            }
            break;
          }
          if (W === _) {
            O = G.isGlob = true;
            D = true;
            if (y === true) {
              continue;
            }
            break;
          }
          if (W === p) {
            while (eos() !== true && (t = advance())) {
              if (t === o) {
                I = G.backslashes = true;
                advance();
                continue;
              }
              if (t === m) {
                H = G.isBracket = true;
                O = G.isGlob = true;
                D = true;
                break;
              }
            }
            if (y === true) {
              continue;
            }
            break;
          }
          if (s.nonegate !== true && W === u && v === C) {
            k = G.negated = true;
            C++;
            continue;
          }
          if (s.noparen !== true && W === h) {
            O = G.isGlob = true;
            if (y === true) {
              while (eos() !== true && (W = advance())) {
                if (W === h) {
                  I = G.backslashes = true;
                  W = advance();
                  continue;
                }
                if (W === g) {
                  D = true;
                  break;
                }
              }
              continue;
            }
            break;
          }
          if (O === true) {
            D = true;
            if (y === true) {
              continue;
            }
            break;
          }
        }
        if (s.noext === true) {
          P = false;
          O = false;
        }
        let B = S;
        let U = "";
        let K = "";
        if (C > 0) {
          U = S.slice(0, C);
          S = S.slice(C);
          x -= C;
        }
        if (B && O === true && x > 0) {
          B = S.slice(0, x);
          K = S.slice(x);
        } else if (O === true) {
          B = "";
          K = S;
        } else {
          B = S;
        }
        if (B && B !== "" && B !== "/" && B !== S) {
          if (isPathSeparator(B.charCodeAt(B.length - 1))) {
            B = B.slice(0, -1);
          }
        }
        if (s.unescape === true) {
          if (K) K = r.removeBackslashes(K);
          if (B && I === true) {
            B = r.removeBackslashes(B);
          }
        }
        const V = {
          prefix: U,
          input: t,
          start: C,
          base: B,
          glob: K,
          isBrace: T,
          isBracket: H,
          isGlob: O,
          isExtglob: P,
          isGlobstar: L,
          negated: k,
          negatedExtglob: $,
        };
        if (s.tokens === true) {
          V.maxDepth = 0;
          if (!isPathSeparator(W)) {
            w.push(G);
          }
          V.tokens = w;
        }
        if (s.parts === true || s.tokens === true) {
          let e;
          for (let r = 0; r < A.length; r++) {
            const i = e ? e + 1 : C;
            const n = A[r];
            const o = t.slice(i, n);
            if (s.tokens) {
              if (r === 0 && C !== 0) {
                w[r].isPrefix = true;
                w[r].value = U;
              } else {
                w[r].value = o;
              }
              depth(w[r]);
              V.maxDepth += w[r].depth;
            }
            if (r !== 0 || o !== "") {
              b.push(o);
            }
            e = n;
          }
          if (e && e + 1 < t.length) {
            const r = t.slice(e + 1);
            b.push(r);
            if (s.tokens) {
              w[w.length - 1].value = r;
              depth(w[w.length - 1]);
              V.maxDepth += w[w.length - 1].depth;
            }
          }
          V.slashes = A;
          V.parts = b;
        }
        return V;
      };
      t.exports = scan;
    },
    479: (t, e, s) => {
      "use strict";
      const r = s(17);
      const i = process.platform === "win32";
      const {
        REGEX_BACKSLASH: n,
        REGEX_REMOVE_BACKSLASH: o,
        REGEX_SPECIAL_CHARS: a,
        REGEX_SPECIAL_CHARS_GLOBAL: l,
      } = s(99);
      e.isObject = (t) => t !== null && typeof t === "object" && !Array.isArray(t);
      e.hasRegexChars = (t) => a.test(t);
      e.isRegexChar = (t) => t.length === 1 && e.hasRegexChars(t);
      e.escapeRegex = (t) => t.replace(l, "\\$1");
      e.toPosixSlashes = (t) => t.replace(n, "/");
      e.removeBackslashes = (t) => t.replace(o, (t) => (t === "\\" ? "" : t));
      e.supportsLookbehinds = () => {
        const t = process.version.slice(1).split(".").map(Number);
        if ((t.length === 3 && t[0] >= 9) || (t[0] === 8 && t[1] >= 10)) {
          return true;
        }
        return false;
      };
      e.isWindows = (t) => {
        if (t && typeof t.windows === "boolean") {
          return t.windows;
        }
        return i === true || r.sep === "\\";
      };
      e.escapeLast = (t, s, r) => {
        const i = t.lastIndexOf(s, r);
        if (i === -1) return t;
        if (t[i - 1] === "\\") return e.escapeLast(t, s, i - 1);
        return `${t.slice(0, i)}\\${t.slice(i)}`;
      };
      e.removePrefix = (t, e = {}) => {
        let s = t;
        if (s.startsWith("./")) {
          s = s.slice(2);
          e.prefix = "./";
        }
        return s;
      };
      e.wrapOutput = (t, e = {}, s = {}) => {
        const r = s.contains ? "" : "^";
        const i = s.contains ? "" : "$";
        let n = `${r}(?:${t})${i}`;
        if (e.negated === true) {
          n = `(?:^(?!${n}).*$)`;
        }
        return n;
      };
    },
    556: (t, e, s) => {
      "use strict";
      const r = s(147);
      const { Readable: i } = s(781);
      const n = s(17);
      const { promisify: o } = s(837);
      const a = s(569);
      const l = o(r.readdir);
      const u = o(r.stat);
      const c = o(r.lstat);
      const f = o(r.realpath);
      const h = "!";
      const p = "READDIRP_RECURSIVE_ERROR";
      const d = new Set(["ENOENT", "EPERM", "EACCES", "ELOOP", p]);
      const _ = "files";
      const E = "directories";
      const g = "files_directories";
      const m = "all";
      const R = [_, E, g, m];
      const isNormalFlowError = (t) => d.has(t.code);
      const [y, A] = process.versions.node
        .split(".")
        .slice(0, 2)
        .map((t) => Number.parseInt(t, 10));
      const w = process.platform === "win32" && (y > 10 || (y === 10 && A >= 5));
      const normalizeFilter = (t) => {
        if (t === undefined) return;
        if (typeof t === "function") return t;
        if (typeof t === "string") {
          const e = a(t.trim());
          return (t) => e(t.basename);
        }
        if (Array.isArray(t)) {
          const e = [];
          const s = [];
          for (const r of t) {
            const t = r.trim();
            if (t.charAt(0) === h) {
              s.push(a(t.slice(1)));
            } else {
              e.push(a(t));
            }
          }
          if (s.length > 0) {
            if (e.length > 0) {
              return (t) => e.some((e) => e(t.basename)) && !s.some((e) => e(t.basename));
            }
            return (t) => !s.some((e) => e(t.basename));
          }
          return (t) => e.some((e) => e(t.basename));
        }
      };
      class ReaddirpStream extends i {
        static get defaultOptions() {
          return {
            root: ".",
            fileFilter: (t) => true,
            directoryFilter: (t) => true,
            type: _,
            lstat: false,
            depth: 2147483648,
            alwaysStat: false,
          };
        }
        constructor(t = {}) {
          super({ objectMode: true, autoDestroy: true, highWaterMark: t.highWaterMark || 4096 });
          const e = { ...ReaddirpStream.defaultOptions, ...t };
          const { root: s, type: i } = e;
          this._fileFilter = normalizeFilter(e.fileFilter);
          this._directoryFilter = normalizeFilter(e.directoryFilter);
          const o = e.lstat ? c : u;
          if (w) {
            this._stat = (t) => o(t, { bigint: true });
          } else {
            this._stat = o;
          }
          this._maxDepth = e.depth;
          this._wantsDir = [E, g, m].includes(i);
          this._wantsFile = [_, g, m].includes(i);
          this._wantsEverything = i === m;
          this._root = n.resolve(s);
          this._isDirent = "Dirent" in r && !e.alwaysStat;
          this._statsProp = this._isDirent ? "dirent" : "stats";
          this._rdOptions = { encoding: "utf8", withFileTypes: this._isDirent };
          this.parents = [this._exploreDir(s, 1)];
          this.reading = false;
          this.parent = undefined;
        }
        async _read(t) {
          if (this.reading) return;
          this.reading = true;
          try {
            while (!this.destroyed && t > 0) {
              const { path: e, depth: s, files: r = [] } = this.parent || {};
              if (r.length > 0) {
                const i = r.splice(0, t).map((t) => this._formatEntry(t, e));
                for (const e of await Promise.all(i)) {
                  if (this.destroyed) return;
                  const r = await this._getEntryType(e);
                  if (r === "directory" && this._directoryFilter(e)) {
                    if (s <= this._maxDepth) {
                      this.parents.push(this._exploreDir(e.fullPath, s + 1));
                    }
                    if (this._wantsDir) {
                      this.push(e);
                      t--;
                    }
                  } else if ((r === "file" || this._includeAsFile(e)) && this._fileFilter(e)) {
                    if (this._wantsFile) {
                      this.push(e);
                      t--;
                    }
                  }
                }
              } else {
                const t = this.parents.pop();
                if (!t) {
                  this.push(null);
                  break;
                }
                this.parent = await t;
                if (this.destroyed) return;
              }
            }
          } catch (t) {
            this.destroy(t);
          } finally {
            this.reading = false;
          }
        }
        async _exploreDir(t, e) {
          let s;
          try {
            s = await l(t, this._rdOptions);
          } catch (t) {
            this._onError(t);
          }
          return { files: s, depth: e, path: t };
        }
        async _formatEntry(t, e) {
          let s;
          try {
            const r = this._isDirent ? t.name : t;
            const i = n.resolve(n.join(e, r));
            s = { path: n.relative(this._root, i), fullPath: i, basename: r };
            s[this._statsProp] = this._isDirent ? t : await this._stat(i);
          } catch (t) {
            this._onError(t);
          }
          return s;
        }
        _onError(t) {
          if (isNormalFlowError(t) && !this.destroyed) {
            this.emit("warn", t);
          } else {
            this.destroy(t);
          }
        }
        async _getEntryType(t) {
          const e = t && t[this._statsProp];
          if (!e) {
            return;
          }
          if (e.isFile()) {
            return "file";
          }
          if (e.isDirectory()) {
            return "directory";
          }
          if (e && e.isSymbolicLink()) {
            const e = t.fullPath;
            try {
              const t = await f(e);
              const s = await c(t);
              if (s.isFile()) {
                return "file";
              }
              if (s.isDirectory()) {
                const s = t.length;
                if (e.startsWith(t) && e.substr(s, 1) === n.sep) {
                  const s = new Error(`Circular symlink detected: "${e}" points to "${t}"`);
                  s.code = p;
                  return this._onError(s);
                }
                return "directory";
              }
            } catch (t) {
              this._onError(t);
            }
          }
        }
        _includeAsFile(t) {
          const e = t && t[this._statsProp];
          return e && this._wantsEverything && !e.isDirectory();
        }
      }
      const readdirp = (t, e = {}) => {
        let s = e.entryType || e.type;
        if (s === "both") s = g;
        if (s) e.type = s;
        if (!t) {
          throw new Error("readdirp: root argument is required. Usage: readdirp(root, options)");
        } else if (typeof t !== "string") {
          throw new TypeError(
            "readdirp: root argument must be a string. Usage: readdirp(root, options)"
          );
        } else if (s && !R.includes(s)) {
          throw new Error(`readdirp: Invalid type passed. Use one of ${R.join(", ")}`);
        }
        e.root = t;
        return new ReaddirpStream(e);
      };
      const readdirpPromise = (t, e = {}) =>
        new Promise((s, r) => {
          const i = [];
          readdirp(t, e)
            .on("data", (t) => i.push(t))
            .on("end", () => s(i))
            .on("error", (t) => r(t));
        });
      readdirp.promise = readdirpPromise;
      readdirp.ReaddirpStream = ReaddirpStream;
      readdirp.default = readdirp;
      t.exports = readdirp;
    },
    861: (t, e, s) => {
      "use strict";
      /*!
       * to-regex-range <https://github.com/micromatch/to-regex-range>
       *
       * Copyright (c) 2015-present, Jon Schlinkert.
       * Released under the MIT License.
       */ const r = s(680);
      const toRegexRange = (t, e, s) => {
        if (r(t) === false) {
          throw new TypeError("toRegexRange: expected the first argument to be a number");
        }
        if (e === void 0 || t === e) {
          return String(t);
        }
        if (r(e) === false) {
          throw new TypeError("toRegexRange: expected the second argument to be a number.");
        }
        let i = { relaxZeros: true, ...s };
        if (typeof i.strictZeros === "boolean") {
          i.relaxZeros = i.strictZeros === false;
        }
        let n = String(i.relaxZeros);
        let o = String(i.shorthand);
        let a = String(i.capture);
        let l = String(i.wrap);
        let u = t + ":" + e + "=" + n + o + a + l;
        if (toRegexRange.cache.hasOwnProperty(u)) {
          return toRegexRange.cache[u].result;
        }
        let c = Math.min(t, e);
        let f = Math.max(t, e);
        if (Math.abs(c - f) === 1) {
          let s = t + "|" + e;
          if (i.capture) {
            return `(${s})`;
          }
          if (i.wrap === false) {
            return s;
          }
          return `(?:${s})`;
        }
        let h = hasPadding(t) || hasPadding(e);
        let p = { min: t, max: e, a: c, b: f };
        let d = [];
        let _ = [];
        if (h) {
          p.isPadded = h;
          p.maxLen = String(p.max).length;
        }
        if (c < 0) {
          let t = f < 0 ? Math.abs(f) : 1;
          _ = splitToPatterns(t, Math.abs(c), p, i);
          c = p.a = 0;
        }
        if (f >= 0) {
          d = splitToPatterns(c, f, p, i);
        }
        p.negatives = _;
        p.positives = d;
        p.result = collatePatterns(_, d, i);
        if (i.capture === true) {
          p.result = `(${p.result})`;
        } else if (i.wrap !== false && d.length + _.length > 1) {
          p.result = `(?:${p.result})`;
        }
        toRegexRange.cache[u] = p;
        return p.result;
      };
      function collatePatterns(t, e, s) {
        let r = filterPatterns(t, e, "-", false, s) || [];
        let i = filterPatterns(e, t, "", false, s) || [];
        let n = filterPatterns(t, e, "-?", true, s) || [];
        let o = r.concat(n).concat(i);
        return o.join("|");
      }
      function splitToRanges(t, e) {
        let s = 1;
        let r = 1;
        let i = countNines(t, s);
        let n = new Set([e]);
        while (t <= i && i <= e) {
          n.add(i);
          s += 1;
          i = countNines(t, s);
        }
        i = countZeros(e + 1, r) - 1;
        while (t < i && i <= e) {
          n.add(i);
          r += 1;
          i = countZeros(e + 1, r) - 1;
        }
        n = [...n];
        n.sort(compare);
        return n;
      }
      function rangeToPattern(t, e, s) {
        if (t === e) {
          return { pattern: t, count: [], digits: 0 };
        }
        let r = zip(t, e);
        let i = r.length;
        let n = "";
        let o = 0;
        for (let t = 0; t < i; t++) {
          let [e, i] = r[t];
          if (e === i) {
            n += e;
          } else if (e !== "0" || i !== "9") {
            n += toCharacterClass(e, i, s);
          } else {
            o++;
          }
        }
        if (o) {
          n += s.shorthand === true ? "\\d" : "[0-9]";
        }
        return { pattern: n, count: [o], digits: i };
      }
      function splitToPatterns(t, e, s, r) {
        let i = splitToRanges(t, e);
        let n = [];
        let o = t;
        let a;
        for (let t = 0; t < i.length; t++) {
          let e = i[t];
          let l = rangeToPattern(String(o), String(e), r);
          let u = "";
          if (!s.isPadded && a && a.pattern === l.pattern) {
            if (a.count.length > 1) {
              a.count.pop();
            }
            a.count.push(l.count[0]);
            a.string = a.pattern + toQuantifier(a.count);
            o = e + 1;
            continue;
          }
          if (s.isPadded) {
            u = padZeros(e, s, r);
          }
          l.string = u + l.pattern + toQuantifier(l.count);
          n.push(l);
          o = e + 1;
          a = l;
        }
        return n;
      }
      function filterPatterns(t, e, s, r, i) {
        let n = [];
        for (let i of t) {
          let { string: t } = i;
          if (!r && !contains(e, "string", t)) {
            n.push(s + t);
          }
          if (r && contains(e, "string", t)) {
            n.push(s + t);
          }
        }
        return n;
      }
      function zip(t, e) {
        let s = [];
        for (let r = 0; r < t.length; r++) s.push([t[r], e[r]]);
        return s;
      }
      function compare(t, e) {
        return t > e ? 1 : e > t ? -1 : 0;
      }
      function contains(t, e, s) {
        return t.some((t) => t[e] === s);
      }
      function countNines(t, e) {
        return Number(String(t).slice(0, -e) + "9".repeat(e));
      }
      function countZeros(t, e) {
        return t - (t % Math.pow(10, e));
      }
      function toQuantifier(t) {
        let [e = 0, s = ""] = t;
        if (s || e > 1) {
          return `{${e + (s ? "," + s : "")}}`;
        }
        return "";
      }
      function toCharacterClass(t, e, s) {
        return `[${t}${e - t === 1 ? "" : "-"}${e}]`;
      }
      function hasPadding(t) {
        return /^-?(0+)\d/.test(t);
      }
      function padZeros(t, e, s) {
        if (!e.isPadded) {
          return t;
        }
        let r = Math.abs(e.maxLen - String(t).length);
        let i = s.relaxZeros !== false;
        switch (r) {
          case 0:
            return "";
          case 1:
            return i ? "0?" : "0";
          case 2:
            return i ? "0{0,2}" : "00";
          default: {
            return i ? `0{0,${r}}` : `0{${r}}`;
          }
        }
      }
      toRegexRange.cache = {};
      toRegexRange.clearCache = () => (toRegexRange.cache = {});
      t.exports = toRegexRange;
    },
    149: (module) => {
      module.exports = eval("require")("fsevents");
    },
    361: (t) => {
      "use strict";
      t.exports = require("events");
    },
    147: (t) => {
      "use strict";
      t.exports = require("fs");
    },
    37: (t) => {
      "use strict";
      t.exports = require("os");
    },
    17: (t) => {
      "use strict";
      t.exports = require("path");
    },
    781: (t) => {
      "use strict";
      t.exports = require("stream");
    },
    837: (t) => {
      "use strict";
      t.exports = require("util");
    },
    133: (t) => {
      "use strict";
      t.exports = JSON.parse(
        '["3dm","3ds","3g2","3gp","7z","a","aac","adp","ai","aif","aiff","alz","ape","apk","appimage","ar","arj","asf","au","avi","bak","baml","bh","bin","bk","bmp","btif","bz2","bzip2","cab","caf","cgm","class","cmx","cpio","cr2","cur","dat","dcm","deb","dex","djvu","dll","dmg","dng","doc","docm","docx","dot","dotm","dra","DS_Store","dsk","dts","dtshd","dvb","dwg","dxf","ecelp4800","ecelp7470","ecelp9600","egg","eol","eot","epub","exe","f4v","fbs","fh","fla","flac","flatpak","fli","flv","fpx","fst","fvt","g3","gh","gif","graffle","gz","gzip","h261","h263","h264","icns","ico","ief","img","ipa","iso","jar","jpeg","jpg","jpgv","jpm","jxr","key","ktx","lha","lib","lvp","lz","lzh","lzma","lzo","m3u","m4a","m4v","mar","mdi","mht","mid","midi","mj2","mka","mkv","mmr","mng","mobi","mov","movie","mp3","mp4","mp4a","mpeg","mpg","mpga","mxu","nef","npx","numbers","nupkg","o","odp","ods","odt","oga","ogg","ogv","otf","ott","pages","pbm","pcx","pdb","pdf","pea","pgm","pic","png","pnm","pot","potm","potx","ppa","ppam","ppm","pps","ppsm","ppsx","ppt","pptm","pptx","psd","pya","pyc","pyo","pyv","qt","rar","ras","raw","resources","rgb","rip","rlc","rmf","rmvb","rpm","rtf","rz","s3m","s7z","scpt","sgi","shar","snap","sil","sketch","slk","smv","snk","so","stl","suo","sub","swf","tar","tbz","tbz2","tga","tgz","thmx","tif","tiff","tlz","ttc","ttf","txz","udf","uvh","uvi","uvm","uvp","uvs","uvu","viv","vob","war","wav","wax","wbmp","wdp","weba","webm","webp","whl","wim","wm","wma","wmv","wmx","woff","woff2","wrm","wvx","xbm","xif","xla","xlam","xls","xlsb","xlsm","xlsx","xlt","xltm","xltx","xm","xmind","xpi","xpm","xwd","xz","z","zip","zipx"]'
      );
    },
  };
  var __webpack_module_cache__ = {};
  function __nccwpck_require__(t) {
    var e = __webpack_module_cache__[t];
    if (e !== undefined) {
      return e.exports;
    }
    var s = (__webpack_module_cache__[t] = { exports: {} });
    var r = true;
    try {
      __webpack_modules__[t](s, s.exports, __nccwpck_require__);
      r = false;
    } finally {
      if (r) delete __webpack_module_cache__[t];
    }
    return s.exports;
  }
  if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = __dirname + "/";
  var __webpack_exports__ = {};
  (() => {
    const t = __nccwpck_require__(677);
    t.watch(".", { ignored: ["node_modules", ".git"], cwd: "." }).on("all", (t, e) => {
      console.log(t, e);
    });
  })();
  module.exports = __webpack_exports__;
})();
