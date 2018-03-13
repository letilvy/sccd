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
			this.getRouter().getRoute("project").attachPatternMatched(this._onProjectMatched, this);
			this.connectPopoverToVizFrame(false);
		},

		_onProjectMatched: function(oEvent){
			var oArgv = oEvent.getParameter("arguments");

			this.setTestType(oArgv.testtype);
			
			var oModelProject = this.getModel(oArgv.testtype + "project");
			this.byId(this.mUiId.ChartContainer).setModel(oModelProject);

			this.byId(this.mUiId.VizFrame).setVizProperties({
				plotArea: {
					colorPalette: this.getModel("config").getProperty("/colorPalette/" + oArgv.testtype + "/project"),
				}
			});

			if(Array.isArray(oModelProject.getData()) && oModelProject.getData().length){ 
				this.byId("title_testcase_history").setText(this.getResourceBundle().getText("titleProject" + oArgv.testtype.toUpperCase() + "History", [
					oModelProject.getData()[0].projectName
				]));
			}
		}
	});
});