import React from "react";

function Footer() {
  return (
    <div className="flex justify-center items-center py-4 px-6 bg-purple-100">
      <p>&copy; {new Date().getFullYear()} FloDiary. All rights reserved.</p>
    </div>
  );
}

export default Footer;
