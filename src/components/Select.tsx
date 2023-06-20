import { FieldHookConfig, useField } from "formik";
import { OtherProps } from "./Form";
import { ChangeEventHandler, FC } from "react";

type SelectProps = OtherProps & FieldHookConfig<string>

const Select: FC<SelectProps> = (props) => {
  const [field, meta] = useField(props);

  return (
    <div>
      <label htmlFor={props.id || props.name}>{props.label}</label>
      <select
        {...field}
        children={props.children}
        onChange={props.onChange as unknown as ChangeEventHandler<HTMLSelectElement> | undefined}
        name={props.name}
      />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default Select;
