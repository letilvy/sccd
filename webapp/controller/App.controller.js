sap.ui.define([
	"sap/support/sccd/controller/base/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel){
	"use strict";

	return BaseController.extend("sap.support.sccd.controller.App", {
		onInit: function(){
			this.getView().setDisplayBlock(true);
		},

		onAfterDetailNavigate: function(oEvent){ //Quick fix for project view chart data label display issue
			var oView = oEvent.getParameter("to");
			if(oView.getViewName() === "sap.support.sccd.view.Project"){
				oView.byId("vf_project_case").setVizProperties({
					plotArea: {
						dataLabel: {
							visible: true //Since config on xml view does not take effect
						}
					}
				});
			}
		}
	});
});