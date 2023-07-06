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

/***/ "./src/frontend/switchStyle.ts":
/*!*************************************!*\
  !*** ./src/frontend/switchStyle.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports) {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.switchStyle = exports.insertStyleSelector = exports.loadStyleFromCache = void 0;\nvar styles = {\n    light: 'Light Mode',\n    dark: 'Dark Mode',\n    contrast: 'High Contrast Mode',\n    spooky: 'Spooky Mode',\n};\n// Load cached style preference\nfunction loadStyleFromCache() {\n    var styleMode = localStorage.getItem('style');\n    if (styleMode)\n        switchStyle(styleMode);\n}\nexports.loadStyleFromCache = loadStyleFromCache;\nfunction insertStyleSelector(pos, el) {\n    var styleSelector = document.createElement('select');\n    for (var key in styles) {\n        var opt = document.createElement('option');\n        opt.value = key;\n        opt.innerText = styles[key];\n        styleSelector.appendChild(opt);\n    }\n    el.insertAdjacentElement(pos, styleSelector);\n}\nexports.insertStyleSelector = insertStyleSelector;\nfunction switchStyle(mode) {\n    document.body.classList.remove('light', 'dark', 'contrast', 'spooky');\n    document.body.classList.add(mode);\n    localStorage.setItem('style', mode); // Store style preference in cache\n}\nexports.switchStyle = switchStyle;\nexports[\"default\"] = {\n    loadStyleFromCache: loadStyleFromCache,\n    insertStyleSelector: insertStyleSelector,\n    switchStyle: switchStyle,\n};\n\n\n//# sourceURL=webpack://21ai1-webeng-ii-webitor/./src/frontend/switchStyle.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/frontend/switchStyle.ts"](0, __webpack_exports__);
/******/ 	
/******/ })()
;