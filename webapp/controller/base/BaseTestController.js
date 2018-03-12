sap.ui.define([
	"sap/support/sccd/controller/base/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel){
	"use strict";
	
	return BaseController.extend("sap.support.sccd.controller.BaseTestController", {
		
		mUiId: {
			ChartContainer: "cc_ov",
			VizFrame: "vf_case",
			Popover: "po_case"
		},

		onInit: function(){
			this.byId(this.mUiId.ChartContainer).setModel(this.getModel(this.getTestType() + "overview"));
			this.byId(this.mUiId.ChartContainer).setTitle(
				this.getResourceBundle().getText("title" + this.getTestType(true) + "Overview")
			);
			this.byId(this.mUiId.VizFrame).setVizProperties({
				plotArea: {
					colorPalette: this.getModel("config").getProperty("/colorPalette/" + this.getTestType() + "/overview")
				}
			});

			this.connectPopoverToVizFrame();
		},

		onPressProject: function(oEvent){
			var sPid = oEvent.getParameter("listItem").getBindingContext().getProperty("projectId");
			this.getRouter().navTo("project", {
				pid: sPid,
				testtype: this.getTestType()
			});
		}
	});
});