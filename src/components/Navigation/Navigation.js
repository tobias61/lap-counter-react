/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { Menu } from 'antd';

class Navigation extends React.Component {
  render() {
    return (
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['1']}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="1">Läufer</Menu.Item>
        <Menu.Item key="2">Teams</Menu.Item>
        <Menu.Item key="3">Sponsoren</Menu.Item>
      </Menu>
    );
  }
}

export default Navigation;
