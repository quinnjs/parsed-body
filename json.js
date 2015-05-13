'use strict';

const getRawBody = require('raw-body');

function withOptions(options) {
  options = options || {};
  const limit = options.limit || '1mb';
  const timeout = options.timeout || 250;

  function parse(raw) {
    const str = raw.toString('utf8');
    try {
      return JSON.parse(str);
    } catch (parseError) {
      parseError.raw = str;
      return Promise.reject(parseError);
    }
  }

  function parseJsonBody(req) {
    if (timeout !== -1) req.setTimeout(timeout);
    const opts = { limit: limit };
    const length = req.headers['content-length'] | 0;
    if (length) options.length = length;

    return getRawBody(req, opts).then(parse);
  }

  return parseJsonBody;
}

const withDefaultOpions = withOptions();

module.exports = withDefaultOpions;
withDefaultOpions['default'] = withDefaultOpions;
withDefaultOpions.withOptions = withOptions;
