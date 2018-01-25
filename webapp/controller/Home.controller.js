sap.ui.define([
	"sap/support/sccd/controller/BaseController",
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
				]
			}), "kpi");
		},

		onLoadHome: function(){
			
		}
	});
});