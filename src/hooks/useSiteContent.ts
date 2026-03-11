"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Hook for admin content editor pages.
 * Fetches all sections for a given page from site_content,
 * and provides a save function that upserts + revalidates.
 */
export function useSiteContent(page: string) {
  const [sections, setSections] = useState<Record<string, Record<string, unknown>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_content")
        .select("section, content")
        .eq("page", page)
        .order("sort_order");

      const map: Record<string, Record<string, unknown>> = {};
      data?.forEach((row: { section: string; content: Record<string, unknown> }) => {
        map[row.section] = row.content;
      });
      setSections(map);
      setLoading(false);
    }
    fetch();
  }, [page]);

  const getSection = useCallback(
    <T extends Record<string, unknown>>(section: string, defaultValue: T): T => {
      return { ...defaultValue, ...(sections[section] as T | undefined) };
    },
    [sections]
  );

  const updateSection = useCallback(
    (section: string, content: Record<string, unknown>) => {
      setSections((prev) => ({ ...prev, [section]: content }));
    },
    []
  );

  const saveSection = useCallback(
    async (section: string, content: Record<string, unknown>) => {
      setSaving(true);
      setSuccess(null);
      const supabase = createClient();

      const { error } = await supabase.from("site_content").upsert(
        { page, section, content },
        { onConflict: "page,section" }
      );

      if (!error) {
        setSections((prev) => ({ ...prev, [section]: content }));
        await fetch("/api/revalidate", { method: "POST" });
        setSuccess("נשמר בהצלחה!");
        setTimeout(() => setSuccess(null), 3000);
      }
      setSaving(false);
    },
    [page]
  );

  const saveAllSections = useCallback(
    async (sectionsToSave: Record<string, Record<string, unknown>>) => {
      setSaving(true);
      setSuccess(null);
      const supabase = createClient();

      const rows = Object.entries(sectionsToSave).map(([section, content], index) => ({
        page,
        section,
        content,
        sort_order: index,
      }));

      const { error } = await supabase
        .from("site_content")
        .upsert(rows, { onConflict: "page,section" });

      if (!error) {
        setSections((prev) => ({ ...prev, ...sectionsToSave }));
        await fetch("/api/revalidate", { method: "POST" });
        setSuccess("נשמר בהצלחה!");
        setTimeout(() => setSuccess(null), 3000);
      }
      setSaving(false);
    },
    [page]
  );

  return {
    sections,
    loading,
    saving,
    success,
    getSection,
    updateSection,
    saveSection,
    saveAllSections,
  };
}
