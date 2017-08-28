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
import CreateRunnerInputType, {RunnerInputFields} from "./CreateRunnerInputType";
import {CreateSponsorInputTypeFields} from "./CreateSponsorInputType";

const RunnerWithSponsorInput = new ObjectType({
  name: 'RunnerWithSponsorInput',
  fields: {
    ...RunnerInputFields,
    ...CreateSponsorInputTypeFields,
    name: { type: StringType },
  },
});

export default RunnerWithSponsorInput;
