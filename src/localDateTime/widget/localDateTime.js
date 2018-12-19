define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",

    "dojo/text!localDateTime/widget/template/localDateTime.html"

], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, widgetTemplate) {
    "use strict";

    return declare("localDateTime.widget.localDateTime", [ _WidgetBase, _TemplatedMixin ], {
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        // DOM elements
        textNode: null,

        // Modeler parameters
        dayFormat: null,       // The representation of the day. Possible values are "numeric", "2-digit".
        monthFormat: null,     // The representation of the month. Possible values are "numeric", "2-digit", "narrow", "short", "long".
        yearFormat: null,      // The representation of the year. Possible values are "numeric", "2-digit".
        hourFormat: null,      // The representation of the hour. Possible values are "numeric", "2-digit".
        minuteFormat: null,    // The representation of the minute. Possible values are "numeric", "2-digit".
        secondFormat: null,    // The representation of the second. Possible values are "numeric", "2-digit".
        separator: null,       // The character to use to separate the date from the time.
        dateDelimiter: null,   // The character to use to separate the date parts.
        timeDelimiter: null,   // The character to use to separate the time parts.
        offsetAttribute: null, // The offset in seconds.
        dateParts: null,       // Whether to include the date, the time or both.

        // Internal variables.
        _handles: null,
        _contextObj: null,
        _intervalId: null,

        constructor: function () {
            this._handles = [];
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");


        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;

            var textNode = this.textNode;

            var offset = this._contextObj.get( this.offsetAttribute ).valueOf();

            function unescapeTwoDash( strEscaped ) { return strEscaped.replace(/^_/g, "").replace(/_/g, "-"); }

            var dayFormat = unescapeTwoDash( this.dayFormat );
            var monthFormat = unescapeTwoDash( this.monthFormat );
            var yearFormat = unescapeTwoDash( this.yearFormat );
            var hourFormat = unescapeTwoDash( this.hourFormat );
            var minuteFormat = unescapeTwoDash( this.minuteFormat );
            var secondFormat = unescapeTwoDash( this.secondFormat );
            var separator = this.separator;
            var dateDelimiter = this.dateDelimiter;
            var timeDelimiter = this.timeDelimiter;
            var dateParts = this.dateParts;
            
            if( this._intervalId !== null ) clearInterval( this._intervalId );

            this._intervalId =  setInterval( function() { 
                var dt = new Date(); 
                dt.setSeconds( parseInt( dt.getSeconds() ) + parseInt( offset ) ); 
                if( dateParts == 'both' ) {
                    textNode.textContent = dt.toLocaleDateString( 'en-GB', { day: dayFormat, month: monthFormat, year: yearFormat } ).split( ' ' ).join( dateDelimiter ) 
                        + separator + dt.toLocaleTimeString( 'en-GB', { hour: hourFormat, minute: minuteFormat, second: secondFormat } ).split( ':' ).join( timeDelimiter );
                } else if( dateParts == 'date' ) {
                    textNode.textContent = dt.toLocaleDateString( 'en-GB', { day: dayFormat, month: monthFormat, year: yearFormat } ).split( ' ' ).join( dateDelimiter );
                } else {
                    textNode.textContent = dt.toLocaleTimeString( 'en-GB', { hour: hourFormat, minute: minuteFormat, second: secondFormat } ).split( ':' ).join( timeDelimiter );
                }
            }, 1000 );            

            this._updateRendering(callback);
        },

        resize: function (box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            this._executeCallback(callback, "_updateRendering");
        },

        // Shorthand for running a microflow
        _execMf: function (mf, guid, cb) {
            logger.debug(this.id + "._execMf");
            if (mf && guid) {
                mx.ui.action(mf, {
                    params: {
                        applyto: "selection",
                        guids: [guid]
                    },
                    callback: lang.hitch(this, function (objs) {
                        if (cb && typeof cb === "function") {
                            cb(objs);
                        }
                    }),
                    error: function (error) {
                        console.debug(error.description);
                    }
                }, this);
            }
        },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function (cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["localDateTime/widget/localDateTime"]);
