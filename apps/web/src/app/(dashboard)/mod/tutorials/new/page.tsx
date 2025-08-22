import PostComposer from '@/components/tutorials/tutorial-composer';

export const metadata = { title: 'New Post' };

export default function NewModPostPage() {
  return (
    <main className="mx-auto w-full max-w-10xl p-4 sm:p-6 md:p-8">
        <h1 className='flex items-center justify-center text-4xl mb-5'>Create Post</h1>
      <PostComposer />
    </main>
  );
}
