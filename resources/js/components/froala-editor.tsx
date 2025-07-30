import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import FroalaEditor from 'react-froala-wysiwyg';

// Import Froala Editor CSS
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Import Froala Editor plugins
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/code_beautifier.min.js';
import 'froala-editor/js/plugins/code_view.min.js';
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/js/plugins/emoticons.min.js';
import 'froala-editor/js/plugins/entities.min.js';
import 'froala-editor/js/plugins/file.min.js';
import 'froala-editor/js/plugins/font_family.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/fullscreen.min.js';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/image_manager.min.js';
import 'froala-editor/js/plugins/inline_style.min.js';
import 'froala-editor/js/plugins/line_breaker.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/lists.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/plugins/paragraph_style.min.js';
import 'froala-editor/js/plugins/quote.min.js';
import 'froala-editor/js/plugins/table.min.js';
import 'froala-editor/js/plugins/url.min.js';
import 'froala-editor/js/plugins/video.min.js';
import 'froala-editor/js/plugins/word_paste.min.js';

import { cn } from '@/lib/utils';

interface FroalaEditorProps {
    value?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    height?: number;
    error?: boolean;
}

export interface FroalaEditorRef {
    getContent: () => string;
    setContent: (content: string) => void;
    focus: () => void;
    blur: () => void;
}

const FroalaEditorComponent = forwardRef<FroalaEditorRef, FroalaEditorProps>(
    ({ value = '', onChange, placeholder, className, disabled = false, height = 200, error = false }, ref) => {
        const editorRef = useRef<any>(null);

        useImperativeHandle(ref, () => ({
            getContent: () => {
                return editorRef.current?.getEditor()?.html?.get() || '';
            },
            setContent: (content: string) => {
                editorRef.current?.getEditor()?.html?.set(content);
            },
            focus: () => {
                editorRef.current?.getEditor()?.events?.focus();
            },
            blur: () => {
                editorRef.current?.getEditor()?.events?.blur();
            },
        }));

        const config = {
            placeholderText: placeholder || 'Enter your content here...',
            charCounterCount: true,
            charCounterMax: 5000,
            height: height,
            heightMin: 150,
            heightMax: 500,
            toolbarButtons: {
                moreText: {
                    buttons: [
                        'bold',
                        'italic',
                        'underline',
                        'strikeThrough',
                        'subscript',
                        'superscript',
                        'fontFamily',
                        'fontSize',
                        'textColor',
                        'backgroundColor',
                        'inlineStyle',
                        'clearFormatting'
                    ],
                    align: 'left',
                    buttonsVisible: 3
                },
                moreParagraph: {
                    buttons: [
                        'alignLeft',
                        'alignCenter',
                        'alignRight',
                        'alignJustify',
                        'formatOLSimple',
                        'formatOL',
                        'formatUL',
                        'paragraphFormat',
                        'paragraphStyle',
                        'lineHeight',
                        'outdent',
                        'indent',
                        'quote'
                    ],
                    align: 'left',
                    buttonsVisible: 4
                },
                moreRich: {
                    buttons: [
                        'insertLink',
                        'insertTable',
                        'emoticons',
                        'fontAwesome',
                        'specialCharacters',
                        'embedly',
                        'insertHR'
                    ],
                    align: 'left',
                    buttonsVisible: 4
                },
                moreMisc: {
                    buttons: [
                        'undo',
                        'redo',
                        'fullscreen',
                        'print',
                        'getPDF',
                        'spellChecker',
                        'selectAll',
                        'html',
                        'help'
                    ],
                    align: 'right',
                    buttonsVisible: 2
                }
            },
            imageUpload: false, // Disable image upload for now
            videoUpload: false, // Disable video upload for now
            fileUpload: false, // Disable file upload for now
            theme: 'royal', // Use the royal theme for better appearance
            attribution: false, // Remove Froala attribution (requires license)
            key: 'GPL-V3', // Use GPL license key for open source projects
        };

        return (
            <div className={cn('froala-editor-wrapper', className, error && 'border-destructive')}>
                <FroalaEditor
                    ref={editorRef}
                    tag="textarea"
                    config={config}
                    model={value}
                    onModelChange={onChange}
                />
            </div>
        );
    }
);

FroalaEditorComponent.displayName = 'FroalaEditor';

export { FroalaEditorComponent as FroalaEditor };