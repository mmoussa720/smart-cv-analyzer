import type { Route } from "./+types/home";
import NavBar from "../components/NavBar"
import {cvs} from "../../constants";
import CvCard from "~/components/CvCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useLocation, useNavigate} from "react-router";
import {useEffect, useState} from "react";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "SCA" },
    { name: "description", content: "A simple and smart resume analyzer" },
  ];
}

export default function Home() {

  const {isLoading, auth,kv} = usePuterStore();
  const navigate=useNavigate();
  const [loadingResumes,setLoadingResumes]=useState<boolean>(false);
  const [resumes,setResumes]=useState<CV[]>([]);
  useEffect(() => {
    const loadResumes=async()=>{
      setLoadingResumes(true);
      const resumes=(await kv.list('resume:*',true)) as KVItem[];
      const parsedResumes=resumes.map((resume)=>(
          JSON.parse(resume.value) as CV
      ));
      setResumes(parsedResumes ||[]);
      console.log("parsed Resumes",resumes);
      setLoadingResumes(false);
    }
    loadResumes();
  }, []);
  useEffect(()=>{
    if(!auth.isAuthenticated)navigate('/auth?next=/');
  },[auth.isAuthenticated])
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <section className="main-section">
      <div className="page-heading py-16">
        <NavBar />
        <h1>Track Your Applications & CV Ratings!</h1>
        {!loadingResumes && resumes.length==0?(
            <h2>No resumes found.</h2>
        ):(
            <h2>Review your Submissions</h2>
        )}
      </div>
      {loadingResumes&&(
            <div className="flex felx-col items-center justify-center"><img src="/images/resume-scan-2.gif" className={"w-[200px]"}/></div>

      )}
      {!loadingResumes&&cvs.length>0&&(<div className="resumes-section">
        {resumes.map((resume) => (
            <div>
              <CvCard key={resume.id} cv={resume}></CvCard>
            </div>)
        )}
      </div>)}
      {!loadingResumes&&cvs.length==0&&(
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
            Upload Resume
            </Link>
          </div>
      )}
    </section>
  </main>;
}
