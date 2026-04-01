var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { B as ke } from "./vendor-vue-BNgUlZKr.js";
let ep, zo, wt, Ps, Yh, ye, rp, _o, Jh, ee, Ie, re, Jr, Zh, Pr, Wc;
let __tla = (async () => {
  const $e = {
    messagePrefix: `Bitcoin Signed Message:
`,
    bech32: "bc",
    bip32: {
      public: 76067358,
      private: 76066276
    },
    pubKeyHash: 0,
    scriptHash: 5,
    wif: 128
  };
  function is(e) {
    if (e.length < 8 || e.length > 72 || e[0] !== 48 || e[1] !== e.length - 2 || e[2] !== 2) return false;
    const r = e[3];
    if (r === 0 || 5 + r >= e.length || e[4 + r] !== 2) return false;
    const t = e[5 + r];
    return !(t === 0 || 6 + r + t !== e.length || e[4] & 128 || r > 1 && e[4] === 0 && !(e[5] & 128) || e[r + 6] & 128 || t > 1 && e[r + 6] === 0 && !(e[r + 7] & 128));
  }
  function ss(e) {
    if (e.length < 8) throw new Error("DER sequence length is too short");
    if (e.length > 72) throw new Error("DER sequence length is too long");
    if (e[0] !== 48) throw new Error("Expected DER sequence");
    if (e[1] !== e.length - 2) throw new Error("DER sequence length is invalid");
    if (e[2] !== 2) throw new Error("Expected DER integer");
    const r = e[3];
    if (r === 0) throw new Error("R length is zero");
    if (5 + r >= e.length) throw new Error("R length is too long");
    if (e[4 + r] !== 2) throw new Error("Expected DER integer (2)");
    const t = e[5 + r];
    if (t === 0) throw new Error("S length is zero");
    if (6 + r + t !== e.length) throw new Error("S length is invalid");
    if (e[4] & 128) throw new Error("R value is negative");
    if (r > 1 && e[4] === 0 && !(e[5] & 128)) throw new Error("R value excessively padded");
    if (e[r + 6] & 128) throw new Error("S value is negative");
    if (t > 1 && e[r + 6] === 0 && !(e[r + 7] & 128)) throw new Error("S value excessively padded");
    return {
      r: e.slice(4, 4 + r),
      s: e.slice(6 + r)
    };
  }
  function cs(e, r) {
    const t = e.length, o = r.length;
    if (t === 0) throw new Error("R length is zero");
    if (o === 0) throw new Error("S length is zero");
    if (t > 33) throw new Error("R length is too long");
    if (o > 33) throw new Error("S length is too long");
    if (e[0] & 128) throw new Error("R value is negative");
    if (r[0] & 128) throw new Error("S value is negative");
    if (t > 1 && e[0] === 0 && !(e[1] & 128)) throw new Error("R value excessively padded");
    if (o > 1 && r[0] === 0 && !(r[1] & 128)) throw new Error("S value excessively padded");
    const a = new Uint8Array(6 + t + o);
    return a[0] = 48, a[1] = a.length - 2, a[2] = 2, a[3] = e.length, a.set(e, 4), a[4 + t] = 2, a[5 + t] = r.length, a.set(r, 6 + t), a;
  }
  var q;
  (function(e) {
    e[e.OP_FALSE = 0] = "OP_FALSE", e[e.OP_0 = 0] = "OP_0", e[e.OP_PUSHDATA1 = 76] = "OP_PUSHDATA1", e[e.OP_PUSHDATA2 = 77] = "OP_PUSHDATA2", e[e.OP_PUSHDATA4 = 78] = "OP_PUSHDATA4", e[e.OP_1NEGATE = 79] = "OP_1NEGATE", e[e.OP_RESERVED = 80] = "OP_RESERVED", e[e.OP_TRUE = 81] = "OP_TRUE", e[e.OP_1 = 81] = "OP_1", e[e.OP_2 = 82] = "OP_2", e[e.OP_3 = 83] = "OP_3", e[e.OP_4 = 84] = "OP_4", e[e.OP_5 = 85] = "OP_5", e[e.OP_6 = 86] = "OP_6", e[e.OP_7 = 87] = "OP_7", e[e.OP_8 = 88] = "OP_8", e[e.OP_9 = 89] = "OP_9", e[e.OP_10 = 90] = "OP_10", e[e.OP_11 = 91] = "OP_11", e[e.OP_12 = 92] = "OP_12", e[e.OP_13 = 93] = "OP_13", e[e.OP_14 = 94] = "OP_14", e[e.OP_15 = 95] = "OP_15", e[e.OP_16 = 96] = "OP_16", e[e.OP_NOP = 97] = "OP_NOP", e[e.OP_VER = 98] = "OP_VER", e[e.OP_IF = 99] = "OP_IF", e[e.OP_NOTIF = 100] = "OP_NOTIF", e[e.OP_VERIF = 101] = "OP_VERIF", e[e.OP_VERNOTIF = 102] = "OP_VERNOTIF", e[e.OP_ELSE = 103] = "OP_ELSE", e[e.OP_ENDIF = 104] = "OP_ENDIF", e[e.OP_VERIFY = 105] = "OP_VERIFY", e[e.OP_RETURN = 106] = "OP_RETURN", e[e.OP_TOALTSTACK = 107] = "OP_TOALTSTACK", e[e.OP_FROMALTSTACK = 108] = "OP_FROMALTSTACK", e[e.OP_2DROP = 109] = "OP_2DROP", e[e.OP_2DUP = 110] = "OP_2DUP", e[e.OP_3DUP = 111] = "OP_3DUP", e[e.OP_2OVER = 112] = "OP_2OVER", e[e.OP_2ROT = 113] = "OP_2ROT", e[e.OP_2SWAP = 114] = "OP_2SWAP", e[e.OP_IFDUP = 115] = "OP_IFDUP", e[e.OP_DEPTH = 116] = "OP_DEPTH", e[e.OP_DROP = 117] = "OP_DROP", e[e.OP_DUP = 118] = "OP_DUP", e[e.OP_NIP = 119] = "OP_NIP", e[e.OP_OVER = 120] = "OP_OVER", e[e.OP_PICK = 121] = "OP_PICK", e[e.OP_ROLL = 122] = "OP_ROLL", e[e.OP_ROT = 123] = "OP_ROT", e[e.OP_SWAP = 124] = "OP_SWAP", e[e.OP_TUCK = 125] = "OP_TUCK", e[e.OP_CAT = 126] = "OP_CAT", e[e.OP_SUBSTR = 127] = "OP_SUBSTR", e[e.OP_LEFT = 128] = "OP_LEFT", e[e.OP_RIGHT = 129] = "OP_RIGHT", e[e.OP_SIZE = 130] = "OP_SIZE", e[e.OP_INVERT = 131] = "OP_INVERT", e[e.OP_AND = 132] = "OP_AND", e[e.OP_OR = 133] = "OP_OR", e[e.OP_XOR = 134] = "OP_XOR", e[e.OP_EQUAL = 135] = "OP_EQUAL", e[e.OP_EQUALVERIFY = 136] = "OP_EQUALVERIFY", e[e.OP_RESERVED1 = 137] = "OP_RESERVED1", e[e.OP_RESERVED2 = 138] = "OP_RESERVED2", e[e.OP_1ADD = 139] = "OP_1ADD", e[e.OP_1SUB = 140] = "OP_1SUB", e[e.OP_2MUL = 141] = "OP_2MUL", e[e.OP_2DIV = 142] = "OP_2DIV", e[e.OP_NEGATE = 143] = "OP_NEGATE", e[e.OP_ABS = 144] = "OP_ABS", e[e.OP_NOT = 145] = "OP_NOT", e[e.OP_0NOTEQUAL = 146] = "OP_0NOTEQUAL", e[e.OP_ADD = 147] = "OP_ADD", e[e.OP_SUB = 148] = "OP_SUB", e[e.OP_MUL = 149] = "OP_MUL", e[e.OP_DIV = 150] = "OP_DIV", e[e.OP_MOD = 151] = "OP_MOD", e[e.OP_LSHIFT = 152] = "OP_LSHIFT", e[e.OP_RSHIFT = 153] = "OP_RSHIFT", e[e.OP_BOOLAND = 154] = "OP_BOOLAND", e[e.OP_BOOLOR = 155] = "OP_BOOLOR", e[e.OP_NUMEQUAL = 156] = "OP_NUMEQUAL", e[e.OP_NUMEQUALVERIFY = 157] = "OP_NUMEQUALVERIFY", e[e.OP_NUMNOTEQUAL = 158] = "OP_NUMNOTEQUAL", e[e.OP_LESSTHAN = 159] = "OP_LESSTHAN", e[e.OP_GREATERTHAN = 160] = "OP_GREATERTHAN", e[e.OP_LESSTHANOREQUAL = 161] = "OP_LESSTHANOREQUAL", e[e.OP_GREATERTHANOREQUAL = 162] = "OP_GREATERTHANOREQUAL", e[e.OP_MIN = 163] = "OP_MIN", e[e.OP_MAX = 164] = "OP_MAX", e[e.OP_WITHIN = 165] = "OP_WITHIN", e[e.OP_RIPEMD160 = 166] = "OP_RIPEMD160", e[e.OP_SHA1 = 167] = "OP_SHA1", e[e.OP_SHA256 = 168] = "OP_SHA256", e[e.OP_HASH160 = 169] = "OP_HASH160", e[e.OP_HASH256 = 170] = "OP_HASH256", e[e.OP_CODESEPARATOR = 171] = "OP_CODESEPARATOR", e[e.OP_CHECKSIG = 172] = "OP_CHECKSIG", e[e.OP_CHECKSIGVERIFY = 173] = "OP_CHECKSIGVERIFY", e[e.OP_CHECKMULTISIG = 174] = "OP_CHECKMULTISIG", e[e.OP_CHECKMULTISIGVERIFY = 175] = "OP_CHECKMULTISIGVERIFY", e[e.OP_NOP1 = 176] = "OP_NOP1", e[e.OP_CHECKLOCKTIMEVERIFY = 177] = "OP_CHECKLOCKTIMEVERIFY", e[e.OP_NOP2 = 177] = "OP_NOP2", e[e.OP_CHECKSEQUENCEVERIFY = 178] = "OP_CHECKSEQUENCEVERIFY", e[e.OP_NOP3 = 178] = "OP_NOP3", e[e.OP_NOP4 = 179] = "OP_NOP4", e[e.OP_NOP5 = 180] = "OP_NOP5", e[e.OP_NOP6 = 181] = "OP_NOP6", e[e.OP_NOP7 = 182] = "OP_NOP7", e[e.OP_NOP8 = 183] = "OP_NOP8", e[e.OP_NOP9 = 184] = "OP_NOP9", e[e.OP_NOP10 = 185] = "OP_NOP10", e[e.OP_CHECKSIGADD = 186] = "OP_CHECKSIGADD", e[e.OP_PUBKEYHASH = 253] = "OP_PUBKEYHASH", e[e.OP_PUBKEY = 254] = "OP_PUBKEY", e[e.OP_INVALIDOPCODE = 255] = "OP_INVALIDOPCODE";
  })(q || (q = {}));
  const bt = "0123456789abcdefABCDEF", yt = bt.split("").map((e) => e.codePointAt(0)), vt = Array(256).fill(true).map((e, r) => {
    const t = String.fromCodePoint(r), o = bt.indexOf(t);
    return o < 0 ? void 0 : o < 16 ? o : o - 6;
  }), us = new TextEncoder(), ls = new TextDecoder();
  function Ee(e) {
    const r = e.reduce((a, n) => a + n.length, 0), t = new Uint8Array(r);
    let o = 0;
    for (const a of e) t.set(a, o), o += a.length;
    return t;
  }
  function yr(e) {
    const r = e || new Uint8Array();
    return r.length > 512 ? fs(r) : ds(r);
  }
  function ds(e) {
    let r = "";
    for (let t = 0; t < e.length; ++t) r += bt[vt[yt[e[t] >> 4]]], r += bt[vt[yt[e[t] & 15]]];
    return r;
  }
  function fs(e) {
    const r = new Uint8Array(e.length * 2);
    for (let t = 0; t < e.length; ++t) r[t * 2] = yt[e[t] >> 4], r[t * 2 + 1] = yt[e[t] & 15];
    return ls.decode(r);
  }
  function kr(e) {
    const r = us.encode(e || ""), t = new Uint8Array(Math.floor(r.length / 2));
    let o;
    for (o = 0; o < t.length; o++) {
      const a = vt[r[o * 2]], n = vt[r[o * 2 + 1]];
      if (a === void 0 || n === void 0) break;
      t[o] = a << 4 | n;
    }
    return o === t.length ? t : t.slice(0, o);
  }
  function hs(e) {
    const r = atob(e), t = new Uint8Array(r.length);
    for (let o = 0; o < r.length; o++) t[o] = r.charCodeAt(o);
    return t;
  }
  function U(e, r) {
    const t = Math.min(e.length, r.length);
    for (let o = 0; o < t; ++o) if (e[o] !== r[o]) return e[o] < r[o] ? -1 : 1;
    return e.length === r.length ? 0 : e.length > r.length ? 1 : -1;
  }
  function _e(e, r, t) {
    if (r + 1 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    if (t > 255) throw new Error(`The value of "value" is out of range. It must be >= 0 and <= 255. Received ${t}`);
    return e[r] = t, r + 1;
  }
  function ps(e, r, t, o) {
    if (r + 2 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    if (o = o.toUpperCase(), t > 65535) throw new Error(`The value of "value" is out of range. It must be >= 0 and <= 65535. Received ${t}`);
    return o === "LE" ? (e[r] = t & 255, e[r + 1] = t >> 8 & 255) : (e[r] = t >> 8 & 255, e[r + 1] = t & 255), r + 2;
  }
  function xn(e, r, t, o) {
    if (r + 4 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    if (o = o.toUpperCase(), t > 4294967295) throw new Error(`The value of "value" is out of range. It must be >= 0 and <= ${4294967295}. Received ${t}`);
    return o === "LE" ? (e[r] = t & 255, e[r + 1] = t >> 8 & 255, e[r + 2] = t >> 16 & 255, e[r + 3] = t >> 24 & 255) : (e[r] = t >> 24 & 255, e[r + 1] = t >> 16 & 255, e[r + 2] = t >> 8 & 255, e[r + 3] = t & 255), r + 4;
  }
  function ms(e, r, t, o) {
    if (r + 8 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    if (o = o.toUpperCase(), t > 0xffffffffffffffffn) throw new Error(`The value of "value" is out of range. It must be >= 0 and <= ${0xffffffffffffffffn}. Received ${t}`);
    return o === "LE" ? (e[r] = Number(t & 0xffn), e[r + 1] = Number(t >> 8n & 0xffn), e[r + 2] = Number(t >> 16n & 0xffn), e[r + 3] = Number(t >> 24n & 0xffn), e[r + 4] = Number(t >> 32n & 0xffn), e[r + 5] = Number(t >> 40n & 0xffn), e[r + 6] = Number(t >> 48n & 0xffn), e[r + 7] = Number(t >> 56n & 0xffn)) : (e[r] = Number(t >> 56n & 0xffn), e[r + 1] = Number(t >> 48n & 0xffn), e[r + 2] = Number(t >> 40n & 0xffn), e[r + 3] = Number(t >> 32n & 0xffn), e[r + 4] = Number(t >> 24n & 0xffn), e[r + 5] = Number(t >> 16n & 0xffn), e[r + 6] = Number(t >> 8n & 0xffn), e[r + 7] = Number(t & 0xffn)), r + 8;
  }
  function ur(e, r) {
    if (r + 1 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    return e[r];
  }
  function gs(e, r, t) {
    if (r + 2 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    if (t = t.toUpperCase(), t === "LE") {
      let o = 0;
      return o = (o << 8) + e[r + 1], o = (o << 8) + e[r], o;
    } else {
      let o = 0;
      return o = (o << 8) + e[r], o = (o << 8) + e[r + 1], o;
    }
  }
  function Ro(e, r, t) {
    if (r + 4 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    if (t = t.toUpperCase(), t === "LE") {
      let o = 0;
      return o = (o << 8) + e[r + 3] >>> 0, o = (o << 8) + e[r + 2] >>> 0, o = (o << 8) + e[r + 1] >>> 0, o = (o << 8) + e[r] >>> 0, o;
    } else {
      let o = 0;
      return o = (o << 8) + e[r] >>> 0, o = (o << 8) + e[r + 1] >>> 0, o = (o << 8) + e[r + 2] >>> 0, o = (o << 8) + e[r + 3] >>> 0, o;
    }
  }
  function An(e, r, t, o) {
    if (r + 4 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    if (t > 2147483647 || t < -2147483648) throw new Error(`The value of "value" is out of range. It must be >= -2147483648 and <= 2147483647. Received ${t}`);
    return o = o.toUpperCase(), o === "LE" ? (e[r] = t & 255, e[r + 1] = t >> 8 & 255, e[r + 2] = t >> 16 & 255, e[r + 3] = t >> 24 & 255) : (e[r] = t >> 24 & 255, e[r + 1] = t >> 16 & 255, e[r + 2] = t >> 8 & 255, e[r + 3] = t & 255), r + 4;
  }
  function bs(e, r, t, o) {
    if (r + 8 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    if (t > 0x7fffffffffffffffn || t < -0x8000000000000000n) throw new Error(`The value of "value" is out of range. It must be >= ${-0x8000000000000000n} and <= ${0x7fffffffffffffffn}. Received ${t}`);
    return o = o.toUpperCase(), o === "LE" ? (e[r] = Number(t & 0xffn), e[r + 1] = Number(t >> 8n & 0xffn), e[r + 2] = Number(t >> 16n & 0xffn), e[r + 3] = Number(t >> 24n & 0xffn), e[r + 4] = Number(t >> 32n & 0xffn), e[r + 5] = Number(t >> 40n & 0xffn), e[r + 6] = Number(t >> 48n & 0xffn), e[r + 7] = Number(t >> 56n & 0xffn)) : (e[r] = Number(t >> 56n & 0xffn), e[r + 1] = Number(t >> 48n & 0xffn), e[r + 2] = Number(t >> 40n & 0xffn), e[r + 3] = Number(t >> 32n & 0xffn), e[r + 4] = Number(t >> 24n & 0xffn), e[r + 5] = Number(t >> 16n & 0xffn), e[r + 6] = Number(t >> 8n & 0xffn), e[r + 7] = Number(t & 0xffn)), r + 8;
  }
  function ys(e, r, t) {
    if (r + 4 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    if (t = t.toUpperCase(), t === "LE") {
      const o = e[r] + (e[r + 1] << 8) + (e[r + 2] << 16) + (e[r + 3] << 24 >>> 0);
      return e[r + 3] <= 127 ? o : o - 4294967296;
    } else {
      const o = (e[r] << 24 >>> 0) + (e[r + 1] << 16) + (e[r + 2] << 8) + e[r + 3];
      return e[r] <= 127 ? o : o - 4294967296;
    }
  }
  function vs(e, r, t) {
    if (r + 8 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    t = t.toUpperCase();
    let o = 0n;
    if (t === "LE") return o = (o << 8n) + BigInt(e[r + 7]), o = (o << 8n) + BigInt(e[r + 6]), o = (o << 8n) + BigInt(e[r + 5]), o = (o << 8n) + BigInt(e[r + 4]), o = (o << 8n) + BigInt(e[r + 3]), o = (o << 8n) + BigInt(e[r + 2]), o = (o << 8n) + BigInt(e[r + 1]), o = (o << 8n) + BigInt(e[r]), e[r + 7] <= 127 ? o : o - 0x10000000000000000n;
    {
      let a = 0n;
      return a = (a << 8n) + BigInt(e[r]), a = (a << 8n) + BigInt(e[r + 1]), a = (a << 8n) + BigInt(e[r + 2]), a = (a << 8n) + BigInt(e[r + 3]), a = (a << 8n) + BigInt(e[r + 4]), a = (a << 8n) + BigInt(e[r + 5]), a = (a << 8n) + BigInt(e[r + 6]), a = (a << 8n) + BigInt(e[r + 7]), e[r] <= 127 ? a : a - 0x10000000000000000n;
    }
  }
  function Sn(e) {
    return e < q.OP_PUSHDATA1 ? 1 : e <= 255 ? 2 : e <= 65535 ? 3 : 5;
  }
  function ws(e, r, t) {
    const o = Sn(r);
    return o === 1 ? _e(e, t, r) : o === 2 ? (_e(e, t, q.OP_PUSHDATA1), _e(e, t + 1, r)) : o === 3 ? (_e(e, t, q.OP_PUSHDATA2), ps(e, t + 1, r, "LE")) : (_e(e, t, q.OP_PUSHDATA4), xn(e, t + 1, r, "LE")), o;
  }
  function ks(e, r) {
    const t = ur(e, r);
    let o, a;
    if (t < q.OP_PUSHDATA1) o = t, a = 1;
    else if (t === q.OP_PUSHDATA1) {
      if (r + 2 > e.length) return null;
      o = ur(e, r + 1), a = 2;
    } else if (t === q.OP_PUSHDATA2) {
      if (r + 3 > e.length) return null;
      o = gs(e, r + 1, "LE"), a = 3;
    } else {
      if (r + 5 > e.length) return null;
      if (t !== q.OP_PUSHDATA4) throw new Error("Unexpected opcode");
      o = Ro(e, r + 1, "LE"), a = 5;
    }
    return {
      opcode: t,
      number: o,
      size: a
    };
  }
  function In(e, r, t) {
    r = r || 4, t = t === void 0 ? true : t;
    const o = e.length;
    if (o === 0) return 0;
    if (o > r) throw new TypeError("Script number overflow");
    if (t && (e[o - 1] & 127) === 0 && (o <= 1 || (e[o - 2] & 128) === 0)) throw new Error("Non-minimally encoded script number");
    if (o === 5) {
      const n = Ro(e, 0, "LE"), i = ur(e, 4);
      return i & 128 ? -((i & -129) * 4294967296 + n) : i * 4294967296 + n;
    }
    let a = 0;
    for (let n = 0; n < o; ++n) a |= e[n] << 8 * n;
    return e[o - 1] & 128 ? -(a & ~(128 << 8 * (o - 1))) : a;
  }
  function _s(e) {
    return e > 2147483647 ? 5 : e > 8388607 ? 4 : e > 32767 ? 3 : e > 127 ? 2 : e > 0 ? 1 : 0;
  }
  function Tn(e) {
    let r = Math.abs(e);
    const t = _s(r), o = new Uint8Array(t), a = e < 0;
    for (let n = 0; n < t; ++n) _e(o, n, r & 255), r >>= 8;
    return o[t - 1] & 128 ? _e(o, t - 1, a ? 128 : 0) : a && (o[t - 1] |= 128), o;
  }
  let oo;
  function zn(e) {
    return {
      lang: (e == null ? void 0 : e.lang) ?? (oo == null ? void 0 : oo.lang),
      message: e == null ? void 0 : e.message,
      abortEarly: (e == null ? void 0 : e.abortEarly) ?? (oo == null ? void 0 : oo.abortEarly),
      abortPipeEarly: (e == null ? void 0 : e.abortPipeEarly) ?? (oo == null ? void 0 : oo.abortPipeEarly)
    };
  }
  let Es;
  function xs(e) {
    return Es == null ? void 0 : Es.get(e);
  }
  let As;
  function Ss(e) {
    return As == null ? void 0 : As.get(e);
  }
  let Is;
  function Ts(e, r) {
    var _a2;
    return (_a2 = Is == null ? void 0 : Is.get(e)) == null ? void 0 : _a2.get(r);
  }
  function Mr(e) {
    var _a2, _b;
    const r = typeof e;
    return r === "string" ? `"${e}"` : r === "number" || r === "bigint" || r === "boolean" ? `${e}` : r === "object" || r === "function" ? (e && ((_b = (_a2 = Object.getPrototypeOf(e)) == null ? void 0 : _a2.constructor) == null ? void 0 : _b.name)) ?? "null" : r;
  }
  function le(e, r, t, o, a) {
    const n = a && "input" in a ? a.input : t.value, i = (a == null ? void 0 : a.expected) ?? e.expects ?? null, s = (a == null ? void 0 : a.received) ?? Mr(n), u = {
      kind: e.kind,
      type: e.type,
      input: n,
      expected: i,
      received: s,
      message: `Invalid ${r}: ${i ? `Expected ${i} but r` : "R"}eceived ${s}`,
      requirement: e.requirement,
      path: a == null ? void 0 : a.path,
      issues: a == null ? void 0 : a.issues,
      lang: o.lang,
      abortEarly: o.abortEarly,
      abortPipeEarly: o.abortPipeEarly
    }, c = e.kind === "schema", d = (a == null ? void 0 : a.message) ?? e.message ?? Ts(e.reference, u.lang) ?? (c ? Ss(u.lang) : null) ?? o.message ?? xs(u.lang);
    d !== void 0 && (u.message = typeof d == "function" ? d(u) : d), c && (t.typed = false), t.issues ? t.issues.push(u) : t.issues = [
      u
    ];
  }
  function ge(e) {
    return {
      version: 1,
      vendor: "valibot",
      validate(r) {
        return e["~run"]({
          value: r
        }, zn());
      }
    };
  }
  function zs(e, r) {
    const t = [
      ...new Set(e)
    ];
    return t.length > 1 ? `(${t.join(` ${r} `)})` : t[0] ?? "never";
  }
  var Us = class extends Error {
    constructor(r) {
      super(r[0].message), this.name = "ValiError", this.issues = r;
    }
  };
  function Un(e, r) {
    return {
      kind: "validation",
      type: "every_item",
      reference: Un,
      async: false,
      expects: null,
      requirement: e,
      message: r,
      "~run"(t, o) {
        return t.typed && !t.value.every(this.requirement) && le(this, "item", t, o), t;
      }
    };
  }
  function Lo(e) {
    return {
      kind: "validation",
      type: "integer",
      reference: Lo,
      async: false,
      expects: null,
      requirement: Number.isInteger,
      message: e,
      "~run"(r, t) {
        return r.typed && !this.requirement(r.value) && le(this, "integer", r, t), r;
      }
    };
  }
  function Hn(e, r) {
    return {
      kind: "validation",
      type: "length",
      reference: Hn,
      async: false,
      expects: `${e}`,
      requirement: e,
      message: r,
      "~run"(t, o) {
        return t.typed && t.value.length !== this.requirement && le(this, "length", t, o, {
          received: `${t.value.length}`
        }), t;
      }
    };
  }
  function jt(e, r) {
    return {
      kind: "validation",
      type: "max_value",
      reference: jt,
      async: false,
      expects: `<=${e instanceof Date ? e.toJSON() : Mr(e)}`,
      requirement: e,
      message: r,
      "~run"(t, o) {
        return t.typed && !(t.value <= this.requirement) && le(this, "value", t, o, {
          received: t.value instanceof Date ? t.value.toJSON() : Mr(t.value)
        }), t;
      }
    };
  }
  function Ct(e, r) {
    return {
      kind: "validation",
      type: "min_value",
      reference: Ct,
      async: false,
      expects: `>=${e instanceof Date ? e.toJSON() : Mr(e)}`,
      requirement: e,
      message: r,
      "~run"(t, o) {
        return t.typed && !(t.value >= this.requirement) && le(this, "value", t, o, {
          received: t.value instanceof Date ? t.value.toJSON() : Mr(t.value)
        }), t;
      }
    };
  }
  function Hs(e, r, t) {
    return typeof e.fallback == "function" ? e.fallback(r, t) : e.fallback;
  }
  function Rt(e, r, t) {
    return typeof e.default == "function" ? e.default(r, t) : e.default;
  }
  function Lt(e, r) {
    return !e["~run"]({
      value: r
    }, {
      abortEarly: true
    }).issues;
  }
  function Pn() {
    return {
      kind: "schema",
      type: "any",
      reference: Pn,
      expects: "any",
      async: false,
      get "~standard"() {
        return ge(this);
      },
      "~run"(e) {
        return e.typed = true, e;
      }
    };
  }
  ye = function(e, r) {
    return {
      kind: "schema",
      type: "array",
      reference: ye,
      expects: "Array",
      async: false,
      item: e,
      message: r,
      get "~standard"() {
        return ge(this);
      },
      "~run"(t, o) {
        var _a2;
        const a = t.value;
        if (Array.isArray(a)) {
          t.typed = true, t.value = [];
          for (let n = 0; n < a.length; n++) {
            const i = a[n], s = this.item["~run"]({
              value: i
            }, o);
            if (s.issues) {
              const u = {
                type: "array",
                origin: "value",
                input: a,
                key: n,
                value: i
              };
              for (const c of s.issues) c.path ? c.path.unshift(u) : c.path = [
                u
              ], (_a2 = t.issues) == null ? void 0 : _a2.push(c);
              if (t.issues || (t.issues = s.issues), o.abortEarly) {
                t.typed = false;
                break;
              }
            }
            s.typed || (t.typed = false), t.value.push(s.value);
          }
        } else le(this, "type", t, o);
        return t;
      }
    };
  };
  function Nn(e) {
    return {
      kind: "schema",
      type: "bigint",
      reference: Nn,
      expects: "bigint",
      async: false,
      message: e,
      get "~standard"() {
        return ge(this);
      },
      "~run"(r, t) {
        return typeof r.value == "bigint" ? r.typed = true : le(this, "type", r, t), r;
      }
    };
  }
  Ps = function(e) {
    return {
      kind: "schema",
      type: "boolean",
      reference: Ps,
      expects: "boolean",
      async: false,
      message: e,
      get "~standard"() {
        return ge(this);
      },
      "~run"(r, t) {
        return typeof r.value == "boolean" ? r.typed = true : le(this, "type", r, t), r;
      }
    };
  };
  function Le(e, r) {
    return {
      kind: "schema",
      type: "custom",
      reference: Le,
      expects: "unknown",
      async: false,
      check: e,
      message: r,
      get "~standard"() {
        return ge(this);
      },
      "~run"(t, o) {
        return this.check(t.value) ? t.typed = true : le(this, "type", t, o), t;
      }
    };
  }
  function Bt(e, r) {
    return {
      kind: "schema",
      type: "instance",
      reference: Bt,
      expects: e.name,
      async: false,
      class: e,
      message: r,
      get "~standard"() {
        return ge(this);
      },
      "~run"(t, o) {
        return t.value instanceof this.class ? t.typed = true : le(this, "type", t, o), t;
      }
    };
  }
  _o = function(e, r) {
    return {
      kind: "schema",
      type: "nullable",
      reference: _o,
      expects: `(${e.expects} | null)`,
      async: false,
      wrapped: e,
      default: r,
      get "~standard"() {
        return ge(this);
      },
      "~run"(t, o) {
        return t.value === null && (this.default !== void 0 && (t.value = Rt(this, t, o)), t.value === null) ? (t.typed = true, t) : this.wrapped["~run"](t, o);
      }
    };
  };
  function On(e, r) {
    return {
      kind: "schema",
      type: "nullish",
      reference: On,
      expects: `(${e.expects} | null | undefined)`,
      async: false,
      wrapped: e,
      default: r,
      get "~standard"() {
        return ge(this);
      },
      "~run"(t, o) {
        return (t.value === null || t.value === void 0) && (this.default !== void 0 && (t.value = Rt(this, t, o)), t.value === null || t.value === void 0) ? (t.typed = true, t) : this.wrapped["~run"](t, o);
      }
    };
  }
  Ie = function(e) {
    return {
      kind: "schema",
      type: "number",
      reference: Ie,
      expects: "number",
      async: false,
      message: e,
      get "~standard"() {
        return ge(this);
      },
      "~run"(r, t) {
        return typeof r.value == "number" && !isNaN(r.value) ? r.typed = true : le(this, "type", r, t), r;
      }
    };
  };
  re = function(e, r) {
    return {
      kind: "schema",
      type: "object",
      reference: re,
      expects: "Object",
      async: false,
      entries: e,
      message: r,
      get "~standard"() {
        return ge(this);
      },
      "~run"(t, o) {
        var _a2;
        const a = t.value;
        if (a && typeof a == "object") {
          t.typed = true, t.value = {};
          for (const n in this.entries) {
            const i = this.entries[n];
            if (n in a || (i.type === "exact_optional" || i.type === "optional" || i.type === "nullish") && i.default !== void 0) {
              const s = n in a ? a[n] : Rt(i), u = i["~run"]({
                value: s
              }, o);
              if (u.issues) {
                const c = {
                  type: "object",
                  origin: "value",
                  input: a,
                  key: n,
                  value: s
                };
                for (const d of u.issues) d.path ? d.path.unshift(c) : d.path = [
                  c
                ], (_a2 = t.issues) == null ? void 0 : _a2.push(d);
                if (t.issues || (t.issues = u.issues), o.abortEarly) {
                  t.typed = false;
                  break;
                }
              }
              u.typed || (t.typed = false), t.value[n] = u.value;
            } else if (i.fallback !== void 0) t.value[n] = Hs(i);
            else if (i.type !== "exact_optional" && i.type !== "optional" && i.type !== "nullish" && (le(this, "key", t, o, {
              input: void 0,
              expected: `"${n}"`,
              path: [
                {
                  type: "object",
                  origin: "key",
                  input: a,
                  key: n,
                  value: a[n]
                }
              ]
            }), o.abortEarly)) break;
          }
        } else le(this, "type", t, o);
        return t;
      }
    };
  };
  wt = function(e, r) {
    return {
      kind: "schema",
      type: "optional",
      reference: wt,
      expects: `(${e.expects} | undefined)`,
      async: false,
      wrapped: e,
      default: r,
      get "~standard"() {
        return ge(this);
      },
      "~run"(t, o) {
        return t.value === void 0 && (this.default !== void 0 && (t.value = Rt(this, t, o)), t.value === void 0) ? (t.typed = true, t) : this.wrapped["~run"](t, o);
      }
    };
  };
  Pr = function(e) {
    return {
      kind: "schema",
      type: "string",
      reference: Pr,
      expects: "string",
      async: false,
      message: e,
      get "~standard"() {
        return ge(this);
      },
      "~run"(r, t) {
        return typeof r.value == "string" ? r.typed = true : le(this, "type", r, t), r;
      }
    };
  };
  function Fe(e, r) {
    return {
      kind: "schema",
      type: "tuple",
      reference: Fe,
      expects: "Array",
      async: false,
      items: e,
      message: r,
      get "~standard"() {
        return ge(this);
      },
      "~run"(t, o) {
        var _a2;
        const a = t.value;
        if (Array.isArray(a)) {
          t.typed = true, t.value = [];
          for (let n = 0; n < this.items.length; n++) {
            const i = a[n], s = this.items[n]["~run"]({
              value: i
            }, o);
            if (s.issues) {
              const u = {
                type: "array",
                origin: "value",
                input: a,
                key: n,
                value: i
              };
              for (const c of s.issues) c.path ? c.path.unshift(u) : c.path = [
                u
              ], (_a2 = t.issues) == null ? void 0 : _a2.push(c);
              if (t.issues || (t.issues = s.issues), o.abortEarly) {
                t.typed = false;
                break;
              }
            }
            s.typed || (t.typed = false), t.value.push(s.value);
          }
        } else le(this, "type", t, o);
        return t;
      }
    };
  }
  function ia(e) {
    let r;
    if (e) for (const t of e) r ? r.push(...t.issues) : r = t.issues;
    return r;
  }
  function Bo(e, r) {
    return {
      kind: "schema",
      type: "union",
      reference: Bo,
      expects: zs(e.map((t) => t.expects), "|"),
      async: false,
      options: e,
      message: r,
      get "~standard"() {
        return ge(this);
      },
      "~run"(t, o) {
        let a, n, i;
        for (const s of this.options) {
          const u = s["~run"]({
            value: t.value
          }, o);
          if (u.typed) if (u.issues) n ? n.push(u) : n = [
            u
          ];
          else {
            a = u;
            break;
          }
          else i ? i.push(u) : i = [
            u
          ];
        }
        if (a) return a;
        if (n) {
          if (n.length === 1) return n[0];
          le(this, "type", t, o, {
            issues: ia(n)
          }), t.typed = true;
        } else {
          if ((i == null ? void 0 : i.length) === 1) return i[0];
          le(this, "type", t, o, {
            issues: ia(i)
          });
        }
        return t;
      }
    };
  }
  ee = function(e, r, t) {
    const o = e["~run"]({
      value: r
    }, zn(t));
    if (o.issues) throw new Us(o.issues);
    return o.value;
  };
  function lr(e, r) {
    const t = {};
    for (const o in e.entries) t[o] = wt(e.entries[o]);
    return {
      ...e,
      entries: t,
      get "~standard"() {
        return ge(this);
      }
    };
  }
  function Yr(...e) {
    return {
      ...e[0],
      pipe: e,
      get "~standard"() {
        return ge(this);
      },
      "~run"(r, t) {
        for (const o of e) if (o.kind !== "metadata") {
          if (r.issues && (o.kind === "schema" || o.kind === "transformation")) {
            r.typed = false;
            break;
          }
          (!r.issues || !t.abortEarly && !t.abortPipeEarly) && (r = o["~run"](r, t));
        }
        return r;
      }
    };
  }
  const sa = new Uint8Array(32), ca = kr("fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"), ne = (e) => Yr(Bt(Uint8Array), Hn(e));
  function $r(e, r) {
    return e.length !== r.length ? false : e.every((t, o) => U(t, r[o]) === 0);
  }
  function Re(e) {
    if (!(e instanceof Uint8Array) || e.length < 33) return false;
    const r = e[0], t = e.slice(1, 33);
    if (U(sa, t) === 0 || U(t, ca) >= 0) return false;
    if ((r === 2 || r === 3) && e.length === 33) return true;
    const o = e.slice(33);
    return U(sa, o) === 0 || U(o, ca) >= 0 ? false : r === 4 && e.length === 65;
  }
  const mt = 254;
  function Do(e) {
    return !e || !("output" in e) || !(e.output instanceof Uint8Array) ? false : e.version !== void 0 ? (e.version & mt) === e.version : true;
  }
  function jn(e) {
    return Array.isArray(e) ? e.length !== 2 ? false : e.every((r) => jn(r)) : Do(e);
  }
  const Ns = ne(32), Os = ne(20), ua = ne(32), $ = Bt(Uint8Array), js = Yr(Ie(), Lo(), Ct(0), jt(255)), Ye = Yr(Ie(), Lo(), Ct(0), jt(4294967295)), ao = Yr(Nn(), Ct(0n), jt(0x7fffffffffffffffn)), la = (e) => re(Object.entries(e).reduce((r, t) => ({
    ...r,
    [t[0]]: On(t[1])
  }), {})), da = new Uint8Array(1);
  function fa(e) {
    let r = 0;
    for (; e[r] === 0; ) ++r;
    return r === e.length ? da : (e = e.slice(r), e[0] & 128 ? Ee([
      da,
      e
    ]) : e);
  }
  function ha(e) {
    e[0] === 0 && (e = e.slice(1));
    const r = new Uint8Array(32), t = Math.max(0, 32 - e.length);
    return r.set(e, t), r;
  }
  function Cs(e) {
    const r = ur(e, e.length - 1);
    if (!Ko(r)) throw new Error("Invalid hashType " + r);
    const t = ss(e.subarray(0, -1)), o = ha(t.r), a = ha(t.s);
    return {
      signature: Ee([
        o,
        a
      ]),
      hashType: r
    };
  }
  function Rs(e, r) {
    if (ee(re({
      signature: ne(64),
      hashType: js
    }), {
      signature: e,
      hashType: r
    }), !Ko(r)) throw new Error("Invalid hashType " + r);
    const t = new Uint8Array(1);
    _e(t, 0, r);
    const o = fa(e.slice(0, 32)), a = fa(e.slice(32, 64));
    return Ee([
      cs(o, a),
      t
    ]);
  }
  const Ls = Object.freeze(Object.defineProperty({
    __proto__: null,
    decode: Cs,
    encode: Rs
  }, Symbol.toStringTag, {
    value: "Module"
  })), Cn = q.OP_RESERVED, Rn = ye(Bo([
    Bt(Uint8Array),
    Ie()
  ]));
  function Bs(e) {
    return Lt(Ie(), e) && (e === q.OP_0 || e >= q.OP_1 && e <= q.OP_16 || e === q.OP_1NEGATE);
  }
  function Ln(e) {
    return Lt($, e) || Bs(e);
  }
  function Fo(e) {
    return Lt(Yr(Pn(), Un(Ln)), e);
  }
  function Bn(e) {
    return e.length - e.filter(Ln).length;
  }
  function kt(e) {
    if (e.length === 0) return q.OP_0;
    if (e.length === 1) {
      if (e[0] >= 1 && e[0] <= 16) return Cn + e[0];
      if (e[0] === 129) return q.OP_1NEGATE;
    }
  }
  function Dn(e) {
    return e instanceof Uint8Array;
  }
  function Ds(e) {
    return Lt(Rn, e);
  }
  function _t(e) {
    return e instanceof Uint8Array;
  }
  function ve(e) {
    if (Dn(e)) return e;
    ee(Rn, e);
    const r = e.reduce((a, n) => _t(n) ? n.length === 1 && kt(n) !== void 0 ? a + 1 : a + Sn(n.length) + n.length : a + 1, 0), t = new Uint8Array(r);
    let o = 0;
    if (e.forEach((a) => {
      if (_t(a)) {
        const n = kt(a);
        if (n !== void 0) {
          _e(t, o, n), o += 1;
          return;
        }
        o += ws(t, a.length, o), t.set(a, o), o += a.length;
      } else _e(t, o, a), o += 1;
    }), o !== t.length) throw new Error("Could not decode chunks");
    return t;
  }
  function J(e) {
    if (Ds(e)) return e;
    ee($, e);
    const r = [];
    let t = 0;
    for (; t < e.length; ) {
      const o = e[t];
      if (o > q.OP_0 && o <= q.OP_PUSHDATA4) {
        const a = ks(e, t);
        if (a === null || (t += a.size, t + a.number > e.length)) return null;
        const n = e.slice(t, t + a.number);
        t += a.number;
        const i = kt(n);
        i !== void 0 ? r.push(i) : r.push(n);
      } else r.push(o), t += 1;
    }
    return r;
  }
  function Fs(e) {
    if (Dn(e) && (e = J(e)), !e) throw new Error("Could not convert invalid chunks to ASM");
    return e.map((r) => {
      if (_t(r)) {
        const t = kt(r);
        if (t === void 0) return yr(r);
        r = t;
      }
      return q[r];
    }).join(" ");
  }
  function Ks(e) {
    return e = J(e), ee(Le(Fo), e), e.map((r) => _t(r) ? r : r === q.OP_0 ? new Uint8Array(0) : Tn(r - Cn));
  }
  function Vs(e) {
    return Re(e);
  }
  function Ko(e) {
    const r = e & -129;
    return r > 0 && r < 4;
  }
  function er(e) {
    return !(e instanceof Uint8Array) || !Ko(e[e.length - 1]) ? false : is(e.slice(0, -1));
  }
  const Vr = Ls;
  function P(e, r, t) {
    Object.defineProperty(e, r, {
      configurable: true,
      enumerable: true,
      get() {
        const o = t.call(this);
        return this[r] = o, o;
      },
      set(o) {
        Object.defineProperty(this, r, {
          configurable: true,
          enumerable: true,
          value: o,
          writable: true
        });
      }
    });
  }
  function Te(e) {
    let r;
    return () => (r !== void 0 || (r = e()), r);
  }
  const Ir = q, Et = Ir.OP_RESERVED;
  function pa(e) {
    return e <= 16 ? Et + e : Tn(e);
  }
  function ma(e) {
    if (typeof e == "number") {
      const r = e - Et;
      if (r < 1 || r > 16) throw new TypeError(`Invalid opcode: expected OP_1\u2013OP_16, got ${e}`);
      return r;
    } else return In(e);
  }
  function ga(e) {
    return typeof e == "number" ? e - Et >= 1 && e - Et <= 16 : Number.isInteger(In(e));
  }
  function Dt(e, r) {
    if (!e.input && !e.output && !(e.pubkeys && e.m !== void 0) && !e.signatures) throw new TypeError("Not enough data");
    r = Object.assign({
      validate: true
    }, r || {});
    function t(u) {
      return er(u) || (r.allowIncomplete && u === Ir.OP_0) !== void 0;
    }
    ee(lr(re({
      network: re({}),
      m: Ie(),
      n: Ie(),
      output: $,
      pubkeys: ye(Le(Re), "Received invalid pubkey"),
      signatures: ye(Le(t), "Expected signature to be of type isAcceptableSignature"),
      input: $
    })), e);
    const a = {
      network: e.network || $e
    };
    let n = [], i = false;
    function s(u) {
      if (!i) {
        if (i = true, n = J(u), n.length < 3) throw new TypeError("Output is invalid");
        a.m = ma(n[0]), a.n = ma(n[n.length - 2]), a.pubkeys = n.slice(1, -2);
      }
    }
    if (P(a, "output", () => {
      if (e.m && a.n && e.pubkeys) return ve([].concat(pa(e.m), e.pubkeys, pa(a.n), Ir.OP_CHECKMULTISIG));
    }), P(a, "m", () => {
      if (a.output) return s(a.output), a.m;
    }), P(a, "n", () => {
      if (a.pubkeys) return a.pubkeys.length;
    }), P(a, "pubkeys", () => {
      if (e.output) return s(e.output), a.pubkeys;
    }), P(a, "signatures", () => {
      if (e.input) return J(e.input).slice(1);
    }), P(a, "input", () => {
      if (e.signatures) return ve([
        Ir.OP_0
      ].concat(e.signatures));
    }), P(a, "witness", () => {
      if (a.input) return [];
    }), P(a, "name", () => {
      if (!(!a.m || !a.n)) return `p2ms(${a.m} of ${a.n})`;
    }), r.validate) {
      if (e.output) {
        if (s(e.output), !ga(n[0])) throw new TypeError("Output is invalid");
        if (!ga(n[n.length - 2])) throw new TypeError("Output is invalid");
        if (n[n.length - 1] !== Ir.OP_CHECKMULTISIG) throw new TypeError("Output is invalid");
        if (a.m <= 0 || a.n > 20 || a.m > a.n || a.n !== n.length - 3) throw new TypeError("Output is invalid");
        if (!a.pubkeys.every((u) => Re(u))) throw new TypeError("Output is invalid");
        if (e.m !== void 0 && e.m !== a.m) throw new TypeError("m mismatch");
        if (e.n !== void 0 && e.n !== a.n) throw new TypeError("n mismatch");
        if (e.pubkeys && !$r(e.pubkeys, a.pubkeys)) throw new TypeError("Pubkeys mismatch");
      }
      if (e.pubkeys) {
        if (e.n !== void 0 && e.n !== e.pubkeys.length) throw new TypeError("Pubkey count mismatch");
        if (a.n = e.pubkeys.length, a.n < a.m) throw new TypeError("Pubkey count cannot be less than m");
      }
      if (e.signatures) {
        if (e.signatures.length < a.m) throw new TypeError("Not enough signatures provided");
        if (e.signatures.length > a.m) throw new TypeError("Too many signatures provided");
      }
      if (e.input) {
        if (e.input[0] !== Ir.OP_0) throw new TypeError("Input is invalid");
        if (a.signatures.length === 0 || !a.signatures.every(t)) throw new TypeError("Input has invalid signature(s)");
        if (e.signatures && !$r(e.signatures, a.signatures)) throw new TypeError("Signature mismatch");
        if (e.m !== void 0 && e.m !== e.signatures.length) throw new TypeError("Signature count mismatch");
      }
    }
    return Object.assign(a, e);
  }
  const ba = q;
  function Fn(e, r) {
    if (!e.input && !e.output && !e.pubkey && !e.input && !e.signature) throw new TypeError("Not enough data");
    r = Object.assign({
      validate: true
    }, r || {}), ee(lr(re({
      network: re({}),
      output: $,
      pubkey: Le(Re, "invalid pubkey"),
      signature: Le(er, "Expected signature to be of type isCanonicalScriptSignature"),
      input: $
    })), e);
    const t = Te(() => J(e.input)), a = {
      name: "p2pk",
      network: e.network || $e
    };
    if (P(a, "output", () => {
      if (e.pubkey) return ve([
        e.pubkey,
        ba.OP_CHECKSIG
      ]);
    }), P(a, "pubkey", () => {
      if (e.output) return e.output.slice(1, -1);
    }), P(a, "signature", () => {
      if (e.input) return t()[0];
    }), P(a, "input", () => {
      if (e.signature) return ve([
        e.signature
      ]);
    }), P(a, "witness", () => {
      if (a.input) return [];
    }), r.validate) {
      if (e.output) {
        if (e.output[e.output.length - 1] !== ba.OP_CHECKSIG) throw new TypeError("Output is invalid");
        if (!Re(a.pubkey)) throw new TypeError("Output pubkey is invalid");
        if (e.pubkey && U(e.pubkey, a.pubkey) !== 0) throw new TypeError("Pubkey mismatch");
      }
      if (e.signature && e.input && U(e.input, a.input) !== 0) throw new TypeError("Signature mismatch");
      if (e.input) {
        if (t().length !== 1) throw new TypeError("Input is invalid");
        if (!er(a.signature)) throw new TypeError("Input has invalid signature");
      }
    }
    return Object.assign(a, e);
  }
  function Ms(e) {
    return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
  }
  function ya(e) {
    if (!Number.isSafeInteger(e) || e < 0) throw new Error("positive integer expected, got " + e);
  }
  function Ft(e, ...r) {
    if (!Ms(e)) throw new Error("Uint8Array expected");
    if (r.length > 0 && !r.includes(e.length)) throw new Error("Uint8Array expected of length " + r + ", got length=" + e.length);
  }
  function $s(e) {
    if (typeof e != "function" || typeof e.create != "function") throw new Error("Hash should be wrapped by utils.createHasher");
    ya(e.outputLen), ya(e.blockLen);
  }
  function xt(e, r = true) {
    if (e.destroyed) throw new Error("Hash instance has been destroyed");
    if (r && e.finished) throw new Error("Hash#digest() has already been called");
  }
  function qs(e, r) {
    Ft(e);
    const t = r.outputLen;
    if (e.length < t) throw new Error("digestInto() expects output buffer of length at least " + t);
  }
  function dr(...e) {
    for (let r = 0; r < e.length; r++) e[r].fill(0);
  }
  function no(e) {
    return new DataView(e.buffer, e.byteOffset, e.byteLength);
  }
  function Be(e, r) {
    return e << 32 - r | e >>> r;
  }
  function it(e, r) {
    return e << r | e >>> 32 - r >>> 0;
  }
  function Gs(e) {
    if (typeof e != "string") throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(e));
  }
  function Vo(e) {
    return typeof e == "string" && (e = Gs(e)), Ft(e), e;
  }
  class Kn {
  }
  function Mo(e) {
    const r = (o) => e().update(Vo(o)).digest(), t = e();
    return r.outputLen = t.outputLen, r.blockLen = t.blockLen, r.create = () => e(), r;
  }
  function Ws(e, r, t, o) {
    if (typeof e.setBigUint64 == "function") return e.setBigUint64(r, t, o);
    const a = BigInt(32), n = BigInt(4294967295), i = Number(t >> a & n), s = Number(t & n), u = o ? 4 : 0, c = o ? 0 : 4;
    e.setUint32(r + u, i, o), e.setUint32(r + c, s, o);
  }
  function Xs(e, r, t) {
    return e & r ^ ~e & t;
  }
  function Ys(e, r, t) {
    return e & r ^ e & t ^ r & t;
  }
  class $o extends Kn {
    constructor(r, t, o, a) {
      super(), this.finished = false, this.length = 0, this.pos = 0, this.destroyed = false, this.blockLen = r, this.outputLen = t, this.padOffset = o, this.isLE = a, this.buffer = new Uint8Array(r), this.view = no(this.buffer);
    }
    update(r) {
      xt(this), r = Vo(r), Ft(r);
      const { view: t, buffer: o, blockLen: a } = this, n = r.length;
      for (let i = 0; i < n; ) {
        const s = Math.min(a - this.pos, n - i);
        if (s === a) {
          const u = no(r);
          for (; a <= n - i; i += a) this.process(u, i);
          continue;
        }
        o.set(r.subarray(i, i + s), this.pos), this.pos += s, i += s, this.pos === a && (this.process(t, 0), this.pos = 0);
      }
      return this.length += r.length, this.roundClean(), this;
    }
    digestInto(r) {
      xt(this), qs(r, this), this.finished = true;
      const { buffer: t, view: o, blockLen: a, isLE: n } = this;
      let { pos: i } = this;
      t[i++] = 128, dr(this.buffer.subarray(i)), this.padOffset > a - i && (this.process(o, 0), i = 0);
      for (let l = i; l < a; l++) t[l] = 0;
      Ws(o, a - 8, BigInt(this.length * 8), n), this.process(o, 0);
      const s = no(r), u = this.outputLen;
      if (u % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
      const c = u / 4, d = this.get();
      if (c > d.length) throw new Error("_sha2: outputLen bigger than state");
      for (let l = 0; l < c; l++) s.setUint32(4 * l, d[l], n);
    }
    digest() {
      const { buffer: r, outputLen: t } = this;
      this.digestInto(r);
      const o = r.slice(0, t);
      return this.destroy(), o;
    }
    _cloneInto(r) {
      r || (r = new this.constructor()), r.set(...this.get());
      const { blockLen: t, buffer: o, length: a, finished: n, destroyed: i, pos: s } = this;
      return r.destroyed = i, r.finished = n, r.length = a, r.pos = s, a % t && r.buffer.set(o), r;
    }
    clone() {
      return this._cloneInto();
    }
  }
  const or = Uint32Array.from([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]), de = Uint32Array.from([
    1779033703,
    4089235720,
    3144134277,
    2227873595,
    1013904242,
    4271175723,
    2773480762,
    1595750129,
    1359893119,
    2917565137,
    2600822924,
    725511199,
    528734635,
    4215389547,
    1541459225,
    327033209
  ]), Js = Uint8Array.from([
    7,
    4,
    13,
    1,
    10,
    6,
    15,
    3,
    12,
    0,
    9,
    5,
    2,
    14,
    11,
    8
  ]), Vn = Uint8Array.from(new Array(16).fill(0).map((e, r) => r)), Qs = Vn.map((e) => (9 * e + 5) % 16), Mn = (() => {
    const t = [
      [
        Vn
      ],
      [
        Qs
      ]
    ];
    for (let o = 0; o < 4; o++) for (let a of t) a.push(a[o].map((n) => Js[n]));
    return t;
  })(), $n = Mn[0], qn = Mn[1], Gn = [
    [
      11,
      14,
      15,
      12,
      5,
      8,
      7,
      9,
      11,
      13,
      14,
      15,
      6,
      7,
      9,
      8
    ],
    [
      12,
      13,
      11,
      15,
      6,
      9,
      9,
      7,
      12,
      15,
      11,
      13,
      7,
      8,
      7,
      7
    ],
    [
      13,
      15,
      14,
      11,
      7,
      7,
      6,
      8,
      13,
      14,
      13,
      12,
      5,
      5,
      6,
      9
    ],
    [
      14,
      11,
      12,
      14,
      8,
      6,
      5,
      5,
      15,
      12,
      15,
      14,
      9,
      9,
      8,
      6
    ],
    [
      15,
      12,
      13,
      13,
      9,
      5,
      8,
      6,
      14,
      11,
      12,
      11,
      8,
      6,
      5,
      5
    ]
  ].map((e) => Uint8Array.from(e)), Zs = $n.map((e, r) => e.map((t) => Gn[r][t])), ec = qn.map((e, r) => e.map((t) => Gn[r][t])), rc = Uint32Array.from([
    0,
    1518500249,
    1859775393,
    2400959708,
    2840853838
  ]), tc = Uint32Array.from([
    1352829926,
    1548603684,
    1836072691,
    2053994217,
    0
  ]);
  function va(e, r, t, o) {
    return e === 0 ? r ^ t ^ o : e === 1 ? r & t | ~r & o : e === 2 ? (r | ~t) ^ o : e === 3 ? r & o | t & ~o : r ^ (t | ~o);
  }
  const st = new Uint32Array(16);
  class oc extends $o {
    constructor() {
      super(64, 20, 8, true), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
    }
    get() {
      const { h0: r, h1: t, h2: o, h3: a, h4: n } = this;
      return [
        r,
        t,
        o,
        a,
        n
      ];
    }
    set(r, t, o, a, n) {
      this.h0 = r | 0, this.h1 = t | 0, this.h2 = o | 0, this.h3 = a | 0, this.h4 = n | 0;
    }
    process(r, t) {
      for (let p = 0; p < 16; p++, t += 4) st[p] = r.getUint32(t, true);
      let o = this.h0 | 0, a = o, n = this.h1 | 0, i = n, s = this.h2 | 0, u = s, c = this.h3 | 0, d = c, l = this.h4 | 0, f = l;
      for (let p = 0; p < 5; p++) {
        const h = 4 - p, m = rc[p], v = tc[p], E = $n[p], A = qn[p], y = Zs[p], k = ec[p];
        for (let _ = 0; _ < 16; _++) {
          const S = it(o + va(p, n, s, c) + st[E[_]] + m, y[_]) + l | 0;
          o = l, l = c, c = it(s, 10) | 0, s = n, n = S;
        }
        for (let _ = 0; _ < 16; _++) {
          const S = it(a + va(h, i, u, d) + st[A[_]] + v, k[_]) + f | 0;
          a = f, f = d, d = it(u, 10) | 0, u = i, i = S;
        }
      }
      this.set(this.h1 + s + d | 0, this.h2 + c + f | 0, this.h3 + l + a | 0, this.h4 + o + i | 0, this.h0 + n + u | 0);
    }
    roundClean() {
      dr(st);
    }
    destroy() {
      this.destroyed = true, dr(this.buffer), this.set(0, 0, 0, 0, 0);
    }
  }
  const ac = Mo(() => new oc()), Wn = ac, ct = BigInt(2 ** 32 - 1), wa = BigInt(32);
  function nc(e, r = false) {
    return r ? {
      h: Number(e & ct),
      l: Number(e >> wa & ct)
    } : {
      h: Number(e >> wa & ct) | 0,
      l: Number(e & ct) | 0
    };
  }
  function ic(e, r = false) {
    const t = e.length;
    let o = new Uint32Array(t), a = new Uint32Array(t);
    for (let n = 0; n < t; n++) {
      const { h: i, l: s } = nc(e[n], r);
      [o[n], a[n]] = [
        i,
        s
      ];
    }
    return [
      o,
      a
    ];
  }
  const ka = (e, r, t) => e >>> t, _a = (e, r, t) => e << 32 - t | r >>> t, xr = (e, r, t) => e >>> t | r << 32 - t, Ar = (e, r, t) => e << 32 - t | r >>> t, ut = (e, r, t) => e << 64 - t | r >>> t - 32, lt = (e, r, t) => e >>> t - 32 | r << 64 - t;
  function Ge(e, r, t, o) {
    const a = (r >>> 0) + (o >>> 0);
    return {
      h: e + t + (a / 2 ** 32 | 0) | 0,
      l: a | 0
    };
  }
  const sc = (e, r, t) => (e >>> 0) + (r >>> 0) + (t >>> 0), cc = (e, r, t, o) => r + t + o + (e / 2 ** 32 | 0) | 0, uc = (e, r, t, o) => (e >>> 0) + (r >>> 0) + (t >>> 0) + (o >>> 0), lc = (e, r, t, o, a) => r + t + o + a + (e / 2 ** 32 | 0) | 0, dc = (e, r, t, o, a) => (e >>> 0) + (r >>> 0) + (t >>> 0) + (o >>> 0) + (a >>> 0), fc = (e, r, t, o, a, n) => r + t + o + a + n + (e / 2 ** 32 | 0) | 0, hc = Uint32Array.from([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]), ar = new Uint32Array(64);
  class pc extends $o {
    constructor(r = 32) {
      super(64, r, 8, false), this.A = or[0] | 0, this.B = or[1] | 0, this.C = or[2] | 0, this.D = or[3] | 0, this.E = or[4] | 0, this.F = or[5] | 0, this.G = or[6] | 0, this.H = or[7] | 0;
    }
    get() {
      const { A: r, B: t, C: o, D: a, E: n, F: i, G: s, H: u } = this;
      return [
        r,
        t,
        o,
        a,
        n,
        i,
        s,
        u
      ];
    }
    set(r, t, o, a, n, i, s, u) {
      this.A = r | 0, this.B = t | 0, this.C = o | 0, this.D = a | 0, this.E = n | 0, this.F = i | 0, this.G = s | 0, this.H = u | 0;
    }
    process(r, t) {
      for (let l = 0; l < 16; l++, t += 4) ar[l] = r.getUint32(t, false);
      for (let l = 16; l < 64; l++) {
        const f = ar[l - 15], p = ar[l - 2], h = Be(f, 7) ^ Be(f, 18) ^ f >>> 3, m = Be(p, 17) ^ Be(p, 19) ^ p >>> 10;
        ar[l] = m + ar[l - 7] + h + ar[l - 16] | 0;
      }
      let { A: o, B: a, C: n, D: i, E: s, F: u, G: c, H: d } = this;
      for (let l = 0; l < 64; l++) {
        const f = Be(s, 6) ^ Be(s, 11) ^ Be(s, 25), p = d + f + Xs(s, u, c) + hc[l] + ar[l] | 0, m = (Be(o, 2) ^ Be(o, 13) ^ Be(o, 22)) + Ys(o, a, n) | 0;
        d = c, c = u, u = s, s = i + p | 0, i = n, n = a, a = o, o = p + m | 0;
      }
      o = o + this.A | 0, a = a + this.B | 0, n = n + this.C | 0, i = i + this.D | 0, s = s + this.E | 0, u = u + this.F | 0, c = c + this.G | 0, d = d + this.H | 0, this.set(o, a, n, i, s, u, c, d);
    }
    roundClean() {
      dr(ar);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0), dr(this.buffer);
    }
  }
  const Xn = ic([
    "0x428a2f98d728ae22",
    "0x7137449123ef65cd",
    "0xb5c0fbcfec4d3b2f",
    "0xe9b5dba58189dbbc",
    "0x3956c25bf348b538",
    "0x59f111f1b605d019",
    "0x923f82a4af194f9b",
    "0xab1c5ed5da6d8118",
    "0xd807aa98a3030242",
    "0x12835b0145706fbe",
    "0x243185be4ee4b28c",
    "0x550c7dc3d5ffb4e2",
    "0x72be5d74f27b896f",
    "0x80deb1fe3b1696b1",
    "0x9bdc06a725c71235",
    "0xc19bf174cf692694",
    "0xe49b69c19ef14ad2",
    "0xefbe4786384f25e3",
    "0x0fc19dc68b8cd5b5",
    "0x240ca1cc77ac9c65",
    "0x2de92c6f592b0275",
    "0x4a7484aa6ea6e483",
    "0x5cb0a9dcbd41fbd4",
    "0x76f988da831153b5",
    "0x983e5152ee66dfab",
    "0xa831c66d2db43210",
    "0xb00327c898fb213f",
    "0xbf597fc7beef0ee4",
    "0xc6e00bf33da88fc2",
    "0xd5a79147930aa725",
    "0x06ca6351e003826f",
    "0x142929670a0e6e70",
    "0x27b70a8546d22ffc",
    "0x2e1b21385c26c926",
    "0x4d2c6dfc5ac42aed",
    "0x53380d139d95b3df",
    "0x650a73548baf63de",
    "0x766a0abb3c77b2a8",
    "0x81c2c92e47edaee6",
    "0x92722c851482353b",
    "0xa2bfe8a14cf10364",
    "0xa81a664bbc423001",
    "0xc24b8b70d0f89791",
    "0xc76c51a30654be30",
    "0xd192e819d6ef5218",
    "0xd69906245565a910",
    "0xf40e35855771202a",
    "0x106aa07032bbd1b8",
    "0x19a4c116b8d2d0c8",
    "0x1e376c085141ab53",
    "0x2748774cdf8eeb99",
    "0x34b0bcb5e19b48a8",
    "0x391c0cb3c5c95a63",
    "0x4ed8aa4ae3418acb",
    "0x5b9cca4f7763e373",
    "0x682e6ff3d6b2b8a3",
    "0x748f82ee5defb2fc",
    "0x78a5636f43172f60",
    "0x84c87814a1f0ab72",
    "0x8cc702081a6439ec",
    "0x90befffa23631e28",
    "0xa4506cebde82bde9",
    "0xbef9a3f7b2c67915",
    "0xc67178f2e372532b",
    "0xca273eceea26619c",
    "0xd186b8c721c0c207",
    "0xeada7dd6cde0eb1e",
    "0xf57d4f7fee6ed178",
    "0x06f067aa72176fba",
    "0x0a637dc5a2c898a6",
    "0x113f9804bef90dae",
    "0x1b710b35131c471b",
    "0x28db77f523047d84",
    "0x32caab7b40c72493",
    "0x3c9ebe0a15c9bebc",
    "0x431d67c49c100d4c",
    "0x4cc5d4becb3e42b6",
    "0x597f299cfc657e2a",
    "0x5fcb6fab3ad6faec",
    "0x6c44198c4a475817"
  ].map((e) => BigInt(e))), mc = Xn[0], gc = Xn[1], nr = new Uint32Array(80), ir = new Uint32Array(80);
  class bc extends $o {
    constructor(r = 64) {
      super(128, r, 16, false), this.Ah = de[0] | 0, this.Al = de[1] | 0, this.Bh = de[2] | 0, this.Bl = de[3] | 0, this.Ch = de[4] | 0, this.Cl = de[5] | 0, this.Dh = de[6] | 0, this.Dl = de[7] | 0, this.Eh = de[8] | 0, this.El = de[9] | 0, this.Fh = de[10] | 0, this.Fl = de[11] | 0, this.Gh = de[12] | 0, this.Gl = de[13] | 0, this.Hh = de[14] | 0, this.Hl = de[15] | 0;
    }
    get() {
      const { Ah: r, Al: t, Bh: o, Bl: a, Ch: n, Cl: i, Dh: s, Dl: u, Eh: c, El: d, Fh: l, Fl: f, Gh: p, Gl: h, Hh: m, Hl: v } = this;
      return [
        r,
        t,
        o,
        a,
        n,
        i,
        s,
        u,
        c,
        d,
        l,
        f,
        p,
        h,
        m,
        v
      ];
    }
    set(r, t, o, a, n, i, s, u, c, d, l, f, p, h, m, v) {
      this.Ah = r | 0, this.Al = t | 0, this.Bh = o | 0, this.Bl = a | 0, this.Ch = n | 0, this.Cl = i | 0, this.Dh = s | 0, this.Dl = u | 0, this.Eh = c | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = f | 0, this.Gh = p | 0, this.Gl = h | 0, this.Hh = m | 0, this.Hl = v | 0;
    }
    process(r, t) {
      for (let y = 0; y < 16; y++, t += 4) nr[y] = r.getUint32(t), ir[y] = r.getUint32(t += 4);
      for (let y = 16; y < 80; y++) {
        const k = nr[y - 15] | 0, _ = ir[y - 15] | 0, S = xr(k, _, 1) ^ xr(k, _, 8) ^ ka(k, _, 7), j = Ar(k, _, 1) ^ Ar(k, _, 8) ^ _a(k, _, 7), R = nr[y - 2] | 0, b = ir[y - 2] | 0, w = xr(R, b, 19) ^ ut(R, b, 61) ^ ka(R, b, 6), x = Ar(R, b, 19) ^ lt(R, b, 61) ^ _a(R, b, 6), H = uc(j, x, ir[y - 7], ir[y - 16]), T = lc(H, S, w, nr[y - 7], nr[y - 16]);
        nr[y] = T | 0, ir[y] = H | 0;
      }
      let { Ah: o, Al: a, Bh: n, Bl: i, Ch: s, Cl: u, Dh: c, Dl: d, Eh: l, El: f, Fh: p, Fl: h, Gh: m, Gl: v, Hh: E, Hl: A } = this;
      for (let y = 0; y < 80; y++) {
        const k = xr(l, f, 14) ^ xr(l, f, 18) ^ ut(l, f, 41), _ = Ar(l, f, 14) ^ Ar(l, f, 18) ^ lt(l, f, 41), S = l & p ^ ~l & m, j = f & h ^ ~f & v, R = dc(A, _, j, gc[y], ir[y]), b = fc(R, E, k, S, mc[y], nr[y]), w = R | 0, x = xr(o, a, 28) ^ ut(o, a, 34) ^ ut(o, a, 39), H = Ar(o, a, 28) ^ lt(o, a, 34) ^ lt(o, a, 39), T = o & n ^ o & s ^ n & s, D = a & i ^ a & u ^ i & u;
        E = m | 0, A = v | 0, m = p | 0, v = h | 0, p = l | 0, h = f | 0, { h: l, l: f } = Ge(c | 0, d | 0, b | 0, w | 0), c = s | 0, d = u | 0, s = n | 0, u = i | 0, n = o | 0, i = a | 0;
        const M = sc(w, H, D);
        o = cc(M, b, x, T), a = M | 0;
      }
      ({ h: o, l: a } = Ge(this.Ah | 0, this.Al | 0, o | 0, a | 0)), { h: n, l: i } = Ge(this.Bh | 0, this.Bl | 0, n | 0, i | 0), { h: s, l: u } = Ge(this.Ch | 0, this.Cl | 0, s | 0, u | 0), { h: c, l: d } = Ge(this.Dh | 0, this.Dl | 0, c | 0, d | 0), { h: l, l: f } = Ge(this.Eh | 0, this.El | 0, l | 0, f | 0), { h: p, l: h } = Ge(this.Fh | 0, this.Fl | 0, p | 0, h | 0), { h: m, l: v } = Ge(this.Gh | 0, this.Gl | 0, m | 0, v | 0), { h: E, l: A } = Ge(this.Hh | 0, this.Hl | 0, E | 0, A | 0), this.set(o, a, n, i, s, u, c, d, l, f, p, h, m, v, E, A);
    }
    roundClean() {
      dr(nr, ir);
    }
    destroy() {
      dr(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
  }
  const yc = Mo(() => new pc()), vc = Mo(() => new bc()), ue = yc;
  function Ze(e) {
    return Wn(ue(e));
  }
  function mr(e) {
    return ue(ue(e));
  }
  const wc = {
    "BIP0340/challenge": Uint8Array.from([
      123,
      181,
      45,
      122,
      159,
      239,
      88,
      50,
      62,
      177,
      191,
      122,
      64,
      125,
      179,
      130,
      210,
      243,
      242,
      216,
      27,
      177,
      34,
      79,
      73,
      254,
      81,
      143,
      109,
      72,
      211,
      124,
      123,
      181,
      45,
      122,
      159,
      239,
      88,
      50,
      62,
      177,
      191,
      122,
      64,
      125,
      179,
      130,
      210,
      243,
      242,
      216,
      27,
      177,
      34,
      79,
      73,
      254,
      81,
      143,
      109,
      72,
      211,
      124
    ]),
    "BIP0340/aux": Uint8Array.from([
      241,
      239,
      78,
      94,
      192,
      99,
      202,
      218,
      109,
      148,
      202,
      250,
      157,
      152,
      126,
      160,
      105,
      38,
      88,
      57,
      236,
      193,
      31,
      151,
      45,
      119,
      165,
      46,
      216,
      193,
      204,
      144,
      241,
      239,
      78,
      94,
      192,
      99,
      202,
      218,
      109,
      148,
      202,
      250,
      157,
      152,
      126,
      160,
      105,
      38,
      88,
      57,
      236,
      193,
      31,
      151,
      45,
      119,
      165,
      46,
      216,
      193,
      204,
      144
    ]),
    "BIP0340/nonce": Uint8Array.from([
      7,
      73,
      119,
      52,
      167,
      155,
      203,
      53,
      91,
      155,
      140,
      125,
      3,
      79,
      18,
      28,
      244,
      52,
      215,
      62,
      247,
      45,
      218,
      25,
      135,
      0,
      97,
      251,
      82,
      191,
      235,
      47,
      7,
      73,
      119,
      52,
      167,
      155,
      203,
      53,
      91,
      155,
      140,
      125,
      3,
      79,
      18,
      28,
      244,
      52,
      215,
      62,
      247,
      45,
      218,
      25,
      135,
      0,
      97,
      251,
      82,
      191,
      235,
      47
    ]),
    TapLeaf: Uint8Array.from([
      174,
      234,
      143,
      220,
      66,
      8,
      152,
      49,
      5,
      115,
      75,
      88,
      8,
      29,
      30,
      38,
      56,
      211,
      95,
      28,
      181,
      64,
      8,
      212,
      211,
      87,
      202,
      3,
      190,
      120,
      233,
      238,
      174,
      234,
      143,
      220,
      66,
      8,
      152,
      49,
      5,
      115,
      75,
      88,
      8,
      29,
      30,
      38,
      56,
      211,
      95,
      28,
      181,
      64,
      8,
      212,
      211,
      87,
      202,
      3,
      190,
      120,
      233,
      238
    ]),
    TapBranch: Uint8Array.from([
      25,
      65,
      161,
      242,
      229,
      110,
      185,
      95,
      162,
      169,
      241,
      148,
      190,
      92,
      1,
      247,
      33,
      111,
      51,
      237,
      130,
      176,
      145,
      70,
      52,
      144,
      208,
      91,
      245,
      22,
      160,
      21,
      25,
      65,
      161,
      242,
      229,
      110,
      185,
      95,
      162,
      169,
      241,
      148,
      190,
      92,
      1,
      247,
      33,
      111,
      51,
      237,
      130,
      176,
      145,
      70,
      52,
      144,
      208,
      91,
      245,
      22,
      160,
      21
    ]),
    TapSighash: Uint8Array.from([
      244,
      10,
      72,
      223,
      75,
      42,
      112,
      200,
      180,
      146,
      75,
      242,
      101,
      70,
      97,
      237,
      61,
      149,
      253,
      102,
      163,
      19,
      235,
      135,
      35,
      117,
      151,
      198,
      40,
      228,
      160,
      49,
      244,
      10,
      72,
      223,
      75,
      42,
      112,
      200,
      180,
      146,
      75,
      242,
      101,
      70,
      97,
      237,
      61,
      149,
      253,
      102,
      163,
      19,
      235,
      135,
      35,
      117,
      151,
      198,
      40,
      228,
      160,
      49
    ]),
    TapTweak: Uint8Array.from([
      232,
      15,
      225,
      99,
      156,
      156,
      160,
      80,
      227,
      175,
      27,
      57,
      193,
      67,
      198,
      62,
      66,
      156,
      188,
      235,
      21,
      217,
      64,
      251,
      181,
      197,
      161,
      244,
      175,
      87,
      197,
      233,
      232,
      15,
      225,
      99,
      156,
      156,
      160,
      80,
      227,
      175,
      27,
      57,
      193,
      67,
      198,
      62,
      66,
      156,
      188,
      235,
      21,
      217,
      64,
      251,
      181,
      197,
      161,
      244,
      175,
      87,
      197,
      233
    ]),
    "KeyAgg list": Uint8Array.from([
      72,
      28,
      151,
      28,
      60,
      11,
      70,
      215,
      240,
      178,
      117,
      174,
      89,
      141,
      78,
      44,
      126,
      215,
      49,
      156,
      89,
      74,
      92,
      110,
      199,
      158,
      160,
      212,
      153,
      2,
      148,
      240,
      72,
      28,
      151,
      28,
      60,
      11,
      70,
      215,
      240,
      178,
      117,
      174,
      89,
      141,
      78,
      44,
      126,
      215,
      49,
      156,
      89,
      74,
      92,
      110,
      199,
      158,
      160,
      212,
      153,
      2,
      148,
      240
    ]),
    "KeyAgg coefficient": Uint8Array.from([
      191,
      201,
      4,
      3,
      77,
      28,
      136,
      232,
      200,
      14,
      34,
      229,
      61,
      36,
      86,
      109,
      100,
      130,
      78,
      214,
      66,
      114,
      129,
      192,
      145,
      0,
      249,
      77,
      205,
      82,
      201,
      129,
      191,
      201,
      4,
      3,
      77,
      28,
      136,
      232,
      200,
      14,
      34,
      229,
      61,
      36,
      86,
      109,
      100,
      130,
      78,
      214,
      66,
      114,
      129,
      192,
      145,
      0,
      249,
      77,
      205,
      82,
      201,
      129
    ])
  };
  function Kt(e, r) {
    return ue(Ee([
      wc[e],
      r
    ]));
  }
  function kc(e) {
    if (e.length >= 255) throw new TypeError("Alphabet too long");
    const r = new Uint8Array(256);
    for (let c = 0; c < r.length; c++) r[c] = 255;
    for (let c = 0; c < e.length; c++) {
      const d = e.charAt(c), l = d.charCodeAt(0);
      if (r[l] !== 255) throw new TypeError(d + " is ambiguous");
      r[l] = c;
    }
    const t = e.length, o = e.charAt(0), a = Math.log(t) / Math.log(256), n = Math.log(256) / Math.log(t);
    function i(c) {
      if (c instanceof Uint8Array || (ArrayBuffer.isView(c) ? c = new Uint8Array(c.buffer, c.byteOffset, c.byteLength) : Array.isArray(c) && (c = Uint8Array.from(c))), !(c instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
      if (c.length === 0) return "";
      let d = 0, l = 0, f = 0;
      const p = c.length;
      for (; f !== p && c[f] === 0; ) f++, d++;
      const h = (p - f) * n + 1 >>> 0, m = new Uint8Array(h);
      for (; f !== p; ) {
        let A = c[f], y = 0;
        for (let k = h - 1; (A !== 0 || y < l) && k !== -1; k--, y++) A += 256 * m[k] >>> 0, m[k] = A % t >>> 0, A = A / t >>> 0;
        if (A !== 0) throw new Error("Non-zero carry");
        l = y, f++;
      }
      let v = h - l;
      for (; v !== h && m[v] === 0; ) v++;
      let E = o.repeat(d);
      for (; v < h; ++v) E += e.charAt(m[v]);
      return E;
    }
    function s(c) {
      if (typeof c != "string") throw new TypeError("Expected String");
      if (c.length === 0) return new Uint8Array();
      let d = 0, l = 0, f = 0;
      for (; c[d] === o; ) l++, d++;
      const p = (c.length - d) * a + 1 >>> 0, h = new Uint8Array(p);
      for (; d < c.length; ) {
        const A = c.charCodeAt(d);
        if (A > 255) return;
        let y = r[A];
        if (y === 255) return;
        let k = 0;
        for (let _ = p - 1; (y !== 0 || k < f) && _ !== -1; _--, k++) y += t * h[_] >>> 0, h[_] = y % 256 >>> 0, y = y / 256 >>> 0;
        if (y !== 0) throw new Error("Non-zero carry");
        f = k, d++;
      }
      let m = p - f;
      for (; m !== p && h[m] === 0; ) m++;
      const v = new Uint8Array(l + (p - m));
      let E = l;
      for (; m !== p; ) v[E++] = h[m++];
      return v;
    }
    function u(c) {
      const d = s(c);
      if (d) return d;
      throw new Error("Non-base" + t + " character");
    }
    return {
      encode: i,
      decodeUnsafe: s,
      decode: u
    };
  }
  var _c = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const io = kc(_c);
  function Ec(e) {
    function r(n) {
      var i = Uint8Array.from(n), s = e(i), u = i.length + 4, c = new Uint8Array(u);
      return c.set(i, 0), c.set(s.subarray(0, 4), i.length), io.encode(c);
    }
    function t(n) {
      var i = n.slice(0, -4), s = n.slice(-4), u = e(i);
      if (!(s[0] ^ u[0] | s[1] ^ u[1] | s[2] ^ u[2] | s[3] ^ u[3])) return i;
    }
    function o(n) {
      var i = io.decodeUnsafe(n);
      if (i != null) return t(i);
    }
    function a(n) {
      var i = io.decode(n), s = t(i);
      if (s == null) throw new Error("Invalid checksum");
      return s;
    }
    return {
      encode: r,
      decode: a,
      decodeUnsafe: o
    };
  }
  function xc(e) {
    return ue(ue(e));
  }
  const Ur = Ec(xc), sr = q;
  Jr = function(e, r) {
    if (!e.address && !e.hash && !e.output && !e.pubkey && !e.input) throw new TypeError("Not enough data");
    r = Object.assign({
      validate: true
    }, r || {}), ee(lr(re({
      network: re({}),
      address: Pr(),
      hash: Os,
      output: ne(25),
      pubkey: Le(Re),
      signature: Le(er),
      input: $
    })), e);
    const t = Te(() => {
      const i = Ur.decode(e.address), s = ur(i, 0), u = i.slice(1);
      return {
        version: s,
        hash: u
      };
    }), o = Te(() => J(e.input)), a = e.network || $e, n = {
      name: "p2pkh",
      network: a
    };
    if (P(n, "address", () => {
      if (!n.hash) return;
      const i = new Uint8Array(21);
      return _e(i, 0, a.pubKeyHash), i.set(n.hash, 1), Ur.encode(i);
    }), P(n, "hash", () => {
      if (e.output) return e.output.slice(3, 23);
      if (e.address) return t().hash;
      if (e.pubkey || n.pubkey) return Ze(e.pubkey || n.pubkey);
    }), P(n, "output", () => {
      if (n.hash) return ve([
        sr.OP_DUP,
        sr.OP_HASH160,
        n.hash,
        sr.OP_EQUALVERIFY,
        sr.OP_CHECKSIG
      ]);
    }), P(n, "pubkey", () => {
      if (e.input) return o()[1];
    }), P(n, "signature", () => {
      if (e.input) return o()[0];
    }), P(n, "input", () => {
      if (e.pubkey && e.signature) return ve([
        e.signature,
        e.pubkey
      ]);
    }), P(n, "witness", () => {
      if (n.input) return [];
    }), r.validate) {
      let i = Uint8Array.from([]);
      if (e.address) {
        if (t().version !== a.pubKeyHash) throw new TypeError("Invalid version or Network mismatch");
        if (t().hash.length !== 20) throw new TypeError("Invalid address");
        i = t().hash;
      }
      if (e.hash) {
        if (i.length > 0 && U(i, e.hash) !== 0) throw new TypeError("Hash mismatch");
        i = e.hash;
      }
      if (e.output) {
        if (e.output.length !== 25 || e.output[0] !== sr.OP_DUP || e.output[1] !== sr.OP_HASH160 || e.output[2] !== 20 || e.output[23] !== sr.OP_EQUALVERIFY || e.output[24] !== sr.OP_CHECKSIG) throw new TypeError("Output is invalid");
        const s = e.output.slice(3, 23);
        if (i.length > 0 && U(i, s) !== 0) throw new TypeError("Hash mismatch");
        i = s;
      }
      if (e.pubkey) {
        const s = Ze(e.pubkey);
        if (i.length > 0 && U(i, s) !== 0) throw new TypeError("Hash mismatch");
        i = s;
      }
      if (e.input) {
        const s = o();
        if (s.length !== 2) throw new TypeError("Input is invalid");
        if (!er(s[0])) throw new TypeError("Input has invalid signature");
        if (!Re(s[1])) throw new TypeError("Input has invalid pubkey");
        if (e.signature && U(e.signature, s[0]) !== 0) throw new TypeError("Signature mismatch");
        if (e.pubkey && U(e.pubkey, s[1]) !== 0) throw new TypeError("Pubkey mismatch");
        const u = Ze(s[1]);
        if (i.length > 0 && U(i, u) !== 0) throw new TypeError("Hash mismatch");
      }
    }
    return Object.assign(n, e);
  };
  const Lr = q;
  function Qr(e, r) {
    if (!e.address && !e.hash && !e.output && !e.redeem && !e.input) throw new TypeError("Not enough data");
    r = Object.assign({
      validate: true
    }, r || {}), ee(lr(re({
      network: re({}),
      address: Pr(),
      hash: ne(20),
      output: ne(23),
      redeem: lr(re({
        network: re({}),
        output: $,
        input: $,
        witness: ye($)
      })),
      input: $,
      witness: ye($)
    })), e);
    let t = e.network;
    t || (t = e.redeem && e.redeem.network || $e);
    const o = {
      network: t
    }, a = Te(() => {
      const s = Ur.decode(e.address), u = ur(s, 0), c = s.slice(1);
      return {
        version: u,
        hash: c
      };
    }), n = Te(() => J(e.input)), i = Te(() => {
      const s = n(), u = s[s.length - 1];
      return {
        network: t,
        output: u === Lr.OP_FALSE ? Uint8Array.from([]) : u,
        input: ve(s.slice(0, -1)),
        witness: e.witness || []
      };
    });
    if (P(o, "address", () => {
      if (!o.hash) return;
      const s = new Uint8Array(21);
      return _e(s, 0, o.network.scriptHash), s.set(o.hash, 1), Ur.encode(s);
    }), P(o, "hash", () => {
      if (e.output) return e.output.slice(2, 22);
      if (e.address) return a().hash;
      if (o.redeem && o.redeem.output) return Ze(o.redeem.output);
    }), P(o, "output", () => {
      if (o.hash) return ve([
        Lr.OP_HASH160,
        o.hash,
        Lr.OP_EQUAL
      ]);
    }), P(o, "redeem", () => {
      if (e.input) return i();
    }), P(o, "input", () => {
      if (!(!e.redeem || !e.redeem.input || !e.redeem.output)) return ve([].concat(J(e.redeem.input), e.redeem.output));
    }), P(o, "witness", () => {
      if (o.redeem && o.redeem.witness) return o.redeem.witness;
      if (o.input) return [];
    }), P(o, "name", () => {
      const s = [
        "p2sh"
      ];
      return o.redeem !== void 0 && o.redeem.name !== void 0 && s.push(o.redeem.name), s.join("-");
    }), r.validate) {
      let s = Uint8Array.from([]);
      if (e.address) {
        if (a().version !== t.scriptHash) throw new TypeError("Invalid version or Network mismatch");
        if (a().hash.length !== 20) throw new TypeError("Invalid address");
        s = a().hash;
      }
      if (e.hash) {
        if (s.length > 0 && U(s, e.hash) !== 0) throw new TypeError("Hash mismatch");
        s = e.hash;
      }
      if (e.output) {
        if (e.output.length !== 23 || e.output[0] !== Lr.OP_HASH160 || e.output[1] !== 20 || e.output[22] !== Lr.OP_EQUAL) throw new TypeError("Output is invalid");
        const c = e.output.slice(2, 22);
        if (s.length > 0 && U(s, c) !== 0) throw new TypeError("Hash mismatch");
        s = c;
      }
      const u = (c) => {
        if (c.output) {
          const d = J(c.output);
          if (!d || d.length < 1) throw new TypeError("Redeem.output too short");
          if (c.output.byteLength > 520) throw new TypeError("Redeem.output unspendable if larger than 520 bytes");
          if (Bn(d) > 201) throw new TypeError("Redeem.output unspendable with more than 201 non-push ops");
          const l = Ze(c.output);
          if (s.length > 0 && U(s, l) !== 0) throw new TypeError("Hash mismatch");
          s = l;
        }
        if (c.input) {
          const d = c.input.length > 0, l = c.witness && c.witness.length > 0;
          if (!d && !l) throw new TypeError("Empty input");
          if (d && l) throw new TypeError("Input and witness provided");
          if (d) {
            const f = J(c.input);
            if (!Fo(f)) throw new TypeError("Non push-only scriptSig");
          }
        }
      };
      if (e.input) {
        const c = n();
        if (!c || c.length < 1) throw new TypeError("Input too short");
        if (!(i().output instanceof Uint8Array)) throw new TypeError("Input is invalid");
        u(i());
      }
      if (e.redeem) {
        if (e.redeem.network && e.redeem.network !== t) throw new TypeError("Network mismatch");
        if (e.input) {
          const c = i();
          if (e.redeem.output && U(e.redeem.output, c.output) !== 0) throw new TypeError("Redeem.output mismatch");
          if (e.redeem.input && U(e.redeem.input, c.input) !== 0) throw new TypeError("Redeem.input mismatch");
        }
        u(e.redeem);
      }
      if (e.witness && e.redeem && e.redeem.witness && !$r(e.redeem.witness, e.witness)) throw new TypeError("Witness and redeem.witness mismatch");
    }
    return Object.assign(o, e);
  }
  Yh = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
  Jh = function(e) {
    return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
  };
  var gr = {}, Ea;
  function Ac() {
    if (Ea) return gr;
    Ea = 1, Object.defineProperty(gr, "__esModule", {
      value: true
    }), gr.bech32m = gr.bech32 = void 0;
    const e = "qpzry9x8gf2tvdw0s3jn54khce6mua7l", r = {};
    for (let c = 0; c < e.length; c++) {
      const d = e.charAt(c);
      r[d] = c;
    }
    function t(c) {
      const d = c >> 25;
      return (c & 33554431) << 5 ^ -(d >> 0 & 1) & 996825010 ^ -(d >> 1 & 1) & 642813549 ^ -(d >> 2 & 1) & 513874426 ^ -(d >> 3 & 1) & 1027748829 ^ -(d >> 4 & 1) & 705979059;
    }
    function o(c) {
      let d = 1;
      for (let l = 0; l < c.length; ++l) {
        const f = c.charCodeAt(l);
        if (f < 33 || f > 126) return "Invalid prefix (" + c + ")";
        d = t(d) ^ f >> 5;
      }
      d = t(d);
      for (let l = 0; l < c.length; ++l) {
        const f = c.charCodeAt(l);
        d = t(d) ^ f & 31;
      }
      return d;
    }
    function a(c, d, l, f) {
      let p = 0, h = 0;
      const m = (1 << l) - 1, v = [];
      for (let E = 0; E < c.length; ++E) for (p = p << d | c[E], h += d; h >= l; ) h -= l, v.push(p >> h & m);
      if (f) h > 0 && v.push(p << l - h & m);
      else {
        if (h >= d) return "Excess padding";
        if (p << l - h & m) return "Non-zero padding";
      }
      return v;
    }
    function n(c) {
      return a(c, 8, 5, true);
    }
    function i(c) {
      const d = a(c, 5, 8, false);
      if (Array.isArray(d)) return d;
    }
    function s(c) {
      const d = a(c, 5, 8, false);
      if (Array.isArray(d)) return d;
      throw new Error(d);
    }
    function u(c) {
      let d;
      c === "bech32" ? d = 1 : d = 734539939;
      function l(m, v, E) {
        if (E = E || 90, m.length + 7 + v.length > E) throw new TypeError("Exceeds length limit");
        m = m.toLowerCase();
        let A = o(m);
        if (typeof A == "string") throw new Error(A);
        let y = m + "1";
        for (let k = 0; k < v.length; ++k) {
          const _ = v[k];
          if (_ >> 5 !== 0) throw new Error("Non 5-bit word");
          A = t(A) ^ _, y += e.charAt(_);
        }
        for (let k = 0; k < 6; ++k) A = t(A);
        A ^= d;
        for (let k = 0; k < 6; ++k) {
          const _ = A >> (5 - k) * 5 & 31;
          y += e.charAt(_);
        }
        return y;
      }
      function f(m, v) {
        if (v = v || 90, m.length < 8) return m + " too short";
        if (m.length > v) return "Exceeds length limit";
        const E = m.toLowerCase(), A = m.toUpperCase();
        if (m !== E && m !== A) return "Mixed-case string " + m;
        m = E;
        const y = m.lastIndexOf("1");
        if (y === -1) return "No separator character for " + m;
        if (y === 0) return "Missing prefix for " + m;
        const k = m.slice(0, y), _ = m.slice(y + 1);
        if (_.length < 6) return "Data too short";
        let S = o(k);
        if (typeof S == "string") return S;
        const j = [];
        for (let R = 0; R < _.length; ++R) {
          const b = _.charAt(R), w = r[b];
          if (w === void 0) return "Unknown character " + b;
          S = t(S) ^ w, !(R + 6 >= _.length) && j.push(w);
        }
        return S !== d ? "Invalid checksum for " + m : {
          prefix: k,
          words: j
        };
      }
      function p(m, v) {
        const E = f(m, v);
        if (typeof E == "object") return E;
      }
      function h(m, v) {
        const E = f(m, v);
        if (typeof E == "object") return E;
        throw new Error(E);
      }
      return {
        decodeUnsafe: p,
        decode: h,
        encode: l,
        toWords: n,
        fromWordsUnsafe: i,
        fromWords: s
      };
    }
    return gr.bech32 = u("bech32"), gr.bech32m = u("bech32m"), gr;
  }
  var me = Ac();
  const xa = q, Sc = new Uint8Array(0);
  function Vt(e, r) {
    if (!e.address && !e.hash && !e.output && !e.pubkey && !e.witness) throw new TypeError("Not enough data");
    r = Object.assign({
      validate: true
    }, r || {}), ee(lr(re({
      address: Pr(),
      hash: ne(20),
      input: ne(0),
      network: re({}),
      output: ne(22),
      pubkey: Le(Re, "Not a valid pubkey"),
      signature: Le(er),
      witness: ye($)
    })), e);
    const t = Te(() => {
      const n = me.bech32.decode(e.address), i = n.words.shift(), s = me.bech32.fromWords(n.words);
      return {
        version: i,
        prefix: n.prefix,
        data: Uint8Array.from(s)
      };
    }), o = e.network || $e, a = {
      name: "p2wpkh",
      network: o
    };
    if (P(a, "address", () => {
      if (!a.hash) return;
      const n = me.bech32.toWords(a.hash);
      return n.unshift(0), me.bech32.encode(o.bech32, n);
    }), P(a, "hash", () => {
      if (e.output) return e.output.slice(2, 22);
      if (e.address) return t().data;
      if (e.pubkey || a.pubkey) return Ze(e.pubkey || a.pubkey);
    }), P(a, "output", () => {
      if (a.hash) return ve([
        xa.OP_0,
        a.hash
      ]);
    }), P(a, "pubkey", () => {
      if (e.pubkey) return e.pubkey;
      if (e.witness) return e.witness[1];
    }), P(a, "signature", () => {
      if (e.witness) return e.witness[0];
    }), P(a, "input", () => {
      if (a.witness) return Sc;
    }), P(a, "witness", () => {
      if (e.pubkey && e.signature) return [
        e.signature,
        e.pubkey
      ];
    }), r.validate) {
      let n = Uint8Array.from([]);
      if (e.address) {
        if (o && o.bech32 !== t().prefix) throw new TypeError("Invalid prefix or Network mismatch");
        if (t().version !== 0) throw new TypeError("Invalid address version");
        if (t().data.length !== 20) throw new TypeError("Invalid address data");
        n = t().data;
      }
      if (e.hash) {
        if (n.length > 0 && U(n, e.hash) !== 0) throw new TypeError("Hash mismatch");
        n = e.hash;
      }
      if (e.output) {
        if (e.output.length !== 22 || e.output[0] !== xa.OP_0 || e.output[1] !== 20) throw new TypeError("Output is invalid");
        if (n.length > 0 && U(n, e.output.slice(2)) !== 0) throw new TypeError("Hash mismatch");
        n = e.output.slice(2);
      }
      if (e.pubkey) {
        const i = Ze(e.pubkey);
        if (n.length > 0 && U(n, i) !== 0) throw new TypeError("Hash mismatch");
        if (n = i, !Re(e.pubkey) || e.pubkey.length !== 33) throw new TypeError("Invalid pubkey for p2wpkh");
      }
      if (e.witness) {
        if (e.witness.length !== 2) throw new TypeError("Witness is invalid");
        if (!er(e.witness[0])) throw new TypeError("Witness has invalid signature");
        if (!Re(e.witness[1]) || e.witness[1].length !== 33) throw new TypeError("Witness has invalid pubkey");
        if (e.signature && U(e.signature, e.witness[0]) !== 0) throw new TypeError("Signature mismatch");
        if (e.pubkey && U(e.pubkey, e.witness[1]) !== 0) throw new TypeError("Pubkey mismatch");
        const i = Ze(e.witness[1]);
        if (n.length > 0 && U(n, i) !== 0) throw new TypeError("Hash mismatch");
      }
    }
    return Object.assign(a, e);
  }
  const Aa = q, so = new Uint8Array(0);
  function dt(e) {
    return !!(e instanceof Uint8Array && e.length === 65 && e[0] === 4 && Re(e));
  }
  function Zr(e, r) {
    if (!e.address && !e.hash && !e.output && !e.redeem && !e.witness) throw new TypeError("Not enough data");
    r = Object.assign({
      validate: true
    }, r || {}), ee(la({
      network: re({}),
      address: Pr(),
      hash: Ns,
      output: ne(34),
      redeem: la({
        input: $,
        network: re({}),
        output: $,
        witness: ye($)
      }),
      input: ne(0),
      witness: ye($)
    }), e);
    const t = Te(() => {
      const i = me.bech32.decode(e.address), s = i.words.shift(), u = me.bech32.fromWords(i.words);
      return {
        version: s,
        prefix: i.prefix,
        data: Uint8Array.from(u)
      };
    }), o = Te(() => J(e.redeem.input));
    let a = e.network;
    a || (a = e.redeem && e.redeem.network || $e);
    const n = {
      network: a
    };
    if (P(n, "address", () => {
      if (!n.hash) return;
      const i = me.bech32.toWords(n.hash);
      return i.unshift(0), me.bech32.encode(a.bech32, i);
    }), P(n, "hash", () => {
      if (e.output) return e.output.slice(2);
      if (e.address) return t().data;
      if (n.redeem && n.redeem.output) return ue(n.redeem.output);
    }), P(n, "output", () => {
      if (n.hash) return ve([
        Aa.OP_0,
        n.hash
      ]);
    }), P(n, "redeem", () => {
      if (e.witness) return {
        output: e.witness[e.witness.length - 1],
        input: so,
        witness: e.witness.slice(0, -1)
      };
    }), P(n, "input", () => {
      if (n.witness) return so;
    }), P(n, "witness", () => {
      if (e.redeem && e.redeem.input && e.redeem.input.length > 0 && e.redeem.output && e.redeem.output.length > 0) {
        const i = Ks(o());
        return n.redeem = Object.assign({
          witness: i
        }, e.redeem), n.redeem.input = so, [].concat(i, e.redeem.output);
      }
      if (e.redeem && e.redeem.output && e.redeem.witness) return [].concat(e.redeem.witness, e.redeem.output);
    }), P(n, "name", () => {
      const i = [
        "p2wsh"
      ];
      return n.redeem !== void 0 && n.redeem.name !== void 0 && i.push(n.redeem.name), i.join("-");
    }), r.validate) {
      let i = Uint8Array.from([]);
      if (e.address) {
        if (t().prefix !== a.bech32) throw new TypeError("Invalid prefix or Network mismatch");
        if (t().version !== 0) throw new TypeError("Invalid address version");
        if (t().data.length !== 32) throw new TypeError("Invalid address data");
        i = t().data;
      }
      if (e.hash) {
        if (i.length > 0 && U(i, e.hash) !== 0) throw new TypeError("Hash mismatch");
        i = e.hash;
      }
      if (e.output) {
        if (e.output.length !== 34 || e.output[0] !== Aa.OP_0 || e.output[1] !== 32) throw new TypeError("Output is invalid");
        const s = e.output.slice(2);
        if (i.length > 0 && U(i, s) !== 0) throw new TypeError("Hash mismatch");
        i = s;
      }
      if (e.redeem) {
        if (e.redeem.network && e.redeem.network !== a) throw new TypeError("Network mismatch");
        if (e.redeem.input && e.redeem.input.length > 0 && e.redeem.witness && e.redeem.witness.length > 0) throw new TypeError("Ambiguous witness source");
        if (e.redeem.output) {
          const s = J(e.redeem.output);
          if (!s || s.length < 1) throw new TypeError("Redeem.output is invalid");
          if (e.redeem.output.byteLength > 3600) throw new TypeError("Redeem.output unspendable if larger than 3600 bytes");
          if (Bn(s) > 201) throw new TypeError("Redeem.output unspendable with more than 201 non-push ops");
          const u = ue(e.redeem.output);
          if (i.length > 0 && U(i, u) !== 0) throw new TypeError("Hash mismatch");
          i = u;
        }
        if (e.redeem.input && !Fo(o())) throw new TypeError("Non push-only scriptSig");
        if (e.witness && e.redeem.witness && !$r(e.witness, e.redeem.witness)) throw new TypeError("Witness and redeem.witness mismatch");
        if (e.redeem.input && o().some(dt) || e.redeem.output && (J(e.redeem.output) || []).some(dt)) throw new TypeError("redeem.input or redeem.output contains uncompressed pubkey");
      }
      if (e.witness && e.witness.length > 0) {
        const s = e.witness[e.witness.length - 1];
        if (e.redeem && e.redeem.output && U(e.redeem.output, s) !== 0) throw new TypeError("Witness and redeem.output mismatch");
        if (e.witness.some(dt) || (J(s) || []).some(dt)) throw new TypeError("Witness contains uncompressed pubkey");
      }
    }
    return Object.assign(n, e);
  }
  const Sa = {};
  function Eo() {
    if (!Sa.eccLib) throw new Error("No ECC Library provided. You must call initEccLib() with a valid TinySecp256k1Interface instance");
    return Sa.eccLib;
  }
  const Yn = "0123456789abcdefABCDEF";
  Yn.split("").map((e) => e.codePointAt(0));
  const Ia = Array(256).fill(true).map((e, r) => {
    const t = String.fromCodePoint(r), o = Yn.indexOf(t);
    return o < 0 ? void 0 : o < 16 ? o : o - 6;
  }), Jn = new TextEncoder();
  new TextDecoder();
  function Ic(e) {
    return Jn.encode(e);
  }
  function Tc(e) {
    const r = e.reduce((a, n) => a + n.length, 0), t = new Uint8Array(r);
    let o = 0;
    for (const a of e) t.set(a, o), o += a.length;
    return t;
  }
  function zc(e) {
    const r = Jn.encode(e || ""), t = new Uint8Array(Math.floor(r.length / 2));
    let o;
    for (o = 0; o < t.length; o++) {
      const a = Ia[r[o * 2]], n = Ia[r[o * 2 + 1]];
      if (a === void 0 || n === void 0) break;
      t[o] = a << 4 | n;
    }
    return o === t.length ? t : t.slice(0, o);
  }
  function We(e, r) {
    const t = Math.min(e.length, r.length);
    for (let o = 0; o < t; ++o) if (e[o] !== r[o]) return e[o] < r[o] ? -1 : 1;
    return e.length === r.length ? 0 : e.length > r.length ? 1 : -1;
  }
  function Ta(e, r, t) {
    if (r + 1 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    if (t > 255) throw new Error(`The value of "value" is out of range. It must be >= 0 and <= 255. Received ${t}`);
    e[r] = t;
  }
  function Uc(e, r, t, o) {
    if (r + 2 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    if (o = o.toUpperCase(), t > 65535) throw new Error(`The value of "value" is out of range. It must be >= 0 and <= 65535. Received ${t}`);
    o === "LE" ? (e[r] = t & 255, e[r + 1] = t >> 8 & 255) : (e[r] = t >> 8 & 255, e[r + 1] = t & 255);
  }
  function br(e, r, t, o) {
    if (r + 4 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    if (o = o.toUpperCase(), t > 4294967295) throw new Error(`The value of "value" is out of range. It must be >= 0 and <= ${4294967295}. Received ${t}`);
    o === "LE" ? (e[r] = t & 255, e[r + 1] = t >> 8 & 255, e[r + 2] = t >> 16 & 255, e[r + 3] = t >> 24 & 255) : (e[r] = t >> 24 & 255, e[r + 1] = t >> 16 & 255, e[r + 2] = t >> 8 & 255, e[r + 3] = t & 255);
  }
  function Hc(e, r, t, o) {
    if (r + 8 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    if (o = o.toUpperCase(), t > 0xffffffffffffffffn) throw new Error(`The value of "value" is out of range. It must be >= 0 and <= ${0xffffffffffffffffn}. Received ${t}`);
    o === "LE" ? (e[r] = Number(t & 0xffn), e[r + 1] = Number(t >> 8n & 0xffn), e[r + 2] = Number(t >> 16n & 0xffn), e[r + 3] = Number(t >> 24n & 0xffn), e[r + 4] = Number(t >> 32n & 0xffn), e[r + 5] = Number(t >> 40n & 0xffn), e[r + 6] = Number(t >> 48n & 0xffn), e[r + 7] = Number(t >> 56n & 0xffn)) : (e[r] = Number(t >> 56n & 0xffn), e[r + 1] = Number(t >> 48n & 0xffn), e[r + 2] = Number(t >> 40n & 0xffn), e[r + 3] = Number(t >> 32n & 0xffn), e[r + 4] = Number(t >> 24n & 0xffn), e[r + 5] = Number(t >> 16n & 0xffn), e[r + 6] = Number(t >> 8n & 0xffn), e[r + 7] = Number(t & 0xffn));
  }
  function Pc(e, r, t) {
    if (r + 2 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    if (t = t.toUpperCase(), t === "LE") {
      let o = 0;
      return o = (o << 8) + e[r + 1], o = (o << 8) + e[r], o;
    } else {
      let o = 0;
      return o = (o << 8) + e[r], o = (o << 8) + e[r + 1], o;
    }
  }
  function Tr(e, r, t) {
    if (r + 4 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    if (t = t.toUpperCase(), t === "LE") {
      let o = 0;
      return o = (o << 8) + e[r + 3] >>> 0, o = (o << 8) + e[r + 2] >>> 0, o = (o << 8) + e[r + 1] >>> 0, o = (o << 8) + e[r] >>> 0, o;
    } else {
      let o = 0;
      return o = (o << 8) + e[r] >>> 0, o = (o << 8) + e[r + 1] >>> 0, o = (o << 8) + e[r + 2] >>> 0, o = (o << 8) + e[r + 3] >>> 0, o;
    }
  }
  function Nc(e, r, t) {
    if (r + 8 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    if (t = t.toUpperCase(), t === "LE") {
      let o = 0n;
      return o = (o << 8n) + BigInt(e[r + 7]), o = (o << 8n) + BigInt(e[r + 6]), o = (o << 8n) + BigInt(e[r + 5]), o = (o << 8n) + BigInt(e[r + 4]), o = (o << 8n) + BigInt(e[r + 3]), o = (o << 8n) + BigInt(e[r + 2]), o = (o << 8n) + BigInt(e[r + 1]), o = (o << 8n) + BigInt(e[r]), o;
    } else {
      let o = 0n;
      return o = (o << 8n) + BigInt(e[r]), o = (o << 8n) + BigInt(e[r + 1]), o = (o << 8n) + BigInt(e[r + 2]), o = (o << 8n) + BigInt(e[r + 3]), o = (o << 8n) + BigInt(e[r + 4]), o = (o << 8n) + BigInt(e[r + 5]), o = (o << 8n) + BigInt(e[r + 6]), o = (o << 8n) + BigInt(e[r + 7]), o;
    }
  }
  const Oc = (e) => {
    if (e < 0 || e > 0xffffffffffffffffn) throw new RangeError("value out of range");
  };
  function jc(e) {
    if (e < 0 || e > Number.MAX_SAFE_INTEGER || e % 1 !== 0) throw new RangeError("value out of range");
  }
  function Qn(e) {
    typeof e == "number" ? jc(e) : Oc(e);
  }
  function fr(e, r, t) {
    Qn(e), t === void 0 && (t = 0), r === void 0 && (r = new Uint8Array(Ue(e)));
    let o = 0;
    return e < 253 ? (r.set([
      Number(e)
    ], t), o = 1) : e <= 65535 ? (r.set([
      253
    ], t), Uc(r, t + 1, Number(e), "LE"), o = 3) : e <= 4294967295 ? (r.set([
      254
    ], t), br(r, t + 1, Number(e), "LE"), o = 5) : (r.set([
      255
    ], t), Hc(r, t + 1, BigInt(e), "LE"), o = 9), {
      buffer: r,
      bytes: o
    };
  }
  function Nr(e, r) {
    r === void 0 && (r = 0);
    const t = e.at(r);
    if (t === void 0) throw new Error("buffer too small");
    if (t < 253) return {
      numberValue: t,
      bigintValue: BigInt(t),
      bytes: 1
    };
    if (t === 253) {
      const o = Pc(e, r + 1, "LE");
      return {
        numberValue: o,
        bigintValue: BigInt(o),
        bytes: 3
      };
    } else if (t === 254) {
      const o = Tr(e, r + 1, "LE");
      return {
        numberValue: o,
        bigintValue: BigInt(o),
        bytes: 5
      };
    } else {
      const o = Nc(e, r + 1, "LE");
      return {
        numberValue: o <= Number.MAX_SAFE_INTEGER ? Number(o) : null,
        bigintValue: o,
        bytes: 9
      };
    }
  }
  function Ue(e) {
    return Qn(e), e < 253 ? 1 : e <= 65535 ? 3 : e <= 4294967295 ? 5 : 9;
  }
  const Cc = 9007199254740991;
  function Rc(e, r) {
    if (typeof e != "number" && typeof e != "bigint") throw new Error("cannot write a non-number as a number");
    if (e < 0 && e < BigInt(0)) throw new Error("specified a negative value for writing an unsigned value");
    if (e > r && e > BigInt(r)) throw new Error("RangeError: value out of range");
    if (Math.floor(Number(e)) !== Number(e)) throw new Error("value has a fractional component");
  }
  function qo(e) {
    if (e.length < 1) return e;
    let r = e.length - 1, t = 0;
    for (let o = 0; o < e.length / 2; o++) t = e[o], e[o] = e[r], e[r] = t, r--;
    return e;
  }
  function za(e) {
    const r = new Uint8Array(e.length);
    return r.set(e), r;
  }
  class pe {
    constructor(r, t = 0) {
      __publicField(this, "buffer");
      __publicField(this, "offset");
      this.buffer = r, this.offset = t, ee(Fe([
        $,
        Ye
      ]), [
        r,
        t
      ]);
    }
    static withCapacity(r) {
      return new pe(new Uint8Array(r));
    }
    writeUInt8(r) {
      this.offset = _e(this.buffer, this.offset, r);
    }
    writeInt32(r) {
      this.offset = An(this.buffer, this.offset, r, "LE");
    }
    writeInt64(r) {
      this.offset = bs(this.buffer, this.offset, BigInt(r), "LE");
    }
    writeUInt32(r) {
      this.offset = xn(this.buffer, this.offset, r, "LE");
    }
    writeUInt64(r) {
      this.offset = ms(this.buffer, this.offset, BigInt(r), "LE");
    }
    writeVarInt(r) {
      const { bytes: t } = fr(r, this.buffer, this.offset);
      this.offset += t;
    }
    writeSlice(r) {
      if (this.buffer.length < this.offset + r.length) throw new Error("Cannot write slice out of bounds");
      this.buffer.set(r, this.offset), this.offset += r.length;
    }
    writeVarSlice(r) {
      this.writeVarInt(r.length), this.writeSlice(r);
    }
    writeVector(r) {
      this.writeVarInt(r.length), r.forEach((t) => this.writeVarSlice(t));
    }
    end() {
      if (this.buffer.length === this.offset) return this.buffer;
      throw new Error(`buffer size ${this.buffer.length}, offset ${this.offset}`);
    }
  }
  class Lc {
    constructor(r, t = 0) {
      __publicField(this, "buffer");
      __publicField(this, "offset");
      this.buffer = r, this.offset = t, ee(Fe([
        $,
        Ye
      ]), [
        r,
        t
      ]);
    }
    readUInt8() {
      const r = ur(this.buffer, this.offset);
      return this.offset++, r;
    }
    readInt32() {
      const r = ys(this.buffer, this.offset, "LE");
      return this.offset += 4, r;
    }
    readUInt32() {
      const r = Ro(this.buffer, this.offset, "LE");
      return this.offset += 4, r;
    }
    readInt64() {
      const r = vs(this.buffer, this.offset, "LE");
      return this.offset += 8, r;
    }
    readVarInt() {
      const { bigintValue: r, bytes: t } = Nr(this.buffer, this.offset);
      return this.offset += t, r;
    }
    readSlice(r) {
      Rc(r, Cc);
      const t = Number(r);
      if (this.buffer.length < this.offset + t) throw new Error("Cannot read slice out of bounds");
      const o = this.buffer.slice(this.offset, this.offset + t);
      return this.offset += t, o;
    }
    readVarSlice() {
      return this.readSlice(this.readVarInt());
    }
    readVector() {
      const r = this.readVarInt(), t = [];
      for (let o = 0; o < r; o++) t.push(this.readVarSlice());
      return t;
    }
  }
  const Zn = 192, Bc = 128, Dc = (e) => "left" in e && "right" in e;
  function xo(e, r) {
    if (e.length < 33) throw new TypeError(`The control-block length is too small. Got ${e.length}, expected min 33.`);
    const t = (e.length - 33) / 32;
    let o = r;
    for (let a = 0; a < t; a++) {
      const n = e.slice(33 + 32 * a, 65 + 32 * a);
      U(o, n) < 0 ? o = So(o, n) : o = So(n, o);
    }
    return o;
  }
  function Ao(e) {
    if (Do(e)) return {
      hash: Qe(e)
    };
    const r = [
      Ao(e[0]),
      Ao(e[1])
    ];
    r.sort((a, n) => U(a.hash, n.hash));
    const [t, o] = r;
    return {
      hash: So(t.hash, o.hash),
      left: t,
      right: o
    };
  }
  function At(e, r) {
    if (Dc(e)) {
      const t = At(e.left, r);
      if (t !== void 0) return [
        ...t,
        e.right.hash
      ];
      const o = At(e.right, r);
      if (o !== void 0) return [
        ...o,
        e.left.hash
      ];
    } else if (U(e.hash, r) === 0) return [];
  }
  function Qe(e) {
    const r = e.version || Zn;
    return Kt("TapLeaf", Ee([
      Uint8Array.from([
        r
      ]),
      Kc(e.output)
    ]));
  }
  function Fc(e, r) {
    return Kt("TapTweak", Ee(r ? [
      e,
      r
    ] : [
      e
    ]));
  }
  function ft(e, r) {
    if (!(e instanceof Uint8Array) || e.length !== 32 || r && r.length !== 32) return null;
    const t = Fc(e, r), o = Eo().xOnlyPointAddTweak(e, t);
    return !o || o.xOnlyPubkey === null ? null : {
      parity: o.parity,
      x: Uint8Array.from(o.xOnlyPubkey)
    };
  }
  function So(e, r) {
    return Kt("TapBranch", Ee([
      e,
      r
    ]));
  }
  function Kc(e) {
    const r = Ue(e.length), t = new Uint8Array(r);
    return fr(e.length, t), Ee([
      t,
      e
    ]);
  }
  const Ua = q, Ha = 1, Vc = 80;
  function et(e, r) {
    if (!e.address && !e.output && !e.pubkey && !e.internalPubkey && !(e.witness && e.witness.length > 1)) throw new TypeError("Not enough data");
    r = Object.assign({
      validate: true
    }, r || {}), ee(lr(re({
      address: Pr(),
      input: ne(0),
      network: re({}),
      output: ne(34),
      internalPubkey: ne(32),
      hash: ne(32),
      pubkey: ne(32),
      signature: Bo([
        ne(64),
        ne(65)
      ]),
      witness: ye($),
      scriptTree: Le(jn, "Taptree is not of type isTaptree"),
      redeem: lr(re({
        output: $,
        redeemVersion: Ie(),
        witness: ye($)
      })),
      redeemVersion: Ie()
    })), e);
    const t = Te(() => ii(e.address)), o = Te(() => {
      if (!(!e.witness || !e.witness.length)) return e.witness.length >= 2 && e.witness[e.witness.length - 1][0] === Vc ? e.witness.slice(0, -1) : e.witness.slice();
    }), a = Te(() => {
      if (e.scriptTree) return Ao(e.scriptTree);
      if (e.hash) return {
        hash: e.hash
      };
    }), n = e.network || $e, i = {
      name: "p2tr",
      network: n
    };
    if (P(i, "address", () => {
      if (!i.pubkey) return;
      const s = me.bech32m.toWords(i.pubkey);
      return s.unshift(Ha), me.bech32m.encode(n.bech32, s);
    }), P(i, "hash", () => {
      const s = a();
      if (s) return s.hash;
      const u = o();
      if (u && u.length > 1) {
        const c = u[u.length - 1], d = c[0] & mt, l = u[u.length - 2], f = Qe({
          output: l,
          version: d
        });
        return xo(c, f);
      }
      return null;
    }), P(i, "output", () => {
      if (i.pubkey) return ve([
        Ua.OP_1,
        i.pubkey
      ]);
    }), P(i, "redeemVersion", () => e.redeemVersion ? e.redeemVersion : e.redeem && e.redeem.redeemVersion !== void 0 && e.redeem.redeemVersion !== null ? e.redeem.redeemVersion : Zn), P(i, "redeem", () => {
      const s = o();
      if (!(!s || s.length < 2)) return {
        output: s[s.length - 2],
        witness: s.slice(0, -2),
        redeemVersion: s[s.length - 1][0] & mt
      };
    }), P(i, "pubkey", () => {
      if (e.pubkey) return e.pubkey;
      if (e.output) return e.output.slice(2);
      if (e.address) return t().data;
      if (i.internalPubkey) {
        const s = ft(i.internalPubkey, i.hash);
        if (s) return s.x;
      }
    }), P(i, "internalPubkey", () => {
      if (e.internalPubkey) return e.internalPubkey;
      const s = o();
      if (s && s.length > 1) return s[s.length - 1].slice(1, 33);
    }), P(i, "signature", () => {
      if (e.signature) return e.signature;
      const s = o();
      if (!(!s || s.length !== 1)) return s[0];
    }), P(i, "witness", () => {
      if (e.witness) return e.witness;
      const s = a();
      if (s && e.redeem && e.redeem.output && e.internalPubkey) {
        const u = Qe({
          output: e.redeem.output,
          version: i.redeemVersion
        }), c = At(s, u);
        if (!c) return;
        const d = ft(e.internalPubkey, s.hash);
        if (!d) return;
        const l = Ee([
          Uint8Array.from([
            i.redeemVersion | d.parity
          ]),
          e.internalPubkey
        ].concat(c));
        return [
          e.redeem.output,
          l
        ];
      }
      if (e.signature) return [
        e.signature
      ];
    }), r.validate) {
      let s = Uint8Array.from([]);
      if (e.address) {
        if (n && n.bech32 !== t().prefix) throw new TypeError("Invalid prefix or Network mismatch");
        if (t().version !== Ha) throw new TypeError("Invalid address version");
        if (t().data.length !== 32) throw new TypeError("Invalid address data");
        s = t().data;
      }
      if (e.pubkey) {
        if (s.length > 0 && U(s, e.pubkey) !== 0) throw new TypeError("Pubkey mismatch");
        s = e.pubkey;
      }
      if (e.output) {
        if (e.output.length !== 34 || e.output[0] !== Ua.OP_1 || e.output[1] !== 32) throw new TypeError("Output is invalid");
        if (s.length > 0 && U(s, e.output.slice(2)) !== 0) throw new TypeError("Pubkey mismatch");
        s = e.output.slice(2);
      }
      if (e.internalPubkey) {
        const d = ft(e.internalPubkey, i.hash);
        if (s.length > 0 && U(s, d.x) !== 0) throw new TypeError("Pubkey mismatch");
        s = d.x;
      }
      if (s && s.length && !Eo().isXOnlyPoint(s)) throw new TypeError("Invalid pubkey for p2tr");
      const u = a();
      if (e.hash && u && U(e.hash, u.hash) !== 0) throw new TypeError("Hash mismatch");
      if (e.redeem && e.redeem.output && u) {
        const d = Qe({
          output: e.redeem.output,
          version: i.redeemVersion
        });
        if (!At(u, d)) throw new TypeError("Redeem script not in tree");
      }
      const c = o();
      if (e.redeem && i.redeem) {
        if (e.redeem.redeemVersion && e.redeem.redeemVersion !== i.redeem.redeemVersion) throw new TypeError("Redeem.redeemVersion and witness mismatch");
        if (e.redeem.output) {
          if (J(e.redeem.output).length === 0) throw new TypeError("Redeem.output is invalid");
          if (i.redeem.output && U(e.redeem.output, i.redeem.output) !== 0) throw new TypeError("Redeem.output and witness mismatch");
        }
        if (e.redeem.witness && i.redeem.witness && !$r(e.redeem.witness, i.redeem.witness)) throw new TypeError("Redeem.witness and witness mismatch");
      }
      if (c && c.length) if (c.length === 1) {
        if (e.signature && U(e.signature, c[0]) !== 0) throw new TypeError("Signature mismatch");
      } else {
        const d = c[c.length - 1];
        if (d.length < 33) throw new TypeError(`The control-block length is too small. Got ${d.length}, expected min 33.`);
        if ((d.length - 33) % 32 !== 0) throw new TypeError(`The control-block length of ${d.length} is incorrect!`);
        const l = (d.length - 33) / 32;
        if (l > 128) throw new TypeError(`The script path is too long. Got ${l}, expected max 128.`);
        const f = d.slice(1, 33);
        if (e.internalPubkey && U(e.internalPubkey, f) !== 0) throw new TypeError("Internal pubkey mismatch");
        if (!Eo().isXOnlyPoint(f)) throw new TypeError("Invalid internalPubkey for p2tr witness");
        const p = d[0] & mt, h = c[c.length - 2], m = Qe({
          output: h,
          version: p
        }), v = xo(d, m), E = ft(f, v);
        if (!E) throw new TypeError("Invalid outputKey for p2tr witness");
        if (s.length && U(s, E.x) !== 0) throw new TypeError("Pubkey mismatch for p2tr witness");
        if (E.parity !== (d[0] & 1)) throw new Error("Incorrect parity");
      }
    }
    return Object.assign(i, e);
  }
  const ei = 40, ri = 2, ti = 16, oi = 2, ai = 80, ni = "WARNING: Sending to a future segwit version address can lead to loss of funds. End users MUST be warned carefully in the GUI and asked if they wish to proceed with caution. Wallets should verify the segwit version from the output of fromBech32, then decide when it is safe to use which version of segwit.", St = [
    false,
    false
  ];
  function Mc(e, r) {
    const t = e.slice(2);
    if (t.length < ri || t.length > ei) throw new TypeError("Invalid program length for segwit address");
    const o = e[0] - ai;
    if (o < oi || o > ti) throw new TypeError("Invalid version for segwit address");
    if (e[1] !== t.length) throw new TypeError("Invalid script for segwit address");
    return St[0] === false && (console.warn(ni), St[0] = true), qc(t, o, r.bech32);
  }
  function $c(e) {
    const r = Ur.decode(e);
    if (r.length < 21) throw new TypeError(e + " is too short");
    if (r.length > 21) throw new TypeError(e + " is too long");
    const t = ur(r, 0), o = r.slice(1);
    return {
      version: t,
      hash: o
    };
  }
  function ii(e) {
    let r, t;
    try {
      r = me.bech32.decode(e);
    } catch {
    }
    if (r) {
      if (t = r.words[0], t !== 0) throw new TypeError(e + " uses wrong encoding");
    } else if (r = me.bech32m.decode(e), t = r.words[0], t === 0) throw new TypeError(e + " uses wrong encoding");
    const o = me.bech32.fromWords(r.words.slice(1));
    return {
      version: t,
      prefix: r.prefix,
      data: Uint8Array.from(o)
    };
  }
  function qc(e, r, t) {
    const o = me.bech32.toWords(e);
    return o.unshift(r), r === 0 ? me.bech32.encode(t, o) : me.bech32m.encode(t, o);
  }
  function Gc(e, r) {
    r = r || $e;
    try {
      return Jr({
        output: e,
        network: r
      }).address;
    } catch {
    }
    try {
      return Qr({
        output: e,
        network: r
      }).address;
    } catch {
    }
    try {
      return Vt({
        output: e,
        network: r
      }).address;
    } catch {
    }
    try {
      return Zr({
        output: e,
        network: r
      }).address;
    } catch {
    }
    try {
      return et({
        output: e,
        network: r
      }).address;
    } catch {
    }
    try {
      return Mc(e, r);
    } catch {
    }
    throw new Error(Fs(e) + " has no matching Address");
  }
  Wc = function(e, r) {
    r = r || $e;
    let t, o;
    try {
      t = $c(e);
    } catch {
    }
    if (t) {
      if (t.version === r.pubKeyHash) return Jr({
        hash: t.hash
      }).output;
      if (t.version === r.scriptHash) return Qr({
        hash: t.hash
      }).output;
    } else {
      try {
        o = ii(e);
      } catch {
      }
      if (o) {
        if (o.prefix !== r.bech32) throw new Error(e + " has an invalid prefix");
        if (o.version === 0) {
          if (o.data.length === 20) return Vt({
            hash: o.data
          }).output;
          if (o.data.length === 32) return Zr({
            hash: o.data
          }).output;
        } else if (o.version === 1) {
          if (o.data.length === 32) return et({
            pubkey: o.data
          }).output;
        } else if (o.version >= oi && o.version <= ti && o.data.length >= ri && o.data.length <= ei) return St[1] === false && (console.warn(ni), St[1] = true), ve([
          o.version + ai,
          o.data
        ]);
      }
    }
    throw new Error(e + " has no matching Script");
  };
  function De(e) {
    const r = e.length;
    return Ue(r) + r;
  }
  function Xc(e) {
    const r = e.length;
    return Ue(r) + e.reduce((t, o) => t + De(o), 0);
  }
  const cr = new Uint8Array(0), co = [], uo = kr("0000000000000000000000000000000000000000000000000000000000000000"), Pa = kr("0000000000000000000000000000000000000000000000000000000000000001"), Yc = kr("ffffffffffffffff"), Jc = {
    script: cr,
    valueBuffer: Yc
  };
  function Qc(e) {
    return e.value !== void 0;
  }
  const _O = class _O {
    constructor() {
      __publicField(this, "version", 1);
      __publicField(this, "locktime", 0);
      __publicField(this, "ins", []);
      __publicField(this, "outs", []);
    }
    static fromBuffer(r, t) {
      const o = new Lc(r), a = new _O();
      a.version = o.readUInt32();
      const n = o.readUInt8(), i = o.readUInt8();
      let s = false;
      n === _O.ADVANCED_TRANSACTION_MARKER && i === _O.ADVANCED_TRANSACTION_FLAG ? s = true : o.offset -= 2;
      const u = o.readVarInt();
      for (let d = 0; d < u; ++d) a.ins.push({
        hash: o.readSlice(32),
        index: o.readUInt32(),
        script: o.readVarSlice(),
        sequence: o.readUInt32(),
        witness: co
      });
      const c = o.readVarInt();
      for (let d = 0; d < c; ++d) a.outs.push({
        value: o.readInt64(),
        script: o.readVarSlice()
      });
      if (s) {
        for (let d = 0; d < u; ++d) a.ins[d].witness = o.readVector();
        if (!a.hasWitnesses()) throw new Error("Transaction has superfluous witness data");
      }
      if (a.locktime = o.readUInt32(), t) return a;
      if (o.offset !== r.length) throw new Error("Transaction has unexpected data");
      return a;
    }
    static fromHex(r) {
      return _O.fromBuffer(kr(r), false);
    }
    static isCoinbaseHash(r) {
      ee(ua, r);
      for (let t = 0; t < 32; ++t) if (r[t] !== 0) return false;
      return true;
    }
    isCoinbase() {
      return this.ins.length === 1 && _O.isCoinbaseHash(this.ins[0].hash);
    }
    addInput(r, t, o, a) {
      return ee(Fe([
        ua,
        Ye,
        _o(wt(Ye)),
        _o(wt($))
      ]), [
        r,
        t,
        o,
        a
      ]), o == null && (o = _O.DEFAULT_SEQUENCE), this.ins.push({
        hash: r,
        index: t,
        script: a || cr,
        sequence: o,
        witness: co
      }) - 1;
    }
    addOutput(r, t) {
      return ee(Fe([
        $,
        ao
      ]), [
        r,
        t
      ]), this.outs.push({
        script: r,
        value: t
      }) - 1;
    }
    hasWitnesses() {
      return this.ins.some((r) => r.witness.length !== 0);
    }
    stripWitnesses() {
      this.ins.forEach((r) => {
        r.witness = co;
      });
    }
    weight() {
      const r = this.byteLength(false), t = this.byteLength(true);
      return r * 3 + t;
    }
    virtualSize() {
      return Math.ceil(this.weight() / 4);
    }
    byteLength(r = true) {
      const t = r && this.hasWitnesses();
      return (t ? 10 : 8) + Ue(this.ins.length) + Ue(this.outs.length) + this.ins.reduce((o, a) => o + 40 + De(a.script), 0) + this.outs.reduce((o, a) => o + 8 + De(a.script), 0) + (t ? this.ins.reduce((o, a) => o + Xc(a.witness), 0) : 0);
    }
    clone() {
      const r = new _O();
      return r.version = this.version, r.locktime = this.locktime, r.ins = this.ins.map((t) => ({
        hash: t.hash,
        index: t.index,
        script: t.script,
        sequence: t.sequence,
        witness: t.witness
      })), r.outs = this.outs.map((t) => ({
        script: t.script,
        value: t.value
      })), r;
    }
    hashForSignature(r, t, o) {
      if (ee(Fe([
        Ye,
        $,
        Ie()
      ]), [
        r,
        t,
        o
      ]), r >= this.ins.length) return Pa;
      const a = ve(J(t).filter((s) => s !== q.OP_CODESEPARATOR)), n = this.clone();
      if ((o & 31) === _O.SIGHASH_NONE) n.outs = [], n.ins.forEach((s, u) => {
        u !== r && (s.sequence = 0);
      });
      else if ((o & 31) === _O.SIGHASH_SINGLE) {
        if (r >= this.outs.length) return Pa;
        n.outs.length = r + 1;
        for (let s = 0; s < r; s++) n.outs[s] = Jc;
        n.ins.forEach((s, u) => {
          u !== r && (s.sequence = 0);
        });
      }
      o & _O.SIGHASH_ANYONECANPAY ? (n.ins = [
        n.ins[r]
      ], n.ins[0].script = a) : (n.ins.forEach((s) => {
        s.script = cr;
      }), n.ins[r].script = a);
      const i = new Uint8Array(n.byteLength(false) + 4);
      return An(i, i.length - 4, o, "LE"), n.__toBuffer(i, 0, false), mr(i);
    }
    hashForWitnessV1(r, t, o, a, n, i) {
      if (ee(Fe([
        Ye,
        ye($),
        ye(ao),
        Ye
      ]), [
        r,
        t,
        o,
        a
      ]), o.length !== this.ins.length || t.length !== this.ins.length) throw new Error("Must supply prevout script and value for all inputs");
      const s = a === _O.SIGHASH_DEFAULT ? _O.SIGHASH_ALL : a & _O.SIGHASH_OUTPUT_MASK, c = (a & _O.SIGHASH_INPUT_MASK) === _O.SIGHASH_ANYONECANPAY, d = s === _O.SIGHASH_NONE, l = s === _O.SIGHASH_SINGLE;
      let f = cr, p = cr, h = cr, m = cr, v = cr;
      if (!c) {
        let k = pe.withCapacity(36 * this.ins.length);
        this.ins.forEach((_) => {
          k.writeSlice(_.hash), k.writeUInt32(_.index);
        }), f = ue(k.end()), k = pe.withCapacity(8 * this.ins.length), o.forEach((_) => k.writeInt64(_)), p = ue(k.end()), k = pe.withCapacity(t.map(De).reduce((_, S) => _ + S)), t.forEach((_) => k.writeVarSlice(_)), h = ue(k.end()), k = pe.withCapacity(4 * this.ins.length), this.ins.forEach((_) => k.writeUInt32(_.sequence)), m = ue(k.end());
      }
      if (d || l) {
        if (l && r < this.outs.length) {
          const k = this.outs[r], _ = pe.withCapacity(8 + De(k.script));
          _.writeInt64(k.value), _.writeVarSlice(k.script), v = ue(_.end());
        }
      } else {
        if (!this.outs.length) throw new Error("Add outputs to the transaction before signing.");
        const k = this.outs.map((S) => 8 + De(S.script)).reduce((S, j) => S + j), _ = pe.withCapacity(k);
        this.outs.forEach((S) => {
          _.writeInt64(S.value), _.writeVarSlice(S.script);
        }), v = ue(_.end());
      }
      const E = (n ? 2 : 0) + (i ? 1 : 0), A = 174 - (c ? 49 : 0) - (d ? 32 : 0) + (i ? 32 : 0) + (n ? 37 : 0), y = pe.withCapacity(A);
      if (y.writeUInt8(a), y.writeUInt32(this.version), y.writeUInt32(this.locktime), y.writeSlice(f), y.writeSlice(p), y.writeSlice(h), y.writeSlice(m), d || l || y.writeSlice(v), y.writeUInt8(E), c) {
        const k = this.ins[r];
        y.writeSlice(k.hash), y.writeUInt32(k.index), y.writeInt64(o[r]), y.writeVarSlice(t[r]), y.writeUInt32(k.sequence);
      } else y.writeUInt32(r);
      if (i) {
        const k = pe.withCapacity(De(i));
        k.writeVarSlice(i), y.writeSlice(ue(k.end()));
      }
      return l && y.writeSlice(v), n && (y.writeSlice(n), y.writeUInt8(0), y.writeUInt32(4294967295)), Kt("TapSighash", Ee([
        Uint8Array.from([
          0
        ]),
        y.end()
      ]));
    }
    hashForWitnessV0(r, t, o, a) {
      ee(Fe([
        Ye,
        $,
        ao,
        Ye
      ]), [
        r,
        t,
        o,
        a
      ]);
      let n = Uint8Array.from([]), i, s = uo, u = uo, c = uo;
      if (a & _O.SIGHASH_ANYONECANPAY || (n = new Uint8Array(36 * this.ins.length), i = new pe(n, 0), this.ins.forEach((l) => {
        i.writeSlice(l.hash), i.writeUInt32(l.index);
      }), u = mr(n)), !(a & _O.SIGHASH_ANYONECANPAY) && (a & 31) !== _O.SIGHASH_SINGLE && (a & 31) !== _O.SIGHASH_NONE && (n = new Uint8Array(4 * this.ins.length), i = new pe(n, 0), this.ins.forEach((l) => {
        i.writeUInt32(l.sequence);
      }), c = mr(n)), (a & 31) !== _O.SIGHASH_SINGLE && (a & 31) !== _O.SIGHASH_NONE) {
        const l = this.outs.reduce((f, p) => f + 8 + De(p.script), 0);
        n = new Uint8Array(l), i = new pe(n, 0), this.outs.forEach((f) => {
          i.writeInt64(f.value), i.writeVarSlice(f.script);
        }), s = mr(n);
      } else if ((a & 31) === _O.SIGHASH_SINGLE && r < this.outs.length) {
        const l = this.outs[r];
        n = new Uint8Array(8 + De(l.script)), i = new pe(n, 0), i.writeInt64(l.value), i.writeVarSlice(l.script), s = mr(n);
      }
      n = new Uint8Array(156 + De(t)), i = new pe(n, 0);
      const d = this.ins[r];
      return i.writeUInt32(this.version), i.writeSlice(u), i.writeSlice(c), i.writeSlice(d.hash), i.writeUInt32(d.index), i.writeVarSlice(t), i.writeInt64(o), i.writeUInt32(d.sequence), i.writeSlice(s), i.writeUInt32(this.locktime), i.writeUInt32(a), mr(n);
    }
    getHash(r) {
      return r && this.isCoinbase() ? new Uint8Array(32) : mr(this.__toBuffer(void 0, void 0, r));
    }
    getId() {
      return yr(qo(this.getHash(false)));
    }
    toBuffer(r, t) {
      return this.__toBuffer(r, t, true);
    }
    toHex() {
      return yr(this.toBuffer(void 0, void 0));
    }
    setInputScript(r, t) {
      ee(Fe([
        Ie(),
        $
      ]), [
        r,
        t
      ]), this.ins[r].script = t;
    }
    setWitness(r, t) {
      ee(Fe([
        Ie(),
        ye($)
      ]), [
        r,
        t
      ]), this.ins[r].witness = t;
    }
    __toBuffer(r, t, o = false) {
      r || (r = new Uint8Array(this.byteLength(o)));
      const a = new pe(r, t || 0);
      a.writeUInt32(this.version);
      const n = o && this.hasWitnesses();
      return n && (a.writeUInt8(_O.ADVANCED_TRANSACTION_MARKER), a.writeUInt8(_O.ADVANCED_TRANSACTION_FLAG)), a.writeVarInt(this.ins.length), this.ins.forEach((i) => {
        a.writeSlice(i.hash), a.writeUInt32(i.index), a.writeVarSlice(i.script), a.writeUInt32(i.sequence);
      }), a.writeVarInt(this.outs.length), this.outs.forEach((i) => {
        Qc(i) ? a.writeInt64(i.value) : a.writeSlice(i.valueBuffer), a.writeVarSlice(i.script);
      }), n && this.ins.forEach((i) => {
        a.writeVector(i.witness);
      }), a.writeUInt32(this.locktime), t !== void 0 ? r.slice(t, a.offset) : r;
    }
  };
  __publicField(_O, "DEFAULT_SEQUENCE", 4294967295);
  __publicField(_O, "SIGHASH_DEFAULT", 0);
  __publicField(_O, "SIGHASH_ALL", 1);
  __publicField(_O, "SIGHASH_NONE", 2);
  __publicField(_O, "SIGHASH_SINGLE", 3);
  __publicField(_O, "SIGHASH_ANYONECANPAY", 128);
  __publicField(_O, "SIGHASH_OUTPUT_MASK", 3);
  __publicField(_O, "SIGHASH_INPUT_MASK", 128);
  __publicField(_O, "ADVANCED_TRANSACTION_MARKER", 0);
  __publicField(_O, "ADVANCED_TRANSACTION_FLAG", 1);
  let O = _O;
  var Ke;
  (function(e) {
    e[e.UNSIGNED_TX = 0] = "UNSIGNED_TX", e[e.GLOBAL_XPUB = 1] = "GLOBAL_XPUB";
  })(Ke || (Ke = {}));
  var z;
  (function(e) {
    e[e.NON_WITNESS_UTXO = 0] = "NON_WITNESS_UTXO", e[e.WITNESS_UTXO = 1] = "WITNESS_UTXO", e[e.PARTIAL_SIG = 2] = "PARTIAL_SIG", e[e.SIGHASH_TYPE = 3] = "SIGHASH_TYPE", e[e.REDEEM_SCRIPT = 4] = "REDEEM_SCRIPT", e[e.WITNESS_SCRIPT = 5] = "WITNESS_SCRIPT", e[e.BIP32_DERIVATION = 6] = "BIP32_DERIVATION", e[e.FINAL_SCRIPTSIG = 7] = "FINAL_SCRIPTSIG", e[e.FINAL_SCRIPTWITNESS = 8] = "FINAL_SCRIPTWITNESS", e[e.POR_COMMITMENT = 9] = "POR_COMMITMENT", e[e.TAP_KEY_SIG = 19] = "TAP_KEY_SIG", e[e.TAP_SCRIPT_SIG = 20] = "TAP_SCRIPT_SIG", e[e.TAP_LEAF_SCRIPT = 21] = "TAP_LEAF_SCRIPT", e[e.TAP_BIP32_DERIVATION = 22] = "TAP_BIP32_DERIVATION", e[e.TAP_INTERNAL_KEY = 23] = "TAP_INTERNAL_KEY", e[e.TAP_MERKLE_ROOT = 24] = "TAP_MERKLE_ROOT";
  })(z || (z = {}));
  var Z;
  (function(e) {
    e[e.REDEEM_SCRIPT = 0] = "REDEEM_SCRIPT", e[e.WITNESS_SCRIPT = 1] = "WITNESS_SCRIPT", e[e.BIP32_DERIVATION = 2] = "BIP32_DERIVATION", e[e.TAP_INTERNAL_KEY = 5] = "TAP_INTERNAL_KEY", e[e.TAP_TREE = 6] = "TAP_TREE", e[e.TAP_BIP32_DERIVATION = 7] = "TAP_BIP32_DERIVATION";
  })(Z || (Z = {}));
  const It = "0123456789abcdefABCDEF", Tt = It.split("").map((e) => e.codePointAt(0)), zt = Array(256).fill(true).map((e, r) => {
    const t = String.fromCodePoint(r), o = It.indexOf(t);
    return o < 0 ? void 0 : o < 16 ? o : o - 6;
  }), si = new TextEncoder(), ci = new TextDecoder();
  function Zc(e) {
    return ci.decode(e);
  }
  function eu(e) {
    return si.encode(e);
  }
  function Ve(e) {
    const r = e.reduce((a, n) => a + n.length, 0), t = new Uint8Array(r);
    let o = 0;
    for (const a of e) t.set(a, o), o += a.length;
    return t;
  }
  function B(e) {
    const r = e || new Uint8Array();
    return r.length > 512 ? tu(r) : ru(r);
  }
  function ru(e) {
    let r = "";
    for (let t = 0; t < e.length; ++t) r += It[zt[Tt[e[t] >> 4]]], r += It[zt[Tt[e[t] & 15]]];
    return r;
  }
  function tu(e) {
    const r = new Uint8Array(e.length * 2);
    for (let t = 0; t < e.length; ++t) r[t * 2] = Tt[e[t] >> 4], r[t * 2 + 1] = Tt[e[t] & 15];
    return ci.decode(r);
  }
  function ou(e) {
    const r = si.encode(e || ""), t = new Uint8Array(Math.floor(r.length / 2));
    let o;
    for (o = 0; o < t.length; o++) {
      const a = zt[r[o * 2]], n = zt[r[o * 2 + 1]];
      if (a === void 0 || n === void 0) break;
      t[o] = a << 4 | n;
    }
    return o === t.length ? t : t.slice(0, o);
  }
  function au(e) {
    return btoa(String.fromCharCode(...e));
  }
  function nu(e) {
    const r = atob(e), t = new Uint8Array(r.length);
    for (let o = 0; o < r.length; o++) t[o] = r.charCodeAt(o);
    return t;
  }
  function Me(e, r) {
    const t = Math.min(e.length, r.length);
    for (let o = 0; o < t; ++o) if (e[o] !== r[o]) return e[o] < r[o] ? -1 : 1;
    return e.length === r.length ? 0 : e.length > r.length ? 1 : -1;
  }
  function Go(e, r, t, o) {
    if (r + 4 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    if (o = o.toUpperCase(), t > 4294967295) throw new Error(`The value of "value" is out of range. It must be >= 0 and <= ${4294967295}. Received ${t}`);
    return o === "LE" ? (e[r] = t & 255, e[r + 1] = t >> 8 & 255, e[r + 2] = t >> 16 & 255, e[r + 3] = t >> 24 & 255) : (e[r] = t >> 24 & 255, e[r + 1] = t >> 16 & 255, e[r + 2] = t >> 8 & 255, e[r + 3] = t & 255), r + 4;
  }
  function Na(e, r) {
    if (r + 1 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    return e[r];
  }
  function Mt(e, r, t) {
    if (r + 4 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    if (t = t.toUpperCase(), t === "LE") {
      let o = 0;
      return o = (o << 8) + e[r + 3] >>> 0, o = (o << 8) + e[r + 2] >>> 0, o = (o << 8) + e[r + 1] >>> 0, o = (o << 8) + e[r] >>> 0, o;
    } else {
      let o = 0;
      return o = (o << 8) + e[r] >>> 0, o = (o << 8) + e[r + 1] >>> 0, o = (o << 8) + e[r + 2] >>> 0, o = (o << 8) + e[r + 3] >>> 0, o;
    }
  }
  function iu(e, r, t, o) {
    if (r + 8 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    if (t > 0x7fffffffffffffffn || t < -0x8000000000000000n) throw new Error(`The value of "value" is out of range. It must be >= ${-0x8000000000000000n} and <= ${0x7fffffffffffffffn}. Received ${t}`);
    return o = o.toUpperCase(), o === "LE" ? (e[r] = Number(t & 0xffn), e[r + 1] = Number(t >> 8n & 0xffn), e[r + 2] = Number(t >> 16n & 0xffn), e[r + 3] = Number(t >> 24n & 0xffn), e[r + 4] = Number(t >> 32n & 0xffn), e[r + 5] = Number(t >> 40n & 0xffn), e[r + 6] = Number(t >> 48n & 0xffn), e[r + 7] = Number(t >> 56n & 0xffn)) : (e[r] = Number(t >> 56n & 0xffn), e[r + 1] = Number(t >> 48n & 0xffn), e[r + 2] = Number(t >> 40n & 0xffn), e[r + 3] = Number(t >> 32n & 0xffn), e[r + 4] = Number(t >> 24n & 0xffn), e[r + 5] = Number(t >> 16n & 0xffn), e[r + 6] = Number(t >> 8n & 0xffn), e[r + 7] = Number(t & 0xffn)), r + 8;
  }
  function su(e, r, t) {
    if (r + 8 > e.length) throw new Error("Offset is outside the bounds of Uint8Array");
    t = t.toUpperCase();
    let o = 0n;
    if (t === "LE") return o = (o << 8n) + BigInt(e[r + 7]), o = (o << 8n) + BigInt(e[r + 6]), o = (o << 8n) + BigInt(e[r + 5]), o = (o << 8n) + BigInt(e[r + 4]), o = (o << 8n) + BigInt(e[r + 3]), o = (o << 8n) + BigInt(e[r + 2]), o = (o << 8n) + BigInt(e[r + 1]), o = (o << 8n) + BigInt(e[r]), e[r + 7] <= 127 ? o : o - 0x10000000000000000n;
    {
      let a = 0n;
      return a = (a << 8n) + BigInt(e[r]), a = (a << 8n) + BigInt(e[r + 1]), a = (a << 8n) + BigInt(e[r + 2]), a = (a << 8n) + BigInt(e[r + 3]), a = (a << 8n) + BigInt(e[r + 4]), a = (a << 8n) + BigInt(e[r + 5]), a = (a << 8n) + BigInt(e[r + 6]), a = (a << 8n) + BigInt(e[r + 7]), e[r] <= 127 ? a : a - 0x10000000000000000n;
    }
  }
  const cu = (e) => [
    ...Array(e).keys()
  ];
  function uu(e) {
    if (e.key[0] !== Ke.GLOBAL_XPUB) throw new Error("Decode Error: could not decode globalXpub with key 0x" + B(e.key));
    if (e.key.length !== 79 || ![
      2,
      3
    ].includes(e.key[46])) throw new Error("Decode Error: globalXpub has invalid extended pubkey in key 0x" + B(e.key));
    if (e.value.length / 4 % 1 !== 0) throw new Error("Decode Error: Global GLOBAL_XPUB value length should be multiple of 4");
    const r = e.key.slice(1), t = {
      masterFingerprint: e.value.slice(0, 4),
      extendedPubkey: r,
      path: "m"
    };
    for (const o of cu(e.value.length / 4 - 1)) {
      const a = Mt(e.value, o * 4 + 4, "LE"), n = !!(a & 2147483648), i = a & 2147483647;
      t.path += "/" + i.toString(10) + (n ? "'" : "");
    }
    return t;
  }
  function lu(e) {
    const r = new Uint8Array([
      Ke.GLOBAL_XPUB
    ]), t = Ve([
      r,
      e.extendedPubkey
    ]), o = e.path.split("/"), a = new Uint8Array(o.length * 4);
    a.set(e.masterFingerprint, 0);
    let n = 4;
    return o.slice(1).forEach((i) => {
      const s = i.slice(-1) === "'";
      let u = 2147483647 & parseInt(s ? i.slice(0, -1) : i, 10);
      s && (u += 2147483648), Go(a, n, u, "LE"), n += 4;
    }), {
      key: t,
      value: a
    };
  }
  const du = "{ masterFingerprint: Uint8Array; extendedPubkey: Uint8Array; path: string; }";
  function fu(e) {
    const r = e.extendedPubkey, t = e.masterFingerprint, o = e.path;
    return r instanceof Uint8Array && r.length === 78 && [
      2,
      3
    ].indexOf(r[45]) > -1 && t instanceof Uint8Array && t.length === 4 && typeof o == "string" && !!o.match(/^m(\/\d+'?)*$/);
  }
  function hu(e, r, t) {
    const o = B(r.extendedPubkey);
    return t.has(o) ? false : (t.add(o), e.filter((a) => Me(a.extendedPubkey, r.extendedPubkey)).length === 0);
  }
  const pu = Object.freeze(Object.defineProperty({
    __proto__: null,
    canAddToArray: hu,
    check: fu,
    decode: uu,
    encode: lu,
    expected: du
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function mu(e) {
    return {
      key: new Uint8Array([
        Ke.UNSIGNED_TX
      ]),
      value: e.toBuffer()
    };
  }
  const gu = Object.freeze(Object.defineProperty({
    __proto__: null,
    encode: mu
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function bu(e) {
    if (e.key[0] !== z.FINAL_SCRIPTSIG) throw new Error("Decode Error: could not decode finalScriptSig with key 0x" + B(e.key));
    return e.value;
  }
  function yu(e) {
    return {
      key: new Uint8Array([
        z.FINAL_SCRIPTSIG
      ]),
      value: e
    };
  }
  const vu = "Uint8Array";
  function wu(e) {
    return e instanceof Uint8Array;
  }
  function ku(e, r) {
    return !!e && !!r && e.finalScriptSig === void 0;
  }
  const _u = Object.freeze(Object.defineProperty({
    __proto__: null,
    canAdd: ku,
    check: wu,
    decode: bu,
    encode: yu,
    expected: vu
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function Eu(e) {
    if (e.key[0] !== z.FINAL_SCRIPTWITNESS) throw new Error("Decode Error: could not decode finalScriptWitness with key 0x" + B(e.key));
    return e.value;
  }
  function xu(e) {
    return {
      key: new Uint8Array([
        z.FINAL_SCRIPTWITNESS
      ]),
      value: e
    };
  }
  const Au = "Uint8Array";
  function Su(e) {
    return e instanceof Uint8Array;
  }
  function Iu(e, r) {
    return !!e && !!r && e.finalScriptWitness === void 0;
  }
  const Tu = Object.freeze(Object.defineProperty({
    __proto__: null,
    canAdd: Iu,
    check: Su,
    decode: Eu,
    encode: xu,
    expected: Au
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function zu(e) {
    if (e.key[0] !== z.NON_WITNESS_UTXO) throw new Error("Decode Error: could not decode nonWitnessUtxo with key 0x" + B(e.key));
    return e.value;
  }
  function Uu(e) {
    return {
      key: new Uint8Array([
        z.NON_WITNESS_UTXO
      ]),
      value: e
    };
  }
  const Hu = "Uint8Array";
  function Pu(e) {
    return e instanceof Uint8Array;
  }
  function Nu(e, r) {
    return !!e && !!r && e.nonWitnessUtxo === void 0;
  }
  const Ou = Object.freeze(Object.defineProperty({
    __proto__: null,
    canAdd: Nu,
    check: Pu,
    decode: zu,
    encode: Uu,
    expected: Hu
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function ju(e) {
    if (e.key[0] !== z.PARTIAL_SIG) throw new Error("Decode Error: could not decode partialSig with key 0x" + B(e.key));
    if (!(e.key.length === 34 || e.key.length === 66) || ![
      2,
      3,
      4
    ].includes(e.key[1])) throw new Error("Decode Error: partialSig has invalid pubkey in key 0x" + B(e.key));
    return {
      pubkey: e.key.slice(1),
      signature: e.value
    };
  }
  function Cu(e) {
    const r = new Uint8Array([
      z.PARTIAL_SIG
    ]);
    return {
      key: Ve([
        r,
        e.pubkey
      ]),
      value: e.signature
    };
  }
  const Ru = "{ pubkey: Uint8Array; signature: Uint8Array; }";
  function Lu(e) {
    return e.pubkey instanceof Uint8Array && e.signature instanceof Uint8Array && [
      33,
      65
    ].includes(e.pubkey.length) && [
      2,
      3,
      4
    ].includes(e.pubkey[0]) && Bu(e.signature);
  }
  function Bu(e) {
    if (!(e instanceof Uint8Array) || e.length < 9 || e[0] !== 48 || e.length !== e[1] + 3 || e[2] !== 2) return false;
    const r = e[3];
    if (r > 33 || r < 1 || e[3 + r + 1] !== 2) return false;
    const t = e[3 + r + 2];
    return !(t > 33 || t < 1 || e.length !== 3 + r + 2 + t + 2);
  }
  function Du(e, r, t) {
    const o = B(r.pubkey);
    return t.has(o) ? false : (t.add(o), e.filter((a) => Me(a.pubkey, r.pubkey) === 0).length === 0);
  }
  const Fu = Object.freeze(Object.defineProperty({
    __proto__: null,
    canAddToArray: Du,
    check: Lu,
    decode: ju,
    encode: Cu,
    expected: Ru
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function Ku(e) {
    if (e.key[0] !== z.POR_COMMITMENT) throw new Error("Decode Error: could not decode porCommitment with key 0x" + B(e.key));
    return Zc(e.value);
  }
  function Vu(e) {
    return {
      key: new Uint8Array([
        z.POR_COMMITMENT
      ]),
      value: eu(e)
    };
  }
  const Mu = "string";
  function $u(e) {
    return typeof e == "string";
  }
  function qu(e, r) {
    return !!e && !!r && e.porCommitment === void 0;
  }
  const Gu = Object.freeze(Object.defineProperty({
    __proto__: null,
    canAdd: qu,
    check: $u,
    decode: Ku,
    encode: Vu,
    expected: Mu
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function Wu(e) {
    if (e.key[0] !== z.SIGHASH_TYPE) throw new Error("Decode Error: could not decode sighashType with key 0x" + B(e.key));
    return Number(Mt(e.value, 0, "LE"));
  }
  function Xu(e) {
    const r = Uint8Array.from([
      z.SIGHASH_TYPE
    ]), t = new Uint8Array(4);
    return Go(t, 0, e, "LE"), {
      key: r,
      value: t
    };
  }
  const Yu = "number";
  function Ju(e) {
    return typeof e == "number";
  }
  function Qu(e, r) {
    return !!e && !!r && e.sighashType === void 0;
  }
  const Zu = Object.freeze(Object.defineProperty({
    __proto__: null,
    canAdd: Qu,
    check: Ju,
    decode: Wu,
    encode: Xu,
    expected: Yu
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function el(e) {
    if (e.key[0] !== z.TAP_KEY_SIG || e.key.length !== 1) throw new Error("Decode Error: could not decode tapKeySig with key 0x" + B(e.key));
    if (!ui(e.value)) throw new Error("Decode Error: tapKeySig not a valid 64-65-byte BIP340 signature");
    return e.value;
  }
  function rl(e) {
    return {
      key: Uint8Array.from([
        z.TAP_KEY_SIG
      ]),
      value: e
    };
  }
  const tl = "Uint8Array";
  function ui(e) {
    return e instanceof Uint8Array && (e.length === 64 || e.length === 65);
  }
  function ol(e, r) {
    return !!e && !!r && e.tapKeySig === void 0;
  }
  const al = Object.freeze(Object.defineProperty({
    __proto__: null,
    canAdd: ol,
    check: ui,
    decode: el,
    encode: rl,
    expected: tl
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function nl(e) {
    if (e.key[0] !== z.TAP_LEAF_SCRIPT) throw new Error("Decode Error: could not decode tapLeafScript with key 0x" + B(e.key));
    if ((e.key.length - 2) % 32 !== 0) throw new Error("Decode Error: tapLeafScript has invalid control block in key 0x" + B(e.key));
    const r = e.value[e.value.length - 1];
    if ((e.key[1] & 254) !== r) throw new Error("Decode Error: tapLeafScript bad leaf version in key 0x" + B(e.key));
    const t = e.value.slice(0, -1);
    return {
      controlBlock: e.key.slice(1),
      script: t,
      leafVersion: r
    };
  }
  function il(e) {
    const r = Uint8Array.from([
      z.TAP_LEAF_SCRIPT
    ]), t = Uint8Array.from([
      e.leafVersion
    ]);
    return {
      key: Ve([
        r,
        e.controlBlock
      ]),
      value: Ve([
        e.script,
        t
      ])
    };
  }
  const sl = "{ controlBlock: Uint8Array; leafVersion: number, script: Uint8Array; }";
  function cl(e) {
    return e.controlBlock instanceof Uint8Array && (e.controlBlock.length - 1) % 32 === 0 && (e.controlBlock[0] & 254) === e.leafVersion && e.script instanceof Uint8Array;
  }
  function ul(e, r, t) {
    const o = B(r.controlBlock);
    return t.has(o) ? false : (t.add(o), e.filter((a) => Me(a.controlBlock, r.controlBlock) === 0).length === 0);
  }
  const ll = Object.freeze(Object.defineProperty({
    __proto__: null,
    canAddToArray: ul,
    check: cl,
    decode: nl,
    encode: il,
    expected: sl
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function dl(e) {
    if (e.key[0] !== z.TAP_MERKLE_ROOT || e.key.length !== 1) throw new Error("Decode Error: could not decode tapMerkleRoot with key 0x" + B(e.key));
    if (!li(e.value)) throw new Error("Decode Error: tapMerkleRoot not a 32-byte hash");
    return e.value;
  }
  function fl(e) {
    return {
      key: Uint8Array.from([
        z.TAP_MERKLE_ROOT
      ]),
      value: e
    };
  }
  const hl = "Uint8Array";
  function li(e) {
    return e instanceof Uint8Array && e.length === 32;
  }
  function pl(e, r) {
    return !!e && !!r && e.tapMerkleRoot === void 0;
  }
  const ml = Object.freeze(Object.defineProperty({
    __proto__: null,
    canAdd: pl,
    check: li,
    decode: dl,
    encode: fl,
    expected: hl
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function gl(e) {
    if (e.key[0] !== z.TAP_SCRIPT_SIG) throw new Error("Decode Error: could not decode tapScriptSig with key 0x" + B(e.key));
    if (e.key.length !== 65) throw new Error("Decode Error: tapScriptSig has invalid key 0x" + B(e.key));
    if (e.value.length !== 64 && e.value.length !== 65) throw new Error("Decode Error: tapScriptSig has invalid signature in key 0x" + B(e.key));
    const r = e.key.slice(1, 33), t = e.key.slice(33);
    return {
      pubkey: r,
      leafHash: t,
      signature: e.value
    };
  }
  function bl(e) {
    const r = Uint8Array.from([
      z.TAP_SCRIPT_SIG
    ]);
    return {
      key: Ve([
        r,
        e.pubkey,
        e.leafHash
      ]),
      value: e.signature
    };
  }
  const yl = "{ pubkey: Uint8Array; leafHash: Uint8Array; signature: Uint8Array; }";
  function vl(e) {
    return e.pubkey instanceof Uint8Array && e.leafHash instanceof Uint8Array && e.signature instanceof Uint8Array && e.pubkey.length === 32 && e.leafHash.length === 32 && (e.signature.length === 64 || e.signature.length === 65);
  }
  function wl(e, r, t) {
    const o = B(r.pubkey) + B(r.leafHash);
    return t.has(o) ? false : (t.add(o), e.filter((a) => Me(a.pubkey, r.pubkey) === 0 && Me(a.leafHash, r.leafHash) === 0).length === 0);
  }
  const kl = Object.freeze(Object.defineProperty({
    __proto__: null,
    canAddToArray: wl,
    check: vl,
    decode: gl,
    encode: bl,
    expected: yl
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function _l(e) {
    if (e.key[0] !== z.WITNESS_UTXO) throw new Error("Decode Error: could not decode witnessUtxo with key 0x" + B(e.key));
    const r = su(e.value, 0, "LE");
    let t = 8;
    const { numberValue: o, bytes: a } = Nr(e.value, t);
    t += a;
    const n = e.value.slice(t);
    if (n.length !== o) throw new Error("Decode Error: WITNESS_UTXO script is not proper length");
    return {
      script: n,
      value: r
    };
  }
  function El(e) {
    const { script: r, value: t } = e, o = Ue(r.length), a = new Uint8Array(8 + o + r.length);
    return iu(a, 0, BigInt(t), "LE"), fr(r.length, a, 8), a.set(r, 8 + o), {
      key: Uint8Array.from([
        z.WITNESS_UTXO
      ]),
      value: a
    };
  }
  const xl = "{ script: Uint8Array; value: bigint; }";
  function Al(e) {
    return e.script instanceof Uint8Array && typeof e.value == "bigint";
  }
  function Sl(e, r) {
    return !!e && !!r && e.witnessUtxo === void 0;
  }
  const Il = Object.freeze(Object.defineProperty({
    __proto__: null,
    canAdd: Sl,
    check: Al,
    decode: _l,
    encode: El,
    expected: xl
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  function Tl(e) {
    if (e.key[0] !== Z.TAP_TREE || e.key.length !== 1) throw new Error("Decode Error: could not decode tapTree with key 0x" + B(e.key));
    let r = 0;
    const t = [];
    for (; r < e.value.length; ) {
      const o = e.value[r++], a = e.value[r++], { numberValue: n, bytes: i } = Nr(e.value, r);
      r += i, t.push({
        depth: o,
        leafVersion: a,
        script: e.value.slice(r, r + n)
      }), r += n;
    }
    return {
      leaves: t
    };
  }
  function zl(e) {
    const r = Uint8Array.from([
      Z.TAP_TREE
    ]), t = [].concat(...e.leaves.map((o) => [
      Uint8Array.of(o.depth, o.leafVersion),
      fr(BigInt(o.script.length)).buffer,
      o.script
    ]));
    return {
      key: r,
      value: Ve(t)
    };
  }
  const Ul = "{ leaves: [{ depth: number; leafVersion: number, script: Uint8Array; }] }";
  function Hl(e) {
    return Array.isArray(e.leaves) && e.leaves.every((r) => r.depth >= 0 && r.depth <= 128 && (r.leafVersion & 254) === r.leafVersion && r.script instanceof Uint8Array);
  }
  function Pl(e, r) {
    return !!e && !!r && e.tapTree === void 0;
  }
  const Nl = Object.freeze(Object.defineProperty({
    __proto__: null,
    canAdd: Pl,
    check: Hl,
    decode: Tl,
    encode: zl,
    expected: Ul
  }, Symbol.toStringTag, {
    value: "Module"
  })), Ol = (e) => [
    ...Array(e).keys()
  ], jl = (e) => e.length === 33 && [
    2,
    3
  ].includes(e[0]) || e.length === 65 && e[0] === 4;
  function Wo(e, r = jl) {
    function t(s) {
      if (s.key[0] !== e) throw new Error("Decode Error: could not decode bip32Derivation with key 0x" + B(s.key));
      const u = s.key.slice(1);
      if (!r(u)) throw new Error("Decode Error: bip32Derivation has invalid pubkey in key 0x" + B(s.key));
      if (s.value.length / 4 % 1 !== 0) throw new Error("Decode Error: Input BIP32_DERIVATION value length should be multiple of 4");
      const c = {
        masterFingerprint: s.value.slice(0, 4),
        pubkey: u,
        path: "m"
      };
      for (const d of Ol(s.value.length / 4 - 1)) {
        const l = Mt(s.value, d * 4 + 4, "LE"), f = !!(l & 2147483648), p = l & 2147483647;
        c.path += "/" + p.toString(10) + (f ? "'" : "");
      }
      return c;
    }
    function o(s) {
      const u = Uint8Array.from([
        e
      ]), c = Ve([
        u,
        s.pubkey
      ]), d = s.path.split("/"), l = new Uint8Array(d.length * 4);
      l.set(s.masterFingerprint, 0);
      let f = 4;
      return d.slice(1).forEach((p) => {
        const h = p.slice(-1) === "'";
        let m = 2147483647 & parseInt(h ? p.slice(0, -1) : p, 10);
        h && (m += 2147483648), Go(l, f, m, "LE"), f += 4;
      }), {
        key: c,
        value: l
      };
    }
    const a = "{ masterFingerprint: Uint8Array; pubkey: Uint8Array; path: string; }";
    function n(s) {
      return s.pubkey instanceof Uint8Array && s.masterFingerprint instanceof Uint8Array && typeof s.path == "string" && r(s.pubkey) && s.masterFingerprint.length === 4;
    }
    function i(s, u, c) {
      const d = B(u.pubkey);
      return c.has(d) ? false : (c.add(d), s.filter((l) => Me(l.pubkey, u.pubkey) === 0).length === 0);
    }
    return {
      decode: t,
      encode: o,
      check: n,
      expected: a,
      canAddToArray: i
    };
  }
  function Xo(e) {
    return r;
    function r(t) {
      let o;
      if (e.includes(t.key[0]) && (o = t.key.slice(1), !(o.length === 33 || o.length === 65) || ![
        2,
        3,
        4
      ].includes(o[0]))) throw new Error("Format Error: invalid pubkey in key 0x" + B(t.key));
      return o;
    }
  }
  function di(e) {
    function r(i) {
      if (i.key[0] !== e) throw new Error("Decode Error: could not decode redeemScript with key 0x" + B(i.key));
      return i.value;
    }
    function t(i) {
      return {
        key: Uint8Array.from([
          e
        ]),
        value: i
      };
    }
    const o = "Uint8Array";
    function a(i) {
      return i instanceof Uint8Array;
    }
    function n(i, s) {
      return !!i && !!s && i.redeemScript === void 0;
    }
    return {
      decode: r,
      encode: t,
      check: a,
      expected: o,
      canAdd: n
    };
  }
  const Cl = (e) => e.length === 32;
  function fi(e) {
    const r = Wo(e, Cl);
    function t(i) {
      const { numberValue: s, bytes: u } = Nr(i.value), c = r.decode({
        key: i.key,
        value: i.value.slice(u + Number(s) * 32)
      }), d = new Array(Number(s));
      for (let l = 0, f = u; l < s; l++, f += 32) d[l] = i.value.slice(f, f + 32);
      return {
        ...c,
        leafHashes: d
      };
    }
    function o(i) {
      const s = r.encode(i), u = Ue(i.leafHashes.length), c = new Uint8Array(u);
      fr(i.leafHashes.length, c);
      const d = Ve([
        c,
        ...i.leafHashes,
        s.value
      ]);
      return {
        ...s,
        value: d
      };
    }
    const a = "{ masterFingerprint: Uint8Array; pubkey: Uint8Array; path: string; leafHashes: Uint8Array[]; }";
    function n(i) {
      return Array.isArray(i.leafHashes) && i.leafHashes.every((s) => s instanceof Uint8Array && s.length === 32) && r.check(i);
    }
    return {
      decode: t,
      encode: o,
      check: n,
      expected: a,
      canAddToArray: r.canAddToArray
    };
  }
  function hi(e) {
    function r(i) {
      if (i.key[0] !== e || i.key.length !== 1) throw new Error("Decode Error: could not decode tapInternalKey with key 0x" + B(i.key));
      if (i.value.length !== 32) throw new Error("Decode Error: tapInternalKey not a 32-byte x-only pubkey");
      return i.value;
    }
    function t(i) {
      return {
        key: Uint8Array.from([
          e
        ]),
        value: i
      };
    }
    const o = "Uint8Array";
    function a(i) {
      return i instanceof Uint8Array && i.length === 32;
    }
    function n(i, s) {
      return !!i && !!s && i.tapInternalKey === void 0;
    }
    return {
      decode: r,
      encode: t,
      check: a,
      expected: o,
      canAdd: n
    };
  }
  function pi(e) {
    function r(i) {
      if (i.key[0] !== e) throw new Error("Decode Error: could not decode witnessScript with key 0x" + B(i.key));
      return i.value;
    }
    function t(i) {
      return {
        key: Uint8Array.from([
          e
        ]),
        value: i
      };
    }
    const o = "Uint8Array";
    function a(i) {
      return i instanceof Uint8Array;
    }
    function n(i, s) {
      return !!i && !!s && i.witnessScript === void 0;
    }
    return {
      decode: r,
      encode: t,
      check: a,
      expected: o,
      canAdd: n
    };
  }
  const Yo = {
    unsignedTx: gu,
    globalXpub: pu,
    checkPubkey: Xo([])
  }, ae = {
    nonWitnessUtxo: Ou,
    partialSig: Fu,
    sighashType: Zu,
    finalScriptSig: _u,
    finalScriptWitness: Tu,
    porCommitment: Gu,
    witnessUtxo: Il,
    bip32Derivation: Wo(z.BIP32_DERIVATION),
    redeemScript: di(z.REDEEM_SCRIPT),
    witnessScript: pi(z.WITNESS_SCRIPT),
    checkPubkey: Xo([
      z.PARTIAL_SIG,
      z.BIP32_DERIVATION
    ]),
    tapKeySig: al,
    tapScriptSig: kl,
    tapLeafScript: ll,
    tapBip32Derivation: fi(z.TAP_BIP32_DERIVATION),
    tapInternalKey: hi(z.TAP_INTERNAL_KEY),
    tapMerkleRoot: ml
  }, Je = {
    bip32Derivation: Wo(Z.BIP32_DERIVATION),
    redeemScript: di(Z.REDEEM_SCRIPT),
    witnessScript: pi(Z.WITNESS_SCRIPT),
    checkPubkey: Xo([
      Z.BIP32_DERIVATION
    ]),
    tapBip32Derivation: fi(Z.TAP_BIP32_DERIVATION),
    tapTree: Nl,
    tapInternalKey: hi(Z.TAP_INTERNAL_KEY)
  }, Rl = Object.freeze(Object.defineProperty({
    __proto__: null,
    globals: Yo,
    inputs: ae,
    outputs: Je
  }, Symbol.toStringTag, {
    value: "Module"
  })), Ut = (e) => [
    ...Array(e).keys()
  ];
  function Oa(e) {
    const r = e.map(Ll);
    return r.push(Uint8Array.from([
      0
    ])), Ve(r);
  }
  function Ll(e) {
    const r = e.key.length, t = e.value.length, o = Ue(r), a = Ue(t), n = new Uint8Array(o + r + a + t);
    return fr(r, n, 0), n.set(e.key, o), fr(t, n, o + r), n.set(e.value, o + r + a), n;
  }
  function Bl(e, r) {
    let t = 0;
    function o() {
      const { numberValue: v, bytes: E } = Nr(e, t);
      t += E;
      const A = e.slice(t, t + Number(v));
      return t += Number(v), A;
    }
    function a() {
      const v = Mt(e, t, "BE");
      return t += 4, v;
    }
    function n() {
      const v = Na(e, t);
      return t += 1, v;
    }
    function i() {
      const v = o(), E = o();
      return {
        key: v,
        value: E
      };
    }
    function s() {
      if (t >= e.length) throw new Error("Format Error: Unexpected End of PSBT");
      const v = Na(e, t) === 0;
      return v && t++, v;
    }
    if (a() !== 1886610036) throw new Error("Format Error: Invalid Magic Number");
    if (n() !== 255) throw new Error("Format Error: Magic Number must be followed by 0xff separator");
    const u = [], c = {};
    for (; !s(); ) {
      const v = i(), E = B(v.key);
      if (c[E]) throw new Error("Format Error: Keys must be unique for global keymap: key " + E);
      c[E] = 1, u.push(v);
    }
    const d = u.filter((v) => v.key[0] === Ke.UNSIGNED_TX);
    if (d.length !== 1) throw new Error("Format Error: Only one UNSIGNED_TX allowed");
    const l = r(d[0].value), { inputCount: f, outputCount: p } = l.getInputOutputCounts(), h = [], m = [];
    for (const v of Ut(f)) {
      const E = {}, A = [];
      for (; !s(); ) {
        const y = i(), k = B(y.key);
        if (E[k]) throw new Error("Format Error: Keys must be unique for each input: input index " + v + " key " + k);
        E[k] = 1, A.push(y);
      }
      h.push(A);
    }
    for (const v of Ut(p)) {
      const E = {}, A = [];
      for (; !s(); ) {
        const y = i(), k = B(y.key);
        if (E[k]) throw new Error("Format Error: Keys must be unique for each output: output index " + v + " key " + k);
        E[k] = 1, A.push(y);
      }
      m.push(A);
    }
    return mi(l, {
      globalMapKeyVals: u,
      inputKeyVals: h,
      outputKeyVals: m
    });
  }
  function fe(e, r, t) {
    if (Me(r, Uint8Array.from([
      t
    ]))) throw new Error(`Format Error: Invalid ${e} key: ${B(r)}`);
  }
  function mi(e, { globalMapKeyVals: r, inputKeyVals: t, outputKeyVals: o }) {
    const a = {
      unsignedTx: e
    };
    let n = 0;
    for (const d of r) switch (d.key[0]) {
      case Ke.UNSIGNED_TX:
        if (fe("global", d.key, Ke.UNSIGNED_TX), n > 0) throw new Error("Format Error: GlobalMap has multiple UNSIGNED_TX");
        n++;
        break;
      case Ke.GLOBAL_XPUB:
        a.globalXpub === void 0 && (a.globalXpub = []), a.globalXpub.push(Yo.globalXpub.decode(d));
        break;
      default:
        a.unknownKeyVals || (a.unknownKeyVals = []), a.unknownKeyVals.push(d);
    }
    const i = t.length, s = o.length, u = [], c = [];
    for (const d of Ut(i)) {
      const l = {};
      for (const f of t[d]) switch (ae.checkPubkey(f), f.key[0]) {
        case z.NON_WITNESS_UTXO:
          if (fe("input", f.key, z.NON_WITNESS_UTXO), l.nonWitnessUtxo !== void 0) throw new Error("Format Error: Input has multiple NON_WITNESS_UTXO");
          l.nonWitnessUtxo = ae.nonWitnessUtxo.decode(f);
          break;
        case z.WITNESS_UTXO:
          if (fe("input", f.key, z.WITNESS_UTXO), l.witnessUtxo !== void 0) throw new Error("Format Error: Input has multiple WITNESS_UTXO");
          l.witnessUtxo = ae.witnessUtxo.decode(f);
          break;
        case z.PARTIAL_SIG:
          l.partialSig === void 0 && (l.partialSig = []), l.partialSig.push(ae.partialSig.decode(f));
          break;
        case z.SIGHASH_TYPE:
          if (fe("input", f.key, z.SIGHASH_TYPE), l.sighashType !== void 0) throw new Error("Format Error: Input has multiple SIGHASH_TYPE");
          l.sighashType = ae.sighashType.decode(f);
          break;
        case z.REDEEM_SCRIPT:
          if (fe("input", f.key, z.REDEEM_SCRIPT), l.redeemScript !== void 0) throw new Error("Format Error: Input has multiple REDEEM_SCRIPT");
          l.redeemScript = ae.redeemScript.decode(f);
          break;
        case z.WITNESS_SCRIPT:
          if (fe("input", f.key, z.WITNESS_SCRIPT), l.witnessScript !== void 0) throw new Error("Format Error: Input has multiple WITNESS_SCRIPT");
          l.witnessScript = ae.witnessScript.decode(f);
          break;
        case z.BIP32_DERIVATION:
          l.bip32Derivation === void 0 && (l.bip32Derivation = []), l.bip32Derivation.push(ae.bip32Derivation.decode(f));
          break;
        case z.FINAL_SCRIPTSIG:
          fe("input", f.key, z.FINAL_SCRIPTSIG), l.finalScriptSig = ae.finalScriptSig.decode(f);
          break;
        case z.FINAL_SCRIPTWITNESS:
          fe("input", f.key, z.FINAL_SCRIPTWITNESS), l.finalScriptWitness = ae.finalScriptWitness.decode(f);
          break;
        case z.POR_COMMITMENT:
          fe("input", f.key, z.POR_COMMITMENT), l.porCommitment = ae.porCommitment.decode(f);
          break;
        case z.TAP_KEY_SIG:
          fe("input", f.key, z.TAP_KEY_SIG), l.tapKeySig = ae.tapKeySig.decode(f);
          break;
        case z.TAP_SCRIPT_SIG:
          l.tapScriptSig === void 0 && (l.tapScriptSig = []), l.tapScriptSig.push(ae.tapScriptSig.decode(f));
          break;
        case z.TAP_LEAF_SCRIPT:
          l.tapLeafScript === void 0 && (l.tapLeafScript = []), l.tapLeafScript.push(ae.tapLeafScript.decode(f));
          break;
        case z.TAP_BIP32_DERIVATION:
          l.tapBip32Derivation === void 0 && (l.tapBip32Derivation = []), l.tapBip32Derivation.push(ae.tapBip32Derivation.decode(f));
          break;
        case z.TAP_INTERNAL_KEY:
          fe("input", f.key, z.TAP_INTERNAL_KEY), l.tapInternalKey = ae.tapInternalKey.decode(f);
          break;
        case z.TAP_MERKLE_ROOT:
          fe("input", f.key, z.TAP_MERKLE_ROOT), l.tapMerkleRoot = ae.tapMerkleRoot.decode(f);
          break;
        default:
          l.unknownKeyVals || (l.unknownKeyVals = []), l.unknownKeyVals.push(f);
      }
      u.push(l);
    }
    for (const d of Ut(s)) {
      const l = {};
      for (const f of o[d]) switch (Je.checkPubkey(f), f.key[0]) {
        case Z.REDEEM_SCRIPT:
          if (fe("output", f.key, Z.REDEEM_SCRIPT), l.redeemScript !== void 0) throw new Error("Format Error: Output has multiple REDEEM_SCRIPT");
          l.redeemScript = Je.redeemScript.decode(f);
          break;
        case Z.WITNESS_SCRIPT:
          if (fe("output", f.key, Z.WITNESS_SCRIPT), l.witnessScript !== void 0) throw new Error("Format Error: Output has multiple WITNESS_SCRIPT");
          l.witnessScript = Je.witnessScript.decode(f);
          break;
        case Z.BIP32_DERIVATION:
          l.bip32Derivation === void 0 && (l.bip32Derivation = []), l.bip32Derivation.push(Je.bip32Derivation.decode(f));
          break;
        case Z.TAP_INTERNAL_KEY:
          fe("output", f.key, Z.TAP_INTERNAL_KEY), l.tapInternalKey = Je.tapInternalKey.decode(f);
          break;
        case Z.TAP_TREE:
          fe("output", f.key, Z.TAP_TREE), l.tapTree = Je.tapTree.decode(f);
          break;
        case Z.TAP_BIP32_DERIVATION:
          l.tapBip32Derivation === void 0 && (l.tapBip32Derivation = []), l.tapBip32Derivation.push(Je.tapBip32Derivation.decode(f));
          break;
        default:
          l.unknownKeyVals || (l.unknownKeyVals = []), l.unknownKeyVals.push(f);
      }
      c.push(l);
    }
    return {
      globalMap: a,
      inputs: u,
      outputs: c
    };
  }
  function Dl({ globalMap: e, inputs: r, outputs: t }) {
    const { globalKeyVals: o, inputKeyVals: a, outputKeyVals: n } = Io({
      globalMap: e,
      inputs: r,
      outputs: t
    }), i = Oa(o), s = (l) => l.length === 0 ? [
      Uint8Array.from([
        0
      ])
    ] : l.map(Oa), u = s(a), c = s(n), d = new Uint8Array(5);
    return d.set([
      112,
      115,
      98,
      116,
      255
    ], 0), Ve([
      d,
      i
    ].concat(u, c));
  }
  const Fl = (e, r) => Me(e.key, r.key);
  function lo(e, r) {
    const t = /* @__PURE__ */ new Set(), o = Object.entries(e).reduce((n, [i, s]) => {
      if (i === "unknownKeyVals") return n;
      const u = r[i];
      if (u === void 0) return n;
      const c = (Array.isArray(s) ? s : [
        s
      ]).map(u.encode);
      return c.map((l) => B(l.key)).forEach((l) => {
        if (t.has(l)) throw new Error("Serialize Error: Duplicate key: " + l);
        t.add(l);
      }), n.concat(c);
    }, []), a = e.unknownKeyVals ? e.unknownKeyVals.filter((n) => !t.has(B(n.key))) : [];
    return o.concat(a).sort(Fl);
  }
  function Io({ globalMap: e, inputs: r, outputs: t }) {
    return {
      globalKeyVals: lo(e, Yo),
      inputKeyVals: r.map((o) => lo(o, ae)),
      outputKeyVals: t.map((o) => lo(o, Je))
    };
  }
  function Kl(e) {
    const r = e[0], t = Io(r), o = e.slice(1);
    if (o.length === 0) throw new Error("Combine: Nothing to combine");
    const a = ja(r);
    if (a === void 0) throw new Error("Combine: Self missing transaction");
    const n = Sr(t.globalKeyVals), i = t.inputKeyVals.map(Sr), s = t.outputKeyVals.map(Sr);
    for (const u of o) {
      const c = ja(u);
      if (c === void 0 || Me(c.toBuffer(), a.toBuffer()) !== 0) throw new Error("Combine: One of the Psbts does not have the same transaction.");
      const d = Io(u);
      Sr(d.globalKeyVals).forEach(fo(n, t.globalKeyVals, d.globalKeyVals)), d.inputKeyVals.map(Sr).forEach((h, m) => h.forEach(fo(i[m], t.inputKeyVals[m], d.inputKeyVals[m]))), d.outputKeyVals.map(Sr).forEach((h, m) => h.forEach(fo(s[m], t.outputKeyVals[m], d.outputKeyVals[m])));
    }
    return mi(a, {
      globalMapKeyVals: t.globalKeyVals,
      inputKeyVals: t.inputKeyVals,
      outputKeyVals: t.outputKeyVals
    });
  }
  function fo(e, r, t) {
    return (o) => {
      if (e.has(o)) return;
      const a = t.filter((n) => B(n.key) === o)[0];
      r.push(a), e.add(o);
    };
  }
  function ja(e) {
    return e.globalMap.unsignedTx;
  }
  function Sr(e) {
    const r = /* @__PURE__ */ new Set();
    return e.forEach((t) => {
      const o = B(t.key);
      if (r.has(o)) throw new Error("Combine: KeyValue Map keys should be unique");
      r.add(o);
    }), r;
  }
  function ce(e, r) {
    const t = e[r];
    if (t === void 0) throw new Error(`No input #${r}`);
    return t;
  }
  function qr(e, r) {
    const t = e[r];
    if (t === void 0) throw new Error(`No output #${r}`);
    return t;
  }
  function ho(e, r, t) {
    if (e.key[0] < t) throw new Error("Use the method for your specific key instead of addUnknownKeyVal*");
    if (r && r.filter((o) => Me(o.key, e.key) === 0).length !== 0) throw new Error(`Duplicate Key: ${B(e.key)}`);
  }
  function po(e) {
    let r = 0;
    return Object.keys(e).forEach((t) => {
      Number(isNaN(Number(t))) && r++;
    }), r;
  }
  function Vl(e, r) {
    let t = false;
    if (r.nonWitnessUtxo || r.witnessUtxo) {
      const o = !!r.redeemScript, a = !!r.witnessScript, n = !o || !!r.finalScriptSig, i = !a || !!r.finalScriptWitness, s = !!r.finalScriptSig || !!r.finalScriptWitness;
      t = n && i && s;
    }
    if (t === false) throw new Error(`Input #${e} has too much or too little data to clean`);
  }
  function Ca(e, r, t, o) {
    throw new Error(`Data for ${e} key ${r} is incorrect: Expected ${t} and got ${JSON.stringify(o)}`);
  }
  function Jo(e) {
    return (r, t) => {
      for (const o of Object.keys(r)) {
        const a = r[o], { canAdd: n, canAddToArray: i, check: s, expected: u } = Rl[e + "s"][o] || {}, c = !!i;
        if (s) if (c) {
          if (!Array.isArray(a) || t[o] && !Array.isArray(t[o])) throw new Error(`Key type ${o} must be an array`);
          a.every(s) || Ca(e, o, u, a);
          const d = t[o] || [], l = /* @__PURE__ */ new Set();
          if (!a.every((f) => i(d, f, l))) throw new Error("Can not add duplicate data to array");
          t[o] = d.concat(a);
        } else {
          if (s(a) || Ca(e, o, u, a), !n(t, a)) throw new Error(`Can not add duplicate data to ${e}`);
          t[o] = a;
        }
      }
    };
  }
  const Ml = Jo("global"), gi = Jo("input"), bi = Jo("output");
  function $l(e, r) {
    const t = e.length - 1, o = ce(e, t);
    gi(r, o);
  }
  function ql(e, r) {
    const t = e.length - 1, o = qr(e, t);
    bi(r, o);
  }
  let Ra = class {
    constructor(r) {
      this.inputs = [], this.outputs = [], this.globalMap = {
        unsignedTx: r
      };
    }
    static fromBase64(r, t) {
      const o = nu(r);
      return this.fromBuffer(o, t);
    }
    static fromHex(r, t) {
      const o = ou(r);
      return this.fromBuffer(o, t);
    }
    static fromBuffer(r, t) {
      const o = Bl(r, t), a = new this(o.globalMap.unsignedTx);
      return Object.assign(a, o), a;
    }
    toBase64() {
      const r = this.toBuffer();
      return au(r);
    }
    toHex() {
      const r = this.toBuffer();
      return B(r);
    }
    toBuffer() {
      return Dl(this);
    }
    updateGlobal(r) {
      return Ml(r, this.globalMap), this;
    }
    updateInput(r, t) {
      const o = ce(this.inputs, r);
      return gi(t, o), this;
    }
    updateOutput(r, t) {
      const o = qr(this.outputs, r);
      return bi(t, o), this;
    }
    addUnknownKeyValToGlobal(r) {
      return ho(r, this.globalMap.unknownKeyVals, po(Ke)), this.globalMap.unknownKeyVals || (this.globalMap.unknownKeyVals = []), this.globalMap.unknownKeyVals.push(r), this;
    }
    addUnknownKeyValToInput(r, t) {
      const o = ce(this.inputs, r);
      return ho(t, o.unknownKeyVals, po(z)), o.unknownKeyVals || (o.unknownKeyVals = []), o.unknownKeyVals.push(t), this;
    }
    addUnknownKeyValToOutput(r, t) {
      const o = qr(this.outputs, r);
      return ho(t, o.unknownKeyVals, po(Z)), o.unknownKeyVals || (o.unknownKeyVals = []), o.unknownKeyVals.push(t), this;
    }
    addInput(r) {
      this.globalMap.unsignedTx.addInput(r), this.inputs.push({
        unknownKeyVals: []
      });
      const t = r.unknownKeyVals || [], o = this.inputs.length - 1;
      if (!Array.isArray(t)) throw new Error("unknownKeyVals must be an Array");
      return t.forEach((a) => this.addUnknownKeyValToInput(o, a)), $l(this.inputs, r), this;
    }
    addOutput(r) {
      this.globalMap.unsignedTx.addOutput(r), this.outputs.push({
        unknownKeyVals: []
      });
      const t = r.unknownKeyVals || [], o = this.outputs.length - 1;
      if (!Array.isArray(t)) throw new Error("unknownKeyVals must be an Array");
      return t.forEach((a) => this.addUnknownKeyValToOutput(o, a)), ql(this.outputs, r), this;
    }
    clearFinalizedInput(r) {
      const t = ce(this.inputs, r);
      Vl(r, t);
      for (const o of Object.keys(t)) [
        "witnessUtxo",
        "nonWitnessUtxo",
        "finalScriptSig",
        "finalScriptWitness",
        "unknownKeyVals"
      ].includes(o) || delete t[o];
      return this;
    }
    combine(...r) {
      const t = Kl([
        this
      ].concat(r));
      return Object.assign(this, t), this;
    }
    getTransaction() {
      return this.globalMap.unsignedTx.toBuffer();
    }
  };
  function _r(e) {
    return (r) => {
      try {
        return e({
          output: r
        }), true;
      } catch {
        return false;
      }
    };
  }
  const Gl = _r(Dt), Wl = _r(Fn), Xl = _r(Jr), $t = _r(Vt), La = _r(Zr), yi = _r(Qr), vi = _r(et);
  function Ht(e) {
    let r = new Uint8Array(0);
    function t(i) {
      r = Ee([
        r,
        i
      ]);
    }
    function o(i) {
      const s = r.length, u = Ue(i);
      r = Ee([
        r,
        new Uint8Array(u)
      ]), fr(i, r, s);
    }
    function a(i) {
      o(i.length), t(i);
    }
    function n(i) {
      o(i.length), i.forEach(a);
    }
    return n(e), r;
  }
  function wi(e, r) {
    const t = Ze(e), o = e.slice(1, 33), a = J(r);
    if (a === null) throw new Error("Unknown script error");
    return a.findIndex((n) => typeof n == "number" ? false : U(e, n) === 0 || U(t, n) === 0 || U(o, n) === 0);
  }
  function qt(e, r) {
    return wi(e, r) !== -1;
  }
  function Yl(e, r) {
    return Jl(e).some((o) => ki(o, Vr.decode, r));
  }
  function ki(e, r, t) {
    const { hashType: o } = r(e), a = [];
    switch (o & O.SIGHASH_ANYONECANPAY && a.push("addInput"), o & 31) {
      case O.SIGHASH_ALL:
        break;
      case O.SIGHASH_SINGLE:
      case O.SIGHASH_NONE:
        a.push("addOutput"), a.push("setInputSequence");
        break;
    }
    return a.indexOf(t) === -1;
  }
  function Jl(e) {
    let r = [];
    if ((e.partialSig || []).length === 0) {
      if (!e.finalScriptSig && !e.finalScriptWitness) return [];
      r = Ql(e);
    } else r = e.partialSig;
    return r.map((t) => t.signature);
  }
  function Ql(e) {
    const r = e.finalScriptSig ? J(e.finalScriptSig) || [] : [], t = e.finalScriptWitness ? J(e.finalScriptWitness) || [] : [];
    return r.concat(t).filter((o) => o instanceof Uint8Array && er(o)).map((o) => ({
      signature: o
    }));
  }
  const gt = (e) => e.length === 32 ? e : e.slice(1, 33);
  function Ba(e, r, t) {
    const o = fd(r, e, t);
    try {
      const n = ld(r, o).concat(o.script).concat(o.controlBlock);
      return {
        finalScriptWitness: Ht(n)
      };
    } catch (a) {
      throw new Error(`Can not finalize taproot input #${e}: ${a}`);
    }
  }
  function ht(e, r) {
    const t = Uint8Array.from(r ? [
      r
    ] : []);
    return Ee([
      e,
      t
    ]);
  }
  function Ce(e) {
    return e && !!(e.tapInternalKey || e.tapMerkleRoot || e.tapLeafScript && e.tapLeafScript.length || e.tapBip32Derivation && e.tapBip32Derivation.length || e.witnessUtxo && vi(e.witnessUtxo.script));
  }
  function mo(e, r) {
    return e && !!(e.tapInternalKey || e.tapTree || e.tapBip32Derivation && e.tapBip32Derivation.length || r);
  }
  function Da(e, r, t) {
    sd(e, r, t), ud(e, r, t);
  }
  function Fa(e, r, t) {
    cd(e, r, t), Zl(e, r);
  }
  function Zl(e, r) {
    if (!r.tapTree && !r.tapInternalKey) return;
    const t = r.tapInternalKey || e.tapInternalKey, o = r.tapTree || e.tapTree;
    if (t) {
      const { script: a } = e, n = ed(t, o);
      if (a && U(n, a) !== 0) throw new Error("Error adding output. Script or address mismatch.");
    }
  }
  function ed(e, r) {
    const t = r && rd(r.leaves), { output: o } = et({
      internalPubkey: e,
      scriptTree: t
    });
    return o;
  }
  function rd(e = []) {
    return e.length === 1 && e[0].depth === 0 ? {
      output: e[0].script,
      version: e[0].leafVersion
    } : id(e);
  }
  function td(e, r) {
    return ad(e).some((o) => ki(o, od, r));
  }
  function od(e) {
    return {
      signature: e.slice(0, 64),
      hashType: e.slice(64)[0] || O.SIGHASH_DEFAULT
    };
  }
  function ad(e) {
    const r = [];
    if (e.tapKeySig && r.push(e.tapKeySig), e.tapScriptSig && r.push(...e.tapScriptSig.map((t) => t.signature)), !r.length) {
      const t = nd(e.finalScriptWitness);
      t && r.push(t);
    }
    return r;
  }
  function nd(e) {
    if (!e) return;
    const r = e.slice(2);
    if (r.length === 64 || r.length === 65) return r;
  }
  function id(e) {
    let r;
    for (const t of e) if (r = To(t, r), !r) throw new Error("No room left to insert tapleaf in tree");
    return r;
  }
  function To(e, r, t = 0) {
    if (t > Bc) throw new Error("Max taptree depth exceeded.");
    if (e.depth === t) return r ? void 0 : {
      output: e.script,
      version: e.leafVersion
    };
    if (Do(r)) return;
    const o = To(e, r && r[0], t + 1);
    if (o) return [
      o,
      r && r[1]
    ];
    const a = To(e, r && r[1], t + 1);
    if (a) return [
      r && r[0],
      a
    ];
  }
  function sd(e, r, t) {
    const o = Ce(e) && zr(r), a = zr(e) && Ce(r), n = e === r && Ce(r) && zr(r);
    if (o || a || n) throw new Error(`Invalid arguments for Psbt.${t}. Cannot use both taproot and non-taproot fields.`);
  }
  function cd(e, r, t) {
    const o = mo(e) && zr(r), a = zr(e) && mo(r), n = e === r && mo(r) && zr(r);
    if (o || a || n) throw new Error(`Invalid arguments for Psbt.${t}. Cannot use both taproot and non-taproot fields.`);
  }
  function ud(e, r, t) {
    if (r.tapMerkleRoot) {
      const o = (r.tapLeafScript || []).every((n) => go(n, r.tapMerkleRoot)), a = (e.tapLeafScript || []).every((n) => go(n, r.tapMerkleRoot));
      if (!o || !a) throw new Error(`Invalid arguments for Psbt.${t}. Tapleaf not part of taptree.`);
    } else if (e.tapMerkleRoot && !(r.tapLeafScript || []).every((a) => go(a, e.tapMerkleRoot))) throw new Error(`Invalid arguments for Psbt.${t}. Tapleaf not part of taptree.`);
  }
  function go(e, r) {
    if (!r) return true;
    const t = Qe({
      output: e.script,
      version: e.leafVersion
    }), o = xo(e.controlBlock, t);
    return U(o, r) === 0;
  }
  function ld(e, r) {
    const t = Qe({
      output: r.script,
      version: r.leafVersion
    });
    return (e.tapScriptSig || []).filter((o) => U(o.leafHash, t) === 0).map((o) => dd(r.script, o)).sort((o, a) => a.positionInScript - o.positionInScript).map((o) => o.signature);
  }
  function dd(e, r) {
    return Object.assign({
      positionInScript: wi(r.pubkey, e)
    }, r);
  }
  function fd(e, r, t) {
    if (!e.tapScriptSig || !e.tapScriptSig.length) throw new Error(`Can not finalize taproot input #${r}. No tapleaf script signature provided.`);
    const o = (e.tapLeafScript || []).sort((a, n) => a.controlBlock.length - n.controlBlock.length).find((a) => hd(a, e.tapScriptSig, t));
    if (!o) throw new Error(`Can not finalize taproot input #${r}. Signature for tapleaf script not found.`);
    return o;
  }
  function hd(e, r, t) {
    const o = Qe({
      output: e.script,
      version: e.leafVersion
    });
    return (!t || U(o, t) === 0) && r.find((n) => U(n.leafHash, o) === 0) !== void 0;
  }
  function zr(e) {
    return e && !!(e.redeemScript || e.witnessScript || e.bip32Derivation && e.bip32Derivation.length);
  }
  const pd = {
    network: $e,
    maximumFeeRate: 5e3
  };
  zo = class {
    constructor(r = {}, t = new Ra(new _i())) {
      __publicField(this, "data");
      __publicField(this, "__CACHE");
      __publicField(this, "opts");
      this.data = t, this.opts = Object.assign({}, pd, r), this.__CACHE = {
        __NON_WITNESS_UTXO_TX_CACHE: [],
        __NON_WITNESS_UTXO_BUF_CACHE: [],
        __TX_IN_CACHE: {},
        __TX: this.data.globalMap.unsignedTx.tx,
        __UNSAFE_SIGN_NONSEGWIT: false
      }, this.data.inputs.length === 0 && this.setVersion(2);
      const o = (a, n, i, s) => Object.defineProperty(a, n, {
        enumerable: i,
        writable: s
      });
      o(this, "__CACHE", false, true), o(this, "opts", false, true);
    }
    static fromBase64(r, t = {}) {
      const o = hs(r);
      return this.fromBuffer(o, t);
    }
    static fromHex(r, t = {}) {
      const o = kr(r);
      return this.fromBuffer(o, t);
    }
    static fromBuffer(r, t = {}) {
      const o = Ra.fromBuffer(r, md), a = new zo(t, o);
      return wd(a.__CACHE.__TX, a.__CACHE), a;
    }
    get inputCount() {
      return this.data.inputs.length;
    }
    get version() {
      return this.__CACHE.__TX.version;
    }
    set version(r) {
      this.setVersion(r);
    }
    get locktime() {
      return this.__CACHE.__TX.locktime;
    }
    set locktime(r) {
      this.setLocktime(r);
    }
    get txInputs() {
      return this.__CACHE.__TX.ins.map((r) => ({
        hash: za(r.hash),
        index: r.index,
        sequence: r.sequence
      }));
    }
    get txOutputs() {
      return this.__CACHE.__TX.outs.map((r) => {
        let t;
        try {
          t = Gc(r.script, this.opts.network);
        } catch {
        }
        return {
          script: za(r.script),
          value: r.value,
          address: t
        };
      });
    }
    combine(...r) {
      return this.data.combine(...r.map((t) => t.data)), this;
    }
    clone() {
      const r = zo.fromBuffer(this.data.toBuffer());
      return r.opts = JSON.parse(JSON.stringify(this.opts)), r;
    }
    setMaximumFeeRate(r) {
      pt(r), this.opts.maximumFeeRate = r;
    }
    setVersion(r) {
      pt(r), Br(this.data.inputs, "setVersion");
      const t = this.__CACHE;
      return t.__TX.version = r, t.__EXTRACTED_TX = void 0, this;
    }
    setLocktime(r) {
      pt(r), Br(this.data.inputs, "setLocktime");
      const t = this.__CACHE;
      return t.__TX.locktime = r, t.__EXTRACTED_TX = void 0, this;
    }
    setInputSequence(r, t) {
      pt(t), Br(this.data.inputs, "setInputSequence");
      const o = this.__CACHE;
      if (o.__TX.ins.length <= r) throw new Error("Input index too high");
      return o.__TX.ins[r].sequence = t, o.__EXTRACTED_TX = void 0, this;
    }
    addInputs(r) {
      return r.forEach((t) => this.addInput(t)), this;
    }
    addInput(r) {
      if (arguments.length > 1 || !r || r.hash === void 0 || r.index === void 0) throw new Error("Invalid arguments for Psbt.addInput. Requires single object with at least [hash] and [index]");
      Da(r, r, "addInput"), Br(this.data.inputs, "addInput"), r.witnessScript && Pt(r.witnessScript);
      const t = this.__CACHE;
      this.data.addInput(r);
      const o = t.__TX.ins[t.__TX.ins.length - 1];
      Ai(t, o);
      const a = this.data.inputs.length - 1, n = this.data.inputs[a];
      return n.nonWitnessUtxo && Uo(this.__CACHE, n, a), t.__FEE = void 0, t.__FEE_RATE = void 0, t.__EXTRACTED_TX = void 0, this;
    }
    addOutputs(r) {
      return r.forEach((t) => this.addOutput(t)), this;
    }
    addOutput(r) {
      if (arguments.length > 1 || !r || r.value === void 0 || r.address === void 0 && r.script === void 0) throw new Error("Invalid arguments for Psbt.addOutput. Requires single object with at least [script or address] and [value]");
      Br(this.data.inputs, "addOutput");
      const { address: t } = r;
      if (typeof t == "string") {
        const { network: a } = this.opts, n = Wc(t, a);
        r = Object.assign({}, r, {
          script: n
        });
      }
      Fa(r, r, "addOutput");
      const o = this.__CACHE;
      return this.data.addOutput(r), o.__FEE = void 0, o.__FEE_RATE = void 0, o.__EXTRACTED_TX = void 0, this;
    }
    extractTransaction(r) {
      if (!this.data.inputs.every(Ei)) throw new Error("Not finalized");
      const t = this.__CACHE;
      if (r || bd(this, t, this.opts), t.__EXTRACTED_TX) return t.__EXTRACTED_TX;
      const o = t.__TX.clone();
      return Ni(this.data.inputs, o, t, true), o;
    }
    getFeeRate() {
      return qa("__FEE_RATE", "fee rate", this.data.inputs, this.__CACHE);
    }
    getFee() {
      return qa("__FEE", "fee", this.data.inputs, this.__CACHE);
    }
    finalizeAllInputs() {
      return ce(this.data.inputs, 0), Dr(this.data.inputs.length).forEach((r) => this.finalizeInput(r)), this;
    }
    finalizeInput(r, t) {
      const o = ce(this.data.inputs, r);
      return Ce(o) ? this._finalizeTaprootInput(r, o, void 0, t) : this._finalizeInput(r, o, t);
    }
    finalizeTaprootInput(r, t, o = Ba) {
      const a = ce(this.data.inputs, r);
      if (Ce(a)) return this._finalizeTaprootInput(r, a, t, o);
      throw new Error(`Cannot finalize input #${r}. Not Taproot.`);
    }
    _finalizeInput(r, t, o = kd) {
      const { script: a, isP2SH: n, isP2WSH: i, isSegwit: s } = Sd(r, t, this.__CACHE);
      if (!a) throw new Error(`No script found for input #${r}`);
      yd(t);
      const { finalScriptSig: u, finalScriptWitness: c } = o(r, t, a, s, n, i);
      if (u && this.data.updateInput(r, {
        finalScriptSig: u
      }), c && this.data.updateInput(r, {
        finalScriptWitness: c
      }), !u && !c) throw new Error(`Unknown error finalizing input #${r}`);
      return this.data.clearFinalizedInput(r), this;
    }
    _finalizeTaprootInput(r, t, o, a = Ba) {
      if (!t.witnessUtxo) throw new Error(`Cannot finalize input #${r}. Missing withness utxo.`);
      if (t.tapKeySig) {
        const n = et({
          output: t.witnessUtxo.script,
          signature: t.tapKeySig
        }), i = Ht(n.witness);
        this.data.updateInput(r, {
          finalScriptWitness: i
        });
      } else {
        const { finalScriptWitness: n } = a(r, t, o);
        this.data.updateInput(r, {
          finalScriptWitness: n
        });
      }
      return this.data.clearFinalizedInput(r), this;
    }
    getInputType(r) {
      const t = ce(this.data.inputs, r), o = Oi(r, t, this.__CACHE), a = Wt(o, r, "input", t.redeemScript || Hd(t.finalScriptSig), t.witnessScript || Pd(t.finalScriptWitness)), n = a.type === "raw" ? "" : a.type + "-", i = Ci(a.meaningfulScript);
      return n + i;
    }
    inputHasPubkey(r, t) {
      const o = ce(this.data.inputs, r);
      return zd(t, o, r, this.__CACHE);
    }
    inputHasHDKey(r, t) {
      const o = ce(this.data.inputs, r), a = Va(t);
      return !!o.bip32Derivation && o.bip32Derivation.some(a);
    }
    outputHasPubkey(r, t) {
      const o = qr(this.data.outputs, r);
      return Ud(t, o, r, this.__CACHE);
    }
    outputHasHDKey(r, t) {
      const o = qr(this.data.outputs, r), a = Va(t);
      return !!o.bip32Derivation && o.bip32Derivation.some(a);
    }
    validateSignaturesOfAllInputs(r) {
      return ce(this.data.inputs, 0), Dr(this.data.inputs.length).map((o) => this.validateSignaturesOfInput(o, r)).reduce((o, a) => a === true && o, true);
    }
    validateSignaturesOfInput(r, t, o) {
      const a = this.data.inputs[r];
      return Ce(a) ? this.validateSignaturesOfTaprootInput(r, t, o) : this._validateSignaturesOfInput(r, t, o);
    }
    _validateSignaturesOfInput(r, t, o) {
      const a = this.data.inputs[r], n = (a || {}).partialSig;
      if (!a || !n || n.length < 1) throw new Error("No signatures to validate");
      if (typeof t != "function") throw new Error("Need validator function to validate signatures");
      const i = o ? n.filter((l) => U(l.pubkey, o) === 0) : n;
      if (i.length < 1) throw new Error("No signatures for this pubkey");
      const s = [];
      let u, c, d;
      for (const l of i) {
        const f = Vr.decode(l.signature), { hash: p, script: h } = d !== f.hashType ? Ii(r, Object.assign({}, a, {
          sighashType: f.hashType
        }), this.__CACHE, true) : {
          hash: u,
          script: c
        };
        d = f.hashType, u = p, c = h, xi(l.pubkey, h, "verify"), s.push(t(l.pubkey, p, f.signature));
      }
      return s.every((l) => l === true);
    }
    validateSignaturesOfTaprootInput(r, t, o) {
      const a = this.data.inputs[r], n = (a || {}).tapKeySig, i = (a || {}).tapScriptSig;
      if (!a && !n && !(i && !i.length)) throw new Error("No signatures to validate");
      if (typeof t != "function") throw new Error("Need validator function to validate signatures");
      o = o && gt(o);
      const s = o ? zi(r, a, this.data.inputs, o, this.__CACHE) : Ed(r, a, this.data.inputs, this.__CACHE);
      if (!s.length) throw new Error("No signatures for this pubkey");
      const u = s.find((d) => !d.leafHash);
      let c = 0;
      if (n && u) {
        if (!t(u.pubkey, u.hash, Wa(n))) return false;
        c++;
      }
      if (i) for (const d of i) {
        const l = s.find((f) => U(f.pubkey, d.pubkey) === 0);
        if (l) {
          if (!t(d.pubkey, l.hash, Wa(d.signature))) return false;
          c++;
        }
      }
      return c > 0;
    }
    signAllInputsHD(r, t = [
      O.SIGHASH_ALL
    ]) {
      if (!r || !r.publicKey || !r.fingerprint) throw new Error("Need HDSigner to sign input");
      const o = [];
      for (const a of Dr(this.data.inputs.length)) try {
        this.signInputHD(a, r, t), o.push(true);
      } catch {
        o.push(false);
      }
      if (o.every((a) => a === false)) throw new Error("No inputs were signed");
      return this;
    }
    signAllInputsHDAsync(r, t = [
      O.SIGHASH_ALL
    ]) {
      return new Promise((o, a) => {
        if (!r || !r.publicKey || !r.fingerprint) return a(new Error("Need HDSigner to sign input"));
        const n = [], i = [];
        for (const s of Dr(this.data.inputs.length)) i.push(this.signInputHDAsync(s, r, t).then(() => {
          n.push(true);
        }, () => {
          n.push(false);
        }));
        return Promise.all(i).then(() => {
          if (n.every((s) => s === false)) return a(new Error("No inputs were signed"));
          o();
        });
      });
    }
    signInputHD(r, t, o = [
      O.SIGHASH_ALL
    ]) {
      if (!t || !t.publicKey || !t.fingerprint) throw new Error("Need HDSigner to sign input");
      return Xa(r, this.data.inputs, t).forEach((n) => this.signInput(r, n, o)), this;
    }
    signInputHDAsync(r, t, o = [
      O.SIGHASH_ALL
    ]) {
      return new Promise((a, n) => {
        if (!t || !t.publicKey || !t.fingerprint) return n(new Error("Need HDSigner to sign input"));
        const s = Xa(r, this.data.inputs, t).map((u) => this.signInputAsync(r, u, o));
        return Promise.all(s).then(() => {
          a();
        }).catch(n);
      });
    }
    signAllInputs(r, t) {
      if (!r || !r.publicKey) throw new Error("Need Signer to sign input");
      const o = [];
      for (const a of Dr(this.data.inputs.length)) try {
        this.signInput(a, r, t), o.push(true);
      } catch {
        o.push(false);
      }
      if (o.every((a) => a === false)) throw new Error("No inputs were signed");
      return this;
    }
    signAllInputsAsync(r, t) {
      return new Promise((o, a) => {
        if (!r || !r.publicKey) return a(new Error("Need Signer to sign input"));
        const n = [], i = [];
        for (const [s] of this.data.inputs.entries()) i.push(this.signInputAsync(s, r, t).then(() => {
          n.push(true);
        }, () => {
          n.push(false);
        }));
        return Promise.all(i).then(() => {
          if (n.every((s) => s === false)) return a(new Error("No inputs were signed"));
          o();
        });
      });
    }
    signInput(r, t, o) {
      if (!t || !t.publicKey) throw new Error("Need Signer to sign input");
      const a = ce(this.data.inputs, r);
      return Ce(a) ? this._signTaprootInput(r, a, t, void 0, o) : this._signInput(r, t, o);
    }
    signTaprootInput(r, t, o, a) {
      if (!t || !t.publicKey) throw new Error("Need Signer to sign input");
      const n = ce(this.data.inputs, r);
      if (Ce(n)) return this._signTaprootInput(r, n, t, o, a);
      throw new Error(`Input #${r} is not of type Taproot.`);
    }
    _signInput(r, t, o = [
      O.SIGHASH_ALL
    ]) {
      const { hash: a, sighashType: n } = Ga(this.data.inputs, r, t.publicKey, this.__CACHE, o), i = [
        {
          pubkey: t.publicKey,
          signature: Vr.encode(t.sign(a), n)
        }
      ];
      return this.data.updateInput(r, {
        partialSig: i
      }), this;
    }
    _signTaprootInput(r, t, o, a, n = [
      O.SIGHASH_DEFAULT
    ]) {
      const i = this.checkTaprootHashesForSig(r, t, o, a, n), s = i.filter((c) => !c.leafHash).map((c) => ht(o.signSchnorr(c.hash), t.sighashType))[0], u = i.filter((c) => !!c.leafHash).map((c) => ({
        pubkey: gt(o.publicKey),
        signature: ht(o.signSchnorr(c.hash), t.sighashType),
        leafHash: c.leafHash
      }));
      return s && this.data.updateInput(r, {
        tapKeySig: s
      }), u.length && this.data.updateInput(r, {
        tapScriptSig: u
      }), this;
    }
    signInputAsync(r, t, o) {
      return Promise.resolve().then(() => {
        if (!t || !t.publicKey) throw new Error("Need Signer to sign input");
        const a = ce(this.data.inputs, r);
        return Ce(a) ? this._signTaprootInputAsync(r, a, t, void 0, o) : this._signInputAsync(r, t, o);
      });
    }
    signTaprootInputAsync(r, t, o, a) {
      return Promise.resolve().then(() => {
        if (!t || !t.publicKey) throw new Error("Need Signer to sign input");
        const n = ce(this.data.inputs, r);
        if (Ce(n)) return this._signTaprootInputAsync(r, n, t, o, a);
        throw new Error(`Input #${r} is not of type Taproot.`);
      });
    }
    _signInputAsync(r, t, o = [
      O.SIGHASH_ALL
    ]) {
      const { hash: a, sighashType: n } = Ga(this.data.inputs, r, t.publicKey, this.__CACHE, o);
      return Promise.resolve(t.sign(a)).then((i) => {
        const s = [
          {
            pubkey: t.publicKey,
            signature: Vr.encode(i, n)
          }
        ];
        this.data.updateInput(r, {
          partialSig: s
        });
      });
    }
    async _signTaprootInputAsync(r, t, o, a, n = [
      O.SIGHASH_DEFAULT
    ]) {
      const i = this.checkTaprootHashesForSig(r, t, o, a, n), s = [], u = i.filter((d) => !d.leafHash)[0];
      if (u) {
        const d = Promise.resolve(o.signSchnorr(u.hash)).then((l) => ({
          tapKeySig: ht(l, t.sighashType)
        }));
        s.push(d);
      }
      const c = i.filter((d) => !!d.leafHash);
      if (c.length) {
        const d = c.map((l) => Promise.resolve(o.signSchnorr(l.hash)).then((f) => ({
          tapScriptSig: [
            {
              pubkey: gt(o.publicKey),
              signature: ht(f, t.sighashType),
              leafHash: l.leafHash
            }
          ]
        })));
        s.push(...d);
      }
      return Promise.all(s).then((d) => {
        d.forEach((l) => this.data.updateInput(r, l));
      });
    }
    checkTaprootHashesForSig(r, t, o, a, n) {
      if (typeof o.signSchnorr != "function") throw new Error(`Need Schnorr Signer to sign taproot input #${r}.`);
      const i = xd(r, t, this.data.inputs, o.publicKey, this.__CACHE, a, n);
      if (!i || !i.length) throw new Error(`Can not sign for input #${r} with the key ${yr(o.publicKey)}`);
      return i;
    }
    toBuffer() {
      return bo(this.__CACHE), this.data.toBuffer();
    }
    toHex() {
      return bo(this.__CACHE), this.data.toHex();
    }
    toBase64() {
      return bo(this.__CACHE), this.data.toBase64();
    }
    updateGlobal(r) {
      return this.data.updateGlobal(r), this;
    }
    updateInput(r, t) {
      return t.witnessScript && Pt(t.witnessScript), Da(this.data.inputs[r], t, "updateInput"), this.data.updateInput(r, t), t.nonWitnessUtxo && Uo(this.__CACHE, this.data.inputs[r], r), this;
    }
    updateOutput(r, t) {
      const o = this.data.outputs[r];
      return Fa(o, t, "updateOutput"), this.data.updateOutput(r, t), this;
    }
    addUnknownKeyValToGlobal(r) {
      return this.data.addUnknownKeyValToGlobal(r), this;
    }
    addUnknownKeyValToInput(r, t) {
      return this.data.addUnknownKeyValToInput(r, t), this;
    }
    addUnknownKeyValToOutput(r, t) {
      return this.data.addUnknownKeyValToOutput(r, t), this;
    }
    clearFinalizedInput(r) {
      return this.data.clearFinalizedInput(r), this;
    }
  };
  const md = (e) => new _i(e);
  class _i {
    constructor(r = Uint8Array.from([
      2,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ])) {
      __publicField(this, "tx");
      this.tx = O.fromBuffer(r), vd(this.tx), Object.defineProperty(this, "tx", {
        enumerable: false,
        writable: true
      });
    }
    getInputOutputCounts() {
      return {
        inputCount: this.tx.ins.length,
        outputCount: this.tx.outs.length
      };
    }
    addInput(r) {
      if (r.hash === void 0 || r.index === void 0 || !(r.hash instanceof Uint8Array) && typeof r.hash != "string" || typeof r.index != "number") throw new Error("Error adding input.");
      const t = typeof r.hash == "string" ? qo(kr(r.hash)) : r.hash;
      this.tx.addInput(t, r.index, r.sequence);
    }
    addOutput(r) {
      if (r.script === void 0 || r.value === void 0 || !(r.script instanceof Uint8Array) || typeof r.value != "bigint") throw new Error("Error adding output.");
      this.tx.addOutput(r.script, r.value);
    }
    toBuffer() {
      return this.tx.toBuffer();
    }
  }
  function gd(e, r, t) {
    switch (t) {
      case "pubkey":
      case "pubkeyhash":
      case "witnesspubkeyhash":
        return Ka(1, e.partialSig);
      case "multisig":
        const o = Dt({
          output: r
        });
        return Ka(o.m, e.partialSig, o.pubkeys);
      default:
        return false;
    }
  }
  function bo(e) {
    if (e.__UNSAFE_SIGN_NONSEGWIT !== false) throw new Error("Not BIP174 compliant, can not export");
  }
  function Ka(e, r, t) {
    if (!r) return false;
    let o;
    if (t ? o = t.map((a) => {
      const n = Nd(a);
      return r.find((i) => U(i.pubkey, n) === 0);
    }).filter((a) => !!a) : o = r, o.length > e) throw new Error("Too many signatures");
    return o.length === e;
  }
  function Ei(e) {
    return !!e.finalScriptSig || !!e.finalScriptWitness;
  }
  function Va(e) {
    return (r) => !(U(e.fingerprint, r.masterFingerprint) || U(e.derivePath(r.path).publicKey, r.pubkey));
  }
  function pt(e) {
    if (typeof e != "number" || e !== Math.floor(e) || e > 4294967295 || e < 0) throw new Error("Invalid 32 bit integer");
  }
  function bd(e, r, t) {
    const o = r.__FEE_RATE || e.getFeeRate(), a = r.__EXTRACTED_TX.virtualSize(), n = o * a;
    if (o >= t.maximumFeeRate) throw new Error(`Warning: You are paying around ${(n / 1e8).toFixed(8)} in fees, which is ${o} satoshi per byte for a transaction with a VSize of ${a} bytes (segwit counted as 0.25 byte per byte). Use setMaximumFeeRate method to raise your threshold, or pass true to the first arg of extractTransaction.`);
  }
  function Br(e, r) {
    e.forEach((t) => {
      if (Ce(t) ? td(t, r) : Yl(t, r)) throw new Error("Can not modify transaction, signatures exist.");
    });
  }
  function yd(e) {
    if (!e.sighashType || !e.partialSig) return;
    const { partialSig: r, sighashType: t } = e;
    r.forEach((o) => {
      const { hashType: a } = Vr.decode(o.signature);
      if (t !== a) throw new Error("Signature sighash does not match input sighash type");
    });
  }
  function xi(e, r, t) {
    if (!qt(e, r)) throw new Error(`Can not ${t} for this input with the key ${yr(e)}`);
  }
  function vd(e) {
    if (!e.ins.every((t) => t.script && t.script.length === 0 && t.witness && t.witness.length === 0)) throw new Error("Format Error: Transaction ScriptSigs are not empty");
  }
  function wd(e, r) {
    e.ins.forEach((t) => {
      Ai(r, t);
    });
  }
  function Ai(e, r) {
    const t = yr(qo(Uint8Array.from(r.hash))) + ":" + r.index;
    if (e.__TX_IN_CACHE[t]) throw new Error("Duplicate input detected.");
    e.__TX_IN_CACHE[t] = 1;
  }
  function Si(e, r) {
    return (t, o, a, n) => {
      const i = e({
        redeem: {
          output: a
        }
      }).output;
      if (U(o, i)) throw new Error(`${r} for ${n} #${t} doesn't match the scriptPubKey in the prevout`);
    };
  }
  const Ma = Si(Qr, "Redeem script"), $a = Si(Zr, "Witness script");
  function qa(e, r, t, o) {
    if (!t.every(Ei)) throw new Error(`PSBT must be finalized to calculate ${r}`);
    if (e === "__FEE_RATE" && o.__FEE_RATE) return o.__FEE_RATE;
    if (e === "__FEE" && o.__FEE) return o.__FEE;
    let a, n = true;
    if (o.__EXTRACTED_TX ? (a = o.__EXTRACTED_TX, n = false) : a = o.__TX.clone(), Ni(t, a, o, n), e === "__FEE_RATE") return o.__FEE_RATE;
    if (e === "__FEE") return o.__FEE;
  }
  function kd(e, r, t, o, a, n) {
    const i = Ci(t);
    if (!gd(r, t, i)) throw new Error(`Can not finalize input #${e}`);
    return _d(t, i, r.partialSig, o, a, n);
  }
  function _d(e, r, t, o, a, n) {
    let i, s;
    const u = Ad(e, r, t), c = n ? Zr({
      redeem: u
    }) : null, d = a ? Qr({
      redeem: c || u
    }) : null;
    return o ? (c ? s = Ht(c.witness) : s = Ht(u.witness), d && (i = d.input)) : d ? i = d.input : i = u.input, {
      finalScriptSig: i,
      finalScriptWitness: s
    };
  }
  function Ga(e, r, t, o, a) {
    const n = ce(e, r), { hash: i, sighashType: s, script: u } = Ii(r, n, o, false, a);
    return xi(t, u, "sign"), {
      hash: i,
      sighashType: s
    };
  }
  function Ii(e, r, t, o, a) {
    const n = t.__TX, i = r.sighashType || O.SIGHASH_ALL;
    Hi(i, a);
    let s, u;
    if (r.nonWitnessUtxo) {
      const l = Gt(t, r, e), f = n.ins[e].hash, p = l.getHash();
      if (U(f, p) !== 0) throw new Error(`Non-witness UTXO hash for input #${e} doesn't match the hash specified in the prevout`);
      const h = n.ins[e].index;
      u = l.outs[h];
    } else if (r.witnessUtxo) u = r.witnessUtxo;
    else throw new Error("Need a Utxo input item for signing");
    const { meaningfulScript: c, type: d } = Wt(u.script, e, "input", r.redeemScript, r.witnessScript);
    if ([
      "p2sh-p2wsh",
      "p2wsh"
    ].indexOf(d) >= 0) s = n.hashForWitnessV0(e, c, u.value, i);
    else if ($t(c)) {
      const l = Jr({
        hash: c.slice(2)
      }).output;
      s = n.hashForWitnessV0(e, l, u.value, i);
    } else {
      if (r.nonWitnessUtxo === void 0 && t.__UNSAFE_SIGN_NONSEGWIT === false) throw new Error(`Input #${e} has witnessUtxo but non-segwit script: ${yr(c)}`);
      !o && t.__UNSAFE_SIGN_NONSEGWIT !== false && console.warn(`Warning: Signing non-segwit inputs without the full parent transaction means there is a chance that a miner could feed you incorrect information to trick you into paying large fees. This behavior is the same as Psbt's predecessor (TransactionBuilder - now removed) when signing non-segwit scripts. You are not able to export this Psbt with toBuffer|toBase64|toHex since it is not BIP174 compliant.
*********************
PROCEED WITH CAUTION!
*********************`), s = n.hashForSignature(e, c, i);
    }
    return {
      script: c,
      sighashType: i,
      hash: s
    };
  }
  function Ed(e, r, t, o) {
    const a = [];
    if (r.tapInternalKey) {
      const i = Ti(e, r, o);
      i && a.push(i);
    }
    if (r.tapScriptSig) {
      const i = r.tapScriptSig.map((s) => s.pubkey);
      a.push(...i);
    }
    return a.map((i) => zi(e, r, t, i, o)).flat();
  }
  function Ti(e, r, t) {
    const { script: o } = Qo(e, r, t);
    return vi(o) ? o.subarray(2, 34) : null;
  }
  function Wa(e) {
    return e.length === 64 ? e : e.subarray(0, 64);
  }
  function xd(e, r, t, o, a, n, i) {
    const s = r.sighashType || O.SIGHASH_DEFAULT;
    Hi(s, i);
    const u = !!(r.tapInternalKey && !n);
    return Ui(e, r, t, o, a, u, s, n);
  }
  function zi(e, r, t, o, a) {
    const n = r.sighashType || O.SIGHASH_DEFAULT, i = !!r.tapKeySig;
    return Ui(e, r, t, o, a, i, n);
  }
  function Ui(e, r, t, o, a, n, i, s) {
    const u = a.__TX, c = t.map((h, m) => Qo(m, h, a)), d = c.map((h) => h.script), l = c.map((h) => h.value), f = [];
    if (n) {
      const h = Ti(e, r, a) || Uint8Array.from([]);
      if (U(gt(o), h) === 0) {
        const m = u.hashForWitnessV1(e, d, l, i);
        f.push({
          pubkey: o,
          hash: m
        });
      }
    }
    const p = (r.tapLeafScript || []).filter((h) => qt(o, h.script)).map((h) => {
      const m = Qe({
        output: h.script,
        version: h.leafVersion
      });
      return Object.assign({
        hash: m
      }, h);
    }).filter((h) => !s || U(s, h.hash) === 0).map((h) => {
      const m = u.hashForWitnessV1(e, d, l, i, h.hash);
      return {
        pubkey: o,
        hash: m,
        leafHash: h.hash
      };
    });
    return f.concat(p);
  }
  function Hi(e, r) {
    if (r && r.indexOf(e) < 0) {
      const t = Td(e);
      throw new Error(`Sighash type is not allowed. Retry the sign method passing the sighashTypes array of whitelisted types. Sighash type: ${t}`);
    }
  }
  function Ad(e, r, t) {
    let o;
    switch (r) {
      case "multisig":
        const a = Id(e, t);
        o = Dt({
          output: e,
          signatures: a
        });
        break;
      case "pubkey":
        o = Fn({
          output: e,
          signature: t[0].signature
        });
        break;
      case "pubkeyhash":
        o = Jr({
          output: e,
          pubkey: t[0].pubkey,
          signature: t[0].signature
        });
        break;
      case "witnesspubkeyhash":
        o = Vt({
          output: e,
          pubkey: t[0].pubkey,
          signature: t[0].signature
        });
        break;
    }
    return o;
  }
  function Sd(e, r, t) {
    const o = t.__TX, a = {
      script: null,
      isSegwit: false,
      isP2SH: false,
      isP2WSH: false
    };
    if (a.isP2SH = !!r.redeemScript, a.isP2WSH = !!r.witnessScript, r.witnessScript) a.script = r.witnessScript;
    else if (r.redeemScript) a.script = r.redeemScript;
    else if (r.nonWitnessUtxo) {
      const n = Gt(t, r, e), i = o.ins[e].index;
      a.script = n.outs[i].script;
    } else r.witnessUtxo && (a.script = r.witnessUtxo.script);
    return (r.witnessScript || $t(a.script)) && (a.isSegwit = true), a;
  }
  function Xa(e, r, t) {
    const o = ce(r, e);
    if (!o.bip32Derivation || o.bip32Derivation.length === 0) throw new Error("Need bip32Derivation to sign with HD");
    const a = o.bip32Derivation.map((i) => {
      if (U(i.masterFingerprint, t.fingerprint) === 0) return i;
    }).filter((i) => !!i);
    if (a.length === 0) throw new Error("Need one bip32Derivation masterFingerprint to match the HDSigner fingerprint");
    return a.map((i) => {
      const s = t.derivePath(i.path);
      if (U(i.pubkey, s.publicKey) !== 0) throw new Error("pubkey did not match bip32Derivation");
      return s;
    });
  }
  function Id(e, r) {
    return Dt({
      output: e
    }).pubkeys.map((o) => (r.filter((a) => U(a.pubkey, o) === 0)[0] || {}).signature).filter((o) => !!o);
  }
  function Pi(e) {
    let r = 0;
    function t(i) {
      return r += i, e.slice(r - i, r);
    }
    function o() {
      const i = Nr(e, r);
      return r += Ue(i.bigintValue), i.numberValue;
    }
    function a() {
      return t(o());
    }
    function n() {
      const i = o(), s = [];
      for (let u = 0; u < i; u++) s.push(a());
      return s;
    }
    return n();
  }
  function Td(e) {
    let r = e & O.SIGHASH_ANYONECANPAY ? "SIGHASH_ANYONECANPAY | " : "";
    switch (e & 31) {
      case O.SIGHASH_ALL:
        r += "SIGHASH_ALL";
        break;
      case O.SIGHASH_SINGLE:
        r += "SIGHASH_SINGLE";
        break;
      case O.SIGHASH_NONE:
        r += "SIGHASH_NONE";
        break;
    }
    return r;
  }
  function Uo(e, r, t) {
    e.__NON_WITNESS_UTXO_BUF_CACHE[t] = r.nonWitnessUtxo;
    const o = O.fromBuffer(r.nonWitnessUtxo);
    e.__NON_WITNESS_UTXO_TX_CACHE[t] = o;
    const a = e, n = t;
    delete r.nonWitnessUtxo, Object.defineProperty(r, "nonWitnessUtxo", {
      enumerable: true,
      get() {
        const i = a.__NON_WITNESS_UTXO_BUF_CACHE[n], s = a.__NON_WITNESS_UTXO_TX_CACHE[n];
        if (i !== void 0) return i;
        {
          const u = s.toBuffer();
          return a.__NON_WITNESS_UTXO_BUF_CACHE[n] = u, u;
        }
      },
      set(i) {
        a.__NON_WITNESS_UTXO_BUF_CACHE[n] = i;
      }
    });
  }
  function Ni(e, r, t, o) {
    let a = 0n;
    e.forEach((u, c) => {
      if (o && u.finalScriptSig && (r.ins[c].script = u.finalScriptSig), o && u.finalScriptWitness && (r.ins[c].witness = Pi(u.finalScriptWitness)), u.witnessUtxo) a += u.witnessUtxo.value;
      else if (u.nonWitnessUtxo) {
        const d = Gt(t, u, c), l = r.ins[c].index, f = d.outs[l];
        a += f.value;
      }
    });
    const n = r.outs.reduce((u, c) => u + c.value, 0n), i = a - n;
    if (i < 0) throw new Error("Outputs are spending more than Inputs");
    const s = r.virtualSize();
    t.__FEE = i, t.__EXTRACTED_TX = r, t.__FEE_RATE = Math.floor(Number(i / BigInt(s)));
  }
  function Gt(e, r, t) {
    const o = e.__NON_WITNESS_UTXO_TX_CACHE;
    return o[t] || Uo(e, r, t), o[t];
  }
  function Oi(e, r, t) {
    const { script: o } = Qo(e, r, t);
    return o;
  }
  function Qo(e, r, t) {
    if (r.witnessUtxo !== void 0) return {
      script: r.witnessUtxo.script,
      value: r.witnessUtxo.value
    };
    if (r.nonWitnessUtxo !== void 0) {
      const a = Gt(t, r, e).outs[t.__TX.ins[e].index];
      return {
        script: a.script,
        value: a.value
      };
    } else throw new Error("Can't find pubkey in input without Utxo data");
  }
  function zd(e, r, t, o) {
    const a = Oi(t, r, o), { meaningfulScript: n } = Wt(a, t, "input", r.redeemScript, r.witnessScript);
    return qt(e, n);
  }
  function Ud(e, r, t, o) {
    const a = o.__TX.outs[t].script, { meaningfulScript: n } = Wt(a, t, "output", r.redeemScript, r.witnessScript);
    return qt(e, n);
  }
  function Hd(e) {
    if (!e) return;
    const r = J(e);
    if (!r) return;
    const t = r[r.length - 1];
    if (!(!(t instanceof Uint8Array) || ji(t) || Od(t) || !J(t))) return t;
  }
  function Pd(e) {
    if (!e) return;
    const r = Pi(e), t = r[r.length - 1];
    if (!(ji(t) || !J(t))) return t;
  }
  function Nd(e) {
    if (e.length === 65) {
      const r = e[64] & 1, t = e.slice(0, 33);
      return t[0] = 2 | r, t;
    }
    return e.slice();
  }
  function ji(e) {
    return e.length === 33 && Vs(e);
  }
  function Od(e) {
    return er(e);
  }
  function Wt(e, r, t, o, a) {
    const n = yi(e), i = n && o && La(o), s = La(e);
    if (n && o === void 0) throw new Error("scriptPubkey is P2SH but redeemScript missing");
    if ((s || i) && a === void 0) throw new Error("scriptPubkey or redeemScript is P2WSH but witnessScript missing");
    let u;
    return i ? (u = a, Ma(r, e, o, t), $a(r, o, a, t), Pt(u)) : s ? (u = a, $a(r, e, a, t), Pt(u)) : n ? (u = o, Ma(r, e, o, t)) : u = e, {
      meaningfulScript: u,
      type: i ? "p2sh-p2wsh" : n ? "p2sh" : s ? "p2wsh" : "raw"
    };
  }
  function Pt(e) {
    if ($t(e) || yi(e)) throw new Error("P2WPKH or P2SH can not be contained within P2WSH");
  }
  function Ci(e) {
    return $t(e) ? "witnesspubkeyhash" : Xl(e) ? "pubkeyhash" : Gl(e) ? "multisig" : Wl(e) ? "pubkey" : "nonstandard";
  }
  function Dr(e) {
    return [
      ...Array(e).keys()
    ];
  }
  var Se = {}, je = {}, G = {}, he = {}, yo = {}, Fr = {}, Ya;
  function jd() {
    return Ya || (Ya = 1, Object.defineProperty(Fr, "__esModule", {
      value: true
    }), Fr.crypto = void 0, Fr.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0), Fr;
  }
  var Ja;
  function rt() {
    return Ja || (Ja = 1, (function(e) {
      Object.defineProperty(e, "__esModule", {
        value: true
      }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = t, e.anumber = o, e.abytes = a, e.ahash = n, e.aexists = i, e.aoutput = s, e.u8 = u, e.u32 = c, e.clean = d, e.createView = l, e.rotr = f, e.rotl = p, e.byteSwap = h, e.byteSwap32 = m, e.bytesToHex = A, e.hexToBytes = _, e.asyncLoop = j, e.utf8ToBytes = R, e.bytesToUtf8 = b, e.toBytes = w, e.kdfInputToBytes = x, e.concatBytes = H, e.checkOpts = T, e.createHasher = M, e.createOptHasher = X, e.createXOFer = Y, e.randomBytes = we;
      const r = jd();
      function t(g) {
        return g instanceof Uint8Array || ArrayBuffer.isView(g) && g.constructor.name === "Uint8Array";
      }
      function o(g) {
        if (!Number.isSafeInteger(g) || g < 0) throw new Error("positive integer expected, got " + g);
      }
      function a(g, ...I) {
        if (!t(g)) throw new Error("Uint8Array expected");
        if (I.length > 0 && !I.includes(g.length)) throw new Error("Uint8Array expected of length " + I + ", got length=" + g.length);
      }
      function n(g) {
        if (typeof g != "function" || typeof g.create != "function") throw new Error("Hash should be wrapped by utils.createHasher");
        o(g.outputLen), o(g.blockLen);
      }
      function i(g, I = true) {
        if (g.destroyed) throw new Error("Hash instance has been destroyed");
        if (I && g.finished) throw new Error("Hash#digest() has already been called");
      }
      function s(g, I) {
        a(g);
        const N = I.outputLen;
        if (g.length < N) throw new Error("digestInto() expects output buffer of length at least " + N);
      }
      function u(g) {
        return new Uint8Array(g.buffer, g.byteOffset, g.byteLength);
      }
      function c(g) {
        return new Uint32Array(g.buffer, g.byteOffset, Math.floor(g.byteLength / 4));
      }
      function d(...g) {
        for (let I = 0; I < g.length; I++) g[I].fill(0);
      }
      function l(g) {
        return new DataView(g.buffer, g.byteOffset, g.byteLength);
      }
      function f(g, I) {
        return g << 32 - I | g >>> I;
      }
      function p(g, I) {
        return g << I | g >>> 32 - I >>> 0;
      }
      e.isLE = new Uint8Array(new Uint32Array([
        287454020
      ]).buffer)[0] === 68;
      function h(g) {
        return g << 24 & 4278190080 | g << 8 & 16711680 | g >>> 8 & 65280 | g >>> 24 & 255;
      }
      e.swap8IfBE = e.isLE ? (g) => g : (g) => h(g), e.byteSwapIfBE = e.swap8IfBE;
      function m(g) {
        for (let I = 0; I < g.length; I++) g[I] = h(g[I]);
        return g;
      }
      e.swap32IfBE = e.isLE ? (g) => g : m;
      const v = typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", E = Array.from({
        length: 256
      }, (g, I) => I.toString(16).padStart(2, "0"));
      function A(g) {
        if (a(g), v) return g.toHex();
        let I = "";
        for (let N = 0; N < g.length; N++) I += E[g[N]];
        return I;
      }
      const y = {
        _0: 48,
        _9: 57,
        A: 65,
        F: 70,
        a: 97,
        f: 102
      };
      function k(g) {
        if (g >= y._0 && g <= y._9) return g - y._0;
        if (g >= y.A && g <= y.F) return g - (y.A - 10);
        if (g >= y.a && g <= y.f) return g - (y.a - 10);
      }
      function _(g) {
        if (typeof g != "string") throw new Error("hex string expected, got " + typeof g);
        if (v) return Uint8Array.fromHex(g);
        const I = g.length, N = I / 2;
        if (I % 2) throw new Error("hex string expected, got unpadded hex of length " + I);
        const K = new Uint8Array(N);
        for (let W = 0, se = 0; W < N; W++, se += 2) {
          const Er = k(g.charCodeAt(se)), Ae = k(g.charCodeAt(se + 1));
          if (Er === void 0 || Ae === void 0) {
            const Oe = g[se] + g[se + 1];
            throw new Error('hex string expected, got non-hex character "' + Oe + '" at index ' + se);
          }
          K[W] = Er * 16 + Ae;
        }
        return K;
      }
      const S = async () => {
      };
      e.nextTick = S;
      async function j(g, I, N) {
        let K = Date.now();
        for (let W = 0; W < g; W++) {
          N(W);
          const se = Date.now() - K;
          se >= 0 && se < I || (await (0, e.nextTick)(), K += se);
        }
      }
      function R(g) {
        if (typeof g != "string") throw new Error("string expected");
        return new Uint8Array(new TextEncoder().encode(g));
      }
      function b(g) {
        return new TextDecoder().decode(g);
      }
      function w(g) {
        return typeof g == "string" && (g = R(g)), a(g), g;
      }
      function x(g) {
        return typeof g == "string" && (g = R(g)), a(g), g;
      }
      function H(...g) {
        let I = 0;
        for (let K = 0; K < g.length; K++) {
          const W = g[K];
          a(W), I += W.length;
        }
        const N = new Uint8Array(I);
        for (let K = 0, W = 0; K < g.length; K++) {
          const se = g[K];
          N.set(se, W), W += se.length;
        }
        return N;
      }
      function T(g, I) {
        if (I !== void 0 && {}.toString.call(I) !== "[object Object]") throw new Error("options should be object or undefined");
        return Object.assign(g, I);
      }
      class D {
      }
      e.Hash = D;
      function M(g) {
        const I = (K) => g().update(w(K)).digest(), N = g();
        return I.outputLen = N.outputLen, I.blockLen = N.blockLen, I.create = () => g(), I;
      }
      function X(g) {
        const I = (K, W) => g(W).update(w(K)).digest(), N = g({});
        return I.outputLen = N.outputLen, I.blockLen = N.blockLen, I.create = (K) => g(K), I;
      }
      function Y(g) {
        const I = (K, W) => g(W).update(w(K)).digest(), N = g({});
        return I.outputLen = N.outputLen, I.blockLen = N.blockLen, I.create = (K) => g(K), I;
      }
      e.wrapConstructor = M, e.wrapConstructorWithOpts = X, e.wrapXOFConstructorWithOpts = Y;
      function we(g = 32) {
        if (r.crypto && typeof r.crypto.getRandomValues == "function") return r.crypto.getRandomValues(new Uint8Array(g));
        if (r.crypto && typeof r.crypto.randomBytes == "function") return Uint8Array.from(r.crypto.randomBytes(g));
        throw new Error("crypto.getRandomValues must be defined");
      }
    })(yo)), yo;
  }
  var Qa;
  function Cd() {
    if (Qa) return he;
    Qa = 1, Object.defineProperty(he, "__esModule", {
      value: true
    }), he.SHA512_IV = he.SHA384_IV = he.SHA224_IV = he.SHA256_IV = he.HashMD = void 0, he.setBigUint64 = r, he.Chi = t, he.Maj = o;
    const e = rt();
    function r(n, i, s, u) {
      if (typeof n.setBigUint64 == "function") return n.setBigUint64(i, s, u);
      const c = BigInt(32), d = BigInt(4294967295), l = Number(s >> c & d), f = Number(s & d), p = u ? 4 : 0, h = u ? 0 : 4;
      n.setUint32(i + p, l, u), n.setUint32(i + h, f, u);
    }
    function t(n, i, s) {
      return n & i ^ ~n & s;
    }
    function o(n, i, s) {
      return n & i ^ n & s ^ i & s;
    }
    class a extends e.Hash {
      constructor(i, s, u, c) {
        super(), this.finished = false, this.length = 0, this.pos = 0, this.destroyed = false, this.blockLen = i, this.outputLen = s, this.padOffset = u, this.isLE = c, this.buffer = new Uint8Array(i), this.view = (0, e.createView)(this.buffer);
      }
      update(i) {
        (0, e.aexists)(this), i = (0, e.toBytes)(i), (0, e.abytes)(i);
        const { view: s, buffer: u, blockLen: c } = this, d = i.length;
        for (let l = 0; l < d; ) {
          const f = Math.min(c - this.pos, d - l);
          if (f === c) {
            const p = (0, e.createView)(i);
            for (; c <= d - l; l += c) this.process(p, l);
            continue;
          }
          u.set(i.subarray(l, l + f), this.pos), this.pos += f, l += f, this.pos === c && (this.process(s, 0), this.pos = 0);
        }
        return this.length += i.length, this.roundClean(), this;
      }
      digestInto(i) {
        (0, e.aexists)(this), (0, e.aoutput)(i, this), this.finished = true;
        const { buffer: s, view: u, blockLen: c, isLE: d } = this;
        let { pos: l } = this;
        s[l++] = 128, (0, e.clean)(this.buffer.subarray(l)), this.padOffset > c - l && (this.process(u, 0), l = 0);
        for (let v = l; v < c; v++) s[v] = 0;
        r(u, c - 8, BigInt(this.length * 8), d), this.process(u, 0);
        const f = (0, e.createView)(i), p = this.outputLen;
        if (p % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
        const h = p / 4, m = this.get();
        if (h > m.length) throw new Error("_sha2: outputLen bigger than state");
        for (let v = 0; v < h; v++) f.setUint32(4 * v, m[v], d);
      }
      digest() {
        const { buffer: i, outputLen: s } = this;
        this.digestInto(i);
        const u = i.slice(0, s);
        return this.destroy(), u;
      }
      _cloneInto(i) {
        i || (i = new this.constructor()), i.set(...this.get());
        const { blockLen: s, buffer: u, length: c, finished: d, destroyed: l, pos: f } = this;
        return i.destroyed = l, i.finished = d, i.length = c, i.pos = f, c % s && i.buffer.set(u), i;
      }
      clone() {
        return this._cloneInto();
      }
    }
    return he.HashMD = a, he.SHA256_IV = Uint32Array.from([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]), he.SHA224_IV = Uint32Array.from([
      3238371032,
      914150663,
      812702999,
      4144912697,
      4290775857,
      1750603025,
      1694076839,
      3204075428
    ]), he.SHA384_IV = Uint32Array.from([
      3418070365,
      3238371032,
      1654270250,
      914150663,
      2438529370,
      812702999,
      355462360,
      4144912697,
      1731405415,
      4290775857,
      2394180231,
      1750603025,
      3675008525,
      1694076839,
      1203062813,
      3204075428
    ]), he.SHA512_IV = Uint32Array.from([
      1779033703,
      4089235720,
      3144134277,
      2227873595,
      1013904242,
      4271175723,
      2773480762,
      1595750129,
      1359893119,
      2917565137,
      2600822924,
      725511199,
      528734635,
      4215389547,
      1541459225,
      327033209
    ]), he;
  }
  var C = {}, Za;
  function Rd() {
    if (Za) return C;
    Za = 1, Object.defineProperty(C, "__esModule", {
      value: true
    }), C.toBig = C.shrSL = C.shrSH = C.rotrSL = C.rotrSH = C.rotrBL = C.rotrBH = C.rotr32L = C.rotr32H = C.rotlSL = C.rotlSH = C.rotlBL = C.rotlBH = C.add5L = C.add5H = C.add4L = C.add4H = C.add3L = C.add3H = void 0, C.add = E, C.fromBig = t, C.split = o;
    const e = BigInt(2 ** 32 - 1), r = BigInt(32);
    function t(b, w = false) {
      return w ? {
        h: Number(b & e),
        l: Number(b >> r & e)
      } : {
        h: Number(b >> r & e) | 0,
        l: Number(b & e) | 0
      };
    }
    function o(b, w = false) {
      const x = b.length;
      let H = new Uint32Array(x), T = new Uint32Array(x);
      for (let D = 0; D < x; D++) {
        const { h: M, l: X } = t(b[D], w);
        [H[D], T[D]] = [
          M,
          X
        ];
      }
      return [
        H,
        T
      ];
    }
    const a = (b, w) => BigInt(b >>> 0) << r | BigInt(w >>> 0);
    C.toBig = a;
    const n = (b, w, x) => b >>> x;
    C.shrSH = n;
    const i = (b, w, x) => b << 32 - x | w >>> x;
    C.shrSL = i;
    const s = (b, w, x) => b >>> x | w << 32 - x;
    C.rotrSH = s;
    const u = (b, w, x) => b << 32 - x | w >>> x;
    C.rotrSL = u;
    const c = (b, w, x) => b << 64 - x | w >>> x - 32;
    C.rotrBH = c;
    const d = (b, w, x) => b >>> x - 32 | w << 64 - x;
    C.rotrBL = d;
    const l = (b, w) => w;
    C.rotr32H = l;
    const f = (b, w) => b;
    C.rotr32L = f;
    const p = (b, w, x) => b << x | w >>> 32 - x;
    C.rotlSH = p;
    const h = (b, w, x) => w << x | b >>> 32 - x;
    C.rotlSL = h;
    const m = (b, w, x) => w << x - 32 | b >>> 64 - x;
    C.rotlBH = m;
    const v = (b, w, x) => b << x - 32 | w >>> 64 - x;
    C.rotlBL = v;
    function E(b, w, x, H) {
      const T = (w >>> 0) + (H >>> 0);
      return {
        h: b + x + (T / 2 ** 32 | 0) | 0,
        l: T | 0
      };
    }
    const A = (b, w, x) => (b >>> 0) + (w >>> 0) + (x >>> 0);
    C.add3L = A;
    const y = (b, w, x, H) => w + x + H + (b / 2 ** 32 | 0) | 0;
    C.add3H = y;
    const k = (b, w, x, H) => (b >>> 0) + (w >>> 0) + (x >>> 0) + (H >>> 0);
    C.add4L = k;
    const _ = (b, w, x, H, T) => w + x + H + T + (b / 2 ** 32 | 0) | 0;
    C.add4H = _;
    const S = (b, w, x, H, T) => (b >>> 0) + (w >>> 0) + (x >>> 0) + (H >>> 0) + (T >>> 0);
    C.add5L = S;
    const j = (b, w, x, H, T, D) => w + x + H + T + D + (b / 2 ** 32 | 0) | 0;
    C.add5H = j;
    const R = {
      fromBig: t,
      split: o,
      toBig: a,
      shrSH: n,
      shrSL: i,
      rotrSH: s,
      rotrSL: u,
      rotrBH: c,
      rotrBL: d,
      rotr32H: l,
      rotr32L: f,
      rotlSH: p,
      rotlSL: h,
      rotlBH: m,
      rotlBL: v,
      add: E,
      add3L: A,
      add3H: y,
      add4L: k,
      add4H: _,
      add5H: j,
      add5L: S
    };
    return C.default = R, C;
  }
  var en;
  function Ri() {
    if (en) return G;
    en = 1, Object.defineProperty(G, "__esModule", {
      value: true
    }), G.sha512_224 = G.sha512_256 = G.sha384 = G.sha512 = G.sha224 = G.sha256 = G.SHA512_256 = G.SHA512_224 = G.SHA384 = G.SHA512 = G.SHA224 = G.SHA256 = void 0;
    const e = Cd(), r = Rd(), t = rt(), o = Uint32Array.from([
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ]), a = new Uint32Array(64);
    class n extends e.HashMD {
      constructor(y = 32) {
        super(64, y, 8, false), this.A = e.SHA256_IV[0] | 0, this.B = e.SHA256_IV[1] | 0, this.C = e.SHA256_IV[2] | 0, this.D = e.SHA256_IV[3] | 0, this.E = e.SHA256_IV[4] | 0, this.F = e.SHA256_IV[5] | 0, this.G = e.SHA256_IV[6] | 0, this.H = e.SHA256_IV[7] | 0;
      }
      get() {
        const { A: y, B: k, C: _, D: S, E: j, F: R, G: b, H: w } = this;
        return [
          y,
          k,
          _,
          S,
          j,
          R,
          b,
          w
        ];
      }
      set(y, k, _, S, j, R, b, w) {
        this.A = y | 0, this.B = k | 0, this.C = _ | 0, this.D = S | 0, this.E = j | 0, this.F = R | 0, this.G = b | 0, this.H = w | 0;
      }
      process(y, k) {
        for (let T = 0; T < 16; T++, k += 4) a[T] = y.getUint32(k, false);
        for (let T = 16; T < 64; T++) {
          const D = a[T - 15], M = a[T - 2], X = (0, t.rotr)(D, 7) ^ (0, t.rotr)(D, 18) ^ D >>> 3, Y = (0, t.rotr)(M, 17) ^ (0, t.rotr)(M, 19) ^ M >>> 10;
          a[T] = Y + a[T - 7] + X + a[T - 16] | 0;
        }
        let { A: _, B: S, C: j, D: R, E: b, F: w, G: x, H } = this;
        for (let T = 0; T < 64; T++) {
          const D = (0, t.rotr)(b, 6) ^ (0, t.rotr)(b, 11) ^ (0, t.rotr)(b, 25), M = H + D + (0, e.Chi)(b, w, x) + o[T] + a[T] | 0, Y = ((0, t.rotr)(_, 2) ^ (0, t.rotr)(_, 13) ^ (0, t.rotr)(_, 22)) + (0, e.Maj)(_, S, j) | 0;
          H = x, x = w, w = b, b = R + M | 0, R = j, j = S, S = _, _ = M + Y | 0;
        }
        _ = _ + this.A | 0, S = S + this.B | 0, j = j + this.C | 0, R = R + this.D | 0, b = b + this.E | 0, w = w + this.F | 0, x = x + this.G | 0, H = H + this.H | 0, this.set(_, S, j, R, b, w, x, H);
      }
      roundClean() {
        (0, t.clean)(a);
      }
      destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0), (0, t.clean)(this.buffer);
      }
    }
    G.SHA256 = n;
    class i extends n {
      constructor() {
        super(28), this.A = e.SHA224_IV[0] | 0, this.B = e.SHA224_IV[1] | 0, this.C = e.SHA224_IV[2] | 0, this.D = e.SHA224_IV[3] | 0, this.E = e.SHA224_IV[4] | 0, this.F = e.SHA224_IV[5] | 0, this.G = e.SHA224_IV[6] | 0, this.H = e.SHA224_IV[7] | 0;
      }
    }
    G.SHA224 = i;
    const s = r.split([
      "0x428a2f98d728ae22",
      "0x7137449123ef65cd",
      "0xb5c0fbcfec4d3b2f",
      "0xe9b5dba58189dbbc",
      "0x3956c25bf348b538",
      "0x59f111f1b605d019",
      "0x923f82a4af194f9b",
      "0xab1c5ed5da6d8118",
      "0xd807aa98a3030242",
      "0x12835b0145706fbe",
      "0x243185be4ee4b28c",
      "0x550c7dc3d5ffb4e2",
      "0x72be5d74f27b896f",
      "0x80deb1fe3b1696b1",
      "0x9bdc06a725c71235",
      "0xc19bf174cf692694",
      "0xe49b69c19ef14ad2",
      "0xefbe4786384f25e3",
      "0x0fc19dc68b8cd5b5",
      "0x240ca1cc77ac9c65",
      "0x2de92c6f592b0275",
      "0x4a7484aa6ea6e483",
      "0x5cb0a9dcbd41fbd4",
      "0x76f988da831153b5",
      "0x983e5152ee66dfab",
      "0xa831c66d2db43210",
      "0xb00327c898fb213f",
      "0xbf597fc7beef0ee4",
      "0xc6e00bf33da88fc2",
      "0xd5a79147930aa725",
      "0x06ca6351e003826f",
      "0x142929670a0e6e70",
      "0x27b70a8546d22ffc",
      "0x2e1b21385c26c926",
      "0x4d2c6dfc5ac42aed",
      "0x53380d139d95b3df",
      "0x650a73548baf63de",
      "0x766a0abb3c77b2a8",
      "0x81c2c92e47edaee6",
      "0x92722c851482353b",
      "0xa2bfe8a14cf10364",
      "0xa81a664bbc423001",
      "0xc24b8b70d0f89791",
      "0xc76c51a30654be30",
      "0xd192e819d6ef5218",
      "0xd69906245565a910",
      "0xf40e35855771202a",
      "0x106aa07032bbd1b8",
      "0x19a4c116b8d2d0c8",
      "0x1e376c085141ab53",
      "0x2748774cdf8eeb99",
      "0x34b0bcb5e19b48a8",
      "0x391c0cb3c5c95a63",
      "0x4ed8aa4ae3418acb",
      "0x5b9cca4f7763e373",
      "0x682e6ff3d6b2b8a3",
      "0x748f82ee5defb2fc",
      "0x78a5636f43172f60",
      "0x84c87814a1f0ab72",
      "0x8cc702081a6439ec",
      "0x90befffa23631e28",
      "0xa4506cebde82bde9",
      "0xbef9a3f7b2c67915",
      "0xc67178f2e372532b",
      "0xca273eceea26619c",
      "0xd186b8c721c0c207",
      "0xeada7dd6cde0eb1e",
      "0xf57d4f7fee6ed178",
      "0x06f067aa72176fba",
      "0x0a637dc5a2c898a6",
      "0x113f9804bef90dae",
      "0x1b710b35131c471b",
      "0x28db77f523047d84",
      "0x32caab7b40c72493",
      "0x3c9ebe0a15c9bebc",
      "0x431d67c49c100d4c",
      "0x4cc5d4becb3e42b6",
      "0x597f299cfc657e2a",
      "0x5fcb6fab3ad6faec",
      "0x6c44198c4a475817"
    ].map((A) => BigInt(A))), u = s[0], c = s[1], d = new Uint32Array(80), l = new Uint32Array(80);
    class f extends e.HashMD {
      constructor(y = 64) {
        super(128, y, 16, false), this.Ah = e.SHA512_IV[0] | 0, this.Al = e.SHA512_IV[1] | 0, this.Bh = e.SHA512_IV[2] | 0, this.Bl = e.SHA512_IV[3] | 0, this.Ch = e.SHA512_IV[4] | 0, this.Cl = e.SHA512_IV[5] | 0, this.Dh = e.SHA512_IV[6] | 0, this.Dl = e.SHA512_IV[7] | 0, this.Eh = e.SHA512_IV[8] | 0, this.El = e.SHA512_IV[9] | 0, this.Fh = e.SHA512_IV[10] | 0, this.Fl = e.SHA512_IV[11] | 0, this.Gh = e.SHA512_IV[12] | 0, this.Gl = e.SHA512_IV[13] | 0, this.Hh = e.SHA512_IV[14] | 0, this.Hl = e.SHA512_IV[15] | 0;
      }
      get() {
        const { Ah: y, Al: k, Bh: _, Bl: S, Ch: j, Cl: R, Dh: b, Dl: w, Eh: x, El: H, Fh: T, Fl: D, Gh: M, Gl: X, Hh: Y, Hl: we } = this;
        return [
          y,
          k,
          _,
          S,
          j,
          R,
          b,
          w,
          x,
          H,
          T,
          D,
          M,
          X,
          Y,
          we
        ];
      }
      set(y, k, _, S, j, R, b, w, x, H, T, D, M, X, Y, we) {
        this.Ah = y | 0, this.Al = k | 0, this.Bh = _ | 0, this.Bl = S | 0, this.Ch = j | 0, this.Cl = R | 0, this.Dh = b | 0, this.Dl = w | 0, this.Eh = x | 0, this.El = H | 0, this.Fh = T | 0, this.Fl = D | 0, this.Gh = M | 0, this.Gl = X | 0, this.Hh = Y | 0, this.Hl = we | 0;
      }
      process(y, k) {
        for (let N = 0; N < 16; N++, k += 4) d[N] = y.getUint32(k), l[N] = y.getUint32(k += 4);
        for (let N = 16; N < 80; N++) {
          const K = d[N - 15] | 0, W = l[N - 15] | 0, se = r.rotrSH(K, W, 1) ^ r.rotrSH(K, W, 8) ^ r.shrSH(K, W, 7), Er = r.rotrSL(K, W, 1) ^ r.rotrSL(K, W, 8) ^ r.shrSL(K, W, 7), Ae = d[N - 2] | 0, Oe = l[N - 2] | 0, at = r.rotrSH(Ae, Oe, 19) ^ r.rotrBH(Ae, Oe, 61) ^ r.shrSH(Ae, Oe, 6), ro = r.rotrSL(Ae, Oe, 19) ^ r.rotrBL(Ae, Oe, 61) ^ r.shrSL(Ae, Oe, 6), nt = r.add4L(Er, ro, l[N - 7], l[N - 16]), to = r.add4H(nt, se, at, d[N - 7], d[N - 16]);
          d[N] = to | 0, l[N] = nt | 0;
        }
        let { Ah: _, Al: S, Bh: j, Bl: R, Ch: b, Cl: w, Dh: x, Dl: H, Eh: T, El: D, Fh: M, Fl: X, Gh: Y, Gl: we, Hh: g, Hl: I } = this;
        for (let N = 0; N < 80; N++) {
          const K = r.rotrSH(T, D, 14) ^ r.rotrSH(T, D, 18) ^ r.rotrBH(T, D, 41), W = r.rotrSL(T, D, 14) ^ r.rotrSL(T, D, 18) ^ r.rotrBL(T, D, 41), se = T & M ^ ~T & Y, Er = D & X ^ ~D & we, Ae = r.add5L(I, W, Er, c[N], l[N]), Oe = r.add5H(Ae, g, K, se, u[N], d[N]), at = Ae | 0, ro = r.rotrSH(_, S, 28) ^ r.rotrBH(_, S, 34) ^ r.rotrBH(_, S, 39), nt = r.rotrSL(_, S, 28) ^ r.rotrBL(_, S, 34) ^ r.rotrBL(_, S, 39), to = _ & j ^ _ & b ^ j & b, ns = S & R ^ S & w ^ R & w;
          g = Y | 0, I = we | 0, Y = M | 0, we = X | 0, M = T | 0, X = D | 0, { h: T, l: D } = r.add(x | 0, H | 0, Oe | 0, at | 0), x = b | 0, H = w | 0, b = j | 0, w = R | 0, j = _ | 0, R = S | 0;
          const na = r.add3L(at, nt, ns);
          _ = r.add3H(na, Oe, ro, to), S = na | 0;
        }
        ({ h: _, l: S } = r.add(this.Ah | 0, this.Al | 0, _ | 0, S | 0)), { h: j, l: R } = r.add(this.Bh | 0, this.Bl | 0, j | 0, R | 0), { h: b, l: w } = r.add(this.Ch | 0, this.Cl | 0, b | 0, w | 0), { h: x, l: H } = r.add(this.Dh | 0, this.Dl | 0, x | 0, H | 0), { h: T, l: D } = r.add(this.Eh | 0, this.El | 0, T | 0, D | 0), { h: M, l: X } = r.add(this.Fh | 0, this.Fl | 0, M | 0, X | 0), { h: Y, l: we } = r.add(this.Gh | 0, this.Gl | 0, Y | 0, we | 0), { h: g, l: I } = r.add(this.Hh | 0, this.Hl | 0, g | 0, I | 0), this.set(_, S, j, R, b, w, x, H, T, D, M, X, Y, we, g, I);
      }
      roundClean() {
        (0, t.clean)(d, l);
      }
      destroy() {
        (0, t.clean)(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      }
    }
    G.SHA512 = f;
    class p extends f {
      constructor() {
        super(48), this.Ah = e.SHA384_IV[0] | 0, this.Al = e.SHA384_IV[1] | 0, this.Bh = e.SHA384_IV[2] | 0, this.Bl = e.SHA384_IV[3] | 0, this.Ch = e.SHA384_IV[4] | 0, this.Cl = e.SHA384_IV[5] | 0, this.Dh = e.SHA384_IV[6] | 0, this.Dl = e.SHA384_IV[7] | 0, this.Eh = e.SHA384_IV[8] | 0, this.El = e.SHA384_IV[9] | 0, this.Fh = e.SHA384_IV[10] | 0, this.Fl = e.SHA384_IV[11] | 0, this.Gh = e.SHA384_IV[12] | 0, this.Gl = e.SHA384_IV[13] | 0, this.Hh = e.SHA384_IV[14] | 0, this.Hl = e.SHA384_IV[15] | 0;
      }
    }
    G.SHA384 = p;
    const h = Uint32Array.from([
      2352822216,
      424955298,
      1944164710,
      2312950998,
      502970286,
      855612546,
      1738396948,
      1479516111,
      258812777,
      2077511080,
      2011393907,
      79989058,
      1067287976,
      1780299464,
      286451373,
      2446758561
    ]), m = Uint32Array.from([
      573645204,
      4230739756,
      2673172387,
      3360449730,
      596883563,
      1867755857,
      2520282905,
      1497426621,
      2519219938,
      2827943907,
      3193839141,
      1401305490,
      721525244,
      746961066,
      246885852,
      2177182882
    ]);
    class v extends f {
      constructor() {
        super(28), this.Ah = h[0] | 0, this.Al = h[1] | 0, this.Bh = h[2] | 0, this.Bl = h[3] | 0, this.Ch = h[4] | 0, this.Cl = h[5] | 0, this.Dh = h[6] | 0, this.Dl = h[7] | 0, this.Eh = h[8] | 0, this.El = h[9] | 0, this.Fh = h[10] | 0, this.Fl = h[11] | 0, this.Gh = h[12] | 0, this.Gl = h[13] | 0, this.Hh = h[14] | 0, this.Hl = h[15] | 0;
      }
    }
    G.SHA512_224 = v;
    class E extends f {
      constructor() {
        super(32), this.Ah = m[0] | 0, this.Al = m[1] | 0, this.Bh = m[2] | 0, this.Bl = m[3] | 0, this.Ch = m[4] | 0, this.Cl = m[5] | 0, this.Dh = m[6] | 0, this.Dl = m[7] | 0, this.Eh = m[8] | 0, this.El = m[9] | 0, this.Fh = m[10] | 0, this.Fl = m[11] | 0, this.Gh = m[12] | 0, this.Gl = m[13] | 0, this.Hh = m[14] | 0, this.Hl = m[15] | 0;
      }
    }
    return G.SHA512_256 = E, G.sha256 = (0, t.createHasher)(() => new n()), G.sha224 = (0, t.createHasher)(() => new i()), G.sha512 = (0, t.createHasher)(() => new f()), G.sha384 = (0, t.createHasher)(() => new p()), G.sha512_256 = (0, t.createHasher)(() => new E()), G.sha512_224 = (0, t.createHasher)(() => new v()), G;
  }
  var rn;
  function Ld() {
    if (rn) return je;
    rn = 1, Object.defineProperty(je, "__esModule", {
      value: true
    }), je.sha224 = je.SHA224 = je.sha256 = je.SHA256 = void 0;
    const e = Ri();
    return je.SHA256 = e.SHA256, je.sha256 = e.sha256, je.SHA224 = e.SHA224, je.sha224 = e.sha224, je;
  }
  var te = {}, tn;
  function Bd() {
    if (tn) return te;
    tn = 1, Object.defineProperty(te, "__esModule", {
      value: true
    }), te.sha512_256 = te.SHA512_256 = te.sha512_224 = te.SHA512_224 = te.sha384 = te.SHA384 = te.sha512 = te.SHA512 = void 0;
    const e = Ri();
    return te.SHA512 = e.SHA512, te.sha512 = e.sha512, te.SHA384 = e.SHA384, te.sha384 = e.sha384, te.SHA512_224 = e.SHA512_224, te.sha512_224 = e.sha512_224, te.SHA512_256 = e.SHA512_256, te.sha512_256 = e.sha512_256, te;
  }
  var Kr = {}, vo = {}, on;
  function Dd() {
    return on || (on = 1, (function(e) {
      Object.defineProperty(e, "__esModule", {
        value: true
      }), e.hmac = e.HMAC = void 0;
      const r = rt();
      class t extends r.Hash {
        constructor(n, i) {
          super(), this.finished = false, this.destroyed = false, (0, r.ahash)(n);
          const s = (0, r.toBytes)(i);
          if (this.iHash = n.create(), typeof this.iHash.update != "function") throw new Error("Expected instance of class which extends utils.Hash");
          this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
          const u = this.blockLen, c = new Uint8Array(u);
          c.set(s.length > u ? n.create().update(s).digest() : s);
          for (let d = 0; d < c.length; d++) c[d] ^= 54;
          this.iHash.update(c), this.oHash = n.create();
          for (let d = 0; d < c.length; d++) c[d] ^= 106;
          this.oHash.update(c), (0, r.clean)(c);
        }
        update(n) {
          return (0, r.aexists)(this), this.iHash.update(n), this;
        }
        digestInto(n) {
          (0, r.aexists)(this), (0, r.abytes)(n, this.outputLen), this.finished = true, this.iHash.digestInto(n), this.oHash.update(n), this.oHash.digestInto(n), this.destroy();
        }
        digest() {
          const n = new Uint8Array(this.oHash.outputLen);
          return this.digestInto(n), n;
        }
        _cloneInto(n) {
          n || (n = Object.create(Object.getPrototypeOf(this), {}));
          const { oHash: i, iHash: s, finished: u, destroyed: c, blockLen: d, outputLen: l } = this;
          return n = n, n.finished = u, n.destroyed = c, n.blockLen = d, n.outputLen = l, n.oHash = i._cloneInto(n.oHash), n.iHash = s._cloneInto(n.iHash), n;
        }
        clone() {
          return this._cloneInto();
        }
        destroy() {
          this.destroyed = true, this.oHash.destroy(), this.iHash.destroy();
        }
      }
      e.HMAC = t;
      const o = (a, n, i) => new t(a, n).update(i).digest();
      e.hmac = o, e.hmac.create = (a, n) => new t(a, n);
    })(vo)), vo;
  }
  var an;
  function Fd() {
    if (an) return Kr;
    an = 1, Object.defineProperty(Kr, "__esModule", {
      value: true
    }), Kr.pbkdf2 = a, Kr.pbkdf2Async = n;
    const e = Dd(), r = rt();
    function t(i, s, u, c) {
      (0, r.ahash)(i);
      const d = (0, r.checkOpts)({
        dkLen: 32,
        asyncTick: 10
      }, c), { c: l, dkLen: f, asyncTick: p } = d;
      if ((0, r.anumber)(l), (0, r.anumber)(f), (0, r.anumber)(p), l < 1) throw new Error("iterations (c) should be >= 1");
      const h = (0, r.kdfInputToBytes)(s), m = (0, r.kdfInputToBytes)(u), v = new Uint8Array(f), E = e.hmac.create(i, h), A = E._cloneInto().update(m);
      return {
        c: l,
        dkLen: f,
        asyncTick: p,
        DK: v,
        PRF: E,
        PRFSalt: A
      };
    }
    function o(i, s, u, c, d) {
      return i.destroy(), s.destroy(), c && c.destroy(), (0, r.clean)(d), u;
    }
    function a(i, s, u, c) {
      const { c: d, dkLen: l, DK: f, PRF: p, PRFSalt: h } = t(i, s, u, c);
      let m;
      const v = new Uint8Array(4), E = (0, r.createView)(v), A = new Uint8Array(p.outputLen);
      for (let y = 1, k = 0; k < l; y++, k += p.outputLen) {
        const _ = f.subarray(k, k + p.outputLen);
        E.setInt32(0, y, false), (m = h._cloneInto(m)).update(v).digestInto(A), _.set(A.subarray(0, _.length));
        for (let S = 1; S < d; S++) {
          p._cloneInto(m).update(A).digestInto(A);
          for (let j = 0; j < _.length; j++) _[j] ^= A[j];
        }
      }
      return o(p, h, f, m, A);
    }
    async function n(i, s, u, c) {
      const { c: d, dkLen: l, asyncTick: f, DK: p, PRF: h, PRFSalt: m } = t(i, s, u, c);
      let v;
      const E = new Uint8Array(4), A = (0, r.createView)(E), y = new Uint8Array(h.outputLen);
      for (let k = 1, _ = 0; _ < l; k++, _ += h.outputLen) {
        const S = p.subarray(_, _ + h.outputLen);
        A.setInt32(0, k, false), (v = m._cloneInto(v)).update(E).digestInto(y), S.set(y.subarray(0, S.length)), await (0, r.asyncLoop)(d - 1, f, () => {
          h._cloneInto(v).update(y).digestInto(y);
          for (let j = 0; j < S.length; j++) S[j] ^= y[j];
        });
      }
      return o(h, m, p, v, y);
    }
    return Kr;
  }
  var be = {};
  const Kd = JSON.parse('["abdikace","abeceda","adresa","agrese","akce","aktovka","alej","alkohol","amputace","ananas","andulka","anekdota","anketa","antika","anulovat","archa","arogance","asfalt","asistent","aspirace","astma","astronom","atlas","atletika","atol","autobus","azyl","babka","bachor","bacil","baculka","badatel","bageta","bagr","bahno","bakterie","balada","baletka","balkon","balonek","balvan","balza","bambus","bankomat","barbar","baret","barman","baroko","barva","baterka","batoh","bavlna","bazalka","bazilika","bazuka","bedna","beran","beseda","bestie","beton","bezinka","bezmoc","beztak","bicykl","bidlo","biftek","bikiny","bilance","biograf","biolog","bitva","bizon","blahobyt","blatouch","blecha","bledule","blesk","blikat","blizna","blokovat","bloudit","blud","bobek","bobr","bodlina","bodnout","bohatost","bojkot","bojovat","bokorys","bolest","borec","borovice","bota","boubel","bouchat","bouda","boule","bourat","boxer","bradavka","brambora","branka","bratr","brepta","briketa","brko","brloh","bronz","broskev","brunetka","brusinka","brzda","brzy","bublina","bubnovat","buchta","buditel","budka","budova","bufet","bujarost","bukvice","buldok","bulva","bunda","bunkr","burza","butik","buvol","buzola","bydlet","bylina","bytovka","bzukot","capart","carevna","cedr","cedule","cejch","cejn","cela","celer","celkem","celnice","cenina","cennost","cenovka","centrum","cenzor","cestopis","cetka","chalupa","chapadlo","charita","chata","chechtat","chemie","chichot","chirurg","chlad","chleba","chlubit","chmel","chmura","chobot","chochol","chodba","cholera","chomout","chopit","choroba","chov","chrapot","chrlit","chrt","chrup","chtivost","chudina","chutnat","chvat","chvilka","chvost","chyba","chystat","chytit","cibule","cigareta","cihelna","cihla","cinkot","cirkus","cisterna","citace","citrus","cizinec","cizost","clona","cokoliv","couvat","ctitel","ctnost","cudnost","cuketa","cukr","cupot","cvaknout","cval","cvik","cvrkot","cyklista","daleko","dareba","datel","datum","dcera","debata","dechovka","decibel","deficit","deflace","dekl","dekret","demokrat","deprese","derby","deska","detektiv","dikobraz","diktovat","dioda","diplom","disk","displej","divadlo","divoch","dlaha","dlouho","dluhopis","dnes","dobro","dobytek","docent","dochutit","dodnes","dohled","dohoda","dohra","dojem","dojnice","doklad","dokola","doktor","dokument","dolar","doleva","dolina","doma","dominant","domluvit","domov","donutit","dopad","dopis","doplnit","doposud","doprovod","dopustit","dorazit","dorost","dort","dosah","doslov","dostatek","dosud","dosyta","dotaz","dotek","dotknout","doufat","doutnat","dovozce","dozadu","doznat","dozorce","drahota","drak","dramatik","dravec","draze","drdol","drobnost","drogerie","drozd","drsnost","drtit","drzost","duben","duchovno","dudek","duha","duhovka","dusit","dusno","dutost","dvojice","dvorec","dynamit","ekolog","ekonomie","elektron","elipsa","email","emise","emoce","empatie","epizoda","epocha","epopej","epos","esej","esence","eskorta","eskymo","etiketa","euforie","evoluce","exekuce","exkurze","expedice","exploze","export","extrakt","facka","fajfka","fakulta","fanatik","fantazie","farmacie","favorit","fazole","federace","fejeton","fenka","fialka","figurant","filozof","filtr","finance","finta","fixace","fjord","flanel","flirt","flotila","fond","fosfor","fotbal","fotka","foton","frakce","freska","fronta","fukar","funkce","fyzika","galeje","garant","genetika","geolog","gilotina","glazura","glejt","golem","golfista","gotika","graf","gramofon","granule","grep","gril","grog","groteska","guma","hadice","hadr","hala","halenka","hanba","hanopis","harfa","harpuna","havran","hebkost","hejkal","hejno","hejtman","hektar","helma","hematom","herec","herna","heslo","hezky","historik","hladovka","hlasivky","hlava","hledat","hlen","hlodavec","hloh","hloupost","hltat","hlubina","hluchota","hmat","hmota","hmyz","hnis","hnojivo","hnout","hoblina","hoboj","hoch","hodiny","hodlat","hodnota","hodovat","hojnost","hokej","holinka","holka","holub","homole","honitba","honorace","horal","horda","horizont","horko","horlivec","hormon","hornina","horoskop","horstvo","hospoda","hostina","hotovost","houba","houf","houpat","houska","hovor","hradba","hranice","hravost","hrazda","hrbolek","hrdina","hrdlo","hrdost","hrnek","hrobka","hromada","hrot","hrouda","hrozen","hrstka","hrubost","hryzat","hubenost","hubnout","hudba","hukot","humr","husita","hustota","hvozd","hybnost","hydrant","hygiena","hymna","hysterik","idylka","ihned","ikona","iluze","imunita","infekce","inflace","inkaso","inovace","inspekce","internet","invalida","investor","inzerce","ironie","jablko","jachta","jahoda","jakmile","jakost","jalovec","jantar","jarmark","jaro","jasan","jasno","jatka","javor","jazyk","jedinec","jedle","jednatel","jehlan","jekot","jelen","jelito","jemnost","jenom","jepice","jeseter","jevit","jezdec","jezero","jinak","jindy","jinoch","jiskra","jistota","jitrnice","jizva","jmenovat","jogurt","jurta","kabaret","kabel","kabinet","kachna","kadet","kadidlo","kahan","kajak","kajuta","kakao","kaktus","kalamita","kalhoty","kalibr","kalnost","kamera","kamkoliv","kamna","kanibal","kanoe","kantor","kapalina","kapela","kapitola","kapka","kaple","kapota","kapr","kapusta","kapybara","karamel","karotka","karton","kasa","katalog","katedra","kauce","kauza","kavalec","kazajka","kazeta","kazivost","kdekoliv","kdesi","kedluben","kemp","keramika","kino","klacek","kladivo","klam","klapot","klasika","klaun","klec","klenba","klepat","klesnout","klid","klima","klisna","klobouk","klokan","klopa","kloub","klubovna","klusat","kluzkost","kmen","kmitat","kmotr","kniha","knot","koalice","koberec","kobka","kobliha","kobyla","kocour","kohout","kojenec","kokos","koktejl","kolaps","koleda","kolize","kolo","komando","kometa","komik","komnata","komora","kompas","komunita","konat","koncept","kondice","konec","konfese","kongres","konina","konkurs","kontakt","konzerva","kopanec","kopie","kopnout","koprovka","korbel","korektor","kormidlo","koroptev","korpus","koruna","koryto","korzet","kosatec","kostka","kotel","kotleta","kotoul","koukat","koupelna","kousek","kouzlo","kovboj","koza","kozoroh","krabice","krach","krajina","kralovat","krasopis","kravata","kredit","krejcar","kresba","kreveta","kriket","kritik","krize","krkavec","krmelec","krmivo","krocan","krok","kronika","kropit","kroupa","krovka","krtek","kruhadlo","krupice","krutost","krvinka","krychle","krypta","krystal","kryt","kudlanka","kufr","kujnost","kukla","kulajda","kulich","kulka","kulomet","kultura","kuna","kupodivu","kurt","kurzor","kutil","kvalita","kvasinka","kvestor","kynolog","kyselina","kytara","kytice","kytka","kytovec","kyvadlo","labrador","lachtan","ladnost","laik","lakomec","lamela","lampa","lanovka","lasice","laso","lastura","latinka","lavina","lebka","leckdy","leden","lednice","ledovka","ledvina","legenda","legie","legrace","lehce","lehkost","lehnout","lektvar","lenochod","lentilka","lepenka","lepidlo","letadlo","letec","letmo","letokruh","levhart","levitace","levobok","libra","lichotka","lidojed","lidskost","lihovina","lijavec","lilek","limetka","linie","linka","linoleum","listopad","litina","litovat","lobista","lodivod","logika","logoped","lokalita","loket","lomcovat","lopata","lopuch","lord","losos","lotr","loudal","louh","louka","louskat","lovec","lstivost","lucerna","lucifer","lump","lusk","lustrace","lvice","lyra","lyrika","lysina","madam","madlo","magistr","mahagon","majetek","majitel","majorita","makak","makovice","makrela","malba","malina","malovat","malvice","maminka","mandle","manko","marnost","masakr","maskot","masopust","matice","matrika","maturita","mazanec","mazivo","mazlit","mazurka","mdloba","mechanik","meditace","medovina","melasa","meloun","mentolka","metla","metoda","metr","mezera","migrace","mihnout","mihule","mikina","mikrofon","milenec","milimetr","milost","mimika","mincovna","minibar","minomet","minulost","miska","mistr","mixovat","mladost","mlha","mlhovina","mlok","mlsat","mluvit","mnich","mnohem","mobil","mocnost","modelka","modlitba","mohyla","mokro","molekula","momentka","monarcha","monokl","monstrum","montovat","monzun","mosaz","moskyt","most","motivace","motorka","motyka","moucha","moudrost","mozaika","mozek","mozol","mramor","mravenec","mrkev","mrtvola","mrzet","mrzutost","mstitel","mudrc","muflon","mulat","mumie","munice","muset","mutace","muzeum","muzikant","myslivec","mzda","nabourat","nachytat","nadace","nadbytek","nadhoz","nadobro","nadpis","nahlas","nahnat","nahodile","nahradit","naivita","najednou","najisto","najmout","naklonit","nakonec","nakrmit","nalevo","namazat","namluvit","nanometr","naoko","naopak","naostro","napadat","napevno","naplnit","napnout","naposled","naprosto","narodit","naruby","narychlo","nasadit","nasekat","naslepo","nastat","natolik","navenek","navrch","navzdory","nazvat","nebe","nechat","necky","nedaleko","nedbat","neduh","negace","nehet","nehoda","nejen","nejprve","neklid","nelibost","nemilost","nemoc","neochota","neonka","nepokoj","nerost","nerv","nesmysl","nesoulad","netvor","neuron","nevina","nezvykle","nicota","nijak","nikam","nikdy","nikl","nikterak","nitro","nocleh","nohavice","nominace","nora","norek","nositel","nosnost","nouze","noviny","novota","nozdra","nuda","nudle","nuget","nutit","nutnost","nutrie","nymfa","obal","obarvit","obava","obdiv","obec","obehnat","obejmout","obezita","obhajoba","obilnice","objasnit","objekt","obklopit","oblast","oblek","obliba","obloha","obluda","obnos","obohatit","obojek","obout","obrazec","obrna","obruba","obrys","obsah","obsluha","obstarat","obuv","obvaz","obvinit","obvod","obvykle","obyvatel","obzor","ocas","ocel","ocenit","ochladit","ochota","ochrana","ocitnout","odboj","odbyt","odchod","odcizit","odebrat","odeslat","odevzdat","odezva","odhadce","odhodit","odjet","odjinud","odkaz","odkoupit","odliv","odluka","odmlka","odolnost","odpad","odpis","odplout","odpor","odpustit","odpykat","odrazka","odsoudit","odstup","odsun","odtok","odtud","odvaha","odveta","odvolat","odvracet","odznak","ofina","ofsajd","ohlas","ohnisko","ohrada","ohrozit","ohryzek","okap","okenice","oklika","okno","okouzlit","okovy","okrasa","okres","okrsek","okruh","okupant","okurka","okusit","olejnina","olizovat","omak","omeleta","omezit","omladina","omlouvat","omluva","omyl","onehdy","opakovat","opasek","operace","opice","opilost","opisovat","opora","opozice","opravdu","oproti","orbital","orchestr","orgie","orlice","orloj","ortel","osada","oschnout","osika","osivo","oslava","oslepit","oslnit","oslovit","osnova","osoba","osolit","ospalec","osten","ostraha","ostuda","ostych","osvojit","oteplit","otisk","otop","otrhat","otrlost","otrok","otruby","otvor","ovanout","ovar","oves","ovlivnit","ovoce","oxid","ozdoba","pachatel","pacient","padouch","pahorek","pakt","palanda","palec","palivo","paluba","pamflet","pamlsek","panenka","panika","panna","panovat","panstvo","pantofle","paprika","parketa","parodie","parta","paruka","paryba","paseka","pasivita","pastelka","patent","patrona","pavouk","pazneht","pazourek","pecka","pedagog","pejsek","peklo","peloton","penalta","pendrek","penze","periskop","pero","pestrost","petarda","petice","petrolej","pevnina","pexeso","pianista","piha","pijavice","pikle","piknik","pilina","pilnost","pilulka","pinzeta","pipeta","pisatel","pistole","pitevna","pivnice","pivovar","placenta","plakat","plamen","planeta","plastika","platit","plavidlo","plaz","plech","plemeno","plenta","ples","pletivo","plevel","plivat","plnit","plno","plocha","plodina","plomba","plout","pluk","plyn","pobavit","pobyt","pochod","pocit","poctivec","podat","podcenit","podepsat","podhled","podivit","podklad","podmanit","podnik","podoba","podpora","podraz","podstata","podvod","podzim","poezie","pohanka","pohnutka","pohovor","pohroma","pohyb","pointa","pojistka","pojmout","pokazit","pokles","pokoj","pokrok","pokuta","pokyn","poledne","polibek","polknout","poloha","polynom","pomalu","pominout","pomlka","pomoc","pomsta","pomyslet","ponechat","ponorka","ponurost","popadat","popel","popisek","poplach","poprosit","popsat","popud","poradce","porce","porod","porucha","poryv","posadit","posed","posila","poskok","poslanec","posoudit","pospolu","postava","posudek","posyp","potah","potkan","potlesk","potomek","potrava","potupa","potvora","poukaz","pouto","pouzdro","povaha","povidla","povlak","povoz","povrch","povstat","povyk","povzdech","pozdrav","pozemek","poznatek","pozor","pozvat","pracovat","prahory","praktika","prales","praotec","praporek","prase","pravda","princip","prkno","probudit","procento","prodej","profese","prohra","projekt","prolomit","promile","pronikat","propad","prorok","prosba","proton","proutek","provaz","prskavka","prsten","prudkost","prut","prvek","prvohory","psanec","psovod","pstruh","ptactvo","puberta","puch","pudl","pukavec","puklina","pukrle","pult","pumpa","punc","pupen","pusa","pusinka","pustina","putovat","putyka","pyramida","pysk","pytel","racek","rachot","radiace","radnice","radon","raft","ragby","raketa","rakovina","rameno","rampouch","rande","rarach","rarita","rasovna","rastr","ratolest","razance","razidlo","reagovat","reakce","recept","redaktor","referent","reflex","rejnok","reklama","rekord","rekrut","rektor","reputace","revize","revma","revolver","rezerva","riskovat","riziko","robotika","rodokmen","rohovka","rokle","rokoko","romaneto","ropovod","ropucha","rorejs","rosol","rostlina","rotmistr","rotoped","rotunda","roubenka","roucho","roup","roura","rovina","rovnice","rozbor","rozchod","rozdat","rozeznat","rozhodce","rozinka","rozjezd","rozkaz","rozloha","rozmar","rozpad","rozruch","rozsah","roztok","rozum","rozvod","rubrika","ruchadlo","rukavice","rukopis","ryba","rybolov","rychlost","rydlo","rypadlo","rytina","ryzost","sadista","sahat","sako","samec","samizdat","samota","sanitka","sardinka","sasanka","satelit","sazba","sazenice","sbor","schovat","sebranka","secese","sedadlo","sediment","sedlo","sehnat","sejmout","sekera","sekta","sekunda","sekvoje","semeno","seno","servis","sesadit","seshora","seskok","seslat","sestra","sesuv","sesypat","setba","setina","setkat","setnout","setrvat","sever","seznam","shoda","shrnout","sifon","silnice","sirka","sirotek","sirup","situace","skafandr","skalisko","skanzen","skaut","skeptik","skica","skladba","sklenice","sklo","skluz","skoba","skokan","skoro","skripta","skrz","skupina","skvost","skvrna","slabika","sladidlo","slanina","slast","slavnost","sledovat","slepec","sleva","slezina","slib","slina","sliznice","slon","sloupek","slovo","sluch","sluha","slunce","slupka","slza","smaragd","smetana","smilstvo","smlouva","smog","smrad","smrk","smrtka","smutek","smysl","snad","snaha","snob","sobota","socha","sodovka","sokol","sopka","sotva","souboj","soucit","soudce","souhlas","soulad","soumrak","souprava","soused","soutok","souviset","spalovna","spasitel","spis","splav","spodek","spojenec","spolu","sponzor","spornost","spousta","sprcha","spustit","sranda","sraz","srdce","srna","srnec","srovnat","srpen","srst","srub","stanice","starosta","statika","stavba","stehno","stezka","stodola","stolek","stopa","storno","stoupat","strach","stres","strhnout","strom","struna","studna","stupnice","stvol","styk","subjekt","subtropy","suchar","sudost","sukno","sundat","sunout","surikata","surovina","svah","svalstvo","svetr","svatba","svazek","svisle","svitek","svoboda","svodidlo","svorka","svrab","sykavka","sykot","synek","synovec","sypat","sypkost","syrovost","sysel","sytost","tabletka","tabule","tahoun","tajemno","tajfun","tajga","tajit","tajnost","taktika","tamhle","tampon","tancovat","tanec","tanker","tapeta","tavenina","tazatel","technika","tehdy","tekutina","telefon","temnota","tendence","tenista","tenor","teplota","tepna","teprve","terapie","termoska","textil","ticho","tiskopis","titulek","tkadlec","tkanina","tlapka","tleskat","tlukot","tlupa","tmel","toaleta","topinka","topol","torzo","touha","toulec","tradice","traktor","tramp","trasa","traverza","trefit","trest","trezor","trhavina","trhlina","trochu","trojice","troska","trouba","trpce","trpitel","trpkost","trubec","truchlit","truhlice","trus","trvat","tudy","tuhnout","tuhost","tundra","turista","turnaj","tuzemsko","tvaroh","tvorba","tvrdost","tvrz","tygr","tykev","ubohost","uboze","ubrat","ubrousek","ubrus","ubytovna","ucho","uctivost","udivit","uhradit","ujednat","ujistit","ujmout","ukazatel","uklidnit","uklonit","ukotvit","ukrojit","ulice","ulita","ulovit","umyvadlo","unavit","uniforma","uniknout","upadnout","uplatnit","uplynout","upoutat","upravit","uran","urazit","usednout","usilovat","usmrtit","usnadnit","usnout","usoudit","ustlat","ustrnout","utahovat","utkat","utlumit","utonout","utopenec","utrousit","uvalit","uvolnit","uvozovka","uzdravit","uzel","uzenina","uzlina","uznat","vagon","valcha","valoun","vana","vandal","vanilka","varan","varhany","varovat","vcelku","vchod","vdova","vedro","vegetace","vejce","velbloud","veletrh","velitel","velmoc","velryba","venkov","veranda","verze","veselka","veskrze","vesnice","vespodu","vesta","veterina","veverka","vibrace","vichr","videohra","vidina","vidle","vila","vinice","viset","vitalita","vize","vizitka","vjezd","vklad","vkus","vlajka","vlak","vlasec","vlevo","vlhkost","vliv","vlnovka","vloupat","vnucovat","vnuk","voda","vodivost","vodoznak","vodstvo","vojensky","vojna","vojsko","volant","volba","volit","volno","voskovka","vozidlo","vozovna","vpravo","vrabec","vracet","vrah","vrata","vrba","vrcholek","vrhat","vrstva","vrtule","vsadit","vstoupit","vstup","vtip","vybavit","vybrat","vychovat","vydat","vydra","vyfotit","vyhledat","vyhnout","vyhodit","vyhradit","vyhubit","vyjasnit","vyjet","vyjmout","vyklopit","vykonat","vylekat","vymazat","vymezit","vymizet","vymyslet","vynechat","vynikat","vynutit","vypadat","vyplatit","vypravit","vypustit","vyrazit","vyrovnat","vyrvat","vyslovit","vysoko","vystavit","vysunout","vysypat","vytasit","vytesat","vytratit","vyvinout","vyvolat","vyvrhel","vyzdobit","vyznat","vzadu","vzbudit","vzchopit","vzdor","vzduch","vzdychat","vzestup","vzhledem","vzkaz","vzlykat","vznik","vzorek","vzpoura","vztah","vztek","xylofon","zabrat","zabydlet","zachovat","zadarmo","zadusit","zafoukat","zahltit","zahodit","zahrada","zahynout","zajatec","zajet","zajistit","zaklepat","zakoupit","zalepit","zamezit","zamotat","zamyslet","zanechat","zanikat","zaplatit","zapojit","zapsat","zarazit","zastavit","zasunout","zatajit","zatemnit","zatknout","zaujmout","zavalit","zavelet","zavinit","zavolat","zavrtat","zazvonit","zbavit","zbrusu","zbudovat","zbytek","zdaleka","zdarma","zdatnost","zdivo","zdobit","zdroj","zdvih","zdymadlo","zelenina","zeman","zemina","zeptat","zezadu","zezdola","zhatit","zhltnout","zhluboka","zhotovit","zhruba","zima","zimnice","zjemnit","zklamat","zkoumat","zkratka","zkumavka","zlato","zlehka","zloba","zlom","zlost","zlozvyk","zmapovat","zmar","zmatek","zmije","zmizet","zmocnit","zmodrat","zmrzlina","zmutovat","znak","znalost","znamenat","znovu","zobrazit","zotavit","zoubek","zoufale","zplodit","zpomalit","zprava","zprostit","zprudka","zprvu","zrada","zranit","zrcadlo","zrnitost","zrno","zrovna","zrychlit","zrzavost","zticha","ztratit","zubovina","zubr","zvednout","zvenku","zvesela","zvon","zvrat","zvukovod","zvyk"]'), Vd = JSON.parse('["\u7684","\u4E00","\u662F","\u5728","\u4E0D","\u4E86","\u6709","\u548C","\u4EBA","\u8FD9","\u4E2D","\u5927","\u4E3A","\u4E0A","\u4E2A","\u56FD","\u6211","\u4EE5","\u8981","\u4ED6","\u65F6","\u6765","\u7528","\u4EEC","\u751F","\u5230","\u4F5C","\u5730","\u4E8E","\u51FA","\u5C31","\u5206","\u5BF9","\u6210","\u4F1A","\u53EF","\u4E3B","\u53D1","\u5E74","\u52A8","\u540C","\u5DE5","\u4E5F","\u80FD","\u4E0B","\u8FC7","\u5B50","\u8BF4","\u4EA7","\u79CD","\u9762","\u800C","\u65B9","\u540E","\u591A","\u5B9A","\u884C","\u5B66","\u6CD5","\u6240","\u6C11","\u5F97","\u7ECF","\u5341","\u4E09","\u4E4B","\u8FDB","\u7740","\u7B49","\u90E8","\u5EA6","\u5BB6","\u7535","\u529B","\u91CC","\u5982","\u6C34","\u5316","\u9AD8","\u81EA","\u4E8C","\u7406","\u8D77","\u5C0F","\u7269","\u73B0","\u5B9E","\u52A0","\u91CF","\u90FD","\u4E24","\u4F53","\u5236","\u673A","\u5F53","\u4F7F","\u70B9","\u4ECE","\u4E1A","\u672C","\u53BB","\u628A","\u6027","\u597D","\u5E94","\u5F00","\u5B83","\u5408","\u8FD8","\u56E0","\u7531","\u5176","\u4E9B","\u7136","\u524D","\u5916","\u5929","\u653F","\u56DB","\u65E5","\u90A3","\u793E","\u4E49","\u4E8B","\u5E73","\u5F62","\u76F8","\u5168","\u8868","\u95F4","\u6837","\u4E0E","\u5173","\u5404","\u91CD","\u65B0","\u7EBF","\u5185","\u6570","\u6B63","\u5FC3","\u53CD","\u4F60","\u660E","\u770B","\u539F","\u53C8","\u4E48","\u5229","\u6BD4","\u6216","\u4F46","\u8D28","\u6C14","\u7B2C","\u5411","\u9053","\u547D","\u6B64","\u53D8","\u6761","\u53EA","\u6CA1","\u7ED3","\u89E3","\u95EE","\u610F","\u5EFA","\u6708","\u516C","\u65E0","\u7CFB","\u519B","\u5F88","\u60C5","\u8005","\u6700","\u7ACB","\u4EE3","\u60F3","\u5DF2","\u901A","\u5E76","\u63D0","\u76F4","\u9898","\u515A","\u7A0B","\u5C55","\u4E94","\u679C","\u6599","\u8C61","\u5458","\u9769","\u4F4D","\u5165","\u5E38","\u6587","\u603B","\u6B21","\u54C1","\u5F0F","\u6D3B","\u8BBE","\u53CA","\u7BA1","\u7279","\u4EF6","\u957F","\u6C42","\u8001","\u5934","\u57FA","\u8D44","\u8FB9","\u6D41","\u8DEF","\u7EA7","\u5C11","\u56FE","\u5C71","\u7EDF","\u63A5","\u77E5","\u8F83","\u5C06","\u7EC4","\u89C1","\u8BA1","\u522B","\u5979","\u624B","\u89D2","\u671F","\u6839","\u8BBA","\u8FD0","\u519C","\u6307","\u51E0","\u4E5D","\u533A","\u5F3A","\u653E","\u51B3","\u897F","\u88AB","\u5E72","\u505A","\u5FC5","\u6218","\u5148","\u56DE","\u5219","\u4EFB","\u53D6","\u636E","\u5904","\u961F","\u5357","\u7ED9","\u8272","\u5149","\u95E8","\u5373","\u4FDD","\u6CBB","\u5317","\u9020","\u767E","\u89C4","\u70ED","\u9886","\u4E03","\u6D77","\u53E3","\u4E1C","\u5BFC","\u5668","\u538B","\u5FD7","\u4E16","\u91D1","\u589E","\u4E89","\u6D4E","\u9636","\u6CB9","\u601D","\u672F","\u6781","\u4EA4","\u53D7","\u8054","\u4EC0","\u8BA4","\u516D","\u5171","\u6743","\u6536","\u8BC1","\u6539","\u6E05","\u7F8E","\u518D","\u91C7","\u8F6C","\u66F4","\u5355","\u98CE","\u5207","\u6253","\u767D","\u6559","\u901F","\u82B1","\u5E26","\u5B89","\u573A","\u8EAB","\u8F66","\u4F8B","\u771F","\u52A1","\u5177","\u4E07","\u6BCF","\u76EE","\u81F3","\u8FBE","\u8D70","\u79EF","\u793A","\u8BAE","\u58F0","\u62A5","\u6597","\u5B8C","\u7C7B","\u516B","\u79BB","\u534E","\u540D","\u786E","\u624D","\u79D1","\u5F20","\u4FE1","\u9A6C","\u8282","\u8BDD","\u7C73","\u6574","\u7A7A","\u5143","\u51B5","\u4ECA","\u96C6","\u6E29","\u4F20","\u571F","\u8BB8","\u6B65","\u7FA4","\u5E7F","\u77F3","\u8BB0","\u9700","\u6BB5","\u7814","\u754C","\u62C9","\u6797","\u5F8B","\u53EB","\u4E14","\u7A76","\u89C2","\u8D8A","\u7EC7","\u88C5","\u5F71","\u7B97","\u4F4E","\u6301","\u97F3","\u4F17","\u4E66","\u5E03","\u590D","\u5BB9","\u513F","\u987B","\u9645","\u5546","\u975E","\u9A8C","\u8FDE","\u65AD","\u6DF1","\u96BE","\u8FD1","\u77FF","\u5343","\u5468","\u59D4","\u7D20","\u6280","\u5907","\u534A","\u529E","\u9752","\u7701","\u5217","\u4E60","\u54CD","\u7EA6","\u652F","\u822C","\u53F2","\u611F","\u52B3","\u4FBF","\u56E2","\u5F80","\u9178","\u5386","\u5E02","\u514B","\u4F55","\u9664","\u6D88","\u6784","\u5E9C","\u79F0","\u592A","\u51C6","\u7CBE","\u503C","\u53F7","\u7387","\u65CF","\u7EF4","\u5212","\u9009","\u6807","\u5199","\u5B58","\u5019","\u6BDB","\u4EB2","\u5FEB","\u6548","\u65AF","\u9662","\u67E5","\u6C5F","\u578B","\u773C","\u738B","\u6309","\u683C","\u517B","\u6613","\u7F6E","\u6D3E","\u5C42","\u7247","\u59CB","\u5374","\u4E13","\u72B6","\u80B2","\u5382","\u4EAC","\u8BC6","\u9002","\u5C5E","\u5706","\u5305","\u706B","\u4F4F","\u8C03","\u6EE1","\u53BF","\u5C40","\u7167","\u53C2","\u7EA2","\u7EC6","\u5F15","\u542C","\u8BE5","\u94C1","\u4EF7","\u4E25","\u9996","\u5E95","\u6DB2","\u5B98","\u5FB7","\u968F","\u75C5","\u82CF","\u5931","\u5C14","\u6B7B","\u8BB2","\u914D","\u5973","\u9EC4","\u63A8","\u663E","\u8C08","\u7F6A","\u795E","\u827A","\u5462","\u5E2D","\u542B","\u4F01","\u671B","\u5BC6","\u6279","\u8425","\u9879","\u9632","\u4E3E","\u7403","\u82F1","\u6C27","\u52BF","\u544A","\u674E","\u53F0","\u843D","\u6728","\u5E2E","\u8F6E","\u7834","\u4E9A","\u5E08","\u56F4","\u6CE8","\u8FDC","\u5B57","\u6750","\u6392","\u4F9B","\u6CB3","\u6001","\u5C01","\u53E6","\u65BD","\u51CF","\u6811","\u6EB6","\u600E","\u6B62","\u6848","\u8A00","\u58EB","\u5747","\u6B66","\u56FA","\u53F6","\u9C7C","\u6CE2","\u89C6","\u4EC5","\u8D39","\u7D27","\u7231","\u5DE6","\u7AE0","\u65E9","\u671D","\u5BB3","\u7EED","\u8F7B","\u670D","\u8BD5","\u98DF","\u5145","\u5175","\u6E90","\u5224","\u62A4","\u53F8","\u8DB3","\u67D0","\u7EC3","\u5DEE","\u81F4","\u677F","\u7530","\u964D","\u9ED1","\u72AF","\u8D1F","\u51FB","\u8303","\u7EE7","\u5174","\u4F3C","\u4F59","\u575A","\u66F2","\u8F93","\u4FEE","\u6545","\u57CE","\u592B","\u591F","\u9001","\u7B14","\u8239","\u5360","\u53F3","\u8D22","\u5403","\u5BCC","\u6625","\u804C","\u89C9","\u6C49","\u753B","\u529F","\u5DF4","\u8DDF","\u867D","\u6742","\u98DE","\u68C0","\u5438","\u52A9","\u5347","\u9633","\u4E92","\u521D","\u521B","\u6297","\u8003","\u6295","\u574F","\u7B56","\u53E4","\u5F84","\u6362","\u672A","\u8DD1","\u7559","\u94A2","\u66FE","\u7AEF","\u8D23","\u7AD9","\u7B80","\u8FF0","\u94B1","\u526F","\u5C3D","\u5E1D","\u5C04","\u8349","\u51B2","\u627F","\u72EC","\u4EE4","\u9650","\u963F","\u5BA3","\u73AF","\u53CC","\u8BF7","\u8D85","\u5FAE","\u8BA9","\u63A7","\u5DDE","\u826F","\u8F74","\u627E","\u5426","\u7EAA","\u76CA","\u4F9D","\u4F18","\u9876","\u7840","\u8F7D","\u5012","\u623F","\u7A81","\u5750","\u7C89","\u654C","\u7565","\u5BA2","\u8881","\u51B7","\u80DC","\u7EDD","\u6790","\u5757","\u5242","\u6D4B","\u4E1D","\u534F","\u8BC9","\u5FF5","\u9648","\u4ECD","\u7F57","\u76D0","\u53CB","\u6D0B","\u9519","\u82E6","\u591C","\u5211","\u79FB","\u9891","\u9010","\u9760","\u6DF7","\u6BCD","\u77ED","\u76AE","\u7EC8","\u805A","\u6C7D","\u6751","\u4E91","\u54EA","\u65E2","\u8DDD","\u536B","\u505C","\u70C8","\u592E","\u5BDF","\u70E7","\u8FC5","\u5883","\u82E5","\u5370","\u6D32","\u523B","\u62EC","\u6FC0","\u5B54","\u641E","\u751A","\u5BA4","\u5F85","\u6838","\u6821","\u6563","\u4FB5","\u5427","\u7532","\u6E38","\u4E45","\u83DC","\u5473","\u65E7","\u6A21","\u6E56","\u8D27","\u635F","\u9884","\u963B","\u6BEB","\u666E","\u7A33","\u4E59","\u5988","\u690D","\u606F","\u6269","\u94F6","\u8BED","\u6325","\u9152","\u5B88","\u62FF","\u5E8F","\u7EB8","\u533B","\u7F3A","\u96E8","\u5417","\u9488","\u5218","\u554A","\u6025","\u5531","\u8BEF","\u8BAD","\u613F","\u5BA1","\u9644","\u83B7","\u8336","\u9C9C","\u7CAE","\u65A4","\u5B69","\u8131","\u786B","\u80A5","\u5584","\u9F99","\u6F14","\u7236","\u6E10","\u8840","\u6B22","\u68B0","\u638C","\u6B4C","\u6C99","\u521A","\u653B","\u8C13","\u76FE","\u8BA8","\u665A","\u7C92","\u4E71","\u71C3","\u77DB","\u4E4E","\u6740","\u836F","\u5B81","\u9C81","\u8D35","\u949F","\u7164","\u8BFB","\u73ED","\u4F2F","\u9999","\u4ECB","\u8FEB","\u53E5","\u4E30","\u57F9","\u63E1","\u5170","\u62C5","\u5F26","\u86CB","\u6C89","\u5047","\u7A7F","\u6267","\u7B54","\u4E50","\u8C01","\u987A","\u70DF","\u7F29","\u5F81","\u8138","\u559C","\u677E","\u811A","\u56F0","\u5F02","\u514D","\u80CC","\u661F","\u798F","\u4E70","\u67D3","\u4E95","\u6982","\u6162","\u6015","\u78C1","\u500D","\u7956","\u7687","\u4FC3","\u9759","\u8865","\u8BC4","\u7FFB","\u8089","\u8DF5","\u5C3C","\u8863","\u5BBD","\u626C","\u68C9","\u5E0C","\u4F24","\u64CD","\u5782","\u79CB","\u5B9C","\u6C22","\u5957","\u7763","\u632F","\u67B6","\u4EAE","\u672B","\u5BAA","\u5E86","\u7F16","\u725B","\u89E6","\u6620","\u96F7","\u9500","\u8BD7","\u5EA7","\u5C45","\u6293","\u88C2","\u80DE","\u547C","\u5A18","\u666F","\u5A01","\u7EFF","\u6676","\u539A","\u76DF","\u8861","\u9E21","\u5B59","\u5EF6","\u5371","\u80F6","\u5C4B","\u4E61","\u4E34","\u9646","\u987E","\u6389","\u5440","\u706F","\u5C81","\u63AA","\u675F","\u8010","\u5267","\u7389","\u8D75","\u8DF3","\u54E5","\u5B63","\u8BFE","\u51EF","\u80E1","\u989D","\u6B3E","\u7ECD","\u5377","\u9F50","\u4F1F","\u84B8","\u6B96","\u6C38","\u5B97","\u82D7","\u5DDD","\u7089","\u5CA9","\u5F31","\u96F6","\u6768","\u594F","\u6CBF","\u9732","\u6746","\u63A2","\u6ED1","\u9547","\u996D","\u6D53","\u822A","\u6000","\u8D76","\u5E93","\u593A","\u4F0A","\u7075","\u7A0E","\u9014","\u706D","\u8D5B","\u5F52","\u53EC","\u9F13","\u64AD","\u76D8","\u88C1","\u9669","\u5EB7","\u552F","\u5F55","\u83CC","\u7EAF","\u501F","\u7CD6","\u76D6","\u6A2A","\u7B26","\u79C1","\u52AA","\u5802","\u57DF","\u67AA","\u6DA6","\u5E45","\u54C8","\u7ADF","\u719F","\u866B","\u6CFD","\u8111","\u58E4","\u78B3","\u6B27","\u904D","\u4FA7","\u5BE8","\u6562","\u5F7B","\u8651","\u659C","\u8584","\u5EAD","\u7EB3","\u5F39","\u9972","\u4F38","\u6298","\u9EA6","\u6E7F","\u6697","\u8377","\u74E6","\u585E","\u5E8A","\u7B51","\u6076","\u6237","\u8BBF","\u5854","\u5947","\u900F","\u6881","\u5200","\u65CB","\u8FF9","\u5361","\u6C2F","\u9047","\u4EFD","\u6BD2","\u6CE5","\u9000","\u6D17","\u6446","\u7070","\u5F69","\u5356","\u8017","\u590F","\u62E9","\u5FD9","\u94DC","\u732E","\u786C","\u4E88","\u7E41","\u5708","\u96EA","\u51FD","\u4EA6","\u62BD","\u7BC7","\u9635","\u9634","\u4E01","\u5C3A","\u8FFD","\u5806","\u96C4","\u8FCE","\u6CDB","\u7238","\u697C","\u907F","\u8C0B","\u5428","\u91CE","\u732A","\u65D7","\u7D2F","\u504F","\u5178","\u9986","\u7D22","\u79E6","\u8102","\u6F6E","\u7237","\u8C46","\u5FFD","\u6258","\u60CA","\u5851","\u9057","\u6108","\u6731","\u66FF","\u7EA4","\u7C97","\u503E","\u5C1A","\u75DB","\u695A","\u8C22","\u594B","\u8D2D","\u78E8","\u541B","\u6C60","\u65C1","\u788E","\u9AA8","\u76D1","\u6355","\u5F1F","\u66B4","\u5272","\u8D2F","\u6B8A","\u91CA","\u8BCD","\u4EA1","\u58C1","\u987F","\u5B9D","\u5348","\u5C18","\u95FB","\u63ED","\u70AE","\u6B8B","\u51AC","\u6865","\u5987","\u8B66","\u7EFC","\u62DB","\u5434","\u4ED8","\u6D6E","\u906D","\u5F90","\u60A8","\u6447","\u8C37","\u8D5E","\u7BB1","\u9694","\u8BA2","\u7537","\u5439","\u56ED","\u7EB7","\u5510","\u8D25","\u5B8B","\u73BB","\u5DE8","\u8015","\u5766","\u8363","\u95ED","\u6E7E","\u952E","\u51E1","\u9A7B","\u9505","\u6551","\u6069","\u5265","\u51DD","\u78B1","\u9F7F","\u622A","\u70BC","\u9EBB","\u7EBA","\u7981","\u5E9F","\u76DB","\u7248","\u7F13","\u51C0","\u775B","\u660C","\u5A5A","\u6D89","\u7B52","\u5634","\u63D2","\u5CB8","\u6717","\u5E84","\u8857","\u85CF","\u59D1","\u8D38","\u8150","\u5974","\u5566","\u60EF","\u4E58","\u4F19","\u6062","\u5300","\u7EB1","\u624E","\u8FA9","\u8033","\u5F6A","\u81E3","\u4EBF","\u7483","\u62B5","\u8109","\u79C0","\u8428","\u4FC4","\u7F51","\u821E","\u5E97","\u55B7","\u7EB5","\u5BF8","\u6C57","\u6302","\u6D2A","\u8D3A","\u95EA","\u67EC","\u7206","\u70EF","\u6D25","\u7A3B","\u5899","\u8F6F","\u52C7","\u50CF","\u6EDA","\u5398","\u8499","\u82B3","\u80AF","\u5761","\u67F1","\u8361","\u817F","\u4EEA","\u65C5","\u5C3E","\u8F67","\u51B0","\u8D21","\u767B","\u9ECE","\u524A","\u94BB","\u52D2","\u9003","\u969C","\u6C28","\u90ED","\u5CF0","\u5E01","\u6E2F","\u4F0F","\u8F68","\u4EA9","\u6BD5","\u64E6","\u83AB","\u523A","\u6D6A","\u79D8","\u63F4","\u682A","\u5065","\u552E","\u80A1","\u5C9B","\u7518","\u6CE1","\u7761","\u7AE5","\u94F8","\u6C64","\u9600","\u4F11","\u6C47","\u820D","\u7267","\u7ED5","\u70B8","\u54F2","\u78F7","\u7EE9","\u670B","\u6DE1","\u5C16","\u542F","\u9677","\u67F4","\u5448","\u5F92","\u989C","\u6CEA","\u7A0D","\u5FD8","\u6CF5","\u84DD","\u62D6","\u6D1E","\u6388","\u955C","\u8F9B","\u58EE","\u950B","\u8D2B","\u865A","\u5F2F","\u6469","\u6CF0","\u5E7C","\u5EF7","\u5C0A","\u7A97","\u7EB2","\u5F04","\u96B6","\u7591","\u6C0F","\u5BAB","\u59D0","\u9707","\u745E","\u602A","\u5C24","\u7434","\u5FAA","\u63CF","\u819C","\u8FDD","\u5939","\u8170","\u7F18","\u73E0","\u7A77","\u68EE","\u679D","\u7AF9","\u6C9F","\u50AC","\u7EF3","\u5FC6","\u90A6","\u5269","\u5E78","\u6D46","\u680F","\u62E5","\u7259","\u8D2E","\u793C","\u6EE4","\u94A0","\u7EB9","\u7F62","\u62CD","\u54B1","\u558A","\u8896","\u57C3","\u52E4","\u7F5A","\u7126","\u6F5C","\u4F0D","\u58A8","\u6B32","\u7F1D","\u59D3","\u520A","\u9971","\u4EFF","\u5956","\u94DD","\u9B3C","\u4E3D","\u8DE8","\u9ED8","\u6316","\u94FE","\u626B","\u559D","\u888B","\u70AD","\u6C61","\u5E55","\u8BF8","\u5F27","\u52B1","\u6885","\u5976","\u6D01","\u707E","\u821F","\u9274","\u82EF","\u8BBC","\u62B1","\u6BC1","\u61C2","\u5BD2","\u667A","\u57D4","\u5BC4","\u5C4A","\u8DC3","\u6E21","\u6311","\u4E39","\u8270","\u8D1D","\u78B0","\u62D4","\u7239","\u6234","\u7801","\u68A6","\u82BD","\u7194","\u8D64","\u6E14","\u54ED","\u656C","\u9897","\u5954","\u94C5","\u4EF2","\u864E","\u7A00","\u59B9","\u4E4F","\u73CD","\u7533","\u684C","\u9075","\u5141","\u9686","\u87BA","\u4ED3","\u9B4F","\u9510","\u6653","\u6C2E","\u517C","\u9690","\u788D","\u8D6B","\u62E8","\u5FE0","\u8083","\u7F38","\u7275","\u62A2","\u535A","\u5DE7","\u58F3","\u5144","\u675C","\u8BAF","\u8BDA","\u78A7","\u7965","\u67EF","\u9875","\u5DE1","\u77E9","\u60B2","\u704C","\u9F84","\u4F26","\u7968","\u5BFB","\u6842","\u94FA","\u5723","\u6050","\u6070","\u90D1","\u8DA3","\u62AC","\u8352","\u817E","\u8D34","\u67D4","\u6EF4","\u731B","\u9614","\u8F86","\u59BB","\u586B","\u64A4","\u50A8","\u7B7E","\u95F9","\u6270","\u7D2B","\u7802","\u9012","\u620F","\u540A","\u9676","\u4F10","\u5582","\u7597","\u74F6","\u5A46","\u629A","\u81C2","\u6478","\u5FCD","\u867E","\u8721","\u90BB","\u80F8","\u5DE9","\u6324","\u5076","\u5F03","\u69FD","\u52B2","\u4E73","\u9093","\u5409","\u4EC1","\u70C2","\u7816","\u79DF","\u4E4C","\u8230","\u4F34","\u74DC","\u6D45","\u4E19","\u6682","\u71E5","\u6A61","\u67F3","\u8FF7","\u6696","\u724C","\u79E7","\u80C6","\u8BE6","\u7C27","\u8E0F","\u74F7","\u8C31","\u5446","\u5BBE","\u7CCA","\u6D1B","\u8F89","\u6124","\u7ADE","\u9699","\u6012","\u7C98","\u4E43","\u7EEA","\u80A9","\u7C4D","\u654F","\u6D82","\u7199","\u7686","\u4FA6","\u60AC","\u6398","\u4EAB","\u7EA0","\u9192","\u72C2","\u9501","\u6DC0","\u6068","\u7272","\u9738","\u722C","\u8D4F","\u9006","\u73A9","\u9675","\u795D","\u79D2","\u6D59","\u8C8C","\u5F79","\u5F7C","\u6089","\u9E2D","\u8D8B","\u51E4","\u6668","\u755C","\u8F88","\u79E9","\u5375","\u7F72","\u68AF","\u708E","\u6EE9","\u68CB","\u9A71","\u7B5B","\u5CE1","\u5192","\u5565","\u5BFF","\u8BD1","\u6D78","\u6CC9","\u5E3D","\u8FDF","\u7845","\u7586","\u8D37","\u6F0F","\u7A3F","\u51A0","\u5AE9","\u80C1","\u82AF","\u7262","\u53DB","\u8680","\u5965","\u9E23","\u5CAD","\u7F8A","\u51ED","\u4E32","\u5858","\u7ED8","\u9175","\u878D","\u76C6","\u9521","\u5E99","\u7B79","\u51BB","\u8F85","\u6444","\u88AD","\u7B4B","\u62D2","\u50DA","\u65F1","\u94BE","\u9E1F","\u6F06","\u6C88","\u7709","\u758F","\u6DFB","\u68D2","\u7A57","\u785D","\u97E9","\u903C","\u626D","\u4FA8","\u51C9","\u633A","\u7897","\u683D","\u7092","\u676F","\u60A3","\u998F","\u529D","\u8C6A","\u8FBD","\u52C3","\u9E3F","\u65E6","\u540F","\u62DC","\u72D7","\u57CB","\u8F8A","\u63A9","\u996E","\u642C","\u9A82","\u8F9E","\u52FE","\u6263","\u4F30","\u848B","\u7ED2","\u96FE","\u4E08","\u6735","\u59C6","\u62DF","\u5B87","\u8F91","\u9655","\u96D5","\u507F","\u84C4","\u5D07","\u526A","\u5021","\u5385","\u54AC","\u9A76","\u85AF","\u5237","\u65A5","\u756A","\u8D4B","\u5949","\u4F5B","\u6D47","\u6F2B","\u66FC","\u6247","\u9499","\u6843","\u6276","\u4ED4","\u8FD4","\u4FD7","\u4E8F","\u8154","\u978B","\u68F1","\u8986","\u6846","\u6084","\u53D4","\u649E","\u9A97","\u52D8","\u65FA","\u6CB8","\u5B64","\u5410","\u5B5F","\u6E20","\u5C48","\u75BE","\u5999","\u60DC","\u4EF0","\u72E0","\u80C0","\u8C10","\u629B","\u9709","\u6851","\u5C97","\u561B","\u8870","\u76D7","\u6E17","\u810F","\u8D56","\u6D8C","\u751C","\u66F9","\u9605","\u808C","\u54E9","\u5389","\u70C3","\u7EAC","\u6BC5","\u6628","\u4F2A","\u75C7","\u716E","\u53F9","\u9489","\u642D","\u830E","\u7B3C","\u9177","\u5077","\u5F13","\u9525","\u6052","\u6770","\u5751","\u9F3B","\u7FFC","\u7EB6","\u53D9","\u72F1","\u902E","\u7F50","\u7EDC","\u68DA","\u6291","\u81A8","\u852C","\u5BFA","\u9AA4","\u7A46","\u51B6","\u67AF","\u518C","\u5C38","\u51F8","\u7EC5","\u576F","\u727A","\u7130","\u8F70","\u6B23","\u664B","\u7626","\u5FA1","\u952D","\u9526","\u4E27","\u65EC","\u953B","\u5784","\u641C","\u6251","\u9080","\u4EAD","\u916F","\u8FC8","\u8212","\u8106","\u9176","\u95F2","\u5FE7","\u915A","\u987D","\u7FBD","\u6DA8","\u5378","\u4ED7","\u966A","\u8F9F","\u60E9","\u676D","\u59DA","\u809A","\u6349","\u98D8","\u6F02","\u6606","\u6B3A","\u543E","\u90CE","\u70F7","\u6C41","\u5475","\u9970","\u8427","\u96C5","\u90AE","\u8FC1","\u71D5","\u6492","\u59FB","\u8D74","\u5BB4","\u70E6","\u503A","\u5E10","\u6591","\u94C3","\u65E8","\u9187","\u8463","\u997C","\u96CF","\u59FF","\u62CC","\u5085","\u8179","\u59A5","\u63C9","\u8D24","\u62C6","\u6B6A","\u8461","\u80FA","\u4E22","\u6D69","\u5FBD","\u6602","\u57AB","\u6321","\u89C8","\u8D2A","\u6170","\u7F34","\u6C6A","\u614C","\u51AF","\u8BFA","\u59DC","\u8C0A","\u51F6","\u52A3","\u8BEC","\u8000","\u660F","\u8EBA","\u76C8","\u9A91","\u4E54","\u6EAA","\u4E1B","\u5362","\u62B9","\u95F7","\u54A8","\u522E","\u9A7E","\u7F06","\u609F","\u6458","\u94D2","\u63B7","\u9887","\u5E7B","\u67C4","\u60E0","\u60E8","\u4F73","\u4EC7","\u814A","\u7A9D","\u6DA4","\u5251","\u77A7","\u5821","\u6CFC","\u8471","\u7F69","\u970D","\u635E","\u80CE","\u82CD","\u6EE8","\u4FE9","\u6345","\u6E58","\u780D","\u971E","\u90B5","\u8404","\u75AF","\u6DEE","\u9042","\u718A","\u7CAA","\u70D8","\u5BBF","\u6863","\u6208","\u9A73","\u5AC2","\u88D5","\u5F99","\u7BAD","\u6350","\u80A0","\u6491","\u6652","\u8FA8","\u6BBF","\u83B2","\u644A","\u6405","\u9171","\u5C4F","\u75AB","\u54C0","\u8521","\u5835","\u6CAB","\u76B1","\u7545","\u53E0","\u9601","\u83B1","\u6572","\u8F96","\u94A9","\u75D5","\u575D","\u5DF7","\u997F","\u7978","\u4E18","\u7384","\u6E9C","\u66F0","\u903B","\u5F6D","\u5C1D","\u537F","\u59A8","\u8247","\u541E","\u97E6","\u6028","\u77EE","\u6B47"]'), Md = JSON.parse('["\u7684","\u4E00","\u662F","\u5728","\u4E0D","\u4E86","\u6709","\u548C","\u4EBA","\u9019","\u4E2D","\u5927","\u70BA","\u4E0A","\u500B","\u570B","\u6211","\u4EE5","\u8981","\u4ED6","\u6642","\u4F86","\u7528","\u5011","\u751F","\u5230","\u4F5C","\u5730","\u65BC","\u51FA","\u5C31","\u5206","\u5C0D","\u6210","\u6703","\u53EF","\u4E3B","\u767C","\u5E74","\u52D5","\u540C","\u5DE5","\u4E5F","\u80FD","\u4E0B","\u904E","\u5B50","\u8AAA","\u7522","\u7A2E","\u9762","\u800C","\u65B9","\u5F8C","\u591A","\u5B9A","\u884C","\u5B78","\u6CD5","\u6240","\u6C11","\u5F97","\u7D93","\u5341","\u4E09","\u4E4B","\u9032","\u8457","\u7B49","\u90E8","\u5EA6","\u5BB6","\u96FB","\u529B","\u88E1","\u5982","\u6C34","\u5316","\u9AD8","\u81EA","\u4E8C","\u7406","\u8D77","\u5C0F","\u7269","\u73FE","\u5BE6","\u52A0","\u91CF","\u90FD","\u5169","\u9AD4","\u5236","\u6A5F","\u7576","\u4F7F","\u9EDE","\u5F9E","\u696D","\u672C","\u53BB","\u628A","\u6027","\u597D","\u61C9","\u958B","\u5B83","\u5408","\u9084","\u56E0","\u7531","\u5176","\u4E9B","\u7136","\u524D","\u5916","\u5929","\u653F","\u56DB","\u65E5","\u90A3","\u793E","\u7FA9","\u4E8B","\u5E73","\u5F62","\u76F8","\u5168","\u8868","\u9593","\u6A23","\u8207","\u95DC","\u5404","\u91CD","\u65B0","\u7DDA","\u5167","\u6578","\u6B63","\u5FC3","\u53CD","\u4F60","\u660E","\u770B","\u539F","\u53C8","\u9EBC","\u5229","\u6BD4","\u6216","\u4F46","\u8CEA","\u6C23","\u7B2C","\u5411","\u9053","\u547D","\u6B64","\u8B8A","\u689D","\u53EA","\u6C92","\u7D50","\u89E3","\u554F","\u610F","\u5EFA","\u6708","\u516C","\u7121","\u7CFB","\u8ECD","\u5F88","\u60C5","\u8005","\u6700","\u7ACB","\u4EE3","\u60F3","\u5DF2","\u901A","\u4E26","\u63D0","\u76F4","\u984C","\u9EE8","\u7A0B","\u5C55","\u4E94","\u679C","\u6599","\u8C61","\u54E1","\u9769","\u4F4D","\u5165","\u5E38","\u6587","\u7E3D","\u6B21","\u54C1","\u5F0F","\u6D3B","\u8A2D","\u53CA","\u7BA1","\u7279","\u4EF6","\u9577","\u6C42","\u8001","\u982D","\u57FA","\u8CC7","\u908A","\u6D41","\u8DEF","\u7D1A","\u5C11","\u5716","\u5C71","\u7D71","\u63A5","\u77E5","\u8F03","\u5C07","\u7D44","\u898B","\u8A08","\u5225","\u5979","\u624B","\u89D2","\u671F","\u6839","\u8AD6","\u904B","\u8FB2","\u6307","\u5E7E","\u4E5D","\u5340","\u5F37","\u653E","\u6C7A","\u897F","\u88AB","\u5E79","\u505A","\u5FC5","\u6230","\u5148","\u56DE","\u5247","\u4EFB","\u53D6","\u64DA","\u8655","\u968A","\u5357","\u7D66","\u8272","\u5149","\u9580","\u5373","\u4FDD","\u6CBB","\u5317","\u9020","\u767E","\u898F","\u71B1","\u9818","\u4E03","\u6D77","\u53E3","\u6771","\u5C0E","\u5668","\u58D3","\u5FD7","\u4E16","\u91D1","\u589E","\u722D","\u6FDF","\u968E","\u6CB9","\u601D","\u8853","\u6975","\u4EA4","\u53D7","\u806F","\u4EC0","\u8A8D","\u516D","\u5171","\u6B0A","\u6536","\u8B49","\u6539","\u6E05","\u7F8E","\u518D","\u63A1","\u8F49","\u66F4","\u55AE","\u98A8","\u5207","\u6253","\u767D","\u6559","\u901F","\u82B1","\u5E36","\u5B89","\u5834","\u8EAB","\u8ECA","\u4F8B","\u771F","\u52D9","\u5177","\u842C","\u6BCF","\u76EE","\u81F3","\u9054","\u8D70","\u7A4D","\u793A","\u8B70","\u8072","\u5831","\u9B25","\u5B8C","\u985E","\u516B","\u96E2","\u83EF","\u540D","\u78BA","\u624D","\u79D1","\u5F35","\u4FE1","\u99AC","\u7BC0","\u8A71","\u7C73","\u6574","\u7A7A","\u5143","\u6CC1","\u4ECA","\u96C6","\u6EAB","\u50B3","\u571F","\u8A31","\u6B65","\u7FA4","\u5EE3","\u77F3","\u8A18","\u9700","\u6BB5","\u7814","\u754C","\u62C9","\u6797","\u5F8B","\u53EB","\u4E14","\u7A76","\u89C0","\u8D8A","\u7E54","\u88DD","\u5F71","\u7B97","\u4F4E","\u6301","\u97F3","\u773E","\u66F8","\u5E03","\u590D","\u5BB9","\u5152","\u9808","\u969B","\u5546","\u975E","\u9A57","\u9023","\u65B7","\u6DF1","\u96E3","\u8FD1","\u7926","\u5343","\u9031","\u59D4","\u7D20","\u6280","\u5099","\u534A","\u8FA6","\u9752","\u7701","\u5217","\u7FD2","\u97FF","\u7D04","\u652F","\u822C","\u53F2","\u611F","\u52DE","\u4FBF","\u5718","\u5F80","\u9178","\u6B77","\u5E02","\u514B","\u4F55","\u9664","\u6D88","\u69CB","\u5E9C","\u7A31","\u592A","\u6E96","\u7CBE","\u503C","\u865F","\u7387","\u65CF","\u7DAD","\u5283","\u9078","\u6A19","\u5BEB","\u5B58","\u5019","\u6BDB","\u89AA","\u5FEB","\u6548","\u65AF","\u9662","\u67E5","\u6C5F","\u578B","\u773C","\u738B","\u6309","\u683C","\u990A","\u6613","\u7F6E","\u6D3E","\u5C64","\u7247","\u59CB","\u537B","\u5C08","\u72C0","\u80B2","\u5EE0","\u4EAC","\u8B58","\u9069","\u5C6C","\u5713","\u5305","\u706B","\u4F4F","\u8ABF","\u6EFF","\u7E23","\u5C40","\u7167","\u53C3","\u7D05","\u7D30","\u5F15","\u807D","\u8A72","\u9435","\u50F9","\u56B4","\u9996","\u5E95","\u6DB2","\u5B98","\u5FB7","\u96A8","\u75C5","\u8607","\u5931","\u723E","\u6B7B","\u8B1B","\u914D","\u5973","\u9EC3","\u63A8","\u986F","\u8AC7","\u7F6A","\u795E","\u85DD","\u5462","\u5E2D","\u542B","\u4F01","\u671B","\u5BC6","\u6279","\u71DF","\u9805","\u9632","\u8209","\u7403","\u82F1","\u6C27","\u52E2","\u544A","\u674E","\u53F0","\u843D","\u6728","\u5E6B","\u8F2A","\u7834","\u4E9E","\u5E2B","\u570D","\u6CE8","\u9060","\u5B57","\u6750","\u6392","\u4F9B","\u6CB3","\u614B","\u5C01","\u53E6","\u65BD","\u6E1B","\u6A39","\u6EB6","\u600E","\u6B62","\u6848","\u8A00","\u58EB","\u5747","\u6B66","\u56FA","\u8449","\u9B5A","\u6CE2","\u8996","\u50C5","\u8CBB","\u7DCA","\u611B","\u5DE6","\u7AE0","\u65E9","\u671D","\u5BB3","\u7E8C","\u8F15","\u670D","\u8A66","\u98DF","\u5145","\u5175","\u6E90","\u5224","\u8B77","\u53F8","\u8DB3","\u67D0","\u7DF4","\u5DEE","\u81F4","\u677F","\u7530","\u964D","\u9ED1","\u72AF","\u8CA0","\u64CA","\u8303","\u7E7C","\u8208","\u4F3C","\u9918","\u5805","\u66F2","\u8F38","\u4FEE","\u6545","\u57CE","\u592B","\u5920","\u9001","\u7B46","\u8239","\u4F54","\u53F3","\u8CA1","\u5403","\u5BCC","\u6625","\u8077","\u89BA","\u6F22","\u756B","\u529F","\u5DF4","\u8DDF","\u96D6","\u96DC","\u98DB","\u6AA2","\u5438","\u52A9","\u6607","\u967D","\u4E92","\u521D","\u5275","\u6297","\u8003","\u6295","\u58DE","\u7B56","\u53E4","\u5F91","\u63DB","\u672A","\u8DD1","\u7559","\u92FC","\u66FE","\u7AEF","\u8CAC","\u7AD9","\u7C21","\u8FF0","\u9322","\u526F","\u76E1","\u5E1D","\u5C04","\u8349","\u885D","\u627F","\u7368","\u4EE4","\u9650","\u963F","\u5BA3","\u74B0","\u96D9","\u8ACB","\u8D85","\u5FAE","\u8B93","\u63A7","\u5DDE","\u826F","\u8EF8","\u627E","\u5426","\u7D00","\u76CA","\u4F9D","\u512A","\u9802","\u790E","\u8F09","\u5012","\u623F","\u7A81","\u5750","\u7C89","\u6575","\u7565","\u5BA2","\u8881","\u51B7","\u52DD","\u7D55","\u6790","\u584A","\u5291","\u6E2C","\u7D72","\u5354","\u8A34","\u5FF5","\u9673","\u4ECD","\u7F85","\u9E7D","\u53CB","\u6D0B","\u932F","\u82E6","\u591C","\u5211","\u79FB","\u983B","\u9010","\u9760","\u6DF7","\u6BCD","\u77ED","\u76AE","\u7D42","\u805A","\u6C7D","\u6751","\u96F2","\u54EA","\u65E2","\u8DDD","\u885B","\u505C","\u70C8","\u592E","\u5BDF","\u71D2","\u8FC5","\u5883","\u82E5","\u5370","\u6D32","\u523B","\u62EC","\u6FC0","\u5B54","\u641E","\u751A","\u5BA4","\u5F85","\u6838","\u6821","\u6563","\u4FB5","\u5427","\u7532","\u904A","\u4E45","\u83DC","\u5473","\u820A","\u6A21","\u6E56","\u8CA8","\u640D","\u9810","\u963B","\u6BEB","\u666E","\u7A69","\u4E59","\u5ABD","\u690D","\u606F","\u64F4","\u9280","\u8A9E","\u63EE","\u9152","\u5B88","\u62FF","\u5E8F","\u7D19","\u91AB","\u7F3A","\u96E8","\u55CE","\u91DD","\u5289","\u554A","\u6025","\u5531","\u8AA4","\u8A13","\u9858","\u5BE9","\u9644","\u7372","\u8336","\u9BAE","\u7CE7","\u65A4","\u5B69","\u812B","\u786B","\u80A5","\u5584","\u9F8D","\u6F14","\u7236","\u6F38","\u8840","\u6B61","\u68B0","\u638C","\u6B4C","\u6C99","\u525B","\u653B","\u8B02","\u76FE","\u8A0E","\u665A","\u7C92","\u4E82","\u71C3","\u77DB","\u4E4E","\u6BBA","\u85E5","\u5BE7","\u9B6F","\u8CB4","\u9418","\u7164","\u8B80","\u73ED","\u4F2F","\u9999","\u4ECB","\u8FEB","\u53E5","\u8C50","\u57F9","\u63E1","\u862D","\u64D4","\u5F26","\u86CB","\u6C89","\u5047","\u7A7F","\u57F7","\u7B54","\u6A02","\u8AB0","\u9806","\u7159","\u7E2E","\u5FB5","\u81C9","\u559C","\u677E","\u8173","\u56F0","\u7570","\u514D","\u80CC","\u661F","\u798F","\u8CB7","\u67D3","\u4E95","\u6982","\u6162","\u6015","\u78C1","\u500D","\u7956","\u7687","\u4FC3","\u975C","\u88DC","\u8A55","\u7FFB","\u8089","\u8E10","\u5C3C","\u8863","\u5BEC","\u63DA","\u68C9","\u5E0C","\u50B7","\u64CD","\u5782","\u79CB","\u5B9C","\u6C2B","\u5957","\u7763","\u632F","\u67B6","\u4EAE","\u672B","\u61B2","\u6176","\u7DE8","\u725B","\u89F8","\u6620","\u96F7","\u92B7","\u8A69","\u5EA7","\u5C45","\u6293","\u88C2","\u80DE","\u547C","\u5A18","\u666F","\u5A01","\u7DA0","\u6676","\u539A","\u76DF","\u8861","\u96DE","\u5B6B","\u5EF6","\u5371","\u81A0","\u5C4B","\u9109","\u81E8","\u9678","\u9867","\u6389","\u5440","\u71C8","\u6B72","\u63AA","\u675F","\u8010","\u5287","\u7389","\u8D99","\u8DF3","\u54E5","\u5B63","\u8AB2","\u51F1","\u80E1","\u984D","\u6B3E","\u7D39","\u5377","\u9F4A","\u5049","\u84B8","\u6B96","\u6C38","\u5B97","\u82D7","\u5DDD","\u7210","\u5CA9","\u5F31","\u96F6","\u694A","\u594F","\u6CBF","\u9732","\u687F","\u63A2","\u6ED1","\u93AE","\u98EF","\u6FC3","\u822A","\u61F7","\u8D95","\u5EAB","\u596A","\u4F0A","\u9748","\u7A05","\u9014","\u6EC5","\u8CFD","\u6B78","\u53EC","\u9F13","\u64AD","\u76E4","\u88C1","\u96AA","\u5EB7","\u552F","\u9304","\u83CC","\u7D14","\u501F","\u7CD6","\u84CB","\u6A6B","\u7B26","\u79C1","\u52AA","\u5802","\u57DF","\u69CD","\u6F64","\u5E45","\u54C8","\u7ADF","\u719F","\u87F2","\u6FA4","\u8166","\u58E4","\u78B3","\u6B50","\u904D","\u5074","\u5BE8","\u6562","\u5FB9","\u616E","\u659C","\u8584","\u5EAD","\u7D0D","\u5F48","\u98FC","\u4F38","\u6298","\u9EA5","\u6FD5","\u6697","\u8377","\u74E6","\u585E","\u5E8A","\u7BC9","\u60E1","\u6236","\u8A2A","\u5854","\u5947","\u900F","\u6881","\u5200","\u65CB","\u8DE1","\u5361","\u6C2F","\u9047","\u4EFD","\u6BD2","\u6CE5","\u9000","\u6D17","\u64FA","\u7070","\u5F69","\u8CE3","\u8017","\u590F","\u64C7","\u5FD9","\u9285","\u737B","\u786C","\u4E88","\u7E41","\u5708","\u96EA","\u51FD","\u4EA6","\u62BD","\u7BC7","\u9663","\u9670","\u4E01","\u5C3A","\u8FFD","\u5806","\u96C4","\u8FCE","\u6CDB","\u7238","\u6A13","\u907F","\u8B00","\u5678","\u91CE","\u8C6C","\u65D7","\u7D2F","\u504F","\u5178","\u9928","\u7D22","\u79E6","\u8102","\u6F6E","\u723A","\u8C46","\u5FFD","\u6258","\u9A5A","\u5851","\u907A","\u6108","\u6731","\u66FF","\u7E96","\u7C97","\u50BE","\u5C1A","\u75DB","\u695A","\u8B1D","\u596E","\u8CFC","\u78E8","\u541B","\u6C60","\u65C1","\u788E","\u9AA8","\u76E3","\u6355","\u5F1F","\u66B4","\u5272","\u8CAB","\u6B8A","\u91CB","\u8A5E","\u4EA1","\u58C1","\u9813","\u5BF6","\u5348","\u5875","\u805E","\u63ED","\u70AE","\u6B98","\u51AC","\u6A4B","\u5A66","\u8B66","\u7D9C","\u62DB","\u5433","\u4ED8","\u6D6E","\u906D","\u5F90","\u60A8","\u6416","\u8C37","\u8D0A","\u7BB1","\u9694","\u8A02","\u7537","\u5439","\u5712","\u7D1B","\u5510","\u6557","\u5B8B","\u73BB","\u5DE8","\u8015","\u5766","\u69AE","\u9589","\u7063","\u9375","\u51E1","\u99D0","\u934B","\u6551","\u6069","\u525D","\u51DD","\u9E7C","\u9F52","\u622A","\u7149","\u9EBB","\u7D21","\u7981","\u5EE2","\u76DB","\u7248","\u7DE9","\u6DE8","\u775B","\u660C","\u5A5A","\u6D89","\u7B52","\u5634","\u63D2","\u5CB8","\u6717","\u838A","\u8857","\u85CF","\u59D1","\u8CBF","\u8150","\u5974","\u5566","\u6163","\u4E58","\u5925","\u6062","\u52FB","\u7D17","\u624E","\u8FAF","\u8033","\u5F6A","\u81E3","\u5104","\u7483","\u62B5","\u8108","\u79C0","\u85A9","\u4FC4","\u7DB2","\u821E","\u5E97","\u5674","\u7E31","\u5BF8","\u6C57","\u639B","\u6D2A","\u8CC0","\u9583","\u67EC","\u7206","\u70EF","\u6D25","\u7A3B","\u7246","\u8EDF","\u52C7","\u50CF","\u6EFE","\u5398","\u8499","\u82B3","\u80AF","\u5761","\u67F1","\u76EA","\u817F","\u5100","\u65C5","\u5C3E","\u8ECB","\u51B0","\u8CA2","\u767B","\u9ECE","\u524A","\u947D","\u52D2","\u9003","\u969C","\u6C28","\u90ED","\u5CF0","\u5E63","\u6E2F","\u4F0F","\u8ECC","\u755D","\u7562","\u64E6","\u83AB","\u523A","\u6D6A","\u79D8","\u63F4","\u682A","\u5065","\u552E","\u80A1","\u5CF6","\u7518","\u6CE1","\u7761","\u7AE5","\u9444","\u6E6F","\u95A5","\u4F11","\u532F","\u820D","\u7267","\u7E5E","\u70B8","\u54F2","\u78F7","\u7E3E","\u670B","\u6DE1","\u5C16","\u555F","\u9677","\u67F4","\u5448","\u5F92","\u984F","\u6DDA","\u7A0D","\u5FD8","\u6CF5","\u85CD","\u62D6","\u6D1E","\u6388","\u93E1","\u8F9B","\u58EF","\u92D2","\u8CA7","\u865B","\u5F4E","\u6469","\u6CF0","\u5E7C","\u5EF7","\u5C0A","\u7A97","\u7DB1","\u5F04","\u96B8","\u7591","\u6C0F","\u5BAE","\u59D0","\u9707","\u745E","\u602A","\u5C24","\u7434","\u5FAA","\u63CF","\u819C","\u9055","\u593E","\u8170","\u7DE3","\u73E0","\u7AAE","\u68EE","\u679D","\u7AF9","\u6E9D","\u50AC","\u7E69","\u61B6","\u90A6","\u5269","\u5E78","\u6F3F","\u6B04","\u64C1","\u7259","\u8CAF","\u79AE","\u6FFE","\u9209","\u7D0B","\u7F77","\u62CD","\u54B1","\u558A","\u8896","\u57C3","\u52E4","\u7F70","\u7126","\u6F5B","\u4F0D","\u58A8","\u6B32","\u7E2B","\u59D3","\u520A","\u98FD","\u4EFF","\u734E","\u92C1","\u9B3C","\u9E97","\u8DE8","\u9ED8","\u6316","\u93C8","\u6383","\u559D","\u888B","\u70AD","\u6C61","\u5E55","\u8AF8","\u5F27","\u52F5","\u6885","\u5976","\u6F54","\u707D","\u821F","\u9451","\u82EF","\u8A1F","\u62B1","\u6BC0","\u61C2","\u5BD2","\u667A","\u57D4","\u5BC4","\u5C46","\u8E8D","\u6E21","\u6311","\u4E39","\u8271","\u8C9D","\u78B0","\u62D4","\u7239","\u6234","\u78BC","\u5922","\u82BD","\u7194","\u8D64","\u6F01","\u54ED","\u656C","\u9846","\u5954","\u925B","\u4EF2","\u864E","\u7A00","\u59B9","\u4E4F","\u73CD","\u7533","\u684C","\u9075","\u5141","\u9686","\u87BA","\u5009","\u9B4F","\u92B3","\u66C9","\u6C2E","\u517C","\u96B1","\u7919","\u8D6B","\u64A5","\u5FE0","\u8085","\u7F38","\u727D","\u6436","\u535A","\u5DE7","\u6BBC","\u5144","\u675C","\u8A0A","\u8AA0","\u78A7","\u7965","\u67EF","\u9801","\u5DE1","\u77E9","\u60B2","\u704C","\u9F61","\u502B","\u7968","\u5C0B","\u6842","\u92EA","\u8056","\u6050","\u6070","\u912D","\u8DA3","\u62AC","\u8352","\u9A30","\u8CBC","\u67D4","\u6EF4","\u731B","\u95CA","\u8F1B","\u59BB","\u586B","\u64A4","\u5132","\u7C3D","\u9B27","\u64FE","\u7D2B","\u7802","\u905E","\u6232","\u540A","\u9676","\u4F10","\u9935","\u7642","\u74F6","\u5A46","\u64AB","\u81C2","\u6478","\u5FCD","\u8766","\u881F","\u9130","\u80F8","\u978F","\u64E0","\u5076","\u68C4","\u69FD","\u52C1","\u4E73","\u9127","\u5409","\u4EC1","\u721B","\u78DA","\u79DF","\u70CF","\u8266","\u4F34","\u74DC","\u6DFA","\u4E19","\u66AB","\u71E5","\u6A61","\u67F3","\u8FF7","\u6696","\u724C","\u79E7","\u81BD","\u8A73","\u7C27","\u8E0F","\u74F7","\u8B5C","\u5446","\u8CD3","\u7CCA","\u6D1B","\u8F1D","\u61A4","\u7AF6","\u9699","\u6012","\u7C98","\u4E43","\u7DD2","\u80A9","\u7C4D","\u654F","\u5857","\u7199","\u7686","\u5075","\u61F8","\u6398","\u4EAB","\u7CFE","\u9192","\u72C2","\u9396","\u6DC0","\u6068","\u7272","\u9738","\u722C","\u8CDE","\u9006","\u73A9","\u9675","\u795D","\u79D2","\u6D59","\u8C8C","\u5F79","\u5F7C","\u6089","\u9D28","\u8DA8","\u9CF3","\u6668","\u755C","\u8F29","\u79E9","\u5375","\u7F72","\u68AF","\u708E","\u7058","\u68CB","\u9A45","\u7BE9","\u5CFD","\u5192","\u5565","\u58FD","\u8B6F","\u6D78","\u6CC9","\u5E3D","\u9072","\u77FD","\u7586","\u8CB8","\u6F0F","\u7A3F","\u51A0","\u5AE9","\u8105","\u82AF","\u7262","\u53DB","\u8755","\u5967","\u9CF4","\u5DBA","\u7F8A","\u6191","\u4E32","\u5858","\u7E6A","\u9175","\u878D","\u76C6","\u932B","\u5EDF","\u7C4C","\u51CD","\u8F14","\u651D","\u8972","\u7B4B","\u62D2","\u50DA","\u65F1","\u9240","\u9CE5","\u6F06","\u6C88","\u7709","\u758F","\u6DFB","\u68D2","\u7A57","\u785D","\u97D3","\u903C","\u626D","\u50D1","\u6DBC","\u633A","\u7897","\u683D","\u7092","\u676F","\u60A3","\u993E","\u52F8","\u8C6A","\u907C","\u52C3","\u9D3B","\u65E6","\u540F","\u62DC","\u72D7","\u57CB","\u8F25","\u63A9","\u98F2","\u642C","\u7F75","\u8FAD","\u52FE","\u6263","\u4F30","\u8523","\u7D68","\u9727","\u4E08","\u6735","\u59C6","\u64EC","\u5B87","\u8F2F","\u965D","\u96D5","\u511F","\u84C4","\u5D07","\u526A","\u5021","\u5EF3","\u54AC","\u99DB","\u85AF","\u5237","\u65A5","\u756A","\u8CE6","\u5949","\u4F5B","\u6F86","\u6F2B","\u66FC","\u6247","\u9223","\u6843","\u6276","\u4ED4","\u8FD4","\u4FD7","\u8667","\u8154","\u978B","\u68F1","\u8986","\u6846","\u6084","\u53D4","\u649E","\u9A19","\u52D8","\u65FA","\u6CB8","\u5B64","\u5410","\u5B5F","\u6E20","\u5C48","\u75BE","\u5999","\u60DC","\u4EF0","\u72E0","\u8139","\u8AE7","\u62CB","\u9EF4","\u6851","\u5D17","\u561B","\u8870","\u76DC","\u6EF2","\u81DF","\u8CF4","\u6E67","\u751C","\u66F9","\u95B1","\u808C","\u54E9","\u53B2","\u70F4","\u7DEF","\u6BC5","\u6628","\u507D","\u75C7","\u716E","\u5606","\u91D8","\u642D","\u8396","\u7C60","\u9177","\u5077","\u5F13","\u9310","\u6046","\u5091","\u5751","\u9F3B","\u7FFC","\u7DB8","\u6558","\u7344","\u902E","\u7F50","\u7D61","\u68DA","\u6291","\u81A8","\u852C","\u5BFA","\u9A5F","\u7A46","\u51B6","\u67AF","\u518A","\u5C4D","\u51F8","\u7D33","\u576F","\u72A7","\u7130","\u8F5F","\u6B23","\u6649","\u7626","\u79A6","\u9320","\u9326","\u55AA","\u65EC","\u935B","\u58DF","\u641C","\u64B2","\u9080","\u4EAD","\u916F","\u9081","\u8212","\u8106","\u9176","\u9592","\u6182","\u915A","\u9811","\u7FBD","\u6F32","\u5378","\u4ED7","\u966A","\u95E2","\u61F2","\u676D","\u59DA","\u809A","\u6349","\u98C4","\u6F02","\u6606","\u6B3A","\u543E","\u90CE","\u70F7","\u6C41","\u5475","\u98FE","\u856D","\u96C5","\u90F5","\u9077","\u71D5","\u6492","\u59FB","\u8D74","\u5BB4","\u7169","\u50B5","\u5E33","\u6591","\u9234","\u65E8","\u9187","\u8463","\u9905","\u96DB","\u59FF","\u62CC","\u5085","\u8179","\u59A5","\u63C9","\u8CE2","\u62C6","\u6B6A","\u8461","\u80FA","\u4E1F","\u6D69","\u5FBD","\u6602","\u588A","\u64CB","\u89BD","\u8CAA","\u6170","\u7E73","\u6C6A","\u614C","\u99AE","\u8AFE","\u59DC","\u8ABC","\u5147","\u52A3","\u8AA3","\u8000","\u660F","\u8EBA","\u76C8","\u9A0E","\u55AC","\u6EAA","\u53E2","\u76E7","\u62B9","\u60B6","\u8AEE","\u522E","\u99D5","\u7E9C","\u609F","\u6458","\u927A","\u64F2","\u9817","\u5E7B","\u67C4","\u60E0","\u6158","\u4F73","\u4EC7","\u81D8","\u7AA9","\u6ECC","\u528D","\u77A7","\u5821","\u6F51","\u8525","\u7F69","\u970D","\u6488","\u80CE","\u84BC","\u6FF1","\u5006","\u6345","\u6E58","\u780D","\u971E","\u90B5","\u8404","\u760B","\u6DEE","\u9042","\u718A","\u7CDE","\u70D8","\u5BBF","\u6A94","\u6208","\u99C1","\u5AC2","\u88D5","\u5F99","\u7BAD","\u6350","\u8178","\u6490","\u66EC","\u8FA8","\u6BBF","\u84EE","\u6524","\u652A","\u91AC","\u5C4F","\u75AB","\u54C0","\u8521","\u5835","\u6CAB","\u76BA","\u66A2","\u758A","\u95A3","\u840A","\u6572","\u8F44","\u9264","\u75D5","\u58E9","\u5DF7","\u9913","\u798D","\u4E18","\u7384","\u6E9C","\u66F0","\u908F","\u5F6D","\u5617","\u537F","\u59A8","\u8247","\u541E","\u97CB","\u6028","\u77EE","\u6B47"]'), $d = JSON.parse('["\u1100\u1161\u1100\u1167\u11A8","\u1100\u1161\u1101\u1173\u11B7","\u1100\u1161\u1102\u1161\u11AB","\u1100\u1161\u1102\u1173\u11BC","\u1100\u1161\u1103\u1173\u11A8","\u1100\u1161\u1105\u1173\u110E\u1175\u11B7","\u1100\u1161\u1106\u116E\u11B7","\u1100\u1161\u1107\u1161\u11BC","\u1100\u1161\u1109\u1161\u11BC","\u1100\u1161\u1109\u1173\u11B7","\u1100\u1161\u110B\u116E\u11AB\u1103\u1166","\u1100\u1161\u110B\u1173\u11AF","\u1100\u1161\u110B\u1175\u1103\u1173","\u1100\u1161\u110B\u1175\u11B8","\u1100\u1161\u110C\u1161\u11BC","\u1100\u1161\u110C\u1165\u11BC","\u1100\u1161\u110C\u1169\u11A8","\u1100\u1161\u110C\u116E\u11A8","\u1100\u1161\u11A8\u110B\u1169","\u1100\u1161\u11A8\u110C\u1161","\u1100\u1161\u11AB\u1100\u1167\u11A8","\u1100\u1161\u11AB\u1107\u116E","\u1100\u1161\u11AB\u1109\u1165\u11B8","\u1100\u1161\u11AB\u110C\u1161\u11BC","\u1100\u1161\u11AB\u110C\u1165\u11B8","\u1100\u1161\u11AB\u1111\u1161\u11AB","\u1100\u1161\u11AF\u1103\u1173\u11BC","\u1100\u1161\u11AF\u1107\u1175","\u1100\u1161\u11AF\u1109\u1162\u11A8","\u1100\u1161\u11AF\u110C\u1173\u11BC","\u1100\u1161\u11B7\u1100\u1161\u11A8","\u1100\u1161\u11B7\u1100\u1175","\u1100\u1161\u11B7\u1109\u1169","\u1100\u1161\u11B7\u1109\u116E\u1109\u1165\u11BC","\u1100\u1161\u11B7\u110C\u1161","\u1100\u1161\u11B7\u110C\u1165\u11BC","\u1100\u1161\u11B8\u110C\u1161\u1100\u1175","\u1100\u1161\u11BC\u1102\u1161\u11B7","\u1100\u1161\u11BC\u1103\u1161\u11BC","\u1100\u1161\u11BC\u1103\u1169","\u1100\u1161\u11BC\u1105\u1167\u11A8\u1112\u1175","\u1100\u1161\u11BC\u1107\u1167\u11AB","\u1100\u1161\u11BC\u1107\u116E\u11A8","\u1100\u1161\u11BC\u1109\u1161","\u1100\u1161\u11BC\u1109\u116E\u1105\u1163\u11BC","\u1100\u1161\u11BC\u110B\u1161\u110C\u1175","\u1100\u1161\u11BC\u110B\u116F\u11AB\u1103\u1169","\u1100\u1161\u11BC\u110B\u1174","\u1100\u1161\u11BC\u110C\u1166","\u1100\u1161\u11BC\u110C\u1169","\u1100\u1161\u11C0\u110B\u1175","\u1100\u1162\u1100\u116E\u1105\u1175","\u1100\u1162\u1102\u1161\u1105\u1175","\u1100\u1162\u1107\u1161\u11BC","\u1100\u1162\u1107\u1167\u11AF","\u1100\u1162\u1109\u1165\u11AB","\u1100\u1162\u1109\u1165\u11BC","\u1100\u1162\u110B\u1175\u11AB","\u1100\u1162\u11A8\u1100\u116A\u11AB\u110C\u1165\u11A8","\u1100\u1165\u1109\u1175\u11AF","\u1100\u1165\u110B\u1162\u11A8","\u1100\u1165\u110B\u116E\u11AF","\u1100\u1165\u110C\u1175\u11BA","\u1100\u1165\u1111\u116E\u11B7","\u1100\u1165\u11A8\u110C\u1165\u11BC","\u1100\u1165\u11AB\u1100\u1161\u11BC","\u1100\u1165\u11AB\u1106\u116E\u11AF","\u1100\u1165\u11AB\u1109\u1165\u11AF","\u1100\u1165\u11AB\u110C\u1169","\u1100\u1165\u11AB\u110E\u116E\u11A8","\u1100\u1165\u11AF\u110B\u1173\u11B7","\u1100\u1165\u11B7\u1109\u1161","\u1100\u1165\u11B7\u1110\u1169","\u1100\u1166\u1109\u1175\u1111\u1161\u11AB","\u1100\u1166\u110B\u1175\u11B7","\u1100\u1167\u110B\u116E\u11AF","\u1100\u1167\u11AB\u1112\u1162","\u1100\u1167\u11AF\u1100\u116A","\u1100\u1167\u11AF\u1100\u116E\u11A8","\u1100\u1167\u11AF\u1105\u1169\u11AB","\u1100\u1167\u11AF\u1109\u1165\u11A8","\u1100\u1167\u11AF\u1109\u1173\u11BC","\u1100\u1167\u11AF\u1109\u1175\u11B7","\u1100\u1167\u11AF\u110C\u1165\u11BC","\u1100\u1167\u11AF\u1112\u1169\u11AB","\u1100\u1167\u11BC\u1100\u1168","\u1100\u1167\u11BC\u1100\u1169","\u1100\u1167\u11BC\u1100\u1175","\u1100\u1167\u11BC\u1105\u1167\u11A8","\u1100\u1167\u11BC\u1107\u1169\u11A8\u1100\u116E\u11BC","\u1100\u1167\u11BC\u1107\u1175","\u1100\u1167\u11BC\u1109\u1161\u11BC\u1103\u1169","\u1100\u1167\u11BC\u110B\u1167\u11BC","\u1100\u1167\u11BC\u110B\u116E","\u1100\u1167\u11BC\u110C\u1162\u11BC","\u1100\u1167\u11BC\u110C\u1166","\u1100\u1167\u11BC\u110C\u116E","\u1100\u1167\u11BC\u110E\u1161\u11AF","\u1100\u1167\u11BC\u110E\u1175","\u1100\u1167\u11BC\u1112\u1163\u11BC","\u1100\u1167\u11BC\u1112\u1165\u11B7","\u1100\u1168\u1100\u1169\u11A8","\u1100\u1168\u1103\u1161\u11AB","\u1100\u1168\u1105\u1161\u11AB","\u1100\u1168\u1109\u1161\u11AB","\u1100\u1168\u1109\u1169\u11A8","\u1100\u1168\u110B\u1163\u11A8","\u1100\u1168\u110C\u1165\u11AF","\u1100\u1168\u110E\u1173\u11BC","\u1100\u1168\u1112\u116C\u11A8","\u1100\u1169\u1100\u1162\u11A8","\u1100\u1169\u1100\u116E\u1105\u1167","\u1100\u1169\u1100\u116E\u11BC","\u1100\u1169\u1100\u1173\u11B8","\u1100\u1169\u1103\u1173\u11BC\u1112\u1161\u11A8\u1109\u1162\u11BC","\u1100\u1169\u1106\u116E\u1109\u1175\u11AB","\u1100\u1169\u1106\u1175\u11AB","\u1100\u1169\u110B\u1163\u11BC\u110B\u1175","\u1100\u1169\u110C\u1161\u11BC","\u1100\u1169\u110C\u1165\u11AB","\u1100\u1169\u110C\u1175\u11B8","\u1100\u1169\u110E\u116E\u11BA\u1100\u1161\u1105\u116E","\u1100\u1169\u1110\u1169\u11BC","\u1100\u1169\u1112\u1163\u11BC","\u1100\u1169\u11A8\u1109\u1175\u11A8","\u1100\u1169\u11AF\u1106\u1169\u11A8","\u1100\u1169\u11AF\u110D\u1161\u1100\u1175","\u1100\u1169\u11AF\u1111\u1173","\u1100\u1169\u11BC\u1100\u1161\u11AB","\u1100\u1169\u11BC\u1100\u1162","\u1100\u1169\u11BC\u1100\u1167\u11A8","\u1100\u1169\u11BC\u1100\u116E\u11AB","\u1100\u1169\u11BC\u1100\u1173\u11B8","\u1100\u1169\u11BC\u1100\u1175","\u1100\u1169\u11BC\u1103\u1169\u11BC","\u1100\u1169\u11BC\u1106\u116E\u110B\u116F\u11AB","\u1100\u1169\u11BC\u1107\u116E","\u1100\u1169\u11BC\u1109\u1161","\u1100\u1169\u11BC\u1109\u1175\u11A8","\u1100\u1169\u11BC\u110B\u1165\u11B8","\u1100\u1169\u11BC\u110B\u1167\u11AB","\u1100\u1169\u11BC\u110B\u116F\u11AB","\u1100\u1169\u11BC\u110C\u1161\u11BC","\u1100\u1169\u11BC\u110D\u1161","\u1100\u1169\u11BC\u110E\u1162\u11A8","\u1100\u1169\u11BC\u1110\u1169\u11BC","\u1100\u1169\u11BC\u1111\u1169","\u1100\u1169\u11BC\u1112\u1161\u11BC","\u1100\u1169\u11BC\u1112\u1172\u110B\u1175\u11AF","\u1100\u116A\u1106\u1169\u11A8","\u1100\u116A\u110B\u1175\u11AF","\u1100\u116A\u110C\u1161\u11BC","\u1100\u116A\u110C\u1165\u11BC","\u1100\u116A\u1112\u1161\u11A8","\u1100\u116A\u11AB\u1100\u1162\u11A8","\u1100\u116A\u11AB\u1100\u1168","\u1100\u116A\u11AB\u1100\u116A\u11BC","\u1100\u116A\u11AB\u1102\u1167\u11B7","\u1100\u116A\u11AB\u1105\u1161\u11B7","\u1100\u116A\u11AB\u1105\u1167\u11AB","\u1100\u116A\u11AB\u1105\u1175","\u1100\u116A\u11AB\u1109\u1173\u11B8","\u1100\u116A\u11AB\u1109\u1175\u11B7","\u1100\u116A\u11AB\u110C\u1165\u11B7","\u1100\u116A\u11AB\u110E\u1161\u11AF","\u1100\u116A\u11BC\u1100\u1167\u11BC","\u1100\u116A\u11BC\u1100\u1169","\u1100\u116A\u11BC\u110C\u1161\u11BC","\u1100\u116A\u11BC\u110C\u116E","\u1100\u116C\u1105\u1169\u110B\u116E\u11B7","\u1100\u116C\u11BC\u110C\u1161\u11BC\u1112\u1175","\u1100\u116D\u1100\u116A\u1109\u1165","\u1100\u116D\u1106\u116E\u11AB","\u1100\u116D\u1107\u1169\u11A8","\u1100\u116D\u1109\u1175\u11AF","\u1100\u116D\u110B\u1163\u11BC","\u1100\u116D\u110B\u1172\u11A8","\u1100\u116D\u110C\u1161\u11BC","\u1100\u116D\u110C\u1175\u11A8","\u1100\u116D\u1110\u1169\u11BC","\u1100\u116D\u1112\u116A\u11AB","\u1100\u116D\u1112\u116E\u11AB","\u1100\u116E\u1100\u1167\u11BC","\u1100\u116E\u1105\u1173\u11B7","\u1100\u116E\u1106\u1165\u11BC","\u1100\u116E\u1107\u1167\u11AF","\u1100\u116E\u1107\u116E\u11AB","\u1100\u116E\u1109\u1165\u11A8","\u1100\u116E\u1109\u1165\u11BC","\u1100\u116E\u1109\u1169\u11A8","\u1100\u116E\u110B\u1167\u11A8","\u1100\u116E\u110B\u1175\u11B8","\u1100\u116E\u110E\u1165\u11BC","\u1100\u116E\u110E\u1166\u110C\u1165\u11A8","\u1100\u116E\u11A8\u1100\u1161","\u1100\u116E\u11A8\u1100\u1175","\u1100\u116E\u11A8\u1102\u1162","\u1100\u116E\u11A8\u1105\u1175\u11B8","\u1100\u116E\u11A8\u1106\u116E\u11AF","\u1100\u116E\u11A8\u1106\u1175\u11AB","\u1100\u116E\u11A8\u1109\u116E","\u1100\u116E\u11A8\u110B\u1165","\u1100\u116E\u11A8\u110B\u116A\u11BC","\u1100\u116E\u11A8\u110C\u1165\u11A8","\u1100\u116E\u11A8\u110C\u1166","\u1100\u116E\u11A8\u1112\u116C","\u1100\u116E\u11AB\u1103\u1162","\u1100\u116E\u11AB\u1109\u1161","\u1100\u116E\u11AB\u110B\u1175\u11AB","\u1100\u116E\u11BC\u1100\u1173\u11A8\u110C\u1165\u11A8","\u1100\u116F\u11AB\u1105\u1175","\u1100\u116F\u11AB\u110B\u1171","\u1100\u116F\u11AB\u1110\u116E","\u1100\u1171\u1100\u116E\u11A8","\u1100\u1171\u1109\u1175\u11AB","\u1100\u1172\u110C\u1165\u11BC","\u1100\u1172\u110E\u1175\u11A8","\u1100\u1172\u11AB\u1112\u1167\u11BC","\u1100\u1173\u1102\u1161\u11AF","\u1100\u1173\u1102\u1163\u11BC","\u1100\u1173\u1102\u1173\u11AF","\u1100\u1173\u1105\u1165\u1102\u1161","\u1100\u1173\u1105\u116E\u11B8","\u1100\u1173\u1105\u1173\u11BA","\u1100\u1173\u1105\u1175\u11B7","\u1100\u1173\u110C\u1166\u1109\u1165\u110B\u1163","\u1100\u1173\u1110\u1169\u1105\u1169\u11A8","\u1100\u1173\u11A8\u1107\u1169\u11A8","\u1100\u1173\u11A8\u1112\u1175","\u1100\u1173\u11AB\u1100\u1165","\u1100\u1173\u11AB\u1100\u116D","\u1100\u1173\u11AB\u1105\u1162","\u1100\u1173\u11AB\u1105\u1169","\u1100\u1173\u11AB\u1106\u116E","\u1100\u1173\u11AB\u1107\u1169\u11AB","\u1100\u1173\u11AB\u110B\u116F\u11AB","\u1100\u1173\u11AB\u110B\u1172\u11A8","\u1100\u1173\u11AB\u110E\u1165","\u1100\u1173\u11AF\u110A\u1175","\u1100\u1173\u11AF\u110C\u1161","\u1100\u1173\u11B7\u1100\u1161\u11BC\u1109\u1161\u11AB","\u1100\u1173\u11B7\u1100\u1169","\u1100\u1173\u11B7\u1102\u1167\u11AB","\u1100\u1173\u11B7\u1106\u1166\u1103\u1161\u11AF","\u1100\u1173\u11B7\u110B\u1162\u11A8","\u1100\u1173\u11B7\u110B\u1167\u11AB","\u1100\u1173\u11B7\u110B\u116D\u110B\u1175\u11AF","\u1100\u1173\u11B7\u110C\u1175","\u1100\u1173\u11BC\u110C\u1165\u11BC\u110C\u1165\u11A8","\u1100\u1175\u1100\u1161\u11AB","\u1100\u1175\u1100\u116A\u11AB","\u1100\u1175\u1102\u1167\u11B7","\u1100\u1175\u1102\u1173\u11BC","\u1100\u1175\u1103\u1169\u11A8\u1100\u116D","\u1100\u1175\u1103\u116E\u11BC","\u1100\u1175\u1105\u1169\u11A8","\u1100\u1175\u1105\u1173\u11B7","\u1100\u1175\u1107\u1165\u11B8","\u1100\u1175\u1107\u1169\u11AB","\u1100\u1175\u1107\u116E\u11AB","\u1100\u1175\u1108\u1173\u11B7","\u1100\u1175\u1109\u116E\u11A8\u1109\u1161","\u1100\u1175\u1109\u116E\u11AF","\u1100\u1175\u110B\u1165\u11A8","\u1100\u1175\u110B\u1165\u11B8","\u1100\u1175\u110B\u1169\u11AB","\u1100\u1175\u110B\u116E\u11AB","\u1100\u1175\u110B\u116F\u11AB","\u1100\u1175\u110C\u1165\u11A8","\u1100\u1175\u110C\u116E\u11AB","\u1100\u1175\u110E\u1175\u11B7","\u1100\u1175\u1112\u1169\u11AB","\u1100\u1175\u1112\u116C\u11A8","\u1100\u1175\u11AB\u1100\u1173\u11B8","\u1100\u1175\u11AB\u110C\u1161\u11BC","\u1100\u1175\u11AF\u110B\u1175","\u1100\u1175\u11B7\u1107\u1161\u11B8","\u1100\u1175\u11B7\u110E\u1175","\u1100\u1175\u11B7\u1111\u1169\u1100\u1169\u11BC\u1112\u1161\u11BC","\u1101\u1161\u11A8\u1103\u116E\u1100\u1175","\u1101\u1161\u11B7\u1108\u1161\u11A8","\u1101\u1162\u1103\u1161\u11AF\u110B\u1173\u11B7","\u1101\u1162\u1109\u1169\u1100\u1173\u11B7","\u1101\u1165\u11B8\u110C\u1175\u11AF","\u1101\u1169\u11A8\u1103\u1162\u1100\u1175","\u1101\u1169\u11BE\u110B\u1175\u11C1","\u1102\u1161\u1103\u1173\u11AF\u110B\u1175","\u1102\u1161\u1105\u1161\u11AB\u1112\u1175","\u1102\u1161\u1106\u1165\u110C\u1175","\u1102\u1161\u1106\u116E\u11AF","\u1102\u1161\u110E\u1175\u11B7\u1107\u1161\u11AB","\u1102\u1161\u1112\u1173\u11AF","\u1102\u1161\u11A8\u110B\u1167\u11B8","\u1102\u1161\u11AB\u1107\u1161\u11BC","\u1102\u1161\u11AF\u1100\u1162","\u1102\u1161\u11AF\u110A\u1175","\u1102\u1161\u11AF\u110D\u1161","\u1102\u1161\u11B7\u1102\u1167","\u1102\u1161\u11B7\u1103\u1162\u1106\u116E\u11AB","\u1102\u1161\u11B7\u1106\u1162","\u1102\u1161\u11B7\u1109\u1161\u11AB","\u1102\u1161\u11B7\u110C\u1161","\u1102\u1161\u11B7\u1111\u1167\u11AB","\u1102\u1161\u11B7\u1112\u1161\u11A8\u1109\u1162\u11BC","\u1102\u1161\u11BC\u1107\u1175","\u1102\u1161\u11C0\u1106\u1161\u11AF","\u1102\u1162\u1102\u1167\u11AB","\u1102\u1162\u110B\u116D\u11BC","\u1102\u1162\u110B\u1175\u11AF","\u1102\u1162\u11B7\u1107\u1175","\u1102\u1162\u11B7\u1109\u1162","\u1102\u1162\u11BA\u1106\u116E\u11AF","\u1102\u1162\u11BC\u1103\u1169\u11BC","\u1102\u1162\u11BC\u1106\u1167\u11AB","\u1102\u1162\u11BC\u1107\u1161\u11BC","\u1102\u1162\u11BC\u110C\u1161\u11BC\u1100\u1169","\u1102\u1166\u11A8\u1110\u1161\u110B\u1175","\u1102\u1166\u11BA\u110D\u1162","\u1102\u1169\u1103\u1169\u11BC","\u1102\u1169\u1105\u1161\u11AB\u1109\u1162\u11A8","\u1102\u1169\u1105\u1167\u11A8","\u1102\u1169\u110B\u1175\u11AB","\u1102\u1169\u11A8\u110B\u1173\u11B7","\u1102\u1169\u11A8\u110E\u1161","\u1102\u1169\u11A8\u1112\u116A","\u1102\u1169\u11AB\u1105\u1175","\u1102\u1169\u11AB\u1106\u116E\u11AB","\u1102\u1169\u11AB\u110C\u1162\u11BC","\u1102\u1169\u11AF\u110B\u1175","\u1102\u1169\u11BC\u1100\u116E","\u1102\u1169\u11BC\u1103\u1161\u11B7","\u1102\u1169\u11BC\u1106\u1175\u11AB","\u1102\u1169\u11BC\u1107\u116E","\u1102\u1169\u11BC\u110B\u1165\u11B8","\u1102\u1169\u11BC\u110C\u1161\u11BC","\u1102\u1169\u11BC\u110E\u1169\u11AB","\u1102\u1169\u11C1\u110B\u1175","\u1102\u116E\u11AB\u1103\u1169\u11BC\u110C\u1161","\u1102\u116E\u11AB\u1106\u116E\u11AF","\u1102\u116E\u11AB\u110A\u1165\u11B8","\u1102\u1172\u110B\u116D\u11A8","\u1102\u1173\u1101\u1175\u11B7","\u1102\u1173\u11A8\u1103\u1162","\u1102\u1173\u11BC\u1103\u1169\u11BC\u110C\u1165\u11A8","\u1102\u1173\u11BC\u1105\u1167\u11A8","\u1103\u1161\u1107\u1161\u11BC","\u1103\u1161\u110B\u1163\u11BC\u1109\u1165\u11BC","\u1103\u1161\u110B\u1173\u11B7","\u1103\u1161\u110B\u1175\u110B\u1165\u1110\u1173","\u1103\u1161\u1112\u1162\u11BC","\u1103\u1161\u11AB\u1100\u1168","\u1103\u1161\u11AB\u1100\u1169\u11AF","\u1103\u1161\u11AB\u1103\u1169\u11A8","\u1103\u1161\u11AB\u1106\u1161\u11BA","\u1103\u1161\u11AB\u1109\u116E\u11AB","\u1103\u1161\u11AB\u110B\u1165","\u1103\u1161\u11AB\u110B\u1171","\u1103\u1161\u11AB\u110C\u1165\u11B7","\u1103\u1161\u11AB\u110E\u1166","\u1103\u1161\u11AB\u110E\u116E","\u1103\u1161\u11AB\u1111\u1167\u11AB","\u1103\u1161\u11AB\u1111\u116E\u11BC","\u1103\u1161\u11AF\u1100\u1163\u11AF","\u1103\u1161\u11AF\u1105\u1165","\u1103\u1161\u11AF\u1105\u1167\u11A8","\u1103\u1161\u11AF\u1105\u1175","\u1103\u1161\u11B0\u1100\u1169\u1100\u1175","\u1103\u1161\u11B7\u1103\u1161\u11BC","\u1103\u1161\u11B7\u1107\u1162","\u1103\u1161\u11B7\u110B\u116D","\u1103\u1161\u11B7\u110B\u1175\u11B7","\u1103\u1161\u11B8\u1107\u1167\u11AB","\u1103\u1161\u11B8\u110C\u1161\u11BC","\u1103\u1161\u11BC\u1100\u1173\u11AB","\u1103\u1161\u11BC\u1107\u116E\u11AB\u1100\u1161\u11AB","\u1103\u1161\u11BC\u110B\u1167\u11AB\u1112\u1175","\u1103\u1161\u11BC\u110C\u1161\u11BC","\u1103\u1162\u1100\u1172\u1106\u1169","\u1103\u1162\u1102\u1161\u11BD","\u1103\u1162\u1103\u1161\u11AB\u1112\u1175","\u1103\u1162\u1103\u1161\u11B8","\u1103\u1162\u1103\u1169\u1109\u1175","\u1103\u1162\u1105\u1163\u11A8","\u1103\u1162\u1105\u1163\u11BC","\u1103\u1162\u1105\u1172\u11A8","\u1103\u1162\u1106\u116E\u11AB","\u1103\u1162\u1107\u116E\u1107\u116E\u11AB","\u1103\u1162\u1109\u1175\u11AB","\u1103\u1162\u110B\u1173\u11BC","\u1103\u1162\u110C\u1161\u11BC","\u1103\u1162\u110C\u1165\u11AB","\u1103\u1162\u110C\u1165\u11B8","\u1103\u1162\u110C\u116E\u11BC","\u1103\u1162\u110E\u1162\u11A8","\u1103\u1162\u110E\u116E\u11AF","\u1103\u1162\u110E\u116E\u11BC","\u1103\u1162\u1110\u1169\u11BC\u1105\u1167\u11BC","\u1103\u1162\u1112\u1161\u11A8","\u1103\u1162\u1112\u1161\u11AB\u1106\u1175\u11AB\u1100\u116E\u11A8","\u1103\u1162\u1112\u1161\u11B8\u1109\u1175\u11AF","\u1103\u1162\u1112\u1167\u11BC","\u1103\u1165\u11BC\u110B\u1165\u1105\u1175","\u1103\u1166\u110B\u1175\u1110\u1173","\u1103\u1169\u1103\u1162\u110E\u1166","\u1103\u1169\u1103\u1165\u11A8","\u1103\u1169\u1103\u116E\u11A8","\u1103\u1169\u1106\u1161\u11BC","\u1103\u1169\u1109\u1165\u1100\u116A\u11AB","\u1103\u1169\u1109\u1175\u11B7","\u1103\u1169\u110B\u116E\u11B7","\u1103\u1169\u110B\u1175\u11B8","\u1103\u1169\u110C\u1161\u1100\u1175","\u1103\u1169\u110C\u1165\u1112\u1175","\u1103\u1169\u110C\u1165\u11AB","\u1103\u1169\u110C\u116E\u11BC","\u1103\u1169\u110E\u1161\u11A8","\u1103\u1169\u11A8\u1100\u1161\u11B7","\u1103\u1169\u11A8\u1105\u1175\u11B8","\u1103\u1169\u11A8\u1109\u1165","\u1103\u1169\u11A8\u110B\u1175\u11AF","\u1103\u1169\u11A8\u110E\u1161\u11BC\u110C\u1165\u11A8","\u1103\u1169\u11BC\u1112\u116A\u110E\u1162\u11A8","\u1103\u1171\u11BA\u1106\u1169\u1109\u1173\u11B8","\u1103\u1171\u11BA\u1109\u1161\u11AB","\u1104\u1161\u11AF\u110B\u1161\u110B\u1175","\u1106\u1161\u1102\u116E\u1105\u1161","\u1106\u1161\u1102\u1173\u11AF","\u1106\u1161\u1103\u1161\u11BC","\u1106\u1161\u1105\u1161\u1110\u1169\u11AB","\u1106\u1161\u1105\u1167\u11AB","\u1106\u1161\u1106\u116E\u1105\u1175","\u1106\u1161\u1109\u1161\u110C\u1175","\u1106\u1161\u110B\u1163\u11A8","\u1106\u1161\u110B\u116D\u1102\u1166\u110C\u1173","\u1106\u1161\u110B\u1173\u11AF","\u1106\u1161\u110B\u1173\u11B7","\u1106\u1161\u110B\u1175\u110F\u1173","\u1106\u1161\u110C\u116E\u11BC","\u1106\u1161\u110C\u1175\u1106\u1161\u11A8","\u1106\u1161\u110E\u1161\u11AB\u1100\u1161\u110C\u1175","\u1106\u1161\u110E\u1161\u11AF","\u1106\u1161\u1112\u1173\u11AB","\u1106\u1161\u11A8\u1100\u1165\u11AF\u1105\u1175","\u1106\u1161\u11A8\u1102\u1162","\u1106\u1161\u11A8\u1109\u1161\u11BC","\u1106\u1161\u11AB\u1102\u1161\u11B7","\u1106\u1161\u11AB\u1103\u116E","\u1106\u1161\u11AB\u1109\u1166","\u1106\u1161\u11AB\u110B\u1163\u11A8","\u1106\u1161\u11AB\u110B\u1175\u11AF","\u1106\u1161\u11AB\u110C\u1165\u11B7","\u1106\u1161\u11AB\u110C\u1169\u11A8","\u1106\u1161\u11AB\u1112\u116A","\u1106\u1161\u11AD\u110B\u1175","\u1106\u1161\u11AF\u1100\u1175","\u1106\u1161\u11AF\u110A\u1173\u11B7","\u1106\u1161\u11AF\u1110\u116E","\u1106\u1161\u11B7\u1103\u1162\u1105\u1169","\u1106\u1161\u11BC\u110B\u116F\u11AB\u1100\u1167\u11BC","\u1106\u1162\u1102\u1167\u11AB","\u1106\u1162\u1103\u1161\u11AF","\u1106\u1162\u1105\u1167\u11A8","\u1106\u1162\u1107\u1165\u11AB","\u1106\u1162\u1109\u1173\u110F\u1165\u11B7","\u1106\u1162\u110B\u1175\u11AF","\u1106\u1162\u110C\u1161\u11BC","\u1106\u1162\u11A8\u110C\u116E","\u1106\u1165\u11A8\u110B\u1175","\u1106\u1165\u11AB\u110C\u1165","\u1106\u1165\u11AB\u110C\u1175","\u1106\u1165\u11AF\u1105\u1175","\u1106\u1166\u110B\u1175\u11AF","\u1106\u1167\u1102\u1173\u1105\u1175","\u1106\u1167\u110E\u1175\u11AF","\u1106\u1167\u11AB\u1103\u1161\u11B7","\u1106\u1167\u11AF\u110E\u1175","\u1106\u1167\u11BC\u1103\u1161\u11AB","\u1106\u1167\u11BC\u1105\u1167\u11BC","\u1106\u1167\u11BC\u110B\u1168","\u1106\u1167\u11BC\u110B\u1174","\u1106\u1167\u11BC\u110C\u1165\u11AF","\u1106\u1167\u11BC\u110E\u1175\u11BC","\u1106\u1167\u11BC\u1112\u1161\u11B7","\u1106\u1169\u1100\u1173\u11B7","\u1106\u1169\u1102\u1175\u1110\u1165","\u1106\u1169\u1103\u1166\u11AF","\u1106\u1169\u1103\u1173\u11AB","\u1106\u1169\u1107\u1165\u11B7","\u1106\u1169\u1109\u1173\u11B8","\u1106\u1169\u110B\u1163\u11BC","\u1106\u1169\u110B\u1175\u11B7","\u1106\u1169\u110C\u1169\u1105\u1175","\u1106\u1169\u110C\u1175\u11B8","\u1106\u1169\u1110\u116E\u11BC\u110B\u1175","\u1106\u1169\u11A8\u1100\u1165\u11AF\u110B\u1175","\u1106\u1169\u11A8\u1105\u1169\u11A8","\u1106\u1169\u11A8\u1109\u1161","\u1106\u1169\u11A8\u1109\u1169\u1105\u1175","\u1106\u1169\u11A8\u1109\u116E\u11B7","\u1106\u1169\u11A8\u110C\u1165\u11A8","\u1106\u1169\u11A8\u1111\u116D","\u1106\u1169\u11AF\u1105\u1162","\u1106\u1169\u11B7\u1106\u1162","\u1106\u1169\u11B7\u1106\u116E\u1100\u1166","\u1106\u1169\u11B7\u1109\u1161\u11AF","\u1106\u1169\u11B7\u1109\u1169\u11A8","\u1106\u1169\u11B7\u110C\u1175\u11BA","\u1106\u1169\u11B7\u1110\u1169\u11BC","\u1106\u1169\u11B8\u1109\u1175","\u1106\u116E\u1100\u116A\u11AB\u1109\u1175\u11B7","\u1106\u116E\u1100\u116E\u11BC\u1112\u116A","\u1106\u116E\u1103\u1165\u110B\u1171","\u1106\u116E\u1103\u1165\u11B7","\u1106\u116E\u1105\u1173\u11C1","\u1106\u116E\u1109\u1173\u11AB","\u1106\u116E\u110B\u1165\u11BA","\u1106\u116E\u110B\u1167\u11A8","\u1106\u116E\u110B\u116D\u11BC","\u1106\u116E\u110C\u1169\u1100\u1165\u11AB","\u1106\u116E\u110C\u1175\u1100\u1162","\u1106\u116E\u110E\u1165\u11A8","\u1106\u116E\u11AB\u1100\u116E","\u1106\u116E\u11AB\u1103\u1173\u11A8","\u1106\u116E\u11AB\u1107\u1165\u11B8","\u1106\u116E\u11AB\u1109\u1165","\u1106\u116E\u11AB\u110C\u1166","\u1106\u116E\u11AB\u1112\u1161\u11A8","\u1106\u116E\u11AB\u1112\u116A","\u1106\u116E\u11AF\u1100\u1161","\u1106\u116E\u11AF\u1100\u1165\u11AB","\u1106\u116E\u11AF\u1100\u1167\u11AF","\u1106\u116E\u11AF\u1100\u1169\u1100\u1175","\u1106\u116E\u11AF\u1105\u1169\u11AB","\u1106\u116E\u11AF\u1105\u1175\u1112\u1161\u11A8","\u1106\u116E\u11AF\u110B\u1173\u11B7","\u1106\u116E\u11AF\u110C\u1175\u11AF","\u1106\u116E\u11AF\u110E\u1166","\u1106\u1175\u1100\u116E\u11A8","\u1106\u1175\u1103\u1175\u110B\u1165","\u1106\u1175\u1109\u1161\u110B\u1175\u11AF","\u1106\u1175\u1109\u116E\u11AF","\u1106\u1175\u110B\u1167\u11A8","\u1106\u1175\u110B\u116D\u11BC\u1109\u1175\u11AF","\u1106\u1175\u110B\u116E\u11B7","\u1106\u1175\u110B\u1175\u11AB","\u1106\u1175\u1110\u1175\u11BC","\u1106\u1175\u1112\u1169\u11AB","\u1106\u1175\u11AB\u1100\u1161\u11AB","\u1106\u1175\u11AB\u110C\u1169\u11A8","\u1106\u1175\u11AB\u110C\u116E","\u1106\u1175\u11AE\u110B\u1173\u11B7","\u1106\u1175\u11AF\u1100\u1161\u1105\u116E","\u1106\u1175\u11AF\u1105\u1175\u1106\u1175\u1110\u1165","\u1106\u1175\u11C0\u1107\u1161\u1103\u1161\u11A8","\u1107\u1161\u1100\u1161\u110C\u1175","\u1107\u1161\u1100\u116E\u1102\u1175","\u1107\u1161\u1102\u1161\u1102\u1161","\u1107\u1161\u1102\u1173\u11AF","\u1107\u1161\u1103\u1161\u11A8","\u1107\u1161\u1103\u1161\u11BA\u1100\u1161","\u1107\u1161\u1105\u1161\u11B7","\u1107\u1161\u110B\u1175\u1105\u1165\u1109\u1173","\u1107\u1161\u1110\u1161\u11BC","\u1107\u1161\u11A8\u1106\u116E\u11AF\u1100\u116A\u11AB","\u1107\u1161\u11A8\u1109\u1161","\u1107\u1161\u11A8\u1109\u116E","\u1107\u1161\u11AB\u1103\u1162","\u1107\u1161\u11AB\u1103\u1173\u1109\u1175","\u1107\u1161\u11AB\u1106\u1161\u11AF","\u1107\u1161\u11AB\u1107\u1161\u11AF","\u1107\u1161\u11AB\u1109\u1165\u11BC","\u1107\u1161\u11AB\u110B\u1173\u11BC","\u1107\u1161\u11AB\u110C\u1161\u11BC","\u1107\u1161\u11AB\u110C\u116E\u11A8","\u1107\u1161\u11AB\u110C\u1175","\u1107\u1161\u11AB\u110E\u1161\u11AB","\u1107\u1161\u11AE\u110E\u1175\u11B7","\u1107\u1161\u11AF\u1100\u1161\u1105\u1161\u11A8","\u1107\u1161\u11AF\u1100\u1165\u11AF\u110B\u1173\u11B7","\u1107\u1161\u11AF\u1100\u1167\u11AB","\u1107\u1161\u11AF\u1103\u1161\u11AF","\u1107\u1161\u11AF\u1105\u1166","\u1107\u1161\u11AF\u1106\u1169\u11A8","\u1107\u1161\u11AF\u1107\u1161\u1103\u1161\u11A8","\u1107\u1161\u11AF\u1109\u1162\u11BC","\u1107\u1161\u11AF\u110B\u1173\u11B7","\u1107\u1161\u11AF\u110C\u1161\u1100\u116E\u11A8","\u1107\u1161\u11AF\u110C\u1165\u11AB","\u1107\u1161\u11AF\u1110\u1169\u11B8","\u1107\u1161\u11AF\u1111\u116D","\u1107\u1161\u11B7\u1112\u1161\u1102\u1173\u11AF","\u1107\u1161\u11B8\u1100\u1173\u1105\u1173\u11BA","\u1107\u1161\u11B8\u1106\u1161\u11BA","\u1107\u1161\u11B8\u1109\u1161\u11BC","\u1107\u1161\u11B8\u1109\u1169\u11C0","\u1107\u1161\u11BC\u1100\u1173\u11B7","\u1107\u1161\u11BC\u1106\u1167\u11AB","\u1107\u1161\u11BC\u1106\u116E\u11AB","\u1107\u1161\u11BC\u1107\u1161\u1103\u1161\u11A8","\u1107\u1161\u11BC\u1107\u1165\u11B8","\u1107\u1161\u11BC\u1109\u1169\u11BC","\u1107\u1161\u11BC\u1109\u1175\u11A8","\u1107\u1161\u11BC\u110B\u1161\u11AB","\u1107\u1161\u11BC\u110B\u116E\u11AF","\u1107\u1161\u11BC\u110C\u1175","\u1107\u1161\u11BC\u1112\u1161\u11A8","\u1107\u1161\u11BC\u1112\u1162","\u1107\u1161\u11BC\u1112\u1163\u11BC","\u1107\u1162\u1100\u1167\u11BC","\u1107\u1162\u1101\u1169\u11B8","\u1107\u1162\u1103\u1161\u11AF","\u1107\u1162\u1103\u1173\u1106\u1175\u11AB\u1110\u1165\u11AB","\u1107\u1162\u11A8\u1103\u116E\u1109\u1161\u11AB","\u1107\u1162\u11A8\u1109\u1162\u11A8","\u1107\u1162\u11A8\u1109\u1165\u11BC","\u1107\u1162\u11A8\u110B\u1175\u11AB","\u1107\u1162\u11A8\u110C\u1166","\u1107\u1162\u11A8\u1112\u116A\u110C\u1165\u11B7","\u1107\u1165\u1105\u1173\u11BA","\u1107\u1165\u1109\u1165\u11BA","\u1107\u1165\u1110\u1173\u11AB","\u1107\u1165\u11AB\u1100\u1162","\u1107\u1165\u11AB\u110B\u1167\u11A8","\u1107\u1165\u11AB\u110C\u1175","\u1107\u1165\u11AB\u1112\u1169","\u1107\u1165\u11AF\u1100\u1173\u11B7","\u1107\u1165\u11AF\u1105\u1166","\u1107\u1165\u11AF\u110A\u1165","\u1107\u1165\u11B7\u110B\u1171","\u1107\u1165\u11B7\u110B\u1175\u11AB","\u1107\u1165\u11B7\u110C\u116C","\u1107\u1165\u11B8\u1105\u1172\u11AF","\u1107\u1165\u11B8\u110B\u116F\u11AB","\u1107\u1165\u11B8\u110C\u1165\u11A8","\u1107\u1165\u11B8\u110E\u1175\u11A8","\u1107\u1166\u110B\u1175\u110C\u1175\u11BC","\u1107\u1166\u11AF\u1110\u1173","\u1107\u1167\u11AB\u1100\u1167\u11BC","\u1107\u1167\u11AB\u1103\u1169\u11BC","\u1107\u1167\u11AB\u1106\u1167\u11BC","\u1107\u1167\u11AB\u1109\u1175\u11AB","\u1107\u1167\u11AB\u1112\u1169\u1109\u1161","\u1107\u1167\u11AB\u1112\u116A","\u1107\u1167\u11AF\u1103\u1169","\u1107\u1167\u11AF\u1106\u1167\u11BC","\u1107\u1167\u11AF\u110B\u1175\u11AF","\u1107\u1167\u11BC\u1109\u1175\u11AF","\u1107\u1167\u11BC\u110B\u1161\u1105\u1175","\u1107\u1167\u11BC\u110B\u116F\u11AB","\u1107\u1169\u1100\u116A\u11AB","\u1107\u1169\u1102\u1165\u1109\u1173","\u1107\u1169\u1105\u1161\u1109\u1162\u11A8","\u1107\u1169\u1105\u1161\u11B7","\u1107\u1169\u1105\u1173\u11B7","\u1107\u1169\u1109\u1161\u11BC","\u1107\u1169\u110B\u1161\u11AB","\u1107\u1169\u110C\u1161\u1100\u1175","\u1107\u1169\u110C\u1161\u11BC","\u1107\u1169\u110C\u1165\u11AB","\u1107\u1169\u110C\u1169\u11AB","\u1107\u1169\u1110\u1169\u11BC","\u1107\u1169\u1111\u1167\u11AB\u110C\u1165\u11A8","\u1107\u1169\u1112\u1165\u11B7","\u1107\u1169\u11A8\u1103\u1169","\u1107\u1169\u11A8\u1109\u1161","\u1107\u1169\u11A8\u1109\u116E\u11BC\u110B\u1161","\u1107\u1169\u11A8\u1109\u1173\u11B8","\u1107\u1169\u11A9\u110B\u1173\u11B7","\u1107\u1169\u11AB\u1100\u1167\u11A8\u110C\u1165\u11A8","\u1107\u1169\u11AB\u1105\u1162","\u1107\u1169\u11AB\u1107\u116E","\u1107\u1169\u11AB\u1109\u1161","\u1107\u1169\u11AB\u1109\u1165\u11BC","\u1107\u1169\u11AB\u110B\u1175\u11AB","\u1107\u1169\u11AB\u110C\u1175\u11AF","\u1107\u1169\u11AF\u1111\u1166\u11AB","\u1107\u1169\u11BC\u1109\u1161","\u1107\u1169\u11BC\u110C\u1175","\u1107\u1169\u11BC\u1110\u116E","\u1107\u116E\u1100\u1173\u11AB","\u1107\u116E\u1101\u1173\u1105\u1165\u110B\u116E\u11B7","\u1107\u116E\u1103\u1161\u11B7","\u1107\u116E\u1103\u1169\u11BC\u1109\u1161\u11AB","\u1107\u116E\u1106\u116E\u11AB","\u1107\u116E\u1107\u116E\u11AB","\u1107\u116E\u1109\u1161\u11AB","\u1107\u116E\u1109\u1161\u11BC","\u1107\u116E\u110B\u1165\u11BF","\u1107\u116E\u110B\u1175\u11AB","\u1107\u116E\u110C\u1161\u11A8\u110B\u116D\u11BC","\u1107\u116E\u110C\u1161\u11BC","\u1107\u116E\u110C\u1165\u11BC","\u1107\u116E\u110C\u1169\u11A8","\u1107\u116E\u110C\u1175\u1105\u1165\u11AB\u1112\u1175","\u1107\u116E\u110E\u1175\u11AB","\u1107\u116E\u1110\u1161\u11A8","\u1107\u116E\u1111\u116E\u11B7","\u1107\u116E\u1112\u116C\u110C\u1161\u11BC","\u1107\u116E\u11A8\u1107\u116E","\u1107\u116E\u11A8\u1112\u1161\u11AB","\u1107\u116E\u11AB\u1102\u1169","\u1107\u116E\u11AB\u1105\u1163\u11BC","\u1107\u116E\u11AB\u1105\u1175","\u1107\u116E\u11AB\u1106\u1167\u11BC","\u1107\u116E\u11AB\u1109\u1165\u11A8","\u1107\u116E\u11AB\u110B\u1163","\u1107\u116E\u11AB\u110B\u1171\u1100\u1175","\u1107\u116E\u11AB\u1111\u1175\u11AF","\u1107\u116E\u11AB\u1112\u1169\u11BC\u1109\u1162\u11A8","\u1107\u116E\u11AF\u1100\u1169\u1100\u1175","\u1107\u116E\u11AF\u1100\u116A","\u1107\u116E\u11AF\u1100\u116D","\u1107\u116E\u11AF\u1101\u1169\u11BE","\u1107\u116E\u11AF\u1106\u1161\u11AB","\u1107\u116E\u11AF\u1107\u1165\u11B8","\u1107\u116E\u11AF\u1107\u1175\u11BE","\u1107\u116E\u11AF\u110B\u1161\u11AB","\u1107\u116E\u11AF\u110B\u1175\u110B\u1175\u11A8","\u1107\u116E\u11AF\u1112\u1162\u11BC","\u1107\u1173\u1105\u1162\u11AB\u1103\u1173","\u1107\u1175\u1100\u1173\u11A8","\u1107\u1175\u1102\u1161\u11AB","\u1107\u1175\u1102\u1175\u11AF","\u1107\u1175\u1103\u116E\u11AF\u1100\u1175","\u1107\u1175\u1103\u1175\u110B\u1169","\u1107\u1175\u1105\u1169\u1109\u1169","\u1107\u1175\u1106\u1161\u11AB","\u1107\u1175\u1106\u1167\u11BC","\u1107\u1175\u1106\u1175\u11AF","\u1107\u1175\u1107\u1161\u1105\u1161\u11B7","\u1107\u1175\u1107\u1175\u11B7\u1107\u1161\u11B8","\u1107\u1175\u1109\u1161\u11BC","\u1107\u1175\u110B\u116D\u11BC","\u1107\u1175\u110B\u1172\u11AF","\u1107\u1175\u110C\u116E\u11BC","\u1107\u1175\u1110\u1161\u1106\u1175\u11AB","\u1107\u1175\u1111\u1161\u11AB","\u1107\u1175\u11AF\u1103\u1175\u11BC","\u1107\u1175\u11BA\u1106\u116E\u11AF","\u1107\u1175\u11BA\u1107\u1161\u11BC\u110B\u116E\u11AF","\u1107\u1175\u11BA\u110C\u116E\u11AF\u1100\u1175","\u1107\u1175\u11BE\u1101\u1161\u11AF","\u1108\u1161\u11AF\u1100\u1161\u11AB\u1109\u1162\u11A8","\u1108\u1161\u11AF\u1105\u1162","\u1108\u1161\u11AF\u1105\u1175","\u1109\u1161\u1100\u1165\u11AB","\u1109\u1161\u1100\u1168\u110C\u1165\u11AF","\u1109\u1161\u1102\u1161\u110B\u1175","\u1109\u1161\u1102\u1163\u11BC","\u1109\u1161\u1105\u1161\u11B7","\u1109\u1161\u1105\u1161\u11BC","\u1109\u1161\u1105\u1175\u11B8","\u1109\u1161\u1106\u1169\u1102\u1175\u11B7","\u1109\u1161\u1106\u116E\u11AF","\u1109\u1161\u1107\u1161\u11BC","\u1109\u1161\u1109\u1161\u11BC","\u1109\u1161\u1109\u1162\u11BC\u1112\u116A\u11AF","\u1109\u1161\u1109\u1165\u11AF","\u1109\u1161\u1109\u1173\u11B7","\u1109\u1161\u1109\u1175\u11AF","\u1109\u1161\u110B\u1165\u11B8","\u1109\u1161\u110B\u116D\u11BC","\u1109\u1161\u110B\u116F\u11AF","\u1109\u1161\u110C\u1161\u11BC","\u1109\u1161\u110C\u1165\u11AB","\u1109\u1161\u110C\u1175\u11AB","\u1109\u1161\u110E\u1169\u11AB","\u1109\u1161\u110E\u116E\u11AB\u1100\u1175","\u1109\u1161\u1110\u1161\u11BC","\u1109\u1161\u1110\u116E\u1105\u1175","\u1109\u1161\u1112\u1173\u11AF","\u1109\u1161\u11AB\u1100\u1175\u11AF","\u1109\u1161\u11AB\u1107\u116E\u110B\u1175\u11AB\u1100\u116A","\u1109\u1161\u11AB\u110B\u1165\u11B8","\u1109\u1161\u11AB\u110E\u1162\u11A8","\u1109\u1161\u11AF\u1105\u1175\u11B7","\u1109\u1161\u11AF\u110B\u1175\u11AB","\u1109\u1161\u11AF\u110D\u1161\u11A8","\u1109\u1161\u11B7\u1100\u1168\u1110\u1161\u11BC","\u1109\u1161\u11B7\u1100\u116E\u11A8","\u1109\u1161\u11B7\u1109\u1175\u11B8","\u1109\u1161\u11B7\u110B\u116F\u11AF","\u1109\u1161\u11B7\u110E\u1169\u11AB","\u1109\u1161\u11BC\u1100\u116A\u11AB","\u1109\u1161\u11BC\u1100\u1173\u11B7","\u1109\u1161\u11BC\u1103\u1162","\u1109\u1161\u11BC\u1105\u1172","\u1109\u1161\u11BC\u1107\u1161\u11AB\u1100\u1175","\u1109\u1161\u11BC\u1109\u1161\u11BC","\u1109\u1161\u11BC\u1109\u1175\u11A8","\u1109\u1161\u11BC\u110B\u1165\u11B8","\u1109\u1161\u11BC\u110B\u1175\u11AB","\u1109\u1161\u11BC\u110C\u1161","\u1109\u1161\u11BC\u110C\u1165\u11B7","\u1109\u1161\u11BC\u110E\u1165","\u1109\u1161\u11BC\u110E\u116E","\u1109\u1161\u11BC\u1110\u1162","\u1109\u1161\u11BC\u1111\u116D","\u1109\u1161\u11BC\u1111\u116E\u11B7","\u1109\u1161\u11BC\u1112\u116A\u11BC","\u1109\u1162\u1107\u1167\u11A8","\u1109\u1162\u11A8\u1101\u1161\u11AF","\u1109\u1162\u11A8\u110B\u1167\u11AB\u1111\u1175\u11AF","\u1109\u1162\u11BC\u1100\u1161\u11A8","\u1109\u1162\u11BC\u1106\u1167\u11BC","\u1109\u1162\u11BC\u1106\u116E\u11AF","\u1109\u1162\u11BC\u1107\u1161\u11BC\u1109\u1169\u11BC","\u1109\u1162\u11BC\u1109\u1161\u11AB","\u1109\u1162\u11BC\u1109\u1165\u11AB","\u1109\u1162\u11BC\u1109\u1175\u11AB","\u1109\u1162\u11BC\u110B\u1175\u11AF","\u1109\u1162\u11BC\u1112\u116A\u11AF","\u1109\u1165\u1105\u1161\u11B8","\u1109\u1165\u1105\u1173\u11AB","\u1109\u1165\u1106\u1167\u11BC","\u1109\u1165\u1106\u1175\u11AB","\u1109\u1165\u1107\u1175\u1109\u1173","\u1109\u1165\u110B\u1163\u11BC","\u1109\u1165\u110B\u116E\u11AF","\u1109\u1165\u110C\u1165\u11A8","\u1109\u1165\u110C\u1165\u11B7","\u1109\u1165\u110D\u1169\u11A8","\u1109\u1165\u110F\u1173\u11AF","\u1109\u1165\u11A8\u1109\u1161","\u1109\u1165\u11A8\u110B\u1172","\u1109\u1165\u11AB\u1100\u1165","\u1109\u1165\u11AB\u1106\u116E\u11AF","\u1109\u1165\u11AB\u1107\u1162","\u1109\u1165\u11AB\u1109\u1162\u11BC","\u1109\u1165\u11AB\u1109\u116E","\u1109\u1165\u11AB\u110B\u116F\u11AB","\u1109\u1165\u11AB\u110C\u1161\u11BC","\u1109\u1165\u11AB\u110C\u1165\u11AB","\u1109\u1165\u11AB\u1110\u1162\u11A8","\u1109\u1165\u11AB\u1111\u116E\u11BC\u1100\u1175","\u1109\u1165\u11AF\u1100\u1165\u110C\u1175","\u1109\u1165\u11AF\u1102\u1161\u11AF","\u1109\u1165\u11AF\u1105\u1165\u11BC\u1110\u1161\u11BC","\u1109\u1165\u11AF\u1106\u1167\u11BC","\u1109\u1165\u11AF\u1106\u116E\u11AB","\u1109\u1165\u11AF\u1109\u1161","\u1109\u1165\u11AF\u110B\u1161\u11A8\u1109\u1161\u11AB","\u1109\u1165\u11AF\u110E\u1175","\u1109\u1165\u11AF\u1110\u1161\u11BC","\u1109\u1165\u11B8\u110A\u1175","\u1109\u1165\u11BC\u1100\u1169\u11BC","\u1109\u1165\u11BC\u1103\u1161\u11BC","\u1109\u1165\u11BC\u1106\u1167\u11BC","\u1109\u1165\u11BC\u1107\u1167\u11AF","\u1109\u1165\u11BC\u110B\u1175\u11AB","\u1109\u1165\u11BC\u110C\u1161\u11BC","\u1109\u1165\u11BC\u110C\u1165\u11A8","\u1109\u1165\u11BC\u110C\u1175\u11AF","\u1109\u1165\u11BC\u1112\u1161\u11B7","\u1109\u1166\u1100\u1173\u11B7","\u1109\u1166\u1106\u1175\u1102\u1161","\u1109\u1166\u1109\u1161\u11BC","\u1109\u1166\u110B\u116F\u11AF","\u1109\u1166\u110C\u1169\u11BC\u1103\u1162\u110B\u116A\u11BC","\u1109\u1166\u1110\u1161\u11A8","\u1109\u1166\u11AB\u1110\u1165","\u1109\u1166\u11AB\u1110\u1175\u1106\u1175\u1110\u1165","\u1109\u1166\u11BA\u110D\u1162","\u1109\u1169\u1100\u1172\u1106\u1169","\u1109\u1169\u1100\u1173\u11A8\u110C\u1165\u11A8","\u1109\u1169\u1100\u1173\u11B7","\u1109\u1169\u1102\u1161\u1100\u1175","\u1109\u1169\u1102\u1167\u11AB","\u1109\u1169\u1103\u1173\u11A8","\u1109\u1169\u1106\u1161\u11BC","\u1109\u1169\u1106\u116E\u11AB","\u1109\u1169\u1109\u1165\u11AF","\u1109\u1169\u1109\u1169\u11A8","\u1109\u1169\u110B\u1161\u1100\u116A","\u1109\u1169\u110B\u116D\u11BC","\u1109\u1169\u110B\u116F\u11AB","\u1109\u1169\u110B\u1173\u11B7","\u1109\u1169\u110C\u116E\u11BC\u1112\u1175","\u1109\u1169\u110C\u1175\u1111\u116E\u11B7","\u1109\u1169\u110C\u1175\u11AF","\u1109\u1169\u1111\u116E\u11BC","\u1109\u1169\u1112\u1167\u11BC","\u1109\u1169\u11A8\u1103\u1161\u11B7","\u1109\u1169\u11A8\u1103\u1169","\u1109\u1169\u11A8\u110B\u1169\u11BA","\u1109\u1169\u11AB\u1100\u1161\u1105\u1161\u11A8","\u1109\u1169\u11AB\u1100\u1175\u11AF","\u1109\u1169\u11AB\u1102\u1167","\u1109\u1169\u11AB\u1102\u1175\u11B7","\u1109\u1169\u11AB\u1103\u1173\u11BC","\u1109\u1169\u11AB\u1106\u1169\u11A8","\u1109\u1169\u11AB\u1108\u1167\u11A8","\u1109\u1169\u11AB\u1109\u1175\u11AF","\u1109\u1169\u11AB\u110C\u1175\u11AF","\u1109\u1169\u11AB\u1110\u1169\u11B8","\u1109\u1169\u11AB\u1112\u1162","\u1109\u1169\u11AF\u110C\u1175\u11A8\u1112\u1175","\u1109\u1169\u11B7\u110A\u1175","\u1109\u1169\u11BC\u110B\u1161\u110C\u1175","\u1109\u1169\u11BC\u110B\u1175","\u1109\u1169\u11BC\u1111\u1167\u11AB","\u1109\u116C\u1100\u1169\u1100\u1175","\u1109\u116D\u1111\u1175\u11BC","\u1109\u116E\u1100\u1165\u11AB","\u1109\u116E\u1102\u1167\u11AB","\u1109\u116E\u1103\u1161\u11AB","\u1109\u116E\u1103\u1169\u11BA\u1106\u116E\u11AF","\u1109\u116E\u1103\u1169\u11BC\u110C\u1165\u11A8","\u1109\u116E\u1106\u1167\u11AB","\u1109\u116E\u1106\u1167\u11BC","\u1109\u116E\u1107\u1161\u11A8","\u1109\u116E\u1109\u1161\u11BC","\u1109\u116E\u1109\u1165\u11A8","\u1109\u116E\u1109\u116E\u11AF","\u1109\u116E\u1109\u1175\u1105\u1169","\u1109\u116E\u110B\u1165\u11B8","\u1109\u116E\u110B\u1167\u11B7","\u1109\u116E\u110B\u1167\u11BC","\u1109\u116E\u110B\u1175\u11B8","\u1109\u116E\u110C\u116E\u11AB","\u1109\u116E\u110C\u1175\u11B8","\u1109\u116E\u110E\u116E\u11AF","\u1109\u116E\u110F\u1165\u11BA","\u1109\u116E\u1111\u1175\u11AF","\u1109\u116E\u1112\u1161\u11A8","\u1109\u116E\u1112\u1165\u11B7\u1109\u1162\u11BC","\u1109\u116E\u1112\u116A\u1100\u1175","\u1109\u116E\u11A8\u1102\u1167","\u1109\u116E\u11A8\u1109\u1169","\u1109\u116E\u11A8\u110C\u1166","\u1109\u116E\u11AB\u1100\u1161\u11AB","\u1109\u116E\u11AB\u1109\u1165","\u1109\u116E\u11AB\u1109\u116E","\u1109\u116E\u11AB\u1109\u1175\u11A8\u1100\u1161\u11AB","\u1109\u116E\u11AB\u110B\u1171","\u1109\u116E\u11AE\u1100\u1161\u1105\u1161\u11A8","\u1109\u116E\u11AF\u1107\u1167\u11BC","\u1109\u116E\u11AF\u110C\u1175\u11B8","\u1109\u116E\u11BA\u110C\u1161","\u1109\u1173\u1102\u1175\u11B7","\u1109\u1173\u1106\u116E\u11AF","\u1109\u1173\u1109\u1173\u1105\u1169","\u1109\u1173\u1109\u1173\u11BC","\u1109\u1173\u110B\u1170\u1110\u1165","\u1109\u1173\u110B\u1171\u110E\u1175","\u1109\u1173\u110F\u1166\u110B\u1175\u1110\u1173","\u1109\u1173\u1110\u1172\u1103\u1175\u110B\u1169","\u1109\u1173\u1110\u1173\u1105\u1166\u1109\u1173","\u1109\u1173\u1111\u1169\u110E\u1173","\u1109\u1173\u11AF\u110D\u1165\u11A8","\u1109\u1173\u11AF\u1111\u1173\u11B7","\u1109\u1173\u11B8\u1100\u116A\u11AB","\u1109\u1173\u11B8\u1100\u1175","\u1109\u1173\u11BC\u1100\u1162\u11A8","\u1109\u1173\u11BC\u1105\u1175","\u1109\u1173\u11BC\u1107\u116E","\u1109\u1173\u11BC\u110B\u116D\u11BC\u110E\u1161","\u1109\u1173\u11BC\u110C\u1175\u11AB","\u1109\u1175\u1100\u1161\u11A8","\u1109\u1175\u1100\u1161\u11AB","\u1109\u1175\u1100\u1169\u11AF","\u1109\u1175\u1100\u1173\u11B7\u110E\u1175","\u1109\u1175\u1102\u1161\u1105\u1175\u110B\u1169","\u1109\u1175\u1103\u1162\u11A8","\u1109\u1175\u1105\u1175\u110C\u1173","\u1109\u1175\u1106\u1166\u11AB\u1110\u1173","\u1109\u1175\u1106\u1175\u11AB","\u1109\u1175\u1107\u116E\u1106\u1169","\u1109\u1175\u1109\u1165\u11AB","\u1109\u1175\u1109\u1165\u11AF","\u1109\u1175\u1109\u1173\u1110\u1166\u11B7","\u1109\u1175\u110B\u1161\u1107\u1165\u110C\u1175","\u1109\u1175\u110B\u1165\u1106\u1165\u1102\u1175","\u1109\u1175\u110B\u116F\u11AF","\u1109\u1175\u110B\u1175\u11AB","\u1109\u1175\u110B\u1175\u11AF","\u1109\u1175\u110C\u1161\u11A8","\u1109\u1175\u110C\u1161\u11BC","\u1109\u1175\u110C\u1165\u11AF","\u1109\u1175\u110C\u1165\u11B7","\u1109\u1175\u110C\u116E\u11BC","\u1109\u1175\u110C\u1173\u11AB","\u1109\u1175\u110C\u1175\u11B8","\u1109\u1175\u110E\u1165\u11BC","\u1109\u1175\u1112\u1161\u11B8","\u1109\u1175\u1112\u1165\u11B7","\u1109\u1175\u11A8\u1100\u116E","\u1109\u1175\u11A8\u1100\u1175","\u1109\u1175\u11A8\u1103\u1161\u11BC","\u1109\u1175\u11A8\u1105\u1163\u11BC","\u1109\u1175\u11A8\u1105\u116D\u1111\u116E\u11B7","\u1109\u1175\u11A8\u1106\u116E\u11AF","\u1109\u1175\u11A8\u1108\u1161\u11BC","\u1109\u1175\u11A8\u1109\u1161","\u1109\u1175\u11A8\u1109\u1162\u11BC\u1112\u116A\u11AF","\u1109\u1175\u11A8\u110E\u1169","\u1109\u1175\u11A8\u1110\u1161\u11A8","\u1109\u1175\u11A8\u1111\u116E\u11B7","\u1109\u1175\u11AB\u1100\u1169","\u1109\u1175\u11AB\u1100\u1172","\u1109\u1175\u11AB\u1102\u1167\u11B7","\u1109\u1175\u11AB\u1106\u116E\u11AB","\u1109\u1175\u11AB\u1107\u1161\u11AF","\u1109\u1175\u11AB\u1107\u1175","\u1109\u1175\u11AB\u1109\u1161","\u1109\u1175\u11AB\u1109\u1166","\u1109\u1175\u11AB\u110B\u116D\u11BC","\u1109\u1175\u11AB\u110C\u1166\u1111\u116E\u11B7","\u1109\u1175\u11AB\u110E\u1165\u11BC","\u1109\u1175\u11AB\u110E\u1166","\u1109\u1175\u11AB\u1112\u116A","\u1109\u1175\u11AF\u1100\u1161\u11B7","\u1109\u1175\u11AF\u1102\u1162","\u1109\u1175\u11AF\u1105\u1167\u11A8","\u1109\u1175\u11AF\u1105\u1168","\u1109\u1175\u11AF\u1106\u1161\u11BC","\u1109\u1175\u11AF\u1109\u116E","\u1109\u1175\u11AF\u1109\u1173\u11B8","\u1109\u1175\u11AF\u1109\u1175","\u1109\u1175\u11AF\u110C\u1161\u11BC","\u1109\u1175\u11AF\u110C\u1165\u11BC","\u1109\u1175\u11AF\u110C\u1175\u11AF\u110C\u1165\u11A8","\u1109\u1175\u11AF\u110E\u1165\u11AB","\u1109\u1175\u11AF\u110E\u1166","\u1109\u1175\u11AF\u110F\u1165\u11BA","\u1109\u1175\u11AF\u1110\u1162","\u1109\u1175\u11AF\u1111\u1162","\u1109\u1175\u11AF\u1112\u1165\u11B7","\u1109\u1175\u11AF\u1112\u1167\u11AB","\u1109\u1175\u11B7\u1105\u1175","\u1109\u1175\u11B7\u1107\u116E\u1105\u1173\u11B7","\u1109\u1175\u11B7\u1109\u1161","\u1109\u1175\u11B7\u110C\u1161\u11BC","\u1109\u1175\u11B7\u110C\u1165\u11BC","\u1109\u1175\u11B7\u1111\u1161\u11AB","\u110A\u1161\u11BC\u1103\u116E\u11BC\u110B\u1175","\u110A\u1175\u1105\u1173\u11B7","\u110A\u1175\u110B\u1161\u11BA","\u110B\u1161\u1100\u1161\u110A\u1175","\u110B\u1161\u1102\u1161\u110B\u116E\u11AB\u1109\u1165","\u110B\u1161\u1103\u1173\u1102\u1175\u11B7","\u110B\u1161\u1103\u1173\u11AF","\u110B\u1161\u1109\u1171\u110B\u116E\u11B7","\u110B\u1161\u1109\u1173\u1111\u1161\u11AF\u1110\u1173","\u110B\u1161\u1109\u1175\u110B\u1161","\u110B\u1161\u110B\u116E\u11AF\u1105\u1165","\u110B\u1161\u110C\u1165\u110A\u1175","\u110B\u1161\u110C\u116E\u11B7\u1106\u1161","\u110B\u1161\u110C\u1175\u11A8","\u110B\u1161\u110E\u1175\u11B7","\u110B\u1161\u1111\u1161\u1110\u1173","\u110B\u1161\u1111\u1173\u1105\u1175\u110F\u1161","\u110B\u1161\u1111\u1173\u11B7","\u110B\u1161\u1112\u1169\u11B8","\u110B\u1161\u1112\u1173\u11AB","\u110B\u1161\u11A8\u1100\u1175","\u110B\u1161\u11A8\u1106\u1169\u11BC","\u110B\u1161\u11A8\u1109\u116E","\u110B\u1161\u11AB\u1100\u1162","\u110B\u1161\u11AB\u1100\u1167\u11BC","\u110B\u1161\u11AB\u1100\u116A","\u110B\u1161\u11AB\u1102\u1162","\u110B\u1161\u11AB\u1102\u1167\u11BC","\u110B\u1161\u11AB\u1103\u1169\u11BC","\u110B\u1161\u11AB\u1107\u1161\u11BC","\u110B\u1161\u11AB\u1107\u116E","\u110B\u1161\u11AB\u110C\u116E","\u110B\u1161\u11AF\u1105\u116E\u1106\u1175\u1102\u1172\u11B7","\u110B\u1161\u11AF\u110F\u1169\u110B\u1169\u11AF","\u110B\u1161\u11B7\u1109\u1175","\u110B\u1161\u11B7\u110F\u1165\u11BA","\u110B\u1161\u11B8\u1105\u1167\u11A8","\u110B\u1161\u11C1\u1102\u1161\u11AF","\u110B\u1161\u11C1\u1106\u116E\u11AB","\u110B\u1162\u110B\u1175\u11AB","\u110B\u1162\u110C\u1165\u11BC","\u110B\u1162\u11A8\u1109\u116E","\u110B\u1162\u11AF\u1107\u1165\u11B7","\u110B\u1163\u1100\u1161\u11AB","\u110B\u1163\u1103\u1161\u11AB","\u110B\u1163\u110B\u1169\u11BC","\u110B\u1163\u11A8\u1100\u1161\u11AB","\u110B\u1163\u11A8\u1100\u116E\u11A8","\u110B\u1163\u11A8\u1109\u1169\u11A8","\u110B\u1163\u11A8\u1109\u116E","\u110B\u1163\u11A8\u110C\u1165\u11B7","\u110B\u1163\u11A8\u1111\u116E\u11B7","\u110B\u1163\u11A8\u1112\u1169\u11AB\u1102\u1167","\u110B\u1163\u11BC\u1102\u1167\u11B7","\u110B\u1163\u11BC\u1105\u1167\u11A8","\u110B\u1163\u11BC\u1106\u1161\u11AF","\u110B\u1163\u11BC\u1107\u1162\u110E\u116E","\u110B\u1163\u11BC\u110C\u116E","\u110B\u1163\u11BC\u1111\u1161","\u110B\u1165\u1103\u116E\u11B7","\u110B\u1165\u1105\u1167\u110B\u116E\u11B7","\u110B\u1165\u1105\u1173\u11AB","\u110B\u1165\u110C\u1166\u11BA\u1107\u1161\u11B7","\u110B\u1165\u110D\u1162\u11BB\u1103\u1173\u11AB","\u110B\u1165\u110D\u1165\u1103\u1161\u1100\u1161","\u110B\u1165\u110D\u1165\u11AB\u110C\u1175","\u110B\u1165\u11AB\u1102\u1175","\u110B\u1165\u11AB\u1103\u1165\u11A8","\u110B\u1165\u11AB\u1105\u1169\u11AB","\u110B\u1165\u11AB\u110B\u1165","\u110B\u1165\u11AF\u1100\u116E\u11AF","\u110B\u1165\u11AF\u1105\u1173\u11AB","\u110B\u1165\u11AF\u110B\u1173\u11B7","\u110B\u1165\u11AF\u1111\u1175\u11BA","\u110B\u1165\u11B7\u1106\u1161","\u110B\u1165\u11B8\u1106\u116E","\u110B\u1165\u11B8\u110C\u1169\u11BC","\u110B\u1165\u11B8\u110E\u1166","\u110B\u1165\u11BC\u1103\u1165\u11BC\u110B\u1175","\u110B\u1165\u11BC\u1106\u1161\u11BC","\u110B\u1165\u11BC\u1110\u1165\u1105\u1175","\u110B\u1165\u11BD\u1100\u1173\u110C\u1166","\u110B\u1166\u1102\u1165\u110C\u1175","\u110B\u1166\u110B\u1165\u110F\u1165\u11AB","\u110B\u1166\u11AB\u110C\u1175\u11AB","\u110B\u1167\u1100\u1165\u11AB","\u110B\u1167\u1100\u1169\u1109\u1162\u11BC","\u110B\u1167\u1100\u116A\u11AB","\u110B\u1167\u1100\u116E\u11AB","\u110B\u1167\u1100\u116F\u11AB","\u110B\u1167\u1103\u1162\u1109\u1162\u11BC","\u110B\u1167\u1103\u1165\u11B2","\u110B\u1167\u1103\u1169\u11BC\u1109\u1162\u11BC","\u110B\u1167\u1103\u1173\u11AB","\u110B\u1167\u1105\u1169\u11AB","\u110B\u1167\u1105\u1173\u11B7","\u110B\u1167\u1109\u1165\u11BA","\u110B\u1167\u1109\u1165\u11BC","\u110B\u1167\u110B\u116A\u11BC","\u110B\u1167\u110B\u1175\u11AB","\u110B\u1167\u110C\u1165\u11AB\u1112\u1175","\u110B\u1167\u110C\u1175\u11A8\u110B\u116F\u11AB","\u110B\u1167\u1112\u1161\u11A8\u1109\u1162\u11BC","\u110B\u1167\u1112\u1162\u11BC","\u110B\u1167\u11A8\u1109\u1161","\u110B\u1167\u11A8\u1109\u1175","\u110B\u1167\u11A8\u1112\u1161\u11AF","\u110B\u1167\u11AB\u1100\u1167\u11AF","\u110B\u1167\u11AB\u1100\u116E","\u110B\u1167\u11AB\u1100\u1173\u11A8","\u110B\u1167\u11AB\u1100\u1175","\u110B\u1167\u11AB\u1105\u1161\u11A8","\u110B\u1167\u11AB\u1109\u1165\u11AF","\u110B\u1167\u11AB\u1109\u1166","\u110B\u1167\u11AB\u1109\u1169\u11A8","\u110B\u1167\u11AB\u1109\u1173\u11B8","\u110B\u1167\u11AB\u110B\u1162","\u110B\u1167\u11AB\u110B\u1168\u110B\u1175\u11AB","\u110B\u1167\u11AB\u110B\u1175\u11AB","\u110B\u1167\u11AB\u110C\u1161\u11BC","\u110B\u1167\u11AB\u110C\u116E","\u110B\u1167\u11AB\u110E\u116E\u11AF","\u110B\u1167\u11AB\u1111\u1175\u11AF","\u110B\u1167\u11AB\u1112\u1161\u11B8","\u110B\u1167\u11AB\u1112\u1172","\u110B\u1167\u11AF\u1100\u1175","\u110B\u1167\u11AF\u1106\u1162","\u110B\u1167\u11AF\u1109\u116C","\u110B\u1167\u11AF\u1109\u1175\u11B7\u1112\u1175","\u110B\u1167\u11AF\u110C\u1165\u11BC","\u110B\u1167\u11AF\u110E\u1161","\u110B\u1167\u11AF\u1112\u1173\u11AF","\u110B\u1167\u11B7\u1105\u1167","\u110B\u1167\u11B8\u1109\u1165","\u110B\u1167\u11BC\u1100\u116E\u11A8","\u110B\u1167\u11BC\u1102\u1161\u11B7","\u110B\u1167\u11BC\u1109\u1161\u11BC","\u110B\u1167\u11BC\u110B\u1163\u11BC","\u110B\u1167\u11BC\u110B\u1167\u11A8","\u110B\u1167\u11BC\u110B\u116E\u11BC","\u110B\u1167\u11BC\u110B\u116F\u11AB\u1112\u1175","\u110B\u1167\u11BC\u1112\u1161","\u110B\u1167\u11BC\u1112\u1163\u11BC","\u110B\u1167\u11BC\u1112\u1169\u11AB","\u110B\u1167\u11BC\u1112\u116A","\u110B\u1167\u11C1\u1100\u116E\u1105\u1175","\u110B\u1167\u11C1\u1107\u1161\u11BC","\u110B\u1167\u11C1\u110C\u1175\u11B8","\u110B\u1168\u1100\u1161\u11B7","\u110B\u1168\u1100\u1173\u11B7","\u110B\u1168\u1107\u1161\u11BC","\u110B\u1168\u1109\u1161\u11AB","\u110B\u1168\u1109\u1161\u11BC","\u110B\u1168\u1109\u1165\u11AB","\u110B\u1168\u1109\u116E\u11AF","\u110B\u1168\u1109\u1173\u11B8","\u110B\u1168\u1109\u1175\u11A8\u110C\u1161\u11BC","\u110B\u1168\u110B\u1163\u11A8","\u110B\u1168\u110C\u1165\u11AB","\u110B\u1168\u110C\u1165\u11AF","\u110B\u1168\u110C\u1165\u11BC","\u110B\u1168\u110F\u1165\u11AB\u1103\u1162","\u110B\u1168\u11BA\u1102\u1161\u11AF","\u110B\u1169\u1102\u1173\u11AF","\u110B\u1169\u1105\u1161\u11A8","\u110B\u1169\u1105\u1162\u11BA\u1103\u1169\u11BC\u110B\u1161\u11AB","\u110B\u1169\u1105\u1166\u11AB\u110C\u1175","\u110B\u1169\u1105\u1169\u110C\u1175","\u110B\u1169\u1105\u1173\u11AB\u1107\u1161\u11AF","\u110B\u1169\u1107\u1173\u11AB","\u110B\u1169\u1109\u1175\u11B8","\u110B\u1169\u110B\u1167\u11B7","\u110B\u1169\u110B\u116F\u11AF","\u110B\u1169\u110C\u1165\u11AB","\u110B\u1169\u110C\u1175\u11A8","\u110B\u1169\u110C\u1175\u11BC\u110B\u1165","\u110B\u1169\u1111\u1166\u1105\u1161","\u110B\u1169\u1111\u1175\u1109\u1173\u1110\u1166\u11AF","\u110B\u1169\u1112\u1175\u1105\u1167","\u110B\u1169\u11A8\u1109\u1161\u11BC","\u110B\u1169\u11A8\u1109\u116E\u1109\u116E","\u110B\u1169\u11AB\u1100\u1161\u11BD","\u110B\u1169\u11AB\u1105\u1161\u110B\u1175\u11AB","\u110B\u1169\u11AB\u1106\u1169\u11B7","\u110B\u1169\u11AB\u110C\u1169\u11BC\u110B\u1175\u11AF","\u110B\u1169\u11AB\u1110\u1169\u11BC","\u110B\u1169\u11AF\u1100\u1161\u110B\u1173\u11AF","\u110B\u1169\u11AF\u1105\u1175\u11B7\u1111\u1175\u11A8","\u110B\u1169\u11AF\u1112\u1162","\u110B\u1169\u11BA\u110E\u1161\u1105\u1175\u11B7","\u110B\u116A\u110B\u1175\u1109\u1167\u110E\u1173","\u110B\u116A\u110B\u1175\u11AB","\u110B\u116A\u11AB\u1109\u1165\u11BC","\u110B\u116A\u11AB\u110C\u1165\u11AB","\u110B\u116A\u11BC\u1107\u1175","\u110B\u116A\u11BC\u110C\u1161","\u110B\u116B\u1102\u1163\u1112\u1161\u1106\u1167\u11AB","\u110B\u116B\u11AB\u110C\u1175","\u110B\u116C\u1100\u1161\u11BA\u110C\u1175\u11B8","\u110B\u116C\u1100\u116E\u11A8","\u110B\u116C\u1105\u1169\u110B\u116E\u11B7","\u110B\u116C\u1109\u1161\u11B7\u110E\u1169\u11AB","\u110B\u116C\u110E\u116E\u11AF","\u110B\u116C\u110E\u1175\u11B7","\u110B\u116C\u1112\u1161\u11AF\u1106\u1165\u1102\u1175","\u110B\u116C\u11AB\u1107\u1161\u11AF","\u110B\u116C\u11AB\u1109\u1169\u11AB","\u110B\u116C\u11AB\u110D\u1169\u11A8","\u110B\u116D\u1100\u1173\u11B7","\u110B\u116D\u110B\u1175\u11AF","\u110B\u116D\u110C\u1173\u11B7","\u110B\u116D\u110E\u1165\u11BC","\u110B\u116D\u11BC\u1100\u1175","\u110B\u116D\u11BC\u1109\u1165","\u110B\u116D\u11BC\u110B\u1165","\u110B\u116E\u1109\u1161\u11AB","\u110B\u116E\u1109\u1165\u11AB","\u110B\u116E\u1109\u1173\u11BC","\u110B\u116E\u110B\u1167\u11AB\u1112\u1175","\u110B\u116E\u110C\u1165\u11BC","\u110B\u116E\u110E\u1166\u1100\u116E\u11A8","\u110B\u116E\u1111\u1167\u11AB","\u110B\u116E\u11AB\u1103\u1169\u11BC","\u110B\u116E\u11AB\u1106\u1167\u11BC","\u110B\u116E\u11AB\u1107\u1161\u11AB","\u110B\u116E\u11AB\u110C\u1165\u11AB","\u110B\u116E\u11AB\u1112\u1162\u11BC","\u110B\u116E\u11AF\u1109\u1161\u11AB","\u110B\u116E\u11AF\u110B\u1173\u11B7","\u110B\u116E\u11B7\u110C\u1175\u11A8\u110B\u1175\u11B7","\u110B\u116E\u11BA\u110B\u1165\u1105\u1173\u11AB","\u110B\u116E\u11BA\u110B\u1173\u11B7","\u110B\u116F\u1102\u1161\u11A8","\u110B\u116F\u11AB\u1100\u1169","\u110B\u116F\u11AB\u1105\u1162","\u110B\u116F\u11AB\u1109\u1165","\u110B\u116F\u11AB\u1109\u116E\u11BC\u110B\u1175","\u110B\u116F\u11AB\u110B\u1175\u11AB","\u110B\u116F\u11AB\u110C\u1161\u11BC","\u110B\u116F\u11AB\u1111\u1175\u1109\u1173","\u110B\u116F\u11AF\u1100\u1173\u11B8","\u110B\u116F\u11AF\u1103\u1173\u110F\u1165\u11B8","\u110B\u116F\u11AF\u1109\u1166","\u110B\u116F\u11AF\u110B\u116D\u110B\u1175\u11AF","\u110B\u1170\u110B\u1175\u1110\u1165","\u110B\u1171\u1107\u1161\u11AB","\u110B\u1171\u1107\u1165\u11B8","\u110B\u1171\u1109\u1165\u11BC","\u110B\u1171\u110B\u116F\u11AB","\u110B\u1171\u1112\u1165\u11B7","\u110B\u1171\u1112\u1167\u11B8","\u110B\u1171\u11BA\u1109\u1161\u1105\u1161\u11B7","\u110B\u1172\u1102\u1161\u11AB\u1112\u1175","\u110B\u1172\u1105\u1165\u11B8","\u110B\u1172\u1106\u1167\u11BC","\u110B\u1172\u1106\u116E\u11AF","\u110B\u1172\u1109\u1161\u11AB","\u110B\u1172\u110C\u1165\u11A8","\u110B\u1172\u110E\u1175\u110B\u116F\u11AB","\u110B\u1172\u1112\u1161\u11A8","\u110B\u1172\u1112\u1162\u11BC","\u110B\u1172\u1112\u1167\u11BC","\u110B\u1172\u11A8\u1100\u116E\u11AB","\u110B\u1172\u11A8\u1109\u1161\u11BC","\u110B\u1172\u11A8\u1109\u1175\u11B8","\u110B\u1172\u11A8\u110E\u1166","\u110B\u1173\u11AB\u1112\u1162\u11BC","\u110B\u1173\u11B7\u1105\u1167\u11A8","\u110B\u1173\u11B7\u1105\u116D","\u110B\u1173\u11B7\u1107\u1161\u11AB","\u110B\u1173\u11B7\u1109\u1165\u11BC","\u110B\u1173\u11B7\u1109\u1175\u11A8","\u110B\u1173\u11B7\u110B\u1161\u11A8","\u110B\u1173\u11B7\u110C\u116E","\u110B\u1174\u1100\u1167\u11AB","\u110B\u1174\u1102\u1169\u11AB","\u110B\u1174\u1106\u116E\u11AB","\u110B\u1174\u1107\u1169\u11A8","\u110B\u1174\u1109\u1175\u11A8","\u110B\u1174\u1109\u1175\u11B7","\u110B\u1174\u110B\u116C\u1105\u1169","\u110B\u1174\u110B\u116D\u11A8","\u110B\u1174\u110B\u116F\u11AB","\u110B\u1174\u1112\u1161\u11A8","\u110B\u1175\u1100\u1165\u11BA","\u110B\u1175\u1100\u1169\u11BA","\u110B\u1175\u1102\u1167\u11B7","\u110B\u1175\u1102\u1169\u11B7","\u110B\u1175\u1103\u1161\u11AF","\u110B\u1175\u1103\u1162\u1105\u1169","\u110B\u1175\u1103\u1169\u11BC","\u110B\u1175\u1105\u1165\u11C2\u1100\u1166","\u110B\u1175\u1105\u1167\u11A8\u1109\u1165","\u110B\u1175\u1105\u1169\u11AB\u110C\u1165\u11A8","\u110B\u1175\u1105\u1173\u11B7","\u110B\u1175\u1106\u1175\u11AB","\u110B\u1175\u1107\u1161\u11AF\u1109\u1169","\u110B\u1175\u1107\u1167\u11AF","\u110B\u1175\u1107\u116E\u11AF","\u110B\u1175\u1108\u1161\u11AF","\u110B\u1175\u1109\u1161\u11BC","\u110B\u1175\u1109\u1165\u11BC","\u110B\u1175\u1109\u1173\u11AF","\u110B\u1175\u110B\u1163\u1100\u1175","\u110B\u1175\u110B\u116D\u11BC","\u110B\u1175\u110B\u116E\u11BA","\u110B\u1175\u110B\u116F\u11AF","\u110B\u1175\u110B\u1173\u11A8\u1100\u1169","\u110B\u1175\u110B\u1175\u11A8","\u110B\u1175\u110C\u1165\u11AB","\u110B\u1175\u110C\u116E\u11BC","\u110B\u1175\u1110\u1173\u11AE\u1102\u1161\u11AF","\u110B\u1175\u1110\u1173\u11AF","\u110B\u1175\u1112\u1169\u11AB","\u110B\u1175\u11AB\u1100\u1161\u11AB","\u110B\u1175\u11AB\u1100\u1167\u11A8","\u110B\u1175\u11AB\u1100\u1169\u11BC","\u110B\u1175\u11AB\u1100\u116E","\u110B\u1175\u11AB\u1100\u1173\u11AB","\u110B\u1175\u11AB\u1100\u1175","\u110B\u1175\u11AB\u1103\u1169","\u110B\u1175\u11AB\u1105\u1172","\u110B\u1175\u11AB\u1106\u116E\u11AF","\u110B\u1175\u11AB\u1109\u1162\u11BC","\u110B\u1175\u11AB\u1109\u116B","\u110B\u1175\u11AB\u110B\u1167\u11AB","\u110B\u1175\u11AB\u110B\u116F\u11AB","\u110B\u1175\u11AB\u110C\u1162","\u110B\u1175\u11AB\u110C\u1169\u11BC","\u110B\u1175\u11AB\u110E\u1165\u11AB","\u110B\u1175\u11AB\u110E\u1166","\u110B\u1175\u11AB\u1110\u1165\u1102\u1166\u11BA","\u110B\u1175\u11AB\u1112\u1161","\u110B\u1175\u11AB\u1112\u1167\u11BC","\u110B\u1175\u11AF\u1100\u1169\u11B8","\u110B\u1175\u11AF\u1100\u1175","\u110B\u1175\u11AF\u1103\u1161\u11AB","\u110B\u1175\u11AF\u1103\u1162","\u110B\u1175\u11AF\u1103\u1173\u11BC","\u110B\u1175\u11AF\u1107\u1161\u11AB","\u110B\u1175\u11AF\u1107\u1169\u11AB","\u110B\u1175\u11AF\u1107\u116E","\u110B\u1175\u11AF\u1109\u1161\u11BC","\u110B\u1175\u11AF\u1109\u1162\u11BC","\u110B\u1175\u11AF\u1109\u1169\u11AB","\u110B\u1175\u11AF\u110B\u116D\u110B\u1175\u11AF","\u110B\u1175\u11AF\u110B\u116F\u11AF","\u110B\u1175\u11AF\u110C\u1165\u11BC","\u110B\u1175\u11AF\u110C\u1169\u11BC","\u110B\u1175\u11AF\u110C\u116E\u110B\u1175\u11AF","\u110B\u1175\u11AF\u110D\u1175\u11A8","\u110B\u1175\u11AF\u110E\u1166","\u110B\u1175\u11AF\u110E\u1175","\u110B\u1175\u11AF\u1112\u1162\u11BC","\u110B\u1175\u11AF\u1112\u116C\u110B\u116D\u11BC","\u110B\u1175\u11B7\u1100\u1173\u11B7","\u110B\u1175\u11B7\u1106\u116E","\u110B\u1175\u11B8\u1103\u1162","\u110B\u1175\u11B8\u1105\u1167\u11A8","\u110B\u1175\u11B8\u1106\u1161\u11BA","\u110B\u1175\u11B8\u1109\u1161","\u110B\u1175\u11B8\u1109\u116E\u11AF","\u110B\u1175\u11B8\u1109\u1175","\u110B\u1175\u11B8\u110B\u116F\u11AB","\u110B\u1175\u11B8\u110C\u1161\u11BC","\u110B\u1175\u11B8\u1112\u1161\u11A8","\u110C\u1161\u1100\u1161\u110B\u116D\u11BC","\u110C\u1161\u1100\u1167\u11A8","\u110C\u1161\u1100\u1173\u11A8","\u110C\u1161\u1103\u1169\u11BC","\u110C\u1161\u1105\u1161\u11BC","\u110C\u1161\u1107\u116E\u1109\u1175\u11B7","\u110C\u1161\u1109\u1175\u11A8","\u110C\u1161\u1109\u1175\u11AB","\u110C\u1161\u110B\u1167\u11AB","\u110C\u1161\u110B\u116F\u11AB","\u110C\u1161\u110B\u1172\u11AF","\u110C\u1161\u110C\u1165\u11AB\u1100\u1165","\u110C\u1161\u110C\u1165\u11BC","\u110C\u1161\u110C\u1169\u11AB\u1109\u1175\u11B7","\u110C\u1161\u1111\u1161\u11AB","\u110C\u1161\u11A8\u1100\u1161","\u110C\u1161\u11A8\u1102\u1167\u11AB","\u110C\u1161\u11A8\u1109\u1165\u11BC","\u110C\u1161\u11A8\u110B\u1165\u11B8","\u110C\u1161\u11A8\u110B\u116D\u11BC","\u110C\u1161\u11A8\u110B\u1173\u11AB\u1104\u1161\u11AF","\u110C\u1161\u11A8\u1111\u116E\u11B7","\u110C\u1161\u11AB\u1103\u1175","\u110C\u1161\u11AB\u1104\u1173\u11A8","\u110C\u1161\u11AB\u110E\u1175","\u110C\u1161\u11AF\u1106\u1169\u11BA","\u110C\u1161\u11B7\u1101\u1161\u11AB","\u110C\u1161\u11B7\u1109\u116E\u1112\u1161\u11B7","\u110C\u1161\u11B7\u1109\u1175","\u110C\u1161\u11B7\u110B\u1169\u11BA","\u110C\u1161\u11B7\u110C\u1161\u1105\u1175","\u110C\u1161\u11B8\u110C\u1175","\u110C\u1161\u11BC\u1100\u116A\u11AB","\u110C\u1161\u11BC\u1100\u116E\u11AB","\u110C\u1161\u11BC\u1100\u1175\u1100\u1161\u11AB","\u110C\u1161\u11BC\u1105\u1162","\u110C\u1161\u11BC\u1105\u1168","\u110C\u1161\u11BC\u1105\u1173","\u110C\u1161\u11BC\u1106\u1161","\u110C\u1161\u11BC\u1106\u1167\u11AB","\u110C\u1161\u11BC\u1106\u1169","\u110C\u1161\u11BC\u1106\u1175","\u110C\u1161\u11BC\u1107\u1175","\u110C\u1161\u11BC\u1109\u1161","\u110C\u1161\u11BC\u1109\u1169","\u110C\u1161\u11BC\u1109\u1175\u11A8","\u110C\u1161\u11BC\u110B\u1162\u110B\u1175\u11AB","\u110C\u1161\u11BC\u110B\u1175\u11AB","\u110C\u1161\u11BC\u110C\u1165\u11B7","\u110C\u1161\u11BC\u110E\u1161","\u110C\u1161\u11BC\u1112\u1161\u11A8\u1100\u1173\u11B7","\u110C\u1162\u1102\u1173\u11BC","\u110C\u1162\u1108\u1161\u11AF\u1105\u1175","\u110C\u1162\u1109\u1161\u11AB","\u110C\u1162\u1109\u1162\u11BC","\u110C\u1162\u110C\u1161\u11A8\u1102\u1167\u11AB","\u110C\u1162\u110C\u1165\u11BC","\u110C\u1162\u110E\u1162\u1100\u1175","\u110C\u1162\u1111\u1161\u11AB","\u110C\u1162\u1112\u1161\u11A8","\u110C\u1162\u1112\u116A\u11AF\u110B\u116D\u11BC","\u110C\u1165\u1100\u1165\u11BA","\u110C\u1165\u1100\u1169\u1105\u1175","\u110C\u1165\u1100\u1169\u11BA","\u110C\u1165\u1102\u1167\u11A8","\u110C\u1165\u1105\u1165\u11AB","\u110C\u1165\u1105\u1165\u11C2\u1100\u1166","\u110C\u1165\u1107\u1165\u11AB","\u110C\u1165\u110B\u116E\u11AF","\u110C\u1165\u110C\u1165\u11AF\u1105\u1169","\u110C\u1165\u110E\u116E\u11A8","\u110C\u1165\u11A8\u1100\u1173\u11A8","\u110C\u1165\u11A8\u1103\u1161\u11BC\u1112\u1175","\u110C\u1165\u11A8\u1109\u1165\u11BC","\u110C\u1165\u11A8\u110B\u116D\u11BC","\u110C\u1165\u11A8\u110B\u1173\u11BC","\u110C\u1165\u11AB\u1100\u1162","\u110C\u1165\u11AB\u1100\u1169\u11BC","\u110C\u1165\u11AB\u1100\u1175","\u110C\u1165\u11AB\u1103\u1161\u11AF","\u110C\u1165\u11AB\u1105\u1161\u1103\u1169","\u110C\u1165\u11AB\u1106\u1161\u11BC","\u110C\u1165\u11AB\u1106\u116E\u11AB","\u110C\u1165\u11AB\u1107\u1161\u11AB","\u110C\u1165\u11AB\u1107\u116E","\u110C\u1165\u11AB\u1109\u1166","\u110C\u1165\u11AB\u1109\u1175","\u110C\u1165\u11AB\u110B\u116D\u11BC","\u110C\u1165\u11AB\u110C\u1161","\u110C\u1165\u11AB\u110C\u1162\u11BC","\u110C\u1165\u11AB\u110C\u116E","\u110C\u1165\u11AB\u110E\u1165\u11AF","\u110C\u1165\u11AB\u110E\u1166","\u110C\u1165\u11AB\u1110\u1169\u11BC","\u110C\u1165\u11AB\u1112\u1167","\u110C\u1165\u11AB\u1112\u116E","\u110C\u1165\u11AF\u1103\u1162","\u110C\u1165\u11AF\u1106\u1161\u11BC","\u110C\u1165\u11AF\u1107\u1161\u11AB","\u110C\u1165\u11AF\u110B\u1163\u11A8","\u110C\u1165\u11AF\u110E\u1161","\u110C\u1165\u11B7\u1100\u1165\u11B7","\u110C\u1165\u11B7\u1109\u116E","\u110C\u1165\u11B7\u1109\u1175\u11B7","\u110C\u1165\u11B7\u110B\u116F\u11AB","\u110C\u1165\u11B7\u110C\u1165\u11B7","\u110C\u1165\u11B7\u110E\u1161","\u110C\u1165\u11B8\u1100\u1173\u11AB","\u110C\u1165\u11B8\u1109\u1175","\u110C\u1165\u11B8\u110E\u1169\u11A8","\u110C\u1165\u11BA\u1100\u1161\u1105\u1161\u11A8","\u110C\u1165\u11BC\u1100\u1165\u110C\u1161\u11BC","\u110C\u1165\u11BC\u1103\u1169","\u110C\u1165\u11BC\u1105\u1172\u110C\u1161\u11BC","\u110C\u1165\u11BC\u1105\u1175","\u110C\u1165\u11BC\u1106\u1161\u11AF","\u110C\u1165\u11BC\u1106\u1167\u11AB","\u110C\u1165\u11BC\u1106\u116E\u11AB","\u110C\u1165\u11BC\u1107\u1161\u11AB\u1103\u1162","\u110C\u1165\u11BC\u1107\u1169","\u110C\u1165\u11BC\u1107\u116E","\u110C\u1165\u11BC\u1107\u1175","\u110C\u1165\u11BC\u1109\u1161\u11BC","\u110C\u1165\u11BC\u1109\u1165\u11BC","\u110C\u1165\u11BC\u110B\u1169","\u110C\u1165\u11BC\u110B\u116F\u11AB","\u110C\u1165\u11BC\u110C\u1161\u11BC","\u110C\u1165\u11BC\u110C\u1175","\u110C\u1165\u11BC\u110E\u1175","\u110C\u1165\u11BC\u1112\u116A\u11A8\u1112\u1175","\u110C\u1166\u1100\u1169\u11BC","\u110C\u1166\u1100\u116A\u110C\u1165\u11B7","\u110C\u1166\u1103\u1162\u1105\u1169","\u110C\u1166\u1106\u1169\u11A8","\u110C\u1166\u1107\u1161\u11AF","\u110C\u1166\u1107\u1165\u11B8","\u110C\u1166\u1109\u1161\u11BA\u1102\u1161\u11AF","\u110C\u1166\u110B\u1161\u11AB","\u110C\u1166\u110B\u1175\u11AF","\u110C\u1166\u110C\u1161\u11A8","\u110C\u1166\u110C\u116E\u1103\u1169","\u110C\u1166\u110E\u116E\u11AF","\u110C\u1166\u1111\u116E\u11B7","\u110C\u1166\u1112\u1161\u11AB","\u110C\u1169\u1100\u1161\u11A8","\u110C\u1169\u1100\u1165\u11AB","\u110C\u1169\u1100\u1173\u11B7","\u110C\u1169\u1100\u1175\u11BC","\u110C\u1169\u1106\u1167\u11BC","\u110C\u1169\u1106\u1175\u1105\u116D","\u110C\u1169\u1109\u1161\u11BC","\u110C\u1169\u1109\u1165\u11AB","\u110C\u1169\u110B\u116D\u11BC\u1112\u1175","\u110C\u1169\u110C\u1165\u11AF","\u110C\u1169\u110C\u1165\u11BC","\u110C\u1169\u110C\u1175\u11A8","\u110C\u1169\u11AB\u1103\u1162\u11BA\u1106\u1161\u11AF","\u110C\u1169\u11AB\u110C\u1162","\u110C\u1169\u11AF\u110B\u1165\u11B8","\u110C\u1169\u11AF\u110B\u1173\u11B7","\u110C\u1169\u11BC\u1100\u116D","\u110C\u1169\u11BC\u1105\u1169","\u110C\u1169\u11BC\u1105\u1172","\u110C\u1169\u11BC\u1109\u1169\u1105\u1175","\u110C\u1169\u11BC\u110B\u1165\u11B8\u110B\u116F\u11AB","\u110C\u1169\u11BC\u110C\u1169\u11BC","\u110C\u1169\u11BC\u1112\u1161\u11B8","\u110C\u116A\u1109\u1165\u11A8","\u110C\u116C\u110B\u1175\u11AB","\u110C\u116E\u1100\u116A\u11AB\u110C\u1165\u11A8","\u110C\u116E\u1105\u1173\u11B7","\u110C\u116E\u1106\u1161\u11AF","\u110C\u116E\u1106\u1165\u1102\u1175","\u110C\u116E\u1106\u1165\u11A8","\u110C\u116E\u1106\u116E\u11AB","\u110C\u116E\u1106\u1175\u11AB","\u110C\u116E\u1107\u1161\u11BC","\u110C\u116E\u1107\u1167\u11AB","\u110C\u116E\u1109\u1175\u11A8","\u110C\u116E\u110B\u1175\u11AB","\u110C\u116E\u110B\u1175\u11AF","\u110C\u116E\u110C\u1161\u11BC","\u110C\u116E\u110C\u1165\u11AB\u110C\u1161","\u110C\u116E\u1110\u1162\u11A8","\u110C\u116E\u11AB\u1107\u1175","\u110C\u116E\u11AF\u1100\u1165\u1105\u1175","\u110C\u116E\u11AF\u1100\u1175","\u110C\u116E\u11AF\u1106\u116E\u1102\u1174","\u110C\u116E\u11BC\u1100\u1161\u11AB","\u110C\u116E\u11BC\u1100\u1168\u1107\u1161\u11BC\u1109\u1169\u11BC","\u110C\u116E\u11BC\u1100\u116E\u11A8","\u110C\u116E\u11BC\u1102\u1167\u11AB","\u110C\u116E\u11BC\u1103\u1161\u11AB","\u110C\u116E\u11BC\u1103\u1169\u11A8","\u110C\u116E\u11BC\u1107\u1161\u11AB","\u110C\u116E\u11BC\u1107\u116E","\u110C\u116E\u11BC\u1109\u1166","\u110C\u116E\u11BC\u1109\u1169\u1100\u1175\u110B\u1165\u11B8","\u110C\u116E\u11BC\u1109\u116E\u11AB","\u110C\u116E\u11BC\u110B\u1161\u11BC","\u110C\u116E\u11BC\u110B\u116D","\u110C\u116E\u11BC\u1112\u1161\u11A8\u1100\u116D","\u110C\u1173\u11A8\u1109\u1165\u11A8","\u110C\u1173\u11A8\u1109\u1175","\u110C\u1173\u11AF\u1100\u1165\u110B\u116E\u11B7","\u110C\u1173\u11BC\u1100\u1161","\u110C\u1173\u11BC\u1100\u1165","\u110C\u1173\u11BC\u1100\u116F\u11AB","\u110C\u1173\u11BC\u1109\u1161\u11BC","\u110C\u1173\u11BC\u1109\u1166","\u110C\u1175\u1100\u1161\u11A8","\u110C\u1175\u1100\u1161\u11B8","\u110C\u1175\u1100\u1167\u11BC","\u110C\u1175\u1100\u1173\u11A8\u1112\u1175","\u110C\u1175\u1100\u1173\u11B7","\u110C\u1175\u1100\u1173\u11B8","\u110C\u1175\u1102\u1173\u11BC","\u110C\u1175\u1105\u1173\u11B7\u1100\u1175\u11AF","\u110C\u1175\u1105\u1175\u1109\u1161\u11AB","\u110C\u1175\u1107\u1161\u11BC","\u110C\u1175\u1107\u116E\u11BC","\u110C\u1175\u1109\u1175\u11A8","\u110C\u1175\u110B\u1167\u11A8","\u110C\u1175\u110B\u116E\u1100\u1162","\u110C\u1175\u110B\u116F\u11AB","\u110C\u1175\u110C\u1165\u11A8","\u110C\u1175\u110C\u1165\u11B7","\u110C\u1175\u110C\u1175\u11AB","\u110C\u1175\u110E\u116E\u11AF","\u110C\u1175\u11A8\u1109\u1165\u11AB","\u110C\u1175\u11A8\u110B\u1165\u11B8","\u110C\u1175\u11A8\u110B\u116F\u11AB","\u110C\u1175\u11A8\u110C\u1161\u11BC","\u110C\u1175\u11AB\u1100\u1173\u11B8","\u110C\u1175\u11AB\u1103\u1169\u11BC","\u110C\u1175\u11AB\u1105\u1169","\u110C\u1175\u11AB\u1105\u116D","\u110C\u1175\u11AB\u1105\u1175","\u110C\u1175\u11AB\u110D\u1161","\u110C\u1175\u11AB\u110E\u1161\u11AF","\u110C\u1175\u11AB\u110E\u116E\u11AF","\u110C\u1175\u11AB\u1110\u1169\u11BC","\u110C\u1175\u11AB\u1112\u1162\u11BC","\u110C\u1175\u11AF\u1106\u116E\u11AB","\u110C\u1175\u11AF\u1107\u1167\u11BC","\u110C\u1175\u11AF\u1109\u1165","\u110C\u1175\u11B7\u110C\u1161\u11A8","\u110C\u1175\u11B8\u1103\u1161\u11AB","\u110C\u1175\u11B8\u110B\u1161\u11AB","\u110C\u1175\u11B8\u110C\u116E\u11BC","\u110D\u1161\u110C\u1173\u11BC","\u110D\u1175\u1101\u1165\u1100\u1175","\u110E\u1161\u1102\u1161\u11B7","\u110E\u1161\u1105\u1161\u1105\u1175","\u110E\u1161\u1105\u1163\u11BC","\u110E\u1161\u1105\u1175\u11B7","\u110E\u1161\u1107\u1167\u11AF","\u110E\u1161\u1109\u1165\u11AB","\u110E\u1161\u110E\u1173\u11B7","\u110E\u1161\u11A8\u1100\u1161\u11A8","\u110E\u1161\u11AB\u1106\u116E\u11AF","\u110E\u1161\u11AB\u1109\u1165\u11BC","\u110E\u1161\u11B7\u1100\u1161","\u110E\u1161\u11B7\u1100\u1175\u1105\u1173\u11B7","\u110E\u1161\u11B7\u1109\u1162","\u110E\u1161\u11B7\u1109\u1165\u11A8","\u110E\u1161\u11B7\u110B\u1167","\u110E\u1161\u11B7\u110B\u116C","\u110E\u1161\u11B7\u110C\u1169","\u110E\u1161\u11BA\u110C\u1161\u11AB","\u110E\u1161\u11BC\u1100\u1161","\u110E\u1161\u11BC\u1100\u1169","\u110E\u1161\u11BC\u1100\u116E","\u110E\u1161\u11BC\u1106\u116E\u11AB","\u110E\u1161\u11BC\u1107\u1161\u11A9","\u110E\u1161\u11BC\u110C\u1161\u11A8","\u110E\u1161\u11BC\u110C\u1169","\u110E\u1162\u1102\u1165\u11AF","\u110E\u1162\u110C\u1165\u11B7","\u110E\u1162\u11A8\u1100\u1161\u1107\u1161\u11BC","\u110E\u1162\u11A8\u1107\u1161\u11BC","\u110E\u1162\u11A8\u1109\u1161\u11BC","\u110E\u1162\u11A8\u110B\u1175\u11B7","\u110E\u1162\u11B7\u1111\u1175\u110B\u1165\u11AB","\u110E\u1165\u1107\u1165\u11AF","\u110E\u1165\u110B\u1173\u11B7","\u110E\u1165\u11AB\u1100\u116E\u11A8","\u110E\u1165\u11AB\u1103\u116E\u11BC","\u110E\u1165\u11AB\u110C\u1161\u11BC","\u110E\u1165\u11AB\u110C\u1162","\u110E\u1165\u11AB\u110E\u1165\u11AB\u1112\u1175","\u110E\u1165\u11AF\u1103\u1169","\u110E\u1165\u11AF\u110C\u1165\u1112\u1175","\u110E\u1165\u11AF\u1112\u1161\u11A8","\u110E\u1165\u11BA\u1102\u1161\u11AF","\u110E\u1165\u11BA\u110D\u1162","\u110E\u1165\u11BC\u1102\u1167\u11AB","\u110E\u1165\u11BC\u1107\u1161\u110C\u1175","\u110E\u1165\u11BC\u1109\u1169","\u110E\u1165\u11BC\u110E\u116E\u11AB","\u110E\u1166\u1100\u1168","\u110E\u1166\u1105\u1167\u11A8","\u110E\u1166\u110B\u1169\u11AB","\u110E\u1166\u110B\u1172\u11A8","\u110E\u1166\u110C\u116E\u11BC","\u110E\u1166\u1112\u1165\u11B7","\u110E\u1169\u1103\u1173\u11BC\u1112\u1161\u11A8\u1109\u1162\u11BC","\u110E\u1169\u1107\u1161\u11AB","\u110E\u1169\u1107\u1161\u11B8","\u110E\u1169\u1109\u1161\u11BC\u1112\u116A","\u110E\u1169\u1109\u116E\u11AB","\u110E\u1169\u110B\u1167\u1105\u1173\u11B7","\u110E\u1169\u110B\u116F\u11AB","\u110E\u1169\u110C\u1165\u1102\u1167\u11A8","\u110E\u1169\u110C\u1165\u11B7","\u110E\u1169\u110E\u1165\u11BC","\u110E\u1169\u110F\u1169\u11AF\u1105\u1175\u11BA","\u110E\u1169\u11BA\u1107\u116E\u11AF","\u110E\u1169\u11BC\u1100\u1161\u11A8","\u110E\u1169\u11BC\u1105\u1175","\u110E\u1169\u11BC\u110C\u1161\u11BC","\u110E\u116A\u11AF\u110B\u1167\u11BC","\u110E\u116C\u1100\u1173\u11AB","\u110E\u116C\u1109\u1161\u11BC","\u110E\u116C\u1109\u1165\u11AB","\u110E\u116C\u1109\u1175\u11AB","\u110E\u116C\u110B\u1161\u11A8","\u110E\u116C\u110C\u1169\u11BC","\u110E\u116E\u1109\u1165\u11A8","\u110E\u116E\u110B\u1165\u11A8","\u110E\u116E\u110C\u1175\u11AB","\u110E\u116E\u110E\u1165\u11AB","\u110E\u116E\u110E\u1173\u11A8","\u110E\u116E\u11A8\u1100\u116E","\u110E\u116E\u11A8\u1109\u1169","\u110E\u116E\u11A8\u110C\u1166","\u110E\u116E\u11A8\u1112\u1161","\u110E\u116E\u11AF\u1100\u1173\u11AB","\u110E\u116E\u11AF\u1107\u1161\u11AF","\u110E\u116E\u11AF\u1109\u1161\u11AB","\u110E\u116E\u11AF\u1109\u1175\u11AB","\u110E\u116E\u11AF\u110B\u1167\u11AB","\u110E\u116E\u11AF\u110B\u1175\u11B8","\u110E\u116E\u11AF\u110C\u1161\u11BC","\u110E\u116E\u11AF\u1111\u1161\u11AB","\u110E\u116E\u11BC\u1100\u1167\u11A8","\u110E\u116E\u11BC\u1100\u1169","\u110E\u116E\u11BC\u1103\u1169\u11AF","\u110E\u116E\u11BC\u1107\u116E\u11AB\u1112\u1175","\u110E\u116E\u11BC\u110E\u1165\u11BC\u1103\u1169","\u110E\u1171\u110B\u1165\u11B8","\u110E\u1171\u110C\u1175\u11A8","\u110E\u1171\u1112\u1163\u11BC","\u110E\u1175\u110B\u1163\u11A8","\u110E\u1175\u11AB\u1100\u116E","\u110E\u1175\u11AB\u110E\u1165\u11A8","\u110E\u1175\u11AF\u1109\u1175\u11B8","\u110E\u1175\u11AF\u110B\u116F\u11AF","\u110E\u1175\u11AF\u1111\u1161\u11AB","\u110E\u1175\u11B7\u1103\u1162","\u110E\u1175\u11B7\u1106\u116E\u11A8","\u110E\u1175\u11B7\u1109\u1175\u11AF","\u110E\u1175\u11BA\u1109\u1169\u11AF","\u110E\u1175\u11BC\u110E\u1161\u11AB","\u110F\u1161\u1106\u1166\u1105\u1161","\u110F\u1161\u110B\u116E\u11AB\u1110\u1165","\u110F\u1161\u11AF\u1100\u116E\u11A8\u1109\u116E","\u110F\u1162\u1105\u1175\u11A8\u1110\u1165","\u110F\u1162\u11B7\u1111\u1165\u1109\u1173","\u110F\u1162\u11B7\u1111\u1166\u110B\u1175\u11AB","\u110F\u1165\u1110\u1173\u11AB","\u110F\u1165\u11AB\u1103\u1175\u1109\u1167\u11AB","\u110F\u1165\u11AF\u1105\u1165","\u110F\u1165\u11B7\u1111\u1172\u1110\u1165","\u110F\u1169\u1101\u1175\u1105\u1175","\u110F\u1169\u1106\u1175\u1103\u1175","\u110F\u1169\u11AB\u1109\u1165\u1110\u1173","\u110F\u1169\u11AF\u1105\u1161","\u110F\u1169\u11B7\u1111\u1173\u11AF\u1105\u1166\u11A8\u1109\u1173","\u110F\u1169\u11BC\u1102\u1161\u1106\u116E\u11AF","\u110F\u116B\u1100\u1161\u11B7","\u110F\u116E\u1103\u1166\u1110\u1161","\u110F\u1173\u1105\u1175\u11B7","\u110F\u1173\u11AB\u1100\u1175\u11AF","\u110F\u1173\u11AB\u1104\u1161\u11AF","\u110F\u1173\u11AB\u1109\u1169\u1105\u1175","\u110F\u1173\u11AB\u110B\u1161\u1103\u1173\u11AF","\u110F\u1173\u11AB\u110B\u1165\u1106\u1165\u1102\u1175","\u110F\u1173\u11AB\u110B\u1175\u11AF","\u110F\u1173\u11AB\u110C\u1165\u11AF","\u110F\u1173\u11AF\u1105\u1162\u1109\u1175\u11A8","\u110F\u1173\u11AF\u1105\u1165\u11B8","\u110F\u1175\u11AF\u1105\u1169","\u1110\u1161\u110B\u1175\u11B8","\u1110\u1161\u110C\u1161\u1100\u1175","\u1110\u1161\u11A8\u1100\u116E","\u1110\u1161\u11A8\u110C\u1161","\u1110\u1161\u11AB\u1109\u1162\u11BC","\u1110\u1162\u1100\u116F\u11AB\u1103\u1169","\u1110\u1162\u110B\u1163\u11BC","\u1110\u1162\u1111\u116E\u11BC","\u1110\u1162\u11A8\u1109\u1175","\u1110\u1162\u11AF\u1105\u1165\u11AB\u1110\u1173","\u1110\u1165\u1102\u1165\u11AF","\u1110\u1165\u1106\u1175\u1102\u1165\u11AF","\u1110\u1166\u1102\u1175\u1109\u1173","\u1110\u1166\u1109\u1173\u1110\u1173","\u1110\u1166\u110B\u1175\u1107\u1173\u11AF","\u1110\u1166\u11AF\u1105\u1166\u1107\u1175\u110C\u1165\u11AB","\u1110\u1169\u1105\u1169\u11AB","\u1110\u1169\u1106\u1161\u1110\u1169","\u1110\u1169\u110B\u116D\u110B\u1175\u11AF","\u1110\u1169\u11BC\u1100\u1168","\u1110\u1169\u11BC\u1100\u116A","\u1110\u1169\u11BC\u1105\u1169","\u1110\u1169\u11BC\u1109\u1175\u11AB","\u1110\u1169\u11BC\u110B\u1167\u11A8","\u1110\u1169\u11BC\u110B\u1175\u11AF","\u1110\u1169\u11BC\u110C\u1161\u11BC","\u1110\u1169\u11BC\u110C\u1166","\u1110\u1169\u11BC\u110C\u1173\u11BC","\u1110\u1169\u11BC\u1112\u1161\u11B8","\u1110\u1169\u11BC\u1112\u116A","\u1110\u116C\u1100\u1173\u11AB","\u1110\u116C\u110B\u116F\u11AB","\u1110\u116C\u110C\u1175\u11A8\u1100\u1173\u11B7","\u1110\u1171\u1100\u1175\u11B7","\u1110\u1173\u1105\u1165\u11A8","\u1110\u1173\u11A8\u1100\u1173\u11B8","\u1110\u1173\u11A8\u1107\u1167\u11AF","\u1110\u1173\u11A8\u1109\u1165\u11BC","\u1110\u1173\u11A8\u1109\u116E","\u1110\u1173\u11A8\u110C\u1175\u11BC","\u1110\u1173\u11A8\u1112\u1175","\u1110\u1173\u11AB\u1110\u1173\u11AB\u1112\u1175","\u1110\u1175\u1109\u1167\u110E\u1173","\u1111\u1161\u1105\u1161\u11AB\u1109\u1162\u11A8","\u1111\u1161\u110B\u1175\u11AF","\u1111\u1161\u110E\u116E\u11AF\u1109\u1169","\u1111\u1161\u11AB\u1100\u1167\u11AF","\u1111\u1161\u11AB\u1103\u1161\u11AB","\u1111\u1161\u11AB\u1106\u1162","\u1111\u1161\u11AB\u1109\u1161","\u1111\u1161\u11AF\u1109\u1175\u11B8","\u1111\u1161\u11AF\u110B\u116F\u11AF","\u1111\u1161\u11B8\u1109\u1169\u11BC","\u1111\u1162\u1109\u1167\u11AB","\u1111\u1162\u11A8\u1109\u1173","\u1111\u1162\u11A8\u1109\u1175\u1106\u1175\u11AF\u1105\u1175","\u1111\u1162\u11AB\u1110\u1175","\u1111\u1165\u1109\u1166\u11AB\u1110\u1173","\u1111\u1166\u110B\u1175\u11AB\u1110\u1173","\u1111\u1167\u11AB\u1100\u1167\u11AB","\u1111\u1167\u11AB\u110B\u1174","\u1111\u1167\u11AB\u110C\u1175","\u1111\u1167\u11AB\u1112\u1175","\u1111\u1167\u11BC\u1100\u1161","\u1111\u1167\u11BC\u1100\u1172\u11AB","\u1111\u1167\u11BC\u1109\u1162\u11BC","\u1111\u1167\u11BC\u1109\u1169","\u1111\u1167\u11BC\u110B\u1163\u11BC","\u1111\u1167\u11BC\u110B\u1175\u11AF","\u1111\u1167\u11BC\u1112\u116A","\u1111\u1169\u1109\u1173\u1110\u1165","\u1111\u1169\u110B\u1175\u11AB\u1110\u1173","\u1111\u1169\u110C\u1161\u11BC","\u1111\u1169\u1112\u1161\u11B7","\u1111\u116D\u1106\u1167\u11AB","\u1111\u116D\u110C\u1165\u11BC","\u1111\u116D\u110C\u116E\u11AB","\u1111\u116D\u1112\u1167\u11AB","\u1111\u116E\u11B7\u1106\u1169\u11A8","\u1111\u116E\u11B7\u110C\u1175\u11AF","\u1111\u116E\u11BC\u1100\u1167\u11BC","\u1111\u116E\u11BC\u1109\u1169\u11A8","\u1111\u116E\u11BC\u1109\u1173\u11B8","\u1111\u1173\u1105\u1161\u11BC\u1109\u1173","\u1111\u1173\u1105\u1175\u11AB\u1110\u1165","\u1111\u1173\u11AF\u1105\u1161\u1109\u1173\u1110\u1175\u11A8","\u1111\u1175\u1100\u1169\u11AB","\u1111\u1175\u1106\u1161\u11BC","\u1111\u1175\u110B\u1161\u1102\u1169","\u1111\u1175\u11AF\u1105\u1173\u11B7","\u1111\u1175\u11AF\u1109\u116E","\u1111\u1175\u11AF\u110B\u116D","\u1111\u1175\u11AF\u110C\u1161","\u1111\u1175\u11AF\u1110\u1169\u11BC","\u1111\u1175\u11BC\u1100\u1168","\u1112\u1161\u1102\u1173\u1102\u1175\u11B7","\u1112\u1161\u1102\u1173\u11AF","\u1112\u1161\u1103\u1173\u110B\u1170\u110B\u1165","\u1112\u1161\u1105\u116E\u11BA\u1107\u1161\u11B7","\u1112\u1161\u1107\u1161\u11AB\u1100\u1175","\u1112\u1161\u1109\u116E\u11A8\u110C\u1175\u11B8","\u1112\u1161\u1109\u116E\u11AB","\u1112\u1161\u110B\u1167\u1110\u1173\u11AB","\u1112\u1161\u110C\u1175\u1106\u1161\u11AB","\u1112\u1161\u110E\u1165\u11AB","\u1112\u1161\u1111\u116E\u11B7","\u1112\u1161\u1111\u1175\u11AF","\u1112\u1161\u11A8\u1100\u116A","\u1112\u1161\u11A8\u1100\u116D","\u1112\u1161\u11A8\u1100\u1173\u11B8","\u1112\u1161\u11A8\u1100\u1175","\u1112\u1161\u11A8\u1102\u1167\u11AB","\u1112\u1161\u11A8\u1105\u1167\u11A8","\u1112\u1161\u11A8\u1107\u1165\u11AB","\u1112\u1161\u11A8\u1107\u116E\u1106\u1169","\u1112\u1161\u11A8\u1107\u1175","\u1112\u1161\u11A8\u1109\u1162\u11BC","\u1112\u1161\u11A8\u1109\u116E\u11AF","\u1112\u1161\u11A8\u1109\u1173\u11B8","\u1112\u1161\u11A8\u110B\u116D\u11BC\u1111\u116E\u11B7","\u1112\u1161\u11A8\u110B\u116F\u11AB","\u1112\u1161\u11A8\u110B\u1171","\u1112\u1161\u11A8\u110C\u1161","\u1112\u1161\u11A8\u110C\u1165\u11B7","\u1112\u1161\u11AB\u1100\u1168","\u1112\u1161\u11AB\u1100\u1173\u11AF","\u1112\u1161\u11AB\u1101\u1165\u1107\u1165\u11AB\u110B\u1166","\u1112\u1161\u11AB\u1102\u1161\u11BD","\u1112\u1161\u11AB\u1102\u116E\u11AB","\u1112\u1161\u11AB\u1103\u1169\u11BC\u110B\u1161\u11AB","\u1112\u1161\u11AB\u1104\u1162","\u1112\u1161\u11AB\u1105\u1161\u1109\u1161\u11AB","\u1112\u1161\u11AB\u1106\u1161\u1103\u1175","\u1112\u1161\u11AB\u1106\u116E\u11AB","\u1112\u1161\u11AB\u1107\u1165\u11AB","\u1112\u1161\u11AB\u1107\u1169\u11A8","\u1112\u1161\u11AB\u1109\u1175\u11A8","\u1112\u1161\u11AB\u110B\u1167\u1105\u1173\u11B7","\u1112\u1161\u11AB\u110D\u1169\u11A8","\u1112\u1161\u11AF\u1106\u1165\u1102\u1175","\u1112\u1161\u11AF\u110B\u1161\u1107\u1165\u110C\u1175","\u1112\u1161\u11AF\u110B\u1175\u11AB","\u1112\u1161\u11B7\u1101\u1166","\u1112\u1161\u11B7\u1107\u116E\u1105\u1169","\u1112\u1161\u11B8\u1100\u1167\u11A8","\u1112\u1161\u11B8\u1105\u1175\u110C\u1165\u11A8","\u1112\u1161\u11BC\u1100\u1169\u11BC","\u1112\u1161\u11BC\u1100\u116E","\u1112\u1161\u11BC\u1109\u1161\u11BC","\u1112\u1161\u11BC\u110B\u1174","\u1112\u1162\u1100\u1167\u11AF","\u1112\u1162\u1100\u116E\u11AB","\u1112\u1162\u1103\u1161\u11B8","\u1112\u1162\u1103\u1161\u11BC","\u1112\u1162\u1106\u116E\u11AF","\u1112\u1162\u1109\u1165\u11A8","\u1112\u1162\u1109\u1165\u11AF","\u1112\u1162\u1109\u116E\u110B\u116D\u11A8\u110C\u1161\u11BC","\u1112\u1162\u110B\u1161\u11AB","\u1112\u1162\u11A8\u1109\u1175\u11B7","\u1112\u1162\u11AB\u1103\u1173\u1107\u1162\u11A8","\u1112\u1162\u11B7\u1107\u1165\u1100\u1165","\u1112\u1162\u11BA\u1107\u1167\u11C0","\u1112\u1162\u11BA\u1109\u1161\u11AF","\u1112\u1162\u11BC\u1103\u1169\u11BC","\u1112\u1162\u11BC\u1107\u1169\u11A8","\u1112\u1162\u11BC\u1109\u1161","\u1112\u1162\u11BC\u110B\u116E\u11AB","\u1112\u1162\u11BC\u110B\u1171","\u1112\u1163\u11BC\u1100\u1175","\u1112\u1163\u11BC\u1109\u1161\u11BC","\u1112\u1163\u11BC\u1109\u116E","\u1112\u1165\u1105\u1161\u11A8","\u1112\u1165\u110B\u116D\u11BC","\u1112\u1166\u11AF\u1100\u1175","\u1112\u1167\u11AB\u1100\u116A\u11AB","\u1112\u1167\u11AB\u1100\u1173\u11B7","\u1112\u1167\u11AB\u1103\u1162","\u1112\u1167\u11AB\u1109\u1161\u11BC","\u1112\u1167\u11AB\u1109\u1175\u11AF","\u1112\u1167\u11AB\u110C\u1161\u11BC","\u1112\u1167\u11AB\u110C\u1162","\u1112\u1167\u11AB\u110C\u1175","\u1112\u1167\u11AF\u110B\u1162\u11A8","\u1112\u1167\u11B8\u1105\u1167\u11A8","\u1112\u1167\u11BC\u1107\u116E","\u1112\u1167\u11BC\u1109\u1161","\u1112\u1167\u11BC\u1109\u116E","\u1112\u1167\u11BC\u1109\u1175\u11A8","\u1112\u1167\u11BC\u110C\u1166","\u1112\u1167\u11BC\u1110\u1162","\u1112\u1167\u11BC\u1111\u1167\u11AB","\u1112\u1168\u1110\u1162\u11A8","\u1112\u1169\u1100\u1175\u1109\u1175\u11B7","\u1112\u1169\u1102\u1161\u11B7","\u1112\u1169\u1105\u1161\u11BC\u110B\u1175","\u1112\u1169\u1107\u1161\u11A8","\u1112\u1169\u1110\u1166\u11AF","\u1112\u1169\u1112\u1173\u11B8","\u1112\u1169\u11A8\u1109\u1175","\u1112\u1169\u11AF\u1105\u1169","\u1112\u1169\u11B7\u1111\u1166\u110B\u1175\u110C\u1175","\u1112\u1169\u11BC\u1107\u1169","\u1112\u1169\u11BC\u1109\u116E","\u1112\u1169\u11BC\u110E\u1161","\u1112\u116A\u1106\u1167\u11AB","\u1112\u116A\u1107\u116E\u11AB","\u1112\u116A\u1109\u1161\u11AF","\u1112\u116A\u110B\u116D\u110B\u1175\u11AF","\u1112\u116A\u110C\u1161\u11BC","\u1112\u116A\u1112\u1161\u11A8","\u1112\u116A\u11A8\u1107\u1169","\u1112\u116A\u11A8\u110B\u1175\u11AB","\u1112\u116A\u11A8\u110C\u1161\u11BC","\u1112\u116A\u11A8\u110C\u1165\u11BC","\u1112\u116A\u11AB\u1100\u1161\u11B8","\u1112\u116A\u11AB\u1100\u1167\u11BC","\u1112\u116A\u11AB\u110B\u1167\u11BC","\u1112\u116A\u11AB\u110B\u1172\u11AF","\u1112\u116A\u11AB\u110C\u1161","\u1112\u116A\u11AF\u1100\u1175","\u1112\u116A\u11AF\u1103\u1169\u11BC","\u1112\u116A\u11AF\u1107\u1161\u11AF\u1112\u1175","\u1112\u116A\u11AF\u110B\u116D\u11BC","\u1112\u116A\u11AF\u110D\u1161\u11A8","\u1112\u116C\u1100\u1167\u11AB","\u1112\u116C\u1100\u116A\u11AB","\u1112\u116C\u1107\u1169\u11A8","\u1112\u116C\u1109\u1162\u11A8","\u1112\u116C\u110B\u116F\u11AB","\u1112\u116C\u110C\u1161\u11BC","\u1112\u116C\u110C\u1165\u11AB","\u1112\u116C\u11BA\u1109\u116E","\u1112\u116C\u11BC\u1103\u1161\u11AB\u1107\u1169\u1103\u1169","\u1112\u116D\u110B\u1172\u11AF\u110C\u1165\u11A8","\u1112\u116E\u1107\u1161\u11AB","\u1112\u116E\u110E\u116E\u11BA\u1100\u1161\u1105\u116E","\u1112\u116E\u11AB\u1105\u1167\u11AB","\u1112\u116F\u11AF\u110A\u1175\u11AB","\u1112\u1172\u1109\u1175\u11A8","\u1112\u1172\u110B\u1175\u11AF","\u1112\u1172\u11BC\u1102\u1162","\u1112\u1173\u1105\u1173\u11B7","\u1112\u1173\u11A8\u1107\u1162\u11A8","\u1112\u1173\u11A8\u110B\u1175\u11AB","\u1112\u1173\u11AB\u110C\u1165\u11A8","\u1112\u1173\u11AB\u1112\u1175","\u1112\u1173\u11BC\u1106\u1175","\u1112\u1173\u11BC\u1107\u116E\u11AB","\u1112\u1174\u1100\u1169\u11A8","\u1112\u1174\u1106\u1161\u11BC","\u1112\u1174\u1109\u1162\u11BC","\u1112\u1174\u11AB\u1109\u1162\u11A8","\u1112\u1175\u11B7\u1101\u1165\u11BA"]'), qd = JSON.parse('["abaisser","abandon","abdiquer","abeille","abolir","aborder","aboutir","aboyer","abrasif","abreuver","abriter","abroger","abrupt","absence","absolu","absurde","abusif","abyssal","acade\u0301mie","acajou","acarien","accabler","accepter","acclamer","accolade","accroche","accuser","acerbe","achat","acheter","aciduler","acier","acompte","acque\u0301rir","acronyme","acteur","actif","actuel","adepte","ade\u0301quat","adhe\u0301sif","adjectif","adjuger","admettre","admirer","adopter","adorer","adoucir","adresse","adroit","adulte","adverbe","ae\u0301rer","ae\u0301ronef","affaire","affecter","affiche","affreux","affubler","agacer","agencer","agile","agiter","agrafer","agre\u0301able","agrume","aider","aiguille","ailier","aimable","aisance","ajouter","ajuster","alarmer","alchimie","alerte","alge\u0300bre","algue","alie\u0301ner","aliment","alle\u0301ger","alliage","allouer","allumer","alourdir","alpaga","altesse","alve\u0301ole","amateur","ambigu","ambre","ame\u0301nager","amertume","amidon","amiral","amorcer","amour","amovible","amphibie","ampleur","amusant","analyse","anaphore","anarchie","anatomie","ancien","ane\u0301antir","angle","angoisse","anguleux","animal","annexer","annonce","annuel","anodin","anomalie","anonyme","anormal","antenne","antidote","anxieux","apaiser","ape\u0301ritif","aplanir","apologie","appareil","appeler","apporter","appuyer","aquarium","aqueduc","arbitre","arbuste","ardeur","ardoise","argent","arlequin","armature","armement","armoire","armure","arpenter","arracher","arriver","arroser","arsenic","arte\u0301riel","article","aspect","asphalte","aspirer","assaut","asservir","assiette","associer","assurer","asticot","astre","astuce","atelier","atome","atrium","atroce","attaque","attentif","attirer","attraper","aubaine","auberge","audace","audible","augurer","aurore","automne","autruche","avaler","avancer","avarice","avenir","averse","aveugle","aviateur","avide","avion","aviser","avoine","avouer","avril","axial","axiome","badge","bafouer","bagage","baguette","baignade","balancer","balcon","baleine","balisage","bambin","bancaire","bandage","banlieue","bannie\u0300re","banquier","barbier","baril","baron","barque","barrage","bassin","bastion","bataille","bateau","batterie","baudrier","bavarder","belette","be\u0301lier","belote","be\u0301ne\u0301fice","berceau","berger","berline","bermuda","besace","besogne","be\u0301tail","beurre","biberon","bicycle","bidule","bijou","bilan","bilingue","billard","binaire","biologie","biopsie","biotype","biscuit","bison","bistouri","bitume","bizarre","blafard","blague","blanchir","blessant","blinder","blond","bloquer","blouson","bobard","bobine","boire","boiser","bolide","bonbon","bondir","bonheur","bonifier","bonus","bordure","borne","botte","boucle","boueux","bougie","boulon","bouquin","bourse","boussole","boutique","boxeur","branche","brasier","brave","brebis","bre\u0300che","breuvage","bricoler","brigade","brillant","brioche","brique","brochure","broder","bronzer","brousse","broyeur","brume","brusque","brutal","bruyant","buffle","buisson","bulletin","bureau","burin","bustier","butiner","butoir","buvable","buvette","cabanon","cabine","cachette","cadeau","cadre","cafe\u0301ine","caillou","caisson","calculer","calepin","calibre","calmer","calomnie","calvaire","camarade","came\u0301ra","camion","campagne","canal","caneton","canon","cantine","canular","capable","caporal","caprice","capsule","capter","capuche","carabine","carbone","caresser","caribou","carnage","carotte","carreau","carton","cascade","casier","casque","cassure","causer","caution","cavalier","caverne","caviar","ce\u0301dille","ceinture","ce\u0301leste","cellule","cendrier","censurer","central","cercle","ce\u0301re\u0301bral","cerise","cerner","cerveau","cesser","chagrin","chaise","chaleur","chambre","chance","chapitre","charbon","chasseur","chaton","chausson","chavirer","chemise","chenille","che\u0301quier","chercher","cheval","chien","chiffre","chignon","chime\u0300re","chiot","chlorure","chocolat","choisir","chose","chouette","chrome","chute","cigare","cigogne","cimenter","cine\u0301ma","cintrer","circuler","cirer","cirque","citerne","citoyen","citron","civil","clairon","clameur","claquer","classe","clavier","client","cligner","climat","clivage","cloche","clonage","cloporte","cobalt","cobra","cocasse","cocotier","coder","codifier","coffre","cogner","cohe\u0301sion","coiffer","coincer","cole\u0300re","colibri","colline","colmater","colonel","combat","come\u0301die","commande","compact","concert","conduire","confier","congeler","connoter","consonne","contact","convexe","copain","copie","corail","corbeau","cordage","corniche","corpus","correct","corte\u0300ge","cosmique","costume","coton","coude","coupure","courage","couteau","couvrir","coyote","crabe","crainte","cravate","crayon","cre\u0301ature","cre\u0301diter","cre\u0301meux","creuser","crevette","cribler","crier","cristal","crite\u0300re","croire","croquer","crotale","crucial","cruel","crypter","cubique","cueillir","cuille\u0300re","cuisine","cuivre","culminer","cultiver","cumuler","cupide","curatif","curseur","cyanure","cycle","cylindre","cynique","daigner","damier","danger","danseur","dauphin","de\u0301battre","de\u0301biter","de\u0301border","de\u0301brider","de\u0301butant","de\u0301caler","de\u0301cembre","de\u0301chirer","de\u0301cider","de\u0301clarer","de\u0301corer","de\u0301crire","de\u0301cupler","de\u0301dale","de\u0301ductif","de\u0301esse","de\u0301fensif","de\u0301filer","de\u0301frayer","de\u0301gager","de\u0301givrer","de\u0301glutir","de\u0301grafer","de\u0301jeuner","de\u0301lice","de\u0301loger","demander","demeurer","de\u0301molir","de\u0301nicher","de\u0301nouer","dentelle","de\u0301nuder","de\u0301part","de\u0301penser","de\u0301phaser","de\u0301placer","de\u0301poser","de\u0301ranger","de\u0301rober","de\u0301sastre","descente","de\u0301sert","de\u0301signer","de\u0301sobe\u0301ir","dessiner","destrier","de\u0301tacher","de\u0301tester","de\u0301tourer","de\u0301tresse","devancer","devenir","deviner","devoir","diable","dialogue","diamant","dicter","diffe\u0301rer","dige\u0301rer","digital","digne","diluer","dimanche","diminuer","dioxyde","directif","diriger","discuter","disposer","dissiper","distance","divertir","diviser","docile","docteur","dogme","doigt","domaine","domicile","dompter","donateur","donjon","donner","dopamine","dortoir","dorure","dosage","doseur","dossier","dotation","douanier","double","douceur","douter","doyen","dragon","draper","dresser","dribbler","droiture","duperie","duplexe","durable","durcir","dynastie","e\u0301blouir","e\u0301carter","e\u0301charpe","e\u0301chelle","e\u0301clairer","e\u0301clipse","e\u0301clore","e\u0301cluse","e\u0301cole","e\u0301conomie","e\u0301corce","e\u0301couter","e\u0301craser","e\u0301cre\u0301mer","e\u0301crivain","e\u0301crou","e\u0301cume","e\u0301cureuil","e\u0301difier","e\u0301duquer","effacer","effectif","effigie","effort","effrayer","effusion","e\u0301galiser","e\u0301garer","e\u0301jecter","e\u0301laborer","e\u0301largir","e\u0301lectron","e\u0301le\u0301gant","e\u0301le\u0301phant","e\u0301le\u0300ve","e\u0301ligible","e\u0301litisme","e\u0301loge","e\u0301lucider","e\u0301luder","emballer","embellir","embryon","e\u0301meraude","e\u0301mission","emmener","e\u0301motion","e\u0301mouvoir","empereur","employer","emporter","emprise","e\u0301mulsion","encadrer","enche\u0300re","enclave","encoche","endiguer","endosser","endroit","enduire","e\u0301nergie","enfance","enfermer","enfouir","engager","engin","englober","e\u0301nigme","enjamber","enjeu","enlever","ennemi","ennuyeux","enrichir","enrobage","enseigne","entasser","entendre","entier","entourer","entraver","e\u0301nume\u0301rer","envahir","enviable","envoyer","enzyme","e\u0301olien","e\u0301paissir","e\u0301pargne","e\u0301patant","e\u0301paule","e\u0301picerie","e\u0301pide\u0301mie","e\u0301pier","e\u0301pilogue","e\u0301pine","e\u0301pisode","e\u0301pitaphe","e\u0301poque","e\u0301preuve","e\u0301prouver","e\u0301puisant","e\u0301querre","e\u0301quipe","e\u0301riger","e\u0301rosion","erreur","e\u0301ruption","escalier","espadon","espe\u0300ce","espie\u0300gle","espoir","esprit","esquiver","essayer","essence","essieu","essorer","estime","estomac","estrade","e\u0301tage\u0300re","e\u0301taler","e\u0301tanche","e\u0301tatique","e\u0301teindre","e\u0301tendoir","e\u0301ternel","e\u0301thanol","e\u0301thique","ethnie","e\u0301tirer","e\u0301toffer","e\u0301toile","e\u0301tonnant","e\u0301tourdir","e\u0301trange","e\u0301troit","e\u0301tude","euphorie","e\u0301valuer","e\u0301vasion","e\u0301ventail","e\u0301vidence","e\u0301viter","e\u0301volutif","e\u0301voquer","exact","exage\u0301rer","exaucer","exceller","excitant","exclusif","excuse","exe\u0301cuter","exemple","exercer","exhaler","exhorter","exigence","exiler","exister","exotique","expe\u0301dier","explorer","exposer","exprimer","exquis","extensif","extraire","exulter","fable","fabuleux","facette","facile","facture","faiblir","falaise","fameux","famille","farceur","farfelu","farine","farouche","fasciner","fatal","fatigue","faucon","fautif","faveur","favori","fe\u0301brile","fe\u0301conder","fe\u0301de\u0301rer","fe\u0301lin","femme","fe\u0301mur","fendoir","fe\u0301odal","fermer","fe\u0301roce","ferveur","festival","feuille","feutre","fe\u0301vrier","fiasco","ficeler","fictif","fide\u0300le","figure","filature","filetage","filie\u0300re","filleul","filmer","filou","filtrer","financer","finir","fiole","firme","fissure","fixer","flairer","flamme","flasque","flatteur","fle\u0301au","fle\u0300che","fleur","flexion","flocon","flore","fluctuer","fluide","fluvial","folie","fonderie","fongible","fontaine","forcer","forgeron","formuler","fortune","fossile","foudre","fouge\u0300re","fouiller","foulure","fourmi","fragile","fraise","franchir","frapper","frayeur","fre\u0301gate","freiner","frelon","fre\u0301mir","fre\u0301ne\u0301sie","fre\u0300re","friable","friction","frisson","frivole","froid","fromage","frontal","frotter","fruit","fugitif","fuite","fureur","furieux","furtif","fusion","futur","gagner","galaxie","galerie","gambader","garantir","gardien","garnir","garrigue","gazelle","gazon","ge\u0301ant","ge\u0301latine","ge\u0301lule","gendarme","ge\u0301ne\u0301ral","ge\u0301nie","genou","gentil","ge\u0301ologie","ge\u0301ome\u0300tre","ge\u0301ranium","germe","gestuel","geyser","gibier","gicler","girafe","givre","glace","glaive","glisser","globe","gloire","glorieux","golfeur","gomme","gonfler","gorge","gorille","goudron","gouffre","goulot","goupille","gourmand","goutte","graduel","graffiti","graine","grand","grappin","gratuit","gravir","grenat","griffure","griller","grimper","grogner","gronder","grotte","groupe","gruger","grutier","gruye\u0300re","gue\u0301pard","guerrier","guide","guimauve","guitare","gustatif","gymnaste","gyrostat","habitude","hachoir","halte","hameau","hangar","hanneton","haricot","harmonie","harpon","hasard","he\u0301lium","he\u0301matome","herbe","he\u0301risson","hermine","he\u0301ron","he\u0301siter","heureux","hiberner","hibou","hilarant","histoire","hiver","homard","hommage","homoge\u0300ne","honneur","honorer","honteux","horde","horizon","horloge","hormone","horrible","houleux","housse","hublot","huileux","humain","humble","humide","humour","hurler","hydromel","hygie\u0300ne","hymne","hypnose","idylle","ignorer","iguane","illicite","illusion","image","imbiber","imiter","immense","immobile","immuable","impact","impe\u0301rial","implorer","imposer","imprimer","imputer","incarner","incendie","incident","incliner","incolore","indexer","indice","inductif","ine\u0301dit","ineptie","inexact","infini","infliger","informer","infusion","inge\u0301rer","inhaler","inhiber","injecter","injure","innocent","inoculer","inonder","inscrire","insecte","insigne","insolite","inspirer","instinct","insulter","intact","intense","intime","intrigue","intuitif","inutile","invasion","inventer","inviter","invoquer","ironique","irradier","irre\u0301el","irriter","isoler","ivoire","ivresse","jaguar","jaillir","jambe","janvier","jardin","jauger","jaune","javelot","jetable","jeton","jeudi","jeunesse","joindre","joncher","jongler","joueur","jouissif","journal","jovial","joyau","joyeux","jubiler","jugement","junior","jupon","juriste","justice","juteux","juve\u0301nile","kayak","kimono","kiosque","label","labial","labourer","lace\u0301rer","lactose","lagune","laine","laisser","laitier","lambeau","lamelle","lampe","lanceur","langage","lanterne","lapin","largeur","larme","laurier","lavabo","lavoir","lecture","le\u0301gal","le\u0301ger","le\u0301gume","lessive","lettre","levier","lexique","le\u0301zard","liasse","libe\u0301rer","libre","licence","licorne","lie\u0300ge","lie\u0300vre","ligature","ligoter","ligue","limer","limite","limonade","limpide","line\u0301aire","lingot","lionceau","liquide","lisie\u0300re","lister","lithium","litige","littoral","livreur","logique","lointain","loisir","lombric","loterie","louer","lourd","loutre","louve","loyal","lubie","lucide","lucratif","lueur","lugubre","luisant","lumie\u0300re","lunaire","lundi","luron","lutter","luxueux","machine","magasin","magenta","magique","maigre","maillon","maintien","mairie","maison","majorer","malaxer","male\u0301fice","malheur","malice","mallette","mammouth","mandater","maniable","manquant","manteau","manuel","marathon","marbre","marchand","mardi","maritime","marqueur","marron","marteler","mascotte","massif","mate\u0301riel","matie\u0300re","matraque","maudire","maussade","mauve","maximal","me\u0301chant","me\u0301connu","me\u0301daille","me\u0301decin","me\u0301diter","me\u0301duse","meilleur","me\u0301lange","me\u0301lodie","membre","me\u0301moire","menacer","mener","menhir","mensonge","mentor","mercredi","me\u0301rite","merle","messager","mesure","me\u0301tal","me\u0301te\u0301ore","me\u0301thode","me\u0301tier","meuble","miauler","microbe","miette","mignon","migrer","milieu","million","mimique","mince","mine\u0301ral","minimal","minorer","minute","miracle","miroiter","missile","mixte","mobile","moderne","moelleux","mondial","moniteur","monnaie","monotone","monstre","montagne","monument","moqueur","morceau","morsure","mortier","moteur","motif","mouche","moufle","moulin","mousson","mouton","mouvant","multiple","munition","muraille","mure\u0300ne","murmure","muscle","muse\u0301um","musicien","mutation","muter","mutuel","myriade","myrtille","myste\u0300re","mythique","nageur","nappe","narquois","narrer","natation","nation","nature","naufrage","nautique","navire","ne\u0301buleux","nectar","ne\u0301faste","ne\u0301gation","ne\u0301gliger","ne\u0301gocier","neige","nerveux","nettoyer","neurone","neutron","neveu","niche","nickel","nitrate","niveau","noble","nocif","nocturne","noirceur","noisette","nomade","nombreux","nommer","normatif","notable","notifier","notoire","nourrir","nouveau","novateur","novembre","novice","nuage","nuancer","nuire","nuisible","nume\u0301ro","nuptial","nuque","nutritif","obe\u0301ir","objectif","obliger","obscur","observer","obstacle","obtenir","obturer","occasion","occuper","oce\u0301an","octobre","octroyer","octupler","oculaire","odeur","odorant","offenser","officier","offrir","ogive","oiseau","oisillon","olfactif","olivier","ombrage","omettre","onctueux","onduler","one\u0301reux","onirique","opale","opaque","ope\u0301rer","opinion","opportun","opprimer","opter","optique","orageux","orange","orbite","ordonner","oreille","organe","orgueil","orifice","ornement","orque","ortie","osciller","osmose","ossature","otarie","ouragan","ourson","outil","outrager","ouvrage","ovation","oxyde","oxyge\u0300ne","ozone","paisible","palace","palmare\u0300s","palourde","palper","panache","panda","pangolin","paniquer","panneau","panorama","pantalon","papaye","papier","papoter","papyrus","paradoxe","parcelle","paresse","parfumer","parler","parole","parrain","parsemer","partager","parure","parvenir","passion","paste\u0300que","paternel","patience","patron","pavillon","pavoiser","payer","paysage","peigne","peintre","pelage","pe\u0301lican","pelle","pelouse","peluche","pendule","pe\u0301ne\u0301trer","pe\u0301nible","pensif","pe\u0301nurie","pe\u0301pite","pe\u0301plum","perdrix","perforer","pe\u0301riode","permuter","perplexe","persil","perte","peser","pe\u0301tale","petit","pe\u0301trir","peuple","pharaon","phobie","phoque","photon","phrase","physique","piano","pictural","pie\u0300ce","pierre","pieuvre","pilote","pinceau","pipette","piquer","pirogue","piscine","piston","pivoter","pixel","pizza","placard","plafond","plaisir","planer","plaque","plastron","plateau","pleurer","plexus","pliage","plomb","plonger","pluie","plumage","pochette","poe\u0301sie","poe\u0300te","pointe","poirier","poisson","poivre","polaire","policier","pollen","polygone","pommade","pompier","ponctuel","ponde\u0301rer","poney","portique","position","posse\u0301der","posture","potager","poteau","potion","pouce","poulain","poumon","pourpre","poussin","pouvoir","prairie","pratique","pre\u0301cieux","pre\u0301dire","pre\u0301fixe","pre\u0301lude","pre\u0301nom","pre\u0301sence","pre\u0301texte","pre\u0301voir","primitif","prince","prison","priver","proble\u0300me","proce\u0301der","prodige","profond","progre\u0300s","proie","projeter","prologue","promener","propre","prospe\u0300re","prote\u0301ger","prouesse","proverbe","prudence","pruneau","psychose","public","puceron","puiser","pulpe","pulsar","punaise","punitif","pupitre","purifier","puzzle","pyramide","quasar","querelle","question","quie\u0301tude","quitter","quotient","racine","raconter","radieux","ragondin","raideur","raisin","ralentir","rallonge","ramasser","rapide","rasage","ratisser","ravager","ravin","rayonner","re\u0301actif","re\u0301agir","re\u0301aliser","re\u0301animer","recevoir","re\u0301citer","re\u0301clamer","re\u0301colter","recruter","reculer","recycler","re\u0301diger","redouter","refaire","re\u0301flexe","re\u0301former","refrain","refuge","re\u0301galien","re\u0301gion","re\u0301glage","re\u0301gulier","re\u0301ite\u0301rer","rejeter","rejouer","relatif","relever","relief","remarque","reme\u0300de","remise","remonter","remplir","remuer","renard","renfort","renifler","renoncer","rentrer","renvoi","replier","reporter","reprise","reptile","requin","re\u0301serve","re\u0301sineux","re\u0301soudre","respect","rester","re\u0301sultat","re\u0301tablir","retenir","re\u0301ticule","retomber","retracer","re\u0301union","re\u0301ussir","revanche","revivre","re\u0301volte","re\u0301vulsif","richesse","rideau","rieur","rigide","rigoler","rincer","riposter","risible","risque","rituel","rival","rivie\u0300re","rocheux","romance","rompre","ronce","rondin","roseau","rosier","rotatif","rotor","rotule","rouge","rouille","rouleau","routine","royaume","ruban","rubis","ruche","ruelle","rugueux","ruiner","ruisseau","ruser","rustique","rythme","sabler","saboter","sabre","sacoche","safari","sagesse","saisir","salade","salive","salon","saluer","samedi","sanction","sanglier","sarcasme","sardine","saturer","saugrenu","saumon","sauter","sauvage","savant","savonner","scalpel","scandale","sce\u0301le\u0301rat","sce\u0301nario","sceptre","sche\u0301ma","science","scinder","score","scrutin","sculpter","se\u0301ance","se\u0301cable","se\u0301cher","secouer","se\u0301cre\u0301ter","se\u0301datif","se\u0301duire","seigneur","se\u0301jour","se\u0301lectif","semaine","sembler","semence","se\u0301minal","se\u0301nateur","sensible","sentence","se\u0301parer","se\u0301quence","serein","sergent","se\u0301rieux","serrure","se\u0301rum","service","se\u0301same","se\u0301vir","sevrage","sextuple","side\u0301ral","sie\u0300cle","sie\u0301ger","siffler","sigle","signal","silence","silicium","simple","since\u0300re","sinistre","siphon","sirop","sismique","situer","skier","social","socle","sodium","soigneux","soldat","soleil","solitude","soluble","sombre","sommeil","somnoler","sonde","songeur","sonnette","sonore","sorcier","sortir","sosie","sottise","soucieux","soudure","souffle","soulever","soupape","source","soutirer","souvenir","spacieux","spatial","spe\u0301cial","sphe\u0300re","spiral","stable","station","sternum","stimulus","stipuler","strict","studieux","stupeur","styliste","sublime","substrat","subtil","subvenir","succe\u0300s","sucre","suffixe","sugge\u0301rer","suiveur","sulfate","superbe","supplier","surface","suricate","surmener","surprise","sursaut","survie","suspect","syllabe","symbole","syme\u0301trie","synapse","syntaxe","syste\u0300me","tabac","tablier","tactile","tailler","talent","talisman","talonner","tambour","tamiser","tangible","tapis","taquiner","tarder","tarif","tartine","tasse","tatami","tatouage","taupe","taureau","taxer","te\u0301moin","temporel","tenaille","tendre","teneur","tenir","tension","terminer","terne","terrible","te\u0301tine","texte","the\u0300me","the\u0301orie","the\u0301rapie","thorax","tibia","tie\u0300de","timide","tirelire","tiroir","tissu","titane","titre","tituber","toboggan","tole\u0301rant","tomate","tonique","tonneau","toponyme","torche","tordre","tornade","torpille","torrent","torse","tortue","totem","toucher","tournage","tousser","toxine","traction","trafic","tragique","trahir","train","trancher","travail","tre\u0300fle","tremper","tre\u0301sor","treuil","triage","tribunal","tricoter","trilogie","triomphe","tripler","triturer","trivial","trombone","tronc","tropical","troupeau","tuile","tulipe","tumulte","tunnel","turbine","tuteur","tutoyer","tuyau","tympan","typhon","typique","tyran","ubuesque","ultime","ultrason","unanime","unifier","union","unique","unitaire","univers","uranium","urbain","urticant","usage","usine","usuel","usure","utile","utopie","vacarme","vaccin","vagabond","vague","vaillant","vaincre","vaisseau","valable","valise","vallon","valve","vampire","vanille","vapeur","varier","vaseux","vassal","vaste","vecteur","vedette","ve\u0301ge\u0301tal","ve\u0301hicule","veinard","ve\u0301loce","vendredi","ve\u0301ne\u0301rer","venger","venimeux","ventouse","verdure","ve\u0301rin","vernir","verrou","verser","vertu","veston","ve\u0301te\u0301ran","ve\u0301tuste","vexant","vexer","viaduc","viande","victoire","vidange","vide\u0301o","vignette","vigueur","vilain","village","vinaigre","violon","vipe\u0300re","virement","virtuose","virus","visage","viseur","vision","visqueux","visuel","vital","vitesse","viticole","vitrine","vivace","vivipare","vocation","voguer","voile","voisin","voiture","volaille","volcan","voltiger","volume","vorace","vortex","voter","vouloir","voyage","voyelle","wagon","xe\u0301non","yacht","ze\u0300bre","ze\u0301nith","zeste","zoologie"]'), Gd = JSON.parse('["abaco","abbaglio","abbinato","abete","abisso","abolire","abrasivo","abrogato","accadere","accenno","accusato","acetone","achille","acido","acqua","acre","acrilico","acrobata","acuto","adagio","addebito","addome","adeguato","aderire","adipe","adottare","adulare","affabile","affetto","affisso","affranto","aforisma","afoso","africano","agave","agente","agevole","aggancio","agire","agitare","agonismo","agricolo","agrumeto","aguzzo","alabarda","alato","albatro","alberato","albo","albume","alce","alcolico","alettone","alfa","algebra","aliante","alibi","alimento","allagato","allegro","allievo","allodola","allusivo","almeno","alogeno","alpaca","alpestre","altalena","alterno","alticcio","altrove","alunno","alveolo","alzare","amalgama","amanita","amarena","ambito","ambrato","ameba","america","ametista","amico","ammasso","ammenda","ammirare","ammonito","amore","ampio","ampliare","amuleto","anacardo","anagrafe","analista","anarchia","anatra","anca","ancella","ancora","andare","andrea","anello","angelo","angolare","angusto","anima","annegare","annidato","anno","annuncio","anonimo","anticipo","anzi","apatico","apertura","apode","apparire","appetito","appoggio","approdo","appunto","aprile","arabica","arachide","aragosta","araldica","arancio","aratura","arazzo","arbitro","archivio","ardito","arenile","argento","argine","arguto","aria","armonia","arnese","arredato","arringa","arrosto","arsenico","arso","artefice","arzillo","asciutto","ascolto","asepsi","asettico","asfalto","asino","asola","aspirato","aspro","assaggio","asse","assoluto","assurdo","asta","astenuto","astice","astratto","atavico","ateismo","atomico","atono","attesa","attivare","attorno","attrito","attuale","ausilio","austria","autista","autonomo","autunno","avanzato","avere","avvenire","avviso","avvolgere","azione","azoto","azzimo","azzurro","babele","baccano","bacino","baco","badessa","badilata","bagnato","baita","balcone","baldo","balena","ballata","balzano","bambino","bandire","baraonda","barbaro","barca","baritono","barlume","barocco","basilico","basso","batosta","battuto","baule","bava","bavosa","becco","beffa","belgio","belva","benda","benevole","benigno","benzina","bere","berlina","beta","bibita","bici","bidone","bifido","biga","bilancia","bimbo","binocolo","biologo","bipede","bipolare","birbante","birra","biscotto","bisesto","bisnonno","bisonte","bisturi","bizzarro","blando","blatta","bollito","bonifico","bordo","bosco","botanico","bottino","bozzolo","braccio","bradipo","brama","branca","bravura","bretella","brevetto","brezza","briglia","brillante","brindare","broccolo","brodo","bronzina","brullo","bruno","bubbone","buca","budino","buffone","buio","bulbo","buono","burlone","burrasca","bussola","busta","cadetto","caduco","calamaro","calcolo","calesse","calibro","calmo","caloria","cambusa","camerata","camicia","cammino","camola","campale","canapa","candela","cane","canino","canotto","cantina","capace","capello","capitolo","capogiro","cappero","capra","capsula","carapace","carcassa","cardo","carisma","carovana","carretto","cartolina","casaccio","cascata","caserma","caso","cassone","castello","casuale","catasta","catena","catrame","cauto","cavillo","cedibile","cedrata","cefalo","celebre","cellulare","cena","cenone","centesimo","ceramica","cercare","certo","cerume","cervello","cesoia","cespo","ceto","chela","chiaro","chicca","chiedere","chimera","china","chirurgo","chitarra","ciao","ciclismo","cifrare","cigno","cilindro","ciottolo","circa","cirrosi","citrico","cittadino","ciuffo","civetta","civile","classico","clinica","cloro","cocco","codardo","codice","coerente","cognome","collare","colmato","colore","colposo","coltivato","colza","coma","cometa","commando","comodo","computer","comune","conciso","condurre","conferma","congelare","coniuge","connesso","conoscere","consumo","continuo","convegno","coperto","copione","coppia","copricapo","corazza","cordata","coricato","cornice","corolla","corpo","corredo","corsia","cortese","cosmico","costante","cottura","covato","cratere","cravatta","creato","credere","cremoso","crescita","creta","criceto","crinale","crisi","critico","croce","cronaca","crostata","cruciale","crusca","cucire","cuculo","cugino","cullato","cupola","curatore","cursore","curvo","cuscino","custode","dado","daino","dalmata","damerino","daniela","dannoso","danzare","datato","davanti","davvero","debutto","decennio","deciso","declino","decollo","decreto","dedicato","definito","deforme","degno","delegare","delfino","delirio","delta","demenza","denotato","dentro","deposito","derapata","derivare","deroga","descritto","deserto","desiderio","desumere","detersivo","devoto","diametro","dicembre","diedro","difeso","diffuso","digerire","digitale","diluvio","dinamico","dinnanzi","dipinto","diploma","dipolo","diradare","dire","dirotto","dirupo","disagio","discreto","disfare","disgelo","disposto","distanza","disumano","dito","divano","divelto","dividere","divorato","doblone","docente","doganale","dogma","dolce","domato","domenica","dominare","dondolo","dono","dormire","dote","dottore","dovuto","dozzina","drago","druido","dubbio","dubitare","ducale","duna","duomo","duplice","duraturo","ebano","eccesso","ecco","eclissi","economia","edera","edicola","edile","editoria","educare","egemonia","egli","egoismo","egregio","elaborato","elargire","elegante","elencato","eletto","elevare","elfico","elica","elmo","elsa","eluso","emanato","emblema","emesso","emiro","emotivo","emozione","empirico","emulo","endemico","enduro","energia","enfasi","enoteca","entrare","enzima","epatite","epilogo","episodio","epocale","eppure","equatore","erario","erba","erboso","erede","eremita","erigere","ermetico","eroe","erosivo","errante","esagono","esame","esanime","esaudire","esca","esempio","esercito","esibito","esigente","esistere","esito","esofago","esortato","esoso","espanso","espresso","essenza","esso","esteso","estimare","estonia","estroso","esultare","etilico","etnico","etrusco","etto","euclideo","europa","evaso","evidenza","evitato","evoluto","evviva","fabbrica","faccenda","fachiro","falco","famiglia","fanale","fanfara","fango","fantasma","fare","farfalla","farinoso","farmaco","fascia","fastoso","fasullo","faticare","fato","favoloso","febbre","fecola","fede","fegato","felpa","feltro","femmina","fendere","fenomeno","fermento","ferro","fertile","fessura","festivo","fetta","feudo","fiaba","fiducia","fifa","figurato","filo","finanza","finestra","finire","fiore","fiscale","fisico","fiume","flacone","flamenco","flebo","flemma","florido","fluente","fluoro","fobico","focaccia","focoso","foderato","foglio","folata","folclore","folgore","fondente","fonetico","fonia","fontana","forbito","forchetta","foresta","formica","fornaio","foro","fortezza","forzare","fosfato","fosso","fracasso","frana","frassino","fratello","freccetta","frenata","fresco","frigo","frollino","fronde","frugale","frutta","fucilata","fucsia","fuggente","fulmine","fulvo","fumante","fumetto","fumoso","fune","funzione","fuoco","furbo","furgone","furore","fuso","futile","gabbiano","gaffe","galateo","gallina","galoppo","gambero","gamma","garanzia","garbo","garofano","garzone","gasdotto","gasolio","gastrico","gatto","gaudio","gazebo","gazzella","geco","gelatina","gelso","gemello","gemmato","gene","genitore","gennaio","genotipo","gergo","ghepardo","ghiaccio","ghisa","giallo","gilda","ginepro","giocare","gioiello","giorno","giove","girato","girone","gittata","giudizio","giurato","giusto","globulo","glutine","gnomo","gobba","golf","gomito","gommone","gonfio","gonna","governo","gracile","grado","grafico","grammo","grande","grattare","gravoso","grazia","greca","gregge","grifone","grigio","grinza","grotta","gruppo","guadagno","guaio","guanto","guardare","gufo","guidare","ibernato","icona","identico","idillio","idolo","idra","idrico","idrogeno","igiene","ignaro","ignorato","ilare","illeso","illogico","illudere","imballo","imbevuto","imbocco","imbuto","immane","immerso","immolato","impacco","impeto","impiego","importo","impronta","inalare","inarcare","inattivo","incanto","incendio","inchino","incisivo","incluso","incontro","incrocio","incubo","indagine","india","indole","inedito","infatti","infilare","inflitto","ingaggio","ingegno","inglese","ingordo","ingrosso","innesco","inodore","inoltrare","inondato","insano","insetto","insieme","insonnia","insulina","intasato","intero","intonaco","intuito","inumidire","invalido","invece","invito","iperbole","ipnotico","ipotesi","ippica","iride","irlanda","ironico","irrigato","irrorare","isolato","isotopo","isterico","istituto","istrice","italia","iterare","labbro","labirinto","lacca","lacerato","lacrima","lacuna","laddove","lago","lampo","lancetta","lanterna","lardoso","larga","laringe","lastra","latenza","latino","lattuga","lavagna","lavoro","legale","leggero","lembo","lentezza","lenza","leone","lepre","lesivo","lessato","lesto","letterale","leva","levigato","libero","lido","lievito","lilla","limatura","limitare","limpido","lineare","lingua","liquido","lira","lirica","lisca","lite","litigio","livrea","locanda","lode","logica","lombare","londra","longevo","loquace","lorenzo","loto","lotteria","luce","lucidato","lumaca","luminoso","lungo","lupo","luppolo","lusinga","lusso","lutto","macabro","macchina","macero","macinato","madama","magico","maglia","magnete","magro","maiolica","malafede","malgrado","malinteso","malsano","malto","malumore","mana","mancia","mandorla","mangiare","manifesto","mannaro","manovra","mansarda","mantide","manubrio","mappa","maratona","marcire","maretta","marmo","marsupio","maschera","massaia","mastino","materasso","matricola","mattone","maturo","mazurca","meandro","meccanico","mecenate","medesimo","meditare","mega","melassa","melis","melodia","meninge","meno","mensola","mercurio","merenda","merlo","meschino","mese","messere","mestolo","metallo","metodo","mettere","miagolare","mica","micelio","michele","microbo","midollo","miele","migliore","milano","milite","mimosa","minerale","mini","minore","mirino","mirtillo","miscela","missiva","misto","misurare","mitezza","mitigare","mitra","mittente","mnemonico","modello","modifica","modulo","mogano","mogio","mole","molosso","monastero","monco","mondina","monetario","monile","monotono","monsone","montato","monviso","mora","mordere","morsicato","mostro","motivato","motosega","motto","movenza","movimento","mozzo","mucca","mucosa","muffa","mughetto","mugnaio","mulatto","mulinello","multiplo","mummia","munto","muovere","murale","musa","muscolo","musica","mutevole","muto","nababbo","nafta","nanometro","narciso","narice","narrato","nascere","nastrare","naturale","nautica","naviglio","nebulosa","necrosi","negativo","negozio","nemmeno","neofita","neretto","nervo","nessuno","nettuno","neutrale","neve","nevrotico","nicchia","ninfa","nitido","nobile","nocivo","nodo","nome","nomina","nordico","normale","norvegese","nostrano","notare","notizia","notturno","novella","nucleo","nulla","numero","nuovo","nutrire","nuvola","nuziale","oasi","obbedire","obbligo","obelisco","oblio","obolo","obsoleto","occasione","occhio","occidente","occorrere","occultare","ocra","oculato","odierno","odorare","offerta","offrire","offuscato","oggetto","oggi","ognuno","olandese","olfatto","oliato","oliva","ologramma","oltre","omaggio","ombelico","ombra","omega","omissione","ondoso","onere","onice","onnivoro","onorevole","onta","operato","opinione","opposto","oracolo","orafo","ordine","orecchino","orefice","orfano","organico","origine","orizzonte","orma","ormeggio","ornativo","orologio","orrendo","orribile","ortensia","ortica","orzata","orzo","osare","oscurare","osmosi","ospedale","ospite","ossa","ossidare","ostacolo","oste","otite","otre","ottagono","ottimo","ottobre","ovale","ovest","ovino","oviparo","ovocito","ovunque","ovviare","ozio","pacchetto","pace","pacifico","padella","padrone","paese","paga","pagina","palazzina","palesare","pallido","palo","palude","pandoro","pannello","paolo","paonazzo","paprica","parabola","parcella","parere","pargolo","pari","parlato","parola","partire","parvenza","parziale","passivo","pasticca","patacca","patologia","pattume","pavone","peccato","pedalare","pedonale","peggio","peloso","penare","pendice","penisola","pennuto","penombra","pensare","pentola","pepe","pepita","perbene","percorso","perdonato","perforare","pergamena","periodo","permesso","perno","perplesso","persuaso","pertugio","pervaso","pesatore","pesista","peso","pestifero","petalo","pettine","petulante","pezzo","piacere","pianta","piattino","piccino","picozza","piega","pietra","piffero","pigiama","pigolio","pigro","pila","pilifero","pillola","pilota","pimpante","pineta","pinna","pinolo","pioggia","piombo","piramide","piretico","pirite","pirolisi","pitone","pizzico","placebo","planare","plasma","platano","plenario","pochezza","poderoso","podismo","poesia","poggiare","polenta","poligono","pollice","polmonite","polpetta","polso","poltrona","polvere","pomice","pomodoro","ponte","popoloso","porfido","poroso","porpora","porre","portata","posa","positivo","possesso","postulato","potassio","potere","pranzo","prassi","pratica","precluso","predica","prefisso","pregiato","prelievo","premere","prenotare","preparato","presenza","pretesto","prevalso","prima","principe","privato","problema","procura","produrre","profumo","progetto","prolunga","promessa","pronome","proposta","proroga","proteso","prova","prudente","prugna","prurito","psiche","pubblico","pudica","pugilato","pugno","pulce","pulito","pulsante","puntare","pupazzo","pupilla","puro","quadro","qualcosa","quasi","querela","quota","raccolto","raddoppio","radicale","radunato","raffica","ragazzo","ragione","ragno","ramarro","ramingo","ramo","randagio","rantolare","rapato","rapina","rappreso","rasatura","raschiato","rasente","rassegna","rastrello","rata","ravveduto","reale","recepire","recinto","recluta","recondito","recupero","reddito","redimere","regalato","registro","regola","regresso","relazione","remare","remoto","renna","replica","reprimere","reputare","resa","residente","responso","restauro","rete","retina","retorica","rettifica","revocato","riassunto","ribadire","ribelle","ribrezzo","ricarica","ricco","ricevere","riciclato","ricordo","ricreduto","ridicolo","ridurre","rifasare","riflesso","riforma","rifugio","rigare","rigettato","righello","rilassato","rilevato","rimanere","rimbalzo","rimedio","rimorchio","rinascita","rincaro","rinforzo","rinnovo","rinomato","rinsavito","rintocco","rinuncia","rinvenire","riparato","ripetuto","ripieno","riportare","ripresa","ripulire","risata","rischio","riserva","risibile","riso","rispetto","ristoro","risultato","risvolto","ritardo","ritegno","ritmico","ritrovo","riunione","riva","riverso","rivincita","rivolto","rizoma","roba","robotico","robusto","roccia","roco","rodaggio","rodere","roditore","rogito","rollio","romantico","rompere","ronzio","rosolare","rospo","rotante","rotondo","rotula","rovescio","rubizzo","rubrica","ruga","rullino","rumine","rumoroso","ruolo","rupe","russare","rustico","sabato","sabbiare","sabotato","sagoma","salasso","saldatura","salgemma","salivare","salmone","salone","saltare","saluto","salvo","sapere","sapido","saporito","saraceno","sarcasmo","sarto","sassoso","satellite","satira","satollo","saturno","savana","savio","saziato","sbadiglio","sbalzo","sbancato","sbarra","sbattere","sbavare","sbendare","sbirciare","sbloccato","sbocciato","sbrinare","sbruffone","sbuffare","scabroso","scadenza","scala","scambiare","scandalo","scapola","scarso","scatenare","scavato","scelto","scenico","scettro","scheda","schiena","sciarpa","scienza","scindere","scippo","sciroppo","scivolo","sclerare","scodella","scolpito","scomparto","sconforto","scoprire","scorta","scossone","scozzese","scriba","scrollare","scrutinio","scuderia","scultore","scuola","scuro","scusare","sdebitare","sdoganare","seccatura","secondo","sedano","seggiola","segnalato","segregato","seguito","selciato","selettivo","sella","selvaggio","semaforo","sembrare","seme","seminato","sempre","senso","sentire","sepolto","sequenza","serata","serbato","sereno","serio","serpente","serraglio","servire","sestina","setola","settimana","sfacelo","sfaldare","sfamato","sfarzoso","sfaticato","sfera","sfida","sfilato","sfinge","sfocato","sfoderare","sfogo","sfoltire","sforzato","sfratto","sfruttato","sfuggito","sfumare","sfuso","sgabello","sgarbato","sgonfiare","sgorbio","sgrassato","sguardo","sibilo","siccome","sierra","sigla","signore","silenzio","sillaba","simbolo","simpatico","simulato","sinfonia","singolo","sinistro","sino","sintesi","sinusoide","sipario","sisma","sistole","situato","slitta","slogatura","sloveno","smarrito","smemorato","smentito","smeraldo","smilzo","smontare","smottato","smussato","snellire","snervato","snodo","sobbalzo","sobrio","soccorso","sociale","sodale","soffitto","sogno","soldato","solenne","solido","sollazzo","solo","solubile","solvente","somatico","somma","sonda","sonetto","sonnifero","sopire","soppeso","sopra","sorgere","sorpasso","sorriso","sorso","sorteggio","sorvolato","sospiro","sosta","sottile","spada","spalla","spargere","spatola","spavento","spazzola","specie","spedire","spegnere","spelatura","speranza","spessore","spettrale","spezzato","spia","spigoloso","spillato","spinoso","spirale","splendido","sportivo","sposo","spranga","sprecare","spronato","spruzzo","spuntino","squillo","sradicare","srotolato","stabile","stacco","staffa","stagnare","stampato","stantio","starnuto","stasera","statuto","stelo","steppa","sterzo","stiletto","stima","stirpe","stivale","stizzoso","stonato","storico","strappo","stregato","stridulo","strozzare","strutto","stuccare","stufo","stupendo","subentro","succoso","sudore","suggerito","sugo","sultano","suonare","superbo","supporto","surgelato","surrogato","sussurro","sutura","svagare","svedese","sveglio","svelare","svenuto","svezia","sviluppo","svista","svizzera","svolta","svuotare","tabacco","tabulato","tacciare","taciturno","tale","talismano","tampone","tannino","tara","tardivo","targato","tariffa","tarpare","tartaruga","tasto","tattico","taverna","tavolata","tazza","teca","tecnico","telefono","temerario","tempo","temuto","tendone","tenero","tensione","tentacolo","teorema","terme","terrazzo","terzetto","tesi","tesserato","testato","tetro","tettoia","tifare","tigella","timbro","tinto","tipico","tipografo","tiraggio","tiro","titanio","titolo","titubante","tizio","tizzone","toccare","tollerare","tolto","tombola","tomo","tonfo","tonsilla","topazio","topologia","toppa","torba","tornare","torrone","tortora","toscano","tossire","tostatura","totano","trabocco","trachea","trafila","tragedia","tralcio","tramonto","transito","trapano","trarre","trasloco","trattato","trave","treccia","tremolio","trespolo","tributo","tricheco","trifoglio","trillo","trincea","trio","tristezza","triturato","trivella","tromba","trono","troppo","trottola","trovare","truccato","tubatura","tuffato","tulipano","tumulto","tunisia","turbare","turchino","tuta","tutela","ubicato","uccello","uccisore","udire","uditivo","uffa","ufficio","uguale","ulisse","ultimato","umano","umile","umorismo","uncinetto","ungere","ungherese","unicorno","unificato","unisono","unitario","unte","uovo","upupa","uragano","urgenza","urlo","usanza","usato","uscito","usignolo","usuraio","utensile","utilizzo","utopia","vacante","vaccinato","vagabondo","vagliato","valanga","valgo","valico","valletta","valoroso","valutare","valvola","vampata","vangare","vanitoso","vano","vantaggio","vanvera","vapore","varano","varcato","variante","vasca","vedetta","vedova","veduto","vegetale","veicolo","velcro","velina","velluto","veloce","venato","vendemmia","vento","verace","verbale","vergogna","verifica","vero","verruca","verticale","vescica","vessillo","vestale","veterano","vetrina","vetusto","viandante","vibrante","vicenda","vichingo","vicinanza","vidimare","vigilia","vigneto","vigore","vile","villano","vimini","vincitore","viola","vipera","virgola","virologo","virulento","viscoso","visione","vispo","vissuto","visura","vita","vitello","vittima","vivanda","vivido","viziare","voce","voga","volatile","volere","volpe","voragine","vulcano","zampogna","zanna","zappato","zattera","zavorra","zefiro","zelante","zelo","zenzero","zerbino","zibetto","zinco","zircone","zitto","zolla","zotico","zucchero","zufolo","zulu","zuppa"]'), Wd = JSON.parse('["a\u0301baco","abdomen","abeja","abierto","abogado","abono","aborto","abrazo","abrir","abuelo","abuso","acabar","academia","acceso","accio\u0301n","aceite","acelga","acento","aceptar","a\u0301cido","aclarar","acne\u0301","acoger","acoso","activo","acto","actriz","actuar","acudir","acuerdo","acusar","adicto","admitir","adoptar","adorno","aduana","adulto","ae\u0301reo","afectar","aficio\u0301n","afinar","afirmar","a\u0301gil","agitar","agoni\u0301a","agosto","agotar","agregar","agrio","agua","agudo","a\u0301guila","aguja","ahogo","ahorro","aire","aislar","ajedrez","ajeno","ajuste","alacra\u0301n","alambre","alarma","alba","a\u0301lbum","alcalde","aldea","alegre","alejar","alerta","aleta","alfiler","alga","algodo\u0301n","aliado","aliento","alivio","alma","almeja","almi\u0301bar","altar","alteza","altivo","alto","altura","alumno","alzar","amable","amante","amapola","amargo","amasar","a\u0301mbar","a\u0301mbito","ameno","amigo","amistad","amor","amparo","amplio","ancho","anciano","ancla","andar","ande\u0301n","anemia","a\u0301ngulo","anillo","a\u0301nimo","ani\u0301s","anotar","antena","antiguo","antojo","anual","anular","anuncio","an\u0303adir","an\u0303ejo","an\u0303o","apagar","aparato","apetito","apio","aplicar","apodo","aporte","apoyo","aprender","aprobar","apuesta","apuro","arado","aran\u0303a","arar","a\u0301rbitro","a\u0301rbol","arbusto","archivo","arco","arder","ardilla","arduo","a\u0301rea","a\u0301rido","aries","armoni\u0301a","arne\u0301s","aroma","arpa","arpo\u0301n","arreglo","arroz","arruga","arte","artista","asa","asado","asalto","ascenso","asegurar","aseo","asesor","asiento","asilo","asistir","asno","asombro","a\u0301spero","astilla","astro","astuto","asumir","asunto","atajo","ataque","atar","atento","ateo","a\u0301tico","atleta","a\u0301tomo","atraer","atroz","atu\u0301n","audaz","audio","auge","aula","aumento","ausente","autor","aval","avance","avaro","ave","avellana","avena","avestruz","avio\u0301n","aviso","ayer","ayuda","ayuno","azafra\u0301n","azar","azote","azu\u0301car","azufre","azul","baba","babor","bache","bahi\u0301a","baile","bajar","balanza","balco\u0301n","balde","bambu\u0301","banco","banda","ban\u0303o","barba","barco","barniz","barro","ba\u0301scula","basto\u0301n","basura","batalla","bateri\u0301a","batir","batuta","bau\u0301l","bazar","bebe\u0301","bebida","bello","besar","beso","bestia","bicho","bien","bingo","blanco","bloque","blusa","boa","bobina","bobo","boca","bocina","boda","bodega","boina","bola","bolero","bolsa","bomba","bondad","bonito","bono","bonsa\u0301i","borde","borrar","bosque","bote","boti\u0301n","bo\u0301veda","bozal","bravo","brazo","brecha","breve","brillo","brinco","brisa","broca","broma","bronce","brote","bruja","brusco","bruto","buceo","bucle","bueno","buey","bufanda","bufo\u0301n","bu\u0301ho","buitre","bulto","burbuja","burla","burro","buscar","butaca","buzo\u0301n","caballo","cabeza","cabina","cabra","cacao","cada\u0301ver","cadena","caer","cafe\u0301","cai\u0301da","caima\u0301n","caja","cajo\u0301n","cal","calamar","calcio","caldo","calidad","calle","calma","calor","calvo","cama","cambio","camello","camino","campo","ca\u0301ncer","candil","canela","canguro","canica","canto","can\u0303a","can\u0303o\u0301n","caoba","caos","capaz","capita\u0301n","capote","captar","capucha","cara","carbo\u0301n","ca\u0301rcel","careta","carga","carin\u0303o","carne","carpeta","carro","carta","casa","casco","casero","caspa","castor","catorce","catre","caudal","causa","cazo","cebolla","ceder","cedro","celda","ce\u0301lebre","celoso","ce\u0301lula","cemento","ceniza","centro","cerca","cerdo","cereza","cero","cerrar","certeza","ce\u0301sped","cetro","chacal","chaleco","champu\u0301","chancla","chapa","charla","chico","chiste","chivo","choque","choza","chuleta","chupar","ciclo\u0301n","ciego","cielo","cien","cierto","cifra","cigarro","cima","cinco","cine","cinta","cipre\u0301s","circo","ciruela","cisne","cita","ciudad","clamor","clan","claro","clase","clave","cliente","clima","cli\u0301nica","cobre","coccio\u0301n","cochino","cocina","coco","co\u0301digo","codo","cofre","coger","cohete","coji\u0301n","cojo","cola","colcha","colegio","colgar","colina","collar","colmo","columna","combate","comer","comida","co\u0301modo","compra","conde","conejo","conga","conocer","consejo","contar","copa","copia","corazo\u0301n","corbata","corcho","cordo\u0301n","corona","correr","coser","cosmos","costa","cra\u0301neo","cra\u0301ter","crear","crecer","crei\u0301do","crema","cri\u0301a","crimen","cripta","crisis","cromo","cro\u0301nica","croqueta","crudo","cruz","cuadro","cuarto","cuatro","cubo","cubrir","cuchara","cuello","cuento","cuerda","cuesta","cueva","cuidar","culebra","culpa","culto","cumbre","cumplir","cuna","cuneta","cuota","cupo\u0301n","cu\u0301pula","curar","curioso","curso","curva","cutis","dama","danza","dar","dardo","da\u0301til","deber","de\u0301bil","de\u0301cada","decir","dedo","defensa","definir","dejar","delfi\u0301n","delgado","delito","demora","denso","dental","deporte","derecho","derrota","desayuno","deseo","desfile","desnudo","destino","desvi\u0301o","detalle","detener","deuda","di\u0301a","diablo","diadema","diamante","diana","diario","dibujo","dictar","diente","dieta","diez","difi\u0301cil","digno","dilema","diluir","dinero","directo","dirigir","disco","disen\u0303o","disfraz","diva","divino","doble","doce","dolor","domingo","don","donar","dorado","dormir","dorso","dos","dosis","drago\u0301n","droga","ducha","duda","duelo","duen\u0303o","dulce","du\u0301o","duque","durar","dureza","duro","e\u0301bano","ebrio","echar","eco","ecuador","edad","edicio\u0301n","edificio","editor","educar","efecto","eficaz","eje","ejemplo","elefante","elegir","elemento","elevar","elipse","e\u0301lite","elixir","elogio","eludir","embudo","emitir","emocio\u0301n","empate","empen\u0303o","empleo","empresa","enano","encargo","enchufe","enci\u0301a","enemigo","enero","enfado","enfermo","engan\u0303o","enigma","enlace","enorme","enredo","ensayo","ensen\u0303ar","entero","entrar","envase","envi\u0301o","e\u0301poca","equipo","erizo","escala","escena","escolar","escribir","escudo","esencia","esfera","esfuerzo","espada","espejo","espi\u0301a","esposa","espuma","esqui\u0301","estar","este","estilo","estufa","etapa","eterno","e\u0301tica","etnia","evadir","evaluar","evento","evitar","exacto","examen","exceso","excusa","exento","exigir","exilio","existir","e\u0301xito","experto","explicar","exponer","extremo","fa\u0301brica","fa\u0301bula","fachada","fa\u0301cil","factor","faena","faja","falda","fallo","falso","faltar","fama","familia","famoso","farao\u0301n","farmacia","farol","farsa","fase","fatiga","fauna","favor","fax","febrero","fecha","feliz","feo","feria","feroz","fe\u0301rtil","fervor","festi\u0301n","fiable","fianza","fiar","fibra","ficcio\u0301n","ficha","fideo","fiebre","fiel","fiera","fiesta","figura","fijar","fijo","fila","filete","filial","filtro","fin","finca","fingir","finito","firma","flaco","flauta","flecha","flor","flota","fluir","flujo","flu\u0301or","fobia","foca","fogata","fogo\u0301n","folio","folleto","fondo","forma","forro","fortuna","forzar","fosa","foto","fracaso","fra\u0301gil","franja","frase","fraude","frei\u0301r","freno","fresa","fri\u0301o","frito","fruta","fuego","fuente","fuerza","fuga","fumar","funcio\u0301n","funda","furgo\u0301n","furia","fusil","fu\u0301tbol","futuro","gacela","gafas","gaita","gajo","gala","galeri\u0301a","gallo","gamba","ganar","gancho","ganga","ganso","garaje","garza","gasolina","gastar","gato","gavila\u0301n","gemelo","gemir","gen","ge\u0301nero","genio","gente","geranio","gerente","germen","gesto","gigante","gimnasio","girar","giro","glaciar","globo","gloria","gol","golfo","goloso","golpe","goma","gordo","gorila","gorra","gota","goteo","gozar","grada","gra\u0301fico","grano","grasa","gratis","grave","grieta","grillo","gripe","gris","grito","grosor","gru\u0301a","grueso","grumo","grupo","guante","guapo","guardia","guerra","gui\u0301a","guin\u0303o","guion","guiso","guitarra","gusano","gustar","haber","ha\u0301bil","hablar","hacer","hacha","hada","hallar","hamaca","harina","haz","hazan\u0303a","hebilla","hebra","hecho","helado","helio","hembra","herir","hermano","he\u0301roe","hervir","hielo","hierro","hi\u0301gado","higiene","hijo","himno","historia","hocico","hogar","hoguera","hoja","hombre","hongo","honor","honra","hora","hormiga","horno","hostil","hoyo","hueco","huelga","huerta","hueso","huevo","huida","huir","humano","hu\u0301medo","humilde","humo","hundir","huraca\u0301n","hurto","icono","ideal","idioma","i\u0301dolo","iglesia","iglu\u0301","igual","ilegal","ilusio\u0301n","imagen","ima\u0301n","imitar","impar","imperio","imponer","impulso","incapaz","i\u0301ndice","inerte","infiel","informe","ingenio","inicio","inmenso","inmune","innato","insecto","instante","intere\u0301s","i\u0301ntimo","intuir","inu\u0301til","invierno","ira","iris","ironi\u0301a","isla","islote","jabali\u0301","jabo\u0301n","jamo\u0301n","jarabe","jardi\u0301n","jarra","jaula","jazmi\u0301n","jefe","jeringa","jinete","jornada","joroba","joven","joya","juerga","jueves","juez","jugador","jugo","juguete","juicio","junco","jungla","junio","juntar","ju\u0301piter","jurar","justo","juvenil","juzgar","kilo","koala","labio","lacio","lacra","lado","ladro\u0301n","lagarto","la\u0301grima","laguna","laico","lamer","la\u0301mina","la\u0301mpara","lana","lancha","langosta","lanza","la\u0301piz","largo","larva","la\u0301stima","lata","la\u0301tex","latir","laurel","lavar","lazo","leal","leccio\u0301n","leche","lector","leer","legio\u0301n","legumbre","lejano","lengua","lento","len\u0303a","leo\u0301n","leopardo","lesio\u0301n","letal","letra","leve","leyenda","libertad","libro","licor","li\u0301der","lidiar","lienzo","liga","ligero","lima","li\u0301mite","limo\u0301n","limpio","lince","lindo","li\u0301nea","lingote","lino","linterna","li\u0301quido","liso","lista","litera","litio","litro","llaga","llama","llanto","llave","llegar","llenar","llevar","llorar","llover","lluvia","lobo","locio\u0301n","loco","locura","lo\u0301gica","logro","lombriz","lomo","lonja","lote","lucha","lucir","lugar","lujo","luna","lunes","lupa","lustro","luto","luz","maceta","macho","madera","madre","maduro","maestro","mafia","magia","mago","mai\u0301z","maldad","maleta","malla","malo","mama\u0301","mambo","mamut","manco","mando","manejar","manga","maniqui\u0301","manjar","mano","manso","manta","man\u0303ana","mapa","ma\u0301quina","mar","marco","marea","marfil","margen","marido","ma\u0301rmol","marro\u0301n","martes","marzo","masa","ma\u0301scara","masivo","matar","materia","matiz","matriz","ma\u0301ximo","mayor","mazorca","mecha","medalla","medio","me\u0301dula","mejilla","mejor","melena","melo\u0301n","memoria","menor","mensaje","mente","menu\u0301","mercado","merengue","me\u0301rito","mes","meso\u0301n","meta","meter","me\u0301todo","metro","mezcla","miedo","miel","miembro","miga","mil","milagro","militar","millo\u0301n","mimo","mina","minero","mi\u0301nimo","minuto","miope","mirar","misa","miseria","misil","mismo","mitad","mito","mochila","mocio\u0301n","moda","modelo","moho","mojar","molde","moler","molino","momento","momia","monarca","moneda","monja","monto","mon\u0303o","morada","morder","moreno","morir","morro","morsa","mortal","mosca","mostrar","motivo","mover","mo\u0301vil","mozo","mucho","mudar","mueble","muela","muerte","muestra","mugre","mujer","mula","muleta","multa","mundo","mun\u0303eca","mural","muro","mu\u0301sculo","museo","musgo","mu\u0301sica","muslo","na\u0301car","nacio\u0301n","nadar","naipe","naranja","nariz","narrar","nasal","natal","nativo","natural","na\u0301usea","naval","nave","navidad","necio","ne\u0301ctar","negar","negocio","negro","neo\u0301n","nervio","neto","neutro","nevar","nevera","nicho","nido","niebla","nieto","nin\u0303ez","nin\u0303o","ni\u0301tido","nivel","nobleza","noche","no\u0301mina","noria","norma","norte","nota","noticia","novato","novela","novio","nube","nuca","nu\u0301cleo","nudillo","nudo","nuera","nueve","nuez","nulo","nu\u0301mero","nutria","oasis","obeso","obispo","objeto","obra","obrero","observar","obtener","obvio","oca","ocaso","oce\u0301ano","ochenta","ocho","ocio","ocre","octavo","octubre","oculto","ocupar","ocurrir","odiar","odio","odisea","oeste","ofensa","oferta","oficio","ofrecer","ogro","oi\u0301do","oi\u0301r","ojo","ola","oleada","olfato","olivo","olla","olmo","olor","olvido","ombligo","onda","onza","opaco","opcio\u0301n","o\u0301pera","opinar","oponer","optar","o\u0301ptica","opuesto","oracio\u0301n","orador","oral","o\u0301rbita","orca","orden","oreja","o\u0301rgano","orgi\u0301a","orgullo","oriente","origen","orilla","oro","orquesta","oruga","osadi\u0301a","oscuro","osezno","oso","ostra","oton\u0303o","otro","oveja","o\u0301vulo","o\u0301xido","oxi\u0301geno","oyente","ozono","pacto","padre","paella","pa\u0301gina","pago","pai\u0301s","pa\u0301jaro","palabra","palco","paleta","pa\u0301lido","palma","paloma","palpar","pan","panal","pa\u0301nico","pantera","pan\u0303uelo","papa\u0301","papel","papilla","paquete","parar","parcela","pared","parir","paro","pa\u0301rpado","parque","pa\u0301rrafo","parte","pasar","paseo","pasio\u0301n","paso","pasta","pata","patio","patria","pausa","pauta","pavo","payaso","peato\u0301n","pecado","pecera","pecho","pedal","pedir","pegar","peine","pelar","peldan\u0303o","pelea","peligro","pellejo","pelo","peluca","pena","pensar","pen\u0303o\u0301n","peo\u0301n","peor","pepino","pequen\u0303o","pera","percha","perder","pereza","perfil","perico","perla","permiso","perro","persona","pesa","pesca","pe\u0301simo","pestan\u0303a","pe\u0301talo","petro\u0301leo","pez","pezun\u0303a","picar","picho\u0301n","pie","piedra","pierna","pieza","pijama","pilar","piloto","pimienta","pino","pintor","pinza","pin\u0303a","piojo","pipa","pirata","pisar","piscina","piso","pista","pito\u0301n","pizca","placa","plan","plata","playa","plaza","pleito","pleno","plomo","pluma","plural","pobre","poco","poder","podio","poema","poesi\u0301a","poeta","polen","polici\u0301a","pollo","polvo","pomada","pomelo","pomo","pompa","poner","porcio\u0301n","portal","posada","poseer","posible","poste","potencia","potro","pozo","prado","precoz","pregunta","premio","prensa","preso","previo","primo","pri\u0301ncipe","prisio\u0301n","privar","proa","probar","proceso","producto","proeza","profesor","programa","prole","promesa","pronto","propio","pro\u0301ximo","prueba","pu\u0301blico","puchero","pudor","pueblo","puerta","puesto","pulga","pulir","pulmo\u0301n","pulpo","pulso","puma","punto","pun\u0303al","pun\u0303o","pupa","pupila","pure\u0301","quedar","queja","quemar","querer","queso","quieto","qui\u0301mica","quince","quitar","ra\u0301bano","rabia","rabo","racio\u0301n","radical","rai\u0301z","rama","rampa","rancho","rango","rapaz","ra\u0301pido","rapto","rasgo","raspa","rato","rayo","raza","razo\u0301n","reaccio\u0301n","realidad","reban\u0303o","rebote","recaer","receta","rechazo","recoger","recreo","recto","recurso","red","redondo","reducir","reflejo","reforma","refra\u0301n","refugio","regalo","regir","regla","regreso","rehe\u0301n","reino","rei\u0301r","reja","relato","relevo","relieve","relleno","reloj","remar","remedio","remo","rencor","rendir","renta","reparto","repetir","reposo","reptil","res","rescate","resina","respeto","resto","resumen","retiro","retorno","retrato","reunir","reve\u0301s","revista","rey","rezar","rico","riego","rienda","riesgo","rifa","ri\u0301gido","rigor","rinco\u0301n","rin\u0303o\u0301n","ri\u0301o","riqueza","risa","ritmo","rito","rizo","roble","roce","rociar","rodar","rodeo","rodilla","roer","rojizo","rojo","romero","romper","ron","ronco","ronda","ropa","ropero","rosa","rosca","rostro","rotar","rubi\u0301","rubor","rudo","rueda","rugir","ruido","ruina","ruleta","rulo","rumbo","rumor","ruptura","ruta","rutina","sa\u0301bado","saber","sabio","sable","sacar","sagaz","sagrado","sala","saldo","salero","salir","salmo\u0301n","salo\u0301n","salsa","salto","salud","salvar","samba","sancio\u0301n","sandi\u0301a","sanear","sangre","sanidad","sano","santo","sapo","saque","sardina","sarte\u0301n","sastre","sata\u0301n","sauna","saxofo\u0301n","seccio\u0301n","seco","secreto","secta","sed","seguir","seis","sello","selva","semana","semilla","senda","sensor","sen\u0303al","sen\u0303or","separar","sepia","sequi\u0301a","ser","serie","sermo\u0301n","servir","sesenta","sesio\u0301n","seta","setenta","severo","sexo","sexto","sidra","siesta","siete","siglo","signo","si\u0301laba","silbar","silencio","silla","si\u0301mbolo","simio","sirena","sistema","sitio","situar","sobre","socio","sodio","sol","solapa","soldado","soledad","so\u0301lido","soltar","solucio\u0301n","sombra","sondeo","sonido","sonoro","sonrisa","sopa","soplar","soporte","sordo","sorpresa","sorteo","soste\u0301n","so\u0301tano","suave","subir","suceso","sudor","suegra","suelo","suen\u0303o","suerte","sufrir","sujeto","sulta\u0301n","sumar","superar","suplir","suponer","supremo","sur","surco","suren\u0303o","surgir","susto","sutil","tabaco","tabique","tabla","tabu\u0301","taco","tacto","tajo","talar","talco","talento","talla","talo\u0301n","taman\u0303o","tambor","tango","tanque","tapa","tapete","tapia","tapo\u0301n","taquilla","tarde","tarea","tarifa","tarjeta","tarot","tarro","tarta","tatuaje","tauro","taza","tazo\u0301n","teatro","techo","tecla","te\u0301cnica","tejado","tejer","tejido","tela","tele\u0301fono","tema","temor","templo","tenaz","tender","tener","tenis","tenso","teori\u0301a","terapia","terco","te\u0301rmino","ternura","terror","tesis","tesoro","testigo","tetera","texto","tez","tibio","tiburo\u0301n","tiempo","tienda","tierra","tieso","tigre","tijera","tilde","timbre","ti\u0301mido","timo","tinta","ti\u0301o","ti\u0301pico","tipo","tira","tiro\u0301n","tita\u0301n","ti\u0301tere","ti\u0301tulo","tiza","toalla","tobillo","tocar","tocino","todo","toga","toldo","tomar","tono","tonto","topar","tope","toque","to\u0301rax","torero","tormenta","torneo","toro","torpedo","torre","torso","tortuga","tos","tosco","toser","to\u0301xico","trabajo","tractor","traer","tra\u0301fico","trago","traje","tramo","trance","trato","trauma","trazar","tre\u0301bol","tregua","treinta","tren","trepar","tres","tribu","trigo","tripa","triste","triunfo","trofeo","trompa","tronco","tropa","trote","trozo","truco","trueno","trufa","tuberi\u0301a","tubo","tuerto","tumba","tumor","tu\u0301nel","tu\u0301nica","turbina","turismo","turno","tutor","ubicar","u\u0301lcera","umbral","unidad","unir","universo","uno","untar","un\u0303a","urbano","urbe","urgente","urna","usar","usuario","u\u0301til","utopi\u0301a","uva","vaca","vaci\u0301o","vacuna","vagar","vago","vaina","vajilla","vale","va\u0301lido","valle","valor","va\u0301lvula","vampiro","vara","variar","varo\u0301n","vaso","vecino","vector","vehi\u0301culo","veinte","vejez","vela","velero","veloz","vena","vencer","venda","veneno","vengar","venir","venta","venus","ver","verano","verbo","verde","vereda","verja","verso","verter","vi\u0301a","viaje","vibrar","vicio","vi\u0301ctima","vida","vi\u0301deo","vidrio","viejo","viernes","vigor","vil","villa","vinagre","vino","vin\u0303edo","violi\u0301n","viral","virgo","virtud","visor","vi\u0301spera","vista","vitamina","viudo","vivaz","vivero","vivir","vivo","volca\u0301n","volumen","volver","voraz","votar","voto","voz","vuelo","vulgar","yacer","yate","yegua","yema","yerno","yeso","yodo","yoga","yogur","zafiro","zanja","zapato","zarza","zona","zorro","zumo","zurdo"]'), Xd = JSON.parse('["\u3042\u3044\u3053\u304F\u3057\u3093","\u3042\u3044\u3055\u3064","\u3042\u3044\u305F\u3099","\u3042\u304A\u305D\u3099\u3089","\u3042\u304B\u3061\u3083\u3093","\u3042\u304D\u308B","\u3042\u3051\u304B\u3099\u305F","\u3042\u3051\u308B","\u3042\u3053\u304B\u3099\u308C\u308B","\u3042\u3055\u3044","\u3042\u3055\u3072","\u3042\u3057\u3042\u3068","\u3042\u3057\u3099\u308F\u3046","\u3042\u3059\u3099\u304B\u308B","\u3042\u3059\u3099\u304D","\u3042\u305D\u3075\u3099","\u3042\u305F\u3048\u308B","\u3042\u305F\u305F\u3081\u308B","\u3042\u305F\u308A\u307E\u3048","\u3042\u305F\u308B","\u3042\u3064\u3044","\u3042\u3064\u304B\u3046","\u3042\u3063\u3057\u3085\u304F","\u3042\u3064\u307E\u308A","\u3042\u3064\u3081\u308B","\u3042\u3066\u306A","\u3042\u3066\u306F\u307E\u308B","\u3042\u3072\u308B","\u3042\u3075\u3099\u3089","\u3042\u3075\u3099\u308B","\u3042\u3075\u308C\u308B","\u3042\u307E\u3044","\u3042\u307E\u3068\u3099","\u3042\u307E\u3084\u304B\u3059","\u3042\u307E\u308A","\u3042\u307F\u3082\u306E","\u3042\u3081\u308A\u304B","\u3042\u3084\u307E\u308B","\u3042\u3086\u3080","\u3042\u3089\u3044\u304F\u3099\u307E","\u3042\u3089\u3057","\u3042\u3089\u3059\u3057\u3099","\u3042\u3089\u305F\u3081\u308B","\u3042\u3089\u3086\u308B","\u3042\u3089\u308F\u3059","\u3042\u308A\u304B\u3099\u3068\u3046","\u3042\u308F\u305B\u308B","\u3042\u308F\u3066\u308B","\u3042\u3093\u3044","\u3042\u3093\u304B\u3099\u3044","\u3042\u3093\u3053","\u3042\u3093\u305B\u3099\u3093","\u3042\u3093\u3066\u3044","\u3042\u3093\u306A\u3044","\u3042\u3093\u307E\u308A","\u3044\u3044\u305F\u3099\u3059","\u3044\u304A\u3093","\u3044\u304B\u3099\u3044","\u3044\u304B\u3099\u304F","\u3044\u304D\u304A\u3044","\u3044\u304D\u306A\u308A","\u3044\u304D\u3082\u306E","\u3044\u304D\u308B","\u3044\u304F\u3057\u3099","\u3044\u304F\u3075\u3099\u3093","\u3044\u3051\u306F\u3099\u306A","\u3044\u3051\u3093","\u3044\u3053\u3046","\u3044\u3053\u304F","\u3044\u3053\u3064","\u3044\u3055\u307E\u3057\u3044","\u3044\u3055\u3093","\u3044\u3057\u304D","\u3044\u3057\u3099\u3085\u3046","\u3044\u3057\u3099\u3087\u3046","\u3044\u3057\u3099\u308F\u308B","\u3044\u3059\u3099\u307F","\u3044\u3059\u3099\u308C","\u3044\u305B\u3044","\u3044\u305B\u3048\u3072\u3099","\u3044\u305B\u304B\u3044","\u3044\u305B\u304D","\u3044\u305B\u3099\u3093","\u3044\u305D\u3046\u308D\u3046","\u3044\u305D\u304B\u3099\u3057\u3044","\u3044\u305F\u3099\u3044","\u3044\u305F\u3099\u304F","\u3044\u305F\u3059\u3099\u3089","\u3044\u305F\u307F","\u3044\u305F\u308A\u3042","\u3044\u3061\u304A\u3046","\u3044\u3061\u3057\u3099","\u3044\u3061\u3068\u3099","\u3044\u3061\u306F\u3099","\u3044\u3061\u3075\u3099","\u3044\u3061\u308A\u3085\u3046","\u3044\u3064\u304B","\u3044\u3063\u3057\u3085\u3093","\u3044\u3063\u305B\u3044","\u3044\u3063\u305D\u3046","\u3044\u3063\u305F\u3093","\u3044\u3063\u3061","\u3044\u3063\u3066\u3044","\u3044\u3063\u307B\u309A\u3046","\u3044\u3066\u3055\u3099","\u3044\u3066\u3093","\u3044\u3068\u3099\u3046","\u3044\u3068\u3053","\u3044\u306A\u3044","\u3044\u306A\u304B","\u3044\u306D\u3080\u308A","\u3044\u306E\u3061","\u3044\u306E\u308B","\u3044\u306F\u3064","\u3044\u306F\u3099\u308B","\u3044\u306F\u3093","\u3044\u3072\u3099\u304D","\u3044\u3072\u3093","\u3044\u3075\u304F","\u3044\u3078\u3093","\u3044\u307B\u3046","\u3044\u307F\u3093","\u3044\u3082\u3046\u3068","\u3044\u3082\u305F\u308C","\u3044\u3082\u308A","\u3044\u3084\u304B\u3099\u308B","\u3044\u3084\u3059","\u3044\u3088\u304B\u3093","\u3044\u3088\u304F","\u3044\u3089\u3044","\u3044\u3089\u3059\u3068","\u3044\u308A\u304F\u3099\u3061","\u3044\u308A\u3087\u3046","\u3044\u308C\u3044","\u3044\u308C\u3082\u306E","\u3044\u308C\u308B","\u3044\u308D\u3048\u3093\u3072\u309A\u3064","\u3044\u308F\u3044","\u3044\u308F\u3046","\u3044\u308F\u304B\u3093","\u3044\u308F\u306F\u3099","\u3044\u308F\u3086\u308B","\u3044\u3093\u3051\u3099\u3093\u307E\u3081","\u3044\u3093\u3055\u3064","\u3044\u3093\u3057\u3087\u3046","\u3044\u3093\u3088\u3046","\u3046\u3048\u304D","\u3046\u3048\u308B","\u3046\u304A\u3055\u3099","\u3046\u304B\u3099\u3044","\u3046\u304B\u3075\u3099","\u3046\u304B\u3078\u3099\u308B","\u3046\u304D\u308F","\u3046\u304F\u3089\u3044\u306A","\u3046\u304F\u308C\u308C","\u3046\u3051\u305F\u307E\u308F\u308B","\u3046\u3051\u3064\u3051","\u3046\u3051\u3068\u308B","\u3046\u3051\u3082\u3064","\u3046\u3051\u308B","\u3046\u3053\u3099\u304B\u3059","\u3046\u3053\u3099\u304F","\u3046\u3053\u3093","\u3046\u3055\u304D\u3099","\u3046\u3057\u306A\u3046","\u3046\u3057\u308D\u304B\u3099\u307F","\u3046\u3059\u3044","\u3046\u3059\u304D\u3099","\u3046\u3059\u304F\u3099\u3089\u3044","\u3046\u3059\u3081\u308B","\u3046\u305B\u3064","\u3046\u3061\u3042\u308F\u305B","\u3046\u3061\u304B\u3099\u308F","\u3046\u3061\u304D","\u3046\u3061\u3085\u3046","\u3046\u3063\u304B\u308A","\u3046\u3064\u304F\u3057\u3044","\u3046\u3063\u305F\u3048\u308B","\u3046\u3064\u308B","\u3046\u3068\u3099\u3093","\u3046\u306A\u304D\u3099","\u3046\u306A\u3057\u3099","\u3046\u306A\u3059\u3099\u304F","\u3046\u306A\u308B","\u3046\u306D\u308B","\u3046\u306E\u3046","\u3046\u3075\u3099\u3051\u3099","\u3046\u3075\u3099\u3053\u3099\u3048","\u3046\u307E\u308C\u308B","\u3046\u3081\u308B","\u3046\u3082\u3046","\u3046\u3084\u307E\u3046","\u3046\u3088\u304F","\u3046\u3089\u304B\u3099\u3048\u3059","\u3046\u3089\u304F\u3099\u3061","\u3046\u3089\u306A\u3044","\u3046\u308A\u3042\u3051\u3099","\u3046\u308A\u304D\u308C","\u3046\u308B\u3055\u3044","\u3046\u308C\u3057\u3044","\u3046\u308C\u3086\u304D","\u3046\u308C\u308B","\u3046\u308D\u3053","\u3046\u308F\u304D","\u3046\u308F\u3055","\u3046\u3093\u3053\u3046","\u3046\u3093\u3061\u3093","\u3046\u3093\u3066\u3093","\u3046\u3093\u3068\u3099\u3046","\u3048\u3044\u3048\u3093","\u3048\u3044\u304B\u3099","\u3048\u3044\u304D\u3087\u3046","\u3048\u3044\u3053\u3099","\u3048\u3044\u305B\u3044","\u3048\u3044\u3075\u3099\u3093","\u3048\u3044\u3088\u3046","\u3048\u3044\u308F","\u3048\u304A\u308A","\u3048\u304B\u3099\u304A","\u3048\u304B\u3099\u304F","\u3048\u304D\u305F\u3044","\u3048\u304F\u305B\u308B","\u3048\u3057\u3083\u304F","\u3048\u3059\u3066","\u3048\u3064\u3089\u3093","\u3048\u306E\u304F\u3099","\u3048\u307B\u3046\u307E\u304D","\u3048\u307B\u3093","\u3048\u307E\u304D","\u3048\u3082\u3057\u3099","\u3048\u3082\u306E","\u3048\u3089\u3044","\u3048\u3089\u3075\u3099","\u3048\u308A\u3042","\u3048\u3093\u3048\u3093","\u3048\u3093\u304B\u3044","\u3048\u3093\u304D\u3099","\u3048\u3093\u3051\u3099\u304D","\u3048\u3093\u3057\u3085\u3046","\u3048\u3093\u305B\u3099\u3064","\u3048\u3093\u305D\u304F","\u3048\u3093\u3061\u3087\u3046","\u3048\u3093\u3068\u3064","\u304A\u3044\u304B\u3051\u308B","\u304A\u3044\u3053\u3059","\u304A\u3044\u3057\u3044","\u304A\u3044\u3064\u304F","\u304A\u3046\u3048\u3093","\u304A\u3046\u3055\u307E","\u304A\u3046\u3057\u3099","\u304A\u3046\u305B\u3064","\u304A\u3046\u305F\u3044","\u304A\u3046\u3075\u304F","\u304A\u3046\u3078\u3099\u3044","\u304A\u3046\u3088\u3046","\u304A\u3048\u308B","\u304A\u304A\u3044","\u304A\u304A\u3046","\u304A\u304A\u3068\u3099\u304A\u308A","\u304A\u304A\u3084","\u304A\u304A\u3088\u305D","\u304A\u304B\u3048\u308A","\u304A\u304B\u3059\u3099","\u304A\u304B\u3099\u3080","\u304A\u304B\u308F\u308A","\u304A\u304D\u3099\u306A\u3046","\u304A\u304D\u308B","\u304A\u304F\u3055\u307E","\u304A\u304F\u3057\u3099\u3087\u3046","\u304A\u304F\u308A\u304B\u3099\u306A","\u304A\u304F\u308B","\u304A\u304F\u308C\u308B","\u304A\u3053\u3059","\u304A\u3053\u306A\u3046","\u304A\u3053\u308B","\u304A\u3055\u3048\u308B","\u304A\u3055\u306A\u3044","\u304A\u3055\u3081\u308B","\u304A\u3057\u3044\u308C","\u304A\u3057\u3048\u308B","\u304A\u3057\u3099\u304D\u3099","\u304A\u3057\u3099\u3055\u3093","\u304A\u3057\u3083\u308C","\u304A\u305D\u3089\u304F","\u304A\u305D\u308F\u308B","\u304A\u305F\u304B\u3099\u3044","\u304A\u305F\u304F","\u304A\u305F\u3099\u3084\u304B","\u304A\u3061\u3064\u304F","\u304A\u3063\u3068","\u304A\u3064\u308A","\u304A\u3066\u3099\u304B\u3051","\u304A\u3068\u3057\u3082\u306E","\u304A\u3068\u306A\u3057\u3044","\u304A\u3068\u3099\u308A","\u304A\u3068\u3099\u308D\u304B\u3059","\u304A\u306F\u3099\u3055\u3093","\u304A\u307E\u3044\u308A","\u304A\u3081\u3066\u3099\u3068\u3046","\u304A\u3082\u3044\u3066\u3099","\u304A\u3082\u3046","\u304A\u3082\u305F\u3044","\u304A\u3082\u3061\u3083","\u304A\u3084\u3064","\u304A\u3084\u3086\u3072\u3099","\u304A\u3088\u307B\u3099\u3059","\u304A\u3089\u3093\u305F\u3099","\u304A\u308D\u3059","\u304A\u3093\u304B\u3099\u304F","\u304A\u3093\u3051\u3044","\u304A\u3093\u3057\u3083","\u304A\u3093\u305B\u3093","\u304A\u3093\u305F\u3099\u3093","\u304A\u3093\u3061\u3085\u3046","\u304A\u3093\u3068\u3099\u3051\u3044","\u304B\u3042\u3064","\u304B\u3044\u304B\u3099","\u304B\u3099\u3044\u304D","\u304B\u3099\u3044\u3051\u3093","\u304B\u3099\u3044\u3053\u3046","\u304B\u3044\u3055\u3064","\u304B\u3044\u3057\u3083","\u304B\u3044\u3059\u3044\u3088\u304F","\u304B\u3044\u305B\u3099\u3093","\u304B\u3044\u305D\u3099\u3046\u3068\u3099","\u304B\u3044\u3064\u3046","\u304B\u3044\u3066\u3093","\u304B\u3044\u3068\u3046","\u304B\u3044\u3075\u304F","\u304B\u3099\u3044\u3078\u304D","\u304B\u3044\u307B\u3046","\u304B\u3044\u3088\u3046","\u304B\u3099\u3044\u3089\u3044","\u304B\u3044\u308F","\u304B\u3048\u308B","\u304B\u304A\u308A","\u304B\u304B\u3048\u308B","\u304B\u304B\u3099\u304F","\u304B\u304B\u3099\u3057","\u304B\u304B\u3099\u307F","\u304B\u304F\u3053\u3099","\u304B\u304F\u3068\u304F","\u304B\u3055\u3099\u308B","\u304B\u3099\u305D\u3099\u3046","\u304B\u305F\u3044","\u304B\u305F\u3061","\u304B\u3099\u3061\u3087\u3046","\u304B\u3099\u3063\u304D\u3085\u3046","\u304B\u3099\u3063\u3053\u3046","\u304B\u3099\u3063\u3055\u3093","\u304B\u3099\u3063\u3057\u3087\u3046","\u304B\u306A\u3055\u3099\u308F\u3057","\u304B\u306E\u3046","\u304B\u3099\u306F\u304F","\u304B\u3075\u3099\u304B","\u304B\u307B\u3046","\u304B\u307B\u3053\u3099","\u304B\u307E\u3046","\u304B\u307E\u307B\u3099\u3053","\u304B\u3081\u308C\u304A\u3093","\u304B\u3086\u3044","\u304B\u3088\u3046\u3072\u3099","\u304B\u3089\u3044","\u304B\u308B\u3044","\u304B\u308D\u3046","\u304B\u308F\u304F","\u304B\u308F\u3089","\u304B\u3099\u3093\u304B","\u304B\u3093\u3051\u3044","\u304B\u3093\u3053\u3046","\u304B\u3093\u3057\u3083","\u304B\u3093\u305D\u3046","\u304B\u3093\u305F\u3093","\u304B\u3093\u3061","\u304B\u3099\u3093\u306F\u3099\u308B","\u304D\u3042\u3044","\u304D\u3042\u3064","\u304D\u3044\u308D","\u304D\u3099\u3044\u3093","\u304D\u3046\u3044","\u304D\u3046\u3093","\u304D\u3048\u308B","\u304D\u304A\u3046","\u304D\u304A\u304F","\u304D\u304A\u3061","\u304D\u304A\u3093","\u304D\u304B\u3044","\u304D\u304B\u304F","\u304D\u304B\u3093\u3057\u3083","\u304D\u304D\u3066","\u304D\u304F\u306F\u3099\u308A","\u304D\u304F\u3089\u3051\u3099","\u304D\u3051\u3093\u305B\u3044","\u304D\u3053\u3046","\u304D\u3053\u3048\u308B","\u304D\u3053\u304F","\u304D\u3055\u3044","\u304D\u3055\u304F","\u304D\u3055\u307E","\u304D\u3055\u3089\u304D\u3099","\u304D\u3099\u3057\u3099\u304B\u304B\u3099\u304F","\u304D\u3099\u3057\u304D","\u304D\u3099\u3057\u3099\u305F\u3044\u3051\u3093","\u304D\u3099\u3057\u3099\u306B\u3063\u3066\u3044","\u304D\u3099\u3057\u3099\u3085\u3064\u3057\u3083","\u304D\u3059\u3046","\u304D\u305B\u3044","\u304D\u305B\u304D","\u304D\u305B\u3064","\u304D\u305D\u3046","\u304D\u305D\u3099\u304F","\u304D\u305D\u3099\u3093","\u304D\u305F\u3048\u308B","\u304D\u3061\u3087\u3046","\u304D\u3064\u3048\u3093","\u304D\u3099\u3063\u3061\u308A","\u304D\u3064\u3064\u304D","\u304D\u3064\u306D","\u304D\u3066\u3044","\u304D\u3068\u3099\u3046","\u304D\u3068\u3099\u304F","\u304D\u306A\u3044","\u304D\u306A\u304B\u3099","\u304D\u306A\u3053","\u304D\u306C\u3053\u3099\u3057","\u304D\u306D\u3093","\u304D\u306E\u3046","\u304D\u306E\u3057\u305F","\u304D\u306F\u304F","\u304D\u3072\u3099\u3057\u3044","\u304D\u3072\u3093","\u304D\u3075\u304F","\u304D\u3075\u3099\u3093","\u304D\u307B\u3099\u3046","\u304D\u307B\u3093","\u304D\u307E\u308B","\u304D\u307F\u3064","\u304D\u3080\u3059\u3099\u304B\u3057\u3044","\u304D\u3081\u308B","\u304D\u3082\u305F\u3099\u3081\u3057","\u304D\u3082\u3061","\u304D\u3082\u306E","\u304D\u3083\u304F","\u304D\u3084\u304F","\u304D\u3099\u3085\u3046\u306B\u304F","\u304D\u3088\u3046","\u304D\u3087\u3046\u308A\u3085\u3046","\u304D\u3089\u3044","\u304D\u3089\u304F","\u304D\u308A\u3093","\u304D\u308C\u3044","\u304D\u308C\u3064","\u304D\u308D\u304F","\u304D\u3099\u308D\u3093","\u304D\u308F\u3081\u308B","\u304D\u3099\u3093\u3044\u308D","\u304D\u3093\u304B\u304F\u3057\u3099","\u304D\u3093\u3057\u3099\u3087","\u304D\u3093\u3088\u3046\u3072\u3099","\u304F\u3099\u3042\u3044","\u304F\u3044\u3059\u3099","\u304F\u3046\u304B\u3093","\u304F\u3046\u304D","\u304F\u3046\u304F\u3099\u3093","\u304F\u3046\u3053\u3046","\u304F\u3099\u3046\u305B\u3044","\u304F\u3046\u305D\u3046","\u304F\u3099\u3046\u305F\u3089","\u304F\u3046\u3075\u304F","\u304F\u3046\u307B\u3099","\u304F\u304B\u3093","\u304F\u304D\u3087\u3046","\u304F\u3051\u3099\u3093","\u304F\u3099\u3053\u3046","\u304F\u3055\u3044","\u304F\u3055\u304D","\u304F\u3055\u306F\u3099\u306A","\u304F\u3055\u308B","\u304F\u3057\u3083\u307F","\u304F\u3057\u3087\u3046","\u304F\u3059\u306E\u304D","\u304F\u3059\u308A\u3086\u3072\u3099","\u304F\u305B\u3051\u3099","\u304F\u305B\u3093","\u304F\u3099\u305F\u3044\u3066\u304D","\u304F\u305F\u3099\u3055\u308B","\u304F\u305F\u3072\u3099\u308C\u308B","\u304F\u3061\u3053\u307F","\u304F\u3061\u3055\u304D","\u304F\u3064\u3057\u305F","\u304F\u3099\u3063\u3059\u308A","\u304F\u3064\u308D\u304F\u3099","\u304F\u3068\u3046\u3066\u3093","\u304F\u3068\u3099\u304F","\u304F\u306A\u3093","\u304F\u306D\u304F\u306D","\u304F\u306E\u3046","\u304F\u3075\u3046","\u304F\u307F\u3042\u308F\u305B","\u304F\u307F\u305F\u3066\u308B","\u304F\u3081\u308B","\u304F\u3084\u304F\u3057\u3087","\u304F\u3089\u3059","\u304F\u3089\u3078\u3099\u308B","\u304F\u308B\u307E","\u304F\u308C\u308B","\u304F\u308D\u3046","\u304F\u308F\u3057\u3044","\u304F\u3099\u3093\u304B\u3093","\u304F\u3099\u3093\u3057\u3087\u304F","\u304F\u3099\u3093\u305F\u3044","\u304F\u3099\u3093\u3066","\u3051\u3042\u306A","\u3051\u3044\u304B\u304F","\u3051\u3044\u3051\u3093","\u3051\u3044\u3053","\u3051\u3044\u3055\u3064","\u3051\u3099\u3044\u3057\u3099\u3085\u3064","\u3051\u3044\u305F\u3044","\u3051\u3099\u3044\u306E\u3046\u3057\u3099\u3093","\u3051\u3044\u308C\u304D","\u3051\u3044\u308D","\u3051\u304A\u3068\u3059","\u3051\u304A\u308A\u3082\u306E","\u3051\u3099\u304D\u304B","\u3051\u3099\u304D\u3051\u3099\u3093","\u3051\u3099\u304D\u305F\u3099\u3093","\u3051\u3099\u304D\u3061\u3093","\u3051\u3099\u304D\u3068\u3064","\u3051\u3099\u304D\u306F","\u3051\u3099\u304D\u3084\u304F","\u3051\u3099\u3053\u3046","\u3051\u3099\u3053\u304F\u3057\u3099\u3087\u3046","\u3051\u3099\u3055\u3099\u3044","\u3051\u3055\u304D","\u3051\u3099\u3055\u3099\u3093","\u3051\u3057\u304D","\u3051\u3057\u3053\u3099\u3080","\u3051\u3057\u3087\u3046","\u3051\u3099\u3059\u3068","\u3051\u305F\u306F\u3099","\u3051\u3061\u3083\u3063\u3075\u309A","\u3051\u3061\u3089\u3059","\u3051\u3064\u3042\u3064","\u3051\u3064\u3044","\u3051\u3064\u3048\u304D","\u3051\u3063\u3053\u3093","\u3051\u3064\u3057\u3099\u3087","\u3051\u3063\u305B\u304D","\u3051\u3063\u3066\u3044","\u3051\u3064\u307E\u3064","\u3051\u3099\u3064\u3088\u3046\u3072\u3099","\u3051\u3099\u3064\u308C\u3044","\u3051\u3064\u308D\u3093","\u3051\u3099\u3068\u3099\u304F","\u3051\u3068\u306F\u3099\u3059","\u3051\u3068\u308B","\u3051\u306A\u3051\u3099","\u3051\u306A\u3059","\u3051\u306A\u307F","\u3051\u306C\u304D","\u3051\u3099\u306D\u3064","\u3051\u306D\u3093","\u3051\u306F\u3044","\u3051\u3099\u3072\u3093","\u3051\u3075\u3099\u304B\u3044","\u3051\u3099\u307B\u3099\u304F","\u3051\u307E\u308A","\u3051\u307F\u304B\u308B","\u3051\u3080\u3057","\u3051\u3080\u308A","\u3051\u3082\u306E","\u3051\u3089\u3044","\u3051\u308D\u3051\u308D","\u3051\u308F\u3057\u3044","\u3051\u3093\u3044","\u3051\u3093\u3048\u3064","\u3051\u3093\u304A","\u3051\u3093\u304B","\u3051\u3099\u3093\u304D","\u3051\u3093\u3051\u3099\u3093","\u3051\u3093\u3053\u3046","\u3051\u3093\u3055\u304F","\u3051\u3093\u3057\u3085\u3046","\u3051\u3093\u3059\u3046","\u3051\u3099\u3093\u305D\u3046","\u3051\u3093\u3061\u304F","\u3051\u3093\u3066\u3044","\u3051\u3093\u3068\u3046","\u3051\u3093\u306A\u3044","\u3051\u3093\u306B\u3093","\u3051\u3099\u3093\u3075\u3099\u3064","\u3051\u3093\u307E","\u3051\u3093\u307F\u3093","\u3051\u3093\u3081\u3044","\u3051\u3093\u3089\u3093","\u3051\u3093\u308A","\u3053\u3042\u304F\u307E","\u3053\u3044\u306C","\u3053\u3044\u3072\u3099\u3068","\u3053\u3099\u3046\u3044","\u3053\u3046\u3048\u3093","\u3053\u3046\u304A\u3093","\u3053\u3046\u304B\u3093","\u3053\u3099\u3046\u304D\u3085\u3046","\u3053\u3099\u3046\u3051\u3044","\u3053\u3046\u3053\u3046","\u3053\u3046\u3055\u3044","\u3053\u3046\u3057\u3099","\u3053\u3046\u3059\u3044","\u3053\u3099\u3046\u305B\u3044","\u3053\u3046\u305D\u304F","\u3053\u3046\u305F\u3044","\u3053\u3046\u3061\u3083","\u3053\u3046\u3064\u3046","\u3053\u3046\u3066\u3044","\u3053\u3046\u3068\u3099\u3046","\u3053\u3046\u306A\u3044","\u3053\u3046\u306F\u3044","\u3053\u3099\u3046\u307B\u3046","\u3053\u3099\u3046\u307E\u3093","\u3053\u3046\u3082\u304F","\u3053\u3046\u308A\u3064","\u3053\u3048\u308B","\u3053\u304A\u308A","\u3053\u3099\u304B\u3044","\u3053\u3099\u304B\u3099\u3064","\u3053\u3099\u304B\u3093","\u3053\u304F\u3053\u3099","\u3053\u304F\u3055\u3044","\u3053\u304F\u3068\u3046","\u3053\u304F\u306A\u3044","\u3053\u304F\u306F\u304F","\u3053\u304F\u3099\u307E","\u3053\u3051\u3044","\u3053\u3051\u308B","\u3053\u3053\u306E\u304B","\u3053\u3053\u308D","\u3053\u3055\u3081","\u3053\u3057\u3064","\u3053\u3059\u3046","\u3053\u305B\u3044","\u3053\u305B\u304D","\u3053\u305B\u3099\u3093","\u3053\u305D\u305F\u3099\u3066","\u3053\u305F\u3044","\u3053\u305F\u3048\u308B","\u3053\u305F\u3064","\u3053\u3061\u3087\u3046","\u3053\u3063\u304B","\u3053\u3064\u3053\u3064","\u3053\u3064\u306F\u3099\u3093","\u3053\u3064\u3075\u3099","\u3053\u3066\u3044","\u3053\u3066\u3093","\u3053\u3068\u304B\u3099\u3089","\u3053\u3068\u3057","\u3053\u3068\u306F\u3099","\u3053\u3068\u308A","\u3053\u306A\u3053\u3099\u306A","\u3053\u306D\u3053\u306D","\u3053\u306E\u307E\u307E","\u3053\u306E\u307F","\u3053\u306E\u3088","\u3053\u3099\u306F\u3093","\u3053\u3072\u3064\u3057\u3099","\u3053\u3075\u3046","\u3053\u3075\u3093","\u3053\u307B\u3099\u308C\u308B","\u3053\u3099\u307E\u3042\u3075\u3099\u3089","\u3053\u307E\u304B\u3044","\u3053\u3099\u307E\u3059\u308A","\u3053\u307E\u3064\u306A","\u3053\u307E\u308B","\u3053\u3080\u304D\u3099\u3053","\u3053\u3082\u3057\u3099","\u3053\u3082\u3061","\u3053\u3082\u306E","\u3053\u3082\u3093","\u3053\u3084\u304F","\u3053\u3084\u307E","\u3053\u3086\u3046","\u3053\u3086\u3072\u3099","\u3053\u3088\u3044","\u3053\u3088\u3046","\u3053\u308A\u308B","\u3053\u308C\u304F\u3057\u3087\u3093","\u3053\u308D\u3063\u3051","\u3053\u308F\u3082\u3066","\u3053\u308F\u308C\u308B","\u3053\u3093\u3044\u3093","\u3053\u3093\u304B\u3044","\u3053\u3093\u304D","\u3053\u3093\u3057\u3085\u3046","\u3053\u3093\u3059\u3044","\u3053\u3093\u305F\u3099\u3066","\u3053\u3093\u3068\u3093","\u3053\u3093\u306A\u3093","\u3053\u3093\u3072\u3099\u306B","\u3053\u3093\u307B\u309A\u3093","\u3053\u3093\u307E\u3051","\u3053\u3093\u3084","\u3053\u3093\u308C\u3044","\u3053\u3093\u308F\u304F","\u3055\u3099\u3044\u3048\u304D","\u3055\u3044\u304B\u3044","\u3055\u3044\u304D\u3093","\u3055\u3099\u3044\u3051\u3099\u3093","\u3055\u3099\u3044\u3053","\u3055\u3044\u3057\u3087","\u3055\u3044\u305B\u3044","\u3055\u3099\u3044\u305F\u304F","\u3055\u3099\u3044\u3061\u3085\u3046","\u3055\u3044\u3066\u304D","\u3055\u3099\u3044\u308A\u3087\u3046","\u3055\u3046\u306A","\u3055\u304B\u3044\u3057","\u3055\u304B\u3099\u3059","\u3055\u304B\u306A","\u3055\u304B\u307F\u3061","\u3055\u304B\u3099\u308B","\u3055\u304D\u3099\u3087\u3046","\u3055\u304F\u3057","\u3055\u304F\u3072\u3093","\u3055\u304F\u3089","\u3055\u3053\u304F","\u3055\u3053\u3064","\u3055\u3059\u3099\u304B\u308B","\u3055\u3099\u305B\u304D","\u3055\u305F\u3093","\u3055\u3064\u3048\u3044","\u3055\u3099\u3064\u304A\u3093","\u3055\u3099\u3063\u304B","\u3055\u3099\u3064\u304B\u3099\u304F","\u3055\u3063\u304D\u3087\u304F","\u3055\u3099\u3063\u3057","\u3055\u3064\u3057\u3099\u3093","\u3055\u3099\u3063\u305D\u3046","\u3055\u3064\u305F\u306F\u3099","\u3055\u3064\u307E\u3044\u3082","\u3055\u3066\u3044","\u3055\u3068\u3044\u3082","\u3055\u3068\u3046","\u3055\u3068\u304A\u3084","\u3055\u3068\u3057","\u3055\u3068\u308B","\u3055\u306E\u3046","\u3055\u306F\u3099\u304F","\u3055\u3072\u3099\u3057\u3044","\u3055\u3078\u3099\u3064","\u3055\u307B\u3046","\u3055\u307B\u3068\u3099","\u3055\u307E\u3059","\u3055\u307F\u3057\u3044","\u3055\u307F\u305F\u3099\u308C","\u3055\u3080\u3051","\u3055\u3081\u308B","\u3055\u3084\u3048\u3093\u3068\u3099\u3046","\u3055\u3086\u3046","\u3055\u3088\u3046","\u3055\u3088\u304F","\u3055\u3089\u305F\u3099","\u3055\u3099\u308B\u305D\u306F\u3099","\u3055\u308F\u3084\u304B","\u3055\u308F\u308B","\u3055\u3093\u3044\u3093","\u3055\u3093\u304B","\u3055\u3093\u304D\u3083\u304F","\u3055\u3093\u3053\u3046","\u3055\u3093\u3055\u3044","\u3055\u3099\u3093\u3057\u3087","\u3055\u3093\u3059\u3046","\u3055\u3093\u305B\u3044","\u3055\u3093\u305D","\u3055\u3093\u3061","\u3055\u3093\u307E","\u3055\u3093\u307F","\u3055\u3093\u3089\u3093","\u3057\u3042\u3044","\u3057\u3042\u3051\u3099","\u3057\u3042\u3055\u3063\u3066","\u3057\u3042\u308F\u305B","\u3057\u3044\u304F","\u3057\u3044\u3093","\u3057\u3046\u3061","\u3057\u3048\u3044","\u3057\u304A\u3051","\u3057\u304B\u3044","\u3057\u304B\u304F","\u3057\u3099\u304B\u3093","\u3057\u3053\u3099\u3068","\u3057\u3059\u3046","\u3057\u3099\u305F\u3099\u3044","\u3057\u305F\u3046\u3051","\u3057\u305F\u304D\u3099","\u3057\u305F\u3066","\u3057\u305F\u307F","\u3057\u3061\u3087\u3046","\u3057\u3061\u308A\u3093","\u3057\u3063\u304B\u308A","\u3057\u3064\u3057\u3099","\u3057\u3064\u3082\u3093","\u3057\u3066\u3044","\u3057\u3066\u304D","\u3057\u3066\u3064","\u3057\u3099\u3066\u3093","\u3057\u3099\u3068\u3099\u3046","\u3057\u306A\u304D\u3099\u308C","\u3057\u306A\u3082\u306E","\u3057\u306A\u3093","\u3057\u306D\u307E","\u3057\u306D\u3093","\u3057\u306E\u304F\u3099","\u3057\u306E\u3075\u3099","\u3057\u306F\u3044","\u3057\u306F\u3099\u304B\u308A","\u3057\u306F\u3064","\u3057\u306F\u3089\u3044","\u3057\u306F\u3093","\u3057\u3072\u3087\u3046","\u3057\u3075\u304F","\u3057\u3099\u3075\u3099\u3093","\u3057\u3078\u3044","\u3057\u307B\u3046","\u3057\u307B\u3093","\u3057\u307E\u3046","\u3057\u307E\u308B","\u3057\u307F\u3093","\u3057\u3080\u3051\u308B","\u3057\u3099\u3080\u3057\u3087","\u3057\u3081\u3044","\u3057\u3081\u308B","\u3057\u3082\u3093","\u3057\u3083\u3044\u3093","\u3057\u3083\u3046\u3093","\u3057\u3083\u304A\u3093","\u3057\u3099\u3083\u304B\u3099\u3044\u3082","\u3057\u3084\u304F\u3057\u3087","\u3057\u3083\u304F\u307B\u3046","\u3057\u3083\u3051\u3093","\u3057\u3083\u3053","\u3057\u3083\u3055\u3099\u3044","\u3057\u3083\u3057\u3093","\u3057\u3083\u305B\u3093","\u3057\u3083\u305D\u3046","\u3057\u3083\u305F\u3044","\u3057\u3083\u3061\u3087\u3046","\u3057\u3083\u3063\u304D\u3093","\u3057\u3099\u3083\u307E","\u3057\u3083\u308A\u3093","\u3057\u3083\u308C\u3044","\u3057\u3099\u3086\u3046","\u3057\u3099\u3085\u3046\u3057\u3087","\u3057\u3085\u304F\u306F\u304F","\u3057\u3099\u3085\u3057\u3093","\u3057\u3085\u3063\u305B\u304D","\u3057\u3085\u307F","\u3057\u3085\u3089\u306F\u3099","\u3057\u3099\u3085\u3093\u306F\u3099\u3093","\u3057\u3087\u3046\u304B\u3044","\u3057\u3087\u304F\u305F\u304F","\u3057\u3087\u3063\u3051\u3093","\u3057\u3087\u3068\u3099\u3046","\u3057\u3087\u3082\u3064","\u3057\u3089\u305B\u308B","\u3057\u3089\u3078\u3099\u308B","\u3057\u3093\u304B","\u3057\u3093\u3053\u3046","\u3057\u3099\u3093\u3057\u3099\u3083","\u3057\u3093\u305B\u3044\u3057\u3099","\u3057\u3093\u3061\u304F","\u3057\u3093\u308A\u3093","\u3059\u3042\u3051\u3099","\u3059\u3042\u3057","\u3059\u3042\u306A","\u3059\u3099\u3042\u3093","\u3059\u3044\u3048\u3044","\u3059\u3044\u304B","\u3059\u3044\u3068\u3046","\u3059\u3099\u3044\u3075\u3099\u3093","\u3059\u3044\u3088\u3046\u3072\u3099","\u3059\u3046\u304B\u3099\u304F","\u3059\u3046\u3057\u3099\u3064","\u3059\u3046\u305B\u3093","\u3059\u304A\u3068\u3099\u308A","\u3059\u304D\u307E","\u3059\u304F\u3046","\u3059\u304F\u306A\u3044","\u3059\u3051\u308B","\u3059\u3053\u3099\u3044","\u3059\u3053\u3057","\u3059\u3099\u3055\u3093","\u3059\u3059\u3099\u3057\u3044","\u3059\u3059\u3080","\u3059\u3059\u3081\u308B","\u3059\u3063\u304B\u308A","\u3059\u3099\u3063\u3057\u308A","\u3059\u3099\u3063\u3068","\u3059\u3066\u304D","\u3059\u3066\u308B","\u3059\u306D\u308B","\u3059\u306E\u3053","\u3059\u306F\u305F\u3099","\u3059\u306F\u3099\u3089\u3057\u3044","\u3059\u3099\u3072\u3087\u3046","\u3059\u3099\u3075\u3099\u306C\u308C","\u3059\u3075\u3099\u308A","\u3059\u3075\u308C","\u3059\u3078\u3099\u3066","\u3059\u3078\u3099\u308B","\u3059\u3099\u307B\u3046","\u3059\u307B\u3099\u3093","\u3059\u307E\u3044","\u3059\u3081\u3057","\u3059\u3082\u3046","\u3059\u3084\u304D","\u3059\u3089\u3059\u3089","\u3059\u308B\u3081","\u3059\u308C\u3061\u304B\u3099\u3046","\u3059\u308D\u3063\u3068","\u3059\u308F\u308B","\u3059\u3093\u305B\u3099\u3093","\u3059\u3093\u307B\u309A\u3046","\u305B\u3042\u3075\u3099\u3089","\u305B\u3044\u304B\u3064","\u305B\u3044\u3051\u3099\u3093","\u305B\u3044\u3057\u3099","\u305B\u3044\u3088\u3046","\u305B\u304A\u3046","\u305B\u304B\u3044\u304B\u3093","\u305B\u304D\u306B\u3093","\u305B\u304D\u3080","\u305B\u304D\u3086","\u305B\u304D\u3089\u3093\u3046\u3093","\u305B\u3051\u3093","\u305B\u3053\u3046","\u305B\u3059\u3057\u3099","\u305B\u305F\u3044","\u305B\u305F\u3051","\u305B\u3063\u304B\u304F","\u305B\u3063\u304D\u3083\u304F","\u305B\u3099\u3063\u304F","\u305B\u3063\u3051\u3093","\u305B\u3063\u3053\u3064","\u305B\u3063\u3055\u305F\u304F\u307E","\u305B\u3064\u305D\u3099\u304F","\u305B\u3064\u305F\u3099\u3093","\u305B\u3064\u3066\u3099\u3093","\u305B\u3063\u306F\u309A\u3093","\u305B\u3064\u3072\u3099","\u305B\u3064\u3075\u3099\u3093","\u305B\u3064\u3081\u3044","\u305B\u3064\u308A\u3064","\u305B\u306A\u304B","\u305B\u306E\u3072\u3099","\u305B\u306F\u306F\u3099","\u305B\u3072\u3099\u308D","\u305B\u307B\u3099\u306D","\u305B\u307E\u3044","\u305B\u307E\u308B","\u305B\u3081\u308B","\u305B\u3082\u305F\u308C","\u305B\u308A\u3075","\u305B\u3099\u3093\u3042\u304F","\u305B\u3093\u3044","\u305B\u3093\u3048\u3044","\u305B\u3093\u304B","\u305B\u3093\u304D\u3087","\u305B\u3093\u304F","\u305B\u3093\u3051\u3099\u3093","\u305B\u3099\u3093\u3053\u3099","\u305B\u3093\u3055\u3044","\u305B\u3093\u3057\u3085","\u305B\u3093\u3059\u3044","\u305B\u3093\u305B\u3044","\u305B\u3093\u305D\u3099","\u305B\u3093\u305F\u304F","\u305B\u3093\u3061\u3087\u3046","\u305B\u3093\u3066\u3044","\u305B\u3093\u3068\u3046","\u305B\u3093\u306C\u304D","\u305B\u3093\u306D\u3093","\u305B\u3093\u306F\u309A\u3044","\u305B\u3099\u3093\u3075\u3099","\u305B\u3099\u3093\u307B\u309A\u3046","\u305B\u3093\u3080","\u305B\u3093\u3081\u3093\u3057\u3099\u3087","\u305B\u3093\u3082\u3093","\u305B\u3093\u3084\u304F","\u305B\u3093\u3086\u3046","\u305B\u3093\u3088\u3046","\u305B\u3099\u3093\u3089","\u305B\u3099\u3093\u308A\u3083\u304F","\u305B\u3093\u308C\u3044","\u305B\u3093\u308D","\u305D\u3042\u304F","\u305D\u3044\u3068\u3051\u3099\u308B","\u305D\u3044\u306D","\u305D\u3046\u304B\u3099\u3093\u304D\u3087\u3046","\u305D\u3046\u304D","\u305D\u3046\u3053\u3099","\u305D\u3046\u3057\u3093","\u305D\u3046\u305F\u3099\u3093","\u305D\u3046\u306A\u3093","\u305D\u3046\u3072\u3099","\u305D\u3046\u3081\u3093","\u305D\u3046\u308A","\u305D\u3048\u3082\u306E","\u305D\u3048\u3093","\u305D\u304B\u3099\u3044","\u305D\u3051\u3099\u304D","\u305D\u3053\u3046","\u305D\u3053\u305D\u3053","\u305D\u3055\u3099\u3044","\u305D\u3057\u306A","\u305D\u305B\u3044","\u305D\u305B\u3093","\u305D\u305D\u304F\u3099","\u305D\u305F\u3099\u3066\u308B","\u305D\u3064\u3046","\u305D\u3064\u3048\u3093","\u305D\u3063\u304B\u3093","\u305D\u3064\u304D\u3099\u3087\u3046","\u305D\u3063\u3051\u3064","\u305D\u3063\u3053\u3046","\u305D\u3063\u305B\u3093","\u305D\u3063\u3068","\u305D\u3068\u304B\u3099\u308F","\u305D\u3068\u3064\u3099\u3089","\u305D\u306A\u3048\u308B","\u305D\u306A\u305F","\u305D\u3075\u307B\u3099","\u305D\u307B\u3099\u304F","\u305D\u307B\u3099\u308D","\u305D\u307E\u3064","\u305D\u307E\u308B","\u305D\u3080\u304F","\u305D\u3080\u308A\u3048","\u305D\u3081\u308B","\u305D\u3082\u305D\u3082","\u305D\u3088\u304B\u305B\u3099","\u305D\u3089\u307E\u3081","\u305D\u308D\u3046","\u305D\u3093\u304B\u3044","\u305D\u3093\u3051\u3044","\u305D\u3093\u3055\u3099\u3044","\u305D\u3093\u3057\u3064","\u305D\u3093\u305D\u3099\u304F","\u305D\u3093\u3061\u3087\u3046","\u305D\u3099\u3093\u3072\u3099","\u305D\u3099\u3093\u3075\u3099\u3093","\u305D\u3093\u307F\u3093","\u305F\u3042\u3044","\u305F\u3044\u3044\u3093","\u305F\u3044\u3046\u3093","\u305F\u3044\u3048\u304D","\u305F\u3044\u304A\u3046","\u305F\u3099\u3044\u304B\u3099\u304F","\u305F\u3044\u304D","\u305F\u3044\u304F\u3099\u3046","\u305F\u3044\u3051\u3093","\u305F\u3044\u3053","\u305F\u3044\u3055\u3099\u3044","\u305F\u3099\u3044\u3057\u3099\u3087\u3046\u3075\u3099","\u305F\u3099\u3044\u3059\u304D","\u305F\u3044\u305B\u3064","\u305F\u3044\u305D\u3046","\u305F\u3099\u3044\u305F\u3044","\u305F\u3044\u3061\u3087\u3046","\u305F\u3044\u3066\u3044","\u305F\u3099\u3044\u3068\u3099\u3053\u308D","\u305F\u3044\u306A\u3044","\u305F\u3044\u306D\u3064","\u305F\u3044\u306E\u3046","\u305F\u3044\u306F\u3093","\u305F\u3099\u3044\u3072\u3087\u3046","\u305F\u3044\u3075\u3046","\u305F\u3044\u3078\u3093","\u305F\u3044\u307B","\u305F\u3044\u307E\u3064\u306F\u3099\u306A","\u305F\u3044\u307F\u3093\u304F\u3099","\u305F\u3044\u3080","\u305F\u3044\u3081\u3093","\u305F\u3044\u3084\u304D","\u305F\u3044\u3088\u3046","\u305F\u3044\u3089","\u305F\u3044\u308A\u3087\u304F","\u305F\u3044\u308B","\u305F\u3044\u308F\u3093","\u305F\u3046\u3048","\u305F\u3048\u308B","\u305F\u304A\u3059","\u305F\u304A\u308B","\u305F\u304A\u308C\u308B","\u305F\u304B\u3044","\u305F\u304B\u306D","\u305F\u304D\u3072\u3099","\u305F\u304F\u3055\u3093","\u305F\u3053\u304F","\u305F\u3053\u3084\u304D","\u305F\u3055\u3044","\u305F\u3057\u3055\u3099\u3093","\u305F\u3099\u3057\u3099\u3083\u308C","\u305F\u3059\u3051\u308B","\u305F\u3059\u3099\u3055\u308F\u308B","\u305F\u305D\u304B\u3099\u308C","\u305F\u305F\u304B\u3046","\u305F\u305F\u304F","\u305F\u305F\u3099\u3057\u3044","\u305F\u305F\u307F","\u305F\u3061\u306F\u3099\u306A","\u305F\u3099\u3063\u304B\u3044","\u305F\u3099\u3063\u304D\u3083\u304F","\u305F\u3099\u3063\u3053","\u305F\u3099\u3063\u3057\u3085\u3064","\u305F\u3099\u3063\u305F\u3044","\u305F\u3066\u308B","\u305F\u3068\u3048\u308B","\u305F\u306A\u306F\u3099\u305F","\u305F\u306B\u3093","\u305F\u306C\u304D","\u305F\u306E\u3057\u307F","\u305F\u306F\u3064","\u305F\u3075\u3099\u3093","\u305F\u3078\u3099\u308B","\u305F\u307B\u3099\u3046","\u305F\u307E\u3053\u3099","\u305F\u307E\u308B","\u305F\u3099\u3080\u308B","\u305F\u3081\u3044\u304D","\u305F\u3081\u3059","\u305F\u3081\u308B","\u305F\u3082\u3064","\u305F\u3084\u3059\u3044","\u305F\u3088\u308B","\u305F\u3089\u3059","\u305F\u308A\u304D\u307B\u3093\u304B\u3099\u3093","\u305F\u308A\u3087\u3046","\u305F\u308A\u308B","\u305F\u308B\u3068","\u305F\u308C\u308B","\u305F\u308C\u3093\u3068","\u305F\u308D\u3063\u3068","\u305F\u308F\u3080\u308C\u308B","\u305F\u3099\u3093\u3042\u3064","\u305F\u3093\u3044","\u305F\u3093\u304A\u3093","\u305F\u3093\u304B","\u305F\u3093\u304D","\u305F\u3093\u3051\u3093","\u305F\u3093\u3053\u3099","\u305F\u3093\u3055\u3093","\u305F\u3093\u3057\u3099\u3087\u3046\u3072\u3099","\u305F\u3099\u3093\u305B\u3044","\u305F\u3093\u305D\u304F","\u305F\u3093\u305F\u3044","\u305F\u3099\u3093\u3061","\u305F\u3093\u3066\u3044","\u305F\u3093\u3068\u3046","\u305F\u3099\u3093\u306A","\u305F\u3093\u306B\u3093","\u305F\u3099\u3093\u306D\u3064","\u305F\u3093\u306E\u3046","\u305F\u3093\u3072\u309A\u3093","\u305F\u3099\u3093\u307B\u3099\u3046","\u305F\u3093\u307E\u3064","\u305F\u3093\u3081\u3044","\u305F\u3099\u3093\u308C\u3064","\u305F\u3099\u3093\u308D","\u305F\u3099\u3093\u308F","\u3061\u3042\u3044","\u3061\u3042\u3093","\u3061\u3044\u304D","\u3061\u3044\u3055\u3044","\u3061\u3048\u3093","\u3061\u304B\u3044","\u3061\u304B\u3089","\u3061\u304D\u3085\u3046","\u3061\u304D\u3093","\u3061\u3051\u3044\u3059\u3099","\u3061\u3051\u3093","\u3061\u3053\u304F","\u3061\u3055\u3044","\u3061\u3057\u304D","\u3061\u3057\u308A\u3087\u3046","\u3061\u305B\u3044","\u3061\u305D\u3046","\u3061\u305F\u3044","\u3061\u305F\u3093","\u3061\u3061\u304A\u3084","\u3061\u3064\u3057\u3099\u3087","\u3061\u3066\u304D","\u3061\u3066\u3093","\u3061\u306C\u304D","\u3061\u306C\u308A","\u3061\u306E\u3046","\u3061\u3072\u3087\u3046","\u3061\u3078\u3044\u305B\u3093","\u3061\u307B\u3046","\u3061\u307E\u305F","\u3061\u307F\u3064","\u3061\u307F\u3068\u3099\u308D","\u3061\u3081\u3044\u3068\u3099","\u3061\u3083\u3093\u3053\u306A\u3078\u3099","\u3061\u3085\u3046\u3044","\u3061\u3086\u308A\u3087\u304F","\u3061\u3087\u3046\u3057","\u3061\u3087\u3055\u304F\u3051\u3093","\u3061\u3089\u3057","\u3061\u3089\u307F","\u3061\u308A\u304B\u3099\u307F","\u3061\u308A\u3087\u3046","\u3061\u308B\u3068\u3099","\u3061\u308F\u308F","\u3061\u3093\u305F\u3044","\u3061\u3093\u3082\u304F","\u3064\u3044\u304B","\u3064\u3044\u305F\u3061","\u3064\u3046\u304B","\u3064\u3046\u3057\u3099\u3087\u3046","\u3064\u3046\u306F\u3093","\u3064\u3046\u308F","\u3064\u304B\u3046","\u3064\u304B\u308C\u308B","\u3064\u304F\u306D","\u3064\u304F\u308B","\u3064\u3051\u306D","\u3064\u3051\u308B","\u3064\u3053\u3099\u3046","\u3064\u305F\u3048\u308B","\u3064\u3064\u3099\u304F","\u3064\u3064\u3057\u3099","\u3064\u3064\u3080","\u3064\u3068\u3081\u308B","\u3064\u306A\u304B\u3099\u308B","\u3064\u306A\u307F","\u3064\u306D\u3064\u3099\u306D","\u3064\u306E\u308B","\u3064\u3075\u3099\u3059","\u3064\u307E\u3089\u306A\u3044","\u3064\u307E\u308B","\u3064\u307F\u304D","\u3064\u3081\u305F\u3044","\u3064\u3082\u308A","\u3064\u3082\u308B","\u3064\u3088\u3044","\u3064\u308B\u307B\u3099","\u3064\u308B\u307F\u304F","\u3064\u308F\u3082\u306E","\u3064\u308F\u308A","\u3066\u3042\u3057","\u3066\u3042\u3066","\u3066\u3042\u307F","\u3066\u3044\u304A\u3093","\u3066\u3044\u304B","\u3066\u3044\u304D","\u3066\u3044\u3051\u3044","\u3066\u3044\u3053\u304F","\u3066\u3044\u3055\u3064","\u3066\u3044\u3057","\u3066\u3044\u305B\u3044","\u3066\u3044\u305F\u3044","\u3066\u3044\u3068\u3099","\u3066\u3044\u306D\u3044","\u3066\u3044\u3072\u3087\u3046","\u3066\u3044\u3078\u3093","\u3066\u3044\u307B\u3099\u3046","\u3066\u3046\u3061","\u3066\u304A\u304F\u308C","\u3066\u304D\u3068\u3046","\u3066\u304F\u3072\u3099","\u3066\u3099\u3053\u307B\u3099\u3053","\u3066\u3055\u304D\u3099\u3087\u3046","\u3066\u3055\u3051\u3099","\u3066\u3059\u308A","\u3066\u305D\u3046","\u3066\u3061\u304B\u3099\u3044","\u3066\u3061\u3087\u3046","\u3066\u3064\u304B\u3099\u304F","\u3066\u3064\u3064\u3099\u304D","\u3066\u3099\u3063\u306F\u309A","\u3066\u3064\u307B\u3099\u3046","\u3066\u3064\u3084","\u3066\u3099\u306C\u304B\u3048","\u3066\u306C\u304D","\u3066\u306C\u304F\u3099\u3044","\u3066\u306E\u3072\u3089","\u3066\u306F\u3044","\u3066\u3075\u3099\u304F\u308D","\u3066\u3075\u305F\u3099","\u3066\u307B\u3068\u3099\u304D","\u3066\u307B\u3093","\u3066\u307E\u3048","\u3066\u307E\u304D\u3059\u3099\u3057","\u3066\u307F\u3057\u3099\u304B","\u3066\u307F\u3084\u3051\u3099","\u3066\u3089\u3059","\u3066\u308C\u3072\u3099","\u3066\u308F\u3051","\u3066\u308F\u305F\u3057","\u3066\u3099\u3093\u3042\u3064","\u3066\u3093\u3044\u3093","\u3066\u3093\u304B\u3044","\u3066\u3093\u304D","\u3066\u3093\u304F\u3099","\u3066\u3093\u3051\u3093","\u3066\u3093\u3053\u3099\u304F","\u3066\u3093\u3055\u3044","\u3066\u3093\u3057","\u3066\u3093\u3059\u3046","\u3066\u3099\u3093\u3061","\u3066\u3093\u3066\u304D","\u3066\u3093\u3068\u3046","\u3066\u3093\u306A\u3044","\u3066\u3093\u3075\u309A\u3089","\u3066\u3093\u307B\u3099\u3046\u305F\u3099\u3044","\u3066\u3093\u3081\u3064","\u3066\u3093\u3089\u3093\u304B\u3044","\u3066\u3099\u3093\u308A\u3087\u304F","\u3066\u3099\u3093\u308F","\u3068\u3099\u3042\u3044","\u3068\u3044\u308C","\u3068\u3099\u3046\u304B\u3093","\u3068\u3046\u304D\u3085\u3046","\u3068\u3099\u3046\u304F\u3099","\u3068\u3046\u3057","\u3068\u3046\u3080\u304D\u3099","\u3068\u304A\u3044","\u3068\u304A\u304B","\u3068\u304A\u304F","\u3068\u304A\u3059","\u3068\u304A\u308B","\u3068\u304B\u3044","\u3068\u304B\u3059","\u3068\u304D\u304A\u308A","\u3068\u304D\u3068\u3099\u304D","\u3068\u304F\u3044","\u3068\u304F\u3057\u3085\u3046","\u3068\u304F\u3066\u3093","\u3068\u304F\u306B","\u3068\u304F\u3078\u3099\u3064","\u3068\u3051\u3044","\u3068\u3051\u308B","\u3068\u3053\u3084","\u3068\u3055\u304B","\u3068\u3057\u3087\u304B\u3093","\u3068\u305D\u3046","\u3068\u305F\u3093","\u3068\u3061\u3085\u3046","\u3068\u3063\u304D\u3085\u3046","\u3068\u3063\u304F\u3093","\u3068\u3064\u305B\u3099\u3093","\u3068\u3064\u306B\u3085\u3046","\u3068\u3068\u3099\u3051\u308B","\u3068\u3068\u306E\u3048\u308B","\u3068\u306A\u3044","\u3068\u306A\u3048\u308B","\u3068\u306A\u308A","\u3068\u306E\u3055\u307E","\u3068\u306F\u3099\u3059","\u3068\u3099\u3075\u3099\u304B\u3099\u308F","\u3068\u307B\u3046","\u3068\u307E\u308B","\u3068\u3081\u308B","\u3068\u3082\u305F\u3099\u3061","\u3068\u3082\u308B","\u3068\u3099\u3088\u3046\u3072\u3099","\u3068\u3089\u3048\u308B","\u3068\u3093\u304B\u3064","\u3068\u3099\u3093\u3075\u3099\u308A","\u306A\u3044\u304B\u304F","\u306A\u3044\u3053\u3046","\u306A\u3044\u3057\u3087","\u306A\u3044\u3059","\u306A\u3044\u305B\u3093","\u306A\u3044\u305D\u3046","\u306A\u304A\u3059","\u306A\u304B\u3099\u3044","\u306A\u304F\u3059","\u306A\u3051\u3099\u308B","\u306A\u3053\u3046\u3068\u3099","\u306A\u3055\u3051","\u306A\u305F\u3066\u3099\u3053\u3053","\u306A\u3063\u3068\u3046","\u306A\u3064\u3084\u3059\u307F","\u306A\u306A\u304A\u3057","\u306A\u306B\u3053\u3099\u3068","\u306A\u306B\u3082\u306E","\u306A\u306B\u308F","\u306A\u306E\u304B","\u306A\u3075\u305F\u3099","\u306A\u307E\u3044\u304D","\u306A\u307E\u3048","\u306A\u307E\u307F","\u306A\u307F\u305F\u3099","\u306A\u3081\u3089\u304B","\u306A\u3081\u308B","\u306A\u3084\u3080","\u306A\u3089\u3046","\u306A\u3089\u3072\u3099","\u306A\u3089\u3075\u3099","\u306A\u308C\u308B","\u306A\u308F\u3068\u3072\u3099","\u306A\u308F\u306F\u3099\u308A","\u306B\u3042\u3046","\u306B\u3044\u304B\u3099\u305F","\u306B\u3046\u3051","\u306B\u304A\u3044","\u306B\u304B\u3044","\u306B\u304B\u3099\u3066","\u306B\u304D\u3072\u3099","\u306B\u304F\u3057\u307F","\u306B\u304F\u307E\u3093","\u306B\u3051\u3099\u308B","\u306B\u3055\u3093\u304B\u305F\u3093\u305D","\u306B\u3057\u304D","\u306B\u305B\u3082\u306E","\u306B\u3061\u3057\u3099\u3087\u3046","\u306B\u3061\u3088\u3046\u3072\u3099","\u306B\u3063\u304B","\u306B\u3063\u304D","\u306B\u3063\u3051\u3044","\u306B\u3063\u3053\u3046","\u306B\u3063\u3055\u3093","\u306B\u3063\u3057\u3087\u304F","\u306B\u3063\u3059\u3046","\u306B\u3063\u305B\u304D","\u306B\u3063\u3066\u3044","\u306B\u306A\u3046","\u306B\u307B\u3093","\u306B\u307E\u3081","\u306B\u3082\u3064","\u306B\u3084\u308A","\u306B\u3085\u3046\u3044\u3093","\u306B\u308A\u3093\u3057\u3083","\u306B\u308F\u3068\u308A","\u306B\u3093\u3044","\u306B\u3093\u304B","\u306B\u3093\u304D","\u306B\u3093\u3051\u3099\u3093","\u306B\u3093\u3057\u304D","\u306B\u3093\u3059\u3099\u3046","\u306B\u3093\u305D\u3046","\u306B\u3093\u305F\u3044","\u306B\u3093\u3061","\u306B\u3093\u3066\u3044","\u306B\u3093\u306B\u304F","\u306B\u3093\u3075\u309A","\u306B\u3093\u307E\u308A","\u306B\u3093\u3080","\u306B\u3093\u3081\u3044","\u306B\u3093\u3088\u3046","\u306C\u3044\u304F\u304D\u3099","\u306C\u304B\u3059","\u306C\u304F\u3099\u3044\u3068\u308B","\u306C\u304F\u3099\u3046","\u306C\u304F\u3082\u308A","\u306C\u3059\u3080","\u306C\u307E\u3048\u3072\u3099","\u306C\u3081\u308A","\u306C\u3089\u3059","\u306C\u3093\u3061\u3083\u304F","\u306D\u3042\u3051\u3099","\u306D\u3044\u304D","\u306D\u3044\u308B","\u306D\u3044\u308D","\u306D\u304F\u3099\u305B","\u306D\u304F\u305F\u3044","\u306D\u304F\u3089","\u306D\u3053\u305B\u3099","\u306D\u3053\u3080","\u306D\u3055\u3051\u3099","\u306D\u3059\u3053\u3099\u3059","\u306D\u305D\u3078\u3099\u308B","\u306D\u305F\u3099\u3093","\u306D\u3064\u3044","\u306D\u3063\u3057\u3093","\u306D\u3064\u305D\u3099\u3046","\u306D\u3063\u305F\u3044\u304D\u3099\u3087","\u306D\u3075\u3099\u305D\u304F","\u306D\u3075\u305F\u3099","\u306D\u307B\u3099\u3046","\u306D\u307B\u308A\u306F\u307B\u308A","\u306D\u307E\u304D","\u306D\u307E\u308F\u3057","\u306D\u307F\u307F","\u306D\u3080\u3044","\u306D\u3080\u305F\u3044","\u306D\u3082\u3068","\u306D\u3089\u3046","\u306D\u308F\u3055\u3099","\u306D\u3093\u3044\u308A","\u306D\u3093\u304A\u3057","\u306D\u3093\u304B\u3093","\u306D\u3093\u304D\u3093","\u306D\u3093\u304F\u3099","\u306D\u3093\u3055\u3099","\u306D\u3093\u3057","\u306D\u3093\u3061\u3083\u304F","\u306D\u3093\u3068\u3099","\u306D\u3093\u3072\u309A","\u306D\u3093\u3075\u3099\u3064","\u306D\u3093\u307E\u3064","\u306D\u3093\u308A\u3087\u3046","\u306D\u3093\u308C\u3044","\u306E\u3044\u3059\u3099","\u306E\u304A\u3064\u3099\u307E","\u306E\u304B\u3099\u3059","\u306E\u304D\u306A\u307F","\u306E\u3053\u304D\u3099\u308A","\u306E\u3053\u3059","\u306E\u3053\u308B","\u306E\u305B\u308B","\u306E\u305D\u3099\u304F","\u306E\u305D\u3099\u3080","\u306E\u305F\u307E\u3046","\u306E\u3061\u307B\u3068\u3099","\u306E\u3063\u304F","\u306E\u306F\u3099\u3059","\u306E\u306F\u3089","\u306E\u3078\u3099\u308B","\u306E\u307B\u3099\u308B","\u306E\u307F\u3082\u306E","\u306E\u3084\u307E","\u306E\u3089\u3044\u306C","\u306E\u3089\u306D\u3053","\u306E\u308A\u3082\u306E","\u306E\u308A\u3086\u304D","\u306E\u308C\u3093","\u306E\u3093\u304D","\u306F\u3099\u3042\u3044","\u306F\u3042\u304F","\u306F\u3099\u3042\u3055\u3093","\u306F\u3099\u3044\u304B","\u306F\u3099\u3044\u304F","\u306F\u3044\u3051\u3093","\u306F\u3044\u3053\u3099","\u306F\u3044\u3057\u3093","\u306F\u3044\u3059\u3044","\u306F\u3044\u305B\u3093","\u306F\u3044\u305D\u3046","\u306F\u3044\u3061","\u306F\u3099\u3044\u306F\u3099\u3044","\u306F\u3044\u308C\u3064","\u306F\u3048\u308B","\u306F\u304A\u308B","\u306F\u304B\u3044","\u306F\u3099\u304B\u308A","\u306F\u304B\u308B","\u306F\u304F\u3057\u3085","\u306F\u3051\u3093","\u306F\u3053\u3075\u3099","\u306F\u3055\u307F","\u306F\u3055\u3093","\u306F\u3057\u3053\u3099","\u306F\u3099\u3057\u3087","\u306F\u3057\u308B","\u306F\u305B\u308B","\u306F\u309A\u305D\u3053\u3093","\u306F\u305D\u3093","\u306F\u305F\u3093","\u306F\u3061\u307F\u3064","\u306F\u3064\u304A\u3093","\u306F\u3063\u304B\u304F","\u306F\u3064\u3099\u304D","\u306F\u3063\u304D\u308A","\u306F\u3063\u304F\u3064","\u306F\u3063\u3051\u3093","\u306F\u3063\u3053\u3046","\u306F\u3063\u3055\u3093","\u306F\u3063\u3057\u3093","\u306F\u3063\u305F\u3064","\u306F\u3063\u3061\u3085\u3046","\u306F\u3063\u3066\u3093","\u306F\u3063\u3072\u309A\u3087\u3046","\u306F\u3063\u307B\u309A\u3046","\u306F\u306A\u3059","\u306F\u306A\u3072\u3099","\u306F\u306B\u304B\u3080","\u306F\u3075\u3099\u3089\u3057","\u306F\u307F\u304B\u3099\u304D","\u306F\u3080\u304B\u3046","\u306F\u3081\u3064","\u306F\u3084\u3044","\u306F\u3084\u3057","\u306F\u3089\u3046","\u306F\u308D\u3046\u3043\u3093","\u306F\u308F\u3044","\u306F\u3093\u3044","\u306F\u3093\u3048\u3044","\u306F\u3093\u304A\u3093","\u306F\u3093\u304B\u304F","\u306F\u3093\u304D\u3087\u3046","\u306F\u3099\u3093\u304F\u3099\u307F","\u306F\u3093\u3053","\u306F\u3093\u3057\u3083","\u306F\u3093\u3059\u3046","\u306F\u3093\u305F\u3099\u3093","\u306F\u309A\u3093\u3061","\u306F\u309A\u3093\u3064","\u306F\u3093\u3066\u3044","\u306F\u3093\u3068\u3057","\u306F\u3093\u306E\u3046","\u306F\u3093\u306F\u309A","\u306F\u3093\u3075\u3099\u3093","\u306F\u3093\u3078\u309A\u3093","\u306F\u3093\u307B\u3099\u3046\u304D","\u306F\u3093\u3081\u3044","\u306F\u3093\u3089\u3093","\u306F\u3093\u308D\u3093","\u3072\u3044\u304D","\u3072\u3046\u3093","\u3072\u3048\u308B","\u3072\u304B\u304F","\u3072\u304B\u308A","\u3072\u304B\u308B","\u3072\u304B\u3093","\u3072\u304F\u3044","\u3072\u3051\u3064","\u3072\u3053\u3046\u304D","\u3072\u3053\u304F","\u3072\u3055\u3044","\u3072\u3055\u3057\u3075\u3099\u308A","\u3072\u3055\u3093","\u3072\u3099\u3057\u3099\u3085\u3064\u304B\u3093","\u3072\u3057\u3087","\u3072\u305D\u304B","\u3072\u305D\u3080","\u3072\u305F\u3080\u304D","\u3072\u305F\u3099\u308A","\u3072\u305F\u308B","\u3072\u3064\u304D\u3099","\u3072\u3063\u3053\u3057","\u3072\u3063\u3057","\u3072\u3064\u3057\u3099\u3085\u3072\u3093","\u3072\u3063\u3059","\u3072\u3064\u305B\u3099\u3093","\u3072\u309A\u3063\u305F\u308A","\u3072\u309A\u3063\u3061\u308A","\u3072\u3064\u3088\u3046","\u3072\u3066\u3044","\u3072\u3068\u3053\u3099\u307F","\u3072\u306A\u307E\u3064\u308A","\u3072\u306A\u3093","\u3072\u306D\u308B","\u3072\u306F\u3093","\u3072\u3072\u3099\u304F","\u3072\u3072\u3087\u3046","\u3072\u307B\u3046","\u3072\u307E\u308F\u308A","\u3072\u307E\u3093","\u3072\u307F\u3064","\u3072\u3081\u3044","\u3072\u3081\u3057\u3099\u3057","\u3072\u3084\u3051","\u3072\u3084\u3059","\u3072\u3088\u3046","\u3072\u3099\u3087\u3046\u304D","\u3072\u3089\u304B\u3099\u306A","\u3072\u3089\u304F","\u3072\u308A\u3064","\u3072\u308A\u3087\u3046","\u3072\u308B\u307E","\u3072\u308B\u3084\u3059\u307F","\u3072\u308C\u3044","\u3072\u308D\u3044","\u3072\u308D\u3046","\u3072\u308D\u304D","\u3072\u308D\u3086\u304D","\u3072\u3093\u304B\u304F","\u3072\u3093\u3051\u3064","\u3072\u3093\u3053\u3093","\u3072\u3093\u3057\u3085","\u3072\u3093\u305D\u3046","\u3072\u309A\u3093\u3061","\u3072\u3093\u306F\u309A\u3093","\u3072\u3099\u3093\u307B\u3099\u3046","\u3075\u3042\u3093","\u3075\u3044\u3046\u3061","\u3075\u3046\u3051\u3044","\u3075\u3046\u305B\u3093","\u3075\u309A\u3046\u305F\u308D\u3046","\u3075\u3046\u3068\u3046","\u3075\u3046\u3075","\u3075\u3048\u308B","\u3075\u304A\u3093","\u3075\u304B\u3044","\u3075\u304D\u3093","\u3075\u304F\u3055\u3099\u3064","\u3075\u304F\u3075\u3099\u304F\u308D","\u3075\u3053\u3046","\u3075\u3055\u3044","\u3075\u3057\u304D\u3099","\u3075\u3057\u3099\u307F","\u3075\u3059\u307E","\u3075\u305B\u3044","\u3075\u305B\u304F\u3099","\u3075\u305D\u304F","\u3075\u3099\u305F\u306B\u304F","\u3075\u305F\u3093","\u3075\u3061\u3087\u3046","\u3075\u3064\u3046","\u3075\u3064\u304B","\u3075\u3063\u304B\u3064","\u3075\u3063\u304D","\u3075\u3063\u3053\u304F","\u3075\u3099\u3068\u3099\u3046","\u3075\u3068\u308B","\u3075\u3068\u3093","\u3075\u306E\u3046","\u3075\u306F\u3044","\u3075\u3072\u3087\u3046","\u3075\u3078\u3093","\u3075\u307E\u3093","\u3075\u307F\u3093","\u3075\u3081\u3064","\u3075\u3081\u3093","\u3075\u3088\u3046","\u3075\u308A\u3053","\u3075\u308A\u308B","\u3075\u308B\u3044","\u3075\u3093\u3044\u304D","\u3075\u3099\u3093\u304B\u3099\u304F","\u3075\u3099\u3093\u304F\u3099","\u3075\u3093\u3057\u3064","\u3075\u3099\u3093\u305B\u304D","\u3075\u3093\u305D\u3046","\u3075\u3099\u3093\u307B\u309A\u3046","\u3078\u3044\u3042\u3093","\u3078\u3044\u304A\u3093","\u3078\u3044\u304B\u3099\u3044","\u3078\u3044\u304D","\u3078\u3044\u3051\u3099\u3093","\u3078\u3044\u3053\u3046","\u3078\u3044\u3055","\u3078\u3044\u3057\u3083","\u3078\u3044\u305B\u3064","\u3078\u3044\u305D","\u3078\u3044\u305F\u304F","\u3078\u3044\u3066\u3093","\u3078\u3044\u306D\u3064","\u3078\u3044\u308F","\u3078\u304D\u304B\u3099","\u3078\u3053\u3080","\u3078\u3099\u306B\u3044\u308D","\u3078\u3099\u306B\u3057\u3087\u3046\u304B\u3099","\u3078\u3089\u3059","\u3078\u3093\u304B\u3093","\u3078\u3099\u3093\u304D\u3087\u3046","\u3078\u3099\u3093\u3053\u3099\u3057","\u3078\u3093\u3055\u3044","\u3078\u3093\u305F\u3044","\u3078\u3099\u3093\u308A","\u307B\u3042\u3093","\u307B\u3044\u304F","\u307B\u3099\u3046\u304D\u3099\u3087","\u307B\u3046\u3053\u304F","\u307B\u3046\u305D\u3046","\u307B\u3046\u307B\u3046","\u307B\u3046\u3082\u3093","\u307B\u3046\u308A\u3064","\u307B\u3048\u308B","\u307B\u304A\u3093","\u307B\u304B\u3093","\u307B\u304D\u3087\u3046","\u307B\u3099\u304D\u3093","\u307B\u304F\u308D","\u307B\u3051\u3064","\u307B\u3051\u3093","\u307B\u3053\u3046","\u307B\u3053\u308B","\u307B\u3057\u3044","\u307B\u3057\u3064","\u307B\u3057\u3085","\u307B\u3057\u3087\u3046","\u307B\u305B\u3044","\u307B\u305D\u3044","\u307B\u305D\u304F","\u307B\u305F\u3066","\u307B\u305F\u308B","\u307B\u309A\u3061\u3075\u3099\u304F\u308D","\u307B\u3063\u304D\u3087\u304F","\u307B\u3063\u3055","\u307B\u3063\u305F\u3093","\u307B\u3068\u3093\u3068\u3099","\u307B\u3081\u308B","\u307B\u3093\u3044","\u307B\u3093\u304D","\u307B\u3093\u3051","\u307B\u3093\u3057\u3064","\u307B\u3093\u3084\u304F","\u307E\u3044\u306B\u3061","\u307E\u304B\u3044","\u307E\u304B\u305B\u308B","\u307E\u304B\u3099\u308B","\u307E\u3051\u308B","\u307E\u3053\u3068","\u307E\u3055\u3064","\u307E\u3057\u3099\u3081","\u307E\u3059\u304F","\u307E\u305B\u3099\u308B","\u307E\u3064\u308A","\u307E\u3068\u3081","\u307E\u306A\u3075\u3099","\u307E\u306C\u3051","\u307E\u306D\u304F","\u307E\u307B\u3046","\u307E\u3082\u308B","\u307E\u3086\u3051\u3099","\u307E\u3088\u3046","\u307E\u308D\u3084\u304B","\u307E\u308F\u3059","\u307E\u308F\u308A","\u307E\u308F\u308B","\u307E\u3093\u304B\u3099","\u307E\u3093\u304D\u3064","\u307E\u3093\u305D\u3099\u304F","\u307E\u3093\u306A\u304B","\u307F\u3044\u3089","\u307F\u3046\u3061","\u307F\u3048\u308B","\u307F\u304B\u3099\u304F","\u307F\u304B\u305F","\u307F\u304B\u3093","\u307F\u3051\u3093","\u307F\u3053\u3093","\u307F\u3057\u3099\u304B\u3044","\u307F\u3059\u3044","\u307F\u3059\u3048\u308B","\u307F\u305B\u308B","\u307F\u3063\u304B","\u307F\u3064\u304B\u308B","\u307F\u3064\u3051\u308B","\u307F\u3066\u3044","\u307F\u3068\u3081\u308B","\u307F\u306A\u3068","\u307F\u306A\u307F\u304B\u3055\u3044","\u307F\u306D\u3089\u308B","\u307F\u306E\u3046","\u307F\u306E\u304B\u3099\u3059","\u307F\u307B\u3093","\u307F\u3082\u3068","\u307F\u3084\u3051\u3099","\u307F\u3089\u3044","\u307F\u308A\u3087\u304F","\u307F\u308F\u304F","\u307F\u3093\u304B","\u307F\u3093\u305D\u3099\u304F","\u3080\u3044\u304B","\u3080\u3048\u304D","\u3080\u3048\u3093","\u3080\u304B\u3044","\u3080\u304B\u3046","\u3080\u304B\u3048","\u3080\u304B\u3057","\u3080\u304D\u3099\u3061\u3083","\u3080\u3051\u308B","\u3080\u3051\u3099\u3093","\u3080\u3055\u307B\u3099\u308B","\u3080\u3057\u3042\u3064\u3044","\u3080\u3057\u306F\u3099","\u3080\u3057\u3099\u3085\u3093","\u3080\u3057\u308D","\u3080\u3059\u3046","\u3080\u3059\u3053","\u3080\u3059\u3075\u3099","\u3080\u3059\u3081","\u3080\u305B\u308B","\u3080\u305B\u3093","\u3080\u3061\u3085\u3046","\u3080\u306A\u3057\u3044","\u3080\u306E\u3046","\u3080\u3084\u307F","\u3080\u3088\u3046","\u3080\u3089\u3055\u304D","\u3080\u308A\u3087\u3046","\u3080\u308D\u3093","\u3081\u3044\u3042\u3093","\u3081\u3044\u3046\u3093","\u3081\u3044\u3048\u3093","\u3081\u3044\u304B\u304F","\u3081\u3044\u304D\u3087\u304F","\u3081\u3044\u3055\u3044","\u3081\u3044\u3057","\u3081\u3044\u305D\u3046","\u3081\u3044\u3075\u3099\u3064","\u3081\u3044\u308C\u3044","\u3081\u3044\u308F\u304F","\u3081\u304F\u3099\u307E\u308C\u308B","\u3081\u3055\u3099\u3059","\u3081\u3057\u305F","\u3081\u3059\u3099\u3089\u3057\u3044","\u3081\u305F\u3099\u3064","\u3081\u307E\u3044","\u3081\u3084\u3059","\u3081\u3093\u304D\u3087","\u3081\u3093\u305B\u304D","\u3081\u3093\u3068\u3099\u3046","\u3082\u3046\u3057\u3042\u3051\u3099\u308B","\u3082\u3046\u3068\u3099\u3046\u3051\u3093","\u3082\u3048\u308B","\u3082\u304F\u3057","\u3082\u304F\u3066\u304D","\u3082\u304F\u3088\u3046\u3072\u3099","\u3082\u3061\u308D\u3093","\u3082\u3068\u3099\u308B","\u3082\u3089\u3046","\u3082\u3093\u304F","\u3082\u3093\u305F\u3099\u3044","\u3084\u304A\u3084","\u3084\u3051\u308B","\u3084\u3055\u3044","\u3084\u3055\u3057\u3044","\u3084\u3059\u3044","\u3084\u3059\u305F\u308D\u3046","\u3084\u3059\u307F","\u3084\u305B\u308B","\u3084\u305D\u3046","\u3084\u305F\u3044","\u3084\u3061\u3093","\u3084\u3063\u3068","\u3084\u3063\u306F\u309A\u308A","\u3084\u3075\u3099\u308B","\u3084\u3081\u308B","\u3084\u3084\u3053\u3057\u3044","\u3084\u3088\u3044","\u3084\u308F\u3089\u304B\u3044","\u3086\u3046\u304D","\u3086\u3046\u3072\u3099\u3093\u304D\u3087\u304F","\u3086\u3046\u3078\u3099","\u3086\u3046\u3081\u3044","\u3086\u3051\u3064","\u3086\u3057\u3085\u3064","\u3086\u305B\u3093","\u3086\u305D\u3046","\u3086\u305F\u304B","\u3086\u3061\u3083\u304F","\u3086\u3066\u3099\u308B","\u3086\u306B\u3085\u3046","\u3086\u3072\u3099\u308F","\u3086\u3089\u3044","\u3086\u308C\u308B","\u3088\u3046\u3044","\u3088\u3046\u304B","\u3088\u3046\u304D\u3085\u3046","\u3088\u3046\u3057\u3099","\u3088\u3046\u3059","\u3088\u3046\u3061\u3048\u3093","\u3088\u304B\u305B\u3099","\u3088\u304B\u3093","\u3088\u304D\u3093","\u3088\u304F\u305B\u3044","\u3088\u304F\u307B\u3099\u3046","\u3088\u3051\u3044","\u3088\u3053\u3099\u308C\u308B","\u3088\u3055\u3093","\u3088\u3057\u3085\u3046","\u3088\u305D\u3046","\u3088\u305D\u304F","\u3088\u3063\u304B","\u3088\u3066\u3044","\u3088\u3068\u3099\u304B\u3099\u308F\u304F","\u3088\u306D\u3064","\u3088\u3084\u304F","\u3088\u3086\u3046","\u3088\u308D\u3053\u3075\u3099","\u3088\u308D\u3057\u3044","\u3089\u3044\u3046","\u3089\u304F\u304B\u3099\u304D","\u3089\u304F\u3053\u3099","\u3089\u304F\u3055\u3064","\u3089\u304F\u305F\u3099","\u3089\u3057\u3093\u306F\u3099\u3093","\u3089\u305B\u3093","\u3089\u305D\u3099\u304F","\u3089\u305F\u3044","\u3089\u3063\u304B","\u3089\u308C\u3064","\u308A\u3048\u304D","\u308A\u304B\u3044","\u308A\u304D\u3055\u304F","\u308A\u304D\u305B\u3064","\u308A\u304F\u304F\u3099\u3093","\u308A\u304F\u3064","\u308A\u3051\u3093","\u308A\u3053\u3046","\u308A\u305B\u3044","\u308A\u305D\u3046","\u308A\u305D\u304F","\u308A\u3066\u3093","\u308A\u306D\u3093","\u308A\u3086\u3046","\u308A\u3085\u3046\u304B\u3099\u304F","\u308A\u3088\u3046","\u308A\u3087\u3046\u308A","\u308A\u3087\u304B\u3093","\u308A\u3087\u304F\u3061\u3083","\u308A\u3087\u3053\u3046","\u308A\u308A\u304F","\u308A\u308C\u304D","\u308A\u308D\u3093","\u308A\u3093\u3053\u3099","\u308B\u3044\u3051\u3044","\u308B\u3044\u3055\u3044","\u308B\u3044\u3057\u3099","\u308B\u3044\u305B\u304D","\u308B\u3059\u306F\u3099\u3093","\u308B\u308A\u304B\u3099\u308F\u3089","\u308C\u3044\u304B\u3093","\u308C\u3044\u304D\u3099","\u308C\u3044\u305B\u3044","\u308C\u3044\u305D\u3099\u3046\u3053","\u308C\u3044\u3068\u3046","\u308C\u3044\u307B\u3099\u3046","\u308C\u304D\u3057","\u308C\u304D\u305F\u3099\u3044","\u308C\u3093\u3042\u3044","\u308C\u3093\u3051\u3044","\u308C\u3093\u3053\u3093","\u308C\u3093\u3055\u3044","\u308C\u3093\u3057\u3085\u3046","\u308C\u3093\u305D\u3099\u304F","\u308C\u3093\u3089\u304F","\u308D\u3046\u304B","\u308D\u3046\u3053\u3099","\u308D\u3046\u3057\u3099\u3093","\u308D\u3046\u305D\u304F","\u308D\u304F\u304B\u3099","\u308D\u3053\u3064","\u308D\u3057\u3099\u3046\u3089","\u308D\u3057\u3085\u3064","\u308D\u305B\u3093","\u308D\u3066\u3093","\u308D\u3081\u3093","\u308D\u308C\u3064","\u308D\u3093\u304D\u3099","\u308D\u3093\u306F\u309A","\u308D\u3093\u3075\u3099\u3093","\u308D\u3093\u308A","\u308F\u304B\u3059","\u308F\u304B\u3081","\u308F\u304B\u3084\u307E","\u308F\u304B\u308C\u308B","\u308F\u3057\u3064","\u308F\u3057\u3099\u307E\u3057","\u308F\u3059\u308C\u3082\u306E","\u308F\u3089\u3046","\u308F\u308C\u308B"]'), Yd = JSON.parse('["abacate","abaixo","abalar","abater","abduzir","abelha","aberto","abismo","abotoar","abranger","abreviar","abrigar","abrupto","absinto","absoluto","absurdo","abutre","acabado","acalmar","acampar","acanhar","acaso","aceitar","acelerar","acenar","acervo","acessar","acetona","achatar","acidez","acima","acionado","acirrar","aclamar","aclive","acolhida","acomodar","acoplar","acordar","acumular","acusador","adaptar","adega","adentro","adepto","adequar","aderente","adesivo","adeus","adiante","aditivo","adjetivo","adjunto","admirar","adorar","adquirir","adubo","adverso","advogado","aeronave","afastar","aferir","afetivo","afinador","afivelar","aflito","afluente","afrontar","agachar","agarrar","agasalho","agenciar","agilizar","agiota","agitado","agora","agradar","agreste","agrupar","aguardar","agulha","ajoelhar","ajudar","ajustar","alameda","alarme","alastrar","alavanca","albergue","albino","alcatra","aldeia","alecrim","alegria","alertar","alface","alfinete","algum","alheio","aliar","alicate","alienar","alinhar","aliviar","almofada","alocar","alpiste","alterar","altitude","alucinar","alugar","aluno","alusivo","alvo","amaciar","amador","amarelo","amassar","ambas","ambiente","ameixa","amenizar","amido","amistoso","amizade","amolador","amontoar","amoroso","amostra","amparar","ampliar","ampola","anagrama","analisar","anarquia","anatomia","andaime","anel","anexo","angular","animar","anjo","anomalia","anotado","ansioso","anterior","anuidade","anunciar","anzol","apagador","apalpar","apanhado","apego","apelido","apertada","apesar","apetite","apito","aplauso","aplicada","apoio","apontar","aposta","aprendiz","aprovar","aquecer","arame","aranha","arara","arcada","ardente","areia","arejar","arenito","aresta","argiloso","argola","arma","arquivo","arraial","arrebate","arriscar","arroba","arrumar","arsenal","arterial","artigo","arvoredo","asfaltar","asilado","aspirar","assador","assinar","assoalho","assunto","astral","atacado","atadura","atalho","atarefar","atear","atender","aterro","ateu","atingir","atirador","ativo","atoleiro","atracar","atrevido","atriz","atual","atum","auditor","aumentar","aura","aurora","autismo","autoria","autuar","avaliar","avante","avaria","avental","avesso","aviador","avisar","avulso","axila","azarar","azedo","azeite","azulejo","babar","babosa","bacalhau","bacharel","bacia","bagagem","baiano","bailar","baioneta","bairro","baixista","bajular","baleia","baliza","balsa","banal","bandeira","banho","banir","banquete","barato","barbado","baronesa","barraca","barulho","baseado","bastante","batata","batedor","batida","batom","batucar","baunilha","beber","beijo","beirada","beisebol","beldade","beleza","belga","beliscar","bendito","bengala","benzer","berimbau","berlinda","berro","besouro","bexiga","bezerro","bico","bicudo","bienal","bifocal","bifurcar","bigorna","bilhete","bimestre","bimotor","biologia","biombo","biosfera","bipolar","birrento","biscoito","bisneto","bispo","bissexto","bitola","bizarro","blindado","bloco","bloquear","boato","bobagem","bocado","bocejo","bochecha","boicotar","bolada","boletim","bolha","bolo","bombeiro","bonde","boneco","bonita","borbulha","borda","boreal","borracha","bovino","boxeador","branco","brasa","braveza","breu","briga","brilho","brincar","broa","brochura","bronzear","broto","bruxo","bucha","budismo","bufar","bule","buraco","busca","busto","buzina","cabana","cabelo","cabide","cabo","cabrito","cacau","cacetada","cachorro","cacique","cadastro","cadeado","cafezal","caiaque","caipira","caixote","cajado","caju","calafrio","calcular","caldeira","calibrar","calmante","calota","camada","cambista","camisa","camomila","campanha","camuflar","canavial","cancelar","caneta","canguru","canhoto","canivete","canoa","cansado","cantar","canudo","capacho","capela","capinar","capotar","capricho","captador","capuz","caracol","carbono","cardeal","careca","carimbar","carneiro","carpete","carreira","cartaz","carvalho","casaco","casca","casebre","castelo","casulo","catarata","cativar","caule","causador","cautelar","cavalo","caverna","cebola","cedilha","cegonha","celebrar","celular","cenoura","censo","centeio","cercar","cerrado","certeiro","cerveja","cetim","cevada","chacota","chaleira","chamado","chapada","charme","chatice","chave","chefe","chegada","cheiro","cheque","chicote","chifre","chinelo","chocalho","chover","chumbo","chutar","chuva","cicatriz","ciclone","cidade","cidreira","ciente","cigana","cimento","cinto","cinza","ciranda","circuito","cirurgia","citar","clareza","clero","clicar","clone","clube","coado","coagir","cobaia","cobertor","cobrar","cocada","coelho","coentro","coeso","cogumelo","coibir","coifa","coiote","colar","coleira","colher","colidir","colmeia","colono","coluna","comando","combinar","comentar","comitiva","comover","complexo","comum","concha","condor","conectar","confuso","congelar","conhecer","conjugar","consumir","contrato","convite","cooperar","copeiro","copiador","copo","coquetel","coragem","cordial","corneta","coronha","corporal","correio","cortejo","coruja","corvo","cosseno","costela","cotonete","couro","couve","covil","cozinha","cratera","cravo","creche","credor","creme","crer","crespo","criada","criminal","crioulo","crise","criticar","crosta","crua","cruzeiro","cubano","cueca","cuidado","cujo","culatra","culminar","culpar","cultura","cumprir","cunhado","cupido","curativo","curral","cursar","curto","cuspir","custear","cutelo","damasco","datar","debater","debitar","deboche","debulhar","decalque","decimal","declive","decote","decretar","dedal","dedicado","deduzir","defesa","defumar","degelo","degrau","degustar","deitado","deixar","delator","delegado","delinear","delonga","demanda","demitir","demolido","dentista","depenado","depilar","depois","depressa","depurar","deriva","derramar","desafio","desbotar","descanso","desenho","desfiado","desgaste","desigual","deslize","desmamar","desova","despesa","destaque","desviar","detalhar","detentor","detonar","detrito","deusa","dever","devido","devotado","dezena","diagrama","dialeto","didata","difuso","digitar","dilatado","diluente","diminuir","dinastia","dinheiro","diocese","direto","discreta","disfarce","disparo","disquete","dissipar","distante","ditador","diurno","diverso","divisor","divulgar","dizer","dobrador","dolorido","domador","dominado","donativo","donzela","dormente","dorsal","dosagem","dourado","doutor","drenagem","drible","drogaria","duelar","duende","dueto","duplo","duquesa","durante","duvidoso","eclodir","ecoar","ecologia","edificar","edital","educado","efeito","efetivar","ejetar","elaborar","eleger","eleitor","elenco","elevador","eliminar","elogiar","embargo","embolado","embrulho","embutido","emenda","emergir","emissor","empatia","empenho","empinado","empolgar","emprego","empurrar","emulador","encaixe","encenado","enchente","encontro","endeusar","endossar","enfaixar","enfeite","enfim","engajado","engenho","englobar","engomado","engraxar","enguia","enjoar","enlatar","enquanto","enraizar","enrolado","enrugar","ensaio","enseada","ensino","ensopado","entanto","enteado","entidade","entortar","entrada","entulho","envergar","enviado","envolver","enxame","enxerto","enxofre","enxuto","epiderme","equipar","ereto","erguido","errata","erva","ervilha","esbanjar","esbelto","escama","escola","escrita","escuta","esfinge","esfolar","esfregar","esfumado","esgrima","esmalte","espanto","espelho","espiga","esponja","espreita","espumar","esquerda","estaca","esteira","esticar","estofado","estrela","estudo","esvaziar","etanol","etiqueta","euforia","europeu","evacuar","evaporar","evasivo","eventual","evidente","evoluir","exagero","exalar","examinar","exato","exausto","excesso","excitar","exclamar","executar","exemplo","exibir","exigente","exonerar","expandir","expelir","expirar","explanar","exposto","expresso","expulsar","externo","extinto","extrato","fabricar","fabuloso","faceta","facial","fada","fadiga","faixa","falar","falta","familiar","fandango","fanfarra","fantoche","fardado","farelo","farinha","farofa","farpa","fartura","fatia","fator","favorita","faxina","fazenda","fechado","feijoada","feirante","felino","feminino","fenda","feno","fera","feriado","ferrugem","ferver","festejar","fetal","feudal","fiapo","fibrose","ficar","ficheiro","figurado","fileira","filho","filme","filtrar","firmeza","fisgada","fissura","fita","fivela","fixador","fixo","flacidez","flamingo","flanela","flechada","flora","flutuar","fluxo","focal","focinho","fofocar","fogo","foguete","foice","folgado","folheto","forjar","formiga","forno","forte","fosco","fossa","fragata","fralda","frango","frasco","fraterno","freira","frente","fretar","frieza","friso","fritura","fronha","frustrar","fruteira","fugir","fulano","fuligem","fundar","fungo","funil","furador","furioso","futebol","gabarito","gabinete","gado","gaiato","gaiola","gaivota","galega","galho","galinha","galocha","ganhar","garagem","garfo","gargalo","garimpo","garoupa","garrafa","gasoduto","gasto","gata","gatilho","gaveta","gazela","gelado","geleia","gelo","gemada","gemer","gemido","generoso","gengiva","genial","genoma","genro","geologia","gerador","germinar","gesso","gestor","ginasta","gincana","gingado","girafa","girino","glacial","glicose","global","glorioso","goela","goiaba","golfe","golpear","gordura","gorjeta","gorro","gostoso","goteira","governar","gracejo","gradual","grafite","gralha","grampo","granada","gratuito","graveto","graxa","grego","grelhar","greve","grilo","grisalho","gritaria","grosso","grotesco","grudado","grunhido","gruta","guache","guarani","guaxinim","guerrear","guiar","guincho","guisado","gula","guloso","guru","habitar","harmonia","haste","haver","hectare","herdar","heresia","hesitar","hiato","hibernar","hidratar","hiena","hino","hipismo","hipnose","hipoteca","hoje","holofote","homem","honesto","honrado","hormonal","hospedar","humorado","iate","ideia","idoso","ignorado","igreja","iguana","ileso","ilha","iludido","iluminar","ilustrar","imagem","imediato","imenso","imersivo","iminente","imitador","imortal","impacto","impedir","implante","impor","imprensa","impune","imunizar","inalador","inapto","inativo","incenso","inchar","incidir","incluir","incolor","indeciso","indireto","indutor","ineficaz","inerente","infantil","infestar","infinito","inflamar","informal","infrator","ingerir","inibido","inicial","inimigo","injetar","inocente","inodoro","inovador","inox","inquieto","inscrito","inseto","insistir","inspetor","instalar","insulto","intacto","integral","intimar","intocado","intriga","invasor","inverno","invicto","invocar","iogurte","iraniano","ironizar","irreal","irritado","isca","isento","isolado","isqueiro","italiano","janeiro","jangada","janta","jararaca","jardim","jarro","jasmim","jato","javali","jazida","jejum","joaninha","joelhada","jogador","joia","jornal","jorrar","jovem","juba","judeu","judoca","juiz","julgador","julho","jurado","jurista","juro","justa","labareda","laboral","lacre","lactante","ladrilho","lagarta","lagoa","laje","lamber","lamentar","laminar","lampejo","lanche","lapidar","lapso","laranja","lareira","largura","lasanha","lastro","lateral","latido","lavanda","lavoura","lavrador","laxante","lazer","lealdade","lebre","legado","legendar","legista","leigo","leiloar","leitura","lembrete","leme","lenhador","lentilha","leoa","lesma","leste","letivo","letreiro","levar","leveza","levitar","liberal","libido","liderar","ligar","ligeiro","limitar","limoeiro","limpador","linda","linear","linhagem","liquidez","listagem","lisura","litoral","livro","lixa","lixeira","locador","locutor","lojista","lombo","lona","longe","lontra","lorde","lotado","loteria","loucura","lousa","louvar","luar","lucidez","lucro","luneta","lustre","lutador","luva","macaco","macete","machado","macio","madeira","madrinha","magnata","magreza","maior","mais","malandro","malha","malote","maluco","mamilo","mamoeiro","mamute","manada","mancha","mandato","manequim","manhoso","manivela","manobrar","mansa","manter","manusear","mapeado","maquinar","marcador","maresia","marfim","margem","marinho","marmita","maroto","marquise","marreco","martelo","marujo","mascote","masmorra","massagem","mastigar","matagal","materno","matinal","matutar","maxilar","medalha","medida","medusa","megafone","meiga","melancia","melhor","membro","memorial","menino","menos","mensagem","mental","merecer","mergulho","mesada","mesclar","mesmo","mesquita","mestre","metade","meteoro","metragem","mexer","mexicano","micro","migalha","migrar","milagre","milenar","milhar","mimado","minerar","minhoca","ministro","minoria","miolo","mirante","mirtilo","misturar","mocidade","moderno","modular","moeda","moer","moinho","moita","moldura","moleza","molho","molinete","molusco","montanha","moqueca","morango","morcego","mordomo","morena","mosaico","mosquete","mostarda","motel","motim","moto","motriz","muda","muito","mulata","mulher","multar","mundial","munido","muralha","murcho","muscular","museu","musical","nacional","nadador","naja","namoro","narina","narrado","nascer","nativa","natureza","navalha","navegar","navio","neblina","nebuloso","negativa","negociar","negrito","nervoso","neta","neural","nevasca","nevoeiro","ninar","ninho","nitidez","nivelar","nobreza","noite","noiva","nomear","nominal","nordeste","nortear","notar","noticiar","noturno","novelo","novilho","novo","nublado","nudez","numeral","nupcial","nutrir","nuvem","obcecado","obedecer","objetivo","obrigado","obscuro","obstetra","obter","obturar","ocidente","ocioso","ocorrer","oculista","ocupado","ofegante","ofensiva","oferenda","oficina","ofuscado","ogiva","olaria","oleoso","olhar","oliveira","ombro","omelete","omisso","omitir","ondulado","oneroso","ontem","opcional","operador","oponente","oportuno","oposto","orar","orbitar","ordem","ordinal","orfanato","orgasmo","orgulho","oriental","origem","oriundo","orla","ortodoxo","orvalho","oscilar","ossada","osso","ostentar","otimismo","ousadia","outono","outubro","ouvido","ovelha","ovular","oxidar","oxigenar","pacato","paciente","pacote","pactuar","padaria","padrinho","pagar","pagode","painel","pairar","paisagem","palavra","palestra","palheta","palito","palmada","palpitar","pancada","panela","panfleto","panqueca","pantanal","papagaio","papelada","papiro","parafina","parcial","pardal","parede","partida","pasmo","passado","pastel","patamar","patente","patinar","patrono","paulada","pausar","peculiar","pedalar","pedestre","pediatra","pedra","pegada","peitoral","peixe","pele","pelicano","penca","pendurar","peneira","penhasco","pensador","pente","perceber","perfeito","pergunta","perito","permitir","perna","perplexo","persiana","pertence","peruca","pescado","pesquisa","pessoa","petiscar","piada","picado","piedade","pigmento","pilastra","pilhado","pilotar","pimenta","pincel","pinguim","pinha","pinote","pintar","pioneiro","pipoca","piquete","piranha","pires","pirueta","piscar","pistola","pitanga","pivete","planta","plaqueta","platina","plebeu","plumagem","pluvial","pneu","poda","poeira","poetisa","polegada","policiar","poluente","polvilho","pomar","pomba","ponderar","pontaria","populoso","porta","possuir","postal","pote","poupar","pouso","povoar","praia","prancha","prato","praxe","prece","predador","prefeito","premiar","prensar","preparar","presilha","pretexto","prevenir","prezar","primata","princesa","prisma","privado","processo","produto","profeta","proibido","projeto","prometer","propagar","prosa","protetor","provador","publicar","pudim","pular","pulmonar","pulseira","punhal","punir","pupilo","pureza","puxador","quadra","quantia","quarto","quase","quebrar","queda","queijo","quente","querido","quimono","quina","quiosque","rabanada","rabisco","rachar","racionar","radial","raiar","rainha","raio","raiva","rajada","ralado","ramal","ranger","ranhura","rapadura","rapel","rapidez","raposa","raquete","raridade","rasante","rascunho","rasgar","raspador","rasteira","rasurar","ratazana","ratoeira","realeza","reanimar","reaver","rebaixar","rebelde","rebolar","recado","recente","recheio","recibo","recordar","recrutar","recuar","rede","redimir","redonda","reduzida","reenvio","refinar","refletir","refogar","refresco","refugiar","regalia","regime","regra","reinado","reitor","rejeitar","relativo","remador","remendo","remorso","renovado","reparo","repelir","repleto","repolho","represa","repudiar","requerer","resenha","resfriar","resgatar","residir","resolver","respeito","ressaca","restante","resumir","retalho","reter","retirar","retomada","retratar","revelar","revisor","revolta","riacho","rica","rigidez","rigoroso","rimar","ringue","risada","risco","risonho","robalo","rochedo","rodada","rodeio","rodovia","roedor","roleta","romano","roncar","rosado","roseira","rosto","rota","roteiro","rotina","rotular","rouco","roupa","roxo","rubro","rugido","rugoso","ruivo","rumo","rupestre","russo","sabor","saciar","sacola","sacudir","sadio","safira","saga","sagrada","saibro","salada","saleiro","salgado","saliva","salpicar","salsicha","saltar","salvador","sambar","samurai","sanar","sanfona","sangue","sanidade","sapato","sarda","sargento","sarjeta","saturar","saudade","saxofone","sazonal","secar","secular","seda","sedento","sediado","sedoso","sedutor","segmento","segredo","segundo","seiva","seleto","selvagem","semanal","semente","senador","senhor","sensual","sentado","separado","sereia","seringa","serra","servo","setembro","setor","sigilo","silhueta","silicone","simetria","simpatia","simular","sinal","sincero","singular","sinopse","sintonia","sirene","siri","situado","soberano","sobra","socorro","sogro","soja","solda","soletrar","solteiro","sombrio","sonata","sondar","sonegar","sonhador","sono","soprano","soquete","sorrir","sorteio","sossego","sotaque","soterrar","sovado","sozinho","suavizar","subida","submerso","subsolo","subtrair","sucata","sucesso","suco","sudeste","sufixo","sugador","sugerir","sujeito","sulfato","sumir","suor","superior","suplicar","suposto","suprimir","surdina","surfista","surpresa","surreal","surtir","suspiro","sustento","tabela","tablete","tabuada","tacho","tagarela","talher","talo","talvez","tamanho","tamborim","tampa","tangente","tanto","tapar","tapioca","tardio","tarefa","tarja","tarraxa","tatuagem","taurino","taxativo","taxista","teatral","tecer","tecido","teclado","tedioso","teia","teimar","telefone","telhado","tempero","tenente","tensor","tentar","termal","terno","terreno","tese","tesoura","testado","teto","textura","texugo","tiara","tigela","tijolo","timbrar","timidez","tingido","tinteiro","tiragem","titular","toalha","tocha","tolerar","tolice","tomada","tomilho","tonel","tontura","topete","tora","torcido","torneio","torque","torrada","torto","tostar","touca","toupeira","toxina","trabalho","tracejar","tradutor","trafegar","trajeto","trama","trancar","trapo","traseiro","tratador","travar","treino","tremer","trepidar","trevo","triagem","tribo","triciclo","tridente","trilogia","trindade","triplo","triturar","triunfal","trocar","trombeta","trova","trunfo","truque","tubular","tucano","tudo","tulipa","tupi","turbo","turma","turquesa","tutelar","tutorial","uivar","umbigo","unha","unidade","uniforme","urologia","urso","urtiga","urubu","usado","usina","usufruir","vacina","vadiar","vagaroso","vaidoso","vala","valente","validade","valores","vantagem","vaqueiro","varanda","vareta","varrer","vascular","vasilha","vassoura","vazar","vazio","veado","vedar","vegetar","veicular","veleiro","velhice","veludo","vencedor","vendaval","venerar","ventre","verbal","verdade","vereador","vergonha","vermelho","verniz","versar","vertente","vespa","vestido","vetorial","viaduto","viagem","viajar","viatura","vibrador","videira","vidraria","viela","viga","vigente","vigiar","vigorar","vilarejo","vinco","vinheta","vinil","violeta","virada","virtude","visitar","visto","vitral","viveiro","vizinho","voador","voar","vogal","volante","voleibol","voltagem","volumoso","vontade","vulto","vuvuzela","xadrez","xarope","xeque","xeretar","xerife","xingar","zangado","zarpar","zebu","zelador","zombar","zoologia","zumbido"]'), Jd = JSON.parse('["abandon","ability","able","about","above","absent","absorb","abstract","absurd","abuse","access","accident","account","accuse","achieve","acid","acoustic","acquire","across","act","action","actor","actress","actual","adapt","add","addict","address","adjust","admit","adult","advance","advice","aerobic","affair","afford","afraid","again","age","agent","agree","ahead","aim","air","airport","aisle","alarm","album","alcohol","alert","alien","all","alley","allow","almost","alone","alpha","already","also","alter","always","amateur","amazing","among","amount","amused","analyst","anchor","ancient","anger","angle","angry","animal","ankle","announce","annual","another","answer","antenna","antique","anxiety","any","apart","apology","appear","apple","approve","april","arch","arctic","area","arena","argue","arm","armed","armor","army","around","arrange","arrest","arrive","arrow","art","artefact","artist","artwork","ask","aspect","assault","asset","assist","assume","asthma","athlete","atom","attack","attend","attitude","attract","auction","audit","august","aunt","author","auto","autumn","average","avocado","avoid","awake","aware","away","awesome","awful","awkward","axis","baby","bachelor","bacon","badge","bag","balance","balcony","ball","bamboo","banana","banner","bar","barely","bargain","barrel","base","basic","basket","battle","beach","bean","beauty","because","become","beef","before","begin","behave","behind","believe","below","belt","bench","benefit","best","betray","better","between","beyond","bicycle","bid","bike","bind","biology","bird","birth","bitter","black","blade","blame","blanket","blast","bleak","bless","blind","blood","blossom","blouse","blue","blur","blush","board","boat","body","boil","bomb","bone","bonus","book","boost","border","boring","borrow","boss","bottom","bounce","box","boy","bracket","brain","brand","brass","brave","bread","breeze","brick","bridge","brief","bright","bring","brisk","broccoli","broken","bronze","broom","brother","brown","brush","bubble","buddy","budget","buffalo","build","bulb","bulk","bullet","bundle","bunker","burden","burger","burst","bus","business","busy","butter","buyer","buzz","cabbage","cabin","cable","cactus","cage","cake","call","calm","camera","camp","can","canal","cancel","candy","cannon","canoe","canvas","canyon","capable","capital","captain","car","carbon","card","cargo","carpet","carry","cart","case","cash","casino","castle","casual","cat","catalog","catch","category","cattle","caught","cause","caution","cave","ceiling","celery","cement","census","century","cereal","certain","chair","chalk","champion","change","chaos","chapter","charge","chase","chat","cheap","check","cheese","chef","cherry","chest","chicken","chief","child","chimney","choice","choose","chronic","chuckle","chunk","churn","cigar","cinnamon","circle","citizen","city","civil","claim","clap","clarify","claw","clay","clean","clerk","clever","click","client","cliff","climb","clinic","clip","clock","clog","close","cloth","cloud","clown","club","clump","cluster","clutch","coach","coast","coconut","code","coffee","coil","coin","collect","color","column","combine","come","comfort","comic","common","company","concert","conduct","confirm","congress","connect","consider","control","convince","cook","cool","copper","copy","coral","core","corn","correct","cost","cotton","couch","country","couple","course","cousin","cover","coyote","crack","cradle","craft","cram","crane","crash","crater","crawl","crazy","cream","credit","creek","crew","cricket","crime","crisp","critic","crop","cross","crouch","crowd","crucial","cruel","cruise","crumble","crunch","crush","cry","crystal","cube","culture","cup","cupboard","curious","current","curtain","curve","cushion","custom","cute","cycle","dad","damage","damp","dance","danger","daring","dash","daughter","dawn","day","deal","debate","debris","decade","december","decide","decline","decorate","decrease","deer","defense","define","defy","degree","delay","deliver","demand","demise","denial","dentist","deny","depart","depend","deposit","depth","deputy","derive","describe","desert","design","desk","despair","destroy","detail","detect","develop","device","devote","diagram","dial","diamond","diary","dice","diesel","diet","differ","digital","dignity","dilemma","dinner","dinosaur","direct","dirt","disagree","discover","disease","dish","dismiss","disorder","display","distance","divert","divide","divorce","dizzy","doctor","document","dog","doll","dolphin","domain","donate","donkey","donor","door","dose","double","dove","draft","dragon","drama","drastic","draw","dream","dress","drift","drill","drink","drip","drive","drop","drum","dry","duck","dumb","dune","during","dust","dutch","duty","dwarf","dynamic","eager","eagle","early","earn","earth","easily","east","easy","echo","ecology","economy","edge","edit","educate","effort","egg","eight","either","elbow","elder","electric","elegant","element","elephant","elevator","elite","else","embark","embody","embrace","emerge","emotion","employ","empower","empty","enable","enact","end","endless","endorse","enemy","energy","enforce","engage","engine","enhance","enjoy","enlist","enough","enrich","enroll","ensure","enter","entire","entry","envelope","episode","equal","equip","era","erase","erode","erosion","error","erupt","escape","essay","essence","estate","eternal","ethics","evidence","evil","evoke","evolve","exact","example","excess","exchange","excite","exclude","excuse","execute","exercise","exhaust","exhibit","exile","exist","exit","exotic","expand","expect","expire","explain","expose","express","extend","extra","eye","eyebrow","fabric","face","faculty","fade","faint","faith","fall","false","fame","family","famous","fan","fancy","fantasy","farm","fashion","fat","fatal","father","fatigue","fault","favorite","feature","february","federal","fee","feed","feel","female","fence","festival","fetch","fever","few","fiber","fiction","field","figure","file","film","filter","final","find","fine","finger","finish","fire","firm","first","fiscal","fish","fit","fitness","fix","flag","flame","flash","flat","flavor","flee","flight","flip","float","flock","floor","flower","fluid","flush","fly","foam","focus","fog","foil","fold","follow","food","foot","force","forest","forget","fork","fortune","forum","forward","fossil","foster","found","fox","fragile","frame","frequent","fresh","friend","fringe","frog","front","frost","frown","frozen","fruit","fuel","fun","funny","furnace","fury","future","gadget","gain","galaxy","gallery","game","gap","garage","garbage","garden","garlic","garment","gas","gasp","gate","gather","gauge","gaze","general","genius","genre","gentle","genuine","gesture","ghost","giant","gift","giggle","ginger","giraffe","girl","give","glad","glance","glare","glass","glide","glimpse","globe","gloom","glory","glove","glow","glue","goat","goddess","gold","good","goose","gorilla","gospel","gossip","govern","gown","grab","grace","grain","grant","grape","grass","gravity","great","green","grid","grief","grit","grocery","group","grow","grunt","guard","guess","guide","guilt","guitar","gun","gym","habit","hair","half","hammer","hamster","hand","happy","harbor","hard","harsh","harvest","hat","have","hawk","hazard","head","health","heart","heavy","hedgehog","height","hello","helmet","help","hen","hero","hidden","high","hill","hint","hip","hire","history","hobby","hockey","hold","hole","holiday","hollow","home","honey","hood","hope","horn","horror","horse","hospital","host","hotel","hour","hover","hub","huge","human","humble","humor","hundred","hungry","hunt","hurdle","hurry","hurt","husband","hybrid","ice","icon","idea","identify","idle","ignore","ill","illegal","illness","image","imitate","immense","immune","impact","impose","improve","impulse","inch","include","income","increase","index","indicate","indoor","industry","infant","inflict","inform","inhale","inherit","initial","inject","injury","inmate","inner","innocent","input","inquiry","insane","insect","inside","inspire","install","intact","interest","into","invest","invite","involve","iron","island","isolate","issue","item","ivory","jacket","jaguar","jar","jazz","jealous","jeans","jelly","jewel","job","join","joke","journey","joy","judge","juice","jump","jungle","junior","junk","just","kangaroo","keen","keep","ketchup","key","kick","kid","kidney","kind","kingdom","kiss","kit","kitchen","kite","kitten","kiwi","knee","knife","knock","know","lab","label","labor","ladder","lady","lake","lamp","language","laptop","large","later","latin","laugh","laundry","lava","law","lawn","lawsuit","layer","lazy","leader","leaf","learn","leave","lecture","left","leg","legal","legend","leisure","lemon","lend","length","lens","leopard","lesson","letter","level","liar","liberty","library","license","life","lift","light","like","limb","limit","link","lion","liquid","list","little","live","lizard","load","loan","lobster","local","lock","logic","lonely","long","loop","lottery","loud","lounge","love","loyal","lucky","luggage","lumber","lunar","lunch","luxury","lyrics","machine","mad","magic","magnet","maid","mail","main","major","make","mammal","man","manage","mandate","mango","mansion","manual","maple","marble","march","margin","marine","market","marriage","mask","mass","master","match","material","math","matrix","matter","maximum","maze","meadow","mean","measure","meat","mechanic","medal","media","melody","melt","member","memory","mention","menu","mercy","merge","merit","merry","mesh","message","metal","method","middle","midnight","milk","million","mimic","mind","minimum","minor","minute","miracle","mirror","misery","miss","mistake","mix","mixed","mixture","mobile","model","modify","mom","moment","monitor","monkey","monster","month","moon","moral","more","morning","mosquito","mother","motion","motor","mountain","mouse","move","movie","much","muffin","mule","multiply","muscle","museum","mushroom","music","must","mutual","myself","mystery","myth","naive","name","napkin","narrow","nasty","nation","nature","near","neck","need","negative","neglect","neither","nephew","nerve","nest","net","network","neutral","never","news","next","nice","night","noble","noise","nominee","noodle","normal","north","nose","notable","note","nothing","notice","novel","now","nuclear","number","nurse","nut","oak","obey","object","oblige","obscure","observe","obtain","obvious","occur","ocean","october","odor","off","offer","office","often","oil","okay","old","olive","olympic","omit","once","one","onion","online","only","open","opera","opinion","oppose","option","orange","orbit","orchard","order","ordinary","organ","orient","original","orphan","ostrich","other","outdoor","outer","output","outside","oval","oven","over","own","owner","oxygen","oyster","ozone","pact","paddle","page","pair","palace","palm","panda","panel","panic","panther","paper","parade","parent","park","parrot","party","pass","patch","path","patient","patrol","pattern","pause","pave","payment","peace","peanut","pear","peasant","pelican","pen","penalty","pencil","people","pepper","perfect","permit","person","pet","phone","photo","phrase","physical","piano","picnic","picture","piece","pig","pigeon","pill","pilot","pink","pioneer","pipe","pistol","pitch","pizza","place","planet","plastic","plate","play","please","pledge","pluck","plug","plunge","poem","poet","point","polar","pole","police","pond","pony","pool","popular","portion","position","possible","post","potato","pottery","poverty","powder","power","practice","praise","predict","prefer","prepare","present","pretty","prevent","price","pride","primary","print","priority","prison","private","prize","problem","process","produce","profit","program","project","promote","proof","property","prosper","protect","proud","provide","public","pudding","pull","pulp","pulse","pumpkin","punch","pupil","puppy","purchase","purity","purpose","purse","push","put","puzzle","pyramid","quality","quantum","quarter","question","quick","quit","quiz","quote","rabbit","raccoon","race","rack","radar","radio","rail","rain","raise","rally","ramp","ranch","random","range","rapid","rare","rate","rather","raven","raw","razor","ready","real","reason","rebel","rebuild","recall","receive","recipe","record","recycle","reduce","reflect","reform","refuse","region","regret","regular","reject","relax","release","relief","rely","remain","remember","remind","remove","render","renew","rent","reopen","repair","repeat","replace","report","require","rescue","resemble","resist","resource","response","result","retire","retreat","return","reunion","reveal","review","reward","rhythm","rib","ribbon","rice","rich","ride","ridge","rifle","right","rigid","ring","riot","ripple","risk","ritual","rival","river","road","roast","robot","robust","rocket","romance","roof","rookie","room","rose","rotate","rough","round","route","royal","rubber","rude","rug","rule","run","runway","rural","sad","saddle","sadness","safe","sail","salad","salmon","salon","salt","salute","same","sample","sand","satisfy","satoshi","sauce","sausage","save","say","scale","scan","scare","scatter","scene","scheme","school","science","scissors","scorpion","scout","scrap","screen","script","scrub","sea","search","season","seat","second","secret","section","security","seed","seek","segment","select","sell","seminar","senior","sense","sentence","series","service","session","settle","setup","seven","shadow","shaft","shallow","share","shed","shell","sheriff","shield","shift","shine","ship","shiver","shock","shoe","shoot","shop","short","shoulder","shove","shrimp","shrug","shuffle","shy","sibling","sick","side","siege","sight","sign","silent","silk","silly","silver","similar","simple","since","sing","siren","sister","situate","six","size","skate","sketch","ski","skill","skin","skirt","skull","slab","slam","sleep","slender","slice","slide","slight","slim","slogan","slot","slow","slush","small","smart","smile","smoke","smooth","snack","snake","snap","sniff","snow","soap","soccer","social","sock","soda","soft","solar","soldier","solid","solution","solve","someone","song","soon","sorry","sort","soul","sound","soup","source","south","space","spare","spatial","spawn","speak","special","speed","spell","spend","sphere","spice","spider","spike","spin","spirit","split","spoil","sponsor","spoon","sport","spot","spray","spread","spring","spy","square","squeeze","squirrel","stable","stadium","staff","stage","stairs","stamp","stand","start","state","stay","steak","steel","stem","step","stereo","stick","still","sting","stock","stomach","stone","stool","story","stove","strategy","street","strike","strong","struggle","student","stuff","stumble","style","subject","submit","subway","success","such","sudden","suffer","sugar","suggest","suit","summer","sun","sunny","sunset","super","supply","supreme","sure","surface","surge","surprise","surround","survey","suspect","sustain","swallow","swamp","swap","swarm","swear","sweet","swift","swim","swing","switch","sword","symbol","symptom","syrup","system","table","tackle","tag","tail","talent","talk","tank","tape","target","task","taste","tattoo","taxi","teach","team","tell","ten","tenant","tennis","tent","term","test","text","thank","that","theme","then","theory","there","they","thing","this","thought","three","thrive","throw","thumb","thunder","ticket","tide","tiger","tilt","timber","time","tiny","tip","tired","tissue","title","toast","tobacco","today","toddler","toe","together","toilet","token","tomato","tomorrow","tone","tongue","tonight","tool","tooth","top","topic","topple","torch","tornado","tortoise","toss","total","tourist","toward","tower","town","toy","track","trade","traffic","tragic","train","transfer","trap","trash","travel","tray","treat","tree","trend","trial","tribe","trick","trigger","trim","trip","trophy","trouble","truck","true","truly","trumpet","trust","truth","try","tube","tuition","tumble","tuna","tunnel","turkey","turn","turtle","twelve","twenty","twice","twin","twist","two","type","typical","ugly","umbrella","unable","unaware","uncle","uncover","under","undo","unfair","unfold","unhappy","uniform","unique","unit","universe","unknown","unlock","until","unusual","unveil","update","upgrade","uphold","upon","upper","upset","urban","urge","usage","use","used","useful","useless","usual","utility","vacant","vacuum","vague","valid","valley","valve","van","vanish","vapor","various","vast","vault","vehicle","velvet","vendor","venture","venue","verb","verify","version","very","vessel","veteran","viable","vibrant","vicious","victory","video","view","village","vintage","violin","virtual","virus","visa","visit","visual","vital","vivid","vocal","voice","void","volcano","volume","vote","voyage","wage","wagon","wait","walk","wall","walnut","want","warfare","warm","warrior","wash","wasp","waste","water","wave","way","wealth","weapon","wear","weasel","weather","web","wedding","weekend","weird","welcome","west","wet","whale","what","wheat","wheel","when","where","whip","whisper","wide","width","wife","wild","will","win","window","wine","wing","wink","winner","winter","wire","wisdom","wise","wish","witness","wolf","woman","wonder","wood","wool","word","work","world","worry","worth","wrap","wreck","wrestle","wrist","write","wrong","yard","year","yellow","you","young","youth","zebra","zero","zone","zoo"]');
  var nn;
  function sn() {
    if (nn) return be;
    nn = 1, Object.defineProperty(be, "__esModule", {
      value: true
    });
    const e = {};
    be.wordlists = e;
    let r;
    be._default = r;
    try {
      be._default = r = Kd, e.czech = r;
    } catch {
    }
    try {
      be._default = r = Vd, e.chinese_simplified = r;
    } catch {
    }
    try {
      be._default = r = Md, e.chinese_traditional = r;
    } catch {
    }
    try {
      be._default = r = $d, e.korean = r;
    } catch {
    }
    try {
      be._default = r = qd, e.french = r;
    } catch {
    }
    try {
      be._default = r = Gd, e.italian = r;
    } catch {
    }
    try {
      be._default = r = Wd, e.spanish = r;
    } catch {
    }
    try {
      be._default = r = Xd, e.japanese = r, e.JA = r;
    } catch {
    }
    try {
      be._default = r = Yd, e.portuguese = r;
    } catch {
    }
    try {
      be._default = r = Jd, e.english = r, e.EN = r;
    } catch {
    }
    return be;
  }
  var cn;
  Zh = function() {
    if (cn) return Se;
    cn = 1, Object.defineProperty(Se, "__esModule", {
      value: true
    });
    const e = Ld(), r = Bd(), t = Fd(), o = rt(), a = sn();
    let n = a._default;
    const i = "Invalid mnemonic", s = "Invalid entropy", u = "Invalid mnemonic checksum", c = `A wordlist is required but a default could not be found.
Please pass a 2048 word array explicitly.`;
    function d(b) {
      return (b || "").normalize("NFKD");
    }
    function l(b, w, x) {
      for (; b.length < x; ) b = w + b;
      return b;
    }
    function f(b) {
      return parseInt(b, 2);
    }
    function p(b) {
      return b.map((w) => l(w.toString(2), "0", 8)).join("");
    }
    function h(b) {
      const x = b.length * 8 / 32, H = e.sha256(Uint8Array.from(b));
      return p(Array.from(H)).slice(0, x);
    }
    function m(b) {
      return "mnemonic" + (b || "");
    }
    function v(b, w) {
      const x = Uint8Array.from(ke.from(d(b), "utf8")), H = Uint8Array.from(ke.from(m(d(w)), "utf8")), T = t.pbkdf2(r.sha512, x, H, {
        c: 2048,
        dkLen: 64
      });
      return ke.from(T);
    }
    Se.mnemonicToSeedSync = v;
    function E(b, w) {
      const x = Uint8Array.from(ke.from(d(b), "utf8")), H = Uint8Array.from(ke.from(m(d(w)), "utf8"));
      return t.pbkdf2Async(r.sha512, x, H, {
        c: 2048,
        dkLen: 64
      }).then((T) => ke.from(T));
    }
    Se.mnemonicToSeed = E;
    function A(b, w) {
      if (w = w || n, !w) throw new Error(c);
      const x = d(b).split(" ");
      if (x.length % 3 !== 0) throw new Error(i);
      const H = x.map((g) => {
        const I = w.indexOf(g);
        if (I === -1) throw new Error(i);
        return l(I.toString(2), "0", 11);
      }).join(""), T = Math.floor(H.length / 33) * 32, D = H.slice(0, T), M = H.slice(T), X = D.match(/(.{1,8})/g).map(f);
      if (X.length < 16) throw new Error(s);
      if (X.length > 32) throw new Error(s);
      if (X.length % 4 !== 0) throw new Error(s);
      const Y = ke.from(X);
      if (h(Y) !== M) throw new Error(u);
      return Y.toString("hex");
    }
    Se.mnemonicToEntropy = A;
    function y(b, w) {
      if (ke.isBuffer(b) || (b = ke.from(b, "hex")), w = w || n, !w) throw new Error(c);
      if (b.length < 16) throw new TypeError(s);
      if (b.length > 32) throw new TypeError(s);
      if (b.length % 4 !== 0) throw new TypeError(s);
      const x = p(Array.from(b)), H = h(b), M = (x + H).match(/(.{1,11})/g).map((X) => {
        const Y = f(X);
        return w[Y];
      });
      return w[0] === "\u3042\u3044\u3053\u304F\u3057\u3093" ? M.join("\u3000") : M.join(" ");
    }
    Se.entropyToMnemonic = y;
    function k(b, w, x) {
      if (b = b || 128, b % 32 !== 0) throw new TypeError(s);
      return w = w || ((H) => ke.from(o.randomBytes(H))), y(w(b / 8), x);
    }
    Se.generateMnemonic = k;
    function _(b, w) {
      try {
        A(b, w);
      } catch {
        return false;
      }
      return true;
    }
    Se.validateMnemonic = _;
    function S(b) {
      const w = a.wordlists[b];
      if (w) n = w;
      else throw new Error('Could not find wordlist for language "' + b + '"');
    }
    Se.setDefaultWordlist = S;
    function j() {
      if (!n) throw new Error("No Default Wordlist set");
      return Object.keys(a.wordlists).filter((b) => b === "JA" || b === "EN" ? false : a.wordlists[b].every((w, x) => w === n[x]))[0];
    }
    Se.getDefaultWordlist = j;
    var R = sn();
    return Se.wordlists = R.wordlists, Se;
  };
  class Li extends Kn {
    constructor(r, t) {
      super(), this.finished = false, this.destroyed = false, $s(r);
      const o = Vo(t);
      if (this.iHash = r.create(), typeof this.iHash.update != "function") throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const a = this.blockLen, n = new Uint8Array(a);
      n.set(o.length > a ? r.create().update(o).digest() : o);
      for (let i = 0; i < n.length; i++) n[i] ^= 54;
      this.iHash.update(n), this.oHash = r.create();
      for (let i = 0; i < n.length; i++) n[i] ^= 106;
      this.oHash.update(n), dr(n);
    }
    update(r) {
      return xt(this), this.iHash.update(r), this;
    }
    digestInto(r) {
      xt(this), Ft(r, this.outputLen), this.finished = true, this.iHash.digestInto(r), this.oHash.update(r), this.oHash.digestInto(r), this.destroy();
    }
    digest() {
      const r = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(r), r;
    }
    _cloneInto(r) {
      r || (r = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: t, iHash: o, finished: a, destroyed: n, blockLen: i, outputLen: s } = this;
      return r = r, r.finished = a, r.destroyed = n, r.blockLen = i, r.outputLen = s, r.oHash = t._cloneInto(r.oHash), r.iHash = o._cloneInto(r.iHash), r;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = true, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  const Bi = (e, r, t) => new Li(e, r).update(t).digest();
  Bi.create = (e, r) => new Li(e, r);
  const Qd = vc;
  function Zd(e) {
    return Wn(ue(e));
  }
  function un(e, r) {
    return Bi(Qd, e, r);
  }
  const L = (e) => zc(e);
  function ef(e) {
    if (oe(e.isPoint(L("0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"))), oe(!e.isPoint(L("030000000000000000000000000000000000000000000000000000000000000005"))), oe(e.isPrivate(L("79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"))), oe(e.isPrivate(L("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140"))), oe(!e.isPrivate(L("0000000000000000000000000000000000000000000000000000000000000000"))), oe(!e.isPrivate(L("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"))), oe(!e.isPrivate(L("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364142"))), oe(We(e.pointFromScalar(L("b1121e4088a66a28f5b6b0f5844943ecd9f610196d7bb83b25214b60452c09af")), L("02b07ba9dca9523b7ef4bd97703d43d20399eb698e194704791a25ce77a400df99")) === 0), e.xOnlyPointAddTweak) {
      oe(e.xOnlyPointAddTweak(L("79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"), L("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140")) === null);
      let r = e.xOnlyPointAddTweak(L("1617d38ed8d8657da4d4761e8057bc396ea9e4b9d29776d4be096016dbd2509b"), L("a8397a935f0dfceba6ba9618f6451ef4d80637abf4e6af2669fbc9de6a8fd2ac"));
      oe(We(r.xOnlyPubkey, L("e478f99dab91052ab39a33ea35fd5e6e4933f4d28023cd597c9a1f6760346adf")) === 0 && r.parity === 1), r = e.xOnlyPointAddTweak(L("2c0b7cf95324a07d05398b240174dc0c2be444d96b159aa6c7f7b1e668680991"), L("823c3cd2142744b075a87eade7e1b8678ba308d566226a0056ca2b7a76f86b47"));
    }
    oe(We(e.pointAddScalar(L("0379be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"), L("0000000000000000000000000000000000000000000000000000000000000003")), L("02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5")) === 0), oe(We(e.privateAdd(L("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd036413e"), L("0000000000000000000000000000000000000000000000000000000000000002")), L("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140")) === 0), e.privateNegate && (oe(We(e.privateNegate(L("0000000000000000000000000000000000000000000000000000000000000001")), L("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140")) === 0), oe(We(e.privateNegate(L("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd036413e")), L("0000000000000000000000000000000000000000000000000000000000000003")) === 0), oe(We(e.privateNegate(L("b1121e4088a66a28f5b6b0f5844943ecd9f610196d7bb83b25214b60452c09af")), L("4eede1bf775995d70a494f0a7bb6bc11e0b8cccd41cce8009ab1132c8b0a3792")) === 0)), oe(We(e.sign(L("5e9f0a0d593efdcf78ac923bc3313e4e7d408d574354ee2b3288c0da9fbba6ed"), L("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140")), L("54c4a33c6423d689378f160a7ff8b61330444abb58fb470f96ea16d99d4a2fed07082304410efa6b2943111b6a4e0aaa7b7db55a07e9861d1fb3cb1f421044a5")) === 0), oe(e.verify(L("5e9f0a0d593efdcf78ac923bc3313e4e7d408d574354ee2b3288c0da9fbba6ed"), L("0379be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"), L("54c4a33c6423d689378f160a7ff8b61330444abb58fb470f96ea16d99d4a2fed07082304410efa6b2943111b6a4e0aaa7b7db55a07e9861d1fb3cb1f421044a5"))), e.signSchnorr && oe(We(e.signSchnorr(L("7e2d58d8b3bcdf1abadec7829054f90dda9805aab56c77333024b9d0a508b75c"), L("c90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b14e5c9"), L("c87aa53824b4d7ae2eb035a2b5bbbccc080e76cdc6d1692c4b0b62d798e6d906")), L("5831aaeed7b44bb74e5eab94ba9d4294c49bcf2a60728d8b4c200f50dd313c1bab745879a5ad954a72c45a91c3a51d3c7adea98d82f8481e0e1e03674a6f3fb7")) === 0), e.verifySchnorr && oe(e.verifySchnorr(L("7e2d58d8b3bcdf1abadec7829054f90dda9805aab56c77333024b9d0a508b75c"), L("dd308afec5777e13121fa72b9cc1b7cc0139715309b086c960e18fd969774eb8"), L("5831aaeed7b44bb74e5eab94ba9d4294c49bcf2a60728d8b4c200f50dd313c1bab745879a5ad954a72c45a91c3a51d3c7adea98d82f8481e0e1e03674a6f3fb7")));
  }
  function oe(e) {
    if (!e) throw new Error("ecc library invalid");
  }
  function Ho(e) {
    return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
  }
  function Di(e, r) {
    return Array.isArray(r) ? r.length === 0 ? true : e ? r.every((t) => typeof t == "string") : r.every((t) => Number.isSafeInteger(t)) : false;
  }
  function rf(e) {
    if (typeof e != "function") throw new Error("function expected");
    return true;
  }
  function Po(e, r) {
    if (typeof r != "string") throw new Error(`${e}: string expected`);
    return true;
  }
  function Zo(e) {
    if (!Number.isSafeInteger(e)) throw new Error(`invalid integer: ${e}`);
  }
  function No(e) {
    if (!Array.isArray(e)) throw new Error("array expected");
  }
  function Fi(e, r) {
    if (!Di(true, r)) throw new Error(`${e}: array of strings expected`);
  }
  function tf(e, r) {
    if (!Di(false, r)) throw new Error(`${e}: array of numbers expected`);
  }
  function Ki(...e) {
    const r = (n) => n, t = (n, i) => (s) => n(i(s)), o = e.map((n) => n.encode).reduceRight(t, r), a = e.map((n) => n.decode).reduce(t, r);
    return {
      encode: o,
      decode: a
    };
  }
  function of(e) {
    const r = typeof e == "string" ? e.split("") : e, t = r.length;
    Fi("alphabet", r);
    const o = new Map(r.map((a, n) => [
      a,
      n
    ]));
    return {
      encode: (a) => (No(a), a.map((n) => {
        if (!Number.isSafeInteger(n) || n < 0 || n >= t) throw new Error(`alphabet.encode: digit index outside alphabet "${n}". Allowed: ${e}`);
        return r[n];
      })),
      decode: (a) => (No(a), a.map((n) => {
        Po("alphabet.decode", n);
        const i = o.get(n);
        if (i === void 0) throw new Error(`Unknown letter: "${n}". Allowed: ${e}`);
        return i;
      }))
    };
  }
  function af(e = "") {
    return Po("join", e), {
      encode: (r) => (Fi("join.decode", r), r.join(e)),
      decode: (r) => (Po("join.decode", r), r.split(e))
    };
  }
  function ln(e, r, t) {
    if (r < 2) throw new Error(`convertRadix: invalid from=${r}, base cannot be less than 2`);
    if (t < 2) throw new Error(`convertRadix: invalid to=${t}, base cannot be less than 2`);
    if (No(e), !e.length) return [];
    let o = 0;
    const a = [], n = Array.from(e, (s) => {
      if (Zo(s), s < 0 || s >= r) throw new Error(`invalid integer: ${s}`);
      return s;
    }), i = n.length;
    for (; ; ) {
      let s = 0, u = true;
      for (let c = o; c < i; c++) {
        const d = n[c], l = r * s, f = l + d;
        if (!Number.isSafeInteger(f) || l / r !== s || f - d !== l) throw new Error("convertRadix: carry overflow");
        const p = f / t;
        s = f % t;
        const h = Math.floor(p);
        if (n[c] = h, !Number.isSafeInteger(h) || h * t + s !== f) throw new Error("convertRadix: carry overflow");
        if (u) h ? u = false : o = c;
        else continue;
      }
      if (a.push(s), u) break;
    }
    for (let s = 0; s < e.length - 1 && e[s] === 0; s++) a.push(0);
    return a.reverse();
  }
  function nf(e) {
    Zo(e);
    const r = 2 ** 8;
    return {
      encode: (t) => {
        if (!Ho(t)) throw new Error("radix.encode input should be Uint8Array");
        return ln(Array.from(t), r, e);
      },
      decode: (t) => (tf("radix.decode", t), Uint8Array.from(ln(t, e, r)))
    };
  }
  function sf(e, r) {
    return Zo(e), rf(r), {
      encode(t) {
        if (!Ho(t)) throw new Error("checksum.encode: input should be Uint8Array");
        const o = r(t).slice(0, e), a = new Uint8Array(t.length + e);
        return a.set(t), a.set(o, t.length), a;
      },
      decode(t) {
        if (!Ho(t)) throw new Error("checksum.decode: input should be Uint8Array");
        const o = t.slice(0, -e), a = t.slice(-e), n = r(o).slice(0, e);
        for (let i = 0; i < e; i++) if (n[i] !== a[i]) throw new Error("Invalid checksum");
        return o;
      }
    };
  }
  const cf = (e) => Ki(nf(58), of(e), af("")), uf = cf("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"), lf = (e) => Ki(sf(4, (r) => e(e(r))), uf), df = lf;
  var wo;
  function ff(e) {
    return {
      lang: (e == null ? void 0 : e.lang) ?? (wo == null ? void 0 : wo.lang),
      message: e == null ? void 0 : e.message,
      abortEarly: (e == null ? void 0 : e.abortEarly) ?? (wo == null ? void 0 : wo.abortEarly),
      abortPipeEarly: (e == null ? void 0 : e.abortPipeEarly) ?? (wo == null ? void 0 : wo.abortPipeEarly)
    };
  }
  var hf;
  function pf(e) {
    return hf == null ? void 0 : hf.get(e);
  }
  var mf;
  function gf(e) {
    return mf == null ? void 0 : mf.get(e);
  }
  var bf;
  function yf(e, r) {
    var _a2;
    return (_a2 = bf == null ? void 0 : bf.get(e)) == null ? void 0 : _a2.get(r);
  }
  function Gr(e) {
    var _a2, _b;
    const r = typeof e;
    return r === "string" ? `"${e}"` : r === "number" || r === "bigint" || r === "boolean" ? `${e}` : r === "object" || r === "function" ? (e && ((_b = (_a2 = Object.getPrototypeOf(e)) == null ? void 0 : _a2.constructor) == null ? void 0 : _b.name)) ?? "null" : r;
  }
  function rr(e, r, t, o, a) {
    const n = a && "input" in a ? a.input : t.value, i = (a == null ? void 0 : a.expected) ?? e.expects ?? null, s = (a == null ? void 0 : a.received) ?? Gr(n), u = {
      kind: e.kind,
      type: e.type,
      input: n,
      expected: i,
      received: s,
      message: `Invalid ${r}: ${i ? `Expected ${i} but r` : "R"}eceived ${s}`,
      requirement: e.requirement,
      path: a == null ? void 0 : a.path,
      issues: a == null ? void 0 : a.issues,
      lang: o.lang,
      abortEarly: o.abortEarly,
      abortPipeEarly: o.abortPipeEarly
    }, c = e.kind === "schema", d = (a == null ? void 0 : a.message) ?? e.message ?? yf(e.reference, u.lang) ?? (c ? gf(u.lang) : null) ?? o.message ?? pf(u.lang);
    d && (u.message = typeof d == "function" ? d(u) : d), c && (t.typed = false), t.issues ? t.issues.push(u) : t.issues = [
      u
    ];
  }
  var vf = class extends Error {
    constructor(e) {
      super(e[0].message);
      __publicField(this, "issues");
      this.name = "ValiError", this.issues = e;
    }
  };
  function Xt(e) {
    return {
      kind: "validation",
      type: "integer",
      reference: Xt,
      async: false,
      expects: null,
      requirement: Number.isInteger,
      message: e,
      _run(r, t) {
        return r.typed && !this.requirement(r.value) && rr(this, "integer", r, t), r;
      }
    };
  }
  function ea(e, r) {
    return {
      kind: "validation",
      type: "length",
      reference: ea,
      async: false,
      expects: `${e}`,
      requirement: e,
      message: r,
      _run(t, o) {
        return t.typed && t.value.length !== this.requirement && rr(this, "length", t, o, {
          received: `${t.value.length}`
        }), t;
      }
    };
  }
  function Yt(e, r) {
    return {
      kind: "validation",
      type: "max_value",
      reference: Yt,
      async: false,
      expects: `<=${e instanceof Date ? e.toJSON() : Gr(e)}`,
      requirement: e,
      message: r,
      _run(t, o) {
        return t.typed && t.value > this.requirement && rr(this, "value", t, o, {
          received: t.value instanceof Date ? t.value.toJSON() : Gr(t.value)
        }), t;
      }
    };
  }
  function Jt(e, r) {
    return {
      kind: "validation",
      type: "min_value",
      reference: Jt,
      async: false,
      expects: `>=${e instanceof Date ? e.toJSON() : Gr(e)}`,
      requirement: e,
      message: r,
      _run(t, o) {
        return t.typed && t.value < this.requirement && rr(this, "value", t, o, {
          received: t.value instanceof Date ? t.value.toJSON() : Gr(t.value)
        }), t;
      }
    };
  }
  function Vi(e, r) {
    return {
      kind: "validation",
      type: "regex",
      reference: Vi,
      async: false,
      expects: `${e}`,
      requirement: e,
      message: r,
      _run(t, o) {
        return t.typed && !this.requirement.test(t.value) && rr(this, "format", t, o), t;
      }
    };
  }
  function Qt(e, r) {
    return {
      kind: "schema",
      type: "instance",
      reference: Qt,
      expects: e.name,
      async: false,
      class: e,
      message: r,
      _run(t, o) {
        return t.value instanceof this.class ? t.typed = true : rr(this, "type", t, o), t;
      }
    };
  }
  function Zt(e) {
    return {
      kind: "schema",
      type: "number",
      reference: Zt,
      expects: "number",
      async: false,
      message: e,
      _run(r, t) {
        return typeof r.value == "number" && !isNaN(r.value) ? r.typed = true : rr(this, "type", r, t), r;
      }
    };
  }
  function Oo(e, r) {
    return {
      kind: "schema",
      type: "object",
      reference: Oo,
      expects: "Object",
      async: false,
      entries: e,
      message: r,
      _run(t, o) {
        var _a2;
        const a = t.value;
        if (a && typeof a == "object") {
          t.typed = true, t.value = {};
          for (const n in this.entries) {
            const i = a[n], s = this.entries[n]._run({
              typed: false,
              value: i
            }, o);
            if (s.issues) {
              const u = {
                type: "object",
                origin: "value",
                input: a,
                key: n,
                value: i
              };
              for (const c of s.issues) c.path ? c.path.unshift(u) : c.path = [
                u
              ], (_a2 = t.issues) == null ? void 0 : _a2.push(c);
              if (t.issues || (t.issues = s.issues), o.abortEarly) {
                t.typed = false;
                break;
              }
            }
            s.typed || (t.typed = false), (s.value !== void 0 || n in a) && (t.value[n] = s.value);
          }
        } else rr(this, "type", t, o);
        return t;
      }
    };
  }
  function Mi(e) {
    return {
      kind: "schema",
      type: "string",
      reference: Mi,
      expects: "string",
      async: false,
      message: e,
      _run(r, t) {
        return typeof r.value == "string" ? r.typed = true : rr(this, "type", r, t), r;
      }
    };
  }
  function Xe(e, r, t) {
    const o = e._run({
      typed: false,
      value: r
    }, ff(t));
    if (o.issues) throw new vf(o.issues);
    return o.value;
  }
  function Or(...e) {
    return {
      ...e[0],
      pipe: e,
      _run(r, t) {
        for (const o of e) if (o.kind !== "metadata") {
          if (r.issues && (o.kind === "schema" || o.kind === "transformation")) {
            r.typed = false;
            break;
          }
          (!r.issues || !t.abortEarly && !t.abortPipeEarly) && (r = o._run(r, t));
        }
        return r;
      }
    };
  }
  const jo = Or(Zt(), Xt(), Jt(0), Yt(4294967295)), wf = Or(Zt(), Xt(), Jt(0), Yt(2147483647)), kf = Or(Zt(), Xt(), Jt(0), Yt(255)), ko = Or(Qt(Uint8Array), ea(32)), _f = Or(Qt(Uint8Array), ea(33)), Ef = Oo({
    wif: kf,
    bip32: Oo({
      public: jo,
      private: jo
    })
  }), xf = Or(Mi(), Vi(/^(m\/)?(\d+'?\/)*\d+'?$/));
  function Af(e, r, t) {
    if (r.length !== 32) throw new TypeError("Invalid privateKey length");
    var o = new Uint8Array(34), a = new DataView(o.buffer);
    return a.setUint8(0, e), o.set(r, 1), o[33] = 1, o;
  }
  function Sf(e) {
    return Ur.encode(Af(e.version, e.privateKey));
  }
  const dn = df(ue), fn = {
    encode: (e) => dn.encode(e),
    decode: (e) => dn.decode(e)
  };
  ep = function(e) {
    ef(e);
    const r = {
      messagePrefix: `Bitcoin Signed Message:
`,
      bech32: "bc",
      bip32: {
        public: 76067358,
        private: 76066276
      },
      pubKeyHash: 0,
      scriptHash: 5,
      wif: 128
    }, t = 2147483648;
    function o(f) {
      return f.length === 32 ? f : f.slice(1, 33);
    }
    class a {
      constructor(p, h) {
        __publicField(this, "__D");
        __publicField(this, "__Q");
        __publicField(this, "lowR", false);
        this.__D = p, this.__Q = h;
      }
      get publicKey() {
        return this.__Q === void 0 && (this.__Q = e.pointFromScalar(this.__D, true)), this.__Q;
      }
      get privateKey() {
        return this.__D;
      }
      sign(p, h) {
        if (!this.privateKey) throw new Error("Missing private key");
        if (h === void 0 && (h = this.lowR), h === false) return e.sign(p, this.privateKey);
        {
          let m = e.sign(p, this.privateKey);
          const v = new Uint8Array(32);
          let E = 0;
          for (; m[0] > 127; ) E++, br(v, 0, E, "LE"), m = e.sign(p, this.privateKey, v);
          return m;
        }
      }
      signSchnorr(p) {
        if (!this.privateKey) throw new Error("Missing private key");
        if (!e.signSchnorr) throw new Error("signSchnorr not supported by ecc library");
        return e.signSchnorr(p, this.privateKey);
      }
      verify(p, h) {
        return e.verify(p, this.publicKey, h);
      }
      verifySchnorr(p, h) {
        if (!e.verifySchnorr) throw new Error("verifySchnorr not supported by ecc library");
        return e.verifySchnorr(p, this.publicKey.subarray(1, 33), h);
      }
    }
    class n extends a {
      constructor(p, h, m, v, E = 0, A = 0, y = 0) {
        super(p, h);
        __publicField(this, "chainCode");
        __publicField(this, "network");
        __publicField(this, "__DEPTH");
        __publicField(this, "__INDEX");
        __publicField(this, "__PARENT_FINGERPRINT");
        this.chainCode = m, this.network = v, this.__DEPTH = E, this.__INDEX = A, this.__PARENT_FINGERPRINT = y, Xe(Ef, v);
      }
      get depth() {
        return this.__DEPTH;
      }
      get index() {
        return this.__INDEX;
      }
      get parentFingerprint() {
        return this.__PARENT_FINGERPRINT;
      }
      get identifier() {
        return Zd(this.publicKey);
      }
      get fingerprint() {
        return this.identifier.slice(0, 4);
      }
      get compressed() {
        return true;
      }
      isNeutered() {
        return this.__D === void 0;
      }
      neutered() {
        return d(this.publicKey, this.chainCode, this.network, this.depth, this.index, this.parentFingerprint);
      }
      toBase58() {
        const p = this.network, h = this.isNeutered() ? p.bip32.public : p.bip32.private, m = new Uint8Array(78);
        return br(m, 0, h, "BE"), Ta(m, 4, this.depth), br(m, 5, this.parentFingerprint, "BE"), br(m, 9, this.index, "BE"), m.set(this.chainCode, 13), this.isNeutered() ? m.set(this.publicKey, 45) : (Ta(m, 45, 0), m.set(this.privateKey, 46)), fn.encode(m);
      }
      toWIF() {
        if (!this.privateKey) throw new TypeError("Missing private key");
        return Sf({
          version: this.network.wif,
          privateKey: this.privateKey
        });
      }
      derive(p) {
        Xe(jo, p);
        const h = p >= t, m = new Uint8Array(37);
        if (h) {
          if (this.isNeutered()) throw new TypeError("Missing private key for hardened child key");
          m[0] = 0, m.set(this.privateKey, 1), br(m, 33, p, "BE");
        } else m.set(this.publicKey, 0), br(m, 33, p, "BE");
        const v = un(this.chainCode, m), E = v.slice(0, 32), A = v.slice(32);
        if (!e.isPrivate(E)) return this.derive(p + 1);
        let y;
        if (this.isNeutered()) {
          const k = e.pointAddScalar(this.publicKey, E, true);
          if (k === null) return this.derive(p + 1);
          y = d(k, A, this.network, this.depth + 1, p, Tr(this.fingerprint, 0, "BE"));
        } else {
          const k = e.privateAdd(this.privateKey, E);
          if (k == null) return this.derive(p + 1);
          y = u(k, A, this.network, this.depth + 1, p, Tr(this.fingerprint, 0, "BE"));
        }
        return y;
      }
      deriveHardened(p) {
        if (typeof Xe(wf, p) == "number") return this.derive(p + t);
        throw new TypeError("Expected UInt31, got " + p);
      }
      derivePath(p) {
        Xe(xf, p);
        let h = p.split("/");
        if (h[0] === "m") {
          if (this.parentFingerprint) throw new TypeError("Expected master, got child");
          h = h.slice(1);
        }
        return h.reduce((m, v) => {
          let E;
          return v.slice(-1) === "'" ? (E = parseInt(v.slice(0, -1), 10), m.deriveHardened(E)) : (E = parseInt(v, 10), m.derive(E));
        }, this);
      }
      tweak(p) {
        return this.privateKey ? this.tweakFromPrivateKey(p) : this.tweakFromPublicKey(p);
      }
      tweakFromPublicKey(p) {
        const h = o(this.publicKey);
        if (!e.xOnlyPointAddTweak) throw new Error("xOnlyPointAddTweak not supported by ecc library");
        const m = e.xOnlyPointAddTweak(h, p);
        if (!m || m.xOnlyPubkey === null) throw new Error("Cannot tweak public key!");
        const v = Uint8Array.from([
          m.parity === 0 ? 2 : 3
        ]), E = Tc([
          v,
          m.xOnlyPubkey
        ]);
        return new a(void 0, E);
      }
      tweakFromPrivateKey(p) {
        const h = this.publicKey[0] === 3 || this.publicKey[0] === 4 && (this.publicKey[64] & 1) === 1, m = (() => {
          if (h) {
            if (e.privateNegate) return e.privateNegate(this.privateKey);
            throw new Error("privateNegate not supported by ecc library");
          } else return this.privateKey;
        })(), v = e.privateAdd(m, p);
        if (!v) throw new Error("Invalid tweaked private key!");
        return new a(v, void 0);
      }
    }
    function i(f, p) {
      const h = fn.decode(f);
      if (h.length !== 78) throw new TypeError("Invalid buffer length");
      p = p || r;
      const m = Tr(h, 0, "BE");
      if (m !== p.bip32.private && m !== p.bip32.public) throw new TypeError("Invalid network version");
      const v = h[4], E = Tr(h, 5, "BE");
      if (v === 0 && E !== 0) throw new TypeError("Invalid parent fingerprint");
      const A = Tr(h, 9, "BE");
      if (v === 0 && A !== 0) throw new TypeError("Invalid index");
      const y = h.slice(13, 45);
      let k;
      if (m === p.bip32.private) {
        if (h[45] !== 0) throw new TypeError("Invalid private key");
        const _ = h.slice(46, 78);
        k = u(_, y, p, v, A, E);
      } else {
        const _ = h.slice(45, 78);
        k = d(_, y, p, v, A, E);
      }
      return k;
    }
    function s(f, p, h) {
      return u(f, p, h);
    }
    function u(f, p, h, m, v, E) {
      if (Xe(ko, f), Xe(ko, p), h = h || r, !e.isPrivate(f)) throw new TypeError("Private key not in range [1, n)");
      return new n(f, void 0, p, h, m, v, E);
    }
    function c(f, p, h) {
      return d(f, p, h);
    }
    function d(f, p, h, m, v, E) {
      if (Xe(_f, f), Xe(ko, p), h = h || r, !e.isPoint(f)) throw new TypeError("Point is not on the curve");
      return new n(void 0, f, p, h, m, v, E);
    }
    function l(f, p) {
      if (Xe(Qt(Uint8Array), f), f.length < 16) throw new TypeError("Seed should be at least 128 bits");
      if (f.length > 64) throw new TypeError("Seed should be at most 512 bits");
      p = p || r;
      const h = un(Ic("Bitcoin seed"), f), m = h.slice(0, 32), v = h.slice(32);
      return s(m, v, p);
    }
    return {
      fromSeed: l,
      fromBase58: i,
      fromPublicKey: c,
      fromPrivateKey: s
    };
  };
  const $i = "0123456789abcdefABCDEF";
  $i.split("").map((e) => e.codePointAt(0));
  Array(256).fill(true).map((e, r) => {
    const t = String.fromCodePoint(r), o = $i.indexOf(t);
    return o < 0 ? void 0 : o < 16 ? o : o - 6;
  });
  new TextEncoder();
  new TextDecoder("ascii");
  function If(e, r) {
    const t = Math.min(e.length, r.length);
    for (let o = 0; o < t; ++o) if (e[o] !== r[o]) return e[o] < r[o] ? -1 : 1;
    return e.length === r.length ? 0 : e.length > r.length ? 1 : -1;
  }
  const qi = 0, ra = 1, Gi = 2, Wi = 3, Wr = 4, Xi = 5, Yi = 6, Ji = 7, Tf = {
    [qi.toString()]: "Expected Private",
    [ra.toString()]: "Expected Point",
    [Gi.toString()]: "Expected Tweak",
    [Wi.toString()]: "Expected Hash",
    [Wr.toString()]: "Expected Signature",
    [Xi.toString()]: "Expected Extra Data (32 bytes)",
    [Yi.toString()]: "Expected Parity (1 | 0)",
    [Ji.toString()]: "Bad Recovery Id"
  };
  function xe(e) {
    const r = Tf[e.toString()] || `Unknow error code: ${e}`;
    throw new TypeError(r);
  }
  const tt = 32, Xr = 33, ot = 65, hr = 32, Qi = 32, Zi = 32, es = 32, eo = 64, rs = new Uint8Array(32), Nt = new Uint8Array([
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    254,
    186,
    174,
    220,
    230,
    175,
    72,
    160,
    59,
    191,
    210,
    94,
    140,
    208,
    54,
    65,
    65
  ]), zf = new Uint8Array([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    69,
    81,
    35,
    25,
    80,
    183,
    95,
    196,
    64,
    45,
    161,
    114,
    47,
    201,
    186,
    238
  ]);
  function qe(e) {
    return e instanceof Uint8Array;
  }
  function vr(e, r) {
    for (let t = 0; t < 32; ++t) if (e[t] !== r[t]) return e[t] < r[t] ? -1 : 1;
    return 0;
  }
  function Co(e) {
    return vr(e, rs) === 0;
  }
  function ts(e) {
    return qe(e) && e.length === tt && vr(e, rs) > 0 && vr(e, Nt) < 0;
  }
  function Uf(e) {
    return qe(e) && (e.length === Xr || e.length === ot || e.length === hr);
  }
  function os(e) {
    return qe(e) && e.length === hr;
  }
  function Hf(e) {
    return qe(e) && (e.length === Xr || e.length === ot);
  }
  function Pf(e) {
    return qe(e) && e.length === Xr;
  }
  function Nf(e) {
    return qe(e) && e.length === Qi && vr(e, Nt) < 0;
  }
  function Of(e) {
    return qe(e) && e.length === Zi;
  }
  function jf(e) {
    return e === void 0 || qe(e) && e.length === es;
  }
  function Cf(e) {
    return qe(e) && e.length === 64 && vr(e.subarray(0, 32), Nt) < 0 && vr(e.subarray(32, 64), Nt) < 0;
  }
  function Rf(e) {
    return qe(e) && e.length === 64 && vr(e.subarray(0, 32), zf) < 0;
  }
  function Lf(e) {
    e !== 0 && e !== 1 && xe(Yi);
  }
  function pr(e) {
    ts(e) || xe(qi);
  }
  function wr(e) {
    Uf(e) || xe(ra);
  }
  function Ot(e) {
    os(e) || xe(ra);
  }
  function jr(e) {
    Nf(e) || xe(Gi);
  }
  function Cr(e) {
    Of(e) || xe(Wi);
  }
  function ta(e) {
    jf(e) || xe(Xi);
  }
  function oa(e) {
    Cf(e) || xe(Wr);
  }
  function Bf(e) {
    e() || xe(Wr);
  }
  function Df(e) {
    Co(e.subarray(0, 32)) && xe(Wr), Co(e.subarray(32, 64)) && xe(Wr);
  }
  function Ff(e) {
    Rf(e) || xe(Ji);
  }
  const Kf = "" + new URL("secp256k1-Cao5Swmf.wasm", import.meta.url).href, Vf = async (e = {}, r) => {
    let t;
    if (r.startsWith("data:")) {
      const o = r.replace(/^data:.*?base64,/, "");
      let a;
      if (typeof ke == "function" && typeof ke.from == "function") a = ke.from(o, "base64");
      else if (typeof atob == "function") {
        const n = atob(o);
        a = new Uint8Array(n.length);
        for (let i = 0; i < n.length; i++) a[i] = n.charCodeAt(i);
      } else throw new Error("Cannot decode base64-encoded data URL");
      t = await WebAssembly.instantiate(a, e);
    } else {
      const o = await fetch(r), a = o.headers.get("Content-Type") || "";
      if ("instantiateStreaming" in WebAssembly && a.startsWith("application/wasm")) t = await WebAssembly.instantiateStreaming(o, e);
      else {
        const n = await o.arrayBuffer();
        t = await WebAssembly.instantiate(n, e);
      }
    }
    return t.instance.exports;
  };
  function Mf() {
    const e = new Uint8Array(4);
    if (typeof crypto > "u") throw new Error("The crypto object is unavailable. This may occur if your environment does not support the Web Cryptography API.");
    return crypto.getRandomValues(e), e;
  }
  function $f() {
    const e = Mf();
    return (e[0] << 24) + (e[1] << 16) + (e[2] << 8) + e[3];
  }
  URL = globalThis.URL;
  const F = await Vf({
    "./rand.js": {
      generateInt32: $f
    },
    "./validate_error.js": {
      throwError: xe
    }
  }, Kf), qf = F.memory, Gf = F.initializeContext, Wf = F.isPoint, Xf = F.PUBLIC_KEY_INPUT, Yf = F.pointAdd, Jf = F.PUBLIC_KEY_INPUT2, Qf = F.pointAddScalar, Zf = F.TWEAK_INPUT, eh = F.xOnlyPointAddTweak, rh = F.X_ONLY_PUBLIC_KEY_INPUT, th = F.xOnlyPointAddTweakCheck, oh = F.X_ONLY_PUBLIC_KEY_INPUT2, ah = F.pointCompress, nh = F.pointFromScalar, ih = F.PRIVATE_INPUT, sh = F.xOnlyPointFromScalar, ch = F.xOnlyPointFromPoint, uh = F.pointMultiply, lh = F.privateAdd, dh = F.privateSub, fh = F.privateNegate, hh = F.sign, ph = F.HASH_INPUT, mh = F.EXTRA_DATA_INPUT, gh = F.SIGNATURE_INPUT, bh = F.signRecoverable, yh = F.signSchnorr, vh = F.verify, wh = F.recover, kh = F.verifySchnorr, _h = F.rustsecp256k1_v0_8_1_default_error_callback_fn, Eh = F.rustsecp256k1_v0_8_1_default_illegal_callback_fn, xh = F.__data_end, Ah = F.__heap_base, V = Object.freeze(Object.defineProperty({
    __proto__: null,
    EXTRA_DATA_INPUT: mh,
    HASH_INPUT: ph,
    PRIVATE_INPUT: ih,
    PUBLIC_KEY_INPUT: Xf,
    PUBLIC_KEY_INPUT2: Jf,
    SIGNATURE_INPUT: gh,
    TWEAK_INPUT: Zf,
    X_ONLY_PUBLIC_KEY_INPUT: rh,
    X_ONLY_PUBLIC_KEY_INPUT2: oh,
    __data_end: xh,
    __heap_base: Ah,
    initializeContext: Gf,
    isPoint: Wf,
    memory: qf,
    pointAdd: Yf,
    pointAddScalar: Qf,
    pointCompress: ah,
    pointFromScalar: nh,
    pointMultiply: uh,
    privateAdd: lh,
    privateNegate: fh,
    privateSub: dh,
    recover: wh,
    rustsecp256k1_v0_8_1_default_error_callback_fn: _h,
    rustsecp256k1_v0_8_1_default_illegal_callback_fn: Eh,
    sign: hh,
    signRecoverable: bh,
    signSchnorr: yh,
    verify: vh,
    verifySchnorr: kh,
    xOnlyPointAddTweak: eh,
    xOnlyPointAddTweakCheck: th,
    xOnlyPointFromPoint: ch,
    xOnlyPointFromScalar: sh
  }, Symbol.toStringTag, {
    value: "Module"
  })), tr = new Uint8Array(V.memory.buffer), hn = V.PRIVATE_INPUT.value, pn = V.PUBLIC_KEY_INPUT.value, mn = V.PUBLIC_KEY_INPUT2.value, gn = V.X_ONLY_PUBLIC_KEY_INPUT.value, bn = V.X_ONLY_PUBLIC_KEY_INPUT2.value, yn = V.TWEAK_INPUT.value, vn = V.HASH_INPUT.value, wn = V.EXTRA_DATA_INPUT.value, kn = V.SIGNATURE_INPUT.value, ie = tr.subarray(hn, hn + tt), Q = tr.subarray(pn, pn + ot), _n = tr.subarray(mn, mn + ot), ze = tr.subarray(gn, gn + hr), En = tr.subarray(bn, bn + hr), He = tr.subarray(yn, yn + Qi), Pe = tr.subarray(vn, vn + Zi), Hr = tr.subarray(wn, wn + es), Ne = tr.subarray(kn, kn + eo);
  function Rr(e, r) {
    return e === void 0 ? r !== void 0 ? r.length : Xr : e ? Xr : ot;
  }
  function aa(e) {
    try {
      return Q.set(e), V.isPoint(e.length) === 1;
    } finally {
      Q.fill(0);
    }
  }
  function Sh() {
    V.initializeContext();
  }
  function Ih(e) {
    return Hf(e) && aa(e);
  }
  function Th(e) {
    return Pf(e) && aa(e);
  }
  function as(e) {
    return os(e) && aa(e);
  }
  function zh(e) {
    return ts(e);
  }
  function Uh(e, r, t) {
    wr(e), wr(r);
    const o = Rr(t, e);
    try {
      return Q.set(e), _n.set(r), V.pointAdd(e.length, r.length, o) === 1 ? Q.slice(0, o) : null;
    } finally {
      Q.fill(0), _n.fill(0);
    }
  }
  function Hh(e, r, t) {
    wr(e), jr(r);
    const o = Rr(t, e);
    try {
      return Q.set(e), He.set(r), V.pointAddScalar(e.length, o) === 1 ? Q.slice(0, o) : null;
    } finally {
      Q.fill(0), He.fill(0);
    }
  }
  function Ph(e, r) {
    wr(e);
    const t = Rr(r, e);
    try {
      return Q.set(e), V.pointCompress(e.length, t), Q.slice(0, t);
    } finally {
      Q.fill(0);
    }
  }
  function Nh(e, r) {
    pr(e);
    const t = Rr(r);
    try {
      return ie.set(e), V.pointFromScalar(t) === 1 ? Q.slice(0, t) : null;
    } finally {
      ie.fill(0), Q.fill(0);
    }
  }
  function Oh(e) {
    pr(e);
    try {
      return ie.set(e), V.xOnlyPointFromScalar(), ze.slice(0, hr);
    } finally {
      ie.fill(0), ze.fill(0);
    }
  }
  function jh(e) {
    wr(e);
    try {
      return Q.set(e), V.xOnlyPointFromPoint(e.length), ze.slice(0, hr);
    } finally {
      Q.fill(0), ze.fill(0);
    }
  }
  function Ch(e, r, t) {
    wr(e), jr(r);
    const o = Rr(t, e);
    try {
      return Q.set(e), He.set(r), V.pointMultiply(e.length, o) === 1 ? Q.slice(0, o) : null;
    } finally {
      Q.fill(0), He.fill(0);
    }
  }
  function Rh(e, r) {
    pr(e), jr(r);
    try {
      return ie.set(e), He.set(r), V.privateAdd() === 1 ? ie.slice(0, tt) : null;
    } finally {
      ie.fill(0), He.fill(0);
    }
  }
  function Lh(e, r) {
    if (pr(e), jr(r), Co(r)) return new Uint8Array(e);
    try {
      return ie.set(e), He.set(r), V.privateSub() === 1 ? ie.slice(0, tt) : null;
    } finally {
      ie.fill(0), He.fill(0);
    }
  }
  function Bh(e) {
    pr(e);
    try {
      return ie.set(e), V.privateNegate(), ie.slice(0, tt);
    } finally {
      ie.fill(0);
    }
  }
  function Dh(e, r) {
    Ot(e), jr(r);
    try {
      ze.set(e), He.set(r);
      const t = V.xOnlyPointAddTweak();
      return t !== -1 ? {
        parity: t,
        xOnlyPubkey: ze.slice(0, hr)
      } : null;
    } finally {
      ze.fill(0), He.fill(0);
    }
  }
  function Fh(e, r, t, o) {
    Ot(e), Ot(t), jr(r);
    const a = o !== void 0;
    a && Lf(o);
    try {
      if (ze.set(e), En.set(t), He.set(r), a) return V.xOnlyPointAddTweakCheck(o) === 1;
      {
        V.xOnlyPointAddTweak();
        const n = ze.slice(0, hr);
        return If(n, t) === 0;
      }
    } finally {
      ze.fill(0), En.fill(0), He.fill(0);
    }
  }
  function Kh(e, r, t) {
    Cr(e), pr(r), ta(t);
    try {
      return Pe.set(e), ie.set(r), t !== void 0 && Hr.set(t), V.sign(t === void 0 ? 0 : 1), Ne.slice(0, eo);
    } finally {
      Pe.fill(0), ie.fill(0), t !== void 0 && Hr.fill(0), Ne.fill(0);
    }
  }
  function Vh(e, r, t) {
    Cr(e), pr(r), ta(t);
    try {
      Pe.set(e), ie.set(r), t !== void 0 && Hr.set(t);
      const o = V.signRecoverable(t === void 0 ? 0 : 1);
      return {
        signature: Ne.slice(0, eo),
        recoveryId: o
      };
    } finally {
      Pe.fill(0), ie.fill(0), t !== void 0 && Hr.fill(0), Ne.fill(0);
    }
  }
  function Mh(e, r, t) {
    Cr(e), pr(r), ta(t);
    try {
      return Pe.set(e), ie.set(r), t !== void 0 && Hr.set(t), V.signSchnorr(t === void 0 ? 0 : 1), Ne.slice(0, eo);
    } finally {
      Pe.fill(0), ie.fill(0), t !== void 0 && Hr.fill(0), Ne.fill(0);
    }
  }
  function $h(e, r, t, o = false) {
    Cr(e), wr(r), oa(t);
    try {
      return Pe.set(e), Q.set(r), Ne.set(t), V.verify(r.length, o === true ? 1 : 0) === 1;
    } finally {
      Pe.fill(0), Q.fill(0), Ne.fill(0);
    }
  }
  function qh(e, r, t, o = false) {
    Cr(e), oa(r), Df(r), t & 2 && Ff(r), Bf(() => as(r.subarray(0, 32)));
    const a = Rr(o);
    try {
      return Pe.set(e), Ne.set(r), V.recover(a, t) === 1 ? Q.slice(0, a) : null;
    } finally {
      Pe.fill(0), Ne.fill(0), Q.fill(0);
    }
  }
  function Gh(e, r, t) {
    Cr(e), Ot(r), oa(t);
    try {
      return Pe.set(e), ze.set(r), Ne.set(t), V.verifySchnorr() === 1;
    } finally {
      Pe.fill(0), ze.fill(0), Ne.fill(0);
    }
  }
  rp = Object.freeze(Object.defineProperty({
    __proto__: null,
    __initializeContext: Sh,
    isPoint: Ih,
    isPointCompressed: Th,
    isPrivate: zh,
    isXOnlyPoint: as,
    pointAdd: Uh,
    pointAddScalar: Hh,
    pointCompress: Ph,
    pointFromScalar: Nh,
    pointMultiply: Ch,
    privateAdd: Rh,
    privateNegate: Bh,
    privateSub: Lh,
    recover: qh,
    sign: Kh,
    signRecoverable: Vh,
    signSchnorr: Mh,
    verify: $h,
    verifySchnorr: Gh,
    xOnlyPointAddTweak: Dh,
    xOnlyPointAddTweakCheck: Fh,
    xOnlyPointFromPoint: jh,
    xOnlyPointFromScalar: Oh
  }, Symbol.toStringTag, {
    value: "Module"
  }));
})();
export {
  ep as B,
  zo as P,
  __tla,
  wt as a,
  Ps as b,
  Yh as c,
  ye as d,
  rp as e,
  _o as f,
  Jh as g,
  ee as h,
  Ie as n,
  re as o,
  Jr as p,
  Zh as r,
  Pr as s,
  Wc as t
};
