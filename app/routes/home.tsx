import type { Route } from "./+types/home";
import NavBar from "../components/NavBar"
import {cvs} from "../../constants";
import CvCard from "~/components/CvCard";
import {usePuterStore} from "~/lib/puter";
import {useLocation, useNavigate} from "react-router";
import {useEffect} from "react";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "SCA" },
    { name: "description", content: "A simple and smart resume analyzer" },
  ];
}

export default function Home() {
  const {isLoading, auth} = usePuterStore();
  const navigate=useNavigate();
  useEffect(()=>{
    if(!auth.isAuthenticated)navigate('/auth?next=/');
  },[auth.isAuthenticated])
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <section className="main-section">
      <div className="page-heading py-16">
        <NavBar />
        <h1>Track Your Applications & CV Ratings!</h1>
        <h2>Review your Submissions</h2>
      </div>
      {cvs.length>0&&(<div className="resumes-section">
        {cvs.map((resume) => (
            <div>
              <CvCard key={resume.id} cv={resume}></CvCard>
            </div>)
        )}
      </div>)}
    </section>


  </main>;
}
