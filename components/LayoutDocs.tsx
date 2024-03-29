import Link from "next/link";

import classes from "./LayoutDocs.module.scss";

export const LayoutDocs = (props: { children: React.ReactNode }) => {
  return (
    <div className={classes.root}>
      <h1>
        <Link href="/">PWA Playground</Link>
      </h1>
      {props.children}
    </div>
  );
};
