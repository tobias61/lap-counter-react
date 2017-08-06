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
import { message, Button, Table } from 'antd';
import { graphql, compose } from 'react-apollo';
import runnersQuery from './runnersList.graphql';
import deleteRunner from './../RunnerForm/deleteRunner.graphql';
import history from '../../history';
import Link from '../Link/Link';

class RunnersTable extends React.Component {
  static propTypes = {
    deleteRunnerMutation: PropTypes.func,
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      runnerList: PropTypes.shape({
        total: PropTypes.number,
        runners: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
            email: PropTypes.string,
          }),
        ),
      }),
    }).isRequired,
  };

  onDeleteClick(record) {
    this.props
      .deleteRunnerMutation({
        refetchQueries: [{ query: runnersQuery }],
        variables: { id: record.key },
      })
      .then(res => {
        // console.log(res);
        message.success(
          `${record.firstName} ${record.lastName} wurde gelöscht`,
        );
      });
  }

  render() {
    if (!this.props.data.runnerList) {
      return <div />;
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
      {
        title: '',
        key: 'action',
        render: (text, record) =>
          <span>
            <Link
              onClick={() => {
                this.onDeleteClick(record);
              }}
            >
              Entfernen
            </Link>
          </span>,
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

          <div style={{ float: 'right' }}>
            <Button
              onClick={() => {
                history.push('/import');
              }}
            >
              Import
            </Button>
          </div>
        </div>

        <Table dataSource={dataSource} columns={columns} />
      </div>
    );
  }
}
export default compose(
  graphql(runnersQuery),
  graphql(deleteRunner, { name: 'deleteRunnerMutation' }),
)(RunnersTable);
