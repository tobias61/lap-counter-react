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

function action(options) {
  return {
    chunks: ['sponsor-update'],
    title: 'Update Sponsor',
    component: (
      <Layout>
        <h2>Sponsor Details</h2>
        <SponsorForm id={options.params.id} />
      </Layout>
    ),
  };
}
export default action;
