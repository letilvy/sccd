sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History){
	"use strict";
	
	return Controller.extend("sap.support.sccd.controller.BaseController", {
		
		_sTestType: "ut",

		getTestType: function(bUpperCase){
			return bUpperCase ? this._sTestType.toUpperCase():this._sTestType.toLowerCase();
		},

		setTestType: function(sType){
			this._sTestType = sType;
		},

		connectPopoverToVizFrame: function(bAddAction){
			bAddAction = (typeof bAddAction === "undefined" ? true : bAddAction);

			if(this.mUiId){
				var oReg = new RegExp(/^VizFrame(\w*)$/);
				Object.keys(this.mUiId).forEach(function(sKey){
					if(oReg.exec(sKey)){
						var oPopover = this.byId(this.mUiId["Popover" + oReg.exec(sKey)[1]]);
						if(oPopover){
							if(bAddAction){
								oPopover.setActionItems([{
										type: "action",
										text: this.getResourceBundle().getText("textShow" + this.getTestType(true) + "History"),
										press: this.showTestCaseHistory.bind(this, this.mUiId[sKey])
									}]);
							}
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

		showTestCaseHistory: function(sVFId, oEvent){
			var sPName = this.byId(sVFId).vizSelection()[0].data.Project;
			var sPId = this.getProjectIdOrName(sPName, true);
			this.byId(sVFId).vizSelection([], {
			    clearSelection: true
			});
			this.getRouter().navTo("project", {
				pid: sPId,
				testtype: this.getTestType()
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

		}
	});
});