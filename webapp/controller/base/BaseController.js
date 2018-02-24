sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History){
	"use strict";
	
	return Controller.extend("sap.support.sccd.controller.BaseController", {
		
		_sTestType: "ut",

		getTestType: function(bUpperCase){
			return bUpperCase ? this._sTestType.toUpperCase():this._sTestType.toLowerCase();
		},

		setTestType: function(sType){
			this._sTestType = sType;
		},

		showTestCaseHistory: function(){
			var sPid = this.byId(this.mUiId.VizFrame).vizSelection()[0].data.Project;
			this.byId(this.mUiId.VizFrame).vizSelection([], {
			    clearSelection: true
			});
			this.getRouter().navTo("project", {
				pid: sPid,
				testtype: this.getTestType()
			});
		},

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