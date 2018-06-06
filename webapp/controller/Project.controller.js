sap.ui.define([
	"sap/support/sccd/controller/base/AutoTestController",
	"sap/support/sccd/model/Formatter",
	"sap/viz/ui5/controls/common/feeds/FeedItem"
], function(AutoTestController, Formatter, FeedItem){
	"use strict";

	return AutoTestController.extend("sap.support.sccd.controller.Project", {

		mUiId: {
			ChartContainer: "cc_project_case",
			VizFrame: "vf_project_case",
			Popover: "po_project_case"
		},

		Formatter: Formatter,

		onInit: function(){
			this.getRouter().getRoute("project").attachPatternMatched(this.onProjectMatched, this);

			this.oCoverageFeedItem = new FeedItem({ //Coverage feed which is only displayed in UT view
				uid: "valueAxis2",
				type: "Measure",
				values: ["Coverage"]
			});
		},

		onProjectMatched: function(oEvent){
			var oArgv = oEvent.getParameter("arguments");

			this.setProjectType(oArgv.ptype);
			this.setTestType(oArgv.ttype);
			this.connectPopoverToVizFrame({
				history: false
			});

			var oVizFrame = this.byId(this.mUiId.VizFrame);
			//Make sure to change FeedItem before changing VizType
			oArgv.ttype.toUpperCase() === "UT" ? oVizFrame.addFeed(this.oCoverageFeedItem) : oVizFrame.removeFeed(this.oCoverageFeedItem);
			oVizFrame.setVizType(this.getModel("config").getProperty("/" + oArgv.ttype + "/vizType/project"));
			oVizFrame.setVizProperties({
				plotArea: {
					colorPalette: this.getModel("config").getProperty("/" + oArgv.ttype + "/colorPalette/project"),
					primaryValuesColorPalette: this.getModel("config").getProperty("/" + oArgv.ttype + "/colorPalette/project"), //Only takes effect for UT view
					secondaryValuesColorPalette: ["#5cbae6", "#5899da"],
					dataShape: this.getModel("config").getProperty("/" + oArgv.ttype + "/dataShape/project")
				},
				valueAxis2: { //Only takes effect for UT view
					title: {
						visible: false
					}
				}
			});

			var oModelProject = this.getModel(oArgv.ttype + "project");
			this.byId(this.mUiId.ChartContainer).setModel(oModelProject);

			this.getModel().read("/" + oArgv.ttype.toUpperCase() + "Set", {
				urlParameters: {
					pid: oArgv.pid,
					ptype: this.getProjectType(true)
				},
				success: function(oData, oResponse){
					var aHistory = JSON.parse(oData);
					oModelProject.setData(aHistory);
					if(Array.isArray(aHistory) && aHistory.length){ 
						this.byId("title_testcase_history").setText(this.getResourceBundle().getText("titleProject" + oArgv.ttype.toUpperCase() + "History", [
							aHistory[0].projectName
						]));
					}
				}.bind(this),
				error: this.serviceErrorHandler
			});
		}
	});
});