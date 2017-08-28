/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import CheckNumberType from '../types/CheckNumberType';
import Runner from './../models/Runner';
import { GraphQLInt, GraphQLNonNull as NonNull, GraphQLString } from 'graphql';

const checkNumber = {
  type: CheckNumberType,
  args: {
    number: { type: new NonNull(GraphQLInt) },
    runner_id: { type: GraphQLString },
  },
  resolve(root, { number, runner_id }) {
    return Runner.findOne({ where: { number } }).then(result => {
			return {
				available: !result || result.id === runner_id,
			}
    });
  },
};

export default checkNumber;
