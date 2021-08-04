import { useEffect, useState } from 'react';
import Head from 'next/head'
import axios from 'axios';
import getBlockchain from '../lib/ethereum.js';
import Poll from '../lib/bar.js';

export default function Home() {
  const [votefinished, setVoteFinished] = useState(false);
  const [alreadyvoted, setAlreadyVoted] = useState(false);
  const [amount, setAmount] = useState(undefined);
  const [web3, setWeb3] = useState(undefined);
  const [address, setAddress] = useState(undefined);
  const [poll, setPoll] = useState(undefined);
  const [selectedProposalId, setSelectedProposalId] = useState(undefined);
  const [message, setMessage] = useState({
    payload: 'loading',
    type: 'primary'
  });

  useEffect(() => {
    const init = async () => {
      try {
        const { web3, address, amount} = await getBlockchain();
        //const response = await axios.get('/api/get-latest-poll');
        // console.log("get response");
        const response = await axios.get('/api/get-latest-poll');
        // console.log(response);
        setWeb3(web3);
        setAddress(address);
        setAmount(amount);
        setPoll(response.data.poll);
        setSelectedProposalId(response.data.poll.proposals[0]._id);
        setMessage({payload: undefined, type: undefined});

        response.data.poll.alreadyVoted.map((post, index) => {
              if (post === address) {
                setAlreadyVoted(true);
                // console.log(alreadyvoted);
                // console.log("post:"+post+" address:"+address);
              }
        });

        if(response.data.poll.end > new Date().getTime())
            setVoteFinished(true);

        //console.log(response.data.poll);
        //console.log(response.data.poll.proposals[0]);
      } catch(e) {
        console.log(e);
        setVoteFinished(true);
        setAlreadyVoted(false);
        setMessage({
          payload: `Ooops... There was a problem when loading the app: ${e}`,
          type: 'danger'
        });
      }
    };
    init();
  }, []);


  async function updatePoll() {
    const value = await axios.get('/api/get-latest-poll');
    console.log("value:" + value.data.poll);
    setPoll(value.data.poll);
  }

  const createVote = async e => {
    e.preventDefault();
    // console.log(e.target.elements);
    // console.log(selectedProposalId);
    // console.log("amount:" + amount);
    const response = await axios.post('/api/create-vote', {
      address,
      pollId: poll._id,
      proposalId: selectedProposalId,
      amount: amount
    });
    // console.log(response);

    setAlreadyVoted(true);
    updatePoll(e);
  };

  return (
    <div className='container'>
      <Head>
        <title>Eat The Blocks DAO</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mb-4 mt-4 bg-light rounded-3">
        <div className="container-fluid py-5">
          <h1 className='display-5 fw-bold text-center'>Eat The Blocks Dao</h1>
          {alreadyvoted ? null : (
              <h5 className='display-10 fw-bold text-center'>You have {amount} of tokens to vote on your favorite subject!</h5>
          )}
        </div>
      </div>

      {typeof message.payload === 'undefined' ? null : (
        <div className='row'>
          <div className='col'>
            <div className={`mt-4 alert alert-${message.type}`} role="alert">
              {message.payload}
            </div>
          </div>
        </div>
      )}


      {typeof poll === 'undefined' ? null : (
        <Poll poll={poll} />
      )}

      {!votefinished || alreadyvoted || typeof poll === 'undefined'
        || typeof selectedProposalId === 'undefined' || amount == 0 ?
        <div>
          {!alreadyvoted ? null : (
              <div>
                <h5 className="card-title">
                  Your vote is counted, thanks for your input.
                </h5>
              </div>
          )}
          {votefinished ? null : (
              <div>
                <h5 className="card-title">
                  This vote is finished, thanks for your input.
                </h5>
              </div>
          )}
           {amount != 0 ? null : (
              <div>
                <h5 className="card-title">
                  You have no tokens to vote with.
                </h5>
              </div>
          )}
        </div> : (
        <div className='row'>
          <div className='col'>
            <div className="card">
              <h5 className="card-header">{poll.name}</h5>
              <div className="card-body">
                <h5 className="card-title">
                  Vote ends on {(new Date(parseInt(poll.end))).toLocaleString()}
                </h5>
                <p className="card-text">Vote for your favorite proposal:</p>
                <form onSubmit={e => createVote(e)}>
                  {poll.proposals.map(proposal => (
                    <div className="form-check" key={proposal._id}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name='proposal'
                        value={proposal._id}
                        id={proposal._id}
                        onChange={e => setSelectedProposalId(e.target.value)}
                        checked={proposal._id === selectedProposalId ? true : false}
                      />
                      <label className="form-check-label" htmlFor={proposal._id}>
                        {proposal.name}
                      </label>
                    </div>
                  ))}
                  <button type="submit" className="btn btn-primary mt-4">Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
