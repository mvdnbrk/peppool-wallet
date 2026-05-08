export const EXPLORERS = {
  peppool: { name: 'Peppool', url: 'https://peppool.space' },
  pepeblocks: { name: 'Pepeblocks', url: 'https://pepeblocks.com' }
} as const;

export type ExplorerId = keyof typeof EXPLORERS;

export const pepeExplorer = {
  getTxUrl(explorerId: ExplorerId, txid: string): string {
    return `${EXPLORERS[explorerId].url}/tx/${txid}`;
  },
  getAddressUrl(explorerId: ExplorerId, address: string): string {
    return `${EXPLORERS[explorerId].url}/address/${address}`;
  },
  getInscriptionUrl(explorerId: ExplorerId, id: string): string {
    return `${EXPLORERS[explorerId].url}/inscription/${id}`;
  },
  openTx(explorerId: ExplorerId, txid: string): void {
    window.open(this.getTxUrl(explorerId, txid), '_blank');
  },
  openAddress(explorerId: ExplorerId, address: string): void {
    window.open(this.getAddressUrl(explorerId, address), '_blank');
  },
  openInscription(explorerId: ExplorerId, id: string): void {
    window.open(this.getInscriptionUrl(explorerId, id), '_blank');
  }
};
