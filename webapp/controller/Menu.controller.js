sap.ui.define([
	"sap/support/sccd/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel){
	"use strict";

	return BaseController.extend("sap.support.sccd.controller.Menu", {
		onInit: function(){
		},

		onPressMenuItem: function(oEvent){
			var oMenuItem = oEvent.getParameter("listItem").getBindingContext("menu").getObject();
			this.getRouter().navTo(oMenuItem.route, oMenuItem.routeParam);
		}
	});
});