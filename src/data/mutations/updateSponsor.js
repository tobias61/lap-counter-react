/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import CreateSponsorInputType from '../types/CreateSponsorInputType';
import SponsorType from '../types/SponsorType';
import Sponsor from '../models/Sponsor';
import { GraphQLID, GraphQLNonNull } from 'graphql';

const createSponsor = {
  type: SponsorType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    sponsor: { type: new GraphQLNonNull(CreateSponsorInputType) },
  },
  resolve(root, { id, sponsor }) {
    return Sponsor.findById(id).then(res => res.update(sponsor));
  },
};

export default createSponsor;
