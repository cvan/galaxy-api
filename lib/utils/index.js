'use strict';

var Boom = require('boom');


module.exports.errors = require('./errors');


module.exports.isStringAnInt = function (str) {
  var num = Number(str);
  return String(num) === str && num >= 0;
};


var stringifyObject = module.exports.stringifyObject = function (obj) {
  return typeof obj === 'object' ? JSON.stringify(obj) : obj;
};


module.exports.promisify = function (func) {
  return function () {
    // Bail if the function is already a promise.
    if (func && typeof func.then === 'function') {
      return func;
    }

    var args = Array.prototype.slice.apply(arguments);

    return new Promise(function (resolve, reject) {
      func.apply({}, args.concat(function (err, value) {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      }));
    });
  };
};


module.exports.returnError = function (err) {
  if (err instanceof Object) {
    if (err instanceof Error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('Caught stack:\n%s', err.stack);
      }
    } else if (err.name) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('Caught rejection:\n%s', stringifyObject(err));
      }

      switch (err.name) {
        case 'DatabaseError':
          // NOTE: The response will actually contain this generic message:
          // "An internal server error occurred"
          return Boom.internal(err.message || 'database_error', {error: err});
        case 'DoesNotExist':
          return Boom.notFound(err.message || 'does_not_exist');
        case 'ValidationError':
          return Boom.badRequest(err.message || 'validation_error');
      }
    }
  }

  return Boom.badImplementation(err);
};
