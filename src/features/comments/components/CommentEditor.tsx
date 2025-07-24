import { useEffect } from 'react';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Button, Group, Card } from '@mantine/core';
import { IconSend, IconX } from '@tabler/icons-react';

interface CommentEditorProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  initialValue?: string;
  placeholder?: string;
  submitLabel?: string;
  isCompact?: boolean;
}

export function CommentEditor({
  onSubmit,
  onCancel,
  initialValue = '',
  placeholder = 'Add comment...',
  submitLabel = 'Submit',
  isCompact = false,
}: CommentEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialValue,
    editorProps: {
      attributes: {
        class: 'mantine-RichTextEditor-content',
      },
    },
  });

  // Update editor content when initialValue changes (for edit mode)
  useEffect(() => {
    if (editor && initialValue && initialValue !== editor.getHTML()) {
      editor.commands.setContent(initialValue);
    }
  }, [editor, initialValue]);

  const handleSubmit = () => {
    if (!editor) return;
    
    const content = editor.getHTML();
    if (!content || content === '<p></p>') return; // Check for empty content
    
    onSubmit(content);
    editor.commands.clearContent();
  };

  const handleCancel = () => {
    editor?.commands.clearContent();
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card 
      shadow={isCompact ? 'none' : 'sm'} 
      padding={isCompact ? 0 : 'md'}
      withBorder={!isCompact}
    >
      <RichTextEditor 
        editor={editor} 
        onKeyDown={handleKeyDown}
        styles={{
          root: {
            border: isCompact ? '1px solid var(--mantine-color-gray-3)' : 'none',
          },
          content: {
            minHeight: isCompact ? '80px' : '120px',
            '.ProseMirror': {
              minHeight: isCompact ? '60px' : '100px',
              padding: '12px',
            },
            '.ProseMirror:focus': {
              outline: 'none',
            },
          },
        }}
      >
        <RichTextEditor.Toolbar>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.CodeBlock />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>

      <Group justify="flex-end" mt="md" px={isCompact ? 'md' : 0} pb={isCompact ? 'md' : 0}>
        {onCancel && (
          <Button
            variant="subtle"
            size="sm"
            leftSection={<IconX size={16} />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        )}
        <Button
          size="sm"
          leftSection={<IconSend size={16} />}
          onClick={handleSubmit}
          disabled={!editor || !editor.getText().trim()}
        >
          {submitLabel}
        </Button>
      </Group>
    </Card>
  );
}