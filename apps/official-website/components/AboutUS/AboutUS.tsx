import React, { FunctionComponent } from 'react';
import { Styles } from './AboutUS.styles';
import type { IAboutUSProps } from './AboutUS.types';

export const AboutUS: FunctionComponent<IAboutUSProps> = ({ ...rest }) => {
  const { root } = Styles({});

  return (
    <div
      className="d-flex flex-column justify-content-center"
      {...root}
      {...rest}
    >
      <h1 className="text-white fw-bolder">_What we do ?</h1>
      <p className="text-light">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat ullam
        voluptates dolores tempora eligendi! Nam, labore. Ut, inventore?
        Reiciendis temporibus inventore mollitia illo dignissimos quam, et
        similique omnis laboriosam laudantium!
      </p>
    </div>
  );
};

export default AboutUS;