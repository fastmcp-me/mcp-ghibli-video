[![Add to Cursor](https://fastmcp.me/badges/cursor_dark.svg)](https://fastmcp.me/MCP/Details/713/ghibli-video-generator)
[![Add to VS Code](https://fastmcp.me/badges/vscode_dark.svg)](https://fastmcp.me/MCP/Details/713/ghibli-video-generator)
[![Add to Claude](https://fastmcp.me/badges/claude_dark.svg)](https://fastmcp.me/MCP/Details/713/ghibli-video-generator)
[![Add to ChatGPT](https://fastmcp.me/badges/chatgpt_dark.svg)](https://fastmcp.me/MCP/Details/713/ghibli-video-generator)
[![Add to Codex](https://fastmcp.me/badges/codex_dark.svg)](https://fastmcp.me/MCP/Details/713/ghibli-video-generator)
[![Add to Gemini](https://fastmcp.me/badges/gemini_dark.svg)](https://fastmcp.me/MCP/Details/713/ghibli-video-generator)

# mcp-server-ghibli MCP Server

[![smithery badge](https://smithery.ai/badge/@MichaelYangjson/mcp-ghibli-video)](https://smithery.ai/server/@MichaelYangjson/mcp-ghibli-video)

A TypeScript-based MCP server that provides AI image and video generation capabilities through a simple interface.

> **Note**: This server requires an API key from [GPT4O Image Generator](https://www.gpt4oimg.com/). Please visit the website to obtain your API key before using this service.

## Features

### Tools

#### 1. Image to Video Conversion

- `image_to_video` - Convert static images into animated videos
  - Required parameters:
    - `image`: Base64 encoded image or image URL
    - `api_key`: Authentication key
  - Optional parameters:
    - `prompt`: Text prompt to guide video generation (default: "in the style of ghibli")
    - `aspect_ratio`: Output video aspect ratio (default: "9:16")
    - `negative_prompt`: Negative prompt to guide generation (default: "bad prompt")

#### 2. Points Management

- `get_points` - Check remaining API credits
  - Required parameters:
    - `api_key`: Authentication key

#### 3. Task Management

- `get_task_result` - Check the status of a video generation task
  - Required parameters:
    - `taskId`: Task ID returned from image_to_video
    - `api_key`: Authentication key

## Development

Install dependencies:

```bash
npm install
```

Build the server:

```bash
npm run build
```

For development with auto-rebuild:

```bash
npm run watch
```

## Installation

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mcp-server-ghibli-video": {
      "command": "npx",
      "args": ["-y", "@openmcprouter/mcp-server-ghibli-video"],
      "env": {
        "Ghibli_API_URL": "https://www.gpt4oimg.com"
      }
    }
  }
}
```

### Installing via Smithery

To install mcp-server-ghibli MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@MichaelYangjson/mcp-ghibli-video):

```bash
npx -y @smithery/cli install @MichaelYangjson/mcp-ghibli-video --client claude
```

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.
