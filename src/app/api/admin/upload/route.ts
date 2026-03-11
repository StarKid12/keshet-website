import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  // Verify the user is an admin
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // Get the file from the request
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const path = formData.get("path") as string | null;
  const bucket = (formData.get("bucket") as string) || "site-content";

  if (!file || !path) {
    return NextResponse.json(
      { error: "File and path are required" },
      { status: 400 }
    );
  }

  // Use service role client to bypass RLS
  const serviceClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await serviceClient.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (error) {
    console.error("Storage upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = serviceClient.storage.from(bucket).getPublicUrl(data.path);

  return NextResponse.json({ url: publicUrl });
}
