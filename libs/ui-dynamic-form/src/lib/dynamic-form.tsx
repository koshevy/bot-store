import { groupBy, difference } from 'lodash-es';
import {
  createRef,
  forwardRef,
  memo,
  JSXElementConstructor,
  PropsWithChildren,
  RefAttributes,
  Ref,
  useEffect,
  useMemo,
} from 'react';
import { useFormContext, FieldValues } from 'react-hook-form';

import { HorizontalFormItem } from './horizontal-form-item';
import { useTrackDynamicValue } from './use-track-dynamic-value';
import { WidgetMetaWithLabel } from './widget-meta-with-label';

export type GroupRendererProps = PropsWithChildren<{
  group: string;
}>;

export interface DynamicFormProps<
  TFieldType extends string = string,
  TAdditionalProps extends Record<string, unknown> = Record<string, unknown>,
  TFormValue extends FieldValues = FieldValues,
> {
  Constructor?: JSXElementConstructor<WidgetMetaWithLabel<
  TFieldType,
  TAdditionalProps,
  TFormValue
  >>;
  disabled?: boolean;
  groupRenderingOrder?: string[];
  GroupRenderer?: JSXElementConstructor<GroupRendererProps & RefAttributes<HTMLDivElement>>;
  formFields: Array<WidgetMetaWithLabel<
  TFieldType,
  TAdditionalProps,
  TFormValue
  >>;
  onUpdate?: (formValue: FieldValues) => void;
}

export type DynamicFormGroupRefs = Record<string, Ref<HTMLDivElement>>;

export const DynamicFormRaw = forwardRef(<
  TFieldType extends string = string,
  TAdditionalProps extends Record<string, unknown> = Record<string, unknown>,
  TFormValue extends FieldValues = FieldValues,
>(
    {
      Constructor = HorizontalFormItem,
      disabled,
      groupRenderingOrder,
      GroupRenderer,
      formFields,
      onUpdate,
    }: DynamicFormProps<TFieldType, TAdditionalProps, TFormValue>,
    ref: Ref<DynamicFormGroupRefs>,
  ) => {
  const formContext = useFormContext();

  useTrackDynamicValue({
    ...formContext,
    fields: formFields,
    onUpdate,
  });

  const groupedFields = useMemo(
    () => groupBy(formFields, 'group'),
    [formFields],
  );

  const actualGroups = useMemo(
    () => Object.keys(groupedFields),
    [groupedFields],
  );

  const groupRefs = useMemo(
    () => Object.fromEntries(
      actualGroups.map((group) => [group, createRef<HTMLDivElement>()]),
    ),
    [actualGroups],
  );

  useEffect(() => {
    if (typeof ref === 'function') {
      ref(groupRefs);
    }
  }, [
    groupRefs,
    ref,
  ]);

  return useMemo(
    () => {
      if (!GroupRenderer) {
        return formFields.map(
          (props) => (
            <Constructor key={props.name} {...props} disabled={disabled} />
          ),
        );
      }

      if (groupRenderingOrder && difference(groupRenderingOrder, actualGroups).length) {
        throw new Error([
          'Parameter \'groupRenderingOrder\' doesn\'t match with actual group list!',
          'It could drive to incredibly hard to discovery bugs!',
        ].join('\n'));
      }

      const actualGroupRenderingOrder = groupRenderingOrder || actualGroups;

      return actualGroupRenderingOrder.map((group) => (
        <GroupRenderer
          key={group}
          group={group}
          ref={groupRefs[group]}
        >
          {groupedFields[group].map((props) => (
            <Constructor key={props.name} {...props} disabled={disabled} />
          ))}
        </GroupRenderer>
      ));
    },
    [
      disabled,
      actualGroups,
      Constructor,
      groupedFields,
      groupRefs,
      formFields,
      GroupRenderer,
      groupRenderingOrder,
    ],
  );
});

export const DynamicForm = memo(DynamicFormRaw);
