function AppViewModel() {
    var self = this;

    // The starting position of the app - This sets how many 'cards' from the top the 'focus' section is plus a 'cardHeight' in Pixels
    self.defaultIndex = 2;
    self.cardHeight = 120;

    var duration = 0.25;

    // This is where we cache all the product details for our quote
    self.productDetails = ko.observableArray();

    self.products = ko.observableArray();
    self.activeProduct = ko.observable();

    self.costs = ko.observableArray();
    self.activeCost = ko.observable();

    self.surcharge = ko.observableArray();
    self.surchargeIndex = ko.observable();

    self.termMiles = ko.observableArray();
    self.activeTermMiles = ko.observable();

    self.termMonths = ko.observableArray();
    self.activeTermMonths = ko.observable();

    //Array that we use to store our draggables in so that we can garbage collect later
    self.allDraggables = [];

    /* -- Event handlers that get triggered once a column on the UI completes its 'drag' */
    self.handleProductsWrapperDragged = function(returnedValue){
        //Set our activeProduct
        self.activeProduct(self.products()[returnedValue].InternalProductId);

        // We need to generate new snapValues for our costs array
        var snapArray = [],
            costLength = self.costs().length;
        for(var i = -self.defaultIndex; i < costLength - self.defaultIndex; i++){
            snapArray.push( -(i * self.cardHeight));
        }

        // Define the dom-element our draggable is attached to and it's children
        var draggableElement = $('.cost-wrapper'),
            elementChildrenCount = $(draggableElement).children().length;

        //If our element list is less than the top offset of the focus row, animate it to that position.
        if(elementChildrenCount < (self.defaultIndex + 1)){
            TweenMax.to(draggableElement, duration, {
                y: (elementChildrenCount + 1) * self.cardHeight
            });
        } else {
            TweenMax.to(draggableElement, duration, {
                y: 0
            });
        }

        $.each(self.allDraggables, function(index){
            if(self.allDraggables[index][0]){
                if (self.allDraggables[index][0].target.classList.contains('cost-wrapper')) {
                    self.allDraggables[index][0].vars.snap = snapArray;
                }
            }
        });
    };

    self.handleCostWrapperDragged = function(returnedValue){
        // console.log(returnedValue);
    };





    // Each object in this array represents a column in our draggable UI - Included are the dom element to be selected, a reference to a callback and the KO observable that it updates.
    self.columnData = [
        {
            index: 0,
            domElement: '.products-wrapper',
            callback: self.handleProductsWrapperDragged
        },
        {
            index: 0,
            domElement: '.cost-wrapper',
            callback: self.handleCostWrapperDragged
        }
    ];

    //load products
    self.loadProducts = function(){
        $.ajax({url: './mock_data/products.json',
            success: function(result){
                        $.each(result.products, function(index){
                            self.products.push(result.products[index]);
                            var productId = result.products[index].InternalProductId;
                            self.createProductDetails(productId, index);
                        });
                    },
            async: false});
    };

    //load products prices
    self.createProductDetails = function(productId, index){
        $.ajax({url: './mock_data/' + productId + '.json',
            success: function(result) {
                var productDetail = {
                    productIndex: index,
                    productId: productId,
                    productValues: result,
                    isActiveProduct: false,
                    isSelectedProduct: false
                };
                self.productDetails.push(productDetail);
            },
            async: false});
    };

    // Populate our Costs Array - Happens each time the ActiveProduct is changed
    self.populateCosts = function(){
        self.costs([]);
        self.productDetails().map(function(product){
            if (product.productId === self.activeProduct()){
                var costs = product.productValues.Rates[0].RatedTerms;
                $.each(costs, function(index){
                    var details = {
                        cost: costs[index].RetailCost,
                        miles: costs[index].RatedTerm.TermMiles,
                        months: costs[index].RatedTerm.TermMonths
                    };
                    self.costs.push(details);
                });
            }
        });
    };

    // Event subscriber for when we update the active product - This happens when we tap on a product
    self.activeProduct.subscribe(function(){
        self.populateCosts();
    });

    // Makes the selected elements on the DOM draggable
    self.makeCardsDraggable = function(draggableElement, callBack){
        // Make our draggable columns draggable
        var elementChildren = $(draggableElement).children(),
            elementChildrenCount = $(elementChildren).length;

        // Generate a list of snap values
        var snapArray = new Array();
        for(var i = -self.defaultIndex; i < elementChildrenCount - self.defaultIndex; i++){
            snapArray.push( -(i * self.cardHeight));
        }

        //If our element list is less than the top offset of the focus row, animate it to that position.
        if(elementChildrenCount < (self.defaultIndex + 1)){
            TweenMax.to(draggableElement, duration, {
                y: (elementChildrenCount + 1) * self.cardHeight
            });
        }

        // Function to return the index of the card that is in the 'active-card-frame'
        var generateDraggableIndex = function(value01, value02){
            return Math.abs(Math.round((value01/value02)) - self.defaultIndex);
        };

        var generateAllIndexes = function(children, index){
            $.each(children, function(i){
                if( i === index ){
                    TweenMax.to($(elementChildren[i]).children(), duration, {
                        opacity: 1,
                        transform: 'scale3d(1, 1, 1)'
                    });
                } else if (i === index - 1 || i === index + 1){
                    TweenMax.to($(elementChildren[i]).children(), duration, {
                        opacity: 0.8,
                        transform: 'scale3d(0.95, 1, 1)'
                    });
                } else if (i === index - 2 || i === index + 2){
                    TweenMax.to($(elementChildren[i]).children(), duration, {
                        opacity: 0.6,
                        transform: 'scale3d(0.9, 1, 1)'
                    });
                } else if (i === index - 3 || i === index + 3){
                    TweenMax.to($(elementChildren[i]).children(), duration, {
                        opacity: 0.4,
                        transform: 'scale3d(0.85, 1, 1)'
                    });
                } else if (i === index - 4 || i === index + 4){
                    TweenMax.to($(elementChildren[i]).children(), duration, {
                        opacity: 0.2,
                        transform: 'scale3d(0.8, 1, 1)'
                    });
                } else if (i < index - 4 || i > index + 4) {
                    TweenMax.set($(elementChildren[i]).children(), {
                        transform: 'scale3d(1, 1, 1)'
                    });
                }

            });
        };

        var draggableIndex = generateDraggableIndex(self.defaultIndex, self.cardHeight);
        generateAllIndexes(elementChildren, self.defaultIndex);

        //Create the draggable element and assign it a var
        var newDraggable = Draggable.create(draggableElement, {
            type: "y",
            edgeResistance: 0.95,
            throwProps:true,
            snap: snapArray,
            onDrag: function(){
                var draggableIndex = generateDraggableIndex(this.y, self.cardHeight);
                generateAllIndexes(elementChildren, draggableIndex);
                // console.log(draggableIndex);
            },
            onThrowUpdate: function(){
                var draggableIndex = generateDraggableIndex(this.y, self.cardHeight);
                generateAllIndexes(elementChildren, draggableIndex);
                // console.log(draggableIndex);
            },
            onThrowComplete: function(){
                callBack(Math.abs(Math.round(this.endY / self.cardHeight) - self.defaultIndex));
            }
        });

        //Push all draggables to an array so that we can access them later.
        self.allDraggables.push(newDraggable);
    };

    // This function bootstraps our page
    self.init = function(){
        // Load our products
        self.loadProducts();
        // Set our product id
        self.activeProduct(self.products()[self.defaultIndex].InternalProductId);
        // Make our cards draggable
        $.each(self.columnData, function(index){
            self.makeCardsDraggable($(self.columnData[index].domElement), self.columnData[index].callback);
        });
    };

    // Inits the app once the document is ready
    $(document).ready(function(){
        self.init();
    });

    return {
        products: self.products,
        productDetails: self.productDetails,
        activeProduct: self.activeProduct,
        defaultIndex: self.defaultIndex,
        setActiveProduct: self.setActiveProduct,
        costs: self.costs
    };
}

// Activates knockout.js
ko.applyBindings(new AppViewModel(), document.getElementById('commerceProductApp'));

// uat
// easycareuat
// U@Testing123
// APCO-02
// 4T1BF1FK7GU566533