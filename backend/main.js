/*jshint node:true */

var http = require('http');
var path = require("path");
var url = require("url");

var framework = require("./framework.js");
require("./handlers.js");

// Sources

var sources = {
  weights: require('./data/weights.json'),
  subsectorToSectorMap: require('./data/SubsectorToSectorMap.json'),
  prices_for_subsectors: require('./data/prices_for_subsectors.json')
};

sources.weights.forEach(function(it) {
  it.Date = Date.parse(it.Date);
});

// Data

var data = {
  availableDates: (function() {
    var dates = {};
    sources.weights.forEach(function(weight) {
      if (weight.Date) {
        dates[weight.Date] = true;
      }
    });
    return Object.keys(dates)
      .sort(function(a, b) {
        return a - b;
      });
  }()),

  dateWeigts: (function() {
    var map = {};
    sources.weights.forEach(function(it) {
      var obj = map[it.Date] || (map[it.Date] = {});
      obj[it.SubSector] = it;
    });
    return map;
  }()),

  sectorMap: (function() {
    var map = {
      name: 'root',
      children: []
    },
        sectorMapRaw = sources.subsectorToSectorMap;

    function getSectorCreate(sectorName) {
      var object;

      map.children.some(function(it) {
        if (it.name === sectorName) {
          object = it;
          return true;
        }
      });

      if (! object) {
        object = {
          name: sectorName,
          children: []
        };
        map.children.push(object);
      }

      return object;
    }

    for (var subsectorName in sectorMapRaw) {
      if (sectorMapRaw.hasOwnProperty(subsectorName)) {
        var sectorName = sectorMapRaw[subsectorName];
        var sector = getSectorCreate(sectorName);

        sector.children.push({
          name: subsectorName
        });
      }
    }

    return map;
  }()),

  getDateWeights: function(date) {
    return this.dateWeigts[date];
  },

  getAllDateWeights: function() {
    return this.dateWeigts;
  },

  getAvailableDates: function() {
    return this.availableDates;
  },

  getFirstAvailableDate: function() {
    return this.availableDates[0];
  }

 };

// Serving

// Request handling

function handleAPIRequest(req, res) {
  /*jshint boss:true */
  var matches, obj;

  if (/^\/api\/initialPayload\/?/.test(req.url)) {
    serveJSON(res, {
      sectors: data.sectorMap,
      dates: data.getAvailableDates(),
      initialDate: data.getFirstAvailableDate(),
      initialData: data.getDateWeights(
        data.getFirstAvailableDate()
      )
    });
    return;
  } else if (matches = req.url.match(/^\/api\/weights\/([^\/]+)/)) {
    obj = data.getDateWeights(matches[1]);
    if (obj) {
      serveJSON(res, obj);
      return;
    }
  } else if (/^\/api\/allWeights\/?/.test(req.url)) {
    serveJSON(res, data.getAllDateWeights());
    return;
  } else if (matches = req.url.match(/^\/api\/prices\/([^\/]+)/)) {
    obj = sources.prices_for_subsectors[unescape(matches[1])];
    if (obj) {
      serveJSON(res, obj);
      return;
    }
  }

  serve404(res);
}

var server = http.createServer(framework.mainHandler);

var port = Number(process.env.PORT || 8124);
server.listen(port);
