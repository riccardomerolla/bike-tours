// bike-tours2/tours-grid.js
import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { fetchToursData } from './tours-data.js';

class ToursGrid extends LitElement {
  static properties = {
    tours: { state: true }
  };

  constructor() {
    super();
    this.tours = [];
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadTours();
  }

  async loadTours() {
    this.tours = await fetchToursData();
  }

  render() {
    return html`
      <section class="py-20 lg:py-32 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            ${this.tours.map(tour => html`
              <div class="bg-white border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-500 group">
                <div class="relative h-80 lg:h-96 overflow-hidden">
                  <img src="${tour.image}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="${tour.name}">
                  ${tour.type === 'luxury' ? html`
                    <span class="absolute top-4 right-4 text-accent font-script text-2xl px-2 z-10">Luxury</span>
                  ` : ''}
                </div>
                <div class="p-8">
                  <div class="text-xs text-gray-500 font-medium mb-3 uppercase tracking-widest">${tour.description}</div>
                  <h3 class="text-2xl lg:text-3xl font-light text-gray-900 mb-6 tracking-wide">${tour.name}</h3>
                  <div class="text-sm text-gray-600 mb-8 font-light">${tour.duration || ''}</div>
                  <div class="flex items-baseline gap-3 mb-8">
                    <span class="text-3xl lg:text-4xl font-light text-gray-900">${tour.price}</span>
                  </div>
                  <a href="tour-detail.html" class="w-full border border-celeste hover:bg-celeste hover:text-white text-celeste font-normal py-4 px-6 transition-all duration-300 text-center block uppercase tracking-wider text-sm">
                    View Details
                  </a>
                </div>
              </div>
            `)}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('tours-grid', ToursGrid);