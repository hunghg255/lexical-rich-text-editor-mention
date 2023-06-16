import {
  $getSelection,
  $isRangeSelection,
  DEPRECATED_$isGridSelection,
  $createParagraphNode,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { useEffect, useRef, useState } from "react";
import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";
import { BsTextParagraph } from "react-icons/bs";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";
import { RxCaretDown } from "react-icons/rx";
import { blockTypeToBlockName } from "@/src/components/Toolbar";

type HeadingTagType = "h1" | "h2" | "h3";

interface IHeading {
  id: number;
  tag: HeadingTagType;
  icon: JSX.Element;
  text: string;
}

const HeadingTags: IHeading[] = [
  { id: 1, tag: "h1", icon: <LuHeading1 />, text: "Heading 1" },
  { id: 2, tag: "h2", icon: <LuHeading2 />, text: "Heading 2" },
  { id: 3, tag: "h3", icon: <LuHeading3 />, text: "Heading 3" },
];

type ListTagType = "ul" | "ol";

type IParagraphTag = {
  id: number;
  icon: JSX.Element;
  name: string;
};

type IHeadingTag = {
  id: number;
  tag: HeadingTagType;
  icon: JSX.Element;
  name: string;
};

type IListTag = {
  id: number;
  tag: ListTagType;
  icon: JSX.Element;
  name: string;
};

type ITag = IParagraphTag | IHeadingTag | IListTag;

const PTag: IParagraphTag[] = [
  { id: 1, icon: <BsTextParagraph />, name: "Normal" },
];

const HTags: ITag[] = [
  { id: 1, tag: "h1", icon: <LuHeading1 />, name: "Heading 1" },
  { id: 2, tag: "h2", icon: <LuHeading2 />, name: "Heading 2" },
  { id: 3, tag: "h3", icon: <LuHeading3 />, name: "Heading 3" },
];

const ListTags: ITag[] = [
  { id: 1, tag: "ul", icon: <AiOutlineUnorderedList />, name: "Bullet List" },
  { id: 2, tag: "ol", icon: <AiOutlineOrderedList />, name: "Numbered List" },
];

const Tags: ITag[] = [...PTag, ...HTags, ...ListTags];

export default function HeadingToolbarPlugin({
  blockType,
}: {
  blockType: keyof typeof blockTypeToBlockName;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [selectedOption, setSelectedOption] = useState<ITag>(Tags[0]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (
        $isRangeSelection(selection) ||
        DEPRECATED_$isGridSelection(selection)
      ) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
    setSelectedOption(Tags[0]);
    setIsOpen(false);
  };
  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
    setIsOpen(false);
  };

  const formatBulletList = () => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
    setSelectedOption(Tags[4]);
    setIsOpen(false);
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
    setSelectedOption(Tags[5]);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          id="dropdownHoverButton"
          className="text-gray-900 bg-gray-50 hover:bg-gray-200 focus:ring-4 focus:outline-none border border-gray-300 focus:ring-gray-300 font-medium rounded-lg text-lg px-3 py-2.5 text-center inline-flex items-center"
          type="button"
          onClick={() => setIsOpen(!isOpen)}>
          {selectedOption.icon}
          <RxCaretDown className="w-6 h-6 ml-1" />
        </button>
        {isOpen && (
          <div className="absolute top-2 left-0 z-10 mt-10 bg-gray-50 divide-y divide-gray-100 rounded-lg shadow-sm">
            <ul className="py-1 text-sm text-gray-700">
              <li>
                <button
                  type="button"
                  onClick={formatParagraph}
                  className="inline-flex w-36 pl-2 items-center py-2 text-sm text-gray-700 hover:bg-gray-200">
                  <BsTextParagraph className="w-5 h-5 mr-1" /> Normal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => formatHeading("h1")}
                  className="inline-flex w-36 pl-2 items-center py-2 text-sm text-gray-700 hover:bg-gray-200">
                  <LuHeading1 className="w-5 h-5 mr-1" /> Heading 1
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => formatHeading("h2")}
                  className="inline-flex w-36 pl-2 items-center py-2 text-sm text-gray-700 hover:bg-gray-200">
                  <LuHeading2 className="w-5 h-5 mr-1" /> Heading 2
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => formatHeading("h3")}
                  className="inline-flex w-36 pl-2 items-center py-2 text-sm text-gray-700 hover:bg-gray-200">
                  <LuHeading3 className="w-5 h-5 mr-1" /> Heading 3
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={formatBulletList}
                  className="inline-flex w-36 pl-2 items-center py-2 text-sm text-gray-700 hover:bg-gray-200">
                  <AiOutlineUnorderedList className="w-5 h-5 mr-1" /> Bulleted
                  List
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={formatNumberedList}
                  className="inline-flex w-36 pl-2 items-center py-2 text-sm text-gray-700 hover:bg-gray-200">
                  <AiOutlineOrderedList className="w-5 h-5 mr-1" /> Numbered
                  List
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
