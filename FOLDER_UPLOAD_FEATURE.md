# 文件夹上传功能 (Folder Upload Feature)

## 概述 (Overview)

本功能扩展了OpenHands的本地代码上传能力，从仅支持单个文件上传升级为支持完整项目文件夹上传，同时保持原有的文件夹结构。

This feature extends OpenHands' local code upload capability from supporting only individual file uploads to supporting complete project folder uploads while maintaining the original folder structure.

## 主要功能 (Key Features)

### 1. 文件夹选择模式 (Folder Selection Mode)
- 添加了文件/文件夹切换按钮
- 支持 `webkitdirectory` 属性进行文件夹选择
- 用户可以选择上传单个文件或整个项目文件夹

### 2. 拖拽文件夹支持 (Drag & Drop Folder Support)
- 支持拖拽整个文件夹到上传区域
- 递归处理文件夹结构
- 自动提取所有子文件和子文件夹

### 3. 文件夹结构保持 (Folder Structure Preservation)
- 保持原有的相对路径信息
- 在上传时创建对应的目录结构
- 文件按原有层级关系存储

### 4. 改进的用户界面 (Enhanced User Interface)
- 文件列表显示完整的相对路径
- 分层显示文件夹和文件名
- 项目结构摘要信息
- 总文件大小统计

## 技术实现 (Technical Implementation)

### 前端修改 (Frontend Changes)

#### 1. LocalCodeUpload 组件增强
```typescript
// 新增文件夹模式状态
const [uploadMode, setUploadMode] = React.useState<'files' | 'folder'>('files');

// 扩展文件接口支持路径信息
interface FileWithPath extends File {
  webkitRelativePath: string;
  relativePath?: string;
}
```

#### 2. 文件夹处理逻辑
```typescript
// 递归处理文件夹条目
const processDirectoryEntry = async (entry: FileSystemDirectoryEntry, path = ""): Promise<FileWithPath[]> => {
  // 递归读取文件夹内容
  // 保持相对路径信息
  // 返回所有文件的列表
}
```

#### 3. 文件上传路径处理
```typescript
// 使用相对路径进行上传
const relativePath = fileWithPath.relativePath || fileWithPath.webkitRelativePath || file.name;
const filePath = `/workspace/${relativePath}`;
```

### 后端修改 (Backend Changes)

#### 1. 新增路径上传API
```python
@app.post('/api/file/upload/{file_path:path}')
async def upload_file_with_path(file_path: str, file: UploadFile):
    """Upload a file to a specific path, creating directories as needed."""
    # 创建目录结构
    dir_path = os.path.dirname(file_path)
    if dir_path and not os.path.exists(dir_path):
        os.makedirs(dir_path, exist_ok=True)
    
    # 写入文件
    with open(file_path, 'wb') as buffer:
        shutil.copyfileobj(file.file, buffer)
```

## 使用方法 (Usage)

### 1. 上传单个文件 (Upload Individual Files)
1. 在主页选择"Local Code"标签
2. 确保选择"Select Files"模式
3. 点击上传区域或拖拽文件
4. 选择要上传的文件
5. 点击"Start Coding"开始

### 2. 上传项目文件夹 (Upload Project Folder)
1. 在主页选择"Local Code"标签
2. 点击"Select Folder"按钮
3. 选择项目文件夹或拖拽整个文件夹
4. 查看文件列表确认结构正确
5. 点击"Start Coding"开始

## 文件结构示例 (File Structure Example)

上传前的项目结构：
```
my-project/
├── README.md
├── package.json
├── src/
│   ├── main.py
│   ├── utils.py
│   └── components/
│       ├── header.js
│       └── footer.js
├── tests/
│   └── test_main.py
└── docs/
    └── api.md
```

上传后在OpenHands工作空间中的结构：
```
/workspace/
├── my-project/
│   ├── README.md
│   ├── package.json
│   ├── src/
│   │   ├── main.py
│   │   ├── utils.py
│   │   └── components/
│   │       ├── header.js
│   │       └── footer.js
│   ├── tests/
│   │   └── test_main.py
│   └── docs/
│       └── api.md
```

## 测试 (Testing)

使用提供的测试脚本：
```bash
python test_folder_upload.py
```

该脚本会：
1. 验证所有组件是否存在
2. 创建测试项目结构
3. 提供测试指导

## 兼容性 (Compatibility)

- **浏览器支持**: 现代浏览器支持 `webkitdirectory` 属性
- **文件系统**: 支持所有常见的文件类型
- **路径处理**: 自动处理不同操作系统的路径分隔符
- **向后兼容**: 完全兼容原有的单文件上传功能

## 限制 (Limitations)

1. **浏览器限制**: 某些旧版浏览器可能不支持文件夹选择
2. **文件大小**: 受浏览器和服务器配置的文件大小限制
3. **文件数量**: 大量文件可能影响上传性能
4. **特殊字符**: 文件路径中的特殊字符可能需要编码处理

## 未来改进 (Future Improvements)

1. **进度显示**: 添加文件夹上传进度条
2. **文件过滤**: 支持 .gitignore 规则过滤
3. **压缩上传**: 支持文件夹压缩后上传
4. **增量上传**: 支持只上传修改的文件
5. **预览功能**: 上传前预览文件夹结构

## 相关文件 (Related Files)

### 前端文件
- `frontend/src/components/features/home/local-code-upload.tsx` - 主要上传组件
- `frontend/src/hooks/mutation/use-v1-upload-files.ts` - 文件上传Hook
- `frontend/src/stores/local-files-store.ts` - 本地文件状态管理

### 后端文件
- `openhands/runtime/action_execution_server.py` - 文件上传API端点

### 测试文件
- `test_folder_upload.py` - 功能测试脚本

## 总结 (Summary)

这个功能大大提升了OpenHands处理复杂项目的能力，用户现在可以轻松上传整个项目文件夹，而不需要逐个选择文件。文件夹结构的保持确保了代码的组织性和可维护性，使得OpenHands能够更好地理解和处理复杂的代码库。

This feature significantly enhances OpenHands' ability to handle complex projects. Users can now easily upload entire project folders without having to select files individually. The preservation of folder structure ensures code organization and maintainability, allowing OpenHands to better understand and work with complex codebases.