import {render, screen, waitFor} from '@testing-library/react';
import {afterEach, expect, test, vi} from 'vitest';
import App from './App';
import {KreciaDevices} from './dto/krecia_devices';

afterEach(() => {
  vi.restoreAllMocks();
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
