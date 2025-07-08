import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { renderElevationChart } from './elevation-chart.js';

class GpxElevationChart extends LitElement {
  static properties = {
    gpxUrl: { type: String, attribute: 'gpx-url' },
    // Add properties for summary data to allow external setting (though we'll set it internally)
    // We add data-* attributes to identify target elements in the parent HTML
    distanceTargetId: { type: String, attribute: 'data-distance-target' },
    gainTargetId: { type: String, attribute: 'data-gain-target' },
    maxEleTargetId: { type: String, attribute: 'data-max-ele-target' }
  };

  #chartInstance = null; 

  constructor() {
    super();
    this.chartId = `elevation-chart-${Math.random().toString(36).substr(2, 9)}`;
  }

  createRenderRoot() {
    return this; // Render into the light DOM to update external elements
  }

  connectedCallback() {
    super.connectedCallback();
    if (typeof Chart === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => this.initializeChart();
      document.head.appendChild(script);
    } else {
      this.initializeChart();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.#chartInstance) {
      this.#chartInstance.destroy();
      this.#chartInstance = null;
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('gpxUrl') && this.gpxUrl) {
      this.initializeChart(); 
    }
  }

  async initializeChart() {
    await this.updateComplete;
    // Get the canvas element directly from the DOM, as we are rendering in light DOM
    const canvas = document.getElementById(this.chartId);

    if (this.gpxUrl && canvas && typeof Chart !== 'undefined') {
      if (this.#chartInstance) {
        this.#chartInstance.destroy();
        this.#chartInstance = null;
      }
      const chart = await renderElevationChart(this.chartId, this.gpxUrl);
      this.#chartInstance = chart; // Store the chart instance

      // Update the content of the target elements in the parent HTML
      if (chart.summaryData) {
        if (this.distanceTargetId) {
          const el = document.getElementById(this.distanceTargetId);
          if (el) el.textContent = `${chart.summaryData.totalDistance} km`;
        }
        if (this.gainTargetId) {
          const el = document.getElementById(this.gainTargetId);
          if (el) el.textContent = `${chart.summaryData.totalElevationGain} m↑`;
        }
        if (this.maxEleTargetId) {
          const el = document.getElementById(this.maxEleTargetId);
          if (el) el.textContent = `${chart.summaryData.maxElevation} m`;
        }
      }
    }
  }

  render() {
    // The canvas is rendered here. The summary icons are now in the parent HTML.
    return html`
      <canvas id="${this.chartId}" class="w-full h-40 bg-white rounded"></canvas>
    `;
  }
}

customElements.define('gpx-elevation-chart', GpxElevationChart);