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
        new FilterList(this.goods);
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
        });
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
        new FilterList(this.filtered);
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