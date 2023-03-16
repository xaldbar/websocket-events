import React from 'react';
import { Button, Form, Input, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';

import styles from './index.module.css';
import {createLog, LOG_LEVELS, LogDto, LogLevel} from "../../core/entities/logs";
import { SendMessage } from "react-use-websocket/src/lib/types";
import {EventTableRow} from "../event-table";
import {LOCAL_STORAGE_LOGS_KEY} from "../../constants/local-storage";

const { Option } = Select;

const { TextArea } = Input;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

export interface EventCreatorFormProperties {
    level: LogLevel
    message: string
}

export interface EventCreatorProps {
    sendEvent: SendMessage
    logs: EventTableRow[]
    setLogs: (value: EventTableRow[]) => void
}

const EventCreator: React.FC<EventCreatorProps> = ({ sendEvent, logs, setLogs }) => {
    const formRef = React.useRef<FormInstance<EventCreatorFormProperties>>(null);

    const onSubmit = (values: EventCreatorFormProperties) => {
        const log = createLog({
            level: values.level,
            message: values.message,
            timestamp: new Date().toISOString(),
        })

        const newState = [{ key: String(logs.length), ...log }, ...logs]
        setLogs(newState)
        localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(newState))

        sendEvent(JSON.stringify(log))
        formRef.current?.resetFields();
    };

    const onReset = () => {
        formRef.current?.resetFields();
    };

    return (
        <div className={styles.eventCreator}>
            <Form
                {...layout}
                ref={formRef}
                name="control-ref"
                onFinish={onSubmit}
                className={styles.eventCreatorForm}
            >
                <Form.Item name="message" label="Сообщение"  rules={[{ required: true }]}>
                    <TextArea
                        rows={4}
                        autoSize={{
                            minRows: 4,
                            maxRows: 4,
                        }}
                        allowClear
                    />
                </Form.Item>
                <Form.Item name="level" label="Уровень логирования" rules={[{ required: true }]}>
                    <Select
                        allowClear
                    >
                        {LOG_LEVELS.map((level) => (
                            <Option
                                key={level}
                                value={level}
                            >{level}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <div className={styles.formButtons}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button htmlType="button" onClick={onReset}>
                        Reset
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default EventCreator;