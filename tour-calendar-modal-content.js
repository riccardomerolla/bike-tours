// tour-calendar-modal-content.js
import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
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
    open: { type: Boolean, reflect: true },
    departures: { type: Array }, // Array of departure objects to display
    referenceTourName: { type: String },
    currentTourId: { type: Number },
    _groupedDepartures: { state: true }
  };

  constructor() {
    super();
    this.open = false;
    this.departures = [];
    this.referenceTourName = '';
    this.currentTourId = null;
    this._groupedDepartures = new Map();
  }

  closeModal() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  createRenderRoot() {
    return this; // Render to light DOM for easier styling with Tailwind
  }


  updated(changedProperties) {
    if (changedProperties.has('departures')) {
      this.groupDeparturesByMonth(this.departures || []);
    }
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
    if (!this.open) return html``;
    return html`
      <div class="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-2 sm:px-4">
        <div class="relative bg-white rounded-lg shadow-lg w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl p-2 sm:p-4 md:p-6 flex flex-col items-center">
          <button @click="${this.closeModal}" class="absolute top-2 right-2 text-2xl text-gray-500 hover:text-accent">&times;</button>
          <h3 class="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-primary text-center w-full">${this.referenceTourName ? this.referenceTourName + ' Calendar' : 'Tour Calendar'}</h3>
          <div class="w-full max-h-[70vh] overflow-y-auto">
            ${(!this.departures || this.departures.length === 0) ? html`
              <p class="text-base-content-subtle text-center">No upcoming departures available for this tour.</p>
            ` : html`
              <div class="space-y-4 sm:space-y-6">
                ${Array.from(this._groupedDepartures.keys()).map(monthKey => {
                  const monthData = this._groupedDepartures.get(monthKey);
                  return html`
                    <h4 class="text-base sm:text-xl font-medium text-primary mt-4 sm:mt-6 mb-2 sm:mb-4">${monthData.monthName.toUpperCase()}</h4>
                    <div class="space-y-3 sm:space-y-4">
                      ${monthData.departures.map(departure => html`
                        <div class="grid grid-cols-4 sm:grid-cols-12 items-start gap-2 sm:gap-4 p-2 sm:p-4 border border-base-background-secondary rounded-lg">
                            <div class="col-span-1 text-center pt-1">
                                <div class="text-primary font-bold">
                                    ${formatShortDate(departure.start_date)}
                                </div>
                            </div>
                            <div class="col-span-3 sm:col-span-5">
                                <p class="font-semibold text-primary mb-1 text-xs sm:text-base">${formatDateRange(departure.start_date, departure.end_date)}</p>
                                <div class="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                                    ${departure.label && !departure.sold_out ? html`
                                        <span class="bg-accent text-base-content text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 uppercase tracking-wider rounded">${departure.label}</span>
                                    ` : ''}
                                    ${departure.type === 'luxury' ? html`
                                        <span class="bg-white text-accent font-script text-sm sm:text-lg px-1.5 sm:px-2 py-0.5 rounded border border-gray-200">Luxury</span>
                                    ` : ''}
                                    ${departure.status ? html`
                                        <span class="text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ${departure.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}">
                                            ${departure.status}
                                        </span>
                                    ` : ''}
                                </div>
                            </div>
                            <div class="col-span-4 sm:col-span-3 text-right">
                                <span class="text-xs sm:text-sm lg:text-base font-medium text-base-content-subtle">TOTAL</span>
                                <span class="block text-base sm:text-xl lg:text-2xl font-bold text-accent">${departure.price || ''}</span>
                                ${departure.old_price && departure.price && parseFloat(departure.old_price.replace(/[^0-9.]/g, '')) > parseFloat(departure.price.replace(/[^0-9.]/g, '')) ? html`
                                    <div class="flex justify-end items-center gap-1 sm:gap-2">
                                        <span class="bg-green-100 text-green-800 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full">- ${Math.round(((parseFloat(departure.old_price.replace(/[^0-9.]/g, '')) - parseFloat(departure.price.replace(/[^0-9.]/g, ''))) / parseFloat(departure.old_price.replace(/[^0-9.]/g, ''))) * 100)}%</span>
                                        <span class="text-xs sm:text-sm font-light text-base-content-subtle line-through">${departure.old_price}</span>
                                    </div>
                                ` : ''}
                            </div>
                            <div class="col-span-4 sm:col-span-3 flex flex-col items-end mt-2 sm:mt-0">
                                ${departure.sold_out ? html`
                                    <button class="bg-gray-300 text-gray-600 font-medium py-1.5 sm:py-2 px-2 sm:px-4 rounded text-xs sm:text-sm uppercase w-full text-center" disabled>Sold Out</button>
                                ` : html`
                                    <a href="${departure.deposit_payment_link || '#'}" class="block w-full">
                                        <button class="bg-accent hover:bg-accent-dark text-base-content font-medium py-1.5 sm:py-2 px-2 sm:px-4 rounded text-xs sm:text-sm uppercase w-full text-center">Book with ${departure.deposit_amount || '€100'}</button>
                                    </a>
                                `}
                            </div>
                        </div>
                      `)}
                    </div>
                  `;
                })}
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('tour-calendar-modal-content', TourCalendarModalContent);