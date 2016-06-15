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

    // Define map base layers
    var openCycleMapLayer = openlayersHelpers.getPredefinedLayer('openCycleMap');
    var openStreetMapLayer = openlayersHelpers.getPredefinedLayer('openStreetMap');
    var mapsForFreeReliefLayer = openlayersHelpers.getPredefinedLayer('mapsForFreeRelief');
    var customBaseLayerLayer = openlayersHelpers.getPredefinedLayer('customBaseLayer');
    var googleMapLayer = openlayersHelpers.getPredefinedLayer('googleMap');
    var googleTerrainLayer = openlayersHelpers.getPredefinedLayer('googleTerrain');
    var googleSatelliteLayer = openlayersHelpers.getPredefinedLayer('googleSatellite');
    var mapquestOSMLayer = openlayersHelpers.getPredefinedLayer('mapquestOSM');
    var mapquestSatLayer = openlayersHelpers.getPredefinedLayer('mapquestSat');

    openlayersHelpers.initLayer(openCycleMapLayer);
    openlayersHelpers.initLayer(openStreetMapLayer, {visible: true});
    openlayersHelpers.initLayer(mapsForFreeReliefLayer);
    openlayersHelpers.initLayer(customBaseLayerLayer);
    openlayersHelpers.initLayer(googleMapLayer);
    openlayersHelpers.initLayer(googleTerrainLayer);
    openlayersHelpers.initLayer(googleSatelliteLayer);
    openlayersHelpers.initLayer(mapquestOSMLayer);
    openlayersHelpers.initLayer(mapquestSatLayer);

    // Define map layers
    var gpxFileLayer = openlayersHelpers.getPredefinedLayer('gpxFile');
    var googleHybridLayer = openlayersHelpers.getPredefinedLayer('googleHybrid');
    var googleBikeLayer = openlayersHelpers.getPredefinedLayer('googleBike');
    var lonviaCyclingLayer = openlayersHelpers.getPredefinedLayer('lonviaCycling');
    var lonviaHikingLayer = openlayersHelpers.getPredefinedLayer('lonviaHiking');
    var mapquestHybLayer = openlayersHelpers.getPredefinedLayer('mapquestHyb');
    var uniHeidelbergAsterhLayer = openlayersHelpers.getPredefinedLayer('uniHeidelbergAsterh');
    var customOverlayLayer = openlayersHelpers.getPredefinedLayer('customOverlay');

    openlayersHelpers.initLayer(gpxFileLayer, {zIndex: 8});
    openlayersHelpers.initLayer(googleHybridLayer, {zIndex: 7});
    openlayersHelpers.initLayer(googleBikeLayer, {zIndex: 6});
    openlayersHelpers.initLayer(lonviaCyclingLayer, {zIndex: 5});
    openlayersHelpers.initLayer(lonviaHikingLayer, {zIndex: 4});
    openlayersHelpers.initLayer(mapquestHybLayer, {zIndex: 3});
    openlayersHelpers.initLayer(uniHeidelbergAsterhLayer, {zIndex: 2});
    openlayersHelpers.initLayer(customOverlayLayer, {zIndex: 1});


    // Define map controls
    var attributionControl = openlayersHelpers.getPredefinedControl('attribution');
    var scaleLineControl = openlayersHelpers.getPredefinedControl('scaleLine');
    var fullScreenControl = openlayersHelpers.getPredefinedControl('fullScreen');
    var layerSwitcherControl = openlayersHelpers.getPredefinedControl('layerSwitcher');
    var zoomSliderControl = openlayersHelpers.getPredefinedControl('zoomSlider');

    // Define layer groups
    var layers = [
        new ol.layer.Group({
            name: 'baseLayers',
            title: 'Base map',
            layers: [
                customBaseLayerLayer,
                mapquestSatLayer,
                openCycleMapLayer,
                mapquestOSMLayer,
                openStreetMapLayer
            ]
        }),
        new ol.layer.Group({
            name: 'overlays',
            title: 'Overlays',
            layers: [
                customOverlayLayer,
                mapquestHybLayer,
                lonviaHikingLayer,
                lonviaCyclingLayer,
                gpxFileLayer
            ]
        })
    ];

    var controls = ol.control.defaults({
        attribution: false,
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
        }),
        zoomOptions: {

        }
    }).extend([
        attributionControl,
        scaleLineControl,
        fullScreenControl,
        zoomSliderControl,
        layerSwitcherControl
    ]);


    $(function () {

        // Map initialization
        map = new ol.Map({
            layers: layers,
            target: target,
            view: new ol.View({
                center: [0, 0],
                zoom: 4,
                minZoom: 2,
                maxZoom: 19
            }),
            controls: controls,
            logo: false
        });

        // Associate helpers to the map
        openlayersHelpers.initMap(map, {
            debug: true
        });

        /*
        // Try to restore map center and zoom from the local storage
        if (!mapHelpers.restoreMapProperties()) {
        // Or center map on user position and set a default zoom
        mapHelpers.setCenterOnPosition();
        mapHelpers.map.getView().setZoom(12);
        // mapHelpers.storeMapChanges();
        */

        // You must call the updateSize() function
        // when you change the map container size "manually"
        // mapHelpers.updateSize();


        // Force the Bootstrap modal API to initialize the layerswitcher links
        $('.layer-switcher').on('click', 'a[data-toggle="modal"]', function (e) {
            e.preventDefault();
            $(this).trigger('click.bs.modal.data-api');
        });

        // Populate the layer inputs when the modal show up
        $('#layer_settings_modal').on('show.bs.modal', function (e) {
            var $modal = $(this);

            var layerVarName = $(e.relatedTarget).data('layer-name') + 'Layer';
            if (typeof layerVarName !== 'undefined') {
                /*eslint-disable no-eval*/
                var selectedLayer = eval(layerVarName);
                /*eslint-enable no-eval*/
                if (selectedLayer) {
                    openlayersHelpers.initLayerInputs(selectedLayer);
                    var title = selectedLayer.get('title');
                    $modal.find('.modal-title').html(title);
                }
            }

        });

        // Update map overlay when user click ok
        $('#layer_settings_form').on('submit', function (e) {
            e.preventDefault();
            var $modal = $('#layer_settings_modal');
            $modal.modal('hide');
        });

    });



    return {
        map: map
    };

})();