import { a as SIMULATOR_HAND_POSE_NAMES, b as XR_BLOCKS_ASSETS_PATH, c as SetSimulatorModeEvent, d as SimulatorHandPoseChangeRequestEvent, l as ShowSimulatorInstructionsEvent, o as SetSimulatorEnvironmentEvent, s as SetSimulatorHandPhysicsEvent, u as SimulatorHandPose } from "./HandPoses-M-IgTq78.js";
import { n as SetSimulatorTimeOfDayEvent, t as SetSimulatorDayNightEvent } from "./SimulatorLightingEvents-BqFjrTlm.js";
// node_modules/@lit/reactive-element/css-tag.js
/**
* @license
* Copyright 2019 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var t$4 = globalThis;
var e$6 = t$4.ShadowRoot && (void 0 === t$4.ShadyCSS || t$4.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s$4 = Symbol();
var o$6 = /* @__PURE__ */ new WeakMap();
var n$6 = class {
	constructor(t, e, o) {
		if (this._$cssResult$ = !0, o !== s$4) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = t, this.t = e;
	}
	get styleSheet() {
		let t = this.o;
		const s = this.t;
		if (e$6 && void 0 === t) {
			const e = void 0 !== s && 1 === s.length;
			e && (t = o$6.get(s)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), e && o$6.set(s, t));
		}
		return t;
	}
	toString() {
		return this.cssText;
	}
};
var r$6 = (t) => new n$6("string" == typeof t ? t : t + "", void 0, s$4);
var i$5 = (t, ...e) => {
	return new n$6(1 === t.length ? t[0] : e.reduce((e, s, o) => e + ((t) => {
		if (!0 === t._$cssResult$) return t.cssText;
		if ("number" == typeof t) return t;
		throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
	})(s) + t[o + 1], t[0]), t, s$4);
};
var S$1 = (s, o) => {
	if (e$6) s.adoptedStyleSheets = o.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
	else for (const e of o) {
		const o = document.createElement("style"), n = t$4.litNonce;
		void 0 !== n && o.setAttribute("nonce", n), o.textContent = e.cssText, s.appendChild(o);
	}
};
var c$4 = e$6 ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((t) => {
	let e = "";
	for (const s of t.cssRules) e += s.cssText;
	return r$6(e);
})(t) : t;
// node_modules/@lit/reactive-element/reactive-element.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ var { is: i$4, defineProperty: e$5, getOwnPropertyDescriptor: h$4, getOwnPropertyNames: r$5, getOwnPropertySymbols: o$5, getPrototypeOf: n$5 } = Object, a$1 = globalThis, c$3 = a$1.trustedTypes, l$2 = c$3 ? c$3.emptyScript : "", p$2 = a$1.reactiveElementPolyfillSupport, d$2 = (t, s) => t, u$2 = {
	toAttribute(t, s) {
		switch (s) {
			case Boolean:
				t = t ? l$2 : null;
				break;
			case Object:
			case Array: t = null == t ? t : JSON.stringify(t);
		}
		return t;
	},
	fromAttribute(t, s) {
		let i = t;
		switch (s) {
			case Boolean:
				i = null !== t;
				break;
			case Number:
				i = null === t ? null : Number(t);
				break;
			case Object:
			case Array: try {
				i = JSON.parse(t);
			} catch (t) {
				i = null;
			}
		}
		return i;
	}
}, f$3 = (t, s) => !i$4(t, s), b$1 = {
	attribute: !0,
	type: String,
	converter: u$2,
	reflect: !1,
	useDefault: !1,
	hasChanged: f$3
};
Symbol.metadata ??= Symbol("metadata"), a$1.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var y$1 = class extends HTMLElement {
	static addInitializer(t) {
		this._$Ei(), (this.l ??= []).push(t);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(t, s = b$1) {
		if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
			const i = Symbol(), h = this.getPropertyDescriptor(t, i, s);
			void 0 !== h && e$5(this.prototype, t, h);
		}
	}
	static getPropertyDescriptor(t, s, i) {
		const { get: e, set: r } = h$4(this.prototype, t) ?? {
			get() {
				return this[s];
			},
			set(t) {
				this[s] = t;
			}
		};
		return {
			get: e,
			set(s) {
				const h = e?.call(this);
				r?.call(this, s), this.requestUpdate(t, h, i);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(t) {
		return this.elementProperties.get(t) ?? b$1;
	}
	static _$Ei() {
		if (this.hasOwnProperty(d$2("elementProperties"))) return;
		const t = n$5(this);
		t.finalize(), void 0 !== t.l && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(d$2("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(d$2("properties"))) {
			const t = this.properties, s = [...r$5(t), ...o$5(t)];
			for (const i of s) this.createProperty(i, t[i]);
		}
		const t = this[Symbol.metadata];
		if (null !== t) {
			const s = litPropertyMetadata.get(t);
			if (void 0 !== s) for (const [t, i] of s) this.elementProperties.set(t, i);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (const [t, s] of this.elementProperties) {
			const i = this._$Eu(t, s);
			void 0 !== i && this._$Eh.set(i, t);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(s) {
		const i = [];
		if (Array.isArray(s)) {
			const e = new Set(s.flat(1 / 0).reverse());
			for (const s of e) i.unshift(c$4(s));
		} else void 0 !== s && i.push(c$4(s));
		return i;
	}
	static _$Eu(t, s) {
		const i = s.attribute;
		return !1 === i ? void 0 : "string" == typeof i ? i : "string" == typeof t ? t.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
	}
	addController(t) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(t), void 0 !== this.renderRoot && this.isConnected && t.hostConnected?.();
	}
	removeController(t) {
		this._$EO?.delete(t);
	}
	_$E_() {
		const t = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
		for (const i of s.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
		t.size > 0 && (this._$Ep = t);
	}
	createRenderRoot() {
		const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return S$1(t, this.constructor.elementStyles), t;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
	}
	enableUpdating(t) {}
	disconnectedCallback() {
		this._$EO?.forEach((t) => t.hostDisconnected?.());
	}
	attributeChangedCallback(t, s, i) {
		this._$AK(t, i);
	}
	_$ET(t, s) {
		const i = this.constructor.elementProperties.get(t), e = this.constructor._$Eu(t, i);
		if (void 0 !== e && !0 === i.reflect) {
			const h = (void 0 !== i.converter?.toAttribute ? i.converter : u$2).toAttribute(s, i.type);
			this._$Em = t, null == h ? this.removeAttribute(e) : this.setAttribute(e, h), this._$Em = null;
		}
	}
	_$AK(t, s) {
		const i = this.constructor, e = i._$Eh.get(t);
		if (void 0 !== e && this._$Em !== e) {
			const t = i.getPropertyOptions(e), h = "function" == typeof t.converter ? { fromAttribute: t.converter } : void 0 !== t.converter?.fromAttribute ? t.converter : u$2;
			this._$Em = e;
			const r = h.fromAttribute(s, t.type);
			this[e] = r ?? this._$Ej?.get(e) ?? r, this._$Em = null;
		}
	}
	requestUpdate(t, s, i, e = !1, h) {
		if (void 0 !== t) {
			const r = this.constructor;
			if (!1 === e && (h = this[t]), i ??= r.getPropertyOptions(t), !((i.hasChanged ?? f$3)(h, s) || i.useDefault && i.reflect && h === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, i)))) return;
			this.C(t, s, i);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(t, s, { useDefault: i, reflect: e, wrapped: h }, r) {
		i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? s ?? this[t]), !0 !== h || void 0 !== r) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), !0 === e && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (t) {
			Promise.reject(t);
		}
		const t = this.scheduleUpdate();
		return null != t && await t, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (const [t, s] of this._$Ep) this[t] = s;
				this._$Ep = void 0;
			}
			const t = this.constructor.elementProperties;
			if (t.size > 0) for (const [s, i] of t) {
				const { wrapped: t } = i, e = this[s];
				!0 !== t || this._$AL.has(s) || void 0 === e || this.C(s, void 0, i, e);
			}
		}
		let t = !1;
		const s = this._$AL;
		try {
			t = this.shouldUpdate(s), t ? (this.willUpdate(s), this._$EO?.forEach((t) => t.hostUpdate?.()), this.update(s)) : this._$EM();
		} catch (s) {
			throw t = !1, this._$EM(), s;
		}
		t && this._$AE(s);
	}
	willUpdate(t) {}
	_$AE(t) {
		this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(t) {
		return !0;
	}
	update(t) {
		this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
	}
	updated(t) {}
	firstUpdated(t) {}
};
y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$2("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$2("finalized")] = /* @__PURE__ */ new Map(), p$2?.({ ReactiveElement: y$1 }), (a$1.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var t$3 = globalThis;
var i$3 = (t) => t;
var s$3 = t$3.trustedTypes;
var e$4 = s$3 ? s$3.createPolicy("lit-html", { createHTML: (t) => t }) : void 0;
var h$3 = "$lit$";
var o$4 = `lit$${Math.random().toFixed(9).slice(2)}$`;
var n$4 = "?" + o$4;
var r$4 = `<${n$4}>`;
var l$1 = document;
var c$2 = () => l$1.createComment("");
var a = (t) => null === t || "object" != typeof t && "function" != typeof t;
var u$1 = Array.isArray;
var d$1 = (t) => u$1(t) || "function" == typeof t?.[Symbol.iterator];
var f$2 = "[ 	\n\f\r]";
var v$1 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _ = /-->/g;
var m$1 = />/g;
var p$1 = RegExp(`>|${f$2}(?:([^\\s"'>=/]+)(${f$2}*=${f$2}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g");
var g = /'/g;
var $ = /"/g;
var y = /^(?:script|style|textarea|title)$/i;
var x = (t) => (i, ...s) => ({
	_$litType$: t,
	strings: i,
	values: s
});
var b = x(1);
var E = Symbol.for("lit-noChange");
var A = Symbol.for("lit-nothing");
var C = /* @__PURE__ */ new WeakMap();
var P = l$1.createTreeWalker(l$1, 129);
function V(t, i) {
	if (!u$1(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return void 0 !== e$4 ? e$4.createHTML(i) : i;
}
var N = (t, i) => {
	const s = t.length - 1, e = [];
	let n, l = 2 === i ? "<svg>" : 3 === i ? "<math>" : "", c = v$1;
	for (let i = 0; i < s; i++) {
		const s = t[i];
		let a, u, d = -1, f = 0;
		for (; f < s.length && (c.lastIndex = f, u = c.exec(s), null !== u);) f = c.lastIndex, c === v$1 ? "!--" === u[1] ? c = _ : void 0 !== u[1] ? c = m$1 : void 0 !== u[2] ? (y.test(u[2]) && (n = RegExp("</" + u[2], "g")), c = p$1) : void 0 !== u[3] && (c = p$1) : c === p$1 ? ">" === u[0] ? (c = n ?? v$1, d = -1) : void 0 === u[1] ? d = -2 : (d = c.lastIndex - u[2].length, a = u[1], c = void 0 === u[3] ? p$1 : "\"" === u[3] ? $ : g) : c === $ || c === g ? c = p$1 : c === _ || c === m$1 ? c = v$1 : (c = p$1, n = void 0);
		const x = c === p$1 && t[i + 1].startsWith("/>") ? " " : "";
		l += c === v$1 ? s + r$4 : d >= 0 ? (e.push(a), s.slice(0, d) + h$3 + s.slice(d) + o$4 + x) : s + o$4 + (-2 === d ? i : x);
	}
	return [V(t, l + (t[s] || "<?>") + (2 === i ? "</svg>" : 3 === i ? "</math>" : "")), e];
};
var S = class S {
	constructor({ strings: t, _$litType$: i }, e) {
		let r;
		this.parts = [];
		let l = 0, a = 0;
		const u = t.length - 1, d = this.parts, [f, v] = N(t, i);
		if (this.el = S.createElement(f, e), P.currentNode = this.el.content, 2 === i || 3 === i) {
			const t = this.el.content.firstChild;
			t.replaceWith(...t.childNodes);
		}
		for (; null !== (r = P.nextNode()) && d.length < u;) {
			if (1 === r.nodeType) {
				if (r.hasAttributes()) for (const t of r.getAttributeNames()) if (t.endsWith(h$3)) {
					const i = v[a++], s = r.getAttribute(t).split(o$4), e = /([.?@])?(.*)/.exec(i);
					d.push({
						type: 1,
						index: l,
						name: e[2],
						strings: s,
						ctor: "." === e[1] ? I : "?" === e[1] ? L : "@" === e[1] ? z : H
					}), r.removeAttribute(t);
				} else t.startsWith(o$4) && (d.push({
					type: 6,
					index: l
				}), r.removeAttribute(t));
				if (y.test(r.tagName)) {
					const t = r.textContent.split(o$4), i = t.length - 1;
					if (i > 0) {
						r.textContent = s$3 ? s$3.emptyScript : "";
						for (let s = 0; s < i; s++) r.append(t[s], c$2()), P.nextNode(), d.push({
							type: 2,
							index: ++l
						});
						r.append(t[i], c$2());
					}
				}
			} else if (8 === r.nodeType) if (r.data === n$4) d.push({
				type: 2,
				index: l
			});
			else {
				let t = -1;
				for (; -1 !== (t = r.data.indexOf(o$4, t + 1));) d.push({
					type: 7,
					index: l
				}), t += o$4.length - 1;
			}
			l++;
		}
	}
	static createElement(t, i) {
		const s = l$1.createElement("template");
		return s.innerHTML = t, s;
	}
};
function M$1(t, i, s = t, e) {
	if (i === E) return i;
	let h = void 0 !== e ? s._$Co?.[e] : s._$Cl;
	const o = a(i) ? void 0 : i._$litDirective$;
	return h?.constructor !== o && (h?._$AO?.(!1), void 0 === o ? h = void 0 : (h = new o(t), h._$AT(t, s, e)), void 0 !== e ? (s._$Co ??= [])[e] = h : s._$Cl = h), void 0 !== h && (i = M$1(t, h._$AS(t, i.values), h, e)), i;
}
var R = class {
	constructor(t, i) {
		this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(t) {
		const { el: { content: i }, parts: s } = this._$AD, e = (t?.creationScope ?? l$1).importNode(i, !0);
		P.currentNode = e;
		let h = P.nextNode(), o = 0, n = 0, r = s[0];
		for (; void 0 !== r;) {
			if (o === r.index) {
				let i;
				2 === r.type ? i = new k(h, h.nextSibling, this, t) : 1 === r.type ? i = new r.ctor(h, r.name, r.strings, this, t) : 6 === r.type && (i = new Z(h, this, t)), this._$AV.push(i), r = s[++n];
			}
			o !== r?.index && (h = P.nextNode(), o++);
		}
		return P.currentNode = l$1, e;
	}
	p(t) {
		let i = 0;
		for (const s of this._$AV) void 0 !== s && (void 0 !== s.strings ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
	}
};
var k = class k {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(t, i, s, e) {
		this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = e, this._$Cv = e?.isConnected ?? !0;
	}
	get parentNode() {
		let t = this._$AA.parentNode;
		const i = this._$AM;
		return void 0 !== i && 11 === t?.nodeType && (t = i.parentNode), t;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(t, i = this) {
		t = M$1(this, t, i), a(t) ? t === A || null == t || "" === t ? (this._$AH !== A && this._$AR(), this._$AH = A) : t !== this._$AH && t !== E && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : d$1(t) ? this.k(t) : this._(t);
	}
	O(t) {
		return this._$AA.parentNode.insertBefore(t, this._$AB);
	}
	T(t) {
		this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
	}
	_(t) {
		this._$AH !== A && a(this._$AH) ? this._$AA.nextSibling.data = t : this.T(l$1.createTextNode(t)), this._$AH = t;
	}
	$(t) {
		const { values: i, _$litType$: s } = t, e = "number" == typeof s ? this._$AC(t) : (void 0 === s.el && (s.el = S.createElement(V(s.h, s.h[0]), this.options)), s);
		if (this._$AH?._$AD === e) this._$AH.p(i);
		else {
			const t = new R(e, this), s = t.u(this.options);
			t.p(i), this.T(s), this._$AH = t;
		}
	}
	_$AC(t) {
		let i = C.get(t.strings);
		return void 0 === i && C.set(t.strings, i = new S(t)), i;
	}
	k(t) {
		u$1(this._$AH) || (this._$AH = [], this._$AR());
		const i = this._$AH;
		let s, e = 0;
		for (const h of t) e === i.length ? i.push(s = new k(this.O(c$2()), this.O(c$2()), this, this.options)) : s = i[e], s._$AI(h), e++;
		e < i.length && (this._$AR(s && s._$AB.nextSibling, e), i.length = e);
	}
	_$AR(t = this._$AA.nextSibling, s) {
		for (this._$AP?.(!1, !0, s); t !== this._$AB;) {
			const s = i$3(t).nextSibling;
			i$3(t).remove(), t = s;
		}
	}
	setConnected(t) {
		void 0 === this._$AM && (this._$Cv = t, this._$AP?.(t));
	}
};
var H = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(t, i, s, e, h) {
		this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t, this.name = i, this._$AM = e, this.options = h, s.length > 2 || "" !== s[0] || "" !== s[1] ? (this._$AH = Array(s.length - 1).fill(/* @__PURE__ */ new String()), this.strings = s) : this._$AH = A;
	}
	_$AI(t, i = this, s, e) {
		const h = this.strings;
		let o = !1;
		if (void 0 === h) t = M$1(this, t, i, 0), o = !a(t) || t !== this._$AH && t !== E, o && (this._$AH = t);
		else {
			const e = t;
			let n, r;
			for (t = h[0], n = 0; n < h.length - 1; n++) r = M$1(this, e[s + n], i, n), r === E && (r = this._$AH[n]), o ||= !a(r) || r !== this._$AH[n], r === A ? t = A : t !== A && (t += (r ?? "") + h[n + 1]), this._$AH[n] = r;
		}
		o && !e && this.j(t);
	}
	j(t) {
		t === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
	}
};
var I = class extends H {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(t) {
		this.element[this.name] = t === A ? void 0 : t;
	}
};
var L = class extends H {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(t) {
		this.element.toggleAttribute(this.name, !!t && t !== A);
	}
};
var z = class extends H {
	constructor(t, i, s, e, h) {
		super(t, i, s, e, h), this.type = 5;
	}
	_$AI(t, i = this) {
		if ((t = M$1(this, t, i, 0) ?? A) === E) return;
		const s = this._$AH, e = t === A && s !== A || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, h = t !== A && (s === A || e);
		e && this.element.removeEventListener(this.name, this, s), h && this.element.addEventListener(this.name, this, t), this._$AH = t;
	}
	handleEvent(t) {
		"function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
	}
};
var Z = class {
	constructor(t, i, s) {
		this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(t) {
		M$1(this, t);
	}
};
var j$1 = {
	M: h$3,
	P: o$4,
	A: n$4,
	C: 1,
	L: N,
	R,
	D: d$1,
	V: M$1,
	I: k,
	H,
	N: L,
	U: z,
	B: I,
	F: Z
};
var B = t$3.litHtmlPolyfillSupport;
B?.(S, k), (t$3.litHtmlVersions ??= []).push("3.3.3");
var D = (t, i, s) => {
	const e = s?.renderBefore ?? i;
	let h = e._$litPart$;
	if (void 0 === h) {
		const t = s?.renderBefore ?? null;
		e._$litPart$ = h = new k(i.insertBefore(c$2(), t), t, void 0, s ?? {});
	}
	return h._$AI(t), h;
};
// node_modules/lit-element/lit-element.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ var s$2 = globalThis;
var i$2 = class extends y$1 {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		const t = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= t.firstChild, t;
	}
	update(t) {
		const r = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = D(r, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return E;
	}
};
i$2._$litElement$ = !0, i$2["finalized"] = !0, s$2.litElementHydrateSupport?.({ LitElement: i$2 });
var o$3 = s$2.litElementPolyfillSupport;
o$3?.({ LitElement: i$2 });
(s$2.litElementVersions ??= []).push("4.2.2");
// node_modules/@lit/reactive-element/decorators/custom-element.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var t$2 = (t) => (e, o) => {
	void 0 !== o ? o.addInitializer(() => {
		customElements.define(t, e);
	}) : customElements.define(t, e);
};
// node_modules/@lit/reactive-element/decorators/property.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ var o$2 = {
	attribute: !0,
	type: String,
	converter: u$2,
	reflect: !1,
	hasChanged: f$3
};
var r$3 = (t = o$2, e, r) => {
	const { kind: n, metadata: i } = r;
	let s = globalThis.litPropertyMetadata.get(i);
	if (void 0 === s && globalThis.litPropertyMetadata.set(i, s = /* @__PURE__ */ new Map()), "setter" === n && ((t = Object.create(t)).wrapped = !0), s.set(r.name, t), "accessor" === n) {
		const { name: o } = r;
		return {
			set(r) {
				const n = e.get.call(this);
				e.set.call(this, r), this.requestUpdate(o, n, t, !0, r);
			},
			init(e) {
				return void 0 !== e && this.C(o, void 0, t, e), e;
			}
		};
	}
	if ("setter" === n) {
		const { name: o } = r;
		return function(r) {
			const n = this[o];
			e.call(this, r), this.requestUpdate(o, n, t, !0, r);
		};
	}
	throw Error("Unsupported decorator location: " + n);
};
function n$3(t) {
	return (e, o) => "object" == typeof o ? r$3(t, e, o) : ((t, e, o) => {
		const r = e.hasOwnProperty(o);
		return e.constructor.createProperty(o, t), r ? Object.getOwnPropertyDescriptor(e, o) : void 0;
	})(t, e, o);
}
// node_modules/@lit/reactive-element/decorators/state.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ function r$2(r) {
	return n$3({
		...r,
		state: !0,
		attribute: !1
	});
}
// node_modules/lit-html/directive.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var t$1 = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
};
var e$3 = (t) => (...e) => ({
	_$litDirective$: t,
	values: e
});
var i$1 = class {
	constructor(t) {}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AT(t, e, i) {
		this._$Ct = t, this._$AM = e, this._$Ci = i;
	}
	_$AS(t, e) {
		return this.update(t, e);
	}
	update(t, e) {
		return this.render(...e);
	}
}, e$2 = e$3(class extends i$1 {
	constructor(t) {
		/**
		* @license
		* Copyright 2018 Google LLC
		* SPDX-License-Identifier: BSD-3-Clause
		*/
		if (super(t), t.type !== t$1.ATTRIBUTE || "class" !== t.name || t.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
	}
	render(t) {
		return " " + Object.keys(t).filter((s) => t[s]).join(" ") + " ";
	}
	update(s, [i]) {
		if (void 0 === this.st) {
			this.st = /* @__PURE__ */ new Set(), void 0 !== s.strings && (this.nt = new Set(s.strings.join(" ").split(/\s/).filter((t) => "" !== t)));
			for (const t in i) i[t] && !this.nt?.has(t) && this.st.add(t);
			return this.render(i);
		}
		const r = s.element.classList;
		for (const t of this.st) t in i || (r.remove(t), this.st.delete(t));
		for (const t in i) {
			const s = !!i[t];
			s === this.st.has(t) || this.nt?.has(t) || (s ? (r.add(t), this.st.add(t)) : (r.remove(t), this.st.delete(t)));
		}
		return E;
	}
}), { I: t } = j$1, r$1 = (o) => void 0 === o.strings;
/**
* @license
* Copyright 2020 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
// node_modules/lit-html/async-directive.js
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ var s = (i, t) => {
	const e = i._$AN;
	if (void 0 === e) return !1;
	for (const i of e) i._$AO?.(t, !1), s(i, t);
	return !0;
};
var o$1 = (i) => {
	let t, e;
	do {
		if (void 0 === (t = i._$AM)) break;
		e = t._$AN, e.delete(i), i = t;
	} while (0 === e?.size);
};
var r = (i) => {
	for (let t; t = i._$AM; i = t) {
		let e = t._$AN;
		if (void 0 === e) t._$AN = e = /* @__PURE__ */ new Set();
		else if (e.has(i)) break;
		e.add(i), c(t);
	}
};
function h$1(i) {
	void 0 !== this._$AN ? (o$1(this), this._$AM = i, r(this)) : this._$AM = i;
}
function n$1(i, t = !1, e = 0) {
	const r = this._$AH, h = this._$AN;
	if (void 0 !== h && 0 !== h.size) if (t) if (Array.isArray(r)) for (let i = e; i < r.length; i++) s(r[i], !1), o$1(r[i]);
	else null != r && (s(r, !1), o$1(r));
	else s(this, i);
}
var c = (i) => {
	i.type == t$1.CHILD && (i._$AP ??= n$1, i._$AQ ??= h$1);
};
var f = class extends i$1 {
	constructor() {
		super(...arguments), this._$AN = void 0;
	}
	_$AT(i, t, e) {
		super._$AT(i, t, e), r(this), this.isConnected = i._$AU;
	}
	_$AO(i, t = !0) {
		i !== this.isConnected && (this.isConnected = i, i ? this.reconnected?.() : this.disconnected?.()), t && (s(this, i), o$1(this));
	}
	setValue(t) {
		if (r$1(this._$Ct)) this._$Ct._$AI(t, this);
		else {
			const i = [...this._$Ct._$AH];
			i[this._$Ci] = t, this._$Ct._$AI(i, this, 0);
		}
	}
	disconnected() {}
	reconnected() {}
};
// node_modules/lit-html/directives/ref.js
/**
* @license
* Copyright 2020 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ var e = () => new h();
var h = class {};
var o = /* @__PURE__ */ new WeakMap();
var n = e$3(class extends f {
	render(i) {
		return A;
	}
	update(i, [s]) {
		const e = s !== this.G;
		return e && this.rt(void 0), (e || this.lt !== this.ct) && (this.G = s, this.ht = i.options?.host, this.rt(this.ct = i.element)), A;
	}
	rt(t) {
		if (void 0 !== this.G) if (this.isConnected || (t = void 0), "function" == typeof this.G) {
			const i = this.ht ?? globalThis;
			let s = o.get(i);
			void 0 === s && (s = /* @__PURE__ */ new WeakMap(), o.set(i, s)), void 0 !== s.get(this.G) && this.G.call(this.ht, void 0), s.set(this.G, t), void 0 !== t && this.G.call(this.ht, t);
		} else this.G.value = t;
	}
	get lt() {
		return "function" == typeof this.G ? o.get(this.ht ?? globalThis)?.get(this.G) : this.G?.value;
	}
	disconnected() {
		this.lt === this.ct && this.rt(void 0);
	}
	reconnected() {
		this.rt(this.ct);
	}
});
// node_modules/xrblocks/build/internal/SimulatorElements.js
/**
* Copyright 2025 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* @file xrblocks.js
* @version v0.24.0
* @commitid e455e0e
* @builddate 2026-10-20T23:59:29.322Z
* @description XR Blocks SDK, built from source with the above commit ID.
* @agent When using with Gemini to create XR apps, use **Gemini Canvas** mode,
* and follow rules below:
* 1. Include the following importmap for maximum compatibility:
"three": "https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js",
"three/addons/": "https://cdn.jsdelivr.net/npm/three@0.186.0/examples/jsm/",
"@pmndrs/uikit": "https://cdn.jsdelivr.net/npm/@pmndrs/uikit@1.0.64/dist/index.min.js",
"@pmndrs/uikit-pub-sub": "https://cdn.jsdelivr.net/npm/@pmndrs/uikit-pub-sub@1.0.64/dist/index.min.js",
"@pmndrs/msdfonts": "https://cdn.jsdelivr.net/npm/@pmndrs/msdfonts@1.0.64/dist/index.min.js",
"@preact/signals-core": "https://cdn.jsdelivr.net/npm/@preact/signals-core@1.14.0/dist/signals-core.mjs",
"yoga-layout/load": "https://cdn.jsdelivr.net/npm/yoga-layout@3.2.1/dist/src/load.js",
"lit": "https://esm.sh/lit@3.3.1",
"lit/": "https://esm.sh/lit@3.3.1/",
"three-pathfinding": "https://cdn.jsdelivr.net/npm/three-pathfinding@1.3.0/dist/three-pathfinding.module.js",
2. If the app focus on standalone objects, spawn it in front of the user in
WebXR and rescale to reasonable physical size. Wrap them with xb.ModelViewer
and make sure users can drag the platform to move it around in XR.
3. When rendering a large scene, remember users may navigate the scene in a
physical world space, also add locomotion methods like pinch to teleport.
4. Do not halluciate mode files --- use either public high-quality assets,
or generate from primitive shapes of use vox formats for voxels or
lego-styles.
*/
var SimulatorInstructionsNextEvent = class SimulatorInstructionsNextEvent extends Event {
	static {
		this.type = "simulatorInstructionsNextEvent";
	}
	constructor() {
		super(SimulatorInstructionsNextEvent.type, {
			bubbles: true,
			composed: true
		});
	}
};
var SimulatorInstructionsCloseEvent = class SimulatorInstructionsCloseEvent extends Event {
	static {
		this.type = "simulatorInstructionsCloseEvent";
	}
	constructor() {
		super(SimulatorInstructionsCloseEvent.type, {
			bubbles: true,
			composed: true
		});
	}
};
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
var SimulatorInstructionsCard = class SimulatorInstructionsCard extends i$2 {
	constructor(..._args) {
		super(..._args);
		this.continueButtonText = "Continue";
	}
	static {
		this.styles = i$5`
    :host {
      position: relative;
      box-sizing: border-box;
      background: #ffffff;
      display: flex;
      /* Fixed popup size shared by every instruction card, sized to fit the
         tallest card's content without a scrollbar; scrolling remains only
         as a fallback for very short windows. */
      height: 36rem;
      width: 30rem;
      max-height: 100%;
      overflow-y: auto;
      overflow-wrap: break-word;
      border-radius: 1.6rem;
      color: #000000;
      font-family:
        system-ui,
        -apple-system,
        sans-serif;
      font-size: 0.875rem;
      line-height: 1.35;
      padding: 1.25rem;
      flex-direction: column;
    }

    h1 {
      margin-top: 0px;
      font-size: 1.25rem;
    }

    h2 {
      margin-top: 0px;
      margin-bottom: 0px;
      font-size: 1rem;
    }

    ul {
      margin-top: 0.2rem;
      margin-bottom: 0px;
      padding-left: 1.25rem;
    }

    .image-div {
      margin-top: 0.4rem;
      margin-bottom: 0.4rem;
    }

    .description-div {
      flex-grow: 1;
    }

    .close-button {
      position: absolute;
      right: 1.3rem;
      top: 1.3rem;
    }

    button {
      font-family: inherit;
      align-self: flex-end;
      width: min-content;
      height: min-content;
      font-size: 0.75rem;
      background: rgb(48, 40, 34);
      color: white;
      border-radius: 1rem;
      padding: 0.5rem 0.7rem;
      border: none;
    }

    video {
      display: block;
      /* Fixed demo-video size shared by every instruction card. */
      width: 20.25rem;
      height: auto;
      margin: 0 auto;
      max-width: 100%;
      aspect-ratio: 16/9;
    }

    p {
      margin-top: 0px;
      margin-bottom: 0px;
    }
  `;
	}
	continueButtonClicked() {
		this.dispatchEvent(new SimulatorInstructionsNextEvent());
	}
	closeButtonClicked() {
		this.dispatchEvent(new SimulatorInstructionsCloseEvent());
	}
	getHeaderContents() {
		return b` <h1>Welcome to XR Blocks!</h1> `;
	}
	getImageContents() {
		return b``;
	}
	getDescriptionContents() {
		return b``;
	}
	render() {
		return b`
      <button class="close-button" @click=${this.closeButtonClicked}>X</button>
      <div class="header-div">${this.getHeaderContents()}</div>
      <div class="image-div">${this.getImageContents()}</div>
      <div class="description-div">${this.getDescriptionContents()}</div>
      <button type="button" @click=${this.continueButtonClicked}>
        ${this.continueButtonText}
      </button>
    `;
	}
};
__decorate([n$3({ type: String })], SimulatorInstructionsCard.prototype, "continueButtonText", void 0);
SimulatorInstructionsCard = __decorate([t$2("xrblocks-simulator-instructions-card")], SimulatorInstructionsCard);
var CustomInstruction = class CustomInstruction extends SimulatorInstructionsCard {
	getHeaderContents() {
		return b`<h1>${this.customInstruction.header}</h1>`;
	}
	getImageContents() {
		return this.customInstruction.videoSrc ? b`
          <video playsinline autoplay muted loop>
            <source src=${this.customInstruction.videoSrc} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        ` : b``;
	}
	getDescriptionContents() {
		return b`<p>${this.customInstruction.description}</p>`;
	}
	render() {
		return super.render();
	}
};
__decorate([n$3()], CustomInstruction.prototype, "customInstruction", void 0);
CustomInstruction = __decorate([t$2("xrblocks-simulator-custom-instruction")], CustomInstruction);
var SIMULATOR_HANDS_VIDEO_PATH = XR_BLOCKS_ASSETS_PATH + "simulator/instructions/xr_blocks_simulator_hands.webm";
var HandsInstructions = class HandsInstructions extends SimulatorInstructionsCard {
	getImageContents() {
		return b`
      <video playsinline autoplay muted loop>
        <source src="${SIMULATOR_HANDS_VIDEO_PATH}" type="video/webm" />
        Your browser does not support the video tag.
      </video>
    `;
	}
	getDescriptionContents() {
		return b`
      <h2>Hands Mode</h2>
      <p>
        Hands Mode allows for precise manipulation of virtual hands while
        navigating the environment.
      </p>
      <ul>
        <li>
          <strong>Move Around:</strong> Hold Left Shift and use the W, A, S, D
          keys to navigate.
        </li>
        <li><strong>Look Around:</strong> Right-click and drag the mouse.</li>
        <li><strong>Rotate Hand:</strong> Left-click and drag the mouse.</li>
        <li><strong>Move Hand:</strong> Use the W, A, S, D keys.</li>
        <li>
          <strong>Elevate Hand:</strong> Use the Q (up) and E (down) keys.
        </li>
        <li>
          <strong>Switch Active Hand:</strong> Press the T key to toggle between
          hands.
        </li>
        <li><strong>Simulate Pinch:</strong> Press the Spacebar.</li>
      </ul>
    `;
	}
};
HandsInstructions = __decorate([t$2("xrblocks-simulator-hands-instructions")], HandsInstructions);
var SIMULATOR_NAVIGATION_VIDEO_PATH = XR_BLOCKS_ASSETS_PATH + "simulator/instructions/xr_blocks_simulator_navigation.webm";
var NavigationInstructions = class NavigationInstructions extends SimulatorInstructionsCard {
	getImageContents() {
		return b`
      <video playsinline autoplay muted loop>
        <source src=${SIMULATOR_NAVIGATION_VIDEO_PATH} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    `;
	}
	getDescriptionContents() {
		return b`
      <h2>Navigation Mode</h2>
      <p>
        Press <strong>Left Shift</strong> to toggle Navigation Mode. In this
        mode, virtual hands appear and the mouse controls the camera view.
      </p>
      <ul>
        <li>
          <strong>Move Forward/Backward/Sideways:</strong> Use the W, A, S, D
          keys.
        </li>
        <li><strong>Move Up/Down:</strong> Use the Q and E keys.</li>
        <li><strong>Rotate Camera:</strong> Click and drag the mouse.</li>
      </ul>
    `;
	}
};
NavigationInstructions = __decorate([t$2("xrblocks-simulator-navigation-instructions")], NavigationInstructions);
var SIMULATOR_USER_VIDEO_PATH = XR_BLOCKS_ASSETS_PATH + "simulator/instructions/xr_blocks_simulator_user.webm";
var UserInstructions = class UserInstructions extends SimulatorInstructionsCard {
	getImageContents() {
		return b`
      <video playsinline autoplay muted loop>
        <source src=${SIMULATOR_USER_VIDEO_PATH} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    `;
	}
	getDescriptionContents() {
		return b`
      <h2>User Mode</h2>
      <p>
        The simulator starts in <strong>User Mode</strong> by default. This mode
        is for moving the camera and interacting directly with scene objects.
      </p>
      <ul>
        <li>
          <strong>Move Forward/Backward/Sideways:</strong> Use the W, A, S, D
          keys.
        </li>
        <li><strong>Move Up/Down:</strong> Use the Q and E keys.</li>
        <li>
          <strong>Rotate Camera:</strong> Hold the right mouse button and drag.
        </li>
        <li>
          <strong>Scale a ModelViewer:</strong> Point at it and use the mouse
          wheel.
        </li>
        <li><strong>Select Object:</strong> Left-click the mouse.</li>
      </ul>
    `;
	}
};
UserInstructions = __decorate([t$2("xrblocks-simulator-user-instructions")], UserInstructions);
var SimulatorInstructions = class SimulatorInstructions extends i$2 {
	static {
		this.styles = i$5`
    :host {
      background: #000000aa;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      height: 100%;
      width: 100%;
      justify-content: center;
      align-items: center;
    }
  `;
	}
	getSteps() {
		const buttonText = this.customInstructions.length === 0 ? "Close" : "Continue";
		if (this.simulatorMode) switch (this.simulatorMode) {
			case "User":
			case "Editor":
			case "PointerLock": return [b`<xrblocks-simulator-user-instructions
              .continueButtonText=${buttonText}
            />`];
			case "Navigation": return [b`<xrblocks-simulator-navigation-instructions
              .continueButtonText=${buttonText}
            />`];
			case "Hands": return [b`<xrblocks-simulator-hands-instructions
              .continueButtonText=${buttonText}
            />`];
		}
		return [
			b`<xrblocks-simulator-user-instructions />`,
			b`<xrblocks-simulator-navigation-instructions />`,
			b`<xrblocks-simulator-hands-instructions
        .continueButtonText=${buttonText}
      />`
		];
	}
	constructor() {
		super();
		this.customInstructions = [];
		this.step = 0;
		this.addEventListener(SimulatorInstructionsNextEvent.type, this.continueButtonClicked.bind(this));
		this.addEventListener(SimulatorInstructionsCloseEvent.type, this.closeInstructions.bind(this));
	}
	closeInstructions() {
		this.remove();
	}
	continueButtonClicked() {
		const steps = this.getSteps();
		if (this.step + 1 >= steps.length + this.customInstructions.length) {
			this.closeInstructions();
			return;
		}
		this.step++;
	}
	render() {
		const steps = this.getSteps();
		return this.step < steps.length ? steps[this.step] : b`<xrblocks-simulator-custom-instruction
          .customInstruction=${this.customInstructions[this.step - steps.length]}
        />`;
	}
};
__decorate([n$3()], SimulatorInstructions.prototype, "simulatorMode", void 0);
__decorate([n$3()], SimulatorInstructions.prototype, "customInstructions", void 0);
__decorate([n$3()], SimulatorInstructions.prototype, "step", void 0);
SimulatorInstructions = __decorate([t$2("xrblocks-simulator-instructions")], SimulatorInstructions);
function getOverlayInstructionsForMode(mode) {
	switch (mode) {
		case "Navigation": return [[{
			keys: [
				"W",
				"A",
				"S",
				"D"
			],
			label: "Move"
		}], [{
			keys: ["Mouse"],
			label: "Click and drag to look around"
		}]];
		case "PointerLock": return [[{
			keys: [
				"W",
				"A",
				"S",
				"D"
			],
			label: "Move"
		}], [{
			keys: ["Mouse"],
			label: "Click the screen, then move the mouse to look around"
		}]];
		case "Hands": return [
			[{
				keys: [
					"W",
					"A",
					"S",
					"D"
				],
				label: "Move hand"
			}, {
				keys: [
					"Shift",
					"W",
					"A",
					"S",
					"D"
				],
				label: "Move"
			}],
			[{
				keys: ["Right Click"],
				label: "Look"
			}, {
				keys: ["Left Click"],
				label: "Rotate hand"
			}],
			[{
				keys: ["Space"],
				label: "Pinch"
			}, {
				keys: ["T"],
				label: "Switch hand"
			}]
		];
		default: return [[{
			keys: [
				"W",
				"A",
				"S",
				"D"
			],
			label: "Move"
		}], [{
			keys: ["Right Click"],
			label: "Drag to look around"
		}, {
			keys: ["Left Click"],
			label: "Select"
		}]];
	}
}
var SimulatorOverlayInstructions = class SimulatorOverlayInstructions extends i$2 {
	constructor(..._args) {
		super(..._args);
		this.simulatorMode = "User";
		this.visible = false;
	}
	static {
		this.styles = i$5`
    :host {
      position: fixed;
      bottom: 4.75rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      pointer-events: none;
      user-select: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.65rem;
      font-family:
        system-ui,
        -apple-system,
        sans-serif;
      opacity: 0;
      transition: opacity 0.5s ease;
    }

    :host([visible]) {
      opacity: 1;
    }

    .row {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1.25rem;
    }

    .group {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .keys {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .key {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      min-width: 2rem;
      height: 2rem;
      padding: 0 0.55rem;
      border-radius: 0.45rem;
      border: 1.5px solid rgba(255, 255, 255, 0.85);
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(4px);
      color: #fff;
      font-size: 0.85rem;
      font-weight: 600;
      line-height: 1;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    }

    .label {
      color: #fff;
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.01em;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.85);
      white-space: nowrap;
    }
  `;
	}
	renderGroup(item) {
		return b`
      <div class="group">
        <div class="keys">
          ${item.keys.map((key) => b`<kbd class="key">${key}</kbd>`)}
        </div>
        <span class="label">${item.label}</span>
      </div>
    `;
	}
	render() {
		return b`
      ${getOverlayInstructionsForMode(this.simulatorMode).map((row) => b`<div class="row">
            ${row.map((item) => this.renderGroup(item))}
          </div>`)}
    `;
	}
};
__decorate([n$3({ type: String })], SimulatorOverlayInstructions.prototype, "simulatorMode", void 0);
__decorate([n$3({
	type: Boolean,
	reflect: true
})], SimulatorOverlayInstructions.prototype, "visible", void 0);
SimulatorOverlayInstructions = __decorate([t$2("xrblocks-simulator-overlay-instructions")], SimulatorOverlayInstructions);
var BUTTON_NAMES = {
	0: "A",
	1: "B",
	2: "X",
	3: "Y",
	4: "LB",
	5: "RB",
	6: "LT",
	7: "RT",
	8: "Back",
	9: "Start",
	10: "L3",
	11: "R3",
	12: "D-Up",
	13: "D-Down",
	14: "D-Left",
	15: "D-Right"
};
function buttonName(index) {
	return BUTTON_NAMES[index] ?? `Btn ${index}`;
}
var GamepadToast = class GamepadToast extends i$2 {
	constructor(..._args) {
		super(..._args);
		this.visible = false;
		this._timer = null;
		this.controls = {};
		this._flashMessage = "";
	}
	static {
		this.styles = i$5`
    :host {
      position: fixed;
      top: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10000;
      pointer-events: none;
    }

    .toast {
      background: rgba(0, 0, 0, 0.85);
      color: #fff;
      border-radius: 1rem;
      padding: 1rem 1.5rem;
      font-family: system-ui, sans-serif;
      font-size: 0.9rem;
      backdrop-filter: blur(8px);
      opacity: 1;
      transition: opacity 0.4s ease-out;
      pointer-events: auto;
      cursor: pointer;
      max-width: 28rem;
    }

    .toast.hidden {
      opacity: 0;
    }

    h3 {
      margin: 0 0 0.5rem;
      font-size: 1rem;
      font-weight: 600;
    }

    .controls {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.2rem 0.8rem;
    }

    .key {
      font-weight: 600;
      color: #8cf;
      text-align: right;
    }

    .action {
      color: #ccc;
    }
  `;
	}
	show(controls, duration = 5e3) {
		this.controls = controls;
		this._flashMessage = "";
		this.visible = true;
		if (this._timer) clearTimeout(this._timer);
		this._timer = setTimeout(() => this.dismiss(), duration);
	}
	/** Show a brief single-line message (e.g. "Active Hand: Right"). */
	flash(message, duration = 1500) {
		this._flashMessage = message;
		this.controls = {};
		this.visible = true;
		if (this._timer) clearTimeout(this._timer);
		this._timer = setTimeout(() => this.dismiss(), duration);
	}
	dismiss() {
		this.visible = false;
		if (this._timer) {
			clearTimeout(this._timer);
			this._timer = null;
		}
	}
	render() {
		if (this._flashMessage) return b`
        <div
          class="toast ${this.visible ? "" : "hidden"}"
          @click=${this.dismiss}
        >
          <span class="action">${this._flashMessage}</span>
        </div>
      `;
		return b`
      <div class="toast ${this.visible ? "" : "hidden"}" @click=${this.dismiss}>
        <h3>🎮 Gamepad Connected</h3>
        <div class="controls">
          ${Object.entries(this.controls).map(([key, action]) => b`
              <span class="key">${key}</span>
              <span class="action">${action}</span>
            `)}
        </div>
      </div>
    `;
	}
};
__decorate([n$3({ type: Boolean })], GamepadToast.prototype, "visible", void 0);
__decorate([n$3({ type: Object })], GamepadToast.prototype, "controls", void 0);
__decorate([n$3({ type: String })], GamepadToast.prototype, "_flashMessage", void 0);
GamepadToast = __decorate([t$2("xrblocks-gamepad-toast")], GamepadToast);
var ACTION_LABELS = {
	select: "Select / Interact",
	cycleHandPoseLeft: "Previous Hand Pose",
	cycleHandPoseRight: "Next Hand Pose",
	cycleSimulatorMode: "Cycle Simulator Mode",
	toggleUI: "Toggle UI",
	toggleHand: "Swap Active Hand",
	moveUp: "Move Up",
	moveDown: "Move Down",
	openSettings: "Open Settings"
};
var REBINDABLE_ACTIONS = Object.keys(ACTION_LABELS).filter((a) => a !== "openSettings");
var GamepadSettingsPanel = class GamepadSettingsPanel extends i$2 {
	constructor(..._args) {
		super(..._args);
		this._listeningAction = null;
		this._bindingSnapshot = {};
		this._focusedIndex = 0;
		this._rafId = null;
		this._prevStickY = 0;
		this._navPrevButtons = [];
	}
	static {
		this.styles = i$5`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10001;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    :host([hidden]) {
      display: none;
    }

    .backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      pointer-events: auto;
    }

    .panel {
      position: relative;
      background: rgba(20, 20, 30, 0.95);
      color: #fff;
      border-radius: 1rem;
      padding: 1.5rem;
      font-family: system-ui, sans-serif;
      min-width: 20rem;
      max-width: 28rem;
      backdrop-filter: blur(12px);
      pointer-events: auto;
      z-index: 1;
    }

    h2 {
      margin: 0 0 1rem;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .binding-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .binding-row:last-of-type {
      border-bottom: none;
    }

    .action-label {
      color: #ccc;
      font-size: 0.9rem;
    }

    .bind-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #8cf;
      border-radius: 0.5rem;
      padding: 0.3rem 0.8rem;
      font-size: 0.85rem;
      cursor: pointer;
      min-width: 4rem;
      text-align: center;
      font-family: inherit;
    }

    .bind-btn:hover,
    .bind-btn.focused {
      background: rgba(255, 255, 255, 0.2);
      outline: 2px solid #8cf;
      outline-offset: 2px;
    }

    .bind-btn.listening {
      color: #fc4;
      border-color: #fc4;
      animation: pulse 1s infinite alternate;
    }

    @keyframes pulse {
      from {
        opacity: 0.6;
      }
      to {
        opacity: 1;
      }
    }

    .footer {
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
      gap: 0.5rem;
    }

    .footer button {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      border-radius: 0.5rem;
      padding: 0.4rem 1rem;
      cursor: pointer;
      font-size: 0.85rem;
      font-family: inherit;
    }

    .footer button:hover,
    .footer button.focused {
      background: rgba(255, 255, 255, 0.2);
      outline: 2px solid #8cf;
      outline-offset: 2px;
    }

    .hint {
      margin-top: 0.75rem;
      font-size: 0.75rem;
      color: #888;
      text-align: center;
    }
  `;
	}
	_navJustPressed(gp, index) {
		const down = gp.activeGamepad?.buttons[index]?.pressed ?? false;
		const wasDown = this._navPrevButtons[index] ?? false;
		return down && !wasDown;
	}
	_navUpdatePrev(gp) {
		const buttons = gp.activeGamepad?.buttons;
		if (!buttons) return;
		for (let i = 0; i < buttons.length; i++) this._navPrevButtons[i] = buttons[i]?.pressed ?? false;
	}
	get _totalItems() {
		return REBINDABLE_ACTIONS.length + 2;
	}
	show() {
		this.hidden = false;
		this._refreshSnapshot();
		this._focusedIndex = 0;
		this._prevStickY = 0;
		this._navPrevButtons = [];
		if (this.gamepadController) {
			this.gamepadController.menuActive = true;
			this._navUpdatePrev(this.gamepadController);
		}
		this._startNavLoop();
	}
	hide() {
		this.hidden = true;
		if (this._listeningAction) {
			this.gamepadController?.cancelCapture();
			this._listeningAction = null;
		}
		if (this.gamepadController) this.gamepadController.menuActive = false;
		this._stopNavLoop();
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		this._stopNavLoop();
		if (this.gamepadController) this.gamepadController.menuActive = false;
	}
	_startNavLoop() {
		if (this._rafId !== null) return;
		const loop = () => {
			this._rafId = requestAnimationFrame(loop);
			this._pollNavigation();
		};
		this._rafId = requestAnimationFrame(loop);
	}
	_stopNavLoop() {
		if (this._rafId !== null) {
			cancelAnimationFrame(this._rafId);
			this._rafId = null;
		}
	}
	_pollNavigation() {
		const gp = this.gamepadController;
		if (!gp || !gp.userData.connected) return;
		if (this._listeningAction !== null) {
			this._navUpdatePrev(gp);
			return;
		}
		const [, ly] = gp.getAxes();
		const THRESH = .5;
		if (ly < -.5 && this._prevStickY >= -.5) this._moveFocus(-1);
		else if (ly > THRESH && this._prevStickY <= THRESH) this._moveFocus(1);
		this._prevStickY = ly;
		if (this._navJustPressed(gp, 12)) this._moveFocus(-1);
		if (this._navJustPressed(gp, 13)) this._moveFocus(1);
		if (this._navJustPressed(gp, 6)) this._moveFocus(-1);
		if (this._navJustPressed(gp, 7)) this._moveFocus(1);
		if (this._navJustPressed(gp, 0)) this._activateFocused();
		if (this._navJustPressed(gp, 1)) this.hide();
		const settingsBtn = this.bindings?.getBinding("openSettings") ?? -1;
		if (settingsBtn >= 0 && settingsBtn !== 0 && settingsBtn !== 1 && this._navJustPressed(gp, settingsBtn)) this.hide();
		this._navUpdatePrev(gp);
	}
	_moveFocus(delta) {
		const max = this._totalItems - 1;
		this._focusedIndex = Math.max(0, Math.min(max, this._focusedIndex + delta));
	}
	_activateFocused() {
		const actions = REBINDABLE_ACTIONS;
		if (this._focusedIndex < actions.length) this._startListening(actions[this._focusedIndex]);
		else if (this._focusedIndex === actions.length) this._resetDefaults();
		else this.hide();
	}
	_refreshSnapshot() {
		if (this.bindings) this._bindingSnapshot = { ...this.bindings.getAllBindings() };
	}
	_startListening(action) {
		this._listeningAction = action;
		this.gamepadController?.captureNextButtonPress((buttonIndex) => {
			this.bindings?.setBinding(action, buttonIndex);
			this._listeningAction = null;
			this._refreshSnapshot();
			if (this.gamepadController) this._navUpdatePrev(this.gamepadController);
		});
	}
	_resetDefaults() {
		this.bindings?.resetDefaults();
		this._refreshSnapshot();
	}
	render() {
		const actions = REBINDABLE_ACTIONS;
		const resetIdx = actions.length;
		const closeIdx = actions.length + 1;
		return b`
      <div class="backdrop" @click=${this.hide}></div>
      <div class="panel">
        <h2>🎮 Gamepad Settings</h2>
        ${actions.map((action, i) => {
			const btnIdx = this._bindingSnapshot[action] ?? -1;
			const isListening = this._listeningAction === action;
			const isFocused = this._focusedIndex === i;
			return b`
            <div class="binding-row">
              <span class="action-label">${ACTION_LABELS[action]}</span>
              <button
                class="bind-btn ${isListening ? "listening" : ""} ${isFocused ? "focused" : ""}"
                @click=${() => isListening ? null : this._startListening(action)}
              >
                ${isListening ? "Press button..." : btnIdx >= 0 ? buttonName(btnIdx) : "Unbound"}
              </button>
            </div>
          `;
		})}
        <div class="footer">
          <button
            class=${this._focusedIndex === resetIdx ? "focused" : ""}
            @click=${this._resetDefaults}
          >
            Reset Defaults
          </button>
          <button
            class=${this._focusedIndex === closeIdx ? "focused" : ""}
            @click=${this.hide}
          >
            Close
          </button>
        </div>
        <div class="hint">
          Stick / D-pad / LT-RT: Navigate · A: Select · B: Close
        </div>
      </div>
    `;
	}
};
__decorate([n$3({ type: Object })], GamepadSettingsPanel.prototype, "bindings", void 0);
__decorate([n$3({ type: Object })], GamepadSettingsPanel.prototype, "gamepadController", void 0);
__decorate([r$2()], GamepadSettingsPanel.prototype, "_listeningAction", void 0);
__decorate([r$2()], GamepadSettingsPanel.prototype, "_bindingSnapshot", void 0);
__decorate([r$2()], GamepadSettingsPanel.prototype, "_focusedIndex", void 0);
GamepadSettingsPanel = __decorate([t$2("xrblocks-gamepad-settings")], GamepadSettingsPanel);
var HandPosePanel = class HandPosePanel extends i$2 {
	constructor(..._args) {
		super(..._args);
		this.posePanelRef = e();
		this.handPose = Object.values(SimulatorHandPose)[0];
		this.visible = false;
	}
	static {
		this.styles = i$5`
    :host {
      position: absolute;
      bottom: 0;
      left: 50%;
      font-family:
        system-ui,
        -apple-system,
        sans-serif;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      max-width: calc(100% - 24rem);
      width: fit-content;
    }

    .hand-pose-panel {
      box-sizing: border-box;
      border: none;
      margin: 1rem 0px;
      border-radius: 5rem;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      max-width: 100%;
      width: fit-content;
      height: 3rem;
      text-align: center;
      vertical-align: middle;
      padding-left: 1rem;
      padding-right: 1rem;
      white-space: nowrap;
      overflow-y: hidden;
      overflow-x: scroll;
    }

    .hand-pose-panel::-webkit-scrollbar {
      display: none;
    }

    .hand-pose-button {
      font-family: inherit;
      color: #ffffff44;
      font-size: 1.2em;
      line-height: 3rem;
      background: transparent;
      text-align: center;
      vertical-align: middle;
      border: none;
    }

    .hand-pose-button.selected {
      color: #ffffffff;
    }
  `;
	}
	update(changedProperties) {
		if (changedProperties.has("handPose")) this.onHandPoseChanged();
		super.update(changedProperties);
	}
	sendHandPoseRequest(pose) {
		this.dispatchEvent(new SimulatorHandPoseChangeRequestEvent(pose));
	}
	/**
	* @returns An array of `TemplateResult` objects, one for each hand pose.
	*/
	getHandPoseButtons() {
		const buttons = [];
		for (const pose of Object.values(SimulatorHandPose)) {
			const poseName = SIMULATOR_HAND_POSE_NAMES[pose];
			const classes = {
				"hand-pose-button": true,
				selected: this.handPose === pose
			};
			const clickCall = () => this.sendHandPoseRequest(pose);
			buttons.push(b`
        <button
          class=${e$2(classes)}
          @click=${clickCall}
          data-pose=${pose}
        >
          ${poseName}
        </button>
      `);
		}
		return buttons;
	}
	onHandPoseChanged() {
		this.scrollToCurrentHandPose();
	}
	scrollToCurrentHandPose() {
		const handPosePanel = this.posePanelRef.value;
		if (!handPosePanel) return;
		const selectedButton = handPosePanel.querySelector(`.hand-pose-button[data-pose=${this.handPose}]`);
		if (selectedButton) selectedButton.scrollIntoView({
			behavior: "smooth",
			inline: "center",
			block: "nearest"
		});
	}
	render() {
		if (!this.visible) return b``;
		const handPoseButtons = this.getHandPoseButtons();
		return b`
      <div class="hand-pose-panel" ${n(this.posePanelRef)}>
        ${handPoseButtons}
      </div>
    `;
	}
};
__decorate([n$3({ type: String })], HandPosePanel.prototype, "handPose", void 0);
__decorate([n$3({ type: Boolean })], HandPosePanel.prototype, "visible", void 0);
HandPosePanel = __decorate([t$2("xrblocks-simulator-hand-pose-panel")], HandPosePanel);
var SimulatorSettingsPanel = class SimulatorSettingsPanel extends i$2 {
	constructor(..._args) {
		super(..._args);
		this.environments = [];
		this.activeEnvironmentIndex = 0;
		this.simulatorMode = "User";
		this.instructionsEnabled = false;
		this.handPhysicsAvailable = false;
		this.handPhysicsEnabled = false;
		this.dayNightAvailable = false;
		this.dayNightEnabled = false;
		this.timeOfDay = 0;
		this._isOpen = false;
	}
	static {
		this.styles = i$5`
    :host {
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 10000;
      font-family:
        system-ui,
        -apple-system,
        sans-serif;
    }

    button,
    select {
      font-family: inherit;
    }

    .settings-btn {
      border: none;
      margin: 1rem;
      width: 3rem;
      height: 3rem;
      border-radius: 5rem;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .settings-btn:hover {
      background: rgba(0, 0, 0, 0.7);
    }

    .settings-btn svg {
      width: 1.5rem;
      height: 1.5rem;
      fill: currentColor;
      transition: transform 0.3s ease;
    }

    .settings-btn.open svg {
      transform: rotate(45deg);
    }

    .panel {
      position: absolute;
      bottom: 4.5rem;
      left: 1rem;
      background: rgba(0, 0, 0, 0.7);
      border: none;
      border-radius: 1.5rem;
      padding: 1.5rem;
      min-width: 16rem;
      color: #fff;
      opacity: 0;
      pointer-events: none;
      transform: translateY(10px);
      transition: all 0.3s ease;
      backdrop-filter: blur(8px);
    }

    .panel.open {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }

    h3 {
      margin: 0 0 1rem;
      font-size: 1.1rem;
      font-weight: 500;
      color: #fff;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 0.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .form-group:last-of-type {
      margin-bottom: 0;
    }

    label {
      font-size: 0.85rem;
      color: #ccc;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      cursor: pointer;
    }

    .checkbox-label:has(input:disabled) {
      cursor: not-allowed;
      opacity: 0.5;
    }

    input[type='checkbox'] {
      width: 1rem;
      height: 1rem;
      margin: 0;
      accent-color: #8ab4f8;
      cursor: inherit;
    }

    input[type='range'] {
      width: 100%;
      margin: 0;
      accent-color: #8ab4f8;
      cursor: pointer;
    }

    .time-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #999;
    }

    select {
      appearance: none;
      -webkit-appearance: none;
      background: rgba(0, 0, 0, 0.5)
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")
        no-repeat right 0.5rem center;
      background-size: 1rem;
      border: none;
      color: #fff;
      padding: 0.5rem 2.2rem 0.5rem 1.2rem;
      border-radius: 5rem;
      font-size: 0.9rem;
      outline: none;
      cursor: pointer;
    }

    select:hover,
    select:focus {
      background-color: rgba(0, 0, 0, 0.8);
    }

    option {
      background: #222;
      color: #fff;
    }

    .instructions-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      padding: 0.6rem 1.2rem;
      border-radius: 5rem;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition:
        background-color 0.2s ease,
        border-color 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .instructions-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.4);
    }

    .instructions-btn:active {
      background: rgba(255, 255, 255, 0.15);
    }
  `;
	}
	_togglePanel() {
		this._isOpen = !this._isOpen;
	}
	_onEnvironmentChange(e) {
		const select = e.target;
		const idx = parseInt(select.value, 10);
		this.activeEnvironmentIndex = idx;
		this.dispatchEvent(new SetSimulatorEnvironmentEvent(idx));
	}
	_onModeChange(e) {
		const newMode = e.target.value;
		this.simulatorMode = newMode;
		this.dispatchEvent(new SetSimulatorModeEvent(newMode));
	}
	_onHandPhysicsChange(e) {
		const input = e.target;
		this.handPhysicsEnabled = input.checked;
		this.dispatchEvent(new SetSimulatorHandPhysicsEvent(this.handPhysicsEnabled));
	}
	_onDayNightChange(e) {
		const input = e.target;
		this.dayNightEnabled = input.checked;
		if (!input.checked) this.timeOfDay = 0;
		this.dispatchEvent(new SetSimulatorDayNightEvent(this.dayNightEnabled));
	}
	_onTimeOfDayChange(e) {
		const input = e.target;
		this.timeOfDay = parseFloat(input.value);
		this.dispatchEvent(new SetSimulatorTimeOfDayEvent(this.timeOfDay));
	}
	_onShowInstructions() {
		this._isOpen = false;
		this.dispatchEvent(new ShowSimulatorInstructionsEvent(this.simulatorMode));
	}
	render() {
		return b`
      <button
        class="settings-btn ${this._isOpen ? "open" : ""}"
        @click=${this._togglePanel}
        title="Simulator Settings"
      >
        <svg viewBox="0 0 24 24">
          <path
            d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
          />
        </svg>
      </button>

      <div class="panel ${this._isOpen ? "open" : ""}">
        <h3>Simulator Settings</h3>

        <div class="form-group">
          <label>AR Simulation Environment</label>
          <select @change=${this._onEnvironmentChange}>
            ${this.environments.map((env, idx) => b`
                <option
                  value=${idx}
                  ?selected=${idx === this.activeEnvironmentIndex}
                >
                  ${env.name ?? env.manifestPath.split("/").pop()}
                </option>
              `)}
          </select>
        </div>

        <div class="form-group">
          <label>Interaction Mode</label>
          <select @change=${this._onModeChange}>
            ${[
			{
				label: "User",
				value: "User"
			},
			{
				label: "Navigation",
				value: "Navigation"
			},
			{
				label: "Hands",
				value: "Hands"
			},
			{
				label: "Pointer Lock",
				value: "PointerLock"
			},
			{
				label: "Editor",
				value: "Editor"
			}
		].map((mode) => b`
                <option
                  value=${mode.value}
                  ?selected=${mode.value === this.simulatorMode}
                >
                  ${mode.label}
                </option>
              `)}
          </select>
        </div>

        ${this.dayNightAvailable ? b`
              <div class="form-group">
                <label class="checkbox-label">
                  <span>Day / Night Lighting</span>
                  <input
                    type="checkbox"
                    .checked=${this.dayNightEnabled}
                    @change=${this._onDayNightChange}
                  />
                </label>
              </div>
              <div class="form-group">
                <label>Time of Day</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  .value=${String(this.timeOfDay)}
                  ?disabled=${!this.dayNightEnabled}
                  @input=${this._onTimeOfDayChange}
                />
                <div class="time-labels">
                  <span>Day</span>
                  <span>Night</span>
                </div>
              </div>
            ` : ""}

        <div class="form-group">
          <label class="checkbox-label">
            <span>Hand Physics</span>
            <input
              type="checkbox"
              .checked=${this.handPhysicsEnabled}
              ?disabled=${!this.handPhysicsAvailable}
              @change=${this._onHandPhysicsChange}
            />
          </label>
        </div>

        ${this.instructionsEnabled ? b`
              <div class="form-group">
                <button
                  class="instructions-btn"
                  @click=${this._onShowInstructions}
                >
                  View Simulator Instructions
                </button>
              </div>
            ` : ""}
      </div>
    `;
	}
};
__decorate([n$3({ type: Array })], SimulatorSettingsPanel.prototype, "environments", void 0);
__decorate([n$3({ type: Number })], SimulatorSettingsPanel.prototype, "activeEnvironmentIndex", void 0);
__decorate([n$3({ type: String })], SimulatorSettingsPanel.prototype, "simulatorMode", void 0);
__decorate([n$3({ type: Boolean })], SimulatorSettingsPanel.prototype, "instructionsEnabled", void 0);
__decorate([n$3({ type: Boolean })], SimulatorSettingsPanel.prototype, "handPhysicsAvailable", void 0);
__decorate([n$3({ type: Boolean })], SimulatorSettingsPanel.prototype, "handPhysicsEnabled", void 0);
__decorate([n$3({ type: Boolean })], SimulatorSettingsPanel.prototype, "dayNightAvailable", void 0);
__decorate([n$3({ type: Boolean })], SimulatorSettingsPanel.prototype, "dayNightEnabled", void 0);
__decorate([n$3({ type: Number })], SimulatorSettingsPanel.prototype, "timeOfDay", void 0);
__decorate([r$2()], SimulatorSettingsPanel.prototype, "_isOpen", void 0);
SimulatorSettingsPanel = __decorate([t$2("xrblocks-simulator-settings")], SimulatorSettingsPanel);
