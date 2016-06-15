"use strict";var openlayersHelpers=function(){return{}}(),_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},openlayersInputHelpers=function(mod){var defaults={formSelector:"#layer_settings_form",formGroupSelector:".form-group"},settings=defaults,selectedLayer,olLayerTypes=["Base","Group","Heatmap","Image","Layer","Tile","Vector","VectorTile"],olSourceTypes=["BingMaps","CartoDB","Cluster","Image","ImageCanvas","ImageMapGuide","ImageStatic","ImageVector","ImageWMS","MapQuest","OSM","Raster","Source","Stamen","Tile","TileArcGISRest","TileDebug","TileImage","TileJSON","TileUTFGrid","TileWMS","Vector","VectorTile","WMTS","XYZ","Zoomify"],olFormatTypes=["GMLBase","JSONFeature","TextFeature","XML","XMLFeature","EsriJSON","Feature","GeoJSON","GML","GML2","GML3","GPX","IGC","KML","MVT","OSMXML","Polyline","TopoJSON","WFS","WKT","WMSCapabilities","WMSGetFeatureInfo","WMTSCapabilities"],olStyleTypes=["AtlasManager","Circle","Fill","Icon","Image","RegularShape","Stroke","Style","Text"],olSourceGetters={revision:"getRevision",state:"getState",urls:"getUrls",url:"getUrl"},olStyleTypeGetters={Fill:"getFill",Image:"getImage",Stroke:"getStroke",Text:"getText"},olStylePropertyGetters={color:"getColor",lineCap:"getLineCap",geometry:"getGeometry",geometryFunction:"getGeometryFunction",lineDash:"getLineDash",lineJoin:"getLineJoin",miterLimit:"getMiterLimit",width:"getWidth",zIndex:"getZIndex"},olStylePropertySetters={color:"setColor",lineCap:"setLineCap",geometry:"setGeometry",geometryFunction:"setGeometryFunction",lineDash:"setLineDash",lineJoin:"setLineJoin",miterLimit:"setMiterLimit",width:"setWidth",zIndex:"getZIndex"},validateLayerInputs=function(){var e,t,r,o,a;if(!$().parsley)return console.warn("Parsley is not defined"),!1;var n=$(settings.formSelector);n.parsley({excluded:"input[type=button], input[type=submit], input[type=reset], input[type=hidden], [disabled], :hidden"}).on("field:success",function(){e=this.$element,e.is("[data-ol-layer][data-ol-property]")&&(t=e.data("ol-property"),r=webappHelpers.getInputValue(e),t&&null!==r&&selectedLayer.set(t,r)),e.is('[data-ol-source][data-ol-property="urls"]')&&(r=webappHelpers.getInputValue(e),r=r.split("\n"),mod.updateSourceUrl(selectedLayer,r)),e.is('[data-ol-source="Vector"][data-ol-format="GPX"]')&&(r=webappHelpers.getInputValue(e),mod.loadFileFeatures(selectedLayer,r,{dataProjection:"EPSG:4326",featureProjection:"EPSG:3857"})),e.is("[data-ol-style][data-ol-property]")&&(t=e.data("ol-property"),r=webappHelpers.getInputValue(e),a=e.data("ol-style"),o=selectedLayer.getStyle(),olStyleTypeGetters[a]&&_typeof(o[olStyleTypeGetters[a]])&&(o=o[olStyleTypeGetters[a]](),olStylePropertySetters[t]&&_typeof(o[olStylePropertySetters[t]])&&o[olStylePropertySetters[t]](r)))}).on("form:submit",function(){return!1})},initLayerInputs=function(e){var t,r,o,a,n=$(settings.formSelector),l=n.find(settings.formGroupSelector);selectedLayer=e,l.hide();var s=webappHelpers.getInstancesOf(e,ol.layer,olLayerTypes);console.log("Layer types",s);var i=e.getKeys();console.log("Layer keys",i);var p=e.getProperties(e);if(console.log("Layer properties",p),"function"==typeof e.getSource)var c=e.getSource();if("function"==typeof e.getStyle)var y=e.getStyle();var u=s;if(u.push("*"),u.forEach(function(e){r=l.has('[data-ol-layer="'+e+'"]'),i.forEach(function(t){r.has('[data-ol-property="'+t+'"]').show().find("label small").html("("+e+")")})}),c){var m=webappHelpers.getInstancesOf(c,ol.source,olSourceTypes);console.log("Layer source types",m);var g=c.getKeys();console.log("Layer source keys",g);var f=c.getProperties(e);if(console.log("Layer source properties",f),"function"==typeof c.getFormat)var d=c.getFormat();var h={};if($.each(olSourceGetters,function(e,t){"function"==typeof c[t]&&(a=c[t](),a&&!f[e]&&(h[e]=a))}),console.log("Source extra properties",h),u=m,u.push("*"),u.forEach(function(e){r=l.has('[data-ol-source="'+e+'"]'),g.forEach(function(t){r.has('[data-ol-property="'+t+'"]').show().find("label small").html("("+e+")")}),$.each(h,function(t){r.has('[data-ol-property="'+t+'"]').show().find("label small").html("("+e+")")})}),d){var w=webappHelpers.getInstancesOf(d,ol.format,olFormatTypes);console.log("Layer format types",w),u=w,u.push("*"),u.forEach(function(e){r=l.has('[data-ol-format="'+e+'"]'),r.show().find("label small").html("("+e+")")}),r.has('[data-ol-format=""]').show()}}if(y){var b=webappHelpers.getInstancesOf(y,ol.style,olStyleTypes);console.log("Layer style types",b);var S={};$.each(olStyleTypeGetters,function(e,t){"function"==typeof y[t]&&(S[e]={},a=y[t](),a&&(b=webappHelpers.getInstancesOf(a,ol.style,olStyleTypes),b?(console.log("Child style "+e+" found",b),u=b,u.push("*"),u.forEach(function(t){r=l.has('[data-ol-style="'+t+'"]'),$.each(olStylePropertyGetters,function(o,n){"function"==typeof a[n]&&(a=a[n](),S[e][o]=a,r.has('[data-ol-property="'+o+'"]').show().find("label small").html("("+t+")"))})})):S[e]=a))}),console.log("Layer style properties",S)}if(p&&l.find(":input").filter("[data-ol-layer][data-ol-property]").each(function(){t=$(this),o=t.data("ol-property"),null!==p[o]&&(a=p[o],webappHelpers.setInputValue(t,a),console.log("Layer property "+o+" populated",a))}),f&&l.find(":input").filter("[data-ol-source][data-ol-property]").each(function(){t=$(this),o=t.data("ol-property"),null!==f[o]&&(a=f[o],webappHelpers.setInputValue(t,a),console.log("Source property "+o+" populated",a))}),h&&l.find(":input").filter("[data-ol-source][data-ol-property]").each(function(){t=$(this),o=t.data("ol-property"),null!==h[o]&&(a=h[o],webappHelpers.setInputValue(t,a),console.log("Source property "+o+" populated",a))}),w&&l.find(":input").filter('[data-ol-source="Vector"][data-ol-format="GPX"]').each(function(){console.log('Layer input "file" ready',a)}),S){var L;l.find(":input").filter("[data-ol-style][data-ol-property]").each(function(){t=$(this),L=t.data("ol-style"),o=t.data("ol-property"),L&&o&&S[L]&&null!==S[L][o]&&(a=S[L][o],console.log(L+" "+o+" ("+("undefined"==typeof a?"undefined":_typeof(a))+")",a),webappHelpers.setInputValue(t,a))})}validateLayerInputs()},initLayerInputsBootstrapModal=function initLayerInputsBootstrapModal(modalSelector){$(modalSelector).on("show.bs.modal",function(e){var $modal=$(this),layerName=$(e.relatedTarget).data("layer-name");if("undefined"!=typeof layerVarName&&(selectedLayer=eval(layerName+"Layer")),selectedLayer){initLayerInputs(settings.selectedLayer);var title=selectedLayer.get("title");$modal.find(".modal-title").html(title)}})};return $.extend(mod,{selectedLayer:selectedLayer,initLayerInputs:initLayerInputs})}(openlayersHelpers||{}),openlayersLayerHelpers=function(e){var t,r={debug:!1,properties:{visible:!1},basil:{}},o=r;"function"==typeof Basil&&(t=new window.Basil(o.basil));var a=function(e){return o.debug?void"change change:blur change:extent change:gradient change:layers change:maxResolution change:minResolution change:opacity change:preload change:radius change:source change:useInterimTilesOnError change:visible change:zIndex".split(" ").forEach(function(t){e.on(t,function(t){t.key?console.log("Layer "+t.key+" changed",e.get(t.key)):console.log(t.target.get("name")+" layer"+t.type,t)})}):(webappHelpers.hideLogs(),!1)},n=function(e){e.on("propertychange",function(){var r=e.get("name");if(r){var o=e.getProperties(),a="properties",n={visible:o.visible,zIndex:o.zIndex,opacity:o.opacity};t.set(a,n,{namespace:r}),console.log(r+" properties stored",n)}})},l=function(e){var r=e.get("name");if(r){var o="properties",a=t.get(o,{namespace:r});null!==a&&(e.setProperties(a),console.log(r+" "+o+" restored",a))}},s=function(e,t){if(!e)return!1;var r=e.getSource();"undefined"!=typeof r.setUrls&&($.isArray(t)?r.setUrls(t):(t=$.trim(t),r.setUrl(t)))},i=function(e,t,r){if(0===t.length)return!1;var o=e.getSource();o.clear();var a=webappHelpers.reader(t,function(t){var a=o.getFormat(),n=a.readFeatures(t,r);o.addFeatures(n),e.setVisible(!0)});return a},p=function u(e,t,r){if(e.get(t)===r)return e;if(e.getLayers){var o,a=e.getLayers().getArray();a.forEach(function(e){return o=u(e,t,r),o?o:void 0})}return null},c=function m(e,t){$.each(e,function(e,r){r.getLayers()?m(r,t):t(r)})},y=function(e,r){a(e),r=$.extend(!0,{},o.properties,r),e.setProperties(r);var s=e.get("name"),i=e.get("title");return s&&i&&e.set("title",i+' <a href="#layer_settings_modal" data-toggle="modal" data-layer-name="'+s+'"><span class="glyphicon glyphicon-cog"></span></a>'),t&&(l(e),n(e)),e};return $.extend(e,{initLayer:y,loadFileFeatures:i,findLayerBy:p,settings:o,treatLayers:c,updateSourceUrl:s})}(openlayersHelpers||{}),openlayersMapHelpers=function(e){var t,r={ol:{},basil:{},narrowWidth:300,flatHeight:200,centerOnPosition:!0,debug:!0},o=r,a=function(e){if(!t)return!1;var r=e.getView(),o={center:"getCenter",resolution:"getResolution",rotation:"getRotation"};$.each(o,function(e,o){r.on("change:"+e,function(r){t.set(e,this[o]()),console.log(e+" stored after view "+r.type,t.get(e))})})},n=function(e){if(!t)return!1;var r,o=!1,a=e.getView(),n={center:"setCenter",resolution:"setResolution",rotation:"setRotation"};return $.each(n,function(e,n){r=t.get(e),null!==r?("function"==typeof a[n]?a[n](r):a.set(e,r),console.log("View "+e+" restored",r),o=!0):console.log("View "+e+" was not stored")}),o},l=function(e){var t=e.getView();"change change:layerGroup change:size change:target change:view click dblclick moveend pointerdrag propertychange singleclick".split(" ").forEach(function(t){e.on(t,function(t){console.log("Map",t.type),t.key&&console.log("New "+t.key,e.get(t.key))})}),"change change:center change:resolution change:rotation propertychange".split(" ").forEach(function(e){t.on(e,function(e){console.log("View",e.type),e.key&&console.log("New "+e.key,t.get(e.key))})}),t.on("change:resolution",function(){console.log("New zoom",t.getZoom())})},s=function(e){var t=e.getLayers();$.each(t,function(e,t){t.getVisible()?console.log("Selected layer",t.get("name")):console.log("Unselected layer",t.get("name")),t.on("change:visible",function(){this.getVisible()&&console.log("Selected layer",this.get("name"))})})},i=function(e,t,r){var o=e.getView();o.setCenter(ol.proj.transform([t,r],"EPSG:4326","EPSG:3857")),console.log("Map centered at longitude: "+t+" latitude: "+r)},p=function(e){var t=e.getView(),r=new ol.Geolocation({projection:t.getProjection(),tracking:!0});r.once("change:position",function(){t.setCenter(r.getPosition())})},c=function(e,t){t=parseInt(t),t&&e.getView().setZoom(t)},y=function(e){var t=e.getView(),r=t.getExtent();t.fit(r,e.getSize())},u=function(e){var t=e.getView(),r=ol.extent.createEmpty();e.getLayers().forEach(function(e){ol.extent.extend(r,e.getSource().getExtent())}),t.fit(r,e.getSize())},m=function(e,t){var r=t.getSource().getExtent();e.getView().fit(r,e.getSize())},g=function(e,t,r,o){var a=t.getSource(),n=a.getFeatureById(r),l=n.getGeometry(),s=e.getSize(),i=e.getView();i.fit(l,s,$.extend({padding:[0,0,0,0],constrainResolution:!1},o))},f=function(e){e.updateSize();var t=$("#"+e.get("target")),r=t.find(".layer-switcher");r&&(t.toggleClass("inline-layer-switcher",t.height()>=200&&t.height()<500),t.toggleClass("no-layer-switcher",t.width()<300||t.height()<200)),r=t.find(".ol-zoomslider"),r&&t.toggleClass("no-zoomslider",t.height()<300)},d=function(e,s){o=$.extend(!0,{},r,s),window.onresize=function(){f(e)},f(e),"undefined"!=typeof window.Basil?(t=new window.Basil($.extend({},o.basil,{namespace:e.get("target")})),n(e)||o.centerOnPosition&&(p(e),e.getView().setZoom(12)),a(e)):(o.centerOnPosition&&(p(e),e.getView().setZoom(12)),console.warn("Basil is not defined")),o.debug&&l(e)};return $.extend(e,{initMap:d,fitLayerGeometry:g,fitLayers:u,fitVectorLayer:m,fitView:y,getSelectedBaseLayer:s,restoreMapProperties:n,setCenter:i,setCenterOnPosition:p,settings:o,setZoom:c,storeMapChanges:a,updateSize:f})}(openlayersHelpers||{}),openlayersPredefinedControls=function(e){var t={};t.attribution=function(){return new ol.control.Attribution({collapsible:!0})},t.zoomSlider=function(){return new ol.control.ZoomSlider({})},t.zoomToExtent=function(){return new ol.control.ZoomToExtent({})},t.scaleLine=function(){return new ol.control.ScaleLine({})},t.fullScreen=function(){return new ol.control.FullScreen({})},t.overviewMap=function(){return new ol.control.OverviewMap({className:"ol-overviewmap ol-custom-overviewmap",collapseLabel:"«",label:"»",collapsed:!0})},t.mousePosition=function(){return new ol.control.MousePosition({coordinateFormat:ol.coordinate.createStringXY(4),projection:"EPSG:4326",className:"custom-mouse-position",target:document.getElementById("mouse-position"),undefinedHTML:"&nbsp;"})},t.layerSwitcher=function(){return new ol.control.LayerSwitcher({})};var r=function(e){if("function"!=typeof t[e])return console.warn(e+" control definition is not defined"),!1;var r=t[e]();return r};return $.extend(e,{controls:t,getPredefinedControl:r})}(openlayersHelpers||{}),openlayersPredefinedLayers=function(e){var t={bingMapsKey:"Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3",dataPath:"data/"},r="https:"===window.location.protocol?"https:":"http:",o={},a=function(){console.warm("ImageData function in development")},n=function(e,t){var r,o,n,l,s,i,p,c,y,u,m,g,f,d,h,w=e[0],b=w.width,S=w.height,L=w.data,T=new Uint8ClampedArray(L.length),v=2*t.resolution,M=b-1,H=S-1,x=[0,0,0,0],I=2*Math.PI,O=Math.PI/2,z=Math.PI*t.sunEl/180,A=Math.PI*t.sunAz/180,C=Math.cos(z),P=Math.sin(z);for(o=0;H>=o;++o)for(s=0===o?0:o-1,i=o===H?H:o+1,r=0;M>=r;++r)n=0===r?0:r-1,l=r===M?M:r+1,p=4*(o*b+n),x[0]=L[p],x[1]=L[p+1],x[2]=L[p+2],x[3]=L[p+3],c=t.vert*(x[0]+2*x[1]+3*x[2]),p=4*(o*b+l),x[0]=L[p],x[1]=L[p+1],x[2]=L[p+2],x[3]=L[p+3],y=t.vert*(x[0]+2*x[1]+3*x[2]),u=(y-c)/v,p=4*(s*b+r),x[0]=L[p],x[1]=L[p+1],x[2]=L[p+2],x[3]=L[p+3],c=t.vert*(x[0]+2*x[1]+3*x[2]),p=4*(i*b+r),x[0]=L[p],x[1]=L[p+1],x[2]=L[p+2],x[3]=L[p+3],y=t.vert*(x[0]+2*x[1]+3*x[2]),m=(y-c)/v,g=Math.atan(Math.sqrt(u*u+m*m)),f=Math.atan2(m,-u),f=0>f?O-f:f>O?I-f+O:O-f,d=P*Math.cos(g)+C*Math.sin(g)*Math.cos(A-f),p=4*(o*b+r),h=255*d,T[p]=h,T[p+1]=h,T[p+2]=h,T[p+3]=L[p+3];return new a(T,b,S)},l=function(e){var t=0,r=e.get("name"),o=r.match(/([\-+]\d{2}):(\d{2})$/);if(o){var a=parseInt(o[1],10),n=parseInt(o[2],10);t=60*a+n}var l=new Date,s=new Date(l.getTime()+6e4*(l.getTimezoneOffset()+t)),i=Math.abs(12-s.getHours()+s.getMinutes()/60);i>12&&(i=24-i);var p=.75*(1-i/12);return[new ol.style.Style({fill:new ol.style.Fill({color:[85,85,85,p]}),stroke:new ol.style.Stroke({color:"#ffffff"})})]};o.openStreetMap=function(){return new ol.layer.Tile({name:"openStreetMap",title:'Road Map<small> (by <a href="https://www.openstreetmap.org">OpenStreetMap</a>)</small>',visible:!0,type:"base",source:new ol.source.OSM({urls:[r+"//a.tile.openstreetmap.org/{z}/{x}/{y}.png"]})})},o.openSeaMap=function(){return new ol.layer.Tile({name:"openSeaMap",title:'Shipping lanes<small> (by <a href="http://www.openseamap.org">OpenSeaMap</a>)</small>',type:"base",source:new ol.source.OSM({attributions:[new ol.Attribution({html:'All maps &copy; <a href="http://www.openseamap.org/">OpenSeaMap</a>'}),ol.source.OSM.ATTRIBUTION],crossOrigin:null,urls:["http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png","http://t1.openseamap.org/seamark/{z}/{x}/{y}.png"]})})},o.openStreetMapHumanitarian=function(){return new ol.layer.Tile({name:"openStreetMapHumanitarian",title:'Humanitarian <small>(by <a href="https://www.openstreetmap.org">OpenStreetMap</a>)</small>',type:"base",source:new ol.source.OSM({attributions:[new ol.Attribution({html:'All maps &copy; <a href="http://www.openstreetmap.fr/">OpenStreetMap</a>'}),ol.source.OSM.ATTRIBUTION],url:r+"//tile-{a-c}.openstreetmap.fr/hot/{z}/{x}/{y}.png"})})},o.mapquestOSM=function(){return new ol.layer.Tile({name:"mapquestOSM",title:'Road map<small> (by <a href="http://open.mapquest.com">MapQuest</a>)</small>',type:"base",source:new ol.source.MapQuest({layer:"osm"})})},o.mapquestSat=function(){return new ol.layer.Tile({name:"mapquestSat",title:'Aerial view<small> (by <a href="http://open.mapquest.com">MapQuest</a>)</small>',type:"base",source:new ol.source.MapQuest({layer:"sat"})})},o.openCycleMap=function(){return new ol.layer.Tile({name:"openCycleMap",title:'Cycling roads<small> (by <a href="http://www.opencyclemap.org">OpenCycleMap</a>)</small>',type:"base",source:new ol.source.OSM({attributions:[new ol.Attribution({html:'All maps &copy; <a href="http://www.opencyclemap.org/">OpenCycleMap</a>'}),ol.source.OSM.ATTRIBUTION],url:"http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"})})},o.thunderforestTransport=function(){return new ol.layer.Tile({name:"thunderforestTransport",title:'Transports<small> (by <a href="http://www.thunderforest.com">ThunderForest</a>)</small>',type:"base",source:new ol.source.OSM({attributions:[new ol.Attribution({html:'All maps &copy; <a href="http://www.thunderforest.com/">ThunderForest</a>'}),ol.source.OSM.ATTRIBUTION],url:"http://{a-c}.tile.thunderforest.com/transport/{z}/{x}/{y}.png"})})},o.thunderforestTransportDark=function(){return new ol.layer.Tile({name:"thunderforestTransportDark",title:'Transport dark<small> (by <a href="http://www.thunderforest.com">ThunderForest</a>)</small>',type:"base",source:new ol.source.OSM({attributions:[new ol.Attribution({html:'All maps &copy; <a href="http://www.thunderforest.com/">ThunderForest</a>'}),ol.source.OSM.ATTRIBUTION],url:"https://{a-c}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png"})})},o.thunderforestLandscape=function(){return new ol.layer.Tile({name:"thunderforestLandscape",title:'Landscape<small> (by <a href="http://www.thunderforest.com">ThunderForest</a>)</small>',type:"base",source:new ol.source.OSM({attributions:[new ol.Attribution({html:'All maps &copy; <a href="http://www.thunderforest.com/">ThunderForest</a>'}),ol.source.OSM.ATTRIBUTION],url:"https://{a-c}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png"})})},o.thunderforestOutdoor=function(){return new ol.layer.Tile({name:"thunderforestOutdoor",title:'Outdoor activities<small> (by <a href="http://www.thunderforest.com">ThunderForest</a>)</small>',type:"base",source:new ol.source.OSM({attributions:[new ol.Attribution({html:'All maps &copy; <a href="http://www.thunderforest.com/">ThunderForest</a>'}),ol.source.OSM.ATTRIBUTION],url:"https://{a-c}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png"})})},o.arcgis=function(){return new ol.layer.Tile({name:"arcgis",title:'Terrain<small> (by <a href="https://services.arcgisonline.com">ArcGIS</a>)</small>',type:"base",source:new ol.source.XYZ({crossOrigin:"anonymous",attributions:[new ol.Attribution({html:'Tiles &copy; <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>'})],url:r+"//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"})})},o.arcgisRestHighwayUSA=function(){return new ol.layer.Tile({name:"arcgisRestHighwayUSA",title:'Highway USA<small> (by <a href="https://services.arcgisonline.com">ArcGIS</a>)</small>',type:"base",extent:[-13884991,2870341,-7455066,6338219],source:new ol.source.TileArcGISRest({url:r+"//sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer"})})},o.googleMap=function(){return new ol.layer.Tile({name:"googleMap",title:'Road map<small> (by <a href="https://www.google.com/maps/">Google</a>)</small>',type:"base",source:new ol.source.XYZ({crossOrigin:"anonymous",url:r+"//mt1.google.com/vt/lyrs=m@285235804&hl=en&x={x}&y={y}&z={z}&s=1"})})},o.googleTerrain=function(){return new ol.layer.Tile({name:"googleTerrain",title:'Terrain + labels<small> (by <a href="https://www.google.com/maps/">Google</a>)</small>',type:"base",source:new ol.source.XYZ({crossOrigin:"anonymous",url:r+"//mts1.google.com/vt/lyrs=t@132,r@285000000&hl=en&src=app&x={x}&y={y}&z={z}&s=1"})})},o.googleSatellite=function(){return new ol.layer.Tile({name:"googleSatellite",title:'Aerial view<small> (by <a href="https://www.google.com/maps/">Google</a>)</small>',type:"base",source:new ol.source.XYZ({crossOrigin:"anonymous",url:r+"//www.google.se/maps/vt/pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m2!1e1!3i198!4e0"})})},o.bingRoad=function(){return new ol.layer.Tile({name:"bingRoad",title:'Road map<small> (by <a href="https://www.bing.com/maps/">Bing</a>)</small>',type:"base",maxZoom:19,source:new ol.source.BingMaps({key:t.bingMapsKey,imagerySet:"Road"})})},o.bingAerial=function(){return new ol.layer.Tile({name:"bingAerial",title:'Aerial view<small> (by <a href="https://www.bing.com/maps/">Bing</a>)</small>',type:"base",maxZoom:19,source:new ol.source.BingMaps({key:t.bingMapsKey,imagerySet:"Aerial"})})},o.bingAerialWithLabels=function(){return new ol.layer.Tile({name:"bingAerialWithLabels",title:'Aerial view with labels<small> (by <a href="https://www.bing.com/maps/">Bing</a>)</small>',type:"base",maxZoom:19,source:new ol.source.BingMaps({key:t.bingMapsKey,imagerySet:"AerialWithLabels"})})},o.bingCollinsBart=function(){return new ol.layer.Tile({name:"bingCollinsBart",title:'CollinsBart<small> (by <a href="https://www.bing.com/maps/">Bing</a>)</small>',type:"base",maxZoom:19,source:new ol.source.BingMaps({key:t.bingMapsKey,imagerySet:"collinsBart"})})},o.bingOrdnanceSurvey=function(){return new ol.layer.Tile({name:"bingOrdnanceSurvey",title:'OrdnanceSurvey<small> (by <a href="https://www.bing.com/maps/">Bing</a>)</small>',type:"base",maxZoom:19,source:new ol.source.BingMaps({key:t.bingMapsKey,imagerySet:"ordnanceSurvey"})})},o.stamenToner=function(){return new ol.layer.Tile({name:"stamenToner",title:'B&W map<small> (by <a href="http://maps.stamen.com">Stamen</a>)</small>',type:"base",source:new ol.source.Stamen({layer:"toner"})})},o.stamenTonerLite=function(){return new ol.layer.Tile({name:"stamenTonerLite",title:'Gray scale map<small> (by <a href="http://maps.stamen.com">Stamen</a>)</small>',type:"base",source:new ol.source.Stamen({layer:"toner-lite"})})},o.stamenTonerBackground=function(){return new ol.layer.Tile({name:"stamenTonerBackground",title:'B&W background<small> (by <a href="http://maps.stamen.com">Stamen</a>)</small>',type:"base",source:new ol.source.Stamen({layer:"toner-background"})})},o.stamenWatercolor=function(){return new ol.layer.Tile({name:"stamenWatercolor",title:'Watercolor map<small> (by <a href="http://maps.stamen.com">Stamen</a>)</small>',type:"base",source:new ol.source.Stamen({layer:"watercolor"})})},o.stamenTerrain=function(){return new ol.layer.Tile({name:"stamenTerrain",title:'Terrain USA<small> (by <a href="http://maps.stamen.com">Stamen</a>)</small>',type:"base",source:new ol.source.Stamen({layer:"terrain"})})},o.stamenTerrainWithLabels=function(){return new ol.layer.Tile({name:"stamenTerrainLabels",title:'Terrain + labels USA<small> (by <a href="http://maps.stamen.com">Stamen</a>)</small>',type:"base",source:new ol.source.Stamen({layer:"terrain-labels"})})},o.customBaseLayer=function(){return new ol.layer.Tile({name:"customBaseLayer",title:"Custom",type:"base",source:new ol.source.XYZ({urls:[]})})},o.mapsForFreeRelief=function(){return new ol.layer.Tile({name:"mapsForFreeRelief",title:'Relief<small> (by <a href="http://www.maps-for-free.com">maps-for-free.com</a>)</small>',type:"base",source:new ol.source.XYZ({maxZoom:12,urls:["http://www.maps-for-free.com/layer/relief/z{z}/row{y}/{z}_{x}-{y}.jpg"]})})},o.googleBike=function(){return new ol.layer.Tile({name:"googleBike",title:'Cycling roads<small> (by <a href="https://www.google.com/maps/">Google</a>)</small>',visible:!0,source:new ol.source.XYZ({crossOrigin:"anonymous",url:r+"//mts0.google.com/vt/lyrs=h@239000000,bike&hl=en&src=app&x={x}&y={y}&z={z}&s=1"})})},o.googleHybrid=function(){return new ol.layer.Tile({name:"googleHybrid",title:'Roads + labels<small> (by <a href="https://www.google.com/maps/">Google</a>)</small>',visible:!0,source:new ol.source.XYZ({crossOrigin:"anonymous",url:r+"//mt1.google.com/vt/lyrs=h@239000000&hl=en&x={x}&y={y}&z={z}&s=1"})})},o.mapquestHyb=function(){return new ol.layer.Tile({name:"mapquestHyb",title:'City names<small> (by <a href="http://open.mapquest.com">MapQuest</a>)</small>',source:new ol.source.MapQuest({layer:"hyb"})})},o.lonviaCycling=function(){return new ol.layer.Tile({name:"lonviaCycling",title:'Cycling roads<small> (by <a href="http://www.waymarkedtrails.org">Lonvia</a>)</small>',opacity:.6,source:new ol.source.OSM({attributions:[new ol.Attribution({html:'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> and contributors <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'}),ol.source.OSM.ATTRIBUTION],crossOrigin:null,url:"http://tile.lonvia.de/cycling/{z}/{x}/{y}.png"})})},o.lonviaHiking=function(){return new ol.layer.Tile({name:"lonviaHiking",title:'Hiking paths<small> (by <a href="http://www.waymarkedtrails.org">Lonvia</a>)</small>',opacity:.6,source:new ol.source.OSM({attributions:[new ol.Attribution({html:'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> and contributors <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'}),ol.source.OSM.ATTRIBUTION],crossOrigin:null,url:"http://tile.lonvia.de/hiking/{z}/{x}/{y}.png"})})},o.stamenTonerHybrid=function(){return new ol.layer.Tile({name:"stamenTonerHybrid",title:'B&W roads + labels<small> (by <a href="http://maps.stamen.com">Stamen</a>)</small>',source:new ol.source.Stamen({layer:"toner-hybrid"})})},o.stamenTonerLabels=function(){return new ol.layer.Tile({name:"stamenTonerLabels",title:'B&W labels<small> (by <a href="http://maps.stamen.com">Stamen</a>)</small>',source:new ol.source.Stamen({layer:"toner-labels"})})},o.stamenTonerLines=function(){return new ol.layer.Tile({name:"stamenTonerLines",title:'B&W roads<small> (by <a href="http://maps.stamen.com">Stamen</a>)</small>',source:new ol.source.Stamen({layer:"toner-lines"})})},o.mapsForFreeWater=function(){return new ol.layer.Tile({name:"mapsForFreeWater",title:'Water<small> (by <a href="http://www.maps-for-free.com">maps-for-free.com</a>)</small>',opacity:.7,source:new ol.source.XYZ({url:"http://www.maps-for-free.com/layer/water/z{z}/row{y}/{z}_{x}-{y}.gif"})})},o.mapsForFreeAdmin=function(){return new ol.layer.Tile({name:"mapsForFreeAdmin",title:'Admin<small> (by <a href="http://www.maps-for-free.com">maps-for-free.com</a>)</small>',opacity:.3,source:new ol.source.XYZ({url:"http://www.maps-for-free.com/layer/admin/z{z}/row{y}/{z}_{x}-{y}.gif"})})},o.uniHeidelbergAsterh=function(){return new ol.layer.Tile({name:"uniHeidelbergAsterh",title:'Hillshade<small> (by <a href="http://korona.geog.uni-heidelberg.de">uni-heidelberg.de</a>)</small>',source:new ol.source.XYZ({maxZoom:18,url:"http://korona.geog.uni-heidelberg.de/tiles/asterh/x={x}&y={y}&z={z}"})})},o.uniHeidelbergAdminb=function(){return new ol.layer.Tile({name:"uniHeidelbergAdminb",title:'Admin boundaries<small> (by <a href="http://korona.geog.uni-heidelberg.de">uni-heidelberg.de</a>)</small>',opacity:.8,source:new ol.source.XYZ({url:"http://korona.geog.uni-heidelberg.de/tiles/adminb/x={x}&y={y}&z={z}"})})},o.uniHeidelbergHybrid=function(){return new ol.layer.Tile({name:"uniHeidelbergHybrid",title:'Hibrid<small> (by <a href="http://korona.geog.uni-heidelberg.de">uni-heidelberg.de</a>)</small>',opacity:.8,source:new ol.source.XYZ({url:"http://korona.geog.uni-heidelberg.de/tiles/hybrid/x={x}&y={y}&z={z}"})})},o.mapboxShadedRelief=function(){return new ol.layer.Image({name:"mapboxShadedRelief",title:'Shaded relief<small> (by <a href="http://www.mapbox.com">Mapbox</a>)</small>',source:new ol.source.Raster({sources:[new ol.source.XYZ({url:"https://{a-d}.tiles.mapbox.com/v3/aj.sf-dem/{z}/{x}/{y}.png",crossOrigin:"anonymous"})],operationType:"image",operation:n}),opacity:.3})},o.timeZones=function(){return new ol.layer.Vector({name:"timeZones",title:"Time zones",style:l,minResolution:4891,source:new ol.source.Vector({extractStyles:!1,projection:"EPSG:3857",url:dataPath+"timezones.kml",format:new ol.format.KML})})},o.gpxFile=function(){return new ol.layer.Vector({name:"gpxFile",title:"GPS tracks",visible:!1,source:new ol.source.Vector({url:"",format:new ol.format.GPX}),style:new ol.style.Style({stroke:new ol.style.Stroke({color:"#33ff00",width:5})})})},o.drawingVector=function(){return new ol.layer.Tile({name:"drawing",title:"My drawings"})},o.customOverlay=function(){return new ol.layer.Tile({name:"customOverlay",title:"Custom",source:new ol.source.XYZ({urls:[]})})};var s=function(e,t){if("function"!=typeof o[e])return console.warn(e+" layer definition is not defined"),!1;var r=o[e]();return r};return $.extend(e,{layers:o,getPredefinedLayer:s})}(openlayersHelpers||{}),map1=function(){var map,target="map1",openCycleMapLayer=openlayersHelpers.getPredefinedLayer("openCycleMap"),openStreetMapLayer=openlayersHelpers.getPredefinedLayer("openStreetMap"),mapsForFreeReliefLayer=openlayersHelpers.getPredefinedLayer("mapsForFreeRelief"),customBaseLayerLayer=openlayersHelpers.getPredefinedLayer("customBaseLayer"),googleMapLayer=openlayersHelpers.getPredefinedLayer("googleMap"),googleTerrainLayer=openlayersHelpers.getPredefinedLayer("googleTerrain"),googleSatelliteLayer=openlayersHelpers.getPredefinedLayer("googleSatellite"),mapquestOSMLayer=openlayersHelpers.getPredefinedLayer("mapquestOSM"),mapquestSatLayer=openlayersHelpers.getPredefinedLayer("mapquestSat");openlayersHelpers.initLayer(openCycleMapLayer),openlayersHelpers.initLayer(openStreetMapLayer,{visible:!0}),openlayersHelpers.initLayer(mapsForFreeReliefLayer),openlayersHelpers.initLayer(customBaseLayerLayer),openlayersHelpers.initLayer(googleMapLayer),openlayersHelpers.initLayer(googleTerrainLayer),openlayersHelpers.initLayer(googleSatelliteLayer),openlayersHelpers.initLayer(mapquestOSMLayer),openlayersHelpers.initLayer(mapquestSatLayer);var gpxFileLayer=openlayersHelpers.getPredefinedLayer("gpxFile"),googleHybridLayer=openlayersHelpers.getPredefinedLayer("googleHybrid"),googleBikeLayer=openlayersHelpers.getPredefinedLayer("googleBike"),lonviaCyclingLayer=openlayersHelpers.getPredefinedLayer("lonviaCycling"),lonviaHikingLayer=openlayersHelpers.getPredefinedLayer("lonviaHiking"),mapquestHybLayer=openlayersHelpers.getPredefinedLayer("mapquestHyb"),uniHeidelbergAsterhLayer=openlayersHelpers.getPredefinedLayer("uniHeidelbergAsterh"),customOverlayLayer=openlayersHelpers.getPredefinedLayer("customOverlay");openlayersHelpers.initLayer(gpxFileLayer,{zIndex:8}),openlayersHelpers.initLayer(googleHybridLayer,{zIndex:7}),openlayersHelpers.initLayer(googleBikeLayer,{zIndex:6}),openlayersHelpers.initLayer(lonviaCyclingLayer,{zIndex:5}),openlayersHelpers.initLayer(lonviaHikingLayer,{zIndex:4}),openlayersHelpers.initLayer(mapquestHybLayer,{zIndex:3}),openlayersHelpers.initLayer(uniHeidelbergAsterhLayer,{zIndex:2}),openlayersHelpers.initLayer(customOverlayLayer,{zIndex:1});var attributionControl=openlayersHelpers.getPredefinedControl("attribution"),scaleLineControl=openlayersHelpers.getPredefinedControl("scaleLine"),fullScreenControl=openlayersHelpers.getPredefinedControl("fullScreen"),layerSwitcherControl=openlayersHelpers.getPredefinedControl("layerSwitcher"),zoomSliderControl=openlayersHelpers.getPredefinedControl("zoomSlider"),layers=[new ol.layer.Group({name:"baseLayers",title:"Base map",layers:[customBaseLayerLayer,mapquestSatLayer,openCycleMapLayer,mapquestOSMLayer,openStreetMapLayer]}),new ol.layer.Group({name:"overlays",title:"Overlays",layers:[customOverlayLayer,mapquestHybLayer,lonviaHikingLayer,lonviaCyclingLayer,gpxFileLayer]})],controls=ol.control.defaults({attribution:!1,attributionOptions:{collapsible:!1},zoomOptions:{}}).extend([attributionControl,scaleLineControl,fullScreenControl,zoomSliderControl,layerSwitcherControl]);return $(function(){map=new ol.Map({layers:layers,target:target,view:new ol.View({center:[0,0],zoom:4,minZoom:2,maxZoom:19}),controls:controls,logo:!1}),openlayersHelpers.initMap(map,{debug:!0}),$(".layer-switcher").on("click",'a[data-toggle="modal"]',function(e){
e.preventDefault(),$(this).trigger("click.bs.modal.data-api")}),$("#layer_settings_modal").on("show.bs.modal",function(e){var $modal=$(this),layerVarName=$(e.relatedTarget).data("layer-name")+"Layer";if("undefined"!=typeof layerVarName){var selectedLayer=eval(layerVarName);if(selectedLayer){openlayersHelpers.initLayerInputs(selectedLayer);var title=selectedLayer.get("title");$modal.find(".modal-title").html(title)}}}),$("#layer_settings_form").on("submit",function(e){e.preventDefault();var t=$("#layer_settings_modal");t.modal("hide")})}),{map:map}}();