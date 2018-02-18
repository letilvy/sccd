sap.ui.define([
	"sap/support/sccd/controller/base/BaseController"
], function(BaseController){
	"use strict";

	return BaseController.extend("sap.support.sccd.controller.Project", {
		onInit: function(){
			this.getRouter().getRoute("project").attachPatternMatched(this._onProjectMatched, this);

			var oPoProjectCase = this.byId("po_project_case");
			oPoProjectCase.connect(this.byId("vf_project_case").getVizUid());
		},

		_onProjectMatched: function(oEvent){
			var oArgv = oEvent.getParameter("arguments");
			this.byId("vf_project_case").setModel(this.getModel(oArgv.testtype + "project"));
		}
	});
});