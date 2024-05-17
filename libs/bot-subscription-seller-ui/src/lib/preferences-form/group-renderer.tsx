import { GroupRendererProps } from '@bot-store/ui-dynamic-form';
import Stack from '@mui/joy/Stack';
import { styled } from '@mui/joy/styles';
import Typography from '@mui/joy/Typography';
import { forwardRef } from 'react';

const GroupRendererStyles = styled(Stack)`
  padding: .7rem;
  margin-top: -.7rem;
  margin-left: -.7rem;

  &:focus {
    border: none;
    outline: none;
  }
`;

export const GroupRenderer = forwardRef<
HTMLDivElement,
GroupRendererProps
>(({
  children,
  group,
}, ref) => (
  <GroupRendererStyles spacing={1} ref={ref} tabIndex={0}>
    <Typography level="h4">
      {group}
    </Typography>
    {children}
  </GroupRendererStyles>
));
