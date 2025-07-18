import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

// Can:
// 1. Fetching images for a tour (like it does now on the tour detail page).
// or
// 2. Receiving a direct list of images (for the bike fitting page).
class TourImageGalleryModal extends LitElement {
  // --- PROPERTIES ---
  static properties = {
    isOpen: { type: Boolean, reflect: true },
    allToursData: { type: Array },
    tourId: { type: Number },
    images: { type: Array },
    _galleryImages: { state: true },
    _galleryTitle: { state: true },
  };

  // --- CONSTRUCTOR ---
  constructor() {
    super();
    this.isOpen = false;
    this.allToursData = [];
    this.images = [];
    this._galleryImages = [];
    this._galleryTitle = 'Gallery';
  }

  // --- LIFECYCLE HOOK ---
  updated(changedProperties) {
    if (changedProperties.has('isOpen') && this.isOpen) {
      document.body.style.overflow = 'hidden';
      this.processData();
    } else if (changedProperties.has('isOpen') && !this.isOpen) {
      document.body.style.overflow = '';
    }
  }

  // --- DATA PROCESSING ---
  processData() {
    if (this.images && this.images.length > 0) {
      this._galleryImages = this.images;
      this._galleryTitle = 'Bike Fitting Gallery';
      return;
    }

    if (this.tourId !== null && this.allToursData && this.allToursData.length > 0) {
      const tour = this.allToursData.find(t => t.Id === this.tourId);
      if (tour) {
        this._galleryTitle = `${tour.name} Gallery`;
        const collectedImages = [tour.image, ...(tour.gallery_images || [])].filter(Boolean);
        this._galleryImages = collectedImages;
      } else {
        this._galleryTitle = 'Tour Not Found';
        this._galleryImages = [];
      }
      return;
    }
    this._galleryImages = [];
  }

  // --- ACTIONS ---
  closeModal() {
    this.isOpen = false;
  }

  // --- RENDER ---
  createRenderRoot() {
    return this;
  }

  render() {
    if (!this.isOpen || !this._galleryImages || this._galleryImages.length === 0) {
      return html``;
    }

    const structuredRows = [];
    let i = 0;
    while (i < this._galleryImages.length) {
      if (structuredRows.length % 2 === 0) {
        structuredRows.push({ type: 'single', images: [this._galleryImages[i]] });
        i++;
      } else {
        if (i + 1 < this._galleryImages.length) {
          structuredRows.push({ type: 'double', images: [this._galleryImages[i], this._galleryImages[i + 1]] });
          i += 2;
        } else {
          structuredRows.push({ type: 'single', images: [this._galleryImages[i]] });
          i++;
        }
      }
    }

    return html`
      <div class="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center transition-opacity duration-300 z-[99999]" @click="${this.closeModal}">
        <div class="bg-black text-white w-screen h-screen p-4 flex flex-col box-border" @click="${(e) => e.stopPropagation()}">
          <div class="flex justify-between items-center px-4 py-4 border-b border-gray-800 flex-shrink-0">
            <h3 class="text-2xl font-light m-0">${this._galleryTitle}</h3>
            <button @click="${this.closeModal}" class="bg-transparent border-none text-white text-4xl cursor-pointer p-2 leading-none">×</button>
          </div>
          <div class="flex-grow overflow-y-auto py-4 mt-4">
            ${structuredRows.map(row => html`
              <div class="grid gap-2 mb-2 px-4 md:gap-4 md:mb-4 md:px-8 ${row.type === 'single' ? 'grid-cols-1' : 'grid-cols-2'}">
                ${row.images.map(image => html`
                  <div class="overflow-hidden rounded-md">
                    <img src="${image}" alt="Gallery Image" class="w-full h-96 object-cover transition-transform duration-500 hover:scale-105">
                  </div>
                `)}
              </div>
            `)}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('tour-image-gallery-modal', TourImageGalleryModal);