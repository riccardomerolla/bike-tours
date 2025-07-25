import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

/**
 * <tour-info-row-section>
 * Displays the info row with start location, duration, price, and calendar button for a tour.
 * Props:
 *   - tour: Tour object
 *   - onShowCalendar: function to call when calendar button is clicked
 */
export class TourInfoRowSection extends LitElement {
  static properties = {
    tour: { type: Object },
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

  render() {
    const tour = this.tour || {};
    const currentPrice = this._parsePriceToNumber(tour.price);
    const oldPrice = this._parsePriceToNumber(tour.old_price);
    let discountLabel = '';
    if (oldPrice && currentPrice && oldPrice > currentPrice) {
      const discountPercentage = ((oldPrice - currentPrice) / oldPrice) * 100;
      discountLabel = `Save ${Math.round(discountPercentage)}%`;
    }
    return html`
      <section class="bg-white py-8 border-b border-base-background-secondary">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div class="mb-4 md:mb-0 text-primary">
            <p class="text-xl font-light">${tour.start_location || 'N/A'}</p>
            <p class="text-base-content-subtle text-sm">
              ${this._calculateDuration(tour.start_date, tour.end_date)}
            </p>
          </div>
          <div class="text-center md:text-right">
            <span class="text-sm lg:text-base font-light text-gray-900">From</span>
            <span class="text-lg lg:text-xl font-light text-gray-900 line-through mr-2">
              ${oldPrice && currentPrice && oldPrice > currentPrice ? tour.old_price : ''}
            </span>
            <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
              ${discountLabel}
            </span>
            <span class="text-3xl lg:text-4xl font-light text-accent tracking-wide">
              ${tour.price || ''}
            </span>
          </div>
          <button @click="${this._handleShowCalendar}" class="mt-6 md:mt-0 bg-accent hover:bg-accent-dark text-base-content font-medium py-3 px-6 transition-all duration-300 text-center uppercase tracking-wider text-sm rounded">
            Show Departure Calendar
          </button>
        </div>
      </section>
    `;
  }
}

customElements.define('tour-info-row-section', TourInfoRowSection);
