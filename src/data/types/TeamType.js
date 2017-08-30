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
  GraphQLNonNull as NonNull,
} from 'graphql';
import SponsorType from './SponsorType';
import Sponsor from './../models/Sponsor';

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
  },
});

export default TeamType;
