import * as React from 'react';

import clsx from 'clsx';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup, { FormGroupProps } from '@mui/material/FormGroup';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { FieldTitle } from 'ra-core';
import { CommonInputProps, sanitizeInputRestProps, useGetOne, useUpdate } from 'react-admin';
import Tooltip from '@mui/material/Tooltip';

interface AutoOption { id: 'auto', value: boolean }

export const ToggleAutoInput = (props: BooleanInputProps) => {
    const {
        className,
        row = false,
        defaultValue = false,
        format,
        label,
        fullWidth,
        helperText,
        onBlur,
        onChange,
        onFocus,
        disabled,
        parse,
        resource,
        source,
        validate,
        options = defaultOptions,
        sx,
        ...rest
    } = props;

    const { data, isLoading, refetch } = useGetOne<AutoOption>('option', { id: 'auto' })
    const [update, res] = useUpdate<AutoOption>('option', { id: 'auto' })

    return (
        <Tooltip title="10분에 한 번 정지되거나 채굴중이 아닌 노드들을 재시작, 300 이상 차이나는 노드들을 강제싱크">
            <FormGroup
                className={clsx('ra-input', `ra-input-${source}`, className)}
                row={row}
                sx={sx}
            >
                <FormControlLabel
                    control={
                        <Switch
                            color="primary"
                            onFocus={onFocus}
                            checked={data?.value || false}
                            {...sanitizeInputRestProps(rest)}
                            {...options}
                            disabled={isLoading}
                            onChange={(e, v) => {
                                console.log(v)
                                update('option', { id: 'auto', data: { value: v } }).then(() => {
                                    refetch()
                                })
                            }}

                        />
                    }
                    label={
                        <FieldTitle
                            label={label}
                            source={source}
                            resource={resource}
                        // isRequired={isRequired}
                        />
                    }
                />
            </FormGroup>
        </Tooltip>
    );
};


export type BooleanInputProps = CommonInputProps &
    SwitchProps &
    Omit<FormGroupProps, 'defaultValue' | 'onChange' | 'onBlur' | 'onFocus'> & {
        options?: SwitchProps;
    };

const defaultOptions = {};
