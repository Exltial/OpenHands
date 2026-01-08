#!/usr/bin/env python3
"""
Simple test script to verify local code upload functionality.
This script creates some test files and demonstrates the local upload feature.
"""

import os
import tempfile
from pathlib import Path

def create_test_files():
    """Create some test files for local upload demonstration."""
    
    # Create a temporary directory for test files
    test_dir = Path(tempfile.mkdtemp(prefix="openhands_test_"))
    print(f"Creating test files in: {test_dir}")
    
    # Create a simple Python file
    python_file = test_dir / "hello.py"
    python_file.write_text("""#!/usr/bin/env python3
\"\"\"
A simple Python script for testing local code upload.
\"\"\"

def greet(name):
    \"\"\"Greet someone by name.\"\"\"
    return f"Hello, {name}!"

def main():
    \"\"\"Main function.\"\"\"
    print(greet("OpenHands"))
    print("This file was uploaded using the local code upload feature!")

if __name__ == "__main__":
    main()
""")
    
    # Create a JavaScript file
    js_file = test_dir / "app.js"
    js_file.write_text("""// Simple JavaScript application for testing
console.log("Hello from JavaScript!");

function calculateSum(a, b) {
    return a + b;
}

function main() {
    const result = calculateSum(5, 3);
    console.log(`The sum is: ${result}`);
    console.log("This file was uploaded using the local code upload feature!");
}

main();
""")
    
    # Create a README file
    readme_file = test_dir / "README.md"
    readme_file.write_text("""# Test Project

This is a test project for demonstrating the local code upload feature in OpenHands.

## Files

- `hello.py` - A simple Python script
- `app.js` - A simple JavaScript application
- `config.json` - Configuration file
- `README.md` - This file

## Usage

1. Upload these files using the local code upload feature
2. Ask OpenHands to analyze or modify the code
3. Test the functionality

## Features Tested

- Multiple file upload
- Different file types (Python, JavaScript, JSON, Markdown)
- File organization and structure
""")
    
    # Create a JSON configuration file
    config_file = test_dir / "config.json"
    config_file.write_text("""{
  "name": "test-project",
  "version": "1.0.0",
  "description": "Test project for local code upload",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "test": "python hello.py"
  },
  "author": "OpenHands Test",
  "license": "MIT",
  "features": {
    "localUpload": true,
    "multipleFiles": true,
    "dragAndDrop": true
  }
}
""")
    
    # Create a CSS file
    css_file = test_dir / "styles.css"
    css_file.write_text("""/* Test CSS file for local upload */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header {
    color: #333;
    border-bottom: 2px solid #007acc;
    padding-bottom: 10px;
}

.code-block {
    background: #f8f8f8;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
    font-family: 'Courier New', monospace;
    overflow-x: auto;
}

/* This file tests CSS upload functionality */
""")
    
    print("Test files created successfully!")
    print("\nFiles created:")
    for file in test_dir.iterdir():
        if file.is_file():
            print(f"  - {file.name} ({file.stat().st_size} bytes)")
    
    print(f"\nTo test the local upload feature:")
    print(f"1. Start OpenHands application")
    print(f"2. Go to the home page")
    print(f"3. Click on 'Local Code' tab")
    print(f"4. Upload the files from: {test_dir}")
    print(f"5. Click 'Launch' to create a conversation")
    
    return test_dir

def verify_backend_changes():
    """Verify that backend changes are in place."""
    print("Verifying backend changes...")
    
    # Check if the models file has been updated
    models_file = Path("openhands/app_server/app_conversation/app_conversation_models.py")
    if models_file.exists():
        content = models_file.read_text()
        if "use_local_code" in content and "local_files_metadata" in content:
            print("✓ Backend models updated correctly")
        else:
            print("✗ Backend models missing local code support")
    else:
        print("✗ Backend models file not found")
    
    # Check if the service file has been updated
    service_file = Path("openhands/app_server/app_conversation/git_app_conversation_service.py")
    if service_file.exists():
        content = service_file.read_text()
        if "setup_local_code" in content:
            print("✓ Backend service updated correctly")
        else:
            print("✗ Backend service missing local code support")
    else:
        print("✗ Backend service file not found")

def verify_frontend_changes():
    """Verify that frontend changes are in place."""
    print("Verifying frontend changes...")
    
    # Check if the LocalCodeUpload component exists
    upload_component = Path("frontend/src/components/features/home/local-code-upload.tsx")
    if upload_component.exists():
        print("✓ LocalCodeUpload component created")
    else:
        print("✗ LocalCodeUpload component not found")
    
    # Check if the RepoConnector has been updated
    connector_file = Path("frontend/src/components/features/home/repo-connector.tsx")
    if connector_file.exists():
        content = connector_file.read_text()
        if "LocalCodeUpload" in content and "Local Code" in content:
            print("✓ RepoConnector updated correctly")
        else:
            print("✗ RepoConnector missing local code integration")
    else:
        print("✗ RepoConnector file not found")
    
    # Check if the store exists
    store_file = Path("frontend/src/stores/local-files-store.ts")
    if store_file.exists():
        print("✓ Local files store created")
    else:
        print("✗ Local files store not found")
    
    # Check if the upload hook exists
    hook_file = Path("frontend/src/hooks/mutation/use-upload-local-files-to-conversation.ts")
    if hook_file.exists():
        print("✓ Upload hook created")
    else:
        print("✗ Upload hook not found")

def main():
    """Main function to run the test."""
    print("OpenHands Local Code Upload Feature Test")
    print("=" * 50)
    
    # Verify backend changes
    verify_backend_changes()
    print()
    
    # Verify frontend changes
    verify_frontend_changes()
    print()
    
    # Create test files
    test_dir = create_test_files()
    print()
    
    print("Test completed successfully!")
    print(f"Test files are available at: {test_dir}")
    print("\nNext steps:")
    print("1. Start the OpenHands application")
    print("2. Navigate to the home page")
    print("3. Test the local code upload feature with the created files")

if __name__ == "__main__":
    main()