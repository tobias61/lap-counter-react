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
  GraphQLInt as IntegerType,
  GraphQLNonNull,
} from 'graphql';

const AddLapInput = new ObjectType({
  name: 'AddLapInput',
  fields: {
    code: { type: new GraphQLNonNull(IntegerType) },
  },
});

export default AddLapInput;
