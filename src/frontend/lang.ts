import { Extension } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { markdown } from '@codemirror/lang-markdown';
import { java } from '@codemirror/lang-java';
import { json } from '@codemirror/lang-json';
import { cpp } from '@codemirror/lang-cpp';
import { php } from '@codemirror/lang-php';
import { css } from '@codemirror/lang-css';
import { sql } from '@codemirror/lang-sql';
import { rust } from '@codemirror/lang-rust';
import { xml } from '@codemirror/lang-xml';
import { html } from '@codemirror/lang-html';
import { wast } from '@codemirror/lang-wast';
import { csharp } from '@replit/codemirror-lang-csharp';
import { Workspace, WSId, WSDir, WSFile, ObjectId } from '../models';

export interface WorkspaceNoId extends Workspace {
	_id: any;
}

export type StringConverter = (utf8Str: string) => string | Buffer;
export type HelloWorldFn = (name: string, editors: ObjectId[], conv: StringConverter) => WorkspaceNoId | null;

export type Lang = {
	name: string;
	fileExtensions: string[];
	cmExtension: () => Extension;
	helloWorld: HelloWorldFn | null;
};

export function getLangExtension(ext: string): Extension | null {
	for (const lang of langs) {
		if (lang.fileExtensions.includes(ext)) return lang.cmExtension();
	}
	return null;
}

export function getLangHelloWorld(ext: string): HelloWorldFn | null {
	for (const lang of langs) {
		if (lang.fileExtensions.includes(ext)) return lang.helloWorld;
	}
	return null;
}

const singleFileHelloWorld = (fname: string, content: string) => (name: string, editors: ObjectId[], conv: StringConverter) => {
	return {
		_id: undefined,
		name,
		editors,
		idCounter: 1,
		dirs: [],
		files: [
			{
				_id: '0' as WSId,
				name: fname,
				isTextfile: true,
				content: conv(content),
			},
		],
	};
};
const jsHelloWorld = (ext: string) => singleFileHelloWorld('index.' + ext, 'console.log("Hello World");');

export const emptyHelloWorld = (name: string, editors: ObjectId[], conv: StringConverter) => {
	return {
		_id: undefined,
		name,
		editors,
		idCounter: 0,
		dirs: [],
		files: [],
	};
};

export const langs: Lang[] = [
	{
		name: 'JavaScript',
		fileExtensions: ['js', 'mjs'],
		cmExtension: javascript,
		helloWorld: jsHelloWorld('js'),
	},
	{
		name: 'TypeScript',
		fileExtensions: ['ts'],
		cmExtension: () => javascript({ typescript: true }),
		helloWorld: jsHelloWorld('ts'),
	},
	{
		name: 'React',
		fileExtensions: ['jsx'],
		cmExtension: () => javascript({ jsx: true }),
		helloWorld: null,
	},
	{
		name: 'React + Typescript',
		fileExtensions: ['tsx'],
		cmExtension: () => javascript({ jsx: true, typescript: true }),
		helloWorld: null,
	},
	{
		name: 'Python',
		fileExtensions: ['py', 'pyw', 'pyc'],
		cmExtension: () => python(),
		helloWorld: singleFileHelloWorld('init.py', 'print("Hello World")'),
	},
	{
		name: 'Markdown',
		fileExtensions: ['md'],
		cmExtension: () => markdown(),
		helloWorld: singleFileHelloWorld('README.md', '# Hello World'),
	},
	{
		name: 'Java',
		fileExtensions: ['java'],
		cmExtension: () => java(),
		helloWorld: singleFileHelloWorld(
			'App.java',
			`class App {
	public static void main(String[] args) {
		System.out.println("Hello World");
	}
}`
		),
	},
	{
		name: 'JSON',
		fileExtensions: ['json'],
		cmExtension: () => json(),
		helloWorld: null,
	},
	{
		name: 'C++',
		fileExtensions: ['cpp'],
		cmExtension: () => cpp(),
		helloWorld: singleFileHelloWorld(
			'main.cpp',
			`#include <iostream>

int main()
{
	std::cout << "Hello World!";
	return 0;
}`
		),
	},
	{
		name: 'PHP',
		fileExtensions: ['php'],
		cmExtension: () => php(),
		helloWorld: singleFileHelloWorld(
			'index.html',
			`<html>
	<head></head>
	<body>
		<h2>XML-Style</h2>
		<?php
			echo 'Hello World!';
		?>
	</body>
</html>`
		),
	},
	{
		name: 'CSS',
		fileExtensions: ['css'],
		cmExtension: () => css(),
		helloWorld: null,
	},
	{
		name: 'SQL',
		fileExtensions: ['sql'],
		cmExtension: () => sql(),
		helloWorld: null,
	},
	{
		name: 'Rust',
		fileExtensions: ['rs'],
		cmExtension: () => rust(),
		helloWorld: (name: string, editors: ObjectId[], conv: StringConverter) => {
			// TODO
			let dirs: WSDir[] = [];
			let files: WSFile[] = [
				{
					_id: '0' as WSId,
					name: 'index.',
					isTextfile: true,
					content: conv(`console.log("Hello World");`),
				},
			];
			return {
				_id: undefined,
				name,
				editors,
				idCounter: 1,
				dirs,
				files,
			};
		},
	},
	{
		name: 'XML',
		fileExtensions: ['xml'],
		cmExtension: () => xml(),
		helloWorld: null,
	},
	{
		name: 'HTML',
		fileExtensions: ['html'],
		cmExtension: () => html(),
		helloWorld: (name: string, editors: ObjectId[], conv: StringConverter) => {
			return {
				_id: undefined,
				name,
				editors,
				idCounter: 3,
				dirs: [],
				files: [
					{
						_id: '0' as WSId,
						name: 'index.html',
						isTextfile: true,
						content: conv(
							`<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" type="text/css" href="style.css" />
		<script src="app.js" defer></script>
		<title>Homepage</title>
	</head>
	<body>
		<h1>Hello World</h1>
	</body>
</html>`
						),
					},
					{
						_id: '1' as WSId,
						name: 'style.css',
						isTextfile: true,
						content: conv(`body {
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
}`),
					},
					{
						_id: '2' as WSId,
						name: 'app.js',
						isTextfile: true,
						content: conv(`console.log("Hello World");`),
					},
				],
			};
		},
	},
	{
		name: 'Web-Assembly Text',
		fileExtensions: ['wat'],
		cmExtension: () => wast(),
		helloWorld: singleFileHelloWorld(
			'hello.wat',
			`(module
    ;; Import the required fd_write WASI function which will write the given io vectors to stdout
    ;; The function signature for fd_write is:
    ;; (File Descriptor, *iovs, iovs_len, nwritten) -> Returns number of bytes written
    (import "wasi_unstable" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))

    (memory 1)
    (export "memory" (memory 0))

    ;; Write 'hello world\n' to memory at an offset of 8 bytes
    ;; Note the trailing newline which is required for the text to appear
    (data (i32.const 8) "hello world\n")

    (func $main (export "_start")
        ;; Creating a new io vector within linear memory
        (i32.store (i32.const 0) (i32.const 8))  ;; iov.iov_base - This is a pointer to the start of the 'hello world\n' string
        (i32.store (i32.const 4) (i32.const 12))  ;; iov.iov_len - The length of the 'hello world\n' string

        (call $fd_write
            (i32.const 1) ;; file_descriptor - 1 for stdout
            (i32.const 0) ;; *iovs - The pointer to the iov array, which is stored at memory location 0
            (i32.const 1) ;; iovs_len - We're printing 1 string stored in an iov - so one.
            (i32.const 20) ;; nwritten - A place in memory to store the number of bytes written
        )
        drop ;; Discard the number of bytes written from the top of the stack
    )
)`
		),
	},
	{
		name: 'C-Sharp',
		fileExtensions: ['cs'],
		cmExtension: () => csharp(),
		helloWorld: singleFileHelloWorld(
			'App.cs',
			`using System;

namespace App
{
    class HelloWorldProgram
	{
        static void Main(string[] args)
		{
		    Console.WriteLine("Hello World!");
        }
    }
}`
		),
	},
];

export default {
	getLangExtension,
	getLangHelloWorld,
	emptyHelloWorld,
	langs,
};
