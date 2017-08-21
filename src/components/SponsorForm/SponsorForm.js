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
import { Button, Form, Input, Checkbox } from 'antd';
import { graphql, compose } from 'react-apollo';
import getSponsor from './getSponsor.graphql';
import createSponsor from './createSponsor.graphql';
import updateSponsor from './updateSponsor.graphql';
import sponsorsQuery from '../SponsorsTable/sponsorsList';
import history from '../../history';

const FormItem = Form.Item;

class SponsorForm extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    getSponsor: PropTypes.object.isRequired,
    form: PropTypes.object,
    createSponsorMutation: PropTypes.func,
    updateSponsorMutation: PropTypes.func,
  };

  static defaultProps = {
    id: null,
  };

  componentDidMount() {}

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props
          .createSponsorMutation({
            refetchQueries: [{ query: sponsorsQuery }],
            variables: { sponsorInput: values },
          })
          .then(res => {
            history.push('/sponsors');
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
        <FormItem {...formItemLayout} label={<span>Name</span>} hasFeedback>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: 'Name eintragen',
                whitespace: true,
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label={<span>Vorname</span>} hasFeedback>
          {getFieldDecorator('contact_firstName', {
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
          {getFieldDecorator('contact_lastName', {
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
          label={<span>Spendenbetrag / Runde</span>}
          hasFeedback
        >
          {getFieldDecorator('sponsor_amount', {
            rules: [
              {
                pattern: /(?:^\d{1,3}(?:\.?\d{3})*(?:,\d{2})?$)|(?:^\d{1,3}(?:,?\d{3})*(?:\.\d{2})?$)/g,
                message: 'Betrag ungültig',
              },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<span>Barzahlung?</span>}
          hasFeedback
        >
          {getFieldDecorator('cash', {
            rules: [],
          })(<Checkbox />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<span>Spendenbescheinigung?</span>}
          hasFeedback
        >
          {getFieldDecorator('donation_receipt', {
            rules: [],
          })(<Checkbox />)}
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

const WrappedSponsorForm = Form.create({
  mapPropsToFields: props => {
    if (!props.getSponsor.sponsor) return {};

    return {
      name: {
        value: props.getSponsor.sponsor.name,
      },
      contact_firstName: {
        value: props.getSponsor.sponsor.contact_firstName,
      },
      contact_lastName: {
        value: props.getSponsor.sponsor.contact_lastName,
      },
      email: {
        value: props.getSponsor.sponsor.email,
      },
      sponsor_amount: {
        value: props.getSponsor.sponsor.sponsor_amount,
      },
      cash: {
        value: props.getSponsor.sponsor.cash,
      },
      donation_receipt: {
        value: props.getSponsor.sponsor.donation_receipt,
      },
    };
  },
})(SponsorForm);

export default compose(
  graphql(getSponsor, {
    name: 'getSponsor',
    options: props => ({
      variables: { id: props.id },
    }),
  }),
  graphql(createSponsor, {
    name: 'createSponsorMutation',
  }),
  graphql(updateSponsor, { name: 'updateSponsorMutation' }),
)(WrappedSponsorForm);
