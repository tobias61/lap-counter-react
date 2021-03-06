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
  GraphQLFloat as FloatType,
  GraphQLBoolean as BooleanType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const SponsorType = new ObjectType({
  name: 'Sponsor',
  fields: {
    id: {
      type: new NonNull(ID),
      resolve: res => res.id,
    },
    name: {
      type: StringType,
      resolve: res => res.name,
    },
    email: {
      type: StringType,
      resolve: res => res.email,
    },
    contact_firstName: {
      type: StringType,
      resolve: res => res.contact_firstName,
    },
    contact_lastName: {
      type: StringType,
      resolve: res => res.contact_lastName,
    },
    contact_address: {
      type: StringType,
      resolve: res => res.contact_address,
    },
    sponsor_amount: {
      type: StringType,
      resolve: res => res.sponsor_amount,
    },
    personal: {
      type: BooleanType,
      resolve: res => res.personal,
    },

    cash: {
      type: BooleanType,
      resolve: res => res.cash,
    },

    donation_receipt: {
      type: BooleanType,
      resolve: res => res.donation_receipt,
    },

		fiftyFifty: {
			type: BooleanType,
			resolve: res => res.fiftyFifty,
		},
  },
});

export default SponsorType;
