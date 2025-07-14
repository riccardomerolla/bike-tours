// bike-tours2/tours-section.js
import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { fetchToursData } from './tours-data.js';

class ToursSection extends LitElement {
  static properties = {
    tours: { state: true },
    currentIndex: { state: true },
    visibleCards: { state: true }
  };

  constructor() {
    super();
    this.tours = [];
    this.currentIndex = 0;
    this.visibleCards = this.getVisibleCards();
    this.handleResize = this.handleResize.bind(this);
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchTours();
    window.addEventListener('resize', this.handleResize);
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.handleResize);
    super.disconnectedCallback();
  }

  handleResize() {
    const newVisible = this.getVisibleCards();
    if (newVisible !== this.visibleCards) {
      this.visibleCards = newVisible;
      this.currentIndex = 0;
    }
  }

  getVisibleCards() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  next() {
    if (this.currentIndex < this.tours.length - this.visibleCards) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  async fetchTours() {
    this.tours = await fetchToursData();
  }

  render() {
    const start = this.currentIndex;
    const end = start + this.visibleCards;
    const visibleTours = this.tours.slice(start, end);
    return html`
      <section id="tours" class="py-20 lg:py-32 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16 lg:mb-24">
            <h2 class="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4 tracking-wide">UPCOMING TOURS</h2>
            <div class="w-24 h-0.5 bg-celeste mx-auto"></div>
          </div>
          <div class="relative">
            <div class="overflow-hidden">
              <div class="flex gap-6 lg:gap-8 transition-transform duration-500 ease-in-out mb-3">
                ${visibleTours.length === 0
                  ? html`<p>Loading tours...</p>`
                  : visibleTours.map(tour => html`
                    <div class="flex-none w-full md:w-48 lg:w-96">
                      <div class="bg-white border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-500 group">
                        <div class="relative h-80 lg:h-96 overflow-hidden">
                          ${tour.label && !tour.sold_out ? html`
                            <div class="absolute top-4 left-4 bg-celeste text-black text-xs font-medium px-3 py-1 uppercase tracking-wider z-10">
                              ${tour.label}
                            </div>
                          ` : ''}
                          ${tour.sold_out ? html`
                            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                              <span class="text-white text-xl lg:text-2xl font-light uppercase tracking-widest">Sold Out</span>
                            </div>
                          ` : ''}
                          <img src="${tour.image}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="${tour.name}">
                          ${tour.type === 'luxury' ? html`
                            <span class="absolute top-4 right-4 bg-accent text-black font-script text-lg px-4 py-1 z-10">Luxury</span>
                          ` : ''}
                        </div>
                        <div class="p-8">
                          <div class="text-xs text-gray-500 font-medium mb-3 uppercase tracking-widest">${tour.description}</div>
                          <h3 class="text-2xl lg:text-3xl font-light text-gray-900 mb-6 tracking-wide">${tour.name}</h3>
                          <div class="flex justify-between items-center text-sm text-gray-600 mb-8">
                            <span class="font-light">${tour.date}</span>
                            <div class="flex items-center">
                              <span class="text-celeste">★</span>
                              <span class="ml-1 font-light">${tour.rating}</span>
                            </div>
                          </div>
                          <div class="flex items-baseline gap-3 mb-8">
                            <span class="text-3xl lg:text-4xl font-light text-gray-900">${tour.price}</span>
                            ${tour.old_price ? html`<span class="text-gray-400 line-through font-light">${tour.old_price}</span>` : ''}
                            ${tour.discount ? html`<span class="bg-celeste text-black text-xs font-medium px-2 py-1 uppercase tracking-wider">${tour.discount}</span>` : ''}
                          </div>
                          ${tour.sold_out
                            ? html`<a class="w-full border border-gray-300 text-gray-400 font-medium py-4 px-6 text-center block uppercase tracking-wider text-sm cursor-not-allowed">Sold Out</a>`
                            : html`<a href="tour-detail.html" class="w-full border border-black hover:bg-black hover:text-white text-black font-medium py-4 px-6 transition-all duration-300 text-center block uppercase tracking-wider text-sm">View Details</a>`
                          }
                        </div>
                      </div>
                    </div>
                  `)
                }
              </div>
              <button @click="${() => this.prev()}" ?disabled="${this.currentIndex === 0}"
                class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hidden lg:block">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button @click="${() => this.next()}" ?disabled="${this.currentIndex >= this.tours.length - this.visibleCards}"
                class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hidden lg:block">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
            <div class="text-center mt-16">
              <a href="tours.html" class="inline-block border border-black text-black hover:bg-black hover:text-white font-medium py-4 px-8 uppercase tracking-wider text-sm transition-all duration-300">
                View All Tours
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('tours-section', ToursSection);