sap.ui.define([
	"sap/support/sccd/controller/base/BaseController",
	"sap/support/sccd/model/Formatter",
	"sap/viz/ui5/controls/common/feeds/FeedItem"
], function(BaseController, Formatter, FeedItem){
	"use strict";

	return BaseController.extend("sap.support.sccd.controller.Project", {

		mUiId: {
			ChartContainer: "cc_project_case",
			VizFrame: "vf_project_case",
			Popover: "po_project_case"
		},

		Formatter: Formatter,

		onInit: function(){
			this.getRouter().getRoute("project").attachPatternMatched(this.onProjectMatched, this);

			this.connectPopoverToVizFrame(false);
			this.oCoverageFeedItem = new FeedItem({ //Coverage feed which is only displayed in UT view
				uid: "valueAxis2",
				type: "Measure",
				values: ["Coverage"/*, "Complete Code Coverage"*/]
			});
		},

		onProjectMatched: function(oEvent){
			var oArgv = oEvent.getParameter("arguments");

			this.setTestType(oArgv.testtype);

			var oVizFrame = this.byId(this.mUiId.VizFrame);
			//Make sure to change FeedItem before changing VizType
			oArgv.testtype.toUpperCase() === "UT" ? oVizFrame.addFeed(this.oCoverageFeedItem) : oVizFrame.removeFeed(this.oCoverageFeedItem);
			oVizFrame.setVizType(this.getModel("config").getProperty("/" + oArgv.testtype + "/vizType/project"));
			oVizFrame.setVizProperties({
				plotArea: {
					colorPalette: this.getModel("config").getProperty("/" + oArgv.testtype + "/colorPalette/project"),
					primaryValuesColorPalette: this.getModel("config").getProperty("/" + oArgv.testtype + "/colorPalette/project") //Only takes effect for UT view
				},
				valueAxis2: { //Only takes effect for UT view
					title: {
						visible: false
					}
				}
			});

			var oModelProject = this.getModel(oArgv.testtype + "project");
			this.byId(this.mUiId.ChartContainer).setModel(oModelProject);

			this.getModel().read("/" + oArgv.testtype.toUpperCase() + "Set", {
				urlParameters: {
					pid: oArgv.pid
				},
				success: function(oData, oResponse){
					var aHistory = JSON.parse(oData);
					oModelProject.setData(aHistory);
					if(Array.isArray(aHistory) && aHistory.length){ 
						this.byId("title_testcase_history").setText(this.getResourceBundle().getText("titleProject" + oArgv.testtype.toUpperCase() + "History", [
							aHistory[0].projectName
						]));
					}
				}.bind(this),
				error: this.serviceErrorHandler
			});
		}
	});
});