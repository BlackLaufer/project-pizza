/* global Handlebars, utils, dataSource */ 

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product {
    constructor(id, data) {
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.processOrder();
      console.log('new Product:', thisProduct);
    }
    renderInMenu() {
      const thisProduct = this;

      /* generate HTML based on template*/
      const generatedHTML = templates.menuProduct(thisProduct.data);
      //console.log(generatedHTML);

      /* create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /* find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);

      menuContainer.appendChild(thisProduct.element);
    }

    getElements() {
      const thisProduct = this;
      console.log('getElements',thisProduct);

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    }
        
    initAccordion() {
      const thisProduct = this;
      console.log(thisProduct);
      
      /* START: click event listener to trigger */
      
      const buttonClicked = thisProduct.element.querySelector(select.menuProduct.clickable);

      buttonClicked.addEventListener('click', function(event) {
      /* prevent default action for event */
        event.preventDefault();
        /* toggle active class on element of thisProduct */
        
      
        /* find all active products */
        const activeProducts = document.querySelectorAll('article.product.active');
        /* START LOOP: for each active product */ 

        for(let active of activeProducts) {
        
          /* remove class active for the active product */
            active.classList.remove('active');
          
        /* END LOOP: for each active product */
        }
        thisProduct.element.classList.add('active');
      /* END: click event listener to trigger */
      });    
    }

    initOrderForm() {
      const thisProduct = this;
      console.log('initOrderForm', thisProduct);
    

      thisProduct.form.addEventListener('submit', function(event) {
        event.preventDefault();
        thisProduct.processOrder();
      });

      for(let input of thisProduct.formInputs) {
        input.addEventListener('change', function() {
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function(event) {
        event.preventDefault();
        thisProduct.processOrder();
      });
    }

    processOrder() {
      const thisProduct = this;
      console.log('processOrder',thisProduct);
 
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);

      /* set variable price to equal thisProduct */
      let price = thisProduct.data.price;
      console.log('Price:', price);
      /* start loop for parmId */
      /* save the element in thisProduct */
      for(let param in thisProduct.data.params) {
      console.log('Params', param, thisProduct.data.params[param]);
        let params = thisProduct.data.params[param];
        console.log(params);
    
        /* start loop optionId*/
        /* save element in param.options */
        for(let option in param.options) {
        console.log('Options:', option);
          let options = params.options[option];
          console.log('options', options);
          /* START IF: if option is selected and option is not default */
          const optionSelected = formData.hasOwnProperty(param) && formData[param].indexOf(option) > -1;
          console.log('optionSelected:', options.default);
          
          if(optionSelected && !options.default) {

          /* add price  for variable price */
            price = price + options.price;
          /* END IF: if option is selected and option is not default */
          }   
          /* start else if */
          /* deduct price of option from price */
          else if(!optionSelected && options.default) {
          //}
          /* end else if */
            price = price - options.price;
          /* end loop start loop optionId */
          let images = thisProduct.data.images;
          console.log('images:', images)
          }
      /* end loop */
        }
      
        thisProduct.priceElem.innerHTML = price;  
      }
    	    
  }

  const app = {
    initMenu: function() {
      const thisApp = this;
      console.log('thisApp.data:', thisApp.data);
      
      for(let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function() {
      const thisApp = this;
      thisApp.data = dataSource;
    },


    init: function() {
      const thisApp = this;
      console.log('thisApp.data:', thisApp.data);
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };

    
  app.init();
}