sap.ui.define([
	"sap/support/sccd/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel){
	"use strict",

	BaseController.extend("sap.support.sccd.controller.Menu", {
		onInit: function(){
			var oMenuModel = JSONModel(jQuery.sap.getModulePath("sap.support.sccd.model", "/menu.json"));
			this.getView().setModel(oMenuModel, "menu");
		}
	});
});