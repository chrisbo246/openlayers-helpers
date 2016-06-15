/*eslint-env browser, jquery */
/*global ol, Basil, parsley, webappHelpers */
/**
* OL3 layers module.
* @module
* @external $
* @external ol
* @return {Object} Public functions / variables
*/
/*eslint-disable no-unused-vars*/
var mapLayersModule = (function () {
    /*eslint-enable no-unused-vars*/
    'use strict';

    var settings = {
        debug: false,
        properties: {
            visible: false
        },
        basil: {
        }
    };

    var olLayerTypes = ['Base', 'Group', 'Heatmap', 'Image', 'Layer', 'Tile', 'Vector', 'VectorTile'];

    var olSourceTypes = ['BingMaps', 'CartoDB', 'Cluster',
    'Image', 'ImageCanvas', 'ImageMapGuide', 'ImageStatic', 'ImageVector',
    'ImageWMS', 'MapQuest', 'OSM', 'Raster', 'Source', 'Stamen', 'Tile',
    'TileArcGISRest', 'TileDebug', 'TileImage', 'TileJSON', 'TileUTFGrid',
    'TileWMS', 'Vector', 'VectorTile', 'WMTS', 'XYZ', 'Zoomify'];
    // 'ImageArcGISRest', 'ImageEvent', 'RasterEvent', 'TileEvent', 'VectorEvent', 'UrlTile',

    var olFormatTypes = ['GMLBase', 'JSONFeature', 'TextFeature',
    'XML', 'XMLFeature', 'EsriJSON', 'Feature', 'GeoJSON', 'GML', 'GML2', 'GML3', 'GPX',
    'IGC', 'KML', 'MVT', 'OSMXML', 'Polyline', 'TopoJSON', 'WFS', 'WKT',
    'WMSCapabilities', 'WMSGetFeatureInfo', 'WMTSCapabilities'];

    var olStyleTypes = ['AtlasManager', 'Circle', 'Fill', 'Icon', 'Image', 'RegularShape',
    'Stroke', 'Style', 'Text'];

    var olSourceGetters = {'revision': 'getRevision', 'state': 'getState', 'urls': 'getUrls', 'url': 'getUrl'};
    //'attributions': 'getAttributions', 'logo': 'getLogo', 'projection': 'getProjection',
    //'tileGrid': 'getTileGrid', 'tileLoadFunction': 'getTileLoadFunction', 'tileUrlFunction': 'getTileUrlFunction'
    //var olSourceSetters = {'revision': 'setRevision', 'state': 'setState', 'urls': 'setUrls', 'url': 'setUrl'};
    var olStyleTypeGetters = {'Fill': 'getFill', 'Image': 'getImage', 'Stroke': 'getStroke', 'Text': 'getText'};
    var olStylePropertyGetters = {'color': 'getColor', 'lineCap': 'getLineCap', 'geometry': 'getGeometry', 'geometryFunction': 'getGeometryFunction', 'lineDash': 'getLineDash',
    'lineJoin': 'getLineJoin', 'miterLimit': 'getMiterLimit', 'width': 'getWidth', 'zIndex': 'getZIndex'};
    var olStylePropertySetters = {'color': 'setColor', 'lineCap': 'setLineCap', 'geometry': 'setGeometry', 'geometryFunction': 'setGeometryFunction', 'lineDash': 'setLineDash',
    'lineJoin': 'setLineJoin', 'miterLimit': 'setMiterLimit', 'width': 'setWidth', 'zIndex': 'getZIndex'};


    var protocol = (window.location.protocol === 'https:') ? 'https:' : 'http:';

    var layers = {};
    var selectedLayer;
    var basil;

    if (typeof Basil === 'function') {
        basil = new window.Basil(settings.basil);
    }



    /**
    * Display some logs about layer events
    * @private
    * @param {Object} layer - ol.layer
    */
    var debug = function (layer) {

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
    * Create a new layer using predefined settings
    * @public
    * @param {string} name - Predefined layer (variable name)
    * @param {Object} [properties] - Layer custom parameters
    * @return {Object} OL3 layer
    */
    var create = function (name, properties) {

        if (!openlayersPredefinedLayers[name]) {
            console.warn(name + ' layer definition is not defined');
            return false;
        }

        // Define the new layer with a predefined layer
        var layer = openlayersPredefinedLayers[name]();

        debug(layer);

        // Apply default and custom settings
        layer.setProperties($.extend(true, {}, settings.properties, properties));

        // Append a link to the settings after each title
        var title = layer.get('title');
        if (title) {
            layer.set('title', title
            + ' <a href="#layer_settings_modal" data-toggle="modal" data-layer="' + name + '">'
            + '<span class="glyphicon glyphicon-cog"></span></a>');
        }

        if (basil) {
            restoreLayer(layer);
            watchLayerChanges(layer);
        }

        return layer;
    };



    /**
    * Apply a function on (nested) layers
    * @public
    * @param {Object} layer - Map object or layer group
    * @param {function} fn - Function with layer as parameter, to apply to each layer
    */
    var treatLayers = function (layer, fn) {

        $.each(layers, function (i, l) {
            if (l.getLayers()) {
                treatLayers(l, fn);
            } else {
                fn(l);
            }
        });

    };



    /**
    * Live update layer values once a field was validated by Parsley
    * @public
    * @param {Object} layer - Map object or layer group
    */
    var validateSettingsForm = function (formSelector) {

        var $input, key, value, style, type;

        if (!$().parsley) {
            console.warn('Parsley is not defined');
            return false;
        }

        var $form = $(formSelector);
        $form.parsley({
            excluded: 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], [disabled], :hidden'
        })
        .on('field:success', function() {
            $input = this.$element;

            // Update layer properties
            if ($input.is('[data-ol-layer][data-ol-property]')) {
                key = $input.data('ol-property');
                value = webappHelpers.getInputValue($input);
                if (key && value !== null) {
                    selectedLayer.set(key, value);
                }
            }

            // Update source urls
            if ($input.is('[data-ol-source][data-ol-property="urls"]')) {
                value = webappHelpers.getInputValue($input);
                value = value.split('\n');
                updateSourceUrl(selectedLayer, value);
            }

            // Update source features
            if ($input.is('[data-ol-source="Vector"][data-ol-format="GPX"]')) {
                value = webappHelpers.getInputValue($input);
                loadFileFeatures(selectedLayer, value, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                });
                //openlayersHelpers.fitVectorLayer(selectedLayer);
            }

            // Update layer style
            if ($input.is('[data-ol-style][data-ol-property]')) {
                key = $input.data('ol-property');
                value = webappHelpers.getInputValue($input);
                type = $input.data('ol-style');
                style = selectedLayer.getStyle();
                if (olStyleTypeGetters[type] && typeof style[olStyleTypeGetters[type]]) {
                    style = style[olStyleTypeGetters[type]]();
                    if (olStylePropertySetters[key] && typeof style[olStylePropertySetters[key]]) {
                        style[olStylePropertySetters[key]](value);
                    }
                }
            }

        })
        .on('form:submit', function () {
            // Prevent form submission
            return false;
        });

    };



    /**
    * Edit layer
    * @public
    * @param {Object} layer - Map object or layer group
    */
    var initSettingsForm = function (layer, formSelector, formGroupSelector) {

        var $input, $groups, key, value;

        var $form = $(formSelector);
        var $formGroups = $form.find(formGroupSelector);

        // Memorize the selected layer
        selectedLayer = layer;

        // Hide every form groups
        $formGroups.hide();

        // Get layer types
        var layerTypes = webappHelpers.getInstancesOf(layer, ol.layer, olLayerTypes);
        console.log('Layer types', layerTypes);

        // Get layer properties
        var layerKeys = layer.getKeys();
        console.log('Layer keys', layerKeys);
        var layerProperties = layer.getProperties(layer);
        console.log('Layer properties', layerProperties);
        if (typeof layer.getSource === 'function') {
            var source = layer.getSource();
        }
        if (typeof layer.getStyle === 'function') {
            var style = layer.getStyle();
        }

        // Unhide filtered form groups
        //$groups = $formGroups.has('[data-ol-layer]');
        var types = layerTypes;
        types.push('*');
        types.forEach(function (type) {
            $groups = $formGroups.has('[data-ol-layer="' + type + '"]');
            layerKeys.forEach(function (key2) {
                $groups.has('[data-ol-property="' + key2 + '"]').show()
                .find('label small').html('(' + type + ')');
            });
        });

        if (source) {

            // Get source types
            var sourceTypes = webappHelpers.getInstancesOf(source, ol.source, olSourceTypes);
            console.log('Layer source types', sourceTypes);

            // Get source properties
            var sourceKeys = source.getKeys();
            console.log('Layer source keys', sourceKeys);
            var sourceProperties = source.getProperties(layer);
            console.log('Layer source properties', sourceProperties);
            //if (typeof source.getUrls === 'function') {
            //    var sourceUrls = source.getUrls(layer);
            //    console.log('Source URLs', sourceUrls);
            //}
            if (typeof source.getFormat === 'function') {
                var format = source.getFormat();
            }

            var sourceExtraProperties = {};
            $.each(olSourceGetters, function (key2, getter2) {
                if (typeof source[getter2] === 'function') {
                    value = source[getter2]();
                    if (value && !sourceProperties[key2]) {
                        sourceExtraProperties[key2] = value;
                    }
                }
            });
            console.log('Source extra properties', sourceExtraProperties);

            // Unhide filtered form groups
            //$groups = $formGroups.has('[data-ol-source]');
            types = sourceTypes;
            types.push('*');
            types.forEach(function (type) {
                $groups = $formGroups.has('[data-ol-source="' + type + '"]');
                sourceKeys.forEach(function (key2) {
                    $groups.has('[data-ol-property="' + key2 + '"]').show()
                    .find('label small').html('(' + type + ')');
                });
                $.each(sourceExtraProperties, function (key2) {
                    $groups.has('[data-ol-property="' + key2 + '"]').show()
                    .find('label small').html('(' + type + ')');
                });
                //if (sourceUrls) {
                //    $groups.has('[data-ol-property="urls"]').show();
                //}
            });

            if (format) {

                // Get format types
                var formatTypes = webappHelpers.getInstancesOf(format, ol.format, olFormatTypes);
                console.log('Layer format types', formatTypes);

                // Unhide filtered form groups
                //$groups = $formGroups.has('[data-ol-format]');
                types = formatTypes;
                types.push('*');
                types.forEach(function (type) {
                    $groups = $formGroups.has('[data-ol-format="' + type + '"]');
                    $groups.show()
                    .find('label small').html('(' + type + ')');
                });
                $groups.has('[data-ol-format=""]').show();

            }

        }

        if (style) {

            var styleTypes = webappHelpers.getInstancesOf(style, ol.style, olStyleTypes);
            console.log('Layer style types', styleTypes);

            var styleProperties = {};

            $.each(olStyleTypeGetters, function (key2, getter2) {
                if (typeof style[getter2] === 'function') {

                    styleProperties[key2] = {};
                    value = style[getter2]();

                    if (value) {
                        styleTypes = webappHelpers.getInstancesOf(value, ol.style, olStyleTypes);

                        // If property is a child style
                        if (styleTypes) {
                            console.log('Child style ' + key2 + ' found', styleTypes);

                            // Unhide filtered form groups
                            //$groups = $formGroups.has('[data-ol-style]');
                            types = styleTypes;
                            types.push('*');
                            types.forEach(function (type) {
                                $groups = $formGroups.has('[data-ol-style="' + type + '"]');

                                $.each(olStylePropertyGetters, function (key3, getter3) {
                                    if (typeof value[getter3] === 'function') {
                                        value = value[getter3]();
                                        //console.log(key2 + ' ' + key3 + '(' + (typeof value) + ')', value);
                                        styleProperties[key2][key3] = value;
                                        $groups.has('[data-ol-property="' + key3 + '"]').show()
                                        .find('label small').html('(' + type + ')');
                                    }
                                });

                            });


                        } else {
                            styleProperties[key2] = value;
                        }
                    }

                }
            });
            console.log('Layer style properties', styleProperties);

        }

        // Populate fields with layer properties
        if (layerProperties) {
            $formGroups.find(':input').filter('[data-ol-layer][data-ol-property]').each(function () {
                $input = $(this);
                key = $input.data('ol-property');
                if (layerProperties[key] !== null) {
                    value = layerProperties[key];
                    webappHelpers.setInputValue($input, value);
                    console.log('Layer property ' + key + ' populated', value);
                }
            });
        }

        if (sourceProperties) {
            $formGroups.find(':input').filter('[data-ol-source][data-ol-property]').each(function () {
                $input = $(this);
                key = $input.data('ol-property');
                if (sourceProperties[key] !== null) {
                    value = sourceProperties[key];
                    webappHelpers.setInputValue($input, value);
                    console.log('Source property ' + key + ' populated', value);
                }
            });
        }
        if (sourceExtraProperties) {
            $formGroups.find(':input').filter('[data-ol-source][data-ol-property]').each(function () {
                $input = $(this);
                key = $input.data('ol-property');
                if (sourceExtraProperties[key] !== null) {
                    value = sourceExtraProperties[key];
                    webappHelpers.setInputValue($input, value);
                    console.log('Source property ' + key + ' populated', value);
                }
            });
        }

        if (formatTypes) {
            $formGroups.find(':input').filter('[data-ol-source="Vector"][data-ol-format="GPX"]').each(function () {
                console.log('Layer input "file" ready', value);
            });
        }

        if (styleProperties) {
            var styleType;
            $formGroups.find(':input').filter('[data-ol-style][data-ol-property]').each(function () {
                $input = $(this);
                styleType = $input.data('ol-style');
                key = $input.data('ol-property');
                if (styleType && key && styleProperties[styleType] && styleProperties[styleType][key] !== null) {
                    value = styleProperties[styleType][key];
                    console.log(styleType + ' ' + key + ' (' + (typeof value) + ')', value);
                    webappHelpers.setInputValue($input, value);
                }
            });
        }

        // Initialize Parsley excluding hidden fields
        // and update layer properties when the form is submitted
        validateSettingsForm(formSelector);

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

    // _____________________________________________________________________________________________



    return {
        create: create,
        loadFileFeatures: loadFileFeatures,
        initSettingsForm: initSettingsForm,
        selectedLayer: selectedLayer,
        settings: settings,
        treatLayers: treatLayers,
        updateSourceUrl: updateSourceUrl
    };

})();
