// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({4:[function(require,module,exports) {
function AppViewModel() {
    var self = this;

    // The starting position of the app - This sets how many 'cards' from the top the 'focus' section is plus a 'cardHeight' in Pixels
    self.defaultIndex = 2;
    self.cardHeight = 120;
    self.showSelectedProductsDrawer = ko.observable(false);

    var duration = 0.25;

    self.loanTerm = ko.observable(48);

    // Boolean value that decides if the user is searching by price, or by term and miles
    self.isSearchingByPrice = true;

    // Boolean to stop certain user events if draggable or throw is happening
    self.isDragging = ko.observable(false);

    // This is where we cache all the product details for our quote
    self.productDetails = ko.observableArray();

    self.products = ko.observableArray();
    self.activeProductIndex = ko.observable();
    self.activeProduct = ko.observable();

    self.costs = ko.observableArray();
    self.activeCostIndex = ko.observable();
    self.activeCost = ko.observable();

    self.coverages = ko.observableArray();
    self.coveragesIndex = ko.observable();

    self.deductibles = ko.observableArray();
    self.deductiblesIndex = ko.observable();

    self.termMiles = ko.observableArray();
    self.termMilesIndex = ko.observable();
    self.activeTermMiles = ko.observable();

    self.termMonths = ko.observableArray();
    self.termMonthsIndex = ko.observable();
    self.activeTermMonths = ko.observable();

    self.selectedOptions = ko.observableArray();

    //Array that we use to store our draggables in so that we can garbage collect later
    self.allDraggables = [];

    /*
     *
     *  Event handler callbacks that get triggered once a column on the UI completes its 'drag'
     *
     */
    // Handle completion of products dragged
    self.handleProductsWrapperDragged = function (returnedValue) {

        //Remove our original 'costs' drggable from the DOM, as its contents will have changed. Create a new one
        var notProductColumns = [];
        $.each(self.columnData, function (index) {
            self.columnData[index].domElement != '.products-wrapper' ? notProductColumns.push(self.columnData[index]) : null;
        });

        // For each column that is not the '.products-wrapper' we need to remove them from the DOM, and create new draggables with the udpated content
        $.each(notProductColumns, function (index) {

            // First assign a class selector for each one
            var draggableElementString = notProductColumns[index].domElement,
                draggableElement = $(draggableElementString),
                elementChildrenCount = $(draggableElement).children().length;

            // The remove each from the draggables Array
            $.each(self.allDraggables, function (index) {
                if (self.allDraggables[index][0].target.classList.contains(draggableElementString)) {
                    self.allDraggables.splice(index, 1);
                }
            });

            // And create a new draggable based on the updated contents of the dom element
            self.makeCardsDraggable($(self.columnData[index + 1].domElement), self.columnData[index + 1].callback, self.columnData[index + 1].bindingValue);

            //If our element list is less than the top offset of the focus row, animate it to that position.
            if (elementChildrenCount < self.defaultIndex + 1) {
                TweenMax.to(draggableElement, duration, {
                    y: (elementChildrenCount + 1) * self.cardHeight
                });
            } else {
                TweenMax.to(draggableElement, duration, {
                    y: 0
                });
            }
        });

        // Update our activeCost
        self.activeCost(self.costs()[self.activeCostIndex()].cost);
    };

    self.handleCostWrapperDragged = function (returnedValue) {
        //Set our activeCost Index
        self.activeCostIndex(returnedValue);
        self.activeCost(self.costs()[returnedValue].cost);
    };

    self.handleMilesWrapperDragged = function () {
        console.log('Miles wrapper dragged');
    };

    self.handleTermWrapperDragged = function () {
        console.log('Term wrapper dragged');
    };

    /*
    *
    * Data retrieval and object creation functions
    *
    */

    //load products
    self.loadProducts = function () {
        $.ajax({ url: './mock_data/products.json',
            success: function success(result) {
                $.each(result.products, function (index) {
                    var productObject = {
                        isSelected: ko.observable(false),
                        DisplayName: result.products[index].DisplayName,
                        InternalProductId: result.products[index].InternalProductId
                    };
                    self.products.push(productObject);
                    var productId = result.products[index].InternalProductId;
                    self.createProductDetails(productId, index);
                });
            },
            async: false });
    };

    //load product details into a cached object
    self.createProductDetails = function (productId, index) {
        $.ajax({ url: './mock_data/' + productId + '.json',
            success: function success(result) {
                var productDetail = {
                    productIndex: index,
                    productId: productId,
                    productValues: result
                };
                self.productDetails.push(productDetail);
            },
            async: false });
        console.log(self.productDetails());
    };

    // Populate our Costs, termMiles and termMonths Arrays - Happens each time the ActiveProduct is changed
    self.populateValues = function () {
        self.costs([]);
        self.termMonths([]);
        self.termMiles([]);
        // Loop through our productDetails Object
        self.productDetails().map(function (product) {
            if (product.productId === self.activeProduct()) {
                var data = product.productValues.Rates[0].RatedTerms;
                // Then loop through each of the rates available to the selected product
                $.each(data, function (index) {
                    var optionIsSelected = false;
                    // Check to see if we have any selected rates for the selected product already
                    if (self.selectedOptions().length > 0) {
                        //Loop through all of our selectedOptions to find a match up for the activeProduct
                        $.each(self.selectedOptions(), function (optionsIndex) {
                            // Check to make sure the product ids match up
                            if (self.selectedOptions()[optionsIndex].productId == product.productId) {
                                // The find the matching cost from the options
                                if (self.selectedOptions()[optionsIndex].selectedOptions.cost == data[index].RetailCost) {
                                    console.log('We have a winner');
                                    optionIsSelected = true;
                                }
                            }
                        });
                    }
                    var RatedTerm = data[index].RatedTerm;
                    // console.log(RatedTerm);
                    var details = {
                        cost: data[index].RetailCost,
                        miles: RatedTerm.TermMiles.toString().slice(0, -3),
                        months: RatedTerm.TermMonths,
                        isSelected: ko.observable(optionIsSelected)
                    };
                    // populate our costs
                    self.costs.push(details);

                    // populate our termMonths
                    self.termMonths.push(RatedTerm.TermMiles.toString().slice(0, -3));

                    // populate our termMiles
                    self.termMiles.push(RatedTerm.TermMonths);
                });
            }
        });
    };

    /*
     *
     * Observable subscribers
     *
     */
    // Event subscriber for when we update the active product - This happens complete a drag of the products column
    self.activeProductIndex.subscribe(function () {
        self.activeProduct(self.products()[self.activeProductIndex()].InternalProductId);
        self.populateValues();
    });

    /*
     *
     * UI Draggable
     *
     */

    // Each object in this array represents a column in our draggable UI - Included are the dom element to be selected, a reference to a callback and the KO observable that it updates.
    self.columnData = [{
        index: 0,
        domElement: '.products-wrapper',
        callback: self.handleProductsWrapperDragged,
        bindingValue: self.activeProductIndex
    }, {
        index: 1,
        domElement: '.cost-wrapper',
        callback: self.handleCostWrapperDragged,
        bindingValue: self.activeCostIndex
        // ,
        // {
        //     index: 2,
        //     domElement: '.miles-wrapper',
        //     callback: self.handleMilesWrapperDragged,
        //     bindingValue: self.termMilesIndex
        // },
        // {
        //     index: 3,
        //     domElement: '.term-wrapper',
        //     callback: self.handleTermWrapperDragged,
        //     bindingValue: self.termMonthsIndex
        // }
    }];

    // Makes the selected elements on the DOM draggable
    self.makeCardsDraggable = function (draggableElement, callBack, bindingValue) {
        // Make our draggable columns draggable
        var elementChildren = $(draggableElement).children(),
            elementChildrenCount = $(elementChildren).length;

        // Generate a list of snap values
        var snapArray = new Array();
        for (var i = -self.defaultIndex; i < elementChildrenCount - self.defaultIndex; i++) {
            snapArray.push(-(i * self.cardHeight));
        }

        //If our element list is less than the top offset of the focus row, animate it to that position.
        if (elementChildrenCount < self.defaultIndex + 1) {
            TweenMax.to(draggableElement, duration, {
                y: (elementChildrenCount + 1) * self.cardHeight
            });
        } else {
            TweenMax.to(draggableElement, duration, {
                y: 0
            });
        }

        // Function to return the index of the card that is in the 'active-card-frame'
        var generateDraggableIndex = function generateDraggableIndex(value01, value02) {
            return Math.abs(Math.round(value01 / value02) - self.defaultIndex);
        };

        // Set the default binding values for the cards
        if (elementChildrenCount == 1) {
            bindingValue(0);
        } else if (elementChildrenCount == 2) {
            bindingValue(1);
        } else {
            bindingValue(self.defaultIndex);
        }

        var animateAllCards = function animateAllCards(children, index) {
            $.each(children, function (i) {
                if (i === index) {
                    $(elementChildren[i]).children().addClass('active-product');
                    TweenMax.to($(elementChildren[i]).children(), duration, {
                        opacity: 1,
                        transform: 'scale3d(1, 1, 1)'
                    });
                } else if (i === index - 1 || i === index + 1) {
                    $(elementChildren[i]).children().removeClass('active-product');
                    TweenMax.to($(elementChildren[i]).children(), duration, {
                        opacity: 0.8,
                        transform: 'scale3d(0.95, 1, 1)'
                    });
                } else if (i === index - 2 || i === index + 2) {
                    $(elementChildren[i]).children().removeClass('active-product');
                    TweenMax.to($(elementChildren[i]).children(), duration, {
                        opacity: 0.6,
                        transform: 'scale3d(0.9, 1, 1)'
                    });
                } else if (i === index - 3 || i === index + 3) {
                    $(elementChildren[i]).children().removeClass('active-product');
                    TweenMax.to($(elementChildren[i]).children(), duration, {
                        opacity: 0.4,
                        transform: 'scale3d(0.85, 1, 1)'
                    });
                } else if (i === index - 4 || i === index + 4) {
                    $(elementChildren[i]).children().removeClass('active-product');
                    TweenMax.to($(elementChildren[i]).children(), duration, {
                        opacity: 0.2,
                        transform: 'scale3d(0.8, 1, 1)'
                    });
                } else if (i < index - 4 || i > index + 4) {
                    $(elementChildren[i]).children().removeClass('active-product');
                    TweenMax.set($(elementChildren[i]).children(), {
                        transform: 'scale3d(1, 1, 1)'
                    });
                }
            });
        };

        // Call our animated card methods for the first time...
        animateAllCards(elementChildren, self.defaultIndex);

        // However, if the total number of children is less than our defaultIndex (2) the first one in the array needs to be set as 'active'
        if (elementChildrenCount <= self.defaultIndex) {
            if (elementChildrenCount == 1 || elementChildrenCount == self.defaultIndex) {
                $(elementChildren[0]).children('.card-content').addClass('active-product');
                TweenMax.to($(elementChildren[0]).children('.card-content'), duration, {
                    opacity: 1,
                    transform: 'scale3d(1, 1, 1)'
                });
            }
        }

        //Create the draggable element and assign it a var
        var newDraggable = Draggable.create(draggableElement, {
            type: "y",
            edgeResistance: 0.95,
            throwProps: true,
            snap: snapArray,
            zIndexBoost: false,
            maxDuration: duration,
            onClick: function onClick() {
                self.isDragging(true);
            },
            onDrag: function onDrag() {
                var draggableIndex = generateDraggableIndex(this.y, self.cardHeight);
                animateAllCards(elementChildren, draggableIndex);
                self.isDragging(true);
            },
            onThrowUpdate: function onThrowUpdate() {
                var draggableIndex = generateDraggableIndex(this.y, self.cardHeight);
                animateAllCards(elementChildren, draggableIndex);
                self.isDragging(true);
            },
            onThrowComplete: function onThrowComplete() {
                bindingValue(Math.abs(Math.round(this.endY / self.cardHeight) - self.defaultIndex));
                callBack(Math.abs(Math.round(this.endY / self.cardHeight) - self.defaultIndex));
                self.isDragging(false);
            }
        });

        //Push all draggables to an array so that we can access them later.
        self.allDraggables.push(newDraggable);
    };

    /*
     *
     * Handle adding and removing products
     *
     */

    // Adds a given current product to your product list
    self.addProductWithOptions = function () {
        //Set all of our options isSelected to false
        $.each(self.costs(), function (index) {
            self.costs()[index].isSelected(false);
        });
        // Set the isSelected Observable on the active product and option
        self.products()[self.activeProductIndex()].isSelected(true);
        self.costs()[self.activeCostIndex()].isSelected(true);
        var selectedOption = {
            productId: self.products()[self.activeProductIndex()].InternalProductId,
            productName: self.products()[self.activeProductIndex()].DisplayName,
            productInfo: self.productDetails()[self.activeProductIndex()],
            selectedOptions: {
                cost: self.costs()[self.activeCostIndex()].cost
            }
        };
        // The first time we add an option, we need to push it
        if (self.selectedOptions().length < 1) {
            self.selectedOptions.push(selectedOption);
        } else {
            $.each(self.selectedOptions(), function (index) {
                // If the product already exists, remove it from the array
                if (self.selectedOptions()[index].productId == self.products()[self.activeProductIndex()].InternalProductId) {
                    self.selectedOptions.splice(index, 1);
                }
            });

            // Then create a new cost selectedOption object
            self.selectedOptions.push(selectedOption);
        }
    };

    // Removes a selected product from our selectedOptions
    self.removeProductWithOptions = function (data) {

        var productId = data.productId;

        // Look through each of our selectedOptions and by matching the productId to the data.productId remove it from the selectedOptions
        $.each(self.selectedOptions(), function (index) {
            if (self.selectedOptions()[index].productId === productId) {
                self.selectedOptions().splice(index, 1);
                // Make the observable observe itself to force a UI update
                self.selectedOptions(self.selectedOptions());
                // And remove the same from our termMonths and termMiles arrays
                self.termMiles.splice(index, 1);
                self.termMonths.splice(index, 1);
            }
        });

        // Unselect the selected product
        $.each(self.products(), function (index) {
            if (self.products()[index].InternalProductId === productId) {
                self.products()[index].isSelected(false);
            }
        });
    };

    /*
     *
     * Computed variables
     *
     */

    // ko.computed to gather the total cost of our plan
    self.planCost = ko.computed(function () {
        var totalCost = 0;

        $.each(self.selectedOptions(), function (index) {
            totalCost += self.selectedOptions()[index].selectedOptions.cost;
        });

        return totalCost;
    });

    // ko.computed to get monthly cost of our plan
    self.monthlyCost = ko.computed(function () {
        var monthlyCost = 0;

        $.each(self.selectedOptions(), function (index) {
            monthlyCost += Math.floor(self.selectedOptions()[index].selectedOptions.cost) / Math.floor(self.loanTerm());
        });

        monthlyCost = monthlyCost.toFixed(2);

        return monthlyCost;
    });

    // ko.computed to get number of products in our plan
    self.productCount = ko.computed(function () {

        return self.selectedOptions().length;
    });

    /*
     *
     * Showing and Hiding options drawer
     *
     */

    // Function to show or hide the selected-options-drawer
    self.showHideOptionsDrawer = function () {
        self.showSelectedProductsDrawer(!self.showSelectedProductsDrawer());
    };

    /*
     *
     * Initialize the project
     *
     */

    // This function bootstraps our page
    self.init = function () {
        // Set the top offset of our active area based on the self.defaultIndex;
        $('.active-card-frame').css({ top: self.defaultIndex * self.cardHeight + 'px' });
        // Load our products
        self.loadProducts();
        // Make our cards draggable
        $.each(self.columnData, function (index) {
            self.makeCardsDraggable($(self.columnData[index].domElement), self.columnData[index].callback, self.columnData[index].bindingValue);
        });
    };

    // Inits the app once the document is ready
    $(document).ready(function () {
        self.init();
    });

    /*
     *
     * Return our revealing module
     *
     */

    return {
        products: self.products,
        productDetails: self.productDetails,
        activeProduct: self.activeProduct,
        activeProductIndex: self.activeProductIndex,
        activeCost: self.activeCost,
        activeCostIndex: self.activeCostIndex,
        defaultIndex: self.defaultIndex,
        setActiveProduct: self.setActiveProduct,
        costs: self.costs,
        termMiles: self.termMiles,
        termMonths: self.termMonths,
        isSearchingByPrice: self.isSearchingByPrice,
        addProductWithOptions: self.addProductWithOptions,
        selectedOptions: self.selectedOptions,
        showSelectedProductsDrawer: self.showSelectedProductsDrawer,
        showHideOptionsDrawer: self.showHideOptionsDrawer,
        removeProductWithOptions: self.removeProductWithOptions,
        isDragging: self.isDragging,
        planCost: self.planCost,
        monthlyCost: self.monthlyCost,
        productCount: self.productCount,
        loanTerm: self.loanTerm
    };
}

// Activates knockout.js
ko.applyBindings(new AppViewModel(), document.getElementById('commerceProductApp'));

// uat
// easycareuat
// U@Testing123
// APCO-02
// 4T1BF1FK7GU566533
},{}],47:[function(require,module,exports) {

var OVERLAY_ID = '__parcel__error__overlay__';

var global = (1, eval)('this');
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '51897' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[47,4])
//# sourceMappingURL=/viewModel.45392886.map