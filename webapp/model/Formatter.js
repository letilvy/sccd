sap.ui.define([
], function(){
	"use strict";

	return {
		dateAxis: function(sDate){
			if(sDate){ 
				sDate = sDate.substr(0,8).trim();  // This is used to process timestamp
				var sYear = sDate.substr(0,4).trim();
				var sMonth = sDate.substr(4,2).trim();
				var sDay = sDate.substr(6,2).trim();
								
				return sYear + "-" + sMonth + "-" + sDay;
			}
		},

		calCoveredCodeLine: function(aCover){
			if(Array.isArray(aCover) && aCover.length){
				return parseInt(aCover[0] * aCover[1]);
			}
		},

		calNotCoveredCodeLine: function(aCover){
			if(Array.isArray(aCover) && aCover.length){
				return aCover[0] - parseInt(aCover[0] * aCover[1]);
			}
		},

		sumCase: function(aCase){
			var iTotal = 0;
			if(Array.isArray(aCase) && aCase.length){
				aCase.forEach(function(iCase){
					iTotal += iCase;
				});
			}
			return iTotal;
		}
	};
});