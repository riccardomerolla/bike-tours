import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { renderElevationChart } from './elevation-chart.js';

class GpxElevationChart extends LitElement {
  static properties = {
    gpxUrl: { type: String, attribute: 'gpx-url' }
  };

  #chartInstance = null; 

  constructor() {
    super();
    this.chartId = `elevation-chart-${Math.random().toString(36).substr(2, 9)}`;
  }

  createRenderRoot() {
    return this;
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
    const canvas = this.shadowRoot ? this.shadowRoot.getElementById(this.chartId) : document.getElementById(this.chartId);

    if (this.gpxUrl && canvas && typeof Chart !== 'undefined') {
      if (this.#chartInstance) {
        this.#chartInstance.destroy();
        this.#chartInstance = null;
      }
      this.#chartInstance = await renderElevationChart(this.chartId, this.gpxUrl);
    }
  }

  render() {
    // Remove 'shadow' from the class list here
    return html`
      <canvas id="${this.chartId}" class="w-full h-40 bg-white rounded"></canvas>
    `;
  }
}

customElements.define('gpx-elevation-chart', GpxElevationChart);