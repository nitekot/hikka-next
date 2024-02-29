'use client';

import { forwardRef } from 'react';

import dynamic from 'next/dynamic';

import { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor';


const Editor = dynamic(() => import('./initialized-MDX-editor'), {
    ssr: false,
});

const MDEditor = forwardRef<MDXEditorMethods, MDXEditorProps>((props, ref) => (
    <Editor
        className="dark-theme dark-editor bg-secondary/30 border-secondary/60 border rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
        {...props}
        editorRef={ref}
    />
));

MDEditor.displayName = 'MDEditor';

export default MDEditor;
