sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History){
	"use strict";
	
	return Controller.extend("sap.support.sccd.controller.BaseController", {
		
		getRouter: function(){
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		navBack: function(){
			if(History.getInstance().getPreviousHash() !== undefined){
				window.history.go(-1);
			}else{
				this.getRouter().navTo("home", {}, true);
			}
		},

		getModel: function(sName){
			return this.getOwnerComponent().getModel(sName);
		},
		
		setModel: function(oModel, sName){
			return this.getOwnerComponent().setModel(oModel, sName);
		},
		
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		}
	
	});
});