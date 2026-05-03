import React, {useState} from "react";
import {DeviceDataEntry, KreciaDevices} from "./dto/krecia_devices";
import * as R from 'ramda'
function Devices({data}: { data: KreciaDevices }) {

    const entries = R.sortBy(elem => elem.rtsp_endpoint?.order || 0, data.entries)

    const availableTags = R.uniq(entries.flatMap(elem => elem.tags))

    const [selectedTag, setSelectedTag] = useState<string>("all");

    const allTags = ['all', ...availableTags]

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
            <div className="grid gap-6 lg:grid-cols-[12rem_minmax(0,1fr)]">
                <aside className="w-full lg:w-48 lg:shrink-0">
                    <div className="lg:sticky lg:top-20">
                        <div className="join join-vertical w-full">
                            {allTags.map(tag => (
                                <button
                                    type="button"
                                    className={`btn join-item justify-start normal-case ${tag === selectedTag ? 'btn-primary' : 'btn-outline'}`}
                                    key={tag}
                                    onClick={() => setSelectedTag(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>
                <main className="min-w-0">
                    <div className="grid gap-4 lg:grid-cols-2">
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
                </main>

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
        <article className="card min-w-0 border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-4 p-5">
                <h1 className="card-title text-xl">{elem.id}</h1>
                {/*<a href={"//" + elem.ip}>*/}
                {/*    <div>{elem.ip}</div>*/}
                {/*</a>*/}
                <div className="overflow-x-auto">
                    <table className="table table-zebra table-sm">
                        <tbody>
                        {elems.map((elem, index) => (
                            <tr key={index}>
                                <td className="w-28 text-right font-semibold text-base-content/70">
                                    {elem.name}
                                </td>
                                <td className="text-left">
                                    <a className="link link-primary break-all" href={"http://" + elem.link}>
                                        {elem.link}
                                    </a>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </article>
    );
}

export default Devices;
