/*eslint-env browser, jquery */
/*global ol, mapControlsModule, mapLayersModule, openlayersHelpers */

/**
* OL3 map definition example using openlayersHelpers
* @author chrisbo246
* @version: 0.0.1
* @module
* @external $
* @external mapControlsModule
* @external mapLayersModule
* @external openlayersHelpers
* @return {Object} Public functions / variables
*/

/*eslint-disable no-unused-vars*/
var map1 = (function () {
    /*eslint-enable no-unused-vars*/
    'use strict';

    // Map container
    var target = '#map1';

    // Define map base layers
    var openCycleMapLayer = mapLayersModule.create('openCycleMap');
    var openStreetMapLayer = mapLayersModule.create('openStreetMap', {visible: true});
    var mapsForFreeReliefLayer = mapLayersModule.create('mapsForFreeRelief');
    var customBaseLayerLayer = mapLayersModule.create('customBaseLayer');
    var googleMapLayer = mapLayersModule.create('googleMap');
    var googleTerrainLayer = mapLayersModule.create('googleTerrain');
    var googleSatelliteLayer = mapLayersModule.create('googleSatellite');
    var mapquestOSMLayer = mapLayersModule.create('mapquestOSM');
    var mapquestSatLayer = mapLayersModule.create('mapquestSat');

    // Define map layers
    var gpxFileLayer = mapLayersModule.create('gpxFile', {zIndex: 8});
    var googleHybridLayer = mapLayersModule.create('googleHybrid', {zIndex: 7});
    var googleBikeLayer = mapLayersModule.create('googleBike', {zIndex: 6});
    var lonviaCyclingLayer = mapLayersModule.create('lonviaCycling', {zIndex: 5});
    var lonviaHikingLayer = mapLayersModule.create('lonviaHiking', {zIndex: 4});
    var mapquestHybLayer = mapLayersModule.create('mapquestHyb', {zIndex: 3});
    var uniHeidelbergAsterhLayer = mapLayersModule.create('uniHeidelbergAsterh', {zIndex: 2});
    var customOverlayLayer = mapLayersModule.create('customOverlay', {zIndex: 1});

    // Define map controls
    var attributionControl = openlayersHelpers.getPredefinedControl('attribution');
    var scaleLineControl = openlayersHelpers.getPredefinedControl('scaleLine');
    var fullScreenControl = openlayersHelpers.getPredefinedControl('fullScreen');
    var layerSwitcherControl = openlayersHelpers.getPredefinedControl('layerSwitcher');
    var zoomSliderControl = openlayersHelpers.getPredefinedControl('zoomSlider');

    // Define layer groups
    var layerGroups = [
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

    // Map initialization
    var map = new ol.Map({
        layers: layerGroups,
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
    var helpers = new openlayersHelpers(map, {
        debug: debug
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



    $(function () {

    });


    return {
        map: map,
        helpers: helpers
    };

})();
