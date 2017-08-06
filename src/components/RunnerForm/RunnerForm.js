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
import createRunner from './createRunner.graphql';
import runnersQuery from './../RunnersTable/runnersList.graphql';
import history from '../../history';
import * as numeral from 'numeral';

const FormItem = Form.Item;
const Option = Select.Option;

class RunnerForm extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    runner: PropTypes.object,
    form: PropTypes.object,
    createRunnerMutation: PropTypes.func.isRequired,
  };

  static defaultProps = {
    id: null,
    runner: {},
  };

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
            initialValue: 'frau',
            rules: [
              {
                required: true,
                message: '',
                whitespace: true,
              },
            ],
          })(
            <Select>
              <Option value="frau">Frau</Option>
              <Option value="herr">Herr</Option>
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
              {
                required: true,
                message: 'E-Mail Adresse eintragen!',
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label={<span>Spendenbetrag / Runde</span>} hasFeedback>
          {getFieldDecorator('sponsor_amount', {
            rules: [
              {
                pattern: /(?:^\d{1,3}(?:\.?\d{3})*(?:,\d{2})?$)|(?:^\d{1,3}(?:,?\d{3})*(?:\.\d{2})?$)/g,
                message: 'Betrag ungültig',
              },
            ],
          })(<Input />)}
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

const WrappedRunnerForm = Form.create()(RunnerForm);

export default compose(graphql(createRunner, { name: 'createRunnerMutation' }))(
  WrappedRunnerForm,
);
