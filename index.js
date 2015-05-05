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
   * Calculate a color for the given percentage. The higher the
   * percentage, the redder the returned color.
   *
   * @param {Number} percent 0 to 100
   * @returns {String} a string like 'rgb(r,g,b)'
   */
  function getColorForPercent(percent) {
    R = (255 * percent) / 100;
    G = (255 * (100 - percent)) / 100;
    B = 0;
    return 'rgb(' + Math.round(R) + ', ' + Math.round(G) + ', 0)';
  }

  /*
   * Colorize columns in a table
   * 
   * @param {JQuery} table
   * @param {Integer|Array} column which column(s) should be colorized
   */
  $.fn.colorizeTable = function (options) {

    var settings = $.extend({
      table: null,
      columns: [1]
    }, options);

    // colorize a single column
    function colorizeColumn(columnIndex) {
      settings.table.find('tr td:nth-child(' + columnIndex + ')').each(function() {
        var n = parseInt($(this).text());
        console.log(n);
        if(!isNaN(n)) {
          console.log(getColorForPercent(n));
          $(this).css('background-color', getColorForPercent(n));
        }
      });
    }

    console.log(typeof settings.columns);
    if(typeof settings.columns == 'number' && settings.columns % 1 === 0) {
      colorizeColumn(settings.coumns);
    } else if($.isArray(settings.columns)) {
      for (var i=0; i < settings.columns.length; ++i) {
        colorizeColumn(settings.columns[i]);
      }
    }
  };
}));
