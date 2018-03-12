sap.ui.define([
	"sap/support/sccd/controller/base/BaseController",
	"sap/support/sccd/model/Formatter",
	"sap/ui/model/json/JSONModel",
	"sap/viz/ui5/data/FlattenedDataset"
], function(BaseController, Formatter, JSONModel, FlattenedDataset){
	"use strict";

	return BaseController.extend("sap.support.sccd.controller.Home", {

		mUiId: {
			ChartContainer: "cc_home",
			VizFrame: "vf_home",
			Popover: "po_home",
			VizFrameInclCoverage: "included--vf_coverage_ov",
			PopoverInclCoverage: "included--po_coverage_ov",
			VizFrameAllCoverage: "all--vf_coverage_ov",
			PopoverAllCoverage: "all--po_coverage_ov"
		},

		Formatter: Formatter,

		onInit: function(){
			this.getRouter().getRoute("home").attachPatternMatched(this.onLoadHome, this);
			this.byId(this.mUiId.ChartContainer).setModel(this.getModel("testoverview"));

			this.connectPopoverToVizFrame();

			var oVfAllCoverage = this.byId(this.mUiId.VizFrameAllCoverage);
			oVfAllCoverage.destroyDataset();
			oVfAllCoverage.setDataset(new FlattenedDataset({
                "dimensions": [{
                    "name": "Project",
                    "value": "{projectName}"
                }, {
                    "name": "Team",
                    "value": "{teamName}"
                }],
                "measures": [{
                    "name": "Code Lines",
                    "value": "{allLine}"
                }, {
                    "name": "Coverage",
                    "value": "{allCover}"
                }],
                data: {
                    path: "/"
                }
            }));
		},

		onLoadHome: function(){
			this.getModel().read("/UTSet", {
				urlParameters: {
					pid: "sbou01"
				},
				success: function(oData, oResponse){

				},
				error: function(oError){

				}
			});
		},

		onSelectCase: function(oEvent){
			var oCase = oEvent.getParameter("data")[0].data;
			var sType;
			switch(oCase.measureNames){
				case "Unit Test": sType = "ut"; break;
				case "Integration Test": sType = "it"; break;
				case "System Test": sType = "st"; break; 
				default: sType = ""; break;
			}
			this.setTestType(sType);
			this.byId(this.mUiId.Popover).setActionItems([{
				type: "action",
				text: this.getResourceBundle().getText("textShow" + this.getTestType(true) + "History"),
				press: this.showTestCaseHistory.bind(this, this.mUiId.VizFrame)
			}]);
		},

		onChangeCCContent: function(oEvent){
			this.byId("select_test_type_chart").setVisible(
				oEvent.getParameter("selectedItemId") === this.byId(this.mUiId.VizFrame).getId()
			);
		},

		onChangeChartType: function(oEvent){
			var sKey = oEvent.getParameter("selectedItem").getKey();
			if(sKey === "percentage"){
				this.byId(this.mUiId.VizFrame).setVizType("100_stacked_column");
				this.byId(this.mUiId.VizFrame).setVizProperties({
					plotArea: {
	                    dataLabel: {
	                    	type: "percentage",
	                        visible: true,
	                        showTotal: false
	                    }
	                }
				});
			}else{
				this.byId(this.mUiId.VizFrame).setVizType("stacked_column");
				this.byId(this.mUiId.VizFrame).setVizProperties({
					plotArea: {
	                    dataLabel: {
	                        visible: true,
	                        showTotal: true
	                    }
	                }
				});
			}
		},

		getValuesDelta: function(fFirstValue, fSecondValue) {
			return fSecondValue - fFirstValue;
		}
	});
});