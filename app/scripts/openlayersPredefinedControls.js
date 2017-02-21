/*eslint-env browser, jquery */
/*global ol */
/**
* OL3 predefined controls
* @module
* @external ol
* @return {Object} Public functions / variables
*/
/*eslint-disable no-unused-vars*/
var openlayersPredefinedControls = (function (mod, $, window, document) {
    /*eslint-enable no-unused-vars*/
    'use strict';

    /*
    Attribution !default
    Control
    FullScreen
    MousePosition
    OverviewMap
    Rotate !default
    ScaleLine
    Zoom !default
    ZoomSlider
    ZoomToExtent
    */

    var controls = {};

    controls.attribution = function () {
        return new ol.control.Attribution({
            collapsible: true
            //tipLabel: $.t('buttons:olAttribution.label')
        });
    };

    controls.sidebarToggler = function () {

        var button = document.createElement('button');
        var element = document.createElement('div');
        element.className = 'ol-control ol-sidebar-toggler';
        element.appendChild(button);

        button.addEventListener('click', function (e) {
            e.preventDefault();
            //var selector = $(this).data('target');
            //var $el = $(selector);
            //var el = document.querySelector('.ol-sidebar-wrapper');
            var el = document.querySelector('.map');
            if (el) {
                $(el).toggleClass('toggled').trigger('resize');
            }
        }, false);

        return new ol.control.Control({
            element: element,
            render: function () {

            }
        });
    };
    //var action = function(e){ alert('hola'); }
    //boton.addEventListener("click", action, false);

    controls.fullScreen = function () {
        return new ol.control.FullScreen({
            //label: '\e140',
            //label: document.createElement('span').className  = 'glyphicon glyphicon-resize-full'
            //className: 'glyphicon glyphicon-resize-full'
            //tipLabel: $.t('buttons:olFullScreen.label')
        });
    };

    controls.mousePosition = function () {
        return new ol.control.MousePosition({
           coordinateFormat: function (coord) {
              var template = '<label>Longitude: </label><output>{x}°</output>'
              + ' <label>Latitude: </label><output>{y}°</output>';
              return ol.coordinate.format(coord, template, 4);
           },
           projection: 'EPSG:4326',
           undefinedHTML: '<label>Longitude: </label><output></output>'
           + ' <label>Latitude: </label><output></output>'
        });
    };

    controls.mousePositionBootstrap = function () {
        return new ol.control.MousePosition({
           coordinateFormat: function (coord) {
              var template = '<form class="form-inline">'
              + '<div class="form-group"><label class="control-label">Longitude</label><p class="form-control-static text-right">{x}°</p></div>'
              + '<div class="form-group"><label class="control-label">Latitude</label><p class="form-control-static text-right">{y}°</p></div>'
              + '</form>';
              return ol.coordinate.format(coord, template, 4);
           },
           projection: 'EPSG:4326',
           undefinedHTML: '<form class="form-inline">'
              + '<div class="form-group"><label class="control-label">Longitude</label><p class="form-control-static text-right">-</p></div>'
              + '<div class="form-group"><label class="control-label">Latitude</label><p class="form-control-static text-right">-</p></div>'
              + '</form>'
        });
    };

    // mouse position in a custom container (outside the map)
    controls.mousePositionCustom = function (id) {
        return new ol.control.MousePosition({
            coordinateFormat: function (coord) {
                var template = '<strong>Longitude:</strong> {x}°'
                + ' <strong>Latitude:</strong> {y}°';
                return ol.coordinate.format(coord, template, 4);
            },
            projection: 'EPSG:4326',
            className: 'custom-mouse-position',
            target: document.getElementById(id || 'mouse-position'),
            undefinedHTML: '<strong>Longitude:</strong> -'
            + ' <strong>Latitude:</strong> -'
        });
    };

    controls.overviewMap = function () {
        return new ol.control.OverviewMap({
            // see in overviewmap-custom.html to see the custom CSS used
            //className: 'ol-overviewmap ol-custom-overviewmap',
            //layers: [
            //    mapLayersModule.baselayers
            //],
            collapseLabel: '\u00AB',
            label: '\u00BB',
            collapsed: true
            //tipLabel: $.t('buttons:olOverviewmap.label')
        });
    };

    controls.rotate = function () {
        return new ol.control.Rotate({
            label: '⧫'
            //className: 'glyphicon glyphicon-arrow-up'
            //tipLabel: $.t('buttons:olFullScreen.label')
        });
    };

    controls.rotateGlyphicon = function () {
        var label = document.createElement('span');
        label.className  = 'glyphicon glyphicon-arrow-up';
        return new ol.control.Rotate({
            label: label
        });
    };

    controls.scaleLine = function () {
        return new ol.control.ScaleLine({
            //tipLabel: $.t('buttons:olScaleLine.label')
            zIndex: 2
        });
    };

    controls.zoom = function () {
        return new ol.control.Zoom({
            //zoomInLabel: '',
            //zoomOutLabel: '',
            //zoomInTipLabel: '';
            //zoomOutTipLabel: ''
        });
    };

    controls.zoomSlider = function () {
        return new ol.control.ZoomSlider({

        });
    };

    controls.zoomToExtent = function () {
        //var projection = ol.proj.get('EPSG:4326'); // EPSG:3857 EPSG:4326
        //var extent = projection.getExtent();
        //var label = document.createElement('span');
        //label.innerHtml('<svg xmlns="http://www.w3.org/2000/svg" style="width:1em;height:1em" viewBox="0 0 24 24"><path fill="#000" d="M12,16L19.36,10.27L21,9L12,2L3,9L4.63,10.27M12,18.54L4.62,12.81L3,14.07L12,21.07L21,14.07L19.37,12.8L12,18.54Z" /></svg>');
        //label = label.childNodes;
        //label.className  = 'glyphicon glyphicon-globe';
        return new ol.control.ZoomToExtent({
            //extent: extent //ol.proj.transformExtent([-180, -90, 180, 90], 'EPSG:4326', 'EPSG:3857')
            label: '⊘',
            //label: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" style="width:1em;height:1em" viewBox="0 0 24 24"><path fill="#000" d="M12,16L19.36,10.27L21,9L12,2L3,9L4.63,10.27M12,18.54L4.62,12.81L3,14.07L12,21.07L21,14.07L19.37,12.8L12,18.54Z" /></svg>',
            //label: document.createElement('span').className  = 'glyphicon glyphicon-globe',
            //label: label,
            tipLabel: 'Reset zoom'
        });
    };



    /* Plugins -------------------------------------------------------------- */

    controls.layerSwitcher = function () {
        if (typeof ol.control.LayerSwitcher !== 'undefined') {
            return new ol.control.LayerSwitcher({
                //vlassName: 'glyphicon glyphicon-menu-hamburger',
                //tipLabel: $.t('buttons:olLayerswitcher.label')
            });
        } else {
            return false;
        }
    };



    return controls;

})(openlayersHelpers || {}, window.jQuery, window, document);
