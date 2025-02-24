if (!customElements.get('product-slider')) {
  customElements.define(
    'product-slider',
    class extends HTMLElement {
      constructor() {
        super();
        this.slider = this.querySelector('.slider-content');
        this.sliderItems = this.querySelectorAll('.product-grid li');
        this.prevButton = this.querySelector('.slider-button--prev');
        this.nextButton = this.querySelector('.slider-button--next');

        if (!this.slider || !this.sliderItems.length) return;

        this.currentIndex = 0;
        this.itemsPerView = 4;
        this.totalItems = this.sliderItems.length;

        this.init();
      }

      init() {
        this.updateSliderState();

        if (this.prevButton) {
          this.prevButton.addEventListener('click', this.onButtonClick.bind(this));
        }
        if (this.nextButton) {
          this.nextButton.addEventListener('click', this.onButtonClick.bind(this));
        }

        window.addEventListener(
          'resize',
          debounce(() => {
            this.updateSliderState();
          }, 300)
        );
      }

      onButtonClick(event) {
        event.preventDefault();
        const button = event.currentTarget;
        this.slide(button.name);
      }

      slide(direction) {
        const itemWidth = this.sliderItems[0].offsetWidth;
        const gapWidth = 20;
        const totalItemWidth = itemWidth + gapWidth;
        const maxScroll = (this.totalItems - this.itemsPerView) * totalItemWidth;

        if (direction === 'previous' && this.currentIndex > 0) {
          this.currentIndex--;
        } else if (direction === 'next' && this.currentIndex < this.totalItems - this.itemsPerView) {
          this.currentIndex++;
        }

        const translateX = Math.min(maxScroll, this.currentIndex * totalItemWidth);
        this.slider.style.transform = `translateX(-${translateX}px)`;

        this.updateSliderState();
      }

      updateSliderState() {
        if (!this.prevButton || !this.nextButton) return;

        this.prevButton.disabled = this.currentIndex <= 0;
        this.nextButton.disabled = this.currentIndex >= this.totalItems - this.itemsPerView;
      }
    }
  );
}

function debounce(fn, wait) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), wait);
  };
}
