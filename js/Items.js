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
class FilterItem extends Item{
    constructor(element) {
        super(element);
    }
    render() {
        return `<div class="products__item-desc">
                    <div class="products__item-small-img"></div>
                    <h6 class="products__item-title">${this.product_name}</h6>
                    <h6 class="products__item-price">$${this.price}</h6>
                </div>`
    }
}