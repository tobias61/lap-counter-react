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
import { GraphQLID, GraphQLNonNull } from 'graphql';

const teamRunnerList = {
  type: RunnerListType,
  args: {
    team_id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve(root, { team_id }) {
    return Runner.findAndCountAll({
      where: { team_id },
    }).then(result => ({
      total: result.count,
      runners: result.rows,
    }));
  },
};

export default teamRunnerList;
