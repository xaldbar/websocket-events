import React, {useEffect, useState} from 'react';

import styles from './index.module.css'
import EventCreator from "../../components/event-creator";
import EventTable, {EventTableRow} from "../../components/event-table";
import useWebSocket from "react-use-websocket";
import {LOCAL_STORAGE_LOGS_KEY} from "../../constants/local-storage";

const initLogs: EventTableRow[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LOGS_KEY) ?? '[]')

const WS_URL = process.env.REACT_APP_BACKEND_HOST! + ':' + process.env.REACT_APP_BACKEND_PORT!

function HomePage() {
    const [logs, setLogs] = useState<EventTableRow[]>(initLogs);
    const { sendMessage, lastMessage } = useWebSocket(WS_URL);
    useEffect(() => {
        if (lastMessage === null) {
            return
        }

        const Log: EventTableRow = {
            ...JSON.parse(lastMessage.data),
            key: logs.length,
        }

        setLogs((prev) => {
            const newState = [Log, ...prev]
            localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(newState))
            return newState
        });
    }, [lastMessage, setLogs]);

    return (
        <div className={styles.home}>
            <EventCreator
                sendEvent={sendMessage}
                setLogs={setLogs}
                logs={logs}
            />
            <EventTable
                setLogs={setLogs}
                logs={logs}
            />
        </div>
    );
}

export default HomePage;