/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import CreateTeamInputType from '../types/CreateTeamInputType';
import TeamType from '../types/TeamType';
import Team from '../models/Team';
import { GraphQLID, GraphQLNonNull } from 'graphql';

const updateTeam = {
  type: TeamType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    team: { type: new GraphQLNonNull(CreateTeamInputType) },
  },
  resolve(root, { id, team }) {
    return Team.findById(id).then(res => res.update(team));
  },
};

export default updateTeam;
