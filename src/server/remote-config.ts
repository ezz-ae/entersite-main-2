const disabledValues = new Set(['1', 'true', 'yes', 'on']);

const rawToggle =
  process.env.DISABLE_REMOTE_CONTENT ??
  process.env.SKIP_REMOTE_CONTENT ??
  process.env.SKIP_REMOTE_DATA ??
  '';

/**
 * Returns `true` when remote Firestore-backed marketing content should be skipped.
 * This helps offline builds avoid noisy network failures.
 */
export const isRemoteContentDisabled = disabledValues.has(rawToggle.trim().toLowerCase());

export const shouldUseRemoteContent = !isRemoteContentDisabled;
