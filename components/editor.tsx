"use client"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import { useEffect, useState } from "react"

export const Editor = ({
  value,
  onChange
}: {
  value: string
  onChange: (value: string) => void
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-5" // Estilo para viñetas
          }
        }
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 hover:underline",
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      if (html !== "<p></p>") {  // Evita guardar cuando está vacío
        onChange(html)
      }
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none p-4 min-h-[300px]",
      },
    }
  })

  useEffect(() => {
    setIsMounted(true)
    return () => {
      if (editor) {
        editor.destroy()
      }
    }
  }, [])

  useEffect(() => {
    if (isMounted && editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "")
    }
  }, [value, isMounted])

  const setLink = () => {
    const previousUrl = editor?.getAttributes('link').href
    const url = prompt('Ingresa la URL:', previousUrl || 'https://')
    
    if (url === null) return
    if (url === '') {
      editor?.chain().focus().unsetLink().run()
      return
    }
    
    editor?.chain().focus().setLink({ href: url }).run()
  }

  if (!isMounted) {
    return <div className="border rounded-lg bg-white p-4 min-h-[300px]">Cargando editor...</div>
  }

  return (
    <div className="border rounded-lg bg-white">
      <div className="flex flex-wrap gap-1 border-b p-2">
        {/* Botones de formato */}
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${editor?.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        >
          • Lista
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${editor?.isActive('orderedList') ? 'bg-gray-200' : ''}`}
        >
          1. Lista
        </button>
        <button
          onClick={setLink}
          className={`p-2 rounded ${editor?.isActive('link') ? 'bg-gray-200' : ''}`}
        >
          🔗
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}