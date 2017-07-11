const helpers = require('../helpers');
const assert = require('assert');

describe('helpers', () => {
  describe('coachAndPioneerMatch', () => {
    it('should work', () => {
      const mockPioneer = {
        id: 123,
        coach_id: 2,
      };
      const result = helpers.coachAndPioneerMatch(123)(2)(mockPioneer);
      assert.equal(true, result);

      const mockPioneer2 = {
        id: 123,
        coach_id: 1,
      };
      const result2 = helpers.coachAndPioneerMatch(1234)(2)(mockPioneer2);
      assert.equal(false, result2);
    });
  });

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
    it('should work', () => {
      const mockPreds = {
        id: 1,
        coach_id: 2,
      };

      const result = helpers.expandWhereClause(mockPreds);
      assert.equal(result, 'id = 1 AND coach_id = 2');
    });
  });

  describe('expandColumns', () => {
    it('should work', () => {
      const mockCols = ['id', 'pioneer_id', 'coach_id', 'time_start'];
      const result = helpers.expandColumns(mockCols);
      assert.equal(result, 'id, pioneer_id, coach_id, time_start');
      const result2 = helpers.expandColumns([]);
      assert.equal(result2, '*');
      const result3 = helpers.expandColumns();
      assert.equal(result3, '*');
    });
  });

  describe('validateOptions', () => {
    it('should reject non-object, no action field, no table field', () => {
      const mocks = [
        null,
        undefined,
        'string',
        100,
        true,
        false,
        {},
        { action: 'aaa' },
        { table: 'bbb' },
      ];
      mocks.forEach((mock) => {
        assert.equal(false, helpers.validateQueryOptions(mock));
      });
    });

    it('should reject falsy values in where clauses', () => {
      const result = helpers.validateQueryOptions({
        action: 'select',
        table: 'pioneers',
        where: {
          coach_id: null,
        },
      });
      assert.equal(false, result);
    });

    it('should require values for INSERT', () => {
      const result = helpers.validateQueryOptions({
        action: 'insert',
        table: 'pioneers',
        values: {
          // empty
        },
      });
      assert.equal(false, result);

      const result2 = helpers.validateQueryOptions({
        action: 'insert',
        table: 'pioneers',
      });
      assert.equal(false, result2);

      const result3 = helpers.validateQueryOptions({
        action: 'insert',
        table: 'pioneers',
        values: {
          id: null
        }
      });
      assert.equal(false, result3);
    });

    it('should require where clause restriction for UPDATE', () => {
      const result = helpers.validateQueryOptions({
        action: 'update',
        table: 'pioneers',
        values: {
          name: 'Orion',
        },
      });
      assert.equal(false, result);

      const result1 = helpers.validateQueryOptions({
        action: 'update',
        table: 'pioneers',
        values: {
          name: 'Orion',
        },
        where: {
          // empty
        }
      });
      assert.equal(false, result1);
    });
  });
});

