import classes from "./LayoutDocs.module.scss";

export const LayoutDocs = (props: { children: React.ReactNode }) => {
  return (
    <div className={classes.root}>
      <h1>PWA Playground</h1>
      {props.children}
    </div>
  );
};
