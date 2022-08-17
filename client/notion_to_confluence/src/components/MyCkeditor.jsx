import React from 'react';
import ClassicEditor from 'ckeditor5-custom-build/build/ckeditor';
import "../styles/Editor/Editor.css"

import { CKEditor } from '@ckeditor/ckeditor5-react'
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { Head } from '../Context';


const MyCkeditor = () => {
    const { editid } = useParams();
    const { docHead } = useContext(Head);

    // console.log(docHead);

    const [editData, setEditData] = useState();
    const [conHTML, setConHTML] = useState();
    const [isCon, setIsCon] = useState("Covert");


    useEffect(() => {
        fetch("http://localhost:3001/pagetoedit", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "accept": "application/json"
            },
            body: JSON.stringify({
                pageID: editid
            })
        })
            .then(res => res.json())
            .then(data => setEditData(data));
    }, [editid]);


    async function convertNow() {
        await fetch("http://localhost:3001/edit-to-conv", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "accept": "application/json"
            },
            body: JSON.stringify({
                head: editData.head,
                conHTML: conHTML
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
        <div className=' editorbody'>
            <div className="App">
                <div className=' edit-head'>
                    <h2>{docHead}</h2>
                    <button onClick={() => convertNow()}>{isCon}</button>
                </div>
                <CKEditor
                    editor={ClassicEditor}
                    data={editData?.html}
                    onReady={editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log('Editor is ready to use!', editor);
                    }}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setConHTML(data);
                        console.log({ event, editor, data });
                    }}
                    onBlur={(event, editor) => {
                        console.log('Blur.', editor);
                    }}
                    onFocus={(event, editor) => {
                        console.log('Focus.', editor);
                    }}
                />
            </div>
        </div>
    )
}

export default MyCkeditor;
