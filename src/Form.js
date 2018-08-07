import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';

class Field extends React.Component {
  static contextTypes = {
    formik: PropTypes.object,
  };

  shouldComponentUpdate(nextProps, nextState, { formik }) {
    const { name, component } = this.props;

    if (typeof component === 'string') {
      if (formik.values[name] !== this.context.formik.values[name]) {
        return true;
      }
      const nextPropsKeys = Object.keys(nextProps);

      return (
        nextPropsKeys.length !== Object.keys(this.props).length ||
        nextPropsKeys.some(prop => {
          return !isEqual(this.props[prop], nextProps[prop]);
        })
      );
    }

    // const nextFormikKeys = Object.keys(formik);
    // return nextFormikKeys.some(prop => {
    //   return !isequal(this.context.formik[prop], formik[prop]);
    // });

    return formik !== this.context.formik;
  }

  render() {
    const { name, type, value, component, ...props } = this.props;
    const { formik } = this.context;
    const field = {
      value:
        type === 'radio' || type === 'checkbox' ? value : formik.values[name],
      name,
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
    };
    const bag =
      typeof component === 'string'
        ? field
        : {
            field,
            form: formik,
          };
    return React.createElement(component, {
      ...props,
      ...bag,
    });
  }
}
