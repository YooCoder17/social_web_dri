import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { QueryClient, useQuery } from 'react-query';
import { dehydrate } from 'react-query/hydration';

import PostCard from '../components/PostCard';
import ProfileHeader from '../components/profile-page/ProfileHeader';
import ProfileTabs from '../components/profile-page/ProfileTabs';
import SocialContainer from '../components/profile-page/SocialContainer';
import NotFound from '../components/404';

import baseURL from '../utils/baseURL';

const getProfile = async (username) => {
  const { data } = await axios.get(`${baseURL}/api/profile/${username}`);
  return data;
};

const ProfilePage = ({ user }) => {
  const [currentTab, setCurrentTab] = useState('Posts');

  const router = useRouter();
  const { username } = router.query;

  const { data } = useQuery(['profiles', username], () => getProfile(username));

  if (!data) return <NotFound />;

  return (
    <>
      <ProfileHeader
        profile={data.profile}
        followers={data.followers}
        following={data.following}
        user={user}
      />
      <div className="container mx-auto px-8 md:px-16 pb-8">
        <ProfileTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <div className="grid gap-5 place-items-center grid-cols-auto-fit">
          {currentTab === 'Posts' ? (
            data.posts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <div className="w-full flex flex-wrap">
              <div className="w-full md:w-2/3">
                <div className="mb-6">
                  <h1 className="text-gray-800 mb-2 font-semibold text-lg">
                    Biography
                  </h1>
                  <p className="text-gray-600 text-md">{data.profile.bio}</p>
                </div>
                <div className="mb-6">
                  <h1 className="text-gray-800 mb-2 font-semibold text-lg">
                    Tech Stack
                  </h1>
                  <div className="flex flex-wrap gap-3">
                    {data.profile.techStack.map((techStack, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 text-gray-800 text-sm font-semibold rounded-md px-2 py-1"
                      >
                        {techStack}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3">
                <h1 className="text-gray-800 mb-2 font-semibold text-lg">
                  Social Profiles
                </h1>
                <SocialContainer social={data.profile?.social} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const { username } = ctx.params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['profiles', username], () =>
    getProfile(username)
  );
  return { props: { dehydratedState: dehydrate(queryClient) } };
}

export default ProfilePage;
