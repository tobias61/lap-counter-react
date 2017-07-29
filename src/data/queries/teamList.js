/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import TeamListType from '../types/TeamListType';
import Team from '../models/Team';

const teamList = {
  type: TeamListType,
  resolve() {
    return Team.findAndCountAll().then(result => {
      return {
        total: result.count,
        runners: result.rows,
      };
    });
  },
};

export default teamList;
