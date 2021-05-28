import React, { FunctionComponent, HTMLAttributes } from 'react';
import { INavProps } from '@react-html5up-components/hyperspace/navbar';
import { SideNavStyles } from './SideNav.style';

export interface ISideNavProps extends HTMLAttributes<HTMLDivElement> {
  navsList: INavProps[];
}

export const SideNav: FunctionComponent<ISideNavProps> = ({
  navsList,
  ...rest
}) => {
  const { root, inner, nav, activeItem } = SideNavStyles({ navsCount: 4 });

  return (
    <section {...rest} {...root}>
      <div {...inner}>
        <nav {...nav}>
          <ul>
            {navsList.map(({ title, active, url }, key) => {
              const _activeItem = active ? activeItem : {};

              return (
                <li key={key}>
                  <a href={url ?? '#!'} {..._activeItem}>
                    {title}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default SideNav;
