# Supabase MCP Server

Model Context Protocol (MCP) server for Supabase integration with Cursor.

## Setup

1. **Install dependencies:**
   ```bash
   cd mcp-server
   npm install
   ```

2. **Build the TypeScript code:**
   ```bash
   npm run build
   ```

3. **Configure environment variables:**
   
   The MCP server will use these environment variables:
   - `SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_ANON_KEY` - Your Supabase key
   
   For full database access, use `SUPABASE_SERVICE_ROLE_KEY` (service role key).
   For limited access, use `SUPABASE_ANON_KEY` (anonymous key).

4. **Cursor Configuration:**
   
   The MCP server is configured in `.cursor/mcp.json`. Make sure the path to the compiled JavaScript file is correct.

5. **Restart Cursor:**
   
   After configuration, restart Cursor to load the MCP server.

## Available Tools

- `query_table` - Query a Supabase table with filters, ordering, and pagination
- `insert_row` - Insert a new row into a table
- `update_row` - Update rows in a table
- `delete_row` - Delete rows from a table
- `list_tables` - List all tables in the database
- `get_table_schema` - Get the schema for a specific table

## Usage

Once configured, you can use the MCP server in Cursor by asking questions like:
- "Query the expenses table"
- "Show me all users"
- "Insert a new expense"
- "What tables are in the database?"

## Security Note

⚠️ **Important**: The service role key has full access to your database. Only use it in development environments. For production, consider using the anonymous key with Row Level Security (RLS) policies.

