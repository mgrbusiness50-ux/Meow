const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/web-oJPo40QI.js","assets/rolldown-runtime-SbdDWaPq.js","assets/WebGPUOcclusionPass-BYm5LBjR.js","assets/three.core-DsEAPerk.js","assets/three.tsl-BNv0HRep.js","assets/three.webgpu-DLDEw0Tn.js","assets/WebGPUOcclusionUtils-DTchqsIi.js","assets/DepthMeshWebGPUMaterial-B3clYK8i.js","assets/src-CnnjTXy8.js","assets/spark.module-BXM4exIQ.js","assets/three.module-CrYsxIUo.js","assets/Pass-CnhMO6ym.js"])))=>i.map(i=>d[i]);
import { A as measureUICardMinContentWidth, C as isHandleAction, D as isUIElement, E as isSemanticControlDisabled, F as resumeTransformScripts, M as normalizeRotationAxis, O as isUIPresentationObject, R as suspendTransformScripts, T as isSemanticControl, _ as getUIElementKind, a as MeshScript, d as cloneScaleOptions, h as getSemanticControl, i as ManipulationAction, j as normalizeManipulationConfig, k as measureUICardContentHeight, m as getResolvedUICardSize, n as toTrianglesDrawMode, o as Script, v as getUIPresentationBounds, w as isManipulationActionEnabled, y as getUIPresentationObject } from "./BufferGeometryUtils-BqAY83DP.js";
import { _ as HAND_BONE_IDX_CONNECTION_MAP, g as DEFAULT_DEVICE_CAMERA_WIDTH, h as deepMerge, m as deepFreeze, p as SimulatorOptions, t as HAND_JOINT_NAMES, v as HAND_JOINT_IDX_CONNECTION_MAP } from "./HandPoses-M-IgTq78.js";
import { a as disposeObjectChildren, c as isSerializerRenderer, l as isWebGPURenderer, n as assertWebGLRenderer, o as disposeObjectTree, r as disposeMaterial, t as RendererHolder } from "./ThreeDisposal-CKM4PtYv.js";
import { n as Pass, t as FullScreenQuad } from "./Pass-CnhMO6ym.js";
import { $ as DefaultLoadingManager, $n as Quaternion, $r as RingGeometry, A as ClampToEdgeWrapping, Ai as Triangle, An as MeshStandardMaterial, Ar as RGBA_S3TC_DXT5_Format, At as InstancedBufferAttribute, Br as RGFormat, Bt as InterpolateLinear, C as BufferGeometry, Di as Timer, Dr as RGBA_PVRTC_4BPPV1_Format, E as Camera, Er as RGBA_PVRTC_2BPPV1_Format, F as CompressedArrayTexture, Fi as UnsignedInt101111Type, Fn as NearestMipmapNearestFilter, Fr as RGB_ETC1_Format, Ft as InterleavedBuffer, Gi as VectorKeyframeTrack, Gn as Points, Hi as Vector2, Hn as Plane, I as CompressedCubeTexture, Ir as RGB_ETC2_Format, It as InterleavedBufferAttribute, J as Data3DTexture, Ki as VideoTexture, Kn as PointsMaterial, Kr as RedFormat, L as CompressedTexture, Li as UnsignedInt5999Type, Ln as NumberKeyframeTrack, Lt as Interpolant, Mn as MirroredRepeatWrapping, N as ColorManagement, Nn as NearestFilter, Nt as InstancedMesh, Or as RGBA_S3TC_DXT1_Format, Pi as UnsignedByteType, Pn as NearestMipmapLinearFilter, Pr as RGB_BPTC_UNSIGNED_Format, Rn as Object3D, Rr as RGB_PVRTC_4BPPV1_Format, S as BufferAttribute, Sn as MeshBasicMaterial, St as HalfFloatType, Ti as TextureLoader, Tr as RGBA_ETC2_EAC_Format, Tt as ImageBitmapLoader, Ui as Vector3, Un as PlaneGeometry, Ur as Ray, Vi as UnsignedShortType, Vn as PerspectiveCamera, Wi as Vector4, Wn as PointLight, Wr as Raycaster, X as DataTexture, Xr as RepeatWrapping, Yi as WebGLRenderTarget, Yn as PropertyBinding, Yt as Line, Zt as LineBasicMaterial, _ as Bone, _i as SphereGeometry, _n as MathUtils, a as AnimationClip, ar as RED_RGTC1_Format, b as Box3, bi as SpotLight, bn as Matrix4, br as RGBA_ASTC_6x6_Format, ci as ShadowMaterial, cn as LinearSRGBColorSpace, cr as RGBAFormat, di as ShapePath, dn as LoaderUtils, dt as ExternalTexture, ei as SIGNED_R11_EAC_Format, er as QuaternionKeyframeTrack, ft as ExtrudeGeometry, gi as Sphere, gn as Material, gr as RGBA_ASTC_4x4_Format, gt as FloatType, h as BatchedMesh, hi as SkinnedMesh, ii as SRGBColorSpace, ir as RED_GREEN_RGTC2_Format, it as DirectionalLight, j as Color, jr as RGBFormat, kn as MeshPhysicalMaterial, li as Shape, lt as Euler, mi as Skeleton, ni as SIGNED_RED_RGTC1_Format, nn as LineSegments, nr as R11_EAC_Format, oi as Scene, on as LinearMipmapLinearFilter, or as RG11_EAC_Format, ot as DynamicDrawUsage, pt as FileLoader, ri as SIGNED_RG11_EAC_Format, rn as LinearFilter, si as ShaderMaterial, sn as LinearMipmapNearestFilter, ti as SIGNED_RED_GREEN_RGTC2_Format, tn as LineLoop, ui as ShapeGeometry, un as Loader, wi as Texture, wr as RGBA_BPTC_Format, wt as IcosahedronGeometry, x as BoxGeometry, xn as Mesh, xt as Group, y as Box2, yn as Matrix3, zn as OrthographicCamera, zr as RGB_S3TC_DXT1_Format, zt as InterpolateDiscrete } from "./three.core-DsEAPerk.js";
import { t as __vitePreload } from "./preload-helper-BhofnfyO.js";
// node_modules/three/examples/jsm/utils/SkeletonUtils.js
/**
* Clones the given 3D object and its descendants, ensuring that any `SkinnedMesh` instances are
* correctly associated with their bones. Bones are also cloned, and must be descendants of the
* object passed to this method. Other data, like geometries and materials, are reused by reference.
*
* @param {Object3D} source - The 3D object to clone.
* @return {Object3D} The cloned 3D object.
*/
function clone(source) {
	const sourceLookup = /* @__PURE__ */ new Map();
	const cloneLookup = /* @__PURE__ */ new Map();
	const clone = source.clone();
	parallelTraverse(source, clone, function(sourceNode, clonedNode) {
		sourceLookup.set(clonedNode, sourceNode);
		cloneLookup.set(sourceNode, clonedNode);
	});
	clone.traverse(function(node) {
		if (!node.isSkinnedMesh) return;
		const clonedMesh = node;
		const sourceMesh = sourceLookup.get(node);
		const sourceBones = sourceMesh.skeleton.bones;
		clonedMesh.skeleton = sourceMesh.skeleton.clone();
		clonedMesh.bindMatrix.copy(sourceMesh.bindMatrix);
		clonedMesh.skeleton.bones = sourceBones.map(function(bone) {
			return cloneLookup.get(bone);
		});
		clonedMesh.bind(clonedMesh.skeleton, clonedMesh.bindMatrix);
	});
	return clone;
}
function parallelTraverse(a, b, callback) {
	callback(a, b);
	for (let i = 0; i < a.children.length; i++) parallelTraverse(a.children[i], b.children[i], callback);
}
// node_modules/three/examples/jsm/loaders/GLTFLoader.js
/**
* A loader for the glTF 2.0 format.
*
* [glTF](https://www.khronos.org/gltf/) (GL Transmission Format) is an [open format specification]{@link https://github.com/KhronosGroup/glTF/tree/main/specification/2.0)
* for efficient delivery and loading of 3D content. Assets may be provided either in JSON (.gltf) or binary (.glb)
* format. External files store textures (.jpg, .png) and additional binary data (.bin). A glTF asset may deliver
* one or more scenes, including meshes, materials, textures, skins, skeletons, morph targets, animations, lights,
* and/or cameras.
*
* `GLTFLoader` uses {@link ImageBitmapLoader} whenever possible. Be advised that image bitmaps are not
* automatically GC-collected when they are no longer referenced, and they require special handling during
* the disposal process.
*
* `GLTFLoader` supports the following glTF 2.0 extensions:
* - KHR_draco_mesh_compression
* - KHR_lights_punctual
* - KHR_materials_anisotropy
* - KHR_materials_clearcoat
* - KHR_materials_dispersion
* - KHR_materials_emissive_strength
* - KHR_materials_ior
* - KHR_materials_specular
* - KHR_materials_transmission
* - KHR_materials_iridescence
* - KHR_materials_unlit
* - KHR_materials_volume
* - KHR_mesh_quantization
* - KHR_meshopt_compression
* - KHR_texture_basisu
* - KHR_texture_transform
* - EXT_materials_bump
* - EXT_meshopt_compression
* - EXT_mesh_gpu_instancing
* - EXT_texture_avif
* - EXT_texture_webp
*
* The following glTF 2.0 extensions are supported by separately registered plugins:
* - KHR_gaussian_splatting
* - [KHR_materials_variants](https://github.com/takahirox/three-gltf-extensions)
* - [MSFT_texture_dds](https://github.com/takahirox/three-gltf-extensions)
* - [KHR_animation_pointer](https://github.com/needle-tools/three-animation-pointer)
* - [NEEDLE_progressive](https://github.com/needle-tools/gltf-progressive)
*
* ```js
* const loader = new GLTFLoader();
*
* // Optional: Provide a DRACOLoader instance to decode compressed mesh data
* const dracoLoader = new DRACOLoader();
* dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
* loader.setDRACOLoader( dracoLoader );
*
* const gltf = await loader.loadAsync( 'models/gltf/duck/duck.gltf' );
* scene.add( gltf.scene );
* ```
*
* @augments Loader
* @three_import import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
*/
var GLTFLoader = class extends Loader {
	/**
	* Constructs a new glTF loader.
	*
	* @param {LoadingManager} [manager] - The loading manager.
	*/
	constructor(manager) {
		super(manager);
		this.dracoLoader = null;
		this.ktx2Loader = null;
		this.meshoptDecoder = null;
		this.pluginCallbacks = [];
		this.register(function(parser) {
			return new GLTFMaterialsClearcoatExtension(parser);
		});
		this.register(function(parser) {
			return new GLTFMaterialsDispersionExtension(parser);
		});
		this.register(function(parser) {
			return new GLTFTextureBasisUExtension(parser);
		});
		this.register(function(parser) {
			return new GLTFTextureWebPExtension(parser);
		});
		this.register(function(parser) {
			return new GLTFTextureAVIFExtension(parser);
		});
		this.register(function(parser) {
			return new GLTFMaterialsSheenExtension(parser);
		});
		this.register(function(parser) {
			return new GLTFMaterialsTransmissionExtension(parser);
		});
		this.register(function(parser) {
			return new GLTFMaterialsVolumeExtension(parser);
		});
		this.register(function(parser) {
			return new GLTFMaterialsIorExtension(parser);
		});
		this.register(function(parser) {
			return new GLTFMaterialsEmissiveStrengthExtension(parser);
		});
		this.register(function(parser) {
			return new GLTFMaterialsSpecularExtension(parser);
		});
		this.register(function(parser) {
			return new GLTFMaterialsIridescenceExtension(parser);
		});
		this.register(function(parser) {
			return new GLTFMaterialsAnisotropyExtension(parser);
		});
		this.register(function(parser) {
			return new GLTFMaterialsBumpExtension(parser);
		});
		this.register(function(parser) {
			return new GLTFLightsExtension(parser);
		});
		this.register(function(parser) {
			return new GLTFMeshoptCompression(parser, EXTENSIONS.EXT_MESHOPT_COMPRESSION);
		});
		this.register(function(parser) {
			return new GLTFMeshoptCompression(parser, EXTENSIONS.KHR_MESHOPT_COMPRESSION);
		});
		this.register(function(parser) {
			return new GLTFMeshGpuInstancing(parser);
		});
	}
	/**
	* Starts loading from the given URL and passes the loaded glTF asset
	* to the `onLoad()` callback.
	*
	* @param {string} url - The path/URL of the file to be loaded. This can also be a data URI.
	* @param {function(GLTFLoader~LoadObject)} onLoad - Executed when the loading process has been finished.
	* @param {onProgressCallback} onProgress - Executed while the loading is in progress.
	* @param {onErrorCallback} onError - Executed when errors occur.
	*/
	load(url, onLoad, onProgress, onError) {
		const scope = this;
		let resourcePath;
		if (this.resourcePath !== "") resourcePath = this.resourcePath;
		else if (this.path !== "") {
			const relativeUrl = LoaderUtils.extractUrlBase(url);
			resourcePath = LoaderUtils.resolveURL(relativeUrl, this.path);
		} else resourcePath = LoaderUtils.extractUrlBase(url);
		this.manager.itemStart(url);
		const _onError = function(e) {
			if (onError) onError(e);
			else console.error(e);
			scope.manager.itemError(url);
			scope.manager.itemEnd(url);
		};
		const loader = new FileLoader(this.manager);
		loader.setPath(this.path);
		loader.setResponseType("arraybuffer");
		loader.setRequestHeader(this.requestHeader);
		loader.setWithCredentials(this.withCredentials);
		loader.load(url, function(data) {
			try {
				scope.parse(data, resourcePath, function(gltf) {
					onLoad(gltf);
					scope.manager.itemEnd(url);
				}, _onError);
			} catch (e) {
				_onError(e);
			}
		}, onProgress, _onError);
	}
	/**
	* Sets the given Draco loader to this loader. Required for decoding assets
	* compressed with the `KHR_draco_mesh_compression` extension.
	*
	* @param {DRACOLoader} dracoLoader - The Draco loader to set.
	* @return {GLTFLoader} A reference to this loader.
	*/
	setDRACOLoader(dracoLoader) {
		this.dracoLoader = dracoLoader;
		return this;
	}
	/**
	* Sets the given KTX2 loader to this loader. Required for loading KTX2
	* compressed textures.
	*
	* @param {KTX2Loader} ktx2Loader - The KTX2 loader to set.
	* @return {GLTFLoader} A reference to this loader.
	*/
	setKTX2Loader(ktx2Loader) {
		this.ktx2Loader = ktx2Loader;
		return this;
	}
	/**
	* Sets the given meshopt decoder. Required for decoding assets
	* compressed with the `EXT_meshopt_compression` extension.
	*
	* @param {Object} meshoptDecoder - The meshopt decoder to set.
	* @return {GLTFLoader} A reference to this loader.
	*/
	setMeshoptDecoder(meshoptDecoder) {
		this.meshoptDecoder = meshoptDecoder;
		return this;
	}
	/**
	* Registers a plugin callback. This API is internally used to implement the various
	* glTF extensions but can also used by third-party code to add additional logic
	* to the loader.
	*
	* @param {function(parser:GLTFParser)} callback - The callback function to register.
	* @return {GLTFLoader} A reference to this loader.
	*/
	register(callback) {
		if (this.pluginCallbacks.indexOf(callback) === -1) this.pluginCallbacks.push(callback);
		return this;
	}
	/**
	* Unregisters a plugin callback.
	*
	* @param {Function} callback - The callback function to unregister.
	* @return {GLTFLoader} A reference to this loader.
	*/
	unregister(callback) {
		if (this.pluginCallbacks.indexOf(callback) !== -1) this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(callback), 1);
		return this;
	}
	/**
	* Parses the given glTF data and returns the resulting group.
	*
	* @param {string|ArrayBuffer} data - The raw glTF data.
	* @param {string} path - The URL base path.
	* @param {function(GLTFLoader~LoadObject)} onLoad - Executed when the loading process has been finished.
	* @param {onErrorCallback} onError - Executed when errors occur.
	*/
	parse(data, path, onLoad, onError) {
		let json;
		const extensions = {};
		const plugins = {};
		const textDecoder = new TextDecoder();
		if (typeof data === "string") json = JSON.parse(data);
		else if (data instanceof ArrayBuffer) {
			if (textDecoder.decode(new Uint8Array(data, 0, 4)) === BINARY_EXTENSION_HEADER_MAGIC) {
				try {
					extensions[EXTENSIONS.KHR_BINARY_GLTF] = new GLTFBinaryExtension(data);
				} catch (error) {
					if (onError) onError(error);
					return;
				}
				json = JSON.parse(extensions[EXTENSIONS.KHR_BINARY_GLTF].content);
			} else json = JSON.parse(textDecoder.decode(data));
		} else json = data;
		if (json.asset === void 0 || json.asset.version[0] < 2) {
			if (onError) onError(/* @__PURE__ */ new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
			return;
		}
		const parser = new GLTFParser(json, {
			path: path || this.resourcePath || "",
			crossOrigin: this.crossOrigin,
			requestHeader: this.requestHeader,
			manager: this.manager,
			ktx2Loader: this.ktx2Loader,
			meshoptDecoder: this.meshoptDecoder
		});
		parser.fileLoader.setRequestHeader(this.requestHeader);
		for (let i = 0; i < this.pluginCallbacks.length; i++) {
			const plugin = this.pluginCallbacks[i](parser);
			if (!plugin.name) console.error("THREE.GLTFLoader: Invalid plugin found: missing name");
			plugins[plugin.name] = plugin;
			extensions[plugin.name] = true;
		}
		if (json.extensionsUsed) for (let i = 0; i < json.extensionsUsed.length; ++i) {
			const extensionName = json.extensionsUsed[i];
			const extensionsRequired = json.extensionsRequired || [];
			switch (extensionName) {
				case EXTENSIONS.KHR_MATERIALS_UNLIT:
					extensions[extensionName] = new GLTFMaterialsUnlitExtension();
					break;
				case EXTENSIONS.KHR_DRACO_MESH_COMPRESSION:
					extensions[extensionName] = new GLTFDracoMeshCompressionExtension(json, this.dracoLoader);
					break;
				case EXTENSIONS.KHR_TEXTURE_TRANSFORM:
					extensions[extensionName] = new GLTFTextureTransformExtension();
					break;
				case EXTENSIONS.KHR_MESH_QUANTIZATION:
					extensions[extensionName] = new GLTFMeshQuantizationExtension();
					break;
				default: if (extensionsRequired.indexOf(extensionName) >= 0 && plugins[extensionName] === void 0) console.warn("THREE.GLTFLoader: Unknown extension \"" + extensionName + "\".");
			}
		}
		parser.setExtensions(extensions);
		parser.setPlugins(plugins);
		parser.parse(onLoad, onError);
	}
	/**
	* Async version of {@link GLTFLoader#parse}.
	*
	* @async
	* @param {string|ArrayBuffer} data - The raw glTF data.
	* @param {string} path - The URL base path.
	* @return {Promise<GLTFLoader~LoadObject>} A Promise that resolves with the loaded glTF when the parsing has been finished.
	*/
	parseAsync(data, path) {
		const scope = this;
		return new Promise(function(resolve, reject) {
			scope.parse(data, path, resolve, reject);
		});
	}
};
function GLTFRegistry() {
	let objects = {};
	return {
		get: function(key) {
			return objects[key];
		},
		add: function(key, object) {
			objects[key] = object;
		},
		remove: function(key) {
			delete objects[key];
		},
		removeAll: function() {
			objects = {};
		}
	};
}
/********** EXTENSIONS ***********/
function getMaterialExtension(parser, materialIndex, extensionName) {
	const materialDef = parser.json.materials[materialIndex];
	if (materialDef.extensions && materialDef.extensions[extensionName]) return materialDef.extensions[extensionName];
	return null;
}
var EXTENSIONS = {
	KHR_BINARY_GLTF: "KHR_binary_glTF",
	KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
	KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
	KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
	KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion",
	KHR_MATERIALS_IOR: "KHR_materials_ior",
	KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
	KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
	KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
	KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
	KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy",
	KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
	KHR_MATERIALS_VOLUME: "KHR_materials_volume",
	KHR_TEXTURE_BASISU: "KHR_texture_basisu",
	KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
	KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
	KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
	EXT_MATERIALS_BUMP: "EXT_materials_bump",
	EXT_TEXTURE_WEBP: "EXT_texture_webp",
	EXT_TEXTURE_AVIF: "EXT_texture_avif",
	EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
	KHR_MESHOPT_COMPRESSION: "KHR_meshopt_compression",
	EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing"
};
/**
* Punctual Lights Extension
*
* Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual
*
* @private
*/
var GLTFLightsExtension = class {
	constructor(parser) {
		this.parser = parser;
		this.name = EXTENSIONS.KHR_LIGHTS_PUNCTUAL;
		this.cache = {
			refs: {},
			uses: {}
		};
	}
	_markDefs() {
		const parser = this.parser;
		const nodeDefs = this.parser.json.nodes || [];
		for (let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex++) {
			const nodeDef = nodeDefs[nodeIndex];
			if (nodeDef.extensions && nodeDef.extensions[this.name] && nodeDef.extensions[this.name].light !== void 0) parser._addNodeRef(this.cache, nodeDef.extensions[this.name].light);
		}
	}
	_loadLight(lightIndex) {
		const parser = this.parser;
		const cacheKey = "light:" + lightIndex;
		let dependency = parser.cache.get(cacheKey);
		if (dependency) return dependency;
		const json = parser.json;
		const lightDef = ((json.extensions && json.extensions[this.name] || {}).lights || [])[lightIndex];
		let lightNode;
		const color = new Color(16777215);
		if (lightDef.color !== void 0) color.setRGB(lightDef.color[0], lightDef.color[1], lightDef.color[2], LinearSRGBColorSpace);
		const range = lightDef.range !== void 0 ? lightDef.range : 0;
		switch (lightDef.type) {
			case "directional":
				lightNode = new DirectionalLight(color);
				lightNode.target.position.set(0, 0, -1);
				lightNode.add(lightNode.target);
				break;
			case "point":
				lightNode = new PointLight(color);
				lightNode.distance = range;
				break;
			case "spot":
				lightNode = new SpotLight(color);
				lightNode.distance = range;
				lightDef.spot = lightDef.spot || {};
				lightDef.spot.innerConeAngle = lightDef.spot.innerConeAngle !== void 0 ? lightDef.spot.innerConeAngle : 0;
				lightDef.spot.outerConeAngle = lightDef.spot.outerConeAngle !== void 0 ? lightDef.spot.outerConeAngle : Math.PI / 4;
				lightNode.angle = lightDef.spot.outerConeAngle;
				lightNode.penumbra = 1 - lightDef.spot.innerConeAngle / lightDef.spot.outerConeAngle;
				lightNode.target.position.set(0, 0, -1);
				lightNode.add(lightNode.target);
				break;
			default: throw new Error("THREE.GLTFLoader: Unexpected light type: " + lightDef.type);
		}
		lightNode.position.set(0, 0, 0);
		assignExtrasToUserData(lightNode, lightDef);
		if (lightDef.intensity !== void 0) lightNode.intensity = lightDef.intensity;
		lightNode.name = parser.createUniqueName(lightDef.name || "light_" + lightIndex);
		dependency = Promise.resolve(lightNode);
		parser.cache.add(cacheKey, dependency);
		return dependency;
	}
	getDependency(type, index) {
		if (type !== "light") return;
		return this._loadLight(index);
	}
	createNodeAttachment(nodeIndex) {
		const self = this;
		const parser = this.parser;
		const nodeDef = parser.json.nodes[nodeIndex];
		const lightIndex = (nodeDef.extensions && nodeDef.extensions[this.name] || {}).light;
		if (lightIndex === void 0) return null;
		return this._loadLight(lightIndex).then(function(light) {
			return parser._getNodeRef(self.cache, lightIndex, light);
		});
	}
};
/**
* Unlit Materials Extension
*
* Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_unlit
*
* @private
*/
var GLTFMaterialsUnlitExtension = class {
	constructor() {
		this.name = EXTENSIONS.KHR_MATERIALS_UNLIT;
	}
	getMaterialType() {
		return MeshBasicMaterial;
	}
	extendParams(materialParams, materialDef, parser) {
		const pending = [];
		materialParams.color = new Color(1, 1, 1);
		materialParams.opacity = 1;
		const metallicRoughness = materialDef.pbrMetallicRoughness;
		if (metallicRoughness) {
			if (Array.isArray(metallicRoughness.baseColorFactor)) {
				const array = metallicRoughness.baseColorFactor;
				materialParams.color.setRGB(array[0], array[1], array[2], LinearSRGBColorSpace);
				materialParams.opacity = array[3];
			}
			if (metallicRoughness.baseColorTexture !== void 0) pending.push(parser.assignTexture(materialParams, "map", metallicRoughness.baseColorTexture, SRGBColorSpace));
		}
		return Promise.all(pending);
	}
};
/**
* Materials Emissive Strength Extension
*
* Specification: https://github.com/KhronosGroup/glTF/blob/5768b3ce0ef32bc39cdf1bef10b948586635ead3/extensions/2.0/Khronos/KHR_materials_emissive_strength/README.md
*
* @private
*/
var GLTFMaterialsEmissiveStrengthExtension = class {
	constructor(parser) {
		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_EMISSIVE_STRENGTH;
	}
	extendMaterialParams(materialIndex, materialParams) {
		const extension = getMaterialExtension(this.parser, materialIndex, this.name);
		if (extension === null) return Promise.resolve();
		if (extension.emissiveStrength !== void 0) materialParams.emissiveIntensity = extension.emissiveStrength;
		return Promise.resolve();
	}
};
/**
* Clearcoat Materials Extension
*
* Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_clearcoat
*
* @private
*/
var GLTFMaterialsClearcoatExtension = class {
	constructor(parser) {
		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_CLEARCOAT;
	}
	getMaterialType(materialIndex) {
		return getMaterialExtension(this.parser, materialIndex, this.name) !== null ? MeshPhysicalMaterial : null;
	}
	extendMaterialParams(materialIndex, materialParams) {
		const extension = getMaterialExtension(this.parser, materialIndex, this.name);
		if (extension === null) return Promise.resolve();
		const pending = [];
		if (extension.clearcoatFactor !== void 0) materialParams.clearcoat = extension.clearcoatFactor;
		if (extension.clearcoatTexture !== void 0) pending.push(this.parser.assignTexture(materialParams, "clearcoatMap", extension.clearcoatTexture));
		if (extension.clearcoatRoughnessFactor !== void 0) materialParams.clearcoatRoughness = extension.clearcoatRoughnessFactor;
		if (extension.clearcoatRoughnessTexture !== void 0) pending.push(this.parser.assignTexture(materialParams, "clearcoatRoughnessMap", extension.clearcoatRoughnessTexture));
		if (extension.clearcoatNormalTexture !== void 0) {
			pending.push(this.parser.assignTexture(materialParams, "clearcoatNormalMap", extension.clearcoatNormalTexture));
			if (extension.clearcoatNormalTexture.scale !== void 0) {
				const scale = extension.clearcoatNormalTexture.scale;
				materialParams.clearcoatNormalScale = new Vector2(scale, scale);
			}
		}
		return Promise.all(pending);
	}
};
/**
* Materials dispersion Extension
*
* Specification: https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_dispersion
*
* @private
*/
var GLTFMaterialsDispersionExtension = class {
	constructor(parser) {
		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_DISPERSION;
	}
	getMaterialType(materialIndex) {
		return getMaterialExtension(this.parser, materialIndex, this.name) !== null ? MeshPhysicalMaterial : null;
	}
	extendMaterialParams(materialIndex, materialParams) {
		const extension = getMaterialExtension(this.parser, materialIndex, this.name);
		if (extension === null) return Promise.resolve();
		materialParams.dispersion = extension.dispersion !== void 0 ? extension.dispersion : 0;
		return Promise.resolve();
	}
};
/**
* Iridescence Materials Extension
*
* Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_iridescence
*
* @private
*/
var GLTFMaterialsIridescenceExtension = class {
	constructor(parser) {
		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_IRIDESCENCE;
	}
	getMaterialType(materialIndex) {
		return getMaterialExtension(this.parser, materialIndex, this.name) !== null ? MeshPhysicalMaterial : null;
	}
	extendMaterialParams(materialIndex, materialParams) {
		const extension = getMaterialExtension(this.parser, materialIndex, this.name);
		if (extension === null) return Promise.resolve();
		const pending = [];
		if (extension.iridescenceFactor !== void 0) materialParams.iridescence = extension.iridescenceFactor;
		if (extension.iridescenceTexture !== void 0) pending.push(this.parser.assignTexture(materialParams, "iridescenceMap", extension.iridescenceTexture));
		if (extension.iridescenceIor !== void 0) materialParams.iridescenceIOR = extension.iridescenceIor;
		if (materialParams.iridescenceThicknessRange === void 0) materialParams.iridescenceThicknessRange = [100, 400];
		if (extension.iridescenceThicknessMinimum !== void 0) materialParams.iridescenceThicknessRange[0] = extension.iridescenceThicknessMinimum;
		if (extension.iridescenceThicknessMaximum !== void 0) materialParams.iridescenceThicknessRange[1] = extension.iridescenceThicknessMaximum;
		if (extension.iridescenceThicknessTexture !== void 0) pending.push(this.parser.assignTexture(materialParams, "iridescenceThicknessMap", extension.iridescenceThicknessTexture));
		return Promise.all(pending);
	}
};
/**
* Sheen Materials Extension
*
* Specification: https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_sheen
*
* @private
*/
var GLTFMaterialsSheenExtension = class {
	constructor(parser) {
		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_SHEEN;
	}
	getMaterialType(materialIndex) {
		return getMaterialExtension(this.parser, materialIndex, this.name) !== null ? MeshPhysicalMaterial : null;
	}
	extendMaterialParams(materialIndex, materialParams) {
		const extension = getMaterialExtension(this.parser, materialIndex, this.name);
		if (extension === null) return Promise.resolve();
		const pending = [];
		materialParams.sheenColor = new Color(0, 0, 0);
		materialParams.sheenRoughness = 0;
		materialParams.sheen = 1;
		if (extension.sheenColorFactor !== void 0) {
			const colorFactor = extension.sheenColorFactor;
			materialParams.sheenColor.setRGB(colorFactor[0], colorFactor[1], colorFactor[2], LinearSRGBColorSpace);
		}
		if (extension.sheenRoughnessFactor !== void 0) materialParams.sheenRoughness = extension.sheenRoughnessFactor;
		if (extension.sheenColorTexture !== void 0) pending.push(this.parser.assignTexture(materialParams, "sheenColorMap", extension.sheenColorTexture, SRGBColorSpace));
		if (extension.sheenRoughnessTexture !== void 0) pending.push(this.parser.assignTexture(materialParams, "sheenRoughnessMap", extension.sheenRoughnessTexture));
		return Promise.all(pending);
	}
};
/**
* Transmission Materials Extension
*
* Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_transmission
* Draft: https://github.com/KhronosGroup/glTF/pull/1698
*
* @private
*/
var GLTFMaterialsTransmissionExtension = class {
	constructor(parser) {
		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_TRANSMISSION;
	}
	getMaterialType(materialIndex) {
		return getMaterialExtension(this.parser, materialIndex, this.name) !== null ? MeshPhysicalMaterial : null;
	}
	extendMaterialParams(materialIndex, materialParams) {
		const extension = getMaterialExtension(this.parser, materialIndex, this.name);
		if (extension === null) return Promise.resolve();
		const pending = [];
		if (extension.transmissionFactor !== void 0) materialParams.transmission = extension.transmissionFactor;
		if (extension.transmissionTexture !== void 0) pending.push(this.parser.assignTexture(materialParams, "transmissionMap", extension.transmissionTexture));
		return Promise.all(pending);
	}
};
/**
* Materials Volume Extension
*
* Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_volume
*
* @private
*/
var GLTFMaterialsVolumeExtension = class {
	constructor(parser) {
		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_VOLUME;
	}
	getMaterialType(materialIndex) {
		return getMaterialExtension(this.parser, materialIndex, this.name) !== null ? MeshPhysicalMaterial : null;
	}
	extendMaterialParams(materialIndex, materialParams) {
		const extension = getMaterialExtension(this.parser, materialIndex, this.name);
		if (extension === null) return Promise.resolve();
		const pending = [];
		materialParams.thickness = extension.thicknessFactor !== void 0 ? extension.thicknessFactor : 0;
		if (extension.thicknessTexture !== void 0) pending.push(this.parser.assignTexture(materialParams, "thicknessMap", extension.thicknessTexture));
		materialParams.attenuationDistance = extension.attenuationDistance || Infinity;
		const colorArray = extension.attenuationColor || [
			1,
			1,
			1
		];
		materialParams.attenuationColor = new Color().setRGB(colorArray[0], colorArray[1], colorArray[2], LinearSRGBColorSpace);
		return Promise.all(pending);
	}
};
/**
* Materials ior Extension
*
* Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_ior
*
* @private
*/
var GLTFMaterialsIorExtension = class {
	constructor(parser) {
		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_IOR;
	}
	getMaterialType(materialIndex) {
		return getMaterialExtension(this.parser, materialIndex, this.name) !== null ? MeshPhysicalMaterial : null;
	}
	extendMaterialParams(materialIndex, materialParams) {
		const extension = getMaterialExtension(this.parser, materialIndex, this.name);
		if (extension === null) return Promise.resolve();
		materialParams.ior = extension.ior !== void 0 ? extension.ior : 1.5;
		if (materialParams.ior === 0) materialParams.ior = 1e3;
		return Promise.resolve();
	}
};
/**
* Materials specular Extension
*
* Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_specular
*
* @private
*/
var GLTFMaterialsSpecularExtension = class {
	constructor(parser) {
		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_SPECULAR;
	}
	getMaterialType(materialIndex) {
		return getMaterialExtension(this.parser, materialIndex, this.name) !== null ? MeshPhysicalMaterial : null;
	}
	extendMaterialParams(materialIndex, materialParams) {
		const extension = getMaterialExtension(this.parser, materialIndex, this.name);
		if (extension === null) return Promise.resolve();
		const pending = [];
		materialParams.specularIntensity = extension.specularFactor !== void 0 ? extension.specularFactor : 1;
		if (extension.specularTexture !== void 0) pending.push(this.parser.assignTexture(materialParams, "specularIntensityMap", extension.specularTexture));
		const colorArray = extension.specularColorFactor || [
			1,
			1,
			1
		];
		materialParams.specularColor = new Color().setRGB(colorArray[0], colorArray[1], colorArray[2], LinearSRGBColorSpace);
		if (extension.specularColorTexture !== void 0) pending.push(this.parser.assignTexture(materialParams, "specularColorMap", extension.specularColorTexture, SRGBColorSpace));
		return Promise.all(pending);
	}
};
/**
* Materials bump Extension
*
* Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/EXT_materials_bump
*
* @private
*/
var GLTFMaterialsBumpExtension = class {
	constructor(parser) {
		this.parser = parser;
		this.name = EXTENSIONS.EXT_MATERIALS_BUMP;
	}
	getMaterialType(materialIndex) {
		return getMaterialExtension(this.parser, materialIndex, this.name) !== null ? MeshPhysicalMaterial : null;
	}
	extendMaterialParams(materialIndex, materialParams) {
		const extension = getMaterialExtension(this.parser, materialIndex, this.name);
		if (extension === null) return Promise.resolve();
		const pending = [];
		materialParams.bumpScale = extension.bumpFactor !== void 0 ? extension.bumpFactor : 1;
		if (extension.bumpTexture !== void 0) pending.push(this.parser.assignTexture(materialParams, "bumpMap", extension.bumpTexture));
		return Promise.all(pending);
	}
};
/**
* Materials anisotropy Extension
*
* Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_anisotropy
*
* @private
*/
var GLTFMaterialsAnisotropyExtension = class {
	constructor(parser) {
		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_ANISOTROPY;
	}
	getMaterialType(materialIndex) {
		return getMaterialExtension(this.parser, materialIndex, this.name) !== null ? MeshPhysicalMaterial : null;
	}
	extendMaterialParams(materialIndex, materialParams) {
		const extension = getMaterialExtension(this.parser, materialIndex, this.name);
		if (extension === null) return Promise.resolve();
		const pending = [];
		if (extension.anisotropyStrength !== void 0) materialParams.anisotropy = extension.anisotropyStrength;
		if (extension.anisotropyRotation !== void 0) materialParams.anisotropyRotation = extension.anisotropyRotation;
		if (extension.anisotropyTexture !== void 0) pending.push(this.parser.assignTexture(materialParams, "anisotropyMap", extension.anisotropyTexture));
		return Promise.all(pending);
	}
};
/**
* BasisU Texture Extension
*
* Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_basisu
*
* @private
*/
var GLTFTextureBasisUExtension = class {
	constructor(parser) {
		this.parser = parser;
		this.name = EXTENSIONS.KHR_TEXTURE_BASISU;
	}
	loadTexture(textureIndex) {
		const parser = this.parser;
		const json = parser.json;
		const textureDef = json.textures[textureIndex];
		if (!textureDef.extensions || !textureDef.extensions[this.name]) return null;
		const extension = textureDef.extensions[this.name];
		const loader = parser.options.ktx2Loader;
		if (!loader) {
			if (json.extensionsRequired && json.extensionsRequired.indexOf(this.name) >= 0) throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
			else return null;
		}
		return parser.loadTextureImage(textureIndex, extension.source, loader);
	}
};
/**
* WebP Texture Extension
*
* Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_texture_webp
*
* @private
*/
var GLTFTextureWebPExtension = class {
	constructor(parser) {
		this.parser = parser;
		this.name = EXTENSIONS.EXT_TEXTURE_WEBP;
	}
	loadTexture(textureIndex) {
		const name = this.name;
		const parser = this.parser;
		const json = parser.json;
		const textureDef = json.textures[textureIndex];
		if (!textureDef.extensions || !textureDef.extensions[name]) return null;
		const extension = textureDef.extensions[name];
		const source = json.images[extension.source];
		let loader = parser.textureLoader;
		if (source.uri) {
			const handler = parser.options.manager.getHandler(source.uri);
			if (handler !== null) loader = handler;
		}
		return parser.loadTextureImage(textureIndex, extension.source, loader);
	}
};
/**
* AVIF Texture Extension
*
* Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_texture_avif
*
* @private
*/
var GLTFTextureAVIFExtension = class {
	constructor(parser) {
		this.parser = parser;
		this.name = EXTENSIONS.EXT_TEXTURE_AVIF;
	}
	loadTexture(textureIndex) {
		const name = this.name;
		const parser = this.parser;
		const json = parser.json;
		const textureDef = json.textures[textureIndex];
		if (!textureDef.extensions || !textureDef.extensions[name]) return null;
		const extension = textureDef.extensions[name];
		const source = json.images[extension.source];
		let loader = parser.textureLoader;
		if (source.uri) {
			const handler = parser.options.manager.getHandler(source.uri);
			if (handler !== null) loader = handler;
		}
		return parser.loadTextureImage(textureIndex, extension.source, loader);
	}
};
/**
* meshopt BufferView Compression Extension
*
* Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_meshopt_compression
*
* @private
*/
var GLTFMeshoptCompression = class {
	constructor(parser, name) {
		this.name = name;
		this.parser = parser;
	}
	loadBufferView(index) {
		const json = this.parser.json;
		const bufferView = json.bufferViews[index];
		if (bufferView.extensions && bufferView.extensions[this.name]) {
			const extensionDef = bufferView.extensions[this.name];
			const buffer = this.parser.getDependency("buffer", extensionDef.buffer);
			const decoder = this.parser.options.meshoptDecoder;
			if (!decoder || !decoder.supported) {
				if (json.extensionsRequired && json.extensionsRequired.indexOf(this.name) >= 0) throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
				else return null;
			}
			return buffer.then(function(res) {
				const byteOffset = extensionDef.byteOffset || 0;
				const byteLength = extensionDef.byteLength || 0;
				const count = extensionDef.count;
				const stride = extensionDef.byteStride;
				const source = new Uint8Array(res, byteOffset, byteLength);
				if (decoder.decodeGltfBufferAsync) return decoder.decodeGltfBufferAsync(count, stride, source, extensionDef.mode, extensionDef.filter).then(function(res) {
					return res.buffer;
				});
				else return decoder.ready.then(function() {
					const result = new ArrayBuffer(count * stride);
					decoder.decodeGltfBuffer(new Uint8Array(result), count, stride, source, extensionDef.mode, extensionDef.filter);
					return result;
				});
			});
		} else return null;
	}
};
/**
* GPU Instancing Extension
*
* Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_mesh_gpu_instancing
*
* @private
*/
var GLTFMeshGpuInstancing = class {
	constructor(parser) {
		this.name = EXTENSIONS.EXT_MESH_GPU_INSTANCING;
		this.parser = parser;
	}
	createNodeMesh(nodeIndex) {
		const json = this.parser.json;
		const nodeDef = json.nodes[nodeIndex];
		if (!nodeDef.extensions || !nodeDef.extensions[this.name] || nodeDef.mesh === void 0) return null;
		const meshDef = json.meshes[nodeDef.mesh];
		for (const primitive of meshDef.primitives) if (primitive.mode !== WEBGL_CONSTANTS.TRIANGLES && primitive.mode !== WEBGL_CONSTANTS.TRIANGLE_STRIP && primitive.mode !== WEBGL_CONSTANTS.TRIANGLE_FAN && primitive.mode !== void 0) return null;
		const attributesDef = nodeDef.extensions[this.name].attributes;
		const pending = [];
		const attributes = {};
		for (const key in attributesDef) pending.push(this.parser.getDependency("accessor", attributesDef[key]).then((accessor) => {
			attributes[key] = accessor;
			return attributes[key];
		}));
		if (pending.length < 1) return null;
		pending.push(this.parser.createNodeMesh(nodeIndex));
		return Promise.all(pending).then((results) => {
			const nodeObject = results.pop();
			const meshes = nodeObject.isGroup ? nodeObject.children : [nodeObject];
			const count = results[0].count;
			const instancedMeshes = [];
			for (const mesh of meshes) {
				const m = new Matrix4();
				const p = new Vector3();
				const q = new Quaternion();
				const s = new Vector3(1, 1, 1);
				const instancedMesh = new InstancedMesh(mesh.geometry, mesh.material, count);
				for (let i = 0; i < count; i++) {
					if (attributes.TRANSLATION) p.fromBufferAttribute(attributes.TRANSLATION, i);
					if (attributes.ROTATION) q.fromBufferAttribute(attributes.ROTATION, i);
					if (attributes.SCALE) s.fromBufferAttribute(attributes.SCALE, i);
					instancedMesh.setMatrixAt(i, m.compose(p, q, s));
				}
				let instanceGeometry = null;
				for (const attributeName in attributes) if (attributeName === "_COLOR_0") {
					const attr = attributes[attributeName];
					instancedMesh.instanceColor = new InstancedBufferAttribute(attr.array, attr.itemSize, attr.normalized);
				} else if (attributeName !== "TRANSLATION" && attributeName !== "ROTATION" && attributeName !== "SCALE") {
					if (instanceGeometry === null) {
						const source = instancedMesh.geometry;
						instanceGeometry = new BufferGeometry();
						instanceGeometry.name = source.name;
						for (const name in source.attributes) instanceGeometry.setAttribute(name, source.attributes[name]);
						for (const name in source.morphAttributes) instanceGeometry.morphAttributes[name] = source.morphAttributes[name];
						if (source.index !== null) instanceGeometry.setIndex(source.index);
						instanceGeometry.morphTargetsRelative = source.morphTargetsRelative;
						for (const group of source.groups) instanceGeometry.addGroup(group.start, group.count, group.materialIndex);
						if (source.boundingBox !== null) instanceGeometry.boundingBox = source.boundingBox.clone();
						if (source.boundingSphere !== null) instanceGeometry.boundingSphere = source.boundingSphere.clone();
						instanceGeometry.drawRange.start = source.drawRange.start;
						instanceGeometry.drawRange.count = source.drawRange.count;
						instanceGeometry.userData = Object.assign({}, source.userData);
						instancedMesh.geometry = instanceGeometry;
					}
					const attr = attributes[attributeName];
					instanceGeometry.setAttribute(attributeName, new InstancedBufferAttribute(attr.array, attr.itemSize, attr.normalized));
				}
				Object3D.prototype.copy.call(instancedMesh, mesh);
				this.parser.assignFinalMaterial(instancedMesh);
				instancedMeshes.push(instancedMesh);
			}
			if (nodeObject.isGroup) {
				nodeObject.clear();
				nodeObject.add(...instancedMeshes);
				return nodeObject;
			}
			return instancedMeshes[0];
		});
	}
};
var BINARY_EXTENSION_HEADER_MAGIC = "glTF";
var BINARY_EXTENSION_HEADER_LENGTH = 12;
var BINARY_EXTENSION_CHUNK_TYPES = {
	JSON: 1313821514,
	BIN: 5130562
};
var GLTFBinaryExtension = class {
	constructor(data) {
		this.name = EXTENSIONS.KHR_BINARY_GLTF;
		this.content = null;
		this.body = null;
		const headerView = new DataView(data, 0, BINARY_EXTENSION_HEADER_LENGTH);
		const textDecoder = new TextDecoder();
		this.header = {
			magic: textDecoder.decode(new Uint8Array(data.slice(0, 4))),
			version: headerView.getUint32(4, true),
			length: headerView.getUint32(8, true)
		};
		if (this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC) throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
		else if (this.header.version < 2) throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
		const chunkContentsLength = this.header.length - BINARY_EXTENSION_HEADER_LENGTH;
		const chunkView = new DataView(data, BINARY_EXTENSION_HEADER_LENGTH);
		let chunkIndex = 0;
		while (chunkIndex < chunkContentsLength) {
			const chunkLength = chunkView.getUint32(chunkIndex, true);
			chunkIndex += 4;
			const chunkType = chunkView.getUint32(chunkIndex, true);
			chunkIndex += 4;
			if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON) {
				const contentArray = new Uint8Array(data, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength);
				this.content = textDecoder.decode(contentArray);
			} else if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN) {
				const byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
				this.body = data.slice(byteOffset, byteOffset + chunkLength);
			}
			chunkIndex += chunkLength;
		}
		if (this.content === null) throw new Error("THREE.GLTFLoader: JSON content not found.");
	}
};
/**
* DRACO Mesh Compression Extension
*
* Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_draco_mesh_compression
*
* @private
*/
var GLTFDracoMeshCompressionExtension = class {
	constructor(json, dracoLoader) {
		if (!dracoLoader) throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
		this.name = EXTENSIONS.KHR_DRACO_MESH_COMPRESSION;
		this.json = json;
		this.dracoLoader = dracoLoader;
		this.dracoLoader.preload();
	}
	decodePrimitive(primitive, parser) {
		const json = this.json;
		const dracoLoader = this.dracoLoader;
		const bufferViewIndex = primitive.extensions[this.name].bufferView;
		const gltfAttributeMap = primitive.extensions[this.name].attributes;
		const threeAttributeMap = {};
		const attributeNormalizedMap = {};
		const attributeTypeMap = {};
		for (const attributeName in gltfAttributeMap) {
			const threeAttributeName = ATTRIBUTES[attributeName] || attributeName.toLowerCase();
			threeAttributeMap[threeAttributeName] = gltfAttributeMap[attributeName];
		}
		for (const attributeName in primitive.attributes) {
			const threeAttributeName = ATTRIBUTES[attributeName] || attributeName.toLowerCase();
			if (gltfAttributeMap[attributeName] !== void 0) {
				const accessorDef = json.accessors[primitive.attributes[attributeName]];
				attributeTypeMap[threeAttributeName] = WEBGL_COMPONENT_TYPES[accessorDef.componentType].name;
				attributeNormalizedMap[threeAttributeName] = accessorDef.normalized === true;
			}
		}
		return parser.getDependency("bufferView", bufferViewIndex).then(function(bufferView) {
			return new Promise(function(resolve, reject) {
				dracoLoader.decodeDracoFile(bufferView, function(geometry) {
					for (const attributeName in geometry.attributes) {
						const attribute = geometry.attributes[attributeName];
						const normalized = attributeNormalizedMap[attributeName];
						if (normalized !== void 0) attribute.normalized = normalized;
					}
					resolve(geometry);
				}, threeAttributeMap, attributeTypeMap, LinearSRGBColorSpace, reject);
			});
		});
	}
};
/**
* Texture Transform Extension
*
* Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_transform
*
* @private
*/
var GLTFTextureTransformExtension = class {
	constructor() {
		this.name = EXTENSIONS.KHR_TEXTURE_TRANSFORM;
	}
	extendTexture(texture, transform) {
		if ((transform.texCoord === void 0 || transform.texCoord === texture.channel) && transform.offset === void 0 && transform.rotation === void 0 && transform.scale === void 0) return texture;
		texture = texture.clone();
		if (transform.texCoord !== void 0) texture.channel = transform.texCoord;
		if (transform.offset !== void 0) texture.offset.fromArray(transform.offset);
		if (transform.rotation !== void 0) texture.rotation = transform.rotation;
		if (transform.scale !== void 0) texture.repeat.fromArray(transform.scale);
		if (transform.rotation !== void 0) {
			const c = Math.cos(texture.rotation);
			const s = Math.sin(texture.rotation);
			texture.matrix.set(texture.repeat.x * c, texture.repeat.y * s, texture.offset.x, -texture.repeat.x * s, texture.repeat.y * c, texture.offset.y, 0, 0, 1);
			texture.matrixAutoUpdate = false;
		}
		texture.needsUpdate = true;
		return texture;
	}
};
/**
* Mesh Quantization Extension
*
* Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_mesh_quantization
*
* @private
*/
var GLTFMeshQuantizationExtension = class {
	constructor() {
		this.name = EXTENSIONS.KHR_MESH_QUANTIZATION;
	}
};
/********** INTERPOLATION ********/
var GLTFCubicSplineInterpolant = class extends Interpolant {
	constructor(parameterPositions, sampleValues, sampleSize, resultBuffer) {
		super(parameterPositions, sampleValues, sampleSize, resultBuffer);
	}
	copySampleValue_(index) {
		const result = this.resultBuffer, values = this.sampleValues, valueSize = this.valueSize, offset = index * valueSize * 3 + valueSize;
		for (let i = 0; i !== valueSize; i++) result[i] = values[offset + i];
		return result;
	}
	interpolate_(i1, t0, t, t1) {
		const result = this.resultBuffer;
		const values = this.sampleValues;
		const stride = this.valueSize;
		const stride2 = stride * 2;
		const stride3 = stride * 3;
		const td = t1 - t0;
		const p = (t - t0) / td;
		const pp = p * p;
		const ppp = pp * p;
		const offset1 = i1 * stride3;
		const offset0 = offset1 - stride3;
		const s2 = -2 * ppp + 3 * pp;
		const s3 = ppp - pp;
		const s0 = 1 - s2;
		const s1 = s3 - pp + p;
		for (let i = 0; i !== stride; i++) {
			const p0 = values[offset0 + i + stride];
			const m0 = values[offset0 + i + stride2] * td;
			const p1 = values[offset1 + i + stride];
			const m1 = values[offset1 + i] * td;
			result[i] = s0 * p0 + s1 * m0 + s2 * p1 + s3 * m1;
		}
		return result;
	}
};
var _quaternion = new Quaternion();
var GLTFCubicSplineQuaternionInterpolant = class extends GLTFCubicSplineInterpolant {
	interpolate_(i1, t0, t, t1) {
		const result = super.interpolate_(i1, t0, t, t1);
		_quaternion.fromArray(result).normalize().toArray(result);
		return result;
	}
};
/********** INTERNALS ************/
var WEBGL_CONSTANTS = {
	FLOAT: 5126,
	FLOAT_MAT3: 35675,
	FLOAT_MAT4: 35676,
	FLOAT_VEC2: 35664,
	FLOAT_VEC3: 35665,
	FLOAT_VEC4: 35666,
	LINEAR: 9729,
	REPEAT: 10497,
	SAMPLER_2D: 35678,
	POINTS: 0,
	LINES: 1,
	LINE_LOOP: 2,
	LINE_STRIP: 3,
	TRIANGLES: 4,
	TRIANGLE_STRIP: 5,
	TRIANGLE_FAN: 6,
	UNSIGNED_BYTE: 5121,
	UNSIGNED_SHORT: 5123
};
var WEBGL_COMPONENT_TYPES = {
	5120: Int8Array,
	5121: Uint8Array,
	5122: Int16Array,
	5123: Uint16Array,
	5125: Uint32Array,
	5126: Float32Array
};
var WEBGL_FILTERS = {
	9728: NearestFilter,
	9729: LinearFilter,
	9984: NearestMipmapNearestFilter,
	9985: LinearMipmapNearestFilter,
	9986: NearestMipmapLinearFilter,
	9987: LinearMipmapLinearFilter
};
var WEBGL_WRAPPINGS = {
	33071: ClampToEdgeWrapping,
	33648: MirroredRepeatWrapping,
	10497: RepeatWrapping
};
var WEBGL_TYPE_SIZES = {
	"SCALAR": 1,
	"VEC2": 2,
	"VEC3": 3,
	"VEC4": 4,
	"MAT2": 4,
	"MAT3": 9,
	"MAT4": 16
};
var ATTRIBUTES = {
	POSITION: "position",
	NORMAL: "normal",
	TANGENT: "tangent",
	TEXCOORD_0: "uv",
	TEXCOORD_1: "uv1",
	TEXCOORD_2: "uv2",
	TEXCOORD_3: "uv3",
	COLOR_0: "color",
	WEIGHTS_0: "skinWeight",
	JOINTS_0: "skinIndex"
};
var PATH_PROPERTIES = {
	scale: "scale",
	translation: "position",
	rotation: "quaternion",
	weights: "morphTargetInfluences"
};
var INTERPOLATION = {
	CUBICSPLINE: void 0,
	LINEAR: InterpolateLinear,
	STEP: InterpolateDiscrete
};
var ALPHA_MODES = {
	OPAQUE: "OPAQUE",
	MASK: "MASK",
	BLEND: "BLEND"
};
/**
* Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#default-material
*
* @private
* @param {Object<string, Material>} cache
* @return {Material}
*/
function createDefaultMaterial(cache) {
	if (cache["DefaultMaterial"] === void 0) cache["DefaultMaterial"] = new MeshStandardMaterial({
		color: 16777215,
		emissive: 0,
		metalness: 1,
		roughness: 1,
		transparent: false,
		depthTest: true,
		side: 0
	});
	return cache["DefaultMaterial"];
}
function addUnknownExtensionsToUserData(knownExtensions, object, objectDef) {
	for (const name in objectDef.extensions) if (knownExtensions[name] === void 0) {
		object.userData.gltfExtensions = object.userData.gltfExtensions || {};
		object.userData.gltfExtensions[name] = objectDef.extensions[name];
	}
}
/**
*
* @private
* @param {Object3D|Material|BufferGeometry|Object|AnimationClip} object
* @param {GLTF.definition} gltfDef
*/
function assignExtrasToUserData(object, gltfDef) {
	if (gltfDef.extras !== void 0) {
		if (typeof gltfDef.extras === "object") Object.assign(object.userData, gltfDef.extras);
		else console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + gltfDef.extras);
	}
}
/**
* Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#morph-targets
*
* @private
* @param {BufferGeometry} geometry
* @param {Array<GLTF.Target>} targets
* @param {GLTFParser} parser
* @return {Promise<BufferGeometry>}
*/
function addMorphTargets(geometry, targets, parser) {
	let hasMorphPosition = false;
	let hasMorphNormal = false;
	let hasMorphColor = false;
	for (let i = 0, il = targets.length; i < il; i++) {
		const target = targets[i];
		if (target.POSITION !== void 0) hasMorphPosition = true;
		if (target.NORMAL !== void 0) hasMorphNormal = true;
		if (target.COLOR_0 !== void 0) hasMorphColor = true;
		if (hasMorphPosition && hasMorphNormal && hasMorphColor) break;
	}
	if (!hasMorphPosition && !hasMorphNormal && !hasMorphColor) return Promise.resolve(geometry);
	const pendingPositionAccessors = [];
	const pendingNormalAccessors = [];
	const pendingColorAccessors = [];
	for (let i = 0, il = targets.length; i < il; i++) {
		const target = targets[i];
		if (hasMorphPosition) {
			const pendingAccessor = target.POSITION !== void 0 ? parser.getDependency("accessor", target.POSITION) : geometry.attributes.position;
			pendingPositionAccessors.push(pendingAccessor);
		}
		if (hasMorphNormal) {
			const pendingAccessor = target.NORMAL !== void 0 ? parser.getDependency("accessor", target.NORMAL) : geometry.attributes.normal;
			pendingNormalAccessors.push(pendingAccessor);
		}
		if (hasMorphColor) {
			const pendingAccessor = target.COLOR_0 !== void 0 ? parser.getDependency("accessor", target.COLOR_0) : geometry.attributes.color;
			pendingColorAccessors.push(pendingAccessor);
		}
	}
	return Promise.all([
		Promise.all(pendingPositionAccessors),
		Promise.all(pendingNormalAccessors),
		Promise.all(pendingColorAccessors)
	]).then(function(accessors) {
		const morphPositions = accessors[0];
		const morphNormals = accessors[1];
		const morphColors = accessors[2];
		if (hasMorphPosition) geometry.morphAttributes.position = morphPositions;
		if (hasMorphNormal) geometry.morphAttributes.normal = morphNormals;
		if (hasMorphColor) geometry.morphAttributes.color = morphColors;
		geometry.morphTargetsRelative = true;
		return geometry;
	});
}
/**
*
* @private
* @param {Mesh} mesh
* @param {GLTF.Mesh} meshDef
*/
function updateMorphTargets(mesh, meshDef) {
	mesh.updateMorphTargets();
	if (meshDef.weights !== void 0) for (let i = 0, il = meshDef.weights.length; i < il; i++) mesh.morphTargetInfluences[i] = meshDef.weights[i];
	if (meshDef.extras && Array.isArray(meshDef.extras.targetNames)) {
		const targetNames = meshDef.extras.targetNames;
		if (mesh.morphTargetInfluences.length === targetNames.length) {
			mesh.morphTargetDictionary = {};
			for (let i = 0, il = targetNames.length; i < il; i++) mesh.morphTargetDictionary[targetNames[i]] = i;
		} else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
	}
}
function createPrimitiveKey(primitiveDef) {
	let geometryKey;
	const dracoExtension = primitiveDef.extensions && primitiveDef.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION];
	if (dracoExtension) geometryKey = "draco:" + dracoExtension.bufferView + ":" + dracoExtension.indices + ":" + createAttributesKey(dracoExtension.attributes);
	else geometryKey = primitiveDef.indices + ":" + createAttributesKey(primitiveDef.attributes) + ":" + primitiveDef.mode;
	if (primitiveDef.targets !== void 0) for (let i = 0, il = primitiveDef.targets.length; i < il; i++) geometryKey += ":" + createAttributesKey(primitiveDef.targets[i]);
	return geometryKey;
}
function createAttributesKey(attributes) {
	let attributesKey = "";
	const keys = Object.keys(attributes).sort();
	for (let i = 0, il = keys.length; i < il; i++) attributesKey += keys[i] + ":" + attributes[keys[i]] + ";";
	return attributesKey;
}
function getNormalizedComponentScale(constructor) {
	switch (constructor) {
		case Int8Array: return 1 / 127;
		case Uint8Array: return 1 / 255;
		case Int16Array: return 1 / 32767;
		case Uint16Array: return 1 / 65535;
		default: throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
	}
}
function getImageURIMimeType(uri) {
	if (uri.search(/\.jpe?g($|\?)/i) > 0 || uri.search(/^data\:image\/jpeg/) === 0) return "image/jpeg";
	if (uri.search(/\.webp($|\?)/i) > 0 || uri.search(/^data\:image\/webp/) === 0) return "image/webp";
	if (uri.search(/\.ktx2($|\?)/i) > 0 || uri.search(/^data\:image\/ktx2/) === 0) return "image/ktx2";
	return "image/png";
}
var _identityMatrix = new Matrix4();
var GLTFParser = class {
	constructor(json = {}, options = {}) {
		this.json = json;
		this.extensions = {};
		this.plugins = {};
		this.options = options;
		this.cache = new GLTFRegistry();
		this.associations = /* @__PURE__ */ new Map();
		this.primitiveCache = {};
		this.nodeCache = {};
		this.meshCache = {
			refs: {},
			uses: {}
		};
		this.cameraCache = {
			refs: {},
			uses: {}
		};
		this.lightCache = {
			refs: {},
			uses: {}
		};
		this.sourceCache = {};
		this.textureCache = {};
		this.nodeNamesUsed = {};
		let isSafari = false;
		let safariVersion = -1;
		let isFirefox = false;
		let firefoxVersion = -1;
		if (typeof navigator !== "undefined" && typeof navigator.userAgent !== "undefined") {
			const userAgent = navigator.userAgent;
			isSafari = /^((?!chrome|android).)*safari/i.test(userAgent) === true;
			const safariMatch = userAgent.match(/Version\/(\d+)/);
			safariVersion = isSafari && safariMatch ? parseInt(safariMatch[1], 10) : -1;
			isFirefox = userAgent.indexOf("Firefox") > -1;
			firefoxVersion = isFirefox ? userAgent.match(/Firefox\/([0-9]+)\./)[1] : -1;
		}
		if (typeof createImageBitmap === "undefined" || isSafari && safariVersion < 17 || isFirefox && firefoxVersion < 98) this.textureLoader = new TextureLoader(this.options.manager);
		else this.textureLoader = new ImageBitmapLoader(this.options.manager);
		this.textureLoader.setCrossOrigin(this.options.crossOrigin);
		this.textureLoader.setRequestHeader(this.options.requestHeader);
		this.fileLoader = new FileLoader(this.options.manager);
		this.fileLoader.setResponseType("arraybuffer");
		if (this.options.crossOrigin === "use-credentials") this.fileLoader.setWithCredentials(true);
	}
	setExtensions(extensions) {
		this.extensions = extensions;
	}
	setPlugins(plugins) {
		this.plugins = plugins;
	}
	parse(onLoad, onError) {
		const parser = this;
		const json = this.json;
		const extensions = this.extensions;
		this.cache.removeAll();
		this.nodeCache = {};
		this._invokeAll(function(ext) {
			return ext._markDefs && ext._markDefs();
		});
		Promise.all(this._invokeAll(function(ext) {
			return ext.beforeRoot && ext.beforeRoot();
		})).then(function() {
			return Promise.all([
				parser.getDependencies("scene"),
				parser.getDependencies("animation"),
				parser.getDependencies("camera")
			]);
		}).then(function(dependencies) {
			const result = {
				scene: dependencies[0][json.scene || 0],
				scenes: dependencies[0],
				animations: dependencies[1],
				cameras: dependencies[2],
				asset: json.asset,
				parser,
				userData: {}
			};
			addUnknownExtensionsToUserData(extensions, result, json);
			assignExtrasToUserData(result, json);
			return Promise.all(parser._invokeAll(function(ext) {
				return ext.afterRoot && ext.afterRoot(result);
			})).then(function() {
				for (const scene of result.scenes) scene.updateMatrixWorld();
				onLoad(result);
			});
		}).catch(onError);
	}
	/**
	* Marks the special nodes/meshes in json for efficient parse.
	*
	* @private
	*/
	_markDefs() {
		const nodeDefs = this.json.nodes || [];
		const skinDefs = this.json.skins || [];
		const meshDefs = this.json.meshes || [];
		for (let skinIndex = 0, skinLength = skinDefs.length; skinIndex < skinLength; skinIndex++) {
			const joints = skinDefs[skinIndex].joints;
			for (let i = 0, il = joints.length; i < il; i++) nodeDefs[joints[i]].isBone = true;
		}
		for (let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex++) {
			const nodeDef = nodeDefs[nodeIndex];
			if (nodeDef.mesh !== void 0) {
				this._addNodeRef(this.meshCache, nodeDef.mesh);
				if (nodeDef.skin !== void 0) meshDefs[nodeDef.mesh].isSkinnedMesh = true;
			}
			if (nodeDef.camera !== void 0) this._addNodeRef(this.cameraCache, nodeDef.camera);
		}
	}
	/**
	* Counts references to shared node / Object3D resources. These resources
	* can be reused, or "instantiated", at multiple nodes in the scene
	* hierarchy. Mesh, Camera, and Light instances are instantiated and must
	* be marked. Non-scenegraph resources (like Materials, Geometries, and
	* Textures) can be reused directly and are not marked here.
	*
	* Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
	*
	* @private
	* @param {Object} cache
	* @param {Object3D} index
	*/
	_addNodeRef(cache, index) {
		if (index === void 0) return;
		if (cache.refs[index] === void 0) cache.refs[index] = cache.uses[index] = 0;
		cache.refs[index]++;
	}
	/**
	* Returns a reference to a shared resource, cloning it if necessary.
	*
	* @private
	* @param {Object} cache
	* @param {number} index
	* @param {Object} object
	* @return {Object}
	*/
	_getNodeRef(cache, index, object) {
		if (cache.refs[index] <= 1) return object;
		const ref = object.clone();
		const updateMappings = (original, clone) => {
			const mappings = this.associations.get(original);
			if (mappings != null) this.associations.set(clone, mappings);
			for (const [i, child] of original.children.entries()) updateMappings(child, clone.children[i]);
		};
		updateMappings(object, ref);
		ref.name += "_instance_" + cache.uses[index]++;
		return ref;
	}
	_invokeOne(func) {
		const extensions = Object.values(this.plugins);
		extensions.push(this);
		for (let i = 0; i < extensions.length; i++) {
			const result = func(extensions[i]);
			if (result) return result;
		}
		return null;
	}
	_invokeAll(func) {
		const extensions = Object.values(this.plugins);
		extensions.unshift(this);
		const pending = [];
		for (let i = 0; i < extensions.length; i++) {
			const result = func(extensions[i]);
			if (result) pending.push(result);
		}
		return pending;
	}
	/**
	* Requests the specified dependency asynchronously, with caching.
	*
	* @private
	* @param {string} type
	* @param {number} index
	* @return {Promise<Object3D|Material|Texture|AnimationClip|ArrayBuffer|Object>}
	*/
	getDependency(type, index) {
		const cacheKey = type + ":" + index;
		let dependency = this.cache.get(cacheKey);
		if (!dependency) {
			switch (type) {
				case "scene":
					dependency = this.loadScene(index);
					break;
				case "node":
					dependency = this._invokeOne(function(ext) {
						return ext.loadNode && ext.loadNode(index);
					});
					break;
				case "mesh":
					dependency = this._invokeOne(function(ext) {
						return ext.loadMesh && ext.loadMesh(index);
					});
					break;
				case "accessor":
					dependency = this.loadAccessor(index);
					break;
				case "bufferView":
					dependency = this._invokeOne(function(ext) {
						return ext.loadBufferView && ext.loadBufferView(index);
					});
					break;
				case "buffer":
					dependency = this.loadBuffer(index);
					break;
				case "material":
					dependency = this._invokeOne(function(ext) {
						return ext.loadMaterial && ext.loadMaterial(index);
					});
					break;
				case "texture":
					dependency = this._invokeOne(function(ext) {
						return ext.loadTexture && ext.loadTexture(index);
					});
					break;
				case "skin":
					dependency = this.loadSkin(index);
					break;
				case "animation":
					dependency = this._invokeOne(function(ext) {
						return ext.loadAnimation && ext.loadAnimation(index);
					});
					break;
				case "camera":
					dependency = this.loadCamera(index);
					break;
				default:
					dependency = this._invokeOne(function(ext) {
						return ext != this && ext.getDependency && ext.getDependency(type, index);
					});
					if (!dependency) throw new Error("Unknown type: " + type);
			}
			this.cache.add(cacheKey, dependency);
		}
		return dependency;
	}
	/**
	* Requests all dependencies of the specified type asynchronously, with caching.
	*
	* @private
	* @param {string} type
	* @return {Promise<Array<Object>>}
	*/
	getDependencies(type) {
		let dependencies = this.cache.get(type);
		if (!dependencies) {
			const parser = this;
			const defs = this.json[type + (type === "mesh" ? "es" : "s")] || [];
			dependencies = Promise.all(defs.map(function(def, index) {
				return parser.getDependency(type, index);
			}));
			this.cache.add(type, dependencies);
		}
		return dependencies;
	}
	/**
	* Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
	*
	* @private
	* @param {number} bufferIndex
	* @return {Promise<ArrayBuffer>}
	*/
	loadBuffer(bufferIndex) {
		const bufferDef = this.json.buffers[bufferIndex];
		const loader = this.fileLoader;
		if (bufferDef.type && bufferDef.type !== "arraybuffer") throw new Error("THREE.GLTFLoader: " + bufferDef.type + " buffer type is not supported.");
		if (bufferDef.uri === void 0 && bufferIndex === 0) return Promise.resolve(this.extensions[EXTENSIONS.KHR_BINARY_GLTF].body);
		const options = this.options;
		return new Promise(function(resolve, reject) {
			loader.load(LoaderUtils.resolveURL(bufferDef.uri, options.path), resolve, void 0, function() {
				reject(/* @__PURE__ */ new Error("THREE.GLTFLoader: Failed to load buffer \"" + bufferDef.uri + "\"."));
			});
		});
	}
	/**
	* Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
	*
	* @private
	* @param {number} bufferViewIndex
	* @return {Promise<ArrayBuffer>}
	*/
	loadBufferView(bufferViewIndex) {
		const bufferViewDef = this.json.bufferViews[bufferViewIndex];
		return this.getDependency("buffer", bufferViewDef.buffer).then(function(buffer) {
			const byteLength = bufferViewDef.byteLength || 0;
			const byteOffset = bufferViewDef.byteOffset || 0;
			return buffer.slice(byteOffset, byteOffset + byteLength);
		});
	}
	/**
	* Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
	*
	* @private
	* @param {number} accessorIndex
	* @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
	*/
	loadAccessor(accessorIndex) {
		const parser = this;
		const json = this.json;
		const accessorDef = this.json.accessors[accessorIndex];
		if (accessorDef.bufferView === void 0 && accessorDef.sparse === void 0) {
			const itemSize = WEBGL_TYPE_SIZES[accessorDef.type];
			const TypedArray = WEBGL_COMPONENT_TYPES[accessorDef.componentType];
			const normalized = accessorDef.normalized === true;
			const array = new TypedArray(accessorDef.count * itemSize);
			return Promise.resolve(new BufferAttribute(array, itemSize, normalized));
		}
		const pendingBufferViews = [];
		if (accessorDef.bufferView !== void 0) pendingBufferViews.push(this.getDependency("bufferView", accessorDef.bufferView));
		else pendingBufferViews.push(null);
		if (accessorDef.sparse !== void 0) {
			pendingBufferViews.push(this.getDependency("bufferView", accessorDef.sparse.indices.bufferView));
			pendingBufferViews.push(this.getDependency("bufferView", accessorDef.sparse.values.bufferView));
		}
		return Promise.all(pendingBufferViews).then(function(bufferViews) {
			const bufferView = bufferViews[0];
			const itemSize = WEBGL_TYPE_SIZES[accessorDef.type];
			const TypedArray = WEBGL_COMPONENT_TYPES[accessorDef.componentType];
			const elementBytes = TypedArray.BYTES_PER_ELEMENT;
			const itemBytes = elementBytes * itemSize;
			const byteOffset = accessorDef.byteOffset || 0;
			const byteStride = accessorDef.bufferView !== void 0 ? json.bufferViews[accessorDef.bufferView].byteStride : void 0;
			const normalized = accessorDef.normalized === true;
			let array, bufferAttribute;
			if (byteStride && byteStride !== itemBytes) {
				const ibSlice = Math.floor(byteOffset / byteStride);
				const ibCacheKey = "InterleavedBuffer:" + accessorDef.bufferView + ":" + accessorDef.componentType + ":" + ibSlice + ":" + accessorDef.count;
				let ib = parser.cache.get(ibCacheKey);
				if (!ib) {
					array = new TypedArray(bufferView, ibSlice * byteStride, accessorDef.count * byteStride / elementBytes);
					ib = new InterleavedBuffer(array, byteStride / elementBytes);
					parser.cache.add(ibCacheKey, ib);
				}
				bufferAttribute = new InterleavedBufferAttribute(ib, itemSize, byteOffset % byteStride / elementBytes, normalized);
			} else {
				if (bufferView === null) array = new TypedArray(accessorDef.count * itemSize);
				else array = new TypedArray(bufferView, byteOffset, accessorDef.count * itemSize);
				bufferAttribute = new BufferAttribute(array, itemSize, normalized);
			}
			if (accessorDef.sparse !== void 0) {
				const itemSizeIndices = WEBGL_TYPE_SIZES.SCALAR;
				const TypedArrayIndices = WEBGL_COMPONENT_TYPES[accessorDef.sparse.indices.componentType];
				const byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0;
				const byteOffsetValues = accessorDef.sparse.values.byteOffset || 0;
				const sparseIndices = new TypedArrayIndices(bufferViews[1], byteOffsetIndices, accessorDef.sparse.count * itemSizeIndices);
				const sparseValues = new TypedArray(bufferViews[2], byteOffsetValues, accessorDef.sparse.count * itemSize);
				if (bufferView !== null) bufferAttribute = new BufferAttribute(bufferAttribute.array.slice(), bufferAttribute.itemSize, bufferAttribute.normalized);
				bufferAttribute.normalized = false;
				for (let i = 0, il = sparseIndices.length; i < il; i++) {
					const index = sparseIndices[i];
					bufferAttribute.setX(index, sparseValues[i * itemSize]);
					if (itemSize >= 2) bufferAttribute.setY(index, sparseValues[i * itemSize + 1]);
					if (itemSize >= 3) bufferAttribute.setZ(index, sparseValues[i * itemSize + 2]);
					if (itemSize >= 4) bufferAttribute.setW(index, sparseValues[i * itemSize + 3]);
					if (itemSize >= 5) throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
				}
				bufferAttribute.normalized = normalized;
			}
			return bufferAttribute;
		});
	}
	/**
	* Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
	*
	* @private
	* @param {number} textureIndex
	* @return {Promise<?Texture>}
	*/
	loadTexture(textureIndex) {
		const json = this.json;
		const options = this.options;
		const sourceIndex = json.textures[textureIndex].source;
		const sourceDef = json.images[sourceIndex];
		let loader = this.textureLoader;
		if (sourceDef.uri) {
			const handler = options.manager.getHandler(sourceDef.uri);
			if (handler !== null) loader = handler;
		}
		return this.loadTextureImage(textureIndex, sourceIndex, loader);
	}
	loadTextureImage(textureIndex, sourceIndex, loader) {
		const parser = this;
		const json = this.json;
		const textureDef = json.textures[textureIndex];
		const sourceDef = json.images[sourceIndex];
		const cacheKey = (sourceDef.uri || sourceDef.bufferView) + ":" + textureDef.sampler;
		if (this.textureCache[cacheKey]) return this.textureCache[cacheKey];
		const promise = this.loadImageSource(sourceIndex, loader).then(function(texture) {
			texture.flipY = false;
			texture.name = textureDef.name || sourceDef.name || "";
			if (texture.name === "" && typeof sourceDef.uri === "string" && sourceDef.uri.startsWith("data:image/") === false) texture.name = sourceDef.uri;
			const sampler = (json.samplers || {})[textureDef.sampler] || {};
			texture.magFilter = WEBGL_FILTERS[sampler.magFilter] || 1006;
			texture.minFilter = WEBGL_FILTERS[sampler.minFilter] || 1008;
			texture.wrapS = WEBGL_WRAPPINGS[sampler.wrapS] || 1e3;
			texture.wrapT = WEBGL_WRAPPINGS[sampler.wrapT] || 1e3;
			texture.generateMipmaps = !texture.isCompressedTexture && texture.minFilter !== 1003 && texture.minFilter !== 1006;
			parser.associations.set(texture, { textures: textureIndex });
			return texture;
		}).catch(function() {
			return null;
		});
		this.textureCache[cacheKey] = promise;
		return promise;
	}
	loadImageSource(sourceIndex, loader) {
		const parser = this;
		const json = this.json;
		const options = this.options;
		if (this.sourceCache[sourceIndex] !== void 0) return this.sourceCache[sourceIndex].then((texture) => texture.clone());
		const sourceDef = json.images[sourceIndex];
		const URL = self.URL || self.webkitURL;
		let sourceURI = sourceDef.uri || "";
		let isObjectURL = false;
		if (sourceDef.bufferView !== void 0) sourceURI = parser.getDependency("bufferView", sourceDef.bufferView).then(function(bufferView) {
			isObjectURL = true;
			const blob = new Blob([bufferView], { type: sourceDef.mimeType });
			sourceURI = URL.createObjectURL(blob);
			return sourceURI;
		});
		else if (sourceDef.uri === void 0) throw new Error("THREE.GLTFLoader: Image " + sourceIndex + " is missing URI and bufferView");
		const promise = Promise.resolve(sourceURI).then(function(sourceURI) {
			return new Promise(function(resolve, reject) {
				let onLoad = resolve;
				if (loader.isImageBitmapLoader === true) onLoad = function(imageBitmap) {
					const texture = new Texture(imageBitmap);
					texture.needsUpdate = true;
					resolve(texture);
				};
				loader.load(LoaderUtils.resolveURL(sourceURI, options.path), onLoad, void 0, reject);
			});
		}).then(function(texture) {
			if (isObjectURL === true) URL.revokeObjectURL(sourceURI);
			assignExtrasToUserData(texture, sourceDef);
			texture.userData.mimeType = sourceDef.mimeType || getImageURIMimeType(sourceDef.uri);
			return texture;
		}).catch(function(error) {
			console.error("THREE.GLTFLoader: Couldn't load texture", sourceURI);
			throw error;
		});
		this.sourceCache[sourceIndex] = promise;
		return promise;
	}
	/**
	* Asynchronously assigns a texture to the given material parameters.
	*
	* @private
	* @param {Object} materialParams
	* @param {string} mapName
	* @param {Object} mapDef
	* @param {string} [colorSpace]
	* @return {Promise<Texture>}
	*/
	assignTexture(materialParams, mapName, mapDef, colorSpace) {
		const parser = this;
		return this.getDependency("texture", mapDef.index).then(function(texture) {
			if (!texture) return null;
			if (mapDef.texCoord !== void 0 && mapDef.texCoord > 0) {
				texture = texture.clone();
				texture.channel = mapDef.texCoord;
			}
			if (parser.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM]) {
				const transform = mapDef.extensions !== void 0 ? mapDef.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM] : void 0;
				if (transform) {
					const gltfReference = parser.associations.get(texture);
					texture = parser.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM].extendTexture(texture, transform);
					parser.associations.set(texture, gltfReference);
				}
			}
			if (colorSpace !== void 0) texture.colorSpace = colorSpace;
			materialParams[mapName] = texture;
			return texture;
		});
	}
	/**
	* Assigns final material to a Mesh, Line, or Points instance. The instance
	* already has a material (generated from the glTF material options alone)
	* but reuse of the same glTF material may require multiple threejs materials
	* to accommodate different primitive types, defines, etc. New materials will
	* be created if necessary, and reused from a cache.
	*
	* @private
	* @param {Object3D} mesh Mesh, Line, or Points instance.
	*/
	assignFinalMaterial(mesh) {
		const geometry = mesh.geometry;
		let material = mesh.material;
		const useDerivativeTangents = geometry.attributes.tangent === void 0;
		const useVertexColors = geometry.attributes.color !== void 0;
		const useFlatShading = geometry.attributes.normal === void 0;
		if (mesh.isPoints) {
			const cacheKey = "PointsMaterial:" + material.uuid;
			let pointsMaterial = this.cache.get(cacheKey);
			if (!pointsMaterial) {
				pointsMaterial = new PointsMaterial();
				Material.prototype.copy.call(pointsMaterial, material);
				pointsMaterial.color.copy(material.color);
				pointsMaterial.map = material.map;
				pointsMaterial.sizeAttenuation = false;
				this.cache.add(cacheKey, pointsMaterial);
			}
			material = pointsMaterial;
		} else if (mesh.isLine) {
			const cacheKey = "LineBasicMaterial:" + material.uuid;
			let lineMaterial = this.cache.get(cacheKey);
			if (!lineMaterial) {
				lineMaterial = new LineBasicMaterial();
				Material.prototype.copy.call(lineMaterial, material);
				lineMaterial.color.copy(material.color);
				lineMaterial.map = material.map;
				this.cache.add(cacheKey, lineMaterial);
			}
			material = lineMaterial;
		}
		if (useDerivativeTangents || useVertexColors || useFlatShading) {
			let cacheKey = "ClonedMaterial:" + material.uuid + ":";
			if (useDerivativeTangents) cacheKey += "derivative-tangents:";
			if (useVertexColors) cacheKey += "vertex-colors:";
			if (useFlatShading) cacheKey += "flat-shading:";
			let cachedMaterial = this.cache.get(cacheKey);
			if (!cachedMaterial) {
				cachedMaterial = material.clone();
				if (useVertexColors) cachedMaterial.vertexColors = true;
				if (useFlatShading) cachedMaterial.flatShading = true;
				if (useDerivativeTangents) {
					if (cachedMaterial.normalScale) cachedMaterial.normalScale.y *= -1;
					if (cachedMaterial.clearcoatNormalScale) cachedMaterial.clearcoatNormalScale.y *= -1;
				}
				this.cache.add(cacheKey, cachedMaterial);
				this.associations.set(cachedMaterial, this.associations.get(material));
			}
			material = cachedMaterial;
		}
		mesh.material = material;
	}
	getMaterialType() {
		return MeshStandardMaterial;
	}
	/**
	* Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
	*
	* @private
	* @param {number} materialIndex
	* @return {Promise<Material>}
	*/
	loadMaterial(materialIndex) {
		const parser = this;
		const json = this.json;
		const extensions = this.extensions;
		const materialDef = json.materials[materialIndex];
		let materialType;
		const materialParams = {};
		const materialExtensions = materialDef.extensions || {};
		const pending = [];
		if (materialExtensions[EXTENSIONS.KHR_MATERIALS_UNLIT]) {
			const kmuExtension = extensions[EXTENSIONS.KHR_MATERIALS_UNLIT];
			materialType = kmuExtension.getMaterialType();
			pending.push(kmuExtension.extendParams(materialParams, materialDef, parser));
		} else {
			const metallicRoughness = materialDef.pbrMetallicRoughness || {};
			materialParams.color = new Color(1, 1, 1);
			materialParams.opacity = 1;
			if (Array.isArray(metallicRoughness.baseColorFactor)) {
				const array = metallicRoughness.baseColorFactor;
				materialParams.color.setRGB(array[0], array[1], array[2], LinearSRGBColorSpace);
				materialParams.opacity = array[3];
			}
			if (metallicRoughness.baseColorTexture !== void 0) pending.push(parser.assignTexture(materialParams, "map", metallicRoughness.baseColorTexture, SRGBColorSpace));
			materialParams.metalness = metallicRoughness.metallicFactor !== void 0 ? metallicRoughness.metallicFactor : 1;
			materialParams.roughness = metallicRoughness.roughnessFactor !== void 0 ? metallicRoughness.roughnessFactor : 1;
			if (metallicRoughness.metallicRoughnessTexture !== void 0) {
				pending.push(parser.assignTexture(materialParams, "metalnessMap", metallicRoughness.metallicRoughnessTexture));
				pending.push(parser.assignTexture(materialParams, "roughnessMap", metallicRoughness.metallicRoughnessTexture));
			}
			materialType = this._invokeOne(function(ext) {
				return ext.getMaterialType && ext.getMaterialType(materialIndex);
			});
			pending.push(Promise.all(this._invokeAll(function(ext) {
				return ext.extendMaterialParams && ext.extendMaterialParams(materialIndex, materialParams);
			})));
		}
		if (materialDef.doubleSided === true) materialParams.side = 2;
		const alphaMode = materialDef.alphaMode || ALPHA_MODES.OPAQUE;
		if (alphaMode === ALPHA_MODES.BLEND) {
			materialParams.transparent = true;
			materialParams.depthWrite = false;
		} else {
			materialParams.transparent = false;
			if (alphaMode === ALPHA_MODES.MASK) materialParams.alphaTest = materialDef.alphaCutoff !== void 0 ? materialDef.alphaCutoff : .5;
		}
		if (materialDef.normalTexture !== void 0 && materialType !== MeshBasicMaterial) {
			pending.push(parser.assignTexture(materialParams, "normalMap", materialDef.normalTexture));
			materialParams.normalScale = new Vector2(1, 1);
			if (materialDef.normalTexture.scale !== void 0) {
				const scale = materialDef.normalTexture.scale;
				materialParams.normalScale.set(scale, scale);
			}
		}
		if (materialDef.occlusionTexture !== void 0 && materialType !== MeshBasicMaterial) {
			pending.push(parser.assignTexture(materialParams, "aoMap", materialDef.occlusionTexture));
			if (materialDef.occlusionTexture.strength !== void 0) materialParams.aoMapIntensity = materialDef.occlusionTexture.strength;
		}
		if (materialDef.emissiveFactor !== void 0 && materialType !== MeshBasicMaterial) {
			const emissiveFactor = materialDef.emissiveFactor;
			materialParams.emissive = new Color().setRGB(emissiveFactor[0], emissiveFactor[1], emissiveFactor[2], LinearSRGBColorSpace);
		}
		if (materialDef.emissiveTexture !== void 0 && materialType !== MeshBasicMaterial) pending.push(parser.assignTexture(materialParams, "emissiveMap", materialDef.emissiveTexture, SRGBColorSpace));
		return Promise.all(pending).then(function() {
			const material = new materialType(materialParams);
			if (materialDef.name) material.name = materialDef.name;
			assignExtrasToUserData(material, materialDef);
			parser.associations.set(material, { materials: materialIndex });
			if (materialDef.extensions) addUnknownExtensionsToUserData(extensions, material, materialDef);
			return material;
		});
	}
	/**
	* When Object3D instances are targeted by animation, they need unique names.
	*
	* @private
	* @param {string} originalName
	* @return {string}
	*/
	createUniqueName(originalName) {
		const sanitizedName = PropertyBinding.sanitizeNodeName(originalName || "");
		if (sanitizedName in this.nodeNamesUsed) return sanitizedName + "_" + ++this.nodeNamesUsed[sanitizedName];
		else {
			this.nodeNamesUsed[sanitizedName] = 0;
			return sanitizedName;
		}
	}
	/**
	* Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
	*
	* Creates BufferGeometries from primitives.
	*
	* @private
	* @param {Array<GLTF.Primitive>} primitives
	* @return {Promise<Array<BufferGeometry>>}
	*/
	loadGeometries(primitives) {
		const parser = this;
		const extensions = this.extensions;
		const cache = this.primitiveCache;
		function createDracoPrimitive(primitive) {
			return extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(primitive, parser).then(function(geometry) {
				return addPrimitiveAttributes(geometry, primitive, parser);
			});
		}
		const pending = [];
		for (let i = 0, il = primitives.length; i < il; i++) {
			const primitive = primitives[i];
			const cacheKey = createPrimitiveKey(primitive);
			const cached = cache[cacheKey];
			if (cached) pending.push(cached.promise);
			else {
				let geometryPromise;
				if (primitive.extensions && primitive.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION]) geometryPromise = createDracoPrimitive(primitive);
				else geometryPromise = addPrimitiveAttributes(new BufferGeometry(), primitive, parser);
				if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP) geometryPromise = geometryPromise.then((geometry) => toTrianglesDrawMode(geometry, 1));
				else if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN) geometryPromise = geometryPromise.then((geometry) => toTrianglesDrawMode(geometry, 2));
				cache[cacheKey] = {
					primitive,
					promise: geometryPromise
				};
				pending.push(geometryPromise);
			}
		}
		return Promise.all(pending);
	}
	/**
	* Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
	*
	* @private
	* @param {number} meshIndex
	* @return {Promise<Group|Mesh|SkinnedMesh|Line|Points>}
	*/
	loadMesh(meshIndex) {
		const parser = this;
		const json = this.json;
		const extensions = this.extensions;
		const meshDef = json.meshes[meshIndex];
		const primitives = meshDef.primitives;
		const pending = [];
		for (let i = 0, il = primitives.length; i < il; i++) {
			const material = primitives[i].material === void 0 ? createDefaultMaterial(this.cache) : this.getDependency("material", primitives[i].material);
			pending.push(material);
		}
		pending.push(parser.loadGeometries(primitives));
		return Promise.all(pending).then(async function(results) {
			const materials = results.slice(0, results.length - 1);
			const geometries = results[results.length - 1];
			const meshes = [];
			for (let i = 0, il = geometries.length; i < il; i++) {
				const geometry = geometries[i];
				const primitive = primitives[i];
				let mesh;
				const material = materials[i];
				if (primitive.mode === WEBGL_CONSTANTS.TRIANGLES || primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP || primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN || primitive.mode === void 0) {
					const needsSkinning = meshDef.isSkinnedMesh === true;
					const hasSkinningAttributes = geometry.hasAttribute("skinIndex") && geometry.hasAttribute("skinWeight");
					if (needsSkinning && hasSkinningAttributes === false) console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled.");
					mesh = needsSkinning && hasSkinningAttributes ? new SkinnedMesh(geometry, material) : new Mesh(geometry, material);
					if (mesh.isSkinnedMesh === true) mesh.normalizeSkinWeights();
				} else if (primitive.mode === WEBGL_CONSTANTS.LINES) mesh = new LineSegments(geometry, material);
				else if (primitive.mode === WEBGL_CONSTANTS.LINE_STRIP) mesh = new Line(geometry, material);
				else if (primitive.mode === WEBGL_CONSTANTS.LINE_LOOP) mesh = new LineLoop(geometry, material);
				else if (primitive.mode === WEBGL_CONSTANTS.POINTS) mesh = new Points(geometry, material);
				else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + primitive.mode);
				if (Object.keys(mesh.geometry.morphAttributes).length > 0) updateMorphTargets(mesh, meshDef);
				mesh.name = parser.createUniqueName(meshDef.name || "mesh_" + meshIndex);
				assignExtrasToUserData(mesh, meshDef);
				if (primitive.extensions) addUnknownExtensionsToUserData(extensions, mesh, primitive);
				parser.assignFinalMaterial(mesh);
				meshes.push(mesh);
			}
			for (let i = 0, il = meshes.length; i < il; i++) parser.associations.set(meshes[i], {
				meshes: meshIndex,
				primitives: i
			});
			if (meshes.length === 1) {
				if (meshDef.extensions) addUnknownExtensionsToUserData(extensions, meshes[0], meshDef);
				return meshes[0];
			}
			const group = new Group();
			if (meshDef.extensions) addUnknownExtensionsToUserData(extensions, group, meshDef);
			parser.associations.set(group, { meshes: meshIndex });
			for (let i = 0, il = meshes.length; i < il; i++) group.add(meshes[i]);
			return group;
		});
	}
	/**
	* Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
	*
	* @private
	* @param {number} cameraIndex
	* @return {Promise<Camera>|undefined}
	*/
	loadCamera(cameraIndex) {
		let camera;
		const cameraDef = this.json.cameras[cameraIndex];
		const params = cameraDef[cameraDef.type];
		if (!params) {
			console.warn("THREE.GLTFLoader: Missing camera parameters.");
			return;
		}
		if (cameraDef.type === "perspective") camera = new PerspectiveCamera(MathUtils.radToDeg(params.yfov), params.aspectRatio || 1, params.znear || 1, params.zfar || 2e6);
		else if (cameraDef.type === "orthographic") camera = new OrthographicCamera(-params.xmag, params.xmag, params.ymag, -params.ymag, params.znear, params.zfar);
		if (cameraDef.name) camera.name = this.createUniqueName(cameraDef.name);
		assignExtrasToUserData(camera, cameraDef);
		return Promise.resolve(camera);
	}
	/**
	* Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
	*
	* @private
	* @param {number} skinIndex
	* @return {Promise<Skeleton>}
	*/
	loadSkin(skinIndex) {
		const skinDef = this.json.skins[skinIndex];
		const pending = [];
		for (let i = 0, il = skinDef.joints.length; i < il; i++) pending.push(this._loadNodeShallow(skinDef.joints[i]));
		if (skinDef.inverseBindMatrices !== void 0) pending.push(this.getDependency("accessor", skinDef.inverseBindMatrices));
		else pending.push(null);
		return Promise.all(pending).then(function(results) {
			const inverseBindMatrices = results.pop();
			const jointNodes = results;
			const bones = [];
			const boneInverses = [];
			for (let i = 0, il = jointNodes.length; i < il; i++) {
				const jointNode = jointNodes[i];
				if (jointNode) {
					bones.push(jointNode);
					const mat = new Matrix4();
					if (inverseBindMatrices !== null) mat.fromArray(inverseBindMatrices.array, i * 16);
					boneInverses.push(mat);
				} else console.warn("THREE.GLTFLoader: Joint \"%s\" could not be found.", skinDef.joints[i]);
			}
			return new Skeleton(bones, boneInverses);
		});
	}
	/**
	* Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
	*
	* @private
	* @param {number} animationIndex
	* @return {Promise<AnimationClip>}
	*/
	loadAnimation(animationIndex) {
		const json = this.json;
		const parser = this;
		const animationDef = json.animations[animationIndex];
		const animationName = animationDef.name ? animationDef.name : "animation_" + animationIndex;
		const pendingNodes = [];
		const pendingInputAccessors = [];
		const pendingOutputAccessors = [];
		const pendingSamplers = [];
		const pendingTargets = [];
		for (let i = 0, il = animationDef.channels.length; i < il; i++) {
			const channel = animationDef.channels[i];
			const sampler = animationDef.samplers[channel.sampler];
			const target = channel.target;
			const name = target.node;
			const input = animationDef.parameters !== void 0 ? animationDef.parameters[sampler.input] : sampler.input;
			const output = animationDef.parameters !== void 0 ? animationDef.parameters[sampler.output] : sampler.output;
			if (target.node === void 0) continue;
			pendingNodes.push(this.getDependency("node", name));
			pendingInputAccessors.push(this.getDependency("accessor", input));
			pendingOutputAccessors.push(this.getDependency("accessor", output));
			pendingSamplers.push(sampler);
			pendingTargets.push(target);
		}
		return Promise.all([
			Promise.all(pendingNodes),
			Promise.all(pendingInputAccessors),
			Promise.all(pendingOutputAccessors),
			Promise.all(pendingSamplers),
			Promise.all(pendingTargets)
		]).then(function(dependencies) {
			const nodes = dependencies[0];
			const inputAccessors = dependencies[1];
			const outputAccessors = dependencies[2];
			const samplers = dependencies[3];
			const targets = dependencies[4];
			const tracks = [];
			for (let i = 0, il = nodes.length; i < il; i++) {
				const node = nodes[i];
				const inputAccessor = inputAccessors[i];
				const outputAccessor = outputAccessors[i];
				const sampler = samplers[i];
				const target = targets[i];
				if (node === void 0) continue;
				if (node.updateMatrix) node.updateMatrix();
				const createdTracks = parser._createAnimationTracks(node, inputAccessor, outputAccessor, sampler, target);
				if (createdTracks) for (let k = 0; k < createdTracks.length; k++) tracks.push(createdTracks[k]);
			}
			const animation = new AnimationClip(animationName, void 0, tracks);
			assignExtrasToUserData(animation, animationDef);
			return animation;
		});
	}
	createNodeMesh(nodeIndex) {
		const json = this.json;
		const parser = this;
		const nodeDef = json.nodes[nodeIndex];
		if (nodeDef.mesh === void 0) return null;
		return parser.getDependency("mesh", nodeDef.mesh).then(function(mesh) {
			const node = parser._getNodeRef(parser.meshCache, nodeDef.mesh, mesh);
			if (nodeDef.weights !== void 0) node.traverse(function(o) {
				if (!o.isMesh) return;
				for (let i = 0, il = nodeDef.weights.length; i < il; i++) o.morphTargetInfluences[i] = nodeDef.weights[i];
			});
			return node;
		});
	}
	/**
	* Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
	*
	* @private
	* @param {number} nodeIndex
	* @return {Promise<Object3D>}
	*/
	loadNode(nodeIndex) {
		const json = this.json;
		const parser = this;
		const nodeDef = json.nodes[nodeIndex];
		const nodePending = parser._loadNodeShallow(nodeIndex);
		const childPending = [];
		const childrenDef = nodeDef.children || [];
		for (let i = 0, il = childrenDef.length; i < il; i++) childPending.push(parser.getDependency("node", childrenDef[i]));
		const skeletonPending = nodeDef.skin === void 0 ? Promise.resolve(null) : parser.getDependency("skin", nodeDef.skin);
		return Promise.all([
			nodePending,
			Promise.all(childPending),
			skeletonPending
		]).then(function(results) {
			const node = results[0];
			const children = results[1];
			const skeleton = results[2];
			if (skeleton !== null) node.traverse(function(mesh) {
				if (!mesh.isSkinnedMesh) return;
				mesh.bind(skeleton, _identityMatrix);
			});
			for (let i = 0, il = children.length; i < il; i++) node.add(children[i]);
			if (node.userData.pivot !== void 0 && children.length > 0) {
				const pivot = node.userData.pivot;
				const pivotChild = children[0];
				node.pivot = new Vector3().fromArray(pivot);
				node.position.x -= pivot[0];
				node.position.y -= pivot[1];
				node.position.z -= pivot[2];
				pivotChild.position.set(0, 0, 0);
				delete node.userData.pivot;
			}
			return node;
		});
	}
	_loadNodeShallow(nodeIndex) {
		const json = this.json;
		const extensions = this.extensions;
		const parser = this;
		if (this.nodeCache[nodeIndex] !== void 0) return this.nodeCache[nodeIndex];
		const nodeDef = json.nodes[nodeIndex];
		const nodeName = nodeDef.name ? parser.createUniqueName(nodeDef.name) : "";
		const pending = [];
		const meshPromise = parser._invokeOne(function(ext) {
			return ext.createNodeMesh && ext.createNodeMesh(nodeIndex);
		});
		if (meshPromise) pending.push(meshPromise);
		if (nodeDef.camera !== void 0) pending.push(parser.getDependency("camera", nodeDef.camera).then(function(camera) {
			return parser._getNodeRef(parser.cameraCache, nodeDef.camera, camera);
		}));
		parser._invokeAll(function(ext) {
			return ext.createNodeAttachment && ext.createNodeAttachment(nodeIndex);
		}).forEach(function(promise) {
			pending.push(promise);
		});
		this.nodeCache[nodeIndex] = Promise.all(pending).then(function(objects) {
			let node;
			if (nodeDef.isBone === true) node = new Bone();
			else if (objects.length > 1) node = new Group();
			else if (objects.length === 1) node = objects[0];
			else node = new Object3D();
			if (node !== objects[0]) for (let i = 0, il = objects.length; i < il; i++) node.add(objects[i]);
			if (nodeDef.name) {
				node.userData.name = nodeDef.name;
				node.name = nodeName;
			}
			assignExtrasToUserData(node, nodeDef);
			if (nodeDef.extensions) addUnknownExtensionsToUserData(extensions, node, nodeDef);
			if (nodeDef.matrix !== void 0) {
				const matrix = new Matrix4();
				matrix.fromArray(nodeDef.matrix);
				node.applyMatrix4(matrix);
			} else {
				if (nodeDef.translation !== void 0) node.position.fromArray(nodeDef.translation);
				if (nodeDef.rotation !== void 0) node.quaternion.fromArray(nodeDef.rotation);
				if (nodeDef.scale !== void 0) node.scale.fromArray(nodeDef.scale);
			}
			if (!parser.associations.has(node)) parser.associations.set(node, {});
			else if (nodeDef.mesh !== void 0 && parser.meshCache.refs[nodeDef.mesh] > 1) {
				const mapping = parser.associations.get(node);
				parser.associations.set(node, { ...mapping });
			}
			parser.associations.get(node).nodes = nodeIndex;
			return node;
		});
		return this.nodeCache[nodeIndex];
	}
	/**
	* Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
	*
	* @private
	* @param {number} sceneIndex
	* @return {Promise<Group>}
	*/
	loadScene(sceneIndex) {
		const extensions = this.extensions;
		const sceneDef = this.json.scenes[sceneIndex];
		const parser = this;
		const scene = new Group();
		if (sceneDef.name) scene.name = parser.createUniqueName(sceneDef.name);
		assignExtrasToUserData(scene, sceneDef);
		if (sceneDef.extensions) addUnknownExtensionsToUserData(extensions, scene, sceneDef);
		const nodeIds = sceneDef.nodes || [];
		const pending = [];
		for (let i = 0, il = nodeIds.length; i < il; i++) pending.push(parser.getDependency("node", nodeIds[i]));
		return Promise.all(pending).then(function(nodes) {
			for (let i = 0, il = nodes.length; i < il; i++) {
				const node = nodes[i];
				if (node.parent !== null) scene.add(clone(node));
				else scene.add(node);
			}
			const reduceAssociations = (node) => {
				const reducedAssociations = /* @__PURE__ */ new Map();
				for (const [key, value] of parser.associations) if (key instanceof Material || key instanceof Texture) reducedAssociations.set(key, value);
				node.traverse((node) => {
					const mappings = parser.associations.get(node);
					if (mappings != null) reducedAssociations.set(node, mappings);
				});
				return reducedAssociations;
			};
			parser.associations = reduceAssociations(scene);
			return scene;
		});
	}
	_createAnimationTracks(node, inputAccessor, outputAccessor, sampler, target) {
		const tracks = [];
		const targetName = node.name ? node.name : node.uuid;
		const targetNames = [];
		function collectMorphTargets(object) {
			if (object.morphTargetInfluences) targetNames.push(object.name ? object.name : object.uuid);
		}
		if (PATH_PROPERTIES[target.path] === PATH_PROPERTIES.weights) {
			collectMorphTargets(node);
			if (node.isGroup) node.children.forEach(collectMorphTargets);
		} else targetNames.push(targetName);
		let TypedKeyframeTrack;
		switch (PATH_PROPERTIES[target.path]) {
			case PATH_PROPERTIES.weights:
				TypedKeyframeTrack = NumberKeyframeTrack;
				break;
			case PATH_PROPERTIES.rotation:
				TypedKeyframeTrack = QuaternionKeyframeTrack;
				break;
			case PATH_PROPERTIES.translation:
			case PATH_PROPERTIES.scale:
				TypedKeyframeTrack = VectorKeyframeTrack;
				break;
			default: switch (outputAccessor.itemSize) {
				case 1:
					TypedKeyframeTrack = NumberKeyframeTrack;
					break;
				default: TypedKeyframeTrack = VectorKeyframeTrack;
			}
		}
		const interpolation = sampler.interpolation !== void 0 ? INTERPOLATION[sampler.interpolation] : InterpolateLinear;
		const outputArray = this._getArrayFromAccessor(outputAccessor);
		for (let j = 0, jl = targetNames.length; j < jl; j++) {
			const track = new TypedKeyframeTrack(targetNames[j] + "." + PATH_PROPERTIES[target.path], inputAccessor.array, outputArray, interpolation);
			if (sampler.interpolation === "CUBICSPLINE") this._createCubicSplineTrackInterpolant(track);
			tracks.push(track);
		}
		return tracks;
	}
	_getArrayFromAccessor(accessor) {
		let outputArray = accessor.array;
		if (accessor.normalized) {
			const scale = getNormalizedComponentScale(outputArray.constructor);
			const scaled = new Float32Array(outputArray.length);
			for (let j = 0, jl = outputArray.length; j < jl; j++) scaled[j] = outputArray[j] * scale;
			outputArray = scaled;
		}
		return outputArray;
	}
	_createCubicSplineTrackInterpolant(track) {
		track.createInterpolant = function InterpolantFactoryMethodGLTFCubicSpline(result) {
			return new (this instanceof QuaternionKeyframeTrack ? GLTFCubicSplineQuaternionInterpolant : GLTFCubicSplineInterpolant)(this.times, this.values, this.getValueSize() / 3, result);
		};
		track.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;
	}
};
/**
*
* @private
* @param {BufferGeometry} geometry
* @param {GLTF.Primitive} primitiveDef
* @param {GLTFParser} parser
*/
function computeBounds(geometry, primitiveDef, parser) {
	const attributes = primitiveDef.attributes;
	const box = new Box3();
	if (attributes.POSITION !== void 0) {
		const accessor = parser.json.accessors[attributes.POSITION];
		const min = accessor.min;
		const max = accessor.max;
		if (min !== void 0 && max !== void 0) {
			box.set(new Vector3(min[0], min[1], min[2]), new Vector3(max[0], max[1], max[2]));
			if (accessor.normalized) {
				const boxScale = getNormalizedComponentScale(WEBGL_COMPONENT_TYPES[accessor.componentType]);
				box.min.multiplyScalar(boxScale);
				box.max.multiplyScalar(boxScale);
			}
		} else {
			console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
			return;
		}
	} else return;
	const targets = primitiveDef.targets;
	if (targets !== void 0) {
		const maxDisplacement = new Vector3();
		const vector = new Vector3();
		for (let i = 0, il = targets.length; i < il; i++) {
			const target = targets[i];
			if (target.POSITION !== void 0) {
				const accessor = parser.json.accessors[target.POSITION];
				const min = accessor.min;
				const max = accessor.max;
				if (min !== void 0 && max !== void 0) {
					vector.setX(Math.max(Math.abs(min[0]), Math.abs(max[0])));
					vector.setY(Math.max(Math.abs(min[1]), Math.abs(max[1])));
					vector.setZ(Math.max(Math.abs(min[2]), Math.abs(max[2])));
					if (accessor.normalized) {
						const boxScale = getNormalizedComponentScale(WEBGL_COMPONENT_TYPES[accessor.componentType]);
						vector.multiplyScalar(boxScale);
					}
					maxDisplacement.max(vector);
				} else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
			}
		}
		box.expandByVector(maxDisplacement);
	}
	geometry.boundingBox = box;
	const sphere = new Sphere();
	box.getCenter(sphere.center);
	sphere.radius = box.min.distanceTo(box.max) / 2;
	geometry.boundingSphere = sphere;
}
/**
*
* @private
* @param {BufferGeometry} geometry
* @param {GLTF.Primitive} primitiveDef
* @param {GLTFParser} parser
* @return {Promise<BufferGeometry>}
*/
function addPrimitiveAttributes(geometry, primitiveDef, parser) {
	const attributes = primitiveDef.attributes;
	const pending = [];
	function assignAttributeAccessor(accessorIndex, attributeName) {
		return parser.getDependency("accessor", accessorIndex).then(function(accessor) {
			geometry.setAttribute(attributeName, accessor);
		});
	}
	for (const gltfAttributeName in attributes) {
		const threeAttributeName = ATTRIBUTES[gltfAttributeName] || gltfAttributeName.toLowerCase();
		if (threeAttributeName in geometry.attributes) continue;
		pending.push(assignAttributeAccessor(attributes[gltfAttributeName], threeAttributeName));
	}
	if (primitiveDef.indices !== void 0 && !geometry.index) {
		const accessor = parser.getDependency("accessor", primitiveDef.indices).then(function(accessor) {
			geometry.setIndex(accessor);
		});
		pending.push(accessor);
	}
	if (ColorManagement.workingColorSpace !== "srgb-linear" && "COLOR_0" in attributes) console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${ColorManagement.workingColorSpace}" not supported.`);
	assignExtrasToUserData(geometry, primitiveDef);
	computeBounds(geometry, primitiveDef, parser);
	return Promise.all(pending).then(function() {
		return primitiveDef.targets !== void 0 ? addMorphTargets(geometry, primitiveDef.targets, parser) : geometry;
	});
}
// node_modules/three/examples/jsm/libs/motion-controllers.module.js
/**
* @webxr-input-profiles/motion-controllers 1.0.0 https://github.com/immersive-web/webxr-input-profiles
*/
var Constants = {
	Handedness: Object.freeze({
		NONE: "none",
		LEFT: "left",
		RIGHT: "right"
	}),
	ComponentState: Object.freeze({
		DEFAULT: "default",
		TOUCHED: "touched",
		PRESSED: "pressed"
	}),
	ComponentProperty: Object.freeze({
		BUTTON: "button",
		X_AXIS: "xAxis",
		Y_AXIS: "yAxis",
		STATE: "state"
	}),
	ComponentType: Object.freeze({
		TRIGGER: "trigger",
		SQUEEZE: "squeeze",
		TOUCHPAD: "touchpad",
		THUMBSTICK: "thumbstick",
		BUTTON: "button"
	}),
	ButtonTouchThreshold: .05,
	AxisTouchThreshold: .1,
	VisualResponseProperty: Object.freeze({
		TRANSFORM: "transform",
		VISIBILITY: "visibility"
	})
};
/**
* @description Static helper function to fetch a JSON file and turn it into a JS object
* @param {string} path - Path to JSON file to be fetched
*/
async function fetchJsonFile(path) {
	const response = await fetch(path);
	if (!response.ok) throw new Error(response.statusText);
	else return response.json();
}
async function fetchProfilesList(basePath) {
	if (!basePath) throw new Error("No basePath supplied");
	return await fetchJsonFile(`${basePath}/profilesList.json`);
}
async function fetchProfile(xrInputSource, basePath, defaultProfile = null, getAssetPath = true) {
	if (!xrInputSource) throw new Error("No xrInputSource supplied");
	if (!basePath) throw new Error("No basePath supplied");
	const supportedProfilesList = await fetchProfilesList(basePath);
	let match;
	xrInputSource.profiles.some((profileId) => {
		const supportedProfile = supportedProfilesList[profileId];
		if (supportedProfile) match = {
			profileId,
			profilePath: `${basePath}/${supportedProfile.path}`,
			deprecated: !!supportedProfile.deprecated
		};
		return !!match;
	});
	if (!match) {
		if (!defaultProfile) throw new Error("No matching profile name found");
		const supportedProfile = supportedProfilesList[defaultProfile];
		if (!supportedProfile) throw new Error(`No matching profile name found and default profile "${defaultProfile}" missing.`);
		match = {
			profileId: defaultProfile,
			profilePath: `${basePath}/${supportedProfile.path}`,
			deprecated: !!supportedProfile.deprecated
		};
	}
	const profile = await fetchJsonFile(match.profilePath);
	let assetPath;
	if (getAssetPath) {
		let layout;
		if (xrInputSource.handedness === "any") layout = profile.layouts[Object.keys(profile.layouts)[0]];
		else layout = profile.layouts[xrInputSource.handedness];
		if (!layout) throw new Error(`No matching handedness, ${xrInputSource.handedness}, in profile ${match.profileId}`);
		if (layout.assetPath) assetPath = match.profilePath.replace("profile.json", layout.assetPath);
	}
	return {
		profile,
		assetPath
	};
}
/** @constant {Object} */
var defaultComponentValues = {
	xAxis: 0,
	yAxis: 0,
	button: 0,
	state: Constants.ComponentState.DEFAULT
};
/**
* @description Converts an X, Y coordinate from the range -1 to 1 (as reported by the Gamepad
* API) to the range 0 to 1 (for interpolation). Also caps the X, Y values to be bounded within
* a circle. This ensures that thumbsticks are not animated outside the bounds of their physical
* range of motion and touchpads do not report touch locations off their physical bounds.
* @param {number} x The original x coordinate in the range -1 to 1
* @param {number} y The original y coordinate in the range -1 to 1
*/
function normalizeAxes(x = 0, y = 0) {
	let xAxis = x;
	let yAxis = y;
	if (Math.sqrt(x * x + y * y) > 1) {
		const theta = Math.atan2(y, x);
		xAxis = Math.cos(theta);
		yAxis = Math.sin(theta);
	}
	return {
		normalizedXAxis: xAxis * .5 + .5,
		normalizedYAxis: yAxis * .5 + .5
	};
}
/**
* Contains the description of how the 3D model should visually respond to a specific user input.
* This is accomplished by initializing the object with the name of a node in the 3D model and
* property that need to be modified in response to user input, the name of the nodes representing
* the allowable range of motion, and the name of the input which triggers the change. In response
* to the named input changing, this object computes the appropriate weighting to use for
* interpolating between the range of motion nodes.
*/
var VisualResponse = class {
	constructor(visualResponseDescription) {
		this.componentProperty = visualResponseDescription.componentProperty;
		this.states = visualResponseDescription.states;
		this.valueNodeName = visualResponseDescription.valueNodeName;
		this.valueNodeProperty = visualResponseDescription.valueNodeProperty;
		if (this.valueNodeProperty === Constants.VisualResponseProperty.TRANSFORM) {
			this.minNodeName = visualResponseDescription.minNodeName;
			this.maxNodeName = visualResponseDescription.maxNodeName;
		}
		this.value = 0;
		this.updateFromComponent(defaultComponentValues);
	}
	/**
	* Computes the visual response's interpolation weight based on component state
	* @param {Object} componentValues - The component from which to update
	* @param {number} xAxis - The reported X axis value of the component
	* @param {number} yAxis - The reported Y axis value of the component
	* @param {number} button - The reported value of the component's button
	* @param {string} state - The component's active state
	*/
	updateFromComponent({ xAxis, yAxis, button, state }) {
		const { normalizedXAxis, normalizedYAxis } = normalizeAxes(xAxis, yAxis);
		switch (this.componentProperty) {
			case Constants.ComponentProperty.X_AXIS:
				this.value = this.states.includes(state) ? normalizedXAxis : .5;
				break;
			case Constants.ComponentProperty.Y_AXIS:
				this.value = this.states.includes(state) ? normalizedYAxis : .5;
				break;
			case Constants.ComponentProperty.BUTTON:
				this.value = this.states.includes(state) ? button : 0;
				break;
			case Constants.ComponentProperty.STATE:
				if (this.valueNodeProperty === Constants.VisualResponseProperty.VISIBILITY) this.value = this.states.includes(state);
				else this.value = this.states.includes(state) ? 1 : 0;
				break;
			default: throw new Error(`Unexpected visualResponse componentProperty ${this.componentProperty}`);
		}
	}
};
var Component = class {
	/**
	* @param {Object} componentId - Id of the component
	* @param {Object} componentDescription - Description of the component to be created
	*/
	constructor(componentId, componentDescription) {
		if (!componentId || !componentDescription || !componentDescription.visualResponses || !componentDescription.gamepadIndices || Object.keys(componentDescription.gamepadIndices).length === 0) throw new Error("Invalid arguments supplied");
		this.id = componentId;
		this.type = componentDescription.type;
		this.rootNodeName = componentDescription.rootNodeName;
		this.touchPointNodeName = componentDescription.touchPointNodeName;
		this.visualResponses = {};
		Object.keys(componentDescription.visualResponses).forEach((responseName) => {
			const visualResponse = new VisualResponse(componentDescription.visualResponses[responseName]);
			this.visualResponses[responseName] = visualResponse;
		});
		this.gamepadIndices = Object.assign({}, componentDescription.gamepadIndices);
		this.values = {
			state: Constants.ComponentState.DEFAULT,
			button: this.gamepadIndices.button !== void 0 ? 0 : void 0,
			xAxis: this.gamepadIndices.xAxis !== void 0 ? 0 : void 0,
			yAxis: this.gamepadIndices.yAxis !== void 0 ? 0 : void 0
		};
	}
	get data() {
		return {
			id: this.id,
			...this.values
		};
	}
	/**
	* @description Poll for updated data based on current gamepad state
	* @param {Object} gamepad - The gamepad object from which the component data should be polled
	*/
	updateFromGamepad(gamepad) {
		this.values.state = Constants.ComponentState.DEFAULT;
		if (this.gamepadIndices.button !== void 0 && gamepad.buttons.length > this.gamepadIndices.button) {
			const gamepadButton = gamepad.buttons[this.gamepadIndices.button];
			this.values.button = gamepadButton.value;
			this.values.button = this.values.button < 0 ? 0 : this.values.button;
			this.values.button = this.values.button > 1 ? 1 : this.values.button;
			if (gamepadButton.pressed || this.values.button === 1) this.values.state = Constants.ComponentState.PRESSED;
			else if (gamepadButton.touched || this.values.button > Constants.ButtonTouchThreshold) this.values.state = Constants.ComponentState.TOUCHED;
		}
		if (this.gamepadIndices.xAxis !== void 0 && gamepad.axes.length > this.gamepadIndices.xAxis) {
			this.values.xAxis = gamepad.axes[this.gamepadIndices.xAxis];
			this.values.xAxis = this.values.xAxis < -1 ? -1 : this.values.xAxis;
			this.values.xAxis = this.values.xAxis > 1 ? 1 : this.values.xAxis;
			if (this.values.state === Constants.ComponentState.DEFAULT && Math.abs(this.values.xAxis) > Constants.AxisTouchThreshold) this.values.state = Constants.ComponentState.TOUCHED;
		}
		if (this.gamepadIndices.yAxis !== void 0 && gamepad.axes.length > this.gamepadIndices.yAxis) {
			this.values.yAxis = gamepad.axes[this.gamepadIndices.yAxis];
			this.values.yAxis = this.values.yAxis < -1 ? -1 : this.values.yAxis;
			this.values.yAxis = this.values.yAxis > 1 ? 1 : this.values.yAxis;
			if (this.values.state === Constants.ComponentState.DEFAULT && Math.abs(this.values.yAxis) > Constants.AxisTouchThreshold) this.values.state = Constants.ComponentState.TOUCHED;
		}
		Object.values(this.visualResponses).forEach((visualResponse) => {
			visualResponse.updateFromComponent(this.values);
		});
	}
};
/**
* @description Builds a motion controller with components and visual responses based on the
* supplied profile description. Data is polled from the xrInputSource's gamepad.
* @author Nell Waliczek / https://github.com/NellWaliczek
*/
var MotionController = class {
	/**
	* @param {Object} xrInputSource - The XRInputSource to build the MotionController around
	* @param {Object} profile - The best matched profile description for the supplied xrInputSource
	* @param {string} assetUrl
	*/
	constructor(xrInputSource, profile, assetUrl) {
		if (!xrInputSource) throw new Error("No xrInputSource supplied");
		if (!profile) throw new Error("No profile supplied");
		this.xrInputSource = xrInputSource;
		this.assetUrl = assetUrl;
		this.id = profile.profileId;
		this.layoutDescription = profile.layouts[xrInputSource.handedness];
		this.components = {};
		Object.keys(this.layoutDescription.components).forEach((componentId) => {
			const componentDescription = this.layoutDescription.components[componentId];
			this.components[componentId] = new Component(componentId, componentDescription);
		});
		this.updateFromGamepad();
	}
	get gripSpace() {
		return this.xrInputSource.gripSpace;
	}
	get targetRaySpace() {
		return this.xrInputSource.targetRaySpace;
	}
	/**
	* @description Returns a subset of component data for simplified debugging
	*/
	get data() {
		const data = [];
		Object.values(this.components).forEach((component) => {
			data.push(component.data);
		});
		return data;
	}
	/**
	* @description Poll for updated data based on current gamepad state
	*/
	updateFromGamepad() {
		Object.values(this.components).forEach((component) => {
			component.updateFromGamepad(this.xrInputSource.gamepad);
		});
	}
};
// node_modules/three/examples/jsm/webxr/XRControllerModelFactory.js
var DEFAULT_PROFILES_PATH = "https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0/dist/profiles";
var DEFAULT_PROFILE = "generic-trigger";
/**
* Represents a XR controller model.
*
* @augments Object3D
*/
var XRControllerModel = class extends Object3D {
	/**
	* Constructs a new XR controller model.
	*/
	constructor() {
		super();
		/**
		* The motion controller.
		*
		* @type {?MotionController}
		* @default null
		*/
		this.motionController = null;
		/**
		* The controller's environment map.
		*
		* @type {?Texture}
		* @default null
		*/
		this.envMap = null;
	}
	/**
	* Sets an environment map that is applied to the controller model.
	*
	* @param {?Texture} envMap - The environment map to apply.
	* @return {XRControllerModel} A reference to this instance.
	*/
	setEnvironmentMap(envMap) {
		if (this.envMap == envMap) return this;
		this.envMap = envMap;
		this.traverse((child) => {
			if (child.isMesh) {
				child.material.envMap = this.envMap;
				child.material.needsUpdate = true;
			}
		});
		return this;
	}
	/**
	* Overwritten with a custom implementation. Polls data from the XRInputSource and updates the
	* model's components to match the real world data.
	*
	* @param {boolean} [force=false] - When set to `true`, a recomputation of world matrices is forced even
	* when {@link Object3D#matrixWorldAutoUpdate} is set to `false`.
	*/
	updateMatrixWorld(force) {
		super.updateMatrixWorld(force);
		if (!this.motionController) return;
		this.motionController.updateFromGamepad();
		Object.values(this.motionController.components).forEach((component) => {
			Object.values(component.visualResponses).forEach((visualResponse) => {
				const { valueNode, minNode, maxNode, value, valueNodeProperty } = visualResponse;
				if (!valueNode) return;
				if (valueNodeProperty === Constants.VisualResponseProperty.VISIBILITY) valueNode.visible = value;
				else if (valueNodeProperty === Constants.VisualResponseProperty.TRANSFORM) {
					valueNode.quaternion.slerpQuaternions(minNode.quaternion, maxNode.quaternion, value);
					valueNode.position.lerpVectors(minNode.position, maxNode.position, value);
				}
			});
		});
	}
};
/**
* Walks the model's tree to find the nodes needed to animate the components and
* saves them to the motionController components for use in the frame loop. When
* touchpads are found, attaches a touch dot to them.
*
* @private
* @param {MotionController} motionController
* @param {Object3D} scene
*/
function findNodes(motionController, scene) {
	Object.values(motionController.components).forEach((component) => {
		const { type, touchPointNodeName, visualResponses } = component;
		if (type === Constants.ComponentType.TOUCHPAD) {
			component.touchPointNode = scene.getObjectByName(touchPointNodeName);
			if (component.touchPointNode) {
				const sphereGeometry = new SphereGeometry(.001);
				const material = new MeshBasicMaterial({ color: 255 });
				const sphere = new Mesh(sphereGeometry, material);
				component.touchPointNode.add(sphere);
			} else console.warn(`Could not find touch dot, ${component.touchPointNodeName}, in touchpad component ${component.id}`);
		}
		Object.values(visualResponses).forEach((visualResponse) => {
			const { valueNodeName, minNodeName, maxNodeName, valueNodeProperty } = visualResponse;
			if (valueNodeProperty === Constants.VisualResponseProperty.TRANSFORM) {
				visualResponse.minNode = scene.getObjectByName(minNodeName);
				visualResponse.maxNode = scene.getObjectByName(maxNodeName);
				if (!visualResponse.minNode) {
					console.warn(`Could not find ${minNodeName} in the model`);
					return;
				}
				if (!visualResponse.maxNode) {
					console.warn(`Could not find ${maxNodeName} in the model`);
					return;
				}
			}
			visualResponse.valueNode = scene.getObjectByName(valueNodeName);
			if (!visualResponse.valueNode) console.warn(`Could not find ${valueNodeName} in the model`);
		});
	});
}
function addAssetSceneToControllerModel(controllerModel, scene) {
	findNodes(controllerModel.motionController, scene);
	if (controllerModel.envMap) scene.traverse((child) => {
		if (child.isMesh) {
			child.material.envMap = controllerModel.envMap;
			child.material.needsUpdate = true;
		}
	});
	controllerModel.add(scene);
}
/**
* Allows to create controller models for WebXR controllers that can be added as a visual
* representation to your scene. `XRControllerModelFactory` will automatically fetch controller
* models that match what the user is holding as closely as possible. The models should be
* attached to the object returned from getControllerGrip in order to match the orientation of
* the held device.
*
* This module depends on the [motion-controllers](https://github.com/immersive-web/webxr-input-profiles/blob/main/packages/motion-controllers/README.md)
* third-part library.
*
* ```js
* const controllerModelFactory = new XRControllerModelFactory();
*
* const controllerGrip = renderer.xr.getControllerGrip( 0 );
* controllerGrip.add( controllerModelFactory.createControllerModel( controllerGrip ) );
* scene.add( controllerGrip );
* ```
*
* @three_import import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
*/
var XRControllerModelFactory = class {
	/**
	* Constructs a new XR controller model factory.
	*
	* @param {?GLTFLoader} [gltfLoader=null] - A glTF loader that is used to load controller models.
	* @param {?Function} [onLoad=null] - A callback that is executed when a controller model has been loaded.
	*/
	constructor(gltfLoader = null, onLoad = null) {
		/**
		* A glTF loader that is used to load controller models.
		*
		* @type {?GLTFLoader}
		* @default null
		*/
		this.gltfLoader = gltfLoader;
		/**
		* The path to the model repository.
		*
		* @type {string}
		*/
		this.path = DEFAULT_PROFILES_PATH;
		this._assetCache = {};
		/**
		* A callback that is executed when a controller model has been loaded.
		*
		* @type {?Function}
		* @default null
		*/
		this.onLoad = onLoad;
		if (!this.gltfLoader) this.gltfLoader = new GLTFLoader();
	}
	/**
	* Sets the path to the model repository.
	*
	* @param {string} path - The path to set.
	* @return {XRControllerModelFactory} A reference to this instance.
	*/
	setPath(path) {
		this.path = path;
		return this;
	}
	/**
	* Creates a controller model for the given WebXR controller.
	*
	* @param {Group} controller - The controller.
	* @return {XRControllerModel} The XR controller model.
	*/
	createControllerModel(controller) {
		const controllerModel = new XRControllerModel();
		let scene = null;
		let connectionId = 0;
		controller.addEventListener("connected", (event) => {
			const xrInputSource = event.data;
			if (xrInputSource.targetRayMode !== "tracked-pointer" || !xrInputSource.gamepad || xrInputSource.hand) return;
			const id = ++connectionId;
			fetchProfile(xrInputSource, this.path, DEFAULT_PROFILE).then(({ profile, assetPath }) => {
				if (id !== connectionId) return;
				controllerModel.motionController = new MotionController(xrInputSource, profile, assetPath);
				const assetUrl = controllerModel.motionController.assetUrl;
				const cachedAsset = this._assetCache[assetUrl];
				if (cachedAsset) {
					scene = cachedAsset.scene.clone();
					addAssetSceneToControllerModel(controllerModel, scene);
					if (this.onLoad) this.onLoad(scene);
				} else {
					if (!this.gltfLoader) throw new Error("THREE.XRControllerModelFactory: GLTFLoader not set.");
					this.gltfLoader.setPath("");
					this.gltfLoader.load(assetUrl, (asset) => {
						this._assetCache[assetUrl] = asset;
						if (id !== connectionId) return;
						scene = asset.scene.clone();
						addAssetSceneToControllerModel(controllerModel, scene);
						if (this.onLoad) this.onLoad(scene);
					}, null, () => {
						throw new Error(`THREE.XRControllerModelFactory: Asset ${assetUrl} missing or malformed.`);
					});
				}
			}).catch((err) => {
				console.warn(err);
			});
		});
		controller.addEventListener("disconnected", () => {
			connectionId++;
			controllerModel.motionController = null;
			controllerModel.remove(scene);
			scene = null;
		});
		return controllerModel;
	}
};
// node_modules/three/examples/jsm/webxr/XRHandPrimitiveModel.js
var _matrix = new Matrix4();
var _vector = new Vector3();
/**
* Represents one of the hand model types {@link XRHandModelFactory} might produce
* depending on the selected profile. `XRHandPrimitiveModel` represents a hand
* with sphere or box primitives according to the selected `primitive` option.
*
* @three_import import { XRHandPrimitiveModel } from 'three/addons/webxr/XRHandPrimitiveModel.js';
*/
var XRHandPrimitiveModel = class {
	/**
	* Constructs a new XR hand primitive model.
	*
	* @param {XRHandModel} handModel - The hand model.
	* @param {Group} controller - The WebXR controller.
	* @param {string} path - The model path.
	* @param {XRHandedness} handedness - The handedness of the XR input source.
	* @param {XRHandPrimitiveModel~Options} options - The model options.
	*/
	constructor(handModel, controller, path, handedness, options) {
		/**
		* The WebXR controller.
		*
		* @type {Group}
		*/
		this.controller = controller;
		/**
		* The hand model.
		*
		* @type {XRHandModel}
		*/
		this.handModel = handModel;
		/**
		* The model's environment map.
		*
		* @type {?Texture}
		* @default null
		*/
		this.envMap = null;
		let geometry;
		if (!options || !options.primitive || options.primitive === "sphere") geometry = new SphereGeometry(1, 10, 10);
		else if (options.primitive === "box") geometry = new BoxGeometry(1, 1, 1);
		const material = new MeshStandardMaterial();
		this.handMesh = new InstancedMesh(geometry, material, 30);
		this.handMesh.frustumCulled = false;
		this.handMesh.instanceMatrix.setUsage(DynamicDrawUsage);
		this.handMesh.castShadow = true;
		this.handMesh.receiveShadow = true;
		this.handModel.add(this.handMesh);
		this.joints = [
			"wrist",
			"thumb-metacarpal",
			"thumb-phalanx-proximal",
			"thumb-phalanx-distal",
			"thumb-tip",
			"index-finger-metacarpal",
			"index-finger-phalanx-proximal",
			"index-finger-phalanx-intermediate",
			"index-finger-phalanx-distal",
			"index-finger-tip",
			"middle-finger-metacarpal",
			"middle-finger-phalanx-proximal",
			"middle-finger-phalanx-intermediate",
			"middle-finger-phalanx-distal",
			"middle-finger-tip",
			"ring-finger-metacarpal",
			"ring-finger-phalanx-proximal",
			"ring-finger-phalanx-intermediate",
			"ring-finger-phalanx-distal",
			"ring-finger-tip",
			"pinky-finger-metacarpal",
			"pinky-finger-phalanx-proximal",
			"pinky-finger-phalanx-intermediate",
			"pinky-finger-phalanx-distal",
			"pinky-finger-tip"
		];
	}
	/**
	* Updates the mesh based on the tracked XR joints data.
	*/
	updateMesh() {
		const defaultRadius = .008;
		const joints = this.controller.joints;
		let count = 0;
		for (let i = 0; i < this.joints.length; i++) {
			const joint = joints[this.joints[i]];
			if (joint.visible) {
				_vector.setScalar(joint.jointRadius || defaultRadius);
				_matrix.compose(joint.position, joint.quaternion, _vector);
				this.handMesh.setMatrixAt(i, _matrix);
				count++;
			}
		}
		this.handMesh.count = count;
		this.handMesh.instanceMatrix.needsUpdate = true;
	}
};
// node_modules/three/examples/jsm/webxr/XRHandMeshModel.js
var DEFAULT_HAND_PROFILE_PATH = "https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0/dist/profiles/generic-hand/";
/**
* Represents one of the hand model types {@link XRHandModelFactory} might produce
* depending on the selected profile. `XRHandMeshModel` represents a hand with a
* custom asset.
*
* @three_import import { XRHandMeshModel } from 'three/addons/webxr/XRHandMeshModel.js';
*/
var XRHandMeshModel = class {
	/**
	* Constructs a new XR hand mesh model.
	*
	* @param {XRHandModel} handModel - The hand model.
	* @param {Group} controller - The WebXR controller.
	* @param {?string} path - The model path.
	* @param {XRHandedness} handedness - The handedness of the XR input source.
	* @param {?Loader} [loader=null] - The loader. If not provided, an instance of `GLTFLoader` will be used to load models.
	* @param {?Function} [onLoad=null] - A callback that is executed when a controller model has been loaded.
	* @param {?Object} [customCache=null] - An optional shared cache object for storing and reusing loaded assets across instances.
	*/
	constructor(handModel, controller, path, handedness, loader = null, onLoad = null, customCache = null) {
		/**
		* The WebXR controller.
		*
		* @type {Group}
		*/
		this.controller = controller;
		/**
		* The hand model.
		*
		* @type {XRHandModel}
		*/
		this.handModel = handModel;
		/**
		* An array of bones representing the bones
		* of the hand skeleton.
		*
		* @type {Array<Bone>}
		*/
		this.bones = [];
		const pathToUse = path || DEFAULT_HAND_PROFILE_PATH;
		const processAsset = (gltf) => {
			const object = clone(gltf.scene.children[0]);
			this.handModel.add(object);
			const mesh = object.getObjectByProperty("type", "SkinnedMesh");
			mesh.frustumCulled = false;
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			[
				"wrist",
				"thumb-metacarpal",
				"thumb-phalanx-proximal",
				"thumb-phalanx-distal",
				"thumb-tip",
				"index-finger-metacarpal",
				"index-finger-phalanx-proximal",
				"index-finger-phalanx-intermediate",
				"index-finger-phalanx-distal",
				"index-finger-tip",
				"middle-finger-metacarpal",
				"middle-finger-phalanx-proximal",
				"middle-finger-phalanx-intermediate",
				"middle-finger-phalanx-distal",
				"middle-finger-tip",
				"ring-finger-metacarpal",
				"ring-finger-phalanx-proximal",
				"ring-finger-phalanx-intermediate",
				"ring-finger-phalanx-distal",
				"ring-finger-tip",
				"pinky-finger-metacarpal",
				"pinky-finger-phalanx-proximal",
				"pinky-finger-phalanx-intermediate",
				"pinky-finger-phalanx-distal",
				"pinky-finger-tip"
			].forEach((jointName) => {
				const bone = object.getObjectByName(jointName);
				if (bone !== void 0) bone.jointName = jointName;
				else console.warn(`Couldn't find ${jointName} in ${handedness} hand mesh`);
				this.bones.push(bone);
			});
			if (onLoad) onLoad(object);
		};
		const assetUrl = `${pathToUse}${handedness}.glb`;
		if (customCache && customCache[assetUrl]) processAsset(customCache[assetUrl]);
		else {
			if (loader === null) {
				loader = new GLTFLoader();
				loader.setPath(pathToUse);
			}
			loader.load(`${handedness}.glb`, (gltf) => {
				if (customCache) customCache[assetUrl] = gltf;
				processAsset(gltf);
			});
		}
	}
	/**
	* Updates the mesh based on the tracked XR joints data.
	*/
	updateMesh() {
		const XRJoints = this.controller.joints;
		for (let i = 0; i < this.bones.length; i++) {
			const bone = this.bones[i];
			if (bone) {
				const XRJoint = XRJoints[bone.jointName];
				if (XRJoint.visible) {
					const position = XRJoint.position;
					bone.position.copy(position);
					bone.quaternion.copy(XRJoint.quaternion);
				}
			}
		}
	}
};
// node_modules/three/examples/jsm/webxr/XRHandModelFactory.js
/**
* Represents a XR hand model.
*
* @augments Object3D
*/
var XRHandModel = class extends Object3D {
	/**
	* Constructs a new XR hand model.
	*
	* @param {Group} controller - The hand controller.
	*/
	constructor(controller) {
		super();
		/**
		* The hand controller.
		*
		* @type {Group}
		*/
		this.controller = controller;
		/**
		* The motion controller.
		*
		* @type {?MotionController}
		* @default null
		*/
		this.motionController = null;
		/**
		* The controller's environment map.
		*
		* @type {?Texture}
		* @default null
		*/
		this.envMap = null;
		/**
		* The model mesh.
		*
		* @type {Mesh}
		* @default null
		*/
		this.mesh = null;
	}
	/**
	* Overwritten with a custom implementation. Makes sure the motion controller updates the mesh.
	*
	* @param {boolean} [force=false] - When set to `true`, a recomputation of world matrices is forced even
	* when {@link Object3D#matrixWorldAutoUpdate} is set to `false`.
	*/
	updateMatrixWorld(force) {
		super.updateMatrixWorld(force);
		if (this.motionController) this.motionController.updateMesh();
	}
};
/**
* Similar to {@link XRControllerModelFactory}, this class allows to create hand models
* for WebXR controllers that can be added as a visual representation to your scene.
*
* ```js
* const handModelFactory = new XRHandModelFactory();
*
* const hand = renderer.xr.getHand( 0 );
* hand.add( handModelFactory.createHandModel( hand ) );
* scene.add( hand );
* ```
*
* @three_import import { XRHandModelFactory } from 'three/addons/webxr/XRHandModelFactory.js';
*/
var XRHandModelFactory = class {
	/**
	* Constructs a new XR hand model factory.
	*
	* @param {?GLTFLoader} [gltfLoader=null] - A glTF loader that is used to load hand models.
	* @param {?Function} [onLoad=null] - A callback that is executed when a hand model has been loaded.
	*/
	constructor(gltfLoader = null, onLoad = null) {
		/**
		* A glTF loader that is used to load hand models.
		*
		* @type {?GLTFLoader}
		* @default null
		*/
		this.gltfLoader = gltfLoader;
		/**
		* The path to the model repository.
		*
		* @type {?string}
		* @default null
		*/
		this.path = null;
		this._assetCache = {};
		/**
		* A callback that is executed when a hand model has been loaded.
		*
		* @type {?Function}
		* @default null
		*/
		this.onLoad = onLoad;
	}
	/**
	* Sets the path to the hand model repository.
	*
	* @param {string} path - The path to set.
	* @return {XRHandModelFactory} A reference to this instance.
	*/
	setPath(path) {
		this.path = path;
		return this;
	}
	/**
	* Creates a controller model for the given WebXR hand controller.
	*
	* @param {Group} controller - The hand controller.
	* @param {('spheres'|'boxes'|'mesh')} [profile] - The model profile that defines the model type.
	* @return {XRHandModel} The XR hand model.
	*/
	createHandModel(controller, profile) {
		const handModel = new XRHandModel(controller);
		controller.addEventListener("connected", (event) => {
			const xrInputSource = event.data;
			if (xrInputSource.hand && !handModel.motionController) {
				handModel.xrInputSource = xrInputSource;
				if (profile === void 0 || profile === "spheres") handModel.motionController = new XRHandPrimitiveModel(handModel, controller, this.path, xrInputSource.handedness, { primitive: "sphere" });
				else if (profile === "boxes") handModel.motionController = new XRHandPrimitiveModel(handModel, controller, this.path, xrInputSource.handedness, { primitive: "box" });
				else if (profile === "mesh") handModel.motionController = new XRHandMeshModel(handModel, controller, this.path, xrInputSource.handedness, this.gltfLoader, this.onLoad, this._assetCache);
			}
		});
		controller.addEventListener("disconnected", () => {
			handModel.clear();
			handModel.motionController = null;
		});
		return handModel;
	}
};
// node_modules/three/examples/jsm/loaders/FontLoader.js
/**
* A loader for loading fonts.
*
* You can convert fonts online using [facetype.js](https://gero3.github.io/facetype.js/).
*
* ```js
* const loader = new FontLoader();
* const font = await loader.loadAsync( 'fonts/helvetiker_regular.typeface.json' );
* ```
*
* @augments Loader
* @three_import import { FontLoader } from 'three/addons/loaders/FontLoader.js';
*/
var FontLoader = class extends Loader {
	/**
	* Constructs a new font loader.
	*
	* @param {LoadingManager} [manager] - The loading manager.
	*/
	constructor(manager) {
		super(manager);
	}
	/**
	* Starts loading from the given URL and passes the loaded font
	* to the `onLoad()` callback.
	*
	* @param {string} url - The path/URL of the file to be loaded. This can also be a data URI.
	* @param {function(Font)} onLoad - Executed when the loading process has been finished.
	* @param {onProgressCallback} onProgress - Executed while the loading is in progress.
	* @param {onErrorCallback} onError - Executed when errors occur.
	*/
	load(url, onLoad, onProgress, onError) {
		const scope = this;
		const loader = new FileLoader(this.manager);
		loader.setPath(this.path);
		loader.setRequestHeader(this.requestHeader);
		loader.setWithCredentials(this.withCredentials);
		loader.load(url, function(text) {
			const font = scope.parse(JSON.parse(text));
			if (onLoad) onLoad(font);
		}, onProgress, onError);
	}
	/**
	* Parses the given font data and returns the resulting font.
	*
	* @param {Object} json - The raw font data as a JSON object.
	* @return {Font} The font.
	*/
	parse(json) {
		return new Font(json);
	}
};
/**
* Class representing a font.
*/
var Font = class {
	/**
	* Constructs a new font.
	*
	* @param {Object} data - The font data as JSON.
	*/
	constructor(data) {
		/**
		* This flag can be used for type testing.
		*
		* @type {boolean}
		* @readonly
		* @default true
		*/
		this.isFont = true;
		this.type = "Font";
		/**
		* The font data as JSON.
		*
		* @type {Object}
		*/
		this.data = data;
	}
	/**
	* Generates geometry shapes from the given text and size. The result of this method
	* should be used with {@link ShapeGeometry} to generate the actual geometry data.
	*
	* @param {string} text - The text.
	* @param {number} [size=100] - The text size.
	* @param {string} [direction='ltr'] - Char direction: ltr(left to right), rtl(right to left) & tb(top bottom).
	* @return {Array<Shape>} An array of shapes representing the text.
	*/
	generateShapes(text, size = 100, direction = "ltr") {
		const shapes = [];
		const paths = createPaths(text, size, this.data, direction);
		for (let p = 0, pl = paths.length; p < pl; p++) shapes.push(...paths[p].toShapes());
		return shapes;
	}
};
function createPaths(text, size, data, direction) {
	const chars = Array.from(text);
	const scale = size / data.resolution;
	const line_height = (data.boundingBox.yMax - data.boundingBox.yMin + data.underlineThickness) * scale;
	const paths = [];
	let offsetX = 0, offsetY = 0;
	if (direction == "rtl" || direction == "tb") chars.reverse();
	for (let i = 0; i < chars.length; i++) {
		const char = chars[i];
		if (char === "\n") {
			offsetX = 0;
			offsetY -= line_height;
		} else {
			const ret = createPath(char, scale, offsetX, offsetY, data);
			if (direction == "tb") {
				offsetX = 0;
				offsetY += data.ascender * scale;
			} else offsetX += ret.offsetX;
			paths.push(ret.path);
		}
	}
	return paths;
}
function createPath(char, scale, offsetX, offsetY, data) {
	const glyph = data.glyphs[char] || data.glyphs["?"];
	if (!glyph) {
		console.error("THREE.Font: character \"" + char + "\" does not exists in font family " + data.familyName + ".");
		return;
	}
	const path = new ShapePath();
	let x, y, cpx, cpy, cpx1, cpy1, cpx2, cpy2;
	if (glyph.o) {
		const outline = glyph._cachedOutline || (glyph._cachedOutline = glyph.o.split(" "));
		for (let i = 0, l = outline.length; i < l;) switch (outline[i++]) {
			case "m":
				x = outline[i++] * scale + offsetX;
				y = outline[i++] * scale + offsetY;
				path.moveTo(x, y);
				break;
			case "l":
				x = outline[i++] * scale + offsetX;
				y = outline[i++] * scale + offsetY;
				path.lineTo(x, y);
				break;
			case "q":
				cpx = outline[i++] * scale + offsetX;
				cpy = outline[i++] * scale + offsetY;
				cpx1 = outline[i++] * scale + offsetX;
				cpy1 = outline[i++] * scale + offsetY;
				path.quadraticCurveTo(cpx1, cpy1, cpx, cpy);
				break;
			case "b":
				cpx = outline[i++] * scale + offsetX;
				cpy = outline[i++] * scale + offsetY;
				cpx1 = outline[i++] * scale + offsetX;
				cpy1 = outline[i++] * scale + offsetY;
				cpx2 = outline[i++] * scale + offsetX;
				cpy2 = outline[i++] * scale + offsetY;
				path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, cpx, cpy);
		}
	}
	return {
		offsetX: glyph.ha * scale,
		path
	};
}
// node_modules/three/examples/jsm/geometries/TextGeometry.js
/**
* A class for generating text as a single geometry. It is constructed by providing a string of text, and a set of
* parameters consisting of a loaded font and extrude settings.
*
* See the {@link FontLoader} page for additional details.
*
* `TextGeometry` uses [typeface.json](http://gero3.github.io/facetype.js/) generated fonts.
* Some existing fonts can be found located in `/examples/fonts`.
*
* ```js
* const loader = new FontLoader();
* const font = await loader.loadAsync( 'fonts/helvetiker_regular.typeface.json' );
* const geometry = new TextGeometry( 'Hello three.js!', {
* 	font: font,
* 	size: 80,
* 	depth: 5,
* 	curveSegments: 12
* } );
* ```
*
* @augments ExtrudeGeometry
* @three_import import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
*/
var TextGeometry = class TextGeometry extends ExtrudeGeometry {
	/**
	* Constructs a new text geometry.
	*
	* @param {string} text - The text that should be transformed into a geometry.
	* @param {TextGeometry~Options} [parameters] - The text settings.
	*/
	constructor(text, parameters = {}) {
		const font = parameters.font;
		if (font === void 0) super();
		else {
			const shapes = font.generateShapes(text, parameters.size, parameters.direction);
			if (parameters.depth === void 0) parameters.depth = 50;
			if (parameters.bevelThickness === void 0) parameters.bevelThickness = 10;
			if (parameters.bevelSize === void 0) parameters.bevelSize = 8;
			if (parameters.bevelEnabled === void 0) parameters.bevelEnabled = false;
			super(shapes, parameters);
		}
		this.type = "TextGeometry";
	}
	toJSON() {
		return super.toJSON();
	}
	static fromJSON(data) {
		const options = data.options;
		options.font = new Font(options.font.data);
		return new TextGeometry(options.text, options);
	}
};
// node_modules/three/examples/jsm/loaders/DRACOLoader.js
var _taskCache$1 = /* @__PURE__ */ new WeakMap();
var WASM_BIN_URL$1 = new URL("/assets/draco_decoder-C32yEggz.wasm", "" + import.meta.url).toString();
var WASM_JS_URL$1 = new URL("/assets/draco_wasm_wrapper-DxJM36Ib.js", "" + import.meta.url).toString();
var JS_URL = new URL("/assets/draco_decoder-fzg4nYZr.js", "" + import.meta.url).toString();
new URL("/assets/draco_wasm_wrapper-fZCQGLGb.js", "" + import.meta.url).toString(), new URL("/assets/draco_decoder-Z1_iN-Ht.wasm", "" + import.meta.url).toString();
/**
* A loader for the Draco format.
*
* [Draco](https://google.github.io/draco/) is an open source library for compressing
* and decompressing 3D meshes and point clouds. Compressed geometry can be significantly smaller,
* at the cost of additional decoding time on the client device.
*
* Standalone Draco files have a `.drc` extension, and contain vertex positions, normals, colors,
* and other attributes. Draco files do not contain materials, textures, animation, or node hierarchies –
* to use these features, embed Draco geometry inside of a glTF file. A normal glTF file can be converted
* to a Draco-compressed glTF file using [glTF-Pipeline](https://github.com/CesiumGS/gltf-pipeline).
* When using Draco with glTF, an instance of `DRACOLoader` will be used internally by {@link GLTFLoader}.
*
* It is recommended to create one DRACOLoader instance and reuse it to avoid loading and creating
* multiple decoder instances.
*
* `DRACOLoader` will automatically use either the JS or the WASM decoding library, based on
* browser capabilities.
*
* ```js
* const loader = new DRACOLoader();
* const geometry = await loader.loadAsync( 'models/draco/bunny.drc' );
* geometry.computeVertexNormals(); // optional
*
* loader.dispose();
* ```
*
* @augments Loader
* @three_import import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
*/
var DRACOLoader = class extends Loader {
	/**
	* Constructs a new Draco loader.
	*
	* @param {LoadingManager} [manager] - The loading manager.
	*/
	constructor(manager) {
		super(manager);
		this.decoderPaths = {
			js: WASM_JS_URL$1,
			wasm: WASM_BIN_URL$1,
			dep_js: JS_URL
		};
		this.decoderConfig = {};
		this.decoderBinary = null;
		this.decoderPending = null;
		this.workerLimit = 4;
		this.workerPool = [];
		this.workerNextTaskID = 1;
		this.workerSourceURL = "";
		this.defaultAttributeIDs = {
			position: "POSITION",
			normal: "NORMAL",
			color: "COLOR",
			uv: "TEX_COORD"
		};
		this.defaultAttributeTypes = {
			position: "Float32Array",
			normal: "Float32Array",
			color: "Float32Array",
			uv: "Float32Array"
		};
	}
	/**
	* Provides configuration for the decoder libraries. Configuration cannot be changed after decoding begins.
	*
	* @param {string|{js:string, wasm:string}} path - The decoder path, or a config object with explicit URLs for each decoder file.
	* @return {DRACOLoader} A reference to this loader.
	*/
	setDecoderPath(path) {
		const { decoderPaths } = this;
		if (typeof path === "object") {
			decoderPaths.js = path.js;
			decoderPaths.wasm = path.wasm;
			decoderPaths.dep_js = null;
		} else {
			decoderPaths.js = LoaderUtils.resolveURL("draco_wasm_wrapper.js", path);
			decoderPaths.wasm = LoaderUtils.resolveURL("draco_decoder.wasm", path);
			decoderPaths.dep_js = LoaderUtils.resolveURL("draco_decoder.js", path);
		}
		return this;
	}
	/**
	* Provides configuration for the decoder libraries. Configuration cannot be changed after decoding begins.
	*
	* @deprecated
	* @param {{type:('js'|'wasm')}} config - The decoder config.
	* @return {DRACOLoader} A reference to this loader.
	*/
	setDecoderConfig(config) {
		console.warn("THREE.DRACOLoader: setDecoderConfig to has been deprecated and will be removed in r194.");
		this.decoderConfig = config;
		return this;
	}
	/**
	* Sets the maximum number of Web Workers to be used during decoding.
	* A lower limit may be preferable if workers are also for other tasks in the application.
	*
	* @param {number} workerLimit - The worker limit.
	* @return {DRACOLoader} A reference to this loader.
	*/
	setWorkerLimit(workerLimit) {
		this.workerLimit = workerLimit;
		return this;
	}
	/**
	* Starts loading from the given URL and passes the loaded Draco asset
	* to the `onLoad()` callback.
	*
	* @param {string} url - The path/URL of the file to be loaded. This can also be a data URI.
	* @param {function(BufferGeometry)} onLoad - Executed when the loading process has been finished.
	* @param {onProgressCallback} onProgress - Executed while the loading is in progress.
	* @param {onErrorCallback} onError - Executed when errors occur.
	*/
	load(url, onLoad, onProgress, onError) {
		const loader = new FileLoader(this.manager);
		loader.setPath(this.path);
		loader.setResponseType("arraybuffer");
		loader.setRequestHeader(this.requestHeader);
		loader.setWithCredentials(this.withCredentials);
		loader.load(url, (buffer) => {
			this.parse(buffer, onLoad, onError);
		}, onProgress, onError);
	}
	/**
	* Parses the given Draco data.
	*
	* @param {ArrayBuffer} buffer - The raw Draco data as an array buffer.
	* @param {function(BufferGeometry)} onLoad - Executed when the loading/parsing process has been finished.
	* @param {onErrorCallback} onError - Executed when errors occur.
	*/
	parse(buffer, onLoad, onError = () => {}) {
		this.decodeDracoFile(buffer, onLoad, null, null, SRGBColorSpace, onError).catch(onError);
	}
	decodeDracoFile(buffer, callback, attributeIDs, attributeTypes, vertexColorSpace = LinearSRGBColorSpace, onError = () => {}) {
		const taskConfig = {
			attributeIDs: attributeIDs || this.defaultAttributeIDs,
			attributeTypes: attributeTypes || this.defaultAttributeTypes,
			useUniqueIDs: !!attributeIDs,
			vertexColorSpace
		};
		return this.decodeGeometry(buffer, taskConfig).then(callback).catch(onError);
	}
	decodeGeometry(buffer, taskConfig) {
		const taskKey = JSON.stringify(taskConfig);
		if (_taskCache$1.has(buffer)) {
			const cachedTask = _taskCache$1.get(buffer);
			if (cachedTask.key === taskKey) return cachedTask.promise;
			else if (buffer.byteLength === 0) throw new Error("THREE.DRACOLoader: Unable to re-decode a buffer with different settings. Buffer has already been transferred.");
		}
		let worker;
		const taskID = this.workerNextTaskID++;
		const taskCost = buffer.byteLength;
		const geometryPending = this._getWorker(taskID, taskCost).then((_worker) => {
			worker = _worker;
			return new Promise((resolve, reject) => {
				worker._callbacks[taskID] = {
					resolve,
					reject
				};
				worker.postMessage({
					type: "decode",
					id: taskID,
					taskConfig,
					buffer
				}, [buffer]);
			});
		}).then((message) => this._createGeometry(message.geometry));
		geometryPending.catch(() => true).then(() => {
			if (worker && taskID) this._releaseTask(worker, taskID);
		});
		_taskCache$1.set(buffer, {
			key: taskKey,
			promise: geometryPending
		});
		return geometryPending;
	}
	_createGeometry(geometryData) {
		const geometry = new BufferGeometry();
		if (geometryData.index) geometry.setIndex(new BufferAttribute(geometryData.index.array, 1));
		for (let i = 0; i < geometryData.attributes.length; i++) {
			const { name, array, itemSize, stride, vertexColorSpace } = geometryData.attributes[i];
			let attribute;
			if (itemSize === stride) attribute = new BufferAttribute(array, itemSize);
			else {
				const buffer = new InterleavedBuffer(array, stride);
				attribute = new InterleavedBufferAttribute(buffer, itemSize, 0);
			}
			if (name === "color") {
				this._assignVertexColorSpace(attribute, vertexColorSpace);
				attribute.normalized = array instanceof Float32Array === false;
			}
			geometry.setAttribute(name, attribute);
		}
		return geometry;
	}
	_assignVertexColorSpace(attribute, inputColorSpace) {
		if (inputColorSpace !== "srgb") return;
		const _color = new Color();
		for (let i = 0, il = attribute.count; i < il; i++) {
			_color.fromBufferAttribute(attribute, i);
			ColorManagement.colorSpaceToWorking(_color, SRGBColorSpace);
			attribute.setXYZ(i, _color.r, _color.g, _color.b);
		}
	}
	_loadLibrary(url, responseType) {
		const loader = new FileLoader(this.manager);
		loader.setResponseType(responseType);
		loader.setWithCredentials(this.withCredentials);
		return new Promise((resolve, reject) => {
			loader.load(url, resolve, void 0, reject);
		});
	}
	preload() {
		this._initDecoder();
		return this;
	}
	_initDecoder() {
		if (this.decoderPending) return this.decoderPending;
		const useJS = typeof WebAssembly !== "object" || this.decoderConfig.type === "js";
		const librariesPending = [];
		const { decoderPaths } = this;
		if (useJS) {
			if (decoderPaths.dep_js === null) throw new Error("THREE.DRACOLoader: WebAssembly is required when using a custom decoder paths.");
			librariesPending.push(this._loadLibrary(decoderPaths.dep_js, "text"));
		} else {
			librariesPending.push(this._loadLibrary(decoderPaths.js, "text"));
			librariesPending.push(this._loadLibrary(decoderPaths.wasm, "arraybuffer"));
		}
		this.decoderPending = Promise.all(librariesPending).then((libraries) => {
			const jsContent = libraries[0];
			if (!useJS) this.decoderConfig.wasmBinary = libraries[1];
			const fn = DRACOWorker.toString();
			const body = [
				"/* draco decoder */",
				jsContent,
				"",
				"/* worker */",
				fn.substring(fn.indexOf("{") + 1, fn.lastIndexOf("}"))
			].join("\n");
			this.workerSourceURL = URL.createObjectURL(new Blob([body]));
		});
		return this.decoderPending;
	}
	_getWorker(taskID, taskCost) {
		return this._initDecoder().then(() => {
			if (this.workerPool.length < this.workerLimit) {
				const worker = new Worker(this.workerSourceURL);
				worker._callbacks = {};
				worker._taskCosts = {};
				worker._taskLoad = 0;
				worker.postMessage({
					type: "init",
					decoderConfig: this.decoderConfig
				});
				worker.onmessage = function(e) {
					const message = e.data;
					switch (message.type) {
						case "decode":
							worker._callbacks[message.id].resolve(message);
							break;
						case "error":
							worker._callbacks[message.id].reject(message);
							break;
						default: console.error("THREE.DRACOLoader: Unexpected message, \"" + message.type + "\"");
					}
				};
				this.workerPool.push(worker);
			} else this.workerPool.sort(function(a, b) {
				return a._taskLoad > b._taskLoad ? -1 : 1;
			});
			const worker = this.workerPool[this.workerPool.length - 1];
			worker._taskCosts[taskID] = taskCost;
			worker._taskLoad += taskCost;
			return worker;
		});
	}
	_releaseTask(worker, taskID) {
		worker._taskLoad -= worker._taskCosts[taskID];
		delete worker._callbacks[taskID];
		delete worker._taskCosts[taskID];
	}
	debug() {
		console.log("Task load: ", this.workerPool.map((worker) => worker._taskLoad));
	}
	dispose() {
		for (let i = 0; i < this.workerPool.length; ++i) this.workerPool[i].terminate();
		this.workerPool.length = 0;
		if (this.workerSourceURL !== "") URL.revokeObjectURL(this.workerSourceURL);
		return this;
	}
};
function DRACOWorker() {
	let decoderConfig;
	let decoderPending;
	onmessage = function(e) {
		const message = e.data;
		switch (message.type) {
			case "init":
				decoderConfig = message.decoderConfig;
				decoderPending = new Promise(function(resolve) {
					decoderConfig.onModuleLoaded = function(draco) {
						resolve({ draco });
					};
					DracoDecoderModule(decoderConfig);
				});
				break;
			case "decode":
				const buffer = message.buffer;
				const taskConfig = message.taskConfig;
				decoderPending.then((module) => {
					const draco = module.draco;
					const decoder = new draco.Decoder();
					try {
						const geometry = decodeGeometry(draco, decoder, new Int8Array(buffer), taskConfig);
						const buffers = geometry.attributes.map((attr) => attr.array.buffer);
						if (geometry.index) buffers.push(geometry.index.array.buffer);
						self.postMessage({
							type: "decode",
							id: message.id,
							geometry
						}, buffers);
					} catch (error) {
						console.error(error);
						self.postMessage({
							type: "error",
							id: message.id,
							error: error.message
						});
					} finally {
						draco.destroy(decoder);
					}
				});
		}
	};
	function decodeGeometry(draco, decoder, array, taskConfig) {
		const attributeIDs = taskConfig.attributeIDs;
		const attributeTypes = taskConfig.attributeTypes;
		let dracoGeometry;
		let decodingStatus;
		const geometryType = decoder.GetEncodedGeometryType(array);
		if (geometryType === draco.TRIANGULAR_MESH) {
			dracoGeometry = new draco.Mesh();
			decodingStatus = decoder.DecodeArrayToMesh(array, array.byteLength, dracoGeometry);
		} else if (geometryType === draco.POINT_CLOUD) {
			dracoGeometry = new draco.PointCloud();
			decodingStatus = decoder.DecodeArrayToPointCloud(array, array.byteLength, dracoGeometry);
		} else throw new Error("THREE.DRACOLoader: Unexpected geometry type.");
		if (!decodingStatus.ok() || dracoGeometry.ptr === 0) throw new Error("THREE.DRACOLoader: Decoding failed: " + decodingStatus.error_msg());
		const geometry = {
			index: null,
			attributes: []
		};
		for (const attributeName in attributeIDs) {
			const attributeType = self[attributeTypes[attributeName]];
			let attribute;
			let attributeID;
			if (taskConfig.useUniqueIDs) {
				attributeID = attributeIDs[attributeName];
				attribute = decoder.GetAttributeByUniqueId(dracoGeometry, attributeID);
			} else {
				attributeID = decoder.GetAttributeId(dracoGeometry, draco[attributeIDs[attributeName]]);
				if (attributeID === -1) continue;
				attribute = decoder.GetAttribute(dracoGeometry, attributeID);
			}
			const attributeResult = decodeAttribute(draco, decoder, dracoGeometry, attributeName, attributeType, attribute);
			if (attributeName === "color") attributeResult.vertexColorSpace = taskConfig.vertexColorSpace;
			geometry.attributes.push(attributeResult);
		}
		if (geometryType === draco.TRIANGULAR_MESH) geometry.index = decodeIndex(draco, decoder, dracoGeometry);
		draco.destroy(dracoGeometry);
		return geometry;
	}
	function decodeIndex(draco, decoder, dracoGeometry) {
		const numIndices = dracoGeometry.num_faces() * 3;
		const byteLength = numIndices * 4;
		const ptr = draco._malloc(byteLength);
		decoder.GetTrianglesUInt32Array(dracoGeometry, byteLength, ptr);
		const index = new Uint32Array(draco.HEAPF32.buffer, ptr, numIndices).slice();
		draco._free(ptr);
		return {
			array: index,
			itemSize: 1
		};
	}
	function decodeAttribute(draco, decoder, dracoGeometry, attributeName, TypedArray, attribute) {
		const count = dracoGeometry.num_points();
		const itemSize = attribute.num_components();
		const dracoDataType = getDracoDataType(draco, TypedArray);
		const srcByteStride = itemSize * TypedArray.BYTES_PER_ELEMENT;
		const dstByteStride = Math.ceil(srcByteStride / 4) * 4;
		const dstStride = dstByteStride / TypedArray.BYTES_PER_ELEMENT;
		const srcByteLength = count * srcByteStride;
		const dstByteLength = count * dstByteStride;
		const ptr = draco._malloc(srcByteLength);
		decoder.GetAttributeDataArrayForAllPoints(dracoGeometry, attribute, dracoDataType, srcByteLength, ptr);
		const srcArray = new TypedArray(draco.HEAPF32.buffer, ptr, srcByteLength / TypedArray.BYTES_PER_ELEMENT);
		let dstArray;
		if (srcByteStride === dstByteStride) dstArray = srcArray.slice();
		else {
			dstArray = new TypedArray(dstByteLength / TypedArray.BYTES_PER_ELEMENT);
			let dstOffset = 0;
			for (let i = 0, il = srcArray.length; i < il; i++) {
				for (let j = 0; j < itemSize; j++) dstArray[dstOffset + j] = srcArray[i * itemSize + j];
				dstOffset += dstStride;
			}
		}
		draco._free(ptr);
		return {
			name: attributeName,
			count,
			itemSize,
			array: dstArray,
			stride: dstStride
		};
	}
	function getDracoDataType(draco, TypedArray) {
		switch (TypedArray) {
			case Float32Array: return draco.DT_FLOAT32;
			case Int8Array: return draco.DT_INT8;
			case Int16Array: return draco.DT_INT16;
			case Int32Array: return draco.DT_INT32;
			case Uint8Array: return draco.DT_UINT8;
			case Uint16Array: return draco.DT_UINT16;
			case Uint32Array: return draco.DT_UINT32;
		}
	}
}
// node_modules/three/examples/jsm/utils/WorkerPool.js
/**
* A simple pool for managing Web Workers.
*
* @three_import import { WorkerPool } from 'three/addons/utils/WorkerPool.js';
*/
var WorkerPool = class {
	/**
	* Constructs a new Worker pool.
	*
	* @param {number} [pool=4] - The size of the pool.
	*/
	constructor(pool = 4) {
		/**
		* The size of the pool.
		*
		* @type {number}
		* @default 4
		*/
		this.pool = pool;
		/**
		* A message queue.
		*
		* @type {Array<Object>}
		*/
		this.queue = [];
		/**
		* An array of Workers.
		*
		* @type {Array<Worker>}
		*/
		this.workers = [];
		/**
		* An array with resolve functions for messages.
		*
		* @type {Array<Function>}
		*/
		this.workersResolve = [];
		/**
		* The current worker status.
		*
		* @type {number}
		*/
		this.workerStatus = 0;
		/**
		* A factory function for creating workers.
		*
		* @type {?Function}
		*/
		this.workerCreator = null;
	}
	_initWorker(workerId) {
		if (!this.workers[workerId]) {
			const worker = this.workerCreator();
			worker.addEventListener("message", this._onMessage.bind(this, workerId));
			this.workers[workerId] = worker;
		}
	}
	_getIdleWorker() {
		for (let i = 0; i < this.pool; i++) if (!(this.workerStatus & 1 << i)) return i;
		return -1;
	}
	_onMessage(workerId, msg) {
		const resolve = this.workersResolve[workerId];
		resolve && resolve(msg);
		if (this.queue.length) {
			const { resolve, msg, transfer } = this.queue.shift();
			this.workersResolve[workerId] = resolve;
			this.workers[workerId].postMessage(msg, transfer);
		} else this.workerStatus ^= 1 << workerId;
	}
	/**
	* Sets a function that is responsible for creating Workers.
	*
	* @param {Function} workerCreator - The worker creator function.
	*/
	setWorkerCreator(workerCreator) {
		this.workerCreator = workerCreator;
	}
	/**
	* Sets the Worker limit
	*
	* @param {number} pool - The size of the pool.
	*/
	setWorkerLimit(pool) {
		this.pool = pool;
	}
	/**
	* Post a message to an idle Worker. If no Worker is available,
	* the message is pushed into a message queue for later processing.
	*
	* @param {Object} msg - The message.
	* @param {Array<ArrayBuffer>} transfer - An array with array buffers for data transfer.
	* @return {Promise} A Promise that resolves when the message has been processed.
	*/
	postMessage(msg, transfer) {
		return new Promise((resolve) => {
			const workerId = this._getIdleWorker();
			if (workerId !== -1) {
				this._initWorker(workerId);
				this.workerStatus |= 1 << workerId;
				this.workersResolve[workerId] = resolve;
				this.workers[workerId].postMessage(msg, transfer);
			} else this.queue.push({
				resolve,
				msg,
				transfer
			});
		});
	}
	/**
	* Terminates all Workers of this pool. Call this  method whenever this
	* Worker pool is no longer used in your app.
	*/
	dispose() {
		this.workers.forEach((worker) => worker.terminate());
		this.workersResolve.length = 0;
		this.workers.length = 0;
		this.queue.length = 0;
		this.workerStatus = 0;
	}
};
// node_modules/three/examples/jsm/libs/ktx-parse.module.js
var ri = 1000054e3;
var oi = 1000054001;
var ci = 1000054004;
var Ui = 1000054005;
var _i = 1000066e3;
var yi = 1000066004;
var Ci = class {
	constructor(t, e, n, i) {
		this._dataView = void 0, this._littleEndian = void 0, this._offset = void 0, this._dataView = new DataView(t.buffer, t.byteOffset + e, n), this._littleEndian = i, this._offset = 0;
	}
	_nextUint8() {
		const t = this._dataView.getUint8(this._offset);
		return this._offset += 1, t;
	}
	_nextUint16() {
		const t = this._dataView.getUint16(this._offset, this._littleEndian);
		return this._offset += 2, t;
	}
	_nextUint32() {
		const t = this._dataView.getUint32(this._offset, this._littleEndian);
		return this._offset += 4, t;
	}
	_nextUint64() {
		const t = this._dataView.getUint32(this._offset, this._littleEndian) + 2 ** 32 * this._dataView.getUint32(this._offset + 4, this._littleEndian);
		return this._offset += 8, t;
	}
	_nextInt32() {
		const t = this._dataView.getInt32(this._offset, this._littleEndian);
		return this._offset += 4, t;
	}
	_nextUint8Array(t) {
		const e = new Uint8Array(this._dataView.buffer, this._dataView.byteOffset + this._offset, t);
		return this._offset += t, e;
	}
	_skip(t) {
		return this._offset += t, this;
	}
	_scan(t, e = 0) {
		const n = this._offset;
		let i = 0;
		for (; this._dataView.getUint8(this._offset) !== e && i < t;) i++, this._offset++;
		return i < t && this._offset++, new Uint8Array(this._dataView.buffer, this._dataView.byteOffset + n, i);
	}
};
new Uint8Array([0]);
var Oi = [
	171,
	75,
	84,
	88,
	32,
	50,
	48,
	187,
	13,
	10,
	26,
	10
];
function Si(t) {
	return new TextDecoder().decode(t);
}
function Mi(t) {
	const e = new Uint8Array(t.buffer, t.byteOffset, Oi.length);
	if (e[0] !== Oi[0] || e[1] !== Oi[1] || e[2] !== Oi[2] || e[3] !== Oi[3] || e[4] !== Oi[4] || e[5] !== Oi[5] || e[6] !== Oi[6] || e[7] !== Oi[7] || e[8] !== Oi[8] || e[9] !== Oi[9] || e[10] !== Oi[10] || e[11] !== Oi[11]) throw new Error("Missing KTX 2.0 identifier.");
	const n = {
		vkFormat: 0,
		typeSize: 1,
		pixelWidth: 0,
		pixelHeight: 0,
		pixelDepth: 0,
		layerCount: 0,
		faceCount: 1,
		levelCount: 0,
		supercompressionScheme: 0,
		levels: [],
		dataFormatDescriptor: [{
			vendorId: 0,
			descriptorType: 0,
			versionNumber: 2,
			colorModel: 0,
			colorPrimaries: 1,
			transferFunction: 2,
			flags: 0,
			texelBlockDimension: [
				0,
				0,
				0,
				0
			],
			bytesPlane: [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			],
			samples: []
		}],
		keyValue: {},
		globalData: null
	}, i = 17 * Uint32Array.BYTES_PER_ELEMENT, s = new Ci(t, Oi.length, i, !0);
	n.vkFormat = s._nextUint32(), n.typeSize = s._nextUint32(), n.pixelWidth = s._nextUint32(), n.pixelHeight = s._nextUint32(), n.pixelDepth = s._nextUint32(), n.layerCount = s._nextUint32(), n.faceCount = s._nextUint32(), n.levelCount = s._nextUint32(), n.supercompressionScheme = s._nextUint32();
	const a = s._nextUint32(), r = s._nextUint32(), o = s._nextUint32(), l = s._nextUint32(), f = s._nextUint64(), c = s._nextUint64(), U = 3 * Math.max(n.levelCount, 1) * 8, h = new Ci(t, Oi.length + i, U, !0);
	for (let e = 0, i = Math.max(n.levelCount, 1); e < i; e++) n.levels.push({
		levelData: new Uint8Array(t.buffer, t.byteOffset + h._nextUint64(), h._nextUint64()),
		uncompressedByteLength: h._nextUint64()
	});
	const p = new Ci(t, a, r, !0);
	p._skip(4);
	const _ = p._nextUint16(), u = p._nextUint16(), g = p._nextUint16(), x = p._nextUint16(), y = {
		vendorId: _,
		descriptorType: u,
		versionNumber: g,
		colorModel: p._nextUint8(),
		colorPrimaries: p._nextUint8(),
		transferFunction: p._nextUint8(),
		flags: p._nextUint8(),
		texelBlockDimension: [
			p._nextUint8(),
			p._nextUint8(),
			p._nextUint8(),
			p._nextUint8()
		],
		bytesPlane: [
			p._nextUint8(),
			p._nextUint8(),
			p._nextUint8(),
			p._nextUint8(),
			p._nextUint8(),
			p._nextUint8(),
			p._nextUint8(),
			p._nextUint8()
		],
		samples: []
	}, b = (x / 4 - 6) / 4;
	for (let t = 0; t < b; t++) {
		const e = {
			bitOffset: p._nextUint16(),
			bitLength: p._nextUint8(),
			channelType: p._nextUint8(),
			samplePosition: [
				p._nextUint8(),
				p._nextUint8(),
				p._nextUint8(),
				p._nextUint8()
			],
			sampleLower: Number.NEGATIVE_INFINITY,
			sampleUpper: Number.POSITIVE_INFINITY
		};
		64 & e.channelType ? (e.sampleLower = p._nextInt32(), e.sampleUpper = p._nextInt32()) : (e.sampleLower = p._nextUint32(), e.sampleUpper = p._nextUint32()), y.samples[t] = e;
	}
	n.dataFormatDescriptor.length = 0, n.dataFormatDescriptor.push(y);
	const m = new Ci(t, o, l, !0);
	for (; m._offset < l;) {
		const t = m._nextUint32(), e = m._scan(t), i = Si(e);
		if (n.keyValue[i] = m._nextUint8Array(t - e.byteLength - 1), i.match(/^ktx/i)) {
			const t = Si(n.keyValue[i]);
			n.keyValue[i] = t.substring(0, t.lastIndexOf("\0"));
		}
		m._skip(t % 4 ? 4 - t % 4 : 0);
	}
	if (c <= 0) return n;
	const d = new Ci(t, f, c, !0), D = d._nextUint16(), w = d._nextUint16(), v = d._nextUint32(), B = d._nextUint32(), L = d._nextUint32(), A = d._nextUint32(), k = [];
	for (let t = 0, e = Math.max(n.levelCount, 1); t < e; t++) k.push({
		imageFlags: d._nextUint32(),
		rgbSliceByteOffset: d._nextUint32(),
		rgbSliceByteLength: d._nextUint32(),
		alphaSliceByteOffset: d._nextUint32(),
		alphaSliceByteLength: d._nextUint32()
	});
	const I = f + d._offset, V = I + v, C = V + B, F = C + L;
	return n.globalData = {
		endpointCount: D,
		selectorCount: w,
		imageDescs: k,
		endpointsData: new Uint8Array(t.buffer, t.byteOffset + I, v),
		selectorsData: new Uint8Array(t.buffer, t.byteOffset + V, B),
		tablesData: new Uint8Array(t.buffer, t.byteOffset + C, L),
		extendedData: new Uint8Array(t.buffer, t.byteOffset + F, A)
	}, n;
}
// node_modules/three/examples/jsm/libs/zstddec.module.js
var A;
var I;
var B;
var g = { env: { emscripten_notify_memory_growth: function(A) {
	B = new Uint8Array(I.exports.memory.buffer);
} } };
var Q = class {
	init() {
		return A || (A = "undefined" != typeof fetch ? fetch("data:application/wasm;base64," + C).then((A) => A.arrayBuffer()).then((A) => WebAssembly.instantiate(A, g)).then(this._init) : WebAssembly.instantiate(Buffer.from(C, "base64"), g).then(this._init), A);
	}
	_init(A) {
		I = A.instance, g.env.emscripten_notify_memory_growth(0);
	}
	decode(A, g = 0) {
		if (!I) throw new Error("ZSTDDecoder: Await .init() before decoding.");
		const Q = A.byteLength, C = I.exports.malloc(Q);
		B.set(A, C), g = g || Number(I.exports.ZSTD_findDecompressedSize(C, Q));
		const E = I.exports.malloc(g), i = I.exports.ZSTD_decompress(E, g, C, Q), D = B.slice(E, E + i);
		return I.exports.free(C), I.exports.free(E), D;
	}
};
var C = "AGFzbQEAAAABpQEVYAF/AX9gAn9/AGADf39/AX9gBX9/f39/AX9gAX8AYAJ/fwF/YAR/f39/AX9gA39/fwBgBn9/f39/fwF/YAd/f39/f39/AX9gAn9/AX5gAn5+AX5gAABgBX9/f39/AGAGf39/f39/AGAIf39/f39/f38AYAl/f39/f39/f38AYAABf2AIf39/f39/f38Bf2ANf39/f39/f39/f39/fwF/YAF/AX4CJwEDZW52H2Vtc2NyaXB0ZW5fbm90aWZ5X21lbW9yeV9ncm93dGgABANpaAEFAAAFAgEFCwACAQABAgIFBQcAAwABDgsBAQcAEhMHAAUBDAQEAAANBwQCAgYCBAgDAwMDBgEACQkHBgICAAYGAgQUBwYGAwIGAAMCAQgBBwUGCgoEEQAEBAEIAwgDBQgDEA8IAAcABAUBcAECAgUEAQCAAgYJAX8BQaCgwAILB2AHBm1lbW9yeQIABm1hbGxvYwAoBGZyZWUAJgxaU1REX2lzRXJyb3IAaBlaU1REX2ZpbmREZWNvbXByZXNzZWRTaXplAFQPWlNURF9kZWNvbXByZXNzAEoGX3N0YXJ0ACQJBwEAQQELASQKussBaA8AIAAgACgCBCABajYCBAsZACAAKAIAIAAoAgRBH3F0QQAgAWtBH3F2CwgAIABBiH9LC34BBH9BAyEBIAAoAgQiA0EgTQRAIAAoAggiASAAKAIQTwRAIAAQDQ8LIAAoAgwiAiABRgRAQQFBAiADQSBJGw8LIAAgASABIAJrIANBA3YiBCABIARrIAJJIgEbIgJrIgQ2AgggACADIAJBA3RrNgIEIAAgBCgAADYCAAsgAQsUAQF/IAAgARACIQIgACABEAEgAgv3AQECfyACRQRAIABCADcCACAAQQA2AhAgAEIANwIIQbh/DwsgACABNgIMIAAgAUEEajYCECACQQRPBEAgACABIAJqIgFBfGoiAzYCCCAAIAMoAAA2AgAgAUF/ai0AACIBBEAgAEEIIAEQFGs2AgQgAg8LIABBADYCBEF/DwsgACABNgIIIAAgAS0AACIDNgIAIAJBfmoiBEEBTQRAIARBAWtFBEAgACABLQACQRB0IANyIgM2AgALIAAgAS0AAUEIdCADajYCAAsgASACakF/ai0AACIBRQRAIABBADYCBEFsDwsgAEEoIAEQFCACQQN0ams2AgQgAgsWACAAIAEpAAA3AAAgACABKQAINwAICy8BAX8gAUECdEGgHWooAgAgACgCAEEgIAEgACgCBGprQR9xdnEhAiAAIAEQASACCyEAIAFCz9bTvtLHq9lCfiAAfEIfiUKHla+vmLbem55/fgsdAQF/IAAoAgggACgCDEYEfyAAKAIEQSBGBUEACwuCBAEDfyACQYDAAE8EQCAAIAEgAhBnIAAPCyAAIAJqIQMCQCAAIAFzQQNxRQRAAkAgAkEBSARAIAAhAgwBCyAAQQNxRQRAIAAhAgwBCyAAIQIDQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAiADTw0BIAJBA3ENAAsLAkAgA0F8cSIEQcAASQ0AIAIgBEFAaiIFSw0AA0AgAiABKAIANgIAIAIgASgCBDYCBCACIAEoAgg2AgggAiABKAIMNgIMIAIgASgCEDYCECACIAEoAhQ2AhQgAiABKAIYNgIYIAIgASgCHDYCHCACIAEoAiA2AiAgAiABKAIkNgIkIAIgASgCKDYCKCACIAEoAiw2AiwgAiABKAIwNgIwIAIgASgCNDYCNCACIAEoAjg2AjggAiABKAI8NgI8IAFBQGshASACQUBrIgIgBU0NAAsLIAIgBE8NAQNAIAIgASgCADYCACABQQRqIQEgAkEEaiICIARJDQALDAELIANBBEkEQCAAIQIMAQsgA0F8aiIEIABJBEAgACECDAELIAAhAgNAIAIgAS0AADoAACACIAEtAAE6AAEgAiABLQACOgACIAIgAS0AAzoAAyABQQRqIQEgAkEEaiICIARNDQALCyACIANJBEADQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAiADRw0ACwsgAAsMACAAIAEpAAA3AAALQQECfyAAKAIIIgEgACgCEEkEQEEDDwsgACAAKAIEIgJBB3E2AgQgACABIAJBA3ZrIgE2AgggACABKAAANgIAQQALDAAgACABKAIANgAAC/cCAQJ/AkAgACABRg0AAkAgASACaiAASwRAIAAgAmoiBCABSw0BCyAAIAEgAhALDwsgACABc0EDcSEDAkACQCAAIAFJBEAgAwRAIAAhAwwDCyAAQQNxRQRAIAAhAwwCCyAAIQMDQCACRQ0EIAMgAS0AADoAACABQQFqIQEgAkF/aiECIANBAWoiA0EDcQ0ACwwBCwJAIAMNACAEQQNxBEADQCACRQ0FIAAgAkF/aiICaiIDIAEgAmotAAA6AAAgA0EDcQ0ACwsgAkEDTQ0AA0AgACACQXxqIgJqIAEgAmooAgA2AgAgAkEDSw0ACwsgAkUNAgNAIAAgAkF/aiICaiABIAJqLQAAOgAAIAINAAsMAgsgAkEDTQ0AIAIhBANAIAMgASgCADYCACABQQRqIQEgA0EEaiEDIARBfGoiBEEDSw0ACyACQQNxIQILIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8wICAn8BfgJAIAJFDQAgACACaiIDQX9qIAE6AAAgACABOgAAIAJBA0kNACADQX5qIAE6AAAgACABOgABIANBfWogAToAACAAIAE6AAIgAkEHSQ0AIANBfGogAToAACAAIAE6AAMgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIEayICQSBJDQAgAa0iBUIghiAFhCEFIAMgBGohAQNAIAEgBTcDGCABIAU3AxAgASAFNwMIIAEgBTcDACABQSBqIQEgAkFgaiICQR9LDQALCyAACy8BAn8gACgCBCAAKAIAQQJ0aiICLQACIQMgACACLwEAIAEgAi0AAxAIajYCACADCy8BAn8gACgCBCAAKAIAQQJ0aiICLQACIQMgACACLwEAIAEgAi0AAxAFajYCACADCx8AIAAgASACKAIEEAg2AgAgARAEGiAAIAJBCGo2AgQLCAAgAGdBH3MLugUBDX8jAEEQayIKJAACfyAEQQNNBEAgCkEANgIMIApBDGogAyAEEAsaIAAgASACIApBDGpBBBAVIgBBbCAAEAMbIAAgACAESxsMAQsgAEEAIAEoAgBBAXRBAmoQECENQVQgAygAACIGQQ9xIgBBCksNABogAiAAQQVqNgIAIAMgBGoiAkF8aiEMIAJBeWohDiACQXtqIRAgAEEGaiELQQQhBSAGQQR2IQRBICAAdCIAQQFyIQkgASgCACEPQQAhAiADIQYCQANAIAlBAkggAiAPS3JFBEAgAiEHAkAgCARAA0AgBEH//wNxQf//A0YEQCAHQRhqIQcgBiAQSQR/IAZBAmoiBigAACAFdgUgBUEQaiEFIARBEHYLIQQMAQsLA0AgBEEDcSIIQQNGBEAgBUECaiEFIARBAnYhBCAHQQNqIQcMAQsLIAcgCGoiByAPSw0EIAVBAmohBQNAIAIgB0kEQCANIAJBAXRqQQA7AQAgAkEBaiECDAELCyAGIA5LQQAgBiAFQQN1aiIHIAxLG0UEQCAHKAAAIAVBB3EiBXYhBAwCCyAEQQJ2IQQLIAYhBwsCfyALQX9qIAQgAEF/anEiBiAAQQF0QX9qIgggCWsiEUkNABogBCAIcSIEQQAgESAEIABIG2shBiALCyEIIA0gAkEBdGogBkF/aiIEOwEAIAlBASAGayAEIAZBAUgbayEJA0AgCSAASARAIABBAXUhACALQX9qIQsMAQsLAn8gByAOS0EAIAcgBSAIaiIFQQN1aiIGIAxLG0UEQCAFQQdxDAELIAUgDCIGIAdrQQN0awshBSACQQFqIQIgBEUhCCAGKAAAIAVBH3F2IQQMAQsLQWwgCUEBRyAFQSBKcg0BGiABIAJBf2o2AgAgBiAFQQdqQQN1aiADawwBC0FQCyEAIApBEGokACAACwkAQQFBBSAAGwsMACAAIAEoAAA2AAALqgMBCn8jAEHwAGsiCiQAIAJBAWohDiAAQQhqIQtBgIAEIAVBf2p0QRB1IQxBACECQQEhBkEBIAV0IglBf2oiDyEIA0AgAiAORkUEQAJAIAEgAkEBdCINai8BACIHQf//A0YEQCALIAhBA3RqIAI2AgQgCEF/aiEIQQEhBwwBCyAGQQAgDCAHQRB0QRB1ShshBgsgCiANaiAHOwEAIAJBAWohAgwBCwsgACAFNgIEIAAgBjYCACAJQQN2IAlBAXZqQQNqIQxBACEAQQAhBkEAIQIDQCAGIA5GBEADQAJAIAAgCUYNACAKIAsgAEEDdGoiASgCBCIGQQF0aiICIAIvAQAiAkEBajsBACABIAUgAhAUayIIOgADIAEgAiAIQf8BcXQgCWs7AQAgASAEIAZBAnQiAmooAgA6AAIgASACIANqKAIANgIEIABBAWohAAwBCwsFIAEgBkEBdGouAQAhDUEAIQcDQCAHIA1ORQRAIAsgAkEDdGogBjYCBANAIAIgDGogD3EiAiAISw0ACyAHQQFqIQcMAQsLIAZBAWohBgwBCwsgCkHwAGokAAsjAEIAIAEQCSAAhUKHla+vmLbem55/fkLj3MqV/M7y9YV/fAsQACAAQn43AwggACABNgIACyQBAX8gAARAIAEoAgQiAgRAIAEoAgggACACEQEADwsgABAmCwsfACAAIAEgAi8BABAINgIAIAEQBBogACACQQRqNgIEC0oBAX9BoCAoAgAiASAAaiIAQX9MBEBBiCBBMDYCAEF/DwsCQCAAPwBBEHRNDQAgABBmDQBBiCBBMDYCAEF/DwtBoCAgADYCACABC9cBAQh/Qbp/IQoCQCACKAIEIgggAigCACIJaiIOIAEgAGtLDQBBbCEKIAkgBCADKAIAIgtrSw0AIAAgCWoiBCACKAIIIgxrIQ0gACABQWBqIg8gCyAJQQAQKSADIAkgC2o2AgACQAJAIAwgBCAFa00EQCANIQUMAQsgDCAEIAZrSw0CIAcgDSAFayIAaiIBIAhqIAdNBEAgBCABIAgQDxoMAgsgBCABQQAgAGsQDyEBIAIgACAIaiIINgIEIAEgAGshBAsgBCAPIAUgCEEBECkLIA4hCgsgCgubAgEBfyMAQYABayINJAAgDSADNgJ8AkAgAkEDSwRAQX8hCQwBCwJAAkACQAJAIAJBAWsOAwADAgELIAZFBEBBuH8hCQwEC0FsIQkgBS0AACICIANLDQMgACAHIAJBAnQiAmooAgAgAiAIaigCABA7IAEgADYCAEEBIQkMAwsgASAJNgIAQQAhCQwCCyAKRQRAQWwhCQwCC0EAIQkgC0UgDEEZSHINAUEIIAR0QQhqIQBBACECA0AgAiAATw0CIAJBQGshAgwAAAsAC0FsIQkgDSANQfwAaiANQfgAaiAFIAYQFSICEAMNACANKAJ4IgMgBEsNACAAIA0gDSgCfCAHIAggAxAYIAEgADYCACACIQkLIA1BgAFqJAAgCQsLACAAIAEgAhALGgsQACAALwAAIAAtAAJBEHRyCy8AAn9BuH8gAUEISQ0AGkFyIAAoAAQiAEF3Sw0AGkG4fyAAQQhqIgAgACABSxsLCwkAIAAgATsAAAsDAAELigYBBX8gACAAKAIAIgVBfnE2AgBBACAAIAVBAXZqQYQgKAIAIgQgAEYbIQECQAJAIAAoAgQiAkUNACACKAIAIgNBAXENACACQQhqIgUgA0EBdkF4aiIDQQggA0EISxtnQR9zQQJ0QYAfaiIDKAIARgRAIAMgAigCDDYCAAsgAigCCCIDBEAgAyACKAIMNgIECyACKAIMIgMEQCADIAIoAgg2AgALIAIgAigCACAAKAIAQX5xajYCAEGEICEAAkACQCABRQ0AIAEgAjYCBCABKAIAIgNBAXENASADQQF2QXhqIgNBCCADQQhLG2dBH3NBAnRBgB9qIgMoAgAgAUEIakYEQCADIAEoAgw2AgALIAEoAggiAwRAIAMgASgCDDYCBAsgASgCDCIDBEAgAyABKAIINgIAQYQgKAIAIQQLIAIgAigCACABKAIAQX5xajYCACABIARGDQAgASABKAIAQQF2akEEaiEACyAAIAI2AgALIAIoAgBBAXZBeGoiAEEIIABBCEsbZ0Efc0ECdEGAH2oiASgCACEAIAEgBTYCACACIAA2AgwgAkEANgIIIABFDQEgACAFNgIADwsCQCABRQ0AIAEoAgAiAkEBcQ0AIAJBAXZBeGoiAkEIIAJBCEsbZ0Efc0ECdEGAH2oiAigCACABQQhqRgRAIAIgASgCDDYCAAsgASgCCCICBEAgAiABKAIMNgIECyABKAIMIgIEQCACIAEoAgg2AgBBhCAoAgAhBAsgACAAKAIAIAEoAgBBfnFqIgI2AgACQCABIARHBEAgASABKAIAQQF2aiAANgIEIAAoAgAhAgwBC0GEICAANgIACyACQQF2QXhqIgFBCCABQQhLG2dBH3NBAnRBgB9qIgIoAgAhASACIABBCGoiAjYCACAAIAE2AgwgAEEANgIIIAFFDQEgASACNgIADwsgBUEBdkF4aiIBQQggAUEISxtnQR9zQQJ0QYAfaiICKAIAIQEgAiAAQQhqIgI2AgAgACABNgIMIABBADYCCCABRQ0AIAEgAjYCAAsLDgAgAARAIABBeGoQJQsLgAIBA38CQCAAQQ9qQXhxQYQgKAIAKAIAQQF2ayICEB1Bf0YNAAJAQYQgKAIAIgAoAgAiAUEBcQ0AIAFBAXZBeGoiAUEIIAFBCEsbZ0Efc0ECdEGAH2oiASgCACAAQQhqRgRAIAEgACgCDDYCAAsgACgCCCIBBEAgASAAKAIMNgIECyAAKAIMIgFFDQAgASAAKAIINgIAC0EBIQEgACAAKAIAIAJBAXRqIgI2AgAgAkEBcQ0AIAJBAXZBeGoiAkEIIAJBCEsbZ0Efc0ECdEGAH2oiAygCACECIAMgAEEIaiIDNgIAIAAgAjYCDCAAQQA2AgggAkUNACACIAM2AgALIAELtwIBA38CQAJAIABBASAAGyICEDgiAA0AAkACQEGEICgCACIARQ0AIAAoAgAiA0EBcQ0AIAAgA0EBcjYCACADQQF2QXhqIgFBCCABQQhLG2dBH3NBAnRBgB9qIgEoAgAgAEEIakYEQCABIAAoAgw2AgALIAAoAggiAQRAIAEgACgCDDYCBAsgACgCDCIBBEAgASAAKAIINgIACyACECchAkEAIQFBhCAoAgAhACACDQEgACAAKAIAQX5xNgIAQQAPCyACQQ9qQXhxIgMQHSICQX9GDQIgAkEHakF4cSIAIAJHBEAgACACaxAdQX9GDQMLAkBBhCAoAgAiAUUEQEGAICAANgIADAELIAAgATYCBAtBhCAgADYCACAAIANBAXRBAXI2AgAMAQsgAEUNAQsgAEEIaiEBCyABC7kDAQJ/IAAgA2ohBQJAIANBB0wEQANAIAAgBU8NAiAAIAItAAA6AAAgAEEBaiEAIAJBAWohAgwAAAsACyAEQQFGBEACQCAAIAJrIgZBB00EQCAAIAItAAA6AAAgACACLQABOgABIAAgAi0AAjoAAiAAIAItAAM6AAMgAEEEaiACIAZBAnQiBkHAHmooAgBqIgIQFyACIAZB4B5qKAIAayECDAELIAAgAhAMCyACQQhqIQIgAEEIaiEACwJAAkACQAJAIAUgAU0EQCAAIANqIQEgBEEBRyAAIAJrQQ9Kcg0BA0AgACACEAwgAkEIaiECIABBCGoiACABSQ0ACwwFCyAAIAFLBEAgACEBDAQLIARBAUcgACACa0EPSnINASAAIQMgAiEEA0AgAyAEEAwgBEEIaiEEIANBCGoiAyABSQ0ACwwCCwNAIAAgAhAHIAJBEGohAiAAQRBqIgAgAUkNAAsMAwsgACEDIAIhBANAIAMgBBAHIARBEGohBCADQRBqIgMgAUkNAAsLIAIgASAAa2ohAgsDQCABIAVPDQEgASACLQAAOgAAIAFBAWohASACQQFqIQIMAAALAAsLQQECfyAAIAAoArjgASIDNgLE4AEgACgCvOABIQQgACABNgK84AEgACABIAJqNgK44AEgACABIAQgA2tqNgLA4AELpgEBAX8gACAAKALs4QEQFjYCyOABIABCADcD+OABIABCADcDuOABIABBwOABakIANwMAIABBqNAAaiIBQYyAgOAANgIAIABBADYCmOIBIABCADcDiOEBIABCAzcDgOEBIABBrNABakHgEikCADcCACAAQbTQAWpB6BIoAgA2AgAgACABNgIMIAAgAEGYIGo2AgggACAAQaAwajYCBCAAIABBEGo2AgALYQEBf0G4fyEDAkAgAUEDSQ0AIAIgABAhIgFBA3YiADYCCCACIAFBAXE2AgQgAiABQQF2QQNxIgM2AgACQCADQX9qIgFBAksNAAJAIAFBAWsOAgEAAgtBbA8LIAAhAwsgAwsMACAAIAEgAkEAEC4LiAQCA38CfiADEBYhBCAAQQBBKBAQIQAgBCACSwRAIAQPCyABRQRAQX8PCwJAAkAgA0EBRg0AIAEoAAAiBkGo6r5pRg0AQXYhAyAGQXBxQdDUtMIBRw0BQQghAyACQQhJDQEgAEEAQSgQECEAIAEoAAQhASAAQQE2AhQgACABrTcDAEEADwsgASACIAMQLyIDIAJLDQAgACADNgIYQXIhAyABIARqIgVBf2otAAAiAkEIcQ0AIAJBIHEiBkUEQEFwIQMgBS0AACIFQacBSw0BIAVBB3GtQgEgBUEDdkEKaq2GIgdCA4h+IAd8IQggBEEBaiEECyACQQZ2IQMgAkECdiEFAkAgAkEDcUF/aiICQQJLBEBBACECDAELAkACQAJAIAJBAWsOAgECAAsgASAEai0AACECIARBAWohBAwCCyABIARqLwAAIQIgBEECaiEEDAELIAEgBGooAAAhAiAEQQRqIQQLIAVBAXEhBQJ+AkACQAJAIANBf2oiA0ECTQRAIANBAWsOAgIDAQtCfyAGRQ0DGiABIARqMQAADAMLIAEgBGovAACtQoACfAwCCyABIARqKAAArQwBCyABIARqKQAACyEHIAAgBTYCICAAIAI2AhwgACAHNwMAQQAhAyAAQQA2AhQgACAHIAggBhsiBzcDCCAAIAdCgIAIIAdCgIAIVBs+AhALIAMLWwEBf0G4fyEDIAIQFiICIAFNBH8gACACakF/ai0AACIAQQNxQQJ0QaAeaigCACACaiAAQQZ2IgFBAnRBsB5qKAIAaiAAQSBxIgBFaiABRSAAQQV2cWoFQbh/CwsdACAAKAKQ4gEQWiAAQQA2AqDiASAAQgA3A5DiAQu1AwEFfyMAQZACayIKJABBuH8hBgJAIAVFDQAgBCwAACIIQf8BcSEHAkAgCEF/TARAIAdBgn9qQQF2IgggBU8NAkFsIQYgB0GBf2oiBUGAAk8NAiAEQQFqIQdBACEGA0AgBiAFTwRAIAUhBiAIIQcMAwUgACAGaiAHIAZBAXZqIgQtAABBBHY6AAAgACAGQQFyaiAELQAAQQ9xOgAAIAZBAmohBgwBCwAACwALIAcgBU8NASAAIARBAWogByAKEFMiBhADDQELIAYhBEEAIQYgAUEAQTQQECEJQQAhBQNAIAQgBkcEQCAAIAZqIggtAAAiAUELSwRAQWwhBgwDBSAJIAFBAnRqIgEgASgCAEEBajYCACAGQQFqIQZBASAILQAAdEEBdSAFaiEFDAILAAsLQWwhBiAFRQ0AIAUQFEEBaiIBQQxLDQAgAyABNgIAQQFBASABdCAFayIDEBQiAXQgA0cNACAAIARqIAFBAWoiADoAACAJIABBAnRqIgAgACgCAEEBajYCACAJKAIEIgBBAkkgAEEBcXINACACIARBAWo2AgAgB0EBaiEGCyAKQZACaiQAIAYLxhEBDH8jAEHwAGsiBSQAQWwhCwJAIANBCkkNACACLwAAIQogAi8AAiEJIAIvAAQhByAFQQhqIAQQDgJAIAMgByAJIApqakEGaiIMSQ0AIAUtAAohCCAFQdgAaiACQQZqIgIgChAGIgsQAw0BIAVBQGsgAiAKaiICIAkQBiILEAMNASAFQShqIAIgCWoiAiAHEAYiCxADDQEgBUEQaiACIAdqIAMgDGsQBiILEAMNASAAIAFqIg9BfWohECAEQQRqIQZBASELIAAgAUEDakECdiIDaiIMIANqIgIgA2oiDiEDIAIhBCAMIQcDQCALIAMgEElxBEAgACAGIAVB2ABqIAgQAkECdGoiCS8BADsAACAFQdgAaiAJLQACEAEgCS0AAyELIAcgBiAFQUBrIAgQAkECdGoiCS8BADsAACAFQUBrIAktAAIQASAJLQADIQogBCAGIAVBKGogCBACQQJ0aiIJLwEAOwAAIAVBKGogCS0AAhABIAktAAMhCSADIAYgBUEQaiAIEAJBAnRqIg0vAQA7AAAgBUEQaiANLQACEAEgDS0AAyENIAAgC2oiCyAGIAVB2ABqIAgQAkECdGoiAC8BADsAACAFQdgAaiAALQACEAEgAC0AAyEAIAcgCmoiCiAGIAVBQGsgCBACQQJ0aiIHLwEAOwAAIAVBQGsgBy0AAhABIActAAMhByAEIAlqIgkgBiAFQShqIAgQAkECdGoiBC8BADsAACAFQShqIAQtAAIQASAELQADIQQgAyANaiIDIAYgBUEQaiAIEAJBAnRqIg0vAQA7AAAgBUEQaiANLQACEAEgACALaiEAIAcgCmohByAEIAlqIQQgAyANLQADaiEDIAVB2ABqEA0gBUFAaxANciAFQShqEA1yIAVBEGoQDXJFIQsMAQsLIAQgDksgByACS3INAEFsIQsgACAMSw0BIAxBfWohCQNAQQAgACAJSSAFQdgAahAEGwRAIAAgBiAFQdgAaiAIEAJBAnRqIgovAQA7AAAgBUHYAGogCi0AAhABIAAgCi0AA2oiACAGIAVB2ABqIAgQAkECdGoiCi8BADsAACAFQdgAaiAKLQACEAEgACAKLQADaiEADAEFIAxBfmohCgNAIAVB2ABqEAQgACAKS3JFBEAgACAGIAVB2ABqIAgQAkECdGoiCS8BADsAACAFQdgAaiAJLQACEAEgACAJLQADaiEADAELCwNAIAAgCk0EQCAAIAYgBUHYAGogCBACQQJ0aiIJLwEAOwAAIAVB2ABqIAktAAIQASAAIAktAANqIQAMAQsLAkAgACAMTw0AIAAgBiAFQdgAaiAIEAIiAEECdGoiDC0AADoAACAMLQADQQFGBEAgBUHYAGogDC0AAhABDAELIAUoAlxBH0sNACAFQdgAaiAGIABBAnRqLQACEAEgBSgCXEEhSQ0AIAVBIDYCXAsgAkF9aiEMA0BBACAHIAxJIAVBQGsQBBsEQCAHIAYgBUFAayAIEAJBAnRqIgAvAQA7AAAgBUFAayAALQACEAEgByAALQADaiIAIAYgBUFAayAIEAJBAnRqIgcvAQA7AAAgBUFAayAHLQACEAEgACAHLQADaiEHDAEFIAJBfmohDANAIAVBQGsQBCAHIAxLckUEQCAHIAYgBUFAayAIEAJBAnRqIgAvAQA7AAAgBUFAayAALQACEAEgByAALQADaiEHDAELCwNAIAcgDE0EQCAHIAYgBUFAayAIEAJBAnRqIgAvAQA7AAAgBUFAayAALQACEAEgByAALQADaiEHDAELCwJAIAcgAk8NACAHIAYgBUFAayAIEAIiAEECdGoiAi0AADoAACACLQADQQFGBEAgBUFAayACLQACEAEMAQsgBSgCREEfSw0AIAVBQGsgBiAAQQJ0ai0AAhABIAUoAkRBIUkNACAFQSA2AkQLIA5BfWohAgNAQQAgBCACSSAFQShqEAQbBEAgBCAGIAVBKGogCBACQQJ0aiIALwEAOwAAIAVBKGogAC0AAhABIAQgAC0AA2oiACAGIAVBKGogCBACQQJ0aiIELwEAOwAAIAVBKGogBC0AAhABIAAgBC0AA2ohBAwBBSAOQX5qIQIDQCAFQShqEAQgBCACS3JFBEAgBCAGIAVBKGogCBACQQJ0aiIALwEAOwAAIAVBKGogAC0AAhABIAQgAC0AA2ohBAwBCwsDQCAEIAJNBEAgBCAGIAVBKGogCBACQQJ0aiIALwEAOwAAIAVBKGogAC0AAhABIAQgAC0AA2ohBAwBCwsCQCAEIA5PDQAgBCAGIAVBKGogCBACIgBBAnRqIgItAAA6AAAgAi0AA0EBRgRAIAVBKGogAi0AAhABDAELIAUoAixBH0sNACAFQShqIAYgAEECdGotAAIQASAFKAIsQSFJDQAgBUEgNgIsCwNAQQAgAyAQSSAFQRBqEAQbBEAgAyAGIAVBEGogCBACQQJ0aiIALwEAOwAAIAVBEGogAC0AAhABIAMgAC0AA2oiACAGIAVBEGogCBACQQJ0aiICLwEAOwAAIAVBEGogAi0AAhABIAAgAi0AA2ohAwwBBSAPQX5qIQIDQCAFQRBqEAQgAyACS3JFBEAgAyAGIAVBEGogCBACQQJ0aiIALwEAOwAAIAVBEGogAC0AAhABIAMgAC0AA2ohAwwBCwsDQCADIAJNBEAgAyAGIAVBEGogCBACQQJ0aiIALwEAOwAAIAVBEGogAC0AAhABIAMgAC0AA2ohAwwBCwsCQCADIA9PDQAgAyAGIAVBEGogCBACIgBBAnRqIgItAAA6AAAgAi0AA0EBRgRAIAVBEGogAi0AAhABDAELIAUoAhRBH0sNACAFQRBqIAYgAEECdGotAAIQASAFKAIUQSFJDQAgBUEgNgIUCyABQWwgBUHYAGoQCiAFQUBrEApxIAVBKGoQCnEgBUEQahAKcRshCwwJCwAACwALAAALAAsAAAsACwAACwALQWwhCwsgBUHwAGokACALC7UEAQ5/IwBBEGsiBiQAIAZBBGogABAOQVQhBQJAIARB3AtJDQAgBi0ABCEHIANB8ARqQQBB7AAQECEIIAdBDEsNACADQdwJaiIJIAggBkEIaiAGQQxqIAEgAhAxIhAQA0UEQCAGKAIMIgQgB0sNASADQdwFaiEPIANBpAVqIREgAEEEaiESIANBqAVqIQEgBCEFA0AgBSICQX9qIQUgCCACQQJ0aigCAEUNAAsgAkEBaiEOQQEhBQNAIAUgDk9FBEAgCCAFQQJ0IgtqKAIAIQwgASALaiAKNgIAIAVBAWohBSAKIAxqIQoMAQsLIAEgCjYCAEEAIQUgBigCCCELA0AgBSALRkUEQCABIAUgCWotAAAiDEECdGoiDSANKAIAIg1BAWo2AgAgDyANQQF0aiINIAw6AAEgDSAFOgAAIAVBAWohBQwBCwtBACEBIANBADYCqAUgBEF/cyAHaiEJQQEhBQNAIAUgDk9FBEAgCCAFQQJ0IgtqKAIAIQwgAyALaiABNgIAIAwgBSAJanQgAWohASAFQQFqIQUMAQsLIAcgBEEBaiIBIAJrIgRrQQFqIQgDQEEBIQUgBCAIT0UEQANAIAUgDk9FBEAgBUECdCIJIAMgBEE0bGpqIAMgCWooAgAgBHY2AgAgBUEBaiEFDAELCyAEQQFqIQQMAQsLIBIgByAPIAogESADIAIgARBkIAZBAToABSAGIAc6AAYgACAGKAIENgIACyAQIQULIAZBEGokACAFC8ENAQt/IwBB8ABrIgUkAEFsIQkCQCADQQpJDQAgAi8AACEKIAIvAAIhDCACLwAEIQYgBUEIaiAEEA4CQCADIAYgCiAMampBBmoiDUkNACAFLQAKIQcgBUHYAGogAkEGaiICIAoQBiIJEAMNASAFQUBrIAIgCmoiAiAMEAYiCRADDQEgBUEoaiACIAxqIgIgBhAGIgkQAw0BIAVBEGogAiAGaiADIA1rEAYiCRADDQEgACABaiIOQX1qIQ8gBEEEaiEGQQEhCSAAIAFBA2pBAnYiAmoiCiACaiIMIAJqIg0hAyAMIQQgCiECA0AgCSADIA9JcQRAIAYgBUHYAGogBxACQQF0aiIILQAAIQsgBUHYAGogCC0AARABIAAgCzoAACAGIAVBQGsgBxACQQF0aiIILQAAIQsgBUFAayAILQABEAEgAiALOgAAIAYgBUEoaiAHEAJBAXRqIggtAAAhCyAFQShqIAgtAAEQASAEIAs6AAAgBiAFQRBqIAcQAkEBdGoiCC0AACELIAVBEGogCC0AARABIAMgCzoAACAGIAVB2ABqIAcQAkEBdGoiCC0AACELIAVB2ABqIAgtAAEQASAAIAs6AAEgBiAFQUBrIAcQAkEBdGoiCC0AACELIAVBQGsgCC0AARABIAIgCzoAASAGIAVBKGogBxACQQF0aiIILQAAIQsgBUEoaiAILQABEAEgBCALOgABIAYgBUEQaiAHEAJBAXRqIggtAAAhCyAFQRBqIAgtAAEQASADIAs6AAEgA0ECaiEDIARBAmohBCACQQJqIQIgAEECaiEAIAkgBUHYAGoQDUVxIAVBQGsQDUVxIAVBKGoQDUVxIAVBEGoQDUVxIQkMAQsLIAQgDUsgAiAMS3INAEFsIQkgACAKSw0BIApBfWohCQNAIAVB2ABqEAQgACAJT3JFBEAgBiAFQdgAaiAHEAJBAXRqIggtAAAhCyAFQdgAaiAILQABEAEgACALOgAAIAYgBUHYAGogBxACQQF0aiIILQAAIQsgBUHYAGogCC0AARABIAAgCzoAASAAQQJqIQAMAQsLA0AgBUHYAGoQBCAAIApPckUEQCAGIAVB2ABqIAcQAkEBdGoiCS0AACEIIAVB2ABqIAktAAEQASAAIAg6AAAgAEEBaiEADAELCwNAIAAgCkkEQCAGIAVB2ABqIAcQAkEBdGoiCS0AACEIIAVB2ABqIAktAAEQASAAIAg6AAAgAEEBaiEADAELCyAMQX1qIQADQCAFQUBrEAQgAiAAT3JFBEAgBiAFQUBrIAcQAkEBdGoiCi0AACEJIAVBQGsgCi0AARABIAIgCToAACAGIAVBQGsgBxACQQF0aiIKLQAAIQkgBUFAayAKLQABEAEgAiAJOgABIAJBAmohAgwBCwsDQCAFQUBrEAQgAiAMT3JFBEAgBiAFQUBrIAcQAkEBdGoiAC0AACEKIAVBQGsgAC0AARABIAIgCjoAACACQQFqIQIMAQsLA0AgAiAMSQRAIAYgBUFAayAHEAJBAXRqIgAtAAAhCiAFQUBrIAAtAAEQASACIAo6AAAgAkEBaiECDAELCyANQX1qIQADQCAFQShqEAQgBCAAT3JFBEAgBiAFQShqIAcQAkEBdGoiAi0AACEKIAVBKGogAi0AARABIAQgCjoAACAGIAVBKGogBxACQQF0aiICLQAAIQogBUEoaiACLQABEAEgBCAKOgABIARBAmohBAwBCwsDQCAFQShqEAQgBCANT3JFBEAgBiAFQShqIAcQAkEBdGoiAC0AACECIAVBKGogAC0AARABIAQgAjoAACAEQQFqIQQMAQsLA0AgBCANSQRAIAYgBUEoaiAHEAJBAXRqIgAtAAAhAiAFQShqIAAtAAEQASAEIAI6AAAgBEEBaiEEDAELCwNAIAVBEGoQBCADIA9PckUEQCAGIAVBEGogBxACQQF0aiIALQAAIQIgBUEQaiAALQABEAEgAyACOgAAIAYgBUEQaiAHEAJBAXRqIgAtAAAhAiAFQRBqIAAtAAEQASADIAI6AAEgA0ECaiEDDAELCwNAIAVBEGoQBCADIA5PckUEQCAGIAVBEGogBxACQQF0aiIALQAAIQIgBUEQaiAALQABEAEgAyACOgAAIANBAWohAwwBCwsDQCADIA5JBEAgBiAFQRBqIAcQAkEBdGoiAC0AACECIAVBEGogAC0AARABIAMgAjoAACADQQFqIQMMAQsLIAFBbCAFQdgAahAKIAVBQGsQCnEgBUEoahAKcSAFQRBqEApxGyEJDAELQWwhCQsgBUHwAGokACAJC8oCAQR/IwBBIGsiBSQAIAUgBBAOIAUtAAIhByAFQQhqIAIgAxAGIgIQA0UEQCAEQQRqIQIgACABaiIDQX1qIQQDQCAFQQhqEAQgACAET3JFBEAgAiAFQQhqIAcQAkEBdGoiBi0AACEIIAVBCGogBi0AARABIAAgCDoAACACIAVBCGogBxACQQF0aiIGLQAAIQggBUEIaiAGLQABEAEgACAIOgABIABBAmohAAwBCwsDQCAFQQhqEAQgACADT3JFBEAgAiAFQQhqIAcQAkEBdGoiBC0AACEGIAVBCGogBC0AARABIAAgBjoAACAAQQFqIQAMAQsLA0AgACADT0UEQCACIAVBCGogBxACQQF0aiIELQAAIQYgBUEIaiAELQABEAEgACAGOgAAIABBAWohAAwBCwsgAUFsIAVBCGoQChshAgsgBUEgaiQAIAILtgMBCX8jAEEQayIGJAAgBkEANgIMIAZBADYCCEFUIQQCQAJAIANBQGsiDCADIAZBCGogBkEMaiABIAIQMSICEAMNACAGQQRqIAAQDiAGKAIMIgcgBi0ABEEBaksNASAAQQRqIQogBkEAOgAFIAYgBzoABiAAIAYoAgQ2AgAgB0EBaiEJQQEhBANAIAQgCUkEQCADIARBAnRqIgEoAgAhACABIAU2AgAgACAEQX9qdCAFaiEFIARBAWohBAwBCwsgB0EBaiEHQQAhBSAGKAIIIQkDQCAFIAlGDQEgAyAFIAxqLQAAIgRBAnRqIgBBASAEdEEBdSILIAAoAgAiAWoiADYCACAHIARrIQhBACEEAkAgC0EDTQRAA0AgBCALRg0CIAogASAEakEBdGoiACAIOgABIAAgBToAACAEQQFqIQQMAAALAAsDQCABIABPDQEgCiABQQF0aiIEIAg6AAEgBCAFOgAAIAQgCDoAAyAEIAU6AAIgBCAIOgAFIAQgBToABCAEIAg6AAcgBCAFOgAGIAFBBGohAQwAAAsACyAFQQFqIQUMAAALAAsgAiEECyAGQRBqJAAgBAutAQECfwJAQYQgKAIAIABHIAAoAgBBAXYiAyABa0F4aiICQXhxQQhHcgR/IAIFIAMQJ0UNASACQQhqC0EQSQ0AIAAgACgCACICQQFxIAAgAWpBD2pBeHEiASAAa0EBdHI2AgAgASAANgIEIAEgASgCAEEBcSAAIAJBAXZqIAFrIgJBAXRyNgIAQYQgIAEgAkH/////B3FqQQRqQYQgKAIAIABGGyABNgIAIAEQJQsLygIBBX8CQAJAAkAgAEEIIABBCEsbZ0EfcyAAaUEBR2oiAUEESSAAIAF2cg0AIAFBAnRB/B5qKAIAIgJFDQADQCACQXhqIgMoAgBBAXZBeGoiBSAATwRAIAIgBUEIIAVBCEsbZ0Efc0ECdEGAH2oiASgCAEYEQCABIAIoAgQ2AgALDAMLIARBHksNASAEQQFqIQQgAigCBCICDQALC0EAIQMgAUEgTw0BA0AgAUECdEGAH2ooAgAiAkUEQCABQR5LIQIgAUEBaiEBIAJFDQEMAwsLIAIgAkF4aiIDKAIAQQF2QXhqIgFBCCABQQhLG2dBH3NBAnRBgB9qIgEoAgBGBEAgASACKAIENgIACwsgAigCACIBBEAgASACKAIENgIECyACKAIEIgEEQCABIAIoAgA2AgALIAMgAygCAEEBcjYCACADIAAQNwsgAwvhCwINfwV+IwBB8ABrIgckACAHIAAoAvDhASIINgJcIAEgAmohDSAIIAAoAoDiAWohDwJAAkAgBUUEQCABIQQMAQsgACgCxOABIRAgACgCwOABIREgACgCvOABIQ4gAEEBNgKM4QFBACEIA0AgCEEDRwRAIAcgCEECdCICaiAAIAJqQazQAWooAgA2AkQgCEEBaiEIDAELC0FsIQwgB0EYaiADIAQQBhADDQEgB0EsaiAHQRhqIAAoAgAQEyAHQTRqIAdBGGogACgCCBATIAdBPGogB0EYaiAAKAIEEBMgDUFgaiESIAEhBEEAIQwDQCAHKAIwIAcoAixBA3RqKQIAIhRCEIinQf8BcSEIIAcoAkAgBygCPEEDdGopAgAiFUIQiKdB/wFxIQsgBygCOCAHKAI0QQN0aikCACIWQiCIpyEJIBVCIIghFyAUQiCIpyECAkAgFkIQiKdB/wFxIgNBAk8EQAJAIAZFIANBGUlyRQRAIAkgB0EYaiADQSAgBygCHGsiCiAKIANLGyIKEAUgAyAKayIDdGohCSAHQRhqEAQaIANFDQEgB0EYaiADEAUgCWohCQwBCyAHQRhqIAMQBSAJaiEJIAdBGGoQBBoLIAcpAkQhGCAHIAk2AkQgByAYNwNIDAELAkAgA0UEQCACBEAgBygCRCEJDAMLIAcoAkghCQwBCwJAAkAgB0EYakEBEAUgCSACRWpqIgNBA0YEQCAHKAJEQX9qIgMgA0VqIQkMAQsgA0ECdCAHaigCRCIJIAlFaiEJIANBAUYNAQsgByAHKAJINgJMCwsgByAHKAJENgJIIAcgCTYCRAsgF6chAyALBEAgB0EYaiALEAUgA2ohAwsgCCALakEUTwRAIAdBGGoQBBoLIAgEQCAHQRhqIAgQBSACaiECCyAHQRhqEAQaIAcgB0EYaiAUQhiIp0H/AXEQCCAUp0H//wNxajYCLCAHIAdBGGogFUIYiKdB/wFxEAggFadB//8DcWo2AjwgB0EYahAEGiAHIAdBGGogFkIYiKdB/wFxEAggFqdB//8DcWo2AjQgByACNgJgIAcoAlwhCiAHIAk2AmggByADNgJkAkACQAJAIAQgAiADaiILaiASSw0AIAIgCmoiEyAPSw0AIA0gBGsgC0Egak8NAQsgByAHKQNoNwMQIAcgBykDYDcDCCAEIA0gB0EIaiAHQdwAaiAPIA4gESAQEB4hCwwBCyACIARqIQggBCAKEAcgAkERTwRAIARBEGohAgNAIAIgCkEQaiIKEAcgAkEQaiICIAhJDQALCyAIIAlrIQIgByATNgJcIAkgCCAOa0sEQCAJIAggEWtLBEBBbCELDAILIBAgAiAOayICaiIKIANqIBBNBEAgCCAKIAMQDxoMAgsgCCAKQQAgAmsQDyEIIAcgAiADaiIDNgJkIAggAmshCCAOIQILIAlBEE8EQCADIAhqIQMDQCAIIAIQByACQRBqIQIgCEEQaiIIIANJDQALDAELAkAgCUEHTQRAIAggAi0AADoAACAIIAItAAE6AAEgCCACLQACOgACIAggAi0AAzoAAyAIQQRqIAIgCUECdCIDQcAeaigCAGoiAhAXIAIgA0HgHmooAgBrIQIgBygCZCEDDAELIAggAhAMCyADQQlJDQAgAyAIaiEDIAhBCGoiCCACQQhqIgJrQQ9MBEADQCAIIAIQDCACQQhqIQIgCEEIaiIIIANJDQAMAgALAAsDQCAIIAIQByACQRBqIQIgCEEQaiIIIANJDQALCyAHQRhqEAQaIAsgDCALEAMiAhshDCAEIAQgC2ogAhshBCAFQX9qIgUNAAsgDBADDQFBbCEMIAdBGGoQBEECSQ0BQQAhCANAIAhBA0cEQCAAIAhBAnQiAmpBrNABaiACIAdqKAJENgIAIAhBAWohCAwBCwsgBygCXCEIC0G6fyEMIA8gCGsiACANIARrSw0AIAQEfyAEIAggABALIABqBUEACyABayEMCyAHQfAAaiQAIAwLkRcCFn8FfiMAQdABayIHJAAgByAAKALw4QEiCDYCvAEgASACaiESIAggACgCgOIBaiETAkACQCAFRQRAIAEhAwwBCyAAKALE4AEhESAAKALA4AEhFSAAKAK84AEhDyAAQQE2AozhAUEAIQgDQCAIQQNHBEAgByAIQQJ0IgJqIAAgAmpBrNABaigCADYCVCAIQQFqIQgMAQsLIAcgETYCZCAHIA82AmAgByABIA9rNgJoQWwhECAHQShqIAMgBBAGEAMNASAFQQQgBUEESBshFyAHQTxqIAdBKGogACgCABATIAdBxABqIAdBKGogACgCCBATIAdBzABqIAdBKGogACgCBBATQQAhBCAHQeAAaiEMIAdB5ABqIQoDQCAHQShqEARBAksgBCAXTnJFBEAgBygCQCAHKAI8QQN0aikCACIdQhCIp0H/AXEhCyAHKAJQIAcoAkxBA3RqKQIAIh5CEIinQf8BcSEJIAcoAkggBygCREEDdGopAgAiH0IgiKchCCAeQiCIISAgHUIgiKchAgJAIB9CEIinQf8BcSIDQQJPBEACQCAGRSADQRlJckUEQCAIIAdBKGogA0EgIAcoAixrIg0gDSADSxsiDRAFIAMgDWsiA3RqIQggB0EoahAEGiADRQ0BIAdBKGogAxAFIAhqIQgMAQsgB0EoaiADEAUgCGohCCAHQShqEAQaCyAHKQJUISEgByAINgJUIAcgITcDWAwBCwJAIANFBEAgAgRAIAcoAlQhCAwDCyAHKAJYIQgMAQsCQAJAIAdBKGpBARAFIAggAkVqaiIDQQNGBEAgBygCVEF/aiIDIANFaiEIDAELIANBAnQgB2ooAlQiCCAIRWohCCADQQFGDQELIAcgBygCWDYCXAsLIAcgBygCVDYCWCAHIAg2AlQLICCnIQMgCQRAIAdBKGogCRAFIANqIQMLIAkgC2pBFE8EQCAHQShqEAQaCyALBEAgB0EoaiALEAUgAmohAgsgB0EoahAEGiAHIAcoAmggAmoiCSADajYCaCAKIAwgCCAJSxsoAgAhDSAHIAdBKGogHUIYiKdB/wFxEAggHadB//8DcWo2AjwgByAHQShqIB5CGIinQf8BcRAIIB6nQf//A3FqNgJMIAdBKGoQBBogB0EoaiAfQhiIp0H/AXEQCCEOIAdB8ABqIARBBHRqIgsgCSANaiAIazYCDCALIAg2AgggCyADNgIEIAsgAjYCACAHIA4gH6dB//8DcWo2AkQgBEEBaiEEDAELCyAEIBdIDQEgEkFgaiEYIAdB4ABqIRogB0HkAGohGyABIQMDQCAHQShqEARBAksgBCAFTnJFBEAgBygCQCAHKAI8QQN0aikCACIdQhCIp0H/AXEhCyAHKAJQIAcoAkxBA3RqKQIAIh5CEIinQf8BcSEIIAcoAkggBygCREEDdGopAgAiH0IgiKchCSAeQiCIISAgHUIgiKchDAJAIB9CEIinQf8BcSICQQJPBEACQCAGRSACQRlJckUEQCAJIAdBKGogAkEgIAcoAixrIgogCiACSxsiChAFIAIgCmsiAnRqIQkgB0EoahAEGiACRQ0BIAdBKGogAhAFIAlqIQkMAQsgB0EoaiACEAUgCWohCSAHQShqEAQaCyAHKQJUISEgByAJNgJUIAcgITcDWAwBCwJAIAJFBEAgDARAIAcoAlQhCQwDCyAHKAJYIQkMAQsCQAJAIAdBKGpBARAFIAkgDEVqaiICQQNGBEAgBygCVEF/aiICIAJFaiEJDAELIAJBAnQgB2ooAlQiCSAJRWohCSACQQFGDQELIAcgBygCWDYCXAsLIAcgBygCVDYCWCAHIAk2AlQLICCnIRQgCARAIAdBKGogCBAFIBRqIRQLIAggC2pBFE8EQCAHQShqEAQaCyALBEAgB0EoaiALEAUgDGohDAsgB0EoahAEGiAHIAcoAmggDGoiGSAUajYCaCAbIBogCSAZSxsoAgAhHCAHIAdBKGogHUIYiKdB/wFxEAggHadB//8DcWo2AjwgByAHQShqIB5CGIinQf8BcRAIIB6nQf//A3FqNgJMIAdBKGoQBBogByAHQShqIB9CGIinQf8BcRAIIB+nQf//A3FqNgJEIAcgB0HwAGogBEEDcUEEdGoiDSkDCCIdNwPIASAHIA0pAwAiHjcDwAECQAJAAkAgBygCvAEiDiAepyICaiIWIBNLDQAgAyAHKALEASIKIAJqIgtqIBhLDQAgEiADayALQSBqTw0BCyAHIAcpA8gBNwMQIAcgBykDwAE3AwggAyASIAdBCGogB0G8AWogEyAPIBUgERAeIQsMAQsgAiADaiEIIAMgDhAHIAJBEU8EQCADQRBqIQIDQCACIA5BEGoiDhAHIAJBEGoiAiAISQ0ACwsgCCAdpyIOayECIAcgFjYCvAEgDiAIIA9rSwRAIA4gCCAVa0sEQEFsIQsMAgsgESACIA9rIgJqIhYgCmogEU0EQCAIIBYgChAPGgwCCyAIIBZBACACaxAPIQggByACIApqIgo2AsQBIAggAmshCCAPIQILIA5BEE8EQCAIIApqIQoDQCAIIAIQByACQRBqIQIgCEEQaiIIIApJDQALDAELAkAgDkEHTQRAIAggAi0AADoAACAIIAItAAE6AAEgCCACLQACOgACIAggAi0AAzoAAyAIQQRqIAIgDkECdCIKQcAeaigCAGoiAhAXIAIgCkHgHmooAgBrIQIgBygCxAEhCgwBCyAIIAIQDAsgCkEJSQ0AIAggCmohCiAIQQhqIgggAkEIaiICa0EPTARAA0AgCCACEAwgAkEIaiECIAhBCGoiCCAKSQ0ADAIACwALA0AgCCACEAcgAkEQaiECIAhBEGoiCCAKSQ0ACwsgCxADBEAgCyEQDAQFIA0gDDYCACANIBkgHGogCWs2AgwgDSAJNgIIIA0gFDYCBCAEQQFqIQQgAyALaiEDDAILAAsLIAQgBUgNASAEIBdrIQtBACEEA0AgCyAFSARAIAcgB0HwAGogC0EDcUEEdGoiAikDCCIdNwPIASAHIAIpAwAiHjcDwAECQAJAAkAgBygCvAEiDCAepyICaiIKIBNLDQAgAyAHKALEASIJIAJqIhBqIBhLDQAgEiADayAQQSBqTw0BCyAHIAcpA8gBNwMgIAcgBykDwAE3AxggAyASIAdBGGogB0G8AWogEyAPIBUgERAeIRAMAQsgAiADaiEIIAMgDBAHIAJBEU8EQCADQRBqIQIDQCACIAxBEGoiDBAHIAJBEGoiAiAISQ0ACwsgCCAdpyIGayECIAcgCjYCvAEgBiAIIA9rSwRAIAYgCCAVa0sEQEFsIRAMAgsgESACIA9rIgJqIgwgCWogEU0EQCAIIAwgCRAPGgwCCyAIIAxBACACaxAPIQggByACIAlqIgk2AsQBIAggAmshCCAPIQILIAZBEE8EQCAIIAlqIQYDQCAIIAIQByACQRBqIQIgCEEQaiIIIAZJDQALDAELAkAgBkEHTQRAIAggAi0AADoAACAIIAItAAE6AAEgCCACLQACOgACIAggAi0AAzoAAyAIQQRqIAIgBkECdCIGQcAeaigCAGoiAhAXIAIgBkHgHmooAgBrIQIgBygCxAEhCQwBCyAIIAIQDAsgCUEJSQ0AIAggCWohBiAIQQhqIgggAkEIaiICa0EPTARAA0AgCCACEAwgAkEIaiECIAhBCGoiCCAGSQ0ADAIACwALA0AgCCACEAcgAkEQaiECIAhBEGoiCCAGSQ0ACwsgEBADDQMgC0EBaiELIAMgEGohAwwBCwsDQCAEQQNHBEAgACAEQQJ0IgJqQazQAWogAiAHaigCVDYCACAEQQFqIQQMAQsLIAcoArwBIQgLQbp/IRAgEyAIayIAIBIgA2tLDQAgAwR/IAMgCCAAEAsgAGoFQQALIAFrIRALIAdB0AFqJAAgEAslACAAQgA3AgAgAEEAOwEIIABBADoACyAAIAE2AgwgACACOgAKC7QFAQN/IwBBMGsiBCQAIABB/wFqIgVBfWohBgJAIAMvAQIEQCAEQRhqIAEgAhAGIgIQAw0BIARBEGogBEEYaiADEBwgBEEIaiAEQRhqIAMQHCAAIQMDQAJAIARBGGoQBCADIAZPckUEQCADIARBEGogBEEYahASOgAAIAMgBEEIaiAEQRhqEBI6AAEgBEEYahAERQ0BIANBAmohAwsgBUF+aiEFAn8DQEG6fyECIAMiASAFSw0FIAEgBEEQaiAEQRhqEBI6AAAgAUEBaiEDIARBGGoQBEEDRgRAQQIhAiAEQQhqDAILIAMgBUsNBSABIARBCGogBEEYahASOgABIAFBAmohA0EDIQIgBEEYahAEQQNHDQALIARBEGoLIQUgAyAFIARBGGoQEjoAACABIAJqIABrIQIMAwsgAyAEQRBqIARBGGoQEjoAAiADIARBCGogBEEYahASOgADIANBBGohAwwAAAsACyAEQRhqIAEgAhAGIgIQAw0AIARBEGogBEEYaiADEBwgBEEIaiAEQRhqIAMQHCAAIQMDQAJAIARBGGoQBCADIAZPckUEQCADIARBEGogBEEYahAROgAAIAMgBEEIaiAEQRhqEBE6AAEgBEEYahAERQ0BIANBAmohAwsgBUF+aiEFAn8DQEG6fyECIAMiASAFSw0EIAEgBEEQaiAEQRhqEBE6AAAgAUEBaiEDIARBGGoQBEEDRgRAQQIhAiAEQQhqDAILIAMgBUsNBCABIARBCGogBEEYahAROgABIAFBAmohA0EDIQIgBEEYahAEQQNHDQALIARBEGoLIQUgAyAFIARBGGoQEToAACABIAJqIABrIQIMAgsgAyAEQRBqIARBGGoQEToAAiADIARBCGogBEEYahAROgADIANBBGohAwwAAAsACyAEQTBqJAAgAgtpAQF/An8CQAJAIAJBB00NACABKAAAQbfIwuF+Rw0AIAAgASgABDYCmOIBQWIgAEEQaiABIAIQPiIDEAMNAhogAEKBgICAEDcDiOEBIAAgASADaiACIANrECoMAQsgACABIAIQKgtBAAsLrQMBBn8jAEGAAWsiAyQAQWIhCAJAIAJBCUkNACAAQZjQAGogAUEIaiIEIAJBeGogAEGY0AAQMyIFEAMiBg0AIANBHzYCfCADIANB/ABqIANB+ABqIAQgBCAFaiAGGyIEIAEgAmoiAiAEaxAVIgUQAw0AIAMoAnwiBkEfSw0AIAMoAngiB0EJTw0AIABBiCBqIAMgBkGAC0GADCAHEBggA0E0NgJ8IAMgA0H8AGogA0H4AGogBCAFaiIEIAIgBGsQFSIFEAMNACADKAJ8IgZBNEsNACADKAJ4IgdBCk8NACAAQZAwaiADIAZBgA1B4A4gBxAYIANBIzYCfCADIANB/ABqIANB+ABqIAQgBWoiBCACIARrEBUiBRADDQAgAygCfCIGQSNLDQAgAygCeCIHQQpPDQAgACADIAZBwBBB0BEgBxAYIAQgBWoiBEEMaiIFIAJLDQAgAiAFayEFQQAhAgNAIAJBA0cEQCAEKAAAIgZBf2ogBU8NAiAAIAJBAnRqQZzQAWogBjYCACACQQFqIQIgBEEEaiEEDAELCyAEIAFrIQgLIANBgAFqJAAgCAtGAQN/IABBCGohAyAAKAIEIQJBACEAA0AgACACdkUEQCABIAMgAEEDdGotAAJBFktqIQEgAEEBaiEADAELCyABQQggAmt0C4YDAQV/Qbh/IQcCQCADRQ0AIAItAAAiBEUEQCABQQA2AgBBAUG4fyADQQFGGw8LAn8gAkEBaiIFIARBGHRBGHUiBkF/Sg0AGiAGQX9GBEAgA0EDSA0CIAUvAABBgP4BaiEEIAJBA2oMAQsgA0ECSA0BIAItAAEgBEEIdHJBgIB+aiEEIAJBAmoLIQUgASAENgIAIAVBAWoiASACIANqIgNLDQBBbCEHIABBEGogACAFLQAAIgVBBnZBI0EJIAEgAyABa0HAEEHQEUHwEiAAKAKM4QEgACgCnOIBIAQQHyIGEAMiCA0AIABBmCBqIABBCGogBUEEdkEDcUEfQQggASABIAZqIAgbIgEgAyABa0GAC0GADEGAFyAAKAKM4QEgACgCnOIBIAQQHyIGEAMiCA0AIABBoDBqIABBBGogBUECdkEDcUE0QQkgASABIAZqIAgbIgEgAyABa0GADUHgDkGQGSAAKAKM4QEgACgCnOIBIAQQHyIAEAMNACAAIAFqIAJrIQcLIAcLrQMBCn8jAEGABGsiCCQAAn9BUiACQf8BSw0AGkFUIANBDEsNABogAkEBaiELIABBBGohCUGAgAQgA0F/anRBEHUhCkEAIQJBASEEQQEgA3QiB0F/aiIMIQUDQCACIAtGRQRAAkAgASACQQF0Ig1qLwEAIgZB//8DRgRAIAkgBUECdGogAjoAAiAFQX9qIQVBASEGDAELIARBACAKIAZBEHRBEHVKGyEECyAIIA1qIAY7AQAgAkEBaiECDAELCyAAIAQ7AQIgACADOwEAIAdBA3YgB0EBdmpBA2ohBkEAIQRBACECA0AgBCALRkUEQCABIARBAXRqLgEAIQpBACEAA0AgACAKTkUEQCAJIAJBAnRqIAQ6AAIDQCACIAZqIAxxIgIgBUsNAAsgAEEBaiEADAELCyAEQQFqIQQMAQsLQX8gAg0AGkEAIQIDfyACIAdGBH9BAAUgCCAJIAJBAnRqIgAtAAJBAXRqIgEgAS8BACIBQQFqOwEAIAAgAyABEBRrIgU6AAMgACABIAVB/wFxdCAHazsBACACQQFqIQIMAQsLCyEFIAhBgARqJAAgBQvjBgEIf0FsIQcCQCACQQNJDQACQAJAAkACQCABLQAAIgNBA3EiCUEBaw4DAwEAAgsgACgCiOEBDQBBYg8LIAJBBUkNAkEDIQYgASgAACEFAn8CQAJAIANBAnZBA3EiCEF+aiIEQQFNBEAgBEEBaw0BDAILIAVBDnZB/wdxIQQgBUEEdkH/B3EhAyAIRQwCCyAFQRJ2IQRBBCEGIAVBBHZB//8AcSEDQQAMAQsgBUEEdkH//w9xIgNBgIAISw0DIAEtAARBCnQgBUEWdnIhBEEFIQZBAAshBSAEIAZqIgogAksNAgJAIANBgQZJDQAgACgCnOIBRQ0AQQAhAgNAIAJBg4ABSw0BIAJBQGshAgwAAAsACwJ/IAlBA0YEQCABIAZqIQEgAEHw4gFqIQIgACgCDCEGIAUEQCACIAMgASAEIAYQXwwCCyACIAMgASAEIAYQXQwBCyAAQbjQAWohAiABIAZqIQEgAEHw4gFqIQYgAEGo0ABqIQggBQRAIAggBiADIAEgBCACEF4MAQsgCCAGIAMgASAEIAIQXAsQAw0CIAAgAzYCgOIBIABBATYCiOEBIAAgAEHw4gFqNgLw4QEgCUECRgRAIAAgAEGo0ABqNgIMCyAAIANqIgBBiOMBakIANwAAIABBgOMBakIANwAAIABB+OIBakIANwAAIABB8OIBakIANwAAIAoPCwJ/AkACQAJAIANBAnZBA3FBf2oiBEECSw0AIARBAWsOAgACAQtBASEEIANBA3YMAgtBAiEEIAEvAABBBHYMAQtBAyEEIAEQIUEEdgsiAyAEaiIFQSBqIAJLBEAgBSACSw0CIABB8OIBaiABIARqIAMQCyEBIAAgAzYCgOIBIAAgATYC8OEBIAEgA2oiAEIANwAYIABCADcAECAAQgA3AAggAEIANwAAIAUPCyAAIAM2AoDiASAAIAEgBGo2AvDhASAFDwsCfwJAAkACQCADQQJ2QQNxQX9qIgRBAksNACAEQQFrDgIAAgELQQEhByADQQN2DAILQQIhByABLwAAQQR2DAELIAJBBEkgARAhIgJBj4CAAUtyDQFBAyEHIAJBBHYLIQIgAEHw4gFqIAEgB2otAAAgAkEgahAQIQEgACACNgKA4gEgACABNgLw4QEgB0EBaiEHCyAHC0sAIABC+erQ0OfJoeThADcDICAAQgA3AxggAELP1tO+0ser2UI3AxAgAELW64Lu6v2J9eAANwMIIABCADcDACAAQShqQQBBKBAQGgviAgICfwV+IABBKGoiASAAKAJIaiECAn4gACkDACIDQiBaBEAgACkDECIEQgeJIAApAwgiBUIBiXwgACkDGCIGQgyJfCAAKQMgIgdCEol8IAUQGSAEEBkgBhAZIAcQGQwBCyAAKQMYQsXP2bLx5brqJ3wLIAN8IQMDQCABQQhqIgAgAk0EQEIAIAEpAAAQCSADhUIbiUKHla+vmLbem55/fkLj3MqV/M7y9YV/fCEDIAAhAQwBCwsCQCABQQRqIgAgAksEQCABIQAMAQsgASgAAK1Ch5Wvr5i23puef34gA4VCF4lCz9bTvtLHq9lCfkL5893xmfaZqxZ8IQMLA0AgACACSQRAIAAxAABCxc/ZsvHluuonfiADhUILiUKHla+vmLbem55/fiEDIABBAWohAAwBCwsgA0IhiCADhULP1tO+0ser2UJ+IgNCHYggA4VC+fPd8Zn2masWfiIDQiCIIAOFC+8CAgJ/BH4gACAAKQMAIAKtfDcDAAJAAkAgACgCSCIDIAJqIgRBH00EQCABRQ0BIAAgA2pBKGogASACECAgACgCSCACaiEEDAELIAEgAmohAgJ/IAMEQCAAQShqIgQgA2ogAUEgIANrECAgACAAKQMIIAQpAAAQCTcDCCAAIAApAxAgACkAMBAJNwMQIAAgACkDGCAAKQA4EAk3AxggACAAKQMgIABBQGspAAAQCTcDICAAKAJIIQMgAEEANgJIIAEgA2tBIGohAQsgAUEgaiACTQsEQCACQWBqIQMgACkDICEFIAApAxghBiAAKQMQIQcgACkDCCEIA0AgCCABKQAAEAkhCCAHIAEpAAgQCSEHIAYgASkAEBAJIQYgBSABKQAYEAkhBSABQSBqIgEgA00NAAsgACAFNwMgIAAgBjcDGCAAIAc3AxAgACAINwMICyABIAJPDQEgAEEoaiABIAIgAWsiBBAgCyAAIAQ2AkgLCy8BAX8gAEUEQEG2f0EAIAMbDwtBun8hBCADIAFNBH8gACACIAMQEBogAwVBun8LCy8BAX8gAEUEQEG2f0EAIAMbDwtBun8hBCADIAFNBH8gACACIAMQCxogAwVBun8LC6gCAQZ/IwBBEGsiByQAIABB2OABaikDAEKAgIAQViEIQbh/IQUCQCAEQf//B0sNACAAIAMgBBBCIgUQAyIGDQAgACgCnOIBIQkgACAHQQxqIAMgAyAFaiAGGyIKIARBACAFIAYbayIGEEAiAxADBEAgAyEFDAELIAcoAgwhBCABRQRAQbp/IQUgBEEASg0BCyAGIANrIQUgAyAKaiEDAkAgCQRAIABBADYCnOIBDAELAkACQAJAIARBBUgNACAAQdjgAWopAwBCgICACFgNAAwBCyAAQQA2ApziAQwBCyAAKAIIED8hBiAAQQA2ApziASAGQRRPDQELIAAgASACIAMgBSAEIAgQOSEFDAELIAAgASACIAMgBSAEIAgQOiEFCyAHQRBqJAAgBQtnACAAQdDgAWogASACIAAoAuzhARAuIgEQAwRAIAEPC0G4fyECAkAgAQ0AIABB7OABaigCACIBBEBBYCECIAAoApjiASABRw0BC0EAIQIgAEHw4AFqKAIARQ0AIABBkOEBahBDCyACCycBAX8QVyIERQRAQUAPCyAEIAAgASACIAMgBBBLEE8hACAEEFYgAAs/AQF/AkACQAJAIAAoAqDiAUEBaiIBQQJLDQAgAUEBaw4CAAECCyAAEDBBAA8LIABBADYCoOIBCyAAKAKU4gELvAMCB38BfiMAQRBrIgkkAEG4fyEGAkAgBCgCACIIQQVBCSAAKALs4QEiBRtJDQAgAygCACIHQQFBBSAFGyAFEC8iBRADBEAgBSEGDAELIAggBUEDakkNACAAIAcgBRBJIgYQAw0AIAEgAmohCiAAQZDhAWohCyAIIAVrIQIgBSAHaiEHIAEhBQNAIAcgAiAJECwiBhADDQEgAkF9aiICIAZJBEBBuH8hBgwCCyAJKAIAIghBAksEQEFsIQYMAgsgB0EDaiEHAn8CQAJAAkAgCEEBaw4CAgABCyAAIAUgCiAFayAHIAYQSAwCCyAFIAogBWsgByAGEEcMAQsgBSAKIAVrIActAAAgCSgCCBBGCyIIEAMEQCAIIQYMAgsgACgC8OABBEAgCyAFIAgQRQsgAiAGayECIAYgB2ohByAFIAhqIQUgCSgCBEUNAAsgACkD0OABIgxCf1IEQEFsIQYgDCAFIAFrrFINAQsgACgC8OABBEBBaiEGIAJBBEkNASALEEQhDCAHKAAAIAynRw0BIAdBBGohByACQXxqIQILIAMgBzYCACAEIAI2AgAgBSABayEGCyAJQRBqJAAgBgsuACAAECsCf0EAQQAQAw0AGiABRSACRXJFBEBBYiAAIAEgAhA9EAMNARoLQQALCzcAIAEEQCAAIAAoAsTgASABKAIEIAEoAghqRzYCnOIBCyAAECtBABADIAFFckUEQCAAIAEQWwsL0QIBB38jAEEQayIGJAAgBiAENgIIIAYgAzYCDCAFBEAgBSgCBCEKIAUoAgghCQsgASEIAkACQANAIAAoAuzhARAWIQsCQANAIAQgC0kNASADKAAAQXBxQdDUtMIBRgRAIAMgBBAiIgcQAw0EIAQgB2shBCADIAdqIQMMAQsLIAYgAzYCDCAGIAQ2AggCQCAFBEAgACAFEE5BACEHQQAQA0UNAQwFCyAAIAogCRBNIgcQAw0ECyAAIAgQUCAMQQFHQQAgACAIIAIgBkEMaiAGQQhqEEwiByIDa0EAIAMQAxtBCkdyRQRAQbh/IQcMBAsgBxADDQMgAiAHayECIAcgCGohCEEBIQwgBigCDCEDIAYoAgghBAwBCwsgBiADNgIMIAYgBDYCCEG4fyEHIAQNASAIIAFrIQcMAQsgBiADNgIMIAYgBDYCCAsgBkEQaiQAIAcLRgECfyABIAAoArjgASICRwRAIAAgAjYCxOABIAAgATYCuOABIAAoArzgASEDIAAgATYCvOABIAAgASADIAJrajYCwOABCwutAgIEfwF+IwBBQGoiBCQAAkACQCACQQhJDQAgASgAAEFwcUHQ1LTCAUcNACABIAIQIiEBIABCADcDCCAAQQA2AgQgACABNgIADAELIARBGGogASACEC0iAxADBEAgACADEBoMAQsgAwRAIABBuH8QGgwBCyACIAQoAjAiA2shAiABIANqIQMDQAJAIAAgAyACIARBCGoQLCIFEAMEfyAFBSACIAVBA2oiBU8NAUG4fwsQGgwCCyAGQQFqIQYgAiAFayECIAMgBWohAyAEKAIMRQ0ACyAEKAI4BEAgAkEDTQRAIABBuH8QGgwCCyADQQRqIQMLIAQoAighAiAEKQMYIQcgAEEANgIEIAAgAyABazYCACAAIAIgBmytIAcgB0J/URs3AwgLIARBQGskAAslAQF/IwBBEGsiAiQAIAIgACABEFEgAigCACEAIAJBEGokACAAC30BBH8jAEGQBGsiBCQAIARB/wE2AggCQCAEQRBqIARBCGogBEEMaiABIAIQFSIGEAMEQCAGIQUMAQtBVCEFIAQoAgwiB0EGSw0AIAMgBEEQaiAEKAIIIAcQQSIFEAMNACAAIAEgBmogAiAGayADEDwhBQsgBEGQBGokACAFC4cBAgJ/An5BABAWIQMCQANAIAEgA08EQAJAIAAoAABBcHFB0NS0wgFGBEAgACABECIiAhADRQ0BQn4PCyAAIAEQVSIEQn1WDQMgBCAFfCIFIARUIQJCfiEEIAINAyAAIAEQUiICEAMNAwsgASACayEBIAAgAmohAAwBCwtCfiAFIAEbIQQLIAQLPwIBfwF+IwBBMGsiAiQAAn5CfiACQQhqIAAgARAtDQAaQgAgAigCHEEBRg0AGiACKQMICyEDIAJBMGokACADC40BAQJ/IwBBMGsiASQAAkAgAEUNACAAKAKI4gENACABIABB/OEBaigCADYCKCABIAApAvThATcDICAAEDAgACgCqOIBIQIgASABKAIoNgIYIAEgASkDIDcDECACIAFBEGoQGyAAQQA2AqjiASABIAEoAig2AgggASABKQMgNwMAIAAgARAbCyABQTBqJAALKgECfyMAQRBrIgAkACAAQQA2AgggAEIANwMAIAAQWCEBIABBEGokACABC4cBAQN/IwBBEGsiAiQAAkAgACgCAEUgACgCBEVzDQAgAiAAKAIINgIIIAIgACkCADcDAAJ/IAIoAgAiAQRAIAIoAghBqOMJIAERBQAMAQtBqOMJECgLIgFFDQAgASAAKQIANwL04QEgAUH84QFqIAAoAgg2AgAgARBZIAEhAwsgAkEQaiQAIAMLywEBAn8jAEEgayIBJAAgAEGBgIDAADYCtOIBIABBADYCiOIBIABBADYC7OEBIABCADcDkOIBIABBADYCpOMJIABBADYC3OIBIABCADcCzOIBIABBADYCvOIBIABBADYCxOABIABCADcCnOIBIABBpOIBakIANwIAIABBrOIBakEANgIAIAFCADcCECABQgA3AhggASABKQMYNwMIIAEgASkDEDcDACABKAIIQQh2QQFxIQIgAEEANgLg4gEgACACNgKM4gEgAUEgaiQAC3YBA38jAEEwayIBJAAgAARAIAEgAEHE0AFqIgIoAgA2AiggASAAKQK80AE3AyAgACgCACEDIAEgAigCADYCGCABIAApArzQATcDECADIAFBEGoQGyABIAEoAig2AgggASABKQMgNwMAIAAgARAbCyABQTBqJAALzAEBAX8gACABKAK00AE2ApjiASAAIAEoAgQiAjYCwOABIAAgAjYCvOABIAAgAiABKAIIaiICNgK44AEgACACNgLE4AEgASgCuNABBEAgAEKBgICAEDcDiOEBIAAgAUGk0ABqNgIMIAAgAUGUIGo2AgggACABQZwwajYCBCAAIAFBDGo2AgAgAEGs0AFqIAFBqNABaigCADYCACAAQbDQAWogAUGs0AFqKAIANgIAIABBtNABaiABQbDQAWooAgA2AgAPCyAAQgA3A4jhAQs7ACACRQRAQbp/DwsgBEUEQEFsDwsgAiAEEGAEQCAAIAEgAiADIAQgBRBhDwsgACABIAIgAyAEIAUQZQtGAQF/IwBBEGsiBSQAIAVBCGogBBAOAn8gBS0ACQRAIAAgASACIAMgBBAyDAELIAAgASACIAMgBBA0CyEAIAVBEGokACAACzQAIAAgAyAEIAUQNiIFEAMEQCAFDwsgBSAESQR/IAEgAiADIAVqIAQgBWsgABA1BUG4fwsLRgEBfyMAQRBrIgUkACAFQQhqIAQQDgJ/IAUtAAkEQCAAIAEgAiADIAQQYgwBCyAAIAEgAiADIAQQNQshACAFQRBqJAAgAAtZAQF/QQ8hAiABIABJBEAgAUEEdCAAbiECCyAAQQh2IgEgAkEYbCIAQYwIaigCAGwgAEGICGooAgBqIgJBA3YgAmogAEGACGooAgAgAEGECGooAgAgAWxqSQs3ACAAIAMgBCAFQYAQEDMiBRADBEAgBQ8LIAUgBEkEfyABIAIgAyAFaiAEIAVrIAAQMgVBuH8LC78DAQN/IwBBIGsiBSQAIAVBCGogAiADEAYiAhADRQRAIAAgAWoiB0F9aiEGIAUgBBAOIARBBGohAiAFLQACIQMDQEEAIAAgBkkgBUEIahAEGwRAIAAgAiAFQQhqIAMQAkECdGoiBC8BADsAACAFQQhqIAQtAAIQASAAIAQtAANqIgQgAiAFQQhqIAMQAkECdGoiAC8BADsAACAFQQhqIAAtAAIQASAEIAAtAANqIQAMAQUgB0F+aiEEA0AgBUEIahAEIAAgBEtyRQRAIAAgAiAFQQhqIAMQAkECdGoiBi8BADsAACAFQQhqIAYtAAIQASAAIAYtAANqIQAMAQsLA0AgACAES0UEQCAAIAIgBUEIaiADEAJBAnRqIgYvAQA7AAAgBUEIaiAGLQACEAEgACAGLQADaiEADAELCwJAIAAgB08NACAAIAIgBUEIaiADEAIiA0ECdGoiAC0AADoAACAALQADQQFGBEAgBUEIaiAALQACEAEMAQsgBSgCDEEfSw0AIAVBCGogAiADQQJ0ai0AAhABIAUoAgxBIUkNACAFQSA2AgwLIAFBbCAFQQhqEAobIQILCwsgBUEgaiQAIAILkgIBBH8jAEFAaiIJJAAgCSADQTQQCyEDAkAgBEECSA0AIAMgBEECdGooAgAhCSADQTxqIAgQIyADQQE6AD8gAyACOgA+QQAhBCADKAI8IQoDQCAEIAlGDQEgACAEQQJ0aiAKNgEAIARBAWohBAwAAAsAC0EAIQkDQCAGIAlGRQRAIAMgBSAJQQF0aiIKLQABIgtBAnRqIgwoAgAhBCADQTxqIAotAABBCHQgCGpB//8DcRAjIANBAjoAPyADIAcgC2siCiACajoAPiAEQQEgASAKa3RqIQogAygCPCELA0AgACAEQQJ0aiALNgEAIARBAWoiBCAKSQ0ACyAMIAo2AgAgCUEBaiEJDAELCyADQUBrJAALowIBCX8jAEHQAGsiCSQAIAlBEGogBUE0EAsaIAcgBmshDyAHIAFrIRADQAJAIAMgCkcEQEEBIAEgByACIApBAXRqIgYtAAEiDGsiCGsiC3QhDSAGLQAAIQ4gCUEQaiAMQQJ0aiIMKAIAIQYgCyAPTwRAIAAgBkECdGogCyAIIAUgCEE0bGogCCAQaiIIQQEgCEEBShsiCCACIAQgCEECdGooAgAiCEEBdGogAyAIayAHIA4QYyAGIA1qIQgMAgsgCUEMaiAOECMgCUEBOgAPIAkgCDoADiAGIA1qIQggCSgCDCELA0AgBiAITw0CIAAgBkECdGogCzYBACAGQQFqIQYMAAALAAsgCUHQAGokAA8LIAwgCDYCACAKQQFqIQoMAAALAAs0ACAAIAMgBCAFEDYiBRADBEAgBQ8LIAUgBEkEfyABIAIgAyAFaiAEIAVrIAAQNAVBuH8LCyMAIAA/AEEQdGtB//8DakEQdkAAQX9GBEBBAA8LQQAQAEEBCzsBAX8gAgRAA0AgACABIAJBgCAgAkGAIEkbIgMQCyEAIAFBgCBqIQEgAEGAIGohACACIANrIgINAAsLCwYAIAAQAwsLqBUJAEGICAsNAQAAAAEAAAACAAAAAgBBoAgLswYBAAAAAQAAAAIAAAACAAAAJgAAAIIAAAAhBQAASgAAAGcIAAAmAAAAwAEAAIAAAABJBQAASgAAAL4IAAApAAAALAIAAIAAAABJBQAASgAAAL4IAAAvAAAAygIAAIAAAACKBQAASgAAAIQJAAA1AAAAcwMAAIAAAACdBQAASgAAAKAJAAA9AAAAgQMAAIAAAADrBQAASwAAAD4KAABEAAAAngMAAIAAAABNBgAASwAAAKoKAABLAAAAswMAAIAAAADBBgAATQAAAB8NAABNAAAAUwQAAIAAAAAjCAAAUQAAAKYPAABUAAAAmQQAAIAAAABLCQAAVwAAALESAABYAAAA2gQAAIAAAABvCQAAXQAAACMUAABUAAAARQUAAIAAAABUCgAAagAAAIwUAABqAAAArwUAAIAAAAB2CQAAfAAAAE4QAAB8AAAA0gIAAIAAAABjBwAAkQAAAJAHAACSAAAAAAAAAAEAAAABAAAABQAAAA0AAAAdAAAAPQAAAH0AAAD9AAAA/QEAAP0DAAD9BwAA/Q8AAP0fAAD9PwAA/X8AAP3/AAD9/wEA/f8DAP3/BwD9/w8A/f8fAP3/PwD9/38A/f//AP3//wH9//8D/f//B/3//w/9//8f/f//P/3//38AAAAAAQAAAAIAAAADAAAABAAAAAUAAAAGAAAABwAAAAgAAAAJAAAACgAAAAsAAAAMAAAADQAAAA4AAAAPAAAAEAAAABEAAAASAAAAEwAAABQAAAAVAAAAFgAAABcAAAAYAAAAGQAAABoAAAAbAAAAHAAAAB0AAAAeAAAAHwAAAAMAAAAEAAAABQAAAAYAAAAHAAAACAAAAAkAAAAKAAAACwAAAAwAAAANAAAADgAAAA8AAAAQAAAAEQAAABIAAAATAAAAFAAAABUAAAAWAAAAFwAAABgAAAAZAAAAGgAAABsAAAAcAAAAHQAAAB4AAAAfAAAAIAAAACEAAAAiAAAAIwAAACUAAAAnAAAAKQAAACsAAAAvAAAAMwAAADsAAABDAAAAUwAAAGMAAACDAAAAAwEAAAMCAAADBAAAAwgAAAMQAAADIAAAA0AAAAOAAAADAAEAQeAPC1EBAAAAAQAAAAEAAAABAAAAAgAAAAIAAAADAAAAAwAAAAQAAAAEAAAABQAAAAcAAAAIAAAACQAAAAoAAAALAAAADAAAAA0AAAAOAAAADwAAABAAQcQQC4sBAQAAAAIAAAADAAAABAAAAAUAAAAGAAAABwAAAAgAAAAJAAAACgAAAAsAAAAMAAAADQAAAA4AAAAPAAAAEAAAABIAAAAUAAAAFgAAABgAAAAcAAAAIAAAACgAAAAwAAAAQAAAAIAAAAAAAQAAAAIAAAAEAAAACAAAABAAAAAgAAAAQAAAAIAAAAAAAQBBkBIL5gQBAAAAAQAAAAEAAAABAAAAAgAAAAIAAAADAAAAAwAAAAQAAAAGAAAABwAAAAgAAAAJAAAACgAAAAsAAAAMAAAADQAAAA4AAAAPAAAAEAAAAAEAAAAEAAAACAAAAAAAAAABAAEBBgAAAAAAAAQAAAAAEAAABAAAAAAgAAAFAQAAAAAAAAUDAAAAAAAABQQAAAAAAAAFBgAAAAAAAAUHAAAAAAAABQkAAAAAAAAFCgAAAAAAAAUMAAAAAAAABg4AAAAAAAEFEAAAAAAAAQUUAAAAAAABBRYAAAAAAAIFHAAAAAAAAwUgAAAAAAAEBTAAAAAgAAYFQAAAAAAABwWAAAAAAAAIBgABAAAAAAoGAAQAAAAADAYAEAAAIAAABAAAAAAAAAAEAQAAAAAAAAUCAAAAIAAABQQAAAAAAAAFBQAAACAAAAUHAAAAAAAABQgAAAAgAAAFCgAAAAAAAAULAAAAAAAABg0AAAAgAAEFEAAAAAAAAQUSAAAAIAABBRYAAAAAAAIFGAAAACAAAwUgAAAAAAADBSgAAAAAAAYEQAAAABAABgRAAAAAIAAHBYAAAAAAAAkGAAIAAAAACwYACAAAMAAABAAAAAAQAAAEAQAAACAAAAUCAAAAIAAABQMAAAAgAAAFBQAAACAAAAUGAAAAIAAABQgAAAAgAAAFCQAAACAAAAULAAAAIAAABQwAAAAAAAAGDwAAACAAAQUSAAAAIAABBRQAAAAgAAIFGAAAACAAAgUcAAAAIAADBSgAAAAgAAQFMAAAAAAAEAYAAAEAAAAPBgCAAAAAAA4GAEAAAAAADQYAIABBgBcLhwIBAAEBBQAAAAAAAAUAAAAAAAAGBD0AAAAAAAkF/QEAAAAADwX9fwAAAAAVBf3/HwAAAAMFBQAAAAAABwR9AAAAAAAMBf0PAAAAABIF/f8DAAAAFwX9/38AAAAFBR0AAAAAAAgE/QAAAAAADgX9PwAAAAAUBf3/DwAAAAIFAQAAABAABwR9AAAAAAALBf0HAAAAABEF/f8BAAAAFgX9/z8AAAAEBQ0AAAAQAAgE/QAAAAAADQX9HwAAAAATBf3/BwAAAAEFAQAAABAABgQ9AAAAAAAKBf0DAAAAABAF/f8AAAAAHAX9//8PAAAbBf3//wcAABoF/f//AwAAGQX9//8BAAAYBf3//wBBkBkLhgQBAAEBBgAAAAAAAAYDAAAAAAAABAQAAAAgAAAFBQAAAAAAAAUGAAAAAAAABQgAAAAAAAAFCQAAAAAAAAULAAAAAAAABg0AAAAAAAAGEAAAAAAAAAYTAAAAAAAABhYAAAAAAAAGGQAAAAAAAAYcAAAAAAAABh8AAAAAAAAGIgAAAAAAAQYlAAAAAAABBikAAAAAAAIGLwAAAAAAAwY7AAAAAAAEBlMAAAAAAAcGgwAAAAAACQYDAgAAEAAABAQAAAAAAAAEBQAAACAAAAUGAAAAAAAABQcAAAAgAAAFCQAAAAAAAAUKAAAAAAAABgwAAAAAAAAGDwAAAAAAAAYSAAAAAAAABhUAAAAAAAAGGAAAAAAAAAYbAAAAAAAABh4AAAAAAAAGIQAAAAAAAQYjAAAAAAABBicAAAAAAAIGKwAAAAAAAwYzAAAAAAAEBkMAAAAAAAUGYwAAAAAACAYDAQAAIAAABAQAAAAwAAAEBAAAABAAAAQFAAAAIAAABQcAAAAgAAAFCAAAACAAAAUKAAAAIAAABQsAAAAAAAAGDgAAAAAAAAYRAAAAAAAABhQAAAAAAAAGFwAAAAAAAAYaAAAAAAAABh0AAAAAAAAGIAAAAAAAEAYDAAEAAAAPBgOAAAAAAA4GA0AAAAAADQYDIAAAAAAMBgMQAAAAAAsGAwgAAAAACgYDBABBpB0L2QEBAAAAAwAAAAcAAAAPAAAAHwAAAD8AAAB/AAAA/wAAAP8BAAD/AwAA/wcAAP8PAAD/HwAA/z8AAP9/AAD//wAA//8BAP//AwD//wcA//8PAP//HwD//z8A//9/AP///wD///8B////A////wf///8P////H////z////9/AAAAAAEAAAACAAAABAAAAAAAAAACAAAABAAAAAgAAAAAAAAAAQAAAAIAAAABAAAABAAAAAQAAAAEAAAABAAAAAgAAAAIAAAACAAAAAcAAAAIAAAACQAAAAoAAAALAEGgIAsDwBBQ";
// node_modules/three/examples/jsm/math/ColorSpaces.js
/**
* Display-P3 color space.
*
* @type {string}
* @constant
*/
var DisplayP3ColorSpace = "display-p3";
/**
* Display-P3-Linear color space.
*
* @type {string}
* @constant
*/
var LinearDisplayP3ColorSpace = "display-p3-linear";
({ ...ColorManagement.spaces[SRGBColorSpace] });
/**
* An object holding the color space implementation.
*
* @typedef {Object} module:ColorSpaces~ColorSpaceImpl
* @property {Array<number>} primaries - The primaries.
* @property {Array<number>} whitePoint - The white point.
* @property {Matrix3} toXYZ - A color space conversion matrix, converting to CIE XYZ.
* @property {Matrix3} fromXYZ - A color space conversion matrix, converting from CIE XYZ.
* @property {Array<number>} luminanceCoefficients - The luminance coefficients.
* @property {{unpackColorSpace:string}} [workingColorSpaceConfig] - The working color space config.
* @property {{drawingBufferColorSpace:string}} [outputColorSpaceConfig] - The drawing buffer color space config.
**/
// node_modules/three/examples/jsm/loaders/KTX2Loader.js
var WASM_BIN_URL = new URL("/assets/basis_transcoder-VXdx5NbI.wasm", "" + import.meta.url).toString();
var WASM_JS_URL = new URL("/assets/basis_transcoder-o4Hde_L7.js", "" + import.meta.url).toString();
var _taskCache = /* @__PURE__ */ new WeakMap();
var _activeLoaders = 0;
var _zstd;
/**
* A loader for KTX 2.0 GPU Texture containers.
*
* KTX 2.0 is a container format for various GPU texture formats. The loader supports Basis Universal GPU textures,
* which can be quickly transcoded to a wide variety of GPU texture compression formats. While KTX 2.0 also allows
* other hardware-specific formats, this loader does not yet parse them.
*
* This loader parses the KTX 2.0 container and transcodes to a supported GPU compressed texture format.
* The required WASM transcoder and JS wrapper are available from the `examples/jsm/libs/basis` directory.
*
* This loader relies on Web Assembly which is not supported in older browsers.
*
* References:
* - [KTX specification](http://github.khronos.org/KTX-Specification/)
* - [DFD](https://www.khronos.org/registry/DataFormat/specs/1.3/dataformat.1.3.html#basicdescriptor)
* - [BasisU HDR](https://github.com/BinomialLLC/basis_universal/wiki/UASTC-HDR-Texture-Specification-v1.0)
*
* ```js
* const loader = new KTX2Loader();
* loader.setTranscoderPath( 'examples/jsm/libs/basis/' );
* loader.detectSupport( renderer );
* const texture = loader.loadAsync( 'diffuse.ktx2' );
* ```
*
* @augments Loader
* @three_import import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
*/
var KTX2Loader = class KTX2Loader extends Loader {
	/**
	* Constructs a new KTX2 loader.
	*
	* @param {LoadingManager} [manager] - The loading manager.
	*/
	constructor(manager) {
		super(manager);
		this.transcoderPath = "";
		this.transcoderBinary = null;
		this.transcoderPending = null;
		this.workerPool = new WorkerPool();
		this.workerSourceURL = "";
		this.workerConfig = null;
		if (typeof MSC_TRANSCODER !== "undefined") console.warn("THREE.KTX2Loader: Please update to latest \"basis_transcoder\". \"msc_basis_transcoder\" is no longer supported in three.js r125+.");
	}
	/**
	* Sets the transcoder path to optionally set the decoder load path from a CDN.
	*
	* By default The WASM transcoder and JS wrapper are loaded from the `examples/jsm/libs/basis` directory.
	*
	* @param {string} path - The transcoder path to set.
	* @return {KTX2Loader} A reference to this loader.
	*/
	setTranscoderPath(path) {
		this.transcoderPath = path;
		return this;
	}
	/**
	* Sets the maximum number of Web Workers to be allocated by this instance.
	*
	* @param {number} workerLimit - The worker limit.
	* @return {KTX2Loader} A reference to this loader.
	*/
	setWorkerLimit(workerLimit) {
		this.workerPool.setWorkerLimit(workerLimit);
		return this;
	}
	/**
	* Async version of {@link KTX2Loader#detectSupport}.
	*
	* @async
	* @deprecated
	* @param {WebGPURenderer} renderer - The renderer.
	* @return {Promise} A Promise that resolves when the support has been detected.
	*/
	async detectSupportAsync(renderer) {
		console.warn("KTX2Loader: \"detectSupportAsync()\" has been deprecated. Use \"detectSupport()\" and \"await renderer.init();\" when creating the renderer.");
		await renderer.init();
		return this.detectSupport(renderer);
	}
	/**
	* Detects hardware support for available compressed texture formats, to determine
	* the output format for the transcoder. Must be called before loading a texture.
	*
	* @param {WebGPURenderer|WebGLRenderer} renderer - The renderer.
	* @return {KTX2Loader} A reference to this loader.
	*/
	detectSupport(renderer) {
		if (renderer.isWebGPURenderer === true) this.workerConfig = {
			astcSupported: renderer.hasFeature("texture-compression-astc"),
			astcHDRSupported: false,
			etc1Supported: renderer.hasFeature("texture-compression-etc1"),
			etc2Supported: renderer.hasFeature("texture-compression-etc2"),
			dxtSupported: renderer.hasFeature("texture-compression-s3tc"),
			bptcSupported: renderer.hasFeature("texture-compression-bc"),
			pvrtcSupported: renderer.hasFeature("texture-compression-pvrtc")
		};
		else {
			this.workerConfig = {
				astcSupported: renderer.extensions.has("WEBGL_compressed_texture_astc"),
				astcHDRSupported: renderer.extensions.has("WEBGL_compressed_texture_astc") && renderer.extensions.get("WEBGL_compressed_texture_astc").getSupportedProfiles().includes("hdr"),
				etc1Supported: renderer.extensions.has("WEBGL_compressed_texture_etc1"),
				etc2Supported: renderer.extensions.has("WEBGL_compressed_texture_etc"),
				dxtSupported: renderer.extensions.has("WEBGL_compressed_texture_s3tc"),
				bptcSupported: renderer.extensions.has("EXT_texture_compression_bptc"),
				pvrtcSupported: renderer.extensions.has("WEBGL_compressed_texture_pvrtc") || renderer.extensions.has("WEBKIT_WEBGL_compressed_texture_pvrtc")
			};
			if (typeof navigator !== "undefined" && typeof navigator.platform !== "undefined" && typeof navigator.userAgent !== "undefined" && navigator.platform.indexOf("Linux") >= 0 && navigator.userAgent.indexOf("Android") < 0 && this.workerConfig.astcSupported && this.workerConfig.etc2Supported && this.workerConfig.bptcSupported && this.workerConfig.dxtSupported) {
				this.workerConfig.astcSupported = false;
				this.workerConfig.etc1Supported = false;
				this.workerConfig.etc2Supported = false;
			}
		}
		return this;
	}
	init() {
		if (!this.transcoderPending) {
			const jsLoader = new FileLoader(this.manager);
			jsLoader.setWithCredentials(this.withCredentials);
			const binaryLoader = new FileLoader(this.manager);
			binaryLoader.setWithCredentials(this.withCredentials);
			binaryLoader.setResponseType("arraybuffer");
			let jsContent, binaryContent;
			if (this.transcoderPath === "") {
				jsContent = jsLoader.loadAsync(WASM_JS_URL);
				binaryContent = binaryLoader.loadAsync(WASM_BIN_URL);
			} else {
				jsLoader.setPath(this.transcoderPath);
				jsContent = jsLoader.loadAsync("basis_transcoder.js");
				binaryLoader.setPath(this.transcoderPath);
				binaryContent = binaryLoader.loadAsync("basis_transcoder.wasm");
			}
			this.transcoderPending = Promise.all([jsContent, binaryContent]).then(([jsContent, binaryContent]) => {
				const fn = KTX2Loader.BasisWorker.toString();
				const body = [
					"/* constants */",
					"let _EngineFormat = " + JSON.stringify(KTX2Loader.EngineFormat),
					"let _EngineType = " + JSON.stringify(KTX2Loader.EngineType),
					"let _TranscoderFormat = " + JSON.stringify(KTX2Loader.TranscoderFormat),
					"let _BasisFormat = " + JSON.stringify(KTX2Loader.BasisFormat),
					"/* basis_transcoder.js */",
					jsContent,
					"/* worker */",
					fn.substring(fn.indexOf("{") + 1, fn.lastIndexOf("}"))
				].join("\n");
				this.workerSourceURL = URL.createObjectURL(new Blob([body]));
				this.transcoderBinary = binaryContent;
				this.workerPool.setWorkerCreator(() => {
					const worker = new Worker(this.workerSourceURL);
					const transcoderBinary = this.transcoderBinary.slice(0);
					worker.postMessage({
						type: "init",
						config: this.workerConfig,
						transcoderBinary
					}, [transcoderBinary]);
					return worker;
				});
			});
			if (_activeLoaders > 0) console.warn("THREE.KTX2Loader: Multiple active KTX2 loaders may cause performance issues. Use a single KTX2Loader instance, or call .dispose() on old instances.");
			_activeLoaders++;
		}
		return this.transcoderPending;
	}
	/**
	* Starts loading from the given URL and passes the loaded KTX2 texture
	* to the `onLoad()` callback.
	*
	* @param {string} url - The path/URL of the file to be loaded. This can also be a data URI.
	* @param {function(CompressedTexture)} onLoad - Executed when the loading process has been finished.
	* @param {onProgressCallback} onProgress - Executed while the loading is in progress.
	* @param {onErrorCallback} onError - Executed when errors occur.
	*/
	load(url, onLoad, onProgress, onError) {
		if (this.workerConfig === null) throw new Error("THREE.KTX2Loader: Missing initialization with `.detectSupport( renderer )`.");
		const loader = new FileLoader(this.manager);
		loader.setPath(this.path);
		loader.setCrossOrigin(this.crossOrigin);
		loader.setWithCredentials(this.withCredentials);
		loader.setRequestHeader(this.requestHeader);
		loader.setResponseType("arraybuffer");
		loader.load(url, (buffer) => {
			this.parse(buffer, onLoad, onError);
		}, onProgress, onError);
	}
	/**
	* Parses the given KTX2 data.
	*
	* @param {ArrayBuffer} buffer - The raw KTX2 data as an array buffer.
	* @param {function(CompressedTexture)} onLoad - Executed when the loading/parsing process has been finished.
	* @param {onErrorCallback} onError - Executed when errors occur.
	* @returns {Promise} A Promise that resolves when the parsing has been finished.
	*/
	parse(buffer, onLoad, onError) {
		if (this.workerConfig === null) throw new Error("THREE.KTX2Loader: Missing initialization with `.detectSupport( renderer )`.");
		if (_taskCache.has(buffer)) return _taskCache.get(buffer).promise.then(onLoad).catch(onError);
		this._createTexture(buffer).then((texture) => onLoad ? onLoad(texture) : null).catch(onError);
	}
	_createTextureFrom(transcodeResult, container) {
		const { type: messageType, error, data: { faces, width, height, format, type, dfdFlags } } = transcodeResult;
		if (messageType === "error") return Promise.reject(error);
		let texture;
		if (container.faceCount === 6) texture = new CompressedCubeTexture(faces, format, type);
		else {
			const mipmaps = faces[0].mipmaps;
			texture = container.layerCount > 1 ? new CompressedArrayTexture(mipmaps, width, height, container.layerCount, format, type) : new CompressedTexture(mipmaps, width, height, format, type);
		}
		texture.minFilter = faces[0].mipmaps.length === 1 ? LinearFilter : LinearMipmapLinearFilter;
		texture.magFilter = LinearFilter;
		texture.generateMipmaps = false;
		texture.needsUpdate = true;
		texture.colorSpace = parseColorSpace(container);
		texture.premultiplyAlpha = !!(dfdFlags & 1);
		return texture;
	}
	/**
	* @private
	* @param {ArrayBuffer} buffer
	* @param {?Object} config
	* @return {Promise<CompressedTexture|CompressedArrayTexture|DataTexture|Data3DTexture>}
	*/
	async _createTexture(buffer, config = {}) {
		const container = Mi(new Uint8Array(buffer));
		const isBasisHDR = container.vkFormat === 1000066e3 && container.dataFormatDescriptor[0].colorModel === 167;
		if (!(container.vkFormat === 0 || isBasisHDR && !this.workerConfig.astcHDRSupported)) return createRawTexture(container);
		const taskConfig = config;
		const texturePending = this.init().then(() => {
			return this.workerPool.postMessage({
				type: "transcode",
				buffer,
				taskConfig
			}, [buffer]);
		}).then((e) => this._createTextureFrom(e.data, container));
		_taskCache.set(buffer, { promise: texturePending });
		return texturePending;
	}
	/**
	* Frees internal resources. This method should be called
	* when the loader is no longer required.
	*/
	dispose() {
		this.workerPool.dispose();
		if (this.workerSourceURL) URL.revokeObjectURL(this.workerSourceURL);
		_activeLoaders--;
	}
};
KTX2Loader.BasisFormat = {
	ETC1S: 0,
	UASTC: 1,
	UASTC_HDR: 2
};
KTX2Loader.TranscoderFormat = {
	ETC1: 0,
	ETC2: 1,
	BC1: 2,
	BC3: 3,
	BC4: 4,
	BC5: 5,
	BC7_M6_OPAQUE_ONLY: 6,
	BC7_M5: 7,
	PVRTC1_4_RGB: 8,
	PVRTC1_4_RGBA: 9,
	ASTC_4x4: 10,
	ATC_RGB: 11,
	ATC_RGBA_INTERPOLATED_ALPHA: 12,
	RGBA32: 13,
	RGB565: 14,
	BGR565: 15,
	RGBA4444: 16,
	BC6H: 22,
	RGB_HALF: 24,
	RGBA_HALF: 25
};
KTX2Loader.EngineFormat = {
	RGBAFormat,
	RGBA_ASTC_4x4_Format,
	RGB_BPTC_UNSIGNED_Format,
	RGBA_BPTC_Format,
	RGBA_ETC2_EAC_Format,
	RGBA_PVRTC_4BPPV1_Format,
	RGBA_S3TC_DXT5_Format,
	RGB_ETC1_Format,
	RGB_ETC2_Format,
	RGB_PVRTC_4BPPV1_Format,
	RGBA_S3TC_DXT1_Format
};
KTX2Loader.EngineType = {
	UnsignedByteType,
	HalfFloatType,
	FloatType
};
KTX2Loader.BasisWorker = function() {
	let config;
	let transcoderPending;
	let BasisModule;
	const EngineFormat = _EngineFormat;
	const EngineType = _EngineType;
	const TranscoderFormat = _TranscoderFormat;
	const BasisFormat = _BasisFormat;
	self.addEventListener("message", function(e) {
		const message = e.data;
		switch (message.type) {
			case "init":
				config = message.config;
				init(message.transcoderBinary);
				break;
			case "transcode": transcoderPending.then(() => {
				try {
					const { faces, buffers, width, height, hasAlpha, format, type, dfdFlags } = transcode(message.buffer);
					self.postMessage({
						type: "transcode",
						id: message.id,
						data: {
							faces,
							width,
							height,
							hasAlpha,
							format,
							type,
							dfdFlags
						}
					}, buffers);
				} catch (error) {
					console.error(error);
					self.postMessage({
						type: "error",
						id: message.id,
						error: error.message
					});
				}
			});
		}
	});
	function init(wasmBinary) {
		transcoderPending = new Promise((resolve) => {
			BasisModule = {
				wasmBinary,
				onRuntimeInitialized: resolve
			};
			BASIS(BasisModule);
		}).then(() => {
			BasisModule.initializeBasis();
			if (BasisModule.KTX2File === void 0) console.warn("THREE.KTX2Loader: Please update Basis Universal transcoder.");
		});
	}
	function transcode(buffer) {
		const ktx2File = new BasisModule.KTX2File(new Uint8Array(buffer));
		function cleanup() {
			ktx2File.close();
			ktx2File.delete();
		}
		if (!ktx2File.isValid()) {
			cleanup();
			throw new Error("THREE.KTX2Loader:	Invalid or unsupported .ktx2 file");
		}
		let basisFormat;
		if (ktx2File.isUASTC()) basisFormat = BasisFormat.UASTC;
		else if (ktx2File.isETC1S()) basisFormat = BasisFormat.ETC1S;
		else if (ktx2File.isHDR()) basisFormat = BasisFormat.UASTC_HDR;
		else throw new Error("THREE.KTX2Loader: Unknown Basis encoding");
		const width = ktx2File.getWidth();
		const height = ktx2File.getHeight();
		const layerCount = ktx2File.getLayers() || 1;
		const levelCount = ktx2File.getLevels();
		const faceCount = ktx2File.getFaces();
		const hasAlpha = ktx2File.getHasAlpha();
		const dfdFlags = ktx2File.getDFDFlags();
		const { transcoderFormat, engineFormat, engineType } = getTranscoderFormat(basisFormat, width, height, hasAlpha);
		if (!width || !height || !levelCount) {
			cleanup();
			throw new Error("THREE.KTX2Loader:	Invalid texture");
		}
		if (!ktx2File.startTranscoding()) {
			cleanup();
			throw new Error("THREE.KTX2Loader: .startTranscoding failed");
		}
		const faces = [];
		const buffers = [];
		for (let face = 0; face < faceCount; face++) {
			const mipmaps = [];
			for (let mip = 0; mip < levelCount; mip++) {
				const layerMips = [];
				let mipWidth, mipHeight;
				for (let layer = 0; layer < layerCount; layer++) {
					const levelInfo = ktx2File.getImageLevelInfo(mip, layer, face);
					if (face === 0 && mip === 0 && layer === 0 && (levelInfo.origWidth % 4 !== 0 || levelInfo.origHeight % 4 !== 0)) console.warn("THREE.KTX2Loader: ETC1S and UASTC textures should use multiple-of-four dimensions.");
					if (levelCount > 1) {
						mipWidth = levelInfo.origWidth;
						mipHeight = levelInfo.origHeight;
					} else {
						mipWidth = levelInfo.width;
						mipHeight = levelInfo.height;
					}
					let dst = new Uint8Array(ktx2File.getImageTranscodedSizeInBytes(mip, layer, 0, transcoderFormat));
					const status = ktx2File.transcodeImage(dst, mip, layer, face, transcoderFormat, 0, -1, -1);
					if (engineType === EngineType.HalfFloatType) dst = new Uint16Array(dst.buffer, dst.byteOffset, dst.byteLength / Uint16Array.BYTES_PER_ELEMENT);
					if (!status) {
						cleanup();
						throw new Error("THREE.KTX2Loader: .transcodeImage failed.");
					}
					layerMips.push(dst);
				}
				const mipData = concat(layerMips);
				mipmaps.push({
					data: mipData,
					width: mipWidth,
					height: mipHeight
				});
				buffers.push(mipData.buffer);
			}
			faces.push({
				mipmaps,
				width,
				height,
				format: engineFormat,
				type: engineType
			});
		}
		cleanup();
		return {
			faces,
			buffers,
			width,
			height,
			hasAlpha,
			dfdFlags,
			format: engineFormat,
			type: engineType
		};
	}
	const FORMAT_OPTIONS = [
		{
			if: "astcSupported",
			basisFormat: [BasisFormat.UASTC],
			transcoderFormat: [TranscoderFormat.ASTC_4x4, TranscoderFormat.ASTC_4x4],
			engineFormat: [EngineFormat.RGBA_ASTC_4x4_Format, EngineFormat.RGBA_ASTC_4x4_Format],
			engineType: [EngineType.UnsignedByteType],
			priorityETC1S: Infinity,
			priorityUASTC: 1,
			needsPowerOfTwo: false
		},
		{
			if: "bptcSupported",
			basisFormat: [BasisFormat.ETC1S, BasisFormat.UASTC],
			transcoderFormat: [TranscoderFormat.BC7_M5, TranscoderFormat.BC7_M5],
			engineFormat: [EngineFormat.RGBA_BPTC_Format, EngineFormat.RGBA_BPTC_Format],
			engineType: [EngineType.UnsignedByteType],
			priorityETC1S: 3,
			priorityUASTC: 2,
			needsPowerOfTwo: false
		},
		{
			if: "dxtSupported",
			basisFormat: [BasisFormat.ETC1S, BasisFormat.UASTC],
			transcoderFormat: [TranscoderFormat.BC1, TranscoderFormat.BC3],
			engineFormat: [EngineFormat.RGBA_S3TC_DXT1_Format, EngineFormat.RGBA_S3TC_DXT5_Format],
			engineType: [EngineType.UnsignedByteType],
			priorityETC1S: 4,
			priorityUASTC: 5,
			needsPowerOfTwo: false
		},
		{
			if: "etc2Supported",
			basisFormat: [BasisFormat.ETC1S, BasisFormat.UASTC],
			transcoderFormat: [TranscoderFormat.ETC1, TranscoderFormat.ETC2],
			engineFormat: [EngineFormat.RGB_ETC2_Format, EngineFormat.RGBA_ETC2_EAC_Format],
			engineType: [EngineType.UnsignedByteType],
			priorityETC1S: 1,
			priorityUASTC: 3,
			needsPowerOfTwo: false
		},
		{
			if: "etc1Supported",
			basisFormat: [BasisFormat.ETC1S, BasisFormat.UASTC],
			transcoderFormat: [TranscoderFormat.ETC1],
			engineFormat: [EngineFormat.RGB_ETC1_Format],
			engineType: [EngineType.UnsignedByteType],
			priorityETC1S: 2,
			priorityUASTC: 4,
			needsPowerOfTwo: false
		},
		{
			if: "pvrtcSupported",
			basisFormat: [BasisFormat.ETC1S, BasisFormat.UASTC],
			transcoderFormat: [TranscoderFormat.PVRTC1_4_RGB, TranscoderFormat.PVRTC1_4_RGBA],
			engineFormat: [EngineFormat.RGB_PVRTC_4BPPV1_Format, EngineFormat.RGBA_PVRTC_4BPPV1_Format],
			engineType: [EngineType.UnsignedByteType],
			priorityETC1S: 5,
			priorityUASTC: 6,
			needsPowerOfTwo: true
		},
		{
			if: "bptcSupported",
			basisFormat: [BasisFormat.UASTC_HDR],
			transcoderFormat: [TranscoderFormat.BC6H],
			engineFormat: [EngineFormat.RGB_BPTC_UNSIGNED_Format],
			engineType: [EngineType.HalfFloatType],
			priorityHDR: 1,
			needsPowerOfTwo: false
		},
		{
			basisFormat: [BasisFormat.ETC1S, BasisFormat.UASTC],
			transcoderFormat: [TranscoderFormat.RGBA32, TranscoderFormat.RGBA32],
			engineFormat: [EngineFormat.RGBAFormat, EngineFormat.RGBAFormat],
			engineType: [EngineType.UnsignedByteType, EngineType.UnsignedByteType],
			priorityETC1S: 100,
			priorityUASTC: 100,
			needsPowerOfTwo: false
		},
		{
			basisFormat: [BasisFormat.UASTC_HDR],
			transcoderFormat: [TranscoderFormat.RGBA_HALF],
			engineFormat: [EngineFormat.RGBAFormat],
			engineType: [EngineType.HalfFloatType],
			priorityHDR: 100,
			needsPowerOfTwo: false
		}
	];
	const OPTIONS = {
		[BasisFormat.ETC1S]: FORMAT_OPTIONS.filter((opt) => opt.basisFormat.includes(BasisFormat.ETC1S)).sort((a, b) => a.priorityETC1S - b.priorityETC1S),
		[BasisFormat.UASTC]: FORMAT_OPTIONS.filter((opt) => opt.basisFormat.includes(BasisFormat.UASTC)).sort((a, b) => a.priorityUASTC - b.priorityUASTC),
		[BasisFormat.UASTC_HDR]: FORMAT_OPTIONS.filter((opt) => opt.basisFormat.includes(BasisFormat.UASTC_HDR)).sort((a, b) => a.priorityHDR - b.priorityHDR)
	};
	function getTranscoderFormat(basisFormat, width, height, hasAlpha) {
		const options = OPTIONS[basisFormat];
		for (let i = 0; i < options.length; i++) {
			const opt = options[i];
			if (opt.if && !config[opt.if]) continue;
			if (!opt.basisFormat.includes(basisFormat)) continue;
			if (hasAlpha && opt.transcoderFormat.length < 2) continue;
			if (opt.needsPowerOfTwo && !(isPowerOfTwo(width) && isPowerOfTwo(height))) continue;
			return {
				transcoderFormat: opt.transcoderFormat[hasAlpha ? 1 : 0],
				engineFormat: opt.engineFormat[hasAlpha ? 1 : 0],
				engineType: opt.engineType[0]
			};
		}
		throw new Error("THREE.KTX2Loader: Failed to identify transcoding target.");
	}
	function isPowerOfTwo(value) {
		if (value <= 2) return true;
		return (value & value - 1) === 0 && value !== 0;
	}
	/**
	* Concatenates N byte arrays.
	*
	* @param {Uint8Array[]} arrays
	* @return {Uint8Array}
	*/
	function concat(arrays) {
		if (arrays.length === 1) return arrays[0];
		let totalByteLength = 0;
		for (let i = 0; i < arrays.length; i++) {
			const array = arrays[i];
			totalByteLength += array.byteLength;
		}
		const result = new Uint8Array(totalByteLength);
		let byteOffset = 0;
		for (let i = 0; i < arrays.length; i++) {
			const array = arrays[i];
			result.set(array, byteOffset);
			byteOffset += array.byteLength;
		}
		return result;
	}
};
var UNCOMPRESSED_FORMATS = /* @__PURE__ */ new Set([
	RGBAFormat,
	RGBFormat,
	RGFormat,
	RedFormat
]);
var NORMALIZED_VK_FORMATS = /* @__PURE__ */ new Set([91]);
var FORMAT_MAP = {
	[109]: RGBAFormat,
	[103]: RGFormat,
	[100]: RedFormat,
	[97]: RGBAFormat,
	[83]: RGFormat,
	[76]: RedFormat,
	[91]: RGBAFormat,
	[43]: RGBAFormat,
	[37]: RGBAFormat,
	[22]: RGFormat,
	[16]: RGFormat,
	[15]: RedFormat,
	[9]: RedFormat,
	[123]: RGBFormat,
	[122]: RGBFormat,
	[152]: RGBA_ETC2_EAC_Format,
	[148]: RGB_ETC2_Format,
	[153]: R11_EAC_Format,
	[154]: SIGNED_R11_EAC_Format,
	[155]: RG11_EAC_Format,
	[156]: SIGNED_RG11_EAC_Format,
	[_i]: RGBA_ASTC_4x4_Format,
	[158]: RGBA_ASTC_4x4_Format,
	[157]: RGBA_ASTC_4x4_Format,
	[yi]: RGBA_ASTC_6x6_Format,
	[166]: RGBA_ASTC_6x6_Format,
	[165]: RGBA_ASTC_6x6_Format,
	[134]: RGBA_S3TC_DXT1_Format,
	[133]: RGBA_S3TC_DXT1_Format,
	[132]: RGB_S3TC_DXT1_Format,
	[131]: RGB_S3TC_DXT1_Format,
	[138]: RGBA_S3TC_DXT5_Format,
	[137]: RGBA_S3TC_DXT5_Format,
	[140]: SIGNED_RED_RGTC1_Format,
	[139]: RED_RGTC1_Format,
	[142]: SIGNED_RED_GREEN_RGTC2_Format,
	[141]: RED_GREEN_RGTC2_Format,
	[146]: RGBA_BPTC_Format,
	[145]: RGBA_BPTC_Format,
	[Ui]: RGBA_PVRTC_4BPPV1_Format,
	[oi]: RGBA_PVRTC_4BPPV1_Format,
	[ci]: RGBA_PVRTC_2BPPV1_Format,
	[ri]: RGBA_PVRTC_2BPPV1_Format
};
var TYPE_MAP = {
	[109]: FloatType,
	[103]: FloatType,
	[100]: FloatType,
	[97]: HalfFloatType,
	[83]: HalfFloatType,
	[76]: HalfFloatType,
	[91]: UnsignedShortType,
	[43]: UnsignedByteType,
	[37]: UnsignedByteType,
	[22]: UnsignedByteType,
	[16]: UnsignedByteType,
	[15]: UnsignedByteType,
	[9]: UnsignedByteType,
	[123]: UnsignedInt5999Type,
	[122]: UnsignedInt101111Type,
	[152]: UnsignedByteType,
	[148]: UnsignedByteType,
	[153]: UnsignedByteType,
	[154]: UnsignedByteType,
	[155]: UnsignedByteType,
	[156]: UnsignedByteType,
	[_i]: HalfFloatType,
	[158]: UnsignedByteType,
	[157]: UnsignedByteType,
	[yi]: HalfFloatType,
	[166]: UnsignedByteType,
	[165]: UnsignedByteType,
	[134]: UnsignedByteType,
	[133]: UnsignedByteType,
	[132]: UnsignedByteType,
	[131]: UnsignedByteType,
	[138]: UnsignedByteType,
	[137]: UnsignedByteType,
	[140]: UnsignedByteType,
	[139]: UnsignedByteType,
	[142]: UnsignedByteType,
	[141]: UnsignedByteType,
	[146]: UnsignedByteType,
	[145]: UnsignedByteType,
	[Ui]: UnsignedByteType,
	[oi]: UnsignedByteType,
	[ci]: UnsignedByteType,
	[ri]: UnsignedByteType
};
async function createRawTexture(container) {
	const { vkFormat } = container;
	if (FORMAT_MAP[vkFormat] === void 0) throw new Error("THREE.KTX2Loader: Unsupported vkFormat: " + vkFormat);
	if (TYPE_MAP[vkFormat] === void 0) console.warn("THREE.KTX2Loader: Missing \".type\" for vkFormat: " + vkFormat);
	let zstd;
	if (container.supercompressionScheme === 2) {
		if (!_zstd) _zstd = new Promise(async (resolve) => {
			const zstd = new Q();
			await zstd.init();
			resolve(zstd);
		});
		zstd = await _zstd;
	}
	const mipmaps = [];
	for (let levelIndex = 0; levelIndex < container.levels.length; levelIndex++) {
		const levelWidth = Math.max(1, container.pixelWidth >> levelIndex);
		const levelHeight = Math.max(1, container.pixelHeight >> levelIndex);
		const levelDepth = container.pixelDepth ? Math.max(1, container.pixelDepth >> levelIndex) : 0;
		const level = container.levels[levelIndex];
		let levelData;
		if (container.supercompressionScheme === 0) levelData = level.levelData;
		else if (container.supercompressionScheme === 2) levelData = zstd.decode(level.levelData, level.uncompressedByteLength);
		else throw new Error("THREE.KTX2Loader: Unsupported supercompressionScheme.");
		let data;
		if (TYPE_MAP[vkFormat] === 1015) data = new Float32Array(levelData.buffer, levelData.byteOffset, levelData.byteLength / Float32Array.BYTES_PER_ELEMENT);
		else if (TYPE_MAP[vkFormat] === 1016 || TYPE_MAP[vkFormat] === 1012) data = new Uint16Array(levelData.buffer, levelData.byteOffset, levelData.byteLength / Uint16Array.BYTES_PER_ELEMENT);
		else if (TYPE_MAP[vkFormat] === 35902 || TYPE_MAP[vkFormat] === 35899) data = new Uint32Array(levelData.buffer, levelData.byteOffset, levelData.byteLength / Uint32Array.BYTES_PER_ELEMENT);
		else data = levelData;
		mipmaps.push({
			data,
			width: levelWidth,
			height: levelHeight,
			depth: levelDepth
		});
	}
	const useMipmaps = container.levelCount === 0 || mipmaps.length > 1;
	let texture;
	if (UNCOMPRESSED_FORMATS.has(FORMAT_MAP[vkFormat])) {
		texture = container.pixelDepth === 0 ? new DataTexture(mipmaps[0].data, container.pixelWidth, container.pixelHeight) : new Data3DTexture(mipmaps[0].data, container.pixelWidth, container.pixelHeight, container.pixelDepth);
		texture.minFilter = useMipmaps ? NearestMipmapNearestFilter : NearestFilter;
		texture.magFilter = NearestFilter;
		texture.generateMipmaps = container.levelCount === 0;
		texture.normalized = NORMALIZED_VK_FORMATS.has(vkFormat);
	} else {
		if (container.pixelDepth > 0) throw new Error("THREE.KTX2Loader: Unsupported pixelDepth.");
		texture = new CompressedTexture(mipmaps, container.pixelWidth, container.pixelHeight);
		texture.minFilter = useMipmaps ? LinearMipmapLinearFilter : LinearFilter;
		texture.magFilter = LinearFilter;
	}
	texture.mipmaps = mipmaps;
	texture.type = TYPE_MAP[vkFormat];
	texture.format = FORMAT_MAP[vkFormat];
	texture.colorSpace = parseColorSpace(container);
	texture.needsUpdate = true;
	return Promise.resolve(texture);
}
function parseColorSpace(container) {
	const dfd = container.dataFormatDescriptor[0];
	if (dfd.colorPrimaries === 1) return dfd.transferFunction === 2 ? SRGBColorSpace : LinearSRGBColorSpace;
	else if (dfd.colorPrimaries === 10) return dfd.transferFunction === 2 ? DisplayP3ColorSpace : LinearDisplayP3ColorSpace;
	else if (dfd.colorPrimaries === 0) return "";
	else {
		console.warn(`THREE.KTX2Loader: Unsupported color primaries, "${dfd.colorPrimaries}"`);
		return "";
	}
}
// node_modules/xrblocks/build/internal/ModelLoader.js
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
function isRunningInGeminiCanvas() {
	return typeof window.firebaseAuthBridgeScriptLoaded !== "undefined";
}
/**
* Clamps a value between a minimum and maximum value.
*/
function clamp$1(value, min, max) {
	return Math.min(Math.max(value, min), max);
}
/**
* Linearly interpolates between two numbers `x` and `y` by a given amount `t`.
*/
function lerp(x, y, t) {
	return x + (y - x) * t;
}
/**
* Python-style print function for debugging.
*/
function print(...args) {
	console.log("*", ...args);
}
var urlParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
/**
* Function to get the value of a URL parameter.
* @param name - The name of the URL parameter.
* @returns The value of the URL parameter or null if not found.
*/
function getUrlParameter(name) {
	return new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get(name);
}
/**
* Retrieves a boolean URL parameter. Returns true for 'true' or '1', false for
* 'false' or '0'. If the parameter is not found, returns the specified default
* boolean value.
* @param name - The name of the URL parameter.
* @param defaultBool - The default boolean value if the
*     parameter is not present.
* @returns The boolean value of the URL parameter.
*/
function getUrlParamBool(name, defaultBool = false) {
	const inputString = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get(name)?.toLowerCase();
	if (inputString === "true" || inputString === "1") return true;
	if (inputString === "false" || inputString === "0") return false;
	return defaultBool;
}
/**
* Retrieves an integer URL parameter. If the parameter is not found or is not a
* valid number, returns the specified default integer value.
* @param name - The name of the URL parameter.
* @param defaultNumber - The default integer value if the
*     parameter is not present.
* @returns The integer value of the URL parameter.
*/
function getUrlParamInt(name, defaultNumber = 0) {
	const inputNumber = new URLSearchParams(window.location.search).get(name);
	if (inputNumber) {
		const num = parseInt(inputNumber, 10);
		if (!isNaN(num)) return num;
	}
	return defaultNumber;
}
/**
* Retrieves a float URL parameter. If the parameter is not found or is not a
* valid number, returns the specified default float value.
* @param name - The name of the URL parameter.
* @param defaultNumber - The default float value if the parameter
*     is not present.
* @returns The float value of the URL parameter.
*/
function getUrlParamFloat(name, defaultNumber = 0) {
	const inputNumber = new URLSearchParams(window.location.search).get(name);
	if (inputNumber) {
		const num = parseFloat(inputNumber);
		if (!isNaN(num)) return num;
	}
	return defaultNumber;
}
/**
* Parses a color string (hexadecimal with optional alpha) into a THREE.Vector4.
* Supports:
* - #rgb (shorthand, alpha defaults to 1)
* - #rrggbb (alpha defaults to 1)
* - #rgba (shorthand)
* - #rrggbbaa
*
* @param colorString - The color string to parse (e.g., '#66ccff',
*     '#6cf5', '#66ccff55', '#6cf').
* @returns The parsed color as a THREE.Vector4 (r, g, b, a), with components in
*     the 0-1 range.
* @throws If the input is not a string or if the hex string is invalid.
*/
function getVec4ByColorString(colorString) {
	if (typeof colorString !== "string") throw new Error("colorString must be a string");
	const hex = colorString.startsWith("#") ? colorString.slice(1) : colorString;
	const len = hex.length;
	let alpha = 1;
	let expandedHex = hex;
	if (len === 3 || len === 4) expandedHex = hex.split("").map((char) => char + char).join("");
	if (expandedHex.length === 8) {
		alpha = parseInt(expandedHex.slice(6, 8), 16) / 255;
		expandedHex = expandedHex.slice(0, 6);
	} else if (expandedHex.length === 6) {} else throw new Error(`Invalid hex color string format: ${colorString}`);
	const r = parseInt(expandedHex.slice(0, 2), 16) / 255;
	const g = parseInt(expandedHex.slice(2, 4), 16) / 255;
	const b = parseInt(expandedHex.slice(4, 6), 16) / 255;
	if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(alpha)) throw new Error(`Invalid hex values in color string: ${colorString}`);
	return new Vector4(r, g, b, alpha);
}
function getColorHex(fontColor) {
	if (typeof fontColor === "string") {
		const vec4 = getVec4ByColorString(fontColor);
		const r = Math.round(vec4.x * 255);
		const g = Math.round(vec4.y * 255);
		const b = Math.round(vec4.z * 255);
		return (r << 16) + (g << 8) + b;
	} else if (typeof fontColor === "number") return fontColor;
	else return 16777215;
}
/**
* Parses a data URL (e.g., "data:image/png;base64,...") into its
* stripped base64 string and MIME type.
* This function handles common image MIME types.
* @param dataURL - The data URL string.
* @returns An object containing the stripped base64 string and the extracted
*     MIME type.
*/
function parseBase64DataURL(dataURL) {
	const match = dataURL.match(/^data:(image\/[a-zA-Z0-9\-+.]+);base64,/);
	if (match) {
		const mimeType = match[1];
		return {
			strippedBase64: dataURL.substring(match[0].length),
			mimeType
		};
	} else return {
		strippedBase64: dataURL,
		mimeType: null
	};
}
var GEMINI_DEFAULT_FLASH_MODEL = "gemini-3.8-flash";
var GEMINI_DEFAULT_LIVE_MODEL = "gemini-3.8-live";
var GEMINI_DEFAULT_IMAGE_MODEL = "gemini-nano-banana-2.1";
var GeminiOptions = class {
	constructor() {
		this.apiKey = "";
		this.urlParam = "geminiKey";
		this.keyValid = false;
		this.enabled = false;
		this.model = GEMINI_DEFAULT_FLASH_MODEL;
		this.liveModel = GEMINI_DEFAULT_LIVE_MODEL;
		this.config = {};
	}
};
var OpenAIOptions = class {
	constructor() {
		this.apiKey = "";
		this.urlParam = "openaiKey";
		this.model = "gpt-6-luna";
		this.enabled = false;
	}
};
var AIOptions = class {
	constructor() {
		this.enabled = false;
		this.model = "gemini";
		this.promptForApiKey = false;
		this.gemini = new GeminiOptions();
		this.openai = new OpenAIOptions();
		this.globalUrlParams = { key: "key" };
	}
};
var PROMPT_TAG = "xb-ai-key-prompt";
var sessionApiKeys = /* @__PURE__ */ new Map();
function getSessionApiKey(modelName) {
	return sessionApiKeys.get(modelName) ?? null;
}
function setSessionApiKey(modelName, apiKey) {
	sessionApiKeys.set(modelName, apiKey);
}
function clearSessionApiKey(modelName) {
	sessionApiKeys.delete(modelName);
}
function defineApiKeyPromptElement() {
	if (customElements.get(PROMPT_TAG)) return;
	class BrowserApiKeyPromptElement extends HTMLElement {
		constructor() {
			super();
			this.selectedConfiguredKey = null;
			this.attachShadow({ mode: "open" });
		}
		open(modelName, configuredKey) {
			this.selectedConfiguredKey = configuredKey;
			this.render(modelName, configuredKey);
			this.bindEvents(modelName);
			this.dialog.showModal?.();
			if (!this.dialog.open) this.dialog.setAttribute("open", "");
			this.input.focus();
			return new Promise((resolve) => {
				this.resolveResult = resolve;
			});
		}
		render(modelName, configuredKey) {
			const displayName = modelName === "openai" ? "OpenAI" : "Gemini";
			const keyUrl = modelName === "openai" ? "https://platform.openai.com/api-keys" : "https://aistudio.google.com/app/apikey";
			const keySourceName = modelName === "openai" ? "the OpenAI platform" : "Google AI Studio";
			this.shadowRoot.innerHTML = `
        <style>${BrowserApiKeyPromptElement.styles}</style>
        <dialog aria-label="${modelName} API key">
          <form method="dialog" class="prompt">
            <header>
              <h2>Set Up Your API Key</h2>
              <p>
                To use AI in this prototype, enter a ${displayName} API key.
                You can create one at
                <a href="${keyUrl}" target="_blank" rel="noopener">${keySourceName}</a>.
              </p>
            </header>
            <div class="card">
              <label>
                API key
                <input name="apiKey" type="password" autocomplete="off" spellcheck="false" placeholder="Enter API Key" />
              </label>
              <p class="note">The key stays in this page session only. Use a server-managed key in production.</p>
              <p class="status" data-status>${configuredKey ? "An available key is ready to use." : ""}</p>
              <menu class="actions">
                <button class="button primary ${configuredKey ? "" : "wide"}" value="session">Use for this session</button>
                ${configuredKey ? "<button class=\"button\" value=\"configured\">Use available key</button>" : ""}
                <button class="button wide" value="skip">Continue without AI</button>
              </menu>
              ${configuredKey ? "<button class=\"clear\" value=\"clear\">Clear available key</button>" : ""}
            </div>
          </form>
        </dialog>`;
			this.dialog = this.shadowRoot.querySelector("dialog");
		}
		bindEvents(modelName) {
			this.shadowRoot.querySelector("form").addEventListener("submit", (event) => {
				event.preventDefault();
				const action = event.submitter?.value;
				if (action === "session") {
					const apiKey = this.input.value.trim();
					if (!apiKey) {
						this.status.textContent = "Enter an API key or continue without one.";
						this.input.focus();
						return;
					}
					setSessionApiKey(modelName, apiKey);
					this.finish(apiKey);
					return;
				}
				if (action === "clear") {
					clearSessionApiKey(modelName);
					this.selectedConfiguredKey = null;
					this.input.value = "";
					this.status.textContent = "The session key was cleared.";
					this.button("configured")?.remove();
					this.button("clear")?.remove();
					this.button("session")?.classList.add("wide");
					return;
				}
				this.finish(action === "configured" ? this.selectedConfiguredKey : null);
			});
			this.dialog.addEventListener("cancel", (event) => {
				event.preventDefault();
				this.finish(null);
			});
		}
		get input() {
			return this.shadowRoot.querySelector("input[name=\"apiKey\"]");
		}
		get status() {
			return this.shadowRoot.querySelector("[data-status]");
		}
		button(value) {
			return this.shadowRoot.querySelector(`button[value="${value}"]`);
		}
		finish(key) {
			this.dialog?.close?.();
			this.remove();
			this.resolveResult?.(key);
			this.resolveResult = void 0;
		}
		static {
			this.styles = `
      dialog {
        width: min(560px, calc(100vw - 32px));
        max-width: none;
        padding: 0;
        border: 0;
        overflow: visible;
        color: #fff;
        background: transparent;
      }
      dialog::backdrop {
        background: #111;
      }
      .prompt {
        display: grid;
        gap: 24px;
        box-sizing: border-box;
        color: #fff;
        font: 16px/1.5 'Google Sans', 'Segoe UI', system-ui, sans-serif;
      }
      header {
        text-align: center;
      }
      h2 {
        margin: 0 0 12px;
        color: #fff;
        font-size: 28px;
        line-height: 1.2;
      }
      header p {
        margin: 0;
        color: rgba(255, 255, 255, 0.78);
      }
      a {
        color: #fff;
        text-decoration: underline;
        text-underline-offset: 3px;
      }
      .card {
        display: grid;
        gap: 18px;
        box-sizing: border-box;
        width: 100%;
        padding: 30px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.9);
      }
      label {
        display: grid;
        gap: 8px;
        color: #fff;
        font-size: 14px;
        font-weight: 600;
      }
      input {
        width: 100%;
        box-sizing: border-box;
        padding: 12px 16px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        outline: none;
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        font: 16px/1.2 'Google Sans', 'Segoe UI', system-ui, sans-serif;
        transition: border-color 140ms ease, box-shadow 140ms ease;
      }
      input::placeholder { color: rgba(255, 255, 255, 0.5); }
      input:focus {
        border-color: #fff;
        box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.12);
      }
      .note {
        margin: -10px 0 0;
        color: rgba(255, 255, 255, 0.58);
        font-size: 12px;
      }
      .status {
        min-height: 20px;
        margin: -8px 0 0;
        color: rgba(255, 255, 255, 0.72);
        font-size: 12px;
      }
      .actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin: 0;
        padding: 0;
      }
      .button {
        min-height: 44px;
        padding: 10px 14px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.12);
        color: #fff;
        font: 600 14px/1 'Google Sans', 'Segoe UI', system-ui, sans-serif;
        text-transform: none;
        cursor: pointer;
      }
      .button:hover { background: rgba(255, 255, 255, 0.2); }
      .primary {
        border-color: #fff;
        background: #fff;
        color: #11141b;
      }
      .primary:hover {
        background: #e8e8e8;
      }
      .wide { grid-column: 1 / -1; }
      .clear {
        justify-self: center;
        padding: 0;
        border: 0;
        background: none;
        color: rgba(255, 255, 255, 0.58);
        font: 12px/1.4 'Google Sans', 'Segoe UI', system-ui, sans-serif;
        text-transform: none;
        cursor: pointer;
      }
      .clear:hover {
        color: #fff;
        text-decoration: underline;
      }
      @media (max-width: 480px) {
        h2 { font-size: 24px; }
        .card { padding: 22px; }
        .actions { grid-template-columns: 1fr; }
        .wide { grid-column: auto; }
      }`;
		}
	}
	customElements.define(PROMPT_TAG, BrowserApiKeyPromptElement);
}
/** Shows a dependency-free browser dialog for local AI prototypes. */
function promptForApiKey(modelName, configuredKey) {
	if (typeof document === "undefined") return Promise.resolve(configuredKey);
	defineApiKeyPromptElement();
	const prompt = document.createElement(PROMPT_TAG);
	document.body.append(prompt);
	return prompt.open(modelName, configuredKey);
}
var BaseAIModel = class {
	constructor() {}
	async hasApiKey() {
		return false;
	}
};
var GoogleGenAI;
var EndSensitivity;
var StartSensitivity;
var Modality;
async function loadGoogleGenAIModule() {
	if (GoogleGenAI) return;
	try {
		const genAIModule = await __vitePreload(() => import("./web-oJPo40QI.js"), __vite__mapDeps([0,1]));
		if (genAIModule && genAIModule.GoogleGenAI) {
			GoogleGenAI = genAIModule.GoogleGenAI;
			EndSensitivity = genAIModule.EndSensitivity;
			StartSensitivity = genAIModule.StartSensitivity;
			Modality = genAIModule.Modality;
			console.log("'@google/genai' module loaded successfully.");
		} else throw new Error("'@google/genai' module loaded but is not valid.");
	} catch (error) {
		const errorMessage = `The '@google/genai' module is required for Gemini but failed to load. Error: ${error}`;
		console.error(errorMessage);
		throw new Error(errorMessage);
	}
}
/** Maps an input media type onto the Interactions tagged content blocks. */
function interactionMediaType(mimeType) {
	const prefix = mimeType.split("/")[0];
	return prefix === "image" || prefix === "audio" || prefix === "video" ? prefix : "document";
}
/**
* Converts the SDK's Part-based payloads into the tagged content blocks the
* Interactions API accepts as `input`.
*/
function partToInteractionContent(part) {
	if (part.text !== void 0) return {
		type: "text",
		text: part.text
	};
	const inline = part.inlineData;
	if (inline?.data !== void 0) {
		const mimeType = inline.mimeType ?? "application/octet-stream";
		return {
			type: interactionMediaType(mimeType),
			mime_type: mimeType,
			data: inline.data
		};
	}
	const file = part.fileData;
	if (file?.fileUri !== void 0) {
		const mimeType = file.mimeType ?? "application/octet-stream";
		return {
			type: interactionMediaType(mimeType),
			mime_type: mimeType,
			uri: file.fileUri
		};
	}
	console.warn("Unsupported Gemini query part dropped from the input:", part);
	return null;
}
function buildInteractionInput(input) {
	if (!("type" in input)) return input.prompt;
	switch (input.type) {
		case "text": return input.text;
		case "base64": return [{
			type: "image",
			mime_type: input.mimeType ?? "image/png",
			data: input.base64
		}];
		case "uri":
		case "multiPart": {
			const blocks = (input.type === "uri" ? [{ fileData: {
				fileUri: input.uri,
				mimeType: input.mimeType
			} }, ...input.text ? [{ text: input.text }] : []] : input.parts ?? []).map(partToInteractionContent).filter((block) => block !== null);
			return blocks.length > 0 ? blocks : null;
		}
		default: return null;
	}
}
function findFunctionCallStep(interaction) {
	for (const step of interaction.steps ?? []) if (step.type === "function_call") return step;
}
var Gemini = class extends BaseAIModel {
	constructor(options) {
		super();
		this.options = options;
		this.inited = false;
		this.isLiveMode = false;
		this.liveCallbacks = {};
		this.liveSessionGeneration = 0;
		this.liveSessionStopped = false;
	}
	async init() {
		await loadGoogleGenAIModule();
	}
	isAvailable() {
		if (!GoogleGenAI) return false;
		if (!this.inited) {
			this.ai = new GoogleGenAI({ apiKey: this.options.apiKey || "X" });
			this.inited = true;
		}
		return true;
	}
	isLiveAvailable() {
		return this.isAvailable() && EndSensitivity && StartSensitivity && Modality;
	}
	/**
	* Shares a pending connection between concurrent starts. Stopping or disposing
	* invalidates that start; any session returned later is closed and the start
	* rejects with AbortError. The provider cannot be aborted before it returns.
	*/
	async startLiveSession(params = {}, model) {
		if (!this.isLiveAvailable()) throw new Error("Live API not available. Make sure @google/genai module is loaded.");
		if (this.liveSession) return this.liveSession;
		if (this.liveSessionPromise) return this.liveSessionPromise;
		const generation = ++this.liveSessionGeneration;
		this.liveSessionStopped = false;
		const isCurrent = () => generation === this.liveSessionGeneration;
		const isRunning = () => isCurrent() && !this.liveSessionStopped;
		const defaultConfig = {
			responseModalities: [Modality.AUDIO],
			speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } } },
			outputAudioTranscription: {},
			inputAudioTranscription: {},
			...params
		};
		const connectParams = {
			model: model ?? this.options.liveModel,
			callbacks: {
				onopen: () => {
					if (!isRunning()) return;
					this.isLiveMode = true;
					console.log("🔓 Live session opened.");
					if (this.liveCallbacks?.onopen) this.liveCallbacks.onopen();
				},
				onmessage: (e) => {
					if (!isRunning()) return;
					if (this.liveCallbacks?.onmessage) this.liveCallbacks.onmessage(e);
				},
				onerror: (e) => {
					if (!isRunning()) return;
					console.error("❌ Live session error:", e);
					if (this.liveCallbacks?.onerror) this.liveCallbacks.onerror(e);
				},
				onclose: (event) => {
					if (!isCurrent()) return;
					this.liveSessionStopped = true;
					this.liveSessionPromise = void 0;
					this.isLiveMode = false;
					this.liveSession = void 0;
					if (event.reason) console.warn("🔒 Live session closed:", event);
					else console.warn("🔒 Live session closed without reason.");
					if (this.liveCallbacks?.onclose) this.liveCallbacks.onclose(event);
				}
			},
			config: defaultConfig
		};
		this.liveSessionPromise = Promise.resolve().then(async () => {
			try {
				if (!isRunning()) throw new DOMException("Live session start cancelled.", "AbortError");
				console.log("Connecting with params:", connectParams);
				const session = await this.ai.live.connect(connectParams);
				if (!isRunning()) {
					session.close();
					throw new DOMException("Live session start cancelled.", "AbortError");
				}
				this.liveSession = session;
				return session;
			} catch (error) {
				if (isCurrent()) {
					this.liveSessionStopped = true;
					this.isLiveMode = false;
				}
				console.error("❌ Failed to start live session:", error);
				throw error;
			} finally {
				if (isCurrent()) this.liveSessionPromise = void 0;
			}
		});
		return this.liveSessionPromise;
	}
	async stopLiveSession() {
		this.closeLiveSession();
	}
	/** Invalidates live work synchronously without creating a teardown promise. */
	dispose() {
		++this.liveSessionGeneration;
		this.closeLiveSession();
	}
	closeLiveSession() {
		this.liveSessionStopped = true;
		this.liveSessionPromise = void 0;
		const session = this.liveSession;
		this.liveSession = void 0;
		this.isLiveMode = false;
		session?.close();
	}
	setLiveCallbacks(callbacks) {
		this.liveCallbacks = callbacks;
	}
	sendToolResponse(response) {
		if (this.liveSession) {
			console.debug("Sending tool response to gemini:", response);
			this.liveSession.sendToolResponse(response);
		}
	}
	sendRealtimeInput(input) {
		if (!this.liveSession) return;
		try {
			this.liveSession.sendRealtimeInput(input);
		} catch (error) {
			console.error("❌ Error sending realtime input:", error);
			throw error;
		}
	}
	getLiveSessionStatus() {
		return {
			isActive: this.isLiveMode,
			hasSession: !!this.liveSession,
			isAvailable: this.isLiveAvailable()
		};
	}
	async query(input) {
		if ("useExponentialBackoff" in input && input.useExponentialBackoff !== void 0 ? input.useExponentialBackoff : isRunningInGeminiCanvas()) return this.queryWithExponentialFalloff(input);
		return this.queryOnce(input);
	}
	async queryOnce(input) {
		if (!this.inited) {
			console.warn("Gemini not inited.");
			return null;
		}
		const interactionInput = buildInteractionInput(input);
		if (interactionInput === null) return { text: null };
		const params = {
			...this.options.config,
			model: this.options.model,
			input: interactionInput,
			store: false
		};
		const interaction = await this.ai.interactions.create(params);
		const toolCall = findFunctionCallStep(interaction);
		if (toolCall && toolCall.name) return { toolCall: {
			name: toolCall.name,
			args: toolCall.arguments
		} };
		return { text: interaction.output_text || null };
	}
	async queryWithExponentialFalloff(input) {
		const delays = [
			1e3,
			2e3,
			4e3,
			8e3,
			16e3
		];
		let attempt = 0;
		let lastError = null;
		while (attempt < delays.length) try {
			return await this.queryOnce(input);
		} catch (error) {
			console.warn(`Attempt ${attempt + 1} failed:`, error);
			lastError = error;
			await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
			attempt++;
		}
		console.error("Failed to query with exponential backoff:", lastError);
		return null;
	}
	async generate(prompt, type = "image", systemInstruction = "Generate an image", model = GEMINI_DEFAULT_IMAGE_MODEL) {
		if (!this.isAvailable()) return;
		let contents;
		if (Array.isArray(prompt)) contents = prompt.map((item) => {
			if (typeof item === "string") {
				if (item.startsWith("data:image/")) {
					const [header, data] = item.split(",");
					const mimeType = header.split(";")[0].split(":")[1];
					return partToInteractionContent({ inlineData: {
						mimeType,
						data
					} });
				}
				return partToInteractionContent({ text: item });
			}
			return partToInteractionContent(item);
		}).filter((block) => block !== null);
		else contents = prompt;
		const params = {
			model,
			input: contents,
			system_instruction: systemInstruction,
			response_format: [{ type: "image" }],
			store: false
		};
		const interaction = await this.ai.interactions.create(params);
		if (type === "image") for (const step of interaction.steps ?? []) {
			if (step.type !== "model_output") continue;
			for (const block of step.content ?? []) if (block.type === "image" && block.data) return "data:" + (block.mime_type || "image/png") + ";base64," + block.data;
		}
	}
	async hasApiKey() {
		return this.options.apiKey !== "" || isRunningInGeminiCanvas();
	}
};
var OpenAIApi = null;
async function loadOpenAIModule() {
	if (OpenAIApi) return;
	try {
		OpenAIApi = (await __vitePreload(async () => {
			const { default: __vite_default__ } = await import("./openai-rmtI8DgI.js");
			return { default: __vite_default__ };
		}, [])).default;
		console.log("'openai' module loaded successfully.");
	} catch (error) {
		console.warn("'openai' module not found. Using fallback implementations.", "Error details:", error);
	}
}
var OpenAI = class extends BaseAIModel {
	constructor(options) {
		super();
		this.options = options;
	}
	async init() {
		await loadOpenAIModule();
		if (this.options.apiKey && OpenAIApi) {
			this.openai = new OpenAIApi({
				apiKey: this.options.apiKey,
				dangerouslyAllowBrowser: true
			});
			console.log("OpenAI model initialized");
		} else console.error("OpenAI API key is missing or module failed to load.");
	}
	isAvailable() {
		return !!this.openai;
	}
	async query(input, _tools) {
		if (!this.isAvailable()) throw new Error("OpenAI model is not initialized.");
		try {
			const content = (await this.openai.chat.completions.create({
				messages: [{
					role: "user",
					content: input.prompt
				}],
				model: this.options.model
			})).choices[0].message.content;
			if (content) return { text: content };
			return null;
		} catch (error) {
			console.error("Error querying OpenAI:", error);
			throw error;
		}
	}
	async generate() {
		throw new Error("Wrapper not implemented");
	}
};
var SUPPORTED_MODELS = {
	gemini: Gemini,
	openai: OpenAI
};
/**
* AI Interface to wrap different AI models (primarily Gemini)
* Handles both traditional query-based AI interactions and real-time live
* sessions
*
* Features:
* - Text and multimodal queries
* - Real-time audio/video AI sessions (Gemini Live)
* - Advanced API key management with multiple sources
* - Session locking to prevent concurrent operations
*
* The URL param and key.json shortcut is only for demonstration and prototyping
* practice and we strongly suggest not using it for production or deployment
* purposes. One should set up a proper server to converse with AI servers in
* deployment.
*
* API Key Management Features:
*
* 1. Multiple Key Sources (Priority Order):
*    - Model option
*    - Generic and model-specific URL parameters
*    - Current-page memory
*    - keys.json file
* 2. keys.json Support:
*    - Structure: \{"gemini": \{"apiKey": "YOUR_KEY_HERE"\}\}
*    - Automatically loads if present
*/
var AI = class extends Script {
	constructor(..._args) {
		super(..._args);
		this.editorIcon = "network_intelligence";
		this.lock = false;
	}
	static {
		this.dependencies = { aiOptions: AIOptions };
	}
	/**
	* Load API keys from keys.json file if available
	* Parsed keys object or null if not found
	*/
	async loadKeysFromFile() {
		if (this.keysCache) return this.keysCache;
		try {
			const response = await fetch("./keys.json");
			if (response.ok) {
				this.keysCache = await response.json();
				return this.keysCache;
			}
		} catch {}
		return null;
	}
	async init({ aiOptions }) {
		this.options = aiOptions;
		if (!aiOptions.enabled) {
			console.log("AI is disabled in options");
			return;
		}
		const modelName = aiOptions.model;
		const ModelClass = SUPPORTED_MODELS[modelName];
		if (ModelClass) {
			const modelOptions = aiOptions[modelName];
			if (modelOptions && modelOptions.enabled) await this.initializeModel(ModelClass, modelOptions);
			else console.log(`${modelName} is disabled in AI options`);
		} else console.error(`Unsupported AI model: ${modelName}`);
	}
	async initializeModel(ModelClass, modelOptions) {
		const resolvedKey = await this.resolveApiKeyWithSource(modelOptions);
		let apiKey = resolvedKey.key;
		const keyBypassesPrompt = resolvedKey.source === "url" || resolvedKey.source === "keys.json";
		if (this.options.promptForApiKey && !keyBypassesPrompt && !isRunningInGeminiCanvas()) apiKey = await promptForApiKey(this.options.model, apiKey);
		if (!apiKey || !this.isValidApiKey(apiKey)) {
			if (isRunningInGeminiCanvas()) console.warn(`No explicit API key found for ${this.options.model}. Relying on Gemini Canvas host-injected credentials; if queries fail, verify your Google login or report bugs on GitHub.`);
			else console.warn(`No valid API key found for ${this.options.model}. Provide one via AIOptions, the ?key= URL parameter, or keys.json; queries will fail until a key is configured.`);
		}
		modelOptions.apiKey = apiKey || "";
		this.model = new ModelClass(modelOptions);
		try {
			await this.model.init();
			console.log(`${this.options.model} initialized`);
		} catch (error) {
			console.error(`Failed to initialize ${this.options.model}:`, error);
			this.model = void 0;
		}
	}
	async resolveApiKey(modelOptions) {
		return (await this.resolveApiKeyWithSource(modelOptions)).key;
	}
	async resolveApiKeyWithSource(modelOptions) {
		const modelName = this.options.model;
		if (modelOptions.apiKey) return {
			key: modelOptions.apiKey,
			source: "options"
		};
		const urlKey = this.getUrlApiKey(modelOptions);
		if (urlKey) return {
			key: urlKey,
			source: "url"
		};
		if (this.options.promptForApiKey) {
			const sessionKey = getSessionApiKey(modelName);
			if (sessionKey) return {
				key: sessionKey,
				source: "session"
			};
		}
		const keysFromFile = await this.loadKeysFromFile();
		if (keysFromFile) {
			const keyFromFile = keysFromFile[modelName]?.apiKey;
			if (keyFromFile) return {
				key: keyFromFile,
				source: "keys.json"
			};
		}
		return {
			key: null,
			source: "none"
		};
	}
	getUrlApiKey(modelOptions) {
		return getUrlParameter(this.options.globalUrlParams.key) || getUrlParameter(modelOptions.urlParam);
	}
	isValidApiKey(key) {
		return key && typeof key === "string" && key.length > 0;
	}
	isAvailable() {
		return this.model && this.model.isAvailable();
	}
	async query(input, tools) {
		if (!this.isAvailable()) throw new Error("AI is not available. Check if it's enabled and properly initialized.");
		if (this.model instanceof Gemini) return await this.model.query(input);
		if (typeof input !== "object" || input === null || !("prompt" in input)) throw new Error(`${this.options.model} only supports {prompt: string} query inputs.`);
		return await this.model.query(input, tools);
	}
	/**
	* Concurrent starts share a connection. A start invalidated by stop or dispose
	* rejects with AbortError when the provider returns, closing that late session.
	*/
	async startLiveSession(config = {}, model) {
		if (!this.model) throw new Error("AI model is not initialized.");
		if (!("isLiveAvailable" in this.model) || !this.model.isLiveAvailable()) throw new Error("Live session is not available for the current model.");
		try {
			return await this.model.startLiveSession(config, model);
		} catch (error) {
			console.error("❌ Failed to start Live session:", error);
			throw error;
		}
	}
	/**
	* Invalidates pending live work and closes any established session. This does
	* not wait for an in-flight provider connection to finish.
	*/
	async stopLiveSession() {
		if (!this.model) return;
		try {
			await ("stopLiveSession" in this.model && this.model.stopLiveSession());
		} catch (error) {
			console.error("❌ Error stopping Live session:", error);
		}
	}
	/** Closes live resources synchronously for the Script disposal contract. */
	dispose() {
		if (this.model instanceof Gemini) this.model.dispose();
		super.dispose();
	}
	async setLiveCallbacks(callbacks) {
		if (this.model && "setLiveCallbacks" in this.model) this.model.setLiveCallbacks(callbacks);
	}
	sendToolResponse(response) {
		if (this.model && "sendToolResponse" in this.model) this.model.sendToolResponse(response);
	}
	sendRealtimeInput(input) {
		if (!this.model || !("sendRealtimeInput" in this.model)) return false;
		return this.model.sendRealtimeInput(input);
	}
	getLiveSessionStatus() {
		if (!this.model || !("getLiveSessionStatus" in this.model)) return {
			isActive: false,
			hasSession: false,
			isAvailable: false
		};
		return this.model.getLiveSessionStatus();
	}
	isLiveAvailable() {
		return this.model && "isLiveAvailable" in this.model && this.model.isLiveAvailable();
	}
	async generate(prompt, type = "image", systemInstruction = "Generate an image", model) {
		if (!this.isAvailable()) throw new Error("AI is not available. Check if it's enabled and properly initialized.");
		if (this.model instanceof Gemini) return this.model.generate(prompt, type, systemInstruction, model);
		throw new Error(`${this.options.model} does not support generate().`);
	}
	/**
	* Create a sample keys.json file structure for reference
	* @returns Sample keys.json structure
	*/
	static createSampleKeysStructure() {
		return {
			gemini: { apiKey: "YOUR_GEMINI_API_KEY_HERE" },
			openai: { apiKey: "YOUR_OPENAI_API_KEY_HERE" }
		};
	}
	/**
	* Check if the current model has an API key available from any source
	* @returns True if API key is available
	*/
	async hasApiKey() {
		if (!this.options) return false;
		const modelOptions = this.options[this.options.model];
		if (!modelOptions) return false;
		if (this.model?.hasApiKey ? await this.model.hasApiKey() : false) return true;
		const apiKey = await this.resolveApiKey(modelOptions);
		return apiKey && this.isValidApiKey(apiKey);
	}
};
/**
* Default parameters for rgb to depth projection.
* For RGB and depth, 4:3 and 1:1, respectively.
*/
var DEFAULT_RGB_TO_DEPTH_PARAMS = {
	scale: 1,
	scaleX: .75,
	scaleY: .63,
	translateU: .2,
	translateV: -.02,
	k1: -.046,
	k2: 0,
	k3: 0,
	p1: 0,
	p2: 0,
	xc: 0,
	yc: 0
};
/**
* Configuration options for the device camera.
*/
var DeviceCameraOptions = class {
	constructor(options) {
		this.enabled = false;
		this.willCaptureFrequently = false;
		this.rgbToDepthParams = { ...DEFAULT_RGB_TO_DEPTH_PARAMS };
		deepMerge(this, options);
	}
};
var baseCaptureOptions = {
	enabled: true,
	videoConstraints: {
		width: { ideal: DEFAULT_DEVICE_CAMERA_WIDTH },
		height: { ideal: 720 }
	}
};
var xrDeviceCameraEnvironmentOptions = deepFreeze(new DeviceCameraOptions({
	...baseCaptureOptions,
	videoConstraints: {
		...baseCaptureOptions.videoConstraints,
		facingMode: "environment"
	}
}));
var xrDeviceCameraUserOptions = deepFreeze(new DeviceCameraOptions({
	...baseCaptureOptions,
	videoConstraints: {
		...baseCaptureOptions.videoConstraints,
		facingMode: "user"
	}
}));
var xrDeviceCameraEnvironmentContinuousOptions = deepFreeze(new DeviceCameraOptions({
	...xrDeviceCameraEnvironmentOptions,
	willCaptureFrequently: true
}));
var xrDeviceCameraUserContinuousOptions = deepFreeze(new DeviceCameraOptions({
	...xrDeviceCameraUserOptions,
	willCaptureFrequently: true
}));
function intrinsicsToProjectionMatrix(K, width, height, near, far, target) {
	const fx = K[0];
	const fy = K[4];
	const cx = K[2];
	const cy = K[5];
	const x = 2 * fx / width;
	const y = 2 * fy / height;
	const a = 1 - 2 * cx / width;
	const b = 2 * cy / height - 1;
	const c = -(far + near) / (far - near);
	const d = -(2 * far * near) / (far - near);
	target.set(x, 0, a, 0, 0, y, b, 0, 0, 0, c, d, 0, 0, -1, 0);
	return target;
}
var MOOHAN_PROJECTION_MATRIX = intrinsicsToProjectionMatrix([
	800,
	0,
	640,
	0,
	800,
	360,
	0,
	0,
	1
], 1280, 720, .1, 1e3, new Matrix4());
var MOOHAN_CAMERA_POSE_IN_RIGHT_CAMERA_POSITION = new Vector3(0, -.003, 0);
var MOOHAN_CAMERA_POSE_IN_RIGHT_CAMERA_ROTATION = new Quaternion().setFromEuler(new Euler(-.02, -.05, 0, "YXZ"));
var MOOHAN_CAMERA_POSE_IN_RIGHT_CAMERA_SCALE = new Vector3(1, 1, 1);
new Matrix4().compose(MOOHAN_CAMERA_POSE_IN_RIGHT_CAMERA_POSITION, MOOHAN_CAMERA_POSE_IN_RIGHT_CAMERA_ROTATION, MOOHAN_CAMERA_POSE_IN_RIGHT_CAMERA_SCALE);
function getMoohanCameraPose(_camera, xrCameras, target) {
	target.compose(MOOHAN_CAMERA_POSE_IN_RIGHT_CAMERA_POSITION, MOOHAN_CAMERA_POSE_IN_RIGHT_CAMERA_ROTATION, MOOHAN_CAMERA_POSE_IN_RIGHT_CAMERA_SCALE);
	target.premultiply(xrCameras.cameras[1].matrixWorld);
}
var QUEST_3_PROJECTION_MATRIX = intrinsicsToProjectionMatrix([
	800,
	0,
	640,
	0,
	800,
	360,
	0,
	0,
	1
], 1280, 720, .1, 1e3, new Matrix4());
var QUEST_3_CAMERA_POSE_IN_RIGHT_CAMERA_POSITION = new Vector3(-.032, .02, -.025);
var QUEST_3_CAMERA_POSE_IN_RIGHT_CAMERA_ROTATION = new Quaternion().setFromEuler(new Euler(-.26, 0, 0, "YXZ"));
var QUEST_3_CAMERA_POSE_IN_RIGHT_CAMERA_SCALE = new Vector3(1, 1, 1);
var QUEST_3_CAMERA_POSE_IN_RIGHT_CAMERA = new Matrix4().compose(QUEST_3_CAMERA_POSE_IN_RIGHT_CAMERA_POSITION, QUEST_3_CAMERA_POSE_IN_RIGHT_CAMERA_ROTATION, QUEST_3_CAMERA_POSE_IN_RIGHT_CAMERA_SCALE);
function getQuestCameraPose(_camera, xrCameras, target) {
	target.copy(QUEST_3_CAMERA_POSE_IN_RIGHT_CAMERA);
	target.premultiply(xrCameras.cameras[1].matrixWorld);
}
var DEVICE_CAMERA_PARAMETERS = {
	galaxyxr: {
		projectionMatrix: MOOHAN_PROJECTION_MATRIX,
		getCameraPose: getMoohanCameraPose
	},
	quest3: {
		projectionMatrix: QUEST_3_PROJECTION_MATRIX,
		getCameraPose: getQuestCameraPose
	}
};
/**
* The {@link DEVICE_CAMERA_PARAMETERS} profile for the running browser:
* `'quest3'` in the Meta Quest browser, `'galaxyxr'` otherwise. The two
* profiles share intrinsics but not the camera-to-eye extrinsics (the Quest
* camera is pitched ~15° down), so every consumer of the device-camera pose
* must resolve the same profile.
* @param userAgent - Defaults to `navigator.userAgent` when available.
*/
function detectDeviceCameraTarget(userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "") {
	return /OculusBrowser|Quest/i.test(userAgent) ? "quest3" : "galaxyxr";
}
function getDeviceCameraClipFromView(renderCamera, deviceCamera, targetDevice) {
	if (deviceCamera.simulatorCamera) {
		const simulatorCamera = new PerspectiveCamera();
		const originalAspect = renderCamera.aspect;
		if (originalAspect > 1) simulatorCamera.fov = renderCamera.fov;
		else {
			const vFovRad = MathUtils.degToRad(renderCamera.fov);
			const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * originalAspect);
			simulatorCamera.fov = MathUtils.radToDeg(hFovRad);
		}
		simulatorCamera.aspect = 1;
		simulatorCamera.near = renderCamera.near;
		simulatorCamera.far = renderCamera.far;
		simulatorCamera.updateProjectionMatrix();
		return simulatorCamera.projectionMatrix;
	} else return DEVICE_CAMERA_PARAMETERS[targetDevice].projectionMatrix;
}
function getDeviceCameraWorldFromView(renderCamera, xrCameras, deviceCamera, targetDevice) {
	if (deviceCamera?.simulatorCamera) return renderCamera.matrixWorld.clone();
	else if (xrCameras && xrCameras.cameras.length > 0) {
		const target = new Matrix4();
		DEVICE_CAMERA_PARAMETERS[targetDevice].getCameraPose(renderCamera, xrCameras, target);
		return target;
	}
	throw new Error("No XR cameras available");
}
function getDeviceCameraWorldFromClip(renderCamera, xrCameras, deviceCamera, targetDevice) {
	const projectionMatrix = getDeviceCameraClipFromView(renderCamera, deviceCamera, targetDevice);
	const viewMatrix = getDeviceCameraWorldFromView(renderCamera, xrCameras, deviceCamera, targetDevice).invert();
	return new Matrix4().multiplyMatrices(projectionMatrix, viewMatrix).invert();
}
var DEVICE_CAMERA_READY_GRACE_MS = 5e3;
var deviceCameraUnavailableSinceMs = null;
var warnedDeviceCameraUnavailable = false;
/**
* Whether a device-camera pose can currently be resolved. This is false during
* the brief startup window before either the simulator camera is registered or
* the WebXR session exposes its cameras. While false, camera parameters are
* genuinely unavailable, and camera-dependent work should be skipped rather
* than run against a camera that does not exist yet.
*
* @param deviceCamera - The device camera, if configured.
* @param xrCameras - The WebXR array camera, or null outside an XR session.
* @returns True once a camera pose can be resolved.
*/
function isDeviceCameraPoseAvailable(deviceCamera, xrCameras) {
	return !!(deviceCamera?.simulatorCamera || xrCameras && xrCameras.cameras.length > 0);
}
/**
* Builds a snapshot of the device camera's view/projection matrices, or returns
* `null` while no camera pose is available yet (see
* {@link isDeviceCameraPoseAvailable}). Returning `null` lets per-frame callers
* skip cleanly during startup instead of throwing on every frame until a
* camera appears.
*/
function getCameraParametersSnapshot(camera, xrCameras, deviceCamera, targetDevice) {
	if (!isDeviceCameraPoseAvailable(deviceCamera, xrCameras)) {
		const now = typeof performance !== "undefined" ? performance.now() : Date.now();
		if (deviceCameraUnavailableSinceMs === null) deviceCameraUnavailableSinceMs = now;
		else if (!warnedDeviceCameraUnavailable && now - deviceCameraUnavailableSinceMs > DEVICE_CAMERA_READY_GRACE_MS) {
			warnedDeviceCameraUnavailable = true;
			console.warn(`[xrblocks] Device camera is still unavailable after ${DEVICE_CAMERA_READY_GRACE_MS} ms; camera-dependent detection is being skipped. Check that the camera is permitted and that a session or simulator is running.`);
		}
		return null;
	}
	deviceCameraUnavailableSinceMs = null;
	const clipFromView = getDeviceCameraClipFromView(camera, deviceCamera, targetDevice);
	if (!clipFromView) throw new Error("Could not get clip from view");
	return {
		clipFromView,
		viewFromClip: clipFromView.clone().invert(),
		worldFromClip: getDeviceCameraWorldFromClip(camera, xrCameras, deviceCamera, targetDevice),
		worldFromView: getDeviceCameraWorldFromView(camera, xrCameras, deviceCamera, targetDevice)
	};
}
/**
* Raycasts to the depth mesh to find the world position and normal at a given UV coordinate.
* @param rgbUv - The UV coordinate to raycast from.
* @param depthMeshSnapshot - The depth mesh to raycast against.
* @param cameraParametersSnapshot - Parameters of the device camera relative to the render camera's world.
* @returns The world position, normal, and depth at the given UV coordinate.
*/
function transformRgbUvToWorld(rgbUv, depthMeshSnapshot, cameraParametersSnapshot) {
	const origin = new Vector3().applyMatrix4(cameraParametersSnapshot.worldFromView);
	const direction = new Vector3(2 * rgbUv.x - 1, 2 * (1 - rgbUv.y) - 1, -1).applyMatrix4(cameraParametersSnapshot.worldFromClip).sub(origin).normalize();
	const intersections = new Raycaster(origin, direction).intersectObject(depthMeshSnapshot);
	if (intersections.length === 0) {
		console.warn("No intersections found for UV:", rgbUv);
		return null;
	}
	const intersection = intersections[0];
	return {
		worldPosition: intersection.point,
		worldNormal: intersection.face.normal.clone().applyQuaternion(depthMeshSnapshot.quaternion),
		depthInMeters: intersection.distance
	};
}
/**
* Helper function to prepare a canvas for the bounding box for rendering purposes.
* Calculates the clamped bounding box and returns the canvas, context, and dimensions.
*/
function createBoundingBoxCanvasResult(width, height, boundingBox) {
	const unitBox = new Box2(new Vector2(0, 0), new Vector2(1, 1));
	const clampedBox = boundingBox.clone().intersect(unitBox);
	const cropSize = new Vector2();
	clampedBox.getSize(cropSize);
	if (cropSize.x === 0 || cropSize.y === 0) return null;
	const sourceX = Math.floor(width * clampedBox.min.x);
	const sourceY = Math.floor(height * clampedBox.min.y);
	const sourceWidth = Math.ceil(width * cropSize.x);
	const sourceHeight = Math.ceil(height * cropSize.y);
	const canvas = document.createElement("canvas");
	canvas.width = sourceWidth;
	canvas.height = sourceHeight;
	return {
		canvas,
		ctx: canvas.getContext("2d"),
		sourceX,
		sourceY,
		sourceWidth,
		sourceHeight
	};
}
/**
* Asynchronously crops an image (provided as a base64 string or ImageData) using a THREE.Box2 bounding box.
* This function draws a specified portion of the image to a canvas and returns the canvas content as a new base64 string.
* @param imageSource - The source image as a base64 string or ImageData object.
* @param boundingBox - The bounding box with relative coordinates (0-1) for cropping.
* @returns A promise that resolves with the base64 string of the cropped image.
*/
async function cropImage(imageSource, boundingBox) {
	if (!imageSource) throw new Error("No image data provided for cropping.");
	let width;
	let height;
	let drawOp;
	if (typeof imageSource === "string") {
		const img = new Image();
		await new Promise((resolve, reject) => {
			img.onload = resolve;
			img.onerror = (err) => {
				console.error("Error loading image for cropping:", err);
				reject(/* @__PURE__ */ new Error("Failed to load image for cropping."));
			};
			img.src = imageSource.startsWith("data:image") ? imageSource : `data:image/png;base64,${imageSource}`;
		});
		width = img.width;
		height = img.height;
		drawOp = (ctx, canvasResult) => {
			ctx.drawImage(img, canvasResult.sourceX, canvasResult.sourceY, canvasResult.sourceWidth, canvasResult.sourceHeight, 0, 0, canvasResult.sourceWidth, canvasResult.sourceHeight);
		};
	} else if (imageSource instanceof ImageData) {
		width = imageSource.width;
		height = imageSource.height;
		drawOp = (ctx, canvasResult) => {
			ctx.putImageData(imageSource, -canvasResult.sourceX, -canvasResult.sourceY, canvasResult.sourceX, canvasResult.sourceY, canvasResult.sourceWidth, canvasResult.sourceHeight);
		};
	} else {
		console.warn("Unsupported image source type for cropping.");
		return "data:image/png;base64,";
	}
	const canvasResult = createBoundingBoxCanvasResult(width, height, boundingBox);
	if (!canvasResult) {
		console.warn("Unable to create CanvasResult for cropping.");
		return "data:image/png;base64,";
	}
	drawOp(canvasResult.ctx, canvasResult);
	return canvasResult.canvas.toDataURL("image/png");
}
/**
* Enum for video stream states.
*/
var StreamState = /* @__PURE__ */ function(StreamState) {
	StreamState["IDLE"] = "idle";
	StreamState["INITIALIZING"] = "initializing";
	StreamState["STREAMING"] = "streaming";
	StreamState["ERROR"] = "error";
	StreamState["NO_DEVICES_FOUND"] = "no_devices_found";
	return StreamState;
}({});
function blobToBase64(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result);
		reader.readAsDataURL(blob);
		reader.onerror = () => reject(reader.error);
	});
}
/**
* The base class for handling video streams (from camera or file), managing
* the underlying <video> element, streaming state, and snapshot logic.
*/
var VideoStream = class extends Script {
	get video() {
		return this.video_;
	}
	/**
	* @param options - The configuration options.
	*/
	constructor({ willCaptureFrequently = false } = {}) {
		super();
		this.loaded = false;
		this.state = "idle";
		this.stream_ = null;
		this.video_ = document.createElement("video");
		this.frozenTexture_ = null;
		this.canvas_ = null;
		this.context_ = null;
		this.willCaptureFrequently_ = willCaptureFrequently;
		this.video_.autoplay = true;
		this.video_.muted = true;
		this.video_.playsInline = true;
		this.texture = new VideoTexture(this.video_);
		this.texture.colorSpace = SRGBColorSpace;
		this.texture.minFilter = LinearFilter;
		this.texture.magFilter = LinearFilter;
		const texture = this.texture;
		const videoEl = this.video_;
		texture.update = function() {
			if (videoEl.readyState >= videoEl.HAVE_CURRENT_DATA) texture.needsUpdate = true;
		};
	}
	/**
	* Sets the stream's state and dispatches a 'statechange' event.
	* @param state - The new state.
	* @param details - Additional data for the event payload.
	*/
	setState_(state, details = {}) {
		if (this.state === state && !details.force) return;
		this.state = state;
		this.dispatchEvent({
			type: "statechange",
			state: this.state,
			...details
		});
		console.debug(`VideoStream state changed to ${state} with details:`, details);
	}
	/**
	* Processes video metadata, sets dimensions, and resolves a promise.
	* @param resolve - The resolve function of the wrapping Promise.
	* @param reject - The reject function of the wrapping Promise.
	* @param allowRetry - Whether to allow a retry attempt on failure.
	*/
	handleVideoStreamLoadedMetadata(resolve, reject, allowRetry = false) {
		try {
			if (this.video_.videoWidth > 0 && this.video_.videoHeight > 0) {
				this.width = this.video_.videoWidth;
				this.height = this.video_.videoHeight;
				this.aspectRatio = this.width / this.height;
				this.loaded = true;
				resolve();
			} else if (allowRetry) setTimeout(() => {
				this.handleVideoStreamLoadedMetadata(resolve, reject, false);
			}, 500);
			else {
				const error = /* @__PURE__ */ new Error("Failed to get valid video dimensions.");
				this.setState_("error", { error });
				reject(error);
			}
		} catch (error) {
			if (error instanceof Error) {
				this.setState_("error", { error });
				reject(error);
			}
		}
	}
	/**
	* Waits for the next new video frame before returning, so a subsequent
	* {@link getSnapshot} reads fresh pixels instead of whatever (possibly
	* stale) frame the `<video>` element currently holds. Hidden or
	* non-composited video elements — the normal situation inside an immersive
	* XR session — can be throttled by the browser, in which case the held
	* frame may be arbitrarily old.
	*
	* Resolves with the frame's metadata (whose `captureTime`, when present,
	* dates the pixels in the `performance.now()` timebase), or `null` when the
	* signal is unavailable (`requestVideoFrameCallback` unsupported, no active
	* media stream) or no frame arrived within `timeoutMs`.
	*/
	waitForFreshFrame(timeoutMs = 400) {
		const video = this.video_;
		if (!this.loaded || !video.requestVideoFrameCallback || !video.srcObject) return Promise.resolve(null);
		return new Promise((resolve) => {
			let done = false;
			const handle = video.requestVideoFrameCallback((_now, metadata) => {
				if (done) return;
				done = true;
				clearTimeout(timer);
				resolve(metadata);
			});
			const timer = setTimeout(() => {
				if (done) return;
				done = true;
				video.cancelVideoFrameCallback?.(handle);
				resolve(null);
			}, timeoutMs);
		});
	}
	/**
	* Whether the current snapshot source has pixels available.
	* Subclasses may override this to provide non-video sources while preserving
	* {@link getSnapshot}'s format handling.
	*/
	snapshotSourceAvailable_() {
		return this.video_.readyState >= this.video_.HAVE_CURRENT_DATA;
	}
	/**
	* Draws the current snapshot source into `context` at the requested size.
	* Subclasses may override this to provide pixels from another source.
	*/
	drawSnapshotSource_(context, width, height) {
		context.drawImage(this.video_, 0, 0, width, height);
	}
	getSnapshot({ width = this.width, height = this.height, outputFormat = "texture", ...rest } = {}) {
		if (!this.loaded || !width || !height || !this.snapshotSourceAvailable_()) return null;
		if (width > this.width || height > this.height) console.warn(`The requested snapshot width (${width}px x ${height}px) is larger than the source video width (${this.width}px x ${this.height}px). The snapshot will be upscaled.`);
		const mimeType = ("mimeType" in rest ? rest.mimeType : void 0) ?? "image/jpeg";
		const quality = ("quality" in rest ? rest.quality : void 0) ?? .9;
		try {
			if (!this.canvas_ || this.canvas_.width !== width || this.canvas_.height !== height) {
				this.canvas_ = document.createElement("canvas");
				this.canvas_.width = width;
				this.canvas_.height = height;
				this.context_ = this.canvas_.getContext("2d", { willReadFrequently: this.willCaptureFrequently_ });
			}
			this.drawSnapshotSource_(this.context_, width, height);
			switch (outputFormat) {
				case "imageData": return this.context_.getImageData(0, 0, width, height);
				case "base64": return new Promise((resolve) => this.canvas_.toBlob(resolve, mimeType, quality)).then(async (blob) => blob ? await blobToBase64(blob) : null);
				case "blob": return new Promise((resolve) => this.canvas_.toBlob(resolve, mimeType, quality));
				default: {
					const frozenTexture = new Texture(this.canvas_);
					frozenTexture.needsUpdate = true;
					frozenTexture.colorSpace = SRGBColorSpace;
					this.frozenTexture_ = frozenTexture;
					return this.frozenTexture_;
				}
			}
		} catch (error) {
			console.error("Error capturing snapshot:", error);
			return null;
		}
	}
	/**
	* Stops the current video stream tracks.
	*/
	stop_() {
		if (this.stream_) {
			this.stream_.getTracks().forEach((track) => track.stop());
			this.stream_ = null;
		}
		if (this.video_.srcObject) this.video_.srcObject = null;
		if (this.video_.src && this.video_.src.startsWith("blob:")) URL.revokeObjectURL(this.video_.src);
		this.video_.src = "";
		this.loaded = false;
		this.setState_("idle");
	}
	/**
	* Disposes of all resources used by this stream.
	*/
	dispose() {
		this.stop_();
		this.texture?.dispose();
		this.frozenTexture_?.dispose();
		this.canvas_ = null;
		this.context_ = null;
		super.dispose();
	}
};
/** Flips RGBA pixels read from WebGL's bottom-left origin into top-left image order. */
function flipWebGLPixelRows(source, width, height) {
	const rowBytes = width * 4;
	const target = new Uint8ClampedArray(source.length);
	for (let y = 0; y < height; y++) {
		const sourceStart = (height - 1 - y) * rowBytes;
		const targetStart = y * rowBytes;
		target.set(source.subarray(sourceStart, sourceStart + rowBytes), targetStart);
	}
	return target;
}
/**
* Handles video capture from a device camera, manages the device list,
* and reports its state using VideoStream's event model.
*/
var XRDeviceCamera = class XRDeviceCamera extends VideoStream {
	static {
		this.XR_CAMERA_ACCESS_TIMEOUT_MS = 5e3;
	}
	/**
	* @param options - The configuration options.
	*/
	constructor(options) {
		super({ willCaptureFrequently: options.willCaptureFrequently ?? false });
		this.options = options;
		this.isInitializing_ = false;
		this.availableDevices_ = [];
		this.currentDeviceIndex_ = -1;
		this.useXRCameraAccess_ = false;
		this.xrCameraSnapshotImageData_ = null;
		this.xrCameraSnapshotCanvas_ = null;
		this.xrCameraSnapshotContext_ = null;
		this.pendingXRCameraCaptures_ = [];
		this.xrCameraAccessTimeout_ = null;
		this.disposed_ = false;
		this.mediaTexture_ = this.texture;
		this.videoConstraints_ = options.videoConstraints ?? { facingMode: "environment" };
		this.rgbToDepthParams = options.rgbToDepthParams ?? DEFAULT_RGB_TO_DEPTH_PARAMS;
	}
	/**
	* Retrieves the list of available video input devices.
	* @returns A promise that resolves with an
	* array of video devices.
	*/
	async getAvailableVideoDevices() {
		if (!navigator.mediaDevices?.enumerateDevices) {
			console.warn("navigator.mediaDevices.enumerateDevices() is not supported.");
			return [];
		}
		const devices = [...await navigator.mediaDevices.enumerateDevices()];
		if (this.simulatorCamera) {
			const simulatorDevices = await this.simulatorCamera.enumerateDevices();
			devices.push(...simulatorDevices);
		}
		return devices.filter((device) => device.kind === "videoinput");
	}
	/**
	* Sets the renderer reference, needed for WebXR camera access fallback.
	*/
	setRenderer(renderer) {
		this.renderer_ = renderer;
	}
	/**
	* Initializes the camera based on the initial constraints.
	*/
	async init() {
		if (this.disposed_) return;
		this.useXRCameraAccess_ = false;
		this.disposeXRCameraAccessResources_();
		this.clearXRCameraAccessTimeout_();
		this.setState_("initializing");
		try {
			this.availableDevices_ = await this.getAvailableVideoDevices();
			if (this.disposed_) return;
			if (this.availableDevices_.length > 0) await this.initStream_();
			else if (this.renderer_) {
				this.startXRCameraAccessFallback_("No video devices found.");
				return;
			} else {
				this.setState_("no_devices_found");
				console.warn("No video devices found.");
			}
		} catch (error) {
			if (this.renderer_) {
				this.startXRCameraAccessFallback_("Camera initialization failed.", error);
				return;
			}
			this.setState_("error", { error });
			console.error("Error initializing XRDeviceCamera:", error);
			throw error;
		}
	}
	getDeviceIdFromLabel(label) {
		return this.availableDevices_.find((x) => x.label == label)?.deviceId ?? null;
	}
	/**
	* Initializes the media stream from the user's camera. After the stream
	* starts, it updates the current device index based on the stream's active
	* track.
	*/
	async initStream_() {
		if (this.isInitializing_ || this.disposed_) return;
		this.isInitializing_ = true;
		this.setState_("initializing");
		this.currentTrackSettings_ = void 0;
		this.currentDeviceIndex_ = -1;
		try {
			console.debug("Requesting media stream with constraints:", this.videoConstraints_);
			let stream = null;
			const deviceIdConstraint = this.videoConstraints_.deviceId;
			let targetDeviceId = typeof deviceIdConstraint === "string" ? deviceIdConstraint : Array.isArray(deviceIdConstraint) ? deviceIdConstraint[0] : deviceIdConstraint?.exact;
			const useSimulatorCamera = !!this.simulatorCamera && (targetDeviceId && this.availableDevices_.find((d) => d.deviceId === targetDeviceId)?.groupId === "simulator" || !targetDeviceId && this.videoConstraints_.facingMode === "environment");
			const targetDeviceIdFromLabel = this.options.cameraLabel ? this.getDeviceIdFromLabel(this.options.cameraLabel) : null;
			if (!this.videoConstraints_.deviceId && targetDeviceIdFromLabel) {
				this.videoConstraints_ = {
					deviceId: targetDeviceIdFromLabel,
					...this.videoConstraints_
				};
				targetDeviceId = targetDeviceIdFromLabel;
			}
			if (useSimulatorCamera) {
				stream = this.simulatorCamera.getMedia(this.videoConstraints_);
				if (!stream) throw new Error("Simulator camera failed to provide a media stream.");
			} else {
				const constraints = { ...this.videoConstraints_ };
				if (targetDeviceId === "") delete constraints.deviceId;
				stream = await navigator.mediaDevices.getUserMedia({ video: constraints });
				if (this.disposed_) {
					for (const track of stream.getTracks()) track.stop();
					return;
				}
				this.availableDevices_ = await this.getAvailableVideoDevices();
			}
			if (this.disposed_) {
				for (const track of stream?.getTracks() ?? []) track.stop();
				return;
			}
			const videoTracks = stream?.getVideoTracks() || [];
			if (!videoTracks.length) throw new Error("MediaStream has no video tracks.");
			const activeTrack = videoTracks[0];
			this.currentTrackSettings_ = activeTrack.getSettings();
			console.debug("Active track settings:", this.currentTrackSettings_);
			if (this.currentTrackSettings_.deviceId) {
				this.currentDeviceIndex_ = this.availableDevices_.findIndex((device) => device.deviceId === this.currentTrackSettings_.deviceId);
				if (targetDeviceId === "") this.videoConstraints_.deviceId = { exact: this.currentTrackSettings_.deviceId };
			} else console.warn("Stream started without deviceId as it was unavailable");
			this.video_.onerror = null;
			this.video_.onloadedmetadata = null;
			this.stop_();
			this.stream_ = stream;
			this.video_.srcObject = stream;
			await new Promise((resolve, reject) => {
				this.video_.onloadedmetadata = () => {
					this.handleVideoStreamLoadedMetadata(resolve, reject, true);
				};
				this.video_.play().catch((playError) => {
					console.warn("video.play() rejected (may still autoplay):", playError);
				});
			});
			if (this.disposed_) {
				this.stop_();
				return;
			}
			const details = {
				width: this.width,
				height: this.height,
				aspectRatio: this.aspectRatio,
				device: this.getCurrentDevice(),
				facingMode: this.currentTrackSettings_.facingMode,
				trackSettings: this.currentTrackSettings_
			};
			this.setState_("streaming", details);
		} finally {
			this.isInitializing_ = false;
		}
	}
	/**
	* Sets the active camera by its device ID. Removes potentially conflicting
	* constraints such as facingMode.
	* @param deviceId - Device ID
	*/
	async setDeviceId(deviceId) {
		const newIndex = this.availableDevices_.findIndex((device) => device.deviceId === deviceId);
		if (newIndex === -1) throw new Error(`Device with ID ${deviceId} not found.`);
		if (newIndex === this.currentDeviceIndex_) {
			console.log(`Device ${deviceId} is already active.`);
			return;
		}
		delete this.videoConstraints_.facingMode;
		this.videoConstraints_.deviceId = { exact: deviceId };
		await this.initStream_();
	}
	/**
	* Sets the active camera by its facing mode ('user' or 'environment').
	* @param facingMode - facing mode
	*/
	async setFacingMode(facingMode) {
		delete this.videoConstraints_.deviceId;
		this.videoConstraints_.facingMode = facingMode;
		this.currentDeviceIndex_ = -1;
		await this.initStream_();
	}
	/**
	* Gets the list of enumerated video devices.
	*/
	getAvailableDevices() {
		return this.availableDevices_;
	}
	/**
	* Gets the currently active device info, if available.
	*/
	getCurrentDevice() {
		if (this.currentDeviceIndex_ === -1 || !this.availableDevices_.length) return;
		return this.availableDevices_[this.currentDeviceIndex_];
	}
	/**
	* Gets the settings of the currently active video track.
	*/
	getCurrentTrackSettings() {
		return this.currentTrackSettings_;
	}
	/**
	* Gets the index of the currently active device.
	*/
	getCurrentDeviceIndex() {
		return this.currentDeviceIndex_;
	}
	/**
	* Whether the camera is using the WebXR Raw Camera Access API fallback.
	*/
	get isUsingXRCameraAccess() {
		return this.useXRCameraAccess_;
	}
	captureSnapshot(options = {}) {
		if (!this.useXRCameraAccess_) return Promise.resolve(this.getSnapshot(options));
		if (!this.renderer_) return Promise.resolve(null);
		return new Promise((resolve) => {
			const request = {
				options,
				resolve,
				timeout: setTimeout(() => {
					const index = this.pendingXRCameraCaptures_.indexOf(request);
					if (index !== -1) {
						this.pendingXRCameraCaptures_.splice(index, 1);
						resolve(null);
					}
				}, 1e3)
			};
			this.pendingXRCameraCaptures_.push(request);
		});
	}
	snapshotSourceAvailable_() {
		if (this.useXRCameraAccess_) return this.xrCameraSnapshotImageData_ !== null;
		return super.snapshotSourceAvailable_();
	}
	drawSnapshotSource_(context, width, height) {
		if (!this.useXRCameraAccess_) {
			super.drawSnapshotSource_(context, width, height);
			return;
		}
		const imageData = this.xrCameraSnapshotImageData_;
		if (!imageData) return;
		if (width === imageData.width && height === imageData.height) {
			context.putImageData(imageData, 0, 0);
			return;
		}
		const canvas = this.snapshotCanvasForImageData_(imageData);
		if (canvas) context.drawImage(canvas, 0, 0, width, height);
	}
	/**
	* Updates the camera texture from the WebXR Raw Camera Access API.
	* Must be called each frame from the render loop when in XR camera mode.
	*/
	updateXRCamera(frame) {
		if (!this.useXRCameraAccess_ || !this.renderer_ || !frame) return;
		assertWebGLRenderer(this.renderer_, "XRDeviceCamera.updateXRCamera");
		const binding = this.renderer_.xr.getBinding();
		const refSpace = this.renderer_.xr.getReferenceSpace();
		if (!binding || !refSpace) return;
		const pose = frame.getViewerPose(refSpace);
		if (!pose) return;
		for (const view of pose.views) {
			const xrCamera = view.camera;
			if (!xrCamera) continue;
			const glTexture = binding.getCameraImage?.(xrCamera);
			if (!glTexture) continue;
			if (!this.xrCameraTexture_) {
				this.xrCameraTexture_ = new ExternalTexture(glTexture);
				this.xrCameraTexture_.minFilter = LinearFilter;
				this.xrCameraTexture_.magFilter = LinearFilter;
				this.xrCameraTexture_.colorSpace = SRGBColorSpace;
				this.xrCameraTexture_.generateMipmaps = false;
			} else this.xrCameraTexture_.sourceTexture = glTexture;
			this.width = xrCamera.width;
			this.height = xrCamera.height;
			this.aspectRatio = this.width / this.height;
			const texProperties = this.renderer_.properties.get(this.xrCameraTexture_);
			texProperties.__webglTexture = glTexture;
			texProperties.__version = 1;
			this.texture = this.xrCameraTexture_;
			if (!this.loaded) {
				this.clearXRCameraAccessTimeout_();
				this.loaded = true;
				this.setState_("streaming", {
					force: true,
					width: this.width,
					height: this.height,
					aspectRatio: this.aspectRatio
				});
			}
			this.processPendingXRCameraCapture_();
			break;
		}
	}
	registerSimulatorCamera(simulatorCamera) {
		this.simulatorCamera = simulatorCamera;
	}
	dispose() {
		this.disposed_ = true;
		this.clearXRCameraAccessTimeout_();
		this.disposeXRCameraAccessResources_();
		this.renderer_ = void 0;
		this.simulatorCamera = void 0;
		this.useXRCameraAccess_ = false;
		super.dispose();
	}
	processPendingXRCameraCapture_() {
		if (!this.pendingXRCameraCaptures_.length) return;
		const requests = this.pendingXRCameraCaptures_.splice(0);
		for (const request of requests) clearTimeout(request.timeout);
		try {
			this.xrCameraSnapshotImageData_ = this.captureXRCameraSnapshot_();
			for (const request of requests) {
				const result = this.getSnapshot(request.options);
				request.resolve(result);
			}
		} catch (error) {
			console.error("Error capturing WebXR camera snapshot:", error);
			for (const request of requests) request.resolve(null);
		}
	}
	captureXRCameraSnapshot_() {
		if (!this.renderer_ || !this.xrCameraTexture_ || !this.width || !this.height) return null;
		assertWebGLRenderer(this.renderer_, "XRDeviceCamera.captureSnapshot");
		this.ensureXRCameraCopyObjects_();
		this.ensureXRCameraRenderTarget_();
		if (!this.xrCameraRenderTarget_) return null;
		if (this.xrCameraCopyMaterial_.map !== this.xrCameraTexture_) {
			this.xrCameraCopyMaterial_.map = this.xrCameraTexture_;
			this.xrCameraCopyMaterial_.needsUpdate = true;
		}
		const previousTarget = this.renderer_.getRenderTarget();
		const previousXrEnabled = this.renderer_.xr.enabled;
		this.renderer_.xr.enabled = false;
		try {
			this.renderer_.setRenderTarget(this.xrCameraRenderTarget_);
			this.renderer_.render(this.xrCameraCopyScene_, this.xrCameraCopyCamera_);
		} finally {
			this.renderer_.setRenderTarget(previousTarget);
			this.renderer_.xr.enabled = previousXrEnabled;
		}
		const width = this.xrCameraRenderTarget_.width;
		const height = this.xrCameraRenderTarget_.height;
		const pixels = new Uint8Array(width * height * 4);
		this.renderer_.readRenderTargetPixels(this.xrCameraRenderTarget_, 0, 0, width, height, pixels);
		return new ImageData(flipWebGLPixelRows(pixels, width, height), width, height);
	}
	ensureXRCameraRenderTarget_() {
		if (this.xrCameraRenderTarget_ && this.xrCameraRenderTarget_.width === this.width && this.xrCameraRenderTarget_.height === this.height) return;
		this.xrCameraRenderTarget_?.dispose();
		this.xrCameraRenderTarget_ = new WebGLRenderTarget(this.width, this.height, {
			format: RGBAFormat,
			type: UnsignedByteType,
			depthBuffer: false,
			stencilBuffer: false
		});
		this.xrCameraRenderTarget_.texture.colorSpace = SRGBColorSpace;
	}
	ensureXRCameraCopyObjects_() {
		if (this.xrCameraCopyScene_) return;
		this.xrCameraCopyScene_ = new Scene();
		this.xrCameraCopyCamera_ = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
		this.xrCameraCopyMaterial_ = new MeshBasicMaterial({
			depthTest: false,
			depthWrite: false,
			toneMapped: false
		});
		const quad = new Mesh(new PlaneGeometry(2, 2), this.xrCameraCopyMaterial_);
		this.xrCameraCopyScene_.add(quad);
	}
	snapshotCanvasForImageData_(imageData) {
		if (!this.xrCameraSnapshotCanvas_ || this.xrCameraSnapshotCanvas_.width !== imageData.width || this.xrCameraSnapshotCanvas_.height !== imageData.height) {
			this.xrCameraSnapshotCanvas_ = document.createElement("canvas");
			this.xrCameraSnapshotCanvas_.width = imageData.width;
			this.xrCameraSnapshotCanvas_.height = imageData.height;
			this.xrCameraSnapshotContext_ = this.xrCameraSnapshotCanvas_.getContext("2d");
		}
		if (!this.xrCameraSnapshotContext_) return null;
		this.xrCameraSnapshotContext_.putImageData(imageData, 0, 0);
		return this.xrCameraSnapshotCanvas_;
	}
	resolvePendingXRCameraCaptures_(value) {
		const requests = this.pendingXRCameraCaptures_.splice(0);
		for (const request of requests) {
			clearTimeout(request.timeout);
			request.resolve(value);
		}
	}
	disposeXRCameraAccessResources_() {
		this.resolvePendingXRCameraCaptures_(null);
		this.xrCameraSnapshotImageData_ = null;
		if (this.texture === this.xrCameraTexture_) this.texture = this.mediaTexture_;
		this.xrCameraTexture_?.dispose();
		this.xrCameraTexture_ = void 0;
		this.xrCameraRenderTarget_?.dispose();
		this.xrCameraRenderTarget_ = void 0;
		if (this.xrCameraCopyMaterial_) {
			this.xrCameraCopyMaterial_.map = null;
			this.xrCameraCopyMaterial_.dispose();
		}
		this.xrCameraCopyMaterial_ = void 0;
		this.xrCameraCopyScene_?.traverse((object) => {
			if (object instanceof Mesh) object.geometry.dispose();
		});
		this.xrCameraCopyScene_ = void 0;
		this.xrCameraCopyCamera_ = void 0;
		this.xrCameraSnapshotCanvas_ = null;
		this.xrCameraSnapshotContext_ = null;
	}
	onXRSessionEnded() {
		if (!this.useXRCameraAccess_) return;
		this.useXRCameraAccess_ = false;
		this.loaded = false;
		this.disposeXRCameraAccessResources_();
		this.setState_("idle");
	}
	startXRCameraAccessFallback_(reason, error) {
		if (this.disposed_) return;
		if (!this.isXRCameraAccessGranted_()) {
			this.useXRCameraAccess_ = false;
			this.loaded = false;
			this.setState_("no_devices_found", { force: true });
			console.warn(`${reason} WebXR Raw Camera Access API is not available in this session.`, error);
			return;
		}
		console.warn(`${reason} Falling back to WebXR Raw Camera Access API.`, error);
		this.useXRCameraAccess_ = true;
		this.loaded = false;
		this.setState_("initializing", { force: true });
		this.clearXRCameraAccessTimeout_();
		this.xrCameraAccessTimeout_ = setTimeout(() => {
			if (this.disposed_ || !this.useXRCameraAccess_ || this.loaded) return;
			this.useXRCameraAccess_ = false;
			this.setState_("no_devices_found", { force: true });
			console.warn("WebXR Raw Camera Access API did not provide frames in time.");
		}, XRDeviceCamera.XR_CAMERA_ACCESS_TIMEOUT_MS);
	}
	isXRCameraAccessGranted_() {
		if (this.renderer_ && isWebGPURenderer(this.renderer_)) return false;
		const session = this.renderer_?.xr.getSession();
		if (!session) return true;
		if (!("enabledFeatures" in session) || !session.enabledFeatures) return true;
		return session.enabledFeatures.includes("camera-access");
	}
	clearXRCameraAccessTimeout_() {
		if (!this.xrCameraAccessTimeout_) return;
		clearTimeout(this.xrCameraAccessTimeout_);
		this.xrCameraAccessTimeout_ = null;
	}
};
var SceneDerivedContextOptions = class {
	constructor(options) {
		this.enabled = false;
		if (options) deepMerge(this, options);
	}
	enable() {
		this.enabled = true;
		return this;
	}
};
var SceneVisibilityOptions = class extends SceneDerivedContextOptions {
	constructor(..._args) {
		super(..._args);
		this.occlusionOpacityThreshold = 0;
	}
};
var SceneSetOfMarkOptions = class extends SceneDerivedContextOptions {};
var SceneOptions = class {
	constructor(options) {
		this.enabled = false;
		this.pollingIntervalMs = 3e3;
		this.visibleObjects = new SceneVisibilityOptions();
		this.som = new SceneSetOfMarkOptions();
		if (options) deepMerge(this, options);
	}
	enable() {
		this.enabled = true;
		return this;
	}
	enableVisibleObjects() {
		this.enabled = true;
		this.visibleObjects.enable();
		return this;
	}
	enableSetOfMark() {
		this.enabled = true;
		this.som.enable();
		return this;
	}
};
var ContextOptions = class {
	constructor(options) {
		this.debugging = false;
		this.enabled = false;
		this.scene = new SceneOptions();
		if (options) deepMerge(this, options);
	}
	enable() {
		this.enabled = true;
		this.scene.enable();
		this.scene.enableVisibleObjects();
		this.scene.enableSetOfMark();
		return this;
	}
	enableScene() {
		this.enabled = true;
		this.scene.enable();
		return this;
	}
	enableVisibleObjects() {
		this.enabled = true;
		this.scene.enableVisibleObjects();
		return this;
	}
	enableSetOfMark() {
		this.enabled = true;
		this.scene.enableSetOfMark();
		return this;
	}
};
var DepthMeshOptions = class {
	constructor() {
		this.enabled = false;
		this.updateVertexNormals = false;
		this.showDebugTexture = false;
		this.useDepthTexture = false;
		this.renderShadow = false;
		this.shadowOpacity = .25;
		this.patchHoles = false;
		this.patchHolesUpper = false;
		this.opacity = 1;
		this.useDualCollider = false;
		this.useDownsampledGeometry = true;
		this.updateFullResolutionGeometry = false;
		this.colliderUpdateFps = 5;
		this.depthMeshUpdateFps = 0;
		this.depthFullResolution = 160;
		this.ignoreEdgePixels = 3;
	}
};
var DepthOptions = class {
	constructor(options) {
		this.debugging = false;
		this.enabled = false;
		this.depthMesh = new DepthMeshOptions();
		this.depthTexture = {
			enabled: false,
			constantKernel: false,
			applyGaussianBlur: false,
			applyKawaseBlur: false
		};
		this.occlusion = {
			enabled: false,
			resolutionScale: .5
		};
		this.usagePreference = [];
		this.dataFormatPreference = ["float32", "luminance-alpha"];
		this.depthTypeRequest = ["raw"];
		this.matchDepthView = false;
		this.updateAllViews = false;
		deepMerge(this, options);
	}
};
var xrDepthMeshOptions = deepFreeze(new DepthOptions({
	enabled: true,
	depthMesh: {
		enabled: true,
		updateVertexNormals: false,
		showDebugTexture: false,
		useDepthTexture: false,
		renderShadow: false,
		shadowOpacity: .25,
		patchHoles: true,
		useDownsampledGeometry: true,
		updateFullResolutionGeometry: false,
		colliderUpdateFps: 5
	}
}));
var xrDepthMeshVisualizationOptions = deepFreeze(new DepthOptions({
	enabled: true,
	depthMesh: {
		enabled: true,
		updateVertexNormals: true,
		showDebugTexture: true,
		useDepthTexture: true,
		renderShadow: false,
		shadowOpacity: .25,
		patchHoles: true,
		opacity: .1,
		useDownsampledGeometry: true,
		updateFullResolutionGeometry: true,
		colliderUpdateFps: 5
	},
	depthTexture: {
		enabled: true,
		constantKernel: true,
		applyGaussianBlur: true,
		applyKawaseBlur: true
	}
}));
var xrDepthMeshPhysicsOptions = deepFreeze(new DepthOptions({
	enabled: true,
	depthMesh: {
		enabled: true,
		updateVertexNormals: false,
		showDebugTexture: false,
		useDepthTexture: false,
		renderShadow: true,
		shadowOpacity: .25,
		patchHoles: true,
		patchHolesUpper: true,
		useDualCollider: false,
		useDownsampledGeometry: true,
		updateFullResolutionGeometry: false,
		colliderUpdateFps: 5
	}
}));
var HandsOptions = class {
	constructor(options) {
		this.enabled = false;
		this.visualization = false;
		this.visualizeJoints = false;
		this.visualizeMeshes = false;
		this.debugging = false;
		deepMerge(this, options);
	}
	/**
	* Enables hands tracking.
	* @returns The instance for chaining.
	*/
	enableHands() {
		this.enabled = true;
		return this;
	}
	enableHandsVisualization() {
		this.enabled = true;
		this.visualization = true;
		return this;
	}
};
/**
* Options for WebXR composition layers.
*
* Off by default. Layers are an optional session feature and the layer types
* an app would want are newer than the SDK's baseline browser, so asking for
* them unconditionally would mean every app pays for a capability most do not
* use.
*/
var LayersOptions = class {
	constructor() {
		this.enabled = false;
		this.video = true;
	}
};
var FINGER_ORDER = [
	"index",
	"middle",
	"ring",
	"pinky"
];
var FINGER_PREFIX = {
	index: "index-finger",
	middle: "middle-finger",
	ring: "ring-finger",
	pinky: "pinky-finger"
};
var DIGIT_JOINTS = {
	thumb: [
		"thumb-metacarpal",
		"thumb-phalanx-proximal",
		"thumb-phalanx-distal",
		"thumb-tip"
	],
	index: [
		"index-finger-metacarpal",
		"index-finger-phalanx-proximal",
		"index-finger-phalanx-intermediate",
		"index-finger-phalanx-distal",
		"index-finger-tip"
	],
	middle: [
		"middle-finger-metacarpal",
		"middle-finger-phalanx-proximal",
		"middle-finger-phalanx-intermediate",
		"middle-finger-phalanx-distal",
		"middle-finger-tip"
	],
	ring: [
		"ring-finger-metacarpal",
		"ring-finger-phalanx-proximal",
		"ring-finger-phalanx-intermediate",
		"ring-finger-phalanx-distal",
		"ring-finger-tip"
	],
	pinky: [
		"pinky-finger-metacarpal",
		"pinky-finger-phalanx-proximal",
		"pinky-finger-phalanx-intermediate",
		"pinky-finger-phalanx-distal",
		"pinky-finger-tip"
	]
};
var EPSILON$2 = 1e-6;
function getFingerJoint(context, finger, suffix) {
	const prefix = FINGER_PREFIX[finger];
	return context.getJoint(`${prefix}-${suffix}`);
}
function estimateHandScale(context) {
	const wrist = context.getJoint("wrist");
	const middleTip = context.getJoint("middle-finger-tip");
	const palmWidth = getPalmWidth(context);
	const measurements = [];
	if (wrist && middleTip) measurements.push(middleTip.distanceTo(wrist));
	if (palmWidth) measurements.push(palmWidth);
	if (!measurements.length) return .08;
	return average(measurements);
}
function getPalmWidth(context) {
	const indexBase = getFingerJoint(context, "index", "metacarpal");
	const pinkyBase = getFingerJoint(context, "pinky", "metacarpal");
	if (!indexBase || !pinkyBase) return null;
	return indexBase.distanceTo(pinkyBase);
}
function getPalmNormal(context) {
	const wrist = context.getJoint("wrist");
	const indexBase = getFingerJoint(context, "index", "metacarpal");
	const pinkyBase = getFingerJoint(context, "pinky", "metacarpal");
	if (!wrist || !indexBase || !pinkyBase) return null;
	const u = new Vector3().subVectors(indexBase, wrist);
	const v = new Vector3().subVectors(pinkyBase, wrist);
	if (u.lengthSq() === 0 || v.lengthSq() === 0) return null;
	const normal = new Vector3().crossVectors(u, v);
	if (normal.lengthSq() === 0) return null;
	if (context.handLabel === "left") normal.multiplyScalar(-1);
	return normal.normalize();
}
function getPalmRight(context) {
	const indexBase = getFingerJoint(context, "index", "metacarpal");
	const pinkyBase = getFingerJoint(context, "pinky", "metacarpal");
	if (!indexBase || !pinkyBase) return null;
	const right = new Vector3().subVectors(indexBase, pinkyBase);
	if (context.handLabel === "left") right.multiplyScalar(-1);
	if (right.lengthSq() === 0) return null;
	return right.normalize();
}
function getPalmUp(context) {
	const normal = getPalmNormal(context);
	const right = getPalmRight(context);
	if (!normal || !right) return null;
	const up = new Vector3().copy(right).cross(normal);
	if (up.lengthSq() === 0) return null;
	return up.normalize();
}
function getPalmPose(context) {
	const wrist = context.getJoint("wrist");
	const indexBase = getFingerJoint(context, "index", "metacarpal");
	const pinkyBase = getFingerJoint(context, "pinky", "metacarpal");
	const width = getPalmWidth(context);
	const normal = getPalmNormal(context);
	const right = getPalmRight(context);
	const up = getPalmUp(context);
	if (!wrist || !indexBase || !pinkyBase || !width || !normal || !right || !up) return null;
	return {
		center: new Vector3().add(wrist).add(indexBase).add(pinkyBase).multiplyScalar(1 / 3),
		width,
		normal,
		right,
		up
	};
}
function getFingerBendAngles(context, finger) {
	return getDigitBendAngles(context, finger);
}
function getFingerStraightness(context, finger) {
	return getDigitStraightness(context, finger);
}
function getFingerCurl(context, finger) {
	return 1 - getFingerStraightness(context, finger);
}
function getFingerDirection(context, finger) {
	return getDigitDirection(context, finger);
}
function getFingerPalmAlignment(context, finger) {
	const direction = getFingerDirection(context, finger);
	const palmUp = getPalmUp(context);
	if (!direction || !palmUp) return 0;
	return clamp01((direction.dot(palmUp) - .2) / .8);
}
function getFingerSpread(context, fingerA, fingerB) {
	const directionA = getFingerDirection(context, fingerA);
	const directionB = getFingerDirection(context, fingerB);
	if (!directionA || !directionB) return 0;
	return clamp01((1 - directionA.dot(directionB)) / .45);
}
function getAdjacentFingerSpreads(context) {
	return {
		indexMiddle: getFingerSpread(context, "index", "middle"),
		middleRing: getFingerSpread(context, "middle", "ring"),
		ringPinky: getFingerSpread(context, "ring", "pinky")
	};
}
function getThumbBendAngles(context) {
	return getDigitBendAngles(context, "thumb");
}
function getThumbStraightness(context) {
	return getDigitStraightness(context, "thumb");
}
function getThumbCurl(context) {
	return 1 - getThumbStraightness(context);
}
function getThumbDirection(context) {
	return getDigitDirection(context, "thumb");
}
function getThumbOpposition(context, finger = "index") {
	const distance = getFingertipDistance(context, "thumb", finger);
	const scale = getPalmWidth(context) ?? estimateHandScale(context);
	if (distance === null || scale < EPSILON$2) return 0;
	return clamp01(1 - distance / (scale * .7));
}
function getThumbVerticalDirection(context) {
	const direction = getThumbDirection(context);
	if (!direction) return 0;
	return direction.y;
}
function getFingertipDistance(context, digitA, digitB) {
	const tipA = getDigitTip(context, digitA);
	const tipB = getDigitTip(context, digitB);
	if (!tipA || !tipB) return null;
	return tipA.distanceTo(tipB);
}
function getFingertipPalmDistance(context, digit) {
	const tip = getDigitTip(context, digit);
	const palmPose = getPalmPose(context);
	if (!tip || !palmPose) return null;
	return tip.distanceTo(palmPose.center);
}
function getBoneVectors(context) {
	return HAND_JOINT_IDX_CONNECTION_MAP.map(([joint1, joint2]) => {
		const start = context.getJoint(HAND_JOINT_NAMES[joint1]);
		const end = context.getJoint(HAND_JOINT_NAMES[joint2]);
		if (!start || !end) return new Vector3();
		const boneVector = new Vector3().subVectors(end, start);
		if (boneVector.lengthSq() === 0) return boneVector;
		return boneVector.normalize();
	});
}
function getRelativeBoneAngles(context) {
	const boneVectors = getBoneVectors(context);
	const angles = new Float32Array(HAND_BONE_IDX_CONNECTION_MAP.length);
	HAND_BONE_IDX_CONNECTION_MAP.forEach(([bone1, bone2], index) => {
		angles[index] = boneVectors[bone1].dot(boneVectors[bone2]);
	});
	return angles;
}
function average(values) {
	if (!values.length) return 0;
	return values.reduce((sum, value) => sum + value, 0) / values.length;
}
function clamp01(value) {
	return MathUtils.clamp(value, 0, 1);
}
function getDigitBendAngles(context, digit) {
	const segments = getDigitSegmentDirections(context, digit);
	if (!segments || segments.length < 2) return [];
	const angles = [];
	for (let i = 0; i < segments.length - 1; i++) angles.push(segments[i].dot(segments[i + 1]));
	return angles;
}
function getDigitStraightness(context, digit) {
	const bendAngles = getDigitBendAngles(context, digit);
	if (!bendAngles.length) return 0;
	return average(bendAngles.map(normalizeStraightness));
}
function getDigitDirection(context, digit) {
	const base = getDigitBase(context, digit);
	const tip = getDigitTip(context, digit);
	if (!base || !tip) return null;
	const direction = new Vector3().subVectors(tip, base);
	if (direction.lengthSq() === 0) return null;
	return direction.normalize();
}
function getDigitBase(context, digit) {
	return context.getJoint(DIGIT_JOINTS[digit][0]);
}
function getDigitTip(context, digit) {
	return context.getJoint(DIGIT_JOINTS[digit][DIGIT_JOINTS[digit].length - 1]);
}
function getDigitSegmentDirections(context, digit) {
	const joints = DIGIT_JOINTS[digit].map((jointName) => context.getJoint(jointName)).filter(Boolean);
	if (joints.length !== DIGIT_JOINTS[digit].length) return null;
	const segments = [];
	for (let i = 0; i < joints.length - 1; i++) {
		const segment = new Vector3().subVectors(joints[i + 1], joints[i]);
		if (segment.lengthSq() === 0) return null;
		segments.push(segment.normalize());
	}
	return segments;
}
function normalizeStraightness(bendCosine) {
	return clamp01((bendCosine - .55) / .4);
}
var EPSILON$1 = 1e-6;
function detectPinch(context, config) {
	const distance = getFingertipDistance(context, "thumb", "index");
	if (distance === null || !Number.isFinite(distance)) return void 0;
	const scale = getPalmWidth(context) ?? estimateHandScale(context);
	if (scale < EPSILON$1) return { confidence: 0 };
	const threshold = Math.max(config.threshold ?? 0, scale * .32, .025);
	const distanceScore = clamp01((threshold * 1.8 - distance) / (threshold * 1.2));
	const supportPenalty = clamp01((average([
		"middle",
		"ring",
		"pinky"
	].map((finger) => getFingerStraightness(context, finger))) - .55) / .45);
	return {
		confidence: clamp01(distanceScore * (1 - supportPenalty * .35)),
		data: {
			distance,
			threshold,
			supportPenalty
		}
	};
}
function detectOpenPalm(context, config) {
	const straightnessScores = FINGER_ORDER.map((finger) => getFingerStraightness(context, finger));
	const extensionScores = FINGER_ORDER.map((finger) => getFingerExtensionScore(context, finger));
	const straightness = average(straightnessScores);
	const extension = average(extensionScores);
	const allFingersStraight = Math.min(...straightnessScores);
	const allFingersExtended = Math.min(...extensionScores);
	const palmAlignment = average(FINGER_ORDER.map((finger) => getFingerPalmAlignment(context, finger)));
	const spread = getTipSpreadScore(context);
	const openGate = Math.min(allFingersStraight, allFingersExtended);
	return {
		confidence: clamp01(openGate * (straightness * .3 + extension * .35 + spread * .15 + palmAlignment * .2)),
		data: {
			straightness,
			extension,
			allFingersStraight,
			allFingersExtended,
			openGate,
			palmAlignment,
			spread,
			threshold: config.threshold
		}
	};
}
function detectFist(context, config) {
	const closed = average(FINGER_ORDER.map((finger) => getFingerClosedScore(context, finger)));
	const scale = getPalmWidth(context) ?? estimateHandScale(context);
	const palmDistanceAverage = average(FINGER_ORDER.map((finger) => getFingertipPalmDistance(context, finger)).filter((distance) => distance !== null));
	const palmDistanceScore = scale > EPSILON$1 ? clamp01(1 - palmDistanceAverage / (scale * 1.35)) : 0;
	const thumbWrap = Math.max(getThumbOpposition(context, "index"), getThumbOpposition(context, "middle"));
	const thumbStraightness = getThumbStraightness(context);
	const thumbVertical = getThumbVerticalDirection(context);
	const verticalThumbPenalty = thumbStraightness * clamp01((Math.abs(thumbVertical) - .25) / .5);
	return {
		confidence: clamp01(clamp01(closed * .7 + palmDistanceScore * .2 + thumbWrap * .1) * (1 - verticalThumbPenalty * .85)),
		data: {
			closed,
			palmDistanceScore,
			thumbWrap,
			thumbStraightness,
			thumbVertical,
			verticalThumbPenalty,
			threshold: config.threshold
		}
	};
}
function detectThumbsUp(context, config) {
	const thumbStraightness = getThumbStraightness(context);
	const thumbVertical = clamp01((getThumbVerticalDirection(context) - .35) / .5);
	const otherCurl = average(FINGER_ORDER.map((finger) => getFingerClosedScore(context, finger)));
	const indexDistance = getFingertipDistance(context, "thumb", "index");
	const scale = getPalmWidth(context) ?? estimateHandScale(context);
	const separation = indexDistance !== null && scale > EPSILON$1 ? clamp01((indexDistance - scale * .65) / (scale * .5)) : 0;
	const thumbWrapPenalty = Math.max(getThumbOpposition(context, "index"), getThumbOpposition(context, "middle"));
	return {
		confidence: clamp01(thumbStraightness * thumbVertical * (otherCurl * .45 + separation * .35 + (1 - thumbWrapPenalty) * .2)),
		data: {
			thumbStraightness,
			thumbVertical,
			otherCurl,
			separation,
			thumbWrapPenalty,
			threshold: config.threshold
		}
	};
}
function detectThumbsDown(context, config) {
	const thumbStraightness = getThumbStraightness(context);
	const thumbVertical = clamp01((-getThumbVerticalDirection(context) - .35) / .5);
	const otherCurl = average(FINGER_ORDER.map((finger) => getFingerClosedScore(context, finger)));
	const indexDistance = getFingertipDistance(context, "thumb", "index");
	const scale = getPalmWidth(context) ?? estimateHandScale(context);
	const separation = indexDistance !== null && scale > EPSILON$1 ? clamp01((indexDistance - scale * .65) / (scale * .5)) : 0;
	const thumbWrapPenalty = Math.max(getThumbOpposition(context, "index"), getThumbOpposition(context, "middle"));
	return {
		confidence: clamp01(thumbStraightness * thumbVertical * (otherCurl * .45 + separation * .35 + (1 - thumbWrapPenalty) * .2)),
		data: {
			thumbStraightness,
			thumbVertical,
			otherCurl,
			separation,
			thumbWrapPenalty,
			threshold: config.threshold
		}
	};
}
function detectPoint(context, config) {
	const indexStraightness = getFingerStraightness(context, "index");
	const indexAlignment = getFingerPalmAlignment(context, "index");
	const indexExtension = getFingerExtensionScore(context, "index");
	const middleClosed = getFingerClosedScore(context, "middle");
	const ringClosed = getFingerClosedScore(context, "ring");
	const pinkyClosed = getFingerClosedScore(context, "pinky");
	const otherCurl = average([
		middleClosed,
		ringClosed,
		pinkyClosed
	]);
	const allOtherFingersClosed = Math.min(middleClosed, ringClosed, pinkyClosed);
	return {
		confidence: clamp01(average([
			indexStraightness,
			indexExtension,
			Math.max(indexAlignment, .5)
		]) * (otherCurl * .65 + allOtherFingersClosed * .35)),
		data: {
			indexStraightness,
			indexExtension,
			indexAlignment,
			otherCurl,
			allOtherFingersClosed,
			threshold: config.threshold
		}
	};
}
function getFingerClosedScore(context, finger) {
	return Math.max(getFingerCurl(context, finger), 1 - getFingerExtensionScore(context, finger));
}
function getFingerExtensionScore(context, finger) {
	const distance = getFingertipPalmDistance(context, finger);
	const scale = getPalmWidth(context) ?? estimateHandScale(context);
	if (distance === null || scale < EPSILON$1) return 0;
	return clamp01((distance - scale * .45) / (scale * .85));
}
function detectSpread(context, config) {
	const straightnessScores = FINGER_ORDER.map((finger) => getFingerStraightness(context, finger));
	const extensionScores = FINGER_ORDER.map((finger) => getFingerExtensionScore(context, finger));
	const straightness = average(straightnessScores);
	const extension = average(extensionScores);
	const allFingersStraight = Math.min(...straightnessScores);
	const allFingersExtended = Math.min(...extensionScores);
	const adjacentSpreads = getAdjacentFingerSpreads(context);
	const directionSpread = average(Object.values(adjacentSpreads));
	const tipSpread = getTipSpreadScore(context);
	const spread = Math.max(directionSpread, tipSpread);
	const palmAlignment = average(FINGER_ORDER.map((finger) => getFingerPalmAlignment(context, finger)));
	const indexPinkySpread = getFingerSpread(context, "index", "pinky");
	const openGate = average([allFingersStraight, allFingersExtended]);
	return {
		confidence: clamp01(openGate * (straightness * .2 + extension * .2 + spread * .45 + Math.max(indexPinkySpread, palmAlignment) * .15)),
		data: {
			straightness,
			extension,
			allFingersStraight,
			allFingersExtended,
			openGate,
			spread,
			indexPinkySpread,
			palmAlignment,
			threshold: config.threshold
		}
	};
}
function getTipSpreadScore(context) {
	const scale = getPalmWidth(context) ?? estimateHandScale(context);
	if (scale < EPSILON$1) return 0;
	const distances = [
		getFingertipDistance(context, "index", "middle"),
		getFingertipDistance(context, "middle", "ring"),
		getFingertipDistance(context, "ring", "pinky")
	].filter((distance) => distance !== null);
	if (!distances.length) return 0;
	return clamp01((average(distances) - scale * .25) / (scale * .45));
}
var HeuristicGestureRecognizer = class {
	constructor(initBuiltInGestures = true) {
		this.gestures = /* @__PURE__ */ new Map();
		if (initBuiltInGestures) this.registerBuiltInGestures();
	}
	registerGesture(name, detector, config = {}) {
		this.gestures.set(name, {
			detector,
			config: {
				enabled: true,
				...config
			}
		});
		return this;
	}
	unregisterGesture(name) {
		this.gestures.delete(name);
		return this;
	}
	getGestureConfigurations() {
		const configs = {};
		for (const [name, gesture] of this.gestures.entries()) configs[name] = { ...gesture.config };
		return configs;
	}
	recognize(context) {
		const scores = {};
		for (const [name, gesture] of this.gestures.entries()) scores[name] = gesture.detector(context, gesture.config);
		return scores;
	}
	registerBuiltInGestures() {
		this.registerGesture("pinch", detectPinch, {
			enabled: true,
			threshold: .025
		});
		this.registerGesture("open-palm", detectOpenPalm);
		this.registerGesture("fist", detectFist);
		this.registerGesture("thumbs-up", detectThumbsUp);
		this.registerGesture("thumbs-down", detectThumbsDown);
		this.registerGesture("point", detectPoint, { enabled: false });
		this.registerGesture("spread", detectSpread, {
			enabled: false,
			threshold: .04
		});
	}
};
var HAND_INDEX_TO_LABEL = {
	[0]: "left",
	[1]: "right"
};
var WebXRHandContext = class {
	constructor(handedness, handLabel, joints, jointRotations) {
		this.handedness = handedness;
		this.handLabel = handLabel;
		this.joints = joints;
		this.jointRotations = jointRotations;
	}
	getJoint(jointName) {
		return this.joints.get(jointName);
	}
};
var WebXRHandPoseEstimator = class {
	constructor(user) {
		this.user = user;
	}
	init({ user } = {}) {
		if (user) this.user = user;
		return Promise.resolve();
	}
	getHandContext(handedness) {
		if (!this.user?.hands) return null;
		const hand = this.user.hands.hands[handedness];
		const handLabel = HAND_INDEX_TO_LABEL[handedness];
		if (!hand?.joints || !handLabel) return null;
		const joints = /* @__PURE__ */ new Map();
		const jointRotations = /* @__PURE__ */ new Map();
		const position = new Vector3();
		const rotation = new Quaternion();
		const scale = new Vector3();
		for (const jointName of HAND_JOINT_NAMES) {
			const joint = hand.joints[jointName];
			if (!joint) continue;
			joint.matrixWorld.decompose(position, rotation, scale);
			joints.set(jointName, position.clone());
			jointRotations.set(jointName, rotation.clone());
		}
		if (!joints.size) return null;
		return new WebXRHandContext(handedness, handLabel, joints, jointRotations);
	}
	getHandContexts() {
		return {
			left: this.getHandContext(0) ?? void 0,
			right: this.getHandContext(1) ?? void 0
		};
	}
};
var GestureRecognitionOptions = class {
	constructor(options) {
		this.enabled = false;
		this.minimumConfidence = .6;
		this.updateIntervalMs = 33;
		this.poseEstimator = new WebXRHandPoseEstimator();
		this.gestureRecognizer = new HeuristicGestureRecognizer();
		this.gestures = {};
		if (options) {
			const { poseEstimator, gestureRecognizer, gestures, ...baseOptions } = options;
			deepMerge(this, baseOptions);
			if (poseEstimator) this.poseEstimator = poseEstimator;
			if (gestureRecognizer) this.gestureRecognizer = gestureRecognizer;
			this.applyGestureRecognizerConfigurations();
			if (gestures) for (const [name, config] of Object.entries(gestures)) this.setGestureConfig(name, config);
			return;
		}
		this.applyGestureRecognizerConfigurations();
	}
	enable() {
		this.enabled = true;
		return this;
	}
	setGestureEnabled(name, enabled) {
		this.gestures[name] ??= { enabled };
		this.gestures[name].enabled = enabled;
		return this;
	}
	setPoseEstimator(poseEstimator) {
		this.poseEstimator = poseEstimator;
		return this;
	}
	setGestureRecognizer(gestureRecognizer) {
		this.gestureRecognizer = gestureRecognizer;
		this.gestures = {};
		this.applyGestureRecognizerConfigurations();
		return this;
	}
	setGestureConfig(name, config) {
		const mergedConfig = {
			...this.gestures[name],
			enabled: this.gestures[name]?.enabled ?? true
		};
		deepMerge(mergedConfig, config);
		this.gestures[name] = mergedConfig;
		return this;
	}
	applyGestureRecognizerConfigurations() {
		const configs = this.gestureRecognizer.getGestureConfigurations?.() ?? {};
		for (const [name, config] of Object.entries(configs)) this.setGestureConfig(name, config);
	}
};
var RELATIVE_ORIENTATION = new Quaternion();
var INVERSE_BASELINE = new Quaternion();
var EULER = new Euler(0, 0, 0, "YXZ");
function detectNod(context, config, options) {
	const threshold = config.threshold ?? MathUtils.degToRad(12);
	const series = buildMotionSeries(context, options);
	if (!series) return;
	return findSingleExcursion(series, "pitch", threshold, options, (value) => value >= 0 ? "up" : "down");
}
function detectShake(context, config, options) {
	const threshold = config.threshold ?? MathUtils.degToRad(10);
	const series = buildMotionSeries(context, options);
	if (!series) return;
	return findSingleExcursion(series, "yaw", threshold, options, (value) => value >= 0 ? "left" : "right");
}
function findSingleExcursion(series, axis, threshold, options, directionLabel) {
	const tolerance = threshold * options.returnToleranceFactor;
	const extrema = findExtrema(series, axis, threshold);
	let best;
	for (const peakIndex of extrema) {
		const peakValue = series[peakIndex][axis];
		const startIndex = findLastNearBaseline(series, axis, peakIndex, tolerance);
		const endIndex = findFirstNearBaseline(series, axis, peakIndex, tolerance);
		if (startIndex === void 0 || endIndex === void 0) continue;
		const durationMs = series[endIndex].timestamp - series[startIndex].timestamp;
		if (!validDuration(durationMs, options)) continue;
		if (series.at(-1).timestamp - series[endIndex].timestamp > options.detectionHoldMs) continue;
		const amplitude = Math.abs(peakValue);
		const offAxisRatio = maximumAbsoluteValue(series, startIndex, endIndex, axis === "pitch" ? ["yaw", "roll"] : ["pitch", "roll"]) / amplitude;
		if (offAxisRatio > options.maximumOffAxisRatio) continue;
		const expectedVariation = Math.abs(peakValue - series[startIndex][axis]) + Math.abs(series[endIndex][axis] - peakValue);
		const actualVariation = totalVariation(series, axis, startIndex, endIndex);
		const pathEfficiency = expectedVariation / Math.max(actualVariation, 1e-6);
		if (pathEfficiency < options.minimumPathEfficiency) continue;
		const peakAngularSpeed = getPeakAngularSpeed(series, axis, startIndex, endIndex);
		if (peakAngularSpeed < options.minimumPeakAngularSpeed) continue;
		const confidence = scoreCandidate({
			amplitude,
			threshold,
			durationMs,
			returnError: Math.abs(series[endIndex][axis]),
			returnTolerance: tolerance,
			offAxisRatio,
			pathEfficiency,
			peakAngularSpeed,
			options
		});
		const completedAt = series[endIndex].timestamp;
		const result = {
			confidence,
			data: {
				amplitudeRadians: amplitude,
				durationMs,
				peakAngularSpeed,
				initialDirection: directionLabel(peakValue)
			}
		};
		if (!best || completedAt > best.completedAt) best = {
			result,
			completedAt
		};
	}
	return best?.result;
}
function buildMotionSeries(context, options) {
	const samples = context.samples;
	if (samples.length < 5) return;
	if (samples.at(-1).timestamp - samples[0].timestamp < options.quietPrefixDurationMs + options.minimumGestureDurationMs) return;
	const quietEnd = samples[0].timestamp + options.quietPrefixDurationMs;
	const quietSamples = samples.filter((sample) => sample.timestamp <= quietEnd);
	if (quietSamples.length < 2) return;
	const baseline = quietSamples[0].orientation.clone();
	for (let i = 1; i < quietSamples.length; i++) baseline.slerp(quietSamples[i].orientation, 1 / (i + 1));
	INVERSE_BASELINE.copy(baseline).invert();
	const series = [];
	let previous;
	for (const sample of samples) {
		RELATIVE_ORIENTATION.copy(INVERSE_BASELINE).multiply(sample.orientation);
		EULER.setFromQuaternion(RELATIVE_ORIENTATION, "YXZ");
		const point = {
			timestamp: sample.timestamp,
			pitch: EULER.x,
			yaw: EULER.y,
			roll: EULER.z
		};
		if (previous) {
			const elapsed = Math.max(0, point.timestamp - previous.timestamp);
			const alpha = elapsed / (options.smoothingTimeConstantMs + elapsed || 1);
			point.pitch = MathUtils.lerp(previous.pitch, point.pitch, alpha);
			point.yaw = MathUtils.lerp(previous.yaw, point.yaw, alpha);
			point.roll = MathUtils.lerp(previous.roll, point.roll, alpha);
		}
		series.push(point);
		previous = point;
	}
	return series;
}
function findExtrema(series, axis, threshold) {
	const extrema = [];
	for (let i = 1; i < series.length - 1; i++) {
		const previous = series[i - 1][axis];
		const current = series[i][axis];
		const next = series[i + 1][axis];
		if ((current >= previous && current > next || current <= previous && current < next) && Math.abs(current) >= threshold) extrema.push(i);
	}
	return extrema;
}
function findLastNearBaseline(series, axis, before, tolerance) {
	for (let i = before - 1; i >= 0; i--) if (Math.abs(series[i][axis]) <= tolerance) return i;
}
function findFirstNearBaseline(series, axis, after, tolerance) {
	for (let i = after + 1; i < series.length; i++) if (Math.abs(series[i][axis]) <= tolerance) return i;
}
function validDuration(durationMs, options) {
	return durationMs >= options.minimumGestureDurationMs && durationMs <= options.maximumGestureDurationMs;
}
function maximumAbsoluteValue(series, start, end, axes) {
	let maximum = 0;
	for (let i = start; i <= end; i++) for (const axis of axes) maximum = Math.max(maximum, Math.abs(series[i][axis]));
	return maximum;
}
function totalVariation(series, axis, start, end) {
	let variation = 0;
	for (let i = start + 1; i <= end; i++) variation += Math.abs(series[i][axis] - series[i - 1][axis]);
	return variation;
}
function getPeakAngularSpeed(series, axis, start, end) {
	let peak = 0;
	for (let i = start + 1; i <= end; i++) {
		const elapsedSeconds = (series[i].timestamp - series[i - 1].timestamp) / 1e3;
		if (elapsedSeconds <= 0) continue;
		peak = Math.max(peak, Math.abs(series[i][axis] - series[i - 1][axis]) / elapsedSeconds);
	}
	return peak;
}
function scoreCandidate({ amplitude, threshold, durationMs, returnError, returnTolerance, offAxisRatio, pathEfficiency, peakAngularSpeed, options }) {
	const midpoint = (options.minimumGestureDurationMs + options.maximumGestureDurationMs) / 2;
	const halfRange = (options.maximumGestureDurationMs - options.minimumGestureDurationMs) / 2;
	const scores = [
		quality((amplitude - threshold) / Math.max(threshold, 1e-6)),
		quality(1 - Math.abs(durationMs - midpoint) / Math.max(halfRange, 1)),
		quality(1 - returnError / Math.max(returnTolerance, 1e-6)),
		quality(1 - offAxisRatio / options.maximumOffAxisRatio),
		quality((pathEfficiency - options.minimumPathEfficiency) / (1 - options.minimumPathEfficiency)),
		quality((peakAngularSpeed - options.minimumPeakAngularSpeed) / options.minimumPeakAngularSpeed)
	];
	const product = scores.reduce((value, score) => value * score, 1);
	return MathUtils.clamp(product ** (1 / scores.length), 0, 1);
}
function quality(value) {
	return .6 + .4 * MathUtils.clamp(value, 0, 1);
}
var DEFAULT_OPTIONS = {
	minimumGestureDurationMs: 200,
	maximumGestureDurationMs: 750,
	maximumOffAxisRatio: .5,
	quietPrefixDurationMs: 200,
	detectionHoldMs: 180,
	returnToleranceFactor: .55,
	smoothingTimeConstantMs: 35,
	minimumPathEfficiency: .65,
	minimumPeakAngularSpeed: .6
};
var HeuristicHeadGestureRecognizer = class {
	constructor(initBuiltInGestures = true, options = {}) {
		this.gestures = /* @__PURE__ */ new Map();
		this.options = {
			...DEFAULT_OPTIONS,
			...options
		};
		if (initBuiltInGestures) this.registerBuiltInGestures();
	}
	registerGesture(name, detector, config = {}) {
		this.gestures.set(name, {
			detector,
			config: {
				enabled: true,
				...config
			}
		});
		return this;
	}
	unregisterGesture(name) {
		this.gestures.delete(name);
		return this;
	}
	getGestureConfigurations() {
		const configs = {};
		for (const [name, gesture] of this.gestures.entries()) configs[name] = { ...gesture.config };
		return configs;
	}
	setGestureConfig(name, config) {
		const gesture = this.gestures.get(name);
		if (gesture) gesture.config = { ...config };
		return this;
	}
	recognize(context) {
		const scores = {};
		for (const [name, gesture] of this.gestures.entries()) scores[name] = gesture.detector(context, gesture.config);
		return scores;
	}
	registerBuiltInGestures() {
		const nodThreshold = 12 * Math.PI / 180;
		const shakeThreshold = 10 * Math.PI / 180;
		this.registerGesture("nod", (context, config) => detectNod(context, config, this.options), {
			enabled: true,
			threshold: nodThreshold
		});
		this.registerGesture("shake", (context, config) => detectShake(context, config, this.options), {
			enabled: true,
			threshold: shakeThreshold
		});
		this.registerGesture("nod-up", this.detectDirection(detectNod, "up"), {
			enabled: true,
			threshold: nodThreshold
		});
		this.registerGesture("nod-down", this.detectDirection(detectNod, "down"), {
			enabled: true,
			threshold: nodThreshold
		});
		this.registerGesture("shake-left", this.detectDirection(detectShake, "left"), {
			enabled: true,
			threshold: shakeThreshold
		});
		this.registerGesture("shake-right", this.detectDirection(detectShake, "right"), {
			enabled: true,
			threshold: shakeThreshold
		});
	}
	detectDirection(detector, direction) {
		return (context, config) => {
			const result = detector(context, config, this.options);
			return result?.data?.initialDirection === direction ? result : void 0;
		};
	}
};
var HeadGestureRecognitionOptions = class {
	constructor(options) {
		this.enabled = false;
		this.minimumConfidence = .6;
		this.releaseConfidence = .4;
		this.updateIntervalMs = 16;
		this.historyDurationMs = 1500;
		this.warmupDurationMs = 200;
		this.maximumSampleGapMs = 250;
		this.maximumSampleAngleRadians = Math.PI / 3;
		this.gestureRecognizer = new HeuristicHeadGestureRecognizer();
		this.gestures = {};
		if (options) {
			const { gestureRecognizer, gestures, ...baseOptions } = options;
			deepMerge(this, baseOptions);
			if (gestureRecognizer) this.gestureRecognizer = gestureRecognizer;
			this.applyGestureRecognizerConfigurations();
			if (gestures) for (const [name, config] of Object.entries(gestures)) this.setGestureConfig(name, config);
			return;
		}
		this.applyGestureRecognizerConfigurations();
	}
	enable() {
		this.enabled = true;
		return this;
	}
	setGestureEnabled(name, enabled) {
		return this.setGestureConfig(name, { enabled });
	}
	setGestureRecognizer(gestureRecognizer) {
		this.gestureRecognizer = gestureRecognizer;
		this.gestures = {};
		this.applyGestureRecognizerConfigurations();
		return this;
	}
	setGestureConfig(name, config) {
		const mergedConfig = {
			...this.gestures[name],
			enabled: this.gestures[name]?.enabled ?? true
		};
		deepMerge(mergedConfig, config);
		this.gestures[name] = mergedConfig;
		this.gestureRecognizer.setGestureConfig?.(name, mergedConfig);
		return this;
	}
	applyGestureRecognizerConfigurations() {
		const configs = this.gestureRecognizer.getGestureConfigurations?.() ?? {};
		for (const [name, config] of Object.entries(configs)) this.setGestureConfig(name, config);
	}
};
/**
* Abstract base class for stroke recognition backends.
*/
var StrokeRecognizerBackend = class {
	constructor(context) {
		this.context = context;
	}
};
var DEFAULT_SUPPORTED_SHAPES = [
	"Triangle",
	"Rectangle",
	"Circle",
	"V",
	"Caret"
];
/** Calculates the Euclidean distance between two 2D points. */
function distance(p1, p2) {
	const dx = p2.x - p1.x;
	const dy = p2.y - p1.y;
	return Math.sqrt(dx * dx + dy * dy);
}
/** Calculates the total length of a path defined by a list of points. */
function pathLength(points) {
	let d = 0;
	for (let i = 1; i < points.length; i++) d += distance(points[i - 1], points[i]);
	return d;
}
/** Resamples a path into n evenly spaced points, or returns null if it cannot advance. */
function resample(points, n) {
	const interval = pathLength(points) / (n - 1);
	if (points.length < 2 || !Number.isFinite(interval) || interval <= 0) return null;
	let D = 0;
	const newPoints = [points[0]];
	const pts = points.slice();
	let i = 1;
	const maxIterations = points.length + n;
	let iterations = 0;
	while (i < pts.length) {
		if (iterations++ >= maxIterations) return null;
		const pt1 = pts[i - 1];
		const pt2 = pts[i];
		const d = distance(pt1, pt2);
		if (D + d >= interval) {
			const t = (interval - D) / d;
			const q = {
				x: pt1.x + t * (pt2.x - pt1.x),
				y: pt1.y + t * (pt2.y - pt1.y)
			};
			if (!Number.isFinite(q.x) || !Number.isFinite(q.y) || q.x === pt1.x && q.y === pt1.y) return null;
			newPoints.push(q);
			pts.splice(i, 0, q);
			D = 0;
		} else D += d;
		i++;
	}
	if (newPoints.length === n - 1) newPoints.push(pts[pts.length - 1]);
	return newPoints;
}
/** Calculates the centroid (center of mass) of a list of points. */
function getCentroid(points) {
	let x = 0, y = 0;
	for (let i = 0; i < points.length; i++) {
		x += points[i].x;
		y += points[i].y;
	}
	return {
		x: x / points.length,
		y: y / points.length
	};
}
/** Calculates the bounding box of a list of points. */
function boundingBox(points) {
	let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
	for (let i = 0; i < points.length; i++) {
		minX = Math.min(minX, points[i].x);
		maxX = Math.max(maxX, points[i].x);
		minY = Math.min(minY, points[i].y);
		maxY = Math.max(maxY, points[i].y);
	}
	return {
		x: minX,
		y: minY,
		width: maxX - minX,
		height: maxY - minY
	};
}
/** Rotates a list of points by a given angle in radians around their centroid. */
function rotateBy(points, radians, centroid = getCentroid(points)) {
	const cos = Math.cos(radians);
	const sin = Math.sin(radians);
	const newPoints = [];
	for (let i = 0; i < points.length; i++) {
		const qx = (points[i].x - centroid.x) * cos - (points[i].y - centroid.y) * sin + centroid.x;
		const qy = (points[i].x - centroid.x) * sin + (points[i].y - centroid.y) * cos + centroid.y;
		newPoints.push({
			x: qx,
			y: qy
		});
	}
	return newPoints;
}
/** Rotates a list of points so that the angle between the first point and the centroid is zero. */
function rotateToZero(points) {
	const centroid = getCentroid(points);
	return rotateBy(points, -Math.atan2(points[0].y - centroid.y, points[0].x - centroid.x), centroid);
}
/** Scales a list of points to a standard size (bounding box width/height becomes size). */
function scaleTo(points, size) {
	const B = boundingBox(points);
	const newPoints = [];
	const EPSILON = 1e-5;
	const width = Math.max(B.width, EPSILON);
	const height = Math.max(B.height, EPSILON);
	for (let i = 0; i < points.length; i++) {
		const qx = points[i].x * (size / width);
		const qy = points[i].y * (size / height);
		newPoints.push({
			x: qx,
			y: qy
		});
	}
	return newPoints;
}
/** Translates a list of points so that their centroid matches the given point. */
function translateTo(points, pt) {
	const centroid = getCentroid(points);
	const newPoints = [];
	for (let i = 0; i < points.length; i++) {
		const qx = points[i].x + pt.x - centroid.x;
		const qy = points[i].y + pt.y - centroid.y;
		newPoints.push({
			x: qx,
			y: qy
		});
	}
	return newPoints;
}
/** Calculates the average distance between corresponding points in two paths. */
function pathDistance(pts1, pts2) {
	let d = 0;
	for (let i = 0; i < pts1.length; i++) d += distance(pts1[i], pts2[i]);
	return d / pts1.length;
}
/** Calculates the path distance between a candidate path and a template at a specific angle. */
function distanceAtAngle(points, template, radians, centroid = getCentroid(points)) {
	return pathDistance(rotateBy(points, radians, centroid), template.points);
}
/** Finds the minimum path distance between a candidate path and a template by searching for the best angle using Golden Section Search. */
function distanceAtBestAngle(points, template, a, b, threshold) {
	const phi = .5 * (Math.sqrt(5) - 1);
	const centroid = getCentroid(points);
	let x1 = phi * a + (1 - phi) * b;
	let x2 = (1 - phi) * a + phi * b;
	let f1 = distanceAtAngle(points, template, x1, centroid);
	let f2 = distanceAtAngle(points, template, x2, centroid);
	while (Math.abs(b - a) > threshold) if (f1 < f2) {
		b = x2;
		x2 = x1;
		f2 = f1;
		x1 = phi * a + (1 - phi) * b;
		f1 = distanceAtAngle(points, template, x1, centroid);
	} else {
		a = x1;
		x1 = x2;
		f1 = f2;
		x2 = (1 - phi) * a + phi * b;
		f2 = distanceAtAngle(points, template, x2, centroid);
	}
	return Math.min(f1, f2);
}
/**
* Implementation of the $1 Unistroke recognizer algorithm.
* It recognizes 2D strokes by comparing them against a set of predefined templates
* (e.g., Triangle, Rectangle, Circle) after preprocessing them (resampling, rotating, scaling).
* Supports bi-directional strokes by checking both forward and backward directions.
* Based on https://depts.washington.edu/acelab/proj/dollar/index.html.
*/
var OneDollarUnistrokeRecognizer = class extends StrokeRecognizerBackend {
	constructor(context) {
		super(context);
		this.templates = [];
		const enabledTemplates = context.supportedShapes || DEFAULT_SUPPORTED_SHAPES;
		this.populateTemplates(enabledTemplates);
	}
	/**
	* Recognizes a stroke from a list of 2D points by comparing it against stored templates.
	* Supports both forward and backward matching to handle bi-directional strokes.
	* Returns Unknown with zero confidence for input that cannot form a valid normalized stroke.
	* @param points - The list of points captured during the stroke.
	* @returns The recognition result containing the shape name and confidence score.
	*/
	recognize(points) {
		if (points.length < 2 || points.some((point) => !Number.isFinite(point.x) || !Number.isFinite(point.y))) return {
			recognizedShape: "Unknown",
			confidence: 0
		};
		const length = pathLength(points);
		if (length === 0 || !Number.isFinite(length)) return {
			recognizedShape: "Unknown",
			confidence: 0
		};
		const resampledForward = resample(points, 64);
		if (!resampledForward) return {
			recognizedShape: "Unknown",
			confidence: 0
		};
		const resampledBackward = resampledForward.slice().reverse();
		const pointsForwardUnrotated = this.scaleAndTranslate(resampledForward);
		const pointsBackwardUnrotated = pointsForwardUnrotated.slice().reverse();
		const pointsForwardRotated = this.scaleAndTranslate(rotateToZero(resampledForward));
		const pointsBackwardRotated = this.scaleAndTranslate(rotateToZero(resampledBackward));
		let bestDistance = Infinity;
		let bestTemplateIndex = -1;
		for (let i = 0; i < this.templates.length; i++) {
			const useRotation = this.templates[i].useRotation;
			const ptsForward = useRotation ? pointsForwardRotated : pointsForwardUnrotated;
			const ptsBackward = useRotation ? pointsBackwardRotated : pointsBackwardUnrotated;
			const forwardDistance = distanceAtBestAngle(ptsForward, this.templates[i], -45 * Math.PI / 180, 45 * Math.PI / 180, 2 * Math.PI / 180);
			const backwardDistance = distanceAtBestAngle(ptsBackward, this.templates[i], -45 * Math.PI / 180, 45 * Math.PI / 180, 2 * Math.PI / 180);
			if (forwardDistance < bestDistance) {
				bestDistance = forwardDistance;
				bestTemplateIndex = i;
			}
			if (backwardDistance < bestDistance) {
				bestDistance = backwardDistance;
				bestTemplateIndex = i;
			}
		}
		return bestTemplateIndex !== -1 ? {
			recognizedShape: this.templates[bestTemplateIndex].name,
			confidence: this.calculateConfidence(bestDistance)
		} : {
			recognizedShape: "Unknown",
			confidence: 0
		};
	}
	/**
	* Populates the templates based on the enabled shapes.
	* @param enabledTemplates - List of shape names to enable.
	*/
	populateTemplates(enabledTemplates) {
		if (enabledTemplates.includes("Triangle")) this.addClosedTemplate("Triangle", [
			{
				x: 0,
				y: 0
			},
			{
				x: 50,
				y: 100
			},
			{
				x: 100,
				y: 0
			}
		]);
		if (enabledTemplates.includes("Rectangle")) this.addClosedTemplate("Rectangle", [
			{
				x: 0,
				y: 0
			},
			{
				x: 0,
				y: 100
			},
			{
				x: 100,
				y: 100
			},
			{
				x: 100,
				y: 0
			}
		]);
		if (enabledTemplates.includes("V")) this.addTemplate("V", [
			{
				x: 0,
				y: 100
			},
			{
				x: 50,
				y: 0
			},
			{
				x: 100,
				y: 100
			}
		], false);
		if (enabledTemplates.includes("Caret")) this.addTemplate("Caret", [
			{
				x: 0,
				y: 0
			},
			{
				x: 50,
				y: 100
			},
			{
				x: 100,
				y: 0
			}
		], false);
		if (enabledTemplates.includes("Circle")) for (let offset = 0; offset < 4; offset++) {
			const circlePoints = [];
			const startAngle = offset / 4 * Math.PI * 2;
			for (let i = 0; i <= 20; i++) {
				const angle = startAngle + i / 20 * Math.PI * 2;
				circlePoints.push({
					x: Math.cos(angle) * 100,
					y: Math.sin(angle) * 100
				});
			}
			this.addTemplate("Circle", circlePoints);
		}
	}
	/**
	* Adds a template for a closed shape by automatically generating cyclic permutations
	* of the points to support different starting points.
	* @param name - The name of the shape.
	* @param points -  The points defining the shape.
	* @param useRotation - Whether to use rotation invariance.
	* @throws RangeError if the template cannot be resampled.
	*/
	addClosedTemplate(name, points, useRotation = true) {
		const n = points.length;
		for (let i = 0; i < n; i++) {
			const permutedPoints = [];
			for (let j = 0; j <= n; j++) permutedPoints.push(points[(i + j) % n]);
			this.addTemplate(name, permutedPoints, useRotation);
		}
	}
	/**
	* Adds a template to the recognizer.
	* @param name - The name of the shape.
	* @param points - The points defining the shape.
	* @param useRotation - Whether to use rotation invariance.
	* @throws RangeError if the template cannot be resampled.
	*/
	addTemplate(name, points, useRotation = true) {
		this.templates.push({
			name,
			points: this.preprocess(points, useRotation),
			useRotation
		});
	}
	/**
	* Preprocesses a list of points by resampling, optionally rotating to zero,
	* scaling to a standard size, and translating to the origin.
	* @param points - The list of points to preprocess.
	* @param useRotation - Whether to rotate the points to zero.
	* @returns The preprocessed list of points.
	* @throws RangeError if the stroke cannot be resampled.
	*/
	preprocess(points, useRotation = true) {
		const resampled = resample(points, 64);
		if (!resampled) throw new RangeError("Cannot normalize stroke: resampling failed.");
		points = resampled;
		if (useRotation) points = rotateToZero(points);
		return this.scaleAndTranslate(points);
	}
	/**
	* Scales points to a standard size and translates them to the origin.
	* @param points - The list of points to scale and translate.
	* @returns The scaled and translated list of points.
	*/
	scaleAndTranslate(points) {
		return translateTo(scaleTo(points, 250), {
			x: 0,
			y: 0
		});
	}
	/**
	* Calculates the confidence score based on the distance to the best matching template.
	* @param distance - The distance to the best matching template.
	* @returns The confidence score between 0 and 1.
	*/
	calculateConfidence(distance) {
		return 1 - distance / (.5 * Math.sqrt(125e3));
	}
};
var StrokeRecognitionOptions = class {
	constructor(options) {
		this.enabled = true;
		this.providerConfig = {
			/**
			* Backing provider that recognizes strokes.
			*  - 'onedollar': $1 Unistroke recognizer.
			*/
			provider: "onedollar",
			/**
			* Options specific to the 'onedollar' provider.
			*/
			onedollar: { supportedShapes: DEFAULT_SUPPORTED_SHAPES }
		};
		this.startDelay = .2;
		this.endDelay = .2;
		this.joint = "index-finger-tip";
		this.maxPoints = 1e3;
		deepMerge(this, options);
	}
	enable() {
		this.enabled = true;
		return this;
	}
};
/**
* Default options for controlling Lighting module features.
*/
var LightingOptions = class {
	constructor(options) {
		this.debugging = false;
		this.enabled = false;
		this.useAmbientSH = false;
		this.useDirectionalLight = false;
		this.castDirectionalLightShadow = false;
		this.useDynamicSoftShadow = false;
		deepMerge(this, options);
	}
};
var PhysicsOptions = class {
	constructor() {
		this.fps = 45;
		this.gravity = {
			x: 0,
			y: -9.81,
			z: 0
		};
		this.worldStep = true;
		this.useEventQueue = false;
	}
};
var SpeechSynthesizerOptions = class {
	constructor() {
		this.enabled = false;
		this.allowInterruptions = false;
	}
};
var SpeechRecognizerOptions = class {
	constructor() {
		this.enabled = true;
		this.lang = "en-US";
		this.continuous = false;
		this.commands = [];
		this.interimResults = false;
		this.commandConfidenceThreshold = .7;
		this.playSimulatorActivationSounds = true;
	}
};
var SoundOptions = class {
	constructor() {
		this.speechSynthesizer = new SpeechSynthesizerOptions();
		this.speechRecognizer = new SpeechRecognizerOptions();
	}
};
var MeshDetectionOptions = class {
	constructor(options) {
		this.showDebugVisualizations = false;
		this.enabled = false;
		if (options) deepMerge(this, options);
	}
	/**
	* Enables the mesh detector.
	*/
	enable() {
		this.enabled = true;
		return this;
	}
};
/**
* Configuration options for the ObjectDetector.
*/
var ObjectsOptions = class {
	constructor(options) {
		this.debugging = false;
		this.enabled = false;
		this.showDebugVisualizations = false;
		this.simulatorOverride = false;
		this.pollingIntervalMs = 0;
		this.objectImageMargin = .05;
		this.backendConfig = {
			/** The active backend to use for detection. */
			activeBackend: "gemini",
			gemini: {
				systemInstruction: `Please provide me with the bounding box coordinates for the primary objects in the given image, prioritizing objects that are nearby. For each bounding box, include ymin, xmin, ymax, and xmax. These coordinates should be absolute values ranging from 0 to 1000, corresponding to the image as if it were resized to 1000x1000 pixels. The origin (xmin:0; ymin:0) is the top-left corner of the image, and (xmax:1000; ymax:1000) is the bottom-right corner. List a maximum of 5 objects. Ignore hands and other human body parts, as well as any UI elements attached to them (e.g., a blue circle attached to a finger).`,
				/**
				* Extra Gemini generation config merged into the per-call config (over
				* the SDK defaults). Use to pin sampling parameters such as
				* `temperature: 0` for deterministic detections.
				*/
				generationConfig: {},
				responseSchema: {
					type: "ARRAY",
					items: {
						type: "OBJECT",
						required: [
							"objectName",
							"ymin",
							"xmin",
							"ymax",
							"xmax"
						],
						properties: {
							objectName: { type: "STRING" },
							ymin: { type: "NUMBER" },
							xmin: { type: "NUMBER" },
							ymax: { type: "NUMBER" },
							xmax: { type: "NUMBER" }
						}
					}
				}
			},
			/** Configuration for MediaPipe backend. */
			mediapipe: {
				wasmFilesUrl: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm",
				modelAssetPath: "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite2/int8/latest/efficientdet_lite2.tflite",
				scoreThreshold: .5
			}
		};
		if (options) deepMerge(this, options);
	}
	/**
	* Enables the object detector.
	*/
	enable() {
		this.enabled = true;
		return this;
	}
};
var PlanesOptions = class {
	constructor(options) {
		this.debugging = false;
		this.enabled = false;
		this.showDebugVisualizations = false;
		if (options) deepMerge(this, options);
	}
	enable() {
		this.enabled = true;
		return this;
	}
};
var SoundsOptions = class {
	constructor(options) {
		this.enabled = false;
		this.showDebugInfo = false;
		this.backendConfig = {
			activeBackend: "mediapipe",
			mediapipe: {
				wasmFilesUrl: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@0.10.35/wasm",
				modelAssetPath: "https://tfhub.dev/google/lite-model/yamnet/classification/tflite/1?lite-format=tflite",
				chunkSamples: 16e3
			}
		};
		if (options) deepMerge(this, options);
	}
	/**
	* Enables sound detection.
	*/
	enable() {
		this.enabled = true;
		return this;
	}
};
/**
* Configuration options for the Human Pose Detection system.
*/
var HumansOptions = class {
	constructor(options) {
		this.enabled = false;
		this.pollingIntervalMs = 0;
		this.useDepthProjection = true;
		this.backendConfig = {
			activeBackend: "mediapipe",
			mediapipe: {
				wasmFilesUrl: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
				modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task",
				/**
				* Run inference in a web worker so a detection pass does not stall the
				* render loop. The worker is limited to the CPU delegate because
				* MediaPipe only creates a GPU surface for a real DOM canvas, so set
				* this to false to trade a blocked main thread for GPU inference.
				* Falls back to the main thread automatically when workers are
				* unavailable.
				*/
				useWorker: true,
				/**
				* The maximum number of simultaneous human poses/bodies to track.
				*/
				numPoses: 1,
				/**
				* The minimum confidence score [0.0, 1.0] required for a pose to be detected.
				*/
				minPoseDetectionConfidence: .5,
				/**
				* The minimum confidence score [0.0, 1.0] required to confirm a pose is still present.
				*/
				minPosePresenceConfidence: .5,
				/**
				* The minimum confidence score [0.0, 1.0] required for tracking landmarks between frames.
				*/
				minTrackingConfidence: .5
			}
		};
		if (options) deepMerge(this, options);
	}
	enable() {
		this.enabled = true;
		return this;
	}
};
/**
* Configuration options for the Face Landmark Detection system.
*/
var FacesOptions = class {
	constructor(options) {
		this.enabled = false;
		this.pollingIntervalMs = 0;
		this.backendConfig = {
			activeBackend: "mediapipe",
			mediapipe: {
				wasmFilesUrl: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
				modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
				/**
				* The maximum number of simultaneous faces to track.
				*/
				numFaces: 1,
				/**
				* The minimum confidence score [0.0, 1.0] required for a face to be
				* detected.
				*/
				minFaceDetectionConfidence: .5,
				/**
				* The minimum confidence score [0.0, 1.0] required to confirm a face is
				* still present.
				*/
				minFacePresenceConfidence: .5,
				/**
				* The minimum confidence score [0.0, 1.0] required for tracking
				* landmarks between frames.
				*/
				minTrackingConfidence: .5,
				/**
				* Whether to compute and emit per-face blendshape weights (52
				* ARKit-compatible categories). Required for facial expression
				* mirroring, lipsync feeds, and avatar animation.
				*/
				outputFaceBlendshapes: true,
				/**
				* Whether to compute and emit the 4x4 facial transformation matrix
				* for each face. Provides a stable rigid head pose for parenting
				* objects to the head (glasses, masks, hats).
				*/
				outputFacialTransformationMatrixes: true
			}
		};
		if (options) deepMerge(this, options);
	}
	enable() {
		this.enabled = true;
		return this;
	}
};
/**
* Configuration options for the semantic segmentation system. Mirrors the
* other `world/*` perception options (humans, faces, objects).
*/
var SegmentationOptions = class {
	constructor(options) {
		this.enabled = false;
		this.pollingIntervalMs = 66;
		this.backendConfig = {
			activeBackend: "mediapipe",
			mediapipe: {
				wasmFilesUrl: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
				modelAssetPath: "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite",
				/**
				* Output the per-pixel category mask. Required to produce a
				* {@link SegmentationMask}.
				*/
				outputCategoryMask: true
			}
		};
		if (options) deepMerge(this, options);
	}
	enable() {
		this.enabled = true;
		return this;
	}
};
/**
* Builds the default storage key for a page.
*
* Scoped to the path because anchors are stored per origin: two apps served
* from one host would otherwise restore each other's anchors, which reads as
* mysterious content appearing on first run rather than as a shared store.
*
* @param pathname - Page path; omit when there is no document.
* @returns The storage key to default to.
*/
function defaultAnchorStorageKey(pathname) {
	if (!pathname) return "xrblocks.anchors";
	const withoutFile = pathname.replace(/\/[^/]*\.[^/]*$/, "/");
	return `xrblocks.anchors:${withoutFile.endsWith("/") ? withoutFile : `${withoutFile}/`}`;
}
/**
* Configuration for the spatial anchor subsystem.
*
* Anchors pin content to a real place so the platform keeps it there as its
* understanding of the room improves. With {@link AnchorsOptions.persistent}
* enabled, anchor handles are saved so the same content can be restored in a
* later session.
*/
var AnchorsOptions = class {
	constructor(options) {
		this.debugging = false;
		this.enabled = false;
		this.persistent = false;
		this.simulatorFallback = false;
		this.storageKey = defaultAnchorStorageKey(typeof location === "undefined" ? void 0 : location.pathname);
		this.maxStoredAnchors = 128;
		if (options) deepMerge(this, options);
	}
	/**
	* Enables anchors.
	* @returns This options object, for chaining.
	*/
	enable() {
		this.enabled = true;
		return this;
	}
	/**
	* Enables anchors and saves handles for restoration in later sessions.
	* @returns This options object, for chaining.
	*/
	enablePersistence() {
		this.enabled = true;
		this.persistent = true;
		return this;
	}
};
var WorldOptions = class {
	constructor(options) {
		this.debugging = false;
		this.enabled = false;
		this.initiateRoomCapture = false;
		this.planes = new PlanesOptions();
		this.objects = new ObjectsOptions();
		this.meshes = new MeshDetectionOptions();
		this.sounds = new SoundsOptions();
		this.humans = new HumansOptions();
		this.faces = new FacesOptions();
		this.segmentation = new SegmentationOptions();
		this.anchors = new AnchorsOptions();
		if (options) deepMerge(this, options);
	}
	/**
	* Enables plane detection.
	*/
	enablePlaneDetection() {
		this.enabled = true;
		this.planes.enable();
		return this;
	}
	/**
	* Enables object detection.
	*/
	enableObjectDetection() {
		this.enabled = true;
		this.objects.enable();
		return this;
	}
	/**
	* Enables mesh detection.
	*/
	enableMeshDetection() {
		this.enabled = true;
		this.meshes.enable();
		return this;
	}
	/**
	* Enables spatial anchors.
	*/
	enableAnchors() {
		this.enabled = true;
		this.anchors.enable();
		return this;
	}
	/**
	* Enables spatial anchors and saves their handles so anchored content can be
	* restored in a later session.
	*/
	enableAnchorPersistence() {
		this.enabled = true;
		this.anchors.enablePersistence();
		return this;
	}
	/**
	* Enables sound detection.
	*/
	enableSoundDetection() {
		this.enabled = true;
		this.sounds.enable();
		return this;
	}
	/**
	* Enables human detection.
	*/
	enableHumanDetection() {
		this.enabled = true;
		this.humans.enable();
		return this;
	}
	/**
	* Enables face landmark detection.
	*/
	enableFaceDetection() {
		this.enabled = true;
		this.faces.enable();
		return this;
	}
	/**
	* Enables semantic segmentation (person / background category masks).
	*/
	enableSegmentation() {
		this.enabled = true;
		this.segmentation.enable();
		return this;
	}
};
var OPTIONAL_REFERENCE_SPACES = [
	"local-floor",
	"bounded-floor",
	"unbounded"
];
/**
* Default options for XR controllers, which encompass hands by default in
* Android XR, mouse input on desktop, tracked controllers, and gamepads.
*/
var InputOptions = class {
	constructor() {
		this.enabled = true;
		this.enabledMouse = true;
		this.debug = false;
		this.visualization = false;
		this.visualizeRays = false;
	}
};
/**
* Default options for the reticle (pointing cursor).
*/
var ReticleOptions = class {
	constructor() {
		this.enabled = true;
		this.projectOnDepthMesh = false;
		this.defaultRenderDistance = 0;
	}
};
var InteractionOptions = class {
	constructor() {
		this.raycastMode = "continuous";
		this.longSelectDuration = .75;
	}
};
/**
* Options for the XR transition effect.
*/
var XRTransitionOptions = class {
	constructor() {
		this.enabled = false;
		this.transitionTime = .5;
		this.defaultBackgroundColor = 16777215;
	}
};
var FORM_FACTORS = [
	"auto",
	"xr",
	"hud",
	"vr",
	"desktop",
	"mobile"
];
var RENDERER_BACKENDS = [
	"webgl",
	"webgpu",
	"serializer"
];
/**
* A central configuration class for the entire XR Blocks system. It aggregates
* all settings and provides chainable methods for enabling common features.
*/
var Options = class {
	get formFactor() {
		return this._formFactor;
	}
	/**
	* Form factor is a preset that configures the experience for a specific
	* device type. Currently it only controls whether the simulator is enabled
	* and should always be autostarted.
	*/
	set formFactor(formFactor) {
		this._formFactor = formFactor;
		this.enableSimulator = formFactor === "desktop" || formFactor === "auto" || formFactor === "mobile";
		this.xrButton.alwaysAutostartSimulator = formFactor === "desktop";
		if (formFactor === "vr") this.enableVR();
	}
	/**
	* Constructs the Options object by merging default values with provided
	* custom options.
	* @param options - A custom options object to override the defaults.
	*/
	constructor(options) {
		this.antialias = true;
		this.logarithmicDepthBuffer = false;
		this.debugging = false;
		this.stencil = false;
		this.rendererBackend = "webgl";
		this.simulateAdditiveDisplay = false;
		this.simulatedDimming = 0;
		this.webxrRequiredFeatures = [];
		this.webxrOptionalFeatures = [...OPTIONAL_REFERENCE_SPACES];
		this.referenceSpaceType = "local-floor";
		this.controllers = new InputOptions();
		this.depth = new DepthOptions();
		this.lighting = new LightingOptions();
		this.deviceCamera = new DeviceCameraOptions();
		this.hands = new HandsOptions();
		this.gestures = new GestureRecognitionOptions();
		this.headGestures = new HeadGestureRecognitionOptions();
		this.strokes = new StrokeRecognitionOptions();
		this.reticles = new ReticleOptions();
		this.interaction = new InteractionOptions();
		this.sound = new SoundOptions();
		this.ai = new AIOptions();
		this.simulator = new SimulatorOptions();
		this.world = new WorldOptions();
		this.context = new ContextOptions();
		this.physics = new PhysicsOptions();
		this.layers = new LayersOptions();
		this.transition = new XRTransitionOptions();
		this.camera = {
			near: .01,
			far: 500
		};
		this.usePostprocessing = false;
		this.enableSimulator = true;
		this.catchScriptExceptions = true;
		this.xrButton = {
			appTitle: "",
			appDescription: "",
			enabled: true,
			startText: "Enter XR",
			endText: "Exit XR",
			invalidText: "XR Not Supported",
			startSimulatorText: "Enter Simulator",
			showEnterSimulatorButton: false,
			alwaysAutostartSimulator: false
		};
		this.permissions = {
			geolocation: false,
			camera: false,
			microphone: false
		};
		this.xrSessionMode = "immersive-ar";
		this._formFactor = "auto";
		deepMerge(this, options);
		this.parseUrlParams();
	}
	parseUrlParams() {
		const formFactorUrlParam = getUrlParameter("formFactor");
		if (formFactorUrlParam && FORM_FACTORS.includes(formFactorUrlParam)) this.formFactor = formFactorUrlParam;
		const rendererBackendUrlParam = getUrlParameter("rendererBackend");
		if (rendererBackendUrlParam && RENDERER_BACKENDS.includes(rendererBackendUrlParam)) this.rendererBackend = rendererBackendUrlParam;
		if (getUrlParamBool("forceWebGL")) this.webgpuOptions = {
			...this.webgpuOptions,
			forceWebGL: true
		};
		if (getUrlParamBool("xrAutomation")) this.enableAutomationMode();
	}
	/**
	* Configures Core to use THREE.WebGPURenderer instead of THREE.WebGLRenderer.
	* @param options - Optional WebGPU renderer settings such as `forceWebGL`.
	*/
	enableWebGPU(options) {
		this.rendererBackend = "webgpu";
		this.webgpuOptions = options;
		return this;
	}
	/**
	* Configures Core to use a SplitEngineSerializer renderer backend instead of
	* THREE.WebGLRenderer.
	* @param serializer - Optional SplitEngineSerializer instance or factory function.
	*/
	enableSerializer(serializer) {
		this.rendererBackend = "serializer";
		if (serializer !== void 0) this.serializer = serializer;
		return this;
	}
	/**
	* Alias for `enableSerializer` that configures Core to use a
	* SplitEngineSerializer renderer backend.
	* @param serializer - Optional SplitEngineSerializer instance or factory function.
	*/
	useSerializer(serializer) {
		return this.enableSerializer(serializer);
	}
	/**
	* Sets the session mode to VR and disables the simulator passthrough scene.
	*/
	enableVR() {
		this.xrSessionMode = "immersive-vr";
		return this;
	}
	/**
	* Enables a standard simulator-driven setup for automation and external test
	* harnesses.
	* @returns The instance for chaining.
	*/
	enableAutomationMode(config = {}) {
		const { hideSimulatorUi = true, defaultHand = 1, defaultMode = "Navigation", enableHands = true, enableCamera = true } = config;
		this.formFactor = "desktop";
		this.xrButton.enabled = false;
		this.xrButton.alwaysAutostartSimulator = true;
		if (enableHands) this.enableHands();
		if (enableCamera) this.enableCamera();
		this.enableContext();
		this.simulator.defaultMode = defaultMode;
		this.simulator.defaultHand = defaultHand;
		if (hideSimulatorUi) {
			this.simulator.simulatorSettingsPanel.enabled = false;
			this.simulator.instructions.enabled = false;
			this.simulator.instructions.overlayEnabled = false;
			this.simulator.handPosePanel.enabled = false;
		}
		return this;
	}
	/**
	* Enables reticles for visualizing targets of hand rays in WebXR.
	* @returns The instance for chaining.
	*/
	enableReticles() {
		this.reticles.enabled = true;
		return this;
	}
	/**
	* Enables depth sensing in WebXR with default options.
	* @returns The instance for chaining.
	*/
	enableDepth() {
		this.depth = new DepthOptions(xrDepthMeshOptions);
		return this;
	}
	/**
	* Enables WebXR composition layers.
	*
	* Content presented as a layer is composited once at its own resolution
	* rather than being drawn into the eye buffer and resampled again, so video
	* and text come out sharper, and the compositor keeps reprojecting it to the
	* latest head pose even when the app's own frame rate dips.
	*
	* Requested optionally, and each layer falls back to ordinary in-scene
	* rendering where the platform cannot present one.
	*
	* @returns The instance for chaining.
	*/
	enableLayers() {
		this.layers.enabled = true;
		return this;
	}
	/**
	* Enables plane detection.
	* @returns The instance for chaining.
	*/
	enablePlaneDetection() {
		this.world.enablePlaneDetection();
		return this;
	}
	/**
	* Enables object detection.
	* @returns The instance for chaining.
	*/
	enableObjectDetection() {
		this.permissions.camera = true;
		this.world.enableObjectDetection();
		return this;
	}
	/**
	* Enables human pose detection.
	* @returns The instance for chaining.
	*/
	enableHumanDetection() {
		this.permissions.camera = true;
		this.enableCamera();
		this.enableDepth();
		this.world.enableHumanDetection();
		return this;
	}
	/**
	* Enables face landmark detection. Provides 478 per-face landmarks in
	* world space, optional 52 ARKit-style blendshape weights, and an
	* optional rigid 4x4 facial transformation matrix per detected face.
	* @returns The instance for chaining.
	*/
	enableFaceDetection() {
		this.permissions.camera = true;
		this.enableCamera();
		this.enableDepth();
		this.world.enableFaceDetection();
		return this;
	}
	/**
	* Enables semantic segmentation. Produces per-pixel person / background
	* category masks from the device camera (MediaPipe, on-device). Unlike face
	* and human detection it does not require depth.
	* @returns The instance for chaining.
	*/
	enableSegmentation() {
		this.permissions.camera = true;
		this.enableCamera();
		this.world.enableSegmentation();
		return this;
	}
	/**
	* Enables device camera (passthrough) with a specific facing mode.
	* @param facingMode - The desired camera facing mode, either 'environment' or
	*     'user'.
	* @returns The instance for chaining.
	*/
	enableCamera(facingMode = "environment") {
		this.permissions.camera = true;
		this.deviceCamera = new DeviceCameraOptions(facingMode === "environment" ? xrDeviceCameraEnvironmentOptions : xrDeviceCameraUserOptions);
		return this;
	}
	/**
	* Enables hand tracking.
	* @returns The instance for chaining.
	*/
	enableHands() {
		this.hands.enabled = true;
		return this;
	}
	/**
	* Enables the gesture recognition block and ensures hands are available.
	* @returns The instance for chaining.
	*/
	enableGestures() {
		this.enableHands();
		this.gestures.enable();
		return this;
	}
	/**
	* Enables completed nod and shake recognition from the user's head pose.
	* @returns The instance for chaining.
	*/
	enableHeadGestures() {
		this.headGestures.enable();
		return this;
	}
	/**
	* Enables the stroke recognition block and ensures gestures are available.
	* @returns The instance for chaining.
	*/
	enableStrokes() {
		this.enableGestures();
		this.strokes.enable();
		return this;
	}
	/**
	* Enables the visualization of rays for hand tracking.
	* @returns The instance for chaining.
	*/
	enableHandRays() {
		this.controllers.visualizeRays = true;
		return this;
	}
	/**
	* Enables a standard set of AI features, including Gemini Live.
	* @returns The instance for chaining.
	*/
	enableAI() {
		this.ai.enabled = true;
		this.ai.gemini.enabled = true;
		return this;
	}
	/**
	* Enables agent-facing context detectors such as semantic trees,
	* view visibility, and Set-of-Mark observations.
	* @returns The instance for chaining.
	*/
	enableContext() {
		this.context.enable();
		return this;
	}
	/**
	* Enables agent-facing scene context.
	* @returns The instance for chaining.
	*/
	enableSceneContext() {
		this.context.enableScene();
		return this;
	}
	/**
	* Enables agent-facing visible objects context.
	* @returns The instance for chaining.
	*/
	enableVisibleObjectsContext() {
		this.context.enableVisibleObjects();
		return this;
	}
	/**
	* Enables agent-facing Set-of-Mark context.
	* @returns The instance for chaining.
	*/
	enableSetOfMarkContext() {
		this.context.enableSetOfMark();
		return this;
	}
	/**
	* Enables the XR transition component for toggling VR.
	* @returns The instance for chaining.
	*/
	enableXRTransitions() {
		this.transition.enabled = true;
		return this;
	}
	/**
	* Enables input from hands and controllers.
	* Note that this is enabled by default and can also be changed at runtime with
	* xb.core.input.enableControllers() and xb.core.input.disableControllers().
	* @returns The instance for chaining.
	*/
	enableControllers() {
		this.controllers.enabled = true;
		return this;
	}
	/**
	* Sets the title of the app to be displayed above the XR button.
	* @param title - The title of the app.
	* @returns The instance for chaining.
	*/
	setAppTitle(title) {
		this.xrButton.appTitle = title;
		return this;
	}
	/**
	* Sets the description of the app to be displayed above the XR button.
	* @param description - The description of the app.
	* @returns The instance for chaining.
	*/
	setAppDescription(description) {
		this.xrButton.appDescription = description;
		return this;
	}
	/**
	* Sets the WebXR framebuffer scale factor (a numeric multiplier or `'native'`
	* to use `XRWebGLLayer.getNativeFramebufferScaleFactor(session)`).
	* @param scaleFactor - Numeric scale factor or `'native'`.
	* @returns The instance for chaining.
	*/
	setFramebufferScaleFactor(scaleFactor) {
		this.framebufferScaleFactor = scaleFactor;
		return this;
	}
};
/**
* Checks if a given object is a descendant of another object in the scene
* graph. This function is useful for determining if an interaction (like a
* raycast hit) has occurred on a component that is part of a larger, complex
* entity.
*
* It uses an iterative approach to traverse up the hierarchy from the child.
*
* @param child - The potential descendant object.
* @param parent - The potential ancestor object.
* @returns True if `child` is the same as `parent` or is a descendant of
*     `parent`.
*/
function objectIsDescendantOf(child, parent) {
	let currentNode = child;
	while (currentNode) {
		if (currentNode === parent) return true;
		currentNode = currentNode.parent;
	}
	return false;
}
/**
* Traverses the scene graph from a given node, calling a callback function for
* each node. The traversal stops if the callback returns true.
*
* This function is similar to THREE.Object3D.traverse, but allows for early
* exit from the traversal based on the callback's return value.
*
* @param node - The starting node for the traversal.
* @param callback - The function to call for each node. It receives the current
*     node as an argument. If the callback returns `true`, the traversal will
*     stop.
* @returns Whether the callback returned true for any node.
*/
function traverseUtil(node, callback) {
	if (callback(node)) return true;
	for (const child of node.children) if (traverseUtil(child, callback)) return true;
	return false;
}
/**
* Gets a world-space point on an object's rendered geometry near a reference
* position. Falls back to the object's world position when it has no mesh
* triangles. `closest` measures from `from`; `center` measures from the
* object's world bounding-box center.
* UI elements use the center of their rendered bounds.
*/
function getObjectTargetPoint(object, from, out, mode = "closest") {
	const presentation = getUIPresentationObject(object);
	const renderedObject = presentation ?? object;
	renderedObject.updateWorldMatrix(true, true);
	if (presentation || isUIPresentationObject(object)) {
		const bounds = new Box3();
		const clippedBounds = getUIPresentationBounds(object, bounds);
		if (clippedBounds === null) return renderedObject.getWorldPosition(out);
		if (clippedBounds === void 0) bounds.setFromObject(renderedObject, true);
		if (!bounds.isEmpty()) return bounds.getCenter(out);
	}
	const reference = mode === "center" ? new Box3().setFromObject(renderedObject, true).getCenter(new Vector3()) : from;
	let closestDistanceSquared = Infinity;
	const a = new Vector3();
	const b = new Vector3();
	const c = new Vector3();
	const centroid = new Vector3();
	renderedObject.traverse((child) => {
		if (!(child instanceof Mesh) || !child.visible) return;
		const position = child.geometry.getAttribute("position");
		if (!position) return;
		const index = child.geometry.index;
		const vertexCount = index?.count ?? position.count;
		for (let offset = 0; offset + 2 < vertexCount; offset += 3) {
			child.getVertexPosition(index?.getX(offset) ?? offset, a);
			child.getVertexPosition(index?.getX(offset + 1) ?? offset + 1, b);
			child.getVertexPosition(index?.getX(offset + 2) ?? offset + 2, c);
			a.applyMatrix4(child.matrixWorld);
			b.applyMatrix4(child.matrixWorld);
			c.applyMatrix4(child.matrixWorld);
			centroid.copy(a).add(b).add(c).multiplyScalar(1 / 3);
			const distanceSquared = centroid.distanceToSquared(reference);
			if (distanceSquared < closestDistanceSquared) {
				closestDistanceSquared = distanceSquared;
				out.copy(centroid);
			}
		}
	});
	return closestDistanceSquared < Infinity ? out : object.getWorldPosition(out);
}
/**
* Converts registered-bounds contacts into source-neutral contact phases.
* Interaction owns callback dispatch, capture, completion, and cancellation.
*/
var DirectTouch = class DirectTouch {
	static {
		this.EXIT_PADDING = .01;
	}
	constructor(registry, resolver) {
		this.registry = registry;
		this.resolver = resolver;
		this.active = /* @__PURE__ */ new Map();
		this.awaitingExit = /* @__PURE__ */ new Set();
		this.contacts = [];
		this.present = /* @__PURE__ */ new Set();
	}
	update(inputs) {
		this.contacts.length = 0;
		this.present.clear();
		for (const input of inputs) {
			this.present.add(input.controller);
			const previous = this.active.get(input.controller);
			const resolved = previous?.captureRegion ? this.registry.containsPoint(previous.captureRegion, input.point, DirectTouch.EXIT_PADDING) ? {
				...previous.resolved,
				intersection: {
					...previous.resolved.intersection,
					point: input.point.clone()
				}
			} : void 0 : this.resolver.resolve(this.registry.intersectionsAt(input.point, previous ? DirectTouch.EXIT_PADDING : 0, previous?.resolved.hitObject), "direct-touch");
			if (this.awaitingExit.has(input.controller)) {
				if (!resolved) this.awaitingExit.delete(input.controller);
				continue;
			}
			if (!previous && !resolved?.target) continue;
			if (!previous && resolved?.target) {
				const active = {
					resolved,
					handIndex: input.handIndex,
					hand: input.hand,
					point: input.point.clone()
				};
				this.active.set(input.controller, active);
				this.contacts.push({
					phase: "start",
					controller: input.controller,
					resolved,
					handIndex: input.handIndex,
					hand: input.hand,
					point: input.point,
					orientation: input.orientation,
					selected: input.selected
				});
			} else if (previous && resolved && resolved.target === previous.resolved.target) {
				previous.resolved = resolved;
				previous.point.copy(input.point);
				this.contacts.push({
					phase: "move",
					controller: input.controller,
					resolved,
					handIndex: input.handIndex,
					hand: input.hand,
					point: input.point,
					orientation: input.orientation,
					selected: input.selected
				});
			} else if (previous) {
				if (resolved) this.awaitingExit.add(input.controller);
				this.contacts.push(this.endContact(input.controller, input.selected, resolved?.target ? "target-changed" : "left-target", input.handIndex, input.hand, input.point, input.orientation));
			}
		}
		for (const controller of this.active.keys()) if (!this.present.has(controller)) this.contacts.push(this.endContact(controller, false, "source-lost"));
		for (const controller of this.awaitingExit) if (!this.present.has(controller)) this.awaitingExit.delete(controller);
		return this.contacts;
	}
	remove(controller) {
		this.awaitingExit.delete(controller);
		return this.active.has(controller) ? this.endContact(controller, false, "source-lost") : void 0;
	}
	has(controller) {
		return this.active.has(controller);
	}
	/** A scroll candidate keeps contact with its viewport as children move. */
	setCaptureRegion(controller, region) {
		const contact = this.active.get(controller);
		if (contact) contact.captureRegion = region;
	}
	clear() {
		this.active.clear();
		this.awaitingExit.clear();
		this.contacts.length = 0;
		this.present.clear();
	}
	endContact(controller, selected, endReason, handIndex, hand, point, orientation) {
		const previous = this.active.get(controller);
		this.active.delete(controller);
		return {
			phase: "end",
			controller,
			handIndex: handIndex ?? previous.handIndex,
			hand: hand ?? previous.hand,
			point: point ?? previous.point,
			orientation,
			selected,
			endReason
		};
	}
};
var DWELL_SECONDS = 1.5;
var MOVEMENT_THRESHOLD = .2;
/** Tracks stable gaze time for each source and emits one completion per target. */
var GazeDwell = class {
	constructor() {
		this.states = /* @__PURE__ */ new Map();
	}
	update(controller, resolved, deltaSeconds, paused = false) {
		const target = resolved?.target;
		const point = target ? resolved?.intersection.point : void 0;
		let state = this.states.get(controller);
		if (!state || state.target !== target) {
			state = {
				target,
				elapsed: 0,
				lastPoint: point?.clone(),
				armed: true
			};
			this.states.set(controller, state);
			return {
				progress: 0,
				completed: false
			};
		}
		if (!target || !point) return {
			progress: 0,
			completed: false
		};
		if (paused) {
			state.lastPoint?.copy(point);
			return {
				progress: state.elapsed / DWELL_SECONDS,
				completed: false
			};
		}
		if (!state.armed) {
			state.lastPoint?.copy(point);
			return {
				progress: 1,
				completed: false
			};
		}
		const delta = Math.max(0, deltaSeconds);
		const movement = (state.lastPoint?.distanceTo(point) ?? 0) / Math.max(delta, Number.EPSILON);
		state.lastPoint ??= point.clone();
		state.lastPoint.copy(point);
		if (movement > MOVEMENT_THRESHOLD) state.elapsed = 0;
		else state.elapsed = Math.min(DWELL_SECONDS, state.elapsed + delta);
		const completed = state.elapsed === DWELL_SECONDS;
		if (completed) state.armed = false;
		return {
			progress: state.elapsed / DWELL_SECONDS,
			completed
		};
	}
	remove(controller) {
		this.states.delete(controller);
	}
};
var POINT_AND_LINE_THRESHOLD_METERS = .01;
/** Owns physical hit registration, collection, and logical mapping. */
var HitRegistry = class {
	constructor(camera) {
		this.raycaster = new Raycaster();
		this.mappings = /* @__PURE__ */ new WeakMap();
		this.registered = /* @__PURE__ */ new Set();
		this.touchCandidates = /* @__PURE__ */ new Map();
		if (camera) this.raycaster.camera = camera;
		this.raycaster.params.Line = { threshold: POINT_AND_LINE_THRESHOLD_METERS };
		this.raycaster.params.Points = { threshold: POINT_AND_LINE_THRESHOLD_METERS };
	}
	register(physical, logical, options = {}) {
		const entry = {
			physical,
			logical,
			...options
		};
		this.mappings.set(physical, entry);
		this.registered.add(entry);
		this.touchCandidates.set(physical, entry);
		return () => {
			if (this.mappings.get(physical) === entry) this.mappings.delete(physical);
			this.registered.delete(entry);
			if (this.touchCandidates.get(physical) === entry) this.touchCandidates.delete(physical);
		};
	}
	setWorldTouchCandidates(objects) {
		const next = new Set(objects);
		for (const [physical, entry] of this.touchCandidates) if (!this.registered.has(entry)) this.touchCandidates.delete(physical);
		for (const object of next) {
			if (this.touchCandidates.has(object)) continue;
			this.touchCandidates.set(object, {
				physical: object,
				logical: object
			});
		}
		for (const [physical, entry] of this.touchCandidates) {
			if (this.registered.has(entry)) continue;
			if (!next.has(physical)) this.touchCandidates.delete(physical);
		}
	}
	resolve(object) {
		let current = object;
		while (current) {
			const mapping = this.mappings.get(current);
			if (mapping) return mapping;
			current = current.parent;
		}
		return {
			physical: object,
			logical: object
		};
	}
	find(logical) {
		for (const entry of this.registered) if (entry.logical === logical) return entry;
	}
	containsPoint(physical, point, padding = 0) {
		if (physical.xb?.pointerEvents === "none" || !effectiveVisible(physical)) return false;
		const box = new Box3().setFromObject(physical);
		if (padding > 0) box.expandByScalar(padding);
		return !box.isEmpty() && box.containsPoint(point) && this.resolve(physical).containsPoint?.(point, padding) !== false;
	}
	/** Collects ordered raw hits from the public scene and detached surfaces. */
	raycast(scene, ray, intersections) {
		intersections.length = 0;
		this.raycaster.ray.copy(ray);
		intersectTree(scene, this.raycaster, intersections);
		let publicCount = 0;
		for (const intersection of intersections) {
			if (hasPrivateAncestor$1(intersection.object)) continue;
			intersections[publicCount++] = intersection;
		}
		intersections.length = publicCount;
		for (const { physical } of this.registered) {
			if (physical.xb?.pointerEvents === "none") continue;
			if (this.isBelowScene(physical, scene) && !hasPrivateAncestor$1(physical)) continue;
			if (!effectiveVisible(physical)) continue;
			if (!physical.layers.test(this.raycaster.layers)) continue;
			physical.updateWorldMatrix(true, false);
			physical.raycast(this.raycaster, intersections);
		}
		intersections.sort(compareRayIntersections);
		return intersections;
	}
	intersectionsAt(point, padding = 0, preferred) {
		const intersections = [];
		const box = new Box3();
		const center = new Vector3();
		for (const { physical, containsPoint, touchTarget } of this.touchCandidates.values()) {
			if (physical.xb?.pointerEvents === "none") continue;
			if (!effectiveVisible(physical)) continue;
			try {
				box.setFromObject(physical);
			} catch {
				continue;
			}
			if (padding > 0) box.expandByScalar(padding);
			if (box.isEmpty() || !box.containsPoint(point)) continue;
			if (containsPoint?.(point, padding) === false) continue;
			intersections.push({
				distance: box.getCenter(center).distanceTo(point),
				object: touchTarget?.(point) ?? physical,
				point: point.clone()
			});
		}
		intersections.sort((a, b) => compareTouchIntersections(a, b, preferred));
		return intersections;
	}
	isBelowScene(object, scene) {
		let current = object.parent;
		while (current) {
			if (current === scene) return true;
			current = current.parent;
		}
		return false;
	}
};
/** Recursively raycasts interactive scene branches. */
function intersectTree(object, raycaster, intersections) {
	if (object.userData.xrblocksPrivate === true) return;
	if (object.xb?.pointerEvents === "none") return;
	if (object.layers.test(raycaster.layers)) object.raycast(raycaster, intersections);
	for (const child of object.children) intersectTree(child, raycaster, intersections);
}
function compareRayIntersections(a, b) {
	const aOverlay = isOverlayHit(a.object);
	if (aOverlay !== isOverlayHit(b.object)) return aOverlay ? -1 : 1;
	const distance = a.distance - b.distance;
	if (distance !== 0) return distance;
	if (a.object.renderOrder !== b.object.renderOrder) return b.object.renderOrder - a.object.renderOrder;
	return b.object.id - a.object.id;
}
function compareTouchIntersections(a, b, preferred) {
	if (a.object === b.object) return 0;
	if (a.object === preferred) return -1;
	if (b.object === preferred) return 1;
	const aOverlay = isOverlayHit(a.object);
	if (aOverlay !== isOverlayHit(b.object)) return aOverlay ? -1 : 1;
	const aOrder = getInteractionHitOrder(a.object);
	const bOrder = getInteractionHitOrder(b.object);
	if (aOrder !== void 0 && bOrder !== void 0 && aOrder !== bOrder) return bOrder - aOrder;
	return a.distance - b.distance;
}
function getInteractionHitOrder(object) {
	let current = object;
	while (current) {
		const order = current.userData.xrblocksHitOrder;
		if (typeof order === "number") return order;
		current = current.parent;
	}
}
function isOverlayHit(object) {
	let current = object;
	while (current) {
		if (current.userData.xrblocksOverlay === true) return true;
		current = current.parent;
	}
	return false;
}
function hasPrivateAncestor$1(object) {
	let current = object;
	while (current) {
		if (current.userData.xrblocksPrivate === true) return true;
		current = current.parent;
	}
	return false;
}
function effectiveVisible(object) {
	let current = object;
	while (current) {
		if (!current.visible) return false;
		current = current.parent;
	}
	return true;
}
function cloneIntersection(intersection) {
	return {
		...intersection,
		point: intersection.point.clone(),
		normal: intersection.normal?.clone(),
		uv: intersection.uv?.clone(),
		uv1: intersection.uv1?.clone()
	};
}
/** Resolves one ordered raw hit list into one blocking surface and target. */
var HitResolver = class {
	constructor(callbacks, manipulation, registry = new HitRegistry()) {
		this.callbacks = callbacks;
		this.manipulation = manipulation;
		this.registry = registry;
	}
	resolve(intersections, sourceType) {
		for (const rawIntersection of intersections) {
			const registered = this.registry.resolve(rawIntersection.object);
			if (registered.physical.xb?.pointerEvents === "none") continue;
			if (registered.containsPoint?.(rawIntersection.point) === false) continue;
			if (registered.logical === rawIntersection.object && hasPrivateAncestor(rawIntersection.object)) continue;
			const surface = registered.logical;
			const objectPath = this.getObjectPath(surface);
			if (this.isExcluded(objectPath)) continue;
			const eligiblePath = this.getEligiblePath(objectPath);
			const semanticCandidate = eligiblePath.find(isSemanticControl);
			const disabledSemantic = semanticCandidate !== void 0 && isSemanticControlDisabled(semanticCandidate);
			const scrollFallback = disabledSemantic ? eligiblePath.find((object) => getSemanticControl(object)?.kind === "scroll" && !isSemanticControlDisabled(object)) : void 0;
			const semanticControl = disabledSemantic ? scrollFallback : semanticCandidate;
			const physicalHandle = registered.physical !== eligiblePath[0] && registered.physical.xb?.manipulationHandle !== void 0 ? registered.physical : void 0;
			const manipulation = semanticCandidate ? void 0 : this.manipulation.resolve(physicalHandle ? [physicalHandle, ...eligiblePath] : eligiblePath);
			const callbackTarget = eligiblePath.find((object) => this.callbacks.hasTargetHandler(object, sourceType));
			const target = disabledSemantic && !scrollFallback ? void 0 : semanticControl ?? this.nearestTarget(eligiblePath, callbackTarget, manipulation?.owner);
			const scriptPath = target ? eligiblePath.filter((object) => this.callbacks.isScript(object)) : [];
			return {
				intersection: {
					...cloneIntersection(rawIntersection),
					object: surface
				},
				hitObject: rawIntersection.object,
				surface,
				target,
				scriptPath: Object.freeze(scriptPath),
				objectPath: Object.freeze(objectPath),
				reticleMode: this.getReticleMode(objectPath),
				semanticControl,
				manipulation
			};
		}
	}
	getObjectPath(surface) {
		const path = [];
		let object = surface;
		while (object) {
			path.push(object);
			object = object.parent;
		}
		return path;
	}
	isExcluded(path) {
		return path.some((object) => object.visible === false || object.xb?.pointerEvents === "none");
	}
	getEligiblePath(objectPath) {
		const barrierIndex = objectPath.findIndex((object) => object.xb?.interactionEnabled === false);
		return barrierIndex < 0 ? [...objectPath] : objectPath.slice(0, barrierIndex);
	}
	nearestTarget(path, callbackTarget, manipulationOwner) {
		if (!callbackTarget) return manipulationOwner;
		if (!manipulationOwner) return callbackTarget;
		return path.indexOf(callbackTarget) <= path.indexOf(manipulationOwner) ? callbackTarget : manipulationOwner;
	}
	getReticleMode(path) {
		for (const object of path) {
			const mode = object.xb?.reticleMode;
			if (mode === "auto" || mode === "surface" || mode === "hidden") return mode;
		}
		return "auto";
	}
};
function hasPrivateAncestor(object) {
	let current = object;
	while (current) {
		if (current.userData.xrblocksPrivate === true) return true;
		current = current.parent;
	}
	return false;
}
/** Mutable internal storage for one controller's current logical source. */
var InteractionSourceState = class {
	constructor(controller) {
		this.controller = controller;
		this.sourceType = "controller-ray";
		this.position = new Vector3();
		this.orientation = new Quaternion();
		this.rayValue = new Ray();
		this.selected = false;
		this.source = getInteractionSource(controller, this.sourceType);
	}
	updateRay(input) {
		this.source = getInteractionSource(this.controller, input.sourceType);
		this.sourceType = input.sourceType;
		if (input.position) this.position.copy(input.position);
		else this.controller.getWorldPosition(this.position);
		if (input.orientation) this.orientation.copy(input.orientation);
		else this.controller.getWorldQuaternion(this.orientation);
		this.rayValue.copy(input.ray);
		this.ray = this.rayValue;
		this.selected = input.sourceType === "gaze" ? false : input.selected;
		this.selectionProgress = void 0;
		return this;
	}
	updateTouch(point, orientation) {
		this.source = getInteractionSource(this.controller, "direct-touch");
		this.sourceType = "direct-touch";
		this.position.copy(point);
		if (orientation) this.orientation.copy(orientation);
		else this.controller.getWorldQuaternion(this.orientation);
		this.ray = void 0;
		this.selected = true;
		this.selectionProgress = void 0;
		return this;
	}
	copyFrom(source) {
		this.source = source.source;
		this.sourceType = source.sourceType;
		this.position.copy(source.position);
		this.orientation.copy(source.orientation);
		if (source.ray) {
			this.rayValue.copy(source.ray);
			this.ray = this.rayValue;
		} else this.ray = void 0;
		this.selected = source.selected;
		this.selectionProgress = source.selectionProgress;
		return this;
	}
};
var PUBLIC_SOURCES = /* @__PURE__ */ new WeakMap();
/** Returns one stable public source for a controller and modality. */
function getInteractionSource(controller, type) {
	let byType = PUBLIC_SOURCES.get(controller);
	if (!byType) {
		byType = /* @__PURE__ */ new Map();
		PUBLIC_SOURCES.set(controller, byType);
	}
	const source = byType.get(type);
	if (source) return source;
	const created = Object.freeze({
		type,
		controller,
		get handedness() {
			const value = controller.inputSource?.handedness;
			return value === "left" || value === "right" ? value : "none";
		}
	});
	byType.set(type, created);
	return created;
}
function dispatchInteractionPath(callbacks, path, hook, argument) {
	const state = { stopped: false };
	const event = eventWithPropagation(argument, state);
	for (const script of path) {
		callbacks.invokeTarget(script, hook, event);
		if (state.stopped) return;
	}
}
function eventWithPropagation(argument, state) {
	if (!argument || typeof argument !== "object") return argument;
	const event = Object.create(Object.getPrototypeOf(argument));
	Object.defineProperties(event, Object.getOwnPropertyDescriptors(argument));
	Object.defineProperty(event, "stopPropagation", {
		enumerable: true,
		configurable: true,
		value() {
			state.stopped = true;
		}
	});
	return event;
}
function selectionInvalidReason(selection, ancestry, semanticDisabled) {
	const ownerIndex = ancestry.indexOf(selection.owner);
	if (ownerIndex < 0) return "removed";
	for (let index = 0; index + 1 < ancestry.length; index++) if (ancestry[index].parent !== ancestry[index + 1]) return "removed";
	for (let index = 0; index < ancestry.length; index++) if (ancestry[index].visible === false) return "hidden";
	if (semanticDisabled) return "disabled";
	for (let index = 0; index < ancestry.length; index++) {
		const object = ancestry[index];
		if (object.xb?.pointerEvents === "none") return "disabled";
		if (index <= ownerIndex && object.xb?.interactionEnabled === false) return "disabled";
	}
}
/** Captures a mesh's local XY plane for continued pointer projection. */
function createPlanarSurfaceProjector(surface) {
	if (!(surface instanceof Mesh)) return void 0;
	surface.geometry.computeBoundingBox();
	const bounds = surface.geometry.boundingBox?.clone();
	if (!bounds || !hasFinitePlanarBounds(bounds)) return void 0;
	const width = bounds.max.x - bounds.min.x;
	const height = bounds.max.y - bounds.min.y;
	const plane = new Plane(new Vector3(0, 0, 1), -(bounds.min.z + bounds.max.z) / 2);
	const worldToLocal = new Matrix4();
	const localRay = new Ray();
	const localPoint = new Vector3();
	return (ray) => {
		surface.updateWorldMatrix(true, false);
		if (Math.abs(surface.matrixWorld.determinant()) < Number.EPSILON) return;
		worldToLocal.copy(surface.matrixWorld).invert();
		localRay.copy(ray).applyMatrix4(worldToLocal);
		if (!localRay.intersectPlane(plane, localPoint)) return void 0;
		return {
			point: localPoint.clone().applyMatrix4(surface.matrixWorld),
			uv: new Vector2((localPoint.x - bounds.min.x) / width, (localPoint.y - bounds.min.y) / height)
		};
	};
}
/** Supplies the same UV contract for a tracked contact as for a captured ray. */
function projectPointOnSurface(surface, point) {
	if (!(surface instanceof Mesh)) return void 0;
	surface.geometry.computeBoundingBox();
	const bounds = surface.geometry.boundingBox;
	if (!bounds || !hasFinitePlanarBounds(bounds)) return void 0;
	surface.updateWorldMatrix(true, false);
	if (Math.abs(surface.matrixWorld.determinant()) < Number.EPSILON) return void 0;
	const local = surface.worldToLocal(point.clone());
	local.z = (bounds.min.z + bounds.max.z) / 2;
	return {
		point: local.clone().applyMatrix4(surface.matrixWorld),
		uv: new Vector2((local.x - bounds.min.x) / (bounds.max.x - bounds.min.x), (local.y - bounds.min.y) / (bounds.max.y - bounds.min.y))
	};
}
function hasFinitePlanarBounds(bounds) {
	return Number.isFinite(bounds.min.x) && Number.isFinite(bounds.max.x) && Number.isFinite(bounds.min.y) && Number.isFinite(bounds.max.y) && Number.isFinite(bounds.min.z) && Number.isFinite(bounds.max.z) && bounds.max.x > bounds.min.x && bounds.max.y > bounds.min.y;
}
var NORMAL_MATRIX = new Matrix3();
var WORLD_NORMAL = new Vector3();
/** Presents resolved state. It never performs a raycast or changes targeting. */
var ReticlePresenter = class {
	constructor(options = new ReticleOptions()) {
		this.options = options;
	}
	present(snapshot, resolved) {
		const reticle = snapshot.controller.reticle;
		if (!reticle) return;
		const ray = snapshot.ray;
		if (!ray) {
			this.clear(snapshot.controller);
			return;
		}
		reticle.direction.copy(ray.direction).normalize();
		if (snapshot.selectionProgress === void 0) reticle.setPressed(snapshot.selected);
		else reticle.setPressedAmount(snapshot.selectionProgress);
		if (resolved?.reticleMode === "hidden") {
			this.clear(snapshot.controller);
			return;
		}
		const beyondPresentationRange = resolved && this.options.maxDistance !== void 0 && resolved.intersection.distance >= this.options.maxDistance;
		if (!resolved || beyondPresentationRange) {
			reticle.intersection = void 0;
			reticle.targetObject = void 0;
			reticle.setHovering(false);
			if (this.options.defaultRenderDistance <= 0) {
				reticle.visible = false;
				return;
			}
			reticle.visible = true;
			reticle.position.copy(ray.origin).addScaledVector(reticle.direction, this.options.defaultRenderDistance);
			WORLD_NORMAL.copy(reticle.direction).negate();
			reticle.setRotationFromNormalVector(WORLD_NORMAL);
			return;
		}
		const { intersection } = resolved;
		reticle.visible = true;
		reticle.intersection = intersection;
		const showsTarget = resolved.reticleMode === "auto";
		reticle.targetObject = showsTarget ? resolved.target : void 0;
		reticle.setHovering(showsTarget && resolved.target !== void 0);
		reticle.position.copy(intersection.point);
		if (intersection.normal) {
			resolved.hitObject.updateWorldMatrix(true, false);
			NORMAL_MATRIX.getNormalMatrix(resolved.hitObject.matrixWorld);
			WORLD_NORMAL.copy(intersection.normal).applyMatrix3(NORMAL_MATRIX).normalize();
		} else WORLD_NORMAL.copy(ray.direction).negate().normalize();
		reticle.setRotationFromNormalVector(WORLD_NORMAL);
	}
	clear(controller) {
		if (!controller.reticle) return;
		controller.reticle.visible = false;
		controller.reticle.intersection = void 0;
		controller.reticle.targetObject = void 0;
		controller.reticle.setHovering(false);
	}
};
var DOWN = Object.freeze(new Vector3(0, -1, 0));
var UP = Object.freeze(new Vector3(0, 1, 0));
var FORWARD = Object.freeze(new Vector3(0, 0, -1));
var BACK = Object.freeze(new Vector3(0, 0, 1));
var LEFT = Object.freeze(new Vector3(-1, 0, 0));
var RIGHT = Object.freeze(new Vector3(1, 0, 0));
var ZERO_VECTOR3 = Object.freeze(new Vector3(0, 0, 0));
var DEFAULT_FACE_CAMERA_CAPSULE_HALF_HEIGHT = .25;
function faceCameraSlerpAlpha(smoothing, deltaSeconds) {
	return 1 - Math.exp(-smoothing * deltaSeconds * 60);
}
/** Computes the local rotation that makes an object face the camera. */
function faceCameraQuaternion(worldPosition, cameraPosition, parentWorldQuaternion, mode = "capsule", capsuleHalfHeight = DEFAULT_FACE_CAMERA_CAPSULE_HALF_HEIGHT, result = new Quaternion(), scratch) {
	if (!cameraPosition) return void 0;
	const target = scratch?.target.copy(cameraPosition) ?? cameraPosition.clone();
	if (mode === "cylindrical") target.y = worldPosition.y;
	if (mode === "capsule") target.y = MathUtils.clamp(worldPosition.y, cameraPosition.y - capsuleHalfHeight, cameraPosition.y + capsuleHalfHeight);
	if (target.distanceToSquared(worldPosition) < 1e-8) return void 0;
	const worldQuaternion = scratch?.worldQuaternion ?? new Quaternion();
	const matrix = scratch?.matrix ?? new Matrix4();
	worldQuaternion.setFromRotationMatrix(matrix.lookAt(target, worldPosition, UP));
	if (!parentWorldQuaternion) return result.copy(worldQuaternion);
	return result.copy(parentWorldQuaternion).invert().multiply(worldQuaternion);
}
var EPSILON = 1e-8;
function worldPositionToLocal(worldPosition, parentWorldMatrix) {
	if (!parentWorldMatrix) return worldPosition.clone();
	return worldPosition.clone().applyMatrix4(parentWorldMatrix.clone().invert());
}
function worldQuaternionToLocal(worldQuaternion, parentWorldQuaternion) {
	if (!parentWorldQuaternion) return worldQuaternion.clone();
	return parentWorldQuaternion.clone().invert().multiply(worldQuaternion);
}
function clampScaleFactor(factor, baseline, options) {
	const minimum = scaleLimitVector(options.minScale, EPSILON, false);
	const maximum = scaleLimitVector(options.maxScale, Infinity, true);
	if (!minimum || !maximum) return NaN;
	const minimumFactor = Math.max(minimum.x / baseline.x, minimum.y / baseline.y, minimum.z / baseline.z);
	const maximumFactor = Math.min(maximum.x / baseline.x, maximum.y / baseline.y, maximum.z / baseline.z);
	if (minimumFactor > maximumFactor) return NaN;
	return MathUtils.clamp(factor, minimumFactor, maximumFactor);
}
function isPositiveFinite(value) {
	return Number.isFinite(value) && value > EPSILON;
}
function isFiniteVector(value) {
	return Number.isFinite(value.x) && Number.isFinite(value.y) && Number.isFinite(value.z);
}
function isPositiveVector(value) {
	return isFiniteVector(value) && value.x > 0 && value.y > 0 && value.z > 0;
}
function isFiniteQuaternion(value) {
	return Number.isFinite(value.x) && Number.isFinite(value.y) && Number.isFinite(value.z) && Number.isFinite(value.w);
}
function scaleLimitVector(value, fallback, allowInfinity) {
	if (value === void 0) return new Vector3(fallback, fallback, fallback);
	const result = typeof value === "number" ? new Vector3(value, value, value) : new Vector3(value.x, value.y, value.z);
	return [
		result.x,
		result.y,
		result.z
	].every((component) => component > 0 && (Number.isFinite(component) || allowInfinity && component === Infinity)) ? result : void 0;
}
var DEFAULT_MIN_SIZE = .1;
var SIZE_EPSILON = 1e-4;
var CARD_ANCHORS = {
	left: 0,
	bottom: 0,
	center: .5,
	right: 1,
	top: 1
};
/** Captures and proposes corner Resize data for `UICard` owners. */
var ResizeDriver = class {
	constructor() {
		this.action = ManipulationAction.Resize;
		this.sessionCorners = /* @__PURE__ */ new WeakMap();
	}
	capture(session) {
		const card = asCard(session.owner);
		const options = session.config.resize;
		if (!card || !options) return void 0;
		const anchor = options.anchor ?? "center";
		if (anchor !== "center" && anchor !== "opposite") return void 0;
		const minSize = resolveLimit(options.minSize, DEFAULT_MIN_SIZE);
		const maxSize = resolveLimit(options.maxSize, Infinity);
		if (!minSize || !maxSize || minSize.width > maxSize.width || minSize.height > maxSize.height) return;
		if (options.minSize?.width === void 0) {
			const content = measureUICardMinContentWidth(card);
			if (content !== void 0) minSize.width = Math.min(Math.max(minSize.width, content), maxSize.width);
		}
		const { width } = card.size;
		const height = card.size.height === "auto" ? getResolvedUICardSize(card)?.height ?? "auto" : card.size.height;
		if (!(width > 0) || height !== "auto" && !(height > 0)) return;
		const matrixWorld = card.matrixWorld.clone();
		const inverseMatrixWorld = matrixWorld.clone().invert();
		if (!isFiniteMatrix(inverseMatrixWorld)) return void 0;
		const plane = new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 0, 1).transformDirection(matrixWorld), new Vector3().setFromMatrixPosition(matrixWorld));
		const baseline = {
			plane,
			inverseMatrixWorld
		};
		const pointer = pointerOnPlane(session.primary.snapshot, baseline) ?? session.primary.capture.point.clone().applyMatrix4(inverseMatrixWorld);
		const cardAnchor = new Vector2(CARD_ANCHORS[card.anchorX], CARD_ANCHORS[card.anchorY]);
		const centerX = (CARD_ANCHORS.center - cardAnchor.x) * width;
		const centerY = height === "auto" ? pointer.y : (CARD_ANCHORS.center - cardAnchor.y) * height;
		let corner = this.sessionCorners.get(session)?.clone();
		if (!corner) {
			corner = new Vector2(pointer.x >= centerX ? 1 : 0, pointer.y >= centerY ? 1 : 0);
			this.sessionCorners.set(session, corner.clone());
		}
		return {
			action: this.action,
			width,
			height,
			matrixWorld,
			inverseMatrixWorld,
			plane,
			pointer,
			corner,
			cardAnchor,
			autoHeight: card.size.height === "auto",
			options: {
				anchor,
				minSize,
				maxSize,
				fitContent: options.minSize?.height === void 0,
				preserveAspectRatio: options.preserveAspectRatio === true
			}
		};
	}
	propose(session, baseline) {
		const card = asCard(session.owner);
		const pointer = pointerOnPlane(session.primary.snapshot, baseline);
		if (!card || !pointer) return void 0;
		const { corner, cardAnchor, options } = baseline;
		const fixed = options.anchor === "center" ? new Vector2(CARD_ANCHORS.center, CARD_ANCHORS.center) : new Vector2(1 - corner.x, 1 - corner.y);
		let width = resizeAxis(baseline.width, pointer.x - baseline.pointer.x, corner.x, fixed.x, options.minSize.width, options.maxSize.width);
		let height = baseline.height === "auto" ? "auto" : resizeAxis(baseline.height, pointer.y - baseline.pointer.y, corner.y, fixed.y, options.minSize.height, options.maxSize.height);
		const locked = options.preserveAspectRatio && baseline.height !== "auto";
		if (locked && height !== "auto") {
			const widthRatio = width / baseline.width;
			const heightRatio = height / baseline.height;
			const ratio = lockedRatio(Math.abs(Math.log(widthRatio)) >= Math.abs(Math.log(heightRatio)) ? widthRatio : heightRatio, baseline);
			width = baseline.width * ratio;
			height = baseline.height * ratio;
		}
		if (height !== "auto" && options.fitContent) {
			const content = contentHeight(card, baseline, width);
			const floor = content === void 0 ? void 0 : Math.min(content, options.maxSize.height);
			if (floor !== void 0 && height < floor) {
				if (locked) {
					const ratio = lockedContentRatio(card, baseline, width / baseline.width, floor);
					width = baseline.width * ratio;
					height = baseline.height * ratio;
				} else height = floor;
			}
		}
		const worldPosition = new Vector3((fixed.x - cardAnchor.x) * (baseline.width - width), height === "auto" || baseline.height === "auto" ? 0 : (fixed.y - cardAnchor.y) * (baseline.height - height), 0).applyMatrix4(baseline.matrixWorld);
		const parent = session.owner.parent;
		parent?.updateWorldMatrix(true, false);
		const position = worldPositionToLocal(worldPosition, parent?.matrixWorld);
		if (!Number.isFinite(width) || !isFiniteVector(position)) return void 0;
		if (height !== "auto" && !Number.isFinite(height)) return void 0;
		const unchanged = baseline.autoHeight && Math.abs(width - baseline.width) < SIZE_EPSILON && (height === "auto" || Math.abs(height - baseline.height) < SIZE_EPSILON);
		const proposedHeight = unchanged ? "auto" : height;
		return {
			action: this.action,
			width,
			height: proposedHeight,
			position,
			apply: () => {
				if (unchanged) return;
				if (card.size.width !== width) card.size.width = width;
				if (proposedHeight !== "auto" && card.size.height !== proposedHeight) card.size.height = proposedHeight;
				session.owner.position.copy(position);
			}
		};
	}
};
/** Measures the content height at `width`, reusing the last measurement. */
function contentHeight(card, baseline, width) {
	const cached = baseline.contentFloor;
	if (cached && Math.abs(cached.width - width) < SIZE_EPSILON) return cached.height;
	const height = measureUICardContentHeight(card, width);
	baseline.contentFloor = {
		width,
		height
	};
	return height;
}
/**
* Finds the smallest aspect-locked ratio between `lower` and the `floor` ratio
* at which the card height still fits its content at that width.
*/
function lockedContentRatio(card, baseline, lower, floor) {
	const baseHeight = baseline.height;
	const maxHeight = baseline.options.maxSize.height;
	let high = lockedRatio(floor / baseHeight, baseline);
	let low = Math.min(lower, high);
	const fitsAt = (ratio) => {
		const measured = contentHeight(card, baseline, baseline.width * ratio);
		const needed = measured === void 0 ? 0 : Math.min(measured, maxHeight);
		return baseHeight * ratio >= needed - SIZE_EPSILON;
	};
	if (!fitsAt(high)) return high;
	while ((high - low) * baseline.width > SIZE_EPSILON) {
		const middle = (low + high) / 2;
		if (fitsAt(middle)) high = middle;
		else low = middle;
	}
	return high;
}
/** Clamps a uniform resize ratio so both axes stay within their limits. */
function lockedRatio(ratio, baseline) {
	const height = baseline.height;
	const { minSize, maxSize } = baseline.options;
	const lower = Math.min(1, Math.max(minSize.width / baseline.width, minSize.height / height));
	const upper = Math.max(1, Math.min(maxSize.width / baseline.width, maxSize.height / height));
	return MathUtils.clamp(ratio, lower, upper);
}
function asCard(owner) {
	return isUIElement(owner) && getUIElementKind(owner) === "card" ? owner : void 0;
}
function resizeAxis(size, delta, corner, fixed, minimum, maximum) {
	const next = size + (corner === 1 ? 1 : -1) * delta / Math.abs(corner - fixed);
	return MathUtils.clamp(next, Math.min(minimum, size), Math.max(maximum, size));
}
function pointerOnPlane(snapshot, baseline) {
	const world = snapshot.ray ? snapshot.ray.intersectPlane(baseline.plane, new Vector3()) : baseline.plane.projectPoint(snapshot.position, new Vector3());
	if (!world || !isFiniteVector(world)) return void 0;
	return world.applyMatrix4(baseline.inverseMatrixWorld);
}
function resolveLimit(value, fallback) {
	const width = value?.width ?? fallback;
	const height = value?.height ?? fallback;
	if (!isLimit(width) || !isLimit(height)) return void 0;
	return {
		width,
		height
	};
}
function isLimit(value) {
	return typeof value === "number" && !Number.isNaN(value) && value >= 0;
}
function isFiniteMatrix(matrix) {
	return matrix.elements.every(Number.isFinite);
}
/** Captures and proposes Rotate data. It does not own sessions or events. */
var RotateDriver = class {
	constructor() {
		this.action = ManipulationAction.Rotate;
	}
	capture(session) {
		const raw = session.config.rotate ?? {};
		const axis = normalizeRotationAxis(raw.axis);
		const sensitivity = raw.sensitivity ?? 10;
		if (!axis || !Number.isFinite(sensitivity)) return void 0;
		return {
			action: this.action,
			localQuaternion: session.owner.quaternion.clone(),
			worldQuaternion: session.owner.getWorldQuaternion(new Quaternion()),
			sourcePosition: session.primary.snapshot.position.clone(),
			sourceOrientationInverse: session.primary.snapshot.orientation.clone().invert(),
			axis,
			options: {
				space: raw.space ?? "world",
				sensitivity
			}
		};
	}
	propose(session, baseline) {
		const snapshot = session.primary.snapshot;
		let angle;
		if (snapshot.sourceType === "mouse") {
			const deltaRotation = snapshot.orientation.clone().multiply(baseline.sourceOrientationInverse);
			angle = -new Euler().setFromQuaternion(deltaRotation, "YXZ").y * baseline.options.sensitivity;
		} else {
			const isX = Math.abs(Math.abs(baseline.axis.x) - 1) < 1e-4;
			const isZ = Math.abs(Math.abs(baseline.axis.z) - 1) < 1e-4;
			if (isX || isZ) {
				const worldAxis = baseline.options.space === "local" ? baseline.axis.clone().applyQuaternion(baseline.worldQuaternion) : baseline.axis;
				const deltaRotation = snapshot.orientation.clone().multiply(baseline.sourceOrientationInverse);
				let twistDot = deltaRotation.x * worldAxis.x + deltaRotation.y * worldAxis.y + deltaRotation.z * worldAxis.z;
				let twistW = deltaRotation.w;
				if (twistW < 0) {
					twistDot = -twistDot;
					twistW = -twistW;
				}
				angle = 2 * Math.atan2(twistDot, twistW) * baseline.options.sensitivity;
			} else angle = snapshot.position.clone().sub(baseline.sourcePosition).applyQuaternion(baseline.sourceOrientationInverse).x * baseline.options.sensitivity;
		}
		const offset = new Quaternion().setFromAxisAngle(baseline.axis, angle);
		let quaternion;
		if (baseline.options.space === "local") quaternion = baseline.localQuaternion.clone().multiply(offset);
		else {
			const world = offset.multiply(baseline.worldQuaternion);
			const parent = session.owner.parent;
			parent?.updateWorldMatrix(true, false);
			quaternion = worldQuaternionToLocal(world, parent?.getWorldQuaternion(new Quaternion()));
		}
		if (!Number.isFinite(angle) || !isFiniteQuaternion(quaternion)) return;
		return {
			action: this.action,
			angle,
			quaternion,
			apply: () => {
				if (Number.isFinite(angle) && isFiniteQuaternion(quaternion)) session.owner.quaternion.copy(quaternion).normalize();
			}
		};
	}
};
/** Captures and proposes Scale data. It does not own sessions or events. */
var ScaleDriver = class {
	constructor() {
		this.action = ManipulationAction.Scale;
	}
	capture(session, auxiliary) {
		if (!auxiliary) return void 0;
		const distance = session.primary.snapshot.position.distanceTo(auxiliary.position);
		if (!isPositiveFinite(distance) || !isPositiveVector(session.owner.scale)) return;
		const options = cloneScaleOptions(session.config.scale);
		if (!isPositiveFinite(clampScaleFactor(1, session.owner.scale, options))) return;
		return {
			action: this.action,
			scale: session.owner.scale.clone(),
			distance,
			options
		};
	}
	propose(session, baseline) {
		if (!session.auxiliary) return void 0;
		let factor = session.primary.snapshot.position.distanceTo(session.auxiliary.position) / baseline.distance;
		if (!isPositiveFinite(factor)) return void 0;
		factor = clampScaleFactor(factor, baseline.scale, baseline.options);
		if (!isPositiveFinite(factor)) return void 0;
		const scale = baseline.scale.clone().multiplyScalar(factor);
		if (!isPositiveVector(scale)) return void 0;
		const center = session.primary.snapshot.position.clone().add(session.auxiliary.position).multiplyScalar(.5);
		return {
			action: this.action,
			factor,
			center,
			scale,
			apply: () => session.owner.scale.copy(scale)
		};
	}
};
var PUSH_PULL_DEADZONE = .15;
var XR_STANDARD_THUMBSTICK_Y_AXIS = 3;
var DEFAULT_PUSH_PULL_SPEED = 1.5;
var MIN_RAY_DEPTH = .05;
var CONSTANT_SIZE_DISTANCE = 1.75;
var FAR_SCALE_RATE = .5;
/** Captures and proposes Translate data. It does not own sessions or events. */
var TranslateDriver = class {
	constructor(camera, timer) {
		this.camera = camera;
		this.timer = timer;
		this.action = ManipulationAction.Translate;
	}
	capture(session) {
		const snapshot = session.primary.snapshot;
		const options = session.config.translate ?? {};
		if (options.faceCamera && (options.mode !== void 0 && options.mode !== "capsule" && options.mode !== "cylindrical" && options.mode !== "spherical" || options.capsuleHalfHeight !== void 0 && (!Number.isFinite(options.capsuleHalfHeight) || options.capsuleHalfHeight < 0) || options.smoothing !== void 0 && (!Number.isFinite(options.smoothing) || options.smoothing < 0)) || !!options.pushPull && !resolvePushPull(options.pushPull) || !validDistanceLimits(options)) return;
		const worldPosition = session.owner.getWorldPosition(new Vector3());
		const viewerDistance = this.camera?.getWorldPosition(new Vector3()).distanceTo(worldPosition);
		const cameraDistance = options.scaleWithDistance ? viewerDistance : void 0;
		const hasLimits = options.minDistance !== void 0 || options.maxDistance !== void 0;
		const baseline = {
			action: this.action,
			worldPosition,
			sourcePosition: snapshot.position.clone(),
			options: { ...options },
			scale: session.owner.scale.clone(),
			cameraDistance: cameraDistance !== void 0 && isPositiveFinite(cameraDistance) && isPositiveVector(session.owner.scale) ? cameraDistance : void 0,
			distanceLimits: hasLimits && viewerDistance !== void 0 ? {
				min: Math.min(options.minDistance ?? 0, viewerDistance),
				max: Math.max(options.maxDistance ?? Infinity, viewerDistance)
			} : void 0,
			scaleOptions: cloneScaleOptions(session.config.scale)
		};
		if (snapshot.ray) {
			baseline.rayDepth = snapshot.ray.direction.dot(session.primary.capture.point.clone().sub(snapshot.ray.origin));
			baseline.rayPoint = snapshot.ray.at(baseline.rayDepth, new Vector3()).clone();
		}
		return baseline;
	}
	propose(session, baseline) {
		const snapshot = session.primary.snapshot;
		const viewer = this.camera?.getWorldPosition(new Vector3());
		let delta;
		let point;
		if (snapshot.ray && baseline.rayDepth !== void 0 && baseline.rayPoint) {
			baseline.rayDepth = this.pushPull(session, baseline, snapshot.ray, baseline.rayDepth, viewer);
			point = snapshot.ray.at(baseline.rayDepth, new Vector3());
			delta = point.clone().sub(baseline.rayPoint);
		} else {
			delta = snapshot.position.clone().sub(baseline.sourcePosition);
			point = session.primary.capture.point.clone().add(delta);
		}
		const worldPosition = baseline.worldPosition.clone().add(delta);
		const correction = this.limitDistance(baseline, worldPosition, viewer);
		delta.add(correction);
		point.add(correction);
		const parent = session.owner.parent;
		parent?.updateWorldMatrix(true, false);
		const localPosition = worldPositionToLocal(worldPosition, parent?.matrixWorld);
		const localQuaternion = baseline.options.faceCamera ? faceCameraQuaternion(worldPosition, viewer, parent?.getWorldQuaternion(new Quaternion()), baseline.options.mode, baseline.options.capsuleHalfHeight ?? .25) : void 0;
		const scale = this.scaleWithDistance(baseline, worldPosition, viewer);
		const rotationAlpha = this.timer ? faceCameraSlerpAlpha(baseline.options.smoothing ?? .1, this.timer.getDelta()) : 1;
		if (!isFiniteVector(point) || !isFiniteVector(delta) || !isFiniteVector(worldPosition) || !isFiniteVector(localPosition)) return;
		return {
			action: this.action,
			point,
			delta,
			position: localPosition,
			worldPosition,
			scale,
			apply: () => {
				if (!isFiniteVector(localPosition)) return;
				session.owner.position.copy(localPosition);
				if (baseline.cameraDistance !== void 0) session.owner.scale.copy(scale);
				if (localQuaternion) {
					const speed = delta.length();
					const effectiveAlpha = Math.min(1, rotationAlpha + speed * 3);
					session.owner.quaternion.slerp(localQuaternion, effectiveAlpha);
				}
			}
		};
	}
	/**
	* Moves `worldPosition` back within the distance limits from the viewer and
	* returns the correction that was applied.
	*/
	limitDistance(baseline, worldPosition, viewer) {
		const correction = new Vector3();
		const limits = baseline.distanceLimits;
		if (!limits || !viewer) return correction;
		const offset = worldPosition.clone().sub(viewer);
		const distance = offset.length();
		if (!isPositiveFinite(distance)) return correction;
		const clamped = MathUtils.clamp(distance, limits.min, limits.max);
		if (clamped === distance) return correction;
		correction.copy(offset).multiplyScalar(clamped / distance - 1);
		worldPosition.add(correction);
		return correction;
	}
	/**
	* Moves the grab point along the ray with the thumbstick's forward axis,
	* keeping the owner within the distance limits from the viewer.
	*/
	pushPull(session, baseline, ray, depth, viewer) {
		const speed = resolvePushPull(baseline.options.pushPull);
		const gamepad = session.primary.snapshot.controller.gamepad;
		const stick = gamepad?.mapping === "xr-standard" ? gamepad.axes[XR_STANDARD_THUMBSTICK_Y_AXIS] : void 0;
		if (!speed || !this.timer || stick === void 0 || !Number.isFinite(stick) || Math.abs(stick) < PUSH_PULL_DEADZONE) return depth;
		const time = this.timer.getElapsed();
		if (baseline.pushPullTime === time) return depth;
		baseline.pushPullTime = time;
		const next = Math.max(Math.min(MIN_RAY_DEPTH, depth), depth * Math.exp(-stick * speed * this.timer.getDelta()));
		const limits = baseline.distanceLimits;
		if (!limits || !viewer) return next;
		const distanceAt = (value) => ray.at(value, new Vector3()).sub(baseline.rayPoint).add(baseline.worldPosition).distanceTo(viewer);
		const current = distanceAt(depth);
		const candidate = distanceAt(next);
		if (candidate > current && candidate > limits.max) return depth;
		if (candidate < current && candidate < limits.min) return depth;
		return next;
	}
	scaleWithDistance(baseline, worldPosition, viewer) {
		const scale = baseline.scale.clone();
		if (baseline.cameraDistance === void 0 || !viewer) return scale;
		const factor = clampScaleFactor(sizeDistance(viewer.distanceTo(worldPosition)) / sizeDistance(baseline.cameraDistance), baseline.scale, baseline.scaleOptions);
		return isPositiveFinite(factor) ? scale.multiplyScalar(factor) : scale;
	}
};
function sizeDistance(distance) {
	return distance <= CONSTANT_SIZE_DISTANCE ? distance : CONSTANT_SIZE_DISTANCE + FAR_SCALE_RATE * (distance - CONSTANT_SIZE_DISTANCE);
}
/** Returns the push/pull speed, or undefined when disabled or invalid. */
function resolvePushPull(value) {
	if (!value) return void 0;
	const speed = (value === true ? void 0 : value.speed) ?? DEFAULT_PUSH_PULL_SPEED;
	return isPositiveFinite(speed) ? speed : void 0;
}
function validDistanceLimits({ minDistance, maxDistance }) {
	if (minDistance !== void 0 && !(minDistance >= 0)) return false;
	if (maxDistance !== void 0 && !(maxDistance > 0)) return false;
	return (minDistance ?? 0) <= (maxDistance ?? Infinity);
}
/**
* Private runtime used by Interaction. It does not observe input or raycast.
* It is exported only so the sibling Interaction module can construct it.
*/
var ManipulationManager = class {
	constructor(dispatch, suppressSource, camera, timer) {
		this.dispatch = dispatch;
		this.suppressSource = suppressSource;
		this.sessions = /* @__PURE__ */ new Map();
		this.roles = /* @__PURE__ */ new Map();
		this.rotateDriver = new RotateDriver();
		this.scaleDriver = new ScaleDriver();
		this.resizeDriver = new ResizeDriver();
		this.translateDriver = new TranslateDriver(camera, timer);
	}
	resolve(path) {
		let childHandle;
		let hasChildHandle = false;
		let handle;
		for (const current of path) {
			if (isUIElement(current) && getUIElementKind(current) === "overlay") return;
			const options = current.xb;
			if (!hasChildHandle && options?.manipulationHandle !== void 0) {
				hasChildHandle = true;
				handle = current;
				const action = options.manipulationHandle === "none" ? ManipulationAction.None : options.manipulationHandle.action;
				if (action !== void 0 && !isHandleAction(action)) return void 0;
				childHandle = action;
			}
			if (options?.manipulation !== void 0) {
				if (options.manipulation === false || options.manipulationHandle !== void 0) return;
				const config = normalizeManipulationConfig(options.manipulation);
				if (!config) return void 0;
				const edge = getCardEdge(current);
				if (edge && !hasChildHandle && !edge.translateFromSurface) return;
				const requested = hasChildHandle ? childHandle : config.handle;
				if (requested === ManipulationAction.None) return void 0;
				if (requested !== void 0) return isManipulationActionEnabled(config, requested) ? {
					owner: current,
					action: requested,
					handle
				} : void 0;
				const primaryActions = [config.translate && ManipulationAction.Translate, config.rotate && ManipulationAction.Rotate].filter(Boolean);
				if (primaryActions.length === 1) return {
					owner: current,
					action: primaryActions[0],
					handle
				};
				if (primaryActions.length === 0 && config.scale) return {
					owner: current,
					handle
				};
				return;
			}
		}
	}
	/** Starts a primary session after Interaction has dispatched Select start. */
	tryStart(capture, snapshot) {
		if (snapshot.sourceType === "gaze" || capture.source !== snapshot.controller || this.roles.has(snapshot.controller)) return false;
		const resolution = capture.manipulation;
		if (!resolution || this.sessions.has(resolution.owner)) return false;
		const config = normalizeManipulationConfig(resolution.owner.xb?.manipulation);
		if (!config) return false;
		const session = {
			owner: resolution.owner,
			ownerParent: resolution.owner.parent,
			config,
			primary: {
				capture,
				snapshot: new InteractionSourceState(snapshot.controller).copyFrom(snapshot)
			},
			primaryAction: resolution.action === ManipulationAction.Scale ? void 0 : resolution.action
		};
		if (getCardEdge(session.owner) && resolution.handle) session.cardEdge = true;
		const baseline = session.primaryAction ? this.captureBaseline(session, session.primaryAction) : void 0;
		if (session.primaryAction && !baseline) return false;
		this.sessions.set(session.owner, session);
		suspendTransformScripts(session.owner);
		this.roles.set(snapshot.controller, session);
		try {
			if (session.primaryAction && baseline && !this.beginPhase(session, session.primaryAction, baseline)) {
				this.removeSession(session, false);
				return false;
			}
			return true;
		} catch (error) {
			this.removeSession(session, false);
			throw error;
		}
	}
	/** Claims a free spatial Select for Scale before normal target resolution. */
	tryClaimScale(snapshot) {
		if (snapshot.sourceType === "gaze" || this.roles.has(snapshot.controller)) return false;
		let eligible;
		for (const session of this.sessions.values()) {
			if (!session.config.scale || session.auxiliary) continue;
			if (eligible) return false;
			eligible = session;
		}
		if (!eligible) return false;
		const session = eligible;
		const auxiliary = new InteractionSourceState(snapshot.controller).copyFrom(snapshot);
		const baseline = this.captureBaseline(session, ManipulationAction.Scale, auxiliary);
		if (baseline?.action !== ManipulationAction.Scale) return false;
		try {
			if (session.phase) this.finishPhase(session, "end");
			session.auxiliary = auxiliary;
			this.roles.set(snapshot.controller, session);
			if (!this.beginPhase(session, ManipulationAction.Scale, baseline)) {
				this.removeSession(session, true);
				return false;
			}
			return true;
		} catch (error) {
			this.removeSession(session, true);
			throw error;
		}
	}
	/** Runs a one-shot Scale phase for simulator and equivalent private intents. */
	applyScaleIntent(capture, snapshot, requestedFactor) {
		if (snapshot.sourceType === "gaze" || capture.source !== snapshot.controller || this.roles.has(snapshot.controller) || !isPositiveFinite(requestedFactor)) return false;
		const resolution = capture.manipulation;
		if (!resolution || this.sessions.has(resolution.owner)) return false;
		const config = normalizeManipulationConfig(resolution.owner.xb?.manipulation);
		if (!config?.scale || !isPositiveVector(resolution.owner.scale)) return false;
		const factor = clampScaleFactor(requestedFactor, resolution.owner.scale, config.scale);
		if (!isPositiveFinite(factor)) return false;
		const scale = resolution.owner.scale.clone().multiplyScalar(factor);
		if (!isPositiveVector(scale)) return false;
		const session = {
			owner: resolution.owner,
			ownerParent: resolution.owner.parent,
			config,
			primary: {
				capture,
				snapshot: new InteractionSourceState(snapshot.controller).copyFrom(snapshot)
			},
			primaryAction: resolution.action,
			phase: {
				action: ManipulationAction.Scale,
				baseline: {
					action: ManipulationAction.Scale,
					scale: resolution.owner.scale.clone(),
					distance: 1,
					options: { ...config.scale }
				},
				defaultPrevented: false
			}
		};
		const proposal = {
			action: ManipulationAction.Scale,
			factor,
			center: resolution.owner.getWorldPosition(new Vector3()),
			scale,
			apply: () => resolution.owner.scale.copy(scale)
		};
		const phase = session.phase;
		this.dispatchPhase(session, phase, "start", proposal);
		if (!phase.defaultPrevented) proposal.apply();
		this.dispatchPhase(session, phase, "update", proposal);
		session.phase = void 0;
		this.dispatchPhase(session, phase, "end", proposal);
		return true;
	}
	/** Updates active sessions from Interaction's current frame snapshots. */
	update(snapshots) {
		for (const snapshot of snapshots) {
			const session = this.roles.get(snapshot.controller);
			if (!session) continue;
			if (session.primary.snapshot.controller === snapshot.controller) session.primary.snapshot.copyFrom(snapshot);
			else if (session.auxiliary?.controller === snapshot.controller) session.auxiliary.copyFrom(snapshot);
		}
		for (const session of this.sessions.values()) {
			if (!this.validate(session)) continue;
			this.updateSession(session);
		}
	}
	/** Ends the role held by a source. Returns true when the source was claimed. */
	end(source, finalSnapshot) {
		const session = this.roles.get(source);
		if (!session) return false;
		const updated = Boolean(finalSnapshot);
		if (finalSnapshot) {
			if (session.primary.snapshot.controller === source) session.primary.snapshot.copyFrom(finalSnapshot);
			else if (session.auxiliary?.controller === source) session.auxiliary.copyFrom(finalSnapshot);
			this.updateSession(session);
		}
		if (session.primary.snapshot.controller === source) {
			this.finishSession(session, "end", true, updated);
			return true;
		}
		if (session.auxiliary?.controller === source) {
			this.finishAuxiliary(session, source, "end", updated);
			return true;
		}
		return false;
	}
	cancelSource(source) {
		const session = this.roles.get(source);
		if (!session) return false;
		if (session.primary.snapshot.controller === source) {
			this.finishSession(session, "cancel", true);
			return true;
		}
		if (session.auxiliary?.controller === source) {
			this.finishAuxiliary(session, source, "cancel");
			return true;
		}
		return false;
	}
	cancelOwner(owner) {
		const session = this.sessions.get(owner);
		if (!session) return false;
		this.finishSession(session, "cancel", true);
		return true;
	}
	isManipulating(object) {
		return object ? this.sessions.has(object) : this.sessions.size > 0;
	}
	isSourceActive(source) {
		return this.roles.has(source);
	}
	validate(session) {
		const current = normalizeManipulationConfig(session.owner.xb?.manipulation);
		const edge = getCardEdge(session.owner);
		if (!current || !session.owner.visible || session.owner.parent !== session.ownerParent || !objectIsDescendantOf(session.primary.capture.surface, session.owner) || session.cardEdge && !edge) {
			this.cancelOwner(session.owner);
			return false;
		}
		if (session.phase?.action === ManipulationAction.Scale && !current.scale) {
			const auxiliary = session.auxiliary;
			session.config = current;
			if (auxiliary) this.finishAuxiliary(session, auxiliary.controller, "cancel");
			else this.finishPhase(session, "cancel");
			return false;
		}
		if (session.primaryAction && !isManipulationActionEnabled(current, session.primaryAction)) {
			this.cancelOwner(session.owner);
			return false;
		}
		session.config = current;
		return true;
	}
	removeSession(session, suppressAuxiliary) {
		session.phase = void 0;
		if (this.sessions.get(session.owner) === session) {
			this.sessions.delete(session.owner);
			resumeTransformScripts(session.owner);
		}
		if (this.roles.get(session.primary.snapshot.controller) === session) this.roles.delete(session.primary.snapshot.controller);
		if (session.auxiliary) {
			if (this.roles.get(session.auxiliary.controller) === session) this.roles.delete(session.auxiliary.controller);
			if (suppressAuxiliary && session.auxiliary.selected) this.suppressSource(session.auxiliary.controller);
		}
	}
	startPhase(session, action) {
		const baseline = this.captureBaseline(session, action);
		return baseline ? this.beginPhase(session, action, baseline) : false;
	}
	beginPhase(session, action, baseline) {
		session.phase = {
			action,
			baseline,
			defaultPrevented: false
		};
		const phase = session.phase;
		const proposal = this.propose(session);
		if (!proposal) {
			session.phase = void 0;
			return false;
		}
		phase.lastProposal = proposal;
		try {
			this.dispatchPhase(session, phase, "start", proposal);
		} catch (error) {
			if (session.phase === phase) session.phase = void 0;
			throw error;
		}
		return true;
	}
	finishPhase(session, phase, reuseLastProposal = false) {
		const active = session.phase;
		if (!active) return;
		const proposal = reuseLastProposal ? active.lastProposal ?? this.propose(session) : this.propose(session) ?? active.lastProposal;
		session.phase = void 0;
		this.dispatchPhase(session, active, phase, proposal);
	}
	updateSession(session) {
		if (!session.phase) return;
		const proposal = this.propose(session);
		if (!proposal) return;
		session.phase.lastProposal = proposal;
		if (!session.phase.defaultPrevented) proposal.apply();
		try {
			this.dispatchPhase(session, session.phase, "update", proposal);
		} catch (error) {
			this.removeSession(session, true);
			throw error;
		}
	}
	finishSession(session, phase, suppressAuxiliary, reuseLastProposal = false) {
		const active = session.phase;
		const proposal = active ? reuseLastProposal ? active.lastProposal ?? this.propose(session) : this.propose(session) ?? active.lastProposal : void 0;
		this.removeSession(session, suppressAuxiliary);
		if (active) this.dispatchPhase(session, active, phase, proposal);
	}
	finishAuxiliary(session, source, phase, reuseLastProposal = false) {
		let phaseFinished = false;
		try {
			this.finishPhase(session, phase, reuseLastProposal);
			phaseFinished = true;
		} finally {
			this.releaseAuxiliaryRole(session, source);
			if (!phaseFinished) this.removeSession(session, true);
		}
		if (!session.primaryAction) return;
		try {
			if (this.startPhase(session, session.primaryAction)) return;
		} catch (error) {
			this.removeSession(session, true);
			throw error;
		}
		this.removeSession(session, true);
	}
	releaseAuxiliaryRole(session, source) {
		if (this.roles.get(source) === session) this.roles.delete(source);
		if (session.auxiliary?.controller === source) session.auxiliary = void 0;
	}
	captureBaseline(session, action, auxiliary = session.auxiliary) {
		session.owner.updateWorldMatrix(true, false);
		if (action === ManipulationAction.Translate) return this.translateDriver.capture(session);
		if (action === ManipulationAction.Rotate) return this.rotateDriver.capture(session);
		if (action === ManipulationAction.Resize) return this.resizeDriver.capture(session);
		return this.scaleDriver.capture(session, auxiliary);
	}
	propose(session) {
		const baseline = session.phase?.baseline;
		if (!baseline) return void 0;
		if (baseline.action === ManipulationAction.Translate) return this.translateDriver.propose(session, baseline);
		if (baseline.action === ManipulationAction.Rotate) return this.rotateDriver.propose(session, baseline);
		if (baseline.action === ManipulationAction.Resize) return this.resizeDriver.propose(session, baseline);
		return this.scaleDriver.propose(session, baseline);
	}
	dispatchPhase(session, active, phase, proposal) {
		if (!proposal) return;
		const preventState = { value: active.defaultPrevented };
		const propagationState = { stopped: false };
		for (const script of session.primary.capture.scriptPath) {
			const event = createEvent(session, script, phase, proposal, preventState, propagationState);
			this.dispatch(script, event);
			if (propagationState.stopped) break;
		}
		if (phase === "start") active.defaultPrevented = preventState.value;
	}
};
function getCardEdge(owner) {
	const candidate = owner;
	if (!isUIElement(owner) || getUIElementKind(owner) !== "card" || !candidate.edge) return;
	return candidate.edge;
}
function createEvent(session, currentTarget, phase, proposal, preventState, propagationState) {
	const common = {
		phase,
		action: proposal.action,
		source: session.primary.snapshot.source,
		sources: Object.freeze([session.primary.snapshot.source, session.auxiliary?.source].filter(Boolean)),
		target: session.primary.capture.target,
		surface: session.primary.capture.surface,
		owner: session.owner,
		currentTarget,
		defaultPrevented: preventState.value,
		preventDefault() {
			if (phase === "start") preventState.value = true;
		},
		stopPropagation() {
			propagationState.stopped = true;
		}
	};
	if (proposal.action === ManipulationAction.Translate) return withDefaultPrevented({
		...common,
		action: proposal.action,
		point: proposal.point.clone(),
		delta: proposal.delta.clone(),
		position: proposal.position.clone(),
		worldPosition: proposal.worldPosition.clone(),
		scale: proposal.scale.clone()
	}, preventState);
	if (proposal.action === ManipulationAction.Rotate) return withDefaultPrevented({
		...common,
		action: proposal.action,
		angle: proposal.angle,
		quaternion: proposal.quaternion.clone()
	}, preventState);
	if (proposal.action === ManipulationAction.Resize) return withDefaultPrevented({
		...common,
		action: proposal.action,
		width: proposal.width,
		height: proposal.height,
		position: proposal.position.clone()
	}, preventState);
	return withDefaultPrevented({
		...common,
		action: proposal.action,
		factor: proposal.factor,
		center: proposal.center.clone(),
		scale: proposal.scale.clone()
	}, preventState);
}
function withDefaultPrevented(event, state) {
	Object.defineProperty(event, "defaultPrevented", {
		enumerable: true,
		get: () => state.value
	});
	return event;
}
var DEFAULT_LONG_SELECT_DURATION = .75;
var SCROLL_DRAG_THRESHOLD = 6;
var WHEEL_SCALE_SPEED = .001;
var NOOP_PROPAGATION = () => {};
/** Owns all logical target, hover, capture, completion, and cancellation state. */
var Interaction = class {
	constructor(dependencies) {
		this.gazeDwell = new GazeDwell();
		this.sourceStates = /* @__PURE__ */ new Map();
		this.frameSnapshots = [];
		this.rawIntersections = /* @__PURE__ */ new Map();
		this.resolvedRays = /* @__PURE__ */ new Map();
		this.hoverPaths = /* @__PURE__ */ new Map();
		this.captures = /* @__PURE__ */ new Map();
		this.exclusiveControls = /* @__PURE__ */ new Map();
		this.touches = /* @__PURE__ */ new Map();
		this.suppressedUntilRelease = /* @__PURE__ */ new Set();
		this.scaleIntents = /* @__PURE__ */ new Map();
		this.wheelIntents = /* @__PURE__ */ new Map();
		this.frameSources = /* @__PURE__ */ new Set();
		this.nextFrameSources = /* @__PURE__ */ new Set();
		this.registry = new HitRegistry(dependencies.camera);
		this.callbacks = dependencies.callbacks;
		this.scene = dependencies.scene;
		this.manipulation = new ManipulationManager((script, event) => this.callbacks.invokeManipulation(script, event), (controller) => this.suppressedUntilRelease.add(controller), dependencies.camera, dependencies.timer);
		this.reticleOptions = dependencies.reticleOptions ?? new ReticleOptions();
		this.reticle = dependencies.reticle ?? new ReticlePresenter(this.reticleOptions);
		this.longSelectDuration = dependencies.longSelectDuration ?? DEFAULT_LONG_SELECT_DURATION;
		this.raycastMode = dependencies.raycastMode ?? "continuous";
		this.resolver = new HitResolver(this.callbacks, this.manipulation, this.registry);
		this.directTouch = new DirectTouch(this.registry, this.resolver);
	}
	setLongSelectDuration(seconds) {
		if (!Number.isFinite(seconds) || seconds < 0) throw new Error("Options.interaction.longSelectDuration must be finite and nonnegative.");
		this.longSelectDuration = seconds;
	}
	setRaycastMode(mode) {
		this.raycastMode = mode;
	}
	/** Replaces all sampled physical interaction state for one engine frame. */
	update(frame, deltaSeconds = 0) {
		const nextSources = this.nextFrameSources;
		nextSources.clear();
		for (const input of frame.raySources) nextSources.add(input.controller);
		for (const input of frame.directTouches) nextSources.add(input.controller);
		for (const controller of this.frameSources) if (!nextSources.has(controller)) this.removeSource(controller, "source-lost");
		this.nextFrameSources = this.frameSources;
		this.frameSources = nextSources;
		for (const [controller, capture] of this.captures) if (capture.kind === "target") {
			const reason = selectionInvalidReason(capture.selection, capture.ancestry, capture.semanticControl !== void 0 && isSemanticControlDisabled(capture.semanticControl));
			if (reason) this.cancelCapture(controller, reason);
			else if (capture.scroll && isSemanticControlDisabled(capture.scroll.owner)) this.cancelCapture(controller, "disabled");
		}
		const snapshots = this.frameSnapshots;
		snapshots.length = 0;
		const touchContacts = this.directTouch.update(frame.directTouches);
		for (const contact of touchContacts) {
			const snapshot = this.processTouchContact(contact);
			if (contact.phase !== "end") snapshots.push(snapshot);
		}
		const deliberate = this.hasDeliberateInput(frame);
		for (const input of frame.raySources) {
			const snapshot = this.updateRay(input, deltaSeconds, deliberate);
			if (snapshot) snapshots.push(snapshot);
		}
		for (const [controller, factor] of this.scaleIntents) this.applyScaleIntent(controller, factor, "scale");
		this.scaleIntents.clear();
		for (const [controller, delta] of this.wheelIntents) this.applyWheelIntent(controller, delta);
		this.wheelIntents.clear();
		if (snapshots.length > 0) try {
			this.manipulation.update(snapshots);
		} catch (error) {
			this.cancelFailedManipulations(error);
		}
		for (const [controller, capture] of this.captures) if ((capture.kind === "auxiliary" || capture.kind === "target" && capture.action === "manipulate") && this.manipulation.isSourceActive(controller) === false) this.cancelCapture(controller, "disabled");
		for (const snapshot of snapshots) {
			const capture = this.captures.get(snapshot.controller);
			if (!capture) continue;
			try {
				if (capture.kind === "target") {
					this.updateScrollCapture(capture, snapshot);
					this.updateLongSelect(capture, snapshot, deltaSeconds);
					this.updateSemantic(capture, snapshot);
				}
				this.callbacks.invokeGlobal("onSelecting", this.createSelectEvent(snapshot.controller, capture));
			} catch (error) {
				this.cancelFailedCapture(snapshot.controller, error);
			}
		}
	}
	clear() {
		for (const controller of this.frameSources) this.removeSource(controller, "source-lost");
		this.directTouch.clear();
		this.frameSnapshots.length = 0;
		this.rawIntersections.clear();
		this.frameSources.clear();
		this.nextFrameSources.clear();
		this.exclusiveControls.clear();
		this.scaleIntents.clear();
		this.wheelIntents.clear();
	}
	registerHitSurface(physical, logical, options) {
		return this.registry.register(physical, logical, options);
	}
	/** Installs the UI runtime's focus policy without owning a second input path. */
	setSelectionFocusHandler(handler) {
		this.focusHandler = handler;
	}
	/** Refreshes bounded direct-touch candidates found by the lifecycle pass. */
	syncTouchCandidates(candidates) {
		this.registry.setWorldTouchCandidates(candidates);
	}
	/** Cancels captures that belong to an object before its Script is disposed. */
	cancelObject(object, reason = "removed") {
		for (const [controller, capture] of this.captures) if (capture.kind === "target" && selectionBelongsTo(capture.selection, object)) this.cancelCapture(controller, reason);
		for (const [controller, touch] of this.touches) {
			if (!selectionBelongsTo(touch.selection, object)) continue;
			const contact = this.directTouch.remove(controller);
			if (contact) this.processTouchContact(contact);
		}
		for (const [controller, resolved] of this.resolvedRays) if (objectIsDescendantOf(resolved.surface, object)) {
			this.clearResolvedRay(controller);
			this.reticle.clear(controller);
		}
	}
	removeSource(controller, reason = "source-lost") {
		this.cancelCapture(controller, reason);
		const contact = this.directTouch.remove(controller);
		if (contact) this.processTouchContact(contact);
		this.finishTouch(controller);
		this.clearResolvedRay(controller);
		this.reticle.clear(controller);
		this.sourceStates.delete(controller);
		this.rawIntersections.delete(controller);
		this.hoverPaths.delete(controller);
		this.gazeDwell.remove(controller);
		this.suppressedUntilRelease.delete(controller);
		this.scaleIntents.delete(controller);
		this.wheelIntents.delete(controller);
	}
	getSourceSnapshot(controller) {
		return this.sourceStates.get(controller);
	}
	getResolvedRay(controller) {
		return this.resolvedRays.get(controller);
	}
	isPointingAt(object) {
		for (const resolved of this.resolvedRays.values()) if (objectIsDescendantOf(resolved.surface, object)) return true;
		return false;
	}
	isSelectingAt(object) {
		for (const capture of this.captures.values()) if (capture.kind === "target" && objectIsDescendantOf(capture.scroll?.active ? capture.scroll.owner : capture.selection.surface, object)) return true;
		return false;
	}
	isHovered(object) {
		for (const resolved of this.resolvedRays.values()) if (objectIsDescendantOf(resolved.target ?? resolved.surface, object)) return true;
		return false;
	}
	getIntersectionAt(object, controller) {
		let match;
		let matchIndex = Number.POSITIVE_INFINITY;
		for (const [source, resolved] of this.resolvedRays) {
			if (controller && source !== controller) continue;
			if (!objectIsDescendantOf(resolved.surface, object)) continue;
			const index = controllerIndex(source);
			if (index < matchIndex) {
				match = resolved;
				matchIndex = index;
			}
		}
		return match ? clonePublicIntersection(match.intersection, match.surface) : null;
	}
	/** Writes up to two internal cursor points in controller order. */
	writeCursorPointsAt(object, first, second) {
		let firstIndex = Number.POSITIVE_INFINITY;
		let secondIndex = Number.POSITIVE_INFINITY;
		let firstPoint;
		let secondPoint;
		for (const [controller, resolved] of this.resolvedRays) {
			if (!objectIsDescendantOf(resolved.surface, object)) continue;
			const index = controllerIndex(controller);
			if (index < firstIndex) {
				secondIndex = firstIndex;
				secondPoint = firstPoint;
				firstIndex = index;
				firstPoint = resolved.intersection.point;
			} else if (index < secondIndex) {
				secondIndex = index;
				secondPoint = resolved.intersection.point;
			}
		}
		if (!firstPoint) return 0;
		first.copy(firstPoint);
		if (!secondPoint) return 1;
		second.copy(secondPoint);
		return 2;
	}
	isManipulating(object) {
		return this.manipulation.isManipulating(object);
	}
	/** Explicit zoom also reaches a UI control's manipulable ancestor. */
	queueScaleIntent(controller, factor) {
		if (!Number.isFinite(factor) || factor <= 0) return false;
		this.scaleIntents.set(controller, (this.scaleIntents.get(controller) ?? 1) * factor);
		return true;
	}
	/** Routes a normalized wheel delta using the next frame's resolved target. */
	queueWheelIntent(controller, delta) {
		if (!Number.isFinite(delta) || delta === 0) return false;
		this.wheelIntents.set(controller, (this.wheelIntents.get(controller) ?? 0) + delta);
		return true;
	}
	applyWheelIntent(controller, delta) {
		const resolved = this.resolvedRays.get(controller);
		let owned = false;
		for (const object of resolved?.objectPath ?? []) {
			if (object.xb?.interactionEnabled === false) break;
			const control = getSemanticControl(object);
			if (!control?.scroll || control.isDisabled()) continue;
			owned = true;
			if (this.exclusiveControls.has(object)) return;
			let moved = false;
			this.callbacks.invokeSemantic(object, () => {
				moved = control.scroll.scrollBy(delta);
			});
			if (moved) return;
		}
		if (!owned) this.applyScaleIntent(controller, Math.exp(-delta * WHEEL_SCALE_SPEED), "wheel");
	}
	applyScaleIntent(controller, factor, intent) {
		const snapshot = this.sourceStates.get(controller);
		const resolved = this.resolvedRays.get(controller);
		if (!snapshot || !resolved?.target) return false;
		let scalingTarget = resolved;
		if (intent === "scale" && !resolved.manipulation && resolved.semanticControl) {
			const barrier = resolved.objectPath.findIndex((object) => object.xb?.interactionEnabled === false);
			const path = barrier < 0 ? resolved.objectPath : resolved.objectPath.slice(0, barrier);
			scalingTarget = {
				...resolved,
				manipulation: this.manipulation.resolve(path)
			};
		}
		const intentSnapshot = new InteractionSourceState(controller).copyFrom(snapshot);
		if (intent === "wheel") {
			intentSnapshot.source = getInteractionSource(controller, "simulator");
			intentSnapshot.sourceType = "simulator";
		}
		return this.manipulation.applyScaleIntent(this.createSelection(controller, scalingTarget), intentSnapshot, factor);
	}
	updateRay(input, deltaSeconds, deliberate) {
		if (this.directTouch.has(input.controller)) {
			this.clearResolvedRay(input.controller);
			this.reticle.clear(input.controller);
			return;
		}
		const previousSelected = this.sourceStates.get(input.controller)?.selected ?? false;
		const snapshot = this.updateRaySnapshot(input);
		if (!snapshot.selected) this.suppressedUntilRelease.delete(input.controller);
		if (this.suppressedUntilRelease.has(input.controller)) {
			this.clearResolvedRay(input.controller);
			this.reticle.clear(input.controller);
			return snapshot;
		}
		const intersections = input.intersections ?? this.collectIntersections(input, previousSelected);
		const resolved = this.resolver.resolve(intersections, input.sourceType);
		let gazeCompleted = false;
		if (input.sourceType === "gaze") {
			const gazeTarget = (resolved?.semanticControl ? getSemanticControl(resolved.semanticControl) : void 0)?.kind === "button" && resolved?.semanticControl ? resolved : void 0;
			const dwell = this.gazeDwell.update(input.controller, gazeTarget, deltaSeconds, deliberate);
			snapshot.selectionProgress = dwell.progress;
			gazeCompleted = dwell.completed;
		} else {
			snapshot.selectionProgress = void 0;
			this.gazeDwell.remove(input.controller);
		}
		this.setResolvedRay(input.controller, snapshot, resolved);
		if (gazeCompleted) {
			this.beginSelection(input.controller, true);
			this.endSelection(input.controller, "released");
		} else if (snapshot.selected !== previousSelected) {
			if (snapshot.selected) this.beginSelection(input.controller);
			else this.endSelection(input.controller, "released");
		}
		return snapshot;
	}
	collectIntersections(input, previousSelected) {
		let intersections = this.rawIntersections.get(input.controller);
		if (!intersections) {
			intersections = [];
			this.rawIntersections.set(input.controller, intersections);
		}
		if (!(this.raycastMode === "continuous" || input.sourceType === "gaze" || input.selected || previousSelected || input.released === true || this.scaleIntents.has(input.controller) || this.wheelIntents.has(input.controller)) || !this.scene) {
			intersections.length = 0;
			return intersections;
		}
		return this.registry.raycast(this.scene, input.ray, intersections);
	}
	beginSelection(controller, gaze = false) {
		if (this.directTouch.has(controller) || this.captures.has(controller)) return;
		const snapshot = this.sourceStates.get(controller);
		if (!snapshot) return;
		snapshot.selected = true;
		const resolved = this.resolvedRays.get(controller);
		const claimedScale = this.runManipulationTransition(() => this.manipulation.tryClaimScale(snapshot));
		if (this.suppressedUntilRelease.has(controller)) return;
		if (claimedScale) {
			const capture = { kind: "auxiliary" };
			this.installCapture(controller, capture);
			this.runCaptureTransition(controller, () => {
				this.clearResolvedRay(controller);
				this.reticle.clear(controller);
				this.callbacks.invokeGlobal("onSelectStart", this.createSelectEvent(controller, capture));
			});
			return;
		}
		if (!resolved?.target) {
			this.focusHandler?.();
			const capture = { kind: "none" };
			this.installCapture(controller, capture);
			this.runCaptureTransition(controller, () => {
				this.callbacks.invokeGlobal("onSelectStart", this.createSelectEvent(controller, capture));
			});
			return;
		}
		this.startTargetCapture(controller, snapshot, resolved, false, gaze);
	}
	startTargetCapture(controller, snapshot, resolved, touch, gaze = false) {
		const selection = this.createSelection(controller, resolved);
		const semantic = resolved.semanticControl ? getSemanticControl(resolved.semanticControl) : void 0;
		let action = "select";
		const wantsManipulation = !semantic && resolved.manipulation !== void 0;
		if (semantic) {
			action = "semantic";
			if (isContinuousControl(semantic) && resolved.semanticControl && this.exclusiveControls.has(resolved.semanticControl)) action = "none";
		} else if (wantsManipulation && !touch) action = "manipulate";
		if (gaze && semantic?.kind !== "button") action = "none";
		const physicalSurface = this.registry.resolve(resolved.hitObject).physical;
		const sliderProjector = action === "semantic" && isContinuousControl(semantic) ? createPlanarSurfaceProjector(physicalSurface) : void 0;
		const capture = {
			kind: "target",
			action,
			selection,
			ancestry: Object.freeze([...resolved.objectPath]),
			semantic,
			semanticControl: resolved.semanticControl,
			sliderProjector,
			physicalSurface,
			exclusiveControl: action === "semantic" && isContinuousControl(semantic) ? resolved.semanticControl : void 0,
			longSelectDuration: 0,
			longSelectFired: false,
			lastStablePoint: resolved.intersection.point.clone(),
			touch
		};
		if (!gaze && action !== "none") {
			capture.scroll = this.createScrollCapture(resolved);
			if (touch && capture.scroll) this.directTouch.setCaptureRegion(controller, capture.scroll.physical);
		}
		this.installCapture(controller, capture);
		this.runCaptureTransition(controller, () => {
			this.focusHandler?.(resolved.surface);
			if (capture.scroll?.scrollbar) {
				this.activateScrollCapture(capture, snapshot.controller);
				if (capture.scroll?.active) {
					const { state, scrollbar } = capture.scroll;
					this.callbacks.invokeSemantic(capture.scroll.owner, () => state.scrollBy(scrollbar.offset - state.getOffset()));
				}
			}
			const event = this.createSelectEvent(controller, capture);
			dispatchInteractionPath(this.callbacks, selection.scriptPath, "onObjectSelectStart", event);
			if (action === "manipulate" && !this.manipulation.tryStart(selection, snapshot)) capture.action = "none";
			if (capture.action === "semantic") this.invokeSemantic(capture, () => semantic?.begin?.(semanticInput(snapshot, resolved, sliderProjector, physicalSurface)));
			this.callbacks.invokeGlobal("onSelectStart", event);
		});
		return capture;
	}
	endSelection(controller, reason, releasedTarget, finalSnapshot) {
		const capture = this.detachCapture(controller);
		if (!capture) return;
		const snapshot = this.sourceStates.get(controller);
		if (snapshot) snapshot.selected = false;
		let completed = false;
		let endReason = reason;
		if (capture.kind === "auxiliary") completed = this.runManipulationTransition(() => this.manipulation.end(controller, finalSnapshot ?? snapshot));
		else if (capture.kind === "target") {
			const released = this.resolvedRays.get(controller);
			const sameTarget = (releasedTarget ?? released?.target) === capture.selection.target && (!capture.touch || !capture.scroll || capture.scroll.active || this.registry.resolve(capture.physicalSurface).containsPoint?.((finalSnapshot ?? snapshot).position) !== false);
			if (capture.action === "manipulate") completed = this.runManipulationTransition(() => this.manipulation.end(controller, finalSnapshot ?? snapshot));
			else if (capture.action === "semantic") {
				const continuous = isContinuousControl(capture.semantic);
				completed = !capture.longSelectFired && !isSemanticControlDisabled(capture.semanticControl) && (continuous || sameTarget);
				if (completed) this.invokeSemantic(capture, () => {
					if (continuous) capture.semantic?.complete?.();
					else capture.semantic?.activate();
				});
				else this.invokeSemantic(capture, () => capture.semantic?.cancel?.());
			} else completed = capture.action === "select" && !capture.longSelectFired && sameTarget;
			endReason = capture.action === "scroll" ? "pointer-cancel" : completed ? "released" : sameTarget ? reason : "released-outside";
			const endEvent = {
				...this.createSelectEvent(controller, capture),
				completed,
				reason: endReason
			};
			dispatchInteractionPath(this.callbacks, capture.selection.scriptPath, "onObjectSelectEnd", endEvent);
		}
		const globalEvent = this.createSelectEvent(controller, capture);
		if (completed) this.callbacks.invokeGlobal("onSelect", globalEvent);
		this.callbacks.invokeGlobal("onSelectEnd", {
			...globalEvent,
			completed,
			reason: endReason
		});
	}
	cancelCapture(controller, reason) {
		const capture = this.detachCapture(controller);
		if (!capture) return;
		this.suppressedUntilRelease.add(controller);
		this.runManipulationTransition(() => this.manipulation.cancelSource(controller));
		const event = {
			...this.createSelectEvent(controller, capture),
			completed: false,
			reason
		};
		if (capture.kind === "target") {
			if (capture.action !== "scroll") this.invokeSemantic(capture, () => capture.semantic?.cancel?.());
			dispatchInteractionPath(this.callbacks, capture.selection.scriptPath, "onObjectSelectEnd", event);
		}
		this.callbacks.invokeGlobal("onSelectEnd", event);
	}
	processTouchContact(contact) {
		const snapshot = this.updateTouchSnapshot(contact);
		this.updateTouch(contact, snapshot);
		if (contact.phase === "end") snapshot.selected = false;
		return snapshot;
	}
	updateTouch(contact, snapshot) {
		if (contact.phase === "start" && contact.resolved?.target) {
			const touchState = {
				selection: this.createSelection(contact.controller, contact.resolved),
				handIndex: contact.handIndex,
				hand: contact.hand,
				point: contact.point.clone(),
				prevented: false,
				grabbing: false
			};
			this.touches.set(contact.controller, touchState);
			try {
				this.clearResolvedRay(contact.controller);
				this.reticle.clear(contact.controller);
				const prevented = this.dispatchTouchStart(touchState);
				touchState.prevented = prevented;
				if (!prevented) this.startTargetCapture(contact.controller, snapshot, contact.resolved, true);
				this.updateGrab(touchState, contact, snapshot);
			} catch (error) {
				this.touches.delete(contact.controller);
				this.cancelFailedCapture(contact.controller, error);
			}
			return;
		}
		const touch = this.touches.get(contact.controller);
		if (!touch) return;
		touch.point.copy(contact.point);
		if (contact.phase === "move") {
			try {
				this.dispatchTouch(touch, "onObjectTouching");
				this.updateGrab(touch, contact, snapshot);
			} catch (error) {
				this.touches.delete(contact.controller);
				this.cancelFailedCapture(contact.controller, error);
			}
			return;
		}
		this.touches.delete(contact.controller);
		this.suppressedUntilRelease.add(contact.controller);
		try {
			this.finishGrab(touch, snapshot);
			this.dispatchTouch(touch, "onObjectTouchEnd");
		} finally {
			if (!touch.prevented) {
				const capture = this.captures.get(contact.controller);
				if (contact.endReason === "left-target" && capture?.kind === "target" && capture.touch && capture.action !== "none") this.endSelection(contact.controller, "released", touch.selection.target, snapshot);
				else this.cancelCapture(contact.controller, contact.endReason === "source-lost" ? "source-lost" : "released-outside");
			}
		}
	}
	finishTouch(controller) {
		const touch = this.touches.get(controller);
		if (!touch) return;
		this.touches.delete(controller);
		this.finishGrab(touch, this.sourceStates.get(controller));
		this.dispatchTouch(touch, "onObjectTouchEnd");
	}
	dispatchTouchStart(touch) {
		const state = { prevented: false };
		const event = {
			...this.createTouchEvent(touch),
			get defaultPrevented() {
				return state.prevented;
			},
			preventDefault() {
				state.prevented = true;
			}
		};
		dispatchInteractionPath(this.callbacks, touch.selection.scriptPath, "onObjectTouchStart", event);
		return state.prevented;
	}
	dispatchTouch(touch, hook) {
		dispatchInteractionPath(this.callbacks, touch.selection.scriptPath, hook, this.createTouchEvent(touch));
	}
	createTouchEvent(touch) {
		return {
			source: touch.selection.publicSource,
			target: touch.selection.target,
			surface: touch.selection.surface,
			handIndex: touch.handIndex,
			hand: touch.hand,
			touchPosition: touch.point.clone(),
			stopPropagation: NOOP_PROPAGATION
		};
	}
	updateGrab(touch, contact, snapshot) {
		if (!contact.selected || !touch.hand) {
			this.finishGrab(touch, snapshot);
			return;
		}
		const event = this.createGrabEvent(touch);
		if (!touch.grabbing) {
			touch.grabbing = true;
			dispatchInteractionPath(this.callbacks, touch.selection.scriptPath, "onObjectGrabStart", event);
			this.startGrabManipulation(touch, snapshot);
		} else dispatchInteractionPath(this.callbacks, touch.selection.scriptPath, "onObjectGrabbing", event);
	}
	startGrabManipulation(touch, snapshot) {
		const capture = this.captures.get(touch.selection.source);
		if (capture?.kind !== "target" || !capture.touch || capture.action !== "select" || !capture.selection.manipulation) return;
		capture.action = "manipulate";
		if (!this.manipulation.tryStart(capture.selection, snapshot)) capture.action = "select";
	}
	finishGrab(touch, snapshot) {
		if (!touch.grabbing || !touch.hand) return;
		const capture = this.captures.get(touch.selection.source);
		if (capture?.kind === "target" && capture.touch && capture.action === "manipulate") {
			this.runManipulationTransition(() => this.manipulation.end(touch.selection.source, snapshot));
			capture.action = "select";
		}
		touch.grabbing = false;
		dispatchInteractionPath(this.callbacks, touch.selection.scriptPath, "onObjectGrabEnd", this.createGrabEvent(touch));
	}
	createGrabEvent(touch) {
		return {
			...this.createTouchEvent(touch),
			hand: touch.hand
		};
	}
	updateSemantic(capture, snapshot) {
		if (capture.action !== "semantic" || !isContinuousControl(capture.semantic)) return;
		const projection = snapshot.ray ? capture.sliderProjector?.(snapshot.ray) : capture.physicalSurface ? projectPointOnSurface(capture.physicalSurface, snapshot.position) : void 0;
		if (projection) {
			this.invokeSemantic(capture, () => capture.semantic?.update?.({
				source: snapshot.source,
				point: projection.point,
				uv: projection.uv
			}));
			return;
		}
		const resolved = this.resolvedRays.get(snapshot.controller);
		if (resolved?.surface === capture.selection.surface && resolved.semanticControl === capture.semanticControl) this.invokeSemantic(capture, () => capture.semantic?.update?.(semanticInput(snapshot, resolved)));
	}
	createScrollCapture(resolved) {
		for (const owner of resolved.objectPath) {
			if (owner.xb?.interactionEnabled === false) break;
			const control = getSemanticControl(owner);
			if (control?.isDisabled()) continue;
			if (isContinuousControl(control) && !control?.scroll) return void 0;
			if (!control?.scroll) continue;
			const scrollbar = control.scroll.scrollbarHit?.(resolved.intersection.point);
			if (control.kind === "input" && !scrollbar) return void 0;
			if (control.kind !== "scroll" && !scrollbar) continue;
			const physical = this.registry.find(owner)?.physical ?? owner;
			const start = control.scroll.projectPoint(resolved.intersection.point);
			if (!start) return void 0;
			return {
				owner,
				physical,
				state: control.scroll,
				projector: createPlanarSurfaceProjector(physical),
				start,
				lastY: start.y,
				active: false,
				scrollbar
			};
		}
	}
	activateScrollCapture(capture, controller) {
		const scroll = capture.scroll;
		if (!scroll || scroll.active) return;
		const owner = this.exclusiveControls.get(scroll.owner);
		if (owner && owner !== controller) {
			capture.action = "none";
			capture.scroll = void 0;
			this.invokeSemantic(capture, () => capture.semantic?.cancel?.());
			return;
		}
		scroll.active = true;
		capture.action = "scroll";
		capture.exclusiveControl = scroll.owner;
		this.exclusiveControls.set(scroll.owner, controller);
		this.invokeSemantic(capture, () => capture.semantic?.cancel?.());
	}
	updateScrollCapture(capture, snapshot) {
		const scroll = capture.scroll;
		if (!scroll || capture.longSelectFired) return;
		const point = snapshot.ray ? scroll.projector?.(snapshot.ray)?.point ?? this.resolvedRays.get(snapshot.controller)?.intersection.point : snapshot.position;
		const projected = point && scroll.state.projectPoint(point);
		if (!projected) return;
		if (!scroll.active) {
			if (Math.abs(projected.y - scroll.start.y) < SCROLL_DRAG_THRESHOLD) return;
			this.activateScrollCapture(capture, snapshot.controller);
			if (!scroll.active) return;
		}
		const delta = (projected.y - scroll.lastY) * (scroll.scrollbar?.scale ?? -1);
		scroll.lastY = projected.y;
		this.callbacks.invokeSemantic(scroll.owner, () => scroll.state.scrollBy(delta));
	}
	updateLongSelect(capture, snapshot, deltaSeconds) {
		if (capture.longSelectFired || capture.action === "manipulate" || capture.action === "scroll" || isContinuousControl(capture.semantic) || snapshot.sourceType === "gaze" || !capture.selection.scriptPath.some((script) => this.callbacks.hasTargetHook(script, "onObjectLongSelect"))) return;
		const resolved = this.resolvedRays.get(snapshot.controller);
		const point = capture.touch ? this.touches.get(snapshot.controller)?.point : resolved?.target === capture.selection.target ? resolved.intersection.point : void 0;
		if (!point) {
			capture.longSelectDuration = 0;
			return;
		}
		const threshold = snapshot.sourceType === "direct-touch" ? .015 : .03;
		if (point && point.distanceTo(capture.lastStablePoint) > threshold) {
			capture.longSelectDuration = 0;
			capture.lastStablePoint.copy(point);
			return;
		}
		if (Number.isFinite(deltaSeconds) && deltaSeconds > 0) capture.longSelectDuration += deltaSeconds;
		if (capture.longSelectDuration < this.longSelectDuration) return;
		capture.longSelectFired = true;
		const event = {
			...this.createSelectEvent(snapshot.controller, capture),
			duration: capture.longSelectDuration
		};
		dispatchInteractionPath(this.callbacks, capture.selection.scriptPath, "onObjectLongSelect", event);
		this.callbacks.invokeGlobal("onLongSelect", event);
	}
	setResolvedRay(controller, snapshot, resolved) {
		const previous = this.resolvedRays.get(controller);
		if (resolved) this.resolvedRays.set(controller, resolved);
		else this.resolvedRays.delete(controller);
		this.updateHoverPath(controller, resolved, previous);
		this.reticle.present(snapshot, resolved);
	}
	clearResolvedRay(controller) {
		const previous = this.resolvedRays.get(controller);
		this.resolvedRays.delete(controller);
		this.updateHoverPath(controller, void 0, previous);
	}
	updateHoverPath(controller, resolved, previous) {
		const nextPath = resolved?.scriptPath ?? [];
		const oldPath = this.hoverPaths.get(controller) ?? [];
		if (nextPath.length > 0) this.hoverPaths.set(controller, nextPath);
		else this.hoverPaths.delete(controller);
		let oldIndex = oldPath.length - 1;
		let nextIndex = nextPath.length - 1;
		while (oldIndex >= 0 && nextIndex >= 0 && oldPath[oldIndex] === nextPath[nextIndex]) {
			oldIndex--;
			nextIndex--;
		}
		const eventFor = (value) => ({
			source: this.getSourceSnapshot(controller)?.source ?? getInteractionSource(controller, "controller-ray"),
			target: value?.target,
			surface: value?.surface,
			intersection: value?.intersection ? clonePublicIntersection(value.intersection, value.surface) : void 0,
			stopPropagation: NOOP_PROPAGATION
		});
		dispatchInteractionPath(this.callbacks, oldPath.slice(0, oldIndex + 1), "onHoverExit", eventFor(previous));
		const event = eventFor(resolved);
		dispatchInteractionPath(this.callbacks, nextPath.slice(0, nextIndex + 1), "onHoverEnter", event);
		dispatchInteractionPath(this.callbacks, nextPath, "onHovering", event);
	}
	updateRaySnapshot(input) {
		return this.getSourceState(input.controller).updateRay(input);
	}
	updateTouchSnapshot(contact) {
		return this.getSourceState(contact.controller).updateTouch(contact.point, contact.orientation);
	}
	getSourceState(controller) {
		let snapshot = this.sourceStates.get(controller);
		if (snapshot) return snapshot;
		snapshot = new InteractionSourceState(controller);
		this.sourceStates.set(controller, snapshot);
		return snapshot;
	}
	createSelection(controller, resolved) {
		const target = resolved.target;
		return {
			source: controller,
			publicSource: this.getSourceSnapshot(controller)?.source ?? getInteractionSource(controller, "controller-ray"),
			target,
			surface: resolved.surface,
			owner: resolved.manipulation?.owner ?? target,
			point: resolved.intersection.point.clone(),
			uv: resolved.intersection.uv?.clone(),
			scriptPath: Object.freeze([...resolved.scriptPath]),
			manipulation: resolved.manipulation
		};
	}
	createSelectEvent(controller, capture) {
		const targetCapture = capture.kind === "target" ? capture : void 0;
		const resolved = this.resolvedRays.get(controller);
		const surface = targetCapture?.selection.surface ?? resolved?.surface;
		const intersection = resolved && surface && objectIsDescendantOf(resolved.surface, surface) ? clonePublicIntersection(resolved.intersection, resolved.surface) : void 0;
		return {
			source: targetCapture?.selection.publicSource ?? this.getSourceSnapshot(controller)?.source ?? getInteractionSource(controller, "controller-ray"),
			target: targetCapture?.selection.target,
			surface,
			intersection,
			stopPropagation: NOOP_PROPAGATION
		};
	}
	hasDeliberateInput(frame) {
		if (frame.raySources.some((input) => input.sourceType !== "gaze" && input.selected) || this.touches.size > 0) return true;
		for (const capture of this.captures.values()) if (capture.kind === "auxiliary" || capture.kind === "target" && capture.action === "manipulate") return true;
		return false;
	}
	installCapture(controller, capture) {
		this.captures.set(controller, capture);
		if (capture.kind === "target" && capture.exclusiveControl) this.exclusiveControls.set(capture.exclusiveControl, controller);
	}
	detachCapture(controller) {
		const capture = this.captures.get(controller);
		if (!capture) return void 0;
		this.captures.delete(controller);
		this.directTouch.setCaptureRegion(controller);
		if (capture.kind === "target" && capture.exclusiveControl && this.exclusiveControls.get(capture.exclusiveControl) === controller) this.exclusiveControls.delete(capture.exclusiveControl);
		return capture;
	}
	runCaptureTransition(controller, transition) {
		try {
			transition();
		} catch (error) {
			this.cancelFailedCapture(controller, error);
		}
	}
	cancelFailedCapture(controller, error) {
		this.suppressedUntilRelease.add(controller);
		try {
			this.cancelCapture(controller, "pointer-cancel");
		} catch {}
		throw error;
	}
	cancelFailedManipulations(error) {
		for (const [controller, capture] of [...this.captures]) if ((capture.kind === "auxiliary" || capture.kind === "target" && capture.action === "manipulate") && !this.manipulation.isSourceActive(controller)) try {
			this.cancelCapture(controller, "pointer-cancel");
		} catch {}
		throw error;
	}
	runManipulationTransition(transition) {
		try {
			return transition();
		} catch (error) {
			this.cancelFailedManipulations(error);
		}
	}
	invokeSemantic(capture, callback) {
		if (!capture.semanticControl) return;
		this.callbacks.invokeSemantic(capture.semanticControl, callback);
	}
};
function semanticInput(snapshot, resolved, projector, physicalSurface) {
	const projection = snapshot.ray ? projector?.(snapshot.ray) : physicalSurface ? projectPointOnSurface(physicalSurface, snapshot.position) : void 0;
	return {
		source: snapshot.source,
		point: projection?.point ?? resolved.intersection.point.clone(),
		uv: projection?.uv ?? resolved.intersection.uv?.clone()
	};
}
function isContinuousControl(control) {
	return control?.kind === "slider" || control?.kind === "input";
}
function clonePublicIntersection(intersection, surface) {
	return {
		...intersection,
		object: surface,
		point: intersection.point.clone(),
		normal: intersection.normal?.clone(),
		uv: intersection.uv?.clone(),
		uv1: intersection.uv1?.clone()
	};
}
function controllerIndex(controller) {
	const value = controller.userData.id;
	return typeof value === "number" ? value : Number.MAX_SAFE_INTEGER;
}
function selectionBelongsTo(selection, object) {
	return objectIsDescendantOf(selection.target, object) || selection.scriptPath.includes(object);
}
/**
* Creates a PlaneGeometry with UVs remapped to the active depth sensor region.
*/
function createDepthPlaneGeometry(segments, minU, maxU, minV, maxV) {
	const geometry = new PlaneGeometry(1, 1, segments, segments);
	const uvs = geometry.attributes.uv.array;
	const rangeU = maxU - minU;
	const rangeV = maxV - minV;
	for (let i = 0; i < uvs.length; i += 2) {
		uvs[i] = minU + uvs[i] * rangeU;
		uvs[i + 1] = minV + uvs[i + 1] * rangeV;
	}
	return geometry;
}
/**
* Computes smooth vertex normals directly on a regular (cols x rows) grid
* using central differences, avoiding Three.js's indexed triangle accumulation.
*/
function computeGridVertexNormals(geometry, cols, rows) {
	const posAttr = geometry.attributes.position;
	const normAttr = geometry.attributes.normal;
	if (!normAttr || posAttr.count !== cols * rows) {
		geometry.computeVertexNormals();
		return;
	}
	const pos = posAttr.array;
	const norm = normAttr.array;
	for (let row = 0; row < rows; ++row) {
		const rowUp = row > 0 ? row - 1 : 0;
		const rowDown = row < rows - 1 ? row + 1 : rows - 1;
		const rowOffset = row * cols;
		const upOffset = rowUp * cols;
		const downOffset = rowDown * cols;
		for (let col = 0; col < cols; ++col) {
			const colLeft = col > 0 ? col - 1 : 0;
			const colRight = col < cols - 1 ? col + 1 : cols - 1;
			const iLeft = (rowOffset + colLeft) * 3;
			const iRight = (rowOffset + colRight) * 3;
			const iUp = (upOffset + col) * 3;
			const iDown = (downOffset + col) * 3;
			const txX = pos[iRight] - pos[iLeft];
			const txY = pos[iRight + 1] - pos[iLeft + 1];
			const txZ = pos[iRight + 2] - pos[iLeft + 2];
			const tyX = pos[iUp] - pos[iDown];
			const tyY = pos[iUp + 1] - pos[iDown + 1];
			const tyZ = pos[iUp + 2] - pos[iDown + 2];
			const nx = txY * tyZ - txZ * tyY;
			const ny = txZ * tyX - txX * tyZ;
			const nz = txX * tyY - txY * tyX;
			const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
			const iOut = (rowOffset + col) * 3;
			if (len > 0) {
				const invLen = 1 / len;
				norm[iOut] = nx * invLen;
				norm[iOut + 1] = ny * invLen;
				norm[iOut + 2] = nz * invLen;
			} else {
				norm[iOut] = 0;
				norm[iOut + 1] = 0;
				norm[iOut + 2] = 1;
			}
		}
	}
	normAttr.needsUpdate = true;
}
/**
* Caches per-vertex camera unprojection rays and performs vectorized depth-mesh
* vertex position updates.
*/
var DepthGeometryUpdater = class {
	constructor() {
		this.geometryRayCache = /* @__PURE__ */ new WeakMap();
		this.scratchVertexPosition = new Vector3();
	}
	getGeometryMetadata(geometry) {
		return this.geometryRayCache.get(geometry);
	}
	getOrComputeUnprojectionRays(geometry, projectionMatrixInverse) {
		const vertexCount = geometry.attributes.position.count;
		const projElements = projectionMatrixInverse.elements;
		let cached = this.geometryRayCache.get(geometry);
		if (cached && cached.rayXY.length === 2 * vertexCount) {
			let unchanged = true;
			for (let k = 0; k < 16; ++k) if (cached.projInvElements[k] !== projElements[k]) {
				unchanged = false;
				break;
			}
			if (unchanged) return cached.rayXY;
		} else {
			const gridX1 = Math.round(Math.sqrt(vertexCount));
			cached = {
				rayXY: new Float64Array(2 * vertexCount),
				projInvElements: /* @__PURE__ */ new Float64Array(16),
				segments: gridX1 - 1,
				isRectilinear: false,
				minVertexDepth: 0,
				maxVertexDepth: 0,
				hasDepthData: false
			};
			this.geometryRayCache.set(geometry, cached);
		}
		cached.projInvElements.set(projElements);
		const rayXY = cached.rayXY;
		const uvArray = geometry.attributes.uv.array;
		const vertexPosition = this.scratchVertexPosition;
		for (let i = 0; i < vertexCount; ++i) {
			const u = uvArray[2 * i];
			const v = uvArray[2 * i + 1];
			vertexPosition.set(2 * (u - .5), 2 * (v - .5), -1).applyMatrix4(projectionMatrixInverse);
			const invNegZ = -1 / vertexPosition.z;
			rayXY[2 * i] = vertexPosition.x * invNegZ;
			rayXY[2 * i + 1] = vertexPosition.y * invNegZ;
		}
		const gridX1 = cached.segments + 1;
		const lastIdx = 2 * (vertexCount - 1);
		cached.isRectilinear = cached.segments >= 1 && gridX1 * gridX1 === vertexCount && projElements[1] === 0 && projElements[2] === 0 && projElements[4] === 0 && projElements[6] === 0 && Math.abs(rayXY[lastIdx] - rayXY[0]) > 1e-6 && Math.abs(rayXY[lastIdx + 1] - rayXY[1]) > 1e-6;
		return rayXY;
	}
	updateGeometryPositions(params) {
		const { depthData, geometry, depthDataFormat, projectionMatrixInverse, patchHoles, patchHolesUpper, minDepthPrev, maxDepthPrev } = params;
		let { minDepth, maxDepth } = params;
		const width = depthData.width;
		const height = depthData.height;
		const maxX = width - 1;
		const maxY = height - 1;
		const rawValueToMeters = depthData.rawValueToMeters;
		const depthArray = depthDataFormat === "float32" ? new Float32Array(depthData.data) : new Uint16Array(depthData.data);
		const uvArray = geometry.attributes.uv.array;
		const posArray = geometry.attributes.position.array;
		const vertexCount = geometry.attributes.position.count;
		const rayXY = this.getOrComputeUnprojectionRays(geometry, projectionMatrixInverse);
		const cached = this.geometryRayCache.get(geometry);
		const transformMatrix = depthData.normDepthBufferFromNormView?.matrix;
		const hasTransform = Boolean(transformMatrix);
		let m0 = 1, m1 = 0, m3 = 0, m4 = 0, m5 = 1, m7 = 0, m12 = 0, m13 = 0, m15 = 1;
		let isAffineTransform = true;
		if (transformMatrix) {
			m0 = transformMatrix[0];
			m1 = transformMatrix[1];
			m3 = transformMatrix[3];
			m4 = transformMatrix[4];
			m5 = transformMatrix[5];
			m7 = transformMatrix[7];
			m12 = transformMatrix[12];
			m13 = transformMatrix[13];
			m15 = transformMatrix[15];
			isAffineTransform = m3 === 0 && m7 === 0 && m15 === 1;
		}
		let minVertexDepth = Infinity;
		let maxVertexDepth = 0;
		for (let i = 0; i < vertexCount; ++i) {
			const uvIdx = 2 * i;
			const u = uvArray[uvIdx];
			const v = uvArray[uvIdx + 1];
			const vInv = 1 - v;
			let sampleU = u;
			let sampleV = vInv;
			if (hasTransform) {
				sampleU = m0 * u + m4 * vInv + m12;
				sampleV = m1 * u + m5 * vInv + m13;
				if (!isAffineTransform) {
					const invW = 1 / (m3 * u + m7 * vInv + m15);
					sampleU *= invW;
					sampleV *= invW;
				}
			}
			const depthX = Math.round(clamp$1(sampleU * maxX, 0, maxX));
			let depth = rawValueToMeters * depthArray[Math.round(clamp$1(sampleV * maxY, 0, maxY)) * width + depthX];
			if (depth > 0) {
				if (depth < minDepth) minDepth = depth;
				else if (depth > maxDepth) maxDepth = depth;
			}
			if (depth === 0 && patchHoles) depth = maxDepthPrev;
			if (patchHolesUpper && v > .9) depth = minDepthPrev;
			if (depth < minVertexDepth) minVertexDepth = depth;
			if (depth > maxVertexDepth) maxVertexDepth = depth;
			const posIdx = 3 * i;
			posArray[posIdx] = depth * rayXY[uvIdx];
			posArray[posIdx + 1] = depth * rayXY[uvIdx + 1];
			posArray[posIdx + 2] = -depth;
		}
		cached.minVertexDepth = minVertexDepth <= maxVertexDepth ? minVertexDepth : 0;
		cached.maxVertexDepth = maxVertexDepth;
		cached.hasDepthData = maxVertexDepth > 0;
		return {
			minDepth,
			maxDepth
		};
	}
};
/**
* Performs a 2D projective grid walk over a rectilinear depth heightfield,
* testing only the grid cells crossed by the projected 3D ray segment.
*/
var DepthMeshRaycaster = class {
	constructor() {
		this.inverseMatrix = new Matrix4();
		this.localRay = new Ray();
		this.vA = new Vector3();
		this.vB = new Vector3();
		this.vC = new Vector3();
		this.vD = new Vector3();
		this.intersectPoint = new Vector3();
		this.worldPoint = new Vector3();
	}
	raycast(params) {
		const { targetObject, geometry, meta, material, matrixWorld, updateVertexNormals, raycaster, intersects } = params;
		const startIndex = intersects.length;
		this.raycastRectilinearGrid(targetObject, geometry, meta.rayXY, meta.segments, meta.minVertexDepth, meta.maxVertexDepth, material, matrixWorld, updateVertexNormals, raycaster, intersects);
		if (intersects.length - startIndex > 1) {
			const added = intersects.splice(startIndex);
			added.sort((a, b) => (a.faceIndex ?? 0) - (b.faceIndex ?? 0));
			intersects.push(...added);
		}
	}
	raycastRectilinearGrid(targetObject, geometry, rayXY, segments, minVertexDepth, maxVertexDepth, material, matrixWorld, updateVertexNormals, raycaster, intersects) {
		this.inverseMatrix.copy(matrixWorld).invert();
		const localRay = this.localRay.copy(raycaster.ray).applyMatrix4(this.inverseMatrix);
		const ox = localRay.origin.x;
		const oy = localRay.origin.y;
		const oz = localRay.origin.z;
		const dx = localRay.direction.x;
		const dy = localRay.direction.y;
		const dz = localRay.direction.z;
		const gridX1 = segments + 1;
		const lastIdx = 2 * (gridX1 * gridX1 - 1);
		const rx0 = rayXY[0];
		const ry0 = rayXY[1];
		const rx1 = rayXY[lastIdx];
		const ry1 = rayXY[lastIdx + 1];
		const rxMin = Math.min(rx0, rx1) - 1e-5;
		const rxMax = Math.max(rx0, rx1) + 1e-5;
		const ryMin = Math.min(ry0, ry1) - 1e-5;
		const ryMax = Math.max(ry0, ry1) + 1e-5;
		const zMin = Math.max(1e-4, minVertexDepth - 1e-4);
		const zMax = maxVertexDepth + 1e-4;
		let t0 = 0;
		let t1 = Infinity;
		const clipPlane = (a, b) => {
			if (a > 1e-12) {
				const t = b / a;
				if (t < t1) t1 = t;
			} else if (a < -1e-12) {
				const t = b / a;
				if (t > t0) t0 = t;
			} else if (b < -1e-7) return false;
			return t0 <= t1;
		};
		if (!clipPlane(dz, -oz - zMin) || !clipPlane(-dz, oz + zMax) || !clipPlane(-(dx + dz * rxMin), ox + oz * rxMin) || !clipPlane(dx + dz * rxMax, -(ox + oz * rxMax)) || !clipPlane(-(dy + dz * ryMin), oy + oz * ryMin) || !clipPlane(dy + dz * ryMax, -(oy + oz * ryMax)) || !Number.isFinite(t1)) return;
		const invNegZ0 = -1 / (oz + t0 * dz);
		const invNegZ1 = -1 / (oz + t1 * dz);
		const invRxSpan = segments / (rx1 - rx0);
		const invRySpan = segments / (ry1 - ry0);
		const c0 = ((ox + t0 * dx) * invNegZ0 - rx0) * invRxSpan;
		const r0 = ((oy + t0 * dy) * invNegZ0 - ry0) * invRySpan;
		const c1 = ((ox + t1 * dx) * invNegZ1 - rx0) * invRxSpan;
		const r1 = ((oy + t1 * dy) * invNegZ1 - ry0) * invRySpan;
		const dc = c1 - c0;
		const dr = r1 - r0;
		const maxCell = segments - 1;
		const posArray = geometry.attributes.position.array;
		const uvAttr = geometry.attributes.uv;
		const normalAttr = geometry.attributes.normal;
		if (Math.abs(dc) >= Math.abs(dr)) {
			const cMin = Math.min(c0, c1);
			const cMax = Math.max(c0, c1);
			const ixStart = Math.max(0, Math.min(maxCell, Math.floor(cMin - 1e-5)));
			const ixEnd = Math.max(0, Math.min(maxCell, Math.floor(cMax + 1e-5)));
			const slope = Math.abs(dc) > 1e-7 ? dr / dc : 0;
			for (let ix = ixStart; ix <= ixEnd; ++ix) {
				const segC0 = Math.max(cMin, Math.min(cMax, ix));
				const segC1 = Math.max(cMin, Math.min(cMax, ix + 1));
				const rAt0 = r0 + (segC0 - c0) * slope;
				const rAt1 = r0 + (segC1 - c0) * slope;
				const iyStart = Math.max(0, Math.min(maxCell, Math.floor(Math.min(rAt0, rAt1) - 1e-5)));
				const iyEnd = Math.max(0, Math.min(maxCell, Math.floor(Math.max(rAt0, rAt1) + 1e-5)));
				for (let iy = iyStart; iy <= iyEnd; ++iy) this.testGridCell(targetObject, ix, iy, gridX1, segments, posArray, uvAttr, normalAttr, material, matrixWorld, updateVertexNormals, raycaster, intersects);
			}
		} else {
			const rMin = Math.min(r0, r1);
			const rMax = Math.max(r0, r1);
			const iyStart = Math.max(0, Math.min(maxCell, Math.floor(rMin - 1e-5)));
			const iyEnd = Math.max(0, Math.min(maxCell, Math.floor(rMax + 1e-5)));
			const invSlope = Math.abs(dr) > 1e-7 ? dc / dr : 0;
			for (let iy = iyStart; iy <= iyEnd; ++iy) {
				const segR0 = Math.max(rMin, Math.min(rMax, iy));
				const segR1 = Math.max(rMin, Math.min(rMax, iy + 1));
				const cAt0 = c0 + (segR0 - r0) * invSlope;
				const cAt1 = c0 + (segR1 - r0) * invSlope;
				const ixStart = Math.max(0, Math.min(maxCell, Math.floor(Math.min(cAt0, cAt1) - 1e-5)));
				const ixEnd = Math.max(0, Math.min(maxCell, Math.floor(Math.max(cAt0, cAt1) + 1e-5)));
				for (let ix = ixStart; ix <= ixEnd; ++ix) this.testGridCell(targetObject, ix, iy, gridX1, segments, posArray, uvAttr, normalAttr, material, matrixWorld, updateVertexNormals, raycaster, intersects);
			}
		}
	}
	testGridCell(targetObject, ix, iy, gridX1, segments, posArray, uvAttr, normalAttr, material, matrixWorld, updateVertexNormals, raycaster, intersects) {
		const a = ix + gridX1 * iy;
		const b = ix + gridX1 * (iy + 1);
		const c = ix + 1 + gridX1 * (iy + 1);
		const d = ix + 1 + gridX1 * iy;
		const a3 = 3 * a;
		const b3 = 3 * b;
		const c3 = 3 * c;
		const d3 = 3 * d;
		this.vA.set(posArray[a3], posArray[a3 + 1], posArray[a3 + 2]);
		this.vB.set(posArray[b3], posArray[b3 + 1], posArray[b3 + 2]);
		this.vC.set(posArray[c3], posArray[c3 + 1], posArray[c3 + 2]);
		this.vD.set(posArray[d3], posArray[d3 + 1], posArray[d3 + 2]);
		const baseFaceIndex = 2 * (ix + segments * iy);
		this.testGridTriangle(targetObject, a, b, d, this.vA, this.vB, this.vD, baseFaceIndex, uvAttr, normalAttr, material, matrixWorld, updateVertexNormals, raycaster, intersects);
		this.testGridTriangle(targetObject, b, c, d, this.vB, this.vC, this.vD, baseFaceIndex + 1, uvAttr, normalAttr, material, matrixWorld, updateVertexNormals, raycaster, intersects);
	}
	testGridTriangle(targetObject, idxA, idxB, idxC, vA, vB, vC, faceIndex, uvAttr, normalAttr, material, matrixWorld, updateVertexNormals, raycaster, intersects) {
		const localRay = this.localRay;
		const intersectPoint = this.intersectPoint;
		if ((material.side === 1 ? localRay.intersectTriangle(vC, vB, vA, true, intersectPoint) : localRay.intersectTriangle(vA, vB, vC, material.side === 0, intersectPoint)) === null) return;
		const worldPoint = this.worldPoint.copy(intersectPoint).applyMatrix4(matrixWorld);
		const distance = raycaster.ray.origin.distanceTo(worldPoint);
		if (distance < raycaster.near || distance > raycaster.far) return;
		const barycoord = new Vector3();
		Triangle.getBarycoord(intersectPoint, vA, vB, vC, barycoord);
		const faceNormal = Triangle.getNormal(vA, vB, vC, new Vector3());
		const face = {
			a: idxA,
			b: idxB,
			c: idxC,
			normal: faceNormal,
			materialIndex: 0
		};
		let normal;
		if (normalAttr) {
			if (updateVertexNormals) {
				normal = Triangle.getInterpolatedAttribute(normalAttr, idxA, idxB, idxC, barycoord, new Vector3());
				if (normal.dot(localRay.direction) > 0) normal.multiplyScalar(-1);
			} else normal = faceNormal.clone();
		}
		const intersection = {
			distance,
			point: worldPoint.clone(),
			object: targetObject,
			face,
			faceIndex,
			barycoord
		};
		if (uvAttr) intersection.uv = Triangle.getInterpolatedAttribute(uvAttr, idxA, idxB, idxC, barycoord, new Vector2());
		if (normal) intersection.normal = normal;
		intersects.push(intersection);
	}
};
var DepthMeshTexturedShader = {
	name: "DepthMeshTexturedShader",
	vertexShader: `
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vObjectPosition;
varying vec2 vUv;

void main() {
  vUv = uv;
  vNormal = normal;
  vObjectPosition = position;

  // Computes the view position.
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
`,
	fragmentShader: `
#include <packing>

uniform vec3 uColor;
uniform sampler2D uDepthTexture;
uniform sampler2DArray uDepthTextureArray;
uniform vec3 uLightDirection;
uniform vec2 uResolution;
uniform float uRawValueToMeters;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vObjectPosition;
varying vec2 vUv;

const highp float kMaxDepthInMeters = 8.0;
const float kInvalidDepthThreshold = 0.01;
uniform float uMinDepth;
uniform float uMaxDepth;
uniform float uDebug;
uniform float uOpacity;
uniform bool uUsingFloatDepth;
uniform bool uIsTextureArray;
uniform bool uUseDerivativeNormals;
uniform mat4 uNormDepthBufferFromNormView;

float saturate(in float x) {
  return clamp(x, 0.0, 1.0);
}

vec3 TurboColormap(in float x) {
  const vec4 kRedVec4 = vec4(0.55305649, 3.00913185, -5.46192616, -11.11819092);
  const vec4 kGreenVec4 = vec4(0.16207513, 0.17712472, 15.24091500, -36.50657960);
  const vec4 kBlueVec4 = vec4(-0.05195877, 5.18000081, -30.94853351, 81.96403246);
  const vec2 kRedVec2 = vec2(27.81927491, -14.87899417);
  const vec2 kGreenVec2 = vec2(25.95549545, -5.02738237);
  const vec2 kBlueVec2 = vec2(-86.53476570, 30.23299484);

  // Adjusts color space via 6 degree poly interpolation to avoid pure red.
  vec4 v4 = vec4( 1.0, x, x * x, x * x * x);
  vec2 v2 = v4.zw * v4.z;
  return vec3(
    dot(v4, kRedVec4)   + dot(v2, kRedVec2),
    dot(v4, kGreenVec4) + dot(v2, kGreenVec2),
    dot(v4, kBlueVec4)  + dot(v2, kBlueVec2)
  );
}

// Depth is packed into the luminance and alpha components of its texture.
// The texture is in a normalized format, storing raw values that need to be
// converted to meters.
float DepthGetMeters(in sampler2D depth_texture, in vec2 depth_uv) {
  if (uUsingFloatDepth) {
    return texture2D(depth_texture, depth_uv).r * uRawValueToMeters;
  }
  vec2 packedDepthAndVisibility = texture2D(depth_texture, depth_uv).rg;
  return dot(packedDepthAndVisibility, vec2(255.0, 256.0 * 255.0)) * uRawValueToMeters;
}

float DepthArrayGetMeters(in sampler2DArray depth_texture, in vec2 depth_uv) {
  return uRawValueToMeters * texture(uDepthTextureArray, vec3 (depth_uv.x, depth_uv.y, 0)).r;
}

vec3 DepthGetColorVisualization(in float x) {
  return step(kInvalidDepthThreshold, x) * TurboColormap(x);
}

void main() {
  vec3 lightDirection = normalize(uLightDirection);
  vec3 surfaceNormal = uUseDerivativeNormals
    ? normalize(cross(dFdx(vObjectPosition), dFdy(vObjectPosition)))
    : normalize(vNormal);

  // Compute UV coordinates relative to resolution
  // vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 uv = vUv;

  // Ambient, diffuse, and specular terms
  vec3 ambient = 0.1 * uColor;
  float diff = max(dot(surfaceNormal, lightDirection), 0.0);
  vec3 diffuse = diff * uColor;

  vec3 viewDir = normalize(vViewPosition);
  vec3 reflectDir = reflect(-lightDirection, surfaceNormal);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), 16.0);
  vec3 specular = vec3(0.5) * spec; // Adjust specular color/strength

  // Combine Phong lighting
  vec3 finalColor = ambient + diffuse + specular;
  // finalColor = vec3(surfaceNormal);

  // Output color
  gl_FragColor = uOpacity * vec4(finalColor, 1.0);

  if (uDebug > 0.5) {
    return;
  }

  vec2 view_uv = vec2(uv.x, 1.0 - uv.y);
  vec2 depth_uv = (uNormDepthBufferFromNormView * vec4(view_uv, 0.0, 1.0)).xy;

  float depth = (uIsTextureArray ? DepthArrayGetMeters(uDepthTextureArray, depth_uv) : DepthGetMeters(uDepthTexture, depth_uv)) * 8.0;
  float normalized_depth =
    saturate((depth - uMinDepth) / (uMaxDepth - uMinDepth));
  gl_FragColor =  vec4(TurboColormap(normalized_depth), 1.0);
}
`
};
var DepthMesh = class extends MeshScript {
	static {
		this.isDepthMesh = true;
	}
	constructor(depthOptions, width, height, depthTextures) {
		const options = depthOptions.depthMesh;
		const depthResolution = options.depthFullResolution;
		const ignoreEdgePixels = options.ignoreEdgePixels;
		const activeRes = Math.max(2, depthResolution - 2 * ignoreEdgePixels);
		const minU = ignoreEdgePixels / (depthResolution - 1);
		const maxU = (depthResolution - 1 - ignoreEdgePixels) / (depthResolution - 1);
		const minV = ignoreEdgePixels / (depthResolution - 1);
		const maxV = (depthResolution - 1 - ignoreEdgePixels) / (depthResolution - 1);
		const geometry = createDepthPlaneGeometry(activeRes - 1, minU, maxU, minV, maxV);
		let material;
		let uniforms;
		if (options.useDepthTexture || options.showDebugTexture) {
			uniforms = {
				uDepthTexture: { value: null },
				uDepthTextureArray: { value: null },
				uIsTextureArray: { value: 0 },
				uColor: { value: new Color(11184810) },
				uResolution: { value: new Vector2(width, height) },
				uRawValueToMeters: { value: 1 },
				uMinDepth: { value: 0 },
				uMaxDepth: { value: 8 },
				uOpacity: { value: options.opacity },
				uDebug: { value: options.showDebugTexture ? 1 : 0 },
				uLightDirection: { value: new Vector3(1, 1, 1).normalize() },
				uUsingFloatDepth: { value: depthOptions.dataFormatPreference[0] === "float32" },
				uUseDerivativeNormals: { value: !options.updateVertexNormals },
				uNormDepthBufferFromNormView: { value: new Matrix4() }
			};
			material = new ShaderMaterial({
				uniforms,
				vertexShader: DepthMeshTexturedShader.vertexShader,
				fragmentShader: DepthMeshTexturedShader.fragmentShader,
				side: 2,
				transparent: true
			});
		} else {
			material = new ShadowMaterial({ opacity: options.shadowOpacity });
			material.depthWrite = false;
		}
		material.visible = options.showDebugTexture || options.renderShadow;
		super(geometry, material);
		this.depthOptions = depthOptions;
		this.depthTextures = depthTextures;
		this.worldPosition = new Vector3();
		this.worldQuaternion = new Quaternion();
		this.updateVertexNormals = false;
		this.minDepth = 8;
		this.maxDepth = 0;
		this.minDepthPrev = 8;
		this.maxDepthPrev = 0;
		this.colliders = [];
		this.projectionMatrixInverse = new Matrix4();
		this.lastColliderUpdateTime = 0;
		this.colliderId = 0;
		this.disposed = false;
		this.geometryUpdater = new DepthGeometryUpdater();
		this.gridRaycaster = new DepthMeshRaycaster();
		this.gridResolution = activeRes;
		this.visible = true;
		this.xb = {
			pointerEvents: "none",
			reticleMode: "surface"
		};
		this.options = options;
		this.lastColliderUpdateTime = performance.now();
		this.updateVertexNormals = options.updateVertexNormals;
		this.colliderUpdateFps = options.colliderUpdateFps;
		this.depthTextureMaterialUniforms = uniforms;
		if (options.renderShadow) {
			this.receiveShadow = true;
			this.castShadow = false;
		}
		if (options.useDownsampledGeometry) {
			this.downsampledGeometry = createDepthPlaneGeometry(39, minU, maxU, minV, maxV);
			this.downsampledMesh = new Mesh(this.downsampledGeometry, material);
			this.downsampledMesh.visible = false;
		}
	}
	get depthTextureUniforms() {
		return this.depthTextureMaterialUniforms;
	}
	/**
	* Sets a custom material (such as a WebGPU NodeMaterial) and registers a
	* callback to synchronize uniforms on depth updates.
	*
	* @param material - The material to apply to the depth mesh.
	* @param onUpdate - Optional callback invoked whenever depth uniforms change.
	*/
	setCustomMaterial(material, onUpdate) {
		disposeMaterial(this.material);
		material.visible = this.options.showDebugTexture || this.options.renderShadow;
		if (this.depthTextureMaterialUniforms) material.uniforms = this.depthTextureMaterialUniforms;
		this.material = material;
		if (this.downsampledMesh) this.downsampledMesh.material = material;
		this.customMaterialUpdateCallback = onUpdate;
		this.onBeforeRender = () => {
			this.customMaterialUpdateCallback?.();
		};
	}
	/**
	* Updates the depth data and geometry positions based on the provided camera
	* and depth data.
	*/
	updateDepth(depthData, projectionMatrixInverse, depthDataFormat) {
		this.projectionMatrixInverse = projectionMatrixInverse;
		this.minDepth = 8;
		this.maxDepth = 0;
		if (this.options.updateFullResolutionGeometry) this.updateFullResolutionGeometry(depthData, depthDataFormat);
		if (this.downsampledGeometry) {
			this.updateGeometry(depthData, this.downsampledGeometry, depthDataFormat);
			this.downsampledGeometry.attributes.position.needsUpdate = true;
		}
		this.minDepthPrev = this.minDepth;
		this.maxDepthPrev = this.maxDepth;
		const depthTextureLeft = this.depthTextures?.get(0);
		if (depthTextureLeft && this.depthTextureMaterialUniforms) {
			this.depthTextureMaterialUniforms.uUsingFloatDepth.value = depthDataFormat === "float32";
			this.depthTextureMaterialUniforms.uUseDerivativeNormals.value = !this.options.updateVertexNormals;
			if (depthData.normDepthBufferFromNormView) this.depthTextureMaterialUniforms.uNormDepthBufferFromNormView.value.fromArray(depthData.normDepthBufferFromNormView.matrix);
			else this.depthTextureMaterialUniforms.uNormDepthBufferFromNormView.value.identity();
			const isTextureArray = depthTextureLeft instanceof ExternalTexture;
			this.depthTextureMaterialUniforms.uIsTextureArray.value = isTextureArray ? 1 : 0;
			if (isTextureArray) this.depthTextureMaterialUniforms.uDepthTextureArray.value = depthTextureLeft;
			else this.depthTextureMaterialUniforms.uDepthTexture.value = depthTextureLeft;
			this.depthTextureMaterialUniforms.uMinDepth.value = this.minDepth;
			this.depthTextureMaterialUniforms.uMaxDepth.value = this.maxDepth;
			this.depthTextureMaterialUniforms.uRawValueToMeters.value = this.depthTextures.depthData.length ? this.depthTextures.depthData[0].rawValueToMeters : 1;
		}
		this.customMaterialUpdateCallback?.();
		if (this.options.updateVertexNormals) computeGridVertexNormals(this.geometry, this.gridResolution, this.gridResolution);
		this.updateColliderIfNeeded();
	}
	updatePose(translation, quaternion) {
		this.position.copy(translation);
		this.quaternion.copy(quaternion);
		if (this.downsampledMesh) {
			this.downsampledMesh.position.copy(translation);
			this.downsampledMesh.quaternion.copy(quaternion);
			this.downsampledMesh.updateMatrixWorld();
		}
	}
	/**
	* Method to manually update the full resolution geometry.
	* Only needed if options.updateFullResolutionGeometry is false.
	*/
	updateFullResolutionGeometry(depthData, depthDataFormat) {
		this.updateGeometry(depthData, this.geometry, depthDataFormat);
		this.geometry.attributes.position.needsUpdate = true;
	}
	/**
	* Internal method to update the geometry of the depth mesh.
	*/
	updateGeometry(depthData, geometry, depthDataFormat) {
		const bounds = this.geometryUpdater.updateGeometryPositions({
			depthData,
			geometry,
			depthDataFormat,
			projectionMatrixInverse: this.projectionMatrixInverse,
			patchHoles: this.options.patchHoles,
			patchHolesUpper: this.options.patchHolesUpper,
			minDepthPrev: this.minDepthPrev,
			maxDepthPrev: this.maxDepthPrev,
			minDepth: this.minDepth,
			maxDepth: this.maxDepth
		});
		this.minDepth = bounds.minDepth;
		this.maxDepth = bounds.maxDepth;
	}
	/**
	* Optimizes collider updates to run periodically based on the specified FPS.
	*/
	updateColliderIfNeeded() {
		const timeSinceLastUpdate = performance.now() - this.lastColliderUpdateTime;
		if (this.RAPIER && timeSinceLastUpdate > 1e3 / this.colliderUpdateFps) {
			this.getWorldPosition(this.worldPosition);
			this.getWorldQuaternion(this.worldQuaternion);
			this.rigidBody.setTranslation(this.worldPosition, false);
			this.rigidBody.setRotation(this.worldQuaternion, false);
			const geometry = this.downsampledGeometry ? this.downsampledGeometry : this.geometry;
			const vertices = geometry.attributes.position.array;
			const indices = geometry.getIndex().array;
			const shape = this.RAPIER.ColliderDesc.trimesh(vertices, indices).setDensity(1);
			if (this.options.useDualCollider) {
				this.colliderId = (this.colliderId + 1) % 2;
				this.blendedWorld.removeCollider(this.colliders[this.colliderId], false);
				this.colliders[this.colliderId] = this.blendedWorld.createCollider(shape, this.rigidBody);
			} else {
				const newCollider = this.blendedWorld.createCollider(shape, this.rigidBody);
				this.blendedWorld.removeCollider(this.collider, false);
				this.collider = newCollider;
			}
			this.lastColliderUpdateTime = performance.now();
		}
	}
	initRapierPhysics(rapier, blendedWorld) {
		this.getWorldPosition(this.worldPosition);
		this.getWorldQuaternion(this.worldQuaternion);
		const desc = rapier.RigidBodyDesc.fixed().setTranslation(this.worldPosition.x, this.worldPosition.y, this.worldPosition.z).setRotation(this.worldQuaternion);
		this.rigidBody = blendedWorld.createRigidBody(desc);
		const vertices = this.geometry.attributes.position.array;
		const indices = this.geometry.getIndex().array;
		const shape = rapier.ColliderDesc.trimesh(vertices, indices);
		if (this.options.useDualCollider) {
			this.colliders = [];
			this.colliders.push(blendedWorld.createCollider(shape, this.rigidBody), blendedWorld.createCollider(shape, this.rigidBody));
			this.colliderId = 0;
		} else this.collider = blendedWorld.createCollider(shape, this.rigidBody);
		this.RAPIER = rapier;
		this.blendedWorld = blendedWorld;
		this.lastColliderUpdateTime = performance.now();
	}
	/**
	* Customizes raycasting to compute normals for intersections.
	* Uses a 2D projective grid walk over the depth heightfield when depth
	* data is available, avoiding brute-force tests across all grid triangles.
	* @param raycaster - The raycaster object.
	* @param intersects - Array to store intersections.
	* @returns - True if intersections are found.
	*/
	raycast(raycaster, intersects) {
		const geometry = this.downsampledGeometry ?? this.geometry;
		const material = this.material;
		if (material === void 0) return true;
		const meta = this.geometryUpdater.getGeometryMetadata(geometry);
		if (meta && meta.hasDepthData && meta.isRectilinear && !Array.isArray(material)) {
			this.gridRaycaster.raycast({
				targetObject: this,
				geometry,
				meta,
				material,
				matrixWorld: this.downsampledMesh ? this.downsampledMesh.matrixWorld : this.matrixWorld,
				updateVertexNormals: this.updateVertexNormals,
				raycaster,
				intersects
			});
			return true;
		}
		const intersections = [];
		if (this.downsampledMesh) this.downsampledMesh.raycast(raycaster, intersections);
		else super.raycast(raycaster, intersections);
		intersections.forEach((intersect) => {
			intersect.object = this;
		});
		if (!this.updateVertexNormals) intersections.forEach((intersect) => {
			if (intersect.normal && intersect.face) intersect.normal.copy(intersect.face.normal);
		});
		intersects.push(...intersections);
		return true;
	}
	getColliderFromHandle(handle) {
		if (this.collider?.handle == handle) return this.collider;
		for (const collider of this.colliders) if (collider?.handle == handle) return collider;
	}
	/** Called by Depth at terminal teardown, not on Script disconnection. */
	disposeResources() {
		if (this.disposed) return;
		this.disposed = true;
		const world = this.blendedWorld;
		const body = this.rigidBody;
		this.blendedWorld = void 0;
		this.rigidBody = void 0;
		this.RAPIER = void 0;
		this.collider = void 0;
		this.colliders.length = 0;
		let firstError;
		const cleanups = [
			() => {
				if (body) world.removeRigidBody(body);
			},
			() => this.geometry.dispose(),
			() => this.downsampledGeometry?.dispose(),
			() => disposeMaterial(this.material)
		];
		for (const cleanup of cleanups) try {
			cleanup();
		} catch (error) {
			firstError ??= error;
		}
		this.downsampledMesh?.removeFromParent();
		this.downsampledMesh = void 0;
		this.downsampledGeometry = void 0;
		if (this.depthTextureMaterialUniforms) {
			this.depthTextureMaterialUniforms.uDepthTexture.value = null;
			this.depthTextureMaterialUniforms.uDepthTextureArray.value = null;
		}
		this.depthTextures = void 0;
		if (firstError !== void 0) throw firstError;
	}
};
var Registry = class {
	constructor() {
		this.instances = /* @__PURE__ */ new Map();
	}
	/**
	* Registers an new instanceof a given type.
	* If an existing instance of the same type is already registered, it will be
	* overwritten.
	* @param instance - The instance to register.
	* @param type - Type to register the instance as. Will default to
	* `instance.constructor` if not defined.
	*/
	register(instance, type) {
		const registrationType = type ?? instance.constructor;
		if (instance instanceof registrationType) this.instances.set(registrationType, instance);
		else throw new Error(`Instance of type '${instance.constructor.name}' is not an instance of the registration type '${registrationType.name}'.`);
	}
	/**
	* Gets an existing instance of a registered type.
	* @param type - The constructor function of the type to retrieve.
	* @returns The instance of the requested type.
	*/
	get(type) {
		return this.instances.get(type);
	}
	/**
	* Gets an existing instance of a registered type, or creates a new one if it
	* doesn't exist.
	* @param type - The constructor function of the type to retrieve.
	* @param factory - A function that creates a new instance of the type if it
	* doesn't already exist.
	* @returns The instance of the requested type.
	*/
	getOrCreate(type, factory) {
		let instance = this.get(type);
		if (instance === void 0) {
			instance = factory();
			if (!(instance instanceof type)) throw new Error(`Factory for type ${type.name} returned an incompatible instance of type ${instance.constructor.name}.`);
			this.register(instance, type);
		}
		return instance;
	}
	/**
	* Unregisters an instance of a given type.
	* @param type - The type to unregister.
	*/
	unregister(type) {
		this.instances.delete(type);
	}
};
var WaitFrame = class {
	constructor() {
		this.callbacks = [];
	}
	/**
	* Executes all registered callbacks and clears the list.
	*/
	onFrame() {
		this.callbacks.forEach((callback) => {
			try {
				callback();
			} catch (e) {
				console.error(e);
			}
		});
		this.callbacks.length = 0;
	}
	/**
	* Wait for the next frame.
	*/
	async waitFrame() {
		return new Promise((resolve) => {
			this.callbacks.push(resolve);
		});
	}
};
var REFERENCE_SPACE_TYPES = [
	"viewer",
	"local",
	"local-floor",
	"bounded-floor",
	"unbounded"
];
var tempMatRel = new Matrix4();
var tempMatPose = new Matrix4();
var tempPosition = new Vector3();
var tempOrientation = new Quaternion();
var tempScale = new Vector3(1, 1, 1);
/**
* Manages and caches WebXR reference spaces for the active XR session.
*/
var XRReferenceSpaceCache = class {
	constructor() {
		this.spaces = /* @__PURE__ */ new Map();
		this.session = null;
	}
	/**
	* Called when an XR session starts to reset the cache and request all reference spaces.
	* @param session - The newly started WebXR session.
	*/
	onXRSessionStart(session) {
		this.spaces.clear();
		this.session = session;
		session.addEventListener("end", () => {
			if (this.session === session) this.session = null;
			this.spaces.clear();
		}, { once: true });
		for (const type of REFERENCE_SPACE_TYPES) session.requestReferenceSpace(type).then((space) => {
			if (this.session !== session) return;
			this.spaces.set(type, space);
			console.debug(`[XRReferenceSpaceCache] Cached reference space "${type}"`);
		}).catch((error) => {
			console.debug(`[XRReferenceSpaceCache] Reference space "${type}" not available`, error);
		});
	}
	/**
	* Synchronously returns a reference space if it has already been cached.
	* @param type - The reference space type to check.
	*/
	getCached(type) {
		return this.spaces.get(type);
	}
	/**
	* Converts a pose from a source reference space to a target reference space using the active XRFrame.
	* @param pose - The pose in the source reference space.
	* @param from - The source reference space type or XRSpace instance.
	* @param to - The target reference space type or XRSpace instance.
	* @param frame - The active XR frame.
	* @returns The converted pose in the target reference space, or null if reference spaces or relative pose cannot be resolved.
	*/
	convertPose(pose, from, to, frame) {
		const fromSpace = typeof from === "string" ? this.getCached(from) : from;
		const toSpace = typeof to === "string" ? this.getCached(to) : to;
		if (!fromSpace || !toSpace || !frame) return null;
		const relativePose = frame.getPose(fromSpace, toSpace);
		if (!relativePose) return null;
		tempMatRel.fromArray(relativePose.transform.matrix);
		tempMatPose.fromArray(pose.matrix);
		tempMatRel.multiply(tempMatPose);
		tempMatRel.decompose(tempPosition, tempOrientation, tempScale);
		return new XRRigidTransform(tempPosition, tempOrientation);
	}
};
var DepthTextures = class {
	constructor(options) {
		this.options = options;
		this.float32Arrays = [];
		this.uint8Arrays = [];
		this.dataTextures = [];
		this.nativeTextures = [];
		this.depthData = [];
	}
	createDataDepthTextures(depthData, viewId, depthDataFormat) {
		if (this.dataTextures[viewId]) this.dataTextures[viewId].dispose();
		if (depthDataFormat === "float32") {
			const typedArray = new Float32Array(depthData.data);
			const format = RedFormat;
			const type = FloatType;
			this.float32Arrays[viewId] = typedArray;
			this.dataTextures[viewId] = new DataTexture(typedArray, depthData.width, depthData.height, format, type);
		} else {
			const typedArray = new Uint8Array(depthData.data);
			const format = RGFormat;
			const type = UnsignedByteType;
			this.uint8Arrays[viewId] = typedArray;
			this.dataTextures[viewId] = new DataTexture(typedArray, depthData.width, depthData.height, format, type);
		}
	}
	updateData(depthData, viewId, depthDataFormat) {
		if (this.dataTextures.length < viewId + 1 || this.dataTextures[viewId].image.width !== depthData.width || this.dataTextures[viewId].image.height !== depthData.height) this.createDataDepthTextures(depthData, viewId, depthDataFormat);
		else if (depthDataFormat === "float32") {
			const view = new Float32Array(depthData.data);
			this.float32Arrays[viewId] = view;
			this.dataTextures[viewId].image.data = view;
		} else {
			const view = new Uint8Array(depthData.data);
			this.uint8Arrays[viewId] = view;
			this.dataTextures[viewId].image.data = view;
		}
		this.dataTextures[viewId].needsUpdate = true;
		this.depthData[viewId] = depthData;
	}
	updateNativeTexture(depthData, renderer, viewId) {
		assertWebGLRenderer(renderer, "DepthTextures.updateNativeTexture");
		this.renderer = renderer;
		if (this.nativeTextures.length < viewId + 1) this.nativeTextures[viewId] = new ExternalTexture(depthData.texture);
		else this.nativeTextures[viewId].sourceTexture = depthData.texture;
		const textureProperties = renderer.properties.get(this.nativeTextures[viewId]);
		textureProperties.__webglTexture = depthData.texture;
		textureProperties.__version = 1;
	}
	get(viewId) {
		if (this.dataTextures.length > 0) return this.dataTextures[viewId];
		return this.nativeTextures[viewId];
	}
	dispose() {
		let firstError;
		for (const texture of this.dataTextures.splice(0)) try {
			texture.dispose();
		} catch (error) {
			firstError ??= error;
		}
		for (const texture of this.nativeTextures.splice(0)) {
			texture.sourceTexture = null;
			this.renderer?.properties.remove(texture);
		}
		this.renderer = void 0;
		this.float32Arrays.length = 0;
		this.uint8Arrays.length = 0;
		this.depthData.length = 0;
		if (firstError !== void 0) throw firstError;
	}
};
var GPUDepthConverter = class {
	constructor(renderer) {
		this.renderer = renderer;
		this.savedViewport = new Vector4();
		this.savedScissor = new Vector4();
		this.logicalViewport = new Vector4();
		this.restoredViewport = new Vector4();
	}
	/**
	* Converts unsigned short GPU depth from Quest 3 to float32 CPU depth.
	* Restores renderer-managed target and raster state, not arbitrary raw-GL
	* bindings. An independently overridden canvas viewport is restored in GL,
	* but its renderer cache cannot be restored without changing logical defaults.
	*/
	convertGPUToCPU(depthData) {
		if (!this.depthTarget) {
			this.depthTarget = new WebGLRenderTarget(depthData.width, depthData.height, {
				format: RedFormat,
				type: FloatType,
				internalFormat: "R32F",
				minFilter: NearestFilter,
				magFilter: NearestFilter,
				depthBuffer: false
			});
			this.depthTexture = new ExternalTexture(depthData.texture);
			this.gpuPixels = new Float32Array(depthData.width * depthData.height);
			const depthShader = new ShaderMaterial({
				vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    vUv.y = 1.0-vUv.y;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
				fragmentShader: `
                precision highp float;
                precision highp sampler2DArray;

                uniform sampler2DArray uTexture;
                uniform float uCameraNear;
                uniform int uImageIndex;
                varying vec2 vUv;

                void main() {
                  float z = texture(uTexture, vec3(vUv, float(uImageIndex))).r;
                  z = uCameraNear / (1.0 - z);
                  z = clamp(z, 0.0, 20.0);
                  gl_FragColor = vec4(z, 0, 0, 1.0);
                }
            `,
				uniforms: {
					uTexture: { value: this.depthTexture },
					uCameraNear: { value: depthData.depthNear },
					uImageIndex: { value: depthData.imageIndex ?? 0 }
				},
				blending: 0,
				depthTest: false,
				depthWrite: false,
				side: 2
			});
			this.depthMesh = new Mesh(new PlaneGeometry(2, 2), depthShader);
			this.depthScene = new Scene();
			this.depthScene.add(this.depthMesh);
			this.depthCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
		} else if (this.depthTarget.width !== depthData.width || this.depthTarget.height !== depthData.height) {
			this.depthTarget.setSize(depthData.width, depthData.height);
			this.gpuPixels = new Float32Array(depthData.width * depthData.height);
		}
		this.depthTexture.sourceTexture = depthData.texture;
		this.depthMesh.material.uniforms.uCameraNear.value = depthData.depthNear;
		this.depthMesh.material.uniforms.uImageIndex.value = depthData.imageIndex ?? 0;
		const originalRenderTarget = this.renderer.getRenderTarget();
		const activeCubeFace = this.renderer.getActiveCubeFace();
		const activeMipmapLevel = this.renderer.getActiveMipmapLevel();
		this.renderer.getCurrentViewport(this.savedViewport);
		this.renderer.getViewport(this.logicalViewport);
		const gl = this.renderer.getContext();
		this.savedScissor.fromArray(gl.getParameter(gl.SCISSOR_BOX));
		const scissorTest = gl.isEnabled(gl.SCISSOR_TEST);
		const xrEnabled = this.renderer.xr.enabled;
		try {
			this.renderer.xr.enabled = false;
			this.renderer.setRenderTarget(this.depthTarget);
			this.renderer.render(this.depthScene, this.depthCamera);
			this.renderer.readRenderTargetPixels(this.depthTarget, 0, 0, depthData.width, depthData.height, this.gpuPixels, 0);
		} finally {
			this.renderer.xr.enabled = xrEnabled;
			if (originalRenderTarget) {
				const { viewport, scissor, scissorTest: targetScissorTest } = originalRenderTarget;
				originalRenderTarget.viewport = this.savedViewport;
				originalRenderTarget.scissor = this.savedScissor;
				originalRenderTarget.scissorTest = scissorTest;
				try {
					this.renderer.setRenderTarget(originalRenderTarget, activeCubeFace, activeMipmapLevel);
				} finally {
					originalRenderTarget.viewport = viewport;
					originalRenderTarget.scissor = scissor;
					originalRenderTarget.scissorTest = targetScissorTest;
				}
			} else {
				this.renderer.setRenderTarget(null, activeCubeFace, activeMipmapLevel);
				this.renderer.getCurrentViewport(this.restoredViewport);
				if (!this.restoredViewport.equals(this.savedViewport)) this.renderer.setViewport(this.logicalViewport);
				this.renderer.state.viewport(this.savedViewport);
				this.renderer.state.scissor(this.savedScissor);
				this.renderer.state.setScissorTest(scissorTest);
			}
		}
		return {
			width: depthData.width,
			height: depthData.height,
			data: this.gpuPixels.slice().buffer,
			rawValueToMeters: depthData.rawValueToMeters
		};
	}
	/**
	* Releases conversion resources without deleting the UA-owned depth texture.
	* The first cleanup error is rethrown after all releases are attempted.
	* A later conversion lazily recreates the resources.
	*/
	dispose() {
		const { depthTarget, depthMesh, depthTexture, depthScene } = this;
		if (!depthTarget) return;
		this.depthTarget = void 0;
		this.gpuPixels = /* @__PURE__ */ new Float32Array(0);
		depthTexture.sourceTexture = null;
		let firstError;
		const cleanups = [
			() => depthTarget.dispose(),
			() => depthMesh.geometry.dispose(),
			() => depthMesh.material.dispose(),
			() => this.renderer.properties.remove(depthTexture),
			() => depthTexture.dispose(),
			() => depthScene.clear()
		];
		for (const cleanup of cleanups) try {
			cleanup();
		} catch (error) {
			firstError ??= error;
		}
		if (firstError !== void 0) throw firstError;
	}
};
var KawaseBlurShader = {
	name: "KawaseBlurShader",
	defines: { MODE: "0" },
	vertexShader: `
    uniform float uBlurSize;
    uniform vec2 uTexelSize;
    varying vec2 vTexCoord;
    varying vec4 uv1;
    varying vec4 uv2;
    varying vec4 uv3;
    varying vec4 uv4;

    void vertCopy(vec2 uv) {}

    void vertUpsample(vec2 uv) {
        vec2 halfPixel = uTexelSize * 0.5;
        vec2 offset = vec2(uBlurSize);
        uv1.xy = uv + vec2(-halfPixel.x * 2.0, 0.0) * offset;
        uv1.zw = uv + vec2(-halfPixel.x, halfPixel.y) * offset;
        uv2.xy = uv + vec2(0.0, halfPixel.y * 2.0) * offset;
        uv2.zw = uv + halfPixel * offset;
        uv3.xy = uv + vec2(halfPixel.x * 2.0, 0.0) * offset;
        uv3.zw = uv + vec2(halfPixel.x, -halfPixel.y) * offset;
        uv4.xy = uv + vec2(0.0, -halfPixel.y * 2.0) * offset;
        uv4.zw = uv - halfPixel * offset;
    }

    void vertDownsample(vec2 uv) {
        vec2 halfPixel = uTexelSize * 0.5;
        vec2 offset = vec2(uBlurSize);
        uv1.xy = uv - halfPixel * offset;
        uv1.zw = uv + halfPixel * offset;
        uv2.xy = uv - vec2(halfPixel.x, -halfPixel.y) * offset;
        uv2.zw = uv + vec2(halfPixel.x, -halfPixel.y) * offset;
    }

    void main() {
        vTexCoord = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        if (MODE == 0) {
            vertCopy(uv);
        } else if (MODE == 1) {
            vertDownsample(uv);
        } else {
            vertUpsample(uv);
        }
    }
`,
	fragmentShader: `
    uniform sampler2D tDiffuse;
    varying vec2 vTexCoord;
    varying vec4 uv1;
    varying vec4 uv2;
    varying vec4 uv3;
    varying vec4 uv4;

    vec2 getUV0() {
        return vTexCoord;
    }

    vec4 fragCopy() {
        return texture2D(tDiffuse, getUV0());
    }

    vec4 fragDownsample() {
        vec4 sum = texture2D(tDiffuse, getUV0()) * 4.0;
        sum += texture2D(tDiffuse, uv1.xy);
        sum += texture2D(tDiffuse, uv1.zw);
        sum += texture2D(tDiffuse, uv2.xy);
        sum += texture2D(tDiffuse, uv2.zw);
        return sum * 0.125;
    }

    vec4 fragUpsample() {
        vec4 sum = texture2D(tDiffuse, uv1.xy);
        sum += texture2D(tDiffuse, uv1.zw) * 2.0;
        sum += texture2D(tDiffuse, uv2.xy);
        sum += texture2D(tDiffuse, uv2.zw) * 2.0;
        sum += texture2D(tDiffuse, uv3.xy);
        sum += texture2D(tDiffuse, uv3.zw) * 2.0;
        sum += texture2D(tDiffuse, uv4.xy);
        sum += texture2D(tDiffuse, uv4.zw) * 2.0;
        return sum * 0.0833;
    }

    void main(void) {
        if (MODE == 0) {
            gl_FragColor = fragCopy();
        } else if (MODE == 1) {
            gl_FragColor = fragDownsample();
        } else {
            gl_FragColor = fragUpsample();
        }
    }
`
};
var OcclusionShader = {
	name: "OcclusionShader",
	defines: {},
	vertexShader: `
varying vec2 vTexCoord;

void main() {
    vTexCoord = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
    `,
	fragmentShader: `
precision mediump float;

uniform sampler2D tDiffuse;
uniform sampler2D tOcclusionMap;

varying vec2 vTexCoord;

void main(void) {
  vec4 diffuse = texture2D(tDiffuse, vTexCoord);
  vec4 occlusion = texture2D(tOcclusionMap, vTexCoord);
  float occlusionValue = occlusion.r / max(0.0001, occlusion.g);
  occlusionValue = clamp(occlusionValue, 0.0, 1.0);
  gl_FragColor = occlusionValue * diffuse;

  gl_FragColor = sRGBTransferOETF( gl_FragColor );
}
`
};
var OcclusionMapShader = {
	name: "OcclusionMapShader",
	defines: {},
	vertexShader: `
varying vec2 vTexCoord;

void main() {
    vTexCoord = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
  `,
	fragmentShader: `
#include <packing>

precision mediump float;

uniform sampler2D uDepthTexture;
uniform mat4 uUvTransform;
uniform float uRawValueToMeters;
uniform float uAlpha;
uniform float uViewId;
uniform bool uFloatDepth;

uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform float cameraNear;
uniform float cameraFar;

varying vec2 vTexCoord;

float DepthGetMeters(in sampler2D depth_texture, in vec2 depth_uv) {
  // Depth is packed into the luminance and alpha components of its texture.
  // The texture is in a normalized format, storing raw values that need to be
  // converted to meters.
  vec2 packedDepthAndVisibility = texture2D(depth_texture, depth_uv).rg;
  if (uFloatDepth) {
    return packedDepthAndVisibility.r * uRawValueToMeters;
  }
  return dot(packedDepthAndVisibility, vec2(255.0, 256.0 * 255.0)) * uRawValueToMeters;
}

float readOrthographicDepth( sampler2D depthSampler, vec2 coord ) {
  float fragCoordZ = texture2D( depthSampler, coord ).x;
  // See https://github.com/mrdoob/three.js/issues/23072.
  #ifdef USE_LOGDEPTHBUF
    float viewZ = 1.0 - exp2(fragCoordZ * log(cameraFar + 1.0) / log(2.0));
  #else
    float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
  #endif
  return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

void main(void) {
  vec4 texCoord = vec4(vTexCoord, 0, 1);
  vec2 uv = texCoord.xy;
  uv.y = 1.0 - uv.y;

  vec4 diffuse = texture2D( tDiffuse, texCoord.xy );
  highp float real_depth = DepthGetMeters(uDepthTexture, uv);
  highp float virtual_depth =
    (readOrthographicDepth(tDepth, texCoord.xy ) *
    (cameraFar - cameraNear) + cameraNear);
  gl_FragColor = vec4(step(virtual_depth, real_depth), step(0.001, diffuse.a), 0.0, 0.0);
}
`
};
var OcclusionMapMeshMaterial = class extends MeshBasicMaterial {
	constructor(camera, useFloatDepth) {
		super();
		this.uniforms = {
			uDepthTexture: { value: null },
			uDepthTextureArray: { value: null },
			uViewId: { value: 0 },
			uIsTextureArray: { value: 0 },
			uRawValueToMeters: { value: 8 / 65536 },
			cameraFar: { value: camera.far },
			cameraNear: { value: camera.near },
			uFloatDepth: { value: useFloatDepth },
			uDepthViewMatrix: { value: camera.matrixWorldInverse.clone() },
			uDepthProjectionMatrix: { value: camera.projectionMatrix.clone() },
			uDepthNear: { value: 0 }
		};
		this.onBeforeCompile = (shader) => {
			Object.assign(shader.uniforms, this.uniforms);
			this.uniforms = shader.uniforms;
			shader.vertexShader = shader.vertexShader.replace("#include <common>", [
				"uniform mat4 uDepthProjectionMatrix;",
				"uniform mat4 uDepthViewMatrix;",
				"varying vec2 vTexCoord;",
				"varying float vVirtualDepth;",
				"#include <common>"
			].join("\n")).replace("#include <fog_vertex>", [
				"#include <fog_vertex>",
				"vec4 world_position = modelMatrix * vec4( transformed, 1.0 );",
				"vec4 depth_view_position = uDepthViewMatrix * world_position;",
				"vVirtualDepth = -depth_view_position.z;",
				"vec4 depth_clip_position = uDepthProjectionMatrix * depth_view_position;",
				"vec2 depth_ndc = depth_clip_position.xy / max(0.00001, depth_clip_position.w);",
				"vTexCoord = 0.5 + 0.5 * depth_ndc;"
			].join("\n"));
			shader.fragmentShader = shader.fragmentShader.replace("uniform vec3 diffuse;", [
				"uniform vec3 diffuse;",
				"uniform sampler2D uDepthTexture;",
				"uniform sampler2DArray uDepthTextureArray;",
				"uniform float uRawValueToMeters;",
				"uniform float cameraNear;",
				"uniform float cameraFar;",
				"uniform bool uFloatDepth;",
				"uniform bool uIsTextureArray;",
				"uniform float uDepthNear;",
				"uniform int uViewId;",
				"varying vec2 vTexCoord;",
				"varying float vVirtualDepth;"
			].join("\n")).replace("#include <clipping_planes_pars_fragment>", ["#include <clipping_planes_pars_fragment>", `
  float DepthGetMeters(in sampler2D depth_texture, in vec2 depth_uv) {
    // Depth is packed into the luminance and alpha components of its texture.
    // The texture is in a normalized format, storing raw values that need to be
    // converted to meters.
    vec2 packedDepthAndVisibility = texture2D(depth_texture, depth_uv).rg;
    if (uFloatDepth) {
      return packedDepthAndVisibility.r * uRawValueToMeters;
    }
    return dot(packedDepthAndVisibility, vec2(255.0, 256.0 * 255.0)) * uRawValueToMeters;
  }
  float DepthArrayGetMeters(in sampler2DArray depth_texture, in vec2 depth_uv) {
    float textureValue = texture(depth_texture, vec3(depth_uv.x, depth_uv.y, uViewId)).r;
    return uRawValueToMeters * uDepthNear / (1.0 - textureValue);
  }
`].join("\n")).replace("#include <dithering_fragment>", [
				"#include <dithering_fragment>",
				"vec4 texCoord = vec4(vTexCoord, 0, 1);",
				"vec2 uv = vec2(texCoord.x, uIsTextureArray?texCoord.y:(1.0 - texCoord.y));",
				"highp float real_depth = uIsTextureArray ? DepthArrayGetMeters(uDepthTextureArray, uv) : DepthGetMeters(uDepthTexture, uv);",
				"bool outOfBounds = uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0 || vVirtualDepth <= 0.0;",
				"float isNotOccluded = outOfBounds ? 1.0 : step(vVirtualDepth, real_depth);",
				"gl_FragColor = vec4(isNotOccluded, 1.0, 0.0, 1.0);"
			].join("\n"));
		};
	}
};
/**
* Occlusion postprocessing shader pass.
* This is used to generate an occlusion map.
* There are two modes:
* Mode A: Generate an occlusion map for individual materials to use.
* Mode B: Given a rendered frame, run as a postprocessing pass, occluding all
* items in the frame. The steps are
* 1. Compute an occlusion map between the real and virtual depth.
* 2. Blur the occlusion map using Kawase blur.
* 3. (Mode B only) Apply the occlusion map to the rendered frame.
*/
var OcclusionPass = class extends Pass {
	constructor(scene, camera, useFloatDepth = true, renderToScreen = false, occludableItemsLayer = 3, resolutionScale = .5) {
		super();
		this.scene = scene;
		this.camera = camera;
		this.renderToScreen = renderToScreen;
		this.occludableItemsLayer = occludableItemsLayer;
		this.resolutionScale = resolutionScale;
		this.depthTextures = [];
		this.depthNear = [];
		this.depthViewMatrices = [];
		this.depthProjectionMatrices = [];
		this.lastOcclusionMapSize = new Vector2(0, 0);
		this.lastKawaseBlurSize = new Vector2(0, 0);
		this.renderDimensions = new Vector2();
		this.disposed = false;
		this.occlusionMeshMaterial = new OcclusionMapMeshMaterial(camera, useFloatDepth);
		this.occlusionMapUniforms = {
			uDepthTexture: { value: null },
			uDepthTextureArray: { value: null },
			uViewId: { value: 0 },
			uIsTextureArray: { value: 0 },
			uUvTransform: { value: new Matrix4() },
			uRawValueToMeters: { value: 8 / 65536 },
			uAlpha: { value: .75 },
			tDiffuse: { value: null },
			tDepth: { value: null },
			uFloatDepth: { value: useFloatDepth },
			cameraFar: { value: camera.far },
			cameraNear: { value: camera.near }
		};
		this.occlusionMapQuad = new FullScreenQuad(new ShaderMaterial({
			name: "OcclusionMapShader",
			uniforms: this.occlusionMapUniforms,
			vertexShader: OcclusionMapShader.vertexShader,
			fragmentShader: OcclusionMapShader.fragmentShader
		}));
		this.occlusionMapTexture = new WebGLRenderTarget();
		this.kawaseBlurTargets = [
			new WebGLRenderTarget(),
			new WebGLRenderTarget(),
			new WebGLRenderTarget()
		];
		this.kawaseBlurQuads = [
			this.setupKawaseBlur(1, this.occlusionMapTexture.texture),
			this.setupKawaseBlur(1, this.kawaseBlurTargets[0].texture),
			this.setupKawaseBlur(1, this.kawaseBlurTargets[1].texture),
			this.setupKawaseBlur(2, this.kawaseBlurTargets[2].texture),
			this.setupKawaseBlur(2, this.kawaseBlurTargets[1].texture),
			this.setupKawaseBlur(2, this.kawaseBlurTargets[0].texture)
		];
		this.occlusionUniforms = {
			tDiffuse: { value: null },
			tOcclusionMap: { value: this.occlusionMapTexture.texture }
		};
		this.occlusionQuad = new FullScreenQuad(new ShaderMaterial({
			name: "OcclusionShader",
			uniforms: this.occlusionUniforms,
			vertexShader: OcclusionShader.vertexShader,
			fragmentShader: OcclusionShader.fragmentShader
		}));
		this.occludableItemsLayer = occludableItemsLayer;
	}
	setupKawaseBlur(mode, inputTexture) {
		const uniforms = {
			uBlurSize: { value: 7 },
			uTexelSize: { value: new Vector2() },
			tDiffuse: { value: inputTexture }
		};
		const kawase1Material = new ShaderMaterial({
			name: "Kawase",
			uniforms,
			vertexShader: KawaseBlurShader.vertexShader,
			fragmentShader: KawaseBlurShader.fragmentShader,
			defines: { MODE: mode }
		});
		return new FullScreenQuad(kawase1Material);
	}
	setDepthTexture(depthTexture, rawValueToMeters, viewId, depthNear, depthViewMatrix, depthProjectionMatrix) {
		this.depthTextures[viewId] = depthTexture;
		this.occlusionMapUniforms.uRawValueToMeters.value = rawValueToMeters;
		this.occlusionMeshMaterial.uniforms.uRawValueToMeters.value = rawValueToMeters;
		this.depthNear[viewId] = depthNear;
		if (depthViewMatrix) this.depthViewMatrices[viewId] = depthViewMatrix;
		if (depthProjectionMatrix) this.depthProjectionMatrices[viewId] = depthProjectionMatrix;
		if (!(depthTexture instanceof ExternalTexture)) depthTexture.needsUpdate = true;
	}
	/**
	* Render the occlusion map.
	* @param renderer - The three.js renderer.
	* @param writeBuffer - The buffer to write the final result.
	* @param readBuffer - The buffer for the current of virtual depth.
	* @param viewId - The view to render.
	*/
	render(renderer, writeBuffer, readBuffer, viewId = 0) {
		assertWebGLRenderer(renderer, "OcclusionPass");
		const originalRenderTarget = renderer.getRenderTarget();
		const dimensions = this.renderDimensions;
		if (readBuffer == null) this.renderOcclusionMapFromScene(renderer, dimensions, viewId);
		else this.renderOcclusionMapFromReadBuffer(renderer, readBuffer, dimensions, viewId);
		this.blurOcclusionMap(renderer, dimensions);
		this.applyOcclusionMapToRenderedImage(renderer, readBuffer, writeBuffer);
		renderer.setRenderTarget(originalRenderTarget);
	}
	renderOcclusionMapFromScene(renderer, dimensions, viewId) {
		const texture = this.depthTextures[viewId];
		const isTextureArray = texture instanceof ExternalTexture;
		this.occlusionMeshMaterial.uniforms.uIsTextureArray.value = isTextureArray ? 1 : 0;
		this.occlusionMeshMaterial.uniforms.uViewId.value = viewId;
		if (isTextureArray) {
			this.occlusionMeshMaterial.uniforms.uDepthTextureArray.value = texture;
			this.occlusionMeshMaterial.uniforms.uDepthNear.value = this.depthNear[viewId];
		} else this.occlusionMeshMaterial.uniforms.uDepthTexture.value = texture;
		const camera = renderer.xr.getCamera().cameras[viewId] || this.camera;
		this.occlusionMeshMaterial.uniforms.uDepthViewMatrix.value = this.depthViewMatrices[viewId] || camera.matrixWorldInverse;
		this.occlusionMeshMaterial.uniforms.uDepthProjectionMatrix.value = this.depthProjectionMatrices[viewId] || camera.projectionMatrix;
		this.scene.overrideMaterial = this.occlusionMeshMaterial;
		this.getScaledDimensions(renderer, dimensions);
		this.resizeOcclusionMap(dimensions);
		const renderTarget = this.occlusionMapTexture;
		renderer.setRenderTarget(renderTarget);
		const originalCameraLayerMask = camera.layers.mask;
		camera.layers.set(this.occludableItemsLayer);
		renderer.render(this.scene, camera);
		camera.layers.mask = originalCameraLayerMask;
		this.scene.overrideMaterial = null;
	}
	renderOcclusionMapFromReadBuffer(renderer, readBuffer, dimensions, viewId) {
		this.occlusionMapUniforms.tDiffuse.value = readBuffer.texture;
		this.occlusionMapUniforms.tDepth.value = readBuffer.depthTexture;
		const texture = this.depthTextures[viewId];
		const isTextureArray = texture instanceof ExternalTexture;
		this.occlusionMapUniforms.uIsTextureArray.value = isTextureArray ? 1 : 0;
		this.occlusionMapUniforms.uViewId.value = viewId;
		if (isTextureArray) this.occlusionMapUniforms.uDepthTextureArray.value = texture;
		else this.occlusionMapUniforms.uDepthTexture.value = texture;
		this.getScaledDimensions(renderer, dimensions);
		this.resizeOcclusionMap(dimensions);
		renderer.setRenderTarget(this.occlusionMapTexture);
		this.occlusionMapQuad.render(renderer);
	}
	blurOcclusionMap(renderer, dimensions) {
		this.resizeKawaseBlur(dimensions);
		const scale = this.resolutionScale;
		for (let i = 0; i < 3; i++) {
			this.kawaseBlurQuads[i].material.uniforms.uTexelSize.value.set(scale / (dimensions.x / 2 ** i), scale / (dimensions.y / 2 ** i));
			this.kawaseBlurQuads[this.kawaseBlurQuads.length - 1 - i].material.uniforms.uTexelSize.value.set(scale / (dimensions.x / 2 ** (i - 1)), scale / (dimensions.y / 2 ** (i - 1)));
		}
		renderer.setRenderTarget(this.kawaseBlurTargets[0]);
		this.kawaseBlurQuads[0].render(renderer);
		renderer.setRenderTarget(this.kawaseBlurTargets[1]);
		this.kawaseBlurQuads[1].render(renderer);
		renderer.setRenderTarget(this.kawaseBlurTargets[2]);
		this.kawaseBlurQuads[2].render(renderer);
		renderer.setRenderTarget(this.kawaseBlurTargets[1]);
		this.kawaseBlurQuads[3].render(renderer);
		renderer.setRenderTarget(this.kawaseBlurTargets[0]);
		this.kawaseBlurQuads[4].render(renderer);
		renderer.setRenderTarget(this.occlusionMapTexture);
		this.kawaseBlurQuads[5].render(renderer);
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
			this.occlusionUniforms.tDiffuse.value = readBuffer.texture;
			renderer.setRenderTarget(writeBuffer && !this.renderToScreen ? writeBuffer : null);
			this.occlusionQuad.render(renderer);
		}
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = true;
		const quads = [
			this.occlusionMapQuad,
			...this.kawaseBlurQuads,
			this.occlusionQuad
		];
		const resources = [
			this.occlusionMeshMaterial,
			this.occlusionMapTexture,
			...this.kawaseBlurTargets,
			...quads.flatMap((quad) => [quad.material, quad])
		];
		let firstError;
		for (const resource of resources) try {
			resource.dispose();
		} catch (error) {
			firstError ??= error;
		}
		this.kawaseBlurTargets.length = 0;
		this.kawaseBlurQuads.length = 0;
		this.depthTextures.length = 0;
		this.depthNear.length = 0;
		this.depthViewMatrices.length = 0;
		this.depthProjectionMatrices.length = 0;
		for (const uniforms of [this.occlusionMeshMaterial.uniforms, this.occlusionMapUniforms]) {
			uniforms.uDepthTexture.value = null;
			uniforms.uDepthTextureArray.value = null;
		}
		this.occlusionMapUniforms.tDiffuse.value = null;
		this.occlusionMapUniforms.tDepth.value = null;
		this.occlusionUniforms.tDiffuse.value = null;
		if (firstError !== void 0) throw firstError;
	}
	updateOcclusionMapUniforms(uniforms, renderer) {
		const camera = renderer.xr.getCamera().cameras[0] || this.camera;
		uniforms.tOcclusionMap.value = this.occlusionMapTexture.texture;
		uniforms.uOcclusionClipFromWorld.value.copy(camera.projectionMatrix).multiply(camera.matrixWorldInverse);
	}
};
var OcclusionUtils = class OcclusionUtils {
	static {
		this.pendingMaterials = [];
	}
	/**
	* Registers or clears the WebGPU TSL material occlusion handler.
	* Called internally by `Depth.init()` when `WebGPURenderer` is active.
	*/
	static setWebGPUMaterialHandler(handler) {
		this.webgpuMaterialHandler = handler;
		if (handler && this.pendingMaterials.length > 0) {
			const pending = this.pendingMaterials.splice(0);
			for (const { material, onShaderReady } of pending) {
				const shader = handler(material);
				onShaderReady?.(shader);
			}
		} else if (!handler) this.pendingMaterials.length = 0;
	}
	/**
	* Configures a material for depth occlusion across both `WebGLRenderer` and
	* `WebGPURenderer`, invoking `onShaderReady` with the uniform handle to
	* register in `Depth.occludableShaders`.
	*/
	static addOcclusionToMaterial(material, onShaderReady) {
		material.transparent = true;
		if (this.webgpuMaterialHandler) {
			const shader = this.webgpuMaterialHandler(material);
			onShaderReady?.(shader);
			return;
		}
		this.pendingMaterials.push({
			material,
			onShaderReady
		});
		const previous = material.onBeforeCompile;
		material.onBeforeCompile = (shader, renderer) => {
			previous.call(material, shader, renderer);
			OcclusionUtils.addOcclusionToShader(shader);
			onShaderReady?.(shader);
		};
		material.needsUpdate = true;
	}
	/**
	* Creates a simple material used for rendering objects into the occlusion
	* map. This material is intended to be used with `renderer.overrideMaterial`.
	* @returns A new instance of THREE.MeshBasicMaterial.
	*/
	static createOcclusionMapOverrideMaterial() {
		return new MeshBasicMaterial();
	}
	/**
	* Modifies a material's shader in-place to incorporate distance-based
	* alpha occlusion. This is designed to be used with a material's
	* `onBeforeCompile` property. This only works with built-in three.js
	* materials.
	* @param shader - The shader object provided by onBeforeCompile.
	*/
	static addOcclusionToShader(shader) {
		shader.uniforms.occlusionEnabled = { value: true };
		shader.uniforms.tOcclusionMap = { value: null };
		shader.uniforms.uOcclusionClipFromWorld = { value: new Matrix4() };
		shader.defines = {
			USE_UV: true,
			DISTANCE: true
		};
		shader.vertexShader = shader.vertexShader.replace("#include <common>", [
			"uniform mat4 uOcclusionClipFromWorld;",
			"varying vec4 vOcclusionScreenCoord;",
			"#include <common>"
		].join("\n")).replace("#include <fog_vertex>", ["#include <fog_vertex>", "vOcclusionScreenCoord = uOcclusionClipFromWorld * worldPosition;"].join("\n"));
		shader.fragmentShader = shader.fragmentShader.replace("uniform vec3 diffuse;", [
			"uniform vec3 diffuse;",
			"uniform bool occlusionEnabled;",
			"uniform sampler2D tOcclusionMap;",
			"varying vec4 vOcclusionScreenCoord;"
		].join("\n")).replace("vec4 diffuseColor = vec4( diffuse, opacity );", [
			"vec4 diffuseColor = vec4( diffuse, opacity );",
			"vec2 occlusion_coordinates = 0.5 + 0.5 * vOcclusionScreenCoord.xy / vOcclusionScreenCoord.w;",
			"vec2 occlusion_sample = texture2D(tOcclusionMap, occlusion_coordinates.xy).rg;",
			"occlusion_sample = occlusion_sample / max(0.0001, occlusion_sample.g);",
			"float occlusion_value = clamp(occlusion_sample.r, 0.0, 1.0);",
			"diffuseColor.a *= occlusionEnabled ? occlusion_value : 1.0;"
		].join("\n"));
	}
};
var DEFAULT_DEPTH_WIDTH = 160;
var DEFAULT_DEPTH_HEIGHT = DEFAULT_DEPTH_WIDTH;
var clipSpacePosition = new Vector3();
var normViewCoord = new Vector3();
var Depth = class Depth {
	get rawValueToMeters() {
		if (this.cpuDepthData.length) return this.cpuDepthData[0].rawValueToMeters;
		else if (this.gpuDepthData.length) return this.gpuDepthData[0].rawValueToMeters;
		return 0;
	}
	/**
	* Resolves the buffer and metadata for a query, falling back to view 0 only
	* when the requested view has not produced CPU depth yet.
	*/
	getDepthBuffer(viewId) {
		const resolvedViewId = this.depthArray[viewId] ? viewId : 0;
		const depthData = this.cpuDepthData[resolvedViewId] ?? this.gpuDepthData[resolvedViewId];
		return {
			depthArray: this.depthArray[resolvedViewId],
			width: depthData?.width ?? this.width,
			height: depthData?.height ?? this.height,
			rawValueToMeters: depthData?.rawValueToMeters ?? this.rawValueToMeters
		};
	}
	/**
	* Depth is a lightweight manager based on three.js to simply prototyping
	* with Depth in WebXR.
	*/
	constructor() {
		this.disposed = false;
		this.enabled = false;
		this.view = [];
		this.cpuDepthData = [];
		this.gpuDepthData = [];
		this.depthArray = [];
		this.options = new DepthOptions();
		this.width = DEFAULT_DEPTH_WIDTH;
		this.height = DEFAULT_DEPTH_HEIGHT;
		this.occludableShaders = /* @__PURE__ */ new Set();
		this.depthClientsInitialized = false;
		this.depthClients = /* @__PURE__ */ new Set();
		this.depthProjectionMatrices = [];
		this.depthProjectionInverseMatrices = [];
		this.depthViewMatrices = [];
		this.depthViewProjectionMatrices = [];
		this.depthCameraPositions = [];
		this.depthCameraRotations = [];
		this.normDepthBufferFromNormViewMatrices = [];
		this.lastDepthMeshUpdateTime = 0;
		this.requestedSecondaryViews = false;
		this.requestedDepth = false;
		if (Depth.instance) return Depth.instance;
		Depth.instance = this;
	}
	/**
	* Initialize Depth manager.
	*/
	init(camera, options, renderer, registry, scene) {
		if (this.disposed) throw new Error("Depth cannot initialize after disposal.");
		this.camera = camera;
		this.options = options;
		this.renderer = renderer;
		this.registry = registry;
		this.enabled = options.enabled;
		const isWebGPU = isWebGPURenderer(renderer);
		const isSerializer = isSerializerRenderer(renderer);
		this.gpuDepthConverter = isWebGPU || isSerializer ? void 0 : new GPUDepthConverter(renderer);
		if (this.options.depthTexture.enabled) {
			this.depthTextures = new DepthTextures(options);
			registry.register(this.depthTextures);
		}
		const asyncTasks = [];
		if (this.options.occlusion.enabled) {
			const resolutionScale = this.options.occlusion.resolutionScale ?? .5;
			if (isWebGPU) asyncTasks.push(Promise.all([__vitePreload(() => import("./WebGPUOcclusionPass-BYm5LBjR.js"), __vite__mapDeps([2,3,4,5])), __vitePreload(() => import("./WebGPUOcclusionUtils-DTchqsIi.js"), __vite__mapDeps([6,3,4,5]))]).then(([{ WebGPUOcclusionPass }, { addWebGPUOcclusionToMaterial }]) => {
				if (!this.disposed) {
					OcclusionUtils.setWebGPUMaterialHandler(addWebGPUOcclusionToMaterial);
					const pass = new WebGPUOcclusionPass(scene, camera);
					pass.resolutionScale = resolutionScale;
					this.occlusionPass = pass;
				}
			}));
			else if (!isSerializer) {
				OcclusionUtils.setWebGPUMaterialHandler(void 0);
				const pass = new OcclusionPass(scene, camera);
				pass.resolutionScale = resolutionScale;
				this.occlusionPass = pass;
			}
		}
		if (this.options.depthMesh.enabled) {
			this.depthMesh = new DepthMesh(options, this.width, this.height, this.depthTextures);
			registry.register(this.depthMesh);
			if (this.options.depthMesh.renderShadow && this.renderer.shadowMap) {
				this.renderer.shadowMap.enabled = true;
				this.renderer.shadowMap.type = 1;
			}
			if (isWebGPU && (this.options.depthMesh.useDepthTexture || this.options.depthMesh.showDebugTexture)) asyncTasks.push(__vitePreload(async () => {
				const { applyWebGPUDepthMeshMaterial } = await import("./DepthMeshWebGPUMaterial-B3clYK8i.js");
				return { applyWebGPUDepthMeshMaterial };
			}, __vite__mapDeps([7,3,4,5])).then(({ applyWebGPUDepthMeshMaterial }) => {
				if (!this.disposed && this.depthMesh) {
					applyWebGPUDepthMeshMaterial(this.depthMesh);
					scene.add(this.depthMesh);
				}
			}));
			else scene.add(this.depthMesh);
		}
		if (asyncTasks.length > 0) return Promise.all(asyncTasks).then(() => {});
	}
	/**
	* Converts bottom-origin view UVs into normalized depth buffer coordinates.
	*
	* {@link https://immersive-web.github.io/depth-sensing/#obtain-depth-at-coordinates | The WebXR algorithm}
	* takes top-origin normalized view coordinates, applies
	* `normDepthBufferFromNormView`, then scales the result straight into the
	* buffer. Flipping V after the transform instead samples a different pixel
	* for any transform that does not commute with that flip, and disagrees
	* with {@link DepthMesh}, which flips first.
	* @param u - Normalized horizontal coordinate, origin at bottom left.
	* @param v - Normalized vertical coordinate, origin at bottom left.
	* @param target - Vector that receives the result.
	* @param viewId - View index (default 0).
	* @returns The normalized depth buffer coordinates.
	*/
	normDepthBufferCoords(u, v, target, viewId = 0) {
		target.set(u, 1 - v, 0);
		const matrix = this.normDepthBufferFromNormViewMatrices[viewId] ?? this.normDepthBufferFromNormViewMatrices[0];
		if (matrix) target.applyMatrix4(matrix);
		return target;
	}
	/**
	* Retrieves the depth at normalized coordinates (u, v).
	* Note: The UV coordinates are with respect to the user's view, not the depth camera view.
	* @param u - Normalized horizontal coordinate, origin at the bottom left of
	* the view, growing right.
	* @param v - Normalized vertical coordinate, origin at the bottom left of
	* the view, growing up.
	* @param viewId - View index to query (default 0). Requesting viewId > 0 enables secondary view updates.
	* @returns Depth value at the specified coordinates.
	*/
	getDepth(u, v, viewId = 0) {
		this.requestDepth(viewId);
		const { depthArray, width, height, rawValueToMeters } = this.getDepthBuffer(viewId);
		if (!depthArray) return 0;
		const coords = this.normDepthBufferCoords(u, v, normViewCoord, viewId);
		const depthX = Math.round(clamp$1(coords.x * width, 0, width - 1));
		return rawValueToMeters * depthArray[Math.round(clamp$1(coords.y * height, 0, height - 1)) * width + depthX];
	}
	/**
	* Projects the given world position to depth camera's clip space and then
	* to the depth camera's view space using the depth.
	* @param position - The world position to project.
	* @param target - Optional target vector.
	* @param viewId - View index to query (default 0).
	* @returns The depth camera view space position.
	*/
	getProjectedDepthViewPositionFromWorldPosition(position, target = new Vector3(), viewId = 0) {
		this.requestDepth(viewId);
		const viewMatrix = this.depthViewMatrices[viewId] ?? this.depthViewMatrices[0];
		const projMatrix = this.depthProjectionMatrices[viewId] ?? this.depthProjectionMatrices[0];
		const projInvMatrix = this.depthProjectionInverseMatrices[viewId] ?? this.depthProjectionInverseMatrices[0];
		clipSpacePosition.copy(position).applyMatrix4(viewMatrix).applyMatrix4(projMatrix);
		const u = .5 * (clipSpacePosition.x + 1);
		const v = .5 * (clipSpacePosition.y + 1);
		let depth = 0;
		const { depthArray, width, height, rawValueToMeters } = this.getDepthBuffer(viewId);
		if (depthArray) {
			const depthX = Math.round(clamp$1(u * width, 0, width - 1));
			depth = rawValueToMeters * depthArray[Math.round(clamp$1((1 - v) * height, 0, height - 1)) * width + depthX];
		}
		target.set(2 * (u - .5), 2 * (v - .5), -1);
		target.applyMatrix4(projInvMatrix);
		target.multiplyScalar(-depth / target.z);
		return target;
	}
	/**
	* Retrieves the depth at normalized coordinates (u, v).
	* Note: The UV coordinates are with respect to the user's view, not the depth camera view.
	* @param u - Normalized horizontal coordinate, origin at the bottom left of
	* the view, growing right.
	* @param v - Normalized vertical coordinate, origin at the bottom left of
	* the view, growing up.
	* @param viewId - View index to query (default 0). Requesting viewId > 0 enables secondary view updates.
	* @returns Vertex at (u, v)
	*/
	getVertex(u, v, viewId = 0) {
		this.requestDepth(viewId);
		const { depthArray, width, height, rawValueToMeters } = this.getDepthBuffer(viewId);
		if (!depthArray) return null;
		const coords = this.normDepthBufferCoords(u, v, normViewCoord, viewId);
		const depthX = Math.round(clamp$1(coords.x * width, 0, width - 1));
		const depth = rawValueToMeters * depthArray[Math.round(clamp$1(coords.y * height, 0, height - 1)) * width + depthX];
		const vertexPosition = new Vector3(2 * (coords.x - .5), 2 * (.5 - coords.y), -1);
		const projInvMatrix = this.depthProjectionInverseMatrices[viewId] ?? this.depthProjectionInverseMatrices[0];
		vertexPosition.applyMatrix4(projInvMatrix);
		vertexPosition.multiplyScalar(-depth / vertexPosition.z);
		return vertexPosition;
	}
	updateDepthMatrices(depthData, viewId) {
		while (viewId >= this.depthViewMatrices.length) {
			this.depthViewMatrices.push(new Matrix4());
			this.depthViewProjectionMatrices.push(new Matrix4());
			this.depthProjectionMatrices.push(new Matrix4());
			this.depthProjectionInverseMatrices.push(new Matrix4());
			this.depthCameraPositions.push(new Vector3());
			this.depthCameraRotations.push(new Quaternion());
			this.normDepthBufferFromNormViewMatrices.push(new Matrix4());
		}
		if (depthData.normDepthBufferFromNormView) this.normDepthBufferFromNormViewMatrices[viewId].fromArray(depthData.normDepthBufferFromNormView.matrix);
		else this.normDepthBufferFromNormViewMatrices[viewId].identity();
		if (depthData.projectionMatrix && depthData.transform) {
			this.depthProjectionMatrices[viewId].fromArray(depthData.projectionMatrix);
			this.depthViewMatrices[viewId].fromArray(depthData.transform.inverse.matrix);
			this.depthCameraPositions[viewId].set(depthData.transform.position.x, depthData.transform.position.y, depthData.transform.position.z);
			this.depthCameraRotations[viewId].set(depthData.transform.orientation.x, depthData.transform.orientation.y, depthData.transform.orientation.z, depthData.transform.orientation.w);
		} else {
			const camera = this.renderer.xr?.getCamera()?.cameras?.[viewId] ?? this.camera;
			this.depthProjectionMatrices[viewId].copy(camera.projectionMatrix);
			this.depthViewMatrices[viewId].copy(camera.matrixWorldInverse);
			this.depthCameraPositions[viewId].copy(camera.position);
			this.depthCameraRotations[viewId].copy(camera.quaternion);
		}
		this.depthProjectionInverseMatrices[viewId].copy(this.depthProjectionMatrices[viewId]).invert();
		this.depthViewProjectionMatrices[viewId].multiplyMatrices(this.depthProjectionMatrices[viewId], this.depthViewMatrices[viewId]);
	}
	/** Records demand for CPU depth so GPU depth is read back on the next frame. */
	requestDepth(viewId) {
		this.requestedDepth = true;
		if (viewId > 0) this.requestedSecondaryViews = true;
	}
	updateCPUDepthData(depthData, viewId, depthDataFormat) {
		this.cpuDepthData[viewId] = depthData;
		this.depthDataFormat = depthDataFormat;
		this.updateDepthMatrices(depthData, viewId);
		this.depthArray[viewId] = depthDataFormat === "float32" ? new Float32Array(depthData.data) : new Uint16Array(depthData.data);
		this.width = depthData.width;
		this.height = depthData.height;
		if (this.options.depthTexture.enabled && this.depthTextures) this.depthTextures.updateData(depthData, viewId, depthDataFormat);
		if (this.options.depthMesh.enabled && this.depthMesh && viewId == 0) {
			if (this.shouldUpdateDepthMesh()) this.depthMesh.updateDepth(depthData, this.depthProjectionInverseMatrices[0], depthDataFormat);
			this.depthMesh.updatePose(this.depthCameraPositions[0], this.depthCameraRotations[0]);
		}
	}
	updateGPUDepthData(depthData, viewId) {
		assertWebGLRenderer(this.renderer, "WebXR GPU depth");
		this.gpuDepthData[viewId] = depthData;
		this.updateDepthMatrices(depthData, viewId);
		const cpuDepth = (this.options.depthMesh.enabled || Boolean(this.options.updateAllViews) || this.requestedDepth) && this.shouldUpdateView(viewId) && this.gpuDepthConverter ? this.gpuDepthConverter.convertGPUToCPU(depthData) : null;
		if (cpuDepth) {
			this.cpuDepthData[viewId] = cpuDepth;
			this.depthDataFormat = "float32";
			if (this.depthArray[viewId] instanceof Float32Array && this.depthArray[viewId].byteLength === cpuDepth.data.byteLength) this.depthArray[viewId].set(new Float32Array(cpuDepth.data));
			else this.depthArray[viewId] = new Float32Array(cpuDepth.data);
			this.width = cpuDepth.width;
			this.height = cpuDepth.height;
		}
		if (this.options.depthTexture.enabled && this.depthTextures) this.depthTextures.updateNativeTexture(depthData, this.renderer, viewId);
		if (this.options.depthMesh.enabled && this.depthMesh && viewId == 0) {
			if (this.shouldUpdateDepthMesh()) {
				if (cpuDepth) this.depthMesh.updateDepth(cpuDepth, this.depthProjectionInverseMatrices[0], "float32");
			}
			this.depthMesh.updatePose(this.depthCameraPositions[0], this.depthCameraRotations[0]);
		}
	}
	/**
	* Checks whether the depth mesh geometry should be updated this frame,
	* based on the configured depthMeshUpdateFps. The pose is always updated
	* every frame so the mesh tracks the depth camera smoothly, but the
	* expensive geometry rebuild can be throttled.
	*/
	shouldUpdateDepthMesh() {
		const fps = this.options.depthMesh.depthMeshUpdateFps;
		if (fps <= 0) return true;
		const now = performance.now();
		if (now - this.lastDepthMeshUpdateTime < 1e3 / fps) return false;
		this.lastDepthMeshUpdateTime = now;
		return true;
	}
	/**
	* Returns whether CPU depth data and textures should be extracted for the
	* given view index. By default only view 0 is processed since DepthMesh and
	* OcclusionPass only consume view 0, unless `options.updateAllViews`,
	* `options.matchDepthView`, or a runtime `viewId > 0` request is active.
	*/
	shouldUpdateView(viewId) {
		return viewId === 0 || Boolean(this.options.updateAllViews) || Boolean(this.options.matchDepthView) || this.requestedSecondaryViews;
	}
	getTexture(viewId) {
		if (!this.options.depthTexture.enabled) return void 0;
		if (viewId > 0) this.requestedSecondaryViews = true;
		return this.depthTextures?.get(viewId) ?? this.depthTextures?.get(0);
	}
	/**
	* Updates the shadow opacity on the depth mesh material when active.
	*/
	setShadowOpacity(opacity) {
		if (this.options.enabled && this.options.depthMesh.enabled && this.depthMesh?.material instanceof ShadowMaterial) this.depthMesh.material.opacity = opacity;
	}
	update(frame) {
		if (this.disposed || !this.options.enabled) return;
		if (frame) this.updateLocalDepth(frame);
		if (this.options.occlusion.enabled) this.renderOcclusionPass();
	}
	updateLocalDepth(frame) {
		const session = frame.session;
		const binding = this.renderer.xr.getBinding?.() ?? null;
		if (session.depthActive !== void 0 && this.depthClientsInitialized) {
			const needsDepth = this.depthClients.size > 0;
			if (session.depthActive && !needsDepth) session.pauseDepthSensing?.();
			else if (!session.depthActive && needsDepth) session.resumeDepthSensing?.();
			if (this.depthClients.size === 0) return;
		}
		const xrRefSpace = this.renderer.xr.getReferenceSpace?.() ?? null;
		if (xrRefSpace) {
			const pose = frame.getViewerPose(xrRefSpace);
			if (pose) for (let viewId = 0; viewId < pose.views.length; ++viewId) {
				const view = pose.views[viewId];
				this.view[viewId] = view;
				if (session.depthUsage === "gpu-optimized") {
					const depthData = binding?.getDepthInformation(view);
					if (!depthData) return;
					this.updateGPUDepthData(depthData, viewId);
				} else if (this.shouldUpdateView(viewId)) {
					const depthData = frame.getDepthInformation(view);
					if (!depthData) return;
					this.updateCPUDepthData(depthData, viewId, session.depthDataFormat ?? "luminance-alpha");
				}
			}
			else console.error("Pose unavailable in the current frame.");
		}
	}
	renderOcclusionPass() {
		if (!this.occlusionPass || isSerializerRenderer(this.renderer)) return;
		const leftDepthTexture = this.getTexture(0);
		if (leftDepthTexture) this.occlusionPass.setDepthTexture(leftDepthTexture, this.rawValueToMeters, 0, this.gpuDepthData[0]?.depthNear, this.depthViewMatrices[0], this.depthProjectionMatrices[0]);
		const currentXREnabled = this.renderer.xr.enabled;
		this.renderer.xr.enabled = false;
		this.occlusionPass.render(this.renderer, void 0, void 0, 0);
		this.renderer.xr.enabled = currentXREnabled;
		for (const shader of this.occludableShaders) this.occlusionPass.updateOcclusionMapUniforms(shader.uniforms, this.renderer);
	}
	debugLog() {
		const arrayBuffer = this.cpuDepthData[0].data;
		const uint8Array = new Uint8Array(arrayBuffer);
		const binaryString = Array.from(uint8Array, (byte) => String.fromCharCode(byte)).join("");
		const data_str = btoa(binaryString);
		console.log(data_str);
	}
	resumeDepth(client) {
		this.depthClientsInitialized = true;
		this.depthClients.add(client);
	}
	pauseDepth(client) {
		this.depthClientsInitialized = true;
		this.depthClients.delete(client);
	}
	/**
	* Manually updates the depth mesh geometry using the cached depth.
	*/
	updateFullResolutionDepthMesh() {
		if (this.depthMesh && this.cpuDepthData.length > 0 && this.depthDataFormat) this.depthMesh.updateFullResolutionGeometry(this.cpuDepthData[0], this.depthDataFormat);
	}
	/** Releases depth resources at terminal Core teardown, not on XR exit. */
	dispose() {
		if (this.disposed) return;
		this.disposed = true;
		this.enabled = false;
		if (Depth.instance === this) Depth.instance = void 0;
		const mesh = this.depthMesh;
		const textures = this.depthTextures;
		const pass = this.occlusionPass;
		this.depthMesh = void 0;
		this.depthTextures = void 0;
		this.occlusionPass = void 0;
		let firstError;
		const cleanups = [
			() => this.gpuDepthConverter?.dispose(),
			() => {
				if (mesh && this.registry?.get(DepthMesh) === mesh) this.registry.unregister(DepthMesh);
			},
			() => mesh?.removeFromParent(),
			() => mesh?.disposeResources(),
			() => {
				if (textures && this.registry?.get(DepthTextures) === textures) this.registry.unregister(DepthTextures);
			},
			() => textures?.dispose(),
			() => pass?.dispose()
		];
		for (const cleanup of cleanups) try {
			cleanup();
		} catch (error) {
			firstError ??= error;
		}
		this.gpuDepthConverter = void 0;
		this.registry = void 0;
		this.requestedSecondaryViews = false;
		this.requestedDepth = false;
		this.view.length = 0;
		this.cpuDepthData.length = 0;
		this.gpuDepthData.length = 0;
		this.depthArray.length = 0;
		this.depthDataFormat = void 0;
		this.depthProjectionMatrices.length = 0;
		this.depthProjectionInverseMatrices.length = 0;
		this.depthViewMatrices.length = 0;
		this.depthViewProjectionMatrices.length = 0;
		this.depthCameraPositions.length = 0;
		this.depthCameraRotations.length = 0;
		this.normDepthBufferFromNormViewMatrices.length = 0;
		this.depthClients.clear();
		this.occludableShaders.clear();
		OcclusionUtils.setWebGPUMaterialHandler(void 0);
		if (firstError !== void 0) throw firstError;
	}
};
/**
* Shader for the Reticle UI component.
*
* This shader renders a dynamic, anti-aliased circle that provides visual
* feedback for user interaction. It can smoothly transition between a hollow
* ring (idle/hover state) and a solid, shrinking circle (pressed state).
* The anti-aliasing is achieved using screen-space derivatives (fwidth) to
* ensure crisp edges at any resolution or distance.
*/
var ReticleShader = {
	name: "ReticleShader",
	uniforms: {
		uColor: { value: new Color().setHex(16777215) },
		uPressed: { value: 0 }
	},
	vertexShader: `
  varying vec2 vTexCoord;

  void main() {
    vTexCoord = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    // Makes the position slightly closer to avoid z fighting.
    gl_Position.z -= 0.1;
  }
`,
	fragmentShader: `
  precision mediump float;

  uniform sampler2D uDepthTexture;
  uniform vec3 uColor;
  uniform float uPressed;

  varying vec2 vTexCoord;

  void main(void) {
    // Distance from center of quad.
    highp float dist = distance(vTexCoord, vec2(0.5f, 0.5f));
    if (dist > 0.45) discard;

    // Get the rate of change of dist on x and y.
    highp vec2 dist_grad = vec2(dFdx(dist), dFdy(dist));
    highp float grad_magnitude = length(dist_grad);
    highp float antialias_dist = max(grad_magnitude, 0.001f);

    // Outer radius is 0.5, but we want to bring it in a few pixels so we have room
    // for a gradient outward to anti-alias the circle.
    // These "few pixels" are determined by our derivative calculation above.
    highp float outerradius = 0.5f - antialias_dist;
    highp float delta_to_outer = dist - outerradius;
    highp float clamped_outer_delta = clamp(delta_to_outer, 0.0f, antialias_dist);
    highp float outer_alpha = 1.0f - (clamped_outer_delta / antialias_dist);

    // #FFFFFF = (1,1,1)
    // #FFFFFF with 0.5 alpha = (((1,1,1) * 0.5), 0.5)
    vec4 inner_base_color = vec4(0.5 * uColor, 0.5);
    vec4 pressed_inner_color = vec4(uColor, 1.0);
    // #505050 = (0.077,0.077,0.077)
    // #505050 with 0.7 alpha = (((0.077,0.077,0.077)*0.7), 0.7)
    const vec4 inner_gradient_color = vec4(0.054, 0.054, 0.054, 1.0);
    const vec4 outer_ring_color = vec4(0.077, 0.077, 0.077, 1.0);
    // 0.5 - stoke_width (0.75dp = 0.04 approx)
    const float gradient_end = 0.46;
    // 73% of gradient_end
    const float gradient_start = 0.33;
    // gradient_end - 130% stoke_width. Additional 30% to account for the down scaling.
    const float pressed_inner_radius = 0.41;

    vec4 unpressed_inner_color =
            mix(inner_base_color, inner_gradient_color,
                    smoothstep(gradient_start, gradient_end, dist));
    vec4 unpressed_color =
            mix(unpressed_inner_color, outer_ring_color,
                    step(gradient_end, dist));

    // Builds a smooth gradient to fade between colors.
    highp float smooth_distance = antialias_dist * 4.0;
    float percent_to_inner_rad = max(pressed_inner_radius - dist, 0.0) / pressed_inner_radius;
    highp float pressed_color_t = 1.0 - percent_to_inner_rad;
    pressed_color_t -= (1.0 - smooth_distance);
    pressed_color_t *= (1.0 / smooth_distance);
    pressed_color_t = clamp(pressed_color_t, 0.0, 1.0);
    vec4 pressed_color = mix(pressed_inner_color, outer_ring_color, pressed_color_t);

    vec4 final_color = mix(unpressed_color, pressed_color, uPressed);
    gl_FragColor = final_color * outer_alpha;
    // Converts to straight alpha.
    gl_FragColor.rgb = gl_FragColor.rgb / max(gl_FragColor.a, 0.001);
  }
`
};
var HOVER_RING_BRIGHTNESS = .4;
var HOVER_RING_OPACITY = .7;
var RETICLE_RENDER_ORDER = 2e9;
/**
* A 3D visual marker used to indicate a user's aim or interaction
* point in an XR scene. It orients itself to surfaces it intersects with and
* provides visual feedback for states like "pressed".
*/
var Reticle = class extends Mesh {
	/**
	* Creates an instance of Reticle.
	* @param innerRadius - Inner radius of the reticle ring geometry.
	* @param outerRadius - Outer radius of the reticle ring geometry.
	* @param depthTest - Determines if the reticle should be occluded by other
	* objects. Defaults to `false` to ensure it is always visible.
	*/
	constructor(innerRadius = 0, outerRadius = .019, depthTest = false) {
		const uniforms = {
			uColor: { value: new Color(16777215) },
			uPressed: { value: 0 }
		};
		super(new RingGeometry(innerRadius, outerRadius, 32), new ShaderMaterial({
			uniforms,
			vertexShader: ReticleShader.vertexShader,
			fragmentShader: ReticleShader.fragmentShader,
			transparent: true,
			depthTest,
			depthWrite: false
		}));
		this.name = "Reticle";
		this.editorIcon = "target";
		this.direction = new Vector3();
		this.renderOrder = RETICLE_RENDER_ORDER;
		this.originalNormal = new Vector3(0, 0, 1);
		this.newRotation = new Quaternion();
		this.objectRotation = new Quaternion();
		this.normalVector = new Vector3();
		this.uniforms = uniforms;
		this.depthTestEnabled = depthTest;
		this.rotationSmoothing = .8;
		this.offset = .001;
		this.hoverRing = new Mesh(new RingGeometry(outerRadius, outerRadius * 1.15, 32), new MeshBasicMaterial({
			color: getHoverRingColor(this.getColor()),
			depthTest,
			depthWrite: false,
			transparent: true,
			opacity: HOVER_RING_OPACITY
		}));
		this.hoverRing.position.z = this.offset;
		this.hoverRing.renderOrder = this.renderOrder;
		this.hoverRing.visible = false;
		this.hoverRing.raycast = () => {};
		this.add(this.hoverRing);
	}
	/**
	* Replaces the reticle's primary material (e.g. with a WebGPU NodeMaterial)
	* and registers a callback to synchronize uniform changes.
	*/
	setCustomMaterial(material, syncUniforms) {
		this.material.dispose();
		this.material = material;
		this.syncUniforms = syncUniforms;
		this.syncUniforms?.();
	}
	/**
	* Orients the reticle to be flush with a surface, based on the surface
	* normal. It smoothly interpolates the rotation for a polished visual effect.
	* @param normal - The world-space normal of the surface.
	*/
	setRotationFromNormalVector(normal) {
		this.normalVector.copy(normal).normalize();
		this.newRotation.setFromUnitVectors(this.originalNormal, this.normalVector);
		this.quaternion.slerp(this.newRotation, 1 - this.rotationSmoothing);
	}
	/**
	* Updates the reticle's complete pose (position and rotation) from a
	* raycaster intersection object.
	* @param intersection - The intersection data from a raycast.
	*/
	setPoseFromIntersection(intersection) {
		if (!intersection || !intersection.normal) return;
		this.intersection = intersection;
		this.position.copy(intersection.point);
		intersection.object.getWorldQuaternion(this.objectRotation);
		this.normalVector.copy(intersection.normal).applyQuaternion(this.objectRotation);
		this.setRotationFromNormalVector(this.normalVector);
	}
	/**
	* Sets the color of the reticle via its shader uniform.
	* @param color - The color to apply.
	*/
	setColor(color) {
		this.uniforms.uColor.value.set(color);
		this.hoverRing.material.color.copy(getHoverRingColor(this.uniforms.uColor.value));
		this.syncUniforms?.();
	}
	/**
	* Gets the current color of the reticle.
	* @returns The current color from the shader uniform.
	*/
	getColor() {
		return this.uniforms.uColor.value;
	}
	/**
	* Sets the visual state of the reticle to "pressed" or "unpressed".
	* This provides visual feedback to the user during interaction.
	* @param pressed - True to show the pressed state, false otherwise.
	*/
	setPressed(pressed) {
		this.uniforms.uPressed.value = pressed ? 1 : 0;
		this.syncUniforms?.();
		this.scale.setScalar(pressed ? .7 : 1);
	}
	/**
	* Sets the pressed state as a continuous value for smooth animations.
	* @param pressedAmount - A value from 0.0 (unpressed) to 1.0 (fully
	* pressed).
	*/
	setPressedAmount(pressedAmount) {
		this.uniforms.uPressed.value = pressedAmount;
		this.syncUniforms?.();
		this.scale.setScalar(lerp(1, .7, pressedAmount));
	}
	/**
	* Shows a ring around the reticle while it hovers over an interactable
	* object.
	*/
	setHovering(hovering) {
		this.hoverRing.visible = hovering;
	}
	/** Releases the GPU resources owned by this Reticle. */
	dispose() {
		this.removeFromParent();
		this.geometry.dispose();
		this.material.dispose();
		this.hoverRing.geometry.dispose();
		this.hoverRing.material.dispose();
		this.intersection = void 0;
		this.targetObject = void 0;
		super.dispose();
	}
	/**
	* Overrides the default raycast method to make the reticle ignored by
	* raycasters.
	*/
	raycast() {}
};
function getHoverRingColor(color) {
	return color.clone().multiplyScalar(HOVER_RING_BRIGHTNESS);
}
var ControllerRayVisual = class extends Line {
	constructor() {
		const geometry = new BufferGeometry().setFromPoints([new Vector3(0, 0, 0), new Vector3(0, 0, -1)]);
		super(geometry);
		this.scale.z = 5;
	}
	raycast() {}
};
var STORAGE_KEY = "xrblocks:simulator:gamepad-bindings:v1";
var DEFAULT_BINDINGS = {
	select: 0,
	cycleHandPoseLeft: 14,
	cycleHandPoseRight: 15,
	cycleSimulatorMode: 3,
	toggleUI: 5,
	toggleHand: 4,
	moveUp: 6,
	moveDown: 7,
	openSettings: 9
};
/**
* Manages gamepad button-to-action mappings with localStorage persistence.
* One button per action — assigning a button removes it from any previous action.
*/
var GamepadBindings = class {
	constructor() {
		this.bindings = { ...DEFAULT_BINDINGS };
		this.load();
	}
	getBinding(action) {
		return this.bindings[action];
	}
	getAllBindings() {
		return { ...this.bindings };
	}
	setBinding(action, buttonIndex) {
		if (action === "openSettings") return;
		if (buttonIndex === this.bindings.openSettings) return;
		for (const key of Object.keys(this.bindings)) if (key !== action && key !== "openSettings" && this.bindings[key] === buttonIndex) this.bindings[key] = -1;
		this.bindings[action] = buttonIndex;
		this.save();
	}
	resetDefaults() {
		this.bindings = { ...DEFAULT_BINDINGS };
		this.save();
	}
	load() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return;
			const parsed = JSON.parse(raw);
			if (parsed?.version !== 1 || typeof parsed.bindings !== "object") return;
			for (const key of Object.keys(DEFAULT_BINDINGS)) if (typeof parsed.bindings[key] === "number") this.bindings[key] = parsed.bindings[key];
		} catch {}
	}
	save() {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({
				version: 1,
				bindings: this.bindings
			}));
		} catch {}
	}
};
var DEADZONE = .15;
/**
* Simulates an XR controller using a connected gamepad (Xbox/PS).
* The controller ray always points forward from the camera center,
* similar to GazeController but with button-driven selection.
*/
var GamepadController = class GamepadController extends Script {
	static {
		this.dependencies = { camera: Camera };
	}
	constructor() {
		super();
		this.type = "GamepadController";
		this.name = "Gamepad Controller";
		this.userData = {
			id: 4,
			connected: false,
			selected: false
		};
		this.bindings = new GamepadBindings();
		this.hasShownToast = false;
		this.menuActive = false;
		this._prevButtons = [];
		this._risingEdges = [];
		this._captureCallback = null;
	}
	init({ camera }) {
		this.camera = camera;
	}
	/**
	* Enters capture mode — the next button press will invoke the callback
	* instead of triggering normal actions, then exit capture mode.
	*/
	captureNextButtonPress(callback) {
		this._captureCallback = callback;
	}
	cancelCapture() {
		this._captureCallback = null;
	}
	get captureActive() {
		return this._captureCallback !== null;
	}
	updatePose() {
		if (this.camera) {
			this.position.copy(this.camera.position);
			this.quaternion.copy(this.camera.quaternion);
			this.updateMatrixWorld();
		}
	}
	update() {
		super.update();
		const gp = this._pollGamepad();
		if (gp && !this.userData.connected) {
			this.activeGamepad = gp;
			this.gamepad = gp;
			this.dispatchEvent({
				type: "connected",
				target: this
			});
		} else if (!gp && this.userData.connected) {
			this._onDisconnect();
			return;
		}
		if (!gp || !this.userData.connected) return;
		this.activeGamepad = gp;
		for (let i = 0; i < gp.buttons.length; i++) {
			const down = gp.buttons[i]?.pressed ?? false;
			const wasDown = this._prevButtons[i] ?? false;
			this._risingEdges[i] = down && !wasDown;
		}
		this.updatePose();
		if (this._captureCallback) {
			for (let i = 0; i < gp.buttons.length; i++) if (this._risingEdges[i]) {
				const cb = this._captureCallback;
				this._captureCallback = null;
				cb(i);
				this._updatePrevButtons(gp);
				return;
			}
		}
		if (!this.menuActive) {
			const selectBtn = this.bindings.getBinding("select");
			const selectDown = gp.buttons[selectBtn]?.pressed ?? false;
			const selectWas = this._prevButtons[selectBtn] ?? false;
			if (selectDown && !selectWas) this.callSelectStart();
			if (!selectDown && selectWas) this.callSelectEnd();
		}
		this._updatePrevButtons(gp);
	}
	callSelectStart() {
		this.dispatchEvent({
			type: "selectstart",
			target: this
		});
	}
	callSelectEnd() {
		this.dispatchEvent({
			type: "selectend",
			target: this
		});
	}
	connect() {
		this.dispatchEvent({
			type: "connected",
			target: this
		});
	}
	disconnect() {
		this.dispatchEvent({
			type: "disconnected",
			target: this
		});
	}
	/**
	* Returns the axes of the active gamepad with deadzone applied.
	* [leftX, leftY, rightX, rightY]
	*/
	getAxes() {
		const gp = this.activeGamepad;
		if (!gp) return [
			0,
			0,
			0,
			0
		];
		return [
			GamepadController.applyDeadzone(gp.axes[0] ?? 0),
			GamepadController.applyDeadzone(gp.axes[1] ?? 0),
			GamepadController.applyDeadzone(gp.axes[2] ?? 0),
			GamepadController.applyDeadzone(gp.axes[3] ?? 0)
		];
	}
	static applyDeadzone(value) {
		if (!Number.isFinite(value)) return 0;
		if (Math.abs(value) < DEADZONE) return 0;
		return Math.sign(value) * ((Math.abs(value) - DEADZONE) / .85);
	}
	/**
	* Returns the analog value (0..1) of the given button index, or 0 if
	* unbound or no gamepad. Useful for triggers (which expose .value).
	*/
	getButtonValue(index) {
		if (index < 0) return 0;
		return this.activeGamepad?.buttons[index]?.value ?? 0;
	}
	/**
	* Returns the analog values of the left and right triggers (LT, RT) on a
	* standard-mapped gamepad, in [0, 1]. Returns [0, 0] when no gamepad.
	*/
	getTriggers() {
		const gp = this.activeGamepad;
		if (!gp) return [0, 0];
		return [gp.buttons[6]?.value ?? 0, gp.buttons[7]?.value ?? 0];
	}
	/**
	* Returns true if the given button index had a rising edge this frame.
	* Safe to call from any update order — uses pre-computed edges.
	*/
	isButtonJustPressed(buttonIndex) {
		return this._risingEdges[buttonIndex] ?? false;
	}
	_updatePrevButtons(gp) {
		for (let i = 0; i < gp.buttons.length; i++) this._prevButtons[i] = gp.buttons[i]?.pressed ?? false;
	}
	_pollGamepad() {
		const gamepads = navigator.getGamepads?.();
		if (!gamepads) return null;
		for (const pad of gamepads) if (pad && pad.connected && pad.mapping === "standard") return pad;
		return null;
	}
	_onDisconnect() {
		if (this.userData.selected) this.callSelectEnd();
		this._prevButtons = [];
		this._captureCallback = null;
		this.activeGamepad = null;
		this.dispatchEvent({
			type: "disconnected",
			target: this
		});
	}
};
/**
* Supplies a camera-aligned gaze ray for XR interactions. Interaction owns
* target resolution and dwell selection.
* WebXR Eye Tracking is not yet available. This API simulates a reticle
* at the center of the field of view for simulating gaze-based interaction.
*/
var GazeController = class extends Script {
	constructor(..._args) {
		super(..._args);
		this.userData = {
			connected: false,
			id: 2,
			selected: false
		};
		this.reticle = new Reticle();
	}
	static {
		this.dependencies = { camera: Camera };
	}
	init({ camera }) {
		this.camera = camera;
	}
	/**
	* Syncs the controller with the camera before Input samples its ray.
	*/
	updatePose() {
		this.position.copy(this.camera.position);
		this.quaternion.copy(this.camera.quaternion);
		this.updateMatrixWorld();
	}
	/**
	* Connects the gaze controller to the input system.
	*/
	connect() {
		this.dispatchEvent({
			type: "connected",
			target: this
		});
	}
	/**
	* Disconnects the gaze controller from the input system.
	*/
	disconnect() {
		this.dispatchEvent({
			type: "disconnected",
			target: this
		});
	}
};
var HeadGestureRecognition = class extends Script {
	constructor(..._args) {
		super(..._args);
		this.samples = [];
		this.latchedGestures = /* @__PURE__ */ new Set();
		this.lastEvaluation = -Infinity;
		this.latestTimestamp = -Infinity;
		this.pendingRecognition = false;
		this.generation = 0;
	}
	static {
		this.dependencies = {
			camera: Camera,
			options: HeadGestureRecognitionOptions
		};
	}
	async init({ camera, options }) {
		this.camera = camera;
		this.options = options;
		await this.options.gestureRecognizer.init?.();
	}
	update(time = performance.now()) {
		if (!this.options.enabled) return;
		const timestamp = Number.isFinite(time) ? time : performance.now();
		this.latestTimestamp = timestamp;
		const sample = this.captureSample(timestamp);
		const previous = this.samples.at(-1);
		if (previous && this.isDiscontinuity(previous, sample)) this.resetRecognitionState();
		this.samples.push(sample);
		this.pruneSamples(timestamp);
		if (timestamp - (this.samples[0]?.timestamp ?? timestamp) < this.options.warmupDurationMs) return;
		if (timestamp - this.lastEvaluation < this.options.updateIntervalMs || this.pendingRecognition) return;
		this.lastEvaluation = timestamp;
		this.evaluate({ samples: this.samples.slice() }, timestamp);
	}
	captureSample(timestamp) {
		return {
			timestamp,
			position: this.camera.getWorldPosition(new Vector3()),
			orientation: this.camera.getWorldQuaternion(new Quaternion())
		};
	}
	isDiscontinuity(previous, next) {
		return next.timestamp - previous.timestamp > this.options.maximumSampleGapMs || previous.orientation.angleTo(next.orientation) > this.options.maximumSampleAngleRadians;
	}
	pruneSamples(timestamp) {
		const oldestTimestamp = timestamp - this.options.historyDurationMs;
		let firstRetained = 0;
		while (firstRetained < this.samples.length && this.samples[firstRetained].timestamp < oldestTimestamp) firstRetained++;
		if (firstRetained > 0) this.samples.splice(0, firstRetained);
	}
	evaluate(context, requestedAt) {
		const generation = this.generation;
		let result;
		try {
			result = this.options.gestureRecognizer.recognize(context);
		} catch (error) {
			console.error("HeadGestureRecognition recognizer failed:", error);
			return;
		}
		if (result instanceof Promise) {
			this.pendingRecognition = true;
			result.then((scores) => {
				if (generation === this.generation && this.latestTimestamp - requestedAt <= this.options.historyDurationMs) this.emitFromScores(scores);
			}).catch((error) => {
				console.error("HeadGestureRecognition recognizer failed:", error);
			}).finally(() => {
				if (generation === this.generation) this.pendingRecognition = false;
			});
			return;
		}
		this.emitFromScores(result);
	}
	emitFromScores(scores) {
		for (const [name, config] of Object.entries(this.options.gestures)) {
			if (!config.enabled) {
				this.latchedGestures.delete(name);
				continue;
			}
			const result = scores[name];
			const confidence = MathUtils.clamp(result?.confidence ?? 0, 0, 1);
			if (this.latchedGestures.has(name)) {
				if (confidence <= this.options.releaseConfidence) this.latchedGestures.delete(name);
				continue;
			}
			if (result && confidence >= this.options.minimumConfidence) {
				this.latchedGestures.add(name);
				this.emitGesture({
					name,
					confidence,
					data: result.data
				});
			}
		}
	}
	emitGesture(detail) {
		this.dispatchEvent({
			type: "gesture",
			detail,
			target: this
		});
	}
	resetRecognitionState() {
		this.samples.length = 0;
		this.latchedGestures.clear();
		this.lastEvaluation = -Infinity;
		this.generation++;
		this.pendingRecognition = false;
	}
	dispose() {
		this.resetRecognitionState();
		this.options.gestureRecognizer.dispose?.();
	}
};
/**
* Simulates an XR controller using the mouse for desktop
* environments. This class translates 2D mouse movements on the screen into a
* 3D ray in the scene, allowing for point-and-click interactions in a
* non-immersive context. It functions as a virtual controller that is always
* aligned with the user's pointer.
*/
var MouseController = class extends Script {
	static {
		this.dependencies = { camera: Camera };
	}
	constructor() {
		super();
		this.type = "MouseController";
		this.name = "Mouse Controller";
		this.editorIcon = "mouse";
		this.userData = {
			id: 3,
			connected: false,
			selected: false
		};
		this.raycaster = new Raycaster();
		this.forwardVector = new Vector3(0, 0, -1);
		this.lastNormalizedMouse = new Vector2(0, 0);
	}
	/**
	* Initialize the MouseController
	*/
	init({ camera }) {
		this.camera = camera;
	}
	/** Updates the mouse position/rotation using camera state. */
	updatePose() {
		if (this.camera === void 0) return;
		this.position.copy(this.camera.position);
		this.raycaster.setFromCamera(this.lastNormalizedMouse, this.camera);
		const rayDirection = this.raycaster.ray.direction;
		this.quaternion.setFromUnitVectors(this.forwardVector, rayDirection);
		this.updateMatrixWorld();
	}
	/**
	* The main update loop, called every frame.
	* If connected, it syncs the controller's origin point with the camera's
	* position.
	*/
	update() {
		super.update();
		if (!this.userData.connected) return;
		this.updatePose();
	}
	/**
	* Updates the controller's transform based on the mouse's position on the
	* screen. This method sets both the position and rotation, ensuring the
	* object has a valid world matrix for raycasting.
	* @param event - The mouse event containing clientX and clientY coordinates.
	*/
	updateMousePositionFromEvent(event) {
		if (this.camera === void 0) return;
		this.lastNormalizedMouse.x = event.clientX / window.innerWidth * 2 - 1;
		this.lastNormalizedMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
		this.updatePose();
	}
	/**
	* Dispatches a 'selectstart' event, simulating the start of a controller
	* press (e.g., mouse down).
	*/
	callSelectStart() {
		this.dispatchEvent({
			type: "selectstart",
			target: this
		});
	}
	/**
	* Dispatches a 'selectend' event, simulating the end of a controller press
	* (e.g., mouse up).
	*/
	callSelectEnd() {
		this.dispatchEvent({
			type: "selectend",
			target: this
		});
	}
	/**
	* "Connects" the virtual controller, notifying the input system that it is
	* active.
	*/
	connect() {
		this.dispatchEvent({
			type: "connected",
			target: this
		});
	}
	/**
	* "Disconnects" the virtual controller.
	*/
	disconnect() {
		this.dispatchEvent({
			type: "disconnected",
			target: this
		});
	}
};
var PinchFilter = class {
	constructor(handleEventFn) {
		this.handleEventFn = handleEventFn;
		this.forwardingListeners = /* @__PURE__ */ new Map();
	}
	getOrCreateForwardingListener(type) {
		let listener = this.forwardingListeners.get(type);
		if (!listener) {
			listener = (event) => {
				this.handleEventFn(event);
			};
			this.forwardingListeners.set(type, listener);
		}
		return listener;
	}
	setupController(controller, activeEventTypes) {
		for (const type of activeEventTypes) {
			const forwarder = this.getOrCreateForwardingListener(type);
			controller.addEventListener(type, forwarder);
		}
	}
	setupControllerForType(controller, type) {
		const forwarder = this.getOrCreateForwardingListener(type);
		controller.addEventListener(type, forwarder);
	}
	removeControllerForType(controller, type) {
		const forwarder = this.forwardingListeners.get(type);
		if (forwarder) controller.removeEventListener(type, forwarder);
	}
	dispose(controllers) {
		for (const [type, forwarder] of this.forwardingListeners.entries()) for (const controller of controllers) controller.removeEventListener(type, forwarder);
		this.forwardingListeners.clear();
	}
	isHandInputSource(controller) {
		const inputSource = controller.inputSource;
		return inputSource?.targetRayMode === "tracked-pointer" && (inputSource.hand != null || inputSource.profiles?.includes("generic-hand-select") === true);
	}
	shouldFilterEvent(event) {
		const controller = event.target;
		if (event.type === "selectstart" || event.type === "selectend" || event.type === "select") {
			if (controller.gamepad?.buttons[0] !== void 0 && this.isHandInputSource(controller) && !event.isCustom) return true;
		}
		return false;
	}
	updateController(controller) {
		if (controller.gamepad && controller.gamepad.buttons[0] !== void 0 && this.isHandInputSource(controller)) {
			const isPinching = controller.gamepad.buttons[0].value >= 1;
			const wasPinching = controller.userData.selected === true;
			if (isPinching && !wasPinching) {
				controller.userData.selected = true;
				this.handleEventFn({
					type: "selectstart",
					target: controller,
					data: controller.inputSource,
					isCustom: true
				});
			} else if (!isPinching && wasPinching) {
				controller.userData.selected = false;
				this.handleEventFn({
					type: "select",
					target: controller,
					data: controller.inputSource,
					isCustom: true
				});
				this.handleEventFn({
					type: "selectend",
					target: controller,
					data: controller.inputSource,
					isCustom: true
				});
			}
		}
	}
};
var ActiveControllers = class extends Group {
	constructor(..._args) {
		super(..._args);
		this.type = "ActiveControllers";
		this.name = "Active Controllers";
	}
};
var Reticles = class extends Group {
	constructor(..._args2) {
		super(..._args2);
		this.type = "Reticles";
		this.name = "Reticles";
	}
};
/**
* Holds physical input sources and samples their current state each frame.
*/
var Input = class {
	constructor() {
		this.controllers = [];
		this.controllerGrips = [];
		this.hands = [];
		this.pivotsEnabled = false;
		this.gazeController = new GazeController();
		this.mouseController = new MouseController();
		this.gamepadController = new GamepadController();
		this.builtInControllers = /* @__PURE__ */ new Set([
			this.gazeController,
			this.mouseController,
			this.gamepadController
		]);
		this.addonControllers = /* @__PURE__ */ new Set();
		this.removingControllers = /* @__PURE__ */ new Map();
		this.nextControllerId = 0;
		this.controllersEnabled = true;
		this.listeners = /* @__PURE__ */ new Map();
		this.dispatchControllerEvent = (event) => this.dispatchEvent(event);
		this.pinchFilter = new PinchFilter(this.dispatchControllerEvent);
		this.releasedControllers = /* @__PURE__ */ new Set();
		this.nativeSelectControllers = /* @__PURE__ */ new Set();
		this.disconnectedTransientPointerControllers = /* @__PURE__ */ new Map();
		this.keyDownListeners = /* @__PURE__ */ new Set();
		this.keyUpListeners = /* @__PURE__ */ new Set();
		this.activeControllers = new ActiveControllers();
		this.reticles = new Reticles();
		this.ownedReticles = new Set(this.gazeController.reticle ? [this.gazeController.reticle] : []);
		this.raySourceInputs = [];
		this.raySourceSlots = /* @__PURE__ */ new Map();
		this.directTouchInputs = [];
		this.directTouchSlots = [];
		this.interactionFrame = {
			raySources: this.raySourceInputs,
			directTouches: this.directTouchInputs
		};
		this.captureNativeSelectEvent = (event) => {
			if (event.type === "selectstart") this.nativeSelectControllers.delete(event.target);
			else if (event.type === "select" && !event.isCustom) this.nativeSelectControllers.add(event.target);
		};
	}
	/**
	* Initializes physical input sources. Only called by Core.
	*/
	init({ systemsGroup, options, renderer }) {
		systemsGroup.add(this.activeControllers, this.reticles);
		this.controllersEnabled = options.controllers.enabled;
		this.options = options;
		if (options.headGestures.enabled) {
			this.headGestures = new HeadGestureRecognition();
			systemsGroup.add(this.headGestures);
		}
		if (!options.controllers.enabled) return;
		const controllers = this.controllers;
		const controllerGrips = this.controllerGrips;
		for (let i = 0; i < 2; ++i) {
			controllers.push(renderer.xr.getController(i));
			controllers[i].userData.id = i;
			this.builtInControllers.add(controllers[i]);
			this.activeControllers.add(this.controllers[i]);
		}
		controllers.push(this.gazeController);
		controllers.push(this.mouseController);
		this.activeControllers.add(this.mouseController);
		controllers.push(this.gamepadController);
		this.activeControllers.add(this.gamepadController);
		if (options.controllers.enabled) {
			if (options.controllers.visualization) {
				const controllerModelFactory = new XRControllerModelFactory();
				for (let i = 0; i < 2; ++i) {
					controllerGrips.push(renderer.xr.getControllerGrip(i));
					controllerGrips[i].add(controllerModelFactory.createControllerModel(controllerGrips[i]));
					this.activeControllers.add(controllerGrips[i]);
				}
			}
			if (options.hands.enabled) {
				for (let i = 0; i < 2; ++i) {
					this.hands.push(renderer.xr.getHand(i));
					this.activeControllers.add(this.hands[i]);
				}
				if (options.hands.visualization) {
					if (options.hands.visualizeJoints) {
						console.log("Visualize hand joints.");
						const handModelFactory = new XRHandModelFactory();
						for (let i = 0; i < 2; ++i) {
							const handModel = handModelFactory.createHandModel(this.hands[i], "boxes");
							handModel.xb = {
								...handModel.xb,
								pointerEvents: "none"
							};
							this.hands[i].add(handModel);
						}
					}
					if (options.hands.visualizeMeshes) {
						console.log("Visualize hand meshes.");
						const handModelFactory = new XRHandModelFactory();
						for (let i = 0; i < 2; ++i) {
							const handModel = handModelFactory.createHandModel(this.hands[i], "mesh");
							handModel.xb = {
								...handModel.xb,
								pointerEvents: "none"
							};
							this.hands[i].add(handModel);
						}
					}
				}
			}
		}
		if (options.controllers.visualizeRays) for (let i = 0; i < 2; ++i) controllers[i].add(new ControllerRayVisual());
		for (const controller of controllers) this.setupNativeSelectTracking(controller);
		this.bindSelectStart(this.defaultOnSelectStart.bind(this));
		this.bindSelectEnd(this.defaultOnSelectEnd.bind(this));
		this.bindSqueezeStart(this.defaultOnSqueezeStart.bind(this));
		this.bindSqueezeEnd(this.defaultOnSqueezeEnd.bind(this));
		this.bindListener("connected", this.defaultOnConnected.bind(this));
		this.bindListener("disconnected", this.defaultOnDisconnected.bind(this));
	}
	/**
	* Retrieves the controller object by its ID.
	* @param id - The ID of the controller.
	* @returns The controller with the specified ID, or undefined after removal.
	*/
	get(id) {
		return this.controllers.find((controller) => controller.userData.id === id);
	}
	/**
	* Adds an object to both controllers by creating a new group and cloning it.
	* @param obj - The object to add to each controller.
	*/
	addObject(obj) {
		const group = new Group();
		group.add(obj);
		for (let i = 0; i < this.controllers.length; ++i) this.controllers[i].add(group.clone());
	}
	/**
	* Creates a pivot point for each hand, primarily used as a reference
	* point.
	*/
	enablePivots() {
		if (this.pivotsEnabled) return;
		this.pivotsEnabled = true;
		const pivot = new Mesh(new IcosahedronGeometry(.01, 3));
		pivot.name = "pivot";
		pivot.position.z = -.05;
		this.addObject(pivot);
	}
	/**
	* Adds reticles to the controllers and scene, with initial visibility set to
	* false.
	*/
	addReticles() {
		let id = 0;
		for (const controller of this.controllers) {
			if (controller.reticle == null) {
				controller.reticle = new Reticle();
				this.ownedReticles.add(controller.reticle);
				controller.reticle.name = "Reticle " + id;
				++id;
			}
			controller.reticle.visible = false;
			this.reticles.add(controller.reticle);
			if (this.reticleConfigurer && controller.reticle) this.reticleConfigurer(controller.reticle);
		}
	}
	/**
	* Sets a configuration callback for reticles (such as upgrading to WebGPU materials)
	* and immediately applies it to all existing reticles.
	*/
	setReticleConfigurer(configurer) {
		this.reticleConfigurer = configurer;
		const configured = /* @__PURE__ */ new Set();
		for (const reticle of this.ownedReticles) {
			configurer(reticle);
			configured.add(reticle);
		}
		for (const controller of this.controllers) if (controller.reticle && !configured.has(controller.reticle)) {
			configurer(controller.reticle);
			configured.add(controller.reticle);
		}
	}
	/**
	* Default action to handle the start of a selection, setting the selecting
	* state to true.
	*/
	defaultOnSelectStart(event) {
		const controller = event.target;
		controller.userData.selected = true;
	}
	/**
	* Default action to handle the end of a selection, setting the selecting
	* state to false.
	*/
	defaultOnSelectEnd(event) {
		const controller = event.target;
		controller.userData.selected = false;
		this.releasedControllers.add(controller);
	}
	defaultOnSqueezeStart(event) {
		const controller = event.target;
		controller.userData.squeezing = true;
		this.defaultOnSelectStart(event);
	}
	defaultOnSqueezeEnd(event) {
		const controller = event.target;
		controller.userData.squeezing = false;
		this.defaultOnSelectEnd(event);
	}
	defaultOnConnected(event) {
		const controller = event.target;
		controller.userData.connected = true;
		controller.gamepad = event.data?.gamepad;
		controller.inputSource = event.data;
		switch (event.data?.handedness) {
			case "left":
				this.leftController = controller;
				break;
			case "right": this.rightController = controller;
		}
	}
	defaultOnDisconnected(event) {
		const controller = event.target;
		const wasSelected = controller.userData.selected === true;
		const shouldKeepTransientPointer = this.nativeSelectControllers.delete(controller) && (wasSelected || this.releasedControllers.has(controller)) && (event.data?.targetRayMode ?? controller.inputSource?.targetRayMode) === "transient-pointer";
		if (shouldKeepTransientPointer) {
			const lastIntersection = controller.userData.lastIntersection;
			this.disconnectedTransientPointerControllers.set(controller, {
				position: controller.getWorldPosition(new Vector3()),
				orientation: controller.getWorldQuaternion(new Quaternion()),
				sourceType: this.getRaySourceType(controller),
				sampled: false,
				...lastIntersection?.object && lastIntersection.point ? { intersection: {
					...lastIntersection,
					point: lastIntersection.point.clone(),
					...lastIntersection.uv ? { uv: lastIntersection.uv.clone() } : {},
					...lastIntersection.uv1 ? { uv1: lastIntersection.uv1.clone() } : {},
					...lastIntersection.normal ? { normal: lastIntersection.normal.clone() } : {},
					...lastIntersection.barycoord ? { barycoord: lastIntersection.barycoord.clone() } : {},
					...lastIntersection.pointOnLine ? { pointOnLine: lastIntersection.pointOnLine.clone() } : {}
				} } : {}
			});
		}
		controller.userData.connected = false;
		if (controller.userData.selected) {
			controller.userData.selected = false;
			this.dispatchEvent({
				type: "selectend",
				target: controller,
				data: event.data,
				isCustom: true
			});
		}
		if (controller.reticle) controller.reticle.visible = false;
		if (!shouldKeepTransientPointer) this.releasedControllers.delete(controller);
		delete controller?.gamepad;
		if (this.leftController === controller) this.leftController = void 0;
		if (this.rightController === controller) this.rightController = void 0;
	}
	setupNativeSelectTracking(controller) {
		controller.addEventListener("selectstart", this.captureNativeSelectEvent);
		controller.addEventListener("select", this.captureNativeSelectEvent);
	}
	removeNativeSelectTracking(controller) {
		controller.removeEventListener("selectstart", this.captureNativeSelectEvent);
		controller.removeEventListener("select", this.captureNativeSelectEvent);
	}
	/**
	* Binds a listener to both controllers.
	* @param listenerName - Event name
	* @param listener - Function to call
	*/
	bindListener(listenerName, listener) {
		for (const controller of this.controllers) {
			this.setupNativeSelectTracking(controller);
			this.pinchFilter.setupControllerForType(controller, listenerName);
		}
		if (!this.listeners.has(listenerName)) this.listeners.set(listenerName, []);
		this.listeners.get(listenerName).push(listener);
	}
	unbindListener(listenerName, listener) {
		if (this.listeners.has(listenerName)) {
			const list = this.listeners.get(listenerName);
			const index = list.indexOf(listener);
			if (index !== -1) list.splice(index, 1);
			if (list.length === 0) for (const controller of this.controllers) this.pinchFilter.removeControllerForType(controller, listenerName);
		}
	}
	dispatchEvent(event) {
		const removal = this.removingControllers.get(event.target);
		if (removal && (event.type === "selectend" || event.type === "disconnected")) {
			if (removal.has(event.type)) return;
			removal.add(event.type);
		} else if (this.pinchFilter.shouldFilterEvent(event)) return;
		if (this.listeners.has(event.type)) for (const listener of this.listeners.get(event.type)) listener(event);
	}
	/**
	* Binds an event listener to handle 'selectstart' events for both
	* controllers.
	* @param event - The event listener function.
	*/
	bindSelectStart(event) {
		this.bindListener("selectstart", event);
	}
	/**
	* Binds an event listener to handle 'selectend' events for both controllers.
	* @param event - The event listener function.
	*/
	bindSelectEnd(event) {
		this.bindListener("selectend", event);
	}
	/**
	* Binds an event listener to handle 'select' events for both controllers.
	* @param event - The event listener function.
	*/
	bindSelect(event) {
		this.bindListener("select", event);
	}
	/**
	* Binds an event listener to handle 'squeezestart' events for both
	* controllers.
	* @param event - The event listener function.
	*/
	bindSqueezeStart(event) {
		this.bindListener("squeezestart", event);
	}
	/**
	* Binds an event listener to handle 'squeezeend' events for both controllers.
	* @param event - The event listener function.
	*/
	bindSqueezeEnd(event) {
		this.bindListener("squeezeend", event);
	}
	bindSqueeze(event) {
		this.bindListener("squeeze", event);
	}
	bindKeyDown(event) {
		if (this.keyDownListeners.has(event)) return;
		this.keyDownListeners.add(event);
		if (typeof window !== "undefined") window.addEventListener("keydown", event);
	}
	bindKeyUp(event) {
		if (this.keyUpListeners.has(event)) return;
		this.keyUpListeners.add(event);
		if (typeof window !== "undefined") window.addEventListener("keyup", event);
	}
	unbindKeyDown(event) {
		this.keyDownListeners.delete(event);
		if (typeof window !== "undefined") window.removeEventListener("keydown", event);
	}
	unbindKeyUp(event) {
		this.keyUpListeners.delete(event);
		if (typeof window !== "undefined") window.removeEventListener("keyup", event);
	}
	/** Samples current controller, button, and direct-touch state. */
	sampleSources() {
		for (const [controller, graceFrame] of this.disconnectedTransientPointerControllers) if (graceFrame.sampled) {
			this.disconnectedTransientPointerControllers.delete(controller);
			this.releasedControllers.delete(controller);
		} else graceFrame.sampled = true;
		if (this.controllersEnabled) for (const controller of this.controllers) {
			if (controller.userData.connected !== true) continue;
			controller.updatePose?.();
			this.pinchFilter.updateController(controller);
		}
		this.updateDirectTouchInputs();
	}
	/** Returns the complete physical source state sampled this frame. */
	getFrame() {
		this.raySourceInputs.length = 0;
		if (this.controllersEnabled) for (const controller of this.controllers) {
			const transientPointerGraceFrame = this.disconnectedTransientPointerControllers.get(controller);
			if (controller.userData.connected !== true && !transientPointerGraceFrame) continue;
			let input = this.raySourceSlots.get(controller);
			if (!input) {
				input = {
					controller,
					sourceType: this.getRaySourceType(controller),
					ray: new Ray(),
					selected: false,
					position: new Vector3(),
					orientation: new Quaternion()
				};
				this.raySourceSlots.set(controller, input);
			}
			const position = input.position;
			const orientation = input.orientation;
			if (transientPointerGraceFrame) {
				position.copy(transientPointerGraceFrame.position);
				orientation.copy(transientPointerGraceFrame.orientation);
			} else {
				controller.getWorldPosition(position);
				controller.getWorldQuaternion(orientation);
			}
			input.sourceType = transientPointerGraceFrame?.sourceType ?? this.getRaySourceType(controller);
			input.ray.origin.copy(position);
			input.ray.direction.set(0, 0, -1).applyQuaternion(orientation).normalize();
			if (transientPointerGraceFrame) input.intersections = transientPointerGraceFrame.intersection ? [transientPointerGraceFrame.intersection] : void 0;
			else {
				const lastIntersection = controller.userData.lastIntersection;
				input.intersections = lastIntersection && lastIntersection.object && lastIntersection.point ? [lastIntersection] : void 0;
			}
			input.selected = !transientPointerGraceFrame && controller.userData.selected === true;
			input.released = transientPointerGraceFrame ? this.releasedControllers.has(controller) : this.releasedControllers.delete(controller);
			this.raySourceInputs.push(input);
		}
		return this.interactionFrame;
	}
	getRaySourceType(controller) {
		if (controller === this.mouseController) return "mouse";
		if (controller === this.gazeController) return "gaze";
		if (controller.inputSource?.hand) return "hand-ray";
		return "controller-ray";
	}
	updateDirectTouchInputs() {
		this.directTouchInputs.length = 0;
		for (let handIndex = 0; handIndex < 2; handIndex++) {
			const controller = this.controllers[handIndex];
			const hand = this.hands[handIndex];
			const indexTip = hand?.joints?.["index-finger-tip"];
			if (!controller || !hand?.visible || !indexTip?.visible) continue;
			let input = this.directTouchSlots[handIndex];
			if (!input) {
				input = {
					controller,
					handIndex,
					point: new Vector3(),
					orientation: new Quaternion(),
					selected: false
				};
				this.directTouchSlots[handIndex] = input;
			}
			input.controller = controller;
			input.hand = hand.joints?.wrist;
			indexTip.getWorldPosition(input.point);
			controller.getWorldQuaternion(input.orientation);
			input.selected = controller.userData.selected === true;
			this.directTouchInputs.push(input);
		}
	}
	enableGazeController() {
		this.activeControllers.add(this.gazeController);
		this.gazeController.connect();
	}
	disableGazeController() {
		this.gazeController.disconnect();
		this.activeControllers.remove(this.gazeController);
	}
	registerController(controller) {
		if (this.controllers.includes(controller)) return;
		for (const existing of [...this.builtInControllers, ...this.controllers]) {
			const id = existing.userData.id;
			if (Number.isSafeInteger(id) && id >= 0) this.nextControllerId = Math.max(this.nextControllerId, id + 1);
		}
		controller.userData.id = this.nextControllerId++;
		this.controllers.push(controller);
		if (!this.builtInControllers.has(controller)) this.addonControllers.add(controller);
		if (!controller.reticle && this.options?.reticles.enabled) {
			controller.reticle = new Reticle();
			this.ownedReticles.add(controller.reticle);
		}
		if (controller.reticle) {
			controller.reticle.visible = false;
			this.reticles.add(controller.reticle);
			if (this.reticleConfigurer) this.reticleConfigurer(controller.reticle);
		}
		this.setupNativeSelectTracking(controller);
		this.pinchFilter.setupController(controller, this.listeners.keys());
	}
	enableController(controller) {
		if (this.removingControllers.has(controller)) return;
		this.registerController(controller);
		this.activeControllers.add(controller);
		controller.connect?.();
	}
	disableController(controller) {
		controller.disconnect?.();
		this.activeControllers.remove(controller);
	}
	/**
	* Permanently unregisters a source added through enableController. Built-ins
	* and already-removed sources are ignored. Capture is cancelled as source-lost
	* next frame; terminal selectend/disconnected notifications are sent once.
	*/
	removeController(controller) {
		if (this.builtInControllers.has(controller) || !this.addonControllers.delete(controller)) return;
		const index = this.controllers.indexOf(controller);
		if (index !== -1) this.controllers.splice(index, 1);
		this.removeNativeSelectTracking(controller);
		this.nativeSelectControllers.delete(controller);
		this.disconnectedTransientPointerControllers.delete(controller);
		this.removingControllers.set(controller, /* @__PURE__ */ new Set());
		const seen = /* @__PURE__ */ new Set();
		const observeEnd = () => {
			seen.add("selectend");
		};
		const observeDisconnect = () => {
			seen.add("disconnected");
		};
		controller.addEventListener("selectend", observeEnd);
		controller.addEventListener("disconnected", observeDisconnect);
		this.pinchFilter.setupController(controller, ["selectend", "disconnected"]);
		try {
			controller.disconnect?.();
		} finally {
			try {
				try {
					if (!seen.has("selectend")) controller.dispatchEvent({
						type: "selectend",
						target: controller
					});
				} finally {
					if (!seen.has("disconnected")) controller.dispatchEvent({
						type: "disconnected",
						target: controller
					});
				}
			} finally {
				controller.removeEventListener("selectend", observeEnd);
				controller.removeEventListener("disconnected", observeDisconnect);
				for (const type of /* @__PURE__ */ new Set([
					...this.listeners.keys(),
					"selectend",
					"disconnected"
				])) this.pinchFilter.removeControllerForType(controller, type);
				this.removingControllers.delete(controller);
				this.activeControllers.remove(controller);
				controller.userData.connected = false;
				controller.userData.selected = false;
				controller.userData.squeezing = false;
				delete controller.gamepad;
				if (this.leftController === controller) this.leftController = void 0;
				if (this.rightController === controller) this.rightController = void 0;
				this.releasedControllers.delete(controller);
				this.nativeSelectControllers.delete(controller);
				this.disconnectedTransientPointerControllers.delete(controller);
				this.raySourceSlots.delete(controller);
				if (controller.reticle) {
					controller.reticle.visible = false;
					controller.reticle.targetObject = void 0;
					controller.reticle.removeFromParent();
					if (this.ownedReticles.delete(controller.reticle)) {
						controller.reticle.dispose();
						controller.reticle = void 0;
					}
				}
			}
		}
	}
	disableControllers() {
		this.controllersEnabled = false;
		this.nativeSelectControllers.clear();
		this.disconnectedTransientPointerControllers.clear();
		for (const controller of this.controllers) {
			controller.userData.selected = false;
			this.releasedControllers.delete(controller);
			if (controller.reticle) {
				controller.reticle.visible = false;
				controller.reticle.targetObject = void 0;
			}
		}
	}
	enableControllers() {
		this.controllersEnabled = true;
	}
	dispose() {
		if (typeof window !== "undefined") {
			for (const listener of this.keyDownListeners) window.removeEventListener("keydown", listener);
			for (const listener of this.keyUpListeners) window.removeEventListener("keyup", listener);
		}
		this.keyDownListeners.clear();
		this.keyUpListeners.clear();
		this.pinchFilter.dispose(this.controllers);
		this.addonControllers.clear();
		this.removingControllers.clear();
		for (const controller of this.controllers) this.removeNativeSelectTracking(controller);
		this.listeners.clear();
		for (const controller of /* @__PURE__ */ new Set([...this.controllers, this.gazeController])) if (controller.reticle && this.ownedReticles.has(controller.reticle)) controller.reticle = void 0;
		for (const reticle of this.ownedReticles) reticle.dispose();
		this.ownedReticles.clear();
		this.reticles.clear();
		this.raySourceInputs.length = 0;
		this.raySourceSlots.clear();
		this.nativeSelectControllers.clear();
		this.disconnectedTransientPointerControllers.clear();
		this.directTouchInputs.length = 0;
		this.directTouchSlots.length = 0;
	}
};
/**
* Integrates the RAPIER physics engine into the XRCore lifecycle.
* It sets up the physics in a blended world that combines virtual and physical
* objects, steps the simulation forward in sync with the application's
* framerate, and manages the lifecycle of physics-related objects.
*/
var Physics = class {
	constructor() {
		this.initialized = false;
		this.fps = 0;
	}
	get timestep() {
		return 1 / this.fps;
	}
	/**
	* Asynchronously initializes the RAPIER physics engine and creates the
	* blendedWorld. This is called in Core before the physics simulation starts.
	*/
	async init({ physicsOptions }) {
		this.options = physicsOptions;
		this.RAPIER = this.options.RAPIER;
		this.fps = this.options.fps;
		if (this.RAPIER.init) await this.RAPIER.init();
		this.blendedWorld = new this.RAPIER.World(this.options.gravity);
		this.blendedWorld.timestep = this.timestep;
		if (this.options.useEventQueue) this.eventQueue = new this.RAPIER.EventQueue(true);
		this.initialized = true;
	}
	/**
	* Advances the physics simulation by one step.
	*/
	physicsStep() {
		if (this.options?.worldStep && this.blendedWorld) this.blendedWorld.step(this.eventQueue);
	}
	/**
	* Frees the memory allocated by the RAPIER physics blendedWorld and event
	* queue. This is crucial for preventing memory leaks when the XR session
	* ends.
	*/
	dispose() {
		let firstError;
		for (const free of [() => this.eventQueue?.free(), () => this.blendedWorld?.free()]) try {
			free();
		} catch (error) {
			firstError ??= error;
		}
		this.initialized = false;
		if (firstError !== void 0) throw firstError;
	}
};
function arrayBufferToBase64(buffer) {
	const bytes = new Uint8Array(buffer);
	let binary = "";
	for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
	return btoa(binary);
}
var AudioListener = class extends Script {
	static {
		this.dependencies = { registry: Registry };
	}
	constructor(options = {}) {
		super();
		this.isCapturing = false;
		this.latestAudioBuffer = null;
		this.accumulatedChunks = [];
		this.isAccumulating = false;
		this.options = {
			sampleRate: 16e3,
			channelCount: 1,
			echoCancellation: true,
			noiseSuppression: true,
			autoGainControl: true,
			...options
		};
	}
	/**
	* Init the AudioListener.
	*/
	init({ registry }) {
		this.registry = registry;
	}
	async startCapture(callbacks = {}) {
		if (this.isCapturing) return;
		this.onAudioData = callbacks.onAudioData;
		this.onError = callbacks.onError;
		this.isAccumulating = callbacks.accumulate || false;
		if (this.isAccumulating) this.accumulatedChunks = [];
		try {
			await this.setupAudioCapture();
			this.isCapturing = true;
		} catch (error) {
			console.error("Failed to start audio capture:", error);
			this.onError?.(error);
			this.cleanup();
		}
	}
	stopCapture() {
		if (!this.isCapturing) return;
		this.cleanup();
		this.isCapturing = false;
	}
	async setupAudioCapture() {
		this.audioStream = await navigator.mediaDevices.getUserMedia({
			audio: {
				echoCancellation: this.options.echoCancellation,
				noiseSuppression: this.options.noiseSuppression,
				autoGainControl: this.options.autoGainControl
			},
			video: false
		});
		const actualSampleRate = this.audioStream.getAudioTracks()[0].getSettings().sampleRate;
		this.audioContext = new AudioContext({ sampleRate: actualSampleRate });
		await this.setupAudioWorklet();
		this.sourceNode = this.audioContext.createMediaStreamSource(this.audioStream);
		this.processorNode = new AudioWorkletNode(this.audioContext, "audio-capture-processor");
		this.processorNode.port.onmessage = (event) => {
			if (event.data.type === "audioData") {
				this.latestAudioBuffer = event.data.data;
				if (this.isAccumulating) this.accumulatedChunks.push(event.data.data);
				this.onAudioData?.(event.data.data);
				this.streamToAI(event.data.data);
			}
		};
		if (this.audioContext.state === "suspended") await this.audioContext.resume();
		this.sourceNode.connect(this.processorNode);
	}
	async setupAudioWorklet() {
		const blob = new Blob([`
      class AudioCaptureProcessor extends AudioWorkletProcessor {
        process(inputs, outputs, parameters) {
          const input = inputs[0];
          if (input && input[0]) {
            const inputData = input[0];
            const pcmData = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              pcmData[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
            }
            this.port.postMessage({type: 'audioData', data: pcmData.buffer});
          }
          return true;
        }
      }
      registerProcessor('audio-capture-processor', AudioCaptureProcessor);
    `], { type: "application/javascript" });
		const processorURL = URL.createObjectURL(blob);
		await this.audioContext.audioWorklet.addModule(processorURL);
		URL.revokeObjectURL(processorURL);
	}
	streamToAI(audioBuffer) {
		if (!this.aiService?.sendRealtimeInput) return;
		const base64Audio = arrayBufferToBase64(audioBuffer);
		const actualSampleRate = this.audioContext?.sampleRate || this.options.sampleRate;
		this.aiService.sendRealtimeInput({ audio: {
			data: base64Audio,
			mimeType: `audio/pcm;rate=${actualSampleRate}`
		} });
	}
	setAIStreaming(enabled) {
		this.aiService = enabled ? this.registry.get(AI) : void 0;
	}
	cleanup() {
		this.processorNode?.disconnect();
		this.sourceNode?.disconnect();
		if (this.audioContext && this.audioContext.state !== "closed") this.audioContext.close();
		this.audioStream?.getTracks().forEach((track) => track.stop());
		this.processorNode = void 0;
		this.sourceNode = void 0;
		this.audioContext = void 0;
		this.audioStream = void 0;
		this.onAudioData = void 0;
		this.onError = void 0;
		this.latestAudioBuffer = null;
		this.accumulatedChunks = [];
		this.isAccumulating = false;
		this.aiService = void 0;
	}
	static isSupported() {
		return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
	}
	getIsCapturing() {
		return this.isCapturing;
	}
	getLatestAudioBuffer() {
		return this.latestAudioBuffer;
	}
	clearLatestAudioBuffer() {
		this.latestAudioBuffer = null;
	}
	/**
	* Gets all accumulated audio chunks as a single combined buffer
	*/
	getAccumulatedBuffer() {
		if (this.accumulatedChunks.length === 0) return null;
		const totalLength = this.accumulatedChunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
		const combined = new ArrayBuffer(totalLength);
		const combinedArray = new Uint8Array(combined);
		let offset = 0;
		for (const chunk of this.accumulatedChunks) {
			combinedArray.set(new Uint8Array(chunk), offset);
			offset += chunk.byteLength;
		}
		return combined;
	}
	/**
	* Clears accumulated chunks
	*/
	clearAccumulatedBuffer() {
		this.accumulatedChunks = [];
	}
	/**
	* Gets the number of accumulated chunks
	*/
	getAccumulatedChunkCount() {
		return this.accumulatedChunks.length;
	}
	dispose() {
		this.stopCapture();
		super.dispose();
	}
};
/**
* Call init on a script or subsystem with dependency injection.
*/
async function callInitWithDependencyInjection(script, registry, fallback) {
	const dependencies = script.constructor.dependencies;
	if (dependencies == null) {
		await script.init(fallback);
		return;
	}
	await script.init(Object.fromEntries(Object.entries(dependencies).map(([key, value]) => {
		const dependency = registry.get(value);
		if (!dependency) throw new Error(`Dependency not found for key: ${value.name}`);
		return [key, dependency];
	})));
}
/**
* Utility functions for positioning and orienting objects in 3D
* space.
*/
var vector3 = new Vector3();
var vector3a = new Vector3();
var vector3b = new Vector3();
var matrix4 = new Matrix4();
/**
* Places and orients an object at a specific intersection point on another
* object's surface. The placed object's 'up' direction will align with the
* surface normal at the intersection, and its 'forward' direction will point
* towards a specified target object (e.g., the camera), but constrained to the
* surface plane.
*
* This is useful for placing objects on walls or floors so they sit flat
* against the surface but still turn to face the user.
*
* @param obj - The object to be placed and oriented.
* @param intersection - The intersection data from a
*     raycast,
* containing the point and normal of the surface. The normal is assumed to be
* in local space.
* @param target - The object that `obj` should face (e.g., the
*     camera).
* @returns The modified `obj`.
*/
function placeObjectAtIntersectionFacingTarget(obj, intersection, target) {
	obj.position.copy(intersection.point);
	intersection.object.updateWorldMatrix(true, false);
	const worldNormal = vector3b.copy(intersection.normal).transformDirection(intersection.object.matrixWorld);
	const forwardVector = target.getWorldPosition(vector3).sub(obj.position).cross(worldNormal).cross(worldNormal).multiplyScalar(-1).normalize();
	const rightVector = vector3a.crossVectors(worldNormal, forwardVector);
	matrix4.makeBasis(rightVector, worldNormal, forwardVector);
	obj.quaternion.setFromRotationMatrix(matrix4);
	return obj;
}
/**
* Represents a single detected object in the XR environment and holds metadata
* about the object's properties. Note: 3D object position is stored in the
* position property of `Three.Object3D`.
*/
var DetectedObject = class extends Object3D {
	/**
	* @param label - The semantic label of the object.
	* @param image - The base64 encoded cropped image of the object.
	* @param detection2DBoundingBox - The 2D bounding box of the detected object in normalized screen
	* coordinates. Values are between 0 and 1. Centerpoint of this bounding is
	* used for backproject to obtain 3D object position (i.e., this.position).
	* @param data - Additional properties from the detector.
	* This includes any object proparties that is requested through the
	* schema but is not assigned a class property by default (e.g., color, size).
	*/
	constructor(label, image, detection2DBoundingBox, data) {
		super();
		this.label = label;
		this.image = image;
		this.detection2DBoundingBox = detection2DBoundingBox;
		this.data = data;
	}
};
var DEBUG_FONT_URL = "https://cdn.jsdelivr.net/npm/three@0.186.0/examples/fonts/helvetiker_regular.typeface.json";
var cachedFontPromise = null;
function loadDebugFont() {
	if (!cachedFontPromise) cachedFontPromise = new FontLoader().loadAsync(DEBUG_FONT_URL);
	return cachedFontPromise;
}
/**
* Base class for object detector backends.
* Handles the orchestration of capturing snapshots, running detection,
* and creating visual representations.
*
* T - The type of additional data associated with the detected object.
*/
var BaseDetectorBackend$1 = class {
	constructor(context) {
		this.context = context;
	}
	async run(depthMeshSnapshot, cameraParametersSnapshot, snapshotOverride) {
		if (!await this.isAvailable()) return [];
		const snapshot = snapshotOverride ?? await this.getSnapshot();
		if (!snapshot) return [];
		let normalizedDetections = [];
		try {
			normalizedDetections = await this.detect(snapshot);
		} catch (error) {
			console.error("Object detection backend failed:", error);
			return [];
		}
		if (this.context.options.objects.showDebugVisualizations) this.visualize(snapshot, normalizedDetections);
		const detectionPromises = normalizedDetections.map(async (item) => {
			const boundingBox = new Box2(new Vector2(item.xmin, item.ymin), new Vector2(item.xmax, item.ymax));
			const center = new Vector2();
			boundingBox.getCenter(center);
			const worldCoordinates = transformRgbUvToWorld(center, depthMeshSnapshot, cameraParametersSnapshot);
			if (worldCoordinates) {
				const { worldPosition } = worldCoordinates;
				const margin = this.context.options.objects.objectImageMargin;
				const cropBox = boundingBox.clone();
				cropBox.min.subScalar(margin);
				cropBox.max.addScalar(margin);
				const imageSource = snapshot.imageData || snapshot.base64;
				if (!imageSource) throw new Error("No valid snapshot data for cropping");
				const objectImage = await cropImage(imageSource, cropBox);
				const object = new DetectedObject(item.objectName, objectImage, boundingBox, item.additionalData);
				object.position.copy(worldPosition);
				if (this.context.debugVisualsGroup) this.createDebugVisual(object);
				return object;
			}
			return null;
		});
		return (await Promise.all(detectionPromises)).filter((obj) => obj !== null && obj !== void 0);
	}
	dispose() {}
	/**
	* Creates a debug visual representation for a detected object in the 3D scene.
	*
	* @param object - The detected object to visualize.
	*/
	async createDebugVisual(object) {
		const sphere = new Mesh(new SphereGeometry(.03, 16, 16), new MeshBasicMaterial({ color: 4282549748 }));
		sphere.position.copy(object.position);
		try {
			const font = await loadDebugFont();
			const geometry = new TextGeometry(object.label, {
				font,
				size: .05,
				depth: .005
			});
			geometry.computeBoundingBox();
			if (geometry.boundingBox) {
				const xOffset = -(geometry.boundingBox.max.x - geometry.boundingBox.min.x) / 2;
				geometry.translate(xOffset, 0, 0);
			}
			const textMaterial = new MeshBasicMaterial({ color: 16777215 });
			const textLabel = new Mesh(geometry, textMaterial);
			textLabel.position.copy(sphere.position);
			textLabel.position.y += .04;
			this.context.debugVisualsGroup.add(sphere, textLabel);
		} catch (error) {
			console.warn("Failed to load debug font for object detection label:", error);
			this.context.debugVisualsGroup.add(sphere);
		}
	}
	/**
	* Visualizes the detections by drawing bounding boxes on a canvas and downloading the image.
	* This is used for debugging detection results.
	*
	* @param snapshot - The camera snapshot used for detection.
	* @param detections - The array of normalized detections to draw.
	*/
	visualize(snapshot, detections) {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const drawDetectionsAndDownload = () => {
			detections.forEach((item) => {
				const rectX = item.xmin * canvas.width;
				const rectY = item.ymin * canvas.height;
				const rectWidth = (item.xmax - item.xmin) * canvas.width;
				const rectHeight = (item.ymax - item.ymin) * canvas.height;
				ctx.strokeStyle = "#FF0000";
				ctx.lineWidth = Math.max(2, canvas.width / 400);
				ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
				const text = item.objectName;
				const fontSize = Math.max(16, canvas.width / 80);
				ctx.font = `bold ${fontSize}px sans-serif`;
				ctx.textBaseline = "bottom";
				const textMetrics = ctx.measureText(text);
				ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
				ctx.fillRect(rectX, rectY - fontSize, textMetrics.width + 8, fontSize + 4);
				ctx.fillStyle = "#FFFFFF";
				ctx.fillText(text, rectX + 4, rectY + 2);
			});
			const timestamp = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", "_").replace(/:/g, "-");
			const link = document.createElement("a");
			link.download = `detection_debug_${timestamp}.png`;
			link.href = canvas.toDataURL("image/png");
			link.click();
		};
		if (snapshot.imageData) {
			canvas.width = snapshot.imageData.width;
			canvas.height = snapshot.imageData.height;
			ctx.putImageData(snapshot.imageData, 0, 0);
			drawDetectionsAndDownload();
		} else if (snapshot.base64) {
			const img = new Image();
			img.onload = () => {
				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;
				ctx.drawImage(img, 0, 0);
				drawDetectionsAndDownload();
			};
			img.src = snapshot.base64;
		}
	}
};
/**
* Object detector backend implementation using Gemini via the AI service.
* Sends image data to a remote model for detection.
*
* T - The type of additional data associated with the detected object.
*/
var GeminiDetectorBackend = class extends BaseDetectorBackend$1 {
	async isAvailable() {
		return !!this.context.ai.isAvailable();
	}
	async getSnapshot() {
		const base64Image = await this.context.deviceCamera.getSnapshot({ outputFormat: "base64" });
		if (!base64Image) return null;
		return { base64: base64Image };
	}
	buildGeminiConfig() {
		const geminiOptions = this.context.options.objects.backendConfig.gemini;
		return {
			generation_config: {
				thinking_level: "low",
				...geminiOptions.generationConfig ?? {}
			},
			system_instruction: geminiOptions.systemInstruction,
			response_format: [{
				type: "text",
				mime_type: "application/json",
				schema: geminiOptions.responseSchema
			}]
		};
	}
	async detect(snapshot) {
		const { mimeType, strippedBase64 } = parseBase64DataURL(snapshot.base64);
		const config = this.buildGeminiConfig();
		const originalGeminiConfig = this.context.aiOptions.gemini.config;
		this.context.aiOptions.gemini.config = config;
		const textPrompt = "What do you see in this image?";
		let backendResponse = null;
		try {
			backendResponse = await this.context.ai.model.query({
				type: "multiPart",
				parts: [{ inlineData: {
					mimeType: mimeType || void 0,
					data: strippedBase64
				} }, { text: textPrompt }]
			});
		} catch (e) {
			console.error("Gemini detection failed", e);
			return [];
		} finally {
			this.context.aiOptions.gemini.config = originalGeminiConfig;
		}
		return this.normalizeDetections(backendResponse);
	}
	normalizeDetections(backendResponse) {
		let parsedResponse;
		try {
			if (backendResponse && backendResponse.text) parsedResponse = JSON.parse(backendResponse.text);
			else return [];
		} catch (e) {
			console.warn("Error while normalizing detections in Gemini Response", e);
			return [];
		}
		if (!Array.isArray(parsedResponse)) return [];
		return parsedResponse.reduce((acc, item) => {
			const { ymin, xmin, ymax, xmax, objectName, ...additionalData } = item || {};
			if ([
				ymin,
				xmin,
				ymax,
				xmax
			].every((coord) => typeof coord === "number")) acc.push({
				ymin: ymin / 1e3,
				xmin: xmin / 1e3,
				ymax: ymax / 1e3,
				xmax: xmax / 1e3,
				objectName: objectName || "unknown",
				additionalData
			});
			return acc;
		}, []);
	}
};
var FilesetResolver$3;
var ObjectDetector$1;
async function loadMediaPipeModule$3() {
	if (FilesetResolver$3 && ObjectDetector$1) return;
	try {
		const mediapipeModule = await __vitePreload(() => import("./vision_bundle-DJ7uGc4o.js"), []);
		FilesetResolver$3 = mediapipeModule.FilesetResolver;
		ObjectDetector$1 = mediapipeModule.ObjectDetector;
		console.log("'@mediapipe/tasks-vision' module loaded successfully.");
	} catch (error) {
		console.error("Failed to load MediaPipe module:", error);
		throw error;
	}
}
/**
* Object detector backend implementation using MediaPipe's Object Detector.
* Runs locally on the device.
*
* T - The type of additional data associated with the detected object (not used currently).
*/
var MediaPipeDetectorBackend$1 = class extends BaseDetectorBackend$1 {
	constructor(context) {
		super(context);
		this.objectDetector = null;
		this.initializationPromise = this.tryInitializeObjectDetector();
	}
	async isAvailable() {
		try {
			await this.initializationPromise;
			return true;
		} catch (e) {
			console.error("MediaPipe Object Detector is not available:", e);
			return false;
		}
	}
	async getSnapshot() {
		const imageData = await this.context.deviceCamera.getSnapshot({ outputFormat: "imageData" });
		if (!imageData) return null;
		return { imageData };
	}
	async detect(snapshot) {
		await this.initializationPromise;
		if (!this.objectDetector) return [];
		const backendResponse = this.objectDetector.detect(snapshot.imageData);
		if (!backendResponse) return [];
		const width = snapshot.imageData.width;
		const height = snapshot.imageData.height;
		return this.normalizeDetections(backendResponse, width, height);
	}
	normalizeDetections(backendResponse, width, height) {
		return backendResponse.detections.reduce((acc, detection) => {
			const box = detection.boundingBox;
			if (box) {
				const category = detection.categories?.[0];
				const objectName = category?.categoryName || category?.displayName || "unknown";
				acc.push({
					ymin: box.originY / height,
					xmin: box.originX / width,
					ymax: (box.originY + box.height) / height,
					xmax: (box.originX + box.width) / width,
					objectName
				});
			}
			return acc;
		}, []);
	}
	/**
	* Initializes the MediaPipe Object Detector if it has not already been initialized.
	* Loads the fileset resolver for vision tasks and creates the detector instance
	* with the configured model asset path and score threshold.
	*/
	async tryInitializeObjectDetector() {
		if (this.objectDetector) return;
		await loadMediaPipeModule$3();
		const mediapipeOptions = this.context.options.objects.backendConfig.mediapipe;
		const vision = await FilesetResolver$3.forVisionTasks(mediapipeOptions.wasmFilesUrl);
		this.objectDetector = await ObjectDetector$1.createFromOptions(vision, {
			baseOptions: { modelAssetPath: mediapipeOptions.modelAssetPath },
			scoreThreshold: mediapipeOptions.scoreThreshold
		});
	}
};
/**
* Detects objects in the user's environment using a specified backend.
* It queries an AI model with the device camera feed and returns located
* objects with 2D and 3D positioning data.
*/
var ObjectDetector = class extends Script {
	constructor(..._args) {
		super(..._args);
		this._detectedObjects = /* @__PURE__ */ new Map();
		this._detectorBackends = /* @__PURE__ */ new Map();
		this.activeClients = /* @__PURE__ */ new Set();
		this.currentDetectionPromise = null;
		this.pendingDetectionPromise = null;
		this.lastContinuousDetectionStartedAtMs = -Infinity;
		this.initialized = false;
		this.disposed = false;
		this.detectedObjects = [];
		this.targetDevice = "galaxyxr";
	}
	static {
		this.dependencies = {
			options: WorldOptions,
			ai: AI,
			aiOptions: AIOptions,
			deviceCamera: XRDeviceCamera,
			depth: Depth,
			camera: Camera,
			rendererHolder: RendererHolder
		};
	}
	/**
	* Initializes the ObjectDetector.
	* @override
	*/
	init({ options, ai, aiOptions, deviceCamera, depth, camera, rendererHolder }) {
		this.options = options;
		this.ai = ai;
		this.aiOptions = aiOptions;
		this.deviceCamera = deviceCamera;
		this.depth = depth;
		this.camera = camera;
		this.renderer = rendererHolder.renderer;
		this.initialized = true;
		this.disposed = false;
		if (this.targetDevice === "galaxyxr") this.targetDevice = detectDeviceCameraTarget();
		if (this.options.objects.showDebugVisualizations) {
			this._debugVisualsGroup = new Group();
			this._debugVisualsGroup.raycast = () => {};
			this.add(this._debugVisualsGroup);
		}
	}
	/**
	* Starts continuous object detection for the given client.
	* Detection starts on the next update after initialization.
	* @param client - The client object requesting object detection.
	*/
	start(client) {
		if (this.activeClients.has(client)) return;
		this.activeClients.add(client);
	}
	/**
	* Stops continuous object detection for the given client.
	* If this was the last client, stops the background detection loop.
	* @param client - The client object that no longer needs object detection.
	*/
	stop(client) {
		this.activeClients.delete(client);
	}
	/**
	* Called per frame by the engine. If there are active clients,
	* ensures the continuous object detection is running.
	*/
	update() {
		if (!this.initialized || this.activeClients.size === 0 || this.currentDetectionPromise || this.pendingDetectionPromise) return;
		const pollingIntervalMs = this.options.objects.pollingIntervalMs;
		if (pollingIntervalMs > 0 && performance.now() - this.lastContinuousDetectionStartedAtMs < pollingIntervalMs) return;
		this.runContinuousDetection();
	}
	runContinuousDetection() {
		if (this.currentDetectionPromise || this.pendingDetectionPromise) return;
		this.lastContinuousDetectionStartedAtMs = performance.now();
		this.currentDetectionPromise = this.runDetectionInternal().then((results) => {
			if (!this.disposed) this.detectedObjects = results;
			return results;
		}).finally(() => {
			this.currentDetectionPromise = null;
		});
	}
	/**
	* Runs object detection or returns the ongoing detection promise.
	*
	* - If continuous detection is started (has active clients), returns the
	*   promise for the next detection result.
	* - If continuous detection is not started, performs a one-off detection and
	*   returns the result. If a one-off detection is already in progress, returns
	*   the promise for that ongoing detection.
	* - Supplying a snapshot or backend queues a separate one-off run after
	*   pending detections, without changing the continuous detector's options.
	*   Supplied snapshots retain the camera pose and depth at submission time.
	*   Simulator ground truth, when installed, still takes precedence.
	*
	* @param options - Optional inputs for this run only.
	* @returns A promise that resolves with an
	* array of detected `DetectedObject` instances.
	* @throws If an explicit backend or snapshot is invalid, or the detector
	* is disposed before a queued request starts.
	*/
	runDetection(options = {}) {
		if (this.disposed) return Promise.reject(/* @__PURE__ */ new Error("ObjectDetector has been disposed."));
		if (!this.initialized) return Promise.reject(/* @__PURE__ */ new Error("ObjectDetector is not initialized."));
		if (options.backend !== void 0 || options.snapshot !== void 0) return this.runDetectionWithOverrides(options);
		if (this.currentDetectionPromise) return this.currentDetectionPromise;
		if (this.pendingDetectionPromise) return this.pendingDetectionPromise;
		if (this.activeClients.size > 0) {
			this.runContinuousDetection();
			return this.currentDetectionPromise;
		}
		return this.runOneOffDetection();
	}
	async runDetectionWithOverrides(options) {
		const backend = options.backend ?? this.options.objects.backendConfig.activeBackend;
		if (backend !== "gemini" && backend !== "mediapipe") throw new Error(`ObjectDetector backend '${backend}' is not supported.`);
		const snapshot = options.snapshot === void 0 ? void 0 : { ...options.snapshot };
		const requiredField = backend === "gemini" ? "base64" : "imageData";
		if (snapshot && !snapshot[requiredField]) throw new Error(`ObjectDetector snapshot for '${backend}' must include ${requiredField}.`);
		const frame = snapshot && !this.simulatorSource ? this.captureDetectionFrame() : void 0;
		const run = () => this.runOneOffDetection({
			backend,
			snapshot
		}, frame);
		const previous = this.pendingDetectionPromise ?? this.currentDetectionPromise;
		const pending = (previous ? previous.then(run, run) : run()).finally(() => {
			if (this.pendingDetectionPromise === pending) this.pendingDetectionPromise = null;
		});
		this.pendingDetectionPromise = pending;
		return pending;
	}
	runOneOffDetection(options = {}, frame) {
		const current = this.runDetectionInternal(options, frame).finally(() => {
			if (this.currentDetectionPromise === current) this.currentDetectionPromise = null;
		});
		this.currentDetectionPromise = current;
		return current;
	}
	/** Installs or removes the desktop simulator's ground-truth detector. */
	setSimulatorSource(source) {
		this.simulatorSource = source;
		return this;
	}
	async runDetectionInternal(options = {}, frame) {
		let detectionFrame = frame;
		try {
			if (this.disposed) throw new Error("ObjectDetector has been disposed.");
			this.clearDetectedObjects();
			if (this.simulatorSource) {
				const detectedObjects = this.simulatorSource.detect().map((input) => {
					const object = new DetectedObject(input.label, null, input.boundingBox, input.data ?? {});
					object.position.copy(input.position);
					return object;
				});
				for (const object of detectedObjects) {
					this._detectedObjects.set(object.uuid, object);
					this.add(object);
				}
				return detectedObjects;
			}
			if (detectionFrame === void 0) detectionFrame = this.captureDetectionFrame();
			if (!detectionFrame) return [];
			const context = this.getDetectorContext();
			const activeBackend = options.backend ?? this.options.objects.backendConfig.activeBackend;
			const detectorBackendPromise = this.getOrCreateDetectorBackend(activeBackend, context);
			let detectorBackend;
			try {
				detectorBackend = await detectorBackendPromise;
			} catch (error) {
				console.warn(`Failed to load or initialize ObjectDetector backend '${activeBackend}':`, error);
				return [];
			}
			if (this.disposed) return [];
			const detectedObjects = await detectorBackend.run(detectionFrame.depthMeshSnapshot, detectionFrame.cameraParametersSnapshot, options.snapshot);
			if (this.disposed) return [];
			for (const obj of detectedObjects) {
				this._detectedObjects.set(obj.uuid, obj);
				this.add(obj);
			}
			return detectedObjects;
		} finally {
			if (detectionFrame) this.disposeDepthMeshSnapshot(detectionFrame.depthMeshSnapshot);
		}
	}
	captureDetectionFrame() {
		const cameraParametersSnapshot = getCameraParametersSnapshot(this.camera, this.renderer.xr.getCamera(), this.deviceCamera, this.targetDevice);
		return cameraParametersSnapshot ? {
			cameraParametersSnapshot,
			depthMeshSnapshot: this.getDepthMeshSnapshot()
		} : null;
	}
	getDetectorContext() {
		return {
			options: this.options,
			ai: this.ai,
			aiOptions: this.aiOptions,
			deviceCamera: this.deviceCamera,
			debugVisualsGroup: this._debugVisualsGroup
		};
	}
	getOrCreateDetectorBackend(activeBackend, context) {
		let detectorBackendPromise = this._detectorBackends.get(activeBackend);
		if (!detectorBackendPromise) {
			detectorBackendPromise = (async () => {
				switch (activeBackend) {
					case "gemini": return new GeminiDetectorBackend(context);
					case "mediapipe": return new MediaPipeDetectorBackend$1(context);
					default: throw new Error(`ObjectDetector backend '${activeBackend}' is not supported.`);
				}
			})();
			this._detectorBackends.set(activeBackend, detectorBackendPromise);
		}
		return detectorBackendPromise;
	}
	getDepthMeshSnapshot() {
		const depthMesh = this.depth.depthMesh;
		const clonedGeometry = (this.depth.options.depthMesh.updateFullResolutionGeometry ? depthMesh.geometry : depthMesh.downsampledGeometry || depthMesh.geometry).clone();
		clonedGeometry.computeBoundingSphere();
		clonedGeometry.computeBoundingBox();
		const depthMeshSnapshot = new Mesh(clonedGeometry, new MeshBasicMaterial());
		depthMesh.getWorldPosition(depthMeshSnapshot.position);
		depthMesh.getWorldQuaternion(depthMeshSnapshot.quaternion);
		depthMesh.getWorldScale(depthMeshSnapshot.scale);
		depthMeshSnapshot.updateMatrixWorld(true);
		return depthMeshSnapshot;
	}
	/**
	* Retrieves a list of currently detected objects.
	*
	* @param label - The semantic label to filter by (e.g., 'chair'). If null,
	* all objects are returned.
	* @returns An array of `Object` instances.
	*/
	get(label = null) {
		const allObjects = Array.from(this._detectedObjects.values());
		if (!label) return allObjects;
		return allObjects.filter((obj) => obj.label === label);
	}
	/**
	* Removes all currently detected objects from the scene and internal
	* tracking.
	*/
	clear() {
		this.clearDetectedObjects();
		this.detectedObjects = [];
		return this;
	}
	clearDetectedObjects() {
		for (const obj of this._detectedObjects.values()) {
			disposeObjectTree(obj);
			this.remove(obj);
		}
		this._detectedObjects.clear();
		if (this._debugVisualsGroup) disposeObjectChildren(this._debugVisualsGroup);
	}
	disposeDepthMeshSnapshot(depthMeshSnapshot) {
		depthMeshSnapshot.geometry.dispose();
		disposeMaterial(depthMeshSnapshot.material);
	}
	/**
	* Toggles the visibility of all debug visualizations for detected objects.
	* @param visible - Whether the visualizations should be visible.
	*/
	showDebugVisualizations(visible = true) {
		if (this._debugVisualsGroup) this._debugVisualsGroup.visible = visible;
	}
	dispose() {
		this.initialized = false;
		this.disposed = true;
		this.activeClients.clear();
		disposeObjectChildren(this);
		this.clear();
		for (const backendPromise of this._detectorBackends.values()) backendPromise.then((backend) => backend.dispose?.()).catch(() => {});
		this._detectorBackends.clear();
		this.simulatorSource = void 0;
	}
};
/**
* Represents a single detected plane in the XR environment. It's a THREE.Mesh
* that also holds metadata about the plane's properties.
* Note: This requires chrome://flags/#openxr-spatial-entities to be enabled.
*/
var DetectedPlane = class extends Mesh {
	/**
	* @param xrPlane - The plane object from the WebXR API.
	* @param material - The material for the mesh.
	*/
	constructor(xrPlane, material, simulatorPlane) {
		let geometry;
		if (xrPlane) {
			const planePolygon = xrPlane.polygon;
			const vertices = [];
			for (const point of planePolygon) vertices.push(new Vector2(point.x, point.z));
			const shape = new Shape(vertices);
			geometry = new ShapeGeometry(shape);
			geometry.rotateX(Math.PI / 2);
		} else if (simulatorPlane) {
			const shape = new Shape(simulatorPlane.polygon);
			geometry = new ShapeGeometry(shape);
			geometry.rotateX(Math.PI / 2);
		}
		super(geometry, material);
		this.xrPlane = xrPlane;
		this.simulatorPlane = simulatorPlane;
		if (xrPlane) {
			this.label = xrPlane.semanticLabel;
			this.orientation = xrPlane.orientation;
		} else if (simulatorPlane) {
			this.label = simulatorPlane.label || simulatorPlane.type;
			this.orientation = simulatorPlane.type;
			this.position.copy(simulatorPlane.position);
			this.quaternion.copy(simulatorPlane.quaternion);
		}
	}
};
/**
* Detects and manages real-world planes provided by the WebXR Plane Detection
* API. It creates, updates, and removes `Plane` mesh objects in the scene.
*/
var PlaneDetector = class extends Script {
	constructor(..._args) {
		super(..._args);
		this._detectedPlanes = /* @__PURE__ */ new Map();
		this.usingSimulatorPlanes = false;
	}
	static {
		this.dependencies = {
			options: WorldOptions,
			rendererHolder: RendererHolder
		};
	}
	/**
	* Initializes the PlaneDetector.
	*/
	init({ options, rendererHolder }) {
		this.renderer = rendererHolder.renderer;
		if (options.planes.showDebugVisualizations) this._debugMaterial = new MeshBasicMaterial({
			color: 16776960,
			wireframe: true,
			side: 2
		});
	}
	/**
	* Processes the XRFrame to update plane information.
	*/
	update(_, frame) {
		if (!frame || !frame.detectedPlanes || this.usingSimulatorPlanes) return;
		this._xrRefSpace = this._xrRefSpace || this.renderer.xr.getReferenceSpace() || void 0;
		if (!this._xrRefSpace) return;
		const detectedPlanesInFrame = frame.detectedPlanes;
		const planesToRemove = new Set(this._detectedPlanes.keys());
		for (const xrPlane of detectedPlanesInFrame) {
			planesToRemove.delete(xrPlane);
			const existingPlaneMesh = this._detectedPlanes.get(xrPlane);
			if (existingPlaneMesh) {
				if (xrPlane.lastChangedTime > (existingPlaneMesh.xrPlane?.lastChangedTime || 0)) this._updatePlaneMesh(frame, existingPlaneMesh, xrPlane);
			} else this._addPlaneMesh(frame, xrPlane);
		}
		for (const xrPlane of planesToRemove) this._removePlaneMesh(xrPlane);
	}
	/**
	* Creates and adds a new `Plane` mesh to the scene.
	* @param frame - WebXR frame.
	* @param xrPlane - The new WebXR plane object.
	*/
	_addPlaneMesh(frame, xrPlane) {
		const planeMesh = new DetectedPlane(xrPlane, this._debugMaterial || new MeshBasicMaterial({ visible: false }));
		this._updatePlanePose(frame, planeMesh, xrPlane);
		this._detectedPlanes.set(xrPlane, planeMesh);
		this.add(planeMesh);
		return planeMesh;
	}
	/**
	* Updates an existing `DetectedPlane` mesh's geometry and pose.
	* @param frame - WebXR frame.
	* @param planeMesh - The mesh to update.
	* @param xrPlane - The updated plane data.
	*/
	_updatePlaneMesh(frame, planeMesh, xrPlane) {
		const newVertices = xrPlane.polygon.map((p) => new Vector2(p.x, p.z));
		const newShape = new Shape(newVertices);
		const newGeometry = new ShapeGeometry(newShape);
		planeMesh.geometry.dispose();
		planeMesh.geometry = newGeometry;
		planeMesh.xrPlane = xrPlane;
		this._updatePlanePose(frame, planeMesh, xrPlane);
	}
	/**
	* Removes a `Plane` mesh from the scene and disposes of its resources.
	* @param xrPlane - The WebXR plane object to remove.
	*/
	_removePlaneMesh(xrPlane) {
		const planeMesh = this._detectedPlanes.get(xrPlane);
		if (planeMesh) {
			this.disposePlaneMesh(planeMesh);
			this.remove(planeMesh);
			this._detectedPlanes.delete(xrPlane);
		}
	}
	disposePlaneMesh(planeMesh) {
		planeMesh.geometry.dispose();
		disposeMaterial(planeMesh.material, this._debugMaterial ? /* @__PURE__ */ new Set([this._debugMaterial]) : void 0);
	}
	/**
	* Updates the position and orientation of a `DetectedPlane` mesh from its XR
	* pose.
	* @param frame - The current XRFrame.
	* @param planeMesh - The mesh to update.
	* @param xrPlane - The plane data with the pose.
	*/
	_updatePlanePose(frame, planeMesh, xrPlane) {
		const pose = frame.getPose(xrPlane.planeSpace, this._xrRefSpace);
		if (pose) {
			planeMesh.position.copy(pose.transform.position);
			planeMesh.quaternion.copy(pose.transform.orientation);
		}
	}
	/**
	* Retrieves a list of detected planes, optionally filtered by a semantic
	* label.
	*
	* @param label - The semantic label to filter by (e.g.,
	*     'floor', 'wall').
	* If null or undefined, all detected planes are returned.
	* @returns An array of `DetectedPlane` objects
	*     matching the criteria.
	*/
	get(label) {
		const allPlanes = Array.from(this._detectedPlanes.values());
		if (!label) return allPlanes;
		return allPlanes.filter((plane) => plane.label === label);
	}
	/**
	* Toggles the visibility of the debug meshes for all planes.
	* Requires `showDebugVisualizations` to be true in the options.
	* @param visible - Whether to show or hide the planes.
	*/
	showDebugVisualizations(visible = true) {
		if (this._debugMaterial) this.visible = visible;
	}
	_addSimulatorPlaneMesh(plane) {
		const planeMesh = new DetectedPlane(null, this._debugMaterial || new MeshBasicMaterial({ visible: false }), plane);
		this._detectedPlanes.set(plane, planeMesh);
		this.add(planeMesh);
		return planeMesh;
	}
	setSimulatorPlanes(planes) {
		this.usingSimulatorPlanes = true;
		for (const plane of Array.from(this._detectedPlanes.keys())) this._removePlaneMesh(plane);
		for (const plane of planes) this._addSimulatorPlaneMesh(plane);
	}
	clearSimulatorPlanes() {
		if (!this.usingSimulatorPlanes) return;
		for (const plane of Array.from(this._detectedPlanes.keys())) this._removePlaneMesh(plane);
		this.usingSimulatorPlanes = false;
	}
	dispose() {
		for (const plane of Array.from(this._detectedPlanes.keys())) this._removePlaneMesh(plane);
		this._debugMaterial?.dispose();
		this.usingSimulatorPlanes = false;
		this._xrRefSpace = void 0;
	}
};
/**
* Determines what the running platform can do with anchors.
*
* The anchor APIs are optional in three independent places: a frame may not be
* able to create anchors, a session may not be able to restore them, and an
* individual anchor may not be able to hand back a persistent handle. Presence
* of an XR session says nothing about any of them, so each is probed directly
* rather than inferred.
*
* `persistent` is therefore a statement about the session, not a promise about
* any particular anchor: whether an anchor can hand back a handle is only
* knowable once that anchor exists. {@link AnchorManager.persist} reports that
* per anchor, so treat this as "saving is worth offering" rather than
* "saving will work".
*
* @param session - The active XR session, if any.
* @param frame - The current XR frame, if any.
* @returns What the platform supports.
*/
function anchorCapability(session, frame) {
	if (!frame || !session) return "unsupported";
	if (typeof frame.createAnchor !== "function") return "unsupported";
	return typeof session.restorePersistentAnchor === "function" ? "persistent" : "session-only";
}
/**
* Resolves the default backing storage.
*
* `localStorage` throws on access in some privacy modes rather than merely
* being absent, so this never lets that reach the caller.
*
* @returns Browser local storage, or undefined when it cannot be used.
*/
function defaultStorage() {
	try {
		return typeof localStorage === "undefined" ? void 0 : localStorage;
	} catch {
		return;
	}
}
/**
* Persists anchor handles in browser local storage.
*
* Every operation degrades to a no-op rather than throwing: a missing or full
* store should cost the caller its persistence, not its session.
*/
var LocalStorageAnchorStore = class {
	/**
	* @param key - Storage key to read and write.
	* @param maxRecords - Cap on saved records; oldest are evicted first.
	* @param storage - Backing storage. Omit to use `localStorage`; pass `null`
	*     to disable persistence entirely. `null` is distinct from omission so
	*     callers can opt out explicitly instead of relying on a default.
	*/
	constructor(key, maxRecords, storage) {
		this.key = key;
		this.maxRecords = maxRecords;
		this.storage = storage === void 0 ? defaultStorage() : storage ?? void 0;
	}
	/**
	* Reads every saved record.
	* @returns Saved records, oldest first, or an empty array.
	*/
	load() {
		if (!this.storage) return [];
		let raw = null;
		try {
			raw = this.storage.getItem(this.key);
		} catch (error) {
			console.warn("[anchors] could not read stored anchors", error);
			return [];
		}
		if (!raw) return [];
		try {
			const parsed = JSON.parse(raw);
			if (!Array.isArray(parsed)) {
				console.warn("[anchors] stored anchors were not a list; ignoring");
				return [];
			}
			return parsed.filter(isAnchorRecord);
		} catch (error) {
			console.warn("[anchors] stored anchors were unreadable", error);
			return [];
		}
	}
	/**
	* Saves a record, replacing any existing entry with the same uuid.
	* @param record - The record to save.
	* @returns Whether the record was committed.
	*/
	save(record) {
		const records = this.load();
		const index = records.findIndex((r) => r.uuid === record.uuid);
		if (index >= 0) records[index] = record;
		else records.push(record);
		if (index < 0 && records.length > this.maxRecords) {
			records.sort((a, b) => a.createdAt - b.createdAt);
			records.splice(0, records.length - this.maxRecords);
		}
		return this.write(records);
	}
	/**
	* Removes a single record.
	* @param uuid - Handle of the record to remove.
	*/
	remove(uuid) {
		this.write(this.load().filter((r) => r.uuid !== uuid));
	}
	/** Removes every saved record. */
	clear() {
		if (!this.storage) return;
		try {
			this.storage.removeItem(this.key);
		} catch (error) {
			console.warn("[anchors] could not clear stored anchors", error);
		}
	}
	write(records) {
		if (!this.storage) {
			console.warn("[anchors] no storage available; anchors will not persist");
			return false;
		}
		try {
			this.storage.setItem(this.key, JSON.stringify(records));
			return true;
		} catch (error) {
			console.warn("[anchors] could not save anchors", error);
			return false;
		}
	}
};
/**
* Narrows an unknown parsed value to a usable record.
* @param value - Candidate parsed from storage.
* @returns Whether the value is a usable record.
*/
function isAnchorRecord(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	if (typeof candidate.uuid !== "string" || candidate.uuid.length === 0 || typeof candidate.label !== "string") return false;
	return candidate.pose === void 0 || isStorablePose(candidate.pose);
}
/**
* Checks a stored pose has the arrays a restore will index into.
* @param value - Candidate pose parsed from storage.
* @returns Whether the pose is usable.
*/
function isStorablePose(value) {
	if (!value || typeof value !== "object") return false;
	const pose = value;
	const numbers = (v, length) => Array.isArray(v) && v.length === length && v.every(Number.isFinite);
	return numbers(pose.position, 3) && numbers(pose.orientation, 4);
}
/**
* A stand-in anchor for environments with no WebXR anchor support.
*
* The desktop simulator has no tracking system to anchor against, so this
* holds the pose itself. It is deliberately a separate type rather than a
* silent substitute: anchoring here proves the app's own wiring, not that the
* platform can re-localise anything, and callers can tell the difference via
* {@link SimulatorAnchor.isSimulatorAnchor}.
*/
var SimulatorAnchor = class SimulatorAnchor {
	/**
	* @param handle - Identifier used as this anchor's persistent handle.
	* @param pose - Pose to hold.
	*/
	constructor(handle, pose) {
		this.handle = handle;
		this.isSimulatorAnchor = true;
		this.anchorSpace = {};
		this.requestPersistentHandle = async () => this.handle;
		this.pose = {
			position: {
				x: pose.position?.x ?? 0,
				y: pose.position?.y ?? 0,
				z: pose.position?.z ?? 0
			},
			orientation: {
				x: pose.orientation?.x ?? 0,
				y: pose.orientation?.y ?? 0,
				z: pose.orientation?.z ?? 0,
				w: pose.orientation?.w ?? 1
			}
		};
	}
	/** Matches the `XRAnchor.delete` shape; nothing to release. */
	delete() {}
	/**
	* The held pose in storable form.
	* @returns The pose as plain arrays.
	*/
	toStorablePose() {
		return {
			position: [
				this.pose.position.x,
				this.pose.position.y,
				this.pose.position.z
			],
			orientation: [
				this.pose.orientation.x,
				this.pose.orientation.y,
				this.pose.orientation.z,
				this.pose.orientation.w
			]
		};
	}
	/**
	* Rebuilds an anchor from a stored pose.
	* @param handle - Handle to restore under.
	* @param pose - Previously stored pose.
	* @returns The rebuilt anchor.
	*/
	static fromStorablePose(handle, pose) {
		return new SimulatorAnchor(handle, {
			position: {
				x: pose.position[0],
				y: pose.position[1],
				z: pose.position[2]
			},
			orientation: {
				x: pose.orientation[0],
				y: pose.orientation[1],
				z: pose.orientation[2],
				w: pose.orientation[3]
			}
		});
	}
	/**
	* Whether an anchor is simulated rather than platform-provided.
	* @param anchor - Anchor to test.
	* @returns True when the anchor is a {@link SimulatorAnchor}.
	*/
	static isSimulatorAnchor(anchor) {
		return !!anchor && anchor.isSimulatorAnchor === true;
	}
};
var nextAnchorId = 0;
/**
* Mints a handle for a simulated anchor.
*
* Deliberately not the anchor's id: that counter restarts whenever the page
* loads, so a fresh anchor would eventually be handed an id a stored record
* already used, and saving it would overwrite that record.
*
* @returns A handle that will not collide with an existing one.
*/
function simulatedHandle() {
	const uuid = globalThis.crypto?.randomUUID?.();
	if (uuid) return `sim-${uuid}`;
	return `sim-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
/**
* Creates and tracks spatial anchors, and restores previously saved ones.
*
* Anchors let content stay attached to a real place as the platform refines
* its understanding of the room. With persistence enabled, handles are saved
* so the same content can be recovered in a later session.
*
* Every anchor API this uses is optional in WebXR, so the manager degrades
* quietly: on a platform without anchors, creation returns `null` and nothing
* throws.
*/
var AnchorManager = class extends Script {
	static {
		this.dependencies = {
			options: WorldOptions,
			rendererHolder: RendererHolder,
			xrReferenceSpaceCache: XRReferenceSpaceCache
		};
	}
	/**
	* @param store - Storage for persistent handles. Defaults to local storage,
	*     configured from options during {@link AnchorManager.init}.
	*/
	constructor(injectedStore) {
		super();
		this.injectedStore = injectedStore;
		this.capability = "unsupported";
		this.lastError = null;
		this.anchors = /* @__PURE__ */ new Map();
		this.warnedUnsupported = false;
		this.warnedSpaceDowngrade = false;
		this.pendingCreates = [];
	}
	/**
	* Initializes the manager.
	* @param dependencies - Resolved dependencies: the world options carrying
	*     the anchor settings, and the renderer supplying the reference space
	*     that anchor poses are expressed against.
	*/
	init({ options, rendererHolder, xrReferenceSpaceCache }) {
		this.options = options;
		this.renderer = rendererHolder?.renderer;
		this.referenceSpaceCache = xrReferenceSpaceCache;
		this.store = this.injectedStore ?? new LocalStorageAnchorStore(options.anchors.storageKey, options.anchors.maxStoredAnchors);
	}
	/**
	* Refreshes platform capability and drops anchors the platform has released.
	* @param _time - Frame timestamp, unused.
	* @param frame - The current XR frame.
	*/
	update(_time, frame) {
		if (!frame) {
			if (this.options?.anchors.simulatorFallback) this.capability = "simulated";
			return;
		}
		const probed = anchorCapability(frame.session, frame);
		this.capability = probed === "unsupported" && this.options?.anchors.simulatorFallback ? "simulated" : probed;
		if (this.capability === "unsupported") {
			if (!this.warnedUnsupported) {
				this.warnedUnsupported = true;
				console.warn("[anchors] this platform does not support anchors; content will not stay pinned across sessions");
			}
			return;
		}
		this.pruneUntracked(frame);
		this.flushPendingCreates(frame);
	}
	/**
	* Releases everything belonging to a session that has ended.
	*
	* Anchors do not survive their session, so keeping them would leave dead
	* handles that later restores would treat as already restored. Saved records
	* are untouched, since restoring them is the entire point.
	*/
	onSessionEnded() {
		for (const tracked of this.anchors.values()) try {
			tracked.anchor.delete?.();
		} catch {}
		this.anchors.clear();
		this.capability = this.options?.anchors.simulatorFallback ? "simulated" : "unsupported";
		this.warnedSpaceDowngrade = false;
		for (const pending of this.pendingCreates.splice(0)) pending.resolve(null);
	}
	/**
	* Creates an anchor at a pose.
	*
	* @param pose - Pose for the new anchor.
	* @param label - Label carried through persistence.
	* @param poseSpace - Space the pose is expressed in. Defaults to the frame's reference space.
	* @param anchorSpace - Space to anchor against. Defaults to 'bounded-floor'.
	* @returns The tracked anchor, or null when it could not be created.
	*/
	async create(pose, label, poseSpace = null, anchorSpace = "bounded-floor") {
		if (this.capability === "simulated") return this.createSimulated(pose, label);
		if (this.capability === "unsupported") return null;
		const frame = this.renderer?.xr.getFrame();
		if (!frame) return this.queueCreate(pose, label, poseSpace, anchorSpace, false);
		if (typeof frame.createAnchor !== "function") return null;
		return this.createResolved(frame, pose, label, poseSpace, anchorSpace, false);
	}
	/**
	* Holds a creation request until a frame is live.
	*
	* @param pose - Pose for the new anchor.
	* @param label - Label carried through persistence.
	* @param poseSpace - Space the pose is expressed in.
	* @param anchorSpace - Space to anchor against.
	* @param retried - Whether this request has already been requeued once.
	* @returns The tracked anchor once a frame arrives, or null.
	*/
	queueCreate(pose, label, poseSpace, anchorSpace, retried) {
		return new Promise((resolve) => {
			this.pendingCreates.push({
				pose,
				label,
				poseSpace,
				anchorSpace,
				resolve,
				retried
			});
		});
	}
	/**
	* Resolves spaces against a live frame and creates the anchor.
	*
	* @param frame - A frame known to be active.
	* @param pose - Pose for the new anchor.
	* @param label - Label carried through persistence.
	* @param poseSpace - Space the pose is expressed in.
	* @param anchorSpace - Space to anchor against.
	* @param retried - Whether this request has already been requeued once.
	* @returns The tracked anchor, or null when it could not be created.
	*/
	async createResolved(frame, pose, label, poseSpace, anchorSpace, retried) {
		let targetSpace = this.resolveSpace(anchorSpace);
		if (!targetSpace) {
			targetSpace = this.referenceSpace();
			this.warnSpaceDowngrade(anchorSpace);
		}
		if (!targetSpace) {
			console.warn("[anchors] no reference space available; cannot anchor");
			return null;
		}
		const sourceSpace = this.resolveSpace(poseSpace);
		if (!sourceSpace) {
			console.warn("[anchors] source poseSpace could not be resolved:", poseSpace);
			return null;
		}
		let targetPose = pose;
		if (sourceSpace !== targetSpace) {
			if (!this.referenceSpaceCache) {
				console.warn("[anchors] no reference space cache; cannot convert pose");
				return null;
			}
			targetPose = this.referenceSpaceCache.convertPose(pose, sourceSpace, targetSpace, frame);
		}
		if (!targetPose) {
			console.warn("[anchors] could not convert pose to anchor space", pose, sourceSpace, targetSpace);
			return null;
		}
		const immediate = await this.createOnFrame(frame, targetPose, label, targetSpace);
		if (immediate || retried) return immediate;
		return this.queueCreate(targetPose, label, targetSpace, targetSpace, true);
	}
	/**
	* Resolves a space request to a live XRSpace.
	*
	* @param request - A space, a reference space name, or null for the space
	*     the scene is currently drawn in.
	* @returns The space, or undefined when the platform has no such space.
	*/
	resolveSpace(request) {
		if (request === null) return this.referenceSpace();
		if (typeof request !== "string") return request;
		return this.referenceSpaceCache?.getCached(request);
	}
	/**
	* Says once per session that a requested anchor space was unavailable.
	*
	* @param requested - The space that could not be resolved.
	*/
	warnSpaceDowngrade(requested) {
		if (this.warnedSpaceDowngrade) return;
		this.warnedSpaceDowngrade = true;
		console.warn(`[anchors] ${String(requested)} is unavailable; anchoring against the scene reference space instead`);
	}
	/**
	* Runs queued creations against a live frame.
	* @param frame - The frame currently being rendered.
	*/
	async flushPendingCreates(frame) {
		if (this.pendingCreates.length === 0) return;
		if (typeof frame.createAnchor !== "function") {
			for (const pending of this.pendingCreates.splice(0)) pending.resolve(null);
			return;
		}
		for (const pending of this.pendingCreates.splice(0)) pending.resolve(await this.createResolved(frame, pending.pose, pending.label, pending.poseSpace, pending.anchorSpace, pending.retried));
	}
	/**
	* Creates an anchor on a frame known to be active.
	* @param frame - The frame currently being rendered.
	* @param pose - Pose for the new anchor.
	* @param label - Label carried through persistence.
	* @param space - Space the pose is expressed in.
	* @returns The tracked anchor, or null when it could not be created.
	*/
	async createOnFrame(frame, pose, label, space) {
		if (typeof frame.createAnchor !== "function") return null;
		try {
			const anchor = await frame.createAnchor(pose, space);
			if (!anchor) return null;
			const tracked = {
				id: `anchor-${nextAnchorId++}`,
				label,
				anchor
			};
			this.anchors.set(tracked.id, tracked);
			this.debug(`created ${tracked.id} (${label})`);
			return tracked;
		} catch (error) {
			this.lastError = error;
			console.warn("[anchors] could not create anchor", error);
			return null;
		}
	}
	/**
	* Saves an anchor's handle so it can be restored in a later session.
	*
	* @param id - Id of a tracked anchor.
	* @returns Whether a handle was saved.
	*/
	async persist(id) {
		if (!this.store) return false;
		const tracked = this.anchors.get(id);
		if (!tracked) return false;
		if (this.capability === "simulated") {
			const anchor = tracked.anchor;
			tracked.uuid ??= simulatedHandle();
			return this.store.save({
				uuid: tracked.uuid,
				label: tracked.label,
				createdAt: Date.now(),
				pose: anchor.toStorablePose()
			});
		}
		if (this.capability !== "persistent") {
			this.debug(`cannot persist ${id}: platform is ${this.capability}`);
			return false;
		}
		const request = tracked.anchor.requestPersistentHandle;
		if (typeof request !== "function") {
			this.debug(`cannot persist ${id}: anchor has no persistent handle`);
			return false;
		}
		try {
			const uuid = await request.call(tracked.anchor);
			tracked.uuid = uuid;
			const before = this.store.load();
			const saved = this.store.save({
				uuid,
				label: tracked.label,
				createdAt: Date.now()
			});
			if (saved) this.releaseEvicted(before, uuid);
			this.debug(`persisted ${id} as ${uuid} (stored: ${saved})`);
			return saved;
		} catch (error) {
			this.lastError = error;
			console.warn("[anchors] could not persist anchor", error);
			return false;
		}
	}
	/**
	* Restores every saved anchor.
	*
	* Re-localisation is probabilistic, so a handle that cannot be resolved here
	* is reported as `not-found` rather than treated as an error, and one
	* failure never stops the rest of the batch.
	*
	* @returns One result per saved record, in stored order.
	*/
	async restoreAll(session) {
		if (!this.store) return [];
		const records = this.store.load();
		if (records.length === 0) return [];
		if (this.capability === "simulated") return records.map((record) => this.restoreSimulated(record));
		const activeSession = session ?? this.currentSession();
		const restore = activeSession?.restorePersistentAnchor;
		if (this.capability !== "persistent" || typeof restore !== "function") return records.map((record) => ({
			record,
			status: "unsupported"
		}));
		return Promise.all(records.map((record) => this.restoreOne(record, activeSession)));
	}
	/**
	* Restores a single record.
	* @param record - The saved record to restore.
	* @param session - Session able to restore handles.
	* @returns The outcome for this record.
	*/
	async restoreOne(record, session) {
		const existing = this.findByUuid(record.uuid);
		if (existing) return {
			record,
			status: "restored",
			anchor: existing
		};
		try {
			const anchor = await session.restorePersistentAnchor(record.uuid);
			if (!anchor) return {
				record,
				status: "not-found"
			};
			const tracked = {
				id: `anchor-${nextAnchorId++}`,
				label: record.label,
				anchor,
				uuid: record.uuid
			};
			this.anchors.set(tracked.id, tracked);
			return {
				record,
				status: "restored",
				anchor: tracked
			};
		} catch (error) {
			this.debug(`could not restore ${record.uuid}: ${error}`);
			return {
				record,
				status: "not-found"
			};
		}
	}
	/**
	* Reads an anchor's current pose.
	*
	* @param id - Id of a tracked anchor.
	* @param referenceSpace - Space to express the pose in. Not needed for
	*     simulated anchors, which hold their own pose.
	* @returns The pose, or null when the anchor is not currently tracked.
	*/
	getPose(id, referenceSpace) {
		const tracked = this.anchors.get(id);
		if (!tracked) {
			console.debug(`Anchor ${id} not tracked`);
			return null;
		}
		if (SimulatorAnchor.isSimulatorAnchor(tracked.anchor)) {
			const { position, orientation } = tracked.anchor.pose;
			return { transform: {
				position,
				orientation
			} };
		}
		const space = referenceSpace ?? this.referenceSpace();
		const frame = this.renderer?.xr.getFrame();
		if (!frame || !space) return null;
		try {
			return frame.getPose(tracked.anchor.anchorSpace, space) ?? null;
		} catch (error) {
			this.lastError = error;
			console.debug("[anchors] could not read pose for", id, error);
			return null;
		}
	}
	/**
	* Stops tracking an anchor and forgets any saved handle for it.
	* @param id - Id of a tracked anchor.
	*/
	delete(id) {
		const tracked = this.anchors.get(id);
		if (!tracked) return;
		this.anchors.delete(id);
		if (tracked.uuid && this.store) {
			this.store.remove(tracked.uuid);
			this.releasePersistentHandle(tracked.uuid);
		}
		try {
			tracked.anchor.delete?.();
		} catch (error) {
			this.debug(`anchor ${id} could not be released: ${error}`);
		}
	}
	/**
	* Every anchor currently tracked.
	* @returns The tracked anchors.
	*/
	getAll() {
		return [...this.anchors.values()];
	}
	/**
	* Every persistent handle the platform is currently holding for this origin.
	*
	* Only the headset runtimes implement this; Chrome ships the anchors module
	* without persistence, where the attribute is absent rather than empty. An
	* empty result therefore means "nothing to report", not "the platform holds
	* none".
	*
	* Scoped to the origin, not to this store. Two pages on one origin see each
	* other's handles here, so a handle missing from your own records is not
	* evidence of a leak and must not be deleted on that basis.
	*
	* @returns The handles, or an empty array when unavailable.
	*/
	platformHandles() {
		const handles = this.currentSession()?.persistentAnchors;
		return handles ? [...handles].filter((uuid) => !!uuid) : [];
	}
	/**
	* Releases every persistent handle the platform is holding for this origin.
	*
	* A recovery path, not routine cleanup. Platforms cap how many persistent
	* anchors may exist, and once local records are gone nothing names the
	* handles any more, so {@link AnchorManager.forgetAll} cannot reach them and
	* the cap stays full forever. This reads the platform's own list instead.
	*
	* Origin wide and destructive: another page on the same origin loses its
	* anchors too. Offer it as an explicit choice, never as automatic cleanup.
	*
	* The platform's list is not guaranteed to shrink as handles are released,
	* so do not read it back afterwards to judge whether this worked. The
	* returned count is what the platform actually accepted.
	*
	* @returns How many handles the platform accepted a release for.
	*/
	async releaseAllPlatformHandles() {
		const session = this.currentSession();
		const remove = session?.deletePersistentAnchor;
		if (!session || typeof remove !== "function") {
			this.debug("cannot release: platform has no deletePersistentAnchor");
			return 0;
		}
		const handles = this.platformHandles();
		let released = 0;
		for (const uuid of handles) try {
			await remove.call(session, uuid);
			released++;
			this.debug(`released handle ${uuid}`);
		} catch (error) {
			this.lastError = error;
			this.debug(`could not release handle ${uuid}: ${error}`);
		}
		this.store?.clear();
		this.debug(`released ${released} of ${handles.length} platform handles`);
		return released;
	}
	/** Forgets every saved handle, leaving live anchors alone. */
	forgetAll() {
		if (!this.store) return;
		for (const record of this.store.load()) this.releasePersistentHandle(record.uuid);
		this.store.clear();
	}
	/**
	* The session to ask about anchors.
	*
	* Prefers the frame's own session, falling back to the renderer so calls
	* made outside the frame loop still reach the platform.
	*
	* @returns The session, or undefined.
	*/
	currentSession() {
		return this.renderer?.xr.getSession?.() ?? void 0;
	}
	/**
	* Releases handles the store dropped to stay under its cap.
	*
	* The store evicts silently, so without this the oldest handles stay
	* allocated on the platform with no record left able to name them.
	*
	* @param before - Records present immediately before the save.
	* @param saved - Handle just written, which is never evicted.
	*/
	releaseEvicted(before, saved) {
		if (!this.store) return;
		const kept = new Set(this.store.load().map((r) => r.uuid));
		for (const record of before) if (record.uuid !== saved && !kept.has(record.uuid)) {
			this.debug(`store evicted ${record.uuid}`);
			this.releasePersistentHandle(record.uuid);
		}
	}
	/**
	* Asks the platform to drop a persistent handle.
	*
	* Platforms cap how many handles an origin may hold, so forgetting a record
	* on our side without this slowly fills that quota with anchors no app can
	* name any more.
	*
	* @param uuid - The persistent handle to release.
	*/
	releasePersistentHandle(uuid) {
		if (uuid.startsWith("sim-")) return;
		const session = this.currentSession();
		const remove = session?.deletePersistentAnchor;
		if (!session) {
			this.debug(`cannot release ${uuid}: no session`);
			return;
		}
		if (typeof remove !== "function") {
			this.debug(`cannot release ${uuid}: platform has no deletePersistentAnchor`);
			return;
		}
		try {
			Promise.resolve(remove.call(session, uuid)).then(() => this.debug(`released handle ${uuid}`), (error) => this.debug(`could not release handle ${uuid}: ${error}`));
		} catch (error) {
			this.debug(`could not release handle ${uuid}: ${error}`);
		}
	}
	/** Releases every tracked anchor. Saved handles are left in storage. */
	dispose() {
		for (const tracked of this.anchors.values()) try {
			tracked.anchor.delete?.();
		} catch {}
		this.anchors.clear();
	}
	/**
	* Drops anchors the platform no longer reports as tracked.
	* @param frame - The current XR frame.
	*/
	pruneUntracked(frame) {
		if (this.capability === "simulated") return;
		const tracked = frame.trackedAnchors;
		if (!tracked) return;
		for (const [id, entry] of [...this.anchors]) if (!tracked.has(entry.anchor)) {
			this.anchors.delete(id);
			this.debug(`platform released ${id}`);
		}
	}
	/**
	* Creates a locally held anchor for environments without platform support.
	* @param pose - Pose to hold.
	* @param label - Label carried through persistence.
	* @returns The tracked anchor.
	*/
	createSimulated(pose, label) {
		const id = `anchor-${nextAnchorId++}`;
		const tracked = {
			id,
			label,
			anchor: new SimulatorAnchor(id, pose)
		};
		this.anchors.set(id, tracked);
		this.debug(`created simulated ${id} (${label})`);
		return tracked;
	}
	/**
	* Rebuilds a simulated anchor from its stored pose.
	* @param record - The saved record.
	* @returns The outcome for this record.
	*/
	restoreSimulated(record) {
		const existing = this.findByUuid(record.uuid);
		if (existing) return {
			record,
			status: "restored",
			anchor: existing
		};
		if (!record.pose) return {
			record,
			status: "not-found"
		};
		const tracked = {
			id: `anchor-${nextAnchorId++}`,
			label: record.label,
			uuid: record.uuid,
			anchor: SimulatorAnchor.fromStorablePose(record.uuid, record.pose)
		};
		this.anchors.set(tracked.id, tracked);
		return {
			record,
			status: "restored",
			anchor: tracked
		};
	}
	/**
	* The reference space anchor poses are expressed against.
	* @returns The reference space, or undefined when none is available yet.
	*/
	referenceSpace() {
		return this.renderer?.xr?.getReferenceSpace() ?? void 0;
	}
	/**
	* Finds a tracked anchor by its persistent handle.
	* @param uuid - Persistent handle to look for.
	* @returns The tracked anchor, or undefined.
	*/
	findByUuid(uuid) {
		for (const tracked of this.anchors.values()) if (tracked.uuid === uuid) return tracked;
	}
	/**
	* Logs when anchor debugging is enabled.
	* @param message - Message to log.
	*/
	debug(message) {
		if (this.options?.anchors.debugging) console.log(`[anchors] ${message}`);
	}
};
var DetectedMesh = class extends Mesh {
	get getRigidBody() {
		return this.rigidBody;
	}
	constructor(mesh, material) {
		const geometry = new BufferGeometry();
		geometry.setAttribute("position", new BufferAttribute(mesh.vertices, 3));
		geometry.setIndex(new BufferAttribute(mesh.indices, 1));
		geometry.computeVertexNormals();
		super(geometry, material);
		this.lastChangedTime = 0;
		this.lastChangedTime = "lastChangedTime" in mesh ? mesh.lastChangedTime : 0;
		this.semanticLabel = mesh.semanticLabel;
	}
	initRapierPhysics(rapier, blendedWorld) {
		this.RAPIER = rapier;
		this.blendedWorld = blendedWorld;
		const desc = rapier.RigidBodyDesc.fixed().setTranslation(this.position.x, this.position.y, this.position.z).setRotation(this.quaternion);
		this.rigidBody = blendedWorld.createRigidBody(desc);
		const vertices = this.geometry.attributes.position.array;
		const indices = this.geometry.getIndex().array;
		const colliderDesc = rapier.ColliderDesc.trimesh(vertices, indices);
		this.collider = blendedWorld.createCollider(colliderDesc, this.rigidBody);
	}
	updateVertices(mesh) {
		if (mesh.lastChangedTime === this.lastChangedTime) return;
		this.lastChangedTime = mesh.lastChangedTime;
		const positionAttribute = this.geometry.attributes.position;
		const indexAttribute = this.geometry.getIndex();
		const newVertexCount = mesh.vertices.length / 3;
		const newIndexCount = mesh.indices.length;
		if (positionAttribute.count !== newVertexCount || indexAttribute && indexAttribute.count !== newIndexCount) {
			const geometry = new BufferGeometry();
			geometry.setAttribute("position", new BufferAttribute(mesh.vertices, 3));
			geometry.setIndex(new BufferAttribute(mesh.indices, 1));
			geometry.computeVertexNormals();
			this.geometry.dispose();
			this.geometry = geometry;
		} else {
			const positions = positionAttribute.array;
			if (positions.length === mesh.vertices.length) {
				positions.set(mesh.vertices);
				positionAttribute.needsUpdate = true;
			}
			if (indexAttribute) {
				const indices = indexAttribute.array;
				if (indices.length === mesh.indices.length) {
					indices.set(mesh.indices);
					indexAttribute.needsUpdate = true;
				}
			}
			this.geometry.computeVertexNormals();
		}
		if (this.RAPIER && this.collider) {
			const RAPIER = this.RAPIER;
			this.blendedWorld.removeCollider(this.collider, false);
			const colliderDesc = RAPIER.ColliderDesc.trimesh(mesh.vertices, mesh.indices);
			this.collider = this.blendedWorld.createCollider(colliderDesc, this.rigidBody);
		}
	}
	dispose() {
		if (this.blendedWorld && this.collider) {
			this.blendedWorld.removeCollider(this.collider, false);
			this.collider = void 0;
		}
		if (this.blendedWorld && this.rigidBody) this.blendedWorld.removeRigidBody(this.rigidBody);
		this.rigidBody = void 0;
		this.geometry.dispose();
		super.dispose();
	}
};
var SEMANTIC_LABELS = [
	"floor",
	"ceiling",
	"wall"
];
var SEMANTIC_COLORS = [
	65280,
	16776960,
	255
];
var MeshDetector = class extends Script {
	constructor(..._args) {
		super(..._args);
		this.debugMaterials = /* @__PURE__ */ new Map();
		this.fallbackDebugMaterial = null;
		this.xrMeshToThreeMesh = /* @__PURE__ */ new Map();
		this.threeMeshToXrMesh = /* @__PURE__ */ new Map();
		this.usingSimulatorMeshes = false;
		this.defaultMaterial = new MeshBasicMaterial({ visible: false });
		this.meshTimedata = /* @__PURE__ */ new Map();
		this.MESH_UPDATE_INTERVAL_MS = 1e3;
		this.lastMeshUpdateTime = 0;
		this.MESH_STALE_TIME_MS = 3e3;
		this.CLEANUP_INTERVAL_MS = this.MESH_STALE_TIME_MS + 1e3;
		this.kMaxViewDistance = 3;
		this.kFOVCosThreshold = .25;
		this.lastCleanupTime = 0;
		this.frameCount = 0;
	}
	static {
		this.dependencies = {
			options: MeshDetectionOptions,
			rendererHolder: RendererHolder
		};
	}
	init({ options, rendererHolder }) {
		this.renderer = rendererHolder.renderer;
		if (options.showDebugVisualizations) {
			this.fallbackDebugMaterial = new MeshBasicMaterial({
				color: 0,
				wireframe: true,
				side: 2
			});
			for (let i = 0; i < SEMANTIC_LABELS.length; i++) this.debugMaterials.set(SEMANTIC_LABELS[i], new MeshBasicMaterial({
				color: SEMANTIC_COLORS[i],
				wireframe: true,
				side: 2
			}));
		}
	}
	initPhysics(physics) {
		this.physics = physics;
		for (const mesh of this.xrMeshToThreeMesh.values()) mesh.initRapierPhysics(physics.RAPIER, physics.blendedWorld);
	}
	updateMeshes(_timestamp, frame) {
		if (this.usingSimulatorMeshes) return;
		this.frameCount++;
		const t0 = performance.now();
		const meshes = frame?.detectedMeshes;
		performance.now() - t0;
		if (!meshes || !frame) return;
		const now = performance.now();
		if (now - this.lastMeshUpdateTime < this.MESH_UPDATE_INTERVAL_MS) return;
		this.lastMeshUpdateTime = now;
		const referenceSpace = this.renderer.xr.getReferenceSpace();
		if (!referenceSpace) return;
		const { position: cameraPosition, forward: cameraForward } = this.getCameraInfo(frame, referenceSpace);
		for (const xrMesh of meshes) {
			if (!this.shouldShowMeshInViewWithDistance(xrMesh, cameraPosition, cameraForward, frame, referenceSpace)) continue;
			const cachedChangedTime = this.meshTimedata.get(xrMesh)?.lastChangedTime;
			const currentChangedTime = xrMesh.lastChangedTime;
			const isNewMesh = cachedChangedTime === void 0;
			const isUpdated = cachedChangedTime !== void 0 && cachedChangedTime !== currentChangedTime;
			const isUnchanged = cachedChangedTime !== void 0 && cachedChangedTime === currentChangedTime;
			if (isNewMesh) {
				const threeMesh = this.createMesh(frame, xrMesh);
				this.xrMeshToThreeMesh.set(xrMesh, threeMesh);
				this.threeMeshToXrMesh.set(threeMesh, xrMesh);
				this.meshTimedata.set(xrMesh, {
					lastChangedTime: currentChangedTime,
					lastSeenTime: now
				});
				this.add(threeMesh);
				if (this.physics) threeMesh.initRapierPhysics(this.physics.RAPIER, this.physics.blendedWorld);
			} else if (isUpdated) {
				const threeMesh = this.xrMeshToThreeMesh.get(xrMesh);
				threeMesh.updateVertices(xrMesh);
				this.updateMeshPose(frame, xrMesh, threeMesh);
				this.meshTimedata.set(xrMesh, {
					lastChangedTime: currentChangedTime,
					lastSeenTime: now
				});
			} else if (isUnchanged) this.meshTimedata.set(xrMesh, {
				lastChangedTime: currentChangedTime,
				lastSeenTime: now
			});
		}
		if (now - this.lastCleanupTime >= this.CLEANUP_INTERVAL_MS) {
			this.cleanupStaleMeshes(now);
			this.lastCleanupTime = now;
		}
	}
	removeMesh(xrMesh, threeMesh) {
		this.xrMeshToThreeMesh.delete(xrMesh);
		this.threeMeshToXrMesh.delete(threeMesh);
		this.meshTimedata.delete(xrMesh);
		threeMesh.dispose();
		this.remove(threeMesh);
	}
	cleanupStaleMeshes(now) {
		const meshesToRemove = [];
		for (const [xrMesh] of this.xrMeshToThreeMesh.entries()) if (now - (this.meshTimedata.get(xrMesh)?.lastSeenTime || 0) >= this.MESH_STALE_TIME_MS) meshesToRemove.push(xrMesh);
		for (const xrMesh of meshesToRemove) {
			const threeMesh = this.xrMeshToThreeMesh.get(xrMesh);
			if (threeMesh) this.removeMesh(xrMesh, threeMesh);
		}
	}
	/**
	* Injects a set of meshes from the desktop simulator, bypassing the WebXR
	* `frame.detectedMeshes` path. Mirrors `PlaneDetector.setSimulatorPlanes`.
	*/
	setSimulatorMeshes(meshes) {
		this.usingSimulatorMeshes = true;
		for (const [xrMesh, threeMesh] of this.xrMeshToThreeMesh) this.removeMesh(xrMesh, threeMesh);
		for (const simMesh of meshes) {
			const threeMesh = new DetectedMesh(simMesh, simMesh.semanticLabel && this.debugMaterials.get(simMesh.semanticLabel) || this.fallbackDebugMaterial || this.defaultMaterial);
			if (simMesh.position) threeMesh.position.copy(simMesh.position);
			if (simMesh.quaternion) threeMesh.quaternion.copy(simMesh.quaternion);
			this.xrMeshToThreeMesh.set(simMesh, threeMesh);
			this.threeMeshToXrMesh.set(threeMesh, simMesh);
			this.add(threeMesh);
			if (this.physics) threeMesh.initRapierPhysics(this.physics.RAPIER, this.physics.blendedWorld);
		}
		return meshes.map((mesh) => this.xrMeshToThreeMesh.get(mesh));
	}
	clearSimulatorMeshes() {
		if (!this.usingSimulatorMeshes) return;
		for (const [source, mesh] of Array.from(this.xrMeshToThreeMesh.entries())) this.removeMesh(source, mesh);
		this.usingSimulatorMeshes = false;
	}
	dispose() {
		for (const [xrMesh, threeMesh] of Array.from(this.xrMeshToThreeMesh.entries())) this.removeMesh(xrMesh, threeMesh);
		this.defaultMaterial.dispose();
		this.fallbackDebugMaterial?.dispose();
		this.fallbackDebugMaterial = null;
		for (const material of this.debugMaterials.values()) material.dispose();
		this.debugMaterials.clear();
		this.usingSimulatorMeshes = false;
		this.physics = void 0;
	}
	createMesh(frame, xrMesh) {
		const semanticLabel = xrMesh.semanticLabel;
		const mesh = new DetectedMesh(xrMesh, semanticLabel && this.debugMaterials.get(semanticLabel) || this.fallbackDebugMaterial || this.defaultMaterial);
		this.updateMeshPose(frame, xrMesh, mesh);
		return mesh;
	}
	updateMeshPose(frame, xrMesh, mesh) {
		const pose = frame.getPose(xrMesh.meshSpace, this.renderer.xr.getReferenceSpace());
		if (pose) {
			mesh.position.copy(pose.transform.position);
			mesh.quaternion.copy(pose.transform.orientation);
			if (mesh instanceof DetectedMesh) {
				const rigidBody = mesh.getRigidBody;
				rigidBody?.setTranslation(mesh.position, false);
				rigidBody?.setRotation(mesh.quaternion, false);
			}
		}
	}
	getCameraInfo(frame, referenceSpace) {
		const viewerPose = frame.getViewerPose(referenceSpace);
		const cameraPosition = new Vector3(0, 0, 0);
		let cameraForward = new Vector3(0, 0, -1);
		if (viewerPose && viewerPose.views && viewerPose.views.length > 0) {
			const viewTransform = viewerPose.views[0].transform;
			const viewMatrix = new Matrix4().fromArray(viewTransform.matrix);
			cameraPosition.setFromMatrixPosition(viewMatrix);
			const forward = new Vector3(0, 0, -1);
			forward.applyMatrix4(viewMatrix);
			forward.sub(cameraPosition).normalize();
			cameraForward = forward;
		}
		return {
			position: cameraPosition,
			forward: cameraForward
		};
	}
	computeMeshBoundingBox(xrMesh) {
		const vertices = xrMesh.vertices;
		if (vertices.length < 3) return null;
		return new Box3().setFromArray(vertices);
	}
	/** Six clip planes from the view-projection matrix (left, right, bottom, top, near, far). */
	buildFrustumPlanes(viewMatrix, projectionMatrix) {
		const viewProjectionMatrix = new Matrix4();
		viewProjectionMatrix.multiplyMatrices(projectionMatrix, viewMatrix);
		const e = viewProjectionMatrix.elements;
		const planes = [
			new Plane().setComponents(e[3] + e[0], e[7] + e[4], e[11] + e[8], e[15] + e[12]),
			new Plane().setComponents(e[3] - e[0], e[7] - e[4], e[11] - e[8], e[15] - e[12]),
			new Plane().setComponents(e[3] + e[1], e[7] + e[5], e[11] + e[9], e[15] + e[13]),
			new Plane().setComponents(e[3] - e[1], e[7] - e[5], e[11] - e[9], e[15] - e[13]),
			new Plane().setComponents(e[3] + e[2], e[7] + e[6], e[11] + e[10], e[15] + e[14]),
			new Plane().setComponents(e[3] - e[2], e[7] - e[6], e[11] - e[10], e[15] - e[14])
		];
		for (const plane of planes) if (plane.normal.length() > 1e-4) plane.normalize();
		return planes;
	}
	frustumIntersectsBox(planes, box) {
		const boxMin = box.min;
		const boxMax = box.max;
		const axisVert = new Vector3();
		for (const plane of planes) {
			const n = plane.normal;
			axisVert.x = n.x < 0 ? boxMin.x : boxMax.x;
			axisVert.y = n.y < 0 ? boxMin.y : boxMax.y;
			axisVert.z = n.z < 0 ? boxMin.z : boxMax.z;
			if (plane.distanceToPoint(axisVert) < 0) return false;
		}
		return true;
	}
	shouldShowMeshInViewWithFrustum(mesh, frame, referenceSpace) {
		const meshPose = frame.getPose(mesh.meshSpace, referenceSpace);
		if (!meshPose) return true;
		const viewerPose = frame.getViewerPose(referenceSpace);
		if (!viewerPose || !viewerPose.views || viewerPose.views.length === 0) return true;
		const view = viewerPose.views[0];
		if (!view.projectionMatrix) return true;
		const localBoundingBox = this.computeMeshBoundingBox(mesh);
		if (!localBoundingBox) return true;
		const meshTransform = new Matrix4().fromArray(meshPose.transform.matrix);
		const meshPosition = new Vector3();
		const meshQuaternion = new Quaternion();
		const meshScale = new Vector3();
		meshTransform.decompose(meshPosition, meshQuaternion, meshScale);
		const corners = [
			new Vector3(localBoundingBox.min.x, localBoundingBox.min.y, localBoundingBox.min.z),
			new Vector3(localBoundingBox.max.x, localBoundingBox.min.y, localBoundingBox.min.z),
			new Vector3(localBoundingBox.min.x, localBoundingBox.max.y, localBoundingBox.min.z),
			new Vector3(localBoundingBox.max.x, localBoundingBox.max.y, localBoundingBox.min.z),
			new Vector3(localBoundingBox.min.x, localBoundingBox.min.y, localBoundingBox.max.z),
			new Vector3(localBoundingBox.max.x, localBoundingBox.min.y, localBoundingBox.max.z),
			new Vector3(localBoundingBox.min.x, localBoundingBox.max.y, localBoundingBox.max.z),
			new Vector3(localBoundingBox.max.x, localBoundingBox.max.y, localBoundingBox.max.z)
		];
		for (const corner of corners) {
			corner.multiply(meshScale);
			corner.applyQuaternion(meshQuaternion);
			corner.add(meshPosition);
		}
		const worldBox = new Box3().setFromPoints(corners);
		const viewTransform = view.transform;
		const viewMatrix = new Matrix4().fromArray(viewTransform.matrix).invert();
		const projectionMatrix = new Matrix4().fromArray(view.projectionMatrix);
		const frustumPlanes = this.buildFrustumPlanes(viewMatrix, projectionMatrix);
		return this.frustumIntersectsBox(frustumPlanes, worldBox);
	}
	shouldShowMeshInViewWithDistance(mesh, cameraPosition, cameraForward, frame, referenceSpace) {
		const meshPose = frame.getPose(mesh.meshSpace, referenceSpace);
		if (!meshPose) return true;
		const meshPosition = new Vector3();
		meshPosition.setFromMatrixPosition(new Matrix4().fromArray(meshPose.transform.matrix));
		const dx = meshPosition.x - cameraPosition.x;
		const dy = meshPosition.y - cameraPosition.y;
		const dz = meshPosition.z - cameraPosition.z;
		const distanceSq = dx * dx + dy * dy + dz * dz;
		const distance = Math.sqrt(distanceSq);
		if (distance > this.kMaxViewDistance) return false;
		if (distance > .001) {
			const invDistance = 1 / distance;
			if (dx * invDistance * cameraForward.x + dy * invDistance * cameraForward.y + dz * invDistance * cameraForward.z < this.kFOVCosThreshold) return false;
		}
		return true;
	}
};
/**
* Base class for sound detector backends.
* Handles the orchestration of normalizing audio, running classifiers and creating results.
*/
var BaseDetectorBackend = class {
	constructor(context) {
		this.context = context;
	}
	/**
	* Calculates debug information for the given audio data.
	* @param audio - The normalized audio data.
	* @returns An object containing RMS, buffer size, and sample rate.
	*/
	populateDebugData(audio) {
		let sumSquares = 0;
		const audioData = audio.data;
		for (let i = 0; i < audioData.length; i++) sumSquares += audioData[i] * audioData[i];
		return {
			rms: Math.sqrt(sumSquares / audioData.length),
			bufferSize: audioData.length,
			sampleRate: this.context.sampleRate
		};
	}
	dispose() {}
};
var FilesetResolver$2;
var AudioClassifier;
async function loadMediaPipeModule$2() {
	if (FilesetResolver$2 && AudioClassifier) return;
	try {
		const mediapipeModule = await __vitePreload(() => import("./audio_bundle-DtoS0YGn.js"), []);
		FilesetResolver$2 = mediapipeModule.FilesetResolver;
		AudioClassifier = mediapipeModule.AudioClassifier;
		console.log("'@mediapipe/tasks-audio' module loaded successfully.");
	} catch (error) {
		console.error("Failed to load MediaPipe module:", error);
		throw error;
	}
}
var MediaPipeDetectorBackend = class extends BaseDetectorBackend {
	constructor(context) {
		super(context);
		this.chunkSamples = 16e3;
		this.accumulatedAudio = [];
		this.audioClassifier = null;
		const mediapipeConfig = this.context.options.sounds.backendConfig.mediapipe;
		this.chunkSamples = mediapipeConfig.chunkSamples;
		this.tryInitializeAudioClassifier();
	}
	async tryInitializeAudioClassifier() {
		if (this.audioClassifier) return;
		await loadMediaPipeModule$2();
		const mediapipeConfig = this.context.options.sounds.backendConfig.mediapipe;
		const audioTasks = await FilesetResolver$2.forAudioTasks(mediapipeConfig.wasmFilesUrl);
		this.audioClassifier = await AudioClassifier.createFromOptions(audioTasks, { baseOptions: { modelAssetPath: mediapipeConfig.modelAssetPath } });
	}
	/**
	* Normalizes audio data received as an ArrayBuffer (containing Int16 samples)
	* into a Float32Array with values in the range [-1.0, 1.0] that the MediaPipe
	* classifier can understand.
	* @param arrayBuffer - The raw audio data buffer.
	* @returns The normalized audio data.
	*/
	normalizeAudio(arrayBuffer) {
		const int16Data = new Int16Array(arrayBuffer);
		const normalizedAudio = new Float32Array(int16Data.length);
		for (let i = 0; i < int16Data.length; i++) normalizedAudio[i] = int16Data[i] / 32768;
		return { data: normalizedAudio };
	}
	classify(audio) {
		if (!this.audioClassifier) return null;
		const audioData = audio.data;
		for (let i = 0; i < audioData.length; i++) this.accumulatedAudio.push(audioData[i]);
		if (this.accumulatedAudio.length >= this.chunkSamples) {
			const chunk = new Float32Array(this.accumulatedAudio.slice(0, this.chunkSamples));
			this.accumulatedAudio = this.accumulatedAudio.slice(this.chunkSamples);
			return {
				items: this.audioClassifier.classify(chunk, this.context.sampleRate),
				debug: this.context.options.sounds.showDebugInfo ? this.populateDebugData({ data: chunk }) : void 0
			};
		}
		return null;
	}
	dispose() {
		this.audioClassifier?.close();
		this.audioClassifier = null;
		this.accumulatedAudio = [];
	}
};
var DEFAULT_SAMPLE_RATE = 44e3;
/**
* Detects and classifies sounds in the user's environment using a specified backend.
* It queries an audio classifier model with the device mic input stream and returns
* classifications over specific time intervals along with confidence scores.
*/
var SoundDetector = class extends Script {
	constructor(..._args) {
		super(..._args);
		this._detectorBackends = /* @__PURE__ */ new Map();
		this._isListening = false;
	}
	static {
		this.dependencies = { options: WorldOptions };
	}
	get isListening() {
		return this._isListening;
	}
	/**
	* Initializes the SoundDetector.
	*/
	async init({ options }) {
		this.options = options;
	}
	/**
	* Starts listening to the default mic input stream.
	*/
	async startListening() {
		if (this._isListening) return;
		if (!this.audioListener) this.audioListener = new AudioListener({
			echoCancellation: true,
			noiseSuppression: true,
			autoGainControl: true
		});
		const sampleRate = this.audioListener?.audioContext?.sampleRate || DEFAULT_SAMPLE_RATE;
		const backend = await this.getOrCreateDetectorBackend(sampleRate);
		try {
			this._isListening = true;
			await this.audioListener.startCapture({ onAudioData: async (buffer) => {
				if (!backend) return;
				const normalizedAudio = backend.normalizeAudio(buffer);
				const audioClassifierResult = backend.classify(normalizedAudio);
				if (audioClassifierResult) this.dispatchEvent({
					type: "soundDetected",
					audioClassifierResult
				});
			} });
			console.log("SoundDetector: Started listening using AudioListener.");
		} catch (error) {
			console.error("SoundDetector: Failed to start audio classification:", error);
			this._isListening = false;
		}
	}
	/**
	* Stops listening and releases resources.
	*/
	stopListening() {
		if (!this._isListening) return;
		this.audioListener?.stopCapture();
		this._isListening = false;
		console.log("SoundDetector: Stopped listening.");
	}
	update(_timestamp, _frame) {}
	dispose() {
		this.stopListening();
		for (const backendPromise of this._detectorBackends.values()) backendPromise.then((backend) => backend.dispose()).catch(() => {});
		this._detectorBackends.clear();
		this.audioListener = void 0;
	}
	getOrCreateDetectorBackend(sampleRate) {
		if (!this.options) throw new Error("SoundDetector: Options not initialized. Call init first.");
		const activeBackend = this.options.sounds.backendConfig.activeBackend;
		let detectorBackendPromise = this._detectorBackends.get(activeBackend);
		if (!detectorBackendPromise) {
			detectorBackendPromise = (async () => {
				switch (activeBackend) {
					case "mediapipe": return new MediaPipeDetectorBackend({
						options: this.options,
						sampleRate
					});
					default: throw new Error(`SoundDetector backend '${activeBackend}' is not supported.`);
				}
			})();
			this._detectorBackends.set(activeBackend, detectorBackendPromise);
		}
		return detectorBackendPromise;
	}
};
/**
* Temporary polyfill until Chrome 148 is rolled out more widely.
* Converts a Temporal.Duration or Temporal.DurationLike to milliseconds.
*/
function durationToMs(duration) {
	if (typeof Temporal !== "undefined") return Temporal.Duration.from(duration).total({ unit: "millisecond" });
	if (typeof duration === "string") return 0;
	let ms = 0;
	if (duration.milliseconds) ms += duration.milliseconds;
	if (duration.seconds) ms += duration.seconds * 1e3;
	if (duration.minutes) ms += duration.minutes * 60 * 1e3;
	if (duration.hours) ms += duration.hours * 60 * 60 * 1e3;
	if (duration.days) ms += duration.days * 24 * 60 * 60 * 1e3;
	if (duration.weeks) ms += duration.weeks * 7 * 24 * 60 * 60 * 1e3;
	if (duration.months) ms += duration.months * 30 * 24 * 60 * 60 * 1e3;
	if (duration.years) ms += duration.years * 365 * 24 * 60 * 60 * 1e3;
	if (duration.microseconds) ms += duration.microseconds / 1e3;
	if (duration.nanoseconds) ms += duration.nanoseconds / 1e6;
	return ms;
}
/**
* Places an object onto a suitable horizontal plane in the environment.
* It prioritizes planes in front of the user, prefers tables/elevated surfaces over floors,
* and ensures the object does not intersect other existing objects or other planes in the scene.
* If placement fails in the current frame, it continues retrying frame-by-frame until the timeout is reached.
*
* ### Algorithm Details:
* 1. **Filter Horizontal Surfaces**: Fetches all planes and filters for horizontal surfaces, completely skipping
*    any upside-down planes (whose normal y-component points downwards).
* 2. **Obstacle Gathering**: Traverses the active Three.js scene to identify visible collidable meshes, including
*    all other detected plane meshes (excluding the placement plane itself) and excluding user rigs/helpers.
* 3. **User-Centric Grid Sampling**: For each horizontal plane, projects the user's position onto the plane, restricts
*    the sampling range to a 3.0-meter radius bounding box centered around this projection, and grid-samples coordinates
*    strictly within the plane's polygon boundaries.
* 4. **Priority Scoring**: Assigns scores to sampled candidates, prioritizing elevated surfaces (tables over floors)
*    located comfortably in front of the user (0.4m to 3.0m range, pointing in camera look direction).
* 5. **Validation & Collision Check**: Evaluates candidates in descending score order, temporarily positioning and orienting
*    the object upright on the plane normal facing the user. Validates placement against the bounds of collidable obstacles.
* 6. **Frame Yielding & Retry**: If no candidates succeed in the current frame, yields to the next frame via `waitFrame`
*    and repeats the process until a clean spot is found or the timeout is reached.
*
* @param objectToPlace - The Three.js Object3D to place.
* @param camera - The current active camera (to evaluate user position and look direction).
* @param scene - The active scene containing all collidable obstacles.
* @param planes - The PlaneDetector instance providing detected real-world planes.
* @param meshes - The MeshDetector instance providing environmental mesh obstacles.
* @param waitFrame - The WaitFrame component to yield execution between frames.
* @param timeout - Timeout duration as a Temporal.Duration or Temporal.DurationLike object (defaults to 500ms).
* @param gridSteps - Number of steps along each axis for grid sampling candidate positions (defaults to 10).
* @returns A promise resolving to true if successfully placed, false otherwise.
*/
async function placeOnHorizontalSurface(objectToPlace, camera, scene, planes, meshes, waitFrame, timer, timeout, gridSteps) {
	const timeoutSeconds = durationToMs(timeout) / 1e3;
	const startElapsed = timer.getElapsed();
	while (true) {
		if (timer.getElapsed() - startElapsed >= timeoutSeconds) return false;
		if (!planes) {
			await waitFrame.waitFrame();
			continue;
		}
		const horizontalPlanes = planes.get().filter((plane) => {
			const orientation = (plane.orientation || "").toLowerCase();
			const label = (plane.label || "").toLowerCase();
			if (new Vector3(0, 1, 0).applyQuaternion(plane.quaternion).normalize().y < 0) return false;
			return orientation === "horizontal" || label === "floor" || label === "table" || label === "desk" || label === "counter" || label === "horizontal";
		});
		if (horizontalPlanes.length === 0) {
			await waitFrame.waitFrame();
			continue;
		}
		const collidableObjects = [];
		scene.traverse((child) => {
			if (!child.visible) return;
			if (child === objectToPlace || isDescendantOf(child, objectToPlace)) return;
			if (child === planes) return;
			if (meshes && isDescendantOf(child, meshes)) return;
			if (child === camera || child === scene) return;
			if (child.name && (child.name.includes("controller") || child.name.includes("reticle") || child.name.includes("helper"))) return;
			if (child.isMesh) collidableObjects.push(child);
		});
		const candidates = [];
		const cameraPos = camera.getWorldPosition(new Vector3());
		const cameraForward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
		for (const plane of horizontalPlanes) {
			const polygon = getLocalPolygon(plane);
			if (polygon.length === 0) continue;
			const localCameraPos = plane.worldToLocal(cameraPos.clone());
			const localProjected = new Vector2(localCameraPos.x, localCameraPos.z);
			const polygonMinX = Math.min(...polygon.map((p) => p.x));
			const polygonMaxX = Math.max(...polygon.map((p) => p.x));
			const polygonMinY = Math.min(...polygon.map((p) => p.y));
			const polygonMaxY = Math.max(...polygon.map((p) => p.y));
			const searchRadius = 3;
			const minX = Math.max(polygonMinX, localProjected.x - searchRadius);
			const maxX = Math.min(polygonMaxX, localProjected.x + searchRadius);
			const minY = Math.max(polygonMinY, localProjected.y - searchRadius);
			const maxY = Math.min(polygonMaxY, localProjected.y + searchRadius);
			if (minX >= maxX || minY >= maxY) continue;
			const localPoints = [];
			if (isPointInPolygon(localProjected, polygon)) localPoints.push(localProjected);
			const center = new Vector2((polygonMinX + polygonMaxX) / 2, (polygonMinY + polygonMaxY) / 2);
			if (center.x >= minX && center.x <= maxX && center.y >= minY && center.y <= maxY) {
				if (isPointInPolygon(center, polygon)) localPoints.push(center);
			}
			for (let i = 0; i < gridSteps; i++) {
				const x = minX + i / (gridSteps - 1) * (maxX - minX);
				for (let j = 0; j < gridSteps; j++) {
					const z = minY + j / (gridSteps - 1) * (maxY - minY);
					const candidatePt = new Vector2(x, z);
					if (isPointInPolygon(candidatePt, polygon)) localPoints.push(candidatePt);
				}
			}
			for (const localPt of localPoints) {
				const localVec = new Vector3(localPt.x, 0, localPt.y);
				const worldPt = plane.localToWorld(localVec);
				const label = (plane.label || "").toLowerCase();
				let semanticScore = 50;
				if (label === "table" || label === "desk" || label === "counter") semanticScore = 100;
				else if (label === "floor") semanticScore = 0;
				const heightDiff = worldPt.y - cameraPos.y;
				let heightScore = worldPt.y * 20;
				if (heightDiff > 0) heightScore -= heightDiff * 100;
				const toPoint = worldPt.clone().sub(cameraPos);
				const distance = toPoint.length();
				if (distance < .4 || distance > 3) continue;
				const alignment = toPoint.normalize().dot(cameraForward);
				let alignmentScore = -1e3;
				if (alignment >= 0) alignmentScore = alignment * 50;
				const distancePenalty = -Math.abs(distance - 1.5) * 10;
				const score = semanticScore + heightScore + alignmentScore + distancePenalty;
				candidates.push({
					plane,
					point: worldPt,
					score
				});
			}
		}
		candidates.sort((a, b) => b.score - a.score);
		let placed = false;
		const origPosition = objectToPlace.position.clone();
		const origQuaternion = objectToPlace.quaternion.clone();
		const obstacleBox = new Box3();
		let obstacleBounds;
		for (const cand of candidates) {
			if (timer.getElapsed() - startElapsed >= timeoutSeconds) break;
			objectToPlace.position.set(0, 0, 0);
			const planeNormal = new Vector3(0, 1, 0).applyQuaternion(cand.plane.quaternion).normalize();
			const forwardVector = cameraPos.clone().sub(cand.point);
			forwardVector.projectOnPlane(planeNormal).normalize();
			const rightVector = new Vector3().crossVectors(planeNormal, forwardVector).normalize();
			const rotationMatrix = new Matrix4().makeBasis(rightVector, planeNormal, forwardVector);
			objectToPlace.quaternion.setFromRotationMatrix(rotationMatrix);
			objectToPlace.updateMatrixWorld(true);
			const tempBox = getObjectBoundingBox(objectToPlace);
			if (!hasFiniteBounds(tempBox)) continue;
			const bottomOffset = -tempBox.min.y;
			objectToPlace.position.copy(cand.point);
			objectToPlace.position.y += bottomOffset;
			objectToPlace.updateMatrixWorld(true);
			const objectBox = getObjectBoundingBox(objectToPlace);
			if (!hasFiniteBounds(objectBox)) continue;
			const collisionBox = objectBox.clone();
			let collision = false;
			for (const obstacle of collidableObjects) {
				if (obstacle === cand.plane) continue;
				let bounds = obstacleBounds?.get(obstacle);
				if (!bounds) {
					obstacle.updateMatrixWorld(true);
					bounds = obstacleBox.setFromObject(obstacle);
					if (obstacleBounds && !isDescendantOf(objectToPlace, obstacle)) {
						bounds = bounds.clone();
						obstacleBounds.set(obstacle, bounds);
					}
				}
				if (collisionBox.intersectsBox(bounds)) {
					collision = true;
					break;
				}
			}
			if (!collision) {
				placed = true;
				break;
			}
			obstacleBounds ??= /* @__PURE__ */ new Map();
		}
		if (placed) return true;
		objectToPlace.position.copy(origPosition);
		objectToPlace.quaternion.copy(origQuaternion);
		await waitFrame.waitFrame();
	}
}
function getLocalPolygon(plane) {
	if (plane.simulatorPlane) return plane.simulatorPlane.polygon;
	else if (plane.xrPlane) return plane.xrPlane.polygon.map((p) => new Vector2(p.x, p.z));
	return [];
}
function isPointInPolygon(point, polygon) {
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const xi = polygon[i].x, yi = polygon[i].y;
		const xj = polygon[j].x, yj = polygon[j].y;
		if (yi > point.y !== yj > point.y && point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}
function isDescendantOf(child, parent) {
	let current = child.parent;
	while (current) {
		if (current === parent) return true;
		current = current.parent;
	}
	return false;
}
function getObjectBoundingBox(object) {
	const box = new Box3();
	function traverse(node) {
		if (!node.visible || node.userData.xrblocksPrivate === true) return;
		const boundedObject = node;
		if (boundedObject.boundingBox === null) boundedObject.computeBoundingBox?.();
		if (boundedObject.boundingBox) {
			const tempBox = boundedObject.boundingBox.clone();
			tempBox.applyMatrix4(node.matrixWorld);
			box.union(tempBox);
		} else {
			const mesh = node;
			if (mesh.geometry) {
				if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
				const tempBox = mesh.geometry.boundingBox.clone();
				tempBox.applyMatrix4(mesh.matrixWorld);
				box.union(tempBox);
			}
		}
		for (const child of node.children) traverse(child);
	}
	object.updateMatrixWorld(true);
	traverse(object);
	return box;
}
function hasFiniteBounds(box) {
	return !box.isEmpty() && Number.isFinite(box.min.x) && Number.isFinite(box.min.y) && Number.isFinite(box.min.z) && Number.isFinite(box.max.x) && Number.isFinite(box.max.y) && Number.isFinite(box.max.z);
}
/**
* Names of key human body joints and anatomical landmarks.
* Includes standard MediaPipe pose landmarks and composite landmarks for
* skeletal animation compatibility (e.g., Hips, Spine, Chest, Neck, Head).
*/
var PoseJointName = /* @__PURE__ */ function(PoseJointName) {
	PoseJointName["Nose"] = "nose";
	PoseJointName["LeftEye"] = "leftEye";
	PoseJointName["RightEye"] = "rightEye";
	PoseJointName["LeftEar"] = "leftEar";
	PoseJointName["RightEar"] = "rightEar";
	PoseJointName["LeftShoulder"] = "leftShoulder";
	PoseJointName["RightShoulder"] = "rightShoulder";
	PoseJointName["LeftElbow"] = "leftElbow";
	PoseJointName["RightElbow"] = "rightElbow";
	PoseJointName["LeftWrist"] = "leftWrist";
	PoseJointName["RightWrist"] = "rightWrist";
	PoseJointName["LeftHip"] = "leftHip";
	PoseJointName["RightHip"] = "rightHip";
	PoseJointName["LeftKnee"] = "leftKnee";
	PoseJointName["RightKnee"] = "rightKnee";
	PoseJointName["LeftAnkle"] = "leftAnkle";
	PoseJointName["RightAnkle"] = "rightAnkle";
	PoseJointName["LeftFoot"] = "leftFoot";
	PoseJointName["RightFoot"] = "rightFoot";
	PoseJointName["Hips"] = "hips";
	PoseJointName["Spine"] = "spine";
	PoseJointName["Chest"] = "chest";
	PoseJointName["Neck"] = "neck";
	PoseJointName["Head"] = "head";
	return PoseJointName;
}({});
/**
* Represents a single human body pose detected in physical space.
* Inherits from `THREE.Object3D` to fit naturally into the Three.js scene graph,
* positioning itself at the estimated hips/center of the tracked human.
*/
var DetectedBodyPose = class extends Object3D {
	/**
	* Creates an instance of DetectedBodyPose.
	*
	* @param poseId - A unique tracking identifier for this body pose.
	* @param landmarks - The list of raw and 3D-projected anatomical landmarks.
	* @param detection2DBoundingBox - The 2D bounding box of the person in normalized screen space.
	*/
	constructor(poseId, landmarks, detection2DBoundingBox) {
		super();
		this.poseId = poseId;
		this.landmarks = landmarks;
		this.detection2DBoundingBox = detection2DBoundingBox;
		const hipsPos = this.getJointPosition("hips");
		if (hipsPos) this.position.copy(hipsPos);
	}
	/**
	* Returns the 3D world space position of a specific joint/landmark in meters.
	* Exposes both standard MediaPipe landmark mappings and composite VRM/humanoid landmarks.
	*
	* The pose model always returns all landmarks, including ones it could not
	* actually see, so a body that is only half in frame still reports legs. Pass
	* `minVisibility` to drop those guesses instead of drawing them.
	*
	* @param name - The name of the joint (standard or composite).
	* @param options - Set `minVisibility` to reject landmarks the model is not
	*   confident about. Defaults to 0, which keeps every landmark.
	* @returns A clone of the 3D world space position vector, or `null` if the joint is undetected, unprojected, or below `minVisibility`.
	*/
	getJointPosition(name, { minVisibility = 0 } = {}) {
		const getMPWorldPos = (index) => {
			const lm = this.landmarks[index];
			if (!lm || !lm.worldPosition) return null;
			if (minVisibility > 0 && (lm.visibility ?? 0) < minVisibility) return null;
			return lm.worldPosition.clone();
		};
		switch (name) {
			case "nose": return getMPWorldPos(0);
			case "leftEye": return getMPWorldPos(2);
			case "rightEye": return getMPWorldPos(5);
			case "leftEar": return getMPWorldPos(7);
			case "rightEar": return getMPWorldPos(8);
			case "leftShoulder": return getMPWorldPos(11);
			case "rightShoulder": return getMPWorldPos(12);
			case "leftElbow": return getMPWorldPos(13);
			case "rightElbow": return getMPWorldPos(14);
			case "leftWrist": return getMPWorldPos(15);
			case "rightWrist": return getMPWorldPos(16);
			case "leftHip": return getMPWorldPos(23);
			case "rightHip": return getMPWorldPos(24);
			case "leftKnee": return getMPWorldPos(25);
			case "rightKnee": return getMPWorldPos(26);
			case "leftAnkle": return getMPWorldPos(27);
			case "rightAnkle": return getMPWorldPos(28);
			case "leftFoot": return getMPWorldPos(31);
			case "rightFoot": return getMPWorldPos(32);
			case "hips": {
				const lHip = getMPWorldPos(23);
				const rHip = getMPWorldPos(24);
				if (lHip && rHip) return new Vector3().addVectors(lHip, rHip).multiplyScalar(.5);
				return lHip || rHip || null;
			}
			case "spine": {
				const hips = this.getJointPosition("hips", { minVisibility });
				const chest = this.getJointPosition("chest", { minVisibility });
				if (hips && chest) return new Vector3().addVectors(hips, chest).multiplyScalar(.5);
				return hips || chest || null;
			}
			case "chest": {
				const lShoulder = getMPWorldPos(11);
				const rShoulder = getMPWorldPos(12);
				if (lShoulder && rShoulder) return new Vector3().addVectors(lShoulder, rShoulder).multiplyScalar(.5);
				return lShoulder || rShoulder || null;
			}
			case "neck": {
				const chest = this.getJointPosition("chest", { minVisibility });
				const nose = getMPWorldPos(0);
				if (chest && nose) return new Vector3().addVectors(chest, nose).multiplyScalar(.5);
				return chest || nose || null;
			}
			case "head": {
				const nose = getMPWorldPos(0);
				const lEar = getMPWorldPos(7);
				const rEar = getMPWorldPos(8);
				if (nose && lEar && rEar) {
					const midEar = new Vector3().addVectors(lEar, rEar).multiplyScalar(.5);
					return new Vector3().addVectors(nose, midEar).multiplyScalar(.5);
				}
				return nose || lEar || rEar || null;
			}
		}
		return null;
	}
};
/**
* Abstract base class for all human pose detection backends (e.g., MediaPipe).
*
* Implements a Template Method pattern via `run()`, which orchestrates the
* detection pipeline by checking availability, acquiring a camera snapshot,
* and calling the abstract `detect()` hook implemented by specific backends.
*/
var BaseHumanBackend = class {
	/**
	* Creates an instance of BaseHumanBackend.
	* @param context - The shared dependency and configuration context.
	*/
	constructor(context) {
		this.context = context;
	}
	/**
	* The orchestration pipeline (Template Method) for running human detection.
	* Checks backend availability and obtains a camera snapshot before running the concrete detection model.
	*
	* @param depthMeshSnapshot - The current 3D depth mesh snapshot of the physical environment.
	* @param cameraParametersSnapshot - The current camera parameters and matrix transforms.
	* @returns A promise that resolves to an array of detected body poses.
	*/
	async run(depthMeshSnapshot, cameraParametersSnapshot) {
		if (!await this.isAvailable()) return [];
		const snapshot = await this.getSnapshot();
		if (!snapshot) return [];
		return this.detect(snapshot, depthMeshSnapshot, cameraParametersSnapshot);
	}
	dispose() {}
};
/**
* CDN module the worker dynamic-imports for MediaPipe. Workers cannot see the
* host page's importmap, so they need an absolute URL. Bump this in lockstep
* with the importmap entries in the demos that use MediaPipe.
*/
var MEDIAPIPE_MODULE_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs";
var MEDIA_PIPE_VISION_WORKER_SOURCE = `
let task = null;

async function init(config) {
  const mod = await import(config.mediapipeModuleUrl);
  const { FilesetResolver } = mod;
  const TaskClass = mod[config.taskName];
  if (!TaskClass) {
    throw new Error('unknown MediaPipe task: ' + config.taskName);
  }
  const vision = await FilesetResolver.forVisionTasks(config.wasmFilesUrl);
  task = await TaskClass.createFromOptions(vision, config.taskOptions);
}

self.onmessage = async (event) => {
  const { id, type } = event.data;
  try {
    if (type === 'init') {
      await init(event.data.config);
      self.postMessage({ id, ok: true });
    } else if (type === 'detect') {
      if (!task) throw new Error('worker not initialized');
      const bitmap = event.data.imageBitmap;
      const result = task.detect(bitmap);
      bitmap.close();
      self.postMessage({ id, ok: true, result });
    } else {
      throw new Error('unknown message type: ' + type);
    }
  } catch (err) {
    self.postMessage({
      id,
      ok: false,
      error: (err && err.message) || String(err),
    });
  }
};
`;
/**
* Runs a single MediaPipe vision task in a dedicated web worker.
*
* Results are whatever the task's `detect()` returns, as a structured-clonable
* object. Callers cast to the matching MediaPipe result type and do their own
* post-processing on the main thread, since that work usually needs the live
* depth mesh and camera matrices.
*/
var MediaPipeVisionWorkerClient = class MediaPipeVisionWorkerClient {
	/**
	* @param label - Name used in error messages, e.g. `MediaPipeFaceBackend`.
	*/
	constructor(label) {
		this.label = label;
		this.worker = null;
		this.workerUrl = null;
		this.nextRequestId = 0;
		this.pendingRequests = /* @__PURE__ */ new Map();
	}
	/** Whether this environment can host the worker at all. */
	static isSupported() {
		return typeof Worker !== "undefined" && typeof Blob !== "undefined";
	}
	/**
	* Spawns the worker and loads the model. Resolves once the task is ready.
	*
	* @param config - Module URLs and task options for the worker.
	*/
	async init(config) {
		if (this.worker) return;
		if (!MediaPipeVisionWorkerClient.isSupported()) throw new Error("Web Workers are not available in this environment");
		const blob = new Blob([MEDIA_PIPE_VISION_WORKER_SOURCE], { type: "text/javascript" });
		this.workerUrl = URL.createObjectURL(blob);
		this.worker = new Worker(this.workerUrl);
		this.worker.onmessage = (event) => {
			const { id } = event.data;
			const pending = this.pendingRequests.get(id);
			if (!pending) return;
			this.pendingRequests.delete(id);
			if (event.data.ok) pending.resolve(event.data);
			else pending.reject(new Error(event.data.error || "worker error"));
		};
		this.worker.onerror = (event) => {
			console.error(`${this.label} worker errored:`, event.message);
		};
		await this.send({
			type: "init",
			config
		});
	}
	/**
	* Runs one detection pass.
	*
	* The snapshot is converted to an `ImageBitmap` so its pixel buffer can be
	* transferred rather than copied; `ImageData` is structured-clonable but
	* that means a full copy on every frame.
	*
	* @param imageData - Camera snapshot to run the task over.
	* @returns The raw task result, or null when the pass could not run.
	*/
	async detect(imageData) {
		if (!this.worker) return null;
		let bitmap;
		try {
			bitmap = await createImageBitmap(imageData);
		} catch (error) {
			console.error(`${this.label}: failed to create ImageBitmap:`, error);
			return null;
		}
		try {
			return (await this.send({
				type: "detect",
				imageBitmap: bitmap
			}, [bitmap])).result ?? null;
		} catch (error) {
			console.error(`${this.label}: worker detection failed:`, error);
			return null;
		}
	}
	/**
	* Terminates the worker and revokes its Blob URL. Safe to call repeatedly.
	*/
	dispose() {
		if (this.worker) {
			this.worker.terminate();
			this.worker = null;
		}
		if (this.workerUrl) {
			URL.revokeObjectURL(this.workerUrl);
			this.workerUrl = null;
		}
		for (const { reject } of this.pendingRequests.values()) reject(/* @__PURE__ */ new Error(`${this.label} disposed`));
		this.pendingRequests.clear();
	}
	/**
	* Promise-wraps one request/response round trip. The worker echoes the
	* request id back so overlapping calls stay correlated.
	*/
	send(payload, transfer = []) {
		const worker = this.worker;
		if (!worker) return Promise.reject(/* @__PURE__ */ new Error("worker not spawned"));
		const id = this.nextRequestId++;
		return new Promise((resolve, reject) => {
			this.pendingRequests.set(id, {
				resolve,
				reject
			});
			worker.postMessage({
				id,
				...payload
			}, transfer);
		});
	}
};
var FilesetResolver$1;
var PoseLandmarker;
async function loadMediaPipeModule$1() {
	if (FilesetResolver$1 && PoseLandmarker) return;
	try {
		const mediapipeModule = await __vitePreload(() => import("./vision_bundle-DJ7uGc4o.js"), []);
		FilesetResolver$1 = mediapipeModule.FilesetResolver;
		PoseLandmarker = mediapipeModule.PoseLandmarker;
		console.log("'@mediapipe/tasks-vision' MediaPipe Pose Module loaded successfully.");
	} catch (error) {
		console.error("Failed to load MediaPipe Tasks Vision module:", error);
		throw error;
	}
}
/** Where the metric skeleton is placed when depth projection is off. */
var METRIC_SKELETON_DISTANCE_METRES = 2;
var cameraPosition = new Vector3();
var cameraRight = new Vector3();
var cameraUp = new Vector3();
var cameraForward = new Vector3();
/**
* Places a MediaPipe world landmark in front of the viewer, preserving the
* body's real proportions.
*
* World landmarks are metres from the centre of the hips, with x toward the
* person's right, y downward and z toward the camera. Screen landmarks cannot
* be used for this: they depend on camera intrinsics, and joints outside the
* frame are extrapolated, so a half-visible body produces legs that shoot off
* into the distance.
*
* x is deliberately not negated, which makes the skeleton behave like a mirror:
* raise your right hand and the skeleton's hand rises on the same side of the
* screen.
*
* @param metric - Metric landmark from MediaPipe, in metres.
* @param worldFromView - Camera pose.
* @param target - Vector to write the result into.
* @returns The world position for the landmark.
*/
function placeMetricLandmark(metric, worldFromView, target) {
	cameraPosition.setFromMatrixPosition(worldFromView);
	cameraRight.setFromMatrixColumn(worldFromView, 0).normalize();
	cameraUp.setFromMatrixColumn(worldFromView, 1).normalize();
	cameraForward.setFromMatrixColumn(worldFromView, 2).normalize().negate();
	return target.copy(cameraPosition).addScaledVector(cameraForward, METRIC_SKELETON_DISTANCE_METRES + (metric.z || 0)).addScaledVector(cameraRight, metric.x || 0).addScaledVector(cameraUp, -(metric.y || 0));
}
/**
* Convert a raw MediaPipe `PoseLandmarkerResult` into `DetectedBodyPose`
* objects with world-space joint positions.
*
* Extracted as a free function so unit tests can drive it directly without
* standing up the full backend lifecycle, and because this work has to stay on
* the render thread: it reads the live depth mesh and camera matrices.
*
* For each landmark a depth-mesh raycast (`transformRgbUvToWorld`) is tried
* first; when the ray misses, the point is back-projected through the camera
* frustum and placed ~1.5 m out, modulated by the landmark's relative z.
*
* Pass `useDepthProjection: false` when the detected person is not part of the
* depth scene, such as a webcam feed on the desktop simulator. Every ray would
* otherwise hit the surrounding geometry and stretch the skeleton across it.
*
* @param result - Raw result from the MediaPipe pose task.
* @param depthMeshSnapshot - Depth mesh to raycast against.
* @param cameraParametersSnapshot - Camera matrices for back-projection.
* @param options - Projection behaviour.
* @returns One `DetectedBodyPose` per person in the result.
*/
function processPoseLandmarkerResult(result, depthMeshSnapshot, cameraParametersSnapshot, { useDepthProjection = true } = {}) {
	const detectedPoses = [];
	for (let i = 0; i < result.landmarks.length; i++) {
		const mpLandmarks = result.landmarks[i];
		const mpWorldLandmarks = result.worldLandmarks?.[i] || [];
		const landmarks = [];
		let xmin = 1;
		let ymin = 1;
		let xmax = 0;
		let ymax = 0;
		for (let j = 0; j < mpLandmarks.length; j++) {
			const lm = mpLandmarks[j];
			const wLm = mpWorldLandmarks[j];
			xmin = Math.min(xmin, lm.x);
			ymin = Math.min(ymin, lm.y);
			xmax = Math.max(xmax, lm.x);
			ymax = Math.max(ymax, lm.y);
			const uv = new Vector2(lm.x, lm.y);
			const worldCoords = useDepthProjection ? transformRgbUvToWorld(uv, depthMeshSnapshot, cameraParametersSnapshot) : null;
			let wp;
			if (worldCoords) wp = worldCoords.worldPosition;
			else if (!useDepthProjection && wLm) wp = placeMetricLandmark(wLm, cameraParametersSnapshot.worldFromView, new Vector3());
			else {
				const origin = new Vector3().applyMatrix4(cameraParametersSnapshot.worldFromView);
				const direction = new Vector3(2 * lm.x - 1, 2 * (1 - lm.y) - 1, -1).applyMatrix4(cameraParametersSnapshot.worldFromClip).sub(origin).normalize();
				wp = origin.addScaledVector(direction, 1.5 + (lm.z || 0));
			}
			landmarks.push({
				x: lm.x,
				y: lm.y,
				z: wLm ? wLm.z : lm.z,
				visibility: lm.visibility,
				worldPosition: wp,
				metricPosition: wLm ? new Vector3(wLm.x, wLm.y, wLm.z) : void 0
			});
		}
		const boundingBox = new Box2(new Vector2(xmin, ymin), new Vector2(xmax, ymax));
		const bodyPose = new DetectedBodyPose(i, landmarks, boundingBox);
		detectedPoses.push(bodyPose);
	}
	return detectedPoses;
}
/**
* Human Pose detector backend implementation using MediaPipe's Pose Landmark
* Detector. Runs locally on the device.
*
* Inference is offloaded to a web worker by default so a detection pass does
* not stall the render loop. The worker has to use the CPU delegate, because
* MediaPipe's wasm pipeline only creates a GPU surface when it finds a real
* DOM canvas. Apps that would rather have GPU inference and can absorb the
* main-thread stall can set `useWorker: false`; that is also the automatic
* fallback when the environment has no `Worker` or the worker fails to start.
*/
var MediaPipeHumanBackend = class extends BaseHumanBackend {
	constructor(context) {
		super(context);
		this.client = null;
		this.poseLandmarker = null;
		this.initializationPromise = this.tryInitializePoseLandmarker();
	}
	async isAvailable() {
		try {
			await this.initializationPromise;
			return true;
		} catch (e) {
			console.error("MediaPipe Pose Landmarker is not available:", e);
			return false;
		}
	}
	async getSnapshot() {
		const imageData = await this.context.deviceCamera.getSnapshot({ outputFormat: "imageData" });
		if (!imageData) return null;
		return { imageData };
	}
	async detect(snapshot, depthMeshSnapshot, cameraParametersSnapshot) {
		await this.initializationPromise;
		const result = this.client ? await this.client.detect(snapshot.imageData) : this.detectOnMainThread(snapshot.imageData);
		if (!result || !result.landmarks || result.landmarks.length === 0) return [];
		return processPoseLandmarkerResult(result, depthMeshSnapshot, cameraParametersSnapshot, { useDepthProjection: this.context.options.humans.useDepthProjection !== false });
	}
	detectOnMainThread(imageData) {
		if (!this.poseLandmarker) return null;
		try {
			return this.poseLandmarker.detect(imageData);
		} catch (error) {
			console.error("MediaPipe Pose detection run failed:", error);
			return null;
		}
	}
	async tryInitializePoseLandmarker() {
		if (this.context.options.humans.backendConfig.mediapipe.useWorker && MediaPipeVisionWorkerClient.isSupported() && await this.tryInitializeWorker()) return;
		await this.initializeOnMainThread();
	}
	/**
	* @returns True when the worker is up and ready to serve detections.
	*/
	async tryInitializeWorker() {
		const humansOptions = this.context.options.humans.backendConfig.mediapipe;
		const client = new MediaPipeVisionWorkerClient("MediaPipeHumanBackend");
		try {
			await client.init({
				mediapipeModuleUrl: MEDIAPIPE_MODULE_URL,
				wasmFilesUrl: humansOptions.wasmFilesUrl,
				taskName: "PoseLandmarker",
				taskOptions: {
					baseOptions: {
						modelAssetPath: humansOptions.modelAssetPath,
						delegate: "CPU"
					},
					runningMode: "IMAGE",
					numPoses: humansOptions.numPoses,
					minPoseDetectionConfidence: humansOptions.minPoseDetectionConfidence,
					minPosePresenceConfidence: humansOptions.minPosePresenceConfidence,
					minTrackingConfidence: humansOptions.minTrackingConfidence
				}
			});
			this.client = client;
			return true;
		} catch (error) {
			console.warn("MediaPipe pose worker failed to start, falling back to main-thread inference:", error);
			client.dispose();
			return false;
		}
	}
	async initializeOnMainThread() {
		if (this.poseLandmarker) return;
		await loadMediaPipeModule$1();
		const humansOptions = this.context.options.humans.backendConfig.mediapipe;
		const vision = await FilesetResolver$1.forVisionTasks(humansOptions.wasmFilesUrl);
		this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
			baseOptions: {
				modelAssetPath: humansOptions.modelAssetPath,
				delegate: "GPU"
			},
			runningMode: "IMAGE",
			numPoses: humansOptions.numPoses,
			minPoseDetectionConfidence: humansOptions.minPoseDetectionConfidence,
			minPosePresenceConfidence: humansOptions.minPosePresenceConfidence,
			minTrackingConfidence: humansOptions.minTrackingConfidence
		});
	}
	dispose() {
		this.client?.dispose();
		this.client = null;
		this.poseLandmarker?.close();
		this.poseLandmarker = null;
	}
};
/**
* A detector script that orchestrates human body pose estimation.
* Manages the backend pose detector lifecycle (e.g., MediaPipe) and exposes the detected
* poses, including 3D joint landmarks, in the world coordinate space.
*/
var HumanRecognizer = class extends Script {
	constructor(..._args) {
		super(..._args);
		this.detectorBackends = /* @__PURE__ */ new Map();
		this.activeClients = /* @__PURE__ */ new Set();
		this.currentDetectionPromise = null;
		this.lastContinuousDetectionStartedAtMs = -Infinity;
		this.disposed = false;
		this.poses = [];
		this.targetDevice = "galaxyxr";
	}
	static {
		this.dependencies = {
			options: WorldOptions,
			deviceCamera: XRDeviceCamera,
			depth: Depth,
			camera: Camera,
			rendererHolder: RendererHolder
		};
	}
	init({ options, deviceCamera, depth, camera, rendererHolder }) {
		this.options = options;
		this.deviceCamera = deviceCamera;
		this.depth = depth;
		this.camera = camera;
		this.renderer = rendererHolder.renderer;
		this.disposed = false;
	}
	/**
	* Starts continuous pose detection for the given client.
	* If this is the first client, starts the background detection loop.
	* @param client - The client object requesting pose detection.
	*/
	start(client) {
		if (this.activeClients.has(client)) return;
		this.activeClients.add(client);
		if (this.activeClients.size === 1) this.runContinuousDetection();
	}
	/**
	* Stops continuous pose detection for the given client.
	* If this was the last client, stops the background detection loop.
	* @param client - The client object that no longer needs pose detection.
	*/
	stop(client) {
		this.activeClients.delete(client);
	}
	/**
	* Called per frame by the engine. If there are active clients,
	* ensures the continuous pose detection is running.
	*/
	update() {
		if (this.activeClients.size === 0 || this.currentDetectionPromise) return;
		const pollingIntervalMs = this.options.humans.pollingIntervalMs;
		if (pollingIntervalMs > 0 && performance.now() - this.lastContinuousDetectionStartedAtMs < pollingIntervalMs) return;
		this.runContinuousDetection();
	}
	runContinuousDetection() {
		if (this.currentDetectionPromise) return;
		this.lastContinuousDetectionStartedAtMs = performance.now();
		this.currentDetectionPromise = this.runDetectionInternal().then((results) => {
			if (!this.disposed) this.poses = results;
			return results;
		}).finally(() => {
			this.currentDetectionPromise = null;
		});
	}
	/**
	* Runs a pose detection or returns the ongoing detection promise.
	*
	* - If continuous detection is started (has active clients), returns the promise
	*   for the next detection result.
	* - If continuous detection is not started, performs a one-off detection and
	*   returns the result. If a one-off detection is already in progress, returns
	*   the promise for that ongoing detection.
	*
	* @returns A promise resolving to the next body pose detection result.
	*/
	runDetection() {
		if (this.currentDetectionPromise) return this.currentDetectionPromise;
		if (this.activeClients.size > 0) {
			this.runContinuousDetection();
			return this.currentDetectionPromise;
		}
		this.currentDetectionPromise = this.runDetectionInternal().finally(() => {
			this.currentDetectionPromise = null;
		});
		return this.currentDetectionPromise;
	}
	async runDetectionInternal() {
		this.clear();
		if (!this.depth || !this.depth.depthMesh) {
			console.warn("Cannot run Human Detection: Depth module / depthMesh is not enabled or initialized.");
			return [];
		}
		const cameraParametersSnapshot = getCameraParametersSnapshot(this.camera, this.renderer.xr.getCamera(), this.deviceCamera, this.targetDevice);
		if (!cameraParametersSnapshot) return [];
		const context = this.getBackendContext();
		const activeBackend = this.options.humans.backendConfig.activeBackend;
		const backendPromise = this.getOrCreateBackend(activeBackend, context);
		let backend;
		try {
			backend = await backendPromise;
		} catch (error) {
			console.warn(`Failed to load or initialize HumanRecognizer backend '${activeBackend}':`, error);
			return [];
		}
		if (this.disposed) return [];
		const depthMeshSnapshot = this.getDepthMeshSnapshot();
		try {
			const bodyPoses = await backend.run(depthMeshSnapshot, cameraParametersSnapshot);
			return this.disposed ? [] : bodyPoses;
		} finally {
			this.disposeDepthMeshSnapshot(depthMeshSnapshot);
		}
	}
	getBackendContext() {
		return {
			options: this.options,
			deviceCamera: this.deviceCamera
		};
	}
	getOrCreateBackend(activeBackend, context) {
		let backendPromise = this.detectorBackends.get(activeBackend);
		if (!backendPromise) {
			backendPromise = (async () => {
				switch (activeBackend) {
					case "mediapipe": return new MediaPipeHumanBackend(context);
					default: throw new Error(`HumanRecognizer backend '${activeBackend}' is not supported.`);
				}
			})();
			this.detectorBackends.set(activeBackend, backendPromise);
		}
		return backendPromise;
	}
	getDepthMeshSnapshot() {
		const depthMesh = this.depth.depthMesh;
		const clonedGeometry = (this.depth.options.depthMesh.updateFullResolutionGeometry ? depthMesh.geometry : depthMesh.downsampledGeometry || depthMesh.geometry).clone();
		clonedGeometry.computeBoundingSphere();
		clonedGeometry.computeBoundingBox();
		const depthMeshSnapshot = new Mesh(clonedGeometry, new MeshBasicMaterial());
		depthMesh.getWorldPosition(depthMeshSnapshot.position);
		depthMesh.getWorldQuaternion(depthMeshSnapshot.quaternion);
		depthMesh.getWorldScale(depthMeshSnapshot.scale);
		depthMeshSnapshot.updateMatrixWorld(true);
		return depthMeshSnapshot;
	}
	disposeDepthMeshSnapshot(depthMeshSnapshot) {
		depthMeshSnapshot.geometry.dispose();
		disposeMaterial(depthMeshSnapshot.material);
	}
	dispose() {
		this.disposed = true;
		this.activeClients.clear();
		this.clear();
		this.poses = [];
		for (const backendPromise of this.detectorBackends.values()) backendPromise.then((backend) => backend.dispose?.()).catch(() => {});
		this.detectorBackends.clear();
	}
};
var acceleratedRaycast;
var computeBoundsTree;
var disposeBoundsTree;
var bvhImportStatus = 0;
var bvhImportError;
var bvhImportPromise = null;
var bvhProtoPatched = false;
function importBVH() {
	if (bvhImportPromise) return bvhImportPromise;
	bvhImportPromise = (async () => {
		try {
			const mod = await __vitePreload(() => import("./src-CnnjTXy8.js"), __vite__mapDeps([8,1,3]));
			acceleratedRaycast = mod.acceleratedRaycast;
			computeBoundsTree = mod.computeBoundsTree;
			disposeBoundsTree = mod.disposeBoundsTree;
			bvhImportStatus = 1;
			return true;
		} catch (error) {
			if (error instanceof Error) bvhImportError = error;
			bvhImportStatus = 2;
			console.warn("[xrblocks] three-mesh-bvh not available; raycasts will use the stock three.js walker. Install three-mesh-bvh or add it to your importmap to enable BVH-accelerated raycasts.", error);
			return false;
		}
	})();
	return bvhImportPromise;
}
/**
* Whether the BVH module has been loaded AND the THREE prototypes have
* been patched. Sync check; returns false until `enableAcceleratedRaycast()`
* (or `applyBVH()`) has resolved at least once.
*/
function isBVHReady() {
	return bvhProtoPatched;
}
/**
* Dynamically import three-mesh-bvh and install the prototype patches
* that route `THREE.Mesh.raycast` through the accelerated path when
* the target mesh has a computed bounds tree. Adds
* `computeBoundsTree` / `disposeBoundsTree` helpers to
* `THREE.BufferGeometry`.
*
* Async because the BVH module is loaded on demand. Resolves to `true`
* if the module loaded and patches were applied, `false` if the module
* isn't available — in which case meshes continue to use the stock raycaster.
*
* Safe to call multiple times. The first call kicks off the import,
* subsequent calls share the same promise.
*/
async function enableAcceleratedRaycast() {
	if (!await importBVH() || bvhProtoPatched) return bvhProtoPatched;
	Mesh.prototype.raycast = acceleratedRaycast;
	BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
	BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
	bvhProtoPatched = true;
	return true;
}
/**
* Walk the given object3D (recursively) and build a bounds tree on
* every standard `THREE.Mesh` whose geometry doesn't already have one.
* Subsequent `raycaster.intersectObject(root, true)` calls then go
* through the BVH-accelerated path.
*
* Use on dense, static environmental meshes only (loaded immersive
* scenes, photogrammetry scans, baked levels). The tree has a one-time
* build + memory cost and assumes static vertices, so it's a net loss
* for low-poly / UI / dynamic meshes. Don't apply globally to
* `xb.core.scene`.
*
* Skips `THREE.SkinnedMesh`: skinned meshes deform vertices on the GPU
* each frame, so a bounds tree built on the bind-pose geometry is wrong
* the moment the mesh animates. Three's `SkinnedMesh.raycast()` also
* overrides the patched `Mesh.prototype.raycast` and does its own CPU
* skinning, so the BVH would never be consulted anyway.
*
* Skips `THREE.BatchedMesh`: three-mesh-bvh ships a dedicated
* `computeBatchedBoundsTree` / `disposeBatchedBoundsTree` pair that
* builds per-draw-range BVHs on `this.boundsTrees` (plural), and
* `acceleratedRaycast` has a separate `isBatchedMesh` branch that
* consults those. The standard `computeBoundsTree` would index the
* combined batched buffer and produce wrong hits. Conservative skip
* until the batched helpers are wired up.
*
* `THREE.InstancedMesh` is NOT skipped: its `.raycast()` calls a
* shared internal `Mesh` per instance, which does route through the
* patched `Mesh.prototype.raycast`, so a BVH on the shared geometry
* accelerates every per-instance test.
*
* Async because it awaits the dynamic import of three-mesh-bvh. If the
* module isn't available, this is a no-op. Idempotent across calls.
*/
async function applyBVH(root, { recursive = true } = {}) {
	if (!await enableAcceleratedRaycast()) return;
	const visit = (obj) => {
		if (obj instanceof Mesh && !(obj instanceof SkinnedMesh) && !(obj instanceof BatchedMesh) && obj.geometry) {
			const geom = obj.geometry;
			if (!geom.boundsTree && typeof geom.computeBoundsTree === "function") geom.computeBoundsTree();
		}
		if (recursive) for (const child of obj.children) visit(child);
	};
	visit(root);
}
/**
* Walk the given object3D (recursively) and dispose any bounds trees
* previously built by `applyBVH`. Sync; no-op if three-mesh-bvh
* wasn't loaded.
*/
function disposeBVH(root, { recursive = true } = {}) {
	if (!bvhProtoPatched) return;
	const visit = (obj) => {
		if (obj instanceof Mesh && obj.geometry) {
			const geom = obj.geometry;
			if (geom.boundsTree && typeof geom.disposeBoundsTree === "function") geom.disposeBoundsTree();
		}
		if (recursive) for (const child of obj.children) visit(child);
	};
	visit(root);
}
function _getBvhImportStatus() {
	return {
		status: bvhImportStatus,
		error: bvhImportError
	};
}
/**
* Common facial landmark anchor names. These map to specific indices
* in the 478-point MediaPipe FaceLandmarker mesh and are exposed for
* convenience so callers can read e.g. the nose tip without memorising
* the index 1.
*/
var FaceLandmarkName = /* @__PURE__ */ function(FaceLandmarkName) {
	FaceLandmarkName["NoseTip"] = "noseTip";
	FaceLandmarkName["Chin"] = "chin";
	FaceLandmarkName["LeftEyeOuterCorner"] = "leftEyeOuterCorner";
	FaceLandmarkName["LeftEyeInnerCorner"] = "leftEyeInnerCorner";
	FaceLandmarkName["RightEyeOuterCorner"] = "rightEyeOuterCorner";
	FaceLandmarkName["RightEyeInnerCorner"] = "rightEyeInnerCorner";
	FaceLandmarkName["LeftPupil"] = "leftPupil";
	FaceLandmarkName["RightPupil"] = "rightPupil";
	FaceLandmarkName["MouthLeftCorner"] = "mouthLeftCorner";
	FaceLandmarkName["MouthRightCorner"] = "mouthRightCorner";
	FaceLandmarkName["UpperLipCenter"] = "upperLipCenter";
	FaceLandmarkName["LowerLipCenter"] = "lowerLipCenter";
	FaceLandmarkName["ForeheadCenter"] = "foreheadCenter";
	return FaceLandmarkName;
}({});
/**
* Maps the named anchors above to FaceLandmarker mesh indices. Source:
* MediaPipe FaceLandmarker canonical face mesh topology, plus the iris
* sub-model (indices 468..477) for pupil centres.
*/
var LANDMARK_INDEX = {
	["noseTip"]: 1,
	["chin"]: 152,
	["leftEyeOuterCorner"]: 263,
	["leftEyeInnerCorner"]: 362,
	["rightEyeOuterCorner"]: 33,
	["rightEyeInnerCorner"]: 133,
	["leftPupil"]: 473,
	["rightPupil"]: 468,
	["mouthLeftCorner"]: 291,
	["mouthRightCorner"]: 61,
	["upperLipCenter"]: 13,
	["lowerLipCenter"]: 14,
	["foreheadCenter"]: 10
};
/**
* Represents a single human face detected in physical space.
* Inherits from `THREE.Object3D` to fit naturally into the Three.js
* scene graph, positioning itself at the estimated nose tip of the
* tracked face. When a facial transformation matrix is emitted by the
* backend it is decomposed onto `position`, `quaternion`, and `scale`
* so the Object3D directly represents the rigid head pose.
*/
var DetectedFace = class extends Object3D {
	/**
	* Creates an instance of DetectedFace.
	*
	* @param faceId - A unique tracking identifier for this face.
	* @param landmarks - The 478 raw + 3D-projected facial landmarks.
	* @param detection2DBoundingBox - The 2D bounding box of the face in
	*     normalized screen space.
	* @param blendshapes - Optional 52 ARKit-style blendshape weights.
	*     Empty when the backend was configured with
	*     `outputFaceBlendshapes: false`.
	* @param facialTransformationMatrix - Optional 4x4 rigid head pose
	*     matrix in world space. Null when the backend was configured
	*     with `outputFacialTransformationMatrixes: false`.
	*/
	constructor(faceId, landmarks, detection2DBoundingBox, blendshapes = [], facialTransformationMatrix = null) {
		super();
		this.faceId = faceId;
		this.landmarks = landmarks;
		this.detection2DBoundingBox = detection2DBoundingBox;
		this.blendshapes = blendshapes;
		this.facialTransformationMatrix = facialTransformationMatrix;
		const nose = this.getLandmarkPosition("noseTip");
		if (nose) this.position.copy(nose);
		if (this.facialTransformationMatrix) this.facialTransformationMatrix.decompose(this.position, this.quaternion, this.scale);
	}
	/**
	* Returns the 3D world-space position of a named facial landmark.
	*
	* @param name - The landmark name to look up.
	* @returns A clone of the landmark's world position, or `null` if the
	*     index is out of range or depth back-projection was unsuccessful.
	*/
	getLandmarkPosition(name) {
		const index = LANDMARK_INDEX[name];
		if (index === void 0) return null;
		const lm = this.landmarks[index];
		return lm && lm.worldPosition ? lm.worldPosition.clone() : null;
	}
	/**
	* Returns the score for a blendshape category, or `0` if the category
	* isn't present in the current detection.
	*
	* @param categoryName - The ARKit category name, e.g. `jawOpen`.
	*/
	getBlendshape(categoryName) {
		const bs = this.blendshapes.find((b) => b.categoryName === categoryName);
		return bs ? bs.score : 0;
	}
};
/**
* Abstract base class for all face landmark detection backends (e.g.
* MediaPipe).
*
* Implements a Template Method pattern via `run()`, which orchestrates
* the detection pipeline by checking availability, acquiring a camera
* snapshot, and calling the abstract `detect()` hook implemented by
* specific backends.
*/
var BaseFaceBackend = class {
	/**
	* Creates an instance of BaseFaceBackend.
	* @param context - The shared dependency and configuration context.
	*/
	constructor(context) {
		this.context = context;
	}
	/**
	* The orchestration pipeline (Template Method) for running face
	* detection. Checks backend availability and obtains a camera
	* snapshot before running the concrete detection model.
	*
	* @param depthMeshSnapshot - The current 3D depth mesh snapshot of
	*     the physical environment.
	* @param cameraParametersSnapshot - The current camera parameters
	*     and matrix transforms.
	* @returns A promise that resolves to an array of detected faces.
	*/
	async run(depthMeshSnapshot, cameraParametersSnapshot) {
		if (!await this.isAvailable()) return [];
		const snapshot = await this.getSnapshot();
		if (!snapshot) return [];
		return this.detect(snapshot, depthMeshSnapshot, cameraParametersSnapshot);
	}
	dispose() {}
};
/**
* Convert a raw MediaPipe `FaceLandmarkerResult` into an array of
* `DetectedFace` objects with world-space positions, blendshape
* weights, and rigid head transforms.
*
* Extracted as a free function so unit tests can drive it directly
* without standing up the full backend lifecycle.
*
* For each landmark we try a depth-mesh raycast (`transformRgbUvToWorld`)
* first; when the ray misses the mesh we fall back to back-projecting
* through the camera frustum, placing the point ~0.5 m from the camera
* modulated by the landmark's relative z. The 0.5 m default is tuned
* for selfie / desktop sim use; passthrough Quest views typically hit
* the depth mesh path so the fallback rarely runs there.
*/
function processFaceLandmarkerResult(result, depthMeshSnapshot, cameraParametersSnapshot) {
	const detectedFaces = [];
	for (let i = 0; i < result.faceLandmarks.length; i++) {
		const mpLandmarks = result.faceLandmarks[i];
		const landmarks = [];
		let xmin = 1;
		let ymin = 1;
		let xmax = 0;
		let ymax = 0;
		for (let j = 0; j < mpLandmarks.length; j++) {
			const lm = mpLandmarks[j];
			xmin = Math.min(xmin, lm.x);
			ymin = Math.min(ymin, lm.y);
			xmax = Math.max(xmax, lm.x);
			ymax = Math.max(ymax, lm.y);
			const worldCoords = transformRgbUvToWorld(new Vector2(lm.x, lm.y), depthMeshSnapshot, cameraParametersSnapshot);
			let wp;
			if (worldCoords) wp = worldCoords.worldPosition;
			else {
				const origin = new Vector3().applyMatrix4(cameraParametersSnapshot.worldFromView);
				const direction = new Vector3(2 * lm.x - 1, 2 * (1 - lm.y) - 1, -1).applyMatrix4(cameraParametersSnapshot.worldFromClip).sub(origin).normalize();
				wp = origin.addScaledVector(direction, .5 + (lm.z || 0));
			}
			landmarks.push({
				x: lm.x,
				y: lm.y,
				z: lm.z,
				worldPosition: wp
			});
		}
		const boundingBox = new Box2(new Vector2(xmin, ymin), new Vector2(xmax, ymax));
		const blendshapes = [];
		const mpBlendshapes = result.faceBlendshapes?.[i];
		if (mpBlendshapes && mpBlendshapes.categories) for (const c of mpBlendshapes.categories) blendshapes.push({
			categoryName: c.categoryName,
			score: c.score
		});
		let facialTransform = null;
		const mpMatrix = result.facialTransformationMatrixes?.[i];
		if (mpMatrix && mpMatrix.data) facialTransform = new Matrix4().fromArray(mpMatrix.data);
		const face = new DetectedFace(i, landmarks, boundingBox, blendshapes, facialTransform);
		detectedFaces.push(face);
	}
	return detectedFaces;
}
/**
* Face Landmark detector backend implementation using MediaPipe's
* FaceLandmarker. Runs locally on the device, but offloads the
* inference to a Web Worker so heavy detection passes (~30 ms on a
* modern laptop, much more on mobile) don't stall the render loop.
*
* Pipeline per detect():
*   1. Main thread captures an `ImageData` snapshot from the device
*      camera (already async).
*   2. Convert to `ImageBitmap` once and transfer it (zero-copy) to
*      the worker.
*   3. Worker runs `landmarker.detect()` and posts back the structured-
*      clonable result.
*   4. Main thread runs `processFaceLandmarkerResult` (depth-mesh
*      raycasts + camera-frustum back-projection) which has to live on
*      the render thread because it touches the live depth mesh and
*      camera matrices.
*
* Emits 478 facial landmarks per face plus optional 52 ARKit-style
* blendshape weights and an optional rigid 4x4 facial transformation
* matrix.
*/
var MediaPipeFaceBackend = class extends BaseFaceBackend {
	constructor(context) {
		super(context);
		this.client = new MediaPipeVisionWorkerClient("MediaPipeFaceBackend");
		this.initializationPromise = this.tryInitializeFaceLandmarker();
	}
	async isAvailable() {
		try {
			await this.initializationPromise;
			return true;
		} catch (e) {
			console.error("MediaPipe Face Landmarker is not available:", e);
			return false;
		}
	}
	async getSnapshot() {
		const imageData = await this.context.deviceCamera.getSnapshot({ outputFormat: "imageData" });
		if (!imageData) return null;
		return { imageData };
	}
	async detect(snapshot, depthMeshSnapshot, cameraParametersSnapshot) {
		await this.initializationPromise;
		const workerResult = await this.client.detect(snapshot.imageData);
		if (!workerResult || !workerResult.faceLandmarks || workerResult.faceLandmarks.length === 0) return [];
		return processFaceLandmarkerResult(workerResult, depthMeshSnapshot, cameraParametersSnapshot);
	}
	/**
	* Tear down the worker. Safe to call multiple times.
	*/
	dispose() {
		this.client.dispose();
	}
	async tryInitializeFaceLandmarker() {
		const facesOptions = this.context.options.faces.backendConfig.mediapipe;
		await this.client.init({
			mediapipeModuleUrl: MEDIAPIPE_MODULE_URL,
			wasmFilesUrl: facesOptions.wasmFilesUrl,
			taskName: "FaceLandmarker",
			taskOptions: {
				baseOptions: {
					modelAssetPath: facesOptions.modelAssetPath,
					delegate: "CPU"
				},
				runningMode: "IMAGE",
				numFaces: facesOptions.numFaces,
				minFaceDetectionConfidence: facesOptions.minFaceDetectionConfidence,
				minFacePresenceConfidence: facesOptions.minFacePresenceConfidence,
				minTrackingConfidence: facesOptions.minTrackingConfidence,
				outputFaceBlendshapes: facesOptions.outputFaceBlendshapes,
				outputFacialTransformationMatrixes: facesOptions.outputFacialTransformationMatrixes
			}
		});
	}
};
/**
* A detector script that orchestrates face landmark estimation. Manages
* the backend face detector lifecycle (e.g. MediaPipe) and exposes the
* detected faces, including 3D landmark positions, blendshape weights,
* and rigid head transforms, in the world coordinate space.
*/
var FaceRecognizer = class extends Script {
	constructor(..._args) {
		super(..._args);
		this._detectorBackends = /* @__PURE__ */ new Map();
		this.activeClients = /* @__PURE__ */ new Set();
		this.currentDetectionPromise = null;
		this.lastContinuousDetectionStartedAtMs = -Infinity;
		this.disposed = false;
		this.detectedFaces = [];
		this.targetDevice = "galaxyxr";
		this.cachedDepthMeshSnapshot = null;
		this.cachedDepthMeshSource = null;
		this.cachedDepthMeshVersion = -1;
	}
	static {
		this.dependencies = {
			options: WorldOptions,
			deviceCamera: XRDeviceCamera,
			depth: Depth,
			camera: Camera,
			rendererHolder: RendererHolder
		};
	}
	init({ options, deviceCamera, depth, camera, rendererHolder }) {
		this.options = options;
		this.deviceCamera = deviceCamera;
		this.depth = depth;
		this.camera = camera;
		this.renderer = rendererHolder.renderer;
		this.disposed = false;
		enableAcceleratedRaycast();
	}
	/**
	* Starts continuous face detection for the given client.
	* If this is the first client, starts the background detection loop.
	* @param client - The client object requesting face detection.
	*/
	start(client) {
		if (this.activeClients.has(client)) return;
		this.activeClients.add(client);
		if (this.activeClients.size === 1) this.runContinuousDetection();
	}
	/**
	* Stops continuous face detection for the given client.
	* If this was the last client, stops the background detection loop.
	* @param client - The client object that no longer needs face detection.
	*/
	stop(client) {
		this.activeClients.delete(client);
	}
	/**
	* Called per frame by the engine. If there are active clients,
	* ensures the continuous face detection is running.
	*/
	update() {
		if (this.activeClients.size === 0 || this.currentDetectionPromise) return;
		const pollingIntervalMs = this.options.faces.pollingIntervalMs;
		if (pollingIntervalMs > 0 && performance.now() - this.lastContinuousDetectionStartedAtMs < pollingIntervalMs) return;
		this.runContinuousDetection();
	}
	runContinuousDetection() {
		if (this.currentDetectionPromise) return;
		this.lastContinuousDetectionStartedAtMs = performance.now();
		this.currentDetectionPromise = this.runDetectionInternal().then((results) => {
			if (!this.disposed) this.detectedFaces = results;
			return results;
		}).finally(() => {
			this.currentDetectionPromise = null;
		});
	}
	/**
	* Runs face landmark detection or returns the ongoing detection promise.
	*
	* - If continuous detection is started (has active clients), returns the
	*   promise for the next detection result.
	* - If continuous detection is not started, performs a one-off detection and
	*   returns the result. If a one-off detection is already in progress, returns
	*   the promise for that ongoing detection.
	*/
	runDetection() {
		if (this.currentDetectionPromise) return this.currentDetectionPromise;
		if (this.activeClients.size > 0) {
			this.runContinuousDetection();
			return this.currentDetectionPromise;
		}
		this.currentDetectionPromise = this.runDetectionInternal().finally(() => {
			this.currentDetectionPromise = null;
		});
		return this.currentDetectionPromise;
	}
	async runDetectionInternal() {
		this.clear();
		if (!this.depth || !this.depth.depthMesh) {
			console.warn("Cannot run Face Detection: Depth module / depthMesh is not enabled or initialized.");
			return [];
		}
		const cameraParametersSnapshot = getCameraParametersSnapshot(this.camera, this.renderer.xr.getCamera(), this.deviceCamera, this.targetDevice);
		if (!cameraParametersSnapshot) return [];
		const context = this.getBackendContext();
		const activeBackend = this.options.faces.backendConfig.activeBackend;
		const backendPromise = this.getOrCreateBackend(activeBackend, context);
		let backend;
		try {
			backend = await backendPromise;
		} catch (error) {
			console.warn(`Failed to load or initialize FaceRecognizer backend '${activeBackend}':`, error);
			return [];
		}
		if (this.disposed) return [];
		const depthMeshSnapshot = this.getDepthMeshSnapshot();
		const faces = await backend.run(depthMeshSnapshot, cameraParametersSnapshot);
		return this.disposed ? [] : faces;
	}
	getBackendContext() {
		return {
			options: this.options,
			deviceCamera: this.deviceCamera
		};
	}
	getOrCreateBackend(activeBackend, context) {
		let backendPromise = this._detectorBackends.get(activeBackend);
		if (!backendPromise) {
			backendPromise = (async () => {
				switch (activeBackend) {
					case "mediapipe": return new MediaPipeFaceBackend(context);
					default: throw new Error(`FaceRecognizer backend '${activeBackend}' is not supported.`);
				}
			})();
			this._detectorBackends.set(activeBackend, backendPromise);
		}
		return backendPromise;
	}
	getDepthMeshSnapshot() {
		const depthMesh = this.depth.depthMesh;
		const geometry = this.depth.options.depthMesh.updateFullResolutionGeometry ? depthMesh.geometry : depthMesh.downsampledGeometry || depthMesh.geometry;
		const version = geometry.attributes.position.version;
		if (this.cachedDepthMeshSnapshot && this.cachedDepthMeshSource === geometry && this.cachedDepthMeshVersion === version) {
			depthMesh.getWorldPosition(this.cachedDepthMeshSnapshot.position);
			depthMesh.getWorldQuaternion(this.cachedDepthMeshSnapshot.quaternion);
			depthMesh.getWorldScale(this.cachedDepthMeshSnapshot.scale);
			this.cachedDepthMeshSnapshot.updateMatrixWorld(true);
			return this.cachedDepthMeshSnapshot;
		}
		if (this.cachedDepthMeshSnapshot) this.disposeCachedDepthMeshSnapshot();
		const clonedGeometry = geometry.clone();
		clonedGeometry.computeBoundingSphere();
		clonedGeometry.computeBoundingBox();
		if (isBVHReady()) clonedGeometry.computeBoundsTree();
		const depthMeshSnapshot = new Mesh(clonedGeometry, new MeshBasicMaterial());
		depthMesh.getWorldPosition(depthMeshSnapshot.position);
		depthMesh.getWorldQuaternion(depthMeshSnapshot.quaternion);
		depthMesh.getWorldScale(depthMeshSnapshot.scale);
		depthMeshSnapshot.updateMatrixWorld(true);
		this.cachedDepthMeshSnapshot = depthMeshSnapshot;
		this.cachedDepthMeshSource = geometry;
		this.cachedDepthMeshVersion = version;
		return depthMeshSnapshot;
	}
	disposeCachedDepthMeshSnapshot() {
		if (!this.cachedDepthMeshSnapshot) return;
		this.cachedDepthMeshSnapshot.geometry.disposeBoundsTree?.();
		this.cachedDepthMeshSnapshot.geometry.dispose();
		disposeMaterial(this.cachedDepthMeshSnapshot.material);
		this.cachedDepthMeshSnapshot = null;
		this.cachedDepthMeshSource = null;
		this.cachedDepthMeshVersion = -1;
	}
	dispose() {
		this.disposed = true;
		this.activeClients.clear();
		this.clear();
		this.detectedFaces = [];
		const pendingDetection = this.currentDetectionPromise;
		if (pendingDetection) pendingDetection.finally(() => {
			this.disposeCachedDepthMeshSnapshot();
		}).catch(() => {});
		else this.disposeCachedDepthMeshSnapshot();
		for (const backendPromise of this._detectorBackends.values()) backendPromise.then((backend) => backend.dispose?.()).catch(() => {});
		this._detectorBackends.clear();
	}
};
/**
* Abstract base for segmentation backends (e.g. MediaPipe).
*
* `run()` is a Template Method: it checks availability, grabs a camera frame,
* then defers to the concrete `segment()` hook. Unlike pose/object detection
* there is no depth or world-space step, the result is a 2D mask.
*/
var BaseSegmenterBackend = class {
	constructor(context) {
		this.context = context;
	}
	/**
	* Runs one segmentation pass. Returns `null` when the backend is not ready
	* or no camera frame is available.
	*/
	async run() {
		if (!await this.isAvailable()) return null;
		const snapshot = await this.getSnapshot();
		if (!snapshot) return null;
		return this.segment(snapshot);
	}
	dispose() {}
};
var FilesetResolver;
var ImageSegmenter;
async function loadMediaPipeModule() {
	if (FilesetResolver && ImageSegmenter) return;
	try {
		const mediapipeModule = await __vitePreload(() => import("./vision_bundle-DJ7uGc4o.js"), []);
		FilesetResolver = mediapipeModule.FilesetResolver;
		ImageSegmenter = mediapipeModule.ImageSegmenter;
		console.log("'@mediapipe/tasks-vision' MediaPipe Segmenter Module loaded successfully.");
	} catch (error) {
		console.error("Failed to load MediaPipe Tasks Vision module:", error);
		throw error;
	}
}
/**
* Maps a MediaPipe category mask into a {@link SegmentationMask}. Copies the
* buffer out before `close()` frees the underlying memory. Exported for tests.
* @param mask - The MediaPipe category mask, or null/undefined if absent.
* @returns The segmentation mask, or `null` when no mask was provided.
*/
function categoryMaskToSegmentationMask(mask) {
	if (!mask) return null;
	const result = {
		data: new Uint8Array(mask.getAsUint8Array()),
		width: mask.width,
		height: mask.height
	};
	mask.close();
	return result;
}
/**
* Segmentation backend backed by MediaPipe's `ImageSegmenter`. Runs locally on
* the device using the configured selfie multiclass model.
*/
var MediaPipeSegmenterBackend = class extends BaseSegmenterBackend {
	constructor(context) {
		super(context);
		this.imageSegmenter = null;
		this.initializationPromise = this.tryInitializeSegmenter();
	}
	async tryInitializeSegmenter() {
		await loadMediaPipeModule();
		const mediapipe = this.context.options.segmentation.backendConfig.mediapipe;
		const vision = await FilesetResolver.forVisionTasks(mediapipe.wasmFilesUrl);
		this.imageSegmenter = await ImageSegmenter.createFromOptions(vision, {
			baseOptions: {
				modelAssetPath: mediapipe.modelAssetPath,
				delegate: "GPU"
			},
			runningMode: "IMAGE",
			outputCategoryMask: mediapipe.outputCategoryMask,
			outputConfidenceMasks: false
		});
	}
	async isAvailable() {
		try {
			await this.initializationPromise;
			return this.imageSegmenter !== null;
		} catch (e) {
			console.error("MediaPipe Image Segmenter is not available:", e);
			return false;
		}
	}
	async getSnapshot() {
		const imageData = await this.context.deviceCamera.getSnapshot({ outputFormat: "imageData" });
		if (!imageData) return null;
		return { imageData };
	}
	async segment(snapshot) {
		await this.initializationPromise;
		if (!this.imageSegmenter) return null;
		let out = null;
		this.imageSegmenter.segment(snapshot.imageData, (result) => {
			out = categoryMaskToSegmentationMask(result.categoryMask);
		});
		return out;
	}
	dispose() {
		this.imageSegmenter?.close();
		this.imageSegmenter = null;
	}
};
/**
* A Script that runs semantic segmentation on the device camera feed and
* returns a per-pixel category mask ({@link SegmentationMask}).
*
* Mirrors `HumanRecognizer` / `ObjectDetector`, but without any depth or
* world-space step, segmentation is a pure 2D camera-to-mask operation, so it
* does not depend on the depth mesh or camera intrinsics.
*
* Multiple concurrent calls to {@link runSegmentation} within the same async
* cycle are coalesced: only one MediaPipe inference is dispatched per cycle
* and its result is shared with all callers. The latest completed mask is also
* available synchronously via {@link latestMask}.
*/
var Segmenter = class extends Script {
	constructor(..._args) {
		super(..._args);
		this._backends = /* @__PURE__ */ new Map();
		this._latestMask = null;
		this._inferenceInFlight = null;
		this._lastRunMs = Number.NEGATIVE_INFINITY;
		this._disposed = false;
	}
	static {
		this.dependencies = {
			options: WorldOptions,
			deviceCamera: XRDeviceCamera
		};
	}
	init({ options, deviceCamera }) {
		this.options = options;
		this.deviceCamera = deviceCamera;
		this._disposed = false;
	}
	/**
	* The latest cached segmentation mask from the most recently completed
	* inference pass. Returns `null` until the first inference finishes.
	*/
	get latestMask() {
		return this._latestMask;
	}
	/**
	* Continuous throttled loop driven by the engine frame tick.
	*
	* Called every frame by `ScriptsManager` (via `Core.update → scriptsManager.update`).
	* Kicks off a fresh inference pass at most once per
	* `options.segmentation.pollingIntervalMs` milliseconds. The in-flight guard
	* prevents stacking: if a previous inference is still running the tick is
	* silently skipped rather than launching a second one.
	*
	* After each completed inference {@link latestMask} is updated so all
	* consumers in the same frame read the same cached result without each
	* triggering their own MediaPipe run.
	*
	* @param time - Current timestamp in milliseconds, forwarded from the
	*   engine frame loop.
	*/
	update(time) {
		if (this._disposed) return;
		if (this._inferenceInFlight) return;
		if (time - this._lastRunMs < this.options.segmentation.pollingIntervalMs) return;
		this._lastRunMs = time;
		this.runSegmentation();
	}
	/**
	* Runs one segmentation pass over the current camera frame, or returns the
	* result of the in-flight pass when one is already running. Multiple callers
	* in the same async cycle share a single MediaPipe inference rather than
	* each triggering their own.
	*
	* Under normal usage consumers should poll {@link latestMask} (kept fresh
	* by the automatic loop) rather than calling this directly.
	*
	* @returns The mask, or `null` if the backend or camera frame is not ready.
	*/
	async runSegmentation() {
		if (this._disposed) return null;
		if (this._inferenceInFlight) return this._inferenceInFlight;
		this._inferenceInFlight = this._runInference().then((mask) => {
			if (!this._disposed) this._latestMask = mask;
			this._inferenceInFlight = null;
			return mask;
		});
		return this._inferenceInFlight;
	}
	async _runInference() {
		const activeBackend = this.options.segmentation.backendConfig.activeBackend;
		const backendPromise = this.getOrCreateBackend(activeBackend);
		let backend;
		try {
			backend = await backendPromise;
		} catch (error) {
			console.warn(`Failed to load or initialize Segmenter backend '${activeBackend}':`, error);
			return null;
		}
		return backend.run();
	}
	getBackendContext() {
		return {
			options: this.options,
			deviceCamera: this.deviceCamera
		};
	}
	getOrCreateBackend(activeBackend) {
		let backendPromise = this._backends.get(activeBackend);
		if (!backendPromise) {
			const context = this.getBackendContext();
			backendPromise = (async () => {
				switch (activeBackend) {
					case "mediapipe": return new MediaPipeSegmenterBackend(context);
					default: throw new Error(`Segmenter backend '${activeBackend}' is not supported.`);
				}
			})();
			this._backends.set(activeBackend, backendPromise);
		}
		return backendPromise;
	}
	dispose() {
		this._disposed = true;
		this._latestMask = null;
		this._inferenceInFlight = null;
		for (const backendPromise of this._backends.values()) backendPromise.then((backend) => backend.dispose?.()).catch(() => {});
		this._backends.clear();
	}
};
/**
* Manages all interactions with the real-world environment perceived by the XR
* device. This class abstracts the complexity of various perception APIs
* (Depth, Planes, Meshes, etc.) and provides a simple, event-driven interface
* for developers to use `this.world.planes` and `this.world.meshes`.
*/
var World = class extends Script {
	constructor(..._args) {
		super(..._args);
		this.editorIcon = "sensors";
		this.raycaster = new Raycaster();
		this.needsRoomCapture = false;
		this.initializedPromise = new Promise((resolve) => {
			this.resolveInitialized = resolve;
		});
	}
	static {
		this.dependencies = {
			options: WorldOptions,
			camera: Camera,
			waitFrame: WaitFrame,
			timer: Timer
		};
	}
	/**
	* Initializes the world-sensing modules based on the provided configuration.
	* This method is called automatically by the XRCore.
	*/
	async init({ options, camera, waitFrame, timer }) {
		this.options = options;
		this.camera = camera;
		this.waitFrame = waitFrame;
		this.timer = timer;
		if (!this.options || !this.options.enabled) {
			this.resolveInitialized();
			return;
		}
		this.needsRoomCapture = this.options.initiateRoomCapture;
		if (this.options.planes.enabled) {
			this.planes = new PlaneDetector();
			this.add(this.planes);
		}
		if (this.options.objects.enabled) {
			this.objects = new ObjectDetector();
			this.add(this.objects);
		}
		if (this.options.meshes.enabled) {
			this.meshes = new MeshDetector();
			this.add(this.meshes);
		}
		if (this.options.anchors.enabled) {
			this.anchors = new AnchorManager();
			this.add(this.anchors);
		}
		if (this.options.sounds.enabled) {
			this.sounds = new SoundDetector();
			this.add(this.sounds);
		}
		if (this.options.humans.enabled) {
			this.humans = new HumanRecognizer();
			this.add(this.humans);
		}
		if (this.options.faces.enabled) {
			this.faces = new FaceRecognizer();
			this.add(this.faces);
		}
		if (this.options.segmentation.enabled) {
			this.segmentation = new Segmenter();
			this.add(this.segmentation);
		}
		this.resolveInitialized();
	}
	/**
	* Unimplemented placeholder. Does not place or anchor the object.
	*
	* @throws Always throws an error because this method is not implemented.
	*/
	anchorObjectAtReticle(_object, _reticle) {
		throw new Error("Method not implemented");
	}
	/**
	* Updates all active world-sensing modules with the latest XRFrame data.
	* This method is called automatically by the XRCore on each frame.
	* @param _timestamp - The timestamp for the current frame.
	* @param frame - The current XRFrame, containing environmental
	* data.
	* @override
	*/
	update(_timestamp, frame) {
		if (!this.options?.enabled || !frame) return;
		if (this.needsRoomCapture && frame.session.initiateRoomCapture) {
			this.needsRoomCapture = false;
			frame.session.initiateRoomCapture();
		}
		this.meshes?.updateMeshes(_timestamp, frame);
	}
	/**
	* Performs a raycast from a controller against detected real-world surfaces
	* (currently planes) and places a 3D object at the intersection point,
	* oriented to face the user.
	*
	* See /templates/03_spatial_placement/ for a complete placement example.
	*
	* @param objectToPlace - The object to position in the
	* world.
	* @param controller - The controller to use for raycasting.
	* @returns True if the object was successfully placed, false
	* otherwise.
	*/
	placeOnSurface(objectToPlace, controller) {
		if (!this.planes) {
			console.warn("Cannot placeOnSurface: PlaneDetector is not enabled.");
			return false;
		}
		const allPlanes = this.planes.get();
		if (allPlanes.length === 0) return false;
		this.raycaster.setFromXRController(controller);
		const intersections = this.raycaster.intersectObjects(allPlanes);
		if (intersections.length > 0) {
			const intersection = intersections[0];
			placeObjectAtIntersectionFacingTarget(objectToPlace, intersection, this.camera);
			return true;
		}
		return false;
	}
	/**
	* Places an object onto a suitable horizontal plane in the environment.
	* It prioritizes planes in front of the user, prefers tables/elevated surfaces over floors,
	* and ensures the object does not intersect other existing objects or other planes in the scene.
	* If placement fails in the current frame, it continues retrying frame-by-frame until the timeout is reached.
	*
	* @param objectToPlace - The Three.js Object3D to place.
	* @param timeout - Optional timeout duration as a Temporal.Duration or Temporal.DurationLike object (defaults to 500ms).
	* @param gridSteps - Optional number of steps along each axis for grid sampling candidate positions (defaults to 5).
	* @returns A promise resolving to true if successfully placed, false otherwise.
	*/
	async placeOnHorizontalSurface(objectToPlace, timeout = { milliseconds: 500 }, gridSteps = 9) {
		await this.initializedPromise;
		let sceneObj = this.parent;
		while (sceneObj && !(sceneObj instanceof Scene)) sceneObj = sceneObj.parent;
		const rootScene = sceneObj || this;
		return placeOnHorizontalSurface(objectToPlace, this.camera, rootScene, this.planes, this.meshes, this.waitFrame, this.timer, timeout, gridSteps);
	}
	/**
	* Toggles the visibility of all debug visualizations for world features.
	* @param visible - Whether the visualizations should be visible.
	*/
	showDebugVisualizations(visible = true) {
		this.planes?.showDebugVisualizations(visible);
		this.objects?.showDebugVisualizations(visible);
	}
	dispose() {
		const detectors = [
			this.planes,
			this.objects,
			this.meshes,
			this.sounds,
			this.humans,
			this.faces,
			this.segmentation
		];
		for (const detector of detectors) {
			if (!detector) continue;
			detector.dispose();
			this.remove(detector);
		}
		this.planes = void 0;
		this.objects = void 0;
		this.meshes = void 0;
		this.sounds = void 0;
		this.humans = void 0;
		this.faces = void 0;
		this.segmentation = void 0;
	}
};
var SIMULATOR_HAND_COMMON_BIOMECHANICAL_CONSTRAINTS_DEGREES = {
	"thumb-metacarpal": [
		[-10, 55],
		[-15, 45],
		[-20, 45]
	],
	"thumb-phalanx-proximal": [
		[-10, 70],
		[-15, 15],
		[0, 0]
	],
	"thumb-phalanx-distal": [
		[-15, 80],
		[0, 0],
		[0, 0]
	],
	"index-finger-metacarpal": [
		[0, 0],
		[0, 0],
		[0, 0]
	],
	"index-finger-phalanx-proximal": [
		[-30, 90],
		[-20, 20],
		[-10, 10]
	],
	"index-finger-phalanx-intermediate": [
		[0, 110],
		[0, 0],
		[0, 0]
	],
	"index-finger-phalanx-distal": [
		[0, 80],
		[0, 0],
		[0, 0]
	],
	"middle-finger-metacarpal": [
		[0, 0],
		[0, 0],
		[0, 0]
	],
	"middle-finger-phalanx-proximal": [
		[-30, 90],
		[-10, 10],
		[-10, 10]
	],
	"middle-finger-phalanx-intermediate": [
		[0, 110],
		[0, 0],
		[0, 0]
	],
	"middle-finger-phalanx-distal": [
		[0, 80],
		[0, 0],
		[0, 0]
	],
	"ring-finger-metacarpal": [
		[0, 0],
		[0, 0],
		[0, 0]
	],
	"ring-finger-phalanx-proximal": [
		[-30, 90],
		[-15, 15],
		[-10, 10]
	],
	"ring-finger-phalanx-intermediate": [
		[0, 110],
		[0, 0],
		[0, 0]
	],
	"ring-finger-phalanx-distal": [
		[0, 80],
		[0, 0],
		[0, 0]
	],
	"pinky-finger-metacarpal": [
		[0, 0],
		[0, 0],
		[0, 0]
	],
	"pinky-finger-phalanx-proximal": [
		[-30, 90],
		[-20, 20],
		[-10, 10]
	],
	"pinky-finger-phalanx-intermediate": [
		[0, 110],
		[0, 0],
		[0, 0]
	],
	"pinky-finger-phalanx-distal": [
		[0, 80],
		[0, 0],
		[0, 0]
	]
};
var HAND_JOINT_NAME_SET = new Set(HAND_JOINT_NAMES);
function parseSimulatorHandPoseRotations(json) {
	if (!json || typeof json !== "object" || Array.isArray(json)) return {};
	const rotations = {};
	for (const [jointName, value] of Object.entries(json)) {
		if (!HAND_JOINT_NAME_SET.has(jointName)) continue;
		if (!Array.isArray(value) || value.length !== 3 || !value.every((axisValue) => typeof axisValue === "number")) continue;
		rotations[jointName] = [
			value[0],
			value[1],
			value[2]
		];
	}
	return rotations;
}
var LEFT_HAND_NEUTRAL = [
	{
		t: [
			-.05,
			-.08,
			-.1
		],
		r: [
			.53411,
			.018204,
			-.222429,
			.815436
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.027338,
			-.067039,
			-.122241
		],
		r: [
			.394372,
			-.415858,
			-.220458,
			.789271
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.017754,
			-.043135,
			-.143554
		],
		r: [
			.514492,
			-.382382,
			-.392596,
			.659546
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.043077,
			-.032545,
			-.149159
		],
		r: [
			.56159,
			-.206804,
			-.487,
			.636248
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.067278,
			-.017229,
			-.159647
		],
		r: [
			.56161,
			-.206811,
			-.487017,
			.636271
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.032269,
			-.059371,
			-.115777
		],
		r: [
			.567561,
			-.097691,
			-.203196,
			.791889
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.005609,
			.002735,
			-.153999
		],
		r: [
			.507186,
			-.063324,
			-.203911,
			.83502
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.007245,
			.035597,
			-.172199
		],
		r: [
			.458663,
			-.049313,
			-.205676,
			.86312
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.013177,
			.052938,
			-.185024
		],
		r: [
			.397899,
			-.002456,
			-.189554,
			.897684
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.016515,
			.069224,
			-.201788
		],
		r: [
			.397916,
			-.002456,
			-.189562,
			.897722
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.043623,
			-.053662,
			-.112719
		],
		r: [
			.553746,
			-.007309,
			-.191796,
			.810263
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.028562,
			.010251,
			-.145199
		],
		r: [
			.472064,
			.017109,
			-.111029,
			.874356
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.02549,
			.045618,
			-.168513
		],
		r: [
			.441765,
			-.01643,
			-.133573,
			.886956
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.021146,
			.069622,
			-.187059
		],
		r: [
			.310755,
			-.005124,
			-.143074,
			.939638
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.019044,
			.083146,
			-.207534
		],
		r: [
			.310762,
			-.005124,
			-.143078,
			.939662
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.055288,
			-.052779,
			-.110872
		],
		r: [
			.521068,
			.080546,
			-.193884,
			.827277
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.051159,
			.007143,
			-.141754
		],
		r: [
			.461693,
			.031862,
			-.045643,
			.885256
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.051676,
			.039517,
			-.165253
		],
		r: [
			.378491,
			.011831,
			-.061086,
			.923512
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.051113,
			.062013,
			-.187766
		],
		r: [
			.260819,
			.021358,
			-.083438,
			.961583
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.051187,
			.072388,
			-.207475
		],
		r: [
			.260827,
			.021359,
			-.083441,
			.961614
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.066037,
			-.054584,
			-.108849
		],
		r: [
			.488069,
			.176432,
			-.171185,
			.837447
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.074056,
			-635e-6,
			-.137437
		],
		r: [
			.440891,
			.100924,
			.027575,
			.891356
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.080655,
			.025614,
			-.159345
		],
		r: [
			.437071,
			.097627,
			.021249,
			.893713
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.085037,
			.043556,
			-.172445
		],
		r: [
			.3904,
			.08214,
			-.029839,
			.916297
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.08881,
			.056942,
			-.18567
		],
		r: [
			.390393,
			.082139,
			-.029838,
			.916279
		],
		s: [
			1,
			1,
			1
		]
	}
];
var RIGHT_HAND_NEUTRAL = [
	{
		t: [
			.05,
			-.08,
			-.1
		],
		r: [
			.53411,
			-.018204,
			.222429,
			.815436
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.027338,
			-.067039,
			-.122241
		],
		r: [
			.394372,
			.415858,
			.220458,
			.789271
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.017754,
			-.043135,
			-.143554
		],
		r: [
			.514492,
			.382382,
			.392596,
			.659546
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.043077,
			-.032545,
			-.149159
		],
		r: [
			.56159,
			.206804,
			.487,
			.636248
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.067278,
			-.017229,
			-.159647
		],
		r: [
			.56161,
			.206811,
			.487017,
			.636271
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.032269,
			-.059371,
			-.115777
		],
		r: [
			.567561,
			.097691,
			.203196,
			.791889
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.005609,
			.002735,
			-.153999
		],
		r: [
			.507186,
			.063324,
			.203911,
			.83502
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.007245,
			.035597,
			-.172199
		],
		r: [
			.458663,
			.049313,
			.205676,
			.86312
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.013177,
			.052938,
			-.185024
		],
		r: [
			.397899,
			.002456,
			.189554,
			.897684
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			-.016515,
			.069224,
			-.201788
		],
		r: [
			.397916,
			.002456,
			.189562,
			.897722
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.043623,
			-.053662,
			-.112719
		],
		r: [
			.553746,
			.007309,
			.191796,
			.810263
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.028562,
			.010251,
			-.145199
		],
		r: [
			.472064,
			-.017109,
			.111029,
			.874356
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.02549,
			.045618,
			-.168513
		],
		r: [
			.441765,
			.01643,
			.133573,
			.886956
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.021146,
			.069622,
			-.187059
		],
		r: [
			.310755,
			.005124,
			.143074,
			.939638
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.019044,
			.083146,
			-.207534
		],
		r: [
			.310762,
			.005124,
			.143078,
			.939662
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.055288,
			-.052779,
			-.110872
		],
		r: [
			.521068,
			-.080546,
			.193884,
			.827277
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.051159,
			.007143,
			-.141754
		],
		r: [
			.461693,
			-.031862,
			.045643,
			.885256
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.051676,
			.039517,
			-.165253
		],
		r: [
			.378491,
			-.011831,
			.061086,
			.923512
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.051113,
			.062013,
			-.187766
		],
		r: [
			.260819,
			-.021358,
			.083438,
			.961583
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.051187,
			.072388,
			-.207475
		],
		r: [
			.260827,
			-.021359,
			.083441,
			.961614
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.066037,
			-.054584,
			-.108849
		],
		r: [
			.488069,
			-.176432,
			.171185,
			.837447
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.074056,
			-635e-6,
			-.137437
		],
		r: [
			.440891,
			-.100924,
			-.027575,
			.891356
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.080655,
			.025614,
			-.159345
		],
		r: [
			.437071,
			-.097627,
			-.021249,
			.893713
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.085037,
			.043556,
			-.172445
		],
		r: [
			.3904,
			-.08214,
			.029839,
			.916297
		],
		s: [
			1,
			1,
			1
		]
	},
	{
		t: [
			.08881,
			.056942,
			-.18567
		],
		r: [
			.390393,
			-.082139,
			.029838,
			.916279
		],
		s: [
			1,
			1,
			1
		]
	}
];
/**
* SimulatorHandPoseRotations are authored as standardized biomechanical hand angles
*
* Long fingers:
* - x: flexion toward the palm; negative x extends away from the palm.
* - y: abduction away from the middle-finger axis; negative y adducts toward it.
* - z: axial radial roll toward the thumb; negative z rolls away from the thumb.
*
* Middle finger:
* - y: radial deviation toward index/thumb; negative y is ulnar deviation.
*
* Thumb:
* - x: flexion across the palm; negative x extends/repositions.
* - y: palmar abduction away from the palm; negative y adducts back.
* - z: opposition/internal roll into the hand; negative z repositions away.
*/
var HAND_JOINT_PARENT = {
	"thumb-metacarpal": "wrist",
	"thumb-phalanx-proximal": "thumb-metacarpal",
	"thumb-phalanx-distal": "thumb-phalanx-proximal",
	"thumb-tip": "thumb-phalanx-distal",
	"index-finger-metacarpal": "wrist",
	"index-finger-phalanx-proximal": "index-finger-metacarpal",
	"index-finger-phalanx-intermediate": "index-finger-phalanx-proximal",
	"index-finger-phalanx-distal": "index-finger-phalanx-intermediate",
	"index-finger-tip": "index-finger-phalanx-distal",
	"middle-finger-metacarpal": "wrist",
	"middle-finger-phalanx-proximal": "middle-finger-metacarpal",
	"middle-finger-phalanx-intermediate": "middle-finger-phalanx-proximal",
	"middle-finger-phalanx-distal": "middle-finger-phalanx-intermediate",
	"middle-finger-tip": "middle-finger-phalanx-distal",
	"ring-finger-metacarpal": "wrist",
	"ring-finger-phalanx-proximal": "ring-finger-metacarpal",
	"ring-finger-phalanx-intermediate": "ring-finger-phalanx-proximal",
	"ring-finger-phalanx-distal": "ring-finger-phalanx-intermediate",
	"ring-finger-tip": "ring-finger-phalanx-distal",
	"pinky-finger-metacarpal": "wrist",
	"pinky-finger-phalanx-proximal": "pinky-finger-metacarpal",
	"pinky-finger-phalanx-intermediate": "pinky-finger-phalanx-proximal",
	"pinky-finger-phalanx-distal": "pinky-finger-phalanx-intermediate",
	"pinky-finger-tip": "pinky-finger-phalanx-distal"
};
function createRestJoints(joints) {
	const restJoints = /* @__PURE__ */ new Map();
	HAND_JOINT_NAMES.forEach((jointName, index) => {
		const joint = joints[index];
		const position = new Vector3(joint.t[0], joint.t[1], joint.t[2]);
		const rotation = new Quaternion(joint.r[0], joint.r[1], joint.r[2], joint.r[3]);
		const parentName = HAND_JOINT_PARENT[jointName];
		if (!parentName) {
			restJoints.set(jointName, {
				position,
				rotation,
				localOffset: position.clone(),
				localRotation: rotation.clone()
			});
			return;
		}
		const parentRestJoint = restJoints.get(parentName);
		const inverseParentRotation = parentRestJoint.rotation.clone().invert();
		const localOffset = position.clone().sub(parentRestJoint.position).applyQuaternion(inverseParentRotation);
		const localRotation = parentRestJoint.rotation.clone().invert().multiply(rotation);
		restJoints.set(jointName, {
			position,
			rotation,
			localOffset,
			localRotation
		});
	});
	return restJoints;
}
var LEFT_REST_JOINTS = createRestJoints(LEFT_HAND_NEUTRAL);
var RIGHT_REST_JOINTS = createRestJoints(RIGHT_HAND_NEUTRAL);
var RAD_TO_DEG = 180 / Math.PI;
var DEG_TO_RAD = Math.PI / 180;
function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}
function applySimulatorHandPoseRotationConstraints(rotations) {
	const constrainedRotations = {};
	for (const [jointName, rotation] of Object.entries(rotations)) {
		const jointConstraints = SIMULATOR_HAND_COMMON_BIOMECHANICAL_CONSTRAINTS_DEGREES[jointName];
		constrainedRotations[jointName] = rotation.map((axisValue, axisIndex) => {
			const axisConstraints = jointConstraints?.[axisIndex];
			if (!axisConstraints) return axisValue;
			const [minDegrees, maxDegrees] = axisConstraints;
			return clamp(axisValue * RAD_TO_DEG, minDegrees, maxDegrees) * DEG_TO_RAD;
		});
	}
	return constrainedRotations;
}
function getRawFKRotation(jointName, rotation = [
	0,
	0,
	0
]) {
	const [x, y, z] = rotation;
	if (jointName === "thumb-metacarpal") return [
		y,
		x,
		-z
	];
	if (jointName.startsWith("thumb-")) return [
		-x,
		-y,
		-z
	];
	if (jointName.startsWith("index-finger-") || jointName.startsWith("middle-finger-")) return [
		-x,
		-y,
		z
	];
	return [
		-x,
		y,
		z
	];
}
function getHandednessRotation(handedness, rotation) {
	if (handedness !== 1) return rotation;
	return [
		rotation[0],
		-rotation[1],
		-rotation[2]
	];
}
function resolveHandPoseRotations(handedness, restJoints, rotations, applyConstraints = false) {
	const finalPositions = /* @__PURE__ */ new Map();
	const finalRotations = /* @__PURE__ */ new Map();
	const resolvedJoints = [];
	const resolvedRotations = applyConstraints ? applySimulatorHandPoseRotationConstraints(rotations) : rotations;
	for (const jointName of HAND_JOINT_NAMES) {
		const restJoint = restJoints.get(jointName);
		const rotation = getHandednessRotation(handedness, getRawFKRotation(jointName, resolvedRotations[jointName]));
		const offsetRotation = new Quaternion().setFromEuler(new Euler(rotation[0], rotation[1], rotation[2], "XYZ"));
		const parentName = HAND_JOINT_PARENT[jointName];
		if (!parentName) {
			const finalPosition = restJoint.position.clone();
			const finalRotation = restJoint.rotation.clone().multiply(offsetRotation);
			finalPositions.set(jointName, finalPosition);
			finalRotations.set(jointName, finalRotation);
			resolvedJoints.push({
				t: finalPosition.toArray(),
				r: finalRotation.toArray(),
				s: [
					1,
					1,
					1
				]
			});
			continue;
		}
		const parentPosition = finalPositions.get(parentName);
		const parentRotation = finalRotations.get(parentName);
		const finalPosition = restJoint.localOffset.clone().applyQuaternion(parentRotation).add(parentPosition);
		const finalRotation = parentRotation.clone().multiply(restJoint.localRotation).multiply(offsetRotation);
		finalPositions.set(jointName, finalPosition);
		finalRotations.set(jointName, finalRotation);
		resolvedJoints.push({
			t: finalPosition.toArray(),
			r: finalRotation.toArray(),
			s: [
				1,
				1,
				1
			]
		});
	}
	return resolvedJoints;
}
function resolveSimulatorHandPoseRotations(handedness, rotations, applyConstraints = false) {
	return resolveHandPoseRotations(handedness, handedness === 0 ? LEFT_REST_JOINTS : RIGHT_REST_JOINTS, rotations, applyConstraints);
}
function resolveSimulatorRotationsFromKeypoints(handedness, joints, applyConstraints = false) {
	const positions = /* @__PURE__ */ new Map();
	HAND_JOINT_NAMES.forEach((name, index) => {
		const t = joints[index].t;
		positions.set(name, new Vector3(t[0], t[1], t[2]));
	});
	const restJoints = handedness === 0 ? LEFT_REST_JOINTS : RIGHT_REST_JOINTS;
	const computedRotations = {};
	const finalRotations = /* @__PURE__ */ new Map();
	function getPalmBasis(wristPos, indexMcpPos, middleMcpPos) {
		const yAxis = new Vector3().subVectors(middleMcpPos, wristPos).normalize();
		const temp = new Vector3().subVectors(indexMcpPos, wristPos).normalize();
		if (yAxis.lengthSq() < 1e-8 || temp.lengthSq() < 1e-8) return new Quaternion();
		const zAxis = new Vector3().crossVectors(yAxis, temp);
		if (zAxis.lengthSq() < 1e-8) return new Quaternion();
		zAxis.normalize();
		const xAxis = new Vector3().crossVectors(yAxis, zAxis).normalize();
		const matrix = new Matrix4();
		matrix.makeBasis(xAxis, yAxis, zAxis);
		return new Quaternion().setFromRotationMatrix(matrix);
	}
	const restWrist = restJoints.get("wrist");
	const restIndexMcp = restJoints.get("index-finger-metacarpal");
	const restMiddleMcp = restJoints.get("middle-finger-metacarpal");
	const Q_rest = getPalmBasis(restWrist.position, restIndexMcp.position, restMiddleMcp.position);
	const offsetRotationWristBasis = getPalmBasis(positions.get("wrist"), positions.get("index-finger-metacarpal"), positions.get("middle-finger-metacarpal")).clone().multiply(Q_rest.clone().invert());
	const Q_wrist = offsetRotationWristBasis.clone().multiply(restWrist.rotation);
	finalRotations.set("wrist", Q_wrist);
	const offsetRotationWrist = restWrist.rotation.clone().invert().multiply(offsetRotationWristBasis).multiply(restWrist.rotation);
	const eulerWrist = new Euler().setFromQuaternion(offsetRotationWrist, "XYZ");
	computedRotations["wrist"] = getRawFKRotation("wrist", getHandednessRotation(handedness, [
		eulerWrist.x,
		eulerWrist.y,
		eulerWrist.z
	]));
	const HAND_JOINT_CHILD = {};
	for (const [child, parent] of Object.entries(HAND_JOINT_PARENT)) if (parent !== "wrist") HAND_JOINT_CHILD[parent] = child;
	for (const jointName of HAND_JOINT_NAMES) {
		if (jointName === "wrist" || jointName.endsWith("-tip")) continue;
		const parentName = HAND_JOINT_PARENT[jointName];
		const parentRotation = finalRotations.get(parentName);
		const restJoint = restJoints.get(jointName);
		const R_base = parentRotation.clone().multiply(restJoint.localRotation);
		const childName = HAND_JOINT_CHILD[jointName];
		if (!childName) continue;
		const v_rest = restJoints.get(childName).localOffset;
		const pos_joint = positions.get(jointName);
		const v_actual = positions.get(childName).clone().sub(pos_joint);
		const v_target = v_actual.clone().applyQuaternion(R_base.clone().invert());
		const lenSq = v_actual.lengthSq();
		const offsetRotation = new Quaternion();
		if (lenSq > 1e-8) offsetRotation.setFromUnitVectors(v_rest.clone().normalize(), v_target.clone().normalize());
		const euler = new Euler().setFromQuaternion(offsetRotation, "XYZ");
		const biomechanical = getRawFKRotation(jointName, getHandednessRotation(handedness, [
			euler.x,
			euler.y,
			euler.z
		]));
		const finalBiomechanical = (applyConstraints ? applySimulatorHandPoseRotationConstraints({ [jointName]: biomechanical }) : { [jointName]: biomechanical })[jointName];
		computedRotations[jointName] = finalBiomechanical;
		const rotation = getHandednessRotation(handedness, getRawFKRotation(jointName, finalBiomechanical));
		const finalOffsetRotation = new Quaternion().setFromEuler(new Euler(rotation[0], rotation[1], rotation[2], "XYZ"));
		finalRotations.set(jointName, R_base.clone().multiply(finalOffsetRotation));
	}
	return computedRotations;
}
var SIMULATOR_HAND_POSE_ROTATIONS = Object.freeze({
	["neutral"]: {
		wrist: [
			0,
			0,
			0
		],
		"thumb-metacarpal": [
			0,
			0,
			0
		],
		"thumb-phalanx-proximal": [
			0,
			0,
			0
		],
		"thumb-phalanx-distal": [
			0,
			0,
			0
		],
		"index-finger-metacarpal": [
			0,
			0,
			0
		],
		"index-finger-phalanx-proximal": [
			0,
			0,
			0
		],
		"index-finger-phalanx-intermediate": [
			0,
			0,
			0
		],
		"index-finger-phalanx-distal": [
			0,
			0,
			0
		],
		"middle-finger-metacarpal": [
			0,
			0,
			0
		],
		"middle-finger-phalanx-proximal": [
			0,
			0,
			0
		],
		"middle-finger-phalanx-intermediate": [
			0,
			0,
			0
		],
		"middle-finger-phalanx-distal": [
			0,
			0,
			0
		],
		"ring-finger-metacarpal": [
			0,
			0,
			0
		],
		"ring-finger-phalanx-proximal": [
			0,
			0,
			0
		],
		"ring-finger-phalanx-intermediate": [
			0,
			0,
			0
		],
		"ring-finger-phalanx-distal": [
			0,
			0,
			0
		],
		"pinky-finger-metacarpal": [
			0,
			0,
			0
		],
		"pinky-finger-phalanx-proximal": [
			0,
			0,
			0
		],
		"pinky-finger-phalanx-intermediate": [
			0,
			0,
			0
		],
		"pinky-finger-phalanx-distal": [
			0,
			0,
			0
		]
	},
	["relaxed"]: {
		wrist: [
			.066528,
			.199494,
			.406252
		],
		"thumb-metacarpal": [
			.288969,
			-.421561,
			.566077
		],
		"thumb-phalanx-proximal": [
			.314159,
			0,
			0
		],
		"thumb-phalanx-distal": [
			0,
			0,
			0
		],
		"index-finger-metacarpal": [
			0,
			0,
			0
		],
		"index-finger-phalanx-proximal": [
			.436331,
			0,
			0
		],
		"index-finger-phalanx-intermediate": [
			.57596,
			0,
			0
		],
		"index-finger-phalanx-distal": [
			.226891,
			0,
			0
		],
		"middle-finger-metacarpal": [
			0,
			0,
			0
		],
		"middle-finger-phalanx-proximal": [
			.157079,
			0,
			0
		],
		"middle-finger-phalanx-intermediate": [
			.610866,
			0,
			0
		],
		"middle-finger-phalanx-distal": [
			.2618,
			0,
			0
		],
		"ring-finger-metacarpal": [
			0,
			0,
			0
		],
		"ring-finger-phalanx-proximal": [
			0,
			0,
			0
		],
		"ring-finger-phalanx-intermediate": [
			.610866,
			0,
			0
		],
		"ring-finger-phalanx-distal": [
			.261799,
			0,
			0
		],
		"pinky-finger-metacarpal": [
			0,
			0,
			0
		],
		"pinky-finger-phalanx-proximal": [
			0,
			0,
			0
		],
		"pinky-finger-phalanx-intermediate": [
			.506145,
			0,
			0
		],
		"pinky-finger-phalanx-distal": [
			.261799,
			0,
			0
		]
	},
	["pinching"]: {
		wrist: [
			.066528,
			.199494,
			.406252
		],
		"thumb-metacarpal": [
			.672677,
			-.541947,
			.45959
		],
		"thumb-phalanx-proximal": [
			.428777,
			-.042223,
			-.002288
		],
		"thumb-phalanx-distal": [
			-.185089,
			-.007076,
			-.003675
		],
		"index-finger-metacarpal": [
			.005858,
			-129e-6,
			663e-6
		],
		"index-finger-phalanx-proximal": [
			.959931,
			.11827,
			-.091682
		],
		"index-finger-phalanx-intermediate": [
			.692695,
			662e-6,
			-369e-6
		],
		"index-finger-phalanx-distal": [
			.033553,
			-104e-6,
			-203e-6
		],
		"middle-finger-metacarpal": [
			.004162,
			12e-6,
			-.00278
		],
		"middle-finger-phalanx-proximal": [
			.151863,
			.088683,
			.002485
		],
		"middle-finger-phalanx-intermediate": [
			.715085,
			293e-6,
			308e-6
		],
		"middle-finger-phalanx-distal": [
			.173078,
			-105e-6,
			-133e-6
		],
		"ring-finger-metacarpal": [
			.001171,
			302e-6,
			-.007015
		],
		"ring-finger-phalanx-proximal": [
			-.037672,
			-.115556,
			.033333
		],
		"ring-finger-phalanx-intermediate": [
			.690004,
			-103e-6,
			208e-6
		],
		"ring-finger-phalanx-distal": [
			.234816,
			-133e-6,
			76e-6
		],
		"pinky-finger-metacarpal": [
			-.002313,
			835e-6,
			-.011248
		],
		"pinky-finger-phalanx-proximal": [
			.008876,
			-.107748,
			.030917
		],
		"pinky-finger-phalanx-intermediate": [
			.527087,
			-118e-6,
			211e-6
		],
		"pinky-finger-phalanx-distal": [
			.279492,
			126e-6,
			26e-6
		]
	},
	["fist"]: {
		wrist: [
			.718906,
			-.420664,
			.506276
		],
		"thumb-metacarpal": [
			.501474,
			-.295042,
			.551349
		],
		"thumb-phalanx-proximal": [
			.457195,
			-.17737,
			.299589
		],
		"thumb-phalanx-distal": [
			.050138,
			.061422,
			-.365074
		],
		"index-finger-metacarpal": [
			.16857,
			.00471,
			0
		],
		"index-finger-phalanx-proximal": [
			1.466077,
			0,
			0
		],
		"index-finger-phalanx-intermediate": [
			1.413682,
			-.001122,
			132e-6
		],
		"index-finger-phalanx-distal": [
			1.256637,
			-368e-6,
			0
		],
		"middle-finger-metacarpal": [
			.060684,
			.007245,
			0
		],
		"middle-finger-phalanx-proximal": [
			1.186824,
			0,
			0
		],
		"middle-finger-phalanx-intermediate": [
			1.375812,
			-.001242,
			57e-6
		],
		"middle-finger-phalanx-distal": [
			1.169371,
			-647e-6,
			-158e-6
		],
		"ring-finger-metacarpal": [
			0,
			0,
			0
		],
		"ring-finger-phalanx-proximal": [
			1.169371,
			0,
			0
		],
		"ring-finger-phalanx-intermediate": [
			1.330938,
			.001089,
			-398e-6
		],
		"ring-finger-phalanx-distal": [
			1.343904,
			26e-5,
			-166e-6
		],
		"pinky-finger-metacarpal": [
			-.002309,
			0,
			0
		],
		"pinky-finger-phalanx-proximal": [
			1.256637,
			2e-6,
			0
		],
		"pinky-finger-phalanx-intermediate": [
			1.389296,
			234e-6,
			-492e-6
		],
		"pinky-finger-phalanx-distal": [
			1.291544,
			307e-6,
			13e-6
		]
	},
	["thumbs_up"]: {
		wrist: [
			.704686,
			-.201371,
			1.791237
		],
		"thumb-metacarpal": [
			.134051,
			-.193436,
			.759515
		],
		"thumb-phalanx-proximal": [
			-.125664,
			-.029745,
			.357544
		],
		"thumb-phalanx-distal": [
			-.08182,
			.010624,
			-.369933
		],
		"index-finger-metacarpal": [
			.156866,
			.01325,
			.103641
		],
		"index-finger-phalanx-proximal": [
			1.39272,
			-.12805,
			.164079
		],
		"index-finger-phalanx-intermediate": [
			1.584616,
			-.00124,
			347e-6
		],
		"index-finger-phalanx-distal": [
			.536045,
			-439e-6,
			-414e-6
		],
		"middle-finger-metacarpal": [
			.055222,
			.011182,
			.102008
		],
		"middle-finger-phalanx-proximal": [
			1.326915,
			-.138643,
			.126843
		],
		"middle-finger-phalanx-intermediate": [
			1.541392,
			-.001225,
			167e-6
		],
		"middle-finger-phalanx-distal": [
			.707589,
			-696e-6,
			-66e-6
		],
		"ring-finger-metacarpal": [
			.022297,
			-.015343,
			.137564
		],
		"ring-finger-phalanx-proximal": [
			1.286056,
			.225023,
			.176957
		],
		"ring-finger-phalanx-intermediate": [
			1.562286,
			.001084,
			-253e-6
		],
		"ring-finger-phalanx-distal": [
			.622574,
			385e-6,
			122e-6
		],
		"pinky-finger-metacarpal": [
			-.007839,
			-.022999,
			.194136
		],
		"pinky-finger-phalanx-proximal": [
			1.220849,
			.266958,
			.111277
		],
		"pinky-finger-phalanx-intermediate": [
			1.790949,
			178e-6,
			-611e-6
		],
		"pinky-finger-phalanx-distal": [
			.601801,
			321e-6,
			3e-4
		]
	},
	["pointing"]: {
		wrist: [
			.596035,
			-.414914,
			1.043752
		],
		"thumb-metacarpal": [
			.637297,
			-.491225,
			.458936
		],
		"thumb-phalanx-proximal": [
			.759414,
			-.175775,
			.269178
		],
		"thumb-phalanx-distal": [
			.081354,
			.073188,
			-.363034
		],
		"index-finger-metacarpal": [
			1e-6,
			.003655,
			13e-6
		],
		"index-finger-phalanx-proximal": [
			-86e-6,
			-92e-6,
			0
		],
		"index-finger-phalanx-intermediate": [
			0,
			-363e-6,
			-.001156
		],
		"index-finger-phalanx-distal": [
			0,
			23e-6,
			-357e-6
		],
		"middle-finger-metacarpal": [
			0,
			.007851,
			0
		],
		"middle-finger-phalanx-proximal": [
			.944767,
			-.158674,
			.038806
		],
		"middle-finger-phalanx-intermediate": [
			1.301244,
			-.001132,
			-83e-6
		],
		"middle-finger-phalanx-distal": [
			.429908,
			-818e-6,
			-263e-6
		],
		"ring-finger-metacarpal": [
			.014748,
			-.019316,
			.158147
		],
		"ring-finger-phalanx-proximal": [
			1.093878,
			.194757,
			.02078
		],
		"ring-finger-phalanx-intermediate": [
			1.298489,
			.001164,
			-52e-5
		],
		"ring-finger-phalanx-distal": [
			.510774,
			157e-6,
			-34e-6
		],
		"pinky-finger-metacarpal": [
			-.008366,
			-.028749,
			.217979
		],
		"pinky-finger-phalanx-proximal": [
			.977895,
			.073588,
			-.202452
		],
		"pinky-finger-phalanx-intermediate": [
			1.33904,
			18e-5,
			-557e-6
		],
		"pinky-finger-phalanx-distal": [
			.58579,
			31e-5,
			28e-6
		]
	},
	["rock"]: {
		wrist: [
			.011734,
			-.065693,
			.297017
		],
		"thumb-metacarpal": [
			.785398,
			-.750492,
			.575959
		],
		"thumb-phalanx-proximal": [
			.794647,
			-.152901,
			.267991
		],
		"thumb-phalanx-distal": [
			-.127808,
			-.007272,
			-.369855
		],
		"index-finger-metacarpal": [
			8e-6,
			2e-6,
			0
		],
		"index-finger-phalanx-proximal": [
			0,
			0,
			0
		],
		"index-finger-phalanx-intermediate": [
			0,
			-368e-6,
			-.001003
		],
		"index-finger-phalanx-distal": [
			0,
			-4e-5,
			-417e-6
		],
		"middle-finger-metacarpal": [
			12e-6,
			0,
			0
		],
		"middle-finger-phalanx-proximal": [
			.855211,
			-.08504,
			-.009794
		],
		"middle-finger-phalanx-intermediate": [
			1.064651,
			-.001181,
			-268e-6
		],
		"middle-finger-phalanx-distal": [
			1.500983,
			1e-6,
			-536e-6
		],
		"ring-finger-metacarpal": [
			.006811,
			-4e-6,
			0
		],
		"ring-finger-phalanx-proximal": [
			.593412,
			2e-6,
			0
		],
		"ring-finger-phalanx-intermediate": [
			1.32645,
			966e-6,
			-864e-6
		],
		"ring-finger-phalanx-distal": [
			.977384,
			177e-6,
			-314e-6
		],
		"pinky-finger-metacarpal": [
			-.00368,
			-4e-6,
			0
		],
		"pinky-finger-phalanx-proximal": [
			-13e-6,
			.008337,
			0
		],
		"pinky-finger-phalanx-intermediate": [
			0,
			-29e-5,
			-68e-6
		],
		"pinky-finger-phalanx-distal": [
			0,
			287e-6,
			-171e-6
		]
	},
	["thumbs_down"]: {
		wrist: [
			.640485,
			-1.129773,
			-.862294
		],
		"thumb-metacarpal": [
			.134043,
			-.297017,
			.699054
		],
		"thumb-phalanx-proximal": [
			-.219144,
			.085162,
			.341408
		],
		"thumb-phalanx-distal": [
			-.182932,
			-.028732,
			-.368936
		],
		"index-finger-metacarpal": [
			.179881,
			.01461,
			-.081296
		],
		"index-finger-phalanx-proximal": [
			1.094576,
			-.009837,
			.210567
		],
		"index-finger-phalanx-intermediate": [
			1.409529,
			-.001213,
			183e-6
		],
		"index-finger-phalanx-distal": [
			.411586,
			-133e-6,
			-362e-6
		],
		"middle-finger-metacarpal": [
			.067365,
			.01336,
			.042841
		],
		"middle-finger-phalanx-proximal": [
			1.170727,
			-.076803,
			.077463
		],
		"middle-finger-phalanx-intermediate": [
			1.482675,
			-.00116,
			134e-6
		],
		"middle-finger-phalanx-distal": [
			.578475,
			-688e-6,
			-169e-6
		],
		"ring-finger-metacarpal": [
			.018267,
			-.009114,
			.18615
		],
		"ring-finger-phalanx-proximal": [
			1.141257,
			.264759,
			.083493
		],
		"ring-finger-phalanx-intermediate": [
			1.504595,
			.001183,
			0
		],
		"ring-finger-phalanx-distal": [
			.52937,
			492e-6,
			-155e-6
		],
		"pinky-finger-metacarpal": [
			.00421,
			-.021035,
			.291251
		],
		"pinky-finger-phalanx-proximal": [
			.905139,
			.318725,
			-.069524
		],
		"pinky-finger-phalanx-intermediate": [
			1.693415,
			318e-6,
			-533e-6
		],
		"pinky-finger-phalanx-distal": [
			.580409,
			258e-6,
			122e-6
		]
	},
	["victory"]: {
		wrist: [
			.10923,
			.217352,
			.365586
		],
		"thumb-metacarpal": [
			.907571,
			-.577914,
			.414543
		],
		"thumb-phalanx-proximal": [
			.931093,
			-.18921,
			.243373
		],
		"thumb-phalanx-distal": [
			.349066,
			3e-6,
			-.366582
		],
		"index-finger-metacarpal": [
			0,
			0,
			0
		],
		"index-finger-phalanx-proximal": [
			0,
			6e-6,
			0
		],
		"index-finger-phalanx-intermediate": [
			0,
			-334e-6,
			-981e-6
		],
		"index-finger-phalanx-distal": [
			0,
			-126e-6,
			-478e-6
		],
		"middle-finger-metacarpal": [
			3e-6,
			0,
			0
		],
		"middle-finger-phalanx-proximal": [
			0,
			-22e-6,
			0
		],
		"middle-finger-phalanx-intermediate": [
			0,
			-308e-6,
			-.001127
		],
		"middle-finger-phalanx-distal": [
			0,
			-334e-6,
			-871e-6
		],
		"ring-finger-metacarpal": [
			.139626,
			-.05236,
			.15708
		],
		"ring-finger-phalanx-proximal": [
			.279253,
			-12e-6,
			0
		],
		"ring-finger-phalanx-intermediate": [
			2.007129,
			761e-6,
			-725e-6
		],
		"ring-finger-phalanx-distal": [
			.663225,
			338e-6,
			-212e-6
		],
		"pinky-finger-metacarpal": [
			.157079,
			-.087266,
			.191986
		],
		"pinky-finger-phalanx-proximal": [
			.15708,
			-.20944,
			0
		],
		"pinky-finger-phalanx-intermediate": [
			2.059489,
			-263e-6,
			-474e-6
		],
		"pinky-finger-phalanx-distal": [
			.977384,
			422e-6,
			77e-6
		]
	}
});
/**
* The base URL for Three.js JSM examples, used for DRACO and KTX2 decoders.
*/
var jsmUrl = `https://cdn.jsdelivr.net/npm/three@0.186.0/examples/jsm/`;
function createGLTFLoader(manager) {
	const dracoLoader = new DRACOLoader(manager);
	dracoLoader.setDecoderPath(jsmUrl + "libs/draco/");
	const ktx2Loader = new KTX2Loader(manager);
	ktx2Loader.setTranscoderPath(jsmUrl + "libs/basis/");
	const gltfLoader = new GLTFLoader(manager);
	gltfLoader.setDRACOLoader(dracoLoader);
	gltfLoader.setKTX2Loader(ktx2Loader);
	return {
		gltfLoader,
		ktx2Loader
	};
}
/**
* Manages the loading of 3D models, automatically handling dependencies
* like DRACO and KTX2 loaders.
*/
var ModelLoader = class {
	/**
	* Creates an instance of ModelLoader.
	* @param manager - The
	*     loading manager to use,
	* required for KTX2 texture support.
	*/
	constructor(manager = DefaultLoadingManager) {
		this.manager = manager;
	}
	getGLTFLoader(renderer) {
		if (!this.gltfLoader) {
			const { gltfLoader, ktx2Loader } = createGLTFLoader(this.manager);
			this.gltfLoader = gltfLoader;
			this.ktx2Loader = ktx2Loader;
		}
		if (renderer && renderer !== this.ktxRenderer) {
			this.ktx2Loader.detectSupport(renderer);
			this.ktxRenderer = renderer;
		}
		return this.gltfLoader;
	}
	/**
	* Loads a model based on its file extension. Supports .gltf, .glb,
	* .ply, .spz, .splat, and .ksplat.
	* @returns A promise that resolves with the loaded model data (e.g., a glTF
	*     scene or a SplatMesh).
	*/
	async load({ path, url = "", renderer = void 0, onProgress = void 0 }) {
		if (onProgress) console.warn("ModelLoader: An onProgress callback was provided to load(), but a LoadingManager is in use. Progress will be reported via the LoadingManager's onProgress callback. The provided callback will be ignored.");
		const extension = url.split(".").pop()?.toLowerCase() || "";
		const splatExtensions = [
			"ply",
			"spz",
			"splat",
			"ksplat"
		];
		if (["gltf", "glb"].includes(extension)) return await this.loadGLTF({
			path,
			url,
			renderer
		});
		else if (splatExtensions.includes(extension)) return await this.loadSplat({ url });
		console.error("Unsupported file type: " + extension);
		return null;
	}
	/**
	* Loads a 3DGS model (.ply, .spz, .splat, .ksplat).
	* @param url - The URL of the model file.
	* @returns A promise that resolves with the loaded
	* SplatMesh object.
	*/
	async loadSplat({ url = "" }) {
		const { SplatMesh } = await __vitePreload(async () => {
			const { SplatMesh } = await import("./spark.module-BXM4exIQ.js");
			return { SplatMesh };
		}, __vite__mapDeps([9,3,10,11]));
		const splatMesh = new SplatMesh({ url });
		await splatMesh.initialized;
		return Object.assign(splatMesh, { boundingBox: splatMesh.getBoundingBox(false) });
	}
	/**
	* Loads a GLTF or GLB model.
	* @param options - The loading options.
	* @returns A promise that resolves with the loaded glTF object.
	*/
	async loadGLTF({ path, url = "", renderer = void 0 }) {
		const loader = this.getGLTFLoader(renderer);
		loader.setPath(path ?? "");
		return new Promise((resolve, reject) => {
			loader.load(url, (gltf) => resolve(gltf), void 0, (error) => reject(error));
		});
	}
};
export { MeshDetectionOptions as $, resolveSimulatorHandPoseRotations as $n, clamp$1 as $t, GEMINI_DEFAULT_LIVE_MODEL as A, getPalmUp as An, SimulatorAnchor as At, HeadGestureRecognitionOptions as B, getUrlParamFloat as Bn, WebXRHandPoseEstimator as Bt, FINGER_ORDER as C, getFingertipDistance as Cn, SIMULATOR_HAND_COMMON_BIOMECHANICAL_CONSTRAINTS_DEGREES as Ct, FacesOptions as D, getPalmNormal as Dn, SceneVisibilityOptions as Dt, FaceRecognizer as E, getObjectTargetPoint as En, SceneSetOfMarkOptions as Et, GeminiOptions as F, getThumbDirection as Fn, StrokeRecognitionOptions as Ft, Input as G, isBVHReady as Gn, XRTransitionOptions as Gt, HeuristicHeadGestureRecognizer as H, getUrlParameter as Hn, WorldOptions as Ht, GestureRecognitionOptions as I, getThumbOpposition as In, UP as It, InteractionOptions as J, objectIsDescendantOf as Jn, anchorCapability as Jt, InputOptions as K, isDeviceCameraPoseAvailable as Kn, ZERO_VECTOR3 as Kt, HAND_INDEX_TO_LABEL as L, getThumbStraightness as Ln, VideoStream as Lt, GamepadController as M, getRelativeBoneAngles as Mn, SpeechRecognizerOptions as Mt, GazeController as N, getThumbBendAngles as Nn, SpeechSynthesizerOptions as Nt, GEMINI_DEFAULT_FLASH_MODEL as O, getPalmPose as On, SegmentationOptions as Ot, Gemini as P, getThumbCurl as Pn, StreamState as Pt, LocalStorageAnchorStore as Q, print as Qn, callInitWithDependencyInjection as Qt, HandsOptions as R, getThumbVerticalDirection as Rn, WaitFrame as Rt, DeviceCameraOptions as S, getFingerStraightness as Sn, Reticles as St, FaceLandmarkName as T, getInteractionSource as Tn, SceneOptions as Tt, HumanRecognizer as U, getVec4ByColorString as Un, XRDeviceCamera as Ut, HeuristicGestureRecognizer as V, getUrlParamInt as Vn, World as Vt, HumansOptions as W, intrinsicsToProjectionMatrix as Wn, XRReferenceSpaceCache as Wt, LayersOptions as X, parseSimulatorHandPoseRotations as Xn, applySimulatorHandPoseRotationConstraints as Xt, LEFT as Y, parseBase64DataURL as Yn, applyBVH as Yt, LightingOptions as Z, placeObjectAtIntersectionFacingTarget as Zn, average as Zt, DetectedBodyPose as _, getFingerCurl as _n, RIGHT as _t, AnchorsOptions as a, enableAcceleratedRaycast as an, xrDepthMeshPhysicsOptions as ar, OcclusionPass as at, DetectedObject as b, getFingerPalmAlignment as bn, ReticleOptions as bt, ContextOptions as c, faceCameraSlerpAlpha as cn, xrDeviceCameraEnvironmentOptions as cr, OpenAI as ct, DOWN as d, getCameraParametersSnapshot as dn, GLTFLoader as dr, Physics as dt, clamp01 as en, resolveSimulatorRotationsFromKeypoints as er, MeshDetector as et, Depth as f, getColorHex as fn, PhysicsOptions as ft, DepthTextures as g, getFingerBendAngles as gn, RENDERER_BACKENDS as gt, DepthOptions as h, getDeviceCameraWorldFromView as hn, PoseJointName as ht, AnchorManager as i, disposeBVH as in, xrDepthMeshOptions as ir, ObjectsOptions as it, GamepadBindings as j, getPalmWidth as jn, SoundOptions as jt, GEMINI_DEFAULT_IMAGE_MODEL as k, getPalmRight as kn, Segmenter as kt, DEFAULT_RGB_TO_DEPTH_PARAMS as l, getAdjacentFingerSpreads as ln, xrDeviceCameraUserContinuousOptions as lr, OpenAIOptions as lt, DepthMeshOptions as m, getDeviceCameraWorldFromClip as mn, PlanesOptions as mt, AIOptions as n, defaultAnchorStorageKey as nn, traverseUtil as nr, MouseController as nt, AudioListener as o, estimateHandScale as on, xrDepthMeshVisualizationOptions as or, OcclusionUtils as ot, DepthMesh as p, getDeviceCameraClipFromView as pn, PlaneDetector as pt, Interaction as q, lerp as qn, _getBvhImportStatus as qt, ActiveControllers as r, detectDeviceCameraTarget as rn, urlParams as rr, ObjectDetector as rt, BACK as s, faceCameraQuaternion as sn, xrDeviceCameraEnvironmentContinuousOptions as sr, OneDollarUnistrokeRecognizer as st, AI as t, cropImage as tn, transformRgbUvToWorld as tr, ModelLoader as tt, DEVICE_CAMERA_PARAMETERS as u, getBoneVectors as un, xrDeviceCameraUserOptions as ur, Options as ut, DetectedFace as v, getFingerDirection as vn, Registry as vt, FORWARD as w, getFingertipPalmDistance as wn, SIMULATOR_HAND_POSE_ROTATIONS as wt, DetectedPlane as x, getFingerSpread as xn, ReticlePresenter as xt, DetectedMesh as y, getFingerJoint as yn, Reticle as yt, HeadGestureRecognition as z, getUrlParamBool as zn, WebXRHandContext as zt };
