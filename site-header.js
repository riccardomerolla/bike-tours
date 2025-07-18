import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

class SiteHeader extends LitElement {

  // Use light DOM for Tailwind compatibility
  createRenderRoot() { return this; }

  static properties = {
    menuOpen: { type: Boolean }
  };

  constructor() {
    super();
    this.menuOpen = false;
  }

  _toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  render() {
    return html`
      <header class="bg-white border-b border-base-background-secondary sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16 lg:h-20">
            <a href="index.html" class="flex items-center h-12">
              <img src="img/logo.png" alt="BikeTours.cc" class="h-6 w-auto object-contain">
            </a>
            <button class="md:hidden p-2" @click=${() => this._toggleMenu()}>
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
          <div class="${this.menuOpen ? '' : 'hidden'} md:hidden pb-4">
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
}

customElements.define('site-header', SiteHeader);
