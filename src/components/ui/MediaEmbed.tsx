type Parsed =
  | { kind: "youtube"; id: string }
  | { kind: "vimeo"; id: string }
  | { kind: "image" };

function parse(url: string): Parsed {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0];
      if (id) return { kind: "youtube", id };
    }
    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const v = u.searchParams.get("v");
      if (v) return { kind: "youtube", id: v };
      const m = u.pathname.match(/^\/(?:embed|shorts)\/([^/?#]+)/);
      if (m) return { kind: "youtube", id: m[1] };
    }
    if (host === "vimeo.com" || host.endsWith(".vimeo.com")) {
      const m = u.pathname.match(/\/(\d+)/);
      if (m) return { kind: "vimeo", id: m[1] };
    }
  } catch {
    // Not a URL — render as image and let <img> handle it.
  }
  return { kind: "image" };
}

export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const p = parse(url);
  return p.kind === "youtube" || p.kind === "vimeo";
}

interface MediaEmbedProps {
  url: string;
  alt?: string;
  className?: string;
  /** When true, renders YouTube/Vimeo as silent autoplay loop with no controls — for hero/background use. */
  cinematic?: boolean;
}

export function MediaEmbed({ url, alt = "", className, cinematic = false }: MediaEmbedProps) {
  const parsed = parse(url);

  if (parsed.kind === "youtube") {
    const params = cinematic
      ? `autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&playsinline=1&rel=0&playlist=${parsed.id}`
      : `rel=0&modestbranding=1`;
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${parsed.id}?${params}`}
        title={alt || "YouTube video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className={className}
        loading="lazy"
      />
    );
  }

  if (parsed.kind === "vimeo") {
    const params = cinematic
      ? `autoplay=1&muted=1&loop=1&background=1`
      : `byline=0&portrait=0&title=0`;
    return (
      <iframe
        src={`https://player.vimeo.com/video/${parsed.id}?${params}`}
        title={alt || "Vimeo video"}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className={className}
        loading="lazy"
      />
    );
  }

  return <img src={url} alt={alt} className={className} />;
}
