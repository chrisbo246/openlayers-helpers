/*eslint-env browser, jquery */
/*global ol, Basil, parsley, webappHelpers */
/**
* OL3 layer helpers
* @module
* @external $
* @external ol
* @return {Object} Public functions / variables
*/
/*eslint-disable no-unused-vars*/
var openlayersLayerHelpers  = (function (mod, $, window, document) {
    /*eslint-enable no-unused-vars*/
    'use strict';

    var defaults = {
        debug: (document.domain === 'localhost'),
        properties: {
            visible: false
        },
        basil: {
        }
    };

    var settings = defaults;

    var basil;

    if (typeof Basil === 'function') {
        basil = new window.Basil(settings.basil);
    }



    /**
    * Display some logs about layer events
    * @private
    * @param {Object} layer - ol.layer
    */
    var debugLayer = function (layer) {

        if (!settings.debug) {
            webappHelpers.hideLogs();
            return false;
        }

        // postcompose precompose render propertychange
        'change change:blur change:extent change:gradient change:layers change:maxResolution change:minResolution change:opacity change:preload change:radius change:source change:useInterimTilesOnError change:visible change:zIndex'.split(' ').forEach(function (eventType) {
            layer.on(eventType, function (e) {
                if (e.key) {
                    console.log('Layer ' + e.key + ' changed', layer.get(e.key));
                } else {
                    console.log(e.target.get('name') + ' layer' + e.type, e);
                }

            });
        });

    };



    /**
    * Restore some properties from the local storage and save changes
    * @private
    * @param {Object} layer - ol.layer
    */
    var watchLayerChanges = function (layer) {

        // Store layer properties changes
        layer.on('propertychange', function () {

            var namespace = layer.get('name');
            if (namespace) {

                var properties = layer.getProperties();
                var key = 'properties';
                var value = {
                    visible: properties.visible,
                    zIndex: properties.zIndex,
                    opacity: properties.opacity
                };
                basil.set(key, value, {'namespace': namespace});
                console.log(namespace + ' properties stored', value);

            }

        });

    };



    /**
    * Restore all layers properties from the local storage
    * @private
    * @param {Object} layer - ol.layer
    */
    var restoreLayer = function (layer) {

        var namespace = layer.get('name');
        if (namespace) {

            var key = 'properties';
            var value = basil.get(key, {'namespace': namespace});
            if (value !== null) {
                layer.setProperties(value);
                console.log(namespace + ' ' + key + ' restored', value);
            }

        }

    };



    /**
    * Update layer source url
    * @public
    * @param {Object} layer - OL3 layer
    * @param {String|array} url - URL
    */
    var updateSourceUrl = function (layer, url) {

        if (!layer) {
            return false;
        }

        var source = layer.getSource();

        if (typeof source.setUrls !== 'undefined') {
            if ($.isArray(url)) {
                source.setUrls(url);
            } else {
                url = $.trim(url);
                source.setUrl(url);
            }
        }

        // Show layer if the URL is defined, else hide layer
        //layer.setVisible((url));

    };



    /**
    * Update the GPX layer with the input file values
    * @private
    * @param {Object} layer - OL layer
    * @param {Object} files - Input file [files]
    * @param {Object} featuresOptions - Features options
    */
    var loadFileFeatures = function (layer, files, featuresOptions) {

        if (files.length === 0) {
            return false;
        }

        var source = layer.getSource();

        // Remove all features
        source.clear();

        var dfd = webappHelpers.reader(files, function (result) {

            // Import features from files
            var format = source.getFormat();
            var features = format.readFeatures(result, featuresOptions);
            source.addFeatures(features);

            // Display layer
            layer.setVisible(true);

        });

        // Refresh the layerswitcher control
        //layerSwitcherControl.renderPanel();

        // Adjust the view to fit tracks
        //mapMod1.fitVectorLayer(gpxLayer);

        return dfd;

    };



    /**
    * Finds recursively the layer with the specified key and value.
    * @param {ol.layer.Base} layer
    * @param {String} key
    * @param {any} value
    * @returns {ol.layer.Base}
    */
    var findLayerBy = function (layer, key, value) {

        // If it's a single layer and the value was found, return the layer
        if (layer.get(key) === value) {
            return layer;
        }

        // If it's a group, search recursively
        if (layer.getLayers) {
            var layers = layer.getLayers().getArray();
            var result;
            layers.forEach(function (l) {
                result = findLayerBy(l, key, value);
                if (result) {
                    return result;
                }
            });
        }

        // Else
        return null;

    };



    /**
    * Apply a function on (nested) layers
    * @public
    * @param {Object} layer - Map object or layer group
    * @param {function} fn - Function with layer as parameter, to apply to each layer
    */
    var treatLayers = function (layers, fn) {

        $.each(layers, function (i, l) {
            if (l.getLayers()) {
                treatLayers(l, fn);
            } else {
                fn(l);
            }
        });

    };



    /**
    * Check if it's a layer instance
    * @param {Object} layer - OL3 layer
    * @returns {Boolean}
    */
    var isLayer = function (layer) {
        var test = false;
        var classNames = ['Base', 'Group', 'Heatmap', 'Image', 'Layer', 'Tile', 'Vector', 'VectorTile'];
        $.each(classNames, function (i, v) {
            if (typeof ol.layer[v] === 'function') {
                test = layer instanceof ol.layer[v];
                return !test;
            }
        });
        return test;
    }



    /**
    * Get some predefined layers
    * @public
    * @param {Object} predefinedLayers {name: options}
    * @return {Array} List of predefined layers
    */
    var getPredefinedLayers = function (predefinedLayers) {

        var layers = [];
        $.each(predefinedLayers, function (name, properties) {
            layers.push(getPredefinedLayer(name, properties));
        })

        return layers.filter(function (e) { return e });

    };



    /**
    * Create a new layer using predefined settings
    * @public
    * @param {string} name - Predefined layer (variable name)
    * @param {Object} [properties] - Layer custom parameters
    * @return {Object} OL3 layer
    */
    var getPredefinedLayer = function (name, properties) {

        //if (!openlayersPredefinedLayers || !openlayersPredefinedLayers[name]) {
        if (typeof openlayersPredefinedLayers[name] !== 'function') {
            console.warn(name + ' layer definition is not defined');
            return new ol.layer.Tile();
        }

        // Define the new layer with a predefined layer
        var layer = openlayersPredefinedLayers[name]();

        if (!isLayer(layer)) {
            console.warn('Invalid layer returned by', name);
            layer = new ol.layer.Tile();
        }

        // Apply default and custom settings
        properties = $.extend(true, {}, settings.properties, properties);
        layer.setProperties(properties);

        initLayer(layer, properties);

        return layer;

    };



    /**
    * Apply common tasks on a freshly initialized layer
    * @param {Object} layer - OL3 layer
    */
    var initLayer = function (layer) {

        debugLayer(layer);

        /*
        // Append a link to the settings after each title
        var name = layer.get('name');
        var title = layer.get('title');
        if (name && title) {
            //layer.set('title', title);
            layer.set('title', title
            + ' <a class="btn-link" href="#layer_settings_modal" data-toggle="modal" data-layer-name="' + name + '">'
            + '<span class="glyphicon glyphicon-cog"></span></a>');
        }

        if (basil) {
            restoreLayer(layer);
            watchLayerChanges(layer);
        }
        */

        return layer;
    };



    return $.extend(mod, {
        initLayer: initLayer,
        loadFileFeatures: loadFileFeatures,
        findLayerBy: findLayerBy,
        settings: settings,
        treatLayers: treatLayers,
        updateSourceUrl: updateSourceUrl,
        isLayer: isLayer,
        getPredefinedLayer: getPredefinedLayer,
        getPredefinedLayers: getPredefinedLayers
    });

})(openlayersHelpers || {}, window.jQuery, window, document);
