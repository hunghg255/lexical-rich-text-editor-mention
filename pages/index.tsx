import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/src/components/Editor"), { ssr: false})

export default function Index() {

  return (
    <>
      <Editor />
    </>
  );
}
