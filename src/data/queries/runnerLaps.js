/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import RunnerLapsType from '../types/RunnerLapsType';
import Runner from '../models/Runner';
import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const runnerLaps = {
  type: RunnerLapsType,
  args: { id: { type: new NonNull(StringType) } },
  resolve(root, { id }) {
    return {
      runner_id: id,
    };
  },
};

export default runnerLaps;
