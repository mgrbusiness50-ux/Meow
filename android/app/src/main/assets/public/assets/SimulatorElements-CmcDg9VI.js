import{a as e,b as t,c as n,d as r,l as i,o as a,s as o,u as s}from"./HandPoses-DaabQczj.js";import{n as c,t as l}from"./SimulatorLightingEvents-Bs7HI1wS.js";var u=globalThis,d=u.ShadowRoot&&(u.ShadyCSS===void 0||u.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,ee=Symbol(),te=new WeakMap,ne=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==ee)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this._strings=t}get styleSheet(){let e=this._styleSheet,t=this._strings;if(d&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=te.get(t)),e===void 0&&((this._styleSheet=e=new CSSStyleSheet).replaceSync(this.cssText),n&&te.set(t,e))}return e}toString(){return this.cssText}},re=e=>{if(e._$cssResult$===!0)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: ${e}. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)},ie=e=>new ne(typeof e==`string`?e:String(e),void 0,ee),f=(e,...t)=>new ne(e.length===1?e[0]:t.reduce((t,n,r)=>t+re(n)+e[r+1],e[0]),e,ee),ae=(e,t)=>{if(d)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let n of t){let t=document.createElement(`style`),r=u.litNonce;r!==void 0&&t.setAttribute(`nonce`,r),t.textContent=n.cssText,e.appendChild(t)}},oe=e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return ie(t)},se=d?e=>e:e=>e instanceof CSSStyleSheet?oe(e):e,{is:ce,defineProperty:le,getOwnPropertyDescriptor:ue,getOwnPropertyNames:de,getOwnPropertySymbols:fe,getPrototypeOf:pe}=Object,p=globalThis,m,me=p.trustedTypes,he=me?me.emptyScript:``,ge=p.reactiveElementPolyfillSupportDevMode;p.litIssuedWarnings??=new Set,m=(e,t)=>{t+=` See https://lit.dev/msg/${e} for more information.`,!p.litIssuedWarnings.has(t)&&!p.litIssuedWarnings.has(e)&&(console.warn(t),p.litIssuedWarnings.add(t))},queueMicrotask(()=>{m(`dev-mode`,`Lit is in dev mode. Not recommended for production!`),p.ShadyDOM?.inUse&&ge===void 0&&m(`polyfill-support-missing`,"Shadow DOM is being polyfilled via `ShadyDOM` but the `polyfill-support` module has not been loaded.")});var _e=e=>{p.emitLitDebugLogEvents&&p.dispatchEvent(new CustomEvent(`lit-debug`,{detail:e}))},h=(e,t)=>e,g={toAttribute(e,t){switch(t){case Boolean:e=e?he:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},ve=(e,t)=>!ce(e,t),ye={attribute:!0,type:String,converter:g,reflect:!1,useDefault:!1,hasChanged:ve};Symbol.metadata??=Symbol(`metadata`),p.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(e){this.__prepare(),(this._initializers??=[]).push(e)}static get observedAttributes(){return this.finalize(),this.__attributeToPropertyMap&&[...this.__attributeToPropertyMap.keys()]}static createProperty(e,t=ye){if(t.state&&(t.attribute=!1),this.__prepare(),this.prototype.hasOwnProperty(e)&&(t=Object.create(t),t.wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol.for(`${String(e)} (@property() cache)`),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&le(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=ue(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};if(r==null){if(`value`in(ue(this.prototype,e)??{}))throw Error(`Field ${JSON.stringify(String(e))} on ${this.name} was declared as a reactive property but it's actually declared as a value on the prototype. Usually this is due to using @property or @state on a method.`);m(`reactive-property-without-getter`,`Field ${JSON.stringify(String(e))} on ${this.name} was declared as a reactive property but it does not have a getter. This will be an error in a future version of Lit.`)}return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ye}static __prepare(){if(this.hasOwnProperty(h(`elementProperties`,this)))return;let e=pe(this);e.finalize(),e._initializers!==void 0&&(this._initializers=[...e._initializers]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(h(`finalized`,this)))return;if(this.finalized=!0,this.__prepare(),this.hasOwnProperty(h(`properties`,this))){let e=this.properties,t=[...de(e),...fe(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this.__attributeToPropertyMap=new Map;for(let[e,t]of this.elementProperties){let n=this.__attributeNameForProperty(e,t);n!==void 0&&this.__attributeToPropertyMap.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles),this.hasOwnProperty(`createProperty`)&&m(`no-override-create-property`,`Overriding ReactiveElement.createProperty() is deprecated. The override will not be called with standard decorators`),this.hasOwnProperty(`getPropertyDescriptor`)&&m(`no-override-get-property-descriptor`,`Overriding ReactiveElement.getPropertyDescriptor() is deprecated. The override will not be called with standard decorators`)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(se(e))}else e!==void 0&&t.push(se(e));return t}static __attributeNameForProperty(e,t){let n=t.attribute;return n===!1?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this.__instanceProperties=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this.__reflectingProperty=null,this.__initialize()}__initialize(){this.__updatePromise=new Promise(e=>this.enableUpdating=e),this._$changedProperties=new Map,this.__saveInstanceProperties(),this.requestUpdate(),this.constructor._initializers?.forEach(e=>e(this))}addController(e){(this.__controllers??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this.__controllers?.delete(e)}__saveInstanceProperties(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this.__instanceProperties=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ae(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this.__controllers?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this.__controllers?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$attributeToProperty(e,n)}__propertyToAttribute(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor.__attributeNameForProperty(e,n);if(r!==void 0&&n.reflect===!0){let i=(n.converter?.toAttribute===void 0?g:n.converter).toAttribute(t,n.type);this.constructor.enabledWarnings.includes(`migration`)&&i===void 0&&m(`undefined-attribute-value`,`The attribute value for the ${e} property is undefined on element ${this.localName}. The attribute will be removed, but in the previous version of \`ReactiveElement\`, the attribute would not have changed.`),this.__reflectingProperty=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this.__reflectingProperty=null}}_$attributeToProperty(e,t){let n=this.constructor,r=n.__attributeToPropertyMap.get(e);if(r!==void 0&&this.__reflectingProperty!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?g:e.converter;this.__reflectingProperty=r;let a=i.fromAttribute(t,e.type);this[r]=a??this.__defaultValues?.get(r)??a,this.__reflectingProperty=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){e instanceof Event&&m(``,`The requestUpdate() method was called with an Event as the property name. This is probably a mistake caused by binding this.requestUpdate as an event listener. Instead bind a function that will call it with no arguments: () => this.requestUpdate()`);let a=this.constructor;if(r===!1&&(i=this[e]),n??=a.getPropertyOptions(e),(n.hasChanged??ve)(i,t)||n.useDefault&&n.reflect&&i===this.__defaultValues?.get(e)&&!this.hasAttribute(a.__attributeNameForProperty(e,n)))this._$changeProperty(e,t,n);else return}this.isUpdatePending===!1&&(this.__updatePromise=this.__enqueueUpdate())}_$changeProperty(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this.__defaultValues??=new Map).has(e)&&(this.__defaultValues.set(e,a??t??this[e]),i!==!0||a!==void 0)||(this._$changedProperties.has(e)||(!this.hasUpdated&&!n&&(t=void 0),this._$changedProperties.set(e,t)),r===!0&&this.__reflectingProperty!==e&&(this.__reflectingProperties??=new Set).add(e))}async __enqueueUpdate(){this.isUpdatePending=!0;try{await this.__updatePromise}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){let e=this.performUpdate();return this.constructor.enabledWarnings.includes(`async-perform-update`)&&typeof e?.then==`function`&&m(`async-perform-update`,`Element ${this.localName} returned a Promise from performUpdate(). This behavior is deprecated and will be removed in a future version of ReactiveElement.`),e}performUpdate(){if(!this.isUpdatePending)return;if(_e?.({kind:`update`}),!this.hasUpdated){this.renderRoot??=this.createRenderRoot();{let e=[...this.constructor.elementProperties.keys()].filter(e=>this.hasOwnProperty(e)&&e in pe(this));if(e.length)throw Error(`The following properties on element ${this.localName} will not trigger updates as expected because they are set using class fields: ${e.join(`, `)}. Native class fields and some compiled output will overwrite accessors used for detecting changes. See https://lit.dev/msg/class-field-shadowing for more information.`)}if(this.__instanceProperties){for(let[e,t]of this.__instanceProperties)this[e]=t;this.__instanceProperties=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];e===!0&&!this._$changedProperties.has(t)&&r!==void 0&&this._$changeProperty(t,void 0,n,r)}}let e=!1,t=this._$changedProperties;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this.__controllers?.forEach(e=>e.hostUpdate?.()),this.update(t)):this.__markUpdated()}catch(t){throw e=!1,this.__markUpdated(),t}e&&this._$didUpdate(t)}willUpdate(e){}_$didUpdate(e){this.__controllers?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e),this.isUpdatePending&&this.constructor.enabledWarnings.includes(`change-in-update`)&&m(`change-in-update`,`Element ${this.localName} scheduled an update (generally because a property was set) after an update completed, causing a new update to be scheduled. This is inefficient and should be avoided unless the next update can only be scheduled as a side effect of the previous update.`)}__markUpdated(){this._$changedProperties=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this.__updatePromise}shouldUpdate(e){return!0}update(e){this.__reflectingProperties&&=this.__reflectingProperties.forEach(e=>this.__propertyToAttribute(e,this[e])),this.__markUpdated()}updated(e){}firstUpdated(e){}};_.elementStyles=[],_.shadowRootOptions={mode:`open`},_[h(`elementProperties`,_)]=new Map,_[h(`finalized`,_)]=new Map,ge?.({ReactiveElement:_});{_.enabledWarnings=[`change-in-update`,`async-perform-update`];let e=function(e){e.hasOwnProperty(h(`enabledWarnings`,e))||(e.enabledWarnings=e.enabledWarnings.slice())};_.enableWarning=function(t){e(this),this.enabledWarnings.includes(t)||this.enabledWarnings.push(t)},_.disableWarning=function(t){e(this);let n=this.enabledWarnings.indexOf(t);n>=0&&this.enabledWarnings.splice(n,1)}}(p.reactiveElementVersions??=[]).push(`2.1.2`),p.reactiveElementVersions.length>1&&queueMicrotask(()=>{m(`multiple-versions`,`Multiple versions of Lit loaded. Loading multiple versions is not recommended.`)});var v=globalThis,y=e=>{v.emitLitDebugLogEvents&&v.dispatchEvent(new CustomEvent(`lit-debug`,{detail:e}))},be=0,b;v.litIssuedWarnings??=new Set,b=(e,t)=>{t+=e?` See https://lit.dev/msg/${e} for more information.`:``,!v.litIssuedWarnings.has(t)&&!v.litIssuedWarnings.has(e)&&(console.warn(t),v.litIssuedWarnings.add(t))},queueMicrotask(()=>{b(`dev-mode`,`Lit is in dev mode. Not recommended for production!`)});var x=v.ShadyDOM?.inUse&&v.ShadyDOM?.noPatch===!0?v.ShadyDOM.wrap:e=>e,S=v.trustedTypes,xe=S?S.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,Se=e=>e,C=(e,t,n)=>Se,Ce=e=>{if(F!==C)throw Error(`Attempted to overwrite existing lit-html security policy. setSanitizeDOMValueFactory should be called at most once.`);F=e},we=()=>{F=C},Te=(e,t,n)=>F(e,t,n),Ee=`$lit$`,w=`lit$${Math.random().toFixed(9).slice(2)}$`,De=`?`+w,Oe=`<${De}>`,T=document,E=()=>T.createComment(``),D=e=>e===null||typeof e!=`object`&&typeof e!=`function`,ke=Array.isArray,Ae=e=>ke(e)||typeof e?.[Symbol.iterator]==`function`,je=`[ 	
\f\r]`,Me=`[^ 	
\f\r"'\`<>=]`,Ne=`[^\\s"'>=/]`,O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Pe=1,Fe=2,Ie=3,Le=/-->/g,Re=/>/g,k=RegExp(`>|${je}(?:(${Ne}+)(${je}*=${je}*(?:${Me}|("|')|))|$)`,`g`),ze=0,Be=1,Ve=2,He=3,Ue=/'/g,We=/"/g,Ge=/^(?:script|style|textarea|title)$/i,Ke=1,qe=2,Je=3,Ye=1,A=2,Xe=3,Ze=4,Qe=5,$e=6,et=7,j=(e=>(t,...n)=>(t.some(e=>e===void 0)&&console.warn(`Some template strings are undefined.
This is probably caused by illegal octal escape sequences.`),n.some(e=>e?._$litStatic$)&&b(``,`Static values 'literal' or 'unsafeStatic' cannot be used as values to non-static templates.
Please use the static 'html' tag function. See https://lit.dev/docs/templates/expressions/#static-expressions`),{_$litType$:e,strings:t,values:n}))(Ke),M=Symbol.for(`lit-noChange`),N=Symbol.for(`lit-nothing`),tt=new WeakMap,P=T.createTreeWalker(T,129),F=C;function nt(e,t){if(!ke(e)||!e.hasOwnProperty(`raw`)){let e=`invalid template strings array`;throw e=`Internal Error: expected template strings to be an array
          with a 'raw' field. Faking a template strings array by
          calling html or svg like an ordinary function is effectively
          the same as calling unsafeHtml and can lead to major security
          issues, e.g. opening your code up to XSS attacks.
          If you're using the html or svg tagged template functions normally
          and still seeing this error, please file a bug at
          https://github.com/lit/lit/issues/new?template=bug_report.md
          and include information about your build tooling, if any.`.replace(/\n */g,`
`),Error(e)}return xe===void 0?t:xe.createHTML(t)}var rt=(e,t)=>{let n=e.length-1,r=[],i=t===qe?`<svg>`:t===Je?`<math>`:``,a,o=O;for(let t=0;t<n;t++){let n=e[t],s=-1,c,l=0,u;for(;l<n.length&&(o.lastIndex=l,u=o.exec(n),u!==null);)if(l=o.lastIndex,o===O){if(u[Pe]===`!--`)o=Le;else if(u[Pe]!==void 0)o=Re;else if(u[Fe]!==void 0)Ge.test(u[Fe])&&(a=RegExp(`</${u[Fe]}`,`g`)),o=k;else if(u[Ie]!==void 0)throw Error(`Bindings in tag names are not supported. Please use static templates instead. See https://lit.dev/docs/templates/expressions/#static-expressions`)}else o===k?u[ze]===`>`?(o=a??O,s=-1):u[Be]===void 0?s=-2:(s=o.lastIndex-u[Ve].length,c=u[Be],o=u[He]===void 0?k:u[He]===`"`?We:Ue):o===We||o===Ue?o=k:o===Le||o===Re?o=O:(o=k,a=void 0);console.assert(s===-1||o===k||o===Ue||o===We,`unexpected parse state B`);let d=o===k&&e[t+1].startsWith(`/>`)?` `:``;i+=o===O?n+Oe:s>=0?(r.push(c),n.slice(0,s)+Ee+n.slice(s)+w+d):n+w+(s===-2?t:d)}return[nt(e,i+(e[n]||`<?>`)+(t===qe?`</svg>`:t===Je?`</math>`:``)),r]},it=class e{constructor({strings:t,_$litType$:n},r){this.parts=[];let i,a=0,o=0,s=t.length-1,c=this.parts,[l,u]=rt(t,n);if(this.el=e.createElement(l,r),P.currentNode=this.el.content,n===qe||n===Je){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=P.nextNode())!==null&&c.length<s;){if(i.nodeType===1){{let e=i.localName;if(/^(?:textarea|template)$/i.test(e)&&i.innerHTML.includes(w)){let t=`Expressions are not supported inside \`${e}\` elements. See https://lit.dev/msg/expression-in-${e} for more information.`;if(e===`template`)throw Error(t);b(``,t)}}if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(Ee)){let t=u[o++],n=i.getAttribute(e).split(w),r=/([.?@])?(.*)/.exec(t);c.push({type:Ye,index:a,name:r[2],strings:n,ctor:r[1]===`.`?ot:r[1]===`?`?st:r[1]===`@`?ct:R}),i.removeAttribute(e)}else e.startsWith(w)&&(c.push({type:$e,index:a}),i.removeAttribute(e));if(Ge.test(i.tagName)){let e=i.textContent.split(w),t=e.length-1;if(t>0){i.textContent=S?S.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],E()),P.nextNode(),c.push({type:A,index:++a});i.append(e[t],E())}}}else if(i.nodeType===8){if(i.data===De)c.push({type:A,index:a});else{let e=-1;for(;(e=i.data.indexOf(w,e+1))!==-1;)c.push({type:et,index:a}),e+=w.length-1}}a++}if(u.length!==o)throw Error('Detected duplicate attribute bindings. This occurs if your template has duplicate attributes on an element tag. For example "<input ?disabled=${true} ?disabled=${false}>" contains a duplicate "disabled" attribute. The error was detected in the following template: \n`'+t.join("${...}")+"`");y&&y({kind:`template prep`,template:this,clonableTemplate:this.el,parts:this.parts,strings:t})}static createElement(e,t){let n=T.createElement(`template`);return n.innerHTML=e,n}};function I(e,t,n=e,r){if(t===M)return t;let i=r===void 0?n.__directive:n.__directives?.[r],a=D(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$notifyDirectiveConnectionChanged?.(!1),a===void 0?i=void 0:(i=new a(e),i._$initialize(e,n,r)),r===void 0?n.__directive=i:(n.__directives??=[])[r]=i),i!==void 0&&(t=I(e,i._$resolve(e,t.values),i,r)),t}var at=class{constructor(e,t){this._$parts=[],this._$disconnectableChildren=void 0,this._$template=e,this._$parent=t}get parentNode(){return this._$parent.parentNode}get _$isConnected(){return this._$parent._$isConnected}_clone(e){let{el:{content:t},parts:n}=this._$template,r=(e?.creationScope??T).importNode(t,!0);P.currentNode=r;let i=P.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===A?t=new L(i,i.nextSibling,this,e):s.type===Ye?t=new s.ctor(i,s.name,s.strings,this,e):s.type===$e&&(t=new lt(i,this,e)),this._$parts.push(t),s=n[++o]}a!==s?.index&&(i=P.nextNode(),a++)}return P.currentNode=T,r}_update(e){let t=0;for(let n of this._$parts)n!==void 0&&(y&&y({kind:`set part`,part:n,value:e[t],valueIndex:t,values:e,templateInstance:this}),n.strings===void 0?n._$setValue(e[t]):(n._$setValue(e,n,t),t+=n.strings.length-2)),t++}},L=class e{get _$isConnected(){return this._$parent?._$isConnected??this.__isConnected}constructor(e,t,n,r){this.type=A,this._$committedValue=N,this._$disconnectableChildren=void 0,this._$startNode=e,this._$endNode=t,this._$parent=n,this.options=r,this.__isConnected=r?.isConnected??!0,this._textSanitizer=void 0}get parentNode(){let e=x(this._$startNode).parentNode,t=this._$parent;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$startNode}get endNode(){return this._$endNode}_$setValue(e,t=this){if(this.parentNode===null)throw Error("This `ChildPart` has no `parentNode` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's `innerHTML` or `textContent` can do this.");if(e=I(this,e,t),D(e))e===N||e==null||e===``?(this._$committedValue!==N&&(y&&y({kind:`commit nothing to child`,start:this._$startNode,end:this._$endNode,parent:this._$parent,options:this.options}),this._$clear()),this._$committedValue=N):e!==this._$committedValue&&e!==M&&this._commitText(e);else if(e._$litType$!==void 0)this._commitTemplateResult(e);else if(e.nodeType!==void 0){if(this.options?.host===e){this._commitText("[probable mistake: rendered a template's host in itself (commonly caused by writing ${this} in a template]"),console.warn(`Attempted to render the template host`,e,`inside itself. This is almost always a mistake, and in dev mode `,`we render some warning text. In production however, we'll `,`render it, which will usually result in an error, and sometimes `,`in the element disappearing from the DOM.`);return}this._commitNode(e)}else Ae(e)?this._commitIterable(e):this._commitText(e)}_insert(e){return x(x(this._$startNode).parentNode).insertBefore(e,this._$endNode)}_commitNode(e){if(this._$committedValue!==e){if(this._$clear(),F!==C){let e=this._$startNode.parentNode?.nodeName;if(e===`STYLE`||e===`SCRIPT`){let t=`Forbidden`;throw t=e===`STYLE`?"Lit does not support binding inside style nodes. This is a security risk, as style injection attacks can exfiltrate data and spoof UIs. Consider instead using css`...` literals to compose styles, and do dynamic styling with css custom properties, ::parts, <slot>s, and by mutating the DOM rather than stylesheets.":`Lit does not support binding inside script nodes. This is a security risk, as it could allow arbitrary code execution.`,Error(t)}}y&&y({kind:`commit node`,start:this._$startNode,parent:this._$parent,value:e,options:this.options}),this._$committedValue=this._insert(e)}}_commitText(e){if(this._$committedValue!==N&&D(this._$committedValue)){let t=x(this._$startNode).nextSibling;this._textSanitizer===void 0&&(this._textSanitizer=Te(t,`data`,`property`)),e=this._textSanitizer(e),y&&y({kind:`commit text`,node:t,value:e,options:this.options}),t.data=e}else{let t=T.createTextNode(``);this._commitNode(t),this._textSanitizer===void 0&&(this._textSanitizer=Te(t,`data`,`property`)),e=this._textSanitizer(e),y&&y({kind:`commit text`,node:t,value:e,options:this.options}),t.data=e}this._$committedValue=e}_commitTemplateResult(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$getTemplate(e):(n.el===void 0&&(n.el=it.createElement(nt(n.h,n.h[0]),this.options)),n);if(this._$committedValue?._$template===r)y&&y({kind:`template updating`,template:r,instance:this._$committedValue,parts:this._$committedValue._$parts,options:this.options,values:t}),this._$committedValue._update(t);else{let e=new at(r,this),n=e._clone(this.options);y&&y({kind:`template instantiated`,template:r,instance:e,parts:e._$parts,options:this.options,fragment:n,values:t}),e._update(t),y&&y({kind:`template instantiated and updated`,template:r,instance:e,parts:e._$parts,options:this.options,fragment:n,values:t}),this._commitNode(n),this._$committedValue=e}}_$getTemplate(e){let t=tt.get(e.strings);return t===void 0&&tt.set(e.strings,t=new it(e)),t}_commitIterable(t){ke(this._$committedValue)||(this._$committedValue=[],this._$clear());let n=this._$committedValue,r=0,i;for(let a of t)r===n.length?n.push(i=new e(this._insert(E()),this._insert(E()),this,this.options)):i=n[r],i._$setValue(a),r++;r<n.length&&(this._$clear(i&&x(i._$endNode).nextSibling,r),n.length=r)}_$clear(e=x(this._$startNode).nextSibling,t){for(this._$notifyConnectionChanged?.(!1,!0,t);e!==this._$endNode;){let t=x(e).nextSibling;x(e).remove(),e=t}}setConnected(e){if(this._$parent===void 0)this.__isConnected=e,this._$notifyConnectionChanged?.(e);else throw Error(`part.setConnected() may only be called on a RootPart returned from render().`)}},R=class{get tagName(){return this.element.tagName}get _$isConnected(){return this._$parent._$isConnected}constructor(e,t,n,r,i){this.type=Ye,this._$committedValue=N,this._$disconnectableChildren=void 0,this.element=e,this.name=t,this._$parent=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$committedValue=Array(n.length-1).fill(new String),this.strings=n):this._$committedValue=N,this._sanitizer=void 0}_$setValue(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=I(this,e,t,0),a=!D(e)||e!==this._$committedValue&&e!==M,a&&(this._$committedValue=e);else{let r=e;e=i[0];let o,s;for(o=0;o<i.length-1;o++)s=I(this,r[n+o],t,o),s===M&&(s=this._$committedValue[o]),a||=!D(s)||s!==this._$committedValue[o],s===N?e=N:e!==N&&(e+=(s??``)+i[o+1]),this._$committedValue[o]=s}a&&!r&&this._commitValue(e)}_commitValue(e){e===N?x(this.element).removeAttribute(this.name):(this._sanitizer===void 0&&(this._sanitizer=F(this.element,this.name,`attribute`)),e=this._sanitizer(e??``),y&&y({kind:`commit attribute`,element:this.element,name:this.name,value:e,options:this.options}),x(this.element).setAttribute(this.name,e??``))}},ot=class extends R{constructor(){super(...arguments),this.type=Xe}_commitValue(e){this._sanitizer===void 0&&(this._sanitizer=F(this.element,this.name,`property`)),e=this._sanitizer(e),y&&y({kind:`commit property`,element:this.element,name:this.name,value:e,options:this.options}),this.element[this.name]=e===N?void 0:e}},st=class extends R{constructor(){super(...arguments),this.type=Ze}_commitValue(e){y&&y({kind:`commit boolean attribute`,element:this.element,name:this.name,value:!!(e&&e!==N),options:this.options}),x(this.element).toggleAttribute(this.name,!!e&&e!==N)}},ct=class extends R{constructor(e,t,n,r,i){if(super(e,t,n,r,i),this.type=Qe,this.strings!==void 0)throw Error(`A \`<${e.localName}>\` has a \`@${t}=...\` listener with invalid content. Event listeners in templates must have exactly one expression and no surrounding text.`)}_$setValue(e,t=this){if(e=I(this,e,t,0)??N,e===M)return;let n=this._$committedValue,r=e===N&&n!==N||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==N&&(n===N||r);y&&y({kind:`commit event listener`,element:this.element,name:this.name,value:e,options:this.options,removeListener:r,addListener:i,oldListener:n}),r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$committedValue=e}handleEvent(e){typeof this._$committedValue==`function`?this._$committedValue.call(this.options?.host??this.element,e):this._$committedValue.handleEvent(e)}},lt=class{constructor(e,t,n){this.element=e,this.type=$e,this._$disconnectableChildren=void 0,this._$parent=t,this.options=n}get _$isConnected(){return this._$parent._$isConnected}_$setValue(e){y&&y({kind:`commit to element binding`,element:this.element,value:e,options:this.options}),I(this,e)}},ut={_boundAttributeSuffix:Ee,_marker:w,_markerMatch:De,_HTML_RESULT:Ke,_getTemplateHtml:rt,_TemplateInstance:at,_isIterable:Ae,_resolveDirective:I,_ChildPart:L,_AttributePart:R,_BooleanAttributePart:st,_EventPart:ct,_PropertyPart:ot,_ElementPart:lt},dt=v.litHtmlPolyfillSupportDevMode;dt?.(it,L),(v.litHtmlVersions??=[]).push(`3.3.3`),v.litHtmlVersions.length>1&&queueMicrotask(()=>{b(`multiple-versions`,`Multiple versions of Lit loaded. Loading multiple versions is not recommended.`)});var z=(e,t,n)=>{if(t==null)throw TypeError(`The container to render into may not be ${t}`);let r=be++,i=n?.renderBefore??t,a=i._$litPart$;if(y&&y({kind:`begin render`,id:r,value:e,container:t,options:n,part:a}),a===void 0){let e=n?.renderBefore??null;i._$litPart$=a=new L(t.insertBefore(E(),e),e,void 0,n??{})}return a._$setValue(e),y&&y({kind:`end render`,id:r,value:e,container:t,options:n,part:a}),a};z.setSanitizer=Ce,z.createSanitizer=Te,z._testOnlyClearSanitizerFactoryDoNotCallOrElse=we;var ft=(e,t)=>e,B=globalThis,pt;B.litIssuedWarnings??=new Set,pt=(e,t)=>{t+=` See https://lit.dev/msg/${e} for more information.`,!B.litIssuedWarnings.has(t)&&!B.litIssuedWarnings.has(e)&&(console.warn(t),B.litIssuedWarnings.add(t))};var V=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this.__childPart=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this.__childPart=z(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this.__childPart?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this.__childPart?.setConnected(!1)}render(){return M}};V._$litElement$=!0,V[ft(`finalized`,V)]=!0,B.litElementHydrateSupport?.({LitElement:V});var mt=B.litElementPolyfillSupportDevMode;mt?.({LitElement:V}),(B.litElementVersions??=[]).push(`4.2.2`),B.litElementVersions.length>1&&queueMicrotask(()=>{pt(`multiple-versions`,`Multiple versions of Lit loaded. Loading multiple versions is not recommended.`)});var H=e=>(t,n)=>{n===void 0?customElements.define(e,t):n.addInitializer(()=>{customElements.define(e,t)})},ht;globalThis.litIssuedWarnings??=new Set,ht=(e,t)=>{t+=` See https://lit.dev/msg/${e} for more information.`,!globalThis.litIssuedWarnings.has(t)&&!globalThis.litIssuedWarnings.has(e)&&(console.warn(t),globalThis.litIssuedWarnings.add(t))};var gt=(e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0},_t={attribute:!0,type:String,converter:g,reflect:!1,hasChanged:ve},vt=(e=_t,t,n)=>{let{kind:r,metadata:i}=n;i??ht(`missing-class-metadata`,`The class ${t} is missing decorator metadata. This could mean that you're using a compiler that supports decorators but doesn't support decorator metadata, such as TypeScript 5.1. Please update your compiler.`);let a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&(e=Object.create(e),e.wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e,!0,n)},init(t){return t!==void 0&&this._$changeProperty(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e,!0,n)}}throw Error(`Unsupported decorator location: ${r}`)};function U(e){return(t,n)=>typeof n==`object`?vt(e,t,n):gt(e,t,n)}function W(e){return U({...e,state:!0,attribute:!1})}var yt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},bt=e=>(...t)=>({_$litDirective$:e,values:t}),xt=class{constructor(e){}get _$isConnected(){return this._$parent._$isConnected}_$initialize(e,t,n){this.__part=e,this._$parent=t,this.__attributeIndex=n}_$resolve(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},St=bt(class extends xt{constructor(e){if(super(e),e.type!==yt.ATTRIBUTE||e.name!==`class`||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return` `+Object.keys(e).filter(t=>e[t]).join(` `)+` `}update(e,[t]){if(this._previousClasses===void 0){this._previousClasses=new Set,e.strings!==void 0&&(this._staticClasses=new Set(e.strings.join(` `).split(/\s/).filter(e=>e!==``)));for(let e in t)t[e]&&!this._staticClasses?.has(e)&&this._previousClasses.add(e);return this.render(t)}let n=e.element.classList;for(let e of this._previousClasses)e in t||(n.remove(e),this._previousClasses.delete(e));for(let e in t){let r=!!t[e];r!==this._previousClasses.has(e)&&!this._staticClasses?.has(e)&&(r?(n.add(e),this._previousClasses.add(e)):(n.remove(e),this._previousClasses.delete(e)))}return M}}),{_ChildPart:Ct}=ut;window.ShadyDOM?.inUse&&window.ShadyDOM?.noPatch===!0&&window.ShadyDOM.wrap;var wt=e=>e.strings===void 0,G=(e,t)=>{let n=e._$disconnectableChildren;if(n===void 0)return!1;for(let e of n)e._$notifyDirectiveConnectionChanged?.(t,!1),G(e,t);return!0},K=e=>{let t,n;do{if((t=e._$parent)===void 0)break;n=t._$disconnectableChildren,n.delete(e),e=t}while(n?.size===0)},Tt=e=>{for(let t;t=e._$parent;e=t){let n=t._$disconnectableChildren;if(n===void 0)t._$disconnectableChildren=n=new Set;else if(n.has(e))break;n.add(e),Ot(t)}};function Et(e){this._$disconnectableChildren===void 0?this._$parent=e:(K(this),this._$parent=e,Tt(this))}function Dt(e,t=!1,n=0){let r=this._$committedValue,i=this._$disconnectableChildren;if(i!==void 0&&i.size!==0){if(t){if(Array.isArray(r))for(let e=n;e<r.length;e++)G(r[e],!1),K(r[e]);else r!=null&&(G(r,!1),K(r))}else G(this,e)}}var Ot=e=>{e.type==yt.CHILD&&(e._$notifyConnectionChanged??=Dt,e._$reparentDisconnectables??=Et)},kt=class extends xt{constructor(){super(...arguments),this._$disconnectableChildren=void 0}_$initialize(e,t,n){super._$initialize(e,t,n),Tt(this),this.isConnected=e._$isConnected}_$notifyDirectiveConnectionChanged(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(G(this,e),K(this))}setValue(e){if(wt(this.__part))this.__part._$setValue(e,this);else{if(this.__attributeIndex===void 0)throw Error(`Expected this.__attributeIndex to be a number`);let t=[...this.__part._$committedValue];t[this.__attributeIndex]=e,this.__part._$setValue(t,this,0)}}disconnected(){}reconnected(){}},At=()=>new jt,jt=class{},Mt=new WeakMap,Nt=bt(class extends kt{render(e){return N}update(e,[t]){let n=t!==this._ref;return n&&this._updateRefValue(void 0),(n||this._lastElementForRef!==this._element)&&(this._ref=t,this._context=e.options?.host,this._updateRefValue(this._element=e.element)),N}_updateRefValue(e){if(this._ref!==void 0){if(this.isConnected||(e=void 0),typeof this._ref==`function`){let t=this._context??globalThis,n=Mt.get(t);n===void 0&&(n=new WeakMap,Mt.set(t,n)),n.get(this._ref)!==void 0&&this._ref.call(this._context,void 0),n.set(this._ref,e),e!==void 0&&this._ref.call(this._context,e)}else this._ref.value=e}}get _lastElementForRef(){return typeof this._ref==`function`?Mt.get(this._context??globalThis)?.get(this._ref):this._ref?.value}disconnected(){this._lastElementForRef===this._element&&this._updateRefValue(void 0)}reconnected(){this._updateRefValue(this._element)}}),Pt=class e extends Event{static{this.type=`simulatorInstructionsNextEvent`}constructor(){super(e.type,{bubbles:!0,composed:!0})}},Ft=class e extends Event{static{this.type=`simulatorInstructionsCloseEvent`}constructor(){super(e.type,{bubbles:!0,composed:!0})}};function q(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var J=class extends V{constructor(...e){super(...e),this.continueButtonText=`Continue`}static{this.styles=f`
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
  `}continueButtonClicked(){this.dispatchEvent(new Pt)}closeButtonClicked(){this.dispatchEvent(new Ft)}getHeaderContents(){return j` <h1>Welcome to XR Blocks!</h1> `}getImageContents(){return j``}getDescriptionContents(){return j``}render(){return j`
      <button class="close-button" @click=${this.closeButtonClicked}>X</button>
      <div class="header-div">${this.getHeaderContents()}</div>
      <div class="image-div">${this.getImageContents()}</div>
      <div class="description-div">${this.getDescriptionContents()}</div>
      <button type="button" @click=${this.continueButtonClicked}>
        ${this.continueButtonText}
      </button>
    `}};q([U({type:String})],J.prototype,`continueButtonText`,void 0),J=q([H(`xrblocks-simulator-instructions-card`)],J);var It=class extends J{getHeaderContents(){return j`<h1>${this.customInstruction.header}</h1>`}getImageContents(){return this.customInstruction.videoSrc?j`
          <video playsinline autoplay muted loop>
            <source src=${this.customInstruction.videoSrc} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        `:j``}getDescriptionContents(){return j`<p>${this.customInstruction.description}</p>`}render(){return super.render()}};q([U()],It.prototype,`customInstruction`,void 0),It=q([H(`xrblocks-simulator-custom-instruction`)],It);var Lt=t+`simulator/instructions/xr_blocks_simulator_hands.webm`,Rt=class extends J{getImageContents(){return j`
      <video playsinline autoplay muted loop>
        <source src="${Lt}" type="video/webm" />
        Your browser does not support the video tag.
      </video>
    `}getDescriptionContents(){return j`
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
    `}};Rt=q([H(`xrblocks-simulator-hands-instructions`)],Rt);var zt=t+`simulator/instructions/xr_blocks_simulator_navigation.webm`,Bt=class extends J{getImageContents(){return j`
      <video playsinline autoplay muted loop>
        <source src=${zt} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    `}getDescriptionContents(){return j`
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
    `}};Bt=q([H(`xrblocks-simulator-navigation-instructions`)],Bt);var Vt=t+`simulator/instructions/xr_blocks_simulator_user.webm`,Ht=class extends J{getImageContents(){return j`
      <video playsinline autoplay muted loop>
        <source src=${Vt} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    `}getDescriptionContents(){return j`
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
    `}};Ht=q([H(`xrblocks-simulator-user-instructions`)],Ht);var Y=class extends V{static{this.styles=f`
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
  `}getSteps(){let e=this.customInstructions.length===0?`Close`:`Continue`;if(this.simulatorMode)switch(this.simulatorMode){case`User`:case`Editor`:case`PointerLock`:return[j`<xrblocks-simulator-user-instructions
              .continueButtonText=${e}
            />`];case`Navigation`:return[j`<xrblocks-simulator-navigation-instructions
              .continueButtonText=${e}
            />`];case`Hands`:return[j`<xrblocks-simulator-hands-instructions
              .continueButtonText=${e}
            />`]}return[j`<xrblocks-simulator-user-instructions />`,j`<xrblocks-simulator-navigation-instructions />`,j`<xrblocks-simulator-hands-instructions
        .continueButtonText=${e}
      />`]}constructor(){super(),this.customInstructions=[],this.step=0,this.addEventListener(Pt.type,this.continueButtonClicked.bind(this)),this.addEventListener(Ft.type,this.closeInstructions.bind(this))}closeInstructions(){this.remove()}continueButtonClicked(){let e=this.getSteps();this.step+1>=e.length+this.customInstructions.length?this.closeInstructions():this.step++}render(){let e=this.getSteps();return this.step<e.length?e[this.step]:j`<xrblocks-simulator-custom-instruction
          .customInstruction=${this.customInstructions[this.step-e.length]}
        />`}};q([U()],Y.prototype,`simulatorMode`,void 0),q([U()],Y.prototype,`customInstructions`,void 0),q([U()],Y.prototype,`step`,void 0),Y=q([H(`xrblocks-simulator-instructions`)],Y);function Ut(e){switch(e){case`Navigation`:return[[{keys:[`W`,`A`,`S`,`D`],label:`Move`}],[{keys:[`Mouse`],label:`Click and drag to look around`}]];case`PointerLock`:return[[{keys:[`W`,`A`,`S`,`D`],label:`Move`}],[{keys:[`Mouse`],label:`Click the screen, then move the mouse to look around`}]];case`Hands`:return[[{keys:[`W`,`A`,`S`,`D`],label:`Move hand`},{keys:[`Shift`,`W`,`A`,`S`,`D`],label:`Move`}],[{keys:[`Right Click`],label:`Look`},{keys:[`Left Click`],label:`Rotate hand`}],[{keys:[`Space`],label:`Pinch`},{keys:[`T`],label:`Switch hand`}]];default:return[[{keys:[`W`,`A`,`S`,`D`],label:`Move`}],[{keys:[`Right Click`],label:`Drag to look around`},{keys:[`Left Click`],label:`Select`}]]}}var X=class extends V{constructor(...e){super(...e),this.simulatorMode=`User`,this.visible=!1}static{this.styles=f`
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
  `}renderGroup(e){return j`
      <div class="group">
        <div class="keys">
          ${e.keys.map(e=>j`<kbd class="key">${e}</kbd>`)}
        </div>
        <span class="label">${e.label}</span>
      </div>
    `}render(){return j`
      ${Ut(this.simulatorMode).map(e=>j`<div class="row">
            ${e.map(e=>this.renderGroup(e))}
          </div>`)}
    `}};q([U({type:String})],X.prototype,`simulatorMode`,void 0),q([U({type:Boolean,reflect:!0})],X.prototype,`visible`,void 0),X=q([H(`xrblocks-simulator-overlay-instructions`)],X);var Wt={0:`A`,1:`B`,2:`X`,3:`Y`,4:`LB`,5:`RB`,6:`LT`,7:`RT`,8:`Back`,9:`Start`,10:`L3`,11:`R3`,12:`D-Up`,13:`D-Down`,14:`D-Left`,15:`D-Right`};function Gt(e){return Wt[e]??`Btn ${e}`}var Z=class extends V{constructor(...e){super(...e),this.visible=!1,this._timer=null,this.controls={},this._flashMessage=``}static{this.styles=f`
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
  `}show(e,t=5e3){this.controls=e,this._flashMessage=``,this.visible=!0,this._timer&&clearTimeout(this._timer),this._timer=setTimeout(()=>this.dismiss(),t)}flash(e,t=1500){this._flashMessage=e,this.controls={},this.visible=!0,this._timer&&clearTimeout(this._timer),this._timer=setTimeout(()=>this.dismiss(),t)}dismiss(){this.visible=!1,this._timer&&=(clearTimeout(this._timer),null)}render(){return this._flashMessage?j`
        <div
          class="toast ${this.visible?``:`hidden`}"
          @click=${this.dismiss}
        >
          <span class="action">${this._flashMessage}</span>
        </div>
      `:j`
      <div class="toast ${this.visible?``:`hidden`}" @click=${this.dismiss}>
        <h3>🎮 Gamepad Connected</h3>
        <div class="controls">
          ${Object.entries(this.controls).map(([e,t])=>j`
              <span class="key">${e}</span>
              <span class="action">${t}</span>
            `)}
        </div>
      </div>
    `}};q([U({type:Boolean})],Z.prototype,`visible`,void 0),q([U({type:Object})],Z.prototype,`controls`,void 0),q([U({type:String})],Z.prototype,`_flashMessage`,void 0),Z=q([H(`xrblocks-gamepad-toast`)],Z);var Kt={select:`Select / Interact`,cycleHandPoseLeft:`Previous Hand Pose`,cycleHandPoseRight:`Next Hand Pose`,cycleSimulatorMode:`Cycle Simulator Mode`,toggleUI:`Toggle UI`,toggleHand:`Swap Active Hand`,moveUp:`Move Up`,moveDown:`Move Down`,openSettings:`Open Settings`},qt=Object.keys(Kt).filter(e=>e!==`openSettings`),Q=class extends V{constructor(...e){super(...e),this._listeningAction=null,this._bindingSnapshot={},this._focusedIndex=0,this._rafId=null,this._prevStickY=0,this._navPrevButtons=[]}static{this.styles=f`
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
  `}_navJustPressed(e,t){let n=e.activeGamepad?.buttons[t]?.pressed??!1,r=this._navPrevButtons[t]??!1;return n&&!r}_navUpdatePrev(e){let t=e.activeGamepad?.buttons;if(t)for(let e=0;e<t.length;e++)this._navPrevButtons[e]=t[e]?.pressed??!1}get _totalItems(){return qt.length+2}show(){this.hidden=!1,this._refreshSnapshot(),this._focusedIndex=0,this._prevStickY=0,this._navPrevButtons=[],this.gamepadController&&(this.gamepadController.menuActive=!0,this._navUpdatePrev(this.gamepadController)),this._startNavLoop()}hide(){this.hidden=!0,this._listeningAction&&=(this.gamepadController?.cancelCapture(),null),this.gamepadController&&(this.gamepadController.menuActive=!1),this._stopNavLoop()}disconnectedCallback(){super.disconnectedCallback(),this._stopNavLoop(),this.gamepadController&&(this.gamepadController.menuActive=!1)}_startNavLoop(){if(this._rafId!==null)return;let e=()=>{this._rafId=requestAnimationFrame(e),this._pollNavigation()};this._rafId=requestAnimationFrame(e)}_stopNavLoop(){this._rafId!==null&&(cancelAnimationFrame(this._rafId),this._rafId=null)}_pollNavigation(){let e=this.gamepadController;if(!e||!e.userData.connected)return;if(this._listeningAction!==null){this._navUpdatePrev(e);return}let[,t]=e.getAxes(),n=.5;t<-.5&&this._prevStickY>=-.5?this._moveFocus(-1):t>n&&this._prevStickY<=n&&this._moveFocus(1),this._prevStickY=t,this._navJustPressed(e,12)&&this._moveFocus(-1),this._navJustPressed(e,13)&&this._moveFocus(1),this._navJustPressed(e,6)&&this._moveFocus(-1),this._navJustPressed(e,7)&&this._moveFocus(1),this._navJustPressed(e,0)&&this._activateFocused(),this._navJustPressed(e,1)&&this.hide();let r=this.bindings?.getBinding(`openSettings`)??-1;r>=0&&r!==0&&r!==1&&this._navJustPressed(e,r)&&this.hide(),this._navUpdatePrev(e)}_moveFocus(e){let t=this._totalItems-1;this._focusedIndex=Math.max(0,Math.min(t,this._focusedIndex+e))}_activateFocused(){let e=qt;this._focusedIndex<e.length?this._startListening(e[this._focusedIndex]):this._focusedIndex===e.length?this._resetDefaults():this.hide()}_refreshSnapshot(){this.bindings&&(this._bindingSnapshot={...this.bindings.getAllBindings()})}_startListening(e){this._listeningAction=e,this.gamepadController?.captureNextButtonPress(t=>{this.bindings?.setBinding(e,t),this._listeningAction=null,this._refreshSnapshot(),this.gamepadController&&this._navUpdatePrev(this.gamepadController)})}_resetDefaults(){this.bindings?.resetDefaults(),this._refreshSnapshot()}render(){let e=qt,t=e.length,n=e.length+1;return j`
      <div class="backdrop" @click=${this.hide}></div>
      <div class="panel">
        <h2>🎮 Gamepad Settings</h2>
        ${e.map((e,t)=>{let n=this._bindingSnapshot[e]??-1,r=this._listeningAction===e,i=this._focusedIndex===t;return j`
            <div class="binding-row">
              <span class="action-label">${Kt[e]}</span>
              <button
                class="bind-btn ${r?`listening`:``} ${i?`focused`:``}"
                @click=${()=>r?null:this._startListening(e)}
              >
                ${r?`Press button...`:n>=0?Gt(n):`Unbound`}
              </button>
            </div>
          `})}
        <div class="footer">
          <button
            class=${this._focusedIndex===t?`focused`:``}
            @click=${this._resetDefaults}
          >
            Reset Defaults
          </button>
          <button
            class=${this._focusedIndex===n?`focused`:``}
            @click=${this.hide}
          >
            Close
          </button>
        </div>
        <div class="hint">
          Stick / D-pad / LT-RT: Navigate · A: Select · B: Close
        </div>
      </div>
    `}};q([U({type:Object})],Q.prototype,`bindings`,void 0),q([U({type:Object})],Q.prototype,`gamepadController`,void 0),q([W()],Q.prototype,`_listeningAction`,void 0),q([W()],Q.prototype,`_bindingSnapshot`,void 0),q([W()],Q.prototype,`_focusedIndex`,void 0),Q=q([H(`xrblocks-gamepad-settings`)],Q);var Jt=class extends V{constructor(...e){super(...e),this.posePanelRef=At(),this.handPose=Object.values(s)[0],this.visible=!1}static{this.styles=f`
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
  `}update(e){e.has(`handPose`)&&this.onHandPoseChanged(),super.update(e)}sendHandPoseRequest(e){this.dispatchEvent(new r(e))}getHandPoseButtons(){let t=[];for(let n of Object.values(s)){let r=e[n],i={"hand-pose-button":!0,selected:this.handPose===n};t.push(j`
        <button
          class=${St(i)}
          @click=${()=>this.sendHandPoseRequest(n)}
          data-pose=${n}
        >
          ${r}
        </button>
      `)}return t}onHandPoseChanged(){this.scrollToCurrentHandPose()}scrollToCurrentHandPose(){let e=this.posePanelRef.value;if(!e)return;let t=e.querySelector(`.hand-pose-button[data-pose=${this.handPose}]`);t&&t.scrollIntoView({behavior:`smooth`,inline:`center`,block:`nearest`})}render(){if(!this.visible)return j``;let e=this.getHandPoseButtons();return j`
      <div class="hand-pose-panel" ${Nt(this.posePanelRef)}>
        ${e}
      </div>
    `}};q([U({type:String})],Jt.prototype,`handPose`,void 0),q([U({type:Boolean})],Jt.prototype,`visible`,void 0),Jt=q([H(`xrblocks-simulator-hand-pose-panel`)],Jt);var $=class extends V{constructor(...e){super(...e),this.environments=[],this.activeEnvironmentIndex=0,this.simulatorMode=`User`,this.instructionsEnabled=!1,this.handPhysicsAvailable=!1,this.handPhysicsEnabled=!1,this.dayNightAvailable=!1,this.dayNightEnabled=!1,this.timeOfDay=0,this._isOpen=!1}static{this.styles=f`
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
  `}_togglePanel(){this._isOpen=!this._isOpen}_onEnvironmentChange(e){let t=e.target,n=parseInt(t.value,10);this.activeEnvironmentIndex=n,this.dispatchEvent(new a(n))}_onModeChange(e){let t=e.target.value;this.simulatorMode=t,this.dispatchEvent(new n(t))}_onHandPhysicsChange(e){let t=e.target;this.handPhysicsEnabled=t.checked,this.dispatchEvent(new o(this.handPhysicsEnabled))}_onDayNightChange(e){let t=e.target;this.dayNightEnabled=t.checked,t.checked||(this.timeOfDay=0),this.dispatchEvent(new l(this.dayNightEnabled))}_onTimeOfDayChange(e){let t=e.target;this.timeOfDay=parseFloat(t.value),this.dispatchEvent(new c(this.timeOfDay))}_onShowInstructions(){this._isOpen=!1,this.dispatchEvent(new i(this.simulatorMode))}render(){return j`
      <button
        class="settings-btn ${this._isOpen?`open`:``}"
        @click=${this._togglePanel}
        title="Simulator Settings"
      >
        <svg viewBox="0 0 24 24">
          <path
            d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
          />
        </svg>
      </button>

      <div class="panel ${this._isOpen?`open`:``}">
        <h3>Simulator Settings</h3>

        <div class="form-group">
          <label>AR Simulation Environment</label>
          <select @change=${this._onEnvironmentChange}>
            ${this.environments.map((e,t)=>j`
                <option
                  value=${t}
                  ?selected=${t===this.activeEnvironmentIndex}
                >
                  ${e.name??e.manifestPath.split(`/`).pop()}
                </option>
              `)}
          </select>
        </div>

        <div class="form-group">
          <label>Interaction Mode</label>
          <select @change=${this._onModeChange}>
            ${[{label:`User`,value:`User`},{label:`Navigation`,value:`Navigation`},{label:`Hands`,value:`Hands`},{label:`Pointer Lock`,value:`PointerLock`},{label:`Editor`,value:`Editor`}].map(e=>j`
                <option
                  value=${e.value}
                  ?selected=${e.value===this.simulatorMode}
                >
                  ${e.label}
                </option>
              `)}
          </select>
        </div>

        ${this.dayNightAvailable?j`
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
            `:``}

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

        ${this.instructionsEnabled?j`
              <div class="form-group">
                <button
                  class="instructions-btn"
                  @click=${this._onShowInstructions}
                >
                  View Simulator Instructions
                </button>
              </div>
            `:``}
      </div>
    `}};q([U({type:Array})],$.prototype,`environments`,void 0),q([U({type:Number})],$.prototype,`activeEnvironmentIndex`,void 0),q([U({type:String})],$.prototype,`simulatorMode`,void 0),q([U({type:Boolean})],$.prototype,`instructionsEnabled`,void 0),q([U({type:Boolean})],$.prototype,`handPhysicsAvailable`,void 0),q([U({type:Boolean})],$.prototype,`handPhysicsEnabled`,void 0),q([U({type:Boolean})],$.prototype,`dayNightAvailable`,void 0),q([U({type:Boolean})],$.prototype,`dayNightEnabled`,void 0),q([U({type:Number})],$.prototype,`timeOfDay`,void 0),q([W()],$.prototype,`_isOpen`,void 0),$=q([H(`xrblocks-simulator-settings`)],$);