/**
* Copyright 2013 STRATO AG
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
* http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* 
* 
* @description
* <h1>Strato HiDrive JavaScript SDK for the free account registration</h1>
* <h2>Basic Use</h2>
* <p>
* To start using the SDK just add this script to your HTML and initialize the client with your own:
* <ul>
* <li>productName</li>
* <li>product</li>
* <li>partnerId</li>
* <li>partnerRefId</li>
* <li>partnerSubId</li>
* </ul>
* </p>
* 
* <code>
* HD_REG.options({ 'productName': 'HiDriveFree' }); </br>
* HD_REG.options({ 'product': 'freemium' });</br>
* HD_REG.options({ 'partnerId': 'STRATO' });</br>
* HD_REG.options({ 'partnerRefId': 'HiDrive' });</br>
* HD_REG.options({ 'partnerSubId': 'PARTNER_SUB_ID' });</br>
* </code>
* 
*/
var HD_REG = (function () {
    "use strict";
    var version = '0.0.1',
        getFullUrl,
        sendRequest,
        getOrderApiUrl,
        post,
        order,
        options,
        has,
        xhr,
        opts = {
            'productName': null,
            'product': null,
            'partnerId': null,
            'partnerRefId': null,
            'partnerSubId': null
        };

    sendRequest = function (opt, successCb, errorCb) {
        var req = xhr(),
            headers,
            dataString;

        req.onreadystatechange = function () {
            if (req._canceled) { return; }

            if (req.readyState === 4) {
                if (req.status >= 200 && req.status < 300) {
                    successCb(req);
                } else {
                    errorCb(req);
                }
                req.onreadystatechange = function () { };
            }
        };

        req.open(opt.type || "GET", opt.url, true, opt.user, opt.password);
        req.responseType = opt.responseType || "";

        headers = { "Content-Type": "application/x-www-form-urlencoded" };

        opt.headers = opt.headers || headers;

        Object.keys(opt.headers || {}).forEach(function (k) {
            req.setRequestHeader(k, opt.headers[k]);
        });

        dataString = "postdata=";
        if (opt.data) {
            dataString += JSON.stringify(opt.data);
        }
        req.send(dataString);
    };

    /**
    * Makes a call to get the url for the ordering process.
    *
    * @access public
    * @function
    * @returns {String} Returns string with API url for ordering process.
    */
    getOrderApiUrl = function() {
        return "https://www.free-hidrive.com/order";
    };

    has = function (obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    };

    /**
    * Makes a call to get or sets configuration options.
    * <ul>
    * <li>productName</li>
    * <li>product</li>
    * <li>partnerId</li>
    * <li>partnerRefId</li>
    * <li>partnerSubId</li>
    * </ul>
    * @example
    * When this method is called with no parameters it will return all of the 
    * current options.
    *   var options = HD_REG.options();
    *
    * When this method is called with a string it will return the value of the option 
    * if exists, null if it does not.      
    *   var productName = HD_REG.options('productName');
    *
    * When this method is called with an object it will merge the object onto the previous 
    * options object.      
    *   HD_REG.options({productName: 'HiDriveFree'}); 
    *   HD_REG.options({product: 'freemium', partnerRefId: 'XYZ'}); //will set product and
    *                                                        partnerRefId options
    *   var productName = HD_REG.options('productName'); //will get the accessToken of 'XYZ'
    *
    * @access public
    * @function
    * @param {String} keyOrOptions Returns the value of the option if exists, null if it does not. The existing options are:
    * <ul>
    * <li> 'productName': product name. </li>
    * <li> 'product': Product. </li>
    * <li> 'partnerId': Partner ID.</li>
    * <li> 'partnerRefId': Partner reference ID.</li>
    * <li> 'partnerSubId': Partner Sub ID.</li>
    * </ul>
    * @returns {Object} When this method is called with no parameters it will return all of the current options e.g. HD_REG.options().
    * When this method is called with a string it will return the value of the option if exists, null if it does not e.g.options('productName').          
    */
    options = function (keyOrOptions) {
        var key;
        if (!keyOrOptions) {
            return opts;
        }
        if (Object.prototype.toString.call(keyOrOptions) === '[object String]') {
            return has(opts, keyOrOptions) ? opts[keyOrOptions] : null;
        }
        for (key in opts) {
            if (opts.hasOwnProperty(key)) {
                if (has(opts, key) && has(keyOrOptions, key)) {
                    opts[key] = keyOrOptions[key];
                }
            }
        }
    };

    /**
    * Makes a call to get the full url for the ordering process.
    *
    * @access public
    * @function
    * @param {String} [path] The path. Valid paths:
    * <ul>
    * <li> "/getcaptcha" : Get image with captcha.</li>
    * <li> "/check_username" : Check whether username is valid.</li>
    * <li> "/check_email" : Check whether email is valid</li>
    * <li> "/post_data" : Sending request for rigistration.</li>
    * </ul> 
    * @returns {String} Returns string with API url for ordering process.
    */
    getFullUrl = function (path) {
        var fullUrl = getOrderApiUrl();
        fullUrl += path;
        return fullUrl;
    };


    /**
    * POST Method.
    *
    *    @example
    *       For example, getting image with captcha 
    *
    *       var properties = { width: "167", height: "32", bgcolor: "#FFFFFF" };
    *       HD_REG.post("/getcaptcha", properties, function(response){
    *            if (response && response.gd_image) {
    *                var captchaPic = document.getElementById("register-captcha");
    *                if (captchaPic) {
    *                    captchaPic.setAttribute("src", 
    *                               "data:image/png;base64," + response.gd_image);
    *                }
    *            }
    *       }, function(){
    *
    *       }, function(){
    *
    *       });
    *   
    *   Sending request for registration: 
    *
    *       var properties = { data_values: {    agb_check: "true",
    *                                            email: "YOUR_EMAIL",
    *                                            username: "YOUR_USERNAME",
    *                                            password: "YOUR_PASSWORD",
    *                                            country: "PL",
    *                                            language: "eng",
    *                                            captcha_number: "123456",
    *                                            product_name: "HiDriveFree",
    *                                            product: "freemium",
    *                                            partner_id: "STRATO",
    *                                            partner_ref_id: "HiDrive",
    *                                            partner_sub_id: "PARTNER_SUB_ID"
    *                                        },
    *                                        country: "PL",
    *                                        language: "eng",
    *                                        product_name: "HiDriveFree",
    *                                        product: "freemium" };
    *       HD_REG.post("/post_data", properties, function(response){
    *           //Do something with response
    *       }, function(){
    *
    *       }, function(){
    *
    *       });
    *
    *   Check that the username is already registered:
    *
    *       var properties = {   username: "abc123",
    *                            country: "PL",
    *                            language: "eng",
    *                            product_name: "HiDriveFree",
    *                            product: "freemium",
    *                            partner_id: "STRATO",
    *                            partner_ref_id: "HiDrive",
    *                            partner_sub_id: "PARTNER_SUB_ID" };
    *       HD_REG.post("/check_username", properties, function(response){
    *           //Do something with response
    *       }, function(){
    *
    *       }, function(){
    *
    *       });
    *
    * @access public
    * @function
    * @param {String} [path] The path. Valid paths:
    * <ul>
    * <li> "/getcaptcha" : Get image with captcha.</li>
    * <li> "/check_username" : Check whether username is valid.</li>
    * <li> "/check_email" : Check whether email is valid</li>
    * <li> "/post_data" : Sending request for registration.</li>
    * </ul>  
    * @param {Object} [properties] A JSON object containing the properties. 
    * @param {Function} [successCb] The callback function that is invoked when API call is successful.
    * @param {Function} [errorCb] The callback function that is invoked when API call is failed.
    */
    post = function (path, properties, successCb, errorCb) {
        var absoluteUrl;

        absoluteUrl = getFullUrl(path);

        sendRequest({ type: "POST", url: absoluteUrl, data: properties }, function (result) {
            if ((result.status === 200 || result.status === 201 || result.status === 204)) {
                var obj = result.responseText;
                try {
                    obj = JSON.parse(obj);
                } catch (e) {
                } finally {
                    successCb(obj);
                }
            } else {
                errorCb(result);
            }
        }, function (result) {
            var obj = result.responseText;
            try {
                obj = JSON.parse(obj);
                obj.status = result.status;
            } catch (e) {
            }

            errorCb(obj);

        });
    };


    /**
    * Function for checking the username and email and sending request for registration  
    *
    *    @example
    *
    *       For example, sending request for registration:
    *
    *       var properties = {  agb_check: "true",
    *                           email: "YOUR_EMAIL",
    *                           username: "YOUR_USERNAME",
    *                           password: "YOUR_PASSWORD",
    *                           country: "PL",
    *                           language: "eng",
    *                           captcha_number: "123456" };
    *       HD_REG.order(properties, function(response){
    *           //Do something with response
    *       }, function(){
    *
    *       }, function(){
    *
    *       });
    *
    * @access public
    * @function
    * @param {String} [path] The path. Valid paths:
    * <ul>
    * <li> "/getcaptcha" : Get image with captcha.</li>
    * <li> "/check_username" : Check whether username is valid.</li>
    * <li> "/check_email" : Check whether email is valid</li>
    * <li> "/post_data" : Sending request for registration.</li>
    * </ul>  
    * @param {Object} [properties] A JSON object containing the properties. 
    * @param {Function} [successCb] The callback function that is invoked when API call is successful.
    * @param {Function} [errorCb] The callback function that is invoked when API call is failed.
    */
    order = function(properties, successCb, errorCb) {
        //check username
        post("/check_username", {
            username: properties.username,
            country: properties.country,
            language: properties.language,
            product_name: options('productName'),
            product: options('product'),
            partner_id: options('partnerId'),
            partner_ref_id: options('partnerRefId'),
            partner_sub_id: options('partnerSubId')
        }, function(resultUsername) {
            if (resultUsername && resultUsername.data) {
                if (resultUsername.data.return_code === 0) {
                    //check email
                    post("/check_email", {
                        email: properties.email,
                        country: properties.country,
                        language: properties.language,
                        product_name: options('productName'),
                        product: options('product'),
                        partner_id: options('partnerId'),
                        partner_ref_id: options('partnerRefId'),
                        partner_sub_id: options('partnerSubId')
                    }, function(resultEmail) {
                        if (resultEmail && resultEmail.data) {
                            if (resultEmail.data.return_code === 0) {
                                //registration
                                post("/post_data", {
                                    data_values: {
                                        agb_check: properties.agbcheck,
                                        email: properties.email,
                                        username: properties.username,
                                        password: properties.password,
                                        country: properties.country,
                                        language: properties.language,
                                        captcha_number: properties.captcha,
                                        product_name: options('productName'),
                                        product: options('product'),
                                        partner_id: options('partnerId'),
                                        partner_ref_id: options('partnerRefId'),
                                        partner_sub_id: options('partnerSubId')
                                    },
                                    country: properties.country,
                                    language: properties.language,
                                    product_name: options('productName'),
                                    product: options('product')
                                }, function(result) {
                                    if (result && result.data && result.data.return_code === 0) {
                                        //registration successfully
                                        successCb(result);
                                    } else if (result && result.data && result.data.return_code === 2) {
                                        errorCb({ error: "common-error" });
                                    } else {
                                        errorCb({ error: "error-summary", errors: result.data.errors });
                                    }
                                }, function(result) {
                                    if (result && result.data && result.data.return_code === 1) {
                                        errorCb({ error: "common-error" });
                                    } else {
                                        errorCb({ error: "common-error" });
                                    }
                                });
                            } else if (resultEmail.data.return_code === 1001) {
                                errorCb({ error: "email-exists" });
                            } else {
                                errorCb({ error: "email-invalid" });
                            }
                        } else {
                            errorCb({ error: "email-invalid" });
                        }
                    }, function(result) {
                        if (result && result.data && result.data.return_code === 1) {
                            errorCb({ error: "email-exists" });
                        } else {
                            errorCb({ error: "common-error" });
                        }
                    });
                } else {
                    if (resultUsername.data.errors && resultUsername.data.errors.length > 0) {
                        errorCb({ error: "username-invalid" });
                    } else {
                        errorCb({ error: "username-exists" });
                    }
                }
            } else {
                errorCb({ error: "common-error" });
            }
        },  function(result) {
            if (result && result.data && result.data.return_code === 1) {
                errorCb({ error: "username-exists" });
            } else {
                errorCb({ error: "common-error" });
            }
        });
    };

    xhr = function () {
        try {
            var request = new XMLHttpRequest();
            if("withCredentials" in xhr) 
                return request;
            else if (typeof XDomainRequest != "undefined")
                return new XDomainRequest();
            else 
                throw new Error('Browser is not CORS capable');
        } catch (e) {
            throw new Error('Browser is not CORS capable');
        }
    };

    //namespace
    return {
        options: options,
        getOrderApiUrl: getOrderApiUrl,
        version: version,
        post: post,
        order: order,
        getFullUrl: getFullUrl
    };
})();
