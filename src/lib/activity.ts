import { supabase } from './supabase';

/** Best-effort: get the current signed-in member's email for attribution. */
async function currentActor(): Promise<string> {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user?.email || 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Record an action in the activity log. Fire-and-forget — never blocks or
 * throws into the caller; logging must not break the actual operation.
 *
 * @param action human-readable ("Published event: Casual Sunday")
 * @param kind   area touched ("Events", "Site Editor", "Images"...)
 * @param recordId optional id of the affected row
 */
export async function logActivity(action: string, kind?: string, recordId?: string) {
  try {
    const actor = await currentActor();
    await supabase.from('audit_log').insert({
      actor,
      action,
      kind: kind ?? null,
      record_id: recordId ?? null,
    });
  } catch {
    /* logging is best-effort; ignore failures */
  }
}

/**
 * Move a row to the trash before deleting it, so it can be restored.
 * Stores the full row payload. Returns true if the trash copy was saved.
 */
export async function trashRecord(
  sourceTable: string,
  recordId: string,
  label: string,
  payload: Record<string, any>,
): Promise<boolean> {
  try {
    const actor = await currentActor();
    const { error } = await supabase.from('trash').insert({
      source_table: sourceTable,
      record_id: recordId,
      label,
      payload,
      deleted_by: actor,
    });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Restore a trashed row back into its original table, then remove it from trash.
 * Returns true on success.
 */
export async function restoreFromTrash(trashId: string, sourceTable: string, payload: Record<string, any>): Promise<boolean> {
  try {
    // Strip nothing — re-insert the full payload (its original id included, so it comes back identical).
    const { error: insErr } = await supabase.from(sourceTable).insert(payload);
    if (insErr) return false;
    await supabase.from('trash').delete().eq('id', trashId);
    return true;
  } catch {
    return false;
  }
}
