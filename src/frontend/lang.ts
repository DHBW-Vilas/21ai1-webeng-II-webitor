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
import { nix } from '@replit/codemirror-lang-nix';
import { csharp } from '@replit/codemirror-lang-csharp';

export function getLangExtension(ext: string): Extension | null {
	switch (ext.toLowerCase()) {
		case 'js':
			return javascript();
		case 'ts':
			return javascript({ typescript: true });
		case 'jsx':
			return javascript({ jsx: true });
		case 'tsx':
			return javascript({ jsx: true, typescript: true });
		case 'py':
			return python();
		case 'md':
			return markdown();
		case 'java':
			return java();
		case 'json':
			return json();
		case 'cpp':
			return cpp();
		case 'php':
			return php();
		case 'css':
			return css();
		case 'sql':
			return sql();
		case 'rs':
			return rust();
		case 'xml':
			return xml();
		case 'html':
			return html();
		case 'wast':
			return wast();
		case 'cs':
			return csharp();
		case 'nix':
			return nix();
		default:
			return null;
	}
}
