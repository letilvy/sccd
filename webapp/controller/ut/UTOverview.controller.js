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
						}],
						measures: [{
							name: "Passed",
							value: "{passed}"
						}, {
							name: "Failed",
							value: "{failed}"
						}],
						data: {
							path: "/"
						}
					},
					feedItems: [{
						uid: "primaryValues",
						type: "Measure",
						values: ["Passed"]
					}, {
						uid: "axisLabels",
						type: "Dimension",
						values: ["Project"]
					}, {
						uid: "targetValues",
						type: "Measure",
						values: ["Failed"]
					}],
					vizType: "stacked_bar"
				}
			}
		},

		onInit: function(){
			var oVizFrame = this.createVizFrame(this.getModel("utoverview"), this._constantsUT.charts.ut);
			var oTable = this.createTable(this.getModel("utoverview"), this._constantsUT.table);

			var oContent1 = this.createChartContainerContent(oVizFrame);
			var oContent2 = this.createChartContainerContent(oTable, "sap-icon://table-view", "{i18n>tooltipTableView}");

			this.updateChartContainerContent(this.getView().byId("cc_ut"), [oContent1, oContent2]);
		}

	});
});