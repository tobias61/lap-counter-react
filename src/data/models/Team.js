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
import Sponsor from "./Sponsor";

const Team = Model.define('Team', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  name: {
    type: DataType.STRING(255),
  },

  sponsor_amount: {
    type: DataType.STRING,
  },

  insert: {
    type: DataType.DATE,
    defaultValue: DataType.NOW,
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
});

export default Team;
