sap.ui.define([
	"sap/support/sccd/controller/ChartController",
	"sap/ui/model/json/JSONModel"
], function(ChartController, JSONModel){
	"use strict";

	return ChartController.extend("sap.support.sccd.controller.ut.UTOverview", {

		_constantsUT: {
			chartContainerId: "cc_ut",
			table: {
				icon: "sap-icon://table-view",
				title: "{i18n>tooltipTableView}",
				itemBindingPath: "/",
				columnLabelTexts: ["Project Name", "Passed", "Failed", "Skipped", "Assertion"],
				templateCellLabelTexts: ["{pid}", "{passed}", "{failed}", "{skipped}", "{assertion}"]
			},
			charts: {
				ut: {
					icon: "sap-icon://horizontal-stacked-chart",
					title: "{i18n>tooltipChartView}",
					dataPath: "/",
					dataset: {
						dimensions: [{
							name: "Project",
							value: "{pid}"
						}, {
							name: "Type",
							value: "{type}"
						}],
						measures: [{
							name: "Case",
							value: "{case}"
						}/*, {
							name: "Failed",
							value: "{failed}"
						}*/],
						data: {
							path: "/"
						}
					},
					feedItems: [{
						uid: "valueAxis",
						type: "Measure",
						values: ["Case"]
					}, {
						uid: "categoryAxis",
						type: "Dimension",
						values: ["Project"]
					}, {
						uid: "color",
						type: "Dimension",
						values: ["Type"]
					}],
					vizType: "stacked_bar"
				}
			}
		},

		onInit: function(){
			var aStackBarData = this.transformToStackBarData(this.getModel("utoverview").getData());
			var oVizFrame = this.createVizFrame(new JSONModel(aStackBarData), this._constantsUT.charts.ut);
			var oTable = this.createTable(this.getModel("utoverview"), this._constantsUT.table);

			var oContent1 = this.createChartContainerContent(oVizFrame, "sap-icon://horizontal-stacked-chart");
			var oContent2 = this.createChartContainerContent(oTable, "sap-icon://table-view", "{i18n>tooltipTableView}");

			this.updateChartContainerContent(this.getView().byId("cc_ut"), [oContent1, oContent2]);
		},

		transformToStackBarData: function(aProjectCase){
			var aStackBarData = [];
			aProjectCase.forEach(function(oProjectCase){
				oProjectCase.case = oProjectCase.failed;
				oProjectCase.type = "Failed";
				aStackBarData.push(jQuery.extend(true, {}, oProjectCase));
				oProjectCase.case = oProjectCase.passed;
				oProjectCase.type = "Passed";
				aStackBarData.push(jQuery.extend(true, {}, oProjectCase));
			});
			return aStackBarData;
		}

	});
});