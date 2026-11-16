import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';

export type ToolMode = 'jwt' | 'base64' | 'url';

@Component({
  selector: 'app-base64-tool',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdBannerComponent],
  templateUrl: './base64-tool.component.html',
  styleUrl: './base64-tool.component.css'
})
export class Base64ToolComponent {
  public activeMode = signal<ToolMode>('jwt');

  // JWT States
  public jwtInput = signal<string>('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsImFkbWluIjp0cnVlfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  public jwtHeader = signal<string>('');
  public jwtPayload = signal<string>('');
  public jwtSignature = signal<string>('');
  public jwtError = signal<string>('');
  public jwtExpiryInfo = signal<{ isExpired: boolean; expDate: string | null; iatDate: string | null } | null>(null);

  // Base64 States
  public base64Input = signal<string>('Hello from JSNS Works!');
  public base64Output = signal<string>('');
  public base64IsEncoding = signal<boolean>(true); // true = encode to base64, false = decode from base64
  public base64Error = signal<string>('');

  // URL States
  public urlInput = signal<string>('https://www.jsnsworks.site/search?q=free tools & calculators');
  public urlOutput = signal<string>('');
  public urlIsEncoding = signal<boolean>(true);

  public copiedSection = signal<string>('');

  constructor() {
    this.decodeJwt();
    this.processBase64();
    this.processUrl();
  }

  public setMode(mode: ToolMode): void {
    this.activeMode.set(mode);
  }

  // --- JWT LOGIC ---
  public decodeJwt(): void {
    this.jwtError.set('');
    const token = this.jwtInput().trim();

    if (!token) {
      this.jwtHeader.set('');
      this.jwtPayload.set('');
      this.jwtSignature.set('');
      this.jwtExpiryInfo.set(null);
      return;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      this.jwtError.set('Invalid JWT format: A valid JSON Web Token must contain 3 parts separated by dots (header.payload.signature).');
      return;
    }

    try {
      const headerStr = this.base64UrlDecode(parts[0]);
      const headerObj = JSON.parse(headerStr);
      this.jwtHeader.set(JSON.stringify(headerObj, null, 2));
    } catch (e: any) {
      this.jwtError.set(`Error parsing JWT Header: ${e.message}`);
      return;
    }

    try {
      const payloadStr = this.base64UrlDecode(parts[1]);
      const payloadObj = JSON.parse(payloadStr);
      this.jwtPayload.set(JSON.stringify(payloadObj, null, 2));

      // Calculate expiry if present
      let isExpired = false;
      let expDate: string | null = null;
      let iatDate: string | null = null;

      if (payloadObj.exp) {
        const expTime = payloadObj.exp * 1000;
        expDate = new Date(expTime).toUTCString();
        isExpired = Date.now() > expTime;
      }
      if (payloadObj.iat) {
        iatDate = new Date(payloadObj.iat * 1000).toUTCString();
      }

      this.jwtExpiryInfo.set({ isExpired, expDate, iatDate });
    } catch (e: any) {
      this.jwtError.set(`Error parsing JWT Payload: ${e.message}`);
      return;
    }

    this.jwtSignature.set(parts[2]);
  }

  private base64UrlDecode(str: string): string {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  }

  // --- BASE64 LOGIC ---
  public processBase64(): void {
    this.base64Error.set('');
    const input = this.base64Input();

    if (!input) {
      this.base64Output.set('');
      return;
    }

    try {
      if (this.base64IsEncoding()) {
        // UTF-8 safe encode
        const encoded = btoa(unescape(encodeURIComponent(input)));
        this.base64Output.set(encoded);
      } else {
        // UTF-8 safe decode
        const decoded = decodeURIComponent(escape(atob(input.trim())));
        this.base64Output.set(decoded);
      }
    } catch (e: any) {
      this.base64Error.set(`Conversion Error: ${e.message}. Ensure string is valid Base64.`);
    }
  }

  public switchBase64Direction(encode: boolean): void {
    this.base64IsEncoding.set(encode);
    // Swap input and output for quick round-trip testing
    const prevOut = this.base64Output();
    if (prevOut) {
      this.base64Input.set(prevOut);
    }
    this.processBase64();
  }

  // --- URL LOGIC ---
  public processUrl(): void {
    const input = this.urlInput();
    if (!input) {
      this.urlOutput.set('');
      return;
    }

    try {
      if (this.urlIsEncoding()) {
        this.urlOutput.set(encodeURIComponent(input));
      } else {
        this.urlOutput.set(decodeURIComponent(input));
      }
    } catch (e: any) {
      this.urlOutput.set(`Error: ${e.message}`);
    }
  }

  public switchUrlDirection(encode: boolean): void {
    this.urlIsEncoding.set(encode);
    const prevOut = this.urlOutput();
    if (prevOut) {
      this.urlInput.set(prevOut);
    }
    this.processUrl();
  }

  // --- CLIPBOARD ---
  public copyToClipboard(text: string, section: string): void {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.copiedSection.set(section);
      setTimeout(() => this.copiedSection.set(''), 2000);
    });
  }
}
