import { useField, FieldHookConfig, useFormikContext } from 'formik';
import { OtherProps } from './Form';
import styled from '@emotion/styled'

const DateInput = (props: OtherProps & FieldHookConfig<string>) => {
  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();

  return (
    <DateContainer>
      <label htmlFor={props.id || props.name}>{props.label}</label>
      <input type="date" name="date"
        placeholder="dd-mm-yyyy"
        min="1960-01-01" max="2030-12-31"
        onChange={val => {
          setFieldValue(field.name, val.target.value);
        }}
      ></input>
      {meta.touched && meta.error ? (
        <Error>{meta.error}</Error>
      ) : null}
    </DateContainer>

  )
}

const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Error = styled.div`
  color: #ff6f6f;
`;

export default DateInput