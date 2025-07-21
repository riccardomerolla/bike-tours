import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { fetchToursData } from './tours-data.js';

// Date formatting helper function for full date range
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

// Date formatting helper function for left-aligned date (e.g., "18 JUL")
function formatLeftDate(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date)) return html``; // Return empty if date is invalid
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return html`<span class="block text-4xl lg:text-5xl font-light leading-none">${day}</span><span class="block text-sm font-medium tracking-wide">${month}</span>`;
}


class DeparturesSection extends LitElement {
  static properties = {
    tours: { state: true },
    type: { type: String, reflect: true }
  };

  constructor() {
    super();
    this.tours = [];
    this.type = null;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadTours();
  }

  async loadTours() {
    let filterParams = '';
    
    // Apply type filter if specified
    if (this.type) {
      // Case-insensitive filter for the type field
      filterParams = `where=(type,eq,${this.type.toLowerCase()})`;
    }
    
    this.tours = await fetchToursData(filterParams);
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
              <div class="bg-white border border-gray-100 p-6 lg:p-8 hover:shadow-lg transition-all duration-500 flex items-start gap-6">
                <div class="flex-shrink-0 text-center pt-2">
                    <div class="text-primary">
                        ${formatLeftDate(tour.start_date)}
                    </div>
                </div>

                <div class="flex-grow">
                  <h4 class="text-xl font-normal text-primary mb-2">${tour.name}</h4>
                  <p class="text-base font-normal text-base-content-subtle mb-3">${formatDateRange(tour.start_date, tour.end_date)}</p>
                  
                  <div class="flex flex-wrap items-center gap-2 mb-4">
                      ${tour.eta_group ? html`
                        <span class="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded">ETA ${tour.eta_group}</span>
                      ` : ''}
                      ${tour.type === 'luxury' ? html`
                        <span class="bg-white text-accent font-script text-lg px-2 py-0.5 rounded border border-gray-200">Luxury</span>
                      ` : ''}
                      ${tour.label && !tour.sold_out ? html`
                        <span class="bg-accent text-base-content text-xs font-medium px-2 py-1 uppercase tracking-wider">${tour.label}</span>
                      ` : ''}
                  </div>

                  ${tour.description ? html`<p class="text-sm text-base-content-subtle mb-4">${tour.description}</p>` : ''}
                </div>

                <div class="flex-shrink-0 flex flex-col items-end justify-between h-full pt-2">
                    <div class="flex items-baseline gap-2 mb-4">
                        <span class="text-sm lg:text-base font-light text-gray-900">From</span>
                        <span class="text-xl lg:text-2xl font-light text-gray-900">${tour.price}</span>
                    </div>
                    ${tour.sold_out ? html`
                        <button class="bg-gray-300 text-gray-600 font-medium py-3 px-6 text-center uppercase tracking-wider text-sm rounded cursor-not-allowed" disabled>Sold Out</button>
                    ` : html`
                        <a href="tour-detail.html?id=${tour.Id}" class="bg-accent hover:bg-accent-dark text-base-content font-medium py-3 px-6 transition-all duration-300 text-center uppercase tracking-wider text-sm rounded">
                        View Details
                        </a>
                    `}
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