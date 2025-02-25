/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React from 'react';
import RadioTile from '../RadioTile';
import { warning } from '../../internal/warning';
import { PrefixContext } from '../../internal/usePrefix';
import { noopFn } from '../../internal/noopFn';

export default class TileGroup extends React.Component {
  state = {
    selected: this.props.valueSelected || this.props.defaultSelected || null,
    prevValueSelected: this.props.valueSelected,
  };

  static contextType = PrefixContext;

  static propTypes = {
    /**
     * Provide a collection of <RadioTile> components to render in the group
     */
    children: PropTypes.node,

    /**
     * Provide an optional className to be applied to the container node
     */
    className: PropTypes.string,

    /**
     * Specify the the value of <RadioTile> to be selected by default
     */
    defaultSelected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * Specify whether the group is disabled
     */
    disabled: PropTypes.bool,

    /**
     * Provide an optional legend for this group
     */
    legend: PropTypes.string,

    /**
     * Specify the name of the underlying `<input>` nodes
     */
    name: PropTypes.string.isRequired,

    /**
     * Provide an optional `onChange` hook that is called whenever the value of
     * the group changes
     */
    onChange: PropTypes.func,

    /**
     * Specify the value that is currently selected in the group
     */
    valueSelected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static getDerivedStateFromProps({ valueSelected, defaultSelected }, state) {
    const { prevValueSelected } = state;
    return prevValueSelected === valueSelected
      ? null
      : {
          selected: valueSelected || defaultSelected || null,
          prevValueSelected: valueSelected,
        };
  }

  getRadioTiles = () => {
    const childrenArray = React.Children.toArray(this.props.children);
    const children = childrenArray.map((tileRadio) => {
      const { value, ...other } = tileRadio.props;
      /* istanbul ignore if */
      if (typeof tileRadio.props.checked !== 'undefined') {
        warning(
          false,
          `Instead of using the checked property on the RadioTile, set
            the defaultSelected property or valueSelected property on the TileGroup.`
        );
      }

      return (
        <RadioTile
          {...other}
          name={this.props.name}
          key={value}
          value={value}
          onChange={this.handleChange}
          checked={value === this.state.selected}
        />
      );
    });

    return children;
  };

  handleChange = (newSelection, value, evt) => {
    const { onChange = noopFn } = this.props;
    if (newSelection !== this.state.selected) {
      this.setState({ selected: newSelection });
      onChange(newSelection, this.props.name, evt);
    }
  };

  renderLegend = (legend) => {
    if (legend) {
      return <legend className={`${this.context}--label`}>{legend}</legend>;
    }
  };

  render() {
    const { context: prefix } = this;
    const {
      disabled,
      className = `${prefix}--tile-group`,
      legend,
    } = this.props;

    return (
      <fieldset className={className} disabled={disabled}>
        {this.renderLegend(legend)}
        <div>{this.getRadioTiles()}</div>
      </fieldset>
    );
  }
}
