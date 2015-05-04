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

  $.fn.colorizeTable = function (table, column) {
    var column = column || 1;
    console.log(table);
    table.find('tr td:nth-child(' + column + ')').each(function() {
      var n = parseInt($(this).text());
      if(!isNaN(n)) {
        console.log(getColorForPercent(n));
        $(this).css('background-color', getColorForPercent(n));
      }
    });
  };
}));
