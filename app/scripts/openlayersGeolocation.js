/*eslint-env browser, jquery */
/*global ol */
/**
* OL3 geolocation helpers
* @module
* @external $
* @external ol
* @return {Object} Public functions / variables
*/
/*eslint-disable no-unused-vars*/
var openlayersGeolocation  = (function (mod, $, window, document) {
    /*eslint-enable no-unused-vars*/
    'use strict';

    /**
    * Try to geolocate user and center map on the position
    * @public
    * @param {Object} map - OL3 map instance
    */
    var setCenterOnPosition = function (map) {

        var view = map.getView();
        var geolocation = new ol.Geolocation({
            projection: view.getProjection(),
            tracking: true
        });

        geolocation.once('change:position', function () {
            view.setCenter(geolocation.getPosition());
        });

    };



    return $.extend(mod, {
        setCenterOnPosition: setCenterOnPosition
    });

})(openlayersHelpers || {}, window.jQuery, window, document);
