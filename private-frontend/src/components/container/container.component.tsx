import {PropsWithChildren} from "react";

export const Container = ({children}: PropsWithChildren<{}>) => {
  return (
    <div className={'w-11/12 mx-auto mt-4'}>
        {children}
    </div>
  );
};
