import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

/**
 * <tour-sidebar-section>
 * Displays the sidebar with price, next departure, distance, group size, rating, accommodation, transport, and calendar button.
 * Props:
 *   - tour: Tour object
 *   - nextDeparture: next available tour object (for next departure date)
 *   - onShowCalendar: function to call when calendar button is clicked
 */
export class TourSidebarSection extends LitElement {
  static properties = {
    tour: { type: Object },
    nextDeparture: { type: Object },
    onShowCalendar: { type: Function },
  };

  createRenderRoot() {
    // Render in light DOM for Tailwind compatibility
    return this;
  }

  _handleShowCalendar() {
    if (this.onShowCalendar && typeof this.onShowCalendar === 'function') {
      this.onShowCalendar(this.tour);
    } else if (window.showTourCalendarModal) {
      window.showTourCalendarModal(this.tour);
    }
  }

  _calculateDuration(startDateStr, endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    if (isNaN(startDate) || isNaN(endDate)) {
      return 'N/A';
    }
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const diffNights = diffDays > 0 ? diffDays - 1 : 0;
    return `${diffDays} days, ${diffNights} nights`;
  }

  _parsePriceToNumber(priceStr) {
    if (!priceStr) return null;
    return parseFloat(priceStr.replace(/[^0-9.,]/g, '').replace(',', '.'));
  }

  _formatNextDeparture(nextDeparture) {
    if (!nextDeparture || !nextDeparture.start_date) return 'No upcoming departures';
    const nextStartDate = new Date(nextDeparture.start_date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return nextStartDate.toLocaleDateString('en-US', options);
  }

  render() {
    const tour = this.tour || {};
    const nextDeparture = this.nextDeparture;
    const currentPrice = this._parsePriceToNumber(tour.price);
    const oldPrice = this._parsePriceToNumber(tour.old_price);
    let discountLabel = '';
    if (oldPrice && currentPrice && oldPrice > currentPrice) {
      const discountPercentage = ((oldPrice - currentPrice) / oldPrice) * 100;
      discountLabel = `Save ${Math.round(discountPercentage)}%`;
    }
    return html`
      <div class="border border-base-background-secondary bg-white p-8 sticky top-32 rounded">
        <div class="text-center mb-6">
          <p class="text-3xl lg:text-4xl font-light text-primary mb-2 tracking-wide">${tour.start_location || 'N/A'}</p>
          <p class="text-lg lg:text-xl font-light text-base-content-subtle">
            ${this._calculateDuration(tour.start_date, tour.end_date)}
          </p>
        </div>
        <div class="text-center mb-8">
          <span class="text-sm lg:text-base font-light text-gray-900">From</span>
          <span class="text-lg lg:text-xl font-light text-gray-900 line-through mr-2">
            ${oldPrice && currentPrice && oldPrice > currentPrice ? tour.old_price : ''}
          </span>
          <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
            ${discountLabel}
          </span>
          <span class="text-4xl lg:text-5xl font-light text-accent tracking-wide">
            ${tour.price || ''}
          </span>
        </div>
        <div class="space-y-6 mb-8">
          <div class="flex justify-between items-center py-4 border-b border-base-background-secondary">
            <strong class="text-primary font-normal">🗓️ Next Departure:</strong>
            <span class="text-base-content-subtle font-light">
              ${this._formatNextDeparture(nextDeparture)}
            </span>
          </div>
          <div class="flex justify-between items-center py-4 border-b border-base-background-secondary">
            <strong class="text-primary font-normal">🚲 Distance:</strong>
            <span class="text-base-content-subtle font-light">
              ${tour.total_distance_km ? `${tour.total_distance_km} km` : ''}
            </span>
          </div>
          <div class="flex justify-between items-center py-4 border-b border-base-background-secondary">
            <strong class="text-primary font-normal">👥 Group Size:</strong>
            <span class="text-base-content-subtle font-light">
              ${tour.group_size_max ? `Max ${tour.group_size_max}` : ''}
            </span>
          </div>
          <div class="flex justify-between items-center py-4 border-b border-base-background-secondary">
            <strong class="text-primary font-normal">💪 Physical Rating:</strong>
            <span class="text-base-content-subtle font-light">
              ${tour.physical_rating || ''}
            </span>
          </div>
          <div class="flex justify-between items-center py-4 border-b border-base-background-secondary">
            <strong class="text-primary font-normal">🏨 Accommodation:</strong>
            <span class="text-base-content-subtle font-light">
              ${tour.accommodation || ''}
            </span>
          </div>
          <div class="flex justify-between items-center py-4">
            <strong class="text-primary font-normal">🚐 Transport:</strong>
            <span class="text-base-content-subtle font-light text-accent">
              ${tour.transport || ''}
            </span>
          </div>
        </div>
        <button @click="${this._handleShowCalendar}" class="w-full bg-accent hover:bg-accent-dark text-base-content font-medium py-4 px-6 transition-colors duration-300 text-center block mb-4 uppercase tracking-wider text-sm rounded">
          Show Tour Calendar
        </button>
      </div>
    `;
  }
}

customElements.define('tour-sidebar-section', TourSidebarSection);
