export interface KreciaDevices {
    entries: Array<DeviceDataEntry>
}

export interface DeviceDataEntry {
    name: string
    id: string
    mac_address: string
    ip: string
    tags: Array<string>
    web_endpoints: Array<WebEndpointEntry>
    rtsp_endpoint?: RtspEntry
    domain_entries: DeviceDomainEntries
}

export interface WebEndpointEntry{
    port: string
    name: string
    domain: string
}

export interface RtspEntry {
    id: string
    port: string
    suffix: string
    user: string
    password: string
    options: Array<string>
    masks: Array<string>
    order: number
}

export interface DeviceDomainEntries {
    id: string
    ip: string
    domain_records: Array<DomainRecord>
    web_endpoints: Array<WebEndpointEntry>
}

export interface WebEndpointEntry {
    port: string
    name: string
    domain: string
}
export interface DomainRecord {
    name:      string;
    device_id: string;
    ip:        string;
    cname?:    string;
}

