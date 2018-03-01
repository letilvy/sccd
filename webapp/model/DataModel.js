sap.ui.define([
	"jquery.sap.global",
	"sap/ui/model/Model",
	"sap/ui/model/odata/ODataUtils"
], function(jQuery, Model, ODataUtils){
	"use strict";

	var DataModel = Model.extend("sap.support.sccd.DataModel", {
		constructor: function(sServiceUrl){
			Model.apply(this, arguments);

			this.sServiceUrl = sServiceUrl.replace(/\/$/, "");
			this.bUseBatch = false; //Batch mode is not supported in first step
		},

		metadata: {
			publicMethods: ["read"]
		}
	});

	DataModel.prototype._normalizePath = function(sPath, oContext) {
		// remove query params from path if any
		if (sPath && sPath.indexOf('?') != -1 ) {
			sPath = sPath.substr(0, sPath.indexOf('?'));
		}

		if (!oContext && !jQuery.sap.startsWith(sPath,"/")) {
			// we need to add a / due to compatibility reasons; but only if there is no context
			sPath = '/' + sPath;
			jQuery.sap.log.warning(this + " path " + sPath + " should be absolute if no Context is set");
		}
		return this.resolve(sPath, oContext);
	};

	DataModel.prototype._createRequestUrl = function(sPath, oContext, oUrlParams, bBatch, bCache) {
		// create the url for the service
		var aUrlParams,
			sResolvedPath,
			sUrlParams,
			sUrl = "";

		//we need to handle url params that can be passed from the manual CRUD methods due to compatibility
		if (sPath && sPath.indexOf('?') != -1 ) {
			sUrlParams = sPath.substr(sPath.indexOf('?') + 1);
			sPath = sPath.substr(0, sPath.indexOf('?'));
		}

		sResolvedPath = this._normalizePath(sPath, oContext);

		if (!bBatch) {
			sUrl = this.sServiceUrl + sResolvedPath;
		} else {
			sUrl = sResolvedPath.substr(sResolvedPath.indexOf('/') + 1);
		}

		aUrlParams = ODataUtils._createUrlParamsArray(oUrlParams);

		if (this.aUrlParams) {
			aUrlParams = aUrlParams.concat(this.aUrlParams);
		}
		if (sUrlParams) {
			aUrlParams.push(sUrlParams);
		}
		if (aUrlParams.length > 0) {
			sUrl += "?" + aUrlParams.join("&");
		}
		if (bCache === undefined) {
			bCache = true;
		}
		if (bCache === false) {

			var timeStamp = jQuery.now();
			// try replacing _= if it is there
			var ret = sUrl.replace( /([?&])_=[^&]*/, "$1_=" + timeStamp );
			// if nothing was replaced, add timestamp to the end
			sUrl = ret + ( ( ret === sUrl ) ? ( /\?/.test( sUrl ) ? "&" : "?" ) + "_=" + timeStamp : "" );
		}

		return sUrl;
	};

	DataModel.prototype._createRequest = function(sUrl, sMethod, bAsync, oPayload, sETag) {
		var oChangeHeader = {}, sETagHeader;
		jQuery.extend(oChangeHeader, this.mCustomHeaders, this.oHeaders);

		//sETagHeader = this._getETag(sUrl, oPayload, sETag);

		if (sETagHeader && sMethod != "GET") {
			oChangeHeader["If-Match"] = sETagHeader;
		}

		// make sure to set content type header for POST/PUT requests when using JSON format to prevent datajs to add "odata=verbose" to the content-type header
		// may be removed as later gateway versions support this
		if (this.bJSON && sMethod != "DELETE" && this.sMaxDataServiceVersion === "2.0") {
			oChangeHeader["Content-Type"] = "application/json";
		}

		if (sMethod == "MERGE" && !this.bUseBatch) {
			oChangeHeader["x-http-method"] = "MERGE";
			sMethod = "POST";
		}

		var oRequest = {
			headers : oChangeHeader,
			requestUri : sUrl,
			method : sMethod,
			async: bAsync
		};

		if (oPayload) {
			oRequest.data = oPayload;
		}

		if (bAsync) {
			oRequest.withCredentials = this.bWithCredentials;
		}

		return oRequest;
	};

	DataModel.prototype._submitRequest = function(oRequest, bBatch, fnSuccess, fnError, bHandleBatchErrors, bImportData){
		return jQuery.ajax({
			url: oRequest.requestUri,
			method: oRequest.method,
			async: oRequest.async,
		})
		.done(fnSuccess)
		.fail(fnError);
	};

	DataModel.prototype.read = function(sPath, mParameters){
		var oRequest, sUrl, 
			oContext, mUrlParams, bAsync, fnSuccess, fnError,
			/*aFilters, aSorters, sFilterParams, sSorterParams,
			oEntityType, sResolvedPath,*/
			aUrlParams;

		if (mParameters && typeof (mParameters) == "object" && !(mParameters instanceof sap.ui.model.Context)) {
			// The object parameter syntax has been used.
			/**
			 * oContext, aFilters, aSorters currently not supported
			*/
			//oContext   = mParameters.context;
			mUrlParams = mParameters.urlParameters;
			bAsync     = mParameters.async !== false; // Defaults to true...
			fnSuccess  = mParameters.success;
			fnError    = mParameters.error;
			//aFilters   = mParameters.filters;
			//aSorters   = mParameters.sorters;
		}

		// bAsync default is true ?!
		bAsync = bAsync !== false;

		aUrlParams = ODataUtils._createUrlParamsArray(mUrlParams);

		sUrl = this._createRequestUrl(sPath, oContext, aUrlParams, this.bUseBatch);
		oRequest = this._createRequest(sUrl, "GET", bAsync);

		return this._submitRequest(oRequest, this.bUseBatch, fnSuccess, fnError);
	};

	return DataModel;
});