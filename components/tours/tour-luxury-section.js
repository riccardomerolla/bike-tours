import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

/**
 * <tour-luxury-section>
 * Displays the luxury section for luxury tours, including accordion logic.
 * Props:
 *   - open: Boolean (optional, default false)
 */
export class TourLuxurySection extends LitElement {
  static properties = {
    open: { type: Boolean },
  };

  constructor() {
    super();
    this.open = false;
  }

  createRenderRoot() {
    // Render in light DOM for Tailwind compatibility
    return this;
  }

  toggleAccordion() {
    this.open = !this.open;
  }

  render() {
    return html`
      <div class="mb-12 border border-base-background-secondary rounded-lg">
        <div class="p-8">
          <p class="font-script text-accent text-3xl mb-2">Luxury</p>
          <h2 class="text-2xl font-light text-primary tracking-wide">This is a Luxury Tour</h2>
          <p class="text-base-content-subtle font-light mt-2 mb-6">A journey designed for maximum comfort, with selected facilities and unique experiences.</p>
          <div>
            <button @click="${this.toggleAccordion}" class="w-full flex justify-center items-center text-accent font-semibold hover:underline py-2">
              <span class="toggle-text">${this.open ? 'Less Details' : 'More Details'}</span>
              <span class="toggle-arrow ml-2">${this.open ? '↑' : '↓'}</span>
            </button>
          </div>
        </div>
        <div class="px-8 pb-8" style="${this.open ? 'display:block;max-height:9999px;' : 'display:none;max-height:0;'}">
          <div class="border-t border-base-background-secondary pt-6">
            <p class="text-base-content-subtle font-light leading-relaxed mb-6">
              Ride legendary roads by day, unwind in boutique 5-star hotels by night. Our Luxury Tours combine curated cycling routes, breathtaking landscapes, and refined hospitality.
            </p>
            <ul class="space-y-3 font-light text-base-content-subtle">
              <li class="flex items-start"><span class="text-accent mr-3 mt-1">✓</span><span><strong>Gourmet Dining:</strong> Savor exquisite meals that refuel your body and delight your senses.</span></li>
              <li class="flex items-start"><span class="text-accent mr-3 mt-1">✓</span><span><strong>5-Star Hotels:</strong> Relax and recover in handpicked, high-end accommodations.</span></li>
              <li class="flex items-start"><span class="text-accent mr-3 mt-1">✓</span><span><strong>Spa & Wellness:</strong> Enjoy access to relaxing spa moments to rejuvenate after a long day's ride.</span></li>
              <li class="flex items-start"><span class="text-accent mr-3 mt-1">✓</span><span><strong>Refined Hospitality:</strong> Experience premium service where every detail is taken care of.</span></li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('tour-luxury-section', TourLuxurySection);
