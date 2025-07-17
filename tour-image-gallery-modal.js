import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

class TourImageGalleryModal extends LitElement {
  static properties = {
    tourId: { type: Number },
    isOpen: { type: Boolean, reflect: true },
    allToursData: { type: Array },
    _images: { state: true },
    _tourName: { state: true }
  };

  constructor() {
    super();
    this.tourId = null;
    this.isOpen = false;
    this.allToursData = [];
    this._images = [];
    this._tourName = '';
  }

  createRenderRoot() {
    return this; // Render into the light DOM
  }

  updated(changedProperties) {
    if (changedProperties.has('isOpen')) {
      document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }

    if ((changedProperties.has('tourId') || changedProperties.has('allToursData')) && this.tourId !== null && this.allToursData.length > 0) {
        this.processTourData();
    } else if (changedProperties.has('isOpen') && this.isOpen && this.tourId !== null && this.allToursData.length > 0 && this._images.length === 0) {
        this.processTourData();
    }
  }

  processTourData() {
    if (this.tourId === null || this.allToursData.length === 0) {
      this._images = [];
      this._tourName = '';
      console.log('Tour data or ID not available for gallery modal.');
      return;
    }

    const tour = this.allToursData.find(t => t.Id === this.tourId);

    if (tour) {
      this._tourName = tour.name;
      let collectedImages = [];
      if (tour.image) {
        collectedImages.push(tour.image);
      }
      try {
        if (tour.gallery_images) {
          let parsedGalleryImages = [];
          if (typeof tour.gallery_images === 'string') {
              parsedGalleryImages = JSON.parse(tour.gallery_images);
          } else if (Array.isArray(tour.gallery_images)) {
              parsedGalleryImages = tour.gallery_images;
          }
          if (Array.isArray(parsedGalleryImages)) {
            collectedImages = collectedImages.concat(parsedGalleryImages);
          }
        }
      } catch (e) {
        console.error("Error parsing gallery_images in modal:", e);
      }
      this._images = collectedImages;
      console.log(`Gallery modal: Processed ${this._images.length} images for tour ${this._tourName}.`);
    } else {
      this._images = [];
      this._tourName = 'Tour not found';
      console.warn(`Gallery modal: Tour with ID ${this.tourId} not found in allToursData.`);
    }
  }

  closeModal() {
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('close-gallery-modal', { bubbles: true, composed: true }));
    console.log('Gallery modal closed.');
  }

  render() {
    // Corrected logic for grouping images for odd/even rows.
    const structuredRows = [];
    let i = 0;
    while (i < this._images.length) {
        // Odd row: 1 picture (Row 1, 3, 5...)
        // This means the first row, third, fifth, etc.
        if (structuredRows.length % 2 === 0) { // If it's the 0th, 2nd, 4th logical row etc.
            structuredRows.push({ type: 'single', images: [this._images[i]] });
            i++;
        } 
        // Even row: 2 pictures (Row 2, 4, 6...)
        // This means the 1st, 3rd, 5th logical row etc.
        else {
            if (i + 1 < this._images.length) { // Check if there are at least two images left
                structuredRows.push({ type: 'double', images: [this._images[i], this._images[i+1]] });
                i += 2;
            } else { // If only one image left, make it a single row
                structuredRows.push({ type: 'single', images: [this._images[i]] });
                i++;
            }
        }
    }

    return html`
      <div 
        class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center transition-opacity duration-300 ${this.isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} z-[99999]" 
        @click="${this.closeModal}"
      >
        <div class="bg-black text-white w-screen h-screen p-4 flex flex-col box-border" @click="${(e) => e.stopPropagation()}">
          <div class="flex justify-between items-center px-4 py-4 border-b border-gray-800 flex-shrink-0">
            <h3 class="text-2xl font-light m-0">${this._tourName} Gallery</h3>
            <button @click="${this.closeModal}" class="bg-transparent border-none text-white text-4xl cursor-pointer p-2 leading-none">X</button>
          </div>
          <div class="flex-grow overflow-y-auto py-4 mt-4">
            ${this._images.length > 0
              ? structuredRows.map(row => html`
                  <div class="grid gap-2 mb-2 px-4 md:gap-4 md:mb-4 md:px-8 
                    ${row.type === 'single' ? 'grid-cols-1' : 'grid-cols-2'}">
                    ${row.images.map(image => html`
                      <img src="${image}" alt="Gallery Image" class="w-full h-[400px] object-cover rounded-md">
                    `)}
                  </div>
                `)
              : html`<p class="text-white text-center p-4">No images available for this tour.</p>`
            }
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('tour-image-gallery-modal', TourImageGalleryModal);