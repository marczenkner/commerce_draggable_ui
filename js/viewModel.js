const config = require('./config_1.js');
const dataService = require('./fetchData.js');

function AppViewModel() {

    var self = this;

    // The starting position of the app - This sets how many 'cards' from the top the 'focus' section is plus a 'cardHeight' in Pixels
    self.defaultIndex = 2;
    self.cardHeight = 180;
    self.inputMarginTop = ko.observable(0);

    // Local variable for our animation duration
    var duration = 0.25;

    // Temp Loan term var
    self.loanTerm = ko.observable(48);

    // Boolean value that decides if the user is searching by price, or by term and miles
    self.displayDataType = ko.observable('Price');

    // Boolean to stop certain user events if draggable or throw is happening
    self.isDragging = ko.observable(false);

    //Array that we use to store our draggables in so that we can garbage collect later
    self.allDraggables = [];

    // This array is our main source of Data for the app
    self.productsWithDetails = ko.observableArray();
    self.activeProductRates = ko.observableArray();
    self.activeProductTerms = ko.observableArray();
    self.activeProductMiles = ko.observableArray();

    // Vars for setting the indexes
    self.activeProductIndex = ko.observable(self.defaultIndex);
    self.activeRateIndex = ko.observable(self.defaultIndex);
    self.activeTermIndex = ko.observable(self.defaultIndex);
    self.activeMilesIndex = ko.observable(self.defaultIndex);
    self.activeInputIndex = ko.observable(0);

    self.activeTermValue = ko.observable(0);
    self.activeMilesValue = ko.observable(0);

    // Vars for display Coverages and Deductibles and other information
    self.activeCoverage = ko.observable();
    self.activeDeductible = ko.observable();

    self.vehicleDetails = ko.observable();

    self.planCost = ko.observable(0);
    self.productCount = ko.observable(0);
    self.planCount = ko.observable(0);
    self.selectedProductCount = ko.observable(0);
    self.monthlyCost = ko.computed(function(){
        return (self.planCost() / self.loanTerm()).toFixed(2)
    });

    // Error message and busy page vars
    self.searchVinView = ko.observable(true);
    self.errorMessage = ko.observable('');
    self.pageBusy = ko.observable(false);
    self.showSelectedProductsDrawer = ko.observable(false);
    /*
     *
     *  Event handler callbacks that get triggered once a column on the UI completes its 'drag'
     *
     */
    // Handle completion of products dragged
    self.handleProductsWrapperDragged = function(){
        console.log('Producgs Wrapper dragged');
    };

    self.handleCostWrapperDragged = function(){
        console.log('Cost Wrapper dragged');
    };

    self.handleInputFilledOut = function(){
        console.log('One input filled out');
    };

    self.handleTermWrapperDragged = function(){
        console.log('Term wrapper dragged');
    };

    self.handleMilesWrapperDragged = function(){
        console.log('Miles wrapper dragged');
    };

    // Every time a user changes the display data type on the UI, we need to update our draggables, hence the subscribe function
    self.displayDataType.subscribe(function(){

        switch (self.displayDataType()) {

            // If the user wants to sort the UI by 'Miles'
            case 'Miles':

                //Remove all draggable objects except our products wrapper and prices wrapper, as we will be recreating these
                $.each(self.allDraggables, function(fooIndex){
                    if(fooIndex > 0){
                        self.allDraggables.pop();
                    }
                });

                self.activeProductTerms.removeAll();
                self.activeProductMiles.removeAll();

                // Re-populate our activeProductMiles array
                $.each(self.activeProductRates(), function(i) {
                    if (!self.activeProductMiles().includes(self.activeProductRates()[i].RatedTerm.TermMiles)) {
                        self.activeProductMiles.push(self.activeProductRates()[i].RatedTerm.TermMiles);
                        console.log(self.activeProductRates()[i].RatedTerm);
                        // Sort our terms in ascending order
                        self.activeProductMiles(self.activeProductMiles().sort(function (a, b) {
                            return a - b
                        }));
                        self.activeMilesValue(self.activeProductTerms()[self.activeMilesIndex()]);
                    }
                });

                // Re-populate our activeProductTerms array with only the terms for a given mileage
                $.each(self.activeProductRates(), function(i) {
                    if (self.activeProductMiles()[self.defaultIndex] === self.activeProductRates()[i].RatedTerm.TermMiles) {
                        self.activeProductTerms.push(self.activeProductRates()[i].RatedTerm.TermMiles);
                    }
                });

                // And create new draggables based on the updated contents of the dom element
                $.each(self.columnData, function(draggableIndex){
                    if( draggableIndex > 0 ) {
                        self.makeCardsDraggable($(self.columnData[draggableIndex].domElement), self.columnData[draggableIndex].callback, self.columnData[draggableIndex].bindingValue);
                    }
                });

                // The re-populate our terms with only those terms that match the current miles

                break;

            case 'Term':

                self.activeProductTerms.removeAll();
                self.activeProductMiles.removeAll();

                // Re-populate our activeProductTerms array
                $.each(self.activeProductRates(), function(i) {
                    if (!self.activeProductTerms().includes(self.activeProductRates()[i].RatedTerm.TermMonths)) {
                        self.activeProductTerms.push(self.activeProductRates()[i].RatedTerm.TermMonths);
                        // Sort our terms in ascending order
                        self.activeProductTerms(self.activeProductTerms().sort(function (a, b) {
                            return a - b
                        }));
                        self.activeTermValue(self.activeProductTerms()[self.activeTermIndex()]);
                    }
                });

                break;

            case 'Price':



                break;

        }

    });

    /*
     *
     * draggable column index subscribers - this is how we update the UI - by listening to changes to the indexes which are called on the end of a draggable.
     *
     */

    // Subscribe to changes to the activeProductIndex
    self.activeProductIndex.subscribe(function(){

        //Remove all draggable objects except our products wrapper, as we will be recreating these
        $.each(self.allDraggables, function(fooIndex){
            if(fooIndex > 0){
                self.allDraggables.pop();
            }
        });

        // Update our activeProductRates Array with our new rates
        self.activeProductRates(self.productsWithDetails()[self.activeProductIndex()].Rates);

        // Reset our activeProductTerms and activeProductMiles
        self.activeProductTerms.removeAll();
        self.activeProductMiles.removeAll();

        // Update our terms and miles arrays
        $.each(self.activeProductRates(), function(i){

            // Populate our activeProductTerms array
            if(!self.activeProductTerms().includes(self.activeProductRates()[i].RatedTerm.TermMonths)){
                self.activeProductTerms.push(self.activeProductRates()[i].RatedTerm.TermMonths);
                // Sort our terms in ascending order
                self.activeProductTerms(self.activeProductTerms().sort(function(a, b){return a-b}));
                self.activeTermValue(self.activeProductTerms()[self.activeTermIndex()]);
            }

            // Populate our activeProductMiles array
            if(!self.activeProductMiles().includes(self.activeProductRates()[i].RatedTerm.TermMiles)){
                self.activeProductMiles.push(self.activeProductRates()[i].RatedTerm.TermMiles);
                // Sort our terms in ascending order
                self.activeProductMiles(self.activeProductMiles().sort(function(a, b){return a-b}));
                self.activeMilesValue(self.activeProductTerms()[self.activeMilesIndex()]);
            }

        });

        // And create new draggables based on the updated contents of the dom element
        $.each(self.columnData, function(draggableIndex){
            if( draggableIndex > 0 ) {
                self.makeCardsDraggable($(self.columnData[draggableIndex].domElement), self.columnData[draggableIndex].callback, self.columnData[draggableIndex].bindingValue);
            }
        });
        console.log(self.activeProductRates());
    });

    self.activeTermIndex.subscribe(function(){
        console.log('self.activeTermIndex called and value is ' + self.activeProductIndex());
    });

    self.activeMilesIndex.subscribe(function(){
        console.log('self.activeMilesIndex called and value is ' + self.activeTermIndex());
    });

    self.activeRateIndex.subscribe(function(){
        console.log('self.activeRateIndex called and value is ' + self.activeRateIndex());
    });

    self.activeInputIndex.subscribe(function(){
        console.log('self.activeInputIndex called and value is ' + self.activeInputIndex());
    });


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
        },
        {
            index: 2,
            domElement: '.term-wrapper',
            callback: self.handleTermWrapperDragged,
            bindingValue: self.activeTermIndex
        },
        {
            index: 3,
            domElement: '.miles-wrapper',
            callback: self.handleMilesWrapperDragged,
            bindingValue: self.activeMilesIndex
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
                self.getProductsForVin(self.formData[0].value());
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

        if(VIN) {
            var vehicleApi = 'https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/' + VIN + '?format=json';

            $.ajax({url: vehicleApi,
                success: function(result){
                    self.vehicleDetails(result.Results);
                },
                async: true});

        }
    };

    // Gets all products for our VIN
    self.getProductsForVin = function(VIN){

        // Set our pageBusy UI Var
        self.pageBusy(true);

        // Empty our product object first
        self.productsWithDetails([]);

        // Define the values we need to get products for our vin
        const path = config.products.url;
        const method = 'POST';
        const contentType = 'application/json';
        const authorization = config.products.authToken;
        const bodyData = config.products.tempBodyData;

        // If we have a VIN from the UI, use this one instead - mock data object has a hard-coded vin as a fallback
        if(VIN){
            bodyData.vehicleIdentificationNumber = VIN;
        }

        // Make a call to our getProducts method
        dataService.getProducts(path, method, contentType, authorization, bodyData)
            .then(function(data){

                self.productCount(data.Products.length);

                $.each(data.Products, (index)=>{

                    data.Products[index].isSelected = ko.observable(false);
                    data.Products[index].Rates = [];

                    // Define the values we need to get rates for our products
                    const path = config.rates.url;
                    const method = 'POST';
                    const contentType = 'application/json';
                    const authorization = config.rates.authToken;
                    const bodyData = config.rates.tempBodyData;

                    bodyData.productsToRate[0].InternalProductId = data.Products[index].InternalProductId;
                    bodyData.productsToRate[0].ApplicationCode = data.Products[index].InternalProductId;

                    const cacheControl = 'no-cache';
                    const postmanToken = 'a5a12bf3-5601-86fe-f7ae-93b8540e6c72';

                    // Call our getRatesForProduct method once for each product
                    dataService.getRatesForProduct(path, method, contentType, authorization, cacheControl, postmanToken, bodyData, data.Products[index].InternalProductId)
                        .then(function(rates){

                            // Add an isSelected observable to each of our rates
                            $.each(rates.Rates[0].RatedTerms, function(i){
                                rates.Rates[0].RatedTerms[i].isSelected = ko.observable(false);
                                data.Products[index].Rates.push(rates.Rates[0].RatedTerms[i]);
                            });
                        })
                        .then(function(){
                            // Update our activeProductRates Array with our new rates
                            self.activeProductRates(self.productsWithDetails()[self.activeProductIndex()].Rates);

                            // Update our planCount var
                            self.planCount(self.productsWithDetails()[self.activeProductIndex()].Rates.length);

                            // Set our activeMilesValue and activeTermValue
                            //self.activeMilesValue();
                            //self.activeTermValue();
                        })
                        .then(function(){

                            self.activeProductTerms.removeAll();
                            self.activeProductMiles.removeAll();
                            // Add an isSelected observable to each of our rates
                            $.each(self.activeProductRates(), function(i){

                                // Populate our activeProductTerms array
                                if(!self.activeProductTerms().includes(self.activeProductRates()[i].RatedTerm.TermMonths)){
                                    self.activeProductTerms.push(self.activeProductRates()[i].RatedTerm.TermMonths);
                                    // Sort our terms in ascending order
                                    self.activeProductTerms(self.activeProductTerms().sort(function(a, b){return a-b}));
                                    self.activeTermValue(self.activeProductTerms()[self.activeTermIndex()]);
                                }

                                // Populate our activeProductMiles array
                                if(!self.activeProductMiles().includes(self.activeProductRates()[i].RatedTerm.TermMiles)){
                                    self.activeProductMiles.push(self.activeProductRates()[i].RatedTerm.TermMiles);
                                    // Sort our terms in ascending order
                                    self.activeProductMiles(self.activeProductMiles().sort(function(a, b){return a-b}));
                                    self.activeMilesValue(self.activeProductTerms()[self.activeMilesIndex()]);
                                }
                            });
                        });

                    // Update our observable array with the data
                    self.productsWithDetails.push(data.Products[index]);

                });

                // Temporarily using a timeout until I get the promise sorted
                setTimeout(function(){
                        $.each(self.columnData, function(draggableIndex){
                            self.makeCardsDraggable($(self.columnData[draggableIndex].domElement), self.columnData[draggableIndex].callback, self.columnData[draggableIndex].bindingValue);
                        });
                        // Turn off our pageBusy var
                        self.pageBusy(false);
                }, 1000);

                console.log(self.productsWithDetails());
            });


        // Animated our views so that we go to scroll view.
        self.searchVinView(false);
    };


    //Makes the selected elements on the DOM draggable
    self.makeCardsDraggable = function(draggableElement, callBack, bindingValue){

        console.log('makeCardsDraggable called for ' + draggableElement);

        // Make our draggable columns draggable
        var elementChildren = $(draggableElement).children(),
            elementChildrenCount = $(elementChildren).length;

        self.setCardHeightDraggableOffset(elementChildren);

        // Generate a list of snap values - our Draggable object needs this to know where to snap to on dragging and throwing
        var snapArray = new Array();
        for(var i = -self.defaultIndex; i < elementChildrenCount - self.defaultIndex; i++){
            snapArray.push( -(i * self.cardHeight));
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

        // Function to set values on cards that are not the current card - Right now just opacity
        var animateAllCards = function(children, index){

            $.each(children, function(i){

                if( i === index ){
                    $(elementChildren[i]).children().addClass('active-product');
                    TweenMax.to($(elementChildren[i]).children().children('.card-content-overlay'), duration, {
                        opacity: 0
                        // transform: 'scale3d(1, 1, 1)'
                    });
                } else if (i === index - 1 || i === index + 1){
                    $(elementChildren[i]).children().removeClass('active-product');
                    TweenMax.to($(elementChildren[i]).children().children('.card-content-overlay'), duration, {
                        opacity: 1
                        // transform: 'scale3d(0.95, 1, 1)'
                    });
                } else if (i === index - 2 || i === index + 2){
                    $(elementChildren[i]).children().removeClass('active-product');
                    TweenMax.to($(elementChildren[i]).children().children('.card-content-overlay'), duration, {
                        opacity: 1
                        // transform: 'scale3d(0.9, 1, 1)'
                    });
                } else if (i === index - 3 || i === index + 3){
                    $(elementChildren[i]).children().removeClass('active-product');
                    TweenMax.to($(elementChildren[i]).children().children('.card-content-overlay'), duration, {
                        opacity: 1
                        // transform: 'scale3d(0.85, 1, 1)'
                    });
                } else if (i === index - 4 || i === index + 4){
                    $(elementChildren[i]).children().removeClass('active-product');
                    TweenMax.to($(elementChildren[i]).children().children('.card-content-overlay'), duration, {
                        opacity: 1
                        // transform: 'scale3d(0.8, 1, 1)'
                    });
                } else if (i < index - 4 || i > index + 4) {
                    $(elementChildren[i]).children().removeClass('active-product');
                    TweenMax.to($(elementChildren[i]).children().children('.card-content-overlay'), duration, {
                        opacity: 1
                    });
                } else {
                    $(elementChildren[i]).children().removeClass('active-product');
                    TweenMax.to($(elementChildren[i]).children().children('.card-content-overlay'), duration, {
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
                TweenMax.to($(elementChildren[0]).children('.card-content').children('.card-content-overlay'), duration, {
                    opacity: 0,
                    transform: 'scale3d(1, 1, 1)',
                    border: 'solid 2px green'
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

        //If draggable item lists is shorter than the top offset of the focus row, animate it to that position.
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

        //Push all draggables to an array so that we can access them later.
        self.allDraggables.push(newDraggable);
    };

    // Function that sets the height of each card based off of our cardHeight Var, as as the topoffset of each draggable Container.
    self.setCardHeightDraggableOffset = function(elementChildren){

        // Set all our cards height to the self.cardHeight variable
        $(elementChildren).css({ height: self.cardHeight + 'px'});
        // Also set the height of our active-card-frame
        $('.active-card-frame').css({ height: self.cardHeight + 'px'});

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
        var rates = self.productsWithDetails()[self.activeProductIndex()].Rates;
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
        var rates = self.productsWithDetails()[index()].Rates;
        $.each(rates, function(index){
            rates[index].isSelected(false);
        });
        // And updated our Aside observables
        self.generatePlanCostAndProductCount();
    };

    // Handle going back to search page view
    self.backToSearch = function(){
        // Toggle our Views
        self.searchVinView(true);
        // Animate the martinTop of our inputs container
        $.each(self.formData, function(index){
            self.formData[index].isCurrent(false);
            if(index === 0){
                self.formData[index].isCurrent(true);
            }
        });
        self.inputMarginTop(self.defaultIndex * self.cardHeight );
        // And re-add our event listener to the 'tab' keydown
        self.listenForKeyDown();
    };

    // Decide what type of sorting the user wants to use
    self.setValueType = function(data){
        self.displayDataType(data);
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

                // If the users taps 'enter' and we are in the searchVinView and on the last input (submit button) call the function that loads products
                case 13:
                    if( self.searchVinView() && self.activeInputIndex() === (self.formData.length - 1) ){
                        event.preventDefault();
                        self.getProductsForVin(self.formData[0].value());
                    }
                    break;

            }
        });
    };

    // Handle when a user clicks on the up or down arrows on the input screen
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
                $.each(self.productsWithDetails()[index].Rates, function(i){
                    if(self.productsWithDetails()[index].Rates[i].isSelected()){
                        totalPlanCost += self.productsWithDetails()[index].Rates[i].DealerCost;
                    }
                });
            }
        });
        self.planCost(totalPlanCost);
        self.selectedProductCount(productsCount);
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
        // Set the top of our button
        $('.add-product').css({ top: ((self.defaultIndex * self.cardHeight) + self.cardHeight/2) - 32 + 'px' });
        // Set the top of the my-plan div
        $('.my-plan').css({ top: ((self.defaultIndex + 1 ) * self.cardHeight) + 'px' });
        // Add keydown event listeners to our app
        self.listenForKeyDown();
        // Animate the martinTop of our inputs container
        self.inputMarginTop( - (((self.activeInputIndex()) * self.cardHeight) - (self.cardHeight * self.defaultIndex)) );
        // Focus on the first input in our input list

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
        //App vars
        searchVinView: self.searchVinView,
        errorMessage: self.errorMessage,
        pageBusy: self.pageBusy,
        cardHeight: self.cardHeight,

        // Input array
        activeInputIndex: self.activeInputIndex,
        inputMarginTop: self.inputMarginTop,
        incrementInputIndex: self.incrementInputIndex,
        decrementInputIndex: self.decrementInputIndex,
        vehicleDetails: self.vehicleDetails,
        formData: self.formData,

        // Products array
        productsWithDetails: self.productsWithDetails,
        activeProductIndex: self.activeProductIndex,
        activeRateIndex: self.activeRateIndex,
        activeTermIndex: self.activeTermIndex,
        activeMilesIndex: self.activeMilesIndex,
        activeTermValue: self.activeTermValue,
        activeMilesValue: self.activeMilesValue,
        activeProductRates: self.activeProductRates,
        activeProductTerms: self.activeProductTerms,
        activeProductMiles: self.activeProductMiles,
        isDragging: self.isDragging,
        backToSearch: self.backToSearch,

        // Aside and UI vars
        displayDataType: self.displayDataType,
        planCost: self.planCost,
        monthlyCost: self.monthlyCost,
        selectedProductCount: self.selectedProductCount,
        productCount: self.productCount,
        planCount: self.planCount,
        loanTerm: self.loanTerm,
        setValueType: self.setValueType,
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