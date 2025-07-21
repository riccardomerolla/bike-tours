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
              <img src="img/logo.webp" alt="BikeTours.cc" class="h-5 w-auto object-contain">
            </a>
            <button class="md:hidden p-2 z-60 relative" @click=${() => this._toggleMenu()}>
              <svg class="w-6 h-6 transition-transform duration-300 ${this.menuOpen ? 'rotate-45' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="${this.menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}"></path>
              </svg>
            </button>
            <nav class="hidden md:flex space-x-10">
              <a href="tours.html" class="text-primary hover:text-accent font-normal transition-colors uppercase tracking-wider text-sm">Tours</a>
              <a href="about.html" class="text-primary hover:text-accent font-normal transition-colors uppercase tracking-wider text-sm">About</a>
              <a href="contact.html" class="text-primary hover:text-accent font-normal transition-colors uppercase tracking-wider text-sm">Contact</a>
            </nav>
          </div>
        </div>

        <!-- Full-screen mobile menu overlay -->
        <div class="${this.menuOpen ? 'fixed' : 'hidden'} inset-0 z-50 md:hidden">
          <!-- Background overlay with image -->
          <div class="absolute inset-0 bg-black bg-opacity-90">
            <div class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30" 
                 style="background-image: url('img/Tuscany-2.webp');"></div>
          </div>
          
          <!-- Menu content -->
          <div class="relative flex flex-col justify-center items-center h-full px-8">
            <!-- Close button -->
            <button class="absolute top-6 right-6 p-2 text-white" @click=${() => this._toggleMenu()}>
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            <!-- Logo -->
            <div class="mb-16">
              <img src="img/logo.webp" alt="BikeTours.cc" class="h-4 w-auto object-contain filter brightness-0 invert">
            </div>
            
            <!-- Navigation links -->
            <nav class="flex flex-col items-center space-y-8">
              <a href="tours.html" 
                 class="text-white text-4xl font-light uppercase tracking-widest hover:text-accent transition-all duration-300 transform hover:scale-105"
                 @click=${() => this._toggleMenu()}>
                Tours
              </a>
              <a href="about.html" 
                 class="text-white text-4xl font-light uppercase tracking-widest hover:text-accent transition-all duration-300 transform hover:scale-105"
                 @click=${() => this._toggleMenu()}>
                About
              </a>
              <a href="contact.html" 
                 class="text-white text-4xl font-light uppercase tracking-widest hover:text-accent transition-all duration-300 transform hover:scale-105"
                 @click=${() => this._toggleMenu()}>
                Contact
              </a>
            </nav>
            
            <!-- Optional tagline or additional content -->
            <div class="mt-16 text-center">
              <p class="text-white text-lg font-light opacity-80 tracking-wide">
                
              </p>
            </div>
          </div>
        </div>
      </header>
    `;
  } 
}

customElements.define('site-header', SiteHeader);
