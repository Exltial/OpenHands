import React from "react";
import { ConnectToProviderMessage } from "./connect-to-provider-message";
import { RepositorySelectionForm } from "./repo-selection-form";
import { LocalCodeUpload } from "./local-code-upload";
import { useUserProviders } from "#/hooks/use-user-providers";
import { GitRepository } from "#/types/git";

interface RepoConnectorProps {
  onRepoSelection: (repo: GitRepository | null) => void;
}

type TabType = "git" | "local";

export function RepoConnector({ onRepoSelection }: RepoConnectorProps) {
  const { providers, isLoadingSettings } = useUserProviders();
  const [activeTab, setActiveTab] = React.useState<TabType>("git");

  const providersAreSet = providers.length > 0;

  const handleFilesSelected = () => {
    // Clear git repository selection when files are selected
    onRepoSelection(null);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Clear selections when switching tabs
    onRepoSelection(null);
  };

  return (
    <section
      data-testid="repo-connector"
      className="w-full flex flex-col gap-6 rounded-[12px] p-[20px] border border-[#727987] bg-[#26282D] min-h-[263.5px] relative"
    >
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-600">
        <button
          type="button"
          onClick={() => handleTabChange("git")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "git"
              ? "border-blue-400 text-blue-400"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          Git Repository
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("local")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "local"
              ? "border-blue-400 text-blue-400"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          Local Code
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "git" && (
        <>
          {!providersAreSet && <ConnectToProviderMessage />}
          {providersAreSet && (
            <RepositorySelectionForm
              onRepoSelection={onRepoSelection}
              isLoadingSettings={isLoadingSettings}
            />
          )}
        </>
      )}

      {activeTab === "local" && (
        <LocalCodeUpload onFilesSelected={handleFilesSelected} />
      )}
    </section>
  );
}
