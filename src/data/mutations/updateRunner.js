/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import CreateRunnerInputType from '../types/CreateRunnerInputType';
import RunnerType from '../types/RunnerType';
import Runner from '../models/Runner';
import { GraphQLID, GraphQLNonNull } from 'graphql';

const createRunner = {
  type: RunnerType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    runner: { type: new GraphQLNonNull(CreateRunnerInputType) },
  },
  resolve(root, { id, runner }) {
    return Runner.findById(id).then(res => res.update(runner));
  },
};

export default createRunner;
