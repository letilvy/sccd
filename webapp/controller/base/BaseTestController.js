sap.ui.define([
	"sap/support/sccd/controller/base/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/GroupHeaderListItem"
], function(BaseController, JSONModel, GroupHeaderListItem){
	"use strict";
	
	return BaseController.extend("sap.support.sccd.controller.BaseTestController", {
		
		mUiId: {
			ChartContainer: "cc_ov",
			VizFrame: "vf_case",
			Popover: "po_case"
		},

		onInit: function(){
			this.getRouter().getRoute("utov").attachPatternMatched(this.onBaseTestOvMatched, this);
			this.getRouter().getRoute("itov").attachPatternMatched(this.onBaseTestOvMatched, this);

			this.byId(this.mUiId.ChartContainer).setModel(this.getModel(this.getTestType() + "overview"));

			this.byId(this.mUiId.ChartContainer).setTitle(
				this.getResourceBundle().getText("title" + this.getTestType(true) + "Overview")
			);
			
			this.byId(this.mUiId.VizFrame).setVizType(this.getModel("config").getProperty("/" + this.getTestType() + "/vizType/overview"));
			this.byId(this.mUiId.VizFrame).setVizProperties({
				plotArea: {
					colorPalette: this.getModel("config").getProperty("/" + this.getTestType() + "/colorPalette/overview")
				}
			});

			this.connectPopoverToVizFrame();
		},

		onBaseTestOvMatched: function(oEvent){
			if(!oEvent.getParameter("name").match(this.getTestType())){
				return;
			}

			this.getModel().read("/" + this.getTestType().toUpperCase() + "Set", {
				success: function(oData, oResponse){
					this.getModel(this.getTestType() + "overview").setData(JSON.parse(oData));
				}.bind(this),
				error: this.serviceErrorHandler
			});
		},

		getProjectGroupHeader: function(oGroup){
			return new GroupHeaderListItem({
				title: oGroup.key,
				upperCase: false
			});
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