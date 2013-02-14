/*!
 * Version.js v0.1.0
 *
 * Test a different script version with the switch of a query string.
 *
 * https://github.com/jstayton/version.js
 *
 * Copyright 2013 by Justin Stayton
 * Licensed MIT
 */
(function (window, document) {
  'use strict';

  var version = {
    // CDN constants for use in place of full URLs.
    CDN: {
      cdnjs: '//cdnjs.cloudflare.com/ajax/libs/{{LIBRARY}}/{{VERSION}}/{{FILE}}.js',
      google: '//ajax.googleapis.com/ajax/libs/{{LIBRARY}}/{{VERSION}}/{{FILE}}.js',
      jsdelivr: '//cdn.jsdelivr.net/{{LIBRARY}}/{{VERSION}}/{{FILE}}.js'
    },
    // Get the version from the 'versionjs' query string. 'null' if unspecified.
    queryVersion: function () {
      var match = /[&\?]versionjs=([^&]+)/.exec(window.location.search);

      return match && match[1];
    },
    // Build a script URL from a CDN constant or custom URL. Pass in optional
    // replacements for {{LIBRARY}}, {{VERSION}}, and {{FILE}}.
    scriptUrl: function (url, replacements) {
      var scriptUrl = this.CDN[url] || url;

      if (!scriptUrl) {
        return null;
      }

      // Prepend the protocol if the URL starts with '//'.
      if (scriptUrl.substr(0, 2) === '//') {
        scriptUrl = (window.location.protocol === 'https:' ? 'https:' : 'http:') + scriptUrl;
      }

      if (replacements) {
        scriptUrl = scriptUrl.replace(/\{\{LIBRARY\}\}/, replacements.library);
        scriptUrl = scriptUrl.replace(/\{\{VERSION\}\}/, replacements.version);
        scriptUrl = scriptUrl.replace(/\{\{FILE\}\}/, replacements.file || replacements.library);
      }

      return scriptUrl;
    },
    // Build a script tag as a string. 'null' if 'src' unspecified.
    scriptString: function (src) {
      return src && '<script type="text/javascript" src="' + src + '"><\/script>';
    },
    // Write a script tag to the document.
    writeScript: function (script) {
      return script && document.write(script);
    },
    // Get the script element that loaded this code.
    selfScript: function () {
      var scripts = document.getElementsByTagName('script');

      return scripts[scripts.length - 1];
    },
    // Get the 'data' attribute options from the script element that loaded this
    // code.
    selfScriptOptions: function () {
      var selfScript = this.selfScript() || document.createElement('script');

      return {
        url: selfScript.getAttribute('data-url'),
        library: selfScript.getAttribute('data-lib'),
        version: selfScript.getAttribute('data-ver'),
        file: selfScript.getAttribute('data-file')
      };
    },
    // Get the options to load the script.
    options: function () {
      var options = this.selfScriptOptions();

      // Prefer the query string version over the 'data-load' default version.
      options.version = this.queryVersion() || options.version;

      return options;
    },
    // Load the script based on the options.
    load: function () {
      var options = this.options(),
          scriptUrl = this.scriptUrl(options.url, options),
          scriptString = this.scriptString(scriptUrl);

      return this.writeScript(scriptString);
    }
  };

  // Load the script immediately when this code is parsed and executed.
  version.load();
})(window, document);
