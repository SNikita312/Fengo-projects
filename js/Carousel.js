class Carousel {
    constructor(container, buttonLeft, buttonRight, pagination) {
        this.container = document.querySelector(container);
        this.buttonLeft = document.querySelector(buttonLeft);
        this.buttonRight = document.querySelector(buttonRight);
        this.pagination = document.querySelector(pagination);
        this.slides = [];
        this.currentSlideIdx = null;
        this.nextSlideIdx = null;
        this._init();
    }
    _init() {
        this._initButtons();
        this._initSlides();
        this._initPagination();
    }
    _initButtons() {
        this.buttonLeft.addEventListener('click', () => this.changeSlideRight());
        this.buttonRight.addEventListener('click', () => this.changeSlideLeft());
    }
    _initSlides() {
        this.container.childNodes.forEach(el => {
            if (el.tagName === 'DIV') {
                this.slides.push(el);
            }
        });
        this.slides[0].classList.add('active');
    }
    _initPagination() {
        this.slides.forEach((el, idx) => {
            this.pagination.insertAdjacentHTML('beforeend', this.getPaginationStructure(idx));
        });
        Array.from(this.pagination.childNodes).find(el => el.tagName === 'DIV').classList.add('current');
        this.pagination.addEventListener('click', (e) => {this.switchSlide(e)});
    }
    moveRight(){
        this.slides[this.currentSlideIdx].classList.add('active', 'right');
        this.slides[this.currentSlideIdx].addEventListener('animationstart', () => {
            this.slides[this.nextSlideIdx].classList.add('active', 'rightNext');
        }, {once: true});
        this.slides[this.currentSlideIdx].addEventListener('animationend', () => {
            this.slides[this.currentSlideIdx].classList.remove('active', 'right');
        }, {once: true});
        this.slides[this.nextSlideIdx].addEventListener('animationend',() => {
            this.slides[this.nextSlideIdx].classList.remove('rightNext');
        }, {once: true});
    }
    moveLeft(){
        this.slides[this.currentSlideIdx].classList.add('active', 'left');
        this.slides[this.currentSlideIdx].addEventListener('animationstart', () => {
            this.slides[this.nextSlideIdx].classList.add('active', 'leftNext');
        }, {once: true});
        this.slides[this.currentSlideIdx].addEventListener('animationend', () => {
            this.slides[this.currentSlideIdx].classList.remove('active', 'left');
        }, {once: true});
        this.slides[this.nextSlideIdx].addEventListener('animationend',() => {
            this.slides[this.nextSlideIdx].classList.remove('leftNext');
        }, {once: true});
    }
    changeSlideLeft() {
        this.setNextSlide('left');
        this.moveLeft();
        this.switchPagination();
    }
    changeSlideRight() {
        this.setNextSlide('right');
        this.moveRight();
        this.switchPagination();
    }
    setNextSlide(instruction) {
        this.currentSlideIdx = this.slides.findIndex(el => el.classList.contains('active'));
        if (instruction === 'left') {
            if (this.currentSlideIdx === this.slides.length-1){
                this.nextSlideIdx = 0;
            } else {
                this.nextSlideIdx = this.currentSlideIdx+1;
            }
        } else {
            if (this.currentSlideIdx === 0) {
                this.nextSlideIdx = this.slides.length-1;
            } else {
                this.nextSlideIdx = this.currentSlideIdx-1;
            }
        }
    }
    getPaginationStructure(idx) {
        return `<div class="slider__circle" data-slide="${idx}"></div>`;
    }
    switchSlide(e) {
        if (e.target.dataset.slide) {
            this.currentSlideIdx = this.slides.findIndex(el => el.classList.contains('active'));
            if (e.target.dataset.slide > this.currentSlideIdx) {
                this.nextSlideIdx = +e.target.dataset.slide;
                this.moveLeft();
                this.switchPagination();
            } else if (e.target.dataset.slide < this.currentSlideIdx) {
                this.nextSlideIdx = +e.target.dataset.slide;
                this.moveRight();
                this.switchPagination();
            }
        }
    }
    switchPagination() {
        const buttons = Array.from(this.pagination.childNodes).filter(el => el.tagName === 'DIV');
        const nextButton = buttons.find(el => +el.dataset.slide === this.nextSlideIdx);
        buttons.find(el => el.classList.contains('current')).classList.remove('current');
        nextButton.classList.add('current');
    }
}
class NoPaginationCarousel extends Carousel {
    constructor(container, buttonLeft, buttonRight) {
        super(container, buttonLeft, buttonRight, null);
    }
    _init(){
        this._initButtons();
        this._initSlides();
    }
    changeSlideLeft() {
        this.setNextSlide('left');
        this.moveLeft();
    }
    changeSlideRight() {
        this.setNextSlide('right');
        this.moveRight();
    }
}
class NoButtonsCarousel extends Carousel {
    constructor(container, pagination) {
        super(container, null, null, pagination);
    }
    _init(){
        this._initSlides();
        this._initPagination();
    }
}