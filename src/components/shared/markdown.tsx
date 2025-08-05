import MDEditor from '@uiw/react-md-editor'
import React from 'react'
import 'katex/dist/katex.css';
import { MarkdownPreviewProps } from "@uiw/react-markdown-preview/nohighlight";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";

const DEFAULT_PREVIEW_OPTIONS: MarkdownPreviewProps = {
	remarkPlugins: [remarkMath, remarkRehype],
	rehypePlugins: [rehypeSanitize, rehypeKatex, rehypeStringify],
	components: {
		div: ({ node, ...rest }) => {
			if (node !== undefined && "center" in rest) {
				delete rest.center;
				return <div className="text-center" {...rest} />;
			}

			return <div {...rest} />;
		},
	},
};

interface MarkdownProps {
    children: string;
}

const Markdown = ({children}: MarkdownProps) => {
  return (
    <MDEditor.Markdown
        className='markdown'
        style={{
            background: 'none', 
        }}
        source={children}
        {...DEFAULT_PREVIEW_OPTIONS}
    />
  )
}

export default Markdown