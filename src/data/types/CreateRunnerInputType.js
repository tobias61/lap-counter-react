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
  GraphQLNonNull,
} from 'graphql';

const CreateRunnerInputType = new ObjectType({
  name: 'RunnerInput',
  fields: {
    firstName: { type: new GraphQLNonNull(StringType) },
    lastName: { type: new GraphQLNonNull(StringType) },
    email: { type: new GraphQLNonNull(StringType) },
  },
});

export default CreateRunnerInputType;
