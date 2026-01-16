import React from "react";

// PUBLIC_INTERFACE
export default function PageHeader({ title, subtitle, right }) {
  /** Standard page header with optional right-side actions/summary. */
  return (
    <div className="ss-pageHeader">
      <div>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {right ? <div>{right}</div> : null}
    </div>
  );
}
