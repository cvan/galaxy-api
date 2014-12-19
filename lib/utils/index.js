var Boom = require('boom');
var Promise = require('es6-promise').Promise;


module.exports.errors = require('./errors');


module.exports.isNumeric = function isNumeric(obj) {
  return !isNaN(parseFloat(obj)) && isFinite(obj);
};


module.exports.stringifyObject = stringifyObject = function (obj) {
  return obj instanceof Object ? JSON.stringify(obj) : obj;
};


module.exports.promisify = function (func) {
  return function () {
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
      console.error('Caught stack:\n%s', err.stack);
    } else if (err.name) {
      console.error('Caught rejection:\n%s', stringifyObject(err));

      switch (err.name) {
        case 'DatabaseError':
          // NOTE: The response will actually contain this generic message:
          // "An internal server error occurred"
          return Boom.badImplementation(err.message || 'database_error');
        case 'DoesNotExist':
          return Boom.notFound(err.message || 'does_not_exist');
        case 'ValidationError':
          return Boom.badRequest(err.message || 'validation_error');
      }
    }
  }

  return Boom.badImplementation(err);
};
