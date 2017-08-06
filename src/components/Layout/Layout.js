/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import s from './Layout.css';
import Header from '../Header';
import Feedback from '../Feedback';
import AppFooter from '../Footer';
import { Layout } from 'antd';

const { Content, Footer } = Layout;

class AppLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <Layout>
        <Header />
        <Content
          style={{ padding: '0 50px', marginTop: 64, minHeight: '100%' }}
        >
          <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
            {this.props.children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Toni Möckel ©2017</Footer>
      </Layout>
    );
  }
}

export default withStyles(normalizeCss, s)(AppLayout);
