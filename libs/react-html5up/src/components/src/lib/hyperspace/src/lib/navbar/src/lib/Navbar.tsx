import React, { FunctionComponent, HTMLAttributes } from 'react';
import { NavbarStyles } from './Navbar.style';

export interface INavProps {
  title: string;
  url?: string;
  active?: boolean;
}

export interface INavbarProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  titleURL?: string;
  navList?: INavProps[];
}

export const NavList: FunctionComponent<{ list: INavbarProps['navList'] }> = ({
  list,
}) => {
  if (!list) {
    return null;
  }

  return (
    <nav>
      <ul>
        {list.map(({ title, active, url }) => (
          <li>
            <a href={url ?? '#!'} data-active={active ?? false}>
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export const Navbar: FunctionComponent<INavbarProps> = ({
  title,
  titleURL,
  navList,
  ...rest
}) => {
  return (
    <header {...rest} {...NavbarStyles({})}>
      <a href={titleURL ?? '#!'} data-title="">
        {title}
      </a>
      <NavList list={navList} />
    </header>
  );
};

export default Navbar;
