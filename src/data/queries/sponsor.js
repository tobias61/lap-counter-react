/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import SponsorType from '../types/SponsorType';
import Sponsor from '../models/Sponsor';
import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const sponsor = {
  type: SponsorType,
  args: { id: { type: StringType } },
  resolve(root, { id }) {
    return Sponsor.findById(id);
  },
};

export default sponsor;
