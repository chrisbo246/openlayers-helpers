"use strict";var map1=function(){var e,o="map1";"localhost"!==document.domain&&["log","time","timeEnd"].forEach(function(e){console[e]=function(){}});var a=[new ol.layer.Group({name:"baseLayers",title:"Base map",layers:openlayersHelpers.getPredefinedLayers({stamenTerrainBackground:{},openStreetMap:{visible:!0}})}),new ol.layer.Group({name:"overlays",title:"Overlays",layers:openlayersHelpers.getPredefinedLayers({stamenTerrainLines:{},lonviaHiking:{},lonviaCycling:{},gpxFile:{},stamenTonerLabels:{},stamenTerrainLabels:{}})})],r=ol.control.defaults({attribution:!0,attributionOptions:{collapsible:!1},rotate:!1,rotateOptions:{},zoom:!0,zoomOptions:{}}).extend(openlayersHelpers.getPredefinedControls({fullScreen:{},mousePosition:{},scaleLine:{},zoomSlider:{},zoomToExtent:{},sidebarToggler:{},rotate:{},overviewMap:{},layerSwitcher:{}}));return $(function(){e=new ol.Map({layers:a,target:o,view:new ol.View({center:[0,0],zoom:4,minZoom:2,maxZoom:19,rotation:-Math.PI/8}),controls:r,logo:!1}),openlayersHelpers.initMap(e,{}),openlayersLayerSettings.init(e,{mapSelector:".map",formSelector:"#layer-settings-form",modalSelector:"#layer-settings-modal"})}),{map:e}}();