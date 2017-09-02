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


const LapTimeType = new ObjectType({
  name: 'LapTime',
  fields: {
    index: {
      type: new NonNull(IntegerType),
      resolve: res => res.index,
    },
    time: {
      type: IntegerType,
      resolve: res => res.time,
    }
  },
});

export default LapTimeType;
