import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';

type GeneratorType = 'password' | 'secret' | 'uuid' | 'pin';

interface StrengthReport {
  score: number; // 0 to 100
  label: string;
  color: string;
  crackTime: string;
  entropyBits: number;
}

@Component({
  selector: 'app-password-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdBannerComponent],
  templateUrl: './password-generator.component.html',
  styleUrl: './password-generator.component.css'
})
export class PasswordGeneratorComponent {
  public activeType = signal<GeneratorType>('password');

  // Password Options
  public passwordLength = signal<number>(18);
  public includeUpper = signal<boolean>(true);
  public includeLower = signal<boolean>(true);
  public includeNumbers = signal<boolean>(true);
  public includeSymbols = signal<boolean>(true);
  public avoidAmbiguous = signal<boolean>(false);

  // Secret Token Options
  public secretBytes = signal<number>(32);
  public secretEncoding = signal<'hex' | 'base64'>('hex');

  // PIN Options
  public pinLength = signal<number>(6);

  // Outputs
  public generatedOutput = signal<string>('');
  public copiedMessage = signal<string>('');

  // Strength Assessment
  public strength = computed<StrengthReport>(() => {
    const pwd = this.generatedOutput();
    if (!pwd || this.activeType() !== 'password') {
      return { score: 100, label: 'Cryptographically Secure', color: '#10b981', crackTime: 'Centuries', entropyBits: 256 };
    }

    let pool = 0;
    if (/[a-z]/.test(pwd)) pool += 26;
    if (/[A-Z]/.test(pwd)) pool += 26;
    if (/[0-9]/.test(pwd)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) pool += 32;

    const entropy = Math.round(pwd.length * (Math.log2(pool || 1)));
    let score = Math.min(100, Math.round((entropy / 128) * 100));

    let label = 'Very Weak';
    let color = '#ef4444';
    let crackTime = 'Instant';

    if (entropy >= 90) {
      label = 'Uncrackable (Military Grade)';
      color = '#10b981';
      crackTime = 'Centillions of Years';
    } else if (entropy >= 70) {
      label = 'Very Strong';
      color = '#34d399';
      crackTime = 'Millions of Years';
    } else if (entropy >= 50) {
      label = 'Moderate';
      color = '#f59e0b';
      crackTime = 'Several Years';
    } else if (entropy >= 35) {
      label = 'Weak';
      color = '#f97316';
      crackTime = 'A Few Days';
    }

    return { score, label, color, crackTime, entropyBits: entropy };
  });

  constructor() {
    this.generateNow();
  }

  public setType(type: GeneratorType): void {
    this.activeType.set(type);
    this.generateNow();
  }

  public generateNow(): void {
    const type = this.activeType();
    if (type === 'password') {
      this.generatePassword();
    } else if (type === 'secret') {
      this.generateSecret();
    } else if (type === 'uuid') {
      this.generateUuid();
    } else if (type === 'pin') {
      this.generatePin();
    }
  }

  private generatePassword(): void {
    let lower = 'abcdefghijklmnopqrstuvwxyz';
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let numbers = '0123456789';
    let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (this.avoidAmbiguous()) {
      lower = lower.replace(/[il]/g, '');
      upper = upper.replace(/[IO]/g, '');
      numbers = numbers.replace(/[01]/g, '');
    }

    let charPool = '';
    if (this.includeLower()) charPool += lower;
    if (this.includeUpper()) charPool += upper;
    if (this.includeNumbers()) charPool += numbers;
    if (this.includeSymbols()) charPool += symbols;

    if (!charPool) {
      charPool = lower;
    }

    const length = this.passwordLength();
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charPool[array[i] % charPool.length];
    }

    this.generatedOutput.set(result);
  }

  private generateSecret(): void {
    const bytes = this.secretBytes();
    const array = new Uint8Array(bytes);
    window.crypto.getRandomValues(array);

    if (this.secretEncoding() === 'hex') {
      const hex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
      this.generatedOutput.set(hex);
    } else {
      let binary = '';
      for (let i = 0; i < array.length; i++) {
        binary += String.fromCharCode(array[i]);
      }
      this.generatedOutput.set(btoa(binary));
    }
  }

  private generateUuid(): void {
    if (typeof crypto.randomUUID === 'function') {
      this.generatedOutput.set(crypto.randomUUID());
    } else {
      // Fallback RFC4122 v4 UUID
      const bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
      const uuid = `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20, 32)}`;
      this.generatedOutput.set(uuid);
    }
  }

  private generatePin(): void {
    const len = this.pinLength();
    const array = new Uint32Array(len);
    window.crypto.getRandomValues(array);
    let pin = '';
    for (let i = 0; i < len; i++) {
      pin += (array[i] % 10).toString();
    }
    this.generatedOutput.set(pin);
  }

  public copyPassword(): void {
    const text = this.generatedOutput();
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.showCopied('Copied to clipboard securely!');
    });
  }

  private showCopied(msg: string): void {
    this.copiedMessage.set(msg);
    setTimeout(() => {
      this.copiedMessage.set('');
    }, 3000);
  }
}
