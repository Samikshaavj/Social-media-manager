import { Plus } from 'lucide-react';

const Posts = () => {
  return (
    <div className="text-gray-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Posts</h1>
        <p className="text-gray-400">Manage and track all your social media content.</p>
      </div>

      <div className="flex gap-2 mb-6 bg-[#111116] w-fit p-1 rounded-lg border border-[#1f1f2e]">
        <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-[#2d2d3f] text-white">All Posts</button>
        <button className="px-4 py-1.5 text-sm font-medium rounded-md text-gray-400 hover:text-white transition-colors">Drafts</button>
        <button className="px-4 py-1.5 text-sm font-medium rounded-md text-gray-400 hover:text-white transition-colors">Posted</button>
        <button className="px-4 py-1.5 text-sm font-medium rounded-md text-gray-400 hover:text-white transition-colors">Scheduled</button>
      </div>

      <div className="bg-[#111116] border border-[#1f1f2e] border-dashed rounded-xl h-96 flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 rounded-full bg-[#1a1a24] flex items-center justify-center mb-6">
          <Plus size={24} className="text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">No posts found</h2>
        <p className="text-gray-500 text-center max-w-sm mb-6">You don't have any posts in this category yet. Create one to get started.</p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors">
          Create Post
        </button>
      </div>
    </div>
  );
};

export default Posts;
