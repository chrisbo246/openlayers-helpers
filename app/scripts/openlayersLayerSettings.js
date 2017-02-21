/*eslint-env browser, jquery */
/*global ol */
/**
* Edit layer settings via a bootstrap modal
* @see {@link http://openlayers.org/en/v3.12.1/apidoc/}
* @class
* @external $
* @external ol
* @return {Object} Public functions / variables
*/

ol.control.LayerSwitcher.prototype.renderLayer_ = function(lyr, idx) {

    var this_ = this;

    var li = document.createElement('li');

    var lyrTitle = lyr.get('title');
    var lyrId = lyr.get('title').replace(/\s+/g, '-') + '_' + idx;

    var label = document.createElement('label');

    if (lyr.getLayers) {

        li.className = 'group';
        label.innerHTML = lyrTitle;
        li.appendChild(label);
        var ul = document.createElement('ul');
        li.appendChild(ul);

        this.renderLayers_(lyr, ul);

    } else {

        li.className = 'layer';
        var input = document.createElement('input');
        if (lyr.get('type') === 'base') {
            input.type = 'radio';
            input.name = 'base';
        } else {
            input.type = 'checkbox';
        }
        input.id = lyrId;
        input.checked = lyr.get('visible');
        input.onchange = function(e) {
            this_.setVisible_(lyr, e.target.checked);
        };
        li.appendChild(input);

        var settingslink = document.createElement('a');
        //var text = document.createTextNode('');
        //settingslink.appendChild(text);
        settingslink.href = '#layer-settings-modal';
        //settingslink.setAttribute('data-target', '#layer-settings-modal');
        settingslink.setAttribute('data-toggle', 'modal');
        settingslink.setAttribute('data-layer-name', lyr.get('name'));
        //settingslink.className  = 'btn-link glyphicon glyphicon-cog';
        settingslink.className  = 'layer-settings-toggler';
        li.appendChild(settingslink);

        label.htmlFor = lyrId;
        label.innerHTML = lyrTitle;
        li.appendChild(label);

    }

    return li;

};

/*eslint-disable no-unused-vars*/
var openlayersLayerSettings = (function (mod, $, window, document) {
    /*eslint-enable no-unused-vars*/
    'use strict';

    var settings = {
        mapSelector: '.map',
        formSelector: '#layer-settings-form',
        formGroupSelector: '.form-group',
        modalSelector: '#layer-settings-modal'
    };

    var selectedLayer;


//    var olSourceGetters = {'revision': 'getRevision', 'state': 'getState', 'urls': 'getUrls', 'url': 'getUrl'};
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
                value = mod.getInputValue($input);
                if (key && value !== null) {
                    selectedLayer.set(key, value);
                }
            }

            // Update source urls
            if ($input.is('[data-ol-source][data-ol-property="urls"]')) {
                value = mod.getInputValue($input);
                value = value.split('\n');
                mod.updateSourceUrl(selectedLayer, value);
            }

            // Update source features
            if ($input.is('[data-ol-source="Vector"][data-ol-format="GPX"]')) {
                value = mod.getInputValue($input);
                mod.loadFileFeatures(selectedLayer, value, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                });
                //openlayersMapHelpers.fitVectorLayer(selectedLayer);
            }

            // Update layer style
            if ($input.is('[data-ol-style][data-ol-property]')) {
                key = $input.data('ol-property');
                value = mod.getInputValue($input);
                type = $input.data('ol-style');
                style = selectedLayer.getStyle();
                if (olStyleTypeGetters[type] && typeof style[olStyleTypeGetters[type]]) {
                    source.getKeys().forEach(function (key2) {
                        style = style[olStyleTypeGetters[type]]();
                        if (olStylePropertySetters[key] && typeof style[olStylePropertySetters[key]]) {
                            style[olStylePropertySetters[key]](value);
                        }
                    });
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

        var $input, $groups, key, value, attributes;

        var $form = $(settings.formSelector);
        var $formGroups = $form.find(settings.formGroupSelector);

        // Memorize the selected layer
        selectedLayer = layer;

        // Hide every form groups
        $formGroups.hide();

        // Get layer types
        var layerTypes = mod.getInstanceTypes(layer, ol.layer);
        //console.log('Layer types', layerTypes);

        // Get layer properties
        var layerKeys = layer.getKeys();
        //console.log('Layer keys', layerKeys);
        var layerProperties = layer.getProperties(layer);
        //console.log('Layer properties', layerProperties);
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
            var sourceTypes = mod.getInstanceTypes(source, ol.source);
            //console.log('Layer source types', sourceTypes);

            // Get source properties
            var sourceKeys = source.getKeys();
            //console.log('Layer source keys', sourceKeys);
            var sourceProperties = source.getProperties(layer);
            //console.log('Layer source properties', sourceProperties);
            //if (typeof source.getUrls === 'function') {
            //    var sourceUrls = source.getUrls(layer);
            //    console.log('Source URLs', sourceUrls);
            //}
            if (typeof source.getFormat === 'function') {
                var format = source.getFormat();
            }

            var sourceExtraProperties = {};

            //$.each(olSourceGetters, function (key2, getter2) {
            source.getKeys().forEach(function (key2) {
                //if (typeof source[getter2] === 'function') {
                    //value = source[getter2]();
                    value = source.get(key2);
                    if (value && !sourceProperties[key2]) {
                        sourceExtraProperties[key2] = value;
                    }
                //}
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
                var formatTypes = mod.getInstanceTypes(format, ol.format);
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

            var styleTypes = mod.getInstanceTypes(style, ol.style);
            console.log('Layer style types', styleTypes);

            var styleProperties = {};

            $.each(olStyleTypeGetters, function (key2, getter2) {
            //style.getKeys().forEach(function (key2) {

                //if (typeof style[getter2] === 'function') {

                    styleProperties[key2] = {};
                    value = style[getter2]();
                    //value = style.get(key2);

                    if (value) {
                        styleTypes = mod.getInstanceTypes(value, ol.style);

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
                                //styleProperties.getKeys().forEach(function (key3) {
                                    if (typeof value[getter3] === 'function') {
                                        value = value[getter3]();
                                        //value = value.get(key3);
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

                //}
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
                    if (['visible', 'opacity'].indexOf(key) !== -1 && layerProperties.type === 'base') {
                        attributes = {disabled: 'disabled'};
                    } else {
                        attributes = {};
                    }
                    mod.setInputValue($input, value, attributes);
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
                    if (['url', 'urls'].indexOf(key) !== -1) {
                        //attributes = {disabled: 'disabled'};
                        attributes = {};
                    } else {
                        attributes = {};
                    }
                    mod.setInputValue($input, value, attributes);
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
                    mod.setInputValue($input, value);
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
                    mod.setInputValue($input, value);
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
            var layerName = $(e.relatedTarget).data('layer-name');
            if (typeof layerVarName !== 'undefined') {
                /*eslint-disable no-eval*/
                selectedLayer = eval(layerName + 'Layer');
                /*eslint-enable no-eval*/
            }

            if (selectedLayer) {

                // Populate fields with the selected layer properties
                // hide unwanted field groups
                // validate form and update layer values
                initLayerInputs(settings.selectedLayer);
                //mapLayersModule.initSettingsForm(selectedLayer, '#layer-settings-form', '.form-group, fieldset');

                // Change modal title
                var title = selectedLayer.get('title');
                $modal.find('.modal-title').html(title);

            }

        });
    };



    var init = function (map, options) {

        $.extend(settings, options);

        var $map = $(settings.mapSelector);
        var $form = $(settings.formSelector);
        var $modal = $(settings.modalSelector);

        // Get the layerSwitcher instance
        var layerSwitcher = mod.getControlInstanceOf(map, 'LayerSwitcher');

        //layerSwitcher.renderPanel = function() {
        //    console.log('renderPanel');
        //    // Call the original renderPanel function passing the instance as `this`
        //    ol.control.LayerSwitcher.prototype.renderPanel.call(layerSwitcher);
        //};

        // Force the Bootstrap modal API to initialize the layerswitcher links
        $map.find('.layer-switcher').on('click', 'a[data-toggle="modal"]', function (e) {
            e.preventDefault();
            $(this).trigger('click.bs.modal.data-api');
        });

        // Populate the layer inputs when the modal show up
        $modal.on('show.bs.modal', function (e) {
            var $modal = $(this);
            var $button = $(e.relatedTarget);

            var selectedLayerId = $button.siblings('input').first().attr('id');
            var selectedLayerName = $button.data('layerName');
            console.log('Selected layer ID', selectedLayerId);

            ol.control.LayerSwitcher.forEachRecursive(map, function (layer, idx, a) {
                var title = layer.get('title');
                if (title) {
                    var layerId = title.replace(/\s+/g, '-') + '_' + idx;
                }
                var layerName = layer.get('name');
                console.log('Layer ID', layerId);
                if ((layerName && selectedLayerName && layerName === selectedLayerName)
                || (layerId && selectedLayerId && layerId === selectedLayerId)) {
                    // Change modal title
                    $modal.find('.modal-title').html(title);
                    // Display inputs according to layer properties
                    initLayerInputs(layer);
                }
            });

            //if (typeof layerVarName !== 'undefined') {
            /*eslint-disable no-eval*/
            //    var selectedLayer = eval(layerVarName);
            /*eslint-enable no-eval*/
            //    if (selectedLayer) {
            //        initLayerInputs(selectedLayer);
            //        var title = selectedLayer.get('title');
            //        $modal.find('.modal-title').html(title);
            //    }
            //}

        });

        // Update map overlay when user click ok
        $form.on('submit', function (e) {
            e.preventDefault();
            $modal.modal('hide');
        });

    };



    $(function () {
    });


    return {
        init: init
    };

})(openlayersHelpers || {}, window.jQuery, window, document);
