import React, { Fragment } from 'react';
import { css } from 'glamor';
import { StoryGroups } from '@react-html5up-components/hyperspace/.storybook/app';
import {
  Intro,
  SideNav,
  ISideNavProps,
} from '@react-html5up-components/hyperspace';

export default {
  title: StoryGroups().Demos().Pages('Home'),
};

export const Home = () => {
  // reset canvas default css props
  css.global('html, body', {
    padding: '0 !important',
    margin: '0 !important',
  });

  const SideNavItems: ISideNavProps['navsList'] = [
    {
      title: 'Welcome',
      active: true,
    },
    {
      title: 'Who we are',
    },
    {
      title: 'What we do',
    },
    {
      title: 'Get in touch',
    },
  ];

  return (
    <Fragment>
      <SideNav navsList={SideNavItems} />
      <Intro
        backgroundImage="https://raw.githubusercontent.com/morteza-jamali/react-html5up-templates/react-html5up-templates-beta/hyperspace/assets/css/images/intro.svg"
        btnLink="https://github.com/morteza-jamali/react-html5up-templates"
        btnTitle="Learn More"
        description="Just another fine responsive site template designed by React HTML5 UP
        and released for free under the Creative Commons."
        title="Hyperspace"
      />
    </Fragment>
  );
};
