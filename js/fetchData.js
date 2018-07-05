module.exports = {
    getProducts: function(path, method, contentType, authorization, bodyData){
        // console.log(bodyData.vehicleIdentificationNumber);
        return new Promise((resolve, reject) => {
            fetch(path, {
                headers: {
                    'content-type': contentType,
                    'Authorization': authorization
                },
                body: JSON.stringify(bodyData),
                method: method,

            })
                .then(res => res.json())
                .then((data) => {
                    resolve(data);
                })
        });
    },
    getRatesForProduct: function(path, method, contentType, authorization, cacheControl, postmanToken, bodyData, productId){
        // console.log('getRatesForProduct called with id ' + productId);
        return new Promise((resolve, reject) => {
            fetch(path, {
                    headers: {
                        'content-type': contentType,
                        'Authorization': authorization,
                        'Cache-Control': cacheControl,
                        // 'Postman-Token': postmanToken
                    },
                    body: JSON.stringify(bodyData),
                    method: method
                })
                .then(res => res.json())
                .then((data) =>{
                    resolve(data);
                });
        });
    }
};