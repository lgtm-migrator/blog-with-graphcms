import React from 'react';
import { useRouter } from 'next/dist/client/router';

// components
import { Author } from '../../components/molecules/Author';
import { Layout } from '../../components/templates/Layout';
import { Loader } from '../../components/molecules/Loader';
import { Comments } from '../../components/organisms/Comments';
import { PostDetail } from '../../components/organisms/PostDetail';
import { Categories } from '../../components/molecules/Categories';
import { PostWidget } from '../../components/molecules/PostWidget';
import { CommentForm } from '../../components/organisms/CommentForm';

// services
import { getPosts, getPostDetails } from '../../services/contentManagement';

const PostDetailsPage = ({ post }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <Loader />;
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="col-span-1 lg:col-span-8">
          <PostDetail post={post} />
          <Author author={post.author} />
          <CommentForm slug={post.slug} />
          <Comments slug={post.slug} />
        </div>

        <div className="col-span-1 lg:col-span-4">
          <div className="relative lg:sticky top-8">
            <PostWidget
              slug={post.slug}
              categories={post.categories.map((category) => category.slug)}
            />
            <Categories />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostDetailsPage;

export async function getStaticProps({ params }) {
  const result = await getPostDetails(params.slug);

  return {
    props: { post: result },
  };
}

export async function getStaticPaths() {
  const postsPath = await getPosts();
  return {
    paths: postsPath.map(({ node: { slug } }) => ({ params: { slug } })),
    fallback: true,
  };
}
