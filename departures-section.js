import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { fetchToursData } from './tours-data.js';

class DeparturesSection extends LitElement {
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
      <section class="py-20 lg:py-32 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16 lg:mb-24">
            <h2 id="departures-title" class="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4 tracking-wide">ALL OUR DEPARTURES</h2>
            <div class="w-24 h-0.5 bg-celeste mx-auto"></div>
          </div>
          <div class="space-y-6 lg:space-y-8 max-w-4xl mx-auto">
            ${this.tours.map(tour => html`
              <div class="bg-white border border-gray-100 p-8 lg:p-12 hover:shadow-lg transition-all duration-500 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div class="flex-grow">
                  <h4 class="text-2xl lg:text-3xl font-light text-gray-900 mb-3 tracking-wide">${tour.name}</h4>
                  <p class="text-gray-600 font-light">${tour.date}</p>
                </div>
                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <span class="text-3xl lg:text-4xl font-light text-gray-900">${tour.price}</span>
                  <a href="#" class="bg-celeste hover:bg-celeste-dark text-black font-medium py-4 px-8 transition-all duration-300 text-center uppercase tracking-wider text-sm">
                    Book Now
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

customElements.define('departures-section', DeparturesSection);
