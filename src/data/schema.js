/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';
import runnerList from './queries/runnerList';
import runner from './queries/runner';
import news from './queries/news';
import me from './queries/me';
import createRunner from './mutations/createRunner';
import sponsor from './queries/sponsor';
import sponsorList from './queries/sponsorList';
import team from './queries/team';
import teamList from './queries/teamList';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      news,
      me,
      runnerList,
      runner,
      sponsor,
      sponsorList,
      team,
      teamList,
    },
  }),
  mutation: new ObjectType({
    name: 'Mutation',
    fields: {
      createRunner,
    },
  }),
});

export default schema;
