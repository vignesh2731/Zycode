"use client";

import Editor, { OnMount } from "@monaco-editor/react";

type Props = {
  code: string;
  setCodeAction: (val: string) => void;
};

export default function CodeEditor({ code, setCodeAction }: Props) {
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    monaco.editor.defineTheme("zinc-theme", {
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
    });

    monaco.editor.setTheme("zinc-theme");
  };

  return (
    <div className="h-[500px] min-h-[550px] max-h-[550px] border border-zinc-300 rounded-md overflow-hidden bg-zinc-50">
      <Editor
        height="100%"
        language="cpp"
        value={code}
        onChange={(value) => setCodeAction(value ?? "")}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          renderLineHighlight: "all",
          guides: {
            indentation: true,
          },
        }}
      />
    </div>
  );
}
