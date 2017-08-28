/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import TeamType from '../types/TeamType';
import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import Team from './../models/Team';

const team = {
  type: TeamType,
  args: { id: { type: StringType } },
  resolve(root, { id }) {
    return Team.findById(id);
  },
};

export default team;
