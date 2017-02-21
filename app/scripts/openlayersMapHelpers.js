/*eslint-env browser, jquery */
/*global ol */
/**
* OL3 map helpers
* @see {@link http://openlayers.org/en/v3.12.1/apidoc/}
* @class
* @external $
* @external ol
* @param {Object} map - ol initialized map
* @param {Object} settings - Module settings override
* @return {Object} Public functions / variables
*/
/*eslint-disable no-unused-vars*/
var openlayersMapHelpers = (function (mod, $, window, document) {
    /*eslint-enable no-unused-vars*/
    'use strict';

    var settings = {
        ol: {
        },
        narrowWidth: 320,
        flatHeight: 480,
        persistence: true,
        centerOnPosition: true,
        debug: (document.domain === 'localhost')
    };



    /**
    * Display event logs
    * @public
    * @param {Object} map Map instance
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
    * @param {Object} map Map instance
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
    * @param {Object} map Map instance
    * @param {number} longitude Longitude at EPSG:4326 projection
    * @param {number} latitude Latitude at EPSG:4326 projection
    */
    var setCenter = function (map, longitude, latitude) {

        var view = map.getView();
        view.setCenter(ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'));
        console.log('Map centered at longitude: ' + longitude + ' latitude: ' + latitude);

    };



    /**
    * Change zoom level
    * @public
    * @param {Object} map Map instance
    * @param {Integer} zoom Zoom level from 0 to 21
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
    * @param {Object} map Map instance
    * @param {Object} {extent} Extent instance
    */
    var fitExtent = function (map, extent) {

        var view = map.getView();
        if (!extent instanceof ol.extent) {
            var extent = view.getExtent();
        }
        view.fit(extent, map.getSize());

    };



    /**
    * Zoom out and adjust center to fit all layers in the map viewport
    * @public
    * @param {Object} map Map instance
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
    * @param {Object} map Map instance
    * @param {Object} layer Vector layer
    */
    var fitVectorLayer = function (map, layer) {

        var extent = layer.getSource().getExtent();
        map.getView().fit(extent, map.getSize());

    };



    /**
    * Zoom out and adjust center to fil a vectore layer feature
    * @see {@link http://openlayers.org/en/v3.4.0/examples/center.html}
    * @public
    * @param {Object} map Map instance
    * @param {Object} layer Vector layer
    * @param {String} id Feature id
    * @param {Object} options Fit function parameters
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
    * @param {Object} map Map instance
    */
    var updateSize = function (map) {

        var $map = $('#' + map.get('target'));

        $map.toggleClass('map-horizontal', ($map.width() > $map.height));
        $map.toggleClass('map-vertical', ($map.width() <= $map.height));
        $map.toggleClass('map-narrow', ($map.width() <= settings.narrowWidth));
        $map.toggleClass('map-flat', ($map.height() <= settings.flatHeight));

        /*
        var $el = $map.find('.layer-switcher');
        if ($el) {
            $map.toggleClass('inline-layer-switcher', ($map.height() >= 200 && $map.height() < 500));
            $map.toggleClass('no-layer-switcher', ($map.width() < 300 || $map.height() < 200));
        }
        $el = $map.find('.ol-zoomslider');
        if ($el) {
            $map.toggleClass('no-zoomslider', ($map.height() < 300));
        }
        */

    };



    /**
    * Execute common tasks after map initialisation
    * @public
    * @param {Object} map Map instance
    */
    var initMap = function (map, options) {

        // Merge default and custom map
        options = $.extend({}, settings, options);

        map.on('change:size', function () {

        });

        // Catch resize events on map container
        var $map = $('#' + map.get('target'));
        $map.bind('resize', function () {
            map.updateSize();
            updateSize(map);
        });

        // Add a classes to the map container according to the map size
        window.onresize = function () {
            map.updateSize();
            updateSize(map);
        };
        updateSize(map);

        //map.getControls().forEach(function (control, i) {
        //    mod.initControl(control);
        //});

        // Try to restore map properties from the local storage
        if (options.persistence) {
            var restored = mod.initPersistence(map);
        } else {
            var restored = false;
        }

        // If there is no stored data, try to center map on user location
        if (!restored) {
            if (options.centerOnPosition) {
                mod.setCenterOnPosition(map);
                map.getView().setZoom(12);
            }
        }

        if (options.debug) {
            debug(map);
        }

    };



    return $.extend(mod, {
        initMap: initMap,
        fitLayerGeometry: fitLayerGeometry,
        fitLayers: fitLayers,
        fitVectorLayer: fitVectorLayer,
        fitExtent: fitExtent,
        getSelectedBaseLayer: getSelectedBaseLayer,
        setCenter: setCenter,
        settings: settings,
        setZoom: setZoom,
        updateSize: updateSize
    });

})(openlayersHelpers || {}, window.jQuery, window, document);
