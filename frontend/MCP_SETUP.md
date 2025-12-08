# Supabase MCP Server Setup Guide

This guide will help you set up the Supabase Model Context Protocol (MCP) server for use with Cursor.

## What is MCP?

Model Context Protocol (MCP) allows AI assistants like Cursor to interact with external data sources and tools. The Supabase MCP server enables Cursor to query, insert, update, and delete data from your Supabase database.

## Prerequisites

- Node.js installed (already set up via nvm)
- Supabase project with URL and API keys
- Cursor IDE

## Setup Steps

### 1. Build the MCP Server

The MCP server has been built. If you need to rebuild it:

```bash
cd mcp-server
npm install
npm run build
```

### 2. Configure Cursor MCP Settings

You need to add the MCP server configuration to Cursor. The configuration file location depends on your system:

**For Linux:**
- `~/.config/Cursor/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json`

**Or create/edit:**
- `~/.cursor/mcp.json` (if Cursor supports this location)

**Configuration format:**

```json
{
  "mcpServers": {
    "supabase": {
      "command": "node",
      "args": [
        "/home/sushil/Downloads/BachatSathi/mcp-server/supabase-mcp.js"
      ],
      "env": {
        "SUPABASE_URL": "YOUR_SUPABASE_URL",
        "SUPABASE_KEY": "YOUR_SUPABASE_SERVICE_ROLE_KEY"
      }
    }
  }
}
```

**Important:** Replace:
- `YOUR_SUPABASE_URL` with your Supabase project URL (or use `NEXT_PUBLIC_SUPABASE_URL` from your `.env` file)
- `YOUR_SUPABASE_SERVICE_ROLE_KEY` with your Supabase service role key

### 3. Environment Variables

You can either:

**Option A:** Set environment variables in the MCP config (as shown above)

**Option B:** Use environment variables from your project:
- The server will automatically use `NEXT_PUBLIC_SUPABASE_URL` if `SUPABASE_URL` is not set
- The server will automatically use `SUPABASE_ANON_KEY` if `SUPABASE_SERVICE_ROLE_KEY` is not set

**Security Note:**
- **Service Role Key**: Has full database access (bypasses RLS). Use only in development.
- **Anonymous Key**: Respects Row Level Security (RLS) policies. Safer for production.

### 4. Restart Cursor

After configuring the MCP server, restart Cursor completely to load the new configuration.

### 5. Verify Setup

Once Cursor restarts, you can test the MCP server by asking questions like:
- "What tables are in my Supabase database?"
- "Query the expenses table"
- "Show me the schema for the users table"

## Available MCP Tools

The Supabase MCP server provides these tools:

1. **query_table** - Query tables with filters, ordering, and pagination
2. **insert_row** - Insert new rows into tables
3. **update_row** - Update existing rows
4. **delete_row** - Delete rows from tables
5. **list_tables** - List all tables in the database
6. **get_table_schema** - Get schema information for a table

## Troubleshooting

### MCP Server Not Found
- Verify the path to `supabase-mcp.js` is correct
- Make sure you've run `npm run build` in the `mcp-server` directory

### Connection Errors
- Check that your Supabase URL and keys are correct
- Verify your Supabase project is active
- Check network connectivity

### Permission Errors
- If using the anonymous key, check your Row Level Security (RLS) policies
- For full access, use the service role key (development only)

### TypeScript Errors
If you modify the TypeScript code and get build errors:
```bash
cd mcp-server
npm run build
```

## Example Usage

Once configured, you can use natural language queries in Cursor:

```
"Show me all expenses from the last month"
"Insert a new user with email test@example.com"
"What's the structure of the expenses table?"
"Update the user with id 123 to set their name to John"
```

The MCP server will translate these into appropriate Supabase queries and return the results.

