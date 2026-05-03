import {useEffect, useMemo, useState} from 'react';
import './AlarmsPage.css';

const ALARM_INFO_URL = 'https://p0ihs7rrth.execute-api.eu-west-1.amazonaws.com/prod/alarm_info';
const BASIC_AUTH_HEADER = `Basic ${btoa('kret:piwkoBasenTaczkaSzklanka*1')}`;

const ALARM_LABELS: Record<string, string> = {
    kreciaLifenessChecker: 'dostępność',
    KreciaAppAlarm: 'alarm',
};

interface AlarmInfoResponse {
    alarms: AlarmInfo[];
    providerFailures: unknown[];
}

interface AlarmInfo {
    name: string;
    triggered: boolean;
    date?: string;
    triggeredByAlarms?: string[];
    attributes?: Record<string, string>;
}

function AlarmsPage() {
    const [alarmInfo, setAlarmInfo] = useState<AlarmInfoResponse>();
    const [error, setError] = useState<string>();

    useEffect(() => {
        const abortController = new AbortController();

        const fetchAlarmInfo = async () => {
            try {
                const response = await fetch(ALARM_INFO_URL, {
                    headers: {
                        Authorization: BASIC_AUTH_HEADER,
                    },
                    signal: abortController.signal,
                });

                if (!response.ok) {
                    throw new Error(`Alarm info request failed with status ${response.status}`);
                }

                const data: AlarmInfoResponse = await response.json();
                setAlarmInfo(data);
            } catch (error) {
                if (!abortController.signal.aborted) {
                    console.error('Error fetching alarm info:', error);
                    setError('Nie udało się pobrać alarmów.');
                }
            }
        };

        fetchAlarmInfo();

        return () => abortController.abort();
    }, []);

    const triggeredAlarms = useMemo(
        () => alarmInfo?.alarms.filter(alarm => alarm.triggered) ?? [],
        [alarmInfo],
    );

    return (
        <main className="alarms-page">
            <section className="alarms-content" aria-labelledby="alarms-title">
                <div className="alarms-header">
                    <p className="alarms-eyebrow">Aktywne alarmy</p>
                    <h1 id="alarms-title">Stan alarmów</h1>
                </div>

                {!alarmInfo && !error ? (
                    <div className="alarms-status">Ładowanie...</div>
                ) : null}

                {error ? (
                    <div className="alarms-error" role="alert">{error}</div>
                ) : null}

                {alarmInfo && triggeredAlarms.length === 0 ? (
                    <div className="alarms-empty">Brak aktywnych alarmów.</div>
                ) : null}

                {triggeredAlarms.length > 0 ? (
                    <div className="alarms-list">
                        {triggeredAlarms.map(alarm => (
                            <AlarmCard alarm={alarm} key={alarm.name}/>
                        ))}
                    </div>
                ) : null}
            </section>
        </main>
    );
}

function AlarmCard({alarm}: { alarm: AlarmInfo }) {
    const label = ALARM_LABELS[alarm.name] ?? alarm.name;
    const triggeredAt = alarm.date ? formatDate(alarm.date) : 'Brak daty';

    return (
        <article className="alarm-card">
            <div className="alarm-card-header">
                <h2>{label}</h2>
            </div>

            <dl className="alarm-details">
                <div>
                    <dt>Uruchomiony</dt>
                    <dd>{triggeredAt}</dd>
                </div>
                {alarm.triggeredByAlarms && alarm.triggeredByAlarms.length > 0 ? (
                    <div>
                        <dt>Powód</dt>
                        <dd>
                            <ul>
                                {alarm.triggeredByAlarms.map(trigger => (
                                    <li key={trigger}>{trigger}</li>
                                ))}
                            </ul>
                        </dd>
                    </div>
                ) : null}
            </dl>
        </article>
    );
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat('pl-PL', {
        dateStyle: 'medium',
        timeStyle: 'medium',
    }).format(new Date(date));
}

export default AlarmsPage;
