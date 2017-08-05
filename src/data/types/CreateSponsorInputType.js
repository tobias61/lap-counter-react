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

const CreateSponsorInputType = new ObjectType({
  name: 'SponsorInput',
  fields: {
    name: { type: new GraphQLNonNull(StringType) },
  },
});

export default CreateSponsorInputType;
