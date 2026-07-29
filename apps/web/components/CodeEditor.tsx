"use client"

import Editor, { OnMount } from "@monaco-editor/react"
import { useTheme } from "next-themes"

type Props = {
  code: string
  setCodeAction: (val: string) => void
}

export default function CodeEditor({ code, setCodeAction }: Props) {
  const { resolvedTheme } = useTheme()

  const handleEditorDidMount: OnMount = (_editor, monaco) => {
    monaco.editor.defineTheme("zinc-light", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#fafafa",
        "editorLineNumber.foreground": "#a1a1aa",
        "editorLineNumber.activeForeground": "#27272a",
        "editor.lineHighlightBackground": "#f4f4f5",
        "editor.lineHighlightBorder": "#d4d4d8",
        "editorIndentGuide.background": "#e4e4e7",
        "editorIndentGuide.activeBackground": "#a1a1aa",
      },
    })
    monaco.editor.defineTheme("zinc-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1c1c1c",
        "editorLineNumber.foreground": "#71717a",
        "editorLineNumber.activeForeground": "#d4d4d8",
        "editor.lineHighlightBackground": "#27272a",
        "editor.lineHighlightBorder": "#3f3f46",
        "editorIndentGuide.background": "#3f3f46",
        "editorIndentGuide.activeBackground": "#71717a",
      },
    })
    monaco.editor.setTheme(
      resolvedTheme === "dark" ? "zinc-dark" : "zinc-light"
    )
  }

  return (
    <div className="h-full overflow-hidden">
      <Editor
        height="100%"
        language="cpp"
        value={code}
        theme={resolvedTheme === "dark" ? "zinc-dark" : "zinc-light"}
        onChange={(value) => setCodeAction(value ?? "")}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          renderLineHighlight: "all",
          guides: { indentation: true },
        }}
      />
    </div>
  )
}
