import { truncateId } from '@/utils/constants';

export class Address {
  public readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  /** For PepCopyableId split rendering */
  get start() {
    return truncateId(this.value).start;
  }
  get end() {
    return truncateId(this.value).end;
  }

  /** Plain string: "Pmu...FZSU" */
  get truncated() {
    if (!this.value || this.value.length <= 12) return this.value || '';
    return `${this.value.slice(0, 6)}…${this.value.slice(-6)}`;
  }

  toString() {
    return this.value;
  }
}
