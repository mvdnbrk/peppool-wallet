// Global Window augmentations for the inpage provider. `pep_providers` is the
// discovery array dApps walk (modeled loosely after EIP-1193/EIP-6963).

export interface PepProvider {
  id: string;
  name: string;
  icon: string;
  methods: string[];
  request: (method: string, params?: unknown) => Promise<unknown>;
}

declare global {
  interface Window {
    pep_providers?: PepProvider[];
    PepecoinProvider?: PepProvider;
    __peppoolRequestListener?: boolean;
    __peppool_dev__?: unknown;
  }
}

export {};
