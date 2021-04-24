const API = './API';

/**
 * Базовые классы
 */
class ProductList {
    constructor(url, container) {
        this.container = container;
        this.url = url;
        this.goods = [];
        this.allProducts = [];
        this.filtered = [];
        this.getJson().then(data => this.handler(data));
        this.init();
    }
    getJson(url){
        return fetch(url ? url : `${API+this.url}`)
            .then(result => result.json())
            .catch(err => {
                console.log(err);
            })
    }
    handler(data){
        this.goods = [...data];
        this.fillAllProducts(this.getLimit());
        this.render();
    }
    render(){
        const block = document.querySelector(this.container);
        this.allProducts.forEach(product => {
            block.insertAdjacentHTML('afterbegin', product.render());
        });
    }
    fillAllProducts(limit) {
        for(let i = 0; this.allProducts.length < limit; i++) {
            let productObj = new ProductItem(this.goods[i]);
            if (this.allProducts.find(el => el.id_product === productObj.id_product) === undefined) {
                this.allProducts.push(productObj);
            }
            if (this.allProducts.length === this.goods.length) {
                break;
            }
        }
    }
    getLimit() {
        let limit = 5;
        if (document.body.clientWidth > 724) {
            limit = 6;
        }
        if (document.body.clientWidth > 1150) {
            limit = 8;
        }
        console.log(document.body.clientWidth)
        return limit;
    }
    init(){
        document.querySelector('.products__item-more').addEventListener('click', () => this.renderMore());
        document.querySelector('.fa-search').addEventListener('click', () => {
            this.filter(document.querySelector('.header__input').value);
        });
        document.querySelector('.header__input').addEventListener('input', () => this.realTimeFilter(document.querySelector('.header__input').value));
        document.body.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!e.target.classList.contains("header__input")) {
                document.querySelector('.header__search_drop-down').style.display = "none";
            } else {
                document.querySelector('.header__search_drop-down').style.display = "block";
            }
        })
    }
    renderMore() {
        this.fillAllProducts((this.allProducts.length + this.getLimit()));
        const elements = Array.from(document.querySelectorAll('.products__item'));
        const elem = elements[elements.length-1];
        for (let product of this.allProducts) {
            if (elements.find(el => +el.dataset.id === product.id_product) === undefined){
                elem.insertAdjacentHTML('afterend', product.render());
            }
        }
        this.changeButton();
    }
    changeButton() {
        const elements = Array.from(document.querySelectorAll('.products__item'));
        if (this.goods.length === elements.length) {
            const block = document.querySelector('.products__item-more');
            block.innerHTML = '<strong>No more products</strong>';
        }
    }
    filter(val){
        if (val === '') {
            document.querySelector(this.container).innerHTML =
            `<div class="products__item-more">
                <div><hr></div>
                Show&nbsp;More
                <div><hr></div>
            </div>`;
            document.querySelector('.products__item-more').addEventListener('click', () => this.renderMore());
            this.getJson().then(data => this.handler(data));
        } else {
            const regexp = new RegExp(val, 'i');
            this.filtered = this.goods.filter(product => regexp.test(product.product_name));
            const block = document.querySelector(this.container);
            if (this.filtered.length === 0) {
                block.innerHTML = `<div class="products__item-more">No results were found for your search.</div>`;
            } else {
                block.innerHTML = " ";
                this.filtered.forEach(product => {
                    const productObj = new ProductItem(product);
                    block.insertAdjacentHTML('afterbegin', productObj.render());
                });
            }
            document.querySelector('.header__input').value = '';
        }
    }
    realTimeFilter(val) {
        const regExp = new RegExp(val, 'i');
        this.filtered = this.goods.filter(product => regExp.test(product.product_name));
        const filterBlock = new FilterList(this.filtered);
        document.querySelector('.header__search_drop-down').style.display = "block";
    }
}
class FilterList {
    constructor(products = []) {
        this.products = products;
        this.init();
    }
    init() {
        const block = document.querySelector(".header__search_drop-down");
        block.innerHTML = '';
        this.products.forEach(el => {
            const product = new FilterItem(el);
            block.insertAdjacentHTML('afterbegin', product.render());
        });
    }
}
class Item {
    constructor(el) {
        this.product_name = el.product_name;
        this.price = el.price;
        this.id_product = el.id_product;
        this.product_type = el.product_type;
        this.product_tag = el.product_tag;
        this.colors = el.colors
    }
}
class ProductItem extends Item {
    constructor(el) {
        super(el);
    }
    render() {
        if(this.product_tag.tag_name !== undefined){
            return this.renderWithTags();
        } else return this.renderWithoutTags();
    }
    renderWithTags() {
        if (this.product_tag.tag_name === "sale") {
            return this.renderSale();
        } else if (this.product_tag.tag_name === "new") {
            return this.renderNew();
        } else
            return this.renderStock();
    }
    renderWithoutTags() {
        return `<div class="products__item" data-id="${this.id_product}">
                    <div class="products__item-img">
                        <div class="products__item-color">
                            ${this.renderColors()}
                        </div>
                    </div>
                    <div class="products__item-desc">
                        <h6 class="products__item-title">${this.product_name}</h6>
                        <h6 class="products__item-price">$${this.price}</h6>
                    </div>
                    <div class="products__item-desc">
                        <h6 class="products__item-title">${this.product_type}</h6>
                    </div>
                    <div class="products__item-hover">
                        <div class="products__item-buttons">
                            <p>add to bag</p>
                            <hr class="vertical-line">
                            <p>more info</p>
                        </div>
                        <div class="products__item-add">
                            <p>Add to Wishlist</p>
                            <p>Add to Compare</p>
                        </div>
                    </div>
                </div>`
    }
    renderSale() {
        return `<div class="products__item" data-id="${this.id_product}">
                    <div class="products__item-img">
                        <div class="products__item-sale">-${this.product_tag.percent}%</div>
                        <div class="products__item-color">
                            ${this.renderColors()}
                        </div>
                    </div>
                    <div class="products__item-desc">
                        <h6 class="products__item-title">${this.product_name}</h6>
                        <h6 class="products__item-old-price">$${this.price }</h6>
                    </div>
                    <div class="products__item-desc">
                        <h6 class="products__item-title">${this.product_type}</h6>
                         <h6 class="products__item-price">$${Math.floor(this.price - this.price * (this.product_tag.percent / 100))}</h6>
                    </div>
                    <div class="products__item-hover">
                        <div class="products__item-buttons">
                        <p>add to bag</p>
                        <hr class="vertical-line">
                        <p>more info</p>
                    </div>
                    <div class="products__item-add">
                        <p>Add to Wishlist</p>
                        <p>Add to Compare</p>
                        </div>
                            </div>
                </div>`
    }
    renderNew() {
        return `<div class="products__item" data-id="${this.id_product}">
                    <div class="products__item-img">
                        <div class="products__item-new">${this.product_tag.tag_name}</div>
                        <div class="products__item-color">
                            ${this.renderColors()}
                        </div>
                    </div>
                    <div class="products__item-desc">
                        <h6 class="products__item-title">${this.product_name}</h6>
                        <h6 class="products__item-price">$${this.price}</h6>
                    </div>
                    <div class="products__item-desc">
                        <h6 class="products__item-title">${this.product_type}</h6>
                    </div>
                    <div class="products__item-hover">
                        <div class="products__item-buttons">
                            <p>add to bag</p>
                            <hr class="vertical-line">
                            <p>more info</p>
                        </div>
                        <div class="products__item-add">
                            <p>Add to Wishlist</p>
                            <p>Add to Compare</p>
                        </div>
                    </div>
                </div>`
    }
    renderStock(){
        return `<div class="products__item" data-id="${this.id_product}">
                    <div class="products__item-img">
                        <div class="products__item-stock">${this.product_tag.tag_name}</div>
                        <div class="products__item-color">
                            ${this.renderColors()}
                        </div>
                    </div>
                    <div class="products__item-desc">
                        <h6 class="products__item-title">${this.product_name}</h6>
                        <h6 class="products__item-old-price">$${this.product_tag.old_price}</h6>
                    </div>
                    <div class="products__item-desc">
                        <h6 class="products__item-title">${this.product_type}</h6>
                         <h6 class="products__item-price">$${this.price}</h6>
                    </div>
                    <div class="products__item-hover">
                        <div class="products__item-buttons">
                        <p>add to bag</p>
                        <hr class="vertical-line">
                        <p>more info</p>
                    </div>
                    <div class="products__item-add">
                        <p>Add to Wishlist</p>
                        <p>Add to Compare</p>
                        </div>
                            </div>
                </div>`
    }
    renderColors() {
        let a = ``
        for (let color of this.colors) {
            a += `<div class="${color}-block"></div>`
        }
        return a
    }
}
class FilterItem {
    constructor(element) {
        this.product_name = element.product_name;
        this.price = element.price;
    }
    render() {
        return `<div class="products__item-desc">
                    <h6 class="products__item-title">${this.product_name}</h6>
                    <h6 class="products__item-price">$${this.price}</h6>
                </div>`
    }
}
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

new ProductList('/products.json', '.products');
new Carousel('.slider__inner', '.slider__arrow_left', '.slider__arrow_right', '.slider__pagination');
new NoPaginationCarousel('.slider-small__inner', '.slider-small__arrow_left', '.slider-small__arrow_right');
new NoButtonsCarousel('.slider-big__inner', '.slider-big__pagination');
