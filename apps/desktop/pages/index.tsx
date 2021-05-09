import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Persona, PersonaSize, Stack, IStackStyles } from '@fluentui/react';
import { TestImages } from '@fluentui/example-data';
import { Theme, getTheme } from 'react-uwp';

export default class Desktop extends Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { theme } = this.context;

    const loginTheme = getTheme({
      useFluentDesign: true,
      desktopBackgroundImage: 'bg-1.jpg',
    });

    const containerStackStyles: IStackStyles = {
      root: {
        width: '100%',
        height: '100%',
        background: 'none',
      },
    };

    return (
      <Theme theme={loginTheme}>
        <Stack styles={containerStackStyles}>
          <Stack grow={1} verticalAlign="center" horizontalAlign="center">
            <Stack.Item>
              <Persona
                imageUrl={TestImages.personaFemale}
                imageInitials="AL"
                size={PersonaSize.size120}
              />
            </Stack.Item>
          </Stack>
          <Stack>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro
              voluptates odio soluta veritatis provident quas ipsum aut vitae,
              similique, amet eius quam quia corporis ut tenetur, possimus ipsam
              asperiores vero?
            </p>
          </Stack>
        </Stack>
      </Theme>
    );
  }
}
