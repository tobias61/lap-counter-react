/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {GraphQLID, GraphQLList, GraphQLNonNull as NonNull,} from 'graphql';
import Runner from '../models/Runner';
import SuccessType from '../types/SuccessType';

const addRunnersToTeam = {
  type: SuccessType,
  args: {
    team_id: { type: new NonNull(GraphQLID) },
    runner_ids: { type: new GraphQLList(new NonNull(GraphQLID)) },
  },
  resolve(root, { team_id, runner_ids }) {
    return Runner.update(
      { team_id },
      { where: { id: runner_ids } },
    ).then((affectedCount, affectedRows) => ({
      success: true,
      message: 'Runners updated',
    }));
  },
};

export default addRunnersToTeam;
