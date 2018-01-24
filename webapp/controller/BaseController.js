sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History){
	"use strict";
	
	return Controller.extend("sap.support.sccd.controller.BaseController", {
		
		getModel: function(sName){
			return sap.getOwnerComponent().getModel(sName);
		},
		
		setModel: function(oModel, sName){
			return sap.getOwnerComponent().setModel(oModel, sName);
		},
		
		getResourceBundle: function () {
			return sap.getOwnerComponent().getModel("i18n").getResourceBundle();
		}
	
	});
});