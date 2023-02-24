import { useState } from "react";

function Comments() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const onClickHandler = () => {
    setComments((comments) => [...comments, comment]);
  };
  const onChangeHandler = (e) => {
    setComment(e.target.value);
  };

  return (
    <div className="main-container">
      <h7>What our Customers have to say:</h7>
      {comments.map((text) => (
        <div className="comment-container">{text}</div>
      ))}
      <br></br>
      <div className="comment-flexbox">
        <h3 className="comment-text">Comment</h3>
        <textarea
          value={comment}
          input="name"
          onChange={onChangeHandler}
          className="input-box"
        />
        <button onClick={onClickHandler} className="comment-button">
          Submit
        </button>
      </div>
    </div>
  );
}

export default Comments;
