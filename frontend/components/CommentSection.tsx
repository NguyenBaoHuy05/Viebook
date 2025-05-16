import Comment from "./Comment";

function CommentSection({
  comments,
  refetchComments,
  setCommentCount,
}: {
  comments: any[];
  refetchComments: () => void;
  setCommentCount: (prop: any) => void;
}) {
  console.log(comments);
  return (
    <div className="w-full h-[75vh] overflow-y-auto">
      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <Comment
            key={index}
            comment={comment}
            refetchComments={refetchComments}
            setCommentCount={setCommentCount}
          />
        ))
      ) : (
        <div className="flex justify-center items-center p-8">
          <p className="text-gray-500 italic text-base">
            Chưa có bình luận nào.
          </p>
        </div>
      )}
    </div>
  );
}

export default CommentSection;
