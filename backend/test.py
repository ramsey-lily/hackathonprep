from config.supabase import supabase
response = supabase.table("orders").select("*").eq("id", 1).execute()
print(response.data)
