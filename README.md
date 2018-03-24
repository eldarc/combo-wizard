# combo-wizard [![NPM version](https://badge.fury.io/js/combo-wizard.svg)](https://npmjs.org/package/combo-wizard) [![Build Status](https://travis-ci.org/ministryofprogramming/combo-wizard.svg?branch=master)](https://travis-ci.org/ministryofprogramming/combo-wizard)

> ComboWizard is a function which generates combinations based on relationships of values.

[![Ministry of Programming](/mop_logo.svg)](https://ministryofpogramming.com)

## Installation

```sh
$ npm install --save combo-wizard
```

or

```sh
$ yarn add combo-wizard
```

## Usage

```js
var comboWizard = require('combo-wizard');

const parameters = {
  brand: ['vw', 'toyota'],
  model: {
    brand: {
      'toyota': ['corolla', 'yaris'],
      'vw': ['golf', 'polo'],
      'opel': ['astra', 'corsa'],
      'chevrolet': ['astra']
    }
  },
  color: ['black', 'red', 'white']
}

const keysToUse = ['brand', 'model']

const combinations = comboWizard(parameters, keysToUse);
console.log(combinations)
```

This basic example will have the following result:
```js
[
    {
        brand: 'vw',
        model: 'golf'
    },
    {
        brand: 'vw',
        model: 'polo'
    },
    {
        brand: 'toyota',
        model: 'corolla'
    },
    {
        brand: 'toyota',
        model: 'yaris'
    }
]
```
## How to configure parameters
- Always define as an object where the root keys represent an entity. Examples: CarBrand, JobType, etc.
- Values for any key can be either primitive data types (String, Number, etc.), an Array or an Object. If the value is a primitive, like a String, it represents the only single value that the key holds. If the data type is an Array then elements of the array represent a collection of value for the key. However, when the data type of the value is an Object, that object can contain additional relationship data.
- When defining an object as a key value you set the object properties with the names of other entities. Those properties represent values of other entities that can be combined with the current one. However, a special property called `_default` can be used to set default values for the key with the Object data type. Default values don't have relationships with other entities.
- A relationship is defined by an object which keys represent another entity, and its values represent allowed values when combining with that other entity.

**A practical example:**
```js
{
  entity1: 'hi', // entity2 has always a value of `hi`.
  entity2: ['user1', 'user2'], //  entity2 has an array which contains values ['user1', 'user2'].
  entity3: { // entity3 is an object and defines its relationships with other entities.
    _default: ['how are you', 'welcome'], // Default values for entity3, which are always used.
    entity2: {
      'user1': 'great to see you' // When entity3 combines with entity2 which has the value of `user1`
                                  // the text `great to see you` will be returned as the value of entity3.
    }
  }
}
```

**Output:**
```js
[
    {
        entity1: 'hi',
        entity2: 'user1',
        entity3: 'great to see you'
    },
    {
        entity1: 'hi',
        entity2: 'user2',
        entity3: 'how are you'
    },
    {
        entity1: 'hi',
        entity2: 'user2',
        entity3: 'welcome'
    }
]
```

## How to set output keys
Not all keys defined in the parameters need to be present in the output all the time. To select which are needed a second parameter is passed to the function.

```js
const keysToUse = ['entity2', 'entity3'];
comboWizard(parameters, keysToUse);
```

**Output:**
```js
[
    {
        entity2: 'user1',
        entity3: 'great to see you'
    },
    {
        entity2: 'user2',
        entity3: 'how are you'
    },
    {
        entity2: 'user2',
        entity3: 'welcome'
    }
]
```

## Advanced example
```js
const comboWizard = require('./src/combo-wizard')

const parameters = {
  brand: {
    _default: ['', 'toyota', 'vw', 'opel', 'chevrolet'], // Default car brands.
    model: {
      'unknown': ['other'] // Set the card brand as `other` when the model is `unknown`.
    }
  },
  model: {
    _default: ['unknown'], // Default model is `unknown`.
    brand: {
      'toyota': ['corolla', 'yaris'], // Models for the card brand `toyota`.
      'vw': ['golf', 'polo'], // Models for the card brand `vw`.
      'opel': ['astra', 'corsa'], // Models for the card brand `opel`.
      'chevrolet': ['astra'] // Models for the card brand `chevrolet`.
    }
  },
  year: {
    _default: [1991, 2012], // When not defined explicitly default year are `1991` and `2012`.
    model: {
      'yaris': [1999, 2013] // The model `yaris` can be from years `1999` and `2013`.
    },
    brand: {
      'other': [1940, 1941] // The brand `other` can be from years `1940` and `1941`.
    }
  }
}

const combinations = comboWizard(parameters)

console.log(combinations)
```

**Output:**
```js
[
  {
    brand: 'toyota',
    model: 'corolla',
    year: 1991
  },
  {
    brand: 'toyota',
    model: 'corolla',
    year: 2012
  },
  {
    brand: 'toyota',
    model: 'yaris',
    year: 1999
  },
  {
    brand: 'toyota',
    model: 'yaris',
    year: 2013
  },
  {
    brand: 'vw',
    model: 'golf',
    year: 1991
  },
  {
    brand: 'vw',
    model: 'golf',
    year: 2012
  },
  {
    brand: 'vw',
    model: 'polo',
    year: 1991
  },
  {
    brand: 'vw',
    model: 'polo',
    year: 2012
  },
  {
    brand: 'opel',
    model: 'astra',
    year: 1991
  },
  {
    brand: 'opel',
    model: 'astra',
    year: 2012
  },
  {
    brand: 'opel',
    model: 'corsa',
    year: 1991
  },
  {
    brand: 'opel',
    model: 'corsa',
    year: 2012
  },
  {
    brand: 'chevrolet',
    model: 'astra',
    year: 1991
  },
  {
    brand: 'chevrolet',
    model: 'astra',
    year: 2012
  },
  {
    brand: 'other',
    model: 'unknown',
    year: 1940
  },
  {
    brand: 'other',
    model: 'unknown',
    year: 1941
  }
]
```

If only the keys `brand` and `model` are needed:
```js
const keysToUse = ['brand', 'model'];
const combinations = comboWizard(parameters, keysToUse)
```

**Output:**
```js
[
  {
    brand: 'toyota',
    model: 'corolla'
  },
  {
    brand: 'toyota',
    model: 'yaris'
  },
  {
    brand: 'vw',
    model: 'golf'
  },
  {
    brand: 'vw',
    model: 'polo'
  },
  {
    brand: 'opel',
    model: 'astra'
  },
  {
    brand: 'opel',
    model: 'corsa'
  },
  {
    brand: 'chevrolet',
    model: 'astra'
  },
  {
    brand: 'other',
    model: 'unknown'
  }
]
```

## License

MIT © [Eldar Cejvanovic](https://github.com/eldarc) @ [Ministry of Programming](https://ministryofprogramming.com)
