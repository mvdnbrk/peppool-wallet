import { describe, it, expect, vi } from 'vitest';
import { pepeExplorer } from './explorer';

describe('Pepe Explorer Utility', () => {
  it('should generate correct TX URLs', () => {
    const txid = 'abc123';
    expect(pepeExplorer.getTxUrl('peppool', txid)).toBe('https://peppool.space/tx/abc123');
    expect(pepeExplorer.getTxUrl('pepeblocks', txid)).toBe('https://pepeblocks.com/tx/abc123');
  });

  it('should generate correct address URLs', () => {
    const address = 'P123';
    expect(pepeExplorer.getAddressUrl('peppool', address)).toBe(
      'https://peppool.space/address/P123'
    );
    expect(pepeExplorer.getAddressUrl('pepeblocks', address)).toBe(
      'https://pepeblocks.com/address/P123'
    );
  });

  it('should open explorer in a new tab', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    pepeExplorer.openTx('peppool', 'tx123');
    expect(openSpy).toHaveBeenCalledWith('https://peppool.space/tx/tx123', '_blank');

    pepeExplorer.openAddress('pepeblocks', 'addr123');
    expect(openSpy).toHaveBeenCalledWith('https://pepeblocks.com/address/addr123', '_blank');

    openSpy.mockRestore();
  });
});
