sap.ui.define([
	"sap/support/sccd/controller/base/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, Filter, FilterOperator){
	"use strict";

	return BaseController.extend("sap.support.sccd.controller.Menu", {
		onInit: function(){
		},

		onSearchMenu: function(oEvent){
			var sTerm = oEvent.getParameter("newValue");
			this.byId("tree_menu").getBinding("items").filter(
				sTerm?[new Filter("text", FilterOperator.Contains, sTerm)]:[]
			);
		},

		onConfig: function(){

		},

		onPressMenuItem: function(oEvent){
			var oMenuItem = oEvent.getParameter("listItem").getBindingContext("menu").getObject();
			if(oMenuItem.route){
				this.getRouter().navTo(oMenuItem.route, JSON.parse(oMenuItem.routeParam));
			}
		}
	});
});