const helpers = require('../../server/helpers');
const assert = require('assert');

describe('helpers', () => {
  describe('unzipTuples', () => {
    it('should work', () => {
      const mockValues = {
        id: 1,
        time_start: '2017-10-01 10:00:00 UTC',
      };
      const result = helpers.unzipTuples(mockValues);
      assert.equal(typeof result, 'object');
      for (let i = 0; i < result.keys.length; i += 1) {
        assert.equal(mockValues[result.keys[i]], result.values[i]);
      }
    });
  });

  describe('makePredicates', () => {
    it('should work', () => {
      const mockPreds = {
        id: 1,
        coach_id: 2,
      };

      const result = helpers.makePredicates(mockPreds);
      assert.equal(result, 'id = 1, coach_id = 2');
    });
  });

  describe('expandWhereClause', () => {
    it('should expand key value pairs in an object', () => {
      const mockPreds = {
        id: 1,
        coach_id: 2,
      };

      const result = helpers.expandWhereClause(mockPreds);
      assert.equal(result, 'id = 1 AND coach_id = 2');
    });
    it('should exclude falsy values', () => {
      const mockPreds = {
        id: 1,
        coach_id: 2,
        randomValue1: undefined,
        randomValue2: null,
        falseValue: false,
        zeroValue: 0,
      };

      const result = helpers.expandWhereClause(mockPreds);
      const expect = 'id = 1 AND coach_id = 2 AND falseValue = false AND zeroValue = 0';
      assert.equal(result, expect);
    });
  });

  describe('expandColumns', () => {
    it('should take keys from an object and serialize them', () => {
      const mockCols = {
        id: true,
        pioneer_id: true,
        coach_id: true,
        time_start: true,
      };
      const result = helpers.expandColumns(mockCols);
      assert.equal(result, 'id, pioneer_id, coach_id, time_start');
      
      const result2 = helpers.expandColumns([]);
      assert.equal(result2, '*');
      
      const result3 = helpers.expandColumns();
      assert.equal(result3, '*');
    });
    it('should exclude falsy values', () => {
      const mockCols = {
        id: true,
        pioneer_id: true,
        coach_id: true,
        time_start: false,
        exclude: false,
      };
      const result = helpers.expandColumns(mockCols);
      assert.equal(result, 'id, pioneer_id, coach_id');
    });
    it('should interpret no/unusable arg into *', () => {
      const result1 = helpers.expandColumns({});
      assert.equal(result1, '*');
      
      const result2 = helpers.expandColumns();
      assert.equal(result2, '*');

      const result3 = helpers.expandColumns([]);
      assert.equal(result3, '*');
    });
  });
});

