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
			
			var oPoProjectCase = this.byId(this.mUiId.Popover);
			oPoProjectCase.setActionItems([{
				type: "action",
				text: this.getResourceBundle().getText("textShow" + this.getTestType(true) + "History"),
				press: [this.showTestCaseHistory, this]
			}]);
			oPoProjectCase.connect(this.byId(this.mUiId.VizFrame).getVizUid());
			/*var oTooltip = new sap.viz.ui5.controls.VizTooltip({});
            oTooltip.connect(this.byId("vf_case").getVizUid());*/

			this.byId(this.mUiId.VizFrame).setVizProperties({
				plotArea: {
					colorPalette: this.getModel("config").getProperty("/colorPalette/" + this.getTestType() + "/overview")
				}
			});
		},

		onPressProject: function(oEvent){
			var sPid = oEvent.getParameter("listItem").getBindingContext().getProperty("pid");
			this.getRouter().navTo("project", {
				pid: sPid,
				testtype: this.getTestType()
			});
		}
	
	});
});