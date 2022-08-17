import React, { useContext } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Head } from '../Context';
import "../styles/PageInfo/PageInfo.css";

const Search = () => {
    const { pageID } = useParams();

    const { setDocHead } = useContext(Head);

    const [searchRes, setSerachRes] = useState();
    const [isCon, setIsCon] = useState("Convert");
    const [isErr, setIsErr] = useState(false);

    useEffect(() => {
        fetch("http://localhost:3001/search", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "accept": "application/json"
            },
            body: JSON.stringify({
                pageID: pageID
            })
        })
            .then(res => {
                if (!res.ok) throw Promise.reject(res);
                return res;
            })
            .then(res => res.json())
            .then(data => {
                setIsErr(false);
                setSerachRes(data)
            })
            .catch(error => {
                // console.log(error);
                setIsErr(true);
                error.json().then((body) => {
                    //Here is already the payload from API
                    console.log(body);
                });
            })

    }, [pageID]);

    // console.log(searchRes);

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
                if (res.status === 200) {
                    console.log(res.status);
                    setIsCon("Coverted ✅")
                }
                else {
                    setIsCon("❌ similar")
                }
            })

    }

    return (
        <div className=' main-page'>
            <div className=' container'>
                {
                    (!isErr) ?
                        <>
                            <div className=' box' key={searchRes?.metaData?.id}>
                                <div className=' text-content'>
                                    <div className=' text'>
                                        <a href={`${searchRes?.metaData?.url}`} target="_blank" rel="noopener noreferrer">
                                            <h2>{searchRes?.metaData?.title}</h2>
                                        </a>
                                        <p>{searchRes?.metaData?.content}</p>
                                    </div>
                                    <span>{(searchRes?.metaData?.icon === "null") ? '👾' : searchRes?.metaData?.icon}</span>
                                </div>
                                <div className=' button'>
                                    <Link to={`/edit/${searchRes?.metaData?.id}`} onClick={setDocHead(searchRes?.metaData?.title)}>
                                        <button className=" edit">Edit</button>
                                    </Link>
                                    <button onClick={() => convertNow(searchRes?.metaData?.id, searchRes?.metaData?.title)} className=" convert">{isCon}</button>
                                </div>
                            </div>
                        </>
                        :
                        <p>Oops, something may be missing 😬</p>
                }

            </div>
        </div>
    )
}

export default Search