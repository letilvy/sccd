sap.ui.define([
	"sap/support/sccd/controller/base/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel){
	"use strict";

	return BaseController.extend("sap.support.sccd.controller.ut.UTOv", {

		onInit: function(){
			this.byId("cc_ov").setModel(this.getModel("utoverview"));

			this.byId("cc_ov").setTitle(this.getResourceBundle().getText("titleUTOverview"));

			var oPoProjectCase = this.byId("po_case");
			oPoProjectCase.connect(this.byId("vf_case").getVizUid());
			/*var oTooltip = new sap.viz.ui5.controls.VizTooltip({});
            oTooltip.connect(this.byId("vf_case").getVizUid());*/
		},

		onPressProject: function(oEvent){
			var sPid = oEvent.getParameter("listItem").getBindingContext().getProperty("pid");
			this.getRouter().navTo("project", {
				pid: sPid,
				testtype: "ut"
			});
		}

	});
});