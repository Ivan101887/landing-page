const elemCarousel = document.querySelector('#Carousel');
let carouselIndex = 0;

let bnrTimer = setInterval(setCarousel, 5000);
function setCarousel() {
  carouselIndex >= 3 ? carouselIndex = 0 : carouselIndex += 1;
  elemCarousel.style.transform = `translateX(${-100 * carouselIndex}%)`
}