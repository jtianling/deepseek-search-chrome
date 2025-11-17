# DeepSeek Chat Search

A Chrome extension that adds chat history search functionality to the DeepSeek website.

## Features

- ✨ Adds "Search chats" button to DeepSeek sidebar
- 🔍 Quickly search chat history
- 🎨 Beautiful UI inspired by ChatGPT design
- 🏗️ Modular architecture for easy extensibility
- 🔌 Decoupled modules communicating via event bus

## Project Architecture

```
deepseek-search-cline/
├── manifest.json           # Chrome extension configuration
├── src/
│   ├── core/
│   │   └── EventBus.js    # Event bus for decoupled module communication
│   ├── modules/
│   │   ├── ChatDataExtractor.js  # Chat data extraction module
│   │   ├── SearchEngine.js       # Search engine module
│   │   └── UIManager.js          # UI management module
│   └── content/
│       ├── index.js       # Main entry point
│       └── styles.css     # Stylesheet
└── icons/                 # Extension icons
```

## Architecture Design

### Core Components

1. **EventBus**
   - Handles inter-module communication
   - Implements publish-subscribe pattern
   - Ensures module decoupling

2. **ChatDataExtractor (Data Extraction Module)**
   - Extracts chat history from DOM
   - Monitors chat list changes
   - Emits data update events

3. **SearchEngine (Search Engine Module)**
   - Receives search requests
   - Executes search logic
   - Returns search results

4. **UIManager (UI Management Module)**
   - Creates search button
   - Manages search modal
   - Displays search results

### Event Flow

```
User clicks search button
    ↓
UIManager opens modal
    ↓
User enters search keyword
    ↓
UIManager emits 'searchRequested' event
    ↓
SearchEngine receives event and executes search
    ↓
SearchEngine emits 'searchResults' event
    ↓
UIManager receives results and displays them
```

## Installation

### Method 1: Developer Mode Installation (Recommended)

1. Clone or download this project
2. Open Chrome browser and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the root directory of this project
6. Visit https://chat.deepseek.com/ to use the extension

### Method 2: Packaged Installation

1. Run the build command in the project root (if available)
2. Generate the `.crx` file
3. Drag and drop it to the Chrome extensions page to install

## Usage

1. Visit the DeepSeek website (https://chat.deepseek.com/)
2. In the left sidebar, below the "New Chat" button, you'll see the new "Search chats" button
3. Click the "Search chats" button to open the search modal
4. Enter keywords in the search box
5. Search results will display in real-time, click a result to jump to the corresponding chat

## Icons

Since PNG icons require image editing software to create, you can:

1. **Use online tools to generate icons**:
   - Visit https://www.favicon-generator.org/
   - Upload a search icon image
   - Generate three sizes: 16x16, 48x48, 128x128
   - Download and rename to icon16.png, icon48.png, icon128.png
   - Place them in the `icons/` directory

2. **Skip icons for now**:
   - Remove the icons configuration from manifest.json
   - The extension will still work normally, just without an icon in the extensions list

## Extending Functionality

Thanks to the modular architecture, adding new features is simple:

```javascript
// 1. Create a new module
class NewFeatureModule {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen to required events
    this.eventBus.on('someEvent', (data) => {
      // Handle logic
    });
  }

  init() {
    // Initialization logic
    console.log('New feature initialized');
  }
}

// 2. Register in src/content/index.js
const newFeature = new NewFeatureModule(this.eventBus);
this.modules.push(newFeature);
newFeature.init();
```

## Development Notes

- Uses ES6 module syntax
- Event-driven architecture
- All modules communicate via EventBus
- Follows single responsibility principle

## Tech Stack

- Vanilla JavaScript (ES6+)
- Chrome Extension Manifest V3
- CSS3

## License

MIT License

## Contributing

Issues and Pull Requests are welcome!

## Changelog

### v1.0.0 (2025-11-14)
- ✨ Initial release
- 🔍 Support basic chat history search
- 🎨 UI design inspired by ChatGPT
- 🏗️ Modular architecture implementation

## FAQ

**Q: Why can't I find some chat records?**
A: The extension extracts chat records from the DOM. If the page hasn't fully loaded, some records may not be searchable yet. Refreshing the page should resolve this.

**Q: How can I customize the search logic?**
A: Edit the `search()` method in the `src/modules/SearchEngine.js` file.

**Q: How can I change the UI styles?**
A: Edit the styles in the `src/content/styles.css` file.

## Contact

For questions or suggestions, please submit an Issue.
