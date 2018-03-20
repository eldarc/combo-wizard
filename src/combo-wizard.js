/*!
 * combo-wizard v1.0.1
 * Copyright (c) 2018-present, Eldar Cejvanovic
 * License: MIT
 */
const { uniq, cloneDeep } = require('lodash')

const reformatParameters = function (parameters) {
  if (!parameters || !(typeof parameters === 'object')) {
    parameters = {}
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
  const _checkArray = (_arr) => {
    for (const i in _arr) {
      if (_arr[i] === '') {
        _arr[i] = undefined
      }
    }

    return _arr
  }

  for (const parameter of Object.keys(parameters)) {
    if (parameters[parameter] instanceof Array) {
      parameters[parameter] = {
        _default: _checkArray(parameters[parameter])
      }
    } else if (typeof parameters[parameter] === 'string' || typeof parameters[parameter] === 'number') {
      parameters[parameter] = {
        _default: _checkArray([parameters[parameter]])
      }
    } else if (typeof parameters[parameter] === 'object') {
      for (const otherRouterParam of Object.keys(parameters[parameter])) {
        if (typeof parameters[parameter][otherRouterParam] === 'string' || typeof parameters[parameter][otherRouterParam] === 'number') {
          parameters[parameter][otherRouterParam] = {
            _default: _checkArray([parameters[parameter][otherRouterParam]])
          }
        } else if (parameters[parameter][otherRouterParam] instanceof Array) {
          const _arr = parameters[parameter][otherRouterParam]
          parameters[parameter][otherRouterParam] = {
            _default: _checkArray(_arr)
          }
        } else if (typeof parameters[parameter][otherRouterParam] === 'object') {
          for (const paramValue of Object.keys(parameters[parameter][otherRouterParam])) {
            if (typeof parameters[parameter][otherRouterParam][paramValue] === 'string' || typeof parameters[parameter][otherRouterParam][paramValue] === 'number') {
              parameters[parameter][otherRouterParam][paramValue] = _checkArray([parameters[parameter][otherRouterParam][paramValue]])
            } else if (!(parameters[parameter][otherRouterParam][paramValue] instanceof Array)) {
              parameters[parameter][otherRouterParam][paramValue] = []
            }
          }
        } else {
          parameters[parameter][otherRouterParam] = {
            _default: []
          }
        }
      }
    } else {
      parameters[parameter] = {
        _default: []
      }
    }

    if (!parameters[parameter]._default) {
      parameters[parameter]._default = []
    }
  }

  return parameters
}

const comboWizard = function (inputParameters, keys) {
  // Restructure input data.
  if (!keys || !(keys instanceof Array)) {
    keys = inputParameters && typeof inputParameters === 'object' ? Object.keys(inputParameters) : []
  }
  inputParameters = reformatParameters(inputParameters)

  // Flatten parameter value rules to a single array for each parameter.
  const _flattenObject = (key) => {
    if (inputParameters[key]) {
      let _flattened = []

      const _flatten = (_obj, _key) => {
        for (const prop of Object.keys(_obj[_key])) {
          if (_obj[_key][prop] instanceof Array) {
            _flattened.push(..._obj[_key][prop])
          } else {
            _flatten(_obj[_key], prop)
          }
        }
      }
      _flatten(inputParameters, key)

      return _flattened
    }

    return []
  }

  // Generate a collection of flattened arrays.
  const _valueArrays = (() => {
    const _arr = []
    for (const key of keys) {
      _arr.push({
        key: key,
        values: uniq(_flattenObject(key))
      })
    }

    return _arr
  })()

  // Check if the current combination of parameters is valid.
  const _isCombinationValid = (parameters) => {
    let isValid = true
    const parameterKeys = Object.keys(parameters)

    // If there is only one parameter, check if its value is in the default array, and return immediately as valid or invalid.
    // In these cases checking the dependencies is unnecessary.
    if (parameterKeys.length === 1) {
      const parameterValue = parameters[parameterKeys[0]]
      const parameterRules = inputParameters[parameterKeys[0]]

      if (!(parameterRules._default._default.includes(parameterValue))) {
        isValid = false
      }

      return isValid
    }

    // For each parameter, loop trough all the other parameters and check dependencies between them.
    for (const parameterKey of parameterKeys) {
      // If the parameter is already invalid break the loop.
      if (isValid === false) {
        break
      }

      const parameterValue = parameters[parameterKey]

      // Parameter rules contain possible values of the current parameter, and dependencies on other parameters.
      const parameterRules = inputParameters[parameterKey]

      // If there isn't a rule definition for the parameter, continue.
      if (!parameterRules) {
        continue
      }

      // Iterate through all the other parameters in the combination.
      for (const otherParameterKey of parameterKeys) {
        // Skip when on the current `parameterKey`.
        if (otherParameterKey === parameterKey) {
          continue
        }

        const otherParameterValue = parameters[otherParameterKey]

        // If there is a specific definition of what parameters are allowed in a combination,
        // based on that array assume allowed values for the current parameter.
        let allowedValues = []
        if (parameterRules[otherParameterKey] && parameterRules[otherParameterKey][otherParameterValue]) {
          allowedValues = parameterRules[otherParameterKey][otherParameterValue]
        } else if (parameterRules[otherParameterKey] && parameterRules[otherParameterKey]._default) {
          allowedValues = parameterRules[otherParameterKey]._default
        }

        // If the `allowedValues` array has items and the current parameter isn't included, flag the combination as invalid.
        if (allowedValues.length > 0 && !allowedValues.includes(parameterValue)) {
          isValid = false
          break
        } else {
          // If there aren't specific definition of what values are allowed, try to assume by checking the other parameter value.
          if (parameterRules[otherParameterKey]) {
            let allowedOtherValues = []
            // For each other parameter rule for the current parameter rules get the key,
            // and if that rule contains the current parameter value add the key as a other parameter allowed value.
            for (const _otherParameterValue of Object.keys(parameterRules[otherParameterKey])) {
              if (parameterRules[otherParameterKey][_otherParameterValue].includes(parameterValue)) {
                allowedOtherValues.push(_otherParameterValue)
              }
            }

            // If the list of other parameter allowed values has items and doesn't include the current other parameter value flag it as invalid.
            if (allowedOtherValues.length > 0 && !allowedOtherValues.includes(otherParameterValue)) {
              isValid = false
              break
            }
          }
        }
      }
    }

    return isValid
  }

  // Valid combinations are stored into the `allValidCombinations` array.
  const allValidCombinations = []

  // Generates a combination and places it into `__OBJECT_BUFFER`.
  // With every iteration `__OBJECT_BUFFER` is reset.
  // Generate all possible combinations, and for each check validity with `_isCombinationValid`.
  // Push all valid combinations to the `allValidCombinations`.
  let __OBJECT_BUFFER = {}
  ;(function _generateCombinations (index = 0) {
    if (index < _valueArrays.length) {
      const param = _valueArrays[index]

      if (param.values.length === 0) {
        param.values = ['']
      }

      for (const value of param.values) {
        if (index === 0) {
          __OBJECT_BUFFER = {}
        }

        __OBJECT_BUFFER[param.key] = value

        if (index === _valueArrays.length - 1) {
          const _object = cloneDeep(__OBJECT_BUFFER)

          if (_isCombinationValid(_object)) {
            allValidCombinations.push(_object)
          }
        } else {
          _generateCombinations(index + 1)
        }
      }
    }
  })()

  return allValidCombinations
}

module.exports = comboWizard
