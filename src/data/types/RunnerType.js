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
import SponsorType from './SponsorType';
import Sponsor from '../models/Sponsor';

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
    gender: {
      type: StringType,
      resolve: res => res.gender,
    },
    email: {
      type: StringType,
      resolve: res => res.email,
    },
    sponsor_amount: {
      type: FloatType,
      resolve: res => res.sponsor_amount,
    },
    sponsor: {
      type: SponsorType,
      resolve: res => Sponsor.findById(res.sponsor_id),
    },
  },
});

export default RunnerType;
