/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import RunnerType from '../types/RunnerType';
import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import Runner from '../models/Runner';

const runner = {
  type: RunnerType,
  args: { id: { type: StringType } },
  resolve(root, { id }) {
    return Runner.findById(id);
  },
};

export default runner;
