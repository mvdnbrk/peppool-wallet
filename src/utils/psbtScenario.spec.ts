import { describe, it, expect } from 'vitest';
import { detectPsbtScenario, type PsbtIo } from './psbtScenario';
import type { Inscription } from '@/models/Inscription';

function makeInscription(id = 'ins1', number = 42): Inscription {
  return {
    id,
    number,
    contentType: 'image/png',
    contentLength: 100,
    height: 1,
    value: 100_000,
    parents: [],
    properties: null,
    satpoint: `${id}:0:0`,
    timestamp: 0
  };
}

function input(overrides: Partial<PsbtIo>): PsbtIo {
  return {
    address: 'Pmine',
    amountRibbits: 100_000,
    mine: true,
    inscription: null,
    sighashType: 0x01,
    ...overrides
  };
}

function output(overrides: Partial<PsbtIo>): PsbtIo {
  return {
    address: 'Pforeign',
    amountRibbits: 100_000,
    mine: false,
    inscription: null,
    ...overrides
  };
}

describe('detectPsbtScenario', () => {
  it('returns unknown for empty input/output', () => {
    expect(detectPsbtScenario([], [])).toEqual({ kind: 'unknown' });
  });

  it('detects a listing PSBT (1 mine input with 0x83 + inscription, 1 mine output for the price)', () => {
    const inscription = makeInscription('insA', 1);
    const scenario = detectPsbtScenario(
      [input({ sighashType: 0x83, inscription })],
      [output({ mine: true, address: 'Pmine', amountRibbits: 10_000_000_000 })]
    );
    expect(scenario).toEqual({
      kind: 'listing',
      inscription,
      priceRibbits: 10_000_000_000
    });
  });

  it('does not detect a listing when the mine input has no inscription', () => {
    const scenario = detectPsbtScenario(
      [input({ sighashType: 0x83 })],
      [output({ mine: true, address: 'Pmine' })]
    );
    expect(scenario.kind).toBe('unknown');
  });

  it('detects a buy listing (foreign 0x83 input + mine default-sighash input + mine output)', () => {
    const scenario = detectPsbtScenario(
      [
        input({ mine: false, address: 'Pseller', sighashType: 0x83 }),
        input({ mine: true, address: 'Pmine', sighashType: 0x01, amountRibbits: 20_000_000_000 })
      ],
      [
        output({ mine: true, address: 'Pmine', amountRibbits: 100_000 }),
        output({ mine: false, address: 'Pseller', amountRibbits: 10_000_000_000 })
      ]
    );
    // fee = inputs (foreign 100_000 + mine 20_000_000_000) − outputs (100_000 + 10_000_000_000)
    expect(scenario).toEqual({
      kind: 'buy',
      priceRibbits: 10_000_000_000,
      feeRibbits: 10_000_000_000
    });
  });

  it('falls back to unknown when a foreign 0x83 input exists but no mine output', () => {
    const scenario = detectPsbtScenario(
      [input({ mine: false, sighashType: 0x83 }), input({ mine: true, sighashType: 0x01 })],
      [output({ mine: false })]
    );
    expect(scenario.kind).toBe('unknown');
  });

  it('detects a simple PEP transfer (1 non-mine output, optional mine change, no inscriptions)', () => {
    const scenario = detectPsbtScenario(
      [input({ amountRibbits: 100_000_000 })],
      [
        output({ mine: false, address: 'Precipient', amountRibbits: 50_000_000 }),
        output({ mine: true, address: 'Pmine', amountRibbits: 49_000_000 })
      ]
    );
    expect(scenario).toEqual({
      kind: 'send-pep',
      recipient: 'Precipient',
      amountRibbits: 50_000_000,
      // fee = inputs (100_000_000) − outputs (50_000_000 + 49_000_000) = 1_000_000
      feeRibbits: 1_000_000
    });
  });

  it('does not detect send-pep when an inscription is anywhere in the tx', () => {
    const inscription = makeInscription();
    const scenario = detectPsbtScenario(
      [input({ inscription })],
      [output({ mine: false, address: 'Precipient' })]
    );
    expect(scenario.kind).not.toBe('send-pep');
  });

  it('falls back to unknown for multi-recipient PEP sends (>1 non-mine output)', () => {
    const scenario = detectPsbtScenario(
      [input({ amountRibbits: 200_000_000 })],
      [
        output({ mine: false, address: 'Pa', amountRibbits: 50_000_000 }),
        output({ mine: false, address: 'Pb', amountRibbits: 50_000_000 })
      ]
    );
    expect(scenario.kind).toBe('unknown');
  });

  it('detects a send-inscription PSBT (mine inscription input lands on a non-mine output)', () => {
    const inscription = makeInscription('insSend', 7);
    const scenario = detectPsbtScenario(
      [input({ inscription })],
      [output({ mine: false, address: 'Precipient', inscription, amountRibbits: 100_000 })]
    );
    expect(scenario).toEqual({
      kind: 'send-inscription',
      recipient: 'Precipient',
      inscription
    });
  });

  it('detects a self-send / cancel-listing (single inscription input → single mine output)', () => {
    const inscription = makeInscription('insSelf', 99);
    const scenario = detectPsbtScenario(
      [input({ inscription })],
      [output({ mine: true, address: 'Pmine', inscription, amountRibbits: 100_000 })]
    );
    expect(scenario).toEqual({ kind: 'self-send', inscription });
  });

  it('returns unknown when a mine input uses a non-default sighash but no listing-shape matches', () => {
    const scenario = detectPsbtScenario(
      [input({ sighashType: 0x83 }), input({ sighashType: 0x01 })],
      [output({ mine: true })]
    );
    expect(scenario.kind).toBe('unknown');
  });

  it('returns unknown when foreign ANYONECANPAY exists outside the buy shape', () => {
    const scenario = detectPsbtScenario(
      [input({ mine: false, sighashType: 0x83 })],
      [output({ mine: false })]
    );
    expect(scenario.kind).toBe('unknown');
  });
});
