/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import RunnerLapsType from '../types/RunnerLapsType';
import {
	GraphQLString as StringType,
	GraphQLInt as IntegerType,
	GraphQLNonNull as NonNull, GraphQLID,
} from 'graphql';
import Lap from '../models/Lap';
import Runner from '../models/Runner';
import TeamType from "../types/TeamType";

const removeRunnerFromTeam = {
  type: TeamType,
  args: {
    team_id: { type: new NonNull(GraphQLID) },
		runner_id: { type: new NonNull(GraphQLID) },
    },
  resolve(root, { team_id, runner_id }) {
    return Runner.findById(runner_id).then(res => res.update({team_id: null}));
  },
};

export default removeRunnerFromTeam;
