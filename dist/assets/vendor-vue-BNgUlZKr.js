const ni = globalThis || void 0 || self;
function Pr(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const fe = {}, Vt = [], st = () => {
}, es = () => false, Mn = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Fr = (e) => e.startsWith("onUpdate:"), Re = Object.assign, Nr = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Mo = Object.prototype.hasOwnProperty, oe = (e, t) => Mo.call(e, t), $ = Array.isArray, kt = (e) => mn(e) === "[object Map]", ts = (e) => mn(e) === "[object Set]", ri = (e) => mn(e) === "[object Date]", J = (e) => typeof e == "function", be = (e) => typeof e == "string", ze = (e) => typeof e == "symbol", le = (e) => e !== null && typeof e == "object", ns = (e) => (le(e) || J(e)) && J(e.then) && J(e.catch), rs = Object.prototype.toString, mn = (e) => rs.call(e), Do = (e) => mn(e).slice(8, -1), is = (e) => mn(e) === "[object Object]", Dn = (e) => be(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Zt = Pr(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), Un = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, Uo = /-\w/g, qe = Un((e) => e.replace(Uo, (t) => t.slice(1).toUpperCase())), Lo = /\B([A-Z])/g, St = Un((e) => e.replace(Lo, "-$1").toLowerCase()), Ln = Un((e) => e.charAt(0).toUpperCase() + e.slice(1)), Qn = Un((e) => e ? `on${Ln(e)}` : ""), Rt = (e, t) => !Object.is(e, t), An = (e, ...t) => {
  for (let n = 0; n < e.length; n++) e[n](...t);
}, ss = (e, t, n, r = false) => {
  Object.defineProperty(e, t, { configurable: true, enumerable: false, writable: r, value: n });
}, Mr = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let ii;
const jn = () => ii || (ii = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof ni < "u" ? ni : {});
function Dr(e) {
  if ($(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const r = e[n], i = be(r) ? ko(r) : Dr(r);
      if (i) for (const l in i) t[l] = i[l];
    }
    return t;
  } else if (be(e) || le(e)) return e;
}
const jo = /;(?![^(]*\))/g, Ho = /:([^]+)/, Vo = /\/\*[^]*?\*\//g;
function ko(e) {
  const t = {};
  return e.replace(Vo, "").split(jo).forEach((n) => {
    if (n) {
      const r = n.split(Ho);
      r.length > 1 && (t[r[0].trim()] = r[1].trim());
    }
  }), t;
}
function Ur(e) {
  let t = "";
  if (be(e)) t = e;
  else if ($(e)) for (let n = 0; n < e.length; n++) {
    const r = Ur(e[n]);
    r && (t += r + " ");
  }
  else if (le(e)) for (const n in e) e[n] && (t += n + " ");
  return t.trim();
}
const Go = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Ko = Pr(Go);
function os(e) {
  return !!e || e === "";
}
function Wo(e, t) {
  if (e.length !== t.length) return false;
  let n = true;
  for (let r = 0; n && r < e.length; r++) n = Lr(e[r], t[r]);
  return n;
}
function Lr(e, t) {
  if (e === t) return true;
  let n = ri(e), r = ri(t);
  if (n || r) return n && r ? e.getTime() === t.getTime() : false;
  if (n = ze(e), r = ze(t), n || r) return e === t;
  if (n = $(e), r = $(t), n || r) return n && r ? Wo(e, t) : false;
  if (n = le(e), r = le(t), n || r) {
    if (!n || !r) return false;
    const i = Object.keys(e).length, l = Object.keys(t).length;
    if (i !== l) return false;
    for (const c in e) {
      const a = e.hasOwnProperty(c), h = t.hasOwnProperty(c);
      if (a && !h || !a && h || !Lr(e[c], t[c])) return false;
    }
  }
  return String(e) === String(t);
}
const ls = (e) => !!(e && e.__v_isRef === true), $o = (e) => be(e) ? e : e == null ? "" : $(e) || le(e) && (e.toString === rs || !J(e.toString)) ? ls(e) ? $o(e.value) : JSON.stringify(e, cs, 2) : String(e), cs = (e, t) => ls(t) ? cs(e, t.value) : kt(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((n, [r, i], l) => (n[Xn(r, l) + " =>"] = i, n), {}) } : ts(t) ? { [`Set(${t.size})`]: [...t.values()].map((n) => Xn(n)) } : ze(t) ? Xn(t) : le(t) && !$(t) && !is(t) ? String(t) : t, Xn = (e, t = "") => {
  var n;
  return ze(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e;
};
let Te;
class us {
  constructor(t = false) {
    this.detached = t, this._active = true, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = false, this.__v_skip = true, this.parent = Te, !t && Te && (this.index = (Te.scopes || (Te.scopes = [])).push(this) - 1);
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = true;
      let t, n;
      if (this.scopes) for (t = 0, n = this.scopes.length; t < n; t++) this.scopes[t].pause();
      for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].pause();
    }
  }
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = false;
      let t, n;
      if (this.scopes) for (t = 0, n = this.scopes.length; t < n; t++) this.scopes[t].resume();
      for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = Te;
      try {
        return Te = this, t();
      } finally {
        Te = n;
      }
    }
  }
  on() {
    ++this._on === 1 && (this.prevScope = Te, Te = this);
  }
  off() {
    this._on > 0 && --this._on === 0 && (Te = this.prevScope, this.prevScope = void 0);
  }
  stop(t) {
    if (this._active) {
      this._active = false;
      let n, r;
      for (n = 0, r = this.effects.length; n < r; n++) this.effects[n].stop();
      for (this.effects.length = 0, n = 0, r = this.cleanups.length; n < r; n++) this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        for (n = 0, r = this.scopes.length; n < r; n++) this.scopes[n].stop(true);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const i = this.parent.scopes.pop();
        i && i !== this && (this.parent.scopes[this.index] = i, i.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function fs(e) {
  return new us(e);
}
function as() {
  return Te;
}
function qo(e, t = false) {
  Te && Te.cleanups.push(e);
}
let pe;
const Zn = /* @__PURE__ */ new WeakSet();
class hs {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Te && Te.active && Te.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Zn.has(this) && (Zn.delete(this), this.trigger()));
  }
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || ds(this);
  }
  run() {
    if (!(this.flags & 1)) return this.fn();
    this.flags |= 2, si(this), gs(this);
    const t = pe, n = Je;
    pe = this, Je = true;
    try {
      return this.fn();
    } finally {
      ms(this), pe = t, Je = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep) Vr(t);
      this.deps = this.depsTail = void 0, si(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Zn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  runIfDirty() {
    dr(this) && this.run();
  }
  get dirty() {
    return dr(this);
  }
}
let ps = 0, en, tn;
function ds(e, t = false) {
  if (e.flags |= 8, t) {
    e.next = tn, tn = e;
    return;
  }
  e.next = en, en = e;
}
function jr() {
  ps++;
}
function Hr() {
  if (--ps > 0) return;
  if (tn) {
    let t = tn;
    for (tn = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; en; ) {
    let t = en;
    for (en = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1) try {
        t.trigger();
      } catch (r) {
        e || (e = r);
      }
      t = n;
    }
  }
  if (e) throw e;
}
function gs(e) {
  for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function ms(e) {
  let t, n = e.depsTail, r = n;
  for (; r; ) {
    const i = r.prevDep;
    r.version === -1 ? (r === n && (n = i), Vr(r), Yo(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = i;
  }
  e.deps = t, e.depsTail = n;
}
function dr(e) {
  for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (ys(t.dep.computed) || t.dep.version !== t.version)) return true;
  return !!e._dirty;
}
function ys(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === un) || (e.globalVersion = un, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !dr(e)))) return;
  e.flags |= 2;
  const t = e.dep, n = pe, r = Je;
  pe = e, Je = true;
  try {
    gs(e);
    const i = e.fn(e._value);
    (t.version === 0 || Rt(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    pe = n, Je = r, ms(e), e.flags &= -3;
  }
}
function Vr(e, t = false) {
  const { dep: n, prevSub: r, nextSub: i } = e;
  if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
    n.computed.flags &= -5;
    for (let l = n.computed.deps; l; l = l.nextDep) Vr(l, true);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function Yo(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let Je = true;
const _s = [];
function gt() {
  _s.push(Je), Je = false;
}
function mt() {
  const e = _s.pop();
  Je = e === void 0 ? true : e;
}
function si(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = pe;
    pe = void 0;
    try {
      t();
    } finally {
      pe = n;
    }
  }
}
let un = 0;
class Jo {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class kr {
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = true;
  }
  track(t) {
    if (!pe || !Je || pe === this.computed) return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== pe) n = this.activeLink = new Jo(pe, this), pe.deps ? (n.prevDep = pe.depsTail, pe.depsTail.nextDep = n, pe.depsTail = n) : pe.deps = pe.depsTail = n, xs(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const r = n.nextDep;
      r.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = r), n.prevDep = pe.depsTail, n.nextDep = void 0, pe.depsTail.nextDep = n, pe.depsTail = n, pe.deps === n && (pe.deps = r);
    }
    return n;
  }
  trigger(t) {
    this.version++, un++, this.notify(t);
  }
  notify(t) {
    jr();
    try {
      for (let n = this.subs; n; n = n.prevSub) n.sub.notify() && n.sub.dep.notify();
    } finally {
      Hr();
    }
  }
}
function xs(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let r = t.deps; r; r = r.nextDep) xs(r);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const Sn = /* @__PURE__ */ new WeakMap(), Pt = /* @__PURE__ */ Symbol(""), gr = /* @__PURE__ */ Symbol(""), fn = /* @__PURE__ */ Symbol("");
function Oe(e, t, n) {
  if (Je && pe) {
    let r = Sn.get(e);
    r || Sn.set(e, r = /* @__PURE__ */ new Map());
    let i = r.get(n);
    i || (r.set(n, i = new kr()), i.map = r, i.key = n), i.track();
  }
}
function ht(e, t, n, r, i, l) {
  const c = Sn.get(e);
  if (!c) {
    un++;
    return;
  }
  const a = (h) => {
    h && h.trigger();
  };
  if (jr(), t === "clear") c.forEach(a);
  else {
    const h = $(e), m = h && Dn(n);
    if (h && n === "length") {
      const u = Number(r);
      c.forEach((y, w) => {
        (w === "length" || w === fn || !ze(w) && w >= u) && a(y);
      });
    } else switch ((n !== void 0 || c.has(void 0)) && a(c.get(n)), m && a(c.get(fn)), t) {
      case "add":
        h ? m && a(c.get("length")) : (a(c.get(Pt)), kt(e) && a(c.get(gr)));
        break;
      case "delete":
        h || (a(c.get(Pt)), kt(e) && a(c.get(gr)));
        break;
      case "set":
        kt(e) && a(c.get(Pt));
        break;
    }
  }
  Hr();
}
function zo(e, t) {
  const n = Sn.get(e);
  return n && n.get(t);
}
function Mt(e) {
  const t = re(e);
  return t === e ? t : (Oe(t, "iterate", fn), Ve(e) ? t : t.map(Qe));
}
function Hn(e) {
  return Oe(e = re(e), "iterate", fn), e;
}
function At(e, t) {
  return yt(e) ? Wt(dt(e) ? Qe(t) : t) : Qe(t);
}
const Qo = { __proto__: null, [Symbol.iterator]() {
  return er(this, Symbol.iterator, (e) => At(this, e));
}, concat(...e) {
  return Mt(this).concat(...e.map((t) => $(t) ? Mt(t) : t));
}, entries() {
  return er(this, "entries", (e) => (e[1] = At(this, e[1]), e));
}, every(e, t) {
  return ct(this, "every", e, t, void 0, arguments);
}, filter(e, t) {
  return ct(this, "filter", e, t, (n) => n.map((r) => At(this, r)), arguments);
}, find(e, t) {
  return ct(this, "find", e, t, (n) => At(this, n), arguments);
}, findIndex(e, t) {
  return ct(this, "findIndex", e, t, void 0, arguments);
}, findLast(e, t) {
  return ct(this, "findLast", e, t, (n) => At(this, n), arguments);
}, findLastIndex(e, t) {
  return ct(this, "findLastIndex", e, t, void 0, arguments);
}, forEach(e, t) {
  return ct(this, "forEach", e, t, void 0, arguments);
}, includes(...e) {
  return tr(this, "includes", e);
}, indexOf(...e) {
  return tr(this, "indexOf", e);
}, join(e) {
  return Mt(this).join(e);
}, lastIndexOf(...e) {
  return tr(this, "lastIndexOf", e);
}, map(e, t) {
  return ct(this, "map", e, t, void 0, arguments);
}, pop() {
  return Jt(this, "pop");
}, push(...e) {
  return Jt(this, "push", e);
}, reduce(e, ...t) {
  return oi(this, "reduce", e, t);
}, reduceRight(e, ...t) {
  return oi(this, "reduceRight", e, t);
}, shift() {
  return Jt(this, "shift");
}, some(e, t) {
  return ct(this, "some", e, t, void 0, arguments);
}, splice(...e) {
  return Jt(this, "splice", e);
}, toReversed() {
  return Mt(this).toReversed();
}, toSorted(e) {
  return Mt(this).toSorted(e);
}, toSpliced(...e) {
  return Mt(this).toSpliced(...e);
}, unshift(...e) {
  return Jt(this, "unshift", e);
}, values() {
  return er(this, "values", (e) => At(this, e));
} };
function er(e, t, n) {
  const r = Hn(e), i = r[t]();
  return r !== e && !Ve(e) && (i._next = i.next, i.next = () => {
    const l = i._next();
    return l.done || (l.value = n(l.value)), l;
  }), i;
}
const Xo = Array.prototype;
function ct(e, t, n, r, i, l) {
  const c = Hn(e), a = c !== e && !Ve(e), h = c[t];
  if (h !== Xo[t]) {
    const y = h.apply(e, l);
    return a ? Qe(y) : y;
  }
  let m = n;
  c !== e && (a ? m = function(y, w) {
    return n.call(this, At(e, y), w, e);
  } : n.length > 2 && (m = function(y, w) {
    return n.call(this, y, w, e);
  }));
  const u = h.call(c, m, r);
  return a && i ? i(u) : u;
}
function oi(e, t, n, r) {
  const i = Hn(e);
  let l = n;
  return i !== e && (Ve(e) ? n.length > 3 && (l = function(c, a, h) {
    return n.call(this, c, a, h, e);
  }) : l = function(c, a, h) {
    return n.call(this, c, At(e, a), h, e);
  }), i[t](l, ...r);
}
function tr(e, t, n) {
  const r = re(e);
  Oe(r, "iterate", fn);
  const i = r[t](...n);
  return (i === -1 || i === false) && Vn(n[0]) ? (n[0] = re(n[0]), r[t](...n)) : i;
}
function Jt(e, t, n = []) {
  gt(), jr();
  const r = re(e)[t].apply(e, n);
  return Hr(), mt(), r;
}
const Zo = Pr("__proto__,__v_isRef,__isVue"), ws = new Set(Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(ze));
function el(e) {
  ze(e) || (e = String(e));
  const t = re(this);
  return Oe(t, "has", e), t.hasOwnProperty(e);
}
class Es {
  constructor(t = false, n = false) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, r) {
    if (n === "__v_skip") return t.__v_skip;
    const i = this._isReadonly, l = this._isShallow;
    if (n === "__v_isReactive") return !i;
    if (n === "__v_isReadonly") return i;
    if (n === "__v_isShallow") return l;
    if (n === "__v_raw") return r === (i ? l ? fl : Is : l ? vs : As).get(t) || Object.getPrototypeOf(t) === Object.getPrototypeOf(r) ? t : void 0;
    const c = $(t);
    if (!i) {
      let h;
      if (c && (h = Qo[n])) return h;
      if (n === "hasOwnProperty") return el;
    }
    const a = Reflect.get(t, n, we(t) ? t : r);
    if ((ze(n) ? ws.has(n) : Zo(n)) || (i || Oe(t, "get", n), l)) return a;
    if (we(a)) {
      const h = c && Dn(n) ? a : a.value;
      return i && le(h) ? yr(h) : h;
    }
    return le(a) ? i ? yr(a) : yn(a) : a;
  }
}
class bs extends Es {
  constructor(t = false) {
    super(false, t);
  }
  set(t, n, r, i) {
    let l = t[n];
    const c = $(t) && Dn(n);
    if (!this._isShallow) {
      const m = yt(l);
      if (!Ve(r) && !yt(r) && (l = re(l), r = re(r)), !c && we(l) && !we(r)) return m || (l.value = r), true;
    }
    const a = c ? Number(n) < t.length : oe(t, n), h = Reflect.set(t, n, r, we(t) ? t : i);
    return t === re(i) && (a ? Rt(r, l) && ht(t, "set", n, r) : ht(t, "add", n, r)), h;
  }
  deleteProperty(t, n) {
    const r = oe(t, n);
    t[n];
    const i = Reflect.deleteProperty(t, n);
    return i && r && ht(t, "delete", n, void 0), i;
  }
  has(t, n) {
    const r = Reflect.has(t, n);
    return (!ze(n) || !ws.has(n)) && Oe(t, "has", n), r;
  }
  ownKeys(t) {
    return Oe(t, "iterate", $(t) ? "length" : Pt), Reflect.ownKeys(t);
  }
}
class tl extends Es {
  constructor(t = false) {
    super(true, t);
  }
  set(t, n) {
    return true;
  }
  deleteProperty(t, n) {
    return true;
  }
}
const nl = new bs(), rl = new tl(), il = new bs(true);
const mr = (e) => e, wn = (e) => Reflect.getPrototypeOf(e);
function sl(e, t, n) {
  return function(...r) {
    const i = this.__v_raw, l = re(i), c = kt(l), a = e === "entries" || e === Symbol.iterator && c, h = e === "keys" && c, m = i[e](...r), u = n ? mr : t ? Wt : Qe;
    return !t && Oe(l, "iterate", h ? gr : Pt), Re(Object.create(m), { next() {
      const { value: y, done: w } = m.next();
      return w ? { value: y, done: w } : { value: a ? [u(y[0]), u(y[1])] : u(y), done: w };
    } });
  };
}
function En(e) {
  return function(...t) {
    return e === "delete" ? false : e === "clear" ? void 0 : this;
  };
}
function ol(e, t) {
  const n = { get(i) {
    const l = this.__v_raw, c = re(l), a = re(i);
    e || (Rt(i, a) && Oe(c, "get", i), Oe(c, "get", a));
    const { has: h } = wn(c), m = t ? mr : e ? Wt : Qe;
    if (h.call(c, i)) return m(l.get(i));
    if (h.call(c, a)) return m(l.get(a));
    l !== c && l.get(i);
  }, get size() {
    const i = this.__v_raw;
    return !e && Oe(re(i), "iterate", Pt), i.size;
  }, has(i) {
    const l = this.__v_raw, c = re(l), a = re(i);
    return e || (Rt(i, a) && Oe(c, "has", i), Oe(c, "has", a)), i === a ? l.has(i) : l.has(i) || l.has(a);
  }, forEach(i, l) {
    const c = this, a = c.__v_raw, h = re(a), m = t ? mr : e ? Wt : Qe;
    return !e && Oe(h, "iterate", Pt), a.forEach((u, y) => i.call(l, m(u), m(y), c));
  } };
  return Re(n, e ? { add: En("add"), set: En("set"), delete: En("delete"), clear: En("clear") } : { add(i) {
    !t && !Ve(i) && !yt(i) && (i = re(i));
    const l = re(this);
    return wn(l).has.call(l, i) || (l.add(i), ht(l, "add", i, i)), this;
  }, set(i, l) {
    !t && !Ve(l) && !yt(l) && (l = re(l));
    const c = re(this), { has: a, get: h } = wn(c);
    let m = a.call(c, i);
    m || (i = re(i), m = a.call(c, i));
    const u = h.call(c, i);
    return c.set(i, l), m ? Rt(l, u) && ht(c, "set", i, l) : ht(c, "add", i, l), this;
  }, delete(i) {
    const l = re(this), { has: c, get: a } = wn(l);
    let h = c.call(l, i);
    h || (i = re(i), h = c.call(l, i)), a && a.call(l, i);
    const m = l.delete(i);
    return h && ht(l, "delete", i, void 0), m;
  }, clear() {
    const i = re(this), l = i.size !== 0, c = i.clear();
    return l && ht(i, "clear", void 0, void 0), c;
  } }), ["keys", "values", "entries", Symbol.iterator].forEach((i) => {
    n[i] = sl(i, e, t);
  }), n;
}
function Gr(e, t) {
  const n = ol(e, t);
  return (r, i, l) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_raw" ? r : Reflect.get(oe(n, i) && i in r ? n : r, i, l);
}
const ll = { get: Gr(false, false) }, cl = { get: Gr(false, true) }, ul = { get: Gr(true, false) };
const As = /* @__PURE__ */ new WeakMap(), vs = /* @__PURE__ */ new WeakMap(), Is = /* @__PURE__ */ new WeakMap(), fl = /* @__PURE__ */ new WeakMap();
function al(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function hl(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : al(Do(e));
}
function yn(e) {
  return yt(e) ? e : Kr(e, false, nl, ll, As);
}
function Rs(e) {
  return Kr(e, false, il, cl, vs);
}
function yr(e) {
  return Kr(e, true, rl, ul, Is);
}
function Kr(e, t, n, r, i) {
  if (!le(e) || e.__v_raw && !(t && e.__v_isReactive)) return e;
  const l = hl(e);
  if (l === 0) return e;
  const c = i.get(e);
  if (c) return c;
  const a = new Proxy(e, l === 2 ? r : n);
  return i.set(e, a), a;
}
function dt(e) {
  return yt(e) ? dt(e.__v_raw) : !!(e && e.__v_isReactive);
}
function yt(e) {
  return !!(e && e.__v_isReadonly);
}
function Ve(e) {
  return !!(e && e.__v_isShallow);
}
function Vn(e) {
  return e ? !!e.__v_raw : false;
}
function re(e) {
  const t = e && e.__v_raw;
  return t ? re(t) : e;
}
function Wr(e) {
  return !oe(e, "__v_skip") && Object.isExtensible(e) && ss(e, "__v_skip", true), e;
}
const Qe = (e) => le(e) ? yn(e) : e, Wt = (e) => le(e) ? yr(e) : e;
function we(e) {
  return e ? e.__v_isRef === true : false;
}
function Ss(e) {
  return Cs(e, false);
}
function pl(e) {
  return Cs(e, true);
}
function Cs(e, t) {
  return we(e) ? e : new dl(e, t);
}
class dl {
  constructor(t, n) {
    this.dep = new kr(), this.__v_isRef = true, this.__v_isShallow = false, this._rawValue = n ? t : re(t), this._value = n ? t : Qe(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, r = this.__v_isShallow || Ve(t) || yt(t);
    t = r ? t : re(t), Rt(t, n) && (this._rawValue = t, this._value = r ? t : Qe(t), this.dep.trigger());
  }
}
function Ft(e) {
  return we(e) ? e.value : e;
}
const gl = { get: (e, t, n) => t === "__v_raw" ? e : Ft(Reflect.get(e, t, n)), set: (e, t, n, r) => {
  const i = e[t];
  return we(i) && !we(n) ? (i.value = n, true) : Reflect.set(e, t, n, r);
} };
function Bs(e) {
  return dt(e) ? e : new Proxy(e, gl);
}
function ml(e) {
  const t = $(e) ? new Array(e.length) : {};
  for (const n in e) t[n] = _l(e, n);
  return t;
}
class yl {
  constructor(t, n, r) {
    this._object = t, this._key = n, this._defaultValue = r, this.__v_isRef = true, this._value = void 0, this._raw = re(t);
    let i = true, l = t;
    if (!$(t) || !Dn(String(n))) do
      i = !Vn(l) || Ve(l);
    while (i && (l = l.__v_raw));
    this._shallow = i;
  }
  get value() {
    let t = this._object[this._key];
    return this._shallow && (t = Ft(t)), this._value = t === void 0 ? this._defaultValue : t;
  }
  set value(t) {
    if (this._shallow && we(this._raw[this._key])) {
      const n = this._object[this._key];
      if (we(n)) {
        n.value = t;
        return;
      }
    }
    this._object[this._key] = t;
  }
  get dep() {
    return zo(this._raw, this._key);
  }
}
function _l(e, t, n) {
  return new yl(e, t, n);
}
class xl {
  constructor(t, n, r) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new kr(this), this.__v_isRef = true, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = un - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = r;
  }
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && pe !== this) return ds(this, true), true;
  }
  get value() {
    const t = this.dep.track();
    return ys(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
function wl(e, t, n = false) {
  let r, i;
  return J(e) ? r = e : (r = e.get, i = e.set), new xl(r, i, n);
}
const bn = {}, Cn = /* @__PURE__ */ new WeakMap();
let Tt;
function El(e, t = false, n = Tt) {
  if (n) {
    let r = Cn.get(n);
    r || Cn.set(n, r = []), r.push(e);
  }
}
function bl(e, t, n = fe) {
  const { immediate: r, deep: i, once: l, scheduler: c, augmentJob: a, call: h } = n, m = (L) => i ? L : Ve(L) || i === false || i === 0 ? pt(L, 1) : pt(L);
  let u, y, w, b, F = false, T = false;
  if (we(e) ? (y = () => e.value, F = Ve(e)) : dt(e) ? (y = () => m(e), F = true) : $(e) ? (T = true, F = e.some((L) => dt(L) || Ve(L)), y = () => e.map((L) => {
    if (we(L)) return L.value;
    if (dt(L)) return m(L);
    if (J(L)) return h ? h(L, 2) : L();
  })) : J(e) ? t ? y = h ? () => h(e, 2) : e : y = () => {
    if (w) {
      gt();
      try {
        w();
      } finally {
        mt();
      }
    }
    const L = Tt;
    Tt = u;
    try {
      return h ? h(e, 3, [b]) : e(b);
    } finally {
      Tt = L;
    }
  } : y = st, t && i) {
    const L = y, Q = i === true ? 1 / 0 : i;
    y = () => pt(L(), Q);
  }
  const K = as(), W = () => {
    u.stop(), K && K.active && Nr(K.effects, u);
  };
  if (l && t) {
    const L = t;
    t = (...Q) => {
      L(...Q), W();
    };
  }
  let D = T ? new Array(e.length).fill(bn) : bn;
  const j = (L) => {
    if (!(!(u.flags & 1) || !u.dirty && !L)) if (t) {
      const Q = u.run();
      if (i || F || (T ? Q.some((Ee, ie) => Rt(Ee, D[ie])) : Rt(Q, D))) {
        w && w();
        const Ee = Tt;
        Tt = u;
        try {
          const ie = [Q, D === bn ? void 0 : T && D[0] === bn ? [] : D, b];
          D = Q, h ? h(t, 3, ie) : t(...ie);
        } finally {
          Tt = Ee;
        }
      }
    } else u.run();
  };
  return a && a(j), u = new hs(y), u.scheduler = c ? () => c(j, false) : j, b = (L) => El(L, false, u), w = u.onStop = () => {
    const L = Cn.get(u);
    if (L) {
      if (h) h(L, 4);
      else for (const Q of L) Q();
      Cn.delete(u);
    }
  }, t ? r ? j(true) : D = u.run() : c ? c(j.bind(null, true), true) : u.run(), W.pause = u.pause.bind(u), W.resume = u.resume.bind(u), W.stop = W, W;
}
function pt(e, t = 1 / 0, n) {
  if (t <= 0 || !le(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
  if (n.set(e, t), t--, we(e)) pt(e.value, t, n);
  else if ($(e)) for (let r = 0; r < e.length; r++) pt(e[r], t, n);
  else if (ts(e) || kt(e)) e.forEach((r) => {
    pt(r, t, n);
  });
  else if (is(e)) {
    for (const r in e) pt(e[r], t, n);
    for (const r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && pt(e[r], t, n);
  }
  return e;
}
function _n(e, t, n, r) {
  try {
    return r ? e(...r) : e();
  } catch (i) {
    kn(i, t, n);
  }
}
function ot(e, t, n, r) {
  if (J(e)) {
    const i = _n(e, t, n, r);
    return i && ns(i) && i.catch((l) => {
      kn(l, t, n);
    }), i;
  }
  if ($(e)) {
    const i = [];
    for (let l = 0; l < e.length; l++) i.push(ot(e[l], t, n, r));
    return i;
  }
}
function kn(e, t, n, r = true) {
  const i = t ? t.vnode : null, { errorHandler: l, throwUnhandledErrorInProduction: c } = t && t.appContext.config || fe;
  if (t) {
    let a = t.parent;
    const h = t.proxy, m = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; a; ) {
      const u = a.ec;
      if (u) {
        for (let y = 0; y < u.length; y++) if (u[y](e, h, m) === false) return;
      }
      a = a.parent;
    }
    if (l) {
      gt(), _n(l, null, 10, [e, h, m]), mt();
      return;
    }
  }
  Al(e, n, i, r, c);
}
function Al(e, t, n, r = true, i = false) {
  if (i) throw e;
  console.error(e);
}
const Ue = [];
let nt = -1;
const Gt = [];
let vt = null, Lt = 0;
const Ts = Promise.resolve();
let Bn = null;
function $r(e) {
  const t = Bn || Ts;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function vl(e) {
  let t = nt + 1, n = Ue.length;
  for (; t < n; ) {
    const r = t + n >>> 1, i = Ue[r], l = an(i);
    l < e || l === e && i.flags & 2 ? t = r + 1 : n = r;
  }
  return t;
}
function qr(e) {
  if (!(e.flags & 1)) {
    const t = an(e), n = Ue[Ue.length - 1];
    !n || !(e.flags & 2) && t >= an(n) ? Ue.push(e) : Ue.splice(vl(t), 0, e), e.flags |= 1, Os();
  }
}
function Os() {
  Bn || (Bn = Ts.then(Fs));
}
function Il(e) {
  $(e) ? Gt.push(...e) : vt && e.id === -1 ? vt.splice(Lt + 1, 0, e) : e.flags & 1 || (Gt.push(e), e.flags |= 1), Os();
}
function li(e, t, n = nt + 1) {
  for (; n < Ue.length; n++) {
    const r = Ue[n];
    if (r && r.flags & 2) {
      if (e && r.id !== e.uid) continue;
      Ue.splice(n, 1), n--, r.flags & 4 && (r.flags &= -2), r(), r.flags & 4 || (r.flags &= -2);
    }
  }
}
function Ps(e) {
  if (Gt.length) {
    const t = [...new Set(Gt)].sort((n, r) => an(n) - an(r));
    if (Gt.length = 0, vt) {
      vt.push(...t);
      return;
    }
    for (vt = t, Lt = 0; Lt < vt.length; Lt++) {
      const n = vt[Lt];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    vt = null, Lt = 0;
  }
}
const an = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Fs(e) {
  try {
    for (nt = 0; nt < Ue.length; nt++) {
      const t = Ue[nt];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), _n(t, t.i, t.i ? 15 : 14), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; nt < Ue.length; nt++) {
      const t = Ue[nt];
      t && (t.flags &= -2);
    }
    nt = -1, Ue.length = 0, Ps(), Bn = null, (Ue.length || Gt.length) && Fs();
  }
}
let Ie = null, Ns = null;
function Tn(e) {
  const t = Ie;
  return Ie = e, Ns = e && e.type.__scopeId || null, t;
}
function Rl(e, t = Ie, n) {
  if (!t || e._n) return e;
  const r = (...i) => {
    r._d && Fn(-1);
    const l = Tn(t);
    let c;
    try {
      c = e(...i);
    } finally {
      Tn(l), r._d && Fn(1);
    }
    return c;
  };
  return r._n = true, r._c = true, r._d = true, r;
}
function If(e, t) {
  if (Ie === null) return e;
  const n = $n(Ie), r = e.dirs || (e.dirs = []);
  for (let i = 0; i < t.length; i++) {
    let [l, c, a, h = fe] = t[i];
    l && (J(l) && (l = { mounted: l, updated: l }), l.deep && pt(c), r.push({ dir: l, instance: n, value: c, oldValue: void 0, arg: a, modifiers: h }));
  }
  return e;
}
function Ct(e, t, n, r) {
  const i = e.dirs, l = t && t.dirs;
  for (let c = 0; c < i.length; c++) {
    const a = i[c];
    l && (a.oldValue = l[c].value);
    let h = a.dir[r];
    h && (gt(), ot(h, n, 8, [e.el, a, e, t]), mt());
  }
}
function vn(e, t) {
  if (Pe) {
    let n = Pe.provides;
    const r = Pe.parent && Pe.parent.provides;
    r === n && (n = Pe.provides = Object.create(r)), n[e] = t;
  }
}
function $e(e, t, n = false) {
  const r = ao();
  if (r || Nt) {
    let i = Nt ? Nt._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
    if (i && e in i) return i[e];
    if (arguments.length > 1) return n && J(t) ? t.call(r && r.proxy) : t;
  }
}
function Sl() {
  return !!(ao() || Nt);
}
const Cl = /* @__PURE__ */ Symbol.for("v-scx"), Bl = () => $e(Cl);
function Rf(e, t) {
  return Yr(e, null, t);
}
function nn(e, t, n) {
  return Yr(e, t, n);
}
function Yr(e, t, n = fe) {
  const { immediate: r, deep: i, flush: l, once: c } = n, a = Re({}, n), h = t && r || !t && l !== "post";
  let m;
  if (dn) {
    if (l === "sync") {
      const b = Bl();
      m = b.__watcherHandles || (b.__watcherHandles = []);
    } else if (!h) {
      const b = () => {
      };
      return b.stop = st, b.resume = st, b.pause = st, b;
    }
  }
  const u = Pe;
  a.call = (b, F, T) => ot(b, u, F, T);
  let y = false;
  l === "post" ? a.scheduler = (b) => {
    Le(b, u && u.suspense);
  } : l !== "sync" && (y = true, a.scheduler = (b, F) => {
    F ? b() : qr(b);
  }), a.augmentJob = (b) => {
    t && (b.flags |= 4), y && (b.flags |= 2, u && (b.id = u.uid, b.i = u));
  };
  const w = bl(e, t, a);
  return dn && (m ? m.push(w) : h && w()), w;
}
function Tl(e, t, n) {
  const r = this.proxy, i = be(e) ? e.includes(".") ? Ms(r, e) : () => r[e] : e.bind(r, r);
  let l;
  J(t) ? l = t : (l = t.handler, n = t);
  const c = xn(this), a = Yr(i, l.bind(r), n);
  return c(), a;
}
function Ms(e, t) {
  const n = t.split(".");
  return () => {
    let r = e;
    for (let i = 0; i < n.length && r; i++) r = r[n[i]];
    return r;
  };
}
const Ol = /* @__PURE__ */ Symbol("_vte"), Pl = (e) => e.__isTeleport, Fl = /* @__PURE__ */ Symbol("_leaveCb");
function Jr(e, t) {
  e.shapeFlag & 6 && e.component ? (e.transition = t, Jr(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function Ds(e, t) {
  return J(e) ? Re({ name: e.name }, t, { setup: e }) : e;
}
function Us(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function ci(e, t) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
const On = /* @__PURE__ */ new WeakMap();
function rn(e, t, n, r, i = false) {
  if ($(e)) {
    e.forEach((T, K) => rn(T, t && ($(t) ? t[K] : t), n, r, i));
    return;
  }
  if (Kt(r) && !i) {
    r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && rn(e, t, n, r.component.subTree);
    return;
  }
  const l = r.shapeFlag & 4 ? $n(r.component) : r.el, c = i ? null : l, { i: a, r: h } = e, m = t && t.r, u = a.refs === fe ? a.refs = {} : a.refs, y = a.setupState, w = re(y), b = y === fe ? es : (T) => ci(u, T) ? false : oe(w, T), F = (T, K) => !(K && ci(u, K));
  if (m != null && m !== h) {
    if (ui(t), be(m)) u[m] = null, b(m) && (y[m] = null);
    else if (we(m)) {
      const T = t;
      F(m, T.k) && (m.value = null), T.k && (u[T.k] = null);
    }
  }
  if (J(h)) _n(h, a, 12, [c, u]);
  else {
    const T = be(h), K = we(h);
    if (T || K) {
      const W = () => {
        if (e.f) {
          const D = T ? b(h) ? y[h] : u[h] : F() || !e.k ? h.value : u[e.k];
          if (i) $(D) && Nr(D, l);
          else if ($(D)) D.includes(l) || D.push(l);
          else if (T) u[h] = [l], b(h) && (y[h] = u[h]);
          else {
            const j = [l];
            F(h, e.k) && (h.value = j), e.k && (u[e.k] = j);
          }
        } else T ? (u[h] = c, b(h) && (y[h] = c)) : K && (F(h, e.k) && (h.value = c), e.k && (u[e.k] = c));
      };
      if (c) {
        const D = () => {
          W(), On.delete(e);
        };
        D.id = -1, On.set(e, D), Le(D, n);
      } else ui(e), W();
    }
  }
}
function ui(e) {
  const t = On.get(e);
  t && (t.flags |= 8, On.delete(e));
}
jn().requestIdleCallback;
jn().cancelIdleCallback;
const Kt = (e) => !!e.type.__asyncLoader, Ls = (e) => e.type.__isKeepAlive;
function Nl(e, t) {
  js(e, "a", t);
}
function Ml(e, t) {
  js(e, "da", t);
}
function js(e, t, n = Pe) {
  const r = e.__wdc || (e.__wdc = () => {
    let i = n;
    for (; i; ) {
      if (i.isDeactivated) return;
      i = i.parent;
    }
    return e();
  });
  if (Gn(t, r, n), n) {
    let i = n.parent;
    for (; i && i.parent; ) Ls(i.parent.vnode) && Dl(r, t, n, i), i = i.parent;
  }
}
function Dl(e, t, n, r) {
  const i = Gn(t, e, r, true);
  Hs(() => {
    Nr(r[t], i);
  }, n);
}
function Gn(e, t, n = Pe, r = false) {
  if (n) {
    const i = n[e] || (n[e] = []), l = t.__weh || (t.__weh = (...c) => {
      gt();
      const a = xn(n), h = ot(t, n, e, c);
      return a(), mt(), h;
    });
    return r ? i.unshift(l) : i.push(l), l;
  }
}
const xt = (e) => (t, n = Pe) => {
  (!dn || e === "sp") && Gn(e, (...r) => t(...r), n);
}, Ul = xt("bm"), Ll = xt("m"), jl = xt("bu"), Hl = xt("u"), Vl = xt("bum"), Hs = xt("um"), kl = xt("sp"), Gl = xt("rtg"), Kl = xt("rtc");
function Wl(e, t = Pe) {
  Gn("ec", e, t);
}
const Vs = "components";
function Sf(e, t) {
  return Gs(Vs, e, true, t) || e;
}
const ks = /* @__PURE__ */ Symbol.for("v-ndc");
function Cf(e) {
  return be(e) ? Gs(Vs, e, false) || e : e || ks;
}
function Gs(e, t, n = true, r = false) {
  const i = Ie || Pe;
  if (i) {
    const l = i.type;
    {
      const a = Tc(l, false);
      if (a && (a === t || a === qe(t) || a === Ln(qe(t)))) return l;
    }
    const c = fi(i[e] || l[e], t) || fi(i.appContext[e], t);
    return !c && r ? l : c;
  }
}
function fi(e, t) {
  return e && (e[t] || e[qe(t)] || e[Ln(qe(t))]);
}
function Bf(e, t, n, r) {
  let i;
  const l = n, c = $(e);
  if (c || be(e)) {
    const a = c && dt(e);
    let h = false, m = false;
    a && (h = !Ve(e), m = yt(e), e = Hn(e)), i = new Array(e.length);
    for (let u = 0, y = e.length; u < y; u++) i[u] = t(h ? m ? Wt(Qe(e[u])) : Qe(e[u]) : e[u], u, void 0, l);
  } else if (typeof e == "number") {
    i = new Array(e);
    for (let a = 0; a < e; a++) i[a] = t(a + 1, a, void 0, l);
  } else if (le(e)) if (e[Symbol.iterator]) i = Array.from(e, (a, h) => t(a, h, void 0, l));
  else {
    const a = Object.keys(e);
    i = new Array(a.length);
    for (let h = 0, m = a.length; h < m; h++) {
      const u = a[h];
      i[h] = t(e[u], u, h, l);
    }
  }
  else i = [];
  return i;
}
function Tf(e, t) {
  for (let n = 0; n < t.length; n++) {
    const r = t[n];
    if ($(r)) for (let i = 0; i < r.length; i++) e[r[i].name] = r[i].fn;
    else r && (e[r.name] = r.key ? (...i) => {
      const l = r.fn(...i);
      return l && (l.key = r.key), l;
    } : r.fn);
  }
  return e;
}
function Of(e, t, n = {}, r, i) {
  if (Ie.ce || Ie.parent && Kt(Ie.parent) && Ie.parent.ce) {
    const m = Object.keys(n).length > 0;
    return t !== "default" && (n.name = t), br(), Ar(Ke, null, [je("slot", n, r && r())], m ? -2 : 64);
  }
  let l = e[t];
  l && l._c && (l._d = false), br();
  const c = l && Ks(l(n)), a = n.key || c && c.key, h = Ar(Ke, { key: (a && !ze(a) ? a : `_${t}`) + (!c && r ? "_fb" : "") }, c || (r ? r() : []), c && e._ === 1 ? 64 : -2);
  return h.scopeId && (h.slotScopeIds = [h.scopeId + "-s"]), l && l._c && (l._d = true), h;
}
function Ks(e) {
  return e.some((t) => pn(t) ? !(t.type === _t || t.type === Ke && !Ks(t.children)) : true) ? e : null;
}
const _r = (e) => e ? ho(e) ? $n(e) : _r(e.parent) : null, sn = Re(/* @__PURE__ */ Object.create(null), { $: (e) => e, $el: (e) => e.vnode.el, $data: (e) => e.data, $props: (e) => e.props, $attrs: (e) => e.attrs, $slots: (e) => e.slots, $refs: (e) => e.refs, $parent: (e) => _r(e.parent), $root: (e) => _r(e.root), $host: (e) => e.ce, $emit: (e) => e.emit, $options: (e) => $s(e), $forceUpdate: (e) => e.f || (e.f = () => {
  qr(e.update);
}), $nextTick: (e) => e.n || (e.n = $r.bind(e.proxy)), $watch: (e) => Tl.bind(e) }), nr = (e, t) => e !== fe && !e.__isScriptSetup && oe(e, t), $l = { get({ _: e }, t) {
  if (t === "__v_skip") return true;
  const { ctx: n, setupState: r, data: i, props: l, accessCache: c, type: a, appContext: h } = e;
  if (t[0] !== "$") {
    const w = c[t];
    if (w !== void 0) switch (w) {
      case 1:
        return r[t];
      case 2:
        return i[t];
      case 4:
        return n[t];
      case 3:
        return l[t];
    }
    else {
      if (nr(r, t)) return c[t] = 1, r[t];
      if (i !== fe && oe(i, t)) return c[t] = 2, i[t];
      if (oe(l, t)) return c[t] = 3, l[t];
      if (n !== fe && oe(n, t)) return c[t] = 4, n[t];
      xr && (c[t] = 0);
    }
  }
  const m = sn[t];
  let u, y;
  if (m) return t === "$attrs" && Oe(e.attrs, "get", ""), m(e);
  if ((u = a.__cssModules) && (u = u[t])) return u;
  if (n !== fe && oe(n, t)) return c[t] = 4, n[t];
  if (y = h.config.globalProperties, oe(y, t)) return y[t];
}, set({ _: e }, t, n) {
  const { data: r, setupState: i, ctx: l } = e;
  return nr(i, t) ? (i[t] = n, true) : r !== fe && oe(r, t) ? (r[t] = n, true) : oe(e.props, t) || t[0] === "$" && t.slice(1) in e ? false : (l[t] = n, true);
}, has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: l, type: c } }, a) {
  let h;
  return !!(n[a] || e !== fe && a[0] !== "$" && oe(e, a) || nr(t, a) || oe(l, a) || oe(r, a) || oe(sn, a) || oe(i.config.globalProperties, a) || (h = c.__cssModules) && h[a]);
}, defineProperty(e, t, n) {
  return n.get != null ? e._.accessCache[t] = 0 : oe(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
} };
function ai(e) {
  return $(e) ? e.reduce((t, n) => (t[n] = null, t), {}) : e;
}
let xr = true;
function ql(e) {
  const t = $s(e), n = e.proxy, r = e.ctx;
  xr = false, t.beforeCreate && hi(t.beforeCreate, e, "bc");
  const { data: i, computed: l, methods: c, watch: a, provide: h, inject: m, created: u, beforeMount: y, mounted: w, beforeUpdate: b, updated: F, activated: T, deactivated: K, beforeDestroy: W, beforeUnmount: D, destroyed: j, unmounted: L, render: Q, renderTracked: Ee, renderTriggered: ie, errorCaptured: q, serverPrefetch: Z, expose: ae, inheritAttrs: ve, components: Fe, directives: Se, filters: lt } = t;
  if (m && Yl(m, r, null), c) for (const Y in c) {
    const ne = c[Y];
    J(ne) && (r[Y] = ne.bind(n));
  }
  if (i) {
    const Y = i.call(n, n);
    le(Y) && (e.data = yn(Y));
  }
  if (xr = true, l) for (const Y in l) {
    const ne = l[Y], Ye = J(ne) ? ne.bind(n, n) : J(ne.get) ? ne.get.bind(n, n) : st, et = !J(ne) && J(ne.set) ? ne.set.bind(n) : st, ke = We({ get: Ye, set: et });
    Object.defineProperty(r, Y, { enumerable: true, configurable: true, get: () => ke.value, set: (Ce) => ke.value = Ce });
  }
  if (a) for (const Y in a) Ws(a[Y], r, n, Y);
  if (h) {
    const Y = J(h) ? h.call(n) : h;
    Reflect.ownKeys(Y).forEach((ne) => {
      vn(ne, Y[ne]);
    });
  }
  u && hi(u, e, "c");
  function he(Y, ne) {
    $(ne) ? ne.forEach((Ye) => Y(Ye.bind(n))) : ne && Y(ne.bind(n));
  }
  if (he(Ul, y), he(Ll, w), he(jl, b), he(Hl, F), he(Nl, T), he(Ml, K), he(Wl, q), he(Kl, Ee), he(Gl, ie), he(Vl, D), he(Hs, L), he(kl, Z), $(ae)) if (ae.length) {
    const Y = e.exposed || (e.exposed = {});
    ae.forEach((ne) => {
      Object.defineProperty(Y, ne, { get: () => n[ne], set: (Ye) => n[ne] = Ye, enumerable: true });
    });
  } else e.exposed || (e.exposed = {});
  Q && e.render === st && (e.render = Q), ve != null && (e.inheritAttrs = ve), Fe && (e.components = Fe), Se && (e.directives = Se), Z && Us(e);
}
function Yl(e, t, n = st) {
  $(e) && (e = wr(e));
  for (const r in e) {
    const i = e[r];
    let l;
    le(i) ? "default" in i ? l = $e(i.from || r, i.default, true) : l = $e(i.from || r) : l = $e(i), we(l) ? Object.defineProperty(t, r, { enumerable: true, configurable: true, get: () => l.value, set: (c) => l.value = c }) : t[r] = l;
  }
}
function hi(e, t, n) {
  ot($(e) ? e.map((r) => r.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Ws(e, t, n, r) {
  let i = r.includes(".") ? Ms(n, r) : () => n[r];
  if (be(e)) {
    const l = t[e];
    J(l) && nn(i, l);
  } else if (J(e)) nn(i, e.bind(n));
  else if (le(e)) if ($(e)) e.forEach((l) => Ws(l, t, n, r));
  else {
    const l = J(e.handler) ? e.handler.bind(n) : t[e.handler];
    J(l) && nn(i, l, e);
  }
}
function $s(e) {
  const t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: l, config: { optionMergeStrategies: c } } = e.appContext, a = l.get(t);
  let h;
  return a ? h = a : !i.length && !n && !r ? h = t : (h = {}, i.length && i.forEach((m) => Pn(h, m, c, true)), Pn(h, t, c)), le(t) && l.set(t, h), h;
}
function Pn(e, t, n, r = false) {
  const { mixins: i, extends: l } = t;
  l && Pn(e, l, n, true), i && i.forEach((c) => Pn(e, c, n, true));
  for (const c in t) if (!(r && c === "expose")) {
    const a = Jl[c] || n && n[c];
    e[c] = a ? a(e[c], t[c]) : t[c];
  }
  return e;
}
const Jl = { data: pi, props: di, emits: di, methods: Xt, computed: Xt, beforeCreate: Me, created: Me, beforeMount: Me, mounted: Me, beforeUpdate: Me, updated: Me, beforeDestroy: Me, beforeUnmount: Me, destroyed: Me, unmounted: Me, activated: Me, deactivated: Me, errorCaptured: Me, serverPrefetch: Me, components: Xt, directives: Xt, watch: Ql, provide: pi, inject: zl };
function pi(e, t) {
  return t ? e ? function() {
    return Re(J(e) ? e.call(this, this) : e, J(t) ? t.call(this, this) : t);
  } : t : e;
}
function zl(e, t) {
  return Xt(wr(e), wr(t));
}
function wr(e) {
  if ($(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
    return t;
  }
  return e;
}
function Me(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Xt(e, t) {
  return e ? Re(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function di(e, t) {
  return e ? $(e) && $(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : Re(/* @__PURE__ */ Object.create(null), ai(e), ai(t ?? {})) : t;
}
function Ql(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = Re(/* @__PURE__ */ Object.create(null), e);
  for (const r in t) n[r] = Me(e[r], t[r]);
  return n;
}
function qs() {
  return { app: null, config: { isNativeTag: es, performance: false, globalProperties: {}, optionMergeStrategies: {}, errorHandler: void 0, warnHandler: void 0, compilerOptions: {} }, mixins: [], components: {}, directives: {}, provides: /* @__PURE__ */ Object.create(null), optionsCache: /* @__PURE__ */ new WeakMap(), propsCache: /* @__PURE__ */ new WeakMap(), emitsCache: /* @__PURE__ */ new WeakMap() };
}
let Xl = 0;
function Zl(e, t) {
  return function(r, i = null) {
    J(r) || (r = Re({}, r)), i != null && !le(i) && (i = null);
    const l = qs(), c = /* @__PURE__ */ new WeakSet(), a = [];
    let h = false;
    const m = l.app = { _uid: Xl++, _component: r, _props: i, _container: null, _context: l, _instance: null, version: Pc, get config() {
      return l.config;
    }, set config(u) {
    }, use(u, ...y) {
      return c.has(u) || (u && J(u.install) ? (c.add(u), u.install(m, ...y)) : J(u) && (c.add(u), u(m, ...y))), m;
    }, mixin(u) {
      return l.mixins.includes(u) || l.mixins.push(u), m;
    }, component(u, y) {
      return y ? (l.components[u] = y, m) : l.components[u];
    }, directive(u, y) {
      return y ? (l.directives[u] = y, m) : l.directives[u];
    }, mount(u, y, w) {
      if (!h) {
        const b = m._ceVNode || je(r, i);
        return b.appContext = l, w === true ? w = "svg" : w === false && (w = void 0), e(b, u, w), h = true, m._container = u, u.__vue_app__ = m, $n(b.component);
      }
    }, onUnmount(u) {
      a.push(u);
    }, unmount() {
      h && (ot(a, m._instance, 16), e(null, m._container), delete m._container.__vue_app__);
    }, provide(u, y) {
      return l.provides[u] = y, m;
    }, runWithContext(u) {
      const y = Nt;
      Nt = m;
      try {
        return u();
      } finally {
        Nt = y;
      }
    } };
    return m;
  };
}
let Nt = null;
const ec = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${qe(t)}Modifiers`] || e[`${St(t)}Modifiers`];
function tc(e, t, ...n) {
  if (e.isUnmounted) return;
  const r = e.vnode.props || fe;
  let i = n;
  const l = t.startsWith("update:"), c = l && ec(r, t.slice(7));
  c && (c.trim && (i = n.map((u) => be(u) ? u.trim() : u)), c.number && (i = n.map(Mr)));
  let a, h = r[a = Qn(t)] || r[a = Qn(qe(t))];
  !h && l && (h = r[a = Qn(St(t))]), h && ot(h, e, 6, i);
  const m = r[a + "Once"];
  if (m) {
    if (!e.emitted) e.emitted = {};
    else if (e.emitted[a]) return;
    e.emitted[a] = true, ot(m, e, 6, i);
  }
}
const nc = /* @__PURE__ */ new WeakMap();
function Ys(e, t, n = false) {
  const r = n ? nc : t.emitsCache, i = r.get(e);
  if (i !== void 0) return i;
  const l = e.emits;
  let c = {}, a = false;
  if (!J(e)) {
    const h = (m) => {
      const u = Ys(m, t, true);
      u && (a = true, Re(c, u));
    };
    !n && t.mixins.length && t.mixins.forEach(h), e.extends && h(e.extends), e.mixins && e.mixins.forEach(h);
  }
  return !l && !a ? (le(e) && r.set(e, null), null) : ($(l) ? l.forEach((h) => c[h] = null) : Re(c, l), le(e) && r.set(e, c), c);
}
function Kn(e, t) {
  return !e || !Mn(t) ? false : (t = t.slice(2).replace(/Once$/, ""), oe(e, t[0].toLowerCase() + t.slice(1)) || oe(e, St(t)) || oe(e, t));
}
function gi(e) {
  const { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [l], slots: c, attrs: a, emit: h, render: m, renderCache: u, props: y, data: w, setupState: b, ctx: F, inheritAttrs: T } = e, K = Tn(e);
  let W, D;
  try {
    if (n.shapeFlag & 4) {
      const L = i || r, Q = L;
      W = rt(m.call(Q, L, u, y, b, w, F)), D = a;
    } else {
      const L = t;
      W = rt(L.length > 1 ? L(y, { attrs: a, slots: c, emit: h }) : L(y, null)), D = t.props ? a : rc(a);
    }
  } catch (L) {
    on.length = 0, kn(L, e, 1), W = je(_t);
  }
  let j = W;
  if (D && T !== false) {
    const L = Object.keys(D), { shapeFlag: Q } = j;
    L.length && Q & 7 && (l && L.some(Fr) && (D = ic(D, l)), j = $t(j, D, false, true));
  }
  return n.dirs && (j = $t(j, null, false, true), j.dirs = j.dirs ? j.dirs.concat(n.dirs) : n.dirs), n.transition && Jr(j, n.transition), W = j, Tn(K), W;
}
const rc = (e) => {
  let t;
  for (const n in e) (n === "class" || n === "style" || Mn(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, ic = (e, t) => {
  const n = {};
  for (const r in e) (!Fr(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
  return n;
};
function sc(e, t, n) {
  const { props: r, children: i, component: l } = e, { props: c, children: a, patchFlag: h } = t, m = l.emitsOptions;
  if (t.dirs || t.transition) return true;
  if (n && h >= 0) {
    if (h & 1024) return true;
    if (h & 16) return r ? mi(r, c, m) : !!c;
    if (h & 8) {
      const u = t.dynamicProps;
      for (let y = 0; y < u.length; y++) {
        const w = u[y];
        if (Js(c, r, w) && !Kn(m, w)) return true;
      }
    }
  } else return (i || a) && (!a || !a.$stable) ? true : r === c ? false : r ? c ? mi(r, c, m) : true : !!c;
  return false;
}
function mi(e, t, n) {
  const r = Object.keys(t);
  if (r.length !== Object.keys(e).length) return true;
  for (let i = 0; i < r.length; i++) {
    const l = r[i];
    if (Js(t, e, l) && !Kn(n, l)) return true;
  }
  return false;
}
function Js(e, t, n) {
  const r = e[n], i = t[n];
  return n === "style" && le(r) && le(i) ? !Lr(r, i) : r !== i;
}
function oc({ vnode: e, parent: t }, n) {
  for (; t; ) {
    const r = t.subTree;
    if (r.suspense && r.suspense.activeBranch === e && (r.el = e.el), r === e) (e = t.vnode).el = n, t = t.parent;
    else break;
  }
}
const zs = {}, Qs = () => Object.create(zs), Xs = (e) => Object.getPrototypeOf(e) === zs;
function lc(e, t, n, r = false) {
  const i = {}, l = Qs();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), Zs(e, t, i, l);
  for (const c in e.propsOptions[0]) c in i || (i[c] = void 0);
  n ? e.props = r ? i : Rs(i) : e.type.props ? e.props = i : e.props = l, e.attrs = l;
}
function cc(e, t, n, r) {
  const { props: i, attrs: l, vnode: { patchFlag: c } } = e, a = re(i), [h] = e.propsOptions;
  let m = false;
  if ((r || c > 0) && !(c & 16)) {
    if (c & 8) {
      const u = e.vnode.dynamicProps;
      for (let y = 0; y < u.length; y++) {
        let w = u[y];
        if (Kn(e.emitsOptions, w)) continue;
        const b = t[w];
        if (h) if (oe(l, w)) b !== l[w] && (l[w] = b, m = true);
        else {
          const F = qe(w);
          i[F] = Er(h, a, F, b, e, false);
        }
        else b !== l[w] && (l[w] = b, m = true);
      }
    }
  } else {
    Zs(e, t, i, l) && (m = true);
    let u;
    for (const y in a) (!t || !oe(t, y) && ((u = St(y)) === y || !oe(t, u))) && (h ? n && (n[y] !== void 0 || n[u] !== void 0) && (i[y] = Er(h, a, y, void 0, e, true)) : delete i[y]);
    if (l !== a) for (const y in l) (!t || !oe(t, y)) && (delete l[y], m = true);
  }
  m && ht(e.attrs, "set", "");
}
function Zs(e, t, n, r) {
  const [i, l] = e.propsOptions;
  let c = false, a;
  if (t) for (let h in t) {
    if (Zt(h)) continue;
    const m = t[h];
    let u;
    i && oe(i, u = qe(h)) ? !l || !l.includes(u) ? n[u] = m : (a || (a = {}))[u] = m : Kn(e.emitsOptions, h) || (!(h in r) || m !== r[h]) && (r[h] = m, c = true);
  }
  if (l) {
    const h = re(n), m = a || fe;
    for (let u = 0; u < l.length; u++) {
      const y = l[u];
      n[y] = Er(i, h, y, m[y], e, !oe(m, y));
    }
  }
  return c;
}
function Er(e, t, n, r, i, l) {
  const c = e[n];
  if (c != null) {
    const a = oe(c, "default");
    if (a && r === void 0) {
      const h = c.default;
      if (c.type !== Function && !c.skipFactory && J(h)) {
        const { propsDefaults: m } = i;
        if (n in m) r = m[n];
        else {
          const u = xn(i);
          r = m[n] = h.call(null, t), u();
        }
      } else r = h;
      i.ce && i.ce._setProp(n, r);
    }
    c[0] && (l && !a ? r = false : c[1] && (r === "" || r === St(n)) && (r = true));
  }
  return r;
}
const uc = /* @__PURE__ */ new WeakMap();
function eo(e, t, n = false) {
  const r = n ? uc : t.propsCache, i = r.get(e);
  if (i) return i;
  const l = e.props, c = {}, a = [];
  let h = false;
  if (!J(e)) {
    const u = (y) => {
      h = true;
      const [w, b] = eo(y, t, true);
      Re(c, w), b && a.push(...b);
    };
    !n && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u);
  }
  if (!l && !h) return le(e) && r.set(e, Vt), Vt;
  if ($(l)) for (let u = 0; u < l.length; u++) {
    const y = qe(l[u]);
    yi(y) && (c[y] = fe);
  }
  else if (l) for (const u in l) {
    const y = qe(u);
    if (yi(y)) {
      const w = l[u], b = c[y] = $(w) || J(w) ? { type: w } : Re({}, w), F = b.type;
      let T = false, K = true;
      if ($(F)) for (let W = 0; W < F.length; ++W) {
        const D = F[W], j = J(D) && D.name;
        if (j === "Boolean") {
          T = true;
          break;
        } else j === "String" && (K = false);
      }
      else T = J(F) && F.name === "Boolean";
      b[0] = T, b[1] = K, (T || oe(b, "default")) && a.push(y);
    }
  }
  const m = [c, a];
  return le(e) && r.set(e, m), m;
}
function yi(e) {
  return e[0] !== "$" && !Zt(e);
}
const zr = (e) => e === "_" || e === "_ctx" || e === "$stable", Qr = (e) => $(e) ? e.map(rt) : [rt(e)], fc = (e, t, n) => {
  if (t._n) return t;
  const r = Rl((...i) => Qr(t(...i)), n);
  return r._c = false, r;
}, to = (e, t, n) => {
  const r = e._ctx;
  for (const i in e) {
    if (zr(i)) continue;
    const l = e[i];
    if (J(l)) t[i] = fc(i, l, r);
    else if (l != null) {
      const c = Qr(l);
      t[i] = () => c;
    }
  }
}, no = (e, t) => {
  const n = Qr(t);
  e.slots.default = () => n;
}, ro = (e, t, n) => {
  for (const r in t) (n || !zr(r)) && (e[r] = t[r]);
}, ac = (e, t, n) => {
  const r = e.slots = Qs();
  if (e.vnode.shapeFlag & 32) {
    const i = t._;
    i ? (ro(r, t, n), n && ss(r, "_", i, true)) : to(t, r);
  } else t && no(e, t);
}, hc = (e, t, n) => {
  const { vnode: r, slots: i } = e;
  let l = true, c = fe;
  if (r.shapeFlag & 32) {
    const a = t._;
    a ? n && a === 1 ? l = false : ro(i, t, n) : (l = !t.$stable, to(t, i)), c = t;
  } else t && (no(e, t), c = { default: 1 });
  if (l) for (const a in i) !zr(a) && c[a] == null && delete i[a];
}, Le = yc;
function pc(e) {
  return dc(e);
}
function dc(e, t) {
  const n = jn();
  n.__VUE__ = true;
  const { insert: r, remove: i, patchProp: l, createElement: c, createText: a, createComment: h, setText: m, setElementText: u, parentNode: y, nextSibling: w, setScopeId: b = st, insertStaticContent: F } = e, T = (d, g, x, I = null, S = null, v = null, P = void 0, O = null, B = !!g.dynamicChildren) => {
    if (d === g) return;
    d && !zt(d, g) && (I = R(d), Ce(d, S, v, true), d = null), g.patchFlag === -2 && (B = false, g.dynamicChildren = null);
    const { type: C, ref: G, shapeFlag: M } = g;
    switch (C) {
      case Wn:
        K(d, g, x, I);
        break;
      case _t:
        W(d, g, x, I);
        break;
      case ir:
        d == null && D(g, x, I, P);
        break;
      case Ke:
        Fe(d, g, x, I, S, v, P, O, B);
        break;
      default:
        M & 1 ? Q(d, g, x, I, S, v, P, O, B) : M & 6 ? Se(d, g, x, I, S, v, P, O, B) : (M & 64 || M & 128) && C.process(d, g, x, I, S, v, P, O, B, V);
    }
    G != null && S ? rn(G, d && d.ref, v, g || d, !g) : G == null && d && d.ref != null && rn(d.ref, null, v, d, true);
  }, K = (d, g, x, I) => {
    if (d == null) r(g.el = a(g.children), x, I);
    else {
      const S = g.el = d.el;
      g.children !== d.children && m(S, g.children);
    }
  }, W = (d, g, x, I) => {
    d == null ? r(g.el = h(g.children || ""), x, I) : g.el = d.el;
  }, D = (d, g, x, I) => {
    [d.el, d.anchor] = F(d.children, g, x, I, d.el, d.anchor);
  }, j = ({ el: d, anchor: g }, x, I) => {
    let S;
    for (; d && d !== g; ) S = w(d), r(d, x, I), d = S;
    r(g, x, I);
  }, L = ({ el: d, anchor: g }) => {
    let x;
    for (; d && d !== g; ) x = w(d), i(d), d = x;
    i(g);
  }, Q = (d, g, x, I, S, v, P, O, B) => {
    if (g.type === "svg" ? P = "svg" : g.type === "math" && (P = "mathml"), d == null) Ee(g, x, I, S, v, P, O, B);
    else {
      const C = d.el && d.el._isVueCE ? d.el : null;
      try {
        C && C._beginPatch(), Z(d, g, S, v, P, O, B);
      } finally {
        C && C._endPatch();
      }
    }
  }, Ee = (d, g, x, I, S, v, P, O) => {
    let B, C;
    const { props: G, shapeFlag: M, transition: H, dirs: k } = d;
    if (B = d.el = c(d.type, v, G && G.is, G), M & 8 ? u(B, d.children) : M & 16 && q(d.children, B, null, I, S, rr(d, v), P, O), k && Ct(d, null, I, "created"), ie(B, d, d.scopeId, P, I), G) {
      for (const ce in G) ce !== "value" && !Zt(ce) && l(B, ce, null, G[ce], v, I);
      "value" in G && l(B, "value", null, G.value, v), (C = G.onVnodeBeforeMount) && tt(C, I, d);
    }
    k && Ct(d, null, I, "beforeMount");
    const ee = gc(S, H);
    ee && H.beforeEnter(B), r(B, g, x), ((C = G && G.onVnodeMounted) || ee || k) && Le(() => {
      C && tt(C, I, d), ee && H.enter(B), k && Ct(d, null, I, "mounted");
    }, S);
  }, ie = (d, g, x, I, S) => {
    if (x && b(d, x), I) for (let v = 0; v < I.length; v++) b(d, I[v]);
    if (S) {
      let v = S.subTree;
      if (g === v || lo(v.type) && (v.ssContent === g || v.ssFallback === g)) {
        const P = S.vnode;
        ie(d, P, P.scopeId, P.slotScopeIds, S.parent);
      }
    }
  }, q = (d, g, x, I, S, v, P, O, B = 0) => {
    for (let C = B; C < d.length; C++) {
      const G = d[C] = O ? at(d[C]) : rt(d[C]);
      T(null, G, g, x, I, S, v, P, O);
    }
  }, Z = (d, g, x, I, S, v, P) => {
    const O = g.el = d.el;
    let { patchFlag: B, dynamicChildren: C, dirs: G } = g;
    B |= d.patchFlag & 16;
    const M = d.props || fe, H = g.props || fe;
    let k;
    if (x && Bt(x, false), (k = H.onVnodeBeforeUpdate) && tt(k, x, g, d), G && Ct(g, d, x, "beforeUpdate"), x && Bt(x, true), (M.innerHTML && H.innerHTML == null || M.textContent && H.textContent == null) && u(O, ""), C ? ae(d.dynamicChildren, C, O, x, I, rr(g, S), v) : P || ne(d, g, O, null, x, I, rr(g, S), v, false), B > 0) {
      if (B & 16) ve(O, M, H, x, S);
      else if (B & 2 && M.class !== H.class && l(O, "class", null, H.class, S), B & 4 && l(O, "style", M.style, H.style, S), B & 8) {
        const ee = g.dynamicProps;
        for (let ce = 0; ce < ee.length; ce++) {
          const te = ee[ce], Be = M[te], f = H[te];
          (f !== Be || te === "value") && l(O, te, Be, f, S, x);
        }
      }
      B & 1 && d.children !== g.children && u(O, g.children);
    } else !P && C == null && ve(O, M, H, x, S);
    ((k = H.onVnodeUpdated) || G) && Le(() => {
      k && tt(k, x, g, d), G && Ct(g, d, x, "updated");
    }, I);
  }, ae = (d, g, x, I, S, v, P) => {
    for (let O = 0; O < g.length; O++) {
      const B = d[O], C = g[O], G = B.el && (B.type === Ke || !zt(B, C) || B.shapeFlag & 198) ? y(B.el) : x;
      T(B, C, G, null, I, S, v, P, true);
    }
  }, ve = (d, g, x, I, S) => {
    if (g !== x) {
      if (g !== fe) for (const v in g) !Zt(v) && !(v in x) && l(d, v, g[v], null, S, I);
      for (const v in x) {
        if (Zt(v)) continue;
        const P = x[v], O = g[v];
        P !== O && v !== "value" && l(d, v, O, P, S, I);
      }
      "value" in x && l(d, "value", g.value, x.value, S);
    }
  }, Fe = (d, g, x, I, S, v, P, O, B) => {
    const C = g.el = d ? d.el : a(""), G = g.anchor = d ? d.anchor : a("");
    let { patchFlag: M, dynamicChildren: H, slotScopeIds: k } = g;
    k && (O = O ? O.concat(k) : k), d == null ? (r(C, x, I), r(G, x, I), q(g.children || [], x, G, S, v, P, O, B)) : M > 0 && M & 64 && H && d.dynamicChildren && d.dynamicChildren.length === H.length ? (ae(d.dynamicChildren, H, x, S, v, P, O), (g.key != null || S && g === S.subTree) && io(d, g, true)) : ne(d, g, x, G, S, v, P, O, B);
  }, Se = (d, g, x, I, S, v, P, O, B) => {
    g.slotScopeIds = O, d == null ? g.shapeFlag & 512 ? S.ctx.activate(g, x, I, P, B) : lt(g, x, I, S, v, P, B) : Ze(d, g, B);
  }, lt = (d, g, x, I, S, v, P) => {
    const O = d.component = Ic(d, I, S);
    if (Ls(d) && (O.ctx.renderer = V), Rc(O, false, P), O.asyncDep) {
      if (S && S.registerDep(O, he, P), !d.el) {
        const B = O.subTree = je(_t);
        W(null, B, g, x), d.placeholder = B.el;
      }
    } else he(O, d, g, x, S, v, P);
  }, Ze = (d, g, x) => {
    const I = g.component = d.component;
    if (sc(d, g, x)) if (I.asyncDep && !I.asyncResolved) {
      Y(I, g, x);
      return;
    } else I.next = g, I.update();
    else g.el = d.el, I.vnode = g;
  }, he = (d, g, x, I, S, v, P) => {
    const O = () => {
      if (d.isMounted) {
        let { next: M, bu: H, u: k, parent: ee, vnode: ce } = d;
        {
          const o = so(d);
          if (o) {
            M && (M.el = ce.el, Y(d, M, P)), o.asyncDep.then(() => {
              Le(() => {
                d.isUnmounted || C();
              }, S);
            });
            return;
          }
        }
        let te = M, Be;
        Bt(d, false), M ? (M.el = ce.el, Y(d, M, P)) : M = ce, H && An(H), (Be = M.props && M.props.onVnodeBeforeUpdate) && tt(Be, ee, M, ce), Bt(d, true);
        const f = gi(d), s = d.subTree;
        d.subTree = f, T(s, f, y(s.el), R(s), d, S, v), M.el = f.el, te === null && oc(d, f.el), k && Le(k, S), (Be = M.props && M.props.onVnodeUpdated) && Le(() => tt(Be, ee, M, ce), S);
      } else {
        let M;
        const { el: H, props: k } = g, { bm: ee, m: ce, parent: te, root: Be, type: f } = d, s = Kt(g);
        Bt(d, false), ee && An(ee), !s && (M = k && k.onVnodeBeforeMount) && tt(M, te, g), Bt(d, true);
        {
          Be.ce && Be.ce._hasShadowRoot() && Be.ce._injectChildStyle(f);
          const o = d.subTree = gi(d);
          T(null, o, x, I, d, S, v), g.el = o.el;
        }
        if (ce && Le(ce, S), !s && (M = k && k.onVnodeMounted)) {
          const o = g;
          Le(() => tt(M, te, o), S);
        }
        (g.shapeFlag & 256 || te && Kt(te.vnode) && te.vnode.shapeFlag & 256) && d.a && Le(d.a, S), d.isMounted = true, g = x = I = null;
      }
    };
    d.scope.on();
    const B = d.effect = new hs(O);
    d.scope.off();
    const C = d.update = B.run.bind(B), G = d.job = B.runIfDirty.bind(B);
    G.i = d, G.id = d.uid, B.scheduler = () => qr(G), Bt(d, true), C();
  }, Y = (d, g, x) => {
    g.component = d;
    const I = d.vnode.props;
    d.vnode = g, d.next = null, cc(d, g.props, I, x), hc(d, g.children, x), gt(), li(d), mt();
  }, ne = (d, g, x, I, S, v, P, O, B = false) => {
    const C = d && d.children, G = d ? d.shapeFlag : 0, M = g.children, { patchFlag: H, shapeFlag: k } = g;
    if (H > 0) {
      if (H & 128) {
        et(C, M, x, I, S, v, P, O, B);
        return;
      } else if (H & 256) {
        Ye(C, M, x, I, S, v, P, O, B);
        return;
      }
    }
    k & 8 ? (G & 16 && Ne(C, S, v), M !== C && u(x, M)) : G & 16 ? k & 16 ? et(C, M, x, I, S, v, P, O, B) : Ne(C, S, v, true) : (G & 8 && u(x, ""), k & 16 && q(M, x, I, S, v, P, O, B));
  }, Ye = (d, g, x, I, S, v, P, O, B) => {
    d = d || Vt, g = g || Vt;
    const C = d.length, G = g.length, M = Math.min(C, G);
    let H;
    for (H = 0; H < M; H++) {
      const k = g[H] = B ? at(g[H]) : rt(g[H]);
      T(d[H], k, x, null, S, v, P, O, B);
    }
    C > G ? Ne(d, S, v, true, false, M) : q(g, x, I, S, v, P, O, B, M);
  }, et = (d, g, x, I, S, v, P, O, B) => {
    let C = 0;
    const G = g.length;
    let M = d.length - 1, H = G - 1;
    for (; C <= M && C <= H; ) {
      const k = d[C], ee = g[C] = B ? at(g[C]) : rt(g[C]);
      if (zt(k, ee)) T(k, ee, x, null, S, v, P, O, B);
      else break;
      C++;
    }
    for (; C <= M && C <= H; ) {
      const k = d[M], ee = g[H] = B ? at(g[H]) : rt(g[H]);
      if (zt(k, ee)) T(k, ee, x, null, S, v, P, O, B);
      else break;
      M--, H--;
    }
    if (C > M) {
      if (C <= H) {
        const k = H + 1, ee = k < G ? g[k].el : I;
        for (; C <= H; ) T(null, g[C] = B ? at(g[C]) : rt(g[C]), x, ee, S, v, P, O, B), C++;
      }
    } else if (C > H) for (; C <= M; ) Ce(d[C], S, v, true), C++;
    else {
      const k = C, ee = C, ce = /* @__PURE__ */ new Map();
      for (C = ee; C <= H; C++) {
        const E = g[C] = B ? at(g[C]) : rt(g[C]);
        E.key != null && ce.set(E.key, C);
      }
      let te, Be = 0;
      const f = H - ee + 1;
      let s = false, o = 0;
      const p = new Array(f);
      for (C = 0; C < f; C++) p[C] = 0;
      for (C = k; C <= M; C++) {
        const E = d[C];
        if (Be >= f) {
          Ce(E, S, v, true);
          continue;
        }
        let A;
        if (E.key != null) A = ce.get(E.key);
        else for (te = ee; te <= H; te++) if (p[te - ee] === 0 && zt(E, g[te])) {
          A = te;
          break;
        }
        A === void 0 ? Ce(E, S, v, true) : (p[A - ee] = C + 1, A >= o ? o = A : s = true, T(E, g[A], x, null, S, v, P, O, B), Be++);
      }
      const _ = s ? mc(p) : Vt;
      for (te = _.length - 1, C = f - 1; C >= 0; C--) {
        const E = ee + C, A = g[E], X = g[E + 1], ge = E + 1 < G ? X.el || oo(X) : I;
        p[C] === 0 ? T(null, A, x, ge, S, v, P, O, B) : s && (te < 0 || C !== _[te] ? ke(A, x, ge, 2) : te--);
      }
    }
  }, ke = (d, g, x, I, S = null) => {
    const { el: v, type: P, transition: O, children: B, shapeFlag: C } = d;
    if (C & 6) {
      ke(d.component.subTree, g, x, I);
      return;
    }
    if (C & 128) {
      d.suspense.move(g, x, I);
      return;
    }
    if (C & 64) {
      P.move(d, g, x, V);
      return;
    }
    if (P === Ke) {
      r(v, g, x);
      for (let M = 0; M < B.length; M++) ke(B[M], g, x, I);
      r(d.anchor, g, x);
      return;
    }
    if (P === ir) {
      j(d, g, x);
      return;
    }
    if (I !== 2 && C & 1 && O) if (I === 0) O.beforeEnter(v), r(v, g, x), Le(() => O.enter(v), S);
    else {
      const { leave: M, delayLeave: H, afterLeave: k } = O, ee = () => {
        d.ctx.isUnmounted ? i(v) : r(v, g, x);
      }, ce = () => {
        v._isLeaving && v[Fl](true), M(v, () => {
          ee(), k && k();
        });
      };
      H ? H(v, ee, ce) : ce();
    }
    else r(v, g, x);
  }, Ce = (d, g, x, I = false, S = false) => {
    const { type: v, props: P, ref: O, children: B, dynamicChildren: C, shapeFlag: G, patchFlag: M, dirs: H, cacheIndex: k } = d;
    if (M === -2 && (S = false), O != null && (gt(), rn(O, null, x, d, true), mt()), k != null && (g.renderCache[k] = void 0), G & 256) {
      g.ctx.deactivate(d);
      return;
    }
    const ee = G & 1 && H, ce = !Kt(d);
    let te;
    if (ce && (te = P && P.onVnodeBeforeUnmount) && tt(te, g, d), G & 6) ye(d.component, x, I);
    else {
      if (G & 128) {
        d.suspense.unmount(x, I);
        return;
      }
      ee && Ct(d, null, g, "beforeUnmount"), G & 64 ? d.type.remove(d, g, x, V, I) : C && !C.hasOnce && (v !== Ke || M > 0 && M & 64) ? Ne(C, g, x, false, true) : (v === Ke && M & 384 || !S && G & 16) && Ne(B, g, x), I && wt(d);
    }
    (ce && (te = P && P.onVnodeUnmounted) || ee) && Le(() => {
      te && tt(te, g, d), ee && Ct(d, null, g, "unmounted");
    }, x);
  }, wt = (d) => {
    const { type: g, el: x, anchor: I, transition: S } = d;
    if (g === Ke) {
      de(x, I);
      return;
    }
    if (g === ir) {
      L(d);
      return;
    }
    const v = () => {
      i(x), S && !S.persisted && S.afterLeave && S.afterLeave();
    };
    if (d.shapeFlag & 1 && S && !S.persisted) {
      const { leave: P, delayLeave: O } = S, B = () => P(x, v);
      O ? O(d.el, v, B) : B();
    } else v();
  }, de = (d, g) => {
    let x;
    for (; d !== g; ) x = w(d), i(d), d = x;
    i(g);
  }, ye = (d, g, x) => {
    const { bum: I, scope: S, job: v, subTree: P, um: O, m: B, a: C } = d;
    _i(B), _i(C), I && An(I), S.stop(), v && (v.flags |= 8, Ce(P, d, g, x)), O && Le(O, g), Le(() => {
      d.isUnmounted = true;
    }, g);
  }, Ne = (d, g, x, I = false, S = false, v = 0) => {
    for (let P = v; P < d.length; P++) Ce(d[P], g, x, I, S);
  }, R = (d) => {
    if (d.shapeFlag & 6) return R(d.component.subTree);
    if (d.shapeFlag & 128) return d.suspense.next();
    const g = w(d.anchor || d.el), x = g && g[Ol];
    return x ? w(x) : g;
  };
  let U = false;
  const N = (d, g, x) => {
    let I;
    d == null ? g._vnode && (Ce(g._vnode, null, null, true), I = g._vnode.component) : T(g._vnode || null, d, g, null, null, null, x), g._vnode = d, U || (U = true, li(I), Ps(), U = false);
  }, V = { p: T, um: Ce, m: ke, r: wt, mt: lt, mc: q, pc: ne, pbc: ae, n: R, o: e };
  return { render: N, hydrate: void 0, createApp: Zl(N) };
}
function rr({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Bt({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function gc(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function io(e, t, n = false) {
  const r = e.children, i = t.children;
  if ($(r) && $(i)) for (let l = 0; l < r.length; l++) {
    const c = r[l];
    let a = i[l];
    a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[l] = at(i[l]), a.el = c.el), !n && a.patchFlag !== -2 && io(c, a)), a.type === Wn && (a.patchFlag === -1 && (a = i[l] = at(a)), a.el = c.el), a.type === _t && !a.el && (a.el = c.el);
  }
}
function mc(e) {
  const t = e.slice(), n = [0];
  let r, i, l, c, a;
  const h = e.length;
  for (r = 0; r < h; r++) {
    const m = e[r];
    if (m !== 0) {
      if (i = n[n.length - 1], e[i] < m) {
        t[r] = i, n.push(r);
        continue;
      }
      for (l = 0, c = n.length - 1; l < c; ) a = l + c >> 1, e[n[a]] < m ? l = a + 1 : c = a;
      m < e[n[l]] && (l > 0 && (t[r] = n[l - 1]), n[l] = r);
    }
  }
  for (l = n.length, c = n[l - 1]; l-- > 0; ) n[l] = c, c = t[c];
  return n;
}
function so(e) {
  const t = e.subTree.component;
  if (t) return t.asyncDep && !t.asyncResolved ? t : so(t);
}
function _i(e) {
  if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function oo(e) {
  if (e.placeholder) return e.placeholder;
  const t = e.component;
  return t ? oo(t.subTree) : null;
}
const lo = (e) => e.__isSuspense;
function yc(e, t) {
  t && t.pendingBranch ? $(e) ? t.effects.push(...e) : t.effects.push(e) : Il(e);
}
const Ke = /* @__PURE__ */ Symbol.for("v-fgt"), Wn = /* @__PURE__ */ Symbol.for("v-txt"), _t = /* @__PURE__ */ Symbol.for("v-cmt"), ir = /* @__PURE__ */ Symbol.for("v-stc"), on = [];
let He = null;
function br(e = false) {
  on.push(He = e ? null : []);
}
function _c() {
  on.pop(), He = on[on.length - 1] || null;
}
let hn = 1;
function Fn(e, t = false) {
  hn += e, e < 0 && He && t && (He.hasOnce = true);
}
function co(e) {
  return e.dynamicChildren = hn > 0 ? He || Vt : null, _c(), hn > 0 && He && He.push(e), e;
}
function Pf(e, t, n, r, i, l) {
  return co(fo(e, t, n, r, i, l, true));
}
function Ar(e, t, n, r, i) {
  return co(je(e, t, n, r, i, true));
}
function pn(e) {
  return e ? e.__v_isVNode === true : false;
}
function zt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const uo = ({ key: e }) => e ?? null, In = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e != null ? be(e) || we(e) || J(e) ? { i: Ie, r: e, k: t, f: !!n } : e : null);
function fo(e, t = null, n = null, r = 0, i = null, l = e === Ke ? 0 : 1, c = false, a = false) {
  const h = { __v_isVNode: true, __v_skip: true, type: e, props: t, key: t && uo(t), ref: t && In(t), scopeId: Ns, slotScopeIds: null, children: n, component: null, suspense: null, ssContent: null, ssFallback: null, dirs: null, transition: null, el: null, anchor: null, target: null, targetStart: null, targetAnchor: null, staticCount: 0, shapeFlag: l, patchFlag: r, dynamicProps: i, dynamicChildren: null, appContext: null, ctx: Ie };
  return a ? (Xr(h, n), l & 128 && e.normalize(h)) : n && (h.shapeFlag |= be(n) ? 8 : 16), hn > 0 && !c && He && (h.patchFlag > 0 || l & 6) && h.patchFlag !== 32 && He.push(h), h;
}
const je = xc;
function xc(e, t = null, n = null, r = 0, i = null, l = false) {
  if ((!e || e === ks) && (e = _t), pn(e)) {
    const a = $t(e, t, true);
    return n && Xr(a, n), hn > 0 && !l && He && (a.shapeFlag & 6 ? He[He.indexOf(e)] = a : He.push(a)), a.patchFlag = -2, a;
  }
  if (Oc(e) && (e = e.__vccOpts), t) {
    t = wc(t);
    let { class: a, style: h } = t;
    a && !be(a) && (t.class = Ur(a)), le(h) && (Vn(h) && !$(h) && (h = Re({}, h)), t.style = Dr(h));
  }
  const c = be(e) ? 1 : lo(e) ? 128 : Pl(e) ? 64 : le(e) ? 4 : J(e) ? 2 : 0;
  return fo(e, t, n, r, i, c, l, true);
}
function wc(e) {
  return e ? Vn(e) || Xs(e) ? Re({}, e) : e : null;
}
function $t(e, t, n = false, r = false) {
  const { props: i, ref: l, patchFlag: c, children: a, transition: h } = e, m = t ? bc(i || {}, t) : i, u = { __v_isVNode: true, __v_skip: true, type: e.type, props: m, key: m && uo(m), ref: t && t.ref ? n && l ? $(l) ? l.concat(In(t)) : [l, In(t)] : In(t) : l, scopeId: e.scopeId, slotScopeIds: e.slotScopeIds, children: a, target: e.target, targetStart: e.targetStart, targetAnchor: e.targetAnchor, staticCount: e.staticCount, shapeFlag: e.shapeFlag, patchFlag: t && e.type !== Ke ? c === -1 ? 16 : c | 16 : c, dynamicProps: e.dynamicProps, dynamicChildren: e.dynamicChildren, appContext: e.appContext, dirs: e.dirs, transition: h, component: e.component, suspense: e.suspense, ssContent: e.ssContent && $t(e.ssContent), ssFallback: e.ssFallback && $t(e.ssFallback), placeholder: e.placeholder, el: e.el, anchor: e.anchor, ctx: e.ctx, ce: e.ce };
  return h && r && Jr(u, h.clone(u)), u;
}
function Ec(e = " ", t = 0) {
  return je(Wn, null, e, t);
}
function Ff(e = "", t = false) {
  return t ? (br(), Ar(_t, null, e)) : je(_t, null, e);
}
function rt(e) {
  return e == null || typeof e == "boolean" ? je(_t) : $(e) ? je(Ke, null, e.slice()) : pn(e) ? at(e) : je(Wn, null, String(e));
}
function at(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : $t(e);
}
function Xr(e, t) {
  let n = 0;
  const { shapeFlag: r } = e;
  if (t == null) t = null;
  else if ($(t)) n = 16;
  else if (typeof t == "object") if (r & 65) {
    const i = t.default;
    i && (i._c && (i._d = false), Xr(e, i()), i._c && (i._d = true));
    return;
  } else {
    n = 32;
    const i = t._;
    !i && !Xs(t) ? t._ctx = Ie : i === 3 && Ie && (Ie.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
  }
  else J(t) ? (t = { default: t, _ctx: Ie }, n = 32) : (t = String(t), r & 64 ? (n = 16, t = [Ec(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function bc(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const r = e[n];
    for (const i in r) if (i === "class") t.class !== r.class && (t.class = Ur([t.class, r.class]));
    else if (i === "style") t.style = Dr([t.style, r.style]);
    else if (Mn(i)) {
      const l = t[i], c = r[i];
      c && l !== c && !($(l) && l.includes(c)) && (t[i] = l ? [].concat(l, c) : c);
    } else i !== "" && (t[i] = r[i]);
  }
  return t;
}
function tt(e, t, n, r = null) {
  ot(e, t, 7, [n, r]);
}
const Ac = qs();
let vc = 0;
function Ic(e, t, n) {
  const r = e.type, i = (t ? t.appContext : e.appContext) || Ac, l = { uid: vc++, vnode: e, type: r, parent: t, appContext: i, root: null, next: null, subTree: null, effect: null, update: null, job: null, scope: new us(true), render: null, proxy: null, exposed: null, exposeProxy: null, withProxy: null, provides: t ? t.provides : Object.create(i.provides), ids: t ? t.ids : ["", 0, 0], accessCache: null, renderCache: [], components: null, directives: null, propsOptions: eo(r, i), emitsOptions: Ys(r, i), emit: null, emitted: null, propsDefaults: fe, inheritAttrs: r.inheritAttrs, ctx: fe, data: fe, props: fe, attrs: fe, slots: fe, refs: fe, setupState: fe, setupContext: null, suspense: n, suspenseId: n ? n.pendingId : 0, asyncDep: null, asyncResolved: false, isMounted: false, isUnmounted: false, isDeactivated: false, bc: null, c: null, bm: null, m: null, bu: null, u: null, um: null, bum: null, da: null, a: null, rtg: null, rtc: null, ec: null, sp: null };
  return l.ctx = { _: l }, l.root = t ? t.root : l, l.emit = tc.bind(null, l), e.ce && e.ce(l), l;
}
let Pe = null;
const ao = () => Pe || Ie;
let Nn, vr;
{
  const e = jn(), t = (n, r) => {
    let i;
    return (i = e[n]) || (i = e[n] = []), i.push(r), (l) => {
      i.length > 1 ? i.forEach((c) => c(l)) : i[0](l);
    };
  };
  Nn = t("__VUE_INSTANCE_SETTERS__", (n) => Pe = n), vr = t("__VUE_SSR_SETTERS__", (n) => dn = n);
}
const xn = (e) => {
  const t = Pe;
  return Nn(e), e.scope.on(), () => {
    e.scope.off(), Nn(t);
  };
}, xi = () => {
  Pe && Pe.scope.off(), Nn(null);
};
function ho(e) {
  return e.vnode.shapeFlag & 4;
}
let dn = false;
function Rc(e, t = false, n = false) {
  t && vr(t);
  const { props: r, children: i } = e.vnode, l = ho(e);
  lc(e, r, l, t), ac(e, i, n || t);
  const c = l ? Sc(e, t) : void 0;
  return t && vr(false), c;
}
function Sc(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, $l);
  const { setup: r } = n;
  if (r) {
    gt();
    const i = e.setupContext = r.length > 1 ? Bc(e) : null, l = xn(e), c = _n(r, e, 0, [e.props, i]), a = ns(c);
    if (mt(), l(), (a || e.sp) && !Kt(e) && Us(e), a) {
      if (c.then(xi, xi), t) return c.then((h) => {
        wi(e, h);
      }).catch((h) => {
        kn(h, e, 0);
      });
      e.asyncDep = c;
    } else wi(e, c);
  } else po(e);
}
function wi(e, t, n) {
  J(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : le(t) && (e.setupState = Bs(t)), po(e);
}
function po(e, t, n) {
  const r = e.type;
  e.render || (e.render = r.render || st);
  {
    const i = xn(e);
    gt();
    try {
      ql(e);
    } finally {
      mt(), i();
    }
  }
}
const Cc = { get(e, t) {
  return Oe(e, "get", ""), e[t];
} };
function Bc(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return { attrs: new Proxy(e.attrs, Cc), slots: e.slots, emit: e.emit, expose: t };
}
function $n(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(Bs(Wr(e.exposed)), { get(t, n) {
    if (n in t) return t[n];
    if (n in sn) return sn[n](e);
  }, has(t, n) {
    return n in t || n in sn;
  } })) : e.proxy;
}
function Tc(e, t = true) {
  return J(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Oc(e) {
  return J(e) && "__vccOpts" in e;
}
const We = (e, t) => wl(e, t, dn);
function go(e, t, n) {
  try {
    Fn(-1);
    const r = arguments.length;
    return r === 2 ? le(t) && !$(t) ? pn(t) ? je(e, null, [t]) : je(e, t) : je(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && pn(n) && (n = [n]), je(e, t, n));
  } finally {
    Fn(1);
  }
}
const Pc = "3.5.28";
let Ir;
const Ei = typeof window < "u" && window.trustedTypes;
if (Ei) try {
  Ir = Ei.createPolicy("vue", { createHTML: (e) => e });
} catch {
}
const mo = Ir ? (e) => Ir.createHTML(e) : (e) => e, Fc = "http://www.w3.org/2000/svg", Nc = "http://www.w3.org/1998/Math/MathML", ft = typeof document < "u" ? document : null, bi = ft && ft.createElement("template"), Mc = { insert: (e, t, n) => {
  t.insertBefore(e, n || null);
}, remove: (e) => {
  const t = e.parentNode;
  t && t.removeChild(e);
}, createElement: (e, t, n, r) => {
  const i = t === "svg" ? ft.createElementNS(Fc, e) : t === "mathml" ? ft.createElementNS(Nc, e) : n ? ft.createElement(e, { is: n }) : ft.createElement(e);
  return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
}, createText: (e) => ft.createTextNode(e), createComment: (e) => ft.createComment(e), setText: (e, t) => {
  e.nodeValue = t;
}, setElementText: (e, t) => {
  e.textContent = t;
}, parentNode: (e) => e.parentNode, nextSibling: (e) => e.nextSibling, querySelector: (e) => ft.querySelector(e), setScopeId(e, t) {
  e.setAttribute(t, "");
}, insertStaticContent(e, t, n, r, i, l) {
  const c = n ? n.previousSibling : t.lastChild;
  if (i && (i === l || i.nextSibling)) for (; t.insertBefore(i.cloneNode(true), n), !(i === l || !(i = i.nextSibling)); ) ;
  else {
    bi.innerHTML = mo(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
    const a = bi.content;
    if (r === "svg" || r === "mathml") {
      const h = a.firstChild;
      for (; h.firstChild; ) a.appendChild(h.firstChild);
      a.removeChild(h);
    }
    t.insertBefore(a, n);
  }
  return [c ? c.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
} }, Dc = /* @__PURE__ */ Symbol("_vtc");
function Uc(e, t, n) {
  const r = e[Dc];
  r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const Ai = /* @__PURE__ */ Symbol("_vod"), Lc = /* @__PURE__ */ Symbol("_vsh"), jc = /* @__PURE__ */ Symbol(""), Hc = /(?:^|;)\s*display\s*:/;
function Vc(e, t, n) {
  const r = e.style, i = be(n);
  let l = false;
  if (n && !i) {
    if (t) if (be(t)) for (const c of t.split(";")) {
      const a = c.slice(0, c.indexOf(":")).trim();
      n[a] == null && Rn(r, a, "");
    }
    else for (const c in t) n[c] == null && Rn(r, c, "");
    for (const c in n) c === "display" && (l = true), Rn(r, c, n[c]);
  } else if (i) {
    if (t !== n) {
      const c = r[jc];
      c && (n += ";" + c), r.cssText = n, l = Hc.test(n);
    }
  } else t && e.removeAttribute("style");
  Ai in e && (e[Ai] = l ? r.display : "", e[Lc] && (r.display = "none"));
}
const vi = /\s*!important$/;
function Rn(e, t, n) {
  if ($(n)) n.forEach((r) => Rn(e, t, r));
  else if (n == null && (n = ""), t.startsWith("--")) e.setProperty(t, n);
  else {
    const r = kc(e, t);
    vi.test(n) ? e.setProperty(St(r), n.replace(vi, ""), "important") : e[r] = n;
  }
}
const Ii = ["Webkit", "Moz", "ms"], sr = {};
function kc(e, t) {
  const n = sr[t];
  if (n) return n;
  let r = qe(t);
  if (r !== "filter" && r in e) return sr[t] = r;
  r = Ln(r);
  for (let i = 0; i < Ii.length; i++) {
    const l = Ii[i] + r;
    if (l in e) return sr[t] = l;
  }
  return t;
}
const Ri = "http://www.w3.org/1999/xlink";
function Si(e, t, n, r, i, l = Ko(t)) {
  r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Ri, t.slice(6, t.length)) : e.setAttributeNS(Ri, t, n) : n == null || l && !os(n) ? e.removeAttribute(t) : e.setAttribute(t, l ? "" : ze(n) ? String(n) : n);
}
function Ci(e, t, n, r, i) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? mo(n) : n);
    return;
  }
  const l = e.tagName;
  if (t === "value" && l !== "PROGRESS" && !l.includes("-")) {
    const a = l === "OPTION" ? e.getAttribute("value") || "" : e.value, h = n == null ? e.type === "checkbox" ? "on" : "" : String(n);
    (a !== h || !("_value" in e)) && (e.value = h), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let c = false;
  if (n === "" || n == null) {
    const a = typeof e[t];
    a === "boolean" ? n = os(n) : n == null && a === "string" ? (n = "", c = true) : a === "number" && (n = 0, c = true);
  }
  try {
    e[t] = n;
  } catch {
  }
  c && e.removeAttribute(i || t);
}
function jt(e, t, n, r) {
  e.addEventListener(t, n, r);
}
function Gc(e, t, n, r) {
  e.removeEventListener(t, n, r);
}
const Bi = /* @__PURE__ */ Symbol("_vei");
function Kc(e, t, n, r, i = null) {
  const l = e[Bi] || (e[Bi] = {}), c = l[t];
  if (r && c) c.value = r;
  else {
    const [a, h] = Wc(t);
    if (r) {
      const m = l[t] = Yc(r, i);
      jt(e, a, m, h);
    } else c && (Gc(e, a, c, h), l[t] = void 0);
  }
}
const Ti = /(?:Once|Passive|Capture)$/;
function Wc(e) {
  let t;
  if (Ti.test(e)) {
    t = {};
    let r;
    for (; r = e.match(Ti); ) e = e.slice(0, e.length - r[0].length), t[r[0].toLowerCase()] = true;
  }
  return [e[2] === ":" ? e.slice(3) : St(e.slice(2)), t];
}
let or = 0;
const $c = Promise.resolve(), qc = () => or || ($c.then(() => or = 0), or = Date.now());
function Yc(e, t) {
  const n = (r) => {
    if (!r._vts) r._vts = Date.now();
    else if (r._vts <= n.attached) return;
    ot(Jc(r, n.value), t, 5, [r]);
  };
  return n.value = e, n.attached = qc(), n;
}
function Jc(e, t) {
  if ($(t)) {
    const n = e.stopImmediatePropagation;
    return e.stopImmediatePropagation = () => {
      n.call(e), e._stopped = true;
    }, t.map((r) => (i) => !i._stopped && r && r(i));
  } else return t;
}
const Oi = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, zc = (e, t, n, r, i, l) => {
  const c = i === "svg";
  t === "class" ? Uc(e, r, c) : t === "style" ? Vc(e, n, r) : Mn(t) ? Fr(t) || Kc(e, t, n, r, l) : (t[0] === "." ? (t = t.slice(1), true) : t[0] === "^" ? (t = t.slice(1), false) : Qc(e, t, r, c)) ? (Ci(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Si(e, t, r, c, l, t !== "value")) : e._isVueCE && (/[A-Z]/.test(t) || !be(r)) ? Ci(e, qe(t), r, l, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Si(e, t, r, c));
};
function Qc(e, t, n, r) {
  if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Oi(t) && J(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return false;
  if (t === "width" || t === "height") {
    const i = e.tagName;
    if (i === "IMG" || i === "VIDEO" || i === "CANVAS" || i === "SOURCE") return false;
  }
  return Oi(t) && be(n) ? false : t in e;
}
const Pi = (e) => {
  const t = e.props["onUpdate:modelValue"] || false;
  return $(t) ? (n) => An(t, n) : t;
};
function Xc(e) {
  e.target.composing = true;
}
function Fi(e) {
  const t = e.target;
  t.composing && (t.composing = false, t.dispatchEvent(new Event("input")));
}
const lr = /* @__PURE__ */ Symbol("_assign");
function Ni(e, t, n) {
  return t && (e = e.trim()), n && (e = Mr(e)), e;
}
const Nf = { created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
  e[lr] = Pi(i);
  const l = r || i.props && i.props.type === "number";
  jt(e, t ? "change" : "input", (c) => {
    c.target.composing || e[lr](Ni(e.value, n, l));
  }), (n || l) && jt(e, "change", () => {
    e.value = Ni(e.value, n, l);
  }), t || (jt(e, "compositionstart", Xc), jt(e, "compositionend", Fi), jt(e, "change", Fi));
}, mounted(e, { value: t }) {
  e.value = t ?? "";
}, beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: l } }, c) {
  if (e[lr] = Pi(c), e.composing) return;
  const a = (l || e.type === "number") && !/^0\d/.test(e.value) ? Mr(e.value) : e.value, h = t ?? "";
  a !== h && (document.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === h) || (e.value = h));
} }, Zc = ["ctrl", "shift", "alt", "meta"], eu = { stop: (e) => e.stopPropagation(), prevent: (e) => e.preventDefault(), self: (e) => e.target !== e.currentTarget, ctrl: (e) => !e.ctrlKey, shift: (e) => !e.shiftKey, alt: (e) => !e.altKey, meta: (e) => !e.metaKey, left: (e) => "button" in e && e.button !== 0, middle: (e) => "button" in e && e.button !== 1, right: (e) => "button" in e && e.button !== 2, exact: (e, t) => Zc.some((n) => e[`${n}Key`] && !t.includes(n)) }, Mf = (e, t) => {
  if (!e) return e;
  const n = e._withMods || (e._withMods = {}), r = t.join(".");
  return n[r] || (n[r] = ((i, ...l) => {
    for (let c = 0; c < t.length; c++) {
      const a = eu[t[c]];
      if (a && a(i, t)) return;
    }
    return e(i, ...l);
  }));
}, tu = { esc: "escape", space: " ", up: "arrow-up", left: "arrow-left", right: "arrow-right", down: "arrow-down", delete: "backspace" }, Df = (e, t) => {
  const n = e._withKeys || (e._withKeys = {}), r = t.join(".");
  return n[r] || (n[r] = ((i) => {
    if (!("key" in i)) return;
    const l = St(i.key);
    if (t.some((c) => c === l || tu[c] === l)) return e(i);
  }));
}, nu = Re({ patchProp: zc }, Mc);
let Mi;
function ru() {
  return Mi || (Mi = pc(nu));
}
const Uf = ((...e) => {
  const t = ru().createApp(...e), { mount: n } = t;
  return t.mount = (r) => {
    const i = su(r);
    if (!i) return;
    const l = t._component;
    !J(l) && !l.render && !l.template && (l.template = i.innerHTML), i.nodeType === 1 && (i.textContent = "");
    const c = n(i, false, iu(i));
    return i instanceof Element && (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")), c;
  }, t;
});
function iu(e) {
  if (e instanceof SVGElement) return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function su(e) {
  return be(e) ? document.querySelector(e) : e;
}
var yo = {}, qn = {};
qn.byteLength = cu;
qn.toByteArray = fu;
qn.fromByteArray = pu;
var it = [], Ge = [], ou = typeof Uint8Array < "u" ? Uint8Array : Array, cr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Dt = 0, lu = cr.length; Dt < lu; ++Dt) it[Dt] = cr[Dt], Ge[cr.charCodeAt(Dt)] = Dt;
Ge[45] = 62;
Ge[95] = 63;
function _o(e) {
  var t = e.length;
  if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
  var n = e.indexOf("=");
  n === -1 && (n = t);
  var r = n === t ? 0 : 4 - n % 4;
  return [n, r];
}
function cu(e) {
  var t = _o(e), n = t[0], r = t[1];
  return (n + r) * 3 / 4 - r;
}
function uu(e, t, n) {
  return (t + n) * 3 / 4 - n;
}
function fu(e) {
  var t, n = _o(e), r = n[0], i = n[1], l = new ou(uu(e, r, i)), c = 0, a = i > 0 ? r - 4 : r, h;
  for (h = 0; h < a; h += 4) t = Ge[e.charCodeAt(h)] << 18 | Ge[e.charCodeAt(h + 1)] << 12 | Ge[e.charCodeAt(h + 2)] << 6 | Ge[e.charCodeAt(h + 3)], l[c++] = t >> 16 & 255, l[c++] = t >> 8 & 255, l[c++] = t & 255;
  return i === 2 && (t = Ge[e.charCodeAt(h)] << 2 | Ge[e.charCodeAt(h + 1)] >> 4, l[c++] = t & 255), i === 1 && (t = Ge[e.charCodeAt(h)] << 10 | Ge[e.charCodeAt(h + 1)] << 4 | Ge[e.charCodeAt(h + 2)] >> 2, l[c++] = t >> 8 & 255, l[c++] = t & 255), l;
}
function au(e) {
  return it[e >> 18 & 63] + it[e >> 12 & 63] + it[e >> 6 & 63] + it[e & 63];
}
function hu(e, t, n) {
  for (var r, i = [], l = t; l < n; l += 3) r = (e[l] << 16 & 16711680) + (e[l + 1] << 8 & 65280) + (e[l + 2] & 255), i.push(au(r));
  return i.join("");
}
function pu(e) {
  for (var t, n = e.length, r = n % 3, i = [], l = 16383, c = 0, a = n - r; c < a; c += l) i.push(hu(e, c, c + l > a ? a : c + l));
  return r === 1 ? (t = e[n - 1], i.push(it[t >> 2] + it[t << 4 & 63] + "==")) : r === 2 && (t = (e[n - 2] << 8) + e[n - 1], i.push(it[t >> 10] + it[t >> 4 & 63] + it[t << 2 & 63] + "=")), i.join("");
}
var Zr = {};
Zr.read = function(e, t, n, r, i) {
  var l, c, a = i * 8 - r - 1, h = (1 << a) - 1, m = h >> 1, u = -7, y = n ? i - 1 : 0, w = n ? -1 : 1, b = e[t + y];
  for (y += w, l = b & (1 << -u) - 1, b >>= -u, u += a; u > 0; l = l * 256 + e[t + y], y += w, u -= 8) ;
  for (c = l & (1 << -u) - 1, l >>= -u, u += r; u > 0; c = c * 256 + e[t + y], y += w, u -= 8) ;
  if (l === 0) l = 1 - m;
  else {
    if (l === h) return c ? NaN : (b ? -1 : 1) * (1 / 0);
    c = c + Math.pow(2, r), l = l - m;
  }
  return (b ? -1 : 1) * c * Math.pow(2, l - r);
};
Zr.write = function(e, t, n, r, i, l) {
  var c, a, h, m = l * 8 - i - 1, u = (1 << m) - 1, y = u >> 1, w = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, b = r ? 0 : l - 1, F = r ? 1 : -1, T = t < 0 || t === 0 && 1 / t < 0 ? 1 : 0;
  for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (a = isNaN(t) ? 1 : 0, c = u) : (c = Math.floor(Math.log(t) / Math.LN2), t * (h = Math.pow(2, -c)) < 1 && (c--, h *= 2), c + y >= 1 ? t += w / h : t += w * Math.pow(2, 1 - y), t * h >= 2 && (c++, h /= 2), c + y >= u ? (a = 0, c = u) : c + y >= 1 ? (a = (t * h - 1) * Math.pow(2, i), c = c + y) : (a = t * Math.pow(2, y - 1) * Math.pow(2, i), c = 0)); i >= 8; e[n + b] = a & 255, b += F, a /= 256, i -= 8) ;
  for (c = c << i | a, m += i; m > 0; e[n + b] = c & 255, b += F, c /= 256, m -= 8) ;
  e[n + b - F] |= T * 128;
};
(function(e) {
  const t = qn, n = Zr, r = typeof Symbol == "function" && typeof Symbol.for == "function" ? /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom") : null;
  e.Buffer = u, e.SlowBuffer = Q, e.INSPECT_MAX_BYTES = 50;
  const i = 2147483647;
  e.kMaxLength = i;
  const { Uint8Array: l, ArrayBuffer: c, SharedArrayBuffer: a } = globalThis;
  u.TYPED_ARRAY_SUPPORT = h(), !u.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
  function h() {
    try {
      const f = new l(1), s = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(s, l.prototype), Object.setPrototypeOf(f, s), f.foo() === 42;
    } catch {
      return false;
    }
  }
  Object.defineProperty(u.prototype, "parent", { enumerable: true, get: function() {
    if (u.isBuffer(this)) return this.buffer;
  } }), Object.defineProperty(u.prototype, "offset", { enumerable: true, get: function() {
    if (u.isBuffer(this)) return this.byteOffset;
  } });
  function m(f) {
    if (f > i) throw new RangeError('The value "' + f + '" is invalid for option "size"');
    const s = new l(f);
    return Object.setPrototypeOf(s, u.prototype), s;
  }
  function u(f, s, o) {
    if (typeof f == "number") {
      if (typeof s == "string") throw new TypeError('The "string" argument must be of type string. Received type number');
      return F(f);
    }
    return y(f, s, o);
  }
  u.poolSize = 8192;
  function y(f, s, o) {
    if (typeof f == "string") return T(f, s);
    if (c.isView(f)) return W(f);
    if (f == null) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof f);
    if (k(f, c) || f && k(f.buffer, c) || typeof a < "u" && (k(f, a) || f && k(f.buffer, a))) return D(f, s, o);
    if (typeof f == "number") throw new TypeError('The "value" argument must not be of type number. Received type number');
    const p = f.valueOf && f.valueOf();
    if (p != null && p !== f) return u.from(p, s, o);
    const _ = j(f);
    if (_) return _;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof f[Symbol.toPrimitive] == "function") return u.from(f[Symbol.toPrimitive]("string"), s, o);
    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof f);
  }
  u.from = function(f, s, o) {
    return y(f, s, o);
  }, Object.setPrototypeOf(u.prototype, l.prototype), Object.setPrototypeOf(u, l);
  function w(f) {
    if (typeof f != "number") throw new TypeError('"size" argument must be of type number');
    if (f < 0) throw new RangeError('The value "' + f + '" is invalid for option "size"');
  }
  function b(f, s, o) {
    return w(f), f <= 0 ? m(f) : s !== void 0 ? typeof o == "string" ? m(f).fill(s, o) : m(f).fill(s) : m(f);
  }
  u.alloc = function(f, s, o) {
    return b(f, s, o);
  };
  function F(f) {
    return w(f), m(f < 0 ? 0 : L(f) | 0);
  }
  u.allocUnsafe = function(f) {
    return F(f);
  }, u.allocUnsafeSlow = function(f) {
    return F(f);
  };
  function T(f, s) {
    if ((typeof s != "string" || s === "") && (s = "utf8"), !u.isEncoding(s)) throw new TypeError("Unknown encoding: " + s);
    const o = Ee(f, s) | 0;
    let p = m(o);
    const _ = p.write(f, s);
    return _ !== o && (p = p.slice(0, _)), p;
  }
  function K(f) {
    const s = f.length < 0 ? 0 : L(f.length) | 0, o = m(s);
    for (let p = 0; p < s; p += 1) o[p] = f[p] & 255;
    return o;
  }
  function W(f) {
    if (k(f, l)) {
      const s = new l(f);
      return D(s.buffer, s.byteOffset, s.byteLength);
    }
    return K(f);
  }
  function D(f, s, o) {
    if (s < 0 || f.byteLength < s) throw new RangeError('"offset" is outside of buffer bounds');
    if (f.byteLength < s + (o || 0)) throw new RangeError('"length" is outside of buffer bounds');
    let p;
    return s === void 0 && o === void 0 ? p = new l(f) : o === void 0 ? p = new l(f, s) : p = new l(f, s, o), Object.setPrototypeOf(p, u.prototype), p;
  }
  function j(f) {
    if (u.isBuffer(f)) {
      const s = L(f.length) | 0, o = m(s);
      return o.length === 0 || f.copy(o, 0, 0, s), o;
    }
    if (f.length !== void 0) return typeof f.length != "number" || ee(f.length) ? m(0) : K(f);
    if (f.type === "Buffer" && Array.isArray(f.data)) return K(f.data);
  }
  function L(f) {
    if (f >= i) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i.toString(16) + " bytes");
    return f | 0;
  }
  function Q(f) {
    return +f != f && (f = 0), u.alloc(+f);
  }
  u.isBuffer = function(s) {
    return s != null && s._isBuffer === true && s !== u.prototype;
  }, u.compare = function(s, o) {
    if (k(s, l) && (s = u.from(s, s.offset, s.byteLength)), k(o, l) && (o = u.from(o, o.offset, o.byteLength)), !u.isBuffer(s) || !u.isBuffer(o)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
    if (s === o) return 0;
    let p = s.length, _ = o.length;
    for (let E = 0, A = Math.min(p, _); E < A; ++E) if (s[E] !== o[E]) {
      p = s[E], _ = o[E];
      break;
    }
    return p < _ ? -1 : _ < p ? 1 : 0;
  }, u.isEncoding = function(s) {
    switch (String(s).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return true;
      default:
        return false;
    }
  }, u.concat = function(s, o) {
    if (!Array.isArray(s)) throw new TypeError('"list" argument must be an Array of Buffers');
    if (s.length === 0) return u.alloc(0);
    let p;
    if (o === void 0) for (o = 0, p = 0; p < s.length; ++p) o += s[p].length;
    const _ = u.allocUnsafe(o);
    let E = 0;
    for (p = 0; p < s.length; ++p) {
      let A = s[p];
      if (k(A, l)) E + A.length > _.length ? (u.isBuffer(A) || (A = u.from(A)), A.copy(_, E)) : l.prototype.set.call(_, A, E);
      else if (u.isBuffer(A)) A.copy(_, E);
      else throw new TypeError('"list" argument must be an Array of Buffers');
      E += A.length;
    }
    return _;
  };
  function Ee(f, s) {
    if (u.isBuffer(f)) return f.length;
    if (c.isView(f) || k(f, c)) return f.byteLength;
    if (typeof f != "string") throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof f);
    const o = f.length, p = arguments.length > 2 && arguments[2] === true;
    if (!p && o === 0) return 0;
    let _ = false;
    for (; ; ) switch (s) {
      case "ascii":
      case "latin1":
      case "binary":
        return o;
      case "utf8":
      case "utf-8":
        return B(f).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return o * 2;
      case "hex":
        return o >>> 1;
      case "base64":
        return M(f).length;
      default:
        if (_) return p ? -1 : B(f).length;
        s = ("" + s).toLowerCase(), _ = true;
    }
  }
  u.byteLength = Ee;
  function ie(f, s, o) {
    let p = false;
    if ((s === void 0 || s < 0) && (s = 0), s > this.length || ((o === void 0 || o > this.length) && (o = this.length), o <= 0) || (o >>>= 0, s >>>= 0, o <= s)) return "";
    for (f || (f = "utf8"); ; ) switch (f) {
      case "hex":
        return Ce(this, s, o);
      case "utf8":
      case "utf-8":
        return Y(this, s, o);
      case "ascii":
        return et(this, s, o);
      case "latin1":
      case "binary":
        return ke(this, s, o);
      case "base64":
        return he(this, s, o);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return wt(this, s, o);
      default:
        if (p) throw new TypeError("Unknown encoding: " + f);
        f = (f + "").toLowerCase(), p = true;
    }
  }
  u.prototype._isBuffer = true;
  function q(f, s, o) {
    const p = f[s];
    f[s] = f[o], f[o] = p;
  }
  u.prototype.swap16 = function() {
    const s = this.length;
    if (s % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let o = 0; o < s; o += 2) q(this, o, o + 1);
    return this;
  }, u.prototype.swap32 = function() {
    const s = this.length;
    if (s % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let o = 0; o < s; o += 4) q(this, o, o + 3), q(this, o + 1, o + 2);
    return this;
  }, u.prototype.swap64 = function() {
    const s = this.length;
    if (s % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let o = 0; o < s; o += 8) q(this, o, o + 7), q(this, o + 1, o + 6), q(this, o + 2, o + 5), q(this, o + 3, o + 4);
    return this;
  }, u.prototype.toString = function() {
    const s = this.length;
    return s === 0 ? "" : arguments.length === 0 ? Y(this, 0, s) : ie.apply(this, arguments);
  }, u.prototype.toLocaleString = u.prototype.toString, u.prototype.equals = function(s) {
    if (!u.isBuffer(s)) throw new TypeError("Argument must be a Buffer");
    return this === s ? true : u.compare(this, s) === 0;
  }, u.prototype.inspect = function() {
    let s = "";
    const o = e.INSPECT_MAX_BYTES;
    return s = this.toString("hex", 0, o).replace(/(.{2})/g, "$1 ").trim(), this.length > o && (s += " ... "), "<Buffer " + s + ">";
  }, r && (u.prototype[r] = u.prototype.inspect), u.prototype.compare = function(s, o, p, _, E) {
    if (k(s, l) && (s = u.from(s, s.offset, s.byteLength)), !u.isBuffer(s)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof s);
    if (o === void 0 && (o = 0), p === void 0 && (p = s ? s.length : 0), _ === void 0 && (_ = 0), E === void 0 && (E = this.length), o < 0 || p > s.length || _ < 0 || E > this.length) throw new RangeError("out of range index");
    if (_ >= E && o >= p) return 0;
    if (_ >= E) return -1;
    if (o >= p) return 1;
    if (o >>>= 0, p >>>= 0, _ >>>= 0, E >>>= 0, this === s) return 0;
    let A = E - _, X = p - o;
    const ge = Math.min(A, X), me = this.slice(_, E), _e = s.slice(o, p);
    for (let ue = 0; ue < ge; ++ue) if (me[ue] !== _e[ue]) {
      A = me[ue], X = _e[ue];
      break;
    }
    return A < X ? -1 : X < A ? 1 : 0;
  };
  function Z(f, s, o, p, _) {
    if (f.length === 0) return -1;
    if (typeof o == "string" ? (p = o, o = 0) : o > 2147483647 ? o = 2147483647 : o < -2147483648 && (o = -2147483648), o = +o, ee(o) && (o = _ ? 0 : f.length - 1), o < 0 && (o = f.length + o), o >= f.length) {
      if (_) return -1;
      o = f.length - 1;
    } else if (o < 0) if (_) o = 0;
    else return -1;
    if (typeof s == "string" && (s = u.from(s, p)), u.isBuffer(s)) return s.length === 0 ? -1 : ae(f, s, o, p, _);
    if (typeof s == "number") return s = s & 255, typeof l.prototype.indexOf == "function" ? _ ? l.prototype.indexOf.call(f, s, o) : l.prototype.lastIndexOf.call(f, s, o) : ae(f, [s], o, p, _);
    throw new TypeError("val must be string, number or Buffer");
  }
  function ae(f, s, o, p, _) {
    let E = 1, A = f.length, X = s.length;
    if (p !== void 0 && (p = String(p).toLowerCase(), p === "ucs2" || p === "ucs-2" || p === "utf16le" || p === "utf-16le")) {
      if (f.length < 2 || s.length < 2) return -1;
      E = 2, A /= 2, X /= 2, o /= 2;
    }
    function ge(_e, ue) {
      return E === 1 ? _e[ue] : _e.readUInt16BE(ue * E);
    }
    let me;
    if (_) {
      let _e = -1;
      for (me = o; me < A; me++) if (ge(f, me) === ge(s, _e === -1 ? 0 : me - _e)) {
        if (_e === -1 && (_e = me), me - _e + 1 === X) return _e * E;
      } else _e !== -1 && (me -= me - _e), _e = -1;
    } else for (o + X > A && (o = A - X), me = o; me >= 0; me--) {
      let _e = true;
      for (let ue = 0; ue < X; ue++) if (ge(f, me + ue) !== ge(s, ue)) {
        _e = false;
        break;
      }
      if (_e) return me;
    }
    return -1;
  }
  u.prototype.includes = function(s, o, p) {
    return this.indexOf(s, o, p) !== -1;
  }, u.prototype.indexOf = function(s, o, p) {
    return Z(this, s, o, p, true);
  }, u.prototype.lastIndexOf = function(s, o, p) {
    return Z(this, s, o, p, false);
  };
  function ve(f, s, o, p) {
    o = Number(o) || 0;
    const _ = f.length - o;
    p ? (p = Number(p), p > _ && (p = _)) : p = _;
    const E = s.length;
    p > E / 2 && (p = E / 2);
    let A;
    for (A = 0; A < p; ++A) {
      const X = parseInt(s.substr(A * 2, 2), 16);
      if (ee(X)) return A;
      f[o + A] = X;
    }
    return A;
  }
  function Fe(f, s, o, p) {
    return H(B(s, f.length - o), f, o, p);
  }
  function Se(f, s, o, p) {
    return H(C(s), f, o, p);
  }
  function lt(f, s, o, p) {
    return H(M(s), f, o, p);
  }
  function Ze(f, s, o, p) {
    return H(G(s, f.length - o), f, o, p);
  }
  u.prototype.write = function(s, o, p, _) {
    if (o === void 0) _ = "utf8", p = this.length, o = 0;
    else if (p === void 0 && typeof o == "string") _ = o, p = this.length, o = 0;
    else if (isFinite(o)) o = o >>> 0, isFinite(p) ? (p = p >>> 0, _ === void 0 && (_ = "utf8")) : (_ = p, p = void 0);
    else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
    const E = this.length - o;
    if ((p === void 0 || p > E) && (p = E), s.length > 0 && (p < 0 || o < 0) || o > this.length) throw new RangeError("Attempt to write outside buffer bounds");
    _ || (_ = "utf8");
    let A = false;
    for (; ; ) switch (_) {
      case "hex":
        return ve(this, s, o, p);
      case "utf8":
      case "utf-8":
        return Fe(this, s, o, p);
      case "ascii":
      case "latin1":
      case "binary":
        return Se(this, s, o, p);
      case "base64":
        return lt(this, s, o, p);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return Ze(this, s, o, p);
      default:
        if (A) throw new TypeError("Unknown encoding: " + _);
        _ = ("" + _).toLowerCase(), A = true;
    }
  }, u.prototype.toJSON = function() {
    return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
  };
  function he(f, s, o) {
    return s === 0 && o === f.length ? t.fromByteArray(f) : t.fromByteArray(f.slice(s, o));
  }
  function Y(f, s, o) {
    o = Math.min(f.length, o);
    const p = [];
    let _ = s;
    for (; _ < o; ) {
      const E = f[_];
      let A = null, X = E > 239 ? 4 : E > 223 ? 3 : E > 191 ? 2 : 1;
      if (_ + X <= o) {
        let ge, me, _e, ue;
        switch (X) {
          case 1:
            E < 128 && (A = E);
            break;
          case 2:
            ge = f[_ + 1], (ge & 192) === 128 && (ue = (E & 31) << 6 | ge & 63, ue > 127 && (A = ue));
            break;
          case 3:
            ge = f[_ + 1], me = f[_ + 2], (ge & 192) === 128 && (me & 192) === 128 && (ue = (E & 15) << 12 | (ge & 63) << 6 | me & 63, ue > 2047 && (ue < 55296 || ue > 57343) && (A = ue));
            break;
          case 4:
            ge = f[_ + 1], me = f[_ + 2], _e = f[_ + 3], (ge & 192) === 128 && (me & 192) === 128 && (_e & 192) === 128 && (ue = (E & 15) << 18 | (ge & 63) << 12 | (me & 63) << 6 | _e & 63, ue > 65535 && ue < 1114112 && (A = ue));
        }
      }
      A === null ? (A = 65533, X = 1) : A > 65535 && (A -= 65536, p.push(A >>> 10 & 1023 | 55296), A = 56320 | A & 1023), p.push(A), _ += X;
    }
    return Ye(p);
  }
  const ne = 4096;
  function Ye(f) {
    const s = f.length;
    if (s <= ne) return String.fromCharCode.apply(String, f);
    let o = "", p = 0;
    for (; p < s; ) o += String.fromCharCode.apply(String, f.slice(p, p += ne));
    return o;
  }
  function et(f, s, o) {
    let p = "";
    o = Math.min(f.length, o);
    for (let _ = s; _ < o; ++_) p += String.fromCharCode(f[_] & 127);
    return p;
  }
  function ke(f, s, o) {
    let p = "";
    o = Math.min(f.length, o);
    for (let _ = s; _ < o; ++_) p += String.fromCharCode(f[_]);
    return p;
  }
  function Ce(f, s, o) {
    const p = f.length;
    (!s || s < 0) && (s = 0), (!o || o < 0 || o > p) && (o = p);
    let _ = "";
    for (let E = s; E < o; ++E) _ += ce[f[E]];
    return _;
  }
  function wt(f, s, o) {
    const p = f.slice(s, o);
    let _ = "";
    for (let E = 0; E < p.length - 1; E += 2) _ += String.fromCharCode(p[E] + p[E + 1] * 256);
    return _;
  }
  u.prototype.slice = function(s, o) {
    const p = this.length;
    s = ~~s, o = o === void 0 ? p : ~~o, s < 0 ? (s += p, s < 0 && (s = 0)) : s > p && (s = p), o < 0 ? (o += p, o < 0 && (o = 0)) : o > p && (o = p), o < s && (o = s);
    const _ = this.subarray(s, o);
    return Object.setPrototypeOf(_, u.prototype), _;
  };
  function de(f, s, o) {
    if (f % 1 !== 0 || f < 0) throw new RangeError("offset is not uint");
    if (f + s > o) throw new RangeError("Trying to access beyond buffer length");
  }
  u.prototype.readUintLE = u.prototype.readUIntLE = function(s, o, p) {
    s = s >>> 0, o = o >>> 0, p || de(s, o, this.length);
    let _ = this[s], E = 1, A = 0;
    for (; ++A < o && (E *= 256); ) _ += this[s + A] * E;
    return _;
  }, u.prototype.readUintBE = u.prototype.readUIntBE = function(s, o, p) {
    s = s >>> 0, o = o >>> 0, p || de(s, o, this.length);
    let _ = this[s + --o], E = 1;
    for (; o > 0 && (E *= 256); ) _ += this[s + --o] * E;
    return _;
  }, u.prototype.readUint8 = u.prototype.readUInt8 = function(s, o) {
    return s = s >>> 0, o || de(s, 1, this.length), this[s];
  }, u.prototype.readUint16LE = u.prototype.readUInt16LE = function(s, o) {
    return s = s >>> 0, o || de(s, 2, this.length), this[s] | this[s + 1] << 8;
  }, u.prototype.readUint16BE = u.prototype.readUInt16BE = function(s, o) {
    return s = s >>> 0, o || de(s, 2, this.length), this[s] << 8 | this[s + 1];
  }, u.prototype.readUint32LE = u.prototype.readUInt32LE = function(s, o) {
    return s = s >>> 0, o || de(s, 4, this.length), (this[s] | this[s + 1] << 8 | this[s + 2] << 16) + this[s + 3] * 16777216;
  }, u.prototype.readUint32BE = u.prototype.readUInt32BE = function(s, o) {
    return s = s >>> 0, o || de(s, 4, this.length), this[s] * 16777216 + (this[s + 1] << 16 | this[s + 2] << 8 | this[s + 3]);
  }, u.prototype.readBigUInt64LE = te(function(s) {
    s = s >>> 0, S(s, "offset");
    const o = this[s], p = this[s + 7];
    (o === void 0 || p === void 0) && v(s, this.length - 8);
    const _ = o + this[++s] * 2 ** 8 + this[++s] * 2 ** 16 + this[++s] * 2 ** 24, E = this[++s] + this[++s] * 2 ** 8 + this[++s] * 2 ** 16 + p * 2 ** 24;
    return BigInt(_) + (BigInt(E) << BigInt(32));
  }), u.prototype.readBigUInt64BE = te(function(s) {
    s = s >>> 0, S(s, "offset");
    const o = this[s], p = this[s + 7];
    (o === void 0 || p === void 0) && v(s, this.length - 8);
    const _ = o * 2 ** 24 + this[++s] * 2 ** 16 + this[++s] * 2 ** 8 + this[++s], E = this[++s] * 2 ** 24 + this[++s] * 2 ** 16 + this[++s] * 2 ** 8 + p;
    return (BigInt(_) << BigInt(32)) + BigInt(E);
  }), u.prototype.readIntLE = function(s, o, p) {
    s = s >>> 0, o = o >>> 0, p || de(s, o, this.length);
    let _ = this[s], E = 1, A = 0;
    for (; ++A < o && (E *= 256); ) _ += this[s + A] * E;
    return E *= 128, _ >= E && (_ -= Math.pow(2, 8 * o)), _;
  }, u.prototype.readIntBE = function(s, o, p) {
    s = s >>> 0, o = o >>> 0, p || de(s, o, this.length);
    let _ = o, E = 1, A = this[s + --_];
    for (; _ > 0 && (E *= 256); ) A += this[s + --_] * E;
    return E *= 128, A >= E && (A -= Math.pow(2, 8 * o)), A;
  }, u.prototype.readInt8 = function(s, o) {
    return s = s >>> 0, o || de(s, 1, this.length), this[s] & 128 ? (255 - this[s] + 1) * -1 : this[s];
  }, u.prototype.readInt16LE = function(s, o) {
    s = s >>> 0, o || de(s, 2, this.length);
    const p = this[s] | this[s + 1] << 8;
    return p & 32768 ? p | 4294901760 : p;
  }, u.prototype.readInt16BE = function(s, o) {
    s = s >>> 0, o || de(s, 2, this.length);
    const p = this[s + 1] | this[s] << 8;
    return p & 32768 ? p | 4294901760 : p;
  }, u.prototype.readInt32LE = function(s, o) {
    return s = s >>> 0, o || de(s, 4, this.length), this[s] | this[s + 1] << 8 | this[s + 2] << 16 | this[s + 3] << 24;
  }, u.prototype.readInt32BE = function(s, o) {
    return s = s >>> 0, o || de(s, 4, this.length), this[s] << 24 | this[s + 1] << 16 | this[s + 2] << 8 | this[s + 3];
  }, u.prototype.readBigInt64LE = te(function(s) {
    s = s >>> 0, S(s, "offset");
    const o = this[s], p = this[s + 7];
    (o === void 0 || p === void 0) && v(s, this.length - 8);
    const _ = this[s + 4] + this[s + 5] * 2 ** 8 + this[s + 6] * 2 ** 16 + (p << 24);
    return (BigInt(_) << BigInt(32)) + BigInt(o + this[++s] * 2 ** 8 + this[++s] * 2 ** 16 + this[++s] * 2 ** 24);
  }), u.prototype.readBigInt64BE = te(function(s) {
    s = s >>> 0, S(s, "offset");
    const o = this[s], p = this[s + 7];
    (o === void 0 || p === void 0) && v(s, this.length - 8);
    const _ = (o << 24) + this[++s] * 2 ** 16 + this[++s] * 2 ** 8 + this[++s];
    return (BigInt(_) << BigInt(32)) + BigInt(this[++s] * 2 ** 24 + this[++s] * 2 ** 16 + this[++s] * 2 ** 8 + p);
  }), u.prototype.readFloatLE = function(s, o) {
    return s = s >>> 0, o || de(s, 4, this.length), n.read(this, s, true, 23, 4);
  }, u.prototype.readFloatBE = function(s, o) {
    return s = s >>> 0, o || de(s, 4, this.length), n.read(this, s, false, 23, 4);
  }, u.prototype.readDoubleLE = function(s, o) {
    return s = s >>> 0, o || de(s, 8, this.length), n.read(this, s, true, 52, 8);
  }, u.prototype.readDoubleBE = function(s, o) {
    return s = s >>> 0, o || de(s, 8, this.length), n.read(this, s, false, 52, 8);
  };
  function ye(f, s, o, p, _, E) {
    if (!u.isBuffer(f)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (s > _ || s < E) throw new RangeError('"value" argument is out of bounds');
    if (o + p > f.length) throw new RangeError("Index out of range");
  }
  u.prototype.writeUintLE = u.prototype.writeUIntLE = function(s, o, p, _) {
    if (s = +s, o = o >>> 0, p = p >>> 0, !_) {
      const X = Math.pow(2, 8 * p) - 1;
      ye(this, s, o, p, X, 0);
    }
    let E = 1, A = 0;
    for (this[o] = s & 255; ++A < p && (E *= 256); ) this[o + A] = s / E & 255;
    return o + p;
  }, u.prototype.writeUintBE = u.prototype.writeUIntBE = function(s, o, p, _) {
    if (s = +s, o = o >>> 0, p = p >>> 0, !_) {
      const X = Math.pow(2, 8 * p) - 1;
      ye(this, s, o, p, X, 0);
    }
    let E = p - 1, A = 1;
    for (this[o + E] = s & 255; --E >= 0 && (A *= 256); ) this[o + E] = s / A & 255;
    return o + p;
  }, u.prototype.writeUint8 = u.prototype.writeUInt8 = function(s, o, p) {
    return s = +s, o = o >>> 0, p || ye(this, s, o, 1, 255, 0), this[o] = s & 255, o + 1;
  }, u.prototype.writeUint16LE = u.prototype.writeUInt16LE = function(s, o, p) {
    return s = +s, o = o >>> 0, p || ye(this, s, o, 2, 65535, 0), this[o] = s & 255, this[o + 1] = s >>> 8, o + 2;
  }, u.prototype.writeUint16BE = u.prototype.writeUInt16BE = function(s, o, p) {
    return s = +s, o = o >>> 0, p || ye(this, s, o, 2, 65535, 0), this[o] = s >>> 8, this[o + 1] = s & 255, o + 2;
  }, u.prototype.writeUint32LE = u.prototype.writeUInt32LE = function(s, o, p) {
    return s = +s, o = o >>> 0, p || ye(this, s, o, 4, 4294967295, 0), this[o + 3] = s >>> 24, this[o + 2] = s >>> 16, this[o + 1] = s >>> 8, this[o] = s & 255, o + 4;
  }, u.prototype.writeUint32BE = u.prototype.writeUInt32BE = function(s, o, p) {
    return s = +s, o = o >>> 0, p || ye(this, s, o, 4, 4294967295, 0), this[o] = s >>> 24, this[o + 1] = s >>> 16, this[o + 2] = s >>> 8, this[o + 3] = s & 255, o + 4;
  };
  function Ne(f, s, o, p, _) {
    I(s, p, _, f, o, 7);
    let E = Number(s & BigInt(4294967295));
    f[o++] = E, E = E >> 8, f[o++] = E, E = E >> 8, f[o++] = E, E = E >> 8, f[o++] = E;
    let A = Number(s >> BigInt(32) & BigInt(4294967295));
    return f[o++] = A, A = A >> 8, f[o++] = A, A = A >> 8, f[o++] = A, A = A >> 8, f[o++] = A, o;
  }
  function R(f, s, o, p, _) {
    I(s, p, _, f, o, 7);
    let E = Number(s & BigInt(4294967295));
    f[o + 7] = E, E = E >> 8, f[o + 6] = E, E = E >> 8, f[o + 5] = E, E = E >> 8, f[o + 4] = E;
    let A = Number(s >> BigInt(32) & BigInt(4294967295));
    return f[o + 3] = A, A = A >> 8, f[o + 2] = A, A = A >> 8, f[o + 1] = A, A = A >> 8, f[o] = A, o + 8;
  }
  u.prototype.writeBigUInt64LE = te(function(s, o = 0) {
    return Ne(this, s, o, BigInt(0), BigInt("0xffffffffffffffff"));
  }), u.prototype.writeBigUInt64BE = te(function(s, o = 0) {
    return R(this, s, o, BigInt(0), BigInt("0xffffffffffffffff"));
  }), u.prototype.writeIntLE = function(s, o, p, _) {
    if (s = +s, o = o >>> 0, !_) {
      const ge = Math.pow(2, 8 * p - 1);
      ye(this, s, o, p, ge - 1, -ge);
    }
    let E = 0, A = 1, X = 0;
    for (this[o] = s & 255; ++E < p && (A *= 256); ) s < 0 && X === 0 && this[o + E - 1] !== 0 && (X = 1), this[o + E] = (s / A >> 0) - X & 255;
    return o + p;
  }, u.prototype.writeIntBE = function(s, o, p, _) {
    if (s = +s, o = o >>> 0, !_) {
      const ge = Math.pow(2, 8 * p - 1);
      ye(this, s, o, p, ge - 1, -ge);
    }
    let E = p - 1, A = 1, X = 0;
    for (this[o + E] = s & 255; --E >= 0 && (A *= 256); ) s < 0 && X === 0 && this[o + E + 1] !== 0 && (X = 1), this[o + E] = (s / A >> 0) - X & 255;
    return o + p;
  }, u.prototype.writeInt8 = function(s, o, p) {
    return s = +s, o = o >>> 0, p || ye(this, s, o, 1, 127, -128), s < 0 && (s = 255 + s + 1), this[o] = s & 255, o + 1;
  }, u.prototype.writeInt16LE = function(s, o, p) {
    return s = +s, o = o >>> 0, p || ye(this, s, o, 2, 32767, -32768), this[o] = s & 255, this[o + 1] = s >>> 8, o + 2;
  }, u.prototype.writeInt16BE = function(s, o, p) {
    return s = +s, o = o >>> 0, p || ye(this, s, o, 2, 32767, -32768), this[o] = s >>> 8, this[o + 1] = s & 255, o + 2;
  }, u.prototype.writeInt32LE = function(s, o, p) {
    return s = +s, o = o >>> 0, p || ye(this, s, o, 4, 2147483647, -2147483648), this[o] = s & 255, this[o + 1] = s >>> 8, this[o + 2] = s >>> 16, this[o + 3] = s >>> 24, o + 4;
  }, u.prototype.writeInt32BE = function(s, o, p) {
    return s = +s, o = o >>> 0, p || ye(this, s, o, 4, 2147483647, -2147483648), s < 0 && (s = 4294967295 + s + 1), this[o] = s >>> 24, this[o + 1] = s >>> 16, this[o + 2] = s >>> 8, this[o + 3] = s & 255, o + 4;
  }, u.prototype.writeBigInt64LE = te(function(s, o = 0) {
    return Ne(this, s, o, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), u.prototype.writeBigInt64BE = te(function(s, o = 0) {
    return R(this, s, o, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function U(f, s, o, p, _, E) {
    if (o + p > f.length) throw new RangeError("Index out of range");
    if (o < 0) throw new RangeError("Index out of range");
  }
  function N(f, s, o, p, _) {
    return s = +s, o = o >>> 0, _ || U(f, s, o, 4), n.write(f, s, o, p, 23, 4), o + 4;
  }
  u.prototype.writeFloatLE = function(s, o, p) {
    return N(this, s, o, true, p);
  }, u.prototype.writeFloatBE = function(s, o, p) {
    return N(this, s, o, false, p);
  };
  function V(f, s, o, p, _) {
    return s = +s, o = o >>> 0, _ || U(f, s, o, 8), n.write(f, s, o, p, 52, 8), o + 8;
  }
  u.prototype.writeDoubleLE = function(s, o, p) {
    return V(this, s, o, true, p);
  }, u.prototype.writeDoubleBE = function(s, o, p) {
    return V(this, s, o, false, p);
  }, u.prototype.copy = function(s, o, p, _) {
    if (!u.isBuffer(s)) throw new TypeError("argument should be a Buffer");
    if (p || (p = 0), !_ && _ !== 0 && (_ = this.length), o >= s.length && (o = s.length), o || (o = 0), _ > 0 && _ < p && (_ = p), _ === p || s.length === 0 || this.length === 0) return 0;
    if (o < 0) throw new RangeError("targetStart out of bounds");
    if (p < 0 || p >= this.length) throw new RangeError("Index out of range");
    if (_ < 0) throw new RangeError("sourceEnd out of bounds");
    _ > this.length && (_ = this.length), s.length - o < _ - p && (_ = s.length - o + p);
    const E = _ - p;
    return this === s && typeof l.prototype.copyWithin == "function" ? this.copyWithin(o, p, _) : l.prototype.set.call(s, this.subarray(p, _), o), E;
  }, u.prototype.fill = function(s, o, p, _) {
    if (typeof s == "string") {
      if (typeof o == "string" ? (_ = o, o = 0, p = this.length) : typeof p == "string" && (_ = p, p = this.length), _ !== void 0 && typeof _ != "string") throw new TypeError("encoding must be a string");
      if (typeof _ == "string" && !u.isEncoding(_)) throw new TypeError("Unknown encoding: " + _);
      if (s.length === 1) {
        const A = s.charCodeAt(0);
        (_ === "utf8" && A < 128 || _ === "latin1") && (s = A);
      }
    } else typeof s == "number" ? s = s & 255 : typeof s == "boolean" && (s = Number(s));
    if (o < 0 || this.length < o || this.length < p) throw new RangeError("Out of range index");
    if (p <= o) return this;
    o = o >>> 0, p = p === void 0 ? this.length : p >>> 0, s || (s = 0);
    let E;
    if (typeof s == "number") for (E = o; E < p; ++E) this[E] = s;
    else {
      const A = u.isBuffer(s) ? s : u.from(s, _), X = A.length;
      if (X === 0) throw new TypeError('The value "' + s + '" is invalid for argument "value"');
      for (E = 0; E < p - o; ++E) this[E + o] = A[E % X];
    }
    return this;
  };
  const z = {};
  function d(f, s, o) {
    z[f] = class extends o {
      constructor() {
        super(), Object.defineProperty(this, "message", { value: s.apply(this, arguments), writable: true, configurable: true }), this.name = `${this.name} [${f}]`, this.stack, delete this.name;
      }
      get code() {
        return f;
      }
      set code(_) {
        Object.defineProperty(this, "code", { configurable: true, enumerable: true, value: _, writable: true });
      }
      toString() {
        return `${this.name} [${f}]: ${this.message}`;
      }
    };
  }
  d("ERR_BUFFER_OUT_OF_BOUNDS", function(f) {
    return f ? `${f} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
  }, RangeError), d("ERR_INVALID_ARG_TYPE", function(f, s) {
    return `The "${f}" argument must be of type number. Received type ${typeof s}`;
  }, TypeError), d("ERR_OUT_OF_RANGE", function(f, s, o) {
    let p = `The value of "${f}" is out of range.`, _ = o;
    return Number.isInteger(o) && Math.abs(o) > 2 ** 32 ? _ = g(String(o)) : typeof o == "bigint" && (_ = String(o), (o > BigInt(2) ** BigInt(32) || o < -(BigInt(2) ** BigInt(32))) && (_ = g(_)), _ += "n"), p += ` It must be ${s}. Received ${_}`, p;
  }, RangeError);
  function g(f) {
    let s = "", o = f.length;
    const p = f[0] === "-" ? 1 : 0;
    for (; o >= p + 4; o -= 3) s = `_${f.slice(o - 3, o)}${s}`;
    return `${f.slice(0, o)}${s}`;
  }
  function x(f, s, o) {
    S(s, "offset"), (f[s] === void 0 || f[s + o] === void 0) && v(s, f.length - (o + 1));
  }
  function I(f, s, o, p, _, E) {
    if (f > o || f < s) {
      const A = typeof s == "bigint" ? "n" : "";
      let X;
      throw s === 0 || s === BigInt(0) ? X = `>= 0${A} and < 2${A} ** ${(E + 1) * 8}${A}` : X = `>= -(2${A} ** ${(E + 1) * 8 - 1}${A}) and < 2 ** ${(E + 1) * 8 - 1}${A}`, new z.ERR_OUT_OF_RANGE("value", X, f);
    }
    x(p, _, E);
  }
  function S(f, s) {
    if (typeof f != "number") throw new z.ERR_INVALID_ARG_TYPE(s, "number", f);
  }
  function v(f, s, o) {
    throw Math.floor(f) !== f ? (S(f, o), new z.ERR_OUT_OF_RANGE("offset", "an integer", f)) : s < 0 ? new z.ERR_BUFFER_OUT_OF_BOUNDS() : new z.ERR_OUT_OF_RANGE("offset", `>= 0 and <= ${s}`, f);
  }
  const P = /[^+/0-9A-Za-z-_]/g;
  function O(f) {
    if (f = f.split("=")[0], f = f.trim().replace(P, ""), f.length < 2) return "";
    for (; f.length % 4 !== 0; ) f = f + "=";
    return f;
  }
  function B(f, s) {
    s = s || 1 / 0;
    let o;
    const p = f.length;
    let _ = null;
    const E = [];
    for (let A = 0; A < p; ++A) {
      if (o = f.charCodeAt(A), o > 55295 && o < 57344) {
        if (!_) {
          if (o > 56319) {
            (s -= 3) > -1 && E.push(239, 191, 189);
            continue;
          } else if (A + 1 === p) {
            (s -= 3) > -1 && E.push(239, 191, 189);
            continue;
          }
          _ = o;
          continue;
        }
        if (o < 56320) {
          (s -= 3) > -1 && E.push(239, 191, 189), _ = o;
          continue;
        }
        o = (_ - 55296 << 10 | o - 56320) + 65536;
      } else _ && (s -= 3) > -1 && E.push(239, 191, 189);
      if (_ = null, o < 128) {
        if ((s -= 1) < 0) break;
        E.push(o);
      } else if (o < 2048) {
        if ((s -= 2) < 0) break;
        E.push(o >> 6 | 192, o & 63 | 128);
      } else if (o < 65536) {
        if ((s -= 3) < 0) break;
        E.push(o >> 12 | 224, o >> 6 & 63 | 128, o & 63 | 128);
      } else if (o < 1114112) {
        if ((s -= 4) < 0) break;
        E.push(o >> 18 | 240, o >> 12 & 63 | 128, o >> 6 & 63 | 128, o & 63 | 128);
      } else throw new Error("Invalid code point");
    }
    return E;
  }
  function C(f) {
    const s = [];
    for (let o = 0; o < f.length; ++o) s.push(f.charCodeAt(o) & 255);
    return s;
  }
  function G(f, s) {
    let o, p, _;
    const E = [];
    for (let A = 0; A < f.length && !((s -= 2) < 0); ++A) o = f.charCodeAt(A), p = o >> 8, _ = o % 256, E.push(_), E.push(p);
    return E;
  }
  function M(f) {
    return t.toByteArray(O(f));
  }
  function H(f, s, o, p) {
    let _;
    for (_ = 0; _ < p && !(_ + o >= s.length || _ >= f.length); ++_) s[_ + o] = f[_];
    return _;
  }
  function k(f, s) {
    return f instanceof s || f != null && f.constructor != null && f.constructor.name != null && f.constructor.name === s.name;
  }
  function ee(f) {
    return f !== f;
  }
  const ce = (function() {
    const f = "0123456789abcdef", s = new Array(256);
    for (let o = 0; o < 16; ++o) {
      const p = o * 16;
      for (let _ = 0; _ < 16; ++_) s[p + _] = f[o] + f[_];
    }
    return s;
  })();
  function te(f) {
    return typeof BigInt > "u" ? Be : f;
  }
  function Be() {
    throw new Error("BigInt not supported");
  }
})(yo);
const jf = yo.Buffer;
let xo;
const Yn = (e) => xo = e, wo = /* @__PURE__ */ Symbol();
function Rr(e) {
  return e && typeof e == "object" && Object.prototype.toString.call(e) === "[object Object]" && typeof e.toJSON != "function";
}
var ln;
(function(e) {
  e.direct = "direct", e.patchObject = "patch object", e.patchFunction = "patch function";
})(ln || (ln = {}));
function Hf() {
  const e = fs(true), t = e.run(() => Ss({}));
  let n = [], r = [];
  const i = Wr({ install(l) {
    Yn(i), i._a = l, l.provide(wo, i), l.config.globalProperties.$pinia = i, r.forEach((c) => n.push(c)), r = [];
  }, use(l) {
    return this._a ? n.push(l) : r.push(l), this;
  }, _p: n, _a: null, _e: e, _s: /* @__PURE__ */ new Map(), state: t });
  return i;
}
const Eo = () => {
};
function Di(e, t, n, r = Eo) {
  e.add(t);
  const i = () => {
    e.delete(t) && r();
  };
  return !n && as() && qo(i), i;
}
function Ut(e, ...t) {
  e.forEach((n) => {
    n(...t);
  });
}
const du = (e) => e(), Ui = /* @__PURE__ */ Symbol(), ur = /* @__PURE__ */ Symbol();
function Sr(e, t) {
  e instanceof Map && t instanceof Map ? t.forEach((n, r) => e.set(r, n)) : e instanceof Set && t instanceof Set && t.forEach(e.add, e);
  for (const n in t) {
    if (!t.hasOwnProperty(n)) continue;
    const r = t[n], i = e[n];
    Rr(i) && Rr(r) && e.hasOwnProperty(n) && !we(r) && !dt(r) ? e[n] = Sr(i, r) : e[n] = r;
  }
  return e;
}
const gu = /* @__PURE__ */ Symbol();
function mu(e) {
  return !Rr(e) || !Object.prototype.hasOwnProperty.call(e, gu);
}
const { assign: bt } = Object;
function yu(e) {
  return !!(we(e) && e.effect);
}
function _u(e, t, n, r) {
  const { state: i, actions: l, getters: c } = t, a = n.state.value[e];
  let h;
  function m() {
    a || (n.state.value[e] = i ? i() : {});
    const u = ml(n.state.value[e]);
    return bt(u, l, Object.keys(c || {}).reduce((y, w) => (y[w] = Wr(We(() => {
      Yn(n);
      const b = n._s.get(e);
      return c[w].call(b, b);
    })), y), {}));
  }
  return h = bo(e, m, t, n, r, true), h;
}
function bo(e, t, n = {}, r, i, l) {
  let c;
  const a = bt({ actions: {} }, n), h = { deep: true };
  let m, u, y = /* @__PURE__ */ new Set(), w = /* @__PURE__ */ new Set(), b;
  const F = r.state.value[e];
  !l && !F && (r.state.value[e] = {});
  let T;
  function K(q) {
    let Z;
    m = u = false, typeof q == "function" ? (q(r.state.value[e]), Z = { type: ln.patchFunction, storeId: e, events: b }) : (Sr(r.state.value[e], q), Z = { type: ln.patchObject, payload: q, storeId: e, events: b });
    const ae = T = /* @__PURE__ */ Symbol();
    $r().then(() => {
      T === ae && (m = true);
    }), u = true, Ut(y, Z, r.state.value[e]);
  }
  const W = l ? function() {
    const { state: Z } = n, ae = Z ? Z() : {};
    this.$patch((ve) => {
      bt(ve, ae);
    });
  } : Eo;
  function D() {
    c.stop(), y.clear(), w.clear(), r._s.delete(e);
  }
  const j = (q, Z = "") => {
    if (Ui in q) return q[ur] = Z, q;
    const ae = function() {
      Yn(r);
      const ve = Array.from(arguments), Fe = /* @__PURE__ */ new Set(), Se = /* @__PURE__ */ new Set();
      function lt(Y) {
        Fe.add(Y);
      }
      function Ze(Y) {
        Se.add(Y);
      }
      Ut(w, { args: ve, name: ae[ur], store: Q, after: lt, onError: Ze });
      let he;
      try {
        he = q.apply(this && this.$id === e ? this : Q, ve);
      } catch (Y) {
        throw Ut(Se, Y), Y;
      }
      return he instanceof Promise ? he.then((Y) => (Ut(Fe, Y), Y)).catch((Y) => (Ut(Se, Y), Promise.reject(Y))) : (Ut(Fe, he), he);
    };
    return ae[Ui] = true, ae[ur] = Z, ae;
  }, L = { _p: r, $id: e, $onAction: Di.bind(null, w), $patch: K, $reset: W, $subscribe(q, Z = {}) {
    const ae = Di(y, q, Z.detached, () => ve()), ve = c.run(() => nn(() => r.state.value[e], (Fe) => {
      (Z.flush === "sync" ? u : m) && q({ storeId: e, type: ln.direct, events: b }, Fe);
    }, bt({}, h, Z)));
    return ae;
  }, $dispose: D }, Q = yn(L);
  r._s.set(e, Q);
  const ie = (r._a && r._a.runWithContext || du)(() => r._e.run(() => (c = fs()).run(() => t({ action: j }))));
  for (const q in ie) {
    const Z = ie[q];
    if (we(Z) && !yu(Z) || dt(Z)) l || (F && mu(Z) && (we(Z) ? Z.value = F[q] : Sr(Z, F[q])), r.state.value[e][q] = Z);
    else if (typeof Z == "function") {
      const ae = j(Z, q);
      ie[q] = ae, a.actions[q] = Z;
    }
  }
  return bt(Q, ie), bt(re(Q), ie), Object.defineProperty(Q, "$state", { get: () => r.state.value[e], set: (q) => {
    K((Z) => {
      bt(Z, q);
    });
  } }), r._p.forEach((q) => {
    bt(Q, c.run(() => q({ store: Q, app: r._a, pinia: r, options: a })));
  }), F && l && n.hydrate && n.hydrate(Q.$state, F), m = true, u = true, Q;
}
function Vf(e, t, n) {
  let r;
  const i = typeof t == "function";
  r = i ? n : t;
  function l(c, a) {
    const h = Sl();
    return c = c || (h ? $e(wo, null) : null), c && Yn(c), c = xo, c._s.has(e) || (i ? bo(e, t, r, c) : _u(e, r, c)), c._s.get(e);
  }
  return l.$id = e, l;
}
const Ht = typeof document < "u";
function Ao(e) {
  return typeof e == "object" || "displayName" in e || "props" in e || "__vccOpts" in e;
}
function xu(e) {
  return e.__esModule || e[Symbol.toStringTag] === "Module" || e.default && Ao(e.default);
}
const se = Object.assign;
function fr(e, t) {
  const n = {};
  for (const r in t) {
    const i = t[r];
    n[r] = Xe(i) ? i.map(e) : e(i);
  }
  return n;
}
const cn = () => {
}, Xe = Array.isArray;
function Li(e, t) {
  const n = {};
  for (const r in e) n[r] = r in t ? t[r] : e[r];
  return n;
}
const vo = /#/g, wu = /&/g, Eu = /\//g, bu = /=/g, Au = /\?/g, Io = /\+/g, vu = /%5B/g, Iu = /%5D/g, Ro = /%5E/g, Ru = /%60/g, So = /%7B/g, Su = /%7C/g, Co = /%7D/g, Cu = /%20/g;
function ei(e) {
  return e == null ? "" : encodeURI("" + e).replace(Su, "|").replace(vu, "[").replace(Iu, "]");
}
function Bu(e) {
  return ei(e).replace(So, "{").replace(Co, "}").replace(Ro, "^");
}
function Cr(e) {
  return ei(e).replace(Io, "%2B").replace(Cu, "+").replace(vo, "%23").replace(wu, "%26").replace(Ru, "`").replace(So, "{").replace(Co, "}").replace(Ro, "^");
}
function Tu(e) {
  return Cr(e).replace(bu, "%3D");
}
function Ou(e) {
  return ei(e).replace(vo, "%23").replace(Au, "%3F");
}
function Pu(e) {
  return Ou(e).replace(Eu, "%2F");
}
function gn(e) {
  if (e == null) return null;
  try {
    return decodeURIComponent("" + e);
  } catch {
  }
  return "" + e;
}
const Fu = /\/$/, Nu = (e) => e.replace(Fu, "");
function ar(e, t, n = "/") {
  let r, i = {}, l = "", c = "";
  const a = t.indexOf("#");
  let h = t.indexOf("?");
  return h = a >= 0 && h > a ? -1 : h, h >= 0 && (r = t.slice(0, h), l = t.slice(h, a > 0 ? a : t.length), i = e(l.slice(1))), a >= 0 && (r = r || t.slice(0, a), c = t.slice(a, t.length)), r = Lu(r ?? t, n), { fullPath: r + l + c, path: r, query: i, hash: gn(c) };
}
function Mu(e, t) {
  const n = t.query ? e(t.query) : "";
  return t.path + (n && "?") + n + (t.hash || "");
}
function ji(e, t) {
  return !t || !e.toLowerCase().startsWith(t.toLowerCase()) ? e : e.slice(t.length) || "/";
}
function Du(e, t, n) {
  const r = t.matched.length - 1, i = n.matched.length - 1;
  return r > -1 && r === i && qt(t.matched[r], n.matched[i]) && Bo(t.params, n.params) && e(t.query) === e(n.query) && t.hash === n.hash;
}
function qt(e, t) {
  return (e.aliasOf || e) === (t.aliasOf || t);
}
function Bo(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length) return false;
  for (var n in e) if (!Uu(e[n], t[n])) return false;
  return true;
}
function Uu(e, t) {
  return Xe(e) ? Hi(e, t) : Xe(t) ? Hi(t, e) : (e == null ? void 0 : e.valueOf()) === (t == null ? void 0 : t.valueOf());
}
function Hi(e, t) {
  return Xe(t) ? e.length === t.length && e.every((n, r) => n === t[r]) : e.length === 1 && e[0] === t;
}
function Lu(e, t) {
  if (e.startsWith("/")) return e;
  if (!e) return t;
  const n = t.split("/"), r = e.split("/"), i = r[r.length - 1];
  (i === ".." || i === ".") && r.push("");
  let l = n.length - 1, c, a;
  for (c = 0; c < r.length; c++) if (a = r[c], a !== ".") if (a === "..") l > 1 && l--;
  else break;
  return n.slice(0, l).join("/") + "/" + r.slice(c).join("/");
}
const Et = { path: "/", name: void 0, params: {}, query: {}, hash: "", fullPath: "/", matched: [], meta: {}, redirectedFrom: void 0 };
let Br = (function(e) {
  return e.pop = "pop", e.push = "push", e;
})({}), hr = (function(e) {
  return e.back = "back", e.forward = "forward", e.unknown = "", e;
})({});
function ju(e) {
  if (!e) if (Ht) {
    const t = document.querySelector("base");
    e = t && t.getAttribute("href") || "/", e = e.replace(/^\w+:\/\/[^\/]+/, "");
  } else e = "/";
  return e[0] !== "/" && e[0] !== "#" && (e = "/" + e), Nu(e);
}
const Hu = /^[^#]+#/;
function Vu(e, t) {
  return e.replace(Hu, "#") + t;
}
function ku(e, t) {
  const n = document.documentElement.getBoundingClientRect(), r = e.getBoundingClientRect();
  return { behavior: t.behavior, left: r.left - n.left - (t.left || 0), top: r.top - n.top - (t.top || 0) };
}
const Jn = () => ({ left: window.scrollX, top: window.scrollY });
function Gu(e) {
  let t;
  if ("el" in e) {
    const n = e.el, r = typeof n == "string" && n.startsWith("#"), i = typeof n == "string" ? r ? document.getElementById(n.slice(1)) : document.querySelector(n) : n;
    if (!i) return;
    t = ku(i, e);
  } else t = e;
  "scrollBehavior" in document.documentElement.style ? window.scrollTo(t) : window.scrollTo(t.left != null ? t.left : window.scrollX, t.top != null ? t.top : window.scrollY);
}
function Vi(e, t) {
  return (history.state ? history.state.position - t : -1) + e;
}
const Tr = /* @__PURE__ */ new Map();
function Ku(e, t) {
  Tr.set(e, t);
}
function Wu(e) {
  const t = Tr.get(e);
  return Tr.delete(e), t;
}
function $u(e) {
  return typeof e == "string" || e && typeof e == "object";
}
function To(e) {
  return typeof e == "string" || typeof e == "symbol";
}
let xe = (function(e) {
  return e[e.MATCHER_NOT_FOUND = 1] = "MATCHER_NOT_FOUND", e[e.NAVIGATION_GUARD_REDIRECT = 2] = "NAVIGATION_GUARD_REDIRECT", e[e.NAVIGATION_ABORTED = 4] = "NAVIGATION_ABORTED", e[e.NAVIGATION_CANCELLED = 8] = "NAVIGATION_CANCELLED", e[e.NAVIGATION_DUPLICATED = 16] = "NAVIGATION_DUPLICATED", e;
})({});
const Oo = /* @__PURE__ */ Symbol("");
xe.MATCHER_NOT_FOUND + "", xe.NAVIGATION_GUARD_REDIRECT + "", xe.NAVIGATION_ABORTED + "", xe.NAVIGATION_CANCELLED + "", xe.NAVIGATION_DUPLICATED + "";
function Yt(e, t) {
  return se(new Error(), { type: e, [Oo]: true }, t);
}
function ut(e, t) {
  return e instanceof Error && Oo in e && (t == null || !!(e.type & t));
}
const qu = ["params", "query", "hash"];
function Yu(e) {
  if (typeof e == "string") return e;
  if (e.path != null) return e.path;
  const t = {};
  for (const n of qu) n in e && (t[n] = e[n]);
  return JSON.stringify(t, null, 2);
}
function Ju(e) {
  const t = {};
  if (e === "" || e === "?") return t;
  const n = (e[0] === "?" ? e.slice(1) : e).split("&");
  for (let r = 0; r < n.length; ++r) {
    const i = n[r].replace(Io, " "), l = i.indexOf("="), c = gn(l < 0 ? i : i.slice(0, l)), a = l < 0 ? null : gn(i.slice(l + 1));
    if (c in t) {
      let h = t[c];
      Xe(h) || (h = t[c] = [h]), h.push(a);
    } else t[c] = a;
  }
  return t;
}
function ki(e) {
  let t = "";
  for (let n in e) {
    const r = e[n];
    if (n = Tu(n), r == null) {
      r !== void 0 && (t += (t.length ? "&" : "") + n);
      continue;
    }
    (Xe(r) ? r.map((i) => i && Cr(i)) : [r && Cr(r)]).forEach((i) => {
      i !== void 0 && (t += (t.length ? "&" : "") + n, i != null && (t += "=" + i));
    });
  }
  return t;
}
function zu(e) {
  const t = {};
  for (const n in e) {
    const r = e[n];
    r !== void 0 && (t[n] = Xe(r) ? r.map((i) => i == null ? null : "" + i) : r == null ? r : "" + r);
  }
  return t;
}
const Qu = /* @__PURE__ */ Symbol(""), Gi = /* @__PURE__ */ Symbol(""), zn = /* @__PURE__ */ Symbol(""), ti = /* @__PURE__ */ Symbol(""), Or = /* @__PURE__ */ Symbol("");
function Qt() {
  let e = [];
  function t(r) {
    return e.push(r), () => {
      const i = e.indexOf(r);
      i > -1 && e.splice(i, 1);
    };
  }
  function n() {
    e = [];
  }
  return { add: t, list: () => e.slice(), reset: n };
}
function It(e, t, n, r, i, l = (c) => c()) {
  const c = r && (r.enterCallbacks[i] = r.enterCallbacks[i] || []);
  return () => new Promise((a, h) => {
    const m = (w) => {
      w === false ? h(Yt(xe.NAVIGATION_ABORTED, { from: n, to: t })) : w instanceof Error ? h(w) : $u(w) ? h(Yt(xe.NAVIGATION_GUARD_REDIRECT, { from: t, to: w })) : (c && r.enterCallbacks[i] === c && typeof w == "function" && c.push(w), a());
    }, u = l(() => e.call(r && r.instances[i], t, n, m));
    let y = Promise.resolve(u);
    e.length < 3 && (y = y.then(m)), y.catch((w) => h(w));
  });
}
function pr(e, t, n, r, i = (l) => l()) {
  const l = [];
  for (const c of e) for (const a in c.components) {
    let h = c.components[a];
    if (!(t !== "beforeRouteEnter" && !c.instances[a])) if (Ao(h)) {
      const m = (h.__vccOpts || h)[t];
      m && l.push(It(m, n, r, c, a, i));
    } else {
      let m = h();
      l.push(() => m.then((u) => {
        if (!u) throw new Error(`Couldn't resolve component "${a}" at "${c.path}"`);
        const y = xu(u) ? u.default : u;
        c.mods[a] = u, c.components[a] = y;
        const w = (y.__vccOpts || y)[t];
        return w && It(w, n, r, c, a, i)();
      }));
    }
  }
  return l;
}
function Xu(e, t) {
  const n = [], r = [], i = [], l = Math.max(t.matched.length, e.matched.length);
  for (let c = 0; c < l; c++) {
    const a = t.matched[c];
    a && (e.matched.find((m) => qt(m, a)) ? r.push(a) : n.push(a));
    const h = e.matched[c];
    h && (t.matched.find((m) => qt(m, h)) || i.push(h));
  }
  return [n, r, i];
}
let Zu = () => location.protocol + "//" + location.host;
function Po(e, t) {
  const { pathname: n, search: r, hash: i } = t, l = e.indexOf("#");
  if (l > -1) {
    let c = i.includes(e.slice(l)) ? e.slice(l).length : 1, a = i.slice(c);
    return a[0] !== "/" && (a = "/" + a), ji(a, "");
  }
  return ji(n, e) + r + i;
}
function ef(e, t, n, r) {
  let i = [], l = [], c = null;
  const a = ({ state: w }) => {
    const b = Po(e, location), F = n.value, T = t.value;
    let K = 0;
    if (w) {
      if (n.value = b, t.value = w, c && c === F) {
        c = null;
        return;
      }
      K = T ? w.position - T.position : 0;
    } else r(b);
    i.forEach((W) => {
      W(n.value, F, { delta: K, type: Br.pop, direction: K ? K > 0 ? hr.forward : hr.back : hr.unknown });
    });
  };
  function h() {
    c = n.value;
  }
  function m(w) {
    i.push(w);
    const b = () => {
      const F = i.indexOf(w);
      F > -1 && i.splice(F, 1);
    };
    return l.push(b), b;
  }
  function u() {
    if (document.visibilityState === "hidden") {
      const { history: w } = window;
      if (!w.state) return;
      w.replaceState(se({}, w.state, { scroll: Jn() }), "");
    }
  }
  function y() {
    for (const w of l) w();
    l = [], window.removeEventListener("popstate", a), window.removeEventListener("pagehide", u), document.removeEventListener("visibilitychange", u);
  }
  return window.addEventListener("popstate", a), window.addEventListener("pagehide", u), document.addEventListener("visibilitychange", u), { pauseListeners: h, listen: m, destroy: y };
}
function Ki(e, t, n, r = false, i = false) {
  return { back: e, current: t, forward: n, replaced: r, position: window.history.length, scroll: i ? Jn() : null };
}
function tf(e) {
  const { history: t, location: n } = window, r = { value: Po(e, n) }, i = { value: t.state };
  i.value || l(r.value, { back: null, current: r.value, forward: null, position: t.length - 1, replaced: true, scroll: null }, true);
  function l(h, m, u) {
    const y = e.indexOf("#"), w = y > -1 ? (n.host && document.querySelector("base") ? e : e.slice(y)) + h : Zu() + e + h;
    try {
      t[u ? "replaceState" : "pushState"](m, "", w), i.value = m;
    } catch (b) {
      console.error(b), n[u ? "replace" : "assign"](w);
    }
  }
  function c(h, m) {
    l(h, se({}, t.state, Ki(i.value.back, h, i.value.forward, true), m, { position: i.value.position }), true), r.value = h;
  }
  function a(h, m) {
    const u = se({}, i.value, t.state, { forward: h, scroll: Jn() });
    l(u.current, u, true), l(h, se({}, Ki(r.value, h, null), { position: u.position + 1 }, m), false), r.value = h;
  }
  return { location: r, state: i, push: a, replace: c };
}
function nf(e) {
  e = ju(e);
  const t = tf(e), n = ef(e, t.state, t.location, t.replace);
  function r(l, c = true) {
    c || n.pauseListeners(), history.go(l);
  }
  const i = se({ location: "", base: e, go: r, createHref: Vu.bind(null, e) }, t, n);
  return Object.defineProperty(i, "location", { enumerable: true, get: () => t.location.value }), Object.defineProperty(i, "state", { enumerable: true, get: () => t.state.value }), i;
}
function kf(e) {
  return e = location.host ? e || location.pathname + location.search : "", e.includes("#") || (e += "#"), nf(e);
}
let Ot = (function(e) {
  return e[e.Static = 0] = "Static", e[e.Param = 1] = "Param", e[e.Group = 2] = "Group", e;
})({});
var Ae = (function(e) {
  return e[e.Static = 0] = "Static", e[e.Param = 1] = "Param", e[e.ParamRegExp = 2] = "ParamRegExp", e[e.ParamRegExpEnd = 3] = "ParamRegExpEnd", e[e.EscapeNext = 4] = "EscapeNext", e;
})(Ae || {});
const rf = { type: Ot.Static, value: "" }, sf = /[a-zA-Z0-9_]/;
function of(e) {
  if (!e) return [[]];
  if (e === "/") return [[rf]];
  if (!e.startsWith("/")) throw new Error(`Invalid path "${e}"`);
  function t(b) {
    throw new Error(`ERR (${n})/"${m}": ${b}`);
  }
  let n = Ae.Static, r = n;
  const i = [];
  let l;
  function c() {
    l && i.push(l), l = [];
  }
  let a = 0, h, m = "", u = "";
  function y() {
    m && (n === Ae.Static ? l.push({ type: Ot.Static, value: m }) : n === Ae.Param || n === Ae.ParamRegExp || n === Ae.ParamRegExpEnd ? (l.length > 1 && (h === "*" || h === "+") && t(`A repeatable param (${m}) must be alone in its segment. eg: '/:ids+.`), l.push({ type: Ot.Param, value: m, regexp: u, repeatable: h === "*" || h === "+", optional: h === "*" || h === "?" })) : t("Invalid state to consume buffer"), m = "");
  }
  function w() {
    m += h;
  }
  for (; a < e.length; ) {
    if (h = e[a++], h === "\\" && n !== Ae.ParamRegExp) {
      r = n, n = Ae.EscapeNext;
      continue;
    }
    switch (n) {
      case Ae.Static:
        h === "/" ? (m && y(), c()) : h === ":" ? (y(), n = Ae.Param) : w();
        break;
      case Ae.EscapeNext:
        w(), n = r;
        break;
      case Ae.Param:
        h === "(" ? n = Ae.ParamRegExp : sf.test(h) ? w() : (y(), n = Ae.Static, h !== "*" && h !== "?" && h !== "+" && a--);
        break;
      case Ae.ParamRegExp:
        h === ")" ? u[u.length - 1] == "\\" ? u = u.slice(0, -1) + h : n = Ae.ParamRegExpEnd : u += h;
        break;
      case Ae.ParamRegExpEnd:
        y(), n = Ae.Static, h !== "*" && h !== "?" && h !== "+" && a--, u = "";
        break;
      default:
        t("Unknown state");
        break;
    }
  }
  return n === Ae.ParamRegExp && t(`Unfinished custom RegExp for param "${m}"`), y(), c(), i;
}
const Wi = "[^/]+?", lf = { sensitive: false, strict: false, start: true, end: true };
var De = (function(e) {
  return e[e._multiplier = 10] = "_multiplier", e[e.Root = 90] = "Root", e[e.Segment = 40] = "Segment", e[e.SubSegment = 30] = "SubSegment", e[e.Static = 40] = "Static", e[e.Dynamic = 20] = "Dynamic", e[e.BonusCustomRegExp = 10] = "BonusCustomRegExp", e[e.BonusWildcard = -50] = "BonusWildcard", e[e.BonusRepeatable = -20] = "BonusRepeatable", e[e.BonusOptional = -8] = "BonusOptional", e[e.BonusStrict = 0.7000000000000001] = "BonusStrict", e[e.BonusCaseSensitive = 0.25] = "BonusCaseSensitive", e;
})(De || {});
const cf = /[.+*?^${}()[\]/\\]/g;
function uf(e, t) {
  const n = se({}, lf, t), r = [];
  let i = n.start ? "^" : "";
  const l = [];
  for (const m of e) {
    const u = m.length ? [] : [De.Root];
    n.strict && !m.length && (i += "/");
    for (let y = 0; y < m.length; y++) {
      const w = m[y];
      let b = De.Segment + (n.sensitive ? De.BonusCaseSensitive : 0);
      if (w.type === Ot.Static) y || (i += "/"), i += w.value.replace(cf, "\\$&"), b += De.Static;
      else if (w.type === Ot.Param) {
        const { value: F, repeatable: T, optional: K, regexp: W } = w;
        l.push({ name: F, repeatable: T, optional: K });
        const D = W || Wi;
        if (D !== Wi) {
          b += De.BonusCustomRegExp;
          try {
            `${D}`;
          } catch (L) {
            throw new Error(`Invalid custom RegExp for param "${F}" (${D}): ` + L.message);
          }
        }
        let j = T ? `((?:${D})(?:/(?:${D}))*)` : `(${D})`;
        y || (j = K && m.length < 2 ? `(?:/${j})` : "/" + j), K && (j += "?"), i += j, b += De.Dynamic, K && (b += De.BonusOptional), T && (b += De.BonusRepeatable), D === ".*" && (b += De.BonusWildcard);
      }
      u.push(b);
    }
    r.push(u);
  }
  if (n.strict && n.end) {
    const m = r.length - 1;
    r[m][r[m].length - 1] += De.BonusStrict;
  }
  n.strict || (i += "/?"), n.end ? i += "$" : n.strict && !i.endsWith("/") && (i += "(?:/|$)");
  const c = new RegExp(i, n.sensitive ? "" : "i");
  function a(m) {
    const u = m.match(c), y = {};
    if (!u) return null;
    for (let w = 1; w < u.length; w++) {
      const b = u[w] || "", F = l[w - 1];
      y[F.name] = b && F.repeatable ? b.split("/") : b;
    }
    return y;
  }
  function h(m) {
    let u = "", y = false;
    for (const w of e) {
      (!y || !u.endsWith("/")) && (u += "/"), y = false;
      for (const b of w) if (b.type === Ot.Static) u += b.value;
      else if (b.type === Ot.Param) {
        const { value: F, repeatable: T, optional: K } = b, W = F in m ? m[F] : "";
        if (Xe(W) && !T) throw new Error(`Provided param "${F}" is an array but it is not repeatable (* or + modifiers)`);
        const D = Xe(W) ? W.join("/") : W;
        if (!D) if (K) w.length < 2 && (u.endsWith("/") ? u = u.slice(0, -1) : y = true);
        else throw new Error(`Missing required param "${F}"`);
        u += D;
      }
    }
    return u || "/";
  }
  return { re: c, score: r, keys: l, parse: a, stringify: h };
}
function ff(e, t) {
  let n = 0;
  for (; n < e.length && n < t.length; ) {
    const r = t[n] - e[n];
    if (r) return r;
    n++;
  }
  return e.length < t.length ? e.length === 1 && e[0] === De.Static + De.Segment ? -1 : 1 : e.length > t.length ? t.length === 1 && t[0] === De.Static + De.Segment ? 1 : -1 : 0;
}
function Fo(e, t) {
  let n = 0;
  const r = e.score, i = t.score;
  for (; n < r.length && n < i.length; ) {
    const l = ff(r[n], i[n]);
    if (l) return l;
    n++;
  }
  if (Math.abs(i.length - r.length) === 1) {
    if ($i(r)) return 1;
    if ($i(i)) return -1;
  }
  return i.length - r.length;
}
function $i(e) {
  const t = e[e.length - 1];
  return e.length > 0 && t[t.length - 1] < 0;
}
const af = { strict: false, end: true, sensitive: false };
function hf(e, t, n) {
  const r = uf(of(e.path), n), i = se(r, { record: e, parent: t, children: [], alias: [] });
  return t && !i.record.aliasOf == !t.record.aliasOf && t.children.push(i), i;
}
function pf(e, t) {
  const n = [], r = /* @__PURE__ */ new Map();
  t = Li(af, t);
  function i(y) {
    return r.get(y);
  }
  function l(y, w, b) {
    const F = !b, T = Yi(y);
    T.aliasOf = b && b.record;
    const K = Li(t, y), W = [T];
    if ("alias" in y) {
      const L = typeof y.alias == "string" ? [y.alias] : y.alias;
      for (const Q of L) W.push(Yi(se({}, T, { components: b ? b.record.components : T.components, path: Q, aliasOf: b ? b.record : T })));
    }
    let D, j;
    for (const L of W) {
      const { path: Q } = L;
      if (w && Q[0] !== "/") {
        const Ee = w.record.path, ie = Ee[Ee.length - 1] === "/" ? "" : "/";
        L.path = w.record.path + (Q && ie + Q);
      }
      if (D = hf(L, w, K), b ? b.alias.push(D) : (j = j || D, j !== D && j.alias.push(D), F && y.name && !Ji(D) && c(y.name)), No(D) && h(D), T.children) {
        const Ee = T.children;
        for (let ie = 0; ie < Ee.length; ie++) l(Ee[ie], D, b && b.children[ie]);
      }
      b = b || D;
    }
    return j ? () => {
      c(j);
    } : cn;
  }
  function c(y) {
    if (To(y)) {
      const w = r.get(y);
      w && (r.delete(y), n.splice(n.indexOf(w), 1), w.children.forEach(c), w.alias.forEach(c));
    } else {
      const w = n.indexOf(y);
      w > -1 && (n.splice(w, 1), y.record.name && r.delete(y.record.name), y.children.forEach(c), y.alias.forEach(c));
    }
  }
  function a() {
    return n;
  }
  function h(y) {
    const w = mf(y, n);
    n.splice(w, 0, y), y.record.name && !Ji(y) && r.set(y.record.name, y);
  }
  function m(y, w) {
    let b, F = {}, T, K;
    if ("name" in y && y.name) {
      if (b = r.get(y.name), !b) throw Yt(xe.MATCHER_NOT_FOUND, { location: y });
      K = b.record.name, F = se(qi(w.params, b.keys.filter((j) => !j.optional).concat(b.parent ? b.parent.keys.filter((j) => j.optional) : []).map((j) => j.name)), y.params && qi(y.params, b.keys.map((j) => j.name))), T = b.stringify(F);
    } else if (y.path != null) T = y.path, b = n.find((j) => j.re.test(T)), b && (F = b.parse(T), K = b.record.name);
    else {
      if (b = w.name ? r.get(w.name) : n.find((j) => j.re.test(w.path)), !b) throw Yt(xe.MATCHER_NOT_FOUND, { location: y, currentLocation: w });
      K = b.record.name, F = se({}, w.params, y.params), T = b.stringify(F);
    }
    const W = [];
    let D = b;
    for (; D; ) W.unshift(D.record), D = D.parent;
    return { name: K, path: T, params: F, matched: W, meta: gf(W) };
  }
  e.forEach((y) => l(y));
  function u() {
    n.length = 0, r.clear();
  }
  return { addRoute: l, resolve: m, removeRoute: c, clearRoutes: u, getRoutes: a, getRecordMatcher: i };
}
function qi(e, t) {
  const n = {};
  for (const r of t) r in e && (n[r] = e[r]);
  return n;
}
function Yi(e) {
  const t = { path: e.path, redirect: e.redirect, name: e.name, meta: e.meta || {}, aliasOf: e.aliasOf, beforeEnter: e.beforeEnter, props: df(e), children: e.children || [], instances: {}, leaveGuards: /* @__PURE__ */ new Set(), updateGuards: /* @__PURE__ */ new Set(), enterCallbacks: {}, components: "components" in e ? e.components || null : e.component && { default: e.component } };
  return Object.defineProperty(t, "mods", { value: {} }), t;
}
function df(e) {
  const t = {}, n = e.props || false;
  if ("component" in e) t.default = n;
  else for (const r in e.components) t[r] = typeof n == "object" ? n[r] : n;
  return t;
}
function Ji(e) {
  for (; e; ) {
    if (e.record.aliasOf) return true;
    e = e.parent;
  }
  return false;
}
function gf(e) {
  return e.reduce((t, n) => se(t, n.meta), {});
}
function mf(e, t) {
  let n = 0, r = t.length;
  for (; n !== r; ) {
    const l = n + r >> 1;
    Fo(e, t[l]) < 0 ? r = l : n = l + 1;
  }
  const i = yf(e);
  return i && (r = t.lastIndexOf(i, r - 1)), r;
}
function yf(e) {
  let t = e;
  for (; t = t.parent; ) if (No(t) && Fo(e, t) === 0) return t;
}
function No({ record: e }) {
  return !!(e.name || e.components && Object.keys(e.components).length || e.redirect);
}
function zi(e) {
  const t = $e(zn), n = $e(ti), r = We(() => {
    const h = Ft(e.to);
    return t.resolve(h);
  }), i = We(() => {
    const { matched: h } = r.value, { length: m } = h, u = h[m - 1], y = n.matched;
    if (!u || !y.length) return -1;
    const w = y.findIndex(qt.bind(null, u));
    if (w > -1) return w;
    const b = Qi(h[m - 2]);
    return m > 1 && Qi(u) === b && y[y.length - 1].path !== b ? y.findIndex(qt.bind(null, h[m - 2])) : w;
  }), l = We(() => i.value > -1 && bf(n.params, r.value.params)), c = We(() => i.value > -1 && i.value === n.matched.length - 1 && Bo(n.params, r.value.params));
  function a(h = {}) {
    if (Ef(h)) {
      const m = t[Ft(e.replace) ? "replace" : "push"](Ft(e.to)).catch(cn);
      return e.viewTransition && typeof document < "u" && "startViewTransition" in document && document.startViewTransition(() => m), m;
    }
    return Promise.resolve();
  }
  return { route: r, href: We(() => r.value.href), isActive: l, isExactActive: c, navigate: a };
}
function _f(e) {
  return e.length === 1 ? e[0] : e;
}
const xf = Ds({ name: "RouterLink", compatConfig: { MODE: 3 }, props: { to: { type: [String, Object], required: true }, replace: Boolean, activeClass: String, exactActiveClass: String, custom: Boolean, ariaCurrentValue: { type: String, default: "page" }, viewTransition: Boolean }, useLink: zi, setup(e, { slots: t }) {
  const n = yn(zi(e)), { options: r } = $e(zn), i = We(() => ({ [Xi(e.activeClass, r.linkActiveClass, "router-link-active")]: n.isActive, [Xi(e.exactActiveClass, r.linkExactActiveClass, "router-link-exact-active")]: n.isExactActive }));
  return () => {
    const l = t.default && _f(t.default(n));
    return e.custom ? l : go("a", { "aria-current": n.isExactActive ? e.ariaCurrentValue : null, href: n.href, onClick: n.navigate, class: i.value }, l);
  };
} }), wf = xf;
function Ef(e) {
  if (!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && !e.defaultPrevented && !(e.button !== void 0 && e.button !== 0)) {
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const t = e.currentTarget.getAttribute("target");
      if (/\b_blank\b/i.test(t)) return;
    }
    return e.preventDefault && e.preventDefault(), true;
  }
}
function bf(e, t) {
  for (const n in t) {
    const r = t[n], i = e[n];
    if (typeof r == "string") {
      if (r !== i) return false;
    } else if (!Xe(i) || i.length !== r.length || r.some((l, c) => l.valueOf() !== i[c].valueOf())) return false;
  }
  return true;
}
function Qi(e) {
  return e ? e.aliasOf ? e.aliasOf.path : e.path : "";
}
const Xi = (e, t, n) => e ?? t ?? n, Af = Ds({ name: "RouterView", inheritAttrs: false, props: { name: { type: String, default: "default" }, route: Object }, compatConfig: { MODE: 3 }, setup(e, { attrs: t, slots: n }) {
  const r = $e(Or), i = We(() => e.route || r.value), l = $e(Gi, 0), c = We(() => {
    let m = Ft(l);
    const { matched: u } = i.value;
    let y;
    for (; (y = u[m]) && !y.components; ) m++;
    return m;
  }), a = We(() => i.value.matched[c.value]);
  vn(Gi, We(() => c.value + 1)), vn(Qu, a), vn(Or, i);
  const h = Ss();
  return nn(() => [h.value, a.value, e.name], ([m, u, y], [w, b, F]) => {
    u && (u.instances[y] = m, b && b !== u && m && m === w && (u.leaveGuards.size || (u.leaveGuards = b.leaveGuards), u.updateGuards.size || (u.updateGuards = b.updateGuards))), m && u && (!b || !qt(u, b) || !w) && (u.enterCallbacks[y] || []).forEach((T) => T(m));
  }, { flush: "post" }), () => {
    const m = i.value, u = e.name, y = a.value, w = y && y.components[u];
    if (!w) return Zi(n.default, { Component: w, route: m });
    const b = y.props[u], F = b ? b === true ? m.params : typeof b == "function" ? b(m) : b : null, K = go(w, se({}, F, t, { onVnodeUnmounted: (W) => {
      W.component.isUnmounted && (y.instances[u] = null);
    }, ref: h }));
    return Zi(n.default, { Component: K, route: m }) || K;
  };
} });
function Zi(e, t) {
  if (!e) return null;
  const n = e(t);
  return n.length === 1 ? n[0] : n;
}
const vf = Af;
function Gf(e) {
  const t = pf(e.routes, e), n = e.parseQuery || Ju, r = e.stringifyQuery || ki, i = e.history, l = Qt(), c = Qt(), a = Qt(), h = pl(Et);
  let m = Et;
  Ht && e.scrollBehavior && "scrollRestoration" in history && (history.scrollRestoration = "manual");
  const u = fr.bind(null, (R) => "" + R), y = fr.bind(null, Pu), w = fr.bind(null, gn);
  function b(R, U) {
    let N, V;
    return To(R) ? (N = t.getRecordMatcher(R), V = U) : V = R, t.addRoute(V, N);
  }
  function F(R) {
    const U = t.getRecordMatcher(R);
    U && t.removeRoute(U);
  }
  function T() {
    return t.getRoutes().map((R) => R.record);
  }
  function K(R) {
    return !!t.getRecordMatcher(R);
  }
  function W(R, U) {
    if (U = se({}, U || h.value), typeof R == "string") {
      const x = ar(n, R, U.path), I = t.resolve({ path: x.path }, U), S = i.createHref(x.fullPath);
      return se(x, I, { params: w(I.params), hash: gn(x.hash), redirectedFrom: void 0, href: S });
    }
    let N;
    if (R.path != null) N = se({}, R, { path: ar(n, R.path, U.path).path });
    else {
      const x = se({}, R.params);
      for (const I in x) x[I] == null && delete x[I];
      N = se({}, R, { params: y(x) }), U.params = y(U.params);
    }
    const V = t.resolve(N, U), z = R.hash || "";
    V.params = u(w(V.params));
    const d = Mu(r, se({}, R, { hash: Bu(z), path: V.path })), g = i.createHref(d);
    return se({ fullPath: d, hash: z, query: r === ki ? zu(R.query) : R.query || {} }, V, { redirectedFrom: void 0, href: g });
  }
  function D(R) {
    return typeof R == "string" ? ar(n, R, h.value.path) : se({}, R);
  }
  function j(R, U) {
    if (m !== R) return Yt(xe.NAVIGATION_CANCELLED, { from: U, to: R });
  }
  function L(R) {
    return ie(R);
  }
  function Q(R) {
    return L(se(D(R), { replace: true }));
  }
  function Ee(R, U) {
    const N = R.matched[R.matched.length - 1];
    if (N && N.redirect) {
      const { redirect: V } = N;
      let z = typeof V == "function" ? V(R, U) : V;
      return typeof z == "string" && (z = z.includes("?") || z.includes("#") ? z = D(z) : { path: z }, z.params = {}), se({ query: R.query, hash: R.hash, params: z.path != null ? {} : R.params }, z);
    }
  }
  function ie(R, U) {
    const N = m = W(R), V = h.value, z = R.state, d = R.force, g = R.replace === true, x = Ee(N, V);
    if (x) return ie(se(D(x), { state: typeof x == "object" ? se({}, z, x.state) : z, force: d, replace: g }), U || N);
    const I = N;
    I.redirectedFrom = U;
    let S;
    return !d && Du(r, V, N) && (S = Yt(xe.NAVIGATION_DUPLICATED, { to: I, from: V }), ke(V, V, true, false)), (S ? Promise.resolve(S) : ae(I, V)).catch((v) => ut(v) ? ut(v, xe.NAVIGATION_GUARD_REDIRECT) ? v : et(v) : ne(v, I, V)).then((v) => {
      if (v) {
        if (ut(v, xe.NAVIGATION_GUARD_REDIRECT)) return ie(se({ replace: g }, D(v.to), { state: typeof v.to == "object" ? se({}, z, v.to.state) : z, force: d }), U || I);
      } else v = Fe(I, V, true, g, z);
      return ve(I, V, v), v;
    });
  }
  function q(R, U) {
    const N = j(R, U);
    return N ? Promise.reject(N) : Promise.resolve();
  }
  function Z(R) {
    const U = de.values().next().value;
    return U && typeof U.runWithContext == "function" ? U.runWithContext(R) : R();
  }
  function ae(R, U) {
    let N;
    const [V, z, d] = Xu(R, U);
    N = pr(V.reverse(), "beforeRouteLeave", R, U);
    for (const x of V) x.leaveGuards.forEach((I) => {
      N.push(It(I, R, U));
    });
    const g = q.bind(null, R, U);
    return N.push(g), Ne(N).then(() => {
      N = [];
      for (const x of l.list()) N.push(It(x, R, U));
      return N.push(g), Ne(N);
    }).then(() => {
      N = pr(z, "beforeRouteUpdate", R, U);
      for (const x of z) x.updateGuards.forEach((I) => {
        N.push(It(I, R, U));
      });
      return N.push(g), Ne(N);
    }).then(() => {
      N = [];
      for (const x of d) if (x.beforeEnter) if (Xe(x.beforeEnter)) for (const I of x.beforeEnter) N.push(It(I, R, U));
      else N.push(It(x.beforeEnter, R, U));
      return N.push(g), Ne(N);
    }).then(() => (R.matched.forEach((x) => x.enterCallbacks = {}), N = pr(d, "beforeRouteEnter", R, U, Z), N.push(g), Ne(N))).then(() => {
      N = [];
      for (const x of c.list()) N.push(It(x, R, U));
      return N.push(g), Ne(N);
    }).catch((x) => ut(x, xe.NAVIGATION_CANCELLED) ? x : Promise.reject(x));
  }
  function ve(R, U, N) {
    a.list().forEach((V) => Z(() => V(R, U, N)));
  }
  function Fe(R, U, N, V, z) {
    const d = j(R, U);
    if (d) return d;
    const g = U === Et, x = Ht ? history.state : {};
    N && (V || g ? i.replace(R.fullPath, se({ scroll: g && x && x.scroll }, z)) : i.push(R.fullPath, z)), h.value = R, ke(R, U, N, g), et();
  }
  let Se;
  function lt() {
    Se || (Se = i.listen((R, U, N) => {
      if (!ye.listening) return;
      const V = W(R), z = Ee(V, ye.currentRoute.value);
      if (z) {
        ie(se(z, { replace: true, force: true }), V).catch(cn);
        return;
      }
      m = V;
      const d = h.value;
      Ht && Ku(Vi(d.fullPath, N.delta), Jn()), ae(V, d).catch((g) => ut(g, xe.NAVIGATION_ABORTED | xe.NAVIGATION_CANCELLED) ? g : ut(g, xe.NAVIGATION_GUARD_REDIRECT) ? (ie(se(D(g.to), { force: true }), V).then((x) => {
        ut(x, xe.NAVIGATION_ABORTED | xe.NAVIGATION_DUPLICATED) && !N.delta && N.type === Br.pop && i.go(-1, false);
      }).catch(cn), Promise.reject()) : (N.delta && i.go(-N.delta, false), ne(g, V, d))).then((g) => {
        g = g || Fe(V, d, false), g && (N.delta && !ut(g, xe.NAVIGATION_CANCELLED) ? i.go(-N.delta, false) : N.type === Br.pop && ut(g, xe.NAVIGATION_ABORTED | xe.NAVIGATION_DUPLICATED) && i.go(-1, false)), ve(V, d, g);
      }).catch(cn);
    }));
  }
  let Ze = Qt(), he = Qt(), Y;
  function ne(R, U, N) {
    et(R);
    const V = he.list();
    return V.length ? V.forEach((z) => z(R, U, N)) : console.error(R), Promise.reject(R);
  }
  function Ye() {
    return Y && h.value !== Et ? Promise.resolve() : new Promise((R, U) => {
      Ze.add([R, U]);
    });
  }
  function et(R) {
    return Y || (Y = !R, lt(), Ze.list().forEach(([U, N]) => R ? N(R) : U()), Ze.reset()), R;
  }
  function ke(R, U, N, V) {
    const { scrollBehavior: z } = e;
    if (!Ht || !z) return Promise.resolve();
    const d = !N && Wu(Vi(R.fullPath, 0)) || (V || !N) && history.state && history.state.scroll || null;
    return $r().then(() => z(R, U, d)).then((g) => g && Gu(g)).catch((g) => ne(g, R, U));
  }
  const Ce = (R) => i.go(R);
  let wt;
  const de = /* @__PURE__ */ new Set(), ye = { currentRoute: h, listening: true, addRoute: b, removeRoute: F, clearRoutes: t.clearRoutes, hasRoute: K, getRoutes: T, resolve: W, options: e, push: L, replace: Q, go: Ce, back: () => Ce(-1), forward: () => Ce(1), beforeEach: l.add, beforeResolve: c.add, afterEach: a.add, onError: he.add, isReady: Ye, install(R) {
    R.component("RouterLink", wf), R.component("RouterView", vf), R.config.globalProperties.$router = ye, Object.defineProperty(R.config.globalProperties, "$route", { enumerable: true, get: () => Ft(h) }), Ht && !wt && h.value === Et && (wt = true, L(i.location).catch((V) => {
    }));
    const U = {};
    for (const V in Et) Object.defineProperty(U, V, { get: () => h.value[V], enumerable: true });
    R.provide(zn, ye), R.provide(ti, Rs(U)), R.provide(Or, h);
    const N = R.unmount;
    de.add(R), R.unmount = function() {
      de.delete(R), de.size < 1 && (m = Et, Se && Se(), Se = null, h.value = Et, wt = false, Y = false), N();
    };
  } };
  function Ne(R) {
    return R.reduce((U, N) => U.then(() => Z(N)), Promise.resolve());
  }
  return ye;
}
function Kf() {
  return $e(zn);
}
function Wf(e) {
  return $e(ti);
}
export {
  Ur as A,
  jf as B,
  Bf as C,
  go as D,
  Of as E,
  Ke as F,
  Hs as G,
  bc as H,
  Df as I,
  $r as J,
  Tf as K,
  $e as L,
  Gf as M,
  kf as N,
  Mf as O,
  Dr as P,
  vn as Q,
  Cf as R,
  Uf as S,
  Hf as T,
  yr as a,
  Kf as b,
  We as c,
  Vf as d,
  yn as e,
  nn as f,
  Ds as g,
  Pf as h,
  fo as i,
  je as j,
  Ft as k,
  Rl as l,
  Sf as m,
  Ec as n,
  br as o,
  qo as p,
  Ar as q,
  Ss as r,
  Ff as s,
  $o as t,
  Wf as u,
  we as v,
  Rf as w,
  Ll as x,
  If as y,
  Nf as z
};
