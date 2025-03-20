import React from "react";
import { btechDepartments, Papers, Semester } from "../confid";

interface PaperCardProps {
  paper: Papers;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper }) => {
  const time = new Date(paper.createdAt);
  paper.createdAt = time.toDateString();

  const handleOpenPaper = (paper: Papers) => () => {
    window.location.href = `/paper/${paper.id}`;
  };

  return (
    <div className=" w-full md:w-1/3 p-4" onClick={handleOpenPaper(paper)}>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden relative">
        {paper?.examSolution && (
          <div className="absolute -top-2 -right-2 p-2 ">
            <p className="bg-green-600 w-fit px-2 text-white text-sm font-bold">
              Solution available
            </p>
          </div>
        )}
        <div className="p-5">
          <div className="flex flex-row justify-between">
            <p className="text-sm text-gray-500 font-medium">
              {
                btechDepartments.filter(
                  (department) => department.key === paper.department
                )[0].value
              }
            </p>
            <p className="text-sm text-gray-500 font-medium">
              {paper.createdAt || paper.updatedAt}
            </p>
          </div>
          <div className="w-full flex justify-center my-3">
            <iframe src={paper.examPdf} width="100%" height="200px"></iframe>
          </div>
          <h5 className="text-xl font-semibold text-gray-800 mb-2">
            {paper.examName}
          </h5>
          <p className="text-gray-600 text-sm mb-3">{paper.examDescription}</p>
          <div className="text-gray-700 text-sm">
            <div className="flex flex-row justify-self-auto w-full">
              <p className="font-normal">
                {
                  Semester.filter(
                    (semester) => semester.key === paper.examSemester
                  )[0].value
                }{" "}
                {paper.examTerm} paper by -{" "}
                <span className="text-gray-900 font-semibold">
                  {paper.examProfessor}
                </span>{" "}
                on{" "}
                <span className="text-sm text-gray-500 font-medium">
                  {paper.examDate}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperCard;
