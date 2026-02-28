import React, {type FormEvent, type SubmitEventHandler} from 'react';
import NavBar from "~/components/NavBar";
import {useState} from "react";
import FileUploader from "~/components/FileUploader";
import {useNavigate} from "react-router";
import {usePuterStore} from "~/lib/puter";
import {convertPdfToImage} from "~/lib/pdfToImage";
import {generateUUID} from "~/lib/utils";
import {AIResponseFormat, prepareInstructions} from "../../constants";

const Upload = () => {
  const {auth,isLoading,fs,ai,kv}=usePuterStore();
  const navigate=useNavigate();
  const [isProcessing,setIsProcessing]=useState(false);
  const  [statusTex,setStatusTex]=useState('');
  const [file,setFile]=useState<File|null>(null);
  const handleSubmit=async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const form=e.currentTarget.closest('form');
    if(!form)return ;
    const formData=new FormData(form);
    const companyName:FormDataEntryValue | null=formData.get('company-name') as string;
    const jobTitle:FormDataEntryValue | null=formData.get('job-title') as string;
    const jobDescription:FormDataEntryValue | null=formData.get('job-description') as string;
    if(!file)return;
    await handleAnalyze({companyName, jobTitle, jobDescription, file});
  }
  const handleFileSelect=(file:File|null)=>{
    setFile(file);
  }
  const handleAnalyze=async({companyName,jobTitle,jobDescription,file}:{companyName:string,jobTitle:string,jobDescription:string,file:File})=>{
    setIsProcessing(true);
    setStatusTex("Uploading file...");
    const uploadedFile=await fs.upload([file]);
    if(!uploadedFile)return setStatusTex('Error: Failed to upload file');
    setStatusTex('Converting to image...');
    const imageFile=await convertPdfToImage(file);
    if(!imageFile.file)return setStatusTex('Error: Failed to convert pdf to image');
    setStatusTex('Uploading image...');
    const uploadedImage=await fs.upload([imageFile.file]);
    if(!uploadedImage)return setStatusTex('Error: Failed to upload image');
    setStatusTex('Preparing data...');
    const uuid=generateUUID();
    const data={
      id:uuid,
      resumePath:uploadedFile.path,
      imagePath:uploadedImage.path,
      companyName,jobTitle,jobDescription,
      feedback:'',
    }
    await kv.set(`resume:${uuid}`,JSON.stringify(data))
    setStatusTex('Analyzing...');
    const feedback=await ai.feedback(
        uploadedFile.path,prepareInstructions({jobTitle, jobDescription, AIResponseFormat})
    );
    if(!feedback)return setStatusTex('Error:Failed to analyse resume');
    const feedbackText=typeof feedback?.message.content=='string'?feedback?.message.content:feedback?.message.content[0].text;
    data.feedback=JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`,JSON.stringify(data));
    setStatusTex('Analysis complete,redirecting...');
    console.log(data);
    navigate(`/resume/${uuid}`);
  }
  return (
<main className="bg-[url('/images/bg-main.svg')] bg-cover">
  <NavBar></NavBar>
  <section className="main-section">
    <div className={"page-heading"}>
      <h1>Smart feedback for your dream job</h1>
      {isProcessing?(
          <>
            <h2>{statusTex}</h2>
            <img src="/images/resume-scan.gif" className="w-full"/>
          </>
      ):(
          <h2>Drop your resume for an ATS score and improvement tips</h2>
      )}
      {!isProcessing&&(
          <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
            <div className={"form-div"}>
              <label htmlFor="Company-name">
                Company Name
              </label>
              <input type="text" name="company-name" placeholder="Company Name" id="company-name"/>
            </div>
            <div className={"form-div"}>
              <label htmlFor="job-title">
                Job Title
              </label>
              <input type="text" name="job-title" placeholder="Job Title" id="job-title"/>
            </div>
            <div className={"form-div"}>
              <label htmlFor="Job-description">
                Job Description
              </label>
              <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description"/>
            </div>
            <div className={"form-div"}>
              <label htmlFor="job-title">
                Upload Resume
              </label>
              <FileUploader onFileSelect={handleFileSelect}></FileUploader>
            </div>
            <button className="primary-button" type="submit">
              Analyze Resume
            </button>
          </form>
      )}
    </div>
  </section>
</main>
  );
};

export default Upload;