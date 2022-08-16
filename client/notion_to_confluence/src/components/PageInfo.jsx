import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'
import "../styles/PageInfo/PageInfo.css"

const PageInfo = () => {
    const { dbid } = useParams();

    const [pagedata, setPagedata] = useState();
    const [isCon, setIsCon] = useState();
    useEffect(() => {

        fetch("http://localhost:3001/getpages", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "accept": "application/json"
            },
            body: JSON.stringify({
                databaseID: `${dbid}`,
            })
        })
            .then((res) => res.json())
            .then((data) => setPagedata(data));

    }, [dbid]);

    // console.log(pagedata);

    async function convertNow(pageID, title) {
        await fetch("http://localhost:3001/direct-convert", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "accept": "application/json"
            },
            body: JSON.stringify({
                pageID: pageID,
                title: title
            })
        })
            .then(res => {
                if (res.status == 200) {
                    console.log(res.status);
                    setIsCon({
                        id: pageID,
                        status: "Coverted ✅"
                    })
                }
                else {
                    setIsCon({
                        id: pageID,
                        status: "❌ similar"
                    })
                }
            })
    }

    return (
        <div className=' main-page'>
            <div className=' container'>

                {
                    pagedata?.pages_from_a_DB?.map((el) => {
                        return (
                            <div className=' box' key={el.id}>
                                <div className=' text-content'>
                                    <div className=' text'>
                                        <a href={`${el.url}`} target="_blank" rel="noopener noreferrer">
                                            <h2>{el.title}</h2>
                                        </a>
                                        <p>{el.content}</p>
                                    </div>
                                    <span>{(el.icon === "null") ? '👾' : el.icon}</span>
                                </div>
                                <div className=' button'>
                                    <Link to={`/edit/${el.id}`}>
                                        <button className=" edit">Edit</button>
                                    </Link>
                                    <button onClick={() => convertNow(el.id, el.title)} className=" convert">{(isCon?.id == el.id) ? isCon?.status : "Convert"}</button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default PageInfo