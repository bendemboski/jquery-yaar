/*
 * jQuery YAAR: Yet Another Auto-Resizer for textareas - v1.0
 *
 * Written by Ben Demboski
 * https://github.com/bendemboski
 *
 * This is plugin is provided as-is with no copyright, licensing,
 * substitutions, exchanges or refunds. If you have a problem with
 * that, you can talk to my lawyer Mr. Lionel Hutz.
 */

//
// Script: jQuery YAAR: Yet Another Auto-Resizer for textareas
//
// Version: 1.0, last updated 5/14/2012
// Github: https://github.com/bendemboski/jquery-yaar
// Source: https://raw.github.com/bendemboski/jquery-yaar/master/jquery.yaar.js
// Minified: https://raw.github.com/bendemboski/jquery-yaar/master/jquery.yaar.min.js (1.7k)
//
// Dependencies:
//  Stricly speaking, YAAR does not have any dependencies other than jQuery
//  itself, however to function correctly it needs to know when the text in
//  the target textarea changes. The simplest way to achieve this is to include
//  jquery.textchange (http://www.zurb.com/playground/jquery-text-change-custom-event),
//  and YAAR will automatically receive the text change events. Any library
//  or custom application code that dispatches a 'textchange' event on the
//  textarea, or custom application code that refreshes YAAR (see API below)
//  when its contents change will do the job.
//
// jQuery versions - any
//
// Description:
//  This is a jQuery plugin to perform auto-sizing of textarea elements
//  as the user types, the goal being that the textarea is always tall
//  enough to display all of the text without scrolling. Unlike other
//  libraries that are all clever and predict how much space the text
//  is going to take up so they can keep the textarea sized correctly,
//  this plugin is entirely un-clever and cheats off of the browser's
//  homework.
//
//  The basic approach is to create an invisible absolutely positioned
//  div that mirrors all the relevant css attributes of the textarea,
//  including the width, populate it with the text in the textarea,
//  allow the browser to size the div itself, and the propagate the height
//  back to the textarea.
//
//  This sometimes requires management from the application code, because
//  if the textarea is styled such that changes to the DOM can change its
//  width without changing its contents, the plugin will need to be informed
//  by the application in order to update the height of the textarea.
//
//  Basic usage:
//   When a textarea is added to the DOM, this call will size it to the text
//   it contains, and monitor it for textchanges, automatically resizing it
//   when they occur:
//    $(textarea).yaar()
//
//   An options object can be passed the first time .yaar() is called on a
//   textarea. The following options are supported:
//    textPadding - a string that is used to pad the text in the textarea.
//                  The textarea will always be kept big enough to display
//                  the actual text it contains, plus this text appended to
//                  the end. This allows the textarea to grow by a line just
//                  before it needs to, rather than just after. The default
//                  is 'W'.
//    minLines    - the minimum number of lines that the textarea is allowed
//                  to be sized to. The default is 1.
//
//   When the DOM is modified in a way that changes the layout of the textarea
//   without changing its text contents, this same method will force the
//   textarea to resize to fit the contents:
//    $(textarea).yaar()
//
//   If for some reason you want to keep the textarea in the DOM, but stop
//   it from autosizing, this call will uninitialize everything:
//    $(textarea).yaar("destroy")
//
// Release History:
//  * 1.0 - initial release (5/14/2012)
//
(function($) {
    // CSS attributes that need to be copied from the textarea to to div
    // in order to ensure that the browser will lay out the text in the div
    // the same as it lays out the text in the textarea.
    var cssAttrs = [ 'font-family', 'font-size', 'font-weight', 'font-style',
                     'font-size-adjust', 'text-transform', 'text-decoration',
                     'letter-spacing', 'word-spacing', 'line-height',
                     'word-wrap', 'white-space' ];

    // Object definition, responsible for autosizing a single textarea
    var YAAR = function(textarea, options) {
        this.options = $.extend({}, options);
        this.textarea = textarea;
        var rows = textarea.attr("rows");
        if (rows) {
            rows = parseInt(rows, 10);
            if (rows >= 1) {
                this.options.minRows = rows;
            }
        }
        this.init();
    };

    $.extend(YAAR.prototype, {
        init: function() {
            this.sizer = $('<div/>');
            var sizer = this.sizer;
            var textarea = this.textarea;

            // Set some basic attributes on the textarea
            textarea.css("resize", "none");
            textarea.css("overflow", "visible");

            var sizer = this.sizer;
            sizer.css("position", "absolute");
            sizer.css("display", "inline-block");
            sizer.css("visibility", "hidden");
            sizer.css("display", "inline-block");
            $.each(cssAttrs, function(i, attr) {
                sizer.css(attr, textarea.css(attr));
            });

            // Determine line height
            $("body").append(sizer);
            sizer.text("a");
            this.lineHeight = sizer.height();
            sizer.text("");
            sizer.remove();

            var _this = this;
            textarea.on("textchange.yaar", function() { _this.setHeight() });
        },

        uninit: function() {
            this.textarea.off("textchange.yaar");
        },

        // Method to construct and populate the div and propagate
        // the computed height back to the textarea.
        setHeight: function() {
            $("body").append(this.sizer);
            this.sizer.css("width", this.textarea.width());
            this.sizer.text(this.textarea.val() + (this.options.textPadding || ""));
            var rows = Math.ceil(this.sizer.height() / this.lineHeight);
            if (rows < this.options.minRows) {
                rows = this.options.minRows;
            }
            this.textarea.attr("rows", rows);
            this.sizer.remove();
        }
    });

    // Plugin function. Can be invoked in two ways:
    // $(...).yaar(options)   initializes yaar on the set of elements using the
    //                        specified options to override $.fn.yaar.defaults
    //                        and performs an initial sizing, and for any
    //                        elements for which yaar is already initialized,
    //                        the options are ignored and the element is simply
    //                        re-sized.
    // $(...).yaar("destroy") uninitializes yaar for the set of elements
    $.fn.yaar = function(option) {
        return this.each(function() {
            var el = $(this);
            var yaar = el.data("yaar");
            if (option === 'destroy') {
                if (yaar) {
                    yaar.uninit();
                    el.data("yaar", null);
                }
                return;
            }
            if (!yaar) {
                option = option || {};
                var options = $.extend({}, $.fn.yaar.defaults, option);
                yaar = new YAAR(el, options);
                el.data("yaar", yaar);
            }
            yaar.setHeight();
        });
    };

    // Default options for the plugin
    $.fn.yaar.defaults = {
        // Extra text appended to the div text to ensure that the textarea
        // increases in height just before a new line is needed, rather than
        // just after.
        textPadding: "W",
        // The minimum number of rows that the textarea is allowed to be
        // sized to. If the rows attribute is set on the textarea, it will
        // override this.
        minRows: 1
    };
})(jQuery);
