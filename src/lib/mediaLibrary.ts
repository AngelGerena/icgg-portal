import { supabase } from './supabase';

/**
 * Registers a file that was uploaded to ANY storage bucket into the shared
 * Media Library, so it becomes reusable from the "Choose from library" picker.
 *
 * Deliberately non-fatal: if the library insert fails (for example a media-team
 * member without admin rights), the caller's own save must still succeed. The
 * upload already landed in storage and the URL is already set on the form.
 * Returns an error message on failure, or null on success.
 */
export async function registerMedia(opts: {
  bucket: string;
  path: string;
  url: string;
  name: string;
  sizeBytes?: number | null;
  tag?: string;
}): Promise<string | null> {
  try {
    const { error } = await supabase.from('media').insert({
      name: opts.name,
      path: opts.path,
      url: opts.url,
      bucket: opts.bucket,
      size_bytes: opts.sizeBytes ?? null,
      tag: opts.tag ?? 'General',
    });
    return error ? error.message : null;
  } catch (err: any) {
    return err?.message || 'Media library registration failed';
  }
}
