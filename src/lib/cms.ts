import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { StaffMember } from "@/lib/types/cms";

// Use a plain Supabase client (no cookies) for CMS reads.
// This is safe because site_content and staff_members have public SELECT RLS.
// Using the cookie-based server client inside unstable_cache is not allowed.
function getCmsClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Fetch all content sections for a given page.
 * Returns a map: { sectionKey: contentObject }
 * Returns empty object if table doesn't exist yet or query fails.
 */
export const getPageContent = unstable_cache(
  async (page: string) => {
    try {
      const supabase = getCmsClient();
      const { data, error } = await supabase
        .from("site_content")
        .select("section, content")
        .eq("page", page)
        .order("sort_order");

      if (error) return {};

      const contentMap: Record<string, Record<string, unknown>> = {};
      data?.forEach((row: { section: string; content: Record<string, unknown> }) => {
        contentMap[row.section] = row.content;
      });
      return contentMap;
    } catch {
      return {};
    }
  },
  ["page-content"],
  { revalidate: 300, tags: ["cms"] }
);

/**
 * Fetch global content (contact info, footer, etc.)
 */
export const getGlobalContent = unstable_cache(
  async () => {
    try {
      const supabase = getCmsClient();
      const { data, error } = await supabase
        .from("site_content")
        .select("section, content")
        .eq("page", "global");

      if (error) return {};

      const contentMap: Record<string, Record<string, unknown>> = {};
      data?.forEach((row: { section: string; content: Record<string, unknown> }) => {
        contentMap[row.section] = row.content;
      });
      return contentMap;
    } catch {
      return {};
    }
  },
  ["global-content"],
  { revalidate: 300, tags: ["cms"] }
);

/**
 * Fetch all visible staff members, ordered by sort_order.
 */
export const getStaffMembers = unstable_cache(
  async (): Promise<StaffMember[]> => {
    try {
      const supabase = getCmsClient();
      const { data, error } = await supabase
        .from("staff_members")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order");

      if (error) return [];
      return (data as StaffMember[]) || [];
    } catch {
      return [];
    }
  },
  ["staff-members"],
  { revalidate: 300, tags: ["cms"] }
);
