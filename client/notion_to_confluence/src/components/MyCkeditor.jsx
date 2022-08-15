import React from 'react';
import ClassicEditor from 'ckeditor5-custom-build/build/ckeditor';
import "../styles/Editor/Editor.css"
// import {Editor as ClassicEditor} from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';


const MyCkeditor = () => {
    const {editid} = useParams();
    
    const [editData,setEditData] = useState();
    const [conHTML, setConHTML] = useState();
    const [isCon, setIsCon] = useState();


    useEffect(()=>{
        fetch("http://localhost:3001/pagetoedit",{
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
                "accept" : "application/json"
            },
            body:JSON.stringify({
                pageID: editid
            })
        })
        .then(res=>res.json())
        .then(data=>setEditData(data));
    },[editid]);
    console.log(editData);


    async function convertNow(){
        await fetch("http://localhost:3001/edit-to-conv",{
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
                "accept" : "application/json"
            },
            body:JSON.stringify({
                head:editData.head,
                conHTML:conHTML
            })
        })
        .then(res=>res.json())
        .then(data => setIsCon(data));

        console.log(isCon);
    }


    // redux to get title and desc.
    return (
        <div className=' editorbody'>
            <div className="App">
                <div className=' edit-head'>
                    <h2>{editData?.head}</h2>
                    <button onClick={()=>convertNow()}>Convert</button>
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
