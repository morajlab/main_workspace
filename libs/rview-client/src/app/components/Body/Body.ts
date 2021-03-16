import r from '@moraj/react-hyper/r';
import LeftSideBar from '../LeftSideBar/LeftSideBar';
import PreviewSection from '../PreviewSection/PreviewSection';
import { Stack } from '@fluentui/react/lib/Stack';

const Body = () =>
  r(
    Stack,
    {
      horizontal: true,
    },
    [r(LeftSideBar), r(PreviewSection)]
  );

export default Body;
