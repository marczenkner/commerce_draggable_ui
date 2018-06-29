function AppViewModel() {

    var values = {};

    values.getProductsByVinURL = 'https://tlcsvcapi.uat.taillight.xyz/RSS.SPAN.BusinessServices/restvehicleproductsvc.svc/RetrieveVehicleProductsByVIN';

    values.authToken = 'eyJ0eXAiOiJVU0VSQUNDT1VOVCIsImFsZyI6Mn0.eyJqdGkiOiI5OTZlMmE0MC1hODVmLTQ2YzktYTQ0ZS1kNjU4NGJjYjAyMjQiLCJzdWIiOiI1NjIwZmQxZmMyNTcxNzFmZWMxOWYzMjY7ZWFzeWNhcmVhZG1pbjs1NjE2YTU5ZDQ5M2ZiNzFiZGMxNDkyYTUiLCJhdWQiOiJyaXN0a2VuLmNvbSIsIm5iZiI6IjE1MjAzNjk5NDgiLCJleHAiOiIxNTIwNDU2MzQ4IiwiQ2xhaW1zIjpbeyJLZXkiOiJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiLCJWYWx1ZSI6IlNQQU4gQURNSU4ifV19.okOG2OGJCmCDkOU1l3kRdCGnnsNqaAGrJyS4VN7YBH4=';

    values.bodyData = JSON.stringify({"dateOfSale":"2018-03-06","dealerAccountCode":"014996","makeModelInfo":null,"partnerSpecificEligibility":[{"key":"dealSaleType","value":"RetailFinanced"}],"productPlanType":null,"providerCode":"EASYCARE","vehicleCertification":"None","vehicleIdentificationNumber":"1FT7W2B69GEA00053","vehicleInservice":null,"vehicleOdometer":"1000","vehicleUsageTypes":["Personal"],"quoteSessionNumber":"94763b6d-5429-4c2f-9876-55a46821b9e7","productCodeFilters":null});

    var self = this;

    // The starting position of the app - This sets how many 'cards' from the top the 'focus' section is plus a 'cardHeight' in Pixels
    self.defaultIndex = 2;
    self.cardHeight = 120;
    self.showSelectedProductsDrawer = ko.observable(false);

    // Local variable for our animation duration
    var duration = 0.25;

    // Temp Loan term var
    self.loanTerm = ko.observable(48);

    // Boolean value that decides if the user is searching by price, or by term and miles
    self.isSearchingByPrice = true;

    // Boolean to stop certain user events if draggable or throw is happening
    self.isDragging = ko.observable(false);

    //Array that we use to store our draggables in so that we can garbage collect later
    self.allDraggables = [];

    // This array is our main source of Data for the app
    self.productsWithDetails = ko.observableArray();

    // Vars for setting the indexes
    self.activeProductIndex = ko.observable(self.defaultIndex);
    self.activeProductRates = ko.observableArray();
    self.activeRateIndex = ko.observable(self.defaultIndex);
    self.activeInputIndex = ko.observable(0);

    // Vars for display Coverages and Deductibles and other information
    self.activeCoverage = ko.observable();
    self.activeDeductible = ko.observable();

    self.vehicleDetails = ko.observable();

    self.planCost = ko.observable(0);
    self.productCount = ko.observable(0);
    self.monthlyCost = ko.computed(function(){
        return (self.planCost() / self.loanTerm()).toFixed(2)
    });

    /*
     *
     *  Event handler callbacks that get triggered once a column on the UI completes its 'drag'
     *
     */
    // Handle completion of products dragged
    self.handleProductsWrapperDragged = function(returnedValue){

        //Remove our original 'costs' draggable from the DOM, as its contents will have changed. Create a new one
        self.allDraggables.pop();

        // Update our activeProductRates Array with our new rates
        self.activeProductRates(self.productsWithDetails()[self.activeProductIndex()].productDetails.Rates[0].RatedTerms);

        // And create a new draggable based on the updated contents of the dom element
        self.makeCardsDraggable($(self.columnData[1].domElement), self.columnData[1].callback, self.columnData[1].bindingValue);

        // And update our coverage and deductible vars
        self.activeCoverage(self.productsWithDetails()[self.activeProductIndex()].productDetails.Rates[0].RatedCoverage.DisplayName);
        self.activeDeductible(self.productsWithDetails()[self.activeProductIndex()].productDetails.Rates[0].RatedDeductible.DisplayName);

        // Get the length of our updated list of rates
        var elementChildrenCount = self.activeProductRates().length,
            draggableElement = $(self.columnData[1].domElement);

        //If our rates list is less than the top offset of the focus row, animate it to that position.
        if(elementChildrenCount < (self.defaultIndex + 1)){

            var offsetDifference = (self.defaultIndex) - elementChildrenCount;
            TweenMax.to(draggableElement, duration, {
                y: (offsetDifference + 1) * self.cardHeight,
            });
        } else {
            TweenMax.to(draggableElement, duration, {
                y: 0
            });
        }
    };

    self.handleCostWrapperDragged = function(returnedValue){
        //Set our activeCost Index
        self.activeRateIndex(returnedValue);
    };

    self.handleInputFilledOut = function(){
        console.log('One input filled out');
    };

    self.inputMarginTop = ko.observable(0);

    self.incrementInputIndex = function(data){
        if( data.index < self.formData.length -1 ) {
            data.isCurrent(false);
            self.formData[data.index + 1].isCurrent(true)
            self.activeInputIndex(data.index + 1);
            self.inputMarginTop( - (((self.activeInputIndex()) * self.cardHeight) - (self.cardHeight * self.defaultIndex)) );
        }
        return
    };

    self.decrementInputIndex = function(data){
        if( data.index > 0 ) {
            data.isCurrent(false);
            self.formData[data.index - 1].isCurrent(true);
            self.activeInputIndex(data.index - 1);
            self.inputMarginTop( - (((self.activeInputIndex()) * self.cardHeight) - (self.cardHeight * self.defaultIndex)) );
        }
        return
    };

    // Handles the user tapping the get quote button
    self.getQuote = function(){

        // Load our products
        self.loadProducts();
        // Make our cards draggable
        $.each(self.columnData, function(index){
            self.makeCardsDraggable($(self.columnData[index].domElement), self.columnData[index].callback, self.columnData[index].bindingValue);
        });

        TweenMax.to('.input-view', duration, {
            left: '-100%'
        });
        TweenMax.to('.products-view', duration, {
            left: 0
        });
    };

    /*
     *
     * UI Draggable
     *
     */

    // Each object in this array represents a column in our draggable UI - Included are the dom element to be selected, a reference to a callback and the KO observable that it updates.
    self.columnData = [
        {
            index: 0,
            domElement: '.products-wrapper',
            callback: self.handleProductsWrapperDragged,
            bindingValue: self.activeProductIndex
        },
        {
            index: 1,
            domElement: '.cost-wrapper',
            callback: self.handleCostWrapperDragged,
            bindingValue: self.activeRateIndex
        }
    ];

    self.formData = [
        {
            index: 0,
            inputValue: "vehicleVin",
            displayName: "VIN Number",
            isRequired: true,
            type: "text",
            callBack: function(){
                self.loadVehicleDetails(this.value());
            },
            value: ko.observable(),
            isCurrent: ko.observable(true),
            isComplete: ko.observable(false)

        },
        {
            index: 1,
            inputValue: "purchasePrice",
            displayName: "Purchase Price",
            isRequired: true,
            type: "text",
            callBack: false,
            value: ko.observable(),
            isCurrent: ko.observable(false),
            isComplete: ko.observable(false)

        },
        {
            index: 2,
            inputValue: "purchaseDate",
            displayName: "Purchase Date",
            isRequired: true,
            type: "text",
            callBack: false,
            value: ko.observable(),
            isCurrent: ko.observable(false),
            isComplete: ko.observable(false)

        },
        {
            index: 3,
            inputValue: "submit",
            displayName: "",
            isRequired: true,
            type: "button",
            callBack: function(){
                self.getQuote();
            },
            value: null,
            isCurrent: ko.observable(false),
            isComplete: ko.observable(false)

        }
    ];


    /*
    *
    * Data retrieval and object creation functions
    *
    */

    //Retrieve the vehicle details from the VIN
    self.loadVehicleDetails = function(VIN){

        console.log(VIN);

        var tempVIN = '3VW2K7AJ0FM30377';

        if(VIN) {
            var vehicleApi = 'https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/' + VIN + '?format=json';

            $.ajax({url: vehicleApi,
                success: function(result){
                    self.vehicleDetails(result.Results);
                },
                async: true});

            console.log(self.vehicleDetails());
        }
    };

    //load products
    self.loadProducts = function(){
        $.ajax({url: './mock_data/products.json',
            success: function(result){
                        $.each(result.products, function(index){

                            var productId = result.products[index].InternalProductId;

                            var productDetails = $.ajax({url: './mock_data/' + productId + '.json',
                                success: function(result) {
                                    return result
                                },
                                async: false});

                            var productObject = {
                                isSelected: ko.observable(false),
                                DisplayName: result.products[index].DisplayName,
                                InternalProductId: productId,
                                productDetails: productDetails.responseJSON
                            };

                            // Create an is selected observable for each of our rates
                            var rates = productObject.productDetails.Rates[0].RatedTerms;
                            $.each(rates, function(index){
                                rates[index].isSelected = ko.observable(false);
                            });

                            self.productsWithDetails.push(productObject);
                        });
                    },
            async: false});

        // Update other data vars
        self.activeProductRates(self.productsWithDetails()[self.activeProductIndex()].productDetails.Rates[0].RatedTerms);
        self.activeCoverage(self.productsWithDetails()[self.activeProductIndex()].productDetails.Rates[0].RatedCoverage.DisplayName);
        self.activeDeductible(self.productsWithDetails()[self.activeProductIndex()].productDetails.Rates[0].RatedDeductible.DisplayName);

        console.log(self.productsWithDetails());

        $.ajax({
            url: values.getProductsByVinURL,
            contentType: 'application/json',
            type: 'POST',
            headers: {
                Authorization: values.authToken
            },
            data: values.bodyData,
            success: function(data){
                console.log(data);
            },
            error: function(error){
                console.log(error);
            }
        });
    };


    //Makes the selected elements on the DOM draggable
    self.makeCardsDraggable = function(draggableElement, callBack, bindingValue){

        // Make our draggable columns draggable
        var elementChildren = $(draggableElement).children(),
            elementChildrenCount = $(elementChildren).length;

        // Set all our cards height to the self.cardHeight variable
        $(elementChildren).css({ height: self.cardHeight + 'px'});
        // Also set the height of our active-card-frame
        $('.active-card-frame').css({ height: self.cardHeight + 'px'});

        // Generate a list of snap values
        var snapArray = new Array();
        for(var i = -self.defaultIndex; i < elementChildrenCount - self.defaultIndex; i++){
            snapArray.push( -(i * self.cardHeight));
        }

        //If our rates list is less than the top offset of the focus row, animate it to that position.
        if(elementChildrenCount < (self.defaultIndex + 1)){

            var offsetDifference = (self.defaultIndex) - elementChildrenCount;
            TweenMax.to(draggableElement, duration, {
                y: (offsetDifference + 1) * self.cardHeight
            });
        } else {
            TweenMax.to(draggableElement, duration, {
                y: 0
            });
        }

        // Function to return the index of the card that is in the 'active-card-frame'
        var generateDraggableIndex = function(value01, value02){
            return Math.abs(Math.round((value01/value02)) - self.defaultIndex);
        };

        // Set the default binding values for the cards
        if( elementChildrenCount == 1){
            bindingValue(0);
        } else if ( elementChildrenCount == 2 ) {
            bindingValue(1);
        } else {
            bindingValue(self.defaultIndex);
        }

        var animateAllCards = function(children, index){
            $.each(children, function(i){
                if( i === index ){
                    $(elementChildren[i]).children().addClass('active-product');
                    TweenMax.to($(elementChildren[i]).children(), duration, {
                        opacity: 1,
                        transform: 'scale3d(1, 1, 1)'
                    });
                } else if (i === index - 1 || i === index + 1){
                    $(elementChildren[i]).children().removeClass('active-product');
                    TweenMax.to($(elementChildren[i]).children(), duration, {
                        opacity: 0.8,
                        transform: 'scale3d(0.95, 1, 1)'
                    });
                } else if (i === index - 2 || i === index + 2){
                    $(elementChildren[i]).children().removeClass('active-product');
                    TweenMax.to($(elementChildren[i]).children(), duration, {
                        opacity: 0.6,
                        transform: 'scale3d(0.9, 1, 1)'
                    });
                } else if (i === index - 3 || i === index + 3){
                    $(elementChildren[i]).children().removeClass('active-product');
                    TweenMax.to($(elementChildren[i]).children(), duration, {
                        opacity: 0.4,
                        transform: 'scale3d(0.85, 1, 1)'
                    });
                } else if (i === index - 4 || i === index + 4){
                    $(elementChildren[i]).children().removeClass('active-product');
                    TweenMax.to($(elementChildren[i]).children(), duration, {
                        opacity: 0.2,
                        transform: 'scale3d(0.8, 1, 1)'
                    });
                } else if (i < index - 4 || i > index + 4) {
                    $(elementChildren[i]).children().removeClass('active-product');
                    TweenMax.to($(elementChildren[i]).children(), duration, {
                        opacity: 0
                    });
                }
            });
        };


        // Call our animated card methods for the first time...
        animateAllCards(elementChildren, self.defaultIndex);

        // However, if the total number of children is less than our defaultIndex (2) the first one in the array needs to be set as 'active'
        if( elementChildrenCount <= self.defaultIndex ){
            if( elementChildrenCount == 1 || elementChildrenCount ==  self.defaultIndex ){
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
            throwProps:true,
            snap: snapArray,
            zIndexBoost: false,
            maxDuration: duration,
            onClick: function(){
                self.isDragging(true);
            },
            onDrag: function(){
                var draggableIndex = generateDraggableIndex(this.y, self.cardHeight);
                animateAllCards(elementChildren, draggableIndex);
                self.isDragging(true);
            },
            onThrowUpdate: function(){
                var draggableIndex = generateDraggableIndex(this.y, self.cardHeight);
                animateAllCards(elementChildren, draggableIndex);
                self.isDragging(true);
            },
            onThrowComplete: function(){
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
     * Showing and Hiding options drawer
     *
     */

    // Function to show or hide the selected-options-drawer
    self.showHideOptionsDrawer = function(){
        self.showSelectedProductsDrawer(!self.showSelectedProductsDrawer());
    };

    /*
     *
     * adding and remove products with rates
     *
     */

    // Add product with rate
    self.addProductWithRate = function(data){

        // First set our product isSelected observable to true
        self.productsWithDetails()[self.activeProductIndex()].isSelected(true);

        // Then loop through all of its rates and set all to false...
        var rates = self.productsWithDetails()[self.activeProductIndex()].productDetails.Rates[0].RatedTerms;
        $.each(rates, function(index){
            rates[index].isSelected(false);
        });
        // Finally set the rate at the activeRateIndex to true
        rates[self.activeRateIndex()].isSelected(true);
        // And updated our Aside observables
        self.generatePlanCostAndProductCount();
    };

    // Remove product with rate
    self.removeProductWithRate = function(index, data){
        // First set our product isSelected observable to false
        self.productsWithDetails()[index()].isSelected(false);

        // Then loop through all of its rates and set all to false...
        var rates = self.productsWithDetails()[index()].productDetails.Rates[0].RatedTerms;
        $.each(rates, function(index){
            rates[index].isSelected(false);
        });
        // And updated our Aside observables
        self.generatePlanCostAndProductCount();
    };

    // Keydown event listener which handles different key events
    self.listenForKeyDown = function(){
        $( "#commerceProductApp" ).keydown(function(event) {

            switch ( event.which ){

                // If user taps tab, we focus on next input
                case 9:
                    event.preventDefault();
                    self.incrementInputIndex( self.formData[self.activeInputIndex()] );
                    break;
            }
        });
    };


    /*
     *
     * Aside observables calculator
     *
     */

    self.generatePlanCostAndProductCount = function(){
        var totalPlanCost = 0;
        var productsCount = 0;
        $.each(self.productsWithDetails(), function(index){
            if(self.productsWithDetails()[index].isSelected()){
                productsCount ++;
                $.each(self.productsWithDetails()[index].productDetails.Rates[0].RatedTerms, function(i){
                    if(self.productsWithDetails()[index].productDetails.Rates[0].RatedTerms[i].isSelected()){
                        totalPlanCost += self.productsWithDetails()[index].productDetails.Rates[0].RatedTerms[i].DealerCost;
                    }
                });
            }
        });
        self.planCost(totalPlanCost);
        self.productCount(productsCount);
    };


    /*
     *
     * Initialize the project
     *
     */

    // This function bootstraps our page
    self.init = function(){
        // Set the top offset of our active area based on the self.defaultIndex;
        $('.active-card-frame').css({ top: self.defaultIndex * self.cardHeight + 'px' });
        // Add keydown event listeners to our app
        self.listenForKeyDown();
        // Animate the martinTop of our inputs container
        self.inputMarginTop( - (((self.activeInputIndex()) * self.cardHeight) - (self.cardHeight * self.defaultIndex)) );
    };

    // Inits the app once the document is ready
    $(document).ready(function(){
        self.init();
    });




    /*
     *
     * Return our revealing module
     *
     */

    return {
        // Input array
        activeInputIndex: self.activeInputIndex,
        inputMarginTop: self.inputMarginTop,
        incrementInputIndex: self.incrementInputIndex,
        decrementInputIndex: self.decrementInputIndex,
        getQuote: self.getQuote,
        vehicleDetails: self.vehicleDetails,
        formData: self.formData,

        // Products array
        isSearchingByPrice: self.isSearchingByPrice,
        productsWithDetails: self.productsWithDetails,
        activeProductIndex: self.activeProductIndex,
        activeProductRates: self.activeProductRates,
        isDragging: self.isDragging,

        // Aside vars
        planCost: self.planCost,
        monthlyCost: self.monthlyCost,
        productCount: self.productCount,
        loanTerm: self.loanTerm,
        showHideOptionsDrawer: self.showHideOptionsDrawer,
        showSelectedProductsDrawer :self.showSelectedProductsDrawer,
        addProductWithRate: self.addProductWithRate,
        removeProductWithRate: self.removeProductWithRate,
        activeCoverage: self.activeCoverage,
        activeDeductible: self.activeDeductible

    };
}

// Activates knockout.js
ko.applyBindings(new AppViewModel(), document.getElementById('commerceProductApp'));

// uat
// easycareuat
// U@Testing123
// APCO-02
// 4T1BF1FK7GU566533