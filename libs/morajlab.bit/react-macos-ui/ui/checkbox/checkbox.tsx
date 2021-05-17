import React, { FunctionComponent } from 'react';
import {
  containerStyles,
  labelStyles,
  inputWrapperStyles,
  checkmarkStyles,
  checkboxStyles,
  svgStyles,
  svgShadowStyles,
} from './checkbox.style';
import type { CheckmarkComponent, ICheckboxProps } from './checkbox.d';
import { CheckboxComponent } from './checkbox.d';
import { useFela } from 'react-fela';
import { createRenderer } from 'fela';
import { RendererProvider } from 'react-fela';

const renderer = createRenderer();

const Checkmark: CheckmarkComponent = ({ show, color, shadowColor }) => {
  const { css } = useFela();

  return (
    <div className={css(checkmarkStyles({ show }))}>
      <svg viewBox="0 0 285 283.4" className={css(svgStyles({}))}>
        <path
          fill={color}
          d="M101.2,215.7L227.5,20.6c0,0,20.7-31.9,44.4-16.2c25.4,16.8,6.1,41,6.1,41L134.5,271.9c0,0-8.8,11.5-23.9,11.5
s-29.2-13.3-29.2-13.3L2.7,175.4c0,0-9.4-17.3,6.8-27.4c19.7-12.3,34.6,2.8,34.6,2.8L101.2,215.7z"
        />
      </svg>
      <svg viewBox="0 0 285 283.4" className={css(svgShadowStyles({}))}>
        <path
          fill={shadowColor}
          d="M101.2,215.7L227.5,20.6c0,0,20.7-31.9,44.4-16.2c25.4,16.8,6.1,41,6.1,41L134.5,271.9c0,0-8.8,11.5-23.9,11.5
s-29.2-13.3-29.2-13.3L2.7,175.4c0,0-9.4-17.3,6.8-27.4c19.7-12.3,34.6,2.8,34.6,2.8L101.2,215.7z"
        />
      </svg>
    </div>
  );
};

class _Checkbox extends CheckboxComponent {
  state = {
    checked: !!this.props.defaultChecked === true,
    transition: true,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isWindowFocused !== this.props.isWindowFocused) {
      this.setState({ transition: false });
    }
  }

  componentDidUpdate() {
    if (!this.state.transition) {
      setTimeout(() => this.setState({ transition: true }), 0);
    }
  }

  onChange = (event) => {
    this.setState({ checked: event.target.checked });

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  };

  render() {
    const { css } = useFela();
    let { style, label, isWindowFocused, ...props } = this.props;
    const { transition } = this.state;
    let componentStyle = {};
    let checkMarkColor = '#FFFFFF';
    let shadowColor = '#0050a5';

    if (this.state.checked) {
      if (isWindowFocused) {
        componentStyle = checkboxStyles({
          state: 'checkbox:checked',
          transition: !transition ? 'none' : null,
        });
      } else {
        componentStyle = checkboxStyles({
          state: 'checkbox:checked:unfocused',
        });
        checkMarkColor = '#404040';
        shadowColor = '#FFFFFF';
      }
    }

    /*if (getState(this.state, null, ':active')) {
      if (this.state.checked) {
        componentStyle = {
          ...componentStyle,
          ...styles['checkbox:checked:active'],
        };
        shadowColor = '#001d99';
      } else {
        componentStyle = {
          ...componentStyle,
          ...styles['checkbox:active'],
        };
      }
    }*/

    return (
      <div className={css(containerStyles({}))}>
        <label className={css(labelStyles({}))}>
          <div className={css(inputWrapperStyles({}))}>
            <input
              ref="element"
              type="checkbox"
              {...props}
              className={css(componentStyle)}
              onChange={this.props.onChange}
            />
            <Checkmark
              show={this.state.checked}
              color={checkMarkColor}
              shadowColor={shadowColor}
            />
          </div>
          <span>{label}</span>
        </label>
      </div>
    );
  }
}

export const Checkbox: FunctionComponent<ICheckboxProps> = (props) => {
  return (
    <RendererProvider renderer={renderer}>
      <_Checkbox {...props} />
    </RendererProvider>
  );
};
