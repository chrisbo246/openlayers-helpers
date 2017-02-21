/*eslint-env browser, jquery */
/*global ol */
/**
* OL3 predefined layers
* @module
* @external $
* @external ol
* @return {Object} Public functions / variables
*/
/*eslint-disable no-unused-vars*/
var openlayersPredefinedLayers = (function (mod, $, window, document) {
    /*eslint-enable no-unused-vars*/
    'use strict';

    var settings = $.extend({
        bingMapsKey: '', // https://msdn.microsoft.com/fr-fr/library/ff428642.aspx
        mapzenKey: '', // https://mapzen.com/developers',
        thunderforestKey: '', //http://thunderforest.com/pricing/
        mapquestKey: '', // https://developer.mapquest.com/plan_purchase/steps/business_edition/business_edition_free/register
        dataPath: 'data/'
    }, window.openlayersPredefinedLayersSettings);

    var protocol = (window.location.protocol === 'https:') ? 'https:' : 'http:';

    var layers = {};



    // Functions _______________________________________________________________

    /**
    *
    */
    var ImageData = function () {
        console.warm('ImageData function in development');
    };



    /**
    * Generates a shaded relief image given elevation data.  Uses a 3x3
    * neighborhood for determining slope and aspect.
    * @private
    * @param {Array.<ImageData>} inputs Array of input images.
    * @param {Object} data Data added in the "beforeoperations" event.
    * @return {ImageData} Output image.
    */
    var shade = function (inputs, data) {
        var elevationImage = inputs[0];
        var width = elevationImage.width;
        var height = elevationImage.height;
        var elevationData = elevationImage.data;
        var shadeData = new Uint8ClampedArray(elevationData.length);
        var dp = data.resolution * 2;
        var maxX = width - 1;
        var maxY = height - 1;
        var pixel = [0, 0, 0, 0];
        var twoPi = 2 * Math.PI;
        var halfPi = Math.PI / 2;
        var sunEl = Math.PI * data.sunEl / 180;
        var sunAz = Math.PI * data.sunAz / 180;
        var cosSunEl = Math.cos(sunEl);
        var sinSunEl = Math.sin(sunEl);
        var pixelX, pixelY, x0, x1, y0, y1, offset,
        z0, z1, dzdx, dzdy, slope, aspect, cosIncidence, scaled;
        for (pixelY = 0; pixelY <= maxY; ++pixelY) {
            y0 = pixelY === 0 ? 0 : pixelY - 1;
            y1 = pixelY === maxY ? maxY : pixelY + 1;
            for (pixelX = 0; pixelX <= maxX; ++pixelX) {
                x0 = pixelX === 0 ? 0 : pixelX - 1;
                x1 = pixelX === maxX ? maxX : pixelX + 1;
                // determine elevation for (x0, pixelY)
                offset = (pixelY * width + x0) * 4;
                pixel[0] = elevationData[offset];
                pixel[1] = elevationData[offset + 1];
                pixel[2] = elevationData[offset + 2];
                pixel[3] = elevationData[offset + 3];
                z0 = data.vert * (pixel[0] + pixel[1] * 2 + pixel[2] * 3);
                // determine elevation for (x1, pixelY)
                offset = (pixelY * width + x1) * 4;
                pixel[0] = elevationData[offset];
                pixel[1] = elevationData[offset + 1];
                pixel[2] = elevationData[offset + 2];
                pixel[3] = elevationData[offset + 3];
                z1 = data.vert * (pixel[0] + pixel[1] * 2 + pixel[2] * 3);
                dzdx = (z1 - z0) / dp;
                // determine elevation for (pixelX, y0)
                offset = (y0 * width + pixelX) * 4;
                pixel[0] = elevationData[offset];
                pixel[1] = elevationData[offset + 1];
                pixel[2] = elevationData[offset + 2];
                pixel[3] = elevationData[offset + 3];
                z0 = data.vert * (pixel[0] + pixel[1] * 2 + pixel[2] * 3);
                // determine elevation for (pixelX, y1)
                offset = (y1 * width + pixelX) * 4;
                pixel[0] = elevationData[offset];
                pixel[1] = elevationData[offset + 1];
                pixel[2] = elevationData[offset + 2];
                pixel[3] = elevationData[offset + 3];
                z1 = data.vert * (pixel[0] + pixel[1] * 2 + pixel[2] * 3);
                dzdy = (z1 - z0) / dp;
                slope = Math.atan(Math.sqrt(dzdx * dzdx + dzdy * dzdy));
                aspect = Math.atan2(dzdy, -dzdx);
                if (aspect < 0) {
                    aspect = halfPi - aspect;
                } else if (aspect > halfPi) {
                    aspect = twoPi - aspect + halfPi;
                } else {
                    aspect = halfPi - aspect;
                }
                cosIncidence = sinSunEl * Math.cos(slope) +
                cosSunEl * Math.sin(slope) * Math.cos(sunAz - aspect);
                offset = (pixelY * width + pixelX) * 4;
                scaled = 255 * cosIncidence;
                shadeData[offset] = scaled;
                shadeData[offset + 1] = scaled;
                shadeData[offset + 2] = scaled;
                shadeData[offset + 3] = elevationData[offset + 3];
            }
        }
        return new ImageData(shadeData, width, height);
    };




    // Base layers _____________________________________________________________

    layers.openStreetMap = function () {
        return new ol.layer.Tile({
            name: 'openStreetMap',
            title: 'Road Map (OpenStreetMap)',
            titleHtml: 'Road Map<small> (by <a href="https://www.openstreetmap.org">OpenStreetMap</a>)</small>', // (offline)
            visible: true,
            type: 'base',
            source: new ol.source.OSM({
                // crossOrigin: null,
                urls: [
                    protocol + '//a.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    //'../../Datas/Tiles/osm_mapnik/{z}/{x}/{y}.png'
                ]
            })
        });
    };

    layers.openSeaMap = function () {
        return new ol.layer.Tile({
            name: 'openSeaMap',
            title: 'Shipping lanes (OpenSeaMap)',
            titleHtml: 'Shipping lanes<small> (by <a href="http://www.openseamap.org">OpenSeaMap</a>)</small>',
            type: 'base',
            source: new ol.source.OSM({
                attributions: [
                    new ol.Attribution({
                        html: 'All maps &copy; ' +
                        '<a href="http://www.openseamap.org/">OpenSeaMap</a>'
                    }),
                    ol.source.OSM.ATTRIBUTION
                ],
                crossOrigin: null,
                urls: [
                    'http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
                    'http://t1.openseamap.org/seamark/{z}/{x}/{y}.png'
                ]
            })
        });
    };

    layers.openStreetMapHumanitarian = function () {
        return new ol.layer.Tile({
            name: 'openStreetMapHumanitarian',
            title: 'Humanitarian  (OpenStreetMap)',
            titleHtml: 'Humanitarian <small>(by <a href="https://www.openstreetmap.org">OpenStreetMap</a>)</small>',
            type: 'base',
            source: new ol.source.OSM({
                attributions: [
                    new ol.Attribution({
                        html: 'All maps &copy; ' +
                        '<a href="http://www.openstreetmap.fr/">OpenStreetMap</a>'
                    }),
                    ol.source.OSM.ATTRIBUTION
                ],
                url: protocol + '//tile-{a-c}.openstreetmap.fr/hot/{z}/{x}/{y}.png'
            })
        });
    }

    //layers.mapquestOSM = function () {
    //    return new ol.layer.Tile({
    //        name: 'mapquestOSM',
    //        title: 'Road map<small> (by <a href="http://open.mapquest.com">MapQuest</a>)</small>',
    //        type: 'base',
    //        source: new ol.source.MapQuest({
    //            layer: 'osm'
    //        })
    //    });
    //};

    //layers.mapquestSat = function () {
    //    return new ol.layer.Tile({
    //        name: 'mapquestSat',
    //        title: 'Aerial view<small> (by <a href="http://open.mapquest.com">MapQuest</a>)</small>',
    //        type: 'base',
    //        source: new ol.source.MapQuest({
    //            layer: 'sat'
    //        })
    //    });
    //};

    // http://thunderforest.com/maps/opencyclemap/
    layers.openCycleMap = function () {
        return new ol.layer.Tile({
            name: 'openCycleMap',
            title: 'Cycling roads (OpenCycleMap)',
            titleHtml: 'Cycling roads<small> (by <a href="http://www.opencyclemap.org">OpenCycleMap</a>)</small>',
            type: 'base',
            source: new ol.source.OSM({
                attributions: [
                    new ol.Attribution({
                        html: 'All maps &copy; ' +
                        '<a href="http://www.opencyclemap.org/">OpenCycleMap</a>'
                    }),
                    ol.source.OSM.ATTRIBUTION
                ],
                url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png?apikey=' + settings.thunderforestKey
            })
        });
    };

    // http://thunderforest.com/maps/transport/
    layers.thunderforestTransport = function () {
        return new ol.layer.Tile({
            name: 'thunderforestTransport',
            title: 'Transports (ThunderForest)',
            titleHtml: 'Transports<small> (by <a href="http://www.thunderforest.com">ThunderForest</a>)</small>',
            type: 'base',
            source: new ol.source.OSM({
                attributions: [
                    new ol.Attribution({
                        html: 'All maps &copy; ' +
                        '<a href="http://www.thunderforest.com/">ThunderForest</a>'
                    }),
                    ol.source.OSM.ATTRIBUTION
                ],
                url: 'http://{a-c}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=' + settings.thunderforestKey
            })
        });
    };

    // http://thunderforest.com/maps/transport-dark/
    layers.thunderforestTransportDark = function () {
        return new ol.layer.Tile({
            name: 'thunderforestTransportDark',
            title: 'Transport dark (ThunderForest)',
            titleHtml: 'Transport dark<small> (by <a href="http://www.thunderforest.com">ThunderForest</a>)</small>',
            type: 'base',
            source: new ol.source.OSM({
                attributions: [
                    new ol.Attribution({
                        html: 'All maps &copy; ' +
                        '<a href="http://www.thunderforest.com/">ThunderForest</a>'
                    }),
                    ol.source.OSM.ATTRIBUTION
                ],
                url: 'https://{a-c}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=' + settings.thunderforestKey
            })
        });
    };

    // http://thunderforest.com/maps/landscape/
    layers.thunderforestLandscape = function () {
        return new ol.layer.Tile({
            name: 'thunderforestLandscape',
            title: 'Landscape (ThunderForest)',
            titleHtml: 'Landscape<small> (by <a href="http://www.thunderforest.com">ThunderForest</a>)</small>',
            type: 'base',
            source: new ol.source.OSM({
                attributions: [
                    new ol.Attribution({
                        html: 'All maps &copy; ' +
                        '<a href="http://www.thunderforest.com/">ThunderForest</a>'
                    }),
                    ol.source.OSM.ATTRIBUTION
                ],
                url: 'https://{a-c}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=' + settings.thunderforestKey
            })
        });
    };

    // http://thunderforest.com/maps/outdoors/
    layers.thunderforestOutdoor = function () {
        return new ol.layer.Tile({
            name: 'thunderforestOutdoor',
            title: 'Outdoor activities (ThunderForest)',
            titleHtml: 'Outdoor activities<small> (by <a href="http://www.thunderforest.com">ThunderForest</a>)</small>',
            type: 'base',
            source: new ol.source.OSM({
                attributions: [
                    new ol.Attribution({
                        html: 'All maps &copy; ' +
                        '<a href="http://www.thunderforest.com/">ThunderForest</a>'
                    }),
                    ol.source.OSM.ATTRIBUTION
                ],
                url: 'https://{a-c}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=' + settings.thunderforestKey
            })
        });
    };

    layers.arcgis = function () {
        return new ol.layer.Tile({
            name: 'arcgis',
            title: 'Terrain (ArcGIS)',
            titleHtml: 'Terrain<small> (by <a href="https://services.arcgisonline.com">ArcGIS</a>)</small>',
            type: 'base',
            source: new ol.source.XYZ({
                crossOrigin: 'anonymous', // Important
                attributions: [
                    new ol.Attribution({
                        html: 'Tiles &copy; <a href="https://services.arcgisonline.com/ArcGIS/' +
                        'rest/services/World_Topo_Map/MapServer">ArcGIS</a>'
                    })
                ],
                url: protocol + '//server.arcgisonline.com/ArcGIS/rest/services/' +
                'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
            })
        });
    };

    layers.arcgisRestHighwayUSA = function () {
        return new ol.layer.Tile({
            name: 'arcgisRestHighwayUSA',
            title: 'Highway USA (ArcGIS)',
            titleHtml: 'Highway USA<small> (by <a href="https://services.arcgisonline.com">ArcGIS</a>)</small>',
            type: 'base',
            extent: [-13884991, 2870341, -7455066, 6338219],
            source: new ol.source.TileArcGISRest({
                url: protocol + '//sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/' + 'ESRI_StateCityHighway_USA/MapServer'
            })
        });
    };

    layers.googleMap = function () {
        return new ol.layer.Tile({
            name: 'googleMap',
            title: 'Road map (Google)',
            titleHtml: 'Road map<small> (by <a href="https://www.google.com/maps/">Google</a>)</small>',
            type: 'base',
            source: new ol.source.XYZ({
                crossOrigin: 'anonymous', // Important
                url: protocol + '//mt1.google.com/vt/lyrs=m@285235804&hl=en&x={x}&y={y}&z={z}&s=1'
            })
        });
    };

    layers.googleTerrain = function () {
        return new ol.layer.Tile({
            name: 'googleTerrain',
            title: 'Terrain + labels (Google)',
            titleHtml: 'Terrain + labels<small> (by <a href="https://www.google.com/maps/">Google</a>)</small>',
            type: 'base',
            source: new ol.source.XYZ({
                crossOrigin: 'anonymous', // Important
                url: protocol + '//mts1.google.com/vt/lyrs=t@132,r@285000000&hl=en&src=app&x={x}&y={y}&z={z}&s=1'
                //url: protocol + '//mts0.google.com/maps//vt/lyrs=t@132,r@285000000&hl=en&src=app&x={x}&y={y}&z={z}&s=1'
            })
        });
    };

    layers.googleSatellite = function () {
        return new ol.layer.Tile({
            name: 'googleSatellite',
            title: 'Aerial view (Google)',
            titleHtml: 'Aerial view<small> (by <a href="https://www.google.com/maps/">Google</a>)</small>',
            type: 'base',
            source: new ol.source.XYZ({
                crossOrigin: 'anonymous', // Important
                //resolutions: [9784, 2446, 1223, 76.44, 9.55, 2.39],
                url: protocol + '//www.google.se/maps/vt/pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m2!1e1!3i198!4e0'
                //url: protocol + '//khms0.google.com/maps//kh/v=165&src=app&x={x}&y={y}&z={z}&s=1'
            })
        });
    };

    layers.bingRoad = function () {
        return new ol.layer.Tile({
            name: 'bingRoad',
            title: 'Road map (Bing)',
            titleHtml: 'Road map<small> (by <a href="https://www.bing.com/maps/">Bing</a>)</small>',
            type: 'base',
            maxZoom: 19,
            source: new ol.source.BingMaps({
                key: settings.bingMapsKey,
                imagerySet: 'Road'
            })
        });
    };

    layers.bingAerial = function () {
        return new ol.layer.Tile({
            name: 'bingAerial',
            title: 'Aerial view (Bing)',
            titleHtml: 'Aerial view<small> (by <a href="https://www.bing.com/maps/">Bing</a>)</small>',
            type: 'base',
            maxZoom: 19,
            source: new ol.source.BingMaps({
                key: settings.bingMapsKey,
                imagerySet: 'Aerial'
            })
        });
    };

    layers.bingAerialWithLabels = function () {
        return new ol.layer.Tile({
            name: 'bingAerialWithLabels',
            title: 'Aerial view with labels (Bing)',
            titleHtml: 'Aerial view with labels<small> (by <a href="https://www.bing.com/maps/">Bing</a>)</small>',
            type: 'base',
            maxZoom: 19,
            source: new ol.source.BingMaps({
                key: settings.bingMapsKey,
                imagerySet: 'AerialWithLabels'
            })
        });
    };

    layers.bingCollinsBart = function () {
        return new ol.layer.Tile({
            name: 'bingCollinsBart',
            title: 'CollinsBart (Bing)',
            titleHtml: 'CollinsBart<small> (by <a href="https://www.bing.com/maps/">Bing</a>)</small>',
            type: 'base',
            maxZoom: 19,
            source: new ol.source.BingMaps({
                key: settings.bingMapsKey,
                imagerySet: 'collinsBart'
            })
        });
    };

    layers.bingOrdnanceSurvey = function () {
        return new ol.layer.Tile({
            name: 'bingOrdnanceSurvey',
            title: 'OrdnanceSurvey (Bing)',
            titleHtml: 'OrdnanceSurvey<small> (by <a href="https://www.bing.com/maps/">Bing</a>)</small>',
            type: 'base',
            maxZoom: 19,
            source: new ol.source.BingMaps({
                key: settings.bingMapsKey,
                imagerySet: 'ordnanceSurvey'
            })
        });
    };

    // Stamen
    // http://maps.stamen.com/#watercolor/12/37.7706/-122.3782
    // toner toner-hybrid toner-labels toner-lines toner-background toner-lite
    layers.stamenToner = function () {
        return new ol.layer.Tile({
            name: 'stamenToner',
            title: 'B&W map (Stamen)',
            titleHtml: 'B&W map<small> (by <a href="http://maps.stamen.com">Stamen</a>)</small>',
            type: 'base',
            source: new ol.source.Stamen({
                attributions: [new ol.Attribution({
                    html: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
                })],
                layer: 'toner'
            })
        });
    };

    layers.stamenTonerLite = function () {
        return new ol.layer.Tile({
            name: 'stamenTonerLite',
            title: 'Gray scale map (Stamen)',
            titleHtml: 'Gray scale map<small> (by <a href="http://maps.stamen.com">Stamen</a>)</small>',
            type: 'base',
            source: new ol.source.Stamen({
                attributions: [new ol.Attribution({
                    html: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
                })],
                layer: 'toner-lite'
            })
        });
    };

    layers.stamenTonerBackground = function () {
        return new ol.layer.Tile({
            name: 'stamenTonerBackground',
            title: 'B&W background (Stamen)',
            titleHtml: 'B&W background<small> (by <a href="http://maps.stamen.com">Stamen</a>)</small>',
            type: 'base',
            source: new ol.source.Stamen({
                attributions: [new ol.Attribution({
                    html: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
                })],
                layer: 'toner-background'
            })
        });
    };

    layers.stamenWatercolor = function () {
        return new ol.layer.Tile({
            name: 'stamenWatercolor',
            title: 'Watercolor map (Stamen)',
            titleHtml: 'Watercolor map<small> (by <a href="http://maps.stamen.com">Stamen</a>)</small>',
            type: 'base',
            source: new ol.source.Stamen({
                attributions: [new ol.Attribution({
                    html: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
                })],
                layer: 'watercolor'
            })
        });
    };

    // terrain terrain-labels terrain-lines terrain-background
    layers.stamenTerrain = function () {
        return new ol.layer.Tile({
            name: 'stamenTerrain',
            title: 'Terrain + labels (Stamen)',
            titleHtml: 'Terrain + labels <small> (by <a href="http://maps.stamen.com">Stamen</a>)</small>',
            type: 'base',
            source: new ol.source.Stamen({
                attributions: [new ol.Attribution({
                    html: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
                })],
                layer: 'terrain'
            })
        });
    };

    layers.stamenTerrainBackground = function () {
        return new ol.layer.Tile({
            name: 'stamenTerrainBackground',
            title: 'Terrain (Stamen)',
            titleHtml: 'Terrain <small> (by <a href="http://maps.stamen.com">Stamen</a>)</small>',
            type: 'base',
            source: new ol.source.Stamen({
                attributions: [new ol.Attribution({
                    html: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
                })],
                layer: 'terrain-background'
            })
        });
    };

    layers.customBaseLayer = function () {
        return new ol.layer.Tile({
            name: 'customBaseLayer',
            title: 'Custom',
            type: 'base',
            source: new ol.source.XYZ({
                urls: []
            })
        });
    };

    layers.mapsForFreeRelief = function () {
        return new ol.layer.Tile({
            name: 'mapsForFreeRelief',
            title: 'Relief (maps-for-free.com)',
            titleHtml: 'Custom',
            type: 'base',
            source: new ol.source.XYZ({
                urls: []
            })
        });
    };

    layers.mapsForFreeRelief = function () {
        return new ol.layer.Tile({
            name: 'mapsForFreeRelief',
            title: 'Relief<small> (by <a href="http://www.maps-for-free.com">maps-for-free.com</a>)</small>',
            type: 'base',
            //maxResolution: 76.43702828517625, //Z11
            source: new ol.source.XYZ({
                maxZoom: 12,
                urls: [
                    'http://www.maps-for-free.com/layer/relief/z{z}/row{y}/{z}_{x}-{y}.jpg'
                ]
            })
        });
    };

    layers.mapzenVector = function () {
        return new ol.layer.VectorTile({
            name: 'mapzenVector',
            title: 'Vector map  (mapzen.com)',
            titleHtml: 'Vector map <small> (by <a href="http://www.mapzen.com">mapzen.com</a>)</small>',
            type: 'base',
            source: new ol.source.VectorTile({
                attributions: [new ol.Attribution({
                    html: '&copy; OpenStreetMap contributors, Who’s On First, Natural Earth, and openstreetmapdata.com'
                })],
                format: new ol.format.TopoJSON(),
                tileGrid: ol.tilegrid.createXYZ({maxZoom: 19}),
                url: 'https://tile.mapzen.com/mapzen/vector/v1/all/{z}/{x}/{y}.topojson?api_key=' + settings.mapzenKey
            }),
            style: openlayersPredefinedStyles.mapzenVectorStyle()
        })
    };

    layers.mapzenVectorBuildings = function () {
        return new ol.layer.VectorTile({
            name: 'mapzenVectorBuildings',
            title: 'Vector bildings (mapzen.com)',
            titleHtml: 'Vector bildings<small> (by <a href="http://www.mapzen.com">mapzen.com</a>)</small>',
            type: 'base',
            //maxResolution: 76.43702828517625, //Z11
            source: new ol.source.VectorTile({
                attributions: [new ol.Attribution({
                    html: '&copy; OpenStreetMap contributors, Who’s On First, Natural Earth, and openstreetmapdata.com'
                })],
                format: new ol.format.TopoJSON(),
                url: 'https://tile.mapzen.com/mapzen/vector/v1/buildings/{z}/{x}/{y}.topojson?api_key=' + settings.mapzenKey
            }),
            style: openlayersPredefinedStyles.mapzenVectorStyle()
            /*style: function(f, resolution) {
                return (resolution < 10) ? buildingStyle : null;
            }*/
        });
    };

    layers.mapzenVectorWater = function () {
        return new ol.layer.VectorTile({
            name: 'mapzenVectorWater',
            title: 'Vector water (mapzen.com)',
            titleHtml: 'Vector water<small> (by <a href="http://www.mapzen.com">mapzen.com</a>)</small>',
            type: 'base',
            source: new ol.source.VectorTile({
                attributions: [new ol.Attribution({
                    html: '&copy; OpenStreetMap contributors, Who’s On First, Natural Earth, and openstreetmapdata.com'
                })],
                format: new ol.format.TopoJSON(),
                tileGrid: ol.tilegrid.createXYZ({maxZoom: 19}),
                url: 'https://tile.mapzen.com/mapzen/vector/v1/water/{z}/{x}/{y}.topojson?api_key=' + settings.mapzenKey
            }),
            style: openlayersPredefinedStyles.mapzenVectorStyle()
            /*style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: '#9db9e8'
                })
            })*/
        })
    };

    layers.mapzenVectorPois = function () {
        return new ol.layer.VectorTile({
            name: 'mapzenVectorPois',
            title: 'Vector POIs (mapzen.com)',
            titleHtml: 'Vector POIs<small> (by <a href="http://www.mapzen.com">mapzen.com</a>)</small>',
            type: 'base',
            source: new ol.source.VectorTile({
                attributions: [new ol.Attribution({
                    html: '&copy; OpenStreetMap contributors, Who’s On First, Natural Earth, and openstreetmapdata.com'
                })],
                format: new ol.format.TopoJSON(),
                tileGrid: ol.tilegrid.createXYZ({maxZoom: 19}),
                url: 'https://tile.mapzen.com/mapzen/vector/v1/pois/{z}/{x}/{y}.topojson?api_key=' + settings.mapzenKey
            }),
            style: openlayersPredefinedStyles.mapzenVectorStyle()
            /*style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: '#9db9e8'
                })
            })*/
        })
    };

    // Mapzen Terrain
    // https://mapzen.com/documentation/terrain-tiles/use-service/
    layers.mapzenTerrain = function (variant) {
        //var variants = [normal, terrarium, geotiff, skadi];
        //if ($.inArray(variant, variants) === 1) {
        //    variant = variant[0];
        //}
        return new ol.layer.VectorTile({
            name: 'mapzenTerrain',
            title: 'Terrain  (mapzen.com)',
            titleHtml: 'Terrain <small> (by <a href="http://www.mapzen.com">mapzen.com</a>)</small>',
            type: 'base',
            source: new ol.source.XYZ({
                attributions: [new ol.Attribution({
                    html: '&copy; OpenStreetMap contributors, Who’s On First, Natural Earth, and openstreetmapdata.com'
                })],
                url: 'https://tile.mapzen.com/mapzen/terrain/v1/normal/{z}/{x}/{y}.png?api_key=' + settings.mapzenKey
            })
        })
    };

    layers.mapzenTerrainTerrarium = function (variant) {
        return new ol.layer.VectorTile({
            name: 'mapzenTerrainTerrarium',
            title: 'Terrarium  (mapzen.com)',
            titleHtml: 'Terrarium <small> (by <a href="http://www.mapzen.com">mapzen.com</a>)</small>',
            type: 'base',
            source: new ol.source.XYZ({
                attributions: [new ol.Attribution({
                    html: '&copy; OpenStreetMap contributors, Who’s On First, Natural Earth, and openstreetmapdata.com'
                })],
                url: 'https://tile.mapzen.com/mapzen/terrain/v1/terrarium/{z}/{x}/{y}.png?api_key=' + settings.mapzenKey
            })
        })
    };

    // Overlays ________________________________________________________________

    layers.googleBike = function () {
        return new ol.layer.Tile({
            name: 'googleBike',
            title: 'Cycling roads (Google)',
            titleHtml: 'Cycling roads<small> (by <a href="https://www.google.com/maps/">Google</a>)</small>',
            visible: true,
            source: new ol.source.XYZ({
                crossOrigin: 'anonymous',
                url: protocol + '//mts0.google.com/vt/lyrs=h@239000000,bike&hl=en&src=app&x={x}&y={y}&z={z}&s=1'
                //url: protocol + '//mts0.google.com/maps//vt/lyrs=h@239000000,bike&hl=en&src=app&x={x}&y={y}&z={z}&s=1'
            })
        });
    };

    layers.googleHybrid = function () {
        return new ol.layer.Tile({
            name: 'googleHybrid',
            title: 'Roads + labels (Google)',
            titleHtml: 'Roads + labels<small> (by <a href="https://www.google.com/maps/">Google</a>)</small>',
            zIndex: 99,
            visible: true,
            source: new ol.source.XYZ({
                crossOrigin: 'anonymous',
                url: protocol + '//mt1.google.com/vt/lyrs=h@239000000&hl=en&x={x}&y={y}&z={z}&s=1'
            })
        });
    };

    //layers.mapquestHyb = function () {
    //    return new ol.layer.Tile({
    //        name: 'mapquestHyb',
    //        title: 'City names<small> (by <a href="http://open.mapquest.com">MapQuest</a>)</small>',
    //        source: new ol.source.MapQuest({
    //            layer: 'hyb'
    //        })
    //    });
    //};

    layers.lonviaCycling = function () {
        return new ol.layer.Tile({
            name: 'lonviaCycling',
            title: 'Cycling roads (Lonvia)',
            titleHtml: 'Cycling roads<small> (by <a href="http://www.waymarkedtrails.org">Lonvia</a>)</small>',
            opacity: 0.6,
            source: new ol.source.OSM({
                attributions: [
                    new ol.Attribution({
                        html: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> and contributors <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
                    }),
                    ol.source.OSM.ATTRIBUTION
                ],
                crossOrigin: null,
                url: 'http://tile.lonvia.de/cycling/{z}/{x}/{y}.png'
                // urls: [
                //  'http://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png',
                //  'http://tile.lonvia.de/cycling/{z}/{x}/{y}.png',
                //  '../../Datas/Tiles/lonvia_cycling/{z}/{x}/{y}.png'
                // ]
            })
        });
    };

    layers.lonviaHiking = function () {
        return new ol.layer.Tile({
            name: 'lonviaHiking',
            title: 'Hiking paths (Lonvia)',
            titleHtml: 'Hiking paths<small> (by <a href="http://www.waymarkedtrails.org">Lonvia</a>)</small>',
            opacity: 0.6,
            source: new ol.source.OSM({
                attributions: [
                    new ol.Attribution({
                        html: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> and contributors <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
                    }),
                    ol.source.OSM.ATTRIBUTION
                ],
                crossOrigin: null,
                url: 'http://tile.lonvia.de/hiking/{z}/{x}/{y}.png'
            })
        });
    };

    layers.stamenTerrainLabels = function () {
        return new ol.layer.Tile({
            name: 'stamenTerrainLabels',
            title: 'Labels (Stamen)',
            titleHtml: 'Labels <small> (by <a href="http://maps.stamen.com">Stamen</a>)</small>',
            zIndex: 99,
            source: new ol.source.Stamen({
                attributions: [new ol.Attribution({
                    html: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
                })],
                layer: 'terrain-labels'
            })
        });
    };

    layers.stamenTerrainLines = function () {
        return new ol.layer.Tile({
            name: 'stamenTerrainLines',
            title: 'Roads (Stamen)',
            titleHtml: 'Roads <small> (by <a href="http://maps.stamen.com">Stamen</a>)</small>',
            source: new ol.source.Stamen({
                attributions: [new ol.Attribution({
                    html: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
                })],
                layer: 'terrain-lines'
            })
        });
    };

    layers.stamenTonerHybrid = function () {
        return new ol.layer.Tile({
            name: 'stamenTonerHybrid',
            title: 'B&W roads + labels (Stamen)',
            titleHtml: 'B&W roads + labels<small> (by <a href="http://maps.stamen.com">Stamen</a>)</small>',
            zIndex: 99,
            source: new ol.source.Stamen({
                attributions: [new ol.Attribution({
                    html: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
                })],
                layer: 'toner-hybrid'
            })
        });
    };

    layers.stamenTonerLabels = function () {
        return new ol.layer.Tile({
            name: 'stamenTonerLabels',
            title: 'B&W labels (Stamen)',
            titleHtml: 'B&W labels<small> (by <a href="http://maps.stamen.com">Stamen</a>)</small>',
            zIndex: 99,
            source: new ol.source.Stamen({
                attributions: [new ol.Attribution({
                    html: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
                })],
                layer: 'toner-labels'
            })
        });
    };

    layers.stamenTonerLines = function () {
        return new ol.layer.Tile({
            name: 'stamenTonerLines',
            title: 'B&W roads (Stamen)',
            titleHtml: 'B&W roads<small> (by <a href="http://maps.stamen.com">Stamen</a>)</small>',
            source: new ol.source.Stamen({
                attributions: [new ol.Attribution({
                    html: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
                })],
                layer: 'toner-lines'
            })
        });
    };

    // https://www.google.com/intl/fr-FR_US/help/terms_maps.html
    layers.mapsForFreeWater = function () {
        return new ol.layer.Tile({
            name: 'mapsForFreeWater',
            title: 'Water (maps-for-free.com)',
            titleHtml: 'Water<small> (by <a href="http://www.maps-for-free.com">maps-for-free.com</a>)</small>',
            opacity: 0.7,
            source: new ol.source.XYZ({
                url: 'http://www.maps-for-free.com/layer/water/z{z}/row{y}/{z}_{x}-{y}.gif'
            })
        });
    };

    layers.mapsForFreeAdmin = function () {
        return new ol.layer.Tile({
            name: 'mapsForFreeAdmin',
            title: 'Admin (maps-for-free.com)',
            titleHtml: 'Admin<small> (by <a href="http://www.maps-for-free.com">maps-for-free.com</a>)</small>',
            opacity: 0.3,
            source: new ol.source.XYZ({
                url: 'http://www.maps-for-free.com/layer/admin/z{z}/row{y}/{z}_{x}-{y}.gif'
            })
        });
    };

    // http://korona.geog.uni-heidelberg.de/contact.html
    layers.uniHeidelbergAsterh = function () {
        return new ol.layer.Tile({
            name: 'uniHeidelbergAsterh',
            title: 'Hillshade (uni-heidelberg.de)',
            titleHtml: 'Hillshade<small> (by <a href="http://korona.geog.uni-heidelberg.de">uni-heidelberg.de</a>)</small>',
            source: new ol.source.XYZ({
                maxZoom: 18,
                url: 'http://korona.geog.uni-heidelberg.de/tiles/asterh/x={x}&y={y}&z={z}'
            })
        });
    };

    layers.uniHeidelbergAdminb = function () {
        return new ol.layer.Tile({
            name: 'uniHeidelbergAdminb',
            title: 'Admin boundaries (uni-heidelberg.de)',
            titleHtml: 'Admin boundaries<small> (by <a href="http://korona.geog.uni-heidelberg.de">uni-heidelberg.de</a>)</small>',
            opacity: 0.8,
            source: new ol.source.XYZ({
                url: 'http://korona.geog.uni-heidelberg.de/tiles/adminb/x={x}&y={y}&z={z}'
            })
        });
    };

    layers.uniHeidelbergHybrid = function () {
        return new ol.layer.Tile({
            name: 'uniHeidelbergHybrid',
            title: 'Hibrid (uni-heidelberg.de)',
            titleHtml: 'Hibrid<small> (by <a href="http://korona.geog.uni-heidelberg.de">uni-heidelberg.de</a>)</small>',
            opacity: 0.8,
            source: new ol.source.XYZ({
                url: 'http://korona.geog.uni-heidelberg.de/tiles/hybrid/x={x}&y={y}&z={z}'
            })
        });
    };

    layers.mapboxShadedRelief = function () {
        return new ol.layer.Image({
            name: 'mapboxShadedRelief',
            title: 'Shaded relief (Mapbox)',
            titleHtml: 'Shaded relief<small> (by <a href="http://www.mapbox.com">Mapbox</a>)</small>',
            source: new ol.source.Raster({
                sources: [
                    new ol.source.XYZ({
                        url: 'https://{a-d}.tiles.mapbox.com/v3/aj.sf-dem/{z}/{x}/{y}.png',
                        crossOrigin: 'anonymous'
                    })
                ],
                operationType: 'image',
                operation: shade
            }),
            opacity: 0.3
        });
    };

    // See http://openlayers.org/en/v3.4.0/examples/kml-timezones.html
    layers.timeZones = function () {
        return new ol.layer.Vector({
            name: 'timeZones',
            title: 'Time zones',
            style: openlayersPredefinedStyles.timezonesStyle,
            minResolution: 4891,
            source: new ol.source.Vector({
                extractStyles: false,
                projection: 'EPSG:3857',
                url: dataPath + 'timezones.kml',
                format: new ol.format.KML()
            })
        });
    };

    layers.gpxFile = function () {
        return new ol.layer.Vector({
            name: 'gpxFile',
            title: 'GPS tracks',
            visible: false,
            source: new ol.source.Vector({
                url: '',
                format: new ol.format.GPX()
            }),
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#33ff00',
                    width: 5
                })
            })
        });
    };

    layers.drawingVector = function () {
        return new ol.layer.Tile({
            name: 'drawing',
            title: 'My drawings'
        });
    };

    layers.customOverlay = function () {
        return new ol.layer.Tile({
            name: 'customOverlay',
            title: 'Custom',
            source: new ol.source.XYZ({
                urls: []
            })
        });
    };



    //return $.extend(mod, {
    //    predefinedLayers: layers
    //});
    return layers;

})(openlayersHelpers || {}, window.jQuery, window, document);
