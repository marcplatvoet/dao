import { Bar } from 'react-chartjs-2';

export default function HorizontalBarChart({ poll }) {
  //console.log(poll);
  const names = poll.proposals.map(proposal => proposal.name);
  const totalVotes = poll.proposals.reduce((acc, proposal) => acc + proposal.voteCount, 0);
  const votesRaw = poll.proposals.map(proposal => proposal.voteCount);
  const votesPercentage = poll.proposals.map(proposal => (proposal.voteCount / totalVotes) * 100);
  const colors = ['#4C5270', '#F652A0', '#36EEE0', '#BCECE0'];
  const bordercolor = ['#4C527f', '#F652Af', '#36EEEf', '#BCECEf'];

  const data = {

   	labels: names,
   	datasets: [{
      label: '# of Votes',
   		data: votesRaw,
      backgroundColor: colors.slice(0, names.length),
      borderColor: bordercolor.slice(0, names.length),
      borderWidth: 1
   	}]
   };


   const options = {
     scales: {
       yAxes: [
         {
           ticks: {
             beginAtZero: true,
           },
         },
       ],
     },
   };

  console.log(data);
  return (
    <>
      <div className='row'>
        <div className='col-sm-12'>
          <h2 className='text-center'>{poll.name}</h2>
          <p className='text-center'>Current Poll result</p>
        </div>
      </div>
      <div className='row'>
        <div className='col-sm-6'>
          <ul>
            {poll.proposals.map((proposal, i) => (
              <li key={proposal._id}>{proposal.name}: {proposal.voteCount} votes ({votesPercentage[i].toFixed(2)}%)</li>
            ))}
          </ul>
        </div>
        <div className='col-sm-6'>
          <Bar data={data}  options={options} />
        </div>
      </div>
    </>
  );
}


//
//
// const data = {
//   labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//   datasets: [
//     {
//       label: '# of Votes',
//       data: [12, 19, 3, 5, 2, 3],
//       backgroundColor: [
//         'rgba(255, 99, 132, 0.2)',
//         'rgba(54, 162, 235, 0.2)',
//         'rgba(255, 206, 86, 0.2)',
//         'rgba(75, 192, 192, 0.2)',
//         'rgba(153, 102, 255, 0.2)',
//         'rgba(255, 159, 64, 0.2)',
//       ],
//       borderColor: [
//         'rgba(255, 99, 132, 1)',
//         'rgba(54, 162, 235, 1)',
//         'rgba(255, 206, 86, 1)',
//         'rgba(75, 192, 192, 1)',
//         'rgba(153, 102, 255, 1)',
//         'rgba(255, 159, 64, 1)',
//       ],
//       borderWidth: 1,
//     },
//   ],
// };
//
// const options = {
//   indexAxis: 'y',
//   // Elements options apply to all of the options unless overridden in a dataset
//   // In this case, we are setting the border of each horizontal bar to be 2px wide
//   elements: {
//     bar: {
//       borderWidth: 2,
//     },
//   },
//   responsive: true,
//   plugins: {
//     legend: {
//       position: 'right',
//     },
//     title: {
//       display: true,
//       text: 'Chart.js Horizontal Bar Chart',
//     },
//   },
// };
//
// const HorizontalBarChart = () => (
//   <>
//     <div className='header'>
//       <h1 className='title'>Horizontal Bar Chart</h1>
//       <div className='links'>
//         <a
//           className='btn btn-gh'
//           href='https://github.com/reactchartjs/react-chartjs-2/blob/master/example/src/charts/HorizontalBar.js'
//         >
//           Github Source
//         </a>
//       </div>
//     </div>
//     <Bar data={data} options={options} />
//   </>
// );
//
// export default HorizontalBarChart;
