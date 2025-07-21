import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

class CustomTourSuggestion extends LitElement {

  static properties = {
    loading: { type: Boolean },
    error: { type: String },
    response: { type: Object },
  };

  constructor() {
    super();
    this.loading = false;
    this.error = "";
    this.response = null;
  }

  // Use light DOM for Tailwind compatibility
  createRenderRoot() { return this; }

  render() {
    return html`
      <div>
        ${!this.response ? html`
          <label for="tour-description" class="block text-sm font-light text-primary mb-4 uppercase tracking-widest">
            Describe your ideal cycling experience
          </label>
          <textarea id="tour-description" rows="6" class="w-full px-0 py-4 border-0 border-b border-gray-200 focus:ring-0 focus:border-accent transition-all duration-300 resize-none bg-transparent placeholder-gray-400 font-light" placeholder="e.g., A challenging week in the Swiss Alps, climbing legendary passes..."></textarea>
          <button @click="${this._submit}" ?disabled="${this.loading}" class="w-full bg-accent hover:bg-accent-dark text-base-content font-medium py-5 px-8 transition-all duration-300 uppercase tracking-wider text-sm">
            ${this.loading ? "Thinking..." : "✨ Create Custom Tour"}
          </button>
          ${this.error ? html`<div class="error">${this.error}</div>` : ""}
        ` : html`
          <div class="response">${this._renderResponse()}</div>
        `}
      </div>
    `;
  }

  async _submit() {
    this.error = "";
    this.response = null;
    const textarea = this.renderRoot.querySelector('#tour-description');
    const description = textarea.value.trim();
    if (!description) {
      this.error = "Please describe your ideal trip first!";
      return;
    }
    this.loading = true;
    try {
      const webhookUrl = "https://thankful-bass-lucky.ngrok-free.app/webhook/def13a95-66cb-450f-a255-40b1626972ab"; // Replace with your n8n webhook URL
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: description })
      });
      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }
      const data = await res.json();
      if (data.output.title && data.output.description) {
        this.response = { title: data.output.title, description: data.output.description };
      } else {
        this.error = "Sorry, we couldn't generate a suggestion at this time. Please try again.";
      }
    } catch (err) {
      this.error = `An error occurred: ${err.message}`;
    } finally {
      this.loading = false;
    }
  }

  _renderResponse() {
    // Render markdown as HTML (basic)
    const md = this.response.description
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
    return html`
      <h3 class="text-xl font-bold text-primary mb-3">${this.response.title}</h3>
      <div class="text-base-content-subtle mb-4" .innerHTML=${md}></div>
    `;
  }
}

customElements.define('custom-tour-suggestion', CustomTourSuggestion);
