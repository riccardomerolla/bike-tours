import { LitElement, html, css } from "https://cdn.jsdelivr.net/npm/lit@3.1.2/+esm";

class SiteHeader extends LitElement {
  static styles = css`
    :host { display: block; }
  `;

  // Use light DOM for Tailwind compatibility
  createRenderRoot() { return this; }

  render() {
    return html`
      <header class="bg-white border-b border-base-background-secondary sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16 lg:h-20">
            <a href="index.html" class="flex items-center h-12">
              <img src="img/logo.png" alt="BikeTours.cc" class="h-6 w-auto object-contain">
            </a>
            <button id="mobile-menu-btn" class="md:hidden p-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <nav class="hidden md:flex space-x-10">
              <a href="tours.html" class="text-primary hover:text-accent font-normal transition-colors uppercase tracking-wider text-sm">Tours</a>
              <a href="about.html" class="text-primary hover:text-accent font-normal transition-colors uppercase tracking-wider text-sm">About</a>
              <a href="contact.html" class="text-primary hover:text-accent font-normal transition-colors uppercase tracking-wider text-sm">Contact</a>
            </nav>
          </div>
          <div id="mobile-menu" class="hidden md:hidden pb-4">
            <div class="flex flex-col space-y-4">
              <a href="tours.html" class="text-primary hover:text-accent font-normal uppercase tracking-wider text-sm">Tours</a>
              <a href="about.html" class="text-primary hover:text-accent font-normal uppercase tracking-wider text-sm">About</a>
              <a href="contact.html" class="text-primary hover:text-accent font-normal uppercase tracking-wider text-sm">Contact</a>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    // Mobile menu toggle
    setTimeout(() => {
      const mobileMenuBtn = this.querySelector('#mobile-menu-btn');
      const mobileMenu = this.querySelector('#mobile-menu');
      if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
          mobileMenu.classList.toggle('hidden');
        });
      }
    }, 0);
  }
}

customElements.define('site-header', SiteHeader);
