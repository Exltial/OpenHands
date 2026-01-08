import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useCreateConversation } from "#/hooks/mutation/use-create-conversation";
import { useIsCreatingConversation } from "#/hooks/use-is-creating-conversation";
import { useLocalFilesStore } from "#/stores/local-files-store";
import { BrandButton } from "../settings/brand-button";
import { I18nKey } from "#/i18n/declaration";
import UploadIcon from "#/icons/upload.svg?react";

// Extended file interface to include path information
interface FileWithPath extends File {
  webkitRelativePath: string;
  relativePath?: string;
}

interface LocalCodeUploadProps {
  onFilesSelected: (files: File[]) => void;
}

export function LocalCodeUpload({ onFilesSelected }: LocalCodeUploadProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const folderInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = React.useState<FileWithPath[]>([]);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [uploadMode, setUploadMode] = React.useState<'files' | 'folder'>('files');

  const {
    mutate: createConversation,
    isPending,
    isSuccess,
  } = useCreateConversation();
  const isCreatingConversationElsewhere = useIsCreatingConversation();
  const { setPendingFiles } = useLocalFilesStore();

  const isCreatingConversation =
    isPending || isSuccess || isCreatingConversationElsewhere;

  const processDirectoryEntry = async (entry: FileSystemDirectoryEntry, path = ""): Promise<FileWithPath[]> => {
    const files: FileWithPath[] = [];
    const reader = entry.createReader();
    
    return new Promise((resolve) => {
      const readEntries = () => {
        reader.readEntries(async (entries) => {
          if (entries.length === 0) {
            resolve(files);
            return;
          }
          
          for (const entry of entries) {
            const fullPath = path ? `${path}/${entry.name}` : entry.name;
            
            if (entry.isFile) {
              const fileEntry = entry as FileSystemFileEntry;
              const file = await new Promise<File>((resolve) => {
                fileEntry.file(resolve);
              });
              
              // Add path information to the file
              const fileWithPath = file as FileWithPath;
              fileWithPath.relativePath = fullPath;
              fileWithPath.webkitRelativePath = fullPath;
              files.push(fileWithPath);
            } else if (entry.isDirectory) {
              const dirEntry = entry as FileSystemDirectoryEntry;
              const subFiles = await processDirectoryEntry(dirEntry, fullPath);
              files.push(...subFiles);
            }
          }
          
          readEntries(); // Continue reading
        });
      };
      
      readEntries();
    });
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files) as FileWithPath[];
    // For regular file input, add relative path information
    fileArray.forEach(file => {
      if (!file.relativePath) {
        file.relativePath = file.webkitRelativePath || file.name;
      }
    });
    
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

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const items = Array.from(event.dataTransfer.items);
    const files: FileWithPath[] = [];
    
    for (const item of items) {
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          if (entry.isFile) {
            const file = item.getAsFile();
            if (file) {
              const fileWithPath = file as FileWithPath;
              fileWithPath.relativePath = file.name;
              fileWithPath.webkitRelativePath = file.name;
              files.push(fileWithPath);
            }
          } else if (entry.isDirectory) {
            const dirEntry = entry as FileSystemDirectoryEntry;
            const dirFiles = await processDirectoryEntry(dirEntry, entry.name);
            files.push(...dirFiles);
          }
        }
      }
    }
    
    if (files.length > 0) {
      setSelectedFiles(files);
      onFilesSelected(files);
    }
  };

  const handleBrowseFiles = () => {
    if (uploadMode === 'files') {
      fileInputRef.current?.click();
    } else {
      folderInputRef.current?.click();
    }
  };

  const handleBrowseFolder = () => {
    folderInputRef.current?.click();
  };

  const handleClearFiles = () => {
    setSelectedFiles([]);
    onFilesSelected([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (folderInputRef.current) {
      folderInputRef.current.value = "";
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
          Upload your local code files or entire project folder to start working with them
        </span>

        {/* Upload Mode Selector */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setUploadMode('files')}
            className={`px-3 py-2 text-sm rounded transition-colors ${
              uploadMode === 'files'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Select Files
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('folder')}
            className={`px-3 py-2 text-sm rounded transition-colors ${
              uploadMode === 'folder'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Select Folder
          </button>
        </div>

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
          <input
            ref={folderInputRef}
            type="file"
            // @ts-ignore - webkitdirectory is not in the standard types
            webkitdirectory=""
            className="hidden"
            onChange={handleFileInputChange}
          />
          <div className="flex flex-col items-center gap-2">
            <UploadIcon width={32} height={32} className="text-gray-400" />
            <p className="text-white">
              {uploadMode === 'files' ? (
                <>
                  Drag and drop files here or{" "}
                  <span className="text-blue-400 underline ml-1">
                    browse files
                  </span>
                </>
              ) : (
                <>
                  Drag and drop a folder here or{" "}
                  <span className="text-blue-400 underline ml-1">
                    browse folder
                  </span>
                </>
              )}
            </p>
            <p className="text-sm text-gray-400">
              {uploadMode === 'files' 
                ? 'Supports all common code file types'
                : 'Upload entire project with folder structure'
              }
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
            <div className="max-h-40 overflow-y-auto border border-gray-600 rounded p-2">
              {selectedFiles.map((file, index) => {
                const relativePath = file.relativePath || file.name;
                const pathParts = relativePath.split('/');
                const fileName = pathParts[pathParts.length - 1];
                const folderPath = pathParts.slice(0, -1).join('/');
                
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between py-1 text-sm hover:bg-gray-700/30 rounded px-1"
                  >
                    <div className="flex-1 min-w-0">
                      {folderPath && (
                        <div className="text-gray-400 text-xs truncate">
                          {folderPath}/
                        </div>
                      )}
                      <div className="text-white truncate" title={relativePath}>
                        {fileName}
                      </div>
                    </div>
                    <span className="text-gray-400 ml-2 text-xs">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Project Summary */}
            {uploadMode === 'folder' && selectedFiles.length > 0 && (
              <div className="mt-2 p-2 bg-gray-800/50 rounded text-xs">
                <div className="text-gray-300">
                  Project structure: {new Set(selectedFiles.map(f => (f.relativePath || f.name).split('/')[0])).size} top-level items
                </div>
                <div className="text-gray-400">
                  Total size: {formatFileSize(selectedFiles.reduce((sum, file) => sum + file.size, 0))}
                </div>
              </div>
            )}
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