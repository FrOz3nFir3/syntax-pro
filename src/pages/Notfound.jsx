import React from "react";
import { Link } from "react-router-dom";

function Notfound(props) {
  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <h2 className="font-bold text-4xl">Not Found!</h2>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/" replace>
          <div className="btn-primary text-lg">Go to Home</div>
        </Link>
        <Link to="/playgrounds" replace>
          <div className="btn-secondary text-lg">View Playgrounds</div>
        </Link>
      </div>
    </div>
  );
}

export default Notfound;
