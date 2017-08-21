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
import SponsorForm from '../../components/SponsorForm/SponsorForm';

function action() {
  return {
    chunks: ['sponsor-create'],
    title: 'Create Sponsor',
    component: (
      <Layout>
        <h2>Neuer Sponsor</h2>
        <SponsorForm />
      </Layout>
    ),
  };
}
export default action;
