import React from "react";
import PropTypes from "prop-types";

function CommentForm({ onCommentSubmit }) {
  const [comment, setComment] = React.useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onCommentSubmit(comment);
    setComment("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Enter your comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

CommentForm.propTypes = {
  onCommentSubmit: PropTypes.func.isRequired,
};

function CommentList({ comments }) {
  return (
    <div>
      {comments.map((comment, index) => (
        <div key={index}>{comment}</div>
      ))}
    </div>
  );
}

CommentList.propTypes = {
  comments: PropTypes.array.isRequired,
};

function WebsiteComments() {
  const [comments, setComments] = React.useState([]);

  function addComment(comment) {
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
  }

  return (
    <div>
      <h1>Website Comments</h1>
      <CommentForm onCommentSubmit={addComment} />
      <CommentList comments={comments} />
    </div>
  );
}

export default WebsiteComments;
