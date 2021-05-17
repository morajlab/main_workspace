import { CheckboxStyleFunction, CheckmarkStyleFunction } from './checkbox.d';
import { IComponentStyles } from '@react-macos-ui/types';

export const containerStyles: CheckboxStyleFunction = () => ({
  display: 'flex',
});

export const labelStyles: CheckboxStyleFunction = () => ({
  display: 'flex',
  height: '20px',
  position: 'relative',
  ':hover': {},
  ':active': {},
});

export const inputWrapperStyles: CheckboxStyleFunction = () => ({
  position: 'relative',
  marginRight: '3px',
  paddingTop: '1px',
});

export const checkmarkStyles: CheckmarkStyleFunction = ({ show }) => ({
  opacity: show ? 1 : 0,
  transform: `scale(${show ? 1 : 0})`,
  transition: 'all 0.5s',
  position: 'absolute',
  top: '4px',
  left: '4px',
  width: '8px',
  height: '8px',
});

export const checkboxStyles: CheckboxStyleFunction = ({
  state,
  transition,
}) => {
  let result: IComponentStyles = {};
  const checkbox: IComponentStyles = {
    WebkitUserSelect: 'none',
    userSelect: 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#b8b8b8',
    borderRadius: '3px',
    backgroundColor: '#ffffff',
    padding: '6px',
    margin: '0 1px',
    boxShadow: 'inset 0 1px 0 0 rgba(224, 224, 224, .4)',
    transition: 'all 0.4s',
    ':focus': {
      outline: 'none',
    },
  };

  if (state) {
    result = {
      ...checkbox,
      ...{
        'checkbox:active': {
          borderColor: '#a4a4a4',
          backgroundColor: '#f0f0f0',
          boxShadow: 'inset 0 0 0 1px rgba(117, 117, 117, .35)',
          transition: 'all 0.4s',
        },
        'checkbox:checked': {
          backgroundColor: '#3b99fc',
          boxShadow: 'none',
          borderColor: '#2c91fc',
          transition: 'all 0.4s',
        },
        'checkbox:checked:unfocused': {
          backgroundColor: '#ffffff',
          boxShadow: 'none',
          borderColor: '#b8b8b8',
          transition: 'none',
        },
        'checkbox:checked:active': {
          backgroundColor: '#0080f6',
          borderColor: '#006adc',
          boxShadow: 'inset 0 0 0 1px rgba(19, 68, 119, .22)',
          transition: 'all 0.4s',
        },
      }[state],
    };
  }

  if (transition) {
    result.transition = transition;
  }

  return result;
};

export const svgStyles: CheckboxStyleFunction = () => ({
  zIndex: 2,
  position: 'absolute',
  top: '0px',
  left: '0px',
  height: '8px',
});

export const svgShadowStyles: CheckboxStyleFunction = () => ({
  zIndex: 1,
  position: 'absolute',
  top: '1.5px',
  left: '0px',
  opacity: '.37',
  height: '8px',
  filter: 'blur(.5px)',
});
