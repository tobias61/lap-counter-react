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
import CreateSponsorInputType from '../types/CreateSponsorInputType';

const createSponsor = {
  type: SponsorType,
  args: { sponsor: { type: CreateSponsorInputType } },
  resolve(root, { sponsor }) {
    sponsor.personal = false;
    return Sponsor.create(sponsor);
  },
};

export default createSponsor;
