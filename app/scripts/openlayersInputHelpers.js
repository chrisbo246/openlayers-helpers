/*eslint-env browser, jquery */
/*global ol */
/**
* OL3 input helpers
* @module
* @external $
* @external ol
* @return {Object} Public functions / variables
*/
/*eslint-disable no-unused-vars*/
var openlayersInputHelpers = (function (mod) {
    /*eslint-enable no-unused-vars*/
    'use strict';

    var defaults = {
        formSelector: '#layer_settings_form',
        formGroupSelector: '.form-group'
    };

    var settings = defaults;

    var selectedLayer;

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



    /**
    * Live update layer values once a field was validated by Parsley
    * @private
    */
    var validateLayerInputs = function () {

        var $input, key, value, style, type;

        if (!$().parsley) {
            console.warn('Parsley is not defined');
            return false;
        }

        var $form = $(settings.formSelector);
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
                //openlayersMapHelpers.fitVectorLayer(selectedLayer);
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
    var initLayerInputs = function (layer) {

        var $input, $groups, key, value;

        var $form = $(settings.formSelector);
        var $formGroups = $form.find(settings.formGroupSelector);

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
        validateLayerInputs();

    };



    var initLayerInputsBootstrapModal = function (modalSelector) {

        // Select the layer passed to the modal
        $(modalSelector).on('show.bs.modal', function (e) {
            var $modal = $(this);

            // Select the layer passed as link attribute
            var layerVarName = $(e.relatedTarget).data('layer') + 'Layer';
            if (typeof layerVarName !== 'undefined') {
                /*eslint-disable no-eval*/
                selectedLayer = eval(layerVarName);
                /*eslint-enable no-eval*/
            }

            if (selectedLayer) {

                // Populate fields with the selected layer properties
                // hide unwanted field groups
                // validate form and update layer values
                initLayerInputs(settings.selectedLayer);
                //mapLayersModule.initSettingsForm(selectedLayer, '#layer_settings_form', '.form-group, fieldset');

                // Change modal title
                var title = selectedLayer.get('title');
                $modal.find('.modal-title').html(title);

            }

        });
    };



    return $.extend(mod, {
        selectedLayer: selectedLayer,
        initLayerInputsBootstrapModal: initLayerInputsBootstrapModal
    });

})(openlayersHelpers || {});
