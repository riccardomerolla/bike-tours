import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

class SiteFooter extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <footer class="bg-[#1A1A1A] text-gray-200 py-20 lg:py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-5 items-center gap-8 mb-16">
            <a href="index.html" class="flex items-center justify-center md:justify-start md:col-span-1">
              <img src="img/logo-white.webp" alt="BikeTours.cc Logo" class="h-6 w-auto object-contain">
            </a>
            <div class="w-full mx-auto text-center md:col-span-3">
              <mailing-list-subscribe></mailing-list-subscribe>
            </div>
            <div class="flex items-center justify-center md:justify-end gap-5 md:col-span-1">
              <a href="#" class="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            <div>
              <h3 class="text-sm font-light mb-6 uppercase tracking-widest text-white">Destinations</h3>
              <ul class="space-y-4">
                <li><a href="tours.html?destination=mallorca" class="text-gray-400 hover:text-white transition-colors font-light">Our tours in Mallorca</a></li>
                <li><a href="tours.html?destination=italy" class="text-gray-400 hover:text-white transition-colors font-light">Our tours in Italy</a></li>
                <li><a href="tours.html?destination=switzerland" class="text-gray-400 hover:text-white transition-colors font-light">Our tours in Switzerland</a></li>
              </ul>
            </div>
            <div>
              <h3 class="text-sm font-light mb-6 uppercase tracking-widest text-white">BikeTours.cc Experience</h3>
              <ul class="space-y-4">
                  <li><a href="our-bikes.html" class="text-gray-400 hover:text-white transition-colors font-light">Our Bikes</a></li>
                  <li><a href="bike-fitting.html" class="text-gray-400 hover:text-white transition-colors font-light">Professional Bike Fitting</a></li>
                  <li><a href="luxury-tours.html" class="text-gray-400 hover:text-white transition-colors font-light">Luxury Tours</a></li>
              </ul>
            </div>
            <div>
              <h3 class="text-sm font-light mb-6 uppercase tracking-widest text-white">Useful Info</h3>
              <ul class="space-y-4">
                <li><a href="contact.html" class="text-gray-400 hover:text-white transition-colors font-light">Contacts</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white transition-colors font-light">FAQ</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white transition-colors font-light">Terms & Conditions</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white transition-colors font-light">General Conditions</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white transition-colors font-light">Privacy Policy</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white transition-colors font-light">Cancellation Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 class="text-sm font-light mb-6 uppercase tracking-widest text-white">Community & Social</h3>
              <ul class="space-y-4">
                <li><a href="#" class="text-gray-400 hover:text-white transition-colors font-light">Strava</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white transition-colors font-light">Instagram</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white transition-colors font-light">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div class="border-t border-gray-800 mt-16 pt-8 text-center text-gray-500 font-light text-sm">
            <p>&copy; 2025 BikeTours.cc All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('site-footer', SiteFooter);