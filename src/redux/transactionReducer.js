import * as types from './types' 

export const initState = {
    productFlowStock: null, 
    productsData: null,
    cashflowInfoOut: null,
    cashflowInfoIn: null,
    cashflowDetail: null,
    productSalesData: null,
    productSalesDetails: null,
    transactionYears: [new Date().getFullYear(), new Date().getFullYear()]
};

export const reducer = (state = initState, action) => {

    //update trx year
    if (action != null && action.payload != null && action.payload.transactionYears != null) {
        state.transactionYears = action.payload.transactionYears;
    }
    let result = state;
    switch (action.type) {
       
 
        case types.RESET_PRODUCTS:
            return { ...state, productsData: null };

        case types.GET_CASHFLOW_INFO:
            result = state;

            if (action.payload.entity.module == "OUT") {
                result.cashflowInfoOut = action.payload.entity;
            }
            if (action.payload.entity.module == "IN") {
                result.cashflowInfoIn = action.payload.entity;
            }

            return result;

        case types.GET_CASHFLOW_DETAIL:
            return { ...state, cashflowDetail: action.payload };
        case types.GET_PRODUCT_SALES:
            let currentProductSalesData = action.payload;
            if (action.loadMore == true) {
                currentProductSalesData = state.productSalesData;
                let loadedProductList = action.payload.entities;
                for (let i = 0; i < loadedProductList.length; i++) {
                    currentProductSalesData.entities.push(loadedProductList[i]);
                }
            }
            console.log("will update currentProductSalesData: ", currentProductSalesData.entities.length);
            result = { ...state, productSalesData: currentProductSalesData };
            action.referrer.refresh();
            return result; 
        case types.GET_PRODUCT_SALES_DETAIL:
            return { ...state, productSalesDetails: action.payload };
        default:
            return { ...state };
    }
}

export default reducer;