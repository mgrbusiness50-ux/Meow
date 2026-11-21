import { C as BufferGeometry, Hi as Vector2, Rn as Object3D, S as BufferAttribute, Ui as Vector3, j as Color, xn as Mesh } from "./three.core-DsEAPerk.js";
// node_modules/xrblocks/build/internal/UICard.js
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
var defaultScriptMethods = /* @__PURE__ */ new WeakSet();
/** Records the no-op methods supplied by one ScriptMixin base class. */
function markDefaultScriptMethods(prototype) {
	for (const name of Object.getOwnPropertyNames(prototype)) {
		if (name === "constructor") continue;
		const method = Reflect.get(prototype, name);
		if (typeof method === "function") defaultScriptMethods.add(method);
	}
}
/** Returns whether a Script method is supplied by ScriptMixin unchanged. */
function isDefaultScriptMethod(method) {
	return typeof method !== "function" || defaultScriptMethods.has(method);
}
/**
* The Script class facilities development by providing useful life cycle
* functions similar to MonoBehaviors in Unity.
*
* Each Script object is an independent THREE.Object3D entity within the
* scene graph.
*
* See /docs/manual/Scripts.md for the full documentation.
*
* It manages user, objects, and interaction between user and objects.
* See `/templates/00_basic/` for an example to start with.
* # Supported interaction functions to extend:
*
* onSelectStart(event)
* onSelectEnd(event)
*
*/
function ScriptMixin(base) {
	class MixedScript extends base {
		constructor(..._args) {
			super(..._args);
			this.isXRScript = true;
		}
		/**
		* Initializes an instance with XR controllers, grips, hands, and default
		* options. We allow all scripts to quickly access its user (e.g.,
		* user.isSelecting(), user.hands), world (e.g., physical depth mesh,
		* lighting estimation, and recognized objects), and scene (the root of
		* three.js's scene graph). If this returns a promise, we will wait for it.
		*/
		init(_) {}
		/**
		* Runs per frame.
		*/
		update(_time, _frame) {}
		/**
		* Enables depth-aware interactions with physics. See /samples/advanced/ballpit
		*/
		initPhysics(_physics) {}
		physicsStep() {}
		onXRSessionStarted(_session) {}
		onXRSessionEnded() {}
		onSimulatorStarted() {}
		/**
		* Called whenever pinch / mouse click starts, globally.
		* @param _event - The interaction source and optional captured target.
		*/
		onSelectStart(_event) {}
		/**
		* Called whenever pinch / mouse click discontinues, globally.
		* @param _event - The completed state and end reason.
		*/
		onSelectEnd(_event) {}
		/**
		* Called whenever pinch / mouse click successfully completes, globally.
		* @param _event - The interaction source and completed target.
		*/
		onSelect(_event) {}
		/**
		* Called whenever pinch / mouse click is happening, globally.
		*/
		onSelecting(_event) {}
		/** Called when an object selection reaches the long-select delay. */
		onLongSelect(_event) {}
		/**
		* Called on keyboard keypress.
		* @param _event - Event containing `.code` to read the keyboard key.
		*/
		onKeyDown(_event) {}
		onKeyUp(_event) {}
		/**
		* Called whenever gamepad trigger starts, globally.
		* @param _event - `event.source.controller` identifies the controller.
		*/
		onSqueezeStart(_event) {}
		/**
		* Called whenever gamepad trigger stops, globally.
		* @param _event - `event.source.controller` identifies the controller.
		*/
		onSqueezeEnd(_event) {}
		/**
		* Called whenever gamepad is being triggered, globally.
		*/
		onSqueezing(_event) {}
		/**
		* Called whenever gamepad trigger successfully completes, globally.
		* @param _event - `event.source.controller` identifies the controller.
		*/
		onSqueeze(_event) {}
		/**
		* Called when a source starts selecting the object this Script represents.
		* @param _event - `event.target` is the logical object and
		* `event.source.controller` identifies the controller.
		* Call `event.stopPropagation()` to stop bubbling to ancestor Scripts.
		*/
		onObjectSelectStart(_event) {}
		/**
		* Called when a source stops selecting the object this Script represents.
		* @param _event - The completed state and end reason.
		* Call `event.stopPropagation()` to stop bubbling to ancestor Scripts.
		*/
		onObjectSelectEnd(_event) {}
		/**
		* Called once when a captured selection is held for the long-select delay.
		* Manipulation captures do not emit this callback.
		* @param _event - The controller and completed hold duration.
		* Call `event.stopPropagation()` to stop bubbling to ancestor Scripts.
		*/
		onObjectLongSelect(_event) {}
		/**
		* Called for each phase of an automatic object manipulation. Call
		* `event.stopPropagation()` to stop bubbling. Calling `preventDefault()`
		* on a start event suppresses the automatic action.
		*/
		onObjectManipulate(_event) {}
		/**
		* Called when a source starts hovering over this object.
		* @param _event - The hover source, target, surface, and intersection.
		* Call `event.stopPropagation()` to stop bubbling to ancestor Scripts.
		*/
		onHoverEnter(_event) {}
		/**
		* Called when a source stops hovering over this object.
		* @param _event - The hover source, target, surface, and intersection.
		* Call `event.stopPropagation()` to stop bubbling to ancestor Scripts.
		*/
		onHoverExit(_event) {}
		/**
		* Called while a source hovers over this object.
		* @param _event - The hover source, target, surface, and intersection.
		* Call `event.stopPropagation()` to stop bubbling to ancestor Scripts.
		*/
		onHovering(_event) {}
		/**
		* Called when a hand's index finger starts touching this object.
		* Direct touch starts the object's selection lifecycle by default. Call
		* `event.preventDefault()` to handle contact without selecting.
		*/
		onObjectTouchStart(_event) {}
		/**
		* Called every frame that a hand's index finger is touching this object.
		* The object remains selected during these frames unless touch selection
		* was prevented when contact started.
		*/
		onObjectTouching(_event) {}
		/**
		* Called when a hand's index finger stops touching this object.
		* This ends the default selection lifecycle after the touch callback.
		*/
		onObjectTouchEnd(_event) {}
		/**
		* Called when a hand starts grabbing this object (touching + pinching).
		* A grab starts built-in direct-touch manipulation when enabled.
		*/
		onObjectGrabStart(_event) {}
		/**
		* Called every frame a hand is grabbing this object.
		*/
		onObjectGrabbing(_event) {}
		/**
		* Called when a hand stops grabbing this object.
		* This ends built-in direct-touch manipulation without ending contact.
		*/
		onObjectGrabEnd(_event) {}
		/**
		* Called when the script is removed from the scene. Opposite of init.
		*/
		dispose() {
			super.dispose();
		}
	}
	markDefaultScriptMethods(MixedScript.prototype);
	return MixedScript;
}
/**
* Script manages app logic or interaction between user and objects.
*/
var ScriptMixinObject3D = ScriptMixin(Object3D);
var Script = class extends ScriptMixinObject3D {};
/**
* MeshScript can be constructed with geometry and materials, with
* `super(geometry, material)`; for direct access to its geometry.
* MeshScripts hold geometry and materials while using the Script lifecycle.
*/
var ScriptMixinMeshScript = ScriptMixin(Mesh);
var MeshScript = class extends ScriptMixinMeshScript {
	/**
	* {@inheritDoc}
	*/
	constructor(geometry, material) {
		super(geometry, material);
	}
};
/** Base class for built-in scripts that continuously change their parent. */
var TransformScript = class extends Script {
	constructor(..._args) {
		super(..._args);
		this.suspended = false;
	}
	/** Stops transform updates while the parent is manipulated. */
	suspend() {
		this.suspended = true;
	}
	/** Rebases the script on the parent's current pose and resumes updates. */
	resume() {
		this.rebase();
		this.suspended = false;
	}
	get canUpdate() {
		return !this.suspended && this.parent !== null;
	}
	/** Captures a new baseline from the parent transform. */
	rebase() {}
};
function suspendTransformScripts(owner) {
	for (const child of owner.children) if (child instanceof TransformScript) child.suspend();
}
function resumeTransformScripts(owner) {
	for (const child of owner.children) if (child instanceof TransformScript) child.resume();
}
var DEFAULT_GRADIENT_PANEL_PROPS = {
	cornerRadius: 0,
	fillColor: "rgba(0,0,0,0)",
	innerShadowColor: "rgba(0,0,0,0)",
	innerShadowBlur: 0,
	innerShadowPosition: new Vector2(0, 0),
	innerShadowSpread: 0,
	innerShadowFalloff: 1,
	dropShadowColor: "rgba(0,0,0,0)",
	dropShadowBlur: 0,
	dropShadowPosition: new Vector2(0, 0),
	dropShadowSpread: 0,
	dropShadowFalloff: 1,
	strokeColor: "rgba(0,0,0,0)",
	strokeWidth: 0,
	strokeAlign: "center"
};
var STYLE_KEYS = /* @__PURE__ */ new Set([
	"width",
	"height",
	"minWidth",
	"minHeight",
	"maxWidth",
	"maxHeight",
	"flexDirection",
	"justifyContent",
	"alignItems",
	"alignSelf",
	"flexGrow",
	"flexShrink",
	"flexBasis",
	"position",
	"top",
	"right",
	"bottom",
	"left",
	"transform",
	"zIndex",
	"gap",
	"rowGap",
	"columnGap",
	"padding",
	"paddingTop",
	"paddingRight",
	"paddingBottom",
	"paddingLeft",
	"margin",
	"marginTop",
	"marginRight",
	"marginBottom",
	"marginLeft",
	"backgroundColor",
	"color",
	"opacity",
	"borderColor",
	"borderWidth",
	"borderRadius",
	"fontSize",
	"fontWeight",
	"lineHeight",
	"textAlign",
	"verticalAlign",
	"innerShadowColor",
	"innerShadowBlur",
	"innerShadowPosition",
	"innerShadowSpread",
	"innerShadowFalloff",
	"dropShadowColor",
	"dropShadowBlur",
	"dropShadowPosition",
	"dropShadowSpread",
	"dropShadowFalloff",
	"borderAlign",
	"display",
	"overflow",
	"objectFit",
	"whiteSpace",
	"textOverflow",
	":hover",
	":active",
	":disabled",
	":focus"
]);
var STATE_STYLE_KEYS = /* @__PURE__ */ new Set([
	"backgroundColor",
	"color",
	"opacity",
	"borderColor",
	"borderWidth",
	"borderRadius"
]);
var NUMBER_KEYS = /* @__PURE__ */ new Set([
	"minWidth",
	"minHeight",
	"maxWidth",
	"maxHeight",
	"flexGrow",
	"flexShrink",
	"zIndex",
	"gap",
	"rowGap",
	"columnGap",
	"padding",
	"paddingTop",
	"paddingRight",
	"paddingBottom",
	"paddingLeft",
	"margin",
	"marginTop",
	"marginRight",
	"marginBottom",
	"marginLeft",
	"opacity",
	"borderWidth",
	"borderRadius",
	"fontSize",
	"innerShadowBlur",
	"innerShadowSpread",
	"innerShadowFalloff",
	"dropShadowBlur",
	"dropShadowSpread",
	"dropShadowFalloff"
]);
var POSITION_KEYS = /* @__PURE__ */ new Set([
	"top",
	"right",
	"bottom",
	"left"
]);
var PAINT_KEYS = /* @__PURE__ */ new Set([
	"backgroundColor",
	"borderColor",
	"innerShadowColor",
	"dropShadowColor"
]);
var COLOR_KEYS = /* @__PURE__ */ new Set(["color"]);
var NONNEGATIVE_KEYS = /* @__PURE__ */ new Set([
	"width",
	"height",
	"minWidth",
	"minHeight",
	"maxWidth",
	"maxHeight",
	"flexGrow",
	"flexShrink",
	"flexBasis",
	"gap",
	"rowGap",
	"columnGap",
	"padding",
	"paddingTop",
	"paddingRight",
	"paddingBottom",
	"paddingLeft",
	"borderWidth",
	"borderRadius",
	"fontSize",
	"lineHeight",
	"innerShadowBlur",
	"dropShadowBlur"
]);
var ENUM_VALUES = {
	flexDirection: ["row", "column"],
	justifyContent: [
		"flex-start",
		"center",
		"flex-end",
		"space-between"
	],
	alignItems: [
		"flex-start",
		"center",
		"flex-end",
		"stretch"
	],
	alignSelf: [
		"auto",
		"flex-start",
		"center",
		"flex-end",
		"stretch"
	],
	position: ["relative", "absolute"],
	borderAlign: [
		"inside",
		"center",
		"outside"
	],
	display: ["flex", "none"],
	fontWeight: [
		"normal",
		"medium",
		"bold"
	],
	textAlign: [
		"left",
		"center",
		"right"
	],
	verticalAlign: [
		"top",
		"middle",
		"bottom"
	],
	overflow: ["visible", "hidden"],
	objectFit: [
		"contain",
		"cover",
		"fill"
	],
	whiteSpace: [
		"normal",
		"nowrap",
		"pre-line"
	],
	textOverflow: ["clip", "ellipsis"]
};
var states = /* @__PURE__ */ new WeakMap();
var presentationObjects = /* @__PURE__ */ new WeakMap();
var presentationOwners = /* @__PURE__ */ new WeakMap();
var presentationBounds = /* @__PURE__ */ new WeakMap();
var rootReferences = /* @__PURE__ */ new Set();
var UIElement = class extends Script {
	constructor(kind, options = {}) {
		super();
		this.isUI = true;
		this.styleTarget = {};
		this.markUIDirty = () => {
			const state = states.get(this);
			if (state) state.revision++;
		};
		this.markUIContentDirty = () => {
			this.markUIDirty();
		};
		this.markUIStructureDirty = () => {
			markRootStructureDirty(findUIRoot(this));
		};
		this.markUIStyleDirty = (_property, _previous, _next) => {
			this.markUIDirty();
		};
		this.assertPlacement = () => {
			const parent = this.parent;
			if (!parent) return;
			const isRoot = isUIRootKind(getUIElementKind(this));
			if (isRoot && isUIElement(parent)) {
				this.removeFromParent();
				throw new Error("Nested UICard and UIOverlay roots are not allowed.");
			}
			if (!isRoot && !isUIElement(parent)) {
				this.removeFromParent();
				throw new Error("Every UI element must be below one UICard or UIOverlay root.");
			}
		};
		states.set(this, {
			kind,
			revision: 0,
			structureRevision: 0
		});
		this.addEventListener("added", this.assertPlacement);
		this.addEventListener("childadded", this.markUIStructureDirty);
		this.addEventListener("childremoved", this.markUIStructureDirty);
		if (isUIRootKind(kind)) rootReferences.add(new WeakRef(this));
		this.styleProxy = createStyleProxy(this.styleTarget, false, this.markUIStyleDirty);
		this.style = options.style ?? {};
		this.visible = options.visible ?? true;
		this.xb = {
			pointerEvents: options.pointerEvents ?? "auto",
			interactionEnabled: options.interactionEnabled ?? true
		};
		if (options.reticleMode !== void 0) this.xb.reticleMode = options.reticleMode;
		if (options.children) this.add(...options.children);
	}
	add(...objects) {
		for (const object of objects) validateUIChild(this, object);
		for (const object of objects) super.add(object);
		return this;
	}
	attach(object) {
		validateUIChild(this, object);
		return super.attach(object);
	}
	getWorldPosition(target) {
		const presentation = presentationObjects.get(this);
		return presentation ? presentation.getWorldPosition(target) : super.getWorldPosition(target);
	}
	get style() {
		return this.styleProxy;
	}
	set style(style) {
		const entries = Object.entries(cloneUIStyle(style));
		for (const key of Object.keys(this.styleTarget)) Reflect.deleteProperty(this.styleProxy, key);
		for (const [key, value] of entries) Reflect.set(this.styleProxy, key, value);
	}
};
function isUIElement(object) {
	return states.has(object);
}
function getUIElementKind(element) {
	return states.get(element).kind;
}
/** Returns the rendered object that owns an element's calculated layout. */
function getUIPresentationObject(element) {
	return presentationObjects.get(element);
}
/** Returns whether an object renders a semantic UI element. */
function isUIPresentationObject(object) {
	return presentationOwners.has(object);
}
/** Registers one rendered object for world-space UI queries. */
function registerUIPresentationObject(element, presentation, bounds) {
	presentationObjects.set(element, presentation);
	presentationOwners.set(presentation, element);
	if (bounds) presentationBounds.set(element, bounds);
	return () => {
		if (presentationObjects.get(element) === presentation) {
			presentationObjects.delete(element);
			presentationBounds.delete(element);
		}
		if (presentationOwners.get(presentation) === element) presentationOwners.delete(presentation);
	};
}
/** Undefined means no clipping-aware presentation is registered. */
function getUIPresentationBounds(object, target) {
	const element = presentationOwners.get(object) ?? object;
	return presentationBounds.get(element)?.(target);
}
function getUIRevision(element) {
	return states.get(element).revision;
}
/** Returns the revision that changes only when the physical UI tree changes. */
function getUIStructureRevision(element) {
	return states.get(element).structureRevision;
}
/** Collects public UI roots without retaining their application lifetime. */
function collectUIRoots(target) {
	target.length = 0;
	for (const reference of rootReferences) {
		const root = reference.deref();
		if (root) target.push(root);
		else rootReferences.delete(reference);
	}
}
/** Validates and detaches a style from caller-owned mutable values. */
function cloneUIStyle(style) {
	if (!style || typeof style !== "object" || Array.isArray(style)) throw new Error("UI style must be an object.");
	for (const [key, value] of Object.entries(style)) validateStyle(key, value, false);
	return Object.fromEntries(Object.entries(style).map(([key, value]) => [key, cloneStyleValue(value)]));
}
function createStyleProxy(target, stateOnly, onChange) {
	return new Proxy(target, {
		set(object, property, value) {
			if (typeof property !== "string") return false;
			validateStyle(property, value, stateOnly);
			if (value === void 0) {
				if (!Reflect.has(object, property)) return true;
				const previous = Reflect.get(object, property);
				Reflect.deleteProperty(object, property);
				onChange(property, previous, void 0);
				return true;
			}
			const next = createNestedStyleValue(property, value, onChange);
			const previous = Reflect.get(object, property);
			if (previous === next) return true;
			Reflect.set(object, property, next);
			onChange(property, previous, next);
			return true;
		},
		deleteProperty(object, property) {
			if (!Reflect.has(object, property)) return true;
			const previous = Reflect.get(object, property);
			Reflect.deleteProperty(object, property);
			if (typeof property === "string") onChange(property, previous, void 0);
			return true;
		}
	});
}
function createNestedStyleValue(property, value, onChange) {
	if (!value || typeof value !== "object") return value;
	if (isStateStyleKey(property)) return createStyleProxy(cloneStyleValue(value), true, onChange);
	if (property === "transform") return createTransformProxy(cloneStyleValue(value), onChange);
	return value;
}
function createTransformProxy(transform, onChange) {
	return new Proxy(transform, {
		set(object, property, value) {
			if (property !== "translateX" && property !== "translateY") return false;
			validateTransformValue(property, value);
			const previous = Reflect.get(object, property);
			if (value === void 0) Reflect.deleteProperty(object, property);
			else Reflect.set(object, property, value);
			onChange("transform", previous, value);
			return true;
		},
		deleteProperty(object, property) {
			if (property !== "translateX" && property !== "translateY") return false;
			const previous = Reflect.get(object, property);
			if (!Reflect.deleteProperty(object, property)) return false;
			onChange("transform", previous, void 0);
			return true;
		}
	});
}
function validateUIChild(parent, child) {
	if (child === parent) throw new Error("A UI element cannot be added to itself.");
	if (isUIElement(child)) {
		if (isUIRootKind(getUIElementKind(child))) throw new Error("Nested UICard and UIOverlay roots are not allowed.");
		return;
	}
	if (getUIElementKind(parent) === "card" && child instanceof TransformScript) return;
	throw new Error("UI elements accept UI children. UICard also accepts TransformScript children.");
}
function findUIRoot(object) {
	let current = object;
	while (current) {
		if (isUIElement(current) && isUIRootKind(getUIElementKind(current))) return current;
		current = current.parent;
	}
}
function markRootStructureDirty(root) {
	if (!root) return;
	states.get(root).structureRevision++;
}
function isUIRootKind(kind) {
	return kind === "card" || kind === "overlay";
}
function validateStyle(property, value, stateOnly) {
	if (!(stateOnly ? STATE_STYLE_KEYS : STYLE_KEYS).has(property)) throw new Error(`Unknown UI style property "${property}".`);
	if (value === void 0) return;
	if (stateOnly && !STATE_STYLE_KEYS.has(property)) throw new Error(`UI state styles cannot change "${property}".`);
	if (isStateStyleKey(property)) {
		if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`UI style "${property}" must be an object.`);
		for (const [key, nested] of Object.entries(value)) validateStyle(key, nested, true);
		return;
	}
	if (property === "transform") {
		validateTransform(value);
		return;
	}
	if (NUMBER_KEYS.has(property) && (typeof value !== "number" || !Number.isFinite(value))) throw new Error(`UI style "${property}" must be a finite number.`);
	if (PAINT_KEYS.has(property) && !isPaint(value)) throw new Error(`UI style "${property}" must be a valid paint.`);
	if ((property === "innerShadowPosition" || property === "dropShadowPosition") && !isVector2Like(value)) throw new Error(`UI style "${property}" must be a finite 2D vector.`);
	if (COLOR_KEYS.has(property)) {
		if (!isSolidColor(value) || value === "transparent") throw new Error(`UI style "${property}" must be a valid color.`);
	}
	if (property === "flexBasis" && value !== "auto") {
		if (typeof value !== "number" || !Number.isFinite(value)) throw new Error("UI style \"flexBasis\" must be finite or \"auto\".");
	}
	if (property === "fontWeight" && typeof value === "number") {
		if (!Number.isFinite(value) || value <= 0) throw new Error("UI style \"fontWeight\" must be positive and finite.");
	}
	if (property === "lineHeight" && !isLineHeight(value)) throw new Error("UI style \"lineHeight\" must be a nonnegative number, pixel value, or percentage.");
	if (POSITION_KEYS.has(property) && !isUIPosition(value)) throw new Error(`UI style "${property}" must be a finite number or percentage.`);
	const enumValues = ENUM_VALUES[property];
	if (enumValues && !(property === "fontWeight" && typeof value === "number") && !enumValues.includes(value)) throw new Error(`Invalid value for UI style "${property}".`);
	if ((property === "width" || property === "height") && !isUIUnit(value)) throw new Error(`UI style "${property}" must be a finite number, percentage, or "auto".`);
	if (NONNEGATIVE_KEYS.has(property) && typeof value === "number" && value < 0) throw new Error(`UI style "${property}" cannot be negative.`);
	if ((property === "width" || property === "height") && typeof value === "string" && value.startsWith("-")) throw new Error(`UI style "${property}" cannot be negative.`);
	if (property === "opacity" && typeof value === "number" && (value < 0 || value > 1)) throw new Error("UI style \"opacity\" must be between 0 and 1.");
	if ((property === "innerShadowFalloff" || property === "dropShadowFalloff") && typeof value === "number" && value <= 0) throw new Error(`UI style "${property}" must be positive.`);
}
function isStateStyleKey(property) {
	return property === ":hover" || property === ":active" || property === ":disabled" || property === ":focus";
}
function isUIUnit(value) {
	return typeof value === "number" && Number.isFinite(value) || value === "auto" || typeof value === "string" && /^-?\d+(?:\.\d+)?%$/.test(value);
}
function isUIPosition(value) {
	return typeof value === "number" && Number.isFinite(value) || typeof value === "string" && /^-?\d+(?:\.\d+)?%$/.test(value);
}
function isLineHeight(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 || typeof value === "string" && /^\d+(?:\.\d+)?(?:px|%)$/.test(value);
}
function validateTransform(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("UI style \"transform\" must be an object.");
	for (const [property, nested] of Object.entries(value)) {
		if (property !== "translateX" && property !== "translateY") throw new Error(`Unknown UI transform property "${property}".`);
		validateTransformValue(property, nested);
	}
}
function validateTransformValue(property, value) {
	if (value !== void 0 && !isUIPosition(value)) throw new Error(`UI transform "${property}" must be a finite number or percentage.`);
}
function isPaint(value) {
	if (isSolidColor(value)) return true;
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const gradient = value;
	if (![
		"linear",
		"radial",
		"angular",
		"diamond"
	].includes(gradient.gradientType ?? "") || !Array.isArray(gradient.stops) || gradient.stops.length < 2 || gradient.stops.length > 4 || gradient.rotation !== void 0 && (!Number.isFinite(gradient.rotation) || typeof gradient.rotation !== "number") || !isVector2Like(gradient.center) || !isVector2Like(gradient.scale)) return false;
	let previousPosition = -Infinity;
	return gradient.stops.every((stop) => {
		const valid = !!stop && typeof stop === "object" && typeof stop.position === "number" && Number.isFinite(stop.position) && stop.position >= 0 && stop.position <= 1 && stop.position >= previousPosition && isSolidColor(stop.color);
		previousPosition = stop?.position ?? previousPosition;
		return valid;
	});
}
function isSolidColor(value) {
	return value instanceof Color || typeof value === "number" && Number.isFinite(value) || typeof value === "string" && value.trim().length > 0;
}
function isVector2Like(value) {
	if (value === void 0 || value instanceof Vector2) return true;
	return Array.isArray(value) && value.length === 2 && value.every((component) => typeof component === "number" ? Number.isFinite(component) : false);
}
function cloneStyleValue(value) {
	if (value instanceof Color) return value.clone();
	if (value instanceof Vector2) return value.clone();
	if (Array.isArray(value)) return value.map(cloneStyleValue);
	if (!value || typeof value !== "object") return value;
	return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, cloneStyleValue(nested)]));
}
var CONTROLS = /* @__PURE__ */ new WeakMap();
/** Registers one built-in semantic control without exposing UI internals. */
function registerSemanticControl(object, state) {
	CONTROLS.set(object, state);
}
function isSemanticControl(object) {
	return CONTROLS.has(object);
}
function isSemanticControlDisabled(object) {
	return CONTROLS.get(object)?.isDisabled() ?? true;
}
function getSemanticControl(object) {
	return CONTROLS.get(object);
}
var ManipulationAction = {
	Translate: "translate",
	Rotate: "rotate",
	Scale: "scale",
	Resize: "resize",
	None: "none"
};
var EPSILON = 1e-8;
function normalizeManipulationConfig(value) {
	if (!value) return void 0;
	if (value === true) return {
		translate: {},
		scale: {},
		handle: ManipulationAction.Translate
	};
	const translate = normalizeAction(value.actions?.translate);
	const rotate = normalizeAction(value.actions?.rotate);
	const scale = normalizeAction(value.actions?.scale);
	const resize = normalizeAction(value.actions?.resize);
	const handle = value.handle?.action;
	if (handle !== void 0 && !isHandleAction(handle)) return void 0;
	if (!translate && !rotate && !scale && !resize) return void 0;
	return {
		translate,
		rotate,
		scale,
		resize,
		handle
	};
}
function isManipulationActionEnabled(config, action) {
	if (action === ManipulationAction.Translate) return !!config.translate;
	if (action === ManipulationAction.Rotate) return !!config.rotate;
	if (action === ManipulationAction.Scale) return !!config.scale;
	if (action === ManipulationAction.Resize) return !!config.resize;
	return false;
}
function isHandleAction(value) {
	return value === ManipulationAction.None || isManipulationAction(value);
}
function normalizeRotationAxis(axis) {
	const vector = axis === void 0 || axis === "y" ? new Vector3(0, 1, 0) : axis === "x" ? new Vector3(1, 0, 0) : axis === "z" ? new Vector3(0, 0, 1) : new Vector3(axis.x, axis.y, axis.z);
	if (!isFiniteVector(vector) || vector.lengthSq() < EPSILON) return void 0;
	return vector.normalize();
}
function cloneScaleOptions(options) {
	const cloneLimit = (value) => typeof value === "object" && value !== null ? {
		x: value.x,
		y: value.y,
		z: value.z
	} : value;
	return {
		minScale: cloneLimit(options?.minScale),
		maxScale: cloneLimit(options?.maxScale)
	};
}
function normalizeAction(value) {
	return value === true ? {} : value || void 0;
}
function isManipulationAction(value) {
	return value === ManipulationAction.Translate || value === ManipulationAction.Rotate || value === ManipulationAction.Scale || value === ManipulationAction.Resize;
}
function isFiniteVector(value) {
	return Number.isFinite(value.x) && Number.isFinite(value.y) && Number.isFinite(value.z);
}
function validateUIAppearance(value) {
	if (value !== "surface" && value !== "none") throw new Error(`Invalid UI appearance "${String(value)}".`);
}
/** The only world-transform root in a spatial UI tree. */
var UICard = class extends UIElement {
	constructor({ size, pixelSize = .001, anchorX = "center", anchorY = "center", appearance = "surface", manipulation, edge = false, ...options }) {
		validateSize(size);
		validatePixelSize(pixelSize);
		validateAnchor(anchorX, [
			"left",
			"center",
			"right"
		], "anchorX");
		validateAnchor(anchorY, [
			"bottom",
			"center",
			"top"
		], "anchorY");
		validateUIAppearance(appearance);
		super("card", options);
		this.name = "UICard";
		this.edgeTarget = { translateFromSurface: false };
		this.edgeEnabled = false;
		this.pixelSize = pixelSize;
		this.anchorX = anchorX;
		this.anchorY = anchorY;
		this.appearance = appearance;
		this.sizeTarget = { ...size };
		this.sizeProxy = new Proxy(this.sizeTarget, { set: (target, property, value) => {
			if (property === "width") validateFixedSize(value);
			else if (property === "height") validateHeight(value);
			else throw new Error(`Unknown UICard size property "${String(property)}".`);
			Reflect.set(target, property, value);
			resolvedSizes.delete(this);
			this.markUIDirty();
			return true;
		} });
		this.edgeProxy = new Proxy(this.edgeTarget, { set: (target, property, value) => {
			if (property !== "translateFromSurface" || typeof value !== "boolean") throw new Error(`Unknown or invalid UICard edge option "${String(property)}".`);
			const previous = Reflect.get(target, property);
			Reflect.set(target, property, value);
			try {
				this.validateEdge();
			} catch (error) {
				Reflect.set(target, property, previous);
				throw error;
			}
			this.markUIDirty();
			return true;
		} });
		this.manipulation = manipulation;
		this.edge = edge;
	}
	get size() {
		return this.sizeProxy;
	}
	set size(value) {
		validateSize(value);
		this.sizeProxy.width = value.width;
		this.sizeProxy.height = value.height;
	}
	get manipulation() {
		return this.xb?.manipulation;
	}
	set manipulation(value) {
		const normalized = normalizeCardManipulation(value);
		this.validateEdge(this.edgeEnabled, normalized);
		this.xb ??= {};
		this.xb.manipulation = normalized;
		this.markUIDirty();
	}
	get edge() {
		return this.edgeEnabled ? this.edgeProxy : false;
	}
	set edge(value) {
		const enabled = value !== false;
		const next = { translateFromSurface: (value && value !== true ? value : {}).translateFromSurface ?? false };
		this.validateEdge(enabled, this.xb?.manipulation);
		this.edgeEnabled = enabled;
		this.edgeTarget.translateFromSurface = next.translateFromSurface;
		this.markUIDirty();
	}
	validateEdge(enabled = this.edgeEnabled, manipulation = this.xb?.manipulation) {
		if (!enabled) return;
		const config = normalizeManipulationConfig(manipulation);
		if (!config?.translate && !config?.resize) throw new Error("UICard edge requires Translate or Resize manipulation.");
	}
};
function getUICardEdgeOptions(card) {
	return card.edge || void 0;
}
var resolvedSizes = /* @__PURE__ */ new WeakMap();
/** Returns the current physical card size after layout resolves. */
function getResolvedUICardSize(card) {
	if (card.size.height !== "auto") return {
		width: card.size.width,
		height: card.size.height
	};
	return resolvedSizes.get(card);
}
/** Stores a backend-calculated physical size for an automatic-height card. */
function setResolvedUICardSize(card, size) {
	if (card.size.height !== "auto") return;
	resolvedSizes.set(card, size);
}
var contentMeasurers = /* @__PURE__ */ new WeakMap();
/** Registers the backend that measures a card's content. */
function setUICardContentMeasurer(card, measurer) {
	if (measurer) contentMeasurers.set(card, measurer);
	else contentMeasurers.delete(card);
}
/**
* Returns the height in meters that the card's content needs at `width`, or
* undefined before the card has a layout.
*/
function measureUICardContentHeight(card, width) {
	return contentMeasurers.get(card)?.height(width);
}
/**
* Returns the narrowest width in meters at which the card's content does not
* overflow, or undefined before the card has a layout.
*/
function measureUICardMinContentWidth(card) {
	return contentMeasurers.get(card)?.minWidth();
}
var CARD_MIN_DISTANCE = .75;
var CARD_MAX_DISTANCE = 5;
function normalizeCardManipulation(value) {
	if (value === void 0 || value === false) return value;
	if (value === true) return {
		actions: {
			translate: {
				faceCamera: true,
				scaleWithDistance: true,
				pushPull: true,
				minDistance: CARD_MIN_DISTANCE,
				maxDistance: CARD_MAX_DISTANCE
			},
			scale: true,
			resize: true
		},
		handle: { action: "translate" }
	};
	const actions = value.actions ? { ...value.actions } : void 0;
	if (actions?.translate === true) actions.translate = { faceCamera: true };
	else if (actions?.translate && typeof actions.translate === "object") actions.translate = {
		...actions.translate,
		faceCamera: actions.translate.faceCamera ?? true
	};
	if (actions?.rotate && typeof actions.rotate === "object") actions.rotate = {
		...actions.rotate,
		axis: actions.rotate.axis && typeof actions.rotate.axis === "object" ? { ...actions.rotate.axis } : actions.rotate.axis
	};
	if (actions?.scale && typeof actions.scale === "object") actions.scale = {
		...actions.scale,
		minScale: actions.scale.minScale && typeof actions.scale.minScale === "object" ? { ...actions.scale.minScale } : actions.scale.minScale,
		maxScale: actions.scale.maxScale && typeof actions.scale.maxScale === "object" ? { ...actions.scale.maxScale } : actions.scale.maxScale
	};
	if (actions?.resize && typeof actions.resize === "object") actions.resize = {
		...actions.resize,
		minSize: actions.resize.minSize ? { ...actions.resize.minSize } : void 0,
		maxSize: actions.resize.maxSize ? { ...actions.resize.maxSize } : void 0
	};
	return {
		...value,
		actions,
		handle: value.handle ? { ...value.handle } : void 0
	};
}
function validateSize(size) {
	if (!size) throw new Error("UICard requires a size.");
	validateFixedSize(size.width);
	validateHeight(size.height);
}
function validateFixedSize(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value < 0) throw new Error("UICard fixed size values must be finite and nonnegative.");
}
function validateHeight(value) {
	if (value === "auto") return;
	validateFixedSize(value);
}
function validatePixelSize(pixelSize) {
	if (!Number.isFinite(pixelSize) || pixelSize <= 0) throw new Error("UICard pixelSize must be positive and finite.");
}
function validateAnchor(value, allowed, property) {
	if (!allowed.includes(value)) throw new Error(`UICard ${property} has an invalid value.`);
}
// node_modules/three/examples/jsm/utils/BufferGeometryUtils.js
/**
* Merges a set of geometries into a single instance. All geometries must have compatible attributes.
*
* @param {Array<BufferGeometry>} geometries - The geometries to merge.
* @param {boolean} [useGroups=false] - Whether to use groups or not.
* @return {?BufferGeometry} The merged geometry. Returns `null` if the merge does not succeed.
*/
function mergeGeometries(geometries, useGroups = false) {
	const isIndexed = geometries[0].index !== null;
	const attributesUsed = new Set(Object.keys(geometries[0].attributes));
	const morphAttributesUsed = new Set(Object.keys(geometries[0].morphAttributes));
	const attributes = {};
	const morphAttributes = {};
	const morphTargetsRelative = geometries[0].morphTargetsRelative;
	const mergedGeometry = new BufferGeometry();
	let offset = 0;
	for (let i = 0; i < geometries.length; ++i) {
		const geometry = geometries[i];
		let attributesCount = 0;
		if (isIndexed !== (geometry.index !== null)) {
			console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.");
			return null;
		}
		for (const name in geometry.attributes) {
			if (!attributesUsed.has(name)) {
				console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ". All geometries must have compatible attributes; make sure \"" + name + "\" attribute exists among all geometries, or in none of them.");
				return null;
			}
			if (attributes[name] === void 0) attributes[name] = [];
			attributes[name].push(geometry.attributes[name]);
			attributesCount++;
		}
		if (attributesCount !== attributesUsed.size) {
			console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ". Make sure all geometries have the same number of attributes.");
			return null;
		}
		if (morphTargetsRelative !== geometry.morphTargetsRelative) {
			console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ". .morphTargetsRelative must be consistent throughout all geometries.");
			return null;
		}
		for (const name in geometry.morphAttributes) {
			if (!morphAttributesUsed.has(name)) {
				console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ".  .morphAttributes must be consistent throughout all geometries.");
				return null;
			}
			if (morphAttributes[name] === void 0) morphAttributes[name] = [];
			morphAttributes[name].push(geometry.morphAttributes[name]);
		}
		if (useGroups) {
			let count;
			if (isIndexed) count = geometry.index.count;
			else if (geometry.attributes.position !== void 0) count = geometry.attributes.position.count;
			else {
				console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + i + ". The geometry must have either an index or a position attribute");
				return null;
			}
			mergedGeometry.addGroup(offset, count, i);
			offset += count;
		}
	}
	if (isIndexed) {
		let indexOffset = 0;
		const mergedIndex = [];
		for (let i = 0; i < geometries.length; ++i) {
			const index = geometries[i].index;
			for (let j = 0; j < index.count; ++j) mergedIndex.push(index.getX(j) + indexOffset);
			indexOffset += geometries[i].attributes.position.count;
		}
		mergedGeometry.setIndex(mergedIndex);
	}
	for (const name in attributes) {
		const mergedAttribute = mergeAttributes(attributes[name]);
		if (!mergedAttribute) {
			console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " + name + " attribute.");
			return null;
		}
		mergedGeometry.setAttribute(name, mergedAttribute);
	}
	for (const name in morphAttributes) {
		const numMorphTargets = morphAttributes[name][0].length;
		if (numMorphTargets === 0) continue;
		mergedGeometry.morphAttributes = mergedGeometry.morphAttributes || {};
		mergedGeometry.morphAttributes[name] = [];
		for (let i = 0; i < numMorphTargets; ++i) {
			const morphAttributesToMerge = [];
			for (let j = 0; j < morphAttributes[name].length; ++j) morphAttributesToMerge.push(morphAttributes[name][j][i]);
			const mergedMorphAttribute = mergeAttributes(morphAttributesToMerge);
			if (!mergedMorphAttribute) {
				console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " + name + " morphAttribute.");
				return null;
			}
			mergedGeometry.morphAttributes[name].push(mergedMorphAttribute);
		}
	}
	return mergedGeometry;
}
/**
* Merges a set of attributes into a single instance. All attributes must have compatible properties and types.
* Instances of {@link InterleavedBufferAttribute} are not supported.
*
* @param {Array<BufferAttribute>} attributes - The attributes to merge.
* @return {?BufferAttribute} The merged attribute. Returns `null` if the merge does not succeed.
*/
function mergeAttributes(attributes) {
	let TypedArray;
	let itemSize;
	let normalized;
	let gpuType = -1;
	let arrayLength = 0;
	for (let i = 0; i < attributes.length; ++i) {
		const attribute = attributes[i];
		if (TypedArray === void 0) TypedArray = attribute.array.constructor;
		if (TypedArray !== attribute.array.constructor) {
			console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.");
			return null;
		}
		if (itemSize === void 0) itemSize = attribute.itemSize;
		if (itemSize !== attribute.itemSize) {
			console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.");
			return null;
		}
		if (normalized === void 0) normalized = attribute.normalized;
		if (normalized !== attribute.normalized) {
			console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.");
			return null;
		}
		if (gpuType === -1) gpuType = attribute.gpuType;
		if (gpuType !== attribute.gpuType) {
			console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.");
			return null;
		}
		arrayLength += attribute.count * itemSize;
	}
	const array = new TypedArray(arrayLength);
	const result = new BufferAttribute(array, itemSize, normalized);
	let offset = 0;
	for (let i = 0; i < attributes.length; ++i) {
		const attribute = attributes[i];
		if (attribute.isInterleavedBufferAttribute) {
			const tupleOffset = offset / itemSize;
			for (let j = 0, l = attribute.count; j < l; j++) for (let c = 0; c < itemSize; c++) {
				const value = attribute.getComponent(j, c);
				result.setComponent(j + tupleOffset, c, value);
			}
		} else array.set(attribute.array, offset);
		offset += attribute.count * itemSize;
	}
	if (gpuType !== void 0) result.gpuType = gpuType;
	return result;
}
/**
* Converts the given geometry to the `TrianglesDrawMode` draw mode, which
* corresponds to the `gl.TRIANGLES` primitive in WebGL. The conversion only
* rewrites the index, so the geometry is modified in place and returned.
*
* @param {BufferGeometry} geometry - The geometry to convert.
* @param {number} drawMode - The current draw mode.
* @return {BufferGeometry} The converted geometry using `TrianglesDrawMode`.
*/
function toTrianglesDrawMode(geometry, drawMode) {
	if (drawMode === 0) {
		console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.");
		return geometry;
	}
	if (drawMode === 2 || drawMode === 1) {
		let index = geometry.getIndex();
		if (index === null) {
			const indices = [];
			const position = geometry.getAttribute("position");
			if (position !== void 0) {
				for (let i = 0; i < position.count; i++) indices.push(i);
				geometry.setIndex(indices);
				index = geometry.getIndex();
			} else {
				console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.");
				return geometry;
			}
		}
		const numberOfTriangles = index.count - 2;
		const newIndices = [];
		if (drawMode === 2) for (let i = 1; i <= numberOfTriangles; i++) {
			newIndices.push(index.getX(0));
			newIndices.push(index.getX(i));
			newIndices.push(index.getX(i + 1));
		}
		else for (let i = 0; i < numberOfTriangles; i++) if (i % 2 === 0) {
			newIndices.push(index.getX(i));
			newIndices.push(index.getX(i + 1));
			newIndices.push(index.getX(i + 2));
		} else {
			newIndices.push(index.getX(i + 2));
			newIndices.push(index.getX(i + 1));
			newIndices.push(index.getX(i));
		}
		if (newIndices.length / 3 !== numberOfTriangles) console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
		geometry.setIndex(newIndices);
		geometry.clearGroups();
		return geometry;
	} else {
		console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", drawMode);
		return geometry;
	}
}
export { measureUICardMinContentWidth as A, isHandleAction as C, isUIElement as D, isSemanticControlDisabled as E, resumeTransformScripts as F, setResolvedUICardSize as I, setUICardContentMeasurer as L, normalizeRotationAxis as M, registerSemanticControl as N, isUIPresentationObject as O, registerUIPresentationObject as P, suspendTransformScripts as R, isDefaultScriptMethod as S, isSemanticControl as T, getUIElementKind as _, MeshScript as a, getUIRevision as b, TransformScript as c, cloneScaleOptions as d, cloneUIStyle as f, getUICardEdgeOptions as g, getSemanticControl as h, ManipulationAction as i, normalizeManipulationConfig as j, measureUICardContentHeight as k, UICard as l, getResolvedUICardSize as m, toTrianglesDrawMode as n, Script as o, collectUIRoots as p, DEFAULT_GRADIENT_PANEL_PROPS as r, ScriptMixin as s, mergeGeometries as t, UIElement as u, getUIPresentationBounds as v, isManipulationActionEnabled as w, getUIStructureRevision as x, getUIPresentationObject as y, validateUIAppearance as z };
