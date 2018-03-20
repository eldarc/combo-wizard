'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*!
 * combo-wizard v1.0.1
 * Copyright (c) 2018-present, Eldar Cejvanovic
 * License: MIT
 */
var _require = require('lodash'),
    uniq = _require.uniq,
    cloneDeep = _require.cloneDeep;

var reformatParameters = function reformatParameters(parameters) {
  if (!parameters || !((typeof parameters === 'undefined' ? 'undefined' : (0, _typeof3.default)(parameters)) === 'object')) {
    parameters = {};
  }

  // Reconfigure parameters so that the object has the following format:
  // {
  //   parameterKey: {
  //     _default: { // Will be converted to _default._default array even there is just an array or string.
  //       _default: [value1, value2, ..., valueN] // Required.
  //     },
  //     otherParameterKey: {
  //       _default: [thisParameterValue3, thisParameterValue4, ..., valueN], // For other parameters inside a parameter rule object this is optional. This will be used if the otherParameter is in combination with the parameter, but no other rules are defined.
  //       otherParameterValue: [thisParameterValue1, thisParameterValue2, thisParameterValueN] // Parameters to be set when otherParameterValue has certain value.
  //     }
  //   },
  //   otherParameterKey: {
  //     _default: {
  //       _default: [value1, value2, ..., valueN] // Required.
  //     }
  //   }
  // }
  // All strings and numbers at any level will be converted to an array with just that value in the array.
  // Objects are parsed until the last level, where a blank array will be set if there is no string, number or array.
  // Proper arrays will be set as the data set.
  var _checkArray = function _checkArray(_arr) {
    for (var i in _arr) {
      if (_arr[i] === '') {
        _arr[i] = undefined;
      }
    }

    return _arr;
  };

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(parameters)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var parameter = _step.value;

      if (parameters[parameter] instanceof Array) {
        parameters[parameter] = {
          _default: _checkArray(parameters[parameter])
        };
      } else if (typeof parameters[parameter] === 'string' || typeof parameters[parameter] === 'number') {
        parameters[parameter] = {
          _default: _checkArray([parameters[parameter]])
        };
      } else if ((0, _typeof3.default)(parameters[parameter]) === 'object') {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = (0, _getIterator3.default)((0, _keys2.default)(parameters[parameter])), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var otherRouterParam = _step2.value;

            if (typeof parameters[parameter][otherRouterParam] === 'string' || typeof parameters[parameter][otherRouterParam] === 'number') {
              parameters[parameter][otherRouterParam] = {
                _default: _checkArray([parameters[parameter][otherRouterParam]])
              };
            } else if (parameters[parameter][otherRouterParam] instanceof Array) {
              var _arr = parameters[parameter][otherRouterParam];
              parameters[parameter][otherRouterParam] = {
                _default: _checkArray(_arr)
              };
            } else if ((0, _typeof3.default)(parameters[parameter][otherRouterParam]) === 'object') {
              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                for (var _iterator3 = (0, _getIterator3.default)((0, _keys2.default)(parameters[parameter][otherRouterParam])), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  var paramValue = _step3.value;

                  if (typeof parameters[parameter][otherRouterParam][paramValue] === 'string' || typeof parameters[parameter][otherRouterParam][paramValue] === 'number') {
                    parameters[parameter][otherRouterParam][paramValue] = _checkArray([parameters[parameter][otherRouterParam][paramValue]]);
                  } else if (!(parameters[parameter][otherRouterParam][paramValue] instanceof Array)) {
                    parameters[parameter][otherRouterParam][paramValue] = [];
                  }
                }
              } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                  }
                } finally {
                  if (_didIteratorError3) {
                    throw _iteratorError3;
                  }
                }
              }
            } else {
              parameters[parameter][otherRouterParam] = {
                _default: []
              };
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      } else {
        parameters[parameter] = {
          _default: []
        };
      }

      if (!parameters[parameter]._default) {
        parameters[parameter]._default = [];
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return parameters;
};

var comboWizard = function comboWizard(inputParameters, keys) {
  // Restructure input data.
  if (!keys || !(keys instanceof Array)) {
    keys = inputParameters && (typeof inputParameters === 'undefined' ? 'undefined' : (0, _typeof3.default)(inputParameters)) === 'object' ? (0, _keys2.default)(inputParameters) : [];
  }
  inputParameters = reformatParameters(inputParameters);

  // Flatten parameter value rules to a single array for each parameter.
  var _flattenObject = function _flattenObject(key) {
    if (inputParameters[key]) {
      var _flattened = [];

      var _flatten = function _flatten(_obj, _key) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = (0, _getIterator3.default)((0, _keys2.default)(_obj[_key])), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var prop = _step4.value;

            if (_obj[_key][prop] instanceof Array) {
              _flattened.push.apply(_flattened, (0, _toConsumableArray3.default)(_obj[_key][prop]));
            } else {
              _flatten(_obj[_key], prop);
            }
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      };
      _flatten(inputParameters, key);

      return _flattened;
    }

    return [];
  };

  // Generate a collection of flattened arrays.
  var _valueArrays = function () {
    var _arr = [];
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = (0, _getIterator3.default)(keys), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var key = _step5.value;

        _arr.push({
          key: key,
          values: uniq(_flattenObject(key))
        });
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }

    return _arr;
  }();

  // Check if the current combination of parameters is valid.
  var _isCombinationValid = function _isCombinationValid(parameters) {
    var isValid = true;
    var parameterKeys = (0, _keys2.default)(parameters);

    // If there is only one parameter, check if its value is in the default array, and return immediately as valid or invalid.
    // In these cases checking the dependencies is unnecessary.
    if (parameterKeys.length === 1) {
      var parameterValue = parameters[parameterKeys[0]];
      var parameterRules = inputParameters[parameterKeys[0]];

      if (!parameterRules._default._default.includes(parameterValue)) {
        isValid = false;
      }

      return isValid;
    }

    // For each parameter, loop trough all the other parameters and check dependencies between them.
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = (0, _getIterator3.default)(parameterKeys), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var parameterKey = _step6.value;

        // If the parameter is already invalid break the loop.
        if (isValid === false) {
          break;
        }

        var _parameterValue = parameters[parameterKey];

        // Parameter rules contain possible values of the current parameter, and dependencies on other parameters.
        var _parameterRules = inputParameters[parameterKey];

        // If there isn't a rule definition for the parameter, continue.
        if (!_parameterRules) {
          continue;
        }

        // Iterate through all the other parameters in the combination.
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = (0, _getIterator3.default)(parameterKeys), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var otherParameterKey = _step7.value;

            // Skip when on the current `parameterKey`.
            if (otherParameterKey === parameterKey) {
              continue;
            }

            var otherParameterValue = parameters[otherParameterKey];

            // If there is a specific definition of what parameters are allowed in a combination,
            // based on that array assume allowed values for the current parameter.
            var allowedValues = [];
            if (_parameterRules[otherParameterKey] && _parameterRules[otherParameterKey][otherParameterValue]) {
              allowedValues = _parameterRules[otherParameterKey][otherParameterValue];
            } else if (_parameterRules[otherParameterKey] && _parameterRules[otherParameterKey]._default) {
              allowedValues = _parameterRules[otherParameterKey]._default;
            }

            // If the `allowedValues` array has items and the current parameter isn't included, flag the combination as invalid.
            if (allowedValues.length > 0 && !allowedValues.includes(_parameterValue)) {
              isValid = false;
              break;
            } else {
              // If there aren't specific definition of what values are allowed, try to assume by checking the other parameter value.
              if (_parameterRules[otherParameterKey]) {
                var allowedOtherValues = [];
                // For each other parameter rule for the current parameter rules get the key,
                // and if that rule contains the current parameter value add the key as a other parameter allowed value.
                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                  for (var _iterator8 = (0, _getIterator3.default)((0, _keys2.default)(_parameterRules[otherParameterKey])), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var _otherParameterValue = _step8.value;

                    if (_parameterRules[otherParameterKey][_otherParameterValue].includes(_parameterValue)) {
                      allowedOtherValues.push(_otherParameterValue);
                    }
                  }

                  // If the list of other parameter allowed values has items and doesn't include the current other parameter value flag it as invalid.
                } catch (err) {
                  _didIteratorError8 = true;
                  _iteratorError8 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                      _iterator8.return();
                    }
                  } finally {
                    if (_didIteratorError8) {
                      throw _iteratorError8;
                    }
                  }
                }

                if (allowedOtherValues.length > 0 && !allowedOtherValues.includes(otherParameterValue)) {
                  isValid = false;
                  break;
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7.return) {
              _iterator7.return();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }

    return isValid;
  };

  // Valid combinations are stored into the `allValidCombinations` array.
  var allValidCombinations = [];

  // Generates a combination and places it into `__OBJECT_BUFFER`.
  // With every iteration `__OBJECT_BUFFER` is reset.
  // Generate all possible combinations, and for each check validity with `_isCombinationValid`.
  // Push all valid combinations to the `allValidCombinations`.
  var __OBJECT_BUFFER = {};(function _generateCombinations() {
    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    if (index < _valueArrays.length) {
      var param = _valueArrays[index];

      if (param.values.length === 0) {
        param.values = [''];
      }

      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = (0, _getIterator3.default)(param.values), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var value = _step9.value;

          if (index === 0) {
            __OBJECT_BUFFER = {};
          }

          __OBJECT_BUFFER[param.key] = value;

          if (index === _valueArrays.length - 1) {
            var _object = cloneDeep(__OBJECT_BUFFER);

            if (_isCombinationValid(_object)) {
              allValidCombinations.push(_object);
            }
          } else {
            _generateCombinations(index + 1);
          }
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9.return) {
            _iterator9.return();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }
    }
  })();

  return allValidCombinations;
};

module.exports = comboWizard;