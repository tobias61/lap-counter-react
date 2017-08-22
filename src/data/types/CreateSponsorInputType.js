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
  GraphQLBoolean as BooleanType,
  GraphQLNonNull,
} from 'graphql';

const CreateSponsorInputType = new ObjectType({
  name: 'SponsorInput',
  fields: {
    email: { type: StringType },
    name: { type: new GraphQLNonNull(StringType) },
    contact_firstName: { type: StringType },
    contact_lastName: { type: StringType },
    sponsor_amount: { type: StringType },
    private: { type: BooleanType },
    cash: { type: BooleanType },
    donation_receipt: { type: BooleanType },
  },
});

export default CreateSponsorInputType;
