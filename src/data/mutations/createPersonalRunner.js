/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import CreateRunnerInputType, {RunnerInputFields} from '../types/CreateRunnerInputType';
import RunnerType from '../types/RunnerType';
import Runner from '../models/Runner';
import CreatePersonalRunnerInputType from "../types/CreatePersonalRunnerInputType";
import Sponsor from "../models/Sponsor";
import {CreateSponsorInputTypeFields} from "../types/CreateSponsorInputType";

const createPersonalRunner = {
  type: RunnerType,
  args: { runner: { type: CreatePersonalRunnerInputType } },
  resolve(root, { runner }) {
    const reducer = (res, cur)=>{
			res[cur] = runner[cur];
			return res;
		};
    let runnerValues = Object.keys(RunnerInputFields).reduce(reducer,{});
		let sponsorValues = Object.keys(CreateSponsorInputTypeFields).reduce(reducer,{});
    return Sponsor.create(sponsorValues).then(res => {
			return Runner.create({...runnerValues, sponsor_id: res.id});
    });

  },
};

export default createPersonalRunner;
