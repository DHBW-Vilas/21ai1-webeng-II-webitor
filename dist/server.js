(()=>{"use strict";var e={720:function(e,r,n){var t=this&&this.__values||function(e){var r="function"==typeof Symbol&&Symbol.iterator,n=r&&e[r],t=0;if(n)return n.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&t>=e.length&&(e=void 0),{value:e&&e[t++],done:!e}}};throw new TypeError(r?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(r,"__esModule",{value:!0}),r.langs=r.emptyHelloWorld=r.getLangHelloWorld=r.getLangExtension=void 0;var o=n(560),s=n(840),i=n(914),a=n(595),l=n(77),u=n(713),c=n(939),d=n(204),f=n(912),p=n(686),h=n(893),m=n(782),v=n(183);function y(e){var n,o;try{for(var s=t(r.langs),i=s.next();!i.done;i=s.next()){var a=i.value;if(a.fileExtensions.includes(e))return a.cmExtension()}}catch(e){n={error:e}}finally{try{i&&!i.done&&(o=s.return)&&o.call(s)}finally{if(n)throw n.error}}return null}function w(e){var n,o;try{for(var s=t(r.langs),i=s.next();!i.done;i=s.next()){var a=i.value;if(a.fileExtensions.includes(e))return a.helloWorld}}catch(e){n={error:e}}finally{try{i&&!i.done&&(o=s.return)&&o.call(s)}finally{if(n)throw n.error}}return null}r.getLangExtension=y,r.getLangHelloWorld=w;var g=function(e,r){return function(n,t,o){return{_id:void 0,name:n,editors:t,idCounter:1,dirs:[],files:[{_id:"0",name:e,isTextfile:!0,content:o(r)}]}}},x=function(e){return g("index."+e,'console.log("Hello World");')};r.emptyHelloWorld=function(e,r,n){return{_id:void 0,name:e,editors:r,idCounter:0,dirs:[],files:[]}},r.langs=[{name:"JavaScript",fileExtensions:["js","mjs"],cmExtension:o.javascript,helloWorld:x("js")},{name:"TypeScript",fileExtensions:["ts"],cmExtension:function(){return(0,o.javascript)({typescript:!0})},helloWorld:x("ts")},{name:"React",fileExtensions:["jsx"],cmExtension:function(){return(0,o.javascript)({jsx:!0})},helloWorld:null},{name:"React + Typescript",fileExtensions:["tsx"],cmExtension:function(){return(0,o.javascript)({jsx:!0,typescript:!0})},helloWorld:null},{name:"Python",fileExtensions:["py","pyw","pyc"],cmExtension:function(){return(0,s.python)()},helloWorld:g("init.py",'print("Hello World")')},{name:"Markdown",fileExtensions:["md"],cmExtension:function(){return(0,i.markdown)()},helloWorld:g("README.md","# Hello World")},{name:"Java",fileExtensions:["java"],cmExtension:function(){return(0,a.java)()},helloWorld:g("App.java",'class App {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}')},{name:"JSON",fileExtensions:["json"],cmExtension:function(){return(0,l.json)()},helloWorld:null},{name:"C++",fileExtensions:["cpp"],cmExtension:function(){return(0,u.cpp)()},helloWorld:g("main.cpp",'#include <iostream>\n\nint main()\n{\n\tstd::cout << "Hello World!";\n\treturn 0;\n}')},{name:"PHP",fileExtensions:["php"],cmExtension:function(){return(0,c.php)()},helloWorld:g("index.html","<html>\n\t<head></head>\n\t<body>\n\t\t<h2>XML-Style</h2>\n\t\t<?php\n\t\t\techo 'Hello World!';\n\t\t?>\n\t</body>\n</html>")},{name:"CSS",fileExtensions:["css"],cmExtension:function(){return(0,d.css)()},helloWorld:null},{name:"SQL",fileExtensions:["sql"],cmExtension:function(){return(0,f.sql)()},helloWorld:null},{name:"XML",fileExtensions:["xml"],cmExtension:function(){return(0,p.xml)()},helloWorld:null},{name:"HTML",fileExtensions:["html"],cmExtension:function(){return(0,h.html)()},helloWorld:function(e,r,n){return{_id:void 0,name:e,editors:r,idCounter:3,dirs:[],files:[{_id:"0",name:"index.html",isTextfile:!0,content:n('<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<link rel="stylesheet" type="text/css" href="style.css" />\n\t\t<script src="app.js" defer><\/script>\n\t\t<title>Homepage</title>\n\t</head>\n\t<body>\n\t\t<h1>Hello World</h1>\n\t</body>\n</html>')},{_id:"1",name:"style.css",isTextfile:!0,content:n("body {\n\twidth: 100vw;\n\theight: 100vh;\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n}")},{_id:"2",name:"app.js",isTextfile:!0,content:n('console.log("Hello World");')}]}}},{name:"Web-Assembly Text",fileExtensions:["wat"],cmExtension:function(){return(0,m.wast)()},helloWorld:g("hello.wat",'(module\n    ;; Import the required fd_write WASI function which will write the given io vectors to stdout\n    ;; The function signature for fd_write is:\n    ;; (File Descriptor, *iovs, iovs_len, nwritten) -> Returns number of bytes written\n    (import "wasi_unstable" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))\n\n    (memory 1)\n    (export "memory" (memory 0))\n\n    ;; Write \'hello world\n\' to memory at an offset of 8 bytes\n    ;; Note the trailing newline which is required for the text to appear\n    (data (i32.const 8) "hello world\n")\n\n    (func $main (export "_start")\n        ;; Creating a new io vector within linear memory\n        (i32.store (i32.const 0) (i32.const 8))  ;; iov.iov_base - This is a pointer to the start of the \'hello world\n\' string\n        (i32.store (i32.const 4) (i32.const 12))  ;; iov.iov_len - The length of the \'hello world\n\' string\n\n        (call $fd_write\n            (i32.const 1) ;; file_descriptor - 1 for stdout\n            (i32.const 0) ;; *iovs - The pointer to the iov array, which is stored at memory location 0\n            (i32.const 1) ;; iovs_len - We\'re printing 1 string stored in an iov - so one.\n            (i32.const 20) ;; nwritten - A place in memory to store the number of bytes written\n        )\n        drop ;; Discard the number of bytes written from the top of the stack\n    )\n)')},{name:"C-Sharp",fileExtensions:["cs"],cmExtension:function(){return(0,v.csharp)()},helloWorld:g("App.cs",'using System;\n\nnamespace App\n{\n    class HelloWorldProgram\n\t{\n        static void Main(string[] args)\n\t\t{\n\t\t    Console.WriteLine("Hello World!");\n        }\n    }\n}')}],r.default={getLangExtension:y,getLangHelloWorld:w,emptyHelloWorld:r.emptyHelloWorld,langs:r.langs}},287:function(e,r,n){var t=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(r,"__esModule",{value:!0});var o=t(n(185)),s=o.default.Schema,i=o.default.Types.ObjectId,a=new s({name:String,dirs:[Object],files:[Object],editors:[{type:i,ref:"userModel"}],idCounter:Number},{timestamps:!0}),l=new s({name:String,pass:String,anon:Boolean,workspaces:[{type:i,ref:"workspaceModel"}]},{timestamps:!0});r.default={workspace:o.default.model("workspaceModel",a),user:o.default.model("userModel",l)}},728:function(e,r,n){var t=this&&this.__assign||function(){return t=Object.assign||function(e){for(var r,n=1,t=arguments.length;n<t;n++)for(var o in r=arguments[n])Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o]);return e},t.apply(this,arguments)},o=this&&this.__createBinding||(Object.create?function(e,r,n,t){void 0===t&&(t=n);var o=Object.getOwnPropertyDescriptor(r,n);o&&!("get"in o?!r.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return r[n]}}),Object.defineProperty(e,t,o)}:function(e,r,n,t){void 0===t&&(t=n),e[t]=r[n]}),s=this&&this.__setModuleDefault||(Object.create?function(e,r){Object.defineProperty(e,"default",{enumerable:!0,value:r})}:function(e,r){e.default=r}),i=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&o(r,e,n);return s(r,e),r},a=this&&this.__awaiter||function(e,r,n,t){return new(n||(n=Promise))((function(o,s){function i(e){try{l(t.next(e))}catch(e){s(e)}}function a(e){try{l(t.throw(e))}catch(e){s(e)}}function l(e){var r;e.done?o(e.value):(r=e.value,r instanceof n?r:new n((function(e){e(r)}))).then(i,a)}l((t=t.apply(e,r||[])).next())}))},l=this&&this.__generator||function(e,r){var n,t,o,s,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return s={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s;function a(a){return function(l){return function(a){if(n)throw new TypeError("Generator is already executing.");for(;s&&(s=0,a[0]&&(i=0)),i;)try{if(n=1,t&&(o=2&a[0]?t.return:a[0]?t.throw||((o=t.return)&&o.call(t),0):t.next)&&!(o=o.call(t,a[1])).done)return o;switch(t=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,t=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!((o=(o=i.trys).length>0&&o[o.length-1])||6!==a[0]&&2!==a[0])){i=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){i.label=a[1];break}if(6===a[0]&&i.label<o[1]){i.label=o[1],o=a;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(a);break}o[2]&&i.ops.pop(),i.trys.pop();continue}a=r.call(e,i)}catch(e){a=[6,e],t=0}finally{n=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,l])}}},u=this&&this.__asyncValues||function(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var r,n=e[Symbol.asyncIterator];return n?n.call(e):(e="function"==typeof c?c(e):e[Symbol.iterator](),r={},t("next"),t("throw"),t("return"),r[Symbol.asyncIterator]=function(){return this},r);function t(n){r[n]=e[n]&&function(r){return new Promise((function(t,o){!function(e,r,n,t){Promise.resolve(t).then((function(r){e({value:r,done:n})}),r)}(t,o,(r=e[n](r)).done,r.value)}))}}},c=this&&this.__values||function(e){var r="function"==typeof Symbol&&Symbol.iterator,n=r&&e[r],t=0;if(n)return n.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&t>=e.length&&(e=void 0),{value:e&&e[t++],done:!e}}};throw new TypeError(r?"Object is not iterable.":"Symbol.iterator is not defined.")},d=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(r,"__esModule",{value:!0});var f=d(n(282)),p=d(n(17)),h=d(n(292)),m=n(147),v=d(n(113));n(142).config({path:p.default.join(__dirname,"..","config.env"),override:!1});var y=d(n(185)),w=d(n(860)),g=(0,w.default)(),x=d(n(710)),b=d(n(96)),I=d(n(616)),k=d(n(287)),j=d(n(116)),_=d(n(500)),E=n(17),S=i(n(720));function B(e,r,n){var t,o,s,i;void 0===n&&(n="/");try{for(var a=c(r.files),l=a.next();!l.done;l=a.next()){var u=l.value;e.append(Buffer.from(u.content.toString(),"utf-8"),{name:(0,E.join)(n,u.name)})}}catch(e){t={error:e}}finally{try{l&&!l.done&&(o=a.return)&&o.call(a)}finally{if(t)throw t.error}}try{for(var d=c(r.dirs),f=d.next();!f.done;f=d.next())B(e,f.value,(0,E.join)(n,r.name))}catch(e){s={error:e}}finally{try{f&&!f.done&&(i=d.return)&&i.call(d)}finally{if(s)throw s.error}}}function W(e){return Buffer.from(e).toString("base64")}var D=f.default.env,O=p.default.join(__dirname,"..","public"),T=p.default.join(__dirname,"..","tmp");(0,m.existsSync)(O)||h.default.mkdir(O),(0,m.existsSync)(T)||h.default.mkdir(T);var q=10,C=216e6,P="Not authorized to change this workspace",F="Not authenticated - Please login first",H={};function A(e,r){return void 0===e&&(e=32),void 0===r&&(r="hex"),v.default.randomBytes(e).toString(r)}function M(e,r,n){return void 0===n&&(n=!0),a(this,void 0,void 0,(function(){var t;return l(this,(function(o){switch(o.label){case 0:return t=e.signedCookies.auth,e.userId=H[t],H[t]?[3,2]:n?[4,$()]:[2,!1];case 1:t=o.sent(),z(r,t,!0),o.label=2;case 2:return e.userId=H[t],[2,!0]}}))}))}function N(e){return a(this,void 0,void 0,(function(){return l(this,(function(r){return[2,k.default.user.findById(e).then((function(e){var r;return null!==(r=null==e?void 0:e.anon)&&void 0!==r&&r})).catch((function(e){return!1}))]}))}))}function U(e){return void 0===e&&(e=Date.now()-1728e5),a(this,void 0,void 0,(function(){return l(this,(function(r){return[2,k.default.user.deleteMany({anon:!0,updatedAt:{$lte:e}})]}))}))}function L(e,r,n){return a(this,void 0,void 0,(function(){return l(this,(function(t){switch(t.label){case 0:return[4,M(e,r,!1)];case 1:return t.sent()?n():n(new Error(F)),[2]}}))}))}function R(e){return void 0===e&&(e={}),function(r,n,o,s){null===n.userId?o.json(t(t({},e),{success:!1,err:F})):s(r)}}function $(e,r,n){return void 0===e&&(e=null),void 0===r&&(r=null),void 0===n&&(n=null===e||null===r),a(this,void 0,void 0,(function(){var t,o,s;return l(this,(function(i){switch(i.label){case 0:return e||(e=A(24,"utf-8")),r||(r=A(24,"utf-8")),[4,b.default.hash(r,q)];case 1:return t=i.sent(),[4,k.default.user.create({name:e,pass:t,anon:n,workspaces:[]})];case 2:return o=i.sent(),s=A(32,"hex"),H[s]=o._id,[2,s]}}))}))}function z(e,r,n){var o={maxAge:C,sameSite:"strict",httpOnly:!1};return e.cookie("anon",n,o).cookie("auth",r,t({signed:!0},o))}function V(e,r){return a(this,void 0,void 0,(function(){var n,t,o,s,i,a,u,d,f,p;return l(this,(function(l){switch(l.label){case 0:return n=e.signedCookies.auth,(t=H[n])?[4,k.default.user.findById(t)]:[2];case 1:return(null==(o=l.sent())?void 0:o.anon)?(s=H[r],[4,k.default.user.findById(s)]):[2];case 2:i=l.sent();try{for(a=c(o.workspaces),u=a.next();!u.done;u=a.next())d=u.value,k.default.workspace.findByIdAndUpdate(d,{editors:[s]}),null==i||i.workspaces.push(d)}catch(e){f={error:e}}finally{try{u&&!u.done&&(p=a.return)&&p.call(a)}finally{if(f)throw f.error}}return null==i||i.save(),[2]}}))}))}!function(){a(this,void 0,void 0,(function(){var e,r;return l(this,(function(n){switch(n.label){case 0:return e="mongodb+srv://".concat(D.DB_USER,":").concat(D.DB_PASS,"@cluster0.91saw3c.mongodb.net/?retryWrites=true&w=majority"),[4,y.default.connect(e)];case 1:return r=n.sent(),console.log("MongoDB connected: ".concat(r.connection.host)),[2]}}))}))}(),g.use("/public",w.default.static(O)),g.use(w.default.json()),g.use((0,x.default)(D.SECRET)),g.get("/",(function(e,r){r.cookie("redirectUrl","/").sendFile(p.default.join(O,"index.html"))})).get("/favicon.ico",(function(e,r){r.sendFile(p.default.join(O,"logo.ico"))})).get("/attributions",(function(e,r){r.sendFile(p.default.join(O,"attributions.html"))})).get("/editor",(function(e,r){r.cookie("redirectUrl","/editor").sendFile(p.default.join(O,"editor.html"))})).get("/login",(function(e,r){r.sendFile(p.default.join(O,"login.html"))})).post("/register",(function(e,r){return a(void 0,void 0,void 0,(function(){var n,t,o,s;return l(this,(function(i){switch(i.label){case 0:return n=e.body.name||null,t=e.body.pass||null,o=e.cookies.redirectUrl||"/",r.clearCookie("redirectUrl"),n&&t?Buffer.from(t,"utf-8").byteLength>72?[2,r.status(418).json({success:!1,err:"Password is not allowed to be more than 72 bytes long (Note: some characters might take more than 1 byte)."})]:[4,k.default.user.exists({name:n})]:[2,r.status(418).json({success:!1,err:"Invalid Username or Password."})];case 1:return null!=i.sent()?[2,r.status(418).json({success:!1,err:"Username is already taken"})]:[4,$(n,t,!1)];case 2:return s=i.sent(),V(e,s),[2,z(r,s,!1).status(200).json({success:!0,url:o})]}}))}))})).post("/login",(function(e,r){return a(void 0,void 0,void 0,(function(){var n,t,o,s,i;return l(this,(function(a){switch(a.label){case 0:return n=e.body.name||null,t=e.body.pass||null,o=e.cookies.redirectUrl||"/",r.clearCookie("redirectUrl"),n&&t?Buffer.from(t,"utf-8").byteLength>72?[2,r.status(418).json({success:!1,err:"Password is not allowed to be more than 72 bytes long (Note: some characters take more than 1 byte).",url:null})]:[4,k.default.user.findOne({name:n})]:[2,r.status(418).json({success:!1,err:"Invalid Username or Password.",url:null})];case 1:return(s=a.sent())?[4,b.default.compare(t,s.pass)]:[2,r.status(418).json({err:"Wrong username.",success:!1,url:null})];case 2:return a.sent()?(i=A(32,"hex"),H[i]=s._id,V(e,i),[2,z(r,i,!1).status(200).json({success:!0,url:o})]):[2,r.status(418).json({err:"Wrong password.",success:!1,url:null})]}}))}))})).get("/workspaces",(function(e,r){return a(void 0,void 0,void 0,(function(){var n,t,o,s,i,a,c,d,f,p,h,m,v,y;return l(this,(function(l){switch(l.label){case 0:return[4,M(e,r,!0)];case 1:return l.sent()?[4,k.default.user.findById(e.userId)]:[2,r.json({success:!1,err:F})];case 2:n=l.sent(),t=[],l.label=3;case 3:l.trys.push([3,11,12,17]),o=!0,s=u(null!==(y=null==n?void 0:n.workspaces)&&void 0!==y?y:[]),l.label=4;case 4:return[4,s.next()];case 5:if(i=l.sent(),p=i.done)return[3,10];v=i.value,o=!1,l.label=6;case 6:return l.trys.push([6,,8,9]),a=v,[4,k.default.workspace.findById(a)];case 7:return null!==(c=l.sent())&&t.push(c),[3,9];case 8:return o=!0,[7];case 9:return[3,4];case 10:return[3,17];case 11:return d=l.sent(),h={error:d},[3,17];case 12:return l.trys.push([12,,15,16]),o||p||!(m=s.return)?[3,14]:[4,m.call(s)];case 13:l.sent(),l.label=14;case 14:return[3,16];case 15:if(h)throw h.error;return[7];case 16:return[7];case 17:return[4,N(e.userId)];case 18:return f=l.sent(),[2,r.json({success:!0,workspaces:t,anon:f})]}}))}))})).post("/create/:workspaceName/:languageExt",[L,R()],(function(e,r){return a(void 0,void 0,void 0,(function(){var n,t,o,s,i;return l(this,(function(a){switch(a.label){case 0:if(n=e.userId,t=e.params.workspaceName,o=e.params.languageExt,s=null,"empty"===o)s=S.emptyHelloWorld;else if(!(s=S.default.getLangHelloWorld(o)))return[2,r.json({success:!1,err:"Unknown Language provided for creating new workspace"})];return[4,k.default.workspace.create(s(t,[n],W))];case 1:return i=a.sent(),[4,k.default.user.findByIdAndUpdate(n,{$push:{workspaces:i._id}})];case 2:return a.sent(),[2,r.json({success:!0,workspaceId:i._id})]}}))}))})).post("/upload/:workspaceName",[L,R()],(function(e,r){return a(void 0,void 0,void 0,(function(){var n,t;return l(this,(function(o){try{n=e.params.workspaceName,t=(0,I.default)({keepExtensions:!0,multiples:!0,filter:function(e){e.name;var r=e.originalFilename;return e.mimetype,!(null==r?void 0:r.includes(".git/"))},uploadDir:T}),t.parse(e,(function(t,o,s){return a(void 0,void 0,void 0,(function(){var o,i,a,d,f,p,m,v,y,w,g,x,b,I,_,E,S,B,W,D,O,T,q,C,P;return l(this,(function(l){switch(l.label){case 0:if(t)throw t;o=0,i={_id:void 0,name:n,files:[],dirs:{}},Array.isArray(s.file)||(s.file=[s.file]),l.label=1;case 1:l.trys.push([1,9,10,15]),a=!0,d=u(s.file),l.label=2;case 2:return[4,d.next()];case 3:if(f=l.sent(),O=f.done)return[3,8];C=f.value,a=!1,l.label=4;case 4:return l.trys.push([4,,6,7]),(p=C)?(m=(null!==(P=p.originalFilename)&&void 0!==P?P:"").split("/"),[4,h.default.readFile(p.filepath)]):[3,7];case 5:v=l.sent(),y=j.default.checkIfTextFile(v),w={name:m.pop(),content:v,isTextfile:y,_id:(o++).toString()},h.default.rm(p.filepath),g=i;try{for(W=void 0,x=c(m),b=x.next();!b.done;b=x.next())I=b.value,g.dirs[I]||(g.dirs[I]={name:I,files:[],dirs:{},_id:(o++).toString()}),g=g.dirs[I]}catch(e){W={error:e}}finally{try{b&&!b.done&&(D=x.return)&&D.call(x)}finally{if(W)throw W.error}}return g.files.push(w),[3,7];case 6:return a=!0,[7];case 7:return[3,2];case 8:return[3,15];case 9:return _=l.sent(),T={error:_},[3,15];case 10:return l.trys.push([10,,13,14]),a||O||!(q=d.return)?[3,12]:[4,q.call(d)];case 11:l.sent(),l.label=12;case 12:return[3,14];case 13:if(T)throw T.error;return[7];case 14:return[7];case 15:return E=function(e){var r=Object.values(e.dirs).map((function(e){return E(e)}));return{_id:e._id,name:e.name,dirs:r,files:e.files}},(S=j.default.sortWS(E(i))).files.length||S.dirs.length?[4,k.default.workspace.create({name:n,dirs:S.dirs,files:S.files,editors:[e.userId],idCounter:o})]:[2,r.json({success:!1,id:null})];case 16:return B=l.sent(),[4,k.default.user.updateOne({_id:e.userId},{$push:{workspaces:B._id}})];case 17:return l.sent(),r.json({success:!0,workspaceId:B._id}),[2]}}))}))}))}catch(e){console.error(e),r.json({success:!1,err:"Internal Error when trying to upload workspace"})}return[2]}))}))})).post("/empty/workspace",(function(e,r){return a(void 0,void 0,void 0,(function(){var n;return l(this,(function(t){switch(t.label){case 0:return[4,M(e,r,!0)];case 1:return t.sent()?[4,k.default.workspace.create({name:"Unnamed",dirs:[],files:[],editors:[e.userId],idCounter:0})]:[2,r.json({success:!1,err:F})];case 2:return n=t.sent(),[4,k.default.user.updateOne({_id:e.userId},{$push:{workspaces:n._id}})];case 3:return t.sent(),[2,r.json({success:!0,workspaceId:n._id})]}}))}))})).put("/rename/:workspaceId",[L,R()],(function(e,r){return a(void 0,void 0,void 0,(function(){var n;return l(this,(function(t){switch(t.label){case 0:return[4,M(e,r)];case 1:return t.sent()?j.default.isValidName(e.body.name)?[4,k.default.workspace.findById(e.params.workspaceId)]:[2,r.json({success:!1,err:"Invalid name for workspace"})]:[2,r.json({success:!1,err:F})];case 2:return(null==(n=t.sent())?void 0:n.editors.includes(e.userId))?[4,k.default.workspace.findByIdAndUpdate(e.params.workspaceId,{name:e.body.name})]:[2,r.json({success:!1,err:P})];case 3:return t.sent(),[2,r.json({success:!0})]}}))}))})).get("/download/:workspaceId",[L,R()],(function(e,r){return a(void 0,void 0,void 0,(function(){var n,t;return l(this,(function(o){switch(o.label){case 0:return[4,M(e,r)];case 1:return o.sent()?[4,k.default.workspace.findById(e.params.workspaceId)]:[2,r.status(401).end()];case 2:if(!(null==(n=o.sent())?void 0:n.editors.includes(e.userId)))return[2,r.status(401).end()];r.setHeader("content-type","application/zip, application/octet-stream"),r.setHeader("content-disposition",'attachment;filename="'.concat(n.name,'.zip"')),r.setHeader("content-description","File Transfer"),r.setHeader("content-transfer-encoding","binary");try{t=_.default.create("zip"),r.on("finish",(function(){r.end()})),t.on("warning",(function(e){return console.log({warning:e})})),t.on("error",(function(e){return console.log({error:e})})),t.pipe(r),B(t,n),t.finalize()}catch(e){r.status(401).end()}return[2]}}))}))})).get("/workspace/:workspaceId",(function(e,r){return a(void 0,void 0,void 0,(function(){var n;return l(this,(function(t){switch(t.label){case 0:return[4,M(e,r,!1)];case 1:return t.sent()?(console.log(e.params.workspaceId),[4,k.default.workspace.findById(e.params.workspaceId)]):[2,r.json({success:!1})];case 2:return n=t.sent(),console.log(n),r.json({success:!0,root:n}),[2]}}))}))})).put("/workspace/file/:workspaceId/:fileId",(function(e,r){return a(void 0,void 0,void 0,(function(){var n,t,o,s;return l(this,(function(i){switch(i.label){case 0:return[4,M(e,r,!1)];case 1:if(!i.sent())return[2,r.json({success:!1})];i.label=2;case 2:return i.trys.push([2,5,,6]),[4,k.default.workspace.findById(e.params.workspaceId)];case 3:return(null==(n=i.sent())?void 0:n.editors.includes(e.userId))?((t=j.default.findFileById(n,e.params.fileId))&&(t.content=Buffer.from(e.body.text,"base64")),[4,null==n?void 0:n.updateOne({files:n.files,dirs:n.dirs})]):[2,r.json({success:!1,err:P})];case 4:return o=i.sent(),r.json({success:o.acknowledged}),[3,6];case 5:return s=i.sent(),console.error(s),r.json({success:!1,err:"Internal Error when trying to update file"}),[3,6];case 6:return[2]}}))}))})).delete("/workspace/:workspaceId",[L,R()],(function(e,r){return a(void 0,void 0,void 0,(function(){var n,t;return l(this,(function(o){switch(o.label){case 0:return[4,M(n=e,r,!1)];case 1:if(!o.sent())return[2,r.json({success:!1,err:F})];o.label=2;case 2:return o.trys.push([2,5,,6]),[4,k.default.workspace.findById(e.params.workspaceId)];case 3:return o.sent().editors.includes(n.userId)?[4,k.default.workspace.findByIdAndDelete(e.params.workspaceId)]:[2,r.json({success:!1,err:P})];case 4:return o.sent(),[2,r.json({success:!0})];case 5:return t=o.sent(),console.error(t),r.json({success:!1,err:"Internal Error when trying to delete workspace"}),[3,6];case 6:return[2]}}))}))})).delete("/workspace/:workspaceId/:fileOrDirId",[L,R()],(function(e,r){return a(void 0,void 0,void 0,(function(){var n,t;return l(this,(function(o){switch(o.label){case 0:return[4,M(e,r,!1)];case 1:if(!o.sent())return[2,r.json({success:!1,err:F})];o.label=2;case 2:return o.trys.push([2,5,,6]),[4,k.default.workspace.findById(e.params.workspaceId)];case 3:return n=o.sent(),j.default.deleteById(n,e.params.fileOrDirId)?[4,k.default.workspace.findByIdAndUpdate(e.params.workspaceId,{files:n.files,dirs:n.dirs})]:[2,r.json({success:!1,err:"File or Directory with ID "+e.params.fileOrDirId+" doesn't exist"})];case 4:return o.sent(),r.json({success:!0}),[3,6];case 5:return t=o.sent(),console.error(t),r.json({success:!1,err:"Internal Error when trying to delete file/folder"}),[3,6];case 6:return[2]}}))}))})).post("/workspace/file/:workspaceId/:parentDirId",[L,R()],(function(e,r){return a(void 0,void 0,void 0,(function(){var n,t,o,s;return l(this,(function(i){switch(i.label){case 0:return[4,M(e,r,!1)];case 1:if(!i.sent())return[2,r.json({success:!1,err:F})];i.label=2;case 2:return i.trys.push([2,5,,6]),[4,k.default.workspace.findById(e.params.workspaceId)];case 3:return(n=i.sent())&&void 0!==n.idCounter?(null==n?void 0:n.editors.includes(e.userId))?(t=j.default.findDirById(n,e.params.parentDirId))?(o={_id:(n.idCounter++).toString(),name:e.body.name,isTextfile:!0,content:""},j.default.addFile(t,o),[4,k.default.workspace.findByIdAndUpdate(n._id,{idCounter:n.idCounter,dirs:n.dirs,files:n.files})]):[2,r.json({success:!1,err:"Invalid Parent-Directory ID"})]:[2,r.json({success:!1,err:P})]:[2,r.json({success:!1,err:"Workspace wasn't found"})];case 4:return i.sent(),[2,r.json({success:!0,el:o})];case 5:return s=i.sent(),console.error(s),r.json({success:!1,err:"Internal Error when trying to create new file"}),[3,6];case 6:return[2]}}))}))})).post("/workspace/dir/:workspaceId/:parentDirId",[L,R()],(function(e,r){return a(void 0,void 0,void 0,(function(){var n,t,o,s;return l(this,(function(i){switch(i.label){case 0:return[4,M(e,r,!1)];case 1:if(!i.sent())return[2,r.json({success:!1,err:F})];i.label=2;case 2:return i.trys.push([2,5,,6]),[4,k.default.workspace.findById(e.params.workspaceId)];case 3:return(n=i.sent())&&void 0!==n.idCounter?(null==n?void 0:n.editors.includes(e.userId))?(t=j.default.findDirById(n,e.params.parentDirId))?(o={_id:(n.idCounter++).toString(),name:e.body.name,files:[],dirs:[]},j.default.addDir(t,o),[4,k.default.workspace.findByIdAndUpdate(n._id,{idCounter:n.idCounter,dirs:n.dirs})]):[2,r.json({success:!1,err:"Invalid Parent-Directory ID"})]:[2,r.json({success:!1,err:P})]:[2,r.json({success:!1,err:"Workspace wasn't found"})];case 4:return i.sent(),[2,r.json({success:!0,el:o})];case 5:return s=i.sent(),console.error(s),r.json({success:!1,err:"Internal Error when trying to create new folder"}),[3,6];case 6:return[2]}}))}))})),g.listen(D.PORT,(function(){return console.log("Server listening on port ".concat(D.PORT,"..."))})),U(Date.now()).then((function(){return setInterval(U,216e5)}))},116:function(e,r,n){var t=this&&this.__values||function(e){var r="function"==typeof Symbol&&Symbol.iterator,n=r&&e[r],t=0;if(n)return n.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&t>=e.length&&(e=void 0),{value:e&&e[t++],done:!e}}};throw new TypeError(r?"Object is not iterable.":"Symbol.iterator is not defined.")},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(r,"__esModule",{value:!0}),r.isValidName=r.isNameTaken=r.addDir=r.addFile=r.sortWS=r.strCmp=r.deleteById=r.deleteDirById=r.deleteFileById=r.findDirById=r.findFileById=r.checkIfTextFile=r.idEquals=void 0;var s=o(n(185));function i(e,r){return e instanceof s.default.Types.ObjectId&&(e=e.toString()),r instanceof s.default.Types.ObjectId&&(r=r.toString()),e===r}function a(e){try{return new String(e),!0}catch(e){return!1}}function l(e,r){var n,o,s=e.files.find((function(e){return i(e._id,r)}));if(s)return s;try{for(var a=t(e.dirs),u=a.next();!u.done;u=a.next())if(s=l(u.value,r))return s}catch(e){n={error:e}}finally{try{u&&!u.done&&(o=a.return)&&o.call(a)}finally{if(n)throw n.error}}return null}function u(e,r){var n,o;if(i(e._id,r))return e;try{for(var s=t(e.dirs),a=s.next();!a.done;a=s.next()){var l=u(a.value,r);if(null!==l)return l}}catch(e){n={error:e}}finally{try{a&&!a.done&&(o=s.return)&&o.call(s)}finally{if(n)throw n.error}}return null}function c(e,r){var n,o,s=e.files.findIndex((function(e){return i(e._id,r)}));if(s>=0)return e.files.splice(s,1),!0;try{for(var a=t(e.dirs),l=a.next();!l.done;l=a.next()){var u=c(l.value,r);if(u)return u}}catch(e){n={error:e}}finally{try{l&&!l.done&&(o=a.return)&&o.call(a)}finally{if(n)throw n.error}}return!1}function d(e,r){var n,o,s=e.dirs.findIndex((function(e){return i(e._id,r)}));if(s>=0)return e.dirs.splice(s,1),!0;try{for(var a=t(e.dirs),l=a.next();!l.done;l=a.next()){var u=d(l.value,r);if(u)return u}}catch(e){n={error:e}}finally{try{l&&!l.done&&(o=a.return)&&o.call(a)}finally{if(n)throw n.error}}return!1}function f(e,r){return!!c(e,r)||d(e,r)}function p(e,r){for(var n=0;n<e.length&&n<r.length;n++){if(e.charCodeAt(n)<r.charCodeAt(n))return-1;if(e.charCodeAt(n)>r.charCodeAt(n))return 1}return e.length==r.length?0:e.length<r.length?-1:1}function h(e){return e.files=e.files.sort((function(e,r){return p(e.name,r.name)})),e.dirs=e.dirs.sort((function(e,r){return p(e.name,r.name)})).map((function(e){return h(e)})),e}function m(e,r){for(var n=0;n<e.files.length;n++)if(p(r.name,e.files[n].name))return e.files.splice(n,0,r),n;return e.files.push(r),e.files.length-1}function v(e,r){for(var n=0;n<e.dirs.length;n++)if(p(r.name,e.dirs[n].name))return e.dirs.splice(n,0,r),n;return e.dirs.push(r),e.dirs.length-1}function y(e,r){var n,o,s,i;try{for(var a=t(e.files),l=a.next();!l.done;l=a.next())if(l.value.name==r)return!1}catch(e){n={error:e}}finally{try{l&&!l.done&&(o=a.return)&&o.call(a)}finally{if(n)throw n.error}}try{for(var u=t(e.dirs),c=u.next();!c.done;c=u.next())if(c.value.name==r)return!1}catch(e){s={error:e}}finally{try{c&&!c.done&&(i=u.return)&&i.call(u)}finally{if(s)throw s.error}}return!0}function w(e){return/^[a-z|A-Z|0-9| |_|-|.]+$/.test(e)}r.idEquals=i,r.checkIfTextFile=a,r.findFileById=l,r.findDirById=u,r.deleteFileById=c,r.deleteDirById=d,r.deleteById=f,r.strCmp=p,r.sortWS=h,r.addFile=m,r.addDir=v,r.isNameTaken=y,r.isValidName=w,r.default={idEquals:i,checkIfTextFile:a,findFileById:l,findDirById:u,deleteFileById:c,deleteDirById:d,deleteById:f,sortWS:h,addFile:m,addDir:v,isNameTaken:y,isValidName:w}},713:e=>{e.exports=require("@codemirror/lang-cpp")},204:e=>{e.exports=require("@codemirror/lang-css")},893:e=>{e.exports=require("@codemirror/lang-html")},595:e=>{e.exports=require("@codemirror/lang-java")},560:e=>{e.exports=require("@codemirror/lang-javascript")},77:e=>{e.exports=require("@codemirror/lang-json")},914:e=>{e.exports=require("@codemirror/lang-markdown")},939:e=>{e.exports=require("@codemirror/lang-php")},840:e=>{e.exports=require("@codemirror/lang-python")},912:e=>{e.exports=require("@codemirror/lang-sql")},782:e=>{e.exports=require("@codemirror/lang-wast")},686:e=>{e.exports=require("@codemirror/lang-xml")},183:e=>{e.exports=require("@replit/codemirror-lang-csharp")},500:e=>{e.exports=require("archiver")},96:e=>{e.exports=require("bcrypt")},710:e=>{e.exports=require("cookie-parser")},142:e=>{e.exports=require("dotenv")},860:e=>{e.exports=require("express")},616:e=>{e.exports=require("formidable")},185:e=>{e.exports=require("mongoose")},113:e=>{e.exports=require("crypto")},147:e=>{e.exports=require("fs")},292:e=>{e.exports=require("fs/promises")},17:e=>{e.exports=require("path")},282:e=>{e.exports=require("process")}},r={};!function n(t){var o=r[t];if(void 0!==o)return o.exports;var s=r[t]={exports:{}};return e[t].call(s.exports,s,s.exports,n),s.exports}(728)})();