#!/usr/bin/env node
/**
 * Supabase MCP Server
 * Model Context Protocol server for Supabase integration
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Error: SUPABASE_URL and SUPABASE_KEY (or NEXT_PUBLIC_SUPABASE_URL and SUPABASE_ANON_KEY) must be set");
    process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const server = new Server({
    name: "supabase-mcp-server",
    version: "0.1.0",
}, {
    capabilities: {
        tools: {},
        resources: {},
    },
});
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "query_table",
                description: "Query a Supabase table with optional filters, ordering, and pagination",
                inputSchema: {
                    type: "object",
                    properties: {
                        table: {
                            type: "string",
                            description: "Name of the table to query",
                        },
                        select: {
                            type: "string",
                            description: "Columns to select (default: *)",
                            default: "*",
                        },
                        filter: {
                            type: "object",
                            description: "Filter conditions (e.g., { column: 'id', operator: 'eq', value: '123' })",
                        },
                        order: {
                            type: "object",
                            description: "Ordering (e.g., { column: 'created_at', ascending: false })",
                        },
                        limit: {
                            type: "number",
                            description: "Maximum number of rows to return",
                        },
                        offset: {
                            type: "number",
                            description: "Number of rows to skip",
                        },
                    },
                    required: ["table"],
                },
            },
            {
                name: "insert_row",
                description: "Insert a new row into a Supabase table",
                inputSchema: {
                    type: "object",
                    properties: {
                        table: {
                            type: "string",
                            description: "Name of the table",
                        },
                        data: {
                            type: "object",
                            description: "Data to insert",
                        },
                    },
                    required: ["table", "data"],
                },
            },
            {
                name: "update_row",
                description: "Update rows in a Supabase table",
                inputSchema: {
                    type: "object",
                    properties: {
                        table: {
                            type: "string",
                            description: "Name of the table",
                        },
                        filter: {
                            type: "object",
                            description: "Filter conditions to identify rows to update",
                        },
                        data: {
                            type: "object",
                            description: "Data to update",
                        },
                    },
                    required: ["table", "filter", "data"],
                },
            },
            {
                name: "delete_row",
                description: "Delete rows from a Supabase table",
                inputSchema: {
                    type: "object",
                    properties: {
                        table: {
                            type: "string",
                            description: "Name of the table",
                        },
                        filter: {
                            type: "object",
                            description: "Filter conditions to identify rows to delete",
                        },
                    },
                    required: ["table", "filter"],
                },
            },
            {
                name: "list_tables",
                description: "List all tables in the Supabase database",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "get_table_schema",
                description: "Get the schema for a specific table",
                inputSchema: {
                    type: "object",
                    properties: {
                        table: {
                            type: "string",
                            description: "Name of the table",
                        },
                    },
                    required: ["table"],
                },
            },
        ],
    };
});
// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case "query_table": {
                const { table, select = "*", filter, order, limit, offset } = args;
                let query = supabase.from(table).select(select);
                if (filter) {
                    const { column, operator, value } = filter;
                    switch (operator) {
                        case "eq":
                            query = query.eq(column, value);
                            break;
                        case "neq":
                            query = query.neq(column, value);
                            break;
                        case "gt":
                            query = query.gt(column, value);
                            break;
                        case "gte":
                            query = query.gte(column, value);
                            break;
                        case "lt":
                            query = query.lt(column, value);
                            break;
                        case "lte":
                            query = query.lte(column, value);
                            break;
                        case "like":
                            query = query.like(column, value);
                            break;
                        case "ilike":
                            query = query.ilike(column, value);
                            break;
                        case "in":
                            query = query.in(column, value);
                            break;
                        case "is":
                            query = query.is(column, value);
                            break;
                    }
                }
                if (order) {
                    query = query.order(order.column, { ascending: order.ascending !== false });
                }
                if (limit) {
                    query = query.limit(limit);
                }
                if (offset) {
                    query = query.range(offset, offset + (limit || 1000) - 1);
                }
                const { data, error } = await query;
                if (error) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error: ${error.message}`,
                            },
                        ],
                        isError: true,
                    };
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(data, null, 2),
                        },
                    ],
                };
            }
            case "insert_row": {
                const { table, data } = args;
                const { data: result, error } = await supabase.from(table).insert(data).select();
                if (error) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error: ${error.message}`,
                            },
                        ],
                        isError: true,
                    };
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }
            case "update_row": {
                const { table, filter, data } = args;
                let query = supabase.from(table).update(data);
                if (filter) {
                    const { column, operator, value } = filter;
                    switch (operator) {
                        case "eq":
                            query = query.eq(column, value);
                            break;
                        case "in":
                            query = query.in(column, value);
                            break;
                    }
                }
                const { data: result, error } = await query.select();
                if (error) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error: ${error.message}`,
                            },
                        ],
                        isError: true,
                    };
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }
            case "delete_row": {
                const { table, filter } = args;
                let query = supabase.from(table).delete();
                if (filter) {
                    const { column, operator, value } = filter;
                    switch (operator) {
                        case "eq":
                            query = query.eq(column, value);
                            break;
                        case "in":
                            query = query.in(column, value);
                            break;
                    }
                }
                const { data: result, error } = await query.select();
                if (error) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error: ${error.message}`,
                            },
                        ],
                        isError: true,
                    };
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }
            case "list_tables": {
                // Query information_schema to get table list
                const { data, error } = await supabase
                    .from("information_schema.tables")
                    .select("table_name")
                    .eq("table_schema", "public");
                if (error) {
                    // Fallback: try a simple query to test connection
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Note: Unable to query information_schema. Error: ${error.message}\n\nYou can query tables directly using the query_table tool.`,
                            },
                        ],
                    };
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(data?.map((t) => t.table_name) || [], null, 2),
                        },
                    ],
                };
            }
            case "get_table_schema": {
                const { table } = args;
                // Query information_schema to get column information
                const { data, error } = await supabase.rpc("get_table_columns", { table_name: table });
                if (error) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Note: Unable to get schema. Error: ${error.message}\n\nYou can query the table directly to see its structure.`,
                            },
                        ],
                    };
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(data, null, 2),
                        },
                    ],
                };
            }
            default:
                return {
                    content: [
                        {
                            type: "text",
                            text: `Unknown tool: ${name}`,
                        },
                    ],
                    isError: true,
                };
        }
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${error.message}`,
                },
            ],
            isError: true,
        };
    }
});
// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: [
            {
                uri: "supabase://tables",
                name: "Supabase Tables",
                description: "List of all tables in the Supabase database",
                mimeType: "application/json",
            },
        ],
    };
});
// Read resources
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    if (uri === "supabase://tables") {
        const { data, error } = await supabase
            .from("information_schema.tables")
            .select("table_name")
            .eq("table_schema", "public");
        if (error) {
            return {
                contents: [
                    {
                        uri,
                        mimeType: "application/json",
                        text: JSON.stringify({ error: error.message }, null, 2),
                    },
                ],
            };
        }
        return {
            contents: [
                {
                    uri,
                    mimeType: "application/json",
                    text: JSON.stringify(data?.map((t) => t.table_name) || [], null, 2),
                },
            ],
        };
    }
    throw new Error(`Unknown resource: ${uri}`);
});
// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Supabase MCP server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
//# sourceMappingURL=supabase-mcp.js.map