sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(Controller, History, MessageBox, MessageToast){
	"use strict";
	
	return Controller.extend("sap.support.sccd.controller.BaseController", {
		
		ProjectType: {
			UI5: "UI5",
			ABAP: "ABA"
		},

		TestType: {
			Unit: "UT",
			Integration: "IT",
			System: "ST"
		},

		_sTestType: "ut",

		getTestType: function(bUpperCase){
			return bUpperCase ? this._sTestType.toUpperCase():this._sTestType.toLowerCase();
		},

		setTestType: function(sType){
			this._sTestType = sType;
		},

		getPopoverActionItems: function(sVFId, oAction){
			oAction = oAction || {};
			oAction.history = (typeof oAction.history === "undefined" ? true : oAction.history);
			oAction.coverage = (typeof oAction.coverage === "undefined" ? (this.getTestType(true) === this.TestType.Unit) : oAction.coverage);
			var aAction = [];
			if(oAction.history){
				aAction.push({
					type: "action",
					text: this.getResourceBundle().getText("textShow" + this.getTestType(true) + "History"),
					press: this.showTestCaseHistory.bind(this, sVFId)
				});
			}
			if(oAction.coverage){
				aAction.push({
					type: "action",
					text: this.getResourceBundle().getText("textShowCoverageReport"),
					press: this.showCoverageReport.bind(this, sVFId)
				});
			}
			return aAction;
		},

		connectPopoverToVizFrame: function(oAction){
			if(this.mUiId){
				var oReg = new RegExp(/^VizFrame(\w*)$/);
				Object.keys(this.mUiId).forEach(function(sKey){
					if(oReg.exec(sKey)){
						var oPopover = this.byId(this.mUiId["Popover" + oReg.exec(sKey)[1]]);
						if(oPopover){
							oPopover.setActionItems(this.getPopoverActionItems(this.mUiId[sKey], oAction));
							oPopover.connect(this.byId(this.mUiId[sKey]).getVizUid());									
							/*var oTooltip = new sap.viz.ui5.controls.VizTooltip({});
				            oTooltip.connect(this.byId(this.mUiId[sKey]).getVizUid());*/
						}
					}
				}, this);
			}
		},

		/* 
			bReturnId = true: return project id. sText must be the project name.
			bReturnId = false: return project name. sText must be the project id.
		*/
		getProjectIdOrName: function(sText, bReturnId){
			var aData = this.getModel("f4project").getData();
			for(var i=0; i<aData.length; i++){
				if(bReturnId && aData[i].projectName === sText){
					return aData[i].projectId;
				}else if(!bReturnId && aData[i].projectId === sText){
					return aData[i].projectName;
				}
			}
		},

		getSelectedChartPieceData: function(sVFId, bClearSelection){
			bClearSelection = (typeof bClearSelection === "undefined" ? true : bClearSelection);

			var oPiece = this.byId(sVFId).vizSelection()[0].data;
			var sPId;
			if(oPiece.Project){
				sPId = this.getProjectIdOrName(oPiece.Project, true);
			}else if(oPiece.Date){ //Project detail page
				sPId = this.byId(sVFId).getModel().getData()[0].projectId;
			}

			if(bClearSelection){
				this.byId(sVFId).vizSelection([], {
				    clearSelection: true
				});
			}
			return {
				pid: sPId,
				ttype: this.getTestType(),
				ptype: this.ProjectType.UI5, //TODO: replace with dynamic type
			};
		},

		showTestCaseHistory: function(sVFId, oEvent){
			var oSelectedData = this.getSelectedChartPieceData(sVFId);
			this.getRouter().navTo("project", {
				pid: oSelectedData.pid,
				testtype: oSelectedData.ttype
			});
		},

		showCoverageReport: function(sVFId, oEvent){
			this.getModel().read("/JobSet", {
				urlParameters: this.getSelectedChartPieceData(sVFId),
				success: function(oData, oResponse){
					var aJob = JSON.parse(oData);
					if(Array.isArray(aJob) && aJob.length){ 
						var win = window.open("http://mo-2b83de737.mo.sap.corp:8080/job/" + aJob[0].name + "/" + aJob[0].lastbuild +"/cobertura/"/*, '_blank'*/);
						win.focus();
					}else{
						MessageToast.show("No coverage report detected.");
					}
				}.bind(this),
				error: this.serviceErrorHandler
			});
		},

		getRouter: function(){
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		navBack: function(){
			if(History.getInstance().getPreviousHash() !== undefined){
				window.history.go(-1);
			}else{
				this.getRouter().navTo("home", {}, true);
			}
		},

		getModel: function(sName){
			return this.getOwnerComponent().getModel(sName);
		},
		
		setModel: function(oModel, sName){
			return this.getOwnerComponent().setModel(oModel, sName);
		},
		
		getResourceBundle: function(){
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		serviceErrorHandler: function(oError){
			MessageBox.error(JSON.stringify(oError));
		}
	});
});