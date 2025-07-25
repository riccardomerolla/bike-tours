import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { renderElevationChart } from './elevation-chart.js';

class GpxElevationChart extends LitElement {
  static properties = {
    gpxUrl: { type: String, attribute: 'gpx-url' },
    distanceTargetId: { type: String, attribute: 'data-distance-target' },
    gainTargetId: { type: String, attribute: 'data-gain-target' },
    maxEleTargetId: { type: String, attribute: 'data-max-ele-target' }
  };

  #chartInstance = null; 
  #chartRendered = false; // New flag to track if chart has been rendered

  constructor() {
    super();
    this.chartId = `elevation-chart-${Math.random().toString(36).substr(2, 9)}`;
  }

  createRenderRoot() {
    return this; // Render into the light DOM to update external elements
  }

  connectedCallback() {
    super.connectedCallback();
    // Chart.js script loading check
    if (typeof Chart === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => this.initializeChart(); // Call initializeChart once Chart.js is loaded
      document.head.appendChild(script);
    } else {
      this.initializeChart(); // Chart.js is already loaded, proceed
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.#chartInstance) {
      this.#chartInstance.destroy();
      this.#chartInstance = null;
    }
    this.#chartRendered = false; // Reset flag when component is removed from DOM
  }

  updated(changedProperties) {
    if (changedProperties.has('gpxUrl') && this.gpxUrl) {
      // If gpxUrl changes, force re-render, effectively resetting for a new chart
      this.#chartRendered = false; 
      if (this.#chartInstance) { // Destroy old chart if URL changes
        this.#chartInstance.destroy();
        this.#chartInstance = null;
      }
      this.initializeChart();
    }
  }

  async initializeChart() {
    await this.updateComplete; // Ensure component's own render is complete

    // Get the canvas element directly from the DOM, as we are rendering in light DOM
    const canvas = document.getElementById(this.chartId);

    // Only attempt to render if Chart.js is ready, canvas exists, and chart hasn't been rendered yet
    if (typeof Chart !== 'undefined' && canvas && this.gpxUrl && !this.#chartRendered) {
      // Check if the canvas has non-zero dimensions (meaning it's potentially visible)
      // This is a crucial check for lazy loading in hidden containers
      if (canvas.offsetWidth > 0 || canvas.offsetHeight > 0) { 
        if (this.#chartInstance) {
          this.#chartInstance.destroy();
          this.#chartInstance = null;
        }
        const chart = await renderElevationChart(this.chartId, this.gpxUrl);
        this.#chartInstance = chart; // Store the chart instance
        this.#chartRendered = true; // Mark as rendered

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
      } else {
        // If canvas is not visible (0 dimensions), don't render yet.
        // The redraw() method from the accordion will call initializeChart again when visible.
        console.log(`Canvas ${this.chartId} not visible, deferring chart render.`);
      }
    }
  }

  // Public method to trigger chart redraw (called by accordion when it opens)
  redraw() {
    this.initializeChart();
  }

  render() {
    return html`
      <canvas id="${this.chartId}" class="w-full h-40 bg-white rounded"></canvas>
    `;
  }
}

customElements.define('gpx-elevation-chart', GpxElevationChart);