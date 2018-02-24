sap.ui.define([
	"sap/support/sccd/controller/base/BaseTestController",
	"sap/ui/model/json/JSONModel"
], function(BaseTestController, JSONModel){
	"use strict";

	return BaseTestController.extend("sap.support.sccd.controller.it.ITOv", {

		onInit: function(){
			this.setTestType("it");
			BaseTestController.prototype.onInit.apply(this, arguments);
		}
		
	});
});