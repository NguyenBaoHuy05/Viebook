function CreatePost({ load }: { load: boolean }) {
  return <div className={`${!load && "hidden"} `}>Create post</div>;
}

export default CreatePost;
