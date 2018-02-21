sap.ui.define([
	"sap/support/sccd/controller/base/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel){
	"use strict";

	return BaseController.extend("sap.support.sccd.controller.it.ITOv", {

		onInit: function(){
			this.byId("cc_ov").setModel(this.getModel("itoverview"));

			this.byId("cc_ov").setTitle(this.getResourceBundle().getText("titleITOverview"));
			
			var oPoProjectCase = this.byId("po_case");
			oPoProjectCase.connect(this.byId("vf_case").getVizUid());

			this.byId("vf_case").setVizProperties({
				plotArea: {
					colorPalette: this.getModel("config").getProperty("/colorPalette/it/overview")
				}
			});
		},

		onPressProject: function(oEvent){
			var sPid = oEvent.getParameter("listItem").getBindingContext().getProperty("pid");
			this.getRouter().navTo("project", {
				pid: sPid,
				testtype: "it"
			});
		}
		
	});
});