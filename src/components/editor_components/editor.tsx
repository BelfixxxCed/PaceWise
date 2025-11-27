'use client';

import { Plate, usePlateEditor } from 'platejs/react';
import type { Value } from 'platejs';
import { Editor, EditorContainer } from '@/components/ui/editor';
import {
    BlockquotePlugin,
    BoldPlugin,
    ItalicPlugin,
    UnderlinePlugin,
    H1Plugin,
    H2Plugin,
    H3Plugin,
} from '@platejs/basic-nodes/react';
import { FixedToolbar } from '@/components/ui/fixed-toolbar';
import { MarkToolbarButton } from '@/components/ui/mark-toolbar-button';
import { BlockquoteElement } from '@/components/ui/blockquote-node';
import { H1Element, H2Element, H3Element } from '@/components/ui/heading-node';
import { ToolbarButton } from '@/components/ui/toolbar';
import { 
    parseNotesToText, 
    parseNotesToHTML,
    type EditorNode
} from '@/lib/parseNotes';

const initialValue: Value = [
    {
        children: [{ text: 'Title' }],
        type: 'h3',
    },
    {
        children: [{ text: 'This is a quote.' }],
        type: 'blockquote',
    },
    {
        type: 'p',
        children: [
            { text: 'Hello! Try out the ' },
            { text: 'bold', bold: true },
            { text: ', ' },
            { text: 'italic', italic: true },
            { text: ', and ' },
            { text: 'underline', underline: true },
            { text: ' formatting.' },
        ],
    },
];

export default function MyEditorPage() {
    const editor = usePlateEditor({
        plugins: [
            BoldPlugin,
            ItalicPlugin,
            UnderlinePlugin,
            H1Plugin.withComponent(H1Element),
            H2Plugin.withComponent(H2Element),
            H3Plugin.withComponent(H3Element),
            BlockquotePlugin.withComponent(BlockquoteElement),
        ],
        value: initialValue,
    });

    const handleEditorChange = (newValue: Value) => {
        console.log('Editor content changed:', newValue);
        try {
      
            localStorage.setItem('editorContent', JSON.stringify(newValue));

            const nodes = newValue as unknown as EditorNode[];
            
            const plainText = parseNotesToText(nodes);
            localStorage.setItem('editorContentPlain', plainText);
            
            const htmlText = parseNotesToHTML(nodes);
            localStorage.setItem('editorContentHTML', htmlText);
            
            console.log(plainText);
            
        } catch (error) {
            console.error('Error saving editor content:', error);
        }
    };

    return (
        <Plate editor={editor} onChange={(x_val) => handleEditorChange(x_val.value)}>
            <FixedToolbar className="justify-start rounded-t-lg">
                <ToolbarButton onClick={() => editor.tf.h1.toggle()}>
                    H1
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.tf.h2.toggle()}>
                    H2
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.tf.h3.toggle()}>
                    H3
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.tf.blockquote.toggle()}>
                    Quote
                </ToolbarButton>
                <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">
                    B
                </MarkToolbarButton>
                <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">
                    I
                </MarkToolbarButton>
                <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">
                    U
                </MarkToolbarButton>
            </FixedToolbar>
            <EditorContainer>
                <Editor placeholder="Type your amazing content here..." />
            </EditorContainer>
        </Plate>
    );
}