import { createClient } from "@supabase/supabase-js"

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error("[v0] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD

if (!email || !password) {
  console.error("[v0] Missing ADMIN_EMAIL or ADMIN_PASSWORD env vars")
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Check if user already exists
const { data: existing } = await supabase.auth.admin.listUsers()
const found = existing?.users?.find((u) => u.email === email)

if (found) {
  // Update existing user to ensure admin + confirmed
  const { error } = await supabase.auth.admin.updateUserById(found.id, {
    password,
    email_confirm: true,
    user_metadata: { is_admin: true },
  })
  if (error) {
    console.error("[v0] Error updating admin user:", error.message)
    process.exit(1)
  }
  console.log("[v0] Admin user updated successfully:", email)
} else {
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { is_admin: true },
  })
  if (error) {
    console.error("[v0] Error creating admin user:", error.message)
    process.exit(1)
  }
  console.log("[v0] Admin user created successfully:", email)
}
