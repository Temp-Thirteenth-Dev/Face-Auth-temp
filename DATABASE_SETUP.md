# Supabase Setup

To use this application, you need to set up a Supabase project and create a `users` table.

## 1. Create Table

Run the following SQL in your Supabase SQL Editor:

```sql
create table users (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  face_embedding jsonb not null,
  created_at timestamp with time zone default now()
);

-- Optional: Enable Row Level Security (RLS)
-- For this demo, we'll keep it simple, but in production, you should secure this.
```

## 2. Environment Variables

Create a `.env` file in the `backend/` directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5000
```

And in the `frontend/` directory (if needed for direct Supabase calls, but we'll use the backend proxy):
```env
VITE_API_URL=http://localhost:5000
```
