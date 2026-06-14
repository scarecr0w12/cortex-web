export const openapiSpec = {
  openapi: "3.1.0",
  info: {
    title: "CortexPrism Marketplace API",
    description: "Registry for CortexPrism plugins and agent configurations",
    version: "1.0.0",
    contact: {
      url: "https://cortexprism.io",
    },
  },
  servers: [
    {
      url: "https://cortexprism.io",
      description: "Production",
    },
    {
      url: "http://localhost:3000",
      description: "Development",
    },
  ],
  paths: {
    "/api/marketplace/plugins": {
      get: {
        summary: "List plugins",
        description: "Get a paginated list of published plugins with optional search, filter, and sort",
        tags: ["Plugins"],
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "kind", in: "query", schema: { type: "string", enum: ["esm", "mcp", "wasm"] } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          "200": {
            description: "Paginated list of plugins",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    plugins: { type: "array", items: { $ref: "#/components/schemas/PluginSummary" } },
                    total: { type: "integer" },
                    page: { type: "integer" },
                    limit: { type: "integer" },
                    totalPages: { type: "integer" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Publish a plugin",
        description: "Submit a new plugin to the marketplace",
        tags: ["Plugins"],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/PluginInput" } } },
        },
        responses: {
          "201": { description: "Plugin created", content: { "application/json": { schema: { $ref: "#/components/schemas/PluginDetail" } } } },
          "400": { description: "Validation error" },
        },
      },
    },
    "/api/marketplace/plugins/{id}": {
      get: {
        summary: "Get plugin detail",
        tags: ["Plugins"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Plugin detail", content: { "application/json": { schema: { $ref: "#/components/schemas/PluginDetail" } } } },
          "404": { description: "Plugin not found" },
        },
      },
      put: {
        summary: "Update a plugin",
        tags: ["Plugins"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/PluginInput" } } } },
        responses: {
          "200": { description: "Plugin updated" },
          "404": { description: "Plugin not found" },
        },
      },
      delete: {
        summary: "Delete a plugin",
        tags: ["Plugins"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "204": { description: "Plugin deleted" },
          "404": { description: "Plugin not found" },
        },
      },
    },
    "/api/marketplace/plugins/{id}/download": {
      get: {
        summary: "Download plugin manifest",
        description: "Increment download counter and return the plugin manifest in PluginManifest format compatible with cortex plugin install",
        tags: ["Plugins"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Plugin manifest", content: { "application/json": { schema: { $ref: "#/components/schemas/PluginManifest" } } } },
          "404": { description: "Plugin not found" },
        },
      },
    },
    "/api/marketplace/agents": {
      get: {
        summary: "List agent configs",
        tags: ["Agents"],
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "provider", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          "200": {
            description: "Paginated list of agent configs",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    agents: { type: "array", items: { $ref: "#/components/schemas/AgentSummary" } },
                    total: { type: "integer" },
                    page: { type: "integer" },
                    limit: { type: "integer" },
                    totalPages: { type: "integer" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Publish an agent config",
        tags: ["Agents"],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/AgentInput" } } } },
        responses: {
          "201": { description: "Agent config created" },
          "400": { description: "Validation error" },
        },
      },
    },
    "/api/marketplace/agents/{id}": {
      get: {
        summary: "Get agent config detail",
        tags: ["Agents"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Agent config detail" },
          "404": { description: "Agent config not found" },
        },
      },
      put: {
        summary: "Update an agent config",
        tags: ["Agents"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Agent config updated" } },
      },
      delete: {
        summary: "Delete an agent config",
        tags: ["Agents"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "204": { description: "Agent config deleted" } },
      },
    },
    "/api/marketplace/agents/{id}/download": {
      get: {
        summary: "Download agent config",
        description: "Increment download counter and return the full agent config compatible with cortex agent import",
        tags: ["Agents"],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Agent config" },
          "404": { description: "Agent config not found" },
        },
      },
    },
    "/api/marketplace/categories": {
      get: {
        summary: "List categories",
        tags: ["Marketplace"],
        responses: { "200": { description: "List of categories" } },
      },
    },
    "/api/marketplace/stats": {
      get: {
        summary: "Get marketplace stats",
        tags: ["Marketplace"],
        responses: { "200": { description: "Marketplace statistics" } },
      },
    },
  },
  components: {
    schemas: {
      PluginSummary: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          slug: { type: "string" },
          version: { type: "string" },
          description: { type: "string" },
          kind: { type: "string", enum: ["esm", "mcp", "wasm"] },
          author: { type: "string" },
          icon: { type: "string" },
          downloads: { type: "integer" },
          rating: { type: "number" },
          category: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      PluginDetail: {
        allOf: [
          { $ref: "#/components/schemas/PluginSummary" },
          {
            type: "object",
            properties: {
              entryPoint: { type: "string" },
              capabilities: { type: "array", items: { type: "string" } },
              authorUrl: { type: "string" },
              homepage: { type: "string" },
              repository: { type: "string" },
              license: { type: "string" },
              readme: { type: "string" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
        ],
      },
      PluginManifest: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          version: { type: "string" },
          description: { type: "string" },
          kind: { type: "string" },
          entryPoint: { type: "string" },
          capabilities: { type: "array", items: { type: "string" } },
          author: { type: "string" },
          homepage: { type: "string" },
        },
      },
      PluginInput: {
        type: "object",
        required: ["name", "version", "description", "kind", "entryPoint"],
        properties: {
          name: { type: "string" },
          version: { type: "string" },
          description: { type: "string" },
          kind: { type: "string", enum: ["esm", "mcp", "wasm"] },
          entryPoint: { type: "string" },
          capabilities: { type: "array", items: { type: "string" } },
          author: { type: "string" },
          authorUrl: { type: "string" },
          homepage: { type: "string" },
          repository: { type: "string" },
          license: { type: "string" },
          icon: { type: "string" },
          readme: { type: "string" },
          categoryId: { type: "string" },
        },
      },
      AgentSummary: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          slug: { type: "string" },
          version: { type: "string" },
          description: { type: "string" },
          provider: { type: "string" },
          model: { type: "string" },
          author: { type: "string" },
          icon: { type: "string" },
          downloads: { type: "integer" },
          rating: { type: "number" },
          tags: { type: "array", items: { type: "string" } },
          category: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      AgentInput: {
        type: "object",
        required: ["name", "version", "description"],
        properties: {
          name: { type: "string" },
          version: { type: "string" },
          description: { type: "string" },
          provider: { type: "string" },
          model: { type: "string" },
          temperature: { type: "number" },
          tools: { type: "array", items: { type: "string" } },
          tags: { type: "array", items: { type: "string" } },
          systemPrompt: { type: "string" },
          soulContent: { type: "string" },
          author: { type: "string" },
          authorUrl: { type: "string" },
          repository: { type: "string" },
          icon: { type: "string" },
          readme: { type: "string" },
          categoryId: { type: "string" },
        },
      },
    },
  },
};
