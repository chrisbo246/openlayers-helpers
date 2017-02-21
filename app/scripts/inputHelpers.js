/*eslint-env browser, jquery */
/*global ol */
/**
* OL3 input helpers
* @module
* @external $
* @external ol
* @return {Object} Public functions / variables
*/
/*eslint-disable no-unused-vars*/
var inputHelpers = (function (mod, $, window, document) {
    /*eslint-enable no-unused-vars*/
    'use strict';



    /**
    * Get input value according to type
    * @public
    * @param {Object} input - Input DOM
    * @return {string} Input type
    */
    var getInputType = function (input) {

        var inputType;

        var $input = $(input);
        if ($input) {
            inputType = $input.attr('type');
            if (!inputType || inputType === 'undefined') {
                inputType = $input.prop('tagName').toLowerCase();
            }
        }

        return inputType;

    };



    /**
    * Get input value according to type
    * @public
    * @param {Object} input - Input DOM
    * @return {String|number|boolean} Input value
    */
    var getInputValue = function (input) {

        var value;

        var $input = $(input);
        if ($input) {

            var inputType = getInputType($input);

            if ($.inArray(inputType, ['radio', 'checkbox']) !== -1) {
                value = $input.prop('checked');
                if (value && $input.attr('value')) {
                    value = $input.attr('value');
                }
            } else if (inputType === 'file') {
                value = $input.prop('files');
            } else if ($.inArray(inputType, ['text', 'password', 'select', 'textarea', 'hidden',
            'color', 'date', 'datetime', 'datetime-local', 'email', 'month', 'number', 'range',
            'search', 'tel', 'time', 'url', 'week']) !== -1) {
                value = $input.val();
            } else {
                // 'image' , 'button', 'reset', 'submit' , etc...
                value = $input.html();
            }

        }

        return value;

    };



    /**
    * Set input value according to type
    * @public
    * @param {Object} input - Input DOM
    * @param {String|number|boolean} [value] - Input value
    * @param {Object} attributes - Input sttributes key:value peer
    * @param {Boolean} [trigger] - If false, do not trigger change
    */
    var setInputValue = function (input, value, attributes, trigger) {

        var $input = $(input);
        if ($input) {

            var inputType = getInputType($input);

            // If value is an array, use the first element
            if ($.isArray(value) && inputType !== 'textarea') {
                value = value[0] || null;
            }

            if ($.inArray(inputType, ['radio', 'checkbox']) !== -1) {
                //if (value === true || value === false) {
                $input.prop('checked', value);
                //} else {
                //    $input.val(value);
                //    $input.prop('checked', (value !== null) ? true : false);
                //}
            } else if (inputType === 'file') {
                if ($.type(value) === 'FileList') {
                    $input.attr('files', value);
                }
            } else if (inputType === 'textarea') {
                if ($.isArray(value)) {
                    value = value.join('\n');
                }
                $input.val(value);
            } else if ($.inArray(inputType, ['text', 'password', 'select', 'hidden',
            'color', 'date', 'datetime', 'datetime-local', 'email', 'month', 'number', 'range',
            'search', 'tel', 'time', 'url', 'week']) !== -1) {
                $input.val(value);
            } else {
                $input.html(value);
            }

            if (attributes) {
                $input.attr(attributes);
            }

            if (trigger !== false) {
                $input.trigger('change');
            }

        }

    };



    /**
    * Load data from input type="file"
    * @public
    * @param {Object} files - File list returned by the input
    * @param {Function} callback - Function to apply to each file
    * @param {Object} [options] - File type definition
    * @return {Object} Deferred
    */
    var reader = function (files, callback, options) {

        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
            return false;
        }

        var dfd = new $.Deferred();
        var n = 0;

        if (spinner) {
            spinner.addJob(dfd);
        }

        options = $.extend(true, {}, {
            format: 'text',
            encoding: 'UTF-8',
            cancelSelector: null
        }, options);

        $.each(files, function (i, f) {
            var fileReader = new FileReader();

            if (options.format === 'buffer') {
                fileReader.readAsArrayBuffer(f, options.encoding);
            } else if (options.format === 'binary') {
                fileReader.readAsBinaryString(f, options.encoding);
            } else if (options.format === 'data') {
                fileReader.readAsDataURL(f, options.encoding);
            } else {
                fileReader.readAsText(f, options.encoding);
            }

            //fileReader.error
            //fileReader.readyState
            //fileReader.result

            fileReader.onload = function (e) {
                console.log('File load', e);
                callback(e.target.result);
            };
            fileReader.onloadstart = function () {

            };
            fileReader.onloadend = function () {
                console.log((i + 1) + '/' + files.length + ' file loaded');
                n = n + 1;
                if (n === files.length) {
                    console.log('Last file loaded');
                    dfd.resolve();
                }
            };
            fileReader.onerror = function () {
                swal({title: 'Oups!', text: 'An error occured while trying to read your file.', type: 'warning'});
            };

            if (options.cancelSelector) {
                $(options.cancelSelector).on('click', function () {
                    fileReader.abort();
                });
            }

        });

        return dfd;

    };



    return $.extend(mod, {
        getInputValue: getInputValue,
        setInputValue: setInputValue,
        reader: reader
    });

})(openlayersHelpers || {}, window.jQuery, window, document);
