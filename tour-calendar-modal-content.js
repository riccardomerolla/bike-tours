// tour-calendar-modal-content.js
import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { fetchCombinedToursData } from './tours-data.js';

// Re-use date formatting helper from tour-detail.html
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

// Helper for "19 JUL" format
function formatShortDate(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return html`<span class="block text-4xl font-light leading-none">${day}</span><span class="block text-sm font-medium tracking-wide">${month}</span>`;
}


class TourCalendarModalContent extends LitElement {
  static properties = {
    referenceTourName: { type: String },
    currentTourId: { type: Number },
    tours: { state: true }, // Filtered tours for this modal
    _groupedDepartures: { state: true } // Departures grouped by month
  };

  constructor() {
    super();
    this.referenceTourName = '';
    this.currentTourId = null;
    this.tours = [];
    this._groupedDepartures = new Map();
  }

  createRenderRoot() {
    return this; // Render to light DOM for easier styling with Tailwind
  }

  // When properties change, re-fetch and re-process data
  updated(changedProperties) {
    if (changedProperties.has('referenceTourName')) {
        console.log('TourCalendarModalContent: referenceTourName changed to', this.referenceTourName);
      this.fetchAndFilterDepartures();
    }
  }

  async fetchAndFilterDepartures() {
    if (!this.referenceTourName) {
      this.tours = [];
      this._groupedDepartures = new Map();
      return;
    }

    const allTours = await fetchCombinedToursData();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter relevant departures for this specific tour, including current/future and not sold out
    const relevantDepartures = allTours.filter(t =>
      t.name === this.referenceTourName &&
      new Date(t.start_date) >= today &&
      !t.sold_out
    ).sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    this.tours = relevantDepartures;
    this.groupDeparturesByMonth(relevantDepartures);
  }

  groupDeparturesByMonth(departures) {
    const grouped = new Map();
    departures.forEach(tour => {
      const startDate = new Date(tour.start_date);
      const yearMonth = `${startDate.getFullYear()}-${startDate.getMonth()}`; // Group by year and month
      const monthName = startDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

      if (!grouped.has(yearMonth)) {
        grouped.set(yearMonth, { monthName: monthName, departures: [] });
      }
      grouped.get(yearMonth).departures.push(tour);
    });
    this._groupedDepartures = grouped;
  }

  render() {
    if (this.tours.length === 0 && this.referenceTourName) {
      return html`<p class="text-base-content-subtle text-center">No upcoming departures available for this tour.</p>`;
    }
    if (!this.referenceTourName) { // Before data is set via property
        return html`<p class="text-base-content-subtle text-center">Loading departures...</p>`;
    }

    return html`
      <div class="space-y-6">
        ${Array.from(this._groupedDepartures.keys()).map(monthKey => {
          const monthData = this._groupedDepartures.get(monthKey);
          return html`
            <h4 class="text-xl font-medium text-primary mt-6 mb-4">${monthData.monthName.toUpperCase()}</h4>
            <div class="space-y-4">
              ${monthData.departures.map(departure => html`
                <div class="grid grid-cols-12 items-start gap-4 p-4 border border-base-background-secondary rounded-lg">
                    <div class="col-span-1 text-center pt-1">
                        <div class="text-primary font-bold">
                            ${formatShortDate(departure.start_date)}
                        </div>
                    </div>
                    
                    <div class="col-span-5">
                        <p class="font-semibold text-primary mb-1">${formatDateRange(departure.start_date, departure.end_date)}</p>
                        <div class="flex flex-wrap items-center gap-2 mb-2">
                            ${departure.label && !departure.sold_out ? html`
                                <span class="bg-accent text-base-content text-xs font-medium px-2 py-1 uppercase tracking-wider rounded">${departure.label}</span>
                            ` : ''}
                            ${departure.type === 'luxury' ? html`
                                <span class="bg-white text-accent font-script text-lg px-2 py-0.5 rounded border border-gray-200">Luxury</span>
                            ` : ''}
                            ${departure.status ? html`
                                <span class="text-xs font-medium px-2 py-1 rounded ${departure.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}">
                                    ${departure.status}
                                </span>
                            ` : ''}
                        </div>
                    </div>

                    <div class="col-span-3 text-right">
                        <span class="text-sm lg:text-base font-medium text-base-content-subtle">TOTAL</span>
                        <span class="block text-xl lg:text-2xl font-bold text-accent">${departure.price || ''}</span>
                        ${departure.old_price && departure.price && parseFloat(departure.old_price.replace(/[^0-9.]/g, '')) > parseFloat(departure.price.replace(/[^0-9.]/g, '')) ? html`
                            <div class="flex justify-end items-center gap-2">
                                <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">- ${Math.round(((parseFloat(departure.old_price.replace(/[^0-9.]/g, '')) - parseFloat(departure.price.replace(/[^0-9.]/g, ''))) / parseFloat(departure.old_price.replace(/[^0-9.]/g, ''))) * 100)}%</span>
                                <span class="text-sm font-light text-base-content-subtle line-through">${departure.old_price}</span>
                            </div>
                        ` : ''}
                    </div>

                    <div class="col-span-3 flex flex-col items-end">
                        ${departure.sold_out ? html`
                            <button class="bg-gray-300 text-gray-600 font-medium py-2 px-4 rounded text-sm uppercase w-full text-center" disabled>Sold Out</button>
                        ` : html`
                            <a href="${departure.deposit_payment_link || '#'}" class="block">
                                <button class="bg-accent hover:bg-accent-dark text-base-content font-medium py-2 px-4 rounded text-sm uppercase w-full text-center">Book with ${departure.deposit_amount || '€100'}</button>
                            </a>
                        `}
                    </div>
                </div>
              `)}
            </div>
          `;
        })}
      </div>
    `;
  }
}

customElements.define('tour-calendar-modal-content', TourCalendarModalContent);