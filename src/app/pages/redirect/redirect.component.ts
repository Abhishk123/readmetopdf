import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="redirect-container">
      <div class="redirect-card">
        <div class="spinner-ring"></div>
        <h2>Redirecting you safely...</h2>
        <p class="target-domain">Destination: <strong>{{ targetHost() }}</strong></p>
        <p class="redirect-note">Powered by JSNS Works Local-First Tools</p>
        
        @if (targetUrl()) {
          <a [href]="targetUrl()" class="btn-manual">
            Click here if not redirected in 3 seconds
          </a>
        } @else {
          <div class="error-box">
            <p>Invalid or missing redirect URL.</p>
            <a routerLink="/" class="btn-home">Return to Home</a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .redirect-container {
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .redirect-card {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(99, 102, 241, 0.3);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 40px 32px;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
    }
    .spinner-ring {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(99, 102, 241, 0.2);
      border-top-color: #818cf8;
      border-radius: 50%;
      margin: 0 auto 24px;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    h2 {
      font-size: 22px;
      color: #f8fafc;
      margin: 0 0 12px;
    }
    .target-domain {
      font-size: 15px;
      color: #94a3b8;
      margin: 0 0 8px;
      word-break: break-all;
    }
    .target-domain strong {
      color: #a5b4fc;
    }
    .redirect-note {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 24px;
    }
    .btn-manual, .btn-home {
      display: inline-block;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.2s ease;
    }
    .btn-manual:hover, .btn-home:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
    }
    .error-box {
      margin-top: 16px;
      color: #fca5a5;
    }
  `]
})
export class RedirectComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public targetUrl = signal<string>('');
  public targetHost = signal<string>('Loading...');

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const raw = params['to'];
      if (!raw) {
        this.targetHost.set('None');
        return;
      }

      // 1. If it's a short 4-8 character code from PostgreSQL, query /api/shorten
      if (raw.length <= 10 && !raw.startsWith('http') && !raw.startsWith('1') && !raw.startsWith('0')) {
        fetch(`/api/shorten?code=${encodeURIComponent(raw)}`)
          .then(res => res.json())
          .then(data => {
            if (data?.url) {
              this.executeRedirect(data.url);
            } else {
              this.fallbackDecode(raw);
            }
          })
          .catch(() => {
            this.fallbackDecode(raw);
          });
        return;
      }

      this.fallbackDecode(raw);
    });
  }

  private fallbackDecode(raw: string): void {
    let destination = '';
    try {
      if (raw.startsWith('http://') || raw.startsWith('https://')) {
        destination = raw;
      } else {
        let padded = raw.replace(/-/g, '+').replace(/_/g, '/');
        while (padded.length % 4) padded += '=';
        const binaryDec = atob(padded);
        const decBytes = new Uint8Array(binaryDec.length);
        for (let i = 0; i < binaryDec.length; i++) {
          decBytes[i] = binaryDec.charCodeAt(i);
        }
        const decodedText = new TextDecoder().decode(decBytes);

        if (decodedText.startsWith('1')) {
          destination = 'https://' + decodedText.slice(1);
        } else if (decodedText.startsWith('0')) {
          destination = 'http://' + decodedText.slice(1);
        } else if (decodedText.startsWith('http')) {
          destination = decodedText;
        } else {
          destination = decodeURIComponent(decodedText);
        }
      }
    } catch {
      try {
        destination = decodeURIComponent(raw);
      } catch {
        destination = raw;
      }
    }

    if (destination) {
      this.executeRedirect(destination);
    } else {
      this.targetHost.set('Invalid link');
    }
  }

  private executeRedirect(destination: string): void {
    if (destination && (destination.startsWith('http://') || destination.startsWith('https://'))) {
      this.targetUrl.set(destination);
      try {
        const parsed = new URL(destination);
        this.targetHost.set(parsed.hostname);
      } catch {
        this.targetHost.set(destination);
      }

      setTimeout(() => {
        window.location.href = destination;
      }, 1000);
    } else {
      this.targetHost.set('Invalid link');
    }
  }
}
