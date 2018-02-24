sap.ui.define([
	"sap/support/sccd/controller/base/BaseTestController",
	"sap/ui/model/json/JSONModel"
], function(BaseTestController, JSONModel){
	"use strict";

	return BaseTestController.extend("sap.support.sccd.controller.ut.UTOv", {

		onInit: function(){
			this.setTestType("ut");
			BaseTestController.prototype.onInit.apply(this, arguments);
		}

	});
});