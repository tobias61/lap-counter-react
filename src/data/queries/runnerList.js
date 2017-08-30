/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import RunnerListType from '../types/RunnerListType';
import Runner from '../models/Runner';
import { GraphQLString } from 'graphql';

const runnerList = {
  type: RunnerListType,
  args: {
    query: { type: GraphQLString },
  },
  resolve(root, { query }) {
    const resultCall = result => ({
      total: result.count,
      runners: result.rows,
    });
    if (query && query !== '') {
      return Runner.findAndCountAll({
        where: {
          sponsor_id: {
            $ne: null,
          },
          $or: [
            {
              firstName: { $like: `%${query}%` },
            },
            {
              lastName: { $like: `%${query}%` },
            },
            {
              email: { $like: `%${query}%` },
            },
          ],
        },
      }).then(resultCall);
    }
    return Runner.findAndCountAll({
      where: {
        sponsor_id: {
          $ne: null,
        },
      },
    }).then(resultCall);
  },
};

export default runnerList;
