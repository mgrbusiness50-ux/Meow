import { Hi as Vector2, Kr as RedFormat, X as DataTexture, Yr as RenderTarget, bn as Matrix4, cr as RGBAFormat, dt as ExternalTexture, gt as FloatType } from "./three.core-DsEAPerk.js";
import { E as perspectiveDepthToViewZ, H as viewZToOrthographicDepth, I as texture, L as uniform, O as positionWorld, P as step, R as uv, T as or, V as vec4, b as max, f as dot, j as select, m as float, n as Fn, o as clamp, z as vec2 } from "./three.tsl-BNv0HRep.js";
import { Ft as NodeMaterial, ln as QuadMesh } from "./three.webgpu-DLDEw0Tn.js";
// node_modules/xrblocks/build/internal/WebGPUOcclusionPass.js
/**
* WebGPU backend for `OcclusionPass` using Three.js `NodeMaterial`, `QuadMesh`,
* and TSL shader nodes (`three/webgpu` and `three/tsl`).
*/
var WebGPUOcclusionPass = class {
	constructor(scene, camera, useFloatDepth = true, renderToScreen = false, occludableItemsLayer = 3, resolutionScale = .5) {
		this.scene = scene;
		this.camera = camera;
		this.renderToScreen = renderToScreen;
		this.occludableItemsLayer = occludableItemsLayer;
		this.resolutionScale = resolutionScale;
		this.depthTextures = [];
		this.depthNear = [];
		this.depthViewMatrices = [];
		this.depthProjectionMatrices = [];
		this.uRawValueToMeters = uniform(8 / 65536);
		this.uFloatDepth = uniform(1);
		this.uCameraNear = uniform(.1);
		this.uCameraFar = uniform(1e3);
		this.uDepthViewMatrix = uniform(new Matrix4());
		this.uDepthProjectionMatrix = uniform(new Matrix4());
		this.lastOcclusionMapSize = new Vector2(0, 0);
		this.lastKawaseBlurSize = new Vector2(0, 0);
		this.renderDimensions = new Vector2();
		this.disposed = false;
		this.placeholderDepthTexture = new DataTexture(new Float32Array([0]), 1, 1, RedFormat, FloatType);
		this.placeholderDepthTexture.needsUpdate = true;
		this.placeholderColorTexture = new DataTexture(new Uint8Array([
			0,
			0,
			0,
			0
		]), 1, 1, RGBAFormat);
		this.placeholderColorTexture.needsUpdate = true;
		this.uFloatDepth.value = useFloatDepth ? 1 : 0;
		this.uCameraNear.value = camera.near;
		this.uCameraFar.value = camera.far;
		this.uDepthViewMatrix.value.copy(camera.matrixWorldInverse);
		this.uDepthProjectionMatrix.value.copy(camera.projectionMatrix);
		this.occlusionMeshMaterial = this.createOcclusionMeshMaterial();
		this.occlusionMapQuad = new QuadMesh(this.createOcclusionMapQuadMaterial());
		this.occlusionMapTexture = new RenderTarget(1, 1);
		this.kawaseBlurTargets = [
			new RenderTarget(1, 1),
			new RenderTarget(1, 1),
			new RenderTarget(1, 1)
		];
		this.kawaseBlurPasses = [
			this.createKawaseBlurPass(1, this.occlusionMapTexture.texture),
			this.createKawaseBlurPass(1, this.kawaseBlurTargets[0].texture),
			this.createKawaseBlurPass(1, this.kawaseBlurTargets[1].texture),
			this.createKawaseBlurPass(2, this.kawaseBlurTargets[2].texture),
			this.createKawaseBlurPass(2, this.kawaseBlurTargets[1].texture),
			this.createKawaseBlurPass(2, this.kawaseBlurTargets[0].texture)
		];
		this.occlusionQuad = new QuadMesh(this.createOcclusionCompositeMaterial());
	}
	computeMetersFromSample(sampledDepthNode) {
		const packed = sampledDepthNode.toVec4().rg;
		const floatMeters = packed.r.mul(this.uRawValueToMeters);
		const uint16Meters = dot(packed, vec2(255, 65280)).mul(this.uRawValueToMeters);
		return select(this.uFloatDepth.greaterThan(.5), floatMeters, uint16Meters);
	}
	createOcclusionMeshMaterial() {
		const depthViewPosition = this.uDepthViewMatrix.mul(vec4(positionWorld, 1));
		const virtualDepth = depthViewPosition.z.negate();
		const depthClipPosition = this.uDepthProjectionMatrix.mul(depthViewPosition);
		const texCoord = depthClipPosition.xy.div(max(float(1e-5), depthClipPosition.w)).mul(.5).add(.5);
		const depthUv = vec2(texCoord.x, float(1).sub(texCoord.y));
		this.meshDepthTextureNode = texture(this.placeholderDepthTexture, depthUv);
		const material = new NodeMaterial();
		material.fragmentNode = Fn(() => {
			const realDepth = this.computeMetersFromSample(this.meshDepthTextureNode);
			const outOfBounds = or(depthUv.x.lessThan(0), depthUv.x.greaterThan(1), depthUv.y.lessThan(0), depthUv.y.greaterThan(1), virtualDepth.lessThanEqual(0));
			const isNotOccluded = select(outOfBounds, float(1), step(virtualDepth, realDepth));
			return vec4(isNotOccluded, float(1), float(0), float(1));
		})();
		material.blending = 0;
		material.lights = false;
		return material;
	}
	createOcclusionMapQuadMaterial() {
		const texCoord = uv();
		const depthUv = vec2(texCoord.x, float(1).sub(texCoord.y));
		this.readBufferDiffuseNode = texture(this.placeholderColorTexture, texCoord);
		this.readBufferDepthTextureNode = texture(this.placeholderDepthTexture, depthUv);
		this.readBufferVirtualDepthNode = texture(this.placeholderDepthTexture, texCoord);
		const material = new NodeMaterial();
		material.fragmentNode = Fn(() => {
			const realDepth = float(this.computeMetersFromSample(this.readBufferDepthTextureNode));
			const fragCoordZ = float(this.readBufferVirtualDepthNode.toVec4().r);
			const viewZ = float(perspectiveDepthToViewZ(fragCoordZ, this.uCameraNear, this.uCameraFar));
			const virtualDepth = float(viewZToOrthographicDepth(viewZ, this.uCameraNear, this.uCameraFar)).mul(this.uCameraFar.sub(this.uCameraNear)).add(this.uCameraNear);
			return vec4(step(virtualDepth, realDepth), step(float(.001), this.readBufferDiffuseNode.a), float(0), float(0));
		})();
		material.blending = 0;
		material.lights = false;
		return material;
	}
	createKawaseBlurPass(mode, inputTexture) {
		const uBlurSize = uniform(7);
		const uTexelSize = uniform(new Vector2());
		const material = new NodeMaterial();
		material.fragmentNode = Fn(() => {
			const baseUv = uv();
			const halfPixel = uTexelSize.mul(.5);
			const offset = vec2(uBlurSize, uBlurSize);
			if (mode === 1) {
				const uv1 = baseUv.sub(halfPixel.mul(offset));
				const uv2 = baseUv.add(halfPixel.mul(offset));
				const uv3 = baseUv.sub(vec2(halfPixel.x, halfPixel.y.negate()).mul(offset));
				const uv4 = baseUv.add(vec2(halfPixel.x, halfPixel.y.negate()).mul(offset));
				return texture(inputTexture, baseUv).mul(4).add(texture(inputTexture, uv1)).add(texture(inputTexture, uv2)).add(texture(inputTexture, uv3)).add(texture(inputTexture, uv4)).mul(.125);
			}
			const uv1 = baseUv.add(vec2(halfPixel.x.mul(-2), float(0)).mul(offset));
			const uv2 = baseUv.add(vec2(halfPixel.x.negate(), halfPixel.y).mul(offset));
			const uv3 = baseUv.add(vec2(float(0), halfPixel.y.mul(2)).mul(offset));
			const uv4 = baseUv.add(halfPixel.mul(offset));
			const uv5 = baseUv.add(vec2(halfPixel.x.mul(2), float(0)).mul(offset));
			const uv6 = baseUv.add(vec2(halfPixel.x, halfPixel.y.negate()).mul(offset));
			const uv7 = baseUv.add(vec2(float(0), halfPixel.y.mul(-2)).mul(offset));
			const uv8 = baseUv.sub(halfPixel.mul(offset));
			return texture(inputTexture, uv1).add(texture(inputTexture, uv2).mul(2)).add(texture(inputTexture, uv3)).add(texture(inputTexture, uv4).mul(2)).add(texture(inputTexture, uv5)).add(texture(inputTexture, uv6).mul(2)).add(texture(inputTexture, uv7)).add(texture(inputTexture, uv8).mul(2)).mul(.0833);
		})();
		material.blending = 0;
		material.lights = false;
		return {
			quad: new QuadMesh(material),
			uTexelSize
		};
	}
	createOcclusionCompositeMaterial() {
		const texCoord = uv();
		this.finalCompositeDiffuseNode = texture(this.placeholderColorTexture, texCoord);
		const occlusionTexNode = texture(this.occlusionMapTexture.texture, texCoord);
		const material = new NodeMaterial();
		material.fragmentNode = Fn(() => {
			const occlusionValue = clamp(occlusionTexNode.r.div(max(float(1e-4), occlusionTexNode.g)), float(0), float(1));
			return this.finalCompositeDiffuseNode.mul(occlusionValue);
		})();
		material.blending = 0;
		material.lights = false;
		return material;
	}
	setDepthTexture(depthTexture, rawValueToMeters, viewId, depthNear, depthViewMatrix, depthProjectionMatrix) {
		this.depthTextures[viewId] = depthTexture;
		this.uRawValueToMeters.value = rawValueToMeters;
		this.depthNear[viewId] = depthNear;
		if (depthViewMatrix) this.depthViewMatrices[viewId] = depthViewMatrix;
		if (depthProjectionMatrix) this.depthProjectionMatrices[viewId] = depthProjectionMatrix;
		if (!(depthTexture instanceof ExternalTexture)) depthTexture.needsUpdate = true;
	}
	render(renderer, writeBuffer, readBuffer, viewId = 0) {
		const webgpuRenderer = renderer;
		const originalRenderTarget = webgpuRenderer.getRenderTarget();
		const dimensions = this.renderDimensions;
		if (readBuffer == null) this.renderOcclusionMapFromScene(webgpuRenderer, dimensions, viewId);
		else this.renderOcclusionMapFromReadBuffer(webgpuRenderer, readBuffer, dimensions, viewId);
		this.blurOcclusionMap(webgpuRenderer, dimensions);
		this.applyOcclusionMapToRenderedImage(webgpuRenderer, readBuffer, writeBuffer);
		webgpuRenderer.setRenderTarget(originalRenderTarget);
	}
	renderOcclusionMapFromScene(renderer, dimensions, viewId) {
		const texture = this.depthTextures[viewId] ?? this.placeholderDepthTexture;
		this.meshDepthTextureNode.value = texture;
		const camera = renderer.xr.getCamera()?.cameras?.[viewId] || this.camera;
		this.uDepthViewMatrix.value.copy(this.depthViewMatrices[viewId] || camera.matrixWorldInverse);
		this.uDepthProjectionMatrix.value.copy(this.depthProjectionMatrices[viewId] || camera.projectionMatrix);
		this.scene.overrideMaterial = this.occlusionMeshMaterial;
		this.getScaledDimensions(renderer, dimensions);
		this.resizeOcclusionMap(dimensions);
		renderer.setRenderTarget(this.occlusionMapTexture);
		renderer.clear();
		const originalCameraLayerMask = camera.layers.mask;
		camera.layers.set(this.occludableItemsLayer);
		renderer.render(this.scene, camera);
		camera.layers.mask = originalCameraLayerMask;
		this.scene.overrideMaterial = null;
	}
	renderOcclusionMapFromReadBuffer(renderer, readBuffer, dimensions, viewId) {
		this.readBufferDiffuseNode.value = readBuffer.texture;
		this.readBufferVirtualDepthNode.value = readBuffer.depthTexture ?? this.placeholderDepthTexture;
		this.readBufferDepthTextureNode.value = this.depthTextures[viewId] ?? this.placeholderDepthTexture;
		this.getScaledDimensions(renderer, dimensions);
		this.resizeOcclusionMap(dimensions);
		renderer.setRenderTarget(this.occlusionMapTexture);
		this.occlusionMapQuad.render(renderer);
	}
	blurOcclusionMap(renderer, dimensions) {
		this.resizeKawaseBlur(dimensions);
		const scale = this.resolutionScale;
		for (let i = 0; i < 3; i++) {
			this.kawaseBlurPasses[i].uTexelSize.value.set(scale / (dimensions.x / 2 ** i), scale / (dimensions.y / 2 ** i));
			this.kawaseBlurPasses[this.kawaseBlurPasses.length - 1 - i].uTexelSize.value.set(scale / (dimensions.x / 2 ** (i - 1)), scale / (dimensions.y / 2 ** (i - 1)));
		}
		renderer.setRenderTarget(this.kawaseBlurTargets[0]);
		this.kawaseBlurPasses[0].quad.render(renderer);
		renderer.setRenderTarget(this.kawaseBlurTargets[1]);
		this.kawaseBlurPasses[1].quad.render(renderer);
		renderer.setRenderTarget(this.kawaseBlurTargets[2]);
		this.kawaseBlurPasses[2].quad.render(renderer);
		renderer.setRenderTarget(this.kawaseBlurTargets[1]);
		this.kawaseBlurPasses[3].quad.render(renderer);
		renderer.setRenderTarget(this.kawaseBlurTargets[0]);
		this.kawaseBlurPasses[4].quad.render(renderer);
		renderer.setRenderTarget(this.occlusionMapTexture);
		this.kawaseBlurPasses[5].quad.render(renderer);
	}
	getScaledDimensions(renderer, dimensions) {
		renderer.getDrawingBufferSize(dimensions);
		dimensions.set(Math.max(1, Math.floor(dimensions.x * this.resolutionScale)), Math.max(1, Math.floor(dimensions.y * this.resolutionScale)));
	}
	resizeOcclusionMap(dimensions) {
		if (this.lastOcclusionMapSize.x === dimensions.x && this.lastOcclusionMapSize.y === dimensions.y) return;
		this.lastOcclusionMapSize.copy(dimensions);
		this.occlusionMapTexture.setSize(dimensions.x, dimensions.y);
	}
	resizeKawaseBlur(dimensions) {
		if (this.lastKawaseBlurSize.x === dimensions.x && this.lastKawaseBlurSize.y === dimensions.y) return;
		this.lastKawaseBlurSize.copy(dimensions);
		for (let i = 0; i < 3; i++) this.kawaseBlurTargets[i].setSize(Math.max(1, Math.floor(dimensions.x / 2 ** (i + 1))), Math.max(1, Math.floor(dimensions.y / 2 ** (i + 1))));
	}
	applyOcclusionMapToRenderedImage(renderer, readBuffer, writeBuffer) {
		if (readBuffer && (this.renderToScreen || writeBuffer)) {
			this.finalCompositeDiffuseNode.value = readBuffer.texture;
			renderer.setRenderTarget(writeBuffer && !this.renderToScreen ? writeBuffer : null);
			this.occlusionQuad.render(renderer);
		}
	}
	updateOcclusionMapUniforms(uniforms, renderer) {
		const camera = renderer.xr.getCamera()?.cameras?.[0] || this.camera;
		uniforms.tOcclusionMap.value = this.occlusionMapTexture.texture;
		uniforms.uOcclusionClipFromWorld.value.copy(camera.projectionMatrix).multiply(camera.matrixWorldInverse);
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = true;
		const quads = [
			this.occlusionMapQuad,
			...this.kawaseBlurPasses.map((pass) => pass.quad),
			this.occlusionQuad
		];
		const resources = [
			this.placeholderDepthTexture,
			this.placeholderColorTexture,
			this.occlusionMeshMaterial,
			this.occlusionMapTexture,
			...this.kawaseBlurTargets,
			...quads.flatMap((quad) => [quad.material, quad.geometry])
		];
		let firstError;
		for (const resource of resources) try {
			resource.dispose();
		} catch (error) {
			firstError ??= error;
		}
		this.kawaseBlurTargets.length = 0;
		this.kawaseBlurPasses.length = 0;
		this.depthTextures.length = 0;
		this.depthNear.length = 0;
		this.depthViewMatrices.length = 0;
		this.depthProjectionMatrices.length = 0;
		if (firstError !== void 0) throw firstError;
	}
};
export { WebGPUOcclusionPass };
