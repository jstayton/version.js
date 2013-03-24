Version.js
==========

[![Selenium Test Status](https://saucelabs.com/buildstatus/versionjs)](https://saucelabs.com/u/versionjs)
[![Build Status](https://secure.travis-ci.org/jstayton/version.js.png?branch=master)](https://travis-ci.org/jstayton/version.js)

Test a different script version with the switch of a query string.

*   [Example](http://jstayton.github.com/version.js)
*   [Release Notes](https://github.com/jstayton/version.js/wiki/Release-Notes)

Why?
----

Version.js is handy in a number of browser-based, JavaScript testing scenarios:

*   Running **automated tests** of your library or plugin against different
    versions of a dependency? (Think of a jQuery plugin being tested against
    different versions of jQuery to ensure compatibility.) Rolling your own code
    to switch the version? Or worse, creating different test runners for each
    version?

        http://local.dev/test/runner_jquery_150.html
        http://local.dev/test/runner_jquery_161.html
        http://local.dev/test/runner_jquery_180.html

    Use Version.js and simplify your setup to a single test runner:

        http://local.dev/test/runner.html?versionjs=1.5.0
        http://local.dev/test/runner.html?versionjs=1.6.1
        http://local.dev/test/runner.html?versionjs=1.8.0

*   Upgrading to a **new version** of a library or plugin? Use Version.js and
    quickly toggle between versions without touching your code. Very helpful for
    comparing that everything works the same.

*   Tired of **maintaining different versions** of a script you're testing
    against? Have a directory filled with every version of jQuery? Version.js
    has built-in support for the most common CDNs, so you have instant access to
    every library and version available.

Download
--------

*   [Minified without comments](https://raw.github.com/jstayton/version.js/master/build/version.min.js)
*   [Full source with comments](https://raw.github.com/jstayton/version.js/master/build/version.js)

### Bower

[Bower](http://twitter.github.com/bower) is a package manager for the web. Once
installed, Bower can install Version.js with a single command:

    bower install version.js

Usage
-----

There are two ways of using Version.js: `version.load` and through `data`
attributes.

### `version.load`

Once Version.js is loaded, a `version` object is accessible with a single `load`
method:

    version.load({
      url: '/assets/js/{{LIBRARY}}/{{FILE}}-{{VERSION}}.js',
      library: 'jquery',
      version: '1.5.0',
      file: 'jquery.min'
    });

`load` accepts an options object as the only parameter (see below for all
options), and can be called multiple times to load different scripts.

The version of the script can then be changed through the `versionjs` query
string parameter (configurable with the `param` option):

    http://local.dev/users?versionjs=1.6.1
    http://local.dev/users?versionjs=1.8.0
    http://local.dev/users?versionjs=1.9.1

### `data` attributes

Version.js can also load a single script by specifying the options as `data`
attributes on the `<script>` tag that loads Version.js itself:

    <script src="version.js" data-url="google" data-lib="jquery" data-ver="1.5.0" data-file="jquery.min"></script>

As soon as Version.js is loaded, it parses the `data` attributes and loads the
specified script. This is a handy convenience that can be used by itself or in
conjunction with `version.load`.

To illustrate, say you're currently loading jQuery 1.7.2 from Google's CDN:

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>

This same script can be loaded by Version.js by replacing the above with the
following:

    <script src="version.js" data-url="google" data-lib="jquery" data-ver="1.7.2" data-file="jquery.min"></script>

As before, jQuery 1.7.2 will be loaded and ready for use, but with the added
convenience that Version.js brings.

Options
-------

_url_ / _data-url_ is the only required option.

*   **url** / **data-url** _string_

    The relative or full URL pattern to the script. The name of a CDN can also
    be used for convenience — see the list of supported CDNs below.

    A number of placeholders are available, which Version.js then replaces with
    the specified option values:

    *   `{{LIBRARY}}`
    *   `{{VERSION}}`
    *   `{{FILE}}`

    For example, the Google CDN URL can be expressed as:

        //ajax.googleapis.com/ajax/libs/{{LIBRARY}}/{{VERSION}}/{{FILE}}.js

    Relative, local URLs can be used just as well:

        /assets/js/jquery-{{VERSION}}.min.js
        /lib/{{LIBRARY}}/{{FILE}}-{{VERSION}}.js

    ----------------------------------------------------------------------------
*   **library** / **data-lib** _string_

    The name of the library. Replaces the `{{LIBRARY}}` placeholder in the URL.

    ----------------------------------------------------------------------------
*   **version** / **data-ver** _string_

    The default version to load when a query string parameter is not specified.
    Replaces the `{{VERSION}}` placeholder in the URL.

    ----------------------------------------------------------------------------
*   **file** / **data-file** _string_

    The file name of the script. If unspecified, the name of the library is
    used. Replaces the `{{FILE}}` placeholder in the URL.

    ----------------------------------------------------------------------------
*   **param** / **data-param** _string_

    The query string parameter to get the version from. If unspecified,
    `versionjs` is used.

CDNs
----

For convenience, Version.js has built-in support for a number of common CDNs.
These identifiers can be used in place of a URL:

*   [cdnjs](http://cdnjs.com)
*   [google](https://developers.google.com/speed/libraries/)
*   [jsdelivr](http://www.jsdelivr.com)

To illustrate, instead of using the full Google CDN URL:

    data-url="//ajax.googleapis.com/ajax/libs/{{LIBRARY}}/{{VERSION}}/{{FILE}}.js"

The identifier can be used in its place:

    data-url="google"

Feedback
--------

Please open an issue to request a feature or submit a bug report. Or even if
you just want to provide some feedback, I'd love to hear. I'm also available on
Twitter as [@jstayton](http://twitter.com/jstayton).

Contributing
------------

1.  Fork it.
2.  Create your feature branch (`git checkout -b my-new-feature`).
3.  Commit your changes (`git commit -am 'Added some feature'`).
4.  Push to the branch (`git push origin my-new-feature`).
5.  Create a new Pull Request.

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/318e47547846b170e3db832a01de1b83 "githalytics.com")](http://githalytics.com/jstayton/version.js)
