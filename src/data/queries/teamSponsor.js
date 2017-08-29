/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Team from '../models/Team';
import Sponsor from '../models/Sponsor';
import { GraphQLID, GraphQLNonNull } from 'graphql';
import SponsorType from "../types/SponsorType";

const teamSponsor = {
  type: SponsorType,
  args: {
    team_id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve(root, { team_id }) {
    return Team.findById(team_id).then(result => Sponsor.findById(result.sponsor_id));
  },
};

export default teamSponsor;
