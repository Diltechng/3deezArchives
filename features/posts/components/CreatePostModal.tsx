import { Input, Select, TextArea } from "@/features/shared/components/Input";
import { PostVisibilityValues } from "@/shared/constants/enums";
import { UploadCloud } from "lucide-react";

const CreatePostModal = ({ onExit }: {
  onExit?: () => any;
}) => {
  async function handleUpload() {
    console.log("Uploading");
  }

  return (
    <div className="fixed flex flex-col p-8 top-0 bottom-0 left-0 right-0 backdrop-blur-sm bg-black/20">
      <div className="flex flex-col m-auto h-full w-full max-w-120 p-3 rounded-2xl shadow-lg border border-border-primary bg-surface">
        <h1 className="px-3 pb-3 font-bold text-slate-700">Upload Media</h1>
        <div className="overflow-x-auto mx-4">
          <div className="
            relative flex justify-center items-center bg-slate-700/5 duration-200 border-2
            border-dashed border-slate-700/30 hover:border-slate-700/40 rounded-lg overflow-hidden
          ">
            <div className="flex flex-col items-center p-12">
              <div className="text-blue-400 bg-white h-16 w-16 p-3 rounded-full mb-4">
                <UploadCloud className="w-full h-full" />
              </div>
              <h1 className="text-slate-700 font-bold">Drop files here to upload</h1>
              <h2 className="text-slate-400 text-sm text-center">Support for high resolution JPGs, PNGs and WEBPs up to 10MB.</h2>
              <label
                className="relative px-4 py-1 rounded-md mt-4 overflow-hidden duration-200 cursor-pointer text-white bg-slate-700 hover:bg-slate-800"
              >
                <span>Browse Files</span>
                <input
                  className="w-full h-full top-0 left-0 absolute opacity-0 pointer-events-none"
                  type="file"
                  accept="image/jpeg"
                  onChange={e => {
                    const [file] = e.target.files!;

                    if (!file) return;

                    console.log({
                      blobUrl: URL.createObjectURL(file),
                      file
                    });
                  }}
                />
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div>

            </div>
            <Input
              label="Title"
              placeholder="eg. Studio Session Vol.4"
            />
            <TextArea
              label="Description"
              placeholder="Describe this moment."
            />
            <div className="grid grid-cols-2 gap-y-1 gap-x-2">
              <Select label="Category">
                <option>Select a category</option>
                <option>Category 1</option>
              </Select>
              <Input
                label="Date of Moment"
                type="date"
              />
              <Input
                label="Tags"
                placeholder="eg. Minna, 2026, Studio"
              />
              <Select label="Visibility">
                {PostVisibilityValues.map(option => (
                  <option value={option}>{option}</option>
                ))}
              </Select>
            </div>
          </div>
        </div>
        <div className="flex gap-2 pt-3 justify-end mt-auto">
          <button
            className="px-3 py-2 rounded-lg text-accent-text bg-neutral-500 hover:bg-neutral-600"
            onClick={onExit}
          >
            Cancel
          </button>
          <button
            className="px-3 py-2 rounded-lg text-accent-text bg-accent hover:bg-accent-hover"
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreatePostModal;