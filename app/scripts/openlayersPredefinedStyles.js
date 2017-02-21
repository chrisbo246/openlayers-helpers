/*eslint-env browser, jquery */
/*global ol */
/**
* OL3 predefined styles
* @module
* @external $
* @external ol
* @return {Object} Public functions / variables
*/
/*eslint-disable no-unused-vars*/
var openlayersPredefinedStyles = (function (mod, $, window, document) {
    /*eslint-enable no-unused-vars*/
    'use strict';

    var settings = $.extend({

    }, window.openlayersPredefinedStylesSettings);


    /**
    * Timezones layer style
    * @see http://openlayers.org/en/v3.4.0/examples/kml-timezones.html
    * @public
    */
    var timezonesStyle = function (feature, resolution) { // feature, resolution
        var offset = 0;
        var name = feature.get('name'); // e.g. GMT -08:30
        var match = name.match(/([\-+]\d{2}):(\d{2})$/);
        if (match) {
            var hours = parseInt(match[1], 10);
            var minutes = parseInt(match[2], 10);
            offset = 60 * hours + minutes;
        }
        var date = new Date();
        var local = new Date(date.getTime() +
        (date.getTimezoneOffset() + offset) * 60000);
        // offset from local noon (in hours)
        var delta = Math.abs(12 - local.getHours() + (local.getMinutes() / 60));
        if (delta > 12) {
            delta = 24 - delta;
        }
        var opacity = 0.75 * (1 - delta / 12);
        return [new ol.style.Style({
            fill: new ol.style.Fill({
                color: [0x55, 0x55, 0x55, opacity]
                //color: [0xff, 0xff, 0x33, opacity]
            }),
            stroke: new ol.style.Stroke({
                color: '#ffffff'
            })
        })];
    };

    /**
    * Mapzen style
    * @see http://openlayers.org/en/v3.4.0/examples/kml-timezones.html
    * @public
    */
    var mapzenVectorStyle = function () {

        var fill = new ol.style.Fill({color: ''});
        var stroke = new ol.style.Stroke({color: '', width: 1});
        var polygon = new ol.style.Style({fill: fill});
        var line = new ol.style.Style({stroke: stroke});

        var styles = [];
        return function (feature, resolution) {
            //console.log('=============>>> feature', feature,resolution);
            var length = 0;
            var layer = feature.get('layer');
            var kind = feature.get('kind');
            var geom = feature.getGeometry().getType();
            //console.log(layer, kind, geom);

            //water
            if ((layer === 'water' && kind === 'water-layer')
            || (layer === 'water' && kind === 'river')
            || (layer === 'water' && kind === 'stream')
            || (layer === 'water' && kind === 'canal')) {
                stroke.setColor('#9DD9D2');
                stroke.setWidth(1.5);
                styles[length++] = line;
            } else if ((layer === 'water' && kind === 'riverbank')) {
                fill.setColor('#9DD9D2');
                stroke.setWidth(1.5);
                styles[length++] = polygon;
            } else if ((layer === 'water' && kind === 'water_boundary')
            || (layer === 'water' && kind === 'ocean_boundary')
            || (layer === 'water' && kind === 'riverbank_boundary')) {
                stroke.setColor('#93cbc4');
                stroke.setWidth(0.5);
                styles[length++] = line;
            } else if (layer === 'water' || layer === 'ocean'
            || layer === 'lake' ) {
                fill.setColor('#9DD9D2');
                styles[length++] = polygon;
            } else if (layer === 'aeroway' && geom === 'Polygon') {
                fill.setColor('#9DD9D2');
                styles[length++] = polygon;
            } else if (layer === 'aeroway' && geom === 'LineString' &&
            resolution <= 76.43702828517625) {
                stroke.setColor('#f0ede9');
                stroke.setWidth(1);
                styles[length++] = line;
            }

            //parks
            else if ((layer === 'landuse' && kind === 'park')
            || (layer === 'landuse' && kind === 'national_park')
            || (layer === 'landuse' && kind === 'nature_reserve')
            || (layer === 'landuse' && kind === 'wood')
            || (layer === 'landuse' && kind === 'protected_land')) {
                fill.setColor('#88D18A');
                styles[length++] = polygon;
            } else if (layer === 'landuse' && kind === 'hospital') {
                fill.setColor('#fde');
                styles[length++] = polygon;
            }
            else if (layer === 'landuse' && kind === 'school') {
                fill.setColor('#f0e8f8');
                styles[length++] = polygon;
            }

            //boundaries
            else if (layer === 'boundaries' && kind === 'country') {
                stroke.setColor('#aaaaaa');
                stroke.setWidth(1.5);
                styles[length++] = line;
            }
            else if (layer === 'boundaries' && (kind === 'region' || kind === 'macroregion')) {
                stroke.setColor('#bbbbbb');
                stroke.setWidth(0.5);
                styles[length++] = line;
            }

            //roads
            else if ((resolution > 3 && layer === 'road' && kind === 'highway')) {
                stroke.setColor('#FA4A48');
                stroke.setWidth(1.5);
                styles[length++] = line;
            }
            else if ((resolution > 3 && layer === 'road' && kind === 'major_road')) {
                stroke.setColor('#fb7b7a');
                stroke.setWidth(1);
                styles[length++] = line;
            }
            else if ((resolution > 3 && layer === 'road' && kind === 'minor_road')) {
                stroke.setColor('#999');
                stroke.setWidth(0.5);
                styles[length++] = line;
            }

            else if ((layer === 'transit' && kind === 'rail')) {
                stroke.setColor('#503D3F');
                stroke.setWidth(0.5);
                styles[length++] = line;
            }

            //building
            else if ((resolution < 3 && layer === 'buildings')) {
                stroke.setColor('#987284');
                stroke.setWidth(0.15);
                styles[length++] = line;
            }

            styles.length = length;
            return styles;
        };
    }

    /**
    * Mapzen building layer style
    * @see http://openlayers.org/en/v3.4.0/examples/kml-timezones.html
    * @public
    */
    var buildingStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: '#666',
            opacity: 0.4
        }),
        stroke: new ol.style.Stroke({
            color: '#444',
            width: 1
        })
    });



    return {
        timezonesStyle: timezonesStyle,
        mapzenVectorStyle: mapzenVectorStyle,
        buildingStyle: buildingStyle
    };

})(openlayersHelpers || {}, window.jQuery, window, document);
