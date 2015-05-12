(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {

  /**
   * Converts an RGB color value to HSL. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes r, g, and b are contained in the set [0, 255] and
   * returns h, s, and l in the set [0, 1].
   * from: http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
   *
   * @param   Number  r       The red color value
   * @param   Number  g       The green color value
   * @param   Number  b       The blue color value
   * @return  Array           The HSL representation
   */
  function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
      h = s = 0; // achromatic
    }else{
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {h: h, s: s, l: l};
  }

  /**
   * Converts an HSL color value to RGB. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes h, s, and l are contained in the set [0, 1] and
   * returns r, g, and b in the set [0, 255].
   * from: http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
   *
   * @param   Number  h       The hue
   * @param   Number  s       The saturation
   * @param   Number  l       The lightness
   * @return  Array           The RGB representation
   */
  function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
      r = g = b = l; // achromatic
    }else{
      function hue2rgb(p, q, t){
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {r: Math.round(r*255), g: Math.round(g*255), b: Math.round(b*255)};
  }
  
  /*
   * Colorize columns in a table
   * 
   * @param {JQuery} table
   * @param {Integer|Array} column which column(s) should be colorized
   */
  $.fn.colorize = function (options) {

    var settings = $.extend({
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
    if(!$(this).is('table')) {
      console.error('Not a table: ' + $(this));
      return;
    }
    var table = $(this);

    /**
     * Calculate a color for the given percentage. The higher the
     * percentage, the redder the returned color.
     * @param {Number} percent 0 to 100
     * @returns {String} a string like 'rgb(r,g,b)'
     */
    function getColorForPercent(percent) {
      var percent = percent;
      if(settings.invert) {
        percent = 100 - percent;
      }
      var hue = (percent*33)/100/100;
      var color = hslToRgb(hue, 1, 0.65);
      return 'rgb(' + Math.round(color.r) + ', ' + Math.round(color.g) + ', ' + Math.round(color.b) + ')';
    }

    /**
     *  Colorize a single column in table
     *  @param {Integer} columnIndex
     *  @returns {undefined}
     */
    function colorizeColumn(columnIndex) {
      var min = settings.min;
      var max = settings.max;

      // if relativeScale, then find min and max values for the column
      if(settings.relativeScale) {
        table.find('tr td:nth-child(' + columnIndex + ')').each(function() {
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

      // go over each cell and colorize it
      table.find('tr td:nth-child(' + columnIndex + ')').each(function() {
        var n = parseFloat($(this).text());
        if(!isNaN(n)) {
          var percentage = (n - min) * 100 / difference;
          var color = getColorForPercent(percentage);
          $(this).css('background-color', color);
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
