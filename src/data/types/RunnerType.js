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
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLFloat as FloatType,
  GraphQLList as ListType,
  GraphQLInt as IntegerType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import SponsorType from './SponsorType';
import Sponsor from '../models/Sponsor';
import LapTimeType from './LapTimeType';
import Lap from '../models/Lap';
import * as moment from 'moment';
import * as _ from 'lodash';

const RunnerType = new ObjectType({
  name: 'Runner',
  fields: {
    id: {
      type: new NonNull(ID),
      resolve: res => res.id,
    },
    firstName: {
      type: StringType,
      resolve: res => res.firstName,
    },
    lastName: {
      type: StringType,
      resolve: res => res.lastName,
    },
    birthday: {
      type: StringType,
      resolve: res => res.birthday,
    },
    age: {
      type: IntegerType,
      resolve: res =>
        Math.floor(
          moment(new Date()).diff(moment(res.birthday), 'years', true),
        ),
    },
    gender: {
      type: StringType,
      resolve: res => res.gender,
    },
    email: {
      type: StringType,
      resolve: res => res.email,
    },
    sponsor_amount: {
      type: StringType,
      resolve: res => res.sponsor_amount,
    },
    laps: {
      type: IntegerType,
      resolve: res => {
        if (res.laps) {
          return res.laps;
        }
        return Lap.count({ where: { runner_id: res.id } }).then(count => count);
      },
    },
    sponsor: {
      type: SponsorType,
      resolve: res => {
        if (res.sponsor) {
          return res.sponsor;
        }
        return Sponsor.findById(res.sponsor_id);
      },
    },
    number: {
      type: IntegerType,
      resolve: res => res.number,
    },
    lapTimes: {
      type: new ListType(LapTimeType),
      resolve: (res)=>{
          return Lap.findAll({ where: { runner_id: res.id }, order:[['insert', 'ASC']],}).then(list => {
            const times = list.map((lap, index)=>{
              if (index < list.length-1){
                return {
                  index: index+1,
                  time: moment(list[index+1].insert).diff(moment(lap.insert))
                }
              }else {
                return null;
              }
            }).filter(item => item && item.time !== 0);

            return times;
            // const sorted = _.sortBy(times, 'time');
            // console.log(sorted);
            // return _.first(sorted).time;
          })
      },
    }
  },
});

export default RunnerType;
