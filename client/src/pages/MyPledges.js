import React, { useEffect, useState } from 'react';
import './assets/css/mypledges.css';
import { Icon } from '@iconify/react';
import { useQuery, useMutation } from '@apollo/client';
import Confetti from 'react-dom-confetti';

import { QUERY_ME } from '../utils/queries';
import { REMOVE_PLEDGE } from '../utils/mutations';
import { Link } from 'react-router-dom';
import {
  removePledgeId,
  getCompletedPledgeIds,
  completePledgeIds,
} from '../utils/localStorage';

const MyPledges = () => {
  const { data, loading } = useQuery(QUERY_ME);
  const myPledges = data?.me.pledgeData || [];

  const [completedPledgeIds, setCompletedPledgeIds] = useState(
    getCompletedPledgeIds()
  );

  const [active, setActive] = useState(false);

  const config = {
    angle: 180,
    spread: 360,
    startVelocity: 40,
    elementCount: 100,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: '10px',
    height: '10px',
    perspective: '1000px',
    colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
  };

  useEffect(() => {
    return () => completePledgeIds(completedPledgeIds);
  });

  const handleCompletedPledge = async (pledgeId) => {
    const markComplete = myPledges.find((pledge) => pledge._id === pledgeId);

    try {
      setCompletedPledgeIds([...completedPledgeIds, markComplete._id]);
      setActive(true);
      setTimeout(() => setActive(false), 1000);
    } catch (err) {
      console.error(err);
    }
  };

  const [removePledge] = useMutation(REMOVE_PLEDGE, {
    update(cache) {
      try {
        // update me array's cache
        const { me } = cache.readQuery({ query: QUERY_ME });
        cache.writeQuery({
          query: QUERY_ME,
          data: { me: { ...me, pledgeData: [...me.pledgeData] } },
        });
      } catch (e) {
        console.warn('Pledge deleted by user!');
      }
    },
    refetchQueries: [{ query: QUERY_ME }],
  });

  // create function that accepts the pledges's mongo _id value as param and deletes the pledge from the database
  const handleDeletePledge = async (pledgeId) => {
    try {
      await removePledge({
        variables: { pledgeData: pledgeId },
      });
      // upon success remove pledgeId from localStorage
      removePledgeId(pledgeId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <div className="my-pledges-main">
      <h2>
        {myPledges.length ? 'My Pledges' : "You haven't saved any pledges yet!"}
      </h2>
      <div className="confetti-div">
        <Confetti active={active} config={config} />
      </div>
      <div className="my-pledges">
        {myPledges.map((pledge) => (
          <div className="my-pledge" key={pledge._id}>
            <span
              className="delete"
              onClick={() => handleDeletePledge(pledge._id)}
            >
              {' '}
              <Icon
                icon="akar-icons:circle-x-fill"
                color="#243B4A"
                width="20"
                height="20"
              />
            </span>
            <h3 className="my-pledge-title">
              <Icon icon={pledge.icon} color="#243B4A" width="25" height="25" />
              {pledge.action}
            </h3>
            <p>{pledge.description}</p>
            <a href={pledge.link} target="_blank" rel="noopener noreferrer">
              Learn more about this action
            </a>
            <button
              className="my-pledge-btn"
              onClick={() => handleCompletedPledge(pledge._id)}
            >
              {completedPledgeIds?.some(
                (completedPledgeId) => completedPledgeId === pledge._id
              )
                ? 'Complete!'
                : 'Mark as Complete'}
            </button>
          </div>
        ))}
      </div>
      {myPledges.length ? (
        <div className="btn-link">
          <Link to="/myfootprint">
            <button>Add More Pledges</button>
          </Link>
        </div>
      ) : (
        <div className="add-btn">
          <Link to="/myfootprint">
            <button>Add Pledges</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyPledges;
