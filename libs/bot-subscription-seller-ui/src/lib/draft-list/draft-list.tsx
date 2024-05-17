import DeleteIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListSubheader from '@mui/joy/ListSubheader';
import { styled } from '@mui/joy/styles';
import Typography from '@mui/joy/Typography';
import { format } from 'date-fns';
import {
  MouseEvent,
  useCallback,
  useMemo,
} from 'react';

import { Draft } from './draft';
import {
  DraftHighlightPopup,
  DraftHighlightPopupProps,
} from './draft-highlight-popup';

type SimpleObject = object;

export interface DraftListProps<TPayload extends SimpleObject = SimpleObject> {
  disabled?: boolean;
  highlight?: Omit<DraftHighlightPopupProps, 'onClose'>;
  maxItems?: number;
  onRemoveHighlight?: () => void;
  onSelect?: (draft: Draft<TPayload>) => void;
  onUpdate?: (draft: Draft<TPayload>[]) => void;
  selected?: string;
  value?: Draft<TPayload>[];
}

const DraftListStyles = styled(List)(({ theme }) => `
  row-gap: .25rem;

  .${listItemButtonClasses.root} {
    border-radius: ${theme.vars.radius.sm};
  }

  .${iconButtonClasses.root} {
    right: -.2rem;
    border-radius: ${theme.vars.radius.sm};
  }

  .${listItemButtonClasses.variantSoft} + div {
    .${iconButtonClasses.root} {
      border-radius: 0 ${theme.vars.radius.sm} ${theme.vars.radius.sm} 0;
    }
  }

  svg {
    font-size: 1.1rem;
    color: ${theme.palette.neutral.outlinedBorder};
  }

  .${iconButtonClasses.root}:hover {
    svg {
      font-size: 1.1rem;
      color: ${theme.palette.neutral.softColor};
    }
  }

  .DraftList__noDrafts {
    padding: .4rem .4rem .4rem 2rem;
    border: 1px solid ${theme.palette.neutral.outlinedDisabledBorder};
    border-radius: ${theme.radius.md};
    background: ${theme.palette.neutral['50']};

    > span {
      color: ${theme.palette.neutral['500']};
      font-weight: ${theme.fontWeight.sm};
    }

    svg {
      font-size: 1.4rem;
    }
  }
`);

export function DraftList<TPayload extends SimpleObject = SimpleObject>({
  disabled,
  highlight,
  maxItems = 5,
  selected,
  onRemoveHighlight,
  onSelect,
  onUpdate,
  value,
}: DraftListProps<TPayload>) {
  const actualDrafts = useMemo(
    () => value?.slice(0, maxItems),
    [maxItems, value],
  );

  const handleSelect = useCallback((draft: Draft<any>) => {
    if (selected && draft.uuid === selected) {
      return;
    }

    onSelect?.(draft);
  }, [
    onSelect,
    selected,
  ]);

  const handleDelete = useCallback((
    draft: Draft<any>,
    { currentTarget, target }: MouseEvent<HTMLAnchorElement>,
  ) => {
    if (!(target instanceof Node)) {
      return;
    }

    if ((target !== currentTarget) && !currentTarget.contains(target)) {
      return;
    }

    onUpdate?.(
      actualDrafts?.filter(
        ({ uuid }) => uuid !== draft.uuid,
      ) ?? [],
    );
  }, [
    actualDrafts,
    onUpdate,
  ]);

  const dratListItems = useMemo(() => {
    if (!value?.length) {
      return (
        <ListItem
          startAction={<HistoryToggleOffIcon />}
          className="DraftList__noDrafts"
        >
          <Typography level="body-xs">
            There are no drafts yet.
            Your changes will be stored automatically.
          </Typography>
        </ListItem>
      );
    }

    return actualDrafts?.map((draft) => {
      const isOpen = highlight && (highlight.draftUuid === draft.uuid);

      return (
        <DraftHighlightPopup
          {...highlight}
          key={draft.uuid}
          color={highlight?.color ?? 'neutral'}
          disablePortal
          onClose={onRemoveHighlight}
          open={isOpen && !disabled}
        >
          <ListItem
            endAction={(
              <IconButton
                disabled={disabled}
                onClick={(event) => handleDelete(draft, event)}
                size="sm"
              >
                <DeleteIcon />
              </IconButton>
            )}
          >
            <ListItemButton
              disabled={disabled}
              variant={selected === draft.uuid ? 'soft' : 'plain'}
              onClick={() => handleSelect(draft)}
            >

              <span>{format(Date.parse(draft.dateTime), 'dd MMM yy / HH:ii')}</span>
            </ListItemButton>
          </ListItem>
        </DraftHighlightPopup>
      );
    });
  }, [
    actualDrafts,
    disabled,
    handleDelete,
    handleSelect,
    highlight,
    onRemoveHighlight,
    selected,
    value?.length,
  ]);

  return (
    <DraftListStyles
      size="sm"
      data-testid="DraftList"
    >
      <ListSubheader>
        <HistoryIcon />
        {' '}
&nbsp;
        Drafts
      </ListSubheader>
      {dratListItems}
    </DraftListStyles>
  );
}
