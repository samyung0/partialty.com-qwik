/** @jsxImportSource react */
import { qwikify$ } from "@builder.io/qwik-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone-esm";

function imgDropZone({
  secure_url,
  width,
  height,
  handleImage,
  bioErrorMsg,
}: {
  secure_url: string;
  width: number;
  height: number;
  handleImage: (file: File) => void;
  bioErrorMsg: string;
}) {
  const onDrop = useCallback((acceptedFiles: any) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    handleImage(acceptedFiles[0] as File);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
  });

  return (
    <div className="block">
      <label
        htmlFor="avatar"
        className="flex cursor-pointer flex-col items-center justify-center text-[1rem] lg:text-lg"
        {...getRootProps()}
      >
        <div id="imgContainer">
          <img
            className="h-[100px] w-[100px] rounded-full object-cover"
            src={secure_url}
            alt="Avatar"
            width={width}
            height={height}
          />
        </div>
        {isDragActive ? (
          <p className="pt-4 underline decoration-wavy underline-offset-[6px]">Drop it!</p>
        ) : (
          <p className="pt-4 underline decoration-wavy underline-offset-[6px]">Change Avatar</p>
        )}
      </label>
      <div className="pt-1">
        <input
          id="avatar"
          type="file"
          accept="image/*"
          hidden
          className="hidden"
          onChange={(e: any) => {
            if (!e.target.files || e.target.files.length === 0) return;
            handleImage(e.target.files[0]);
          }}
        />
      </div>
      <p className="w-[250px] pt-2 text-center text-[0.75rem] tracking-wide text-tomato md:w-[300px] md:text-[1rem]">
        {bioErrorMsg}
      </p>
    </div>
  );
}

export default qwikify$(imgDropZone, { eagerness: "visible" });
