/*eslint-env browser, jquery */
/*global ol */
/**
* OL3 helpers
* @see {@link http://openlayers.org/en/v3.12.1/apidoc/}
* @class
* @external $
* @external ol
* @return {Object} Public functions / variables
*/
/*eslint-disable no-unused-vars*/
var openlayersHelpers = (function ($, window, document) {
    /*eslint-enable no-unused-vars*/
    'use strict';

    /*
    var olClassNames = {

        ol: ['layer', 'format', 'source', 'style'],

        layer: ['Base', 'Group', 'Heatmap', 'Image', 'Layer', 'Tile', 'Vector', 'VectorTile'],

        source: ['BingMaps', 'CartoDB', 'Cluster',
        'Image', 'ImageCanvas', 'ImageMapGuide', 'ImageStatic', 'ImageVector',
        'ImageWMS', 'OSM', 'Raster', 'Source', 'Stamen', 'Tile',
        'TileArcGISRest', 'TileDebug', 'TileImage', 'TileJSON', 'TileUTFGrid',
        'TileWMS', 'Vector', 'VectorTile', 'WMTS', 'XYZ', 'Zoomify'],
        // 'ImageArcGISRest', 'ImageEvent', 'RasterEvent', 'TileEvent', 'VectorEvent', 'UrlTile',

        format: ['GMLBase', 'JSONFeature', 'TextFeature',
        'XML', 'XMLFeature', 'EsriJSON', 'Feature', 'GeoJSON', 'GML', 'GML2', 'GML3', 'GPX',
        'IGC', 'KML', 'MVT', 'OSMXML', 'Polyline', 'TopoJSON', 'WFS', 'WKT',
        'WMSCapabilities', 'WMSGetFeatureInfo', 'WMTSCapabilities'],

        style: ['AtlasManager', 'Circle', 'Fill', 'Icon', 'Image', 'RegularShape',
        'Stroke', 'Style', 'Text']

    };
    */



    /**
    * List class method names
    * @public
    * @param {Object} c A static class
    * @return {Array} Methods names
    */
    var getMethods = function (c) {
        var methods = [];
        for (var method in c) {
            if (typeof c[method] === 'function') {
                methods.push(method);
            }
        }
        return methods;
    };



    /**
    * List instance types
    * @public
    * @param {Object} instance Class instance
    * @param {Object} c Class
    * @return {Array} Child class names
    */
    var getInstanceTypes = function (instance, c) {
       var methods = getMethods(c);
       var array = [];
       if (typeof methods === 'object' && typeof methods.forEach === 'function') {
          methods.forEach(function (value, index) {
             if (instance instanceof c[value]) {
                array.push(value);
             }
          });
       }
       return array;
    };




    /**
    * Execute a function for each layer recursively
    * Skip groups
    * @param {Object} lyr Map our layer group
    * @param {Object} fn Function executed for each layer
    */
    var forEachLayerRecursive = function(lyr, fn) {
        lyr.getLayers().forEach(function(lyr, idx, a) {
            if (!(lyr instanceof ol.layer.Group)) {
                fn(lyr, idx, a);
            }
            if (lyr.getLayers) {
                forEachLayerRecursive(lyr, fn);
            }
        });
    };



    /**
    * JSON.stringify compatible with openlayers
    * Deletes circular references and converts unsupported values (Infinity)
    * @param {Object} string OpenLayers object
    * @return {String} Stringified Openlayers object
    */
    var stringify = function (object) {
        var cache = [];
        return JSON.stringify(object, function(key, value) {
            if (value === Infinity) {
                value = 'Infinity';
            } else if (value === NaN) {
                value = 'NaN';
            } else if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    return;
                }
                cache.push(value);
            }
            return value;
        });
        var cache = null;
    };



    /**
    * JSON.parse compatible with openlayers
    * Converts unsupported values (Infinity)
    * @param {String} string Stringified Openlayers object
    * @return {Object} OpenLayers object
    */
    var parse = function (string) {
        return JSON.parse(string, function (key, value) {
            if (value === 'Infinity') {
                value = Infinity;
            } else if (value === 'NaN') {
                value = NaN;
            }
            return value;
        });
    };



    return {
        forEachLayerRecursive: forEachLayerRecursive,
        stringify: stringify,
        parse: parse,
        getMethods: getMethods,
        getInstanceTypes: getInstanceTypes
    };

})(window.jQuery, window, document);
