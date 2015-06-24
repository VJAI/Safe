define(['handlebars'], function(Handlebars) {

this["JST"] = this["JST"] || {};

this["JST"]["addedit"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <a href=\"#photos/"
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-link btn-nav pull-left\">\n";
},"3":function(depth0,helpers,partials,data) {
    return "  <a href=\"#photos\" class=\"btn btn-link btn-nav pull-left\">\n";
},"5":function(depth0,helpers,partials,data) {
    return "    Edit Photo\n";
},"7":function(depth0,helpers,partials,data) {
    return "    Add Photo\n";
},"9":function(depth0,helpers,partials,data) {
    var helper;

  return "      <img id=\"photo\" class=\"img-responsive\" src=\"data:image/png;base64,"
    + this.escapeExpression(((helper = (helper = helpers.thumbnail || (depth0 != null ? depth0.thumbnail : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"thumbnail","hash":{},"data":data}) : helper)))
    + "\" />\n";
},"11":function(depth0,helpers,partials,data) {
    return "      <img id=\"photo\" class=\"img-responsive\" src=\"images/placeholder.png\" />\n";
},"13":function(depth0,helpers,partials,data) {
    return "    <input id=\"delete\" type=\"button\" value=\"Delete\" class=\"btn btn-negative btn-block\">\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<header class=\"bar bar-nav\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "    <span class=\"icon icon-close\"></span>\n  </a>\n  <button id=\"save\" disabled class=\"btn btn-link btn-nav pull-right\">\n    <span class=\"icon icon-check\"></span>\n  </button>\n  <h1 class=\"title\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "  </h1>\n</header>\n\n<nav class=\"bar bar-tab\">\n  <a class=\"tab-item\" href=\"#photos\">\n    <span class=\"icon icon-home\"></span>\n    <span class=\"tab-label\">Home</span>\n  </a>\n  <a class=\"tab-item\" href=\"#settings\">\n    <span class=\"icon icon-gear\"></span>\n    <span class=\"tab-label\">Settings</span>\n  </a>\n  <a class=\"tab-item\" href=\"#info\">\n    <span class=\"icon icon-info\"></span>\n    <span class=\"tab-label\">Info</span>\n  </a>\n</nav>\n\n<div class=\"content\">\n  <form id=\"addedit-form\" class=\"content-padded\">\n    <input id=\"description\" name=\"description\" type=\"text\" placeholder=\"Enter description\" maxlength=\"25\">\n    <a href=\"javascript:void(0);\" id=\"addphoto\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.thumbnail : depth0),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.program(11, data, 0),"data":data})) != null ? stack1 : "")
    + "    </a>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </form>\n</div>\n";
},"useData":true});

this["JST"]["changepassword"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "  <a class=\"tab-item\" href=\"#photos\">\n    <span class=\"icon icon-home\"></span>\n    <span class=\"tab-label\">Home</span>\n  </a>\n  <a class=\"tab-item\" href=\"#settings\">\n    <span class=\"icon icon-gear\"></span>\n    <span class=\"tab-label\">Settings</span>\n  </a>\n  <a class=\"tab-item\" href=\"#info\">\n    <span class=\"icon icon-info\"></span>\n    <span class=\"tab-label\">Info</span>\n  </a>\n";
},"3":function(depth0,helpers,partials,data) {
    return "  <a class=\"tab-item\" href=\"#info\">\n    <span class=\"icon icon-info\"></span>\n    <span class=\"tab-label\">Info</span>\n  </a>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<header class=\"bar bar-nav\">\n  <a href=\"#"
    + this.escapeExpression(((helper = (helper = helpers.backToUrl || (depth0 != null ? depth0.backToUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backToUrl","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-link btn-nav pull-left\">\n    <span class=\"icon icon-left-nav\"></span>\n  </a>\n  <h1 class=\"title\">Change Password</h1>\n</header>\n\n<nav class=\"bar bar-tab\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isAuthenticated : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "</nav>\n\n<div class=\"content\">\n  <form id=\"changepassword-form\" class=\"content-padded\">\n    <input id=\"password\" name=\"password\" type=\"password\" maxlength=\"15\" placeholder=\"Enter your new password\" autocomplete=\"off\">\n    <input id=\"change\" type=\"submit\" value=\"Change\" disabled class=\"btn btn-positive btn-block\">\n  </form>\n</div>\n";
},"useData":true});

this["JST"]["changesecurityinfo"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "      <option>"
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<header class=\"bar bar-nav\">\n  <a href=\"#settings\" class=\"btn btn-link btn-nav pull-left\">\n    <span class=\"icon icon-left-nav\"></span>\n  </a>\n  <h1 class=\"title\">Change SecurityInfo</h1>\n</header>\n\n<nav class=\"bar bar-tab\">\n  <a class=\"tab-item\" href=\"#photos\">\n    <span class=\"icon icon-home\"></span>\n    <span class=\"tab-label\">Home</span>\n  </a>\n  <a class=\"tab-item\" href=\"#settings\">\n    <span class=\"icon icon-gear\"></span>\n    <span class=\"tab-label\">Settings</span>\n  </a>\n  <a class=\"tab-item\" href=\"#info\">\n    <span class=\"icon icon-info\"></span>\n    <span class=\"tab-label\">Info</span>\n  </a>\n</nav>\n\n<div class=\"content\">\n  <form id=\"changesecurityinfo-form\" class=\"content-padded\">\n    <select id=\"security-question\" name=\"security-question\">\n      <option>Select a question</option>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.questions : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </select>\n    <input id=\"security-answer\" name=\"security-answer\" type=\"password\" maxlength=\"15\" placeholder=\"Enter your answer\"  autocomplete=\"off\">\n    <input id=\"save\" type=\"submit\" value=\"Save\" disabled class=\"btn btn-positive btn-block\">\n  </form>\n</div>\n";
},"useData":true});

this["JST"]["forgotpassword"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<header class=\"bar bar-nav\">\r\n  <a href=\"#login\" class=\"btn btn-link btn-nav pull-left\">\r\n    <span class=\"icon icon-left-nav\"></span>\r\n  </a>\r\n  <h1 class=\"title\">Verify yourself</h1>\r\n</header>\r\n\r\n<div class=\"content\">\r\n  <form id=\"forgotpassword-form\" class=\"content-padded\">\r\n    <label id=\"security-question\" class=\"field-label\">"
    + this.escapeExpression(((helper = (helper = helpers.securityQuestion || (depth0 != null ? depth0.securityQuestion : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"securityQuestion","hash":{},"data":data}) : helper)))
    + "?</label>\r\n    <input id=\"security-answer\" name=\"security-answer\" type=\"password\" maxlength=\"15\" placeholder=\"Enter your answer\" autocomplete=\"off\">\r\n    <input id=\"verify\" type=\"submit\" value=\"Verify\" disabled class=\"btn btn-positive btn-block\">\r\n  </form>\r\n</div>\r\n\r\n<nav class=\"bar bar-tab\">\r\n  <a class=\"tab-item\" href=\"#info\">\r\n    <span class=\"icon icon-info\"></span>\r\n    <span class=\"tab-label\">Info</span>\r\n  </a>\r\n</nav>";
},"useData":true});

this["JST"]["home"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "  <div id=\"search-form\" class=\"content-padded\">\r\n    <input id=\"search\" type=\"search\" placeholder=\"Search\">\r\n  </div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return " "
    + this.escapeExpression(((helper = (helper = helpers.total || (depth0 != null ? depth0.total : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"total","hash":{},"data":data}) : helper)))
    + " photo(s) found ";
},"5":function(depth0,helpers,partials,data) {
    return " No photos found ";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<header class=\"bar bar-nav\">\r\n  <a href=\"#logout\" class=\"btn btn-link btn-nav pull-left\">\r\n    <span class=\"icon icon-close\"></span>\r\n  </a>\r\n  <a href=\"#add\" class=\"btn btn-link btn-nav pull-right\">\r\n    <span class=\"icon icon-plus\"></span>\r\n  </a>\r\n  <h1 class=\"title\">Secret Photos</h1>\r\n</header>\r\n\r\n<nav class=\"bar bar-tab\">\r\n  <a class=\"tab-item active\" href=\"#photos\">\r\n    <span class=\"icon icon-home\"></span>\r\n    <span class=\"tab-label\">Home</span>\r\n  </a>\r\n  <a class=\"tab-item\" href=\"#settings\">\r\n    <span class=\"icon icon-gear\"></span>\r\n    <span class=\"tab-label\">Settings</span>\r\n  </a>\r\n  <a class=\"tab-item\" href=\"#info\">\r\n    <span class=\"icon icon-info\"></span>\r\n    <span class=\"tab-label\">Info</span>\r\n  </a>\r\n</nav>\r\n\r\n<div class=\"content\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.total : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n  <p id=\"total\" class=\"text-center\">\r\n    "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.total : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "\r\n  </p>\r\n\r\n  <div id=\"list-container\">\r\n  </div>\r\n</div>\r\n";
},"useData":true});

this["JST"]["info"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "  <a href=\""
    + this.escapeExpression(((helper = (helper = helpers.backToUrl || (depth0 != null ? depth0.backToUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"backToUrl","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-link btn-nav pull-left\">\r\n    <span class=\"icon icon-left-nav\"></span>\r\n  </a>\r\n";
},"3":function(depth0,helpers,partials,data) {
    return "  <a class=\"tab-item\" href=\"#photos\">\r\n    <span class=\"icon icon-home\"></span>\r\n    <span class=\"tab-label\">Home</span>\r\n  </a>\r\n  <a class=\"tab-item\" href=\"#settings\">\r\n    <span class=\"icon icon-gear\"></span>\r\n    <span class=\"tab-label\">Settings</span>\r\n  </a>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<header class=\"bar bar-nav\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.backToUrl : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  <h1 class=\"title\">Info</h1>\r\n</header>\r\n\r\n<nav class=\"bar bar-tab\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isAuthenticated : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  <a class=\"tab-item active\" href=\"#info\">\r\n    <span class=\"icon icon-info\"></span>\r\n    <span class=\"tab-label\">Info</span>\r\n  </a>\r\n</nav>\r\n\r\n<div class=\"content\">\r\n  <div class=\"content-padded\">\r\n    <h4>Safe</h4>\r\n    <p>\r\n      A simple app that helps to preserve your photos safe! The persisted photos are encrypted using the powerful AES 256 encryption algorithm.\r\n    </p>\r\n    <p>\r\n      This app is an experiment done to demonstrate how we can architect and develop a pure hybrid application that runs across mobile platforms using Cordova, Backbone and other UI technologies.\r\n    </p>\r\n    <p>\r\n      This application is developed purely for educational purpose. You can download the complete source code from <a href=\"https://github.com/vjai/safe\">Github</a>. You are free to use the source code as a reference material to architect your mobile apps for personal or commercial purposes.</p>\r\n\r\n    <p class=\"bold\">You are not allowed to sell this app in same or different name. You are also not allowed to build and sell apps by copying maximum portion of the source code. For more information about license please visit this <a href=\"https://github.com/vjai/safe/license\">page</a>.\r\n    </p>\r\n\r\n    <p>\r\n      As I said earlier, this is an experiment! If you run into any issues of using this app or source code the complete responsibility is yours! For any questions please contact me <a href=\"http://www.prideparrot.com/contact\">here</a>.\r\n    </p>\r\n  </div>\r\n</div>\r\n";
},"useData":true});

this["JST"]["login"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<header class=\"bar bar-nav\">\r\n  <h1 class=\"title\">SAFE</h1>\r\n</header>\r\n\r\n<nav class=\"bar bar-tab\">\r\n  <a class=\"tab-item\" href=\"#info\">\r\n    <span class=\"icon icon-info\"></span>\r\n    <span class=\"tab-label\">Info</span>\r\n  </a>\r\n</nav>\r\n\r\n<div class=\"content\">\r\n  <p class=\"content-padded text-center\">\r\n    Keep your photos safe!\r\n  </p>\r\n\r\n  <form id=\"login-form\" class=\"content-padded\">\r\n    <input id=\"password\" name=\"password\" type=\"password\" maxlength=\"15\" placeholder=\"Enter your password\" autocomplete=\"off\">\r\n    <input id=\"login\" type=\"submit\" value=\"Login\" disabled class=\"btn btn-positive btn-block\">\r\n    <a href=\"#forgotpassword\" class=\"forgot-password text-right\">forgot the password?</a>\r\n  </form>\r\n</div>";
},"useData":true});

this["JST"]["photo"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<header class=\"bar bar-nav\">\n  <a href=\"#photos\" class=\"btn btn-link btn-nav pull-left\">\n    <span class=\"icon icon-left-nav\"></span>\n  </a>\n  <a href=\"#edit/"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"btn btn-link btn-nav pull-right\">\n    <span class=\"icon icon-edit\"></span>\n  </a>\n  <h1 class=\"title\">View Photo</h1>\n</header>\n\n<nav class=\"bar bar-tab\">\n  <a class=\"tab-item\" href=\"#photos\">\n    <span class=\"icon icon-home\"></span>\n    <span class=\"tab-label\">Home</span>\n  </a>\n  <a class=\"tab-item\" href=\"#settings\">\n    <span class=\"icon icon-gear\"></span>\n    <span class=\"tab-label\">Settings</span>\n  </a>\n  <a class=\"tab-item\" href=\"#info\">\n    <span class=\"icon icon-info\"></span>\n    <span class=\"tab-label\">Info</span>\n  </a>\n</nav>\n\n<div class=\"content\">\n  <div class=\"content-padded\">\n    <div class=\"description\">"
    + alias3(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"description","hash":{},"data":data}) : helper)))
    + "</div>\n    <img id=\"photo\" class=\"img-responsive\" src=\"data:image/png;base64,"
    + alias3(((helper = (helper = helpers.thumbnail || (depth0 != null ? depth0.thumbnail : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"thumbnail","hash":{},"data":data}) : helper)))
    + "\">\n  </div>\n</div>\n";
},"useData":true});

this["JST"]["photoitem"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<a href=\"#photos/"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"navigate-right\">\r\n  <img class=\"media-object pull-left\" src=\"data:image/png;base64, "
    + alias3(((helper = (helper = helpers.thumbnail || (depth0 != null ? depth0.thumbnail : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"thumbnail","hash":{},"data":data}) : helper)))
    + "\">\r\n  <div class=\"media-body\">\r\n    "
    + alias3(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"description","hash":{},"data":data}) : helper)))
    + "\r\n  </div>\r\n</a>";
},"useData":true});

this["JST"]["register"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "      <option>"
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "</option>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<header class=\"bar bar-nav\">\r\n  <h1 class=\"title\">SAFE</h1>\r\n</header>\r\n\r\n<nav class=\"bar bar-tab\">\r\n  <a class=\"tab-item\" href=\"#info\">\r\n    <span class=\"icon icon-info\"></span>\r\n    <span class=\"tab-label\">Info</span>\r\n  </a>\r\n</nav>\r\n\r\n<div class=\"content\">\r\n  <p class=\"content-padded text-center\">\r\n    Keep your photos safe!\r\n  </p>\r\n\r\n  <form id=\"register-form\" class=\"content-padded\">\r\n    <input id=\"password\" name=\"password\" type=\"password\" maxlength=\"15\" placeholder=\"Enter your password\" autocomplete=\"off\">\r\n    <select id=\"security-question\" name=\"security-question\">\r\n      <option selected>Select a question</option>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.questions : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </select>\r\n    <input id=\"security-answer\" name=\"security-answer\" type=\"password\" maxlength=\"15\" placeholder=\"Enter your answer\" disabled autocomplete=\"off\">\r\n    <input id=\"register\" type=\"submit\" value=\"Register\" class=\"btn btn-positive btn-block\" disabled>\r\n  </form>\r\n</div>";
},"useData":true});

this["JST"]["settings"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<header class=\"bar bar-nav\">\r\n  <h1 class=\"title\">Settings</h1>\r\n</header>\r\n\r\n<nav class=\"bar bar-tab\">\r\n  <a class=\"tab-item\" href=\"#photos\">\r\n    <span class=\"icon icon-home\"></span>\r\n    <span class=\"tab-label\">Home</span>\r\n  </a>\r\n  <a class=\"tab-item active\" href=\"#settings\">\r\n    <span class=\"icon icon-gear\"></span>\r\n    <span class=\"tab-label\">Settings</span>\r\n  </a>\r\n  <a class=\"tab-item\" href=\"#info\">\r\n    <span class=\"icon icon-info\"></span>\r\n    <span class=\"tab-label\">Info</span>\r\n  </a>\r\n</nav>\r\n\r\n<div class=\"content\">\r\n  <div class=\"content-padded\">\r\n    <a href=\"#changepassword\" class=\"btn btn-block\">Change Password</a>\r\n    <a href=\"#changesecurityinfo\" class=\"btn btn-block\">Change Security Info</a>\r\n  </div>\r\n</div>";
},"useData":true});

return this["JST"];

});