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
			this.getRouter().getRoute("home").attachPatternMatched(this.onHomeMatched, this);
			
			this.byId(this.mUiId.ChartContainer).setModel(this.getModel("testoverview"));

			this.connectPopoverToVizFrame();

			/*
			* Will always use all line coverage after demo
			*
			*var oVfAllCoverage = this.byId(this.mUiId.VizFrameAllCoverage);
			if(oVfAllCoverage){
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
						"name": 'Code Line - Not Covered',
						"value": '{notIncludedCoverLine}'
					},{
						"name": 'Code Line - Covered',
						"value": '{allCoverLine}'
					},{
						"name": 'Coverage',
						"value": '{allCover}'
					}],
	                data: {
	                    path: "/"
	                }
	            }));
			}*/
		},

		onHomeMatched: function(){
			this.getModel().read("/HomeSet", {
				success: function(oData, oResponse){
					this.getModel("testoverview").setData(JSON.parse(oData));
				}.bind(this),
				error: this.serviceErrorHandler
			});
			this.getModel().read("/KpiSet", {
				success: function(oData, oResponse){
					this.getModel("kpi").setData(JSON.parse(oData));
				}.bind(this),
				error: this.serviceErrorHandler
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
			this.byId(this.mUiId.Popover).setActionItems(this.getPopoverActionItems(this.mUiId.VizFrame));
		},

		onChangeCCContent: function(oEvent){
			if(oEvent.getParameter("selectedItemId") === this.byId(this.mUiId.VizFrame).getId()){
				//Make change chart type select box visible in test type chart view
				this.byId("select_test_type_chart").setVisible(true);
			}else{
				this.byId("select_test_type_chart").setVisible(false);
				//Set test type always to ut when in coverage chart view
				this.setTestType("ut");
			}
		},

		onChangeChartType: function(oEvent){
			var sKey = oEvent.getParameter("selectedItem").getKey();
			if(sKey === "percentage"){
				this.byId(this.mUiId.VizFrame).setVizType("100_stacked_bar"); //100_stacked_column
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
				this.byId(this.mUiId.VizFrame).setVizType("stacked_bar"); //stacked_column
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