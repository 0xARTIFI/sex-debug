// import * as React from 'react';
// import { useLoaderData } from 'react-router-dom';

// export async function loader() {
//   await new Promise((r) => setTimeout(r, 500));
//   return 'I came from the About.tsx loader function!';
// }

export function Component() {
  // let data = useLoaderData() as string;

  return (
    <div>
      <h2>About</h2>
      <p>2121212</p>
      {/* <p>{data}</p> */}
    </div>
  );
}

// Component.displayName = 'AboutPage';
