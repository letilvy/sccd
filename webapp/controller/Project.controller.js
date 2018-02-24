sap.ui.define([
	"sap/support/sccd/controller/base/BaseController",
	"sap/support/sccd/model/Formatter"
], function(BaseController, Formatter){
	"use strict";

	return BaseController.extend("sap.support.sccd.controller.Project", {
		Formatter: Formatter,

		onInit: function(){
			this.getRouter().getRoute("project").attachPatternMatched(this._onProjectMatched, this);

			var oPoProjectCase = this.byId("po_project_case");
			oPoProjectCase.connect(this.byId("vf_project_case").getVizUid());
		},

		_onProjectMatched: function(oEvent){
			var oArgv = oEvent.getParameter("arguments");

			this.byId("cc_project_case").setModel(this.getModel(oArgv.testtype + "project"));

			this.byId("vf_project_case").setVizProperties({
				plotArea: {
					colorPalette: this.getModel("config").getProperty("/colorPalette/" + oArgv.testtype + "/project"),
					//dataLabel: {visible: true}
				}
			});
		}
	});
});