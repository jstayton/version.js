describe('Version.js', function () {
  'use strict';

  var queryVersion = function (param) {
    var regex = new RegExp('[&\\?]' + param + '=([^&]+)'),
        match = regex.exec(window.location.search);

    return match && match[1];
  };

  it('should load a script from `data` attributes', function () {
    expect($).toBeDefined();
  });

  it('should load a script using `version.load`', function () {
    expect(testLoad100).toBeDefined();
  });

  it('should load a default script version when no query string', function () {
    if (queryVersion('versionjs')) {
      return pending('skipping, query string present');
    }

    expect($().jquery).toEqual('1.9.1');
  });

  it('should load a script version specified by the query string', function () {
    var version = queryVersion('versionjs');

    if (!version) {
      return pending('skipping, no query string present');
    }

    expect($().jquery).toEqual(version);
  });

  it('should load a script version using a custom `param` query string', function () {
    if (queryVersion('loadtest')) {
      expect(testLoad300).toBeDefined();
    }
    else {
      expect(testLoad200).toBeDefined();
    }
  });

  it('should load a script with only a `url`', function () {
    expect(testLoad100).toBeDefined();
  });

  it('should load a script using the `google` CDN `url`', function () {
    expect($).toBeDefined();
  });

  it('should load a script using the `cdnjs` CDN `url`', function () {
    expect(_).toBeDefined();
  });

  it('should load a script using the `jsdelivr` CDN `url`', function () {
    expect(Backbone).toBeDefined();
  });

  it('should load a stylesheet from `data` attributes', function () {
    expect(document.getElementById('testcss100').offsetWidth).toEqual(100);
  });

  it('should load a stylesheet using `version.load`', function () {
    expect(document.getElementById('testcss200').offsetWidth).toEqual(200);
  });
});
