/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLInt as IntType,
  GraphQLList as ListType,
  GraphQLObjectType as ObjectType,
} from 'graphql';
import SponsorType from './SponsorType';

const SponsorListType = new ObjectType({
  name: 'SponsorList',
  fields: {
    total: { type: IntType },
    sponsors: {
      type: new ListType(SponsorType),
    },
  },
});

export default SponsorListType;
