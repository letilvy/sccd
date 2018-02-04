/**
	This controller currently is not in used. Its functionality is token place by xml fragement which saves more logic of controller.
*/
sap.ui.define([
	"sap/support/sccd/controller/BaseController",
	"sap/suite/ui/commons/ChartContainer",
	"sap/suite/ui/commons/ChartContainerContent",
	"sap/viz/ui5/controls/VizFrame",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/m/Table",
	"sap/m/Column",
	"sap/m/ColumnListItem",
	"sap/m/Label"
], function(BaseController, ChartContainer, ChartContainerContent, VizFrame, FeedItem, FlattenedDataset, 
			Table, Column, ColumnListItem, Label){
	"use strict";

	/**
	* How to use this controller:
	*
	(1) Create a view with a sap.suite.ui.commons.ChartContainer control. Suppose the id of chart container is "cc_ut";
	(2) Create controller of the above view. The new controller inherit from this ChartController class. Suppose new controller named UTOverview; 
	(3) ChartController.extend("sap.support.sccd.controller.ut.UTOverview", {

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
							uid: "valueAxis",
							type: "Measure",
							values: ["Passed", "Failed"]
						}, {
							uid: "categoryAxis",
							type: "Dimension",
							values: ["Project"]
						}],
						vizType: "stacked_bar"
					}
				}
			},

			onInit: function(){
				var oVizFrame = this.createVizFrame(this.getModel("utoverview"), this._constantsUT.charts.ut);
				var oTable = this.createTable(this.getModel("utoverview"), this._constantsUT.table);

				var oContentChart = this.createChartContainerContent(oVizFrame, "sap-icon://horizontal-stacked-chart");
				var oContentTable = this.createChartContainerContent(oTable, "sap-icon://table-view", "{i18n>tooltipTableView}");

				this.updateChartContainerContent(this.getView().byId("cc_ut"), [oContentChart, oContentTable]);
			}

		});
	**/
	
	return BaseController.extend("sap.support.sccd.controller.ChartController", {
		
		_constants: {
			vizFrames: {
				config: {
					height: "700px",
					width: "100%",
					uiConfig: {
						applicationSet: "fiori"
					}
				}
			}
		},

		/**
		 * Adds the passed feed items to the passed Viz Frame.
		 */
		_addFeedItems: function(oVizFrame, aFeedItems) {
			for(var i = 0; i < aFeedItems.length; i++) {
				oVizFrame.addFeed(new FeedItem(aFeedItems[i]));
			}
		},

		/**
		 * Creates an array of controls with the specified control type, property name and value.
		 */
		_createControls: function(clControl, sProp, aPropValue) {
			var aControls = [];
			var oProps = {};

			for (var i = 0; i < aPropValue.length; i++) {
				oProps[sProp] = aPropValue[i];
				aControls.push(new clControl(oProps));
			}

			return aControls;
		},

		_createTableColumns: function(aText) {
			var aLabels = this._createLabels(aText);
			return this._createControls(Column, "header", aLabels);
		},

		_createLabels: function(aText) {
			return this._createControls(Label, "text", aText);
		},

		/**
		 * oTableConfig: {
				icon: "sap-icon://table-view",
				title: "Table",
				itemBindingPath: "/utData",
				itemType: sap.m.ListType.Navigation,
				columnLabelTexts: ["Project Name", "Case Number"],
				templateCellLabelTexts: ["{project_name}", "{total_case}"]
			}
		 */
		createTable: function(oVizFrameModel, oTableConfig) {
			var oTable = new Table({
				columns: this._createTableColumns(oTableConfig.columnLabelTexts || [])
			});
			var oTableTemplate = new ColumnListItem({
				type: oTableConfig.itemType || sap.m.ListType.Navigation,
				cells: this._createLabels(oTableConfig.templateCellLabelTexts || [])
			});

			oTable.bindItems(oTableConfig.itemBindingPath, oTableTemplate, null, null);
			oTable.setModel(oVizFrameModel);

			return oTable;
		},

		/**
		 * Creates a Viz Frame based on the passed config and flag for whether a table should be created too.
		 */
		createVizFrame: function(oVizFrameModel, oVizFrameConfig) {
			var oVizFrame = new VizFrame(oVizFrameConfig.config || this._constants.vizFrames.config);
			var oDataSet = new FlattenedDataset(oVizFrameConfig.dataset);

			oVizFrame.setDataset(oDataSet);
			oVizFrame.setModel(oVizFrameModel);
			this._addFeedItems(oVizFrame, oVizFrameConfig.feedItems);
			oVizFrame.setVizType(oVizFrameConfig.vizType);

			return oVizFrame;
		},
	
		/**
		 * Creates chart container content with the given icon, title, and Viz Frame.
		 */
		createChartContainerContent: function(oContent, sIcon, sTitle) {
			var oCCContent = new ChartContainerContent({
				icon: sIcon || "sap-icon://business-objects-experience",
				title: sTitle || "{i18n>tooltipChartView}"
			});
			oCCContent.setContent(oContent);
			return oCCContent;
		},

		/**
		 * Calls the methods to clear and re-set chart container's content.
		 */
		updateChartContainerContent: function(oChartContainer, aContent) {
			oChartContainer.removeAllContent();
			aContent.forEach(function(oContent){
				oChartContainer.addContent(oContent);
			});
			oChartContainer.updateChartContainer();
		}
	});
});