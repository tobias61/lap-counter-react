/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLInt } from 'graphql';
import TeamListType from '../types/TeamListType';
import sequelize from './../sequelize';

const results = {
  type: TeamListType,
  args: {
    min: { type: GraphQLInt },
    max: { type: GraphQLInt },
  },
  resolve(root, { min, max }) {
    const havingArr = [];
    if (min) {
      havingArr.push(`team_size >= ${min}`);
    }
    if (max) {
      havingArr.push(`team_size <= ${max}`);
    }

    const having = havingArr.length ? `HAVING ${havingArr.join(' and ')}` : '';

    return sequelize
      .query(
        `SELECT Team.*, count(Lap.id) as laps
FROM 
	(SELECT count(team_id) as team_size, Team.* FROM Team LEFT JOIN Runner ON Team.id = Runner.team_id GROUP BY team_id ) as Team 
	INNER JOIN Runner ON Team.id = Runner.team_id 
	INNER JOIN Lap on Runner.id = Lap.runner_id 
GROUP BY team_id
${having}
ORDER BY -laps`,
      )
      .then(results => ({
        teams: results[0].map(row => row),
      }));
  },
};

export default results;
