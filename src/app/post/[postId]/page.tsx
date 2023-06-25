import * as React from "react";

interface PostDetailProps {
  params: { postId: string };
}

const PostDetail: React.FC<PostDetailProps> = ({ params: { postId } }) => {
  return <div>Post Detail page: {postId}</div>;
};

export default PostDetail;
