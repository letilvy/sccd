sap.ui.define([
	"sap/support/sccd/controller/base/BaseController",
	"sap/support/sccd/model/Formatter"
], function(BaseController, Formatter){
	"use strict";

	return BaseController.extend("sap.support.sccd.controller.Project", {

		mUiId: {
			ChartContainer: "cc_project_case",
			VizFrame: "vf_project_case",
			Popover: "po_project_case"
		},

		Formatter: Formatter,

		onInit: function(){
			this.getRouter().getRoute("project").attachPatternMatched(this.onProjectMatched, this);
			this.connectPopoverToVizFrame(false);
		},

		onProjectMatched: function(oEvent){
			var oArgv = oEvent.getParameter("arguments");

			this.setTestType(oArgv.testtype);

			this.byId(this.mUiId.VizFrame).setVizProperties({
				plotArea: {
					colorPalette: this.getModel("config").getProperty("/colorPalette/" + oArgv.testtype + "/project"),
				}
			});

			var oModelProject = this.getModel(oArgv.testtype + "project");
			this.byId(this.mUiId.ChartContainer).setModel(oModelProject);

			this.getModel().read("/" + oArgv.testtype.toUpperCase() + "Set", {
				urlParameters: {
					pid: oArgv.pid
				},
				success: function(oData, oResponse){
					var aHistory = JSON.parse(oData);
					oModelProject.setData(aHistory);
					if(Array.isArray(aHistory) && aHistory.length){ 
						this.byId("title_testcase_history").setText(this.getResourceBundle().getText("titleProject" + oArgv.testtype.toUpperCase() + "History", [
							aHistory[0].projectName
						]));
					}
				}.bind(this),
				error: this.serviceErrorHandler
			});
		}
	});
});