sap.ui.define([
	"sap/support/sccd/controller/base/BaseController"
], function(BaseController){
	"use strict";

	return BaseController.extend("sap.support.sccd.controller.App", {
		onInit: function(){
			this.getView().setDisplayBlock(true);
		}
	});
});