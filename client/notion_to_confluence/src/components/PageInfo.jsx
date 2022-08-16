import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'
import "../styles/PageInfo/PageInfo.css"

const PageInfo = () => {
    const { dbid } = useParams();
    console.log(dbid);
    // const dbidObj = 

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

    console.log(pagedata);

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
            .then(res => res.json())
            .then(data => setIsCon(data));
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
                                    <button onClick={() => convertNow(el.id, el.title)} className=" convert">Convert</button>
                                </div>
                            </div>
                        )
                    })
                }

                {/* <div className=' box'>
                    <div className=' text-content'>
                        <div className=' text'>
                            <h2>Cookies</h2>
                            <p>How to send cookies to clients?</p>
                        </div>
                        <span>😍</span>
                    </div>
                    <div className=' button'>
                        <button className=" edit">Edit</button>
                        <button className=" convert">Convert</button>
                    </div>
            </div> */}
            </div>
        </div>
    )
}

export default PageInfo