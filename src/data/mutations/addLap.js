/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import RunnerLapsType from '../types/RunnerLapsType';
import {
  GraphQLString as StringType,
  GraphQLInt as IntegerType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import Lap from '../models/Lap';
import Runner from '../models/Runner';

const addLap = {
  type: RunnerLapsType,
  args: { number: { type: new NonNull(IntegerType) } },
  resolve(root, { number }) {
    return Runner.findOne({ where: { number } }).then(res => {
      if (res) {
        return Lap.create({
          runner_id: res.id,
        });
      }
      return new Error('Kein Läufer gefunden');
    });
  },
};

export default addLap;
