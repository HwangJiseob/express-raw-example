const React = require('react')

const Index = ({ message }) => {

  const test = React.useCallback(()=>{
    console.log("??")
  })

  return (
    <>
      <a href={`/public`}>public</a>
      <p>{message}</p>
      <button
        onClick={(e)=>{console.log("??")}}
      >
        호호
      </button>
    </>
  );
}
 
module.exports = Index;