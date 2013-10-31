
# HiDrive JavaScript SDK for the free account registration #
## Introduction ##

The [HiDrive JavaScript SDK for the free account registration] lets you easily integrate HiDrive Ordering API into your website or web app.

##Installation##

This section describes the basic steps for installing the HiDrive JavaScript SDK for the free account registration.

### Get the HiDrive JavaScript SDK for the free account registration
To get the source code of the SDK via git just type:

    git clone https://github.com/HiDrive/hidrive-reg-js-sdk.git
    cd ./hidrive-reg-js-sdk
    
### Use the HiDrive JavaScript SDK for the free account registration components on your web page
To use the components from the HiDrive JavaScript SDK for the free account registration on your web page, just include the **reg_sdk.js** or **reg_sdk.min.js** file in
your code.

For example, include one of the following tags in your code:

    <script type="text/javascript" src="/yourpath/reg_sdk.js"></script>

Or:

    <script type="text/javascript" src="/yourpath/reg_sdk.min.js"></script>

##Usage##

###Basic use

hidrive-reg-js-sdk is exposed as a global variable `HD_REG`.

To start using the SDK just add this script to your HTML and initialize the client with your own:

```js
HD_REG.options({ 'productName': 'HiDriveFree' }); 
HD_REG.options({ 'product': 'freemium' });
HD_REG.options({ 'partnerId': 'STRATO' });
HD_REG.options({ 'partnerRefId': 'HiDrive' });
HD_REG.options({ 'partnerSubId': 'PARTNER_SUB_ID' });
```
Set the appropriate parameters before requesting API.

### Configuration options

When this method is called with no parameters it will return all of the current options

```js
var options = HD_REG.options();
```

When this method is called with a string it will return the value of the option 
if exists, null if it does not. 

```js
var options = HD_REG.options();
```

When this method is called with an object it will merge the object onto the previous 
options object.  

```js
HD_REG.options({productName: 'HiDriveFree'});
//will set product and partnerRefId options 
HD_REG.options({product: 'freemium', partnerRefId: 'XYZ'}); 
//will get the accessToken of 'XYZ'
var productName = HD_REG.options('productName'); 
```

The existing options are:

* `'productName'`: product name.
* `'product'`: Product.
* `'partnerId'`: Partner ID.
* `'partnerRefId'`: Partner reference ID.
* `'partnerSubId'`: Partner Sub ID.

### API

#### Obtaining Request URL

##### Get request URL for Ordering API
Get the URL for the ordering process.

```js
var url = HD_REG.getOrderApiUrl()
```

##### Get full URL
Get the full URL for the ordering process. 

```js
var fullUrl = HD_REG.getFullUrl(path);
```
Valid paths:

* `"/getcaptcha"` : Get image with captcha.
* `"/check_username"` : Check whether username is valid.
* `"/check_email"` : Check whether email is valid
* `"/post_data"` : Sending request for registration.

#### Post
##### Get captcha
Get image with captcha.

```js
var properties = { width: "167", height: "32", bgcolor: "#FFFFFF" };
      HD_REG.post("/getcaptcha", properties, function(response){
           if (response && response.gd_image) {
               var captchaPic = document.getElementById("register-captcha");
               if (captchaPic) {
                   captchaPic.setAttribute("src", 
                              "data:image/png;base64," + response.gd_image);
               }
           }
      }, function(){

      }, function(){

      });
```

##### Check username
Check whether username is valid.

```js
var properties = {   username: "abc123",
                           country: "PL",
                           language: "eng",
                           product_name: "HiDriveFree",
                           product: "freemium",
                           partner_id: "STRATO",
                           partner_ref_id: "HiDrive",
                           partner_sub_id: "PARTNER_SUB_ID" };
      HD_REG.post("/check_username", properties, function(response){
          //Do something with response
      }, function(){

      }, function(){

      });
```

##### Check email
Check whether email is valid

```js
var properties = {  email: "abc123@test.com",
                    country: "PL",
                    language: "eng",
                    product_name: "HiDriveFree",
                    product: "freemium",
                    partner_id: "STRATO",
                    partner_ref_id: "HiDrive",
                    partner_sub_id: "PARTNER_SUB_ID" };
      HD_REG.post("/check_email", properties, function(response){
          //Do something with response
      }, function(){

      }, function(){

      });
```

##### Post data
Sending request to registration.

```js
var properties = { data_values: {   agb_check: "true",
	                                email: "YOUR_EMAIL",
	                                username: "YOUR_USERNAME",
	                                password: "YOUR_PASSWORD",
	                                country: "PL",
	                                language: "eng",
	                                captcha_number: "123456",
	                                roduct_name: "HiDriveFree",
	                                product: "freemium",
	                                partner_id: "STRATO",
	                                partner_ref_id: "HiDrive",
	                                partner_sub_id: "PARTNER_SUB_ID"
	                            },
	                               country: "PL",
	                               language: "eng",
	                               product_name: "HiDriveFree",
	                               product: "freemium" };
	HD_REG.post("/post_data", properties, function(response){
	  //Do something with response
	}, function(){

	}, function(){

	});
```

##### Order
Function for checking the username and email and sending request for registration
For example, sending request for registration:
	
```js
var properties = {  agb_check: "true",
	                  email: "YOUR_EMAIL",
	                  username: "YOUR_USERNAME",
	                  password: "YOUR_PASSWORD",
	                  country: "PL",
	                  language: "eng",
	                  captcha_number: "123456" };
	HD_REG.order(properties, function(response){
	  //Do something with response
	}, function(){

	}, function(){
});
```