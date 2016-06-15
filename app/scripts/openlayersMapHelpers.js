/*eslint-env browser, jquery */
/*global ol */
/**
* OL3 map helpers
* @see {@link http://openlayers.org/en/v3.12.1/apidoc/}
* @class
* @external $
* @external Basil
* @external ol
* @param {Object} map - ol initialized map
* @param {Object} settings - Module settings override
* @return {Object} Public functions / variables
*/
/*eslint-disable no-unused-vars*/
var openlayersMapHelpers = (function (mod) {
    /*eslint-enable no-unused-vars*/
    'use strict';

    var defaults = {
        ol: {
        },
        basil: {
        },
        narrowWidth: 300,
        flatHeight: 200,
        centerOnPosition: true,
        debug: true
    };

    var settings = defaults;

    var basil;



    /**
    * Save map state using cookies or local storage
    * @public
    * @param {Object} map - OL3 map instance
    */
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



    /**
    * Save map state using cookies or local storage
    * @public
    * @param {Object} map - OL3 map instance
    * @return {Boolean} Restore success
    */
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



    /**
    * Display event logs
    * @public
    * @param {Object} map - OL3 map instance
    */
    var debug = function (map) {

        var view = map.getView();

        // pointermove postcompose postrender precompose
        'change change:layerGroup change:size change:target change:view click dblclick moveend pointerdrag propertychange singleclick'.split(' ').forEach(function (eventType) {
            map.on(eventType, function (e) {
                console.log('Map', e.type);
                if (e.key) {
                    console.log('New ' + e.key, map.get(e.key));
                }
            });
        });

        'change change:center change:resolution change:rotation propertychange'.split(' ').forEach(function (eventType) {
            view.on(eventType, function (e) {
                console.log('View', e.type);
                if (e.key) {
                    console.log('New ' + e.key, view.get(e.key));
                }
            });
        });
        view.on('change:resolution', function () {
            console.log('New zoom', view.getZoom());
        });

    };



    /**
    * Return the selected base layer name
    * @public
    * @param {Object} map - OL3 map instance
    */
    var getSelectedBaseLayer = function (map) {

        var layers = map.getLayers();

        $.each(layers, function (i, l) {
            //var BL = l.get('baselayer');
            if (l.getVisible()) {
                console.log('Selected layer', l.get('name'));
            } else {
                console.log('Unselected layer', l.get('name'));
            }
            l.on('change:visible', function () {
                // this.getVisible() ? $li.addClass('checked') : $li.removeClass('checked') ;
                if (this.getVisible()) {
                    console.log('Selected layer', this.get('name'));
                }
            });
        });
    };



    /**
    * Center the map at a given position and make a zoom
    * @public
    * @param {Object} map - OL3 map instance
    * @param {number} longitude - Longitude at EPSG:4326 projection
    * @param {number} latitude - Latitude at EPSG:4326 projection
    */
    var setCenter = function (map, longitude, latitude) {

        var view = map.getView();
        view.setCenter(ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'));
        console.log('Map centered at longitude: ' + longitude + ' latitude: ' + latitude);

    };



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



    /**
    * Change zoom level
    * @public
    * @param {Object} map - OL3 map instance
    * @param {Integer} zoom - Zoom level from 0 to 21
    */
    var setZoom = function (map, zoom) {

        zoom = parseInt(zoom);
        if (zoom) {
            map.getView().setZoom(zoom);
        }

    };



    /**
    * Zoom out and adjust center to fit the view extent
    * @public
    * @param {Object} map - OL3 map instance
    */
    var fitView = function (map) {

        var view = map.getView();
        var extent = view.getExtent();
        view.fit(extent, map.getSize());

    };



    /**
    * Zoom out and adjust center to fit all layers in the map viewport
    * @public
    * @param {Object} map - OL3 map instance
    */
    var fitLayers = function (map) {

        var view = map.getView();
        var extent = ol.extent.createEmpty();
        map.getLayers().forEach(function (layer) {
            ol.extent.extend(extent, layer.getSource().getExtent());
        });
        view.fit(extent, map.getSize());

    };



    /**
    * Zoom out and adjust center to fit the layer features
    * @public
    * @param {Object} map - OL3 map instance
    * @param {Object} layer - OL3 vector layer
    */
    var fitVectorLayer = function (map, layer) {

        var extent = layer.getSource().getExtent();
        map.getView().fit(extent, map.getSize());

    };



    /**
    * Zoom out and adjust center to fil a vectore layer feature
    * @see {@link http://openlayers.org/en/v3.4.0/examples/center.html}
    * @public
    * @param {Object} map - OL3 map instance
    * @param {Object} layer - Vector layer
    * @param {String} id - Feature id
    * @param {Object} options - ol3 fit function parameters
    */
    var fitLayerGeometry = function (map, layer, id, options) {

        var source = layer.getSource();
        var feature = source.getFeatureById(id);
        var polygon = /** @type {ol.geom.SimpleGeometry} */ (feature.getGeometry());
        var size = /** @type {ol.Size} */ (map.getSize());
        var view = map.getView();

        view.fit(polygon, size, $.extend({
            padding: [0, 0, 0, 0],
            constrainResolution: false
            // nearest: true,
            // minResolution: 50
        }, options));

    };



    /**
    * Add CSS classes to the map container according to map size
    * @param {Object} map - OL3 map instance
    */
    var updateSize = function (map) {

        map.updateSize();

        //var $map = $('#' + map.get('target'));

        //$map.toggleClass('narrow', ($map.width() < settings.narrowWidth));
        //$map.toggleClass('flat', ($map.height() < settings.flatHeight));


        var $map = $(map.get('target'));
        var $el = $map.find('.layer-switcher');
        if ($el) {
            $map.toggleClass('inline-layer-switcher', ($map.height() >= 200 && $map.height() < 500));
            $map.toggleClass('no-layer-switcher', ($map.width() < 300 || $map.height() < 200));
        }

        $el = $map.find('.ol-zoomslider');
        if ($el) {
            $map.toggleClass('no-zoomslider', ($map.height() < 300));
        }

    };



    /**
    * Execute common tasks after map initialisation
    * @public
    * @param {Object} map - OL3 map instance
    */
    var initMap = function (map, options) {

        // Merge default and custom map
        settings = $.extend(true, {}, defaults, options);

        // Add a .flat and .narrow class to the map container according to map size
        window.onresize = function () {
            updateSize(map);
        };
        updateSize(map);

        // Init Basil
        if (typeof window.Basil !== 'undefined') {
            // Define an unique namespace to store map data
            if (!settings.basil.namespace) {
                settings.basil.namespace = map.get('target');
            }
            basil = new window.Basil(settings.basil);

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

        }

        if (settings.debug) {
            debug(map);
        }

    };



    return $.extend(mod, {
        initMap: initMap,
        fitLayerGeometry: fitLayerGeometry,
        fitLayers: fitLayers,
        fitVectorLayer: fitVectorLayer,
        fitView: fitView,
        getSelectedBaseLayer: getSelectedBaseLayer,
        restoreMapProperties: restoreMapProperties,
        setCenter: setCenter,
        setCenterOnPosition: setCenterOnPosition,
        settings: settings,
        setZoom: setZoom,
        storeMapChanges: storeMapChanges,
        updateSize: updateSize
    });

})(openlayersHelpers || {});
