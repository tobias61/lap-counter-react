/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Runner from '../models/Runner';
import { GraphQLString } from 'graphql';
import SuccessType from '../types/SuccessType';

const deleteRunner = {
  type: SuccessType,
  args: { id: { type: GraphQLString } },
  resolve(root, { id }) {
    return Runner.destroy({
      where: {
        id,
      },
    }).then(affectedRows => ({ success: true, message: affectedRows }));
  },
};

export default deleteRunner;
