!function(){"use strict";var e,t={422:function(e,t){var n=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,a){function i(e){try{l(r.next(e))}catch(e){a(e)}}function c(e){try{l(r.throw(e))}catch(e){a(e)}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,c)}l((r=r.apply(e,t||[])).next())}))},r=this&&this.__generator||function(e,t){var n,r,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function c(c){return function(l){return function(c){if(n)throw new TypeError("Generator is already executing.");for(;a&&(a=0,c[0]&&(i=0)),i;)try{if(n=1,r&&(o=2&c[0]?r.return:c[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,c[1])).done)return o;switch(r=0,o&&(c=[2&c[0],o.value]),c[0]){case 0:case 1:o=c;break;case 4:return i.label++,{value:c[1],done:!1};case 5:i.label++,r=c[1],c=[0];continue;case 7:c=i.ops.pop(),i.trys.pop();continue;default:if(!((o=(o=i.trys).length>0&&o[o.length-1])||6!==c[0]&&2!==c[0])){i=0;continue}if(3===c[0]&&(!o||c[1]>o[0]&&c[1]<o[3])){i.label=c[1];break}if(6===c[0]&&i.label<o[1]){i.label=o[1],o=c;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(c);break}o[2]&&i.ops.pop(),i.trys.pop();continue}c=t.call(e,i)}catch(e){c=[6,e],r=0}finally{n=o=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,l])}}},o=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,n=t&&e[t],r=0;if(n)return n.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},a=this&&this.__read||function(e,t){var n="function"==typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,o,a=n.call(e),i=[];try{for(;(void 0===t||t-- >0)&&!(r=a.next()).done;)i.push(r.value)}catch(e){o={error:e}}finally{try{r&&!r.done&&(n=a.return)&&n.call(a)}finally{if(o)throw o.error}}return i},i=this&&this.__spreadArray||function(e,t,n){if(n||2===arguments.length)for(var r,o=0,a=t.length;o<a;o++)!r&&o in t||(r||(r=Array.prototype.slice.call(t,0,o)),r[o]=t[o]);return e.concat(r||Array.prototype.slice.call(t))};Object.defineProperty(t,"__esModule",{value:!0}),t.addRenamableWorkspaceEls=t.downloadWorkspace=t.errorPopUp=t.switchStyle=t.insertStyleSelector=t.loadStyleFromCache=t.insertLoginBtn=t.isLoggedIn=void 0;var c={light:"Light Mode",dark:"Dark Mode",contrast:"High Contrast Mode",spooky:"Spooky Mode"};function l(){return document.cookie.split(";").some((function(e){return e.includes("anon=false")}))}function s(e,t){var n=document.createElement("button");return l()?(n.innerText="Sign out",n.addEventListener("click",(function(){document.cookie="auth=;expires=Thu, 01 Jan 1970 00:00:01 GMT"}))):n.innerText="Sign Up/In",n.addEventListener("click",(function(){return window.location.href="/login"})),t.insertAdjacentElement(e,n),n}function d(){var e=localStorage.getItem("style");e&&p(e)}function u(e,t){var n=document.createElement("select");for(var r in n.addEventListener("change",(function(e){p(n.value)})),c){var o=document.createElement("option");o.value=r,o.innerText=c[r],n.appendChild(o)}var a=localStorage.getItem("style");return a&&(n.value=a),t.insertAdjacentElement(e,n),n}function p(e){document.body.classList.remove("light","dark","contrast","spooky"),document.body.classList.add(e),localStorage.setItem("style",e)}function f(e,t){var n,r;void 0===t&&(t=document.body);var a=document.createElement("div");a.classList.add("error-popup","centered");var i=document.createElement("div");i.classList.add("error-popup-msg"),Array.isArray(e)||(e=[e]);try{for(var c=o(e),l=c.next();!l.done;l=c.next()){var s=l.value,d=document.createElement("p");d.innerText=s,i.appendChild(d)}}catch(e){n={error:e}}finally{try{l&&!l.done&&(r=c.return)&&r.call(c)}finally{if(n)throw n.error}}var u=document.createElement("img");u.src="/public/icons/close.png",u.classList.add("icon","clickable","close-icon"),u.addEventListener("click",(function(e){return a.remove()})),window.addEventListener("keypress",(function(e){console.log(e.key),"Escape"==e.key&&a.remove()})),a.appendChild(i),a.appendChild(u),console.log(t),t.appendChild(a)}function h(e){return n(this,void 0,void 0,(function(){var t;return r(this,(function(n){return(t=document.createElement("a")).href="/download/"+e,t.target="_blank",t.click(),t.remove(),[2]}))}))}function y(e,t,n,r,o,c){for(var l,s=[],d=6;d<arguments.length;d++)s[d-6]=arguments[d];null===n&&(n=document.createElement("p"),r.appendChild(n)),n.innerText=e,n.classList.add("workspace-name");var u=document.createElement("input");(l=u.classList).add.apply(l,i(["workspace-name"],a(s),!1));var p=function(e){void 0===e&&(e=!1);var r=u.value.trim();e||!r?(u.value="",u.classList.add("hidden"),n.classList.remove("hidden")):fetch("/rename/".concat(t),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:r})}).then((function(e){return e.json()})).then((function(e){e.success?n.innerText=r:f(e.err),p(!0)}))};u.type="text",u.classList.add("hidden"),u.addEventListener("click",(function(e){e.stopPropagation()})),u.addEventListener("focusout",(function(e){return p()})),u.addEventListener("keydown",(function(e){"Escape"===e.key&&p(!0),"Enter"===e.key&&p()})),r.appendChild(u);var h=document.createElement("img");return h.src="/public/icons/rename.png",h.classList.add("icon","clickable"),h.addEventListener("click",(function(e){e.stopPropagation(),n.classList.add("hidden"),u.classList.remove("hidden"),u.focus()})),o.insertAdjacentElement(c,h),n}t.isLoggedIn=l,t.insertLoginBtn=s,t.loadStyleFromCache=d,t.insertStyleSelector=u,t.switchStyle=p,t.errorPopUp=f,t.downloadWorkspace=h,t.addRenamableWorkspaceEls=y,t.default={isLoggedIn:l,insertLoginBtn:s,loadStyleFromCache:d,insertStyleSelector:u,switchStyle:p,addRenamableWorkspaceEls:y,downloadWorkspace:h,errorPopUp:f}}},n={};(0,(e=function e(r){var o=n[r];if(void 0!==o)return o.exports;var a=n[r]={exports:{}};return t[r].call(a.exports,a,a.exports,e),a.exports}(422)).loadStyleFromCache)(),(0,e.insertStyleSelector)("beforeend",document.querySelector("header"))}();