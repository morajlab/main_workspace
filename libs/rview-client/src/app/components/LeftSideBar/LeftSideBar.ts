import r from '@moraj/react-hyper/r';
import { Stack } from '@fluentui/react/lib/Stack';
import { SearchBox } from '@fluentui/react/lib/SearchBox';

const LeftSideBar = () =>
  r(Stack, [
    r(Stack.Item, r(SearchBox, { placeholder: 'Search phone' })),
    r(Stack.Item, 'Second'),
  ]);

export default LeftSideBar;
