import {settings, select} from './settings.js';
import Product from './components/product.js';
import Cart from './components/cart.js';

const app = {
  initCart: function(){
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);

    });
  },
  initMenu: function(){
    const thisApp = this;
    //console.log('thisApp.data:', thisApp.data);
    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }

    //const testProduct = new Product();
    //console.log('testProduct:', testProduct);
  },
  initData: function(){
    const thisApp = this;
    const url = settings.db.url + '/' + settings.db.product;
    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
        thisApp.data.products = parsedResponse;
        /*save parsedResponse as thisApp.data.products */
        thisApp.initMenu();
        /*execute initMenu method */
      });

    console.log('thisApp.data', JSON.stringify(thisApp.data));

    thisApp.data = {};
  },
  init: function(){
    const thisApp = this;
   
    thisApp.initData();
    thisApp.initCart();
  },
};

app.init();

  