/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/frontend/lang.ts":
/*!******************************!*\
  !*** ./src/frontend/lang.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __values = (this && this.__values) || function(o) {\n    var s = typeof Symbol === \"function\" && Symbol.iterator, m = s && o[s], i = 0;\n    if (m) return m.call(o);\n    if (o && typeof o.length === \"number\") return {\n        next: function () {\n            if (o && i >= o.length) o = void 0;\n            return { value: o && o[i++], done: !o };\n        }\n    };\n    throw new TypeError(s ? \"Object is not iterable.\" : \"Symbol.iterator is not defined.\");\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.langs = exports.emptyHelloWorld = exports.getLangHelloWorld = exports.getLangExtension = void 0;\nvar lang_javascript_1 = __webpack_require__(/*! @codemirror/lang-javascript */ \"@codemirror/lang-javascript\");\nvar lang_python_1 = __webpack_require__(/*! @codemirror/lang-python */ \"@codemirror/lang-python\");\nvar lang_markdown_1 = __webpack_require__(/*! @codemirror/lang-markdown */ \"@codemirror/lang-markdown\");\nvar lang_java_1 = __webpack_require__(/*! @codemirror/lang-java */ \"@codemirror/lang-java\");\nvar lang_json_1 = __webpack_require__(/*! @codemirror/lang-json */ \"@codemirror/lang-json\");\nvar lang_cpp_1 = __webpack_require__(/*! @codemirror/lang-cpp */ \"@codemirror/lang-cpp\");\nvar lang_php_1 = __webpack_require__(/*! @codemirror/lang-php */ \"@codemirror/lang-php\");\nvar lang_css_1 = __webpack_require__(/*! @codemirror/lang-css */ \"@codemirror/lang-css\");\nvar lang_sql_1 = __webpack_require__(/*! @codemirror/lang-sql */ \"@codemirror/lang-sql\");\nvar lang_rust_1 = __webpack_require__(/*! @codemirror/lang-rust */ \"@codemirror/lang-rust\");\nvar lang_xml_1 = __webpack_require__(/*! @codemirror/lang-xml */ \"@codemirror/lang-xml\");\nvar lang_html_1 = __webpack_require__(/*! @codemirror/lang-html */ \"@codemirror/lang-html\");\nvar lang_wast_1 = __webpack_require__(/*! @codemirror/lang-wast */ \"@codemirror/lang-wast\");\nvar codemirror_lang_csharp_1 = __webpack_require__(/*! @replit/codemirror-lang-csharp */ \"@replit/codemirror-lang-csharp\");\nfunction getLangExtension(ext) {\n    var e_1, _a;\n    try {\n        for (var langs_1 = __values(exports.langs), langs_1_1 = langs_1.next(); !langs_1_1.done; langs_1_1 = langs_1.next()) {\n            var lang = langs_1_1.value;\n            if (lang.fileExtensions.includes(ext))\n                return lang.cmExtension();\n        }\n    }\n    catch (e_1_1) { e_1 = { error: e_1_1 }; }\n    finally {\n        try {\n            if (langs_1_1 && !langs_1_1.done && (_a = langs_1.return)) _a.call(langs_1);\n        }\n        finally { if (e_1) throw e_1.error; }\n    }\n    return null;\n}\nexports.getLangExtension = getLangExtension;\nfunction getLangHelloWorld(ext) {\n    var e_2, _a;\n    try {\n        for (var langs_2 = __values(exports.langs), langs_2_1 = langs_2.next(); !langs_2_1.done; langs_2_1 = langs_2.next()) {\n            var lang = langs_2_1.value;\n            if (lang.fileExtensions.includes(ext))\n                return lang.helloWorld;\n        }\n    }\n    catch (e_2_1) { e_2 = { error: e_2_1 }; }\n    finally {\n        try {\n            if (langs_2_1 && !langs_2_1.done && (_a = langs_2.return)) _a.call(langs_2);\n        }\n        finally { if (e_2) throw e_2.error; }\n    }\n    return null;\n}\nexports.getLangHelloWorld = getLangHelloWorld;\nvar singleFileHelloWorld = function (fname, content) { return function (name, editors, conv) {\n    return {\n        _id: undefined,\n        name: name,\n        editors: editors,\n        idCounter: 1,\n        dirs: [],\n        files: [\n            {\n                _id: '0',\n                name: fname,\n                isTextfile: true,\n                content: conv(content),\n            },\n        ],\n    };\n}; };\nvar jsHelloWorld = function (ext) { return singleFileHelloWorld('index.' + ext, 'console.log(\"Hello World\");'); };\nvar emptyHelloWorld = function (name, editors, conv) {\n    return {\n        _id: undefined,\n        name: name,\n        editors: editors,\n        idCounter: 0,\n        dirs: [],\n        files: [],\n    };\n};\nexports.emptyHelloWorld = emptyHelloWorld;\nexports.langs = [\n    {\n        name: 'JavaScript',\n        fileExtensions: ['js', 'mjs'],\n        cmExtension: lang_javascript_1.javascript,\n        helloWorld: jsHelloWorld('js'),\n    },\n    {\n        name: 'TypeScript',\n        fileExtensions: ['ts'],\n        cmExtension: function () { return (0, lang_javascript_1.javascript)({ typescript: true }); },\n        helloWorld: jsHelloWorld('ts'),\n    },\n    {\n        name: 'React',\n        fileExtensions: ['jsx'],\n        cmExtension: function () { return (0, lang_javascript_1.javascript)({ jsx: true }); },\n        helloWorld: null,\n    },\n    {\n        name: 'React + Typescript',\n        fileExtensions: ['tsx'],\n        cmExtension: function () { return (0, lang_javascript_1.javascript)({ jsx: true, typescript: true }); },\n        helloWorld: null,\n    },\n    {\n        name: 'Python',\n        fileExtensions: ['py', 'pyw', 'pyc'],\n        cmExtension: function () { return (0, lang_python_1.python)(); },\n        helloWorld: singleFileHelloWorld('init.py', 'print(\"Hello World\")'),\n    },\n    {\n        name: 'Markdown',\n        fileExtensions: ['md'],\n        cmExtension: function () { return (0, lang_markdown_1.markdown)(); },\n        helloWorld: singleFileHelloWorld('README.md', '# Hello World'),\n    },\n    {\n        name: 'Java',\n        fileExtensions: ['java'],\n        cmExtension: function () { return (0, lang_java_1.java)(); },\n        helloWorld: singleFileHelloWorld('App.java', \"class App {\\n\\tpublic static void main(String[] args) {\\n\\t\\tSystem.out.println(\\\"Hello World\\\");\\n\\t}\\n}\"),\n    },\n    {\n        name: 'JSON',\n        fileExtensions: ['json'],\n        cmExtension: function () { return (0, lang_json_1.json)(); },\n        helloWorld: null,\n    },\n    {\n        name: 'C++',\n        fileExtensions: ['cpp'],\n        cmExtension: function () { return (0, lang_cpp_1.cpp)(); },\n        helloWorld: singleFileHelloWorld('main.cpp', \"#include <iostream>\\n\\nint main()\\n{\\n\\tstd::cout << \\\"Hello World!\\\";\\n\\treturn 0;\\n}\"),\n    },\n    {\n        name: 'PHP',\n        fileExtensions: ['php'],\n        cmExtension: function () { return (0, lang_php_1.php)(); },\n        helloWorld: singleFileHelloWorld('index.html', \"<html>\\n\\t<head></head>\\n\\t<body>\\n\\t\\t<h2>XML-Style</h2>\\n\\t\\t<?php\\n\\t\\t\\techo 'Hello World!';\\n\\t\\t?>\\n\\t</body>\\n</html>\"),\n    },\n    {\n        name: 'CSS',\n        fileExtensions: ['css'],\n        cmExtension: function () { return (0, lang_css_1.css)(); },\n        helloWorld: null,\n    },\n    {\n        name: 'SQL',\n        fileExtensions: ['sql'],\n        cmExtension: function () { return (0, lang_sql_1.sql)(); },\n        helloWorld: null,\n    },\n    {\n        name: 'Rust',\n        fileExtensions: ['rs'],\n        cmExtension: function () { return (0, lang_rust_1.rust)(); },\n        helloWorld: function (name, editors, conv) {\n            // TODO\n            var dirs = [];\n            var files = [\n                {\n                    _id: '0',\n                    name: 'index.',\n                    isTextfile: true,\n                    content: conv(\"console.log(\\\"Hello World\\\");\"),\n                },\n            ];\n            return {\n                _id: undefined,\n                name: name,\n                editors: editors,\n                idCounter: 1,\n                dirs: dirs,\n                files: files,\n            };\n        },\n    },\n    {\n        name: 'XML',\n        fileExtensions: ['xml'],\n        cmExtension: function () { return (0, lang_xml_1.xml)(); },\n        helloWorld: null,\n    },\n    {\n        name: 'HTML',\n        fileExtensions: ['html'],\n        cmExtension: function () { return (0, lang_html_1.html)(); },\n        helloWorld: function (name, editors, conv) {\n            return {\n                _id: undefined,\n                name: name,\n                editors: editors,\n                idCounter: 3,\n                dirs: [],\n                files: [\n                    {\n                        _id: '0',\n                        name: 'index.html',\n                        isTextfile: true,\n                        content: conv(\"<!DOCTYPE html>\\n<html>\\n\\t<head>\\n\\t\\t<link rel=\\\"stylesheet\\\" type=\\\"text/css\\\" href=\\\"style.css\\\" />\\n\\t\\t<script src=\\\"app.js\\\" defer></script>\\n\\t\\t<title>Homepage</title>\\n\\t</head>\\n\\t<body>\\n\\t\\t<h1>Hello World</h1>\\n\\t</body>\\n</html>\"),\n                    },\n                    {\n                        _id: '1',\n                        name: 'style.css',\n                        isTextfile: true,\n                        content: conv(\"body {\\n\\twidth: 100vw;\\n\\theight: 100vh;\\n\\tdisplay: flex;\\n\\talign-items: center;\\n\\tjustify-content: center;\\n}\"),\n                    },\n                    {\n                        _id: '2',\n                        name: 'app.js',\n                        isTextfile: true,\n                        content: conv(\"console.log(\\\"Hello World\\\");\"),\n                    },\n                ],\n            };\n        },\n    },\n    {\n        name: 'Web-Assembly Text',\n        fileExtensions: ['wat'],\n        cmExtension: function () { return (0, lang_wast_1.wast)(); },\n        helloWorld: singleFileHelloWorld('hello.wat', \"(module\\n    ;; Import the required fd_write WASI function which will write the given io vectors to stdout\\n    ;; The function signature for fd_write is:\\n    ;; (File Descriptor, *iovs, iovs_len, nwritten) -> Returns number of bytes written\\n    (import \\\"wasi_unstable\\\" \\\"fd_write\\\" (func $fd_write (param i32 i32 i32 i32) (result i32)))\\n\\n    (memory 1)\\n    (export \\\"memory\\\" (memory 0))\\n\\n    ;; Write 'hello world\\n' to memory at an offset of 8 bytes\\n    ;; Note the trailing newline which is required for the text to appear\\n    (data (i32.const 8) \\\"hello world\\n\\\")\\n\\n    (func $main (export \\\"_start\\\")\\n        ;; Creating a new io vector within linear memory\\n        (i32.store (i32.const 0) (i32.const 8))  ;; iov.iov_base - This is a pointer to the start of the 'hello world\\n' string\\n        (i32.store (i32.const 4) (i32.const 12))  ;; iov.iov_len - The length of the 'hello world\\n' string\\n\\n        (call $fd_write\\n            (i32.const 1) ;; file_descriptor - 1 for stdout\\n            (i32.const 0) ;; *iovs - The pointer to the iov array, which is stored at memory location 0\\n            (i32.const 1) ;; iovs_len - We're printing 1 string stored in an iov - so one.\\n            (i32.const 20) ;; nwritten - A place in memory to store the number of bytes written\\n        )\\n        drop ;; Discard the number of bytes written from the top of the stack\\n    )\\n)\"),\n    },\n    {\n        name: 'C-Sharp',\n        fileExtensions: ['cs'],\n        cmExtension: function () { return (0, codemirror_lang_csharp_1.csharp)(); },\n        helloWorld: singleFileHelloWorld('App.cs', \"using System;\\n\\nnamespace App\\n{\\n    class HelloWorldProgram\\n\\t{\\n        static void Main(string[] args)\\n\\t\\t{\\n\\t\\t    Console.WriteLine(\\\"Hello World!\\\");\\n        }\\n    }\\n}\"),\n    },\n];\nexports[\"default\"] = {\n    getLangExtension: getLangExtension,\n    getLangHelloWorld: getLangHelloWorld,\n    emptyHelloWorld: exports.emptyHelloWorld,\n    langs: exports.langs,\n};\n\n\n//# sourceURL=webpack://21ai1-webeng-ii-webitor/./src/frontend/lang.ts?");

/***/ }),

/***/ "./src/models.ts":
/*!***********************!*\
  !*** ./src/models.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar mongoose_1 = __importDefault(__webpack_require__(/*! mongoose */ \"mongoose\"));\nvar Schema = mongoose_1.default.Schema;\nvar ObjectId = mongoose_1.default.Types.ObjectId;\n// File contents are stored as buffers instead of strings, because we might receive a binary file (that can't be stored as a valid string) in an upload\nvar workspaceSchema = new Schema({\n    name: String,\n    dirs: [Object],\n    files: [Object],\n    editors: [{ type: ObjectId, ref: 'userModel' }],\n    idCounter: Number,\n}, { timestamps: true });\nvar userSchema = new Schema({\n    name: String,\n    pass: String,\n    anon: Boolean,\n    workspaces: [{ type: ObjectId, ref: 'workspaceModel' }],\n}, { timestamps: true });\nexports[\"default\"] = {\n    workspace: mongoose_1.default.model('workspaceModel', workspaceSchema),\n    user: mongoose_1.default.model('userModel', userSchema),\n};\n\n\n//# sourceURL=webpack://21ai1-webeng-ii-webitor/./src/models.ts?");

/***/ }),

/***/ "./src/server.ts":
/*!***********************!*\
  !*** ./src/server.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __assign = (this && this.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    var desc = Object.getOwnPropertyDescriptor(m, k);\n    if (!desc || (\"get\" in desc ? !m.__esModule : desc.writable || desc.configurable)) {\n      desc = { enumerable: true, get: function() { return m[k]; } };\n    }\n    Object.defineProperty(o, k2, desc);\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __generator = (this && this.__generator) || function (thisArg, body) {\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\n    function verb(n) { return function (v) { return step([n, v]); }; }\n    function step(op) {\n        if (f) throw new TypeError(\"Generator is already executing.\");\n        while (g && (g = 0, op[0] && (_ = 0)), _) try {\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\n            if (y = 0, t) op = [op[0] & 2, t.value];\n            switch (op[0]) {\n                case 0: case 1: t = op; break;\n                case 4: _.label++; return { value: op[1], done: false };\n                case 5: _.label++; y = op[1]; op = [0]; continue;\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\n                default:\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\n                    if (t[2]) _.ops.pop();\n                    _.trys.pop(); continue;\n            }\n            op = body.call(thisArg, _);\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\n    }\n};\nvar __asyncValues = (this && this.__asyncValues) || function (o) {\n    if (!Symbol.asyncIterator) throw new TypeError(\"Symbol.asyncIterator is not defined.\");\n    var m = o[Symbol.asyncIterator], i;\n    return m ? m.call(o) : (o = typeof __values === \"function\" ? __values(o) : o[Symbol.iterator](), i = {}, verb(\"next\"), verb(\"throw\"), verb(\"return\"), i[Symbol.asyncIterator] = function () { return this; }, i);\n    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }\n    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }\n};\nvar __values = (this && this.__values) || function(o) {\n    var s = typeof Symbol === \"function\" && Symbol.iterator, m = s && o[s], i = 0;\n    if (m) return m.call(o);\n    if (o && typeof o.length === \"number\") return {\n        next: function () {\n            if (o && i >= o.length) o = void 0;\n            return { value: o && o[i++], done: !o };\n        }\n    };\n    throw new TypeError(s ? \"Object is not iterable.\" : \"Symbol.iterator is not defined.\");\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar process_1 = __importDefault(__webpack_require__(/*! process */ \"process\")); // for accessing environment variables\nvar path_1 = __importDefault(__webpack_require__(/*! path */ \"path\")); // for creating correct File-Descriptors on the given OS\nvar promises_1 = __importDefault(__webpack_require__(/*! fs/promises */ \"fs/promises\")); // for reading uploaded files from tmp dir\nvar fs_1 = __webpack_require__(/*! fs */ \"fs\");\nvar crypto_1 = __importDefault(__webpack_require__(/*! crypto */ \"crypto\")); // for generating authentication tokens\n(__webpack_require__(/*! dotenv */ \"dotenv\").config)({ path: path_1.default.join(__dirname, '..', 'config.env'), override: false }); // for loading environment variables from '.env'\nvar mongoose_1 = __importDefault(__webpack_require__(/*! mongoose */ \"mongoose\")); // for connecting with MongoDB\nvar express_1 = __importDefault(__webpack_require__(/*! express */ \"express\")); // Web-Server Framework, that is being used\nvar app = (0, express_1.default)();\nvar cookie_parser_1 = __importDefault(__webpack_require__(/*! cookie-parser */ \"cookie-parser\")); // for parsing cookies\nvar bcrypt_1 = __importDefault(__webpack_require__(/*! bcrypt */ \"bcrypt\")); // for cryptographically secure password-hashing\nvar formidable_1 = __importDefault(__webpack_require__(/*! formidable */ \"formidable\")); // for uploading files\nvar models_1 = __importDefault(__webpack_require__(/*! ./models */ \"./src/models.ts\")); // Models for MongoDB\nvar workspace_1 = __importDefault(__webpack_require__(/*! ./util/workspace */ \"./src/util/workspace.ts\")); // Utility methods for working with the workspace-directory-tree\nvar archiver_1 = __importDefault(__webpack_require__(/*! archiver */ \"archiver\")); // For archiving workspace in a single zip-file\nvar path_2 = __webpack_require__(/*! path */ \"path\");\nvar lang_1 = __importStar(__webpack_require__(/*! ./frontend/lang */ \"./src/frontend/lang.ts\"));\n/**\n * @param {archiver.Archiver} Archiver The Archiver used to archive the directory\n * @param {*} dir The workspace directory to archive\n * @param {String} path The path from the workspace root to this directory\n */\nfunction archiveDir(Archiver, dir, path) {\n    var e_1, _a, e_2, _b;\n    if (path === void 0) { path = '/'; }\n    try {\n        for (var _c = __values(dir.files), _d = _c.next(); !_d.done; _d = _c.next()) {\n            var file = _d.value;\n            // @performance\n            // There must be a better way than to convert the binary blob into a string and then back into a binary buffer\n            Archiver.append(Buffer.from(file.content.toString(), 'utf-8'), { name: (0, path_2.join)(path, file.name) });\n        }\n    }\n    catch (e_1_1) { e_1 = { error: e_1_1 }; }\n    finally {\n        try {\n            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);\n        }\n        finally { if (e_1) throw e_1.error; }\n    }\n    try {\n        for (var _e = __values(dir.dirs), _f = _e.next(); !_f.done; _f = _e.next()) {\n            var d = _f.value;\n            archiveDir(Archiver, d, (0, path_2.join)(path, dir.name));\n        }\n    }\n    catch (e_2_1) { e_2 = { error: e_2_1 }; }\n    finally {\n        try {\n            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);\n        }\n        finally { if (e_2) throw e_2.error; }\n    }\n}\nfunction utf8_to_b64(s) {\n    return Buffer.from(s).toString('base64');\n}\n// Shortcut-constants:\nvar ENV = process_1.default.env;\nvar publicPath = path_1.default.join(__dirname, '..', 'public');\nvar tmpDir = path_1.default.join(__dirname, '..', 'tmp');\nif (!(0, fs_1.existsSync)(publicPath))\n    promises_1.default.mkdir(publicPath);\nif (!(0, fs_1.existsSync)(tmpDir))\n    promises_1.default.mkdir(tmpDir);\n// Global Read-Only Variables\nvar SALT_ROUNDS = 10;\nvar MAX_AUTH_TIME = 1000 * 60 * 60 * 12 * 5; // 5 days (in ms)\nvar MAX_URL_COOKIE_TIME = 1000 * 60 * 60 * 12 * 2; // 2 days (in ms)\n// Global State\nvar AUTH_TOKS = {};\nfunction genRandStr(size, encoding) {\n    if (size === void 0) { size = 32; }\n    if (encoding === void 0) { encoding = 'hex'; }\n    return crypto_1.default.randomBytes(size).toString(encoding);\n}\n// Connect to MongoDB\nfunction connectDB() {\n    return __awaiter(this, void 0, void 0, function () {\n        var mongoURI, db;\n        return __generator(this, function (_a) {\n            switch (_a.label) {\n                case 0:\n                    mongoURI = \"mongodb+srv://\".concat(ENV.DB_USER, \":\").concat(ENV.DB_PASS, \"@cluster0.91saw3c.mongodb.net/?retryWrites=true&w=majority\");\n                    return [4 /*yield*/, mongoose_1.default.connect(mongoURI)];\n                case 1:\n                    db = _a.sent();\n                    console.log(\"MongoDB connected: \".concat(db.connection.host));\n                    return [2 /*return*/];\n            }\n        });\n    });\n}\nconnectDB();\n// Load middleware for Express Framework\napp.use('/public', express_1.default.static(publicPath));\napp.use(express_1.default.json());\napp.use((0, cookie_parser_1.default)(ENV.SECRET));\n/**\n *\n * @param {String} fileOnAuth The File to respond with if the user is authenticated\n * @param {String} fileOnErr The File to respond with if the user isn't authenticated\n * @param {Boolean} inPublicDir Whether the files are assumed to be in the public directory.\n * @returns\n */\nfunction simpleAuthCheck(fileOnAuth, fileOnErr, inPublicDir) {\n    var _this = this;\n    if (inPublicDir === void 0) { inPublicDir = true; }\n    if (inPublicDir) {\n        fileOnAuth = path_1.default.join(publicPath, fileOnAuth);\n        fileOnErr = path_1.default.join(publicPath, fileOnErr);\n    }\n    return function (req, res) { return __awaiter(_this, void 0, void 0, function () {\n        return __generator(this, function (_a) {\n            switch (_a.label) {\n                case 0: return [4 /*yield*/, checkAuth(req, res)];\n                case 1:\n                    if (_a.sent())\n                        res.sendFile(fileOnAuth);\n                    else\n                        res.sendFile(fileOnErr);\n                    return [2 /*return*/];\n            }\n        });\n    }); };\n}\nfunction checkAuth(req, res, authAsAnon) {\n    if (authAsAnon === void 0) { authAsAnon = true; }\n    return __awaiter(this, void 0, void 0, function () {\n        var authTok;\n        return __generator(this, function (_a) {\n            switch (_a.label) {\n                case 0:\n                    authTok = req.signedCookies['auth'];\n                    req.userId = AUTH_TOKS[authTok];\n                    if (!!AUTH_TOKS[authTok]) return [3 /*break*/, 2];\n                    if (!authAsAnon)\n                        return [2 /*return*/, false];\n                    return [4 /*yield*/, createUser()];\n                case 1:\n                    authTok = _a.sent();\n                    setAuthCookie(res, authTok);\n                    _a.label = 2;\n                case 2:\n                    req.userId = AUTH_TOKS[authTok];\n                    res.cookie('redirectUrl', '');\n                    return [2 /*return*/, true];\n            }\n        });\n    });\n}\nfunction isAnon(userId) {\n    return __awaiter(this, void 0, void 0, function () {\n        return __generator(this, function (_a) {\n            return [2 /*return*/, models_1.default.user\n                    .findById(userId)\n                    .then(function (user) { var _a; return (_a = user === null || user === void 0 ? void 0 : user.anon) !== null && _a !== void 0 ? _a : false; })\n                    .catch(function (e) { return false; })];\n        });\n    });\n}\nvar ANON_USER_LIFETIME = 1000 * 60 * 60 * 12 * 4; // 4 days\nvar ANON_RM_INTERVAL = 1000 * 60 * 60 * 6; // 6 hours\nfunction rmAnonUsers(before) {\n    if (before === void 0) { before = Date.now() - ANON_USER_LIFETIME; }\n    return __awaiter(this, void 0, void 0, function () {\n        return __generator(this, function (_a) {\n            return [2 /*return*/, models_1.default.user.deleteMany({ anon: true, updatedAt: { $lte: before } })];\n        });\n    });\n}\n// req.userId holds the user ID or an error is raised\nfunction forceAuth(req, res, next) {\n    return __awaiter(this, void 0, void 0, function () {\n        return __generator(this, function (_a) {\n            switch (_a.label) {\n                case 0: return [4 /*yield*/, checkAuth(req, res, false)];\n                case 1:\n                    if (_a.sent())\n                        next();\n                    else\n                        next(new Error('Unauthenticated'));\n                    return [2 /*return*/];\n            }\n        });\n    });\n}\nfunction authErrRedirect(err, req, res, next) {\n    if (req.userId === null) {\n        res.cookie('redirectUrl', req.originalUrl, { maxAge: MAX_URL_COOKIE_TIME }).redirect('/login');\n    }\n    else {\n        next(err);\n    }\n}\nfunction authErrJSON(obj) {\n    if (obj === void 0) { obj = {}; }\n    return function (err, req, res, next) {\n        if (req.userId === null) {\n            res.json(__assign(__assign({}, obj), { success: false, err: 'Not Authenticated' }));\n        }\n        else {\n            next(err);\n        }\n    };\n}\nfunction createUser(name, pass, anon) {\n    if (name === void 0) { name = null; }\n    if (pass === void 0) { pass = null; }\n    if (anon === void 0) { anon = name === null || pass === null; }\n    return __awaiter(this, void 0, void 0, function () {\n        var hashedPass, newUser, authTok;\n        return __generator(this, function (_a) {\n            switch (_a.label) {\n                case 0:\n                    if (!name)\n                        name = genRandStr(24, 'utf-8');\n                    if (!pass)\n                        pass = genRandStr(24, 'utf-8');\n                    return [4 /*yield*/, bcrypt_1.default.hash(pass, SALT_ROUNDS)];\n                case 1:\n                    hashedPass = _a.sent();\n                    return [4 /*yield*/, models_1.default.user.create({ name: name, pass: hashedPass, anon: anon, workspaces: [] })];\n                case 2:\n                    newUser = _a.sent();\n                    authTok = genRandStr(32, 'hex');\n                    AUTH_TOKS[authTok] = newUser._id;\n                    return [2 /*return*/, authTok];\n            }\n        });\n    });\n}\nfunction setAuthCookie(res, authTok) {\n    return res.cookie('auth', authTok, { signed: true, maxAge: MAX_AUTH_TIME, sameSite: 'strict', httpOnly: true });\n}\nfunction transferAnonWorkspaces(req, newAuthTok) {\n    return __awaiter(this, void 0, void 0, function () {\n        var oldAuthTok, oldUserId, oldUser, newUserId, newUser, _a, _b, wsId;\n        var e_3, _c;\n        return __generator(this, function (_d) {\n            switch (_d.label) {\n                case 0:\n                    oldAuthTok = req.signedCookies['auth'];\n                    oldUserId = AUTH_TOKS[oldAuthTok];\n                    if (!oldUserId)\n                        return [2 /*return*/];\n                    return [4 /*yield*/, models_1.default.user.findById(oldUserId)];\n                case 1:\n                    oldUser = _d.sent();\n                    if (!(oldUser === null || oldUser === void 0 ? void 0 : oldUser.anon))\n                        return [2 /*return*/];\n                    newUserId = AUTH_TOKS[newAuthTok];\n                    return [4 /*yield*/, models_1.default.user.findById(newUserId)];\n                case 2:\n                    newUser = _d.sent();\n                    try {\n                        for (_a = __values(oldUser.workspaces), _b = _a.next(); !_b.done; _b = _a.next()) {\n                            wsId = _b.value;\n                            models_1.default.workspace.findByIdAndUpdate(wsId, { editors: [newUserId] });\n                            newUser === null || newUser === void 0 ? void 0 : newUser.workspaces.push(wsId);\n                        }\n                    }\n                    catch (e_3_1) { e_3 = { error: e_3_1 }; }\n                    finally {\n                        try {\n                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);\n                        }\n                        finally { if (e_3) throw e_3.error; }\n                    }\n                    newUser === null || newUser === void 0 ? void 0 : newUser.save();\n                    return [2 /*return*/];\n            }\n        });\n    });\n}\n// Set up Routing\napp.get('/', function (req, res) {\n    res.sendFile(path_1.default.join(publicPath, 'index.html'));\n})\n    .get('/favicon.ico', function (req, res) {\n    res.sendFile(path_1.default.join(publicPath, 'logo3.ico'));\n})\n    .get('/editor', function (req, res) {\n    res.sendFile(path_1.default.join(publicPath, 'editor.html'));\n})\n    .get('/login', function (req, res) {\n    res.sendFile(path_1.default.join(publicPath, 'login.html'));\n})\n    .post('/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {\n    var name, pass, newURL, authTok;\n    return __generator(this, function (_a) {\n        switch (_a.label) {\n            case 0:\n                name = req.body.name || null;\n                pass = req.body.pass || null;\n                newURL = req.cookies['redirectUrl'] || '/';\n                res.clearCookie('redirectUrl');\n                if (!name || !pass) {\n                    return [2 /*return*/, res.status(418).json({ success: false, err: 'Invalid Username or Password.' })];\n                }\n                if (Buffer.from(pass, 'utf-8').byteLength > 72) {\n                    return [2 /*return*/, res.status(418).json({ success: false, err: 'Password is not allowed to be more than 72 bytes long (Note: some characters take more than 1 byte).' })];\n                }\n                return [4 /*yield*/, models_1.default.user.exists({ name: name })];\n            case 1:\n                if ((_a.sent()) != null) {\n                    return [2 /*return*/, res.status(418).json({ success: false, err: 'Username is already taken' })];\n                }\n                return [4 /*yield*/, createUser(name, pass, false)];\n            case 2:\n                authTok = _a.sent();\n                transferAnonWorkspaces(req, authTok);\n                return [2 /*return*/, setAuthCookie(res, authTok).status(200).json({ success: true, url: newURL })];\n        }\n    });\n}); })\n    .post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {\n    var name, pass, newURL, user, cmpRes, authTok;\n    return __generator(this, function (_a) {\n        switch (_a.label) {\n            case 0:\n                name = req.body.name || null;\n                pass = req.body.pass || null;\n                newURL = req.cookies['redirectUrl'] || '/';\n                res.clearCookie('redirectUrl');\n                if (!name || !pass) {\n                    return [2 /*return*/, res.status(418).json({ success: false, err: 'Invalid Username or Password.', url: null })];\n                }\n                if (Buffer.from(pass, 'utf-8').byteLength > 72) {\n                    return [2 /*return*/, res.status(418).json({ success: false, err: 'Password is not allowed to be more than 72 bytes long (Note: some characters take more than 1 byte).', url: null })];\n                }\n                return [4 /*yield*/, models_1.default.user.findOne({ name: name })];\n            case 1:\n                user = _a.sent();\n                if (!user) {\n                    return [2 /*return*/, res.status(418).json({ err: 'Wrong username.', success: false, url: null })];\n                }\n                return [4 /*yield*/, bcrypt_1.default.compare(pass, user.pass)];\n            case 2:\n                cmpRes = _a.sent();\n                if (!cmpRes) {\n                    return [2 /*return*/, res.status(418).json({ err: 'Wrong password.', success: false, url: null })];\n                }\n                authTok = genRandStr(32, 'hex');\n                AUTH_TOKS[authTok] = user._id;\n                transferAnonWorkspaces(req, authTok);\n                return [2 /*return*/, setAuthCookie(res, authTok).status(200).json({ success: true, url: newURL })];\n        }\n    });\n}); })\n    .get('/workspaces', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {\n    var user, workspaces, _a, _b, _c, workspaceId, workspace, e_4_1, anon;\n    var _d, e_4, _e, _f;\n    var _g;\n    return __generator(this, function (_h) {\n        switch (_h.label) {\n            case 0: return [4 /*yield*/, checkAuth(req, res, true)];\n            case 1:\n                if (!(_h.sent()))\n                    return [2 /*return*/, res.json({ success: false, err: 'Not authenticated' })];\n                return [4 /*yield*/, models_1.default.user.findById(req.userId)];\n            case 2:\n                user = _h.sent();\n                workspaces = [];\n                _h.label = 3;\n            case 3:\n                _h.trys.push([3, 11, 12, 17]);\n                _a = true, _b = __asyncValues((_g = user === null || user === void 0 ? void 0 : user.workspaces) !== null && _g !== void 0 ? _g : []);\n                _h.label = 4;\n            case 4: return [4 /*yield*/, _b.next()];\n            case 5:\n                if (!(_c = _h.sent(), _d = _c.done, !_d)) return [3 /*break*/, 10];\n                _f = _c.value;\n                _a = false;\n                _h.label = 6;\n            case 6:\n                _h.trys.push([6, , 8, 9]);\n                workspaceId = _f;\n                return [4 /*yield*/, models_1.default.workspace.findById(workspaceId)];\n            case 7:\n                workspace = _h.sent();\n                if (workspace !== null)\n                    workspaces.push(workspace);\n                return [3 /*break*/, 9];\n            case 8:\n                _a = true;\n                return [7 /*endfinally*/];\n            case 9: return [3 /*break*/, 4];\n            case 10: return [3 /*break*/, 17];\n            case 11:\n                e_4_1 = _h.sent();\n                e_4 = { error: e_4_1 };\n                return [3 /*break*/, 17];\n            case 12:\n                _h.trys.push([12, , 15, 16]);\n                if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 14];\n                return [4 /*yield*/, _e.call(_b)];\n            case 13:\n                _h.sent();\n                _h.label = 14;\n            case 14: return [3 /*break*/, 16];\n            case 15:\n                if (e_4) throw e_4.error;\n                return [7 /*endfinally*/];\n            case 16: return [7 /*endfinally*/];\n            case 17: return [4 /*yield*/, isAnon(req.userId)];\n            case 18:\n                anon = _h.sent();\n                return [2 /*return*/, res.json({ success: true, workspaces: workspaces, anon: anon })];\n        }\n    });\n}); })\n    .post('/create/:workspaceName/:languageExt', [forceAuth, authErrJSON()], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {\n    var userId, workspaceName, ext, helloWorld, workspace;\n    return __generator(this, function (_a) {\n        switch (_a.label) {\n            case 0:\n                userId = req.userId;\n                workspaceName = req.params.workspaceName;\n                ext = req.params.languageExt;\n                helloWorld = null;\n                if (ext === 'empty')\n                    helloWorld = lang_1.emptyHelloWorld;\n                else {\n                    helloWorld = lang_1.default.getLangHelloWorld(ext);\n                    if (!helloWorld)\n                        return [2 /*return*/, res.json({ success: false, err: 'Unknown Language provided' })];\n                }\n                console.log({ ext: ext, helloWorld: helloWorld.toString() });\n                return [4 /*yield*/, models_1.default.workspace.create(helloWorld(workspaceName, [userId], utf8_to_b64))];\n            case 1:\n                workspace = _a.sent();\n                return [4 /*yield*/, models_1.default.user.findByIdAndUpdate(userId, { $push: { workspaces: workspace._id } })];\n            case 2:\n                _a.sent();\n                return [2 /*return*/, res.json({ success: true, workspaceId: workspace._id })];\n        }\n    });\n}); })\n    .post('/upload/:workspaceName', [forceAuth, authErrJSON()], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {\n    var workspaceName, form;\n    return __generator(this, function (_a) {\n        workspaceName = req.params.workspaceName;\n        form = (0, formidable_1.default)({\n            keepExtensions: true,\n            multiples: true,\n            filter: function (_a) {\n                var name = _a.name, originalFilename = _a.originalFilename, mimetype = _a.mimetype;\n                // TODO: Filter certain ignored files\n                // For example: filter all files in a .git folder\n                return true; // no filter yet\n            },\n            uploadDir: tmpDir,\n        });\n        form.parse(req, function (err, fields, files) { return __awaiter(void 0, void 0, void 0, function () {\n            var idCounter, tmpRoot, _a, _b, _c, f, pathParts, content, isTextfile, file, parentDir, pathParts_1, pathParts_1_1, dname, e_5_1, flattenDir, root, workspaceDoc;\n            var e_6, _d;\n            var _e, e_5, _f, _g;\n            var _h;\n            return __generator(this, function (_j) {\n                switch (_j.label) {\n                    case 0:\n                        // TODO: Better error handling\n                        if (err)\n                            throw err;\n                        idCounter = 0;\n                        tmpRoot = { _id: undefined, name: workspaceName, files: [], dirs: {} };\n                        if (!Array.isArray(files.file))\n                            files.file = [files.file];\n                        _j.label = 1;\n                    case 1:\n                        _j.trys.push([1, 9, 10, 15]);\n                        _a = true, _b = __asyncValues(files.file);\n                        _j.label = 2;\n                    case 2: return [4 /*yield*/, _b.next()];\n                    case 3:\n                        if (!(_c = _j.sent(), _e = _c.done, !_e)) return [3 /*break*/, 8];\n                        _g = _c.value;\n                        _a = false;\n                        _j.label = 4;\n                    case 4:\n                        _j.trys.push([4, , 6, 7]);\n                        f = _g;\n                        if (!f)\n                            return [3 /*break*/, 7];\n                        pathParts = ((_h = f.originalFilename) !== null && _h !== void 0 ? _h : '').split('/');\n                        return [4 /*yield*/, promises_1.default.readFile(f.filepath)];\n                    case 5:\n                        content = _j.sent();\n                        isTextfile = workspace_1.default.checkIfTextFile(content);\n                        file = { name: pathParts.pop(), content: content, isTextfile: isTextfile, _id: idCounter.toString() };\n                        idCounter++;\n                        promises_1.default.rm(f.filepath); // Doesn't need to be awaited bc it doesn't matter when the deletion is done\n                        parentDir = tmpRoot;\n                        try {\n                            for (pathParts_1 = (e_6 = void 0, __values(pathParts)), pathParts_1_1 = pathParts_1.next(); !pathParts_1_1.done; pathParts_1_1 = pathParts_1.next()) {\n                                dname = pathParts_1_1.value;\n                                if (!parentDir.dirs[dname])\n                                    parentDir.dirs[dname] = { name: dname, files: [], dirs: {}, _id: idCounter.toString() };\n                                parentDir = parentDir.dirs[dname];\n                                idCounter++;\n                            }\n                        }\n                        catch (e_6_1) { e_6 = { error: e_6_1 }; }\n                        finally {\n                            try {\n                                if (pathParts_1_1 && !pathParts_1_1.done && (_d = pathParts_1.return)) _d.call(pathParts_1);\n                            }\n                            finally { if (e_6) throw e_6.error; }\n                        }\n                        parentDir.files.push(file);\n                        return [3 /*break*/, 7];\n                    case 6:\n                        _a = true;\n                        return [7 /*endfinally*/];\n                    case 7: return [3 /*break*/, 2];\n                    case 8: return [3 /*break*/, 15];\n                    case 9:\n                        e_5_1 = _j.sent();\n                        e_5 = { error: e_5_1 };\n                        return [3 /*break*/, 15];\n                    case 10:\n                        _j.trys.push([10, , 13, 14]);\n                        if (!(!_a && !_e && (_f = _b.return))) return [3 /*break*/, 12];\n                        return [4 /*yield*/, _f.call(_b)];\n                    case 11:\n                        _j.sent();\n                        _j.label = 12;\n                    case 12: return [3 /*break*/, 14];\n                    case 13:\n                        if (e_5) throw e_5.error;\n                        return [7 /*endfinally*/];\n                    case 14: return [7 /*endfinally*/];\n                    case 15:\n                        flattenDir = function (dir) {\n                            var subdirIds = Object.values(dir.dirs).map(function (d) { return flattenDir(d); });\n                            return {\n                                _id: dir._id,\n                                name: dir.name,\n                                dirs: subdirIds,\n                                files: dir.files,\n                            };\n                        };\n                        root = flattenDir(tmpRoot);\n                        if (!root.files.length && !root.dirs.length) {\n                            return [2 /*return*/, res.json({ success: false, id: null })];\n                        }\n                        return [4 /*yield*/, models_1.default.workspace.create({ name: workspaceName, dirs: root.dirs, files: root.files, editors: [req.userId], idCounter: idCounter })];\n                    case 16:\n                        workspaceDoc = _j.sent();\n                        return [4 /*yield*/, models_1.default.user.updateOne({ _id: req.userId }, { $push: { workspaces: workspaceDoc._id } })];\n                    case 17:\n                        _j.sent();\n                        res.json({ success: true, id: workspaceDoc._id });\n                        return [2 /*return*/];\n                }\n            });\n        }); });\n        return [2 /*return*/];\n    });\n}); })\n    .post('/empty/workspace', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {\n    var workspace;\n    return __generator(this, function (_a) {\n        switch (_a.label) {\n            case 0: return [4 /*yield*/, checkAuth(req, res, true)];\n            case 1:\n                if (!(_a.sent()))\n                    return [2 /*return*/, res.json({ success: false })];\n                return [4 /*yield*/, models_1.default.workspace.create({ name: 'Unnamed', dirs: [], files: [], editors: [req.userId] })];\n            case 2:\n                workspace = _a.sent();\n                return [4 /*yield*/, models_1.default.user.updateOne({ _id: req.userId }, { $push: { workspaces: workspace._id } })];\n            case 3:\n                _a.sent();\n                return [2 /*return*/, res.json({ success: true, workspaceId: workspace._id })];\n        }\n    });\n}); })\n    .get('/download/:workspaceId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {\n    var workspace, Zipper;\n    return __generator(this, function (_a) {\n        switch (_a.label) {\n            case 0: return [4 /*yield*/, checkAuth(req, res)];\n            case 1:\n                if (!(_a.sent()))\n                    return [2 /*return*/, res.status(401).end()];\n                return [4 /*yield*/, models_1.default.workspace.findById(req.params.workspaceId)];\n            case 2:\n                workspace = _a.sent();\n                if (!(workspace === null || workspace === void 0 ? void 0 : workspace.editors.includes(req.userId)))\n                    return [2 /*return*/, res.status(401).end()];\n                res.setHeader('content-type', 'application/zip, application/octet-stream');\n                res.setHeader('content-disposition', \"attachment;filename=\\\"\".concat(workspace.name, \".zip\\\"\"));\n                res.setHeader('content-description', 'File Transfer');\n                res.setHeader('content-transfer-encoding', 'binary');\n                Zipper = archiver_1.default.create('zip');\n                res.on('finish', function () {\n                    res.end();\n                });\n                Zipper.on('warning', function (w) { return console.log({ warning: w }); });\n                Zipper.on('error', function (e) { return console.log({ error: e }); });\n                Zipper.pipe(res);\n                archiveDir(Zipper, workspace);\n                Zipper.finalize();\n                return [2 /*return*/];\n        }\n    });\n}); })\n    .get('/workspace/:workspaceId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {\n    var workspace;\n    return __generator(this, function (_a) {\n        switch (_a.label) {\n            case 0: return [4 /*yield*/, checkAuth(req, res, false)];\n            case 1:\n                if (!(_a.sent()))\n                    return [2 /*return*/, res.json({ success: false })];\n                return [4 /*yield*/, models_1.default.workspace.findById(req.params.workspaceId)];\n            case 2:\n                workspace = _a.sent();\n                res.json({ success: true, root: workspace });\n                return [2 /*return*/];\n        }\n    });\n}); })\n    .put('/workspace/file/:workspaceId/:fileId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {\n    var workspace, file, mongooseRes, e_7;\n    return __generator(this, function (_a) {\n        switch (_a.label) {\n            case 0: return [4 /*yield*/, checkAuth(req, res, false)];\n            case 1:\n                // New File Content should be the body\n                // TODO: Error Handling\n                if (!(_a.sent()))\n                    return [2 /*return*/, res.json({ success: false })];\n                _a.label = 2;\n            case 2:\n                _a.trys.push([2, 5, , 6]);\n                return [4 /*yield*/, models_1.default.workspace.findById(req.params.workspaceId)];\n            case 3:\n                workspace = _a.sent();\n                file = workspace_1.default.findFileById(workspace, req.params.fileId);\n                if (file)\n                    file.content = Buffer.from(req.body.text, 'base64');\n                return [4 /*yield*/, (workspace === null || workspace === void 0 ? void 0 : workspace.updateOne({ files: workspace.files, dirs: workspace.dirs }))];\n            case 4:\n                mongooseRes = _a.sent();\n                res.json({ success: mongooseRes.acknowledged });\n                return [3 /*break*/, 6];\n            case 5:\n                e_7 = _a.sent();\n                console.error(e_7);\n                res.json({ success: false, err: 'Internal Error' });\n                return [3 /*break*/, 6];\n            case 6: return [2 /*return*/];\n        }\n    });\n}); })\n    .delete('/workspace/:workspaceId/:fileOrDirId', [forceAuth, authErrJSON()], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {\n    var workspace, deleted, e_8;\n    return __generator(this, function (_a) {\n        switch (_a.label) {\n            case 0:\n                _a.trys.push([0, 3, , 4]);\n                return [4 /*yield*/, models_1.default.workspace.findById(req.params.workspaceId)];\n            case 1:\n                workspace = _a.sent();\n                deleted = workspace_1.default.deleteById(workspace, req.params.fileOrDirId);\n                if (!deleted) {\n                    return [2 /*return*/, res.json({ success: false, err: 'File or Directory with ID ' + req.params.fileOrDirId + \" doesn't exist\" })];\n                }\n                return [4 /*yield*/, (workspace === null || workspace === void 0 ? void 0 : workspace.save())];\n            case 2:\n                _a.sent();\n                res.json({ success: true });\n                return [3 /*break*/, 4];\n            case 3:\n                e_8 = _a.sent();\n                console.error(e_8);\n                res.json({ success: false, err: 'Internal Error' });\n                return [3 /*break*/, 4];\n            case 4: return [2 /*return*/];\n        }\n    });\n}); })\n    // TODO: Decide which API is better to work with for the frontend\n    // 1. /:workspaceId/:parentDirId with body == filename\n    // 2. /:workspaceId with body == path for new file (including filename)\n    .post('/workspace/file/:workspaceId', [forceAuth, authErrJSON()], function (req, res) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {\n    return [2 /*return*/];\n}); }); })\n    .post('/workspace/dir/:workspaceId', [forceAuth, authErrJSON()], function (req, res) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {\n    return [2 /*return*/];\n}); }); }); // Body contains path for new directory\n// Start Server\napp.listen(ENV.PORT, function () { return console.log(\"Server listening on port \".concat(ENV.PORT, \"...\")); });\nrmAnonUsers(Date.now()).then(function () { return setInterval(rmAnonUsers, ANON_RM_INTERVAL); });\n\n\n//# sourceURL=webpack://21ai1-webeng-ii-webitor/./src/server.ts?");

/***/ }),

/***/ "./src/util/workspace.ts":
/*!*******************************!*\
  !*** ./src/util/workspace.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports) {

eval("\nvar __values = (this && this.__values) || function(o) {\n    var s = typeof Symbol === \"function\" && Symbol.iterator, m = s && o[s], i = 0;\n    if (m) return m.call(o);\n    if (o && typeof o.length === \"number\") return {\n        next: function () {\n            if (o && i >= o.length) o = void 0;\n            return { value: o && o[i++], done: !o };\n        }\n    };\n    throw new TypeError(s ? \"Object is not iterable.\" : \"Symbol.iterator is not defined.\");\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.deleteById = exports.deleteDirById = exports.deleteFileById = exports.findDirById = exports.findFileById = exports.checkIfTextFile = void 0;\nfunction checkIfTextFile(buf) {\n    try {\n        var s = new String(buf);\n        return true;\n    }\n    catch (e) {\n        return false;\n    }\n}\nexports.checkIfTextFile = checkIfTextFile;\nfunction findFileById(root, id) {\n    var e_1, _a;\n    var res = root.files.find(function (f) { return f._id === id; });\n    if (res)\n        return res;\n    try {\n        for (var _b = __values(root.dirs), _c = _b.next(); !_c.done; _c = _b.next()) {\n            var subdir = _c.value;\n            res = findFileById(subdir, id);\n            if (res)\n                return res;\n        }\n    }\n    catch (e_1_1) { e_1 = { error: e_1_1 }; }\n    finally {\n        try {\n            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);\n        }\n        finally { if (e_1) throw e_1.error; }\n    }\n    return null;\n}\nexports.findFileById = findFileById;\nfunction findDirById(root, id) {\n    var e_2, _a;\n    if (root._id === id)\n        return root;\n    try {\n        for (var _b = __values(root.dirs), _c = _b.next(); !_c.done; _c = _b.next()) {\n            var subdir = _c.value;\n            var res = findDirById(subdir, id);\n            if (res !== null)\n                return res;\n        }\n    }\n    catch (e_2_1) { e_2 = { error: e_2_1 }; }\n    finally {\n        try {\n            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);\n        }\n        finally { if (e_2) throw e_2.error; }\n    }\n    return null;\n}\nexports.findDirById = findDirById;\nfunction deleteFileById(root, id) {\n    var e_3, _a;\n    var idx = root.files.findIndex(function (f) { return f._id === id; });\n    if (idx >= 0) {\n        root.files.splice(idx, 1);\n        return true;\n    }\n    try {\n        for (var _b = __values(root.dirs), _c = _b.next(); !_c.done; _c = _b.next()) {\n            var subdir = _c.value;\n            var res = deleteFileById(subdir, id);\n            if (res)\n                return res;\n        }\n    }\n    catch (e_3_1) { e_3 = { error: e_3_1 }; }\n    finally {\n        try {\n            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);\n        }\n        finally { if (e_3) throw e_3.error; }\n    }\n    return false;\n}\nexports.deleteFileById = deleteFileById;\nfunction deleteDirById(root, id) {\n    var e_4, _a;\n    var idx = root.dirs.findIndex(function (d) { return d._id === id; });\n    if (idx >= 0) {\n        root.dirs.splice(idx, 1);\n        return true;\n    }\n    try {\n        for (var _b = __values(root.dirs), _c = _b.next(); !_c.done; _c = _b.next()) {\n            var subdir = _c.value;\n            var res = deleteDirById(subdir, id);\n            if (res)\n                return res;\n        }\n    }\n    catch (e_4_1) { e_4 = { error: e_4_1 }; }\n    finally {\n        try {\n            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);\n        }\n        finally { if (e_4) throw e_4.error; }\n    }\n    return false;\n}\nexports.deleteDirById = deleteDirById;\nfunction deleteById(root, id) {\n    if (deleteFileById(root, id))\n        return true;\n    else\n        return deleteDirById(root, id);\n}\nexports.deleteById = deleteById;\nexports[\"default\"] = {\n    checkIfTextFile: checkIfTextFile,\n    findFileById: findFileById,\n    findDirById: findDirById,\n    deleteFileById: deleteFileById,\n    deleteDirById: deleteDirById,\n    deleteById: deleteById,\n};\n\n\n//# sourceURL=webpack://21ai1-webeng-ii-webitor/./src/util/workspace.ts?");

/***/ }),

/***/ "@codemirror/lang-cpp":
/*!***************************************!*\
  !*** external "@codemirror/lang-cpp" ***!
  \***************************************/
/***/ ((module) => {

module.exports = require("@codemirror/lang-cpp");

/***/ }),

/***/ "@codemirror/lang-css":
/*!***************************************!*\
  !*** external "@codemirror/lang-css" ***!
  \***************************************/
/***/ ((module) => {

module.exports = require("@codemirror/lang-css");

/***/ }),

/***/ "@codemirror/lang-html":
/*!****************************************!*\
  !*** external "@codemirror/lang-html" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@codemirror/lang-html");

/***/ }),

/***/ "@codemirror/lang-java":
/*!****************************************!*\
  !*** external "@codemirror/lang-java" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@codemirror/lang-java");

/***/ }),

/***/ "@codemirror/lang-javascript":
/*!**********************************************!*\
  !*** external "@codemirror/lang-javascript" ***!
  \**********************************************/
/***/ ((module) => {

module.exports = require("@codemirror/lang-javascript");

/***/ }),

/***/ "@codemirror/lang-json":
/*!****************************************!*\
  !*** external "@codemirror/lang-json" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@codemirror/lang-json");

/***/ }),

/***/ "@codemirror/lang-markdown":
/*!********************************************!*\
  !*** external "@codemirror/lang-markdown" ***!
  \********************************************/
/***/ ((module) => {

module.exports = require("@codemirror/lang-markdown");

/***/ }),

/***/ "@codemirror/lang-php":
/*!***************************************!*\
  !*** external "@codemirror/lang-php" ***!
  \***************************************/
/***/ ((module) => {

module.exports = require("@codemirror/lang-php");

/***/ }),

/***/ "@codemirror/lang-python":
/*!******************************************!*\
  !*** external "@codemirror/lang-python" ***!
  \******************************************/
/***/ ((module) => {

module.exports = require("@codemirror/lang-python");

/***/ }),

/***/ "@codemirror/lang-rust":
/*!****************************************!*\
  !*** external "@codemirror/lang-rust" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@codemirror/lang-rust");

/***/ }),

/***/ "@codemirror/lang-sql":
/*!***************************************!*\
  !*** external "@codemirror/lang-sql" ***!
  \***************************************/
/***/ ((module) => {

module.exports = require("@codemirror/lang-sql");

/***/ }),

/***/ "@codemirror/lang-wast":
/*!****************************************!*\
  !*** external "@codemirror/lang-wast" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@codemirror/lang-wast");

/***/ }),

/***/ "@codemirror/lang-xml":
/*!***************************************!*\
  !*** external "@codemirror/lang-xml" ***!
  \***************************************/
/***/ ((module) => {

module.exports = require("@codemirror/lang-xml");

/***/ }),

/***/ "@replit/codemirror-lang-csharp":
/*!*************************************************!*\
  !*** external "@replit/codemirror-lang-csharp" ***!
  \*************************************************/
/***/ ((module) => {

module.exports = require("@replit/codemirror-lang-csharp");

/***/ }),

/***/ "archiver":
/*!***************************!*\
  !*** external "archiver" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("archiver");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("cookie-parser");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "formidable":
/*!*****************************!*\
  !*** external "formidable" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("formidable");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "fs/promises":
/*!******************************!*\
  !*** external "fs/promises" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("fs/promises");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "process":
/*!**************************!*\
  !*** external "process" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("process");

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/server.ts");
/******/ 	
/******/ })()
;