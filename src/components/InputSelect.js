import { Form, Select } from 'antd';
import { useState } from 'react';

const { Option } = Select;

const InputSelect = (props) => {
    const { label, onChange, validate, required, options, ...others } = props;

    const [errorMessage, setErrorMessage] = useState(null);
    const [changed, setChanged] = useState(null);

    const validateStatus = errorMessage ? 'error' : 'success';

    const handleValidation = value => {
        setChanged(true);
        let isValid = true;

        if (validate) {
            const message = validate(value);
            setErrorMessage(message);
            isValid = !message;
        }

        if (onChange) {
            onChange({
                target: {
                    name: props.name,
                    value: isValid ? value : null
                }
            });
        }
    };

    return (
        <Form.Item
            validateStatus={validateStatus}
            label={label}
            help={errorMessage}
            hasFeedback={changed}
            required={required}
        >

            <Select
                {...others}
                onSelect={handleValidation}
                allowClear
            >
                {options.map(option => (
                    <Option value={option.value}>
                        {option.title}
                    </Option>
                ))}
            </Select>

        </Form.Item>
    );
}

export default InputSelect;
