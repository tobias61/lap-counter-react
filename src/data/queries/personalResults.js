/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLInt } from 'graphql';
import RunnerListType from '../types/RunnerListType';
import sequelize from './../sequelize';

const results = {
  type: RunnerListType,
  args: {
    minAge: { type: GraphQLInt },
    maxAge: { type: GraphQLInt },
  },
  resolve(root, { minAge, maxAge }) {
    return sequelize
      .query(
        `SELECT 
        Runner.id as id, 
        COUNT(Runner.id) as laps, 
        cast(strftime('%Y.%m%d', 'now') - strftime('%Y.%m%d', datetime(birthday, 'localtime')) as int) as age,  
        datetime(birthday, 'localtime') as birthdate, 
        firstName, 
        lastName, 
        Runner.email as email,
        gender,
        number,
        
        Runner.sponsor_amount as sponsor_amount,
        Sponsor.id as sponsor_id,
        Sponsor.email as sponsor_email, 
        Sponsor.name as sponsor_name, 
        Sponsor.contact_firstName as sponsor_contact_firstName, 
        Sponsor.contact_lastName as sponsor_contact_lastName,
        Sponsor.sponsor_amount as sponsor_sponsor_amount,
        Sponsor.donation_receipt as sponsor_donation_receipt
FROM Runner LEFT JOIN Lap ON Runner.id = Lap.runner_id INNER JOIN Sponsor ON Runner.sponsor_id = Sponsor.id 
WHERE age >= ${minAge} and age <= ${maxAge}
GROUP BY Runner.id
ORDER BY -Laps`,
      )
      .then(results => {
        return {
          runners: results[0].map(row => {
            const runner = Object.keys(row)
              .filter(key => !key.includes('sponsor_'))
              .reduce((res, cur) => {
                res[cur] = row[cur];
                return res;
              }, {});
            const sponsor = Object.keys(row)
              .filter(key => key.includes('sponsor_'))
              .reduce((res, cur) => {
                res[cur.replace('sponsor_', '')] = row[cur];
                return res;
              }, {});
            console.log(sponsor);
            return {
              ...runner,
              sponsor_id: sponsor.id,
              sponsor: {
                ...sponsor,
                sponsor_amount: row.sponsor_sponsor_amount
              },
            };
          }),
        };
      });
  },
};

export default results;
