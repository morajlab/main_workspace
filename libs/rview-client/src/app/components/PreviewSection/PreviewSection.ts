import r from '@moraj/react-hyper/r';
import { Stack } from '@fluentui/react/lib/Stack';

const PreviewSection = () =>
  r(
    Stack,
    {
      grow: 1,
      shrink: 1,
    },
    'This is body'
  );

export default PreviewSection;
