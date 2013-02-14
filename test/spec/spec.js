describe('Version.js', function () {
  var queryVersion = function () {
    var match = /[&\?]versionjs=([^&]+)/.exec(window.location.search);

    return match && match[1];
  };

  it('should load a script', function () {
    expect($).toBeDefined();
  });

  it('should load the default script version when no `versionjs` query string', function () {
    if (queryVersion()) {
      return true;
    }

    expect($().jquery).toEqual('1.9.1');
  });

  it('should load the script version specified by the `versionjs` query string', function () {
    var version = queryVersion();

    if (!version) {
      return true;
    }

    expect($().jquery).toEqual(version);
  });
});
