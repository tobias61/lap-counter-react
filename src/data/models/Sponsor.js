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

const Sponsor = Model.define('Sponsor', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  email: {
    type: DataType.STRING(255),
    validate: { isEmail: true },
    unique: true,
  },

  name: {
    type: DataType.STRING(255),
  },

  contact_firstName: {
    type: DataType.STRING(255),
  },

  contact_lastName: {
    type: DataType.STRING(255),
  },

  sponsor_amount: {
    type: DataType.FLOAT,
  },

  private: {
    type: DataType.BOOLEAN,
  },

  cash: {
    type: DataType.BOOLEAN,
  },

  donation_receipt: {
    type: DataType.BOOLEAN,
  },

});

export default Sponsor;
