import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useCreateConversation } from "#/hooks/mutation/use-create-conversation";
import { useIsCreatingConversation } from "#/hooks/use-is-creating-conversation";
import { useLocalFilesStore } from "#/stores/local-files-store";
import { BrandButton } from "../settings/brand-button";
import { I18nKey } from "#/i18n/declaration";
import UploadIcon from "#/icons/upload.svg?react";

interface LocalCodeUploadProps {
  onFilesSelected: (files: File[]) => void;
}

export function LocalCodeUpload({ onFilesSelected }: LocalCodeUploadProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const {
    mutate: createConversation,
    isPending,
    isSuccess,
  } = useCreateConversation();
  const isCreatingConversationElsewhere = useIsCreatingConversation();
  const { setPendingFiles } = useLocalFilesStore();

  const isCreatingConversation =
    isPending || isSuccess || isCreatingConversationElsewhere;

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
    onFilesSelected(fileArray);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleClearFiles = () => {
    setSelectedFiles([]);
    onFilesSelected([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleLaunchWithLocalCode = () => {
    createConversation(
      {
        localFiles: selectedFiles,
      },
      {
        onSuccess: (data) => {
          // Store files for upload after conversation is ready
          if (data.v1_task_id && selectedFiles.length > 0) {
            setPendingFiles(data.v1_task_id, selectedFiles);
          }
          navigate(`/conversations/${data.conversation_id}`);
        },
      },
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[10px] pb-4">
          <UploadIcon width={24} height={24} />
          <span className="leading-5 font-bold text-base text-white">
            Upload Local Code
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-[10px] pb-4">
        <span className="text-sm text-white font-normal leading-[22px]">
          Upload your local code files to start working with them
        </span>

        {/* File Upload Area */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragOver 
              ? "border-blue-400 bg-blue-50/10" 
              : "border-gray-600 hover:border-gray-500"
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseFiles}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileInputChange}
            accept="*"
          />
          <div className="flex flex-col items-center gap-2">
            <UploadIcon width={32} height={32} className="text-gray-400" />
            <p className="text-white">
              Drag and drop files here or{" "}
              <span className="text-blue-400 underline ml-1">
                browse files
              </span>
            </p>
            <p className="text-sm text-gray-400">
              Supports all common code file types
            </p>
          </div>
        </div>

        {/* Selected Files Display */}
        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">
                Selected Files ({selectedFiles.length})
              </span>
              <button
                type="button"
                onClick={handleClearFiles}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Clear
              </button>
            </div>
            <div className="max-h-32 overflow-y-auto border border-gray-600 rounded p-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1 text-sm"
                >
                  <span className="text-white truncate flex-1">{file.name}</span>
                  <span className="text-gray-400 ml-2">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BrandButton
        testId="local-code-launch-button"
        variant="primary"
        type="button"
        isDisabled={selectedFiles.length === 0 || isCreatingConversation}
        onClick={handleLaunchWithLocalCode}
        className="w-full font-semibold"
      >
        {!isCreatingConversation && t(I18nKey.HOME$LAUNCH)}
        {isCreatingConversation && t(I18nKey.HOME$LOADING)}
      </BrandButton>
    </div>
  );
}