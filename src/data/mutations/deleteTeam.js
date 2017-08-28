/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Team from '../models/Team';
import { GraphQLID, GraphQLNonNull } from 'graphql';
import SuccessType from '../types/SuccessType';

const deleteTeam = {
  type: SuccessType,
  args: { id: { type: new GraphQLNonNull(GraphQLID) } },
  resolve(root, { id }) {
    return Team.destroy({
      where: {
        id,
      },
    }).then(affectedRows => ({ success: true, message: affectedRows }));
  },
};

export default deleteTeam;
