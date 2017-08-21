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
import { message, Button, Form, Input, Select, InputNumber } from 'antd';
import { graphql, compose } from 'react-apollo';
import getRunner from './getRunner.graphql';
import createRunner from './createRunner.graphql';
import updateRunner from './updateRunner.graphql';
import runnersQuery from './../RunnersTable/runnersList.graphql';
import history from '../../history';
import * as numeral from 'numeral';

const FormItem = Form.Item;
const Option = Select.Option;

class RunnerForm extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    getRunner: PropTypes.object.isRequired,
    form: PropTypes.object,
    createRunnerMutation: PropTypes.func.isRequired,
  };

  static defaultProps = {
    id: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      runner: {},
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props
          .createRunnerMutation({
            refetchQueries: [{ query: runnersQuery }],
            variables: { runnerInput: values },
          })
          .then(res => {
            console.log(res);
            // message.success(
            //   this.props.id
            //     ? 'Läufer wurde aktualisiert'
            //     : 'Läufer wurde erstellt',
            // );
            history.push('/runners');
          });
      }
    });
  };

  componentDidMount() {
    console.log(this.props);
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };

    return (
      <Form style={{ padding: 10 }} onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label={<span>Anrede</span>} hasFeedback>
          {getFieldDecorator('gender', {
            initialValue: 'weiblich',
            rules: [
              {
                required: true,
                message: '',
                whitespace: true,
              },
            ],
          })(
            <Select>
              <Option value="weiblich">Frau</Option>
              <Option value="männlich">Herr</Option>
            </Select>,
          )}
        </FormItem>

        <FormItem {...formItemLayout} label={<span>Vorname</span>} hasFeedback>
          {getFieldDecorator('firstName', {
            rules: [
              {
                required: true,
                message: 'Vorname eintragen',
                whitespace: true,
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label={<span>Nachname</span>} hasFeedback>
          {getFieldDecorator('lastName', {
            rules: [
              {
                required: true,
                message: 'Nachname eintragen',
                whitespace: true,
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="E-mail" hasFeedback>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'Keine gültige E-mail Adresse!',
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<span>Team / Sponsor</span>}
          hasFeedback
          extra={
            this.props.getRunner.runner.sponsor
              ? <a href={`/sponsors/${this.props.getRunner.runner.sponsor.id}`}>
                  Sponsor bearbeiten
                </a>
              : <a href={`/sponsors/create`}>
                Sponsor erstellen
              </a>
          }
        >
          {getFieldDecorator('sponsor_id', {
            rules: [],
          })(
            <Select
              showSearch
              placeholder="Team wählen"
              optionFilterProp="children"
              filterOption={(input, option) => {
               return option.props.children.join(' ')
                 .toLowerCase()
                 .indexOf(input.toLowerCase()) >= 0
              }}
            >
              {this.props.getRunner.sponsorList.sponsors.map(sponsor =>
                <Option key={sponsor.id} value={sponsor.id}>
                  {sponsor.name} ({sponsor.email})
                </Option>,
              )}
            </Select>,
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Speichern
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedRunnerForm = Form.create({
  mapPropsToFields: props => {
    if (!props.getRunner.runner) return {};

    return {
      gender: {
        value: props.getRunner.runner.gender,
      },
      firstName: {
        value: props.getRunner.runner.firstName,
      },
      lastName: {
        value: props.getRunner.runner.lastName,
      },
      email: {
        value: props.getRunner.runner.email,
      },
      sponsor_id: {
        value: props.getRunner.runner.sponsor.id,
      },
    };
  },
})(RunnerForm);

export default compose(
  graphql(getRunner, {
    name: 'getRunner',
    options: props => ({
      variables: { id: props.id },
    }),
  }),
  graphql(createRunner, {
    name: 'createRunnerMutation',
  }),
  graphql(updateRunner, { name: 'updateRunnerMutation' }),
)(WrappedRunnerForm);
