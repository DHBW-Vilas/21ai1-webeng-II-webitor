/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/frontend/login.ts":
/*!*******************************!*\
  !*** ./src/frontend/login.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar switchStyle_1 = __webpack_require__(/*! ./switchStyle */ \"./src/frontend/switchStyle.ts\");\n(0, switchStyle_1.loadStyleFromCache)();\n(0, switchStyle_1.insertStyleSelector)('beforeend', document.querySelector('nav'));\nvar nameInput = document.getElementById('name-input');\nvar passInput = document.getElementById('pass-input');\nvar registerBtn = document.getElementById('register-btn');\nvar loginBtn = document.getElementById('login-btn');\nregisterBtn.addEventListener('click', function () { return authenticate(false); });\nloginBtn.addEventListener('click', function () { return authenticate(true); });\nfunction authenticate(isLogin) {\n    var name = nameInput.value;\n    var pass = passInput.value;\n    var path = isLogin ? '/login' : '/register';\n    // TODO: Check that password is good enough\n    // TODO: Check that password is at most 72 bytes long (bc of hashing algorithm used)\n    if (name && pass) {\n        fetch(path, {\n            method: 'POST',\n            body: JSON.stringify({ name: name, pass: pass }),\n            mode: 'cors',\n            headers: { 'Content-Type': 'application/json' },\n        })\n            .then(function (res) { return res.json(); })\n            .then(function (res) {\n            if (res.success)\n                document.location.href = res.url;\n            else {\n                // TODO: Error Handling\n                console.log(res);\n            }\n        });\n    }\n    else {\n        // TODO: Error Handling\n    }\n}\n\n\n//# sourceURL=webpack://21ai1-webeng-ii-webitor/./src/frontend/login.ts?");

/***/ }),

/***/ "./src/frontend/switchStyle.ts":
/*!*************************************!*\
  !*** ./src/frontend/switchStyle.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports) {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.switchStyle = exports.insertStyleSelector = exports.loadStyleFromCache = void 0;\nvar styles = {\n    light: 'Light Mode',\n    dark: 'Dark Mode',\n    contrast: 'High Contrast Mode',\n    spooky: 'Spooky Mode',\n};\n// Load cached style preference\nfunction loadStyleFromCache() {\n    var styleMode = localStorage.getItem('style');\n    if (styleMode)\n        switchStyle(styleMode);\n}\nexports.loadStyleFromCache = loadStyleFromCache;\nfunction insertStyleSelector(pos, el) {\n    var styleSelector = document.createElement('select');\n    styleSelector.addEventListener('change', function (ev) {\n        switchStyle(styleSelector.value);\n    });\n    for (var key in styles) {\n        var opt = document.createElement('option');\n        opt.value = key;\n        opt.innerText = styles[key];\n        styleSelector.appendChild(opt);\n    }\n    var selected = localStorage.getItem('style');\n    if (selected)\n        styleSelector.value = selected;\n    el.insertAdjacentElement(pos, styleSelector);\n}\nexports.insertStyleSelector = insertStyleSelector;\nfunction switchStyle(mode) {\n    document.body.classList.remove('light', 'dark', 'contrast', 'spooky');\n    document.body.classList.add(mode);\n    localStorage.setItem('style', mode); // Store style preference in cache\n}\nexports.switchStyle = switchStyle;\nexports[\"default\"] = {\n    loadStyleFromCache: loadStyleFromCache,\n    insertStyleSelector: insertStyleSelector,\n    switchStyle: switchStyle,\n};\n\n\n//# sourceURL=webpack://21ai1-webeng-ii-webitor/./src/frontend/switchStyle.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/frontend/login.ts");
/******/ 	
/******/ })()
;