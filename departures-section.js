import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { fetchToursData } from './tours-data.js';

// Date formatting helper function (copied for self-containment)
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
                  <p class="text-gray-600 font-medium text-lg mb-2">${formatDateRange(tour.start_date, tour.end_date)}</p>
                  ${tour.description ? html`<p class="text-sm text-gray-500">${tour.description}</p>` : ''}
                </div>
                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div class="flex items-baseline gap-2">
                        <span class="text-sm lg:text-base font-light text-gray-900">From</span>
                        <span class="text-xl lg:text-2xl font-light text-gray-900">${tour.price}</span>
                    </div>
                    ${tour.sold_out ? html`
                        <button class="bg-gray-300 text-gray-600 font-medium py-3 px-6 text-center uppercase tracking-wider text-sm rounded cursor-not-allowed" disabled>Sold Out</button>
                    ` : html`
                        <a href="tour-detail.html?id=${tour.Id}" class="bg-accent hover:bg-accent-dark text-black font-medium py-3 px-6 transition-all duration-300 text-center uppercase tracking-wider text-sm rounded">
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