/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLInt, GraphQLString } from 'graphql';
import RunnerListType from '../types/RunnerListType';
import sequelize from './../sequelize';

const results = {
  type: RunnerListType,
  args: {
    sort: { type: GraphQLString },

  },
  resolve(root, { sort }) {
    const orderBy = sort || '-birthday';
    return sequelize
      .query(
        `SELECT
        Runner.*,
        COUNT(Runner.id) as laps,
        cast(strftime('%Y.%m%d', 'now') - strftime('%Y.%m%d', datetime(birthday, 'localtime')) as int) as age,
        datetime(birthday, 'localtime') as birthday
FROM Lap LEFT JOIN Runner ON Lap.runner_id = Runner.id
GROUP BY Runner.id
ORDER BY ${orderBy}`,
      )
      .then(results => {
        return {
          runners: results[0].map(row => {
            const runner = Object.keys(row)
              .filter(key => !key.includes('sponsor_'))
              .reduce((res, cur) => {
                res[cur] = row[cur];
                return res;
              }, {});
            return {
              ...runner,
            };
          }),
        };
      });
  },
};

export default results;
