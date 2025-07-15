import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { fetchToursData } from './tours-data.js';

// Date formatting helper function (copied for self-containment, could be a shared utility)
function formatDateRange(startDateStr, endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate) || isNaN(endDate)) {
        return `${startDateStr} - ${endDateStr}`;
    }

    const startMonth = startDate.toLocaleString('en-US', { month: 'long' });
    const endMonth = endDate.toLocaleString('en-US', { month: 'long' });
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    if (startMonth === endMonth && startYear === endYear) {
        return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
    } else {
        return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${endYear}`;
    }
}

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
                  ${tour.sold_out ? html`
                    <div class="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20">
                      <span class="text-white text-3xl lg:text-4xl font-light uppercase tracking-widest">SOLD OUT</span>
                    </div>
                  ` : ''}
                  ${tour.label && !tour.sold_out ? html`
                    <div class="absolute top-4 right-4 bg-accent text-black text-xs font-medium px-3 py-1 uppercase tracking-wider z-10">
                      ${tour.label}
                    </div>
                  ` : ''}
                  ${tour.type === 'luxury' ? html`
                    <div class="absolute top-4 left-4 bg-white text-accent font-script text-lg px-2 py-0.5 rounded z-10">
                        Luxury
                    </div>
                  ` : ''}
                  <img src="${tour.image}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="${tour.name}">

                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-all duration-500 z-10"></div>
                  <div class="absolute bottom-6 left-6 text-white z-10">
                      <h3 class="text-3xl lg:text-4xl font-light tracking-wider mb-2">${tour.name}</h3>
                      <div class="w-16 h-0.5 bg-accent transition-all duration-500 group-hover:w-24"></div>
                  </div>
                </div>
                <div class="p-6">
                    <p class="text-gray-600 font-medium mb-4 text-lg">${formatDateRange(tour.start_date, tour.end_date)}</p>
                    <div class="text-xs text-gray-500 font-medium mb-3 uppercase tracking-widest">${tour.description}</div>
                    <div class="flex justify-between items-center text-sm text-gray-600 mb-6">
                        </div>
                    <div class="flex items-center justify-between mt-6">
                        <div class="flex items-baseline gap-2">
                            <span class="text-sm lg:text-base font-light text-gray-900">From</span>
                            <span class="text-xl lg:text-2xl font-light text-gray-900">${tour.price || ''}</span>
                        </div>
                        ${tour.sold_out
                            ? html`<button class="bg-gray-300 text-gray-600 font-medium py-3 px-6 text-center uppercase tracking-wider text-sm rounded cursor-not-allowed" disabled>Sold Out</button>`
                            : html`<a href="tour-detail.html?id=${tour.Id}" class="bg-accent hover:bg-accent-dark text-black font-medium py-3 px-6 transition-all duration-300 text-center uppercase tracking-wider text-sm rounded">View Details</a>`
                        }
                    </div>
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