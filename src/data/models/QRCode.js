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
import Runner from './Runner';

const QRCode = Model.define(
  'QRCode',
  {
    id: {
      type: DataType.Integer,
      defaultValue: DataType.UUIDV1,
      primaryKey: true,
      autoIncrement: true,
    },

    insert: {
      type: DataType.DATE,
      defaultValue: DataType.NOW,
    },

    runner_id: {
      type: DataType.UUID,

      references: {
        // This is a reference to another model
        model: Runner,

        // This is the column name of the referenced model
        key: 'id',
      },
    },
  },
  {},
);

export default QRCode;
