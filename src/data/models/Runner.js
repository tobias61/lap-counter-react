/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import DataType from 'sequelize';
import Model from '../sequelize';
import Sponsor from './Sponsor';
import Team from './Team';

const Runner = Model.define(
  'Runner',
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV1,
      primaryKey: true,
    },

    firstName: {
      type: DataType.STRING(255),
    },

    lastName: {
      type: DataType.STRING(255),
    },

    gender: {
      type: DataType.STRING(50),
    },

    email: {
      type: DataType.STRING(255),
      validate: { isEmail: true }
    },

    insert: {
      type: DataType.DATE,
      defaultValue: DataType.NOW,
    },

    birthday: {
      type: DataType.DATE,
    },

    sponsor_amount: {
      type: DataType.STRING,
    },

    sponsor_name: {
      type: DataType.STRING(255),
    },

    sponsor_id: {
      type: DataType.UUID,

      references: {
        // This is a reference to another model
        model: Sponsor,

        // This is the column name of the referenced model
        key: 'id',

        // This declares when to check the foreign key constraint. PostgreSQL only.
        deferrable: DataType.Deferrable.INITIALLY_IMMEDIATE,
      },
    },

    team_id: {
      type: DataType.UUID,

      references: {
        // This is a reference to another model
        model: Team,

        // This is the column name of the referenced model
        key: 'id',

        // This declares when to check the foreign key constraint. PostgreSQL only.
        deferrable: DataType.Deferrable.INITIALLY_IMMEDIATE,
      },
    },

    number: {
      type: DataType.INTEGER,
      unique: true,
    },
  },
  {
    indexes: [{ fields: ['email'] }],
  },
);

export default Runner;
