import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * Public Client-side Supabase Client
 * Used for authenticated user operations and public bucket downloads
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Server-side Supabase Admin Client
 * Used in API routes / Server Actions to bypass RLS, manage storage buckets,
 * and handle administrative tasks. Never expose to the browser!
 */
export const supabaseAdmin =
  supabaseUrl && (supabaseServiceKey || supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

/**
 * Helper to upload a product or banner asset to Supabase Storage
 */
export async function uploadAssetToSupabase(
  bucket: string,
  filePath: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
  if (!supabaseAdmin) {
    return {
      success: false,
      error: "Supabase credentials are not configured in environment variables.",
    };
  }

  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      success: true,
      publicUrl: publicUrlData.publicUrl,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Upload failed." };
  }
}
