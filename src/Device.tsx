import React, {useState} from "react";
import {DeviceDataEntry, KreciaDevices} from "./dto/krecia_devices";
import * as R from 'ramda'
function Devices({data}: { data: KreciaDevices }) {

    const entries = R.sortBy(elem => elem.rtsp_endpoint?.order || 0, data.entries)

    const availableTags = R.uniq(entries.flatMap(elem => elem.tags))

    const [selectedTag, setSelectedTag] = useState<string>("all");

    const allTags = ['all', ...availableTags]

    return (
        <div className={"container"} style={{paddingTop: '30px'}}>
            <div className="row">
                <div className="col-lg-2">
                    <div className="sticky-lg-top" style={{paddingTop: '30px'}}>
                        <ul className="list-group">
                            {allTags.map(tag => (
                                <a href="#" className="list-group-item-action" onClick={() => setSelectedTag(tag)}>
                                    <li className={`list-group-item ${tag === selectedTag ? 'active' : ''}`} key={tag}>
                                        {tag}
                                </li>
                                </a>
                                ))}
                        </ul>
                    </div>
                </div>
                <div className="col-lg-10">
                    <div className="row justify-content-start">
                        {entries
                            .filter(elem => {
                                if(selectedTag === "all") {
                                    return true
                                } else {
                                 return elem.tags.includes(selectedTag)
                                }
                            })
                            .map((elem) => (
                            <Device key={elem.id} elem={elem}/>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
}

function Device({elem}: { elem: DeviceDataEntry }) {

    interface Entry {
        name: string,
        link: string
    }

    const elems: Entry[] = [
        {name: "ip", link: elem.ip},
        ...(elem.domain_entries.domain_records.filter(elem => !elem.cname).map(elem => {
            return {
                name: "domain",
                link: elem.name
            }
        })),
        ...(elem.web_endpoints.map(elem => {
            return {
                name: elem.name,
                link: elem.domain
            }
        }))
    ]


    return (
        <div className={"col-lg-6 border"}>
            <h1>{elem.id}</h1>
            {/*<a href={"//" + elem.ip}>*/}
            {/*    <div>{elem.ip}</div>*/}
            {/*</a>*/}
            <table className={"table table-striped table-sm"}>
                <tbody>
                {elems.map((elem, index) => (
                    <tr key={index}>
                        <td>
                            <div style={{textAlign: "right"}}>{elem.name}</div>
                        </td>
                        <td>
                            <a href={"http://" + elem.link}>
                                <div style={{textAlign: "left"}}>{elem.link}</div>
                            </a>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    );
}

export default Devices;