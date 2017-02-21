/*eslint-env browser, jquery */
/*global ol */
/**
* Openlayers persistance
* @module
* @external ol
* @return {Object} Public functions / variables
*/
/*eslint-disable no-unused-vars*/
var openlayersPersistence = (function (mod, $, window, document) {
    /*eslint-enable no-unused-vars*/
    'use strict';

    /** @var {Object} Default settings */
    var settings = {

    };


    /**
    * Store value with HTML5 local storage
    * @param {Object} key Storage key
    * @param {Object|String} value Value to store
    * @param {String} [namespace] A namespace appended to the key
    */
    var store = function (key, value, namespace) {

        if (typeof value !== 'string') {
            value = mod.stringify(value);
        }

        if (typeof Storage !== 'undefined') {
            localStorage.setItem([namespace, key].join('_'), value);
        }

    };



    /**
    * Restore value from HTML5 local storage
    * @param {Object} key Storage key
    * @param {String} [namespace] A namespace appended to the key
    * @return {Object} JSON object
    */
    var restore = function (key, namespace) {

        var value;

        if (typeof Storage !== 'undefined') {
            value = localStorage.getItem([namespace, key].join('_'));
        }

        if (value !== null) {
            value = mod.parse(value);
        }

        return value;

    };



    /**
    * Store view properties with HTML5 localStorage
    * @param {Object} map Openlayers map
    */
    var storeView = function (map) {
        var view = map.getView();
        view.on('propertychange', function () {
            var properties = view.getProperties();
            var namespace = map.get('target');
            store('view_properties', properties, namespace);
        });
    };



    /**
    * Restore view properties from the localStorage
    * @param {Object} map Openlayers map
    */
    var restoreView = function (map) {
        var restored = false;
        var namespace = map.get('target');
        var properties = restore('view_properties', namespace);
        if (properties !== undefined) {
            var view = map.getView();
            view.setProperties(properties);
            restored = true;
        }
        return restored;
    };



    /**
    * Store layers properties with HTML5 localStorage
    * @param {Object} map Openlayers map
    */
    var storeLayers = function (map) {
        mod.forEachLayerRecursive(map, function (l, idx, a) {
            l.on('propertychange', function () {
                var properties = this.getProperties();
                delete properties.source;
                var title = this.get('title');
                var key = 'layer_properties_' + title.replace(/[\s]+/g, '_') + '_' + idx;
                var namespace = map.get('target');
                store(key, properties, namespace);
            });
        });
    };



    /**
    * Restore layers properties from the localStorage
    * @param {Object} map Openlayers map
    */
    var restoreLayers = function (map) {
        var restored = false;
        mod.forEachLayerRecursive(map, function (l, idx, a) {
            var title = l.get('title');
            var key = 'layer_properties_' + title.replace(/[\s]+/g, '_') + '_' + idx;
            var namespace = map.get('target');
            var properties = restore(key, namespace);
            if (properties !== undefined) {
                l.setProperties(properties);
                restored = true;
            }
        });
        return restored;
    };



    /**
    * Store / restore map properties using HTML5 local storage
    * @param {Object} map Openlayers map instance
    * @param {Object} options Override default settings
    */
    var initPersistence = function (map, options) {
        settings = $.extend(settings, options);
        var restored = false;

        restored = restoreView(map);
        restoreLayers(map);
        storeView(map);
        storeLayers(map);

        console.log('Map persistence', restored);
        return restored;
    };

    // OLD ---------------------------------------------------------------------


    var basil;



    /**
    * Save map state using cookies or local storage
    * @public
    * @param {Object} map - OL3 map instance
    */
    /*
    var storeMapChanges = function (map) {

        if (!basil) {
            return false;
        }

        var view = map.getView();

        var getters = {'center': 'getCenter', 'resolution': 'getResolution', 'rotation': 'getRotation'};
        $.each(getters, function (key, getter) {
            view.on('change:' + key, function (e) {
                basil.set(key, this[getter]());
                console.log(key + ' stored after view ' + e.type, basil.get(key));
            });
        });

        // Store map move changes
        //map.on('moveend', function (e) {
        //    basil.set('center', this.getView().getCenter());
        //    console.log('Center stored after map ' + e.type, basil.get('center'));
        //});

        // Store map render changes
        //map.on('postrender', function (e) {
        //    basil.set('zoom', this.getView().getZoom());
        //    console.log('Zoom stored after map ' + e.type, basil.get('zoom'));
        //});

    };
    */


    /**
    * Save map state using cookies or local storage
    * @public
    * @param {Object} map - OL3 map instance
    * @return {Boolean} Restore success
    */
    /*
    var restoreMapProperties = function (map) {

        if (!basil) {
            return false;
        }

        var ok = false;
        var view = map.getView();
        var value;

        // Restore some view properties
        var setters = {'center': 'setCenter', 'resolution': 'setResolution', 'rotation': 'setRotation'};
        $.each(setters, function (key, setter) {
            value = basil.get(key);
            if (value !== null) {
                if (typeof view[setter] === 'function') {
                    view[setter](value);
                } else {
                    view.set(key, value);
                }
                console.log('View ' + key + ' restored', value);
                ok = true;
            } else {
                console.log('View ' + key + ' was not stored');
            }
        });

        return ok;

    };
    */


    // Save / restore map position using basil.js
    /*
    if (typeof window.Basil !== 'undefined') {

        basil = new window.Basil($.extend({}, settings.basil, {
            namespace: map.get('target')
        }));

        // Try to restore map center and zoom from the local storage
        if (!restoreMapProperties(map)) {
            // Or center map on user position and set a default zoom
            if (settings.centerOnPosition) {
                setCenterOnPosition(map);
                map.getView().setZoom(12);
            }
        }

        // Check map events and store changes to local storage
        storeMapChanges(map);

    } else {

        if (settings.centerOnPosition) {
            setCenterOnPosition(map);
            map.getView().setZoom(12);
        }

        console.warn('Basil is not defined');

    }
    */

    // -------------------------------------------------------------------------

    return $.extend(mod, {
        initPersistence: initPersistence
        //restoreMapProperties: restoreMapProperties,
        //storeMapChanges: storeMapChanges
    });

})(openlayersHelpers || {}, window.jQuery, window, document);
