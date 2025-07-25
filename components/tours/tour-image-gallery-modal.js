import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

class TourImageGalleryModal extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    images: { type: Array },
    title: { type: String },
  };

  constructor() {
    super();
    this.open = false;
    this.images = [];
    this.title = 'Gallery';
  }

  updated(changedProperties) {
    if (changedProperties.has('open')) {
      document.body.style.overflow = this.open ? 'hidden' : '';
    }
  }


  closeModal() {
    this.open = false;
  }


  createRenderRoot() {
    return this;
  }

  render() {
    if (!this.open || !this.images || this.images.length === 0) {
      return html``;
    }

    // Structure images into rows: single, double, single, ...
    const structuredRows = [];
    let i = 0;
    while (i < this.images.length) {
      if (structuredRows.length % 2 === 0) {
        structuredRows.push({ type: 'single', images: [this.images[i]] });
        i++;
      } else {
        if (i + 1 < this.images.length) {
          structuredRows.push({ type: 'double', images: [this.images[i], this.images[i + 1]] });
          i += 2;
        } else {
          structuredRows.push({ type: 'single', images: [this.images[i]] });
          i++;
        }
      }
    }

    return html`
      <div class="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center transition-opacity duration-300 z-[99999]" @click="${this.closeModal}">
        <div class="bg-black text-white w-screen h-screen p-4 flex flex-col box-border" @click="${(e) => e.stopPropagation()}">
          <div class="flex justify-between items-center px-4 py-4 border-b border-gray-800 flex-shrink-0">
            <h3 class="text-2xl font-light m-0">${this.title}</h3>
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