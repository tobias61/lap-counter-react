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
  GraphQLSchema as Schema,
} from 'graphql';
import runnerList from './queries/runnerList';
import runner from './queries/runner';
import news from './queries/news';
import me from './queries/me';
import createRunner from './mutations/createRunner';
import sponsor from './queries/sponsor';
import sponsorList from './queries/sponsorList';
import createSponsor from './mutations/createSponsor';
import deleteRunner from './mutations/deleteRunner';
import deleteSponsor from './mutations/deleteSponsor';
import updateRunner from './mutations/updateRunner';
import updateSponsor from './mutations/updateSponsor';
import runnerLaps from './queries/runnerLaps';
import addLap from './mutations/addLap';
import checkNumber from './queries/checkNumber';
import createTeam from './mutations/createTeam';
import updateTeam from './mutations/updateTeam';
import deleteTeam from './mutations/deleteTeam';
import createPersonalRunner from './mutations/createPersonalRunner';
import updatePersonalRunner from './mutations/updatePersonalRunner';
import team from "./queries/team";
import teamList from "./queries/teamList";
import teamRunnerList from "./queries/teamRunnerList";
import addRunnersToTeam from "./mutations/addRunnersToTeam";
import removeRunnerFromTeam from "./mutations/removeRunnerFromTeam";
import teamSponsor from "./queries/teamSponsor";
import setTeamSponsor from "./mutations/setTeamSponsor";
import personalResults from "./queries/personalResults";
import teamResults from "./queries/teamResults";

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
      runnerLaps,
      checkNumber,
      teamRunnerList,
      teamSponsor,
      personalResults,
      teamResults,
    },
  }),
  mutation: new ObjectType({
    name: 'Mutation',
    fields: {
      createRunner,
      updateRunner,
      deleteRunner,
      createSponsor,
      deleteSponsor,
      updateSponsor,
      createTeam,
      updateTeam,
      deleteTeam,
      addLap,
      createPersonalRunner,
      updatePersonalRunner,
      addRunnersToTeam,
      removeRunnerFromTeam,
      setTeamSponsor,
    },
  }),
});

export default schema;
