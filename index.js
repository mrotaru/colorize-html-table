(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {

  /*
   * Colorize columns in a table
   * 
   * @param {JQuery} table
   * @param {Integer|Array} column which column(s) should be colorized
   */
  $.fn.colorizeTable = function (options) {

    var settings = $.extend({
      table: null,
      columns: [1],
      invert: false,
      relativeScale: true,
      min: null,
      max: null
    }, options);

    // validate
    if(settings.min !== null && settings.max !== null) {
      settings.relativeScale = false;
    } else {
      settings.relativeScale = true;
    }

    /**
     * Calculate a color for the given percentage. The higher the
     * percentage, the redder the returned color.
     * @param {Number} percent 0 to 100
     * @param {Bool} invert if true, lower precentages are redder
     * @returns {String} a string like 'rgb(r,g,b)'
     */
    function getColorForPercent(percent) {
      var percent = percent;
      if(settings.invert) {
        percent = 100 - percent;
      }
      R = (255 * percent) / 100;
      G = (255 * (100 - percent)) / 100;
      B = 0;
      return 'rgb(' + Math.round(R) + ', ' + Math.round(G) + ', 0)';
    }

    /**
     *  Colorize a single column in settings.table
     *  @param {Integer} columnIndex
     *  @returns {undefined}
     */
    function colorizeColumn(columnIndex) {
      var min = settings.min;
      var max = settings.max;

      // if relativeScale, then find min and max values for the column
      if(settings.relativeScale) {
        settings.table.find('tr td:nth-child(' + columnIndex + ')').each(function() {
          var n = parseFloat($(this).text());
          if(!isNaN(n)) {
            if(n > max || max === null) {
              max = n;
            }
            if(n < min || min === null ) {
              min = n;
            }
          }
        });
      }

      // used for calculating percentage
      var difference = max - min;
      console.log(max,min);
      console.log('diff: ', difference);

      // go over each cell and colorize it
      settings.table.find('tr td:nth-child(' + columnIndex + ')').each(function() {
        var n = parseFloat($(this).text());
        if(!isNaN(n)) {
          var percentage = (n - min) * 100 / difference;
          console.log('perc: ', percentage);
          $(this).css('background-color', getColorForPercent(percentage));
        }
      });
    }

    if(typeof settings.columns == 'number' && settings.columns % 1 === 0) {
      colorizeColumn(settings.coumns);
    } else if($.isArray(settings.columns)) {
      for (var i=0; i < settings.columns.length; ++i) {
        colorizeColumn(settings.columns[i]);
      }
    }
  };
}));
