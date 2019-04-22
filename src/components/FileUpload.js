import React,{ Fragment, useState } from 'react'
import axios from 'axios';
import Message from './Message';
import Progress from './Progress';

const FileUpload = () => {

    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File okay');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setuploadPercentage] = useState(0);
    const [tempPath, setTempPath] = useState('');

    const onChange = e => {
        console.log(e.target.files)
        var tmppath = URL.createObjectURL(e.target.files[0]);
        setTempPath(tmppath);
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    }

    const onSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        console.log(formData.values());
        formData.append('file',file);
        console.log(formData.values());
        try{
            const res = await axios.post('/upload',formData, {
                headers:{
                    'Content-Type':'multipart/form-data'
                },
                onUploadProgress : ProgressEvent => {
                    setuploadPercentage(parseInt(Math.round((ProgressEvent.loaded * 100)/ ProgressEvent.total)))
                    //clear percentage
                    setTimeout(() => setuploadPercentage(0), 10000);
                }
                
                
            });

            const {fileName, filePath } = res.data;
            
            setMessage('FileUpload');
            setUploadedFile({ fileName, filePath});
        }catch(err){
            console.log(err);
            if(err.response.state === 500){
                setMessage('There was a problem with the server');
            
            }else{
       
                setMessage(err.response.msg);
            }
        }
    }
    return (
        <Fragment>
            {message ? <Message msg={message}/> : null}
            <form onSubmit={onSubmit}>
                <div className="custom-file">
                    <input type="file" className="custom-file-input" id="customFile" onChange={onChange} multiple="multiple"/>
                    <label className="custom-file-label" htmlFor="customFile">
                        {filename}
                    </label>
                </div>

                <Progress percentage={uploadPercentage}/>

                <input type="submit" value="Upload" className="btn btn-primary btn-block mt-4"/>
            </form>

            
            {tempPath ? <img src={tempPath} style={{width:'100%'}}/> : null}

            {uploadedFile ? <div className="row mt-5">
                <div className="col-md-6 m-auto">
                    <h3 className="text-cenver">
                        {uploadedFile.fileName}
                    </h3>
                    <img style={{width:'100%'}} src={uploadedFile.filePath} alt=""/>
                </div>
            </div> : null}
        </Fragment>  
    )
}

export default FileUpload

