import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
  name: String,
  end: String,
  proposals: [{name: String, voteCount: Number}],
  alreadyVoted: [String]
});

const Poll = mongoose.models.Poll || mongoose.model(
  'Poll',
  pollSchema,
  'polls'
);

console.log("connect.");
console.log(process.env.mongodburl);
const connect = async () => {
  await mongoose.connect(
    process.env.mongodburl,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
};

export { connect, Poll };
