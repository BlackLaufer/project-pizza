import {select, classNames, templates} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './amountWidget.js';

class Product {
  constructor(id, data) {
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
  }
  renderInMenu() {
    const thisProduct = this;
    /* generate HTML based on template*/
    const generatedHTML = templates.menuProduct(thisProduct.data);
    /* create element using utils.createElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    /* find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);
    menuContainer.appendChild(thisProduct.element);
  }

  getElements() {
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }
        
  initAccordion() {
    const thisProduct = this;
    thisProduct.accordionTrigger.addEventListener('click', function() {
      (event).preventDefault();
      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
      let activeProducts = document.querySelectorAll(select.all.menuProductsActive);
      for (let activeProduct of activeProducts) {
        if ( activeProduct != thisProduct.element) {
          activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
        }
      }
    });
  }
      
  initOrderForm() {
    const thisProduct = this;
      

    thisProduct.form.addEventListener('submit', function(event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function() {
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  
  processOrder() {
    const thisProduct = this;
    const formData = utils.serializeFormToObject(thisProduct.form);
    thisProduct.params = {};
    let price = thisProduct.data.price;
    for (let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];
      for (let optionId in param.options) {
        const option = param.options[optionId];
        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
        if (optionSelected && !option.default) {
          price = price + option.price;
        } else if (!optionSelected && option.default) {
          price = price - option.price;
        }
        let className = '.' + paramId + '-' + optionId;
        let images = thisProduct.imageWrapper.querySelectorAll(className);
        if (optionSelected) {
          if (!thisProduct.params[paramId]) {
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
          }
          for (let image of images) {
            image.classList.add('active');
          }
        } else {
          for (let image of images) {
            image.classList.remove('active');
          }
        }
      }

      thisProduct.priceSingle = price;
      thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;
      thisProduct.priceElem.innerHTML = thisProduct.price;
    }
  }

  initAmountWidget() {
    const thisProduct = this;
  
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function() {
      thisProduct.processOrder();
    });
  }

  addToCart() {
    const thisProduct = this;
    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;
    //app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-card' , {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });
    thisProduct.element.dispatchEvent(event);
  }
}

export default Product;