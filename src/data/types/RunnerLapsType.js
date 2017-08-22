/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLFloat as FloatType,
  GraphQLInt as IntegerType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import RunnerType from './RunnerType';
import Runner from '../models/Runner';
import Lap from '../models/Lap';

const RunnerLapsType = new ObjectType({
  name: 'RunnerLaps',
  fields: {
    count: {
      type: IntegerType,
      resolve: res => Lap.count({ where: { runner_id: res.runner_id } }),
    },
    runner: {
      type: RunnerType,
      resolve: res => Runner.findById(res.runner_id),
    },
  },
});

export default RunnerLapsType;
