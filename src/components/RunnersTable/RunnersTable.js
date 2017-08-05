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
import { Button, Table } from 'antd';
import { graphql, compose } from 'react-apollo';
import runnersQuery from './runnersList.graphql';
import history from '../../history';

class RunnersTable extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      runnerList: PropTypes.shape({
        total: PropTypes.number,
        runners: PropTypes.arrayOf(
          PropTypes.shape({
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
            email: PropTypes.string,
          }),
        ),
      }),
    }).isRequired,
  };

  render() {
    if (!this.props.data.runnerList){
      return <div></div>
    }
    const dataSource = this.props.data.runnerList.runners.map(item => ({
      key: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
    }));

    const columns = [
      {
        title: 'Vorname',
        dataIndex: 'firstName',
        key: 'firstName',
      },
      {
        title: 'Nachname',
        dataIndex: 'lastName',
        key: 'lastName',
      },
      {
        title: 'E-Mail',
        dataIndex: 'email',
        key: 'email',
      },
    ];

    return (
      <div>
        <div style={{ padding: 10 }}>
          <Button
            type="primary"
            onClick={() => {
              history.push('/runners/create');
            }}
          >
            Neu
          </Button>
        </div>

        <Table dataSource={dataSource} columns={columns} />
      </div>
    );
  }
}
export default compose(graphql(runnersQuery))(RunnersTable);
