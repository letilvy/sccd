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
	
	return BaseController.extend("sap.support.sccd.controller.ChartController", {
		
		_constants: {
			vizFrames: {
				config: {
					height: "100%",
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