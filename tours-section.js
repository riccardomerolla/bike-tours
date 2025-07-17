import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { fetchToursData } from './tours-data.js';

// Date formatting helper function
function formatDateRange(startDateStr, endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Fallback for invalid dates
    if (isNaN(startDate) || isNaN(endDate)) {
        return `${startDateStr} - ${endDateStr}`;
    }

    const startMonth = startDate.toLocaleString('en-US', { month: 'long' });
    const endMonth = endDate.toLocaleString('en-US', { month: 'long' });
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    if (startMonth === endMonth && startYear === endYear) {
        return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
    } else {
        return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${endYear}`;
    }
}

class ToursSection extends LitElement {
  static properties = {
    tours: { state: true },
    currentIndex: { state: true },
    visibleCards: { state: true }
  };

  constructor() {
    super();
    this.tours = [];
    this.currentIndex = 0;
    this.visibleCards = this.getVisibleCards();
    this.handleResize = this.handleResize.bind(this);
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchTours();
    window.addEventListener('resize', this.handleResize);
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.handleResize);
    super.disconnectedCallback();
  }

  handleResize() {
    const newVisible = this.getVisibleCards();
    if (newVisible !== this.visibleCards) {
      this.visibleCards = newVisible;
      // Reset currentIndex to 0 or adjust to prevent out-of-bounds issues
      this.currentIndex = Math.min(this.currentIndex, this.tours.length - this.visibleCards);
      if (this.currentIndex < 0) this.currentIndex = 0; // Ensure it's not negative
    }
  }

  getVisibleCards() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  next() {
    if (this.currentIndex < this.tours.length - this.visibleCards) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  async fetchTours() {
    try {
      // Get today's date in YYYY-MM-DD format for NocoDB filtering
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(today.getDate()).padStart(2, '0');
      const todayFormatted = `${year}-${month}-${day}`;
      console.log('Today formatted:', todayFormatted);

      // Try a simpler approach - fetch all tours first
      // We'll filter them client-side instead of using complex NocoDB filtering
      const sortParams = 'sort=start_date';
      
      // Fetch all tours and filter them in JavaScript
      const allTours = await fetchToursData('', sortParams);
      console.log('All tours fetched:', allTours);
      
      if (!allTours || allTours.length === 0) {
        console.warn('No tours were returned from the API');
        this.tours = [];
        this.requestUpdate();
        return;
      }
      
      // Check data structure of a tour to understand properties
      console.log('Sample tour structure:', allTours[0]);
      
      // Filter the tours client-side - with more flexible comparison
      this.tours = allTours.filter(tour => {
        // Check if is_featured exists and convert to string for comparison
        const isFeatured = String(tour.is_featured).toLowerCase() === 'true';
        
        // Parse the date and compare
        const tourStartDate = new Date(tour.start_date);
        const isAfterToday = !isNaN(tourStartDate) && tourStartDate > today;
        
        console.log(`Tour ${tour.name}: featured=${isFeatured}, start_date=${tour.start_date}, isAfterToday=${isAfterToday}`);
        
        return isFeatured && isAfterToday;
      }).slice(0, 6); // Limit to 6 tours maximum
      
      console.log('Filtered tours:', this.tours);

      this.requestUpdate();
      // No need to call updateCarousel() as requestUpdate() triggers render
    } catch (error) {
      console.error("Failed to load tours:", error);
    }
  }

  render() {
    const start = this.currentIndex;
    const end = start + this.visibleCards;
    const visibleTours = this.tours.slice(start, end);
    return html`
      <section id="tours" class="py-20 lg:py-32 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16 lg:mb-24">
            <h2 class="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4 tracking-wide">UPCOMING TOURS</h2>
            <div class="w-24 h-0.5 bg-celeste mx-auto"></div>
          </div>
          <div class="relative">
            <div class="overflow-hidden">
              <div class="flex gap-6 lg:gap-8 transition-transform duration-500 ease-in-out mb-3"
                   style="transform: translateX(-${this.currentIndex * (100 / 3)}%);">
                ${visibleTours.length === 0
                  ? html`<p>Loading tours...</p>`
                  : visibleTours.map(tour => html`
                    <div class="flex-none w-full md:w-1/2 lg:w-1/3 p-2">
                      <div class="bg-white border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-500 group">
                        <div class="relative h-80 lg:h-96 overflow-hidden">
                          ${tour.sold_out ? html`
                            <div class="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20">
                              <span class="text-white text-3xl lg:text-4xl font-light uppercase tracking-widest">SOLD OUT</span>
                            </div>
                          ` : ''}
                          ${tour.label && !tour.sold_out ? html`
                            <div class="absolute top-4 right-4 bg-accent text-black text-xs font-medium px-3 py-1 uppercase tracking-wider z-10">
                              ${tour.label}
                            </div>
                          ` : ''}
                          ${tour.type === 'luxury' ? html`
                            <div class="absolute top-4 left-4 bg-white text-accent font-script text-lg px-2 py-0.5 rounded z-10">
                                Luxury
                            </div>
                          ` : ''}
                          <img src="${tour.image}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="${tour.name}">
                          
                          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-all duration-500 z-10"></div>
                          <div class="absolute bottom-6 left-6 text-white z-10">
                              <h3 class="text-3xl lg:text-4xl font-light tracking-wider mb-2">${tour.name}</h3>
                              <div class="w-16 h-0.5 bg-accent transition-all duration-500 group-hover:w-24"></div>
                          </div>
                        </div>
                        <div class="p-6">
                            <p class="text-gray-600 font-medium mb-4 text-lg">${formatDateRange(tour.start_date, tour.end_date)}</p>
                            <div class="text-xs text-gray-500 font-medium mb-3 uppercase tracking-widest">${tour.description}</div>
                            <div class="flex justify-between items-center text-sm text-gray-600 mb-6">
                                </div>
                            <div class="flex items-center justify-between mt-6">
                                <div class="flex items-baseline gap-2">
                                    <span class="text-sm lg:text-base font-light text-gray-900">From</span>
                                    <span class="text-xl lg:text-2xl font-light text-gray-900">${tour.price}</span>
                                </div>
                                ${tour.sold_out
                                    ? html`<button class="bg-gray-300 text-gray-600 font-medium py-3 px-6 text-center uppercase tracking-wider text-sm rounded cursor-not-allowed" disabled>Sold Out</button>`
                                    : html`<a href="tour-detail.html?id=${tour.Id}" class="bg-accent hover:bg-accent-dark text-black font-medium py-3 px-6 transition-all duration-300 text-center uppercase tracking-wider text-sm rounded">View Details</a>`
                                }
                            </div>
                        </div>
                      </div>
                    </div>
                  `)
                }
              </div>
              <button @click="${() => this.prev()}" ?disabled="${this.currentIndex === 0}"
                class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button @click="${() => this.next()}" ?disabled="${this.currentIndex >= this.tours.length - this.visibleCards}"
                class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
            <div class="text-center mt-16">
              <a href="tours.html" class="inline-block border border-black text-black hover:bg-black hover:text-white font-medium py-4 px-8 uppercase tracking-wider text-sm transition-all duration-300">
                View All Tours
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('tours-section', ToursSection);