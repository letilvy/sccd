sap.ui.define([
	"sap/support/sccd/controller/base/BaseController"
], function(BaseController){
	"use strict";

	return BaseController.extend("sap.support.sccd.controller.Project", {
		onInit: function(){
			this.getRouter().getRoute("project").attachPatternMatched(this._onProjectMatched, this);
		},

		_onProjectMatched: function(oEvent){
			var sPid = oEvent.getParameter("arguments").pid;
			sap.m.MessageToast.show(sPid);
		}
	});
});