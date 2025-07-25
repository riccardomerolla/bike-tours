import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

/**
 * <tour-hero-section>
 * Props:
 *   tour (object): The tour data object (with .name, .image, .gallery_images, .description, .start_date, .end_date)
 *   allTours (array): All tours data (for gallery modal)
 *
 * Emits:
 *   'open-gallery' event with { tourId, allTours }
 */
export class TourHeroSection extends LitElement {
  static properties = {
    tour: { type: Object },
    allTours: { type: Array },
  };

  constructor() {
    super();
    this.tour = null;
    this.allTours = [];
  }

  createRenderRoot() { return this; }

  _handleOpenGallery() {
    this.dispatchEvent(new CustomEvent('open-gallery', {
      detail: { tourId: this.tour?.Id, allTours: this.allTours },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    if (!this.tour) return html``;
    let galleryImages = [];
    try {
      if (this.tour.gallery_images && typeof this.tour.gallery_images === 'string') {
        const parsed = JSON.parse(this.tour.gallery_images);
        if (Array.isArray(parsed)) galleryImages = parsed;
      } else if (Array.isArray(this.tour.gallery_images)) {
        galleryImages = this.tour.gallery_images;
      }
    } catch (e) {
      galleryImages = [];
    }
    const totalImagesCount = (this.tour.image ? 1 : 0) + galleryImages.length;
    return html`
      <section class="relative h-[60vh] md:h-[80vh] flex items-end overflow-hidden bg-base-background-secondary">
        <div class="absolute inset-0 w-full h-full">
          ${!galleryImages || galleryImages.length < 3 ? html`
            <img src="${this.tour.image || ''}" class="w-full h-full object-cover" alt="Tour hero image">
          ` : html`
            <div class="grid grid-cols-3 grid-rows-2 h-full gap-0.5">
              <img src="${this.tour.image || ''}" alt="Main tour image" class="col-span-2 row-span-2 w-full h-full object-cover">
              <img src="${galleryImages[0] || ''}" alt="Gallery image 1" class="col-span-1 row-span-1 w-full h-full object-cover">
              <img src="${galleryImages[1] || ''}" alt="Gallery image 2" class="col-span-1 row-span-1 w-full h-full object-cover">
            </div>
          `}
        </div>
        <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60"></div>
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 tracking-wide">${this.tour.name}</h1>
          <div class="flex flex-col md:flex-row md:items-center md:gap-8 text-white text-lg font-light">
            <span>${this.tour.description || ''}</span>
          </div>
          <div class="absolute bottom-6 right-6 z-20">
            <button @click="${this._handleOpenGallery}" class="bg-black/50 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-black/70 transition-colors">
              See all ${totalImagesCount} photos
            </button>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('tour-hero-section', TourHeroSection);
