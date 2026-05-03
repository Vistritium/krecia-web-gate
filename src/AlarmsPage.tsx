import {useEffect, useMemo, useState} from 'react';

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
        <main className="min-h-screen bg-base-200 text-base-content">
            <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10" aria-labelledby="alarms-title">
                <div className="mb-5">
                    <p className="mb-1 text-xs font-bold uppercase text-base-content/60">Aktywne alarmy</p>
                    <h1 id="alarms-title" className="text-2xl font-bold">Stan alarmów</h1>
                </div>

                {!alarmInfo && !error ? (
                    <div className="alert bg-base-100">Ładowanie...</div>
                ) : null}

                {error ? (
                    <div className="alert alert-error" role="alert">{error}</div>
                ) : null}

                {alarmInfo && triggeredAlarms.length === 0 ? (
                    <div className="alert bg-base-100">Brak aktywnych alarmów.</div>
                ) : null}

                {triggeredAlarms.length > 0 ? (
                    <div className="grid gap-3">
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
        <article className="card border border-error/30 border-l-4 border-l-error bg-base-100 shadow-sm">
            <div className="card-body gap-4 p-5 sm:p-6">
                <div>
                    <h2 className="card-title text-xl">{label}</h2>
                </div>

                <dl className="grid gap-4">
                    <div className="grid gap-1">
                        <dt className="text-xs font-bold uppercase text-base-content/60">Uruchomiony</dt>
                        <dd className="font-semibold">{triggeredAt}</dd>
                    </div>
                    {alarm.triggeredByAlarms && alarm.triggeredByAlarms.length > 0 ? (
                        <div className="grid gap-2">
                            <dt className="text-xs font-bold uppercase text-base-content/60">Powód</dt>
                            <dd>
                                <ul className="grid gap-2">
                                    {alarm.triggeredByAlarms.map(trigger => (
                                        <li className="rounded bg-base-200 px-3 py-2 break-all" key={trigger}>{trigger}</li>
                                    ))}
                                </ul>
                            </dd>
                        </div>
                    ) : null}
                </dl>
            </div>
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
