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

const createTeam = {
  type: TeamType,
  args: { team: { type: CreateTeamInputType } },
  resolve(root, { team }) {
    return Team.create(team);
  },
};

export default createTeam;
