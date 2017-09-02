/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import CreateRunnerInputType, {
  RunnerInputFields,
} from '../types/CreateRunnerInputType';
import RunnerType from '../types/RunnerType';
import Runner from '../models/Runner';
import CreatePersonalRunnerInputType from '../types/CreatePersonalRunnerInputType';
import Sponsor from '../models/Sponsor';
import { CreateSponsorInputTypeFields } from '../types/CreateSponsorInputType';
import { GraphQLID, GraphQLNonNull } from 'graphql';

const updatePersonalRunner = {
  type: RunnerType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    runner: { type: CreatePersonalRunnerInputType },
  },
  resolve(root, { runner, id }) {
    const reducer = (res, cur) => {
      res[cur] = runner[cur];
      return res;
    };
    const runnerValues = Object.keys(RunnerInputFields).reduce(reducer, {});
    const sponsorValues = Object.keys(
      CreateSponsorInputTypeFields,
    ).reduce(reducer, {
      personal: true,
    });
    if (sponsorValues.sponsor_email){
      sponsorValues.email = sponsorValues.sponsor_email;
      delete sponsorValues.sponsor_email;
    }
    return Runner.findById(id).then(foundRunner => {
      if (!foundRunner.sponsor_id) {
        return Sponsor.create(sponsorValues).then(res => {
          runnerValues.sponsor_id = res.id;
          return foundRunner.update({ ...runnerValues });
        });
      }
      return Sponsor.update(sponsorValues, {
        where: { id: foundRunner.sponsor_id },
      }).then(res => foundRunner.update({ ...runnerValues }));
    });
  },
};

export default updatePersonalRunner;
