import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";

const CvCard=({cv}:{cv:CV})=>{
    return (
        <Link to={`/resume/${cv.id}`} className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2"><h2 className="!text-black font-bold break-works">
                    {cv.companyName}
                    <h3 className="text-lg break-words text-gray-500">
                        {cv.jobTitle}
                    </h3>
                </h2></div>

            <div className="flex-shrink-0">
                <ScoreCircle score={100}></ScoreCircle>
            </div>
            </div>
            <div className="gradient-border animate-in fade-in duration-1000">
                <div className="w-full h-full">
                    <img src={cv.imagePath} alt="resume" className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"></img>
                </div>
            </div>
        </Link>
    )
}

export default CvCard;