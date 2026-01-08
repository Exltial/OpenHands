import { useMutation } from "@tanstack/react-query";
import { useV1UploadFiles } from "./use-v1-upload-files";

interface UploadLocalFilesToConversationVariables {
  conversationUrl: string | null | undefined;
  sessionApiKey: string | null | undefined;
  files: File[];
}

/**
 * Hook to upload local files to a conversation after it's created
 * This is used for the local code upload feature
 */
export const useUploadLocalFilesToConversation = () => {
  const { mutateAsync: uploadFiles } = useV1UploadFiles();

  return useMutation({
    mutationKey: ["upload-local-files-to-conversation"],
    mutationFn: async (variables: UploadLocalFilesToConversationVariables) => {
      const { conversationUrl, sessionApiKey, files } = variables;

      if (!files || files.length === 0) {
        return { uploaded_files: [], skipped_files: [] };
      }

      // Upload all files to the conversation workspace
      const result = await uploadFiles({
        conversationUrl,
        sessionApiKey,
        files,
      });

      return result;
    },
    meta: {
      disableToast: true,
    },
  });
};