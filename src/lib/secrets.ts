/**
 * Minimal placeholder for a future secret manager integration (GCP Secret Manager, KMS, etc.).
 * These APIs must never be invoked from the browser. The current implementation
 * simply throws if you attempt to read/write secrets without a server-backed service.
 */
const ensureServer = () => {
  if (typeof window !== 'undefined') {
    throw new Error('SecretManager operations must be performed on the server.');
  }
};

export const SecretManager = {
  async storeUserSecret() {
    ensureServer();
    throw new Error('SecretManager.storeUserSecret is not implemented yet. Wire this to your secure storage layer.');
  },
  async getSecret() {
    ensureServer();
    throw new Error('SecretManager.getSecret is not implemented yet. Wire this to your secure storage layer.');
  },
};
