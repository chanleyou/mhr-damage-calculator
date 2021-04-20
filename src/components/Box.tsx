import React from "react";

// interface Props
//   extends React.DetailedHTMLProps<
//     React.HTMLAttributes<HTMLDivElement>,
//     HTMLDivElement
//   > {
//   header?: string;
// }

type Props = {
  children?: React.ReactNode;
  header?: string;
};

export default function Box({ children, header }: Props) {
  return (
    <div className="box">
      {header && <h1>{header}</h1>}
      {children}
    </div>
  );
}
