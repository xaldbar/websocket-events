import React, {useEffect, useState} from 'react';
import { Table, Tag, TimePicker, Select, Button } from 'antd';
import styles from './index.module.css';
import { ColumnsType } from "antd/es/table";
import { LOG_LEVELS, LogDto, LogLevel } from "../../core/entities/logs";
import useWebSocket from "react-use-websocket";
import dayjs from 'dayjs';
import {LOCAL_STORAGE_LOGS_KEY} from "../../constants/local-storage";

const { Option } = Select;

const LOG_LEVEL_TAG_COLOR_MAP: Record<LogLevel, string> = {
    [LogLevel.Debug]: 'blue',
    [LogLevel.Info]: 'green',
    [LogLevel.Warning]: 'orange',
    [LogLevel.Error]: 'red',
}

export type EventTableRow = LogDto & { key: string }

const columns_config: ColumnsType<EventTableRow> = [
    {
        title: 'Уровень',
        dataIndex: 'level',
        key: 'level',
        render: (_, {level}) => {
            return (
                <Tag color={LOG_LEVEL_TAG_COLOR_MAP[level]}>
                    {level.toUpperCase()}
                </Tag>
            )
        },
    },
    {
        title: 'Дата',
        dataIndex: 'timestamp',
        key: 'timestamp',
        render: (_, {timestamp}) => (
            <span>
                {new Date(timestamp).toLocaleString()}
            </span>
        ),
    },
    {
        title: 'Сообщение',
        dataIndex: 'message',
        key: 'message',
    },
]

const formatDate = (date: string) => dayjs(date, 'HH:mm:ss').toJSON()

export interface EventTableFiltersProps {
    fromDate: Date | null
    toDate: Date | null
    setFromDate: (value: Date | null) => void
    setToDate: (value: Date | null) => void

    level: LogLevel | null
    setLevel: (value: LogLevel | null) => void
    setLogs: (value: EventTableRow[]) => void
}


export  interface EventTableProps {
    logs: EventTableRow[]
    setLogs: (value: EventTableRow[]) => void
}

const filterLogsByType = (logs: EventTableRow[], alertType: LogLevel): EventTableRow[] => {
    return logs.filter((log) => log.level === alertType)
}

const filterLogsByDate = (logs: EventTableRow[], fromDate: Date | null, toDate: Date | null): EventTableRow[] => {
    let filteredLogs = logs

    if (fromDate) {
        filteredLogs = filteredLogs.filter((log) => {
            const logDate = new Date(log.timestamp)
            return logDate.getTime() >= fromDate.getTime()
        })
    }

    if (toDate) {
        filteredLogs = filteredLogs.filter((log) => {
            const logDate = new Date(log.timestamp)
            return logDate.getTime() <= toDate.getTime()
        })
    }

    return filteredLogs
}

const EventTableFilters: React.FC<EventTableFiltersProps> = function ({
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    level,
    setLevel,
    setLogs
}) {
    return (
        <div className={styles.tableFilters}>
            <Button
                onClick={() => {
                    setLogs([])
                    localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, '[]')
                }}
            >
                Очистить таблицу
            </Button>
            <Select
                className={styles.filterSelect}
                allowClear
                placeholder={'Уровень'}
                value={level}
                onSelect={(value) => setLevel(value)}
                onClear={() => setLevel(null)}
            >
                {LOG_LEVELS.map((level) => (
                    <Option
                        key={level}
                        value={level}
                    >{level}</Option>
                ))}
            </Select>
            <TimePicker
                placeholder={'От: '}
                value={fromDate ? dayjs(fromDate) : null}
                onChange={(value, date) => {
                    const newDate = new Date(formatDate(date))
                    setFromDate(value ? newDate : null)
                }}
            />
            <TimePicker
                placeholder={'До: '}
                value={toDate ? dayjs(toDate) : null}
                onChange={(value, date) => {
                    const newDate = new Date(formatDate(date))
                    setToDate(value ? newDate : null)
                }}
            />
        </div>
    );
}

const EventTable: React.FC<EventTableProps> = ({ logs, setLogs }) => {
    const [levelFilter, setLevelFilter] = useState<LogLevel | null>(null);
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);

    let tableLogs: EventTableRow[] = logs

    if (levelFilter) {
        tableLogs = filterLogsByType(logs, levelFilter)
    }

    tableLogs = filterLogsByDate(tableLogs, fromDate, toDate)

    return (
        <>
            <EventTableFilters
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
                level={levelFilter}
                setLevel={setLevelFilter}
                setLogs={setLogs}
            />
            <Table columns={columns_config} dataSource={tableLogs} />
        </>
    );
}

export default EventTable;