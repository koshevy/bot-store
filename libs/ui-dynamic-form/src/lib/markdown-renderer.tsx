/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled';
import Typography, { TypographyProps } from '@mui/joy/Typography';
import * as marked from 'marked';
import { memo } from 'react';

export interface MarkdownRendererProps {
  text?: string | string[];
  wrapperTextLevel?: TypographyProps['level'];
}

const StyledDiv = styled.div`
  p {
    margin: .5rem 0;
  }
`;

export function MarkdownRenderer({
  text,
  wrapperTextLevel = 'body-md',
}: MarkdownRendererProps) {
  if (!text) {
    return null;
  }

  const parsedHtmlParts = (Array.isArray(text) ? text : [text]).map((line) => (
    marked.parse(line)
  ));

  return parsedHtmlParts.map((line, index) => (
    <Typography
      key={index}
      level={wrapperTextLevel}
      levelMapping={{ [wrapperTextLevel]: 'div' }}
    >
      <StyledDiv dangerouslySetInnerHTML={{ __html: line }} />
    </Typography>
  ));
}

export const MarkdownRendererMemo = memo(MarkdownRenderer);
