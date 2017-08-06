/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import RunnerForm from "../../components/RunnerForm/RunnerForm";


function action() {
  return {
    chunks: ['runners-create'],
    title: 'Create Runner',
    component: (
      <Layout>
        <h2>Neuer Läufer</h2>
        <RunnerForm />
      </Layout>
    ),
  };
}
export default action;
