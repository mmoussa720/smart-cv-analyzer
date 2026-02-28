import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";


const CvCard = ({cv}: { cv: CV }) => {
    const {fs} = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState("");
    useEffect(() => {
        const loadResume = async () => {
            const blob = await fs.read(cv.imagePath);
            if (!blob) return;
            let url = URL.createObjectURL(blob);
            setResumeUrl(url);
        }
        loadResume();
    });
    return (
        <Link to={`/resume/${cv.id}`} className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    {cv.companyName && <h2 className="!text-black font-bold break-works">
                        {cv.companyName}
                    </h2>}
                    {cv.jobTitle&&<h3 className="text-lg break-words text-gray-500">
                        {cv.jobTitle}
                    </h3>}
                    {!cv.companyName && !cv.jobTitle &&<h2 className="!text-black font-bold">Resume</h2>}
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={cv.feedback.overallScore}></ScoreCircle>
                </div>
            </div>
            {resumeUrl&&<div className="gradient-border animate-in fade-in duration-1000">
                <div className="w-full h-full">
                    <img src={resumeUrl} alt="resume"
                         className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"></img>
                </div>

            </div>
            }
        </Link>
    )
}

export default CvCard;