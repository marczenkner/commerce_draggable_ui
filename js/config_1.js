module.exports = {
    products: {
        url: 'https://tlcsvcapi.uat.taillight.xyz/RSS.SPAN.BusinessServices/restvehicleproductsvc.svc/RetrieveVehicleProductsByVIN',
        authToken: 'eyJ0eXAiOiJVU0VSQUNDT1VOVCIsImFsZyI6Mn0.eyJqdGkiOiI5OTZlMmE0MC1hODVmLTQ2YzktYTQ0ZS1kNjU4NGJjYjAyMjQiLCJzdWIiOiI1NjIwZmQxZmMyNTcxNzFmZWMxOWYzMjY7ZWFzeWNhcmVhZG1pbjs1NjE2YTU5ZDQ5M2ZiNzFiZGMxNDkyYTUiLCJhdWQiOiJyaXN0a2VuLmNvbSIsIm5iZiI6IjE1MjAzNjk5NDgiLCJleHAiOiIxNTIwNDU2MzQ4IiwiQ2xhaW1zIjpbeyJLZXkiOiJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiLCJWYWx1ZSI6IlNQQU4gQURNSU4ifV19.okOG2OGJCmCDkOU1l3kRdCGnnsNqaAGrJyS4VN7YBH4=',
        tempBodyData: {
            dateOfSale: '2018-03-06',
            dealerAccountCode: '014996',
            makeModelInfo: null,
            partnerSpecificEligibility: [{"key": "dealSaleType", "value": "RetailFinanced"}],
            productPlanType: null,
            providerCode: 'EASYCARE',
            vehicleCertification: 'None',
            vehicleIdentificationNumber: '1FT7W2B69GEA00053',
            vehicleInservice: null,
            vehicleOdometer: '1000',
            vehicleUsageTypes: ['Personal'],
            quoteSessionNumber: '94763b6d-5429-4c2f-9876-55a46821b9e7',
            productCodeFilters: null
        }
    },
    rates: {
        url: 'https://tlcsvcapi.uat.taillight.xyz/rss.span.businessservices/restvehicleratesvc.svc/RetrieveVehicleRates',
        authToken: 'eyJ0eXAiOiJVU0VSQUNDT1VOVCIsImFsZyI6Mn0.eyJqdGkiOiJlNTE4Njk2MC1lYzc2LTRkZjctOTY2YS1iMDY5Y2E0ODY1ZDUiLCJzdWIiOiI1NjIwZmQxZmMyNTcxNzFmZWMxOWYzMjY7ZWFzeWNhcmVhZG1pbjs1NjE2YTU5ZDQ5M2ZiNzFiZGMxNDkyYTUiLCJhdWQiOiJyaXN0a2VuLmNvbSIsIm5iZiI6IjE1MjY2NjYxOTIiLCJleHAiOiIxNTI2NzUyNTkyIiwiQ2xhaW1zIjpbeyJLZXkiOiJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiLCJWYWx1ZSI6IlNQQU4gQURNSU4ifSx7IktleSI6Imh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSIsIlZhbHVlIjoiUE9SVEFMIEFETUlOIn1dfQ.19WgLXhzHgX6rPiQjRktGRNFZeW6xre71NtN0VJVZgs=',
        postmanToken: {
            key: 'Postman-Token',
            value: 'a9834658-8490-07c0-6f58-ca47bbcb5474'
        },
        cacheControl: {
            key: 'Cache-Control',
            value: 'no-cache'
        },


        tempBodyData: {
            dateOfSale: '2018-05-18',
                dealerAccountCode: '014996',
            eligibilitySessionID: null,
            partnerSpecificEligibility: [],
            productPlanType: null,
            productsToRate: [
            {
                PartnerSpecificFields: {
                    FlexFields: [
                        {
                            FieldName: 'SORTORDER',
                            FieldType: 2,
                            FieldValue: '2'
                        }
                    ]
                },
                ApplicationCode: 'C1032605',
                BaseNoUpgradeProduct: null,
                CertificationType: 0,
                DisplayName: 'EC Select Plus 6 StandAlone 2014 (US):2605',
                InternalProductId: 'C1032605',
                InternalProductVersionId: null,
                InternalRatingProgramId: null,
                IsDealerException: false,
                IsInserviceRequired: false,
                IsNewCoverage: false,
                IsVehicleFinancialsRequired: false,
                IsWrapCoverage: false,
                ParentProductType: {
                    PartnerSpecificFields: {
                        FlexFields: []
                    },
                    ApplicationCode: 'ECSP',
                    ApplicationSubCode: null,
                    DisplayName: null,
                    InternalProductTypeId: null,
                    ParentProductRatingCategory: {
                        PartnerSpecificFields: {
                            FlexFields: [
                                {
                                    FieldName: 'COMMERCE-RATE-TYPE',
                                    FieldType: 2,
                                    FieldValue: 'ECSP'
                                }
                            ]
                        },
                        Abbreviation: 'ECSP',
                        ApplicationCode: 'ECSP',
                        DisplayName: null
                    },
                    PartnerCode: 'ECSP',
                    ProfitSettingCategoryName: null,
                    SettingDependentSubCode: null,
                    UpgradesInternalProductTypeId: null
                },
                PartnerCode: 'C1032605',
                ProductCoverages: [
                    {
                        CoverageDeductibles: [
                            {
                                ProductDeductible: {
                                    PartnerSpecificFields: {
                                        FlexFields: []
                                    },
                                    Abbreviation: '000',
                                    DisplayName: '0.00',
                                    InternalDeductibleId: '0.00',
                                    NumericValue: 0,
                                    PartnerCode: '0.00'
                                }
                            }
                        ],
                        ProductCoverage: {
                            PartnerSpecificFields: {
                                FlexFields: []
                            },
                            Abbreviation: 'T.SelectPlus',
                            Description: 'SelectPlus Time only',
                            DisplayName: 'SelectPlus: Time only',
                            InternalCoverageId: 'T.SelectPlus',
                            IsLWBaseCoverage: false,
                            NumericValue: 0,
                            PartnerCode: 'T.SelectPlus'
                        },
                        ProductTerms: null
                    }
                ],
                ProductOptions: [],
                RateCalculationMethod: 0,
                SortOrder: '2',
                UpgradeProducts: null
            }
        ],
            providerCode: 'EASYCARE',
            vehicleCertification: 'None',
            vehicleFinancials: {
            AmountFinanced: 0,
                DMSDealNumber: '',
                DaysToFirstPayment: 0,
                FinancedAPR: 0,
                FinancedTermMonths: 0,
                FirstPaymentDate: '',
                LenderAddress1: null,
                LenderAddress2: null,
                LenderCity: null,
                LenderCode: null,
                LenderEmail: null,
                LenderName: null,
                LenderPhone: null,
                LenderState: null,
                LenderZip: null,
                MSRP: 0,
                MoneyFactor: 0,
                PurchasePrice: 0,
                StockNumber: '',
                VehicleSaleType: 'RetailFinanced'
        },
            vehicleInservice: null,
                vehicleOdometer: '2500',
            vehicleToRate: {
            InternalMakeId: 'FORD',
                InternalModelId: '1FT7W2B69G',
                MakeName: '',
                ModelName: null,
                ModelYear: 2016,
                VehicleIdentification: '1FT7W2B69GEA00053'
        },
            vehicleUsageTypes: [
                'Personal'
            ],
                quoteSessionNumber: 'd219be83-c5d8-4fcd-9dc7-f0c36c8fa409'
        }
    }
};



