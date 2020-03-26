const base64 = require('./base64');

var API = function() {}

// declare API endpoint
const EP = {
    prod : "https://708pnhz5z2.execute-api.ap-southeast-1.amazonaws.com/Prod",
    local : "http://localhost:3000"
}["local"];
// set prototype
API.prototype.get = function(path, query = {}){
    return new Promise((resolve, reject) => {
        // set headers
        var headerParams = {
            'Content-Type'  : 'application/json'
        };
        // get user id and token
        new Promise((_resolve, _reject) => {
            var queryString = "";
            if(Object.keys(query).length > 0) queryString = `?${Object.keys(query).map(key => { return `${key}=${query[key]}`}).join("&")}`;
            // login
            fetch(`${EP}${path}${queryString}`, { 
                method  : 'GET', 
                headers : new Headers(headerParams)
            })
            // get respoonse
            .then((response) => response.json())
            // get res's json format
            .then(resolve)
            // error ?
            .catch(error => reject({
                code     : 500,
                messages : [error]
            }));
        })
        // error
        .catch(reject);
    });
};
// set prototype
API.prototype.update = function(path, form = {}, auth = false){
    return new Promise((resolve, reject) => {
        // set headers
        var headerParams = {
            'Content-Type'  : 'application/json'
        };
        // get user id and token
        new Promise((_resolve, _reject) => {
            // craete request
            fetch(`${EP}${path}`, { 
                method  : 'PUT', 
                headers : new Headers(headerParams),
                body    : JSON.stringify(form)
            })
            // get respoonse
            .then((response) => response.json())
            // get res's json format
            .then(resolve)
            // error ?
            .catch(error => reject({
                code     : 500,
                messages : [error]
            }));
        })
        // error
        .catch(reject);
    });
};
// set prototype
API.prototype.create = function(path, form = {}, auth = false){
    return new Promise((resolve, reject) => {
        // set headers
        var headerParams = {
            'Content-Type'  : 'application/json'
        };
        // get user id and token
        new Promise((_resolve, _reject) => {
            // craete request
            fetch(`${EP}${path}`, { 
                method  : 'POST', 
                headers : new Headers(headerParams),
                body    : JSON.stringify(form)
            })
            // get respoonse
            .then((response) => response.json())
            // get res's json format
            .then(resolve)
            // error ?
            .catch(error => reject({
                code     : 500,
                messages : [error]
            }));
        })
        // error
        .catch(reject);
    });
};
// set prototype
API.prototype.delete = function(path, auth = false){
    return new Promise((resolve, reject) => {
        // set headers
        var headerParams = {
            'Content-Type'  : 'application/json'
        };
        // get user id and token
        new Promise((_resolve, _reject) => {
            // craete request
            fetch(`${EP}${path}`, { 
                method  : 'DELETE', 
                headers : new Headers(headerParams)
            })
            // get respoonse
            .then((response) => response.json())
            // get res's json format
            .then(resolve)
            // error ?
            .catch(error => reject({
                code     : 500,
                messages : [error]
            }));
        })
        // error
        .catch(reject);
    });
};

module.exports = new API();