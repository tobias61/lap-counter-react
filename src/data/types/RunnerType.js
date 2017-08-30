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
  GraphQLInt as IntegerType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import SponsorType from './SponsorType';
import Sponsor from '../models/Sponsor';
import Lap from '../models/Lap';

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
    birthday: {
      type: StringType,
      resolve: res => res.birthday,
    },
    gender: {
      type: StringType,
      resolve: res => res.gender,
    },
    email: {
      type: StringType,
      resolve: res => res.email,
    },
    sponsor_amount: {
      type: StringType,
      resolve: res => res.sponsor_amount,
    },
    laps: {
      type: IntegerType,
      resolve: res => {
        if (res.laps){
          return res.laps
        }
        return Lap.count({ where: { runner_id: res.id } }).then(( count )=>count);
      },
    },
    sponsor: {
      type: SponsorType,
      resolve: res => {
        if (res.sponsor) {
          return res.sponsor;
        }
        return Sponsor.findById(res.sponsor_id);
      },
    },
    number: {
      type: IntegerType,
      resolve: res => res.number,
    },
  },
});

export default RunnerType;
