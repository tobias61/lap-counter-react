/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Team from '../models/Team';
import {GraphQLID, GraphQLNonNull} from 'graphql';
import TeamType from "../types/TeamType";

const setTeamSponsor = {
  type: TeamType,
  args: {
    team_id: { type: new GraphQLNonNull(GraphQLID) },
    sponsor_id: { type: GraphQLID },
  },
  resolve(root, { team_id, sponsor_id }) {
    return Team.findById(team_id).then(res => res.update({sponsor_id}));
  },
};

export default setTeamSponsor;
