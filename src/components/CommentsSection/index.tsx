/* eslint-disable no-use-before-define */
import React, { useEffect } from 'react';

export function CommentsSection(): JSX.Element {
  useEffect(() => {
    setUpCommentsSection();
  }, []);
  const setUpCommentsSection = (): void => {
    const script = document.createElement('script');
    const anchor = document.getElementById('comments-uterances');
    script.setAttribute('src', 'https://utteranc.es/client.js');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', 'true');
    script.setAttribute('repo', 'GabrielDVpereira/ignite-challenge-05');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', 'github-dark');
    anchor.appendChild(script);
  };

  return <div id="comments-uterances" />;
}
