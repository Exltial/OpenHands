#!/usr/bin/env python3
"""
Test script to verify folder upload functionality
"""

import os
import tempfile
import shutil

def create_test_project():
    """Create a test project structure for testing folder upload"""
    
    # Create temporary directory
    test_dir = tempfile.mkdtemp(prefix="test_project_")
    
    # Create project structure
    project_structure = {
        "README.md": "# Test Project\n\nThis is a test project for folder upload.",
        "package.json": '{\n  "name": "test-project",\n  "version": "1.0.0"\n}',
        "src/main.py": "def main():\n    print('Hello, World!')\n\nif __name__ == '__main__':\n    main()",
        "src/utils.py": "def helper_function():\n    return 'Helper'",
        "src/components/header.js": "export const Header = () => {\n  return <h1>Header</h1>;\n};",
        "src/components/footer.js": "export const Footer = () => {\n  return <footer>Footer</footer>;\n};",
        "tests/test_main.py": "import unittest\n\nclass TestMain(unittest.TestCase):\n    def test_main(self):\n        self.assertTrue(True)",
        "docs/api.md": "# API Documentation\n\nAPI endpoints...",
        ".gitignore": "node_modules/\n*.pyc\n__pycache__/",
        "config/settings.json": '{\n  "debug": true,\n  "port": 3000\n}'
    }
    
    # Create files and directories
    for file_path, content in project_structure.items():
        full_path = os.path.join(test_dir, file_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, 'w') as f:
            f.write(content)
    
    print(f"Created test project at: {test_dir}")
    print("\nProject structure:")
    for root, dirs, files in os.walk(test_dir):
        level = root.replace(test_dir, '').count(os.sep)
        indent = ' ' * 2 * level
        print(f"{indent}{os.path.basename(root)}/")
        subindent = ' ' * 2 * (level + 1)
        for file in files:
            print(f"{subindent}{file}")
    
    return test_dir

def verify_components():
    """Verify that all components exist"""
    
    components = [
        "frontend/src/components/features/home/local-code-upload.tsx",
        "frontend/src/hooks/mutation/use-upload-local-files-to-conversation.ts",
        "frontend/src/hooks/mutation/use-v1-upload-files.ts",
        "frontend/src/stores/local-files-store.ts",
        "frontend/src/icons/upload.svg",
        "openhands/runtime/action_execution_server.py"
    ]
    
    print("Verifying components:")
    all_exist = True
    for component in components:
        if os.path.exists(component):
            print(f"✓ {component}")
        else:
            print(f"✗ {component}")
            all_exist = False
    
    return all_exist

def main():
    print("=== Folder Upload Feature Test ===\n")
    
    # Verify components
    if not verify_components():
        print("\n❌ Some components are missing!")
        return
    
    print("\n✅ All components exist!")
    
    # Create test project
    test_project_dir = create_test_project()
    
    print(f"\n📁 Test project created successfully!")
    print(f"📍 Location: {test_project_dir}")
    print("\n🔧 To test the folder upload feature:")
    print("1. Start OpenHands application")
    print("2. Navigate to the home page")
    print("3. Click on 'Local Code' tab")
    print("4. Click 'Select Folder' button")
    print(f"5. Select the test project folder: {test_project_dir}")
    print("6. Verify that all files are listed with their folder structure")
    print("7. Click 'Start Coding' to create a conversation")
    print("8. Check that files are uploaded with correct paths")
    
    print(f"\n🧹 To clean up: rm -rf {test_project_dir}")

if __name__ == "__main__":
    main()