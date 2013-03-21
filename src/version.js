/*!
 * <%= pkg.title %> v<%= pkg.version %>
 *
 * <%= pkg.description %>
 *
 * <%= pkg.homepage %>
 *
 * Copyright <%= grunt.template.today('yyyy') %> by <%= pkg.author.name %>
 * Licensed <%= _.pluck(pkg.licenses, 'type').join(', ') %>
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

  // Get the version from the 'versionjs' query string. 'null' if unspecified.
  version.queryVersion = function () {
    var match = /[&\?]versionjs=([^&]+)/.exec(window.location.search);

    return match && match[1];
  };

  // Build a script URL from a CDN constant or custom URL. Pass in optional
  // replacements for {{LIBRARY}}, {{VERSION}}, and {{FILE}}.
  version.scriptUrl = function (url, replacements) {
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
    var selfScript = this.selfScript() || document.createElement('script');

    return {
      url: selfScript.getAttribute('data-url'),
      library: selfScript.getAttribute('data-lib'),
      version: selfScript.getAttribute('data-ver'),
      file: selfScript.getAttribute('data-file')
    };
  };

  // Get the options to load the script.
  version.options = function () {
    var options = this.selfScriptOptions();

    // Prefer the query string version over the 'data-load' default version.
    options.version = this.queryVersion() || options.version;

    return options;
  };

  // Load the script based on the options.
  version.load = function () {
    var options = this.options(),
        scriptUrl = this.scriptUrl(options.url, options),
        scriptString = this.scriptString(scriptUrl);

    return this.writeScript(scriptString);
  };

  // Load the script immediately when this code is parsed and executed.
  version.load();
})(window, document);
