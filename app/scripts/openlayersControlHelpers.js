/*eslint-env browser, jquery */
/*global ol */
/**
* OL3 controls helpers
* @module
* @external ol
* @return {Object} Public functions / variables
*/
/*eslint-disable no-unused-vars*/
var openlayersControlHelpers = (function (mod, $, window, document) {
    /*eslint-enable no-unused-vars*/
    'use strict';

    /**
    * Get some predefined controlss
    * @public
    * @param {Object} predefinedControls {name: options}
    * @return {Array} List of predefined controls
    */
    var getPredefinedControls = function (predefinedControls) {

        var controls = [];
        $.each(predefinedControls, function (name, properties) {
            controls.push(getPredefinedControl(name, properties));
        })

        return controls.filter(function (e) { return e });

    };



    /**
    * Create a new control using predefined settings
    * @public
    * @param {string} name - Predefined control
    * @return {Object} - OL3 control
    */
    var getPredefinedControl = function (name) {

        //if (!openlayersPredefinedControls || !openlayersPredefinedControls[name]) {
        if (typeof openlayersPredefinedControls[name] !== 'function') {
            console.warn(name + ' control definition is not defined');
            return false;
        }

        var control = openlayersPredefinedControls[name]();

        //var control = controls[name]();

        //control.setProperties(settings.properties);
        //if (properties) {
        //control.setProperties(properties);
        //}

        initControl(control);

        return control;

    };



    /**
    * Return a control from a map instance
    * @public
    * @param {Array} map OL map instance
    * @param {Object} staticClass OL control class name
    * @return {Object} - OL3 control
    */
    var getControlInstanceOf = function (map, className) {

        var control;
        var controls = map.getControls();

        controls.forEach(function (c) {
            if (c instanceof ol.control[className]) {
                control = c;
            }
        });

        return control;

    };


    /**
    * Execute a function for each control of the collection
    * @public
    * @param {Array} controls Control collection
    * @param {Array} controls Control collection
    */
    var initControls = function (map) {
        map.getControls().forEach(function (control, i) {
            initControl(control);
        });
    };



    /**
    * Initialize control
    * @public
    * @param {Object} control ol.control instance
    */
    var initControl = function (control) {
        console.log('Control properties before saved', control.getProperties());
        // Save the collapsible property value (for responsive purpose)
        if (typeof control.getCollapsible === 'function') {
            control.set('collapsibleDefault', control.get('collapsible'));
            console.log('Control propery saved', control.getProperties());
        }
    };






    return $.extend(mod, {
        getPredefinedControl: getPredefinedControl,
        getPredefinedControls: getPredefinedControls,
        getControlInstanceOf: getControlInstanceOf
    });

})(openlayersHelpers || {}, window.jQuery, window, document);
