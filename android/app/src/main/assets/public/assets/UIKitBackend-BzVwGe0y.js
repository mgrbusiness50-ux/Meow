const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/EditableText-BSFvblcj.js","assets/three.core-DsEAPerk.js","assets/content-BqDhlcHK.js"])))=>i.map(i=>d[i]);
import { D as isUIElement, I as setResolvedUICardSize, L as setUICardContentMeasurer, P as registerUIPresentationObject, _ as getUIElementKind, b as getUIRevision, c as TransformScript, g as getUICardEdgeOptions, h as getSemanticControl, i as ManipulationAction, j as normalizeManipulationConfig, l as UICard, r as DEFAULT_GRADIENT_PANEL_PROPS, t as mergeGeometries, x as getUIStructureRevision, y as getUIPresentationObject } from "./BufferGeometryUtils-BqAY83DP.js";
import { a as UITextInput, c as normalizeTextInputValue, i as UIText, n as UIOverlay, o as bindScrollView, r as UIScrollView, s as bindTextInput, t as PANEL_BACKFACE_MARKER, u as updateScrollViewLayout } from "./UITextInput-DKG4Ez9F.js";
import { i as ensureWebGPUUIMaterials, n as createCardEdgeMaterial, r as createUnifiedPanelMaterial } from "./PanelMaterialFactory-CxQUYIqv.js";
import { A as parseNumberValue, B as cssColor, C as computedPanelGroupDependencies, D as MeasureMode, E as defaultClippingData, F as O, G as resolveRasterScale, I as l, L as x, M as PanelDistanceMaterial, N as createPanelMaterial, O as computedPanelMatrix, P as resolvePanelMaterialClassProperty, R as y, S as setupInstancedPanel, T as createGlobalClippingPlanes, U as graphemes, V as fontShorthand, W as resolveLineHeight, _ as getKerningOffset, a as setupRenderOrder, b as toAbsoluteNumber, c as loadResourceWithParams, d as componentDefaults, f as createPanelMaterialConfig, g as getGlyphOffsetY, h as getGlyphOffsetX, i as setupOrderInfo, j as PanelDepthMaterial, k as parseAbsoluteLengthValue, l as setupMatrixWorldUpdate, m as getGlyphLayoutHeight, n as ElementType, o as abortableEffect, p as getDefaultPanelMaterialConfig, r as reversePainterSortStable, s as computedBorderInset, t as Content, u as Component, v as getOffsetToNextGlyph, w as computedClippingRect, x as writeColor, y as getOffsetToNextLine, z as DEFAULT_TEXT_LINE_HEIGHT } from "./content-BqDhlcHK.js";
import { $n as Quaternion, A as ClampToEdgeWrapping, Bn as Path, C as BufferGeometry, Cn as MeshDepthMaterial, Hi as Vector2, Mn as MirroredRepeatWrapping, O as CanvasTexture, Rn as Object3D, Sn as MeshBasicMaterial, Ti as TextureLoader, Ui as Vector3, Wi as Vector4, Xr as RepeatWrapping, _n as MathUtils, bn as Matrix4, di as ShapePath, fi as ShapeUtils, ht as Float32BufferAttribute, ii as SRGBColorSpace, j as Color, pt as FileLoader, rn as LinearFilter, ui as ShapeGeometry, un as Loader, wi as Texture, wn as MeshDistanceMaterial, xn as Mesh, xt as Group, y as Box2, yn as Matrix3 } from "./three.core-DsEAPerk.js";
import { t as __vitePreload } from "./preload-helper-BhofnfyO.js";
// node_modules/@pmndrs/uikit/dist/text/cache.js
var fontCache = /* @__PURE__ */ new Map();
var textureLoader$1 = new TextureLoader();
function loadCachedFont(fontInfoOrUrl, onLoad) {
	let entry = fontCache.get(fontInfoOrUrl);
	if (entry instanceof Set) {
		entry.add(onLoad);
		return;
	}
	if (entry != null) {
		onLoad(entry);
		return;
	}
	const set = /* @__PURE__ */ new Set();
	set.add(onLoad);
	fontCache.set(fontInfoOrUrl, set);
	loadFont(fontInfoOrUrl).then((font) => {
		for (const fn of set) fn(font);
		fontCache.set(fontInfoOrUrl, font);
	}).catch(console.error);
}
async function loadFont(fontInfoOrUrl) {
	const resolvedFontInfoOrUrl = await resolveFontInfoSource(fontInfoOrUrl);
	const info = typeof resolvedFontInfoOrUrl === "object" ? resolvedFontInfoOrUrl : await (await fetch(resolvedFontInfoOrUrl)).json();
	if (info.pages.length !== 1) throw new Error("only supporting exactly 1 page");
	const page = await textureLoader$1.loadAsync(new URL(info.pages[0], typeof resolvedFontInfoOrUrl === "string" ? new URL(resolvedFontInfoOrUrl, window.location.href) : void 0).href);
	page.flipY = false;
	return new Font(info, page);
}
function resolveFontInfoSource(fontInfoOrUrl) {
	return typeof fontInfoOrUrl === "function" ? fontInfoOrUrl() : fontInfoOrUrl;
}
// node_modules/@pmndrs/uikit/dist/text/font.js
var fontWeightNames = {
	thin: 100,
	"extra-light": 200,
	light: 300,
	normal: 400,
	medium: 500,
	"semi-bold": 600,
	bold: 700,
	"extra-bold": 800,
	black: 900,
	"extra-black": 950
};
var defaultFontFamiles = { inter: {
	light: () => __vitePreload(async () => {
		const { inter } = await import("./inter-C56c0hd5.js");
		return { inter };
	}, []).then(({ inter }) => inter.light),
	medium: () => __vitePreload(async () => {
		const { inter } = await import("./inter-C56c0hd5.js");
		return { inter };
	}, []).then(({ inter }) => inter.medium),
	"semi-bold": () => __vitePreload(async () => {
		const { inter } = await import("./inter-C56c0hd5.js");
		return { inter };
	}, []).then(({ inter }) => inter["semi-bold"]),
	bold: () => __vitePreload(async () => {
		const { inter } = await import("./inter-C56c0hd5.js");
		return { inter };
	}, []).then(({ inter }) => inter.bold)
} };
function computedFontFamilies(properties, parent) {
	return O(() => {
		const currentFontFamilies = properties.value.fontFamilies;
		const inheritedFontFamilies = parent.value?.fontFamilies.value;
		if (inheritedFontFamilies == null) return currentFontFamilies;
		if (currentFontFamilies == null) return inheritedFontFamilies;
		return {
			...inheritedFontFamilies,
			...currentFontFamilies
		};
	});
}
function computedFont(properties, fontFamiliesSignal) {
	const result = y(void 0);
	x(() => {
		if (!properties.enabled.value) return;
		let fontWeight = properties.value.fontWeight;
		if (typeof fontWeight === "string") {
			fontWeight = parseFloat(fontWeight);
			if (isNaN(fontWeight)) {
				fontWeight = properties.value.fontWeight;
				if (!(fontWeight in fontWeightNames)) throw new Error(`unknown font weight "${fontWeight}"`);
				fontWeight = fontWeightNames[fontWeight];
			}
		}
		let fontFamily = properties.value.fontFamily;
		const fontFamilies = fontFamiliesSignal.value ?? defaultFontFamiles;
		fontFamily ??= Object.keys(fontFamilies)[0];
		let fontFamilyWeightMap = fontFamilies[fontFamily];
		if (fontFamilyWeightMap == null) {
			const availableFontFamilyList = Object.keys(fontFamilies);
			fontFamilyWeightMap = fontFamilies[availableFontFamilyList[0]];
			console.error(`unknown font family "${fontFamily}". Available font families are ${availableFontFamilyList.map((name) => `"${name}"`).join(", ")}. Falling back to "${availableFontFamilyList[0]}".`);
		}
		const url = getMatchingFontUrl(fontFamilyWeightMap, fontWeight);
		let aborted = false;
		loadCachedFont(url, (font) => !aborted && (result.value = font));
		return () => aborted = true;
	});
	return result;
}
function getMatchingFontUrl(fontFamily, weight) {
	let distance = Infinity;
	let result;
	for (const fontWeight of Object.keys(fontFamily)) {
		const d = Math.abs(weight - getWeightNumber(fontWeight));
		if (d === 0) return fontFamily[fontWeight];
		if (d < distance) {
			distance = d;
			result = fontFamily[fontWeight];
		}
	}
	if (result == null) throw new Error(`font family has no entries ${fontFamily}`);
	return result;
}
function getWeightNumber(value) {
	if (value in fontWeightNames) return fontWeightNames[value];
	const number = parseFloat(value);
	if (isNaN(number)) throw new Error(`invalid font weight "${value}"`);
	return number;
}
var MISSING_GLYPH = {
	id: -1,
	index: 0,
	char: "",
	chnl: 0,
	page: 0,
	x: 0,
	y: 0,
	width: .5,
	height: .5,
	xadvance: .6,
	xoffset: 0,
	yoffset: .3,
	uvX: 0,
	uvY: 0,
	uvWidth: 0,
	uvHeight: 0,
	renderSolid: true
};
var Font = class {
	page;
	glyphInfoMap = /* @__PURE__ */ new Map();
	kerningMap = /* @__PURE__ */ new Map();
	pageWidth;
	pageHeight;
	distanceRange;
	constructor(info, page) {
		this.page = page;
		const { scaleW, scaleH, lineHeight } = info.common;
		const { size } = info.info;
		this.pageWidth = scaleW;
		this.pageHeight = scaleH;
		this.distanceRange = info.distanceField.distanceRange;
		for (const glyph of info.chars) {
			const normalizedGlyph = {
				...glyph,
				uvX: glyph.x / scaleW,
				uvY: glyph.y / scaleH,
				uvWidth: glyph.width / scaleW,
				uvHeight: glyph.height / scaleH,
				width: glyph.width / size,
				height: glyph.height / size,
				xadvance: glyph.xadvance / size,
				xoffset: glyph.xoffset / size,
				yoffset: (glyph.yoffset - (lineHeight - size)) / size
			};
			this.glyphInfoMap.set(normalizedGlyph.char, normalizedGlyph);
		}
		for (const { first, second, amount } of info.kernings) this.kerningMap.set(`${first}/${second}`, amount / size);
	}
	getGlyphInfo(char) {
		const glyph = this.glyphInfoMap.get(char);
		if (glyph) return glyph;
		if (char === "\n") {
			const space = this.glyphInfoMap.get(" ");
			if (space) return space;
		}
		console.warn(`Missing glyph info for character "${char}"`);
		return MISSING_GLYPH;
	}
	getKerning(firstId, secondId) {
		return this.kerningMap.get(`${firstId}/${secondId}`) ?? 0;
	}
};
function glyphIntoToUV(info, target, offset) {
	target[offset + 0] = info.uvX;
	target[offset + 1] = info.uvY + info.uvHeight;
	target[offset + 2] = info.uvWidth;
	target[offset + 3] = -info.uvHeight;
}
// node_modules/@pmndrs/uikit/dist/text/wrapper/breakall-wrapper.js
var BreakallWrapper = ({ text, fontSize, font, letterSpacing }, availableWidth, charIndex, target) => {
	const firstIndex = charIndex;
	target.charIndexOffset = firstIndex;
	target.nonWhitespaceCharLength = 0;
	target.charLength = 0;
	target.nonWhitespaceWidth = 0;
	target.whitespacesBetween = 0;
	let position = 0;
	let whitespaces = 0;
	for (; charIndex < text.length; charIndex++) {
		const char = text[charIndex];
		if (char === "\n") {
			target.charLength = charIndex - firstIndex + 1;
			return;
		}
		position += getOffsetToNextGlyph(fontSize, font.getGlyphInfo(char), letterSpacing);
		if (char === " ") {
			whitespaces += 1;
			continue;
		}
		if (target.nonWhitespaceWidth > 0 && availableWidth != null && position > availableWidth) break;
		target.nonWhitespaceCharLength = charIndex - firstIndex + 1;
		target.nonWhitespaceWidth = position;
		target.whitespacesBetween = whitespaces;
	}
	target.charLength = charIndex - firstIndex;
};
// node_modules/@pmndrs/uikit/dist/text/wrapper/nowrap-wrapper.js
var NowrapWrapper = ({ text, fontSize, font, letterSpacing }, _, charIndex, target) => {
	const firstIndex = charIndex;
	target.charIndexOffset = firstIndex;
	target.nonWhitespaceCharLength = 0;
	target.charLength = 0;
	target.nonWhitespaceWidth = 0;
	target.whitespacesBetween = 0;
	let position = 0;
	let whitespaces = 0;
	for (; charIndex < text.length; charIndex++) {
		const char = text[charIndex];
		if (char === "\n") {
			target.charLength = charIndex - firstIndex + 1;
			return;
		}
		position += getOffsetToNextGlyph(fontSize, font.getGlyphInfo(char), letterSpacing);
		if (char === " ") {
			whitespaces += 1;
			continue;
		}
		target.nonWhitespaceWidth = position;
		target.whitespacesBetween = whitespaces;
		target.nonWhitespaceCharLength = charIndex - firstIndex + 1;
	}
	target.charLength = charIndex - firstIndex;
};
// node_modules/@pmndrs/uikit/dist/text/wrapper/word-wrapper.js
var WordWrapper = ({ text, fontSize, font, letterSpacing }, availableWidth, charIndex, target) => {
	const firstIndex = charIndex;
	target.charIndexOffset = firstIndex;
	target.nonWhitespaceCharLength = 0;
	target.charLength = 0;
	target.nonWhitespaceWidth = 0;
	target.whitespacesBetween = 0;
	let position = 0;
	let whitespaces = 0;
	for (; charIndex < text.length; charIndex++) {
		const char = text[charIndex];
		if (char === "\n") {
			target.charLength = charIndex - firstIndex + 1;
			break;
		}
		position += getOffsetToNextGlyph(fontSize, font.getGlyphInfo(char), letterSpacing);
		if (char === " ") {
			whitespaces += 1;
			target.charLength = charIndex - firstIndex + 1;
			continue;
		}
		if (target.nonWhitespaceWidth > 0 && availableWidth != null && position > availableWidth) break;
		const nextChar = text[charIndex + 1];
		if (nextChar === " " || nextChar === "\n" || nextChar == null) {
			target.charLength = charIndex - firstIndex + 1;
			target.nonWhitespaceCharLength = target.charLength;
			target.nonWhitespaceWidth = position;
			target.whitespacesBetween = whitespaces;
		}
	}
};
// node_modules/@pmndrs/uikit/dist/text/layout/measure.js
var wrappers = {
	"keep-all": NowrapWrapper,
	"break-all": BreakallWrapper,
	"break-word": WordWrapper
};
var lineHelper = {};
function computedCustomLayouting(layoutPropertiesSignal) {
	return O(() => {
		const layoutProperties = layoutPropertiesSignal.value;
		if (layoutProperties == null) return;
		const { width: minWidth } = measureGlyphLayout(layoutProperties, 0);
		const { height: minHeight } = measureGlyphLayout(layoutProperties, void 0);
		return {
			minHeight,
			minWidth,
			measure: (width, widthMode) => measureGlyphLayout(layoutProperties, widthMode === MeasureMode.Undefined ? void 0 : width)
		};
	});
}
function measureGlyphLayout(properties, availableWidth) {
	const wrapper = wrappers[properties.wordBreak];
	const text = properties.text;
	let width = 0;
	let lines = 0;
	let charIndex = 0;
	while (charIndex < text.length) {
		wrapper(properties, availableWidth, charIndex, lineHelper);
		width = Math.max(width, lineHelper.nonWhitespaceWidth);
		lines += 1;
		charIndex = lineHelper.charLength + lineHelper.charIndexOffset;
	}
	if (text[text.length - 1] === "\n") lines += 1;
	return {
		width,
		height: getGlyphLayoutHeight(lines, properties.lineHeight)
	};
}
function buildGlyphLayout(properties, availableWidth, availableHeight) {
	const lines = [];
	const wrapper = wrappers[properties.wordBreak];
	const text = properties.text;
	let charIndex = 0;
	while (charIndex < text.length) {
		const line = {};
		wrapper(properties, availableWidth, charIndex, line);
		lines.push(line);
		charIndex = line.charLength + line.charIndexOffset;
	}
	if (lines.length === 0 || text[text.length - 1] === "\n") lines.push({
		charLength: 0,
		nonWhitespaceWidth: 0,
		whitespacesBetween: 0,
		charIndexOffset: text.length,
		nonWhitespaceCharLength: 0
	});
	return {
		lines,
		availableHeight,
		availableWidth,
		...properties
	};
}
// node_modules/@pmndrs/uikit/dist/text/layout/positioned.js
function buildPositionedGlyphLayout(properties, availableWidth, availableHeight, textAlign, verticalAlign) {
	const layout = buildGlyphLayout(properties, availableWidth, availableHeight);
	const positionedLines = [];
	const { font, fontSize, letterSpacing = 0, lineHeight = 1.2, text } = layout;
	const whitespaceWidth = getWhitespaceWidth(layout);
	let y = getTextYOffset(layout, verticalAlign) - availableHeight / 2;
	for (let lineIndex = 0; lineIndex < layout.lines.length; lineIndex++) {
		const line = layout.lines[lineIndex];
		const entries = [];
		let offsetPerWhitespace = textAlign === "justify" && line.whitespacesBetween > 0 ? (availableWidth - line.nonWhitespaceWidth) / line.whitespacesBetween : 0;
		let x = getTextXOffset(availableWidth, line.nonWhitespaceWidth, textAlign) - availableWidth / 2;
		let prevGlyphId;
		for (let charIndex = line.charIndexOffset; charIndex < line.charIndexOffset + line.charLength; charIndex++) {
			const char = text[charIndex];
			const glyphInfo = font.getGlyphInfo(char);
			x += getKerningOffset(font, fontSize, prevGlyphId, glyphInfo);
			prevGlyphId = glyphInfo.id;
			if (char === " " || charIndex > line.nonWhitespaceCharLength + line.charIndexOffset) {
				entries.push({
					type: "whitespace",
					charIndex,
					x: x + getGlyphOffsetX(glyphInfo, fontSize),
					width: whitespaceWidth
				});
				x += offsetPerWhitespace + getOffsetToNextGlyph(fontSize, glyphInfo, letterSpacing);
				continue;
			}
			entries.push({
				type: "glyph",
				charIndex,
				char,
				glyphInfo,
				x: x + getGlyphOffsetX(glyphInfo, fontSize),
				y: -(y + getGlyphOffsetY(fontSize, lineHeight, glyphInfo)),
				width: glyphInfo.width * fontSize
			});
			x += getOffsetToNextGlyph(fontSize, glyphInfo, letterSpacing);
		}
		positionedLines.push({
			...line,
			entries
		});
		y += getOffsetToNextLine(lineHeight);
	}
	return {
		...layout,
		lines: positionedLines,
		textAlign,
		verticalAlign
	};
}
function getTextXOffset(availableWidth, nonWhitespaceWidth, textAlign) {
	switch (textAlign) {
		case "right": return availableWidth - nonWhitespaceWidth;
		case "center": return (availableWidth - nonWhitespaceWidth) / 2;
		default: return 0;
	}
}
function getTextYOffset(layout, verticalAlign) {
	switch (verticalAlign) {
		case "center":
		case "middle": return (layout.availableHeight - getGlyphLayoutHeight(layout.lines.length, layout.lineHeight)) / 2;
		case "bottom": return layout.availableHeight - getGlyphLayoutHeight(layout.lines.length, layout.lineHeight);
		default: return 0;
	}
}
function getWhitespaceWidth({ font, fontSize }) {
	return font.getGlyphInfo(" ").xadvance * fontSize;
}
// node_modules/@pmndrs/uikit/dist/text/layout/normalize.js
function buildGlyphOutProperties(font, text, { fontSize: fontSizeString, letterSpacing, lineHeight: lineHeightString, wordBreak }) {
	const fontSize = toAbsoluteNumber(fontSizeString);
	let lineHeight;
	if (typeof lineHeightString === "string" && lineHeightString.endsWith("px")) lineHeight = parseFloat(lineHeightString);
	else lineHeight = fontSize * toAbsoluteNumber(lineHeightString, () => 1);
	return {
		font,
		text,
		fontSize,
		letterSpacing: toAbsoluteNumber(letterSpacing),
		lineHeight,
		wordBreak
	};
}
var collapseRegex = /[\t\n ]+/gm;
var preLineCollapseNonLinefeedWhitespaceRegex = /[\t ]+/g;
var preLineCollapseLinefeedRegex = /[\t ]*\n[\t ]*/gm;
var preLineTrimNonLinefeedWhitespaceRegex = /^[ \t]+|[ \t]+$/g;
function computedGlyphOutProperties(properties, fontSignal) {
	return O(() => {
		const font = fontSignal.value;
		if (font == null) return;
		const textProperty = properties.value.text;
		let text = Array.isArray(textProperty) ? textProperty.map(toString).join("") : toString(textProperty);
		const tabSize = parseNumberValue(properties.value.tabSize);
		switch (properties.value.whiteSpace) {
			case "pre":
				text = text.replaceAll("	", " ".repeat(tabSize));
				break;
			case "pre-line":
				text = text.replaceAll(preLineCollapseNonLinefeedWhitespaceRegex, " ").replaceAll(preLineCollapseLinefeedRegex, "\n").replaceAll(preLineTrimNonLinefeedWhitespaceRegex, "");
				break;
			default: text = text.replaceAll(collapseRegex, " ").trim();
		}
		return buildGlyphOutProperties(font, text, properties.value);
	});
}
function toString(value) {
	if (value instanceof l) value = value.value;
	if (value == null) return "";
	return String(value);
}
// node_modules/@pmndrs/uikit/dist/text/layout/matrix.js
var IdentityMatrix = new Matrix4();
var IdentityQuaternion = new Quaternion();
var IdentityScale = new Vector3(1, 1, 1);
var textMatrixPosition = new Vector3();
function computedGlobalTextMatrix(target) {
	return O(() => {
		const paddingInset = target.paddingInset.value;
		const borderInset = target.borderInset.value;
		if (paddingInset == null || borderInset == null) return IdentityMatrix;
		return getGlobalTextMatrix(paddingInset, borderInset, parseNumberValue(target.properties.value.pixelSize), target.globalMatrix.value ?? IdentityMatrix);
	});
}
function getGlobalTextMatrix(paddingInset, borderInset, pixelSize, globalMatrix = IdentityMatrix) {
	const [pTop, pRight, pBottom, pLeft] = paddingInset;
	const [bTop, bRight, bBottom, bLeft] = borderInset;
	const topInset = pTop + bTop;
	const rightInset = pRight + bRight;
	const bottomInset = pBottom + bBottom;
	const leftInset = pLeft + bLeft;
	textMatrixPosition.set((leftInset - rightInset) * .5 * pixelSize, (bottomInset - topInset) * .5 * pixelSize, 0);
	return new Matrix4().compose(textMatrixPosition, IdentityQuaternion, IdentityScale).premultiply(globalMatrix);
}
// node_modules/@pmndrs/uikit/dist/text/layout/index.js
function setupTextLayout(target) {
	const layoutProperties = computedGlyphOutProperties(target.properties, target.fontSignal);
	const customLayouting = computedCustomLayouting(layoutProperties);
	return {
		layout: O(() => {
			const properties = layoutProperties.value;
			const { size: { value: size }, paddingInset: { value: paddingInset }, borderInset: { value: borderInset } } = target;
			if (properties == null || size == null || paddingInset == null || borderInset == null) return;
			const [width, height] = size;
			const [pTop, pRight, pBottom, pLeft] = paddingInset;
			const [bTop, bRight, bBottom, bLeft] = borderInset;
			return buildPositionedGlyphLayout(properties, width - pRight - pLeft - bRight - bLeft, height - pTop - pBottom - bTop - bBottom, target.properties.value.textAlign, target.properties.value.verticalAlign);
		}),
		customLayouting
	};
}
// node_modules/@pmndrs/uikit/dist/text/render/instanced-glyph.js
var helperMatrix1 = new Matrix4();
var helperMatrix2 = new Matrix4();
function computedGylphGroupDependencies(fontSignal) {
	return O(() => ({ font: fontSignal.value }));
}
/**
* renders an initially specified glyph
*/
var InstancedGlyph = class {
	group;
	baseMatrix;
	color;
	opacity;
	clippingRect;
	index;
	hidden = true;
	glyphInfo;
	x = 0;
	y = 0;
	fontSize = 0;
	pixelSize = 0;
	constructor(group, baseMatrix, color, opacity, clippingRect) {
		this.group = group;
		this.baseMatrix = baseMatrix;
		this.color = color;
		this.opacity = opacity;
		this.clippingRect = clippingRect;
	}
	getX(widthMultiplier) {
		if (this.glyphInfo == null) return this.x;
		return this.x + widthMultiplier * this.glyphInfo.width * this.fontSize;
	}
	show() {
		if (!this.hidden) return;
		this.hidden = false;
		this.group.requestActivate(this);
	}
	hide() {
		if (this.hidden) return;
		this.hidden = true;
		this.group.delete(this);
	}
	activate(index) {
		this.index = index;
		this.writeUpdatedMatrix();
		this.writeUV();
		this.writeRenderSolid();
		this.updateColor(this.color, this.opacity);
		this.updateClippingRect(this.clippingRect);
	}
	setIndex(index) {
		this.index = index;
	}
	updateClippingRect(clippingRect) {
		this.clippingRect = clippingRect;
		if (this.index == null) return;
		const offset = this.index * 16;
		const { instanceClipping, root } = this.group;
		if (this.clippingRect == null) instanceClipping.set(defaultClippingData, offset);
		else this.clippingRect.toArray(instanceClipping.array, offset);
		instanceClipping.addUpdateRange(offset, 16);
		instanceClipping.needsUpdate = true;
		root.requestRender?.();
	}
	updateColor(color, opacity) {
		this.color = color;
		this.opacity = opacity;
		if (this.index == null) return;
		const { instanceRGBA, root } = this.group;
		const offset = instanceRGBA.itemSize * this.index;
		writeColor(instanceRGBA.array, offset, color, opacity);
		instanceRGBA.addUpdateRange(offset, 4);
		instanceRGBA.needsUpdate = true;
		root.requestRender?.();
	}
	updateGlyphAndTransformation(glyphInfo, x, y, fontSize, pixelSize) {
		if (this.glyphInfo === glyphInfo && this.x === x && this.y === y && this.fontSize === fontSize && this.pixelSize === pixelSize) return;
		if (this.glyphInfo != glyphInfo) {
			this.glyphInfo = glyphInfo;
			this.writeUV();
			this.writeRenderSolid();
		}
		this.x = x;
		this.y = y;
		this.fontSize = fontSize;
		this.pixelSize = pixelSize;
		this.writeUpdatedMatrix();
	}
	updateBaseMatrix(baseMatrix) {
		if (this.baseMatrix === baseMatrix) return;
		this.baseMatrix = baseMatrix;
		this.writeUpdatedMatrix();
	}
	writeUV() {
		if (this.index == null || this.glyphInfo == null) return;
		const offset = this.index * 4;
		const { instanceUV, root } = this.group;
		glyphIntoToUV(this.glyphInfo, instanceUV.array, offset);
		instanceUV.addUpdateRange(offset, 4);
		instanceUV.needsUpdate = true;
		root.requestRender?.();
	}
	writeRenderSolid() {
		if (this.index == null || this.glyphInfo == null) return;
		const { instanceRenderSolid, root } = this.group;
		const offset = this.index * 1;
		instanceRenderSolid.array[offset] = this.glyphInfo.renderSolid ? 1 : 0;
		instanceRenderSolid.addUpdateRange(offset, 1);
		instanceRenderSolid.needsUpdate = true;
		root.requestRender?.();
	}
	writeUpdatedMatrix() {
		if (this.index == null || this.glyphInfo == null || this.baseMatrix == null) return;
		const offset = this.index * 16;
		const { instanceMatrix, root } = this.group;
		instanceMatrix.addUpdateRange(offset, 16);
		helperMatrix1.makeTranslation(this.x * this.pixelSize, this.y * this.pixelSize, 0).multiply(helperMatrix2.makeScale(this.fontSize * this.glyphInfo.width * this.pixelSize, this.fontSize * this.glyphInfo.height * this.pixelSize, 1)).premultiply(this.baseMatrix);
		helperMatrix1.toArray(instanceMatrix.array, offset);
		instanceMatrix.needsUpdate = true;
		root.requestRender?.();
	}
};
// node_modules/@pmndrs/uikit/dist/text/render/instanced-text.js
var additionalTextDefaults = { verticalAlign: "middle" };
function createInstancedText(text, parentClippingRect, layoutSignal) {
	abortableEffect(() => {
		const font = text.fontSignal.value;
		const orderInfo = text.orderInfo.value;
		if (font == null || orderInfo == null) return;
		const instancedText = new InstancedText(text.root.value.glyphGroupManager.getGroup(orderInfo, text.properties.value.depthTest, text.properties.value.depthWrite ?? false, parseNumberValue(text.properties.value.renderOrder ?? 0), font), text.properties, layoutSignal, text.globalTextMatrix, text.isVisible, parentClippingRect);
		return () => instancedText.destroy();
	}, text.abortSignal);
}
var InstancedText = class {
	group;
	properties;
	layoutSignal;
	matrix;
	parentClippingRect;
	glyphLines = [];
	unsubscribeInitialList = [];
	unsubscribeShowList = [];
	constructor(group, properties, layoutSignal, matrix, isVisible, parentClippingRect) {
		this.group = group;
		this.properties = properties;
		this.layoutSignal = layoutSignal;
		this.matrix = matrix;
		this.parentClippingRect = parentClippingRect;
		this.unsubscribeInitialList = [x(() => {
			if (!isVisible.value || toAbsoluteNumber(this.properties.value.opacity, () => 1) < .01) {
				this.hide();
				return;
			}
			this.show();
		})];
	}
	show() {
		if (this.unsubscribeShowList.length > 0) return;
		traverseGlyphs(this.glyphLines, (glyph) => glyph.show());
		this.unsubscribeShowList.push(x(() => {
			const matrix = this.matrix.value;
			if (matrix == null) return;
			traverseGlyphs(this.glyphLines, (glyph) => glyph.updateBaseMatrix(matrix));
		}), x(() => {
			const clippingRect = this.parentClippingRect?.value;
			traverseGlyphs(this.glyphLines, (glyph) => glyph.updateClippingRect(clippingRect));
		}), x(() => {
			const color = this.properties.value.color;
			const opacity = toAbsoluteNumber(this.properties.value.opacity, () => 1);
			traverseGlyphs(this.glyphLines, (glyph) => glyph.updateColor(color ?? 0, opacity));
		}), x(() => {
			const layout = this.layoutSignal.value;
			if (layout == null) return;
			const { lines, fontSize = 16 } = layout;
			const linesLength = lines.length;
			const pixelSize = parseNumberValue(this.properties.value.pixelSize);
			for (let lineIndex = 0; lineIndex < linesLength; lineIndex++) {
				if (lineIndex === this.glyphLines.length) this.glyphLines.push([]);
				const { entries } = lines[lineIndex];
				const glyphs = this.glyphLines[lineIndex];
				for (let glyphIndex = 0; glyphIndex < entries.length; glyphIndex++) {
					const entry = entries[glyphIndex];
					if (entry.type === "whitespace") {
						if (typeof glyphs[glyphIndex] === "number") glyphs[glyphIndex] = entry.x;
						else glyphs.splice(glyphIndex, 0, entry.x);
						continue;
					}
					let glyphOrNumber = glyphs[glyphIndex];
					while (glyphIndex < glyphs.length && typeof glyphOrNumber == "number") {
						glyphs.splice(glyphIndex, 1);
						glyphOrNumber = glyphs[glyphIndex];
					}
					let glyph = glyphOrNumber;
					if (glyph == null) glyphs[glyphIndex] = glyph = new InstancedGlyph(this.group, this.matrix.peek(), this.properties.peek().color ?? 0, toAbsoluteNumber(this.properties.peek().opacity, () => 1), this.parentClippingRect?.peek());
					glyph.updateGlyphAndTransformation(entry.glyphInfo, entry.x, entry.y, fontSize, pixelSize);
					glyph.show();
				}
				const glyphsLength = glyphs.length;
				const newGlyphsLength = entries.length;
				for (let ii = newGlyphsLength; ii < glyphsLength; ii++) {
					const glyph = glyphs[ii];
					if (typeof glyph === "number") continue;
					glyph.hide();
				}
				glyphs.length = newGlyphsLength;
			}
			traverseGlyphs(this.glyphLines, (glyph) => glyph.hide(), linesLength);
			this.glyphLines.length = linesLength;
		}));
	}
	hide() {
		const unsubscribeListLength = this.unsubscribeShowList.length;
		if (unsubscribeListLength === 0) return;
		for (let i = 0; i < unsubscribeListLength; i++) this.unsubscribeShowList[i]();
		this.unsubscribeShowList.length = 0;
		traverseGlyphs(this.glyphLines, (glyph) => glyph.hide());
	}
	destroy() {
		this.hide();
		this.glyphLines.length = 0;
		const length = this.unsubscribeInitialList.length;
		for (let i = 0; i < length; i++) this.unsubscribeInitialList[i]();
	}
};
function traverseGlyphs(glyphLines, fn, offset = 0) {
	const glyphLinesLength = glyphLines.length;
	for (let i = offset; i < glyphLinesLength; i++) {
		const glyphs = glyphLines[i];
		const glyphsLength = glyphs.length;
		for (let ii = 0; ii < glyphsLength; ii++) {
			const glyph = glyphs[ii];
			if (typeof glyph == "number") continue;
			fn(glyph);
		}
	}
}
// node_modules/@pmndrs/uikit/dist/scroll.js
var distanceHelper = new Vector3();
var localPointHelper = new Vector3();
function computedGlobalScrollMatrix(properties, scrollPosition, globalMatrix) {
	return O(() => {
		const global = globalMatrix.value;
		if (global == null) return;
		const [scrollX, scrollY] = scrollPosition.value;
		const pixelSize = parseNumberValue(properties.value.pixelSize);
		return new Matrix4().makeTranslation(-scrollX * pixelSize, scrollY * pixelSize, 0).premultiply(global);
	});
}
function computedAnyAncestorScrollable(parentSignal) {
	return O(() => {
		const parent = parentSignal.value;
		const [ancestorX, ancestorY] = parent?.anyAncestorScrollable?.value ?? [false, false];
		const [x, y] = parent?.scrollable.value ?? [false, false];
		return [ancestorX || x, ancestorY || y];
	});
}
function setupScrollHandlers(target, container, abortSignal, updateScrollFrame) {
	const isScrollable = O(() => container.scrollable.value.some((scrollable) => scrollable) ?? false);
	abortableEffect(() => {
		if (!isScrollable.value) {
			target.value = void 0;
			return;
		}
		const onPointerFinish = (event) => {
			if ("releasePointerCapture" in container && typeof container.releasePointerCapture === "function" && event.pointerId != null) container.releasePointerCapture(event.pointerId);
			if (event.pointerId == null || !container.downPointerMap.delete(event.pointerId) || container.scrollPosition.value == null) return;
			event.stopImmediatePropagation?.();
			if (container.downPointerMap.size > 0) return;
			container.root.peek().requestRender?.();
			updateScrollFrame();
		};
		target.value = {
			onPointerDown: (event) => {
				event.stopImmediatePropagation?.();
				const localPoint = container.worldToLocal(event.point.clone());
				const ponterIsMouse = event.nativeEvent != null && typeof event.nativeEvent === "object" && "pointerType" in event.nativeEvent && event.nativeEvent.pointerType === "mouse";
				const scrollbarAxisIndex = ponterIsMouse ? getIntersectedScrollbarIndex(localPoint, parseAbsoluteLengthValue(container.properties.peek().scrollbarWidth ?? 0), container.size.peek(), container.maxScrollPosition.peek(), container.borderInset.peek(), container.scrollPosition.peek()) : void 0;
				if (event.pointerId == null || ponterIsMouse && scrollbarAxisIndex == null) return;
				if ("setPointerCapture" in event.object && typeof event.object.setPointerCapture === "function") event.object.setPointerCapture(event.pointerId);
				container.downPointerMap.set(event.pointerId, scrollbarAxisIndex != null ? {
					type: "scroll-bar",
					localPoint,
					axisIndex: scrollbarAxisIndex
				} : {
					type: "scroll-panel",
					timestamp: performance.now(),
					localPoint
				});
			},
			onPointerUp: onPointerFinish,
			onPointerLeave: onPointerFinish,
			onPointerCancel: onPointerFinish,
			onPointerMove: (event) => {
				if (event.pointerId == null) return;
				const prevInteraction = container.downPointerMap.get(event.pointerId);
				if (prevInteraction == null) return;
				event.stopImmediatePropagation?.();
				container.worldToLocal(localPointHelper.copy(event.point));
				distanceHelper.copy(localPointHelper).sub(prevInteraction.localPoint);
				distanceHelper.x *= container.size.peek()?.[0] ?? 0;
				distanceHelper.y *= container.size.peek()?.[1] ?? 0;
				prevInteraction.localPoint.copy(localPointHelper);
				if (prevInteraction.type === "scroll-bar") {
					const size = container.size.peek();
					if (size == null) return;
					toScrollbarScrollDistance(distanceHelper, prevInteraction.axisIndex, size, container.borderInset.peek(), container.maxScrollPosition.peek(), parseAbsoluteLengthValue(container.properties.peek().scrollbarWidth ?? 0));
					scroll(container, event, distanceHelper.x, -distanceHelper.y, void 0, false);
					updateScrollFrame();
					return;
				}
				const timestamp = performance.now();
				const deltaTime = timestamp - prevInteraction.timestamp;
				scroll(container, event, -distanceHelper.x, distanceHelper.y, deltaTime, true);
				updateScrollFrame();
				prevInteraction.timestamp = timestamp;
			},
			onWheel: (event) => {
				const { nativeEvent } = event;
				if (nativeEvent == null || typeof nativeEvent != "object" || !("deltaX" in nativeEvent) || typeof nativeEvent.deltaX != "number" || !("deltaY" in nativeEvent) || typeof nativeEvent.deltaY != "number") return;
				scroll(container, event, nativeEvent.deltaX, nativeEvent.deltaY, void 0, false);
				updateScrollFrame();
			}
		};
	}, abortSignal);
}
function scroll(container, event, deltaX, deltaY, deltaTime, enableRubberBand) {
	const scrollPosition = container.scrollPosition.value;
	if (scrollPosition == null) return;
	const [wasScrolledX, wasScrolledY] = event == null ? [false, false] : getWasScrolled(event.nativeEvent);
	if (wasScrolledX) deltaX = 0;
	if (wasScrolledY) deltaY = 0;
	const [x, y] = scrollPosition;
	const [maxX, maxY] = container.maxScrollPosition.value;
	let [newX, newY] = scrollPosition;
	const [ancestorScrollableX, ancestorScrollableY] = container.anyAncestorScrollable?.value ?? [false, false];
	newX = computeScroll(x, maxX, deltaX, enableRubberBand && !ancestorScrollableX);
	newY = computeScroll(y, maxY, deltaY, enableRubberBand && !ancestorScrollableY);
	if (deltaTime != null && deltaTime > 0) container.scrollVelocity.set(deltaX, deltaY).divideScalar(deltaTime);
	if (event != null) setWasScrolled(event.nativeEvent, wasScrolledX || Math.min(x, (maxX ?? 0) - x) > 5, wasScrolledY || Math.min(y, (maxY ?? 0) - y) > 5);
	if (container.properties.peek().onScroll?.(newX, newY, container.scrollPosition, event) === false || x === newX && y === newY) return;
	container.scrollPosition.value = [newX, newY];
}
function setupScroll(container) {
	const scrollFrameNeeded = y(false);
	const updateScrollFrame = () => {
		const scrollPosition = container.scrollPosition.value;
		const [maxX, maxY] = container.maxScrollPosition.value;
		const needed = scrollPosition != null && (container.scrollVelocity.x !== 0 || container.scrollVelocity.y !== 0 || Math.abs(outsideDistance(scrollPosition[0], 0, maxX ?? 0)) > 1 || Math.abs(outsideDistance(scrollPosition[1], 0, maxY ?? 0)) > 1);
		scrollFrameNeeded.value = needed;
		if (needed) container.root.peek().requestFrame?.();
	};
	const onFrame = (delta) => {
		if (container.downPointerMap.size > 0) return;
		const scrollPosition = container.scrollPosition.value;
		if (scrollPosition == null) {
			updateScrollFrame();
			return;
		}
		let deltaX = 0;
		let deltaY = 0;
		const [x, y] = scrollPosition;
		const [maxX, maxY] = container.maxScrollPosition.value;
		const outsideDistanceX = outsideDistance(x, 0, maxX ?? 0);
		const outsideDistanceY = outsideDistance(y, 0, maxY ?? 0);
		deltaX += outsideDistanceX * -.3;
		deltaY += outsideDistanceY * -.3;
		deltaX += container.scrollVelocity.x * delta;
		deltaY += container.scrollVelocity.y * delta;
		container.scrollVelocity.multiplyScalar(.9);
		if (Math.abs(container.scrollVelocity.x) < .01) container.scrollVelocity.x = 0;
		if (Math.abs(container.scrollVelocity.y) < .01) container.scrollVelocity.y = 0;
		if (deltaX !== 0 || deltaY !== 0) scroll(container, void 0, deltaX, deltaY, void 0, true);
		updateScrollFrame();
	};
	abortableEffect(updateScrollFrame, container.abortSignal);
	abortableEffect(() => {
		if (!scrollFrameNeeded.value) return;
		const root = container.root.value;
		root.onFrameSet.add(onFrame);
		root.requestFrame?.();
		return () => root.onFrameSet.delete(onFrame);
	}, container.abortSignal);
	return updateScrollFrame;
}
var wasScrolledSymbol = Symbol("was-scrolled");
function getWasScrolled(event) {
	return event[wasScrolledSymbol] ?? [false, false];
}
function setWasScrolled(event, x, y) {
	event[wasScrolledSymbol] = [x, y];
}
function computeScroll(position, maxPosition, delta, enableRubberBand) {
	if (delta === 0) return position;
	const outside = outsideDistance(position, 0, maxPosition ?? 0);
	if (sign(delta) === sign(outside)) delta *= Math.max(0, 1 - Math.abs(outside) / 100);
	let newPosition = position + delta;
	if (enableRubberBand && maxPosition != null) return newPosition;
	return MathUtils.clamp(newPosition, 0, maxPosition ?? 0);
}
function sign(value) {
	return value >= 0;
}
function outsideDistance(value, min, max) {
	if (value < min) return value - min;
	if (value > max) return value - max;
	return 0;
}
var scrollbarBorderPropertyKeys = [
	"scrollbarBorderLeftWidth",
	"scrollbarBorderRightWidth",
	"scrollbarBorderTopWidth",
	"scrollbarBorderBottomWidth"
];
function setupScrollbars(container, parentClippingRect, prevOrderInfo, prevPanelDeps) {
	const scrollbarOrderInfo = y(void 0);
	setupOrderInfo(scrollbarOrderInfo, container.properties, "scrollbarZIndex", ElementType.Panel, prevPanelDeps, prevOrderInfo, container.abortSignal);
	const borderInset = computedBorderInset(container.properties, scrollbarBorderPropertyKeys);
	setupScrollbar(container, 0, parentClippingRect, scrollbarOrderInfo, prevPanelDeps, borderInset);
	setupScrollbar(container, 1, parentClippingRect, scrollbarOrderInfo, prevPanelDeps, borderInset);
}
var scrollbarMaterialConfig;
function getScrollbarMaterialConfig() {
	scrollbarMaterialConfig ??= createPanelMaterialConfig({
		backgroundColor: "scrollbarColor",
		borderBottomLeftRadius: "scrollbarBorderBottomLeftRadius",
		borderBottomRightRadius: "scrollbarBorderBottomRightRadius",
		borderTopRightRadius: "scrollbarBorderTopRightRadius",
		borderTopLeftRadius: "scrollbarBorderTopLeftRadius",
		borderColor: "scrollbarBorderColor",
		borderBend: "scrollbarBorderBend"
	}, { backgroundColor: 16777215 });
	return scrollbarMaterialConfig;
}
function setupScrollbar(container, primaryIndex, parentClippingRect, orderInfo, groupDeps, borderSize) {
	const scrollbarTransformation = O(() => computeScrollbarTransformation(primaryIndex, parseAbsoluteLengthValue(container.properties.value.scrollbarWidth ?? 0), container.size.value, container.maxScrollPosition.value, container.borderInset.value, container.scrollPosition.value));
	const scrollbarPosition = O(() => scrollbarTransformation.value?.slice(0, 2) ?? [0, 0]);
	const scrollbarSize = O(() => scrollbarTransformation.value?.slice(2, 4) ?? [0, 0]);
	const panelMatrix = computedPanelMatrix(container.properties, container.globalMatrix, scrollbarSize, scrollbarPosition);
	setupInstancedPanel(container.properties, container.root, orderInfo, groupDeps, panelMatrix, scrollbarSize, borderSize, parentClippingRect, container.isVisible, getScrollbarMaterialConfig(), container.abortSignal);
}
function computeScrollbarTransformation(primaryAxisIndex, secondaryScrollbarSize, size, maxScrollPosition, borderInset, scrollPosition) {
	if (size == null || borderInset == null || scrollPosition == null) return;
	const primaryMaxScrollPosition = maxScrollPosition[primaryAxisIndex];
	if (primaryMaxScrollPosition == null) return;
	const result = [
		0,
		0,
		0,
		0
	];
	const endInsetIndex = 1 - primaryAxisIndex;
	const primarySizeWithoutBorder = size[primaryAxisIndex] - borderInset[endInsetIndex] - borderInset[endInsetIndex + 2];
	const primaryScrollbarSize = computePrimaryScrollbarSize(primarySizeWithoutBorder, primaryMaxScrollPosition, secondaryScrollbarSize);
	const primaryMaxScrollbarPosition = primarySizeWithoutBorder - primaryScrollbarSize;
	const primaryScrollPosition = scrollPosition[primaryAxisIndex];
	const invertedIndex = 1 - primaryAxisIndex;
	result[primaryAxisIndex] = size[primaryAxisIndex] * .5 - primaryScrollbarSize * .5 - borderInset[(primaryAxisIndex + 3) % 4] - primaryMaxScrollbarPosition * MathUtils.clamp(primaryScrollPosition / primaryMaxScrollPosition, 0, 1);
	result[invertedIndex] = size[invertedIndex] * .5 - secondaryScrollbarSize * .5 - borderInset[invertedIndex + 1];
	if (primaryAxisIndex === 0) {
		result[0] *= -1;
		result[1] *= -1;
	}
	result[primaryAxisIndex + 2] = primaryScrollbarSize;
	result[endInsetIndex + 2] = secondaryScrollbarSize;
	return result;
}
function computePrimaryScrollbarSize(primarySizeWithoutBorder, primaryMaxScrollPosition, secondaryScrollbarSize) {
	return Math.max(secondaryScrollbarSize, primarySizeWithoutBorder * primarySizeWithoutBorder / (primaryMaxScrollPosition + primarySizeWithoutBorder));
}
/**
* @param target contains the delta movement in pixels and will receive the delta scroll distance in pixels
*/
function toScrollbarScrollDistance(target, primaryAxisIndex, size, borderInset, maxScrollPosition, secondaryScrollbarSize) {
	const primaryMaxScrollPosition = maxScrollPosition[primaryAxisIndex];
	if (size == null || borderInset == null || primaryMaxScrollPosition == null) return;
	const delta = target.getComponent(primaryAxisIndex);
	const primarySizeWithoutBorder = size[primaryAxisIndex] - borderInset[1 - primaryAxisIndex] - borderInset[1 - primaryAxisIndex + 2];
	const primaryMaxScrollbarPosition = primarySizeWithoutBorder - computePrimaryScrollbarSize(primarySizeWithoutBorder, primaryMaxScrollPosition, secondaryScrollbarSize);
	target.setComponent(primaryAxisIndex, delta / primaryMaxScrollbarPosition * primaryMaxScrollPosition);
	target.setComponent(1 - primaryAxisIndex, 0);
	target.z = 0;
}
var box2Helper = new Box2();
var point2Helper = new Vector2();
function getIntersectedScrollbarIndex(point, secondaryScrollbarSize, size, maxScrollPosition, borderInset, scrollPosition) {
	if (size == null) return;
	point2Helper.copy(point);
	point2Helper.x *= size[0];
	point2Helper.y *= size[1];
	for (let i = 0; i < 2; i++) if (intersectsScrollbar(point2Helper, i, secondaryScrollbarSize, size, maxScrollPosition, borderInset, scrollPosition)) return i;
}
var centerHelper = new Vector2();
var sizeHelper = new Vector2();
function intersectsScrollbar(point, axisIndex, secondaryScrollbarSize, size, maxScrollPosition, borderInset, scrollPosition) {
	const result = computeScrollbarTransformation(axisIndex, secondaryScrollbarSize, size, maxScrollPosition, borderInset, scrollPosition);
	if (result == null) return false;
	box2Helper.setFromCenterAndSize(centerHelper.fromArray(result, 0), sizeHelper.fromArray(result, 2));
	return box2Helper.containsPoint(point);
}
// node_modules/@pmndrs/uikit/dist/components/container.js
var Container = class Container extends Component {
	inputConfig;
	downPointerMap = /* @__PURE__ */ new Map();
	scrollVelocity = new Vector2();
	anyAncestorScrollable;
	clippingRect;
	childrenMatrix;
	fontFamilies;
	scrollPosition = y([0, 0]);
	constructor(inputProperties, initialClasses, inputConfig) {
		const scrollHandlers = y(void 0);
		super(inputProperties, initialClasses, {
			hasNonUikitChildren: false,
			isRenderless: true,
			dynamicHandlers: scrollHandlers,
			...inputConfig
		});
		this.inputConfig = inputConfig;
		this.material.visible = false;
		const updateScrollFrame = setupScroll(this);
		setupScrollHandlers(scrollHandlers, this, this.abortSignal, updateScrollFrame);
		this.childrenMatrix = computedGlobalScrollMatrix(this.properties, this.scrollPosition, this.globalMatrix);
		const parentClippingRect = O(() => this.parentContainer.value?.clippingRect.value);
		this.fontFamilies = computedFontFamilies(this.properties, this.parentContainer);
		this.clippingRect = computedClippingRect(this.globalMatrix, this, O(() => parseNumberValue(this.properties.value.pixelSize)), parentClippingRect);
		this.anyAncestorScrollable = computedAnyAncestorScrollable(this.parentContainer);
		const panelGroupDeps = computedPanelGroupDependencies(this.properties);
		setupOrderInfo(this.orderInfo, this.properties, "zIndex", ElementType.Panel, panelGroupDeps, O(() => this.parentContainer.value == null ? null : this.parentContainer.value.orderInfo.value), this.abortSignal);
		setupInstancedPanel(this.properties, this.root, this.orderInfo, panelGroupDeps, this.globalPanelMatrix, this.size, this.borderInset, parentClippingRect, this.isVisible, getDefaultPanelMaterialConfig(), this.abortSignal);
		setupScrollbars(this, parentClippingRect, this.orderInfo, panelGroupDeps);
	}
	clone(recursive) {
		const cloned = new Container(this.inputProperties, this.initialClasses, this.inputConfig);
		this.copyInto(cloned, recursive);
		return cloned;
	}
};
// node_modules/@pmndrs/uikit/dist/components/image.js
var imageDefaults = {
	...componentDefaults,
	objectFit: "fill",
	keepAspectRatio: true
};
var Image = class Image extends Component {
	inputConfig;
	texture = y(void 0);
	constructor(inputProperties, initialClasses, inputConfig) {
		const aspectRatio = y(void 0);
		super(inputProperties, initialClasses, {
			defaults: imageDefaults,
			hasNonUikitChildren: false,
			...inputConfig,
			defaultOverrides: {
				aspectRatio,
				...inputConfig?.defaultOverrides
			}
		});
		this.inputConfig = inputConfig;
		setupOrderInfo(this.orderInfo, this.properties, "zIndex", ElementType.Image, void 0, O(() => this.parentContainer.value == null ? null : this.parentContainer.value.orderInfo.value), this.abortSignal);
		this.frustumCulled = false;
		setupRenderOrder(this, this.root, this.orderInfo);
		if (inputConfig?.loadTexture ?? true) loadResourceWithParams(this.texture, loadTextureImpl, cleanupTexture, this.abortSignal, this.properties.signal.src);
		const clippingPlanes = createGlobalClippingPlanes(this);
		const isMeshVisible = getImageMaterialConfig().computedIsVisibile(this.properties, this.borderInset, this.size, O(() => this.isVisible.value && this.texture.value != null));
		const data = /* @__PURE__ */ new Float32Array(16);
		const info = {
			data,
			type: "normal"
		};
		this.customDepthMaterial = new PanelDepthMaterial(info);
		this.customDistanceMaterial = new PanelDistanceMaterial(info);
		this.customDepthMaterial.clippingPlanes = clippingPlanes;
		this.customDistanceMaterial.clippingPlanes = clippingPlanes;
		abortableEffect(() => {
			this.material.depthTest = this.properties.value.depthTest;
			this.root.peek().requestRender?.();
		}, this.abortSignal);
		abortableEffect(() => {
			this.material.depthWrite = this.properties.value.depthWrite ?? false;
			this.root.peek().requestRender?.();
		}, this.abortSignal);
		abortableEffect(() => {
			this.material.map = this.texture.value ?? null;
			this.material.needsUpdate = true;
			this.root.peek().requestRender?.();
		}, this.abortSignal);
		abortableEffect(() => {
			const material = createPanelMaterial(resolvePanelMaterialClassProperty(this.properties.value.panelMaterialClass), info);
			material.clippingPlanes = clippingPlanes;
			material.map = this.material.map;
			material.depthWrite = this.material.depthWrite;
			material.depthTest = this.material.depthTest;
			this.material = material;
			return () => material.dispose();
		}, this.abortSignal);
		abortableEffect(() => {
			this.renderOrder = parseNumberValue(this.properties.value.renderOrder ?? 0);
			this.root.peek().requestRender?.();
		}, this.abortSignal);
		abortableEffect(() => {
			this.castShadow = this.properties.value.castShadow;
			this.root.peek().requestRender?.();
		}, this.abortSignal);
		abortableEffect(() => {
			this.receiveShadow = this.properties.value.receiveShadow;
			this.root.peek().requestRender?.();
		}, this.abortSignal);
		setupMatrixWorldUpdate(this, this.root, this.globalPanelMatrix, this.abortSignal);
		const imageMaterialConfig = getImageMaterialConfig();
		abortableEffect(() => {
			if (!this.isVisible.value) return;
			data.set(imageMaterialConfig.defaultData);
			const cleanupSizeEffect = x(() => {
				const size = this.size.value;
				if (size != null) data.set(size, 14);
			});
			const cleanupBorderEffect = x(() => {
				const borderInset = this.borderInset.value;
				if (borderInset != null) data.set(borderInset, 0);
			});
			this.root.peek().requestRender?.();
			return () => {
				cleanupSizeEffect();
				cleanupBorderEffect();
			};
		}, this.abortSignal);
		abortableEffect(() => {
			if (!this.isVisible.value) return;
			const opacity = toAbsoluteNumber(this.properties.value.opacity ?? 1, () => 1);
			writeColor(data, 4, 16777215, opacity, void 0);
			this.root.peek().requestRender?.();
		}, this.abortSignal);
		const setters = imageMaterialConfig.setters;
		abortableEffect(() => {
			if (!this.isVisible.value) return;
			return this.properties.subscribePropertyKeys((key) => {
				if (!imageMaterialConfig.hasProperty(key)) return;
				abortableEffect(() => {
					setters[key](data, 0, this.properties.value[key], this.size, this.properties.signal.opacity, void 0);
					this.root.peek().requestRender?.();
				}, this.abortSignal);
			});
		}, this.abortSignal);
		abortableEffect(() => {
			const texture = this.texture.value;
			const size = this.size.value;
			const borderInset = this.borderInset.value;
			if (texture == null || size == null || borderInset == null) return;
			texture.matrix.identity();
			this.root.peek().requestRender?.();
			if (this.properties.value.objectFit === "fill" || texture == null) {
				transformInsideBorder(borderInset, size, texture);
				return;
			}
			const { width: textureWidth, height: textureHeight } = texture.source.data;
			const textureRatio = textureWidth / textureHeight;
			const [width, height] = size;
			const [top, right, bottom, left] = borderInset;
			const boundsRatioValue = (width - left - right) / (height - top - bottom);
			if (textureRatio > boundsRatioValue) texture.matrix.premultiply(helperMatrix.makeTranslation(-(.5 * (boundsRatioValue - textureRatio)) / boundsRatioValue, 0)).premultiply(helperMatrix.makeScale(boundsRatioValue / textureRatio, 1));
			else texture.matrix.premultiply(helperMatrix.makeTranslation(0, -(.5 * (textureRatio - boundsRatioValue)) / textureRatio)).premultiply(helperMatrix.makeScale(1, textureRatio / boundsRatioValue));
			transformInsideBorder(borderInset, size, texture);
		}, this.abortSignal);
		abortableEffect(() => {
			this.visible = isMeshVisible.value;
			this.root.peek().requestRender?.();
		}, this.abortSignal);
		abortableEffect(() => {
			if (!this.properties.value.keepAspectRatio) {
				aspectRatio.value = void 0;
				return;
			}
			const tex = this.texture.value;
			if (tex == null) {
				aspectRatio.value = void 0;
				return;
			}
			const image = tex.source.data;
			const width = image.videoWidth ?? image.naturalWidth ?? image.width;
			const height = image.videoHeight ?? image.naturalHeight ?? image.height;
			aspectRatio.value = width / height;
		}, this.abortSignal);
	}
	clone(recursive) {
		const cloned = new Image(this.inputProperties, this.initialClasses, this.inputConfig);
		this.copyInto(cloned, recursive);
		return cloned;
	}
	add() {
		throw new Error(`the image component can not have any children`);
	}
};
var helperMatrix = new Matrix3();
function transformInsideBorder(borderInset, size, texture) {
	const [outerWidth, outerHeight] = size;
	const [top, right, bottom, left] = borderInset;
	const width = outerWidth - left - right;
	const height = outerHeight - top - bottom;
	texture.matrix.premultiply(helperMatrix.makeTranslation(-1 + (left + width) / outerWidth, -1 + (top + height) / outerHeight)).premultiply(helperMatrix.makeScale(outerWidth / width, outerHeight / height));
}
var textureLoader = new TextureLoader();
function cleanupTexture(texture) {
	if (texture?.disposable === true) texture.dispose();
}
async function loadTextureImpl(src) {
	if (src == null) return Promise.resolve(void 0);
	if (src instanceof Texture) return Promise.resolve(src);
	try {
		const texture = await textureLoader.loadAsync(src);
		texture.colorSpace = SRGBColorSpace;
		texture.matrixAutoUpdate = false;
		return Object.assign(texture, { disposable: true });
	} catch (error) {
		console.error(error);
		return;
	}
}
var imageMaterialConfig;
function getImageMaterialConfig() {
	imageMaterialConfig ??= createPanelMaterialConfig({
		borderBend: "borderBend",
		borderBottomLeftRadius: "borderBottomLeftRadius",
		borderBottomRightRadius: "borderBottomRightRadius",
		borderColor: "borderColor",
		borderTopLeftRadius: "borderTopLeftRadius",
		borderTopRightRadius: "borderTopRightRadius"
	}, { backgroundColor: 16777215 });
	return imageMaterialConfig;
}
// node_modules/@pmndrs/uikit/dist/components/text.js
var textDefaults = {
	...componentDefaults,
	...additionalTextDefaults
};
var Text = class Text extends Component {
	inputConfig;
	backgroundOrderInfo = y(void 0);
	backgroundGroupDeps;
	fontSignal;
	textLayout;
	globalTextMatrix;
	constructor(inputProperties, initialClasses, inputConfig) {
		super(inputProperties, initialClasses, {
			defaults: textDefaults,
			hasNonUikitChildren: false,
			isRenderless: true,
			...inputConfig
		});
		this.inputConfig = inputConfig;
		this.material.visible = false;
		const parentClippingRect = O(() => this.parentContainer.value?.clippingRect.value);
		this.backgroundGroupDeps = computedPanelGroupDependencies(this.properties);
		this.globalTextMatrix = computedGlobalTextMatrix(this);
		setupOrderInfo(this.backgroundOrderInfo, this.properties, "zIndex", ElementType.Panel, this.backgroundGroupDeps, O(() => this.parentContainer.value == null ? null : this.parentContainer.value.orderInfo.value), this.abortSignal);
		const fontFamilies = computedFontFamilies(this.properties, this.parentContainer);
		this.fontSignal = computedFont(this.properties, fontFamilies);
		setupOrderInfo(this.orderInfo, this.properties, "zIndex", ElementType.Text, computedGylphGroupDependencies(this.fontSignal), this.backgroundOrderInfo, this.abortSignal);
		setupInstancedPanel(this.properties, this.root, this.backgroundOrderInfo, this.backgroundGroupDeps, this.globalPanelMatrix, this.size, this.borderInset, parentClippingRect, this.isVisible, getDefaultPanelMaterialConfig(), this.abortSignal);
		const { layout, customLayouting } = setupTextLayout(this);
		this.textLayout = layout;
		createInstancedText(this, parentClippingRect, this.textLayout);
		abortableEffect(() => this.node.setCustomLayouting(customLayouting.value), this.abortSignal);
	}
	clone(recursive) {
		const cloned = new Text(this.inputProperties, this.initialClasses, this.inputConfig);
		this.copyInto(cloned, recursive);
		return cloned;
	}
	add() {
		throw new Error(`the text component can not have any children`);
	}
};
// node_modules/three/examples/jsm/loaders/SVGLoader.js
var COLOR_SPACE_SVG = SRGBColorSpace;
/**
* A loader for the SVG format.
*
* Scalable Vector Graphics is an XML-based vector image format for two-dimensional graphics
* with support for interactivity and animation.
*
* ```js
* const loader = new SVGLoader();
* const data = await loader.loadAsync( 'data/svgSample.svg' );
*
* const paths = data.paths;
* const group = new THREE.Group();
*
* for ( let i = 0; i < paths.length; i ++ ) {
*
* 	const path = paths[ i ];
* 	const material = new THREE.MeshBasicMaterial( {
* 		color: path.color,
* 		side: THREE.DoubleSide,
* 		depthWrite: false
* 	} );
*
* 	const shapes = SVGLoader.createShapes( path );
*
* 	for ( let j = 0; j < shapes.length; j ++ ) {
*
* 		const shape = shapes[ j ];
* 		const geometry = new THREE.ShapeGeometry( shape );
* 		const mesh = new THREE.Mesh( geometry, material );
* 		group.add( mesh );
*
* 	}
*
* }
*
* scene.add( group );
* ```
*
* @augments Loader
* @three_import import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
*/
var SVGLoader = class SVGLoader extends Loader {
	/**
	* Constructs a new SVG loader.
	*
	* @param {LoadingManager} [manager] - The loading manager.
	*/
	constructor(manager) {
		super(manager);
		/**
		* Default dots per inch.
		*
		* @type {number}
		* @default 90
		*/
		this.defaultDPI = 90;
		/**
		* Default unit.
		*
		* @type {('mm'|'cm'|'in'|'pt'|'pc'|'px')}
		* @default 'px'
		*/
		this.defaultUnit = "px";
	}
	/**
	* Starts loading from the given URL and passes the loaded SVG asset
	* to the `onLoad()` callback.
	*
	* @param {string} url - The path/URL of the file to be loaded. This can also be a data URI.
	* @param {function({paths:Array<ShapePath>,xml:string})} onLoad - Executed when the loading process has been finished.
	* @param {onProgressCallback} onProgress - Executed while the loading is in progress.
	* @param {onErrorCallback} onError - Executed when errors occur.
	*/
	load(url, onLoad, onProgress, onError) {
		const scope = this;
		const loader = new FileLoader(scope.manager);
		loader.setPath(scope.path);
		loader.setRequestHeader(scope.requestHeader);
		loader.setWithCredentials(scope.withCredentials);
		loader.load(url, function(text) {
			try {
				onLoad(scope.parse(text));
			} catch (e) {
				if (onError) onError(e);
				else console.error(e);
				scope.manager.itemError(url);
			}
		}, onProgress, onError);
	}
	/**
	* Parses the given SVG data and returns the resulting data.
	*
	* @param {string} text - The raw SVG data as a string.
	* @return {{paths:Array<ShapePath>,xml:string}} An object holding an array of shape paths and the
	* SVG XML document.
	*/
	parse(text) {
		const scope = this;
		function parseNode(node, style) {
			if (node.nodeType !== 1) return;
			if (node.hasAttribute("filter")) console.warn("THREE.SVGLoader: Filters are not supported.");
			const transform = getNodeTransform(node);
			let isDefsNode = false;
			let path = null;
			switch (node.nodeName) {
				case "svg":
					style = parseStyle(node, style);
					break;
				case "style":
					parseCSSStylesheet(node);
					break;
				case "g":
					style = parseStyle(node, style);
					break;
				case "path":
					style = parseStyle(node, style);
					if (node.hasAttribute("d")) path = parsePathNode(node);
					break;
				case "rect":
					style = parseStyle(node, style);
					path = parseRectNode(node);
					break;
				case "polygon":
					style = parseStyle(node, style);
					path = parsePolygonNode(node);
					break;
				case "polyline":
					style = parseStyle(node, style);
					path = parsePolylineNode(node);
					break;
				case "circle":
					style = parseStyle(node, style);
					path = parseCircleNode(node);
					break;
				case "ellipse":
					style = parseStyle(node, style);
					path = parseEllipseNode(node);
					break;
				case "line":
					style = parseStyle(node, style);
					path = parseLineNode(node);
					break;
				case "defs":
					isDefsNode = true;
					break;
				case "use":
					style = parseStyle(node, style);
					const usedNodeId = (node.getAttributeNS("http://www.w3.org/1999/xlink", "href") || "").substring(1);
					const usedNode = node.viewportElement.getElementById(usedNodeId);
					if (usedNode) parseNode(usedNode, style);
					else console.warn("SVGLoader: 'use node' references non-existent node id: " + usedNodeId);
			}
			if (path) {
				if (style.fill !== void 0 && style.fill !== "none" && !style.fill.startsWith("url")) path.color.setStyle(style.fill, COLOR_SPACE_SVG);
				transformPath(path, currentTransform);
				paths.push(path);
				const pathStyle = Object.assign({}, style);
				pathStyle.strokeWidth = style.strokeWidth * getTransformScale(currentTransform);
				path.userData = {
					node,
					style: pathStyle,
					transform: currentTransform.clone(),
					gradients
				};
			}
			const childNodes = node.childNodes;
			for (let i = 0; i < childNodes.length; i++) {
				const node = childNodes[i];
				if (isDefsNode && node.nodeName !== "style" && node.nodeName !== "defs") continue;
				parseNode(node, style);
			}
			if (transform) {
				transformStack.pop();
				if (transformStack.length > 0) currentTransform.copy(transformStack[transformStack.length - 1]);
				else currentTransform.identity();
			}
		}
		function parsePathNode(node) {
			const path = new ShapePath();
			const point = new Vector2();
			const control = new Vector2();
			const firstPoint = new Vector2();
			let isFirstPoint = true;
			let doSetFirstPoint = false;
			const d = node.getAttribute("d");
			if (d === "" || d === "none") return null;
			const commands = d.match(/[a-df-z][^a-df-z]*/gi);
			for (let i = 0, l = commands.length; i < l; i++) {
				const command = commands[i];
				const type = command.charAt(0);
				const data = command.slice(1).trim();
				if (isFirstPoint === true) {
					doSetFirstPoint = true;
					isFirstPoint = false;
				}
				let numbers;
				switch (type) {
					case "M":
						numbers = parseFloats(data);
						for (let j = 0, jl = numbers.length; j < jl; j += 2) {
							point.x = numbers[j + 0];
							point.y = numbers[j + 1];
							control.x = point.x;
							control.y = point.y;
							if (j === 0) path.moveTo(point.x, point.y);
							else path.lineTo(point.x, point.y);
							if (j === 0) firstPoint.copy(point);
						}
						break;
					case "H":
						numbers = parseFloats(data);
						for (let j = 0, jl = numbers.length; j < jl; j++) {
							point.x = numbers[j];
							control.x = point.x;
							control.y = point.y;
							path.lineTo(point.x, point.y);
							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);
						}
						break;
					case "V":
						numbers = parseFloats(data);
						for (let j = 0, jl = numbers.length; j < jl; j++) {
							point.y = numbers[j];
							control.x = point.x;
							control.y = point.y;
							path.lineTo(point.x, point.y);
							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);
						}
						break;
					case "L":
						numbers = parseFloats(data);
						for (let j = 0, jl = numbers.length; j < jl; j += 2) {
							point.x = numbers[j + 0];
							point.y = numbers[j + 1];
							control.x = point.x;
							control.y = point.y;
							path.lineTo(point.x, point.y);
							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);
						}
						break;
					case "C":
						numbers = parseFloats(data);
						for (let j = 0, jl = numbers.length; j < jl; j += 6) {
							path.bezierCurveTo(numbers[j + 0], numbers[j + 1], numbers[j + 2], numbers[j + 3], numbers[j + 4], numbers[j + 5]);
							control.x = numbers[j + 2];
							control.y = numbers[j + 3];
							point.x = numbers[j + 4];
							point.y = numbers[j + 5];
							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);
						}
						break;
					case "S":
						numbers = parseFloats(data);
						for (let j = 0, jl = numbers.length; j < jl; j += 4) {
							path.bezierCurveTo(getReflection(point.x, control.x), getReflection(point.y, control.y), numbers[j + 0], numbers[j + 1], numbers[j + 2], numbers[j + 3]);
							control.x = numbers[j + 0];
							control.y = numbers[j + 1];
							point.x = numbers[j + 2];
							point.y = numbers[j + 3];
							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);
						}
						break;
					case "Q":
						numbers = parseFloats(data);
						for (let j = 0, jl = numbers.length; j < jl; j += 4) {
							path.quadraticCurveTo(numbers[j + 0], numbers[j + 1], numbers[j + 2], numbers[j + 3]);
							control.x = numbers[j + 0];
							control.y = numbers[j + 1];
							point.x = numbers[j + 2];
							point.y = numbers[j + 3];
							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);
						}
						break;
					case "T":
						numbers = parseFloats(data);
						for (let j = 0, jl = numbers.length; j < jl; j += 2) {
							const rx = getReflection(point.x, control.x);
							const ry = getReflection(point.y, control.y);
							path.quadraticCurveTo(rx, ry, numbers[j + 0], numbers[j + 1]);
							control.x = rx;
							control.y = ry;
							point.x = numbers[j + 0];
							point.y = numbers[j + 1];
							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);
						}
						break;
					case "A":
						numbers = parseFloats(data, [3, 4], 7);
						for (let j = 0, jl = numbers.length; j < jl; j += 7) {
							if (numbers[j + 5] == point.x && numbers[j + 6] == point.y) continue;
							const start = point.clone();
							point.x = numbers[j + 5];
							point.y = numbers[j + 6];
							control.x = point.x;
							control.y = point.y;
							parseArcCommand(path, numbers[j], numbers[j + 1], numbers[j + 2], numbers[j + 3], numbers[j + 4], start, point);
							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);
						}
						break;
					case "m":
						numbers = parseFloats(data);
						for (let j = 0, jl = numbers.length; j < jl; j += 2) {
							point.x += numbers[j + 0];
							point.y += numbers[j + 1];
							control.x = point.x;
							control.y = point.y;
							if (j === 0) path.moveTo(point.x, point.y);
							else path.lineTo(point.x, point.y);
							if (j === 0) firstPoint.copy(point);
						}
						break;
					case "h":
						numbers = parseFloats(data);
						for (let j = 0, jl = numbers.length; j < jl; j++) {
							point.x += numbers[j];
							control.x = point.x;
							control.y = point.y;
							path.lineTo(point.x, point.y);
							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);
						}
						break;
					case "v":
						numbers = parseFloats(data);
						for (let j = 0, jl = numbers.length; j < jl; j++) {
							point.y += numbers[j];
							control.x = point.x;
							control.y = point.y;
							path.lineTo(point.x, point.y);
							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);
						}
						break;
					case "l":
						numbers = parseFloats(data);
						for (let j = 0, jl = numbers.length; j < jl; j += 2) {
							point.x += numbers[j + 0];
							point.y += numbers[j + 1];
							control.x = point.x;
							control.y = point.y;
							path.lineTo(point.x, point.y);
							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);
						}
						break;
					case "c":
						numbers = parseFloats(data);
						for (let j = 0, jl = numbers.length; j < jl; j += 6) {
							path.bezierCurveTo(point.x + numbers[j + 0], point.y + numbers[j + 1], point.x + numbers[j + 2], point.y + numbers[j + 3], point.x + numbers[j + 4], point.y + numbers[j + 5]);
							control.x = point.x + numbers[j + 2];
							control.y = point.y + numbers[j + 3];
							point.x += numbers[j + 4];
							point.y += numbers[j + 5];
							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);
						}
						break;
					case "s":
						numbers = parseFloats(data);
						for (let j = 0, jl = numbers.length; j < jl; j += 4) {
							path.bezierCurveTo(getReflection(point.x, control.x), getReflection(point.y, control.y), point.x + numbers[j + 0], point.y + numbers[j + 1], point.x + numbers[j + 2], point.y + numbers[j + 3]);
							control.x = point.x + numbers[j + 0];
							control.y = point.y + numbers[j + 1];
							point.x += numbers[j + 2];
							point.y += numbers[j + 3];
							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);
						}
						break;
					case "q":
						numbers = parseFloats(data);
						for (let j = 0, jl = numbers.length; j < jl; j += 4) {
							path.quadraticCurveTo(point.x + numbers[j + 0], point.y + numbers[j + 1], point.x + numbers[j + 2], point.y + numbers[j + 3]);
							control.x = point.x + numbers[j + 0];
							control.y = point.y + numbers[j + 1];
							point.x += numbers[j + 2];
							point.y += numbers[j + 3];
							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);
						}
						break;
					case "t":
						numbers = parseFloats(data);
						for (let j = 0, jl = numbers.length; j < jl; j += 2) {
							const rx = getReflection(point.x, control.x);
							const ry = getReflection(point.y, control.y);
							path.quadraticCurveTo(rx, ry, point.x + numbers[j + 0], point.y + numbers[j + 1]);
							control.x = rx;
							control.y = ry;
							point.x = point.x + numbers[j + 0];
							point.y = point.y + numbers[j + 1];
							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);
						}
						break;
					case "a":
						numbers = parseFloats(data, [3, 4], 7);
						for (let j = 0, jl = numbers.length; j < jl; j += 7) {
							if (numbers[j + 5] == 0 && numbers[j + 6] == 0) continue;
							const start = point.clone();
							point.x += numbers[j + 5];
							point.y += numbers[j + 6];
							control.x = point.x;
							control.y = point.y;
							parseArcCommand(path, numbers[j], numbers[j + 1], numbers[j + 2], numbers[j + 3], numbers[j + 4], start, point);
							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);
						}
						break;
					case "Z":
					case "z":
						path.currentPath.autoClose = true;
						if (path.currentPath.curves.length > 0) {
							point.copy(firstPoint);
							path.currentPath.currentPoint.copy(point);
							isFirstPoint = true;
						}
						break;
					default: console.warn(command);
				}
				doSetFirstPoint = false;
			}
			return path;
		}
		function parseCSSStylesheet(node) {
			if (!node.sheet || !node.sheet.cssRules || !node.sheet.cssRules.length) return;
			for (let i = 0; i < node.sheet.cssRules.length; i++) {
				const stylesheet = node.sheet.cssRules[i];
				if (stylesheet.type !== 1) continue;
				const selectorList = stylesheet.selectorText.split(/,/gm).filter(Boolean).map((i) => i.trim());
				for (let j = 0; j < selectorList.length; j++) {
					const definitions = Object.fromEntries(Object.entries(stylesheet.style).filter(([, v]) => v !== ""));
					stylesheets[selectorList[j]] = Object.assign(stylesheets[selectorList[j]] || {}, definitions);
				}
			}
		}
		/**
		* https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
		* https://mortoray.com/2017/02/16/rendering-an-svg-elliptical-arc-as-bezier-curves/ Appendix: Endpoint to center arc conversion
		* From
		* rx ry x-axis-rotation large-arc-flag sweep-flag x y
		* To
		* aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation
		*/
		function parseArcCommand(path, rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, start, end) {
			if (rx == 0 || ry == 0) {
				path.lineTo(end.x, end.y);
				return;
			}
			x_axis_rotation = x_axis_rotation * Math.PI / 180;
			rx = Math.abs(rx);
			ry = Math.abs(ry);
			const dx2 = (start.x - end.x) / 2;
			const dy2 = (start.y - end.y) / 2;
			const x1p = Math.cos(x_axis_rotation) * dx2 + Math.sin(x_axis_rotation) * dy2;
			const y1p = -Math.sin(x_axis_rotation) * dx2 + Math.cos(x_axis_rotation) * dy2;
			let rxs = rx * rx;
			let rys = ry * ry;
			const x1ps = x1p * x1p;
			const y1ps = y1p * y1p;
			const cr = x1ps / rxs + y1ps / rys;
			if (cr > 1) {
				const s = Math.sqrt(cr);
				rx = s * rx;
				ry = s * ry;
				rxs = rx * rx;
				rys = ry * ry;
			}
			const dq = rxs * y1ps + rys * x1ps;
			const pq = (rxs * rys - dq) / dq;
			let q = Math.sqrt(Math.max(0, pq));
			if (large_arc_flag === sweep_flag) q = -q;
			const cxp = q * rx * y1p / ry;
			const cyp = -q * ry * x1p / rx;
			const cx = Math.cos(x_axis_rotation) * cxp - Math.sin(x_axis_rotation) * cyp + (start.x + end.x) / 2;
			const cy = Math.sin(x_axis_rotation) * cxp + Math.cos(x_axis_rotation) * cyp + (start.y + end.y) / 2;
			const theta = svgAngle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
			const delta = svgAngle((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry) % (Math.PI * 2);
			path.currentPath.absellipse(cx, cy, rx, ry, theta, theta + delta, sweep_flag === 0, x_axis_rotation);
		}
		function svgAngle(ux, uy, vx, vy) {
			const dot = ux * vx + uy * vy;
			const len = Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy);
			let ang = Math.acos(Math.max(-1, Math.min(1, dot / len)));
			if (ux * vy - uy * vx < 0) ang = -ang;
			return ang;
		}
		function parseRectNode(node) {
			const x = parseFloatWithUnits(node.getAttribute("x") || 0);
			const y = parseFloatWithUnits(node.getAttribute("y") || 0);
			const rx = parseFloatWithUnits(node.getAttribute("rx") || node.getAttribute("ry") || 0);
			const ry = parseFloatWithUnits(node.getAttribute("ry") || node.getAttribute("rx") || 0);
			const w = parseFloatWithUnits(node.getAttribute("width"));
			const h = parseFloatWithUnits(node.getAttribute("height"));
			const bci = .448084975506;
			const path = new ShapePath();
			path.moveTo(x + rx, y);
			path.lineTo(x + w - rx, y);
			if (rx !== 0 || ry !== 0) path.bezierCurveTo(x + w - rx * bci, y, x + w, y + ry * bci, x + w, y + ry);
			path.lineTo(x + w, y + h - ry);
			if (rx !== 0 || ry !== 0) path.bezierCurveTo(x + w, y + h - ry * bci, x + w - rx * bci, y + h, x + w - rx, y + h);
			path.lineTo(x + rx, y + h);
			if (rx !== 0 || ry !== 0) path.bezierCurveTo(x + rx * bci, y + h, x, y + h - ry * bci, x, y + h - ry);
			path.lineTo(x, y + ry);
			if (rx !== 0 || ry !== 0) path.bezierCurveTo(x, y + ry * bci, x + rx * bci, y, x + rx, y);
			return path;
		}
		function parsePolygonNode(node) {
			function iterator(match, a, b) {
				const x = parseFloatWithUnits(a);
				const y = parseFloatWithUnits(b);
				if (index === 0) path.moveTo(x, y);
				else path.lineTo(x, y);
				index++;
			}
			const regex = /([+-]?\d*\.?\d+(?:e[+-]?\d+)?)(?:,|\s)([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/g;
			const path = new ShapePath();
			let index = 0;
			node.getAttribute("points").replace(regex, iterator);
			path.currentPath.autoClose = true;
			return path;
		}
		function parsePolylineNode(node) {
			function iterator(match, a, b) {
				const x = parseFloatWithUnits(a);
				const y = parseFloatWithUnits(b);
				if (index === 0) path.moveTo(x, y);
				else path.lineTo(x, y);
				index++;
			}
			const regex = /([+-]?\d*\.?\d+(?:e[+-]?\d+)?)(?:,|\s)([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/g;
			const path = new ShapePath();
			let index = 0;
			node.getAttribute("points").replace(regex, iterator);
			path.currentPath.autoClose = false;
			return path;
		}
		function parseCircleNode(node) {
			const x = parseFloatWithUnits(node.getAttribute("cx") || 0);
			const y = parseFloatWithUnits(node.getAttribute("cy") || 0);
			const r = parseFloatWithUnits(node.getAttribute("r") || 0);
			const subpath = new Path();
			subpath.absarc(x, y, r, 0, Math.PI * 2);
			const path = new ShapePath();
			path.subPaths.push(subpath);
			return path;
		}
		function parseEllipseNode(node) {
			const x = parseFloatWithUnits(node.getAttribute("cx") || 0);
			const y = parseFloatWithUnits(node.getAttribute("cy") || 0);
			const rx = parseFloatWithUnits(node.getAttribute("rx") || 0);
			const ry = parseFloatWithUnits(node.getAttribute("ry") || 0);
			const subpath = new Path();
			subpath.absellipse(x, y, rx, ry, 0, Math.PI * 2);
			const path = new ShapePath();
			path.subPaths.push(subpath);
			return path;
		}
		function parseLineNode(node) {
			const x1 = parseFloatWithUnits(node.getAttribute("x1") || 0);
			const y1 = parseFloatWithUnits(node.getAttribute("y1") || 0);
			const x2 = parseFloatWithUnits(node.getAttribute("x2") || 0);
			const y2 = parseFloatWithUnits(node.getAttribute("y2") || 0);
			const path = new ShapePath();
			path.moveTo(x1, y1);
			path.lineTo(x2, y2);
			path.currentPath.autoClose = false;
			return path;
		}
		function parseGradients(xml) {
			const HREF_NS = "http://www.w3.org/1999/xlink";
			const gradientNodes = xml.querySelectorAll("linearGradient, radialGradient");
			const ATTRS = [
				"x1",
				"y1",
				"x2",
				"y2",
				"cx",
				"cy",
				"r",
				"fx",
				"fy",
				"gradientUnits",
				"gradientTransform",
				"spreadMethod"
			];
			const parsed = {};
			for (const node of gradientNodes) {
				const id = node.getAttribute("id");
				if (!id) continue;
				const entry = {
					type: node.nodeName === "radialGradient" ? "radialGradient" : "linearGradient",
					attrs: {},
					stops: null,
					href: null
				};
				const href = node.getAttributeNS(HREF_NS, "href") || node.getAttribute("href") || "";
				if (href.startsWith("#")) entry.href = href.substring(1);
				for (const name of ATTRS) if (node.hasAttribute(name)) entry.attrs[name] = node.getAttribute(name);
				const stopNodes = node.querySelectorAll("stop");
				if (stopNodes.length > 0) {
					entry.stops = [];
					for (const s of stopNodes) {
						let color = s.getAttribute("stop-color");
						if (!color && s.style) color = s.style["stop-color"];
						if (!color) color = "#000";
						let opacity = s.getAttribute("stop-opacity");
						if ((opacity === null || opacity === "") && s.style) opacity = s.style["stop-opacity"];
						opacity = opacity === null || opacity === "" || opacity === void 0 ? 1 : Math.max(0, Math.min(1, parseFloat(opacity)));
						const offset = Math.max(0, Math.min(1, parseFloat(s.getAttribute("offset") || "0")));
						entry.stops.push({
							offset,
							color,
							opacity
						});
					}
				}
				parsed[id] = entry;
			}
			function inherit(id, visited) {
				const entry = parsed[id];
				if (!entry || visited.has(id)) return entry;
				visited.add(id);
				if (entry.href && parsed[entry.href]) {
					const parent = inherit(entry.href, visited);
					if (parent) {
						if (!entry.stops) entry.stops = parent.stops;
						for (const key in parent.attrs) if (!(key in entry.attrs)) entry.attrs[key] = parent.attrs[key];
					}
				}
				return entry;
			}
			for (const id in parsed) inherit(id, /* @__PURE__ */ new Set());
			for (const id in parsed) {
				const entry = parsed[id];
				const a = entry.attrs;
				const units = a.gradientUnits === "userSpaceOnUse" ? "userSpaceOnUse" : "objectBoundingBox";
				const gradient = {
					type: entry.type,
					gradientUnits: units,
					spreadMethod: a.spreadMethod === "reflect" || a.spreadMethod === "repeat" ? a.spreadMethod : "pad",
					gradientTransform: null,
					stops: (entry.stops || []).slice().sort((x, y) => x.offset - y.offset)
				};
				if (a.gradientTransform) {
					gradient.gradientTransform = new Matrix3();
					parseTransformString(a.gradientTransform, gradient.gradientTransform);
				}
				function coord(str) {
					if (typeof str !== "string") return 0;
					if (str.endsWith("%")) return parseFloat(str) / 100;
					return parseFloatWithUnits(str);
				}
				if (entry.type === "linearGradient") {
					gradient.x1 = a.x1 !== void 0 ? coord(a.x1) : 0;
					gradient.y1 = a.y1 !== void 0 ? coord(a.y1) : 0;
					gradient.x2 = a.x2 !== void 0 ? coord(a.x2) : units === "objectBoundingBox" ? 1 : 0;
					gradient.y2 = a.y2 !== void 0 ? coord(a.y2) : 0;
				} else {
					const defCenter = units === "objectBoundingBox" ? .5 : 0;
					const defR = units === "objectBoundingBox" ? .5 : 0;
					gradient.cx = a.cx !== void 0 ? coord(a.cx) : defCenter;
					gradient.cy = a.cy !== void 0 ? coord(a.cy) : defCenter;
					gradient.r = a.r !== void 0 ? coord(a.r) : defR;
					gradient.fx = a.fx !== void 0 ? coord(a.fx) : gradient.cx;
					gradient.fy = a.fy !== void 0 ? coord(a.fy) : gradient.cy;
				}
				gradients[id] = gradient;
			}
		}
		function parseStyle(node, style) {
			style = Object.assign({}, style);
			let stylesheetStyles = {};
			if (node.hasAttribute("class")) {
				const classSelectors = node.getAttribute("class").split(/\s/).filter(Boolean).map((i) => i.trim());
				for (let i = 0; i < classSelectors.length; i++) stylesheetStyles = Object.assign(stylesheetStyles, stylesheets["." + classSelectors[i]]);
			}
			if (node.hasAttribute("id")) stylesheetStyles = Object.assign(stylesheetStyles, stylesheets["#" + node.getAttribute("id")]);
			function addStyle(svgName, jsName, adjustFunction) {
				if (adjustFunction === void 0) adjustFunction = function copy(v) {
					return v;
				};
				if (node.hasAttribute(svgName)) style[jsName] = adjustFunction(node.getAttribute(svgName));
				if (stylesheetStyles[jsName]) style[jsName] = adjustFunction(stylesheetStyles[jsName]);
				if (node.style && node.style[svgName] !== "") style[jsName] = adjustFunction(node.style[svgName]);
			}
			function clamp(v) {
				return Math.max(0, Math.min(1, parseFloatWithUnits(v)));
			}
			function positive(v) {
				return Math.max(0, parseFloatWithUnits(v));
			}
			addStyle("fill", "fill");
			addStyle("fill-opacity", "fillOpacity", clamp);
			addStyle("fill-rule", "fillRule");
			addStyle("opacity", "opacity", clamp);
			addStyle("stroke", "stroke");
			addStyle("stroke-opacity", "strokeOpacity", clamp);
			addStyle("stroke-width", "strokeWidth", positive);
			addStyle("stroke-linejoin", "strokeLineJoin");
			addStyle("stroke-linecap", "strokeLineCap");
			addStyle("stroke-miterlimit", "strokeMiterLimit", positive);
			addStyle("visibility", "visibility");
			return style;
		}
		function getReflection(a, b) {
			return a - (b - a);
		}
		function parseFloats(input, flags, stride) {
			if (typeof input !== "string") throw new TypeError("Invalid input: " + typeof input);
			const RE = {
				SEPARATOR: /[ \t\r\n\,.\-+]/,
				WHITESPACE: /[ \t\r\n]/,
				DIGIT: /[\d]/,
				SIGN: /[-+]/,
				POINT: /\./,
				COMMA: /,/,
				EXP: /e/i,
				FLAGS: /[01]/
			};
			const SEP = 0;
			const INT = 1;
			const FLOAT = 2;
			const EXP = 3;
			let state = SEP;
			let seenComma = true;
			let number = "", exponent = "";
			const result = [];
			function throwSyntaxError(current, i, partial) {
				const error = /* @__PURE__ */ new SyntaxError("Unexpected character \"" + current + "\" at index " + i + ".");
				error.partial = partial;
				throw error;
			}
			function newNumber() {
				if (number !== "") {
					if (exponent === "") result.push(Number(number));
					else result.push(Number(number) * Math.pow(10, Number(exponent)));
				}
				number = "";
				exponent = "";
			}
			let current;
			const length = input.length;
			for (let i = 0; i < length; i++) {
				current = input[i];
				if (Array.isArray(flags) && flags.includes(result.length % stride) && RE.FLAGS.test(current)) {
					state = INT;
					number = current;
					newNumber();
					continue;
				}
				if (state === SEP) {
					if (RE.WHITESPACE.test(current)) continue;
					if (RE.DIGIT.test(current) || RE.SIGN.test(current)) {
						state = INT;
						number = current;
						continue;
					}
					if (RE.POINT.test(current)) {
						state = FLOAT;
						number = current;
						continue;
					}
					if (RE.COMMA.test(current)) {
						if (seenComma) throwSyntaxError(current, i, result);
						seenComma = true;
					}
				}
				if (state === INT) {
					if (RE.DIGIT.test(current)) {
						number += current;
						continue;
					}
					if (RE.POINT.test(current)) {
						number += current;
						state = FLOAT;
						continue;
					}
					if (RE.EXP.test(current)) {
						state = EXP;
						continue;
					}
					if (RE.SIGN.test(current) && number.length === 1 && RE.SIGN.test(number[0])) throwSyntaxError(current, i, result);
				}
				if (state === FLOAT) {
					if (RE.DIGIT.test(current)) {
						number += current;
						continue;
					}
					if (RE.EXP.test(current)) {
						state = EXP;
						continue;
					}
					if (RE.POINT.test(current) && number[number.length - 1] === ".") throwSyntaxError(current, i, result);
				}
				if (state === EXP) {
					if (RE.DIGIT.test(current)) {
						exponent += current;
						continue;
					}
					if (RE.SIGN.test(current)) {
						if (exponent === "") {
							exponent += current;
							continue;
						}
						if (exponent.length === 1 && RE.SIGN.test(exponent)) throwSyntaxError(current, i, result);
					}
				}
				if (RE.WHITESPACE.test(current)) {
					newNumber();
					state = SEP;
					seenComma = false;
				} else if (RE.COMMA.test(current)) {
					newNumber();
					state = SEP;
					seenComma = true;
				} else if (RE.SIGN.test(current)) {
					newNumber();
					state = INT;
					number = current;
				} else if (RE.POINT.test(current)) {
					newNumber();
					state = FLOAT;
					number = current;
				} else throwSyntaxError(current, i, result);
			}
			newNumber();
			return result;
		}
		const units = [
			"mm",
			"cm",
			"in",
			"pt",
			"pc",
			"px"
		];
		const unitConversion = {
			"mm": {
				"mm": 1,
				"cm": .1,
				"in": 1 / 25.4,
				"pt": 72 / 25.4,
				"pc": 6 / 25.4,
				"px": -1
			},
			"cm": {
				"mm": 10,
				"cm": 1,
				"in": 1 / 2.54,
				"pt": 72 / 2.54,
				"pc": 6 / 2.54,
				"px": -1
			},
			"in": {
				"mm": 25.4,
				"cm": 2.54,
				"in": 1,
				"pt": 72,
				"pc": 6,
				"px": -1
			},
			"pt": {
				"mm": 25.4 / 72,
				"cm": 2.54 / 72,
				"in": 1 / 72,
				"pt": 1,
				"pc": 6 / 72,
				"px": -1
			},
			"pc": {
				"mm": 25.4 / 6,
				"cm": 2.54 / 6,
				"in": 1 / 6,
				"pt": 12,
				"pc": 1,
				"px": -1
			},
			"px": { "px": 1 }
		};
		function parseFloatWithUnits(string) {
			let theUnit = "px";
			if (typeof string === "string" || string instanceof String) for (let i = 0, n = units.length; i < n; i++) {
				const u = units[i];
				if (string.endsWith(u)) {
					theUnit = u;
					string = string.substring(0, string.length - u.length);
					break;
				}
			}
			let scale = void 0;
			if (theUnit === "px" && scope.defaultUnit !== "px") scale = unitConversion["in"][scope.defaultUnit] / scope.defaultDPI;
			else {
				scale = unitConversion[theUnit][scope.defaultUnit];
				if (scale < 0) scale = unitConversion[theUnit]["in"] * scope.defaultDPI;
			}
			return scale * parseFloat(string);
		}
		function getNodeTransform(node) {
			if (!(node.hasAttribute("transform") || node.nodeName === "use" && (node.hasAttribute("x") || node.hasAttribute("y")))) return null;
			const transform = parseNodeTransform(node);
			if (transformStack.length > 0) transform.premultiply(transformStack[transformStack.length - 1]);
			currentTransform.copy(transform);
			transformStack.push(transform);
			return transform;
		}
		function parseNodeTransform(node) {
			const transform = new Matrix3();
			if (node.nodeName === "use" && (node.hasAttribute("x") || node.hasAttribute("y"))) {
				const tx = parseFloatWithUnits(node.getAttribute("x") || 0);
				const ty = parseFloatWithUnits(node.getAttribute("y") || 0);
				transform.makeTranslation(tx, ty);
			}
			if (node.hasAttribute("transform")) parseTransformString(node.getAttribute("transform"), transform);
			return transform;
		}
		function parseTransformString(text, transform) {
			const currentTransform = tempTransform0;
			const transformsTexts = text.split(")");
			for (let tIndex = transformsTexts.length - 1; tIndex >= 0; tIndex--) {
				const transformText = transformsTexts[tIndex].trim();
				if (transformText === "") continue;
				const openParPos = transformText.indexOf("(");
				const closeParPos = transformText.length;
				if (openParPos > 0 && openParPos < closeParPos) {
					const transformType = transformText.slice(0, openParPos);
					const array = parseFloats(transformText.slice(openParPos + 1));
					currentTransform.identity();
					switch (transformType) {
						case "translate":
							if (array.length >= 1) {
								const tx = array[0];
								let ty = 0;
								if (array.length >= 2) ty = array[1];
								currentTransform.makeTranslation(tx, ty);
							}
							break;
						case "rotate":
							if (array.length >= 1) {
								let angle = 0;
								let cx = 0;
								let cy = 0;
								angle = array[0] * Math.PI / 180;
								if (array.length >= 3) {
									cx = array[1];
									cy = array[2];
								}
								tempTransform1.makeTranslation(-cx, -cy);
								tempTransform2.makeRotation(angle);
								tempTransform3.multiplyMatrices(tempTransform2, tempTransform1);
								tempTransform1.makeTranslation(cx, cy);
								currentTransform.multiplyMatrices(tempTransform1, tempTransform3);
							}
							break;
						case "scale":
							if (array.length >= 1) {
								const scaleX = array[0];
								let scaleY = scaleX;
								if (array.length >= 2) scaleY = array[1];
								currentTransform.makeScale(scaleX, scaleY);
							}
							break;
						case "skewX":
							if (array.length === 1) currentTransform.set(1, Math.tan(array[0] * Math.PI / 180), 0, 0, 1, 0, 0, 0, 1);
							break;
						case "skewY":
							if (array.length === 1) currentTransform.set(1, 0, 0, Math.tan(array[0] * Math.PI / 180), 1, 0, 0, 0, 1);
							break;
						case "matrix": if (array.length === 6) currentTransform.set(array[0], array[2], array[4], array[1], array[3], array[5], 0, 0, 1);
					}
					transform.premultiply(currentTransform);
				}
			}
			return transform;
		}
		function transformPath(path, m) {
			function transfVec2(v2) {
				tempV3.set(v2.x, v2.y, 1).applyMatrix3(m);
				v2.set(tempV3.x, tempV3.y);
			}
			function transfEllipseGeneric(curve) {
				const a = curve.xRadius;
				const b = curve.yRadius;
				const cosTheta = Math.cos(curve.aRotation);
				const sinTheta = Math.sin(curve.aRotation);
				const v1 = new Vector3(a * cosTheta, a * sinTheta, 0);
				const v2 = new Vector3(-b * sinTheta, b * cosTheta, 0);
				const f1 = v1.applyMatrix3(m);
				const f2 = v2.applyMatrix3(m);
				const mF = tempTransform0.set(f1.x, f2.x, 0, f1.y, f2.y, 0, 0, 0, 1);
				const mFInv = tempTransform1.copy(mF).invert();
				const mQe = tempTransform2.copy(mFInv).transpose().multiply(mFInv).elements;
				const ed = eigenDecomposition(mQe[0], mQe[1], mQe[4]);
				const rt1sqrt = Math.sqrt(ed.rt1);
				const rt2sqrt = Math.sqrt(ed.rt2);
				curve.xRadius = 1 / rt1sqrt;
				curve.yRadius = 1 / rt2sqrt;
				curve.aRotation = Math.atan2(ed.sn, ed.cs);
				if (!((curve.aEndAngle - curve.aStartAngle) % (2 * Math.PI) < Number.EPSILON)) {
					const mDsqrt = tempTransform1.set(rt1sqrt, 0, 0, 0, rt2sqrt, 0, 0, 0, 1);
					const mRT = tempTransform2.set(ed.cs, ed.sn, 0, -ed.sn, ed.cs, 0, 0, 0, 1);
					const mDRF = mDsqrt.multiply(mRT).multiply(mF);
					const transformAngle = (phi) => {
						const { x: cosR, y: sinR } = new Vector3(Math.cos(phi), Math.sin(phi), 0).applyMatrix3(mDRF);
						return Math.atan2(sinR, cosR);
					};
					curve.aStartAngle = transformAngle(curve.aStartAngle);
					curve.aEndAngle = transformAngle(curve.aEndAngle);
					if (isTransformFlipped(m)) curve.aClockwise = !curve.aClockwise;
				}
			}
			function transfEllipseNoSkew(curve) {
				const sx = getTransformScaleX(m);
				const sy = getTransformScaleY(m);
				curve.xRadius *= sx;
				curve.yRadius *= sy;
				const theta = sx > Number.EPSILON ? Math.atan2(m.elements[1], m.elements[0]) : Math.atan2(-m.elements[3], m.elements[4]);
				curve.aRotation += theta;
				if (isTransformFlipped(m)) {
					curve.aStartAngle *= -1;
					curve.aEndAngle *= -1;
					curve.aClockwise = !curve.aClockwise;
				}
			}
			const subPaths = path.subPaths;
			for (let i = 0, n = subPaths.length; i < n; i++) {
				const curves = subPaths[i].curves;
				for (let j = 0; j < curves.length; j++) {
					const curve = curves[j];
					if (curve.isLineCurve) {
						transfVec2(curve.v1);
						transfVec2(curve.v2);
					} else if (curve.isCubicBezierCurve) {
						transfVec2(curve.v0);
						transfVec2(curve.v1);
						transfVec2(curve.v2);
						transfVec2(curve.v3);
					} else if (curve.isQuadraticBezierCurve) {
						transfVec2(curve.v0);
						transfVec2(curve.v1);
						transfVec2(curve.v2);
					} else if (curve.isEllipseCurve) {
						tempV2.set(curve.aX, curve.aY);
						transfVec2(tempV2);
						curve.aX = tempV2.x;
						curve.aY = tempV2.y;
						if (isTransformSkewed(m)) transfEllipseGeneric(curve);
						else transfEllipseNoSkew(curve);
					}
				}
			}
		}
		function isTransformFlipped(m) {
			const te = m.elements;
			return te[0] * te[4] - te[1] * te[3] < 0;
		}
		function isTransformSkewed(m) {
			const te = m.elements;
			const basisDot = te[0] * te[3] + te[1] * te[4];
			if (basisDot === 0) return false;
			const sx = getTransformScaleX(m);
			const sy = getTransformScaleY(m);
			return Math.abs(basisDot / (sx * sy)) > Number.EPSILON;
		}
		function getTransformScaleX(m) {
			const te = m.elements;
			return Math.sqrt(te[0] * te[0] + te[1] * te[1]);
		}
		function getTransformScaleY(m) {
			const te = m.elements;
			return Math.sqrt(te[3] * te[3] + te[4] * te[4]);
		}
		function getTransformScale(m) {
			const te = m.elements;
			const det = te[0] * te[4] - te[1] * te[3];
			return Math.sqrt(Math.abs(det));
		}
		function eigenDecomposition(A, B, C) {
			let rt1, rt2, cs, sn, t;
			const sm = A + C;
			const df = A - C;
			const rt = Math.sqrt(df * df + 4 * B * B);
			if (sm > 0) {
				rt1 = .5 * (sm + rt);
				t = 1 / rt1;
				rt2 = A * t * C - B * t * B;
			} else if (sm < 0) rt2 = .5 * (sm - rt);
			else {
				rt1 = .5 * rt;
				rt2 = -.5 * rt;
			}
			if (df > 0) cs = df + rt;
			else cs = df - rt;
			if (Math.abs(cs) > 2 * Math.abs(B)) {
				t = -2 * B / cs;
				sn = 1 / Math.sqrt(1 + t * t);
				cs = t * sn;
			} else if (Math.abs(B) === 0) {
				cs = 1;
				sn = 0;
			} else {
				t = -.5 * cs / B;
				cs = 1 / Math.sqrt(1 + t * t);
				sn = t * cs;
			}
			if (df > 0) {
				t = cs;
				cs = -sn;
				sn = t;
			}
			return {
				rt1,
				rt2,
				cs,
				sn
			};
		}
		const paths = [];
		const stylesheets = {};
		const gradients = {};
		const transformStack = [];
		const tempTransform0 = new Matrix3();
		const tempTransform1 = new Matrix3();
		const tempTransform2 = new Matrix3();
		const tempTransform3 = new Matrix3();
		const tempV2 = new Vector2();
		const tempV3 = new Vector3();
		const currentTransform = new Matrix3();
		const xml = new DOMParser().parseFromString(text, "image/svg+xml");
		parseGradients(xml);
		parseNode(xml.documentElement, {
			fill: "#000",
			fillOpacity: 1,
			strokeOpacity: 1,
			strokeWidth: 1,
			strokeLineJoin: "miter",
			strokeLineCap: "butt",
			strokeMiterLimit: 4
		});
		return {
			paths,
			gradients,
			xml: xml.documentElement
		};
	}
	/**
	* Creates a material for rendering the fill of the given path.
	*
	* @param {ShapePath} shapePath - The shape path.
	* @return {?MeshBasicMaterial} The fill material. `null` if the path has no fill.
	*/
	static createFillMaterial(shapePath) {
		const style = shapePath.userData.style;
		if (style.fill === void 0 || style.fill === "none") return null;
		const color = shapePath.color;
		let texture = null;
		const urlMatch = GRADIENT_URL_RE.exec(style.fill);
		if (urlMatch) texture = buildGradientTexture(shapePath.userData.gradients && shapePath.userData.gradients[urlMatch[1]], shapePath);
		const material = new MeshBasicMaterial({
			opacity: style.fillOpacity * (style.opacity || 1),
			transparent: true,
			side: 2,
			depthWrite: false
		});
		if (texture !== null) material.map = texture;
		else material.color = color;
		return material;
	}
	/**
	* Creates a material for rendering the stroke of the given path.
	*
	* @param {ShapePath} shapePath - The shape path.
	* @return {?MeshBasicMaterial} The stroke material. `null` if the path has no stroke.
	*/
	static createStrokeMaterial(shapePath) {
		const style = shapePath.userData.style;
		if (style.stroke === void 0 || style.stroke === "none") return null;
		if (GRADIENT_URL_RE.test(style.stroke)) console.warn("THREE.SVGLoader: Gradient strokes are not supported.");
		return new MeshBasicMaterial({
			color: new Color().setStyle(style.stroke, COLOR_SPACE_SVG),
			opacity: style.strokeOpacity * (style.opacity || 1),
			transparent: true,
			side: 2,
			depthWrite: false
		});
	}
	/**
	* Creates from the given shape path and array of shapes.
	*
	* @deprecated since 185.
	* @param {ShapePath} shapePath - The shape path.
	* @return {Array<Shape>} An array of shapes.
	*/
	static createShapes(shapePath) {
		console.warn("SVGLoader: createShapes() is deprecated. Use shapePath.toShapes() instead.");
		return shapePath.toShapes();
	}
	/**
	* Returns a stroke style object from the given parameters.
	*
	* @param {number} [width=1] - The stroke width.
	* @param {string} [color='#000'] - The stroke color, as  returned by {@link Color#getStyle}.
	* @param {'round'|'bevel'|'miter'|'miter-limit'} [lineJoin='miter'] - The line join style.
	* @param {'round'|'square'|'butt'} [lineCap='butt'] - The line cap style.
	* @param {number} [miterLimit=4] - Maximum join length, in multiples of the `width` parameter (join is truncated if it exceeds that distance).
	* @return {Object} The style object.
	*/
	static getStrokeStyle(width, color, lineJoin, lineCap, miterLimit) {
		width = width !== void 0 ? width : 1;
		color = color !== void 0 ? color : "#000";
		lineJoin = lineJoin !== void 0 ? lineJoin : "miter";
		lineCap = lineCap !== void 0 ? lineCap : "butt";
		miterLimit = miterLimit !== void 0 ? miterLimit : 4;
		return {
			strokeColor: color,
			strokeWidth: width,
			strokeLineJoin: lineJoin,
			strokeLineCap: lineCap,
			strokeMiterLimit: miterLimit
		};
	}
	/**
	* Creates a stroke from an array of points.
	*
	* @param {Array<Vector2>} points - The points in 2D space. Minimum 2 points. The path can be open or closed (last point equals to first point).
	* @param {Object} style - Object with SVG properties as returned by `SVGLoader.getStrokeStyle()`, or `SVGLoader.parse()` in the `path.userData.style` object.
	* @param {number} [arcDivisions=12] - Arc divisions for round joins and endcaps.
	* @param {number} [minDistance=0.001] - Points closer to this distance will be merged.
	* @return {?BufferGeometry} The stroke geometry. UV coordinates are generated ('u' along path. 'v' across it, from left to right).
	* Returns `null` if not geometry was generated.
	*/
	static pointsToStroke(points, style, arcDivisions, minDistance) {
		const vertices = [];
		const normals = [];
		const uvs = [];
		if (SVGLoader.pointsToStrokeWithBuffers(points, style, arcDivisions, minDistance, vertices, normals, uvs) === 0) return null;
		const geometry = new BufferGeometry();
		geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
		geometry.setAttribute("normal", new Float32BufferAttribute(normals, 3));
		geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
		return geometry;
	}
	/**
	* Creates a stroke from an array of points.
	*
	* @param {Array<Vector2>} points - The points in 2D space. Minimum 2 points.
	* @param {Object} style - Object with SVG properties as returned by `SVGLoader.getStrokeStyle()`, or `SVGLoader.parse()` in the `path.userData.style` object.
	* @param {number} [arcDivisions=12] - Arc divisions for round joins and endcaps.
	* @param {number} [minDistance=0.001] - Points closer to this distance will be merged.
	* @param {Array<number>} vertices - An array holding vertices.
	* @param {Array<number>} normals - An array holding normals.
	* @param {Array<number>} uvs - An array holding uvs.
	* @param {number} [vertexOffset=0] - The vertex offset.
	* @return {number} The number of vertices.
	*/
	static pointsToStrokeWithBuffers(points, style, arcDivisions, minDistance, vertices, normals, uvs, vertexOffset) {
		const tempV2_1 = new Vector2();
		const tempV2_2 = new Vector2();
		const tempV2_3 = new Vector2();
		const tempV2_4 = new Vector2();
		const tempV2_5 = new Vector2();
		const tempV2_6 = new Vector2();
		const tempV2_7 = new Vector2();
		const lastPointL = new Vector2();
		const lastPointR = new Vector2();
		const point0L = new Vector2();
		const point0R = new Vector2();
		const currentPointL = new Vector2();
		const currentPointR = new Vector2();
		const nextPointL = new Vector2();
		const nextPointR = new Vector2();
		const innerPoint = new Vector2();
		const outerPoint = new Vector2();
		arcDivisions = arcDivisions !== void 0 ? arcDivisions : 12;
		minDistance = minDistance !== void 0 ? minDistance : .001;
		vertexOffset = vertexOffset !== void 0 ? vertexOffset : 0;
		points = removeDuplicatedPoints(points);
		const numPoints = points.length;
		if (numPoints < 2) return 0;
		const isClosed = points[0].equals(points[numPoints - 1]);
		let currentPoint;
		let previousPoint = points[0];
		let nextPoint;
		const strokeWidth2 = style.strokeWidth / 2;
		const deltaU = 1 / (numPoints - 1);
		let u0 = 0, u1;
		let innerSideModified;
		let joinIsOnLeftSide;
		let isMiter;
		let initialJoinIsOnLeftSide = false;
		let numVertices = 0;
		let currentCoordinate = vertexOffset * 3;
		let currentCoordinateUV = vertexOffset * 2;
		getNormal(points[0], points[1], tempV2_1).multiplyScalar(strokeWidth2);
		lastPointL.copy(points[0]).sub(tempV2_1);
		lastPointR.copy(points[0]).add(tempV2_1);
		point0L.copy(lastPointL);
		point0R.copy(lastPointR);
		for (let iPoint = 1; iPoint < numPoints; iPoint++) {
			currentPoint = points[iPoint];
			if (iPoint === numPoints - 1) {
				if (isClosed) nextPoint = points[1];
				else nextPoint = void 0;
			} else nextPoint = points[iPoint + 1];
			const normal1 = tempV2_1;
			getNormal(previousPoint, currentPoint, normal1);
			tempV2_3.copy(normal1).multiplyScalar(strokeWidth2);
			currentPointL.copy(currentPoint).sub(tempV2_3);
			currentPointR.copy(currentPoint).add(tempV2_3);
			u1 = u0 + deltaU;
			innerSideModified = false;
			if (nextPoint !== void 0) {
				getNormal(currentPoint, nextPoint, tempV2_2);
				tempV2_3.copy(tempV2_2).multiplyScalar(strokeWidth2);
				nextPointL.copy(currentPoint).sub(tempV2_3);
				nextPointR.copy(currentPoint).add(tempV2_3);
				joinIsOnLeftSide = true;
				tempV2_3.subVectors(nextPoint, previousPoint);
				if (normal1.dot(tempV2_3) < 0) joinIsOnLeftSide = false;
				if (iPoint === 1) initialJoinIsOnLeftSide = joinIsOnLeftSide;
				tempV2_3.subVectors(nextPoint, currentPoint);
				tempV2_3.normalize();
				const dot = Math.abs(normal1.dot(tempV2_3));
				if (dot > Number.EPSILON) {
					const miterSide = strokeWidth2 / dot;
					tempV2_3.multiplyScalar(-miterSide);
					tempV2_4.subVectors(currentPoint, previousPoint);
					tempV2_5.copy(tempV2_4).setLength(miterSide).add(tempV2_3);
					innerPoint.copy(tempV2_5).negate();
					const miterLength2 = tempV2_5.length();
					const segmentLengthPrev = tempV2_4.length();
					tempV2_4.divideScalar(segmentLengthPrev);
					tempV2_6.subVectors(nextPoint, currentPoint);
					const segmentLengthNext = tempV2_6.length();
					tempV2_6.divideScalar(segmentLengthNext);
					if (tempV2_4.dot(innerPoint) < segmentLengthPrev && tempV2_6.dot(innerPoint) < segmentLengthNext) innerSideModified = true;
					outerPoint.copy(tempV2_5).add(currentPoint);
					innerPoint.add(currentPoint);
					if (innerSideModified) {
						const refPt = joinIsOnLeftSide ? lastPointR : lastPointL;
						const foldCross = (outerPoint.x - refPt.x) * (innerPoint.y - refPt.y) - (outerPoint.y - refPt.y) * (innerPoint.x - refPt.x);
						if (joinIsOnLeftSide && foldCross < 0 || !joinIsOnLeftSide && foldCross > 0) innerPoint.copy(refPt);
					}
					isMiter = false;
					if (innerSideModified) {
						if (joinIsOnLeftSide) {
							nextPointR.copy(innerPoint);
							currentPointR.copy(innerPoint);
						} else {
							nextPointL.copy(innerPoint);
							currentPointL.copy(innerPoint);
						}
					} else makeSegmentTriangles();
					switch (style.strokeLineJoin) {
						case "bevel":
							makeSegmentWithBevelJoin(joinIsOnLeftSide, innerSideModified, u1);
							break;
						case "round":
							createSegmentTrianglesWithMiddleSection(joinIsOnLeftSide, innerSideModified);
							if (joinIsOnLeftSide) makeCircularSector(currentPoint, currentPointL, nextPointL, u1, 0);
							else makeCircularSector(currentPoint, nextPointR, currentPointR, u1, 1);
							break;
						default:
							const miterFraction = strokeWidth2 * style.strokeMiterLimit / miterLength2;
							if (miterFraction < 1) {
								if (style.strokeLineJoin !== "miter-clip") {
									makeSegmentWithBevelJoin(joinIsOnLeftSide, innerSideModified, u1);
									break;
								} else {
									createSegmentTrianglesWithMiddleSection(joinIsOnLeftSide, innerSideModified);
									if (joinIsOnLeftSide) {
										tempV2_6.subVectors(outerPoint, currentPointL).multiplyScalar(miterFraction).add(currentPointL);
										tempV2_7.subVectors(outerPoint, nextPointL).multiplyScalar(miterFraction).add(nextPointL);
										addVertex(currentPointL, u1, 0);
										addVertex(tempV2_6, u1, 0);
										addVertex(currentPoint, u1, .5);
										addVertex(currentPoint, u1, .5);
										addVertex(tempV2_6, u1, 0);
										addVertex(tempV2_7, u1, 0);
										addVertex(currentPoint, u1, .5);
										addVertex(tempV2_7, u1, 0);
										addVertex(nextPointL, u1, 0);
									} else {
										tempV2_6.subVectors(outerPoint, currentPointR).multiplyScalar(miterFraction).add(currentPointR);
										tempV2_7.subVectors(outerPoint, nextPointR).multiplyScalar(miterFraction).add(nextPointR);
										addVertex(currentPointR, u1, 1);
										addVertex(tempV2_6, u1, 1);
										addVertex(currentPoint, u1, .5);
										addVertex(currentPoint, u1, .5);
										addVertex(tempV2_6, u1, 1);
										addVertex(tempV2_7, u1, 1);
										addVertex(currentPoint, u1, .5);
										addVertex(tempV2_7, u1, 1);
										addVertex(nextPointR, u1, 1);
									}
								}
							} else {
								if (innerSideModified) {
									if (joinIsOnLeftSide) {
										addVertex(lastPointR, u0, 1);
										addVertex(lastPointL, u0, 0);
										addVertex(outerPoint, u1, 0);
										addVertex(lastPointR, u0, 1);
										addVertex(outerPoint, u1, 0);
										addVertex(innerPoint, u1, 1);
									} else {
										addVertex(lastPointR, u0, 1);
										addVertex(lastPointL, u0, 0);
										addVertex(outerPoint, u1, 1);
										addVertex(lastPointL, u0, 0);
										addVertex(innerPoint, u1, 0);
										addVertex(outerPoint, u1, 1);
									}
									if (joinIsOnLeftSide) nextPointL.copy(outerPoint);
									else nextPointR.copy(outerPoint);
								} else if (joinIsOnLeftSide) {
									addVertex(currentPointL, u1, 0);
									addVertex(outerPoint, u1, 0);
									addVertex(currentPoint, u1, .5);
									addVertex(currentPoint, u1, .5);
									addVertex(outerPoint, u1, 0);
									addVertex(nextPointL, u1, 0);
								} else {
									addVertex(currentPointR, u1, 1);
									addVertex(outerPoint, u1, 1);
									addVertex(currentPoint, u1, .5);
									addVertex(currentPoint, u1, .5);
									addVertex(outerPoint, u1, 1);
									addVertex(nextPointR, u1, 1);
								}
								isMiter = true;
							}
					}
				} else makeSegmentTriangles();
			} else makeSegmentTriangles();
			if (!isClosed && iPoint === numPoints - 1) addCapGeometry(points[0], point0L, point0R, joinIsOnLeftSide, true, u0);
			u0 = u1;
			previousPoint = currentPoint;
			lastPointL.copy(nextPointL);
			lastPointR.copy(nextPointR);
		}
		if (!isClosed) addCapGeometry(currentPoint, currentPointL, currentPointR, joinIsOnLeftSide, false, u1);
		else if (innerSideModified && vertices) {
			let lastOuter = outerPoint;
			let lastInner = innerPoint;
			if (initialJoinIsOnLeftSide !== joinIsOnLeftSide) {
				lastOuter = innerPoint;
				lastInner = outerPoint;
			}
			if (joinIsOnLeftSide) {
				if (isMiter || initialJoinIsOnLeftSide) {
					lastInner.toArray(vertices, 0);
					lastInner.toArray(vertices, 9);
					if (isMiter) lastOuter.toArray(vertices, 3);
				}
			} else if (isMiter || !initialJoinIsOnLeftSide) {
				lastInner.toArray(vertices, 3);
				lastInner.toArray(vertices, 9);
				if (isMiter) lastOuter.toArray(vertices, 0);
			}
		}
		if (vertices) {
			const tri = [
				new Vector2(),
				new Vector2(),
				new Vector2()
			];
			const startFloat = vertexOffset * 3;
			for (let t = startFloat; t < currentCoordinate; t += 9) {
				tri[0].set(vertices[t], vertices[t + 1]);
				tri[1].set(vertices[t + 3], vertices[t + 4]);
				tri[2].set(vertices[t + 6], vertices[t + 7]);
				if (ShapeUtils.area(tri) < 0) {
					vertices[t + 3] = tri[0].x;
					vertices[t + 4] = tri[0].y;
				}
			}
		}
		return numVertices;
		function getNormal(p1, p2, result) {
			result.subVectors(p2, p1);
			return result.set(-result.y, result.x).normalize();
		}
		function addVertex(position, u, v) {
			if (vertices) {
				vertices[currentCoordinate] = position.x;
				vertices[currentCoordinate + 1] = position.y;
				vertices[currentCoordinate + 2] = 0;
				if (normals) {
					normals[currentCoordinate] = 0;
					normals[currentCoordinate + 1] = 0;
					normals[currentCoordinate + 2] = 1;
				}
				currentCoordinate += 3;
				if (uvs) {
					uvs[currentCoordinateUV] = u;
					uvs[currentCoordinateUV + 1] = v;
					currentCoordinateUV += 2;
				}
			}
			numVertices += 3;
		}
		function makeCircularSector(center, p1, p2, u, v) {
			tempV2_1.copy(p1).sub(center).normalize();
			tempV2_2.copy(p2).sub(center).normalize();
			let angle = Math.PI;
			const dot = tempV2_1.dot(tempV2_2);
			if (Math.abs(dot) < 1) angle = Math.abs(Math.acos(dot));
			angle /= arcDivisions;
			tempV2_3.copy(p1);
			for (let i = 0, il = arcDivisions - 1; i < il; i++) {
				tempV2_4.copy(tempV2_3).rotateAround(center, angle);
				addVertex(tempV2_3, u, v);
				addVertex(tempV2_4, u, v);
				addVertex(center, u, .5);
				tempV2_3.copy(tempV2_4);
			}
			addVertex(tempV2_3, u, v);
			addVertex(p2, u, v);
			addVertex(center, u, .5);
		}
		function makeSegmentTriangles() {
			addVertex(lastPointR, u0, 1);
			addVertex(lastPointL, u0, 0);
			addVertex(currentPointL, u1, 0);
			addVertex(lastPointR, u0, 1);
			addVertex(currentPointL, u1, 0);
			addVertex(currentPointR, u1, 1);
		}
		function makeSegmentWithBevelJoin(joinIsOnLeftSide, innerSideModified, u) {
			if (innerSideModified) {
				if (joinIsOnLeftSide) {
					addVertex(lastPointR, u0, 1);
					addVertex(lastPointL, u0, 0);
					addVertex(currentPointL, u1, 0);
					addVertex(lastPointR, u0, 1);
					addVertex(currentPointL, u1, 0);
					addVertex(innerPoint, u1, 1);
					addVertex(currentPointL, u, 0);
					addVertex(nextPointL, u, 0);
					addVertex(innerPoint, u, .5);
				} else {
					addVertex(lastPointR, u0, 1);
					addVertex(lastPointL, u0, 0);
					addVertex(currentPointR, u1, 1);
					addVertex(lastPointL, u0, 0);
					addVertex(innerPoint, u1, 0);
					addVertex(currentPointR, u1, 1);
					addVertex(currentPointR, u, 1);
					addVertex(innerPoint, u, 0);
					addVertex(nextPointR, u, 1);
				}
			} else if (joinIsOnLeftSide) {
				addVertex(currentPointL, u, 0);
				addVertex(nextPointL, u, 0);
				addVertex(currentPoint, u, .5);
			} else {
				addVertex(currentPointR, u, 1);
				addVertex(nextPointR, u, 0);
				addVertex(currentPoint, u, .5);
			}
		}
		function createSegmentTrianglesWithMiddleSection(joinIsOnLeftSide, innerSideModified) {
			if (innerSideModified) {
				if (joinIsOnLeftSide) {
					addVertex(lastPointR, u0, 1);
					addVertex(lastPointL, u0, 0);
					addVertex(currentPointL, u1, 0);
					addVertex(lastPointR, u0, 1);
					addVertex(currentPointL, u1, 0);
					addVertex(innerPoint, u1, 1);
					addVertex(currentPointL, u0, 0);
					addVertex(currentPoint, u1, .5);
					addVertex(innerPoint, u1, 1);
					addVertex(currentPoint, u1, .5);
					addVertex(nextPointL, u0, 0);
					addVertex(innerPoint, u1, 1);
				} else {
					addVertex(lastPointR, u0, 1);
					addVertex(lastPointL, u0, 0);
					addVertex(currentPointR, u1, 1);
					addVertex(lastPointL, u0, 0);
					addVertex(innerPoint, u1, 0);
					addVertex(currentPointR, u1, 1);
					addVertex(currentPointR, u0, 1);
					addVertex(innerPoint, u1, 0);
					addVertex(currentPoint, u1, .5);
					addVertex(currentPoint, u1, .5);
					addVertex(innerPoint, u1, 0);
					addVertex(nextPointR, u0, 1);
				}
			}
		}
		function addCapGeometry(center, p1, p2, joinIsOnLeftSide, start, u) {
			switch (style.strokeLineCap) {
				case "round":
					if (start) makeCircularSector(center, p2, p1, u, .5);
					else makeCircularSector(center, p1, p2, u, .5);
					break;
				case "square": if (start) {
					tempV2_1.subVectors(p1, center);
					tempV2_2.set(tempV2_1.y, -tempV2_1.x);
					tempV2_3.addVectors(tempV2_1, tempV2_2).add(center);
					tempV2_4.subVectors(tempV2_2, tempV2_1).add(center);
					if (joinIsOnLeftSide) {
						tempV2_3.toArray(vertices, 3);
						tempV2_4.toArray(vertices, 0);
						tempV2_4.toArray(vertices, 9);
					} else {
						tempV2_3.toArray(vertices, 3);
						uvs[7] === 1 ? tempV2_4.toArray(vertices, 9) : tempV2_3.toArray(vertices, 9);
						tempV2_4.toArray(vertices, 0);
					}
				} else {
					tempV2_1.subVectors(p2, center);
					tempV2_2.set(tempV2_1.y, -tempV2_1.x);
					tempV2_3.addVectors(tempV2_1, tempV2_2).add(center);
					tempV2_4.subVectors(tempV2_2, tempV2_1).add(center);
					const vl = vertices.length;
					if (joinIsOnLeftSide) {
						tempV2_3.toArray(vertices, vl - 3);
						tempV2_4.toArray(vertices, vl - 6);
						tempV2_4.toArray(vertices, vl - 12);
					} else {
						tempV2_4.toArray(vertices, vl - 6);
						tempV2_3.toArray(vertices, vl - 3);
						tempV2_4.toArray(vertices, vl - 12);
					}
				}
			}
		}
		function removeDuplicatedPoints(points) {
			let dupPoints = false;
			for (let i = 1, n = points.length - 1; i < n; i++) if (points[i].distanceTo(points[i + 1]) < minDistance) {
				dupPoints = true;
				break;
			}
			if (!dupPoints) return points;
			const newPoints = [];
			newPoints.push(points[0]);
			for (let i = 1, n = points.length - 1; i < n; i++) if (points[i].distanceTo(points[i + 1]) >= minDistance) newPoints.push(points[i]);
			newPoints.push(points[points.length - 1]);
			return newPoints;
		}
	}
};
var GRADIENT_URL_RE = /^\s*url\(\s*(?:["']\s*)?#([^)'"\s]+)(?:\s*["'])?\s*\)\s*$/;
function buildGradientTexture(gradient, shapePath, resolution = 256) {
	if (!gradient || !Array.isArray(gradient.stops) || gradient.stops.length === 0) return null;
	const worldTransform = shapePath.userData.transform;
	const isBBoxUnits = gradient.gradientUnits === "objectBoundingBox";
	let localBBox = null;
	if (isBBoxUnits) {
		localBBox = computeLocalBBox(shapePath, worldTransform);
		if (localBBox === null) return null;
	}
	function resolvePoint(x, y, out) {
		out.set(x, y, 1);
		if (gradient.gradientTransform) out.applyMatrix3(gradient.gradientTransform);
		if (isBBoxUnits) out.set(localBBox.minX + out.x * localBBox.width, localBBox.minY + out.y * localBBox.height, 1);
		if (worldTransform) out.applyMatrix3(worldTransform);
	}
	const canvas = document.createElement("canvas");
	let textureMatrix;
	if (gradient.type === "linearGradient") {
		canvas.width = resolution;
		canvas.height = 1;
		const ctx = canvas.getContext("2d");
		const grad = ctx.createLinearGradient(0, 0, resolution, 0);
		addStops(grad, gradient.stops);
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, resolution, 1);
		const p1 = new Vector3();
		const p2 = new Vector3();
		resolvePoint(gradient.x1, gradient.y1, p1);
		resolvePoint(gradient.x2, gradient.y2, p2);
		const dx = p2.x - p1.x;
		const dy = p2.y - p1.y;
		const len2 = dx * dx + dy * dy || 1e-20;
		const a = dx / len2;
		const b = dy / len2;
		const c = -(a * p1.x + b * p1.y);
		textureMatrix = new Matrix3().set(a, b, c, 0, 0, .5, 0, 0, 1);
	} else {
		let cx = gradient.cx, cy = gradient.cy;
		let fx = gradient.fx, fy = gradient.fy;
		let r = gradient.r;
		if (gradient.gradientTransform) {
			const tmp = new Vector3();
			tmp.set(cx, cy, 1).applyMatrix3(gradient.gradientTransform);
			cx = tmp.x;
			cy = tmp.y;
			tmp.set(fx, fy, 1).applyMatrix3(gradient.gradientTransform);
			fx = tmp.x;
			fy = tmp.y;
		}
		if (isBBoxUnits) {
			cx = localBBox.minX + cx * localBBox.width;
			cy = localBBox.minY + cy * localBBox.height;
			fx = localBBox.minX + fx * localBBox.width;
			fy = localBBox.minY + fy * localBBox.height;
			r = r * Math.sqrt((localBBox.width * localBBox.width + localBBox.height * localBBox.height) / 2);
		}
		if (r <= 0) return null;
		canvas.width = resolution;
		canvas.height = resolution;
		const ctx = canvas.getContext("2d");
		const localMinX = cx - r;
		const localMinY = cy - r;
		const localSpan = 2 * r;
		const scale = resolution / localSpan;
		ctx.setTransform(scale, 0, 0, scale, -localMinX * scale, -localMinY * scale);
		const grad = ctx.createRadialGradient(fx, fy, 0, cx, cy, r);
		addStops(grad, gradient.stops);
		ctx.fillStyle = grad;
		ctx.fillRect(localMinX, localMinY, localSpan, localSpan);
		const inv = worldTransform ? worldTransform.clone().invert() : new Matrix3();
		textureMatrix = new Matrix3().set(1 / localSpan, 0, -localMinX / localSpan, 0, 1 / localSpan, -localMinY / localSpan, 0, 0, 1).multiply(inv);
	}
	const texture = new CanvasTexture(canvas);
	texture.colorSpace = COLOR_SPACE_SVG;
	texture.flipY = false;
	texture.matrixAutoUpdate = false;
	texture.matrix = textureMatrix;
	const wrap = gradient.spreadMethod === "reflect" ? MirroredRepeatWrapping : gradient.spreadMethod === "repeat" ? RepeatWrapping : ClampToEdgeWrapping;
	texture.wrapS = wrap;
	texture.wrapT = wrap;
	return texture;
}
function computeLocalBBox(shapePath, worldTransform) {
	const inv = worldTransform ? worldTransform.clone().invert() : null;
	const tmp = new Vector2();
	const box = new Box2();
	for (const subPath of shapePath.subPaths) for (const p of subPath.getPoints()) {
		tmp.copy(p);
		if (inv) tmp.applyMatrix3(inv);
		box.expandByPoint(tmp);
	}
	if (box.isEmpty()) return null;
	return {
		minX: box.min.x,
		minY: box.min.y,
		width: box.max.x - box.min.x,
		height: box.max.y - box.min.y
	};
}
function addStops(canvasGradient, stops) {
	const tmpColor = new Color();
	for (const stop of stops) {
		let css = stop.color;
		if (stop.opacity < 1) {
			tmpColor.setStyle(stop.color, COLOR_SPACE_SVG);
			const m = /rgb\(([^)]+)\)/.exec(tmpColor.getStyle(COLOR_SPACE_SVG));
			if (m) css = `rgba(${m[1]},${stop.opacity})`;
		}
		canvasGradient.addColorStop(Math.max(0, Math.min(1, stop.offset)), css);
	}
}
// node_modules/@pmndrs/uikit/dist/components/custom.js
var Custom = class Custom extends Component {
	inputConfig;
	constructor(inputProperties, initialClasses, inputConfig) {
		super(inputProperties, initialClasses, {
			hasNonUikitChildren: false,
			...inputConfig
		});
		this.inputConfig = inputConfig;
		setupOrderInfo(this.orderInfo, this.properties, "zIndex", ElementType.Custom, void 0, O(() => this.parentContainer.value == null ? null : this.parentContainer.value.orderInfo.value), this.abortSignal);
		this.frustumCulled = false;
		setupRenderOrder(this, this.root, this.orderInfo);
		const clippingPlanes = createGlobalClippingPlanes(this);
		this.customDepthMaterial = new MeshDepthMaterial();
		this.customDistanceMaterial = new MeshDistanceMaterial();
		this.material.clippingPlanes = clippingPlanes;
		this.customDepthMaterial.clippingPlanes = clippingPlanes;
		this.customDistanceMaterial.clippingPlanes = clippingPlanes;
		abortableEffect(() => {
			this.material.depthTest = this.properties.value.depthTest;
			this.root.peek().requestRender?.();
		}, this.abortSignal);
		abortableEffect(() => {
			this.material.depthWrite = this.properties.value.depthWrite ?? false;
			this.root.peek().requestRender?.();
		}, this.abortSignal);
		abortableEffect(() => {
			this.renderOrder = parseNumberValue(this.properties.value.renderOrder ?? 0);
			this.root.peek().requestRender?.();
		}, this.abortSignal);
		abortableEffect(() => {
			this.castShadow = this.properties.value.castShadow;
			this.root.peek().requestRender?.();
		}, this.abortSignal);
		abortableEffect(() => {
			this.receiveShadow = this.properties.value.receiveShadow;
			this.root.peek().requestRender?.();
		}, this.abortSignal);
		setupMatrixWorldUpdate(this, this.root, this.globalPanelMatrix, this.abortSignal);
		abortableEffect(() => {
			this.visible = this.isVisible.value;
			this.root.peek().requestRender?.();
		}, this.abortSignal);
	}
	clone(recursive) {
		const cloned = new Custom(this.inputProperties, this.initialClasses, this.inputConfig);
		this.copyInto(cloned, recursive);
		return cloned;
	}
};
// node_modules/xrblocks/build/internal/UIKitBackend.js
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
/**
* Parses a THREE.ColorRepresentation into a THREE.Color and an opacity value.
* Supports:
* - Hex strings (#RRGGBB, #RRGGBBAA, #RGB, #RGBA).
* - rgb() and rgba() CSS strings.
* - CSS Color Names ('white', 'red', 'aliceblue') natively via THREE.Color.
* @param value - The color representation to parse.
* @returns An object containing the parsed THREE.Color and opacity float (0 to 1).
*/
function parseColorWithAlpha(value) {
	const result = {
		color: new Color(16777215),
		opacity: 1
	};
	if (value === void 0) return result;
	if (typeof value === "string") {
		if (value.trim().toLowerCase() === "transparent") {
			result.color.set(0);
			result.opacity = 0;
			return result;
		}
		const rgbaMatch = value.match(/rgba?\s*\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*(?:,\s*([\d.]+))?\s*\)/);
		if (rgbaMatch) {
			result.color.setRGB(parseFloat(rgbaMatch[1]) / 255, parseFloat(rgbaMatch[2]) / 255, parseFloat(rgbaMatch[3]) / 255, SRGBColorSpace);
			if (rgbaMatch[4] !== void 0) result.opacity = parseFloat(rgbaMatch[4]);
			return result;
		}
		if (value.startsWith("#") && (value.length === 9 || value.length === 5)) {
			const hex = value.slice(1);
			const isShort = hex.length === 4;
			const maxVal = isShort ? 15 : 255;
			const colorHex = "#" + hex.slice(0, hex.length - (isShort ? 1 : 2));
			const alphaHex = hex.slice(hex.length - (isShort ? 1 : 2));
			result.color.set(colorHex);
			result.opacity = parseInt(alphaHex, 16) / maxVal;
			return result;
		}
	}
	result.color.set(value);
	return result;
}
var ALPHA_HEX_REGEX = /^#(?:[\da-f]{4}|[\da-f]{8})$/iu;
/**
* Normalizes CSS hex colors that carry an alpha nibble/byte (`#RGBA`, `#RRGGBBAA`)
* into linear RGBA tuples for UIKit. UIKit's `writeColor` treats CSS `rgba()`
* channels as already-linear, so passing sRGB channel values makes translucent
* colors appear too light. Values that are not alpha-hex strings pass through
* unchanged. Keep alpha-hex strings intact for `GradientPanel`, which parses
* CSS colors itself and performs the sRGB-to-linear conversion.
*
* @param value - The color value to normalize.
* @returns A linear RGBA tuple for alpha-hex strings, or the original value.
*/
function normalizeAlphaHexColor(value) {
	if (typeof value !== "string") return value;
	const trimmed = value.trim();
	if (!ALPHA_HEX_REGEX.test(trimmed)) return value;
	const { color, opacity } = parseColorWithAlpha(trimmed);
	return [
		color.r,
		color.g,
		color.b,
		opacity
	];
}
/**
* A Container that renders one or more PanelLayers as its background.
* It automatically syncs Container properties (size) to the panel layers.
*/
var ShaderPanel = class extends Container {
	constructor(properties) {
		const { ...containerProps } = properties;
		const containerConfig = { hasNonUikitChildren: true };
		const defaultProps = {
			positionType: properties.positionType ?? "relative",
			backgroundColor: void 0,
			pointerEvents: "auto",
			...containerProps
		};
		super(defaultProps, void 0, containerConfig);
		this.panelLayers = [];
	}
	add(...objects) {
		for (const object of objects) if (!(object instanceof Component) && !(object instanceof TransformScript)) throw new Error("XR Blocks UI panels only accept UIKit components or TransformScript children.");
		return super.add(...objects);
	}
	/**
	* Adds a PanelLayer to the background and configures it.
	* @param layer - The layer to add.
	*/
	addLayer(layer) {
		this.panelLayers.push(layer);
		this.add(layer);
		layer.setProperties({
			positionType: "absolute",
			positionTop: 0,
			positionLeft: 0,
			positionRight: 0,
			positionBottom: 0,
			zIndexOffset: -1
		});
	}
	/**
	* Removes a PanelLayer from the background.
	* @param layer - The layer to remove.
	*/
	removeLayer(layer) {
		const index = this.panelLayers.indexOf(layer);
		if (index !== -1) {
			this.panelLayers.splice(index, 1);
			this.remove(layer);
		}
	}
};
/**
* Numeric IDs mapped to `GradientType` for shader uniforms lookup.
*/
var GradientTypeIds = {
	Linear: 0,
	Radial: 1,
	Angular: 2,
	Diamond: 3
};
/**
* Numeric IDs indicating solid vs gradient configurations inside uniform structures.
*/
var PaintTypeIds = {
	Solid: 0,
	Gradient: 1
};
/**
* Helper to get a uniform by name or prefix+name.
* @param uniforms - The uniforms object.
* @param arg1 - Name of uniform, or prefix if arg2 is provided.
* @param arg2 - Optional name of uniform if arg1 is prefix.
*/
function getU(uniforms, arg1, arg2) {
	return uniforms[arg2 ? `${arg1}${arg2}` : arg1];
}
/**
* Type guard to check if a Paint is a GradientPaint.
*/
function _isGradient(paint) {
	return typeof paint === "object" && paint !== null && "stops" in paint;
}
/** Returns whether a paint can produce a fragment with non-zero alpha. */
function isPaintVisible(paint) {
	if (paint === void 0) return false;
	if (_isGradient(paint)) return paint.stops.some(({ color }) => parseColorWithAlpha(color).opacity > 0);
	return parseColorWithAlpha(paint).opacity > 0;
}
/**
* Sets a solid color into ShaderUniforms.
*/
function _setSolid(uniforms, prefix, color, opacity) {
	const paintTypeU = getU(uniforms, prefix, "paintType");
	if (paintTypeU) paintTypeU.value = PaintTypeIds.Solid;
	const solidColorU = getU(uniforms, prefix, "solidColor");
	if (solidColorU) {
		const { color: c } = parseColorWithAlpha(color);
		const cObj = new Color(c);
		solidColorU.value.set(cObj.r, cObj.g, cObj.b, opacity);
	}
}
/**
* Creates a set of uniforms for a Paint structure.
* @param prefix - The prefix for uniform names (e.g., 'u_fill_', 'u_stroke_').
* @returns An object containing initialized ShaderUniforms sets.
*/
function createPaintUniforms(prefix) {
	return {
		[`${prefix}paintType`]: { value: 0 },
		[`${prefix}solidColor`]: { value: new Vector4(0, 0, 0, 1) },
		[`${prefix}gradientType`]: { value: 0 },
		[`${prefix}center`]: { value: new Vector2(.5, .5) },
		[`${prefix}scale`]: { value: new Vector2(1, 1) },
		[`${prefix}rotation`]: { value: 0 },
		[`${prefix}gradientStops`]: { value: new Array(4).fill(0) },
		[`${prefix}gradientColors`]: { value: new Array(4).fill(null).map(() => new Vector4(0, 0, 0, 1)) },
		[`${prefix}numStops`]: { value: 0 }
	};
}
/**
* Updates ShaderUniforms based on a Paint definition.
* @param uniforms - The uniforms object to update.
* @param input - The Paint definition (color or gradient) to apply.
* @param prefix - The uniform name prefix.
*/
function updatePaintUniforms(uniforms, input, prefix) {
	if (input === void 0) {
		let defColor = 0;
		let defOpacity = 0;
		if (prefix === "u_fill_") {
			defColor = DEFAULT_GRADIENT_PANEL_PROPS.fillColor;
			defOpacity = 1;
		} else if (prefix === "u_stroke_") {
			defColor = DEFAULT_GRADIENT_PANEL_PROPS.strokeColor;
			defOpacity = 1;
		}
		_setSolid(uniforms, prefix, defColor, defOpacity);
		return;
	}
	if (!_isGradient(input)) {
		const { color, opacity } = parseColorWithAlpha(input);
		_setSolid(uniforms, prefix, color, opacity);
		return;
	}
	const gradient = input;
	const stops = gradient.stops || [];
	const paintTypeU = getU(uniforms, prefix, "paintType");
	if (paintTypeU) paintTypeU.value = PaintTypeIds.Gradient;
	const gradientTypeU = getU(uniforms, prefix, "gradientType");
	if (gradientTypeU) gradientTypeU.value = GradientTypeIds[gradient.gradientType.charAt(0).toUpperCase() + gradient.gradientType.slice(1)] ?? 0;
	const rotationU = getU(uniforms, prefix, "rotation");
	if (rotationU) rotationU.value = MathUtils.degToRad(gradient.rotation ?? 0);
	const centerU = getU(uniforms, prefix, "center");
	if (centerU) {
		const c = gradient.center ?? [.5, .5];
		if (Array.isArray(c)) centerU.value.set(c[0], c[1]);
		else centerU.value.copy(c);
	}
	const scaleU = getU(uniforms, prefix, "scale");
	if (scaleU) {
		const s = gradient.scale ?? [1, 1];
		if (Array.isArray(s)) scaleU.value.set(s[0], s[1]);
		else scaleU.value.copy(s);
	}
	const numStops = Math.min(stops.length, 4);
	const numStopsU = getU(uniforms, prefix, "numStops");
	if (numStopsU) numStopsU.value = numStops;
	const gradientStopsU = getU(uniforms, prefix, "gradientStops");
	const gradientColorsU = getU(uniforms, prefix, "gradientColors");
	const stopPositions = gradientStopsU ? gradientStopsU.value : [];
	const stopColors = gradientColorsU ? gradientColorsU.value : [];
	for (let i = 0; i < 4; i++) if (i < numStops) {
		const s = stops[i];
		if (stopPositions[i] !== void 0) stopPositions[i] = s.position;
		const { color, opacity } = parseColorWithAlpha(s.color);
		if (stopColors[i]) stopColors[i].set(color.r, color.g, color.b, opacity);
	} else {
		if (stopPositions[i] !== void 0) stopPositions[i] = 0;
		if (stopColors[i]) stopColors[i].set(0, 0, 0, 0);
	}
}
/**
* Creates a set of uniforms for a Shadow structure.
* @param prefix - The prefix for uniform names (e.g., 'u_inner_shadow_', 'u_outer_shadow_').
* @returns An object containing ShaderUniforms.
*/
function createShadowUniforms(prefix) {
	return {
		...createPaintUniforms(prefix),
		[`${prefix}blur`]: { value: 0 },
		[`${prefix}position`]: { value: new Vector2(0, 0) },
		[`${prefix}spread`]: { value: 0 },
		[`${prefix}falloff`]: { value: 0 }
	};
}
/**
* Updates ShaderUniforms based on Shadow properties.
* @param uniforms - The uniforms object to update.
* @param properties - Shadow properties containing blur, position, spread, falloff.
* @param prefix - The uniform name prefix.
*/
function updateShadowUniforms(uniforms, properties, prefix) {
	if (properties.color !== void 0) updatePaintUniforms(uniforms, properties.color, prefix);
	if (properties.blur !== void 0) {
		const u = getU(uniforms, prefix, "blur");
		if (u) u.value = properties.blur;
	}
	if (properties.spread !== void 0) {
		const u = getU(uniforms, prefix, "spread");
		if (u) u.value = properties.spread;
	}
	if (properties.falloff !== void 0) {
		const u = getU(uniforms, prefix, "falloff");
		if (u) u.value = properties.falloff;
	}
	if (properties.position) {
		const pos = properties.position;
		const u = getU(uniforms, prefix, "position");
		if (u) {
			if (Array.isArray(pos)) u.value.set(pos[0], pos[1]);
			else u.value.copy(pos);
		}
	}
}
/**
* Updates ShaderUniforms based on Stroke properties.
* @param uniforms - The uniforms object to update.
* @param properties - Stroke properties containing width and alignment.
*/
function updateStrokeUniforms(uniforms, properties) {
	if (uniforms.u_stroke_width && properties.strokeWidth !== void 0) uniforms.u_stroke_width.value = properties.strokeWidth;
	if (uniforms.u_stroke_align && properties.strokeAlign !== void 0) {
		let shaderAlign = 0;
		if (properties.strokeAlign === "inside") shaderAlign = -1;
		else if (properties.strokeAlign === "outside") shaderAlign = 1;
		uniforms.u_stroke_align.value = shaderAlign;
	}
}
/**
* A Custom component that wraps a PanelShaderMaterial.
*
* It automatically handles:
* - Rendering Order (forces `elementType: 0` to render before content)
* - Resolution Syncing (updates `u_resolution` uniform on resize)
*
* It is designed to be added to a `ShaderPanel` via `addLayer()`.
*/
var PanelLayer = class extends Custom {
	/**
	* @param material - The PanelShaderMaterial instance to use for rendering.
	* @param inputProperties - Properties provided by the consumer component.
	* @param initialClasses - Array of classes or styles to apply.
	* @param config - Optional configuration settings for the layer lifecycle.
	*/
	constructor(material, inputProperties, initialClasses, config) {
		super(inputProperties, initialClasses, {
			material,
			...config
		});
		this.material = material;
		abortableEffect(() => {
			const orderInfo = this.orderInfo.value;
			if (orderInfo && orderInfo.elementType !== 0) this.orderInfo.value = {
				...orderInfo,
				elementType: 0
			};
		}, this.abortSignal);
		abortableEffect(() => {
			const size = this.size.value;
			if (size) this.material.uniforms.u_resolution.value.set(size[0], size[1]);
		}, this.abortSignal);
		abortableEffect(() => {
			const opacity = this.properties.signal.opacity?.value;
			this.material.uniforms.u_opacity.value = typeof opacity === "string" ? Number.parseFloat(opacity) / 100 : opacity ?? 1;
		}, this.abortSignal);
	}
	/**
	* Helper method to update a shader uniform safely if it exists.
	* @param name - The name of the uniform to update.
	* @param value - The new value for the uniform.
	*/
	updateUniform(name, value) {
		if (this.material.uniforms[name]) {
			const u = this.material.uniforms[name];
			if (u) u.value = value;
		}
	}
};
var UnifiedPanelLayer = class extends PanelLayer {
	constructor(inputProperties, initialClasses = void 0, config = {}) {
		const material = createUnifiedPanelMaterial({
			side: config.side ?? 0,
			uniforms: {
				u_has_fill: { value: 0 },
				...createPaintUniforms("u_fill_"),
				u_has_drop_shadow: { value: 0 },
				...createPaintUniforms("u_drop_"),
				...createShadowUniforms("u_drop_"),
				u_has_inner_shadow: { value: 0 },
				...createPaintUniforms("u_inner_"),
				...createShadowUniforms("u_inner_"),
				u_has_stroke: { value: 0 },
				...createPaintUniforms("u_stroke_"),
				u_stroke_width: { value: 0 },
				u_stroke_align: { value: 0 },
				u_corner_radius: { value: 0 },
				u_drop_shadow_margin: { value: 0 }
			}
		});
		super(material, inputProperties, initialClasses, config);
		this.name = "UnifiedPanelLayer";
		abortableEffect(() => {
			const signalProps = this.properties.signal;
			const fillColor = signalProps.fillColor?.value;
			const hasFill = isPaintVisible(fillColor);
			updatePaintUniforms(this.material.uniforms, fillColor, "u_fill_");
			this.material.uniforms.u_has_fill.value = hasFill ? 1 : 0;
			const dropShadowColor = signalProps.dropShadowColor?.value;
			const hasDropShadow = isPaintVisible(dropShadowColor);
			updatePaintUniforms(this.material.uniforms, dropShadowColor, "u_drop_");
			updateShadowUniforms(this.material.uniforms, {
				blur: signalProps.dropShadowBlur?.value,
				position: signalProps.dropShadowPosition?.value,
				spread: signalProps.dropShadowSpread?.value,
				falloff: signalProps.dropShadowFalloff?.value
			}, "u_drop_");
			this.material.uniforms.u_has_drop_shadow.value = hasDropShadow ? 1 : 0;
			const innerShadowColor = signalProps.innerShadowColor?.value;
			const hasInnerShadow = isPaintVisible(innerShadowColor);
			updatePaintUniforms(this.material.uniforms, innerShadowColor, "u_inner_");
			updateShadowUniforms(this.material.uniforms, {
				blur: signalProps.innerShadowBlur?.value,
				position: signalProps.innerShadowPosition?.value,
				spread: signalProps.innerShadowSpread?.value,
				falloff: signalProps.innerShadowFalloff?.value
			}, "u_inner_");
			this.material.uniforms.u_has_inner_shadow.value = hasInnerShadow ? 1 : 0;
			const strokeColor = signalProps.strokeColor?.value;
			const strokeWidth = signalProps.strokeWidth?.value ?? 0;
			const hasStroke = isPaintVisible(strokeColor) && strokeWidth > 0;
			updatePaintUniforms(this.material.uniforms, strokeColor, "u_stroke_");
			updateStrokeUniforms(this.material.uniforms, {
				strokeWidth,
				strokeAlign: signalProps.strokeAlign?.value
			});
			this.material.uniforms.u_has_stroke.value = hasStroke ? 1 : 0;
			const cornerRadius = signalProps.cornerRadius?.value ?? 0;
			this.material.uniforms.u_corner_radius.value = cornerRadius;
			const dropShadowMargin = signalProps.dropShadowMargin?.value ?? 0;
			this.material.uniforms.u_drop_shadow_margin.value = dropShadowMargin;
			this.material.visible = hasFill || hasDropShadow || hasInnerShadow || hasStroke;
		}, this.abortSignal);
	}
};
/**
* GradientPanel.
* Supports Gradients for Stroke, InnerShadow, and DropShadow.
*/
var GradientPanel = class extends ShaderPanel {
	constructor(properties = {}) {
		const rawProps = properties;
		const cornerRadiusSignal = y(rawProps.borderRadius !== void 0 ? rawProps.borderRadius : properties.cornerRadius ?? DEFAULT_GRADIENT_PANEL_PROPS.cornerRadius);
		const fillColorSignal = y(rawProps.backgroundColor !== void 0 ? rawProps.backgroundColor : properties.fillColor ?? DEFAULT_GRADIENT_PANEL_PROPS.fillColor);
		const backfaceColorSignal = properties.backfaceColor === void 0 ? void 0 : y(properties.backfaceColor);
		const innerShadowColorSignal = y(properties.innerShadowColor ?? DEFAULT_GRADIENT_PANEL_PROPS.innerShadowColor);
		const innerShadowBlurSignal = y(properties.innerShadowBlur ?? DEFAULT_GRADIENT_PANEL_PROPS.innerShadowBlur);
		const innerShadowPositionSignal = y(properties.innerShadowPosition ?? DEFAULT_GRADIENT_PANEL_PROPS.innerShadowPosition);
		const innerShadowSpreadSignal = y(properties.innerShadowSpread ?? DEFAULT_GRADIENT_PANEL_PROPS.innerShadowSpread);
		const innerShadowFalloffSignal = y(properties.innerShadowFalloff ?? DEFAULT_GRADIENT_PANEL_PROPS.innerShadowFalloff);
		const dropShadowColorSignal = y(properties.dropShadowColor ?? DEFAULT_GRADIENT_PANEL_PROPS.dropShadowColor);
		const dropShadowBlurSignal = y(properties.dropShadowBlur ?? DEFAULT_GRADIENT_PANEL_PROPS.dropShadowBlur);
		const dropShadowPositionSignal = y(properties.dropShadowPosition ?? DEFAULT_GRADIENT_PANEL_PROPS.dropShadowPosition);
		const dropShadowSpreadSignal = y(properties.dropShadowSpread ?? DEFAULT_GRADIENT_PANEL_PROPS.dropShadowSpread);
		const dropShadowFalloffSignal = y(properties.dropShadowFalloff ?? DEFAULT_GRADIENT_PANEL_PROPS.dropShadowFalloff);
		const shadowExpansion = O(() => {
			const blur = Math.max(dropShadowBlurSignal.value, 0);
			const spread = Math.max(dropShadowSpreadSignal.value, 0);
			const pos = dropShadowPositionSignal.value;
			let extra = 0;
			if (pos) {
				if (Array.isArray(pos)) extra = Math.max(Math.abs(pos[0]), Math.abs(pos[1]));
				else extra = Math.max(Math.abs(pos.x), Math.abs(pos.y));
			}
			return blur + extra + spread;
		});
		const strokeColorSignal = y(rawProps.borderColor !== void 0 ? rawProps.borderColor : properties.strokeColor ?? DEFAULT_GRADIENT_PANEL_PROPS.strokeColor);
		const strokeWidthSignal = y(rawProps.borderWidth !== void 0 ? rawProps.borderWidth : properties.strokeWidth ?? DEFAULT_GRADIENT_PANEL_PROPS.strokeWidth);
		const strokeAlignSignal = y(properties.strokeAlign ?? DEFAULT_GRADIENT_PANEL_PROPS.strokeAlign);
		const expansionMarginSignal = O(() => {
			const s = shadowExpansion.value;
			const sWidth = strokeWidthSignal.value;
			const align = strokeAlignSignal.value;
			let strokeExpand = 0;
			if (align === "center") strokeExpand = sWidth * .5;
			else if (align === "outside") strokeExpand = sWidth;
			return s + strokeExpand;
		});
		super({
			...properties,
			overflow: "visible"
		});
		this.name = "GradientPanel";
		this.unifiedLayer = new UnifiedPanelLayer({
			fillColor: fillColorSignal,
			dropShadowColor: dropShadowColorSignal,
			dropShadowBlur: dropShadowBlurSignal,
			dropShadowPosition: dropShadowPositionSignal,
			dropShadowSpread: dropShadowSpreadSignal,
			dropShadowFalloff: dropShadowFalloffSignal,
			innerShadowColor: innerShadowColorSignal,
			innerShadowBlur: innerShadowBlurSignal,
			innerShadowPosition: innerShadowPositionSignal,
			innerShadowSpread: innerShadowSpreadSignal,
			innerShadowFalloff: innerShadowFalloffSignal,
			strokeColor: strokeColorSignal,
			strokeWidth: strokeWidthSignal,
			strokeAlign: strokeAlignSignal,
			cornerRadius: cornerRadiusSignal,
			dropShadowMargin: expansionMarginSignal
		});
		if (backfaceColorSignal) {
			this.backfaceLayer = new UnifiedPanelLayer({
				fillColor: backfaceColorSignal,
				strokeColor: strokeColorSignal,
				strokeWidth: strokeWidthSignal,
				strokeAlign: strokeAlignSignal,
				cornerRadius: cornerRadiusSignal,
				dropShadowMargin: expansionMarginSignal
			}, void 0, { side: 1 });
			this.backfaceLayer.name = "BackfaceLayer";
			this.backfaceLayer.userData[PANEL_BACKFACE_MARKER] = true;
			this.addLayer(this.backfaceLayer);
		}
		this.addLayer(this.unifiedLayer);
		this.cornerRadiusSignal = cornerRadiusSignal;
		this.fillColorSignal = fillColorSignal;
		this.backfaceColorSignal = backfaceColorSignal;
		this.innerShadowColorSignal = innerShadowColorSignal;
		this.innerShadowBlurSignal = innerShadowBlurSignal;
		this.innerShadowPositionSignal = innerShadowPositionSignal;
		this.innerShadowSpreadSignal = innerShadowSpreadSignal;
		this.innerShadowFalloffSignal = innerShadowFalloffSignal;
		this.dropShadowColorSignal = dropShadowColorSignal;
		this.dropShadowBlurSignal = dropShadowBlurSignal;
		this.dropShadowPositionSignal = dropShadowPositionSignal;
		this.dropShadowSpreadSignal = dropShadowSpreadSignal;
		this.dropShadowFalloffSignal = dropShadowFalloffSignal;
		this.expansionMarginSignal = expansionMarginSignal;
		this.strokeColorSignal = strokeColorSignal;
		this.strokeWidthSignal = strokeWidthSignal;
		this.strokeAlignSignal = strokeAlignSignal;
		const absProps = {
			positionType: "absolute",
			pointerEvents: "none"
		};
		this.unifiedLayer.setProperties({
			...absProps,
			transformTranslateZ: .001,
			pointerEvents: properties.pointerEvents ?? "auto"
		});
		this.backfaceLayer?.setProperties({
			...absProps,
			transformTranslateZ: -.001
		});
		const marginNeg = O(() => -this.expansionMarginSignal.value);
		abortableEffect(() => {
			const m = marginNeg.value;
			const props = {
				positionTop: m,
				positionLeft: m,
				positionRight: m,
				positionBottom: m
			};
			this.unifiedLayer.setProperties(props);
			this.backfaceLayer?.setProperties(props);
		}, this.abortSignal);
		const nestingLevelSignal = O(() => {
			let count = 0;
			let p = this.parentContainer?.value;
			while (p != null) {
				count++;
				p = p.parentContainer?.value;
			}
			return count;
		});
		this.nestingLevelSignal = nestingLevelSignal;
		abortableEffect(() => {
			const baseZ = nestingLevelSignal.value * .01;
			if (this.backfaceLayer) this.backfaceLayer.position.z = baseZ - .001;
			this.unifiedLayer.position.z = baseZ + .0015;
			const contentZ = baseZ + .004;
			for (const child of this.children) {
				if (child === this.unifiedLayer || child === this.backfaceLayer) continue;
				const childWithProps = child;
				if (typeof childWithProps.setProperties === "function") childWithProps.setProperties({ transformTranslateZ: contentZ });
				else child.position.z = contentZ;
			}
		}, this.abortSignal);
	}
	/** Overrides add method to cascade physical Z-position offsets for nested panels. */
	add(...objects) {
		super.add(...objects);
		const contentZ = (this.nestingLevelSignal?.value ?? 0) * .01 + .004;
		for (const obj of objects) {
			if (obj === this.unifiedLayer || obj === this.backfaceLayer) continue;
			const objWithProps = obj;
			if (typeof objWithProps.setProperties === "function") objWithProps.setProperties({ transformTranslateZ: contentZ });
			else obj.position.z = contentZ;
		}
		return this;
	}
	/** Sets the corner radius of the panel. */
	setCornerRadius(radius) {
		this.cornerRadiusSignal.value = radius;
	}
	/** Sets the fill color or gradient. */
	setFillColor(c) {
		this.fillColorSignal.value = c;
	}
	/** Sets the optional rear-face color or gradient. */
	setBackfaceColor(c) {
		if (this.backfaceColorSignal) this.backfaceColorSignal.value = c;
	}
	/** Sets the inner shadow color or gradient. */
	setInnerShadowColor(c) {
		this.innerShadowColorSignal.value = c;
	}
	/** Sets the inner shadow blur radius. */
	setInnerShadowBlur(v) {
		this.innerShadowBlurSignal.value = v;
	}
	/** Sets the inner shadow position offset. */
	setInnerShadowPosition(v) {
		this.innerShadowPositionSignal.value = v;
	}
	/** Sets the inner shadow spread expansion. */
	setInnerShadowSpread(v) {
		this.innerShadowSpreadSignal.value = v;
	}
	/** Sets the inner shadow falloff rate. */
	setInnerShadowFalloff(v) {
		this.innerShadowFalloffSignal.value = v;
	}
	/** Sets the drop shadow color or gradient. */
	setDropShadowColor(c) {
		this.dropShadowColorSignal.value = c;
	}
	/** Sets the drop shadow blur radius. */
	setDropShadowBlur(v) {
		this.dropShadowBlurSignal.value = v;
	}
	/** Sets the drop shadow position offset. */
	setDropShadowPosition(v) {
		this.dropShadowPositionSignal.value = v;
	}
	/** Sets the drop shadow spread expansion. */
	setDropShadowSpread(v) {
		this.dropShadowSpreadSignal.value = v;
	}
	/** Sets the drop shadow falloff rate. */
	setDropShadowFalloff(v) {
		this.dropShadowFalloffSignal.value = v;
	}
	/** Sets the stroke color or gradient. */
	setStrokeColor(c) {
		this.strokeColorSignal.value = c;
	}
	/** Sets the stroke width. */
	setStrokeWidth(width) {
		this.strokeWidthSignal.value = width;
	}
	/** Sets the stroke alignment (inside, outside, center). */
	setStrokeAlign(align) {
		this.strokeAlignSignal.value = align;
	}
	/**
	* Updates multiple properties at once.
	* Extracts known properties to apply them via signals/setters,
	* passing remaining properties to the super class.
	* @param props - Object containing properties to update.
	*/
	setProperties(props) {
		const { fillColor: rawFillColor, backgroundColor, backfaceColor, innerShadowColor, innerShadowBlur, innerShadowPosition, innerShadowSpread, innerShadowFalloff, dropShadowColor, dropShadowBlur, dropShadowPosition, dropShadowSpread, dropShadowFalloff, strokeColor: rawStrokeColor, borderColor, strokeWidth: rawStrokeWidth, borderWidth, strokeAlign, cornerRadius: rawCornerRadius, borderRadius, ...superProps } = props;
		const fillColor = backgroundColor !== void 0 ? backgroundColor : rawFillColor;
		const strokeColor = borderColor !== void 0 ? borderColor : rawStrokeColor;
		const strokeWidth = borderWidth !== void 0 ? borderWidth : rawStrokeWidth;
		const cornerRadius = borderRadius !== void 0 ? borderRadius : rawCornerRadius;
		super.setProperties(superProps);
		if (fillColor !== void 0) this.setFillColor(fillColor);
		if (backfaceColor !== void 0) this.setBackfaceColor(backfaceColor);
		if (innerShadowColor !== void 0) this.innerShadowColorSignal.value = innerShadowColor;
		if (innerShadowBlur !== void 0) this.innerShadowBlurSignal.value = innerShadowBlur;
		if (innerShadowPosition !== void 0) this.innerShadowPositionSignal.value = innerShadowPosition;
		if (innerShadowSpread !== void 0) this.innerShadowSpreadSignal.value = innerShadowSpread;
		if (innerShadowFalloff !== void 0) this.innerShadowFalloffSignal.value = innerShadowFalloff;
		if (dropShadowColor !== void 0) this.dropShadowColorSignal.value = dropShadowColor;
		if (dropShadowBlur !== void 0) this.dropShadowBlurSignal.value = dropShadowBlur;
		if (dropShadowPosition !== void 0) this.dropShadowPositionSignal.value = dropShadowPosition;
		if (dropShadowSpread !== void 0) this.dropShadowSpreadSignal.value = dropShadowSpread;
		if (dropShadowFalloff !== void 0) this.dropShadowFalloffSignal.value = dropShadowFalloff;
		if (strokeColor !== void 0) this.setStrokeColor(strokeColor);
		if (strokeWidth !== void 0) this.setStrokeWidth(strokeWidth);
		if (strokeAlign !== void 0) this.setStrokeAlign(strokeAlign);
		if (cornerRadius !== void 0) this.setCornerRadius(cornerRadius);
	}
};
var svgLoader = new SVGLoader();
/**
* Parses an SVG string into at most one mesh per fill color: all shapes
* sharing a color are merged into a single geometry. uikit's `Svg` creates a
* mesh per shape, which turns every multi-shape icon into several draw calls.
*
* The y-flip must stay a mesh scale exactly like uikit's `Svg` does — never
* baked into the geometry. A negative matrixWorld determinant makes three
* flip `frontFace` (WebGLState.setMaterial), which mixed-winding shapes from
* evenodd fill rules need in order to cull like uikit's meshes do.
*/
function parseMergedSvg(content) {
	const result = svgLoader.parse(content);
	const groups = /* @__PURE__ */ new Map();
	for (const path of result.paths) {
		const shapes = path.toShapes();
		if (shapes.length === 0) continue;
		const key = `${path.color.r} ${path.color.g} ${path.color.b}`;
		const group = groups.get(key);
		if (group) group.shapes.push(...shapes);
		else groups.set(key, {
			color: path.color.clone(),
			shapes
		});
	}
	const meshes = [];
	for (const { color, shapes } of groups.values()) {
		const geometries = shapes.map((shape) => new ShapeGeometry(shape));
		const nonIndexed = geometries.map((geometry) => geometry.toNonIndexed());
		const merged = mergeGeometries(nonIndexed, false);
		for (const geometry of nonIndexed) geometry.dispose();
		if (merged == null) {
			for (const geometry of geometries) meshes.push(createIconMesh(geometry, color.clone()));
			continue;
		}
		for (const geometry of geometries) geometry.dispose();
		meshes.push(createIconMesh(merged, color));
	}
	return {
		meshes,
		boundingBox: computeSvgBoundingBox(result.xml)
	};
}
function createIconMesh(geometry, color) {
	const mesh = new Mesh(geometry, new MeshBasicMaterial({
		color,
		toneMapped: false
	}));
	mesh.matrixAutoUpdate = false;
	mesh.scale.y = -1;
	mesh.updateMatrix();
	return mesh;
}
function computeSvgBoundingBox(xml) {
	const viewBoxNumbers = xml.getAttribute("viewBox")?.split(/\s+/u).map((value) => Number.parseFloat(value)).filter((value) => !isNaN(value));
	if (viewBoxNumbers?.length !== 4) return void 0;
	const [minX, minY, width, height] = viewBoxNumbers;
	return {
		center: new Vector3(width / 2 + minX, -height / 2 - minY, 0),
		size: new Vector3(width, height, 1e-5)
	};
}
function disposeMergedSvg(result) {
	for (const mesh of result.meshes) {
		mesh.geometry.dispose();
		mesh.material.dispose();
	}
}
var MergedSvg = class MergedSvg extends Content {
	constructor(inputProperties, initialClasses, inputConfig) {
		const boundingBox = y(void 0);
		super(inputProperties, initialClasses, {
			...inputConfig,
			remeasureOnChildrenChange: false,
			depthWriteDefault: false,
			supportFillProperty: true,
			boundingBox
		});
		this.inputConfig = inputConfig;
		const contentSignal = O(() => this.properties.value.content);
		abortableEffect(() => {
			const content = contentSignal.value;
			if (typeof content !== "string" || content.length === 0) {
				boundingBox.value = void 0;
				this.notifyAncestorsChanged();
				return;
			}
			const result = parseMergedSvg(content);
			boundingBox.value = result.boundingBox;
			if (result.meshes.length > 0) super.add(...result.meshes);
			this.notifyAncestorsChanged();
			return () => {
				if (result.meshes.length > 0) super.remove(...result.meshes);
				disposeMergedSvg(result);
				this.notifyAncestorsChanged();
			};
		}, this.abortSignal);
	}
	clone(recursive) {
		const cloned = new MergedSvg(this.inputProperties, this.initialClasses, this.inputConfig);
		this.copyInto(cloned, recursive);
		return cloned;
	}
};
var DEFAULT_EDGE_PROPERTIES = {
	margin: 50,
	cardCornerRadius: 0,
	edgeWidth: 2,
	spotlightColor: "rgba(255, 255, 255, 1)",
	spotlightRadius: 20,
	spotlightBlur: 40,
	debug: false,
	resizable: false
};
var UICardEdgeLayer = class extends PanelLayer {
	constructor(inputProperties, initialClasses, config = {}) {
		super(createCardEdgeMaterial({
			depthWrite: false,
			side: 2,
			uniforms: createUniforms()
		}), inputProperties, initialClasses, config);
		this.visible = false;
		abortableEffect(() => {
			const signals = this.properties.signal;
			setNumber(this.material, "u_edge_margin", signals.u_edge_margin?.value);
			setNumber(this.material, "u_card_corner_radius", signals.u_card_corner_radius?.value);
			setNumber(this.material, "u_edge_width", signals.u_edge_width?.value);
			setColor(this.material, "u_cursor_spotlight_color", signals.u_cursor_spotlight_color?.value);
			setNumber(this.material, "u_cursor_radius", signals.u_cursor_radius?.value);
			setNumber(this.material, "u_cursor_spotlight_blur", signals.u_cursor_spotlight_blur?.value);
			setVector2(this.material, "u_cursor_uv", signals.u_cursor_uv?.value);
			setNumber(this.material, "u_show_glow", signals.u_show_glow?.value);
			setVector2(this.material, "u_cursor_uv_2", signals.u_cursor_uv_2?.value);
			setNumber(this.material, "u_show_glow_2", signals.u_show_glow_2?.value);
			setNumber(this.material, "u_debug", signals.u_debug?.value);
			setNumber(this.material, "u_resizable", signals.u_resizable?.value);
		}, this.abortSignal);
	}
	setCursor(uv, index) {
		const signals = this.properties.signal;
		const cursor = index === 0 ? signals.u_cursor_uv : signals.u_cursor_uv_2;
		const visible = index === 0 ? signals.u_show_glow : signals.u_show_glow_2;
		if (cursor && uv) {
			if (cursor.value) cursor.value.copy(uv);
			else cursor.value = uv;
			setVector2(this.material, index === 0 ? "u_cursor_uv" : "u_cursor_uv_2", uv);
		}
		if (visible) visible.value = uv ? 1 : 0;
		this.visible = Boolean(signals.u_show_glow?.value || signals.u_show_glow_2?.value);
	}
};
/** Private shader-backed card edge. */
var UICardEdge = class extends UICardEdgeLayer {
	constructor(properties = {}) {
		const resolved = {
			...DEFAULT_EDGE_PROPERTIES,
			...properties
		};
		const margin = Math.max(0, resolved.margin);
		const cardCornerRadius = Math.max(0, resolved.cardCornerRadius);
		super({
			positionType: "absolute",
			positionTop: -margin,
			positionRight: -margin,
			positionBottom: -margin,
			positionLeft: -margin,
			width: "auto",
			height: "auto",
			pointerEvents: "auto",
			zIndexOffset: -20,
			u_edge_margin: margin,
			u_card_corner_radius: cardCornerRadius,
			u_edge_width: resolved.edgeWidth,
			u_cursor_spotlight_color: resolved.spotlightColor,
			u_cursor_radius: resolved.spotlightRadius,
			u_cursor_spotlight_blur: resolved.spotlightBlur,
			u_cursor_uv: new Vector2(.5, .5),
			u_show_glow: 0,
			u_cursor_uv_2: new Vector2(.5, .5),
			u_show_glow_2: 0,
			u_debug: resolved.debug ? 1 : 0,
			u_resizable: resolved.resizable ? 1 : 0
		});
		this.name = "UICardEdge";
		this.resizeHandle = new Object3D();
		this.cursorLocal = [new Vector3(), new Vector3()];
		this.cursorUV = [new Vector2(), new Vector2()];
		this.containsPoint = (point, padding = 0) => {
			const size = this.size.value;
			if (!size) return false;
			this.updateWorldMatrix(true, false);
			if (Math.abs(this.matrixWorld.determinant()) < Number.EPSILON) return false;
			const local = this.worldToLocal(point.clone());
			const xScale = new Vector3().setFromMatrixColumn(this.matrixWorld, 0).length();
			const paddingPixels = padding > 0 && xScale > Number.EPSILON ? padding / xScale * size[0] : 0;
			return isOuterEdgeHit(new Vector2(local.x + .5, local.y + .5), size, this.margin, this._cardCornerRadius, paddingPixels);
		};
		this.xb = { manipulationHandle: { action: ManipulationAction.Translate } };
		this.margin = margin;
		this._cardCornerRadius = cardCornerRadius;
		this._resizable = resolved.resizable;
		this.resizeHandle.name = "UICardResizeHandle";
		this.resizeHandle.xb = { manipulationHandle: { action: ManipulationAction.Resize } };
		this.resizeHandle.matrixAutoUpdate = false;
		this.resizeHandle.matrixWorldAutoUpdate = false;
		const baseRaycast = this.raycast.bind(this);
		this.raycast = (raycaster, intersections) => {
			const firstNewIntersection = intersections.length;
			baseRaycast(raycaster, intersections);
			const size = this.size.value;
			for (let index = intersections.length - 1; index >= firstNewIntersection; index--) {
				const intersection = intersections[index];
				const uv = intersection.uv;
				if (!size || !uv || !isOuterEdgeHit(uv, size, this.margin, this._cardCornerRadius)) intersections.splice(index, 1);
				else if (this._resizable && isCornerHit(uv, size, this.margin, this._cardCornerRadius)) {
					this.resizeHandle.matrixWorld.copy(this.matrixWorld);
					intersection.object = this.resizeHandle;
				}
			}
		};
	}
	get cardCornerRadius() {
		return this._cardCornerRadius;
	}
	setCardCornerRadius(radius) {
		const nextRadius = Math.max(0, radius);
		this._cardCornerRadius = nextRadius;
		const signal = this.properties.signal.u_card_corner_radius;
		if (signal) signal.value = nextRadius;
		setNumber(this.material, "u_card_corner_radius", nextRadius);
	}
	get resizable() {
		return this._resizable;
	}
	setResizable(resizable) {
		this._resizable = resizable;
		const signal = this.properties.signal.u_resizable;
		if (signal) signal.value = resizable ? 1 : 0;
		setNumber(this.material, "u_resizable", resizable ? 1 : 0);
	}
	/** Returns the resize handle when a world point touches a resize corner. */
	touchTarget(point) {
		const size = this.size.value;
		if (!this._resizable || !size) return void 0;
		this.updateWorldMatrix(true, false);
		const local = this.worldToLocal(point.clone());
		const uv = new Vector2(local.x + .5, local.y + .5);
		if (!isOuterEdgeHit(uv, size, this.margin, this._cardCornerRadius) || !isCornerHit(uv, size, this.margin, this._cardCornerRadius)) return;
		this.resizeHandle.matrixWorld.copy(this.matrixWorld);
		return this.resizeHandle;
	}
	setCursorPoints(first, second) {
		this.setCursorPoint(first, 0);
		this.setCursorPoint(second, 1);
	}
	setCursorPoint(point, index) {
		if (!point || !this.size.value) {
			this.setCursor(void 0, index);
			return;
		}
		const local = this.cursorLocal[index].copy(point);
		this.worldToLocal(local);
		this.setCursor(this.cursorUV[index].set(local.x + .5, local.y + .5), index);
	}
};
function createUniforms() {
	return {
		u_edge_margin: { value: 0 },
		u_card_corner_radius: { value: 0 },
		u_edge_width: { value: 0 },
		u_cursor_spotlight_color: { value: new Vector4(1, 1, 1, 1) },
		u_cursor_radius: { value: 0 },
		u_cursor_spotlight_blur: { value: 0 },
		u_cursor_uv: { value: new Vector2(.5, .5) },
		u_show_glow: { value: 0 },
		u_cursor_uv_2: { value: new Vector2(.5, .5) },
		u_show_glow_2: { value: 0 },
		u_debug: { value: 0 },
		u_resizable: { value: 0 }
	};
}
function setNumber(material, name, value) {
	if (value !== void 0) material.uniforms[name].value = value;
}
function setColor(material, name, value) {
	if (value === void 0) return;
	const { color, opacity } = parseColorWithAlpha(value);
	material.uniforms[name].value.set(color.r, color.g, color.b, opacity);
}
function setVector2(material, name, value) {
	if (value !== void 0) material.uniforms[name].value.copy(value);
}
function isOuterEdgeHit(uv, size, margin, cardCornerRadius, padding = 0) {
	const halfWidth = size[0] / 2;
	const halfHeight = size[1] / 2;
	const x = uv.x * size[0] - halfWidth;
	const y = uv.y * size[1] - halfHeight;
	const innerHalfWidth = Math.max(0, halfWidth - margin);
	const innerHalfHeight = Math.max(0, halfHeight - margin);
	const innerRadius = Math.min(cardCornerRadius, innerHalfWidth, innerHalfHeight);
	return roundedBoxDistance(x, y, halfWidth, halfHeight, Math.min(innerRadius + margin, halfWidth, halfHeight)) <= padding && roundedBoxDistance(x, y, innerHalfWidth, innerHalfHeight, innerRadius) >= -padding;
}
/**
* Returns true inside the band's corner regions. Each region covers the rounded
* corner arc plus one margin width along both adjoining sides.
*/
function isCornerHit(uv, size, margin, cardCornerRadius) {
	const halfWidth = size[0] / 2;
	const halfHeight = size[1] / 2;
	const extent = Math.min(cardCornerRadius, Math.max(0, halfWidth - margin), Math.max(0, halfHeight - margin)) + 2 * margin;
	const x = Math.abs(uv.x * size[0] - halfWidth);
	const y = Math.abs(uv.y * size[1] - halfHeight);
	return x >= halfWidth - Math.min(extent, halfWidth * .5) && y >= halfHeight - Math.min(extent, halfHeight * .5);
}
function roundedBoxDistance(x, y, halfWidth, halfHeight, radius) {
	const qx = Math.abs(x) - halfWidth + radius;
	const qy = Math.abs(y) - halfHeight + radius;
	return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - radius;
}
var EMOJI_SEQUENCE_SOURCE = String.raw`(?:\p{Regional_Indicator}{2}|[#*0-9]\uFE0F?\u20E3|(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)(?:\p{Emoji_Modifier})?(?:\u200D(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)(?:\p{Emoji_Modifier})?)*)`;
var EMOJI_SEQUENCE_REGEX = new RegExp(EMOJI_SEQUENCE_SOURCE, "u");
var EMOJI_SEQUENCE_GLOBAL_REGEX = new RegExp(EMOJI_SEQUENCE_SOURCE, "gu");
var TEXT_SEGMENT_REGEX = new RegExp(`${EMOJI_SEQUENCE_SOURCE}|\\n|[ \\t\\r]+|[a-zA-Z0-9]+|[^a-zA-Z0-9\\s]`, "gu");
/** Renders ASCII text as sharp UIKit glyphs and emoji as inline images. */
var EmojiText = class extends Container {
	constructor(properties) {
		super(emojiContainerProperties(properties));
		this.name = "EmojiText";
		this.updateTextProperties(properties);
	}
	updateTextProperties(properties) {
		this.resetProperties(emojiContainerProperties(properties));
		for (const child of [...this.children]) if (child instanceof Container || child instanceof Image || child instanceof Text) child.dispose();
		const fontSize = properties.fontSize ?? 16;
		const emojiSize = fontSize * 1.05;
		for (const segment of parseSegments(properties.text, fontSize)) if (segment.type === "space") this.add(new Container({
			width: fontSize * .26 * segment.text.length,
			height: fontSize
		}));
		else if (segment.type === "newline") this.add(new Container({
			width: "100%",
			height: segment.blankLine ? fontSize : 0
		}));
		else if (segment.type === "emoji") this.add(new Image({
			src: emojiUrl(segment.text),
			width: emojiSize,
			height: emojiSize,
			keepAspectRatio: true,
			transformTranslateY: -emojiSize * .08,
			marginRight: segment.trailingSpaceWidth,
			pointerEvents: "none"
		}));
		else this.add(new Text({
			text: segment.text,
			fontSize,
			lineHeight: properties.lineHeight,
			color: normalizeAlphaHexColor(properties.color),
			fontWeight: properties.fontWeight,
			whiteSpace: "pre",
			marginRight: segment.trailingSpaceWidth,
			pointerEvents: "none"
		}));
	}
};
function canRenderEmojiText(value) {
	if (!EMOJI_SEQUENCE_REGEX.test(value)) return false;
	const textWithoutEmoji = value.replace(EMOJI_SEQUENCE_GLOBAL_REGEX, "");
	return !/[^\u0020-\u007e\n\r\t]/u.test(textWithoutEmoji);
}
function emojiContainerProperties(properties) {
	return {
		flexDirection: "row",
		flexWrap: properties.whiteSpace === "nowrap" ? "no-wrap" : "wrap",
		alignItems: "center",
		justifyContent: properties.textAlign === "center" ? "center" : properties.textAlign === "right" ? "flex-end" : "flex-start",
		color: normalizeAlphaHexColor(properties.color),
		fontSize: properties.fontSize,
		fontWeight: properties.fontWeight,
		lineHeight: properties.lineHeight,
		flexShrink: 0,
		pointerEvents: "none"
	};
}
function parseSegments(text, fontSize) {
	const rawSegments = text.replace(/\r\n/gu, "\n").match(TEXT_SEGMENT_REGEX) ?? [];
	const segments = [];
	for (let index = 0; index < rawSegments.length; index++) {
		const value = rawSegments[index];
		if (value === "\n") segments.push({
			type: "newline",
			text: value,
			blankLine: index === 0 || rawSegments[index - 1] === "\n"
		});
		else if (/^[ \t\r]+$/u.test(value)) {
			const previous = segments[segments.length - 1];
			if (previous?.type === "word" || previous?.type === "emoji") previous.trailingSpaceWidth = fontSize * .26 * value.length;
			else segments.push({
				type: "space",
				text: value
			});
		} else if (EMOJI_SEQUENCE_REGEX.test(value)) segments.push({
			type: "emoji",
			text: value
		});
		else segments.push({
			type: "word",
			text: value.replace(/\uFE0F/gu, "")
		});
	}
	return segments;
}
function emojiUrl(emoji) {
	let hex = Array.from(emoji).map((character) => character.codePointAt(0).toString(16)).join("-");
	if (!hex.includes("200d") && hex.endsWith("-fe0f")) hex = hex.slice(0, -5);
	return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${hex}.png`;
}
var MEASURE_MODE_UNDEFINED = 0;
var MEASURE_MODE_EXACTLY = 1;
/** Canvas-backed text used when UIkit's fixed glyph atlas cannot render text. */
var UnicodeText = class extends Image {
	constructor(properties) {
		const canvas = document.createElement("canvas");
		canvas.width = 1;
		canvas.height = 1;
		const context = canvas.getContext("2d");
		if (!context) throw new Error("Canvas 2D is required to render Unicode UI text.");
		const texture = new CanvasTexture(canvas);
		texture.colorSpace = SRGBColorSpace;
		texture.minFilter = LinearFilter;
		texture.magFilter = LinearFilter;
		super(imageProperties(properties, texture));
		this.canvas = canvas;
		this.context = context;
		this.canvasTexture = texture;
		this.textProperties = properties;
		this.configureLayout();
		this.stopSizeEffect = x(() => {
			const size = this.size.value;
			if (size) this.draw(size[0], size[1]);
		});
	}
	setTextProperties(properties) {
		this.textProperties = properties;
		this.resetProperties(imageProperties(properties, this.canvasTexture));
		this.configureLayout();
		const size = this.size.peek();
		if (size) this.draw(size[0], size[1]);
	}
	dispose() {
		this.stopSizeEffect();
		this.canvasTexture.dispose();
		super.dispose();
	}
	configureLayout() {
		const style = metricsStyle(this.textProperties);
		applyFont(this.context, style);
		const measure = (width, widthMode) => {
			const availableWidth = widthMode === MEASURE_MODE_UNDEFINED ? Number.POSITIVE_INFINITY : width;
			const layout = layoutText(this.context, this.textProperties.text, style, availableWidth);
			return {
				width: widthMode === MEASURE_MODE_EXACTLY ? width : layout.width,
				height: layout.height
			};
		};
		const minimum = layoutText(this.context, widestCharacter(this.context, this.textProperties.text), {
			...style,
			whiteSpace: "nowrap"
		}, Number.POSITIVE_INFINITY);
		this.node.setCustomLayouting({
			minWidth: minimum.width,
			minHeight: style.lineHeight,
			measure
		});
	}
	draw(width, height) {
		if (!(width > 0) || !(height > 0)) return;
		const scale = resolveRasterScale(width, height);
		const pixelWidth = Math.max(1, Math.ceil(width * scale));
		const pixelHeight = Math.max(1, Math.ceil(height * scale));
		if (this.canvas.width !== pixelWidth || this.canvas.height !== pixelHeight) {
			this.canvasTexture.dispose();
			this.canvas.width = pixelWidth;
			this.canvas.height = pixelHeight;
		}
		this.context.setTransform(1, 0, 0, 1, 0, 0);
		this.context.clearRect(0, 0, pixelWidth, pixelHeight);
		this.context.setTransform(scale, 0, 0, scale, 0, 0);
		const style = metricsStyle(this.textProperties);
		applyFont(this.context, style);
		this.context.fillStyle = style.color;
		this.context.textAlign = style.textAlign;
		this.context.textBaseline = "top";
		const layout = layoutText(this.context, this.textProperties.text, style, width);
		const x = style.textAlign === "center" ? width / 2 : style.textAlign === "right" ? width : 0;
		for (let index = 0; index < layout.lines.length; index++) this.context.fillText(layout.lines[index], x, index * style.lineHeight);
		this.canvasTexture.needsUpdate = true;
		this.root.peek().requestRender?.();
	}
};
function imageProperties(properties, texture) {
	const { text: _text, color: _color, fontSize: _fontSize, fontWeight: _fontWeight, lineHeight: _lineHeight, textAlign: _textAlign, whiteSpace: _whiteSpace, ...layoutProperties } = properties;
	return {
		...layoutProperties,
		src: texture,
		keepAspectRatio: false,
		objectFit: "fill"
	};
}
function metricsStyle(properties) {
	const fontSize = properties.fontSize ?? 16;
	return {
		color: cssColor(properties.color ?? "#ffffff"),
		font: fontShorthand(fontSize, properties.fontWeight),
		lineHeight: resolveLineHeight(properties.lineHeight, fontSize),
		textAlign: properties.textAlign ?? "left",
		whiteSpace: properties.whiteSpace ?? "normal"
	};
}
function applyFont(context, style) {
	context.font = style.font;
}
function layoutText(context, text, style, availableWidth) {
	const paragraphs = style.whiteSpace === "pre-line" ? text.split(/\r?\n/u).map((line) => line.replace(/[\t ]+/gu, " ").trim()) : [text.replace(/\s+/gu, " ").trim()];
	const lines = style.whiteSpace === "nowrap" ? paragraphs : paragraphs.flatMap((line) => wrapLine(context, line, availableWidth));
	const width = lines.reduce((maximum, line) => Math.max(maximum, context.measureText(line).width), 0);
	return {
		lines: lines.length > 0 ? lines : [""],
		width,
		height: Math.max(1, lines.length) * style.lineHeight
	};
}
function wrapLine(context, text, availableWidth) {
	if (!Number.isFinite(availableWidth) || text.length === 0) return [text];
	const lines = [];
	let current = "";
	for (const token of text.split(/(\s+)/u)) {
		if (!token) continue;
		const normalized = /^\s+$/u.test(token) ? " " : token;
		const candidate = current ? `${current}${normalized}` : normalized.trimStart();
		if (context.measureText(candidate).width <= availableWidth) {
			current = candidate;
			continue;
		}
		if (current.trimEnd()) lines.push(current.trimEnd());
		current = "";
		if (context.measureText(normalized).width <= availableWidth) {
			current = normalized.trimStart();
			continue;
		}
		for (const character of graphemes(normalized)) {
			const next = `${current}${character}`;
			if (current && context.measureText(next).width > availableWidth) {
				lines.push(current);
				current = character;
			} else current = next;
		}
	}
	if (current || lines.length === 0) lines.push(current.trimEnd());
	return lines;
}
function widestCharacter(context, text) {
	let widest = "";
	let maximumWidth = 0;
	for (const character of graphemes(text)) {
		const width = context.measureText(character).width;
		if (!/\s/u.test(character) && width > maximumWidth) {
			widest = character;
			maximumWidth = width;
		}
	}
	return widest || " ";
}
/** Stable layout node that selects native or canvas glyph rendering internally. */
var AdaptiveText = class extends Container {
	constructor(properties) {
		super(containerProperties(properties));
		this.name = "AdaptiveText";
		this.updateTextProperties(properties);
	}
	updateTextProperties(properties) {
		this.resetProperties(containerProperties(properties));
		const next = canRenderEmojiText(properties.text) ? this.updateEmojiText(properties) : requiresUnicodeTextRenderer(properties.text) ? this.updateUnicodeText(properties) : this.updateNativeText(properties);
		if (next === this.activeText) return;
		this.activeText?.removeFromParent();
		this.add(next);
		this.activeText = next;
	}
	dispose() {
		this.nativeText?.removeFromParent();
		this.emojiText?.removeFromParent();
		this.unicodeText?.removeFromParent();
		this.nativeText?.dispose();
		this.emojiText?.dispose();
		this.unicodeText?.dispose();
		this.nativeText = void 0;
		this.emojiText = void 0;
		this.unicodeText = void 0;
		this.activeText = void 0;
		super.dispose();
	}
	updateNativeText(properties) {
		const textProperties = nativeTextProperties(properties);
		if (!this.nativeText) this.nativeText = new Text(textProperties);
		else this.nativeText.resetProperties(textProperties);
		return this.nativeText;
	}
	updateEmojiText(properties) {
		if (!this.emojiText) this.emojiText = new EmojiText(properties);
		else this.emojiText.updateTextProperties(properties);
		return this.emojiText;
	}
	updateUnicodeText(properties) {
		const textProperties = unicodeTextProperties(properties);
		if (!this.unicodeText) this.unicodeText = new UnicodeText(textProperties);
		else this.unicodeText.setTextProperties(textProperties);
		return this.unicodeText;
	}
};
function requiresUnicodeTextRenderer(value) {
	return /[^\u0020-\u007e\n\r\t]/u.test(value);
}
function containerProperties(properties) {
	const { text: _text, color: _color, fontSize: _fontSize, fontWeight: _fontWeight, lineHeight: _lineHeight, textAlign: _textAlign, verticalAlign = "middle", whiteSpace: _whiteSpace, textOverflow: _textOverflow, ...layoutProperties } = properties;
	return {
		...layoutProperties,
		flexDirection: "column",
		alignItems: "stretch",
		justifyContent: verticalAlign === "top" ? "flex-start" : verticalAlign === "bottom" ? "flex-end" : "center"
	};
}
function nativeTextProperties(properties) {
	return {
		...glyphProperties(properties),
		color: normalizeAlphaHexColor(properties.color),
		...nativeTextWrapping(properties.whiteSpace)
	};
}
function nativeTextWrapping(whiteSpace) {
	return {
		whiteSpace: whiteSpace === "nowrap" ? "normal" : whiteSpace,
		wordBreak: whiteSpace === "nowrap" ? "keep-all" : "break-word"
	};
}
function unicodeTextProperties(properties) {
	return {
		...glyphProperties(properties),
		whiteSpace: properties.whiteSpace
	};
}
function glyphProperties(properties) {
	return {
		text: properties.text,
		color: properties.color,
		fontSize: properties.fontSize,
		fontWeight: properties.fontWeight,
		lineHeight: properties.lineHeight,
		textAlign: properties.textAlign,
		flexShrink: 0,
		pointerEvents: "none"
	};
}
/** Keeps scroll clipping inside the decorative shell instead of clipping its shadows. */
var ScrollViewPresentation = class {
	constructor(view, shell) {
		this.view = view;
		this.viewport = new Container({
			width: "100%",
			flexGrow: 1,
			flexShrink: 1,
			flexBasis: 0,
			minHeight: 0,
			overflow: "scroll",
			scrollbarWidth: 8,
			paddingRight: 8,
			flexDirection: "column"
		});
		this.content = new Container({
			width: "100%",
			flexShrink: 0,
			flexDirection: "column",
			alignItems: "stretch"
		});
		this.projectPoint = (point) => {
			const size = this.viewport.size.peek();
			if (!size || size[0] <= 0 || size[1] <= 0) return void 0;
			const local = this.viewport.worldToLocal(point.clone());
			return new Vector2((local.x + .5) * size[0], (.5 - local.y) * size[1]);
		};
		this.applyOffset = (offset) => {
			const current = this.viewport.scrollPosition.peek();
			this.viewport.scrollVelocity.set(0, 0);
			if (current[0] !== 0 || current[1] !== offset) this.viewport.scrollPosition.value = [0, offset];
		};
		this.reveal = (child) => {
			const physical = getUIPresentationObject(child);
			if (!(physical instanceof Mesh)) throw new Error("Cannot reveal UI before its presentation is mounted.");
			physical.updateWorldMatrix(true, false);
			const points = [-.5, .5].flatMap((x) => [-.5, .5].map((y) => this.projectPoint(new Vector3(x, y, 0).applyMatrix4(physical.matrixWorld))));
			if (points.some((point) => !point)) throw new Error("Cannot reveal UI before its viewport has a layout.");
			const ys = points.map((point) => point.y);
			const top = Math.min(...ys);
			const bottom = Math.max(...ys);
			if (top < 0) this.view.scrollBy(top);
			else if (bottom > this.view.clientHeight) this.view.scrollBy(bottom - this.view.clientHeight);
		};
		shell.add(this.viewport);
		this.viewport.add(this.content);
		this.unbind = bindScrollView(view, {
			projectPoint: this.projectPoint,
			reveal: this.reveal,
			applyOffset: this.applyOffset,
			scrollbarHit: (point) => scrollbarHit(this.viewport, point)
		});
	}
	commit(properties) {
		this.content.setProperties({
			flexDirection: properties.flexDirection ?? "column",
			alignItems: properties.alignItems ?? "stretch",
			justifyContent: properties.justifyContent ?? "flex-start",
			gapRow: properties.rowGap ?? properties.gap,
			gapColumn: properties.columnGap ?? properties.gap
		});
		this.viewport.setProperties({ scrollbarColor: properties.color ?? "#888888" });
	}
	afterLayout() {
		const size = this.viewport.size.peek();
		if (!size) return;
		const height = size[1];
		const maximum = this.viewport.maxScrollPosition.peek()[1] ?? 0;
		updateScrollViewLayout(this.view, height, height + maximum);
		this.applyOffset(this.view.scrollTop);
	}
	dispose() {
		this.unbind();
		this.content.removeFromParent();
		this.content.dispose();
		this.viewport.removeFromParent();
		this.viewport.dispose();
	}
};
/** Maps the viewport's proportional thumb/track to a vertical scroll gesture. */
function scrollbarHit(viewport, point) {
	const size = viewport.size.peek();
	const maximum = viewport.maxScrollPosition.peek()[1];
	if (!size || maximum === void 0 || maximum <= 0) return void 0;
	const width = viewport.properties.peek().scrollbarWidth;
	const [top, right, bottom] = viewport.borderInset.peek() ?? [
		0,
		0,
		0,
		0
	];
	const local = viewport.worldToLocal(point.clone());
	const x = (local.x + .5) * size[0];
	const y = (.5 - local.y) * size[1] - top;
	const height = size[1] - top - bottom;
	if (x < size[0] - right - width || x > size[0] - right || y < 0 || y > height) return;
	const thumb = Math.max(width, height * height / (height + maximum));
	const travel = height - thumb;
	if (travel <= 0) return void 0;
	const offset = viewport.scrollPosition.peek()[1];
	const start = offset / maximum * travel;
	return {
		offset: y >= start && y <= start + thumb ? offset : Math.max(0, Math.min(maximum, (y - thumb / 2) * maximum / travel)),
		scale: maximum / travel
	};
}
var MIN_AREA_VECTOR_LENGTH_SQ = 1e-20;
/** Shares mounted clipping geometry between ray hits, touch, and scene context. */
var UIHitRegion = class {
	constructor(node) {
		this.node = node;
		this.containsPoint = (point, padding = 0) => {
			const node = this.node;
			if (!this.available()) return false;
			node.updateWorldMatrix(true, false);
			if (Math.abs(node.matrixWorld.determinant()) < Number.EPSILON) return false;
			const local = node.worldToLocal(point.clone());
			const xScale = new Vector3().setFromMatrixColumn(node.matrixWorld, 0).length();
			const yScale = new Vector3().setFromMatrixColumn(node.matrixWorld, 1).length();
			if (Math.abs(local.x) > .5 + padding / xScale || Math.abs(local.y) > .5 + padding / yScale) return false;
			const global = point.clone().applyMatrix4(this.globalToWorld().invert());
			return this.planes().every((plane) => plane.distanceToPoint(global) >= -1e-9);
		};
		this.bounds = (target) => {
			if (!this.available()) return null;
			const panel = this.node.globalPanelMatrix.peek();
			if (!panel) return null;
			let polygon = [
				new Vector3(-.5, -.5, 0),
				new Vector3(.5, -.5, 0),
				new Vector3(.5, .5, 0),
				new Vector3(-.5, .5, 0)
			].map((point) => point.applyMatrix4(panel));
			for (const plane of this.planes()) polygon = clipPolygon(polygon, plane);
			if (polygon.length < 3) return null;
			const area = new Vector3();
			for (let i = 1; i + 1 < polygon.length; i++) area.add(polygon[i].clone().sub(polygon[0]).cross(polygon[i + 1].clone().sub(polygon[0])));
			if (area.lengthSq() < MIN_AREA_VECTOR_LENGTH_SQ) return null;
			const matrix = this.globalToWorld();
			target.makeEmpty();
			for (const point of polygon) target.expandByPoint(point.applyMatrix4(matrix));
			return target;
		};
	}
	available() {
		const size = this.node.size.peek();
		return Boolean(this.node.visible && this.node.displayed.peek() && !this.node.isClipped.peek() && size && size[0] > 0 && size[1] > 0);
	}
	planes() {
		return this.node.parentContainer.peek()?.clippingRect.peek()?.planes ?? [];
	}
	globalToWorld() {
		const root = this.node.root.peek().component;
		root.parent?.updateWorldMatrix(true, false);
		root.updateMatrix();
		const matrix = root.matrix.clone();
		if (root.parent) matrix.premultiply(root.parent.matrixWorld);
		return matrix;
	}
};
function clipPolygon(polygon, plane) {
	const result = [];
	for (let i = 0; i < polygon.length; i++) {
		const a = polygon[i];
		const b = polygon[(i + 1) % polygon.length];
		const da = plane.distanceToPoint(a);
		const db = plane.distanceToPoint(b);
		if (da >= 0) result.push(a);
		if (da < 0 !== db < 0) result.push(a.clone().lerp(b, da / (da - db)));
	}
	return result;
}
var IME_COMPOSITION_KEY_CODE = 229;
var editors = /* @__PURE__ */ new Set();
var focusedEditor;
/**
* Owns the hidden native element that performs real text editing.
*
* The native control stays authoritative for physical keyboards, IME, and
* clipboard. This class only mirrors its results into the retained field and
* exposes the narrow operations a virtual keyboard or automation needs.
*/
var TextInputEditor = class {
	constructor(field, presentation) {
		this.field = field;
		this.presentation = presentation;
		this.listeners = [];
		this.available = true;
		this.disposed = false;
		this.composing = false;
		this.nativeKeyboardSuppressed = false;
		this.element = createEditingElement(field);
		this.host = bindTextInput(field, this.createBinding());
		document.body.appendChild(this.element);
		this.listen("input", () => this.host.notifyInput(this.element.value));
		this.listen("compositionstart", () => this.composing = true);
		this.listen("compositionend", () => {
			this.composing = false;
			this.host.notifyInput(this.element.value);
		});
		this.listen("keydown", (event) => this.handleKeyDown(event));
		this.listen("focus", () => {
			setFocusedEditor(this);
			this.host.notifyFocus();
			this.presentation.reveal?.();
		});
		this.listen("blur", () => {
			if (focusedEditor === this) setFocusedEditor(void 0);
			this.anchor = void 0;
			this.host.notifyBlur();
		});
		editors.add(this);
		this.sync(true);
	}
	/**
	* Applies retained field state to the native control.
	*
	* Pass false for hidden or unmounted fields, which also releases focus.
	* Clipping alone is not an unmounted state.
	*/
	sync(available = true) {
		if (this.disposed) return;
		this.available = available;
		const element = this.element;
		if (!available) {
			this.releaseFocus();
			element.disabled = true;
			return;
		}
		const field = this.field;
		if (field.disabled) this.releaseFocus();
		element.disabled = field.disabled;
		element.tabIndex = this.presentation.isReady() ? 0 : -1;
		element.readOnly = field.readOnly;
		this.syncKeyboardPolicy();
		element.placeholder = field.placeholder;
		element.setAttribute("aria-label", field.ariaLabel);
		if (field.maxLength === void 0) element.removeAttribute("maxlength");
		else element.maxLength = field.maxLength;
		if (element.value !== field.value) element.value = field.value;
	}
	dispose() {
		if (this.disposed) return;
		this.releaseFocus();
		for (const [type, listener] of this.listeners) this.element.removeEventListener(type, listener);
		this.listeners.length = 0;
		this.element.remove();
		this.disposed = true;
		this.available = false;
		editors.delete(this);
		if (focusedEditor === this) setFocusedEditor(void 0);
		this.host.unbind();
	}
	/** Blurs the focused field unless the pointer target preserves its focus. */
	static handlePointerTarget(target) {
		const editor = focusedEditor;
		if (!editor) return;
		if (target && preservesFocus(editor.field, target)) return;
		editor.element.blur();
	}
	/**
	* Suppresses the browser's default canvas blur while a field is focused.
	*
	* Propagation is untouched, and unrelated DOM controls keep their default
	* behavior because only events targeting the canvas are prevented.
	*/
	static guardCanvas(canvas) {
		const guard = (event) => {
			if (!focusedEditor) return;
			if (event.target !== canvas) return;
			event.preventDefault();
		};
		canvas.addEventListener("pointerdown", guard);
		canvas.addEventListener("mousedown", guard);
		let removed = false;
		return () => {
			if (removed) return;
			removed = true;
			canvas.removeEventListener("pointerdown", guard);
			canvas.removeEventListener("mousedown", guard);
		};
	}
	listen(type, listener) {
		this.element.addEventListener(type, listener);
		this.listeners.push([type, listener]);
	}
	createBinding() {
		return {
			isReady: () => this.isReady(),
			getError: () => this.presentation.getError?.(),
			applyValue: (value) => {
				if (this.element.value === value) return;
				const selection = this.getSelection();
				this.element.value = value;
				if (selection) this.setSelectionRange(selection.start, selection.end, selection.direction);
			},
			applyOptions: () => this.sync(this.available),
			getSelection: () => this.getSelection(),
			setSelectionRange: (start, end, direction) => this.setSelectionRange(start, end, direction),
			focus: () => this.focusElement(),
			blur: () => this.element.blur(),
			insertText: (text) => void this.replaceSelection(text),
			pressKey: (key, modifiers) => this.pressKey(key, modifiers),
			begin: (input) => this.beginPointer(input),
			update: (input) => this.updatePointer(input),
			complete: () => this.anchor = void 0,
			cancel: () => this.anchor = void 0,
			getScroll: () => this.presentation.scroll
		};
	}
	isReady() {
		return !this.disposed && this.available && this.presentation.isReady();
	}
	canFocus() {
		return this.isReady() && !this.field.disabled;
	}
	syncKeyboardPolicy() {
		const suppressed = this.field.nativeKeyboardSuppressed;
		if (suppressed === this.nativeKeyboardSuppressed) return;
		this.nativeKeyboardSuppressed = suppressed;
		if (!suppressed) {
			this.element.removeAttribute("inputmode");
			this.element.removeAttribute("virtualkeyboardpolicy");
			return;
		}
		this.element.inputMode = "none";
		this.element.setAttribute("virtualkeyboardpolicy", "manual");
		if (document.activeElement !== this.element) return;
		const keyboard = "virtualKeyboard" in navigator ? navigator.virtualKeyboard : void 0;
		if (keyboard && typeof keyboard === "object" && "hide" in keyboard && typeof keyboard.hide === "function") keyboard.hide();
	}
	releaseFocus() {
		if (focusedEditor === this || document.activeElement === this.element) this.element.blur();
	}
	getSelection() {
		const { selectionStart, selectionEnd, selectionDirection } = this.element;
		if (selectionStart == null || selectionEnd == null) return void 0;
		return {
			start: selectionStart,
			end: selectionEnd,
			direction: selectionDirection ?? "none"
		};
	}
	setSelectionRange(start, end, direction) {
		this.element.setSelectionRange(Math.max(0, start), Math.max(0, end), direction);
	}
	handleKeyDown(event) {
		const composing = this.composing || event.isComposing || event.keyCode === IME_COMPOSITION_KEY_CODE;
		if (composing) return;
		if (this.presentation.handleKeyDown?.(event)) return;
		if (event.key === "Escape" && !composing) {
			event.preventDefault();
			this.element.blur();
			return;
		}
		if (event.key !== "Enter" || composing) return;
		if (!this.field.multiline) {
			event.preventDefault();
			this.host.notifySubmit();
			return;
		}
		if (event.ctrlKey || event.metaKey) {
			event.preventDefault();
			this.host.notifySubmit();
		}
	}
	pressKey(key, modifiers = {}) {
		if (!this.isReady() || this.field.disabled || this.composing) return false;
		switch (key) {
			case "Tab": return this.navigate(modifiers.shiftKey === true);
			case "Enter":
				if (!this.field.multiline || modifiers.ctrlKey === true || modifiers.metaKey === true) {
					this.host.notifySubmit();
					return true;
				}
				return this.replaceSelection("\n");
			case "Backspace": return this.deleteAtCaret("backward");
			case "Delete": return this.deleteAtCaret("forward");
			case "Escape":
				this.element.blur();
				return true;
			default:
				if (countGraphemes(key) !== 1) return false;
				return this.replaceSelection(key);
		}
	}
	navigate(backward) {
		const eligible = [...editors].filter((editor) => editor.canFocus());
		const index = eligible.indexOf(this);
		if (index < 0) return false;
		const next = eligible[backward ? index - 1 : index + 1];
		if (!next) {
			this.element.blur();
			return true;
		}
		next.focusElement();
		return true;
	}
	beginPointer(input) {
		if (!this.canFocus()) return;
		const index = this.presentation.caretAtPoint(input.point);
		this.anchor = index;
		this.focusElement();
		if (index !== void 0) this.setSelectionRange(index, index, "none");
	}
	updatePointer(input) {
		if (this.anchor === void 0 || !this.isReady()) return;
		const index = this.presentation.caretAtPoint(input.point);
		if (index === void 0) return;
		const anchor = this.anchor;
		this.setSelectionRange(Math.min(anchor, index), Math.max(anchor, index), anchor <= index ? "forward" : "backward");
	}
	deleteAtCaret(direction) {
		const value = this.element.value;
		const selection = this.getSelection() ?? {
			start: value.length,
			end: value.length,
			direction: "none"
		};
		if (selection.start !== selection.end) return this.replaceSelection("");
		const containing = containingGrapheme(value, selection.start);
		if (containing) return this.replaceRange(containing.start, containing.end, "");
		if (direction === "backward") {
			if (selection.start === 0) return false;
			const start = graphemeBoundaryBefore(value, selection.start);
			return this.replaceRange(start, selection.end, "");
		}
		if (selection.end >= value.length) return false;
		const end = graphemeBoundaryAfter(value, selection.end);
		return this.replaceRange(selection.start, end, "");
	}
	replaceSelection(text) {
		const value = this.element.value;
		const selection = this.getSelection();
		const start = selection?.start ?? value.length;
		const end = selection?.end ?? value.length;
		return this.replaceRange(start, end, text);
	}
	replaceRange(start, end, text) {
		if (!this.isReady() || this.field.disabled || this.field.readOnly || this.composing) return false;
		const element = this.element;
		const value = element.value;
		const from = Math.min(Math.max(0, start), value.length);
		const to = Math.min(Math.max(from, end), value.length);
		const insertion = clampInsertion(normalizeTextInputValue(text, this.field.multiline), value.length - (to - from), this.field.maxLength);
		const next = value.slice(0, from) + insertion + value.slice(to);
		if (next === value) return false;
		element.value = next;
		const caret = from + insertion.length;
		element.setSelectionRange(caret, caret, "none");
		this.host.notifyInput(element.value);
		return true;
	}
	focusElement() {
		this.element.focus();
		if (document.activeElement !== this.element) throw new Error("The browser did not focus the text field.");
	}
};
function setFocusedEditor(editor) {
	focusedEditor = editor;
}
function createEditingElement(field) {
	const element = field.multiline ? document.createElement("textarea") : document.createElement("input");
	if (element instanceof HTMLInputElement) element.type = "text";
	element.spellcheck = false;
	element.setAttribute("autocomplete", "off");
	element.setAttribute("autocorrect", "off");
	element.setAttribute("autocapitalize", "off");
	element.setAttribute("aria-label", field.ariaLabel);
	const style = element.style;
	style.setProperty("position", "fixed");
	style.setProperty("left", "0");
	style.setProperty("top", "0");
	style.setProperty("width", "1px");
	style.setProperty("height", "1px");
	style.setProperty("padding", "0");
	style.setProperty("border", "0");
	style.setProperty("outline", "none");
	style.setProperty("opacity", "0");
	style.setProperty("z-index", "-1");
	style.setProperty("pointer-events", "none");
	style.setProperty("caret-color", "transparent");
	return element;
}
function preservesFocus(field, target) {
	let node = target;
	while (node) {
		if (node === field) return true;
		if (node.xb?.preserveTextFocus) return true;
		node = node.parent;
	}
	return false;
}
function clampInsertion(text, retainedLength, maxLength) {
	if (maxLength === void 0) return text;
	const remaining = maxLength - retainedLength;
	if (remaining <= 0) return "";
	if (text.length <= remaining) return text;
	return truncateToGrapheme(text, remaining);
}
var graphemeSegmenter;
function getGraphemeSegmenter() {
	if (graphemeSegmenter === void 0) graphemeSegmenter = typeof Intl !== "undefined" && typeof Intl.Segmenter === "function" ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
	return graphemeSegmenter;
}
function countGraphemes(value) {
	const segmenter = getGraphemeSegmenter();
	if (!segmenter) return [...value].length;
	let count = 0;
	for (const _segment of segmenter.segment(value)) count++;
	return count;
}
function containingGrapheme(value, index) {
	const segmenter = getGraphemeSegmenter();
	if (!segmenter) return void 0;
	for (const { index: start, segment } of segmenter.segment(value)) {
		const end = start + segment.length;
		if (start < index && index < end) return {
			start,
			end
		};
		if (start >= index) break;
	}
}
/** Returns the cluster-safe offset preceding a UTF-16 caret position. */
function graphemeBoundaryBefore(value, index) {
	if (index <= 0) return 0;
	const segmenter = getGraphemeSegmenter();
	if (!segmenter) return codePointBoundaryBefore(value, index);
	let boundary = 0;
	for (const { index: start } of segmenter.segment(value)) {
		if (start >= index) break;
		boundary = start;
	}
	return boundary;
}
/** Returns the cluster-safe offset following a UTF-16 caret position. */
function graphemeBoundaryAfter(value, index) {
	if (index >= value.length) return value.length;
	const segmenter = getGraphemeSegmenter();
	if (!segmenter) return codePointBoundaryAfter(value, index);
	for (const { index: start, segment } of segmenter.segment(value)) {
		const end = start + segment.length;
		if (end > index) return end;
	}
	return value.length;
}
function codePointBoundaryBefore(value, index) {
	const code = value.charCodeAt(index - 1);
	return Math.max(0, index - (code >= 56320 && code <= 57343 && index >= 2 ? 2 : 1));
}
function codePointBoundaryAfter(value, index) {
	const code = value.charCodeAt(index);
	const isLeadSurrogate = code >= 55296 && code <= 56319;
	return Math.min(value.length, index + (isLeadSurrogate ? 2 : 1));
}
function truncateToGrapheme(value, limit) {
	const boundary = graphemeBoundaryBefore(value, limit + 1);
	return value.slice(0, Math.min(boundary, limit));
}
var CARET_BLINK_INTERVAL_SECONDS = .5;
var TEXT_DEPTH_OFFSET = -1;
/** The native editor stays light; glyph rendering loads only for editable fields. */
var TextFieldPresentation = class {
	constructor(field, shell, changed) {
		this.field = field;
		this.shell = shell;
		this.changed = changed;
		this.row = new Container({
			width: "100%",
			flexGrow: 1,
			flexShrink: 1,
			flexBasis: 0,
			minHeight: 0,
			flexDirection: "row",
			alignItems: "stretch"
		});
		this.viewport = new Container({
			flexGrow: 1,
			flexBasis: 0,
			minWidth: 0,
			height: "100%",
			overflow: "hidden"
		});
		this.scrollbar = new Container({
			width: 8,
			height: "100%",
			flexShrink: 0,
			overflow: "scroll",
			scrollbarWidth: 8,
			pointerEvents: "none"
		});
		this.spacer = new Container({
			width: 8,
			height: 0,
			flexShrink: 0
		});
		this.available = true;
		this.active = true;
		this.disposed = false;
		this.elapsed = 0;
		this.selectionKey = "";
		this.contentHeight = -1;
		shell.add(this.row);
		this.row.add(this.viewport, this.scrollbar);
		this.scrollbar.add(this.spacer);
		this.scrollbar.setProperties({ display: field.multiline ? "flex" : "none" });
		this.editor = new TextInputEditor(field, {
			caretAtPoint: (point) => this.editable?.caretAtPoint(point),
			isReady: () => this.editable?.isReady === true && this.hasLayout(),
			getError: () => this.error,
			reveal: () => this.revealField(),
			handleKeyDown: (event) => this.handleKeyDown(event),
			scroll: field.multiline ? {
				getOffset: () => this.editable?.offsetY ?? 0,
				getViewportHeight: () => this.editable?.scroll.getViewportHeight() ?? 0,
				projectPoint: (point) => this.projectPoint(point),
				scrollBy: (delta) => this.editable?.scrollBy(delta) ?? false,
				scrollbarHit: (point) => field.multiline ? scrollbarHit(this.scrollbar, point) : void 0
			} : void 0
		});
		__vitePreload(async () => {
			const { EditableText: Presentation } = await import("./EditableText-BSFvblcj.js");
			return { EditableText: Presentation };
		}, __vite__mapDeps([0,1,2])).then(({ EditableText: Presentation }) => {
			if (this.disposed) return;
			this.editable = new Presentation(this.viewport, {
				onError: (failure) => this.reportFailure(failure),
				onLayout: () => {
					if (this.disposed) return;
					this.error = void 0;
					this.editor.sync(this.available);
					this.changed();
				}
			});
			this.update();
			this.changed();
		}).catch((cause) => {
			if (this.disposed) return;
			this.reportFailure({
				kind: "layout-failed",
				message: "Editable text could not be initialized. Deploy the complete XR Blocks build directory.",
				cause
			});
		});
	}
	commit(theme) {
		this.theme = theme;
		this.scrollbar.setProperties({ scrollbarColor: theme.colors.outline });
		this.update();
	}
	update(deltaSeconds = 0) {
		if (this.disposed) return;
		this.available = this.active && this.publiclyVisible();
		this.editor.sync(this.available);
		const editable = this.editable;
		if (!editable || !this.theme || !this.hasLayout()) return;
		const selection = this.field.selection;
		const key = `${this.field.focused}|${selection?.start}|${selection?.end}|${this.field.value.length}`;
		if (key !== this.selectionKey) {
			this.selectionKey = key;
			this.elapsed = 0;
		} else this.elapsed += Math.max(0, deltaSeconds);
		const properties = this.shell.properties.peek();
		const fontSize = typeof properties.fontSize === "number" ? properties.fontSize : Number.parseFloat(properties.fontSize);
		const size = this.viewport.size.peek();
		const lineHeight = lineHeightRatio(properties.lineHeight, fontSize);
		const fontWeight = properties.fontWeight;
		const color = properties.color;
		const state = {
			text: this.field.value,
			placeholder: this.field.placeholder,
			multiline: this.field.multiline,
			focused: this.field.focused,
			caretVisible: Math.floor(this.elapsed / CARET_BLINK_INTERVAL_SECONDS) % 2 === 0,
			selectionStart: selection?.start,
			selectionEnd: selection?.end,
			selectionDirection: selection?.direction,
			fontSize,
			lineHeight,
			fontWeight: typeof fontWeight === "number" || fontWeight === "medium" || fontWeight === "bold" ? fontWeight : "normal",
			textAlign: properties.textAlign === "center" || properties.textAlign === "right" ? properties.textAlign : "left",
			color: typeof color === "string" || typeof color === "number" || color instanceof Color ? color : this.field.disabled ? this.theme.colors.disabledText : this.theme.colors.text,
			placeholderColor: this.theme.colors.secondaryText,
			caretColor: this.theme.colors.primary,
			selectionColor: this.theme.colors.primary,
			opacity: typeof properties.opacity === "string" ? Number.parseFloat(properties.opacity) / 100 : properties.opacity,
			depthTest: properties.depthTest,
			depthOffset: TEXT_DEPTH_OFFSET,
			renderOrder: this.shell.renderOrder
		};
		const nativeStyle = this.editor.element.style;
		nativeStyle.width = `${size[0]}px`;
		nativeStyle.height = `${size[1]}px`;
		nativeStyle.font = fontShorthand(fontSize, state.fontWeight);
		nativeStyle.lineHeight = String(lineHeight);
		nativeStyle.fontKerning = "normal";
		nativeStyle.fontVariantLigatures = "normal";
		nativeStyle.tabSize = String(4);
		nativeStyle.textAlign = state.textAlign ?? "left";
		this.editor.element.dir = state.direction ?? "auto";
		editable.afterLayout();
		editable.update(state);
		this.editor.sync(this.available);
		if (this.contentHeight !== editable.scrollHeight) {
			this.contentHeight = editable.scrollHeight;
			this.spacer.setProperties({ height: this.contentHeight });
		}
		this.scrollbar.scrollVelocity.set(0, 0);
		if (this.scrollbar.scrollPosition.peek()[1] !== editable.offsetY) this.scrollbar.scrollPosition.value = [0, editable.offsetY];
	}
	setActive(active) {
		this.active = active;
		if (!active) {
			this.available = false;
			this.editor.sync(false);
		}
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = true;
		this.editor.dispose();
		this.editable?.dispose();
		for (const node of [
			this.spacer,
			this.scrollbar,
			this.viewport,
			this.row
		]) {
			node.removeFromParent();
			node.dispose();
		}
	}
	hasLayout() {
		const size = this.viewport.size.peek();
		return Boolean(size && size[0] > 0 && size[1] > 0);
	}
	projectPoint(point) {
		const size = this.viewport.size.peek();
		if (!size || !this.hasLayout()) return void 0;
		const local = this.viewport.worldToLocal(point.clone());
		return new Vector2((local.x + .5) * size[0], (.5 - local.y) * size[1]);
	}
	publiclyVisible() {
		let object = this.field;
		while (object) {
			if (!object.visible || isUIElement(object) && object.style.display === "none") return false;
			object = object.parent;
		}
		return this.field.parent !== null;
	}
	revealField() {
		let parent = this.field.parent;
		while (parent) {
			if (parent instanceof UIScrollView && parent.ready) parent.reveal(this.field);
			parent = parent.parent;
		}
	}
	handleKeyDown(event) {
		if (event.ctrlKey || event.metaKey || event.altKey || !isNavigationKey(event.key)) return false;
		this.update();
		const next = this.editable?.navigate(event.key, { extend: event.shiftKey });
		if (!next) return false;
		event.preventDefault();
		this.field.setSelectionRange(next.start, next.end, next.direction);
		this.update();
		return true;
	}
	reportFailure(failure) {
		this.error = new Error(failure.message, { cause: failure.cause });
		console.error("XR Blocks editable text:", this.error);
		this.changed();
	}
};
function isNavigationKey(key) {
	return key === "ArrowUp" || key === "ArrowDown" || key === "Home" || key === "End";
}
function lineHeightRatio(value, fontSize) {
	if (typeof value === "number") return value;
	if (value.endsWith("%")) return Number.parseFloat(value) / 100;
	if (value.endsWith("px")) return Number.parseFloat(value) / fontSize;
	return DEFAULT_TEXT_LINE_HEIGHT;
}
await ensureWebGPUUIMaterials();
var ICON_BASE = "https://cdn.jsdelivr.net/gh/marella/material-symbols@v0.33.0/svg/";
var OVERLAY_RENDER_ORDER_BASE = 1e9;
var OVERLAY_Z_INDEX_STEP = 1e8;
var OVERLAY_ROOT_ORDER_STEP = 1e6;
var CARD_SIZE_PROPERTY_KEYS = /* @__PURE__ */ new Set([
	"width",
	"height",
	"sizeX",
	"sizeY"
]);
var imageTextureLoader = new TextureLoader();
var UIKitMount = class {
	constructor(root, icons) {
		this.root = root;
		this.icons = icons;
		this.object = new Group();
		this.readyWork = [];
		this.structureRevision = -1;
		this.hitMappingsChanged = true;
		this.disposed = false;
		this.viewportWidth = -1;
		this.viewportHeight = -1;
		this.enqueue = (work) => {
			if (!this.disposed) this.readyWork.push(work);
		};
		this.object.name = `Private ${root.name}`;
		this.isOverlay = getUIElementKind(root) === "overlay";
	}
	prepareCommit() {
		if (this.structureRevision !== getUIStructureRevision(this.root)) this.binding?.removeDetachedChildren();
	}
	commit(theme, viewport, rootOrder) {
		if (this.disposed) return void 0;
		this.prepareCommit();
		for (const work of this.readyWork.splice(0)) work();
		const context = {
			theme,
			rootStack: this.isOverlay ? OVERLAY_RENDER_ORDER_BASE + Number(this.root.style.zIndex ?? 0) * OVERLAY_Z_INDEX_STEP + rootOrder * OVERLAY_ROOT_ORDER_STEP : void 0,
			sequence: { value: 0 }
		};
		if (!this.binding) {
			this.binding = new UIKitNodeBinding(this.root, this.icons, this.enqueue, context);
			this.rendered = this.isOverlay ? createOverlayViewport(this.binding.node, viewport) : this.binding.node;
			this.viewportWidth = viewport.width;
			this.viewportHeight = viewport.height;
			this.structureRevision = getUIStructureRevision(this.root);
			this.object.add(this.rendered);
			this.hitMappingsChanged = true;
			if (this.root instanceof UICard) {
				const card = this.root;
				setUICardContentMeasurer(card, {
					height: (width) => this.measureCardContentHeight(card, width),
					minWidth: () => this.measureCardMinContentWidth(card)
				});
			}
		}
		const structureRevision = getUIStructureRevision(this.root);
		if (this.structureRevision !== structureRevision) {
			this.binding.reconcileTree(context);
			this.structureRevision = structureRevision;
			this.hitMappingsChanged = true;
			this.cachedMinContentWidth = void 0;
		}
		if (this.isOverlay) this.updateViewport(viewport);
		context.sequence.value = 0;
		const commitResult = this.binding.commit(context);
		if (commitResult.hitMappingsChanged) this.hitMappingsChanged = true;
		if (commitResult.contentChanged) this.cachedMinContentWidth = void 0;
		if (!this.hitMappingsChanged) return void 0;
		this.hitMappingsChanged = false;
		return this.binding.hitMappings();
	}
	present(stateFor) {
		this.binding?.present(stateFor);
	}
	update(deltaSeconds) {
		this.rendered?.update(deltaSeconds * 1e3);
		this.binding?.afterLayout(deltaSeconds);
		if (!(this.root instanceof UICard) || !this.binding) return;
		const size = this.binding.node.size.peek();
		if (!validPair(size)) return;
		setResolvedUICardSize(this.root, {
			width: size[0] * this.root.pixelSize,
			height: size[1] * this.root.pixelSize
		});
	}
	validate() {
		const issues = [];
		for (const [element, node] of this.binding?.elementNodes() ?? []) {
			const size = node.size.peek();
			const center = node.relativeCenter.peek();
			if (!validPair(size) || node.parentContainer.peek() && !validPair(center)) {
				issues.push({
					code: "invalid-layout",
					severity: "error",
					element,
					message: `${element.name} does not have a finite calculated layout.`
				});
				continue;
			}
			if (element instanceof UIText && node.isClipped.peek() && !hasScrollAncestor(element)) issues.push({
				code: "text-clipped",
				severity: "error",
				element,
				message: `${element.name} is clipped by its layout container.`
			});
			const parent = node.parentContainer.peek();
			const parentSize = parent?.size.peek();
			if (!parent || !validPair(parentSize) || !center) continue;
			const bounds = boundsFromCenter(center, size);
			const containerBounds = contentBounds(parent);
			if (containsBounds(containerBounds, bounds)) continue;
			const overlayRoot = element === this.root && this.isOverlay;
			issues.push({
				code: overlayRoot ? "outside-viewport" : "content-overflow",
				severity: overlayRoot ? "error" : "warning",
				element,
				message: overlayRoot ? `${element.name} extends outside the overlay viewport.` : `${element.name} extends outside its layout container.`,
				bounds,
				containerBounds
			});
		}
		return issues;
	}
	dispose() {
		this.disposed = true;
		this.readyWork.length = 0;
		if (this.root instanceof UICard) setUICardContentMeasurer(this.root, void 0);
		const binding = this.binding;
		const rendered = this.rendered;
		binding?.dispose();
		if (rendered && rendered !== binding?.node) {
			rendered.removeFromParent();
			rendered.dispose();
		}
		this.binding = void 0;
		this.rendered = void 0;
		this.object.clear();
	}
	setActive(active) {
		this.binding?.setActive(active);
	}
	/**
	* Lays the card out once at `width` with an automatic height, reads the
	* natural height, then restores the committed layout.
	*/
	measureCardContentHeight(card, width) {
		if (!(width > 0)) return void 0;
		const height = this.withAutoHeightLayout((yoga) => {
			yoga.setWidth(width / card.pixelSize);
			yoga.calculateLayout(void 0, void 0);
			return yoga.getComputedHeight() * card.pixelSize;
		});
		return height !== void 0 && Number.isFinite(height) && height > 0 ? height : void 0;
	}
	/**
	* Finds the narrowest width at which no content overflows its container,
	* searching between zero and the current width. Words never break, so text
	* that no longer fits overflows and narrows the search.
	*/
	measureCardMinContentWidth(card) {
		const current = card.size.width / card.pixelSize;
		if (!(current > 0)) return void 0;
		if (this.cachedMinContentWidth !== void 0 && this.cachedMinContentWidth <= current * card.pixelSize) return this.cachedMinContentWidth;
		const width = this.withAutoHeightLayout((yoga) => {
			const overflowsAt = (value) => {
				yoga.setWidth(value);
				yoga.calculateLayout(void 0, void 0);
				return yogaContentOverflows(yoga);
			};
			if (overflowsAt(current)) return current;
			let fits = current;
			let overflows = 0;
			while (fits - overflows > MIN_WIDTH_SEARCH_PRECISION) {
				const middle = (fits + overflows) / 2;
				if (overflowsAt(middle)) overflows = middle;
				else fits = middle;
			}
			const horizontalBorder = yoga.getComputedBorder(0) + yoga.getComputedBorder(2);
			return Math.max(0, fits - horizontalBorder);
		});
		if (width === void 0) return void 0;
		const measured = width * card.pixelSize;
		this.cachedMinContentWidth = measured;
		return measured;
	}
	/** Runs `measure` on the root yoga node, then restores the committed layout. */
	withAutoHeightLayout(measure) {
		const yoga = (this.binding?.node.node)?.yogaNode;
		if (!yoga) return void 0;
		const previousWidth = yoga.getWidth();
		const previousHeight = yoga.getHeight();
		try {
			yoga.setHeightAuto();
			return measure(yoga);
		} finally {
			yoga.setWidth(yogaDimension(previousWidth));
			yoga.setHeight(yogaDimension(previousHeight));
		}
	}
	updateViewport(viewport) {
		const wrapper = this.rendered;
		if (!wrapper || this.viewportWidth === viewport.width && this.viewportHeight === viewport.height) return;
		this.viewportWidth = viewport.width;
		this.viewportHeight = viewport.height;
		wrapper.setProperties({
			width: viewport.width,
			height: viewport.height,
			sizeX: viewport.width,
			sizeY: viewport.height
		});
	}
};
var UIKitBackend = class {
	constructor() {
		this.icons = new IconCache();
		this.previousLocalClippingEnabled = false;
	}
	configureRenderer(renderer) {
		if (this.renderer === renderer) return;
		this.restoreRenderer();
		this.renderer = renderer;
		this.releaseFocusGuard = TextInputEditor.guardCanvas(renderer.domElement);
		if ("localClippingEnabled" in renderer) {
			this.previousLocalClippingEnabled = renderer.localClippingEnabled;
			renderer.localClippingEnabled = true;
		}
		renderer.setTransparentSort(reversePainterSortStable);
	}
	createMount(root) {
		return new UIKitMount(root, this.icons);
	}
	handlePointerTarget(target) {
		TextInputEditor.handlePointerTarget(target);
	}
	dispose() {
		this.restoreRenderer();
		this.icons.dispose();
	}
	restoreRenderer() {
		this.releaseFocusGuard?.();
		this.releaseFocusGuard = void 0;
		if (!this.renderer) return;
		if ("localClippingEnabled" in this.renderer) this.renderer.localClippingEnabled = this.previousLocalClippingEnabled;
		this.renderer = void 0;
	}
};
var YOGA_UNIT_POINT = 1;
var YOGA_UNIT_PERCENT = 2;
var YOGA_UNIT_AUTO = 3;
var YOGA_EDGE_LEFT = 0;
var YOGA_EDGE_RIGHT = 2;
var YOGA_POSITION_ABSOLUTE = 2;
var OVERFLOW_TOLERANCE = .5;
var MIN_WIDTH_SEARCH_PRECISION = 1;
/** True when any in-flow node extends past either side of its parent's content box. */
function yogaContentOverflows(node) {
	const left = node.getComputedPadding(YOGA_EDGE_LEFT) + node.getComputedBorder(YOGA_EDGE_LEFT) - OVERFLOW_TOLERANCE;
	const right = node.getComputedWidth() - node.getComputedPadding(YOGA_EDGE_RIGHT) - node.getComputedBorder(YOGA_EDGE_RIGHT) + OVERFLOW_TOLERANCE;
	for (let index = 0; index < node.getChildCount(); index++) {
		const child = node.getChild(index);
		if (child.getPositionType() === YOGA_POSITION_ABSOLUTE) continue;
		const childLeft = child.getComputedLeft();
		if (childLeft < left || childLeft + child.getComputedWidth() > right) return true;
		if (yogaContentOverflows(child)) return true;
	}
	return false;
}
function yogaDimension({ unit, value }) {
	if (unit === YOGA_UNIT_POINT) return value;
	if (unit === YOGA_UNIT_PERCENT) return `${value}%`;
	if (unit === YOGA_UNIT_AUTO) return "auto";
}
function createUIBackend() {
	return new UIKitBackend();
}
/** A retained physical node and the small private subtree it owns. */
var UIKitNodeBinding = class UIKitNodeBinding {
	constructor(element, icons, enqueue, context) {
		this.element = element;
		this.icons = icons;
		this.enqueue = enqueue;
		this.children = /* @__PURE__ */ new Map();
		this.childOrder = [];
		this.cursorPoints = [new Vector3(), new Vector3()];
		this.notifyResource = () => {
			if (!this.disposed) this.enqueue(() => this.resourceRevision++);
		};
		this.contentProperties = {};
		this.ownsImageTexture = false;
		this.imageRequest = 0;
		this.resourceRevision = 0;
		this.appliedResourceRevision = -1;
		this.revision = -1;
		this.presentationKey = -1;
		this.baseProperties = {};
		this.presentedProperties = {};
		this.disposed = false;
		const properties = this.propertiesFor(context, baseState(element), void 0);
		const kind = getUIElementKind(element);
		if (kind === "text") this.node = new AdaptiveText(properties);
		else if (kind === "image") this.node = new Image(properties, void 0, { loadTexture: false });
		else if (kind === "icon") this.node = new MergedSvg(properties);
		else if (requiresGradientPanel(element, properties)) this.node = new GradientPanel(properties);
		else this.node = new Container(toContainerProperties(properties));
		if (element instanceof UIScrollView && this.node instanceof Container) this.scrollView = new ScrollViewPresentation(element, this.node);
		if (element instanceof UITextInput && this.node instanceof Container) this.textInput = new TextFieldPresentation(element, this.node, this.notifyResource);
		this.hitRegion = new UIHitRegion(this.node);
		this.unregisterPresentationObject = registerUIPresentationObject(this.element, this.node, this.hitRegion.bounds);
		this.baseProperties = properties;
		this.presentedProperties = properties;
		this.theme = context.theme;
		this.reconcileTree(context);
		this.commit(context);
	}
	removeDetachedChildren() {
		for (const [element, binding] of this.children) if (element.parent !== this.element) {
			this.children.delete(element);
			this.childOrder.splice(this.childOrder.indexOf(element), 1);
			binding.dispose();
		} else binding.removeDetachedChildren();
	}
	reconcileTree(context) {
		if (!isContainerNode(this.node)) return;
		const content = this.scrollView?.content ?? this.node;
		const nextOrder = this.element.children.filter(isUIElement);
		const next = /* @__PURE__ */ new Map();
		for (const child of nextOrder) {
			const binding = this.children.get(child) ?? new UIKitNodeBinding(child, this.icons, this.enqueue, context);
			next.set(child, binding);
		}
		for (const [element, binding] of this.children) if (!next.has(element)) binding.dispose();
		this.children.clear();
		this.childOrder.length = 0;
		for (const child of nextOrder) {
			const binding = next.get(child);
			this.children.set(child, binding);
			this.childOrder.push(child);
			content.add(binding.node);
			binding.reconcileTree(context);
		}
		this.ensurePrivateNodes(context.theme);
		this.scrollView?.commit(this.contentProperties);
		this.textInput?.commit(context.theme);
		if (this.edge) {
			this.edge.removeFromParent();
			this.node.add(this.edge);
		}
	}
	/** Returns whether physical hit mappings or layout content changed. */
	commit(context) {
		if (this.disposed) return {
			hitMappingsChanged: false,
			contentChanged: false
		};
		const order = context.rootStack === void 0 ? void 0 : context.rootStack + Number(this.element.style.zIndex ?? 0) * 1e3 + context.sequence.value++;
		const orderChanged = order !== this.renderOrder;
		const revision = getUIRevision(this.element);
		const nextPointerEvents = this.element.xb?.pointerEvents;
		const needsProperties = revision !== this.revision || context.theme !== this.theme || orderChanged || nextPointerEvents !== this.pointerEvents || this.resourceRevision !== this.appliedResourceRevision;
		let hitMappingsChanged = orderChanged;
		let contentChanged = false;
		if (needsProperties) {
			const base = baseState(this.element);
			this.renderOrder = order;
			const properties = this.propertiesFor(context, base, order);
			const changed = changedProperties(this.presentedProperties, properties);
			contentChanged = !(this.element instanceof UICard) || Object.keys(changed).some((key) => !CARD_SIZE_PROPERTY_KEYS.has(key));
			this.applyProperties(properties);
			this.baseProperties = properties;
			this.presentedProperties = properties;
			this.presentationKey = stateKey(base);
			this.revision = revision;
			this.theme = context.theme;
			this.pointerEvents = nextPointerEvents;
			this.appliedResourceRevision = this.resourceRevision;
			this.ensurePrivateNodes(context.theme);
			this.scrollView?.commit(this.contentProperties);
			this.textInput?.commit(context.theme);
			if (this.syncEdge(properties)) hitMappingsChanged = true;
		}
		this.node.visible = this.element.visible;
		this.syncImage();
		this.setHitEnabled(this.baseProperties);
		for (const child of this.childOrder) {
			const childResult = this.children.get(child).commit(context);
			if (childResult.hitMappingsChanged) hitMappingsChanged = true;
			if (childResult.contentChanged) contentChanged = true;
		}
		return {
			hitMappingsChanged,
			contentChanged
		};
	}
	present(stateFor) {
		if (this.disposed) return;
		const rawState = stateFor(this.element, this.edge ? this.cursorPoints : void 0);
		const focused = this.element instanceof UITextInput && this.element.focused;
		const key = Number(rawState.hovered) | Number(rawState.active) << 1 | Number(rawState.disabled) << 2 | Number(focused) << 3;
		if (key !== this.presentationKey) {
			const state = {
				...rawState,
				focused
			};
			const context = {
				theme: this.theme,
				rootStack: void 0,
				sequence: { value: 0 }
			};
			const properties = this.propertiesFor(context, state, this.renderOrder);
			this.applyProperties(properties);
			this.presentedProperties = properties;
			this.presentationKey = key;
			this.ensurePrivateNodes(this.theme);
			this.scrollView?.commit(this.contentProperties);
			this.textInput?.commit(this.theme);
		}
		this.edge?.setCursorPoints(rawState.cursorPointCount > 0 ? this.cursorPoints[0] : void 0, rawState.cursorPointCount > 1 ? this.cursorPoints[1] : void 0);
		for (const child of this.childOrder) this.children.get(child).present(stateFor);
	}
	hitMappings() {
		const mappings = [{
			physical: this.node,
			logical: this.element,
			options: { containsPoint: this.hitRegion.containsPoint }
		}];
		if (this.edge) {
			const edge = this.edge;
			mappings.push({
				physical: edge,
				logical: this.element,
				options: {
					containsPoint: edge.containsPoint,
					touchTarget: (point) => edge.touchTarget(point)
				}
			}, {
				physical: edge.resizeHandle,
				logical: this.element
			});
		}
		for (const child of this.childOrder) mappings.push(...this.children.get(child).hitMappings());
		return mappings;
	}
	*elementNodes() {
		yield [this.element, this.node];
		for (const child of this.childOrder) yield* this.children.get(child).elementNodes();
	}
	afterLayout(deltaSeconds) {
		this.scrollView?.afterLayout();
		this.textInput?.update(deltaSeconds);
		for (const child of this.childOrder) this.children.get(child).afterLayout(deltaSeconds);
	}
	setActive(active) {
		this.textInput?.setActive(active);
		for (const child of this.childOrder) this.children.get(child).setActive(active);
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = true;
		this.unregisterPresentationObject();
		for (const child of this.children.values()) child.dispose();
		this.children.clear();
		this.childOrder.length = 0;
		this.edge?.removeFromParent();
		this.edge?.dispose();
		this.buttonIcon?.removeFromParent();
		this.buttonIcon?.dispose();
		this.buttonLabel?.removeFromParent();
		this.buttonLabel?.dispose();
		this.sliderContent?.dispose();
		this.scrollView?.dispose();
		this.textInput?.dispose();
		if (this.ownsImageTexture) this.imageTexture?.dispose();
		this.imageTexture = void 0;
		this.node.removeFromParent();
		this.node.dispose();
	}
	propertiesFor(context, state, renderOrder) {
		const resolvedStyle = resolveStyle(this.element, state, context.theme);
		const style = toUIKitStyle(resolvedStyle);
		if (renderOrder !== void 0) {
			style.depthTest = false;
			style.depthWrite = false;
			style.renderOrder = renderOrder;
		}
		const kind = getUIElementKind(this.element);
		if (kind === "text") return {
			text: this.element.text,
			...style,
			color: style.color ?? context.theme.colors.text,
			pointerEvents: this.element.xb?.pointerEvents ?? "auto"
		};
		if (kind === "image") {
			const { cornerRadius: rawCornerRadius, ...imageStyle } = style;
			const cornerRadius = numericCornerRadius(rawCornerRadius);
			return {
				...imageStyle,
				...imageStyle.color === void 0 ? {} : { color: normalizeAlphaHexColor(imageStyle.color) },
				borderTopLeftRadius: cornerRadius,
				borderTopRightRadius: cornerRadius,
				borderBottomLeftRadius: cornerRadius,
				borderBottomRightRadius: cornerRadius,
				pointerEvents: this.element.xb?.pointerEvents ?? "auto"
			};
		}
		if (kind === "icon") return {
			content: this.icons.get(iconAssetPath(this.element), this.notifyResource),
			...style,
			...style.color === void 0 ? {} : { color: normalizeAlphaHexColor(style.color) },
			pointerEvents: this.element.xb?.pointerEvents ?? "auto"
		};
		if (kind === "scroll" || kind === "input") {
			this.contentProperties = {
				...resolvedStyle,
				color: normalizeAlphaHexColor(resolvedStyle.color) ?? normalizeAlphaHexColor(context.theme.colors.outline)
			};
			return panelDefaults(this.element, context.theme, {
				...style,
				flexDirection: "column",
				alignItems: "stretch",
				justifyContent: "flex-start",
				gapRow: 0,
				gapColumn: 0
			});
		}
		return panelDefaults(this.element, context.theme, style);
	}
	applyProperties(properties) {
		const changed = changedProperties(this.presentedProperties, properties);
		if (Object.keys(changed).length === 0) return;
		if (this.node instanceof AdaptiveText) this.node.updateTextProperties(properties);
		else if (this.node instanceof Container && !(this.node instanceof GradientPanel)) this.node.setProperties(toContainerProperties(changed));
		else this.node.setProperties(changed);
		if (this.node instanceof Image) this.node.material.opacity = resolvedOpacity(properties.opacity);
		if (this.renderOrder !== void 0) this.node.renderOrder = this.renderOrder;
	}
	ensurePrivateNodes(theme) {
		if (!isContainerNode(this.node)) return;
		const kind = getUIElementKind(this.element);
		if (kind === "button") this.updateButtonContent(theme);
		if (kind === "slider") {
			this.sliderContent ??= createSliderContent(this.node);
			this.sliderContent.update(this.element, theme);
		}
	}
	updateButtonContent(theme) {
		const button = this.element;
		const color = normalizeAlphaHexColor(this.presentedProperties.color ?? (button.disabled ? theme.colors.disabledText : theme.colors.primaryText));
		if (button.icon) {
			const properties = {
				content: this.icons.get(defaultIconAssetPath(button.icon), this.notifyResource),
				width: 24,
				height: 24,
				color,
				pointerEvents: "none"
			};
			if (!this.buttonIcon) {
				const icon = new MergedSvg(properties);
				this.buttonIcon = icon;
				this.node.add(icon);
			} else this.buttonIcon.setProperties(properties);
		} else if (this.buttonIcon) {
			this.buttonIcon.removeFromParent();
			this.buttonIcon.dispose();
			this.buttonIcon = void 0;
		}
		if (button.label) {
			const properties = {
				text: button.label,
				color,
				...nativeTextWrapping(this.presentedProperties.whiteSpace),
				pointerEvents: "none"
			};
			if (!this.buttonLabel) {
				this.buttonLabel = new Text(properties);
				this.node.add(this.buttonLabel);
			} else this.buttonLabel.setProperties(properties);
		} else if (this.buttonLabel) {
			this.buttonLabel.removeFromParent();
			this.buttonLabel.dispose();
			this.buttonLabel = void 0;
		}
	}
	syncEdge(properties) {
		if (!isContainerNode(this.node)) return false;
		const options = getUIElementKind(this.element) === "card" ? getUICardEdgeOptions(this.element) : void 0;
		if (!options && this.edge) {
			this.edge.removeFromParent();
			this.edge.dispose();
			this.edge = void 0;
			return true;
		}
		const resizable = !!options && !!normalizeManipulationConfig(this.element.xb?.manipulation)?.resize;
		if (options && !this.edge) {
			this.edge = new UICardEdge({
				cardCornerRadius: numericCornerRadius(properties.cornerRadius),
				resizable
			});
			this.node.add(this.edge);
			return true;
		}
		this.edge?.setCardCornerRadius(numericCornerRadius(properties.cornerRadius));
		this.edge?.setResizable(resizable);
		return false;
	}
	syncImage() {
		if (!(this.node instanceof Image)) return;
		const source = this.element.src;
		const sourceSize = textureSourceSize(source);
		const fit = imageObjectFit(this.presentedProperties);
		const sourceChanged = source !== this.imageSource;
		const fitChanged = fit !== this.imageFit;
		const sourceSizeChanged = sourceSize !== void 0 && (sourceSize[0] !== this.imageSourceSize?.[0] || sourceSize[1] !== this.imageSourceSize?.[1]);
		if (!sourceChanged && !fitChanged && !sourceSizeChanged) return;
		this.imageSource = source;
		this.imageSourceSize = sourceSize;
		this.imageFit = fit;
		const request = ++this.imageRequest;
		if (source instanceof Texture) {
			this.replaceImageTexture(fitTexture(source, fit), fit !== "fill");
			return;
		}
		imageTextureLoader.loadAsync(source).then((texture) => {
			texture.colorSpace = SRGBColorSpace;
			texture.matrixAutoUpdate = false;
			if (this.disposed) {
				texture.dispose();
				return;
			}
			this.enqueue(() => {
				if (this.disposed || request !== this.imageRequest || this.imageSource !== source) {
					texture.dispose();
					return;
				}
				this.replaceImageTexture(texture, true);
				this.resourceRevision++;
			});
		}).catch(() => void 0);
	}
	replaceImageTexture(texture, ownsTexture) {
		const previous = this.imageTexture;
		const previousOwned = this.ownsImageTexture;
		this.imageTexture = texture;
		this.ownsImageTexture = ownsTexture;
		const node = this.node;
		const material = node.material;
		if (material && "colorNode" in material) material.colorNode = void 0;
		node.texture.value = texture;
		if (previousOwned && previous && previous !== texture) previous.dispose();
	}
	setHitEnabled(properties) {
		const kind = getUIElementKind(this.element);
		const blocksHits = kind === "button" || kind === "slider" || kind === "scroll" || kind === "input" || !isTransparent(properties.fillColor);
		const pointerEvents = this.element.xb?.pointerEvents;
		const enabled = blocksHits && pointerEvents !== "none";
		if (pointerEvents === this.pointerEvents && enabled === this.hitEnabled) return;
		this.pointerEvents = pointerEvents;
		this.hitEnabled = enabled;
		setPhysicalHitEnabled(this.node, enabled);
	}
};
var shimmedSourceImages = /* @__PURE__ */ new WeakSet();
function imageObjectFit(properties) {
	const fit = properties.objectFit;
	return fit === "contain" || fit === "cover" ? fit : "fill";
}
/** Intrinsic size of a texture's source image, or undefined while unknown. */
function textureSourceSize(source) {
	if (!(source instanceof Texture)) return void 0;
	const image = source.image;
	if (!image) return void 0;
	const width = image.videoWidth ?? image.naturalWidth ?? image.width;
	const height = image.videoHeight ?? image.naturalHeight ?? image.height;
	return width !== void 0 && height !== void 0 && width > 0 && height > 0 ? [width, height] : void 0;
}
/**
* uikit derives its object-fit crop ratio from `source.data.width/.height`,
* which stay 0 for video elements without width/height content attributes
* (only videoWidth/videoHeight carry the frame size) — a 0/0 ratio poisons the
* crop matrix with NaN. Shadow the two getters with the intrinsic frame size so
* the crop math sees the real ratio, without touching the element's layout.
*/
function normalizeSourceImageSize(image) {
	if (shimmedSourceImages.has(image)) return;
	shimmedSourceImages.add(image);
	const source = image;
	if (!(source.videoWidth > 0) || !(source.videoHeight > 0)) return;
	try {
		Object.defineProperty(image, "width", {
			configurable: true,
			get: () => source.videoWidth
		});
		Object.defineProperty(image, "height", {
			configurable: true,
			get: () => source.videoHeight
		});
	} catch {}
}
/**
* uikit writes its object-fit crop into `texture.matrix`, but three.js
* re-derives that matrix from offset/repeat on every material refresh while
* `matrixAutoUpdate` is true, silently discarding the crop. Hand out a clone
* (sharing the same image source) with the matrix frozen so the crop survives,
* and so uikit's matrix writes never touch textures shared with the engine.
*/
function fitTexture(source, fit) {
	if (fit === "fill") return source;
	const image = source.image;
	if (image && typeof image === "object") normalizeSourceImageSize(image);
	const clone = source.clone();
	clone.matrixAutoUpdate = false;
	clone.matrix.identity();
	return clone;
}
function isContainerNode(node) {
	return node instanceof Container || node instanceof GradientPanel;
}
function hasScrollAncestor(element) {
	let parent = element.parent;
	while (parent) {
		if (parent instanceof UIScrollView) return true;
		parent = parent.parent;
	}
	return false;
}
function baseState(element) {
	return {
		hovered: false,
		active: false,
		disabled: getSemanticControl(element)?.isDisabled() ?? false,
		focused: element instanceof UITextInput && element.focused,
		cursorPointCount: 0
	};
}
function setPhysicalHitEnabled(object, enabled) {
	object.xb ??= {};
	object.xb.pointerEvents = enabled ? "auto" : "none";
}
function changedProperties(previous, next) {
	const properties = {};
	for (const [key, value] of Object.entries(next)) if (!Object.is(previous[key], value)) properties[key] = value;
	for (const key of Object.keys(previous)) if (!(key in next)) properties[key] = void 0;
	return properties;
}
function numericCornerRadius(value) {
	return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : 0;
}
function resolvedOpacity(value) {
	if (typeof value === "number") return value;
	if (typeof value === "string" && value.endsWith("%")) return Number.parseFloat(value) / 100;
	return 1;
}
function resolveStyle(element, state, theme) {
	const kind = getUIElementKind(element);
	const surfaceStyle = hasSurfaceAppearance(element) ? theme.styles?.surface ?? {} : {};
	const themeStyle = kind === "card" || kind === "overlay" ? {} : theme.styles?.[kind] ?? {};
	const style = element.style;
	return {
		...kind === "input" ? {
			backgroundColor: theme.colors.raisedSurface,
			borderColor: state.focused ? theme.colors.primary : theme.colors.outline,
			borderWidth: 1,
			borderRadius: 8,
			fontSize: 24,
			padding: 8
		} : {},
		...surfaceStyle,
		...themeStyle,
		...style,
		...state.hovered ? surfaceStyle?.[":hover"] : void 0,
		...state.hovered ? themeStyle[":hover"] : void 0,
		...state.hovered ? style[":hover"] : void 0,
		...state.active ? surfaceStyle?.[":active"] : void 0,
		...state.active ? themeStyle[":active"] : void 0,
		...state.active ? style[":active"] : void 0,
		...state.disabled ? surfaceStyle?.[":disabled"] : void 0,
		...state.disabled ? themeStyle[":disabled"] : void 0,
		...state.disabled ? style[":disabled"] : void 0,
		...state.focused ? themeStyle[":focus"] : void 0,
		...state.focused ? style[":focus"] : void 0
	};
}
function stateKey(state) {
	return Number(state.hovered) | Number(state.active) << 1 | Number(state.disabled) << 2 | Number(state.focused) << 3;
}
function isTransparent(color) {
	if (color === void 0 || color === "transparent") return true;
	if (typeof color !== "string") return false;
	const compact = color.replace(/\s/g, "").toLowerCase();
	return /^#[0-9a-f]{3}0$/u.test(compact) || /^#[0-9a-f]{6}00$/u.test(compact) || /^(?:rgba|hsla)\([^)]*,0(?:\.0+)?\)$/u.test(compact);
}
function isGradientPaint(value) {
	return typeof value === "object" && value !== null && "gradientType" in value;
}
function paintVisible(color, width) {
	if (isGradientPaint(color)) return true;
	if (isTransparent(color)) return false;
	if (color === void 0) return false;
	return typeof width !== "number" || width > 0;
}
/**
* Every surface with any visible paint renders through `GradientPanel`'s unified
* shader — the legacy, pixel-verified pipeline. Only fully invisible panels use
* uikit's instanced `Container` (a single shared draw that contributes no
* visible pixels), which keeps the draw-call reduction without changing output.
*/
function requiresGradientPanel(element, properties) {
	if (element instanceof GradientPanel) return true;
	if (paintVisible(properties.fillColor ?? properties.backgroundColor)) return true;
	const stroke = properties.strokeColor ?? properties.borderColor;
	const strokeWidth = properties.strokeWidth ?? properties.borderWidth;
	if (paintVisible(stroke, typeof strokeWidth === "number" ? strokeWidth : 1)) return true;
	if (typeof properties.innerShadowBlur === "number" && properties.innerShadowBlur > 0) return true;
	if (typeof properties.innerShadowSpread === "number" && properties.innerShadowSpread > 0) return true;
	if (typeof properties.dropShadowBlur === "number" && properties.dropShadowBlur > 0) return true;
	if (typeof properties.dropShadowSpread === "number" && properties.dropShadowSpread > 0) return true;
	if (isGradientPaint(properties.backfaceColor)) return true;
	if (properties.strokeAlign && properties.strokeAlign !== "center") return true;
	return false;
}
function toContainerProperties(properties) {
	const result = { ...properties };
	if (result.fillColor !== void 0) {
		result.backgroundColor = result.fillColor;
		delete result.fillColor;
	}
	if (result.strokeColor !== void 0) {
		result.borderColor = result.strokeColor;
		delete result.strokeColor;
	}
	if (result.strokeWidth !== void 0) {
		result.borderWidth = result.strokeWidth;
		delete result.strokeWidth;
	}
	if (result.cornerRadius !== void 0) {
		result.borderRadius = result.cornerRadius;
		delete result.cornerRadius;
	}
	delete result.innerShadowColor;
	delete result.innerShadowBlur;
	delete result.innerShadowPosition;
	delete result.innerShadowSpread;
	delete result.innerShadowFalloff;
	delete result.dropShadowColor;
	delete result.dropShadowBlur;
	delete result.dropShadowPosition;
	delete result.dropShadowSpread;
	delete result.dropShadowFalloff;
	delete result.backfaceColor;
	delete result.strokeAlign;
	for (const [key, value] of Object.entries(result)) result[key] = normalizeAlphaHexColor(value);
	return result;
}
function panelDefaults(element, theme, style) {
	const kind = getUIElementKind(element);
	const defaults = {
		fillColor: kind === "button" ? element.disabled ? theme.colors.disabledSurface : theme.colors.primary : hasSurfaceAppearance(element) ? theme.colors.surface : kind === "slider" ? "rgba(255, 255, 255, 0)" : "rgba(0, 0, 0, 0)",
		cornerRadius: theme.borderRadius,
		opacity: style.opacity ?? 1,
		strokeColor: style.strokeColor ?? "transparent",
		strokeWidth: style.strokeWidth ?? 0,
		strokeAlign: style.strokeAlign ?? DEFAULT_GRADIENT_PANEL_PROPS.strokeAlign,
		innerShadowColor: style.innerShadowColor ?? DEFAULT_GRADIENT_PANEL_PROPS.innerShadowColor,
		innerShadowBlur: style.innerShadowBlur ?? DEFAULT_GRADIENT_PANEL_PROPS.innerShadowBlur,
		innerShadowPosition: style.innerShadowPosition ?? DEFAULT_GRADIENT_PANEL_PROPS.innerShadowPosition,
		innerShadowSpread: style.innerShadowSpread ?? DEFAULT_GRADIENT_PANEL_PROPS.innerShadowSpread,
		innerShadowFalloff: style.innerShadowFalloff ?? DEFAULT_GRADIENT_PANEL_PROPS.innerShadowFalloff,
		dropShadowColor: style.dropShadowColor ?? DEFAULT_GRADIENT_PANEL_PROPS.dropShadowColor,
		dropShadowBlur: style.dropShadowBlur ?? DEFAULT_GRADIENT_PANEL_PROPS.dropShadowBlur,
		dropShadowPosition: style.dropShadowPosition ?? DEFAULT_GRADIENT_PANEL_PROPS.dropShadowPosition,
		dropShadowSpread: style.dropShadowSpread ?? DEFAULT_GRADIENT_PANEL_PROPS.dropShadowSpread,
		dropShadowFalloff: style.dropShadowFalloff ?? DEFAULT_GRADIENT_PANEL_PROPS.dropShadowFalloff,
		color: style.color,
		pointerEvents: element.xb?.pointerEvents ?? "auto",
		...style
	};
	if (kind === "card" || kind === "overlay") {
		defaults.flexDirection = style.flexDirection ?? "column";
		defaults.justifyContent = style.justifyContent ?? "center";
		defaults.alignItems = style.alignItems ?? "stretch";
	}
	if (kind === "panel") defaults.flexShrink = style.flexShrink ?? 1;
	if (kind === "card") {
		const card = element;
		defaults.backfaceColor = defaults.fillColor;
		defaults.pixelSize = card.pixelSize;
		defaults.sizeX = card.size.width;
		defaults.width = card.size.width / card.pixelSize;
		if (card.size.height !== "auto") {
			defaults.sizeY = card.size.height;
			defaults.height = card.size.height / card.pixelSize;
		}
		defaults.anchorX = card.anchorX;
		defaults.anchorY = card.anchorY;
	} else if (kind === "overlay") defaults.depthTest = false;
	return defaults;
}
function createOverlayViewport(surface, viewport) {
	const wrapper = new Container({
		width: viewport.width,
		height: viewport.height,
		sizeX: viewport.width,
		sizeY: viewport.height,
		pixelSize: 1,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		pointerEvents: "none",
		depthTest: false
	});
	wrapper.add(surface);
	return wrapper;
}
function hasSurfaceAppearance(element) {
	return (element instanceof UICard || element instanceof UIOverlay) && element.appearance === "surface";
}
function validPair(value) {
	return value !== void 0 && Number.isFinite(value[0]) && Number.isFinite(value[1]);
}
function boundsFromCenter(center, size) {
	return {
		x: center[0] - size[0] / 2,
		y: center[1] - size[1] / 2,
		width: size[0],
		height: size[1]
	};
}
function contentBounds(parent) {
	const [width, height] = parent.size.peek() ?? [0, 0];
	const [top, right, bottom, left] = parent.paddingInset.peek() ?? [
		0,
		0,
		0,
		0
	];
	return {
		x: -width / 2 + left,
		y: -height / 2 + bottom,
		width: Math.max(0, width - left - right),
		height: Math.max(0, height - top - bottom)
	};
}
function containsBounds(container, child) {
	const tolerance = .5;
	return child.x >= container.x - tolerance && child.y >= container.y - tolerance && child.x + child.width <= container.x + container.width + tolerance && child.y + child.height <= container.y + container.height + tolerance;
}
var FALLBACK_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path fill="#ffffff" d="M11 18h2v2h-2zm1-16a7 7 0 0 0-7 7h2a5 5 0 1 1 8.6 3.5C13.7 14.2 11 15.2 11 18h2c0-1.5 1.4-2.2 3.1-3.7A7 7 0 0 0 12 2z"/>
</svg>`;
/** Backend-owned icon cache. Completions are staged by bindings. */
var IconCache = class {
	constructor() {
		this.content = /* @__PURE__ */ new Map();
		this.pending = /* @__PURE__ */ new Map();
		this.disposed = false;
	}
	get(path, subscriber) {
		const cached = this.content.get(path);
		if (cached) return cached;
		let request = this.pending.get(path);
		if (!request) {
			const controller = new AbortController();
			const newRequest = {
				controller,
				subscribers: /* @__PURE__ */ new Set()
			};
			request = newRequest;
			this.pending.set(path, newRequest);
			fetch(`${ICON_BASE}${path}`, { signal: controller.signal }).then((response) => {
				if (!response.ok) throw new Error(`Icon request failed: ${response.status}`);
				return response.text();
			}).then((content) => {
				if (this.disposed) return;
				if (!content.includes("<svg")) throw new Error("Invalid icon SVG.");
				this.content.set(path, content);
				for (const notify of newRequest.subscribers) notify();
			}).catch(() => {
				if (!this.disposed) {
					this.content.set(path, FALLBACK_ICON);
					for (const notify of newRequest.subscribers) notify();
				}
			}).finally(() => this.pending.delete(path));
		}
		request.subscribers.add(subscriber);
		return FALLBACK_ICON;
	}
	dispose() {
		this.disposed = true;
		for (const { controller } of this.pending.values()) controller.abort();
		this.pending.clear();
		this.content.clear();
	}
};
function createSliderContent(panel) {
	const thumbSize = 28;
	const rail = new Container({
		positionType: "absolute",
		positionLeft: thumbSize / 2,
		positionRight: thumbSize / 2,
		positionTop: "50%",
		transformTranslateY: "-50%",
		height: thumbSize,
		pointerEvents: "none"
	});
	const track = new Container({
		positionType: "absolute",
		positionLeft: 0,
		positionRight: 0,
		positionTop: "50%",
		transformTranslateY: "-50%",
		height: 10,
		backgroundColor: "transparent",
		borderRadius: 5,
		pointerEvents: "none"
	});
	const fill = new Container({
		positionType: "absolute",
		positionLeft: 0,
		positionTop: "50%",
		transformTranslateY: "-50%",
		height: 10,
		borderRadius: 5,
		pointerEvents: "none"
	});
	const thumb = new Container({
		positionType: "absolute",
		positionTop: "50%",
		transformTranslateX: "-50%",
		transformTranslateY: "-50%",
		width: thumbSize,
		height: thumbSize,
		borderRadius: thumbSize / 2,
		pointerEvents: "none"
	});
	const update = (slider, theme) => {
		const ratio = slider.max === slider.min ? 0 : (slider.value - slider.min) / (slider.max - slider.min);
		const color = normalizeAlphaHexColor(slider.disabled ? theme.colors.disabledText : theme.colors.primary);
		track.setProperties({ backgroundColor: normalizeAlphaHexColor(theme.colors.sliderTrack ?? theme.colors.outline) });
		fill.setProperties({
			width: `${ratio * 100}%`,
			backgroundColor: color
		});
		thumb.setProperties({
			positionLeft: `${ratio * 100}%`,
			backgroundColor: color
		});
	};
	rail.add(track, fill, thumb);
	panel.add(rail);
	return {
		update,
		dispose: () => {
			track.removeFromParent();
			fill.removeFromParent();
			thumb.removeFromParent();
			track.dispose();
			fill.dispose();
			thumb.dispose();
			rail.removeFromParent();
			rail.dispose();
		}
	};
}
function toUIKitStyle(style) {
	const result = {};
	if (style.padding !== void 0) {
		result.paddingTop = style.padding;
		result.paddingRight = style.padding;
		result.paddingBottom = style.padding;
		result.paddingLeft = style.padding;
	}
	if (style.margin !== void 0) {
		result.marginTop = style.margin;
		result.marginRight = style.margin;
		result.marginBottom = style.margin;
		result.marginLeft = style.margin;
	}
	if (style.gap !== void 0) {
		result.gapRow = style.gap;
		result.gapColumn = style.gap;
	}
	if (style.transform?.translateX !== void 0) result.transformTranslateX = style.transform.translateX;
	if (style.transform?.translateY !== void 0) result.transformTranslateY = style.transform.translateY;
	for (const [key, value] of Object.entries(style)) {
		if (key.startsWith(":") || value === void 0 || key === "padding" || key === "margin" || key === "gap" || key === "transform") continue;
		const mapped = key === "position" ? "positionType" : key === "backgroundColor" ? "fillColor" : key === "borderColor" ? "strokeColor" : key === "borderWidth" ? "strokeWidth" : key === "borderAlign" ? "strokeAlign" : key === "borderRadius" ? "cornerRadius" : key === "top" ? "positionTop" : key === "right" ? "positionRight" : key === "bottom" ? "positionBottom" : key === "left" ? "positionLeft" : key === "rowGap" ? "gapRow" : key === "columnGap" ? "gapColumn" : key;
		result[mapped] = value;
	}
	return result;
}
function iconAssetPath(icon) {
	const name = `${encodeURIComponent(icon.icon)}${icon.filled ? "-fill" : ""}`;
	return `${icon.weight}/${icon.variant}/${name}.svg`;
}
function defaultIconAssetPath(icon) {
	return `400/outlined/${encodeURIComponent(icon)}.svg`;
}
export { createUIBackend };
