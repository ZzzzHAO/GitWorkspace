import Swiper from '../scripts/swiper.min.js'
export class App {
  constructor() {}

  created(owningView, myView) {
    // Invoked once the component is created...
  }

  bind(bindingContext, overrideContext) {
    // Invoked once the databinding is activated...
  }

  attached(argument) {
    // Invoked once the component is attached to the DOM...
    var swiper = new Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      slidesPerView: 2,
      centeredSlides: true,
      paginationClickable: true,
      spaceBetween: 250,
      effect: 'coverflow',
    });
  }

  detached(argument) {
    // Invoked when component is detached from the dom
  }

  unbind(argument) {
    // Invoked when component is unbound...
  }
}