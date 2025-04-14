#!/usr/bin/env node

/**
 * This is a template MCP server that implements a simple notes system.
 * It demonstrates core MCP concepts like resources and tools by allowing:
 * - Listing notes as resources
 * - Reading individual notes
 * - Creating new notes via a tool
 * - Summarizing all notes via a prompt
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { GhibliClient } from './ghibli.js';


/**
 * Create an MCP server with capabilities for resources (to list/read notes),
 * tools (to create new notes), and prompts (to summarize notes).
 */
const server = new Server(
  {
    name: "mcp-server-ghibli",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},  // 我们只需要 tools 能力
    },
  }
);

// 创建客户端实例
const ghibliClient = new GhibliClient('https://www.gpt4oimg.com');

/**
 * Handler that lists available tools.
 * Exposes a single "create_note" tool that lets clients create new notes.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [

      {
        name: "image_to_video",
        description: "Convert image to animated video",
        inputSchema: {
          type: "object",
          properties: {
            image: {
              type: "string",
              description: "Base64 encoded source image or image URL"
            },
            prompt: {
              type: "string",
              description: "Optional prompt for video generation"
            },
            aspect_ratio: {
              type: "string",
              description: "Aspect ratio of the output video (e.g. '9:16')",
              default: "9:16"
            },
            negative_prompt: {
              type: "string",
              description: "Negative prompt to guide generation",
              default: "bad prompt"
            },
            api_key: {
              type: "string",
              description: "API key for authentication"
            }
          },
          required: ["image", "api_key"]
        }
      },
      {
        name: "get_points",
        description: "Get remaining points",
        inputSchema: {
          type: "object",
          properties: {
            api_key: {
              type: "string",
              description: "API key for authentication"
            }
          },
          required: ["api_key"]
        }
      },
      {
        name: "get_task_result",
        description: "Get task result",
        inputSchema: {
          type: "object",
          properties: {
            taskId: {
              type: "string",
              description: "Task ID"
            },
            api_key: {
              type: "string",
              description: "API key for authentication"
            }
          },
          required: ["taskId", "api_key"]
        }
      }
    ]
  };
});

/**
 * Handler for the create_note tool.
 * Creates a new note with the provided title and content, and returns success message.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {

    case "image_to_video": {
      const image = String(request.params.arguments?.image);
      const prompt = String(request.params.arguments?.prompt || "in the style of ghibli");
      const aspectRatio = String(request.params.arguments?.aspect_ratio || "9:16");
      const negativePrompt = String(request.params.arguments?.negative_prompt || "bad prompt");
      const apiKey = String(request.params.arguments?.api_key);

      if (!image) {
        throw new Error("Source image cannot be empty");
      }
      if (!apiKey) {
        throw new Error("API key cannot be empty");
      }

      try {
        const result = await ghibliClient.imageToVideo(
          image, 
          prompt, 
          aspectRatio,
          negativePrompt,
          apiKey
        );
        return {
          content: [{
            type: "text",
            text: `Video generation taskid: ${result}`
          }]
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Video generation failed: ${errorMessage}`);
      }
    }

    case "get_points": {
      const apiKey = String(request.params.arguments?.api_key);

      if (!apiKey) {
        throw new Error("API key cannot be empty");
      }

      try {
        const points = await ghibliClient.getPoints(apiKey);
        return {
          content: [{
            type: "text",
            text: `Remaining points: ${points}`
          }]
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Get points failed: ${errorMessage}`);
      }
    }

    case "get_task_result": {
      const taskId = String(request.params.arguments?.taskId);
      const apiKey = String(request.params.arguments?.api_key);

      if (!taskId) {
        throw new Error("Task ID cannot be empty");
      }
      if (!apiKey) {
        throw new Error("API key cannot be empty");
      }

      try {
        const result = await ghibliClient.getTaskResult(taskId, apiKey);
        return {
          content: [{
            type: "text",
            text: `Task result: ${JSON.stringify(result)}`
          }]
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Get task result failed: ${errorMessage}`);
      }
    }

    default:
      throw new Error("Unknown tool name");
  }
});

/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
