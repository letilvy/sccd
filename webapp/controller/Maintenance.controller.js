/*
 * Need refactorying after maintenance DB table is ready
*/

sap.ui.define([
	"sap/support/sccd/controller/base/BaseController",
    "sap/viz/ui5/format/ChartFormatter",
	"sap/ui/model/json/JSONModel",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/m/Label",
	"sap/m/ColumnListItem", 
	"sap/m/Column",
	"sap/m/library",
	"sap/ui/base/Event",
	"sap/ui/core/Item"
], function(
	BaseController, ChartFormatter, JSONModel, FlattenedDataset, FeedItem, Label, ColumnListItem, Column, MobileLibrary, Event, Item){

	"use strict";

	return BaseController.extend("sap.support.sccd.controller.Maintenance", {
		_constants: {
			packageName: "sap.support.sccd.model",
			vizFrame: {
				id: "maintVizFrame",
				modulePath: "/maint.json",
				dataset: {
					dimensions: [{
						name: 'Quater',
						value: "{quater}"
					}],
					measures: [{
						name: 'Customer Incident',
						value: '{customerTicket}'
					},{
						name: 'IT Direct',
						value: '{itTicket}'
					}],
					data: {
						path: "/maintData"
					}
				},
				type: "line",
				properties: {
					plotArea: {
						colorPalette: [
							"#b6d957",
							"sapUiChartPaletteSequentialHue1"
						],
                        dataLabel: {
                            visible: true,
                            showTotal: true
                        },
                        window: {
                        	start: "firstDataPoint",
                        	end: "lastDataPoint"
                        }
					},
					title: {
						visible: false
					},
					interaction: {
						selectability: {
							mode: "single"
						}
					},
					categoryAxis: {
						title: {
							visible: false
						}
					},
					valueAxis: {
						title: {
							visible: false
						}
					}
				},
				feedItems: [{
					'uid': "primaryValues",
					'type': "Measure",
					'values': ["Customer Incident"]
				},{
					'uid': "axisLabels",
					'type': "Dimension",
					'values': ["Quater"]
				}]
			}
		},

		onInit: function() {
			this.setModel(new JSONModel(jQuery.sap.getModulePath("sap/support/sccd/model/mockdata/maintenance", ".json")), "maint");

			this.oVizFrame = this.getView().byId(this._constants.vizFrame.id);
			this._updateVizFrame(this.oVizFrame);

			var fnPreSelect = function(oEvent){
				if(oEvent.getParameter("success")){
					this.onTeamSelect(new Event(null, this.byId("teamMaintSelect").setSelectedItem(
						new Item({key: "all", text: "All Projects"})
					)));
				}
			};

			this.getModel().read("/TeamSet", {
				success: function(oData, oResponse){
					var aList = JSON.parse(oData);
					aList.unshift({tid: "all", name: "All Projects"});
					//this.getModel("team").setData(aList);
					this.setModel(new JSONModel(aList), "team");

					this.onTeamSelect(new Event(null, this.byId("teamMaintSelect").setSelectedItem(
						new Item({key: "all", text: "All Projects"})
					)));

					this.byId("teamMaintSelect").setSelectedKey("all");
				}.bind(this)
			});

			var oPopOver = this.getView().byId("miantPopOver");
			oPopOver.connect(this.oVizFrame.getVizUid());
		},

		onAfterRendering: function(){
			this.byId("teamMaintSelect").setSelectedKey("all");
		},

		_updateVizFrame: function(vizFrame) {
			var oVizFrame = this._constants.vizFrame;
			var oDataset = new FlattenedDataset(oVizFrame.dataset);
			vizFrame.setVizProperties(oVizFrame.properties);
			vizFrame.setDataset(oDataset);
			this._addFeedItems(vizFrame, oVizFrame.feedItems);
			vizFrame.setVizType(oVizFrame.type);
		},

		_addFeedItems: function(vizFrame, feedItems) {
			for (var i = 0; i < feedItems.length; i++) {
				vizFrame.addFeed(new FeedItem(feedItems[i]));
			}
		},

		onTeamSelect: function(oEvent){
			var sTeamSelect = oEvent.getSource().getSelectedItem().getKey();
			var aResults = this.getModel("maint").getData().maintData;
			var aList = [];
			var itTicket, customerTicket;
			var oListItem = {};

			if(aResults && sTeamSelect !== 'all'){
				aResults.forEach(function(item){
					if(item.tid === sTeamSelect){
						aList.push(item);
					}
				});
			} else {
				for(var j=0; j<8; j++){
					itTicket = aResults[j].itTicket;
					customerTicket = aResults[j].customerTicket;
					for(var i=0; i<aResults.length; i++){
						if(aResults[j].quater === aResults[i].quater && aResults[j].tid !== aResults[i].tid){
							itTicket += aResults[i].itTicket;
							customerTicket += aResults[i].customerTicket;
						}
					}
					oListItem = {
						quater: aResults[j].quater,
						itTicket: itTicket,
						customerTicket: customerTicket
					};
					aList.push(oListItem);
				}
			}

			this.oVizFrame.setModel(new JSONModel({maintData: aList}));
		}
	});
});