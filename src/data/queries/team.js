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
  args: { id: { type: new NonNull(StringType) } },
  resolve() {
    return Team.findAndCountAll().then(result => ({
      total: result.count,
      runners: result.rows,
    }));
  },
};

export default team;
