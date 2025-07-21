import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

class MailingListSubscribe extends LitElement {
  static properties = {
    email: { state: true },
    status: { state: true },
    loading: { state: true }
  };

  constructor() {
    super();
    this.email = '';
    this.status = '';
    this.loading = false;
  }

  createRenderRoot() {
    return this;
  }

  handleInput(e) {
    this.email = e.target.value;
    this.status = '';
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.status = '';
    if (!this.validateEmail(this.email)) {
      this.status = 'Please enter a valid email address.';
      return;
    }
    this.loading = true;
    try {
      // Replace with your actual n8n webhook URL
      const webhookUrl = 'https://thankful-bass-lucky.ngrok-free.app/webhook/bc610588-b554-4ad9-8a91-7fb6ed950c9b';
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email })
      });
      if (res.ok) {
        this.status = 'Thank you for subscribing!';
        this.email = '';
      } else {
        this.status = 'Subscription failed. Please try again.';
      }
    } catch (err) {
      this.status = 'Subscription failed. Please try again.';
    }
    this.loading = false;
  }

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  render() {
    return html`
      <form class="flex w-full max-w-lg mx-auto" @submit=${this.handleSubmit}>
        <input
          type="email"
          .value=${this.email}
          @input=${this.handleInput}
          placeholder="Your email address"
          class="flex-grow p-3 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 font-light"
          required
        >
        <button
          type="submit"
          class="bg-accent hover:bg-accent-dark text-base-content font-medium py-3 px-6 transition-all duration-300 text-center uppercase tracking-wider text-sm rounded-r-md"
          ?disabled=${this.loading}
        >
          ${this.loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      ${this.status
        ? html`<p class="mt-4 text-xs text-green-400 font-light text-center">${this.status}</p>`
        : html`<p class="mt-4 text-xs text-gray-400 font-light text-center">Join our mailing list for the latest tours, pro tips, and exclusive deals.</p>`
      }
    `;
  }
}

customElements.define('mailing-list-subscribe', MailingListSubscribe);
