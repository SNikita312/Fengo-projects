const API = './API';

new ProductList('/products.json', '.products');
new Carousel('.slider__inner', '.slider__arrow_left', '.slider__arrow_right', '.slider__pagination');
new NoPaginationCarousel('.slider-small__inner', '.slider-small__arrow_left', '.slider-small__arrow_right');
new NoButtonsCarousel('.slider-big__inner', '.slider-big__pagination');
