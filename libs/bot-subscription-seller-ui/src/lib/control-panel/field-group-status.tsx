import { JSXElementConstructor } from 'react';
import { Ref as FormRef } from 'react-hook-form';

export interface FieldGroupStatus {
  Icon?: JSXElementConstructor<unknown>;
  isValid: boolean;
  ref?: FormRef;
  title: string;
}
