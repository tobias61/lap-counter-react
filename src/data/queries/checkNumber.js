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
import { GraphQLInt, GraphQLNonNull as NonNull } from 'graphql';

const checkNumber = {
  type: CheckNumberType,
  args: { number: { type: new NonNull(GraphQLInt) } },
  resolve(root, { number }) {
    return Runner.count({ where: { number } }).then(c => ({
      available: c === 0,
    }));
  },
};

export default checkNumber;
