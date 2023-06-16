import HeadingToolbarPlugin from "@/src/plugins/HeadingToolbarPlugin";
import { useState } from "react";

export const blockTypeToBlockName = {
  bullet: "Bulleted List",
  check: "Check List",
  code: "Code Block",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  number: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
};

export default function ToolbarPlugin(): JSX.Element {
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");

  return (
    <div className="flex items-center space-x-2">
      <HeadingToolbarPlugin blockType={blockType} />
    </div>
  );
}
