/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLBoolean, GraphQLObjectType as ObjectType } from 'graphql';

const CheckNumberType = new ObjectType({
  name: 'CheckNumberType',
  fields: {
    available: { type: GraphQLBoolean },
  },
});

export default CheckNumberType;
