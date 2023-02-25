import React from 'react';
import {Link} from "react-router-dom";

function Notfound(props) {

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <h2 className="font-bold text-4xl">Not Found!</h2>

      <Link to="/" replace>
        <div className="text-lg p-3 hover:bg-[gold]">
          Go to Home Page
        </div>
      </Link>
    </div>
  );
}

export default Notfound;