import React from 'react';

export default function Index({ message }) {
  return (
    <>
    <a href={`/public`}>public</a>
    <p>{message}</p>
    </>
  );
}