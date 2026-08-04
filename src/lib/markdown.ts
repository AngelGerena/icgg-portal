/**
 * A small, deliberately conservative Markdown renderer.
 *
 * Why hand-rolled instead of a library: the output is injected with
 * dangerouslySetInnerHTML on both the portal preview and the public site.
 * Every input is HTML-escaped BEFORE any markdown is applied, so a post can
 * never smuggle a <script> tag through. Nothing here emits raw user HTML.
 *
 * Supported: # headings, **bold**, *italic*, [links](url), ![images](url),
 * > blockquotes, - and 1. lists, --- rules, and paragraphs.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Only allow URLs that cannot execute script. */
function safeUrl(url: string): string {
  const u = url.trim();
  if (/^(https?:\/\/|\/|mailto:|tel:)/i.test(u)) return u;
  return '#';
}

function inline(s: string): string {
  let out = s;
  // images before links — the syntax overlaps
  out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g,
    (_m, alt, url) => `<img src="${safeUrl(url)}" alt="${alt}" loading="lazy" />`);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_m, text, url) => `<a href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer">${text}</a>`);
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  return out;
}

export function renderMarkdown(src: string | null | undefined): string {
  if (!src) return '';
  const lines = escapeHtml(src).replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let paragraph: string[] = [];

  const closeList = () => { if (listType) { out.push(`</${listType}>`); listType = null; } };
  const closePara = () => {
    if (paragraph.length) { out.push(`<p>${inline(paragraph.join(' '))}</p>`); paragraph = []; }
  };
  const closeAll = () => { closePara(); closeList(); };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (!line.trim()) { closeAll(); continue; }

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      closeAll();
      const level = heading[1].length + 1 > 6 ? 6 : heading[1].length + 1; // h1 reserved for the post title
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(line.trim())) { closeAll(); out.push('<hr />'); continue; }

    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      closeAll();
      out.push(`<blockquote>${inline(quote[1])}</blockquote>`);
      continue;
    }

    const ul = line.match(/^\s*[-*]\s+(.*)$/);
    const ol = line.match(/^\s*\d+\.\s+(.*)$/);
    if (ul || ol) {
      closePara();
      const want: 'ul' | 'ol' = ul ? 'ul' : 'ol';
      if (listType !== want) { closeList(); out.push(`<${want}>`); listType = want; }
      out.push(`<li>${inline((ul ? ul[1] : ol![1]))}</li>`);
      continue;
    }

    closeList();
    paragraph.push(line.trim());
  }

  closeAll();
  return out.join('\n');
}

/** Rough reading time, used for the "5 min read" label. */
export function readingMinutes(...bodies: (string | null | undefined)[]): number {
  const words = bodies
    .filter(Boolean)
    .map(b => (b as string).trim().split(/\s+/).length)
    .reduce((a, b) => Math.max(a, b), 0);
  return Math.max(1, Math.round(words / 200));
}

/** Plain-text preview for excerpts and meta descriptions. */
export function stripMarkdown(src: string | null | undefined, limit = 160): string {
  if (!src) return '';
  const plain = src
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > limit ? plain.slice(0, limit - 1).trimEnd() + '…' : plain;
}

/** URL-safe slug that keeps Spanish readable (acentos folded, ñ preserved as n). */
export function slugify(input: string): string {
  return (input || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 70)
    .replace(/^-|-$/g, '');
}
