/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLInputObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLFloat as FloatType,
  GraphQLNonNull,
} from 'graphql';

const CreateTeamInputType = new ObjectType({
  name: 'TeamInput',
  fields: {
    name: { type: new GraphQLNonNull(StringType) },
    sponsor_id: { type: StringType },
    sponsor_amount: { type: FloatType },
  },
});

export default CreateTeamInputType;
