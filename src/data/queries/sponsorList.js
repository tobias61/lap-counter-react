/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import SponsorListType from '../types/SponsorListType';
import Sponsor from '../models/Sponsor';

const sponsorList = {
  type: SponsorListType,
  resolve() {
    return Sponsor.findAndCountAll().then(result => ({
      total: result.count,
      sponsors: result.rows,
    }));
  },
};

export default sponsorList;
