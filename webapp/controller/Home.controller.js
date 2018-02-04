sap.ui.define([
	"sap/support/sccd/controller/base/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel){
	"use strict";

	return BaseController.extend("sap.support.sccd.controller.Home", {
		onInit: function(){
			this.getRouter().getRoute("home").attachPatternMatched(this.onLoadHome, this);

			this.setModel(new JSONModel({
				TotalProjects: 25,
				TopActive: [
					{ProjectName: "SaE", TotalCase: 491},
					{ProjectName: "B1 SMP PUM", TotalCase: 259},
					{ProjectName: "Note Search", TotalCase: 91}
				],
				HealthyUTProjects: 20,
				HealthyITProjects: 16,
				"fillLevel": {
					"threshold": 20,
					"measure": "lb",
					"valueBegin": "30",
					"valueEnd": "5",
					"timeBegin": "Aug",
					"timeEnd": "Nov",
					"color": {
						"above": "Good",
						"below": "Error"
					},
					"timeSeries": [
						{
							"time": 0,
							"level": 30
						},
						{
							"time": 1,
							"level": 49
						},
						{
							"time": 2,
							"level": 28
						},
						{
							"time": 2.5,
							"level": 11
						},
						{
							"time": 3,
							"level": 5
						}
					]
				}
			}), "kpi");
		},

		onLoadHome: function(){
			
		},

		getValuesDelta: function(fFirstValue, fSecondValue) {
			return fSecondValue - fFirstValue;
		}
	});
});