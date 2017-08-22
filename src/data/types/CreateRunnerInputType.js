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
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLFloat as FloatType,
  GraphQLInt as IntegerType,
  GraphQLNonNull,
} from 'graphql';

const CreateRunnerInputType = new ObjectType({
  name: 'RunnerInput',
  fields: {
    gender: { type: new GraphQLNonNull(StringType) },
    firstName: { type: new GraphQLNonNull(StringType) },
    lastName: { type: new GraphQLNonNull(StringType) },
    email: { type: StringType },
    number: { type: IntegerType },
    sponsor_id: { type: ID },
  },
});

export default CreateRunnerInputType;
