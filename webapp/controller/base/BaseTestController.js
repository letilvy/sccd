/*
 * Base Test Means: Unit Test and Integration Test 
*/
sap.ui.define([
	"sap/support/sccd/controller/base/AutoTestController",
	"sap/ui/model/json/JSONModel",
	"sap/m/GroupHeaderListItem"
], function(AutoTestController, JSONModel, GroupHeaderListItem){
	"use strict";
	
	return AutoTestController.extend("sap.support.sccd.controller.BaseTestController", {
		
		mUiId: {
			ChartContainer: "cc_ov",
			VizFrame: "vf_case",
			Popover: "po_case",
			CoverageColumn: "column_coverage"
		},

		onInit: function(){
			this.getRouter().getRoute("utov").attachPatternMatched(this.onBaseTestOvMatched, this);
			this.getRouter().getRoute("itov").attachPatternMatched(this.onBaseTestOvMatched, this);

			this.byId(this.mUiId.CoverageColumn).setVisible(this.getTestType() === "ut");

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
			this.setProjectType(oEvent.getParameter("arguments").ptype || this.ProjectType.UI5);

			this.getModel().read("/" + this.getTestType(true) + "Set", {
				urlParameters: {
					ptype: this.getProjectType(true)
				},
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
				ttype: this.getTestType(),
				ptype: this.getProjectType(true)
			});
		}
	});
});