# 🚀 Vercel Deployments Chrome Extension

<div align="center">

![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=google-chrome&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-orange.svg)

**View and manage your Vercel deployments directly from your Chrome browser toolbar**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Contributing](#-contributing) • [License](#-license)

</div>

---

## 📖 Overview

**Vercel Deployments** is a lightweight Chrome extension that provides quick access to your Vercel deployment status without leaving your browser. Monitor your latest deployments, check their status, and open them instantly with a single click.

Perfect for developers who want to stay on top of their Vercel deployments without constantly switching tabs or checking the Vercel dashboard.

## ✨ Features

- 🔍 **Quick Access** - View your latest 20 Vercel deployments in one click
- 📊 **Real-time Status** - See deployment status (Ready, Building, Error, Queued, Canceled)
- 🎨 **Modern UI** - Beautiful, rounded design with smooth animations
- 🔒 **Secure** - API token stored locally in Chrome storage
- ⚡ **Fast** - Lightweight and optimized for performance
- 🎯 **One-Click Open** - Click any deployment to open it in a new tab
- ⚙️ **Easy Configuration** - Simple settings panel for API token management
- 🔄 **Auto-refresh** - View the most recent deployments automatically

## 🖼️ Screenshots

> **Note:** Add screenshots of your extension here. You can take screenshots of the popup and add them to a `screenshots/` folder.

<!-- 
![Extension Popup](screenshots/popup.png)
![Settings Panel](screenshots/settings.png)
-->

## 🚀 Installation

### Method 1: Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store soon. Check back for updates!

### Method 2: Manual Installation (Developer Mode)

1. **Download the Extension**
   ```bash
   git clone https://github.com/aligeramy/vercel-deployments.git
   cd vercel-deployments
   ```

2. **Get Your Vercel API Token**
   - Navigate to [Vercel Account Settings](https://vercel.com/account/settings/tokens)
   - Click "Create Token"
   - Give it a name (e.g., "Chrome Extension")
   - Copy the generated token

3. **Load the Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable **Developer mode** (toggle in the top-right corner)
   - Click **"Load unpacked"**
   - Select the `vercel-deployments` folder

4. **Configure the Extension**
   - Click the extension icon in your Chrome toolbar
   - Enter your Vercel API token in the settings panel
   - Click **"Save"**
   - Your deployments will load automatically! 🎉

## 📱 Usage

### Viewing Deployments

1. Click the **Vercel Deployments** icon in your Chrome toolbar
2. Your latest 20 deployments will be displayed
3. Click any deployment card to open it in a new tab

### Managing Settings

- Click the **⚙️** icon in the extension popup to open settings
- Update your API token anytime
- Click **"Save"** to apply changes

### Deployment Statuses

- 🟢 **Ready** - Deployment is live and ready
- 🟡 **Building** - Deployment is currently building
- 🔴 **Error** - Deployment failed
- ⚪ **Queued** - Deployment is waiting to build
- ⚫ **Canceled** - Deployment was canceled

## 🛠️ Development

### Prerequisites

- Google Chrome (latest version)
- A Vercel account with API access
- Basic knowledge of Chrome extensions

### Project Structure

```
vercel-deployments/
├── manifest.json          # Chrome extension manifest (Manifest V3)
├── popup.html             # Extension popup UI
├── popup.css              # Styles and animations
├── popup.js               # Main logic and API integration
├── icon16.png             # Extension icon (16x16)
├── icon48.png             # Extension icon (48x48)
├── icon128.png            # Extension icon (128x128)
├── create-icons.html      # Icon creation helper
└── README.md              # This file
```

### Local Development

1. Clone the repository
2. Make your changes
3. Reload the extension in `chrome://extensions/`
4. Test your changes

### API Integration

This extension uses the [Vercel REST API](https://vercel.com/docs/rest-api):

- **Endpoint:** `https://api.vercel.com/v6/deployments`
- **Authentication:** Bearer token (stored in Chrome local storage)
- **Rate Limits:** Subject to Vercel API rate limits

## 🔒 Privacy & Security

- ✅ **Local Storage Only** - Your API token is stored locally in Chrome's storage
- ✅ **No Third-Party Servers** - All API requests go directly to Vercel
- ✅ **No Data Collection** - We don't collect or store any of your data
- ✅ **Open Source** - Full source code available for review

## 🐛 Troubleshooting

### No deployments showing

- Verify your API token is correct in settings
- Check that you have deployments in your Vercel account
- Open browser console (right-click extension popup → Inspect) to see errors

### Authentication errors

- Ensure your API token is valid and hasn't expired
- Generate a new token from [Vercel Account Settings](https://vercel.com/account/settings/tokens)
- Make sure the token has the necessary permissions

### Extension not loading

- Ensure Developer mode is enabled in `chrome://extensions/`
- Check that all files are present in the extension folder
- Try reloading the extension

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Ideas for Contributions

- Add deployment filtering/search functionality
- Support for multiple Vercel teams
- Dark mode toggle
- Deployment history pagination
- Keyboard shortcuts
- Notifications for deployment status changes
- Export deployment list

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for the Vercel community
- Uses the [Vercel REST API](https://vercel.com/docs/rest-api)
- Inspired by the need for quick deployment access

## 👤 Author

**aligeramy**

- GitHub: [@aligeramy](https://github.com/aligeramy)
- Feel free to reach out with questions or suggestions!

## 📊 Project Status

![GitHub stars](https://img.shields.io/github/stars/aligeramy/vercel-deployments?style=social)
![GitHub forks](https://img.shields.io/github/forks/aligeramy/vercel-deployments?style=social)
![GitHub issues](https://img.shields.io/github/issues/aligeramy/vercel-deployments)
![GitHub pull requests](https://img.shields.io/github/issues-pr/aligeramy/vercel-deployments)

---

<div align="center">

**⭐ If you find this extension useful, please consider giving it a star! ⭐**

Made with ❤️ by [aligeramy](https://github.com/aligeramy)

</div>
