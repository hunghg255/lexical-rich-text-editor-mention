import { EditorState } from "lexical";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { useEffect } from "react";
import ToolbarPlugin from "@/src/components/Toolbar";
import { editorNodes } from "@/src/utils/editorNodes";
import MentionsPlugin from "@/src/plugins/MentionsPlugin";
import { MentionNode } from "@/src/utils/metionNodes";
import { BeautifulMentionNode, BeautifulMentionsPlugin } from "@/src/Mentions";

const theme = {
  // Theme styling goes here
  heading: {
    h1: "text-2xl",
    h2: "text-xl",
    h3: "text-lg",
  },
  paragraph: "text-base text-indigo-700",
  text: {
    bold: "font-bold text-green-600",
    italic: "font-italic",
    code: "editor-textCode",
    strikethrough: "editor-textStrikethrough",
    subscript: "editor-textSubscript",
    superscript: "editor-textSuperscript",
    underline: "editor-textUnderline",
    underlineStrikethrough: "editor-textUnderlineStrikethrough",
  },
};

function MyOnChangePlugin(props: {
  onChange: (editorState: EditorState) => void;
}) {
  const { onChange } = props;
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [onChange, editor]);
  return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.log(error);
}

const mentionItems = {
  "@": ["Anton", "Boris", "Catherine", "Dmitri", "Elena", "Felix", "Gina"],
};

const Editor = () => {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [...editorNodes, BeautifulMentionNode],
    beautifulMentions: {
      "@": `px-1 mx-px ...`, // use the trigger name as the key
    },
  };

  return (
    <>
      <LexicalComposer initialConfig={initialConfig}>
            <ToolbarPlugin />
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="block h-96 rounded-lg border-0 bg-white p-3 text-sm text-gray-800 outline-none focus:ring-0" />
              }
              placeholder={
                <div className="absolute top-[132px] px-3">
                  Enter some text...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            {/* <MyOnChangePlugin
              onChange={(editorState) => {
                console.log(editorState);
              }}
            /> */}
            <OnChangePlugin  onChange={(editorState) => {
                console.log(editorState);
              }}/>
            <HistoryPlugin />

            <ListPlugin />

            <BeautifulMentionsPlugin
      items={mentionItems}
    />
            {/* <MentionsPlugin /> */}

          </LexicalComposer>
    </>
  );
}

export default Editor;
