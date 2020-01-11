import {settings, select, classNames, templates} from '../settings.js';
import {utils} from '../utils.js';
import CartProduct from './cartProduct.js';

class Cart{
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];
    thisCart.getElements(element);
    thisCart.initActions();
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;

  }
  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.address = thisCart.dom.form.querySelectorAll(select.cart.address).value;

    thisCart.dom.phone = thisCart.dom.form.querySelectorAll(select.cart.phone).value;

    for(let key of thisCart.renderTotalsKeys){
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }
  }
  initActions() {
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function() {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function() {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function() {
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function(event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }
  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;
    const payload = {
      address: thisCart.dom.address,
      totalPrice: thisCart.totalPrice,
      phone: thisCart.dom.phone,
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };
    for(let product of thisCart.products){
      payload.products.push(product.getData());

    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function(rawResponse) {
        return rawResponse.json();
      })
      .then(function(parsedResponse) {
        console.log('parsedResopnse',parsedResponse);
      });

  }
  add(menuProduct) {
    const thisCart = this;
    const generatedHTML = templates.cartProduct(menuProduct);
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    thisCart.dom.productList.appendChild(generatedDOM);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    thisCart.update();

  }
  remove(cartProduct) {
    const thisCart = this;
    const index = thisCart.products.indexOf[cartProduct];
    thisCart.products.splice(index, 1);

    cartProduct.dom.wrapper.remove();
    thisCart.update();
  }
  update(){
    const thisCart = this;
    let totalNumber = 0;
    let totalPrice = 0;
    for(let product of thisCart.products){
      totalPrice += product.price;
      totalNumber += product.amount;
    }
    thisCart.totalPrice = totalPrice + thisCart.deliveryFee;
    thisCart.subtotalPrice = totalPrice;
    thisCart.totalNumber = totalNumber;
    for(let key of thisCart.renderTotalsKeys){
      for(let elem of thisCart.dom[key]){
        elem.innerHTML = thisCart[key];
      }
    }

  }
}

export default Cart; 