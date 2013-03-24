describe('Version.js', function () {
  'use strict';

  var queryVersion = function (param) {
    var regex = new RegExp('[&\\?]' + param + '=([^&]+)'),
        match = regex.exec(window.location.search);

    return match && match[1];
  };

  describe('Loading with `data` attributes', function () {
    it('should load a script', function () {
      expect($).toBeDefined();
    });

    it('should load the default script version when no query string', function () {
      if (queryVersion('versionjs')) {
        return true;
      }

      expect($().jquery).toEqual('1.9.1');
    });

    it('should load the script version specified by the query string', function () {
      var version = queryVersion('versionjs');

      if (!version) {
        return true;
      }

      expect($().jquery).toEqual(version);
    });
  });

  describe('Loading with `version.load`', function () {
    it('should load a script', function () {
      runs(function () {
        version.load({
          url: 'cdnjs',
          library: 'lodash.js',
          version: '1.0.1',
          file: 'lodash.min',
          param: 'lodash'
        });
      });

      waitsFor(function () {
        return typeof _ !== 'undefined';
      }, 'The script should be loaded', 5000);

      runs(function () {
        expect(_).toBeDefined();
        expect(_.VERSION).toEqual('1.0.1');
      });
    });
  });
});
