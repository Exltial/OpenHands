# Local Code Upload Feature

This document describes the new local code upload feature that allows users to upload their local code files directly to OpenHands without needing a Git repository.

## Overview

The local code upload feature provides an alternative to Git repository integration, allowing users to:
- Upload local code files directly from their computer
- Work with code that isn't in a Git repository
- Quickly prototype or test code without setting up version control

## User Interface

### Main Page
On the OpenHands home page, users will see two tabs in the repository connector section:
1. **Git Repository** - The existing Git repository selection functionality
2. **Local Code** - The new local code upload functionality

### Local Code Tab
The Local Code tab includes:
- A drag-and-drop area for file uploads
- File browser button for manual file selection
- List of selected files with file sizes
- Clear button to remove selected files
- Launch button to create a conversation with the uploaded files

### File Upload Area
- Supports drag-and-drop functionality
- Accepts all file types (though code files are recommended)
- Shows visual feedback when files are dragged over the area
- Displays selected files with their names and sizes

## Technical Implementation

### Frontend Components

#### LocalCodeUpload Component
- Located: `frontend/src/components/features/home/local-code-upload.tsx`
- Handles file selection, drag-and-drop, and UI display
- Integrates with the conversation creation flow

#### RepoConnector Component
- Modified to include tab navigation between Git and Local Code options
- Manages state switching between different input modes

#### Local Files Store
- Located: `frontend/src/stores/local-files-store.ts`
- Manages pending file uploads using Zustand
- Stores files temporarily until conversation is ready

### Backend Changes

#### API Models
- Extended `AppConversationStartRequest` to include:
  - `use_local_code: bool` - Flag indicating local code upload mode
  - `local_files_metadata: list[dict]` - Metadata about uploaded files

#### Service Layer
- Modified `GitAppConversationService` to handle local code setup
- Added `setup_local_code` method to prepare workspace for local files
- Initializes Git repository for local code if configured

### File Upload Flow

1. **File Selection**: User selects files in the Local Code tab
2. **Conversation Creation**: System creates a conversation task with local code metadata
3. **Workspace Preparation**: Backend prepares workspace for local files
4. **Task Polling**: Frontend polls task status until ready
5. **File Upload**: When task is ready, files are uploaded to the conversation workspace
6. **Navigation**: User is redirected to the conversation page

## API Changes

### V1 Conversation API
Extended `V1AppConversationStartRequest` to include:
```typescript
use_local_code?: boolean;
local_files_metadata?: Array<{
  name: string;
  size: number;
  type: string;
}>;
```

### File Upload Integration
- Uses existing V1 file upload API (`/api/file/upload/{path}`)
- Files are uploaded to `/workspace/{filename}` by default
- Upload happens after conversation workspace is ready

## Usage Instructions

### For Users
1. Navigate to the OpenHands home page
2. Click on the "Local Code" tab in the repository connector
3. Drag and drop files or click "browse files" to select files
4. Review the selected files list
5. Click "Launch" to create a conversation with your local code
6. Wait for the conversation to be created and files to be uploaded
7. Start working with your code in the conversation

### For Developers
The feature integrates seamlessly with existing OpenHands functionality:
- Uses the same conversation creation flow as Git repositories
- Leverages existing file upload mechanisms
- Maintains compatibility with all existing features

## File Handling

### Supported Files
- All file types are accepted
- Recommended for code files (.js, .py, .java, etc.)
- Configuration files (.json, .yaml, .env, etc.)
- Documentation files (.md, .txt, etc.)

### File Organization
- Files are uploaded to the `/workspace` directory
- Maintains original file names
- No automatic directory structure creation (files are placed flat)

### Limitations
- No folder structure preservation (files are uploaded individually)
- Large files may take time to upload
- No automatic Git initialization (optional, configurable)

## Configuration

### Backend Configuration
The feature respects the `init_git_in_empty_workspace` setting:
- If `true`: Initializes a Git repository for uploaded local code
- If `false`: No Git initialization, just file upload

### Frontend Configuration
No additional configuration required. The feature is enabled by default when using V1 API.

## Error Handling

### Upload Failures
- Individual file upload failures are logged
- Conversation creation continues even if some files fail to upload
- Users can manually upload failed files later

### Network Issues
- Robust retry mechanisms for file uploads
- Graceful degradation if upload service is unavailable
- Clear error messages for users

## Future Enhancements

Potential improvements for future versions:
1. **Folder Upload**: Support for uploading entire folder structures
2. **File Filtering**: Allow users to exclude certain file types
3. **Compression**: Automatic compression for large file sets
4. **Progress Indicators**: Real-time upload progress for large files
5. **File Preview**: Preview file contents before upload
6. **Batch Operations**: Select/deselect all files functionality

## Testing

### Manual Testing
1. Test file selection via drag-and-drop
2. Test file selection via file browser
3. Test conversation creation with local files
4. Test file upload after conversation is ready
5. Test error handling for upload failures

### Automated Testing
- Unit tests for LocalCodeUpload component
- Integration tests for file upload flow
- API tests for backend changes

## Compatibility

### Browser Support
- Modern browsers with File API support
- Drag-and-drop requires HTML5 support
- File upload requires XMLHttpRequest Level 2

### OpenHands Versions
- Compatible with V1 API
- Backward compatible with existing Git repository functionality
- No breaking changes to existing features