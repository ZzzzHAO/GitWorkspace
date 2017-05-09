import {Todo} from './todo';
import Swiper from '../scripts/swiper.min.js'
    // var appendNumber = 4;
    // var prependNumber = 1;
    // var swiper = new Swiper('.swiper-container', {
    //     pagination: '.swiper-pagination',
    //     nextButton: '.swiper-button-next',
    //     prevButton: '.swiper-button-prev',
    //     slidesPerView: 3,
    //     centeredSlides: true,
    //     paginationClickable: true,
    //     spaceBetween: 30,
    // });
    // document.querySelector('.prepend-2-slides').addEventListener('click', function (e) {
    //     e.preventDefault();
    //     swiper.prependSlide([
    //         '<div class="swiper-slide">Slide ' + (--prependNumber) + '</div>',
    //         '<div class="swiper-slide">Slide ' + (--prependNumber) + '</div>'
    //     ]);
    // });
    // document.querySelector('.prepend-slide').addEventListener('click', function (e) {
    //     e.preventDefault();
    //     swiper.prependSlide('<div class="swiper-slide">Slide ' + (--prependNumber) + '</div>');
    // });
    // document.querySelector('.append-slide').addEventListener('click', function (e) {
    //     e.preventDefault();
    //     swiper.appendSlide('<div class="swiper-slide">Slide ' + (++appendNumber) + '</div>');
    // });
    // document.querySelector('.append-2-slides').addEventListener('click', function (e) {
    //     e.preventDefault();
    //     swiper.appendSlide([
    //         '<div class="swiper-slide">Slide ' + (++appendNumber) + '</div>',
    //         '<div class="swiper-slide">Slide ' + (++appendNumber) + '</div>'
    //     ]);
    // });
export class App {
  // var appendNumber = 4;
  //   var prependNumber = 1;
  //   var swiper = new Swiper('.swiper-container', {
  //       pagination: '.swiper-pagination',
  //       nextButton: '.swiper-button-next',
  //       prevButton: '.swiper-button-prev',
  //       slidesPerView: 3,
  //       centeredSlides: true,
  //       paginationClickable: true,
  //       spaceBetween: 30,
  //   });
  constructor() {
    this.heading = "Todos";
    this.todos = [];
    this.todoDescription = '';
  }

   created(owningView, myView) {
      // Invoked once the component is created...
   }

   bind(bindingContext, overrideContext) {
      // Invoked once the databinding is activated...
   }

   attached(argument) {
      // Invoked once the component is attached to the DOM...
   }

   detached(argument) {
      // Invoked when component is detached from the dom
   }

   unbind(argument) {
      // Invoked when component is unbound...
   }
  addTodo() {
    if (this.todoDescription) {
      this.todos.push(new Todo(this.todoDescription));
      this.todoDescription = '';
    }
  }

  removeTodo(todo) {
    let index = this.todos.indexOf(todo);
    if (index !== -1) {
      this.todos.splice(index, 1);
    }
  }
}