/*eslint-env browser, jquery */
/*global ol, mapControlsModule, mapLayersModule, openlayersMapHelpers */

/**
* OL3 map definition example using openlayersMapHelpers
* @author chrisbo246
* @version: 0.0.1
* @module
* @external $
* @external mapControlsModule
* @external mapLayersModule
* @external openlayersMapHelpers
* @return {Object} Public functions / variables
*/

/*eslint-disable no-unused-vars*/
var map1 = (function () {
    /*eslint-enable no-unused-vars*/
    'use strict';

    var map;

    // Map container id (without #)
    var target = 'map1';

    // Hide logs for localhost
    if (document.domain !== 'localhost') {
        ['log', 'time', 'timeEnd'].forEach(function (fn) {
            console[fn] = function () {};
        });
    }

    // Define layer groups
    var layers = [
        new ol.layer.Group({
            name: 'baseLayers',
            title: 'Base map',
            layers: openlayersHelpers.getPredefinedLayers({
                //customBaseLayer: {},
                //mapquestSat: {},
                //openCycleMap: {},
                //mapquestOSM: {},
                stamenTerrainBackground: {},
                openStreetMap: {visible: true}
            })
        }),
        new ol.layer.Group({
            name: 'overlays',
            title: 'Overlays',
            layers: openlayersHelpers.getPredefinedLayers({
                //customOverlay: {},
                stamenTerrainLines: {},
                lonviaHiking: {},
                lonviaCycling: {},
                gpxFile: {},
                stamenTonerLabels: {},
                stamenTerrainLabels: {}
            })
        })
    ];

    var controls = ol.control.defaults({
        attribution: true,
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
        }),
        rotate: false,
        rotateOptions: {},
        zoom: true,
        zoomOptions: {}
    }).extend(openlayersHelpers.getPredefinedControls({
        fullScreen: {},
        mousePosition: {},
        scaleLine: {},
        zoomSlider: {},
        zoomToExtent: {},
        sidebarToggler: {},
        rotate: {},
        overviewMap: {},
        layerSwitcher: {}
    }));

    $(function () {

        // Map initialization
        map = new ol.Map({
            layers: layers,
            target: target,
            view: new ol.View({
                center: [0, 0],
                zoom: 4,
                minZoom: 2,
                maxZoom: 19,
                rotation: -Math.PI / 8
            }),
            controls: controls,
            logo: false
        });


        // Associate helpers to the map
        openlayersHelpers.initMap(map, {});

        /*
        // Try to restore map center and zoom from the local storage
        if (!mapHelpers.restoreMapProperties()) {
        // Or center map on user position and set a default zoom
        mapHelpers.setCenterOnPosition();
        mapHelpers.map.getView().setZoom(12);
        // mapHelpers.storeMapChanges();
        */

        openlayersLayerSettings.init(map, {
            mapSelector: '.map',
            formSelector: '#layer-settings-form',
            modalSelector: '#layer-settings-modal'
        });
/*
        var $map = $('.map');
        var $form = $('#layer-settings-form');
        var $modal = $('#layer-settings-modal');

        // Force the Bootstrap modal API to initialize the layerswitcher links
        $map.find('.layer-switcher').on('click', 'a[data-toggle="modal"]', function (e) {
            e.preventDefault();
            $(this).trigger('click.bs.modal.data-api');
        });

        // Populate the layer inputs when the modal show up
        $modal.on('show.bs.modal', function (e) {
            var $modal = $(this);

            var layerVarName = $(e.relatedTarget).data('layer-name') + 'Layer';
            console.log('Selected layer', layerVarName);
            console.log('typeof', typeof layerVarName);
            */
            //if (typeof layerVarName !== 'undefined') {
                /*eslint-disable no-eval*/
            //    var selectedLayer = eval(layerVarName);
                /*eslint-enable no-eval*/
            //    if (selectedLayer) {
            //        openlayersHelpers.initLayerInputs(selectedLayer);
            //        var title = selectedLayer.get('title');
            //        $modal.find('.modal-title').html(title);
            //    }
            //}
/*
        });

        // Update map overlay when user click ok
        $form.on('submit', function (e) {
            e.preventDefault();
            $modal.modal('hide');
        });

        */

    });

    return {
        map: map
    };

})();
