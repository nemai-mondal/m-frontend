import { useCallback, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const useTextEditor = ({ height = 200, initialValue = "" } = {}) => {
  const editorRef = useRef();
  const [initValue, setInitValue] = useState(initialValue);

  const getCharacterCount = () => {
    return (
      editorRef?.current?.plugins?.wordcount?.body?.getCharacterCount() || 0
    );
  };
  const getContent = () => {
    if (editorRef.current) {
      return editorRef.current.getContent();
    } else {
      return ""; // or handle the case as per your requirement
    }
  };

  const setInitialValue = (value) => {
    setInitValue(value);
  };

  const setContent = (content) => {
    if (editorRef.current) {
      editorRef.current.setContent(content);
    }
  };
  const TextEditor = useCallback(
    ({ getEditorChangeFunc }) => (
      <div>
        <Editor
          onEditorChange={getEditorChangeFunc}
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          selector="textarea#file-picker"
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue={initValue || ""}
          init={{
            height: height || 200,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "wordcount",
              "editimage",
            ],
            // image_title: true,
            // automatic_uploads: true,
            file_picker_types: "image",
            branding: false,
            toolbar:
              "bold italic underline strikethrough undo redo link image bullist numlist blockquote removeformat",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            // file_picker_callback: (cb, value, meta) => {
            //   const input = document.createElement("input");
            //   input.setAttribute("type", "file");
            //   input.setAttribute("accept", "image/*");

            //   input.addEventListener("change", (e) => {
            //     const file = e.target.files[0];

            //     const reader = new FileReader();
            //     reader.addEventListener("load", () => {
            //       /*
            //         Note: Now we need to register the blob in TinyMCEs image blob
            //         registry. In the next release this part hopefully won't be
            //         necessary, as we are looking to handle it internally.
            //       */
            //       const id = "blobid" + new Date().getTime();
            //       console.log(editorRef);
            //       const blobCache = editorRef.current.editorUpload.blobCache;
            //       const base64 = reader.result.split(",")[1];
            //       const blobInfo = blobCache.create(id, file, base64);
            //       blobCache.add(blobInfo);

            //       /* call the callback and populate the Title field with the file name */
            //       cb(blobInfo.blobUri(), { title: file.name });
            //     });
            //     reader.readAsDataURL(file);
            //   });

            //   input.click();
            // }
          }}
        />
      </div>
    ),
    [initValue]
  );

  return {
    TextEditor,
    getContent,
    setContent,
    setInitialValue,
    getCharacterCount,
  };
};

export default useTextEditor;
