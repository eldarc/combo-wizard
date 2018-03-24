import comboWizard from '../src/combo-wizard'

// *********************
// GENERAL EXAMPLE
// *********************
const generalExample = comboWizard({
  entity1: {
    _default: ['', '1', '2', 3, 4],
    model: {
      'unknown': ['other']
    }
  },
  entity2: {
    _default: ['unknown'],
    entity1: {
      '1': [1, 2],
      '2': [3, 4],
      3: ['1', '2'],
      4: ['3']
    }
  },
  year: {
    _default: [1991, 2012],
    entity2: {
      '2': [5, 6]
    },
    entity1: {
      'other': ['text1', 'text2']
    }
  },
  justArray: [1, 2],
  justNumber: 1,
  justString: 'text'
})

const generalExample_expected = [
  {
    entity1: undefined,
    entity2: 'unknown',
    year: 1991,
    justArray: 1,
    justNumber: 1,
    justString: 'text'
  },
  {
    entity1: undefined,
    entity2: 'unknown',
    year: 1991,
    justArray: 2,
    justNumber: 1,
    justString: 'text'
  },
  {
    entity1: undefined,
    entity2: 'unknown',
    year: 2012,
    justArray: 1,
    justNumber: 1,
    justString: 'text'
  },
  {
    entity1: undefined,
    entity2: 'unknown',
    year: 2012,
    justArray: 2,
    justNumber: 1,
    justString: 'text'
  },
  {
    entity1: '1',
    entity2: 1,
    year: 1991,
    justArray: 1,
    justNumber: 1,
    justString: 'text'
  },
  {
    entity1: '1',
    entity2: 1,
    year: 1991,
    justArray: 2,
    justNumber: 1,
    justString: 'text'
  },
  {
    entity1: '1',
    entity2: 1,
    year: 2012,
    justArray: 1,
    justNumber: 1,
    justString: 'text'
  },
  {
    entity1: '1',
    entity2: 1,
    year: 2012,
    justArray: 2,
    justNumber: 1,
    justString: 'text'
  },
  {
    entity1: '2',
    entity2: 3,
    year: 1991,
    justArray: 1,
    justNumber: 1,
    justString: 'text'
  },
  {
    entity1: '2',
    entity2: 3,
    year: 1991,
    justArray: 2,
    justNumber: 1,
    justString: 'text'
  },
  {
    entity1: '2',
    entity2: 3,
    year: 2012,
    justArray: 1,
    justNumber: 1,
    justString: 'text'
  },
  {
    entity1: '2',
    entity2: 3,
    year: 2012,
    justArray: 2,
    justNumber: 1,
    justString: 'text'
  },
  {
    entity1: '2',
    entity2: 4,
    year: 1991,
    justArray: 1,
    justNumber: 1,
    justString: 'text'
  },
  {
    entity1: '2',
    entity2: 4,
    year: 1991,
    justArray: 2,
    justNumber: 1,
    justString: 'text'
  },
  {
    entity1: '2',
    entity2: 4,
    year: 2012,
    justArray: 1,
    justNumber: 1,
    justString: 'text'
  },
  {
    entity1: '2',
    entity2: 4,
    year: 2012,
    justArray: 2,
    justNumber: 1,
    justString: 'text'
  },
  {
    entity1: 'other',
    entity2: 'unknown',
    year: 'text1',
    justArray: 1,
    justNumber: 1,
    justString: 'text'
  },
  {
    entity1: 'other',
    entity2: 'unknown',
    year: 'text1',
    justArray: 2,
    justNumber: 1,
    justString: 'text'
  },
  {
    entity1: 'other',
    entity2: 'unknown',
    year: 'text2',
    justArray: 1,
    justNumber: 1,
    justString: 'text'
  },
  {
    entity1: 'other',
    entity2: 'unknown',
    year: 'text2',
    justArray: 2,
    justNumber: 1,
    justString: 'text'
  }
]

describe('combo-wizard', () => {
  it('General example should be equal to the expected output', () => {
    expect(generalExample).toEqual(generalExample_expected)
  })
})
