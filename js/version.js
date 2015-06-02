/*!
 * Version.js v0.2.0
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

  var version = {};

  // CDN constants for use in place of full URLs.
  version.CDN = {
    cdnjs: '//cdnjs.cloudflare.com/ajax/libs/{{LIBRARY}}/{{VERSION}}/{{FILE}}.js',
    google: '//ajax.googleapis.com/ajax/libs/{{LIBRARY}}/{{VERSION}}/{{FILE}}.js',
    jsdelivr: '//cdn.jsdelivr.net/{{LIBRARY}}/{{VERSION}}/{{FILE}}.js'
  };

  // Get the version from a query string param. 'null' if unspecified.
  version.queryVersion = function (param) {
    var regex = new RegExp('[&\\?]' + param + '=([^&]+)'),
        match = regex.exec(window.location.search);

    return match && match[1];
  };

  // Build a script URL from a CDN constant or custom URL. Pass in optional
  // replacements for {{LIBRARY}}, {{VERSION}}, and {{FILE}}.
  version.scriptUrl = function (url, replacements) {
    var scriptUrl = version.CDN[url] || url;

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
  };

  // Build a script tag as a string. 'null' if 'src' unspecified.
  version.scriptString = function (src) {
    return src && '<script type="text/javascript" src="' + src + '"><\/script>';
  };

  // Write a script tag to the document.
  version.writeScript = function (script) {
    return script && document.write(script);
  };

  // Get the script element that loaded this code.
  version.selfScript = function () {
    var scripts = document.getElementsByTagName('script');

    return scripts[scripts.length - 1];
  };

  // Get the 'data' attribute options from the script element that loaded this
  // code.
  version.selfScriptOptions = function () {
    var selfScript = version.selfScript() || document.createElement('script');

    return {
      url: selfScript.getAttribute('data-url'),
      library: selfScript.getAttribute('data-lib'),
      version: selfScript.getAttribute('data-ver'),
      file: selfScript.getAttribute('data-file'),
      param: selfScript.getAttribute('data-param')
    };
  };

  // Get a set of options normalized with default values.
  version.options = function (options) {
    var param = options.param || 'versionjs';

    return {
      url: options.url,
      library: options.library,
      version: version.queryVersion(param) || options.version,
      file: options.file,
      param: param
    };
  };

  // Load a script based on options.
  version.load = function (opts) {
    var options = version.options(opts),
        scriptUrl = version.scriptUrl(options.url, options),
        scriptString = version.scriptString(scriptUrl);

    return version.writeScript(scriptString);
  };

  // Load the script configured by the 'data' attributes on the script element
  // that loaded this code.
  version.load(version.selfScriptOptions());

  // Expose public methods for programmatic use.
  window.version = {
    load: version.load
  };
})(window, document);
