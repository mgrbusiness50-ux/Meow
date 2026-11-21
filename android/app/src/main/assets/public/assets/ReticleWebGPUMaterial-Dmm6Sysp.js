import { j as Color } from "./three.core-DsEAPerk.js";
import { F as sub, L as uniform, N as smoothstep, P as step, R as uv, S as mix, V as vec4, b as max, d as distance, g as length, l as dFdx, m as float, n as Fn, o as clamp, t as Discard, u as dFdy, z as vec2 } from "./three.tsl-BNv0HRep.js";
import { Ft as NodeMaterial } from "./three.webgpu-DLDEw0Tn.js";
// node_modules/xrblocks/build/internal/ReticleWebGPUMaterial.js
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
* Applies a WebGPU NodeMaterial to a reticle and synchronizes uniform changes.
*
* @param reticle - The reticle to configure with a WebGPU material.
*/
function applyWebGPUReticleMaterial(reticle) {
	const uColor = uniform(new Color().copy(reticle.uniforms.uColor.value));
	const uPressed = uniform(reticle.uniforms.uPressed.value);
	const fragmentNode = Fn(() => {
		const dist = distance(uv(), vec2(.5, .5));
		Discard(dist.greaterThan(.45));
		const antialiasDist = max(length(vec2(dFdx(dist), dFdy(dist))), float(.001));
		const outerRadius = sub(float(.5), antialiasDist);
		const clampedOuterDelta = clamp(sub(dist, outerRadius), float(0), antialiasDist);
		const outerAlpha = sub(float(1), clampedOuterDelta.div(antialiasDist));
		const innerBaseColor = vec4(uColor.mul(.5), .5);
		const pressedInnerColor = vec4(uColor, 1);
		const innerGradientColor = vec4(.054, .054, .054, 1);
		const outerRingColor = vec4(.077, .077, .077, 1);
		const gradientEnd = float(.46);
		const gradientStart = float(.33);
		const pressedInnerRadius = float(.41);
		const unpressedInnerColor = mix(innerBaseColor, innerGradientColor, smoothstep(gradientStart, gradientEnd, dist));
		const unpressedColor = mix(unpressedInnerColor, outerRingColor, step(gradientEnd, dist));
		const smoothDistance = antialiasDist.mul(4);
		const percentToInnerRad = max(sub(pressedInnerRadius, dist), float(0)).div(pressedInnerRadius);
		const pressedColorT = clamp(sub(sub(float(1), percentToInnerRad), sub(float(1), smoothDistance)).div(smoothDistance), float(0), float(1));
		const pressedColor = mix(pressedInnerColor, outerRingColor, pressedColorT);
		const premultiplied = mix(unpressedColor, pressedColor, uPressed).mul(outerAlpha);
		const alpha = premultiplied.w;
		return vec4(premultiplied.xyz.div(max(alpha, float(.001))), alpha);
	})();
	const material = new NodeMaterial();
	material.fragmentNode = fragmentNode;
	material.transparent = true;
	material.depthTest = reticle.depthTestEnabled;
	material.depthWrite = false;
	reticle.setCustomMaterial(material, () => {
		uColor.value.copy(reticle.uniforms.uColor.value);
		uPressed.value = reticle.uniforms.uPressed.value;
	});
}
export { applyWebGPUReticleMaterial };
