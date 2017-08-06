/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLFloat as FloatType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import TeamType from './TeamType';
import Team from '../models/Team';

const RunnerType = new ObjectType({
  name: 'Runner',
  fields: {
    id: {
      type: new NonNull(ID),
      resolve: res => res.id,
    },
    firstName: {
      type: StringType,
      resolve: res => res.firstName,
    },
    lastName: {
      type: StringType,
      resolve: res => res.lastName,
    },
    email: {
      type: StringType,
      resolve: res => res.email,
    },
    sponsor_amount: {
      type: FloatType,
      resolve: res => res.sponsor_amount,
    },
    team: {
      type: TeamType,
      resolve: res => Team.findById(res.team_id),
    },
  },
});

export default RunnerType;
