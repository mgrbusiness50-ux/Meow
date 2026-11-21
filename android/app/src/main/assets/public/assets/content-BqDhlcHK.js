import { $n as Quaternion, At as InstancedBufferAttribute, Cn as MeshDepthMaterial, Hi as Vector2, Hn as Plane, On as MeshPhongMaterial, Rn as Object3D, S as BufferAttribute, Sn as MeshBasicMaterial, Ui as Vector3, Un as PlaneGeometry, _n as MathUtils, b as Box3, bn as Matrix4, gi as Sphere, j as Color, kn as MeshPhysicalMaterial, lt as Euler, ot as DynamicDrawUsage, sr as RGBADepthPacking, wn as MeshDistanceMaterial, xn as Mesh } from "./three.core-DsEAPerk.js";
// node_modules/xrblocks/build/internal/CanvasTextStyle.js
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
/** Line-height fallback as a multiple of the current font size. */
var DEFAULT_TEXT_LINE_HEIGHT = 1.2;
/**
* Font stack shared by every canvas-rendered UI text.
*
* It resolves to the host operating system's UI face, so the platform's own
* fallback chain covers every script the device can display instead of a single
* bundled typeface that would draw missing-glyph boxes.
*/
var SYSTEM_FONT_STACK = "system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif";
var NORMAL_FONT_WEIGHT = 400;
var MEDIUM_FONT_WEIGHT = 500;
var BOLD_FONT_WEIGHT = 700;
/** Largest canvas edge we allocate, which every WebGL 2 device supports. */
var MAX_CANVAS_DIMENSION = 4096;
/**
* Samples per device pixel. Text is magnified by the headset optics, so one
* device pixel per layout pixel leaves visible stair-stepping on glyph edges.
*/
var CANVAS_SUPERSAMPLING = 2;
var graphemeSegmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
/** Maps the CSS-like weight keywords onto numeric CSS font weights. */
function resolveFontWeight(value) {
	if (typeof value === "number") return value;
	if (value === "bold") return BOLD_FONT_WEIGHT;
	if (value === "medium") return MEDIUM_FONT_WEIGHT;
	return NORMAL_FONT_WEIGHT;
}
/** Builds a CSS `font` shorthand for a canvas context or a DOM mirror. */
function fontShorthand(fontSize, weight) {
	return `${resolveFontWeight(weight)} ${fontSize}px ${SYSTEM_FONT_STACK}`;
}
/** Converts a Three.js color representation into a CSS color string. */
function cssColor(color) {
	if (typeof color === "string") return color;
	return `#${new Color(color).getHexString()}`;
}
/**
* Resolves a CSS-like line height into layout units. Bare numbers are a
* multiple of the font size, matching CSS.
*/
function resolveLineHeight(value, fontSize) {
	if (typeof value === "number") return value * fontSize;
	if (typeof value === "string" && value.endsWith("px")) return Number.parseFloat(value);
	if (typeof value === "string" && value.endsWith("%")) return Number.parseFloat(value) / 100 * fontSize;
	return fontSize * DEFAULT_TEXT_LINE_HEIGHT;
}
/** Splits text into user-perceived characters, never inside a grapheme. */
function graphemes(text) {
	return Array.from(graphemeSegmenter.segment(text), ({ segment }) => segment);
}
/** Splits text into graphemes carrying their UTF-16 start index. */
function graphemeSegments(text) {
	return Array.from(graphemeSegmenter.segment(text), ({ segment, index }) => ({
		segment,
		index
	}));
}
/**
* Supersampling factor for a canvas covering `width` by `height` layout units,
* capped so the backing texture stays within {@link MAX_CANVAS_DIMENSION}.
*/
function resolveRasterScale(width, height) {
	return Math.max(Number.EPSILON, Math.min((globalThis.devicePixelRatio || 1) * CANVAS_SUPERSAMPLING, MAX_CANVAS_DIMENSION / width, MAX_CANVAS_DIMENSION / height));
}
// node_modules/@preact/signals-core/dist/signals-core.module.js
var i = Symbol.for("preact-signals");
function t() {
	if (!(v > 1)) {
		var i, t = !1;
		(function() {
			var i = c;
			c = void 0;
			while (void 0 !== i) {
				var t = i.S;
				if (t.v === i.v) {
					for (var r = t.t; void 0 !== r; r = r.x) if (r.i === i.i) r.i = t.i;
				}
				i = i.o;
			}
		})();
		while (void 0 !== h) {
			var r = h;
			h = void 0;
			s++;
			while (void 0 !== r) {
				var n = r.u;
				r.u = void 0;
				r.f &= -3;
				if (!(8 & r.f) && w(r)) try {
					r.c();
				} catch (r) {
					if (!t) {
						i = r;
						t = !0;
					}
				}
				r = n;
			}
		}
		s = 0;
		v--;
		if (t) throw i;
	} else v--;
}
function r(i) {
	if (v > 0) return i();
	u = ++e;
	v++;
	try {
		return i();
	} finally {
		t();
	}
}
var n;
var o = void 0;
function f(i) {
	var t = o, r = n;
	o = void 0;
	n = void 0;
	try {
		return i();
	} finally {
		o = t;
		n = r;
	}
}
var h = void 0;
var v = 0;
var s = 0;
var e = 0;
var u = 0;
var c = void 0;
var a = 0;
function d(i) {
	if (void 0 !== o) {
		var t = i.n;
		if (void 0 === t || t.t !== o) {
			t = {
				i: 0,
				S: i,
				p: o.s,
				n: void 0,
				t: o,
				e: void 0,
				x: void 0,
				r: t
			};
			if (void 0 !== o.s) o.s.n = t;
			o.s = t;
			i.n = t;
			if (32 & o.f) i.S(t);
			return t;
		} else if (-1 === t.i) {
			t.i = 0;
			if (void 0 !== t.n) {
				t.n.p = t.p;
				if (void 0 !== t.p) t.p.n = t.n;
				t.p = o.s;
				t.n = void 0;
				o.s.n = t;
				o.s = t;
			}
			return t;
		}
	}
}
function l(i, t) {
	this.v = i;
	this.i = 0;
	this.n = void 0;
	this.t = void 0;
	this.l = 0;
	this.W = null == t ? void 0 : t.watched;
	this.Z = null == t ? void 0 : t.unwatched;
	this.name = null == t ? void 0 : t.name;
}
l.prototype.brand = i;
l.prototype.h = function() {
	return !0;
};
l.prototype.S = function(i) {
	var t = this, r = this.t;
	if (r !== i && void 0 === i.e) {
		i.x = r;
		this.t = i;
		if (void 0 !== r) r.e = i;
		else f(function() {
			var i;
			null == (i = t.W) || i.call(t);
		});
	}
};
l.prototype.U = function(i) {
	var t = this;
	if (void 0 !== this.t) {
		var r = i.e, n = i.x;
		if (void 0 !== r) {
			r.x = n;
			i.e = void 0;
		}
		if (void 0 !== n) {
			n.e = r;
			i.x = void 0;
		}
		if (i === this.t) {
			this.t = n;
			if (void 0 === n) f(function() {
				var i;
				null == (i = t.Z) || i.call(t);
			});
		}
	}
};
l.prototype.subscribe = function(i) {
	var t = this;
	return x(function() {
		var r = t.value;
		f(function() {
			return i(r);
		});
	}, { name: "sub" });
};
l.prototype.valueOf = function() {
	return this.value;
};
l.prototype.toString = function() {
	return this.value + "";
};
l.prototype.toJSON = function() {
	return this.value;
};
l.prototype.peek = function() {
	var i = this;
	return f(function() {
		return i.value;
	});
};
Object.defineProperty(l.prototype, "value", {
	get: function() {
		var i = d(this);
		if (void 0 !== i) i.i = this.i;
		return this.v;
	},
	set: function(i) {
		if (i !== this.v) {
			if (s > 100) throw new Error("Cycle detected");
			(function(i) {
				if (0 !== v && 0 === s) {
					if (i.l !== u) {
						i.l = u;
						c = {
							S: i,
							v: i.v,
							i: i.i,
							o: c
						};
					}
				}
			})(this);
			this.v = i;
			this.i++;
			a++;
			v++;
			try {
				for (var r = this.t; void 0 !== r; r = r.x) r.t.N();
			} finally {
				t();
			}
		}
	}
});
function y(i, t) {
	return new l(i, t);
}
function w(i) {
	for (var t = i.s; void 0 !== t; t = t.n) if (t.S.i !== t.i || !t.S.h() || t.S.i !== t.i) return !0;
	return !1;
}
function b(i) {
	for (var t = i.s; void 0 !== t; t = t.n) {
		var r = t.S.n;
		if (void 0 !== r) t.r = r;
		t.S.n = t;
		t.i = -1;
		if (void 0 === t.n) {
			i.s = t;
			break;
		}
	}
}
function _(i) {
	var t = i.s, r = void 0;
	while (void 0 !== t) {
		var n = t.p;
		if (-1 === t.i) {
			t.S.U(t);
			if (void 0 !== n) n.n = t.n;
			if (void 0 !== t.n) t.n.p = n;
		} else r = t;
		t.S.n = t.r;
		if (void 0 !== t.r) t.r = void 0;
		t = n;
	}
	i.s = r;
}
function j(i, t) {
	l.call(this, void 0, t);
	this.x = i;
	this.s = void 0;
	this.g = a - 1;
	this.f = 4;
}
j.prototype = new l();
j.prototype.h = function() {
	this.f &= -3;
	if (1 & this.f) return !1;
	if (32 == (36 & this.f)) return !0;
	this.f &= -5;
	if (this.g === a) return !0;
	this.g = a;
	this.f |= 1;
	if (this.i > 0 && !w(this)) {
		this.f &= -2;
		return !0;
	}
	var i = o;
	try {
		b(this);
		o = this;
		var t = this.x();
		if (16 & this.f || this.v !== t || 0 === this.i) {
			this.v = t;
			this.f &= -17;
			this.i++;
		}
	} catch (i) {
		this.v = i;
		this.f |= 16;
		this.i++;
	}
	o = i;
	_(this);
	this.f &= -2;
	return !0;
};
j.prototype.S = function(i) {
	if (void 0 === this.t) {
		this.f |= 36;
		for (var t = this.s; void 0 !== t; t = t.n) t.S.S(t);
	}
	l.prototype.S.call(this, i);
};
j.prototype.U = function(i) {
	if (void 0 !== this.t) {
		l.prototype.U.call(this, i);
		if (void 0 === this.t) {
			this.f &= -33;
			for (var t = this.s; void 0 !== t; t = t.n) t.S.U(t);
		}
	}
};
j.prototype.N = function() {
	if (!(2 & this.f)) {
		this.f |= 6;
		for (var i = this.t; void 0 !== i; i = i.x) i.t.N();
	}
};
Object.defineProperty(j.prototype, "value", { get: function() {
	if (1 & this.f) throw new Error("Cycle detected");
	var i = d(this);
	this.h();
	if (void 0 !== i) i.i = this.i;
	if (16 & this.f) throw this.v;
	return this.v;
} });
function O(i, t) {
	return new j(i, t);
}
function p(i) {
	var r = i.j;
	i.j = void 0;
	if ("function" == typeof r) {
		v++;
		var n = o;
		o = void 0;
		try {
			r();
		} catch (t) {
			i.f &= -2;
			i.f |= 8;
			g(i);
			throw t;
		} finally {
			o = n;
			t();
		}
	}
}
function g(i) {
	for (var t = i.s; void 0 !== t; t = t.n) t.S.U(t);
	i.x = void 0;
	i.s = void 0;
	p(i);
}
function S(i) {
	if (o !== this) throw new Error("Out-of-order effect");
	_(this);
	o = i;
	this.f &= -2;
	try {
		if (8 & this.f) g(this);
	} finally {
		t();
	}
}
function m(i, t) {
	this.x = i;
	this.j = void 0;
	this.s = void 0;
	this.u = void 0;
	this.f = 32;
	this.name = null == t ? void 0 : t.name;
	if (n) n.push(this);
}
m.prototype.c = function() {
	var i = this.S();
	try {
		if (8 & this.f) return;
		if (void 0 === this.x) return;
		var t = this.x();
		if ("function" == typeof t) this.j = t;
	} finally {
		i();
	}
};
m.prototype.S = function() {
	if (1 & this.f) throw new Error("Cycle detected");
	this.f |= 1;
	this.f &= -9;
	p(this);
	b(this);
	v++;
	var i = o;
	o = this;
	return S.bind(this, i);
};
m.prototype.N = function() {
	if (!(2 & this.f)) {
		this.f |= 2;
		this.u = h;
		h = this;
	}
};
m.prototype.d = function() {
	this.f |= 8;
	if (!(1 & this.f)) g(this);
};
m.prototype.dispose = function() {
	this.d();
};
function x(i, t) {
	var r = new m(i, t);
	try {
		r.c();
	} catch (i) {
		r.d();
		throw i;
	}
	var n = r.d.bind(r);
	n[Symbol.dispose] = n;
	return n;
}
// node_modules/@pmndrs/uikit/dist/active.js
/**
* must be executed inside effect/computed
*/
function addActiveHandlers(target, properties, activeSignal, hasActiveConditionalInProperties, hasActiveConditionalInStarProperties) {
	if (!hasActiveConditionalInStarProperties.value && !hasActiveConditionalInProperties.value && properties.value.onActiveChange == null) return;
	const onLeave = ({ pointerId }) => {
		activeSignal.value = activeSignal.value.filter((id) => id != pointerId);
		if (activeSignal.value.length > 0) return;
		properties.peek().onActiveChange?.(false);
	};
	addHandler("onPointerDown", target, ({ pointerId }) => {
		if (pointerId == null) return;
		activeSignal.value = [pointerId, ...activeSignal.value];
		if (activeSignal.value.length != 1) return;
		properties.peek().onActiveChange?.(true);
	});
	addHandler("onPointerUp", target, onLeave);
	addHandler("onPointerLeave", target, onLeave);
}
// node_modules/@pmndrs/uikit/dist/hover.js
function setupCursorCleanup(hoveredSignal, abortSignal) {
	abortSignal.addEventListener("abort", () => unsetCursorType(hoveredSignal));
}
/**
* must be executed inside effect/computed
*/
function addHoverHandlers(target, properties, hoveredSignal, hasHoverConditionalInProperties, hasHoverConditionalInStarProperties) {
	const cursor = properties.value.cursor;
	const onHoverChange = properties.value.onHoverChange;
	if (!hasHoverConditionalInStarProperties.value && !hasHoverConditionalInProperties.value && onHoverChange == null && cursor == null) {
		hoveredSignal.value.length = 0;
		return;
	}
	addHandler("onPointerEnter", target, ({ pointerId }) => {
		if (pointerId == null) return;
		hoveredSignal.value = [pointerId, ...hoveredSignal.value];
		if (hoveredSignal.value.length === 1) onHoverChange?.(true);
		if (cursor != null) setCursorType(hoveredSignal, cursor);
	});
	addHandler("onPointerLeave", target, ({ pointerId }) => {
		hoveredSignal.value = hoveredSignal.value.filter((id) => id != pointerId);
		if (hoveredSignal.value.length === 0) onHoverChange?.(false);
		unsetCursorType(hoveredSignal);
	});
}
var cursorRefStack = [];
var cursorTypeStack = [];
function setCursorType(ref, type) {
	cursorRefStack.push(ref);
	cursorTypeStack.push(type);
	document.body.style.cursor = type;
}
function unsetCursorType(ref) {
	const index = cursorRefStack.indexOf(ref);
	if (index == -1) return;
	cursorRefStack.splice(index, 1);
	cursorTypeStack.splice(index, 1);
	document.body.style.cursor = cursorTypeStack[cursorTypeStack.length - 1] ?? "default";
}
// node_modules/@pmndrs/uikit/dist/panel/geometry.js
function createPanelGeometry() {
	const geometry = new PlaneGeometry();
	const position = geometry.getAttribute("position");
	const array = new Float32Array(4 * position.count);
	const tangent = [
		1,
		0,
		0,
		1
	];
	for (let i = 0; i < array.length; i++) array[i] = tangent[i % 4];
	geometry.setAttribute("tangent", new BufferAttribute(array, 4));
	return geometry;
}
var panelGeometry = createPanelGeometry();
// node_modules/@pmndrs/uikit/dist/panel/interaction/bounds.js
function setupBoundingSphere(target, pixelSize, globalMatrixSignal, size, abortSignal) {
	abortableEffect(() => {
		const sizeValue = size.value;
		const globalMatrix = globalMatrixSignal.value;
		if (sizeValue == null || globalMatrix == null) return;
		target.center.set(0, 0, 0);
		const [w, h] = sizeValue;
		target.radius = Math.sqrt(w * w + h * h) * .5 * pixelSize.value;
		target.applyMatrix4(globalMatrix);
	}, abortSignal);
}
// node_modules/@pmndrs/uikit/dist/panel/interaction/clipped-cast.js
var planeHelper = new Plane();
var worldToGlobalMatrixHelper$2 = new Matrix4();
function makeClippedCast(component, fn, root, parent, orderInfoSignal) {
	return (raycaster, intersects) => {
		const oldLength = intersects.length;
		const fnResult = fn.call(component, raycaster, intersects);
		if (oldLength === intersects.length) return fnResult;
		const orderInfo = orderInfoSignal.peek();
		if (orderInfo == null) return fnResult;
		const clippingPlanes = parent.peek()?.clippingRect?.peek()?.planes;
		root.peek().component.updateMatrix();
		computeWorldToGlobalMatrix(root.peek(), worldToGlobalMatrixHelper$2);
		outer: for (let i = intersects.length - 1; i >= oldLength; i--) {
			const intersection = intersects[i];
			intersection.distance -= orderInfo.majorIndex * .01 + orderInfo.minorIndex * 1e-4 + orderInfo.elementType * 1e-5 + orderInfo.patchIndex * 1e-7;
			if (clippingPlanes == null) continue;
			for (let ii = 0; ii < 4; ii++) {
				planeHelper.copy(clippingPlanes[ii]).applyMatrix4(worldToGlobalMatrixHelper$2);
				if (planeHelper.distanceToPoint(intersection.point) < 0) {
					intersects.splice(i, 1);
					continue outer;
				}
			}
		}
		return fnResult;
	};
}
// node_modules/@pmndrs/uikit/dist/panel/interaction/spherecast.js
var sphereHelper$1 = new Sphere();
var vectorHelper$1 = new Vector3();
var matrixHelper$2 = new Matrix4();
var worldToGlobalMatrixHelper$1 = new Matrix4();
function makePanelSpherecast(root, globalSphereWithLocalScale, globalPanelMatrixSignal, object) {
	return (sphere, intersects) => {
		root.peek().component.updateMatrix();
		computeWorldToGlobalMatrix(root.peek(), worldToGlobalMatrixHelper$1);
		sphereHelper$1.copy(globalSphereWithLocalScale).applyMatrix4(worldToGlobalMatrixHelper$1);
		if (!sphereHelper$1.intersectsSphere(sphere)) return;
		object.updateMatrixWorld(true);
		vectorHelper$1.copy(sphere.center).applyMatrix4(matrixHelper$2.copy(object.matrixWorld).invert());
		vectorHelper$1.x = MathUtils.clamp(vectorHelper$1.x, -.5, .5);
		vectorHelper$1.y = MathUtils.clamp(vectorHelper$1.y, -.5, .5);
		vectorHelper$1.z = 0;
		const uv = new Vector2(vectorHelper$1.x, vectorHelper$1.y);
		vectorHelper$1.applyMatrix4(object.matrixWorld);
		const distance = sphere.center.distanceTo(vectorHelper$1);
		if (distance > sphere.radius) return;
		intersects.push({
			distance,
			object,
			point: vectorHelper$1.clone(),
			uv,
			normal: new Vector3(0, 0, 1)
		});
	};
}
// node_modules/@pmndrs/uikit/dist/panel/material/presets.js
var PlasticMaterial = class extends MeshPhongMaterial {
	constructor() {
		super({
			specular: "#111",
			shininess: 100
		});
	}
};
var GlassMaterial = class extends MeshPhysicalMaterial {
	constructor() {
		super({
			roughness: .1,
			reflectivity: .5,
			iridescence: .001,
			thickness: .05,
			metalness: .3,
			ior: 2
		});
	}
};
var MetalMaterial = class extends MeshPhysicalMaterial {
	constructor() {
		super({
			iridescence: .001,
			metalness: .8,
			roughness: .1
		});
	}
};
var materialClasses = {
	glass: GlassMaterial,
	metal: MetalMaterial,
	plastic: PlasticMaterial
};
function resolvePanelMaterialClassProperty(input) {
	if (typeof input != "string") return input;
	return materialClasses[input];
}
// node_modules/@pmndrs/uikit/dist/allocation/sorted-buckets.js
function assureBucketExists(buckets, bucketIndex) {
	while (bucketIndex >= buckets.length) {
		let offset = 0;
		let missingSpace = 0;
		if (buckets.length > 0) {
			const prevBucket = buckets[buckets.length - 1];
			offset += prevBucket.offset + prevBucket.elements.length;
			missingSpace = Math.min(0, prevBucket.missingSpace);
			prevBucket.missingSpace -= missingSpace;
		}
		buckets.push({
			add: [],
			missingSpace,
			offset,
			elements: []
		});
	}
}
function resizeSortedBucketsSpace(buckets, oldSize, newSize) {
	assureBucketExists(buckets, 0);
	const lastBucket = buckets[buckets.length - 1];
	lastBucket.missingSpace += oldSize - newSize;
}
/**
* @returns true iff a call to @function updateSortedBucketsAllocation is necassary
*/
function addToSortedBuckets(buckets, bucketIndex, element, activateElement) {
	assureBucketExists(buckets, bucketIndex);
	const bucket = buckets[bucketIndex];
	bucket.missingSpace += 1;
	if (bucket.missingSpace <= 0) {
		activateElement(element, bucket, bucket.elements.length);
		bucket.elements.push(element);
		return false;
	}
	bucket.add.push(element);
	return true;
}
/**
* assures that the free space of a bucket is always at the end
* @returns true iff a call to @function updateSortedBucketsAllocation is necassary
*/
function removeFromSortedBuckets(buckets, bucketIndex, element, elementIndex, activateElement, clearBufferAt, setElementIndex, bufferCopyWithin) {
	if (bucketIndex >= buckets.length) throw new Error(`no bucket at index ${bucketIndex}`);
	const bucket = buckets[bucketIndex];
	bucket.missingSpace -= 1;
	const addIndex = bucket.add.indexOf(element);
	if (addIndex != -1) {
		bucket.add.splice(addIndex, 1);
		return false;
	}
	if (elementIndex == null || elementIndex >= bucket.elements.length) throw new Error(`no element at index ${elementIndex}`);
	if (bucket.add.length > 0) {
		const newElement = bucket.add.shift();
		bucket.elements[elementIndex] = newElement;
		activateElement(newElement, bucket, elementIndex);
		return false;
	}
	const offset = bucket.offset;
	const lastIndexInBucket = bucket.elements.length - 1;
	if (lastIndexInBucket != elementIndex) {
		const startIndex = offset + lastIndexInBucket;
		bufferCopyWithin(offset + elementIndex, startIndex, startIndex + 1);
		const swapElement = bucket.elements[lastIndexInBucket];
		bucket.elements[elementIndex] = swapElement;
		setElementIndex(swapElement, elementIndex);
	}
	clearBufferAt(offset + lastIndexInBucket);
	bucket.elements.length -= 1;
	if (bucketIndex < buckets.length - 1) return true;
	let currentBucket = bucket;
	while (currentBucket.elements.length === 0 && currentBucket.add.length == 0 && bucketIndex > 0) {
		const prevBucket = buckets[bucketIndex - 1];
		prevBucket.missingSpace += currentBucket.missingSpace;
		currentBucket = buckets[--bucketIndex];
	}
	buckets.length = bucketIndex + 1;
	return false;
}
/**
* @requires that the buffer has room for elementCount number of elements
*/
function updateSortedBucketsAllocation(buckets, activateElement, bufferCopyWithin) {
	let bucketsLength = buckets.length;
	let lastBucketWithElements = -1;
	for (let i = 0; i < bucketsLength; i++) {
		const bucket = buckets[i];
		if (bucket.elements.length + bucket.add.length > 0) lastBucketWithElements = i;
		const lastBucket = i === bucketsLength - 1;
		if (!lastBucket && bucket.missingSpace === 0) continue;
		const hasSpace = bucket.missingSpace < 0;
		for (let ii = i - 1; ii >= 0; ii--) {
			const otherBucket = buckets[ii];
			if (otherBucket.missingSpace === 0) continue;
			const otherHasSpace = otherBucket.missingSpace < 0;
			if (otherHasSpace && (lastBucket || hasSpace)) {
				shiftLeft(buckets, bufferCopyWithin, ii, i, Math.abs(otherBucket.missingSpace));
				continue;
			}
			if (!hasSpace && !otherHasSpace) continue;
			const shiftBy = Math.min(Math.abs(otherBucket.missingSpace), Math.abs(bucket.missingSpace));
			if (hasSpace) shiftRight(buckets, bufferCopyWithin, ii, i, shiftBy);
			else shiftLeft(buckets, bufferCopyWithin, ii, i, shiftBy);
		}
	}
	const newLastBucket = buckets[lastBucketWithElements];
	for (let i = lastBucketWithElements + 1; i < bucketsLength; i++) newLastBucket.missingSpace += buckets[i].missingSpace;
	bucketsLength = buckets.length = lastBucketWithElements + 1;
	for (let i = 0; i < bucketsLength; i++) {
		const bucket = buckets[i];
		const { elements, add } = bucket;
		const addLength = add.length;
		for (let ii = 0; ii < addLength; ii++) {
			const element = add[ii];
			activateElement(element, bucket, elements.length);
			elements.push(element);
		}
		add.length = 0;
	}
}
function shiftLeft(buckets, bufferCopyWithin, startIndexIncl, endIndexIncl, shiftBy) {
	const endBucket = buckets[endIndexIncl];
	const startIndex = buckets[startIndexIncl + 1].offset;
	bufferCopyWithin(startIndex - shiftBy, startIndex, endBucket.offset + endBucket.elements.length);
	const startBucket = buckets[startIndexIncl];
	startBucket.missingSpace += shiftBy;
	endBucket.missingSpace -= shiftBy;
	for (let i = startIndexIncl + 1; i <= endIndexIncl; i++) buckets[i].offset -= shiftBy;
}
function shiftRight(buckets, bufferCopyWithin, startIndexIncl, endIndexIncl, shiftBy) {
	const endBucket = buckets[endIndexIncl];
	const startIndex = buckets[startIndexIncl + 1].offset;
	bufferCopyWithin(startIndex + shiftBy, startIndex, endBucket.offset + endBucket.elements.length);
	const startBucket = buckets[startIndexIncl];
	startBucket.missingSpace -= shiftBy;
	endBucket.missingSpace += shiftBy;
	for (let i = startIndexIncl + 1; i <= endIndexIncl; i++) buckets[i].offset += shiftBy;
}
// node_modules/@pmndrs/uikit/dist/panel/material/shader.js
function compilePanelDepthMaterial(parameters, instanced) {
	compilePanelClippingMaterial(parameters, instanced);
	parameters.fragmentShader = parameters.fragmentShader.replace("#include <clipping_planes_fragment>", `#include <clipping_planes_fragment>
    ${getFragmentOpacityCode(instanced, void 0)}
    `);
}
function compilePanelClippingMaterial(parameters, instanced) {
	parameters.vertexShader = parameters.vertexShader.replace("#include <common>", ` #include <common>
      out vec4 borderRadius;
      ${instanced ? "" : "uniform highp mat4 data;"}`);
	parameters.vertexShader = parameters.vertexShader.replace("#include <uv_vertex>", ` #include <uv_vertex>
      highp int packedBorderRadius = int(data[2].x);
      borderRadius = vec4(
        float(packedBorderRadius / 125000 % 50),
        float(packedBorderRadius / 2500 % 50),
        float(packedBorderRadius / 50 % 50),
        float(packedBorderRadius % 50)
      ) * 0.01;`);
	if (instanced) {
		parameters.vertexShader = parameters.vertexShader.replace("#include <common>", ` #include <common>
        attribute highp mat4 aData;
        attribute mat4 aClipping;
        out mat4 data;
        out mat4 clipping;
        out vec3 localPosition;`);
		parameters.vertexShader = parameters.vertexShader.replace("#include <uv_vertex>", ` #include <uv_vertex>
        data = aData;
        clipping = aClipping;
        localPosition = (instanceMatrix * vec4(position, 1.0)).xyz;`);
	}
	parameters.fragmentShader = getFragmentShaderPrefix(instanced) + parameters.fragmentShader;
	parameters.fragmentShader = parameters.fragmentShader.replace("#include <clipping_planes_fragment>", getClippingPlanesFragment(instanced));
}
function getFragmentShaderPrefix(instanced) {
	return `${instanced ? "in" : "uniform"} highp mat4 data;
    in vec4 borderRadius;
    ${instanced ? `
    in vec3 localPosition;
    in mat4 clipping;` : ""}

    float min4(vec4 v) {
        vec2 tmp = min(v.xy, v.zw);
        return min(tmp.x, tmp.y);
    }
    
    float max4(vec4 v) {
        vec2 tmp = max(v.xy, v.zw);
        return max(tmp.x, tmp.y);
    }
    
    vec2 radiusDistance(float radius, vec2 outside, vec2 border, vec2 borderSize) {
        vec2 outerRadius = vec2(radius);
        vec2 innerRadius = outerRadius - borderSize;
        
        vec2 radiusWeightUnnorm = abs(innerRadius - border);
        float sum = radiusWeightUnnorm.x + radiusWeightUnnorm.y;
        vec2 radiusWeight = sum > 0.0 ? radiusWeightUnnorm / sum : vec2(0.5);
        
        return vec2(
            radius - distance(outside, outerRadius),
            dot(radiusWeight, innerRadius) - distance(border, innerRadius)
        );
    }
    
    vec2 calculateCornerIntersection(float cornerRadius, vec2 borderSizes, float aspectRatio) {
        float tmp1 = cornerRadius - borderSizes.y;
        vec2 xIntersection = vec2(tmp1, tmp1 / aspectRatio);
        
        float tmp2 = cornerRadius - borderSizes.x;
        vec2 yIntersection = vec2(tmp2 * aspectRatio, tmp2);
        
        return min(xIntersection, yIntersection);
    }
    `;
}
function getClippingPlanesFragment(instanced) {
	return ` ${instanced ? `
        vec4 plane;
        float distanceToPlane, planeDistanceGradient;
        float clipOpacity = 1.0;

        for(int i = 0; i < 4; i++) {
          plane = clipping[i];
          distanceToPlane = dot(localPosition, plane.xyz) + plane.w;
          planeDistanceGradient = max(fwidth(distanceToPlane) * 0.5, 0.00001);
          clipOpacity *= smoothstep(-planeDistanceGradient, planeDistanceGradient, distanceToPlane);
    
          if (clipOpacity < 0.01) discard;
        }` : ""}
        
        vec4 absoluteBorderSize = data[0];
        vec3 backgroundColor = data[1].xyz;
        float backgroundOpacity = data[1].w;
        vec3 borderColor = data[2].yzw;
        float borderOpacity = data[3].x;
        float borderBend = data[3].y;
        vec2 dimensions = data[3].zw;
        
        float aspectRatio = dimensions.x / dimensions.y;
        vec4 borderSize = absoluteBorderSize / dimensions.yyyy;
        
        vec2 uvFlipped = vec2(vUv.x, 1.0 - vUv.y);
        vec4 v_outsideDistance = vec4(
            uvFlipped.y,
            (1.0 - uvFlipped.x) * aspectRatio,
            1.0 - uvFlipped.y,
            uvFlipped.x * aspectRatio
        );
        vec4 v_borderDistance = v_outsideDistance - borderSize;
  
        vec2 distance = vec2(min4(v_outsideDistance), min4(v_borderDistance));
        
        vec4 negateBorderDistance = vec4(1.0) - v_borderDistance;
        float maxWeight = max4(negateBorderDistance);
        vec4 borderWeight = step(maxWeight, negateBorderDistance);
  
        vec4 insideBorder = vec4(0.0);
        
        vec2 cornerPos;
        float cornerRadius;
        vec2 cornerBorderSizes;
        
        if (all(lessThan(v_outsideDistance.wx, borderRadius.xx))) {
            cornerPos = v_outsideDistance.wx;
            cornerRadius = borderRadius.x;
            cornerBorderSizes = borderSize.wx;
            distance = radiusDistance(cornerRadius, cornerPos, v_borderDistance.wx, cornerBorderSizes);
            
            vec2 lineIntersection = calculateCornerIntersection(cornerRadius, cornerBorderSizes, aspectRatio);
            insideBorder.wx = max(vec2(0.0), lineIntersection - v_borderDistance.wx);
        }
        else if (all(lessThan(v_outsideDistance.yx, borderRadius.yy))) {
            cornerPos = v_outsideDistance.yx;
            cornerRadius = borderRadius.y;
            cornerBorderSizes = borderSize.yx;
            distance = radiusDistance(cornerRadius, cornerPos, v_borderDistance.yx, cornerBorderSizes);
            
            vec2 lineIntersection = calculateCornerIntersection(cornerRadius, cornerBorderSizes, aspectRatio);
            insideBorder.yx = max(vec2(0.0), lineIntersection - v_borderDistance.yx);
        }
        else if (all(lessThan(v_outsideDistance.yz, borderRadius.zz))) {
            cornerPos = v_outsideDistance.yz;
            cornerRadius = borderRadius.z;
            cornerBorderSizes = borderSize.yz;
            distance = radiusDistance(cornerRadius, cornerPos, v_borderDistance.yz, cornerBorderSizes);
            
            vec2 lineIntersection = calculateCornerIntersection(cornerRadius, cornerBorderSizes, aspectRatio);
            insideBorder.yz = max(vec2(0.0), lineIntersection - v_borderDistance.yz);
        }
        else if (all(lessThan(v_outsideDistance.zw, borderRadius.ww))) {
            cornerPos = v_outsideDistance.zw;
            cornerRadius = borderRadius.w;
            cornerBorderSizes = borderSize.zw;
            distance = radiusDistance(cornerRadius, cornerPos, v_borderDistance.zw, cornerBorderSizes);
            
            vec2 lineIntersection = calculateCornerIntersection(cornerRadius, cornerBorderSizes, aspectRatio);
            insideBorder.zw = max(vec2(0.0), lineIntersection - v_borderDistance.zw);
        }
  
        float insideBorderSum = dot(insideBorder, vec4(1.0));
        if (insideBorderSum > 0.0) {
          borderWeight = insideBorder / insideBorderSum;
        }
  
        #include <clipping_planes_fragment>`;
}
function getFragmentOpacityCode(instanced, existingOpacity) {
	return `vec2 distanceGradient = fwidth(distance);
  float outer = smoothstep(-distanceGradient.x, distanceGradient.x, distance.x);
  float inner = smoothstep(-distanceGradient.y, distanceGradient.y, distance.y);

  float transition = 1.0 - step(0.1, outer - inner) * (1.0 - inner);

  float fullBackgroundOpacity = ${existingOpacity == null ? "" : `${existingOpacity} * `}backgroundOpacity;
  float fullBorderOpacity = min(1.0, borderOpacity + fullBackgroundOpacity);

  float outOpacity = ${instanced ? "clipOpacity * " : ""}outer * mix(fullBorderOpacity, fullBackgroundOpacity, transition);

  if (outOpacity < 0.01) {
    discard;
  }`;
}
function compilePanelMaterial(parameters, instanced) {
	compilePanelClippingMaterial(parameters, instanced);
	parameters.fragmentShader = parameters.fragmentShader.replace("#include <color_fragment>", ` #include <color_fragment>
      ${getFragmentOpacityCode(instanced, "diffuseColor.a")}
      
      vec3 mainColor = diffuseColor.rgb * backgroundColor;
      float borderMix = borderOpacity / max(fullBorderOpacity, 0.001);
      diffuseColor.rgb = mix(mix(mainColor, borderColor, borderMix), mainColor, transition);
      diffuseColor.a = outOpacity;
      `);
	parameters.fragmentShader = parameters.fragmentShader.replace("#include <normal_fragment_maps>", ` #include <normal_fragment_maps>
      
      vec3 bitangent = normalize(vBitangent);
      vec3 tangent = normalize(vTangent);
      
      mat4 directions = mat4(
        vec4(bitangent, 1.0), 
        vec4(tangent, 1.0), 
        vec4(-bitangent, 1.0), 
        vec4(-tangent, 1.0)
      );
      
      float currentBorderSize = distance.x - distance.y;
      float outsideNormalWeight = currentBorderSize < 1e-5 ? 0.0 : 
        max(0.0, -distance.y / currentBorderSize) * -borderBend;
      
      vec3 outsideNormal = (borderWeight * transpose(directions)).xyz;
      normal = normalize(mix(normal, outsideNormal, outsideNormalWeight));
    `);
}
// node_modules/@pmndrs/uikit/dist/panel/material/create.js
function createPanelMaterial(MaterialClass, info) {
	const material = new MaterialClass();
	if (material.defines == null) material.defines = {};
	material.side = 0;
	material.clipShadows = true;
	material.transparent = true;
	material.toneMapped = false;
	material.shadowSide = 0;
	material.defines.USE_UV = "";
	material.defines.USE_TANGENT = "";
	const superOnBeforeCompile = material.onBeforeCompile;
	material.onBeforeCompile = (parameters, renderer) => {
		superOnBeforeCompile.call(material, parameters, renderer);
		if (info.type === "normal") parameters.uniforms.data = { value: info.data };
		compilePanelMaterial(parameters, info.type === "instanced");
	};
	return material;
}
// node_modules/@pmndrs/uikit/dist/panel/material/depth.js
var PanelDistanceMaterial = class extends MeshDistanceMaterial {
	info;
	constructor(info) {
		super();
		this.info = info;
		if (this.defines == null) this.defines = {};
		this.defines.USE_UV = "";
		this.clipShadows = true;
	}
	onBeforeCompile(parameters, renderer) {
		super.onBeforeCompile(parameters, renderer);
		if (this.info.type === "normal") parameters.uniforms.data = { value: this.info.data };
		compilePanelDepthMaterial(parameters, this.info.type === "instanced");
	}
};
var PanelDepthMaterial = class extends MeshDepthMaterial {
	info;
	constructor(info) {
		super({ depthPacking: RGBADepthPacking });
		this.info = info;
		if (this.defines == null) this.defines = {};
		this.defines.USE_UV = "";
		this.clipShadows = true;
	}
	onBeforeCompile(parameters, renderer) {
		super.onBeforeCompile(parameters, renderer);
		if (this.info.type === "normal") parameters.uniforms.data = { value: this.info.data };
		compilePanelDepthMaterial(parameters, this.info.type === "instanced");
	}
};
var instancedPanelDepthMaterial = new PanelDepthMaterial({ type: "instanced" });
var instancedPanelDistanceMaterial = new PanelDistanceMaterial({ type: "instanced" });
// node_modules/@pmndrs/uikit/dist/panel/instance/mesh.js
var InstancedPanelMesh = class InstancedPanelMesh extends Mesh {
	root;
	instanceMatrix;
	count = 0;
	isInstancedMesh = true;
	instanceColor = null;
	morphTexture = null;
	boundingBox = new Box3();
	boundingSphere = new Sphere();
	customUpdateMatrixWorld = () => computeWorldToGlobalMatrix(this.root, this.matrixWorld);
	constructor(root, instanceMatrix, instanceData, instanceClipping) {
		const panelGeometry = createPanelGeometry();
		super(panelGeometry);
		this.root = root;
		this.instanceMatrix = instanceMatrix;
		this.pointerEvents = "none";
		panelGeometry.attributes.aData = instanceData;
		panelGeometry.attributes.aClipping = instanceClipping;
		this.customDepthMaterial = instancedPanelDepthMaterial;
		this.customDistanceMaterial = instancedPanelDistanceMaterial;
		this.frustumCulled = false;
		root.onUpdateMatrixWorldSet.add(this.customUpdateMatrixWorld);
	}
	dispose() {
		this.root.onUpdateMatrixWorldSet.delete(this.customUpdateMatrixWorld);
		this.dispatchEvent({ type: "dispose" });
		this.geometry.dispose();
	}
	clone() {
		const cloned = new InstancedPanelMesh(this.root, this.instanceMatrix, this.geometry.attributes.aData, this.geometry.attributes.aClipping);
		cloned.count = this.count;
		cloned.material = this.material;
		return cloned;
	}
	copy() {
		throw new Error("InstancedPanelMesh.copy() is not supported. Use clone() instead.");
	}
	computeBoundingBox() {}
	computeBoundingSphere() {}
	updateMorphTargets() {}
	raycast() {}
	spherecast() {}
};
// node_modules/@pmndrs/uikit/dist/properties/values.js
var numberStringPattern = String.raw`[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:[eE][+-]?\d+)?`;
var numberStringRegex = new RegExp(`^${numberStringPattern}$`);
var percentageRegex = new RegExp(`^${numberStringPattern}%$`);
var pixelLengthRegex = new RegExp(`^${numberStringPattern}px$`);
var viewportLengthRegex = new RegExp(`^${numberStringPattern}(vh|dvh|svh|lvh|vw|dvw|svw|lvw)$`);
function isNumberString(value) {
	return typeof value === "string" && numberStringRegex.test(value);
}
function isPercentageString(value) {
	return typeof value === "string" && percentageRegex.test(value);
}
function isPixelLengthString(value) {
	return typeof value === "string" && pixelLengthRegex.test(value);
}
function isViewportLengthString(value) {
	return typeof value === "string" && viewportLengthRegex.test(value);
}
function isViewportHeightLength(value) {
	return isViewportLengthString(value) && value.endsWith("vh");
}
function isViewportWidthLength(value) {
	return isViewportLengthString(value) && value.endsWith("vw");
}
function parseAbsoluteNumber(value, getRelativeValue, viewportWidth, viewportHeight) {
	if (typeof value === "number") return value;
	if (isPercentageString(value)) {
		const number = Number.parseFloat(value);
		return getRelativeValue == null ? number : getRelativeValue() * number / 100;
	}
	if (isViewportHeightLength(value)) {
		const number = Number.parseFloat(value);
		return viewportHeight == null ? number : viewportHeight * number / 100;
	}
	if (isViewportWidthLength(value)) {
		const number = Number.parseFloat(value);
		return viewportWidth == null ? number : viewportWidth * number / 100;
	}
	if (isNumberString(value)) return Number(value);
	if (isPixelLengthString(value)) return Number(value.slice(0, -2));
	throw new Error(`Invalid number: ${value}`);
}
function parseNumberValue(value) {
	return typeof value === "number" ? value : Number(value);
}
function parseAbsoluteLengthValue(value) {
	return isPixelLengthString(value) ? Number(value.slice(0, -2)) : parseNumberValue(value);
}
function convertYogaPoint(input, viewportWidth, viewportHeight) {
	if (input == null || typeof input === "number" || isPercentageString(input)) return input;
	if (isNumberString(input)) return Number(input);
	if (isPixelLengthString(input)) return Number(input.slice(0, -2));
	if (isViewportWidthLength(input)) return viewportWidth * Number.parseFloat(input) / 100;
	if (isViewportHeightLength(input)) return viewportHeight * Number.parseFloat(input) / 100;
	throw new Error(`Invalid Yoga point: ${input}`);
}
// node_modules/@pmndrs/uikit/dist/panel/instance/group.js
var nextFrame = Symbol("nextFrame");
var InstancedPanelGroup = class {
	object;
	root;
	orderInfo;
	panelGroupProperties;
	mesh;
	instanceMatrix;
	instanceData;
	instanceClipping;
	instanceMaterial;
	buckets = [];
	elementCount = 0;
	bufferElementSize = 0;
	instanceDataOnUpdate;
	nextUpdateTime;
	nextUpdateTimeoutRef;
	activateElement = (element, bucket, indexInBucket) => {
		const index = bucket.offset + indexInBucket;
		this.instanceData.set(element.materialConfig.defaultData, 16 * index);
		this.instanceData.addUpdateRange(16 * index, 16);
		this.instanceData.needsUpdate = true;
		element.activate(bucket, indexInBucket);
	};
	setElementIndex = (element, index) => {
		element.setIndexInBucket(index);
	};
	bufferCopyWithin = (targetIndex, startIndex, endIndex) => {
		copyWithinAttribute(this.instanceMatrix, targetIndex, startIndex, endIndex);
		copyWithinAttribute(this.instanceData, targetIndex, startIndex, endIndex);
		copyWithinAttribute(this.instanceClipping, targetIndex, startIndex, endIndex);
	};
	clearBufferAt = (index) => {
		const bufferOffset = index * 16;
		this.instanceMatrix.array.fill(0, bufferOffset, bufferOffset + 16);
		this.instanceMatrix.addUpdateRange(bufferOffset, 16);
		this.instanceMatrix.needsUpdate = true;
	};
	constructor(object, root, orderInfo, panelGroupProperties) {
		this.object = object;
		this.root = root;
		this.orderInfo = orderInfo;
		this.panelGroupProperties = panelGroupProperties;
		const materialClass = resolvePanelMaterialClassProperty(panelGroupProperties.panelMaterialClass);
		this.instanceMaterial = createPanelMaterial(materialClass, { type: "instanced" });
		this.instanceMaterial.depthTest = panelGroupProperties.depthTest;
		this.instanceMaterial.depthWrite = panelGroupProperties.depthWrite;
	}
	updateCount() {
		const lastBucket = this.buckets[this.buckets.length - 1];
		const count = lastBucket.offset + lastBucket.elements.length;
		if (this.mesh == null) return;
		this.mesh.count = count;
		this.mesh.visible = count > 0;
		this.root.requestRender?.();
	}
	requestUpdate(time) {
		if (this.nextUpdateTime == nextFrame) return;
		const forTime = performance.now() + time;
		if (this.nextUpdateTime != null && this.nextUpdateTime < forTime) return;
		this.nextUpdateTime = forTime;
		clearTimeout(this.nextUpdateTimeoutRef);
		this.nextUpdateTimeoutRef = setTimeout(this.requestUpdateNextFrame.bind(this), time);
	}
	requestUpdateNextFrame() {
		this.nextUpdateTime = nextFrame;
		clearTimeout(this.nextUpdateTimeoutRef);
		this.nextUpdateTimeoutRef = void 0;
		this.root.requestFrame?.();
	}
	insert(bucketIndex, panel) {
		this.elementCount += 1;
		if (!addToSortedBuckets(this.buckets, bucketIndex, panel, this.activateElement)) {
			this.updateCount();
			return;
		}
		this.requestUpdateNextFrame();
	}
	delete(bucketIndex, elementIndex, panel) {
		this.elementCount -= 1;
		if (!removeFromSortedBuckets(this.buckets, bucketIndex, panel, elementIndex, this.activateElement, this.clearBufferAt, this.setElementIndex, this.bufferCopyWithin)) {
			this.updateCount();
			return;
		}
		this.root.requestRender?.();
		this.requestUpdate(1e3);
	}
	onFrame() {
		if (this.nextUpdateTime != nextFrame) return;
		this.nextUpdateTime = void 0;
		this.update();
	}
	update() {
		if (this.elementCount === 0) {
			if (this.mesh != null) this.mesh.visible = false;
			return;
		}
		if (this.elementCount > this.bufferElementSize) {
			this.resize();
			updateSortedBucketsAllocation(this.buckets, this.activateElement, this.bufferCopyWithin);
		} else if (this.elementCount <= this.bufferElementSize / 3) {
			updateSortedBucketsAllocation(this.buckets, this.activateElement, this.bufferCopyWithin);
			this.resize();
		} else updateSortedBucketsAllocation(this.buckets, this.activateElement, this.bufferCopyWithin);
		this.mesh.count = this.elementCount;
		this.mesh.visible = true;
	}
	resize() {
		const oldBufferSize = this.bufferElementSize;
		this.bufferElementSize = Math.ceil(this.elementCount * 1.5);
		if (this.mesh != null) {
			this.mesh.dispose();
			this.object.remove(this.mesh);
		}
		resizeSortedBucketsSpace(this.buckets, oldBufferSize, this.bufferElementSize);
		const matrixArray = new Float32Array(this.bufferElementSize * 16);
		if (this.instanceMatrix != null) matrixArray.set(this.instanceMatrix.array.subarray(0, matrixArray.length));
		this.instanceMatrix = new InstancedBufferAttribute(matrixArray, 16, false);
		this.instanceMatrix.setUsage(DynamicDrawUsage);
		const dataArray = new Float32Array(this.bufferElementSize * 16);
		if (this.instanceData != null) dataArray.set(this.instanceData.array.subarray(0, dataArray.length));
		this.instanceData = new InstancedBufferAttribute(dataArray, 16, false);
		this.instanceDataOnUpdate = (start, count) => {
			this.instanceData.addUpdateRange(start, count);
			this.instanceData.needsUpdate = true;
		};
		this.instanceData.setUsage(DynamicDrawUsage);
		const clippingArray = new Float32Array(this.bufferElementSize * 16);
		if (this.instanceClipping != null) clippingArray.set(this.instanceClipping.array.subarray(0, clippingArray.length));
		this.instanceClipping = new InstancedBufferAttribute(clippingArray, 16, false);
		this.instanceClipping.setUsage(DynamicDrawUsage);
		this.mesh = new InstancedPanelMesh(this.root, this.instanceMatrix, this.instanceData, this.instanceClipping);
		this.mesh.renderOrder = parseNumberValue(this.panelGroupProperties.renderOrder);
		setupRenderOrder(this.mesh, { peek: () => this.root }, { value: this.orderInfo });
		this.mesh.material = this.instanceMaterial;
		this.mesh.receiveShadow = this.panelGroupProperties.receiveShadow;
		this.mesh.castShadow = this.panelGroupProperties.castShadow;
		this.object.addUnsafe(this.mesh);
	}
	destroy() {
		clearTimeout(this.nextUpdateTimeoutRef);
		if (this.mesh == null) return;
		this.object.remove(this.mesh);
		this.mesh?.dispose();
		this.instanceMaterial.dispose();
	}
};
function copyWithinAttribute(attribute, targetIndex, startIndex, endIndex) {
	const itemSize = attribute.itemSize;
	const start = startIndex * itemSize;
	const end = endIndex * itemSize;
	const target = targetIndex * itemSize;
	attribute.array.copyWithin(target, start, end);
	const count = end - start;
	attribute.addUpdateRange(start, count);
	attribute.addUpdateRange(target, count);
	attribute.needsUpdate = true;
}
// node_modules/@pmndrs/uikit/dist/panel/instance/group-manager.js
var PanelGroupManager = class {
	root;
	object;
	map = /* @__PURE__ */ new Map();
	constructor(root, object) {
		this.root = root;
		this.object = object;
	}
	init(abortSignal) {
		const onFrame = () => this.traverse((group) => group.onFrame());
		this.root.onFrameSet.add(onFrame);
		abortSignal.addEventListener("abort", () => {
			this.root.onFrameSet.delete(onFrame);
			this.traverse((group) => group.destroy());
		});
	}
	traverse(fn) {
		for (const groups of this.map.values()) for (const group of groups.values()) fn(group);
	}
	getGroup({ majorIndex, minorIndex }, properties) {
		const materialClass = resolvePanelMaterialClassProperty(properties.panelMaterialClass);
		let groups = this.map.get(materialClass);
		if (groups == null) this.map.set(materialClass, groups = /* @__PURE__ */ new Map());
		const key = [
			majorIndex,
			minorIndex,
			properties.renderOrder,
			properties.depthTest,
			properties.depthWrite,
			properties.receiveShadow,
			properties.castShadow
		].join(",");
		let panelGroup = groups.get(key);
		if (panelGroup == null) groups.set(key, panelGroup = new InstancedPanelGroup(this.object, this.root, {
			elementType: ElementType.Panel,
			minorIndex,
			majorIndex,
			patchIndex: 0
		}, properties));
		return panelGroup;
	}
};
// node_modules/@pmndrs/uikit/dist/panel/instance/matrix.js
var matrixHelper$1 = new Matrix4();
function computedPanelMatrix(properties, matrixSignal, sizeSignal, offsetSignal) {
	return O(() => {
		const size = sizeSignal.value;
		const matrix = matrixSignal.value;
		if (size == null || matrix == null) return;
		const [width, height] = size;
		const pixelSize = parseNumberValue(properties.value.pixelSize);
		const result = new Matrix4();
		result.makeScale(width * pixelSize, height * pixelSize, 1);
		if (offsetSignal != null) {
			const [x, y] = offsetSignal.value;
			result.premultiply(matrixHelper$1.makeTranslation(x * pixelSize, y * pixelSize, 0));
		}
		return result.premultiply(matrix);
	});
}
// node_modules/yoga-layout/dist/binaries/yoga-wasm-base64-esm.js
var loadYoga$1 = (() => {
	var _scriptDir = import.meta.url;
	return (function(loadYoga) {
		loadYoga = loadYoga || {};
		var h;
		h || (h = typeof loadYoga !== "undefined" ? loadYoga : {});
		var aa, ca;
		h.ready = new Promise(function(a, b) {
			aa = a;
			ca = b;
		});
		var da = Object.assign({}, h), q = "";
		"undefined" != typeof document && document.currentScript && (q = document.currentScript.src);
		_scriptDir && (q = _scriptDir);
		0 !== q.indexOf("blob:") ? q = q.substr(0, q.replace(/[?#].*/, "").lastIndexOf("/") + 1) : q = "";
		var ea = h.print || console.log.bind(console), v = h.printErr || console.warn.bind(console);
		Object.assign(h, da);
		da = null;
		var w;
		h.wasmBinary && (w = h.wasmBinary);
		h.noExitRuntime;
		"object" != typeof WebAssembly && x("no native wasm support detected");
		var fa, ha = !1;
		function z(a, b, c) {
			c = b + c;
			for (var d = ""; !(b >= c);) {
				var e = a[b++];
				if (!e) break;
				if (e & 128) {
					var f = a[b++] & 63;
					if (192 == (e & 224)) d += String.fromCharCode((e & 31) << 6 | f);
					else {
						var g = a[b++] & 63;
						e = 224 == (e & 240) ? (e & 15) << 12 | f << 6 | g : (e & 7) << 18 | f << 12 | g << 6 | a[b++] & 63;
						65536 > e ? d += String.fromCharCode(e) : (e -= 65536, d += String.fromCharCode(55296 | e >> 10, 56320 | e & 1023));
					}
				} else d += String.fromCharCode(e);
			}
			return d;
		}
		var ia, ja, A, C, ka, D, E, la, ma;
		function na() {
			var a = fa.buffer;
			ia = a;
			h.HEAP8 = ja = new Int8Array(a);
			h.HEAP16 = C = new Int16Array(a);
			h.HEAP32 = D = new Int32Array(a);
			h.HEAPU8 = A = new Uint8Array(a);
			h.HEAPU16 = ka = new Uint16Array(a);
			h.HEAPU32 = E = new Uint32Array(a);
			h.HEAPF32 = la = new Float32Array(a);
			h.HEAPF64 = ma = new Float64Array(a);
		}
		var oa, pa = [], qa = [], ra = [];
		function sa() {
			var a = h.preRun.shift();
			pa.unshift(a);
		}
		var F = 0, ta = null, G = null;
		function x(a) {
			if (h.onAbort) h.onAbort(a);
			a = "Aborted(" + a + ")";
			v(a);
			ha = !0;
			a = new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
			ca(a);
			throw a;
		}
		function ua(a) {
			return a.startsWith("data:application/octet-stream;base64,");
		}
		var H = "data:application/octet-stream;base64,AGFzbQEAAAABugM3YAF/AGACf38AYAF/AX9gA39/fwBgAn98AGACf38Bf2ADf39/AX9gBH9/f30BfWADf398AGAAAGAEf39/fwBgAX8BfGACf38BfGAFf39/f38Bf2AAAX9gA39/fwF9YAZ/f31/fX8AYAV/f39/fwBgAn9/AX1gBX9/f319AX1gAX8BfWADf35/AX5gB39/f39/f38AYAZ/f39/f38AYAR/f39/AX9gBn9/f319fQF9YAR/f31/AGADf399AX1gBn98f39/fwF/YAR/fHx/AGACf30AYAh/f39/f39/fwBgDX9/f39/f39/f39/f38AYAp/f39/f39/f39/AGAFf39/f38BfGAEfHx/fwF9YA1/fX1/f399fX9/f39/AX9gB39/f319f38AYAJ+fwF/YAN/fX0BfWABfAF8YAN/fHwAYAR/f319AGAHf39/fX19fQF9YA1/fX99f31/fX19fX1/AX9gC39/f39/f399fX19AX9gCH9/f39/f319AGAEf39+fgBgB39/f39/f38Bf2ACfH8BfGAFf398fH8AYAN/f38BfGAEf39/fABgA39/fQBgBn9/fX99fwF/ArUBHgFhAWEAHwFhAWIAAwFhAWMACQFhAWQAFgFhAWUAEQFhAWYAIAFhAWcAAAFhAWgAIQFhAWkAAwFhAWoAAAFhAWsAFwFhAWwACgFhAW0ABQFhAW4AAwFhAW8AAQFhAXAAFwFhAXEABgFhAXIAAAFhAXMAIgFhAXQACgFhAXUADQFhAXYAFgFhAXcAAgFhAXgAAwFhAXkAGAFhAXoAAgFhAUEAAQFhAUIAEQFhAUMAAQFhAUQAAAOiAqACAgMSBwcACRkDAAoRBgYKEwAPDxMBBiMTCgcHGgMUASQFJRQHAwMKCgMmAQYYDxobFAAKBw8KBwMDAgkCAAAFGwACBwIHBgIDAQMIDAABKAkHBQURACkZASoAAAIrLAIALQcHBy4HLwkFCgMCMA0xAgMJAgACAQYKAQIBBQEACQIFAQEABQAODQ0GFQIBHBUGAgkCEAAAAAUyDzMMBQYINAUCAwUODg41AgMCAgIDBgICNgIBDAwMAQsLCwsLCx0CAAIAAAABABABBQICAQMCEgMMCwEBAQEBAQsLAQICAwICAgICAgIDAgIICAEICAgEBAQEBAQEBAQABAQABAQEBAAE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GiABQQA2AvADIAFCADcC6AMgAigC7AMiAyACKALoAyIERwRAIAMgBGsiBEEASA0FIAEgBBAeIgM2AuwDIAEgAzYC6AMgASADIARqNgLwAyACKALoAyIEIAIoAuwDIghHBEADQCADIAQoAgA2AgAgA0EEaiEDIARBBGoiBCAIRw0ACwsgASADNgLsAwsgASACKQL0AzcC9AMgASACKAKEBDYChAQgASACKQL8AzcC/AMgAUEANgLkAwsgBSABNgIAIAEgADYC5AMLIAZBAWohBiAFQQRqIgUgB0cNAAsLDwsQAgALUAACQAJAAkACQAJAIAIOBAQAAQIDCyAAIAEgAUEwahBDDwsgACABIAFBMGogAxBEDwsgACABIAFBMGoQQg8LECQACyAAIAEgAUEwaiADEEULcAIBfwF9IwBBEGsiBCQAIARBCGogACABQQJ0QdwlaigCACACEDZDAADAfyEFAkACQAJAIAQtAAxBAWsOAgABAgsgBCoCCCEFDAELIAQqAgggA5RDCtcjPJQhBQsgBEEQaiQAIAVDAAAAACAFIAVbGwt5AgF/AX0jAEEQayIDJAAgA0EIaiAAIAFBAnRB7CVqKAIAIAIQU0MAAMB/IQQCQAJAAkAgAy0ADEEBaw4CAAECCyADKgIIIQQMAQsgAyoCCEMAAAAAlEMK1yM8lCEECyADQRBqJAAgBEMAAAAAl0MAAAAAIAQgBFsbC1QAAkACQAJAAkACQCACDgQEAAECAwsgACABIAFBwgBqEEMPCyAAIAEgAUHCAGogAxBEDwsgACABIAFBwgBqEEIPCxAkAAsgACABIAFBwgBqIAMQRQsvACAAIAJFQQF0IgIgASADEGAgACACIAEQS5IgACACIAEgAxB/IAAgAiABEFKSkgvOAQIDfwJ9IwBBEGsiAyQAQQEhBCADQQhqIABB/ABqIgUgACABQQF0akH2AGoiAS8BABAfAkACQCADKgIIIgcgAioCACIGXARAIAcgB1sEQCACLQAEIQIMAgsgBiAGXCEECyACLQAEIQIgBEUNACADLQAMIAJB/wFxRg0BCyAFIAEgBiACEDkDQCAALQAAIgFBBHENASAAIAFBBHI6AAAgACgCECIBBEAgACABEQAACyAAQYCAgP4HNgKcASAAKALkAyIADQALCyADQRBqJAALzgECA38CfSMAQRBrIgMk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AWsOAgABAgsgBCoCCCEFDAELIAQqAgggA5RDCtcjPJQhBQsgBEEQaiQAIAVDAAAAACAFIAVbGwscACAAIAFBCCACpyACQiCIpyADpyADQiCIpxAVCwUAEFgACzkAIABFBEBBAA8LAn8gAUGAf3FBgL8DRiABQf8ATXJFBEBB/DtBGTYCAEF/DAELIAAgAToAAEEBCwvEAgACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCABQQlrDhIACgsMCgsCAwQFDAsMDAoLBwgJCyACIAIoAgAiAUEEajYCACAAIAEoAgA2AgAPCwALIAIgAigCACIBQQRqNgIAIAAgATIBADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATMBADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATAAADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATEAADcDAA8LAAsgAiACKAIAQQdqQXhxIgFBCGo2AgAgACABKwMAOQMADwsgACACIAMRAQALDwsgAiACKAIAIgFBBGo2AgAgACABNAIANwMADwsgAiACKAIAIgFBBGo2AgAgACABNQIANwMADwsgAiACKAIAQQdqQXhxIgFBCGo2AgAgACABKQMANwMAC84BAgN/An0jAEEQayIDJABBASEEIANBCGogAEH8AGoiBSAAIAFBAXRqQegAaiIBLwEAEB8CQAJAIAMqAggiByACKgIAIgZcBEAgByAHWwRAIAItAAQhAgwCCyAGIAZcIQQLIAItAAQhAiAERQ0AIAMtAAwgAkH/AXFGDQELIAUgASAGIAIQOQNAIAAtAAAiAUEEcQ0BIAAgAUEEcjoAACAAKAIQIgEEQCAAIAERAAALIABBgICA/gc2ApwBIAAoAuQDIgANAAsLIANBEGokAAtdAQR/IAAoAgAhAgNAIAIsAAAiAxBXBEBBfyEEIAAgAkEBaiICNgIAIAFBzJmz5gBNBH9BfyADQTBrIgMgAUEKbCIEaiADIARB/////wdzShsFIAQLIQEMAQsLIAELrhQCEn8BfiMAQdAAayIIJAAgCCABNgJMIAhBN2ohFyAIQThqIRQCQAJAAkACQANAIAEhDSAHIA5B/////wdzSg0BIAcgDmohDgJAAkACQCANIgctAAAiCQRAA0ACQAJAIAlB/wFxIgFFBEAgByEBDAELIAFBJUcNASAH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IQEgAEIANwIEIAAgATYCACABIAA2AgQgAkEQaiQAIAALGwEBfyAABEAgACgCACIBBEAgARAjCyAAECMLC0kBAn9BBBAeIQFBIBAeIgBBADYCHCAAQoCAgICAgIDAPzcCFCAAQgA3AgwgAEEAOgAIIABBAzYCBCAAQQA2AgAgASAANgIAIAELIAAgAkEFR0EAIAIbRQRAQbgwIAMgBBBJDwsgAyAEEHALIgEBfiABIAKtIAOtQiCGhCAEIAARFQAiBUIgiKckASAFpwuoAQEFfyAAKAJUIgMoAgAhBSADKAIEIgQgACgCFCAAKAIcIgdrIgYgBCAGSRsiBgRAIAUgByAGECsaIAMgAygCACAGaiIFNgIAIAMgAygCBCAGayIENgIECyAEIAIgAiAESxsiBARAIAUgASAEECsaIAMgAygCACAEaiIFNgIAIAMgAygCBCAEazYCBAsgBUEAOgAAIAAgACgCLCIBNgIcIAAgATYCFCACCwQAQgALBABBAAuKBQIGfgJ/IAEgASgCAEEHakF4cSIBQRBqNgIAIAAhCSABKQMAIQMgASkDCCEGIwBBIGsiCCQAAkAgBkL///////////8AgyIEQoCAgICAgMCAPH0gBEKAgICAgIDA/8MAfVQEQCAGQgSGIANCPIiEIQQgA0L//////////w+DIgNCgYCAgICAgIAIWgRAIARCgYCAgICAgIDAAHwhAgwCCyAEQoCAgICAgICAQH0hAiADQoCAgICAgICACFINASACIARCAYN8IQIMAQsgA1AgBEKAgICAgIDA//8AVCAEQoCAgICAgMD//wBRG0UEQCAGQgSGIANCPIiEQv////////8Dg0KAgICAgICA/P8AhCECDAELQoCAgICAgID4/wAhAiAEQv///////7//wwBWDQBCACECIARCMIinIgBBkfcASQ0AIAMhAiAGQv///////z+DQoCAgICAgMAAhCIFIQcCQCAAQYH3AGsiAUHAAHEEQCACIAFBQGqthiEHQgAhAgwBCyABRQ0AIAcgAa0iBIYgAkHAACABa62IhCEHIAIgBIYhAgsgCCACNwMQIAggBzcDGAJAQYH4ACAAayIAQcAAcQRAIAUgAEFAaq2IIQNCACEFDAELIABFDQAgBUHAACAAa62GIAMgAK0iAoiEIQMgBSACiCEFCyAIIAM3AwAgCCAF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ASAAKAIAIQAgASACQQFxBH8gASgCACAAaigCAAUgAAsRCwALYQECfyMAQRBrIgIkACABIAAoAgQiA0EBdWohASAAKAIAIQAgAiABIANBAXEEfyABKAIAIABqKAIABSAACxEBAEEQEB4iACACKQMINwMIIAAgAikDADcDACACQRBqJAAgAAtjAQJ/IwBBEGsiAyQAIAEgACgCBCIEQQF1aiEBIAAoAgAhACADIAEgAiAEQQFxBH8gASgCACAAaigCAAUgAAsRAwBBEBAeIgAgAykDCDcDCCAAIAMpAwA3AwAgA0EQaiQAIAALNwEBfyABIAAoAgQiA0EBdWohASAAKAIAIQAgASACIANBAXEEfyABKAIAIABqKAIABSAACxEEAAs5AQF/IAEgACgCBCIEQQF1aiEBIAAoAgAhACABIAIgAyAEQQFxBH8gASgCACAAaigCAAUgAAsRCAALCQAgASAAEQIACwUAQcM7Cw8AIAEgACgCAGogAjYCAAsNACABIAAoAgBqKAIACxgBAX9BEBAeIgBCADcDCCAAQQA2AgAgAAsYAQF/QRAQHiIAQgA3AwAgAEIANwMIIAALDABBMBAeQQBBMBAqCzcBAX8gASAAKAIEIgNBAXVqIQEgACgCACEAIAEgAiADQQFxBH8gASgCACAAaigCAAUgAAsRHgALBQBBvjsLIQAgACABKAIAIAEgASwAC0EASBtBuzsgAigCABAQNgIACyoBAX9BDBAeIgFBADoABCABIAAoAgA2AgggAEEANgIAIAFB2Cc2AgAgAQsFAEG7OwsFAEG4OwshACAAIAEoAgAgASABLAALQQBIG0GkOyACKAIAEBA2AgAL2AEBBH8jAEEgayIDJAAgASgCACIEQfD///8HSQRAAkACQCAEQQtPBEAgBEEPckEBaiIFEB4hBiADIAVBgICAgHhyNgIQIAMgBjYCCCADIAQ2AgwgBCAGaiEFDAELIAMgBDoAEyADQQhqIgYgBGohBSAERQ0BCyAGIAFBBGogBBArGgsgBUEAOgAAIAMgAjYCACADQRhqIANBCGogAyAAEQMAIAMoAhgQHSADKAIYIgAQBiADKAIAEAYgAywAE0EASARAIAMoAggQIwsgA0EgaiQAIAAPCxACAAsqAQF/QQwQHiIBQQA6AAQgASAAKAIANgIIIABBADYCACABQeAmNgIA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AkEIaiAIIAYQHyACIAcgAC8AABAfQQEhAyACKgIIIgogAioCACILXAR/IAogClsNAyALIAtcBSADC0UNAiACLQAMIAItAARHDQILIABBAmohAEEBIQMgBCEGQQEhBCAGRQ0ACyABLwB6IgBBB3FFBEAgBS0AekEHcUUNAgsgCCAAECAiCiAHIAUvAHoQICILWw0BIAogClsNACALIAtcDQELIAFBFGogBUEUakHoABArGiABQfwAaiAFQfwAahCgAQNAIAEtAAAiAEEEcQ0BIAEgAEEEcjoAACABKAIQIgAEQCABIAARAAALIAFBgICA/gc2ApwBIAEoAuQDIgENAAsLIAJBEGokAAvGAwEEfyMAQaAEayICJAAgACgCBCEBIABBADYCBCABBEAgASABKAIAKAIEEQAACyAAKAIIIQEgAEEANgIIIAEEQCABIAEoAgAoAgQRAAALAkAgACgCACIAKALoAyAAKALsA0YEQCAAKALkAw0BIAAgAkEYaiAAKAL0AxBcIgEpAgA3AgAgACABKAIQNgIQIAAgASkCCDcCCCAAQRRqIAFBFGpB6AAQKxogACABKQKMATcCjAEgACABKQKEATcChAEgACABKQJ8NwJ8IAEoApQBIQQgAUEANgKUASAAKAKUASEDIAAgBDYClAEgAwRAIAMQWwsgAEGYAWogAUGYAWpB0AIQKxogACgC6AMiAwRAIAAgAzYC7AMgAxAjCyAAIAEoAugDNgLoAyAAIAEoAuwDNgLsAyAAIAEoAvADNgLwAyABQQA2AvADIAFCADcC6AMgACABKQL8AzcC/AMgACABKQL0AzcC9AMgACABKAKEBDYChAQgASgClAEhACABQQA2ApQBIAAEQCAAEFsLIAJBoARqJAAPCyACQfAcNgIQIABBBUHYJSACQRBqECwQJAALIAJB5hE2AgAgAEEFQdglIAIQLBAkAAsLAEEMEB4gABCiAQsLAEEMEB5BABCiAQsNACAAKAIALQAIQQFxCwoAIAAoAgAoAhQLGQAgAUH/AXEEQBACAAsgACgCACgCEEEBcQsYACAAKAIAIgAgAC0ACEH+AXEgAXI6AAgLJgAgASAAKAIAIgAoAhRHBEAgACABNgIUIAAgACgCDEEBajYCDAsLkgEBAn8jAEEQayICJAAgACgCACEAIAFDAAAAAGAEQCABIAAqAhhcBEAgACABOAIYIAAgACgCDEEBajYCDAsgAkEQaiQADwsgAkGIFDYCACMAQRBrIgMkACADIAI2AgwCQCAARQRAQbgwQdglIAIQSRoMAQsgAEEAQQVB2CUgAiAAKAIEEQ0AGgsgA0EQaiQAECQACz8AIAFB/wFxRQRAIAIgACgCACIAKAIQIgFBAXFHBEAgACABQX5xIAJyNgIQIAAgACgCDEEBajYCDAsPCxACAAsL4CYjAEGACAuBHk9ubHkgbGVhZiBub2RlcyB3aXRoIGN1c3RvbSBtZWFzdXJlIGZ1bmN0aW9ucyBzaG91bGQgbWFudWFsbHkgbWFyayB0aGVtc2VsdmVzIGFzIGRpcnR5AGlzRGlydHkAbWFya0RpcnR5AGRlc3Ryb3kAc2V0RGlzcGxheQBnZXREaXNwbGF5AHNldEZsZXgALSsgICAwWDB4AC0wWCswWCAwWC0weCsweCAweABzZXRGbGV4R3JvdwBnZXRGbGV4R3JvdwBzZXRPdmVyZmxvdwBnZXRPdmVyZmxvdwBoYXNOZXdMYXlvdXQAY2FsY3VsYXRlTGF5b3V0AGdldENvbXB1dGVkTGF5b3V0AHVuc2lnbmVkIHNob3J0AGdldENoaWxkQ291bnQAdW5zaWduZWQgaW50AHNldEp1c3RpZnlDb250ZW50AGdldEp1c3RpZnlDb250ZW50AGF2YWlsYWJsZUhlaWdodCBpcyBpbmRlZmluaXRlIHNvIGhlaWdodFNpemluZ01vZGUgbXVzdCBiZSBTaXppbmdNb2RlOjpNYXhDb250ZW50AGF2YWlsYWJsZVdpZHRoIGlzIGluZGVmaW5pdGUgc28gd2lkdGhTaXppbmdNb2RlIG11c3QgYmUgU2l6aW5nTW9kZTo6TWF4Q29udGVudABzZXRBbGlnbkNvbnRlbnQAZ2V0QWxpZ25Db250ZW50AGdldFBhcmVudABpbXBsZW1lbnQAc2V0TWF4SGVpZ2h0UGVyY2VudABzZXRIZWlnaHRQZXJjZW50AHNldE1pbkhlaWdodFBlcmNlbnQAc2V0RmxleEJhc2lzUGVyY2VudABzZXRHYXBQZXJjZW50AHNldFBvc2l0aW9uUGVyY2VudABzZXRNYXJnaW5QZXJjZW50AHNldE1heFdpZHRoUGVyY2VudABzZXRXaWR0aFBlcmNlbnQAc2V0TWluV2lkdGhQZXJjZW50AHNldFBhZGRpbmdQZXJjZW50AGhhbmRsZS50eXBlKCkgPT0gU3R5bGVWYWx1ZUhhbmRsZTo6VHlwZTo6UG9pbnQgfHwgaGFuZGxlLnR5cGUoKSA9PSBTdHlsZVZhbHVlSGFuZGxlOjpUeXBlOjpQZXJjZW50AGNyZWF0ZURlZmF1bHQAdW5pdAByaWdodABoZWlnaHQAc2V0TWF4SGVpZ2h0AGdldE1heEhlaWdodABzZXRIZWlnaHQAZ2V0SGVpZ2h0AHNldE1pbkhlaWdodABnZXRNaW5IZWlnaHQAZ2V0Q29tcHV0ZWRIZWlnaHQAZ2V0Q29tcHV0ZWRSaWdodABsZWZ0AGdldENvbXB1dGVkTGVmdAByZXNldABfX2Rlc3RydWN0AGZsb2F0AHVpbnQ2NF90AHVzZVdlYkRlZmF1bHRzAHNldFVzZVdlYkRlZmF1bHRzAHNldEFsaWduSXRlbXMAZ2V0QWxpZ25JdGVtcwBzZXRGbGV4QmFzaXMAZ2V0RmxleEJhc2lzAENhbm5vdCBnZXQgbGF5b3V0IHByb3BlcnRpZXMgb2YgbXVsdGktZWRnZSBzaG9ydGhhbmRzAHNldFBvaW50U2NhbGVGYWN0b3IATWVhc3VyZUNhbGxiYWNrV3JhcHBlcgBEaXJ0aWVkQ2FsbGJhY2tXcmFwcGVyAENhbm5vdCByZXNldCBhIG5vZGUgc3RpbGwgYXR0YWNoZWQgdG8gYSBvd25lcgBzZXRCb3JkZXIAZ2V0Qm9yZGVyAGdldENvbXB1dGVkQm9yZGVyAGdldE51bWJlcgBoYW5kbGUudHlwZSgpID09IFN0eWxlVmFsdWVIYW5kbGU6OlR5cGU6Ok51bWJlcgB1bnNpZ25lZCBjaGFyAHRvcABnZXRDb21wdXRlZFRvcABzZXRGbGV4V3JhcABnZXRGbGV4V3JhcABzZXRHYXAAZ2V0R2FwACVwAHNldEhlaWdodEF1dG8Ac2V0RmxleEJhc2lzQXV0bwBzZXRQb3NpdGlvbkF1dG8Ac2V0TWFyZ2luQXV0bwBzZXRXaWR0aEF1dG8AU2NhbGUgZmFjdG9yIHNob3VsZCBub3QgYmUgbGVzcyB0aGFuIHplcm8Ac2V0QXNwZWN0UmF0aW8AZ2V0QXNwZWN0UmF0aW8Ac2V0UG9zaXRpb24AZ2V0UG9zaXRpb24Abm90aWZ5T25EZXN0cnVjdGlvbgBzZXRGbGV4RGlyZWN0aW9uAGdldEZsZXhEaXJlY3Rpb24Ac2V0RGlyZWN0aW9uAGdldERpcmVjdGlvbgBzZXRNYXJnaW4AZ2V0TWFyZ2luAGdldENvbXB1dGVkTWFyZ2luAG1hcmtMYXlvdXRTZWVuAG5hbgBib3R0b20AZ2V0Q29tcHV0ZWRCb3R0b20AYm9vbABlbXNjcmlwdGVuOjp2YWwAc2V0RmxleFNocmluawBnZXRGbGV4U2hyaW5rAHNldEFsd2F5c0Zvcm1zQ29udGFpbmluZ0Jsb2NrAE1lYXN1cmVDYWxsYmFjawBEaXJ0aWVkQ2FsbGJhY2sAZ2V0TGVuZ3RoAHdpZHRoAHNldE1heFdpZHRoAGdldE1heFdpZHRoAHNldFdpZHRoAGdldFdpZHRoAHNldE1pbldpZHRoAGdldE1pbldpZHRoAGdldENvbXB1dGVkV2lkdGgAcHVzaAAvaG9tZS9ydW5uZXIvd29yay95b2dhL3lvZ2EvamF2YXNjcmlwdC8uLi95b2dhL3N0eWxlL1NtYWxsVmFsdWVCdWZmZXIuaAAvaG9tZS9ydW5uZXIvd29yay95b2dhL3lvZ2EvamF2YXNjcmlwdC8uLi95b2dhL3N0eWxlL1N0eWxlVmFsdWVQb29sLmgAdW5zaWduZWQgbG9uZwBzZXRCb3hTaXppbmcAZ2V0Qm94U2l6aW5nAHN0ZDo6d3N0cmluZwBzdGQ6OnN0cmluZwBzdGQ6OnUxNnN0cmluZwBzdGQ6OnUzMnN0cmluZwBzZXRQYWRkaW5nAGdldFBhZGRpbmcAZ2V0Q29tcHV0ZWRQYWRkaW5nAFRyaWVkIHRvIGNvbnN0cnVjdCBZR05vZGUgd2l0aCBudWxsIGNvbmZpZwBBdHRlbXB0aW5nIHRvIGNvbnN0cnVjdCBOb2RlIHdpdGggbnVsbCBjb25maWcAY3JlYXRlV2l0aENvbmZpZwBpbmYAc2V0QWxpZ25TZWxmAGdldEFsaWduU2VsZgBTaXplAHZhbHVlAFZhbHVlAGNyZWF0ZQBtZWFzdXJlAHNldFBvc2l0aW9uVHlwZQBnZXRQb3NpdGlvblR5cGUAaXNSZWZlcmVuY2VCYXNlbGluZQBzZXRJc1JlZmVyZW5jZUJhc2VsaW5lAGNvcHlTdHlsZQBkb3VibGUATm9kZQBleHRlbmQAaW5zZXJ0Q2hpbGQAZ2V0Q2hpbGQAcmVtb3ZlQ2hpbGQAdm9pZABzZXRFeHBlcmltZW50YWxGZWF0dXJlRW5hYmxlZABpc0V4cGVyaW1lbnRhbEZlYXR1cmVFbmFibGVkAGRpcnRpZWQAQ2Fubm90IHJlc2V0IGEgbm9kZSB3aGljaCBzdGlsbCBoYXMgY2hpbGRyZW4gYXR0YWNoZWQAdW5zZXRNZWFzdXJlRnVuYwB1bnNldERpcnRpZWRGdW5jAHNldEVycmF0YQBnZXRFcnJhdGEATWVhc3VyZSBmdW5jdGlvbiByZXR1cm5lZCBhbiBpbnZhbGlkIGRpbWVuc2lvbiB0byBZb2dhOiBbd2lkdGg9JWYsIGhlaWdodD0lZl0ARXhwZWN0IGN1c3RvbSBiYXNlbGluZSBmdW5jdGlvbiB0byBub3QgcmV0dXJuIE5hTgBOQU4ASU5GAGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHNob3J0PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBzaG9ydD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBpbnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGZsb2F0PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1aW50OF90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQ4X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQxNl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQxNl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1aW50MzJfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50MzJfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8Y2hhcj4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgY2hhcj4Ac3RkOjpiYXNpY19zdHJpbmc8dW5zaWduZWQgY2hhcj4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8c2lnbmVk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";
		if (!ua(H)) {
			var va = H;
			H = h.locateFile ? h.locateFile(va, q) : q + va;
		}
		function wa() {
			var a = H;
			try {
				if (a == H && w) return new Uint8Array(w);
				if (ua(a)) try {
					var b = xa(a.slice(37)), c = new Uint8Array(b.length);
					for (a = 0; a < b.length; ++a) c[a] = b.charCodeAt(a);
					var d = c;
				} catch (f) {
					throw Error("Converting base64 string to bytes failed.");
				}
				else d = void 0;
				var e = d;
				if (e) return e;
				throw "both async and sync fetching of the wasm failed";
			} catch (f) {
				x(f);
			}
		}
		function ya() {
			return w || "function" != typeof fetch ? Promise.resolve().then(function() {
				return wa();
			}) : fetch(H, { credentials: "same-origin" }).then(function(a) {
				if (!a.ok) throw "failed to load wasm binary file at '" + H + "'";
				return a.arrayBuffer();
			}).catch(function() {
				return wa();
			});
		}
		function za(a) {
			for (; 0 < a.length;) a.shift()(h);
		}
		function Aa(a) {
			if (void 0 === a) return "_unknown";
			a = a.replace(/[^a-zA-Z0-9_]/g, "$");
			var b = a.charCodeAt(0);
			return 48 <= b && 57 >= b ? "_" + a : a;
		}
		function Ba(a, b) {
			a = Aa(a);
			return function() {
				return b.apply(this, arguments);
			};
		}
		var J = [
			{},
			{ value: void 0 },
			{ value: null },
			{ value: !0 },
			{ value: !1 }
		], Ca = [];
		function Da(a) {
			var b = Error, c = Ba(a, function(d) {
				this.name = a;
				this.message = d;
				d = Error(d).stack;
				void 0 !== d && (this.stack = this.toString() + "\n" + d.replace(/^Error(:[^\n]*)?\n/, ""));
			});
			c.prototype = Object.create(b.prototype);
			c.prototype.constructor = c;
			c.prototype.toString = function() {
				return void 0 === this.message ? this.name : this.name + ": " + this.message;
			};
			return c;
		}
		var K = void 0;
		function L(a) {
			throw new K(a);
		}
		var M = (a) => {
			a || L("Cannot use deleted val. handle = " + a);
			return J[a].value;
		}, Ea = (a) => {
			switch (a) {
				case void 0: return 1;
				case null: return 2;
				case !0: return 3;
				case !1: return 4;
				default:
					var b = Ca.length ? Ca.pop() : J.length;
					J[b] = {
						ga: 1,
						value: a
					};
					return b;
			}
		}, Fa = void 0, Ga = void 0;
		function N(a) {
			for (var b = ""; A[a];) b += Ga[A[a++]];
			return b;
		}
		var O = [];
		function Ha() {
			for (; O.length;) {
				var a = O.pop();
				a.M.$ = !1;
				a["delete"]();
			}
		}
		var P = void 0, Q = {};
		function Ia(a, b) {
			for (void 0 === b && L("ptr should not be undefined"); a.R;) b = a.ba(b), a = a.R;
			return b;
		}
		var R = {};
		function Ja(a) {
			a = Ka(a);
			var b = N(a);
			S(a);
			return b;
		}
		function La(a, b) {
			var c = R[a];
			void 0 === c && L(b + " has unknown type " + Ja(a));
			return c;
		}
		function Ma() {}
		var Na = !1;
		function Oa(a) {
			--a.count.value;
			0 === a.count.value && (a.T ? a.U.W(a.T) : a.P.N.W(a.O));
		}
		function Pa(a, b, c) {
			if (b === c) return a;
			if (void 0 === c.R) return null;
			a = Pa(a, b, c.R);
			return null === a ? null : c.na(a);
		}
		var Qa = {};
		function Ra(a, b) {
			b = Ia(a, b);
			return Q[b];
		}
		var Sa = void 0;
		function Ta(a) {
			throw new Sa(a);
		}
		function Ua(a, b) {
			b.P && b.O || Ta("makeClassHandle requires ptr and ptrType");
			!!b.U !== !!b.T && Ta("Both smartPtrType and smartPtr must be specified");
			b.count = { value: 1 };
			return T(Object.create(a, { M: { value: b } }));
		}
		function T(a) {
			if ("undefined" === typeof FinalizationRegistry) return T = (b) => b, a;
			Na = new FinalizationRegistry((b) => {
				Oa(b.M);
			});
			T = (b) => {
				var c = b.M;
				c.T && Na.register(b, { M: c }, b);
				return b;
			};
			Ma = (b) => {
				Na.unregister(b);
			};
			return T(a);
		}
		var Va = {};
		function Wa(a) {
			for (; a.length;) {
				var b = a.pop();
				a.pop()(b);
			}
		}
		function Xa(a) {
			return this.fromWireType(D[a >> 2]);
		}
		var U = {}, Ya = {};
		function V(a, b, c) {
			function d(k) {
				k = c(k);
				k.length !== a.length && Ta("Mismatched type converter count");
				for (var m = 0; m < a.length; ++m) W(a[m], k[m]);
			}
			a.forEach(function(k) {
				Ya[k] = b;
			});
			var e = Array(b.length), f = [], g = 0;
			b.forEach((k, m) => {
				R.hasOwnProperty(k) ? e[m] = R[k] : (f.push(k), U.hasOwnProperty(k) || (U[k] = []), U[k].push(() => {
					e[m] = R[k];
					++g;
					g === f.length && d(e);
				}));
			});
			0 === f.length && d(e);
		}
		function Za(a) {
			switch (a) {
				case 1: return 0;
				case 2: return 1;
				case 4: return 2;
				case 8: return 3;
				default: throw new TypeError("Unknown type size: " + a);
			}
		}
		function W(a, b, c = {}) {
			if (!("argPackAdvance" in b)) throw new TypeError("registerType registeredInstance requires argPackAdvance");
			var d = b.name;
			a || L("type \"" + d + "\" must have a positive integer typeid pointer");
			if (R.hasOwnProperty(a)) {
				if (c.ua) return;
				L("Cannot register type '" + d + "' twice");
			}
			R[a] = b;
			delete Ya[a];
			U.hasOwnProperty(a) && (b = U[a], delete U[a], b.forEach((e) => e()));
		}
		function $a(a) {
			L(a.M.P.N.name + " instance already deleted");
		}
		function X() {}
		function ab(a, b, c) {
			if (void 0 === a[b].S) {
				var d = a[b];
				a[b] = function() {
					a[b].S.hasOwnProperty(arguments.length) || L("Function '" + c + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + a[b].S + ")!");
					return a[b].S[arguments.length].apply(this, arguments);
				};
				a[b].S = [];
				a[b].S[d.Z] = d;
			}
		}
		function bb(a, b) {
			h.hasOwnProperty(a) ? (L("Cannot register public name '" + a + "' twice"), ab(h, a, a), h.hasOwnProperty(void 0) && L("Cannot register multiple overloads of a function with the same number of arguments (undefined)!"), h[a].S[void 0] = b) : h[a] = b;
		}
		function cb(a, b, c, d, e, f, g, k) {
			this.name = a;
			this.constructor = b;
			this.X = c;
			this.W = d;
			this.R = e;
			this.pa = f;
			this.ba = g;
			this.na = k;
			this.ja = [];
		}
		function db(a, b, c) {
			for (; b !== c;) b.ba || L("Expected null or instance of " + c.name + ", got an instance of " + b.name), a = b.ba(a), b = b.R;
			return a;
		}
		function eb(a, b) {
			if (null === b) return this.ea && L("null is not a valid " + this.name), 0;
			b.M || L("Cannot pass \"" + fb(b) + "\" as a " + this.name);
			b.M.O || L("Cannot pass deleted object as a pointer of type " + this.name);
			return db(b.M.O, b.M.P.N, this.N);
		}
		function gb(a, b) {
			if (null === b) {
				this.ea && L("null is not a valid " + this.name);
				if (this.da) {
					var c = this.fa();
					null !== a && a.push(this.W, c);
					return c;
				}
				return 0;
			}
			b.M || L("Cannot pass \"" + fb(b) + "\" as a " + this.name);
			b.M.O || L("Cannot pass deleted object as a pointer of type " + this.name);
			!this.ca && b.M.P.ca && L("Cannot convert argument of type " + (b.M.U ? b.M.U.name : b.M.P.name) + " to parameter type " + this.name);
			c = db(b.M.O, b.M.P.N, this.N);
			if (this.da) switch (void 0 === b.M.T && L("Passing raw pointer to smart pointer is illegal"), this.Ba) {
				case 0:
					b.M.U === this ? c = b.M.T : L("Cannot convert argument of type " + (b.M.U ? b.M.U.name : b.M.P.name) + " to parameter type " + this.name);
					break;
				case 1:
					c = b.M.T;
					break;
				case 2:
					if (b.M.U === this) c = b.M.T;
					else {
						var d = b.clone();
						c = this.xa(c, Ea(function() {
							d["delete"]();
						}));
						null !== a && a.push(this.W, c);
					}
					break;
				default: L("Unsupporting sharing policy");
			}
			return c;
		}
		function hb(a, b) {
			if (null === b) return this.ea && L("null is not a valid " + this.name), 0;
			b.M || L("Cannot pass \"" + fb(b) + "\" as a " + this.name);
			b.M.O || L("Cannot pass deleted object as a pointer of type " + this.name);
			b.M.P.ca && L("Cannot convert argument of type " + b.M.P.name + " to parameter type " + this.name);
			return db(b.M.O, b.M.P.N, this.N);
		}
		function Y(a, b, c, d) {
			this.name = a;
			this.N = b;
			this.ea = c;
			this.ca = d;
			this.da = !1;
			this.W = this.xa = this.fa = this.ka = this.Ba = this.wa = void 0;
			void 0 !== b.R ? this.toWireType = gb : (this.toWireType = d ? eb : hb, this.V = null);
		}
		function ib(a, b) {
			h.hasOwnProperty(a) || Ta("Replacing nonexistant public symbol");
			h[a] = b;
			h[a].Z = void 0;
		}
		function jb(a, b) {
			var c = [];
			return function() {
				c.length = 0;
				Object.assign(c, arguments);
				if (a.includes("j")) {
					var d = h["dynCall_" + a];
					d = c && c.length ? d.apply(null, [b].concat(c)) : d.call(null, b);
				} else d = oa.get(b).apply(null, c);
				return d;
			};
		}
		function Z(a, b) {
			a = N(a);
			var c = a.includes("j") ? jb(a, b) : oa.get(b);
			"function" != typeof c && L("unknown function pointer with signature " + a + ": " + b);
			return c;
		}
		var mb = void 0;
		function nb(a, b) {
			function c(f) {
				e[f] || R[f] || (Ya[f] ? Ya[f].forEach(c) : (d.push(f), e[f] = !0));
			}
			var d = [], e = {};
			b.forEach(c);
			throw new mb(a + ": " + d.map(Ja).join([", "]));
		}
		function ob(a, b, c, d, e) {
			var f = b.length;
			2 > f && L("argTypes array size mismatch! Must at least get return value and 'this' types!");
			var g = null !== b[1] && null !== c, k = !1;
			for (c = 1; c < b.length; ++c) if (null !== b[c] && void 0 === b[c].V) {
				k = !0;
				break;
			}
			var m = "void" !== b[0].name, l = f - 2, n = Array(l), p = [], r = [];
			return function() {
				arguments.length !== l && L("function " + a + " called with " + arguments.length + " arguments, expected " + l + " args!");
				r.length = 0;
				p.length = g ? 2 : 1;
				p[0] = e;
				if (g) {
					var u = b[1].toWireType(r, this);
					p[1] = u;
				}
				for (var t = 0; t < l; ++t) n[t] = b[t + 2].toWireType(r, arguments[t]), p.push(n[t]);
				t = d.apply(null, p);
				if (k) Wa(r);
				else for (var y = g ? 1 : 2; y < b.length; y++) {
					var B = 1 === y ? u : n[y - 2];
					null !== b[y].V && b[y].V(B);
				}
				u = m ? b[0].fromWireType(t) : void 0;
				return u;
			};
		}
		function pb(a, b) {
			for (var c = [], d = 0; d < a; d++) c.push(E[b + 4 * d >> 2]);
			return c;
		}
		function qb(a) {
			4 < a && 0 === --J[a].ga && (J[a] = void 0, Ca.push(a));
		}
		function fb(a) {
			if (null === a) return "null";
			var b = typeof a;
			return "object" === b || "array" === b || "function" === b ? a.toString() : "" + a;
		}
		function rb(a, b) {
			switch (b) {
				case 2: return function(c) {
					return this.fromWireType(la[c >> 2]);
				};
				case 3: return function(c) {
					return this.fromWireType(ma[c >> 3]);
				};
				default: throw new TypeError("Unknown float type: " + a);
			}
		}
		function sb(a, b, c) {
			switch (b) {
				case 0: return c ? function(d) {
					return ja[d];
				} : function(d) {
					return A[d];
				};
				case 1: return c ? function(d) {
					return C[d >> 1];
				} : function(d) {
					return ka[d >> 1];
				};
				case 2: return c ? function(d) {
					return D[d >> 2];
				} : function(d) {
					return E[d >> 2];
				};
				default: throw new TypeError("Unknown integer type: " + a);
			}
		}
		function tb(a, b) {
			for (var c = "", d = 0; !(d >= b / 2); ++d) {
				var e = C[a + 2 * d >> 1];
				if (0 == e) break;
				c += String.fromCharCode(e);
			}
			return c;
		}
		function ub(a, b, c) {
			void 0 === c && (c = 2147483647);
			if (2 > c) return 0;
			c -= 2;
			var d = b;
			c = c < 2 * a.length ? c / 2 : a.length;
			for (var e = 0; e < c; ++e) C[b >> 1] = a.charCodeAt(e), b += 2;
			C[b >> 1] = 0;
			return b - d;
		}
		function vb(a) {
			return 2 * a.length;
		}
		function wb(a, b) {
			for (var c = 0, d = ""; !(c >= b / 4);) {
				var e = D[a + 4 * c >> 2];
				if (0 == e) break;
				++c;
				65536 <= e ? (e -= 65536, d += String.fromCharCode(55296 | e >> 10, 56320 | e & 1023)) : d += String.fromCharCode(e);
			}
			return d;
		}
		function xb(a, b, c) {
			void 0 === c && (c = 2147483647);
			if (4 > c) return 0;
			var d = b;
			c = d + c - 4;
			for (var e = 0; e < a.length; ++e) {
				var f = a.charCodeAt(e);
				if (55296 <= f && 57343 >= f) {
					var g = a.charCodeAt(++e);
					f = 65536 + ((f & 1023) << 10) | g & 1023;
				}
				D[b >> 2] = f;
				b += 4;
				if (b + 4 > c) break;
			}
			D[b >> 2] = 0;
			return b - d;
		}
		function yb(a) {
			for (var b = 0, c = 0; c < a.length; ++c) {
				var d = a.charCodeAt(c);
				55296 <= d && 57343 >= d && ++c;
				b += 4;
			}
			return b;
		}
		var zb = {};
		function Ab(a) {
			var b = zb[a];
			return void 0 === b ? N(a) : b;
		}
		var Bb = [];
		function Cb(a) {
			var b = Bb.length;
			Bb.push(a);
			return b;
		}
		function Db(a, b) {
			for (var c = Array(a), d = 0; d < a; ++d) c[d] = La(E[b + 4 * d >> 2], "parameter " + d);
			return c;
		}
		var Eb = [], Fb = [
			null,
			[],
			[]
		];
		K = h.BindingError = Da("BindingError");
		h.count_emval_handles = function() {
			for (var a = 0, b = 5; b < J.length; ++b) void 0 !== J[b] && ++a;
			return a;
		};
		h.get_first_emval = function() {
			for (var a = 5; a < J.length; ++a) if (void 0 !== J[a]) return J[a];
			return null;
		};
		Fa = h.PureVirtualError = Da("PureVirtualError");
		for (var Gb = Array(256), Hb = 0; 256 > Hb; ++Hb) Gb[Hb] = String.fromCharCode(Hb);
		Ga = Gb;
		h.getInheritedInstanceCount = function() {
			return Object.keys(Q).length;
		};
		h.getLiveInheritedInstances = function() {
			var a = [], b;
			for (b in Q) Q.hasOwnProperty(b) && a.push(Q[b]);
			return a;
		};
		h.flushPendingDeletes = Ha;
		h.setDelayFunction = function(a) {
			P = a;
			O.length && P && P(Ha);
		};
		Sa = h.InternalError = Da("InternalError");
		X.prototype.isAliasOf = function(a) {
			if (!(this instanceof X && a instanceof X)) return !1;
			var b = this.M.P.N, c = this.M.O, d = a.M.P.N;
			for (a = a.M.O; b.R;) c = b.ba(c), b = b.R;
			for (; d.R;) a = d.ba(a), d = d.R;
			return b === d && c === a;
		};
		X.prototype.clone = function() {
			this.M.O || $a(this);
			if (this.M.aa) return this.M.count.value += 1, this;
			var a = T, b = Object, c = b.create, d = Object.getPrototypeOf(this), e = this.M;
			a = a(c.call(b, d, { M: { value: {
				count: e.count,
				$: e.$,
				aa: e.aa,
				O: e.O,
				P: e.P,
				T: e.T,
				U: e.U
			} } }));
			a.M.count.value += 1;
			a.M.$ = !1;
			return a;
		};
		X.prototype["delete"] = function() {
			this.M.O || $a(this);
			this.M.$ && !this.M.aa && L("Object already scheduled for deletion");
			Ma(this);
			Oa(this.M);
			this.M.aa || (this.M.T = void 0, this.M.O = void 0);
		};
		X.prototype.isDeleted = function() {
			return !this.M.O;
		};
		X.prototype.deleteLater = function() {
			this.M.O || $a(this);
			this.M.$ && !this.M.aa && L("Object already scheduled for deletion");
			O.push(this);
			1 === O.length && P && P(Ha);
			this.M.$ = !0;
			return this;
		};
		Y.prototype.qa = function(a) {
			this.ka && (a = this.ka(a));
			return a;
		};
		Y.prototype.ha = function(a) {
			this.W && this.W(a);
		};
		Y.prototype.argPackAdvance = 8;
		Y.prototype.readValueFromPointer = Xa;
		Y.prototype.deleteObject = function(a) {
			if (null !== a) a["delete"]();
		};
		Y.prototype.fromWireType = function(a) {
			function b() {
				return this.da ? Ua(this.N.X, {
					P: this.wa,
					O: c,
					U: this,
					T: a
				}) : Ua(this.N.X, {
					P: this,
					O: a
				});
			}
			var c = this.qa(a);
			if (!c) return this.ha(a), null;
			var d = Ra(this.N, c);
			if (void 0 !== d) {
				if (0 === d.M.count.value) return d.M.O = c, d.M.T = a, d.clone();
				d = d.clone();
				this.ha(a);
				return d;
			}
			d = this.N.pa(c);
			d = Qa[d];
			if (!d) return b.call(this);
			d = this.ca ? d.la : d.pointerType;
			var e = Pa(c, this.N, d.N);
			return null === e ? b.call(this) : this.da ? Ua(d.N.X, {
				P: d,
				O: e,
				U: this,
				T: a
			}) : Ua(d.N.X, {
				P: d,
				O: e
			});
		};
		mb = h.UnboundTypeError = Da("UnboundTypeError");
		var xa = "function" == typeof atob ? atob : function(a) {
			var b = "", c = 0;
			a = a.replace(/[^A-Za-z0-9\+\/=]/g, "");
			do {
				var d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(c++));
				var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(c++));
				var f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(c++));
				var g = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(c++));
				d = d << 2 | e >> 4;
				e = (e & 15) << 4 | f >> 2;
				var k = (f & 3) << 6 | g;
				b += String.fromCharCode(d);
				64 !== f && (b += String.fromCharCode(e));
				64 !== g && (b += String.fromCharCode(k));
			} while (c < a.length);
			return b;
		}, Jb = {
			l: function(a, b, c, d) {
				x("Assertion failed: " + (a ? z(A, a) : "") + ", at: " + [
					b ? b ? z(A, b) : "" : "unknown filename",
					c,
					d ? d ? z(A, d) : "" : "unknown function"
				]);
			},
			q: function(a, b, c) {
				a = N(a);
				b = La(b, "wrapper");
				c = M(c);
				var d = [].slice, e = b.N, f = e.X, g = e.R.X, k = e.R.constructor;
				a = Ba(a, function() {
					e.R.ja.forEach(function(l) {
						if (this[l] === g[l]) throw new Fa("Pure virtual function " + l + " must be implemented in JavaScript");
					}.bind(this));
					Object.defineProperty(this, "__parent", { value: f });
					this.__construct.apply(this, d.call(arguments));
				});
				f.__construct = function() {
					this === f && L("Pass correct 'this' to __construct");
					var l = k.implement.apply(void 0, [this].concat(d.call(arguments)));
					Ma(l);
					var n = l.M;
					l.notifyOnDestruction();
					n.aa = !0;
					Object.defineProperties(this, { M: { value: n } });
					T(this);
					l = n.O;
					l = Ia(e, l);
					Q.hasOwnProperty(l) ? L("Tried to register registered instance: " + l) : Q[l] = this;
				};
				f.__destruct = function() {
					this === f && L("Pass correct 'this' to __destruct");
					Ma(this);
					var l = this.M.O;
					l = Ia(e, l);
					Q.hasOwnProperty(l) ? delete Q[l] : L("Tried to unregister unregistered instance: " + l);
				};
				a.prototype = Object.create(f);
				for (var m in c) a.prototype[m] = c[m];
				return Ea(a);
			},
			j: function(a) {
				var b = Va[a];
				delete Va[a];
				var c = b.fa, d = b.W, e = b.ia, f = e.map((g) => g.ta).concat(e.map((g) => g.za));
				V([a], f, (g) => {
					var k = {};
					e.forEach((m, l) => {
						var n = g[l], p = m.ra, r = m.sa, u = g[l + e.length], t = m.ya, y = m.Aa;
						k[m.oa] = {
							read: (B) => n.fromWireType(p(r, B)),
							write: (B, ba) => {
								var I = [];
								t(y, B, u.toWireType(I, ba));
								Wa(I);
							}
						};
					});
					return [{
						name: b.name,
						fromWireType: function(m) {
							var l = {}, n;
							for (n in k) l[n] = k[n].read(m);
							d(m);
							return l;
						},
						toWireType: function(m, l) {
							for (var n in k) if (!(n in l)) throw new TypeError("Missing field:  \"" + n + "\"");
							var p = c();
							for (n in k) k[n].write(p, l[n]);
							null !== m && m.push(d, p);
							return p;
						},
						argPackAdvance: 8,
						readValueFromPointer: Xa,
						V: d
					}];
				});
			},
			v: function() {},
			B: function(a, b, c, d, e) {
				var f = Za(c);
				b = N(b);
				W(a, {
					name: b,
					fromWireType: function(g) {
						return !!g;
					},
					toWireType: function(g, k) {
						return k ? d : e;
					},
					argPackAdvance: 8,
					readValueFromPointer: function(g) {
						if (1 === c) var k = ja;
						else if (2 === c) k = C;
						else if (4 === c) k = D;
						else throw new TypeError("Unknown boolean type size: " + b);
						return this.fromWireType(k[g >> f]);
					},
					V: null
				});
			},
			f: function(a, b, c, d, e, f, g, k, m, l, n, p, r) {
				n = N(n);
				f = Z(e, f);
				k && (k = Z(g, k));
				l && (l = Z(m, l));
				r = Z(p, r);
				var u = Aa(n);
				bb(u, function() {
					nb("Cannot construct " + n + " due to unbound types", [d]);
				});
				V([
					a,
					b,
					c
				], d ? [d] : [], function(t) {
					t = t[0];
					if (d) {
						var y = t.N;
						var B = y.X;
					} else B = X.prototype;
					t = Ba(u, function() {
						if (Object.getPrototypeOf(this) !== ba) throw new K("Use 'new' to construct " + n);
						if (void 0 === I.Y) throw new K(n + " has no accessible constructor");
						var kb = I.Y[arguments.length];
						if (void 0 === kb) throw new K("Tried to invoke ctor of " + n + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(I.Y).toString() + ") parameters instead!");
						return kb.apply(this, arguments);
					});
					var ba = Object.create(B, { constructor: { value: t } });
					t.prototype = ba;
					var I = new cb(n, t, ba, r, y, f, k, l);
					y = new Y(n, I, !0, !1);
					B = new Y(n + "*", I, !1, !1);
					var lb = new Y(n + " const*", I, !1, !0);
					Qa[a] = {
						pointerType: B,
						la: lb
					};
					ib(u, t);
					return [
						y,
						B,
						lb
					];
				});
			},
			d: function(a, b, c, d, e, f, g) {
				var k = pb(c, d);
				b = N(b);
				f = Z(e, f);
				V([], [a], function(m) {
					function l() {
						nb("Cannot call " + n + " due to unbound types", k);
					}
					m = m[0];
					var n = m.name + "." + b;
					b.startsWith("@@") && (b = Symbol[b.substring(2)]);
					var p = m.N.constructor;
					void 0 === p[b] ? (l.Z = c - 1, p[b] = l) : (ab(p, b, n), p[b].S[c - 1] = l);
					V([], k, function(r) {
						r = ob(n, [r[0], null].concat(r.slice(1)), null, f, g);
						void 0 === p[b].S ? (r.Z = c - 1, p[b] = r) : p[b].S[c - 1] = r;
						return [];
					});
					return [];
				});
			},
			p: function(a, b, c, d, e, f) {
				0 < b || x();
				var g = pb(b, c);
				e = Z(d, e);
				V([], [a], function(k) {
					k = k[0];
					var m = "constructor " + k.name;
					void 0 === k.N.Y && (k.N.Y = []);
					if (void 0 !== k.N.Y[b - 1]) throw new K("Cannot register multiple constructors with identical number of parameters (" + (b - 1) + ") for class '" + k.name + "'! Overload resolution is currently only performed using the parameter count, not actual type info!");
					k.N.Y[b - 1] = () => {
						nb("Cannot construct " + k.name + " due to unbound types", g);
					};
					V([], g, function(l) {
						l.splice(1, 0, null);
						k.N.Y[b - 1] = ob(m, l, null, e, f);
						return [];
					});
					return [];
				});
			},
			a: function(a, b, c, d, e, f, g, k) {
				var m = pb(c, d);
				b = N(b);
				f = Z(e, f);
				V([], [a], function(l) {
					function n() {
						nb("Cannot call " + p + " due to unbound types", m);
					}
					l = l[0];
					var p = l.name + "." + b;
					b.startsWith("@@") && (b = Symbol[b.substring(2)]);
					k && l.N.ja.push(b);
					var r = l.N.X, u = r[b];
					void 0 === u || void 0 === u.S && u.className !== l.name && u.Z === c - 2 ? (n.Z = c - 2, n.className = l.name, r[b] = n) : (ab(r, b, p), r[b].S[c - 2] = n);
					V([], m, function(t) {
						t = ob(p, t, l, f, g);
						void 0 === r[b].S ? (t.Z = c - 2, r[b] = t) : r[b].S[c - 2] = t;
						return [];
					});
					return [];
				});
			},
			A: function(a, b) {
				b = N(b);
				W(a, {
					name: b,
					fromWireType: function(c) {
						var d = M(c);
						qb(c);
						return d;
					},
					toWireType: function(c, d) {
						return Ea(d);
					},
					argPackAdvance: 8,
					readValueFromPointer: Xa,
					V: null
				});
			},
			n: function(a, b, c) {
				c = Za(c);
				b = N(b);
				W(a, {
					name: b,
					fromWireType: function(d) {
						return d;
					},
					toWireType: function(d, e) {
						return e;
					},
					argPackAdvance: 8,
					readValueFromPointer: rb(b, c),
					V: null
				});
			},
			e: function(a, b, c, d, e) {
				b = N(b);
				-1 === e && (e = 4294967295);
				e = Za(c);
				var f = (k) => k;
				if (0 === d) {
					var g = 32 - 8 * c;
					f = (k) => k << g >>> g;
				}
				c = b.includes("unsigned") ? function(k, m) {
					return m >>> 0;
				} : function(k, m) {
					return m;
				};
				W(a, {
					name: b,
					fromWireType: f,
					toWireType: c,
					argPackAdvance: 8,
					readValueFromPointer: sb(b, e, 0 !== d),
					V: null
				});
			},
			b: function(a, b, c) {
				function d(f) {
					f >>= 2;
					var g = E;
					return new e(ia, g[f + 1], g[f]);
				}
				var e = [
					Int8Array,
					Uint8Array,
					Int16Array,
					Uint16Array,
					Int32Array,
					Uint32Array,
					Float32Array,
					Float64Array
				][b];
				c = N(c);
				W(a, {
					name: c,
					fromWireType: d,
					argPackAdvance: 8,
					readValueFromPointer: d
				}, { ua: !0 });
			},
			o: function(a, b) {
				b = N(b);
				var c = "std::string" === b;
				W(a, {
					name: b,
					fromWireType: function(d) {
						var e = E[d >> 2], f = d + 4;
						if (c) for (var g = f, k = 0; k <= e; ++k) {
							var m = f + k;
							if (k == e || 0 == A[m]) {
								g = g ? z(A, g, m - g) : "";
								if (void 0 === l) var l = g;
								else l += String.fromCharCode(0), l += g;
								g = m + 1;
							}
						}
						else {
							l = Array(e);
							for (k = 0; k < e; ++k) l[k] = String.fromCharCode(A[f + k]);
							l = l.join("");
						}
						S(d);
						return l;
					},
					toWireType: function(d, e) {
						e instanceof ArrayBuffer && (e = new Uint8Array(e));
						var f, g = "string" == typeof e;
						g || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Int8Array || L("Cannot pass non-string to std::string");
						if (c && g) {
							var k = 0;
							for (f = 0; f < e.length; ++f) {
								var m = e.charCodeAt(f);
								127 >= m ? k++ : 2047 >= m ? k += 2 : 55296 <= m && 57343 >= m ? (k += 4, ++f) : k += 3;
							}
							f = k;
						} else f = e.length;
						k = Ib(4 + f + 1);
						m = k + 4;
						E[k >> 2] = f;
						if (c && g) {
							if (g = m, m = f + 1, f = A, 0 < m) {
								m = g + m - 1;
								for (var l = 0; l < e.length; ++l) {
									var n = e.charCodeAt(l);
									if (55296 <= n && 57343 >= n) {
										var p = e.charCodeAt(++l);
										n = 65536 + ((n & 1023) << 10) | p & 1023;
									}
									if (127 >= n) {
										if (g >= m) break;
										f[g++] = n;
									} else {
										if (2047 >= n) {
											if (g + 1 >= m) break;
											f[g++] = 192 | n >> 6;
										} else {
											if (65535 >= n) {
												if (g + 2 >= m) break;
												f[g++] = 224 | n >> 12;
											} else {
												if (g + 3 >= m) break;
												f[g++] = 240 | n >> 18;
												f[g++] = 128 | n >> 12 & 63;
											}
											f[g++] = 128 | n >> 6 & 63;
										}
										f[g++] = 128 | n & 63;
									}
								}
								f[g] = 0;
							}
						} else if (g) for (g = 0; g < f; ++g) l = e.charCodeAt(g), 255 < l && (S(m), L("String has UTF-16 code units that do not fit in 8 bits")), A[m + g] = l;
						else for (g = 0; g < f; ++g) A[m + g] = e[g];
						null !== d && d.push(S, k);
						return k;
					},
					argPackAdvance: 8,
					readValueFromPointer: Xa,
					V: function(d) {
						S(d);
					}
				});
			},
			i: function(a, b, c) {
				c = N(c);
				if (2 === b) {
					var d = tb;
					var e = ub;
					var f = vb;
					var g = () => ka;
					var k = 1;
				} else 4 === b && (d = wb, e = xb, f = yb, g = () => E, k = 2);
				W(a, {
					name: c,
					fromWireType: function(m) {
						for (var l = E[m >> 2], n = g(), p, r = m + 4, u = 0; u <= l; ++u) {
							var t = m + 4 + u * b;
							if (u == l || 0 == n[t >> k]) r = d(r, t - r), void 0 === p ? p = r : (p += String.fromCharCode(0), p += r), r = t + b;
						}
						S(m);
						return p;
					},
					toWireType: function(m, l) {
						"string" != typeof l && L("Cannot pass non-string to C++ string type " + c);
						var n = f(l), p = Ib(4 + n + b);
						E[p >> 2] = n >> k;
						e(l, p + 4, n + b);
						null !== m && m.push(S, p);
						return p;
					},
					argPackAdvance: 8,
					readValueFromPointer: Xa,
					V: function(m) {
						S(m);
					}
				});
			},
			k: function(a, b, c, d, e, f) {
				Va[a] = {
					name: N(b),
					fa: Z(c, d),
					W: Z(e, f),
					ia: []
				};
			},
			h: function(a, b, c, d, e, f, g, k, m, l) {
				Va[a].ia.push({
					oa: N(b),
					ta: c,
					ra: Z(d, e),
					sa: f,
					za: g,
					ya: Z(k, m),
					Aa: l
				});
			},
			C: function(a, b) {
				b = N(b);
				W(a, {
					va: !0,
					name: b,
					argPackAdvance: 0,
					fromWireType: function() {},
					toWireType: function() {}
				});
			},
			s: function(a, b, c, d, e) {
				a = Bb[a];
				b = M(b);
				c = Ab(c);
				var f = [];
				E[d >> 2] = Ea(f);
				return a(b, c, f, e);
			},
			t: function(a, b, c, d) {
				a = Bb[a];
				b = M(b);
				c = Ab(c);
				a(b, c, null, d);
			},
			g: qb,
			m: function(a, b) {
				var c = Db(a, b), d = c[0];
				b = d.name + "_$" + c.slice(1).map(function(g) {
					return g.name;
				}).join("_") + "$";
				var e = Eb[b];
				if (void 0 !== e) return e;
				var f = Array(a - 1);
				e = Cb((g, k, m, l) => {
					for (var n = 0, p = 0; p < a - 1; ++p) f[p] = c[p + 1].readValueFromPointer(l + n), n += c[p + 1].argPackAdvance;
					g = g[k].apply(g, f);
					for (p = 0; p < a - 1; ++p) c[p + 1].ma && c[p + 1].ma(f[p]);
					if (!d.va) return d.toWireType(m, g);
				});
				return Eb[b] = e;
			},
			D: function(a) {
				4 < a && (J[a].ga += 1);
			},
			r: function(a) {
				Wa(M(a));
				qb(a);
			},
			c: function() {
				x("");
			},
			x: function(a, b, c) {
				A.copyWithin(a, b, b + c);
			},
			w: function(a) {
				var b = A.length;
				a >>>= 0;
				if (2147483648 < a) return !1;
				for (var c = 1; 4 >= c; c *= 2) {
					var d = b * (1 + .2 / c);
					d = Math.min(d, a + 100663296);
					var e = Math;
					d = Math.max(a, d);
					e = e.min.call(e, 2147483648, d + (65536 - d % 65536) % 65536);
					a: {
						try {
							fa.grow(e - ia.byteLength + 65535 >>> 16);
							na();
							var f = 1;
							break a;
						} catch (g) {}
						f = void 0;
					}
					if (f) return !0;
				}
				return !1;
			},
			z: function() {
				return 52;
			},
			u: function() {
				return 70;
			},
			y: function(a, b, c, d) {
				for (var e = 0, f = 0; f < c; f++) {
					var g = E[b >> 2], k = E[b + 4 >> 2];
					b += 8;
					for (var m = 0; m < k; m++) {
						var l = A[g + m], n = Fb[a];
						0 === l || 10 === l ? ((1 === a ? ea : v)(z(n, 0)), n.length = 0) : n.push(l);
					}
					e += k;
				}
				E[d >> 2] = e;
				return 0;
			}
		};
		(function() {
			function a(e) {
				h.asm = e.exports;
				fa = h.asm.E;
				na();
				oa = h.asm.J;
				qa.unshift(h.asm.F);
				F--;
				h.monitorRunDependencies && h.monitorRunDependencies(F);
				0 == F && (null !== ta && (clearInterval(ta), ta = null), G && (e = G, G = null, e()));
			}
			function b(e) {
				a(e.instance);
			}
			function c(e) {
				return ya().then(function(f) {
					return WebAssembly.instantiate(f, d);
				}).then(function(f) {
					return f;
				}).then(e, function(f) {
					v("failed to asynchronously prepare wasm: " + f);
					x(f);
				});
			}
			var d = { a: Jb };
			F++;
			h.monitorRunDependencies && h.monitorRunDependencies(F);
			if (h.instantiateWasm) try {
				return h.instantiateWasm(d, a);
			} catch (e) {
				v("Module.instantiateWasm callback failed with error: " + e), ca(e);
			}
			(function() {
				return w || "function" != typeof WebAssembly.instantiateStreaming || ua(H) || "function" != typeof fetch ? c(b) : fetch(H, { credentials: "same-origin" }).then(function(e) {
					return WebAssembly.instantiateStreaming(e, d).then(b, function(f) {
						v("wasm streaming compile failed: " + f);
						v("falling back to ArrayBuffer instantiation");
						return c(b);
					});
				});
			})().catch(ca);
			return {};
		})();
		h.___wasm_call_ctors = function() {
			return (h.___wasm_call_ctors = h.asm.F).apply(null, arguments);
		};
		var Ka = h.___getTypeName = function() {
			return (Ka = h.___getTypeName = h.asm.G).apply(null, arguments);
		};
		h.__embind_initialize_bindings = function() {
			return (h.__embind_initialize_bindings = h.asm.H).apply(null, arguments);
		};
		var Ib = h._malloc = function() {
			return (Ib = h._malloc = h.asm.I).apply(null, arguments);
		}, S = h._free = function() {
			return (S = h._free = h.asm.K).apply(null, arguments);
		};
		h.dynCall_jiji = function() {
			return (h.dynCall_jiji = h.asm.L).apply(null, arguments);
		};
		var Kb;
		G = function Lb() {
			Kb || Mb();
			Kb || (G = Lb);
		};
		function Mb() {
			function a() {
				if (!Kb && (Kb = !0, h.calledRun = !0, !ha)) {
					za(qa);
					aa(h);
					if (h.onRuntimeInitialized) h.onRuntimeInitialized();
					if (h.postRun) for ("function" == typeof h.postRun && (h.postRun = [h.postRun]); h.postRun.length;) {
						var b = h.postRun.shift();
						ra.unshift(b);
					}
					za(ra);
				}
			}
			if (!(0 < F)) {
				if (h.preRun) for ("function" == typeof h.preRun && (h.preRun = [h.preRun]); h.preRun.length;) sa();
				za(pa);
				0 < F || (h.setStatus ? (h.setStatus("Running..."), setTimeout(function() {
					setTimeout(function() {
						h.setStatus("");
					}, 1);
					a();
				}, 1)) : a());
			}
		}
		if (h.preInit) for ("function" == typeof h.preInit && (h.preInit = [h.preInit]); 0 < h.preInit.length;) h.preInit.pop()();
		Mb();
		return loadYoga.ready;
	});
})();
// node_modules/yoga-layout/dist/src/generated/YGEnums.js
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var Align = /*#__PURE__*/ function(Align) {
	Align[Align["Auto"] = 0] = "Auto";
	Align[Align["FlexStart"] = 1] = "FlexStart";
	Align[Align["Center"] = 2] = "Center";
	Align[Align["FlexEnd"] = 3] = "FlexEnd";
	Align[Align["Stretch"] = 4] = "Stretch";
	Align[Align["Baseline"] = 5] = "Baseline";
	Align[Align["SpaceBetween"] = 6] = "SpaceBetween";
	Align[Align["SpaceAround"] = 7] = "SpaceAround";
	Align[Align["SpaceEvenly"] = 8] = "SpaceEvenly";
	return Align;
}({});
var BoxSizing = /*#__PURE__*/ function(BoxSizing) {
	BoxSizing[BoxSizing["BorderBox"] = 0] = "BorderBox";
	BoxSizing[BoxSizing["ContentBox"] = 1] = "ContentBox";
	return BoxSizing;
}({});
var Dimension = /*#__PURE__*/ function(Dimension) {
	Dimension[Dimension["Width"] = 0] = "Width";
	Dimension[Dimension["Height"] = 1] = "Height";
	return Dimension;
}({});
var Direction = /*#__PURE__*/ function(Direction) {
	Direction[Direction["Inherit"] = 0] = "Inherit";
	Direction[Direction["LTR"] = 1] = "LTR";
	Direction[Direction["RTL"] = 2] = "RTL";
	return Direction;
}({});
var Display = /*#__PURE__*/ function(Display) {
	Display[Display["Flex"] = 0] = "Flex";
	Display[Display["None"] = 1] = "None";
	Display[Display["Contents"] = 2] = "Contents";
	return Display;
}({});
var Edge = /*#__PURE__*/ function(Edge) {
	Edge[Edge["Left"] = 0] = "Left";
	Edge[Edge["Top"] = 1] = "Top";
	Edge[Edge["Right"] = 2] = "Right";
	Edge[Edge["Bottom"] = 3] = "Bottom";
	Edge[Edge["Start"] = 4] = "Start";
	Edge[Edge["End"] = 5] = "End";
	Edge[Edge["Horizontal"] = 6] = "Horizontal";
	Edge[Edge["Vertical"] = 7] = "Vertical";
	Edge[Edge["All"] = 8] = "All";
	return Edge;
}({});
var Errata = /*#__PURE__*/ function(Errata) {
	Errata[Errata["None"] = 0] = "None";
	Errata[Errata["StretchFlexBasis"] = 1] = "StretchFlexBasis";
	Errata[Errata["AbsolutePositionWithoutInsetsExcludesPadding"] = 2] = "AbsolutePositionWithoutInsetsExcludesPadding";
	Errata[Errata["AbsolutePercentAgainstInnerSize"] = 4] = "AbsolutePercentAgainstInnerSize";
	Errata[Errata["All"] = 2147483647] = "All";
	Errata[Errata["Classic"] = 2147483646] = "Classic";
	return Errata;
}({});
var ExperimentalFeature = /*#__PURE__*/ function(ExperimentalFeature) {
	ExperimentalFeature[ExperimentalFeature["WebFlexBasis"] = 0] = "WebFlexBasis";
	return ExperimentalFeature;
}({});
var FlexDirection = /*#__PURE__*/ function(FlexDirection) {
	FlexDirection[FlexDirection["Column"] = 0] = "Column";
	FlexDirection[FlexDirection["ColumnReverse"] = 1] = "ColumnReverse";
	FlexDirection[FlexDirection["Row"] = 2] = "Row";
	FlexDirection[FlexDirection["RowReverse"] = 3] = "RowReverse";
	return FlexDirection;
}({});
var Gutter = /*#__PURE__*/ function(Gutter) {
	Gutter[Gutter["Column"] = 0] = "Column";
	Gutter[Gutter["Row"] = 1] = "Row";
	Gutter[Gutter["All"] = 2] = "All";
	return Gutter;
}({});
var Justify = /*#__PURE__*/ function(Justify) {
	Justify[Justify["FlexStart"] = 0] = "FlexStart";
	Justify[Justify["Center"] = 1] = "Center";
	Justify[Justify["FlexEnd"] = 2] = "FlexEnd";
	Justify[Justify["SpaceBetween"] = 3] = "SpaceBetween";
	Justify[Justify["SpaceAround"] = 4] = "SpaceAround";
	Justify[Justify["SpaceEvenly"] = 5] = "SpaceEvenly";
	return Justify;
}({});
var LogLevel = /*#__PURE__*/ function(LogLevel) {
	LogLevel[LogLevel["Error"] = 0] = "Error";
	LogLevel[LogLevel["Warn"] = 1] = "Warn";
	LogLevel[LogLevel["Info"] = 2] = "Info";
	LogLevel[LogLevel["Debug"] = 3] = "Debug";
	LogLevel[LogLevel["Verbose"] = 4] = "Verbose";
	LogLevel[LogLevel["Fatal"] = 5] = "Fatal";
	return LogLevel;
}({});
var MeasureMode = /*#__PURE__*/ function(MeasureMode) {
	MeasureMode[MeasureMode["Undefined"] = 0] = "Undefined";
	MeasureMode[MeasureMode["Exactly"] = 1] = "Exactly";
	MeasureMode[MeasureMode["AtMost"] = 2] = "AtMost";
	return MeasureMode;
}({});
var NodeType = /*#__PURE__*/ function(NodeType) {
	NodeType[NodeType["Default"] = 0] = "Default";
	NodeType[NodeType["Text"] = 1] = "Text";
	return NodeType;
}({});
var Overflow = /*#__PURE__*/ function(Overflow) {
	Overflow[Overflow["Visible"] = 0] = "Visible";
	Overflow[Overflow["Hidden"] = 1] = "Hidden";
	Overflow[Overflow["Scroll"] = 2] = "Scroll";
	return Overflow;
}({});
var PositionType = /*#__PURE__*/ function(PositionType) {
	PositionType[PositionType["Static"] = 0] = "Static";
	PositionType[PositionType["Relative"] = 1] = "Relative";
	PositionType[PositionType["Absolute"] = 2] = "Absolute";
	return PositionType;
}({});
var Unit = /*#__PURE__*/ function(Unit) {
	Unit[Unit["Undefined"] = 0] = "Undefined";
	Unit[Unit["Point"] = 1] = "Point";
	Unit[Unit["Percent"] = 2] = "Percent";
	Unit[Unit["Auto"] = 3] = "Auto";
	return Unit;
}({});
var Wrap = /*#__PURE__*/ function(Wrap) {
	Wrap[Wrap["NoWrap"] = 0] = "NoWrap";
	Wrap[Wrap["Wrap"] = 1] = "Wrap";
	Wrap[Wrap["WrapReverse"] = 2] = "WrapReverse";
	return Wrap;
}({});
var constants = {
	ALIGN_AUTO: Align.Auto,
	ALIGN_FLEX_START: Align.FlexStart,
	ALIGN_CENTER: Align.Center,
	ALIGN_FLEX_END: Align.FlexEnd,
	ALIGN_STRETCH: Align.Stretch,
	ALIGN_BASELINE: Align.Baseline,
	ALIGN_SPACE_BETWEEN: Align.SpaceBetween,
	ALIGN_SPACE_AROUND: Align.SpaceAround,
	ALIGN_SPACE_EVENLY: Align.SpaceEvenly,
	BOX_SIZING_BORDER_BOX: BoxSizing.BorderBox,
	BOX_SIZING_CONTENT_BOX: BoxSizing.ContentBox,
	DIMENSION_WIDTH: Dimension.Width,
	DIMENSION_HEIGHT: Dimension.Height,
	DIRECTION_INHERIT: Direction.Inherit,
	DIRECTION_LTR: Direction.LTR,
	DIRECTION_RTL: Direction.RTL,
	DISPLAY_FLEX: Display.Flex,
	DISPLAY_NONE: Display.None,
	DISPLAY_CONTENTS: Display.Contents,
	EDGE_LEFT: Edge.Left,
	EDGE_TOP: Edge.Top,
	EDGE_RIGHT: Edge.Right,
	EDGE_BOTTOM: Edge.Bottom,
	EDGE_START: Edge.Start,
	EDGE_END: Edge.End,
	EDGE_HORIZONTAL: Edge.Horizontal,
	EDGE_VERTICAL: Edge.Vertical,
	EDGE_ALL: Edge.All,
	ERRATA_NONE: Errata.None,
	ERRATA_STRETCH_FLEX_BASIS: Errata.StretchFlexBasis,
	ERRATA_ABSOLUTE_POSITION_WITHOUT_INSETS_EXCLUDES_PADDING: Errata.AbsolutePositionWithoutInsetsExcludesPadding,
	ERRATA_ABSOLUTE_PERCENT_AGAINST_INNER_SIZE: Errata.AbsolutePercentAgainstInnerSize,
	ERRATA_ALL: Errata.All,
	ERRATA_CLASSIC: Errata.Classic,
	EXPERIMENTAL_FEATURE_WEB_FLEX_BASIS: ExperimentalFeature.WebFlexBasis,
	FLEX_DIRECTION_COLUMN: FlexDirection.Column,
	FLEX_DIRECTION_COLUMN_REVERSE: FlexDirection.ColumnReverse,
	FLEX_DIRECTION_ROW: FlexDirection.Row,
	FLEX_DIRECTION_ROW_REVERSE: FlexDirection.RowReverse,
	GUTTER_COLUMN: Gutter.Column,
	GUTTER_ROW: Gutter.Row,
	GUTTER_ALL: Gutter.All,
	JUSTIFY_FLEX_START: Justify.FlexStart,
	JUSTIFY_CENTER: Justify.Center,
	JUSTIFY_FLEX_END: Justify.FlexEnd,
	JUSTIFY_SPACE_BETWEEN: Justify.SpaceBetween,
	JUSTIFY_SPACE_AROUND: Justify.SpaceAround,
	JUSTIFY_SPACE_EVENLY: Justify.SpaceEvenly,
	LOG_LEVEL_ERROR: LogLevel.Error,
	LOG_LEVEL_WARN: LogLevel.Warn,
	LOG_LEVEL_INFO: LogLevel.Info,
	LOG_LEVEL_DEBUG: LogLevel.Debug,
	LOG_LEVEL_VERBOSE: LogLevel.Verbose,
	LOG_LEVEL_FATAL: LogLevel.Fatal,
	MEASURE_MODE_UNDEFINED: MeasureMode.Undefined,
	MEASURE_MODE_EXACTLY: MeasureMode.Exactly,
	MEASURE_MODE_AT_MOST: MeasureMode.AtMost,
	NODE_TYPE_DEFAULT: NodeType.Default,
	NODE_TYPE_TEXT: NodeType.Text,
	OVERFLOW_VISIBLE: Overflow.Visible,
	OVERFLOW_HIDDEN: Overflow.Hidden,
	OVERFLOW_SCROLL: Overflow.Scroll,
	POSITION_TYPE_STATIC: PositionType.Static,
	POSITION_TYPE_RELATIVE: PositionType.Relative,
	POSITION_TYPE_ABSOLUTE: PositionType.Absolute,
	UNIT_UNDEFINED: Unit.Undefined,
	UNIT_POINT: Unit.Point,
	UNIT_PERCENT: Unit.Percent,
	UNIT_AUTO: Unit.Auto,
	WRAP_NO_WRAP: Wrap.NoWrap,
	WRAP_WRAP: Wrap.Wrap,
	WRAP_WRAP_REVERSE: Wrap.WrapReverse
};
// node_modules/yoga-layout/dist/src/wrapAssembly.js
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
* @format
*/
function wrapAssembly(lib) {
	function patch(prototype, name, fn) {
		const original = prototype[name];
		prototype[name] = function() {
			for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
			return fn.call(this, original, ...args);
		};
	}
	for (const fnName of [
		"setPosition",
		"setMargin",
		"setFlexBasis",
		"setWidth",
		"setHeight",
		"setMinWidth",
		"setMinHeight",
		"setMaxWidth",
		"setMaxHeight",
		"setPadding",
		"setGap"
	]) {
		const methods = {
			[Unit.Point]: lib.Node.prototype[fnName],
			[Unit.Percent]: lib.Node.prototype[`${fnName}Percent`],
			[Unit.Auto]: lib.Node.prototype[`${fnName}Auto`]
		};
		patch(lib.Node.prototype, fnName, function(original) {
			for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
			const value = args.pop();
			let unit, asNumber;
			if (value === "auto") {
				unit = Unit.Auto;
				asNumber = void 0;
			} else if (typeof value === "object") {
				unit = value.unit;
				asNumber = value.valueOf();
			} else {
				unit = typeof value === "string" && value.endsWith("%") ? Unit.Percent : Unit.Point;
				asNumber = parseFloat(value);
				if (value !== void 0 && !Number.isNaN(value) && Number.isNaN(asNumber)) throw new Error(`Invalid value ${value} for ${fnName}`);
			}
			if (!methods[unit]) throw new Error(`Failed to execute "${fnName}": Unsupported unit '${value}'`);
			if (asNumber !== void 0) return methods[unit].call(this, ...args, asNumber);
			else return methods[unit].call(this, ...args);
		});
	}
	function wrapMeasureFunction(measureFunction) {
		return lib.MeasureCallback.implement({ measure: function() {
			const { width, height } = measureFunction(...arguments);
			return {
				width: width ?? NaN,
				height: height ?? NaN
			};
		} });
	}
	patch(lib.Node.prototype, "setMeasureFunc", function(original, measureFunc) {
		if (measureFunc) return original.call(this, wrapMeasureFunction(measureFunc));
		else return this.unsetMeasureFunc();
	});
	function wrapDirtiedFunc(dirtiedFunction) {
		return lib.DirtiedCallback.implement({ dirtied: dirtiedFunction });
	}
	patch(lib.Node.prototype, "setDirtiedFunc", function(original, dirtiedFunc) {
		original.call(this, wrapDirtiedFunc(dirtiedFunc));
	});
	patch(lib.Config.prototype, "free", function() {
		lib.Config.destroy(this);
	});
	patch(lib.Node, "create", (_, config) => {
		return config ? lib.Node.createWithConfig(config) : lib.Node.createDefault();
	});
	patch(lib.Node.prototype, "free", function() {
		lib.Node.destroy(this);
	});
	patch(lib.Node.prototype, "freeRecursive", function() {
		for (let t = 0, T = this.getChildCount(); t < T; ++t) this.getChild(0).freeRecursive();
		this.free();
	});
	patch(lib.Node.prototype, "calculateLayout", function(original) {
		let width = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : NaN;
		let height = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : NaN;
		let direction = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : Direction.LTR;
		return original.call(this, width, height, direction);
	});
	return {
		Config: lib.Config,
		Node: lib.Node,
		...constants
	};
}
// node_modules/yoga-layout/dist/src/load.js
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
* @format
*/
async function loadYoga() {
	return wrapAssembly(await loadYoga$1());
}
// node_modules/@pmndrs/uikit/dist/clipping.js
var dotLt45deg = Math.cos(45 / 180 * Math.PI);
var helperPlanes = [
	new Plane(),
	new Plane(),
	new Plane(),
	new Plane()
];
var positionHelper$1 = new Vector3();
var ClippingRect = class {
	planes;
	facePlane;
	originalCenter;
	constructor(globalMatrix, centerX, centerY, width, height) {
		this.originalCenter = new Vector3(centerX, centerY, 0).applyMatrix4(globalMatrix);
		this.facePlane = new Plane(new Vector3(0, 0, 1), 0).applyMatrix4(globalMatrix);
		const halfWidth = width / 2;
		const halfHeight = height / 2;
		const top = centerY + halfHeight;
		const right = centerX + halfWidth;
		const bottom = -centerY + halfHeight;
		const left = -centerX + halfWidth;
		this.planes = [
			new Plane(new Vector3(0, -1, 0), bottom).applyMatrix4(globalMatrix),
			new Plane(new Vector3(-1, 0, 0), left).applyMatrix4(globalMatrix),
			new Plane(new Vector3(0, 1, 0), top).applyMatrix4(globalMatrix),
			new Plane(new Vector3(1, 0, 0), right).applyMatrix4(globalMatrix)
		];
	}
	min({ planes }) {
		for (let i = 0; i < 4; i++) {
			const p1 = this.facePlane;
			const p2 = planes[i];
			const n1n2DotProduct = p1.normal.dot(p2.normal);
			if (Math.abs(n1n2DotProduct) > .99) return this;
			const helperPlane = helperPlanes[i];
			if (Math.abs(n1n2DotProduct) < .01) {
				helperPlane.copy(p2);
				continue;
			}
			helperPlane.normal.crossVectors(p1.normal, p2.normal).normalize().cross(p1.normal).negate();
			const divisor = 1 - n1n2DotProduct * n1n2DotProduct;
			const c1 = (p1.constant - p2.constant * n1n2DotProduct) / divisor;
			const c2 = (p2.constant - p1.constant * n1n2DotProduct) / divisor;
			positionHelper$1.copy(p1.normal).multiplyScalar(c1).addScaledVector(p2.normal, c2);
			helperPlane.constant = -positionHelper$1.dot(helperPlane.normal);
		}
		let indexOffset = 0;
		const firstPlaneNormal = this.planes[0].normal;
		while (helperPlanes[indexOffset].normal.dot(firstPlaneNormal) > dotLt45deg) break;
		for (let i = 0; i < 4; i++) {
			const plane = this.planes[i];
			const otherPlaneIndex = (i + indexOffset) % 4;
			if (helperPlanes[otherPlaneIndex].distanceToPoint(this.originalCenter) < plane.distanceToPoint(this.originalCenter)) plane.copy(planes[otherPlaneIndex]);
		}
		return this;
	}
	toArray(array, offset) {
		for (let i = 0; i < 4; i++) {
			const { normal, constant } = this.planes[i];
			normal.toArray(array, offset);
			array[offset + 3] = constant;
			offset += 4;
		}
	}
};
var helperPoints = [
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3()
];
var multiplier = [
	[-.5, -.5],
	[.5, -.5],
	[.5, .5],
	[-.5, .5]
];
function computedIsClipped(parent, globalMatrix, size, pixelSizeSignal) {
	return O(() => {
		const parentValue = parent.value;
		if (parentValue == null) return false;
		const sizeValue = size.value;
		if (sizeValue == null) return true;
		const global = globalMatrix.value;
		const rect = parentValue.clippingRect.value;
		if (rect == null || global == null) return false;
		const [width, height] = sizeValue;
		const pixelSize = pixelSizeSignal.value;
		for (let i = 0; i < 4; i++) {
			const [mx, my] = multiplier[i];
			helperPoints[i].set(mx * pixelSize * width, my * pixelSize * height, 0).applyMatrix4(global);
		}
		const { planes } = rect;
		let allOutside;
		for (let planeIndex = 0; planeIndex < 4; planeIndex++) {
			const clippingPlane = planes[planeIndex];
			allOutside = true;
			for (let pointIndex = 0; pointIndex < 4; pointIndex++) {
				const point = helperPoints[pointIndex];
				if (clippingPlane.distanceToPoint(point) >= 0) allOutside = false;
			}
			if (allOutside) return true;
		}
		return false;
	});
}
function computedClippingRect(globalMatrix, { overflow, borderInset, size }, pixelSizeSignal, parentClippingRect) {
	return O(() => {
		const global = globalMatrix.value;
		const parentClippingRectValue = parentClippingRect?.value;
		if (global == null || overflow.value === Overflow.Visible) return parentClippingRectValue;
		const sizeValue = size.value;
		const borderInsetValue = borderInset.value;
		if (sizeValue == null || borderInsetValue == null) return;
		const [width, height] = sizeValue;
		const [top, right, bottom, left] = borderInsetValue;
		const pixelSize = pixelSizeSignal.value;
		const rect = new ClippingRect(global, (right - left) * pixelSize / 2, (top - bottom) * pixelSize / 2, (width - left - right) * pixelSize, (height - top - bottom) * pixelSize);
		if (parentClippingRectValue != null) rect.min(parentClippingRectValue);
		return rect;
	});
}
var NoClippingPlane = new Plane(new Vector3(-1, 0, 0), Number.MAX_SAFE_INTEGER);
var defaultClippingData = /* @__PURE__ */ new Float32Array(16);
for (let i = 0; i < 4; i++) {
	NoClippingPlane.normal.toArray(defaultClippingData, i * 4);
	defaultClippingData[i * 4 + 3] = NoClippingPlane.constant;
}
function createGlobalClippingPlanes(component) {
	const getGlobalMatrix = () => component.root.peek().component.parent?.matrixWorld;
	return new Array(4).fill(void 0).map((_, i) => new RelativePlane(() => component.parentContainer.peek()?.clippingRect.value?.planes[i], getGlobalMatrix));
}
var helperPlane = new Plane();
var RelativePlane = class {
	getLocalPlane;
	getGlobalMatrix;
	get normal() {
		this.computeInto(helperPlane);
		return helperPlane.normal;
	}
	get constant() {
		this.computeInto(helperPlane);
		return helperPlane.constant;
	}
	isPlane = true;
	constructor(getLocalPlane, getGlobalMatrix) {
		this.getLocalPlane = getLocalPlane;
		this.getGlobalMatrix = getGlobalMatrix;
	}
	computeInto(target) {
		const localPlane = this.getLocalPlane();
		const globalMatrix = this.getGlobalMatrix();
		if (localPlane == null || globalMatrix == null) return target.copy(NoClippingPlane);
		return target.copy(localPlane).applyMatrix4(globalMatrix);
	}
	set(normal, constant) {
		return this;
	}
	setComponents(x, y, z, w) {
		return this;
	}
	setFromNormalAndCoplanarPoint(normal, point) {
		return this;
	}
	setFromCoplanarPoints(a, b, c) {
		return this;
	}
	clone() {
		return this.computeInto(new Plane());
	}
	copy(plane) {
		this.computeInto(plane);
		return this;
	}
	normalize() {
		return this;
	}
	negate() {
		return this;
	}
	distanceToPoint(point) {
		return this.computeInto(helperPlane).distanceToPoint(point);
	}
	distanceToSphere(sphere) {
		return this.computeInto(helperPlane).distanceToSphere(sphere);
	}
	projectPoint(point, target) {
		return this.computeInto(helperPlane).projectPoint(point, target);
	}
	intersectLine(line, target) {
		return this.computeInto(helperPlane).intersectLine(line, target);
	}
	intersectsLine(line) {
		return this.computeInto(helperPlane).intersectsLine(line);
	}
	intersectsBox(box) {
		return this.computeInto(helperPlane).intersectsBox(box);
	}
	intersectsSphere(sphere) {
		return this.computeInto(helperPlane).intersectsSphere(sphere);
	}
	coplanarPoint(target) {
		return this.computeInto(helperPlane).coplanarPoint(target);
	}
	applyMatrix4(matrix, optionalNormalMatrix) {
		return this;
	}
	translate(offset) {
		return this;
	}
	equals(plane) {
		return this.computeInto(helperPlane).equals(plane);
	}
	isIntersectionLine(l) {
		return this.computeInto(helperPlane).isIntersectionLine(l);
	}
};
// node_modules/@pmndrs/uikit/dist/panel/instance/panel.js
var InstancedPanel = class {
	group;
	minorIndex;
	matrix;
	size;
	borderInset;
	clippingRect;
	materialConfig;
	indexInBucket;
	bucket;
	insertedIntoGroup = false;
	active = y(false);
	abortController;
	constructor(properties, group, minorIndex, matrix, size, borderInset, clippingRect, isVisible, materialConfig, abortSignal) {
		this.group = group;
		this.minorIndex = minorIndex;
		this.matrix = matrix;
		this.size = size;
		this.borderInset = borderInset;
		this.clippingRect = clippingRect;
		this.materialConfig = materialConfig;
		const setters = materialConfig.setters;
		abortableEffect(() => {
			if (!isVisible.value || !this.active.value) return;
			return properties.subscribePropertyKeys((key) => {
				if (!materialConfig.hasProperty(key)) return;
				abortableEffect(() => {
					const index = this.getIndexInBuffer();
					if (index == null) return;
					const { instanceData, instanceDataOnUpdate: instanceDataAddUpdateRange, root } = this.group;
					setters[key](instanceData.array, instanceData.itemSize * index, properties.value[key], size, properties.signal.opacity, instanceDataAddUpdateRange);
					root.requestRender?.();
				}, abortSignal);
			});
		}, abortSignal);
		const isPanelVisible = materialConfig.computedIsVisibile(properties, borderInset, size, isVisible);
		abortableEffect(() => {
			if (isPanelVisible.value) {
				this.requestShow();
				return;
			}
			this.hide();
		}, abortSignal);
		abortSignal.addEventListener("abort", () => this.hide());
	}
	setIndexInBucket(index) {
		this.indexInBucket = index;
	}
	getIndexInBuffer() {
		if (this.bucket == null || this.indexInBucket == null) return;
		return this.bucket.offset + this.indexInBucket;
	}
	activate(bucket, index) {
		this.bucket = bucket;
		this.indexInBucket = index;
		this.active.value = true;
		this.abortController = new AbortController();
		abortableEffect(() => {
			const matrix = this.matrix.value;
			if (matrix == null) return;
			const index = this.getIndexInBuffer();
			if (index == null) return;
			const arrayIndex = index * 16;
			const { instanceMatrix, root } = this.group;
			matrix.toArray(instanceMatrix.array, arrayIndex);
			instanceMatrix.addUpdateRange(arrayIndex, 16);
			instanceMatrix.needsUpdate = true;
			root.requestRender?.();
		}, this.abortController.signal);
		abortableEffect(() => {
			const index = this.getIndexInBuffer();
			const size = this.size.value;
			if (index == null || size == null) return;
			const [width, height] = size;
			const { instanceData, root } = this.group;
			const { array } = instanceData;
			const bufferIndex = index * 16 + 14;
			array[bufferIndex] = width;
			array[bufferIndex + 1] = height;
			instanceData.addUpdateRange(bufferIndex, 2);
			instanceData.needsUpdate = true;
			root.requestRender?.();
		}, this.abortController.signal);
		abortableEffect(() => {
			const index = this.getIndexInBuffer();
			const borderInset = this.borderInset.value;
			if (index == null || borderInset == null) return;
			const { instanceData, root } = this.group;
			const offset = index * 16 + 0;
			instanceData.array.set(borderInset, offset);
			instanceData.addUpdateRange(offset, 4);
			instanceData.needsUpdate = true;
			root.requestRender?.();
		}, this.abortController.signal);
		abortableEffect(() => {
			const index = this.getIndexInBuffer();
			if (index == null) return;
			const { instanceClipping, root } = this.group;
			const offset = index * 16;
			const clipping = this.clippingRect?.value;
			if (clipping != null) clipping.toArray(instanceClipping.array, offset);
			else instanceClipping.array.set(defaultClippingData, offset);
			instanceClipping.addUpdateRange(offset, 16);
			instanceClipping.needsUpdate = true;
			root.requestRender?.();
		}, this.abortController.signal);
	}
	requestShow() {
		if (this.insertedIntoGroup) return;
		this.insertedIntoGroup = true;
		this.group.insert(this.minorIndex, this);
	}
	hide() {
		if (!this.insertedIntoGroup) return;
		this.active.value = false;
		this.group.delete(this.minorIndex, this.indexInBucket, this);
		this.insertedIntoGroup = false;
		this.bucket = void 0;
		this.indexInBucket = void 0;
		this.abortController?.abort();
		this.abortController = void 0;
	}
};
// node_modules/@pmndrs/uikit/dist/panel/instance/properties.js
function computedPanelGroupDependencies(properties) {
	return O(() => {
		return {
			panelMaterialClass: resolvePanelMaterialClassProperty(properties.value.panelMaterialClass),
			castShadow: properties.value.castShadow,
			receiveShadow: properties.value.receiveShadow,
			depthWrite: properties.value.depthWrite ?? false,
			depthTest: properties.value.depthTest,
			renderOrder: parseNumberValue(properties.value.renderOrder ?? 0)
		};
	});
}
// node_modules/@pmndrs/uikit/dist/panel/instance/setup.js
function setupInstancedPanel(properties, root, orderInfo, panelGroupDependencies, panelMatrix, size, borderInset, clippingRect, isVisible, materialConfig, abortSignal) {
	abortableEffect(() => {
		const isEnabled = properties.enabled.value;
		const currentOrderInfo = orderInfo.value;
		if (!isEnabled || currentOrderInfo == null) return;
		const innerAbortController = new AbortController();
		new InstancedPanel(properties, root.value.panelGroupManager.getGroup(currentOrderInfo, panelGroupDependencies.value), currentOrderInfo.patchIndex, panelMatrix, size, borderInset, clippingRect, isVisible, materialConfig, innerAbortController.signal);
		return () => innerAbortController.abort();
	}, abortSignal);
}
// node_modules/@pmndrs/uikit/dist/panel/material/color.js
var colorHelper$1 = new Color();
var rgbaRegex = /^rgba\((\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\)$/;
var hexAlphaRegex = /^#(?:([0-9a-f]{3})([0-9a-f])|([0-9a-f]{6})([0-9a-f]{2}))$/i;
function writeColor(target, offset, color, opacity, onUpdate) {
	let match;
	if (Array.isArray(color)) {
		for (let i = 0; i < color.length; i++) target[i + offset] = color[i];
		target[offset + 3] = (color.length === 3 ? 1 : target[offset + 3]) * opacity;
	} else if (color === "transparent") target.fill(0, offset, offset + 4);
	else if (typeof color === "string" && (match = color.match(rgbaRegex)) != null) {
		for (let i = 0; i < 3; i++) target[i + offset] = parseFloat(match[i + 1]) / 255;
		target[3 + offset] = parseFloat(match[4]) * opacity;
	} else if (typeof color === "string" && (match = color.match(hexAlphaRegex)) != null) {
		const rgb = match[1] ?? match[3];
		const alpha = match[2] == null ? match[4] : `${match[2]}${match[2]}`;
		colorHelper$1.set(`#${rgb}`).toArray(target, offset);
		target[offset + 3] = Number.parseInt(alpha, 16) / 255 * opacity;
	} else {
		colorHelper$1.set(color).toArray(target, offset);
		target[offset + 3] = opacity;
	}
	onUpdate?.(offset, 4);
}
// node_modules/@pmndrs/uikit/dist/text/utils.js
function getGlyphOffsetX(glyphInfo, fontSize) {
	return glyphInfo.xoffset * fontSize;
}
function getKerningOffset(font, fontSize, prevGlyphId, glyphInfo) {
	if (prevGlyphId == null) return 0;
	return font.getKerning(prevGlyphId, glyphInfo.id) * fontSize;
}
function toAbsoluteNumber(value, getRelativeValue, root) {
	const [width, height] = root?.component.size.value ?? [];
	return parseAbsoluteNumber(value, getRelativeValue, width, height);
}
function getGlyphOffsetY(fontSize, lineHeight, glyphInfo) {
	return (glyphInfo?.yoffset ?? 0) * fontSize + (lineHeight - fontSize) / 2;
}
function getOffsetToNextGlyph(fontSize, glyphInfo, letterSpacing) {
	return glyphInfo.xadvance * fontSize + letterSpacing;
}
function getOffsetToNextLine(lineHeight) {
	return lineHeight;
}
function getGlyphLayoutHeight(linesAmount, lineHeight) {
	return Math.max(linesAmount, 1) * lineHeight;
}
// node_modules/@pmndrs/uikit/dist/panel/material/data.js
var materialSetters = {
	backgroundColor: (d, o, p, _, op, u) => writeColor(d, o + 4, p, toAbsoluteNumber(op.value, () => 1), u),
	borderBottomLeftRadius: (d, o, p, { value: s }, _, u) => {
		s != null && writeBorderRadius(d, o + 8, 0, p, s[1], u);
	},
	borderBottomRightRadius: (d, o, p, { value: s }, _, u) => s != null && writeBorderRadius(d, o + 8, 1, p, s[1], u),
	borderTopRightRadius: (d, o, p, { value: s }, _, u) => s != null && writeBorderRadius(d, o + 8, 2, p, s[1], u),
	borderTopLeftRadius: (d, o, p, { value: s }, _, u) => s != null && writeBorderRadius(d, o + 8, 3, p, s[1], u),
	borderColor: (d, o, p, _, op, u) => writeColor(d, o + 9, p, toAbsoluteNumber(op.value, () => 1), u),
	borderBend: (d, o, p, _, op, u) => writeComponent(d, o + 13, toAbsoluteNumber(p, () => 1), u)
};
function writeBorderRadius(data, offset, indexInFloat, value, height, onUpdate) {
	setBorderRadius(data, offset, indexInFloat, toAbsoluteNumber(value, () => height), height);
	onUpdate?.(offset, 1);
}
function writeComponent(data, offset, value, onUpdate) {
	data[offset] = value;
	onUpdate?.(offset, 1);
}
function setComponentInFloat(from, index, value) {
	const x = Math.pow(50, index);
	return from + (value - Math.floor(from / x) % 50) * x;
}
function setBorderRadius(data, indexInData, indexInFloat, value, height) {
	data[indexInData] = setComponentInFloat(data[indexInData], indexInFloat, height === 0 ? 0 : MathUtils.clamp(Math.ceil((value ?? 0) / height * 100), 0, 49));
}
// node_modules/@pmndrs/uikit/dist/panel/material/config.js
var defaultDefaults = {
	backgroundColor: "transparent",
	borderColor: "transparent",
	borderBottomLeftRadius: 0,
	borderTopLeftRadius: 0,
	borderBottomRightRadius: 0,
	borderTopRightRadius: 0,
	borderBend: 0
};
var defaultOpacity = 1;
var defaultPanelMaterialConfig;
function getDefaultPanelMaterialConfig() {
	if (defaultPanelMaterialConfig == null) {
		const defaultPanelMaterialKeys = {};
		for (const key in defaultDefaults) defaultPanelMaterialKeys[key] = key;
		defaultPanelMaterialConfig = createPanelMaterialConfig(defaultPanelMaterialKeys);
	}
	return defaultPanelMaterialConfig;
}
var colorArrayHelper$1 = [
	0,
	0,
	0,
	0
];
function createPanelMaterialConfig(keys, providedDefaults) {
	const defaults = {
		...defaultDefaults,
		...providedDefaults
	};
	const setters = {};
	for (const key in keys) {
		const fn = materialSetters[key];
		const defaultValue = defaults[key];
		setters[keys[key]] = (data, offset, value, size, opacity, onUpdate) => fn(data, offset, value ?? defaultValue, size, opacity, onUpdate);
	}
	const defaultData = /* @__PURE__ */ new Float32Array(16);
	writeColor(defaultData, 4, defaults.backgroundColor, defaultOpacity, void 0);
	writeColor(defaultData, 9, defaults.borderColor, defaultOpacity, void 0);
	defaultData[13] = defaults.borderBend;
	return {
		hasProperty: (key) => key in setters,
		defaultData,
		setters,
		computedIsVisibile: (properties, borderInset, size, isVisible) => {
			return O(() => {
				const borderInsetValue = borderInset.value;
				const sizeValue = size.value;
				if (borderInsetValue == null || sizeValue == null) return false;
				const backgroundColor = keys.backgroundColor == null ? defaults.backgroundColor : properties.value[keys.backgroundColor] ?? defaults.backgroundColor;
				const borderColor = keys.borderColor == null ? defaults.borderColor : properties.value[keys.borderColor] ?? defaults.borderColor;
				const opacity = toAbsoluteNumber(properties.value.opacity ?? defaultOpacity, () => 1);
				writeColor(colorArrayHelper$1, 0, backgroundColor ?? defaults.backgroundColor, opacity);
				const [width, height] = sizeValue;
				const backgroundVisible = width > 0 && height > 0 && colorArrayHelper$1[3] > 0;
				writeColor(colorArrayHelper$1, 0, borderColor ?? defaults.borderColor, opacity);
				const borderVisible = borderInsetValue.some((s) => s > 0) && colorArrayHelper$1[3] > 0;
				if (!backgroundVisible && !borderVisible) return false;
				return isVisible.value;
			});
		}
	};
}
// node_modules/@pmndrs/uikit/dist/flex/setter.js
function convertEnum(lut, input, defaultValue) {
	if (input == null) return defaultValue;
	const resolvedValue = lut[input];
	if (resolvedValue == null) throw new Error(`unexpected value ${input}, expected ${Object.keys(lut).join(", ")}`);
	return resolvedValue;
}
function convertPoint(input, root) {
	const [width, height] = root.component.size.value ?? [0, 0];
	return convertYogaPoint(input, width, height);
}
function convertNumber(input) {
	return input == null ? void 0 : parseAbsoluteLengthValue(input);
}
var POSITION_TYPE_LUT = {
	static: 0,
	relative: 1,
	absolute: 2
};
var ALIGN_LUT = {
	auto: 0,
	"flex-start": 1,
	center: 2,
	"flex-end": 3,
	stretch: 4,
	baseline: 5,
	"space-between": 6,
	"space-around": 7,
	"space-evenly": 8
};
var FLEX_DIRECTION_LUT = {
	column: 0,
	"column-reverse": 1,
	row: 2,
	"row-reverse": 3
};
var WRAP_LUT = {
	"no-wrap": 0,
	wrap: 1,
	"wrap-reverse": 2
};
var JUSTIFY_LUT = {
	"flex-start": 0,
	center: 1,
	"flex-end": 2,
	"space-between": 3,
	"space-around": 4,
	"space-evenly": 5
};
var OVERFLOW_LUT = {
	visible: 0,
	hidden: 1,
	scroll: 2
};
var DISPLAY_LUT = {
	flex: 0,
	none: 1,
	contents: 2
};
var setter = {
	positionType: (root, node, input) => {
		node.setPositionType(convertEnum(POSITION_TYPE_LUT, input, 1));
	},
	positionTop: (root, node, input) => {
		if (input === "auto") {
			node.setPositionAuto(1);
			return;
		}
		node.setPosition(1, convertPoint(input, root));
	},
	positionLeft: (root, node, input) => {
		if (input === "auto") {
			node.setPositionAuto(0);
			return;
		}
		node.setPosition(0, convertPoint(input, root));
	},
	positionRight: (root, node, input) => {
		if (input === "auto") {
			node.setPositionAuto(2);
			return;
		}
		node.setPosition(2, convertPoint(input, root));
	},
	positionBottom: (root, node, input) => {
		if (input === "auto") {
			node.setPositionAuto(3);
			return;
		}
		node.setPosition(3, convertPoint(input, root));
	},
	alignContent: (root, node, input) => {
		node.setAlignContent(convertEnum(ALIGN_LUT, input, 4));
	},
	alignItems: (root, node, input) => {
		node.setAlignItems(convertEnum(ALIGN_LUT, input, 4));
	},
	alignSelf: (root, node, input) => {
		node.setAlignSelf(convertEnum(ALIGN_LUT, input, 0));
	},
	flexDirection: (root, node, input) => {
		node.setFlexDirection(convertEnum(FLEX_DIRECTION_LUT, input, 2));
	},
	flexWrap: (root, node, input) => {
		node.setFlexWrap(convertEnum(WRAP_LUT, input, 0));
	},
	justifyContent: (root, node, input) => {
		node.setJustifyContent(convertEnum(JUSTIFY_LUT, input, 0));
	},
	marginTop: (root, node, input) => {
		if (input === "auto") {
			node.setMarginAuto(1);
			return;
		}
		node.setMargin(1, convertPoint(input, root));
	},
	marginLeft: (root, node, input) => {
		if (input === "auto") {
			node.setMarginAuto(0);
			return;
		}
		node.setMargin(0, convertPoint(input, root));
	},
	marginRight: (root, node, input) => {
		if (input === "auto") {
			node.setMarginAuto(2);
			return;
		}
		node.setMargin(2, convertPoint(input, root));
	},
	marginBottom: (root, node, input) => {
		if (input === "auto") {
			node.setMarginAuto(3);
			return;
		}
		node.setMargin(3, convertPoint(input, root));
	},
	flexBasis: (root, node, input) => {
		if (input === "auto") {
			node.setFlexBasisAuto();
			return;
		}
		node.setFlexBasis(convertPoint(input, root) ?? NaN);
	},
	flexGrow: (root, node, input) => {
		node.setFlexGrow(convertNumber(input) ?? 0);
	},
	flexShrink: (root, node, input) => {
		node.setFlexShrink(convertNumber(input) ?? 1);
	},
	width: (root, node, input) => {
		if (input === "auto") {
			node.setWidthAuto();
			return;
		}
		node.setWidth(convertPoint(input, root) ?? NaN);
	},
	height: (root, node, input) => {
		if (input === "auto") {
			node.setHeightAuto();
			return;
		}
		node.setHeight(convertPoint(input, root) ?? NaN);
	},
	minWidth: (root, node, input) => {
		node.setMinWidth(convertPoint(input, root));
	},
	minHeight: (root, node, input) => {
		node.setMinHeight(convertPoint(input, root));
	},
	maxWidth: (root, node, input) => {
		node.setMaxWidth(convertPoint(input, root));
	},
	maxHeight: (root, node, input) => {
		node.setMaxHeight(convertPoint(input, root));
	},
	boxSizing: (root, node, input) => {
		node.setBoxSizing(convertNumber(input) ?? 0);
	},
	aspectRatio: (root, node, input) => {
		node.setAspectRatio(convertNumber(input));
	},
	borderTopWidth: (root, node, input) => {
		node.setBorder(1, convertNumber(input));
	},
	borderLeftWidth: (root, node, input) => {
		node.setBorder(0, convertNumber(input));
	},
	borderRightWidth: (root, node, input) => {
		node.setBorder(2, convertNumber(input));
	},
	borderBottomWidth: (root, node, input) => {
		node.setBorder(3, convertNumber(input));
	},
	overflow: (root, node, input) => {
		node.setOverflow(convertEnum(OVERFLOW_LUT, input, 0));
	},
	display: (root, node, input) => {
		node.setDisplay(convertEnum(DISPLAY_LUT, input, 0));
	},
	paddingTop: (root, node, input) => {
		node.setPadding(1, convertPoint(input, root));
	},
	paddingLeft: (root, node, input) => {
		node.setPadding(0, convertPoint(input, root));
	},
	paddingRight: (root, node, input) => {
		node.setPadding(2, convertPoint(input, root));
	},
	paddingBottom: (root, node, input) => {
		node.setPadding(3, convertPoint(input, root));
	},
	gapRow: (root, node, input) => {
		node.setGap(1, convertPoint(input, root));
	},
	gapColumn: (root, node, input) => {
		node.setGap(0, convertPoint(input, root));
	},
	direction: (root, node, input) => {
		node.setDirection(convertNumber(input) ?? 0);
	}
};
function createDefaultConfig(Config) {
	const config = Config.create();
	config.setUseWebDefaults(true);
	config.setPointScaleFactor(100);
	config.setExperimentalFeatureEnabled(ExperimentalFeature.WebFlexBasis, true);
	return config;
}
var create = y(void 0);
loadYoga().then(({ Node, Config }) => {
	const config = createDefaultConfig(Config);
	create.value = () => Node.create(config);
}).catch(console.error);
var createYogaNode = () => create.value?.();
// node_modules/@pmndrs/uikit/dist/flex/node.js
function hasImmediateProperty(key) {
	if (key === "measureFunc") return true;
	return key in setter;
}
var FlexNode = class {
	component;
	children = [];
	yogaNode;
	layoutChangeListeners = /* @__PURE__ */ new Set();
	customLayouting;
	active = y(false);
	constructor(component) {
		this.component = component;
		abortableEffect(() => {
			const yogaNode = createYogaNode();
			if (yogaNode == null) return;
			this.yogaNode = yogaNode;
			this.active.value = true;
			this.updateMeasureFunction();
			return () => {
				this.yogaNode?.getParent()?.removeChild(this.yogaNode);
				this.yogaNode?.free();
			};
		}, component.abortSignal);
		abortableEffect(() => {
			if (!component.properties.enabled.value || !this.active.value) return;
			const internalAbort = new AbortController();
			const unsubscribe = component.properties.subscribePropertyKeys((key) => {
				if (!hasImmediateProperty(key)) return;
				abortableEffect(() => {
					setter[key](component.root.value, this.yogaNode, component.properties.value[key]);
					this.component.root.peek().requestCalculateLayout();
				}, internalAbort.signal);
			});
			return () => {
				unsubscribe();
				internalAbort.abort();
			};
		}, component.abortSignal);
		abortableEffect(() => {
			const parentContainer = component.parentContainer.value;
			if (parentContainer == null) return;
			parentContainer.node.addChild(this);
			return () => parentContainer.node.removeChild(this);
		}, component.abortSignal);
	}
	setCustomLayouting(layouting) {
		this.customLayouting = layouting;
		this.updateMeasureFunction();
	}
	updateMeasureFunction() {
		if (this.customLayouting == null || !this.active.value) return;
		setMeasureFunc(this.yogaNode, this.customLayouting.measure);
		this.component.root.peek().requestCalculateLayout();
	}
	/**
	* use requestCalculateLayout instead
	*/
	calculateLayout() {
		if (this.yogaNode == null) return;
		this.commit(this.yogaNode.getFlexDirection());
		this.yogaNode.calculateLayout(void 0, void 0);
		r(() => this.updateMeasurements(true, void 0, void 0));
	}
	addChild(node) {
		this.children.push(node);
		this.component.root.peek().requestCalculateLayout();
	}
	removeChild(node) {
		const i = this.children.indexOf(node);
		if (i === -1) return;
		this.children.splice(i, 1);
		this.component.root.peek().requestCalculateLayout();
	}
	commit(parentDirection) {
		if (this.yogaNode == null) throw new Error(`commit cannot be called without a yoga node`);
		/** ---- START : adaptation of yoga's behavior to align more to the web behavior ---- */
		const parentDirectionVertical = parentDirection === FlexDirection.Column || parentDirection === FlexDirection.ColumnReverse;
		if (this.customLayouting != null && this.component.properties.peek()[parentDirectionVertical ? "minHeight" : "minWidth"] === void 0) this.yogaNode[parentDirectionVertical ? "setMinHeight" : "setMinWidth"](parentDirectionVertical ? this.customLayouting.minHeight : this.customLayouting.minWidth);
		if (this.component.properties.peek().flexShrink == null) {
			const hasHeight = this.component.properties.peek().height != null;
			this.yogaNode.setFlexShrink(hasHeight && parentDirectionVertical ? 0 : void 0);
		}
		/** ---- END ---- */
		let groupChildren;
		this.children.sort((child1, child2) => {
			groupChildren ??= child1.component.parent?.children;
			if (groupChildren == null) return 0;
			const group1 = child1.component;
			const group2 = child2.component;
			const i1 = groupChildren.indexOf(group1);
			if (i1 === -1) throw new Error(`parent mismatch`);
			const i2 = groupChildren.indexOf(group2);
			if (i2 === -1) throw new Error(`parent mismatch`);
			return i1 - i2;
		});
		let i = 0;
		let oldChildNode = this.yogaNode.getChild(i);
		let correctChild = this.children[i];
		while (correctChild != null || oldChildNode != null) {
			if (correctChild != null && oldChildNode != null && yogaNodeEqual(oldChildNode, assertNodeNotNull(correctChild.yogaNode))) {
				correctChild = this.children[++i];
				oldChildNode = this.yogaNode.getChild(i);
				continue;
			}
			if (oldChildNode != null) this.yogaNode.removeChild(oldChildNode);
			if (correctChild != null) {
				const node = assertNodeNotNull(correctChild.yogaNode);
				node.getParent()?.removeChild(node);
				this.yogaNode.insertChild(node, i);
				correctChild = this.children[++i];
			}
			oldChildNode = this.yogaNode.getChild(i);
		}
		const childrenLength = this.children.length;
		for (let i = 0; i < childrenLength; i++) this.children[i].commit(this.yogaNode.getFlexDirection());
	}
	updateMeasurements(displayed, parentWidth, parentHeight) {
		if (this.yogaNode == null) throw new Error(`update measurements cannot be called without a yoga node`);
		this.component.overflow.value = this.yogaNode.getOverflow();
		displayed &&= this.yogaNode.getDisplay() != Display.None;
		this.component.displayed.value = displayed;
		const width = this.yogaNode.getComputedWidth();
		const height = this.yogaNode.getComputedHeight();
		updateVector2Signal(this.component.size, width, height);
		parentWidth ??= width;
		parentHeight ??= height;
		const x = this.yogaNode.getComputedLeft();
		const y = this.yogaNode.getComputedTop();
		const relativeCenterX = x + width * .5 - parentWidth * .5;
		const relativeCenterY = -(y + height * .5 - parentHeight * .5);
		updateVector2Signal(this.component.relativeCenter, relativeCenterX, relativeCenterY);
		const paddingTop = this.yogaNode.getComputedPadding(Edge.Top);
		const paddingLeft = this.yogaNode.getComputedPadding(Edge.Left);
		const paddingRight = this.yogaNode.getComputedPadding(Edge.Right);
		const paddingBottom = this.yogaNode.getComputedPadding(Edge.Bottom);
		updateInsetSignal(this.component.paddingInset, paddingTop, paddingRight, paddingBottom, paddingLeft);
		const borderTop = this.yogaNode.getComputedBorder(Edge.Top);
		const borderRight = this.yogaNode.getComputedBorder(Edge.Right);
		const borderBottom = this.yogaNode.getComputedBorder(Edge.Bottom);
		const borderLeft = this.yogaNode.getComputedBorder(Edge.Left);
		updateInsetSignal(this.component.borderInset, borderTop, borderRight, borderBottom, borderLeft);
		for (const layoutChangeListener of this.layoutChangeListeners) layoutChangeListener();
		const childrenLength = this.children.length;
		let maxContentWidth = 0;
		let maxContentHeight = 0;
		for (let i = 0; i < childrenLength; i++) {
			const [contentWidth, contentHeight] = this.children[i].updateMeasurements(displayed, width, height);
			maxContentWidth = Math.max(maxContentWidth, contentWidth);
			maxContentHeight = Math.max(maxContentHeight, contentHeight);
		}
		maxContentWidth -= borderLeft;
		maxContentHeight -= borderTop;
		if (this.component.overflow.value === Overflow.Scroll) {
			maxContentWidth += paddingRight;
			maxContentHeight += paddingBottom;
			const widthWithoutBorder = width - borderLeft - borderRight;
			const heightWithoutBorder = height - borderTop - borderBottom;
			const maxScrollX = maxContentWidth - widthWithoutBorder;
			const maxScrollY = maxContentHeight - heightWithoutBorder;
			const xScrollable = maxScrollX > .5;
			const yScrollable = maxScrollY > .5;
			updateVector2Signal(this.component.maxScrollPosition, xScrollable ? maxScrollX : void 0, yScrollable ? maxScrollY : void 0);
			updateVector2Signal(this.component.scrollable, xScrollable, yScrollable);
		} else {
			updateVector2Signal(this.component.maxScrollPosition, void 0, void 0);
			updateVector2Signal(this.component.scrollable, false, false);
		}
		const overflowVisible = this.component.overflow.value === Overflow.Visible;
		return [x + Math.max(width, overflowVisible ? maxContentWidth : 0), y + Math.max(height, overflowVisible ? maxContentHeight : 0)];
	}
	addLayoutChangeListener(listener) {
		this.layoutChangeListeners.add(listener);
		return () => void this.layoutChangeListeners.delete(listener);
	}
};
function setMeasureFunc(node, func) {
	if (func == null) {
		node.setMeasureFunc(null);
		return;
	}
	node.setMeasureFunc((width, widthMode, height, heightMode) => {
		const result = func(width, widthMode, height, heightMode);
		result.width = Math.ceil(result.width * 100) / 100;
		result.height = Math.ceil(result.height * 100) / 100;
		return result;
	});
	node.markDirty();
}
function updateVector2Signal(signal, x, y) {
	const current = signal.value;
	if (current != null) {
		const [oldX, oldY] = current;
		if (oldX === x && oldY === y) return;
	}
	signal.value = [x, y];
}
function updateInsetSignal(signal, top, right, bottom, left) {
	const current = signal.value;
	if (current != null) {
		const [oldTop, oldRight, oldBottom, oldLeft] = current;
		if (oldTop == top && oldRight == right && oldBottom == bottom && oldLeft == left) return;
	}
	signal.value = [
		top,
		right,
		bottom,
		left
	];
}
function assertNodeNotNull(val) {
	if (val == null) throw new Error(`commit cannot be called with a children that miss a yoga node`);
	return val;
}
function yogaNodeEqual(n1, n2) {
	return n1["M"]["O"] === n2["M"]["O"];
}
var allAliases = Object.assign({}, {
	borderWidth: [
		"borderBottomWidth",
		"borderTopWidth",
		"borderLeftWidth",
		"borderRightWidth"
	],
	borderXWidth: ["borderLeftWidth", "borderRightWidth"],
	borderYWidth: ["borderTopWidth", "borderBottomWidth"],
	inset: [
		"positionTop",
		"positionLeft",
		"positionRight",
		"positionBottom"
	],
	padding: [
		"paddingBottom",
		"paddingTop",
		"paddingLeft",
		"paddingRight"
	],
	paddingX: ["paddingLeft", "paddingRight"],
	paddingInline: ["paddingLeft", "paddingRight"],
	paddingInlineStart: ["paddingLeft"],
	paddingInlineEnd: ["paddingRight"],
	paddingY: ["paddingTop", "paddingBottom"],
	paddingBlock: ["paddingTop", "paddingBottom"],
	paddingBlockStart: ["paddingTop"],
	paddingBlockEnd: ["paddingBottom"],
	margin: [
		"marginBottom",
		"marginTop",
		"marginLeft",
		"marginRight"
	],
	marginX: ["marginLeft", "marginRight"],
	marginInline: ["marginLeft", "marginRight"],
	marginInlineStart: ["marginLeft"],
	marginInlineEnd: ["marginRight"],
	marginY: ["marginTop", "marginBottom"],
	marginBlock: ["marginTop", "marginBottom"],
	marginBlockStart: ["marginTop"],
	marginBlockEnd: ["marginBottom"],
	gap: ["gapRow", "gapColumn"]
}, {
	borderRadius: [
		"borderTopLeftRadius",
		"borderTopRightRadius",
		"borderBottomLeftRadius",
		"borderBottomRightRadius"
	],
	borderTopRadius: ["borderTopLeftRadius", "borderTopRightRadius"],
	borderLeftRadius: ["borderTopLeftRadius", "borderBottomLeftRadius"],
	borderRightRadius: ["borderTopRightRadius", "borderBottomRightRadius"],
	borderBottomRadius: ["borderBottomLeftRadius", "borderBottomRightRadius"]
}, {
	scrollbarBorderRadius: [
		"scrollbarBorderTopLeftRadius",
		"scrollbarBorderTopRightRadius",
		"scrollbarBorderBottomLeftRadius",
		"scrollbarBorderBottomRightRadius"
	],
	scrollbarBorderTopRadius: ["scrollbarBorderTopLeftRadius", "scrollbarBorderTopRightRadius"],
	scrollbarBorderLeftRadius: ["scrollbarBorderTopLeftRadius", "scrollbarBorderBottomLeftRadius"],
	scrollbarBorderRightRadius: ["scrollbarBorderTopRightRadius", "scrollbarBorderBottomRightRadius"],
	scrollbarBorderBottomRadius: ["scrollbarBorderBottomLeftRadius", "scrollbarBorderBottomRightRadius"],
	scrollbarBorderWidth: [
		"scrollbarBorderBottomWidth",
		"scrollbarBorderTopWidth",
		"scrollbarBorderLeftWidth",
		"scrollbarBorderRightWidth"
	],
	scrollbarBorderXWidth: ["scrollbarBorderLeftWidth", "scrollbarBorderRightWidth"],
	scrollbarBorderYWidth: ["scrollbarBorderTopWidth", "scrollbarBorderBottomWidth"]
}, { transformScale: [
	"transformScaleX",
	"transformScaleY",
	"transformScaleZ"
] }, {
	caretBorderRadius: [
		"caretBorderTopLeftRadius",
		"caretBorderTopRightRadius",
		"caretBorderBottomLeftRadius",
		"caretBorderBottomRightRadius"
	],
	caretBorderTopRadius: ["caretBorderTopLeftRadius", "caretBorderTopRightRadius"],
	caretBorderLeftRadius: ["caretBorderTopLeftRadius", "caretBorderBottomLeftRadius"],
	caretBorderRightRadius: ["caretBorderTopRightRadius", "caretBorderBottomRightRadius"],
	caretBorderBottomRadius: ["caretBorderBottomLeftRadius", "caretBorderBottomRightRadius"],
	caretBorderWidth: [
		"caretBorderBottomWidth",
		"caretBorderTopWidth",
		"caretBorderLeftWidth",
		"caretBorderRightWidth"
	],
	caretBorderXWidth: ["caretBorderLeftWidth", "caretBorderRightWidth"],
	caretBorderYWidth: ["caretBorderTopWidth", "caretBorderBottomWidth"]
}, {
	selectionBorderRadius: [
		"selectionBorderTopLeftRadius",
		"selectionBorderTopRightRadius",
		"selectionBorderBottomLeftRadius",
		"selectionBorderBottomRightRadius"
	],
	selectionBorderTopRadius: ["selectionBorderTopLeftRadius", "selectionBorderTopRightRadius"],
	selectionBorderLeftRadius: ["selectionBorderTopLeftRadius", "selectionBorderBottomLeftRadius"],
	selectionBorderRightRadius: ["selectionBorderTopRightRadius", "selectionBorderBottomRightRadius"],
	selectionBorderBottomRadius: ["selectionBorderBottomLeftRadius", "selectionBorderBottomRightRadius"],
	selectionBorderWidth: [
		"selectionBorderBottomWidth",
		"selectionBorderTopWidth",
		"selectionBorderLeftWidth",
		"selectionBorderRightWidth"
	],
	selectionBorderXWidth: ["selectionBorderLeftWidth", "selectionBorderRightWidth"],
	selectionBorderYWidth: ["selectionBorderTopWidth", "selectionBorderBottomWidth"]
});
// node_modules/@pmndrs/uikit/dist/preferred-color-scheme.js
var queryList = typeof matchMedia === "undefined" ? void 0 : matchMedia?.("(prefers-color-scheme: dark)");
var symstemIsDarkMode = y(queryList?.matches ?? false);
queryList?.addEventListener("change", (event) => symstemIsDarkMode.value = event.matches);
var preferredColorScheme = y("system");
var isDarkMode = O(() => {
	switch (preferredColorScheme.value) {
		case "system": return symstemIsDarkMode.value;
		case "dark": return true;
		case "light": return false;
	}
});
// node_modules/@pmndrs/uikit/dist/properties/conditional.js
var breakPoints = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	"2xl": 1536
};
var breakPointKeys = Object.keys(breakPoints);
var breakPointKeysLength = breakPointKeys.length;
function createResponsiveConditionals(root) {
	const conditionals = {};
	for (let i = 0; i < breakPointKeysLength; i++) {
		const key = breakPointKeys[i];
		conditionals[key] = () => {
			return (root.value.component.size.value?.[0] ?? 0) > breakPoints[key];
		};
	}
	return conditionals;
}
function createHoverConditionals(hoveredSignal) {
	return { hover: () => hoveredSignal.value.length > 0 };
}
function createActivePropertyTransfomers(activeSignal) {
	return { active: () => activeSignal.value.length > 0 };
}
var preferredColorSchemeConditionals = { dark: () => isDarkMode.value };
function createFocusPropertyTransformers(hasFocusSignal) {
	if (hasFocusSignal == null) return { focus: () => false };
	return { focus: () => hasFocusSignal.value };
}
function createPlaceholderPropertyTransformers(isPlaceholder) {
	if (isPlaceholder == null) return { placeholderStyle: () => false };
	return { placeholderStyle: () => isPlaceholder.value };
}
var conditionalKeys = [
	"dark",
	"hover",
	"active",
	"focus",
	...breakPointKeys
];
function createConditionals(root, hoveredSignal, activeSignal, hasFocusSignal, isPlaceholderSignal) {
	return {
		...preferredColorSchemeConditionals,
		...createResponsiveConditionals(root),
		...createHoverConditionals(hoveredSignal),
		...createActivePropertyTransfomers(activeSignal),
		...createFocusPropertyTransformers(hasFocusSignal),
		...createPlaceholderPropertyTransformers(isPlaceholderSignal)
	};
}
// node_modules/@pmndrs/uikit-pub-sub/dist/index.js
var PropertiesImplementation$1 = class {
	apply;
	defaults;
	onLayerIndicesChanged;
	enabled = y(false);
	value = new Proxy({}, { get: (_target, key) => this.getSignal(key).value });
	signal = new Proxy({}, { get: (_target, key) => this.getSignal(key) });
	peekProxy = new Proxy({}, { get: (_target, key) => this.peekValue(key) });
	propertyStateMap = {};
	propertiesLayers = /* @__PURE__ */ new Map();
	sortedLayerIndices;
	propertyKeys;
	propertyKeySubscriptions = /* @__PURE__ */ new Set();
	constructor(apply, defaults, onLayerIndicesChanged) {
		this.apply = apply;
		this.defaults = defaults;
		this.onLayerIndicesChanged = onLayerIndicesChanged;
		this.propertyKeys = defaults == null ? [] : Array.from(Object.keys(defaults));
	}
	peek() {
		return this.peekProxy;
	}
	getSortedLayerIndices() {
		return this.sortedLayerIndices ??= Array.from(this.propertiesLayers.keys()).sort((a, b) => a - b);
	}
	subscribePropertyKeys(callback) {
		for (const key of this.propertyKeys) callback(key);
		this.propertyKeySubscriptions.add(callback);
		return () => this.propertyKeySubscriptions.delete(callback);
	}
	clearProvidedLayer(layer, index) {
		this.propertiesLayers.delete(index);
		this.sortedLayerIndices = void 0;
		for (const key in layer) {
			if (layer[key] === void 0) continue;
			const propertyState = this.propertyStateMap[key];
			if (propertyState == null) continue;
			propertyState.cleanup?.();
			propertyState.cleanup = void 0;
			if (propertyState.layerIndex != index) continue;
			this.update(key, propertyState);
		}
	}
	setLayer(index, value) {
		let layer = this.propertiesLayers.get(index);
		const isNewLayer = layer == null;
		r(() => {
			if (layer != null) this.clearProvidedLayer(layer, index);
			if (value === void 0) return;
			this.propertiesLayers.set(index, layer = {});
			this.sortedLayerIndices = void 0;
			const entries = Object.entries(value);
			for (const [key, value] of entries) this.apply(key, value, this.setProperty.bind(this, layer, index), index);
		});
		if (isNewLayer) this.onLayerIndicesChanged?.();
	}
	getSignal(key) {
		let propertyState = this.propertyStateMap[key];
		if (propertyState == null) {
			this.propertyStateMap[key] = propertyState = {
				signal: new l(),
				layerIndex: null
			};
			this.update(key, propertyState);
		}
		return propertyState.signal;
	}
	peekValue(key) {
		let propertyState = this.propertyStateMap[key];
		if (propertyState != null) return propertyState.signal.peek();
		const defaultValue = this.defaults?.[key];
		const layerIndices = this.getSortedLayerIndices();
		const [result] = f(() => selectLayerValue(0, layerIndices, this.propertiesLayers, key, defaultValue));
		return result;
	}
	set(layerIndex, key, value) {
		let propertiesLayer = this.propertiesLayers.get(layerIndex);
		if (propertiesLayer == null) {
			this.propertiesLayers.set(layerIndex, propertiesLayer = {});
			this.sortedLayerIndices = void 0;
		}
		this.apply(key, value, this.setProperty.bind(this, propertiesLayer, layerIndex), layerIndex);
	}
	setProperty(propertiesLayer, layerIndex, key, value) {
		if (!this.propertyKeys.includes(key)) {
			this.propertyKeys.push(key);
			for (const callback of this.propertyKeySubscriptions) callback(key);
		}
		if (propertiesLayer[key] === value) return;
		propertiesLayer[key] = value;
		const propertyState = this.propertyStateMap[key];
		if (propertyState == null) return;
		if (propertyState.layerIndex != null && layerIndex > propertyState.layerIndex) return;
		if (!this.enabled.peek()) return;
		this.update(key, propertyState);
	}
	update(key, target) {
		target.cleanup?.();
		target.cleanup = void 0;
		const defaultValue = this.defaults?.[key];
		let result;
		if (this.enabled.peek()) result = selectLayerValue(0, this.getSortedLayerIndices(), this.propertiesLayers, key, defaultValue, (layerIndex) => target.cleanup = x(() => {
			const [value, index] = selectLayerValue(layerIndex, this.getSortedLayerIndices(), this.propertiesLayers, key, defaultValue);
			target.signal.value = value;
			target.layerIndex = index;
		}));
		else if (defaultValue instanceof l) result = [defaultValue.peek(), Infinity];
		else result = [defaultValue, Number.MAX_SAFE_INTEGER];
		if (result == null) return;
		const [value, index] = result;
		target.signal.value = value;
		target.layerIndex = index;
	}
	setEnabled(enabled) {
		if (this.enabled.peek() === enabled) return;
		this.enabled.value = enabled;
		this.updateAll();
	}
	updateAll() {
		for (const key in this.propertyStateMap) this.update(key, this.propertyStateMap[key]);
	}
	destroy() {
		for (const key in this.propertyStateMap) this.propertyStateMap[key].cleanup?.();
		this.propertyStateMap = {};
		this.propertyKeySubscriptions.clear();
	}
};
function selectLayerValue(startLayerIndex, sortedLayerIndexArray, propertiesLayers, key, defaultValue, onSignal) {
	let value;
	let layerIndex;
	const layerIndicies = sortedLayerIndexArray[Symbol.iterator]();
	do {
		layerIndex = layerIndicies.next().value ?? Number.MAX_SAFE_INTEGER;
		if (layerIndex < startLayerIndex) continue;
		value = layerIndex === Number.MAX_SAFE_INTEGER ? defaultValue : propertiesLayers.get(layerIndex)[key];
		if (typeof value === "object" && value instanceof l) {
			if (onSignal != null) {
				onSignal(layerIndex);
				return;
			}
			value = value.value;
		}
		if (value !== void 0) break;
	} while (layerIndex != Number.MAX_SAFE_INTEGER);
	if (value === "initial") value = defaultValue;
	return [value, layerIndex];
}
// node_modules/@pmndrs/uikit/dist/properties/layer.js
var MaxClassAmount = 1e3;
var LayersSectionSize = 1002;
var SectionStartIndexMap = {
	important: 0,
	placeholderStyle: LayersSectionSize * 1,
	focus: LayersSectionSize * 2,
	active: LayersSectionSize * 3,
	hover: LayersSectionSize * 4,
	dark: LayersSectionSize * 5,
	"2xl": LayersSectionSize * 6,
	xl: LayersSectionSize * 7,
	lg: LayersSectionSize * 8,
	md: LayersSectionSize * 9,
	sm: LayersSectionSize * 10,
	base: LayersSectionSize * 11
};
var SpecialLayerSections = Object.keys(SectionStartIndexMap).filter((layer) => layer != "base");
function getLayerIndex(identifier) {
	if (identifier.type != "class" && identifier.type != "default-overrides" && identifier.type != "base") {
		if (identifier.type === "star-inheritance") return LayersSectionSize * 12;
		return 12025;
	}
	const sectionStartIndex = SectionStartIndexMap[identifier.section];
	if (identifier.type != "class") {
		if (identifier.type === "default-overrides") return sectionStartIndex + MaxClassAmount + 1;
		return sectionStartIndex;
	}
	const classIndex = identifier.classIndex;
	if (classIndex >= MaxClassAmount) throw new Error(`class index "${classIndex}" exceeds the maximum number of classes (${MaxClassAmount})`);
	return sectionStartIndex + 999 - classIndex + 1;
}
// node_modules/@pmndrs/uikit/dist/properties/defaults.js
var componentDefaults = {
	scrollbarWidth: 10,
	visibility: "visible",
	opacity: 1,
	depthTest: true,
	renderOrder: 0,
	fontSize: 16,
	letterSpacing: 0,
	lineHeight: "120%",
	wordBreak: "break-word",
	verticalAlign: "middle",
	textAlign: "left",
	fontWeight: "normal",
	caretWidth: 1.5,
	receiveShadow: false,
	castShadow: false,
	panelMaterialClass: MeshBasicMaterial,
	pixelSize: .01,
	anchorX: "center",
	anchorY: "center",
	tabSize: 8,
	whiteSpace: "normal"
};
// node_modules/@pmndrs/uikit/dist/properties/index.js
var PropertiesImplementation = class extends PropertiesImplementation$1 {
	conditionals;
	usedConditionals = {
		hover: y(false),
		active: y(false)
	};
	constructor(aliases, conditionals, defaults) {
		super((key, value, set) => {
			if (key in aliases) {
				const aliasList = aliases[key];
				for (const alias of aliasList) set(alias, value);
				return;
			}
			set(key, value);
		}, defaults, () => {
			this.usedConditionals.active.value = hasConditional(this.propertiesLayers, "active");
			this.usedConditionals.hover.value = hasConditional(this.propertiesLayers, "hover");
		});
		this.conditionals = conditionals;
	}
	setLayersWithConditionals(layerInSectionIdentifier, properties) {
		r(() => {
			this.setLayer(getLayerIndex({
				...layerInSectionIdentifier,
				section: "base"
			}), properties);
			for (const layerSection of SpecialLayerSections) {
				const layerIndex = getLayerIndex({
					...layerInSectionIdentifier,
					section: layerSection
				});
				if (properties == null || !(layerSection in properties)) {
					this.setLayer(layerIndex, void 0);
					continue;
				}
				const getConditional = layerSection != "important" ? this.conditionals[layerSection] : void 0;
				let conditionalProperties = properties[layerSection];
				if (getConditional != null) conditionalProperties = Object.fromEntries(Object.entries(conditionalProperties).map(([key, value]) => [key, O(() => getConditional() ? value instanceof l ? value.value : value : void 0)]));
				this.setLayer(layerIndex, conditionalProperties);
			}
		});
	}
};
function hasConditional(propertiesLayers, layerSection) {
	const layerSectionStart = getLayerIndex({
		type: "base",
		section: layerSection
	});
	for (const propertyLayerIndex of propertiesLayers.keys()) if (layerSectionStart <= propertyLayerIndex && propertyLayerIndex < layerSectionStart + 1002) return true;
	return false;
}
// node_modules/@pmndrs/uikit/dist/transform.js
var tHelper = new Vector3();
var sHelper = new Vector3();
var originVector = new Vector3();
var matrixHelper = new Matrix4();
var eulerHelper = new Euler();
var quaternionHelper = new Quaternion();
var toRad = Math.PI / 180;
function toQuaternion([x, y, z]) {
	return quaternionHelper.setFromEuler(eulerHelper.set(x * toRad, y * toRad, z * toRad));
}
var defaultTransformOriginX = "center";
var defaultTransformOriginY = "center";
function computedTransformMatrix({ relativeCenter, size, properties, root }) {
	return O(() => {
		const relativeCenterValue = relativeCenter.value;
		if (relativeCenterValue == null) return;
		const [x, y] = relativeCenterValue;
		const pixelSize = parseNumberValue(properties.value.pixelSize);
		const result = new Matrix4().makeTranslation(x * pixelSize, y * pixelSize, 0);
		let originCenter = true;
		const tOX = properties.value.transformOriginX ?? defaultTransformOriginX;
		const tOY = properties.value.transformOriginY ?? defaultTransformOriginY;
		if (tOX != "center" || tOY != "center") {
			const sizeValue = size.value;
			if (sizeValue == null) return;
			const [width, height] = sizeValue;
			originCenter = false;
			originVector.set(-alignmentXMap[tOX] * width * pixelSize, -alignmentYMap[tOY] * height * pixelSize, 0);
			result.multiply(matrixHelper.makeTranslation(originVector));
			originVector.negate();
		}
		const tTX = properties.value.transformTranslateX ?? 0;
		const tTY = properties.value.transformTranslateY ?? 0;
		const tTZ = properties.value.transformTranslateZ ?? 0;
		const tRX = properties.value.transformRotateX ?? 0;
		const tRY = properties.value.transformRotateY ?? 0;
		const tRZ = properties.value.transformRotateZ ?? 0;
		const tSX = properties.value.transformScaleX ?? 1;
		const tSY = properties.value.transformScaleY ?? 1;
		const tSZ = properties.value.transformScaleZ ?? 1;
		const r = [
			parseNumberValue(tRX),
			parseNumberValue(tRY),
			parseNumberValue(tRZ)
		];
		const t = [
			toAbsoluteNumber(tTX, () => size.value?.[0] ?? 0, root.value),
			-toAbsoluteNumber(tTY, () => size.value?.[1] ?? 0, root.value),
			toAbsoluteNumber(tTZ)
		];
		const s = [
			toAbsoluteNumber(tSX, () => 1, root.value),
			toAbsoluteNumber(tSY, () => 1, root.value),
			toAbsoluteNumber(tSZ, () => 1, root.value)
		];
		if (t.some((v) => v != 0) || r.some((v) => v != 0) || s.some((v) => v != 1)) result.multiply(matrixHelper.compose(tHelper.fromArray(t).multiplyScalar(pixelSize), toQuaternion(r), sHelper.fromArray(s)));
		if (!originCenter) result.multiply(matrixHelper.makeTranslation(originVector));
		return result;
	});
}
// node_modules/@pmndrs/uikit/dist/components/classes.js
var StyleSheet = {};
var ClassList = class {
	properties;
	starProperties;
	list = [];
	constructor(properties, starProperties) {
		this.properties = properties;
		this.starProperties = starProperties;
	}
	*[Symbol.iterator]() {
		for (const entry in this.list) if (entry != null) yield entry;
	}
	set(...classes) {
		const length = Math.max(classes.length, this.list.length);
		this.list.length = classes.length;
		for (let classIndex = 0; classIndex < length; classIndex++) {
			const identifier = {
				type: "class",
				classIndex
			};
			const classRef = classes[classIndex];
			let resolvedClass = classRef == null ? void 0 : this.resolveClassRef(classRef);
			this.properties.setLayersWithConditionals(identifier, resolvedClass);
			this.starProperties.setLayersWithConditionals(identifier, getStarProperties(resolvedClass));
		}
	}
	add(...classes) {
		r(() => {
			for (const classRef of classes) {
				let classIndex = 0;
				while (this.list[classIndex] != null) classIndex++;
				this.list[classIndex] = classRef;
				const identifier = {
					type: "class",
					classIndex
				};
				const resolvedClass = this.resolveClassRef(classRef);
				this.properties.setLayersWithConditionals(identifier, resolvedClass);
				this.starProperties.setLayersWithConditionals(identifier, getStarProperties(resolvedClass));
			}
		});
	}
	remove(...classes) {
		r(() => {
			for (const classRef of classes) {
				const classIndex = this.list.indexOf(classRef);
				if (classIndex === -1) {
					console.warn(`Class '${classRef}' not found in the classList`);
					return;
				}
				if (classIndex + 1 === this.list.length) this.list.splice(classIndex, 1);
				else this.list[classIndex] = void 0;
				const identifier = {
					type: "class",
					classIndex
				};
				this.properties.setLayersWithConditionals(identifier, void 0);
				this.starProperties.setLayersWithConditionals(identifier, void 0);
			}
		});
	}
	toggle(classRef) {
		if (this.contains(classRef)) this.remove(classRef);
		else this.add(classRef);
	}
	contains(classRef) {
		return this.list.includes(classRef);
	}
	replace(oldToken, newToken) {
		if (!this.contains(oldToken)) return false;
		this.remove(oldToken);
		this.add(newToken);
		return true;
	}
	resolveClassRef(classRef) {
		if (classRef == null) return;
		if (typeof classRef != "string") return classRef;
		if (!(classRef in StyleSheet)) {
			console.warn(`class "${classRef}" not present in the global stylesheet`);
			return;
		}
		return StyleSheet[classRef];
	}
};
function getStarProperties(properties) {
	if (properties == null) return;
	let result;
	if ("*" in properties) result = { ...properties["*"] };
	for (const conditionalKey in conditionalKeys) {
		const conditionalEntry = properties[conditionalKey]?.["*"];
		if (conditionalEntry == null) continue;
		result ??= {};
		result[conditionalKey] = conditionalEntry;
	}
	return result;
}
// node_modules/@pmndrs/uikit/dist/text/render/instanced-glyph-material.js
var InstancedGlyphMaterial = class extends MeshBasicMaterial {
	constructor(font) {
		super({
			transparent: true,
			depthWrite: false,
			toneMapped: false
		});
		this.onBeforeCompile = (parameters, renderer) => {
			font.page.anisotropy = renderer.capabilities.getMaxAnisotropy();
			parameters.uniforms.fontPage = { value: font.page };
			parameters.uniforms.pageSize = { value: [font.pageWidth, font.pageHeight] };
			parameters.uniforms.distanceRange = { value: font.distanceRange };
			parameters.vertexShader = `attribute vec4 instanceUVOffset;
        varying vec2 fontUv;
        attribute vec4 instanceRGBA;
        varying vec4 rgba;
        attribute mat4 instanceClipping;
        varying mat4 clipping;
        varying vec3 localPosition;
        attribute float instanceRenderSolid;
        varying float renderSolid;
        ` + parameters.vertexShader;
			parameters.vertexShader = parameters.vertexShader.replace("#include <uv_vertex>", `#include <uv_vertex>
            fontUv = instanceUVOffset.xy + uv * instanceUVOffset.zw;
            rgba = instanceRGBA;
            clipping = instanceClipping;
            localPosition = (instanceMatrix * vec4(position, 1.0)).xyz;
            renderSolid = instanceRenderSolid;`);
			parameters.fragmentShader = `uniform sampler2D fontPage;
            uniform vec2 pageSize;
            uniform int distanceRange;
        varying vec2 fontUv;
        varying vec4 rgba;
        varying mat4 clipping;
        varying vec3 localPosition;
        varying float renderSolid;
        float median(float r, float g, float b) {
            return max(min(r, g), min(max(r, g), b));
        }
        float getDistance() {
            vec3 msdf = texture(fontPage, fontUv).rgb;
            return median(msdf.r, msdf.g, msdf.b);
        }
        ` + parameters.fragmentShader;
			parameters.fragmentShader = parameters.fragmentShader.replace("#include <map_fragment>", ` #include <map_fragment>
          vec4 plane;
          float distanceToPlane, distanceGradient;
          float clipOpacity = 1.0;
          for(int i = 0; i < 4; i++) {
            plane = clipping[ i ];
            distanceToPlane = dot( localPosition, plane.xyz ) + plane.w;
            distanceGradient = max(fwidth( distanceToPlane ) / 2.0, 0.00001);
            clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );

            if ( clipOpacity == 0.0 ) discard;
          }
          // Distance to the edge of the glyph in texels.
          float dist = (getDistance() - 0.5) * float(distanceRange);

          // Calculate the antialiasing distance based on the number of texels per screen pixel.
          float aaDist = length(fwidth(fontUv * pageSize)) * 0.5;

          // Clamp the antialiasing distance to avoid excessive blurring.
          aaDist = clamp(aaDist, 0.0, float(distanceRange) * 0.5);

          float alpha = smoothstep(-aaDist, aaDist, dist);

          if (alpha <= 0.0 && renderSolid <= 0.5) discard;

          // Apply gamma correction to improve text appearance, or override for synthetic solid glyphs.
          float gamma = 1.3;
          alpha = renderSolid > 0.5 ? 1.0 : pow(alpha, 1.0 / gamma);

          diffuseColor.a *= clipOpacity * alpha;
          diffuseColor *= rgba;
            `);
		};
	}
};
// node_modules/@pmndrs/uikit/dist/text/render/instanced-glyph-mesh.js
var InstancedGlyphMesh = class InstancedGlyphMesh extends Mesh {
	root;
	instanceMatrix;
	instanceRGBA;
	instanceUV;
	instanceClipping;
	instanceRenderSolid;
	count = 0;
	isInstancedMesh = true;
	instanceColor = null;
	morphTexture = null;
	boundingBox = new Box3();
	boundingSphere = new Sphere();
	customUpdateMatrixWorld = () => computeWorldToGlobalMatrix(this.root, this.matrixWorld);
	constructor(root, instanceMatrix, instanceRGBA, instanceUV, instanceClipping, instanceRenderSolid, material) {
		const planeGeometry = new PlaneGeometry();
		planeGeometry.translate(.5, -.5, 0);
		super(planeGeometry, material);
		this.root = root;
		this.instanceMatrix = instanceMatrix;
		this.instanceRGBA = instanceRGBA;
		this.instanceUV = instanceUV;
		this.instanceClipping = instanceClipping;
		this.instanceRenderSolid = instanceRenderSolid;
		this.pointerEvents = "none";
		planeGeometry.attributes.instanceUVOffset = instanceUV;
		planeGeometry.attributes.instanceRGBA = instanceRGBA;
		planeGeometry.attributes.instanceClipping = instanceClipping;
		planeGeometry.attributes.instanceRenderSolid = instanceRenderSolid;
		this.frustumCulled = false;
		root.onUpdateMatrixWorldSet.add(this.customUpdateMatrixWorld);
	}
	clone() {
		const cloned = new InstancedGlyphMesh(this.root, this.instanceMatrix, this.instanceRGBA, this.instanceUV, this.instanceClipping, this.instanceRenderSolid, this.material);
		cloned.count = this.count;
		return cloned;
	}
	copy() {
		throw new Error("InstancedGlyphMesh.copy() is not supported. Use clone() instead.");
	}
	dispose() {
		this.root.onUpdateMatrixWorldSet.delete(this.customUpdateMatrixWorld);
		this.dispatchEvent({ type: "dispose" });
		this.geometry.dispose();
	}
	computeBoundingBox() {}
	computeBoundingSphere() {}
	updateMorphTargets() {}
	raycast() {}
	spherecast() {}
};
// node_modules/@pmndrs/uikit/dist/text/render/instanced-glyph-group.js
var GlyphGroupManager = class {
	root;
	object;
	map = /* @__PURE__ */ new Map();
	constructor(root, object) {
		this.root = root;
		this.object = object;
	}
	init(abortSignal) {
		const onFrame = (delta) => this.traverse((group) => group.onFrame(delta));
		this.root.onFrameSet.add(onFrame);
		abortSignal.addEventListener("abort", () => {
			this.root.onFrameSet.delete(onFrame);
			this.traverse((group) => group.destroy());
		});
	}
	traverse(fn) {
		for (const groups of this.map.values()) for (const group of groups.values()) fn(group);
	}
	getGroup({ majorIndex, minorIndex }, depthTest, depthWrite, renderOrder, font) {
		let groups = this.map.get(font);
		if (groups == null) this.map.set(font, groups = /* @__PURE__ */ new Map());
		const key = [
			majorIndex,
			minorIndex,
			depthTest,
			depthWrite,
			renderOrder
		].join(",");
		let glyphGroup = groups?.get(key);
		if (glyphGroup == null) groups.set(key, glyphGroup = new InstancedGlyphGroup(this.object, font, this.root, {
			majorIndex,
			minorIndex,
			elementType: ElementType.Text,
			patchIndex: 0
		}, depthTest, depthWrite, renderOrder));
		return glyphGroup;
	}
};
var InstancedGlyphGroup = class {
	object;
	root;
	orderInfo;
	renderOrder;
	instanceMatrix;
	instanceUV;
	instanceRGBA;
	instanceClipping;
	instanceRenderSolid;
	glyphs = [];
	requestedGlyphs = [];
	holeIndicies = [];
	mesh;
	instanceMaterial;
	timeTillDecimate;
	constructor(object, font, root, orderInfo, depthTest, depthWrite, renderOrder) {
		this.object = object;
		this.root = root;
		this.orderInfo = orderInfo;
		this.renderOrder = renderOrder;
		this.instanceMaterial = new InstancedGlyphMaterial(font);
		this.instanceMaterial.depthTest = depthTest;
		this.instanceMaterial.depthWrite = depthWrite;
	}
	requestActivate(glyph) {
		const holeIndex = this.holeIndicies.shift();
		if (holeIndex != null) {
			this.glyphs[holeIndex] = glyph;
			glyph.activate(holeIndex);
			this.root.requestRender?.();
			return;
		}
		if (this.mesh == null || this.mesh.count >= this.instanceMatrix.count) {
			this.requestedGlyphs.push(glyph);
			this.root.requestFrame?.();
			return;
		}
		const index = this.mesh.count;
		this.glyphs[index] = glyph;
		glyph.activate(index);
		this.mesh.count += 1;
		this.root.requestRender?.();
	}
	delete(glyph) {
		if (glyph.index == null) {
			const indexInRequested = this.requestedGlyphs.indexOf(glyph);
			if (indexInRequested === -1) return;
			this.requestedGlyphs.splice(indexInRequested, 1);
			return;
		}
		this.root.requestRender?.();
		const replacement = this.requestedGlyphs.shift();
		if (replacement != null) {
			replacement.activate(glyph.index);
			this.glyphs[glyph.index] = replacement;
			glyph.index = void 0;
			return;
		}
		if (glyph.index === this.glyphs.length - 1) {
			this.glyphs.length -= 1;
			this.mesh.count -= 1;
			glyph.index = void 0;
			return;
		}
		const bufferOffset = glyph.index * 16;
		this.instanceMatrix.array.fill(0, bufferOffset, bufferOffset + 16);
		this.instanceMatrix.addUpdateRange(bufferOffset, 16);
		this.instanceMatrix.needsUpdate = true;
		this.holeIndicies.push(glyph.index);
		this.glyphs[glyph.index] = void 0;
		glyph.index = void 0;
	}
	onFrame(delta) {
		const requiredSize = this.glyphs.length - this.holeIndicies.length + this.requestedGlyphs.length;
		if (this.mesh != null) this.mesh.visible = requiredSize > 0;
		if (requiredSize === 0) return;
		const availableSize = this.instanceMatrix?.count ?? 0;
		if (requiredSize < availableSize / 3) this.timeTillDecimate ??= 1;
		else this.timeTillDecimate = void 0;
		if (this.timeTillDecimate != null) this.timeTillDecimate -= delta;
		if ((this.timeTillDecimate == null || this.timeTillDecimate > 0) && requiredSize <= availableSize) return;
		this.timeTillDecimate = void 0;
		this.resize(requiredSize);
		const indexOffset = this.mesh.count;
		const requestedGlyphsLength = this.requestedGlyphs.length;
		for (let i = 0; i < requestedGlyphsLength; i++) {
			const glyph = this.requestedGlyphs[i];
			glyph.activate(indexOffset + i);
			this.glyphs[indexOffset + i] = glyph;
		}
		this.mesh.count += requestedGlyphsLength;
		this.mesh.visible = true;
		this.requestedGlyphs.length = 0;
	}
	resize(neededSize) {
		const newSize = Math.ceil(neededSize * 1.5);
		const matrixArray = new Float32Array(newSize * 16);
		const uvArray = new Float32Array(newSize * 4);
		const rgbaArray = new Float32Array(newSize * 4);
		const clippingArray = new Float32Array(newSize * 16);
		const renderSolidArray = new Float32Array(newSize * 1);
		this.instanceMatrix = new InstancedBufferAttribute(matrixArray, 16, false);
		this.instanceMatrix.setUsage(DynamicDrawUsage);
		this.instanceUV = new InstancedBufferAttribute(uvArray, 4, false);
		this.instanceUV.setUsage(DynamicDrawUsage);
		this.instanceRGBA = new InstancedBufferAttribute(rgbaArray, 4, false);
		this.instanceRGBA.setUsage(DynamicDrawUsage);
		this.instanceClipping = new InstancedBufferAttribute(clippingArray, 16, false);
		this.instanceClipping.setUsage(DynamicDrawUsage);
		this.instanceRenderSolid = new InstancedBufferAttribute(renderSolidArray, 1, false);
		this.instanceRenderSolid.setUsage(DynamicDrawUsage);
		const oldMesh = this.mesh;
		this.mesh = new InstancedGlyphMesh(this.root, this.instanceMatrix, this.instanceRGBA, this.instanceUV, this.instanceClipping, this.instanceRenderSolid, this.instanceMaterial);
		this.mesh.renderOrder = this.renderOrder;
		if (oldMesh != null) {
			this.holeIndicies.sort((i1, i2) => i1 - i2);
			const holesLength = this.holeIndicies.length;
			let afterPrevHoleIndex = 0;
			let i = 0;
			while (i < holesLength) {
				const holeIndex = this.holeIndicies[i];
				copyBuffer(afterPrevHoleIndex - i, afterPrevHoleIndex, holeIndex, oldMesh, this.mesh);
				afterPrevHoleIndex = holeIndex + 1;
				this.glyphs.splice(holeIndex - i, 1);
				i++;
			}
			copyBuffer(afterPrevHoleIndex - i, afterPrevHoleIndex, oldMesh.count, oldMesh, this.mesh);
			if (this.holeIndicies.length > 0) for (let i = this.holeIndicies[0]; i < this.glyphs.length; i++) this.glyphs[i].setIndex(i);
			this.holeIndicies.length = 0;
			this.object.remove(oldMesh);
			oldMesh.dispose();
		}
		setupRenderOrder(this.mesh, { peek: () => this.root }, { value: this.orderInfo });
		this.mesh.count = this.glyphs.length;
		this.object.addUnsafe(this.mesh);
	}
	destroy() {
		if (this.mesh == null) return;
		this.object.remove(this.mesh);
		this.mesh.dispose();
		this.instanceMaterial.dispose();
	}
};
function copyBuffer(target, start, end, oldMesh, newMesh) {
	copy(target, start, end, oldMesh.instanceMatrix.array, newMesh.instanceMatrix.array, 16);
	copy(target, start, end, oldMesh.instanceUV.array, newMesh.instanceUV.array, 4);
	copy(target, start, end, oldMesh.instanceRGBA.array, newMesh.instanceRGBA.array, 4);
	copy(target, start, end, oldMesh.instanceClipping.array, newMesh.instanceClipping.array, 16);
	copy(target, start, end, oldMesh.instanceRenderSolid.array, newMesh.instanceRenderSolid.array, 1);
}
function copy(target, start, end, from, to, itemSize) {
	if (start === end) return;
	const targetIndex = target * itemSize;
	const startIndex = start * itemSize;
	const endIndex = end * itemSize;
	to.set(from.subarray(startIndex, endIndex), targetIndex);
}
// node_modules/@pmndrs/uikit/dist/context.js
function buildRootContext(component, renderContext) {
	const root = O(() => component.parentContainer.value == null ? createRootContext(component, renderContext) : component.parentContainer.value.root.value);
	abortableEffect(() => {
		const rootValue = root.value;
		if (rootValue.component != component || !component.isAttached.value) return;
		const abortController = new AbortController();
		rootValue.glyphGroupManager.init(abortController.signal);
		rootValue.panelGroupManager.init(abortController.signal);
		rootValue.requestCalculateLayout = createDeferredRequestLayoutCalculation(rootValue, component);
		const onFrame = () => void (rootValue.reversePainterSortStableCache = void 0);
		rootValue.onFrameSet.add(onFrame);
		abortController.signal.addEventListener("abort", () => rootValue.onFrameSet.delete(onFrame));
		return () => abortController.abort();
	}, component.abortSignal);
	return root;
}
function createRootContext(component, renderContext) {
	const ctx = {
		isUpdateRunning: false,
		onFrameSet: /* @__PURE__ */ new Set(),
		requestFrame: renderContext?.requestFrame,
		requestRender() {
			if (ctx.isUpdateRunning) return;
			renderContext?.requestFrame();
		},
		onUpdateMatrixWorldSet: /* @__PURE__ */ new Set(),
		requestCalculateLayout: () => {},
		component
	};
	return Object.assign(ctx, {
		glyphGroupManager: new GlyphGroupManager(ctx, component),
		panelGroupManager: new PanelGroupManager(ctx, component)
	});
}
function createDeferredRequestLayoutCalculation(root, component) {
	let requested = true;
	const onFrame = () => {
		if (!requested) return;
		requested = false;
		component.node.calculateLayout();
	};
	root.onFrameSet.add(onFrame);
	component.abortSignal.addEventListener("abort", () => root.onFrameSet.delete(onFrame));
	return () => {
		requested = true;
		root.requestFrame?.();
	};
}
function buildRootMatrix(properties, size) {
	const sizeValue = size.value;
	if (sizeValue == null) return;
	const [width, height] = sizeValue;
	const pixelSize = parseNumberValue(properties.value.pixelSize);
	return new Matrix4().makeTranslation(alignmentXMap[properties.value.anchorX] * width * pixelSize, alignmentYMap[properties.value.anchorY] * height * pixelSize, 0);
}
// node_modules/@pmndrs/uikit/dist/properties/inheritance.js
var inheritedPropertyKeys = [
	"depthTest",
	"depthWrite",
	"renderOrder",
	"pixelSize",
	"opacity",
	"color",
	"fill",
	"textAlign",
	"verticalAlign",
	"fontSize",
	"letterSpacing",
	"lineHeight",
	"wordBreak",
	"fontFamily",
	"fontWeight",
	"visibility",
	"scrollbarBorderRightWidth",
	"scrollbarBorderTopWidth",
	"scrollbarBorderLeftWidth",
	"scrollbarBorderBottomWidth",
	"scrollbarColor",
	"scrollbarWidth",
	"scrollbarBorderTopLeftRadius",
	"scrollbarBorderTopRightRadius",
	"scrollbarBorderBottomLeftRadius",
	"scrollbarBorderBottomRightRadius",
	"scrollbarBorderColor",
	"scrollbarBorderBend",
	"caretColor",
	"caretWidth",
	"caretBorderRightWidth",
	"caretBorderTopWidth",
	"caretBorderLeftWidth",
	"caretBorderBottomWidth",
	"caretBorderTopLeftRadius",
	"caretBorderTopRightRadius",
	"caretBorderBottomLeftRadius",
	"caretBorderBottomRightRadius",
	"caretBorderColor",
	"caretBorderBend",
	"selectionColor",
	"selectionWidth",
	"selectionBorderRightWidth",
	"selectionBorderTopWidth",
	"selectionBorderLeftWidth",
	"selectionBorderBottomWidth",
	"selectionBorderTopLeftRadius",
	"selectionBorderTopRightRadius",
	"selectionBorderBottomLeftRadius",
	"selectionBorderBottomRightRadius",
	"selectionBorderColor",
	"selectionBorderBend",
	"pointerEvents",
	"pointerEventsType",
	"pointerEventsOrder"
];
// node_modules/@pmndrs/uikit/dist/components/component.js
var IdentityMatrix$1 = new Matrix4();
var sphereHelper = new Sphere();
var worldToGlobalMatrixHelper = new Matrix4();
var returnFalseFunction = () => false;
getLayerIndex({
	type: "base",
	section: "base"
});
var globalProperties = new PropertiesImplementation(allAliases, new Proxy({}, { get: () => returnFalseFunction }));
globalProperties.setEnabled(true);
var Component = class Component extends Mesh {
	inputProperties;
	initialClasses;
	abortController = new AbortController();
	handlers;
	orderInfo = y(void 0);
	isVisible;
	isClipped;
	boundingSphere = new Sphere();
	/**
	* the properties of the this component
	* e.g. get the final computed backgroundColor using `component.properties.value.backgroundColor`
	*/
	properties;
	starProperties;
	node;
	size = y(void 0);
	relativeCenter = y(void 0);
	borderInset = y(void 0);
	overflow = y(Overflow.Visible);
	displayed = y(false);
	scrollable = y([false, false]);
	paddingInset = y(void 0);
	maxScrollPosition = y([void 0, void 0]);
	root;
	parentContainer = y(void 0);
	isAttached = y(false);
	isRootAttached = O(() => this.parentContainer.value?.isRootAttached.value ?? this.isAttached.value);
	hoveredList = y([]);
	activeList = y([]);
	ancestorsHaveListenersSignal;
	globalMatrix;
	globalPanelMatrix;
	abortSignal = this.abortController.signal;
	classList;
	needsRenderTraversal;
	renderTraversalChildCount = y(0);
	constructor(inputProperties, initialClasses, config) {
		super(panelGeometry, config?.material);
		this.inputProperties = inputProperties;
		this.initialClasses = initialClasses;
		this.matrixAutoUpdate = false;
		const updateParentState = () => {
			r(() => {
				const isAttached = this.parent != null;
				this.parentContainer.value = this.parent instanceof Component ? this.parent : void 0;
				this.isAttached.value = isAttached;
			});
		};
		this.addEventListener("added", updateParentState);
		this.addEventListener("removed", updateParentState);
		this.root = buildRootContext(this, config?.renderContext);
		const conditionals = createConditionals(this.root, this.hoveredList, this.activeList, config?.hasFocus, config?.isPlaceholder);
		this.properties = new PropertiesImplementation(allAliases, conditionals, config?.defaults ?? componentDefaults);
		this.properties.setLayersWithConditionals({ type: "default-overrides" }, {
			width: O(() => {
				const sizeX = this.properties.value.sizeX;
				if (sizeX == null) return;
				return parseAbsoluteLengthValue(sizeX) / parseNumberValue(this.properties.value.pixelSize);
			}),
			height: O(() => {
				const sizeY = this.properties.value.sizeY;
				if (sizeY == null) return;
				return parseAbsoluteLengthValue(sizeY) / parseNumberValue(this.properties.value.pixelSize);
			}),
			...config?.defaultOverrides
		});
		abortableEffect(() => {
			if (!this.properties.enabled.value) return;
			const parentProprties = this.parentContainer.value?.properties;
			const layerIndex = getLayerIndex({ type: "inheritance" });
			const cleanup = parentProprties?.subscribePropertyKeys((key) => {
				if (!inheritedPropertyKeys.includes(key)) return;
				const signal = parentProprties.signal[key];
				this.properties.set(layerIndex, key, signal);
			});
			return () => {
				cleanup?.();
				this.properties.setLayer(layerIndex, void 0);
			};
		}, this.abortSignal);
		this.starProperties = new PropertiesImplementation(allAliases, conditionals);
		this.starProperties.setLayersWithConditionals({ type: "default-overrides" }, getStarProperties(config?.defaultOverrides));
		abortableEffect(() => {
			const isRootAttached = this.isRootAttached.value;
			this.properties.setEnabled(isRootAttached);
			this.starProperties.setEnabled(isRootAttached);
		}, this.abortSignal);
		abortableEffect(() => {
			if (!this.properties.enabled.value || !this.starProperties.enabled.value) return;
			const parentStarProprties = this.parentContainer.value?.starProperties ?? globalProperties;
			const layerIndex = getLayerIndex({ type: "star-inheritance" });
			const cleanup = parentStarProprties?.subscribePropertyKeys((key) => {
				const signal = parentStarProprties.signal[key];
				this.starProperties.set(layerIndex, key, signal);
				this.properties.set(layerIndex, key, signal);
			});
			return () => {
				cleanup?.();
				this.properties.setLayer(layerIndex, void 0);
				this.starProperties.setLayer(layerIndex, void 0);
			};
		}, this.abortSignal);
		this.resetProperties(inputProperties);
		this.classList = new ClassList(this.properties, this.starProperties);
		if (initialClasses != null) this.classList.add(...initialClasses);
		abortableEffect(() => {
			const elementId = this.properties.value.id;
			if (elementId == null) return;
			const idClassName = `__id__${elementId}`;
			if (!(idClassName in StyleSheet)) return;
			this.classList.add(idClassName);
			return () => this.classList.remove(idClassName);
		}, this.abortSignal);
		this.node = new FlexNode(this);
		this.globalMatrix = computedGlobalMatrix(O(() => this.parentContainer.value?.childrenMatrix.value ?? buildRootMatrix(this.properties, this.size)), computedTransformMatrix(this));
		const pixelSize = O(() => parseNumberValue(this.properties.value.pixelSize));
		this.isClipped = computedIsClipped(this.parentContainer, this.globalMatrix, this.size, pixelSize);
		this.isVisible = computedIsVisible(this, this.isClipped, this.properties);
		this.handlers = computedHandlers(this.properties, this.starProperties, this.hoveredList, this.activeList, config?.dynamicHandlers);
		this.ancestorsHaveListenersSignal = computedAncestorsHaveListeners(this.parentContainer, this.handlers);
		this.globalPanelMatrix = computedPanelMatrix(this.properties, this.globalMatrix, this.size, void 0);
		this.raycast = makeClippedCast(this, this.raycast.bind(this), this.root, this.parentContainer, this.orderInfo);
		this.spherecast = makeClippedCast(this, makePanelSpherecast(this.root, this.boundingSphere, this.globalPanelMatrix, this), this.root, this.parentContainer, this.orderInfo);
		setupCursorCleanup(this.hoveredList, this.abortSignal);
		setupBoundingSphere(this.boundingSphere, pixelSize, this.globalMatrix, this.size, this.abortSignal);
		const hasNonUikitChildren = config?.hasNonUikitChildren ?? true;
		const isRenderless = config?.isRenderless ?? false;
		this.needsRenderTraversal = O(() => !isRenderless || this.parentContainer.value == null || this.renderTraversalChildCount.value > 0);
		abortableEffect(() => {
			const parent = this.parentContainer.value;
			if (parent == null || !this.needsRenderTraversal.value) return;
			parent.renderTraversalChildCount.value = parent.renderTraversalChildCount.peek() + 1;
			return () => {
				parent.renderTraversalChildCount.value = parent.renderTraversalChildCount.peek() - 1;
			};
		}, this.abortSignal);
		if (isRenderless) abortableEffect(() => {
			this.visible = this.needsRenderTraversal.value;
		}, this.abortSignal);
		setupPointerEvents(this, hasNonUikitChildren);
		abortableEffect(() => {
			const { value } = this.handlers;
			for (const key in value) this.addEventListener(keyToEventName(key), value[key]);
			return () => {
				for (const key in value) this.removeEventListener(keyToEventName(key), value[key]);
			};
		}, this.abortSignal);
		if (!hasNonUikitChildren) {
			const listener = ({ child }) => {
				if (child instanceof Component || child instanceof InstancedPanelMesh || child instanceof InstancedGlyphMesh) return;
				throw new Error(`Only pmndrs/uikit components can be added as children to this component. Got ${child.constructor.name} instead.`);
			};
			this.addEventListener("childadded", listener);
			this.abortSignal.addEventListener("abort", () => this.removeEventListener("childadded", listener));
		}
	}
	raycast(raycaster, intersects) {
		this.root.peek().component.updateMatrix();
		computeWorldToGlobalMatrix(this.root.peek(), worldToGlobalMatrixHelper);
		sphereHelper.copy(this.boundingSphere).applyMatrix4(worldToGlobalMatrixHelper);
		if (!raycaster.ray.intersectsSphere(sphereHelper)) return false;
		this.updateWorldMatrix(false, false);
		super.raycast(raycaster, intersects);
		return false;
	}
	updateMatrixWorld() {
		this.updateWorldMatrix(false, true);
	}
	updateWorldMatrix(updateParents, updateChildren) {
		const root = this.root.peek().component;
		const rootParent = root.parent;
		if (updateParents) rootParent?.updateWorldMatrix(true, false);
		if (this === root) root.updateMatrix();
		computeWorldToGlobalMatrix(this.root.peek(), worldToGlobalMatrixHelper);
		this.matrixWorld.multiplyMatrices(worldToGlobalMatrixHelper, this.globalPanelMatrix.peek() ?? IdentityMatrix$1);
		if (updateChildren && this.root.peek().component === this) for (const update of this.root.value.onUpdateMatrixWorldSet) update();
	}
	/**
	* allows to extending the existing properties
	*/
	setProperties(inputProperties) {
		this.resetProperties({
			...this.inputProperties,
			...inputProperties
		});
	}
	/**
	* allows to overwrite the properties
	*/
	resetProperties(inputProperties) {
		this.inputProperties = inputProperties;
		this.properties.setLayersWithConditionals({ type: "base" }, inputProperties);
		this.starProperties.setLayersWithConditionals({ type: "base" }, getStarProperties(inputProperties));
	}
	/**
	* must only be called for the root component; the component that has a non-uikit component as a parent
	*/
	update(delta) {
		const root = this.root.peek();
		if (root.component != this) return;
		root.isUpdateRunning = true;
		for (const onFrame of this.root.peek().onFrameSet) onFrame(delta);
		root.isUpdateRunning = false;
	}
	copyInto(target, recursive) {
		target.name = this.name;
		target.up.copy(this.up);
		target.position.copy(this.position);
		target.rotation.order = this.rotation.order;
		target.quaternion.copy(this.quaternion);
		target.scale.copy(this.scale);
		target.matrix.copy(this.matrix);
		target.matrixWorld.copy(this.matrixWorld);
		target.matrixAutoUpdate = this.matrixAutoUpdate;
		target.matrixWorldAutoUpdate = this.matrixWorldAutoUpdate;
		target.layers.mask = this.layers.mask;
		target.visible = this.visible;
		target.castShadow = this.castShadow;
		target.receiveShadow = this.receiveShadow;
		target.frustumCulled = this.frustumCulled;
		target.renderOrder = this.renderOrder;
		target.animations = this.animations.slice();
		target.userData = JSON.parse(JSON.stringify(this.userData));
		if (recursive !== false) for (const child of this.children) {
			if (child instanceof InstancedPanelMesh || child instanceof InstancedGlyphMesh) continue;
			if (child instanceof Component) target.add(child.clone());
		}
	}
	clone(recursive) {
		const cloned = new Component(this.inputProperties, this.initialClasses);
		this.copyInto(cloned, recursive);
		return cloned;
	}
	copy(_source, _recursive) {
		throw new Error("Component.copy() is not supported because uikit components require constructor-based initialization. Use Component.clone() instead.");
	}
	dispose() {
		this.parent?.remove(this);
		this.abortController.abort();
	}
	/**
	* only used for internally adding instanced panel group and instanced gylph group in case this component is a root component
	*/
	addUnsafe(...objects) {
		for (const object of objects) super.add(object);
		return this;
	}
};
function keyToEventName(key) {
	return key.slice(2).toLowerCase();
}
// node_modules/@pmndrs/uikit/dist/utils.js
function computedGlobalMatrix(parentMatrix, localMatrix) {
	return O(() => {
		const local = localMatrix.value;
		const parent = parentMatrix.value;
		if (local == null || parent == null) return;
		return parent.clone().multiply(local);
	});
}
function computedIsVisible(component, isClipped, properties) {
	return O(() => component.displayed.value && (isClipped == null || !isClipped?.value) && properties.value.visibility === "visible");
}
function loadResourceWithParams(target, fn, cleanup, abortSignal, param, ...additionals) {
	abortableEffect(() => {
		let canceled = false;
		let current;
		fn(readReactive(param), ...additionals).then((value) => {
			if (!canceled) target.value = current = value;
		}).catch(console.error);
		return () => {
			canceled = true;
			if (current != null && cleanup != null) cleanup(current);
		};
	}, abortSignal);
}
var eventHandlerKeys = [
	"onClick",
	"onContextMenu",
	"onDblClick",
	"onPointerCancel",
	"onPointerDown",
	"onPointerEnter",
	"onPointerLeave",
	"onPointerMove",
	"onPointerOut",
	"onPointerOver",
	"onPointerUp",
	"onWheel"
];
function computedHandlers(properties, starProperties, hoveredSignal, activeSignal, dynamicHandlers) {
	return O(() => {
		if (!properties.enabled.value) return {};
		const handlers = {};
		for (const key of eventHandlerKeys) {
			const handler = properties.value[key];
			if (handler != null) handlers[key] = handler;
		}
		addHandlers(handlers, dynamicHandlers?.value);
		addHoverHandlers(handlers, properties, hoveredSignal, properties.usedConditionals.hover, starProperties.usedConditionals.hover);
		addActiveHandlers(handlers, properties, activeSignal, properties.usedConditionals.active, starProperties.usedConditionals.active);
		return handlers;
	});
}
function computedAncestorsHaveListeners(parent, handlers) {
	return O(() => (parent.value?.ancestorsHaveListenersSignal.value ?? false) || Object.keys(handlers.value).length > 0);
}
function addHandlers(target, handlers) {
	for (const key in handlers) addHandler(key, target, handlers[key]);
}
function addHandler(key, target, handler) {
	if (handler == null) return;
	const existingHandler = target[key];
	if (existingHandler == null) {
		target[key] = handler;
		return;
	}
	target[key] = ((e) => {
		existingHandler(e);
		handler(e);
	});
}
function setupMatrixWorldUpdate(component, rootSignal, globalPanelMatrixSignal, abortSignal) {
	if (globalPanelMatrixSignal != null && !abortSignal.aborted) {
		const unsubscribe = globalPanelMatrixSignal.subscribe(() => {
			rootSignal.peek().requestRender?.();
		});
		abortSignal.addEventListener("abort", unsubscribe);
	}
	abortableEffect(() => {
		const root = rootSignal.value;
		if (root.component === component) return;
		const updateMatrixWorld = component.updateWorldMatrix.bind(component, false, true);
		root.onUpdateMatrixWorldSet.add(updateMatrixWorld);
		return () => root.onUpdateMatrixWorldSet.delete(updateMatrixWorld);
	}, abortSignal);
}
function setupPointerEvents(component, canHaveNonUikitChildren) {
	component.defaultPointerEvents = "auto";
	abortableEffect(() => {
		component.ancestorsHaveListeners = component.ancestorsHaveListenersSignal.value;
		component.pointerEvents = component.isVisible.value ? component.properties.value.pointerEvents : "none";
		component.pointerEventsOrder = parseNumberValue(component.properties.value.pointerEventsOrder ?? 0);
		component.pointerEventsType = component.properties.value.pointerEventsType;
	}, component.abortSignal);
	abortableEffect(() => {
		if (!component.properties.enabled.value) return;
		const rootComponent = component.root.value.component;
		component.intersectChildren = canHaveNonUikitChildren || rootComponent === component;
		if (!canHaveNonUikitChildren && component.properties.value.pointerEvents === "none") return;
		if (rootComponent === component) return;
		rootComponent.interactableDescendants ??= [];
		const interactableDescendants = rootComponent.interactableDescendants;
		interactableDescendants.push(component);
		return () => {
			const index = interactableDescendants.indexOf(component);
			if (index === -1) return;
			interactableDescendants.splice(index, 1);
		};
	}, component.abortSignal);
}
function abortableEffect(fn, abortSignal) {
	if (abortSignal.aborted) return;
	const unsubscribe = x(fn);
	abortSignal.addEventListener("abort", unsubscribe);
}
var alignmentXMap = {
	left: .5,
	center: 0,
	middle: 0,
	right: -.5
};
var alignmentYMap = {
	top: -.5,
	center: 0,
	middle: 0,
	bottom: .5
};
var alignmentZMap = {
	back: -.5,
	center: 0,
	middle: 0,
	front: .5
};
function readReactive(value) {
	value = value instanceof l ? value.value : value;
	if (value === "initial") return;
	return value;
}
function computedBorderInset(properties, keys) {
	return O(() => keys.map((key) => {
		const value = properties.value[key];
		return value == null ? 0 : parseAbsoluteLengthValue(value);
	}));
}
/**
* assumes component.root.component.parent.matrixWorld and component.root.component.matrix is updated
*/
function computeWorldToGlobalMatrix(root, target) {
	const rootComponent = root.component;
	if (rootComponent.parent == null) {
		target.copy(rootComponent.matrix);
		return;
	}
	target.multiplyMatrices(rootComponent.parent.matrixWorld, rootComponent.matrix);
}
// node_modules/@pmndrs/uikit/dist/order.js
var reversePainterSortStableCacheKey = Symbol("reverse-painter-sort-stable-cache-key");
var orderInfoKey = Symbol("order-info-key");
function reversePainterSortStable(a, b) {
	if (a.groupOrder !== b.groupOrder) return a.groupOrder - b.groupOrder;
	if (a.renderOrder !== b.renderOrder) return a.renderOrder - b.renderOrder;
	let az = a.z;
	let bz = b.z;
	const aRootSignal = a.object[reversePainterSortStableCacheKey];
	const bRootSignal = b.object[reversePainterSortStableCacheKey];
	if (aRootSignal != null) {
		const root = aRootSignal.peek();
		root.reversePainterSortStableCache ??= az;
		az = root.reversePainterSortStableCache;
	}
	if (bRootSignal != null) {
		const root = bRootSignal.peek();
		root.reversePainterSortStableCache ??= bz;
		bz = root.reversePainterSortStableCache;
	}
	if (aRootSignal != null && aRootSignal.peek() === bRootSignal?.peek()) return compareOrderInfo(a.object[orderInfoKey].value, b.object[orderInfoKey].value);
	return az !== bz ? bz - az : a.id - b.id;
}
var ElementType = {
	Panel: 0,
	Image: 1,
	Content: 2,
	Custom: 3,
	Text: 4
};
function compareOrderInfo(o1, o2) {
	if (o1 == null || o2 == null) return 0;
	let dif = o1.majorIndex - o2.majorIndex;
	if (dif != 0) return dif;
	dif = o1.minorIndex - o2.minorIndex;
	if (dif != 0) return dif;
	dif = o1.elementType - o2.elementType;
	if (dif != 0) return dif;
	return o1.patchIndex - o2.patchIndex;
}
function setupOrderInfo(target, properties, zIndexKey, type, instancedGroupDependencies, basisOrderInfoSignal, abortSignal) {
	abortableEffect(() => {
		if (!properties.enabled.value) {
			target.value = void 0;
			return;
		}
		if (basisOrderInfoSignal.value === void 0) {
			target.value = void 0;
			return;
		}
		const basisOrderInfo = basisOrderInfoSignal.value;
		const majorIndex = parseNumberValue(properties.value[zIndexKey] ?? basisOrderInfo?.majorIndex ?? 0);
		let minorIndex;
		let patchIndex;
		if (basisOrderInfo == null) {
			minorIndex = 0;
			patchIndex = 0;
		} else if (type > basisOrderInfo.elementType) {
			minorIndex = basisOrderInfo.minorIndex;
			patchIndex = 0;
		} else if (type != basisOrderInfo.elementType || !shallowEqualRecord(readReactive(instancedGroupDependencies), readReactive(basisOrderInfo.instancedGroupDependencies))) {
			minorIndex = basisOrderInfo.minorIndex + 1;
			patchIndex = 0;
		} else {
			minorIndex = basisOrderInfo.minorIndex;
			patchIndex = basisOrderInfo.patchIndex + 1;
		}
		patchIndex += parseNumberValue(properties.value["zIndexOffset"] ?? 0);
		target.value = {
			instancedGroupDependencies,
			elementType: type,
			majorIndex,
			minorIndex,
			patchIndex
		};
	}, abortSignal);
}
function shallowEqualRecord(r1, r2) {
	if (r1 === r2) return true;
	if (r1 == null || r2 == null) return false;
	let i = 0;
	for (const key in r1) {
		if (r1[key] != r2[key]) return false;
		++i;
	}
	return i === Object.keys(r2).length;
}
function setupRenderOrder(target, root, orderInfo) {
	target[reversePainterSortStableCacheKey] = root;
	target[orderInfoKey] = orderInfo;
}
// node_modules/@pmndrs/uikit/dist/components/content.js
var contentDefaults = {
	...componentDefaults,
	depthAlign: "back",
	keepAspectRatio: true
};
var IdentityQuaternion = new Quaternion();
var IdentityMatrix = new Matrix4();
var box3Helper = new Box3();
var smallValue = new Vector3().setScalar(1e-6);
var positionHelper = new Vector3();
var scaleHelper = new Vector3();
var vectorHelper = new Vector3();
var RemeasureOnChildrenChangeDefault = true;
var DepthWriteDefaultDefault = true;
var SupportFillPropertyDefault = false;
var Content = class Content extends Component {
	inputConfig;
	boundingBox;
	clippingPlanes;
	childrenMatrix = new Matrix4();
	constructor(inputProperties, initialClasses, inputConfig) {
		const defaultAspectRatio = y(void 0);
		super(inputProperties, initialClasses, {
			defaults: contentDefaults,
			hasNonUikitChildren: true,
			...inputConfig,
			defaultOverrides: {
				aspectRatio: defaultAspectRatio,
				...inputConfig?.defaultOverrides
			}
		});
		this.inputConfig = inputConfig;
		this.boundingBox = inputConfig?.boundingBox ?? y({
			size: new Vector3(1, 1.01, 1),
			center: new Vector3(0, 0, 0)
		});
		abortableEffect(() => {
			const boundingBox = this.boundingBox.value;
			if (!this.properties.value.keepAspectRatio || boundingBox == null) {
				defaultAspectRatio.value = void 0;
				return;
			}
			defaultAspectRatio.value = boundingBox.size.x / boundingBox.size.y;
		}, this.abortSignal);
		this.material.visible = false;
		const panelGroupDeps = computedPanelGroupDependencies(this.properties);
		const backgroundOrderInfo = y();
		setupOrderInfo(backgroundOrderInfo, this.properties, "zIndex", ElementType.Panel, panelGroupDeps, O(() => this.parentContainer.value == null ? null : this.parentContainer.value.orderInfo.value), this.abortSignal);
		setupInstancedPanel(this.properties, this.root, backgroundOrderInfo, panelGroupDeps, this.globalPanelMatrix, this.size, this.borderInset, O(() => this.parentContainer.value?.clippingRect.value), this.isVisible, getDefaultPanelMaterialConfig(), this.abortSignal);
		abortableEffect(() => {
			if (this.size.value == null || this.paddingInset.value == null || this.borderInset.value == null || this.boundingBox.value == null) {
				this.childrenMatrix.copy(IdentityMatrix);
				return;
			}
			const [width, height] = this.size.value;
			const [pTop, pRight, pBottom, pLeft] = this.paddingInset.value;
			const [bTop, bRight, bBottom, bLeft] = this.borderInset.value;
			const topInset = pTop + bTop;
			const rightInset = pRight + bRight;
			const bottomInset = pBottom + bBottom;
			const leftInset = pLeft + bLeft;
			const innerWidth = width - leftInset - rightInset;
			const innerHeight = height - topInset - bottomInset;
			const pixelSize = parseNumberValue(this.properties.value.pixelSize);
			scaleHelper.set(innerWidth * pixelSize, innerHeight * pixelSize, this.properties.value.keepAspectRatio ? innerHeight * pixelSize * this.boundingBox.value.size.z / this.boundingBox.value.size.y : this.boundingBox.value.size.z).divide(this.boundingBox.value.size);
			positionHelper.copy(this.boundingBox.value.center).negate();
			positionHelper.z -= alignmentZMap[this.properties.value.depthAlign] * this.boundingBox.value.size.z;
			positionHelper.multiply(scaleHelper);
			positionHelper.add(vectorHelper.set((leftInset - rightInset) * .5 * pixelSize, (bottomInset - topInset) * .5 * pixelSize, 0));
			this.childrenMatrix.compose(positionHelper, IdentityQuaternion, scaleHelper);
		}, this.abortSignal);
		setupMatrixWorldUpdate(this, this.root, void 0, this.abortSignal);
		setupOrderInfo(this.orderInfo, this.properties, "zIndex", ElementType.Content, void 0, backgroundOrderInfo, this.abortSignal);
		this.clippingPlanes = createGlobalClippingPlanes(this);
		abortableEffect(() => {
			this.visible = this.isVisible.value;
			applyAppearancePropertiesToGroup(this.properties, this, this.inputConfig?.depthWriteDefault ?? DepthWriteDefaultDefault, this.inputConfig?.supportFillProperty ?? SupportFillPropertyDefault);
			this.root.peek().requestRender?.();
		}, this.abortSignal);
		if (this.inputConfig?.remeasureOnChildrenChange ?? RemeasureOnChildrenChangeDefault) {
			const onChildrenChanged = this.debounceNotifyAncestorsChanged.bind(this);
			this.addEventListener("childadded", onChildrenChanged);
			this.addEventListener("childremoved", onChildrenChanged);
			this.abortSignal.addEventListener("abort", () => {
				this.removeEventListener("childadded", onChildrenChanged);
				this.removeEventListener("childremoved", onChildrenChanged);
			});
		}
	}
	childUpdateWorldMatrix(child, updateParents, updateChildren) {
		if (!(child.parent instanceof Content)) {
			Object3D.prototype.updateWorldMatrix.apply(child, [updateParents, updateChildren]);
			return;
		}
		if (updateParents) this.updateWorldMatrix(true, false);
		computeWorldToGlobalMatrix(this.root.value, child.matrixWorld);
		child.matrixWorld.multiply(this.globalMatrix.peek() ?? IdentityMatrix).multiply(this.childrenMatrix);
		child.updateMatrix();
		child.matrixWorld.multiply(child.matrix);
		if (updateChildren) for (const childChild of child.children) childChild.updateMatrixWorld(true);
	}
	timeoutRef;
	debounceNotifyAncestorsChanged() {
		if (this.timeoutRef != null) return;
		this.timeoutRef = setTimeout(this.notifyAncestorsChanged.bind(this), 0);
	}
	notifyAncestorsChanged() {
		this.timeoutRef = void 0;
		applyAppearancePropertiesToGroup(this.properties, this, this.inputConfig?.depthWriteDefault ?? DepthWriteDefaultDefault, this.inputConfig?.supportFillProperty ?? SupportFillPropertyDefault);
		this.traverse((descendant) => {
			if (descendant instanceof InstancedGlyphMesh || descendant instanceof InstancedPanelMesh || !(descendant instanceof Mesh)) return;
			setupRenderOrder(descendant, this.root, this.orderInfo);
			descendant.material.clippingPlanes = this.clippingPlanes;
			descendant.material.needsUpdate = true;
			descendant.material.transparent = true;
			descendant.raycast = makeClippedCast(this, descendant.raycast.bind(descendant), this.root, this.parentContainer, this.orderInfo);
			descendant.spherecast = descendant.spherecast != null ? makeClippedCast(this, descendant.spherecast?.bind(descendant), this.root, this.parentContainer, this.orderInfo) : void 0;
		});
		for (const child of this.children) {
			child.updateMatrixWorld = this.childUpdateWorldMatrix.bind(this, child, false, true);
			child.updateWorldMatrix = this.childUpdateWorldMatrix.bind(this, child);
		}
		if (this.inputConfig?.boundingBox == null) {
			box3Helper.makeEmpty();
			for (const child of this.children) {
				if (child instanceof InstancedGlyphMesh || child instanceof InstancedPanelMesh) continue;
				child.parent = null;
				box3Helper.expandByObject(child);
				child.parent = this;
			}
			const size = new Vector3();
			const center = new Vector3();
			box3Helper.getSize(size).max(smallValue);
			box3Helper.getCenter(center);
			this.boundingBox.value = {
				center,
				size
			};
		}
		this.root.peek().requestRender?.();
	}
	updateWorldMatrix(updateParents, updateChildren) {
		super.updateWorldMatrix(updateParents, updateChildren);
		if (updateChildren) for (const child of this.children) child.updateWorldMatrix(false, true);
	}
	clone(recursive) {
		const cloned = new Content(this.inputProperties, this.initialClasses, this.inputConfig);
		this.copyInto(cloned, recursive);
		return cloned;
	}
	dispose() {
		if (this.timeoutRef != null) {
			this.timeoutRef = void 0;
			clearInterval(this.timeoutRef);
		}
		super.dispose();
	}
};
var colorHelper = new Color();
var colorArrayHelper = [
	0,
	0,
	0,
	0
];
function applyAppearancePropertiesToGroup(properties, group, depthWriteDefault, supportFillProperty) {
	const color = (supportFillProperty ? properties.value.fill : void 0) ?? properties.value.color;
	const opacity = toAbsoluteNumber(properties.value.opacity, () => 1);
	if (color != null) {
		writeColor(colorArrayHelper, 0, color, opacity, void 0);
		colorHelper.fromArray(colorArrayHelper);
	}
	const depthTest = properties.value.depthTest;
	const depthWrite = properties.value.depthWrite ?? depthWriteDefault;
	const renderOrder = parseNumberValue(properties.value.renderOrder ?? 0);
	group.traverse((child) => {
		if (child instanceof InstancedGlyphMesh || child instanceof InstancedPanelMesh || !(child instanceof Mesh)) return;
		child.renderOrder = renderOrder;
		const material = child.material;
		child.userData.color ??= material.color.clone();
		material.color.copy(color != null ? colorHelper : child.userData.color);
		material.opacity = color != null ? colorArrayHelper[3] : opacity;
		material.depthTest = depthTest;
		material.depthWrite = depthWrite;
	});
}
export { parseNumberValue as A, cssColor as B, computedPanelGroupDependencies as C, MeasureMode as D, defaultClippingData as E, O as F, resolveRasterScale as G, graphemeSegments as H, l as I, x as L, PanelDistanceMaterial as M, createPanelMaterial as N, computedPanelMatrix as O, resolvePanelMaterialClassProperty as P, y as R, setupInstancedPanel as S, createGlobalClippingPlanes as T, graphemes as U, fontShorthand as V, resolveLineHeight as W, getKerningOffset as _, setupRenderOrder as a, toAbsoluteNumber as b, loadResourceWithParams as c, componentDefaults as d, createPanelMaterialConfig as f, getGlyphOffsetY as g, getGlyphOffsetX as h, setupOrderInfo as i, PanelDepthMaterial as j, parseAbsoluteLengthValue as k, setupMatrixWorldUpdate as l, getGlyphLayoutHeight as m, ElementType as n, abortableEffect as o, getDefaultPanelMaterialConfig as p, reversePainterSortStable as r, computedBorderInset as s, Content as t, Component as u, getOffsetToNextGlyph as v, computedClippingRect as w, writeColor as x, getOffsetToNextLine as y, DEFAULT_TEXT_LINE_HEIGHT as z };
