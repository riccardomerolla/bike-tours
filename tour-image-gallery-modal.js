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
    // We'll group images into "rows" dynamically to apply odd/even row styling
    const rows = [];
    for (let i = 0; i < this._images.length; i++) {
        if (i % 2 === 0) { // Start of an "odd" row (single picture) or first of "even" row (two pictures)
            rows.push({ type: 'single', images: [this._images[i]] });
        } else { // Second picture of an "even" row (two pictures)
            // Check if the previous row was a 'single' type (which means current image is part of next pair)
            // If the current row is the first image in an 'odd' index pair (i.e. if the previous index i-1 was an odd image)
            // then current image is the second in a pair.
            if (rows.length > 0 && rows[rows.length - 1].type === 'single') {
                 // This means the previous push was a single image row, so this image is a new single row.
                 rows.push({ type: 'single', images: [this._images[i]] });
            } else if (rows.length > 0 && rows[rows.length - 1].images.length === 1 && (i - 1) % 2 === 0) {
                // This means the previous item was the first of a pair, so add this to it
                rows[rows.length - 1].type = 'double';
                rows[rows.length - 1].images.push(this._images[i]);
            } else {
                // Default to single if logic is unexpected, or explicitly start a new single row
                 rows.push({ type: 'single', images: [this._images[i]] });
            }
        }
    }

    // Corrected logic for grouping images for odd/even rows.
    // Let's create actual rows of images.
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
      <style>
        .modal-overlay-base {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .modal-content-base {
          background-color: black;
          color: white;
          width: 100vw;
          height: 100vh;
          border-radius: 0;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            flex-shrink: 0;
        }

        .modal-header h3 {
            font-size: 1.5rem;
            font-weight: 300;
            margin: 0;
        }

        .modal-header button {
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            padding: 0.5rem;
            line-height: 1;
        }

        .image-grid-container {
            flex-grow: 1;
            overflow-y: auto;
            padding: 1rem 0;
            margin-top: 1rem;
        }

        /* --- New/Updated Grid Styles --- */
        .image-row {
            display: grid;
            gap: 0.5rem; /* Gap between images in a row */
            margin-bottom: 0.5rem; /* Gap between rows */
            padding: 0 1rem; /* Horizontal padding for the rows */
        }

        .image-row img {
            width: 100%;
            height: 400px; /* Fixed height for all images as requested */
            object-fit: cover;
            border-radius: 0.25rem;
        }

        .image-row.single-picture {
            grid-template-columns: 1fr; /* One column for single picture rows */
        }

        .image-row.two-pictures {
            grid-template-columns: repeat(2, 1fr); /* Two columns for two picture rows */
        }

        /* Medium screens and up for larger gaps/padding */
        @media (min-width: 768px) {
            .image-row {
                gap: 1rem;
                margin-bottom: 1rem;
                padding: 0 2rem;
            }
        }
        /* --- End New/Updated Grid Styles --- */
      </style>

      <div 
        class="modal-overlay-base" 
        style="
          ${this.isOpen ? 'display: flex !important; opacity: 1 !important; visibility: visible !important;' : 'display: none !important; opacity: 0 !important; visibility: hidden !important;'} 
          z-index: 99999 !important; /* Extremely high z-index */
        " 
        @click="${this.closeModal}"
      >
        <div class="modal-content-base" @click="${(e) => e.stopPropagation()}">
          <div class="modal-header">
            <h3>${this._tourName} Gallery</h3>
            <button @click="${this.closeModal}">X</button>
          </div>
          <div class="image-grid-container">
            ${this._images.length > 0
              ? structuredRows.map(row => html`
                  <div class="image-row ${row.type === 'single' ? 'single-picture' : 'two-pictures'}">
                    ${row.images.map(image => html`
                      <img src="${image}" alt="Gallery Image">
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