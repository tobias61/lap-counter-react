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
import { compose, graphql } from 'react-apollo';
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class RunnerForm extends React.Component {
  static propTypes = {
    id: PropTypes.string,
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
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
      <Form onSubmit={this.handleSubmit}>
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

export default WrappedRunnerForm;
