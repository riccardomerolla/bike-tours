import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

/**
 * <tour-detail-app>
 * Main app shell for the tour detail page. Fetches all data and passes structured props to child custom elements.
 */

export class TourDetailApp extends LitElement {
  static properties = {
    tourId: { type: Number },
    allTours: { type: Array },
    tour: { type: Object },
    nextDeparture: { type: Object },
    highlightsHtml: { type: String },
    isLuxury: { type: Boolean },
    itinerary: { type: Array },
    calendarModalOpen: { type: Boolean },
    galleryModalOpen: { type: Boolean },
    galleryImages: { type: Array },
    galleryTitle: { type: String },
    calendarDepartures: { type: Array },
  };

  constructor() {
    super();
    this.tourId = null;
    this.allTours = [];
    this.tour = null;
    this.nextDeparture = null;
    this.highlightsHtml = '';
    this.isLuxury = false;
    this.itinerary = [];
    this.calendarModalOpen = false;
    this.galleryModalOpen = false;
    this.galleryImages = [];
    this.galleryTitle = '';
    this.calendarDepartures = [];
  }

  createRenderRoot() {
    // Render in light DOM for Tailwind compatibility
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    // Get tourId from URL
    const urlParams = new URLSearchParams(window.location.search);
    this.tourId = parseInt(urlParams.get('id'), 10);
    if (!this.tourId) return;
    // Fetch data
    const { fetchCombinedToursData } = await import('./tours-data.js');
    this.allTours = await fetchCombinedToursData();
    this.tour = this.allTours.find(t => t.Id === this.tourId);
    if (!this.tour) return;
    document.title = `Tour Details - ${this.tour.name}`;
    // Next available departure
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.nextDeparture = this.allTours.filter(t =>
      t.name === this.tour.name && new Date(t.start_date) >= today
    ).sort((a, b) => new Date(a.start_date) - new Date(b.start_date))[0] || null;
    // Highlights HTML
    this.highlightsHtml = this._markdownListToHtml(this.tour.trip_highlights);
    this.isLuxury = this.tour.type === 'luxury';
    this.itinerary = this.tour.itinerary || [];
    // Prepare departures for calendar modal
    this.calendarDepartures = this.allTours.filter(t =>
      t.name === this.tour.name && new Date(t.start_date) >= today && !t.sold_out
    ).sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    // Prepare gallery images for modal
    this.galleryImages = [this.tour.image, ...(this.tour.gallery_images || [])].filter(Boolean);
    this.galleryTitle = `${this.tour.name} Gallery`;
    // Set global for modal (legacy)
    window.currentTourData = this.tour;
    window.nextAvailableTourData = this.nextDeparture;
  }
  // --- MODAL CONTROL METHODS ---
  openCalendarModal() {
    this.calendarModalOpen = true;
    // Pass data to modal
    const modal = document.getElementById('calendar-modal');
    if (modal) {
      modal.departures = this.calendarDepartures;
      modal.referenceTourName = this.tour.name;
      modal.currentTourId = this.tour.Id;
      modal.open = true;
      // Listen for close event (only once per open)
      modal.addEventListener('close', this.closeCalendarModal.bind(this), { once: true });
    }
  }

  closeCalendarModal() {
    this.calendarModalOpen = false;
    const modal = document.getElementById('calendar-modal');
    if (modal) {
      modal.open = false;
      modal.departures = [];
    }
  }

  openGalleryModal() {
    this.galleryModalOpen = true;
    const modal = document.getElementById('gallery-modal');
    if (modal) {
      modal.images = this.galleryImages;
      modal.title = this.galleryTitle;
      modal.open = true;
    }
  }

  closeGalleryModal() {
    this.galleryModalOpen = false;
    const modal = document.getElementById('gallery-modal');
    if (modal) {
      modal.open = false;
      modal.images = [];
    }
  }

  _markdownListToHtml(text) {
    if (!text) return '';
    if (text.includes('<') && text.includes('>')) {
      return text.replace(/<li/g, '<li class="list-disc list-inside text-lg text-base-content-subtle mb-3 font-light"');
    } else {
      const lines = text.split('\n').filter(line => line.trim());
      const processedItems = lines.map(line => {
        let content = line.replace(/^\s*-\s*/, '').trim();
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return `<li class="list-disc list-inside text-lg text-base-content-subtle mb-3 font-light">${content}</li>`;
      });
      return '<ul>' + processedItems.join('') + '</ul>';
    }
  }

  firstUpdated() {
    // Sticky header logic using a dedicated sticky container
    this._stickyActive = false;
    this._onScroll = () => {
      const infoRow = this.querySelector('#main-info-row-section');
      const stickyHeader = this.querySelector('#sticky-header-container');
      if (!infoRow || !stickyHeader) return;
      const infoRowRect = infoRow.getBoundingClientRect();
      const headerHeight = 64; // Approximate site-header height in px
      if (infoRowRect.top <= headerHeight && !this._stickyActive) {
        stickyHeader.style.display = 'block';
        this._stickyActive = true;
      } else if (infoRowRect.top > headerHeight && this._stickyActive) {
        stickyHeader.style.display = 'none';
        this._stickyActive = false;
      }
    };
    window.addEventListener('scroll', this._onScroll);
    window.addEventListener('resize', this._onScroll);
    // Hide sticky header initially
    const stickyHeader = this.querySelector('#sticky-header-container');
    if (stickyHeader) stickyHeader.style.display = 'none';

    // Listen for open-gallery event from hero section
    this.addEventListener('open-gallery', () => {
      this.openGalleryModal();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this._onScroll);
    window.removeEventListener('resize', this._onScroll);
  }

  render() {
    if (!this.tour) {
      return html`
      <site-header></site-header>
      <div></div>
      <site-footer></site-footer>
      `;
    }
    return html`
      <site-header></site-header>
      <div id="sticky-header-container" style="position:fixed;top:0;left:0;right:0;z-index:50;display:none;background:white;box-shadow:0 2px 8px 0 rgba(0,0,0,0.04);">
        <tour-info-row-section .tour=${this.tour} .onShowCalendar=${() => this.openCalendarModal()} style="margin-bottom:0;"></tour-info-row-section>
      </div>
      <tour-hero-section .tour=${this.tour} .allTours=${this.allTours}></tour-hero-section>
      <tour-info-row-section id="main-info-row-section" .tour=${this.tour} .onShowCalendar=${() => this.openCalendarModal()}></tour-info-row-section>
      <section class="py-16 lg:py-24 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div class="lg:col-span-2">
              <h2 class="text-3xl lg:text-4xl font-light text-primary mb-6 tracking-wide">Why you'll love this trip</h2>
              <div id="trip-highlights" class="mb-12" .innerHTML=${this.highlightsHtml}></div>
              ${this.isLuxury ? html`
                <tour-luxury-section></tour-luxury-section>
              ` : ''}
              <h2 class="text-3xl lg:text-4xl font-light text-primary mb-6 tracking-wide">Itinerary</h2>
              <tour-itinerary .itinerary=${this.itinerary}></tour-itinerary>
            </div>
            <div class="lg:col-span-1">
              <tour-sidebar-section .tour=${this.tour} .nextDeparture=${this.nextDeparture} .onShowCalendar=${() => this.openCalendarModal()}></tour-sidebar-section>
            </div>
          </div>
        </div>
      </section>
      <similar-tours-section .tours=${this.allTours} .referenceTourName=${this.tour.name} .currentTourId=${this.tour.Id}></similar-tours-section>
      <site-footer></site-footer>
    `;
  }
}

customElements.define('tour-detail-app', TourDetailApp);
