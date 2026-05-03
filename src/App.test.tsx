import {render, screen, waitFor, within} from '@testing-library/react';
import {afterEach, expect, test, vi} from 'vitest';
import App from './App';
import {KreciaDevices} from './dto/krecia_devices';

afterEach(() => {
  vi.restoreAllMocks();
  window.history.pushState({}, '', '/');
});

test('renders devices loaded from public data', async () => {
  const data: KreciaDevices = {
    entries: [
      {
        name: 'Device 1',
        id: 'device-1',
        mac_address: '00:00:00:00:00:01',
        tags: ['camera'],
        ip: '192.168.1.10',
        rtsp_endpoint: {
          id: 'rtsp-1',
          port: '554',
          suffix: '/stream',
          user: 'user',
          password: 'password',
          options: [],
          masks: [],
          order: 1,
        },
        domain_entries: {
          id: 'domains-1',
          ip: '192.168.1.10',
          domain_records: [
            {
              name: 'device-1.local',
              device_id: 'device-1',
              ip: '192.168.1.10',
            },
          ],
          web_endpoints: [],
        },
        web_endpoints: [
          {
            port: '80',
            name: 'admin',
            domain: 'device-1.example.com',
          },
        ],
      },
    ],
  };

  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    json: async () => data,
  } as Response);

  render(<App />);

  await waitFor(() => {
    expect(screen.getByText('device-1')).toBeInTheDocument();
  });

  expect(screen.getByText('camera')).toBeInTheDocument();
  expect(screen.getByText('device-1.example.com')).toBeInTheDocument();
});

test('renders active alarms from alarm info endpoint', async () => {
  window.history.pushState({}, '', '/alarms/');

  const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({
      alarms: [
        {
          name: 'kreciaLifenessChecker',
          triggered: false,
        },
        {
          name: 'KreciaAppAlarm',
          triggered: true,
          date: '2026-05-03T17:59:31.757604054Z',
          triggeredByAlarms: [
            'devices_3_alarms_4_duration_10',
          ],
          attributes: {
            currentState: 'ON',
          },
        },
      ],
      providerFailures: [],
    }),
  } as Response);

  render(<App />);

  await waitFor(() => {
    expect(screen.getByRole('heading', {name: 'alarm'})).toBeInTheDocument();
  });

  expect(screen.queryByText('dostępność')).not.toBeInTheDocument();
  expect(screen.queryByText('KreciaAppAlarm')).not.toBeInTheDocument();
  expect(screen.queryByText('Aktywny')).not.toBeInTheDocument();
  expect(screen.getByText('devices_3_alarms_4_duration_10')).toBeInTheDocument();
  expect(within(screen.getByText('Uruchomiony').parentElement as HTMLElement).getByText(/2026/)).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledWith(
    'https://p0ihs7rrth.execute-api.eu-west-1.amazonaws.com/prod/alarm_info',
    expect.objectContaining({
      headers: {
        Authorization: `Basic ${btoa('kret:piwkoBasenTaczkaSzklanka*1')}`,
      },
    }),
  );
});
