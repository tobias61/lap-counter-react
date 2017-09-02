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
  GraphQLInt as IntegerType,
  GraphQLBoolean as BooleanType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import SponsorType from './SponsorType';
import Sponsor from './../models/Sponsor';
import sequelize from './../sequelize';
import Lap from '../models/Lap';
import Runner from '../models/Runner';

const TeamType = new ObjectType({
  name: 'Team',
  fields: {
    id: {
      type: new NonNull(ID),
      resolve: res => res.id,
    },
    name: {
      type: StringType,
      resolve: res => res.name,
    },
    sponsor: {
      type: SponsorType,
      resolve: res => Sponsor.findById(res.sponsor_id),
    },
    isSchool: {
      type: BooleanType,
      resolve: res => res.isSchool,
    },
    laps: {
      type: IntegerType,
      resolve: res => {
        if (res.laps) {
          return res.laps;
        }
        return sequelize
          .query(
            `SELECT count(*) as count FROM Lap LEFT JOIN Runner ON Lap.runner_id = Runner.id WHERE Runner.team_id = '${res.id}'`,
          )
          .then(results => {
            if (results.length && results[0].length) {
              return results[0][0].count;
            }
            return null;
          });
      },
    },
    team_size: {
      type: IntegerType,
      resolve: res => {
        if (res.team_size) {
          return res.team_size;
        }
        return Runner.count({ where: { team_id: res.id } });
      },
    },
  },
});

export default TeamType;
