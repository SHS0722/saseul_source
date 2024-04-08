import * as React from 'react';

import clsx from 'clsx';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup, { FormGroupProps } from '@mui/material/FormGroup';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { FieldTitle } from 'ra-core';
import { CommonInputProps, sanitizeInputRestProps, useGetOne, useUpdate } from 'react-admin';
import Tooltip from '@mui/material/Tooltip';

interface RefrshOption { id: 'refresh', value: boolean }

export const ToggleRefreshInput = (props: BooleanInputProps) => {
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

    const { data, isLoading, refetch } = useGetOne<RefrshOption>('option', { id: 'refresh' })
    const [update, res] = useUpdate<RefrshOption>('option', { id: 'refresh' })

    return (
        <Tooltip title="20초에 한번 새로고침">
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
                                update('option', { id: 'refresh', data: { value: v } }).then(() => {
                                    refetch()
                                })
                            }}

                        />
                    }
                    label={
                        <FieldTitle
                            label={"새로고침"}
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
