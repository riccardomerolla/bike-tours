// bike-tours2/tour-itinerary.js
import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

class TourItinerary extends LitElement {
  static properties = {
    itinerary: { type: Array }
  };

  constructor() {
    super();
    this.itinerary = [];
  }

  createRenderRoot() {
    return this;
  }

  render() {
    if (!this.itinerary || this.itinerary.length === 0) {
      return html`<p>No itinerary details available for this tour.</p>`;
    }

    return html`
      <div class="space-y-6">
        ${this.itinerary.map(day => html`
          <div class="border border-base-background-secondary rounded-lg overflow-hidden">
            <div class="flex flex-col p-6 cursor-pointer bg-base-background-secondary hover:bg-base-background-secondary/70 transition-colors duration-200" onclick="toggleAccordion(this)">
                <h3 class="text-2xl font-light text-accent mb-2">Day ${day.day_number} • ${day.title}</h3>
                <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-primary text-sm">
                    <div class="flex items-center gap-2">
                        <span class="bg-accent-light p-2 rounded-full flex items-center justify-center w-8 h-8 text-lg">📏</span>
                        <div>
                            <span class="block uppercase text-xs font-medium text-base-content-subtle">Length</span>
                            <span class="block text-lg font-semibold" id="day${day.day_number}-distance"></span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="bg-accent-light p-2 rounded-full flex items-center justify-center w-8 h-8 text-lg">📈</span>
                        <div>
                            <span class="block uppercase text-xs font-medium text-base-content-subtle">D+</span>
                            <span class="block text-lg font-semibold" id="day${day.day_number}-gain"></span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="bg-accent-light p-2 rounded-full flex items-center justify-center w-8 h-8 text-lg">⛰️</span>
                        <div>
                            <span class="block uppercase text-xs font-medium text-base-content-subtle">Max. Elev.</span>
                            <span class="block text-lg font-semibold" id="day${day.day_number}-max-ele"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="accordion-content hidden p-6 pt-0 transition-all duration-300 ease-out" style="max-height: 0;">
                <div class="flex flex-col gap-8 mt-6">
                    <div>
                        <p class="text-base-content-subtle font-light">${day.description}</p>
                    </div>
                    <div class="mx-auto w-full lg:w-4/5 xl:w-3/4">
                        ${day.gpx_url ? html`
                          <gpx-elevation-chart 
                            gpx-url="${day.gpx_url}"
                            data-distance-target="day${day.day_number}-distance"
                            data-gain-target="day${day.day_number}-gain"
                            data-max-ele-target="day${day.day_number}-max-ele">
                          </gpx-elevation-chart>
                        ` : html`<p class="text-center text-base-content-subtle">No route map for this day.</p>`}
                    </div>
                </div>
            </div>
          </div>
        `)}
      </div>
    `;
  }
}

customElements.define('tour-itinerary', TourItinerary);