import { Field, FieldHookConfig, useField } from "formik";
import { FC } from "react";
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { OtherProps } from "./Form";

type InputProps = OtherProps & FieldHookConfig<string>

const Input: FC<InputProps> = (props) => {
  const [field, meta] = useField(props);

  return (
    <div>
      <label htmlFor={props.id || props.name}>{props.label}</label>
      <MyField {...field} {...props} isError={props.isError} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

const MyField = styled(Field)`
  :focus {
    border: 1px solid #213547;
  }
  
  ${({ isError }) => isError ? css`
    border: 1px solid #ff6f6f;
  ` : css`
    border: 1px solid #f7f7f7;
    background-color: #f7f7f7;
  `}
`;

export default Input;
